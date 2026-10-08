# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/143
**Drafts styled:** 2026-10-05, tcs-rules r4

## post-sale-US1: Operator works the orders worklist by segment

**As an** auction operator,
**I want** every won lot's order in one worklist, split into segments with counts and searchable by any of its codes or the winner's email,
**so that** I open what needs me first without scanning orders that are waiting on the winner.

<!-- trace:case id=g10adm.auction-post-sale.TC-tb3 rev=1 covers=g10adm.auction-post-sale.SC-r6h,g10adm.auction-post-sale.SC-1yv,g10adm.auction-post-sale.SC-fxm,g10adm.auction-post-sale.SC-r3o,g10adm.auction-post-sale.SC-05a,g10adm.auction-post-sale.SC-71a,g10adm.auction-post-sale.SC-9oe,g10adm.auction-post-sale.SC-88b,g10adm.auction-post-sale.SC-cnh,g10adm.auction-post-sale.SC-8dq -->
### post-sale-US1-TC1-1: Other queue outcomes remain available

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* Orders holds orders in the existing outcomes, and one Refunded order.
* admin(holds refund-processing) is on Orders under `/auction`.

**Steps:**

1. Read the outcome list.
2. Read the outcome filters.

**Expected Results:**

* Steps 1 and 2 keep existing outcomes and add Refunded.

### post-sale-US1-TC2-1: Filtering by Payment Verifying lists only those orders

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <count> orders are Payment Verifying; others are Pending Payment.

**Test data:**

| <count> |
| --- |
| 0 |
| 1 |
| 3 |

**Steps:**

1. Filter the queue to Payment Verifying.

**Expected Results:**

* Exactly <count> rows show, all Payment Verifying.

### post-sale-US1-TC3-1: The treatment follows the order after the check

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <order_1> was Payment Verifying, then an operator <action>.

**Test data:**

| <action> | <outcome> | <flag> |
| --- | --- | --- |
| confirmed it | Preparing Shipment | shown |
| returned it, deadline not passed | Pending Payment | not shown |

**Steps:**

1. Find the <order_1> row.

**Expected Results:**

* The outcome reads <outcome>.
* Needs action is <flag>.

### post-sale-US1-TC5-1: The queue search finds an order by any of its identifiers

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <order_1> is on listing `LK7P2Q`; its invoice `INV-202609-LK7P2Q-01` was replaced by `INV-202609-LK7P2Q-02`.

**Test data:**

| <term> |
| --- |
| `LK7P2Q` |
| `INV-202609-LK7P2Q-01` |
| `LK7P2Q01` |
| `INV-202609-LK7P2Q-02` |
| `LK7P2Q02` |

**Steps:**

1. Search the queue by <term>.

**Expected Results:**

* <order_1> is found.
* It shows `INV-202609-LK7P2Q-02` as its current invoice.

### post-sale-US1-TC9-1: Segments sort won lots' orders and show their counts

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
* **Trace:** post-sale-US-01

**Pre-conditions:**

* The store holds one order, none flagged, in each of Awaiting Setup, Preparing Invoice, Pending Payment, Payment Verifying, Payment Overdue, Preparing Shipment, Shipped, Delivered and Refunded.
* The store holds a published lot 30 minutes from its close.
* admin(operator) can open Orders under `/auction`.

**Steps:**

1. Open Orders.
2. Read which segment is open and the count on each segment.
3. Open each segment in turn.
4. Open All and filter to Payment Verifying.

**Expected Results:**

* Orders opens on Needs action, which reads 4 and lists the Preparing Invoice, Payment Verifying, Payment Overdue and Preparing Shipment orders.
* Waiting on winner reads 2 and lists the Awaiting Setup and Pending Payment orders.
* In transit reads 1 and lists the Shipped order; Closed reads 2 and lists the Delivered and Refunded orders.
* All reads 9, and the lot 30 minutes from its close is on no segment.
* Each order's status reads as its winner reads it on their own order.
* Filtered to Payment Verifying, All lists only the Payment Verifying order.

<!-- trace:case id=g10adm.auction-post-sale.TC-ljg rev=1 covers=g10adm.auction-post-sale.SC-r6h,g10adm.auction-post-sale.SC-1yv,g10adm.auction-post-sale.SC-fxm,g10adm.auction-post-sale.SC-r3o,g10adm.auction-post-sale.SC-05a,g10adm.auction-post-sale.SC-71a,g10adm.auction-post-sale.SC-9oe,g10adm.auction-post-sale.SC-88b,g10adm.auction-post-sale.SC-cnh,g10adm.auction-post-sale.SC-8dq,g10adm.auction-post-sale.SC-w38,g10adm.auction-post-sale.SC-whp,g10adm.auction-post-sale.SC-iyb,g10adm.auction-post-sale.SC-kqf,g10adm.auction-post-sale.SC-8wv,g10adm.auction-post-sale.SC-d6e -->
### post-sale-US1-TC6-1: Search finds an order by any of its codes or the winner's email

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
* **Trace:** post-sale-US-01

**Pre-conditions:**

* A Preparing Shipment order on listing `LK423`, whose first invoice `IN-LK42301` was replaced by `IN-LK42302`, and whose winner's account email is `collector@example.com`.
* Other orders in every segment, on listings whose codes do not start with `LK423`.
* admin(operator) is on Orders.

**Steps:**

1. Search for `LK423`, then `IN-LK42301`, then `IN-LK423`, then `IN-LK42302`.
2. Search for `Collector@Ex` and read the counts.
3. Open the order.

**Expected Results:**

* Each search finds the order.
* With `Collector@Ex`, Needs action and All read 1, and every other segment 0.
* The order shows `IN-LK42302` as its current invoice, with `IN-LK42301` marked Replaced.

<!-- trace:case id=g10adm.auction-post-sale.TC-y02 rev=1 covers=g10adm.auction-post-sale.SC-r6h,g10adm.auction-post-sale.SC-1yv,g10adm.auction-post-sale.SC-fxm,g10adm.auction-post-sale.SC-r3o,g10adm.auction-post-sale.SC-05a,g10adm.auction-post-sale.SC-71a,g10adm.auction-post-sale.SC-9oe,g10adm.auction-post-sale.SC-88b,g10adm.auction-post-sale.SC-cnh,g10adm.auction-post-sale.SC-8dq,g10adm.auction-post-sale.SC-w38,g10adm.auction-post-sale.SC-whp,g10adm.auction-post-sale.SC-iyb,g10adm.auction-post-sale.SC-kqf,g10adm.auction-post-sale.SC-8wv,g10adm.auction-post-sale.SC-d6e -->
### post-sale-US1-TC7-1: Rows lead with the longest wait, offer their action and keep their filters

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
* **Trace:** post-sale-US-01

**Pre-conditions:**

* Two orders in Preparing Invoice whose winners confirmed setup 10 and 30 hours ago.
* A Preparing Shipment order paid 2 hours ago, and a Preparing Shipment order flagged 1 hour ago for a card payment that landed while proof was checked.
* Two Delivered orders, delivered 1 and 3 days ago, and Cancelled orders of two cancellation categories.
* admin(operator whose roles are exactly `finance`) is on Orders.

**Steps:**

1. Read Needs action.
2. Choose Send invoice on the first row, then dismiss the dialog.
3. Open Closed and read it.
4. Filter to Cancelled, then to one cancellation category.
5. Reload the page.

**Expected Results:**

* Needs action lists the order confirmed 30 hours ago first, and neither Preparing Shipment row offers an action.
* Send invoice opens that order's send dialog.
* Closed lists the order delivered 1 day ago above the one delivered 3 days ago.
* The status filter offers Delivered, Cancelled and Refunded only; the category filter appears once Cancelled is chosen, and the list then holds only that category's orders.
* After the reload, Closed and both filters are still applied.

---

## post-sale-US2: Operator works one order from its own page

**As an** auction operator,
**I want** each order on its own page, leading with its status, the rule behind it and the one thing to do next, with its whole history on one timeline,
**so that** I act on an order, or hand it to a colleague by its link, without piecing it together from several screens.

<!-- trace:case id=g10adm.auction-post-sale.TC-pce rev=1 covers=g10adm.auction-post-sale.SC-ngp,g10adm.auction-post-sale.SC-0gj,g10adm.auction-post-sale.SC-nfo,g10adm.auction-post-sale.SC-15a,g10adm.auction-post-sale.SC-ydn,g10adm.auction-post-sale.SC-bcb,g10adm.auction-post-sale.SC-d8k,g10adm.auction-post-sale.SC-lc8,g10adm.auction-post-sale.SC-f7t,g10adm.auction-post-sale.SC-59i,g10adm.auction-post-sale.SC-r4l -->
### post-sale-US2-TC5-1: The order page leads with its status and the one thing to do next

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* A Preparing Shipment order on an ordinary lot, and a Cancelled order on a sandbox lot, neither flagged.
* admin(operator holding payment, shipment and refund processing) is on the Listings table.

**Steps:**

1. Choose Open order on the Preparing Shipment order's lot.
2. Read the header and More.
3. Reload the page, then open its address in a new window.
4. Open the Cancelled order from Orders and read its header.

**Expected Results:**

* The order page opens, reading Preparing Shipment with one sentence naming the rule behind it and how long it has waited, and no Test badge.
* Dispatch is the primary action, and More holds Refund alone.
* The reload and the new window open the same order.
* The Cancelled order reads Cancelled with a Test badge, and offers no primary action and no More.

<!-- trace:case id=g10adm.auction-post-sale.TC-xbe rev=1 covers=g10adm.auction-post-sale.SC-ngp,g10adm.auction-post-sale.SC-0gj,g10adm.auction-post-sale.SC-nfo,g10adm.auction-post-sale.SC-15a,g10adm.auction-post-sale.SC-ydn,g10adm.auction-post-sale.SC-bcb,g10adm.auction-post-sale.SC-d8k,g10adm.auction-post-sale.SC-lc8,g10adm.auction-post-sale.SC-f7t,g10adm.auction-post-sale.SC-59i,g10adm.auction-post-sale.SC-r4l -->
### post-sale-US2-TC6-1: Comments and log entries share one timeline

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* An order whose invoice was sent and then paid by card.
* admin(operator holding neither payment processing nor shipment processing) opens it.

**Steps:**

1. Leave the comment `Called the winner`.
2. Try to leave an empty comment.
3. Read the timeline.

**Expected Results:**

* The timeline shows the sent entry, the paid entry and the comment with the operator and its time, oldest first.
* The empty comment is refused with a sentence saying why.
* The comment offers no edit or delete.

<!-- trace:case id=g10adm.auction-post-sale.TC-jip rev=1 covers=g10adm.auction-post-sale.SC-ngp,g10adm.auction-post-sale.SC-0gj,g10adm.auction-post-sale.SC-nfo,g10adm.auction-post-sale.SC-15a,g10adm.auction-post-sale.SC-ydn,g10adm.auction-post-sale.SC-bcb,g10adm.auction-post-sale.SC-d8k,g10adm.auction-post-sale.SC-lc8,g10adm.auction-post-sale.SC-f7t,g10adm.auction-post-sale.SC-59i,g10adm.auction-post-sale.SC-r4l -->
### post-sale-US2-TC7-1: A refused send keeps the dialog and what was typed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**

* An order in HKD in Preparing Invoice for bank transfer.
* admin(operator with payment processing) opens Send invoice.

**Steps:**

1. Type Insurance `40.00` and leave Shipping & Handling blank.
2. Confirm the send.
3. Type Shipping & Handling `80.00` and confirm again.

**Expected Results:**

* The first confirm is refused with a sentence saying Shipping & Handling is needed; the dialog stays open with Insurance still `40.00`, and no invoice is sent.
* The second confirm sends an invoice with Shipping & Handling of 8000 and Insurance of 4000 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-rp1 rev=1 covers=g10adm.auction-post-sale.SC-gw4,g10adm.auction-post-sale.SC-i7j,g10adm.auction-post-sale.SC-seg,g10adm.auction-post-sale.SC-cbk,g10adm.auction-post-sale.SC-yd7,g10adm.auction-post-sale.SC-i16 -->
### post-sale-US2-TC8-1: The page names the rule behind Payment Overdue, and a reissue needs a reason

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* An order whose bank transfer invoice passed its payment deadline two days ago unpaid.
* admin(operator with payment processing) opens it.

**Steps:**

1. Read the header.
2. Open Reissue, leave the reason empty and confirm.
3. Read the timeline.

**Expected Results:**

* The header reads Payment Overdue, with one sentence saying the payment deadline passed two days ago unpaid, and Reissue as the primary action.
* The reissue is refused with a sentence saying a reason is needed, and the dialog stays open.
* The timeline holds no reissued entry.

<!-- trace:case id=g10adm.auction-post-sale.TC-6yz rev=1 covers=g10adm.auction-post-sale.SC-jy7 -->
### post-sale-US2-TC9-1: A cancelled order refuses a reopen

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* `<cancelled order>` was cancelled before any invoice was sent and its lot returned to available stock.
* admin(operator with payment processing) opens it.

**Steps:**

1. Attempt to reopen its address form with a reason.
2. Read the header and the lot's stock status.

**Expected Results:**

* The reopen is refused.
* The order still derives as Cancelled.
* The lot stays in available stock.

<!-- trace:case id=g10adm.auction-post-sale.TC-62p rev=1 covers=g10adm.auction-post-sale.SC-sxy,g10adm.auction-post-sale.SC-z4g,g10adm.auction-post-sale.SC-7jb,g10adm.auction-post-sale.SC-8fx -->
### post-sale-US2-TC10-1: Recording setup is refused without a reason, after confirmation, after send and when cancelled

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* `<overdue order>` is in Setup Overdue with no confirmed address.
* `<confirmed order>` is in Preparing Invoice with a confirmed address and no sent invoice.
* `<sent order>` has a sent invoice.
* `<cancelled order>` was cancelled before any invoice was sent.
* admin(operator with payment processing) opens each.

**Steps:**

1. On `<overdue order>`, record a delivery address, billing address and payment method with the reason empty.
2. On `<confirmed order>`, `<sent order>` and `<cancelled order>`, attempt to record setup with a reason.
3. Read each order's status.

**Expected Results:**

* Each attempt is refused.
* `<overdue order>` is still Setup Overdue, holding no recorded address.
* `<confirmed order>` keeps its confirmed address and `<sent order>` keeps its locked address.
* `<cancelled order>` still derives as Cancelled.

<!-- trace:case id=g10adm.auction-post-sale.TC-0jl rev=1 covers=g10adm.auction-post-sale.SC-zuz,g10adm.auction-post-sale.SC-l05 -->
### post-sale-US2-TC11-1: Recording setup refuses a method the currency does not offer, and a reopen is still allowed

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* `<USD order>` is in USD Setup Overdue, where Payment Settings holds no USD card fee rule and Grade10 holds no USD bank details.
* admin(operator with payment processing) opens it.

**Steps:**

1. Record a delivery address, billing address and card as the method, with a reason.
2. Record the same with bank transfer as the method.
3. Reopen the address form with a reason.
4. Sign in as its winner and open the order.

**Expected Results:**

* Both recordings are refused, and the order holds no recorded address and no method.
* The reopen is accepted and the order derives as Awaiting Setup.
* The winner reads that payment is not yet available in USD, with Contact Us, and cannot confirm.

<!-- trace:case id=g10adm.auction-post-sale.TC-13a rev=1 covers=g10adm.auction-post-sale.SC-3j8 -->
### post-sale-US2-TC12-1: Operators in different zones read the same Hong Kong time

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* A Pending Payment order whose invoice was sent at 2026-09-12T09:00:00Z with a payment deadline of 2026-09-19T09:00:00Z.
* One admin(operator) whose browser is set to London and another whose browser is set to Tokyo.

**Steps:**

1. Each operator reads the order's row on the worklist.
2. Each opens the order page and reads the payment deadline.
3. Each reads the sent entry on the timeline.
4. Each opens the Reissue dialog and reads the payment deadline it would keep.

**Expected Results:**

* Both read the payment deadline as 2026-09-19 17:00, labelled GMT+8, on the page and in the dialog.
* Both read the sent entry as 2026-09-12 17:00, labelled GMT+8.
* Neither reads a time in their browser's zone or in UTC.

---

## post-sale-US3: Operator collects payment

**As a** payment operator,
**I want** every payment that reaches an order recorded, and one the invoice did not expect flagged for me,
**so that** no money a winner sends is dropped, and I know what to check or have finance return.

<!-- trace:case id=g10adm.auction-post-sale.TC-05y rev=1 covers=g10adm.auction-post-sale.SC-uf1,g10adm.auction-post-sale.SC-3uf,g10adm.auction-post-sale.SC-n2q,g10adm.auction-post-sale.SC-7jf,g10adm.auction-post-sale.SC-3bt,g10adm.auction-post-sale.SC-en4,g10adm.auction-post-sale.SC-c66,g10adm.auction-post-sale.SC-ccp,g10adm.auction-post-sale.SC-btq,g10adm.auction-post-sale.SC-gmi,g10adm.auction-post-sale.SC-amp -->
### post-sale-US3-TC1-1: A verified card capture marks the listing Paid via Stripe

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-03

