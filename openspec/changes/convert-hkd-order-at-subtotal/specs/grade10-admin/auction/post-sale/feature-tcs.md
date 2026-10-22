# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-14, tcs-rules r5

## post-sale-US2: Operator works one order from its own page

**As an** auction operator,
**I want** each order on its own page, leading with its status, the rule behind it and the one thing to do next, with its whole history on one timeline,
**so that** I act on an order, or hand it to a colleague by its link, without piecing it together from several screens.

<!-- trace:case id=g10adm.auction-post-sale.TC-jip rev=2 covers=g10adm.auction-post-sale.SC-ngp,g10adm.auction-post-sale.SC-0gj,g10adm.auction-post-sale.SC-nfo,g10adm.auction-post-sale.SC-15a,g10adm.auction-post-sale.SC-ydn,g10adm.auction-post-sale.SC-bcb,g10adm.auction-post-sale.SC-d8k,g10adm.auction-post-sale.SC-lc8,g10adm.auction-post-sale.SC-f7t,g10adm.auction-post-sale.SC-59i,g10adm.auction-post-sale.SC-r4l -->
### post-sale-US2-TC7-2: A refused send keeps the dialog and what was typed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**

* An order in HKD in Preparing Invoice for bank transfer.
* admin(operator with payment processing) opens Send invoice.

**Steps:**

1. Type Insurance `40.00` and leave Shipping & Handling blank.
2. Confirm the send.
3. Type Shipping & Handling `80.00` and confirm again.

**Expected Results:**

* The first confirm is refused with a sentence saying Shipping & Handling is needed; the dialog stays open with Insurance still `40.00`, and no invoice is sent.
* The second confirm sends an invoice with Shipping & Handling of 8000 and Insurance of 4000 minor units in USD.

---

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance and Tax when the lot needs them, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

<!-- trace:case id=g10adm.auction-post-sale.TC-u4w rev=4 covers=g10adm.auction-post-sale.SC-qv1-->
### post-sale-US5-TC9-4: Operator sends an invoice with tax typed in USD

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice for bank transfer with a bank transfer fee of 0, whose settlement currency is HKD and whose USD lines before Tax total `<lines>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lines>` | USD134.00 (fixed derived value), 13400 minor units |
| `<tax>` | USD8.00 (fixed derived value), 800 minor units, typed in USD |
| `<subtotal>` | HKD1,114.70 (fixed derived value), 111470 minor units: `<lines>` plus `<tax>` converted once |

**Steps:**

1. Enter `<tax>` as Tax.
2. Read the quote.
3. Send the invoice.

**Expected Results:**

* The Tax field takes USD.
* The invoice is sent with Tax of `<tax>` in USD.
* Its Subtotal includes Tax and reads `<subtotal>` in HKD.
* The invoice is `pending` and its order total equals that Subtotal.

<!-- trace:case id=g10adm.auction-post-sale.TC-rh9 rev=2 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC13-2: Grade10 computes the card fee, tracking the subtotal until send

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* An order in HKD in Preparing Invoice for card, with a winning bid of 250000 and a buyer's premium of 50000 minor units in USD.
* admin(operator with payment processing) opens Send invoice.

**Steps:**

1. Type Shipping & Handling `80.00` and Insurance `40.00`, and read the Subtotal, the fee and the total.
2. Change Shipping & Handling to `120.00` and read them again.
3. Send the invoice.

**Expected Results:**

* At USD lines of 312000 minor units the Subtotal reads 2449200, the fee 86447, read-only, and the total 2535647 minor units in HKD.
* At USD lines of 316000 the Subtotal reads 2480600, the fee 87553 and the total 2568153.
* The send succeeds, and the invoice is `pending` with a fee of 87553 and a total of 2568153 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-70n rev=3 covers=g10adm.auction-post-sale.SC-lc8 -->
### post-sale-US5-TC20-3: Every quote amount is typed in USD and sent in the settlement currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice for bank transfer, whose settlement currency is the one the row names.

**Test data:**

| Field | Value |
| --- | --- |
| `<shipping and handling>` | USD80 (range: 1-9999 minor units), typed in USD |
| `<insurance>` | USD40 (range: 1-9999 minor units), typed in USD |
| `<bank transfer fee>` | USD15 (range: 1-9999 minor units), typed in USD |

