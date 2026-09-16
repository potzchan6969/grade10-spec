# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to confirm an address, pay a pending invoice by card, see progress, and open the invoice PDF,
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

## winner-order-US2: Winner follows fulfilment

**As a** winner who has paid,
**I want** progress to advance through Shipped to Completed,
**so that** Processing is not a fifth status word on the stepper.

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

## Raised

- Does Refunded keep the invoice PDF? Product decision: yes while refunded after send; Cancelled hides. Suites cover Cancelled hide; Refunded keep left as design confirmation in ui-design.

## Settled

- Expired ends self-service card pay (author @tangconst, 2026-09-15).
- Progress is presentation only; eight status names stay.
- Absolute deadline datetime; no countdown.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Suite required expired refuse card + Contact Us | Folded as `winner-order-SC-37` |
| Suite required five-step mapping including Processing→Shipped | Folded as `winner-order-SC-54`–`SC-56` |
| Suite required invoice PDF after send / hidden before and Cancelled | Folded as `winner-order-SC-44`, `SC-45`, `SC-49` |
| Refunded PDF keep | Left to ui-design / Storybook; no opposing scenario |
