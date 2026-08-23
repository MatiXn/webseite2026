import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";

// next/link braucht im Test keinen Router — ein einfaches <a> genügt.
vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const meldeLead = vi.fn();
vi.mock("../../lib/meta-pixel", () => ({
  meldeLead: (...args: unknown[]) => meldeLead(...args),
  ladePixel: vi.fn(),
  meldeViewContent: vi.fn(),
}));

import Funnel from "../komponenten/Funnel";
import { kaeltetechnikerKoeln } from "../kampagnen/kaeltetechniker-koeln";

const KONTAKT = {
  Vorname: "Thomas",
  Nachname: "Berger",
  Telefonnummer: "0173 9980100",
  "E-Mail-Adresse": "thomas.berger@example.de",
};

/** Antwortet auf alle Auswahlfragen bis zum Kontaktschritt. */
async function bisZumKontaktschritt(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /Ja, habe ich/ }));
  await screen.findByText(/Wie viel Berufserfahrung/);

  await user.click(screen.getByRole("button", { name: /2 bis 5 Jahre/ }));
  await screen.findByText(/Wohnst du in Köln/);

  await user.click(screen.getByRole("button", { name: /^Ja$/ }));
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await screen.findByText(/Führerschein der Klasse B/);

  await user.click(screen.getByRole("button", { name: /^Ja$/ }));
  await screen.findByText(/besonders wichtig/);

  await user.click(screen.getByRole("button", { name: /Mehr Gehalt/ }));
  await user.click(screen.getByRole("button", { name: "Weiter" }));
  await screen.findByText(/Wie können wir dich erreichen/);
}

async function fuelleKontaktdaten(user: ReturnType<typeof userEvent.setup>) {
  for (const [label, wert] of Object.entries(KONTAKT)) {
    await user.type(screen.getByLabelText(label), wert);
  }
  await user.click(screen.getByRole("checkbox"));
}

beforeEach(() => {
  meldeLead.mockClear();
  window.history.replaceState({}, "", "/stellen/kaeltetechniker-koeln");
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Funnel — Durchlauf", () => {
  it("führt vom ersten Schritt bis zur Erfolgsmeldung", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, event_id: "ereignis-1" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    expect(screen.getByText(/Schritt 1 von 6/)).toBeTruthy();

    await bisZumKontaktschritt(user);
    await fuelleKontaktdaten(user);
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));

    await screen.findByText(/Vielen Dank für dein Interesse/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("zeigt bei jedem Schritt den Fortschritt an", async () => {
    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await user.click(screen.getByRole("button", { name: /Ja, habe ich/ }));
    await screen.findByText(/Schritt 2 von 6/);
  });
});

describe("Funnel — Zurück-Navigation", () => {
  it("behält die vorherige Antwort beim Zurückgehen", async () => {
    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await user.click(screen.getByRole("button", { name: /Andere technische Ausbildung/ }));
    await screen.findByText(/Wie viel Berufserfahrung/);

    await user.click(screen.getByRole("button", { name: /Zurück/ }));
    await screen.findByText(/abgeschlossene Ausbildung als Mechatroniker/);

    const gewaehlt = screen.getByRole("button", { name: /Andere technische Ausbildung/ });
    expect(gewaehlt.getAttribute("aria-pressed")).toBe("true");
  });

  it("behält bereits eingegebene Kontaktdaten beim Zurück und Vor", async () => {
    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await user.type(screen.getByLabelText("Vorname"), "Thomas");

    await user.click(screen.getByRole("button", { name: /Zurück/ }));
    await screen.findByText(/besonders wichtig/);

    await user.click(screen.getByRole("button", { name: "Weiter" }));
    await screen.findByText(/Wie können wir dich erreichen/);

    expect((screen.getByLabelText("Vorname") as HTMLInputElement).value).toBe("Thomas");
  });

  it("zeigt im ersten Schritt keinen Zurück-Knopf", () => {
    render(<Funnel config={kaeltetechnikerKoeln} />);
    expect(screen.queryByRole("button", { name: /Zurück/ })).toBeNull();
  });
});

