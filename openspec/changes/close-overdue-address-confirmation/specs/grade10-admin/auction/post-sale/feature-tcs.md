# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## post-sale-US9: Operator reopens a closed address entrance

**As an** operator,
**I want** to give a winner whose address window has closed a fresh 48 hours, with my reason on the record,
**so that** a winner who got in touch can finish the order without me cancelling the lot.

### post-sale-US9-TC1-1: Reopen gives a fresh 48 hours from the moment it reopens

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
* **Trace:** post-sale-US-09

**Pre-conditions:**

* `<closed-window order>` derives as Awaiting Address, its lot closed at 2026-09-03T12:00:00Z and its entrance closed at 2026-09-05T12:00:00Z.
* admin(holds payment-processing) is on `<closed-window order>` at `<the reopen>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the reopen>` | 2026-09-07T09:00:00Z |
| `<reason>` | The operator's stated reason for the reopen |
| New entrance close | 2026-09-09T09:00:00Z |

**Steps:**

1. Reopen the address entrance on `<closed-window order>` with `<reason>`.
2. Read the entrance close.

**Expected Results:**

* The reopen is accepted.
* The entrance close is 2026-09-09T09:00:00Z, 48 hours from `<the reopen>`.
* It is not measured from the lot close.

### post-sale-US9-TC2-1: Reopen without a reason is refused

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
* **Trace:** post-sale-US-09

**Pre-conditions:**

* `<closed-window order>` derives as Awaiting Address and its entrance closed two days ago.
* admin(holds payment-processing) is on `<closed-window order>`.

**Steps:**

1. Open the reopen form.
2. Commit the reopen with the reason left empty.
3. Read the entrance close.

**Expected Results:**

* The reopen is refused.
* The entrance close is unchanged.
* The winner still cannot confirm an address.

### post-sale-US9-TC3-1: Reopen is refused without the payment-processing grant

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
* **Trace:** post-sale-US-09

**Pre-conditions:**

* `<closed-window order>` derives as Awaiting Address and its entrance closed two days ago.
* admin(holds fulfilment, not payment-processing) is on `<closed-window order>`.

**Steps:**

1. Look for the reopen control on `<closed-window order>`.
2. Submit a reopen with a reason.

**Expected Results:**

* No reopen control is offered.
* The reopen is refused.
* The entrance close is unchanged.

### post-sale-US9-TC4-1: Reopen changes no outcome and clears the Overdue mark

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
* **Trace:** post-sale-US-09

**Pre-conditions:**

* `<closed-window order>` derives as Awaiting Address, carries the Overdue mark, and its entrance closed two days ago.
* admin(holds payment-processing) is on `<closed-window order>`.

**Steps:**

1. Reopen the address entrance with a reason.
2. Read the order's outcome and its marks on the queue.

**Expected Results:**

* The outcome is still Awaiting Address.
* The Overdue mark is gone while the entrance is open again.
* The row's needs-action treatment is unchanged.

### post-sale-US9-TC5-1: A second reopen starts the 48 hours again

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
* **Trace:** post-sale-US-09

**Pre-conditions:**

* `<closed-window order>` was reopened once at 2026-09-07T09:00:00Z and its fresh entrance closed unused at 2026-09-09T09:00:00Z.
* admin(holds payment-processing) is on `<closed-window order>` at `<the second reopen>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the second reopen>` | 2026-09-10T15:00:00Z |
| Entrance close after it | 2026-09-12T15:00:00Z |

**Steps:**

1. Reopen the address entrance a second time with a reason.
2. Read the entrance close.

**Expected Results:**

* The second reopen is accepted.
* The entrance close is 2026-09-12T15:00:00Z.
* No cap on the number of reopens is applied.

### post-sale-US9-TC6-1: No reopen is offered once the invoice has been sent

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
* **Trace:** post-sale-US-09

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

### post-sale-US9-TC7-1: Reopen is logged with its reason and its new close

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
* It names the operator, `<reason>`, and the new entrance close.
* Earlier entries are unchanged beside it.

### post-sale-US9-TC8-1: The two pre-invoice outcomes filter apart

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

1. Filter the queue to Awaiting Address.
2. Filter the queue to Preparing Invoice.

**Expected Results:**

* Step 1 lists `<awaiting-address order>` and not `<preparing-invoice order>`.
* Step 2 lists `<preparing-invoice order>` and not `<awaiting-address order>`.
* Each row wears one outcome.

