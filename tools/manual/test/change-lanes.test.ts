import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildIndex,
  dependenciesOf,
  isProposal,
  laneOf,
  proposalsForSpec,
} from "../src/api/derive";
import type { Delta } from "../src/api/types";
import { findStoreRoot } from "../src/store/disk.mts";
import { rootsOf } from "../src/store/roots.mts";
import { readStore } from "../src/store/snapshot.mts";
import { changeEntry, snapshotOf, specEntry } from "./manual-fixture";

/** The board's status column, derived from the artifacts a change has written
 * and nothing else — so it cannot drift from what is on disk. */

const SPEC = "demo-product/alpha";
const delta: Delta = { spec: SPEC, kinds: ["ADDED"], requirements: [] };

const group = (done: number, total: number) => ({
  title: "Contracts",
  repo: "grade10-spec",
  done,
  total,
});

describe("which lane a change is in", () => {
  it("is proposed while it is only a reason", () => {
    expect(laneOf(changeEntry("idea", []))).toBe("proposed");
    expect(laneOf(changeEntry("idea", [], { taskGroups: [group(0, 0)] }))).toBe(
      "proposed",
    );
  });

  /** A finished pm-planning change is proposal plus deltas and no tasks.md.
   * Filing it as an unplanned thought hides the queue somebody has to
   * promote. */
  it("is specified once it has written its deltas and no task list", () => {
    expect(laneOf(changeEntry("planned", [delta]))).toBe("specified");
  });

  it("is in progress while a box is open", () => {
    expect(
      laneOf(changeEntry("working", [delta], { taskGroups: [group(5, 6)] })),
    ).toBe("in-progress");
    expect(
      laneOf(
        changeEntry("working", [delta], {
          taskGroups: [group(2, 2), group(0, 3)],
        }),
      ),
    ).toBe("in-progress");
  });

  /** Three in-flight changes are fully checked off and wear the same badge as
   * a 0/45 one; the openspec CLI has said "Complete" about them all along. */
  it("is complete once every box is checked", () => {
    expect(
      laneOf(changeEntry("done", [delta], { taskGroups: [group(6, 6)] })),
    ).toBe("complete");
    expect(
      laneOf(
        changeEntry("done", [delta], {
          taskGroups: [group(2, 2), group(4, 4), group(0, 0)],
        }),
      ),
    ).toBe("complete");
  });

  it("calls only the first of those a proposal", () => {
    expect(isProposal(changeEntry("idea", []))).toBe(true);
    expect(isProposal(changeEntry("planned", [delta]))).toBe(false);
  });
});

describe("what a change is waiting on", () => {
  const shipped = changeEntry("revise-loyalty-programme-rules", [], {
    status: "archived",
  });
  const inFlight = changeEntry("add-shopify-membership-pos", [delta]);
  const waiting = changeEntry("gift-cards", [delta], {
    dependsOn: [
      "add-shopify-membership-pos",
      "revise-loyalty-programme-rules",
      "never-written",
    ],
  });
  const index = buildIndex(snapshotOf({ changes: [waiting, inFlight] }));

  it("blocks on one still in flight, clears one that archived", () => {
    expect(dependenciesOf(waiting, index, [shipped])).toEqual([
      { id: "add-shopify-membership-pos", state: "blocking", change: inFlight },
      {
        id: "revise-loyalty-programme-rules",
        state: "satisfied",
        change: shipped,
      },
      { id: "never-written", state: "missing" },
    ]);
  });

  it("names an id that resolves to nothing rather than dropping it", () => {
    expect(dependenciesOf(waiting, index).map((one) => one.state)).toEqual([
      "blocking",
      "missing",
      "missing",
    ]);
  });

  it("says nothing about a change that declares no dependency", () => {
    expect(dependenciesOf(inFlight, index, [shipped])).toEqual([]);
  });
});

/** A proposal carries no delta, so `changesBySpec` cannot see it and the
 * capability it is about shows no sign it exists. */
