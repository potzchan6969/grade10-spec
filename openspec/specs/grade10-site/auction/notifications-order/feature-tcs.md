# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

**Out of suite:** Proof-not-accepted and bank-transfer reminder holds —
`add-winner-bank-transfer`. Receipt PDF on payment-received —
`add-winner-bank-transfer`. Setup letter bullets (address, method, billing) —
`add-winner-setup-overdue-mail` (`order-mail-SC-55`, `order-mail-SC-56`).

## order-mail-US1: Post-close letters

**As a** customer(winner),
**I want** the letters Grade10 sends about my auction order,
**so that** I know what to do next without guessing.

### order-mail-US1-TC1-1: Winning a lot sends auction-won

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot that just closed with this winner |

**Steps:**

1. Close <lot_1> with this winner.
2. Open the winner's inbox.

**Expected Results:**

* One auction-won letter names <lot_1> and the setup deadline.
* It names no amount owed.

### order-mail-US1-TC2-1: Invoice send is the first payment reminder

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) has confirmed setup.
* admin(operator) can send the invoice for <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An order in Preparing Invoice |
| <total> | 312000 minor units HKD |

**Steps:**

1. admin(operator) sends the invoice for <lot_1> with <total>.
2. Open the winner's inbox.

**Expected Results:**

* One payment-reminder letter names <total> and the payment deadline.
* No separate invoice-sent letter exists.

### order-mail-US1-TC3-1: Reissue sends payment reminder only

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) has a pending or expired invoice.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An order whose invoice an operator can reissue |

**Steps:**

1. admin(operator) reissues the invoice for <lot_1>.
2. Open the winner's inbox and the send log.

**Expected Results:**

* One payment-reminder letter for the new invoice.
* No invoice-reissued letter.

### order-mail-US1-TC4-1: Final notice is 24 hours before the payment deadline

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
* **Trace:** Reminder cadence

**Pre-conditions:**

* customer(winner of <lot_1>) has a pending unpaid invoice.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An order with a pending invoice and a known payment deadline |

**Steps:**

1. Wait until 24 hours before the payment deadline.
2. Open the winner's inbox.

**Expected Results:**

* One final-notice letter for <lot_1>.
* No letter waits until the deadline transition itself.

### order-mail-US1-TC5-1: Paying early cancels later reminders

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Reminder cadence

**Pre-conditions:**

* customer(winner of <lot_1>) pays on day 2 after the invoice was issued.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An order whose invoice was issued two days ago and is now paid |

**Steps:**

1. Wait until day 3 after invoice issue.
2. Open the winner's inbox for reminder kinds.

**Expected Results:**

* No day-3, day-6, or final-notice payment reminder for that invoice.

### order-mail-US1-TC6-1: A retried payment confirmation sends nothing twice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery discipline

**Pre-conditions:**

* The payment-received letter for <lot_1> has already been sent.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An order whose payment-received letter was sent |

**Steps:**

1. Deliver the payment confirmation webhook again.
2. Open the winner's inbox and the send log.

**Expected Results:**

* No second payment-received letter.

## Reconciliation

**Run:** Blind pass of durable `## Purpose` / `## Feature set` and
`user-journeys.md` (Walked by nobody). Denied: `## Requirements`.

**Uncovered anchors:**
- Setup reminder / setup overdue proof — **Out of suite:** `add-winner-setup-overdue-mail`
- Delivered / cancelled CTA detail — **Out of suite:** `email-trigger-revision`
- Proof-not-accepted — **Out of suite:** `add-winner-bank-transfer`

## Settled

- Delivered letter names the address and time recorded on the order at carrier confirmation
- One payment reminder per reissue; a repeated confirmation of the same reissue sends nothing twice
- Reissue parks superseded reminders and starts the day-3 / day-6 sequence for the new invoice — durable Reminder cadence; not restated as a new root here
- Mute applies to listing alert mail in `notifications`, not to winner order letters
- Contact Us uses the storefront's existing Contact Us destination
