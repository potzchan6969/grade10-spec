# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-14, tcs-rules r5

## g10.auction-winner-order.US26: Winner who settles in HKD reads the invoice and receipt with USD lines and an HKD total

**As a** winner who picked HKD,
**I want** my invoice, receipt and receipt letter to list the same USD lines and end in the same HKD Subtotal, fee and Order Total as my Order Summary,
**so that** every document I keep shows what the lot cost in USD and what I paid in HKD.

---

## g10.auction-winner-order.US27: Winner who settles in HKD reads the Order Summary with USD lines and an HKD total

**As a** winner who picked HKD,
**I want** my Order Summary to list what I won in USD, then one HKD Subtotal converted from their sum, the fee, and the Order Total I will pay,
**so that** I see what the lot cost and check what I pay against the one rate the note names.

## Ungrouped

### g10.auction-winner-order.US26: Winner who settles in HKD reads the invoice and receipt with USD lines and an HKD total

<!-- trace:case id=g10.auction-winner-order.TC-c07 rev=1 -->
#### g10.auction-winner-order.US26-TC10: Invoice page and PDF list USD lines then HKD Subtotal, fee and total

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card, invoice sent and Pending Payment; lines USD150 winning bid, USD30 Buyer's Premium, USD49 Shipping & Handling, USD20 Insurance, USD2 Tax; HKD card rule 3.4% plus HKD2.35 |
| usd_sum_1 | USD251 (fixed: the sum of the five USD lines) |
| subtotal_1 | HKD1970.35 (fixed: `<usd_sum_1>` times 7.85, converted once) |
| fee_1 | HKD71.79 (fixed: the card gross-up of `<subtotal_1>` under the rule, rounded up to the next cent) |
| total_1 | HKD2042.14 (fixed: `<subtotal_1>` plus `<fee_1>`) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

| Row | `<invoice_document>` |
| --- | --- |
| Page | The invoice page the Invoice link opens |
| PDF | The invoice PDF the Invoice link opens or downloads |

**Steps:**

1. Click the Invoice link beside the Order summary heading.
2. Open `<invoice_document>`.
3. Read its item lines, Subtotal, Payment Processing Fee and Order Total.

**Expected Results:**

* `<invoice_document>` opens.
* Item lines read Winning Bid, Buyer's Premium, Shipping & Handling, Insurance and Tax, each in USD with two decimals.
* Subtotal reads `<subtotal_1>` with two decimals, `<usd_sum_1>` times 7.85.
* Payment Processing Fee reads `<fee_1>` and Order Total reads `<total_1>`, both in HKD with two decimals.
* No rate and no conversion note is named anywhere in `<invoice_document>`.
* Every figure equals the Order Summary on Winner Order.

<!-- trace:case id=g10.auction-winner-order.TC-b46 rev=1 -->
#### g10.auction-winner-order.US26-TC11: Invoice with Free lines and no Insurance or Tax keeps two decimals

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_4 | An HKD order paid by bank transfer on FPS, invoice sent and Pending Payment; lines USD100 winning bid, USD20 Buyer's Premium, Shipping & Handling zero; no Insurance, no Tax; the operator left the bank transfer fee empty |
| usd_sum_2 | USD120 (fixed: the two non-zero lines) |
| subtotal_2 | HKD942 (fixed: `<usd_sum_2>` times 7.85, a whole-dollar HKD amount) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

| Row | `<invoice_document>` |
| --- | --- |
| Page | The invoice page the Invoice link opens |
| PDF | The invoice PDF the Invoice link opens or downloads |

**Steps:**

1. Click the Invoice link beside the Order summary heading.
2. Open `<invoice_document>`.
3. Read its item lines, Subtotal, Payment Processing Fee and Order Total.

**Expected Results:**

* `<invoice_document>` opens.
* Shipping & Handling reads Free.
* No Insurance line and no Tax line is printed.
* Subtotal reads `<subtotal_2>` as HK$942.00, trailing zeros kept.
* Payment Processing Fee reads Free and is not left out.
* Order Total reads `<subtotal_2>` as HK$942.00.

