# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-14, tcs-rules r5
**Out of suite:** winner-order-SC-04, winner-order-SC-05, winner-order-SC-38, winner-order-SC-39, winner-order-SC-62, winner-order-SC-63, winner-order-SC-69, winner-order-SC-96, winner-order-SC-110, winner-order-SC-111, winner-order-SC-180, winner-order-SC-184, winner-order-SC-214, winner-order-SC-215, winner-order-SC-216, winner-order-SC-249, winner-order-SC-257, winner-order-SC-287, winner-order-SC-26, winner-order-SC-27, winner-order-SC-28

## g10.auction-winner-order.US27: Winner who settles in HKD reads the Order Summary in HKD

**As a** winner who picked HKD,
**I want** my Order Summary in HKD, with the lot's USD figures a switch away
and one HKD total I will pay,
**so that** I check what I won and what it costs me in HKD without the lines
reading twice.

<!-- trace:case id=g10.auction-winner-order.TC-vwm rev=5 covers=g10.auction-winner-order.SC-kdr,g10.auction-winner-order.SC-fq4,g10.auction-winner-order.SC-b8x -->
### g10.auction-winner-order.US27-TC1: HKD summary swaps between HKD lines and the lot's USD figures

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

| `<payment method>` | `<usd line facts>` | `<hkd line facts>` | `<usd total>` | Fixture notes |
| --- | --- | --- | --- | --- |
| Bank transfer | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | Winning Bid 79,300; Buyer's Premium 15,900; Shipping & Handling 7,900 minor | 13,121 minor | HKD subtotal 103,100 minor |
| Card | Winning Bid 10,100; Buyer's Premium 2,020; Shipping & Handling 1,001 minor | Winning Bid 79,300; Buyer's Premium 15,900; Shipping & Handling 7,900 minor | 13,121 minor | HKD subtotal 103,100 minor |

| Field | Value |
| --- | --- |
| card rule | 3.4% + 235 minor units |
| card fee | 3873 HKD minor units |
| card amount payable | 106973 HKD minor units |
| hkd subtotal | 103100 HKD minor units |
| winner_order_202_1 | The winner order prepared with the state and actor conditions in the pre-conditions; bind its order identity only |

**Steps:**

1. Read each Order Summary line and the Order Total for `<payment method>`.
2. Pick USD on the summary's currency control and read them again.
3. Pick HKD and read the Order Total for `<payment method>`.

**Expected Results:**

* On HKD both rows list the bid, premium and Shipping & Handling lines as `<hkd line facts>` in HKD with no USD amount shown.
* On USD each line reads its amount from `<usd line facts>` in USD and Order Total reads `<usd total>` in USD.
* The bank-transfer row has no card fee and its Order Total reads `<hkd subtotal>` in HKD.
* The card row shows the Payment Processing Fee of `<card fee>` in HKD in both views, with no USD figure; its HKD Order Total reads `<card amount payable>` in HKD and includes the fee.

## Settled

- None this run. The display choice was the change's own decision, landed at
  `decisions.md` Q1.

## Reconciliation

**Cases** - `TC-vwm@5` covers the revised `SC-kdr@4` and `SC-fq4@3` and the new
`SC-b8x@1`: the summary is read on HKD, picked to USD and back. `US27-TC2`
still covers `SC-59h@2` and `US27-TC3` still covers `SC-ug0@3`; the new no-
control assertions on both ride their existing steps.

**Scenario coverage** - `SC-kdr`, `SC-fq4` and `SC-b8x` are covered by
`TC-vwm`. `SC-59h` and `SC-ug0` keep their durable cases.
