# grade10-admin/auction/post-sale Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## post-sale-US1: Operator works the orders worklist by segment

**As an** auction operator,
**I want** every won lot's order in one worklist, split into segments with counts and searchable by any of its codes or the winner's email,
**so that** I open what needs me first without scanning orders that are waiting on the winner.

<!-- trace:case id=g10adm.auction-post-sale.TC-tb3 rev=1 covers=g10adm.auction-post-sale.SC-r6h,g10adm.auction-post-sale.SC-1yv,g10adm.auction-post-sale.SC-fxm,g10adm.auction-post-sale.SC-r3o,g10adm.auction-post-sale.SC-05a,g10adm.auction-post-sale.SC-71a,g10adm.auction-post-sale.SC-9oe,g10adm.auction-post-sale.SC-88b,g10adm.auction-post-sale.SC-cnh,g10adm.auction-post-sale.SC-8dq -->
### post-sale-US1-TC1-1: Segments sort won lots' orders and show their counts

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

**Expected Results:**

* Orders opens on Needs action, which reads 4 and lists the Preparing Invoice, Payment Verifying, Payment Overdue and Preparing Shipment orders.
* Waiting on winner reads 2 and lists the Awaiting Setup and Pending Payment orders.
* In transit reads 1 and lists the Shipped order; Closed reads 2 and lists the Delivered and Refunded orders.
* All reads 9, and the lot 30 minutes from its close is on no segment.
* Each order's status reads as its winner reads it on their own order.

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
* **Trace:** Queue

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

---

## post-sale-US3: Operator collects payment

**As a** payment operator,
**I want** every payment that reaches an order recorded, and one the invoice did not expect flagged for me,
**so that** no money a winner sends is dropped, and I know what to check or have finance return.

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

---

## post-sale-US4: Operator records in-house shipment

**As a** shipment operator,
**I want** to record dispatch with the carrier and the tracking number, then delivery with the carrier's proof, on the order,
**so that** the winner can follow the lot, and only someone allowed to ship records a shipment.

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

---

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance when the card needs it, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

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
* **Trace:** Quote and send

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

---

## post-sale-US6: Operator sees which lots are still in extended bidding

**As an** auction operator,
**I want** the Listings table to mark a lot still taking bids past its scheduled close,
**so that** I can tell a lot running long from one that closed on time.

<!-- trace:case id=g10adm.auction-post-sale.TC-vsq rev=1 covers=g10adm.auction-post-sale.SC-hvd,g10adm.auction-post-sale.SC-jck,g10adm.auction-post-sale.SC-bps -->
### post-sale-US6-TC1-1: The Listings table marks only the lot in extended bidding

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
* **Trace:** Resolving an unpaid order

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

**Pre-conditions:**

* admin(operator with payment processing) opens `<order>`.

**Steps:**

1. Do what the row says.
2. Read the invoice status and the timeline.

**Expected Results:**

* Grade10 answers as the row states.
* The timeline holds no payment recorded entry.

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
* **Trace:** Grants

**Pre-conditions:**

* A Payment Overdue order whose invoice is bank transfer.
* A Shipped order whose winner's payment proof an operator confirmed.

**Steps:**

1. As admin(operator whose roles are exactly `staff`), open the Payment Overdue order and read the header and More.
2. As admin(operator whose roles are exactly `finance`), open the Shipped order, open the winner's proof file, and read Confirm delivery.
3. Send each refused action straight to the server: the staff operator's reissue, and the finance operator's delivery with a proof-of-delivery file.
4. As the finance operator, cancel the Payment Overdue order with a category and a note.

**Expected Results:**

* For staff, Reissue stays in the header disabled, and Record payment and Cancel are listed under More disabled, each naming payment processing.
* For finance, the proof file opens, and Confirm delivery stays disabled, naming shipment processing.
* The server refuses both actions and stores no file.
* The cancel succeeds: the order reads Cancelled, and the timeline names the finance operator.

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

---

## post-sale-US8: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** every invoice and fulfilment log entry on the order, including the
payments that failed,
**so that** I can tell a buyer who tried and could not from one who never engaged.

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

---

## post-sale-US16: Operator records a refund a winner asked Customer Service for

**As an** operator with refund processing,
**I want** to record the refund I sent in Stripe or by bank transfer on the order, with its amount, reason, reference and proof, and say whether the lot goes back to stock,
**so that** a closing refund reads Refunded, an overpayment keeps the order's status, and the lot's stock matches where the card is.

<!-- trace:case id=g10adm.auction-post-sale.TC-c92 rev=1 covers=g10adm.auction-post-sale.SC-7fc,g10adm.auction-post-sale.SC-dzs -->
### post-sale-US16-TC1-1: A bank refund names where it went, is restated, and closes the order

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

