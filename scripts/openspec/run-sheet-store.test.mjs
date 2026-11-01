/*
 * The store's page files reach a run sheet (tcs-rules r7, **Store**).
 *
 * Every store case lives in `docs/prds/products/grade10-site/store/tests/`,
 * one file per page, grouped under `## <page>#<section>:` headings rather than
 * journeys. A run reads them beside the durable suites, at the source commit
 * it pins, or the store's cases cannot be walked from a sheet at all.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";

import {
  candidatesAt,
  selectionSnapshot,
  validateRecord,
} from "./lib/run-sheet-records.mjs";
import {
  buildGrid,
  inReadingOrder,
  matchesChangedScope,
  readCandidates,
  selectCases,
} from "./lib/select-cases.mjs";

const PAGE = `# grade10-site/store/cart Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-24, tcs-rules r7
**Capabilities:** grade10-site/store/cart-drawer

## Walk 1: Open the cart

### Route

1. Select Cart.
   - The drawer \`g10.store-cart.TC1\`

## cart#reviewing-the-cart: Reviewing the Cart

<!-- trace:case id=g10.store-cart.TC-q5a rev=3 -->
### g10.store-cart.TC2: The cart opens over the page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart/opening

**Pre-conditions:**

* customer on \`<listing url>\`.

**Steps:**

1. Select Cart.

**Expected Results:**

* The drawer opens.

## discounts#codes: Codes

### g10.store-cart.TC19: A code takes its cut

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** discounts#codes/store-codes

**Steps:**

1. Pick a code.

**Expected Results:**

* The total drops.

---

## Ungrouped

### cart#reviewing-the-cart: Reviewing the Cart

#### g10.store-cart.TC10: A guest's cart stays in this browser

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart/kept
* **Retired:** 2026-10-27 - the page no longer says so

**Steps:**

1. Reload.

**Expected Results:**

* The lines stay.

#### g10.store-cart.TC1: An empty cart says so

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart/empty

**Steps:**

1. Open Cart with no lines.

**Expected Results:**

* The empty message shows.
`;

const STORE_FILE = "docs/prds/products/grade10-site/store/tests/cart-tcs.md";

function repo(t, files) {
  const root = mkdtempSync(join(tmpdir(), "run-sheet-store-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}

const git = (root, args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();

function commit(root, message) {
  git(root, ["add", "."]);
  git(root, ["commit", "-q", "-m", message]);
  return git(root, ["rev-parse", "HEAD"]);
}

test("a store page file's cases are candidates, filed under their page's sections", (t) => {
  const root = repo(t, { [STORE_FILE]: PAGE });
  const candidates = readCandidates(root);
  assert.deepEqual(
    candidates.map((one) => [one.tc.id, one.tc.journey.raw, one.tc.tcNum]),
    [
      ["g10.store-cart.TC2", "cart#reviewing-the-cart", 2],
      ["g10.store-cart.TC19", "discounts#codes", 19],
      ["g10.store-cart.TC10", "cart#reviewing-the-cart", 10],
      ["g10.store-cart.TC1", "cart#reviewing-the-cart", 1],
    ],
  );
  const { read, tc } = candidates[0];
  assert.equal(read.rel, STORE_FILE);
  assert.equal(read.capabilityId, "grade10-site/store/cart");
  assert.equal(read.level, "feature");
  assert.equal(tc.markerId, "g10.store-cart.TC-q5a");
  assert.equal(tc.markerRev, 3);
  assert.deepEqual(tc.stepTexts, ["Select Cart."]);
  assert.deepEqual(tc.expectedTexts, ["The drawer opens."]);
});

test("an Ungrouped case rejoins its section, and sections keep the file's order", (t) => {
  const root = repo(t, { [STORE_FILE]: PAGE });
  const { picked, refused } = selectCases(readCandidates(root), {
    includeDraft: true,
    includeAutomated: true,
  });
  assert.deepEqual(
    inReadingOrder(picked).map((one) => one.tc.id),
    ["g10.store-cart.TC1", "g10.store-cart.TC2", "g10.store-cart.TC19"],
  );
  assert.deepEqual(
    refused.map((one) => one.id),
    ["g10.store-cart.TC10"],
  );
  const { lines } = buildGrid(picked);
  assert.deepEqual(
    lines.filter((one) => one.kind !== "case").map((one) => one.key),
    ["grade10-site/store/cart", "cart#reviewing-the-cart", "discounts#codes"],
  );
});

test("a changed store page selects the page file whose cases trace it", (t) => {
  const root = repo(t, { [STORE_FILE]: PAGE });
  const { read } = readCandidates(root)[0];
  const page = (name) => `docs/prds/products/grade10-site/store/${name}.md`;
  assert.equal(matchesChangedScope(read, [page("discounts")]), true);
  assert.equal(matchesChangedScope(read, [STORE_FILE]), true);
  assert.equal(matchesChangedScope(read, [page("checkout")]), false);
});

test("a pinned source reads its store folder, and one from before it still reads", (t) => {
  const root = repo(t, { "openspec/specs/README.md": "# Specs\n" });
  git(root, ["init", "-q", "-b", "main"]);
  git(root, ["config", "user.email", "test@example.com"]);
  git(root, ["config", "user.name", "Run sheet test"]);
  const before = commit(root, "test: no store folder");
  mkdirSync(dirname(join(root, STORE_FILE)), { recursive: true });
  writeFileSync(join(root, STORE_FILE), PAGE);
  const after = commit(root, "test: store folder");
  assert.deepEqual(candidatesAt(root, before), []);
  assert.deepEqual(
    candidatesAt(root, after).map((one) => one.tc.id),
    [
      "g10.store-cart.TC2",
      "g10.store-cart.TC19",
      "g10.store-cart.TC10",
      "g10.store-cart.TC1",
    ],
  );
});

test("a run record of store cases is a valid receipt", (t) => {
  const root = repo(t, { [STORE_FILE]: PAGE });
  const { picked } = selectCases(readCandidates(root), { includeDraft: true });
  const record = {
    version: 1,
    state: "trial",
    spreadsheetId: "production-sheet",
    runId: 5,
    sheetId: 42,
    tab: "5-store-stage1",
    sourceCommit: "a".repeat(40),
    snapshot: selectionSnapshot(picked, {
      name: "store-stage1",
      env: "staging-1",
    }),
    copiedFrom: null,
  };
  assert.equal(validateRecord(record), record);
  assert.deepEqual(
    record.snapshot.selected.map((one) => one.path),
    [STORE_FILE, STORE_FILE, STORE_FILE],
  );
});
