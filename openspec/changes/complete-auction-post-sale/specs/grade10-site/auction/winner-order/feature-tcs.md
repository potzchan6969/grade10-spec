# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:** none for this change's new scenarios; the scenarios it restates unchanged keep their durable cases.

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

### winner-order-US1-TC48-1: Production offers card only until Finance confirms the account

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* Grade10 holds no HKD bank details, as in production.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Start setup, choose the home address and reach the payment method choice.
2. Send Grade10 a setup confirmation carrying the home address and bank transfer.
3. Reload the order.

**Expected Results:**

* Only card is offered.
* Grade10 refuses the confirmation.
* The order is still Awaiting Setup, with no delivery address and no method recorded.

---

## winner-order-US9: Winner pays an invoice by bank transfer

**As a** winner who would rather not pay a card fee,
**I want** to choose bank transfer, see where to send the money and what reference to quote, and send Grade10 proof,
**so that** Grade10 can match my payment and my deadline stops while it is checked.

### winner-order-US9-TC22-1: Bank transfer is recorded with the address where Grade10 holds bank details

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
* **Trace:** winner-order-US-09

**Pre-conditions:**

* Grade10 holds HKD bank details, as outside production.
* customer(winner) holds an auction order in HKD in Awaiting Setup.

**Steps:**

1. Confirm a delivery address with bank transfer.
2. Reload the order.

**Expected Results:**

* Card and bank transfer were both offered, neither selected.
* The order records bank transfer and reads Preparing Invoice.

## Settled

- Bank details are held per currency on each lane: the sample account outside production, and none in production until Finance confirms Grade10's account.

## Reconciliation

**Run:** The same agent wrote the blind cases and the scenarios, so the two readings are not independent. The cases were written from the Feature set, the journeys, the proposal, the decisions and the linked PRD sections, then joined to the scenarios on their anchors.

- **Folded:** Q25 as `winner-order-SC-226`.
- **Covered:** `winner-order-SC-226` ← `US1-TC43-1`; `-SC-90` ← `US9-TC22-1`.
- **Kept with the durable suite:** the restated scenarios whose lines did not move, and `winner-order-SC-93`, whose one change is that Grade10 holds HKD bank details.
- **Out of suite:** none.
