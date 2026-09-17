# grade10-site/auction/watchlist Test Cases (delta)

**Status:** pending-review
**Drafts styled:** 2026-09-17, tcs-rules r3.0

## grade10-site-auction-watchlist-US3: Collector reads the listings they watch

**As a** signed-in collector,
**I want** to see the listings I watch, most recently watched first, with
enough to decide whether to act,
**so that** I can return to a listing from one place.

### grade10-site-auction-watchlist-US3-TC4-1: A called-off listing leaves the watched list

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
* **Trace:** grade10-site-auction-watchlist-US-03

**Pre-conditions:**

* Collector watches one lot that ends with no winner and one lot that is
  called off.

**Steps:**

1. Open My Auctions / Watching.

**Expected Results:**

* The called-off lot is not listed.
* The unsold closed lot is listed as closed.

## Reconciliation

| Spec scenario | Suite coverage |
| --- | --- |
| grade10-site-auction-watchlist-SC-15 | covered by durable suite |
| grade10-site-auction-watchlist-SC-16 | covered by durable suite |
| grade10-site-auction-watchlist-SC-17 | US3-TC4-1 |

## Settled

*None yet — suite pending review.*
