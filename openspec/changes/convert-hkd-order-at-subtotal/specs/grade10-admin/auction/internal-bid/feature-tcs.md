# grade10-admin/auction/internal-bid Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-08, tcs-rules r4

## grade10-admin-auction-internal-bid-US6: Admin settles the order of a lot an internal bidder won

**As an** auction admin,
**I want** a house win to open an order with HKD settlement and bank transfer on FPS already set,
**so that** the operator can quote and send its invoice, let it expire, and cancel it without a winner or operator choosing the currency or rail.

<!-- trace:case id=g10adm.auction-internal-bid.TC-dqh rev=5 covers=g10adm.auction-internal-bid.SC-6fc -->
### grade10-admin-auction-internal-bid-US6-TC5-5: An operator sends the internal order's invoice by hand, reading it as any HKD quote, and no invoice letter goes out

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-06

**Pre-conditions:**

* `<listing_71>` closed with the house winning at `<final price>` as `<internal bidder>`; its order, flagged internal, holds HKD settlement and FPS and has no invoice sent.
* admin(holds auction:reserve and auction:payment) is on `<listing_71>`'s order page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_71>` | A USD listing in no campaign, closed with the house winning at `<final price>` |

| Row | `<final price>` | `<premium>` | `<shipping>` | `<transfer fee>` | `<usd sum>` | `<house subtotal>` | `<fee in HKD>` | `<house total>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Zero fee | USD5,500 | USD1,100, 20% of `<final price>` | USD0, Shipping & Handling | USD0, bank transfer fee | USD6,600 | HKD51,810, `<usd sum>` times 7.85 converted once | Free | HKD51,810 |
| Typed fee | USD101 | USD20.20, 20% of `<final price>` | USD10.01, Shipping & Handling | USD25.04, bank transfer fee | USD131.21 | HKD1,030, `<usd sum>` times 7.85 converted once | HKD196.57, `<transfer fee>` times 7.85 rounded up | HKD1,226.57 |

**Steps:**

1. Open Send invoice and read the quote.
2. Enter `<shipping>` as Shipping & Handling and `<transfer fee>` as the bank transfer fee, leaving Insurance and Tax empty.
3. Read the quote preview.
4. Send the invoice.
5. Read the order's status, its invoice lines and the payment deadline.
6. Open the send log, filter by `<listing_71>` and read the rows from the send.

**Expected Results:**

* Step 1: the quote shows winning bid `<final price>`, billing address `<house billing address>`, HKD settlement and FPS. Quote amounts take USD.
* Step 3: the preview lists the winning bid, `<premium>` and `<shipping>` in USD, then one HKD Subtotal of `<house subtotal>`.
* Step 3: the bank transfer fee adds nothing to the Subtotal; below it the fee reads `<fee in HKD>` and the total reads `<house total>`.
* Step 3: no per-line HKD amount and no rate shows.
* Step 5: the order reads Pending Payment, the invoice Pending.
* Step 5: the order page lists the same USD lines, then the HKD Subtotal `<house subtotal>`, the Payment Processing Fee `<fee in HKD>`, Free where zero, and the Total `<house total>`.
* Step 5: the deadline is 7 calendar days after the send.
* Step 6 holds no invoice-sent letter and no payment reminder, to anyone.


## Settled

- The house order's quote reads like any HKD quote: the USD lines the operator and Grade10 set, then one Subtotal and total in HKD, one conversion of those lines; the total moves from 103100 to 103000 for USD lines of 10100, 2020 and 1001 (decisions Q30).

## Reconciliation

**Run:** QA1, second blind pass for `convert-hkd-order-at-subtotal`, 2026-10-22. It added this capability's case when the capability joined the change (decisions Q30), from the frozen anchors, the journeys, `decisions.md` with its Raised table, the PRD and the existing durable suite, and read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. It is the run's own statement, not proof.

**Run:** QA2, second reconciliation pass, 2026-10-22, in a fresh context. It read the capability's delta, the post-sale delta that the quote follows, `tasks.md`, `tech-design.md`, the journeys and `decisions.md`, and QA1's file. It recomputed the figures: 606000 minor USD units at 7.85 is 4,757,100, which needs no rounding; 13121 is 102,999.85 and rounds up to 103000; a typed fee of 2504 at 7.85 is 19,656.4 and rounds up to 19,657, so the total reads 122,657. It is a statement, not proof.

**Blind case**

| Case | Disposition |
| --- | --- |
| `US6-TC5-4` (`TC-dqh`) | Kept. It revises the durable `US6-TC5-3` over two rows, a zero fee and a typed fee: the quote and the order page read the USD lines, then one HKD Subtotal, the fee converted below it and the Total, and no invoice-sent letter goes out. Its group statement now copies the journey (`user-journeys.md`), which the durable suite's statement had drifted from. Linked: `g10adm.auction-internal-bid.SC-6fc` (SC-73), whose figures are another member of the same partitions: a zero bank transfer fee and a fee that rounds up |

**Existing durable cases**

- `US6-TC5-3` (`TC-dqh@3`) asserted no amount, so SC-73's 103100 sat in the scenario alone; it is re-issued at `@4` with the converted amounts
- `US6-TC1-4` to `TC4-3`, `TC6-3` and `TC7-3` assert no amount that moves; left `draft`
- The durable markers of this suite carry `covers=none`, which is allowed only for a deprecated case; `TC-dqh` now carries its link, and the rest are left for `/tcs-review`

**Scenario coverage**

| Scenario | Covered by |
| --- | --- |
| `grade10-admin-auction-internal-bid-SC-73` | `US6-TC5-4` |
| `grade10-admin-auction-internal-bid-SC-71`, `SC-72`, `SC-74`, `SC-75`, `SC-76`, `SC-77`, `SC-78` | Unchanged; they stay with the durable cases and `grade10-admin-auction-e2e-US4-TC2-6` at the domain level |

**Uncovered**

- None

**Over-claimed**

- None

**Contradictions between the readings**

- None. The disagreement between the domain case (103000) and the durable SC-73 (103100) that the first pass held is settled by decisions Q30 and the repaired delta

**Anchor coverage**

| Anchor | Cases | Scenarios |
| --- | --- | --- |
| `grade10-admin-auction-internal-bid-US-06` | `US6-TC5-4` | SC-73 covered |

**Raised**

Q30 closes the row on SC-73; the answer sits in `## Settled`.
