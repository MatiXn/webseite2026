// Vertiefte E-Mail-Prüfungen: Wegwerf-Domains, MX-Records, optionale
// Validierungs-API (ZeroBounce) und Cloudflare-Turnstile-Verifikation.
// Alles serverseitig — nicht per Skript umgehbar.

import { resolveMx } from "node:dns/promises";

// Gängige Wegwerf-Anbieter (Domains und deren Alias-Domains)
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.de", "sharklasers.com",
  "10minutemail.com", "10minutemail.de", "temp-mail.org", "tempmail.com",
  "tempmail.de", "tempmailo.com", "throwawaymail.com", "yopmail.com",
  "trashmail.com", "trashmail.de", "trash-mail.com", "kurzepost.de",
  "wegwerfmail.de", "wegwerfmail.net", "wegwerfmail.org", "einrot.com",
  "discard.email", "discardmail.com", "spambog.com", "spambog.de",
  "mailcatch.com", "mintemail.com", "mohmal.com", "nada.email",
  "getnada.com", "inboxkitten.com", "maildrop.cc", "mailnesia.com",
  "mailsac.com", "moakt.com", "mytemp.email", "temp-mail.io",
  "tempinbox.com", "tempr.email", "dispostable.com", "fakeinbox.com",
  "spamgourmet.com", "mailexpire.com", "emailondeck.com", "burnermail.io",
  "33mail.com", "spam4.me", "grr.la", "pokemail.net", "objectmail.com",
  "byom.de", "muellmail.com", "spoofmail.de", "byebyemail.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@").pop()?.toLowerCase() ?? "";
  return DISPOSABLE_DOMAINS.has(domain);
}

// Prüft, ob die Domain E-Mails empfangen kann (MX- oder A-Fallback laut RFC 5321
// ist selten — wir verlangen MX). DNS-Timeout → durchlassen (fail open), damit
// ein DNS-Aussetzer keine echten Bewerber blockiert.
export async function hasMxRecords(email: string): Promise<boolean> {
  const domain = email.split("@").pop()?.toLowerCase();
  if (!domain) return false;
  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);
    if (records === null) return true; // Timeout → fail open
    return records.length > 0;
  } catch {
    // ENOTFOUND / ENODATA → Domain kann keine Mails empfangen
    return false;
  }
}

// Optionale Tiefen-Validierung via ZeroBounce — aktiv sobald
// ZEROBOUNCE_API_KEY gesetzt ist. API-Fehler → fail open.
export async function passesEmailValidationApi(email: string): Promise<boolean> {
  const key = process.env.ZEROBOUNCE_API_KEY;
  if (!key) return true;
  try {
    const res = await fetch(
      `https://api.zerobounce.net/v2/validate?api_key=${encodeURIComponent(key)}&email=${encodeURIComponent(email)}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return true;
    const data = await res.json();
    return !["invalid", "disposable", "abuse", "spamtrap", "do_not_mail"].includes(data?.status);
  } catch {
    return true;
  }
}

// Cloudflare-Turnstile-Verifikation — aktiv sobald TURNSTILE_SECRET_KEY
// gesetzt ist. Ohne Schlüssel wird nicht geprüft (Widget erscheint dann
// auch clientseitig nicht).
export async function passesTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(4000),
    });
    const data = await res.json();
    return data?.success === true;
  } catch {
    // Cloudflare nicht erreichbar → fail open, sonst liegt das Formular lahm
    return true;
  }
}