### post-sale-US9-TC9-1: Only the rows waiting on an operator need action

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
| `<awaiting-address order>` | Awaiting Address | no |
| `<preparing-invoice order>` | Preparing Invoice | yes |
| `<expired-invoice order>` | Pending Payment | yes |

**Steps:**

1. Read the row's outcome.
2. Read the row's needs-action treatment.

**Expected Results:**

* The outcome is the one the row names.
* The needs-action treatment matches the row.
* `<expired-invoice order>` shows its Expired invoice status beside Pending Payment.

### post-sale-US9-TC10-1: Overdue marks a stalled order in either pre-invoice state

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
* **Testability:** automation, manual
* **Trace:** Queue

**Pre-conditions:**

* The order's invoice has not been sent and its lot closed at 2026-09-03T12:00:00Z, so its entrance closed at 2026-09-05T12:00:00Z.
* admin(holds payment-processing) is on the post-sale queue at the read time the row names.

**Test data:**

| Order | Read at | Outcome | Overdue mark |
| --- | --- | --- | --- |
| `<awaiting-address order>` | 2026-09-05T11:59:00Z | Awaiting Address | absent |
| `<awaiting-address order>` | 2026-09-05T12:00:00Z | Awaiting Address | present |
| `<preparing-invoice order>` | 2026-09-05T12:00:00Z | Preparing Invoice | present |

**Steps:**

1. Read the order's row at the time the row names.

**Expected Results:**

* The Overdue mark is present or absent as the row states.
* The outcome is the one the row names, marked or not.
* The order is not expired or closed by the mark.

### post-sale-US9-TC11-1: Send locks the address and starts the seven days

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
* The delivery address is locked and the winner can no longer change it.

### post-sale-US9-TC12-1: Send is refused while no address is confirmed

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

* `<awaiting-address order>` has no confirmed delivery address and its entrance is open.
* admin(holds payment-processing) is on `<awaiting-address order>`.

**Steps:**

1. Enter Shipping & Handling of 24000 minor units in HKD.
2. Send the invoice.

**Expected Results:**

* The send is refused.
* No invoice is issued and no payment deadline starts.
* The order still derives Awaiting Address.

### post-sale-US9-TC13-1: A closed window does not stop an operator sending

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

* `<closed-window order>` carries an address confirmed inside the 48 hours, its entrance closed two hours ago, and it carries the Overdue mark.
* admin(holds payment-processing) is on `<closed-window order>`.

**Steps:**

1. Enter Shipping & Handling of 24000 minor units in HKD.
2. Send the invoice.

**Expected Results:**

* The send is accepted.
* The order derives Pending Payment with a seven-day deadline.
* The closed window gated the winner's write, not the operator's send.

### post-sale-US9-TC14-1: Cancelling before a send returns the lot to available

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

* `<closed-window order>` has no confirmed address, its entrance closed four days ago, and no invoice has been sent.
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

## Raised

- **Whether the Overdue mark clears on a reopen.** The mark is defined as a closed window and a reopen is said to change no status, but the input never says whether the mark is a live read of the entrance or a flag that a window once lapsed. TC4 asserts it clears.
- **Whether a reopen is offered after the invoice is sent.** The address locks at send and a later change is described as a re-quote and reissue, so TC6 reads the reopen as unavailable. Nothing states the refusal outright, and an operator who reopens instead of re-quoting is not accounted for.
- **Reopening a cancelled order.** Cancellation is now available before an invoice exists, and nothing says whether a cancelled order's entrance can be reopened to revive it, or whether the cancellation is terminal. No case was written for it.
- **Whether the reopen notifies the winner.** A fresh 48 hours is useless to a winner who does not know it started, and the input names no letter for the reopen among the post-close letters.
- **What the Overdue mark does after the invoice is sent.** The mark belongs to Awaiting Address and Preparing Invoice; nothing says whether an order that was marked keeps any trace of it once it reaches Pending Payment.
- **Whether a closed window blocks the operator's own address correction.** The refusal is stated for the winner. An operator correcting an address on a pre-invoice order is neither permitted nor refused by the input.
- **Traces on this delta.** The change's `user-journeys.md` for this capability carries only `post-sale-US-09`, so the queue, send and cancellation cases trace `## Feature set` root groups rather than the journeys that walk them, which live in the durable file.

