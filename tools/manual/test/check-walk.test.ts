import { describe, expect, it } from "vitest";
import { demoSchema } from "./demo-schema";
import { findingsOf, recordStoreFiles } from "./record-store";

/** The plan's last group is the walk, and it names the suite's review as its
 * input: QA is asked on the landing of the requirements, and the walk says
 * it waits on what they sign (`shared-planning-agent-rounds-SC-90`). */

const SCHEMA = demoSchema(["proposal", "specs", "tasks"]);
const CHANGE = "walk-probe";

const plan = (walk: string) =>
  recordStoreFiles({
    change: CHANGE,
    schema: SCHEMA,
    record: "",
    title: "Walk probe",
    files: {
      [`openspec/changes/${CHANGE}/tasks.md`]: [
        "## 1. Build it (grade10-spec)",
        "",
        "- [ ] 1.1 Ship it",
        "- [ ] 1.2 Verify: `pnpm run lint`",
        "",
        "## 2. The walk (grade10-spec)",
        "",
        walk,
        "",
        "- [ ] 2.1 Walk the journeys",
        "- [ ] 2.2 Verify: `pnpm run test:walk`",
        "",
      ].join("\n"),
    },
  });

describe("the walk group names the suite's review", () => {
  // Decides shared-planning-agent-rounds-US11-TC2-1.
  it("shared-planning-agent-rounds-SC-90 - refuses a plan whose walk group names no review", async () => {
    const found = await findingsOf(plan("Needs group 1 landed."), "walk");
    expect(found).toHaveLength(1);
    expect(found[0].level).toBe("fail");
    expect(found[0].path).toBe(`openspec/changes/${CHANGE}/tasks.md`);
    expect(found[0].reason).toContain("/tcs-review");
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
});
