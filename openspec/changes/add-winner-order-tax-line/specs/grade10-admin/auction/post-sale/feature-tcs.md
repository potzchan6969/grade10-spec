# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-25, tcs-rules r4

**Out of suite:** none for this change's scenarios. The durable suite keeps the unchanged parts of the journey.

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance when the card needs it, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

<!-- trace:case id=g10adm.auction-post-sale.TC-u4w rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC9-1: Operator sends an invoice with tax

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice whose lines before Tax total 312000 minor units in HKD.

**Steps:**

1. Enter Tax of 6000 minor units in HKD.
2. Send the invoice.

**Expected Results:**

* The invoice is sent with Tax of 6000 minor units in HKD.
* Its Subtotal includes Tax and reads 318000 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-dre rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC10-1: Operator sends an invoice without tax

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice.

**Steps:**

1. Leave Tax empty.
2. Complete the other required quote fields and send the invoice.

**Expected Results:**

* The invoice is sent.
* It carries no Tax line.

<!-- trace:case id=g10adm.auction-post-sale.TC-tuk rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC11-1: Tax of zero is refused

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice.

**Steps:**

1. Add Tax of 0 minor units.
2. Submit the quote.

**Expected Results:**

* The send is refused.
* No invoice is issued.

<!-- trace:case id=g10adm.auction-post-sale.TC-6p7 rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC12-1: Reissue changes tax and records both values

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Pending Payment whose invoice carries no Tax.

**Steps:**

1. Open Reissue.
2. Add Tax of 6000 minor units in HKD and give a reason.
3. Send the new invoice.
4. Read the invoice log.

**Expected Results:**

* The new invoice carries Tax of 6000 minor units in HKD.
* The reissued entry names Tax as changed from no amount to 6000 minor units in HKD.

## Reconciliation

**Run:** The blind pass read the Purpose, Feature set, `post-sale-US-05`, the proposal, decisions, UI design without scenario dispositions, and the linked PRD. It did not read durable or change requirements.

**Raised:**

- The blind pass separated empty, zero, positive, and changed Tax. The scenario pass covers all four partitions in `post-sale-SC-155` to `post-sale-SC-158`.
- The blind pass asked whether removing Tax on reissue is distinct from changing it. The chosen optional-field rule treats removal as a change from an amount to none; the modified reissue requirement covers it without a separate surface case.

**Out of suite:** none.
