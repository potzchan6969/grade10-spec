# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## post-sale-US19: Operator settles an expired invoice

**As an** operator,
**I want** an expired invoice settled only in the admin portal, and a card payment started in time to count,
**so that** a winner who paid just before the deadline is never expired, and one who paid after it is never charged.

<!-- trace:case id=g10adm.auction-post-sale.TC-o6m rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### post-sale-US19-TC1-1: Manual settlement pays an expired invoice and ends what is owed

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

* The settlement is accepted; the order derives Preparing Shipment.
* The Expired invoice status is gone; the invoice reads paid.
* Winner Order shows no amount owed and no card Pay.

<!-- trace:case id=g10adm.auction-post-sale.TC-v9x rev=1 covers=g10adm.auction-post-sale.SC-v9x -->
### post-sale-US19-TC2-1: An expired invoice keeps a recorded shortfall

**Classification:**

* **Severity:** major
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

* `<expired-invoice order>` has a 100000 minor-unit balance after its deadline.
* admin(holds payment-processing) is recording a payment.

**Steps:**

1. Record a 40000-minor-unit payment with method, reference and proof.
2. Read the invoice status, remaining balance and winner payment controls.

**Expected Results:**

* The invoice reads Partially Paid with 60000 minor units remaining.
* No new self-service payment deadline or close-as-paid choice appears.
* Winner Order offers no card Pay control.

<!-- trace:case id=g10adm.auction-post-sale.TC-0g4 rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### post-sale-US19-TC3-1: A card payment just before the deadline is accepted

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
* The order derives Preparing Shipment and never showed Expired invoice.

<!-- trace:case id=g10adm.auction-post-sale.TC-54p rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### post-sale-US19-TC4-1: The winner cannot pay by card after the deadline

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

<!-- trace:case id=g10adm.auction-post-sale.TC-o2f rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### post-sale-US19-TC5-1: A card payment started in time completes after the deadline

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
* After confirmation the invoice is `paid` and the order is Preparing Shipment.
* The invoice log holds no expired entry.

<!-- trace:case id=g10adm.auction-post-sale.TC-mon rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### post-sale-US19-TC6-1: A card payment started in time that fails expires the invoice when it fails

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

<!-- trace:case id=g10adm.auction-post-sale.TC-mpo rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### post-sale-US19-TC7-1: Reissuing an expired invoice gives card payment a fresh seven days

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
* The card payment is accepted; the order derives Preparing Shipment.

<!-- trace:case id=g10adm.auction-post-sale.TC-2qa rev=1 covers=g10adm.auction-post-sale.SC-68u,g10adm.auction-post-sale.SC-ir3,g10adm.auction-post-sale.SC-bgi,g10adm.auction-post-sale.SC-prr,g10adm.auction-post-sale.SC-bgy,g10adm.auction-post-sale.SC-gj2,g10adm.auction-post-sale.SC-vsz,g10adm.auction-post-sale.SC-7fn,g10adm.auction-post-sale.SC-b9o,g10adm.auction-post-sale.SC-2fi,g10adm.auction-post-sale.SC-b5v,g10adm.auction-post-sale.SC-cdi,g10adm.auction-post-sale.SC-d1w,g10adm.auction-post-sale.SC-xct,g10adm.auction-post-sale.SC-g73 -->
### post-sale-US19-TC8-1: Settling or reissuing an expired invoice needs payment-processing

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

## Reconciliation

Two independent readings of the same anchors: this suite, written without sight
of any requirement, and a scenario draft written without sight of this suite.

| Raised | Disposition |
| --- | --- |
| An expired invoice can only be paid in the admin portal | **Folded in** - `grade10-admin-auction-post-sale-SC-85`, `SC-86` and `SC-89`, walked by `post-sale-US19-TC1-1`, `TC4-1` and `TC8-1` |
| An expired invoice with a shortfall stays Partially Paid | **Folded in** - `grade10-admin-auction-post-sale-SC-92`, walked by `post-sale-US19-TC2-1` |
| A card payment at exactly the deadline | **Folded in.** Judged on receipt: at or after the deadline is refused - `grade10-admin-auction-post-sale-SC-86` |
| A card payment started before the deadline that confirms after | **Folded in** after a grilling round: a payment started in time counts, and the invoice is held `pending` until its outcome - `SC-87` and `SC-88`, with `post-sale-US19-TC3-1`, `TC5-1` and `TC6-1` |
| Whether a reissue re-prices the fee or the premium minimum, or needs a reason | **Out of scope.** This change checks only the existing reissue deadline behavior |
| Whether settling an expired invoice restores bidding | **Already decided** on the Winner Order page: paying does not restore bidding by itself. Suspension belongs to `grade10-site/auction/bidder-suspension` |
| Whether the winner is told about a reissue | **Out of scope**, with the other letters, in a follow-on change |
| Who owns the reopen and record-setup requirement | **Moved** to `complete-auction-post-sale` (`decisions.md` Q10), which this change depends on. `SC-75` to `SC-84`, `SC-90` and `SC-91` keep their ids and markers in that change's post-sale delta. This suite no longer carries their cases; `post-sale-US18-TC1-1` to `TC7-1`, `TC16-2`, `TC25-1`, `TC26-1` and `TC27-1`, under the journey that reads Operator reopens the address form, move there with them; `TC15-1` is not carried, since `post-sale-US2-TC9-1` there walks the same steps |
| Cases for scenarios this change does not own | **Moved.** `post-sale-US18-TC8-1` to `TC14-1` and `TC24-1` read the queue outcomes, the send and the cancellation, none of which has a scenario here. The queue and send are `complete-auction-post-sale`'s, and the status each order reads is proved in `grade10-site/auction/order-status` |
