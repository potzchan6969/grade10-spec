import { describe, expect, it } from "vitest";
import { StoreFileError } from "../src/store/disk.mts";
import { readTestCases } from "../src/store/read-specs.mts";

/** The format block of `docs/governance/specs-to-test-cases.md`, kept whole:
 * the file's own status under the title, a compact journey section above the
 * cases, and each case's nine classification properties in their stated
 * order, closing with a `**Trace:**` to the journey. */
const suite = (fileStatus: string, ...cases: string[]) =>
  [
    "# demo-product/alpha Test Cases",
    "",
    ...(fileStatus === "" ? [] : [`**Status:** ${fileStatus}`, ""]),
    "## alpha-US1: Reader follows the thing end to end",
    "",
    "**As a** reader,",
    "**I want** the thing to happen once,",
    "**so that** I can tell whether it already happened.",
    "",
    ...cases,
  ].join("\n");

const testCase = (
  id: string,
  title: string,
  status: string,
  trace = "alpha-US-01",
) =>
  [
    `### ${id}: ${title}`,
    "",
    "**Classification:**",
    "",
    "* **Severity:** major",
    "* **Priority:** high",
    ...(status === "" ? [] : [`* **Status:** ${status}`]),
    "* **Behaviour:** positive",
    "* **Type:** smoke",
    "* **Layer:** e2e",
    "* **Automation status:** manual",
    "* **Testability:** automation",
    `* **Trace:** ${trace}`,
    "",
    "**Pre-conditions:**",
    "The thing has not happened.",
    "",
    "**Steps:**",
    "",
    "1. Ask for the thing.",
    "",
    "**Expected Results:**",
    "",
    "* The thing happens.",
    "",
  ].join("\n");

describe("a suite in the governance format", () => {
  const parsed = readTestCases(
    suite(
      "in-review",
      testCase("alpha-US1-TC1-1", "Reader asks and it happens", "draft"),
      testCase("alpha-US1-TC2-1", "Reader asks again", "actual"),
      testCase("alpha-US1-TC3-2", "Reader asks the old way", "deprecated"),
    ),
  );

  it("takes the file's own status", () => {
    expect(parsed.status).toBe("in-review");
  });

  it("reads each journey-scoped case, its status and the journey it traces", () => {
    expect(parsed.cases.map((one) => [one.id, one.status, one.traces])).toEqual(
      [
        ["alpha-US1-TC1-1", "draft", ["alpha-US-01"]],
        ["alpha-US1-TC2-1", "actual", ["alpha-US-01"]],
        ["alpha-US1-TC3-2", "deprecated", ["alpha-US-01"]],
      ],
    );
  });

  it("reads an approved file as approved", () => {
    const approved = readTestCases(
      suite("approved", testCase("alpha-US1-TC1-1", "It happens", "actual")),
    );
    expect(approved.status).toBe("approved");
  });

  it("reads a pending-review file as pending-review", () => {
    const pending = readTestCases(
      suite(
        "pending-review",
        testCase("alpha-US1-TC1-1", "It happens", "draft"),
      ),
    );
    expect(pending.status).toBe("pending-review");
  });
});

/** An issued id is permanent, so a suite written before the compact
 * journey-scoped id is never renumbered to it — the reader keeps reading
 * what those files issued. */
describe("a suite in an older shape", () => {
  it("reads the flat `<capability>-TC-<n>` id", () => {
    const parsed = readTestCases(
      suite("pending-review", testCase("alpha-TC-01", "It happens", "draft")),
    );
    expect(parsed.cases.map((one) => one.id)).toEqual(["alpha-TC-01"]);
  });

  it("reads the hyphenated journey-scoped id", () => {
    const parsed = readTestCases(
      suite(
        "pending-review",
        testCase("alpha-US-01-TC-01", "It happens", "draft"),
      ),
    );
    expect(parsed.cases.map((one) => one.id)).toEqual(["alpha-US-01-TC-01"]);
  });

  it("reads a trace that names scenarios outright", () => {
    const parsed = readTestCases(
      suite(
        "pending-review",
        testCase(
          "alpha-TC-01",
          "It happens",
          "draft",
          "alpha-SC-01, alpha-SC-02",
        ),
      ),
    );
    expect(parsed.cases[0].traces).toEqual(["alpha-SC-01", "alpha-SC-02"]);
  });

  it("reads `-` property bullets the way it reads `*`", () => {
    const parsed = readTestCases(
      suite(
        "pending-review",
        testCase("alpha-TC-01", "It happens", "actual").replaceAll(
          "\n* ",
          "\n- ",
        ),
      ),
    );
    expect(parsed.cases[0].status).toBe("actual");
    expect(parsed.cases[0].traces).toEqual(["alpha-US-01"]);
  });
});