**Pre-conditions:**

* `<listing_7>` is Awaiting payment, with an open card authorization for the winner.
* admin(holds payment-processing) is on `<listing_7>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A closed listing with a winner, outcome Awaiting payment, card authorization still open |

**Steps:**

1. Record a verified card capture for `<listing_7>`.
2. Read the outcome.
3. Read the trail.

**Expected Results:**

* Step 2 shows Paid via Stripe.
* Step 3 shows that change from Stripe.
* Step 3 names no operator on that change.

<!-- trace:case id=g10adm.auction-post-sale.TC-lvf rev=1 covers=g10adm.auction-post-sale.SC-uf1,g10adm.auction-post-sale.SC-3uf,g10adm.auction-post-sale.SC-n2q,g10adm.auction-post-sale.SC-7jf,g10adm.auction-post-sale.SC-3bt,g10adm.auction-post-sale.SC-en4,g10adm.auction-post-sale.SC-c66,g10adm.auction-post-sale.SC-ccp,g10adm.auction-post-sale.SC-btq,g10adm.auction-post-sale.SC-gmi,g10adm.auction-post-sale.SC-amp -->
### post-sale-US3-TC2-1: A second payment record is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-03

**Pre-conditions:**

* `<listing_8>` is Paid via Stripe.
* admin(holds payment-processing) is on `<listing_8>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A closed listing with a winner, outcome Paid via Stripe |

**Steps:**

1. Record payment collected on `<listing_8>`.
2. Read the outcome.
3. Read the winner.

**Expected Results:**

* Step 1 is refused.
* Step 2 still shows Paid via Stripe.
* Step 3 shows the winner unchanged.

<!-- trace:case id=g10adm.auction-post-sale.TC-1cx rev=1 covers=g10adm.auction-post-sale.SC-uf1,g10adm.auction-post-sale.SC-3uf,g10adm.auction-post-sale.SC-n2q,g10adm.auction-post-sale.SC-7jf,g10adm.auction-post-sale.SC-3bt,g10adm.auction-post-sale.SC-en4,g10adm.auction-post-sale.SC-c66,g10adm.auction-post-sale.SC-ccp,g10adm.auction-post-sale.SC-btq,g10adm.auction-post-sale.SC-gmi,g10adm.auction-post-sale.SC-amp -->
### post-sale-US3-TC3-1: Staff cannot record payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-03

**Pre-conditions:**

* admin(role is exactly staff) is on Orders under `/auction`.
* `<listing_9>` is Awaiting payment.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A closed listing with a winner, outcome Awaiting payment |

**Steps:**

1. Open `<listing_9>`.
2. Read the payment control.
3. Submit a payment-collected record.
4. Read the outcome.

**Expected Results:**

* Step 2 shows the payment control, and it is disabled.
* Step 3 is refused.
* Step 4 does not show Paid via Manual.

<!-- trace:case id=g10adm.auction-post-sale.TC-kbs rev=1 covers=g10adm.auction-post-sale.SC-uf1,g10adm.auction-post-sale.SC-3uf,g10adm.auction-post-sale.SC-n2q,g10adm.auction-post-sale.SC-7jf,g10adm.auction-post-sale.SC-3bt,g10adm.auction-post-sale.SC-en4,g10adm.auction-post-sale.SC-c66,g10adm.auction-post-sale.SC-ccp,g10adm.auction-post-sale.SC-btq,g10adm.auction-post-sale.SC-gmi,g10adm.auction-post-sale.SC-amp -->
### post-sale-US3-TC5-1: Payments the invoice did not expect are flagged and cleared one at a time

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-03

**Pre-conditions:**

* customer(winner) started paying a card invoice of 323225 minor units in HKD, which admin(operator with payment processing) then reissued.

**Steps:**

1. Complete the card payment of 323225 minor units in HKD on the replaced invoice.
2. Complete a card payment of 300000 minor units in HKD on the current invoice.
3. As the operator, open the order, then Needs action.
4. Clear one flag with the reason `Refund sent through Stripe`, and read the order and Needs action.
5. Clear the other flag with a reason, and read Needs action, Waiting on winner and the timeline.

**Expected Results:**

* Both payments are recorded, flagged Paid on a replaced invoice and Amount mismatch; nothing counts as paid, and the order reads Pending Payment.
* The page shows two notices, each with its own Clear flag, and still offers Reissue; the order is listed under Needs action.
* After the first clear, one notice is left and the order is still under Needs action.
* After the second, the order is listed under Waiting on winner, still reading Pending Payment.
* The timeline shows both flagged payment entries and both flag cleared entries, with the operator and the reasons.

<!-- trace:case id=g10adm.auction-post-sale.TC-umi rev=1 covers=g10adm.auction-post-sale.SC-uf1,g10adm.auction-post-sale.SC-3uf,g10adm.auction-post-sale.SC-n2q,g10adm.auction-post-sale.SC-7jf,g10adm.auction-post-sale.SC-3bt,g10adm.auction-post-sale.SC-en4,g10adm.auction-post-sale.SC-c66,g10adm.auction-post-sale.SC-ccp,g10adm.auction-post-sale.SC-btq,g10adm.auction-post-sale.SC-gmi,g10adm.auction-post-sale.SC-amp -->
### post-sale-US3-TC4-1: Card money pays an expired invoice late, and counts toward nothing in any other state

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
* **Trace:** post-sale-US-03

**Pre-conditions:**

* A Payment Overdue order whose card invoice totals 323225 minor units in HKD.
* A Payment Verifying order whose bank transfer invoice totals 312000 minor units in HKD.

**Steps:**

1. Complete a card payment of 323225 minor units in HKD against the first order's invoice.
2. Complete a card payment of 312000 minor units in HKD against the second order's invoice.
3. As an operator, read both orders and their timelines.

**Expected Results:**

* The first payment is flagged Paid late; the invoice is `paid` and the order reads Preparing Shipment.
* The second is flagged Unexpected status; the invoice is still `payment_verifying`, with nothing counted as paid.
* Each timeline shows a flagged payment entry naming the card.

### post-sale-US3-TC6-1: The order page shows the winner's name, email and phone to reach them on

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
* **Trace:** post-sale-US-03

**Pre-conditions:**

* An order in Payment Verifying whose winner confirmed a delivery address with phone `+852 91234567`.
* admin(operator) opens it.

**Steps:**

1. Read the winner on the order page.

**Expected Results:**

* The page shows the winner's account name and registered account email as the contact, with `+852 91234567`.
* No payment-provider customer or payment identifier is shown in their place.

---

## post-sale-US4: Operator records in-house shipment

**As a** shipment operator,
**I want** to record dispatch with the carrier and the tracking number, then delivery with the carrier's proof, on the order,
**so that** the winner can follow the lot, and only someone allowed to ship records a shipment.

<!-- trace:case id=g10adm.auction-post-sale.TC-7o6 rev=1 covers=g10adm.auction-post-sale.SC-10k,g10adm.auction-post-sale.SC-js8,g10adm.auction-post-sale.SC-tl1,g10adm.auction-post-sale.SC-0vy,g10adm.auction-post-sale.SC-usw,g10adm.auction-post-sale.SC-82s,g10adm.auction-post-sale.SC-7rg,g10adm.auction-post-sale.SC-b2b,g10adm.auction-post-sale.SC-0ln -->
### post-sale-US4-TC1-1: Dispatch then delivery moves the order to Delivered

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
* **Trace:** post-sale-US-04

**Pre-conditions:**

* A Preparing Shipment order.
* admin(operator with shipment processing) opens it.

**Steps:**

1. Record dispatch with carrier `SF Express`, tracking number `SF1234567890` and the carrier's tracker link.
2. Record delivery on today's date with a proof-of-delivery image.
3. Read the timeline.

**Expected Results:**

* After dispatch the order reads Shipped; after delivery it reads Delivered.
* The timeline shows the dispatched entry with the carrier, the tracking number, the tracker link, the operator and the delivery address, and the delivery confirmed entry with the date and the image.

<!-- trace:case id=g10adm.auction-post-sale.TC-75e rev=1 covers=g10adm.auction-post-sale.SC-10k,g10adm.auction-post-sale.SC-js8,g10adm.auction-post-sale.SC-tl1,g10adm.auction-post-sale.SC-0vy,g10adm.auction-post-sale.SC-usw,g10adm.auction-post-sale.SC-82s,g10adm.auction-post-sale.SC-7rg,g10adm.auction-post-sale.SC-b2b,g10adm.auction-post-sale.SC-0ln -->
### post-sale-US4-TC2-1: Dispatch and delivery out of order, or without tracking, are refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-04

**Pre-conditions:**

* An order in Pending Payment and an order in Preparing Shipment.
* admin(operator with shipment processing).

**Steps:**

1. Record dispatch on the Pending Payment order.
2. Record delivery on the Preparing Shipment order.
3. Record dispatch on the Preparing Shipment order with a carrier and no tracking number.

**Expected Results:**

* Each is refused.
* Neither order's status moves.

<!-- trace:case id=g10adm.auction-post-sale.TC-kcn rev=1 covers=g10adm.auction-post-sale.SC-9wm,g10adm.auction-post-sale.SC-pvi -->
### post-sale-US4-TC3-1: The winner reads the tracking number as a link with a tracker link and as plain text without one

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
* **Trace:** post-sale-US-04

**Pre-conditions:**

* Two Preparing Shipment orders, each won by a different winner.
* admin(operator with shipment processing) opens each.

**Steps:**

1. Record dispatch on the first with carrier `SF Express`, tracking number `SF1234567890` and the carrier's tracker link.
2. Record dispatch on the second with the same carrier and tracking number and no tracker link.
3. Sign in as each winner and open their order.

**Expected Results:**

* The first winner reads `SF1234567890` as a link to the tracker link.
* The second winner reads `SF1234567890` as plain text, not a link.
* Neither winner reads a carrier name or sees a Track shipment control.
* Both orders read Shipped.

---

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance and Tax when the lot needs them, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

### post-sale-US5-TC1-1: The quote shows Bill To and Ship To

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(holds payment-processing) is on <grade10 auction admin order url> for an order ready for a quote.

**Test data:**

| Field | Value |
| --- | --- |
| <order_1> | An order with different billing and delivery snapshots |

**Steps:**

1. Open the quote for <order_1>.

**Expected Results:**

* The quote shows Bill To and Ship To separately.
* Both addresses match the order snapshots.

<!-- trace:case id=g10adm.auction-post-sale.TC-u4w rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC9-1: Operator sends an invoice with tax

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice whose lines before Tax total 312000 minor units in HKD.

**Steps:**

1. Enter Tax of 6000 minor units in HKD.
2. Send the invoice.

**Expected Results:**

* The invoice is sent with Tax of 6000 minor units in HKD.
* Its Subtotal includes Tax and reads 318000 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-dre rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC10-1: Operator sends an invoice without tax

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice.

**Steps:**

1. Leave Tax empty.
2. Complete the other required quote fields and send the invoice.

**Expected Results:**

* The invoice is sent.
* It carries no Tax line.

<!-- trace:case id=g10adm.auction-post-sale.TC-tuk rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC11-1: Tax of zero is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice.

**Steps:**

1. Add Tax of 0 minor units.
2. Submit the quote.

**Expected Results:**

* The send is refused.
* No invoice is issued.

<!-- trace:case id=g10adm.auction-post-sale.TC-j3w rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US5-TC18-1: The card fee is read from the card rule before send

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice for card, with a subtotal of 312000 minor units in HKD.
* The HKD card rule in Payment Settings is 3.4% and HK$2.35.

**Steps:**

1. Open the send step.
2. Read the fee and the order total.

**Expected Results:**

* The payment processing fee reads 11225 and the order total 323225 minor units in HKD.
* The fee offers nothing to type.

<!-- trace:case id=g10adm.auction-post-sale.TC-j3x rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US5-TC19-1: A card invoice is refused when the currency has no card rule

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice for card, in HKD.
* Payment Settings holds no HKD card rule.

**Steps:**

1. Open the send step.
2. Send the invoice.

**Expected Results:**

* The send is refused with `CARD_FEE_UNSET`.
* The refusal says the HKD card fee is not set and points to Payment Settings.
* No invoice is issued.

<!-- trace:case id=g10adm.auction-post-sale.TC-rh9 rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC13-1: Grade10 computes the card fee, tracking the subtotal until send

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* An order in HKD in Preparing Invoice for card, with a winning bid of 250000 and a buyer's premium of 50000 minor units.
* admin(operator with payment processing) opens Send invoice.

**Steps:**

1. Type Shipping & Handling `80.00` and Insurance `40.00`, and read the fee and the total.
2. Change Shipping & Handling to `120.00` and read them again.
3. Send the invoice.

**Expected Results:**

* At a subtotal of 312000 the fee reads 11225, read-only, and the total 323225 minor units in HKD.
* At 316000 the fee reads 11366 and the total 327366.
* The send succeeds, and the invoice is `pending` with a fee of 11366 and a total of 327366 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-ir2 rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC14-1: No card rule refuses the send

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* Payment Settings holds no USD card rule.
* An order in USD in Preparing Invoice for card.
* admin(operator with payment processing) opens Send invoice.

**Steps:**

1. Read the fee.
2. Send.

**Expected Results:**

* No fee shows; the field offers nothing to type.
* The send is refused with `CARD_FEE_UNSET`, a sentence saying the USD card fee is not set, and a link to Payment Settings.

<!-- trace:case id=g10adm.auction-post-sale.TC-42i rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC15-1: A total that moved since it was read is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-05

**Pre-conditions:**

* An order in HKD in Preparing Invoice for bank transfer, with a winning bid of 250000 and a buyer's premium of 50000 minor units.
* admin(operator with payment processing) has typed Shipping & Handling `80.00`, Insurance `40.00` and the fee `0.00`, and reads a total of 312000 minor units.

**Steps:**

1. In a second session, raise the HKD premium minimum to `600.00`.
2. Send the invoice from the first session.

**Expected Results:**

* The send is refused, and the dialog shows 312000 as the total read and 322000 minor units in HKD as the new one.
* Shipping & Handling and Insurance still read `80.00` and `40.00`.
* No invoice is issued.

<!-- trace:case id=g10adm.auction-post-sale.TC-dxc rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC16-1: The send shows its deadline, and a sent fee never moves

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-05

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* An order in HKD in Preparing Invoice for card, with a subtotal of 312000 minor units once Shipping & Handling and Insurance are entered.
* admin(operator with payment processing) works in Hong Kong time, and the clock reads 2026-09-12T09:00:00Z.

**Steps:**

1. Open Send invoice, enter the amounts, read the deadline, and send.
2. Change the HKD card rule to 3.9% and HK$2.35 in Payment Settings.
3. Reopen the order.

**Expected Results:**

* The dialog showed the payment deadline 2026-09-19 17:00, Hong Kong time, and the invoice carries 2026-09-19T09:00:00Z.
* After the rule changes, the invoice still carries a fee of 11225 and a total of 323225 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-smi rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US5-TC17-1: An edit before send keeps the waiting time and adds no mark

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* Grade10 holds HKD bank details.
* An order in HKD in Preparing Invoice whose winner confirmed the home address and card at 2026-09-12T09:00:00Z.
* admin(operator with payment processing).

**Steps:**

1. At 2026-09-14T09:00:00Z, change the address to the work address and the method to bank transfer, with the reason `Winner asked by email`.
2. At 2026-09-15T09:00:00Z, open the order and read the header and the timeline.

**Expected Results:**

* The order holds the work address and bank transfer, and still reads Preparing Invoice.
* The header shows it has waited 72 hours since the winner's confirmation, with no Overdue mark.
* The timeline shows an order edited before send entry with the operator, the reason, and the address and method before and after.
* The timeline holds no dispatched entry.

---

## post-sale-US6: Operator sees which lots are still in extended bidding

**As an** auction operator,
**I want** the Listings table to mark a lot still taking bids past its scheduled close,
**so that** I can tell a lot running long from one that closed on time.

<!-- trace:case id=g10adm.auction-post-sale.TC-vsq rev=2 covers=g10adm.auction-post-sale.SC-hvd,g10adm.auction-post-sale.SC-jck,g10adm.auction-post-sale.SC-bps -->
### post-sale-US6-TC1-2: The Listings table marks only the lot in extended bidding

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-06

**Pre-conditions:**

