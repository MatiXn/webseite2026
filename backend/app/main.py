"""
PHE ATS — FastAPI Backend (Security-Hardened)
Alle Security-Maßnahmen sind hier zentralisiert und kommentiert.
"""
import secrets as sec

import sentry_sdk
from fastapi import FastAPI, HTTPException, Request, UploadFile, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.middleware.trustedhost import TrustedHostMiddleware

from .core.config import get_settings
from .core.file_validation import validate_upload
from .core.logging import audit_log, get_logger, setup_logging
from .core.middleware import (
    AccessLogMiddleware,
    HTTPSRedirectMiddleware,
    RequestIDMiddleware,
    SecurityHeadersMiddleware,
)
from .core.security import CurrentUser, RecruiterUser
from .models.candidate import CandidateCreate, CandidateUpdate

# ── Setup ──────────────────────────────────────────────────────────────────────

settings = get_settings()

# Logging initialisieren (JSON in Production, Console in Development)
setup_logging(json_logs=settings.is_production)
logger = get_logger("main")


def _sanitize_sentry_event(event: dict, hint: dict) -> dict:
    """Entfernt sensible Daten bevor Events an Sentry gesendet werden."""
    if "request" in event:
        headers = event["request"].get("headers", {})
        for key in list(headers.keys()):
            if key.lower() in ("authorization", "cookie", "x-api-key"):
                headers[key] = "[Filtered]"
        data = event["request"].get("data", {})
        if isinstance(data, dict):
            for key in list(data.keys()):
                if "password" in key.lower() or "secret" in key.lower():
                    data[key] = "[Filtered]"
    return event


# Sentry: nur wenn DSN konfiguriert
if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.app_env,
        traces_sample_rate=0.1,
        send_default_pii=False,          # Keine PII in Sentry
        before_send=_sanitize_sentry_event,
    )

# ── Rate Limiter ───────────────────────────────────────────────────────────────

limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=settings.redis_url or "memory://",
    default_limits=["1000/minute"],      # Global-Limit
)

# ── FastAPI App ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="PHE ATS API",
    version="1.0.0",
    # Swagger/ReDoc in Production deaktivieren (verhindert API-Reconnaissance)
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    openapi_url="/openapi.json" if not settings.is_production else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Middleware-Stack (Reihenfolge wichtig: first added = last executed) ────────

# HTTPS-Redirect zuerst — bevor irgendwas anderes passiert
app.add_middleware(HTTPSRedirectMiddleware)

# Nur bekannte Hosts — verhindert Host-Header-Injection
if settings.is_production:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["api.phe-perm.de", "*.run.app"],
    )

# CORS: NUR explizit erlaubte Origins, nie "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    max_age=600,
)

# Security Headers auf jede Response (CSP, HSTS, X-Frame-Options etc.)
app.add_middleware(SecurityHeadersMiddleware)

# Request-ID für End-to-End-Tracing
app.add_middleware(RequestIDMiddleware)

# Strukturiertes JSON Access-Logging
app.add_middleware(AccessLogMiddleware)


# ── Exception Handlers ─────────────────────────────────────────────────────────

