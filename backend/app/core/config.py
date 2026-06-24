from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # App
    app_env: str = "development"
    app_secret_key: str
    debug: bool = False

    # CORS — komma-getrennte Liste
    allowed_origins: str = "http://localhost:3000"

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    supabase_jwt_secret: str

    # Rate Limiting
    redis_url: str = ""
    rate_limit_per_user: str = "100/minute"
    rate_limit_global: str = "1000/minute"

    # Sentry
    sentry_dsn: str = ""

    # File Upload
    max_upload_size_mb: int = 10
    upload_bucket: str = "candidate-documents"

    # Session
    session_timeout_minutes: int = 30

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
