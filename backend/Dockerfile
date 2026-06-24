# ── Build Stage ────────────────────────────────────────────────────────────────
# Slim-Image: kein apt-cache, keine Build-Tools in der finalen Image
FROM python:3.12-slim AS builder

WORKDIR /app

# libmagic für python-magic (MIME-Type-Erkennung)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ── Runtime Stage ──────────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# libmagic auch im Runtime-Image
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Nur installierte Packages aus Build-Stage kopieren
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# App-Code kopieren
COPY app/ ./app/

# Kein Root: eigener non-root User für Container-Sicherheit
RUN useradd --no-create-home --shell /bin/false appuser
USER appuser

# Cloud Run setzt PORT automatisch (default 8080)
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8080

# Graceful Shutdown: --timeout-graceful-shutdown für laufende Requests
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2 --timeout-graceful-shutdown 10 --no-access-log"]
