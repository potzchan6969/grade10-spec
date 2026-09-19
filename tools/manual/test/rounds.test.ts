import { describe, expect, it } from "vitest";
import { askedIdsOf, roundlessGroupsOf } from "../src/api/rounds";
import { suiteTotalsOf } from "../src/api/suites";
import type { ChangeSuite, RoundRow, TaskGroup } from "../src/api/types";
import { roundArtifactOf } from "../src/store/read-rounds.mts";

/**
 * `rounds.md`'s own record is the only place that says which artifact a
 * round was reading when it raised a `Q<n>` — `decisions.md`'s row always
 * names the file it lives in, `decisions`, never the draft under challenge.
 * `read-changes.mts` reads the pairing from here, through `roundArtifactOf`.
 */

describe("roundArtifactOf", () => {
  it("reads `3`, `3.` and `group 3` as the same group", () => {
    expect(roundArtifactOf("3")).toBe("3");
    expect(roundArtifactOf("3.")).toBe("3");
    expect(roundArtifactOf("group 3")).toBe("3");
  });

  it("reads an artifact id as itself, trimmed", () => {
    expect(roundArtifactOf(" ui-design ")).toBe("ui-design");
  });

  it("reads an empty cell as naming no artifact", () => {
    expect(roundArtifactOf("")).toBeNull();
    expect(roundArtifactOf("   ")).toBeNull();
  });
});

const row = (partial: Partial<RoundRow>): RoundRow => ({
  round: 1,
  artifact: "proposal",
  perspectives: "product, qa",
  stood: "nothing stood",
  asked: "-",
  tests: "-",
  ...partial,
});

describe("askedIdsOf", () => {
  it("reads every `Q<n>` an Asked cell names", () => {
    expect(askedIdsOf("Q1, Q2")).toEqual(["Q1", "Q2"]);
  });

  it("reads none off a cell that raised nothing", () => {
    expect(askedIdsOf("-")).toEqual([]);
  });

  it("drops a repeated id", () => {
    expect(askedIdsOf("Q1, Q1")).toEqual(["Q1"]);
  });
});

describe("roundlessGroupsOf", () => {
  const groups: TaskGroup[] = [
    { num: "1", title: "Contracts", repo: "grade10-spec", done: 3, total: 3 },
    { num: "2", title: "Surfaces", repo: "grade10-spec", done: 0, total: 2 },
    { num: "3", title: "Walk", repo: "grade10-spec", done: 1, total: 1 },
  ];

  it("names a ticked group no round row names", () => {
    const found = roundlessGroupsOf([row({ artifact: "1" })], groups);
    expect(found.map((one) => one.num)).toEqual(["3"]);
  });

  it("leaves an unclaimed, untouched group out — it has not landed yet", () => {
    const found = roundlessGroupsOf([], groups);
    expect(found.map((one) => one.num)).toEqual(["1", "3"]);
  });

  it("reads `group 3` and `3.` the way it reads `3`", () => {
    expect(
      roundlessGroupsOf([row({ artifact: "group 3" })], groups).map(
        (one) => one.num,
      ),
    ).toEqual(["1"]);
    expect(
      roundlessGroupsOf([row({ artifact: "3." })], groups).map(
        (one) => one.num,
      ),
    ).toEqual(["1"]);
  });
});

/** The Delivery row's automated count against the total is summed over every
 * suite the change carries, and a change specifying two capabilities carries
 * two. Nothing summed more than one before this. */
describe("suiteTotalsOf", () => {
  const suite = (
    capability: string,
    cases: ChangeSuite["cases"],
  ): ChangeSuite => ({
    capability,
    status: "in-review",
    cases,
  });

  it("sums the cases of two suites", () => {
    const totals = suiteTotalsOf([
      suite("shared/planning/agent-rounds", {
        total: 5,
        draft: 1,
        actual: 4,
        deprecated: 0,
        automated: 2,
      }),
      suite("shared/planning/change-stages", {
        total: 3,
        draft: 0,
        actual: 2,
        deprecated: 1,
        automated: 1,
      }),
    ]);

    expect(totals).toEqual({
      total: 8,
      draft: 1,
      actual: 6,
      deprecated: 1,
      automated: 3,
    });
  });

  it("sums no suite as zero, so the row says 0 of 0 rather than nothing", () => {
    expect(suiteTotalsOf([])).toEqual({
      total: 0,
      draft: 0,
      actual: 0,
      deprecated: 0,
      automated: 0,
    });
  });
});
