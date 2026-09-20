# grade10-site/site/page-shell Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## grade10-site-site-page-shell-US07: Collector opens Help from the header

**As a** collector,
**I want** Help in the primary nav to open the documentation site in a new tab
(after Store Locator when present, after Auction on auction-only),
**so that** I can read help without losing the page I was on, whether I am on
auction-only or full primary nav.

### grade10-site-site-page-shell-US07-TC1-1: Help on auction-only header opens docs in a new tab

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-07

**Pre-conditions:**

* customer is on <grade10 auction url> with auction-only primary nav and a wide
  viewport.
* Help is supplied in the primary nav after Auction; Store Locator is absent.

**Steps:**

1. Locate Help in the primary navigation after Auction.
2. Confirm Store Locator is not in the primary navigation.
3. Activate Help.
4. Check the new browsing context and the original page.

**Expected Results:**

* Help is present in the primary navigation after Auction.
* Store Locator is absent from the primary navigation.
* The documentation site opens in a new browsing context.
* The auction page remains open in the original context.

### grade10-site-site-page-shell-US07-TC2-1: Help on full primary nav opens docs in a new tab

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-07

**Pre-conditions:**

* customer is on <grade10 store url> whose primary nav lists Store and Auction,
  on a wide viewport.
* Help is supplied in the primary nav after Store Locator.

**Steps:**

1. Locate Help in the primary navigation after Store Locator.
2. Activate Help.
3. Check the new browsing context and the original page.

**Expected Results:**

* Help is present in the primary navigation after Store Locator alongside the
  full primary nav.
* The documentation site opens in a new browsing context.
* The store page remains open in the original context.

### grade10-site-site-page-shell-US07-TC3-1: Help in the compact menu opens docs in a new tab

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-07

**Pre-conditions:**

* customer is on <grade10 auction url> at a viewport 375 CSS pixels wide.
* Help is supplied among the primary nav items after Auction; Store Locator is
  absent.

**Steps:**

1. Open the header menu.
2. Locate Help among the primary items in the drawer after Auction.
3. Confirm Store Locator is not in the drawer.
4. Activate Help.
5. Check the new browsing context and the original page.

**Expected Results:**

* Help is reachable in the drawer after Auction.
* Store Locator is absent from the drawer.
* The documentation site opens in a new browsing context.
* The auction page remains open in the original context.

## Raised

* Which host is the durable Help destination — provisional Mintlify vs another
  documentation product?

## Settled

* Help sits in the primary nav for auction-only and full nav (wide and
  compact): after Auction on auction-first, after Store Locator when that item
  is present.
* Auction-first primary nav omits Store Locator until the shop is open.
* Help opens the documentation site in a new tab.
* The durable host address stays open until Product confirms it.

## Reconciliation

**Run:** blind suite + scenarios reconciled 2026-09-16 (designer precommit;
Help moved from utility row to primary nav). Updated 2026-09-16 for
auction-first omitting Store Locator.

* **Raised, deferred** — durable docs host — Product confirms; provisional
  Mintlify remains on the PRD decisions row.
* **Raised, folded into spec** — Help is a primary-nav item after Auction on
  auction-only and after Store Locator when present (`SC-25` / `SC-26`);
  utility row waits only for on-site utility destinations (`SC-12`).
* **Uncovered anchors** — `US-04` modified link rule covered by reaffirmed
  `SC-10`–`SC-12` and the Help scenarios; no new case under `US-04` beyond the
  Help walks that prove the documentation-host exception.
