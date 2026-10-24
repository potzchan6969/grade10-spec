# grade10-admin/auction/internal-bid Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-08, tcs-rules r4

## grade10-admin-auction-internal-bid-US6: Admin settles the order of a lot an internal bidder won

**As an** auction admin,
**I want** a house win to open an order with HKD settlement and bank transfer on FPS already set,
**so that** the operator can quote and send its invoice, let it expire, and cancel it without a winner or operator choosing the currency or rail.

<!-- trace:case id=g10adm.auction-internal-bid.TC-dqh rev=4 covers=g10adm.auction-internal-bid.SC-6fc -->
### grade10-admin-auction-internal-bid-US6-TC5-4: An operator sends the internal order's invoice by hand, reading it as any HKD quote, and no invoice letter goes out

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

* `<listing_71>` closed with the house winning at `<final price>` USD as `<internal bidder>`; its order, flagged internal, holds HKD settlement and FPS and has no invoice sent.
* admin(holds auction:reserve and auction:payment) is on `<listing_71>`'s order page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_71>` | A USD listing in no campaign, closed with the house winning at `<final price>` |

| Row | `<final price>` | `<premium>` | `<shipping>` | `<transfer fee>` | `<usd sum>` | `<house subtotal>` | `<fee in HKD>` | `<house total>` | Why this row |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Zero fee | 505000 minor units (US$5,050.00) | 101000 minor units (US$1,010.00), 20% of `<final price>` | 0 minor units (US$0.00), Shipping & Handling | 0 minor units (US$0.00), bank transfer fee | 606000 minor units (US$6,060.00) | 4757100 minor units (HK$47,571.00), `<usd sum>` times 7.85 converted once | 0 minor units | 4757100 minor units (HK$47,571.00) | Converting each line on its own would read HK$47,572 |
| Typed fee | 10100 minor units (US$101.00) | 2020 minor units (US$20.20), 20% of `<final price>` | 1001 minor units (US$10.01), Shipping & Handling | 2504 minor units (US$25.04), bank transfer fee | 13121 minor units (US$131.21) | 103000 minor units (HK$1,030.00), `<usd sum>` times 7.85 converted once | 19657 minor units (HK$196.57), `<transfer fee>` times 7.85 rounded up | 122657 minor units (HK$1,226.57) | Converting each line on its own would read HK$1,031 for the Subtotal |

**Steps:**

1. Open Send invoice and read the quote.
2. Enter `<shipping>` as Shipping & Handling and `<transfer fee>` as the bank transfer fee, leaving Insurance and Tax empty.
3. Read the quote preview.
4. Send the invoice.
5. Read the order's status, its invoice lines and the payment deadline.
6. Open <grade10 auction send log url>, filter by `<listing_71>` and read the rows from the send.

**Expected Results:**

* Step 1: the quote shows winning bid `<final price>` USD, billing address `<house billing address>`, HKD settlement and FPS. Quote amounts take USD.
* Step 3: the preview lists the winning bid, `<premium>` and `<shipping>` in USD, then one HKD Subtotal of `<house subtotal>`.
* Step 3: the bank transfer fee adds nothing to the Subtotal; below it the fee adds `<fee in HKD>` in HKD and the total reads `<house total>`.
* Step 3: no per-line HKD amount and no rate shows.
* Step 5: the order reads Pending Payment, the invoice Pending.
* Step 5: the order page lists the same USD lines, then the HKD Subtotal `<house subtotal>`, the Payment Processing Fee `<fee in HKD>`, Free where zero, and the Total `<house total>`.
* Step 5: the deadline is 7 calendar days after the send.
* Step 6 holds no invoice-sent letter and no payment reminder, to anyone.

---

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
