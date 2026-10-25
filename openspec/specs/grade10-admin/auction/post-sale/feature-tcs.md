# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/70
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* Orders is the auction orders worklist in the admin; each order opens on its own page from its row, and Winner Order is the winner's page for the same order. `<order>` is the order a case reads.
* Unless a case says otherwise the operator is admin(holds payment processing); shipment and refund processing are named where a case needs them. Every time in the admin reads in Hong Kong time, GMT+8.
* Every amount is typed in USD. An HKD order converts the sum of its USD lines once at 7.85 to the Subtotal, a fraction of a cent rounding up; a bank transfer fee converts alone, below it; a card fee is the Payment Settings rule's gross-up of the Subtotal: 3.4% plus HKD2.35 in HKD and 4.4% plus USD0.30 in USD, unless a case says otherwise.
* The address deadline is 48 hours after the lot's actual close, the payment deadline 7 days after the invoice is sent; a reissue, a reopen and a cancel each need a reason.

## Walk 1: Quote, send, check proof and ship an HKD bank-transfer order

Starting state:

- customer(winner) confirmed Home, HKD and FPS on `<order>`, won at USD150.00 with a USD30.00 premium.

Shared test data:

| Field | Value |
| --- | --- |
| order | An order in Preparing Invoice, under Needs action |

### Route

1. Open `<order>` from Needs action and choose Send invoice.
   - The quote names Bank transfer, FPS, and asks for a fee in USD. `g10adm.auction-post-sale.US5-TC23`
2. Type Shipping & Handling 49.00, Insurance 20.00, Tax 2.00 and fee 25.04; read the preview.
   - USD lines, Subtotal HKD1,970.35, fee HKD196.57, total HKD2,166.92. `g10adm.auction-post-sale.US21-TC1`
3. Send, and read the order.
   - Pending Payment, a seven-day deadline in GMT+8, its setup locked. `g10adm.auction-post-sale.US5-TC25`
4. Once the winner uploads proof, return it with both reasons.
   - The time left shown, and the deadline running again from it. `g10adm.auction-post-sale.US10-TC3`
5. Once the winner uploads again, confirm it.
   - Paid, Preparing Shipment, the winner's files as proof. `g10adm.auction-post-sale.US10-TC1`
6. As a shipment operator, record dispatch, then delivery.
   - Shipped, then Delivered, each on the timeline. `g10adm.auction-post-sale.US4-TC1`

## Walk 2: Bring back a winner who missed the address deadline

Starting state:

- `<order>`'s lot closed 48 hours ago and its winner has confirmed nothing.

Shared test data:

| Field | Value |
| --- | --- |
| order | An order with no confirmed address and no invoice |

### Route

1. Read its row on Orders at the 48-hour mark.
   - Setup Overdue, needing action. `g10adm.auction-post-sale.US18-TC10`
2. Open the order.
   - Setup Overdue, the rule named, Reopen setup as the primary action. `g10adm.auction-post-sale.US2-TC5`
3. Reopen with a reason.
   - A fresh 48 hours from now, logged with the reason. `g10adm.auction-post-sale.US18-TC1`
4. Read its row again.
   - Awaiting Setup, no longer needing action. `g10adm.auction-post-sale.US18-TC4`

## Walk 3: Collect in parts, then refund

Starting state:

- `<order>` holds an unpaid HKD11,775.00 bank-transfer invoice.

Shared test data:

| Field | Value |
| --- | --- |
| order | An order in Pending Payment |

### Route

1. Record HKD400.00 with its method, reference and proof.
   - Partially Paid, its own receipt number, HKD11,375.00 left. `g10adm.auction-post-sale.US12-TC1`
2. Try to reissue, then to cancel.
   - Both refused; Record payment still offered. `g10adm.auction-post-sale.US12-TC6`
3. As a refund operator, refund the HKD400.00 by bank, the lot back to stock.
   - Refunded, the record carrying the amount, method and audit number. `g10adm.auction-post-sale.US16-TC3`
4. Filter Orders to Refunded and open the order.
   - One complete refund record, on the page and the timeline. `g10adm.auction-post-sale.US17-TC1`

## g10adm.auction-post-sale.US1: Operator works the orders worklist by segment

**As an** auction operator,
**I want** every won lot's order in one worklist, split into segments with counts and searchable by any of its codes or the winner's email,
**so that** I open what needs me first without scanning orders that are waiting on the winner.

<!-- trace:case id=g10adm.auction-post-sale.TC-37b rev=1 -->
### g10adm.auction-post-sale.US1-TC9: Segments sort won lots' orders and show their counts

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* Orders holds one order, none flagged, in each of Awaiting Setup, Preparing Invoice, Pending Payment, Payment Verifying, Payment Overdue, Preparing Shipment, Shipped, Delivered and Refunded, and a published lot closes in 30 minutes.
* admin(operator) can open Orders.

**Steps:**

1. Open Orders, and read which segment is open and each segment's count.
2. Open each segment in turn.
3. Open All and filter to Payment Verifying.

**Expected Results:**

* Step 1 opens on Needs action, reading 4.
* Step 2: Needs action lists the Preparing Invoice, Payment Verifying, Payment Overdue and Preparing Shipment orders; Waiting on winner reads 2, the Awaiting Setup and Pending Payment orders; In transit reads 1, the Shipped order; Closed reads 2, the Delivered and Refunded orders; All reads 9, and the lot still open is on no segment. Each status reads as its winner reads it.
* Step 3 lists only the Payment Verifying order.

<!-- trace:case id=g10adm.auction-post-sale.TC-ljg rev=1 covers=g10adm.auction-post-sale.SC-r6h,g10adm.auction-post-sale.SC-1yv,g10adm.auction-post-sale.SC-fxm,g10adm.auction-post-sale.SC-r3o,g10adm.auction-post-sale.SC-05a,g10adm.auction-post-sale.SC-71a,g10adm.auction-post-sale.SC-9oe,g10adm.auction-post-sale.SC-88b,g10adm.auction-post-sale.SC-cnh,g10adm.auction-post-sale.SC-8dq,g10adm.auction-post-sale.SC-w38,g10adm.auction-post-sale.SC-whp,g10adm.auction-post-sale.SC-iyb,g10adm.auction-post-sale.SC-kqf,g10adm.auction-post-sale.SC-8wv,g10adm.auction-post-sale.SC-d6e -->
### g10adm.auction-post-sale.US1-TC6: Search finds an order by any of its codes or the winner's email

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* A Preparing Shipment order on listing LK423, whose first invoice IN-LK42301 was replaced by IN-LK42302, won by collector@example.com; other orders in every segment, on listings whose codes do not start with LK423.
* admin(operator) is on Orders.

**Steps:**

1. Search for LK423, then IN-LK42301, then IN-LK423, then IN-LK42302.
2. Search for Collector@Ex, and read the counts.
3. Open the order.

**Expected Results:**

* Step 1 finds the order each time.
* Step 2: Needs action and All read 1, every other segment 0.
* Step 3 shows IN-LK42302 as the current invoice and IN-LK42301 marked Replaced.

<!-- trace:case id=g10adm.auction-post-sale.TC-y02 rev=1 covers=g10adm.auction-post-sale.SC-r6h,g10adm.auction-post-sale.SC-1yv,g10adm.auction-post-sale.SC-fxm,g10adm.auction-post-sale.SC-r3o,g10adm.auction-post-sale.SC-05a,g10adm.auction-post-sale.SC-71a,g10adm.auction-post-sale.SC-9oe,g10adm.auction-post-sale.SC-88b,g10adm.auction-post-sale.SC-cnh,g10adm.auction-post-sale.SC-8dq,g10adm.auction-post-sale.SC-w38,g10adm.auction-post-sale.SC-whp,g10adm.auction-post-sale.SC-iyb,g10adm.auction-post-sale.SC-kqf,g10adm.auction-post-sale.SC-8wv,g10adm.auction-post-sale.SC-d6e,g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh -->
### g10adm.auction-post-sale.US1-TC7: Rows lead with the longest wait, offer their action and keep their filters

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* Two Preparing Invoice orders whose winners confirmed setup 10 and 30 hours ago; a Preparing Shipment order paid 2 hours ago and one flagged 1 hour ago for a card payment that landed while proof was checked; two Delivered orders, delivered 1 and 3 days ago; Cancelled orders of two cancellation categories.
* admin(operator whose roles are exactly `finance`) is on Orders.

**Steps:**

1. Read Needs action, and choose Send invoice on the first row; dismiss the dialog.
2. Open Closed.
3. Filter to Cancelled, then to one cancellation category; reload the page.

**Expected Results:**

* Step 1 lists the order confirmed 30 hours ago first, neither Preparing Shipment row offering an action; Send invoice opens that order's send dialog.
* Step 2 lists the order delivered 1 day ago above the one delivered 3 days ago.
* Step 3: the status filter offers Delivered, Cancelled and Refunded only; the category filter appears once Cancelled is chosen and lists only that category's orders; after the reload Closed and both filters still apply.

---

## g10adm.auction-post-sale.US2: Operator works one order from its own page

**As an** auction operator,
**I want** each order on its own page, leading with its status, the rule behind it and the one thing to do next, with its whole history on one timeline,
**so that** I act on an order, or hand it to a colleague by its link, without piecing it together from several screens.

<!-- trace:case id=g10adm.auction-post-sale.TC-pce rev=1 covers=g10adm.auction-post-sale.SC-ngp,g10adm.auction-post-sale.SC-0gj,g10adm.auction-post-sale.SC-nfo,g10adm.auction-post-sale.SC-15a,g10adm.auction-post-sale.SC-ydn,g10adm.auction-post-sale.SC-bcb,g10adm.auction-post-sale.SC-d8k,g10adm.auction-post-sale.SC-lc8,g10adm.auction-post-sale.SC-f7t,g10adm.auction-post-sale.SC-59i,g10adm.auction-post-sale.SC-r4l,g10adm.auction-post-sale.SC-gw4,g10adm.auction-post-sale.SC-i7j,g10adm.auction-post-sale.SC-seg,g10adm.auction-post-sale.SC-cbk,g10adm.auction-post-sale.SC-yd7,g10adm.auction-post-sale.SC-i16,g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt,g10adm.auction-post-sale.SC-vhw,g10adm.auction-post-sale.SC-bs6 -->
### g10adm.auction-post-sale.US2-TC5: The order page leads with its status, the rule behind it and the one thing to do next

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* admin(operator holding payment, shipment and refund processing) is on Orders; `<order>` is `<state>`.

