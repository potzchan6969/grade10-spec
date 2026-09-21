import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { laneOf } from "../src/api/derive";
import { OVERLAYS, type Overlay, overlaysOf } from "../src/api/overlays.ts";
import { draftedOf, movedBy, moveShown } from "../src/api/stage-view.ts";
import {
  handOf,
  handOfArtifact,
  ladderOf,
  laneOfStage,
  laterRolesOf,
  openHands,
  STAGES,
  stageOf,
} from "../src/api/stages.ts";
import type {
  ChangeEntry,
  ChangeSuite,
  SchemaArtifact,
  Stage,
} from "../src/api/types";
import { NO_GIT } from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import { changeEntry } from "./manual-fixture";
import { realStore, storeRoot } from "./real-store";
import { writeStore } from "./tmp-store";

/**
 * Where a change stands, whose turn it is, and what sits beside the stage.
 *
 * The ladder is read from the files on `main` and nothing else: a rung is
 * proven by what the change has written, a waiver stands for the design it
 * names, and a proof that leaves `main` drops the stage to the furthest rung
 * still proven. Every fixture here is one rung of that ladder or one boundary
 * of it, read against the planning schema the store itself declares — a
 * second list of artifact ids here would drift from it.
 */

const ARTIFACTS = schemaArtifacts(storeRoot, "grade10-planning");

function artifacts(): SchemaArtifact[] {
  if (!ARTIFACTS) throw new Error("the store declares no grade10-planning");
  return ARTIFACTS;
}

const HANDS = {
  pm: "robin",
  design: "dana",
  tech: "kim",
  dev: "sam",
  qa: "ari",
  release: "lee",
};

const group = (done: number, total: number) => ({
  title: "Contracts",
  repo: "grade10-spec",
  done,
  total,
});

const PROPOSED = ["proposal", "decisions", "user-journeys"];

/** A change written as far as one rung of the ladder, and no further. */
function at(rung: Stage, extra: Partial<ChangeEntry> = {}): ChangeEntry {
  const written = [...PROPOSED];
  const fields: Partial<ChangeEntry> = { hands: { ...HANDS } };
  const step = STAGES.indexOf(rung);
  const from = (one: Stage) => step >= STAGES.indexOf(one);
  if (from("designed")) written.push("ui-design", "tech-design");
  if (from("specified")) written.push("specs", "test-cases");
  if (from("planned")) {
    written.push("tasks");
    fields.promotedBy = "sam";
    fields.taskGroups = [group(0, 3)];
  }
  if (from("building")) fields.taskGroups = [group(1, 3)];
  if (from("on-staging")) {
    fields.taskGroups = [group(3, 3)];
    fields.deployedEnv = "staging";
  }
  if (from("released")) fields.releasedIn = "v2026.09.1";
  if (rung === "archived") fields.status = "archived";
  return changeEntry("probe", [], { ...fields, written, ...extra });
}

const stage = (change: ChangeEntry) => stageOf(change, artifacts());

