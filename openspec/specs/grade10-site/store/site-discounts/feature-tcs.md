# grade10-site/store/site-discounts Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-site-discounts-US1: Collector buys a product carrying an active site discount

**As a** collector,
**I want** a product a merchandiser marked down to charge me the marked-down price without needing a code,
**so that** the advertised deal is the price I actually pay, plain and predictable.

### grade10-site-store-site-discounts-US1-TC1-1: Automatic discount reaches the online checkout order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-site-discounts-US-01

**Pre-conditions:**

* <automatic_1> is the only automatic discount active at the shop.
* customer is on <grade10 checkout url> with <product_1> in the cart and no discount code.

**Test data:**

| Field | Value |
| --- | --- |
| <automatic_1> | `ALL 5% OFF`, an automatic discount of 5% off the whole order |
| <product_1> | One HK$100.00 product |

**Steps:**

1. Submit the checkout.
2. Read the order the shop returns.

**Expected Results:**

* The order carries <automatic_1>, taking HK$5.00.

### grade10-site-store-site-discounts-US1-TC2-1: Discount total beside a code is what the shop priced

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-site-discounts-US-01

**Pre-conditions:**

* <automatic> is the only automatic discount active at the shop.
* customer(member) is on <grade10 checkout url> with <basket> in the cart and <code> applied.

**Test data:**

| <automatic> | <code> | <basket> | Shop prices |
| --- | --- | --- | --- |
| `ALL 5% OFF`, 5% off the whole order | `10%-OFF`, 10% off the whole order, not combining with `ALL 5% OFF` | One HK$100.00 product | `10%-OFF` alone, HK$10.00 |
| `ALL 5% OFF`, 5% off the whole order | `QA-SPILL-PROBE`, a fixed HK$500.00 code scoped to the HK$5.00 product, not combining with `ALL 5% OFF` | One HK$5.00 product and one HK$780.00 product | `ALL 5% OFF` alone, HK$39.25; the code set aside |
| 5% off the whole order, combining with order discounts | HK$10.00 off the whole order, combining with order discounts | One HK$100.00 product | both cuts on the order |

**Steps:**

1. Submit the checkout.
2. Read the discounts the shop priced on the order.
3. Read the order's discount total in grade10.

**Expected Results:**

* The shop prices as the row states.
* Grade10's discount total equals the shop's, no amount altered.
* The checkout completes, including when the shop sets the code aside.

---

## grade10-site-store-site-discounts-US2: Shop staff rings up the same discount at the till

**As a** member of shop staff,
**I want** an active site discount to stay on a sale I am ringing up, even when I clear the discounts grade10 put on it,
**so that** a counter customer gets the marked-down price without me remembering or retyping anything.

### grade10-site-store-site-discounts-US2-TC1-1: Clearing a till sale leaves the shop's automatic standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-site-discounts-US-02

**Pre-conditions:**

* `ALL 5% OFF`, 5% off the whole order, is the only automatic discount active at the shop, with its Apply on POS Pro locations switch on.
* admin(shop staff) is at a POS Pro location with a till session open for customer(member).
* The sale holds one HK$100.00 product, shows 訂單折扣 −5% • ALL 5% OFF, and carries 50 of the member's points applied from the Grade10 till panel.

**Test data:**

| <clear> | Confirmation |
| --- | --- |
| 全部移除 | 已從此單移除。 |
| 移除所有折扣 | 此單的優惠碼、會員折扣及員工自行加入的折扣已全部移除，店舖的自動折扣仍然適用。 |

**Steps:**

1. Tap <clear> in the Grade10 till panel's 此單項目 section.
2. Open 管理折扣 on the cart.

**Expected Results:**

* Step 1 shows the row's confirmation.
* The cart still shows 訂單折扣 −5% • ALL 5% OFF.
* 管理折扣 reads 已套用 1 個折扣.