* admin(operator) is on the Listings table.
* `<listing_1>`, `<listing_2>` and `<listing_3>` exist.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published lot past its scheduled close, still taking bids |
| `<listing_2>` | A published lot whose scheduled close has not arrived |
| `<listing_3>` | A lot that closed after its extended bidding ended |

**Steps:**

1. Find the rows for `<listing_1>`, `<listing_2>` and `<listing_3>`.
2. Read each row's status and marks.

**Expected Results:**

* `<listing_1>` reads Extended beside its status, and its status is unchanged.
* `<listing_2>` and `<listing_3>` do not read Extended.

<!-- trace:case id=g10adm.auction-post-sale.TC-v7u rev=1 covers=g10adm.auction-post-sale.SC-hvd,g10adm.auction-post-sale.SC-jck,g10adm.auction-post-sale.SC-bps -->
### post-sale-US6-TC2-1: Extended bidding is not an outcome filter

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-06

**Pre-conditions:**

* admin(holds the auction queue grant) is on <grade10 auction admin queue url>.
* `<listing_1>` is in the queue.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A lot past its scheduled close, in extended bidding |

**Steps:**

1. Open the outcome filter.
2. Read the outcomes offered.
3. Read `<listing_1>`'s row.

**Expected Results:**

* No outcome named Extended bidding is offered.
* `<listing_1>`'s row has no needs-action highlight from the label.

---

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

<!-- trace:case id=g10adm.auction-post-sale.TC-6bv rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk -->
### post-sale-US7-TC1-1: Reissue returns an expired order to Pending Payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* `<order_1>` derives as Expired.
* admin(holds payment-processing) is on `<order_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_1>` | An auction order whose invoice is `pending` and whose deadline has elapsed |
| `<reissue reason>` | The operator's stated reason for the reissue |

**Steps:**

1. Reissue the invoice on `<order_1>`.
2. Enter `<reissue reason>`.
3. Confirm the reissue.
4. Read the invoice status.
5. Read the payment deadline.
6. Read the order status.

**Expected Results:**

* Steps 4 and 5: invoice still `pending`, new 7-day deadline.
* Step 6 shows the order as Pending Payment.

<!-- trace:case id=g10adm.auction-post-sale.TC-rjj rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk -->
### post-sale-US7-TC2-1: Manual settlement is available before expiry

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* `<order_2>` derives as Pending Payment, three days before its deadline (any time before the deadline).
* Its winner has said they will pay by bank transfer.
* The delivery address is confirmed.
* admin(holds payment-processing) is on `<order_2>`.

**Steps:**

1. Settle `<order_2>` manually.
2. Confirm the settlement.
3. Read the order status.

**Expected Results:**

* Step 2: the settlement is accepted.
* Step 3 shows Processing, with the deadline not elapsed.

<!-- trace:case id=g10adm.auction-post-sale.TC-4qr rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk -->
### post-sale-US7-TC3-1: Settlement is refused until the address is confirmed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* `<order_3>` is unpaid.
* Its delivery address is still the account default shipping address.
* admin(holds payment-processing) is on `<order_3>`.

**Steps:**

1. Select settle manually on `<order_3>`.
2. Confirm the settlement without confirming the delivery address.
3. Read the invoice status.

**Expected Results:**

* Step 2: the settlement is refused.
* Step 3 shows the invoice still `pending`.

<!-- trace:case id=g10adm.auction-post-sale.TC-2mh rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk -->
### post-sale-US7-TC4-1: Cancelling returns the lot to available and offers no runner-up

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* `<order_4>` derives as Expired.
* Its lot had a second-highest bidder.
* admin(holds payment-processing) is on `<order_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_4>` | An expired auction order whose lot has a runner-up |
| `<cancel reason>` | The operator's stated reason for the cancellation |

**Steps:**

1. Cancel `<order_4>`.
2. Enter `<cancel reason>`.
3. Confirm the cancellation.
4. Read the invoice status.
5. Read the order status.
6. Read the lot's inventory status.
7. Read what the runner-up was offered.

**Expected Results:**

* Steps 4 and 5 show invoice `cancelled` and order Cancelled.
* Step 6 shows the lot available to list again.
* Step 7: no runner-up offer and no right to the lot.

### post-sale-US7-TC5-1: Reissue changes the address with a reason

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent card invoice, `pending`.

**Test data:**

| <deadline choice> | <deadline outcome> |
| --- | --- |
| keep | unchanged from the old invoice |
| restart | 7 days from the reissue |

**Steps:**

1. Open Reissue.
2. Choose <address_2>, enter Shipping & Handling and a reason.
3. Choose <deadline choice> and reissue.

**Expected Results:**

* A new invoice is `pending` for <address_2>.
* The deadline is <deadline outcome>.
* The old invoice reads as replaced, not Cancelled.

### post-sale-US7-TC6-1: Reissue without a reason is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent invoice, `pending`.

**Steps:**

1. Open Reissue.
2. Change Insurance.
3. Leave the reason empty and reissue.

**Expected Results:**

* The reissue is refused, asking for a reason.
* The current invoice is unchanged.

### post-sale-US7-TC7-1: Switching card to bank transfer starts the fee empty

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent card invoice, `pending`, HKD.

**Steps:**

1. Open Reissue.
2. Choose bank transfer.
3. Read the bank transfer fee field.

**Expected Results:**

* The fee field is empty.
* The card fee is not carried over.

### post-sale-US7-TC8-1: A bank transfer reissue prefills the previous fee

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice with fee <fee_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <fee_1> | An amount above 0 |
| <fee_2> | A different amount above 0 |

**Steps:**

1. Open Reissue.
2. Read the fee field.
3. Change it to <fee_2>, add a reason and reissue.

**Expected Results:**

* Step 2 shows <fee_1>.
* The new invoice carries <fee_2>.

### post-sale-US7-TC9-2: Bank transfer fee values that are refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* Reissue is open on <order_1> with bank transfer chosen.

**Test data:**

| <fee> |
| --- |
| -1 |
| a value finer than the currency's smallest unit |
| text |

**Steps:**

1. Enter <fee> and a reason.
2. Reissue.

**Expected Results:**

* The reissue is refused at the fee.
* The current invoice is unchanged.

### post-sale-US7-TC10-2: Bank transfer fee values that are accepted

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
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* Reissue is open on <order_1> with bank transfer chosen.

**Test data:**

| <fee> | <fee reads> |
| --- | --- |
| blank | Free, as zero |
| 0 | Free |
| 1 minor unit | That amount |
| An amount larger than the Subtotal | That amount, not capped |

**Steps:**

1. Enter <fee> and a reason.
2. Reissue.

**Expected Results:**

* The new invoice carries Payment Processing Fee <fee reads>.

### post-sale-US7-TC11-1: Switching to card prices the fee from the provider

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The fee is the gross-up read at reissue.
* No fee is typed by the operator.

### post-sale-US7-TC12-1: A card reissue is refused when provider fees cannot be read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.
* The payment provider's fees cannot be read.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The reissue is refused and says why.
* The current invoice is unchanged.

### post-sale-US7-TC13-1: A card invoice paid by transfer is reissued then settled

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `pending`.
* The winner transferred exactly the Subtotal.

**Steps:**

1. Reissue as bank transfer with fee 0 and a reason.
2. Record settlement at the new Order Total, with one proof file.

**Expected Results:**

* The new invoice reads fee Free, total equal to Subtotal.
* The invoice is `paid`; the order reads Processing.

### post-sale-US7-TC14-1: Settling a card invoice as a transfer without reissue is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `pending`.

**Steps:**

1. Record a settlement at the Subtotal with one proof file, once per method: bank transfer, cash, other.

**Expected Results:**

* Each settlement is refused, pointing to reissue.
* The invoice stays `pending`.

### post-sale-US7-TC15-1: Settlement at an amount other than the Order Total is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`, Order Total <total>.

**Test data:**

| <amount> |
| --- |
| <total> minus 1 minor unit |
| <total> plus 1 minor unit |

**Steps:**

1. Record a settlement of <amount> with one proof file.

**Expected Results:**

* The settlement is refused.
* The invoice stays `pending`.

### post-sale-US7-TC16-1: Operator settlement needs proof and goes straight to paid

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
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`.

**Test data:**

| <proof> | <outcome> |
| --- | --- |
| 1 file | paid, never Payment Verifying |
| 5 files | paid, never Payment Verifying |

**Steps:**

1. Record a settlement at the Order Total with <proof>.

**Expected Results:**

* The outcome is <outcome>.

### post-sale-US7-TC23-1: Operator settlement without proof is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`.

**Steps:**

1. Record a settlement at the Order Total with no proof file.

**Expected Results:**

* The settlement is refused, asking for proof.
* The invoice stays `pending`.