| Settlement currency | Invoice amounts |
| --- | --- |
| HKD | The lines stay in USD as typed; Grade10 converts their sum once to the Subtotal and the bank transfer fee alone below it |
| USD | Each amount as typed, no conversion |

**Steps:**

1. Open Send invoice.
2. Read the currency each amount field takes.
3. Enter `<shipping and handling>`, `<insurance>` and `<bank transfer fee>`.
4. Read the order total.
5. Send the invoice.

**Expected Results:**

* Step 2: Shipping & Handling, Insurance and the bank transfer fee each take USD.
* Step 4: the subtotal, the payment processing fee and the order total read in the row's settlement currency, and no conversion rate shows on the quote.
* The sent invoice is `pending` and carries the amounts the row names, at the order total read in step 4.

<!-- trace:case id=g10adm.auction-post-sale.TC-9yj rev=3 covers=g10adm.auction-post-sale.SC-c0y,g10adm.auction-post-sale.SC-8ko -->
### post-sale-US5-TC24-3: The quote converts the typed USD sum once and rounds it up to the next cent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice for bank transfer on HK Local, whose settlement currency is HKD and whose winning bid is `<bid>` and buyer's premium `<premium>`, both in USD.
* The order has no Insurance and no Tax, and the bank transfer fee is left empty.

**Test data:**

| Row | `<bid>` (fixed) | `<premium>` (fixed) | `<shipping and handling>` (fixed, typed) | `<usd sum>` | `<subtotal>` | Why this row |
| --- | --- | --- | --- | --- | --- | --- |
| Above half a cent | USD101.00 | USD20.20 | USD10.01 (fixed boundary or equality), 1001 minor units | USD131.21 | HKD1,030.00 | 1029.9985 rounds up; truncating would read 1,029.99 |
| Below half a cent | USD70.00 | USD14.00 | USD16.04 | USD100.04 | HKD785.32 | 785.314 rounds up; nearest-cent rounding would read 785.31 |

**Steps:**

1. Open Send invoice and enter `<shipping and handling>`.
2. Read the lines, the Subtotal, the Payment Processing Fee and the order total the quote shows.
3. Send the invoice and read its Shipping & Handling line.

**Expected Results:**

* The quote reads Shipping & Handling as typed in USD, with no HKD amount beside it, and shows no rate and no conversion note.
* The Subtotal reads `<subtotal>`, `<usd sum>` times 7.85 converted once and rounded up to the next cent.
* The Payment Processing Fee adds nothing and the order total reads `<subtotal>`.
* The invoice carries Shipping & Handling of `<shipping and handling>` in USD.

<!-- trace:case id=g10adm.auction-post-sale.TC-jru rev=3 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-0op-->
### post-sale-US5-TC25-3: Sending prices the invoice in the settlement currency and locks the order

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice whose settlement currency is HKD and whose winner confirmed bank transfer on FPS.
* The order's winning bid is `<winning bid>` and its buyer's premium is `<premium>`, both in USD.

**Test data:**

| Field | Value |
| --- | --- |
| `<winning bid>` | USD100 (fixed derived value), 10000 minor units |
| `<premium>` | USD20 (fixed derived value), 2000 minor units |

| Shipping & Handling | Insurance | Order total |
| --- | --- | --- |
| USD10 | USD4 | HKD1,051.90 (fixed derived value) |
| USD0 | none added | HKD942.00 (fixed derived value) |
| Internal order: USD101 winning bid; USD20.20 premium; USD10.01 shipping; no insurance; USD0 bank transfer fee | none added | HKD1,030.00 (fixed derived value) |

**Steps:**

1. Open Send invoice and enter the row's lines, with a bank transfer fee of USD0.
2. Send the invoice at 2026-09-12T09:00:00Z.
3. Read the order and the invoice.

**Expected Results:**

