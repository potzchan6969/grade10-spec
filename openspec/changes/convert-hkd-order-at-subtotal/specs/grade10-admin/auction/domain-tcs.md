# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-14, tcs-rules r5

## grade10-admin-auction-e2e-US3: Operator takes a lot from live to collected

**As an** auction operator,
**I want** a published lot to close into a payment I can collect and ship,
**so that** a won card leaves the sale without me leaving the admin.

<!-- trace:case id=g10adm.auction-domain.TC-dly rev=4 -->
### grade10-admin-auction-e2e-US3-TC1-4: A published lot closes and is collected through to delivered

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-auction-listing-US-04, post-sale-US-01, post-sale-US-02, post-sale-US-03, post-sale-US-04, post-sale-US-05

**Pre-conditions:**

* <listing_5> was published with close <close>, customer A placed a bid, and that close has passed.
* customer A confirmed a delivery address and chose HKD settlement and bank transfer on FPS for <listing_5>'s order, which reads Preparing Invoice.
* admin(holds payment-processing and shipment-processing) is on <grade10 auction admin orders url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A published listing that closed with a winner, in USD |
| `<close>` | 5 minutes after publish (any close after the start and after now) |
| `<winner email>` | The winning bidder's contact address |
| `<transfer reference>` | The bank's reference for the winner's transfer |
| `<carrier>` and `<tracking number>` | A carrier name and its tracking number |

**Steps:**

1. Open Needs action on the Orders worklist and find <listing_5>'s order.
2. Open the order from its row.
3. Click Send invoice, enter Shipping & Handling and Insurance in USD, read the quote preview, then confirm the quote.
4. Click Record payment and record a bank transfer settlement with <transfer reference> and one proof file.
5. Click Dispatch and record <carrier> with <tracking number>.
6. Click Confirm delivery and attach the carrier's proof.

**Expected Results:**

* Step 1 lists the order under Needs action as Preparing Invoice, with Send invoice as its primary action.
* Step 2 opens the order at its own address, leading with its status, the rule behind it and one primary action.
* Step 2 shows <winner email> as the winner's contact and no Stripe identifier.
* Step 2 shows the order's HKD settlement and bank transfer on FPS.
* Step 3 takes quote amounts in USD, previews the USD lines, then the HKD Subtotal, fee and total with no conversion rate, and then the order reads Pending Payment.
* Step 4 sets the order to Preparing Shipment.
* Step 5 sets the order to Shipped.
* Step 6 sets the order to Delivered.
* The winner is unchanged.


---

## grade10-admin-auction-e2e-US4: Admin protects a lot, an internal bidder wins it, and the card goes back to stock

**As an** auction admin,
**I want** a lot an internal bidder wins to open its internal order, which I invoice, let expire and cancel by hand,
**so that** the card goes back to stock through the same order flow as any unpaid lot.

<!-- trace:case id=g10adm.auction-dmn.TC-sjg rev=6 covers=grade10-admin-auction-internal-bid-SC-71,grade10-admin-auction-internal-bid-SC-73,grade10-admin-auction-internal-bid-SC-75,g10.auction-winner-order.SC-los,grade10-admin-auction-post-sale-SC-253 -->
### grade10-admin-auction-e2e-US4-TC2-6: An internal bidder's win is invoiced, expires and is cancelled, and the stock comes back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-internal-bid-US-01, grade10-admin-auction-internal-bid-US-06, post-sale-US-05, post-sale-US-19, post-sale-US-13

**Pre-conditions:**