### post-sale-US7-TC24-1: One bad proof file refuses the whole settlement

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`.

**Test data:**

| <bad file> |
| --- |
| A JPEG of 10,485,761 bytes |
| A GIF |

**Steps:**

1. Attach one valid PDF and <bad file>.
2. Commit the settlement with a reference.

**Expected Results:**

* The commit is refused.
* No file is stored; the invoice stays `pending`.

<!-- trace:case id=g10adm.auction-post-sale.TC-jn5 rev=2 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US7-TC25-2: The first bank transfer quote asks for the fee

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
* **Testability:** automation
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice with bank transfer chosen by the winner.

**Test data:**

| <fee> | <outcome> |
| --- | --- |
| blank | The invoice is sent; its fee reads Free |
| -100 | The send is refused; no invoice is issued |
| 0 | The invoice is sent; its fee reads Free |
| more than the Subtotal | The invoice is sent with that fee, not capped |

**Steps:**

1. Open the quote.
2. Enter Shipping & Handling and <fee>.
3. Send the invoice.

**Expected Results:**

* Step 1 names bank transfer and asks for a bank transfer fee.
* <outcome>

### post-sale-US7-TC17-1: Settlement keeps the Payment Processing Fee line

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
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice with fee <fee>, `pending`.

**Test data:**

| <fee> |
| --- |
| 0, read as Free |
| an amount above 0 |

**Steps:**

1. Record a settlement at the Order Total with one proof file.
2. Read the paid invoice.

**Expected Results:**

* Payment Processing Fee still reads <fee>.
* The paid amount includes it.

### post-sale-US7-TC18-1: Staff without payment processing cannot reissue or check proof

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
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(without payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is <state>.

**Test data:**

| <state> |
| --- |
| Pending Payment |
| Payment Verifying |

**Steps:**

1. Look for Reissue, settle, confirm and return.
2. Send a reissue from outside the page.

**Expected Results:**

* Each action is visible and disabled.
* Step 2 is refused; the invoice is unchanged.

### post-sale-US7-TC19-1: Only Confirm and Return while proof is checked

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
* **Testability:** manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Test data:**

| <action> |
| --- |
| Reissue |
| Settle manually |
| Cancel order |

**Steps:**

1. Look for <action>.
2. Send <action> for <order_1> from outside the page.

**Expected Results:**

* <action> is not offered; Confirm and Return are.
* Step 2 is refused; the order stays Payment Verifying.

### post-sale-US7-TC20-1: Reissue on an expired invoice offers only a fresh 7 days

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a card invoice, `expired`.

**Steps:**

1. Open Reissue, change Insurance, add a reason.
2. Read the deadline choices.
3. Send a reissue that keeps the deadline from outside the page.

**Expected Results:**

* Only a fresh 7 days from send is offered.
* Step 3 is refused; the invoice stays `expired`.

### post-sale-US7-TC21-1: Reissue with nothing changed

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent invoice, `pending`.

**Steps:**

1. Open Reissue.
2. Keep the current deadline, change nothing else, add a reason and reissue.

**Expected Results:**

* The reissue is refused as changing nothing.
* The current invoice keeps its invoice ID, amount and deadline.

### post-sale-US7-TC22-1: An old invoice ID or bank reference still finds the order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin post-sale url>.
* <order_1> had <invoice_1> replaced by <invoice_2>.

**Steps:**

1. Search the queue by <invoice_1>'s invoice ID.
2. Search the queue by <invoice_1>'s bank reference.

**Expected Results:**

* Both searches find <order_1>.
* It shows <invoice_2> as current.

### post-sale-US7-TC26-1: A fresh deadline alone is enough to reissue

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a `pending` invoice with a payment deadline of 2026-09-19T09:00:00Z.

**Steps:**

1. Open Reissue.
2. Change nothing but the deadline, to a fresh 7 days.
3. Add a reason and send at 2026-09-15T10:00:00Z.
4. Read the reissued log entry.

**Expected Results:**

* The new invoice is `pending` with a deadline of 2026-09-22T10:00:00Z.
* It carries a new invoice ID and bank reference.
* The entry names the deadline as the only changed part.

### post-sale-US7-TC27-1: An edit before send changes the address and method and is logged

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is an HKD order that reads Preparing Invoice, with the home address and card confirmed by the winner.

**Steps:**

1. Open the edit on <order_1>.
2. Change the address to the work address and the method to bank transfer.
3. Enter the reason "Winner asked by email" and commit.
4. Read the invoice log.

**Expected Results:**

* <order_1> holds the work address and bank transfer, and still reads Preparing Invoice.
* The log shows an order edited before send entry with the operator, the reason, and the address and method before and after.
* The winner's Winner Order shows the work address and bank transfer.

### post-sale-US7-TC28-1: An edit before send without a reason is refused

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice with the home address confirmed.

**Steps:**

1. Open the edit on <order_1>.
2. Change the address to the work address, leave the reason empty, and commit.

**Expected Results:**

* The commit is refused.
* <order_1> still holds the home address, and the log has no new entry.

### post-sale-US7-TC29-1: Staff without payment processing cannot edit before send

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(roles exactly `staff`) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice.

**Steps:**

1. Look at the edit control.
2. Send an address edit with a reason for <order_1> from outside the page.

**Expected Results:**

* Step 1 shows the control visible and disabled.
* Step 2 is refused; <order_1> is unchanged.

### post-sale-US7-TC30-1: A USD order cannot be edited to bank transfer

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is a USD order that reads Preparing Invoice with card confirmed.

**Steps:**

1. Open the edit on <order_1>.
2. Choose bank transfer, enter a reason, and commit.

**Expected Results:**

* The commit is refused.
* <order_1> still holds card.

### post-sale-US7-TC31-1: An edit before send does not reset the waiting time

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* The winner confirmed <order_1>'s address at 2026-09-12T09:00:00Z.

**Steps:**

1. Edit the address with a reason at 2026-09-14T09:00:00Z.
2. Open <order_1> at 2026-09-15T09:00:00Z.

**Expected Results:**

* The detail shows 72 hours waited since the winner's confirmation.
* <order_1> carries the Overdue mark.

<!-- trace:case id=g10adm.auction-post-sale.TC-6p7 rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US7-TC38-1: Reissue changes tax

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Pending Payment whose invoice carries no Tax.

**Steps:**

1. Open Reissue.
2. Add Tax of 6000 minor units in HKD and give a reason.
3. Send the new invoice.

**Expected Results:**

* The new invoice carries Tax of 6000 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-yjb rev=1 covers=g10adm.auction-post-sale.SC-kdq -->
### post-sale-US7-TC46-1: Reissue removes tax

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Pending Payment whose invoice carries Tax of 6000 minor units in HKD.

**Steps:**

1. Open Reissue.
2. Clear the Tax amount, change nothing else, and give a reason.
3. Send the new invoice.

**Expected Results:**

* The reissue is accepted as a change.
* The new invoice has no Tax line.
* Its Subtotal is 6000 minor units lower than the replaced invoice's.

<!-- trace:case id=g10adm.auction-post-sale.TC-knz rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-kdq -->
### post-sale-US7-TC47-1: Switching to card prices the fee from the card rule

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.
* Payment Settings holds a card rule for <order_1>'s currency.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The fee is the card rule's gross-up of the Subtotal at reissue.
* No fee is typed by the operator.

<!-- trace:case id=g10adm.auction-post-sale.TC-1lc rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-kdq -->
### post-sale-US7-TC48-1: A card reissue is refused when the currency has no card rule

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.
* Payment Settings holds no card rule for <order_1>'s currency.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The reissue is refused with `CARD_FEE_UNSET`.
* The refusal says the card fee for that currency is not set and points to Payment Settings.
* The current invoice is unchanged.

<!-- trace:case id=g10adm.auction-post-sale.TC-w3j rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-obc,g10adm.auction-post-sale.SC-5ky,g10adm.auction-post-sale.SC-5at,g10adm.auction-post-sale.SC-hto,g10adm.auction-post-sale.SC-ltc,g10adm.auction-post-sale.SC-3fi -->
### post-sale-US7-TC32-1: A method switch on reissue prices the fee by the new method

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* An order in Pending Payment whose card invoice has a subtotal of 312000 and a fee of 11225 minor units in HKD.
* admin(operator with payment processing) opens Reissue.

**Steps:**

1. Switch the method to bank transfer, and read the fee and the two totals.
2. Type a bank transfer fee of `50.00`.
3. Switch back to card, raise Shipping & Handling so the subtotal is 316000, and read the fee.

**Expected Results:**

* On bank transfer the fee reads empty, which is zero, the previous total 323225 and the new total 312000.
* Once typed, the bank transfer fee reads 5000.
* Back on card the fee reads 11366, computed from the HKD card rule, read-only.

<!-- trace:case id=g10adm.auction-post-sale.TC-mqb rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-obc,g10adm.auction-post-sale.SC-5ky,g10adm.auction-post-sale.SC-5at,g10adm.auction-post-sale.SC-hto,g10adm.auction-post-sale.SC-ltc,g10adm.auction-post-sale.SC-3fi -->
### post-sale-US7-TC33-1: Record payment starts at the balance and says what the payment does

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* An order in Pending Payment whose bank transfer invoice totals 312000 minor units in HKD.
* admin(operator with payment processing) opens Record payment.

**Steps:**

1. Read the amount and the balance.
2. Change the amount to `2000.00` and read them again.
3. Change it back to `3120.00`, choose bank transfer, and enter the reference `HSBC-778812`, received on 2026-09-25, one PDF slip and the reason `Transfer seen on the statement`.
4. Commit, and read the order.

**Expected Results:**

* The amount first reads `3120.00`, with a balance of 312000 before and 0 after, and the dialog says the invoice will be paid.
* At `2000.00` the balance after reads 112000 minor units in HKD, and the dialog says the order will read Partially Paid.
* After the commit the invoice is `paid`, the order reads Preparing Shipment, and the payment carries bank transfer, `HSBC-778812`, 2026-09-25 and the slip.

<!-- trace:case id=g10adm.auction-post-sale.TC-7l8 rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### post-sale-US7-TC34-1: Record payment refuses what it cannot record

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

Runs once per row of **Test data**.

**Test data:**

| `<order>` | What the operator does | Grade10 |
| --- | --- | --- |
| Pending Payment, bank transfer, 312000 minor units in HKD | Records the balance by bank transfer with a reference and a PDF, and no reason | refuses it; the invoice is still `pending` |
| Pending Payment, bank transfer, 312000 minor units in HKD | Records cash with a reason and no proof file | refuses it; the invoice is still `pending` |
| Pending Payment, bank transfer, 312000 minor units in HKD | Chooses other with no description, a PDF and a reason | refuses it; the invoice is still `pending` |
| Pending Payment, bank transfer, 312000 minor units in HKD | Attaches a valid PDF with a 12 MB JPEG, with a reason | refuses it and stores no file |
| Pending Payment, bank transfer, 312000 minor units in HKD | Records `0.00` with a PDF and a reason | refuses it; the invoice is still `pending` |
| Payment Verifying | Looks for Record payment, then sends one straight to the server | offers none and refuses it; the invoice is still `payment_verifying` |
| Pending Payment, sent for card | Looks for Record payment, then sends a bank transfer straight to the server | offers none and refuses it; the invoice is still `pending` |
| Preparing Invoice, no invoice sent | Looks for Record payment, then sends one straight to the server | offers none and refuses it; the order is still Preparing Invoice |
| Preparing Shipment, its bank transfer invoice `paid` by a recorded payment | Looks for Record payment, then sends a second one straight to the server | offers none and refuses it; the existing payment record is unchanged |

**Pre-conditions:**

* admin(operator with payment processing) opens `<order>`.

**Steps:**

1. Do what the row says.
2. Read the invoice status and the timeline.

**Expected Results:**

* Grade10 answers as the row states.
* The timeline holds no new payment recorded entry.

<!-- trace:case id=g10adm.auction-post-sale.TC-o29 rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-obc,g10adm.auction-post-sale.SC-5ky,g10adm.auction-post-sale.SC-5at,g10adm.auction-post-sale.SC-hto,g10adm.auction-post-sale.SC-ltc,g10adm.auction-post-sale.SC-3fi -->
### post-sale-US7-TC35-1: Setup Overdue is the only waiting mark, and a flagged order counts from its flag

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* An order in Awaiting Setup whose lot closed 30 hours ago.
* An order whose lot closed 50 hours ago with no setup confirmed.
* An order in Preparing Invoice whose winner confirmed setup 80 hours ago.
* An order in Pending Payment whose invoice was sent 3 days ago, flagged 2 days ago for a card payment on its replaced invoice.
* admin(operator) is on Orders.

**Steps:**

1. Read each order's status and how long it has waited, under All.

**Expected Results:**

* The first reads Awaiting Setup, 30 hours, with no other mark.
* The second reads Setup Overdue, 2 hours, counted from its address deadline.
* The third reads Preparing Invoice, 80 hours, with no mark.
* The fourth has waited 2 days, since its flag.

<!-- trace:case id=g10adm.auction-post-sale.TC-amb rev=1 covers=g10adm.auction-post-sale.SC-3p6,g10adm.auction-post-sale.SC-34a,g10adm.auction-post-sale.SC-lq4,g10adm.auction-post-sale.SC-r1r,g10adm.auction-post-sale.SC-vg7 -->
### post-sale-US7-TC36-1: A missing grant is named, and proof files open for every operator

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* A Payment Overdue order whose invoice is bank transfer.
* A Shipped order whose winner's payment proof an operator confirmed.
* A Preparing Shipment order.

**Steps:**

1. As admin(operator whose roles are exactly `staff`), open the Payment Overdue order and read the header and More.
2. As admin(operator whose roles are exactly `finance`), open the Shipped order, open the winner's proof file, and read Confirm delivery.
3. As the finance operator, open the Preparing Shipment order and read Dispatch.
4. Send each refused action straight to the server: the staff operator's reissue, the finance operator's delivery with a proof-of-delivery file, and the finance operator's dispatch.
5. As the finance operator, cancel the Payment Overdue order with a category and a note.

**Expected Results:**

* For staff, Reissue stays in the header disabled, and Record payment and Cancel are listed under More disabled, each naming payment processing.
* For finance, the proof file opens, and Confirm delivery stays disabled, naming shipment processing.
* On the Preparing Shipment order, Dispatch stays in the header disabled, with text beneath it naming shipment processing.
* The server refuses all three actions and stores no file.
* The cancel succeeds: the order reads Cancelled, and the timeline names the finance operator.

<!-- trace:case id=g10adm.auction-post-sale.TC-h29 rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-obc,g10adm.auction-post-sale.SC-5ky,g10adm.auction-post-sale.SC-5at,g10adm.auction-post-sale.SC-hto,g10adm.auction-post-sale.SC-ltc,g10adm.auction-post-sale.SC-3fi -->
### post-sale-US7-TC37-1: Money that counts toward nothing blocks neither a reissue nor a cancel

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* Two Payment Overdue orders, each with a card invoice of 323225 minor units in HKD holding a card payment of 300000 flagged Amount mismatch.
* admin(operator with payment processing).

**Steps:**

1. Reissue the first with the deadline restarted and a reason.
2. Cancel the second with a category and a note.
3. Read both orders, then Needs action.

**Expected Results:**

* The first reads Pending Payment on a new invoice, and the second reads Cancelled.
* Each flagged payment is still recorded and flagged Amount mismatch.
* Both orders are still listed under Needs action.

### post-sale-US7-TC39-1: A reissue leaves the winner's suspension standing

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* customer(winner) is suspended, and their order's invoice is `expired`.
* admin(operator with payment processing) opens the order.

**Steps:**

1. Reissue the invoice with a new deadline and the reason `Winner asked for more time`.
2. Read what the reissue dialog offers, then the winner's account on the order.

**Expected Results:**

* The reissue dialog offers no reinstatement.
* After the reissue the order reads Pending Payment, and the winner's account is still suspended.

### post-sale-US7-TC40-1: Setup Overdue changes nothing however long it waits

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* An order in Setup Overdue, its address deadline passed 30 days ago with no operator action.
* admin(operator) opens it.

**Steps:**

1. Read the order's status and the winner's account.

**Expected Results:**

* The order still reads Setup Overdue.
* The winner's account is not suspended.

### post-sale-US7-TC41-1: An order in Setup Overdue is cancelled and its item is back in stock

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* An order in Setup Overdue.
* admin(operator with payment processing) opens it.

**Steps:**

1. Cancel the order with a cancellation category and the note `Winner never confirmed`.
2. Read the order, its lot in the Listings table, the item's stock and the winner's account.

**Expected Results:**

* The order reads Cancelled.
* The lot is still Closed, and its item is back in stock.
* The winner's account is not suspended.

### post-sale-US7-TC42-1: A pending bank transfer invoice offers Reissue and Record payment, never a proof check

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* An order in Pending Payment whose bank transfer invoice is `pending`, with no proof uploaded.
* admin(operator with payment processing) opens it.

**Steps:**

1. Read the header and More.

**Expected Results:**

* Reissue and Record payment are offered.
* Confirm and Return are not offered.

---

## post-sale-US8: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

<!-- trace:case id=g10adm.auction-post-sale.TC-i9j rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### post-sale-US8-TC1-1: Failed payment attempts distinguish a buyer who tried

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* `<order_5>`'s winner was declined three times before the deadline elapsed.
* `<order_6>`'s log holds only its issued entry.
* admin(holds payment-processing) is on `<order_5>`.

**Steps:**

1. Read the invoice log on `<order_5>`.
2. Open `<order_6>`.
3. Read the invoice log on `<order_6>`.

**Expected Results:**

* Step 1 shows three failed payment attempts with timestamps.
* Step 3 shows only the issued entry, unlike `<order_5>`.

<!-- trace:case id=g10adm.auction-post-sale.TC-uap rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### post-sale-US8-TC2-1: The address at dispatch survives a later correction

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* `<order_7>` was dispatched to `<address at dispatch>`.
* An operator later corrected that address to `<corrected address>`.
* admin(holds payment-processing) is on `<order_7>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<address at dispatch>` | The delivery address recorded on the dispatch event |
| `<corrected address>` | A later address, different from `<address at dispatch>` |

**Steps:**

1. Read the dispatch event in the fulfilment log.
2. Read the correction event in the fulfilment log.

**Expected Results:**

* Step 1 still shows `<address at dispatch>` in full, as at dispatch.
* Step 2 is a later event carrying its own snapshot.

<!-- trace:case id=g10adm.auction-post-sale.TC-uy0 rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### post-sale-US8-TC3-1: The detail names the rule behind a derived status

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* `<order_8>`'s invoice is `pending`.
* Its deadline elapsed two days ago (any time after the deadline).
* admin(holds payment-processing) is on Orders under `/auction`.

**Steps:**

1. Open `<order_8>`.
2. Read the order status.
3. Read the explanation beside the status.

**Expected Results:**

* Step 2 shows the order status Expired.
* Step 3 names pending invoice, elapsed deadline, not only Expired.

<!-- trace:case id=g10adm.auction-post-sale.TC-fph rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### post-sale-US8-TC4-1: A buyer's reissue history spans all their orders

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* `<buyer>` has reissues on three different auction orders, `<order_9>` among them.
* admin(holds payment-processing) is on Orders under `/auction`.

**Steps:**

1. Open `<order_9>`.
2. Read `<buyer>`'s reissue history.
3. Read the reissue count for `<order_9>`.

**Expected Results:**

* Step 2 shows `<buyer>`'s reissue history across all three orders.
* Step 3 shows the reissue count for `<order_9>` itself.

<!-- trace:case id=g10adm.auction-post-sale.TC-r9c rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### post-sale-US8-TC5-1: Refunds add to the order history

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* The order already has invoice entries and fulfilment entries.
* A refund record is already on that order.
* admin(holds refund-processing) is on that order.

**Steps:**

1. Read the order history.

**Expected Results:**

* Step 1: invoice and fulfilment entries remain beside the refund record.

### post-sale-US8-TC6-1: The log keeps the proof check with both reasons

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(auction operator) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> was uploaded, returned with <external reason> and <internal reason>, re-uploaded and confirmed.

**Steps:**

1. Open the invoice log.

**Expected Results:**

* Each upload is an entry with the time left.
* The return entry shows both reasons.
* The confirm entry lists the proof files.
* Entries are in time order.

### post-sale-US8-TC7-1: A replaced invoice stays readable on the order

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(auction operator) is on <order_1> in <grade10 auction admin post-sale url>.
* <invoice_1> was replaced by <invoice_2>.

**Steps:**

1. Open <invoice_1> and its PDF.

**Expected Results:**

* <invoice_1> shows no status of its own, never Cancelled.
* Its PDF names <invoice_2>.

### post-sale-US8-TC8-1: Operators read the internal audit numbers

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(auction operator) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1>'s first invoice holds `#00010482`, its reissued invoice `#00010490`, and its receipt `#00010495`.

**Steps:**

1. Open the order.
2. Read the invoice log.

**Expected Results:**

* The order shows each number against its invoice or receipt.
* The sent entry shows `#00010482`.
* The reissued entry shows `#00010490`.
* The paid entry shows `#00010495`.

<!-- trace:case id=g10adm.auction-post-sale.TC-gwq rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt,g10adm.auction-post-sale.SC-fzw,g10adm.auction-post-sale.SC-37a -->
### post-sale-US8-TC9-1: A log entry names the operator signed in, not the one claimed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(operator with payment processing) is signed in as `ops@grade10.com`.
* An order in Pending Payment.

**Steps:**

1. Reissue the invoice with a reason, sending an action that names another operator and a time a day earlier.
2. Read the reissued entry.

**Expected Results:**

* The entry names `ops@grade10.com`.
* Its time is when Grade10 received the reissue.

### post-sale-US8-TC10-1: A reissue's entry names its amount change and each part it changed

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* The HKD card rule is 3.4% and HK$2.35.
* An order in Pending Payment whose card invoice has Shipping & Handling of 8000, a fee of 11225 and an order total of 323225 minor units in HKD.
* admin(operator with payment processing) opens it.

**Steps:**

1. Reissue it, switching the method to bank transfer with the fee left empty, raising Shipping & Handling to `120.00`, keeping the deadline, with a reason.
2. Read the reissued entry on the timeline.

**Expected Results:**

* The entry carries the new order total of 316000 minor units in HKD, the delta of -7225 from the prior entry, and the deadline kept.
* It names payment method, card to bank transfer; payment processing fee, 11225 to 0; and Shipping & Handling, 8000 to 12000, each with its value before and after.
* It names no other part as changed.

### post-sale-US8-TC11-1: A relisted lot's cancelled order keeps its whole history

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* A cancelled order whose lot has since been relisted and sold to another winner.
* admin(operator) opens the cancelled order.

**Steps:**

1. Read its timeline from the first entry to the last.

**Expected Results:**

* Every invoice and fulfilment entry it held at its cancellation is still there, unchanged.
* No entry offers an edit or a delete.

### post-sale-US8-TC12-1: A paid entry names how it was paid

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* An order its winner paid by a Visa card ending 4242.
* An order an operator settled by cash, with one proof file.
* admin(operator) opens each.

**Steps:**

1. Read the paid entry on the first order's timeline.
2. Read the payment recorded entry on the second order's timeline.

**Expected Results:**

* The first names a Visa card ending 4242.
* The second names cash, with its proof file.

<!-- trace:case id=g10adm.auction-post-sale.TC-0ok rev=1 covers=g10adm.auction-post-sale.SC-tyi -->
### post-sale-US8-TC13-1: A reissue that changes tax names it with its value before and after

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* An order in Pending Payment whose invoice carries no Tax.
* admin(operator with payment processing) opens it.

**Steps:**

1. Reissue it adding Tax of 6000 minor units in HKD, changing nothing else, with a reason.
2. Read the reissued entry on the timeline.

**Expected Results:**

* The entry names Tax as changed, with no amount before and 6000 minor units in HKD after.
* It names no other part as changed.

<!-- trace:case id=g10adm.auction-post-sale.TC-j9i rev=1 covers=g10adm.auction-post-sale.SC-lfk,g10adm.auction-post-sale.SC-98a -->
### post-sale-US8-TC14-1: A repeated request happens once, and a request used for another action is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* An auction order in Preparing Invoice.
* admin(operator with payment processing) opens it.

**Steps:**

1. Send the invoice, then submit the same request again.
2. Make the same request to record a payment on the order.
3. Read the order, its timeline and the winner's mail.

**Expected Results:**

* The repeat answers the outcome of the first send.
* The order holds one invoice, one sent entry and one invoice letter.
* The payment request is refused, the dialog tells the operator to open it again, and no payment or entry is added.

---

## post-sale-US10: Operator checks a winner's payment proof

**As a** payment operator,
**I want** to see the proof a winner uploaded against the invoice, then confirm the payment or return the invoice with a reason,
**so that** money I can match settles the order, and a winner whose proof I cannot match knows why and keeps the time they had.

