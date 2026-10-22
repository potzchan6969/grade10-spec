# grade10-site/store/order-detail Test Cases

**Status:** pending-review · 0/23
**Drafts styled:** 2026-09-08, tcs-rules r2

## Walk 1: Read owned-order pictures and accessible item names

**Starting state:**

* customer(signed in as the order's owner) is on the earlier owned order's detail page.
* The order contains the shared-product variants, another product and the blank-alt and meaningful-alt items below.
* Current catalogue titles and prices differ from the recorded purchase facts.
* A previous order read showed the former first picture before the current catalogue change.

**Shared test data:**

| Field | Value |
| --- | --- |
| picture order | The earlier order; two lines name different variants of one product, another names a different product, and three more name the blank-alt products |
| first picture | The shared product's reachable current first picture, changed after purchase and different from its former, second and variant pictures |
| other picture | The other product's reachable current first picture, different from the shared product's |
| supplied alt | The shared product's nonblank catalogue description, different from the recorded title |
| recorded facts | Saved titles, quantities, currencies, prices, totals, status and supplied tracking details |
| blank-alt products | Three products with distinct recorded titles and reachable first pictures; alt text is absent, empty, or spaces and tabs only |
| meaningful-alt product | A further pictured item whose meaningful description differs from its recorded title |
| replacement picture | A reachable first picture replacing the shared product's first picture after this read, distinct from both earlier pictures |

### Route

1. Read the order's items and loaded pictures.
   - Record matching current first pictures in the existing frames. `g10.store-order-detail.US7-TC1`
2. Inspect the shared product's picture name and recorded purchase facts.
   - Record the supplied description and unchanged purchase facts. `g10.store-order-detail.US7-TC1`
3. Inspect blank-alt and meaningful-alt items and their picture names.
   - Record loaded pictures named by recorded titles or the supplied meaningful description. `g10.store-order-detail.US7-TC2`
4. Change the controlled catalogue to use the replacement picture.
5. Reload the same owned-order address.
6. Inspect the shared-product pictures and recorded purchase facts again.
   - Record the loaded replacement picture on both variant lines and unchanged purchase facts. `g10.store-order-detail.US7-TC1`

## g10.store-order-detail.US7: Collector recognises products on an owned order

**As a** signed-in collector inspecting my Store order,
**I want** available current product pictures beside the recorded items,
**so that** I can recognise what I purchased while reading its details.


<!-- trace:case id=g10.store-order-detail.TC-z59 rev=1 covers=g10.store-order-detail.SC-lss,g10.store-order-detail.SC-sdh -->
### g10.store-order-detail.US7-TC1: Current product pictures preserve the recorded purchase

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-order-detail.US7

**Pre-conditions:**

* customer(signed in as the order's owner) is on `/profile/orders/<owned order id>`.
* The customer owns `<picture order>` with the picture fixtures below.
* The current catalogue title and price differ from the recorded purchase facts.
* A previous read showed the former first picture; the catalogue now supplies `<first picture>`.

**Test data:**

| Field | Value |
| --- | --- |
| picture order | An earlier purchase whose products' first pictures changed after purchase and since its previous order read; two recorded lines name different variants of one product, and another line names a different product |
| first picture | The shared product's current first picture, reachable and visibly different from its former first picture, second picture and variant pictures |
| other picture | The other product's current first picture, visibly different from the shared product's picture |
| supplied alt | The shared product's nonblank catalogue alt text, different from the recorded item title |
| recorded facts | The saved titles, quantities, currencies, prices, totals, status and supplied tracking details before picture enrichment |
| owned order id | The immutable Store id of the earlier owned order |
| replacement picture | A reachable first picture replacing the shared product's first picture after this read, distinct from both earlier pictures |

**Steps:**

1. Read the order items in the existing picture frames.
2. Inspect each loaded picture and its accessible name.
3. Compare the displayed purchase facts with `<recorded facts>`.
4. Change the controlled catalogue to use `<replacement picture>`.
5. Reload the same owned-order address.
6. Inspect the shared-product pictures and purchase facts again.

**Expected Results:**

* Both variant lines show `<first picture>`, fully loaded.
* The other product shows `<other picture>`, fully loaded.
* No line shows the former, second or variant picture.
* The shared product's picture uses `<supplied alt>` as its accessible name.
* The displayed facts match `<recorded facts>`.
* Both variant lines load `<replacement picture>` after the reload.
* The reread keeps `<recorded facts>` unchanged.

<!-- trace:case id=g10.store-order-detail.TC-fa0 rev=1 covers=g10.store-order-detail.SC-ut1 -->
### g10.store-order-detail.US7-TC2: Picture names preserve descriptions or use recorded item titles

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
* **Trace:** g10.store-order-detail.US7

**Pre-conditions:**

* customer(signed in as the order's owner) is on the owned order's detail page.
* One owned order contains every `<item>` below.
* Each `<item>` has a different recorded title and a reachable first current picture.
* Each `<item>` supplies `<catalogue alt>` from its row.
* A further pictured item supplies a meaningful description different from its recorded title.

**Test data:**

| `<item>` | `<catalogue alt>` | Partition |
| --- | --- | --- |
| A recorded item with an available picture | Absent | Optional alt field missing |
| A different recorded item with an available picture | Empty string | Present but empty |
| Another recorded item with an available picture | Spaces and tabs only | Present but blank |
| A further recorded item with an available picture | A meaningful description different from its recorded title | Supplied accessible description |

**Steps:**

1. Read each `<item>` in the order.
2. Inspect each picture's accessible name.

**Expected Results:**

* Each picture loads in its existing frame.
* Each blank-alt picture uses that `<item>`'s recorded title.
* The further picture keeps its meaningful supplied description.
* The accessible names contain no blank-only descriptions.

## Ungrouped

### grade10-site-store-order-detail-US1: Collector inspects one owned order

**As a** signed-in collector,
**I want** one trustworthy account of my Store order,
**so that** I can understand its items, money, fulfilment, refund, and tracking.

<!-- trace:case id=g10.store-order-detail.TC-hsn rev=3 covers=g10.store-order-detail.SC-d26,g10.store-order-detail.SC-bjc -->
#### grade10-site-store-order-detail-US1-TC1-3: Owned web order presents supplied settlement facts

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns <web order> with shop order number `#G10-10482`, quoted subtotal 10000, discount 500, shipping 1000, tax 700, and paid total 11200 minor units `HKD`. The order carries items, a complete shipping address, and a recognized Visa instrument with a masked number.

**Steps:**

1. Navigate to `/profile/orders/<web order id>`.
2. Check the order header, items, money summary, shipping address, and payment method.

**Expected Results:**

* <web order> appears with `#G10-10482`, its placed date, status, and items.
* Quoted subtotal shows 10000 minor units `HKD`.
* Discount shows 500 minor units `HKD` as a deduction, shipping shows 1000 minor units `HKD`, and tax shows 700 minor units `HKD`.
* Paid total remains 11200 minor units `HKD` separately.
* The supplied shipping address appears without a pickup claim.
* The Visa logo and masked number identify the supplied payment instrument.

<!-- trace:case id=g10.store-order-detail.TC-c2d rev=2 covers=g10.store-order-detail.SC-a2p -->
#### grade10-site-store-order-detail-US1-TC2-2: Missing and unowned ids share not-found

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The user is signed in; the selected order id is in the state named by **Test data**.

**Test data:**

| Run | Order id state |
| --- | --- |
| 1 | <unknown order id> names no order |
| 2 | <unowned order id> names an order owned by another account |

**Steps:**

1. Navigate to `/profile/orders/<selected order id>`.
2. Check the rendered page.

**Expected Results:**

* The same not-found treatment appears in both runs.
* The page does not say whether the selected id exists.

<!-- trace:case id=g10.store-order-detail.TC-xqg rev=1 covers=g10.store-order-detail.SC-0uc -->
#### grade10-site-store-order-detail-US1-TC3-1: Partial refund stays separate from the charge

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order paid at 11200 minor units `HKD` and refunded by 2000 minor units `HKD`.

**Steps:**

1. Navigate to that order's detail address.
2. Check the money summary.

**Expected Results:**

* Paid total remains 11200 minor units `HKD`.
* Refund shows 2000 minor units `HKD` separately.

<!-- trace:case id=g10.store-order-detail.TC-pvz rev=1 covers=g10.store-order-detail.SC-3mi -->
#### grade10-site-store-order-detail-US1-TC4-1: Point-of-sale order invents no web facts

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns a point-of-sale order with a paid total but no quoted subtotal or line items.

**Steps:**

1. Navigate to that order's detail address.
2. Check the item area and summary.

**Expected Results:**

* Paid total appears.
* No zero subtotal or empty product row appears.
* No payment method or shipping address is invented.

<!-- trace:case id=g10.store-order-detail.TC-ljv rev=1 -->
#### grade10-site-store-order-detail-US1-TC5-1: Missing optional facts leave no placeholders

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order with no payment method, address, discount, shipping charge, tax, product image, or loyalty amount.

**Steps:**

1. Navigate to that order's detail address.
2. Check the order facts and optional sections.

**Expected Results:**

* Available order facts appear.
* Unavailable sections and rows are omitted.
* No placeholder is presented as a known order fact.

<!-- trace:case id=g10.store-order-detail.TC-vqf rev=1 covers=g10.store-order-detail.SC-4bj,g10.store-order-detail.SC-xz6 -->
#### grade10-site-store-order-detail-US1-TC6-1: Delivery estimate and safe tracking stay distinct

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an undelivered order with an estimated delivery date and <safe carrier tracking url>, an absolute `https` URL carrying no credentials.

**Steps:**

1. Navigate to that order's detail address.
2. Check fulfilment progress.
3. Click Track Order.

**Expected Results:**

* The date is identified as an estimate and delivery is not completed.
* <safe carrier tracking url> opens in a new browser context.
* The carrier page has no access to the Grade10 page.

<!-- trace:case id=g10.store-order-detail.TC-9r5 rev=1 covers=g10.store-order-detail.SC-2ah -->
#### grade10-site-store-order-detail-US1-TC7-1: Tracking data without a safe URL stays inactive

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order with a carrier and tracking number but no safe carrier URL.

**Steps:**

1. Navigate to that order's detail address.
2. Check the fulfilment actions.

**Expected Results:**

* Track Order does not appear.

<!-- trace:case id=g10.store-order-detail.TC-etu rev=1 covers=g10.store-order-detail.SC-4lu -->
#### grade10-site-store-order-detail-US1-TC8-1: First detail read remains loading

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The owned-order read is delayed by network manipulation.

**Steps:**

1. Navigate to that order's detail address.
2. Check the page before the read settles.

**Expected Results:**

* A loading state appears.
* The page does not claim the order is missing.

<!-- trace:case id=g10.store-order-detail.TC-azz rev=1 covers=g10.store-order-detail.SC-gzr -->
#### grade10-site-store-order-detail-US1-TC9-1: Failed detail read retries at the same address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The first owned-order read is made to fail and the next read is allowed to complete.

**Steps:**

1. Navigate to that order's detail address.
2. Click Retry after the failure appears.

**Expected Results:**

* A localized error and Retry action appear after the first read.
* Step 2 reads the same order again without changing its address.

<!-- trace:case id=g10.store-order-detail.TC-2si rev=1 covers=g10.store-order-detail.SC-7ci -->
#### grade10-site-store-order-detail-US1-TC10-1: Customer label keeps the Store route id

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order with Store id <store order id> and the shop order number state named by **Test data**.

**Test data:**

| Run | Shop order number | Expected customer label |
| --- | --- | --- |
| 1 | `#G10-10482` | `#G10-10482` |
| 2 | null | <store order id> |
| 3 | empty | <store order id> |

**Steps:**

1. Navigate to `/profile/orders/<store order id>`.
2. Check the order header and browser address.

**Expected Results:**

* The header shows <expected customer label> and invents no other order number.
* The browser remains at `/profile/orders/<store order id>` in every run.

<!-- trace:case id=g10.store-order-detail.TC-r2i rev=1 covers=g10.store-order-detail.SC-gbw -->
#### grade10-site-store-order-detail-US1-TC11-1: Zero settlement rows differ from absent rows

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns two otherwise equivalent paid orders. <stated-zero order> supplies zero discount, shipping, and tax; <unstated order> supplies null for all three.

**Steps:**

1. Open <stated-zero order> and check its money summary.
2. Open <unstated order> and check its money summary.

**Expected Results:**

* Step 1 shows Discount, Shipping, and Tax as stated zeroes.
* Step 2 omits Discount, Shipping, and Tax.
* Each order's paid total remains the charge.

<!-- trace:case id=g10.store-order-detail.TC-f0k rev=1 covers=g10.store-order-detail.SC-cew -->
#### grade10-site-store-order-detail-US1-TC12-1: Partial shipping address draws no blanks

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order whose shipping address supplies address line 1, city, and country, but no recipient, address line 2, province, postal code, or phone.

**Steps:**

1. Navigate to that order's detail address.
2. Check the address section.

**Expected Results:**

* The supplied address line 1, city, and country appear in postal order.
* No blank recipient, placeholder line, or pickup-address claim appears.

<!-- trace:case id=g10.store-order-detail.TC-zfl rev=1 covers=g10.store-order-detail.SC-ik7 -->
#### grade10-site-store-order-detail-US1-TC13-1: Payment presentation preserves provider identity

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order with the payment instrument named by **Test data**.

**Test data:**

| Run | Instrument | Expected presentation |
| --- | --- | --- |
| 1 | Visa company and masked card number | Visa logo and masked number |
| 2 | Apple Pay wallet, Mastercard company, and masked device-account number | Apple Pay identity and masked number together |
| 3 | Unrecognized `UnionPay` company and masked number | `UnionPay` text and masked number, with no unrelated logo |

**Steps:**

1. Navigate to that order's detail address.
2. Check the Payment Method section.

**Expected Results:**

* The section matches <expected presentation>.
* No card or wallet identity is inferred beyond the supplied instrument.

<!-- trace:case id=g10.store-order-detail.TC-khp rev=1 covers=g10.store-order-detail.SC-ik3 -->
#### grade10-site-store-order-detail-US1-TC14-1: Points credit stays distinct from Discount

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order with an order promo discount of 17700 minor units `HKD` and a points credit of 10000 minor units `HKD`.

**Steps:**

1. Open that order's detail.
2. Check the money summary.

**Expected Results:**

* Discount and Points appear as separate deduction rows.
* Points follows Discount.
* The Points label names the 100 points deducted.
* Neither amount is folded into the other.

<!-- trace:case id=g10.store-order-detail.TC-apn rev=1 covers=g10.store-order-detail.SC-usm,g10.store-order-detail.SC-ejb -->
#### grade10-site-store-order-detail-US1-TC15-1: Points credit shows only where the shop named the points discount

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns <order>, paid with 100 points.

**Test data:**

| <order> | Its discounts | Points row |
| --- | --- | --- |
| A | One titled "Points", 10000 minor units `HKD` | 10000 minor units `HKD`, 100 points |
| B | One titled "Deduction from Points", 10000 minor units `HKD` | 10000 minor units `HKD`, 100 points |
| C | One titled "Points off", 10000 minor units `HKD` | None |
| D | None named | None |

**Steps:**

1. Open <order>'s detail.
2. Check the money summary.

**Expected Results:**

* The Points row matches the row's Points row column.
* Where a Points row shows, its label names the 100 points deducted.

---

### grade10-site-store-order-detail-US2: Collector signs in to the requested order

**As a** signed-out collector,
**I want** sign-in to keep the order address I opened,
**so that** I can continue to that order after proving my account.

<!-- trace:case id=g10.store-order-detail.TC-bwy rev=2 covers=g10.store-order-detail.SC-en3 -->
#### grade10-site-store-order-detail-US2-TC1-2: Sign-in preserves the requested order address

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
* **Trace:** grade10-site-store-order-detail-US-02

**Pre-conditions:**
The user has no signed-in session and owns <requested order>.

**Steps:**

1. Navigate to `/profile/orders/<requested order id>`.
2. Complete sign-in.

**Expected Results:**

* The sign-in surface opens without replacing the requested order address.
* Step 2 reads <requested order> at the same address.

### g10.store-order-detail.US7: Collector recognises products on an owned order

**As a** signed-in collector inspecting my Store order,
**I want** available current product pictures beside the recorded items,
**so that** I can recognise what I purchased while reading its details.


<!-- trace:case id=g10.store-order-detail.TC-g0k rev=1 covers=g10.store-order-detail.SC-dn2,g10.store-order-detail.SC-yx8 -->
#### g10.store-order-detail.US7-TC3: Absent pictures keep placeholders beside readable purchases

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-detail.US7

**Pre-conditions:**

* customer(signed in as the order's owner) is at the Store.
* An owned order is available in each `<picture state>` below.
* The recorded titles, quantities, money, status and supplied tracking facts are known before the read.

**Test data:**

| `<picture state>` | Partition |
| --- | --- |
| A current product supplies no picture | Product has no picture |
| A product bought earlier has since been removed and supplies no picture | Product cannot supply a current picture |
| A product bought earlier is no longer published and supplies no picture | Historical product is unavailable to the catalogue read |
| The order response omits optional picture fields entirely | Compatible response predating picture fields |

**Steps:**

1. Navigate to the owned order's detail address for `<picture state>`.
2. Read the affected item and its order facts.

**Expected Results:**

* The order opens with the existing absent-picture placeholder.
* Recorded titles, quantities, money, status and supplied tracking facts remain readable.
* Absent picture fields do not turn the successful read into an error.
* Supplied fulfilment and tracking remain readable.
* The unavailable picture neither removes nor invents a purchase.

<!-- trace:case id=g10.store-order-detail.TC-tt2 rev=1 covers=g10.store-order-detail.SC-3gw -->
#### g10.store-order-detail.US7-TC4: Picture lookup failure leaves the order usable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-order-detail.US7

**Pre-conditions:**

* customer(signed in as the order's owner) is at the Store.
* The owned order read succeeds with known recorded facts and a safe supplied tracking action.
* The picture lookup is mocked to fail for the order's products.

**Test data:**

| Field | Value |
| --- | --- |
| owned order id | The immutable Store id of the owned order |

**Steps:**

1. Navigate to `/profile/orders/<owned order id>`.
2. Read the affected items and order facts.
3. Inspect captured application logs for the failed lookup.
4. Click the order's tracking action.

**Expected Results:**

* The page shows the order rather than an order-read error.
* Affected items retain the existing absent-picture placeholder.
* Recorded item and order facts remain readable.
* The failed picture lookup has a logged failure.
* Tracking still opens its supplied carrier address.

<!-- trace:case id=g10.store-order-detail.TC-wwy rev=1 covers=g10.store-order-detail.SC-x4j -->
#### g10.store-order-detail.US7-TC5: Failed picture resources leave other order facts usable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-order-detail.US7

**Pre-conditions:**

* customer(signed in as the order's owner) is at the Store.
* The order supplies two product pictures and a safe tracking action.
* One picture resource is blocked; the other remains reachable.

**Test data:**

| Field | Value |
| --- | --- |
| owned order id | The immutable Store id of the owned order |

**Steps:**

1. Navigate to `/profile/orders/<owned order id>`.
2. Read the affected order after the picture resource fails.
3. Click its tracking action.

**Expected Results:**

* The reachable picture loads in its existing frame.
* Recorded items, money and order progress remain readable.
* The tracking action still opens its supplied carrier address.
* No order-read error replaces the order.

---

### g10.store-order-detail.US8: Link holder recognises products on a private order

**As a** customer holding a valid private order link,
**I want** the same available current product pictures on that order,
**so that** I can recognise the purchase without signing in.


<!-- trace:case id=g10.store-order-detail.TC-nlq rev=1 covers=g10.store-order-detail.SC-4at -->
#### g10.store-order-detail.US8-TC1: Private order pictures disclose no account facts

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-order-detail.US8

**Pre-conditions:**

* customer(link holder) is at the Store with `<session state>`.
* The customer holds `<private order link>` for `<order kind>`.
* The order has a reachable first current picture and known recorded facts.
* The same picture is recorded from its owner detail as the comparison reference.
* Read-only fixture probes record the order's existing owner and the viewer's account entitlements before the link is opened.

**Test data:**

| `<order kind>` | `<session state>` | `<private order link>` | Partition |
| --- | --- | --- | --- |
| Guest order | Signed out | Valid link, including its secret | A link holder needs no account |
| Member order with account points | Signed out | Valid link, including its secret | Member account facts stay private |
| The same member order | Signed in to another account | The same valid link | A different session receives no owner privileges |

**Steps:**

1. Navigate to `<private order link>`.
2. Read the item pictures and purchase facts.
3. Inspect the summary and account sections.
4. Read the fixture's ownership and account-entitlement probes again.

**Expected Results:**

* The private order opens without requiring sign-in.
* Each supplied current first picture loads beside its recorded item.
* The picture matches the owner-detail reference.
* Recorded purchase facts remain unchanged.
* No Points to Earn, Points Earned or summary Points row appears.
* No wallet or account details appear.
* The order's ownership and viewer's account entitlements match the recorded values.

<!-- trace:case id=g10.store-order-detail.TC-bqs rev=1 covers=g10.store-order-detail.SC-na2 -->
#### g10.store-order-detail.US8-TC2: Inaccessible order addresses reveal no pictures or purchase facts

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-detail.US8

**Pre-conditions:**

* customer is at the Store with `<session state>` from the selected row.
* A real order has a reachable first current product picture.

**Test data:**

| `<order address>` | `<session state>` | Partition |
| --- | --- | --- |
| The real order's private address with an incorrect secret | Signed out | Known order, refused link |
| An unknown order's private address with a secret | Signed out | Missing order |
| The real order's `/profile/orders/<order id>` address | Signed in to another account | Unowned member read |

**Steps:**

1. Navigate to `<order address>`.
2. Inspect the page and its pictures.

**Expected Results:**

* Every row shows the same not-found treatment.
* The page does not disclose whether the selected order exists.
* No order item, product picture or purchase fact is disclosed.

## Settled

- **Picture metadata** - [Decisions Q8](../../../../decisions.md#decisions) keeps malformed upstream catalogue metadata within optional enrichment. Supplied order picture fields remain optional strings; null or non-string values remain invalid typed responses.
- **Partial lookup failure** - [Decisions Q9](../../../../decisions.md#decisions) keeps completed successful batches and leaves only unresolved items pictureless. Both answers are decided by the round from existing sources, not new human decisions.
- **Existing image frame** - A missing picture keeps the existing frame or placeholder. It does not invent a known product image. Resource failure adds no new shared error treatment.

## Reconciliation

**Run:** 2026-10-23. QA1 independently read the frozen anchors, journeys, linked PRDs, proposal, decisions, stripped UI design, existing suites and the domain suite from `/tmp/grade10-order-thumbnail-planning/qa1-input`. Requirements, technical design, scenario covers, QA2 and archives were excluded. QA2 then read both independent drafts and saved every case disposition before adding post-hoc links. Input identities and the complete ledger are in `/tmp/grade10-order-thumbnail-planning/qa2-report.md` and `freeze.json`. Isolation was prompt-enforced; no filesystem isolation is claimed.

**Detail anchor restart:** After the private-link actor was normalized to the customer class, a fresh QA1 read the complete updated detail anchors and original sixteen-case suite from `/tmp/grade10-order-thumbnail-planning/qa1-restart-input`. It produced eight unissued fragments without requirements, technical design or prior QA output. A fresh Dev independently read all 28 detail scenarios, the updated anchors, design and tasks without suites or QA output; it found no material source gap. This focused QA2 rereview reconciles both readings without regenerating the suite. History, shared and domain inputs retain the prior ledger. The fragment dispositions and hashes are in `/tmp/grade10-order-thumbnail-planning/qa2-detail-rereview.md`. These are self-reported reading boundaries, not enforced isolation or runtime evidence.

### Fresh Detail Fragment Dispositions

| Fresh Unissued Fragment | Disposition |
| --- | --- |
| Current product pictures identify earlier order items | Merge the actual controlled change and reload into `g10.store-order-detail.US7-TC1` and its walk. Existing `g10.store-order-detail.US7-TC2` retains all alt partitions. No duplicate case. |
| Unavailable pictures preserve the existing item placeholder | Existing `g10.store-order-detail.US7-TC3` already asserts the four unavailable/legacy rows. |
| Catalogue failure keeps owned order details usable | Existing `g10.store-order-detail.US7-TC4` already asserts readable facts and tracking, plus the diagnostic. |
| Failed image resources leave the owned order usable | Existing `g10.store-order-detail.US7-TC5` already asserts facts and tracking, plus another loaded resource. |
| Valid private links show pictures without account facts | Existing `g10.store-order-detail.US8-TC1` asserts pictures, recorded facts and account omissions for all three session/order rows. Receipt-note/toast visibility stays with guest-checkout Q8 and detail US5; its existing `OrderLinkPage.test.tsx` regression owns that checking. |
| Owner private links continue to the pictured profile order | Guest-checkout Q6, detail US6 and its UI Owner Signed In row own the redirect. Retain `OrderLinkPage.test.tsx` route regression; the destination picture is asserted by `g10.store-order-detail.US7-TC1`. Do not issue a new redirect case here. |
| Picture failures leave private order facts readable | The explicit planned sibling-verification table below names every condition and full checking. Owner cases do not claim private-route execution. |
| Invalid private links disclose no purchases or pictures | Existing `g10.store-order-detail.US8-TC2` asserts nondisclosure. The Store exit stays with the detail PRD Order Link and guest-checkout not-found route, verified in `OrderLinkPage.test.tsx`. |

No fragment is rejected or labeled an executed test. No new marker, scenario link or case ID is added. The one bounded case amendment keeps its purpose, immutable identity, revision and draft/manual status; automation-only testability reflects controlled catalogue data.

### Anchor Coverage

| Journey | Cases | Feature-Set Root Groups |
| --- | --- | --- |
| `grade10-site-store-order-detail-US-01` | Fifteen existing US1 cases | Private order access; Order facts; Page states |
| `grade10-site-store-order-detail-US-02` | Existing US2 case | Private order access |
| `g10.store-order-detail.US7` | Five QA1 cases, reconciled | Product pictures |
| `g10.store-order-detail.US8` | Two QA1 cases, reconciled | Product pictures; Private order access |

All journeys and feature-set root groups have cases. Optional picture data introduces no composed route. The existing history-to-detail handoff stays with the domain suite. There is no new admin journey.

### Case Dispositions Before Post-Hoc Links

The scratch ledger was saved before covers edits. The following records the final comparison against the entire scenario, then each THEN and AND assertion. A case earns multiple links only when its same route and checking assert all linked outcomes. All case identities, revisions and draft/manual status remain unchanged. No case was merged, deprecated, approved or executed. QA2 amendments sharpen unverified draft checking within the same product purpose; none is labeled a blind addition.

| Case | Disposition | Post-Hoc Whole-Scenario Evidence |
| --- | --- | --- |
| `g10.store-order-detail.US7-TC1` | QA2 clarifies the previous-read fixture and fresh restart adds an actual controlled replacement/reload check; same current-picture purpose and identity. | `g10.store-order-detail.SC-lss`, `g10.store-order-detail.SC-sdh` |
| `g10.store-order-detail.US7-TC2` | QA2 adds meaningful-alt checking beside the blank-alt rows. | `g10.store-order-detail.SC-ut1` |
| `grade10-site-store-order-detail-US1-TC1-3` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-d26`, `g10.store-order-detail.SC-bjc` |
| `grade10-site-store-order-detail-US1-TC2-2` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-a2p` |
| `grade10-site-store-order-detail-US1-TC3-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-0uc` |
| `grade10-site-store-order-detail-US1-TC4-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-3mi` |
| `grade10-site-store-order-detail-US1-TC5-1` | Retained original body; only partial absent-facts coverage because points credit is not explicit. No covers claim. | Partial only; no whole-scenario link. |
| `grade10-site-store-order-detail-US1-TC6-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-4bj`, `g10.store-order-detail.SC-xz6` |
| `grade10-site-store-order-detail-US1-TC7-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-2ah` |
| `grade10-site-store-order-detail-US1-TC8-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-4lu` |
| `grade10-site-store-order-detail-US1-TC9-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-gzr` |
| `grade10-site-store-order-detail-US1-TC10-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-7ci` |
| `grade10-site-store-order-detail-US1-TC11-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-gbw` |
| `grade10-site-store-order-detail-US1-TC12-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-cew` |
| `grade10-site-store-order-detail-US1-TC13-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-ik7` |
| `grade10-site-store-order-detail-US1-TC14-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-ik3` |
| `grade10-site-store-order-detail-US1-TC15-1` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-usm`, `g10.store-order-detail.SC-ejb` |
| `grade10-site-store-order-detail-US2-TC1-2` | Retained body; inherited links narrowed to its actual assertions. Legacy classification changes are listed below. | `g10.store-order-detail.SC-en3` |
| `g10.store-order-detail.US7-TC3` | QA2 makes supplied fulfilment/tracking and legacy decoding explicit. | `g10.store-order-detail.SC-dn2`, `g10.store-order-detail.SC-yx8` |
| `g10.store-order-detail.US7-TC4` | QA2 exercises safe tracking after lookup failure. | `g10.store-order-detail.SC-3gw` |
| `g10.store-order-detail.US7-TC5` | Retained resource-failure route and complete tracking check. | `g10.store-order-detail.SC-x4j` |
| `g10.store-order-detail.US8-TC1` | QA2 compares owner-picture reference and unchanged ownership/account entitlements through read-only fixture probes; automation-only testability. | `g10.store-order-detail.SC-4at` |
| `g10.store-order-detail.US8-TC2` | QA2 adds the unowned member-address row to the same nondisclosure checking. | `g10.store-order-detail.SC-na2` |

**Out of suite:** `grade10-site-store-order-detail-SC-07` has partial inherited coverage. Its original fixture does not explicitly omit points credit. Verify the complete absent-facts fixture in `grade10:packages/grade10-store/frontend/src/features/orders/checkout/presentation/projections.test.ts` and `grade10:apps/frontend/grade10/src/pages/orders/OrderDetailsPage.test.tsx` under the retained rich-order regression tasks and final walk. These are named implementation verifiers, not results observed by QA2. The original case body stays intact.

Every new detail scenario has a whole-asserting case after the QA2 amendments. No assertion contradicts a scenario. For new scenarios serving both owner and private-link audiences, the owned-route case proves the visible outcome; private-link page tests in tasks 10.1/10.3 and the task 11.1 walk must repeat missing, blank-alt, lookup-failure, legacy and resource-failure fixtures through `grade10:apps/frontend/grade10/src/pages/orders/OrderLinkPage.test.tsx`. This explicit sibling-route verification preserves link account omissions without combining every path into a blind case.

**Out of suite:** The following private-link sibling fixtures are planned in that existing page test and the task 11.1 controlled browser walk. Each valid link opens without sign-in and omits Points, Points to Earn, Points Earned, wallet and account details. No row is credited as executed or currently automated.

| Private-Link Fixture | Additional Planned Assertions |
| --- | --- |
| No picture, including removed/unpublished product | Existing placeholder; recorded items, money, fulfilment and supplied tracking remain readable. |
| Picture catalogue lookup fails | Existing placeholder and readable facts; safe tracking still opens its supplied address; task 9.1 service/router tests check the diagnostic record. |
| Compatible older response without picture fields | Existing placeholder without decoding/read error; recorded facts remain readable. |
| Supplied image resource fails | Existing browser image presentation; page and recorded facts remain usable; safe tracking still works; no new image-error design. |
| Blank and meaningful alt text | Every blank alt uses its recorded title; meaningful alt survives; successful resources load. |

The shared suite is read-only in this pass. Its inherited broad covers and classification debt are recorded for its owner in the QA2 report. The source repair removed the empty-order clause from the new unavailable-picture scenario; empty-input/no-invention stays technical regression work in tasks 9.1/10.1.

### Technical Verifiers

**Out of suite:** Deduplicated lookup batches, the 250-variant boundary, deadline, upstream metadata failures, completed-batch retention, access-before-enrichment and safe diagnostics are planned in tasks 9.1-9.4. Extend `grade10:packages/grade10-store/backend/test/services/orders/index.test.ts` and `grade10:packages/grade10-store/backend/test/trpc/routers/orders.test.ts`; a focused enrichment test beside the existing order-service tests may own the batch checks. Typed response, legacy and old-client decoding remain with tasks 8.1-8.3. No planned verifier is credited as a current pass.

**Out of suite:** The existing admin customer preview is technical parity. Tasks 9.3/10.3/11.2 verify detail/card images through `grade10:apps/admin/grade10/src/pages/store/StoreOrderPage.test.tsx` and the existing customer components. Backend router tests retain grants, Audit and card personal-data omissions. No staff workflow or collector journey is invented.

### Classification

Legacy Type acceptance is reread as functional because those cases verify order facts. Existing smoke/regression membership stays independent. The permission-refusal case drops the obsolete release set and keeps regression; it does not acquire acceptance membership. The r2 stamp remains: this is reconciliation and classification-only normalization, not whole-file draft regeneration. Current-value property edits preserve identity, revision, review status and automation evidence under Step 5. New cases remain draft/manual; no execution or human classification approval is claimed.

### Manual

Every row awaits the controlled customer-order browser walk in task 11.1. Fault-controlled rows need scripted fixtures. No existing test path or completed old task is credited as current automation evidence.

| Manual | Why |
| --- | --- |
| `g10.store-order-detail.US7-TC1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-detail.US7-TC2` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC1-3` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC2-2` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC3-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC4-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC5-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC6-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC7-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC8-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC9-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC10-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC11-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC12-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC13-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC14-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US1-TC15-1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `grade10-site-store-order-detail-US2-TC1-2` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-detail.US7-TC3` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-detail.US7-TC4` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-detail.US7-TC5` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-detail.US8-TC1` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
| `g10.store-order-detail.US8-TC2` | To be walked in task 11.1, the controlled customer-order browser walk; no automated test currently decides this complete case revision. |
