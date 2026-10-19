# grade10-site/auction Domain Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-19, tcs-rules r5

## g10.auction-dmn.US12: Bidders follow a listing through its close to their record

**As a** bidder,
**I want** the listing page and My Auctions to show one final price and one result once the close is recorded,
**so that** what I read on either is what the auction decided.

<!-- trace:case id=g10.auction-domain.TC-k4p rev=5 covers=g10.auction-winner-order.SC-ug0,g10.auction-winner-order.SC-fq4 -->
### g10.auction-dmn.US12-TC3: A winner chooses HKD and sees the card fee after both order totals

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, winner-order-US-01, winner-order-US-24, winner-order-US-25, winner-order-US-26

**Pre-conditions:**

* Customer A won `<listing_63>` at `<winning bid>`, with buyer's premium `<buyer's premium>` and is on its order setup page.
* HKD Card is offered, and Payment Settings holds an HKD card rule of `<card fee percent>` per cent and `<fixed card fee>`.
* No invoice has been sent for `<listing_63>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_63 | A closed USD listing won by customer A; bind its identity only | · |
| winning bid | USD101.00 | (10100 minor units) |
| buyer's premium | USD20.20 | (2020 minor units) |
| shipping | USD10.01 | (1001 minor units) |
| settlement currency | HKD | preselected, confirmed by customer A |
| payment method | Card | preselected, confirmed by customer A |
| HKD lines | HKD793.00; HKD159.00; HKD79.00 | (79300, 15900 and 7900 minor units) |
| HKD subtotal | HKD1,031.00 | (103100 minor units) |
| HKD card fee | HKD38.73 | (3873 minor units) from the gross-up rule on the HKD subtotal |
| amount payable | HKD1,069.73 | (106973 minor units) |

| Field | Value | Fixture notes |
| --- | --- | --- |
| card fee percent | 3.4 | · |
| fixed card fee | 235 minor units | (fixed configured HKD card fee) |

**Steps:**

1. Read the setup choices and Order Summary before confirming.
2. Confirm the address and setup with the preselected `<settlement currency>` and `<payment method>`, then read the Order Summary before invoice send.
3. As an operator, quote the order with Shipping & Handling of `<shipping>` and send its invoice.
4. Reopen the winner's order and read its Pending Payment status and Order Summary, totals and fee rows.
5. Read the invoice amount payable.

**Expected Results:**

* Step 1 opens with HKD and Card preselected, and no HKD amount appears before an invoice exists.
* Step 2 commits the winner's confirmed HKD settlement and Card choices.
* Before the invoice is sent, the summary has no HKD amount.
* Step 3 sends an invoice after the quote includes `<shipping>`.
* Step 4 reads Pending Payment and lists the winning bid, buyer's premium and shipping as `<HKD lines>`, each with its USD amount beneath it.
* Step 4 shows the Payment Processing Fee of `<HKD card fee>` in HKD, with no USD amount beneath it, and one Order Total of `<amount payable>` in HKD; no USD total shows.
* The HKD card fee is calculated from the HKD subtotal `<HKD subtotal>` (103100 minor units) using `<card fee percent>` per cent plus `<fixed card fee>`, and the Order Total includes it.
* Step 5 reads `<amount payable>` in HKD, equal to the invoice's Order Total.
* The order summary names no exchange rate under HKD settlement.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| `US12-TC3` asserted no preselected currency or method and an explicit selection step; the spec now preselects HKD and the first offered method | Revised to rev=5 — preselection read at step 1, confirmation at step 2. The Walk route bullet that reads "no preselected settlement currency or payment method" (`g10.auction-dmn.US12-TC3` step 1) updates to the same opening |