**Test data:**

| `<state>` | `<header reads>` | `<primary>` | `<more>` |
| --- | --- | --- | --- |
| Preparing Shipment, on an ordinary lot | Preparing Shipment, a sentence naming the rule and how long it has waited, no Test badge | Dispatch | Refund alone |
| Payment Overdue, its bank-transfer invoice unpaid two days past its deadline | Payment Overdue, a sentence saying the payment deadline passed two days ago unpaid, and that the winner is offered Contact Us | Reissue | Record payment and Cancel |
| Setup Overdue, no address confirmed | Setup Overdue, a sentence naming the missed address deadline, and that the winner is offered Contact Us | Reopen setup | the other actions that apply, nothing else |
| Cancelled, on a sandbox lot | Cancelled, with a Test badge | none | none |

**Steps:**

1. Open `<order>` from its row, and read the header and More.
2. Reload, then open its address in a new window.

**Expected Results:**

* Step 1 reads `<header reads>`, with `<primary>` as the primary action and `<more>` under More.
* Step 2 opens the same order each time.

<!-- trace:case id=g10adm.auction-post-sale.TC-xbe rev=1 covers=g10adm.auction-post-sale.SC-ngp,g10adm.auction-post-sale.SC-0gj,g10adm.auction-post-sale.SC-nfo,g10adm.auction-post-sale.SC-15a,g10adm.auction-post-sale.SC-ydn,g10adm.auction-post-sale.SC-bcb,g10adm.auction-post-sale.SC-d8k,g10adm.auction-post-sale.SC-lc8,g10adm.auction-post-sale.SC-f7t,g10adm.auction-post-sale.SC-59i,g10adm.auction-post-sale.SC-r4l -->
### g10adm.auction-post-sale.US2-TC6: Comments and log entries share one timeline

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**

* An order whose invoice was sent and paid by card; admin(operator holding neither payment nor shipment processing) opens it.

**Steps:**

1. Leave the comment Called the winner; try to leave an empty one.
2. Read the timeline.

**Expected Results:**

* The empty comment is refused with a sentence saying why.
* The timeline shows the sent entry, the paid entry and the comment with its operator and time, oldest first; the comment offers no edit or delete.

<!-- trace:case id=g10adm.auction-post-sale.TC-jip rev=2 covers=g10adm.auction-post-sale.SC-ydn,g10adm.auction-post-sale.SC-bcb,g10adm.auction-post-sale.SC-d8k,g10adm.auction-post-sale.SC-lc8,g10adm.auction-post-sale.SC-f7t,g10adm.auction-post-sale.SC-59i,g10adm.auction-post-sale.SC-r4l,g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### g10adm.auction-post-sale.US2-TC7: A send missing what it needs is refused, keeping the dialog and what was typed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* admin is on `<order>`, in `<state>`, and opens Send invoice.

**Test data:**

| `<state>` | `<typed>` | `<refusal names>` |
| --- | --- | --- |
| Preparing Invoice, HKD, bank transfer | Insurance 40.00, Shipping & Handling blank | Shipping & Handling |
| Preparing Invoice, HKD, bank transfer | Shipping & Handling 80.00, Tax 0.00 | Tax, which may be left empty but not zero |
| Preparing Invoice, HKD, bank transfer | Shipping & Handling 80.00, bank transfer fee -100 | the fee |
| Preparing Invoice, HKD, card; no HKD card fee rule | Shipping & Handling 80.00 | `CARD_FEE_UNSET`: the HKD card fee is not set, with a link to Payment Settings; no fee shows |
| Preparing Invoice, USD, card; no USD card fee rule | Shipping & Handling 80.00 | `CARD_FEE_UNSET`: the USD card fee is not set, with a link to Payment Settings; no fee shows |
| a delivery address and no billing address | Shipping & Handling 80.00 | the missing billing address |
| Awaiting Setup, no address confirmed | Shipping & Handling 240.00 | the unconfirmed address |

**Steps:**

1. Type `<typed>` and confirm the send.
2. Correct it where the refusal allows, and confirm again.

**Expected Results:**

* Step 1 is refused with a sentence naming `<refusal names>`; the dialog stays open with what was typed, no invoice is sent and no payment deadline starts.
* Step 2, for the first three rows, sends the invoice with the amounts typed in USD.

<!-- trace:case id=g10adm.auction-post-sale.TC-13a rev=1 covers=g10adm.auction-post-sale.SC-3j8 -->
### g10adm.auction-post-sale.US2-TC12: Operators in different zones read every order time in Hong Kong time

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-02

**Pre-conditions:**

* A Pending Payment order whose invoice was sent at 2026-09-12T09:00:00Z with a deadline of 2026-09-19T09:00:00Z; one admin(operator) in a browser set to London, another in Tokyo.

**Steps:**

1. Each operator reads the order's row on Orders, the payment deadline on its page, its sent entry on the timeline, and the deadline the Reissue dialog would keep.

**Expected Results:**

* Both read the deadline as 2026-09-19 17:00 GMT+8 on the row, the page and the dialog, and the sent entry as 2026-09-12 17:00 GMT+8; neither reads a time in their own zone or in UTC.

<!-- trace:case id=g10adm.auction-post-sale.TC-ao7 rev=1 -->
### g10adm.auction-post-sale.US2-TC13: The order page lists a sent HKD invoice's USD lines, then its HKD Subtotal, fee and Total

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
* **Trace:** post-sale-US-02

**Pre-conditions:**

* admin is on the order page of `<order>`, settled in HKD, its invoice sent.

**Test data:**

| `<order>` | `<lines>` | `<subtotal>` | `<fee>` | `<total>` |
| --- | --- | --- | --- | --- |
| card, HKD rule | Winning Bid USD150.00, Buyer's Premium USD30.00, Shipping & Handling USD49.00, Insurance USD20.00, Tax USD2.00 | HKD1,970.35 | HKD71.79 | HKD2,042.14 |
| FPS, fee left empty | USD100.00, USD20.00, Shipping & Handling zero; no Insurance or Tax | HKD942.00 | Free | HKD942.00 |
| FPS, fee left empty, sent before this layout with whole-HK$ lines of HK$793, HK$159 and HK$79 | USD101.00, USD20.20, USD10.01 | HKD1,031.00, not HKD1,030.00 | Free | HKD1,031.00 |

**Steps:**

1. Read the invoice on the order page from the top down.

**Expected Results:**

* It lists `<lines>` in USD as quoted, with no HKD figure beside a line and no line that was not quoted; then one Subtotal `<subtotal>`, Payment Processing Fee `<fee>` and Total `<total>`; no rate shows; nothing is re-priced.

---

## g10adm.auction-post-sale.US3: Operator collects payment

**As a** payment operator,
**I want** every payment that reaches an order recorded, and one the invoice did not expect flagged for me,
**so that** no money a winner sends is dropped, and I know what to check or have finance return.

<!-- trace:case id=g10adm.auction-post-sale.TC-kbs rev=1 covers=g10adm.auction-post-sale.SC-uf1,g10adm.auction-post-sale.SC-3uf,g10adm.auction-post-sale.SC-n2q,g10adm.auction-post-sale.SC-7jf,g10adm.auction-post-sale.SC-3bt,g10adm.auction-post-sale.SC-en4,g10adm.auction-post-sale.SC-c66,g10adm.auction-post-sale.SC-ccp,g10adm.auction-post-sale.SC-btq,g10adm.auction-post-sale.SC-gmi,g10adm.auction-post-sale.SC-amp -->
### g10adm.auction-post-sale.US3-TC5: Payments the invoice did not expect are flagged and cleared one at a time

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-03

**Pre-conditions:**

* customer(winner) started paying a card invoice of HKD3,232.25, which admin then reissued.

**Steps:**

1. As the winner, complete the HKD3,232.25 payment on the replaced invoice, then a HKD3,000.00 card payment on the current one.
2. As admin, open the order, then Needs action.
3. Clear one flag with the reason Refund sent through Stripe; read the order and Needs action.
4. Clear the other with a reason; read Needs action, Waiting on winner and the timeline.

**Expected Results:**

* Step 2: both payments are recorded, flagged Paid on a replaced invoice and Amount mismatch; nothing counts as paid; the order reads Pending Payment with two notices, each with its own Clear flag, still offers Reissue, and is under Needs action.
* Step 3 leaves one notice, the order still under Needs action.
* Step 4 lists it under Waiting on winner, still Pending Payment; the timeline shows both flagged payments and both clears with their operator and reason.

<!-- trace:case id=g10adm.auction-post-sale.TC-f5p rev=1 -->
### g10adm.auction-post-sale.US3-TC6: The order page shows the winner's name, email and phone to reach them on

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-03

**Pre-conditions:**

* An order in Payment Verifying whose winner confirmed a delivery address with phone +852 91234567; admin(operator) opens it.

**Steps:**

1. Read the winner on the order page.

**Expected Results:**

* It shows the winner's account name and registered email with +852 91234567, and no payment-provider customer or payment identifier in their place.

---

## g10adm.auction-post-sale.US4: Operator records in-house shipment

**As a** shipment operator,
**I want** to record dispatch with the carrier and the tracking number, then delivery with the carrier's proof, on the order,
**so that** the winner can follow the lot, and only someone allowed to ship records a shipment.