### post-sale-US10-TC1-1: Confirming proof settles the invoice with the winner's files

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying with <files> uploaded.

**Test data:**

| Field | Value |
| --- | --- |
| <files> | 5 files: PDF, JPEG and PNG |

**Steps:**

1. Open the proof on the invoice.
2. Confirm the payment.

**Expected Results:**

* Step 1 shows every one of <files>.
* The invoice is `paid`; the order reads Processing.
* <files> are recorded as the payment proof.

### post-sale-US10-TC2-1: The operator adds their own proof when confirming

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying with 1 winner file.

**Steps:**

1. Add one bank statement file.
2. Confirm the payment.

**Expected Results:**

* The proof lists the winner file and the operator file.
* The invoice is `paid`.

### post-sale-US10-TC3-1: Returning proof shows time left and resumes the deadline

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying with <time left> kept.

**Test data:**

| Field | Value |
| --- | --- |
| <time left> | 2 days 5 hours |

**Steps:**

1. Open Return.
2. Enter an external and an internal reason.
3. Return.

**Expected Results:**

* Step 1 shows <time left>.
* The invoice is `pending`, deadline now plus <time left>.
* The order reads Pending Payment.

### post-sale-US10-TC4-1: Return is refused without both reasons

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Test data:**

| <reasons> |
| --- |
| neither |
| external only |
| internal only |

**Steps:**

1. Open Return.
2. Enter <reasons>.
3. Return.

**Expected Results:**

* The return is refused, naming the missing reason.
* The order stays Payment Verifying.

### post-sale-US10-TC5-1: Confirm and Return are not offered on an expired invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `expired`, with no proof.

**Steps:**

1. Look for Return and Confirm.
2. Send a Return for <order_1> from outside the page.

**Expected Results:**

* Neither Return nor Confirm is offered.
* Reissue, settle and cancel are offered.
* Step 2 is refused; the invoice stays `expired`.

### post-sale-US10-TC6-1: Check actions are not offered on a pending order

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a bank transfer invoice, `pending`, no proof.

**Steps:**

1. Look for Confirm and Return.

**Expected Results:**

* Neither is offered.

### post-sale-US10-TC7-1: A second operator acting on the same check is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** post-sale-US-10

**Pre-conditions:**

* Two admin(holds payment-processing) have <order_1> open, Payment Verifying.

**Steps:**

1. Operator A confirms.
2. Operator B returns.

**Expected Results:**

* Step 2 is refused.
* The invoice stays `paid`; no proof-not-accepted letter goes out.

### post-sale-US10-TC8-1: Who can read the winner's proof files

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-10

**Pre-conditions:**

* <order_1> is Payment Verifying with winner files.

**Test data:**

| <requester> | <outcome> |
| --- | --- |
| admin(without payment-processing), able to open <order_1> | The file is returned |
| customer(winner of <order_1>) | Refused |
| A signed-out request | Refused |

**Steps:**

1. Request a proof file on <order_1> as <requester>.

**Expected Results:**

* The request is <outcome>.

### post-sale-US10-TC9-1: One bad operator file refuses the confirm

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> is Payment Verifying.

**Test data:**

| <operator files> |
| --- |
| One PDF and one JPEG of 10,485,761 bytes |
| Six PDFs |

**Steps:**

1. Attach <operator files>.
2. Confirm the payment.

**Expected Results:**

* The confirm is refused.
* No operator file is stored; the order stays Payment Verifying.

---

## post-sale-US11: Operator adds a missing billing address before sending

**As an** operator,
**I want** to add the billing address to an order that has none before I send its invoice,
**so that** no invoice goes out without a billing address the winner gave.

### post-sale-US11-TC1-1: Send is refused when billing is missing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-11

**Pre-conditions:**

* admin(holds payment-processing) is on <grade10 auction admin order url> for an order with a delivery address and no billing address.

**Steps:**

1. Submit the invoice for sending.

**Expected Results:**

* Sending is refused.
* The refusal names the missing billing address.
* No invoice is sent.

### post-sale-US11-TC2-1: The operator records billing and then sends

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
* **Trace:** post-sale-US-11

**Pre-conditions:**

* admin(holds payment-processing) is on <grade10 auction admin order url> for an order with a delivery address and no billing address.

**Steps:**

1. Open the address edit.
2. Leave Same as delivery address selected.
3. Record the billing address with a reason.
4. Submit the invoice for sending.

**Expected Results:**

* The phone record captures billing as the delivery address.
* The quote shows Bill To and Ship To.
* The invoice is sent.

---

## post-sale-US12: Operator collects a lot's price across more than one payment

**As an** operator,
**I want** to record each payment as it arrives and see the order until it is settled,
**so that** every partial payment is recorded without tracking the balance outside Grade10.

<!-- trace:case id=g10adm.auction-post-sale.TC-yws rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
### post-sale-US12-TC1-1: A partial payment starts collection

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
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<pending invoice>` is unpaid and its balance is 100000 minor units in HKD.
* admin(holds payment-processing) is on the order detail.

**Steps:**

1. Record a 40000-minor-unit payment with its method, reference and proof.

**Expected Results:**

* The payment is accepted.
* The order outcome is Partially Paid.
* The payment record has its own receipt number and the remaining balance is 60000 minor units.

<!-- trace:case id=g10adm.auction-post-sale.TC-3z7 rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
### post-sale-US12-TC2-1: Repeated payments keep one order history

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
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<partially-paid invoice>` has one recorded payment and money remains due.
* admin(holds payment-processing) is on the order detail.

**Steps:**

1. Record a second payment smaller than the current balance.
2. Read the payment history and the order outcome.

**Expected Results:**

* The second payment is accepted as a new payment.
* Both payments remain in oldest-first order.
* The order remains Partially Paid until its invoice is closed.

<!-- trace:case id=g10adm.auction-post-sale.TC-uz7 rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
### post-sale-US12-TC3-1: The closing prompt does not discard the payment

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
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<partially-paid invoice>` has cumulative payments of 90000 minor units against an original total of 100000 minor units.
* admin(holds payment-processing) is recording another payment.

**Steps:**

1. Record a payment of 5000 minor units.
2. Choose to keep the invoice open.
3. Record an exact 5000-minor-unit balance payment.

**Expected Results:**

* Step 1 asks whether to close or keep collecting.
* Step 2 leaves the order Partially Paid with the real balance.
* Step 3 closes the invoice as Paid without a second prompt.

<!-- trace:case id=g10adm.auction-post-sale.TC-qpm rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
### post-sale-US12-TC4-1: An overpayment needs confirmation before Paid

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
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<partially-paid invoice>` has cumulative payments of 90000 minor units against an original total of 100000 minor units.
* admin(holds payment-processing) is recording another payment.

**Steps:**

1. Enter a payment of 15000 minor units.
2. Confirm the overpayment dialog.

**Expected Results:**

* The dialog appears before the payment is recorded and the invoice is marked Paid.
* The full 15000-minor-unit payment is recorded.
* The invoice is Paid and the excess is not a separate adjustment line.

<!-- trace:case id=g10adm.auction-post-sale.TC-mrv rev=1 covers=g10adm.auction-post-sale.SC-9nm,g10adm.auction-post-sale.SC-k4t -->
### post-sale-US12-TC5-1: Paid is refused below the closing tolerance

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<partially-paid invoice>` has cumulative payments of 80000 minor units against an original total of 100000 minor units.
* admin(holds payment-processing) is recording another payment.

**Steps:**

1. Record a payment of 5000 minor units and try to update the invoice to Paid.
2. Record a further payment of 5000 minor units.

**Expected Results:**

* Step 1 is refused because 85000 minor units is below 90% of the original total; the payment is recorded and the order reads Partially Paid with the real 15000-minor-unit balance.
* Step 2 brings the total to 90000 minor units and offers the choice to close as Paid or keep collecting.

<!-- trace:case id=g10adm.auction-post-sale.TC-pfj rev=1 covers=g10adm.auction-post-sale.SC-pxo -->
### post-sale-US12-TC6-1: A recorded payment fixes the invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<partially-paid invoice>` has one recorded payment of 40000 minor units.
* admin(holds payment-processing) is on the order detail.

**Steps:**

1. Try to reissue the invoice.
2. Try to cancel the order.
3. Open Record payment.

**Expected Results:**

* Steps 1 and 2 are refused and the invoice's address, method and total are unchanged.
* Step 3 offers Record payment and the order remains Partially Paid.

