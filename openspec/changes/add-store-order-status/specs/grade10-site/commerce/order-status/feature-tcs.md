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

---

## grade10-site-commerce-order-status-US2: Collector understands a refund or a hold

**As a** collector whose order was partly refunded or put on hold,
**I want** its badge to report the refund ahead of any shipping, and a held
order as still being prepared,
**so that** I can tell a refund from a shipment, and a held order from a
finished one, without contacting support.

<!-- trace:case id=g10.commerce-order-status.TC-8hx rev=1 covers=g10.commerce-order-status.SC-o4y,g10.commerce-order-status.SC-0st,g10.commerce-order-status.SC-1b0,g10.commerce-order-status.SC-t5o,g10.commerce-order-status.SC-x4g,g10.commerce-order-status.SC-34p,g10.commerce-order-status.SC-zkk,g10.commerce-order-status.SC-7ce,g10.commerce-order-status.SC-cvt,g10.commerce-order-status.SC-zdo,g10.commerce-order-status.SC-er5 -->
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
* **Trace:** grade10-site-commerce-order-status-US-02

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
| No | `paid` | `partially_fulfilled` | absent | Shipped | `some-items-shipped` |
| No | `partially_refunded` | `on_hold` | absent | Processing | `on-hold-partial-refund` |
| No | `paid` | `on_hold` | absent | Processing | `on-hold` |
| No | `paid` | `scheduled` | absent | Processing | `scheduled` |
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

<!-- trace:case id=g10.commerce-order-status.TC-fur rev=1 covers=g10.commerce-order-status.SC-o4y,g10.commerce-order-status.SC-0st,g10.commerce-order-status.SC-1b0,g10.commerce-order-status.SC-t5o,g10.commerce-order-status.SC-x4g,g10.commerce-order-status.SC-34p,g10.commerce-order-status.SC-zkk,g10.commerce-order-status.SC-7ce,g10.commerce-order-status.SC-cvt,g10.commerce-order-status.SC-zdo,g10.commerce-order-status.SC-er5 -->
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

<!-- trace:case id=g10.commerce-order-status.TC-dxg rev=1 covers=g10.commerce-order-status.SC-o4y,g10.commerce-order-status.SC-0st,g10.commerce-order-status.SC-1b0,g10.commerce-order-status.SC-t5o,g10.commerce-order-status.SC-x4g,g10.commerce-order-status.SC-34p,g10.commerce-order-status.SC-zkk,g10.commerce-order-status.SC-7ce,g10.commerce-order-status.SC-cvt,g10.commerce-order-status.SC-zdo,g10.commerce-order-status.SC-er5 -->
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
* **Trace:** grade10-site-commerce-order-status-US-02

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

**Steps:**

1. Resolve the order status for the row's facts.
2. Read the badge.
3. Read the note.

**Expected Results:**

* Step 2: the badge reads the row's Badge.
* Step 3: no note.

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
### grade10-site-commerce-order-status-US3-TC2-1: Both surfaces follow an archive within the hour

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
* `<order_7>` is a web order placed in the last 90 days in the staging shop's admin, paid, fulfilled and not archived.

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_7>`'s status badge.
3. In the staging shop's admin, archive `<order_7>`, and note the time.
4. Reload Your Orders every 5 minutes, for at most 60 minutes, until `<order_7>`'s badge changes.
5. Click View Details on `<order_7>`'s card.
6. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads Shipped.
* Step 4: the badge reads Completed within 60 minutes of step 3.
* Step 5: Order Details opens for `<order_7>`.
* Step 6: the badge reads Completed.

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
### grade10-site-commerce-order-status-US3-TC4-1: Both surfaces follow a refund within 5 minutes

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
* customer(owns `<order_9>`) is signed in on the staging storefront.
* `<order_9>` is a web order in the staging shop's admin, paid, fulfilled and not archived.

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_9>`'s status badge.
3. In the staging shop's admin, refund `<order_9>` in full, and note the time.
4. Reload Your Orders every minute, for at most 5 minutes, until `<order_9>`'s badge changes.
5. Click View Details on `<order_9>`'s card.
6. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads Shipped.
* Step 4: the badge reads Refunded within 5 minutes of step 3.
* Step 5: Order Details opens for `<order_9>`.
* Step 6: the badge reads Refunded.

