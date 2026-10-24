# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/24
**Drafts styled:** 2026-10-14, tcs-rules r5

## post-sale-US2: Operator works one order from its own page

**As an** auction operator,
**I want** each order on its own page, leading with its status, the rule behind it and the one thing to do next, with its whole history on one timeline,
**so that** I act on an order, or hand it to a colleague by its link, without piecing it together from several screens.

<!-- trace:case id=g10adm.auction-post-sale.TC-jip rev=2 covers=g10adm.auction-post-sale.SC-ydn,g10adm.auction-post-sale.SC-bcb,g10adm.auction-post-sale.SC-d8k,g10adm.auction-post-sale.SC-lc8,g10adm.auction-post-sale.SC-f7t,g10adm.auction-post-sale.SC-59i,g10adm.auction-post-sale.SC-r4l -->
### post-sale-US2-TC7-2: A refused send keeps the dialog and what was typed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
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

<!-- trace:case id=g10adm.auction-post-sale.TC-ao7 rev=1 -->
### post-sale-US2-TC13-1: Order page of a sent HKD invoice lists USD lines then HKD Subtotal, fee and Total

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* admin(holds payment-processing) is on the order page of `<hkd_order>` on the Grade10 auction admin.

**Test data:**

| Field | Value |
| --- | --- |
| winner order url | The URL of the order page of `<hkd_order>`; bind its URL only |

| Row | `<hkd_order>` | `<lines listed>` | `<subtotal>` | `<fee>` | `<total>` |
| --- | --- | --- | --- | --- | --- |
| Card, every line | An HKD order paid by card, invoice sent and Pending Payment; HKD card rule 3.4% plus HKD2.35 | Winning Bid USD150, Buyer's Premium USD30, Shipping & Handling USD49, Insurance USD20, Tax USD2 (fixed: sum USD251) | HKD1970.35 (fixed: USD251 times 7.85, converted once) | HKD71.79 (fixed: card gross-up of the Subtotal, rounded up) | HKD2042.14 (fixed: Subtotal plus fee) |
| Bank transfer, sparse | An HKD order paid by bank transfer on FPS, invoice sent and Pending Payment; bank transfer fee left empty | Winning Bid USD100, Buyer's Premium USD20, Shipping & Handling zero; no Insurance, no Tax (fixed: sum USD120) | HKD942 (fixed: USD120 times 7.85) | Free | HKD942 (fixed: Subtotal plus nothing) |

**Steps:**

1. Read the invoice lines on the order page from the top down.
2. Look for an HKD figure beside any USD line.

**Expected Results:**

* The order page lists `<lines listed>` in USD, as quoted, and lists no Insurance or Tax line that was not quoted.
* No HKD figure sits beside any USD line.
* One HKD Subtotal follows the lines and reads `<subtotal>`.
* The Payment Processing Fee reads `<fee>` and the Total reads `<total>`, the Subtotal plus the fee.
* No rate shows on the order page.

<!-- trace:case id=g10adm.auction-post-sale.TC-t1k rev=1 -->
### post-sale-US2-TC14-1: Order page of an HKD invoice sent before this layout reads from its stored amounts

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**

* admin(holds payment-processing) is on the order page of `<old_hkd_order>` on the Grade10 auction admin.

**Test data:**

| Field | Value |
| --- | --- |
| old_hkd_order | A test order whose HKD invoice was sent before this layout, paid by bank transfer on FPS with the fee empty; it stored the USD lines USD101.00, USD20.20 and USD10.01 as typed and each line's whole-HK$ amount, HK$793, HK$159 and HK$79 |
| stored_total | HKD1031 (fixed: 793 plus 159 plus 79, each line rounded up when it was sent) |
| repriced_total | HKD1030 (fixed: USD131.21 times 7.85 converted once, the figure a new invoice would read) |

**Steps:**

1. Read the invoice lines on the order page from the top down.
2. Read the Subtotal, the Payment Processing Fee and the Total.

**Expected Results:**

