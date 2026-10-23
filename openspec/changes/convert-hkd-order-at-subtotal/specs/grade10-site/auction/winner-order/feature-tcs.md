# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/26
**Drafts styled:** 2026-10-14, tcs-rules r5

## g10.auction-winner-order.US1: Winner settles a won listing

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the listing I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-apy rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### g10.auction-winner-order.US1-TC26: A sent invoice with Insurance shows the amount and its tip

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_23_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_23_1 | An HKD order whose sent invoice includes Insurance of USD40.00, typed in USD; bind its identity only |
| insurance_amount | US$40.00 (fixed: 4000 minor units, a USD line that is not converted) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Find Insurance on Order Summary.
2. Hover the Insurance info tooltip.

**Expected Results:**

* Step 1: Insurance reads `<insurance_amount>`, not TBD, and no HKD amount beside it.
* Step 2: the tooltip reads `0.9% of the order value during transit.`

<!-- trace:case id=g10.auction-winner-order.TC-m21 rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC31: Sent tax is itemised throughout the order record

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) holds a paid auction order in USD whose invoice includes Tax of USD70 (range: >0 minor units).

* The winner order under test is `<winner_order_41_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_41_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |
| winner_order_41_2 | An HKD order, invoice sent, whose invoice includes Tax of USD60.00 (fixed: 6000 minor units, typed in USD); bind its order identity only |

**Steps:**

1. Open Winner Order and read Order Summary.
2. Open the invoice PDF.
3. Open the receipt PDF.
4. Open Winner Order for `<winner_order_41_2>` and read Order Summary.

**Expected Results:**

* Order Summary shows Tax of USD70 (range: >0 minor units) between Insurance and Payment Processing Fee.
* Order Summary offers the Tax info tip with the stated copy.
* The invoice PDF and the receipt PDF each show Tax of USD70 (range: >0 minor units) between Insurance and Subtotal.
* Each PDF's Subtotal includes Tax of USD70 (range: >0 minor units).
* Step 4: Order Summary shows Tax as `US$60.00` between Insurance and Payment Processing Fee, with the Tax info tip and its stated copy.

<!-- trace:case id=g10.auction-winner-order.TC-dvc rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1,g10.auction-winner-order.SC-fm8,g10.auction-winner-order.SC-ckz,g10.auction-winner-order.SC-98w,g10.auction-winner-order.SC-vuk,g10.auction-winner-order.SC-h2c,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-er5,g10.auction-winner-order.SC-ppq,g10.auction-winner-order.SC-deu,g10.auction-winner-order.SC-4z7,g10.auction-winner-order.SC-d0w,g10.auction-winner-order.SC-mph,g10.auction-winner-order.SC-1ok -->
### g10.auction-winner-order.US1-TC33: Card fee is grossed up on tax

**Classification:**

* **Severity:** critical
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

* admin(operator with payment-processing) is on a card order in Preparing Invoice, settled in HKD.
* The order's USD lines before Tax total USD320 (fixed derived value).

* The winner order under test is `<winner_order_43_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_43_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Add Tax of USD80 (fixed derived value).
2. Send the invoice.
3. Read its Subtotal and payment processing fee inputs.

**Expected Results:**

* The Subtotal is HKD3,140.00 (fixed derived value), the USD400 sum of the lines and Tax converted once at 7.85.
* Grade10 computes the payment processing fee from that Subtotal.

---

## g10.auction-winner-order.US2: Winner follows a settled listing to delivery

**As a** winner who has paid,
**I want** a receipt PDF that says how I paid, what was paid before it and what is still owed, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

<!-- trace:case id=g10.auction-winner-order.TC-h7f rev=3 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### g10.auction-winner-order.US2-TC1: The receipt itemises what was paid and sums to the total

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/winner-order/keep-records.spec.ts`

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_51_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_51_1 | An HKD order paid in full at `<final amount>`; bind its identity only | · |
| final amount | HKD3,330 | (range: 80000-399999 minor units) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Download the receipt PDF.
2. Read its lines.

**Expected Results:**

* Winning bid, buyer's premium, shipping, insurance when added and Tax when added show in USD, then the Subtotal, the Payment Processing Fee and the final amount in HKD.
* The Subtotal and the fee add up to `<final amount>`.
* It names how it was paid.

---

## g10.auction-winner-order.US8: Winner pays an invoice with a policy premium

**As a** winner of an auction listing,
**I want** my invoice to calculate the stated buyer premium correctly using the current currency minimum,
**so that** the amount I pay is explainable and collectible.

<!-- trace:case id=g10.auction-winner-order.TC-xji rev=2 -->
### g10.auction-winner-order.US8-TC5: HKD order converts the premium and minimum together

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-03

**Pre-conditions:**

* The invoice is for an HKD settlement and the USD premium rule has a non-zero minimum.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winning bid | USD1 | (fixed fixture): 20% of it is below the minimum |
| minimum premium | USD1 | (fixed configured minimum) |
| exchange rate | 7.85 HKD per USD | · |
| USD sum | USD2.00 | (fixed derived value): `<winning bid>` plus the premium |
| Subtotal | HKD15.70 | (fixed derived value): `<USD sum>` times `<exchange rate>`, converted once |

**Steps:**

1. Read the invoice premium, its lines and its Subtotal.

**Expected Results:**

* The premium is the greater of 20% of `<winning bid>` or `<minimum premium>`, in USD.
* The lines stay in USD and the Subtotal reads `<Subtotal>`, `<USD sum>` converted once at `<exchange rate>` and rounded up to the next cent, not each line converted on its own.

---

## g10.auction-winner-order.US24: Winner chooses the currency they pay in

**As a** winner of a listing bid in USD,
**I want** to settle in USD or HKD when I set the order up,
**so that** I pay in the currency my money is already in.

<!-- trace:case id=g10.auction-winner-order.TC-79a rev=3 covers=g10.auction-winner-order.SC-8c6 -->
### g10.auction-winner-order.US24-TC2: Chosen settlement currency prices the invoice

Runs once per row of **Test data**.

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
* **Trace:** winner-order-US-24

**Pre-conditions:**

* A winner is on order setup with an address and billing address ready.

* The USD winning bid is `<usd winning bid minor units>` minor units, with premium `<usd premium minor units>` minor units.

* The winner order under test is `<winner_order_180_1>`.

**Test data:**

| `<settlement currency>` | `<usd winning bid minor units>` | `<usd premium minor units>` | `<invoice amounts>` |
| --- | ---: | ---: | --- |
| USD | 250000 | 50000 | Winning Bid 250000 USD; Buyer's Premium 50000 USD; total 300000 USD |
| HKD | 250000 | 50000 | Winning Bid 250000 USD; Buyer's Premium 50000 USD; Subtotal 2355000 HKD |

| Field | Value |
| --- | --- |
| winner_order_180_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Choose `<settlement currency>`.
2. Choose a payment method offered for it.
3. Confirm the order setup.
4. Read the invoice currency and order total.

**Expected Results:**

* The invoice shows the amounts `<invoice amounts>`, with no conversion for USD.
* When `<settlement currency>` is HKD, the lines stay in USD and the Subtotal converts their sum once at 7.85, rounded up to the next cent; no HKD amount is printed for a line.

<!-- trace:case id=g10.auction-winner-order.TC-r4x rev=2 covers=g10.auction-winner-order.SC-d84 -->
### g10.auction-winner-order.US24-TC7: A reissue in the other currency prices the new invoice from the USD amounts and leaves the replaced one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-24

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/winner-order/keep-records.spec.ts`

