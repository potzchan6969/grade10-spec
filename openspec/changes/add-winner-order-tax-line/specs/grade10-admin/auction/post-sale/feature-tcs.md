# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-25, tcs-rules r4

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance and Tax when the lot needs them, for the address the winner confirmed, then send the invoice,
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

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

<!-- trace:case id=g10adm.auction-post-sale.TC-6p7 rev=1 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US7-TC38-1: Reissue changes tax

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Pending Payment whose invoice carries no Tax.

**Steps:**

1. Open Reissue.
2. Add Tax of 6000 minor units in HKD and give a reason.
3. Send the new invoice.

**Expected Results:**

* The new invoice carries Tax of 6000 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-yjb rev=1 covers=g10adm.auction-post-sale.SC-kdq -->
### post-sale-US7-TC46-1: Reissue removes tax

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Pending Payment whose invoice carries Tax of 6000 minor units in HKD.

**Steps:**

1. Open Reissue.
2. Clear the Tax amount, change nothing else, and give a reason.
3. Send the new invoice.

**Expected Results:**

* The reissue is accepted as a change.
* The new invoice has no Tax line.
* Its Subtotal is 6000 minor units lower than the replaced invoice's.

## Settled

- Removing Tax on a reissue is a change from an amount to none, like changing its amount; it has its own scenario and case.

## Reconciliation

**Run:** The blind pass read the Purpose, Feature set, `post-sale-US-05`, the proposal, decisions, UI design without scenario dispositions, and the linked PRD. It did not read durable or change requirements.

**Run:** 2026-10-06, QA2 rerun after accept-review, not blind: the delta's requirements and scenarios, the durable suite and the cases above. It moved the reissue case to `post-sale-US-07`, the journey its scenario serves. The reissue log rule for Tax moved to `complete-auction-post-sale`'s `Invoice log history`, so this change modifies no log requirement.

### Folded

- `post-sale-US5-TC9-1`, an invoice sent with Tax whose Subtotal includes it -> `post-sale-SC-155`
- `post-sale-US5-TC10-1`, an invoice sent with Tax left empty carries no Tax line -> `post-sale-SC-156`
- `post-sale-US5-TC11-1`, Tax of zero refused -> `post-sale-SC-157`
- `post-sale-US7-TC38-1`, a reissue adding Tax whose new invoice carries it -> `post-sale-SC-158`
- `post-sale-US7-TC46-1`, a reissue removing Tax whose new invoice has none -> `post-sale-SC-210`

### Rejected

- No blind case was dropped.

### Escalated

- Is removing Tax on a reissue a change of its own, distinct from changing its amount? -> `Q8`; answered under `## Settled`, and walked by `post-sale-US7-TC46-1` -> `post-sale-SC-210`

### Carried Unchanged

- **Quote and send** - `grade10-admin-auction-post-sale-SC-48`, `grade10-admin-auction-post-sale-SC-49`, `grade10-admin-auction-post-sale-SC-50`, `grade10-admin-auction-post-sale-SC-63`, `grade10-admin-auction-post-sale-SC-68`, `grade10-admin-auction-post-sale-SC-69`, `grade10-admin-auction-post-sale-SC-70`, `grade10-admin-auction-post-sale-SC-117`, `grade10-admin-auction-post-sale-SC-118`, `grade10-admin-auction-post-sale-SC-119` keep their meaning and their durable coverage
- **Reissue** - `grade10-admin-auction-post-sale-SC-107` to `-SC-115`, `grade10-admin-auction-post-sale-SC-125`, `grade10-admin-auction-post-sale-SC-126`, `grade10-admin-auction-post-sale-SC-133`, `grade10-admin-auction-post-sale-SC-134` keep their meaning and their durable coverage

**Out of suite:** none of this change's scenarios.
