import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

type Finding = { rule: string; level: string; path: string; reason: string };

/**
 * The store's join table is written in prose: a design's states table, a task,
 * a suite's reconciliation each name an id in backticks and nothing used to
 * check that the id exists. Two ways it rots — a prefix written from memory,
 * and a renumber that moves an id the rest of the change still cites.
 */

const SPEC = [
  "# Alpha",
  "",
  "## Purpose",
  "",
  "Alpha exists so the checker has a spec with every part filled in.",
  "",
  "## Feature set",
  "",
  "- Doing the thing",
  "  - The thing: so the spec carries a map above its requirements",
  "",
  "## Requirements",
  "",
  "### Requirement: Alpha does things",
  "",
  "Alpha SHALL do the thing when asked.",
  "",
  "#### Scenario: demo-product-alpha-SC-01 - it does the thing",
  "**Serves:** demo-product-alpha-US-01 - doing the thing",
  "",
  "- **WHEN** asked",
  "- **THEN** it does the thing",
  "",
].join("\n");

const JOURNEYS = [
  "## User journeys",
  "",
  "### demo-product-alpha-US-01: Someone does the thing",
  "",
  "They open alpha and do the thing.",
  "",
].join("\n");

/** A store that resolves, plus whatever the case under test adds to it. */
const cited = async (extra: Record<string, string>): Promise<Finding[]> => {
  const root = writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    "docs/prds/products/demo-product/alpha.md":
      "---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\nThe page.\n",
    "openspec/specs/demo-product/alpha/spec.md": SPEC,
    "openspec/specs/demo-product/alpha/user-journeys.md": JOURNEYS,
    ...extra,
  });
  const result: { findings: Finding[] } = await runChecks(root, NO_GIT);
  return result.findings.filter((one) => one.rule === "cited");
};

const reasons = async (extra: Record<string, string>) =>
  (await cited(extra)).map((one) => `${one.path} — ${one.reason}`).sort();

describe("an id cited in backticks", () => {
  it("passes when the store issues it", async () => {
    expect(
      await reasons({
        "openspec/changes/probe/ui-design.md":
          "## States\n\n| Empty | `demo-product-alpha-SC-01` |\n",
      }),
    ).toEqual([]);
  });

  it("passes when it names a journey rather than a scenario", async () => {
    expect(
      await reasons({
        "openspec/changes/probe/tasks.md":
          "- [ ] 1.1 Do the thing (`demo-product-alpha-US-01`)\n",
      }),
    ).toEqual([]);
  });

  it("fails when the store issues it nowhere", async () => {
    expect(
      await reasons({
        "openspec/changes/probe/ui-design.md":
          "## States\n\n| Empty | `demo-product-alpha-SC-99` |\n",
      }),
    ).toEqual([
      "openspec/changes/probe/ui-design.md — line 3: `demo-product-alpha-SC-99` is issued nowhere in the store",
    ]);
  });

  it("fails a durable file too, not only a change", async () => {
    expect(
      await reasons({
        "openspec/specs/demo-product/alpha/feature-tcs.md":
          "# Alpha test cases\n\nFolded as `demo-product-alpha-SC-98`.\n",
      }),
    ).toEqual([
      "openspec/specs/demo-product/alpha/feature-tcs.md — line 3: `demo-product-alpha-SC-98` is issued nowhere in the store",
    ]);
  });
});

describe("a prefix written from memory", () => {
  it("names the id the reader probably meant", async () => {
    expect(
      await reasons({
        "openspec/changes/probe/ui-design.md":
          "## States\n\n| Empty | `alpha-SC-01` |\n",
      }),
    ).toEqual([
      "openspec/changes/probe/ui-design.md — line 3: `alpha-SC-01` is issued nowhere in the store — did you mean `demo-product-alpha-SC-01`?",
    ]);
  });

  it("offers the store's own spelling, upper case and all", async () => {
    const [one] = await cited({
      "openspec/changes/probe/ui-design.md":
        "## States\n\n| Empty | `alpha-sc-01` |\n",
    });
    expect(one.reason).toContain("`demo-product-alpha-SC-01`");
  });

  it("stays quiet about a tail two capabilities both end with", async () => {
    // `demo-product-sub-alpha-SC-01` ends the same way `demo-product-alpha-SC-01`
    // does, so `alpha-SC-01` has two answers. Guessing between them would put a
    // reader on the wrong scenario with more confidence than they arrived with.
    const reason = await reasons({
      "openspec/specs/demo-product/sub-alpha/spec.md": SPEC.replace(
        /demo-product-alpha/g,
        "demo-product-sub-alpha",
      ),
      "openspec/specs/demo-product/sub-alpha/user-journeys.md":
        JOURNEYS.replace(/demo-product-alpha/g, "demo-product-sub-alpha"),
      "openspec/changes/probe/ui-design.md":
        "## States\n\n| Empty | `alpha-SC-01` |\n",
    });
    expect(reason).toEqual([
      "openspec/changes/probe/ui-design.md — line 3: `alpha-SC-01` is issued nowhere in the store",
    ]);
  });
});