**Pre-conditions:**

* admin(operator with payment-processing) holds `<winner_order_185_1>`, whose pending invoice was sent in HKD for bank transfer on HK Local.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_185_1 | An order won at `<winning bid>`, with a pending HKD invoice and a buyer's premium of 20% of it; bind its identity only | · |
| winning bid | USD100.00 | (fixed derived value), 10000 minor units |
| Subtotal HKD | HKD942.00 | (fixed derived value): `<winning bid>` plus its USD20.00 premium times 7.85, 94200 minor units |

**Steps:**

1. Reissue the invoice in USD, keeping HK Local, with a reason.
2. Read the new invoice's Winning Bid.
3. Read the replaced invoice on the order page, marked Replaced.

**Expected Results:**

* The new invoice's Winning Bid reads `<winning bid>` in USD, with no conversion.
* The replaced invoice still reads its Winning Bid as `<winning bid>` in USD and its Subtotal as `<Subtotal HKD>`.

---

## g10.auction-winner-order.US26: Winner who settles in HKD reads the invoice and receipt with USD lines and an HKD total

**As a** winner who picked HKD,
**I want** my invoice, receipt and receipt letter to list the same USD lines and end in the same HKD Subtotal, fee and Order Total as my Order Summary,
**so that** every document I keep shows what the lot cost in USD and what I paid in HKD.

<!-- trace:case id=g10.auction-winner-order.TC-ac5 rev=4 covers=g10.auction-winner-order.SC-gc6,g10.auction-winner-order.SC-buj,g10.auction-winner-order.SC-ekn,g10.auction-winner-order.SC-bk7,g10.auction-winner-order.SC-tmc -->
### g10.auction-winner-order.US26-TC1: An HKD invoice converts the USD sum once and rounds it up to the cent

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* The USD premium minimum is USD0.
* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_n>`, whose invoice is sent.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_n | An HKD order paid by bank transfer, invoice sent and Pending Payment, with the lines and bank transfer fee of the row; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

| Row | `<usd lines>` | `<bank transfer fee>` | `<subtotal>` | `<fee>` | `<order total>` | `<not this>` |
| --- | --- | --- | --- | --- | --- | --- |
| Exact | Winning Bid USD100.00, Buyer's Premium USD20.00, Shipping & Handling zero | USD0 | HKD942.00 | Free | HKD942.00 | none; a control row whose lines need no rounding |
| Fraction rounds up | USD101.00, USD20.20, USD10.01 | USD0 | HKD1,030.00 | Free | HKD1,030.00 | a Subtotal of HKD1,029.99, which drops the fraction, or HKD1,031.00, the three lines each rounded up to a whole HK$ |
| Five lines | USD150.00, USD30.00, USD49.00, USD20.00, USD2.00 | USD0 | HKD1,970.35 | Free | HKD1,970.35 | a Subtotal of HKD1,972.00, the five lines each rounded up to a whole HK$ |
| Fee converts alone | USD101.00, USD20.20, USD9.92 | USD2.57 | HKD1,029.30 | HKD20.18 | HKD1,049.48 | an Order Total of HKD1,049.47, which converts the fee with the lines |
| Fee beside five lines | USD150.00, USD30.00, USD49.00, USD20.00, USD2.00 | USD2.57 | HKD1,970.35 | HKD20.18 | HKD1,990.53 | an Order Total of HKD1,991.00, rounded up to a whole HK$ |

**Steps:**

1. Click the Invoice link beside the Order summary heading.
2. Open the invoice page.
3. Read its lines, Subtotal, Payment Processing Fee and Order Total.

**Expected Results:**

* The invoice page opens.
* The lines read in USD as `<usd lines>`, and the Winning Bid keeps its USD amount.
* Subtotal reads `<subtotal>`, the USD sum times 7.85, converted once and rounded up to the next cent.
* Payment Processing Fee reads `<fee>`, the `<bank transfer fee>` times 7.85 rounded up to the next cent below the Subtotal, and Free when the fee is zero.
* Order Total reads `<order total>`, the Subtotal plus the fee, with no further rounding.
* No figure reads as `<not this>`.

<!-- trace:case id=g10.auction-winner-order.TC-nf6 rev=5 covers=g10.auction-winner-order.SC-81v,g10.auction-winner-order.SC-g3i,g10.auction-winner-order.SC-dfs -->
### g10.auction-winner-order.US26-TC2: HKD receipt PDF lists the USD lines, the HKD Subtotal, fee and total, and the payment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-26

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/winner-order/keep-records.spec.ts`

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<hkd_order_n>`.
* `<hkd_order_n>` has the payment of the row recorded against its invoice.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_n | An HKD order with the method, lines, rule and payment of the row; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

| Row | `<method>` | `<usd lines>` | `<note>` | `<subtotal>` | `<fee>` | `<order total>` | `<current payment>` | `<previous payments>` | `<remaining balance>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bank transfer, paid in full | Bank transfer on FPS, bank transfer fee USD0 | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | `Converted from US$131.21 at 1 USD = 7.85 HKD` | HKD1,030.00 | Free | HKD1,030.00 | HKD1,030.00 | HKD0.00 | HKD0.00 |
| Card with Tax, paid in full | Card, HKD rule 3.4% plus HKD2.35 | Winning Bid USD150.00, Buyer's Premium USD30.00, Shipping & Handling USD49.00, Insurance USD20.00, Tax USD2.00 | `Converted from US$251.00 at 1 USD = 7.85 HKD` | HKD1,970.35 | HKD71.79 | HKD2,042.14 | HKD2,042.14 | HKD0.00 | HKD0.00 |
| Bank transfer, first part payment | Bank transfer on FPS, bank transfer fee USD0 | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | `Converted from US$131.21 at 1 USD = 7.85 HKD` | HKD1,030.00 | Free | HKD1,030.00 | HKD300.00 | HKD0.00 | HKD730.00 |
| Bank transfer with a fee, paid in full | Bank transfer on FPS, bank transfer fee USD2.57 | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | `Converted from US$131.21 at 1 USD = 7.85 HKD` | HKD1,030.00 | HKD20.18 | HKD1,050.18 | HKD1,050.18 | HKD0.00 | HKD0.00 |

