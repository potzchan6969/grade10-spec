/**
 * The shape of a run tab and of the Summary tab, defined here rather than in a
 * `_template` tab inside the spreadsheet.
 *
 * A template tab is faster to copy and impossible to review: once somebody
 * edits it, every later run inherits the edit and nobody can see when it
 * happened. Building each tab from this file costs a few more API calls and
 * makes the layout a reviewed change like everything else.
 *
 * Two bands of columns, and the split is the point: a tester may write in the
 * marking band and may not touch the case band, which is a copy of the
 * markdown. `addProtectedRange` enforces it at the cell.
 */

/** The case as the markdown states it. Locked. */
export const CASE_COLUMNS = [
  "Case ID",
  "Level",
  "Product",
  "Domain",
  "Capability",
  "Journey",
  "Journey title",
  "Title",
  "Severity",
  "Priority",
  "Suites",
  "Type",
  "Behaviour",
  "Layer",
  "Automation status",
  "Pre-conditions",
  "Test data",
  "Steps",
  "Expected results",
  "Source",
];

/** What the tester fills in. Open. */
export const MARKING_COLUMNS = ["Result", "Notes", "Tester", "Date"];

export const COLUMNS = [...CASE_COLUMNS, ...MARKING_COLUMNS];

/** What a `Result` cell may say. The Summary counts these exact words. */
export const RESULTS = ["pass", "fail", "blocked", "skipped"];

/** 0-based indices into `COLUMNS`. */
export const RESULT_COL = CASE_COLUMNS.length;
export const NOTES_COL = RESULT_COL + 1;
export const TESTER_COL = RESULT_COL + 2;
export const DATE_COL = RESULT_COL + 3;

export const SUMMARY_TAB = "Summary";

/** One row per run. Where a run's provenance lives: the tab itself starts at
 *  its header row, so a filter and a `COUNTIF` both read a clean range. */
export const SUMMARY_COLUMNS = [
  "Run ID",
  "Tab",
  "Date created",
  "Run name",
  "Selection",
  "Commit SHA",
  "Total",
  "Draft",
  "Pass",
  "Fail",
  "Blocked",
  "Skipped",
  "Pass rate",
];

/** A light grey band on a draft case, so a tester can see they are walking a
 *  case no reviewer has approved. Static, not a rule: a run tab is a snapshot,
 *  and a row's status cannot change inside it. */
export const DRAFT_BACKGROUND = { red: 0.93, green: 0.93, blue: 0.93 };

/** `test cases` needs quoting in A1 notation and `it's` needs its apostrophe
 *  doubled. Every range this script builds goes through here. */
export function quoteTab(tab) {
  return `'${String(tab).replace(/'/g, "''")}'`;
}

/** 0-based column index to an A1 letter: 0 → A, 26 → AA. */
export function colLetter(index) {
  let n = index;
  let out = "";
  do {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return out;
}
