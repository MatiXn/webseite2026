import { describe, it, expect } from "vitest";
import { validateInternalLink } from "../validate-internal-link";
import type { InternalLink, LinkValidationCode } from "../types";

function makeLink(overrides: Partial<InternalLink> = {}): InternalLink {
  return { label: "Test", href: "/jobs", type: "jobs", audience: "candidate", priority: "primary", source: "system", ...overrides };
}
const has = (codes: readonly LinkValidationCode[], c: LinkValidationCode) => codes.includes(c);

describe("validateInternalLink", () => {
  it("1 – gültiger interner Link", () => {
    expect(validateInternalLink(makeLink({ href: "/berufe/elektroniker" })).valid).toBe(true);
  });

  it("2 – leeres Label", () => {
    expect(has(validateInternalLink(makeLink({ label: "  " })).codes, "LINK_LABEL_EMPTY")).toBe(true);
  });

  it("3 – leeres href", () => {
    expect(has(validateInternalLink(makeLink({ href: "" })).codes, "LINK_HREF_EMPTY")).toBe(true);
  });

  it("4 – externe URL ohne https", () => {
    expect(has(validateInternalLink(makeLink({ href: "http://phe-perm.de" })).codes, "LINK_HREF_EXTERNAL_NOT_HTTPS")).toBe(true);
  });

  it("5 – javascript-Link", () => {
    expect(has(validateInternalLink(makeLink({ href: "javascript:alert(1)" })).codes, "LINK_HREF_JAVASCRIPT")).toBe(true);
  });

  it("6 – numerische Job-URL", () => {
    expect(has(validateInternalLink(makeLink({ href: "/jobs/1" })).codes, "LINK_HREF_NUMERIC_JOB")).toBe(true);
  });

  it("7 – alter /talente-finden-Pfad", () => {
    expect(has(validateInternalLink(makeLink({ href: "/talente-finden" })).codes, "LINK_HREF_FORBIDDEN")).toBe(true);
  });

  it("8 – Leerzeichen im href", () => {
    expect(has(validateInternalLink(makeLink({ href: "/berufe /elektroniker" })).codes, "LINK_HREF_HAS_SPACE")).toBe(true);
  });

  it("9 – Hashlink erlaubt", () => {
    expect(validateInternalLink(makeLink({ href: "#stellen" })).valid).toBe(true);
  });

  it("10 – https-Link erlaubt, Eingabe unverändert", () => {
    const link = makeLink({ href: "https://www.phe-perm.de/x", external: true });
    const snapshot = JSON.parse(JSON.stringify(link));
    expect(validateInternalLink(link).valid).toBe(true);
    expect(JSON.parse(JSON.stringify(link))).toEqual(snapshot);
  });
});