**Steps:**

1. Click the receipt link under the payment-method card and open the receipt for the payment of the row.
2. Read the receipt PDF's lines, Subtotal, the row under it, Payment Processing Fee and Order Total.
3. Read its Original Invoice Total, Previous Payments, Current Payment Received and Remaining Balance Due.

**Expected Results:**

* The receipt PDF opens.
* The lines read in USD as `<usd lines>`, with two decimals and Tax between Insurance and the Subtotal where the row has it.
* Subtotal, Payment Processing Fee and Order Total read `<subtotal>`, `<fee>` and `<order total>` in HKD with two decimals, and the fee reads Free where it is zero.
* Below the lines, Original Invoice Total reads `<order total>`, Previous Payments `<previous payments>`, Current Payment Received `<current payment>` and Remaining Balance Due `<remaining balance>`.
* Directly under Subtotal, above Payment Processing Fee, the note reads `<note>`, drawn muted, its USD figure the sum of the lines above and never counting a bank transfer fee.
* The payment breakdown below the lines carries no note.
* Every figure equals the invoice and the Order Summary.

<!-- trace:case id=g10.auction-winner-order.TC-9dm rev=2 -->
### g10.auction-winner-order.US26-TC3: Order letters of an HKD order name HKD totals and the receipt letter lists the USD lines

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

* Grade10 sent letters about `<winner_order_196_1>`, which is settled in HKD by card and has a sent invoice, paid in full.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_196_1 | An order settled in HKD by card with USD lines of USD150.00, USD30.00, USD49.00, USD20.00 and USD2.00 and an Order Total of HKD2,042.14, paid in full; bind its identity only |

**Steps:**

1. Read each letter Grade10 sent for `<winner_order_196_1>`.

**Expected Results:**

* A letter that names only a total names the Order Total in HKD.
* No letter sent after the winner picked HKD prints a conversion rate, and none that names only a total prints a USD winning bid.
* The payment received letter lists the USD lines, then the HKD Subtotal, Payment Processing Fee and Order Total.
* The won-listing letter, sent at the close before any currency was picked, names the winning bid in US$.

<!-- trace:case id=g10.auction-winner-order.TC-3ly rev=3 covers=g10.auction-winner-order.SC-qtr -->
### g10.auction-winner-order.US26-TC5: The card fee of an HKD order comes from the HKD rule

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-26

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/winner-order/keep-records.spec.ts`

**Pre-conditions:**

* Payment Settings holds a USD card fee rule of 4.4% and USD0.30, and an HKD card fee rule of 3.4% and HK$2.35.
* `<winner_order_198_1>` is settled in HKD by card, with its invoice sent.
* customer(winner) is on `<winner order url>` for `<winner_order_198_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_198_1 | A listing won at USD101.00, with a USD20.20 premium and USD10.01 Shipping & Handling, settled in HKD by card; bind its identity only | · |
| HKD Subtotal | HK$1,030.00 | (fixed derived value): the USD131.21 sum times 7.85, converted once and rounded up to the next cent |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the invoice.
2. Read the card fee and the total.

**Expected Results:**

* The card fee is 3,869 minor units in HKD, the HKD rule's gross-up fee on subtotal `<HKD Subtotal>`.
* The total is 106,869 minor units in HKD, the Subtotal plus the fee.
* The USD rule is not applied.

<!-- trace:case id=g10.auction-winner-order.TC-uz6 rev=3 -->
### g10.auction-winner-order.US26-TC6: A USD sum converts to HKD once, rounded up to the next cent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-26

**Pre-conditions:**

* None.

**Test data:**

| `<usd sum>` | `<hkd subtotal>` | Why this row | Fixture notes |
| --- | --- | --- | --- |
| USD120.00 | HK$942.00 | Exact: 942.00, nothing to round | `<usd sum>`: (fixed boundary) |
| USD131.21 | HK$1,030.00 | 1029.9985 rounds up to the next cent | `<usd sum>`: (fixed boundary) |
| USD0.04 | HK$0.32 | 0.314 rounds up, not to nearest | `<usd sum>`: (fixed boundary) |
| USD0.01 | HK$0.08 | 0.0785 rounds up to the next cent | `<usd sum>`: (fixed boundary) |

**Steps:**

1. Convert `<usd sum>` to HKD once.

**Expected Results:**