describe("what a suite says about the spec beside it", () => {
  it("reads the ids a suite leaves uncovered on purpose", () => {
    const parsed = readTestCases(
      [
        "# demo-product/alpha Test Cases",
        "",
        "**Status:** pending-review",
        "",
        "**Out of suite:** alpha-SC-08, alpha-SC-09",
        "",
        "## alpha-US1: Reader follows the thing end to end",
        "",
        testCase("alpha-US1-TC1-1", "It happens", "draft"),
      ].join("\n"),
    );
    expect(parsed.outOfSuite).toEqual(["alpha-SC-08", "alpha-SC-09"]);
  });

  it("reads the out-of-suite ids off bullets beneath the label", () => {
    const parsed = readTestCases(
      [
        "# demo-product/alpha Test Cases",
        "",
        "**Status:** pending-review",
        "",
        "**Out of suite:**",
        "",
        "- `alpha-SC-08` — nobody reaches it",
        "- `alpha-SC-09` — package contract",
        "",
        "## alpha-US1: Reader follows the thing end to end",
        "",
        testCase("alpha-US1-TC1-1", "It happens", "draft"),
      ].join("\n"),
    );
    expect(parsed.outOfSuite).toEqual(["alpha-SC-08", "alpha-SC-09"]);
  });

  it("keeps a case's properties list out of it", () => {
    const parsed = readTestCases(
      suite(
        "pending-review",
        testCase("alpha-US1-TC1-1", "It happens", "draft"),
      ),
    );
    expect(parsed.outOfSuite).toEqual([]);
  });
});

/** A missing or unknown status is malformed per the governance doc, and a
 * default would let a generated draft wear a reviewed suite's authority. */
describe("a suite that states no status", () => {
  it("refuses a file with no `**Status:**` under its title", () => {
    expect(() =>
      readTestCases(
        suite("", testCase("alpha-US1-TC1-1", "It happens", "draft")),
      ),
    ).toThrow(
      /a test-case file states `\*\*Status:\*\* pending-review`, `in-review` or `approved`/,
    );
  });

  it("refuses a file status outside the vocabulary", () => {
    expect(() =>
      readTestCases(
        suite("draft", testCase("alpha-US1-TC1-1", "It happens", "draft")),
      ),
    ).toThrow(/is not `pending-review`, `in-review` or `approved`/);
  });

  it("refuses a case with no `**Status:**`", () => {
    expect(() =>
      readTestCases(
        suite("pending-review", testCase("alpha-US1-TC1-1", "It happens", "")),
      ),
    ).toThrow(
      /test case `alpha-US1-TC1-1: It happens` has no `\*\*Status:\*\*`/,
    );
  });

  it("refuses a case status outside the vocabulary", () => {
    expect(() =>
      readTestCases(
        suite(
          "pending-review",
          testCase("alpha-US1-TC1-1", "It happens", "ready"),
        ),
      ),
    ).toThrow(
      /is `\*\*Status:\*\* ready`, which is not draft, actual or deprecated/,
    );
  });

  /** A trace may name a `## Feature set` group rather than an id, so the
   * reader takes a name it cannot resolve - resolving it is the `trace` rule's
   * job, which reads the spec beside the suite. What no reader can make sense
   * of is a line naming nothing. */
  it("refuses a case whose trace names nothing", () => {
    expect(() =>
      readTestCases(
        suite(
          "pending-review",
          testCase("alpha-US1-TC1-1", "It happens", "draft", "  "),
        ),
      ),
    ).toThrow(/traces nothing/);
  });

  it("takes a trace that names a feature set group verbatim", () => {
    const read = readTestCases(
      suite(
        "pending-review",
        testCase("alpha-US1-TC1-1", "It happens", "draft", "Doing the thing"),
      ),
    );
    expect(read.cases[0].traces).toEqual(["Doing the thing"]);
  });

  /** A `TC` id is permanent, and a task, a review and a downstream test all
   * point at it. Two cases wearing one splits all three without a word. */
  it("refuses a case id the file issues twice, naming both lines", () => {
    expect(() =>
      readTestCases(
        suite(
          "pending-review",
          testCase("alpha-US1-TC1-1", "It happens", "actual"),
          testCase("alpha-US1-TC1-1", "It happens again", "actual"),
        ),
      ),
    ).toThrow(
      /test case `alpha-US1-TC1-1` is issued twice, at line 11 and line 36 — an id names one thing forever/,
    );
  });

  it("points at the line, so the error entry can name it", () => {
    try {
      readTestCases(
        suite("", testCase("alpha-US1-TC1-1", "It happens", "draft")),
      );
      expect.unreachable("the reader should have refused");
    } catch (cause) {
      expect(cause).toBeInstanceOf(StoreFileError);
      expect((cause as StoreFileError).line).toBe(1);
    }
  });
});
