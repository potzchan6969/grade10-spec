import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/** `hands:` names one handle per role. `readIdMap` already refuses a value
 * that is not a mapping and an entry that is not a line of text; this rule
 * is what names the three ways a surviving line can still be wrong -
 * shared-planning-change-stages-SC-14. */

type Finding = { rule: string; level: string; path: string; reason: string };

const CHANGE = "openspec/changes/hands-probe";

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    teammate: product-manager",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "",
].join("\n");

const PROPOSAL = [
  "# Hands probe",
  "",
  "## Why",
  "",
  "So the checker has a change to read.",
  "",
].join("\n");

const TEAM = [
  "handles:",
  "  alice:",
  "    email: alice@example.com",
  "    roles: [pm]",
  "channels: {}",
  "",
].join("\n");

const findings = async (record: string, rule: string): Promise<Finding[]> => {
  const root = writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    "docs/prds/team.yaml": TEAM,
    "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
    [`${CHANGE}/.openspec.yaml`]: `schema: demo-planning\ncreated: 2026-09-15\n${record}`,
    [`${CHANGE}/proposal.md`]: PROPOSAL,
  });
  const result: { findings: Finding[] } = await runChecks(root, NO_GIT);
  return result.findings.filter((one) => one.rule === rule);
};

const hands = (record: string) => findings(record, "hands");

describe("`hands:` on the change's record", () => {
  it("says nothing about a known role naming a known handle", async () => {
    expect(await hands("hands:\n  pm: alice\n")).toEqual([]);
  });

  it("reads a change that names no hands at all", async () => {
    expect(await hands("")).toEqual([]);
  });

  it("names a role outside the six", async () => {
    const [found] = await hands("hands:\n  product: alice\n");

    expect(found.level).toBe("fail");
    expect(found.path).toBe(`${CHANGE}/.openspec.yaml`);
    expect(found.reason).toContain("`hands.product`");
    expect(found.reason).toContain("no role this store knows");
    expect(found.reason).toContain("`pm`");
  });

  it("names a value shaped like more than one handle", async () => {
    const [found] = await hands("hands:\n  pm: alice, bob\n");

    expect(found.reason).toContain("`hands.pm: alice, bob`");
    expect(found.reason).toContain("is not one handle");
  });

  it("names a handle the team map does not know", async () => {
    const [found] = await hands("hands:\n  pm: ghost\n");

    expect(found.reason).toContain("`hands.pm`");
    expect(found.reason).toContain("`ghost`");
    expect(found.reason).toContain("docs/prds/team.yaml");
  });
});
