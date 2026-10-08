import { describe, expect, it } from "vitest";
import { WALK_LAST_SINCE } from "../check/planned.mjs";
import { demoSchema } from "./demo-schema";
import { findingsOf, recordStoreFiles } from "./record-store";

/** The plan's last group is the walk. It may use the draft suite without
 * turning downstream human review into a task or dependency. */

const SCHEMA = demoSchema(["proposal", "specs", "tasks"]);
const CHANGE = "walk-probe";

const DRAFT_INPUT = "Uses draft `feature-tcs.md` as its planning input.";

const group = (num: number, title: string, prose: string) => [
  `## ${num}. ${title} (grade10-spec)`,
  "",
  prose,
  "",
  `- [ ] ${num}.1 Do it`,
  `- [ ] ${num}.2 Verify: \`pnpm run test:walk\``,
  "",
];

const tasks = (lines: string[]) =>
  recordStoreFiles({
    change: CHANGE,
    schema: SCHEMA,
    record: "",
    title: "Walk probe",
    files: { [`openspec/changes/${CHANGE}/tasks.md`]: lines.join("\n") },
  });

const plan = (walk: string) =>
  tasks([
    "## 1. Build it (grade10-spec)",
    "",
    "- [ ] 1.1 Ship it",
    "- [ ] 1.2 Verify: `pnpm run lint`",
    "",
    ...group(2, "The walk", walk),
  ]);

describe("the walk group does not owe a suite-review dependency", () => {
  // Proves part of shared-planning-agent-rounds-US11-TC2-1.
  it("shared-planning-agent-rounds-SC-90 - accepts a walk that uses no review dependency", async () => {
    const found = await findingsOf(plan("Needs group 1 landed."), "walk");
    expect(found).toEqual([]);
  });

  it("does not treat a review placeholder as a planning gate", async () => {
    const found = await findingsOf(
      plan(
        "Needs `feature-tcs.md` reviewed (`/tcs-review <change>`) as its input.",
      ),
      "walk",
    );
    expect(found).toEqual([]);
  });

  it("says nothing where legacy prose still names review as an input", async () => {
    const found = await findingsOf(
      plan(
        "Needs group 1 landed and `feature-tcs.md` reviewed (`/tcs-review walk-probe`) as its input.",
      ),
      "walk",
    );
    expect(found).toEqual([]);
  });

  it("says nothing about a plan with no walk group yet", async () => {
    const files = recordStoreFiles({
      change: CHANGE,
      schema: SCHEMA,
      record: "",
      title: "Walk probe",
      files: {
        [`openspec/changes/${CHANGE}/tasks.md`]:
          "## 1. Build it (grade10-spec)\n\n- [ ] 1.1 Ship it\n",
      },
    });
    expect(await findingsOf(files, "walk")).toEqual([]);
  });

  it("reads a group whose title only starts like the walk as another group", async () => {
    const files = tasks([
      ...group(1, "The walk-in form", "Builds the form."),
      ...group(2, "The walk", DRAFT_INPUT),
    ]);
    expect(await findingsOf(files, "walk")).toEqual([]);
  });

  it("does not hold split walk groups on review wording", async () => {
    const files = tasks([
      ...group(1, "The walk — the drop-off", DRAFT_INPUT),
      ...group(2, "The walk — the hand-back", "Needs group 1 landed."),
    ]);
    const found = await findingsOf(files, "walk");
    expect(found).toEqual([]);
  });

  it("reads the walk behind its repository and owner tags", async () => {
    const files = tasks([
      "## 1. The walk (grade10) (owner: @tester)",
      "",
      "Needs group 0 landed.",
      "",
      "- [ ] 1.1 Walk it",
      "",
    ]);
    expect(await findingsOf(files, "walk")).toEqual([]);
  });
});

/** A change opened the day the title became a rule, specifying `alpha` with
 * the journeys file given; a durable `alpha` is the caller's to add. */
