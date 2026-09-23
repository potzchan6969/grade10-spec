# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## winner-order-US14: Winner sees a refunded order as Refunded

**As a** winner whose order Grade10 refunded because they were not happy with the item,
**I want** Winner Order to read Refunded, with the amount returned below the invoice total and a way to see Amount, Transfer to, Reason and Note — brand and last four for a card, or masked destination with the bank name under it for a transfer — whether I had paid in full or in part and wherever the card is, and my invoice and receipts still there,
**so that** I know the order is closed and still hold the record of what I paid.

### winner-order-US14-TC1-1: Refunded keeps the invoice and receipts

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
* **Trace:** winner-order-US-14

**Pre-conditions:**

* customer(winner of `<refunded order>`) is on Winner Order.

**Steps:**

1. Read the status, stepper, actions and receipt links.
2. Open the refund details from the inline alert.

**Expected Results:**

* The order reads Refunded.
* Pay, address editing and shipment actions are absent.
* The invoice and every existing receipt remain downloadable.
* No refund letter is required by this surface.
* Refund details show Amount, then Transfer to, then Reason, then Note when the operator recorded one.
* Transfer to uses `PaymentMethodCard` with the card brand logo and only the last four digits, or a bank icon with the masked destination on the primary line and the free-text bank name as secondary text under it. Not the full number or proof.
* A card refund shows no Reference.
* Note is omitted when the operator left none.

## winner-order-US15: Winner sees an overpayment returned

**As a** winner who paid more than the order,
**I want** only the difference returned below the invoice total, while the lot, the shipping and the amount I should have paid stay, with a way to see why,
**so that** I know the sale still stands.

### winner-order-US15-TC1-1: An overpayment keeps the order open

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
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner of `<overpaid order>`) is on Winner Order after the
  overpayment difference was returned.

**Steps:**

1. Read the order status, invoice lines, returned amount and refund details.

**Expected Results:**

* The order status and invoice lines are unchanged.
* Only the returned difference appears below Order Total.
* The refund details can be opened without exposing operator proof or a Stripe provider reference.

## winner-order-US17: Winner matches a bank refund against their own statement

**As a** winner whose refund was sent by bank transfer,
**I want** the reference the operator sent it under, beside the amount and where it went,
**so that** I can find the credit on my statement without asking Customer Service.

### winner-order-US17-TC1-1: Bank refund details show destination and reference

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
* **Trace:** winner-order-US-17

**Pre-conditions:**

* customer(winner of `<bank-refunded order>`) is on Winner Order after a bank
  transfer refund was recorded with no operator note.

**Steps:**

1. Open the refund details from the inline alert.

**Expected Results:**

* The details show Amount, then Transfer to, then Reference, then Reason.
* Transfer to shows a bank icon, the masked destination on the primary line, and the free-text bank name as secondary text under it.
* Reference shows the operator's bank provider reference.
* Note is not shown.
* Proof and the full account number are not shown.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Refunded retains issued documents and removes self-service | **Folded in:** `winner-order-SC-157` |
| An overpayment returns only the difference and keeps the sale open | **Folded in:** `winner-order-SC-155` |
| Refund details provide a statement-recognition clue | **Folded in:** `winner-order-SC-172` |
| Bank refund details show destination and provider reference | **Folded in:** `winner-order-SC-173` |
