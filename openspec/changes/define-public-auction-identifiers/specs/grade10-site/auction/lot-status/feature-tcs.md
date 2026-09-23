# grade10-site/auction/lot-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-23, tcs-rules r3.0

## grade10-site-auction-lot-status-US2: Collector does not find draft or called-off lots in browse or search

**As a** collector,
**I want** draft lots and called-off lots absent from browse, search and my watchlist,
**so that** I can use a called-off lot's original address directly without it appearing as an available auction.

### grade10-site-auction-lot-status-US2-TC4-1: A called-off lot stays reachable at its canonical address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* A published listing has canonical address `<listing_url>` and code `<listing_code>`.

**Steps:**

1. Call the listing off.
2. Search the catalogue and browse for the listing.
3. Open `<listing_url>` directly.
4. Try `<listing_code>` as an address.

**Expected Results:**

* Catalogue and search do not return the listing.
* `<listing_url>` still serves the public listing page.
* The listing code does not resolve as an address.
* The canonical URL and code remain reserved.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Whether removing a lot from browse/search also disables its original address | Settled in Q16 and the listing-page and lot-status deltas: browse/search omit the called-off lot; the canonical address remains directly accessible and permanently reserved. |
| Whether the listing code can act as a route | The code remains a non-route; this case checks the public address boundary. |
