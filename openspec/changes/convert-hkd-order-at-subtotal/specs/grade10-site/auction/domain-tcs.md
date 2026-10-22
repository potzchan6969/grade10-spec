# g10.auction-dmn Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-14, tcs-rules r5

## g10.auction-dmn.US12: Bidders follow a listing through its close to their record

**As a** bidder,
**I want** the listing page and My Auctions to show one final price and one result once the close is recorded,
**so that** what I read on either is what the auction decided.

<!-- trace:case id=g10.auction-domain.TC-k4p rev=6 covers=g10.auction-winner-order.SC-ug0,g10.auction-winner-order.SC-fq4 -->
### g10.auction-dmn.US12-TC3: HKD winner pays the total shown and keeps matching documents

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
* **Trace:** grade10-site-auction-auction-US-02, winner-order-US-01, winner-order-US-24, winner-order-US-25, winner-order-US-26, winner-order-US-27

**Pre-conditions:**

* Customer A won `<listing_63>` at `<winning bid>`, with buyer's premium `<buyer's premium>` and is on its order setup page.
* HKD Card is offered, and Payment Settings holds an HKD card rule of `<card fee percent>` per cent and `<fixed card fee>`.
* No settlement currency or payment method is preselected.
* No invoice has been sent for `<listing_63>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_63 | A closed USD listing won by customer A; bind its identity only | · |
| winning bid | USD101.00 | (10100 minor units) |
| buyer's premium | USD20.20 | (2020 minor units) |
| shipping | USD10.01 | (1001 minor units) |
| settlement currency | HKD | selected by customer A |
| payment method | Card | selected by customer A |
| USD sum | USD131.21 | (13121 minor units) the winning bid, premium and shipping added |
| HKD subtotal | HKD1,030.00 | (103000 minor units) `<USD sum>` times 7.85 is 1029.9985, converted once and rounded up to the next cent |
| HKD card fee | HKD38.69 | (3869 minor units) from the gross-up rule on the HKD subtotal, rounded up |
| amount payable | HKD1,068.69 | (106869 minor units) |
| stripe test card | 4242 4242 4242 4242 | the provider's test card that succeeds, any future expiry, any security code |
| winner mailbox | The inbox of the winner's registered email address | · |

| Field | Value | Fixture notes |
| --- | --- | --- |
| card fee percent | 3.4 | · |
| fixed card fee | 235 minor units | (fixed configured HKD card fee) |

**Steps:**

1. Read the setup choices and Order Summary before making a selection.
2. Select `<settlement currency>`, then `<payment method>`; confirm the address and setup, then read the Order Summary before invoice send.
3. As an operator, quote the order with Shipping & Handling of `<shipping>`, read the quote preview and send its invoice.
4. Reopen the winner's order and read its Pending Payment status and Order Summary rows, the note under the Subtotal, the fee and the Order Total.
5. Click the Invoice link beside the Order summary heading and read the invoice's lines, Subtotal, fee and total.
6. Click Pay with Card and pay with `<stripe test card>`.
7. Open the Payment received letter in `<winner mailbox>` and its attached receipt PDF.

**Expected Results:**

* Step 1 has no preselected settlement currency or payment method, and no HKD amount appears before an invoice exists.
* Step 2 commits the winner's explicit HKD settlement and Card choices.
* Before the invoice is sent, the summary has no HKD amount.
* Step 3 previews the USD lines, then the HKD Subtotal, fee and total with no conversion rate, and sends an invoice after the quote includes `<shipping>`.
* Step 4 reads Pending Payment and lists the winning bid, buyer's premium and shipping in USD, then one HKD Subtotal of `<HKD subtotal>` whose note names `<USD sum>` and the rate 1 USD = 7.85 HKD.
* Step 4 shows the Payment Processing Fee of `<HKD card fee>` in HKD, with no USD amount beside it, and one Order Total of `<amount payable>` in HKD; no USD total shows.
* The HKD card fee is calculated from the HKD subtotal `<HKD subtotal>` (103000 minor units) using `<card fee percent>` per cent plus `<fixed card fee>`, and the Order Total includes it.
* Step 5 prints the same USD lines, Subtotal, fee and Order Total as the Order Summary and names no rate and no conversion note; the amount payable reads `<amount payable>` in HKD.
* Step 6 charges `<amount payable>` and the order reads Preparing Shipment.
* Step 7: the letter and the receipt PDF list the same USD lines, Subtotal, fee and Order Total; the letter names no rate, and the receipt PDF carries the note `Converted from US$131.21 at 1 USD = 7.85 HKD` directly under its Subtotal, drawn muted.
* The note under the Subtotal of the Order Summary and of the receipt PDF are the only places that name the rate; the invoice page and the letter name none.

