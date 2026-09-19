import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { ROUND_RECORD_SINCE } from "../check/rounds.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { readRounds } from "../src/store/read-rounds.mts";
import { writeStore } from "./tmp-store";

/**
 * `rounds.md` is the change's record of what each round ran, and the `round`
 * rule refuses work already done that no row names.
 *
 * Two readings here. The reader: one row per round, the columns as the
 * requirement tables them, absent until the first round writes the file. And
 * the rule: a written artifact or a ticked group with no row, and a row that
 * leaves a column empty, on a change opened after the day the rule landed —
 * every change already in flight that day passes the same check.
 */

type Finding = { rule: string; level: string; path: string; reason: string };

const ID = "round-probe";
const CHANGE = `openspec/changes/${ID}`;

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "    upstream: []",
  "  - id: decisions",
  "    required: true",
  "    generates: decisions.md",
  "    requires: [proposal]",
  "    upstream: [proposal]",
  "  - id: tasks",
  "    required: true",
  "    generates: tasks.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  "",
].join("\n");

const PROPOSAL = [
  "# Round probe",
  "",
  "## Why",
  "",
  "So the checker has a change to read.",
  "",
].join("\n");

const DECISIONS = [
  "## Goals",
  "",
  "- One round per artifact",
  "",
  "## Non-Goals",
  "",
  "- Nothing else",
  "",
  "## Decisions",
  "",
  "| Q | Asked | Decided | Instead of |",
  "| --- | --- | --- | --- |",
  "| Q1 | What lands a row? | The landing | A second file |",
  "",
].join("\n");

const HEADER = [
  "| Round | Artifact | Perspectives | Stood | Asked | Tests |",
  "| --- | --- | --- | --- | --- | --- |",
].join("\n");

const row = (
  round: number,
  artifact: string,
  {
    perspectives = "simpler, qa",
    stood = "nothing stood",
    asked = "-",
    tests = "-",
  } = {},
) =>
  `| ${round} | ${artifact} | ${perspectives} | ${stood} | ${asked} | ${tests} |`;

const ROUNDS = (...rows: string[]) =>
  ["# Rounds", "", HEADER, ...rows, ""].join("\n");

/** Every row a change with a plan owes: the three artifacts and the one
 * ticked group. */
const WHOLE = ROUNDS(
  row(1, "proposal"),
  row(2, "decisions"),
  row(3, "tasks"),
  row(4, "1", { tests: "demo-SC-01: test/one.test.ts" }),
);

const store = (files: Record<string, string>, created: string) =>
  writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
    [`${CHANGE}/.openspec.yaml`]: `schema: demo-planning\ncreated: ${created}\n`,
    [`${CHANGE}/proposal.md`]: PROPOSAL,
    [`${CHANGE}/decisions.md`]: DECISIONS,
    [`${CHANGE}/tasks.md`]: "## 1. Build it\n\n- [x] 1.1 Ship it\n",
    ...files,
  });

/** A change opened after the fence, and one opened the day the rule landed —
 * the day before the fence, which is what the fence being the morning after
 * means. */
const AFTER = "2026-10-01";
const LANDED = "2026-09-19";

const findings = async (
  files: Record<string, string>,
  created = AFTER,
  rule = "round",
): Promise<Finding[]> => {
  const result: { findings: Finding[] } = await runChecks(
    store(files, created),
    NO_GIT,
  );
  return result.findings.filter((one) => one.rule === rule);
};