<!-- trace:case id=g10.auction-winner-order.TC-9ke rev=1 -->
#### g10.auction-winner-order.US26-TC12: Receipt PDF repeats the USD lines and the HKD Subtotal, fee and total

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_1>`.
* `<hkd_order_1>` was paid in full by card and reads Preparing Shipment.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card; lines USD150 winning bid, USD30 Buyer's Premium, USD49 Shipping & Handling, USD20 Insurance, USD2 Tax; HKD card rule 3.4% plus HKD2.35 |
| usd_sum_1 | USD251 (fixed: the sum of the five USD lines) |
| subtotal_1 | HKD1970.35 (fixed: `<usd_sum_1>` times 7.85, converted once) |
| fee_1 | HKD71.79 (fixed: the card gross-up of `<subtotal_1>` under the rule, rounded up to the next cent) |
| total_1 | HKD2042.14 (fixed: `<subtotal_1>` plus `<fee_1>`) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Click the receipt link under the payment-method card.
2. Read the receipt PDF's item lines, Subtotal, Payment Processing Fee and Order Total.

**Expected Results:**

* The receipt PDF opens.
* Item lines read in USD with two decimals, Tax between Insurance and the Subtotal.
* Subtotal reads `<subtotal_1>`, fee `<fee_1>` and Order Total `<total_1>`, all in HKD with two decimals.
* No rate and no conversion note is named.
* Every figure equals the invoice and the Order Summary.

<!-- trace:case id=g10.auction-winner-order.TC-q8e rev=1 -->
#### g10.auction-winner-order.US26-TC13: Reissued invoice is priced once under the rule and the replaced one keeps its amounts

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_1>`.
* An operator reissued `<invoice_1>` as `<invoice_2>`, changing only Shipping & Handling from USD49 to `<shipping_after>`.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card; lines USD150 winning bid, USD30 Buyer's Premium, USD20 Insurance, USD2 Tax and Shipping & Handling as quoted; HKD card rule 3.4% plus HKD2.35 |
| invoice_1 | The invoice first sent for `<hkd_order_1>`, with Shipping & Handling USD49, now replaced |
| invoice_2 | The invoice that replaces `<invoice_1>`, pending |
| subtotal_1 | HKD1970.35 (fixed: USD251 times 7.85, converted once; what `<invoice_1>` was sent with) |
| fee_1 | HKD71.79 (fixed: the card gross-up of `<subtotal_1>` under the rule, rounded up to the next cent) |
| total_1 | HKD2042.14 (fixed: `<subtotal_1>` plus `<fee_1>`) |
| shipping_after | USD16.04 (fixed: makes the new USD sum USD218.04, whose conversion rounds up to HK$1,711.62; nearest-cent rounding would read HK$1,711.61) |
| usd_sum_3 | USD218.04 (fixed: USD150 plus USD30 plus `<shipping_after>` plus USD20 plus USD2) |
| subtotal_3 | HKD1711.62 (fixed: `<usd_sum_3>` times 7.85, converted once and rounded up) |
| fee_3 | HKD62.68 (fixed: the card gross-up of `<subtotal_3>` under the rule, rounded up to the next cent) |
| total_3 | HKD1774.30 (fixed: `<subtotal_3>` plus `<fee_3>`) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the Order Summary and the note under the Subtotal.
2. Click the Invoice link beside the Order summary heading and read the invoice.
3. As admin(holds payment-processing), open the order's invoice history and open the replaced `<invoice_1>`.
4. Read the replaced invoice's lines, Subtotal, fee and total.

**Expected Results:**

* The Order Summary reads Subtotal `<subtotal_3>`, fee `<fee_3>` and Order Total `<total_3>`.
* The note names `<usd_sum_3>`.
* The new invoice says it replaces `<invoice_1>` and prints the same figures as the Order Summary.
* The replaced `<invoice_1>` still prints Subtotal `<subtotal_1>`, fee `<fee_1>` and Order Total `<total_1>`.

### g10.auction-winner-order.US27: Winner who settles in HKD reads the Order Summary with USD lines and an HKD total

<!-- trace:case id=g10.auction-winner-order.TC-xgk rev=1 -->
#### g10.auction-winner-order.US27-TC4: Order Summary lists USD lines, one HKD Subtotal and its note

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card, invoice sent and Pending Payment; lines USD150 winning bid, USD30 Buyer's Premium, USD49 Shipping & Handling, USD20 Insurance, USD2 Tax; HKD card rule 3.4% plus HKD2.35 |
| usd_sum_1 | USD251 (fixed: the sum of the five USD lines) |
| subtotal_1 | HKD1970.35 (fixed: `<usd_sum_1>` times 7.85, converted once) |
| per_line_sum_1 | HKD1972 (fixed: each line converted and rounded up to a whole HK$, then summed, the rule this replaces) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Scroll to the Order Summary.
2. Read its rows from the top down.
3. Read the note under the Subtotal.

