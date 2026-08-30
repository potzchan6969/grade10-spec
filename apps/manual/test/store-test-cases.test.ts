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
