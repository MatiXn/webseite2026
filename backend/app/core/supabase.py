from supabase import create_client, Client
from .config import get_settings
from functools import lru_cache

_settings = get_settings()


@lru_cache
def get_supabase() -> Client:
    # Service-role client: volle DB-Rechte, nur server-side verwenden
    return create_client(_settings.supabase_url, _settings.supabase_service_role_key)


@lru_cache
def get_supabase_anon() -> Client:
    # Anon client: für Auth-Operationen im Namen des Users
    return create_client(_settings.supabase_url, _settings.supabase_anon_key)