* The invoice is `pending` with the row's order total in HKD.
* For the internal row, the quote starts from an order automatically assigned HKD and FPS at close; no invoice exists until the operator quotes and sends it.
* The internal row's lines USD101, USD20.20 and USD10.01 sum to USD131.21, which converts once to a Subtotal of HKD1,030.00, the order total.
* The payment deadline reads 2026-09-19T09:00:00Z.
* The delivery address, the settlement currency and the payment method are locked.
* The order reads Pending Payment.

<!-- trace:case id=g10adm.auction-post-sale.TC-qz7 rev=2 covers=g10adm.auction-post-sale.SC-miq-->
### post-sale-US5-TC26-2: A large bank transfer fee is accepted and converts alone below the Subtotal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice for bank transfer, whose settlement currency is HKD and whose lines read a subtotal of HKD1,053.00 before the bank transfer fee.

**Test data:**

| Field | Value |
| --- | --- |
| `<bank transfer fee>` | USD500.00 (fixed derived value), 50000 minor units |

**Steps:**

1. Open Send invoice and enter `<bank transfer fee>`.
2. Read the order total.
3. Send the invoice and read it.

**Expected Results:**

* The quote shows no cap or refusal for the fee.
* The invoice carries a bank transfer fee of HKD3,925.00, the typed amount converted.
* The invoice is `pending` with an order total of HKD4,978.00.

---

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

<!-- trace:case id=g10adm.auction-post-sale.TC-w3j rev=2 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-obc,g10adm.auction-post-sale.SC-5ky,g10adm.auction-post-sale.SC-5at,g10adm.auction-post-sale.SC-hto,g10adm.auction-post-sale.SC-ltc,g10adm.auction-post-sale.SC-3fi -->
### post-sale-US7-TC32-2: A method switch on reissue prices the fee by the new method

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* An order in Pending Payment whose card invoice has USD lines of 312000 minor units, a Subtotal of 2449200, a fee of 86447 and an order total of 2535647 minor units in HKD.
* admin(operator with payment processing) opens Reissue.

**Steps:**

1. Switch the method to bank transfer, and read the fee and the two totals.
2. Type a bank transfer fee of `50.00`.
3. Switch back to card, raise Shipping & Handling so the USD lines total 316000 minor units, and read the fee.

**Expected Results:**

* On bank transfer the fee reads empty, which is zero, the previous total 2535647 and the new total 2449200.
* Once typed, the bank transfer fee takes 5000 minor units in USD and the preview reads it as 39250 minor units in HKD below the Subtotal.
* Back on card the fee reads 87553, computed from the HKD card rule, read-only.

<!-- trace:case id=g10adm.auction-post-sale.TC-6p7 rev=2 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US7-TC38-2: Reissue changes tax

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Pending Payment, settled in HKD, whose invoice carries no Tax.

**Steps:**

1. Open Reissue.
2. Add Tax of 6000 minor units in USD and give a reason.
3. Send the new invoice.

**Expected Results:**

* The new invoice carries Tax of 6000 minor units in USD.

<!-- trace:case id=g10adm.auction-post-sale.TC-yjb rev=2 covers=g10adm.auction-post-sale.SC-kdq -->
### post-sale-US7-TC46-2: Reissue removes tax

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Pending Payment, settled in HKD, whose invoice carries Tax of 6000 minor units in USD.

**Steps:**

1. Open Reissue.
2. Clear the Tax amount, change nothing else, and give a reason.
3. Send the new invoice.

**Expected Results:**

* The reissue is accepted as a change.
* The new invoice has no Tax line.
* Its Subtotal is 47100 minor units lower than the replaced invoice's, the 6000 minor units in USD at 7.85.

---

## post-sale-US21: Operator previews the HKD total a quote will charge

**As an** operator quoting an order whose winner picked HKD,
**I want** to see the USD lines I typed, then the HKD Subtotal, fee and total the winner will be asked to pay,
**so that** I send an invoice whose total I have read before the winner does.

<!-- trace:case id=g10adm.auction-post-sale.TC-25a rev=1 covers=g10adm.auction-post-sale.SC-ox0 -->
### post-sale-US21-TC1-1: Card quote preview shows USD lines then HKD Subtotal, fee and total

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-21

**Pre-conditions:**

