// Social-/Profil-Links. Nur real gepflegte Profile (keine erfundenen).
// Facebook und Xing sind derzeit nicht gepflegt und daher nicht gelistet.

export type SocialPlatform = "LinkedIn" | "Instagram" | "Google" | "Wikidata";

export type SocialLink = {
  readonly platform: SocialPlatform;
  readonly url: string;
};

export type Social = readonly SocialLink[];

export const social = [
  { platform: "LinkedIn", url: "https://www.linkedin.com/company/phe-perm-engineering" },
  { platform: "Instagram", url: "https://www.instagram.com/phe_perm_engineering" },
  { platform: "Google", url: "https://www.google.com/maps/place/PHE-Perm+Engineering+Ingenieure+%26+Techniker+GmbH/@51.216938,6.7835745,17z" },
  { platform: "Wikidata", url: "https://www.wikidata.org/wiki/Q140572942" },
] as const satisfies Social;
