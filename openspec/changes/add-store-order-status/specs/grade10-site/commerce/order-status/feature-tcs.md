# grade10-site/commerce/order-status Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-commerce-order-status-US1: Collector reads where an order stands

**As a** collector with an order in progress,
**I want** one badge that tells me whether my order is being prepared, on its
way, finished, canceled, or refunded,
**so that** I am never shown a blank status and never shown a status the surface
invented for a combination nobody defined.

<!-- trace:case id=g10.commerce-order-status.TC-oa5 rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5,g10.commerce-order-status.SC-5s3 -->
### grade10-site-commerce-order-status-US1-TC1-1: Each badge reads from the facts that define it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* customer(owns `<order_1>`) is signed in on the staging storefront.
* `<order_1>` is a web order in the staging shop's admin, set to the row's payment, fulfilment and cancellation state.

**Test data:**

| Payment | Fulfilment | Canceled | Badge |
| --- | --- | --- | --- |
| Paid | Unfulfilled | No | Processing |
| Paid | Partially fulfilled | No | Shipped |
| Partially paid | Fulfilled | No | Shipped |
| Paid | Fulfilled | No | Completed |
| Paid | Unfulfilled | Yes | Canceled |
| Refunded in full | Unfulfilled | No | Refunded |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders/<order_1 id>`.
2. Read the order's status badge.

**Expected Results:**

* Step 1: Order Details loads for `<order_1>`.
* Step 2: the badge reads the row's Badge.
* Step 2: the badge is not blank.

<!-- trace:case id=g10.commerce-order-status.TC-9iw rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5,g10.commerce-order-status.SC-5s3 -->
### grade10-site-commerce-order-status-US1-TC5-1: Till sale reads through the same rules as a web order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* customer(owns `<order_2>` and `<order_3>`) is signed in on the staging storefront.
* `<order_2>` is a counter sale through the staging shop's point of sale, set to the row's state.
* `<order_3>` is a web order in the staging shop's admin, set to the same state.

**Test data:**

| Payment | Fulfilment | Badge |
| --- | --- | --- |
| Paid | Unfulfilled | Processing |
| Paid | Fulfilled | Completed |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders/<order_2 id>`.
2. Read the order's status badge.
3. Navigate to `<grade10 site url>/profile/orders/<order_3 id>`.
4. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge.
* Step 4: the badge reads the same as step 2.

<!-- trace:case id=g10.commerce-order-status.TC-ags rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5,g10.commerce-order-status.SC-5s3 -->
### grade10-site-commerce-order-status-US1-TC6-1: Pickup order reads one of the five, never pickup

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* The staging shop offers local pickup at checkout.
* customer(owns `<order_4>`) is signed in on the staging storefront.
* `<order_4>` is a web order with local pickup as its delivery method, set in the staging shop's admin to the row's state.

**Test data:**