* admin(holds payment-processing) is on the order page of `<hkd_order_1>` on the Grade10 auction admin.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card, Preparing Invoice; winning bid USD150, Buyer's Premium USD30; HKD card rule 3.4% plus HKD2.35 |
| shipping | USD49 (fixed: typed Shipping & Handling) |
| insurance | USD20 (fixed: typed Insurance) |
| tax | USD2 (fixed: typed Tax) |
| usd_sum_1 | USD251 (fixed: USD150 plus USD30 plus `<shipping>` plus `<insurance>` plus `<tax>`) |
| subtotal_1 | HKD1970.35 (fixed: `<usd_sum_1>` times 7.85, converted once) |
| fee_1 | HKD71.79 (fixed: the card gross-up of `<subtotal_1>` under the rule, rounded up to the next cent) |
| total_1 | HKD2042.14 (fixed: `<subtotal_1>` plus `<fee_1>`) |

**Steps:**

1. Click Send invoice.
2. Type `<shipping>` in Shipping & Handling, `<insurance>` in Insurance and `<tax>` in Tax.
3. Read the quote preview from the top down.

**Expected Results:**

* The preview lists Winning Bid, Buyer's Premium, Shipping & Handling, Insurance and Tax in USD, as typed.
* One HKD Subtotal follows them and reads `<subtotal_1>`, `<usd_sum_1>` times 7.85.
* The Payment Processing Fee reads `<fee_1>` in HKD, read-only, with the card rule it came from.
* The total reads `<total_1>`, `<subtotal_1>` plus `<fee_1>`.
* No per-line HKD amount, no rate and no conversion note shows in the dialog.

<!-- trace:case id=g10adm.auction-post-sale.TC-tui rev=1 -->
### post-sale-US21-TC3-1: Bank transfer fee typed in USD converts below the preview Subtotal

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-21

**Pre-conditions:**

* admin(holds payment-processing) is on the order page of `<hkd_order_3>` on the Grade10 auction admin.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_3 | An HKD order paid by bank transfer on FPS, Preparing Invoice; winning bid USD150, Buyer's Premium USD30 |
| shipping | USD49 (fixed: typed Shipping & Handling) |
| insurance | USD20 (fixed: typed Insurance) |
| tax | USD2 (fixed: typed Tax) |
| bank_fee | USD25.04 (fixed: typed bank transfer fee) |
| subtotal_1 | HKD1970.35 (fixed: USD251 times 7.85, converted once) |
| bank_fee_hkd | HKD196.57 (fixed: `<bank_fee>` times 7.85, rounded up to the next cent) |
| total_2 | HKD2166.92 (fixed: `<subtotal_1>` plus `<bank_fee_hkd>`) |

**Steps:**

1. Click Send invoice.
2. Type `<shipping>`, `<insurance>`, `<tax>` and `<bank_fee>` in their fields.
3. Read the quote preview from the top down.

**Expected Results:**

* The Subtotal reads `<subtotal_1>`, without `<bank_fee>` in the sum.
* The fee reads `<bank_fee_hkd>` in HKD below the Subtotal.
* The total reads `<total_2>`.
* No rate or conversion note shows in the dialog.

<!-- trace:case id=g10adm.auction-post-sale.TC-a57 rev=1 covers=g10adm.auction-post-sale.SC-du4 -->
### post-sale-US21-TC4-1: Sent invoice carries the total the operator previewed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** post-sale-US-21

**Pre-conditions:**

* admin(holds payment-processing) is on the order page of `<hkd_order_1>` on the Grade10 auction admin.
* customer(winner settled in HKD) can sign in to the Grade10 site in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card, Preparing Invoice; winning bid USD150, Buyer's Premium USD30; HKD card rule 3.4% plus HKD2.35 |
| shipping | USD49 (fixed: typed Shipping & Handling) |
| insurance | USD20 (fixed: typed Insurance) |
| tax | USD2 (fixed: typed Tax) |
| total_1 | HKD2042.14 (fixed: HKD1970.35 Subtotal plus HKD71.79 card fee) |

**Steps:**

1. Click Send invoice.
2. Type `<shipping>`, `<insurance>` and `<tax>` in their fields and note the previewed total.
3. Confirm the send.
4. As the winner, open the Winner Order page of `<hkd_order_1>` and read the Order Summary.

**Expected Results:**