## Reconciliation

**Run:** 2026-09-29. One agent wrote the cases and the scenarios, so the two readings are not independent. The cases were drafted from the Purpose, the Feature set, the journeys, the proposal, the decisions and the linked pages, then joined to the scenarios on their anchors.

| Spec scenario | Suite coverage |
| --- | --- |
| `grade10-admin-auction-post-sale-SC-19`, `SC-20`, `SC-21`, `SC-44`, `SC-116`, `SC-159` | US1-TC1-1 |
| `grade10-admin-auction-post-sale-SC-131`, `SC-160` | US1-TC6-1 |
| `grade10-admin-auction-post-sale-SC-180`, `SC-181`, `SC-182` | US1-TC7-1 |
| `grade10-admin-auction-post-sale-SC-162`, `SC-184`, `SC-185`, `SC-198` | US2-TC5-1 |
| `grade10-admin-auction-post-sale-SC-163` | US2-TC6-1 |
| `grade10-admin-auction-post-sale-SC-164`, `SC-165` | US2-TC7-1 |
| `grade10-admin-auction-post-sale-SC-37`, `SC-43` | US2-TC8-1 |
| `grade10-admin-auction-post-sale-SC-161`, `SC-178`, `SC-179`, `SC-195`, `SC-196` | US3-TC3-1 |
| `grade10-admin-auction-post-sale-SC-201`, `SC-202` | US3-TC4-1 |
| `grade10-admin-auction-post-sale-SC-173`, `SC-174` | US4-TC1-1 |
| `grade10-admin-auction-post-sale-SC-175`, `SC-176` | US4-TC2-1 |
| `grade10-admin-auction-post-sale-SC-168`, `SC-169` | US5-TC13-1 |
| `grade10-admin-auction-post-sale-SC-167` | US5-TC14-1 |
| `grade10-admin-auction-post-sale-SC-170` | US5-TC15-1 |
| `grade10-admin-auction-post-sale-SC-193`, `SC-194` | US5-TC16-1 |
| `grade10-admin-auction-post-sale-SC-135`, `SC-139` | US5-TC17-1 |
| `grade10-admin-auction-post-sale-SC-197` | US6-TC1-1 |
| `grade10-admin-auction-post-sale-SC-171`, `SC-172` | US7-TC32-1 |
| `grade10-admin-auction-post-sale-SC-55`, `SC-189` | US7-TC33-1 |
| `grade10-admin-auction-post-sale-SC-56`, `SC-57`, `SC-62`, `SC-120`, `SC-121`, `SC-130`, `SC-190` | US7-TC34-1 |
| `grade10-admin-auction-post-sale-SC-45`, `SC-46`, `SC-188` | US7-TC35-1 |
| `grade10-admin-auction-post-sale-SC-39`, `SC-40`, `SC-186`, `SC-187` | US7-TC36-1 |
| `grade10-admin-auction-post-sale-SC-199` | US7-TC37-1 |
| `grade10-admin-auction-post-sale-SC-166` | US8-TC9-1 |
| `grade10-admin-auction-post-sale-SC-192` | US16-TC1-1 |
| `grade10-admin-auction-post-sale-SC-191` | US16-TC3-1 |
| `grade10-admin-auction-post-sale-SC-200` | US16-TC4-1 |
| Restated with the requirement they sit in, reached through their anchors and the durable cases: `SC-23`, `SC-24`, `SC-25`, `SC-34`, `SC-35`, `SC-36`, `SC-38`, `SC-41`, `SC-42`, `SC-47`, `SC-54`, `SC-58`, `SC-59`, `SC-60`, `SC-61`, `SC-67`, `SC-122`, `SC-123`, `SC-124`, `SC-127`, `SC-132`, `SC-136`, `SC-137`, `SC-138`, `SC-145`, `SC-146` | the cases tracing their journey or group |
| Uncovered scenarios | none |
| Contradicted readings | none |

- **Re-worded** - post-sale-US1-TC1-1 reads the worklist's segments, post-sale-US6-TC1-1 the Listings table, and post-sale-US16-TC1-1 the refund's destination and restatement.
- **Deprecated** - post-sale-US6-TC2-1: the worklist lists won lots only, so a lot still taking bids has no row to filter.
- **Proven by another change** - the 90% close choice and the overpayment confirmation in Record payment are proven by `add-winner-partial-payment`'s cases post-sale-US12-TC3-1 and post-sale-US12-TC4-1.
- **Raised** - where a flagged order sits, where a reissue's fee starts, what replaces the 72-hour mark, and what Grade10 keeps of a refund's bank account landed as decisions Q16, Q14, Q26 and Q29.
