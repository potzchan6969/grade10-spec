# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-08, tcs-rules r4

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-srq rev=1 covers=g10.auction-winner-order.SC-los -->
### winner-order-US1-TC57-1: A close with the house leading opens no order and sends no won letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `<listing_1>` is led as the row states, its recorded close a few minutes away, and no further bid is coming.
* customer A(signed in, holds a default shipping address, email alerts on) bid on `<listing_1>` as the row states.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing in no campaign, starting price 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00), the listing's committed internal bid |

| Row | Bidding at the close | Orders for `<listing_1>` after the close | Auction-won letters for `<listing_1>` |
| --- | --- | --- | --- |
| House over a collector | The house leads at 508000 under `<house maximum>`, over customer A's maximum of 500000 | None | None |
| House alone | The house leads at 400000 under `<house maximum>`, with no collector bid | None | None |
| Collector over the house | customer A leads at 608000 with maximum 700000, over `<house maximum>` | One, customer A's, winning bid 608000 | One, to customer A |

**Steps:**

1. Wait until `<listing_1>`'s recorded close passes.
2. Read the orders the API holds for `<listing_1>`.
3. As customer A, read My Auctions' row for `<listing_1>` from the API.
4. Filter the send log by `<listing_1>` and read the rows from the close.

**Expected Results:**

* Step 2 reads the row's orders.
* Step 3: in a House row, no order is linked to customer A; in the Collector row, customer A's row links that one order.
* Step 4 reads the row's auction-won letters, and no row is addressed to the house.

## Settled

- The house is never a lot's winner: a close with the house leading opens no auction order, issues no invoice and sends no won or address letter, to the house or anyone (Q5, Q33)

## Reconciliation

**Run:** QA2 round 4, 2026-10-08. Dev's round-4 reading moved scenario anchors onto journeys after the accept review; QA1's round-4 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, revised the internal-bid suite and drafted the winner-order case. QA2 read both, the delta specs, `decisions.md` through Q35, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Folded in** - `winner-order-US1-TC57-1` by `winner-order-SC-277`, its Collector over the house row the unchanged `winner-order-SC-26`
- **Renumbered** - QA1 drafted it as `winner-order-US1-TC48-1`; `complete-auction-post-sale` has since published `TC48` to `TC53` and `TC56` under US1 in the durable suite, so it takes `TC57`, past every number issued there. Its Suites drop `smoke`, which the durable US1 already carries
- **Anchors** - `winner-order-SC-277` serves the Feature set group `A lot the house won`, a rule with no actor; the case traces `winner-order-US-01`, the journey a collector's win walks. Joined on the behaviour
- **Out of suite** - `winner-order-SC-06`, `winner-order-SC-26`, `winner-order-SC-27` and `winner-order-SC-28` restate a collector winner's order, unchanged by this change, and stay with the durable suite's cases; `grade10-admin-auction-internal-bid-US6-TC3-1` also walks `winner-order-SC-277` through Orders and the send log
- **Rejected** - none
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
