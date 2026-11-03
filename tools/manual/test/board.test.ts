import { describe, expect, it } from "vitest";
import {
  everyPhase,
  firstUnreleased,
  qaQueue,
  readUnits,
  releaseCheck,
  unitsIn,
  waiterLabel,
  waitingOn,
} from "../src/api/board";
import {
  LATER,
  MISC,
  phases,
  reading,
  SHOP,
  verdicts,
} from "./release-fixture";

const name = (key: string) =>
  key
    .replace(`${SHOP}#`, "shop#")
    .replace(`${MISC}@`, "misc@")
    .replace(`${LATER}#`, "later#")
    .replace("spec:site/loyalty/tiers@", "tiers@");

describe("the board's units", () => {
  const readings = readUnits(reading, verdicts);

  it("opens on the first phase not released", () => {
    expect(firstUnreleased(phases)?.id).toBe("store-launch-1");
  });

  it("lists a phase's units P0 first, in page order within a priority", () => {
    expect(
      unitsIn(readings, "store-launch-1").map(
        ({ unit, readiness }) =>
          `${unit.priority} ${name(unit.key)} ${readiness.step}`,
      ),
    ).toEqual([
      "P0 shop#browse@store-launch-1 passed",
      "P0 shop#basket@store-launch-1 failing",
      "P0 shop#same@store-launch-1 prepared",
      "P1 tiers@store-launch-1 reviewed",
      "P2 misc@store-launch-1 no-suite",
    ]);
  });
});

describe("can it launch", () => {
  const readings = readUnits(reading, verdicts);

  it("counts the release's own check", () => {
    const check = releaseCheck(
      unitsIn(readings, "store-launch-1"),
      phases,
      "store-launch-1",
    );
    expect(check).toMatchObject({
      p0: { passed: 1, total: 3 },
      failing: { units: 1, byTriage: [["bug", 1]] },
      untriagedAutomatedFails: 0,
      questions: { count: 1, units: 1 },
      moves: { units: 2, byPriority: { P1: 1, P2: 1 } },
      launches: false,
    });
    expect(check.to?.id).toBe("store-launch-2");
  });

  it("holds the release on an automated fail nobody triaged", () => {
    const check = releaseCheck(
      unitsIn(readings, "store-launch-2"),
      phases,
      "store-launch-2",
    );
    expect(check.untriagedAutomatedFails).toBe(1);
    expect(check.to).toBeUndefined();
    expect(check.launches).toBe(false);
  });

  it("launches once every P0 passed with no question and nothing untriaged", () => {
    const passed = readUnits(reading, verdicts).map((one) =>
      one.unit.key === `${SHOP}#browse@store-launch-1`
        ? { ...one, readiness: { ...one.readiness, questions: 0 } }
        : one,
    );
    const check = releaseCheck(
      unitsIn(passed, "store-launch-1").filter(
        (one) => one.readiness.step === "passed" || one.unit.priority !== "P0",
      ),
      phases,
      "store-launch-1",
    );
    expect(check.p0).toEqual({ passed: 1, total: 1 });
    expect(check.launches).toBe(true);
  });

  it("reads to Reviewed with no results, and holds every P0", () => {
    const check = releaseCheck(
      unitsIn(readUnits(reading), "store-launch-1"),
      phases,
      "store-launch-1",
    );
    expect(check.p0.passed).toBe(0);
    expect(check.failing.units).toBe(0);
  });
});

describe("waiting on", () => {
  it("groups units by whose turn it is, a unit in every hand it waits on", () => {
    const groups = waitingOn(
      unitsIn(readUnits(reading, verdicts), "store-launch-1"),
    );
    expect(
      groups.map((group) => [
        group.waiter,
        group.units.map(({ reading: one }) => name(one.unit.key)),
      ]),
    ).toEqual([
      [
        "qa",
        [
          "shop#same@store-launch-1",
          "tiers@store-launch-1",
          "misc@store-launch-1",
        ],
      ],
      ["pm", ["shop#browse@store-launch-1", "tiers@store-launch-1"]],
      ["assignee", ["shop#basket@store-launch-1"]],
    ]);
    expect(groups[2].units[0].why).toEqual(["1 case bug"]);
  });

  it("puts a unit nobody holds under nobody, waiting for the launch", () => {
    const passed = unitsIn(readUnits(reading, verdicts), "store-launch-1")
      .filter((one) => one.readiness.step === "passed")
      .map((one) => ({
        ...one,
        readiness: { ...one.readiness, waitingOn: [] },
      }));
    expect(waitingOn(passed).map((group) => group.waiter)).toEqual(["nobody"]);
  });

  it("names the one handle holding a role, and leaves a bug's assignee a word", () => {
    const team = [
      { handle: "chloe9gag", roles: ["qa"] },
      { handle: "jeff", roles: ["pm"] },
      { handle: "echo", roles: ["pm", "dev"] },
    ];
    expect(waiterLabel("qa", team)).toBe("QA · @chloe9gag");
    expect(waiterLabel("pm", team)).toBe("PM");
    expect(waiterLabel("assignee", team)).toBe("Assignee");
  });
});

describe("QA's queue", () => {
  it("orders reviewed units by phase, release priority, then the longest waiting", () => {
    const since: Record<string, string> = {
      [`${SHOP}#browse@store-launch-1`]: "2026-10-20T00:00:00Z",
      [`${SHOP}#basket@store-launch-1`]: "2026-10-01T00:00:00Z",
    };
    const queue = qaQueue(readUnits(reading), (unit) => since[unit.key]);
    expect(queue.map(({ unit }) => name(unit.key))).toEqual([
      "shop#basket@store-launch-1",
      "shop#browse@store-launch-1",
      "tiers@store-launch-1",
      "shop#basket@store-launch-2",
    ]);
  });

  it("leaves units already in a run out", () => {
    const queue = qaQueue(readUnits(reading, verdicts), () => undefined);
    expect(queue.map(({ unit }) => name(unit.key))).toEqual([
      "tiers@store-launch-1",
    ]);
  });
});

describe("every phase", () => {
  it("counts each phase's units by readiness", () => {
    expect(
      everyPhase(readUnits(reading, verdicts), phases).map(
        ({ phase, units, steps }) => [
          phase.id,
          units,
          Object.fromEntries(steps),
        ],
      ),
    ).toEqual([
      ["auction", 0, {}],
      [
        "store-launch-1",
        5,
        { "no-suite": 1, prepared: 1, reviewed: 1, failing: 1, passed: 1 },
      ],
      ["store-launch-2", 2, { "no-suite": 1, "in-qa": 1 }],
    ]);
  });
});
