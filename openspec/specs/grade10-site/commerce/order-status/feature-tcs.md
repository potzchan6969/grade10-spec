# grade10-site/commerce/order-status Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

**Out of suite (unit):** grade10-site-commerce-order-status-SC-09, grade10-site-commerce-order-status-SC-10, grade10-site-commerce-order-status-SC-11, grade10-site-commerce-order-status-SC-24, grade10-site-commerce-order-status-SC-25, grade10-site-commerce-order-status-SC-26, grade10-site-commerce-order-status-SC-27, grade10-site-commerce-order-status-SC-28 - the note identifier the mapping emits, and its carrying no display copy, which no page shows in this delivery

## Background

* A collector signed in on the staging storefront reads their orders on Your Orders, `<site>/profile/orders`, and one order on Order Details, `<site>/profile/orders/<order id>`. Each order is set to its state in the staging shop's admin, or its point of sale for a counter sale.

## g10.commerce-order-status.US1: Collector reads where an order stands

**As a** collector with an order in progress,
**I want** one badge that tells me whether my order is being prepared, on its
way, finished, canceled, or refunded,
**so that** I am never shown a blank status and never shown a status the surface
invented for a combination nobody defined.

<!-- trace:case id=g10.commerce-order-status.TC-oa5 rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5,g10.commerce-order-status.SC-5s3,g10.commerce-order-status.SC-nwz,g10.commerce-order-status.SC-22a,g10.commerce-order-status.SC-s28 -->
### g10.commerce-order-status.US1-TC1: Each order's badge reads from the facts that define it, alike on both pages

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* The collector owns a web order in `<state>`.

**Test data:**

| `<state>` | `<badge>` |
| --- | --- |
| paid, unfulfilled | Processing |
| paid, one of two items fulfilled | Shipped |
| paid in part, fulfilled | Shipped |
| paid, fulfilled | Completed |
| paid, unfulfilled, canceled | Canceled |
| refunded in full, unfulfilled | Refunded |
| partially refunded, fulfilled | Refunded |
| local pickup, paid, unfulfilled | Processing |
| local pickup, paid, fulfilled | Completed |
| paid in full and fulfilled, the carrier reading in transit or out for delivery | Completed |
| paid in part and fulfilled, the carrier reading delivered | Shipped |
| paid, one of two items fulfilled, the carrier reading delivered | Shipped |
| paid, partially fulfilled, placed before this delivery | Shipped |

**Steps:**

1. Read its badge on Your Orders, then open Order Details and read it there.

**Expected Results:**

* Both read `<badge>`, never blank, never a pickup badge nor the carrier's status.

<!-- trace:case id=g10.commerce-order-status.TC-9iw rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5,g10.commerce-order-status.SC-5s3 -->
### g10.commerce-order-status.US1-TC5: A till sale reads through the same rules as a web order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* The collector owns a counter sale and a web order, both in `<state>`.

**Test data:**

| `<state>` | `<badge>` |
| --- | --- |
| paid, unfulfilled | Processing |
| paid, fulfilled | Completed |

**Steps:**

1. Read each order's badge on Order Details.

**Expected Results:**

* Both read `<badge>`.

<!-- trace:case id=g10.commerce-order-status.TC-fde rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5,g10.commerce-order-status.SC-5s3 -->
### g10.commerce-order-status.US1-TC12: A just-placed web order reads Processing on both pages

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* The collector completed a card checkout on the staging storefront under a minute ago.

**Steps:**

1. Reload Your Orders every 10 seconds until the order is listed, and read its badge.
2. Click View Details, and read the badge.

**Expected Results:**

* Both read Processing, not blank.

---

## g10.commerce-order-status.US2: Collector understands a refund or a hold

**As a** collector whose order was partly refunded or put on hold,
**I want** its badge to report the refund ahead of any shipping, and a held
order as still being prepared,
**so that** I can tell a refund from a shipment, and a held order from a
finished one, without contacting support.

<!-- trace:case id=g10.commerce-order-status.TC-z0s rev=1 covers=g10.commerce-order-status.SC-o4y,g10.commerce-order-status.SC-0st,g10.commerce-order-status.SC-1b0 -->
### g10.commerce-order-status.US2-TC4: A refunded or held order reads its badge on both pages, with no note

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
* **Trace:** grade10-site-commerce-order-status-US-02

