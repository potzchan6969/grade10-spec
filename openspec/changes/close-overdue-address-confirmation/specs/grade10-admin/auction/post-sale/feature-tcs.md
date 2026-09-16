# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## post-sale-US9: Operator reopens the address form

**As an** operator,
**I want** to give a winner who missed the 48-hour address deadline a fresh 48 hours, with my reason on the record,
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

* `<closed-window order>` derives as Awaiting Address, its lot closed at 2026-09-03T12:00:00Z and its address deadline passed at 2026-09-05T12:00:00Z.
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

* `<closed-window order>` derives as Awaiting Address and its address deadline passed two days ago.
* admin(holds payment-processing) is on `<closed-window order>`.

**Steps:**

1. Open the reopen form.
2. Commit the reopen with the reason left empty.
3. Read the address deadline.

**Expected Results:**

* The reopen is refused.
* The address deadline is unchanged.
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

* `<closed-window order>` derives as Awaiting Address and its address deadline passed two days ago.
* admin(holds fulfilment, not payment-processing) is on `<closed-window order>`.

**Steps:**

1. Look for the reopen control on `<closed-window order>`.
2. Submit a reopen with a reason.

**Expected Results:**

* No reopen control is offered.
* The reopen is refused.
* The address deadline is unchanged.

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

* `<closed-window order>` derives as Awaiting Address, carries the Overdue mark, and its address deadline passed two days ago.
* admin(holds payment-processing) is on `<closed-window order>`.

**Steps:**

1. Reopen the address form with a reason.
2. Read the order's outcome and its marks on the queue.

**Expected Results:**

* The outcome is still Awaiting Address.
* The Overdue mark is gone while the address form is open again.
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
* It names the operator, `<reason>`, and the new address deadline.
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

* The order's invoice has not been sent and its lot closed at 2026-09-03T12:00:00Z, so its address deadline passed at 2026-09-05T12:00:00Z.
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

* `<awaiting-address order>` has no confirmed delivery address and its address form is open.
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

* `<closed-window order>` carries an address confirmed inside the 48 hours, its address deadline passed two hours ago, and it carries the Overdue mark.
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

### post-sale-US9-TC15-1: A cancelled order refuses a reopen

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-09

**Pre-conditions:**

* `<cancelled order>` was cancelled before any invoice was sent and its lot returned to available stock.
* An operator holds payment-processing.

**Steps:**

1. Open `<cancelled order>`.
2. Attempt to reopen its address form with a reason.

**Expected Results:**

* The reopen is refused.
* The order still derives as Cancelled.
* The lot stays in available stock.

### post-sale-US9-TC16-1: An operator records the address without reopening

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
* **Trace:** post-sale-US-09

**Pre-conditions:**

* `<closed-address form order>` is in Awaiting Address with its address window closed.
* An operator holds payment-processing.

**Steps:**

1. Open `<closed-address form order>`.
2. Record the delivery address the winner gave by telephone.

**Expected Results:**

* The address is accepted and the order derives as Preparing Invoice.
* The address window is still closed.
* The winner is offered no address form.

### post-sale-US9-TC17-1: Manual settlement pays an expired invoice and ends what is owed

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

* The settlement is accepted; the order derives Processing.
* The Expired invoice status is gone; the invoice reads paid.
* Winner Order shows no amount owed and no card Pay.

### post-sale-US9-TC18-1: A card payment just before the deadline is accepted

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
* The order derives Processing and never showed Expired invoice.

### post-sale-US9-TC19-1: The winner cannot pay by card after the deadline

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

### post-sale-US9-TC20-1: Reissuing an expired invoice gives card payment a fresh seven days

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
* The card payment is accepted; the order derives Processing.

### post-sale-US9-TC21-1: Settling or reissuing an expired invoice needs payment-processing

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
* **Testability:** automation, manual
* **Trace:** Resolving an unpaid order

**Pre-conditions:**

* `<expired-invoice order>` is unpaid past its deadline 2026-09-12T09:00:00Z.
* admin(holds fulfilment, not payment-processing) is on `<expired-invoice order>`.

**Test data:**

| Action |
| --- |
| Record a manual settlement by bank transfer, with a reference and one proof file |
| Reissue the invoice |

**Steps:**

1. Look for the row's control on `<expired-invoice order>`.
2. Submit the row's action.

**Expected Results:**

* No control for the action is offered.
* The action is refused.
* The order still reads Pending Payment with Expired invoice, deadline unchanged.

### post-sale-US9-TC22-1: A card payment started in time completes after the deadline

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
* After confirmation the invoice is `paid` and the order is Processing.
* The invoice log holds no expired entry.

### post-sale-US9-TC23-1: A card payment started in time that fails expires the invoice when it fails

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

## Raised