<!-- trace:case id=g10adm.auction-post-sale.TC-dwh rev=1 covers=g10adm.auction-post-sale.SC-mhe -->
### post-sale-US12-TC7-1: Money that counts toward nothing leaves Reissue and Cancel open

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
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<first order>` and `<second order>` are in Pending Payment, and each one's only recorded payment counts toward nothing.
* admin(holds payment-processing) is on the order detail.

**Steps:**

1. Reissue `<first order>`'s invoice with a reason.
2. Cancel `<second order>` with a reason.

**Expected Results:**

* Step 1 is accepted and `<first order>` reads Pending Payment on a new invoice.
* Step 2 is accepted and `<second order>` reads Cancelled.
* Each payment is still recorded on its order.

---

## post-sale-US13: Operator cancels an order knowing what follows

**As an** operator with payment processing,
**I want** to choose a reason and see the consequences before confirming,
**so that** every cancellation is deliberate and countable.

<!-- trace:case id=g10adm.auction-post-sale.TC-atu rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh,g10adm.auction-post-sale.SC-kcq -->
### post-sale-US13-TC1-1: The cancellation dialog requires the reason and consequences

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-13

**Pre-conditions:**

* `<unpaid order>` is cancellable.
* admin(holds payment-processing) is on its detail.

**Steps:**

1. Open Cancel and inspect the dialog.
2. Submit without a category or note.
3. Choose Missed setup, enter a note and confirm.

**Expected Results:**

* The dialog names stock return, no runner-up, winner email, suspension retention and irreversibility.
* The incomplete form is refused.
* The cancel is accepted with the selected category and note.
* The lot is back in stock and the order links to it for manual relisting.

<!-- trace:case id=g10adm.auction-post-sale.TC-f0r rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh -->
### post-sale-US13-TC2-1: Cancellation categories filter the queue

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
* **Trace:** post-sale-US-13

**Pre-conditions:**

* The queue contains cancelled orders with different reason categories.

**Steps:**

1. Filter cancelled orders to Lot issue.

**Expected Results:**

* Only orders cancelled for Lot issue are returned.

<!-- trace:case id=g10adm.auction-post-sale.TC-hmz rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh,g10adm.auction-post-sale.SC-kcq,g10adm.auction-post-sale.SC-30g,g10adm.auction-post-sale.SC-i4m -->
### post-sale-US13-TC3-1: A cancelled order links to its returned lot

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
* **Trace:** post-sale-US-13

**Pre-conditions:**

* An unpaid auction order has been cancelled and its lot returned to stock.

**Steps:**

1. Open the cancelled order.
2. Follow its lot link.

**Expected Results:**

* The link opens the same lot, available for manual relisting.

<!-- trace:case id=g10adm.auction-post-sale.TC-2ai rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh,g10adm.auction-post-sale.SC-kcq,g10adm.auction-post-sale.SC-30g,g10adm.auction-post-sale.SC-i4m -->
### post-sale-US13-TC4-1: Money that counts toward nothing does not block cancellation

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-13

**Pre-conditions:**

* An unpaid order has a recorded card payment that counts toward nothing.

**Steps:**

1. Cancel the order with a category and note.

**Expected Results:**

* Cancellation succeeds, the order reads Cancelled and the lot returns to stock.
* The recorded payment remains available for Finance to return outside Grade10.

<!-- trace:case id=g10adm.auction-post-sale.TC-0dj rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh,g10adm.auction-post-sale.SC-kcq,g10adm.auction-post-sale.SC-30g,g10adm.auction-post-sale.SC-i4m -->
### post-sale-US13-TC5-1: Money that counts toward the balance blocks cancellation

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-13

**Pre-conditions:**

* An unpaid order has a card payment that counts toward the balance committing before cancellation.

**Steps:**

1. Confirm cancellation with a category and note.

**Expected Results:**

* Cancellation is refused with "This order has a recorded payment. Refund it instead of cancelling."
* The order reads Paid and the lot stays with it.

---

## post-sale-US14: Operator returns money paid after a cancel

**As an** operator,
**I want** a late card payment to remain flagged until Finance returns it,
**so that** no winner pays for a cancelled lot without a follow-up.

<!-- trace:case id=g10adm.auction-post-sale.TC-qn8 rev=1 covers=g10adm.auction-post-sale.SC-23g -->
### post-sale-US14-TC1-1: A late payment is flagged without reviving the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-14

**Pre-conditions:**

* `<cancelled order>` is terminal and its lot is available.

**Steps:**

1. Record a card payment received after cancellation.

**Expected Results:**

* The payment is kept in the invoice log.
* The order remains Cancelled and shows Paid after cancel.

<!-- trace:case id=g10adm.auction-post-sale.TC-5vf rev=3 covers=g10adm.auction-post-sale.SC-23g,g10adm.auction-post-sale.SC-18a -->
### post-sale-US14-TC2-3: Clearing the late-payment flag keeps the order cancelled

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-14

**Pre-conditions:**

* A cancelled order has two late payments, each with its own Paid after cancel flag.
* Finance returned both payments outside Grade10; one has a return reference and one has none (the first none, the second one).

**Steps:**

1. As an operator holding `auction:payment`, clear the first payment's flag with a written reason and no return reference.
2. Check the second payment's flag.
3. Clear the second flag with a written reason and its return reference.

**Expected Results:**

* Each clear action succeeds and records the reason, actor and timestamp.
* The first records no return reference; the second records its supplied one.
* After step 1 the second payment is still flagged.
* The order remains Cancelled and its lot remains in stock.

---

## post-sale-US15: Operator filters Setup Overdue and Payment Overdue

**As an** operator,
**I want** Setup Overdue and Payment Overdue as queue outcomes,
**so that** I find deadline-missed orders using the same names as the winner.

<!-- trace:case id=g10adm.auction-post-sale.TC-gap rev=1 covers=g10adm.auction-post-sale.SC-vhw,g10adm.auction-post-sale.SC-bs6 -->
### post-sale-US15-TC1-1: The queue uses the two overdue outcomes

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
* **Trace:** post-sale-US-15

**Pre-conditions:**

* Orders has one order past an incomplete setup deadline (any time after that deadline).
* Orders has one unpaid invoice past its payment deadline (any time after that deadline).
* admin is on Orders under `/auction`.

**Steps:**

1. Read the row past its setup deadline.
2. Read the row past its payment deadline.
3. Filter Orders to Setup Overdue.
4. Filter Orders to Payment Overdue.

**Expected Results:**

* Steps 1 and 2 read Setup Overdue and Payment Overdue.
* Steps 3 and 4 each return only the matching order.

<!-- trace:case id=g10adm.auction-post-sale.TC-n26 rev=1 covers=g10adm.auction-post-sale.SC-vhw,g10adm.auction-post-sale.SC-bs6 -->
### post-sale-US15-TC2-1: Overdue outcomes do not erase the action context

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-15

**Pre-conditions:**

* Orders contains one Setup Overdue order and one Payment Overdue order.
* admin is on Orders under `/auction`.

**Steps:**

1. Read the Setup Overdue row's needs-action treatment.
2. Open the Setup Overdue order.
3. Read the Payment Overdue row's needs-action treatment.
4. Open the Payment Overdue order.

**Expected Results:**

* Steps 1 and 3 show one outcome each.
* Steps 2 and 4 name the missed deadline and offer the winner Contact Us, not self-service.

---

## post-sale-US16: Operator records a refund a winner asked Customer Service for

**As an** operator with refund processing,
**I want** to record the refund I sent in Stripe or by bank transfer on the order, with its amount, reason, reference and proof, and say whether the lot goes back to stock,
**so that** a closing refund reads Refunded, an overpayment keeps the order's status, and the lot's stock matches where the card is.

<!-- trace:case id=g10adm.auction-post-sale.TC-c92 rev=2 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs -->
### post-sale-US16-TC1-2: A bank refund names where it went, is restated, and closes the order

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-16

**Pre-conditions:**

* A Delivered order paid 312000 minor units in HKD.
* admin(operator with refund processing) opens Refund.

**Steps:**

1. Enter `3120.00`, the reason Not as described, FPS to the bank `HSBC` and the FPS ID `12345678`, the reference `FPS-99812`, refunded on 2026-09-25, the lot back to stock and one proof file.
2. Read the restatement, then commit.
3. Read the refund record and the header.

**Expected Results:**

* The restatement names 312000 minor units in HKD, FPS, `HSBC`, the FPS ID masked to its last four digits `5678`, and the lot back to stock, and says this is the order's only refund and cannot be undone.
* The refund record carries FPS, `HSBC`, the masked FPS ID, 2026-09-25, the reason, the operator and the time, and gets the next audit number.
* Neither the refund record nor the timeline shows `12345678`.
* The order reads Refunded, the lot is back in stock, and a second refund is refused.

<!-- trace:case id=g10adm.auction-post-sale.TC-h64 rev=1 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs -->
### post-sale-US16-TC2-1: A refund cannot return more than was paid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-16

**Pre-conditions:**

* `<partially-paid order>` has `<partial amount>` paid.
* admin(holds refund-processing) is on `<partially-paid order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<partial amount>` | 40000 minor units |
| `<over refund>` | 40001 minor units (one minor unit over `<partial amount>`) |

**Steps:**

1. Start the refund on `<partially-paid order>`.
2. Enter `<over refund>`.
3. Submit the refund.
4. Read the order status.

**Expected Results:**

* Step 3 refuses the refund and consumes no audit number.
* Step 4 still shows Partially Paid.

<!-- trace:case id=g10adm.auction-post-sale.TC-d65 rev=1 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs,g10adm.auction-post-sale.SC-dwy,g10adm.auction-post-sale.SC-brr,g10adm.auction-post-sale.SC-qno -->
### post-sale-US16-TC3-1: A refund of the overpaid difference keeps the status

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
* **Trace:** post-sale-US-16

**Pre-conditions:**

* A Preparing Shipment order whose invoice of 312000 minor units in HKD was paid 320000, the overpayment confirmed when it was recorded.
* admin(operator with refund processing) opens Refund.

**Steps:**

1. Record a refund of `80.00` for Duplicate or overpayment, with its reference and a proof file.
2. Read the header, then try a second refund.

**Expected Results:**

* The order still reads Preparing Shipment.
* The second refund is refused.

<!-- trace:case id=g10adm.auction-post-sale.TC-iym rev=1 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs,g10adm.auction-post-sale.SC-dwy,g10adm.auction-post-sale.SC-brr,g10adm.auction-post-sale.SC-qno -->
### post-sale-US16-TC4-1: An FPS email is kept to its first letter and domain

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-16

**Pre-conditions:**

* A Delivered order paid 312000 minor units in HKD.
* admin(operator with refund processing).

**Steps:**

1. Record a refund of `3120.00` by FPS to the bank `HSBC` and the email `collector@example.com`, with its reason, reference and proof.
2. Read the refund record and the timeline.

**Expected Results:**

* The refund record keeps the email as its first letter `c` and its domain `example.com`.
* Neither the refund record nor the timeline shows `collector@example.com`.

### post-sale-US16-TC5-1: A refund closes a partially paid order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-16

**Pre-conditions:**

* A Partially Paid order with 40000 minor units in HKD paid.
* admin(operator with refund processing) opens Refund.

**Steps:**

1. Record a refund of `400.00` by bank, with its reason, reference and a proof file, the lot back to stock.
2. Read the order and the refund record.

**Expected Results:**

* The order reads Refunded.
* The refund record carries the amount of 40000 minor units in HKD, the method, the next audit number and the stock choice.

---

## post-sale-US17: Finance reconciles auction refunds

**As a** finance operator,
**I want** to filter the queue to Refunded and read the full refund record,
**so that** each external refund matches one Grade10 record.

<!-- trace:case id=g10adm.auction-post-sale.TC-8st rev=1 covers=g10adm.auction-post-sale.SC-9zs -->
### post-sale-US17-TC1-1: The queue and order detail expose one refund record

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
* **Trace:** post-sale-US-17

**Pre-conditions:**

* A Refunded order has a recorded amount, method, reference, reason, proof and audit number.
* admin(holds refund-processing) is on Orders under `/auction`.

**Steps:**

1. Filter Orders to Refunded.
2. Open the Refunded order.
3. Open its invoice log.

**Expected Results:**

* Step 1 shows that order in the Refunded filter.
* Steps 2 and 3 show the same complete refund record.

---

## post-sale-US18: Operator reopens the address form

**As an** operator,
**I want** to give a winner who missed the 48-hour address deadline a fresh 48 hours, with my reason on the record,
**so that** a winner who got in touch can finish the order without me cancelling the lot.

<!-- trace:case id=g10adm.auction-post-sale.TC-unr rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### post-sale-US18-TC1-1: Reopen gives a fresh 48 hours from the moment it reopens

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-18

**Pre-conditions:**

* `<closed-window order>` derives as Setup Overdue, its lot closed at 2026-09-03T12:00:00Z and its address deadline passed at 2026-09-05T12:00:00Z.
* admin(holds payment-processing) is on `<closed-window order>` at `<the reopen>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the reopen>` | 2026-09-07T09:00:00Z |
| `<reason>` | The operator's stated reason for the reopen |
| New address deadline | 2026-09-09T09:00:00Z |

**Steps:**

1. Reopen the address form on `<closed-window order>` with `<reason>`.
2. Read the address deadline.

**Expected Results:**

* The reopen is accepted.
* The address deadline is 2026-09-09T09:00:00Z, 48 hours from `<the reopen>`.
* It is not measured from the lot close.

<!-- trace:case id=g10adm.auction-post-sale.TC-6p3 rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### post-sale-US18-TC2-1: Reopen without a reason is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-18

**Pre-conditions:**

* `<closed-window order>` derives as Setup Overdue and its address deadline passed two days ago.
* admin(holds payment-processing) is on `<closed-window order>`.

**Steps:**

1. Open the reopen form.
2. Commit the reopen with the reason left empty.
3. Read the address deadline.

**Expected Results:**

* The reopen is refused.
* The address deadline is unchanged.
* The winner still cannot confirm an address.

<!-- trace:case id=g10adm.auction-post-sale.TC-l8m rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### post-sale-US18-TC3-1: Reopen is refused without the payment-processing grant

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
* **Trace:** post-sale-US-18

**Pre-conditions:**

* `<closed-window order>` derives as Setup Overdue and its address deadline passed two days ago.
* admin(holds fulfilment, not payment-processing) is on `<closed-window order>`.

**Steps:**

1. Look for the reopen control on `<closed-window order>`.
2. Submit a reopen with a reason.

**Expected Results:**

* The reopen control is visible and disabled.
* The reopen is refused.
* The address deadline is unchanged.

<!-- trace:case id=g10adm.auction-post-sale.TC-r1s rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### post-sale-US18-TC4-1: Reopen derives Awaiting Setup from Setup Overdue

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
* **Trace:** post-sale-US-18

**Pre-conditions:**

* `<closed-window order>` derives as Setup Overdue and its address deadline passed two days ago.
* admin(holds payment-processing) is on `<closed-window order>`.

**Steps:**

1. Reopen the address form with a reason.
2. Read the order's outcome and needs-action treatment on the queue.

**Expected Results:**

* The reopened facts derive Awaiting Setup.
* The address form is open again.
* The row no longer needs action.

<!-- trace:case id=g10adm.auction-post-sale.TC-htq rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### post-sale-US18-TC5-1: A second reopen starts the 48 hours again

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
* **Trace:** post-sale-US-18

**Pre-conditions:**

* `<closed-window order>` was reopened once at 2026-09-07T09:00:00Z and its fresh address deadline passed unused at 2026-09-09T09:00:00Z.
* admin(holds payment-processing) is on `<closed-window order>` at `<the second reopen>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the second reopen>` | 2026-09-10T15:00:00Z |
| Entrance close after it | 2026-09-12T15:00:00Z |

**Steps:**

1. Reopen the address form a second time with a reason.
2. Read the address deadline.

**Expected Results:**

* The second reopen is accepted.
* The address deadline is 2026-09-12T15:00:00Z.
* No cap on the number of reopens is applied.

<!-- trace:case id=g10adm.auction-post-sale.TC-t9r rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### post-sale-US18-TC6-1: No reopen is offered once the invoice has been sent

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-18

**Pre-conditions:**

* `<sent-invoice order>` carries a confirmed address and an invoice sent at 2026-09-05T09:00:00Z.
* admin(holds payment-processing) is on `<sent-invoice order>`.

**Steps:**

1. Look for the reopen control on `<sent-invoice order>`.
2. Read what the detail offers for an address change.

**Expected Results:**

* No reopen control is offered on a sent invoice.
* The detail offers a re-quote and reissue instead.
* The locked address is unchanged.

<!-- trace:case id=g10adm.auction-post-sale.TC-itu rev=1 covers=g10adm.auction-post-sale.SC-egm -->
### post-sale-US18-TC27-1: A confirmed address cannot reopen

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-18

**Pre-conditions:**

* `<preparing-invoice order>` has a confirmed address, no sent invoice, and an elapsed address deadline.
* admin(holds payment-processing) is on `<preparing-invoice order>`.

**Steps:**

1. Attempt to reopen the address form with a reason.
2. Read the order outcome and address controls.

**Expected Results:**

* The reopen is refused.
* The order remains Preparing Invoice.
* The winner receives no reopened address form.

<!-- trace:case id=g10adm.auction-post-sale.TC-5rs rev=1 covers=g10adm.auction-post-sale.SC-fzv,g10adm.auction-post-sale.SC-blu,g10adm.auction-post-sale.SC-su0 -->
### post-sale-US18-TC7-1: Reopen is logged with its reason and its new close

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
* **Trace:** Audit trail

**Pre-conditions:**

* `<closed-window order>` was reopened at 2026-09-07T09:00:00Z by admin(holds payment-processing) with `<reason>`.
* admin(holds payment-processing) is on `<closed-window order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<reason>` | The operator's stated reason for the reopen |

**Steps:**

1. Read the order's log.

**Expected Results:**

* The log holds a reopen entry timestamped 2026-09-07T09:00:00Z.
* It names the operator, `<reason>`, and the new address deadline.
* Earlier entries are unchanged beside it.

<!-- trace:case id=g10adm.auction-post-sale.TC-w9k rev=1 covers=g10adm.auction-post-sale.SC-gw4,g10adm.auction-post-sale.SC-i7j,g10adm.auction-post-sale.SC-seg,g10adm.auction-post-sale.SC-cbk,g10adm.auction-post-sale.SC-yd7,g10adm.auction-post-sale.SC-i16 -->
### post-sale-US18-TC8-1: The two pre-invoice outcomes filter apart

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
* **Trace:** Queue

**Pre-conditions:**

* `<awaiting-address order>` has no confirmed address and `<preparing-invoice order>` has one, neither with an invoice sent.
* admin(holds payment-processing) is on the post-sale queue.

**Steps:**

1. Filter the queue to Awaiting Setup.
2. Filter the queue to Preparing Invoice.

**Expected Results:**

* Step 1 lists `<awaiting-address order>` and not `<preparing-invoice order>`.
* Step 2 lists `<preparing-invoice order>` and not `<awaiting-address order>`.
* Each row wears one outcome.

<!-- trace:case id=g10adm.auction-post-sale.TC-qkb rev=1 covers=g10adm.auction-post-sale.SC-gw4,g10adm.auction-post-sale.SC-i7j,g10adm.auction-post-sale.SC-seg,g10adm.auction-post-sale.SC-cbk,g10adm.auction-post-sale.SC-yd7,g10adm.auction-post-sale.SC-i16 -->
### post-sale-US18-TC9-1: Only the rows waiting on an operator need action

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Queue

**Pre-conditions:**

* admin(holds payment-processing) is on the post-sale queue holding all three orders.

**Test data:**

| Order | Outcome | Needs action |
| --- | --- | --- |
| `<awaiting-address order>` | Awaiting Setup | no |
| `<preparing-invoice order>` | Preparing Invoice | yes |
| `<expired-invoice order>` | Pending Payment | yes |

**Steps:**

1. Read the row's outcome.
2. Read the row's needs-action treatment.

**Expected Results:**

* The outcome is the one the row names.
* The needs-action treatment matches the row.
* `<expired-invoice order>` shows its Expired invoice status beside Pending Payment.

<!-- trace:case id=g10adm.auction-post-sale.TC-6iu rev=1 covers=g10adm.auction-post-sale.SC-gw4,g10adm.auction-post-sale.SC-i7j,g10adm.auction-post-sale.SC-seg,g10adm.auction-post-sale.SC-cbk,g10adm.auction-post-sale.SC-yd7,g10adm.auction-post-sale.SC-i16 -->
### post-sale-US18-TC10-1: Awaiting Setup becomes Setup Overdue at the 48-hour address deadline

Runs once per row of **Test data**. The Preparing Invoice stage is intentionally not included here because it does not derive Setup Overdue; TC24 asserts that absence.

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
* **Trace:** Queue

**Pre-conditions:**

* The order's invoice has not been sent and its lot closed at 2026-09-03T12:00:00Z, so its address deadline passed at 2026-09-05T12:00:00Z.
* admin(holds payment-processing) is on the post-sale queue at the read time the row names.

**Test data:**

| Order | Read at | Outcome |
| --- | --- | --- |
| `<awaiting-address order>` | 2026-09-05T11:59:00Z | Awaiting Setup |
| `<awaiting-address order>` | 2026-09-05T12:00:00Z | Setup Overdue |

**Steps:**

1. Read the order's row at the time the row names.

**Expected Results:**

* The outcome is the one the row names.
* The order is not expired or closed by the derived status.

<!-- trace:case id=g10adm.auction-post-sale.TC-dkd rev=1 covers=g10adm.auction-post-sale.SC-gw4,g10adm.auction-post-sale.SC-i7j,g10adm.auction-post-sale.SC-seg,g10adm.auction-post-sale.SC-cbk,g10adm.auction-post-sale.SC-yd7,g10adm.auction-post-sale.SC-i16 -->
### post-sale-US18-TC24-1: Preparing Invoice does not derive Setup Overdue before invoice send

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Queue

**Pre-conditions:**

* `<preparing-invoice order>` has invoice status `not_issued` and its persisted
  48-hour address deadline has passed.
* admin(holds payment-processing) is on the post-sale queue.

**Steps:**

1. Read `<preparing-invoice order>` in the queue.

**Expected Results:**

* The order remains Preparing Invoice rather than Setup Overdue, and is not cancelled or expired.
* No payment Overdue timer or payment deadline exists before invoice send.

<!-- trace:case id=g10adm.auction-post-sale.TC-kp5 rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### post-sale-US18-TC25-1: Concurrent address write, reopen, record and send serialize

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-18

**Pre-conditions:**

* A Setup Overdue order has an expired address deadline and no confirmed address.
* A winner address write, an operator reopen, an operator record of setup and an operator invoice send can be submitted concurrently.

**Steps:**

1. Submit the four operations concurrently.
2. Read the final address snapshot, deadline and derived status.

**Expected Results:**

* The operations serialize under the order boundary.
* The final snapshot and deadline match the last committed transition.
* A send that commits carries the setup the transition before it left; one refused for lack of setup changes nothing.
* The order is internally consistent and no partial address overwrite exists.

<!-- trace:case id=g10adm.auction-post-sale.TC-20s rev=1 covers=g10adm.auction-post-sale.SC-fzv,g10adm.auction-post-sale.SC-blu,g10adm.auction-post-sale.SC-su0 -->
### post-sale-US18-TC26-1: Phone-recorded address carries an audit actor and reason

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
* **Trace:** Audit trail

**Pre-conditions:**

* A Setup Overdue order has no confirmed address.
* admin(holds payment-processing) has a phone-provided address and a reason.

**Steps:**

1. Record the address without reopening the window.
2. Read the invoice log.

**Expected Results:**

* The order derives as Preparing Invoice while the winner window remains closed.
* The log names the operator, timestamp and reason.

<!-- trace:case id=g10adm.auction-post-sale.TC-zl5 rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US18-TC11-1: Send keeps the confirmed address locked and starts the seven days

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* `<preparing-invoice order>` carries an address confirmed on 2026-09-04T08:00:00Z and no invoice.
* admin(holds payment-processing) is on `<preparing-invoice order>` at `<the send>`.

**Test data:**

| Field | Value |
| --- | --- |
| Shipping & Handling | 24000 minor units, HKD |
| `<the send>` | 2026-09-05T09:00:00Z |
| Payment deadline | 2026-09-12T09:00:00Z |

**Steps:**

1. Enter Shipping & Handling for the confirmed address.
2. Send the invoice.
3. Read the payment deadline and the delivery address.

**Expected Results:**

* The invoice is issued and the order derives Pending Payment.
* The payment deadline is 2026-09-12T09:00:00Z.
* The delivery address stays as confirmed, locked since confirmation; the send changes nothing about it.

<!-- trace:case id=g10adm.auction-post-sale.TC-84x rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US18-TC12-1: Send is refused while no address is confirmed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* `<awaiting-address order>` has no confirmed delivery address and its address form is open.
* admin(holds payment-processing) is on `<awaiting-address order>`.

**Steps:**

1. Enter Shipping & Handling of 24000 minor units in HKD.
2. Send the invoice.

**Expected Results:**

* The send is refused.
* No invoice is issued and no payment deadline starts.
* The order still derives Awaiting Setup.

<!-- trace:case id=g10adm.auction-post-sale.TC-goe rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US18-TC13-1: A closed window does not stop an operator sending

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
* **Trace:** Quote and send

**Pre-conditions:**

* `<closed-window order>` carries an address confirmed inside the 48 hours and its address deadline passed two hours ago.
* admin(holds payment-processing) is on `<closed-window order>`.

**Steps:**

1. Enter Shipping & Handling of 24000 minor units in HKD.
2. Send the invoice.

**Expected Results:**

* The send is accepted.
* The order derives Pending Payment with a seven-day deadline.
* The closed window gated the winner's write, not the operator's send.

<!-- trace:case id=g10adm.auction-post-sale.TC-29v rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### post-sale-US18-TC14-1: Cancelling before a send returns the lot to available

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<closed-window order>` has no confirmed address, its address deadline passed four days ago, and no invoice has been sent.
* admin(holds payment-processing) is on `<closed-window order>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<reason>` | The operator's stated reason for the cancellation |

