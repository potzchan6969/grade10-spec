# grade10-site/analytics Test Cases

**Status:** reopened · 0/2
**Drafts styled:** 2026-10-02, tcs-rules r4

**Out of suite:** none — every Feature set root group this change introduces
carries cases below. The capability is walked by nobody on their own; cases
trace those groups.

## Background

* A worker's waiting and held records are read in that worker's own database, its Mixpanel records by state; each sweep also reports the waiting count, the oldest record's age and the held count to Datadog, tagged by product.
* Mixpanel unreachable, a refused record or a lost answer is made by a stubbed Mixpanel on the worker's send path.
* A Mixpanel event is read in the Mixpanel project's events view, by its name and the fact's id.
* The store, auction and loyalty workers sweep every 5 minutes, the vault worker every 15 minutes.

## g10.analytics-analytics.US1: Mixpanel events and profiles

**As a** collector,
**I want** browse, bid, and pay recorded as one path without inventing people,
**so that** funnels and cohorts stay honest for the operators who read them.

<!-- trace:case id=g10.analytics-analytics.TC-xjo rev=1 covers=g10.analytics-analytics.SC-rx2,g10.analytics-analytics.SC-ju7,g10.analytics-analytics.SC-ubv,g10.analytics-analytics.SC-w72,g10.analytics-analytics.SC-su2,g10.analytics-analytics.SC-4xt,g10.analytics-analytics.SC-7qm,g10.analytics-analytics.SC-sss,g10.analytics-analytics.SC-asj,g10.analytics-analytics.SC-bk7,g10.analytics-analytics.SC-ni2,g10.analytics-analytics.SC-j7u,g10.analytics-analytics.SC-v8r,g10.analytics-analytics.SC-fpn,g10.analytics-analytics.SC-vau,g10.analytics-analytics.SC-ce8,g10.analytics-analytics.SC-4ge,g10.analytics-analytics.SC-use,g10.analytics-analytics.SC-u9c,g10.analytics-analytics.SC-hbr,g10.analytics-analytics.SC-6ma -->
### g10.analytics-analytics.US1-TC11: Store funnel client and server events

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Events

**Pre-conditions:**

- customer(member) has a cart on the Grade10 site.
- The store will accept checkout.

**Steps:**

1. Open a page via in-page navigation.
2. Open a product from the merchandised row.
3. Add the product, open the cart, then accept checkout.
4. Complete payment so Order Paid lands.

**Expected Results:**

- Mixpanel records Page Viewed, Product Viewed with Source `Row`, Product Added, Cart Opened, Checkout Started, and Order Paid.
- Order Paid carries Member true, Points Earned, Points Spent, and Tier when the programme priced the spend.
- A refused checkout records no Checkout Started.

<!-- trace:case id=g10.analytics-analytics.TC-6r6 rev=3 covers=g10.analytics-analytics.SC-rx2,g10.analytics-analytics.SC-ju7,g10.analytics-analytics.SC-ubv,g10.analytics-analytics.SC-w72,g10.analytics-analytics.SC-su2,g10.analytics-analytics.SC-4xt,g10.analytics-analytics.SC-7qm,g10.analytics-analytics.SC-sss,g10.analytics-analytics.SC-asj,g10.analytics-analytics.SC-bk7,g10.analytics-analytics.SC-ni2,g10.analytics-analytics.SC-j7u,g10.analytics-analytics.SC-v8r,g10.analytics-analytics.SC-fpn,g10.analytics-analytics.SC-vau,g10.analytics-analytics.SC-ce8,g10.analytics-analytics.SC-4ge,g10.analytics-analytics.SC-use,g10.analytics-analytics.SC-u9c,g10.analytics-analytics.SC-hbr,g10.analytics-analytics.SC-6ma -->
### g10.analytics-analytics.US1-TC12: Auction funnel events

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
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

- Contact fields stay off Mixpanel for this change; whether `$email`,
  `$name`, and `$phone` land later waits on Consent and Mixpanel erasure.
- Signed In and Signed Out are not Mixpanel events; session end rotates
  the device instead.
- Mixpanel is not the money, points, or loan ledger.
- An event with neither a user nor a device is refused and its fact still
  commits; no Delivery rule states it, since Q13 decided it and today's send
  path already runs it.
- Bid Placed fires when a maximum is accepted; no card hold is taken or captured at bid time, so nothing in the auction funnel records one (decisions Q1).

## Reconciliation

**Run:** 2026-09-29 · blind pass read `## Purpose` and `## Feature set`,
`user-journeys.md` (Walked by nobody), `proposal.md`, `decisions.md`, and
Product Analytics · Delivery and Mixpanel Events. Denied: every
`## Requirements` section and `openspec/changes/archive/`. The durable suite
was read for ids only, its `## Reconciliation` stripped.

- **Uncovered anchors** - none; every Delivery leaf carries a case.
- **Folded in** - a worker stopping right after the commit still sends
  (TC20) and the erasure's own profile write is still sent (TC27) became
  lines of the scenarios on those rules.
- **Dropped and recorded** - an event with no user and no device is refused
  and the fact commits (Q13); it runs today, is no Delivery leaf, and the
  outline's first draft of it as a requirement was removed.
- **Raised** - five questions, each answered in `decisions.md` under
  `## Raised`: a backlog drained over several sweeps, which answers are a
  refusal, a token emptied with records waiting, device-only records at
  erasure, and a held profile write passed by a later one.

**Run:** 2026-09-18 · blind pass read `## Purpose` and `## Feature set`,
`user-journeys.md` (Walked by nobody), `proposal.md`, and the Analytics /
Mixpanel Events PRD pages. Denied: every `## Requirements` section and
`openspec/changes/archive/`. No prior durable `feature-tcs.md` for id
continuity.

- **Uncovered anchors** — none. All four Feature set root groups this
  change introduces — Identity, Events, User profile, Refusals —
  carry at least one case.
- **Raised** — none new; Consent, Mixpanel erasure, and Contact fields
  already sit on the proposal's open questions and the Mixpanel Events
  decisions table.

| Finding | Disposition |
| --- | --- |
| Invoice Paid never fires on a bid hold capture | **Removed:** a bid takes no card hold, so nothing captures one; `grade10-site-analytics-US1-TC12-1` rewritten as `grade10-site-analytics-US1-TC12-2` without the step |

**Run:** 2026-10-02, from the delta against the durable suite. It is a statement, not proof.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Renumbered** - QA1's case was written as `grade10-site-analytics-US1-TC12-1`, below main's `grade10-site-analytics-US1-TC12-2`, which `my-auctions-without-bid-holds` wrote. It adds a refused maximum to the same funnel, so it is `grade10-site-analytics-US1-TC12-3`
- **Folded in** - `grade10-site-analytics-SC-59` by `grade10-site-analytics-US1-TC12-3`; `grade10-site-analytics-SC-18`, `grade10-site-analytics-SC-19` and `grade10-site-analytics-SC-21` stand by it as by main's revision
- **Added by QA2** - in `grade10-site-analytics-US1-TC12-3`, that no Bidder Outbid is recorded for this collector, the second half of `grade10-site-analytics-SC-59`
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