* `<listing_4>` is published in no campaign, taking bids, holding `<held quantity>` units of `<product_4>`, with no internal bid.
* `<internal bidder>` is an active internal bidder profile in auction admin, holding `<house billing address>`.
* customer A leads `<listing_4>` at `<starting price>` with maximum `<user A maximum>`, and will not bid again.
* The environment's clock can be moved past the payment deadline.
* admin(holds auction:reserve, auction:operate and auction:payment) is on `<listing_4>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A published USD listing for `<product_4>`, starting price `<starting price>`, scheduled close an hour away, extension duration 1800s (30mins) |
| `<product_4>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 3 units (any count) |
| `<starting price>` | 10000 minor units (US$100.00) |
| `<user A maximum>` | 10000 minor units (US$100.00) |
| `<internal bidder>` | An active internal bidder profile: name "Harbour Cards", email label harbour@internal.grade10.example |
| `<house billing address>` | A Hong Kong address with every required field: name "Grade10 Stock Room", 4 Test Road, Central, Hong Kong |
| `<house maximum>` | 10100 minor units (US$101.00) |
| `<commit time>` | 10 minutes from now |
| `<final price>` | 10100 minor units (US$101.00), the house maximum |
| `<buyer's premium>` | 2020 minor units (USD20.20) |
| `<shipping>` | 1001 minor units (USD10.01), Shipping & Handling |
| `<transfer fee>` | 0 minor units (USD0.00), bank transfer fee |
| `<note>` | "QA internal order, house win" |
| `<usd sum>` | 13121 minor units (USD131.21), `<final price>` plus `<buyer's premium>` plus `<shipping>` |
| `<invoice subtotal>` | 103000 minor units (HKD1,030.00), `<usd sum>` times 7.85 is 1029.9985, converted once and rounded up to the next cent |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and `<commit time>`, pick `<internal bidder>`, and click Save.
2. Wait until `<listing_4>`'s close passes, taking no action.
3. Open the lot page for `<listing_4>` as customer A.
4. Open <grade10 auction admin orders url>, select All and open `<listing_4>`'s order.
5. Open Send invoice, enter `<shipping>` as Shipping & Handling and `<transfer fee>` as the bank transfer fee, and send.
6. Move the clock past the payment deadline, then reload the order.
7. Open Cancel, pick Non-payment, enter `<note>` and confirm.
8. Read `<product_4>`'s available count on its product page.
9. Open <grade10 auction send log url>, filter by `<listing_4>` and read the rows from the close.

**Expected Results:**

* Step 3 reads Did not win, the lot sold at `<final price>` USD.
* Step 4: the order is flagged internal, buyer House with `<internal bidder>`, winning bid `<final price>` USD, HKD settlement, FPS and Preparing Invoice, with `<house billing address>` as its delivery and billing address.
* At Step 4, exactly one internal order exists. Its invoice status is `not_issued`, no invoice has been issued, and its method is `bank_transfer` on `fps`.
* The order does not enter Awaiting Setup and neither the winner nor operator chooses settlement currency or rail.
* Step 5: the operator's quote takes USD inputs of 1001 minor units for Shipping & Handling and 0 for the transfer fee, previews the USD lines, then the HKD Subtotal, fee and total with no conversion rate, names HKD settlement and bank transfer on FPS, and the invoice status becomes `pending`.
* The invoice lists the USD winning bid of 10100, the USD premium of 2020 and USD shipping of 1001 minor units, and its HKD Subtotal is `<invoice subtotal>`: their sum `<usd sum>` converted once. The transfer fee is zero, so the invoice total is 103000 minor units in HKD. The order reads Pending Payment and its deadline is 7 calendar days after the send.
* Step 6: the order reads Payment Overdue, the invoice Expired.
* Step 7: the confirmation says no letter is sent, and the order then reads Cancelled.
* Step 8 reads `<available before>` plus `<held quantity>`.
* Step 9 holds no won, address, invoice, payment or other order-letter row for this order addressed to any recipient, from the close through invoice send, expiry and cancellation.

## Reconciliation

**Run:** QA1, levels pass for `convert-hkd-order-at-subtotal`, 2026-10-22. It rewrote the two admin domain cases this change moves from the journeys and the domain's PRD pages, before the feature readings, and read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. The first blind pass ran on a bundle with empty suites and PRD pages without the product manager's edits, and was resumed on a corrected one. It is the run's own statement, not proof.

**Run:** QA2, 2026-10-22, in a fresh context. It read both cases against the post-sale delta and recomputed the figures: 10100 plus 2020 plus 1001 is 13121 minor USD units, which converts once to 103000 at 7.85. It is a statement, not proof.

- **`grade10-admin-auction-e2e-US3-TC1-4`** (`TC-dly@4`) - step 3 now reads the quote preview and the case names no amount; it carries no scenario link, as before
- **`grade10-admin-auction-e2e-US4-TC2-6`** (`TC-sjg@6`) - the figures move from 103100 to 103000 with the USD sum and the Subtotal stated. Its links to `grade10-admin-auction-post-sale-SC-253` stand. Its links to `grade10-admin-auction-internal-bid-SC-71`, `SC-73` and `SC-75` stand too, but `SC-73` still states 103100 and the capability is not on the proposal's list; the open row on that scenario in `decisions.md` holds the disagreement
- **Stale text** - the `US4-TC2` paragraph of the durable suite's `## Reconciliation` (durable line 492) repeats the 103100 result and its per-line conversions; it is refreshed when `/tcs-review` next prepares the suite
- **Raised** - none
- **Contradictions** - `US4-TC2-6` against the durable `internal-bid` `SC-73`, held with the row that names it
