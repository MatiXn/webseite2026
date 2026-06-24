"""
Strukturiertes JSON-Logging mit structlog.
Alle Logs enthalten: timestamp, level, user_id, event, und freie Felder.
Sensible Felder (password, token, key) werden automatisch maskiert.
"""
import logging
import sys
from typing import Any

import structlog
from structlog.types import EventDict

SENSITIVE_KEYS = frozenset(
    {"password", "token", "secret", "key", "authorization", "cookie", "cv_raw"}
)


def _mask_sensitive(logger: Any, method: str, event_dict: EventDict) -> EventDict:
    """Processor: maskiert sensible Felder in jedem Log-Eintrag."""
    for key in list(event_dict.keys()):
        if any(s in key.lower() for s in SENSITIVE_KEYS):
            event_dict[key] = "***REDACTED***"
    return event_dict


def _add_severity(logger: Any, method: str, event_dict: EventDict) -> EventDict:
    """Google Cloud Logging erwartet 'severity' statt 'level'."""
    event_dict["severity"] = event_dict.pop("level", method).upper()
    return event_dict


def setup_logging(json_logs: bool = True) -> None:
    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        _mask_sensitive,
    ]

    if json_logs:
        shared_processors.append(_add_severity)
        renderer = structlog.processors.JSONRenderer()
    else:
        renderer = structlog.dev.ConsoleRenderer()

    structlog.configure(
        processors=shared_processors + [
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        foreign_pre_chain=shared_processors,
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            renderer,
        ],
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)

    # Uvicorn-Logger auf dasselbe Format bringen
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"):
        logging.getLogger(name).handlers.clear()
        logging.getLogger(name).propagate = True


def get_logger(name: str = "phe"):
    return structlog.get_logger(name)


# Audit-Trail: eigener Logger für Kandidaten-Änderungen
audit_logger = structlog.get_logger("audit")


def audit_log(
    action: str,
    user_id: str,
    resource: str,
    resource_id: str,
    details: dict | None = None,
) -> None:
    """
    Schreibt einen unveränderlichen Audit-Eintrag.
    action: z.B. 'candidate.update', 'candidate.delete', 'login.failed'
    """
    audit_logger.info(
        "audit_event",
        action=action,
        user_id=user_id,
        resource=resource,
        resource_id=resource_id,
        details=details or {},
    )
