import { describe, expect, it } from "vitest";
import { demoSchema } from "./demo-schema";
import { findingsOf, recordStoreFiles } from "./record-store";

/** The plan's last group is the walk, and it names the suite's review as its
 * input: QA is asked on the landing of the requirements, and the walk says
 * it waits on what they sign (`shared-planning-agent-rounds-SC-90`). */

const SCHEMA = demoSchema(["proposal", "specs", "tasks"]);
const CHANGE = "walk-probe";

const REVIEWED =
  "Needs `feature-tcs.md` reviewed (`/tcs-review walk-probe`) as its input.";

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

describe("the walk group names the suite's review", () => {
  // Proves part of shared-planning-agent-rounds-US11-TC2-1.
  it("shared-planning-agent-rounds-SC-90 - refuses a plan whose walk group names no review", async () => {
    const found = await findingsOf(plan("Needs group 1 landed."), "walk");
    expect(found).toHaveLength(1);
    expect(found[0].level).toBe("fail");
    expect(found[0].path).toBe(`openspec/changes/${CHANGE}/tasks.md`);
    expect(found[0].reason).toContain("/tcs-review walk-probe");
  });

  it("refuses the template's placeholder in place of this change's review", async () => {
    const found = await findingsOf(
      plan(
        "Needs `feature-tcs.md` reviewed (`/tcs-review <change>`) as its input.",
      ),
      "walk",
    );
    expect(found).toHaveLength(1);
  });

  it("shared-planning-agent-rounds-SC-90 - says nothing where the walk group names the review as its input", async () => {
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
      ...group(2, "The walk", REVIEWED),
    ]);
    expect(await findingsOf(files, "walk")).toEqual([]);
  });

  it("holds every group of a split walk to the review", async () => {
    const files = tasks([
      ...group(1, "The walk — the drop-off", REVIEWED),
      ...group(2, "The walk — the hand-back", "Needs group 1 landed."),
    ]);
    const found = await findingsOf(files, "walk");
    expect(found).toHaveLength(1);
    expect(found[0].reason).toContain("2. The walk — the hand-back");
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
    expect(await findingsOf(files, "walk")).toHaveLength(1);
  });
});