describe("the stage a change's files prove", () => {
  it("is the rung each row of the table proves", () => {
    for (const rung of STAGES) expect(stage(at(rung))).toBe(rung);
  });

  it("drops to the furthest rung still proven when a proof leaves main", () => {
    // The deploy is taken back: every box is still ticked, and the change is
    // where the boxes leave it.
    expect(stage(at("on-staging", { deployedEnv: undefined }))).toBe(
      "building",
    );
    // A design leaves `main` under a released change: the rung below it is
    // missing, so nothing above it is proven either.
    expect(
      stage(
        at("released", {
          written: [...PROPOSED, "tech-design", "specs", "test-cases", "tasks"],
        }),
      ),
    ).toBe("proposed");
  });

  it("does not move past a proof that is missing", () => {
    // The plan was written before either design: the requirements, the cases
    // and the task list are all on `main` and the change is still Proposed.
    const planned = at("planned", {
      written: [...PROPOSED, "specs", "test-cases", "tasks"],
    });

    expect(stage(planned)).toBe("proposed");
    expect(stage(planned)).not.toBe("planned");
  });

  it("holds Specified until every raised row has landed", () => {
    expect(stage(at("specified", { raisedOpen: 1 }))).toBe("designed");
    expect(stage(at("building", { raisedOpen: 2 }))).toBe("designed");
    expect(stage(at("specified", { raisedOpen: 0 }))).toBe("specified");
  });

  it("shared-planning-agent-rounds-SC-23 - an open `Q<n>` row moves no stage", () => {
    // A numbered decisions row is answered in the thread while the change
    // keeps moving: the one question that holds anything is a goal or a
    // non-goal that moved. `## Raised` above is the blind reading's own
    // table, which does hold Specified — the two are not one list.
    const asked = [
      {
        id: "Q7",
        artifact: "decisions",
        role: "pm",
        hand: "robin",
        text: "Which mechanism is taken?",
        recommended: "the smaller one",
      },
    ];

    for (const rung of STAGES) {
      expect(stage(at(rung, { questions: asked })), rung).toBe(stage(at(rung)));
    }
  });

  it("reads a record nothing could read as Proposed, with its hands open", () => {
    const unreadable = at("building", {
      hands: undefined,
      error: { file: "openspec/changes/probe/.openspec.yaml", message: "bad" },
    });

    expect(stage(unreadable)).toBe("proposed");
    expect(handOf(unreadable, "proposed", artifacts())).toEqual(["pm"]);
    expect(
      openHands(unreadable, handOf(unreadable, "proposed", artifacts())),
    ).toEqual(["pm"]);
  });

  it("holds Proposed while the decisions, the journeys and the hands land", () => {
    expect(
      stage(at("proposed", { written: ["proposal"], hands: undefined })),
    ).toBe("proposed");
    expect(stage(at("proposed"))).toBe("proposed");
  });

  it("shared-planning-change-stages-SC-01 - proves Proposed's own rung before Designed's", () => {
    // Only `proposal.md` is on `main`; the decisions are waived, but the
    // journeys are not — neither written nor waived. Designed's own row
    // (both designs, here both waived) is proven, but Proposed's remaining
    // proof — the journeys — is not, and a rung is reached only when its own
    // proof and every proof before it hold.
    const change = at("proposed", {
      written: ["proposal"],
      decisionsWaived: "nothing to settle",
      uiWaived: "nothing a reader sees moves",
      designWaived: "no code lands outside the store",
      hands: undefined,
    });

    expect(stage(change)).toBe("proposed");
    expect(handOf(change, "proposed", artifacts())).toEqual(["pm"]);
  });

  it("is not moved by a wait on the tech design", () => {
    const waiting = at("specified", {
      awaiting: [{ artifact: "tech-design", why: "2026-09-12 the increment" }],
    });

    expect(stage(waiting)).toBe(stage(at("specified")));
  });
});

/**
 * What a change has written, read over a store rather than off a fixture
 * entry: the reading under test is the walk of the change's own `specs/`
 * tree, and the journeys land before the outline on the workflow's own
 * documented order — so a capability holding only its journeys is one
 * capability, and one set of them answers for the journeys and the suite
 * alike.
 */