* The order page lists the three lines in USD as stored, with no HKD figure beside any of them.
* The Subtotal reads `<stored_total>`, not `<repriced_total>`.
* The Payment Processing Fee reads Free and the Total reads `<stored_total>`.
* The invoice is not re-priced.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* An order in HKD in Preparing Invoice for card, with a winning bid of 25000 and a buyer's premium of 5000 minor units in USD.
* admin(operator with payment processing) opens Send invoice.

**Steps:**

1. Type Shipping & Handling `80.00` and Insurance `20.00`, and read the Subtotal, the fee and the total.
2. Change Shipping & Handling to `85.00` and read them again.
3. Send the invoice.

**Expected Results:**

* At USD lines of 40000 minor units the Subtotal reads 314000, the fee 11296, read-only, and the total 325296 minor units in HKD.
* At USD lines of 40500 the Subtotal reads 317925, the fee 11434 and the total 329359.
* The send succeeds, and the invoice is `pending` with a fee of 11434 and a total of 329359 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-42i rev=2 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC15-2: A total that moved since it was read is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* An order in HKD in Preparing Invoice for bank transfer, with a winning bid of 250000 and a buyer's premium of 50000 minor units in USD.
* admin(operator with payment processing) has typed Shipping & Handling `80.00`, Insurance `40.00` and the fee `0.00`, and reads a total of 2449200 minor units in HKD.

**Steps:**

1. In a second session, raise the USD premium minimum to `600.00`.
2. Send the invoice from the first session.

**Expected Results:**

* The send is refused, and the dialog shows 2449200 as the total read and 2527700 minor units in HKD as the new one.
* Shipping & Handling and Insurance still read `80.00` and `40.00`.
* No invoice is issued.

<!-- trace:case id=g10adm.auction-post-sale.TC-dxc rev=2 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC16-2: The send shows its deadline, and a sent fee never moves

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* An order in HKD in Preparing Invoice for card, with USD lines of 40000 minor units, which convert to a Subtotal of 314000 minor units in HKD once Shipping & Handling and Insurance are entered.
* admin(operator with payment processing) works in Hong Kong time, and the clock reads 2026-09-12T09:00:00Z.

**Steps:**

1. Open Send invoice, enter the amounts, read the deadline, and send.
2. Change the HKD card rule to 3.9% and HK$2.35 in Payment Settings.
3. Reopen the order.

**Expected Results:**

* The dialog showed the payment deadline 2026-09-19 17:00, Hong Kong time, and the invoice carries 2026-09-19T09:00:00Z.
* After the rule changes, the invoice still carries a fee of 11296 and a total of 325296 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-j3w rev=2 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US5-TC18-2: The card fee is read from the card rule before send

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice for card, with USD lines of 25000, 5000, 8000 and 2000 minor units, which convert to a Subtotal of 314000 minor units in HKD.
* The HKD card rule in Payment Settings is 3.4% and HK$2.35.

**Steps:**

1. Open the send step.
2. Read the fee and the order total.

**Expected Results:**

* The payment processing fee reads 11296 and the order total 325296 minor units in HKD.
* The fee offers nothing to type.

<!-- trace:case id=g10adm.auction-post-sale.TC-r3c rev=3 covers=g10adm.auction-post-sale.SC-2g5-->
### post-sale-US5-TC22-3: The settlement currency is changed on a reissue after send

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/usd-quote.spec.ts`

**Pre-conditions:**

* admin(operator with payment-processing) has an order with a pending invoice sent in HKD for bank transfer on HK Local, whose USD lines are `<winning bid>` and `<premium>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<winning bid>` | USD100.00 (fixed derived value), 10000 minor units |
| `<premium>` | USD20.00 (fixed derived value), 2000 minor units |
| `<subtotal>` | HKD942.00 (fixed derived value), 94200 minor units: the USD120 sum times 7.85, converted once |

**Steps:**

1. Reissue the invoice, set its settlement currency to USD, keep HK Local, change nothing else and give a reason.
2. Read the order, the reissued invoice, the replaced invoice and the invoice log.

**Expected Results:**

* The order's settlement currency reads USD.
* The reissued invoice is pending and is in USD, with its lines priced from the order's USD amounts and none converted.
* The replaced invoice still reads its Winning Bid as `<winning bid>` in USD and its Subtotal as `<subtotal>` in HKD.
* The reissued entry on the invoice log names the settlement currency as a changed part.

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/usd-quote.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/usd-quote.spec.ts`

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

