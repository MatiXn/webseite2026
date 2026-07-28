import { describe, it, expect } from "vitest";
import { buildOrganizationReference } from "../build-organization-reference";
import { company } from "../../../content/company";

describe("buildOrganizationReference", () => {
  it("1 – liefert exakt die zentrale Organization-@id", () => {
    expect(buildOrganizationReference()).toEqual({ "@id": company.organizationId });
    expect(company.organizationId).toBe("https://www.phe-perm.de/#organization");
  });

  it("2 – enthält keinerlei NAP-/Organization-Daten", () => {
    const ref = buildOrganizationReference() as Record<string, unknown>;
    expect(Object.keys(ref)).toEqual(["@id"]);
    for (const forbidden of ["@type", "name", "address", "telephone", "email", "logo", "geo"]) {
      expect(forbidden in ref).toBe(false);
    }
  });

  it("3 – mutiert die Company Registry nicht", () => {
    const snapshot = JSON.parse(JSON.stringify(company));
    buildOrganizationReference();
    expect(JSON.parse(JSON.stringify(company))).toEqual(snapshot);
  });
});
