# shared/ui/store-order-detail Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-28, tcs-rules r4

## shared-ui-store-order-detail-US1: Shared Order Details component contract

**Walked by:** nobody on their own — Store applications inherit this component contract, and the Grade10 order-detail journey reaches it

**As an** application composing the shared Order Details block,
**I want** supplied order facts and optional sections to render without invented data,
**so that** each Store application can present an honest order detail.

### shared-ui-store-order-detail-US1-TC1-1: Public order detail parts render independently

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Detail composition

**Pre-conditions:**

* The shared UI public entry exposes the Order Details compound and its named reusable parts.

**Steps:**

1. Import the named Order Details components and public prop types from the shared UI entry.
2. Render each named component with supplied props, both inside and outside the compound where applicable.
3. Inspect each rendered part.

**Expected Results:**

* Every named component and type import resolves.
* Each named component renders with its supplied props.
* A reusable part rendered outside the compound does not require missing compound context.

### shared-ui-store-order-detail-US1-TC2-1: Supplied order facts render in the designed order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Detail composition

**Pre-conditions:**

* `OrderDetails` receives supplied breadcrumbs, order id, status, placed date, lines, money summary, delivery, payment, address, loyalty and help content.

**Steps:**

1. Render `OrderDetails` with every supplied group.
2. Inspect the header, lines, summary, delivery, payment, address, loyalty and help sections.

**Expected Results:**

* The header and lines render with their supplied content.
* Every supplied optional group appears in the designed order.
* The block does not fetch, navigate, format money or derive status while rendering.

### shared-ui-store-order-detail-US1-TC3-1: Missing groups leave no empty presentation

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Detail composition

**Pre-conditions:**

* `OrderDetails` receives header and lines but no summary, delivery, payment, address, loyalty or help data.

**Steps:**

1. Render `OrderDetails` with the supplied header and lines.
2. Inspect the page body and sidebar area.

**Expected Results:**

* The supplied header and lines render.
* No heading, placeholder, empty card or empty sidebar stands in for an absent group.

### shared-ui-store-order-detail-US1-TC4-1: Tracking action reports only through its callback

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Optional sections

**Pre-conditions:**

* Delivery progress has supplied steps, tracking enabled and a tracking callback.

**Steps:**

1. Render the delivery progress.
2. Inspect the tracking action.
3. Activate the tracking action.

**Expected Results:**

* Track Order appears.
* Activating it reports through the supplied callback.
* The shared block does not open a URL or convert an upcoming step into a completed step.

### shared-ui-store-order-detail-US1-TC5-1: Tracking stays hidden without an action

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Optional sections

**Pre-conditions:**

* Delivery progress has tracking enabled but no tracking callback.

**Steps:**

1. Render the delivery progress.
2. Inspect the delivery actions.

**Expected Results:**

* Track Order does not appear.
* The remaining supplied delivery steps remain visible.

### shared-ui-store-order-detail-US1-TC6-1: Supplied money rows stay independent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Optional sections

**Pre-conditions:**

* The summary supplies subtotal, refund and total, while discount, points, shipping and tax are absent.

**Steps:**

1. Render the summary.
2. Inspect every money row.

**Expected Results:**

* Subtotal, refund and total render.
* Discount, points, shipping and tax do not render.
* The summary does not create a zero or placeholder row for an absent amount.

### shared-ui-store-order-detail-US1-TC7-1: A partial address renders supplied lines only

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Optional sections

**Pre-conditions:**

* A shipping or pickup address supplies address lines but no recipient name.

**Steps:**

1. Render the address in the sidebar.
2. Inspect the recipient line and supplied address lines.

**Expected Results:**

* Every supplied address line appears.
* No empty or placeholder recipient appears.

### shared-ui-store-order-detail-US1-TC8-1: Payment identity stays truthful across provider shapes

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Optional sections

**Pre-conditions:**

* The payment method is supplied in each state named by **Test data**.

**Test data:**

| Run | Payment facts | Expected presentation |
| --- | --- | --- |
| 1 | Recognized card brand and masked number | Matching logo and masked number |
| 2 | Unrecognized text label and masked number | Text label and masked number, with no unrelated logo |
| 3 | Wallet label and masked device-account number | Wallet label and masked number together |

**Steps:**

1. Render the Payment Method section for each row.
2. Inspect the provider identity and masked number.

**Expected Results:**

* A recognized brand uses its corresponding logo.
* An unrecognized provider remains visible through its supplied text or mask without a guessed logo.
* A wallet label and its mask remain visibly associated.

### shared-ui-store-order-detail-US1-TC9-1: Points credit follows the discount row

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Optional sections

**Pre-conditions:**

* The summary supplies subtotal, discount, points credit and total, with the deducted points count in the points label.

**Steps:**

1. Render the summary.
2. Inspect the money rows and the points label.

**Expected Results:**

* The Points row appears after Discount.
* Its label names the points deducted.
* Its money value uses the success credit treatment.

### shared-ui-store-order-detail-US1-TC10-1: Absent points credit leaves no Points row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Optional sections

**Pre-conditions:**

* The summary supplies a discount but no points credit.

**Steps:**

1. Render the summary.
2. Inspect the deduction rows.

**Expected Results:**

* Discount renders.
* No Points row appears.

## Reconciliation

**Run:** 2026-09-28. The blind feature reading used the shared capability's
purpose and feature set, its declaration that Store applications inherit the
contract, the change proposal and UI design, the shared Order Details product
record, and the existing Store domain suite. It did not use the requirement
scenarios to derive the cases.

| Finding | Disposition |
| --- | --- |
| Detail composition needs independent public parts, supplied-group rendering, and honest omission | **Folded in:** TC1-1 through TC3-1 |
| Optional sections need callback-owned tracking, independent money rows, partial addresses, truthful payment identity, and points-row states | **Folded in:** TC4-1 through TC10-1 |
| Store applications inherit the component contract rather than walking it alone | **Folded in:** one `US1` section with feature-set traces |
| No unresolved product question in the isolated input | **None raised** |
| Uncovered feature-set anchors | none |
