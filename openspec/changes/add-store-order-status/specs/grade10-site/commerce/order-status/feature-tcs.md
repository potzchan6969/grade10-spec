# grade10-site/commerce/order-status Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-commerce-order-status-US1: Collector reads where an order stands

**As a** collector with an order in progress,
**I want** one badge that tells me whether my order is being prepared, on its
way, finished, canceled, or refunded,
**so that** I am never shown a blank status and never shown a status the surface
invented for a combination nobody defined.

<!-- trace:case id=g10.commerce-order-status.TC-oa5 rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC1-1: Each badge reads from the facts that define it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* The staging shop does not archive an order on its own once it is fulfilled and paid.
* customer(owns `<order_1>`) is signed in on the staging storefront.
* `<order_1>` is a web order in the staging shop's admin, set to the row's payment, fulfilment and archive state.

**Test data:**

| Payment | Fulfilment | Archived | Canceled | Badge |
| --- | --- | --- | --- | --- |
| Paid | Unfulfilled | No | No | Processing |
| Paid | Partially fulfilled | No | No | Shipped |
| Paid | Fulfilled | No | No | Shipped |
| Paid | Fulfilled | Yes | No | Completed |
| Paid | Unfulfilled | No | Yes | Canceled |
| Refunded in full | Unfulfilled | No | No | Refunded |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders/<order_1 id>`.
2. Read the order's status badge.

**Expected Results:**

* Step 1: Order Details loads for `<order_1>`.
* Step 2: the badge reads the row's Badge.
* Step 2: the badge is not blank.

<!-- trace:case id=g10.commerce-order-status.TC-93y rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC2-1: Cancellation or void outranks every other fact

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* None.

**Test data:**

| Canceled | Payment | Fulfilment | Archived | Badge |
| --- | --- | --- | --- | --- |
| No | `voided` | `unfulfilled` | No | Canceled |
| No | `voided` | `fulfilled` | Yes | Canceled |
| Yes | `paid` | `fulfilled` | Yes | Canceled |
| Yes | `refunded` | `unfulfilled` | No | Canceled |
| Yes | `partially_refunded` | `on_hold` | No | Canceled |

**Steps:**

1. Resolve the order status for the row's facts.
2. Read the badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge.

<!-- trace:case id=g10.commerce-order-status.TC-3zq rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC3-1: A refund reads ahead of shipping progress

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* None.

**Test data:**

| Payment | Fulfilment | Archived | Badge |
| --- | --- | --- | --- |
| `partially_refunded` | `unfulfilled` | No | Refunded |
| `partially_refunded` | `partially_fulfilled` | No | Refunded |
| `partially_refunded` | `fulfilled` | No | Refunded |
| `partially_refunded` | `fulfilled` | Yes | Refunded |
| `refunded` | `fulfilled` | Yes | Refunded |

The order is not canceled in any row.

**Steps:**

1. Resolve the order status for the row's facts.
2. Read the badge.

**Expected Results:**

* Step 2: the badge reads Refunded, never Shipped or Completed.

<!-- trace:case id=g10.commerce-order-status.TC-yg8 rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC4-1: Held or scheduled order reads Processing, refunded or not

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* None.

**Test data:**

| Payment | Fulfilment | Badge |
| --- | --- | --- |
| `paid` | `on_hold` | Processing |
| `partially_refunded` | `on_hold` | Processing |
| `refunded` | `on_hold` | Processing |
| `paid` | `scheduled` | Processing |
| `partially_refunded` | `scheduled` | Processing |
| `refunded` | `scheduled` | Processing |

The order is neither canceled nor archived in any row.

**Steps:**

1. Resolve the order status for the row's facts.
2. Read the badge.

**Expected Results:**

* Step 2: the badge reads Processing, never Refunded.

<!-- trace:case id=g10.commerce-order-status.TC-9iw rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC5-1: Till sale reads through the same rules as a web order

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
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* customer(owns `<order_2>` and `<order_3>`) is signed in on the staging storefront.
* `<order_2>` is a counter sale through the staging shop's point of sale, set to the row's state.
* `<order_3>` is a web order in the staging shop's admin, set to the same state.

**Test data:**

| Payment | Fulfilment | Archived | Badge |
| --- | --- | --- | --- |
| Paid | Unfulfilled | No | Processing |
| Paid | Fulfilled | Yes | Completed |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders/<order_2 id>`.
2. Read the order's status badge.
3. Navigate to `<grade10 site url>/profile/orders/<order_3 id>`.
4. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge.
* Step 4: the badge reads the same as step 2.