## Settled

- An order partly fulfilled, paid and archived reads Shipped: Completed needs every item fulfilled.
- A fulfilled, archived order paid only in part reads Shipped: Completed needs it paid in full.
- An expired payment reads Processing with the `payment-expired` note; only a cancellation or a void reads Canceled.
- A canceled order refunded in full carries no note; `awaiting-refund` is for money still to come back.
- A canceled order whose payment was only pending or authorized carries no note; `awaiting-refund` needs money taken.
- A held order carrying a partial refund carries `on-hold-partial-refund`, one note naming both.
- No surface shows the note in this delivery, so no catalog holds its words yet.
- A change to an order Shopify has archived reaches the badge on its next payment, refund, cancellation or shipment, not within the hour.
- Your Orders and Order Details derive the badge from one stored row, so they differ only until Your Orders loads again. An order paid in full, refunded or canceled reaches the row within 5 minutes; any other change, a payment voided or expired included, within the hour, for an order placed in the last 90 days.

## Reconciliation

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the second accept review. Joined the 18 cases (17 blind, and `US3-TC4-1` the accept review added) and the 30 scenarios on the journeys US-01 to US-03 and the Feature set, whose root groups are unchanged and whose leaves now carry Completed as fulfilled, paid and archived, the note, and freshness; read the page, the proposal, `decisions.md`, `tech-design.md` and `tasks.md`, and the grade10 application's interim adapter, fulfilment refresh and webhook topics. Every case matches the delta's badge and note rules row by row, and every scenario has a case. Kept every id and version. Findings: the cron re-read an open order every 60 minutes on a 5-minute tick, so an archive could reach the badge 65 minutes later, and the tech design re-reads at 55 minutes; the hourly read stops once Shopify archives an order, raised as Q24; a void or an expiry arrives on no subscribed webhook, so the page and the Freshness clause give it the hour; the note for a held order carrying a partial refund is reopened as Q22; no case held an unknown value to its default's note, now `US1-TC11-1` does; and a shipment event, not only a payment webhook, reads an order older than 90 days again, now stated in Q23, Q24 and the tech design. Added the shop's archiving setting to the seven e2e cases that set up a paid, fulfilled order still open, because Shopify archives such an order on its own by default (`orderStatus.ts:31-34` in the grade10 application).

