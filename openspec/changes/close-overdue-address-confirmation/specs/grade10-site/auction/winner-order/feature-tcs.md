# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## winner-order-US8: Winner gets the address form back

**As a** winner who missed the 48-hour address deadline,
**I want** Grade10 to reopen the address form when I get in touch, and nothing about my saved addresses to be blocked meanwhile,
**so that** I can still settle the lot I won once I have told Grade10 where to ship it.

### winner-order-US8-TC1-1: Address confirmed a minute inside the window is accepted

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

### winner-order-US8-TC2-1: First confirmation is refused at the 48-hour mark

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* `<lot_1>` closed at its recorded close and no delivery address is confirmed on its order.
* customer(winner of `<lot_1>`) is on <the winner's auction order url> at `<the address deadline>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` recorded close | 2026-09-03T12:00:00Z |
| `<the address deadline>` | 2026-09-05T12:00:00Z |

**Steps:**

1. Attempt to confirm the account's saved home address.
2. Read the order's delivery address.

**Expected Results:**

* The confirmation is refused.
* The order holds no confirmed delivery address.
* The order still reads Awaiting Setup.

### winner-order-US8-TC3-1: A missed address deadline refuses a change to a confirmed address

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* `<lot_1>`'s order carries a delivery address confirmed inside the 48 hours, and no invoice has been sent.
* The address deadline passed two hours ago.
* customer(winner of `<lot_1>`) is on <the winner's auction order url>.

**Steps:**

1. Attempt to change the confirmed delivery address to the account's work address.
2. Read the order's delivery address.

**Expected Results:**

* The change is refused.
* The order still shows the address confirmed inside the window.
* The order still reads Preparing Invoice.

### winner-order-US8-TC4-1: A reopened address form runs a fresh 48 hours from the reopen

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* `<lot_1>`'s order has no confirmed delivery address and its address deadline passed on 2026-09-05T12:00:00Z.
* An operator reopened the address form at `<the reopen>`.
* customer(winner of `<lot_1>`) is on <the winner's auction order url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<the reopen>` | 2026-09-07T09:00:00Z |
| New address deadline | 2026-09-09T09:00:00Z |

**Steps:**

1. Read the delivery address area.
2. Confirm the account's saved home address.

**Expected Results:**

* The address deadline reads 2026-09-09T09:00:00Z, measured from the reopen.
* The confirmation is accepted.
* The order reads Preparing Invoice.

### winner-order-US8-TC5-1: Winner has no way to reopen the address form

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
* **Trace:** winner-order-US-08

**Pre-conditions:**

* `<lot_1>`'s order has no confirmed delivery address and its address deadline passed two hours ago.
* customer(winner of `<lot_1>`) is signed in.

**Steps:**

1. Read the delivery address area for a reopen or extend control.
2. Submit a reopen of the address form as the winner.

**Expected Results:**

* No reopen or extend control is offered to the winner.
* The reopen is refused.
* The address deadline is unchanged.

### winner-order-US8-TC6-1: Three won lots open three orders with their own address deadlines

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
2. Read each order's address deadline.
3. Confirm a different delivery address on each order.

**Expected Results:**

* Three separate orders exist, one per lot.
* The three address deadline passes read 2026-09-05T12:00:00Z, 2026-09-05T18:30:00Z and 2026-09-06T09:15:00Z.
* Each order keeps the address confirmed on it and awaits its own invoice.

### winner-order-US8-TC7-1: Sent invoice stops the winner changing the address

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

### winner-order-US8-TC8-1: Expired invoice does not reopen the address form

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

### winner-order-US8-TC9-1: A missed address deadline leaves the account address book alone

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
* **Trace:** Delivery address

**Pre-conditions:**

* `<missed-deadline order>`'s address deadline has passed with no address confirmed.
* customer(winner of `<missed-deadline order>`) is signed in.

**Steps:**

1. Open the account address book.
2. Edit the saved home address and save a new work address.
3. Return to <the winner's auction order url>.

**Expected Results:**