<!-- trace:case id=g10.commerce-order-status.TC-ags rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC6-1: Pickup order reads one of the five, never pickup

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
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* The staging shop offers local pickup at checkout.
* The staging shop does not archive an order on its own once it is fulfilled and paid.
* customer(owns `<order_4>`) is signed in on the staging storefront.
* `<order_4>` is a web order with local pickup as its delivery method, set in the staging shop's admin to the row's state.

**Test data:**

| Payment | Fulfilment | Archived | Badge |
| --- | --- | --- | --- |
| Paid | Unfulfilled | No | Processing |
| Paid | Fulfilled | No | Shipped |
| Paid | Fulfilled | Yes | Completed |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_4>`'s status badge.
3. Navigate to `<grade10 site url>/profile/orders/<order_4 id>`.
4. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge, not a pickup badge.
* Step 4: the badge reads the row's Badge, not a pickup badge.

<!-- trace:case id=g10.commerce-order-status.TC-os8 rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC7-1: Letter case of a fact does not change the badge

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* None.

**Test data:**

| Payment | Fulfilment | Archived | Badge |
| --- | --- | --- | --- |
| `PAID` | `FULFILLED` | Yes | Completed |
| `paid` | `fulfilled` | Yes | Completed |
| `Paid` | `Fulfilled` | Yes | Completed |
| `PARTIALLY_REFUNDED` | `FULFILLED` | No | Refunded |
| `partially_refunded` | `fulfilled` | No | Refunded |
| `PAID` | `ON_HOLD` | No | Processing |
| `VOIDED` | `UNFULFILLED` | No | Canceled |

The order is not canceled in any row.

**Steps:**

1. Resolve the order status for the row's facts.
2. Read the badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge.

<!-- trace:case id=g10.commerce-order-status.TC-40a rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC8-1: Completed is withheld until fulfilled, paid and archived

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* None.

**Test data:**

| Payment | Fulfilment | Archived | Badge |
| --- | --- | --- | --- |
| `paid` | `fulfilled` | No | Shipped |
| `pending` | `fulfilled` | Yes | Shipped |
| `authorized` | `fulfilled` | Yes | Shipped |
| `partially_paid` | `fulfilled` | Yes | Shipped |
| `paid` | `partially_fulfilled` | Yes | Shipped |
| `paid` | `unfulfilled` | Yes | Processing |

The order is not canceled in any row.

**Steps:**

1. Resolve the order status for the row's facts.
2. Read the badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge, not Completed.

<!-- trace:case id=g10.commerce-order-status.TC-ydn rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC9-1: Carrier-reported delivery leaves an unarchived order Shipped

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
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* The staging shop does not archive an order on its own once it is fulfilled and paid.
* customer(owns `<order_5>`) is signed in on the staging storefront.
* `<order_5>` is a web order in the staging shop's admin, paid, fulfilled with a tracking number, and not archived.
* The carrier reports the row's shipment status on `<order_5>`'s tracking number.

**Test data:**

| Carrier status | Badge |
| --- | --- |
| In transit | Shipped |
| Out for delivery | Shipped |
| Delivered | Shipped |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_5>`'s status badge.
3. Navigate to `<grade10 site url>/profile/orders/<order_5 id>`.
4. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads Shipped, not the carrier's status or Completed.
* Step 4: the badge reads Shipped.

