import { describe, expect, it } from "vitest";
import {
  artifactOfAskedQuestions,
  askedIdsOf,
  roundlessGroupsOf,
} from "../src/api/rounds";
import type { RoundRow, TaskGroup } from "../src/api/types";

/**
 * `rounds.md`'s own record is the only place that says which artifact a
 * round was reading when it raised a `Q<n>` — `decisions.md`'s row always
 * names the file it lives in, `decisions`, never the draft under challenge.
 * The change page's artifact rows read the pairing from here.
 */

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

describe("artifactOfAskedQuestions", () => {
  it("pairs each `Q<n>` with the round's own artifact, not `decisions`", () => {
    const found = artifactOfAskedQuestions([
      row({ round: 1, artifact: "ui-design", asked: "Q1" }),
      row({ round: 2, artifact: "tech-design", asked: "Q2, Q3" }),
    ]);

    expect(found.get("Q1")).toBe("ui-design");
    expect(found.get("Q2")).toBe("tech-design");
    expect(found.get("Q3")).toBe("tech-design");
  });

  it("reads a task group's own number as the artifact", () => {
    const found = artifactOfAskedQuestions([
      row({ round: 3, artifact: "1", asked: "Q4" }),
    ]);
    expect(found.get("Q4")).toBe("1");
  });

  it("carries nothing where no round has raised anything", () => {
    expect(artifactOfAskedQuestions([]).size).toBe(0);
    expect(artifactOfAskedQuestions([row({ asked: "-" })]).size).toBe(0);
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
