# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-14, tcs-rules r5

## post-sale-US21: Operator previews the HKD total a quote will charge

**As an** operator quoting an order whose winner picked HKD,
**I want** to see the USD lines I typed, then the HKD Subtotal, fee and total the winner will be asked to pay,
**so that** I send an invoice whose total I have read before the winner does.

<!-- trace:case id=g10adm.auction-post-sale.TC-25a rev=1 -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-hio rev=1 -->
### post-sale-US21-TC2-1: Preview Subtotal converts the typed USD sum once and rounds up

Runs once per row of **Test data**.

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

* admin(holds payment-processing) is on the order page of `<hkd_order_2>` on the Grade10 auction admin.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_2 | An HKD order paid by bank transfer on FPS, Preparing Invoice; winning bid `<bid>`, Buyer's Premium `<premium>`; no Insurance, no Tax; the bank transfer fee left empty |

| Row | `<bid>` (fixed) | `<premium>` (fixed, 20% of `<bid>`) | `<shipping>` (fixed, typed) | `<usd_sum>` | `<subtotal>` | Why this row |
| --- | --- | --- | --- | --- | --- | --- |
| Below half a cent | USD70 | USD14 | USD16.04 | USD100.04 | HKD785.32 | 785.314 rounds up; nearest-cent rounding would read 785.31 |
| Above half a cent | USD100 | USD20 | USD11.21 | USD131.21 | HKD1030 | 1029.9985 rounds up; truncating would read 1,029.99 |

**Steps:**

1. Click Send invoice.
2. Type `<shipping>` in Shipping & Handling and leave Insurance, Tax and the bank transfer fee empty.
3. Read the Subtotal, fee and total in the quote preview.

**Expected Results:**

* The Subtotal reads `<subtotal>` in HKD, `<usd_sum>` times 7.85 converted once.
* The Payment Processing Fee adds nothing.
* The total reads `<subtotal>`.

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

<!-- trace:case id=g10adm.auction-post-sale.TC-a57 rev=1 -->
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