* The previewed total at step 2 reads `<total_1>`.
* The send is accepted, not refused with a new total.
* The Order Summary Subtotal, Payment Processing Fee and Order Total equal the preview's.
* The Order Total reads `<total_1>`.

---

## Settled

- The quote preview writes every amount in the operator shape, `USD 150.00` and `HKD 1,970.35` (decisions Q26).
- The reissue dialog shows the same preview as Send invoice, with the previous total beside the new one (decisions Q27).
- A bank transfer fee typed in USD converts alone at 7.85, rounded up to the next cent, below the Subtotal; a card fee is computed in HKD on the Subtotal (decisions Q3, Q6).

## Reconciliation

**Run:** QA1, blind pass for `convert-hkd-order-at-subtotal`, 2026-10-22. The first blind pass read a bundle whose existing suites were empty and whose PRD pages lacked the product manager's edits, both packaging defects of the coordinator. It was resumed against a corrected bundle, with the real suites and the current PRD, and revised. It read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. It is the run's own statement, not proof.

**Run:** QA2, 2026-10-22, in a fresh context. It read the planning-dev skill, the specs-to-test-cases, tcs-conventions, planning-review-efficiency and writing documents; the change's proposal, `decisions.md` (Q1 to Q19 and the 12 Raised rows), the four `user-journeys.md`, the four `spec.md` deltas, `tech-design.md` and `tasks.md`; the PRD sections they cite; the durable post-sale spec and suite and the sibling durable suites. It compared each blind case with the scenarios, recomputed every minor-unit figure, and wrote no case from a scenario. A case is linked to a scenario when its results assert every outcome the scenario's THEN and ANDs state, from a starting state of the same class and with values from the same partition; a clause a case leaves out keeps the link off and the scenario under Uncovered. It is a statement, not proof.

**Blind cases**

| Case | Disposition |
| --- | --- |
| `post-sale-US21-TC1-1` (`TC-25a`) | Kept. A card quote of five typed USD lines reads the Subtotal, the read-only fee and the total, with no per-line HKD amount, rate or note. Linked: `g10adm.auction-post-sale.SC2` |
| `post-sale-US21-TC2-1` (`TC-hio`) | Regrouped into `post-sale-US5-TC24` (`TC-9yj`): the rounding of a typed USD sum in the quote is one surface, one route and one checking. Both of its partitions are rows of `TC24-3`; the case is dropped and was never published |
| `post-sale-US21-TC3-1` (`TC-tui`) | Kept. The bank transfer fee typed in USD converts below the preview Subtotal. It lists no USD lines and never says that no HKD amount shows beside one, so `g10adm.auction-post-sale.SC1` stays unlinked |
| `post-sale-US21-TC4-1` (`TC-a57`) | Kept. The sent invoice carries the total the operator previewed; its card fixture is the same class as the bank fixture of `g10adm.auction-post-sale.SC3`. Linked: SC3 |

**Existing durable cases the change moves**