**Pre-conditions:**

* The collector owns a web order in `<state>`.

**Test data:**

| `<state>` | `<badge>` |
| --- | --- |
| paid, fulfilment on hold | Processing |
| paid, fulfilment on hold, one item refunded | Processing |
| paid, fulfilled, one item refunded | Refunded |
| paid, one of two items fulfilled | Shipped |

**Steps:**

1. Read the order's card on Your Orders, then Order Details, around the badge.

**Expected Results:**

* Both read `<badge>`, with no note on the order's state beside or under it.

---

## g10.commerce-order-status.US3: Collector sees one answer everywhere

**As a** collector who checks an order in more than one place,
**I want** order history and order detail to agree,
**so that** I do not have to decide which surface is telling the truth.

<!-- trace:case id=g10.commerce-order-status.TC-e0j rev=1 covers=g10.commerce-order-status.SC-nwz,g10.commerce-order-status.SC-22a,g10.commerce-order-status.SC-s28 -->
### g10.commerce-order-status.US3-TC2: A change in the shop reaches both pages within its window

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
* **Trace:** grade10-site-commerce-order-status-US-03

**Pre-conditions:**

* The collector owns a web order placed `<placed>`, in `<before>`.

**Test data:**

| `<placed>` | `<before>` | `<change>` | `<after>` | `<within>` |
| --- | --- | --- | --- | --- |
| in the last day | paid, fulfilled | refund it in full | Refunded | 5 minutes |
| in the last day | paid, fulfilled | refund one item | Refunded | 5 minutes |
| in the last day | paid, one of two items fulfilled | refund one item | Refunded | 5 minutes |
| in the last day | paid, unfulfilled | cancel it, refunding nothing | Canceled | 5 minutes |
| in the last day | payment pending, fulfilled | record the payment in full | Completed | 5 minutes |
| 91 days ago | paid, fulfilled | refund one item | Refunded | 5 minutes |
| in the last day | paid, two items unfulfilled | fulfil one | Shipped | 60 minutes |
| in the last day | paid, unfulfilled | fulfil every item | Completed | 60 minutes |
| in the last day | payment authorized, unfulfilled | void the payment | Canceled | 60 minutes |
| 89 days ago | paid, unfulfilled | fulfil every item | Completed | 60 minutes |

**Steps:**

1. Read its badge on Your Orders.
2. Make `<change>` in the staging shop's admin, noting the time; reload Your Orders until the badge changes.
3. Open Order Details, and read the badge.

**Expected Results:**

* Step 2 reads `<after>` within `<within>` of the change; step 3 reads the same.

## Settled

- An expired payment reads Processing with the `payment-expired` note; only a cancellation or a void reads Canceled.
- A canceled order refunded in full carries no note; `awaiting-refund` is for money still to come back.
- A canceled order whose payment was only pending or authorized carries no note; `awaiting-refund` needs money taken.
- A canceled order whose held card payment Shopify voided carries no note; `payment-voided` is for a void on an order still open.
- A held order carrying a partial refund carries `on-hold-partial-refund`, one note naming both.
- A held order refunded in full carries `on-hold`, and a scheduled order carrying a refund carries `scheduled`; a note naming both exists only for a combination the source rows confirm.
- No surface shows the note in this delivery, so no catalog holds its words yet.
- A change to an order Shopify has archived reaches the badge on its next payment, refund, cancellation or shipment, not within the hour.
- An order staff delete in Shopify stays in Your Orders with the badge it last read.
- Whether Shopify archived an order never decides its badge: the shop does not archive orders, and Completed is every item fulfilled and paid in full.
- An order partly fulfilled and paid reads Shipped: Completed needs every item fulfilled.
- A fulfilled order paid only in part, or not yet paid, reads Shipped with no note: Completed needs it paid in full.
- Your Orders and Order Details derive the badge from one stored row, so they differ only until Your Orders loads again. An order paid in full, refunded or canceled reaches the row within 5 minutes; any other change to an order not canceled and placed in the last 90 days, a fulfilment or a payment voided or expired included, within the hour, archived in Shopify or not.
