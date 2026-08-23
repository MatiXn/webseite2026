// Meta-Pixel — lädt ausschließlich nach erteilter Marketing-Einwilligung.
//
// Zwei Regeln, die hier durchgesetzt werden:
//
// 1. Ohne Einwilligung wird das Skript gar nicht erst angefordert. Es reicht
//    nicht, `fbq` später nicht aufzurufen — schon der Abruf von
//    connect.facebook.net überträgt die IP-Adresse an Meta.
// 2. `Lead` wird erst nach bestätigter Speicherung gemeldet, nie beim Öffnen
//    des Formulars. Sonst optimiert Meta auf Formularaufrufe statt auf
//    tatsächliche Bewerbungen.
//
// An Meta gehen nur Ereignisname, eine Ereignis-ID und der Kampagnen-Slug.
// Keine Namen, keine Telefonnummern, keine E-Mail-Adressen.

import { marketingErlaubt } from "./consent";

type FbqFunktion = {
  (...args: unknown[]): void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: unknown;
  callMethod?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFunktion;
    _fbq?: FbqFunktion;
  }
}

export function pixelId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return id || undefined;
}

let geladen = false;

/**
 * Lädt das Pixel-Skript und meldet den Seitenaufruf.
 * Mehrfachaufrufe sind unschädlich — nach dem ersten Mal passiert nichts.
 */
export function ladePixel(): void {
  const id = pixelId();
  if (!id) return;
  if (typeof window === "undefined") return;
  if (geladen || window.fbq) return;
  if (!marketingErlaubt()) return;

  geladen = true;

  // Offizieller Meta-Ladeschnipsel, in TypeScript übersetzt statt per eval
  // eingefügt: Die Content-Security-Policy erlaubt kein `new Function`.
  const fbq: FbqFunktion = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue?.push(args);
    }
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;

  window.fbq = fbq;
  window._fbq = fbq;

  const skript = document.createElement("script");
  skript.async = true;
  skript.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(skript);

  fbq("init", id);
  fbq("track", "PageView");
}

/**
 * Meldet eine erfolgreich gespeicherte Bewerbung.
 *
 * `eventId` kommt vom Server und ist dieselbe ID, die eine spätere
 * serverseitige Meldung über die Conversions API verwenden würde — Meta
 * erkennt daran, dass beide Meldungen dasselbe Ereignis betreffen, und zählt
 * es nur einmal.
 */
export function meldeLead({ kampagne, eventId }: { kampagne: string; eventId?: string }): void {
  if (typeof window === "undefined") return;
  if (!marketingErlaubt()) return;

  window.fbq?.(
    "track",
    "Lead",
    { content_category: "recruiting", content_name: kampagne },
    eventId ? { eventID: eventId } : undefined,
  );
}

/** Optionales Signal, dass jemand den Funnel tatsächlich begonnen hat. */
export function meldeViewContent(kampagne: string): void {
  if (typeof window === "undefined") return;
  if (!marketingErlaubt()) return;

  window.fbq?.("track", "ViewContent", {
    content_category: "recruiting",
    content_name: kampagne,
  });
}
