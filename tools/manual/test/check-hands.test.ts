import { describe, expect, it } from "vitest";
import { demoSchema } from "./demo-schema";
import { findingsFrom, TEAM } from "./record-store";

/** `hands:` names one handle per role. `readIdMap` already refuses a value
 * that is not a mapping and an entry that is not a line of text; this rule
 * is what names the three ways a surviving line can still be wrong -
 * shared-planning-change-stages-SC-14. */

const SCHEMA = demoSchema(["proposal"]);

const CHANGE = "hands-probe";

const hands = findingsFrom({ change: CHANGE, schema: SCHEMA, team: TEAM });

describe("`hands:` on the change's record", () => {
  it("says nothing about a known role naming a known handle", async () => {
    expect(await hands("hands:\n  pm: alice\n", "hands")).toEqual([]);
  });

  it("reads a change that names no hands at all", async () => {
    expect(await hands("", "hands")).toEqual([]);
  });

  it("names a role outside the six", async () => {
    const [found] = await hands("hands:\n  product: alice\n", "hands");

    expect(found.level).toBe("fail");
    expect(found.path).toBe(`openspec/changes/${CHANGE}/.openspec.yaml`);
    expect(found.reason).toContain("`hands.product`");
    expect(found.reason).toContain("no role this store knows");
    expect(found.reason).toContain("`pm`");
  });

  it("names a value shaped like more than one handle", async () => {
    const [found] = await hands("hands:\n  pm: alice, bob\n", "hands");

    expect(found.reason).toContain("`hands.pm: alice, bob`");
    expect(found.reason).toContain("is not one handle");
  });

  it("names a handle the team map does not know", async () => {
    const [found] = await hands("hands:\n  pm: ghost\n", "hands");

    expect(found.reason).toContain("`hands.pm`");
    expect(found.reason).toContain("`ghost`");
    expect(found.reason).toContain("docs/prds/team.yaml");
  });
});