describe("what the rule does not read", () => {
  it("ignores an id written bare, which is prose about the scenario", async () => {
    expect(
      await reasons({
        "openspec/changes/probe/ui-design.md":
          "## States\n\nFolded as demo-product-alpha-SC-99 in the end.\n",
      }),
    ).toEqual([]);
  });

  it("leaves the archive alone — it is the record of what shipped", async () => {
    expect(
      await reasons({
        "openspec/changes/archive/2026-01-01-probe/tasks.md":
          "- [x] 1.1 Did the thing (`demo-product-alpha-SC-99`)\n",
      }),
    ).toEqual([]);
  });

  it("resolves a citation against an id only the archive issues", async () => {
    expect(
      await reasons({
        "openspec/changes/archive/2026-01-01-probe/specs/demo-product/alpha/spec.md":
          "#### Scenario: demo-product-alpha-SC-42 - a shipped thing\n",
        "openspec/changes/probe/tasks.md":
          "- [ ] 1.1 Revisit it (`demo-product-alpha-SC-42`)\n",
      }),
    ).toEqual([]);
  });
});

describe("one row per id per file", () => {
  it("counts the repeats rather than repeating itself", async () => {
    expect(
      await reasons({
        "openspec/changes/probe/ui-design.md": [
          "## States",
          "",
          "| Empty | `demo-product-alpha-SC-99` |",
          "| Error | `demo-product-alpha-SC-99` |",
          "| Loading | `demo-product-alpha-SC-99` |",
          "",
        ].join("\n"),
      }),
    ).toEqual([
      "openspec/changes/probe/ui-design.md — line 3 and 2 more: `demo-product-alpha-SC-99` is issued nowhere in the store",
    ]);
  });

  it("names each file that cites the same missing id", async () => {
    expect(
      await reasons({
        "openspec/changes/probe/ui-design.md":
          "## States\n\n| Empty | `demo-product-alpha-SC-99` |\n",
        "openspec/changes/probe/tasks.md":
          "- [ ] 1.1 Do it (`demo-product-alpha-SC-99`)\n",
      }),
    ).toEqual([
      "openspec/changes/probe/tasks.md — line 1: `demo-product-alpha-SC-99` is issued nowhere in the store",
      "openspec/changes/probe/ui-design.md — line 3: `demo-product-alpha-SC-99` is issued nowhere in the store",
    ]);
  });
});

describe("the finding itself", () => {
  it("fails the check rather than warning", async () => {
    const [one] = await cited({
      "openspec/changes/probe/ui-design.md":
        "## States\n\n| Empty | `demo-product-alpha-SC-99` |\n",
    });
    expect(one.level).toBe("fail");
  });
});

describe("a `Q<n>` cited in backticks", () => {
  const DECISIONS = (...rows: string[]) =>
    [
      "## Decisions",
      "",
      "| Q | Asked | Decided | Instead of |",
      "| --- | --- | --- | --- |",
      ...rows,
      "",
    ].join("\n");

  it("says nothing where the change's decisions table issues it", async () => {
    expect(
      await reasons({
        "openspec/changes/probe/decisions.md": DECISIONS(
          "| Q1 | Who writes the row? | The landing | A second file |",
        ),
        "openspec/changes/probe/tech-design.md": "The row is `Q1`'s answer.\n",
      }),
    ).toEqual([]);
  });

  it("shared-planning-agent-rounds-SC-70 - names one the table does not issue", async () => {
    const found = await reasons({
      "openspec/changes/probe/decisions.md": DECISIONS(
        "| Q1 | Who writes the row? | The landing | A second file |",
      ),
      "openspec/changes/probe/tech-design.md": "The row is `Q9`'s answer.\n",
    });

    expect(found).toEqual([
      "openspec/changes/probe/tech-design.md — line 1: `Q9` is no `## Decisions` row of probe",
    ]);
  });

  it("names a `Q<n>` outside any change's directory as issued by nobody", async () => {
    expect(
      await reasons({
        "openspec/references/loose-note.md": "Settled by `Q1` a while back.\n",
      }),
    ).toEqual([
      "openspec/references/loose-note.md — line 1: `Q1` names a decisions row, and nothing outside a change's directory issues one",
    ]);
  });
});