<!-- trace:case id=g10adm.auction-post-sale.TC-7o6 rev=1 covers=g10adm.auction-post-sale.SC-10k,g10adm.auction-post-sale.SC-js8,g10adm.auction-post-sale.SC-tl1,g10adm.auction-post-sale.SC-0vy,g10adm.auction-post-sale.SC-usw,g10adm.auction-post-sale.SC-82s,g10adm.auction-post-sale.SC-7rg,g10adm.auction-post-sale.SC-b2b,g10adm.auction-post-sale.SC-0ln -->
### g10adm.auction-post-sale.US4-TC1: Dispatch then delivery moves the order to Delivered, each on the timeline

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-04

**Pre-conditions:**

* A Preparing Shipment order; admin(operator with shipment processing) opens it.

**Steps:**

1. Record dispatch with SF Express, tracking number SF1234567890 and the carrier's tracker link.
2. Record delivery on today's date with a proof-of-delivery image.
3. Read the timeline.

**Expected Results:**

* The order reads Shipped after step 1 and Delivered after step 2.
* The timeline shows the dispatched entry with the carrier, number, tracker link, operator and delivery address, and the delivery confirmed entry with the date and the image.

---

## g10adm.auction-post-sale.US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance and Tax when the lot needs them, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

<!-- trace:case id=g10adm.auction-post-sale.TC-5dc rev=1 -->
### g10adm.auction-post-sale.US5-TC1: The quote shows Bill To and Ship To as the order holds them

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin is on an order ready for a quote, whose billing and delivery addresses differ.

**Steps:**

1. Open Send invoice.

**Expected Results:**

* Bill To and Ship To show separately, each matching the order.

<!-- trace:case id=g10adm.auction-post-sale.TC-d4e rev=2 covers=g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-b44--> -->
### g10adm.auction-post-sale.US5-TC23: The quote names the method and rail the winner chose, and asks only for that method's fee

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin opens Send invoice on an order in Preparing Invoice, in `<currency>` by `<method>`.

**Test data:**

| `<currency>` | `<method>` |
| --- | --- |
| HKD | Card |
| HKD | Bank transfer, FPS |
| HKD | Bank transfer, HK Local |
| USD | Bank transfer, HK Local |
| USD | Bank transfer, International via SWIFT |

**Steps:**

1. Read the method, the rail and the fee.

**Expected Results:**

* The quote names `<method>` and no other rail, never a generic bank transfer.
* A bank transfer asks for a fee in USD and computes none; card shows the fee from the currency's card rule, with nothing to type.

<!-- trace:case id=g10adm.auction-post-sale.TC-rh9 rev=2 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### g10adm.auction-post-sale.US5-TC13: Grade10 computes the card fee from the rule, tracking the Subtotal until send

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* admin opens Send invoice on an HKD card order in Preparing Invoice, won at USD250.00 with a USD50.00 premium.

**Steps:**

1. Type Shipping & Handling 80.00 and Insurance 20.00; read the Subtotal, fee and total.
2. Change Shipping & Handling to 85.00; read them again.
3. Send.

**Expected Results:**

* Step 1 reads Subtotal HKD3,140.00, fee HKD112.96, read-only, and total HKD3,252.96.
* Step 2 reads HKD3,179.25, HKD114.34 and HKD3,293.59.
* Step 3 sends a pending invoice with fee HKD114.34 and total HKD3,293.59.

<!-- trace:case id=g10adm.auction-post-sale.TC-u4w rev=4 covers=g10adm.auction-post-sale.SC-qv1-->,g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### g10adm.auction-post-sale.US5-TC9: Tax typed in USD joins the Subtotal, and an empty Tax sends no Tax line

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin opens Send invoice on an HKD bank-transfer order in Preparing Invoice, fee 0, whose USD lines before Tax total USD134.00.

**Test data:**

| `<tax>` | `<invoice>` |
| --- | --- |
| 8.00 | Tax USD8.00, and Subtotal HKD1,114.70, USD142.00 converted once |
| left empty | no Tax line, and Subtotal HKD1,051.90 |

**Steps:**

1. Type `<tax>` in Tax, read the quote, and send.

**Expected Results:**

* Tax takes USD; the invoice is pending with `<invoice>`, and its total equals the Subtotal.

<!-- trace:case id=g10adm.auction-post-sale.TC-70n rev=3 covers=g10adm.auction-post-sale.SC-lc8,g10adm.auction-post-sale.SC-c0y,g10adm.auction-post-sale.SC-8ko,g10adm.auction-post-sale.SC-miq -->
### g10adm.auction-post-sale.US5-TC20: Every amount is typed in USD, and an HKD invoice converts their sum once and a fee alone

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin opens Send invoice on an order in Preparing Invoice by bank transfer, in `<currency>`, whose winning bid is `<bid>` with premium `<premium>`, no Insurance or Tax.

**Test data:**

| `<currency>` | `<bid>` | `<premium>` | `<typed>` | `<subtotal>` | `<fee>` | `<total>` |
| --- | --- | --- | --- | --- | --- | --- |
| USD | USD100.00 | USD20.00 | Shipping & Handling 80.00, Insurance 40.00, fee 15.00 | USD240.00 | USD15.00 | USD255.00 |
| HKD | USD101.00 | USD20.20 | Shipping & Handling 10.01 | HKD1,030.00, not HKD1,029.99 | Free | HKD1,030.00 |
| HKD | USD70.00 | USD14.00 | Shipping & Handling 16.04 | HKD785.32, not HKD785.31 | Free | HKD785.32 |
| HKD | USD100.00 | USD20.00 | Shipping & Handling 10.00, Insurance 4.00, fee 500.00 | HKD1,051.90 | HKD3,925.00, uncapped | HKD4,976.90 |

**Steps:**

1. Read the currency each field takes, and type `<typed>`.
2. Read the quote, and send.

**Expected Results:**

* Every field takes USD; the quote shows each line as typed in USD with no HKD beside it, no rate and no note.
* It reads Subtotal `<subtotal>`, fee `<fee>` and total `<total>`; the invoice is sent pending at that total, its lines in USD as typed.

<!-- trace:case id=g10adm.auction-post-sale.TC-42i rev=2 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### g10adm.auction-post-sale.US5-TC15: A send whose total moved since it was read is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin is on Send invoice for an HKD bank-transfer order won at USD2,500.00 with a USD500.00 premium, has typed Shipping & Handling 80.00, Insurance 40.00 and fee 0.00, and reads a total of HKD24,492.00.

**Steps:**

1. In a second session, raise the USD premium minimum to 600.00.
2. Send from the first session.

**Expected Results:**

* The send is refused, showing HKD24,492.00 as read and HKD25,277.00 as the new total; Shipping & Handling and Insurance still read 80.00 and 40.00; no invoice is sent.

<!-- trace:case id=g10adm.auction-post-sale.TC-jru rev=3 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-0op-->,g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### g10adm.auction-post-sale.US5-TC25: Sending prices the invoice, starts seven days and locks the order's setup

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin works in Hong Kong time on `<order>`, in Preparing Invoice, settled in HKD by `<method>`, its address confirmed `<confirmed>`; it is 2026-09-12T09:00:00Z.

**Test data:**

| `<method>` | `<confirmed>` | `<lines>` | `<total>` |
| --- | --- | --- | --- |
| FPS, fee 0 | inside the 48 hours | USD100.00, USD20.00, Shipping & Handling USD10.00, Insurance USD4.00 | HKD1,051.90 |
| FPS, fee 0 | inside the 48 hours, the address deadline since passed | USD100.00, USD20.00, Shipping & Handling 0 | HKD942.00 |
| FPS, fee 0, assigned at close to an internal bidder's order | none: the internal order holds the house's billing address | USD101.00, USD20.20, USD10.01 | HKD1,030.00 |
| card, HKD rule | inside the 48 hours | USD250.00, USD50.00, USD80.00, USD20.00 | HKD3,252.96, fee HKD112.96 |

**Steps:**

1. Open Send invoice, type the lines, read the deadline, and send.
2. Read the order and the invoice.
3. Change the HKD card fee rule to 3.9% plus HKD2.35, and reopen the order.

**Expected Results:**

* Step 1 shows the deadline 2026-09-19 17:00 GMT+8.
* Step 2: the invoice is pending at `<total>` with deadline 2026-09-19T09:00:00Z; the order reads Pending Payment; its address, currency and method are locked.
* Step 3: the sent invoice keeps its fee and total.

<!-- trace:case id=g10adm.auction-post-sale.TC-pjh rev=2 covers=g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-0ew-->,g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-htz,g10adm.auction-post-sale.SC-pp0--> -->
### g10adm.auction-post-sale.US5-TC28: An edit before send changes the address, method, rail or currency, logged, and keeps the waiting time

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin holds `<order>`, in Preparing Invoice, whose winner confirmed `<before>` at 2026-09-12T09:00:00Z.

**Test data:**

| `<before>` | `<change>` |
| --- | --- |
| HKD, card, Home | Work and bank transfer on FPS |
| USD, card | bank transfer on International via SWIFT |
| HKD, bank transfer on HK Local | settlement currency USD, keeping HK Local |

**Steps:**

1. At 2026-09-14T09:00:00Z, open the edit, make `<change>` with the reason Winner asked by email, and commit.
2. At 2026-09-15T09:00:00Z, read the header and the timeline; open Send invoice.
3. As the winner, open the order.

**Expected Results:**

* Step 2: the order holds `<change>`, still Preparing Invoice, waited 72 hours since the winner's confirmation with no Overdue mark; an order edited before send entry names the operator, the reason, and each part before and after; the quote reads in the order's currency.
* Step 3 shows `<change>`.

<!-- trace:case id=g10adm.auction-post-sale.TC-9i1 rev=2 covers=g10adm.auction-post-sale.SC-xsv-->,g10adm.auction-post-sale.SC-4va -->
### g10adm.auction-post-sale.US5-TC27: A change to an order's setup is refused when its rail would go unoffered or it has no reason

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* admin is on `<order>`.

**Test data:**

