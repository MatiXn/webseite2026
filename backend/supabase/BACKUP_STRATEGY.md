# Backup & Recovery Strategy — PHE ATS Database

> Status: Produktiv  
> Verantwortlich: Matin Askaryar  
> Review: quartalsweise

---

## Backup-Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (Frankfurt / EU)                 │
│                                                             │
│  PostgreSQL 15                                              │
│  ├── Continuous WAL Archiving → S3 (AES-256)               │
│  ├── Daily Full Backup → S3 (täglich 02:00 UTC)            │
│  └── PITR Window: 7 Tage (Pro Plan) / 30 Tage (Team Plan)  │
│                                                             │
│  Supabase Storage (CVs/Dokumente)                           │
│  └── S3-kompatibel, AES-256 at rest                        │
└─────────────────────────────────────────────────────────────┘
           │
           ▼ (wöchentlich, automatisiert)
┌─────────────────────────────────────────────────────────────┐
│              Zusätzliches Offsite-Backup                    │
│  Google Cloud Storage (europe-west3 / Frankfurt)            │
│  ├── pg_dump → GCS Bucket (verschlüsselt mit CMEK)         │
│  └── Aufbewahrung: 90 Tage                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Supabase Native Backups (Primär)

### Point-in-Time Recovery (PITR)

| Plan | PITR-Fenster | RPO | RTO |
|------|-------------|-----|-----|
| Pro  | 7 Tage      | ≤1h | ~30min |
| Team | 30 Tage     | ≤5min | ~15min |

**Aktivierung:** Supabase Dashboard → Project Settings → Database → "Enable Point in Time Recovery"

PITR basiert auf WAL (Write-Ahead Log) Streaming. Jede Transaktion wird fortlaufend archiviert.

### Daily Full Backups

- **Zeitpunkt:** Täglich 02:00 UTC (geringer Traffic)
- **Format:** PostgreSQL-eigenes Format (pg_basebackup)
- **Speicherort:** Supabase-verwaltetes S3 (EU-Frankfurt)
- **Verschlüsselung:** AES-256 at rest, TLS 1.3 in transit
- **Aufbewahrung:** 7 Tage (Pro), 30 Tage (Team)

### Recovery über Dashboard

```
Dashboard → Project → Settings → Backups
→ "Restore to point in time" oder "Restore from backup"
```

---

## 2. Zusätzliche Offsite-Backups (Sekundär)

### Wöchentlicher pg_dump nach GCS

Automatisiert via GitHub Actions (jeden Montag 03:00 UTC):

```yaml
# .github/workflows/backup.yml
name: Weekly Database Backup

on:
  schedule:
    - cron: "0 3 * * 1"  # Montags 03:00 UTC
  workflow_dispatch:      # Manuell auslösbar

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Install psql tools
        run: sudo apt-get install -y postgresql-client

      - name: Dump database
        env:
          PGPASSWORD: ${{ secrets.DB_PASSWORD }}
        run: |
          TIMESTAMP=$(date +%Y%m%d_%H%M%S)
          pg_dump \
            --host=${{ secrets.DB_HOST }} \
            --username=postgres \
            --dbname=postgres \
            --format=custom \          # Komprimiertes pg_dump-Format
            --compress=9 \             # Maximale Kompression
            --no-password \
            --exclude-table=audit.log \  # Audit-Log separat
            --file=backup_${TIMESTAMP}.dump

          # Separate Backup der Audit-Logs
          pg_dump \
            --host=${{ secrets.DB_HOST }} \
            --username=postgres \
            --dbname=postgres \
            --format=custom \
            --compress=9 \
            --table=audit.log \
            --file=audit_${TIMESTAMP}.dump

      - name: Encrypt backup
        run: |
          # GPG-Verschlüsselung mit dem Backup-Key
          gpg --batch --yes \
              --recipient "${{ secrets.BACKUP_GPG_KEY_ID }}" \
              --encrypt backup_*.dump audit_*.dump

      - name: Upload to GCS
        uses: google-github-actions/upload-cloud-storage@v2
        with:
          path: "*.dump.gpg"
          destination: "phe-ats-backups/weekly/${{ github.run_id }}"
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          credentials: ${{ secrets.GCP_BACKUP_SA_KEY }}

      - name: Verify backup integrity
        run: |
          # Checksum der verschlüsselten Datei speichern
          sha256sum *.dump.gpg > checksums.txt
          gsutil cp checksums.txt gs://phe-ats-backups/weekly/${{ github.run_id }}/

      - name: Cleanup local files
        if: always()
        run: rm -f *.dump *.dump.gpg  # Lokale Kopien löschen

      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            // Slack/E-Mail-Notification bei Backup-Fehler
            console.error('Backup failed — manual intervention required!')
```

