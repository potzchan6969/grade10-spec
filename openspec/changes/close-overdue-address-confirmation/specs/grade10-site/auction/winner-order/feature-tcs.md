# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## winner-order-US7: Winner misses the address window

**As a** winner who did not confirm a delivery address inside the 48 hours,
**I want** the order to say the entrance has closed and how to reach Grade10,
**so that** I know the lot is still mine to settle and what to do to get the form back.

### winner-order-US7-TC1-1: Address confirmed a minute inside the window is accepted

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
* **Trace:** Delivery address

**Pre-conditions:**

* `<lot_1>` closed at its recorded close and no delivery address is confirmed on its order.
* customer(winner of `<lot_1>`) is on <the winner's auction order url> at `<one minute before close>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` recorded close | 2026-09-03T12:00:00Z |
| Entrance closes | 2026-09-05T12:00:00Z |
| `<one minute before close>` | 2026-09-05T11:59:00Z |

**Steps:**

1. Choose the account's saved home address.
2. Confirm the delivery address.

**Expected Results:**

* The confirmation is accepted.
* The order reads Preparing Invoice.
* No invoice is issued by the confirmation itself.

### winner-order-US7-TC2-1: First confirmation is refused at the 48-hour mark

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-07

**Pre-conditions:**

* `<lot_1>` closed at its recorded close and no delivery address is confirmed on its order.
* customer(winner of `<lot_1>`) is on <the winner's auction order url> at `<the entrance close>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` recorded close | 2026-09-03T12:00:00Z |
| `<the entrance close>` | 2026-09-05T12:00:00Z |

**Steps:**

1. Attempt to confirm the account's saved home address.
2. Read the order's delivery address.

**Expected Results:**

* The confirmation is refused.
* The order holds no confirmed delivery address.
* The order still reads Awaiting Address.

### winner-order-US7-TC3-1: Closed entrance refuses a change to a confirmed address

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* `<lot_1>`'s order carries a delivery address confirmed inside the 48 hours, and no invoice has been sent.
* The entrance closed two hours ago.
* customer(winner of `<lot_1>`) is on <the winner's auction order url>.

**Steps:**

1. Attempt to change the confirmed delivery address to the account's work address.
2. Read the order's delivery address.

**Expected Results:**

* The change is refused.
* The order still shows the address confirmed inside the window.
* The order still reads Preparing Invoice.

### winner-order-US7-TC4-1: Closed entrance shows Contact Us in place of the form

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* `<lot_1>`'s order has no confirmed delivery address and its entrance closed two hours ago.
* customer(winner of `<lot_1>`) is on <the winner's auction order url>.

**Steps:**

1. Read the delivery address area.

**Expected Results:**

* No address form and no confirm control are offered.
* The alert says the entrance has closed and carries Contact Us.
* The datetime the entrance closed is shown.

### winner-order-US7-TC5-1: Closed entrance leaves the lot the winner's and bidding open

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* `<lot_1>`'s order has no confirmed delivery address and its entrance closed two hours ago.
* customer(winner of `<lot_1>`) is signed in, unsuspended, and another lot `<lot_2>` is open for bids.

**Steps:**

1. Navigate to <the winner's auction order url>.
2. Place a bid on `<lot_2>`.

**Expected Results:**

* The order still reads Awaiting Address and stays the winner's to settle.
* The bid on `<lot_2>` is accepted.
* No amount is shown as owed and no suspension notice appears.

### winner-order-US7-TC6-1: Open entrance shows its closing datetime without a countdown

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
* **Trace:** Delivery address

**Pre-conditions:**

* `<lot_1>`'s order has no confirmed delivery address and its entrance is open.
* customer(winner of `<lot_1>`) has a browser timezone of Asia/Hong_Kong and is on <the winner's auction order url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` recorded close | 2026-09-03T12:00:00Z |
| Entrance closes | 2026-09-05T12:00:00Z |
| Shown to the winner | 2026-09-05 20:00 Asia/Hong_Kong |

**Steps:**

1. Read the delivery address area.

**Expected Results:**

* The entrance close reads 2026-09-05 20:00 in Asia/Hong_Kong.
* It is an absolute datetime, not a countdown.

### winner-order-US7-TC7-1: Reopened entrance runs a fresh 48 hours from the reopen

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* `<lot_1>`'s order has no confirmed delivery address and its entrance closed on 2026-09-05T12:00:00Z.
* An operator reopened the entrance at `<the reopen>`.
* customer(winner of `<lot_1>`) is on <the winner's auction order url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<the reopen>` | 2026-09-07T09:00:00Z |
| New entrance close | 2026-09-09T09:00:00Z |

**Steps:**

1. Read the delivery address area.
2. Confirm the account's saved home address.

**Expected Results:**

* The entrance close reads 2026-09-09T09:00:00Z, measured from the reopen.
* The confirmation is accepted.
* The order reads Preparing Invoice.

### winner-order-US7-TC8-1: Winner has no way to reopen the entrance

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
* **Trace:** winner-order-US-07

**Pre-conditions:**