| `<order>` | `<change>` |
| --- | --- |
| USD, Preparing Invoice, bank transfer on International via SWIFT | edit before send: settlement currency HKD, no other method named, with a reason |
| USD, Preparing Invoice, card | edit before send: bank transfer on FPS, with a reason |
| HKD, a pending invoice on FPS | reissue in USD keeping FPS, with a reason |
| HKD, Preparing Invoice, Home confirmed | edit before send: Work, with the reason left empty |

**Steps:**

1. Make `<change>`, and read the order and its timeline.

**Expected Results:**

* The change is refused; the order and its current invoice keep their currency, method, rail and address, and the timeline gains no entry.

<!-- trace:case id=g10adm.auction-post-sale.TC-r3c rev=3 covers=g10adm.auction-post-sale.SC-2g5-->,g10adm.auction-post-sale.SC-r31,g10adm.auction-post-sale.SC-r32--> -->
### g10adm.auction-post-sale.US5-TC22: A reissue may change the currency or only the rail, and the replaced invoice keeps its amounts

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin holds `<order>`, whose pending invoice was sent in `<currency>` for bank transfer on `<rail>`, won at USD100.00 with a USD20.00 premium.

**Test data:**

| `<currency>` | `<rail>` | `<reissue>` | `<new invoice>` |
| --- | --- | --- | --- |
| HKD | HK Local | in USD, keeping HK Local | in USD, its lines unconverted |
| HKD | FPS | keeping HKD, on HK Local | in HKD on HK Local, with HK Local's bank details |
| USD | HK Local | keeping USD, on International via SWIFT | in USD on International via SWIFT |

**Steps:**

1. Reissue as `<reissue>`, changing nothing else, with the reason Winner requested another rail.
2. Read the order, both invoices and the reissued entry.

**Expected Results:**

* The reissue is accepted; the order and the new pending invoice read `<new invoice>`.
* The replaced invoice keeps its currency, rail and amounts, Subtotal HKD942.00 where it was in HKD; the reissued entry names the currency or rail as the changed part.

---

## g10adm.auction-post-sale.US6: Operator sees which lots are still in extended bidding

**As an** auction operator,
**I want** the Listings table to mark a lot still taking bids past its scheduled close,
**so that** I can tell a lot running long from one that closed on time.

<!-- trace:case id=g10adm.auction-post-sale.TC-vsq rev=2 covers=g10adm.auction-post-sale.SC-hvd,g10adm.auction-post-sale.SC-jck,g10adm.auction-post-sale.SC-bps -->
### g10adm.auction-post-sale.US6-TC1: The Listings table marks only a lot in extended bidding

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-06

**Pre-conditions:**

* admin(operator) is on the Listings table; `<listing>` is `<state>`.

**Test data:**

| `<state>` | `<reads>` |
| --- | --- |
| published, past its scheduled close, still taking bids | Extended beside its unchanged status |
| published, before its scheduled close | no Extended |
| closed after its extended bidding ended | no Extended |

**Steps:**

1. Read `<listing>`'s row.

**Expected Results:**

* It reads `<reads>`.

---

## g10adm.auction-post-sale.US7: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

<!-- trace:case id=g10adm.auction-post-sale.TC-6bv rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk -->
### g10adm.auction-post-sale.US7-TC1: Reissuing an expired invoice gives a fresh seven days and card payment back, the suspension standing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<order>`'s card invoice was sent at 2026-09-05T09:00:00Z and is unpaid past its deadline; its winner is suspended; it is 2026-09-14T10:00:00Z.

**Steps:**

1. Open Reissue, change Insurance, give the reason Winner asked for more time, and read the deadline choices and what else the dialog offers.
2. Reissue, and read the order, its row on Orders and the winner's account.
3. As the winner, pay the Order Total by card.

**Expected Results:**

* Step 1 offers only a fresh seven days from the send, and no reinstatement.
* Step 2: the invoice is pending with deadline 2026-09-21T10:00:00Z; the order reads Pending Payment, no longer expired or needing action; the winner is still suspended.
* Step 3: Winner Order offers card Pay, the payment is accepted, and the order reads Preparing Shipment.

<!-- trace:case id=g10adm.auction-post-sale.TC-6p7 rev=2 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-kdq -->
### g10adm.auction-post-sale.US7-TC5: A reissue with a reason sends a new pending invoice for what changed, the old one marked Replaced

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin is on `<order>`, settled in HKD, whose `<invoice>` is pending with a deadline of 2026-09-19T09:00:00Z; it is 2026-09-15T10:00:00Z.

**Test data:**

| `<invoice>` | `<change>` | `<new invoice>` |
| --- | --- | --- |
| card invoice | Work as the address, with new Shipping & Handling, keeping the deadline | for Work, deadline 2026-09-19T09:00:00Z |
| card invoice | Work as the address, with new Shipping & Handling, restarting the deadline | for Work, deadline 2026-09-22T10:00:00Z |
| card invoice | only a fresh seven days | deadline 2026-09-22T10:00:00Z, a new invoice ID and bank reference |
| invoice with no Tax | Tax 60.00 | Tax USD60.00 |
| invoice with Tax USD60.00 | Tax cleared | no Tax line, Subtotal HKD471.00 lower |

**Steps:**

1. Open Reissue, make `<change>`, give a reason, and reissue.
2. Read both invoices and the reissued entry.

**Expected Results:**

* The new invoice is pending, `<new invoice>`; the old one reads Replaced, never Cancelled; the entry names only what `<change>` changed.

<!-- trace:case id=g10adm.auction-post-sale.TC-1lc rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-kdq -->
### g10adm.auction-post-sale.US7-TC6: A reissue with no reason, no change, or a card fee it cannot price is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin is on `<order>`, whose `<invoice>` is pending.

**Test data:**

| `<invoice>` | `<attempt>` | `<refusal names>` |
| --- | --- | --- |
| card invoice | change Insurance, reason left empty | the reason |
| card invoice | keep the deadline, change nothing, give a reason | that nothing changed |
| bank-transfer invoice; no card fee rule in its currency | switch to card, give a reason | `CARD_FEE_UNSET`, pointing to Payment Settings |

**Steps:**

1. Open Reissue, `<attempt>`, and reissue.

**Expected Results:**

* It is refused, naming `<refusal names>`; the dialog stays open and the current invoice keeps its ID, amount and deadline.

<!-- trace:case id=g10adm.auction-post-sale.TC-w3j rev=2 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-obc,g10adm.auction-post-sale.SC-5ky,g10adm.auction-post-sale.SC-5at,g10adm.auction-post-sale.SC-hto,g10adm.auction-post-sale.SC-ltc,g10adm.auction-post-sale.SC-3fi,g10adm.auction-post-sale.SC-xvo,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-kdq -->
### g10adm.auction-post-sale.US7-TC32: Switching method on a reissue prices the fee by the new method

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin opens Reissue on `<order>`, Pending Payment in HKD, whose `<invoice>`; the HKD card fee rule is 3.4% plus HKD2.35.

**Test data:**

| `<invoice>` | `<switch>` | `<fee reads>` | `<totals>` |
| --- | --- | --- | --- |
| card invoice, USD lines of USD400.00, Subtotal HKD3,140.00, fee HKD112.96 | to bank transfer | empty, as zero, with nothing carried from the card fee; typing 50.00 reads HKD392.50 below the Subtotal | previous HKD3,252.96 beside new HKD3,140.00 |
| card invoice, as above | to bank transfer and back to card, Shipping & Handling raised so the lines total USD405.00 | HKD114.34, from the card rule, read-only | previous HKD3,252.96 beside new HKD3,293.59 |
| bank-transfer invoice with fee USD5.00 | stay on bank transfer | USD5.00, prefilled | previous beside new |
| bank-transfer invoice | to card | the card rule's gross-up of the Subtotal, nothing to type | previous beside new |

**Steps:**

1. Make `<switch>`, and read the USD lines, the Subtotal, the fee and both totals.

**Expected Results:**

* The dialog lists the USD lines and the HKD Subtotal; the fee reads `<fee reads>`; the totals read `<totals>`.

<!-- trace:case id=g10adm.auction-post-sale.TC-jn5 rev=2 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### g10adm.auction-post-sale.US7-TC25: A bank transfer fee may be empty, zero or larger than the Subtotal

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin is on `<order>`, a bank-transfer order, and opens `<dialog>`.

**Test data:**

| `<dialog>` | `<fee>` | `<fee reads>` |
| --- | --- | --- |
| Send invoice, the order in Preparing Invoice | empty | Free |
| Send invoice, the order in Preparing Invoice | 0 | Free |
| Reissue, its invoice pending | 0.01 | USD0.01, converted where the order is in HKD |
| Reissue, its invoice pending | more than the Subtotal | that amount, uncapped |

**Steps:**

1. Read the dialog: it names bank transfer and asks for its fee.
2. Type Shipping & Handling where empty and `<fee>`, give a reason on a reissue, and send.

**Expected Results:**

* The invoice is sent with Payment Processing Fee `<fee reads>`.

<!-- trace:case id=g10adm.auction-post-sale.TC-rqt rev=1 -->
### g10adm.auction-post-sale.US7-TC9: A bank transfer fee below zero, finer than a cent, or not a number is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin has Reissue open on `<order>`, bank transfer chosen.

**Test data:**

| `<fee>` |
| --- |
| -1 |
| 0.001 |
| abc |

**Steps:**

1. Type `<fee>` and a reason, and reissue.

**Expected Results:**

* It is refused at the fee, and the current invoice is unchanged.

<!-- trace:case id=g10adm.auction-post-sale.TC-mqb rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-obc,g10adm.auction-post-sale.SC-5ky,g10adm.auction-post-sale.SC-5at,g10adm.auction-post-sale.SC-hto,g10adm.auction-post-sale.SC-ltc,g10adm.auction-post-sale.SC-3fi -->
### g10adm.auction-post-sale.US7-TC33: Record payment starts at the balance, says what the payment does, and keeps the fee line

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin opens Record payment on `<order>`, Pending Payment, whose bank-transfer invoice totals HKD3,120.00 with fee `<fee>`.