## Reconciliation

**Run:** QA1, levels pass for `convert-hkd-order-at-subtotal`, 2026-10-22. It rewrote the one domain case this change moves from the journeys and the domain's PRD pages, before the feature readings, and read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. The first blind pass ran on a bundle with empty suites and PRD pages without the product manager's edits, and was resumed on a corrected one. It is the run's own statement, not proof.

**Run:** QA1, second blind pass, 2026-10-22. It extended its cases for the operator's order page and the house order and left this case as it was. It is the run's own statement, not proof.

**Run:** QA2, amendment pass, 2026-10-23, in a fresh context. It re-read the case against the revised winner-order delta (the invoice and receipt PDFs carry the note under the Subtotal; decisions Q8 revised, Q33) and the new PDF block delta. Its step 5 reads the invoice page and its step 7 the receipt PDF, so two results and the last one moved. It wrote no case from a scenario. It is a statement, not proof.

**Run:** QA2, second reconciliation pass, 2026-10-22, in a fresh context. It read the case against the repaired winner-order, notifications-order and post-sale deltas and recomputed its figures: 13121 minor USD units at 7.85 is 102,999.85 and rounds up to 103000; the card fee on 103000 at 3.4 per cent and 235 is 3869; the Order Total is 106869. It is a statement, not proof.

- **Amendment 2026-10-23** - `TC-k4p` is re-issued at `@6`. At `@5` its step 5 and step 7 said the invoice page, the letter and the receipt PDF name no rate, and its last result said the Order Summary's note is the only place that names it; the receipt PDF now carries the note, so step 7 and the last result are split by surface. The invoice page and the letter still name none. The card order in step 6 gives the receipt a fee of HK$38.69 that does not enter the note's US$131.21. Its links are unchanged: the receipt PDF's note is a claim of `g10.auction-winner-order.SC17`, which is stated for a bank transfer order and for a part payment too, so no link is added
- **Case** - `g10.auction-dmn.US12-TC3` (`TC-k4p@5`) was rewritten by QA1 over a new title, with `winner-order-US-27` added to its trace. QA2 keeps it and its links to `winner-order-SC-292` and `winner-order-SC-304`, whose results it asserts at steps 1 and 4
- **Not linked** - `order-mail-SC-66`: step 7 asserts that the letter and the receipt PDF list the same lines and name no rate, but not that the letter names the amount paid
- **Covered at domain** - none claimed; the feature suite holds `winner-order-SC-304` and `winner-order-SC-292` in `US27-TC1` and `US27-TC3`
- **Scenarios added later** - `g10.auction-winner-order.SC19` and `SC20` are not reached by `TC-k4p`: its step 7 reads the card order's receipt PDF with the note but opens no invoice PDF, no order with a line lacking a USD fact and no pre-layout invoice. They stay Out of suite in the winner-order feature suite, verified by the note tests of task 7.5
- **Stale text** - Walk 4 of the durable suite (durable lines 760 to 772) and its `**Current cases**` paragraph (durable line 2494) repeat the `@4` results, HKD793.00, HKD38.73 and HKD1,069.73. The walk is refreshed when `/tcs-review` next prepares the suite; this run's figures are the authority until then
- **Raised** - none
- **Contradictions** - none

**Current cases** - `TC-k4p@6` covers winner-order SC-292 and SC-304. Its sent order shows the winning bid, buyer's premium and shipping in USD (US$101.00, US$20.20, US$10.01), one HKD Subtotal of HK$1,030.00 whose note names US$131.21, an HKD gross-up fee of HK$38.69 and one Order Total of HK$1,068.69. It checks that no HKD amount appears before confirmation and invoice creation, that the invoice page, the letter and the receipt PDF list the same lines, and that the note under the Subtotal of the Order Summary and of the receipt PDF are the only places that name the rate, the invoice page and the letter naming none.