- **Whether the Overdue mark clears on a reopen.** The mark is defined as a closed window and a reopen is said to change no status, but the input never says whether the mark is a live read of the address form or a flag that a window once lapsed. TC4 asserts it clears.
- **Whether a reopen is offered after the invoice is sent.** The address locks at send and a later change is described as a re-quote and reissue, so TC6 reads the reopen as unavailable. Nothing states the refusal outright, and an operator who reopens instead of re-quoting is not accounted for.
- **Reopening a cancelled order.** Cancellation is now available before an invoice exists, and nothing says whether a cancelled order's address form can be reopened to revive it, or whether the cancellation is terminal. No case was written for it.
- **Whether the reopen notifies the winner.** A fresh 48 hours is useless to a winner who does not know it started, and the input names no letter for the reopen among the post-close letters.
- **What the Overdue mark does after the invoice is sent.** The mark belongs to Awaiting Address and Preparing Invoice; nothing says whether an order that was marked keeps any trace of it once it reaches Pending Payment.
- **Whether a closed window blocks the operator's own address correction.** The refusal is stated for the winner. An operator correcting an address on a pre-invoice order is neither permitted nor refused by the input.
- **Traces on this delta.** The change's `user-journeys.md` for this capability carries only `post-sale-US-09`, so the queue, send and cancellation cases trace `## Feature set` root groups rather than the journeys that walk them, which live in the durable file.

- **Whether the deadline instant itself is expired.** The seven days start at send, but nothing says whether a card payment at exactly send plus seven days is payable or refused. TC18 and TC19 test one minute either side and leave the instant alone.
- **A card payment in flight across the deadline.** A winner who submits before the deadline and whose payment confirms after it is neither honoured nor refused by the input. TC19 covers only a submit after the deadline.
- **What a reissue of an expired invoice prices.** The Payment Processing Fee is priced at send from live fees and the premium minimum applies to invoices "sent or reissued" after a change, so a reissue may re-price the Order Total. Nothing says whether it does, or whether a reason is required as it is for a re-quote. TC20 asserts only the fresh deadline.
- **Bidding after a manual settlement of an expired invoice.** Winner Order says paying after an operator restores a payable invoice does not restore bidding by itself, but says nothing about a manual settlement of the expired invoice. TC17 asserts nothing about suspension.
- **Whether the winner is told of a reissue.** A fresh seven days only helps a winner who knows it started; the input names no letter for a reissue, and reminders are said to end when the order stops being self-service payable.

## Reconciliation

Two independent readings of the same anchors: this suite, written without sight
of any requirement, and a scenario draft written without sight of this suite.

| Raised | Disposition |
| --- | --- |
| Whether a cancelled order's address form can be reopened | **Folded in** after a grilling round. It cannot: cancellation has already returned the lot to stock — `grade10-admin-auction-post-sale-SC-83` and `post-sale-US9-TC15-1`. The suite deliberately wrote no case rather than invent a refusal, which is why the question survived to be asked |
| Whether an operator may record the address without reopening | **Folded in** from the same round — `grade10-admin-auction-post-sale-SC-84` and `post-sale-US9-TC16-1` |
| Whether the Overdue mark clears on a reopen | **Agreed** by both readings, then **handed on.** `check:manual` refuses two in-flight changes folding one requirement, and the Overdue mark is `revise-auction-winner-invoicing`'s. `post-sale-US9-TC4-1` and `post-sale-US9-TC10-1` stay in the suite and become runnable when that change realigns the mark to the address window |
| Whether a closed window stops an operator sending a quoted invoice | **Agreed.** It does not — the requirement gates the winner's write alone, and `post-sale-US9-TC13-1` reads it that way |
| An expired invoice can only be paid in the admin portal | **Folded in** — `grade10-admin-auction-post-sale-SC-85`, `SC-86` and `SC-89`, walked by `post-sale-US9-TC17-1`, `TC19-1` and `TC21-1` |
| A card payment at exactly the deadline | **Folded in.** Judged on receipt: at or after the deadline is refused — `grade10-admin-auction-post-sale-SC-86` |
| A card payment started before the deadline that confirms after | **Folded in** after a grilling round: a payment started in time counts, and the invoice is held `pending` until its outcome — `SC-87` and `SC-88`, with `post-sale-US9-TC22-1` and `TC23-1` added |
| Whether a reissue re-prices the fee or the premium minimum, or needs a reason | **Out of scope.** Reissue is `revise-auction-winner-invoicing`'s; `post-sale-US9-TC20-1` checks only the new deadline and walks that change's requirement |
| Whether settling an expired invoice restores bidding | **Already decided** on the Winner Order page: paying does not restore bidding by itself. Suspension belongs to `grade10-site/auction/bidder-suspension` |
| Whether the winner is told about a reissue | **Out of scope**, with the other letters, in a follow-on change |