| Durable case | Verdict | Action |
| --- | --- | --- |
| `US5-TC9-3` (`TC-u4w`) | Contradicted: Tax converted to HKD and carried in HKD | Rewritten as `TC9-4` with the fixture of `post-sale-SC-155`; link kept |
| `US5-TC13-1` (`TC-rh9`) | Contradicted: lines of 250000, 50000, 8000 and 4000 are USD facts, so the Subtotal is 2,449,200 and not 312,000 | Rewritten as `TC13-2`; the legacy link list is unchanged |
| `US5-TC20-2` (`TC-70n`) | Contradicted: the HKD row converts each amount | Rewritten as `TC20-3` |
| `US5-TC24-2` (`TC-9yj`) | Contradicted: S&H read as HKD79.00 on the quote and the invoice | Rewritten as `TC24-3` with QA1's `TC2` folded in; links `grade10-admin-auction-post-sale-SC-252` and `grade10-admin-auction-post-sale-SC-251` |
| `US5-TC25-2` (`TC-jru`) | Contradicted: rows 1,053 and 1,031, and the internal row converts each component | Rewritten as `TC25-3` at 1,051.90, 942.00 and 1,030.00; links kept |
| `US5-TC26-2` (`TC-qz7`) | Figures hold (50000 USD to 392500, total 497800); only the title said the fee converts with the other lines | Title restyled, revision `2` unchanged, as the rules allow a draft |
| `US7-TC32-1` (`TC-w3j`) | Contradicted: the typed fee reads 5000 on an HKD quote, and the 312,000 and 316,000 subtotals cannot be raised by typing a USD line | Rewritten as `TC32-2` on the USD lines of `TC13-2` |
| `US7-TC38-1` (`TC-6p7`) and `US7-TC46-1` (`TC-yjb`) | Contradicted: Tax of 6000 minor units in HKD on an HKD invoice | Rewritten as `TC38-2` and `TC46-2`; the Subtotal falls by 47100 |
| `US2-TC7-1` (`TC-jip`) | Contradicted: the sent invoice carries S&H and Insurance "in HKD" | Rewritten as `TC7-2`, in USD |
| `US8-TC10-1` and `US8-TC13-1` | They read the history entry's changed line and its value before and after, which the open row on the operator order detail leaves undecided | Left `draft`; rewritten once that row is answered |
| `US18-TC11-1`, `TC12-1`, `TC13-1` | Their assertions (deadline, refusal, closed window) do not move; only the typed Shipping & Handling is labelled HKD, which was wrong before this change | Left `draft`; the unit label is a restyle for the next review |

**Scenario coverage**

| Scenario | Covered by |
| --- | --- |
| `grade10-admin-auction-post-sale-SC-251`, `grade10-admin-auction-post-sale-SC-252` | `US5-TC24-3` |
| `g10adm.auction-post-sale.SC2` | `US21-TC1-1` |
| `g10adm.auction-post-sale.SC3` | `US21-TC4-1` |
| `grade10-admin-auction-post-sale-SC-48`, `grade10-admin-auction-post-sale-SC-63`, `grade10-admin-auction-post-sale-SC-253` | `US5-TC25-3` |
| `post-sale-SC-155` | `US5-TC9-4` |
| `grade10-admin-auction-post-sale-SC-119` | `US5-TC26-2` |
| `grade10-admin-auction-post-sale-SC-168`, `SC-169`, `SC-171` | `US5-TC13-2` and `US7-TC32-2`, on derived values from the same partitions as the scenarios' 312000 and 316000 |

**Uncovered**

- `g10adm.auction-post-sale.SC1`: a bank transfer quote that lists the USD lines of 10100, 2020 and 992, reads the Subtotal 102930, the fee 2018 and the total 104948, and shows no HKD amount beside a USD line. `US21-TC3-1` asserts the Subtotal, fee and total but not the listed lines or the absent per-line amounts; `US21-TC1-1` asserts those on a card fixture only

**Over-claimed**

- The legacy `covers` lists on `TC13-2`, `TC32-2` and `TC38-2` name dozens of scenarios each; left for `/tcs-review`

**Contradictions between the readings**

- None between a blind case and a scenario of this capability. Two durable scenarios the delta leaves untouched disagree with the rewritten cases: `grade10-admin-auction-post-sale-SC-245` ("the replaced invoice still reads 78500 minor units in HKD") and `SC-123` and `SC-204` (history values "in HKD"); they are listed for `spec.md` and wait on the open row on the operator order detail

**Anchor coverage**

| Anchor | Cases | Scenarios |
| --- | --- | --- |
| `post-sale-US-21` (new) | `US21-TC1-1`, `TC3-1`, `TC4-1`, and `US5-TC24-3` for the typed-sum rounding | SC2, SC3, SC-251, SC-252 covered; SC1 uncovered |
| `post-sale-US-05` (context) | `US5-TC9-4`, `TC13-2`, `TC20-3`, `TC24-3`, `TC25-3`, `TC26-2` | SC-48, SC-63, SC-155, SC-253 covered |
| Root group Quote and send | the cases above | Quote in USD and HKD preview both covered |
| Context journeys | `US2`, `US7` | `user-journeys.md` lists neither as Context, so `tcs:validate` reports them undefined until it does |

**Raised**

Q26 and Q27 close the two post-sale rows that the round decides; the order detail and history row stays held. The answers sit in `## Settled`.