**Expected Results:**

* Rows read Winning Bid, Buyer's Premium, Shipping & Handling, Insurance and Tax, in that order.
* Each of those rows shows its USD amount with two decimals and no HKD amount beside it.
* One Subtotal row follows them and reads `<subtotal_1>`, not `<per_line_sum_1>`.
* The note under the Subtotal names `<usd_sum_1>` and the rate 1 USD = 7.85 HKD.
* The Payment Processing Fee and the Order Total sit below the Subtotal.
* No other row names the rate.

<!-- trace:case id=g10.auction-winner-order.TC-i4z rev=1 -->
#### g10.auction-winner-order.US27-TC5: Card fee is computed on the HKD Subtotal and the Order Total is their sum

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card, invoice sent and Pending Payment; lines USD150 winning bid, USD30 Buyer's Premium, USD49 Shipping & Handling, USD20 Insurance, USD2 Tax; HKD card rule 3.4% plus HKD2.35 |
| usd_sum_1 | USD251 (fixed: the sum of the five USD lines) |
| subtotal_1 | HKD1970.35 (fixed: `<usd_sum_1>` times 7.85, converted once) |
| fee_1 | HKD71.79 (fixed: the card gross-up of `<subtotal_1>` under the rule, rounded up to the next cent) |
| fee_on_per_line_1 | HKD71.85 (fixed: the same gross-up of HKD1972, the base this replaces) |
| total_1 | HKD2042.14 (fixed: `<subtotal_1>` plus `<fee_1>`) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the Payment Processing Fee row.
2. Read the Order Total row.
3. Read the note under the Subtotal again.

**Expected Results:**

* Payment Processing Fee reads `<fee_1>` in HKD, not `<fee_on_per_line_1>`.
* The fee row shows no USD figure.
* Order Total reads `<total_1>`, `<subtotal_1>` plus `<fee_1>`, with two decimals and no further rounding.
* The note still names `<usd_sum_1>`; the fee adds nothing to it.

<!-- trace:case id=g10.auction-winner-order.TC-xdg rev=1 -->
#### g10.auction-winner-order.US27-TC6: Subtotal converts the USD sum once and rounds up to the next cent

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_2 | An HKD order paid by bank transfer on FPS, invoice sent and Pending Payment; no Insurance, no Tax; the operator left the bank transfer fee empty; its lines are `<bid>`, `<premium>` and `<shipping>` |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

| Row | `<bid>` (fixed) | `<premium>` (fixed, 20% of `<bid>`) | `<shipping>` (fixed) | `<usd_sum>` | `<subtotal>` | Why this row |
| --- | --- | --- | --- | --- | --- | --- |
| Exact | USD150 | USD30 | USD71 | USD251 | HKD1970.35 | No fraction of a cent, nothing to round |
| Below half a cent | USD70 | USD14 | USD16.04 | USD100.04 | HKD785.32 | 785.314 rounds up; nearest-cent rounding would read HK$785.31 |
| Above half a cent | USD100 | USD20 | USD11.21 | USD131.21 | HKD1030 | 1029.9985 rounds up; truncating would read HK$1,029.99 |
| Smallest fraction | USD80 | USD16 | USD4.13 | USD100.13 | HKD786.03 | 786.0205 rounds up; nearest-cent rounding would read HK$786.02 |

**Steps:**

1. Read the rows above the Subtotal.
2. Read the Subtotal and the note under it.
3. Read the Payment Processing Fee and the Order Total.

**Expected Results:**

* The USD rows add up to `<usd_sum>`.
* Subtotal reads `<subtotal>` with two decimals, `<usd_sum>` times 7.85 converted once.
* The note names `<usd_sum>`.
* Payment Processing Fee reads Free.
* Order Total reads `<subtotal>`.