describe("the proposals a capability should know about", () => {
  const spec = specEntry(SPEC, ["A purchase earns points"]);
  spec.requirements[0].scenarios = [
    { id: "alpha-SC-01", name: "it earns", text: "" },
  ];

  const bySpecId = changeEntry("gift-cards", [], { cites: [SPEC] });
  const byScenario = changeEntry("expiry", [], { cites: ["alpha-SC-01"] });
  const byHeading = changeEntry("tiers", [], {
    cites: ["A purchase earns points"],
  });
  const elsewhere = changeEntry("unrelated", [], { cites: ["other/thing"] });
  const planned = changeEntry("already-specified", [delta], { cites: [SPEC] });

  const index = buildIndex(
    snapshotOf({
      specs: [spec],
      changes: [bySpecId, byScenario, byHeading, elsewhere, planned],
    }),
  );

  it("collects the ones citing the spec, its rows, or its ids", () => {
    expect(proposalsForSpec(index, SPEC).map((one) => one.id)).toEqual([
      "gift-cards",
      "expiry",
      "tiers",
    ]);
  });

  it("leaves out a proposal about something else", () => {
    expect(proposalsForSpec(index, "other/thing")).toEqual([]);
  });

  /** Once it has a delta it badges the rows itself, and the ribbon would say
   * the same thing twice. */
  it("leaves out a change that has stopped being a proposal", () => {
    expect(proposalsForSpec(index, SPEC)).not.toContain(planned);
  });
});

/** The store as it stands: no derivation earns its keep if the changes
 * people actually wrote land somewhere unexpected. The store moves under
 * this suite on every merge, so it holds only the invariants a moving
 * store keeps — never a census of today's counts. */
describe("the real store's board", () => {
  const root = findStoreRoot(fileURLToPath(new URL(".", import.meta.url)));

  it("puts every change in exactly one lane, misfiling none", async () => {
    const { snapshot, archive } = await readStore(rootsOf(root));
    const lanes = ["proposed", "specified", "in-progress", "complete"];

    for (const change of snapshot.changes) {
      expect(lanes).toContain(laneOf(change));
      // The misfile the board existed to fix: a change with deltas read
      // as an unplanned thought. It is never a proposal.
      if (change.deltas.length > 0) {
        expect(laneOf(change)).not.toBe("proposed");
      }
    }

    expect(snapshot.changes.every((one) => one.lastMoved)).toBe(true);
    expect(
      archive.changes.some((one) =>
        one.taskGroups.some((held) => held.tasks !== undefined),
      ),
    ).toBe(false);
  });

  /** Delta blocks and task lines are what search has to index and the change
   * detail has to render; both reach the client on the snapshot. */
  it("carries every in-flight delta block and task line", async () => {
    const { snapshot } = await readStore(rootsOf(root));
    const requirements = snapshot.changes.flatMap((one) =>
      one.deltas.flatMap((delta) => delta.requirements),
    );

    expect(requirements.length).toBeGreaterThan(0);
    expect(requirements.every((one) => one.text)).toBe(true);
    const lines = snapshot.changes.flatMap((one) =>
      one.taskGroups.flatMap((held) => held.tasks ?? []),
    );
    expect(lines.length).toBeGreaterThan(0);
    expect(
      snapshot.changes.every((one) =>
        one.taskGroups.every(
          (held) =>
            (held.tasks ?? []).filter((t) => t.done).length === held.done,
        ),
      ),
    ).toBe(true);
  });

  /** The durable file's own ceiling understates what has been issued: the
   * fold drops a delta's journeys, so nothing but the delta files remembers
   * them. */
  it("states an id ceiling no durable spec could reach alone", async () => {
    const { snapshot } = await readStore(rootsOf(root));
    const loyalty = snapshot.specs.find(
      (one) => one.id === "grade10-store/loyalty",
    );
    const durable = Math.max(
      ...(loyalty?.requirements.flatMap((one) =>
        one.scenarios.flatMap((scenario) =>
          scenario.id ? [Number(scenario.id.split("-").pop())] : [],
        ),
      ) ?? [0]),
    );

    expect(loyalty?.issuedThrough?.sc).toBeGreaterThan(durable);
    // A spec whose scenarios carry no permanent ids has issued nothing and
    // owes no ceiling; every spec that has issued one states it.
    const issuing = snapshot.specs.filter((one) =>
      one.requirements.some((requirement) =>
        requirement.scenarios.some((scenario) => scenario.id),
      ),
    );
    expect(issuing.length).toBeGreaterThan(0);
    expect(issuing.every((one) => one.issuedThrough)).toBe(true);
  });
});