* The result is `<hkd subtotal>`.

<!-- trace:case id=g10.auction-winner-order.TC-k5y rev=3 covers=g10.auction-winner-order.SC-ida,g10.auction-winner-order.SC-63n -->
### g10.auction-winner-order.US26-TC7: The note names the conversion rate on the Order Summary and the two PDFs, and nowhere else

**Classification:**

* **Severity:** major
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

* `<winner_order_200_1>` is settled in HKD, its payment is confirmed, and Grade10 sent letters about it.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_200_1 | An order settled in HKD by bank transfer on FPS with USD lines of USD101.00, USD20.20 and USD10.01, a bank transfer fee of USD0 and an invoice of HK$1,030.00, whose payment an operator confirmed; bind its identity only |
| usd_sum | USD131.21 (fixed: the sum of the three USD lines) |

**Steps:**

1. Read the settlement currency choice before picking HKD on a new order.
2. Read Order Summary on `<winner_order_200_1>`.
3. Read its invoice page.
4. Read its invoice PDF from Subtotal down.
5. Read its receipt PDF from Subtotal down.
6. Read the payment reminder and the payment received letter sent for it, and each other letter.

**Expected Results:**

* The Order Summary names the rate in the note under the Subtotal, which names `<usd_sum>` and the rate 1 USD = 7.85 HKD.
* The invoice PDF and the receipt PDF each carry that note directly under Subtotal HK$1,030.00 and above Payment Processing Fee, drawn muted, with the same `<usd_sum>`.
* The settlement currency choice, the invoice page, the payment reminder and each letter name no rate, exchange rate or 7.85.

<!-- trace:case id=g10.auction-winner-order.TC-one rev=2 covers=g10.auction-winner-order.SC-8gv -->
### g10.auction-winner-order.US26-TC8: A bank transfer fee typed in USD converts alone and sits below the Subtotal

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
* **Trace:** winner-order-US-26

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_201_1>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_201_1 | An order settled in HKD by bank transfer on HK Local whose USD lines sum to USD131.21, with bank transfer fee `<bank transfer fee>` typed in USD; bind its identity only | · |
| subtotal | HKD1,030.00 | (fixed derived value), 103000 minor units |
| bank transfer fee | USD50.00 | (fixed boundary or equality), 5000 minor units, which converts to HKD392.50 |
| fee HKD | HKD392.50 | (fixed derived value), 39250 minor units |
| total HKD | HKD1,422.50 | (fixed derived value), 142250 minor units |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Open the invoice.
2. Read the Subtotal, the Payment Processing Fee and the total.

**Expected Results:**

* The Subtotal reads `<subtotal>`, without the fee in the sum.
* The Payment Processing Fee reads `<fee HKD>`, the typed amount converted and rounded up to the next cent, below the Subtotal.
* The total reads `<total HKD>`, the Subtotal plus the fee.
* The lines read in USD, and the Subtotal, fee and total in HKD.

<!-- trace:case id=g10.auction-winner-order.TC-c07 rev=2 covers=g10.auction-winner-order.SC-rsv -->
### g10.auction-winner-order.US26-TC10: Invoice page and PDF list USD lines then HKD Subtotal, fee and total

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

| Row | `<invoice_document>` | `<rate_reading>` |
| --- | --- | --- |
| Page | The invoice page the Invoice link opens | No rate and no conversion note is named anywhere on the page |
| PDF | The invoice PDF the Invoice link opens or downloads | Directly under Subtotal, above Payment Processing Fee, the note `Converted from US$251.00 at 1 USD = 7.85 HKD` reads in the muted style, and no other text names a rate |

**Steps:**

1. Click the Invoice link beside the Order summary heading.
2. Open `<invoice_document>`.
3. Read its item lines, Subtotal, Payment Processing Fee and Order Total.

**Expected Results:**

* `<invoice_document>` opens.
* Item lines read Winning Bid, Buyer's Premium, Shipping & Handling, Insurance and Tax, each in USD with two decimals.
* Subtotal reads `<subtotal_1>` with two decimals, `<usd_sum_1>` times 7.85.
* Payment Processing Fee reads `<fee_1>` and Order Total reads `<total_1>`, both in HKD with two decimals.
* Rate and note on `<invoice_document>`: `<rate_reading>`.
* Every figure equals the Order Summary on Winner Order.

<!-- trace:case id=g10.auction-winner-order.TC-b46 rev=1 covers=g10.auction-winner-order.SC-7q5 -->
### g10.auction-winner-order.US26-TC11: Invoice with Free lines and no Insurance or Tax keeps two decimals

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

<!-- trace:case id=g10.auction-winner-order.TC-q8e rev=1 covers=g10.auction-winner-order.SC-o3a -->
### g10.auction-winner-order.US26-TC13: Reissued invoice is priced once under the rule and the replaced one keeps its amounts

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
3. As admin(holds payment-processing), open the order page and open the replaced `<invoice_1>`, marked Replaced.
4. Read the replaced invoice's lines, Subtotal, fee and total.

**Expected Results:**

* The Order Summary reads Subtotal `<subtotal_3>`, fee `<fee_3>` and Order Total `<total_3>`.
* The note names `<usd_sum_3>`.
* The new invoice says it replaces `<invoice_1>` and prints the same figures as the Order Summary.
* The replaced `<invoice_1>` still prints Subtotal `<subtotal_1>`, fee `<fee_1>` and Order Total `<total_1>`.

---

## g10.auction-winner-order.US27: Winner who settles in HKD reads the Order Summary with USD lines and an HKD total

**As a** winner who picked HKD,
**I want** my Order Summary to list what I won in USD, then one HKD Subtotal converted from their sum, the fee, and the Order Total I will pay,
**so that** I see what the lot cost and check what I pay against the one rate the note names.