* Both address-book writes are accepted.
* Neither reaches the auction order.
* The order still has no confirmed delivery address and still offers no address form.

### winner-order-US8-TC10-1: A reopen sends the winner no letter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-08

**Pre-conditions:**

* `<missed-deadline order>`'s address deadline has passed.
* An operator holds payment-processing.

**Steps:**

1. The operator reopens the address form with a reason.
2. Read the winner's post-close letters for that lot.

**Expected Results:**

* The order offers the address form again.
* No letter about the reopen reaches the winner.

## Raised

- **A confirmation sent before the mark and arriving after it.** The window is stated as a datetime, and nothing says which clock decides a confirmation submitted at 47:59 that reaches Grade10 at 48:01. TC2 asserts the refusal at the mark and says nothing about the race.
- **What the address deadline is measured from when a lot is extended.** The 48 hours run from lot close; a lot whose close moved by extended bidding has two closes, and the input names neither as the one that starts the window.
- **Whether a reopen after send does anything.** The address is locked at send and a later change goes through an operator re-quote, so TC11 reads the lock as absolute. Nothing says whether a reopen is refused, ignored, or unlocks the locked address.
- **What a missed address deadline does to the reminder letters.** Reminders are said to end when the order is no longer self-service payable; an order stalled in Awaiting Setup was never payable, and nothing says whether it is chased, and for how long.
- **Whether a winner may add a new address to the account while the address form is closed.** The refusal is stated on the order's confirmation, not on the account address book, and the two are different writes.
- **Traces on this delta.** The change's `user-journeys.md` for this capability carries only `winner-order-US-08`, so the cases covering behaviour this change moves — nothing to pay at close, the lock at send, seven days from send — trace `## Feature set` root groups rather than the journeys that walk them, which live in the durable file.

## Reconciliation

Two independent readings of the same anchors: this suite, written without sight
of any requirement, and a scenario draft written without sight of this suite.
What they disagreed about is below.

| Raised | Disposition |
| --- | --- |
| Which clock decides a confirmation sent at 47:59 and arriving at 48:01 | **Folded in.** Nobody had decided it. The requirement now judges a write by the moment Grade10 receives it, and `winner-order-SC-80` and `winner-order-SC-72` are phrased on receipt rather than on submission |
| What the address deadline is measured from on an extended lot | **Folded in.** The scenario pass had already fixed it on the actual close; `winner-order-SC-79` proves it against a lot whose scheduled and actual closes differ |
| Whether a winner may add an address to the account book while the address form is closed | **Folded in** after a grilling round. The account address book is unaffected — `winner-order-SC-78` and `winner-order-US8-TC9-1` |
| Whether a reopen after send does anything | **Already decided**, in `grade10-admin/auction/post-sale`: a reopen is refused once the invoice is sent. The suite could not see it |
| Whether a reopen notifies the winner | **Folded in** once Product settled it: no letter, the operator tells the winner directly — `winner-order-SC-81` and `winner-order-US8-TC10-1` |
| What a missed address deadline does to the reminder letters | **Dropped.** Address reminders belong to `revise-auction-winner-invoicing`. Recorded here so the next blind pass does not raise it again |
| Traces on this delta pointing at feature set groups | **Kept.** The delta's journeys file holds only `winner-order-US-08`; the journeys those cases walk are durable and reach the suite at archive |
| Cases covering behaviour this change no longer carries | **Kept as written.** Every delta here became ADDED after `check:manual` refused a draft that folded requirements `revise-auction-winner-invoicing` also folds. Cases reading the lock at send, the seven days from send and the hold release stay in the suite; the requirements they walk are that change's |
| Cases the address deadline on `main` now covers | **Dropped** after `revise-auction-winner-invoicing` took on the 48-hour address deadline: Contact Us in place of the form, no suspension or cancellation, the displayed deadline, nothing to pay at close, and seven days from send. Its own suite walks them. The rest were renumbered under `winner-order-US8` |

An operator may record a delivery address after the address deadline without
reopening it. Neither reading proposed it; it came out of the same grilling
round and is proved in `grade10-admin/auction/post-sale`.
