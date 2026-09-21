import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { readRounds } from "../src/store/read-rounds.mts";
import { demoSchema } from "./demo-schema";
import { writeStore } from "./tmp-store";

/**
 * `rounds.md` is the change's record of what each round ran, and the `round`
 * rule refuses work already done that no row names.
 *
 * Two readings here. The reader: one row per round, the columns as the
 * requirement tables them, absent until the first round writes the file. And
 * the rule: a landed artifact (`landed_by:`, never a file's mere presence) or
 * a ticked group with no row, and a row that leaves a column empty, on a
 * change on the round — every change already in
 * flight that day passes the same check, and one whose first round has not
 * landed carries no record at all.
 */

type Finding = { rule: string; level: string; path: string; reason: string };

const ID = "round-probe";
const CHANGE = `openspec/changes/${ID}`;

const SCHEMA = demoSchema(["proposal", "decisions", "tasks"]);

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

/** `landed_by:` for a change that has landed every artifact — what the
 * `round` rule now keys its artifact half on, rather than a file's mere
 * presence on disk. */
const LANDED_BY_ALL =
  "landed_by:\n  proposal: pm\n  decisions: pm\n  tasks: dev\n";

const store = (
  files: Record<string, string>,
  created: string,
  landedBy = LANDED_BY_ALL,
) =>
  writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
    [`${CHANGE}/.openspec.yaml`]: `schema: demo-planning\ncreated: ${created}\n${landedBy}`,
    [`${CHANGE}/proposal.md`]: PROPOSAL,
    [`${CHANGE}/decisions.md`]: DECISIONS,
    [`${CHANGE}/tasks.md`]: "## 1. Build it\n\n- [x] 1.1 Ship it\n",
    ...files,
  });

/** The day the fixture changes were opened, and the archived copy's prefix.
 * No day is set for the fence while the kept skills stand, so what holds a
 * change is being on the round; `roundsSince` sets one where a case needs it. */
const OPENED = "2026-10-01";

const findings = async (
  files: Record<string, string>,
  created = OPENED,
  rule = "round",
  landedBy = LANDED_BY_ALL,
  roundsSince?: string,
): Promise<Finding[]> => {
  const result: { findings: Finding[] } = await runChecks(
    store(files, created, landedBy),
    NO_GIT,
    roundsSince ? { roundsSince } : {},
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

  it("shared-planning-agent-rounds-SC-51 - carries the rows onto the change entry, absent until the file is", () => {
    const withFile = readChanges(
      store({ [`${CHANGE}/rounds.md`]: WHOLE }, OPENED),
      NO_GIT,
      null,
    ).find((one) => one.id === ID);
    const without = readChanges(store({}, OPENED), NO_GIT, null).find(
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

  it("shared-planning-agent-rounds-SC-54 - names a landed artifact no row names", async () => {
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

  it("says nothing about an artifact that is written but not yet landed", async () => {
    // The proposal's row puts the change on the round; `landed_by:` names
    // nothing else, so nothing else owes a row — a draft artifact on the
    // branch, not yet landed by a hand's word, is not a round the rule has
    // anything to check.
    expect(
      await findings(
        {
          [`${CHANGE}/tasks.md`]: "## 1. Build it\n\n- [ ] 1.1 Ship it\n",
          [`${CHANGE}/rounds.md`]: ROUNDS(row(1, "proposal")),
        },
        OPENED,
        "round",
        "",
      ),
    ).toEqual([]);
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

  it("shared-planning-agent-rounds-SC-56 - names the column a row leaves empty", async () => {
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

  it("shared-planning-agent-rounds-SC-53 - a change whose first round has not landed carries no rounds.md and is not refused", async () => {
    // Held by its one row, with nothing landed and nothing ticked: the rule
    // reads it and finds nothing owed.
    const found = await findings(
      {
        [`${CHANGE}/tasks.md`]: "## 1. Build it\n\n- [ ] 1.1 Ship it\n",
        [`${CHANGE}/rounds.md`]: ROUNDS(row(1, "proposal")),
      },
      OPENED,
      "round",
      "",
    );

    expect(found).toEqual([]);
  });

  it("shared-planning-agent-rounds-SC-55 - does not refuse a change on the old flow, whatever its date", async () => {
    // No `landed_by:` line and no row: the change was opened and its group
    // ticked with the old skills, which stand until the team adopts the line
    // commands (`Q95`), so no day is set for the fence yet.
    expect(await findings({}, OPENED, "round", "")).toEqual([]);
    expect(await findings({}, "2026-09-01", "round", "")).toEqual([]);
  });

  it("shared-planning-agent-rounds-SC-84 - holds every change from the day the kept skills go, once it is set", async () => {
    // The same old-flow shape, read with the day set: created on the day, its
    // ticked group is refused; created the day before, it still owes nothing.
    const onTheDay = await findings({}, OPENED, "round", "", OPENED);
    expect(onTheDay).toHaveLength(1);
    expect(onTheDay[0].reason).toContain("group 1");
    expect(await findings({}, "2026-09-30", "round", "", OPENED)).toEqual([]);
  });
});

describe("the archived copy of the round record", () => {
  const ARCHIVE_DIR = `openspec/changes/archive/${OPENED}-${ID}`;
  const archivedStore = (withRounds: boolean, onTheRound = true) =>
    writeStore({
      "docs/prds/manual.yaml":
        "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
      "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
      "docs/prds/products/demo-product/index.md":
        "---\ntitle: Demo product\n---\n\nThe landing.\n",
      "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
      // On the round, its landings wrote `landed_by:`, so the copy owes the
      // rows; an old-flow archive carries no such line and owes none.
      [`${ARCHIVE_DIR}/.openspec.yaml`]: `schema: demo-planning\ncreated: ${OPENED}\n${onTheRound ? "landed_by:\n  proposal: pm\n" : ""}`,
      [`${ARCHIVE_DIR}/proposal.md`]: PROPOSAL,
      ...(withRounds ? { [`${ARCHIVE_DIR}/rounds.md`]: WHOLE } : {}),
    });

  it("shared-planning-agent-rounds-SC-52 - refuses an archived copy that left rounds.md behind", async () => {
    const result = await runChecks(archivedStore(false), NO_GIT);
    const found = result.findings.filter((one) => one.rule === "round");

    expect(found).toHaveLength(1);
    expect(found[0].path).toBe(`${ARCHIVE_DIR}/rounds.md`);
    expect(found[0].reason).toContain("is not in the archived copy");
  });

  it("shared-planning-agent-rounds-SC-52 - says nothing where an archived old-flow copy carries no rounds.md", async () => {
    // No `landed_by:` line and no day set: archived from the old flow, whose
    // changes owed no row (`Q96`).
    const result = await runChecks(archivedStore(false, false), NO_GIT);

    expect(result.findings.filter((one) => one.rule === "round")).toEqual([]);
  });

  it("shared-planning-agent-rounds-SC-52 - says nothing where the archived copy carries rounds.md", async () => {
    const result = await runChecks(archivedStore(true), NO_GIT);
    const found = result.findings.filter((one) => one.rule === "round");

    expect(found).toEqual([]);
  });
});
