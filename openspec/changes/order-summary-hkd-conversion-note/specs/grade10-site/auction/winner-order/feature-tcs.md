# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-15, tcs-rules r5
**Out of suite:** winner-order-SC-04, winner-order-SC-05, winner-order-SC-38, winner-order-SC-39, winner-order-SC-62, winner-order-SC-63, winner-order-SC-69, winner-order-SC-96, winner-order-SC-110, winner-order-SC-111, winner-order-SC-180, winner-order-SC-184, winner-order-SC-214, winner-order-SC-215, winner-order-SC-216, winner-order-SC-249, winner-order-SC-257, winner-order-SC-287, winner-order-SC-26, winner-order-SC-27, winner-order-SC-28

## g10.auction-winner-order.US26: Winner who settles in HKD reads the invoice and receipt in HKD

**As a** winner who picked HKD,
**I want** every amount on my invoice, receipt and order letters in HKD,
**so that** I pay and keep records in one currency without working out a rate.

<!-- trace:case id=g10.auction-winner-order.TC-7qs rev=2 covers=g10.auction-winner-order.SC-kdr -->
### g10.auction-winner-order.US26-TC7: Only the Order Summary's note names the conversion rate

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

* `<winner_order_200_1>` is settled in HKD and paid in full, and Grade10 sent letters about it.

**Test data:**

| Field | Value |
| --- | --- |
| winner_order_200_1 | An order settled in HKD whose invoice of HK$2,451 was paid in full; bind its identity only |

**Steps:**

1. Read the settlement currency choice before picking HKD on a new order.
2. Read Order Summary on `<winner_order_200_1>`.
3. Read its invoice.
4. Read its receipt.
5. Read each letter sent for it.

**Expected Results:**

* The Order Summary names the rate once, in the conversion note beneath the Order Total.
* The settlement currency choice, the invoice, the receipt and each letter name no rate, exchange rate or 7.85.

## g10.auction-winner-order.US27: Winner who settles in HKD reads the Order Summary in HKD

**As a** winner who picked HKD,
**I want** my Order Summary in HKD, with the conversion named once under the
total and one HKD total I will pay,
**so that** I check what I won and what it costs me in HKD on one clean list.

<!-- trace:case id=g10.auction-winner-order.TC-vwm rev=5 covers=g10.auction-winner-order.SC-kdr,g10.auction-winner-order.SC-fq4 -->
### g10.auction-winner-order.US27-TC1: HKD summary reads HKD lines with the conversion named under the total

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
* **Trace:** winner-order-US-27

**Pre-conditions:**

* The winner selected HKD and two pending invoices have USD bid, premium and Shipping & Handling lines: one bank-transfer order and one card order.

* Payment Settings uses HKD card rule `<card rule>`.

* The winner order under test is `<winner_order_202_1>`.

**Test data:**

| `<payment method>` | `<usd line facts>` | `<hkd line facts>` | `<usd lines total>` | Fixture notes |
| --- | --- | --- | --- | --- |
| Bank transfer | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | Winning Bid 79,300; Buyer's Premium 15,900; Shipping & Handling 7,900 minor | 13,121 minor | HKD subtotal 103,100 minor |
| Card | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | Winning Bid 79,300; Buyer's Premium 15,900; Shipping & Handling 7,900 minor | 13,121 minor | HKD subtotal 103,100 minor |

| Field | Value |
| --- | --- |
| card rule | 3.4% + 235 minor units |
| card fee | 3873 HKD minor units |
| card amount payable | 106973 HKD minor units |
| hkd subtotal | 103100 HKD minor units |
| note | A note beneath the Order Total naming `<usd lines total>` in USD and the rate 7.85 |
| winner_order_202_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Read each Order Summary line and the Order Total for `<payment method>`.
2. Read the note beneath the Order Total for `<payment method>`.

**Expected Results:**

* Both rows list the bid, premium and Shipping & Handling lines as `<hkd line facts>` in HKD with no USD amount shown.
* The bank-transfer row has no card fee and its Order Total reads `<hkd subtotal>` in HKD.
* The card row shows the Payment Processing Fee of `<card fee>` in HKD with no USD amount; its Order Total reads `<card amount payable>` in HKD and includes the fee.
* Neither row shows a USD total.
* Both rows show `<note>`; it names `<usd lines total>` in USD and the rate, and the card fee adds nothing to the USD figure.

## Settled

- None this run. The display choice was the change's own decision, landed at
  `decisions.md` Q1.

## Reconciliation

**Cases** - `TC-vwm@5` covers the revised `SC-kdr@4` and `SC-fq4@3`: the
summary reads HKD lines with no USD among them, one HKD total, and the note
naming the USD figure and the rate. `TC-7qs@2` covers the revised rate rule
in `SC-kdr`'s requirement: the note is the one surface that names the rate.
`US27-TC2` and `US27-TC3` keep their durable wording, both asserting no note
shows where no converted total exists.

**Scenario coverage** - `SC-kdr` and `SC-fq4` are covered by `TC-vwm`, the
rate sentence by `TC-7qs`. `SC-59h` and `SC-ug0` keep their durable cases.
