"""
Security-Middlewares: Headers, HTTPS-Erzwingung, Request-ID, Login-Brute-Force-Schutz.
"""
import secrets
import time
from collections import defaultdict
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from .config import get_settings
from .logging import get_logger

settings = get_settings()
logger = get_logger("middleware")


# ── Security Headers ───────────────────────────────────────────────────────────

SECURITY_HEADERS = {
    # Kein Framing der Seite (Clickjacking-Schutz)
    "X-Frame-Options": "DENY",
    # Browser soll Content-Type nicht raten (MIME-Sniffing)
    "X-Content-Type-Options": "nosniff",
    # Keine Referrer-Daten an externe Seiten
    "Referrer-Policy": "strict-origin-when-cross-origin",
    # Nur HTTPS für 1 Jahr (inkl. Subdomains)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    # Minimale Berechtigungen für Browser-Features
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    # Content Security Policy: nur eigene Quellen erlaubt
    "Content-Security-Policy": (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "font-src 'self'; "
        "connect-src 'self' https://*.supabase.co; "
        "frame-ancestors 'none';"
    ),
    # XSS-Filter (Legacy-Browser)
    "X-XSS-Protection": "1; mode=block",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        for header, value in SECURITY_HEADERS.items():
            response.headers[header] = value
        # Server-Header entfernen (gibt keine Info über Stack preis)
        response.headers.pop("server", None)
        return response


# ── Request-ID für Tracing ────────────────────────────────────────────────────

class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Jede Anfrage bekommt eine eindeutige ID.
    Wird in Logs und Response-Headers gesetzt für Debugging.
    """
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = request.headers.get("X-Request-ID") or secrets.token_hex(8)
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


# ── HTTPS erzwingen ───────────────────────────────────────────────────────────

class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    """In Production: HTTP-Anfragen werden auf HTTPS umgeleitet."""
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if not settings.is_production:
            return await call_next(request)

        # Cloud Run leitet HTTPS-Traffic weiter, X-Forwarded-Proto prüfen
        forwarded_proto = request.headers.get("X-Forwarded-Proto", "https")
        if forwarded_proto == "http":
            https_url = str(request.url).replace("http://", "https://", 1)
            return Response(
                status_code=301,
                headers={"Location": https_url},
            )
        return await call_next(request)


# ── Brute-Force-Schutz für Login ──────────────────────────────────────────────

class LoginAttemptTracker:
    """
    In-Memory-Tracker für fehlgeschlagene Login-Versuche.
    Nach 5 Fehlversuchen wird CAPTCHA-Pflicht signalisiert.
    Für Multi-Instance-Deployments: Redis verwenden.
    """
    def __init__(self, max_attempts: int = 5, window_seconds: int = 300):
        self._attempts: dict[str, list[float]] = defaultdict(list)
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds

    def _clean(self, key: str) -> None:
        now = time.time()
        self._attempts[key] = [
            t for t in self._attempts[key]
            if now - t < self.window_seconds
        ]

    def record_failure(self, identifier: str) -> int:
        """Gibt die aktuelle Anzahl Fehlversuche zurück."""
        self._clean(identifier)
        self._attempts[identifier].append(time.time())
        return len(self._attempts[identifier])

    def get_attempts(self, identifier: str) -> int:
        self._clean(identifier)
        return len(self._attempts[identifier])

    def reset(self, identifier: str) -> None:
        self._attempts.pop(identifier, None)

    def requires_captcha(self, identifier: str) -> bool:
        return self.get_attempts(identifier) >= self.max_attempts


login_tracker = LoginAttemptTracker()


# ── Logging Middleware ────────────────────────────────────────────────────────

class AccessLogMiddleware(BaseHTTPMiddleware):
    """Strukturiertes Access-Logging mit Timing und User-ID."""
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = round((time.perf_counter() - start) * 1000, 2)

        # User-ID aus JWT-State (gesetzt von Security-Dependency, wenn vorhanden)
        user_id = getattr(request.state, "user_id", "anonymous")

        logger.info(
            "http_request",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=duration_ms,
            user_id=user_id,
            request_id=getattr(request.state, "request_id", "-"),
            # IP nur loggen, nicht an Client zurückgeben
            client_ip=request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown"),
        )

        # Security Events: 401/403 explizit loggen
        if response.status_code in (401, 403):
            logger.warning(
                "security_event",
                event_type="auth_failure",
                path=request.url.path,
                status=response.status_code,
                user_id=user_id,
            )

        return response
