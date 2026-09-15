import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

type Finding = { rule: string; level: string; path: string; reason: string };

/** A wait is the change's own record of what it needs. Nothing ends one but
 * its author, so the checker only names a wait no worklist could reach. */

const CHANGE = "openspec/changes/wait-probe";

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    hand: product-manager",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "  - id: ui-design",
  "    hand: designer",
  "    required: false",
  "    generates: ui-design.md",
  "    requires:",
  "      - proposal",
  "",
].join("\n");

const PROPOSAL = [
  "# Wait probe",
  "",
  "## Why",
  "",
  "So the checker has a change to read.",
  "",
].join("\n");

const findings = async (awaiting: string, rule: string): Promise<Finding[]> => {
  const root = writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
    [`${CHANGE}/.openspec.yaml`]: `schema: demo-planning\ncreated: 2026-09-15\n${awaiting}`,
    [`${CHANGE}/proposal.md`]: PROPOSAL,
  });
  const result: { findings: Finding[] } = await runChecks(root, NO_GIT);
  return result.findings.filter((one) => one.rule === rule);
};

const waits = (awaiting: string) => findings(awaiting, "awaiting");

describe("a wait on the change's record", () => {
  it("says nothing about a wait naming an artifact nobody has written", async () => {
    expect(await waits("awaiting:\n  ui-design: nothing draws it\n")).toEqual(
      [],
    );
  });

  it("names a wait on an artifact the schema does not declare", async () => {
    const [found] = await waits("awaiting:\n  ui-desgin: a typo\n");

    expect(found.level).toBe("fail");
    expect(found.path).toBe(`${CHANGE}/.openspec.yaml`);
    expect(found.reason).toContain("`ui-desgin`");
    expect(found.reason).toContain("does not declare");
    expect(found.reason).toContain("`ui-design`");
  });

  it("names a wait the change has already answered", async () => {
    const [found] = await waits("awaiting:\n  proposal: written already\n");

    expect(found.reason).toContain("the wait is over");
  });

  it("refuses a wait that says nothing rather than dropping it", async () => {
    const found = await findings("awaiting:\n  proposal:\n", "store");

    expect(found).toHaveLength(1);
    expect(found[0].reason).toContain("must say what is missing");
  });

  it("reads a change that declares no wait at all", async () => {
    expect(await waits("")).toEqual([]);
  });
});
