# grade10-site/analytics Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-analytics-US1: Mixpanel events and profiles

**As a** collector,
**I want** browse, bid, and pay recorded as one path without inventing people,
**so that** funnels and cohorts stay honest for the operators who read them.

### grade10-site-analytics-US1-TC12-2: Auction funnel events

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Events

**Pre-conditions:**

- customer(collector) can open a live lot, link a card, watch, and bid.

**Steps:**

1. Open a lot page.
2. Watch the lot without bidding.
3. Link a card and place an accepted maximum.
4. Let the engine place an auto-bid step under that maximum.
5. Close the listing with this collector as winner and pay the invoice.

**Expected Results:**

- Mixpanel records Lot Viewed (not Product Viewed), Lot Watched, Card Linked, Bid Placed once for the accepted maximum, Auction Won, and Invoice Paid.
- Mixpanel does not record Bid Placed for the auto-bid step, or Lot Watched because a bid was placed.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Invoice Paid never fires on a bid hold capture | **Removed:** a bid takes no card hold, so nothing captures one; `grade10-site-analytics-US1-TC12-1` rewritten as `grade10-site-analytics-US1-TC12-2` without the step |

**Run:** 2026-10-02, from the delta against the durable suite. It is a statement, not proof.