**Steps:**

1. Cancel `<closed-window order>` with `<reason>`.
2. Read the derived order status and the lot's inventory status.

**Expected Results:**

* The cancellation is accepted without an invoice having existed.
* The order derives Cancelled and leaves the pre-invoice queue.
* The lot's inventory status is available and it can be listed again.

<!-- trace:case id=g10adm.auction-post-sale.TC-b2d rev=2 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### post-sale-US18-TC16-2: An operator records setup without reopening

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-18

**Pre-conditions:**

* `<missed-deadline order>` is in Setup Overdue with its address deadline passed.
* An operator holds payment-processing.

**Steps:**

1. Open `<missed-deadline order>`.
2. Record the delivery address, billing address and payment method the winner gave by telephone.

**Expected Results:**

* The address is accepted and the order derives as Preparing Invoice.
* The address window is still closed.
* The winner is offered no address form.

---

## post-sale-US19: Operator settles an expired invoice

**As an** operator,
**I want** an expired invoice settled only in the admin portal, and a card payment started in time to count,
**so that** a winner who paid just before the deadline is never expired, and one who paid after it is never charged.

<!-- trace:case id=g10adm.auction-post-sale.TC-o6m rev=1 covers=g10adm.auction-post-sale.SC-b5v -->
### post-sale-US19-TC1-1: Manual settlement pays an expired invoice and ends what is owed

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<expired-invoice order>` had its invoice sent at 2026-09-05T09:00:00Z, is unpaid, and its deadline 2026-09-12T09:00:00Z has passed.
* admin(holds payment-processing) is on `<expired-invoice order>`.

**Test data:**

| Field | Value |
| --- | --- |
| Method | Bank transfer |
| `<transfer reference>` | The bank's reference for the winner's transfer |
| Proof | One file showing the transfer |

**Steps:**

1. Record a manual settlement with the method, `<transfer reference>` and proof.
2. Read the order's outcome and invoice status.
3. Open `<expired-invoice order>` on Winner Order as customer(winner of `<expired-invoice order>`).

**Expected Results:**

* The settlement is accepted; the order derives Preparing Shipment.
* The Expired invoice status is gone; the invoice reads paid.
* Winner Order shows no amount owed and no card Pay.

<!-- trace:case id=g10adm.auction-post-sale.TC-v9x rev=1 covers=g10adm.auction-post-sale.SC-v9x -->
### post-sale-US19-TC2-1: An expired invoice keeps a recorded shortfall

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<expired-invoice order>` has a 100000 minor-unit balance after its deadline.
* admin(holds payment-processing) is recording a payment.

**Steps:**

1. Record a 40000-minor-unit payment with method, reference and proof.
2. Read the invoice status, remaining balance and winner payment controls.

**Expected Results:**

* The invoice reads Partially Paid with 60000 minor units remaining.
* No new self-service payment deadline or close-as-paid choice appears.
* Winner Order offers no card Pay control.

<!-- trace:case id=g10adm.auction-post-sale.TC-0g4 rev=1 covers=g10adm.auction-post-sale.SC-d1w -->
### post-sale-US19-TC3-1: A card payment just before the deadline is accepted

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
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<pending-invoice order>` had its invoice sent at 2026-09-05T09:00:00Z and is unpaid.
* customer(winner of `<pending-invoice order>`) is on its Winner Order page at `<the attempt>`.

**Test data:**

| Field | Value |
| --- | --- |
| Payment deadline | 2026-09-12T09:00:00Z |
| `<the attempt>` | 2026-09-12T08:59:00Z, one minute before the deadline |

**Steps:**

1. Click Pay.
2. Pay the Order Total by card.
3. Read the order on the post-sale queue as admin(holds payment-processing).

**Expected Results:**

* The card payment is accepted.
* The order derives Preparing Shipment and never showed Expired invoice.

<!-- trace:case id=g10adm.auction-post-sale.TC-54p rev=1 covers=g10adm.auction-post-sale.SC-cdi -->
### post-sale-US19-TC4-1: The winner cannot pay by card after the deadline

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<expired-invoice order>` had its invoice sent at 2026-09-05T09:00:00Z and is unpaid.
* customer(winner of `<expired-invoice order>`) opened its Winner Order page at 2026-09-12T08:55:00Z and kept it open.

**Test data:**

| Field | Value |
| --- | --- |
| Payment deadline | 2026-09-12T09:00:00Z |
| `<the attempt>` | 2026-09-12T09:01:00Z, one minute after the deadline |

**Steps:**

1. At `<the attempt>`, submit card payment from the open page.
2. Reload the Winner Order page.
3. Read the order on the post-sale queue as admin(holds payment-processing).

**Expected Results:**

* The payment is refused and the card is not charged.
* After reload, no card Pay is offered; Contact Us is.
* The order still reads Pending Payment with Expired invoice.

<!-- trace:case id=g10adm.auction-post-sale.TC-o2f rev=1 covers=g10adm.auction-post-sale.SC-d1w -->
### post-sale-US19-TC5-1: A card payment started in time completes after the deadline

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<pending order>` has a payment deadline of 2026-09-19T09:00:00Z.
* The payment provider is set to confirm the winner's card payment 50 seconds after it is received.

**Steps:**

1. At 2026-09-19T08:59:30Z, submit the winner's card payment.
2. Read the invoice status at 2026-09-19T09:00:05Z.
3. Read it again after the payment confirms at 2026-09-19T09:00:20Z.

**Expected Results:**

* At 09:00:05 the invoice is still `pending`, not `expired`.
* After confirmation the invoice is `paid` and the order is Preparing Shipment.
* The invoice log holds no expired entry.

<!-- trace:case id=g10adm.auction-post-sale.TC-mon rev=1 covers=g10adm.auction-post-sale.SC-xct -->
### post-sale-US19-TC6-1: A card payment started in time that fails expires the invoice when it fails

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<pending order>` has a payment deadline of 2026-09-19T09:00:00Z.
* The payment provider is set to decline the winner's card payment 50 seconds after it is received.

**Steps:**

1. At 2026-09-19T08:59:30Z, submit the winner's card payment.
2. Read the invoice status at 2026-09-19T09:00:05Z.
3. Read it again after the decline at 2026-09-19T09:00:20Z.

**Expected Results:**

* At 09:00:05 the invoice is still `pending`.
* After the decline the invoice is `expired`, with the expired entry timestamped at the decline.
* The winner's order shows Contact Us and no card Pay.

<!-- trace:case id=g10adm.auction-post-sale.TC-mpo rev=1 covers=g10adm.auction-post-sale.SC-o4m -->
### post-sale-US19-TC7-1: Reissuing an expired invoice gives card payment a fresh seven days

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
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<expired-invoice order>` had its invoice sent at 2026-09-05T09:00:00Z and is unpaid past its deadline 2026-09-12T09:00:00Z.
* admin(holds payment-processing) is on `<expired-invoice order>` at `<the reissue>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the reissue>` | 2026-09-14T10:00:00Z |
| New payment deadline | 2026-09-21T10:00:00Z, seven days from `<the reissue>` |

**Steps:**

1. Reissue the invoice.
2. Read the payment deadline and the row on the queue.
3. Pay the Order Total by card as customer(winner of `<expired-invoice order>`).

**Expected Results:**

* The deadline is 2026-09-21T10:00:00Z; Expired invoice and needs-action are gone.
* Winner Order offers card Pay again.
* The card payment is accepted; the order derives Preparing Shipment.

<!-- trace:case id=g10adm.auction-post-sale.TC-f9u rev=1 covers=g10adm.auction-post-sale.SC-gof -->
### post-sale-US19-TC9-1: A card session that ends unpaid after the deadline expires the invoice then

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<pending order>` has a payment deadline of 2026-09-19T09:00:00Z.
* Grade10 received the winner's card payment at 2026-09-19T08:59:30Z and its card session is open.

**Test data:**

| Session ends by | At |
| --- | --- |
| Timing out | 2026-09-19T09:30:30Z |
| The winner abandoning it | 2026-09-19T09:30:30Z |

**Steps:**

1. Read the invoice status and the winner's order at 2026-09-19T09:05:00Z, while the session is open.
2. End the session the way the row names.
3. Read the invoice status, its log and the winner's order.

**Expected Results:**

* At 09:05 the invoice is `pending` and Winner Order offers no Pay Now.
* After the session ends the invoice is `expired`, with the expired entry timestamped when the session ended.
* The order reads Payment Overdue with Contact Us, and Pay Now stays closed.

## Settled

- `post-sale-US1-TC1`, `post-sale-US1-TC2`, `post-sale-US1-TC3` and `post-sale-US1-TC4`, archived with `2026-09-11-add-auction-winner-journey`, are `post-sale-US7-TC1` to `post-sale-US7-TC4`: the journeys were renumbered at its fold.
- `post-sale-US2-TC1`, `post-sale-US2-TC2`, `post-sale-US2-TC3` and `post-sale-US2-TC4`, archived with `2026-09-11-add-auction-winner-journey`, are `post-sale-US8-TC1` to `post-sale-US8-TC4`: the journeys were renumbered at its fold.
- `post-sale-US08-TC1` and `post-sale-US01-TC1`, archived with `2026-09-23-add-winner-refund`, are `post-sale-US8-TC5` and `post-sale-US1-TC1`: renamed to the compact id form at its fold.
- Removing Tax on a reissue is a change from an amount to none, like changing its amount; it has its own scenario and case.

## Reconciliation

Two independent readings of the same anchors: this suite, written without sight
of any requirement, and a scenario draft written without sight of this suite.

| Raised | Disposition |
| --- | --- |
| An expired invoice can only be paid in the admin portal | **Folded in** - `grade10-admin-auction-post-sale-SC-85` and `SC-86`, walked by `post-sale-US19-TC1-1` and `TC4-1` |
| Whether an operator without payment-processing sees the settle and reissue controls | **Moved** to `complete-auction-post-sale`, which owns the visible-and-disabled rule for every operator control (its `SC-25`). The scenario this change wrote for it and its case `post-sale-US19-TC8-1` retire, and their ids stay issued |
| An expired invoice with a shortfall stays Partially Paid | **Folded in** - `grade10-admin-auction-post-sale-SC-92`, walked by `post-sale-US19-TC2-1` |
| A card payment at exactly the deadline | **Folded in.** Judged on receipt: at or after the deadline is refused - `grade10-admin-auction-post-sale-SC-86` |
| A card payment started before the deadline that confirms after | **Folded in** after a grilling round: a payment started in time counts, and the invoice is held `pending` until its outcome - `SC-87` and `SC-88`, with `post-sale-US19-TC3-1`, `TC5-1` and `TC6-1` |
| A card session started in time that times out or is abandoned after the deadline | **Folded in** after the planning owner decided it counts as a failed outcome: the invoice is written `expired` when the session ends, never held `pending` past it, and Pay Now stays closed - `SC-93`, walked by `post-sale-US19-TC9-1` |
| Whether a reissue re-prices the fee or the premium minimum, or needs a reason | **Out of scope.** This change checks only the existing reissue deadline behavior |
| Whether settling an expired invoice restores bidding | **Already decided** on the Winner Order page: paying does not restore bidding by itself. Suspension belongs to `grade10-site/auction/bidder-suspension` |
| Whether the winner is told about a reissue | **Out of scope**, with the other letters, in a follow-on change |
| Who owns the reopen and record-setup requirement | **Moved** to `complete-auction-post-sale` (`decisions.md` Q10), which this change depends on. `SC-75` to `SC-84`, `SC-90` and `SC-91` keep their ids and markers in that change's post-sale delta. This suite no longer carries their cases; `post-sale-US18-TC1-1` to `TC7-1`, `TC16-2`, `TC25-1`, `TC26-1` and `TC27-1`, under the journey that reads Operator reopens the address form, move there with them; `TC15-1` is not carried, since `post-sale-US2-TC9-1` there walks the same steps |
| Cases for scenarios this change does not own | **Moved.** `post-sale-US18-TC8-1` to `TC14-1` and `TC24-1` read the queue outcomes, the send and the cancellation, none of which has a scenario here. The queue and send are `complete-auction-post-sale`'s, and the status each order reads is proved in `grade10-site/auction/order-status` |

**Run:** The blind pass read the Purpose, Feature set, `post-sale-US-05`, the proposal, decisions, UI design without scenario dispositions, and the linked PRD. It did not read durable or change requirements.

**Run:** 2026-10-06, QA2 rerun after accept-review, not blind: the delta's requirements and scenarios, the durable suite and the cases above. It moved the reissue case to `post-sale-US-07`, the journey its scenario serves. The reissue log rule for Tax moved to `complete-auction-post-sale`'s `Invoice log history`, so this change modifies no log requirement.

### Folded

- `post-sale-US5-TC9-1`, an invoice sent with Tax whose Subtotal includes it -> `post-sale-SC-155`
- `post-sale-US5-TC10-1`, an invoice sent with Tax left empty carries no Tax line -> `post-sale-SC-156`
- `post-sale-US5-TC11-1`, Tax of zero refused -> `post-sale-SC-157`
- `post-sale-US7-TC38-1`, a reissue adding Tax whose new invoice carries it -> `post-sale-SC-158`
- `post-sale-US7-TC46-1`, a reissue removing Tax whose new invoice has none -> `post-sale-SC-210`

### Rejected

- No blind case was dropped.

### Escalated

- Is removing Tax on a reissue a change of its own, distinct from changing its amount? -> decisions Q8; answered under `## Settled`, and walked by `post-sale-US7-TC46-1` -> `post-sale-SC-210`

### Carried Unchanged

- **Quote and send** - `grade10-admin-auction-post-sale-SC-48`, `grade10-admin-auction-post-sale-SC-49`, `grade10-admin-auction-post-sale-SC-50`, `grade10-admin-auction-post-sale-SC-63`, `grade10-admin-auction-post-sale-SC-68`, `grade10-admin-auction-post-sale-SC-69`, `grade10-admin-auction-post-sale-SC-70`, `grade10-admin-auction-post-sale-SC-117`, `grade10-admin-auction-post-sale-SC-118`, `grade10-admin-auction-post-sale-SC-119` keep their meaning and their durable coverage
- **Reissue** - `grade10-admin-auction-post-sale-SC-107` to `-SC-115`, `grade10-admin-auction-post-sale-SC-125`, `grade10-admin-auction-post-sale-SC-126`, `grade10-admin-auction-post-sale-SC-133`, `grade10-admin-auction-post-sale-SC-134` keep their meaning and their durable coverage

**Out of suite:** none of this change's scenarios.

**Run:** 2026-10-08, amendment for the card fee, not blind: the quote and reissue fee steps and refusals, the durable suite and the cases above. `complete-auction-post-sale` prices a card invoice's fee from the Payment Settings card rule instead of the payment provider's fees, and this change carries that edit because it already modifies both requirements (decisions Q17).

- **Folded** - `post-sale-US5-TC18-1`, the card fee read before send is the card rule's gross-up -> `grade10-admin-auction-post-sale-SC-69`; `post-sale-US5-TC19-1`, a card invoice refused with `CARD_FEE_UNSET` when its currency has no card rule -> `grade10-admin-auction-post-sale-SC-70`
- **Revised** - `post-sale-US7-TC25-2`, from `-TC25-1`: the bank transfer quote no longer sets the provider's fees as unreadable, since no send reads them -> `grade10-admin-auction-post-sale-SC-117`, `SC-118`, `SC-119`
- **Deprecated** - `post-sale-US7-TC11-1` and `-TC12-1` read the provider's fees. `post-sale-US7-TC47-1` replaces the first: switching to card prices the fee from the card rule -> `grade10-admin-auction-post-sale-SC-125`. `post-sale-US7-TC48-1` replaces the second: a card reissue is refused with `CARD_FEE_UNSET` when the currency has no card rule -> `grade10-admin-auction-post-sale-SC-126`
- **No longer carried unchanged** - `grade10-admin-auction-post-sale-SC-69`, `SC-70`, `SC-117`, `SC-119`, `SC-125` and `SC-126`, listed as unchanged by the run above, now read the card rule and are reached by the cases in this run. They keep their ids and titles: `validate:changes` refuses a MODIFIED block that drops or retitles a durable scenario, so `SC-70` and `SC-126` carry a note that their titles are historical, and none is removed