<!-- trace:case id=g10.auction-winner-order.TC-vwm rev=6 covers=g10.auction-winner-order.SC-kdr,g10.auction-winner-order.SC-fq4,g10.auction-winner-order.SC-lfi,g10.auction-winner-order.SC-hcb -->
### g10.auction-winner-order.US27-TC1: HKD Order Summary lists the USD lines, one Subtotal with its note, the fee and the Order Total

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/winner-order/keep-us1.spec.ts`

**Pre-conditions:**

* customer(winner settled in HKD) is on `<winner order url>` for `<winner_order_202_1>`, a Pending Payment order whose invoice is sent.
* Payment Settings holds the HKD card rule 3.4% plus HKD2.35.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_202_1 | The HKD order of the row, with its payment method, lines and bank transfer fee; bind its order identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

| Row | `<payment method>` | `<usd lines>` | `<bank transfer fee>` | `<usd sum>` | `<subtotal>` | `<fee>` | `<order total>` | `<not this>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bank transfer | Bank transfer on FPS | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | USD0 | USD131.21 | HKD1,030.00 | Free | HKD1,030.00 | a Subtotal of HKD1,031.00, the lines each rounded up to a whole HK$ |
| Card | Card | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | none | USD131.21 | HKD1,030.00 | HKD38.69 | HKD1,068.69 | a fee of HKD38.73, grossed up from HKD1,031.00 |
| Card with Insurance and Tax | Card | Winning Bid USD150.00, Buyer's Premium USD30.00, Shipping & Handling USD49.00, Insurance USD20.00, Tax USD2.00 | none | USD251.00 | HKD1,970.35 | HKD71.79 | HKD2,042.14 | a Subtotal of HKD1,972.00 and a fee of HKD71.85 |
| Bank transfer with a fee | Bank transfer on FPS | Winning Bid USD150.00, Buyer's Premium USD30.00, Shipping & Handling USD49.00, Insurance USD20.00, Tax USD2.00 | USD2.57 | USD251.00 | HKD1,970.35 | HKD20.18 | HKD1,990.53 | a note naming USD253.57, which counts the fee |

**Steps:**

1. Scroll to the Order Summary.
2. Read its rows from the top down.
3. Read the note under the Subtotal.

**Expected Results:**

* The lines read as `<usd lines>`, in that order, each with the US$ mark and two decimals, as `US$101.00`, and no HKD amount beside it.
* One Subtotal row follows them and reads `<subtotal>`.
* The note under the Subtotal names `<usd sum>` and the rate 1 USD = 7.85 HKD, and the fee adds nothing to its USD figure.
* Payment Processing Fee sits below the Subtotal and reads `<fee>` in HKD, with no USD amount beside it.
* Order Total reads `<order total>`, the Subtotal plus the fee, with no further rounding, and no USD total shows.
* The lot card above still shows the winning bid in USD.
* No row other than the note names the rate.
* No figure reads as `<not this>`.

<!-- trace:case id=g10.auction-winner-order.TC-7qs rev=2 covers=g10.auction-winner-order.SC-59h -->
### g10.auction-winner-order.US27-TC2: USD summary shows one USD total

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/winner-order/keep-us1.spec.ts`

**Pre-conditions:**

* The winner selected USD and the invoice has no converted HKD total.

**Steps:**

1. Read the Order Summary totals.

**Expected Results:**

* The summary shows one USD total.
* It shows no HKD amount, no Subtotal row and no conversion note.

<!-- trace:case id=g10.auction-winner-order.TC-17a rev=2 covers=g10.auction-winner-order.SC-ug0 -->
### g10.auction-winner-order.US27-TC3: The HKD total waits for the invoice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-27

**Pre-conditions:**

* customer(winner) is on `<winner order url>` for `<winner_order_204_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_204_1 | A listing won at USD250 (fixed fixture), settled in HKD, setup confirmed, invoice not sent; bind its identity only |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Read Order Summary.
2. Read the listing card.

**Expected Results:**

* Step 1: no HKD total and no HKD fee shows, and no Subtotal row and no conversion note shows.
* Step 2: the winning bid reads USD250.00, in USD.

<!-- trace:case id=g10.auction-winner-order.TC-xdg rev=1 -->
### g10.auction-winner-order.US27-TC6: Subtotal converts the USD sum once and rounds up to the next cent

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
### g10.auction-winner-order.US27-TC7: Bank transfer fee converts below the Subtotal and stays out of the note

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

<!-- trace:case id=g10.auction-winner-order.TC-oc2 rev=1 covers=g10.auction-winner-order.SC-8t1 -->
### g10.auction-winner-order.US27-TC8: Free shipping, absent Insurance and Tax, and a Free fee still show the Subtotal

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
### g10.auction-winner-order.US27-TC9: Order Summary keeps USD marks and HKD figures in Chinese

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
### g10.auction-winner-order.US27-TC10: Mixed-currency Order Summary and note fit a narrow viewport

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

<!-- trace:case id=g10.auction-winner-order.TC-ewl rev=1 covers=g10.auction-winner-order.SC-ygl -->
### g10.auction-winner-order.US27-TC11: An HKD invoice sent before this layout keeps its stored amounts and reads in the new layout

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

* customer(winner settled in HKD) is on `<winner order url>` for `<old_hkd_order>`.

**Test data:**

| Field | Value |
| --- | --- |
| old_hkd_order | A test order whose HKD invoice was sent before this layout, paid by bank transfer on FPS with the fee empty; it stored the USD lines USD101.00 winning bid, USD20.20 Buyer's Premium and USD10.01 Shipping & Handling as typed, and each line's whole-HK$ amount, HK$793, HK$159 and HK$79 |
| stored_total | HKD1031 (fixed: 793 plus 159 plus 79, each line rounded up when it was sent) |
| repriced_total | HKD1030 (fixed: USD131.21 times 7.85 converted once, the figure a new invoice would read) |
| usd_sum | USD131.21 (fixed: the sum of the three stored USD lines) |

| Field | Value |
| --- | --- |
| winner order url | The URL of the winner order or listing used by this case; bind its URL only |

**Steps:**

1. Scroll to the Order Summary.
2. Read its rows from the top down.
3. Read the note under the Subtotal.

**Expected Results:**

