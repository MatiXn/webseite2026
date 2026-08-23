// Statische Abschnitte einer Recruiting-Landingpage.
//
// Bewusst allesamt Server-Komponenten: Sie enthalten keine Interaktion, also
// darf dafür auch kein JavaScript in den Browser. Interaktiv ist nur der
// Funnel — siehe `Funnel.tsx`.

import Image from "next/image";
import Link from "next/link";
import type { LandingpageConfig } from "../typen";

/** Zielanker des primären Call-to-Action. */
export const FUNNEL_ANKER = "interesse";

export function Kopfbereich() {
  return (
    <header className="lp-kopf">
      <Image
        src="/phe-logo.png"
        alt="PHE Perm Engineering"
        width={140}
        height={28}
        priority
        style={{ height: 26, width: "auto" }}
      />
      <p className="lp-kopf-hinweis">
        <span aria-hidden="true">🔒</span>
        Vertraulich &amp; unverbindlich
      </p>
    </header>
  );
}

export function Hero({ config }: { config: LandingpageConfig }) {
  // Im Hero stehen die drei stärksten Vorteile; der vierte erscheint in der
  // Vorteilsleiste direkt darunter und würde hier nur die Zeile brechen.
  const heroFakten = config.vorteile.slice(0, 3);

  return (
    <section className="lp-hero">
      <div className={`lp-hero-raster ${config.heroBild ? "lp-hero-raster--mit-bild" : ""}`}>
        <div>
          <p className="lp-augenbraue">{config.augenbrauentext}</p>

          <h1 className="lp-h1">
            {config.ueberschrift.zeile1}
            {config.ueberschrift.zeile2 && (
              <span className="lp-h1-zweit">{config.ueberschrift.zeile2}</span>
            )}
          </h1>

          <p className="lp-unterzeile">{config.unterzeile}</p>

          <div className="lp-hero-fakten">
            {heroFakten.map((v) => (
              <div className="lp-hero-fakt" key={v.titel}>
                <b>{v.titel}</b>
                <span>{v.zusatz}</span>
              </div>
            ))}
          </div>

          <a className="lp-cta" href={`#${FUNNEL_ANKER}`}>
            {config.cta.primaer}
            <span aria-hidden="true">→</span>
          </a>
          <p className="lp-cta-zusatz">{config.cta.zusatz}</p>
        </div>

        {config.heroBild ? (
          <Image
            className="lp-heroBild"
            src={config.heroBild.pfad}
            alt={config.heroBild.alt}
            width={config.heroBild.breite}
            height={config.heroBild.hoehe}
            // Das Hero-Bild ist das größte Element im ersten Viewport und
            // bestimmt damit den LCP-Wert — deshalb ohne Lazy Loading.
            priority
            sizes="(max-width: 899px) 100vw, 50vw"
          />
        ) : (
          <HeroTafel config={config} />
        )}
      </div>
    </section>
  );
}

/**
 * Bildloser Hero-Ersatz. Greift automatisch, solange für eine Kampagne kein
 * Foto hinterlegt ist — die Seite sieht damit fertig aus statt leer.
 */
function HeroTafel({ config }: { config: LandingpageConfig }) {
  return (
    <div className="lp-hero-tafel">
      <p className="lp-hero-tafel-position">{config.position}</p>
      <p className="lp-hero-tafel-ort">{config.einsatzgebiet}</p>
      <ul className="lp-hero-tafel-liste">
        {config.vorteile.map((v) => (
          <li key={v.titel}>
            <b>{v.titel}</b>
            <span>{v.zusatz}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Vorteilsleiste({ config }: { config: LandingpageConfig }) {
  return (
    <section className="lp-vorteilsleiste" aria-label="Die wichtigsten Konditionen">
      <div className="lp-vorteilsleiste-raster">
        {config.vorteile.map((v) => (
          <div className="lp-vorteil" key={v.titel}>
            <b>{v.titel}</b>
            <span>{v.zusatz}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Gegenueberstellung({ config }: { config: LandingpageConfig }) {
  const g = config.gegenueberstellung;
  return (
    <section className="lp-abschnitt">
      <div className="lp-abschnitt-innen">
        <h2 className="lp-h2">{g.ueberschrift}</h2>
        {g.einleitung && <p className="lp-einleitung">{g.einleitung}</p>}

        <div className="lp-gegenueber">
          <div className="lp-spalte lp-spalte--negativ">
            <h3>{g.negativ.titel}</h3>
            <ul>
              {g.negativ.punkte.map((p) => (
                <li key={p}>
                  <span className="lp-zeichen lp-zeichen--negativ" aria-hidden="true">
                    ✕
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="lp-spalte lp-spalte--positiv">
            <h3>{g.positiv.titel}</h3>
            <ul>
              {g.positiv.punkte.map((p) => (
                <li key={p}>
                  <span className="lp-zeichen lp-zeichen--positiv" aria-hidden="true">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Ablauf({ config }: { config: LandingpageConfig }) {
  return (
    <section className="lp-abschnitt" style={{ background: "var(--fog)" }}>
      <div className="lp-abschnitt-innen">
        <p className="lp-augenbraue">{config.ablauf.augenbrauentext}</p>
        <h2 className="lp-h2" style={{ marginBottom: 32 }}>
          {config.ablauf.ueberschrift}
        </h2>

        <ol className="lp-ablauf">
          {config.ablauf.schritte.map((s, i) => (
            <li className="lp-ablauf-karte" key={s.titel}>
              <span className="lp-ablauf-nr">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.titel}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * Reduzierter Footer. Die Landingpage bekommt bewusst keine Hauptnavigation —
 * jeder zusätzliche Link führt aus dem bezahlten Traffic heraus. Impressum und
 * Datenschutz müssen aber erreichbar bleiben.
 */
export function LandingFooter() {
  return (
    <footer className="lp-fuss">
      <div className="lp-fuss-innen">
        <Image
          src="/phe-logo.png"
          alt="PHE Perm Engineering"
          width={140}
          height={28}
          // Das Logo ist dunkelblau und wäre auf dem dunklen Footer kaum zu
          // erkennen. Der Filter macht es weiß, ohne eine zweite Bilddatei.
          style={{ height: 26, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.92 }}
        />
        <p>
          Technische Direktvermittlung in Festanstellung. Persönlich, ehrlich und ohne
          Zeitarbeit.
        </p>
        <div className="lp-fuss-links">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
}