describe("what counts as written before the outline lands", () => {
  const CHANGE = "openspec/changes/journey-probe";
  const SCHEMA = readFileSync(
    join(storeRoot, "openspec/schemas/grade10-planning/schema.yaml"),
    "utf8",
  );
  const PROPOSAL = [
    "# Journey probe",
    "",
    "## Why",
    "",
    "So the ladder has a change to read.",
    "",
  ].join("\n");
  const JOURNEYS =
    "**Walked by:** nobody on their own - a policy nobody reaches\n";
  const DELTA = [
    "## ADDED Requirements",
    "",
    "### Requirement: A lane names its stage",
    "",
    "#### Scenario: demo-SC-01 - it names it",
    "",
    "**WHEN** read **THEN** it names it",
    "",
  ].join("\n");
  const SUITE = "# demo-product/alpha Test Cases\n\n**Status:** draft\n";

  /** The change as the store reads it, with the capability files the case is
   * about and nothing else. */
  function written(files: Record<string, string>): ChangeEntry {
    const root = writeStore({
      "openspec/schemas/grade10-planning/schema.yaml": SCHEMA,
      [`${CHANGE}/.openspec.yaml`]: [
        "schema: grade10-planning",
        "created: 2026-09-18",
        "hands:",
        "  pm: robin",
        "  design: dana",
        "  tech: kim",
        "",
      ].join("\n"),
      [`${CHANGE}/proposal.md`]: PROPOSAL,
      [`${CHANGE}/decisions.md`]: "## Goals\n\n- One outcome.\n",
      ...files,
    });
    const [entry] = readChanges(root, NO_GIT, null);
    return entry;
  }

  it("shared-planning-change-stages-SC-15 - counts the journeys once landed, before `spec.md` exists", () => {
    const entry = written({
      [`${CHANGE}/specs/demo-product/alpha/user-journeys.md`]: JOURNEYS,
    });

    expect(entry.error).toBeUndefined();
    // The journeys count as written with no `spec.md` beside them yet.
    expect(entry.written).toEqual(
      expect.arrayContaining(["proposal", "decisions", "user-journeys"]),
    );
    expect(entry.written).not.toContain("specs");
    // The stage stays Proposed, and its second half hands the change to the
    // designer and the tech PIC — the order `CLAUDE.md` documents, where
    // neither hand opens `spec.md`.
    expect(stage(entry)).toBe("proposed");
    expect(handOf(entry, "proposed", artifacts())).toEqual(["design", "tech"]);
  });

  it("shared-planning-change-stages-SC-15 - reads the journeys and the suite off one set of capabilities", () => {
    const entry = written({
      [`${CHANGE}/specs/demo-product/alpha/user-journeys.md`]: JOURNEYS,
      [`${CHANGE}/specs/demo-product/alpha/spec.md`]: DELTA,
      [`${CHANGE}/specs/demo-product/alpha/feature-tcs.md`]: SUITE,
      [`${CHANGE}/specs/demo-product/beta/user-journeys.md`]: JOURNEYS,
    });

    expect(entry.error).toBeUndefined();
    // `beta` is a capability of the change on the strength of its journeys
    // alone: both carry them, so the journeys are written, and only `alpha`
    // carries a suite — one capability's suite does not answer for the
    // other's.
    expect(entry.written).toContain("user-journeys");
    expect(entry.written).not.toContain("test-cases");
    // `spec.md` is the one artifact the delta headings prove rather than the
    // set: `beta` names no requirement for the second pass to read.
    expect(entry.written).toContain("specs");
  });
});

describe("a waiver standing for the design it names", () => {
  const designed = (extra: Partial<ChangeEntry>) =>
    stage(at("designed", { written: [...PROPOSED], ...extra }));

  it("reaches Designed on either line, or on one of each", () => {
    expect(
      designed({
        written: [...PROPOSED, "tech-design"],
        uiWaived: "nothing a reader sees moves",
      }),
    ).toBe("designed");
    expect(
      designed({
        written: [...PROPOSED, "ui-design"],
        designWaived: "no code lands outside the store",
      }),
    ).toBe("designed");
    expect(
      designed({
        uiWaived: "nothing a reader sees moves",
        designWaived: "no code lands outside the store",
      }),
    ).toBe("designed");
  });

  it("leaves Proposed where the other design has neither file nor line", () => {
    expect(designed({ uiWaived: "nothing a reader sees moves" })).toBe(
      "proposed",
    );
    expect(designed({ designWaived: "nothing lands outside" })).toBe(
      "proposed",
    );
  });
});

describe("the four lanes the eight stages project to", () => {
  it("gives each stage exactly one lane", () => {
    expect(STAGES.map((rung) => laneOf(at(rung)))).toEqual([
      "proposed",
      "proposed",
      "specified",
      "in-progress",
      "in-progress",
      "complete",
      "complete",
      "complete",
    ]);
  });

  it("reads the stage the entry carries, never a second derivation", () => {
    const carried = changeEntry("carried", [], {
      stage: "on-staging",
      taskGroups: [group(1, 3)],
    });

    expect(laneOf(carried)).toBe("complete");
  });
});

