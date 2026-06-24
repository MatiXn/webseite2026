export type Job = {
  id: string;
  title: string;
  category: "elektro" | "mechatronik" | "it" | "bau";
  city: string;
  region: string;
  lat: number;
  lng: number;
  salary: string;
  type: string;
  tags: string[];
  description: string;
  posted: string;
};

export const JOBS: Job[] = [
  {
    id: "1",
    title: "Elektroniker für Betriebstechnik (m/w/d)",
    category: "elektro",
    city: "Frankfurt am Main",
    region: "Hessen",
    lat: 50.1109,
    lng: 8.6821,
    salary: "48.000 – 56.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Schaltschrankbau", "SPS", "Instandhaltung"],
    description: "Installation, Wartung und Instandhaltung elektrischer Anlagen in der Produktion. Schaltschrankbau und SPS-Programmierung.",
    posted: "vor 2 Tagen",
  },
  {
    id: "2",
    title: "Elektriker / Elektroinstallateur (m/w/d)",
    category: "elektro",
    city: "Berlin",
    region: "Berlin",
    lat: 52.52,
    lng: 13.405,
    salary: "42.000 – 50.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Installation", "Gebäudetechnik", "Photovoltaik"],
    description: "Elektroinstallation in Wohn- und Gewerbebau, Montage von PV-Anlagen und Ladesäulen.",
    posted: "vor 1 Tag",
  },
  {
    id: "3",
    title: "Elektroniker für Energie- und Gebäudetechnik (m/w/d)",
    category: "elektro",
    city: "Potsdam",
    region: "Brandenburg",
    lat: 52.3906,
    lng: 13.0645,
    salary: "44.000 – 52.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Gebäudetechnik", "Smart Home", "EIB/KNX"],
    description: "Planung und Installation von Gebäudeautomationssystemen, KNX-Programmierung.",
    posted: "vor 3 Tagen",
  },
  {
    id: "4",
    title: "SPS-Programmierer / Automatisierungstechniker (m/w/d)",
    category: "it",
    city: "München",
    region: "Bayern",
    lat: 48.1351,
    lng: 11.582,
    salary: "62.000 – 75.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Siemens TIA Portal", "SCADA", "Industrie 4.0"],
    description: "Entwicklung und Optimierung von SPS-Programmen, Inbetriebnahme von Automatisierungsanlagen.",
    posted: "vor 5 Tagen",
  },
  {
    id: "5",
    title: "Mechatroniker / Industriemechaniker (m/w/d)",
    category: "mechatronik",
    city: "Stuttgart",
    region: "Baden-Württemberg",
    lat: 48.7758,
    lng: 9.1829,
    salary: "50.000 – 60.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Wartung", "Instandhaltung", "Pneumatik"],
    description: "Wartung und Instandhaltung von Produktionsmaschinen, mechanische und elektrische Fehleranalyse.",
    posted: "vor 1 Woche",
  },
  {
    id: "6",
    title: "Mechatroniker für Kältetechnik (m/w/d)",
    category: "mechatronik",
    city: "Hamburg",
    region: "Hamburg",
    lat: 53.5753,
    lng: 10.0153,
    salary: "48.000 – 56.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Kältetechnik", "Klimaanlagen", "HKLS"],
    description: "Installation und Wartung von Kälte- und Klimaanlagen in Industrie und Gewerbe.",
    posted: "vor 4 Tagen",
  },
  {
    id: "7",
    title: "Bauleiter Elektrotechnik (m/w/d)",
    category: "bau",
    city: "Düsseldorf",
    region: "Nordrhein-Westfalen",
    lat: 51.2217,
    lng: 6.7762,
    salary: "58.000 – 70.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Bauleitung", "VOB", "Großprojekte"],
    description: "Eigenverantwortliche Bauleitung elektrotechnischer Anlagen im Hoch- und Tiefbau.",
    posted: "vor 2 Tagen",
  },
  {
    id: "8",
    title: "Projektleiter Elektro / TGA (m/w/d)",
    category: "bau",
    city: "Köln",
    region: "Nordrhein-Westfalen",
    lat: 50.9333,
    lng: 6.9,
    salary: "65.000 – 80.000 €/Jahr",
    type: "Festanstellung",
    tags: ["TGA", "Projektleitung", "Haustechnik"],
    description: "Technische Projektleitung für gebäudetechnische Anlagen (Elektro, HKLS), Koordination von Subunternehmern.",
    posted: "vor 6 Tagen",
  },
  {
    id: "9",
    title: "IT-Netzwerktechniker / Systemintegrator (m/w/d)",
    category: "it",
    city: "Hannover",
    region: "Niedersachsen",
    lat: 52.3759,
    lng: 9.732,
    salary: "52.000 – 64.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Cisco", "Netzwerkplanung", "IT-Infrastruktur"],
    description: "Planung, Installation und Betreuung von Netzwerkinfrastrukturen in Industrie und Gewerbe.",
    posted: "vor 3 Tagen",
  },
  {
    id: "10",
    title: "Elektroplaner / CAD-Konstrukteur Elektrotechnik (m/w/d)",
    category: "elektro",
    city: "Nürnberg",
    region: "Bayern",
    lat: 49.4521,
    lng: 11.0767,
    salary: "46.000 – 56.000 €/Jahr",
    type: "Festanstellung",
    tags: ["EPLAN", "CAD", "Stromlaufpläne"],
    description: "Erstellung von Schaltplänen und Stromlaufplänen mit EPLAN P8, Materiallisten und Dokumentation.",
    posted: "vor 1 Woche",
  },
  {
    id: "11",
    title: "Industrieelektroniker Gerätetechnik (m/w/d)",
    category: "elektro",
    city: "Leipzig",
    region: "Sachsen",
    lat: 51.3397,
    lng: 12.3731,
    salary: "40.000 – 48.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Gerätetechnik", "Leiterplatten", "Qualitätssicherung"],
    description: "Entwicklung und Prüfung elektronischer Geräte und Baugruppen, Fehleranalyse auf Baugruppenebene.",
    posted: "vor 2 Wochen",
  },
  {
    id: "12",
    title: "Oberbauleiter Elektro (m/w/d)",
    category: "bau",
    city: "Dresden",
    region: "Sachsen",
    lat: 51.0504,
    lng: 13.7373,
    salary: "72.000 – 90.000 €/Jahr",
    type: "Festanstellung",
    tags: ["Oberbauleitung", "Großprojekte", "Personalverantwortung"],
    description: "Technische und kaufmännische Verantwortung für mehrere Bauprojekte gleichzeitig.",
    posted: "vor 5 Tagen",
  },
];

export const CATEGORIES = [
  { id: "all", label: "Alle Bereiche" },
  { id: "elektro", label: "Elektrotechnik" },
  { id: "mechatronik", label: "Mechatronik" },
  { id: "it", label: "IT / Automation" },
  { id: "bau", label: "Bau / TGA" },
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  elektro: "#f59e0b",
  mechatronik: "#3d7cc9",
  it: "#7c3aed",
  bau: "#22c55e",
};

export const CATEGORY_LABELS: Record<string, string> = {
  elektro: "Elektrotechnik",
  mechatronik: "Mechatronik",
  it: "IT / Automation",
  bau: "Bau / TGA",
};

// Haversine distance in km between two lat/lng points
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