<!-- trace:case id=g10.commerce-order-status.TC-ly4 rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC10-1: Return state never moves the badge

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* None.

**Test data:**

| Payment | Fulfilment | Archived | Return state | Badge |
| --- | --- | --- | --- | --- |
| `paid` | `fulfilled` | No | `RETURNED` | Shipped |
| `paid` | `fulfilled` | Yes | `RETURNED` | Completed |
| `paid` | `fulfilled` | No | `RETURN_REQUESTED` | Shipped |
| `partially_refunded` | `fulfilled` | No | `RETURNED` | Refunded |

The order is not canceled in any row.

**Steps:**

1. Resolve the order status for the row's facts with its return state.
2. Read the badge.
3. Resolve the order status for the same facts with no return state.
4. Read the badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge.
* Step 4: the badge reads the same as step 2.

<!-- trace:case id=g10.commerce-order-status.TC-lkv rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC11-1: Missing or unknown fact reads as that fact's default

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* None.

**Test data:**

| Fact | Value given | Other facts |
| --- | --- | --- |
| Payment | absent | `fulfilled`, archived, not canceled |
| Payment | `<a value outside the payment vocabulary>` | `fulfilled`, archived, not canceled |
| Payment | `<a value outside the payment vocabulary>` | `unfulfilled`, not archived, not canceled |
| Fulfilment | absent | `paid`, not archived, not canceled |
| Fulfilment | `<a value outside the fulfilment vocabulary>` | `paid`, not archived, not canceled |
| Archived | absent | `paid`, `fulfilled`, not canceled |
| Canceled | absent | `paid`, `unfulfilled`, not archived |
| Every fact | absent | none |

**Steps:**

1. Resolve the order status for the row's facts.
2. Read the badge.
3. Read the note.
4. Resolve the order status with the row's fact set to its default and the other facts unchanged.
5. Read the badge.
6. Read the note.

**Expected Results:**

* Step 2: the badge is one of Processing, Shipped, Completed, Canceled or Refunded, never blank.
* Step 2: the badge reads the same as step 5.
* Step 3: the note reads the same as step 6, or neither step shows one.

<!-- trace:case id=g10.commerce-order-status.TC-fde rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-nmr,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-9sm,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5 -->
### grade10-site-commerce-order-status-US1-TC12-1: A just-placed web order reads Processing on both pages

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
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* customer(owns `<order_10>`) is signed in on the staging storefront.
* `<order_10>` is a web checkout on the staging storefront, paid by card, completed less than a minute ago.

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Reload every 10 seconds until `<order_10>` is listed.
3. Read `<order_10>`'s status badge.
4. Click View Details on `<order_10>`'s card.
5. Read the order's status badge.

**Expected Results:**

* Step 3: the badge reads Processing, not blank.
* Step 4: Order Details opens for `<order_10>`.
* Step 5: the badge reads Processing.

---

## grade10-site-commerce-order-status-US2: Collector understands a refund or a hold

**As a** collector whose order was partly refunded or put on hold,
**I want** its badge to report the refund ahead of any shipping, and a held
order as still being prepared,
**so that** I can tell a refund from a shipment, and a held order from a
finished one, without contacting support.

<!-- trace:case id=g10.commerce-order-status.TC-8hx rev=1 covers=g10.commerce-order-status.SC-t5o,g10.commerce-order-status.SC-x4g,g10.commerce-order-status.SC-34p,g10.commerce-order-status.SC-zkk,g10.commerce-order-status.SC-7ce,g10.commerce-order-status.SC-cvt,g10.commerce-order-status.SC-zdo,g10.commerce-order-status.SC-er5 -->
### grade10-site-commerce-order-status-US2-TC1-1: A confirmed combination names its one note

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Secondary note

**Pre-conditions:**

* None.

**Test data:**

