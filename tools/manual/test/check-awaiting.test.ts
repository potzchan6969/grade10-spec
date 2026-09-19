import { describe, expect, it } from "vitest";
import { findingsFrom, findingsOf, recordStoreFiles } from "./record-store";

/** A wait is the change's own record of what it needs. Nothing ends one but
 * its author, so the checker only names a wait no worklist could reach. */

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    teammate: product-manager",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "  - id: ui-design",
  "    teammate: designer",
  "    required: false",
  "    generates: ui-design.md",
  "    requires:",
  "      - proposal",
  "  - id: specs",
  "    required: true",
  "    generates: specs/**/spec.md",
  "    requires:",
  "      - proposal",
  "",
].join("\n");

const CHANGE = "wait-probe";

const waits = findingsFrom({
  change: CHANGE,
  schema: SCHEMA,
  title: "Wait probe",
});

describe("a wait on the change's record", () => {
  it("says nothing about a wait naming an artifact nobody has written", async () => {
    expect(
      await waits("awaiting:\n  ui-design: nothing draws it\n", "awaiting"),
    ).toEqual([]);
  });

  it("names a wait on an artifact the schema does not issue", async () => {
    const [found] = await waits("awaiting:\n  ui-desgin: a typo\n", "awaiting");

    expect(found.level).toBe("fail");
    expect(found.path).toBe(`openspec/changes/${CHANGE}/.openspec.yaml`);
    expect(found.reason).toContain("`ui-desgin`");
    expect(found.reason).toContain("does not issue");
    expect(found.reason).toContain("`ui-design`");
  });

  it("names a wait the change has already answered", async () => {
    const [found] = await waits(
      "awaiting:\n  proposal: written already\n",
      "awaiting",
    );

    expect(found.reason).toContain("the wait is over");
  });

  it("refuses a wait that says nothing rather than dropping it", async () => {
    const found = await waits("awaiting:\n  proposal:\n", "store");

    expect(found).toHaveLength(1);
    expect(found[0].reason).toContain("must say what is missing");
  });

  it("reads a change that declares no wait at all", async () => {
    expect(await waits("", "awaiting")).toEqual([]);
  });
});

/** `spec.md` is two passes over one file: the outline fixes the anchors, and
 * the requirements come back after the blind suite. Read by presence, the file
 * ended the wait the moment the outline was written — and the reader refused
 * the outline as a delta naming no requirement. Between them, the one state
 * every change passes through failed two gates at once. */
describe("a change stopped at the outline", () => {
  const OUTLINE = [
    "## Purpose",
    "",
    "The catalogue a collector browses.",
    "",
    "## Feature set",
    "",
    "- Catalogue browsing",
    "  - Grid: the products a collector can buy",
    "",
  ].join("\n");

  const REQUIREMENTS = [
    "## ADDED Requirements",
    "",
    "### Requirement: The grid lists products",
    "",
    "The catalogue SHALL list the products.",
    "",
    "#### Scenario: alpha-SC-01 - it lists them",
    "**Serves:** Catalogue browsing - the grid",
    "",
    "- **WHEN** a collector opens the catalogue",
    "- **THEN** it SHALL list the products",
    "",
  ].join("\n");

  const WAIT = "awaiting:\n  specs: the second pass is QA's\n";

  const read = async (delta: string, awaiting: string, rule: string) => {
    const files = recordStoreFiles({
      change: CHANGE,
      schema: SCHEMA,
      record: awaiting,
      title: "Wait probe",
      files: {
        [`openspec/changes/${CHANGE}/specs/demo-product/alpha/spec.md`]: delta,
        [`openspec/changes/${CHANGE}/specs/demo-product/alpha/user-journeys.md`]:
          "## ADDED User journeys\n\n### alpha-US-01: Collector browses\n\n**As a** collector,\n**I want** the grid,\n**so that** I can browse.\n",
      },
    });
    return findingsOf(files, rule);
  };

  it("does not call the wait over while the requirements are unwritten", async () => {
    expect(await read(OUTLINE, WAIT, "awaiting")).toEqual([]);
  });

  it("does not refuse the outline as a delta naming no requirement", async () => {
    expect(await read(OUTLINE, WAIT, "store")).toEqual([]);
  });

  it("still refuses an outline that declared no wait", async () => {
    const [found] = await read(OUTLINE, "", "store");

    expect(found.level).toBe("fail");
    expect(found.reason).toContain(
      "names no ADDED/MODIFIED/REMOVED/RENAMED requirements",
    );
  });

  it("asks for the line back once the requirements land", async () => {
    const [found] = await read(REQUIREMENTS, WAIT, "awaiting");

    expect(found.reason).toContain("the wait is over");
  });
});
