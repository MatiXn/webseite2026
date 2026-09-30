"use client";

// Mehrstufiger Bewerbungsfunnel.
//
// Die einzige interaktive Komponente der Landingpage. Alle Regeln liegen in
// `funnel-logik.ts` und laufen identisch auf dem Server — hier geht es nur um
// Darstellung, Navigation und den Versand.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LandingpageConfig } from "../typen";
import {
  LEERE_KONTAKTDATEN,
  FELD_GRENZEN,
  pruefeKontaktdaten,
  schrittIstBeantwortet,
  schalteMehrfachauswahl,
  type Antworten,
  type Feldfehler,
  type Kontaktdaten,
} from "../funnel-logik";
import {
  leseKampagnenParameter,
  type KampagnenParameter,
} from "../kampagnen-parameter";
import { EINWILLIGUNG_TEXT_VOR_LINK, EINWILLIGUNG_VERSION } from "../einwilligung";
import { meldeLead } from "../../lib/meta-pixel";
import { meldeKontaktConversion } from "../../lib/google-tag";
import { FUNNEL_ANKER } from "./Abschnitte";

type Zustand = "eingabe" | "sendet" | "erfolg";

export default function Funnel({ config }: { config: LandingpageConfig }) {
  const schritte = config.funnel.schritte;

  const [index, setIndex] = useState(0);
  const [antworten, setAntworten] = useState<Antworten>({});
  const [kontakt, setKontakt] = useState<Kontaktdaten>(LEERE_KONTAKTDATEN);
  const [einwilligung, setEinwilligung] = useState(false);
  const [fehler, setFehler] = useState<Feldfehler>({});
  const [sendefehler, setSendefehler] = useState("");
  const [zustand, setZustand] = useState<Zustand>("eingabe");
  const [honigtopf, setHonigtopf] = useState("");

  // Kampagnenparameter brauchen keinen State: Sie werden nur beim Absenden
  // gelesen und sollen keine Neuzeichnung auslösen.
  const parameter = useRef<KampagnenParameter>({});

  const ueberschriftRef = useRef<HTMLParagraphElement>(null);
  // Erst ab dem zweiten Schritt den Fokus umsetzen — sonst springt die Seite
  // gleich beim Laden zum Funnel und der Nutzer sieht den Hero nie.
  const schrittGewechselt = useRef(false);

  // Genau einmal beim Laden festhalten: Die Parameter müssen alle Schritte
  // überdauern, auch wenn sich die URL zwischendurch ändert.
  useEffect(() => {
    parameter.current = leseKampagnenParameter(window.location.search);
  }, []);

  // Nach jedem Schrittwechsel die neue Frage ansagen und anspringen, damit
  // Screenreader- und Tastaturnutzer nicht am Seitenanfang zurückbleiben.
  useEffect(() => {
    if (!schrittGewechselt.current) return;
    ueberschriftRef.current?.focus();
  }, [index]);

  const schritt = schritte[index];
  const fortschritt = Math.round(((index + (zustand === "erfolg" ? 1 : 0)) / schritte.length) * 100);

  function weiter() {
    schrittGewechselt.current = true;
    setIndex((i) => Math.min(i + 1, schritte.length - 1));
  }

  function zurueck() {
    schrittGewechselt.current = true;
    setSendefehler("");
    setIndex((i) => Math.max(i - 1, 0));
  }

  /**
   * Einzelauswahl beantwortet den Schritt und geht direkt weiter — ein
   * zusätzlicher „Weiter"-Klick wäre auf dem Smartphone ein Reibungspunkt
   * ohne Nutzen. Bei einem Zusatzfeld (z. B. Postleitzahl) bleiben wir
   * stehen, sonst wäre das Feld nicht mehr erreichbar.
   */
  function waehleEinzeln(feld: string, wert: string, hatZusatzfeld: boolean) {
    setAntworten((a) => ({ ...a, [feld]: wert }));
    if (!hatZusatzfeld) {
      // Zustandsänderung erst im nächsten Tick, damit die Auswahl sichtbar wird
      setTimeout(weiter, 140);
    }
  }

  async function abschicken(e: React.FormEvent) {
    e.preventDefault();
    if (zustand === "sendet") return; // Doppelklick-Schutz

    const feldfehler = pruefeKontaktdaten(kontakt);
    if (!einwilligung) {
      feldfehler.einwilligung = "Ohne diese Zustimmung dürfen wir dich nicht kontaktieren.";
    }
    setFehler(feldfehler);
    if (Object.keys(feldfehler).length > 0) return;

    setZustand("sendet");
    setSendefehler("");

    try {
      const antwort = await fetch("/api/recruiting-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kampagne: config.slug,
          antworten,
          kontakt,
          einwilligung: true,
          einwilligung_version: EINWILLIGUNG_VERSION,
          website: honigtopf,
          landing_page_url: window.location.href,
          referrer: document.referrer || "",
          ...parameter.current,
        }),
      });

      const daten = await antwort.json().catch(() => null);

      if (!antwort.ok || !daten?.ok) {
        throw new Error(daten?.fehler ?? "");
      }

      // Das Lead-Event darf erst hier ausgelöst werden — vorher ist nichts
      // gespeichert und Meta würde auf falsche Zahlen hin optimieren.
      meldeLead({ kampagne: config.slug, eventId: daten.event_id });
      meldeKontaktConversion("landingpage");

      setZustand("erfolg");
    } catch (err) {
      setZustand("eingabe");
      setSendefehler(
        (err instanceof Error && err.message) ||
          "Deine Angaben konnten gerade nicht übermittelt werden. Bitte versuche es erneut oder kontaktiere uns direkt.",
      );
    }
  }

  if (zustand === "erfolg") {
    return (
      <div className="lp-funnel" id={FUNNEL_ANKER}>
        <div className="lp-erfolg" role="status">
          <p className="lp-erfolg-haken" aria-hidden="true">
            ✓
          </p>
          <h2>Vielen Dank für dein Interesse!</h2>
          <p>
            Deine Angaben wurden erfolgreich übermittelt. Wir prüfen deine Informationen
            und melden uns zeitnah persönlich bei dir, um die Position unverbindlich und
            vertraulich zu besprechen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-funnel" id={FUNNEL_ANKER}>
      <div className="lp-fortschritt-kopf">
        <p className="lp-fortschritt-text">
          Schritt {index + 1} von {schritte.length}
        </p>
        {index > 0 && (
          <button type="button" className="lp-zurueck" onClick={zurueck}>
            ← Zurück
          </button>
        )}
      </div>

      <div
        className="lp-fortschritt-schiene"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={schritte.length}
        aria-label="Fortschritt"
      >
        <div className="lp-fortschritt-balken" style={{ width: `${Math.max(fortschritt, 8)}%` }} />
      </div>

      <p className="lp-frage" tabIndex={-1} ref={ueberschriftRef}>
        {schritt.frage}
      </p>

      {schritt.art === "einzelauswahl" && (
        <>
          <div className="lp-optionen" role="group" aria-label={schritt.frage}>
            {schritt.optionen.map((o) => {
              const gewaehlt = antworten[schritt.feld] === o.wert;
              return (
                <button
                  key={o.wert}
                  type="button"
                  className={`lp-option ${gewaehlt ? "lp-option--gewaehlt" : ""}`}
                  aria-pressed={gewaehlt}
                  onClick={() => waehleEinzeln(schritt.feld, o.wert, !!schritt.zusatzfeld)}
                >
                  {o.label}
                  <span className="lp-option-pfeil" aria-hidden="true">
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {schritt.zusatzfeld && (
            <div style={{ marginTop: 18 }}>
              <label className="lp-feld-label" htmlFor={`feld-${schritt.zusatzfeld.feld}`}>
                {schritt.zusatzfeld.label}
              </label>
              <input
                id={`feld-${schritt.zusatzfeld.feld}`}
                className="lp-feld"
                type="text"
                inputMode={schritt.zusatzfeld.art === "plz" ? "numeric" : "text"}
                autoComplete={schritt.zusatzfeld.art === "plz" ? "postal-code" : "off"}
                maxLength={schritt.zusatzfeld.maxLaenge}
                value={(antworten[schritt.zusatzfeld.feld] as string) ?? ""}
                onChange={(e) =>
                  setAntworten((a) => ({
                    ...a,
                    [schritt.zusatzfeld!.feld]: e.target.value.replace(/\D/g, ""),
                  }))
                }
              />
            </div>
          )}

          {schritt.fussnote && <p className="lp-fussnote">{schritt.fussnote}</p>}

          {schritt.zusatzfeld && (
            <button
              type="button"
              className="lp-cta"
              style={{ marginTop: 18 }}
              disabled={!schrittIstBeantwortet(schritt, antworten)}
              onClick={weiter}
            >
              Weiter
              <span aria-hidden="true">→</span>
            </button>
          )}
        </>
      )}

      {schritt.art === "mehrfachauswahl" && (
        <>
          <div className="lp-optionen" role="group" aria-label={schritt.frage}>
            {schritt.optionen.map((o) => {
              const liste = (antworten[schritt.feld] as string[]) ?? [];
              const gewaehlt = liste.includes(o.wert);
              return (
                <button
                  key={o.wert}
                  type="button"
                  className={`lp-option ${gewaehlt ? "lp-option--gewaehlt" : ""}`}
                  aria-pressed={gewaehlt}
                  onClick={() =>
                    setAntworten((a) => ({
                      ...a,
                      [schritt.feld]: schalteMehrfachauswahl(
                        a[schritt.feld] as string[] | undefined,
                        o.wert,
                      ),
                    }))
                  }
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="lp-kaestchen" aria-hidden="true">
                      ✓
                    </span>
                    {o.label}
                  </span>
                </button>
              );
            })}
          </div>

          {schritt.fussnote && <p className="lp-fussnote">{schritt.fussnote}</p>}

          <button
            type="button"
            className="lp-cta"
            style={{ marginTop: 18 }}
            disabled={!schrittIstBeantwortet(schritt, antworten)}
            onClick={weiter}
          >
            Weiter
            <span aria-hidden="true">→</span>
          </button>
        </>
      )}

      {schritt.art === "kontakt" && (
        <form onSubmit={abschicken} noValidate>
          {schritt.hinweis && (
            <p className="lp-fussnote" style={{ marginTop: 0, marginBottom: 20 }}>
              {schritt.hinweis}
            </p>
          )}

          {sendefehler && (
            <p className="lp-meldung lp-meldung--fehler" role="alert">
              {sendefehler}
            </p>
          )}

          <div className="lp-felder lp-felder--zweispaltig">
            <Textfeld
              name="first_name"
              label="Vorname"
              autoComplete="given-name"
              wert={kontakt.first_name}
              fehler={fehler.first_name}
              onChange={(v) => setKontakt((k) => ({ ...k, first_name: v }))}
            />
            <Textfeld
              name="last_name"
              label="Nachname"
              autoComplete="family-name"
              wert={kontakt.last_name}
              fehler={fehler.last_name}
              onChange={(v) => setKontakt((k) => ({ ...k, last_name: v }))}
            />
          </div>

          <div className="lp-felder">
            <Textfeld
              name="phone"
              label="Telefonnummer"
              typ="tel"
              inputMode="tel"
              autoComplete="tel"
              wert={kontakt.phone}
              fehler={fehler.phone}
              onChange={(v) => setKontakt((k) => ({ ...k, phone: v }))}
            />
            <Textfeld
              name="email"
              label="E-Mail-Adresse"
              typ="email"
              inputMode="email"
              autoComplete="email"
              wert={kontakt.email}
              fehler={fehler.email}
              onChange={(v) => setKontakt((k) => ({ ...k, email: v }))}
            />
          </div>

          <div className="lp-felder lp-felder--zweispaltig">
            <Textfeld
              name="preferred_contact_time"
              label="Wann erreichen wir dich am besten? (optional)"
              pflicht={false}
              wert={kontakt.preferred_contact_time}
              fehler={fehler.preferred_contact_time}
              onChange={(v) => setKontakt((k) => ({ ...k, preferred_contact_time: v }))}
            />
            <Textfeld
              name="current_job_title"
              label="Aktuelle Jobbezeichnung (optional)"
              pflicht={false}
              autoComplete="organization-title"
              wert={kontakt.current_job_title}
              fehler={fehler.current_job_title}
              onChange={(v) => setKontakt((k) => ({ ...k, current_job_title: v }))}
            />
          </div>

          {/* Honeypot — für Menschen unsichtbar und aus dem Tabfluss genommen */}
          <div className="lp-honigtopf" aria-hidden="true">
            <label htmlFor="website">Bitte dieses Feld frei lassen</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honigtopf}
              onChange={(e) => setHonigtopf(e.target.value)}
            />
          </div>

          <label className="lp-einwilligung">
            <input
              type="checkbox"
              checked={einwilligung}
              onChange={(e) => setEinwilligung(e.target.checked)}
              aria-invalid={!!fehler.einwilligung}
            />
            <span>
              {EINWILLIGUNG_TEXT_VOR_LINK}
              <Link href="/datenschutz" target="_blank" rel="noopener noreferrer">
                Datenschutzerklärung
              </Link>
              .
            </span>
          </label>
          {fehler.einwilligung && (
            <span className="lp-feldfehler" role="alert" style={{ marginBottom: 12 }}>
              {fehler.einwilligung}
            </span>
          )}

          <button
            type="submit"
            className="lp-cta"
            style={{ marginTop: 12 }}
            disabled={zustand === "sendet"}
          >
            {zustand === "sendet" ? "Wird übermittelt …" : "Angaben absenden"}
            {zustand !== "sendet" && <span aria-hidden="true">→</span>}
          </button>
        </form>
      )}
    </div>
  );
}

function Textfeld({
  name,
  label,
  wert,
  onChange,
  fehler,
  typ = "text",
  inputMode,
  autoComplete,
  pflicht = true,
}: {
  name: keyof Kontaktdaten;
  label: string;
  wert: string;
  onChange: (wert: string) => void;
  fehler?: string;
  typ?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoComplete?: string;
  pflicht?: boolean;
}) {
  const fehlerId = `${name}-fehler`;
  return (
    <div>
      <label className="lp-feld-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="lp-feld"
        type={typ}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={FELD_GRENZEN[name]}
        required={pflicht}
        value={wert}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!fehler}
        aria-describedby={fehler ? fehlerId : undefined}
      />
      {fehler && (
        <span className="lp-feldfehler" id={fehlerId} role="alert">
          {fehler}
        </span>
      )}
    </div>
  );
}
