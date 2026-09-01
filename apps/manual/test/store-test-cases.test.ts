import { describe, expect, it } from "vitest";
import { StoreFileError } from "../src/store/disk.mts";
import { readTestCases } from "../src/store/read-specs.mts";

/** The format block of `docs/governance/specs-to-test-cases.md`, kept whole:
 * the nine properties in their stated order, a journey section above them, and
 * the file's own status under the title. */
const suite = (fileStatus: string, ...cases: string[]) =>
  [
    "# demo-product/alpha Test Cases",
    "",
    ...(fileStatus === "" ? [] : [`**Status:** ${fileStatus}`, ""]),
    "## alpha-US-01: Reader follows the thing end to end",
    "",
    "**As a** reader,",
    "**I want** the thing to happen once,",
    "**so that** I can tell whether it already happened.",
    "",
    "**Covers:**",
    "",
    "- `alpha-SC-01` — The thing happens",
    "",
    ...cases,
  ].join("\n");

const testCase = (
  id: string,
  title: string,
  status: string,
  trace = "alpha-SC-01",
) =>
  [
    `### ${id}: ${title}`,
    "",
    "**Description:** Proves the thing happens on a first ask.",
    "",
    "**Preconditions:**",
    "",
    "- The thing has not happened.",
    "",
    "**Test data:** None — the case takes no input.",
    "",
    "**Steps:**",
    "",
    "| # | Action | Expected result |",
    "| --- | --- | --- |",
    "| 1 | Ask for the thing. | The thing happens. |",
    "",
    "**Properties:**",
    "",
    "- **Severity:** major",
    "- **Priority:** high",
    ...(status === "" ? [] : [`- **Status:** ${status}`]),
    "- **Behaviour:** positive",
    "- **Type:** smoke",
    "- **Layer:** e2e",
    "- **Automation status:** manual",
    "- **Testability:** automation",
    `- **Trace:** ${trace}`,
    "",
  ].join("\n");

describe("a suite in the governance format", () => {
  const parsed = readTestCases(
    suite(
      "pending-review",
      testCase("alpha-TC-01", "Reader asks and it happens", "draft"),
      testCase("alpha-TC-02", "Reader asks again", "actual"),
      testCase("alpha-TC-03", "Reader asks the old way", "deprecated"),
    ),
  );

  it("takes the file's own status", () => {
    expect(parsed.status).toBe("pending-review");
  });

  it("takes each case's status from its properties list", () => {
    expect(parsed.cases.map((one) => [one.id, one.status, one.traces])).toEqual(
      [
        ["alpha-TC-01", "draft", ["alpha-SC-01"]],
        ["alpha-TC-02", "actual", ["alpha-SC-01"]],
        ["alpha-TC-03", "deprecated", ["alpha-SC-01"]],
      ],
    );
  });

  it("reads an approved file as approved", () => {
    const approved = readTestCases(
      suite("approved", testCase("alpha-TC-01", "It happens", "actual")),
    );
    expect(approved.status).toBe("approved");
  });

  /** A verdict carries its reviewer; the reader hands the signature over so
   * the surfaces can show it and the check can miss it. */
  it("reads the reviewer and date off a signed verdict", () => {
    const signed = readTestCases(
      suite(
        "pending-review",
        testCase("alpha-TC-01", "It happens", "actual").replace(
          "- **Status:** actual",
          "- **Status:** actual\n- **Reviewed by:** @quinn - 2026-09-01",
        ),
      ),
    );

    expect(signed.cases[0].reviewedBy).toBe("quinn");
    expect(signed.cases[0].reviewedOn).toBe("2026-09-01");
  });

  it("leaves an unsigned case without an invented reviewer", () => {
    const parsed = readTestCases(
      suite("pending-review", testCase("alpha-TC-01", "It happens", "draft")),
    );

    expect(parsed.cases[0].reviewedBy).toBeUndefined();
    expect(parsed.cases[0].reviewedOn).toBeUndefined();
  });
});

describe("what a suite says about the spec beside it", () => {
  it("carries each `**Covers:**` bullet as an id and the wording quoted", () => {
    const parsed = readTestCases(
      suite("pending-review", testCase("alpha-TC-01", "It happens", "draft")),
    );
    expect(parsed.citations).toEqual([
      { id: "alpha-SC-01", title: "The thing happens" },
    ]);
  });

  it("reads the ids a suite leaves uncovered on purpose", () => {
    const parsed = readTestCases(
      [
        "# demo-product/alpha Test Cases",
        "",
        "**Status:** pending-review",
        "",
        "**Out of suite:** alpha-SC-08, alpha-SC-09",
        "",
        "## alpha-US-01: Reader follows the thing end to end",
        "",
        testCase("alpha-TC-01", "It happens", "draft"),
      ].join("\n"),
    );
    expect(parsed.outOfSuite).toEqual(["alpha-SC-08", "alpha-SC-09"]);
  });

  it("keeps a case's properties list out of both", () => {
    const parsed = readTestCases(
      suite("pending-review", testCase("alpha-TC-01", "It happens", "draft")),
    );
    expect(parsed.outOfSuite).toEqual([]);
    expect(parsed.citations).toHaveLength(1);
  });
});

/** A missing or unknown status is malformed per the governance doc, and a
 * default would let a generated draft wear a reviewed suite's authority. */
describe("a suite that states no status", () => {
  it("refuses a file with no `**Status:**` under its title", () => {
    expect(() =>
      readTestCases(suite("", testCase("alpha-TC-01", "It happens", "draft"))),
    ).toThrow(
      /a test-case file states `\*\*Status:\*\* pending-review` or `approved`/,
    );
  });

  it("refuses a file status outside the vocabulary", () => {
    expect(() =>
      readTestCases(
        suite("in-review", testCase("alpha-TC-01", "It happens", "draft")),
      ),
    ).toThrow(/neither `pending-review` nor `approved`/);
  });

  it("refuses a case with no `**Status:**`", () => {
    expect(() =>
      readTestCases(
        suite("pending-review", testCase("alpha-TC-01", "It happens", "")),
      ),
    ).toThrow(/test case `alpha-TC-01: It happens` has no `\*\*Status:\*\*`/);
  });

  it("refuses a case status outside the vocabulary", () => {
    expect(() =>
      readTestCases(
        suite("pending-review", testCase("alpha-TC-01", "It happens", "ready")),
      ),
    ).toThrow(
      /is `\*\*Status:\*\* ready`, which is not draft, actual or deprecated/,
    );
  });

  /** A `TC` id is permanent, and a task, a review and a downstream test all
   * point at it. Two cases wearing one splits all three without a word. */
  it("refuses a case id the file issues twice, naming both lines", () => {
    expect(() =>
      readTestCases(
        suite(
          "pending-review",
          testCase("alpha-TC-01", "It happens", "actual"),
          testCase("alpha-TC-01", "It happens again", "actual"),
        ),
      ),
    ).toThrow(
      /test case `alpha-TC-01` is issued twice, at line 15 and line 43 — an id names one thing forever/,
    );
  });

  it("points at the line, so the error entry can name it", () => {
    try {
      readTestCases(suite("", testCase("alpha-TC-01", "It happens", "draft")));
      expect.unreachable("the reader should have refused");
    } catch (cause) {
      expect(cause).toBeInstanceOf(StoreFileError);
      expect((cause as StoreFileError).line).toBe(1);
    }
  });
});