<!-- trace:case id=g10adm.auction-post-sale.TC-qz7 rev=3 covers=g10adm.auction-post-sale.SC-miq -->
### post-sale-US5-TC26-3: A large bank transfer fee is accepted and converts alone below the Subtotal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/usd-quote.spec.ts`

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice for bank transfer, whose settlement currency is HKD and whose USD lines of USD100.00, USD20.00, USD10.00 and USD4.00 convert to a Subtotal of HKD1,051.90 before the bank transfer fee.

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
* The invoice is `pending` with an order total of HKD4,976.90, the Subtotal plus the fee.

---

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

<!-- trace:case id=g10adm.auction-post-sale.TC-w3j rev=2 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-obc,g10adm.auction-post-sale.SC-5ky,g10adm.auction-post-sale.SC-5at,g10adm.auction-post-sale.SC-hto,g10adm.auction-post-sale.SC-ltc,g10adm.auction-post-sale.SC-3fi,g10adm.auction-post-sale.SC-xvo -->
### post-sale-US7-TC32-2: A method switch on reissue prices the fee by the new method

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/reissue.spec.ts`

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* An order in Pending Payment whose card invoice has USD lines of 40000 minor units, a Subtotal of 314000, a fee of 11296 and an order total of 325296 minor units in HKD.
* admin(operator with payment processing) opens Reissue.

**Steps:**

1. Switch the method to bank transfer, and read the USD lines, the Subtotal, the fee and the two totals.
2. Type a bank transfer fee of `50.00`.
3. Switch back to card, raise Shipping & Handling so the USD lines total 40500 minor units, and read the USD lines, the Subtotal, the fee and the two totals.

**Expected Results:**

* On bank transfer the dialog lists the USD lines and a Subtotal of 314000, the fee reads empty, which is zero, the previous total 325296 and the new total 314000.
* Once typed, the bank transfer fee takes 5000 minor units in USD and the preview reads it as 39250 minor units in HKD below the Subtotal.
* Back on card the dialog lists the USD lines with the raised Shipping & Handling and a Subtotal of 317925, the fee reads 11434, computed from the HKD card rule, read-only, and the new total 329359 sits beside the previous 325296.

<!-- trace:case id=g10adm.auction-post-sale.TC-6p7 rev=2 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US7-TC38-2: Reissue changes tax

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/reissue.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/reissue.spec.ts`

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

## post-sale-US8: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

### post-sale-US8-TC10-2: A reissue's entry names its amount change and each part it changed

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* `<hkd_order_n>` is in Pending Payment with the invoice of its row.
* admin(operator with payment processing) opens it.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_n | The HKD order of the row; bind its identity only |
| reason | The operator's stated reason for the reissue |

| Row | `<invoice before>` | `<reissue>` | `<parts named>` | `<total after>` | `<delta>` |
| --- | --- | --- | --- | --- | --- |
| Method, fee and Shipping & Handling | A card invoice with USD lines of USD250.00 winning bid, USD50.00 premium, USD80.00 Shipping & Handling and USD20.00 Insurance; Subtotal HKD3,140.00, fee HKD112.96, order total HKD3,252.96 | Switch to bank transfer with the fee left empty, raise Shipping & Handling to USD120.00, keep the deadline | payment method, card to bank transfer; Payment Processing Fee, HKD112.96 to HKD0.00; Shipping & Handling, USD80.00 to USD120.00 | HKD3,454.00 | HKD201.04 |
| Shipping & Handling alone | A bank transfer invoice with USD lines of USD101.00, USD20.20 and USD10.01, a bank transfer fee of USD0 and an order total of HKD1,030.00 | Raise Shipping & Handling to USD20.01, keep the deadline | Shipping & Handling, USD10.01 to USD20.01 | HKD1,108.50 | HKD78.50 |
| Shipping & Handling lowered on a card invoice | A card invoice with USD lines of USD150.00, USD30.00, USD49.00, USD20.00 and USD2.00; fee HKD71.79, order total HKD2,042.14 | Lower Shipping & Handling to USD16.04, keep the deadline | Shipping & Handling, USD49.00 to USD16.04; Payment Processing Fee, HKD71.79 to HKD62.68 | HKD1,774.30 | -HKD267.84 |

