import { describe, expect, it } from "vitest";
import {
  blockBody,
  diffLines,
  diffTotals,
  durableBlock,
} from "../src/api/delta-text";
import type { Requirement } from "../src/api/types";

/** A MODIFIED delta is the whole requirement retyped. Nothing in the store
 * compares the body — the check holds the heading and stops — so this diff is
 * what turns "a change touches this row" into "this change deletes the tier
 * table and rewrites SC-23". */

const durable: Requirement = {
  name: "Grade10's programme",
  text: "These are the values the product deploys, not a range it may vary\nwithin.\n\n| Tier | Multiplier |\n| --- | --- |\n| Platinum | 1.2 |\n| Diamond | 1.5 |",
  scenarios: [
    {
      id: "loyalty-SC-23",
      name: "A Diamond member earns the tier rate",
      text: "- **WHEN** a Diamond member completes a HKD 1,000 purchase\n- **THEN** they earn 120 points",
    },
    {
      id: "loyalty-SC-24",
      name: "Black is the ceiling",
      text: "- **THEN** no tier pays more",
    },
  ],
};

describe("the durable block a delta replaces", () => {
  it("is the requirement written back out, heading and scenarios in order", () => {
    const block = durableBlock(durable);

    expect(block.split("\n")[0]).toBe("### Requirement: Grade10's programme");
    expect(block).toContain("#### Scenario: loyalty-SC-23 - A Diamond member");
    expect(block.indexOf("loyalty-SC-23")).toBeLessThan(
      block.indexOf("loyalty-SC-24"),
    );
  });

  it("names a scenario that carries no permanent id by its title alone", () => {
    const block = durableBlock({
      name: "Bare",
      text: "",
      scenarios: [{ name: "It happens", text: "" }],
    });

    expect(block).toContain("#### Scenario: It happens");
  });

  it("drops the heading when the two sides are compared", () => {
    expect(blockBody("### Requirement: X\n\nbody").trim()).toBe("body");
    expect(blockBody("body only")).toBe("body only");
  });
});

describe("what a retyped MODIFIED block turns out to have dropped", () => {
  const retyped = [
    "### Requirement: Grade10's programme",
    "",
    "Members earn points on what they spend.",
    "",
    "#### Scenario: loyalty-SC-23 - A Diamond member earns the tier rate",
    "",
    "- **WHEN** a base member completes a HKD 100 purchase",
    "- **THEN** they earn 10 points",
  ].join("\n");

  const rows = diffLines(blockBody(durableBlock(durable)), blockBody(retyped));
  const removed = rows
    .filter((row) => row.kind === "removed")
    .map((row) => row.text);

  it("shows the table it deleted", () => {
    expect(removed).toContain("| Platinum | 1.2 |");
    expect(removed).toContain("| Diamond | 1.5 |");
  });

  it("shows the scenario it deleted, by id", () => {
    expect(removed).toContain(
      "#### Scenario: loyalty-SC-24 - Black is the ceiling",
    );
  });

  it("shows the rewritten line as both a deletion and an addition", () => {
    expect(removed).toContain(
      "- **WHEN** a Diamond member completes a HKD 1,000 purchase",
    );
    expect(
      rows.filter((row) => row.kind === "added").map((row) => row.text),
    ).toContain("- **WHEN** a base member completes a HKD 100 purchase");
  });

  it("keeps the heading both sides still agree on", () => {
    expect(rows.map((row) => row.text)).toContain(
      "#### Scenario: loyalty-SC-23 - A Diamond member earns the tier rate",
    );
    expect(diffTotals(rows).removed).toBeGreaterThan(0);
  });
});

describe("what the diff refuses to call a change", () => {
  it("says nothing at all about a block that only got rewrapped", () => {
    const rows = diffLines("one\n\n\ntwo", "one\n\ntwo\n");

    expect(diffTotals(rows)).toEqual({ added: 0, removed: 0 });
    expect(rows.every((row) => row.kind === "same")).toBe(true);
  });

  it("reads an addition as an addition, not as a rewrite of what follows", () => {
    const rows = diffLines("a\nb", "a\nnew\nb");

    expect(rows.map((row) => `${row.kind}:${row.text}`)).toEqual([
      "same:a",
      "added:new",
      "same:b",
    ]);
  });
});