| Finding | Disposition |
| --- | --- |
| `grade10-site-commerce-order-status-SC-01`, `SC-15` badge | Covered by `US1-TC11-1` |
| The Defaults clause: an unknown value carries its default's note | **Folded in:** `US1-TC11-1` reads the note beside the badge, and its new unfulfilled row holds an unknown payment to the note `unknown` carries |
| `grade10-site-commerce-order-status-SC-02`, `SC-03` | Covered by `US1-TC1-1` and `US1-TC2-1` |
| `grade10-site-commerce-order-status-SC-04` | Covered by `US1-TC3-1` |
| `grade10-site-commerce-order-status-SC-05`, `SC-23` badge | Covered by `US1-TC4-1` |
| `grade10-site-commerce-order-status-SC-06`, `SC-07`, `SC-08`, `SC-20` | Covered by `US1-TC1-1`; `SC-20` also by `US1-TC8-1`; the exhaustive combination test behind `SC-08` is task 1.1 |
| `grade10-site-commerce-order-status-SC-09`, `SC-11` | Covered by `US2-TC1-1`; `SC-09` badge also by `US1-TC3-1` |
| `grade10-site-commerce-order-status-SC-10` | **Folded in:** the `in_progress` row of `US2-TC3-1` |
| `grade10-site-commerce-order-status-SC-12` | Covered by the Completed row of `US1-TC1-1`, and by `US1-TC9-1` for a carrier that reports delivery |
| `grade10-site-commerce-order-status-SC-13` | Covered by `US1-TC6-1` and `US1-TC11-1`; the exhaustive combination test is task 1.1 |
| `grade10-site-commerce-order-status-SC-14` | Covered by `US3-TC1-1`, `US3-TC2-1` and `US3-TC3-1`; the backfill behind `US3-TC3-1` is task 3.1 |
| `grade10-site-commerce-order-status-SC-16` | Covered by `US1-TC7-1` |
| `grade10-site-commerce-order-status-SC-17` | Covered by `US1-TC9-1`: same anchor, a fulfilled order where the scenario has an unfulfilled one |
| `grade10-site-commerce-order-status-SC-18` | Covered by `US1-TC10-1`; **Folded in:** its no-note row in `US2-TC3-1` |
| `grade10-site-commerce-order-status-SC-19` | Covered by `US1-TC5-1` |
| `grade10-site-commerce-order-status-SC-21`, `SC-22` | **Folded in:** the `partially_paid` and `partially_fulfilled` rows of `US1-TC8-1`; Q9 and Q19 |
| `grade10-site-commerce-order-status-SC-15`, `SC-23` to `SC-28` notes | **Folded in:** `US2-TC1-1` holds one row per note rule, all 18, in the rule's order |
| `grade10-site-commerce-order-status-SC-29` | Covered by `US3-TC4-1`; the webhook mark and the cron read behind it are tasks 3.1 and 6.3 |
| `grade10-site-commerce-order-status-SC-30` | Covered by `US3-TC2-1`. **Fixed in the tech design:** the Open arm and the on-read refresh re-read at 55 minutes, so the 5-minute tick reaches an archive within the 60 minutes the case allows; task 3.1 tests the bound |
| QA2: e2e set-up of a paid, fulfilled order still open | **Folded in:** the shop's archiving setting is a pre-condition of `US1-TC1-1`, `US1-TC6-1`, `US1-TC9-1`, `US3-TC1-1`, `US3-TC2-1`, `US3-TC3-1` and `US3-TC4-1`. A tester cannot reach that state by reopening an archived order, since the stored copy keeps it closed (Q24) |
| QA2: a change to an order Shopify already archived | **Raised, settled:** Q24; the hour covers orders Shopify holds open, so no case asserts a reopened order |
| QA1: partly fulfilled, paid and archived | **Raised, settled:** Q19 |
| QA1: partly paid for Completed | **Raised, settled:** Q9 |
| QA1: expired payment | **Raised, settled:** Q20 |
| QA1: canceled order whose money went back | **Raised, settled** in full by Q21, folded as the canceled `refunded` row of `US2-TC3-1`, and in part by Q18 |
| Accept review: `awaiting-refund` on a canceled order that took no money | **Raised, settled:** Q18; **Folded in:** the canceled `pending` and `authorized` rows of `US2-TC3-1` |
| QA1: held order with a partial refund, which note | **Raised, settled:** Q22; the `on_hold` and `partially_refunded` row of `US2-TC1-1` asserts it |
| QA1: how long the two surfaces may differ | **Raised, settled:** Q23; the page and the delta's Freshness clause hold its bounds, and `US3-TC2-1` and `US3-TC4-1` assert them |
| QA2: a void or an expiry within 5 minutes | **Fixed in the page and the delta:** no subscribed webhook reports one, so it takes the hourly read, the arm `US3-TC2-1` asserts for an archive; Q23 |
| QA2: what reads an order older than 90 days again | **Fixed in `decisions.md` and the tech design:** a payment webhook's mark or a shipment event; Q23, Q24. The page promises nothing for such an order, so no case asserts it |
| `US2-TC2-1` catalog words for every note | **Dropped:** Q14 - no surface shows the note in this delivery, so no catalog holds its words |
| Rejected cases | none |
| Contradicted readings | none |
| Uncovered anchors | none |