**Steps:**

1. Reissue it as the row says, giving `<reason>`.
2. Read the reissued entry on the timeline.

**Expected Results:**

* The entry carries the new order total `<total after>` in HKD, the delta `<delta>` from the prior entry, and the deadline kept.
* It names `<parts named>`, each with its value before and after, a line in USD and the fee in HKD.
* It shows no HKD figure for Shipping & Handling.
* It names no other part as changed.

<!-- trace:case id=g10adm.auction-post-sale.TC-0ok rev=2 covers=g10adm.auction-post-sale.SC-tyi -->
### post-sale-US8-TC13-2: A reissue that changes tax names it with its value before and after

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/history.spec.ts`

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* `<hkd_order_n>` is in Pending Payment with an invoice that carries no Tax.
* admin(operator with payment processing) opens it.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_n | The HKD order of the row; bind its identity only |
| reason | The operator's stated reason for the reissue |

| Row | `<invoice before>` | `<tax after>` | `<other parts named>` | `<total after>` |
| --- | --- | --- | --- | --- |
| Card invoice | USD lines of USD150.00, USD30.00, USD49.00 and USD20.00; fee HKD71.23, order total HKD2,025.88 | USD2.00 | Payment Processing Fee, HKD71.23 to HKD71.79 | HKD2,042.14 |
| Bank transfer invoice | USD lines of USD101.00, USD20.20 and USD10.01, a bank transfer fee of USD0 and an order total of HKD1,030.00 | USD60.00 | none | HKD1,501.00 |

**Steps:**

1. Reissue it adding Tax of `<tax after>`, changing nothing else, giving `<reason>`.
2. Read the reissued entry on the timeline.

**Expected Results:**

* The entry names Tax as changed, with no amount before and `<tax after>` in USD after.
* It carries the new order total `<total after>` in HKD.
* It names `<other parts named>` and no other part as changed.

---

## post-sale-US18: Operator reopens the address form

**As an** operator,
**I want** to give a winner who missed the 48-hour address deadline a fresh 48 hours, with my reason on the record,
**so that** a winner who got in touch can finish the order without me cancelling the lot.

<!-- trace:case id=g10adm.auction-post-sale.TC-zl5 rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US18-TC11-1: Send keeps the confirmed address locked and starts the seven days

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* `<preparing-invoice order>` carries an address confirmed on 2026-09-04T08:00:00Z and no invoice.
* admin(holds payment-processing) is on `<preparing-invoice order>` at `<the send>`.

**Test data:**

| Field | Value |
| --- | --- |
| Shipping & Handling | 24000 minor units, USD |
| `<the send>` | 2026-09-05T09:00:00Z |
| Payment deadline | 2026-09-12T09:00:00Z |

**Steps:**

1. Enter Shipping & Handling for the confirmed address.
2. Send the invoice.
3. Read the payment deadline and the delivery address.

**Expected Results:**

* The invoice is issued and the order derives Pending Payment.
* The payment deadline is 2026-09-12T09:00:00Z.
* The delivery address stays as confirmed, locked since confirmation; the send changes nothing about it.

<!-- trace:case id=g10adm.auction-post-sale.TC-84x rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US18-TC12-1: Send is refused while no address is confirmed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* `<awaiting-address order>` has no confirmed delivery address and its address form is open.
* admin(holds payment-processing) is on `<awaiting-address order>`.

**Steps:**

1. Enter Shipping & Handling of 24000 minor units in USD.
2. Send the invoice.

**Expected Results:**

* The send is refused.
* No invoice is issued and no payment deadline starts.
* The order still derives Awaiting Setup.

<!-- trace:case id=g10adm.auction-post-sale.TC-goe rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US18-TC13-1: A closed window does not stop an operator sending

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* `<closed-window order>` carries an address confirmed inside the 48 hours and its address deadline passed two hours ago.
* admin(holds payment-processing) is on `<closed-window order>`.

**Steps:**

1. Enter Shipping & Handling of 24000 minor units in USD.
2. Send the invoice.

**Expected Results:**

* The send is accepted.
* The order derives Pending Payment with a seven-day deadline.
* The closed window gated the winner's write, not the operator's send.

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

- The quote preview and the order page write every amount in the operator shape, `USD 150.00` and `HKD 1,970.35` (decisions Q26, Q29).
- The reissue dialog shows the same preview as Send invoice, the USD lines, then the HKD Subtotal, fee and total, with the previous total beside the new one (decisions Q27).
- The order page lists a sent HKD invoice's USD lines, then its HKD Subtotal, Payment Processing Fee and Total, with no HKD amount beside a line and no rate; the reissue history writes a changed line in USD, tagged with its currency, and the fee and total in HKD (decisions Q29).
- A bank transfer fee typed in USD converts alone at 7.85, rounded up to the next cent, below the Subtotal; a card fee is computed in HKD on the Subtotal (decisions Q3, Q6).
- A reissue prices under the rule, and the replaced invoice keeps the amounts it was sent with and stays readable on the order page (decisions Q16).
- An HKD invoice sent before this layout keeps its stored amounts and reads in the new layout from them (decisions Q12, Q31).

## Reconciliation

**Run:** QA1, blind pass for `convert-hkd-order-at-subtotal`, 2026-10-22. The first blind pass read a bundle whose existing suites were empty and whose PRD pages lacked the product manager's edits, both packaging defects of the coordinator. It was resumed against a corrected bundle, with the real suites and the current PRD, and revised. It read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. It is the run's own statement, not proof.

**Run:** QA1, second blind pass, 2026-10-22. It extended its cases for the operator's order page and the house order, from the frozen anchors, the journeys, `decisions.md` with its Raised table and the PRD, with the same denials as the first pass. Its files started from the blind state, without the dispositions below. It is the run's own statement, not proof.

**Run:** QA2, second reconciliation pass, 2026-10-22, in a fresh context. It read the repaired deltas of the five capabilities, `tasks.md`, `tech-design.md`, `proposal.md`, the journeys and `decisions.md` through Q31, the PRD sections they cite, and both QA1 passes. It merged QA1's new cases into this suite, re-checked every durable case that states an amount or a line against Q29, recomputed every minor-unit figure, and wrote no case from a scenario. A case is linked to a scenario when its results assert every outcome the scenario's THEN and ANDs state, from a starting state of the same class and with values from the same partition; a clause a case leaves out keeps the link off and the scenario under Uncovered or Out of suite. A display shape the scenario quotes, such as `USD 101.00`, is not asserted by a fixture reading, so such a scenario is left to its unit test. It is a statement, not proof.

**Blind cases**

| Case | Disposition |
| --- | --- |
| `US21-TC1-1` (`TC-25a`) | Kept. A card quote of five typed USD lines reads the Subtotal, the read-only fee and the total, with no per-line HKD amount, rate or note. Linked: `g10adm.auction-post-sale.SC2` |
| `US21-TC2-1` (`TC-hio`) | Regrouped into `US5-TC24` (`TC-9yj`): the rounding of a typed USD sum in the quote is one surface, one route and one checking. Dropped; it was never published |
| `US21-TC3-1` (`TC-tui`) | Kept. The bank transfer fee typed in USD converts below the preview Subtotal. No link: it lists no USD lines, so SC1 rests on this case and `TC1-1` together and is left to its unit test |
| `US21-TC4-1` (`TC-a57`) | Kept. The sent invoice carries the total the operator previewed. Linked: `g10adm.auction-post-sale.SC3` |
| `US2-TC13-1` (`TC-ao7`) | Kept. The order page of a sent HKD invoice lists the USD lines, then the HKD Subtotal, fee and Total, with nothing in HKD beside a line, for a card invoice and a bank transfer invoice with a Free fee. No link: SC7 quotes the operator shape, which a fixture reading does not assert, and its bank fee is converted where these rows are not |
| `US2-TC14-1` (`TC-t1k`) | Kept. A test order sent before this layout lists its stored USD lines and its stored Subtotal, not a re-priced one (decisions Q12). Pre-layout order page; scenario SC10 covers only the log entry, so no link |
| `US7-TC50-1` (`TC-0d1`) | Regrouped: the reissue entry is read on the timeline, which post-sale-US-08 owns and every scenario about it serves. Its Shipping & Handling row is row 3 of `US8-TC10-2` and its Tax row is row 1 of `US8-TC13-2`. The case is dropped; it was never published |

**Existing durable cases**

Every durable case below is `draft`; each rewrite keeps its marker id and bumps the revision, so the fold replaces the durable case of the same `TC<m>`.

| Durable case | Verdict | Action |
| --- | --- | --- |
| `US2-TC7-1` (`TC-jip`) | The sent invoice carries S&H and Insurance in USD, not HKD | Rewritten as `TC7-2` |
| `US5-TC9-3` (`TC-u4w`) | Tax carried in HKD | Rewritten as `TC9-4` on the fixture of SC-155; link kept |
| `US5-TC13-1` (`TC-rh9`) | Lines sum to a Subtotal the HKD fixtures did not state | Rewritten as `TC13-2` on the USD lines of SC-168 and SC-169 (314000 and 317925) |
| `US5-TC15-1` (`TC-42i`) | A total of 312000 "in HKD" built from typed USD lines, and an "HKD" premium minimum | Rewritten as `TC15-2`: 2449200 before, 2527700 after a USD minimum of 600.00 |
| `US5-TC16-1` (`TC-dxc`) | A Subtotal of 312000 formed once S&H and Insurance are typed | Rewritten as `TC16-2` on 314000, fee 11296, total 325296 |
| `US5-TC18-1` (`TC-j3w`) | The same abstract Subtotal at the send step | Rewritten as `TC18-2` on the fixture of SC-69 |
| `US5-TC20-2` (`TC-70n`) | The HKD row converts each amount | Rewritten as `TC20-3` |
| `US5-TC22-2` (`TC-r3c`) | "The replaced invoice still reads its HKD amounts" | Rewritten as `TC22-3`: the replaced invoice reads its Winning Bid in USD and its Subtotal in HKD (SC-245); link kept |
| `US5-TC24-2` (`TC-9yj`) | S&H read as HKD79.00 | Rewritten as `TC24-3` with QA1's `TC2-1` folded in; links SC-252 and SC-251 |
| `US5-TC25-2` (`TC-jru`) | Rows 1,053 and 1,031, each component converted | Rewritten as `TC25-3`; links kept |
| `US5-TC26-2` (`TC-qz7`) | SC-119 now derives its Subtotal from USD lines (105190, total 497690) | Rewritten as `TC26-3`; link kept |
| `US7-TC32-1` (`TC-w3j`) | The typed fee reads 5000 on an HKD quote, and the 312,000 and 316,000 Subtotals cannot be typed | Rewritten as `TC32-2` on the figures of SC-169 and SC-171, with the dialog's lines read (Q27); adds a link to SC5 |
| `US7-TC38-1` (`TC-6p7`), `US7-TC46-1` (`TC-yjb`) | Tax of 6000 minor units in HKD on an HKD invoice | Rewritten as `TC38-2` and `TC46-2`; re-checked against Q29, no further change |
| `US8-TC10-1` | The entry names S&H, fee and total in HKD | Rewritten as `TC10-2` over three rows with QA1's S&H row folded in. The durable record has no trace marker and `trace init` refuses to issue one in a change copy until it does, so the case carries no marker and its links to SC-123 and SC6 wait for one |
| `US8-TC13-1` (`TC-0ok`) | Tax of 6000 minor units in HKD | Rewritten as `TC13-2` over a card row from QA1 and the bank row of SC-204; link kept |
| `US18-TC11-1`, `TC12-1`, `TC13-1` | Only the typed S&H is labelled HKD; no assertion moves | Restyled to USD at the same revision |
| `US7-TC7-1`, `TC8-1`, `TC25-2`, `US5-TC21-2`, `US8-TC7-1` | Carry no amount that moves | Left `draft` |

The legacy `covers` lists on `TC13-2`, `TC15-2`, `TC16-2`, `TC18-2`, `TC32-2` and `TC38-2` name dozens of scenarios each; they are over-claimed and are left for `/tcs-review`. Cases that name an abstract HKD total only as the state of a sent invoice (record payment, refunds, late card payments) are not derived from lines and are left.

**Scenario coverage**

| Scenario | Covered by |
| --- | --- |
| SC-251, SC-252 | `US5-TC24-3` |
| SC2 | `US21-TC1-1` |
| SC3 | `US21-TC4-1` |
| SC-48, SC-63, SC-253 | `US5-TC25-3` |
| SC-155 | `US5-TC9-4` |
| SC-119 | `US5-TC26-3` |
| SC-69 | `US5-TC18-2` |
| SC-169, SC-171 | `US5-TC13-2`, `US7-TC32-2`, on the scenarios' own figures |
| SC5 | `US7-TC32-2` |
| SC-204 | `US8-TC13-2` |
| SC-245 | `US5-TC22-3` |
| SC-158, SC-210 | `US7-TC38-2`, `US7-TC46-2` |
| SC-123, SC6, SC9 | `US8-TC10-2` (SC9 by row 3, on its own figures' class), asserted but not linkable until the durable case has a marker |
| SC10 | None: it reads a log entry written before line parts carried a currency, which no tester can write now |

**Verified outside this suite:** g10adm.auction-post-sale.SC1, g10adm.auction-post-sale.SC4, g10adm.auction-post-sale.SC7, g10adm.auction-post-sale.SC8, g10adm.auction-post-sale.SC10

Each is a display claim of the quote dialog or the order page that the cases above assert in substance, with the operator shape and the exact fixture left to the dialog and order page tests of task 9.1 (`SendInvoiceDialog.test.tsx`, `quoteDraft.test.ts`, `OrderDetail.test.tsx`) in the application repository. `US21-TC1-1`, `TC3-1` and `US2-TC13-1` read the same surfaces by hand. SC10, an entry written before the rule, is verified by the history tests of task 9.1 in the application repository (`changeLine` in `orderCopy.ts` reads a part's currency before the entry's, per task 9.4).

**Uncovered**

- `grade10-admin-auction-post-sale-SC-123` and `g10adm.auction-post-sale.SC6` and `g10adm.auction-post-sale.SC9` are asserted by `US8-TC10-2` and carry no link only because the durable `US8-TC10-1` has no trace marker. One `trace init case` on the durable record lets this case take its marker and the two links

**Over-claimed**

- The legacy `covers` lists above
- None beyond the legacy lists

**Contradictions between the readings**

- None. The durable `grade10-admin-auction-post-sale-SC-245`, `SC-123` and `SC-204`, which disagreed with the first pass's cases, are repaired in the delta

**Anchor coverage**

| Anchor | Cases | Scenarios |
| --- | --- | --- |
| `post-sale-US-21` | `US21-TC1-1`, `TC3-1`, `TC4-1`, `US5-TC24-3` | SC2, SC3 covered; SC1, SC4 out of suite |
| `post-sale-US-02` | `US2-TC7-2`, `TC13-1`, `TC14-1` | SC7, SC8 out of suite |
| `post-sale-US-05` | `US5-TC9-4`, `TC13-2`, `TC15-2`, `TC16-2`, `TC18-2`, `TC20-3`, `TC24-3`, `TC25-3`, `TC26-3` | All covered |
| `post-sale-US-07` | `US5-TC22-3`, `US7-TC32-2`, `TC38-2`, `TC46-2` | All covered |
| `post-sale-US-08` | `US8-TC10-2`, `TC13-2` | SC-204 covered; SC-123, SC6 and SC9 asserted, link pending; SC10 out of suite |
| Root group Quote and send | the US21 and US5 cases | Both bullets covered |
| Root group Order page | `US2-TC13-1`, `TC14-1`, `US8-TC10-2`, `TC13-2` | Both bullets reached |
| Context journeys | `US8`, `US18` | Both are Context in `user-journeys.md` |

**Raised**

Q26 and Q27 close two rows and Q29 the order page and history row; the answers sit in `## Settled`.