describe("whose turn it is", () => {
  const handsAt = (rung: Stage, extra: Partial<ChangeEntry> = {}) =>
    handOf(at(rung, extra), rung, artifacts());

  it("is the product manager's in Proposed until the three are on main", () => {
    expect(
      handsAt("proposed", { written: ["proposal"], hands: undefined }),
    ).toEqual(["pm"]);
    expect(
      handsAt("proposed", {
        written: ["proposal", "decisions"],
        hands: undefined,
      }),
    ).toEqual(["pm"]);
    // The decisions and the journeys are in, and nobody is named yet.
    expect(handsAt("proposed", { hands: undefined })).toEqual(["pm"]);
  });

  it("is the designer's and the tech PIC's once the three are in", () => {
    expect(handsAt("proposed")).toEqual(["design", "tech"]);
    expect(stage(at("proposed"))).toBe("proposed");
  });

  it("waits on the hands the next stage needs, and stands a waived one down", () => {
    // Both designs are owed and neither hand is named.
    expect(handsAt("proposed", { hands: { pm: "robin" } })).toEqual(["pm"]);
    // The designer is named and the tech design is owed too.
    expect(
      handsAt("proposed", { hands: { pm: "robin", design: "dana" } }),
    ).toEqual(["pm"]);
    // The UI design is waived, so nobody draws it: the tech PIC is the only
    // hand the next stage needs, and the turn passes on that name alone.
    expect(
      handsAt("proposed", {
        hands: { pm: "robin", tech: "kim" },
        uiWaived: "nothing a reader sees moves",
      }),
    ).toEqual(["tech"]);
  });

  it("reads a waived decisions record as the decisions landing", () => {
    expect(
      handsAt("proposed", {
        written: ["proposal", "user-journeys"],
        decisionsWaived: "the interview settled nothing to keep",
      }),
    ).toEqual(["design", "tech"]);
  });

  it("names each later stage's hands", () => {
    expect(handsAt("specified")).toEqual(["pm"]);
    expect(handsAt("planned")).toEqual(["dev"]);
    expect(handsAt("building")).toEqual(["dev"]);
    expect(handsAt("on-staging")).toEqual(["qa", "release"]);
  });

  it("names nobody in Designed, Released or Archived", () => {
    expect(handsAt("designed")).toEqual([]);
    expect(handsAt("released")).toEqual([]);
    expect(handsAt("archived")).toEqual([]);
  });

  it("reads a role the change does not name as open", () => {
    const unnamed = at("planned", { hands: { pm: "robin" } });

    expect(openHands(unnamed, handOf(unnamed, "planned", artifacts()))).toEqual(
      ["dev"],
    );
    expect(
      openHands(at("planned"), handOf(at("planned"), "planned", artifacts())),
    ).toEqual([]);
    expect(
      openHands(at("on-staging", { hands: { qa: "ari" } }), ["qa", "release"]),
    ).toEqual(["release"]);
  });
});

