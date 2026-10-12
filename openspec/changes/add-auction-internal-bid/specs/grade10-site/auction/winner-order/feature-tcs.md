# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-08, tcs-rules r4

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-srq rev=2 covers=g10.auction-winner-order.SC-los -->
### winner-order-US1-TC57-2: A close with an internal bidder leading opens its order with its billing address and sends no letter

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* `<listing_1>` is led as the row states, its recorded close a few minutes away, and no further bid is coming.
* `<listing_1>`'s internal bid of `<house maximum>` is committed as `<internal bidder>`, which holds `<house billing address>`.
* customer A(signed in, holds a default shipping address, email alerts on) bid on `<listing_1>` as the row states.
* admin(auction operator) is on <grade10 auction send log url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published HKD listing in no campaign, starting price 400000 minor units (HK$4,000.00) |
| `<house maximum>` | 600000 minor units (HK$6,000.00), the listing's committed internal bid |
| `<internal bidder>` | An active internal bidder profile: name "QA House One", email label qa-house-one@internal.test |
| `<house billing address>` | A Hong Kong address with every required field: name "Grade10 Stock Room", 1 Test Road, Central, Hong Kong |

| Row | Bidding at the close | Order for `<listing_1>` after the close | Auction-won letters for `<listing_1>` |
| --- | --- | --- | --- |
| House over a collector | The house leads at 508000 under `<house maximum>`, over customer A's maximum of 500000 | One, `<internal bidder>`'s, flagged internal, winning bid 508000, delivery and billing address `<house billing address>`, bank transfer, Preparing Invoice | None |
| House alone | The house leads at 400000 under `<house maximum>`, with no collector bid | One, `<internal bidder>`'s, flagged internal, winning bid 400000, delivery and billing address `<house billing address>`, bank transfer, Preparing Invoice | None |
| Collector over the house | customer A leads at 608000 with maximum 700000, over `<house maximum>` | One, customer A's, not flagged internal, winning bid 608000, Awaiting Setup | One, to customer A |

**Steps:**

1. Wait until `<listing_1>`'s recorded close passes.
2. Read the orders the API holds for `<listing_1>`.
3. As customer A, read My Auctions' row for `<listing_1>` from the API.
4. Filter the send log by `<listing_1>` and read the rows from the close.

**Expected Results:**

* Step 2 holds exactly one order, the row's order.
* Step 3: in a House row, no order is linked to customer A; in the Collector row, customer A's row links that one order.
* Step 4 reads the row's auction-won letters.
* Step 4 holds no row addressed to `<internal bidder>`'s email label: no won, address or setup letter.

## Settled

- A close with the house leading opens one auction order for the internal bidder, flagged internal, Preparing Invoice with the internal bidder's billing address as its delivery and billing address and bank transfer; it issues no invoice and sends no won, address or other order letter, to the internal bidder or anyone (Q5, Q33, Q50, Q51, Q52, Q53)

## Reconciliation

**Run:** QA2 round 6, 2026-10-12, over the round-4 run below. Dev's round-6 reading raised `winner-order-SC-277` to revision 2, a close with the house leading now opening the internal bidder's order, and dropped the MODIFIED block of one invoice and one order per lot. QA1's round-6 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, revised the case here. QA2 read both, the delta specs, `decisions.md` through Q58, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Round 6, revised** - `winner-order-US1-TC57-1` to `winner-order-US1-TC57-2` by `winner-order-SC-277`: a close with the internal bidder leading opens its order, flagged internal, and sends no letter; its marker's revision rises to 2
- **Round 6, corrected to the requirement** - QA1's House rows read the order not Awaiting Setup with only its billing address; they now read Preparing Invoice, `<house billing address>` as both addresses and bank transfer, as `winner-order-SC-277` states (Q52, Q53). `<house billing address>` names "Grade10 Stock Room", not the internal bidder (Q55)
- **Round 6, out of suite** - `winner-order-SC-26`, `winner-order-SC-27` and `winner-order-SC-28` restate a collector winner's order, unchanged by this change, and stay with the durable suite's cases, beside the Collector over the house row here; `grade10-admin-auction-internal-bid-US6-TC4-1` also walks `winner-order-SC-277` through the order page and the send log
- **Round 6, settled** - the stale line that the house is never a lot's winner is rewritten under Q5, Q33 and Q50 to Q53
- **Round 6, rejected** - none
- **Round 6, raised** - none
- **Round 6, contradicted** - none

**Run, round 4:** QA2 round 4, 2026-10-08. Dev's round-4 reading moved scenario anchors onto journeys after the accept review; QA1's round-4 blind pass, denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`, revised the internal-bid suite and drafted the winner-order case. QA2 read both, the delta specs, `decisions.md` through Q35, `tech-design.md`, `tasks.md`, the durable specs and suites, and the PRD pages; not the archive. It is a statement, not proof.

- **Folded in** - `winner-order-US1-TC57-1` by `winner-order-SC-277`, its Collector over the house row the unchanged `winner-order-SC-26`
- **Renumbered** - QA1 drafted it as `winner-order-US1-TC48-1`; `complete-auction-post-sale` has since published `TC48` to `TC53` and `TC56` under US1 in the durable suite, so it takes `TC57`, past every number issued there. Its Suites drop `smoke`, which the durable US1 already carries
- **Anchors** - `winner-order-SC-277` serves the Feature set group `A lot the house won`, a rule with no actor; the case traces `winner-order-US-01`, the journey a collector's win walks. Joined on the behaviour
- **Out of suite** - superseded by Round 6, out of suite
- **Rejected** - none
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
