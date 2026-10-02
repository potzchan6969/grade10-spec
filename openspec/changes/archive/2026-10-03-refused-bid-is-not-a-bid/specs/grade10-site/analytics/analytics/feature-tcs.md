# grade10-site/analytics Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-analytics-US1: Mixpanel events and profiles

**As a** collector,
**I want** browse, bid, and pay recorded as one path without inventing people,
**so that** funnels and cohorts stay honest for the operators who read them.

### grade10-site-analytics-US1-TC12-3: Auction funnel events

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

* customer(collector) is signed in, with no card linked.
* `<lot_1>` is live, with no bid from this collector.
* customer B(card linked) is signed in on a separate session, ready to bid on `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A live HKD lot, current bid 480000 minor units, next minimum 488000 minor units |
| `<card>` | The card provider's test card `4242 4242 4242 4242`, any future expiry, any CVC |
| `<refused maximum>` | 400000 minor units, below the next minimum |
| `<accepted maximum>` | 600000 minor units, at or above the next minimum |
| `<rival maximum>` | 550000 minor units, below `<accepted maximum>` |

**Steps:**

1. Open the lot page for `<lot_1>`.
2. Click Watch on the lot page.
3. Link `<card>` from the bid panel.
4. Enter `<refused maximum>` in the custom maximum on the bid panel and confirm the bid.
5. Enter `<accepted maximum>` in the custom maximum and confirm the bid.
6. As customer B, place `<rival maximum>`, so Grade10 places an auto-bid step under `<accepted maximum>`.
7. Let `<lot_1>` close with this collector as winner, and pay the invoice.
8. Read this collector's events for `<lot_1>` in the Mixpanel project.

**Expected Results:**

* Step 4 is refused on the bid form.
* Step 8 shows Lot Viewed, not Product Viewed.
* Step 8 shows Lot Watched once, from step 2 and not from a bid.
* Step 8 shows Card Linked, Auction Won and Invoice Paid once each.
* Step 8 shows Bid Placed once, for `<accepted maximum>`, when step 5 is accepted.
* Step 8 shows no Bid Placed for `<refused maximum>` or for the auto-bid step.
* Step 8 shows no Bidder Outbid for this collector.

## Settled

- Bid Placed fires when a maximum is accepted; no card hold is taken or captured at bid time, so nothing in the auction funnel records one (decisions Q1).

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Renumbered** - QA1's case was written as `grade10-site-analytics-US1-TC12-1`, below main's `grade10-site-analytics-US1-TC12-2`, which `my-auctions-without-bid-holds` wrote. It adds a refused maximum to the same funnel, so it is `grade10-site-analytics-US1-TC12-3`
- **Folded in** - `grade10-site-analytics-SC-59` by `grade10-site-analytics-US1-TC12-3`; `grade10-site-analytics-SC-18`, `grade10-site-analytics-SC-19` and `grade10-site-analytics-SC-21` stand by it as by main's revision
- **Added by QA2** - in `grade10-site-analytics-US1-TC12-3`, that no Bidder Outbid is recorded for this collector, the second half of `grade10-site-analytics-SC-59`
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