describe("the roles a change has not yet reached, for My turn's later list", () => {
  // `laterRolesOf` says which roles are upcoming; narrowing that to one
  // handle is `myTurnOf`'s own `rolesHeldBy`, covered end to end by
  // `my-turn-page.test.tsx`.
  const later = (rung: Stage, extra: Partial<ChangeEntry> = {}) =>
    laterRolesOf(at(rung, extra), rung, artifacts());

  it("says the engineer is later while the change is still specified", () => {
    expect(later("specified")).toEqual(["qa", "dev", "release"]);
  });

  it("says nothing once that hand's own turn has come", () => {
    // Building is the engineer's turn: dev is on the reader now, not later.
    expect(later("building")).toEqual(["qa", "release"]);
  });

  it("says QA and the release hand are later while the change is still planned", () => {
    expect(later("planned")).toEqual(["qa", "release"]);
  });

  it("says the designer and the tech PIC are later while proposed is still the product manager's half", () => {
    // Tech is unnamed, so the turn has not passed to the design half yet —
    // both halves of it are still ahead, whether or not their handle is named.
    const proposed = at("proposed", { hands: { pm: "robin", design: "dana" } });
    expect(laterRolesOf(proposed, "proposed", artifacts())).toEqual([
      "design",
      "tech",
      "qa",
      "dev",
      "release",
    ]);
  });

  it("says nothing once the design half has already had its turn", () => {
    // Once the change has reached Designed, the design half is done; the
    // product manager's own second turn, at Specified, is still ahead.
    const roles = later("designed");
    expect(roles).not.toContain("design");
    expect(roles).not.toContain("tech");
    expect(roles).toContain("pm");
  });

  it("says nothing once the product manager's own second turn has passed", () => {
    // Robin's second turn was at Specified, which Building has left behind.
    expect(later("building")).not.toContain("pm");
  });

  it("shared-planning-change-stages-SC-07 - never says a waived design is later", () => {
    // A waiver stands for the file: nobody will draw it, so it is never
    // anybody's to read later either.
    const proposed = at("proposed", {
      hands: { pm: "robin" },
      uiWaived: "no UI to draw",
    });
    const roles = laterRolesOf(proposed, "proposed", artifacts());
    expect(roles).not.toContain("design");
    expect(roles).toContain("tech");
  });
});

describe("what the ladder stopped at", () => {
  const held = (rung: Stage, extra: Partial<ChangeEntry> = {}) =>
    ladderOf(at(rung, extra), artifacts()).heldBy;

  it("names the first artifact of the rung that is not proven", () => {
    expect(held("proposed")).toBe("ui-design");
    expect(held("designed")).toBe("specs");
    expect(held("specified")).toBe("tasks");
    expect(held("proposed", { written: [...PROPOSED, "ui-design"] })).toBe(
      "tech-design",
    );
  });

  it("names nothing where no artifact is what holds the rung", () => {
    // Every box is ticked and the deploy has not happened: nothing a hand
    // writes stands between the change and On staging.
    expect(held("building", { taskGroups: [group(3, 3)] })).toBeUndefined();
    // A raised row holds Specified while both its artifacts are in.
    expect(held("specified", { raisedOpen: 1 })).toBeUndefined();
    expect(held("archived")).toBeUndefined();
  });
});

describe("which artifact is whose hand", () => {
  it("is the role the schema names beside the artifact", () => {
    const hands = Object.fromEntries(
      artifacts().map((one) => [one.id, handOfArtifact(one.id, artifacts())]),
    );

    expect(hands).toEqual({
      proposal: "pm",
      decisions: "pm",
      "user-journeys": "pm",
      "ui-design": "design",
      "tech-design": "tech",
      specs: "pm",
      "test-cases": "pm",
      tasks: "dev",
    });
  });

  it("names nobody for an artifact the schema does not issue", () => {
    expect(handOfArtifact("release-notes", artifacts())).toBeUndefined();
  });
});