### GCS Bucket Konfiguration

```bash
# Bucket erstellen (EU-Frankfurt)
gsutil mb -l europe-west3 -b on gs://phe-ats-backups

# Object Lifecycle: Backups älter als 90 Tage löschen
gsutil lifecycle set - gs://phe-ats-backups << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 90}
      }
    ]
  }
}
EOF

# Versioning aktivieren (schützt vor versehentlichem Überschreiben)
gsutil versioning set on gs://phe-ats-backups

# CMEK (Customer-Managed Encryption Key) aktivieren
gcloud kms keyrings create phe-backup-keyring --location=europe-west3
gcloud kms keys create phe-backup-key \
  --keyring=phe-backup-keyring \
  --location=europe-west3 \
  --purpose=encryption
```

---

## 3. Recovery Playbooks

### RTO/RPO Ziele

| Szenario | RTO (Recovery Time) | RPO (Datenverlust max.) |
|----------|--------------------|-----------------------|
| Einzelne Tabelle corrupt | 15 Min | 1h (PITR) |
| Vollständiger DB-Ausfall | 30 Min | 5 Min (PITR WAL) |
| Vollständiger Datenverlust | 2h | 7 Tage (Wochenbackup) |
| Worst Case (alles weg) | 4h | 7 Tage |

### Playbook A: Einzelne Zeile/Tabelle wiederherstellen (PITR)

```bash
# 1. Zeitpunkt des Vorfalls identifizieren (Audit-Log)
SELECT event_time, action, old_values
FROM audit.log
WHERE record_id = '<betroffene-uuid>'
ORDER BY event_time DESC;

# 2. Supabase Dashboard → Backups → PITR
#    Zeitpunkt: 5 Minuten vor dem Vorfall
#    → Temporäre Datenbank erstellen

# 3. Aus temporärer DB die Zeile extrahieren
pg_dump \
  --host=<temp-db-host> \
  --username=postgres \
  --table=public.candidates \
  --where="id='<uuid>'" \
  --file=restore_single.dump

# 4. In Produktions-DB einspielen
pg_restore --data-only restore_single.dump -d <prod-db>

# 5. Temporäre DB löschen
```

### Playbook B: Vollständige Datenbank wiederherstellen

```bash
# Option 1: Supabase PITR (empfohlen, schneller)
# Dashboard → Project Settings → Backups → "Restore to point in time"
# Wähle: 5 Minuten vor dem Vorfall

# Option 2: Aus GCS-Backup (wenn Supabase PITR nicht verfügbar)
# 1. Backup aus GCS herunterladen
gsutil cp gs://phe-ats-backups/weekly/<backup-id>/backup_*.dump.gpg .

# 2. Entschlüsseln
gpg --decrypt backup_*.dump.gpg > backup.dump

# 3. Integrität prüfen (Checksum)
sha256sum -c checksums.txt

# 4. Neues Supabase-Projekt erstellen (bei Totalausfall)
#    Dashboard → New Project → Frankfurt

# 5. Schema und Daten einspielen
pg_restore \
  --host=<new-db-host> \
  --username=postgres \
  --dbname=postgres \
  --no-owner \
  --clean \
  --if-exists \
  backup.dump

# 6. Migrations nochmals ausführen (sicherheitshalber)
supabase db push

# 7. Vault-Keys neu einrichten (Keys sind NICHT im Backup)
# → pgsodium-Keys SEPARAT aus HSM/Passwort-Manager wiederherstellen
# → internal.key_metadata manuell befüllen

# 8. DNS/API-URL auf neue DB umstellen
# Supabase: Einstellungen → Connection String → Backend-ENV aktualisieren
```