**Test data:**

| `<fee>` | `<proof>` |
| --- | --- |
| Free | one PDF slip |
| HKD39.25 | five files of PDF, JPEG and PNG |

**Steps:**

1. Read the amount and the balance.
2. Change the amount to 2000.00 and read them again.
3. Change it back, choose bank transfer, and enter reference HSBC-778812, received 2026-09-25, `<proof>` and the reason Transfer seen on the statement; commit.
4. Read the order and the paid invoice.

**Expected Results:**

* Step 1 reads the full total, a balance of HKD3,120.00 before and 0 after, saying the invoice will be paid.
* Step 2 reads HKD1,120.00 after, saying the order will read Partially Paid.
* Step 4: the invoice is paid, never Payment Verifying, and still shows Payment Processing Fee `<fee>` within the amount; the order reads Preparing Shipment; the payment carries bank transfer, HSBC-778812, 2026-09-25 and `<proof>`.

<!-- trace:case id=g10adm.auction-post-sale.TC-7l8 rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### g10adm.auction-post-sale.US7-TC34: Record payment refuses what it cannot record

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin opens Record payment on `<order>`, Pending Payment, whose bank-transfer invoice totals HKD3,120.00.

**Test data:**

| `<attempt>` | `<refusal names>` |
| --- | --- |
| the balance by bank transfer with a reference and a PDF, and no reason | the reason |
| cash with a reason and no proof file | the proof |
| other, with no description, a PDF and a reason | the description |
| a valid PDF with a 12 MB JPEG, and a reason | the file size, storing no file |
| 0.00 with a PDF and a reason | the amount |

**Steps:**

1. Record `<attempt>`, and read the invoice and the timeline.

**Expected Results:**

* It is refused, naming `<refusal names>`; the invoice is still pending and the timeline gains no payment entry.

<!-- trace:case id=g10adm.auction-post-sale.TC-b2x rev=1 -->
### g10adm.auction-post-sale.US7-TC19: Each invoice state offers only its own payment actions

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin is on `<order>`, `<state>`.

**Test data:**

| `<state>` | `<offered>` | `<not offered>` |
| --- | --- | --- |
| Pending Payment, its bank-transfer invoice pending, no proof | Reissue and Record payment | Confirm and Return |
| Pending Payment, its card invoice pending | Reissue | Record payment, Confirm and Return |
| Payment Verifying | Confirm and Return | Reissue, Record payment and Cancel |
| its bank-transfer invoice expired, no proof | Reissue, Record payment and Cancel | Confirm and Return |
| Preparing Invoice, no invoice sent | Send invoice | Record payment |
| Preparing Shipment, paid by a recorded payment | Dispatch | Record payment |

**Steps:**

1. Read the header and More.

**Expected Results:**

* It offers `<offered>`, and not `<not offered>`.

<!-- trace:case id=g10adm.auction-post-sale.TC-amb rev=1 covers=g10adm.auction-post-sale.SC-3p6,g10adm.auction-post-sale.SC-34a,g10adm.auction-post-sale.SC-lq4,g10adm.auction-post-sale.SC-r1r,g10adm.auction-post-sale.SC-vg7,g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### g10adm.auction-post-sale.US7-TC36: An action the operator's grant does not cover stays visible, disabled and named, and proof opens for everyone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* `<operator>` opens `<order>`.

**Test data:**

| `<operator>` | `<order>` | `<reads>` |
| --- | --- | --- |
| admin(roles exactly `staff`) | Payment Overdue, bank transfer | Reissue disabled in the header, and Record payment and Cancel disabled under More, each naming payment processing |
| admin(roles exactly `staff`) | Payment Verifying | Confirm and Return disabled, naming payment processing |
| admin(roles exactly `staff`) | Preparing Invoice | the edit before send disabled, naming payment processing |
| admin(holds fulfilment, not payment processing) | Setup Overdue | Reopen setup disabled, naming payment processing |
| admin(roles exactly `finance`) | Shipped, its proof confirmed | the proof file opening, and Confirm delivery disabled, naming shipment processing |
| admin(roles exactly `finance`) | Preparing Shipment | Dispatch disabled in the header, naming shipment processing beneath it |

**Steps:**

1. Read the header and More, and open any proof file.

**Expected Results:**

* It reads `<reads>`.

<!-- trace:case id=g10adm.auction-post-sale.TC-2mh rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### g10adm.auction-post-sale.US7-TC4: Cancelling an unpaid order returns its lot to stock, offers no runner-up and suspends no one

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
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* admin(roles exactly `finance`) is on `<order>`, `<state>`; its lot had a runner-up.

**Test data:**

| `<state>` |
| --- |
| Setup Overdue, no invoice ever sent |
| Payment Overdue, its invoice expired |

**Steps:**

1. Cancel it with a category and the note Winner never confirmed.
2. Read the order, its lot on the Listings table and in stock, the winner's account, and the runner-up's My Auctions.

**Expected Results:**

* The order reads Cancelled and leaves its queue; the timeline names the finance operator.
* The lot is still Closed and back in stock to list again; the runner-up is offered nothing; the winner is not suspended.

<!-- trace:case id=g10adm.auction-post-sale.TC-o29 rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-obc,g10adm.auction-post-sale.SC-5ky,g10adm.auction-post-sale.SC-5at,g10adm.auction-post-sale.SC-hto,g10adm.auction-post-sale.SC-ltc,g10adm.auction-post-sale.SC-3fi -->
### g10adm.auction-post-sale.US7-TC35: Setup Overdue is the only waiting mark, and a flagged order counts from its flag

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* On Orders: an Awaiting Setup order whose lot closed 30 hours ago; an order whose lot closed 50 hours ago with no setup; a Preparing Invoice order confirmed 80 hours ago; a Pending Payment order sent 3 days ago and flagged 2 days ago for a card payment on its replaced invoice.

**Steps:**

1. Read each order's status and wait under All.

**Expected Results:**

* They read Awaiting Setup, 30 hours, no mark; Setup Overdue, 2 hours from its address deadline; Preparing Invoice, 80 hours, no mark; and 2 days, since the flag.

---

## g10adm.auction-post-sale.US8: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

<!-- trace:case id=g10adm.auction-post-sale.TC-i9j rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### g10adm.auction-post-sale.US8-TC1: Failed card attempts show on the timeline, telling a buyer who tried from one who never did

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* `<tried>`'s winner was declined three times before the deadline; `<silent>`'s log holds only its sent entry.

**Steps:**

1. Read `<tried>`'s timeline, then `<silent>`'s.

**Expected Results:**

* `<tried>` shows three failed payment attempts with their times; `<silent>` only the sent entry.

<!-- trace:case id=g10adm.auction-post-sale.TC-cci rev=1 -->
### g10adm.auction-post-sale.US8-TC6: Each payment entry names how it was paid, its proof and its audit number

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* On `<order>` the winner's proof was uploaded, returned with an external and an internal reason, uploaded again and confirmed; its first invoice holds #00010482, the reissued one #00010490, and the receipt #00010495. Another order was paid by a Visa card ending 4242, and a third settled by cash with one proof file.

**Steps:**

1. Read `<order>`'s timeline.
2. Read the paid entry of the card order and the payment recorded entry of the cash order.

**Expected Results:**

* Step 1 lists, in time order, each upload with the time left, the return with both reasons, and the confirm with its proof files; the sent, reissued and paid entries show #00010482, #00010490 and #00010495, each number also beside its invoice or receipt.
* Step 2 names a Visa card ending 4242, and cash with its proof file.

<!-- trace:case id=g10adm.auction-post-sale.TC-uap rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### g10adm.auction-post-sale.US8-TC2: A later change leaves the earlier entries as they were

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin opens `<order>`, on which `<later>` happened.

**Test data:**

| `<later>` | `<still reads>` |
| --- | --- |
| an operator corrected the address after dispatch | the dispatched entry with the address at dispatch in full, and the correction as its own later entry |
| it was cancelled, and its lot relisted and sold to another winner | every invoice and fulfilment entry it held at its cancellation |

**Steps:**

1. Read the timeline from the first entry to the last.

**Expected Results:**

* It shows `<still reads>`, unchanged, and no entry offers an edit or a delete.

<!-- trace:case id=g10adm.auction-post-sale.TC-fph rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### g10adm.auction-post-sale.US8-TC4: A buyer's reissue history spans all their orders

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* `<buyer>` has reissues on three orders, `<order>` among them.

**Steps:**

1. Open `<order>`, and read the buyer's reissue history and the order's reissue count.

**Expected Results:**

* The history spans all three orders; the count is `<order>`'s own.

<!-- trace:case id=g10adm.auction-post-sale.TC-r9c rev=1 covers=g10adm.auction-post-sale.SC-ua0,g10adm.auction-post-sale.SC-j3o,g10adm.auction-post-sale.SC-hgz,g10adm.auction-post-sale.SC-k8l,g10adm.auction-post-sale.SC-jce,g10adm.auction-post-sale.SC-dgt -->
### g10adm.auction-post-sale.US8-TC5: A refund joins the order's history beside its invoice and fulfilment entries

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* An order with invoice and fulfilment entries and a recorded refund; admin(holds refund processing) opens it.

**Steps:**

1. Read the timeline.

**Expected Results:**

* The invoice and fulfilment entries remain, beside the refund.

<!-- trace:case id=g10adm.auction-post-sale.TC-c75 rev=1 -->
### g10adm.auction-post-sale.US8-TC7: A replaced invoice stays readable on the order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* On `<order>`, `<first>` was replaced by `<second>`.

**Steps:**

1. Open `<first>` and its PDF.

**Expected Results:**

* `<first>` reads Replaced with no status of its own, never Cancelled, and its PDF names `<second>`.

