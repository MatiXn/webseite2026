"""
JWT-Validierung, RBAC und Auth-Hilfsfunktionen.
Supabase signiert JWTs mit HS256 + dem JWT_SECRET aus dem Dashboard.
"""
from datetime import datetime, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from .config import get_settings

settings = get_settings()

# HTTPBearer liest den Authorization: Bearer <token> Header
_bearer = HTTPBearer(auto_error=True)

# Rollen-Hierarchie: höhere Zahl = mehr Rechte
ROLE_LEVELS = {
    "candidate": 0,
    "recruiter": 1,
    "team_lead": 2,
    "admin": 3,
}


class TokenPayload:
    def __init__(self, sub: str, email: str, role: str, exp: int):
        self.user_id = sub
        self.email = email
        self.role = role
        self.exp = exp


def _verify_jwt(token: str) -> TokenPayload:
    """
    Verifiziert Supabase JWT:
    - Signatur mit SUPABASE_JWT_SECRET
    - Ablaufzeit (exp)
    - Audience = 'authenticated'
    """
    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
            options={"verify_exp": True},
        )
    except JWTError as e:
        # Kein Detail über den Fehler an den Client — verhindert Oracle-Angriffe
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e

    # Session Timeout: zusätzliche Prüfung über Supabase exp hinaus
    exp = payload.get("exp", 0)
    if datetime.now(tz=timezone.utc).timestamp() > exp:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")

    # Rolle aus app_metadata (Supabase setzt diese server-side)
    role = payload.get("app_metadata", {}).get("role", "candidate")

    return TokenPayload(
        sub=payload["sub"],
        email=payload.get("email", ""),
        role=role,
        exp=exp,
    )


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(_bearer)],
) -> TokenPayload:
    return _verify_jwt(credentials.credentials)


def require_role(minimum_role: str):
    """
    Dependency-Factory für RBAC.
    Verwendung: Depends(require_role("recruiter"))
    """
    def _check(user: Annotated[TokenPayload, Depends(get_current_user)]) -> TokenPayload:
        user_level = ROLE_LEVELS.get(user.role, -1)
        required_level = ROLE_LEVELS.get(minimum_role, 99)
        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return user
    return _check


# Convenience-Aliases
CurrentUser = Annotated[TokenPayload, Depends(get_current_user)]
RecruiterUser = Annotated[TokenPayload, Depends(require_role("recruiter"))]
AdminUser = Annotated[TokenPayload, Depends(require_role("admin"))]