<!-- trace:case id=g10.auction-winner-order.TC-m5d rev=1 -->
#### g10.auction-winner-order.US27-TC7: Bank transfer fee converts below the Subtotal and stays out of the note

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_3>`.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_3 | An HKD order paid by bank transfer on FPS, invoice sent and Pending Payment; lines USD150 winning bid, USD30 Buyer's Premium, USD49 Shipping & Handling, USD20 Insurance, USD2 Tax; the operator typed the bank transfer fee `<bank_fee>` |
| usd_sum_1 | USD251 (fixed: the sum of the five USD lines) |
| subtotal_1 | HKD1970.35 (fixed: `<usd_sum_1>` times 7.85, converted once) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

| Row | `<bank_fee>` (fixed, typed in USD) | `<bank_fee_hkd>` | `<total>` | Why this row |
| --- | --- | --- | --- | --- |
| Exact | USD25 | HKD196.25 | HKD2166.60 | 196.25 needs no rounding |
| Rounds up | USD25.04 | HKD196.57 | HKD2166.92 | 196.564 rounds up; nearest-cent rounding would read HK$196.56 |

**Steps:**

1. Read the rows below the Subtotal.
2. Read the Order Total.
3. Click View Bank Details.
4. Read the amount due.

**Expected Results:**

* Subtotal still reads `<subtotal_1>` and the note still names `<usd_sum_1>`, without `<bank_fee>`.
* Payment Processing Fee sits below the Subtotal and reads `<bank_fee_hkd>`, `<bank_fee>` times 7.85 rounded up to the next cent.
* Order Total reads `<total>`, `<subtotal_1>` plus `<bank_fee_hkd>`.
* The amount due at step 4 reads `<total>`.

<!-- trace:case id=g10.auction-winner-order.TC-oc2 rev=1 -->
#### g10.auction-winner-order.US27-TC8: Free shipping, absent Insurance and Tax, and a Free fee still show the Subtotal

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_4 | An HKD order paid by bank transfer on FPS, invoice sent and Pending Payment; lines USD100 winning bid, USD20 Buyer's Premium, Shipping & Handling zero; no Insurance, no Tax; the operator left the bank transfer fee empty |
| usd_sum_2 | USD120 (fixed: the two non-zero lines) |
| subtotal_2 | HKD942 (fixed: `<usd_sum_2>` times 7.85, a whole-dollar HKD amount) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read the Order Summary rows from the top down.
2. Read the note under the Subtotal.

**Expected Results:**

* Shipping & Handling reads Free.
* No Insurance row and no Tax row shows.
* The Subtotal row and its note still show, naming `<usd_sum_2>`.
* Subtotal reads `<subtotal_2>` as HK$942.00, trailing zeros kept.
* Payment Processing Fee reads Free below the Subtotal and is not hidden.
* Order Total reads `<subtotal_2>` as HK$942.00.

<!-- trace:case id=g10.auction-winner-order.TC-qf9 rev=1 -->
#### g10.auction-winner-order.US27-TC9: Order Summary keeps USD marks and HKD figures in Chinese

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_1>` under the `<lang>` prefix.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card, invoice sent and Pending Payment; lines USD150 winning bid, USD30 Buyer's Premium, USD49 Shipping & Handling, USD20 Insurance, USD2 Tax; HKD card rule 3.4% plus HKD2.35 |
| subtotal_1 | HKD1970.35 (fixed: USD251 times 7.85, converted once) |
| total_1 | HKD2042.14 (fixed: `<subtotal_1>` plus HKD71.79) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

| Row | `<lang>` |
| --- | --- |
| Traditional Chinese | `/tc` |
| Simplified Chinese | `/sc` |

**Steps:**

1. Navigate to `<winner order url>` with the `<lang>` prefix.
2. Read the Order Summary rows and the note under the Subtotal.

**Expected Results:**

* Row labels and the note read in the page language.
* The USD lines keep the US$ mark in that language.
* Subtotal reads `<subtotal_1>` and Order Total reads `<total_1>`, the same figures as the English page.
* The note names USD251 and the rate 1 USD = 7.85 HKD.

<!-- trace:case id=g10.auction-winner-order.TC-kkw rev=1 -->
#### g10.auction-winner-order.US27-TC10: Mixed-currency Order Summary and note fit a narrow viewport

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_1>`.
* The browser viewport is `<narrow_width>` wide.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card, invoice sent and Pending Payment; lines USD150 winning bid, USD30 Buyer's Premium, USD49 Shipping & Handling, USD20 Insurance, USD2 Tax; HKD card rule 3.4% plus HKD2.35 |
| narrow_width | 360 px (range: any phone width below the small breakpoint) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Scroll to the Order Summary.
2. Read each row from the Winning Bid to the Order Total.
3. Scroll sideways.

**Expected Results:**

* Every amount and label is fully visible, none clipped or overlapping.
* The note under the Subtotal wraps inside the summary.
* The page does not scroll sideways.