* The rows list the three lines in USD with two decimals, none with an HKD figure beside it.
* A Subtotal row follows them and reads `<stored_total>` with two decimals, not `<repriced_total>`.
* The note under the Subtotal names `<usd_sum>` and the rate, as it does on any invoice.
* Payment Processing Fee reads Free and Order Total reads `<stored_total>`.
* The invoice is not re-priced.

---

## Settled

- The bank transfer fee typed in USD converts alone at 7.85, rounded up to the next cent, below the Subtotal and outside the converted sum; it replaces the line that converts each fee line to a whole HK$ (decisions Q3, Q6).
- An invoice whose USD lines sum to 13121 minor units, with a bank transfer fee of 5000 minor USD units, reads a fee of 39,250 and an Order Total of 142,250 minor HKD units; it replaces the 39,300 and 142,400 line.
- Only the won-listing letter names the winning bid in US$ before the winner picks; after the pick every letter names its total in HKD, and the payment received letter lists the USD lines, then the HKD Subtotal, fee and Order Total; it replaces the line that later letters use only the settlement currency (decisions Q9, Q25).
- Every USD line of the Order Summary reads `US$` with two decimals, and a zero Shipping & Handling reads Free (decisions Q14, Q20).
- The invoice page and the invoice PDF are two surfaces, and each lists the USD lines, then the HKD Subtotal, fee and Order Total (decisions Q21).
- Every receipt, a part-payment receipt included, lists the lines above its running breakdown (decisions Q22).
- Before the invoice is sent an HKD order's Order Summary shows no Subtotal row, no HKD amount and no note (decisions Q17, Q23).
- The invoice PDF and every receipt PDF of an HKD order carry the Order Summary's note directly under the Subtotal, drawn muted, its USD figure the sum of the lines above and never counting a bank transfer fee; the invoice page and every letter name no rate; a USD order's PDFs carry no note (decisions Q8, Q33).

## Reconciliation

**Run:** QA1, blind pass for `convert-hkd-order-at-subtotal`, 2026-10-22. The first blind pass read a bundle whose existing suites were empty and whose PRD pages lacked the product manager's edits, both packaging defects of the coordinator. It was resumed against a corrected bundle, with the real suites and the current PRD, and revised. It read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. It is the run's own statement, not proof.

**Run:** QA1, second blind pass, 2026-10-22. It extended its cases for the operator's order page and the house order, from the frozen anchors, the journeys, `decisions.md` with its Raised table and the PRD, with the same denials as the first pass. It added the case for an invoice sent before this layout. Its files started from the blind state, without the dispositions below. It is the run's own statement, not proof.

**Run:** QA2, second reconciliation pass, 2026-10-22, in a fresh context. It read the repaired deltas of the five capabilities, `tasks.md`, `tech-design.md`, `proposal.md`, the journeys and `decisions.md` through Q31, the PRD sections they cite, and both QA1 passes. It merged QA1's new case into this suite, re-checked every durable case that states an amount or a line, recomputed every minor-unit figure, and wrote no case from a scenario. A case is linked to a scenario when its results assert every outcome the scenario's THEN and ANDs state, from a starting state of the same class and with values from the same partition; a clause a case leaves out keeps the link off and the scenario under Uncovered or Out of suite. It is a statement, not proof.

**Run:** QA2, amendment pass, 2026-10-23, in a fresh context. For the owner's amendment (decisions Q8 revised, Q33: the invoice and receipt PDFs of an HKD order carry the conversion note under the Subtotal) it read the revised winner-order delta, the new `shared/ui/invoice-and-receipt-pdf` delta, `tech-design.md`, `tasks.md` 3.4 to 3.7 and 7.5 to 7.7, `decisions.md` through Q37 and QA1's PDF-block pass, and re-read every case of this suite that mentions a rate, a conversion note or a PDF. It wrote no case from a scenario; a case is linked as in the pass above. It is a statement, not proof.

**Blind cases**

| Case | Disposition |
| --- | --- |
| `US26-TC10` (`TC-c07`) | Kept. The Page row asserts the invoice-page scenario `g10.auction-winner-order.SC5` with its own fixture; the PDF row is the same claim on the PDF. Linked: SC5. Amendment 2026-10-23: its result "no rate and no conversion note is named anywhere in `<invoice_document>`" held for the Page row and contradicted the PDF row; re-issued at `@2` with a `<rate_reading>` column, no note on the page and the note `Converted from US$251.00 at 1 USD = 7.85 HKD` under the PDF's Subtotal. Not linked to SC16, whose lines it does not use |
| `US26-TC11` (`TC-b46`) | Kept. Page and PDF rows assert the free-charge scenario `g10.auction-winner-order.SC6`. Linked: SC6 |
| `US26-TC12` (`TC-9ke`) | Regrouped into `US26-TC2` (`TC-nf6`): the receipt PDF of an HKD order is one surface, one starting state and one route. Its card-with-Tax fixture is row 2 of `TC-nf6`. Dropped; it was never published |
| `US26-TC13` (`TC-q8e`) | Kept and unblocked: decisions Q29 settles the order page the operator reads the replaced invoice on. Linked: `g10.auction-winner-order.SC11`, which a card fixture with a lowered Shipping & Handling line asserts in the same class |
| `US27-TC4` (`TC-xgk`) and `US27-TC5` (`TC-i4z`) | Regrouped into `US27-TC1` (`TC-vwm`) as its third row. Dropped; neither was published |
| `US27-TC6` (`TC-xdg`) | Kept. The rounding partitions on the Order Summary; the requirement holds them as a table and no scenario states them. No link |
| `US27-TC7` (`TC-m5d`) | Kept. The exact and rounds-up partitions of a converted bank fee and the amount due in the bank details dialog. No link |
| `US27-TC8` (`TC-oc2`) | Kept. Asserts every clause of `g10.auction-winner-order.SC10`. Linked: SC10 |
| `US27-TC9` (`TC-qf9`) and `US27-TC10` (`TC-kkw`) | Kept as compatibility cases, Chinese and a narrow viewport. No scenario states either. No link |
| `US27-TC11` (`TC-ewl`) | New in the second pass. Kept. An HKD invoice sent before this layout keeps its stored lines and Subtotal and reads in the new layout (decisions Q12). QA2 added one result: the note names the USD sum as on any invoice, which decisions Q31 settles; the case left the note out while the question was open. Asserts every clause of `g10.auction-winner-order.SC14`. Linked: SC14 |