<!-- trace:case id=g10adm.auction-post-sale.TC-0ok rev=2 covers=g10adm.auction-post-sale.SC-tyi -->
### g10adm.auction-post-sale.US8-TC10: A reissue's entry names its new total, the difference, and each part it changed

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
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin opens `<order>`, Pending Payment in HKD with `<before>`; the HKD card fee rule is 3.4% plus HKD2.35.

**Test data:**

| `<before>` | `<reissue>` | `<parts named>` | `<total after>` | `<delta>` |
| --- | --- | --- | --- | --- |
| a card invoice: USD250.00, USD50.00, Shipping & Handling USD80.00, Insurance USD20.00; total HKD3,252.96 | bank transfer, fee empty, Shipping & Handling USD120.00 | payment method, card to bank transfer; Payment Processing Fee, HKD112.96 to HKD0.00; Shipping & Handling, USD80.00 to USD120.00 | HKD3,454.00 | HKD201.04 |
| a bank-transfer invoice: USD101.00, USD20.20, USD10.01, fee USD0; total HKD1,030.00 | Shipping & Handling USD20.01 | Shipping & Handling, USD10.01 to USD20.01 | HKD1,108.50 | HKD78.50 |
| a card invoice: USD150.00, USD30.00, USD49.00, USD20.00, USD2.00; total HKD2,042.14 | Shipping & Handling USD16.04 | Shipping & Handling, USD49.00 to USD16.04; Payment Processing Fee, HKD71.79 to HKD62.68 | HKD1,774.30 | -HKD267.84 |
| a card invoice: USD150.00, USD30.00, USD49.00, USD20.00, no Tax; total HKD2,025.88 | Tax USD2.00 | Tax, none to USD2.00; Payment Processing Fee, HKD71.23 to HKD71.79 | HKD2,042.14 | HKD16.26 |
| a bank-transfer invoice: USD101.00, USD20.20, USD10.01, no Tax; total HKD1,030.00 | Tax USD60.00 | Tax, none to USD60.00 | HKD1,501.00 | HKD471.00 |

**Steps:**

1. Reissue as `<reissue>`, keeping the deadline, with a reason; read the reissued entry.

**Expected Results:**

* It carries `<total after>` in HKD and the difference `<delta>`; it names `<parts named>`, each before and after, a line in USD and the fee in HKD, no HKD figure for a line, and no other part.

---

## g10adm.auction-post-sale.US10: Operator checks a winner's payment proof

**As a** payment operator,
**I want** to see the proof a winner uploaded against the invoice, then confirm the payment or return the invoice with a reason,
**so that** money I can match settles the order, and a winner whose proof I cannot match knows why and keeps the time they had.

<!-- trace:case id=g10adm.auction-post-sale.TC-gsw rev=1 -->
### g10adm.auction-post-sale.US10-TC1: Confirming proof settles the invoice with every file the winner and the operator gave

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin is on `<order>`, Payment Verifying, the winner having uploaded `<files>`.

**Test data:**

| `<files>` | `<operator adds>` |
| --- | --- |
| 5 files: PDF, JPEG and PNG | nothing |
| 1 file | one bank statement |

**Steps:**

1. Open the proof on the invoice; add `<operator adds>`.
2. Confirm the payment.

**Expected Results:**

* Step 1 shows every winner file.
* Step 2: the invoice is paid and the order reads Preparing Shipment; the proof lists the winner's files and any the operator added.

<!-- trace:case id=g10adm.auction-post-sale.TC-zwf rev=1 -->
### g10adm.auction-post-sale.US10-TC3: Returning proof shows the time left and resumes the deadline from it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin is on `<order>`, Payment Verifying with 2 days 5 hours kept.

**Steps:**

1. Open Return, and read it.
2. Enter an external and an internal reason, and return.

**Expected Results:**

* Step 1 shows 2 days 5 hours.
* Step 2: the invoice is pending, its deadline now plus 2 days 5 hours; the order reads Pending Payment.

<!-- trace:case id=g10adm.auction-post-sale.TC-48t rev=1 -->
### g10adm.auction-post-sale.US10-TC4: A return without both reasons is refused

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
* **Trace:** post-sale-US-10

**Pre-conditions:**

* admin has Return open on `<order>`, Payment Verifying.

**Test data:**

| `<reasons>` |
| --- |
| neither |
| external only |
| internal only |

**Steps:**

1. Enter `<reasons>`, and return.

**Expected Results:**

* It is refused, naming the missing reason; the order stays Payment Verifying.

<!-- trace:case id=g10adm.auction-post-sale.TC-l1r rev=1 -->
### g10adm.auction-post-sale.US10-TC7: A second operator acting on a check already decided is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-10

**Pre-conditions:**

* Two admin(holds payment processing) have `<order>` open, Payment Verifying.

**Steps:**

1. Operator A confirms; operator B, without reloading, returns.

**Expected Results:**

* B's return is refused; the invoice stays paid, and no proof-not-accepted letter goes out.

---

## g10adm.auction-post-sale.US11: Operator adds a missing billing address before sending

**As an** operator,
**I want** to add the billing address to an order that has none before I send its invoice,
**so that** no invoice goes out without a billing address the winner gave.

<!-- trace:case id=g10adm.auction-post-sale.TC-jre rev=1 -->
### g10adm.auction-post-sale.US11-TC2: The operator records billing, then sends

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-11

**Pre-conditions:**

* admin is on an order with a delivery address and no billing address.

**Steps:**

1. Open the address edit, leave Same as delivery address selected, and record it with a reason.
2. Open Send invoice, and send.

**Expected Results:**

* Step 1 records the delivery address as billing, logged with the reason.
* Step 2 shows Bill To and Ship To, and sends.

---

## g10adm.auction-post-sale.US12: Operator collects a lot's price across more than one payment

**As an** operator,
**I want** to record each payment as it arrives and see the order until it is settled,
**so that** every partial payment is recorded without tracking the balance outside Grade10.

<!-- trace:case id=g10adm.auction-post-sale.TC-yws rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
### g10adm.auction-post-sale.US12-TC1: Each part payment is recorded on its own, and the order reads Partially Paid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* admin is on `<order>`, whose HKD11,775.00 invoice is unpaid.

**Steps:**

1. Record HKD400.00 with its method, reference and proof.
2. Record HKD200.00 the same way, and read the payments.

**Expected Results:**

* Step 1 is accepted: the order reads Partially Paid, the payment has its own receipt number, and HKD11,375.00 remains.
* Step 2 is accepted as a new payment; both are listed oldest first, and the order stays Partially Paid.

<!-- trace:case id=g10adm.auction-post-sale.TC-uz7 rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t,g10adm.auction-post-sale.SC-9nm -->
### g10adm.auction-post-sale.US12-TC3: From 90% paid the operator may close the invoice or keep collecting, never below it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* admin is recording a payment on `<order>`, which has HKD5,887.50 paid of HKD11,775.00.

**Steps:**

1. Record HKD4,121.25, and try to mark the invoice Paid.
2. Record HKD588.75.
3. Keep collecting; then record the HKD1,177.50 left.

**Expected Results:**

* Step 1 records the payment and refuses Paid, HKD10,008.75 being below 90%; the order reads Partially Paid with HKD1,766.25 left.
* Step 2, at HKD10,597.50, asks whether to close or keep collecting.
* Step 3 keeps Partially Paid with the real balance, then closes the invoice as Paid without a second prompt.

<!-- trace:case id=g10adm.auction-post-sale.TC-qpm rev=1 covers=g10adm.auction-post-sale.SC-fmz,g10adm.auction-post-sale.SC-z26,g10adm.auction-post-sale.SC-u2w,g10adm.auction-post-sale.SC-k4t -->
### g10adm.auction-post-sale.US12-TC4: An overpayment needs confirming before the invoice reads Paid

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* admin is recording a payment on `<order>`, which has HKD900.00 paid of HKD1,000.00.

**Steps:**

1. Enter HKD150.00, and confirm the overpayment dialog.

**Expected Results:**

* The dialog appears before anything is recorded; then the full HKD150.00 is recorded and the invoice reads Paid, with no separate adjustment line.

<!-- trace:case id=g10adm.auction-post-sale.TC-pfj rev=1 covers=g10adm.auction-post-sale.SC-pxo -->
### g10adm.auction-post-sale.US12-TC6: Once a payment counts, the invoice cannot be reissued or the order cancelled

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* admin is on `<order>`, Partially Paid with HKD5,887.50 of HKD11,775.00.

**Steps:**

1. Try to reissue the invoice, then to cancel the order.
2. Open Record payment.

**Expected Results:**

* Step 1 is refused each time; the address, method and total are unchanged.
* Step 2 is offered, and the order stays Partially Paid.

<!-- trace:case id=g10adm.auction-post-sale.TC-dwh rev=1 covers=g10adm.auction-post-sale.SC-mhe -->
### g10adm.auction-post-sale.US12-TC7: Money that counts toward nothing leaves Reissue and Cancel open

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-12

**Pre-conditions:**

* `<first>` and `<second>` are Pending Payment, each holding only a payment that counts toward nothing.

**Steps:**

1. Reissue `<first>` with a reason; cancel `<second>` with a reason.

**Expected Results:**

* `<first>` reads Pending Payment on a new invoice, `<second>` reads Cancelled, and each payment is still recorded on its order.

---

## g10adm.auction-post-sale.US13: Operator cancels an order knowing what follows

**As an** operator with payment processing,
**I want** to choose a reason and see the consequences before confirming,
**so that** every cancellation is deliberate and countable.

<!-- trace:case id=g10adm.auction-post-sale.TC-atu rev=1 covers=g10adm.auction-post-sale.SC-6oq,g10adm.auction-post-sale.SC-1qh,g10adm.auction-post-sale.SC-kcq,g10adm.auction-post-sale.SC-30g,g10adm.auction-post-sale.SC-i4m -->
### g10adm.auction-post-sale.US13-TC1: The cancel dialog states what follows and needs a category and note

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-13

**Pre-conditions:**

* admin is on `<order>`, unpaid and cancellable.

