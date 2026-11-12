// Google Consent Mode v2: Standardwerte, bevor irgendein Google-Skript läuft.
//
// Wird im <head> jeder Seite synchron eingebunden (app/layout.tsx). Absichtlich
// als eigene Datei statt als Inline-Skript: Die CSP erlaubt sie über 'self',
// ohne Nonce und ohne Hash. Ein Hash in script-src würde 'unsafe-inline'
// abschalten und damit die Inline-Skripte von Next.js blockieren.
//
// Dieses Skript lädt NICHTS von Google. gtm.js und gtag.js werden erst nach
// Zustimmung im Banner nachgeladen (lib/gtm.ts, lib/google-tag.ts).
//
// Der Speicherschlüssel muss mit SPEICHER_SCHLUESSEL in lib/consent.ts
// übereinstimmen — ein Test (gtm.test.ts) prüft das.
(function () {
  var w = window;
  w.dataLayer = w.dataLayer || [];
  // `arguments` statt Restparameter: gtag.js/GTM erkennen Befehle nur als
  // Arguments-Objekt.
  w.gtag =
    w.gtag ||
    function gtag() {
      w.dataLayer.push(arguments);
    };

  w.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });
  // Ohne Werbe-Einwilligung keine Klick-Kennungen in Anfragen an Google.
  w.gtag("set", "ads_data_redaction", true);

  // Frühere Zustimmung sofort übernehmen, damit Tags beim ersten Feuern schon
  // den richtigen Stand sehen.
  try {
    var roh = w.localStorage.getItem("phe_consent_v3");
    var consent = roh ? JSON.parse(roh) : null;
    if (consent && consent.marketing === true) {
      w.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
  } catch {
    // Kein Speicher oder defekter Eintrag: bleibt bei „abgelehnt".
  }
})();
