import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { handOf, stageOf } from "../src/api/stages.ts";
import { waivedOf } from "../src/api/waivers";
import { NO_GIT } from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import { writeStore } from "./tmp-store";

/**
 * The keys this change adds to a change's record: who takes it at each stage,
 * whose word landed each artifact, what was read again, where its thread is,
 * the UI design it does not owe, and the release it went out in.
 *
 * Every one is read the way the record's keys already are — absent waives
 * nothing, and anything that is not a line of text is a malformed manifest
 * rather than a silence. `written` keeps its meaning of a file that exists,
 * so nothing that counts files sees a waiver as one.
 */

const CHANGE = "openspec/changes/key-probe";

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    teammate: product-manager",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "    upstream: []",
  "  - id: decisions",
  "    teammate: product-manager",
  "    required: true",
  "    generates: decisions.md",
  "    requires:",
  "      - proposal",
  "    upstream:",
  "      - proposal",
  "  - id: ui-design",
  "    teammate: designer",
  "    required: false",
  "    generates: ui-design.md",
  "    requires:",
  "      - decisions",
  "    upstream:",
  "      - proposal",
  "  - id: tech-design",
  "    teammate: engineer",
  "    required: false",
  "    generates: tech-design.md",
  "    requires:",
  "      - decisions",
  "    upstream:",
  "      - proposal",
  "  - id: specs",
  "    required: true",
  "    generates: specs/**/spec.md",
  "    requires:",
  "      - decisions",
  "    upstream:",
  "      - proposal",
  "",
].join("\n");

const PROPOSAL = [
  "# Key probe",
  "",
  "## Why",
  "",
  "So the reader has a record to read.",
  "",
].join("\n");

/** The change as the store reads it, with the record the case is about. */
function changeWith(record: string) {
  const root = writeStore({
    "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
    [`${CHANGE}/.openspec.yaml`]: `schema: demo-planning\ncreated: 2026-09-18\n${record}`,
    [`${CHANGE}/proposal.md`]: PROPOSAL,
  });
  const [entry] = readChanges(root, NO_GIT, null);
  return { entry, root };
}

/** What the record refused, as the `store` rule would report it. */
const refusalOf = (record: string) => changeWith(record).entry.error?.message;

describe("the hands a change names", () => {
  it("reads one handle per role", () => {
    const { entry } = changeWith(
      ["hands:", "  pm: ecchochan", "  design: '@Dana'", ""].join("\n"),
    );

    expect(entry.error).toBeUndefined();
    expect(entry.hands).toEqual({ pm: "ecchochan", design: "dana" });
  });

  it("says nothing where the key is absent", () => {
    expect(changeWith("").entry.hands).toBeUndefined();
  });

  it("keeps a role the six do not hold, for the rule to refuse", () => {
    const { entry } = changeWith(["hands:", "  ops: dana", ""].join("\n"));

    expect(entry.error).toBeUndefined();
    expect(entry.hands).toEqual({ ops: "dana" });
  });

  it("keeps a value that is not one handle, for the rule to refuse", () => {
    const { entry } = changeWith(
      ["hands:", "  pm: dana and robin", ""].join("\n"),
    );

    expect(entry.error).toBeUndefined();
    expect(entry.hands).toEqual({ pm: "dana and robin" });
  });

  it("refuses a record whose hands are not a mapping", () => {
    expect(refusalOf("hands: dana\n")).toMatch(/`hands` must be a mapping/);
  });

  it("refuses a role given a list", () => {
    expect(
      refusalOf(
        ["hands:", "  pm:", "    - dana", "    - robin", ""].join("\n"),
      ),
    ).toMatch(/`hands.pm`/);
  });
});

describe("an id a record answers with nothing", () => {
  // One sentence for all three keys: a blank entry claims the id is answered
  // and answers it with nobody, which no rule downstream could tell from a
  // typo. Which line was owed is the rule's to say, not the reader's.
  it.each(["hands: pm", "landed_by: decisions", "reviewed: specs"])(
    "refuses `%s` written blank",
    (entry) => {
      const [key, id] = entry.split(": ");

      expect(refusalOf([`${key}:`, `  ${id}: ''`, ""].join("\n"))).toBe(
        `\`${key}.${id}\` must be a line of text`,
      );
    },
  );
});