@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    """Validierungsfehler mit Details — kein interner Stack-Trace."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": "Validation failed", "detail": exc.errors()},
    )


@app.exception_handler(HTTPException)
async def http_handler(request: Request, exc: HTTPException):
    """Konsistentes Error-Format. Bei 5xx: keine internen Details."""
    detail = exc.detail if exc.status_code < 500 else "Internal server error"
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": detail, "status": exc.status_code},
        headers=getattr(exc, "headers", None),
    )


@app.exception_handler(Exception)
async def unhandled_handler(request: Request, exc: Exception):
    """Ungefangene Exceptions: loggen, aber KEIN Stack-Trace an Client."""
    logger.error(
        "unhandled_exception",
        exc_type=type(exc).__name__,
        path=request.url.path,
        request_id=getattr(request.state, "request_id", "-"),
    )
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "status": 500},
    )


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health():
    """Health-Check für Cloud Run — keine Auth erforderlich."""
    return {"status": "ok", "env": settings.app_env}


@app.get("/api/v1/me", tags=["Auth"])
@limiter.limit("60/minute")
async def get_me(request: Request, user: CurrentUser):
    """Gibt den aktuellen User zurück. Validiert JWT implizit via Dependency."""
    return {"user_id": user.user_id, "email": user.email, "role": user.role}


@app.post("/api/v1/candidates", status_code=201, tags=["Kandidaten"])
@limiter.limit("100/minute")
async def create_candidate(
    request: Request,
    data: CandidateCreate,
    user: RecruiterUser,               # RBAC: mind. Recruiter-Rolle
):
    """
    Neuen Kandidaten anlegen.
    Pydantic validiert alle Felder (Längen, Regex, E.164-Telefon etc.)
    Supabase-Client nutzt Parameterized Queries — kein SQL Injection möglich.
    """
    from .core.supabase import get_supabase
    db = get_supabase()

    result = db.table("candidates").insert({
        **data.model_dump(exclude_none=True),
        "created_by": user.user_id,
    }).execute()

    candidate_id = result.data[0]["id"] if result.data else "unknown"

    audit_log(
        action="candidate.create",
        user_id=user.user_id,
        resource="candidate",
        resource_id=candidate_id,
        details={"email": data.email, "category": data.category},
    )

    return {"id": candidate_id, "status": "created"}


@app.patch("/api/v1/candidates/{candidate_id}", tags=["Kandidaten"])
@limiter.limit("100/minute")
async def update_candidate(
    request: Request,
    candidate_id: str,
    data: CandidateUpdate,
    user: RecruiterUser,
):
    from .core.supabase import get_supabase
    db = get_supabase()

    updates = data.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    db.table("candidates").update(updates).eq("id", candidate_id).execute()

    audit_log(
        action="candidate.update",
        user_id=user.user_id,
        resource="candidate",
        resource_id=candidate_id,
        details={"fields_updated": list(updates.keys())},
    )

    return {"id": candidate_id, "status": "updated"}


@app.delete("/api/v1/candidates/{candidate_id}", tags=["Kandidaten"])
@limiter.limit("20/minute")            # Strengeres Limit für destruktive Ops
async def delete_candidate(
    request: Request,
    candidate_id: str,
    user: RecruiterUser,
):
    from .core.supabase import get_supabase
    db = get_supabase()

    db.table("candidates").delete().eq("id", candidate_id).execute()

    audit_log(
        action="candidate.delete",
        user_id=user.user_id,
        resource="candidate",
        resource_id=candidate_id,
    )

    return {"status": "deleted"}


@app.post("/api/v1/candidates/{candidate_id}/documents", tags=["Dokumente"])
@limiter.limit("10/minute")            # Upload-Rate streng begrenzen
async def upload_document(
    request: Request,
    candidate_id: str,
    file: UploadFile,
    user: RecruiterUser,
):
    """
    CV/Dokument-Upload:
    - MIME-Type aus echten Datei-Bytes (nicht Dateiendung — nicht spoofbar)
    - Max. 10 MB, nur PDF/Word
    - Zufälliger Storage-Pfad verhindert Enumeration
    - Dateiname sanitized (kein Path Traversal)
    """
    content = await validate_upload(file)

    from .core.supabase import get_supabase
    db = get_supabase()

    storage_path = f"{candidate_id}/{sec.token_hex(16)}/{file.filename}"

    db.storage.from_(settings.upload_bucket).upload(
        path=storage_path,
        file=content,
        file_options={"content-type": file.content_type or "application/octet-stream"},
    )

    audit_log(
        action="document.upload",
        user_id=user.user_id,
        resource="candidate",
        resource_id=candidate_id,
        details={"filename": file.filename, "size_bytes": len(content)},
    )

    return {"status": "uploaded", "path": storage_path}