describe("the rounds record, read off the change", () => {
  it("reads one row per round, in the columns the requirement tables", () => {
    const [first, second] = readRounds(
      ROUNDS(
        row(1, "proposal", {
          perspectives: "product, qa, simpler",
          stood: "the goal was two goals",
          asked: "Q1, Q2",
        }),
        row(2, "1", { tests: "demo-SC-01: test/one.test.ts" }),
      ),
    );

    expect(first).toEqual({
      round: 1,
      artifact: "proposal",
      perspectives: "product, qa, simpler",
      stood: "the goal was two goals",
      asked: "Q1, Q2",
      tests: "-",
    });
    expect(second.round).toBe(2);
    expect(second.artifact).toBe("1");
    expect(second.tests).toBe("demo-SC-01: test/one.test.ts");
  });

  it("reads a file with a header and no row as no round yet", () => {
    expect(readRounds(ROUNDS())).toEqual([]);
  });

  it("keeps a cell the round left empty empty, for the rule to refuse", () => {
    const [only] = readRounds(ROUNDS("| 1 | proposal |  | it stood | - | - |"));

    expect(only.perspectives).toBe("");
  });

  it("carries the rows onto the change entry, absent until the file is", () => {
    const withFile = readChanges(
      store({ [`${CHANGE}/rounds.md`]: WHOLE }, AFTER),
      NO_GIT,
      null,
    ).find((one) => one.id === ID);
    const without = readChanges(store({}, AFTER), NO_GIT, null).find(
      (one) => one.id === ID,
    );

    expect(withFile?.rounds).toHaveLength(4);
    expect(withFile?.rounds?.[2].artifact).toBe("tasks");
    expect(without?.rounds).toBeUndefined();
  });
});

describe("the `round` rule", () => {
  it("says nothing about a change whose every landing carries a row", async () => {
    expect(await findings({ [`${CHANGE}/rounds.md`]: WHOLE })).toEqual([]);
  });

  it("names a written artifact no row names", async () => {
    const found = await findings({
      [`${CHANGE}/rounds.md`]: ROUNDS(
        row(1, "proposal"),
        row(2, "decisions"),
        row(3, "1", { tests: "demo-SC-01: test/one.test.ts" }),
      ),
    });

    expect(found).toHaveLength(1);
    expect(found[0].level).toBe("fail");
    expect(found[0].path).toBe(`${CHANGE}/rounds.md`);
    expect(found[0].reason).toContain("`tasks`");
  });

  it("names a ticked group no row names", async () => {
    const found = await findings({
      [`${CHANGE}/rounds.md`]: ROUNDS(
        row(1, "proposal"),
        row(2, "decisions"),
        row(3, "tasks"),
      ),
    });

    expect(found).toHaveLength(1);
    expect(found[0].reason).toContain("group 1");
  });

  it("names the column a row leaves empty", async () => {
    const found = await findings({
      [`${CHANGE}/rounds.md`]: ROUNDS(
        "| 1 | proposal |  | it stood | - | - |",
        row(2, "decisions"),
        row(3, "tasks"),
        row(4, "1", { tests: "demo-SC-01: test/one.test.ts" }),
      ),
    });

    expect(found).toHaveLength(1);
    expect(found[0].reason).toContain("Perspectives");
    expect(found[0].reason).toContain("proposal");
  });

  it("refuses a change carrying no `rounds.md` at all", async () => {
    const found = await findings({});

    expect(found.length).toBeGreaterThan(0);
    expect(found.map((one) => one.reason).join(" ")).toContain("`proposal`");
  });

  it("does not refuse a change opened the day the rule landed", async () => {
    expect(ROUND_RECORD_SINCE > LANDED).toBe(true);
    expect(await findings({}, LANDED)).toEqual([]);
  });

  it("does not refuse a change opened before that day", async () => {
    expect(await findings({}, "2026-09-01")).toEqual([]);
  });
});

describe("a `Q<n>` cited in backticks", () => {
  it("says nothing where the change's decisions table issues it", async () => {
    expect(
      await findings(
        {
          [`${CHANGE}/rounds.md`]: WHOLE,
          [`${CHANGE}/tech-design.md`]: "The row is `Q1`'s answer.\n",
        },
        AFTER,
        "cited",
      ),
    ).toEqual([]);
  });

  it("names one the table does not issue", async () => {
    const found = await findings(
      {
        [`${CHANGE}/rounds.md`]: WHOLE,
        [`${CHANGE}/tech-design.md`]: "The row is `Q9`'s answer.\n",
      },
      AFTER,
      "cited",
    );

    expect(found).toHaveLength(1);
    expect(found[0].level).toBe("fail");
    expect(found[0].path).toBe(`${CHANGE}/tech-design.md`);
    expect(found[0].reason).toContain("`Q9`");
  });
});
