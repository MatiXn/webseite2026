// Einwilligungstext und dessen Version.
//
// Die Version wird zu jedem Lead gespeichert. Nur so lässt sich später
// belegen, welchem Wortlaut jemand tatsächlich zugestimmt hat.
//
// WICHTIG: Ändert sich der Text auch nur geringfügig, muss `EINWILLIGUNG_VERSION`
// hochgezählt werden. Sonst zeigen alte Datensätze auf einen Text, den es so
// nie gab. Der Test `einwilligung.test.ts` erinnert daran.

export const UNTERNEHMEN = "PHE Perm Engineering Ingenieure & Techniker GmbH";

/** Datum der letzten Textänderung im Format JJJJ-MM-TT. */
export const EINWILLIGUNG_VERSION = "2026-08-23";

/**
 * Pflicht-Einwilligung zur Kontaktaufnahme wegen genau dieser Position.
 *
 * Bewusst eng gefasst: Newsletter, Talentpool, andere Stellen und spätere
 * Werbeansprache sind hiervon NICHT gedeckt. Wer das später möchte, braucht
 * eine eigene, freiwillige und standardmäßig abgewählte Einwilligung.
 */
export const EINWILLIGUNG_TEXT =
  `Ich stimme zu, dass ${UNTERNEHMEN} mich per E-Mail oder telefonisch zu dieser ` +
  `Position kontaktieren darf. Die Einwilligung kann ich jederzeit mit Wirkung ` +
  `für die Zukunft widerrufen. Weitere Informationen finde ich in der ` +
  `Datenschutzerklärung.`;

/** Textbaustein vor dem verlinkten Wort „Datenschutzerklärung". */
export const EINWILLIGUNG_TEXT_VOR_LINK = EINWILLIGUNG_TEXT.replace(
  "Datenschutzerklärung.",
  "",
);