describe("what the agent drafts and the hand moves", () => {
  it("carries a pair for the five drafted stages and none after them", () => {
    expect(STAGES.filter((rung) => draftedOf(rung) !== undefined)).toEqual([
      "proposed",
      "designed",
      "specified",
      "planned",
      "building",
    ]);
  });

  it("names the hand's move as the stage table writes it", () => {
    const shown = (rung: Stage) => moveShown(draftedOf(rung)?.moves ?? []);

    expect(shown("proposed")).toBe("answer");
    expect(shown("designed")).toBe("tweak · challenge");
    expect(shown("specified")).toBe("read");
    expect(shown("planned")).toBe("read");
    expect(shown("building")).toBe("read each landing");
  });

  it("names the command each hand of the stage pastes", () => {
    const commands = (rung: Stage) =>
      (draftedOf(rung, "pos")?.moves ?? []).map((one) => one.command);

    expect(commands("proposed")).toEqual(["/workflow-plan pos"]);
    // Two hands take the change while it is still Proposed, and each drafts
    // one design, so Designed offers one command per hand.
    expect(commands("designed")).toEqual([
      "/workflow-design pos",
      "/workflow-tech pos",
    ]);
    expect(commands("specified")).toEqual(["/workflow-specify pos"]);
    expect(commands("planned")).toEqual(["/workflow-tasks pos"]);
    expect(commands("building")).toEqual(["/workflow-build pos <group>"]);
  });

  it("says what the agent drafts and names every hand that moves it", () => {
    expect(draftedOf("proposed")?.mark).toBe(
      "the marks and the three files, from what the hand asks",
    );
    expect(draftedOf("building")?.mark).toBe("each group, test first");
    expect(movedBy(draftedOf("designed")?.moves ?? [])).toBe(
      "Designer: tweak · Tech PIC: challenge",
    );
    expect(movedBy(draftedOf("building")?.moves ?? [])).toBe(
      "Engineer: read each landing",
    );
  });

  /** Read from the stage: two changes the ladder puts on one rung carry the
   * same pair, whatever else their records say. */
  it("gives two changes at one rung the same pair", () => {
    const thin = at("building", { hands: { dev: "sam" } });
    const busy = at("building", {
      awaiting: [{ artifact: "tasks", why: "2026-09-02 the plan is thin" }],
      dependsOn: ["loyalty-rules"],
      taskGroups: [group(2, 3)],
    });

    expect(stage(thin)).toBe("building");
    expect(stage(busy)).toBe(stage(thin));
    expect(draftedOf(stage(busy))).toEqual(draftedOf(stage(thin)));
  });
});

const NOW = Date.parse("2026-09-19T02:00:00Z");
const DAY = 86_400_000;
const daysAgo = (days: number) => new Date(NOW - days * DAY).toISOString();

const suite = (status: ChangeSuite["status"]): ChangeSuite => ({
  spec: "shared/planning/change-stages",
  status,
  cases: { draft: 0, actual: 1, deprecated: 0, total: 1 },
});

const overlays = (change: ChangeEntry, released: string[] = []): Overlay[] =>
  overlaysOf(change, {
    now: NOW,
    released: new Set(released),
    artifacts: artifacts(),
  });

const kinds = (change: ChangeEntry, released: string[] = []) =>
  overlays(change, released).map((one) => one.kind);

