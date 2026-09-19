import { describe, expect, it } from "vitest";
import { findingsFrom, TEAM } from "./record-store";

/** `landed_by:` names the handle whose word landed one of the change's own
 * artifacts, and `reviewed:` names the content id it was last read against -
 * both key a line by a schema artifact id, so the same refusal covers both -
 * shared-planning-change-stages-SC-12. */

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    teammate: product-manager",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "  - id: specs",
  "    required: true",
  "    generates: specs/**/spec.md",
  "    requires:",
  "      - proposal",
  "",
].join("\n");

const CHANGE = "landed-by-probe";

const landedBy = findingsFrom({ change: CHANGE, schema: SCHEMA, team: TEAM });

describe("`landed_by:` on the change's record", () => {
  it("says nothing about a known artifact landed by a known handle", async () => {
    expect(
      await landedBy("landed_by:\n  proposal: alice\n", "landed_by"),
    ).toEqual([]);
  });

  it("reads a change that records neither key at all", async () => {
    expect(await landedBy("", "landed_by")).toEqual([]);
  });

  it("names an artifact the schema does not issue", async () => {
    const [found] = await landedBy(
      "landed_by:\n  ui-desgin: alice\n",
      "landed_by",
    );

    expect(found.level).toBe("fail");
    expect(found.path).toBe(`openspec/changes/${CHANGE}/.openspec.yaml`);
    expect(found.reason).toContain("`landed_by.ui-desgin`");
    expect(found.reason).toContain("does not issue");
    expect(found.reason).toContain("`proposal`");
  });

  it("names a handle the team map does not know", async () => {
    const [found] = await landedBy(
      "landed_by:\n  proposal: ghost\n",
      "landed_by",
    );

    expect(found.reason).toContain("`landed_by.proposal`");
    expect(found.reason).toContain("`ghost`");
    expect(found.reason).toContain("docs/prds/team.yaml");
  });
});

describe("`reviewed:` on the change's record", () => {
  it("says nothing about a known artifact", async () => {
    expect(
      await landedBy("reviewed:\n  proposal: 0123abcd\n", "landed_by"),
    ).toEqual([]);
  });

  it("refuses an artifact the schema does not issue the same way", async () => {
    const [found] = await landedBy(
      "reviewed:\n  ui-desgin: 0123abcd\n",
      "landed_by",
    );

    expect(found.level).toBe("fail");
    expect(found.reason).toContain("`reviewed.ui-desgin`");
    expect(found.reason).toContain("does not issue");
    expect(found.reason).toContain("`proposal`");
  });
});
