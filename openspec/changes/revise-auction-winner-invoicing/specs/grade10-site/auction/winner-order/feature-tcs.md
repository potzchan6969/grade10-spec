# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to confirm an address within 48 hours, pay a pending invoice by card, see progress dates, and open the invoice PDF,
**so that** I can settle inside the deadline without guessing the next step.

### winner-order-US1-TC1-1: Pending invoice shows Pay and absolute deadline

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Winner is signed in on Winner Order for a lot whose invoice status is `pending`.

**Steps:**

1. Open Winner Order.
2. Read the payment area and the deadline.

**Expected Results:**

* Card Pay is offered.
* The deadline is an absolute datetime in the winner's zone.
* No countdown is shown.
* Progress current step is Payment.

### winner-order-US1-TC2-1: Sent invoice offers PDF view and download

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Invoice status is `pending` (sent).

**Steps:**

1. Open Winner Order.
2. Activate View invoice PDF / download.

**Expected Results:**

* The invoice PDF opens or downloads.

### winner-order-US1-TC3-1: Before send there is no PDF and no Pay

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Order is Awaiting Address or Preparing Invoice (`not_issued`).

**Steps:**

1. Open Winner Order.

**Expected Results:**

* No invoice PDF control.
* No card Pay control.
* Progress current step is Address or Invoice accordingly.

### winner-order-US1-TC4-1: Address confirm shows 48-hour deadline under Confirm

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Order is Awaiting Address inside the 48-hour confirm window.

**Steps:**

1. Open Winner Order.
2. Read Confirm delivery address and the deadline under it.
3. Read Address progress subtext.

**Expected Results:**

* Confirm delivery address is offered.
* The deadline under Confirm is an absolute datetime 48 hours after lot close.
* Address progress subtext reads Confirm by with the day-only date.
* No invoice PDF or receipt PDF.

### winner-order-US1-TC5-1: Fee lines show brief info tooltips

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Invoice status is `pending` with Buyer’s Premium, Shipping & Handling, and Payment Processing Fee.

**Steps:**

1. Open Winner Order.
2. Open each fee line’s info tooltip.

**Expected Results:**

* Each of the three lines has an info tooltip.
* The Payment Processing Fee tooltip is brief and does not restate the gross-up formula.

## winner-order-US5: Winner misses the payment deadline

**As a** winner whose invoice is expired,
**I want** Contact Us without card Pay,
**so that** I know self-service payment has stopped and how to reach Grade10.

### winner-order-US5-TC1-1: Expired hides Pay and shows Contact Us

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-05

**Pre-conditions:**

* Invoice status is `expired`; order derives Pending Payment.

**Steps:**

1. Open Winner Order.
2. Inspect payment controls and the overdue alert.
3. Attempt a card charge against the expired invoice (API or UI).

**Expected Results:**

* No card Pay control is shown.
* The overdue alert carries Contact Us.
* The card charge is refused.
* Progress still shows Payment as current.

### winner-order-US5-TC2-1: Cancelled hides stepper and PDF

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
* **Trace:** winner-order-US-05

**Pre-conditions:**

* Invoice status is `cancelled`.

**Steps:**

1. Open Winner Order.

**Expected Results:**

* No progress stepper.
* No invoice PDF control.

## winner-order-US7: Winner misses the address deadline

**As a** winner who missed the 48-hour address window,
**I want** Contact Us without Confirm,
**so that** I know self-service address confirmation has stopped.

### winner-order-US7-TC1-1: Missed address deadline hides Confirm and shows Contact Us

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-07

**Pre-conditions:**

* Order is Awaiting Address; address confirm window has passed.

**Steps:**

1. Open Winner Order.
2. Inspect address controls and the overdue alert.

**Expected Results:**

* No Confirm delivery address control.
* Overdue alert reads Missed address deadline with the day-only date and Contact Us.
* Derived status remains Awaiting Address; invoice status remains `not_issued`.
* Progress still shows Address as current.

## winner-order-US2: Winner follows fulfilment

**As a** winner who has paid,
**I want** progress to advance through Shipped to Completed and a receipt PDF beside Invoice,
**so that** Processing is not a fifth status word on the stepper and I can keep the payment record.

### winner-order-US2-TC1-1: Processing highlights Shipped on the stepper

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
* **Trace:** winner-order-US-02

**Pre-conditions:**

* Derived order status is Processing.

**Steps:**

1. Open Winner Order.
2. Read the progress stepper.

**Expected Results:**

* Current step label is Shipped.
* No step is labelled Processing.

### winner-order-US2-TC2-1: Paid order offers Invoice and Receipt PDFs

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* Invoice status is `paid` (Processing or later).

**Steps:**

1. Open Winner Order.
2. Activate Invoice PDF and Receipt PDF.

**Expected Results:**

* Both controls sit on one row with PDF icons and Invoice / Receipt labels.
* Each opens or downloads its document.

## Raised

- Does the compact Winner Order summary show a Subtotal row? Decided for this change: summary may omit Subtotal; invoice and receipt itemisation keep it.

## Settled

- Expired ends self-service card pay (author @tangconst, 2026-09-15).
- Progress is presentation only; eight status names stay.
- Absolute deadline datetime; no countdown.
- 48-hour address confirm window; missed window hides Confirm and shows Contact Us (Storybook 2026-09-16).
- Insurance remains optional and separate from Payment Processing Fee.
- Receipt PDF after payment on the same row as Invoice.
- Fee tooltips on Buyer’s Premium, Shipping & Handling, and Payment Processing Fee (brief fee copy).

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Suite required expired refuse card + Contact Us | Folded as `winner-order-SC-37` |
| Suite required five-step mapping including Processing→Shipped | Folded as `winner-order-SC-54`–`SC-56` |
| Suite required invoice PDF after send / hidden before and Cancelled | Folded as `winner-order-SC-57`, `SC-64`, `SC-65` |
| Suite required 48h address window + missed Confirm hide | Folded as `winner-order-SC-70`, `SC-71`; SC-32 narrowed to invoice never `expired` |
| Suite required day-only progress dates | Folded as `winner-order-SC-66` |
| Suite required receipt PDF after payment | Folded as `winner-order-SC-67`, `SC-68` |
| Suite required fee tooltips | Folded as `winner-order-SC-69` |
| Refunded PDF keep | Left to ui-design / Storybook; no opposing scenario |