describe("the five overlays beside the stage", () => {
  it("shows a wait as written, one line per artifact, against its hand", () => {
    const waiting = at("specified", {
      awaiting: [
        { artifact: "tech-design", why: "2026-09-12 waiting on the increment" },
        { artifact: "tasks", why: "the vendor has not answered" },
      ],
    });

    expect(overlays(waiting)).toEqual([
      {
        kind: "waiting",
        artifact: "tech-design",
        text: "2026-09-12 waiting on the increment",
        since: "2026-09-12",
        role: "tech",
        hand: "kim",
      },
      {
        kind: "waiting",
        artifact: "tasks",
        text: "the vendor has not answered",
        role: "dev",
        hand: "sam",
      },
    ]);
    expect(stage(waiting)).toBe("specified");
  });

  it("names the role and no handle where the change names nobody for it", () => {
    const waiting = at("specified", {
      hands: { pm: "robin" },
      awaiting: [{ artifact: "tech-design", why: "2026-09-12 the increment" }],
    });

    // The role, and no `hand`: a handle holding the role's own name would
    // read as somebody who answers to it.
    expect(overlays(waiting)).toEqual([
      {
        kind: "waiting",
        artifact: "tech-design",
        text: "2026-09-12 the increment",
        since: "2026-09-12",
        role: "tech",
      },
    ]);
  });

  it("shows a dependency no release has carried, and nothing for one that has", () => {
    const blocked = at("specified", {
      dependsOn: ["add-store-locator", "launch-wallet-passes"],
    });

    expect(overlays(blocked, ["launch-wallet-passes"])).toEqual([
      { kind: "blocked", change: "add-store-locator" },
    ]);
  });

  it("counts idle in whole days on the Hong Kong date, from the seventh", () => {
    const idleFor = (days: number) =>
      overlays(at("building", { lastLanded: daysAgo(days) })).find(
        (one) => one.kind === "idle",
      );

    expect(idleFor(6)).toBeUndefined();
    expect(idleFor(7)).toEqual({ kind: "idle", days: 7, shelved: false });
    expect(idleFor(29)).toEqual({ kind: "idle", days: 29, shelved: false });
    expect(idleFor(30)).toEqual({ kind: "idle", days: 30, shelved: true });
  });

  it("shows no age for a change no landing dates", () => {
    expect(kinds(at("building"))).not.toContain("idle");
  });

  it("counts the day on the Hong Kong calendar, not on UTC's", () => {
    // 2026-09-12T20:00Z is already the 13th in Hong Kong, and
    // 2026-09-19T02:00Z is the 19th: six days, not seven.
    const idle = overlaysOf(
      at("building", { lastLanded: "2026-09-12T20:00:00Z" }),
      { now: NOW, released: new Set(), artifacts: artifacts() },
    ).find((one) => one.kind === "idle");

    expect(idle).toBeUndefined();
  });

  it("shows the suite's verdict, a draft until no case is left to review", () => {
    expect(overlays(at("specified", { suites: [suite("approved")] }))).toEqual([
      { kind: "suite", verdict: "approved" },
    ]);
    expect(overlays(at("specified", { suites: [suite("in-review")] }))).toEqual(
      [{ kind: "suite", verdict: "draft" }],
    );
    expect(
      overlays(
        at("specified", {
          suites: [suite("approved"), suite("pending-review")],
        }),
      ),
    ).toEqual([{ kind: "suite", verdict: "draft" }]);
    expect(kinds(at("specified"))).not.toContain("suite");
  });

  it("names the earliest behind artifact and its hand", () => {
    const behind = at("specified", {
      upstream: {
        decisions: { id: "aaaaaaaa", items: ["proposal"] },
        specs: {
          id: "bbbbbbbb",
          items: ["docs/prds/products/demo/rules.md#points"],
        },
      },
      reviewed: { decisions: "00000000", specs: "11111111" },
    });

    expect(overlays(behind)).toEqual([
      {
        kind: "behind",
        artifact: "decisions",
        changed: ["proposal"],
        whole: true,
        role: "pm",
        hand: "robin",
      },
    ]);
  });

  it("shows exactly the five, and no overlay moves the stage", () => {
    const every = at("building", {
      awaiting: [{ artifact: "tasks", why: "2026-09-01 the vendor" }],
      dependsOn: ["add-store-locator"],
      lastLanded: daysAgo(9),
      suites: [suite("pending-review")],
      upstream: { tasks: { id: "aaaaaaaa", items: ["specs"] } },
      reviewed: { tasks: "00000000" },
    });

    expect(kinds(every)).toEqual([...OVERLAYS]);
    expect(OVERLAYS).toHaveLength(5);
    expect(stage(every)).toBe("building");
  });
});

describe("the ladder's own surface", () => {
  it("names the eight stages in the ladder's order", () => {
    expect(STAGES).toEqual([
      "proposed",
      "designed",
      "specified",
      "planned",
      "building",
      "on-staging",
      "released",
      "archived",
    ]);
  });

  /** The store as it stands: every change people actually wrote lands on one
   * rung, and the lane it shows in is that rung's projection. */
  it("puts every change of the real store on exactly one rung", () => {
    const { snapshot, archive } = realStore;

    for (const change of [...snapshot.changes, ...archive.changes]) {
      expect(STAGES).toContain(change.stage);
      expect(laneOf(change)).toBe(laneOfStage(change.stage));
    }
    expect(archive.changes.every((one) => one.stage === "archived")).toBe(true);
    // Nothing on an archived change is owed: the fold is the last rung.
    expect(archive.changes.every((one) => one.heldBy === undefined)).toBe(true);
  });
});
