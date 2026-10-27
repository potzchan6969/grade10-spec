import { describe, expect, it } from "vitest";
import { decidedOf, holdsOf, movedOf } from "../src/moved.ts";

/**
 * What moved before an artifact, unit by unit, and whether each move is
 * major, read through `movedOf`.
 */

const decisions = (decided: string, asked = "Does every move hold?") =>
  [
    "## Goals",
    "",
    "- One reading of what moved",
    "",
    "## Decisions",
    "",
    "| Q | Asked | Decided | Instead of |",
    "| --- | --- | --- | --- |",
    "| Q1 | Who is told? | Every hand - the owner's word | One hand |",
    `| Q3 | ${asked} | ${decided} | Every move holds |`,
    "",
  ].join("\n");

describe("a decision row", () => {
  it("is no move where the answer takes the recommendation", () => {
    expect(
      movedOf(
        "decisions",
        decisions("❓ pm - recommended: A major move holds"),
        decisions("A major move holds - decided by the round"),
      ),
    ).toEqual([]);
    expect(
      movedOf(
        "decisions",
        decisions("❓ pm - recommended: A major move holds"),
        decisions("A major move holds - the owner's word"),
      ),
    ).toEqual([]);
  });

  it("is major where the answer overturns the recommendation, quoted before and after", () => {
    expect(
      movedOf(
        "decisions",
        decisions("❓ pm - recommended: Every move holds"),
        decisions("A major move holds - the owner's word"),
      ),
    ).toEqual([
      {
        item: "decisions",
        key: "Q3",
        before: "❓ pm - recommended: Every move holds",
        after: "A major move holds - the owner's word",
        major: true,
      },
    ]);
  });

  it("is small where only the ❓ wrapper went on", () => {
    const [moved] = movedOf(
      "decisions",
      decisions("A major move holds"),
      decisions("❓ pm - recommended: A major move holds"),
    );
    expect(moved).toMatchObject({ key: "Q3", major: false });
  });

  it("is small where only the Asked cell moved", () => {
    const [moved] = movedOf(
      "decisions",
      decisions("A major move holds", "Does every move hold?"),
      decisions("A major move holds", "Does each move hold the next landing?"),
    );
    expect(moved).toMatchObject({ key: "Q3", major: false });
  });

  it("is major where a row is added", () => {
    const before = decisions("A major move holds");
    const after = `${before}| Q4 | What is major? | All but a small set | Small by default |\n`;
    expect(movedOf("decisions", before, after)).toEqual([
      {
        item: "decisions",
        key: "Q4",
        after:
          "| Q4 | What is major? | All but a small set | Small by default |",
        major: true,
      },
    ]);
  });
});

describe("the proposal", () => {
  const proposal = (why: string, changes = "- One message per person") =>
    `# Tell each hand\n\n## Why\n\n${why}\n\n## What Changes\n\n${changes}\n`;

  it("is small where only the Why moved", () => {
    const moved = movedOf(
      "proposal",
      proposal("A hand learns which file moved."),
      proposal("A hand learns only which file moved, not what moved in it."),
    );
    expect(moved).toEqual([
      expect.objectContaining({ key: "## Why", major: false }),
    ]);
    expect(holdsOf(moved)).toBe(false);
  });

  it("is major where What Changes moved", () => {
    const moved = movedOf(
      "proposal",
      proposal("Why."),
      proposal("Why.", "- One message per artifact"),
    );
    expect(moved).toEqual([
      expect.objectContaining({ key: "## What Changes", major: true }),
    ]);
    expect(holdsOf(moved)).toBe(true);
  });
});

describe("any artifact", () => {
  it("moves nothing where only the whitespace moved", () => {
    expect(
      movedOf("ui-design", "## A\n\nOne  line.\n", "## A\n\nOne line."),
    ).toEqual([]);
  });

  it("is small where only punctuation moved, and major where a decimal point did", () => {
    expect(
      movedOf(
        "ui-design",
        "## A\n\nOne line, two.\n",
        "## A\n\nOne line two.\n",
      ),
    ).toEqual([expect.objectContaining({ key: "## A", major: false })]);
    expect(
      movedOf("ui-design", "## A\n\nCosts 1.5\n", "## A\n\nCosts 15\n"),
    ).toEqual([expect.objectContaining({ key: "## A", major: true })]);
  });

  it("reads a requirement and a case as their own units", () => {
    const spec = (then: string) =>
      [
        "## ADDED Requirements",
        "",
        "### Requirement: A move is told",
        "",
        `The hand SHALL ${then}.`,
        "",
        "### Requirement: A move is classed",
        "",
        "The class SHALL be major or small.",
        "",
      ].join("\n");
    expect(movedOf("specs", spec("be told"), spec("be told once"))).toEqual([
      expect.objectContaining({
        key: "Requirement: A move is told",
        major: true,
      }),
    ]);

    const suite = (step: string) =>
      [
        "# demo Test Cases",
        "",
        "## demo-US1: Somebody is told",
        "",
        "### demo-US1-TC1-1: The hand is told",
        "",
        `1. ${step}`,
        "",
      ].join("\n");
    expect(movedOf("test-cases", suite("Land"), suite("Land twice"))).toEqual([
      expect.objectContaining({ key: "demo-US1-TC1-1", major: true }),
    ]);
  });

  it("reads a text whose keys repeat as one whole, major move", () => {
    const twice = "## A\n\nOne.\n\n## A\n\nTwo.\n";
    expect(movedOf("ui-design", twice, `${twice}\nThree.\n`)).toEqual([
      expect.objectContaining({ key: "ui-design", major: true }),
    ]);
  });
});

describe("the Decided cell's value", () => {
  it("drops the ❓ wrapper and the attribution", () => {
    expect(decidedOf("❓ pm - recommended: X")).toBe("X");
    expect(decidedOf("X - decided by the round")).toBe("X");
    expect(
      decidedOf("X - product owner's word, 2026-10-05 (recommended)"),
    ).toBe("X");
    expect(decidedOf("X - only for admins")).toBe("X - only for admins");
  });
});