describe("who landed each artifact", () => {
  it("reads one handle per artifact id", () => {
    const { entry } = changeWith(
      ["landed_by:", "  decisions: ecchochan", "  ui-design: '@Dana'", ""].join(
        "\n",
      ),
    );

    expect(entry.error).toBeUndefined();
    expect(entry.landedBy).toEqual({
      decisions: "ecchochan",
      "ui-design": "dana",
    });
  });

  it("says nothing where the key is absent", () => {
    expect(changeWith("").entry.landedBy).toBeUndefined();
  });

  it("refuses a record whose landings are not a mapping", () => {
    expect(refusalOf("landed_by: dana\n")).toMatch(
      /`landed_by` must be a mapping/,
    );
  });
});

describe("what was read again", () => {
  it("reads one content id per artifact id", () => {
    const { entry } = changeWith(
      ["reviewed:", "  specs: 1a2b3c4d", ""].join("\n"),
    );

    expect(entry.error).toBeUndefined();
    expect(entry.reviewed).toEqual({ specs: "1a2b3c4d" });
  });

  it("says nothing where the key is absent", () => {
    expect(changeWith("").entry.reviewed).toBeUndefined();
  });

  it("refuses a record whose read marks are not a mapping", () => {
    expect(refusalOf("reviewed: 1a2b3c4d\n")).toMatch(
      /`reviewed` must be a mapping/,
    );
  });
});

describe("the lines beside them", () => {
  it("reads the thread, the waived UI design and the release", () => {
    const { entry } = changeWith(
      [
        "thread: C0123ABCD/1758240000.123456",
        'ui_waived: "nothing a reader sees moves"',
        "released_in: v4.19.0",
        "",
      ].join("\n"),
    );

    expect(entry.error).toBeUndefined();
    expect(entry.thread).toBe("C0123ABCD/1758240000.123456");
    expect(entry.uiWaived).toBe("nothing a reader sees moves");
    expect(entry.releasedIn).toBe("v4.19.0");
  });

  it("says nothing where each key is absent", () => {
    const { entry } = changeWith("");

    expect(entry.thread).toBeUndefined();
    expect(entry.uiWaived).toBeUndefined();
    expect(entry.releasedIn).toBeUndefined();
  });

  it("refuses a waiver written as a flag rather than a reason", () => {
    expect(refusalOf("ui_waived: true\n")).toMatch(
      /`ui_waived` must be a line of text/,
    );
  });

  it("refuses a thread that is not a line of text", () => {
    expect(refusalOf("thread:\n  - C0123ABCD\n")).toMatch(
      /`thread` must be a line of text/,
    );
  });

  it("refuses a release that is not a line of text", () => {
    expect(refusalOf("released_in: 419\n")).toMatch(
      /`released_in` must be a line of text/,
    );
  });
});

describe("what a record waives", () => {
  const waivedBy = (record: string) => {
    const { entry, root } = changeWith(record);
    return waivedOf(schemaArtifacts(root, "demo-planning") ?? [], entry);
  };

  it("stands the UI waiver for the UI design and the design waiver for the tech design", () => {
    const waived = waivedBy(
      [
        'ui_waived: "nothing a reader sees moves"',
        'design_waived: "all here"',
        "",
      ].join("\n"),
    );

    expect([...waived].sort()).toEqual(["tech-design", "ui-design"]);
  });

  it("stands one waiver for one design and leaves the other owed", () => {
    expect([...waivedBy('ui_waived: "no screen"\n')]).toEqual(["ui-design"]);
  });

  it("keeps the decisions waiver it already stood for", () => {
    expect([...waivedBy('decisions_waived: "nothing to settle"\n')]).toEqual([
      "decisions",
    ]);
  });

  it("waives nothing where no line says so", () => {
    expect(waivedBy("").size).toBe(0);
  });

  it("never counts a waiver as a file that exists", () => {
    const { entry, root } = changeWith(
      ['ui_waived: "no screen"', 'design_waived: "all here"', ""].join("\n"),
    );

    expect(entry.written).toEqual(["proposal"]);
    expect([
      ...waivedOf(schemaArtifacts(root, "demo-planning") ?? [], entry),
    ]).toEqual(["ui-design", "tech-design"]);
  });
});

/**
 * A schema naming `user-journeys`, so a capability's journeys file can be
 * checked as written before its `spec.md` exists — `SCHEMA` above never
 * issues that id, since the record tests it stands in for have no use for it.
 */