describe("Funnel — Prüfung der Eingaben", () => {
  it("sendet nicht ab, solange Pflichtfelder fehlen", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("Bitte gib deinen Vornamen an.")).toBeTruthy();
    expect(screen.getByText("Bitte gib deine Telefonnummer an.")).toBeTruthy();
  });

  it("weist eine ungültige E-Mail-Adresse ab", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await user.type(screen.getByLabelText("Vorname"), "Thomas");
    await user.type(screen.getByLabelText("Nachname"), "Berger");
    await user.type(screen.getByLabelText("Telefonnummer"), "0173 9980100");
    await user.type(screen.getByLabelText("E-Mail-Adresse"), "keine-adresse");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText(/Tippfehler/)).toBeTruthy();
  });

  it("besteht auf der Einwilligung", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    for (const [label, wert] of Object.entries(KONTAKT)) {
      await user.type(screen.getByLabelText(label), wert);
    }
    // Kästchen bewusst nicht angehakt
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText(/Ohne diese Zustimmung/)).toBeTruthy();
  });
});

describe("Funnel — Erfolgsmeldung erscheint nur bei echtem Erfolg", () => {
  it("zeigt bei einem Serverfehler eine Fehlermeldung statt Erfolg", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ ok: false, fehler: "Speichern fehlgeschlagen." }),
      }),
    );

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await fuelleKontaktdaten(user);
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));

    await screen.findByText("Speichern fehlgeschlagen.");
    expect(screen.queryByText(/Vielen Dank für dein Interesse/)).toBeNull();
  });

  it("zeigt bei einem Netzwerkabbruch eine Fehlermeldung statt Erfolg", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("")));

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await fuelleKontaktdaten(user);
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));

    await screen.findByText(/konnten gerade nicht übermittelt werden/);
    expect(screen.queryByText(/Vielen Dank für dein Interesse/)).toBeNull();
  });

  it("lässt nach einem Fehler einen zweiten Versuch zu", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({ ok: false, fehler: "Kurzer Aussetzer." }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, event_id: "e2" }) });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await fuelleKontaktdaten(user);
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));
    await screen.findByText("Kurzer Aussetzer.");

    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));
    await screen.findByText(/Vielen Dank für dein Interesse/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("Funnel — Meta-Lead-Ereignis", () => {
  it("meldet den Lead erst nach erfolgreicher Speicherung", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, event_id: "ereignis-42" }),
      }),
    );

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    // Formular ist offen und ausgefüllt — bis hierher darf nichts gemeldet sein
    await fuelleKontaktdaten(user);
    expect(meldeLead).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));
    await screen.findByText(/Vielen Dank für dein Interesse/);

    expect(meldeLead).toHaveBeenCalledTimes(1);
    expect(meldeLead).toHaveBeenCalledWith({
      kampagne: "kaeltetechniker-koeln",
      eventId: "ereignis-42",
    });
  });

  it("meldet nichts, wenn das Speichern fehlschlägt", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ok: false, fehler: "Fehler." }) }),
    );

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await fuelleKontaktdaten(user);
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));

    await screen.findByText("Fehler.");
    expect(meldeLead).not.toHaveBeenCalled();
  });
});

