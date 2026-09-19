import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/** `landed_by:` names the handle whose word landed one of the change's own
 * artifacts, and `reviewed:` names the content id it was last read against -
 * both key a line by a schema artifact id, so the same refusal covers both -
 * shared-planning-change-stages-SC-12. */

type Finding = { rule: string; level: string; path: string; reason: string };

const CHANGE = "openspec/changes/landed-by-probe";

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

const PROPOSAL = [
  "# Landed-by probe",
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

const landedBy = (record: string) => findings(record, "landed_by");

describe("`landed_by:` on the change's record", () => {
  it("says nothing about a known artifact landed by a known handle", async () => {
    expect(await landedBy("landed_by:\n  proposal: alice\n")).toEqual([]);
  });

  it("reads a change that records neither key at all", async () => {
    expect(await landedBy("")).toEqual([]);
  });

  it("names an artifact the schema does not issue", async () => {
    const [found] = await landedBy("landed_by:\n  ui-desgin: alice\n");

    expect(found.level).toBe("fail");
    expect(found.path).toBe(`${CHANGE}/.openspec.yaml`);
    expect(found.reason).toContain("`landed_by.ui-desgin`");
    expect(found.reason).toContain("does not issue");
    expect(found.reason).toContain("`proposal`");
  });

  it("names a handle the team map does not know", async () => {
    const [found] = await landedBy("landed_by:\n  proposal: ghost\n");

    expect(found.reason).toContain("`landed_by.proposal`");
    expect(found.reason).toContain("`ghost`");
    expect(found.reason).toContain("docs/prds/team.yaml");
  });
});

describe("`reviewed:` on the change's record", () => {
  it("says nothing about a known artifact", async () => {
    expect(await landedBy("reviewed:\n  proposal: 0123abcd\n")).toEqual([]);
  });

  it("refuses an artifact the schema does not issue the same way", async () => {
    const [found] = await landedBy("reviewed:\n  ui-desgin: 0123abcd\n");

    expect(found.level).toBe("fail");
    expect(found.reason).toContain("`reviewed.ui-desgin`");
    expect(found.reason).toContain("does not issue");
    expect(found.reason).toContain("`proposal`");
  });
});