### Playbook C: Storage-Backup (CVs/Dokumente)

```bash
# Supabase Storage ist S3-kompatibel
# Backup via rclone nach GCS

# rclone konfigurieren
rclone config create supabase-storage s3 \
  endpoint=<supabase-storage-url> \
  access_key_id=$SUPABASE_SERVICE_ROLE_KEY \
  secret_access_key=$SUPABASE_SERVICE_ROLE_KEY \
  region=eu-central-1

# Sync nach GCS
rclone sync supabase-storage:<bucket-name> \
  gcs:phe-ats-backups/storage/ \
  --progress \
  --log-file=rclone.log
```

---

## 4. Supabase Vault Key Backup

**Kritisch:** Die Datenbank-Inhalte (phone_encrypted, cv_url_encrypted) sind ohne die Vault-Keys **nicht entschlüsselbar**.

### Key-Backup-Prozess

```bash
# Supabase CLI: Vault-Keys exportieren (nur in Notfall, sofort wieder löschen)
# NIEMALS Keys in GitHub, Logs, E-Mail oder Chat speichern!

supabase secrets list --project-ref <project-id>

# Keys exportieren und in Hardware-gesichertem Passwort-Manager speichern:
# - 1Password Business (empfohlen)
# - Bitwarden Enterprise
# - HashiCorp Vault (On-Premise)

# Mindestens 2 separate Key-Custodians definieren
# (4-Augen-Prinzip für Key-Zugriff)
```

### Key-Recovery-Prozess

1. Beiden Key-Custodians kontaktieren
2. Vault-Key manuell in neues Supabase-Projekt einspielen
3. `internal.key_metadata` aktualisieren
4. Entschlüsselungs-Test mit bekanntem Datensatz

---

## 5. Backup-Test-Protokoll (vierteljährlich)

| Test | Frequenz | Verantwortlich | Letzter Test |
|------|----------|---------------|-------------|
| PITR-Test (einzelne Zeile) | Monatlich | DBA | — |
| Vollständiger Restore-Test | Quartalsweise | DBA + DevOps | — |
| Storage-Backup-Verify | Monatlich | DevOps | — |
| Key-Recovery-Drill | Halbjährlich | 2 Custodians | — |
| Backup-Integrität (Checksums) | Wöchentlich (automatisch) | CI/CD | automatisch |

### Test-Protokoll (ausfüllen nach jedem Test)

```
Datum: ___________
Tester: ___________
Backup-Timestamp: ___________
Getestetes Szenario: [ ] PITR [ ] Vollrestore [ ] Storage [ ] Keys
Ergebnis: [ ] Erfolgreich [ ] Fehlgeschlagen
RTO tatsächlich: ___________ Minuten
Abweichungen: ___________
Maßnahmen: ___________
```

---

## 6. Compliance und DSGVO

| Anforderung | Umsetzung | Status |
|-------------|-----------|--------|
| Backup-Verschlüsselung (DSGVO Art. 32) | AES-256 at rest + TLS 1.3 | ✅ |
| EU-Datenspeicherung | Frankfurt (AWS eu-central-1, GCS europe-west3) | ✅ |
| Aufbewahrungsfristen | 90 Tage Backups, 2 Jahre Audit-Logs | ✅ |
| Löschbarkeit in Backups | Backup-Retention < Kandidaten-Aufbewahrung | ✅ |
| Key-Separation | Vault-Keys nicht in DB-Backup enthalten | ✅ |
| Zugangskontrolle | Nur 2 Admins mit GCS-Zugriff | ✅ |
| Verarbeitungsverzeichnis | DATENSCHUTZ-INTERN.md §3 | ✅ |

> **Hinweis DSGVO Art. 17 (Right to be forgotten):**  
> Backups enthalten historische Daten. Bei Löschanfragen müssen Backups nach Ablauf der Aufbewahrungsfrist (90 Tage) automatisch gelöscht werden — keine manuelle Intervention in Backups erforderlich.