| Canceled | Payment | Fulfilment | Return state | Badge | Note |
| --- | --- | --- | --- | --- | --- |
| No | `voided` | `unfulfilled` | absent | Canceled | `payment-voided` |
| Yes | `paid` | `unfulfilled` | absent | Canceled | `awaiting-refund` |
| Yes | `partially_paid` | `unfulfilled` | absent | Canceled | `awaiting-refund` |
| Yes | `refunded` | `partially_fulfilled` | absent | Canceled | `canceled-some-items-shipped` |
| No | `partially_refunded` | `fulfilled` | `RETURNED` | Refunded | `items-returned-partial-refund` |
| No | `refunded` | `fulfilled` | `RETURNED` | Refunded | `items-returned` |
| No | `partially_refunded` | `fulfilled` | absent | Refunded | `partial-refund-shipped` |
| No | `partially_refunded` | `partially_fulfilled` | absent | Refunded | `partial-refund-partly-shipped` |
| No | `partially_refunded` | `unfulfilled` | absent | Refunded | `partial-refund-unshipped` |
| No | `refunded` | `fulfilled` | `RETURN_REQUESTED` | Refunded | `refunded-all-items-shipped` |
| No | `refunded` | `fulfilled` | `IN_PROGRESS` | Refunded | `refunded-all-items-shipped` |
| No | `refunded` | `fulfilled` | `returned` | Refunded | `items-returned` |
| No | `paid` | `partially_fulfilled` | absent | Shipped | `some-items-shipped` |
| No | `partially_refunded` | `on_hold` | absent | Processing | `on-hold-partial-refund` |
| No | `paid` | `on_hold` | absent | Processing | `on-hold` |
| No | `refunded` | `on_hold` | absent | Processing | `on-hold` |
| No | `paid` | `scheduled` | absent | Processing | `scheduled` |
| No | `partially_refunded` | `scheduled` | absent | Processing | `scheduled` |
| No | `refunded` | `scheduled` | absent | Processing | `scheduled` |
| No | `expired` | `unfulfilled` | absent | Processing | `payment-expired` |
| No | absent | absent | absent | Processing | `status-indeterminate` |
| No | `partially_paid` | `unfulfilled` | absent | Processing | `partial-payment-received` |
| No | `authorized` | `unfulfilled` | absent | Processing | `payment-authorized` |
| No | `pending` | `unfulfilled` | absent | Processing | `awaiting-payment` |

The order is not archived in any row.

**Steps:**

1. Resolve the order status for the row's facts.
2. Read the badge.
3. Read the note.

**Expected Results:**

* Step 2: the badge reads the row's Badge.
* Step 3: exactly one note identifier, the row's Note.
* Step 3: the note is an identifier, carrying no display words.

<!-- trace:case id=g10.commerce-order-status.TC-fur rev=1 covers=none -->
### grade10-site-commerce-order-status-US2-TC2-1: Every note has words in each catalog language

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-commerce-order-status-US-02

**Pre-conditions:**

* None.

**Steps:**

1. List every note identifier the order status rule can name.
2. Read each identifier from the Grade10 message catalogs in every language Grade10 speaks.

**Expected Results:**

* Step 2: every identifier resolves to words in every language.
* Step 2: no identifier resolves to its own key.

<!-- trace:case id=g10.commerce-order-status.TC-dxg rev=1 covers=g10.commerce-order-status.SC-t5o,g10.commerce-order-status.SC-x4g,g10.commerce-order-status.SC-34p,g10.commerce-order-status.SC-zkk,g10.commerce-order-status.SC-7ce,g10.commerce-order-status.SC-cvt,g10.commerce-order-status.SC-zdo,g10.commerce-order-status.SC-er5 -->
### grade10-site-commerce-order-status-US2-TC3-1: Combination no confirmed note fits carries its badge alone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Secondary note

**Pre-conditions:**

* None.

**Test data:**

