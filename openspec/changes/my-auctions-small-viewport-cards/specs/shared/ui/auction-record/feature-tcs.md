# shared/ui/auction-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r4

## shared-ui-auction-record-US1: The record surface exports

**As an** application composing My Auctions,
**I want** the shared auction-record blocks to present bookmarked lots,
**so that** collectors can act on every lot without losing facts on a small viewport.

### shared-ui-auction-record-US1-TC20-1: Below md each lot is a card without sideways scroll

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The record surface exports

**Pre-conditions:**

* `AuctionRecord` is supplied with at least one bidding lot and one watching lot.
* The viewport is below `md`.

**Steps:**

1. Render the record surface.
2. Read each lot's identity, current bid and Status without panning sideways.
3. Reach Email alerts and Unwatch or View order on a lot that supplies them.

**Expected Results:**

* Each lot is a stacked card with its identity, the current bid on one line, a Status badge when labelled, and a footer for Email alerts, Unwatch and View order when supplied.
* Those facts and actions are reachable without horizontal scroll of the page content.
* The table column header row is not shown.

### shared-ui-auction-record-US1-TC21-1: From md the five-column table remains

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The record surface exports

**Pre-conditions:**

* `AuctionRecord` is supplied with at least one bidding lot and one watching lot.
* The viewport is `md` or wider.

**Steps:**

1. Render the record surface.
2. Read the column header row and the table body.

**Expected Results:**

* The lots appear in one five-column table with the column header row.

### shared-ui-auction-record-US1-TC22-1: Below md the whole card opens the lot or order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The record surface exports

**Pre-conditions:**

* The viewport is below `md`.
* `AuctionRecord` is supplied with a won lot whose `href` opens Winner Order.
* It is also supplied with a watching lot that has Unwatch and Email alerts.

**Steps:**

1. Activate the won lot's card body, away from its controls.
2. On the watching card, turn Email alerts off.
3. On the same card, select Unwatch.

**Expected Results:**

* Step 1 opens the supplied Winner Order `href`.
* Steps 2 and 3 each change only that lot and do not open the card's `href`.

## Reconciliation

| Blind outcome | Resolution |
| --- | --- |
| Below md each lot is a card without sideways scroll | Folded as covered by `shared-ui-auction-record-SC-17` / `shared-ui-auction-record-US1-TC20-1` |
| From md the five-column table remains | Folded as covered by `shared-ui-auction-record-SC-18` / `shared-ui-auction-record-US1-TC21-1` |
| Below md the whole card opens the lot or order | Folded as covered by `shared-ui-auction-record-SC-19` / `shared-ui-auction-record-US1-TC22-1` |