* `<lot_1>`'s order has no confirmed delivery address and its entrance closed two hours ago.
* customer(winner of `<lot_1>`) is signed in.

**Steps:**

1. Read the delivery address area for a reopen or extend control.
2. Submit a reopen of the address entrance as the winner.

**Expected Results:**

* No reopen or extend control is offered to the winner.
* The reopen is refused.
* The entrance close is unchanged.

### winner-order-US7-TC9-1: A closed lot opens an order with nothing yet to pay

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
* **Trace:** Order at lot close

**Pre-conditions:**

* `<lot_1>` is open with one second until its recorded close, and its leading bidder holds a bid-time authorization.

**Steps:**

1. Wait for `<lot_1>` to close.
2. Navigate to <the winner's auction order url>.

**Expected Results:**

* One order exists for `<lot_1>`, asking for a delivery address.
* No invoice, no amount due, and no Pay control are shown.
* The bid-time authorization is released rather than captured.

### winner-order-US7-TC10-1: Three won lots open three orders with their own entrances

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
* **Trace:** Order at lot close

**Pre-conditions:**

* customer(winner of `<lot_1>`, `<lot_3>` and `<lot_4>`) won three lots that closed at different datetimes.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` recorded close | 2026-09-03T12:00:00Z |
| `<lot_3>` recorded close | 2026-09-03T18:30:00Z |
| `<lot_4>` recorded close | 2026-09-04T09:15:00Z |

**Steps:**

1. Open each of the three auction orders.
2. Read each order's entrance close.
3. Confirm a different delivery address on each order.

**Expected Results:**

* Three separate orders exist, one per lot.
* The three entrance closes read 2026-09-05T12:00:00Z, 2026-09-05T18:30:00Z and 2026-09-06T09:15:00Z.
* Each order keeps the address confirmed on it and awaits its own invoice.

### winner-order-US7-TC11-1: Sent invoice stops the winner changing the address

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
* **Trace:** Delivery address

**Pre-conditions:**

* `<sent-invoice order>` carries a confirmed delivery address and an invoice sent at 2026-09-05T09:00:00Z, inside the address window.
* customer(winner of `<sent-invoice order>`) is on <the winner's auction order url>.

**Steps:**

1. Attempt to change the delivery address to the account's work address.
2. Read the delivery address area.

**Expected Results:**

* The change is refused even though the 48 hours have not elapsed.
* The order still shows the address the invoice was quoted for.
* The area points the winner at Grade10 for a change.

### winner-order-US7-TC12-1: Payment deadline runs seven days from send, not from close

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
* **Trace:** Payment deadline

**Pre-conditions:**

* `<sent-invoice order>`'s lot closed at 2026-09-03T12:00:00Z and its address was confirmed on 2026-09-04T08:00:00Z.
* Its invoice was sent at `<the send>`.

**Test data:**

| Field | Value |
| --- | --- |
| Lot close | 2026-09-03T12:00:00Z |
| `<the send>` | 2026-09-05T09:00:00Z |
| Payment deadline | 2026-09-12T09:00:00Z |

**Steps:**

1. Read the invoice's payment deadline.

**Expected Results:**

* The payment deadline is 2026-09-12T09:00:00Z.
* It is seven days from the send, not from the lot close.
* It is shown as an absolute datetime in the winner's zone.

### winner-order-US7-TC13-1: Expired invoice does not reopen the address entrance

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Settlement

**Pre-conditions:**

* `<expired-invoice order>`'s invoice is `expired` and its address was locked at send.
* customer(winner of `<expired-invoice order>`) is on <the winner's auction order url>.

**Steps:**

1. Read the delivery address area.
2. Attempt to change the delivery address to the account's work address.

**Expected Results:**

* No address form is offered.
* The change is refused.
* The overdue alert carries Contact Us and no card Pay control is shown.

## Raised

- **A confirmation sent before the mark and arriving after it.** The window is stated as a datetime, and nothing says which clock decides a confirmation submitted at 47:59 that reaches Grade10 at 48:01. TC2 asserts the refusal at the mark and says nothing about the race.
- **What the entrance close is measured from when a lot is extended.** The 48 hours run from lot close; a lot whose close moved by extended bidding has two closes, and the input names neither as the one that starts the window.
- **Whether a reopen after send does anything.** The address is locked at send and a later change goes through an operator re-quote, so TC11 reads the lock as absolute. Nothing says whether a reopen is refused, ignored, or unlocks the locked address.
- **What a closed entrance does to the reminder letters.** Reminders are said to end when the order is no longer self-service payable; an order stalled in Awaiting Address was never payable, and nothing says whether it is chased, and for how long.
- **Whether a winner may add a new address to the account while the entrance is closed.** The refusal is stated on the order's confirmation, not on the account address book, and the two are different writes.
- **Traces on this delta.** The change's `user-journeys.md` for this capability carries only `winner-order-US-07`, so the cases covering behaviour this change moves — nothing to pay at close, the lock at send, seven days from send — trace `## Feature set` root groups rather than the journeys that walk them, which live in the durable file.

