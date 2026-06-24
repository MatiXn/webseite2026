# Datenschutz-Dokumentation PHE Perm Engineering
## Intern — nicht öffentlich zugänglich
Stand: Juni 2026

---

## A. DATENSCHUTZ-AUDIT-PROTOKOLL (Art. 30 DSGVO – Verarbeitungsverzeichnis)

### 1. Welche Daten werden verarbeitet?

| Datenkategorie | Beispiele | Sensitivität |
|---|---|---|
| Stammdaten | Name, Geburtsdatum, Adresse, Nationalität | Mittel |
| Kontaktdaten | E-Mail, Telefon, WhatsApp | Mittel |
| Bewerbungsunterlagen | Lebenslauf, Zeugnisse, Foto | Hoch |
| Qualifikationsdaten | Berufsabschluss, Zertifikate, Fachkenntnisse | Mittel |
| Gehalts- und Verhandlungsdaten | Gehaltsvorstellung, aktuelle Vergütung | Hoch |
| Kommunikation | WhatsApp-Verläufe, E-Mails, Gesprächsnotizen | Hoch |
| Matching-Historie | Vorgeschlagene Stellen, Zu-/Absagen | Mittel |
| Technische Daten | IP-Adressen, Browser-Logs | Niedrig |

**Besondere Kategorien (Art. 9 DSGVO):**
- Gesundheitsdaten: Nur wenn freiwillig angegeben (z.B. Schwerbehinderung für Bewerbungen)
- Maßnahme: Explizite Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO erforderlich

---

### 2. Wo werden die Daten gespeichert?

| System | Anbieter | Standort | Verschlüsselung |
|---|---|---|---|
| Hauptdatenbank (PostgreSQL) | Supabase Inc. | EU (Frankfurt, AWS eu-central-1) | AES-256 at rest, TLS 1.3 in transit |
| Webhosting / Frontend | Vercel Inc. | EU (Frankfurt) | TLS 1.3 |
| E-Mail | [E-MAIL-ANBIETER ERGÄNZEN] | [STANDORT] | TLS |
| WhatsApp Business | Meta Platforms | USA | Ende-zu-Ende-Verschlüsselung |
| Lokale Rechner (Mitarbeiter) | Intern | Deutschland | [FESTPLATTEN-VERSCHLÜSSELUNG PRÜFEN] |

**Hinweis WhatsApp:** Gesprächsinhalte sollten zeitnah in die Hauptdatenbank überführt werden. WhatsApp-Daten unterliegen den Meta-Datenschutzbedingungen. Wenn möglich: Signal oder WhatsApp Business API mit eigenem Server nutzen.

---

### 3. Wer hat Zugriff?

| Rolle | Zugriffsrechte | Technische Umsetzung |
|---|---|---|
| Berater (Recruiter) | Nur eigene Kandidaten + zugewiesene Stellen | Row-Level Security (RLS) in Supabase |
| Senior-Berater / TL | Eigene Kandidaten + Team-Übersicht | Supabase Role: `team_lead` |
| Geschäftsführung | Vollzugriff auf alle Daten | Supabase Role: `admin` |
| IT-Administration | Systemzugriff (kein fachlicher Zugriff) | Technischer Admin ohne Kandidaten-Lesezugriff |
| Supabase (Auftragsverarbeiter) | Infrastruktur-Zugriff | AVV vorhanden |

**Pflicht:** Jeder Mitarbeiter mit Datenbankzugriff muss:
- [ ] Datenschutzschulung absolviert haben (dokumentieren!)
- [ ] Vertraulichkeitserklärung unterschrieben haben
- [ ] 2FA aktiviert haben

---

### 4. Wie lange werden Daten aufbewahrt?

| Datenkategorie | Aufbewahrungsfrist | Löschverfahren |
|---|---|---|
| Aktiver Kandidat | Bis Vermittlung + 6 Monate | Manuelle Löschung durch Berater nach Abschluss |
| Inaktiver Kandidat (kein Kontakt >2 Jahre) | 2 Jahre, dann Anfrage oder Löschung | **Automatisiert: Cron-Job prüft monatlich** |
| Abgelehnte Bewerbungen | 3 Monate (AGG § 15 Verjährungsfrist) | Automatische Löschung nach 90 Tagen |
| Vermittlungsverträge | 10 Jahre | Archiv, nach Ablauf manuell löschen |
| E-Mail-Korrespondenz | 6 Jahre | E-Mail-Archiv |
| Gesprächsnotizen | Bis Kandidaten-Löschung | Kaskadenlöschung in DB |
| Website-Logs | 7 Tage | Automatisch durch Server |

---

### 5. Welche Sicherheitsmaßnahmen existieren (TOMs)?

**Technische Maßnahmen:**
- [x] HTTPS/TLS 1.3 für alle Verbindungen
- [x] AES-256 Datenbankver­schlüsselung (Supabase)
- [x] Row-Level Security (RLS) — Kandidaten-Isolation
- [x] 2-Faktor-Authentifizierung (TOTP) für Admin-Accounts
- [ ] 2FA für alle Mitarbeiter-Accounts — **TODO: umsetzen**
- [x] Automatische Backups (täglich, 30 Tage)
- [ ] Penetrationstest — **TODO: jährlich durchführen**
- [ ] Intrusion Detection System — **TODO: evaluieren**

**Organisatorische Maßnahmen:**
- [x] Datenschutzbeauftragter bestellt
- [ ] Datenschutzschulung für alle Mitarbeiter — **TODO: dokumentieren**
- [ ] Vertraulichkeitserklärungen aller Mitarbeiter — **TODO: sammeln**
- [x] AVV mit Supabase
- [x] AVV mit Vercel
- [ ] AVV mit E-Mail-Anbieter — **TODO: prüfen**
- [ ] Datenpannen-Meldeprotokoll — **TODO: erstellen (72h-Pflicht nach Art. 33 DSGVO)**

