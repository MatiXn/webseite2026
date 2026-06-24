"""
Sichere Datei-Upload-Validierung.
Prüft MIME-Type aus Dateiinhalt (nicht Dateiendung!), Größe und Dateiname.
"""
import os
import re

import magic  # python-magic: liest echte Datei-Magic-Bytes
from fastapi import HTTPException, UploadFile, status

from .config import get_settings
from .logging import get_logger

settings = get_settings()
logger = get_logger("file_validation")

# Erlaubte MIME-Types und deren max. Größe
ALLOWED_TYPES: dict[str, str] = {
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
}

# Dateiname: nur alphanumerisch, Bindestrich, Unterstrich, Punkt
SAFE_FILENAME_RE = re.compile(r"^[\w\-. ]+$")


async def validate_upload(file: UploadFile) -> bytes:
    """
    Liest und validiert eine hochgeladene Datei vollständig.
    Gibt die Datei-Bytes zurück (für direktes Weiterleiten an Supabase Storage).

    Prüfungen:
    1. Dateigröße (max. 10 MB)
    2. Dateiname (keine Path-Traversal-Angriffe)
    3. MIME-Type aus echten Datei-Bytes (nicht Dateiendung)
    """
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Filename required")

    # 1. Dateiname säubern — verhindert Path Traversal (../../etc/passwd)
    basename = os.path.basename(file.filename)
    if not SAFE_FILENAME_RE.match(basename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid filename. Only letters, numbers, hyphens, and dots allowed.",
        )

    # 2. Datei in Chunks lesen — verhindert RAM-Erschöpfung bei großen Dateien
    max_bytes = settings.max_upload_bytes
    chunks: list[bytes] = []
    total = 0

    async for chunk in file.stream():  # type: ignore[attr-defined]
        total += len(chunk)
        if total > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size: {settings.max_upload_size_mb} MB",
            )
        chunks.append(chunk)

    content = b"".join(chunks)

    if len(content) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")

    # 3. MIME-Type aus echten Bytes prüfen (nicht vertrauenswürdigem Content-Type Header)
    detected_mime = magic.from_buffer(content[:2048], mime=True)

    if detected_mime not in ALLOWED_TYPES:
        logger.warning(
            "file_rejected",
            filename=basename,
            detected_mime=detected_mime,
        )
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF and Word documents (.pdf, .doc, .docx) are allowed",
        )

    logger.info("file_accepted", filename=basename, mime=detected_mime, size_bytes=len(content))
    return content