**Existing durable cases**

Every durable case below is `draft`; each rewrite keeps its marker id and bumps `rev`, so the fold replaces the durable case of the same `TC<m>`.

| Durable case | Verdict | Action |
| --- | --- | --- |
| `US26-TC1` (`TC-ac5@3`) | Contradicted: each line converted to a whole HK$ and summed | Rewritten at `@4` over five rows; links SC-283, SC-284, SC-285, SC1 and SC2 |
| `US26-TC2` (`TC-nf6@3`) | Contradicted: the receipt now lists USD lines | Rewritten at `@4` over three rows, with QA1's `TC12` folded in and a first part payment added; links SC4 and SC12. Amendment 2026-10-23: its result "no rate and no conversion note is printed" contradicts the PDF note; rewritten again at `@5` with a `<note>` column, a fourth row for a bank transfer fee of USD2.57 (the fee adds nothing to the note's figure), and results for the note under Subtotal and none on the breakdown; links SC17 as well |
| `US26-TC3` (`TC-9dm@1`) | Contradicted: "every amount in every letter reads HKD" fails for the receipt letter | Rewritten at `@2` |
| `US26-TC4` (`TC-q56`) | Not moved: a refund reads in HKD (Non-Goals) | Left `draft` |
| `US26-TC5` (`TC-3ly@2`) | Figures move to 3,869 and 106,869 | Rewritten at `@3`; keeps its link to SC-286 |
| `US26-TC6` (`TC-uz6@2`) | Contradicted: rows round to a whole HK$ | Rewritten at `@3` |
| `US26-TC7` (`TC-k5y@1`) | Contradicted: "no surface names a rate" fails for the Order Summary note | Rewritten at `@2` on the fixture of SC13, which names the invoice page and the invoice PDF apart; links SC13. `order-summary-hkd-conversion-note` is retracted, so its duplicate `US26-TC9` and the `TC-7qs` marker clash are gone. Amendment 2026-10-23: its last result put the invoice PDF and the receipt PDF among the surfaces naming no rate; rewritten at `@3` so both carry the note under Subtotal and the page, reminder and letters name none; links SC16 as well, since its invoice PDF read asserts the note on the lines of SC3 |
| `US26-TC8` (`TC-one@1`) | Figures move to 39,250 and 142,250 | Rewritten at `@2`; keeps its link to SC-302 |
| `US27-TC1` (`TC-vwm@4`) | Contradicted: HKD lines with USD beneath | Rewritten at `@6` over four rows; the lines now read with the US$ mark (decisions Q20); links SC-290, SC-304, SC9 and SC8 |
| `US27-TC2` (`TC-7qs@1`) | SC-291 gains "no Subtotal row and no conversion note" | Rewritten at `@2` |
| `US27-TC3` (`TC-17a@1`) | SC-292 adds no Subtotal row, no HKD fee and no note before send | Rewritten at `@2`; keeps its link |
| `US24-TC2` (`TC-79a@2`) | Contradicted: the HKD row lists each line in HKD | Rewritten at `@3` |
| `US24-TC7` (`TC-r4x@1`) | Contradicted: the replaced HKD invoice no longer reads its Winning Bid in HKD | Rewritten at `@2` on the fixture of SC11; unblocked; keeps its link |
| `US8-TC5` (`TC-xji@1`) | Contradicted: each line converted and rounded before summing | Rewritten at `@2` |
| `US1-TC31` (`TC-m21@1`) | Contradicted: Tax of HKD70 on an HKD order | Rewritten at `@2` as a USD order (SC-214), with a step for an HKD order whose Tax reads `US$60.00` (SC-217 rev 2); the link list is unchanged |
| `US1-TC26` (`TC-apy@1`) | The Insurance amount is a bare fixture; SC-169 rev 2 reads it in USD under HKD | Rewritten at `@2` on an HKD order reading `US$40.00`; the link list is unchanged |
| `US1-TC33` (`TC-dvc@1`) | Contradicted: lines of HKD3,280 plus Tax of HKD70 | Rewritten at `@2` with the USD sum of SC-216; the link list is unchanged |
| `US2-TC1` (`TC-h7f@2`) | Contradicted: "the lines sum to the final amount" | Rewritten at `@3`; the link list is unchanged |
| `US1-TC4` (`TC-yuw@1`) | Not moved: both totals are HKD fixtures and none of its assertions changes | Left `draft` |

The legacy `covers` lists on `US1-TC31`, `US1-TC33`, `US2-TC1` and `US1-TC4` name 15 to 70 scenarios each, far more than the cases assert; they are over-claimed and are left for `/tcs-review`.

Walk text that repeats these results stays stale until `/tcs-review` refreshes the walks: Walk 4 steps 11 to 19 (durable lines 877 to 890), Walk 6 step 2 (durable lines 1245 to 1247) and Walk 26 (durable lines 4072 to 4208 and its setup and data blocks). A change suite carries no walk and the fold keeps the durable ones, so the cases are the authority until then.

**Scenario coverage**

