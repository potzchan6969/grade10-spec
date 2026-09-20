/*
 * What a run tab may say about a case.
 *
 * A run sheet is read by somebody who is not reading the markdown beside it -
 * that is the whole point of it - so a row that drops a step, mangles a test
 * data placeholder, or carries a case no reviewer approved is wrong in a way
 * nobody at the sheet can catch. The validator cannot catch it either: it
 * judges counts, and a row with the right count of the wrong text passes.
 *
 * So the text itself is pinned here, alongside the status gate that decides
 * which cases are allowed out of the store at all.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  COLUMNS,
  colLetter,
  FILTER_COLUMNS,
  FILTER_START,
  MARKING_COLUMNS,
  MARKING_START,
  quoteTab,
  READING_COLUMNS,
  RESULTS,
  SUMMARY_COLUMNS,
  SURFACE_END,
  SURFACES,
} from "./lib/run-sheet-layout.mjs";
import {
  automatedGateOf,
  buildGrid,
  caseRow,
  inReadingOrder,
  selectCases,
} from "./lib/select-cases.mjs";
import { isAutomated, parseSuite } from "./lib/suites.mjs";

const SUITE = `# demo/thing/widget Test Cases

**Status:** in-review

## demo-thing-widget-US1: Somebody does a thing

**As a** collector,
**I want** a thing,
**so that** it is done.

### demo-thing-widget-US1-TC1-1: The thing happens

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** demo-thing-widget-US-01

**Pre-conditions:**
The user holds \`<a thing>\`.

**Test data:**

| Field | Value |
| --- | --- |
| \`<a thing>\` | A thing worth 12000000 |

**Steps:**

1. Open the thing.
2. Read it.

**Expected Results:**

* The thing is open.
* It reads true.

### demo-thing-widget-US1-TC2-1: A draft nobody approved

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** demo-thing-widget-US-01

**Pre-conditions:** None.

**Steps:**

1. Do nothing.

**Expected Results:**

* Nothing happens.

### demo-thing-widget-US1-TC3-1: A case the spec stopped stating

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** demo-thing-widget-US-01

**Pre-conditions:** None.

**Steps:**

1. Do nothing.

**Expected Results:**

* Nothing happens.

### demo-thing-widget-US1-TC4-1: A case an automated test already covers

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** demo-thing-widget-US-01

**Pre-conditions:** None.

**Steps:**

1. Do the thing again.

**Expected Results:**

* It still happens.
`;

const parsed = parseSuite(SUITE);
const journey = parsed.journeys[0];
const candidates = journey.cases.map((tc) => ({
  read: {
    rel: "openspec/specs/demo/thing/widget/feature-tcs.md",
    level: "feature",
    capabilityId: "demo/thing/widget",
  },
  tc: { ...tc, journey },
}));

test("a case carries the text of its steps, not only their count", () => {
  const [tc] = journey.cases;
  assert.equal(tc.steps, 2);
  assert.deepEqual(tc.stepTexts, ["Open the thing.", "Read it."]);
  assert.equal(tc.expected, 2);
  assert.deepEqual(tc.expectedTexts, ["The thing is open.", "It reads true."]);
});

test("a test data table reaches the row as field and value", () => {
  const [tc] = journey.cases;
  assert.deepEqual(tc.testData, [
    { field: "`<a thing>`", value: "A thing worth 12000000" },
  ]);
});

test("a data-driven case says so, because a tester runs it once per row", () => {
  assert.equal(journey.cases[0].perRow, true);
  assert.equal(journey.cases[1].perRow, false);
});

test("only `actual` cases leave the store by default", () => {
  const { picked } = selectCases(candidates, {});
  assert.deepEqual(
    picked.map((one) => one.tc.id),
    ["demo-thing-widget-US1-TC1-1"],
  );
});

test("shared-planning-agent-rounds-SC-61 - an automated case is left out by default, and reported", () => {
  const { picked, refused } = selectCases(candidates, {});
  assert.equal(
    picked.some((one) => one.tc.id === "demo-thing-widget-US1-TC4-1"),
    false,
  );
  const left = refused.find((one) => one.id === "demo-thing-widget-US1-TC4-1");
  assert.equal(left?.reason, "automation");
});

test("isAutomated reads the same case the automation gate does", () => {
  const [thing, , , automated] = journey.cases;
  assert.equal(isAutomated(thing), false);
  assert.equal(isAutomated(automated), true);
});

test("shared-planning-agent-rounds-SC-61 - the Summary row carries how many the run left out automated", () => {
  assert.equal(SUMMARY_COLUMNS.at(-1), "Automated left out");
});

test("shared-planning-agent-rounds-SC-61 - the count and its line, at none, one and many", () => {
  // Said as zero rather than left unsaid: the printed line is what proves the
  // gate ran at all, so a run that left nothing out still says so.
  const automation = (many) =>
    Array.from({ length: many }, (_, at) => ({
      id: `demo-thing-widget-US1-TC${at + 5}-1`,
      reason: "automation",
    }));

  for (const [many, line] of [
    [0, "0 automated cases left out"],
    [1, "1 automated case left out"],
    [3, "3 automated cases left out"],
  ]) {
    const gate = automatedGateOf({ picked: [], refused: automation(many) });
    assert.equal(gate.leftOut, many);
    assert.equal(gate.included, 0);
    assert.equal(gate.line, line);
  }

  // With the flag the run says what it took instead: nothing is left out, so
  // the left-out count would read as a gate that did not run.
  const taken = (many) =>
    Array.from({ length: many }, () => ({ tc: journey.cases[3] }));
  for (const [many, line] of [
    [0, "0 automated cases included"],
    [1, "1 automated case included"],
    [4, "4 automated cases included"],
  ]) {
    const gate = automatedGateOf({
      picked: taken(many),
      refused: automation(2),
      includeAutomated: true,
    });
    assert.equal(gate.included, many);
    assert.equal(gate.line, line);
  }
});

test("`--include-automated` takes an automated case too", () => {
  const { picked } = selectCases(candidates, { includeAutomated: true });
  assert.deepEqual(
    picked.map((one) => one.tc.id).sort(),
    ["demo-thing-widget-US1-TC1-1", "demo-thing-widget-US1-TC4-1"].sort(),
  );
});

test("an explicit id is still held to the automation gate", () => {
  const { picked, refused } = selectCases(candidates, {
    ids: ["demo-thing-widget-US1-TC4-1"],
  });
  assert.equal(picked.length, 0);
  assert.equal(refused[0]?.reason, "automation");
});

test("`--include-draft` takes drafts and still refuses a deprecated case", () => {
  // The draft is also automated, so the automation gate is opened too: each
  // gate is its own flag, and this case is about the status gate alone.
  const { picked, refused } = selectCases(candidates, {
    includeDraft: true,
    includeAutomated: true,
  });
  assert.deepEqual(
    picked.map((one) => one.tc.id),
    [
      "demo-thing-widget-US1-TC1-1",
      "demo-thing-widget-US1-TC2-1",
      "demo-thing-widget-US1-TC4-1",
    ],
  );
  assert.deepEqual(
    refused.map((one) => one.id),
    ["demo-thing-widget-US1-TC3-1"],
  );
});

test("a `Suites` filter matches one entry of a comma-separated list", () => {
  assert.equal(selectCases(candidates, { suites: "smoke" }).picked.length, 1);
  assert.equal(selectCases(candidates, { suites: "release" }).picked.length, 0);
});

test("an id naming no case is reported rather than silently dropped", () => {
  const { picked, missing } = selectCases(candidates, {
    ids: ["demo-thing-widget-US1-TC1-1", "demo-thing-widget-US9-TC9-1"],
  });
  assert.deepEqual(
    picked.map((one) => one.tc.id),
    ["demo-thing-widget-US1-TC1-1"],
  );
  assert.deepEqual(missing, ["demo-thing-widget-US9-TC9-1"]);
});

const at = (row, name) => row[COLUMNS.indexOf(name)];

test("a row carries the case, its prefilled results, and its filter axes", () => {
  const row = caseRow(candidates[0]);
  assert.equal(row.length, COLUMNS.length);

  assert.equal(at(row, "Case ID"), "demo-thing-widget-US1-TC1-1");
  assert.equal(at(row, "Title"), "The thing happens");
  assert.equal(
    at(row, "Steps"),
    "Runs once per row of Test data.\n1. Open the thing.\n2. Read it.",
  );
  assert.equal(
    at(row, "Expected results"),
    "The thing is open.\nIt reads true.",
  );
  assert.equal(at(row, "Test data"), "`<a thing>`: A thing worth 12000000");
  assert.equal(at(row, "Product"), "demo");
  assert.equal(at(row, "Domain"), "thing");
  assert.equal(at(row, "Capability"), "widget");
  assert.equal(at(row, "Layer"), "e2e");
  assert.equal(at(row, "Severity"), "blocker");
});

test("the three bands sit in reading order and account for every column", () => {
  assert.deepEqual(COLUMNS, [
    ...READING_COLUMNS,
    ...MARKING_COLUMNS,
    ...FILTER_COLUMNS,
  ]);
  assert.equal(MARKING_START, READING_COLUMNS.length);
  assert.equal(FILTER_START, MARKING_START + MARKING_COLUMNS.length);
  assert.deepEqual(COLUMNS.slice(MARKING_START, SURFACE_END), SURFACES);

  // The reading band ends where the tester's band begins: a tester who never
  // scrolls right can read a case and mark it.
  assert.equal(COLUMNS[MARKING_START - 1], "Expected results");
});

test("a case no automated test covers starts its automation cells at `n/a`", () => {
  const manual = caseRow(candidates[0]);
  assert.equal(at(manual, "Web"), "to_do");
  assert.equal(at(manual, "Mobile"), "to_do");
  assert.equal(at(manual, "Auto web"), "n/a");
  assert.equal(at(manual, "Auto mobile"), "n/a");

  // `automated` is the only value that opens the automation columns, and it
  // leaves the manual ones alone: CI passing is not somebody having looked.
  const automated = caseRow(candidates[1]);
  assert.equal(at(automated, "Web"), "to_do");
  assert.equal(at(automated, "Auto web"), "to_do");
  assert.equal(at(automated, "Auto mobile"), "to_do");
});

test("every prefilled value is one the dropdown offers", () => {
  for (const one of candidates) {
    const row = caseRow(one);
    for (const surface of SURFACES)
      assert.ok(
        RESULTS.includes(at(row, surface)),
        `${surface} of ${one.tc.id} is not a result`,
      );
  }
});

test("a journey reaches the grid as a banner row above the cases that walk it", () => {
  const { rows, lines } = buildGrid([candidates[0], candidates[1]]);
  assert.deepEqual(
    lines.map((line) => line.kind),
    ["journey", "case", "case"],
  );
  assert.equal(rows[0][0], "demo-thing-widget-US1 — Somebody does a thing");
  // The banner has no result cells, which is what lets `COUNTA` over a result
  // column count cases and skip banners.
  assert.equal(at(rows[0], "Web"), "");
  assert.equal(rows[0].length, COLUMNS.length);
});

test("rows read in journey order, so the tab's grouping is its order", () => {
  const shuffled = [candidates[1], candidates[0]];
  assert.deepEqual(
    inReadingOrder(shuffled).map((one) => one.tc.tcNum),
    [1, 2],
  );
});

test("a tab name reaches A1 notation quoted, apostrophes and all", () => {
  assert.equal(quoteTab("1-regression"), "'1-regression'");
  assert.equal(quoteTab("chloe's run"), "'chloe''s run'");
});

test("a column index reads as its A1 letter past Z", () => {
  assert.equal(colLetter(0), "A");
  assert.equal(colLetter(25), "Z");
  assert.equal(colLetter(26), "AA");
});