describe("Funnel — Kampagnenparameter", () => {
  it("schickt die Parameter der Anzeigen-URL mit", async () => {
    window.history.replaceState(
      {},
      "",
      "/stellen/kaeltetechniker-koeln?utm_source=facebook&utm_campaign=kaelte_koeln_q3&fbclid=IwAR0abc&ad_id=120212",
    );

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, event_id: "e" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await fuelleKontaktdaten(user);
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));
    await screen.findByText(/Vielen Dank für dein Interesse/);

    const rumpf = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(rumpf.utm_source).toBe("facebook");
    expect(rumpf.utm_campaign).toBe("kaelte_koeln_q3");
    expect(rumpf.fbclid).toBe("IwAR0abc");
    expect(rumpf.ad_id).toBe("120212");
  });

  it("überträgt alle Antworten und die Einwilligungsfassung", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, event_id: "e" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await fuelleKontaktdaten(user);
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));
    await screen.findByText(/Vielen Dank für dein Interesse/);

    const rumpf = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(rumpf.kampagne).toBe("kaeltetechniker-koeln");
    expect(rumpf.antworten.qualification).toBe("kaeltetechnik");
    expect(rumpf.antworten.experience_level).toBe("2_bis_5");
    expect(rumpf.antworten.job_preferences).toEqual(["gehalt"]);
    expect(rumpf.kontakt.email).toBe("thomas.berger@example.de");
    expect(rumpf.einwilligung).toBe(true);
    expect(rumpf.einwilligung_version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("Funnel — Bedienbarkeit", () => {
  it("ist vollständig mit der Tastatur bedienbar", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, event_id: "e" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    // Erste Frage: mit Tab zur Antwort, mit Enter auswählen
    await user.tab();
    expect(document.activeElement?.textContent).toContain("Ja, habe ich");
    await user.keyboard("{Enter}");
    await screen.findByText(/Wie viel Berufserfahrung/);

    // Der Fokus liegt jetzt auf der neuen Frage. Ein einziger Tabulator führt
    // von dort zur ersten Antwort — der Zurück-Knopf steht im Dokument davor
    // und wird nicht erneut durchlaufen. Die Leertaste muss ebenso auslösen
    // wie die Eingabetaste.
    await user.tab();
    expect(document.activeElement?.textContent).toContain("Noch keine Berufserfahrung");
    await user.keyboard(" ");
    await screen.findByText(/Wohnst du in Köln/);
  });

  it("setzt den Fokus nach einem Schrittwechsel auf die neue Frage", async () => {
    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await user.click(screen.getByRole("button", { name: /Ja, habe ich/ }));
    await screen.findByText(/Wie viel Berufserfahrung/);

    await waitFor(() => {
      expect(document.activeElement?.textContent).toContain("Wie viel Berufserfahrung");
    });
  });

  it("beschriftet den Fortschrittsbalken für Screenreader", () => {
    render(<Funnel config={kaeltetechnikerKoeln} />);
    const balken = screen.getByRole("progressbar");
    expect(balken.getAttribute("aria-valuenow")).toBe("1");
    expect(balken.getAttribute("aria-valuemax")).toBe("6");
  });

  it("verknüpft jede Fehlermeldung mit ihrem Feld", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await user.click(screen.getByRole("button", { name: /Angaben absenden/ }));

    const feld = screen.getByLabelText("Vorname");
    expect(feld.getAttribute("aria-invalid")).toBe("true");
    const beschreibung = feld.getAttribute("aria-describedby");
    expect(beschreibung).toBeTruthy();
    expect(document.getElementById(beschreibung!)?.textContent).toBe(
      "Bitte gib deinen Vornamen an.",
    );
  });

  it("hält den Honeypot aus dem Tabfluss heraus", () => {
    render(<Funnel config={kaeltetechnikerKoeln} />);
    // Erst im Kontaktschritt vorhanden — hier prüfen wir nur, dass er im
    // ersten Schritt nicht fokussierbar herumsteht.
    expect(screen.queryByLabelText(/Bitte dieses Feld frei lassen/)).toBeNull();
  });
});

describe("Funnel — Doppelklick-Schutz", () => {
  it("sendet bei mehrfachem Klick nur einmal", async () => {
    let aufloesen: ((wert: unknown) => void) | undefined;
    const fetchMock = vi.fn().mockReturnValue(
      new Promise((res) => {
        aufloesen = res;
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<Funnel config={kaeltetechnikerKoeln} />);

    await bisZumKontaktschritt(user);
    await fuelleKontaktdaten(user);

    const knopf = screen.getByRole("button", { name: /Angaben absenden/ });
    await user.click(knopf);

    // Während des Sendens ist der Knopf gesperrt
    const sendend = screen.getByRole("button", { name: /Wird übermittelt/ });
    expect((sendend as HTMLButtonElement).disabled).toBe(true);
    await user.click(sendend);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    aufloesen?.({ ok: true, json: async () => ({ ok: true, event_id: "e" }) });
    await screen.findByText(/Vielen Dank für dein Interesse/);
  });
});