| Finding | Disposition |
| --- | --- |
| Overpayment, close-or-keep boundary and the refusal below the tolerance | **Folded in:** `grade10-admin-auction-post-sale-SC-140`–`SC-144` |
| Reissue and Cancel refused once a payment is recorded | **Folded in:** `grade10-admin-auction-post-sale-SC-217` |
| Money that counts toward nothing blocks neither Reissue nor Cancel | **Folded in:** `grade10-admin-auction-post-sale-SC-242`; carried here for `complete-auction-post-sale`, since one in-flight change edits a requirement at a time |
| Partially Paid sits in Waiting on winner, not Needs action | **Deferred:** `complete-auction-post-sale` modifies "The queue shows one outcome per lot" and carries it; one in-flight change may edit a requirement at a time |

| Finding | Disposition |
| --- | --- |
| Queue labels preserve the operator action context | **Folded in** |

- **Covered at domain** — recording a payment on an order, then dispatch and delivery, reaches Preparing Shipment, Shipped and then Delivered, walked by `grade10-admin-auction-e2e-US3-TC1-2`
- **Restored** - the cases archived with `2026-09-18-add-winner-bank-transfer` and `2026-09-18-add-winner-billing-address` that their folds left behind are back as draft, unchanged, for `/tcs-review`: `post-sale-US1-TC2-1`, `-TC3-1` and `-TC5-1`, `post-sale-US7-TC5-1` to `-TC31-1`, `post-sale-US8-TC6-1` to `-TC8-1`, `post-sale-US10-TC1-1` to `-TC9-1`, `post-sale-US5-TC1-1`, and `post-sale-US11-TC1-1` and `-TC2-1`.

**Run:** 2026-09-29. One agent wrote the cases and the scenarios, so the two readings are not independent. The cases were drafted from the Purpose, the Feature set, the journeys, the proposal, the decisions and the linked pages, then joined to the scenarios on their anchors.

**Run:** 2026-10-06, QA2. A fresh reader joined all 91 scenarios and every case in this suite on their anchors, against the durable suite the fold lands on, with the cases its earlier folds left behind restored there as drafts. The earlier run's claim that the restated scenarios were reached through durable cases did not hold for twelve of them; they now have cases.

| Spec scenario | Disposition |
| --- | --- |
| `grade10-admin-auction-post-sale-SC-19`, `SC-20`, `SC-21`, `SC-44`, `SC-159` | Covered by `US1-TC9-1` |
| `grade10-admin-auction-post-sale-SC-116` | Covered by `US1-TC9-1`, whose filter step and result QA2 joined to it |
| `grade10-admin-auction-post-sale-SC-131`, `SC-160` | Covered by `US1-TC6-1` |
| `grade10-admin-auction-post-sale-SC-180`, `SC-181`, `SC-182` | Covered by `US1-TC7-1` |
| `grade10-admin-auction-post-sale-SC-162`, `SC-184`, `SC-185`, `SC-198` | Covered by `US2-TC5-1` |
| `grade10-admin-auction-post-sale-SC-163` | Covered by `US2-TC6-1` |
| `grade10-admin-auction-post-sale-SC-164`, `SC-165` | Covered by `US2-TC7-1` |
| `grade10-admin-auction-post-sale-SC-37`, `SC-43` | Covered by `US2-TC8-1` |
| `grade10-admin-auction-post-sale-SC-22`, `SC-203` | Were uncovered; added `US3-TC6-1` |
| `grade10-admin-auction-post-sale-SC-161`, `SC-178`, `SC-179`, `SC-195`, `SC-196` | Covered by `US3-TC5-1` |
| `grade10-admin-auction-post-sale-SC-201`, `SC-202` | Covered by `US3-TC4-1` |
| `grade10-admin-auction-post-sale-SC-173`, `SC-174` | Covered by `US4-TC1-1` |
| `grade10-admin-auction-post-sale-SC-175`, `SC-176` | Covered by `US4-TC2-1` |
| `grade10-admin-auction-post-sale-SC-237`, `SC-238` | Were uncovered; added `US4-TC3-1` |
| `grade10-admin-auction-post-sale-SC-239` | Were uncovered; added `US2-TC12-1` |
| `grade10-admin-auction-post-sale-SC-240`, `SC-241` | Were uncovered; added `US8-TC14-1` |
| `grade10-admin-auction-post-sale-SC-167` | Covered by `US5-TC14-1` |
| `grade10-admin-auction-post-sale-SC-168`, `SC-169` | Covered by `US5-TC13-1` |
| `grade10-admin-auction-post-sale-SC-170` | Covered by `US5-TC15-1` |
| `grade10-admin-auction-post-sale-SC-193`, `SC-194` | Covered by `US5-TC16-1` |
| `grade10-admin-auction-post-sale-SC-135`, `SC-139` | Covered by `US5-TC17-1`, and `SC-135` also by the durable `post-sale-US7-TC27-1` |
| `grade10-admin-auction-post-sale-SC-41` | Covered by `US5-TC17-1`, whose no-dispatch result QA2 joined to it |
| `grade10-admin-auction-post-sale-SC-136`, `SC-137`, `SC-138` | Covered by the durable `post-sale-US7-TC28-1`, `post-sale-US7-TC29-1` and `post-sale-US7-TC30-1` |
| `grade10-admin-auction-post-sale-SC-197` | Covered by `US6-TC1-2` |
| `grade10-admin-auction-post-sale-SC-23` | Covered by the durable `post-sale-US7-TC1-1` |
| `grade10-admin-auction-post-sale-SC-24` | Was uncovered; added `US7-TC39-1` |
| `grade10-admin-auction-post-sale-SC-25`, `SC-39` | Covered by `US7-TC36-1`, and by the durable `post-sale-US7-TC18-1` |
| `grade10-admin-auction-post-sale-SC-40` | Covered by `US7-TC36-1`, whose dispatch step and result QA2 joined to it |
| `grade10-admin-auction-post-sale-SC-186`, `SC-187` | Covered by `US7-TC36-1` |
| `grade10-admin-auction-post-sale-SC-45`, `SC-46`, `SC-188` | Covered by `US7-TC35-1` |
| `grade10-admin-auction-post-sale-SC-47` | Was uncovered; added `US7-TC40-1` |
| `grade10-admin-auction-post-sale-SC-54` | Was uncovered; added `US7-TC41-1` |
| `grade10-admin-auction-post-sale-SC-122` | Was uncovered; added `US7-TC42-1`. The durable `post-sale-US10-TC6-1` holds the Confirm and Return half |
| `grade10-admin-auction-post-sale-SC-127` | Covered by the durable `post-sale-US7-TC19-1` |
| `grade10-admin-auction-post-sale-SC-55`, `SC-189` | Covered by `US7-TC33-1` |
| `grade10-admin-auction-post-sale-SC-60` | Covered by the durable `post-sale-US7-TC2-1` and `post-sale-US7-TC16-1`, and by `US7-TC33-1` |
| `grade10-admin-auction-post-sale-SC-67` | Covered by the durable `post-sale-US7-TC17-1` |
| `grade10-admin-auction-post-sale-SC-56`, `SC-57`, `SC-62`, `SC-120`, `SC-121`, `SC-130`, `SC-190` | Covered by `US7-TC34-1`; `SC-62`'s wrong-type file also by the durable `post-sale-US7-TC24-1` |
| `grade10-admin-auction-post-sale-SC-58`, `SC-59` | Were uncovered; added as rows of `US7-TC34-1` |
| `grade10-admin-auction-post-sale-SC-171` | Covered by `US7-TC32-1`, and by the durable `post-sale-US7-TC7-1` |
| `grade10-admin-auction-post-sale-SC-172` | Covered by the durable `post-sale-US7-TC8-1` |
| `grade10-admin-auction-post-sale-SC-199` | Covered by `US7-TC37-1` |
| `grade10-admin-auction-post-sale-SC-34` | Covered by the durable `post-sale-US8-TC1-1` |
| `grade10-admin-auction-post-sale-SC-35`, `SC-123` | Were uncovered; added `US8-TC10-1` |
| `grade10-admin-auction-post-sale-SC-36` | Covered by the durable `post-sale-US8-TC2-1` for the snapshot, and on the winner's address book route by `winner-order-US1-TC10-1` |
| `grade10-admin-auction-post-sale-SC-38` | Covered by the durable `post-sale-US8-TC4-1` |
| `grade10-admin-auction-post-sale-SC-42` | Was uncovered; added `US8-TC11-1` |
| `grade10-admin-auction-post-sale-SC-61` | Was uncovered; added `US8-TC12-1` |
| `grade10-admin-auction-post-sale-SC-204` | Added with `US8-TC13-1`. It carries `add-winner-order-tax-line`'s reissue log rule for Tax, which that change handed over to keep `Invoice log history` in one change; `add-winner-order-tax-line`'s `post-sale-SC-158` keeps the new invoice's Tax |
| `grade10-admin-auction-post-sale-SC-124` | Covered by the durable `post-sale-US8-TC6-1` |
| `grade10-admin-auction-post-sale-SC-132` | Covered by the durable `post-sale-US8-TC8-1` |
| `grade10-admin-auction-post-sale-SC-166` | Covered by `US8-TC9-1` |
| `grade10-admin-auction-post-sale-SC-145` | Was uncovered once `US16-TC1` was revised; added `US16-TC5-1` |
| `grade10-admin-auction-post-sale-SC-146` | Covered by the durable `post-sale-US16-TC2-1` |
| `grade10-admin-auction-post-sale-SC-191` | Covered by `US16-TC3-1` |
| `grade10-admin-auction-post-sale-SC-192` | Covered by `US16-TC1-2` |
| `grade10-admin-auction-post-sale-SC-200` | Covered by `US16-TC4-1` |
| `grade10-admin-auction-post-sale-SC-75`, `SC-76`, `SC-77`, `SC-78`, `SC-80`, `SC-81`, `SC-82`, `SC-83`, `SC-84`, `SC-90` | Covered by `US18-TC1-1` to `TC6-1`, `TC25-1` and `TC16-2`; `SC-82` also by `US18-TC27-1` and `SC-83` also by `US2-TC9-1` |
| `grade10-admin-auction-post-sale-SC-79`, `SC-91` | Covered by `US18-TC7-1` and `US18-TC26-1` |
| `grade10-admin-auction-post-sale-SC-211`, `SC-212`, `SC-213`, `SC-214`, `SC-215`, `SC-216` | Covered by `US2-TC10-1` and `US2-TC11-1` |
| Contradicted readings | None between a case and a scenario; the durable cases the change contradicts are revised or deprecated below |

- **Renumbered** - `post-sale-US1-TC1-1` became `US1-TC9-1` and `post-sale-US3-TC3-1` became `US3-TC5-1`: each reused a durable id of another meaning, so the fold would have overwritten the durable case. `US1-TC8` is held by `clarify-auction-shipping-progress-copy`.
- **Revised** - `US6-TC1-2` revises the durable `post-sale-US6-TC1-1`: the same three lots, with Extended read in the Listings table now that the queue is gone. `US16-TC1-2` revises the durable `post-sale-US16-TC1-1` to a bank refund that names where it went and is restated. Each carries the durable trace marker at `rev=2`; `US6-TC2-1` carries its durable marker unchanged.
- **Revised against the fee by payment method** - the durable `post-sale-US7-TC9-1` and `-TC10-1` read a blank bank transfer fee as refused; a blank fee is now zero, so they are `US7-TC9-2` and `US7-TC10-2`. `add-winner-order-tax-line`'s `post-sale-US7-TC25-2` still refuses a blank fee, so it is `US7-TC25-3` here, with a blank fee sent as Free.
- **Deprecated** - the listing queue and its listing-level payment states are removed, so the durable `post-sale-US1-TC1-1`, `-TC2-1`, `-TC3-1` and `-TC5-1` and `post-sale-US3-TC1-1`, `-TC2-1` and `-TC3-1` are deprecated; the worklist is walked by `US1-TC6-1`, `US1-TC7-1` and `US1-TC9-1`, and payment by `US3-TC4-1`, `US3-TC5-1`, `US7-TC34-1` and `US7-TC36-1`. `post-sale-US7-TC15-1`, which refused any amount but the order total, gives way to `US7-TC34-1`; the queue search `post-sale-US7-TC22-1` to `US1-TC6-1`; and `post-sale-US7-TC31-1`, which expected the Overdue mark, to `US5-TC17-1`. `US6-TC2-1`: the worklist lists won lots only, so a lot still taking bids has no row to filter.
- **Joined** - `US1-TC9-1` gained the Payment Verifying filter (`SC-116`), `US5-TC17-1` the absent dispatch (`SC-41`), `US7-TC34-1` two rows (`SC-58`, `SC-59`), and `US7-TC36-1` finance's disabled Dispatch (`SC-40`); each is a result on a run the case already walks, so no version moved.
- **Traces** - `US2-TC8-1`, `US5-TC17-1`, `US7-TC34-1` and `US7-TC36-1` traced a feature set group; each now traces the journey of the section it sits in.
- **Restyle owed** - durable cases the change does not move still name older words: `post-sale-US7-TC1-1` and `post-sale-US8-TC3-1` read Expired for Payment Overdue, `post-sale-US7-TC2-1`, `-TC13-1` and `post-sale-US10-TC1-1` read Processing for Preparing Shipment, and `post-sale-US15-TC1-1`, `-TC2-1` and `post-sale-US17-TC1-1` read the queue for the worklist. `/tcs-review` restyles them.
- **Proven by another change** - the 90% close choice and the overpayment confirmation in Record payment are proven by `add-winner-partial-payment`'s cases post-sale-US12-TC3-1 and post-sale-US12-TC4-1.
- **Moved in** - `An operator reopens the address form`, with `SC-75` to `SC-84`, `SC-90` and `SC-91` under their existing ids, came from `close-overdue-address-confirmation` (`decisions.md` Q39), and its cases came with them under their existing trace markers: `post-sale-US18-TC1-1` to `TC7-1`, `TC16-2`, `TC25-1`, `TC26-1` and `TC27-1` for the reopen and record scenarios, and `TC8-1` to `TC14-1` and `TC24-1` for the queue outcomes, the send and the cancellation, which read scenarios this change owns. `post-sale-US18-TC15-1`, a cancelled order refuses a reopen, is not carried: `US2-TC9-1` walks the same steps for `SC-83`, so the suite holds one case for it. The moved cases keep the words of the suite they came from: the queue read as the worklist, Expired invoice as Payment Overdue and Processing as Preparing Shipment are owed to `/tcs-review`.
- **Raised** - where a flagged order sits, where a reissue's fee starts, what replaces the 72-hour mark, and what Grade10 keeps of a refund's bank account landed as decisions Q16, Q14, Q26 and Q29.
- **Domain suite** - `grade10-admin-auction-e2e-US3-TC1-1` walked the listing queue's Paid via Manual, which this change removes, so the proposal carries its rewrite for the Orders worklist and order page as `-US3-TC1-2`, back to draft; `-US3-TC2-1` read a wire request that releases the card hold, which no longer exists, so it is deprecated as `-US3-TC2-2`. The feature suite's two **Covered at domain** lines follow: the first names `-TC1-2`, and the second goes with the wire request.

**Run:** 2026-10-08, amendment for acceptance ahead of the dependencies, not blind: the fee requirement, the durable suite, `add-winner-order-tax-line`'s and `add-winner-partial-payment`'s post-sale suites and the cases above. The card-rule fee on the quote and the reissue is now `add-winner-order-tax-line`'s (its Q17), and the guards that count only a payment toward the balance are `add-winner-partial-payment`'s (its Q21), so this suite stops carrying what those two prove.

- **Handed over** - this suite's copies of `post-sale-US7-TC11-1` and `-TC12-1`, deprecated, are dropped: `add-winner-order-tax-line` deprecates them and replaces them with `post-sale-US7-TC47-1` and `-TC48-1`
- **Carried by add-winner-order-tax-line** - the blank-is-zero bank transfer fee and `post-sale-US7-TC25-2` (its Q18), so this suite carries no copy of that case.
- **Kept** - `grade10-admin-auction-post-sale-SC-167` and `SC-168` stay with `US5-TC14-1` and `US5-TC13-1`: `SC-167` is the USD launch case with no card rule and `SC-168` the read-only fee with its rule, which `SC-70` and `SC-69` do not state