| Payment | Fulfilment | Badge |
| --- | --- | --- |
| Paid | Unfulfilled | Processing |
| Paid | Partially fulfilled | Shipped |
| Paid | Fulfilled | Completed |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_4>`'s status badge.
3. Navigate to `<grade10 site url>/profile/orders/<order_4 id>`.
4. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge, not a pickup badge.
* Step 4: the badge reads the row's Badge, not a pickup badge.

<!-- trace:case id=g10.commerce-order-status.TC-ydn rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5,g10.commerce-order-status.SC-5s3 -->
### grade10-site-commerce-order-status-US1-TC9-1: Carrier-reported delivery neither gives nor withholds Completed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-01

**Pre-conditions:**

* customer(owns `<order_5>`) is signed in on the staging storefront.
* `<order_5>` is a web order in the staging shop's admin, in the row's Order state, every fulfilled item carrying a tracking number.
* The carrier reports the row's Carrier status on `<order_5>`'s tracking number.

**Test data:**

| Order state | Carrier status | Badge |
| --- | --- | --- |
| Paid in full, every item fulfilled | In transit | Completed |
| Paid in full, every item fulfilled | Out for delivery | Completed |
| Paid in part, every item fulfilled | Delivered | Shipped |
| Paid in full, one of two items fulfilled | Delivered | Shipped |

**Steps:**

1. Navigate to `<grade10 site url>/profile/orders`.
2. Read `<order_5>`'s status badge.
3. Navigate to `<grade10 site url>/profile/orders/<order_5 id>`.
4. Read the order's status badge.

**Expected Results:**

* Step 2: the badge reads the row's Badge, not the carrier's status.
* Step 4: the badge reads the row's Badge.

<!-- trace:case id=g10.commerce-order-status.TC-fde rev=1 covers=g10.commerce-order-status.SC-qux,g10.commerce-order-status.SC-w9f,g10.commerce-order-status.SC-7vs,g10.commerce-order-status.SC-unk,g10.commerce-order-status.SC-a9h,g10.commerce-order-status.SC-19w,g10.commerce-order-status.SC-ln4,g10.commerce-order-status.SC-5n2,g10.commerce-order-status.SC-r3l,g10.commerce-order-status.SC-oyu,g10.commerce-order-status.SC-3ua,g10.commerce-order-status.SC-hpt,g10.commerce-order-status.SC-hv0,g10.commerce-order-status.SC-4h5,g10.commerce-order-status.SC-5s3 -->
### grade10-site-commerce-order-status-US1-TC12-1: A just-placed web order reads Processing on both pages

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
| Paid, fulfilled, one item refunded | Refunded |
| Paid, one of two items fulfilled | Shipped |

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-03

**Pre-conditions:**

* customer(owns `<order_6>`) is signed in on the staging storefront.
* `<order_6>` is a web order in the staging shop's admin, set to the row's state.

**Test data:**

| Payment | Fulfilment | Canceled | Badge |
| --- | --- | --- | --- |
| Paid | Unfulfilled | No | Processing |
| Partially paid | Fulfilled | No | Shipped |
| Paid | Fulfilled | No | Completed |
| Paid | Unfulfilled | Yes | Canceled |
| Partially refunded | Fulfilled | No | Refunded |

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
### grade10-site-commerce-order-status-US3-TC2-1: An open order's fulfilment or void reaches both pages within the hour

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
* **Trace:** grade10-site-commerce-order-status-US-03

**Pre-conditions:**

* customer(owns `<order_7>`) is signed in on the staging storefront.
* `<order_7>` is a web order in the staging shop, placed at the row's Placed, in the row's State before.

**Test data:**

| Placed | State before | Change in the staging shop's admin | Badge before | Badge after |
| --- | --- | --- | --- | --- |
| Within the last day | Paid, two items, unfulfilled | Fulfil one item | Processing | Shipped |
| Within the last day | Paid, unfulfilled | Fulfil every item | Processing | Completed |
| Within the last day | Payment authorized, unfulfilled | Void the payment | Processing | Canceled |
| 89 days before the run | Paid, unfulfilled | Fulfil every item | Processing | Completed |

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
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-commerce-order-status-US-03

**Pre-conditions:**

* customer(owns `<order_8>`) is signed in on the staging storefront.
* `<order_8>` was placed on staging before this delivery was deployed, and is in the row's state.

**Test data:**

| Payment | Fulfilment | Badge |
| --- | --- | --- |
| Paid | Partially fulfilled | Shipped |
| Partially refunded | Fulfilled | Refunded |
| Paid | Fulfilled | Completed |

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-order-status-US-03

**Pre-conditions:**

* customer(owns `<order_9>`) is signed in on the staging storefront.
* `<order_9>` is a web order in the staging shop, placed at the row's Placed, in the row's State before.

**Test data:**

| Placed | State before | Change in the staging shop's admin | Badge before | Badge after |
| --- | --- | --- | --- | --- |
| Within the last day | Paid, fulfilled | Refund the order in full | Completed | Refunded |
| Within the last day | Paid, fulfilled | Refund one item | Completed | Refunded |
| Within the last day | Paid, one of two items fulfilled | Refund one item | Shipped | Refunded |
| Within the last day | Paid, unfulfilled | Cancel the order, refunding nothing | Processing | Canceled |
| Within the last day | Payment pending, fulfilled | Record the payment in full | Shipped | Completed |
| 91 days before the run | Paid, fulfilled | Refund one item | Completed | Refunded |

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

- Whether Shopify archived an order never decides its badge: the shop does not archive orders, and Completed is every item fulfilled and paid in full.
- An order partly fulfilled and paid reads Shipped: Completed needs every item fulfilled.
- A fulfilled order paid only in part, or not yet paid, reads Shipped with no note: Completed needs it paid in full.
- An expired payment reads Processing with the `payment-expired` note; only a cancellation or a void reads Canceled.
- A canceled order refunded in full carries no note; `awaiting-refund` is for money still to come back.
- A canceled order whose payment was only pending or authorized carries no note; `awaiting-refund` needs money taken.
- A canceled order whose held card payment Shopify voided carries no note; `payment-voided` is for a void on an order still open.
- A held order carrying a partial refund carries `on-hold-partial-refund`, one note naming both.
- A held order refunded in full carries `on-hold`, and a scheduled order carrying a refund carries `scheduled`; a note naming both exists only for a combination the source rows confirm.
- No surface shows the note in this delivery, so no catalog holds its words yet.
- An order staff delete in Shopify stays in Your Orders with the badge it last read.
- Your Orders and Order Details derive the badge from one stored row, so they differ only until Your Orders loads again. An order paid in full, refunded or canceled reaches the row within 5 minutes; any other change to an order not canceled and placed in the last 90 days, a fulfilment or a payment voided or expired included, within the hour, archived in Shopify or not.

## Reconciliation

**Run:** QA2 on 2026-10-08, in a fresh context after QA1's blind redraft without archiving and Dev's amendment (Q28). Joined the 21 cases (20 draft, `US2-TC2-1` deprecated) and the 29 scenarios on the journeys US-01 to US-03 and the Feature set group Secondary note. Read the page, the Your Orders page, the proposal, `decisions.md`, `tech-design.md`, `tasks.md` and the Store Order Status Brief. Every case matches the delta's badge and note rules row by row, and every scenario has a case. Kept every id and version; cases stay draft. Findings: `SC-20` and `SC-22` are retired into `SC-06` and `SC-07`, so no case covers them; `US1-TC13-1` states a rule no scenario carried, folded as `SC-31`; QA1's open question is settled by the brief's D3, folded into `US2-TC3-1`; the Past rule's cases belong to `add-grade10-customer-order-pages`, and one consequence of it is raised for the product owner.

| Finding | Disposition |
| --- | --- |
| `grade10-site-commerce-order-status-SC-01`, `SC-15` | Covered by `US1-TC11-1`; the `status-indeterminate` note of `SC-15` also by `US2-TC1-1` |
| `grade10-site-commerce-order-status-SC-02`, `SC-03` | Covered by `US1-TC1-1` and `US1-TC2-1` |
| `grade10-site-commerce-order-status-SC-04` | Covered by `US2-TC4-1` on both pages; the rule at unit by `US1-TC3-1` |
| `grade10-site-commerce-order-status-SC-05` | Covered by the held, partly refunded row of `US2-TC4-1`; the rule at unit by `US1-TC4-1` |
| `grade10-site-commerce-order-status-SC-23` | Covered by `US2-TC4-1`'s journey; decided at unit by `US1-TC4-1` and the `refunded`, `scheduled` row of `US2-TC1-1`; the e2e walk seeds it (task 6.1) |
| `grade10-site-commerce-order-status-SC-06` | Covered by the Completed rows of `US1-TC1-1` and `US1-TC13-1`, on both pages by `US3-TC1-1`; `SC-20` retired into it (Q28) |
| `grade10-site-commerce-order-status-SC-07` | Covered by the partly fulfilled rows of `US1-TC1-1`, `US1-TC8-1` and `US1-TC13-1`; `SC-22` retired into it (Q28) |
| `grade10-site-commerce-order-status-SC-08` | Covered by `US1-TC1-1` and `US1-TC12-1`; the exhaustive combination test behind it is task 1.1 |
| `grade10-site-commerce-order-status-SC-09`, `SC-11`, `SC-24` to `SC-28` | Covered by `US2-TC1-1`, one row per note rule in the rule's order |
| `grade10-site-commerce-order-status-SC-10` | Covered by the `in_progress` row of `US2-TC3-1` |
| `grade10-site-commerce-order-status-SC-12` | Covered by the Completed row of `US1-TC1-1`, and by `US1-TC9-1` for a carrier still in transit |
| `grade10-site-commerce-order-status-SC-13` | Covered by `US1-TC6-1` and `US1-TC11-1`; the exhaustive combination test is task 1.1 |
| `grade10-site-commerce-order-status-SC-14` | Covered by `US3-TC1-1`, `US3-TC2-1` and `US3-TC3-1`; the backfill behind `US3-TC3-1` is task 3.1 |
| `grade10-site-commerce-order-status-SC-16` | Covered by `US1-TC7-1`, whose fulfilled, paid rows read Completed; return-state letter case by the `returned` row of `US2-TC1-1` |
| `grade10-site-commerce-order-status-SC-17` | Covered by `US1-TC9-1`: same anchor, a fulfilled order where the scenario has an unfulfilled one |
| `grade10-site-commerce-order-status-SC-18` | Covered by the Completed `RETURNED` rows of `US1-TC10-1` and `US2-TC3-1` |
| `grade10-site-commerce-order-status-SC-19` | Covered by `US1-TC5-1` |
| `grade10-site-commerce-order-status-SC-21` | Covered by the `partially_paid` rows of `US1-TC1-1`, `US1-TC8-1` and `US3-TC1-1`, and with no note by `US2-TC3-1`; Q9 and Q28 |
| `grade10-site-commerce-order-status-SC-29` | Covered by `US3-TC4-1`, whose rows add a part refund on a partly fulfilled order, a cancellation, a payment recorded in full and an order older than 90 days, each a change the Freshness clause gives 5 minutes; the webhook mark and the cron read behind it are tasks 3.1 and 6.3 |
| `grade10-site-commerce-order-status-SC-30` | Covered by the void row of `US3-TC2-1`, whose other rows walk a part and a full fulfilment and the 89-day edge, each a change the Freshness clause gives the hour; task 3.1 tests the 55-minute re-read |
| `grade10-site-commerce-order-status-SC-31` | **Folded in** from `US1-TC13-1`, which covers it: the Not read and Conclusion clauses say archiving never decides the badge, and no scenario said so |
| QA1: does a fulfilled order not yet paid in full carry a note? | **Settled** by the brief's D3 and note rule 10, which reads a partial fulfilment only: Shipped with no note. **Folded in:** the `partially_paid`, `pending` and `authorized` fulfilled rows of `US2-TC3-1`. D3 is settled on common storefront practice under Q17, and a no rewrites these rows |
| QA1: archiving never moves the badge | Covered by `US1-TC13-1` and `SC-31`; the e2e cases set no archive state, and their old archiving pre-condition is dropped (Q28) |
| QA1: a just-placed web order on both pages | Covered by `US1-TC12-1`. Its listing wait has no bound: the Your Orders page lists a web checkout once the shop records it and states no time |
| QA1: neither page shows the note | Covered by `US2-TC4-1`; the delta's The note clause lets a surface leave the note out, and Q14 decides that both do in this delivery. The surface that adds the note rewrites the case |
| QA1: Shopify's `IN_PROGRESS` return status | Covered by its row in `US2-TC1-1`: every value but `RETURNED` reads as absent |
| Q29: an order is Past once its badge is Completed or Canceled, or Refunded with payment `refunded` or fulfilment `fulfilled` | **Recorded here, folded elsewhere:** the rule is `grade10-site/store/order-history`'s, in `add-grade10-customer-order-pages`, whose suite owes its cases; task 1.1 tests `orderConcluded` and task 4.1 the grouping |
| QA2: a fulfilled order paid in full, then refunded in part, stays with the active orders for good | **Raised, settled** by Q29: it is past once every item is fulfilled; no case here, because the Past rule is the order-history capability's |
| Earlier runs: Q9, Q14, Q18 to Q27 | **Raised, settled;** their answers are under `## Settled`, amended by Q28 where they named archiving |
| `US2-TC2-1` catalog words for every note | **Dropped:** Q14 - no surface shows the note in this delivery, so no catalog holds its words |
| Rejected cases | none |
| Contradicted readings | none |
| Uncovered anchors | none |
