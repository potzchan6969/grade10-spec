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
  ADMIN_CAPABILITY_BACKGROUND,
  COLUMNS,
  capabilityBackground,
  colLetter,
  DEFAULT_ENV,
  DRAFT_BACKGROUND,
  envOf,
  FILTER_COLUMNS,
  FILTER_START,
  FUTURE_CAPABILITY_BACKGROUND,
  isAdminCapability,
  locateRun,
  MARKING_COLUMNS,
  MARKING_START,
  PRODUCT_CAPABILITY_BACKGROUND,
  quoteTab,
  READING_COLUMNS,
  RESULT_COLORS,
  RESULTS,
  SUMMARY_BANDS,
  SUMMARY_COLUMNS,
  SUMMARY_LEAD_COLUMNS,
  SURFACE_END,
  SURFACES,
  summaryRows,
  tabTitle,
} from "./lib/run-sheet-layout.mjs";
import {
  automatedGateOf,
  buildGrid,
  caseRow,
  caseRows,
  inReadingOrder,
  selectCases,
  surfacePrefill,
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

**Decided by:** \`scripts/openspec/run-sheet.test.mjs\`

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

test("a Field | Value table is one table, header apart from its row", () => {
  assert.deepEqual(journey.cases[0].tables, [
    {
      headers: ["Field", "Value"],
      rows: [["`<a thing>`", "A thing worth 12000000"]],
    },
  ]);
});

const PER_ROW = `# demo/thing/widget Test Cases

**Status:** in-review

## demo-thing-widget-US2: Rows open rows

**As a** collector,
**I want** a row,
**so that** it is one walk.

### demo-thing-widget-US2-TC1-1: Ending one session leaves the other

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** demo-thing-widget-US-02

**Pre-conditions:**

* <subject account> holds <session to end>.

**Test data:**

| <session to end> | <session that remains> |
| --- | --- |
| The session naming the site | The session naming the console |
| The session naming the console | The session naming the site |

**Steps:**

1. End <session to end> from its entry.
2. Read <session that remains>.

**Expected Results:**

* Step 3 no longer lists <session to end>.
* Step 3 lists only <session that remains>.

### demo-thing-widget-US2-TC2-1: An off-brand location is ignored

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** demo-thing-widget-US-02

**Pre-conditions:**

customer is on <grade10 sign-in url> naming <off-brand location>, signed out.

**Test data:**

| Field | Value |
| --- | --- |
| \`<collector email>\` | collector@example.com, an address with an account |

| \`<off-brand location>\` | \`<why it is off brand>\` |
| --- | --- |
| https://collector-rewards.example.com/claim | an address outside this store |
| <zzz sign-in url> | another brand of this store |

**Steps:**

1. Submit <collector email> at the email step.
2. Follow the link.

**Expected Results:**

* The collector lands on this brand.
* The collector is not sent to <off-brand location>.
* Grade10 answers as the row states.

### demo-thing-widget-US2-TC3-1: Later sign-in enters one account

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** demo-thing-widget-US-02

**Pre-conditions:**

* <link-created email> has an account created by an emailed link.

**Test data:**

| Field | Value |
| --- | --- |
| \`<link-created email>\` | collector-link@example.com, an account created by an emailed link |

| \`<method>\` | \`<outcome>\` |
| --- | --- |
| A later emailed link at <link-created email> | the same account, not a second one |

**Steps:**

1. Complete sign-in by <method>.

**Expected Results:**

* The person enters <outcome>.
* No second account exists for <link-created email>.

### demo-thing-widget-US2-TC4-1: A closed lot shows no watch control

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** demo-thing-widget-US-02

**Pre-conditions:**

* <closed lot> is closed as the row states.

**Test data:**

| Closed lot | Viewer |
| --- | --- |
| Sold, with a winner | customer(signed in) |

**Steps:**

1. Navigate to <closed lot url>.

**Expected Results:**

* The lot page renders.

### demo-thing-widget-US2-TC5-1: One table that does not run per row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** demo-thing-widget-US-02

**Pre-conditions:**

None.

**Test data:**

| <session to end> | <session that remains> |
| --- | --- |
| The session naming the site | The session naming the console |

**Steps:**

1. End <session to end>.

**Expected Results:**

* <session to end> is gone.
`;

const perRowJourney = parseSuite(PER_ROW).journeys[0];
const perRowRead = {
  rel: "openspec/specs/demo/thing/widget/feature-tcs.md",
  level: "feature",
  capabilityId: "demo/thing/widget",
};
const perRowCase = (n) => ({
  read: perRowRead,
  tc: { ...perRowJourney.cases[n], journey: perRowJourney },
});

test("a run table prints once per value row, with the cell in square brackets", () => {
  const rows = caseRows(perRowCase(0));
  assert.equal(rows.length, 2);
  assert.equal(at(rows[0], "Case ID"), "demo-thing-widget-US2-TC1-1");
  assert.equal(at(rows[1], "Case ID"), "demo-thing-widget-US2-TC1-1");
  assert.equal(
    at(rows[0], "Steps"),
    "1. End [The session naming the site] from its entry.\n2. Read [The session naming the console].",
  );
  assert.equal(
    at(rows[1], "Steps"),
    "1. End [The session naming the console] from its entry.\n2. Read [The session naming the site].",
  );
  assert.equal(
    at(rows[0], "Expected results"),
    "Step 3 no longer lists [The session naming the site].\nStep 3 lists only [The session naming the console].",
  );
  assert.equal(
    at(rows[0], "Pre-conditions"),
    "<subject account> holds [The session naming the site].",
  );
  assert.equal(
    at(rows[0], "Test data"),
    "<session to end>: The session naming the site\n<session that remains>: The session naming the console",
  );
  assert.equal(at(rows[0], "Web"), "to_do");
  assert.equal(at(rows[0], "Auto web"), "n/a");
  assert.equal(at(rows[1], "Auto mobile"), "n/a");
  assert.equal(at(rows[0], "Steps").includes("Runs once per row"), false);
});

test("shared Field | Value stays in the cell, and a plain column is not filled into the sentence", () => {
  const rows = caseRows(perRowCase(1));
  assert.equal(rows.length, 2);
  assert.equal(
    at(rows[1], "Pre-conditions"),
    "customer is on <grade10 sign-in url> naming [<zzz sign-in url>], signed out.",
  );
  assert.equal(
    at(rows[1], "Steps"),
    "1. Submit <collector email> at the email step.\n2. Follow the link.",
  );
  assert.equal(
    at(rows[1], "Expected results"),
    "The collector lands on this brand.\nThe collector is not sent to [<zzz sign-in url>].\nGrade10 answers as the row states.",
  );
  assert.equal(
    at(rows[0], "Expected results"),
    "The collector lands on this brand.\nThe collector is not sent to [https://collector-rewards.example.com/claim].\nGrade10 answers as the row states.",
  );
  assert.equal(
    at(rows[1], "Test data"),
    "`<collector email>`: collector@example.com, an address with an account\n`<off-brand location>`: <zzz sign-in url>\n`<why it is off brand>`: another brand of this store",
  );
});

test("a name inside a run cell stays, and the shared name in the sentence stays", () => {
  const [row] = caseRows(perRowCase(2));
  assert.equal(
    at(row, "Steps"),
    "1. Complete sign-in by [A later emailed link at <link-created email>].",
  );
  assert.equal(
    at(row, "Expected results"),
    "The person enters [the same account, not a second one].\nNo second account exists for <link-created email>.",
  );
  assert.equal(
    at(row, "Pre-conditions"),
    "<link-created email> has an account created by an emailed link.",
  );
  assert.equal(
    at(row, "Test data"),
    "`<link-created email>`: collector-link@example.com, an account created by an emailed link\n`<method>`: A later emailed link at <link-created email>\n`<outcome>`: the same account, not a second one",
  );
});

test("a header matches case-sensitively, so Closed lot does not fill <closed lot>", () => {
  const [row] = caseRows(perRowCase(3));
  assert.equal(
    at(row, "Pre-conditions"),
    "<closed lot> is closed as the row states.",
  );
  assert.equal(at(row, "Steps"), "1. Navigate to <closed lot url>.");
  assert.equal(
    at(row, "Test data"),
    "Closed lot: Sold, with a winner\nViewer: customer(signed in)",
  );
});

test("a column table without the per-row line stays one row, unfilled", () => {
  const rows = caseRows(perRowCase(4));
  assert.equal(rows.length, 1);
  assert.equal(at(rows[0], "Steps"), "1. End <session to end>.");
  assert.equal(at(rows[0], "Expected results"), "<session to end> is gone.");
});

test("a per-row case adds one grid line per value row", () => {
  const { lines } = buildGrid([perRowCase(0)]);
  assert.deepEqual(
    lines.map((line) => line.kind),
    ["capability", "journey", "case", "case"],
  );
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

test("shared-planning-agent-rounds-SC-61 - the Summary register does not carry how many automated cases were left out", () => {
  assert.equal(SUMMARY_COLUMNS.includes("Automated left out"), false);
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
  assert.equal(MARKING_COLUMNS.includes("Tester"), false);
  assert.equal(MARKING_COLUMNS.includes("Date"), false);

  // The reading band ends where the tester's band begins: a tester who never
  // scrolls right can read a case and mark it.
  assert.equal(COLUMNS[MARKING_START - 1], "Expected results");
});

test("surface prefill follows Testability, then Automation status on mixed cases", () => {
  const withClass = (testability, automationStatus) => {
    const base = candidates[0].tc;
    const props = new Map(base.props);
    props.set("Testability", testability);
    props.set("Automation status", automationStatus);
    return surfacePrefill({ ...base, props });
  };

  assert.deepEqual(withClass("manual", "manual"), {
    Web: "to_do",
    Mobile: "to_do",
    "Auto web": "n/a",
    "Auto mobile": "n/a",
  });
  assert.deepEqual(withClass("manual", "automated"), {
    Web: "to_do",
    Mobile: "to_do",
    "Auto web": "n/a",
    "Auto mobile": "n/a",
  });
  assert.deepEqual(withClass("automation", "manual"), {
    Web: "n/a",
    Mobile: "n/a",
    "Auto web": "to_do",
    "Auto mobile": "to_do",
  });
  assert.deepEqual(withClass("automation", "automated"), {
    Web: "n/a",
    Mobile: "n/a",
    "Auto web": "to_do",
    "Auto mobile": "to_do",
  });
  assert.deepEqual(withClass("automation, manual", "manual"), {
    Web: "to_do",
    Mobile: "to_do",
    "Auto web": "n/a",
    "Auto mobile": "n/a",
  });
  assert.deepEqual(withClass("automation, manual", "automated"), {
    Web: "to_do",
    Mobile: "to_do",
    "Auto web": "to_do",
    "Auto mobile": "to_do",
  });
});

test("a manual-only case starts Auto at `n/a`; an automation-only case starts Web and Mobile at `n/a`", () => {
  const manual = caseRow(candidates[0]);
  assert.equal(at(manual, "Web"), "to_do");
  assert.equal(at(manual, "Mobile"), "to_do");
  assert.equal(at(manual, "Auto web"), "n/a");
  assert.equal(at(manual, "Auto mobile"), "n/a");

  const automationOnly = caseRow(candidates[1]);
  assert.equal(at(automationOnly, "Web"), "n/a");
  assert.equal(at(automationOnly, "Mobile"), "n/a");
  assert.equal(at(automationOnly, "Auto web"), "to_do");
  assert.equal(at(automationOnly, "Auto mobile"), "to_do");
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
    ["capability", "journey", "case", "case"],
  );
  assert.equal(rows[0][0], "demo/thing/widget");
  assert.equal(rows[1][0], "demo-thing-widget-US1 — Somebody does a thing");
  // Banners have no result cells, which is what lets `COUNTA` over a result
  // column count cases and skip them.
  assert.equal(at(rows[0], "Web"), "");
  assert.equal(at(rows[1], "Web"), "");
  assert.equal(rows[0].length, COLUMNS.length);
});

test("journeys of two files fold under their capability paths", () => {
  const other = {
    ...candidates[0],
    read: {
      rel: "openspec/specs/shared/auth/sign-out/feature-tcs.md",
      level: "feature",
      capabilityId: "shared/auth/sign-out",
    },
    tc: {
      ...candidates[0].tc,
      id: "shared-auth-sign-out-US1-TC1-1",
      journeyNum: 1,
      journey: { raw: "shared-auth-sign-out-US1", title: "Sign out" },
    },
  };
  const { rows, lines } = buildGrid(inReadingOrder([other, candidates[0]]));
  const caps = lines
    .map((line, i) => (line.kind === "capability" ? rows[i][0] : null))
    .filter(Boolean);
  assert.deepEqual(caps, ["demo/thing/widget", "shared/auth/sign-out"]);
});

test("admin banners use the fall orange, product banners the noble green", () => {
  assert.equal(isAdminCapability("grade10-admin/auction/listing"), true);
  assert.equal(isAdminCapability("grade10-site/auction/listing-page"), false);
  assert.deepEqual(
    capabilityBackground("grade10-admin/auction/listing"),
    ADMIN_CAPABILITY_BACKGROUND,
  );
  assert.deepEqual(
    capabilityBackground("grade10-site/auction/listing-page"),
    PRODUCT_CAPABILITY_BACKGROUND,
  );
  assert.notDeepEqual(
    FUTURE_CAPABILITY_BACKGROUND,
    PRODUCT_CAPABILITY_BACKGROUND,
  );
  assert.notDeepEqual(
    FUTURE_CAPABILITY_BACKGROUND,
    ADMIN_CAPABILITY_BACKGROUND,
  );
});

test("draft stone grey is not the result to_do grey", () => {
  assert.notDeepEqual(DRAFT_BACKGROUND, RESULT_COLORS.to_do);
});

test("env defaults to staging and refuses anything else", () => {
  assert.equal(envOf(undefined), DEFAULT_ENV);
  assert.equal(envOf(""), "staging");
  assert.equal(envOf("Production"), "production");
  assert.equal(envOf("lab"), null);
});

test("Summary odd runs are the light green band", () => {
  assert.deepEqual(SUMMARY_BANDS[1 % SUMMARY_BANDS.length], SUMMARY_BANDS[1]);
  assert.notDeepEqual(SUMMARY_BANDS[0], SUMMARY_BANDS[1]);
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

test("a tab title is the run id, a hyphen, and the name slug", () => {
  assert.equal(tabTitle(1, "auction-auth"), "1-auction-auth");
});

test("locateRun finds the identity row and the tab it names", () => {
  const summary = [
    ["Run ID", "Tab"],
    ["1", "1-auction-auth"],
    ["", ""],
    ["", ""],
    ["", ""],
    ["2", "2-smoke"],
  ];
  const found = locateRun(summary, ["Summary", "1-auction-auth", "2-smoke"], 1);
  assert.equal(found.ok, true);
  assert.equal(found.startRow, 1);
  assert.equal(found.tab, "1-auction-auth");
});

test("locateRun refuses a Summary row whose tab is missing", () => {
  const summary = [
    ["Run ID", "Tab"],
    ["3", "3-gone"],
  ];
  const found = locateRun(summary, ["Summary", "1-auction-auth"], 3);
  assert.equal(found.ok, false);
  assert.match(found.why, /no tab has that title/);
});

test("locateRun refuses a run id Summary does not hold", () => {
  const found = locateRun([["Run ID", "Tab"]], ["Summary"], 4);
  assert.equal(found.ok, false);
  assert.match(found.why, /no run 4/);
});

test("a Summary run writes identity and SHA on the first row only", () => {
  const rows = summaryRows({
    runId: 3,
    tab: "3-auction-signin",
    date: "2026-09-22",
    name: "auction-signin",
    selection: "Sign-in that is auction related",
    env: "staging",
    sha: "abc123",
  });

  assert.equal(rows.length, SURFACES.length);
  assert.equal(rows[0].length, SUMMARY_COLUMNS.length);
  assert.equal(SUMMARY_COLUMNS.at(-1), "Commit SHA");
  assert.deepEqual(SUMMARY_COLUMNS.slice(0, 6), SUMMARY_LEAD_COLUMNS);
  assert.equal(SUMMARY_LEAD_COLUMNS.at(-1), "Env");
  assert.equal(SUMMARY_COLUMNS.includes("Draft"), false);
  assert.equal(SUMMARY_COLUMNS.includes("Cases"), false);
  assert.equal(
    SUMMARY_COLUMNS.indexOf("Pass rate"),
    SUMMARY_COLUMNS.indexOf("Total") + 1,
  );

  const at = (row, name) => row[SUMMARY_COLUMNS.indexOf(name)];
  assert.equal(at(rows[0], "Run ID"), 3);
  assert.equal(at(rows[0], "Tab"), "3-auction-signin");
  assert.equal(at(rows[0], "Env"), "staging");
  assert.equal(at(rows[0], "Commit SHA"), "abc123");
  assert.equal(at(rows[0], "Surface"), "Web");
  const pass = colLetter(SUMMARY_COLUMNS.indexOf("Pass"));
  const total = colLetter(SUMMARY_COLUMNS.indexOf("Total"));
  const na = colLetter(SUMMARY_COLUMNS.indexOf("N/A"));
  assert.match(String(at(rows[0], "Total")), /SUM\(INDIRECT/);
  assert.match(
    String(at(rows[0], "Pass rate")),
    new RegExp(`INDIRECT\\("${pass}"&ROW`),
  );
  assert.match(
    String(at(rows[0], "Pass rate")),
    new RegExp(`INDIRECT\\("${total}"&ROW`),
  );
  assert.match(
    String(at(rows[0], "Pass rate")),
    new RegExp(`INDIRECT\\("${na}"&ROW`),
  );
  assert.doesNotMatch(String(at(rows[0], "Pass rate")), /COUNTIF/);
  assert.equal(at(rows[1], "Run ID"), "");
  assert.equal(at(rows[1], "Selection"), "");
  assert.equal(at(rows[1], "Env"), "");
  assert.equal(at(rows[1], "Commit SHA"), "");
  assert.equal(at(rows[1], "Surface"), "Mobile");
  assert.equal(at(rows[3], "Surface"), "Auto mobile");
  assert.equal(at(rows[3], "Commit SHA"), "");
});

test("shared-planning-agent-rounds-SC-78 - the left-out cases are named under the count, with what decides each", () => {
  const { picked, refused } = selectCases(candidates, {});
  const gate = automatedGateOf({ picked, refused });

  assert.equal(gate.leftOut, 1);
  assert.deepEqual(gate.leftOutLines, [
    "  demo-thing-widget-US1-TC4-1 - scripts/openspec/run-sheet.test.mjs",
  ]);
});

test("shared-planning-agent-rounds-SC-78 - a left-out case naming no test says so in the same shape", () => {
  const gate = automatedGateOf({
    picked: [],
    refused: [
      { id: "demo-thing-widget-US1-TC9-1", reason: "automation" },
      {
        id: "demo-thing-widget-US1-TC8-1",
        reason: "automation",
        decidedBy: ["scripts/a.test.mjs", "tools/manual/test/b.test.ts"],
      },
      { id: "demo-thing-widget-US1-TC7-1", reason: "status" },
    ],
  });

  assert.equal(gate.leftOut, 2);
  assert.deepEqual(gate.leftOutLines, [
    "  demo-thing-widget-US1-TC9-1 - decided by no named test",
    "  demo-thing-widget-US1-TC8-1 - scripts/a.test.mjs, tools/manual/test/b.test.ts",
  ]);
});