**Steps:**

1. Open Cancel, and read it.
2. Submit without a category or note.
3. Choose Missed setup, enter a note, and confirm; follow the order's lot link.

**Expected Results:**

* Step 1 names the stock return, no runner-up, the winner's email, that a suspension stays, and that it cannot be undone.
* Step 2 is refused.
* Step 3 cancels it with that category and note; the link opens the same lot, back in stock for relisting.

---

## g10adm.auction-post-sale.US14: Operator returns money paid after a cancel

**As an** operator,
**I want** a late card payment to remain flagged until Finance returns it,
**so that** no winner pays for a cancelled lot without a follow-up.

<!-- trace:case id=g10adm.auction-post-sale.TC-m90 rev=1 -->
### g10adm.auction-post-sale.US14-TC1: A card payment after a cancel is recorded and flagged until cleared, one at a time

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-14

**Pre-conditions:**

* customer(winner) opened two card payment sessions on `<order>`'s invoice; admin then cancelled `<order>`.

**Steps:**

1. As the winner, complete both payments.
2. As admin, open `<order>` and Needs action.
3. Clear the first payment's flag with the reason Finance returned it, and no return reference.
4. Read the order, its notices, its lot, and Needs action.

**Expected Results:**

* Step 2: both payments are recorded, each flagged Paid after cancel; the order reads Cancelled and is under Needs action.
* Step 4: the first flag is cleared with the reason, operator and time; the second stays; the order stays Cancelled and the lot in stock.

---

## g10adm.auction-post-sale.US15: Operator filters Setup Overdue and Payment Overdue

**As an** operator,
**I want** Setup Overdue and Payment Overdue as queue outcomes,
**so that** I find deadline-missed orders using the same names as the winner.

<!-- trace:case id=g10adm.auction-post-sale.TC-gap rev=1 covers=g10adm.auction-post-sale.SC-vhw,g10adm.auction-post-sale.SC-bs6 -->
### g10adm.auction-post-sale.US15-TC1: Orders past a deadline read and filter as Setup Overdue and Payment Overdue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-15

**Pre-conditions:**

* Orders holds one order past its setup deadline and one past its payment deadline, unpaid.

**Steps:**

1. Read both rows.
2. Filter to Setup Overdue, then to Payment Overdue.

**Expected Results:**

* Step 1 reads Setup Overdue and Payment Overdue, one outcome each.
* Step 2 lists only the matching order each time.

---

## g10adm.auction-post-sale.US16: Operator records a refund a winner asked Customer Service for

**As an** operator with refund processing,
**I want** to record the refund I sent in Stripe or by bank transfer on the order, with its amount, reason, reference and proof, and say whether the lot goes back to stock,
**so that** a closing refund reads Refunded, an overpayment keeps the order's status, and the lot's stock matches where the card is.

<!-- trace:case id=g10adm.auction-post-sale.TC-c92 rev=2 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs -->
### g10adm.auction-post-sale.US16-TC1: A bank refund is restated before commit, names where it went, and closes the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-16

**Pre-conditions:**

* A Delivered order paid HKD3,120.00; admin(roles exactly `staff`, holding refund processing and not payment processing) opens Refund.

**Steps:**

1. Enter 3120.00, Not as described, FPS to HSBC with FPS ID 12345678, reference FPS-99812, refunded 2026-09-25, the lot back to stock and one proof file.
2. Read the restatement, and commit.
3. Read the refund record and the header; try a second refund.

**Expected Results:**

* Step 2 restates HKD3,120.00, FPS, HSBC, the FPS ID masked to 5678 and the lot back to stock, saying it is the order's only refund and cannot be undone.
* Step 3: the record carries FPS, HSBC, the masked ID, 2026-09-25, the reason, operator and time, and the next audit number; neither it nor the timeline shows 12345678; the order reads Refunded, the lot is in stock, and the second refund is refused.

<!-- trace:case id=g10adm.auction-post-sale.TC-d65 rev=1 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs,g10adm.auction-post-sale.SC-dwy,g10adm.auction-post-sale.SC-brr,g10adm.auction-post-sale.SC-qno -->
### g10adm.auction-post-sale.US16-TC3: A refund of the whole amount paid closes the order; one of an overpaid difference keeps its status

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-16

**Pre-conditions:**

* admin(operator with refund processing) opens Refund on `<order>`.

**Test data:**

| `<order>` | `<refund>` | `<reads after>` |
| --- | --- | --- |
| Partially Paid, HKD400.00 paid | 400.00 by bank, the lot back to stock | Refunded, the record carrying HKD400.00, the method, the next audit number and the stock choice |
| Preparing Shipment, HKD3,200.00 paid of HKD3,120.00, the overpayment confirmed | 80.00 for Duplicate or overpayment | Preparing Shipment |

**Steps:**

1. Record `<refund>` with its reason, reference and a proof file.
2. Read the order; try a second refund.

**Expected Results:**

* Step 2 reads `<reads after>`, and the second refund is refused.

<!-- trace:case id=g10adm.auction-post-sale.TC-h64 rev=1 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs -->
### g10adm.auction-post-sale.US16-TC2: A refund cannot return more than was paid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-16

**Pre-conditions:**

* admin(holds refund processing) is on `<order>`, Partially Paid with HKD400.00 paid.

**Steps:**

1. Refund HKD400.01, and read the order.

**Expected Results:**

* It is refused, taking no audit number; the order still reads Partially Paid.

---

## g10adm.auction-post-sale.US17: Finance reconciles auction refunds

**As a** finance operator,
**I want** to filter the queue to Refunded and read the full refund record,
**so that** each external refund matches one Grade10 record.

<!-- trace:case id=g10adm.auction-post-sale.TC-8st rev=1 covers=g10adm.auction-post-sale.SC-9zs -->
### g10adm.auction-post-sale.US17-TC1: The Refunded filter and the order show one complete refund record

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-17

**Pre-conditions:**

* A Refunded order with its amount, method, reference, reason, proof and audit number; admin(holds refund processing) is on Orders.

**Steps:**

1. Filter to Refunded, open the order, and read its timeline.

**Expected Results:**

* The filter lists the order; the page and the timeline show the same complete refund record.

---

## g10adm.auction-post-sale.US18: Operator reopens the address form

**As an** operator,
**I want** to give a winner who missed the 48-hour address deadline a fresh 48 hours, with my reason on the record,
**so that** a winner who got in touch can finish the order without me cancelling the lot.

<!-- trace:case id=g10adm.auction-post-sale.TC-unr rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v,g10adm.auction-post-sale.SC-fzv,g10adm.auction-post-sale.SC-blu,g10adm.auction-post-sale.SC-su0 -->
### g10adm.auction-post-sale.US18-TC1: A reopen gives a fresh 48 hours from the moment it reopens, logged with its reason

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Audit trail

**Pre-conditions:**

* `<order>` reads Setup Overdue, its lot closed 2026-09-03T12:00:00Z and its address deadline passed 2026-09-05T12:00:00Z; it is 2026-09-07T09:00:00Z.

**Steps:**

1. Reopen the address form with a reason, and read the deadline.
2. Read the timeline.

**Expected Results:**

* Step 1 is accepted; the deadline reads 2026-09-09T09:00:00Z, from the reopen, not the close.
* Step 2 holds a reopen entry at 2026-09-07T09:00:00Z naming the operator, the reason and the new deadline, the earlier entries unchanged.

<!-- trace:case id=g10adm.auction-post-sale.TC-r1s rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### g10adm.auction-post-sale.US18-TC4: A reopened order waits on the winner again, and may be reopened again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-18

**Pre-conditions:**

* `<order>` reads Setup Overdue.

**Steps:**

1. Reopen with a reason, and read its outcome on Orders.
2. Let the fresh deadline pass unused, and at 2026-09-10T15:00:00Z reopen again.

**Expected Results:**

* Step 1 reads Awaiting Setup, the form open to the winner, and the row no longer needs action.
* Step 2 is accepted, the deadline reading 2026-09-12T15:00:00Z; no cap applies.

<!-- trace:case id=g10adm.auction-post-sale.TC-6p3 rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### g10adm.auction-post-sale.US18-TC2: A reopen without a reason is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-18

**Pre-conditions:**

* admin is on `<order>`, Setup Overdue, its address deadline two days past.

**Steps:**

1. Open the reopen form, leave the reason empty, and commit.

**Expected Results:**

* It is refused; the deadline is unchanged, and the winner still cannot confirm an address.

<!-- trace:case id=g10adm.auction-post-sale.TC-t9r rev=1 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v -->
### g10adm.auction-post-sale.US18-TC6: No reopen once the address is confirmed, the invoice sent or the order cancelled

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-18

**Pre-conditions:**

* admin is on `<order>`, `<state>`.

**Test data:**

| `<state>` | `<order offers>` |
| --- | --- |
| Preparing Invoice, its address confirmed, the address deadline passed | Send invoice |
| its invoice sent on 2026-09-05T09:00:00Z | a re-quote and reissue for an address change |
| cancelled before any invoice, its lot back in stock | nothing |

**Steps:**

1. Look for the reopen control, and attempt a reopen with a reason.
2. Read the order and its lot.

**Expected Results:**

* No reopen is offered, and the attempt is refused.
* The order keeps its status and address, offering `<order offers>`; a cancelled order's lot stays in stock.

<!-- trace:case id=g10adm.auction-post-sale.TC-w9k rev=1 covers=g10adm.auction-post-sale.SC-gw4,g10adm.auction-post-sale.SC-i7j,g10adm.auction-post-sale.SC-seg,g10adm.auction-post-sale.SC-cbk,g10adm.auction-post-sale.SC-yd7,g10adm.auction-post-sale.SC-i16 -->
### g10adm.auction-post-sale.US18-TC8: Before an invoice, an order reads Awaiting Setup or Preparing Invoice, and only the latter needs action

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
* **Trace:** Queue

**Pre-conditions:**