---

## B. MUSTER-EINWILLIGUNGSTEXTE

### Einwilligungstext 1: CV-Upload / Kandidaten-Registrierung

> **Einwilligung zur Verarbeitung meiner Bewerberdaten**
>
> Ich willige ein, dass PHE-Perm Engineering Ingenieure & Techniker GmbH meine im Rahmen dieser Bewerbung übermittelten personenbezogenen Daten (Lebenslauf, Qualifikationsnachweise, Kontaktdaten, Foto) zum Zweck der Personalvermittlung verarbeitet und speichert.
>
> Ich bin damit einverstanden, dass PHE mein **anonymisiertes** Profil (ohne Name und Kontaktdaten) an geeignete Arbeitgeber weitergibt. Eine Weitergabe meines vollständigen Profils mit Kontaktdaten erfolgt **ausschließlich nach meiner ausdrücklichen Zustimmung im Einzelfall**.
>
> Ich weiß, dass diese Einwilligung freiwillig ist und ich sie jederzeit ohne Angabe von Gründen durch eine E-Mail an datenschutz@phe-perm.de widerrufen kann. Bis zum Widerruf bleibt die Verarbeitung rechtmäßig.
>
> Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 26 BDSG.
>
> Weitere Informationen: [Datenschutzerklärung](https://phe-perm.de/datenschutz)
>
> ☐ Ich stimme zu

---

### Einwilligungstext 2: E-Mail-Speicherung für Kandidaten-Pool

> **Einwilligung zur Aufnahme in den PHE-Kandidaten-Pool**
>
> Ich willige ein, dass PHE-Perm Engineering meine E-Mail-Adresse und meine Qualifikationen in ihrem Kandidaten-Pool speichert, um mich über neue, passende Stellenangebote zu informieren.
>
> PHE wird mich maximal **einmal pro Woche** kontaktieren. Jede E-Mail enthält einen Abmeldelink. Ich kann meine Einwilligung jederzeit widerrufen.
>
> Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.
>
> ☐ Ich möchte über neue Stellenangebote informiert werden (optional)

---

### Einwilligungstext 3: Cookies / Tracking (für zukünftige Analyse-Tools)

> **Cookie-Einwilligung**
>
> Diese Website verwendet ausschließlich technisch notwendige Cookies. Diese sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden (Rechtsgrundlage: § 25 Abs. 2 TTDSG).
>
> Wenn PHE in Zukunft optionale Analyse-Cookies (z.B. zur Verbesserung der Nutzererfahrung) einsetzen möchte, werden Sie um gesonderte Einwilligung gebeten. Bis dahin werden keine Tracking-Cookies gesetzt.
>
> [Mehr erfahren](https://phe-perm.de/datenschutz)

---

### Einwilligungstext 4: Profilweitergabe an ein konkretes Unternehmen

> **Einwilligung zur Weitergabe Ihres vollständigen Profils**
>
> PHE möchte Ihr vollständiges Profil (inkl. Name, Kontaktdaten und Bewerbungsunterlagen) an folgendes Unternehmen weiterleiten:
>
> **Unternehmen:** [NAME]
> **Stelle:** [STELLENBEZEICHNUNG]
> **Standort:** [ORT]
> **Gehalt:** [RAHMEN]
>
> Ich stimme zu, dass PHE mein vollständiges Profil an dieses Unternehmen weitergibt. Das Unternehmen darf meine Daten ausschließlich für dieses Stellenangebot verwenden.
>
> Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.
>
> ☐ Ja, ich stimme der Weitergabe zu
> ☐ Nein, bitte nicht

---

## C. CHECKLISTE: JÄHRLICHES DATENSCHUTZ-AUDIT

Durchzuführen von: Datenschutzbeauftragter + IT
Turnus: Jährlich (empfohlen: Januar)

- [ ] Verarbeitungsverzeichnis (Art. 30 DSGVO) aktualisiert?
- [ ] Neue Dienstleister: AVV vorhanden?
- [ ] Zugriffsrechte aller Mitarbeiter überprüft (Prinzip der Datensparsamkeit)?
- [ ] Gelöschte Mitarbeiter-Accounts deaktiviert?
- [ ] Automatische Löschroutinen funktionieren?
- [ ] Datenschutzschulung für neue Mitarbeiter dokumentiert?
- [ ] Datenpannen im letzten Jahr dokumentiert und ggf. gemeldet?
- [ ] Datenschutzerklärung auf Website aktuell?
- [ ] AVV mit Supabase und Vercel noch gültig?
- [ ] Technische Sicherheitsmaßnahmen auf dem Stand der Technik?

---

## D. DATENPANNEN-PROTOKOLL (Art. 33/34 DSGVO)

Im Fall einer Datenpanne (Datenleck, unbefugter Zugriff, Verlust von Daten):

1. **Sofort (0–24h):** Interne Meldung an Geschäftsführer und Datenschutzbeauftragten
2. **Innerhalb 72h:** Meldung an LDI NRW (https://www.ldi.nrw.de), wenn Risiko für Betroffene besteht
3. **Wenn hohes Risiko:** Direkte Benachrichtigung der betroffenen Kandidaten (Art. 34 DSGVO)
4. **Dokumentieren:** Datum, Art des Vorfalls, betroffene Daten, Maßnahmen, Meldungen

Meldeformular LDI NRW: https://www.ldi.nrw.de/datenschutz/datenpannen