| Canceled | Payment | Fulfilment | Archived | Return state | Badge |
| --- | --- | --- | --- | --- | --- |
| No | `paid` | `unfulfilled` | No | absent | Processing |
| No | `paid` | `in_progress` | No | absent | Processing |
| No | `paid` | `fulfilled` | No | absent | Shipped |
| No | `paid` | `fulfilled` | Yes | absent | Completed |
| No | `paid` | `fulfilled` | Yes | `RETURNED` | Completed |
| Yes | `refunded` | `unfulfilled` | No | absent | Canceled |
| Yes | `pending` | `unfulfilled` | No | absent | Canceled |
| Yes | `authorized` | `unfulfilled` | No | absent | Canceled |
| Yes | `partially_refunded` | `unfulfilled` | No | absent | Canceled |
| Yes | `voided` | `unfulfilled` | No | absent | Canceled |

**Steps:**

1. Resolve the order status for the row's facts.
2. Read the badge.
3. Read the note.

**Expected Results:**

* Step 2: the badge reads the row's Badge.
* Step 3: no note.

<!-- trace:case id=g10.commerce-order-status.TC-z0s rev=1 covers=g10.commerce-order-status.SC-o4y,g10.commerce-order-status.SC-0st,g10.commerce-order-status.SC-1b0 -->
### grade10-site-commerce-order-status-US2-TC4-1: A refunded or held order reads its badge on both pages, with no note

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-02

**Pre-conditions:**

* customer(owns `<order_11>`) is signed in on the staging storefront.
* `<order_11>` is a web order in the staging shop's admin, set to the row's state.

**Test data:**

| State in the staging shop's admin | Badge |
| --- | --- |
| Paid, fulfilment on hold | Processing |
| Paid, fulfilment on hold, one item refunded | Processing |
| Paid, fulfilled, one item refunded, not archived | Refunded |
| Paid, one of two items fulfilled, not archived | Shipped |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_11>`'s card around its status badge.
3. Click View Details on `<order_11>`'s card.
4. Read the page around the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge.
* Step 2: no note about the order's state beside or under the badge.
* Step 3: Order Details opens for `<order_11>`.
* Step 4: the badge reads the row's Badge.
* Step 4: no note about the order's state beside or under the badge.

---

## grade10-site-commerce-order-status-US3: Collector sees one answer everywhere

**As a** collector who checks an order in more than one place,
**I want** order history and order detail to agree,
**so that** I do not have to decide which surface is telling the truth.

<!-- trace:case id=g10.commerce-order-status.TC-ql7 rev=1 covers=g10.commerce-order-status.SC-nwz,g10.commerce-order-status.SC-22a,g10.commerce-order-status.SC-s28 -->
### grade10-site-commerce-order-status-US3-TC1-1: Your Orders and Order Details show the same badge

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-03

**Pre-conditions:**

* The staging shop does not archive an order on its own once it is fulfilled and paid.
* customer(owns `<order_6>`) is signed in on the staging storefront.
* `<order_6>` is a web order in the staging shop's admin, set to the row's state.

**Test data:**

| Payment | Fulfilment | Archived | Canceled | Badge |
| --- | --- | --- | --- | --- |
| Paid | Unfulfilled | No | No | Processing |
| Paid | Fulfilled | No | No | Shipped |
| Paid | Fulfilled | Yes | No | Completed |
| Paid | Unfulfilled | No | Yes | Canceled |
| Partially refunded | Fulfilled | No | No | Refunded |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_6>`'s status badge.
3. Click View Details on `<order_6>`'s card.
4. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge.
* Step 3: Order Details opens for `<order_6>`.
* Step 4: the badge reads the same as step 2.

<!-- trace:case id=g10.commerce-order-status.TC-e0j rev=1 covers=g10.commerce-order-status.SC-nwz,g10.commerce-order-status.SC-22a,g10.commerce-order-status.SC-s28 -->
### grade10-site-commerce-order-status-US3-TC2-1: An open order's fulfilment or archive reaches both pages within the hour

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
* **Trace:** grade10-site-commerce-order-status-US-03