* Orders holds `<order>`, no invoice sent, `<setup>`, and an expired-invoice order.

**Test data:**

| `<setup>` | `<outcome>` | `<needs action>` |
| --- | --- | --- |
| no address confirmed, inside its 48 hours | Awaiting Setup | no |
| its address confirmed | Preparing Invoice | yes |

**Steps:**

1. Read the row; filter to `<outcome>`.
2. Read the expired-invoice order's row.

**Expected Results:**

* Step 1: the row wears `<outcome>` alone, needs action `<needs action>`; the filter lists it and not the other pre-invoice order.
* Step 2 reads Pending Payment with its Expired invoice status beside it, needing action.

<!-- trace:case id=g10adm.auction-post-sale.TC-6iu rev=1 covers=g10adm.auction-post-sale.SC-gw4,g10adm.auction-post-sale.SC-i7j,g10adm.auction-post-sale.SC-seg,g10adm.auction-post-sale.SC-cbk,g10adm.auction-post-sale.SC-yd7,g10adm.auction-post-sale.SC-i16 -->
### g10adm.auction-post-sale.US18-TC10: Setup Overdue comes at the 48-hour mark only to an order without a confirmed address

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
* **Trace:** Queue

**Pre-conditions:**

* `<order>`'s lot closed 2026-09-03T12:00:00Z, no invoice sent, `<setup>`.

**Test data:**

| `<setup>` | `<read at>` | `<outcome>` |
| --- | --- | --- |
| no address confirmed | 2026-09-05T11:59:00Z | Awaiting Setup |
| no address confirmed | 2026-09-05T12:00:00Z | Setup Overdue |
| its address confirmed | 2026-09-06T12:00:00Z | Preparing Invoice, with no payment deadline |

**Steps:**

1. At `<read at>`, read its row on Orders.

**Expected Results:**

* It reads `<outcome>`, never cancelled or expired.

---

## g10adm.auction-post-sale.US19: Operator settles an expired invoice

**As an** operator,
**I want** an expired invoice settled only in the admin portal, and a card payment started in time to count,
**so that** a winner who paid just before the deadline is never expired, and one who paid after it is never charged.

<!-- trace:case id=g10adm.auction-post-sale.TC-o6m rev=1 covers=g10adm.auction-post-sale.SC-b5v -->
### g10adm.auction-post-sale.US19-TC1: Recording payment on an expired invoice pays it and ends what is owed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-19

**Pre-conditions:**

* admin is on `<order>`, its invoice sent 2026-09-05T09:00:00Z, unpaid past its 2026-09-12T09:00:00Z deadline.

**Steps:**

1. Record payment by bank transfer with the bank's reference and one proof file.
2. Read the order; as the winner, open it on Winner Order.

**Expected Results:**

* The order reads Preparing Shipment and the invoice paid, with no Expired status.
* Winner Order shows nothing owed and no card Pay.

<!-- trace:case id=g10adm.auction-post-sale.TC-0g4 rev=1 covers=g10adm.auction-post-sale.SC-d1w -->
### g10adm.auction-post-sale.US19-TC3: A card payment a minute before the deadline is accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* customer(winner) is on Winner Order for `<order>`, its invoice due 2026-09-12T09:00:00Z; it is 2026-09-12T08:59:00Z.

**Steps:**

1. Pay the Order Total by card.
2. As admin, read the order on Orders.

**Expected Results:**

* The payment is accepted; the order reads Preparing Shipment, never having shown Expired.

<!-- trace:case id=g10adm.auction-post-sale.TC-54p rev=1 covers=g10adm.auction-post-sale.SC-cdi -->
### g10adm.auction-post-sale.US19-TC4: A card payment a minute after the deadline is refused, the card not charged

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* customer(winner) opened Winner Order for `<order>` at 2026-09-12T08:55:00Z and kept it open; the deadline is 2026-09-12T09:00:00Z.

**Steps:**

1. At 2026-09-12T09:01:00Z, pay by card from the open page.
2. Reload.
3. As admin, read the order on Orders.

**Expected Results:**

* Step 1 is refused and the card is not charged.
* Step 2 offers Contact Us and no card Pay.
* Step 3 reads Pending Payment with Expired invoice.

---

## g10adm.auction-post-sale.US20: Operator records setup given by telephone

**As an** operator handling a winner who missed the setup deadline,
**I want** to record the delivery and billing addresses, settlement currency and payment choice the winner gives me by telephone,
**so that** I can prepare the invoice with the setup the winner confirmed.

<!-- trace:case id=g10adm.auction-post-sale.TC-b2d rev=2 covers=g10adm.auction-post-sale.SC-ehu,g10adm.auction-post-sale.SC-8of,g10adm.auction-post-sale.SC-u12,g10adm.auction-post-sale.SC-lh7,g10adm.auction-post-sale.SC-pqn,g10adm.auction-post-sale.SC-w78,g10adm.auction-post-sale.SC-egm,g10adm.auction-post-sale.SC-jy7,g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-t9v,g10adm.auction-post-sale.SC-fzv,g10adm.auction-post-sale.SC-blu,g10adm.auction-post-sale.SC-su0 -->
### g10adm.auction-post-sale.US20-TC1: Setup recorded from a telephone call readies the order without reopening it to the winner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-20

**Pre-conditions:**

* admin is on `<order>`, Setup Overdue, no address confirmed.

**Steps:**

1. Record the delivery address, billing address, HKD and bank transfer on HK Local the winner gave by telephone, with the reason Winner gave it by telephone.
2. Read the order and its timeline; as the winner, open the order.

**Expected Results:**

* The order reads Preparing Invoice; the timeline names the operator, the time and the reason.
* The winner is offered no address form, the window still closed.

<!-- trace:case id=g10adm.auction-post-sale.TC-ddn rev=2 covers=g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-ppk-->,g10adm.auction-post-sale.SC-sxy,g10adm.auction-post-sale.SC-z4g,g10adm.auction-post-sale.SC-7jb,g10adm.auction-post-sale.SC-8fx,g10adm.auction-post-sale.SC-zuz,g10adm.auction-post-sale.SC-l05 -->
### g10adm.auction-post-sale.US20-TC2: Recorded setup is refused unless complete, reasoned, offered, and on an order still waiting for it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-20

**Pre-conditions:**

* admin is on `<order>`.

**Test data:**

| `<order>` | `<recorded>` |
| --- | --- |
| Setup Overdue | both addresses and HK Local, no currency |
| Setup Overdue | both addresses and HKD, no payment choice |
| Setup Overdue | the delivery address, HKD and HK Local, no billing address |
| Setup Overdue | everything, with the reason empty |
| Setup Overdue in USD, no USD card fee rule and no USD bank details | everything, with card; then with bank transfer |
| Preparing Invoice, its address confirmed | everything, with a reason |
| its invoice sent | everything, with a reason |
| cancelled before any invoice | everything, with a reason |

**Steps:**

1. Record `<recorded>`, and read the order.

**Expected Results:**

* It is refused; the order keeps its status, address and method.

---

## g10adm.auction-post-sale.US21: Operator previews the HKD total a quote will charge

**As an** operator quoting an order whose winner picked HKD,
**I want** to see the USD lines I typed, then the HKD Subtotal, fee and total the winner will be asked to pay,
**so that** I send an invoice whose total I have read before the winner does.

<!-- trace:case id=g10adm.auction-post-sale.TC-25a rev=1 covers=g10adm.auction-post-sale.SC-ox0,g10adm.auction-post-sale.SC-du4 -->
### g10adm.auction-post-sale.US21-TC1: The quote previews the USD lines, then the HKD Subtotal, fee and total the winner is sent

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
* **Trace:** post-sale-US-21

**Pre-conditions:**

* admin opens Send invoice on `<order>`, HKD, Preparing Invoice by `<method>`, won at USD150.00 with a USD30.00 premium.

**Test data:**

| `<method>` | `<typed>` | `<fee>` | `<total>` |
| --- | --- | --- | --- |
| card, HKD rule | Shipping & Handling 49.00, Insurance 20.00, Tax 2.00 | HKD71.79, read-only, naming its card rule | HKD2,042.14 |
| FPS | Shipping & Handling 49.00, Insurance 20.00, Tax 2.00, fee 25.04 | HKD196.57, below the Subtotal | HKD2,166.92 |

**Steps:**

1. Type `<typed>`, and read the preview from the top down.
2. Send; as the winner, read Order Summary.

**Expected Results:**

* Step 1 lists the five lines in USD as typed, then one Subtotal HKD1,970.35, never counting a fee, the fee `<fee>`, and `<total>`; no line shows HKD, and no rate or note shows.
* Step 2 sends without a new-total refusal; Order Summary reads the same Subtotal, fee and `<total>`.

---

## Settled

- The quote preview and the order page write every amount in the operator shape, `USD 150.00` and `HKD 1,970.35`.
- The reissue dialog shows the same preview as Send invoice: the USD lines, then the HKD Subtotal, fee and total, the previous total beside the new one.
- The order page lists a sent HKD invoice's USD lines, then its HKD Subtotal, Payment Processing Fee and Total, with no HKD amount beside a line and no rate; the reissue history writes a changed line in USD and the fee and total in HKD.
- A reissue prices under the rule; the replaced invoice keeps the amounts it was sent with and stays readable on the order page. Removing Tax on a reissue is a change, like changing its amount.
- An HKD invoice sent before this layout keeps its stored amounts and reads in the new layout from them.
- An expired invoice is paid only in the admin. A card payment started before the deadline counts; one at or after it is refused. Paying does not lift a suspension.
- Each status names one primary action, and every other action that applies sits under More; an action the operator's grant does not cover stays visible, disabled, naming the grant.

## Reconciliation

- **Covered at domain** - `g10adm.auction-dmn.US3-TC1` walks a won lot invoiced, paid by bank transfer, shipped and delivered from the admin; `g10adm.auction-dmn.US4-TC2` walks an internal bidder's win invoiced, expired and cancelled with its stock back
