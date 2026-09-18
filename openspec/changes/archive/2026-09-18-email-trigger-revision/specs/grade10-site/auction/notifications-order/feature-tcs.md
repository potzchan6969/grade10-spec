# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-17, tcs-rules r3.0

## order-mail-US1: Post-close letters

**As a** customer(winner),
**I want** post-close letters that name what happened to my order,
**so that** I can pay, check delivery or follow up without guessing.

### order-mail-US1-TC13-1: Reissue sends the payment reminder for the new invoice

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

* customer(winner of <lot_1>) has a registered email and a pending invoice on <lot_1>.
* admin(operator) can reissue the invoice for <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A closed lot with a winner and a pending invoice |
| <new total> | The reissued invoice total |
| <pay by> | The reissued invoice payment deadline as a date and time |

**Steps:**

1. admin(operator) reissues the invoice for <lot_1> with <new total> and <pay by>.
2. Open the winner's inbox for <lot_1>.

**Expected Results:**

* One payment reminder names <lot_1>, <new total> and `Pay by` <pay by>.
* The letter offers View invoice and pay.

### order-mail-US1-TC14-1: Reissue sends no separate reissued letter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) has a registered email and a pending invoice on <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A closed lot with a winner and a pending invoice |

**Steps:**

1. admin(operator) reissues the invoice for <lot_1>.
2. Open the winner's inbox and the send log for <lot_1>.

**Expected Results:**

* The send log holds a payment reminder for the reissue and no invoice-reissued letter.
* The inbox shows no letter that only says the invoice was reissued or replaced.

### order-mail-US1-TC15-1: Delivered letter names address, time and action order

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
* The carrier has confirmed delivery of <lot_1> to <delivery address> at <delivered time>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A paid order whose carrier has confirmed delivery |
| <delivery address> | The order's delivery address |
| <delivered time> | The carrier's delivered date and time |

**Steps:**

1. Open the delivered letter for <lot_1>.
2. Read its actions from top to bottom.

**Expected Results:**

* The letter names <lot_1>, <delivery address> and <delivered time>.
* View order is first and Contact Us is second.

### order-mail-US1-TC16-1: Delivered View order opens the lot's order

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in and has the delivered letter for <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A paid order with a delivered letter |

**Steps:**

1. Click View order on the delivered letter.
2. Click the lot image or title on the letter.

**Expected Results:**

* Step 1 opens <grade10 winner order url> for <lot_1>.
* Step 2 opens the same order.

### order-mail-US1-TC17-1: Cancelled letter names when and omits reason and payment

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
* admin(operator) cancels the order for <lot_1> at <cancelled at> with an internal reason.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An order an operator can cancel |
| <cancelled at> | The cancellation date and time |
| <internal reason> | A note for operators only |

**Steps:**

1. admin(operator) cancels the order for <lot_1> with <internal reason>.
2. Open the order-cancelled letter for <lot_1>.
3. Read its actions from top to bottom.

**Expected Results:**

* The letter names <lot_1> and that the order was cancelled at <cancelled at>.
* The letter shows neither <internal reason> nor any payment, refund or amount wording.
* Contact Us is first and View order is second.

### order-mail-US1-TC18-1: Cancelled View order opens the lot's order

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in and has the order-cancelled letter for <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | An order cancelled by an operator |

**Steps:**

1. Click View order on the order-cancelled letter.

**Expected Results:**

* The browser opens <grade10 winner order url> for <lot_1>.

### order-mail-US1-TC19-1: Signed-out order link asks for sign-in first

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of <lot_1>) is signed out.
* The winner has the delivered letter for <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A paid order with a delivered letter |

**Steps:**

1. Click View order on the delivered letter.
2. Sign in as the winner.

**Expected Results:**

* Step 1 opens sign-in before the order.
* Step 2 opens <grade10 winner order url> for <lot_1>.

## Settled

- Delivered letter names the address and time recorded on the order at carrier confirmation
- One payment reminder per reissue; a repeated confirmation of the same reissue sends nothing twice
- Reissue parks superseded reminders and starts the day-3 / day-6 sequence for the new invoice — durable Reminder cadence; not restated as a new root here
- Mute applies to listing alert mail in `notifications`, not to winner order letters
- Contact Us uses the storefront's existing Contact Us destination

## Reconciliation

**Run:** Blind pass read the change outline (`## Feature set` only), change and durable `user-journeys.md` (Walked by nobody), `proposal.md`, `decisions.md`, and PRD Winner Order Notification excerpt. Denied: every `## Requirements` section, durable and archived requirement bodies, and `openspec/changes/archive/`. No prior durable `feature-tcs.md` for id continuity.

**Raised, folded:**
- Replayed reissue confirmation — folded as `order-mail-SC-43`
- Delivered letter facts come from the order at carrier confirmation — folded into `Delivered and cancelled letters name their facts and actions` (with `order-mail-SC-41`)

**Raised, rejected:**
- Mute / unsubscribe on winner order letters — listing-alert mute only; see `## Settled`
- Contact Us needs a new URL invented here — uses the storefront Contact Us destination; see `## Settled`
- Reminder-series restart as missing from this outline — already durable Reminder cadence / Post-close; see `## Settled`

**Uncovered anchors:**
- `order-mail-SC-40`, `order-mail-SC-41`, `order-mail-SC-42`, `order-mail-SC-43` — walked by `order-mail-US1-TC13-1`…`TC15-1`, `TC17-1`; `order-mail-US1-TC14-1` walks the no-separate-letter half of SC-40
- `order-mail-US1-TC16-1`, `order-mail-US1-TC18-1`, `order-mail-US1-TC19-1` (View order / signed-out) — **Out of suite:** durable Post-close primary-action and sign-in SHALL; no extra scenarios in this change