**Pre-conditions:**

* The staging shop does not archive an order on its own once it is fulfilled and paid.
* customer(owns `<order_7>`) is signed in on the staging storefront.
* `<order_7>` is a web order in the staging shop, placed at the row's Placed, in the row's State before.

**Test data:**

| Placed | State before | Change in the staging shop's admin | Badge before | Badge after |
| --- | --- | --- | --- | --- |
| Within the last day | Paid, unfulfilled, not archived | Fulfil every item | Processing | Shipped |
| Within the last day | Paid, fulfilled, not archived | Archive the order | Shipped | Completed |
| 89 days before the run | Paid, fulfilled, not archived | Archive the order | Shipped | Completed |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_7>`'s status badge.
3. In the staging shop's admin, make the row's Change on `<order_7>`, and note the time.
4. Reload Your Orders every 5 minutes, for at most 60 minutes, until `<order_7>`'s badge changes.
5. Click View Details on `<order_7>`'s card.
6. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge before.
* Step 4: the badge reads the row's Badge after within 60 minutes of step 3.
* Step 5: Order Details opens for `<order_7>`.
* Step 6: the badge reads the row's Badge after.

<!-- trace:case id=g10.commerce-order-status.TC-wg0 rev=1 covers=g10.commerce-order-status.SC-nwz,g10.commerce-order-status.SC-22a,g10.commerce-order-status.SC-s28 -->
### grade10-site-commerce-order-status-US3-TC3-1: An order placed before this delivery reads by the rule

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-commerce-order-status-US-03

**Pre-conditions:**

* The staging shop does not archive an order on its own once it is fulfilled and paid.
* customer(owns `<order_8>`) is signed in on the staging storefront.
* `<order_8>` was placed on staging before this delivery was deployed, and is in the row's state.

**Test data:**

| Payment | Fulfilment | Archived | Badge |
| --- | --- | --- | --- |
| Paid | Fulfilled | No | Shipped |
| Partially refunded | Fulfilled | No | Refunded |
| Paid | Fulfilled | Yes | Completed |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_8>`'s status badge.
3. Navigate to `<grade10 site url>/profile/orders/<order_8 id>`.
4. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge.
* Step 4: the badge reads the same as step 2.

<!-- trace:case id=g10.commerce-order-status.TC-4f0 rev=1 covers=g10.commerce-order-status.SC-nwz,g10.commerce-order-status.SC-22a,g10.commerce-order-status.SC-s28 -->
### grade10-site-commerce-order-status-US3-TC4-1: A payment, refund or cancellation reaches both pages within 5 minutes

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
* **Trace:** grade10-site-commerce-order-status-US-03

**Pre-conditions:**

* The staging shop does not archive an order on its own once it is fulfilled and paid.
* customer(owns `<order_9>`) is signed in on the staging storefront.
* `<order_9>` is a web order in the staging shop, placed at the row's Placed, in the row's State before.

**Test data:**