const SCHEMA_WITH_JOURNEYS = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    teammate: product-manager",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "    upstream: []",
  "  - id: decisions",
  "    teammate: product-manager",
  "    required: true",
  "    generates: decisions.md",
  "    requires:",
  "      - proposal",
  "    upstream:",
  "      - proposal",
  "  - id: user-journeys",
  "    teammate: product-manager",
  "    required: true",
  "    generates: specs/**/user-journeys.md",
  "    requires:",
  "      - decisions",
  "    upstream:",
  "      - proposal",
  "      - decisions",
  "  - id: ui-design",
  "    teammate: designer",
  "    required: false",
  "    generates: ui-design.md",
  "    requires:",
  "      - user-journeys",
  "    upstream:",
  "      - proposal",
  "      - decisions",
  "      - user-journeys",
  "  - id: tech-design",
  "    teammate: engineer",
  "    required: false",
  "    generates: tech-design.md",
  "    requires:",
  "      - user-journeys",
  "    upstream:",
  "      - proposal",
  "      - decisions",
  "      - user-journeys",
  "  - id: specs",
  "    required: true",
  "    generates: specs/**/spec.md",
  "    requires:",
  "      - user-journeys",
  "    upstream:",
  "      - proposal",
  "      - decisions",
  "      - user-journeys",
  "      - ui-design",
  "      - tech-design",
  "",
].join("\n");

const JOURNEY_CHANGE = "openspec/changes/journey-probe";

describe("what counts as written before the outline lands", () => {
  it("shared-planning-change-stages-SC-15 - the journeys count once landed, before spec.md exists", () => {
    const root = writeStore({
      "openspec/schemas/demo-planning/schema.yaml": SCHEMA_WITH_JOURNEYS,
      [`${JOURNEY_CHANGE}/.openspec.yaml`]: [
        "schema: demo-planning",
        "created: 2026-09-18",
        "hands:",
        "  pm: robin",
        "  design: dana",
        "  tech: kim",
        "",
      ].join("\n"),
      [`${JOURNEY_CHANGE}/proposal.md`]: PROPOSAL,
      [`${JOURNEY_CHANGE}/decisions.md`]: "## Goals\n\n- One outcome.\n",
      [`${JOURNEY_CHANGE}/specs/demo/alpha/user-journeys.md`]:
        "**Walked by:** nobody on their own - a policy nobody reaches\n",
    });
    const [entry] = readChanges(root, NO_GIT, null);
    const artifacts = schemaArtifacts(root, "demo-planning") ?? [];

    expect(entry.error).toBeUndefined();
    // The journeys count as written with no `spec.md` beside them yet.
    expect(entry.written).toEqual(
      expect.arrayContaining(["proposal", "decisions", "user-journeys"]),
    );
    expect(entry.written).not.toContain("specs");
    // The stage stays Proposed, and its second half hands the change to the
    // designer and the tech PIC — the order `CLAUDE.md` documents, where
    // neither hand opens `spec.md`.
    expect(stageOf(entry, artifacts)).toBe("proposed");
    expect(handOf(entry, "proposed", artifacts)).toEqual(["design", "tech"]);
  });
});

/** The checker over a store that waives an artifact and writes a wait on it. */
type Finding = { rule: string; level: string; path: string; reason: string };

async function findings(record: string): Promise<Finding[]> {
  const root = writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
    [`${CHANGE}/.openspec.yaml`]: `schema: demo-planning\ncreated: 2026-09-18\n${record}`,
    [`${CHANGE}/proposal.md`]: PROPOSAL,
  });
  const result: { findings: Finding[] } = await runChecks(root, NO_GIT);
  return result.findings.filter((one) => one.rule === "awaiting");
}

describe("a waiver beside a wait", () => {
  it("is refused, naming the artifact both lines are about", async () => {
    const [found] = await findings(
      [
        'ui_waived: "nothing a reader sees moves"',
        "awaiting:",
        "  ui-design: a designer has not looked at it",
        "",
      ].join("\n"),
    );

    expect(found?.path).toBe(`${CHANGE}/.openspec.yaml`);
    expect(found?.reason).toContain("ui-design");
    expect(found?.reason).toMatch(/waives/);
  });

  it("names the line that waived it, `skip_specs` among them", async () => {
    // One rule for all four waivers: the wait and the waiver contradict each
    // other whichever line stood for the artifact.
    const [found] = await findings(
      [
        "skip_specs: true",
        "skip_specs_why: a lint sweep moves no behaviour",
        "awaiting:",
        "  specs: the second pass is QA's",
        "",
      ].join("\n"),
    );

    expect(found?.reason).toContain("waives `specs` with `skip_specs`");
  });

  it("says nothing about a wait on an artifact nothing waives", async () => {
    expect(
      await findings(
        [
          'ui_waived: "nothing a reader sees moves"',
          "awaiting:",
          "  tech-design: engineer pick-up",
          "",
        ].join("\n"),
      ),
    ).toEqual([]);
  });
});