| Scenario | Covered by |
| --- | --- |
| SC-283, SC-284, SC-285, SC1, SC2 | `US26-TC1`, one row each |
| SC-286 | `US26-TC5` |
| SC-302 | `US26-TC8` |
| SC-214 | `US1-TC31` |
| SC-216 | `US1-TC33` |
| SC11 | `US26-TC13` |
| SC4, SC12, SC17 | `US26-TC2`, one row each; SC17 is the first and third rows (a full and a part payment of the lines of SC3) |
| SC13, SC16 | `US26-TC7` |
| SC5 | `US26-TC10` |
| SC6 | `US26-TC11` |
| SC-301 | none - restated by a follow-up amendment after `preselect-first-currency-payment-method` |
| SC-290, SC-304, SC9, SC8 | `US27-TC1`, one row each |
| SC-291 | `US27-TC2` |
| SC-292 | `US27-TC3` |
| SC10 | `US27-TC8` |
| SC14 | `US27-TC11` |
| `winner-order-SC-169`, `winner-order-SC-217` (the Insurance and Tax tooltips under HKD) | `US1-TC26`, `US1-TC31` |
| SC-04, SC-287 | Out of suite, in the durable header |
| SC-05, SC-38, SC-39, SC-62, SC-63, SC-69, SC-110, SC-111, SC-215, SC-278, SC-279, SC-280, SC-281, SC-282, SC-300 | Unchanged; they stay with the durable cases |

**Out of suite:** g10.auction-winner-order.SC3, g10.auction-winner-order.SC7, g10.auction-winner-order.SC15, g10.auction-winner-order.SC18, g10.auction-winner-order.SC19, g10.auction-winner-order.SC20

SC3 quotes the lot row of the invoice PDF, with its Total column and a Free fee beside a non-zero shipping line, SC7 a USD order's documents staying in USD, and SC18 that a USD order's invoice and receipt PDFs carry no note and no gap under Subtotal. The block tests of tasks 3.1 and 3.4 to 3.6 in this store (`packages/ui/src/blocks/auction-invoice-and-receipt-pdf/fixtures.test.ts`, `invoice-pdf.test.ts` and `receipt-pdf.test.ts`) and the PDF tests of tasks 7.1 and 7.5 in the application repository (`invoicePdf.test.ts`, `receiptPdf.test.ts`, which hold a USD invoice and receipt without a note) verify the three. No hand case opens a USD order's PDFs; the walk of task 11.1 reads an HKD order's. `US26-TC10` and `TC11` read the same documents by hand. SC15 is an invoice sent before USD facts were stored, which no tester can create now; the breakdown tests of task 6.1 (`invoicePricing.test.ts`, which drops the note when a line has no USD fact) verify it, and `US27-TC11` reads the sibling pre-layout case by hand.

SC19 is the same invoice and its receipt, with no USD fact on a line, drawn without a note and without a gap, and a card order whose fee alone lacks a fact keeping it. No tester can create the first order now, so a link would assert half the scenario; `US26-TC10` (PDF row) and `US26-TC2` (card row) read a card order's invoice and receipt PDFs with the note by hand, which is the second clause only, and carry no link. The note tests of task 7.5 (`invoicePdf.test.ts`, `receiptPdf.test.ts`) verify both clauses, with the breakdown tests of task 6.1. SC20 is a pre-layout HKD invoice, stored Subtotal 103100, whose PDF carries the note beside `HK$1,031.00`; `US27-TC11` reads that order's Order Summary and opens no PDF, and no other hand case opens a pre-layout invoice's PDF. The note test of task 7.5 for a pre-layout invoice verifies it, and task 7.6 wires the note.

**Uncovered**

- None. SC15, SC19 and SC20 are Out of suite below, each with its verifier

**Over-claimed**

- The legacy `covers` lists named above
- `US26-TC2` links SC17 with a first row whose lines and payment are SC17's own and a third row for its part payment, and adds a card row and a fee row that SC17 does not state; `US26-TC7` links SC16 through its invoice PDF read, on the same lines
- `US26-TC13` is linked to SC11 with a fixture of the same class, not SC11's own figures; `US27-TC6` carries outcomes no scenario states, the requirement's table

**Contradictions between the readings**

- None. The disagreement the first pass held, over the separators of the shared block, is settled in the repaired capability

**Anchor coverage**

| Anchor | Cases | Scenarios |
| --- | --- | --- |
| `winner-order-US-26` (documents) | `US26-TC1`, `TC2`, `TC3`, `TC5` to `TC8`, `TC10`, `TC11`, `TC13`; `TC4` is unchanged | All; SC3, SC7, SC18, SC19, SC20 and SC-287 out of suite |
| `winner-order-US-27` (Order Summary) | `US27-TC1` to `TC3`, `TC6` to `TC11` | SC-290, SC-304, SC-291, SC-292, SC8, SC9, SC10 and SC14 covered; SC15, SC19 and SC20 out of suite |
| `winner-order-US-24` (context) | `US24-TC2`, `TC7` | SC-281 covered; SC-301 waits for its follow-up amendment; the rest stay with the durable cases |
| Root group Settlement currency | `US26-TC1`, `TC2`, `TC5`, `TC6`, `TC7`, `TC8`, `TC10`, `TC11`, `TC13` | Convert once, cent rounding, bank fee, rate named in the note only (SC13), same lines on every document, note on the PDFs (SC16, SC17 covered; SC18, SC19, SC20 out of suite) |
| Root group Order summary | `US27-TC1`, `TC2`, `TC3`, `TC8`, `TC11` | All four lines of the group |
| Root group Invoice | `US1-TC33`, `US26-TC5` | Fee base |

**Existing cases the amendment leaves alone**

- `US26-TC1` reads the invoice page and asserts nothing about a rate or a PDF (QA1's "step 5" is not in this suite; the case has three steps), so the note on the PDF does not touch it. `US26-TC3` asserts that no letter prints a rate and that the payment received letter lists the lines; the letters still name none, and the receipt PDF attached to the letter is not read by it. `US26-TC11` reads the Page and PDF rows of a Free-lines order and asserts no rate; its PDF row now carries the note, which none of its results denies. `US27-TC1` to `TC3` and `TC6` to `TC11` read the Order Summary, whose note is unchanged. `US2-TC1` and `US1-TC31` read PDF lines and Tax and say nothing of a note. All stay `draft` at their rev

**Raised**

Q20 to Q23 close four winner-order rows and Q31 the row on the note of a pre-layout invoice; the answers sit in `## Settled`. Q31 sets aside the row's recommendation, no note, because it needs a conversion in the breakdown or a stored marker to special-case test data.