const owing = (
  groups: string[],
  journeys: string | undefined,
  created = WALK_LAST_SINCE,
  extra: Record<string, string> = {},
) =>
  recordStoreFiles({
    change: CHANGE,
    schema: SCHEMA,
    record: "",
    title: "Walk probe",
    files: {
      [`openspec/changes/${CHANGE}/.openspec.yaml`]: `schema: demo-planning\ncreated: ${created}\n`,
      [`openspec/changes/${CHANGE}/tasks.md`]: groups.join("\n"),
      ...(journeys === undefined
        ? {}
        : {
            [`openspec/changes/${CHANGE}/specs/demo-product/alpha/user-journeys.md`]:
              journeys,
          }),
      ...extra,
    },
  });

const STORIES = [
  "## User journeys",
  "",
  "### demo-product-alpha-US-01: Someone does the thing",
  "",
  "They open alpha and do the thing.",
  "",
].join("\n");

const NOBODY =
  "## User journeys\n\n**Walked by:** nobody on their own - a policy nobody reaches\n";

const BUILD = group(1, "Build it", "Builds it.");

/** A plan ending on no walk, over a durable `alpha` that somebody walks and
 * the change's own journeys file given. */
const beside = (own: string | undefined) =>
  owing([...BUILD, ...group(2, "Verify", "Checks it.")], own, WALK_LAST_SINCE, {
    [`openspec/changes/${CHANGE}/specs/demo-product/alpha/spec.md`]:
      "## ADDED Requirements\n",
    "openspec/specs/demo-product/alpha/spec.md":
      "# Alpha\n\n## Purpose\n\nSo a durable alpha exists.\n\n## Requirements\n",
    "openspec/specs/demo-product/alpha/user-journeys.md": STORIES,
  });

describe("a change with walks ends its plan on the walk", () => {
  it("refuses a walked change whose last group is not titled the walk", async () => {
    const found = await findingsOf(
      owing([...BUILD, ...group(2, "Walk", DRAFT_INPUT)], STORIES),
      "walk_last",
    );
    expect(found).toHaveLength(1);
    expect(found[0].level).toBe("fail");
    expect(found[0].path).toBe(`openspec/changes/${CHANGE}/tasks.md`);
    expect(found[0].reason).toContain("`2. Walk`");
  });

  it("refuses a walk that work was added after", async () => {
    const found = await findingsOf(
      owing(
        [
          ...group(1, "The walk", DRAFT_INPUT),
          ...group(2, "The manual", "Writes the page."),
        ],
        STORIES,
      ),
      "walk_last",
    );
    expect(found).toHaveLength(1);
  });

  it("takes the walk, split or not, behind its tags", async () => {
    for (const title of ["The walk", "The walk - the hand-back", "The Walk"]) {
      const files = owing(
        [
          ...BUILD,
          `## 2. ${title} (grade10) (owner: @tester)`,
          "",
          DRAFT_INPUT,
        ],
        STORIES,
      );
      expect(await findingsOf(files, "walk_last")).toEqual([]);
    }
  });

  it("reads a capability with no journeys of its own by its durable ones", async () => {
    expect(await findingsOf(beside(undefined), "walk_last")).toHaveLength(1);
  });

  it("owes no walk where the change says nobody walks the capability", async () => {
    expect(await findingsOf(beside(NOBODY), "walk_last")).toEqual([]);
  });

  it("reads the durable journeys behind an own file that holds none", async () => {
    for (const own of [
      "## User journeys\n",
      "## REMOVED User journeys\n\n### demo-product-alpha-US-02: Gone\n",
    ]) {
      expect(await findingsOf(beside(own), "walk_last")).toHaveLength(1);
    }
  });

  it("owes nothing before the plan holds a group", async () => {
    expect(await findingsOf(owing([], STORIES), "walk_last")).toEqual([]);
  });

  it("holds no plan opened before the rule", async () => {
    const files = owing(
      [...BUILD, ...group(2, "Walk", DRAFT_INPUT)],
      STORIES,
      "2026-10-02",
    );
    expect(await findingsOf(files, "walk_last")).toEqual([]);
  });
});