| Placed | State before | Change in the staging shop's admin | Badge before | Badge after |
| --- | --- | --- | --- | --- |
| Within the last day | Paid, fulfilled, not archived | Refund the order in full | Shipped | Refunded |
| Within the last day | Paid, fulfilled, not archived | Refund one item | Shipped | Refunded |
| Within the last day | Paid, unfulfilled, not archived | Cancel the order, refunding nothing | Processing | Canceled |
| Within the last day | Payment pending, fulfilled, archived | Record the payment in full | Shipped | Completed |
| Within the last day | Paid, fulfilled, archived | Refund one item | Completed | Refunded |
| 91 days before the run | Paid, fulfilled, not archived | Refund one item | Shipped | Refunded |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_9>`'s status badge.
3. In the staging shop's admin, make the row's Change on `<order_9>`, and note the time.
4. Reload Your Orders every minute, for at most 5 minutes, until `<order_9>`'s badge changes.
5. Click View Details on `<order_9>`'s card.
6. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge before.
* Step 4: the badge reads the row's Badge after within 5 minutes of step 3.
* Step 5: Order Details opens for `<order_9>`.
* Step 6: the badge reads the row's Badge after.

## Settled

- An order partly fulfilled, paid and archived reads Shipped: Completed needs every item fulfilled.
- A fulfilled, archived order paid only in part reads Shipped: Completed needs it paid in full.
- An expired payment reads Processing with the `payment-expired` note; only a cancellation or a void reads Canceled.
- A canceled order refunded in full carries no note; `awaiting-refund` is for money still to come back.
- A canceled order whose payment was only pending or authorized carries no note; `awaiting-refund` needs money taken.
- A canceled order whose held card payment Shopify voided carries no note; `payment-voided` is for a void on an order still open.
- A held order carrying a partial refund carries `on-hold-partial-refund`, one note naming both.
- A held order refunded in full carries `on-hold`, and a scheduled order carrying a refund carries `scheduled`; a note naming both exists only for a combination the source rows confirm.
- No surface shows the note in this delivery, so no catalog holds its words yet.
- A change to an order Shopify has archived reaches the badge on its next payment, refund, cancellation or shipment, not within the hour.
- An order staff delete in Shopify stays in Your Orders with the badge it last read.
- Your Orders and Order Details derive the badge from one stored row, so they differ only until Your Orders loads again. An order paid in full, refunded or canceled reaches the row within 5 minutes; any other change to an open order placed in the last 90 days, a payment voided or expired included, within the hour.

## Reconciliation

**Run:** QA2 on 2026-10-07, in a fresh context after QA1's second blind pass and Dev's re-anchoring. Joined the 20 cases (19 draft, `US2-TC2-1` deprecated) and the 30 scenarios on the journeys US-01 to US-03 and the Feature set group Secondary note, which now anchors the eight note scenarios because no surface shows the note in this delivery (Q14). Read the page, the Your Orders page, the proposal, `decisions.md`, `tech-design.md`, `tasks.md`, and the grade10 application's subscribed Shopify topics. Every case matches the delta's badge and note rules row by row, and every scenario has a case. Kept every id and version; cases stay draft. Findings: `US2-TC1-1` and `US2-TC3-1` assert notes, so they now trace Secondary note and cover its eight scenarios; `US2-TC4-1` covers the three US-02 scenarios and walks the held order carrying a partial refund; deprecated `US2-TC2-1` covers none; and QA1's three open questions are settled as Q25 to Q27.

| Finding | Disposition |
| --- | --- |
| `grade10-site-commerce-order-status-SC-01`, `SC-15` | Covered by `US1-TC11-1`; the `status-indeterminate` note of `SC-15` also by `US2-TC1-1` |
| `grade10-site-commerce-order-status-SC-02`, `SC-03` | Covered by `US1-TC1-1` and `US1-TC2-1` |
| `grade10-site-commerce-order-status-SC-04` | Covered by `US2-TC4-1` on both pages; the rule at unit by `US1-TC3-1` |
| `grade10-site-commerce-order-status-SC-05` | **Folded in:** the held, partly refunded row of `US2-TC4-1`; the rule at unit by `US1-TC4-1` |
| `grade10-site-commerce-order-status-SC-23` | Covered by `US2-TC4-1`'s journey; decided at unit by `US1-TC4-1` and the `refunded`, `scheduled` row of `US2-TC1-1`.; the e2e walk seeds it (task 6.1) |
| `grade10-site-commerce-order-status-SC-06`, `SC-07`, `SC-08`, `SC-20` | Covered by `US1-TC1-1`; `SC-20` also by `US1-TC8-1`; `SC-08` also by `US1-TC12-1`; the exhaustive combination test behind `SC-08` is task 1.1 |
| `grade10-site-commerce-order-status-SC-09`, `SC-11`, `SC-24` to `SC-28` | Covered by `US2-TC1-1`, one row per note rule in the rule's order |
| `grade10-site-commerce-order-status-SC-10` | Covered by the `in_progress` row of `US2-TC3-1` |
| `grade10-site-commerce-order-status-SC-12` | Covered by the Completed row of `US1-TC1-1`, and by `US1-TC9-1` for a carrier that reports delivery |
| `grade10-site-commerce-order-status-SC-13` | Covered by `US1-TC6-1` and `US1-TC11-1`; the exhaustive combination test is task 1.1 |
| `grade10-site-commerce-order-status-SC-14` | Covered by `US3-TC1-1`, `US3-TC2-1` and `US3-TC3-1`; the backfill behind `US3-TC3-1` is task 3.1 |
| `grade10-site-commerce-order-status-SC-16` | Covered by `US1-TC7-1`; return-state letter case by the `returned` row of `US2-TC1-1` |
| `grade10-site-commerce-order-status-SC-17` | Covered by `US1-TC9-1`: same anchor, a fulfilled order where the scenario has an unfulfilled one |
| `grade10-site-commerce-order-status-SC-18` | Covered by `US1-TC10-1` and the archived `RETURNED` row of `US2-TC3-1` |
| `grade10-site-commerce-order-status-SC-19` | Covered by `US1-TC5-1` |
| `grade10-site-commerce-order-status-SC-21`, `SC-22` | Covered by the `partially_paid` and `partially_fulfilled` rows of `US1-TC8-1`; Q9 and Q19 |
| `grade10-site-commerce-order-status-SC-29` | Covered by `US3-TC4-1`, whose rows add a part refund, a cancellation, a payment on an archived order and an order older than 90 days, each a webhook the Freshness clause gives 5 minutes; the webhook mark and the cron read behind it are tasks 3.1 and 6.3 |
| `grade10-site-commerce-order-status-SC-30` | Covered by `US3-TC2-1`, whose rows add a fulfilment and the 89-day edge; task 3.1 tests the 55-minute re-read |
| QA1: a just-placed web order on both pages | Covered by `US1-TC12-1`. Its listing wait has no bound: the Your Orders page lists a web checkout once the shop records it and states no time |
| QA1: neither page shows the note | Covered by `US2-TC4-1`; the delta's The note clause lets a surface leave the note out, and Q14 decides that both do in this delivery. The surface that adds the note rewrites the case |
| QA1: Shopify's `IN_PROGRESS` return status | Covered by its row in `US2-TC1-1`: every value but `RETURNED` reads as absent |
| QA1: a canceled order whose held card payment Shopify voided | **Raised, settled:** Q25; **Folded in:** the canceled `voided` row of `US2-TC3-1` |
| QA1: a held order refunded in full, a scheduled order refunded in part | **Raised, settled:** Q26; **Folded in:** the `refunded`, `on_hold` and `partially_refunded`, `scheduled` rows of `US2-TC1-1` |
| QA1: an order deleted in Shopify after Your Orders listed it | **Raised, settled:** Q27, decided by the build; no case, because this change leaves the listing of a stored order as it is |
| QA2: e2e set-up of a paid, fulfilled order still open | Carried: the shop's archiving setting is a pre-condition of `US1-TC1-1`, `US1-TC6-1`, `US1-TC9-1`, `US3-TC1-1`, `US3-TC2-1`, `US3-TC3-1` and `US3-TC4-1` |
| Earlier runs: Q9, Q14, Q18 to Q24 | **Raised, settled;** their answers are under `## Settled` and in the rows above |
| `US2-TC2-1` catalog words for every note | **Dropped:** Q14 - no surface shows the note in this delivery, so no catalog holds its words |
| Rejected cases | none |
| Contradicted readings | none |
| Uncovered anchors | none |
