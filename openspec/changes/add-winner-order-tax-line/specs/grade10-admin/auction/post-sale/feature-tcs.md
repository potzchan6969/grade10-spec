# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/10
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

<!-- trace:case id=g10adm.auction-post-sale.TC-j3w rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US5-TC18-1: The card fee is read from the card rule before send

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

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice for card, with a subtotal of 312000 minor units in HKD.
* The HKD card rule in Payment Settings is 3.4% and HK$2.35.

**Steps:**

1. Open the send step.
2. Read the fee and the order total.

**Expected Results:**

* The payment processing fee reads 11225 and the order total 323225 minor units in HKD.
* The fee offers nothing to type.

<!-- trace:case id=g10adm.auction-post-sale.TC-j3x rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US5-TC19-1: A card invoice is refused when the currency has no card rule

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice for card, in HKD.
* Payment Settings holds no HKD card rule.

**Steps:**

1. Open the send step.
2. Send the invoice.

**Expected Results:**

* The send is refused with `CARD_FEE_UNSET`.
* The refusal says the HKD card fee is not set and points to Payment Settings.
* No invoice is issued.

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

### post-sale-US7-TC11-1: Switching to card prices the fee from the provider

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The fee is the gross-up read at reissue.
* No fee is typed by the operator.


### post-sale-US7-TC12-1: A card reissue is refused when provider fees cannot be read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.
* The payment provider's fees cannot be read.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The reissue is refused and says why.
* The current invoice is unchanged.


<!-- trace:case id=g10adm.auction-post-sale.TC-knz rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-kdq -->
### post-sale-US7-TC47-1: Switching to card prices the fee from the card rule

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

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.
* Payment Settings holds a card rule for <order_1>'s currency.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The fee is the card rule's gross-up of the Subtotal at reissue.
* No fee is typed by the operator.

<!-- trace:case id=g10adm.auction-post-sale.TC-1lc rev=1 covers=g10adm.auction-post-sale.SC-xod,g10adm.auction-post-sale.SC-em2,g10adm.auction-post-sale.SC-5aa,g10adm.auction-post-sale.SC-5qg,g10adm.auction-post-sale.SC-j3h,g10adm.auction-post-sale.SC-bb5,g10adm.auction-post-sale.SC-sjh,g10adm.auction-post-sale.SC-egc,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-21a,g10adm.auction-post-sale.SC-fbr,g10adm.auction-post-sale.SC-pvd,g10adm.auction-post-sale.SC-xba,g10adm.auction-post-sale.SC-d5u,g10adm.auction-post-sale.SC-e68,g10adm.auction-post-sale.SC-wdr,g10adm.auction-post-sale.SC-5km,g10adm.auction-post-sale.SC-dmi,g10adm.auction-post-sale.SC-oss,g10adm.auction-post-sale.SC-o4m,g10adm.auction-post-sale.SC-5sm,g10adm.auction-post-sale.SC-e28,g10adm.auction-post-sale.SC-vme,g10adm.auction-post-sale.SC-cu3,g10adm.auction-post-sale.SC-ysk,g10adm.auction-post-sale.SC-qtj,g10adm.auction-post-sale.SC-kdq -->
### post-sale-US7-TC48-1: A card reissue is refused when the currency has no card rule

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> has a sent bank transfer invoice.
* Payment Settings holds no card rule for <order_1>'s currency.

**Steps:**

1. Open Reissue.
2. Choose card, add a reason, and reissue.

**Expected Results:**

* The reissue is refused with `CARD_FEE_UNSET`.
* The refusal says the card fee for that currency is not set and points to Payment Settings.
* The current invoice is unchanged.

<!-- trace:case id=g10adm.auction-post-sale.TC-jn5 rev=2 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-rrz,g10adm.auction-post-sale.SC-sjw,g10adm.auction-post-sale.SC-y6v,g10adm.auction-post-sale.SC-xd7,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-xt3,g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-0l6,g10adm.auction-post-sale.SC-miq,g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-13r,g10adm.auction-post-sale.SC-7b2,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-htz -->
### post-sale-US7-TC25-2: The first bank transfer quote asks for the fee

Runs once per row of **Test data**.

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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(holds payment-processing) is on <order_1> in <grade10 auction admin post-sale url>.
* <order_1> reads Preparing Invoice with bank transfer chosen by the winner.

**Test data:**

| <fee> | <outcome> |
| --- | --- |
| blank | The invoice is sent; its fee reads Free |
| -100 | The send is refused; no invoice is issued |
| 0 | The invoice is sent; its fee reads Free |
| more than the Subtotal | The invoice is sent with that fee, not capped |

**Steps:**

1. Open the quote.
2. Enter Shipping & Handling and <fee>.
3. Send the invoice.

**Expected Results:**

* Step 1 names bank transfer and asks for a bank transfer fee.
* <outcome>

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

- Is removing Tax on a reissue a change of its own, distinct from changing its amount? -> decisions Q8; answered under `## Settled`, and walked by `post-sale-US7-TC46-1` -> `post-sale-SC-210`

### Carried Unchanged

- **Quote and send** - `grade10-admin-auction-post-sale-SC-48`, `grade10-admin-auction-post-sale-SC-49`, `grade10-admin-auction-post-sale-SC-50`, `grade10-admin-auction-post-sale-SC-63`, `grade10-admin-auction-post-sale-SC-68`, `grade10-admin-auction-post-sale-SC-69`, `grade10-admin-auction-post-sale-SC-70`, `grade10-admin-auction-post-sale-SC-117`, `grade10-admin-auction-post-sale-SC-118`, `grade10-admin-auction-post-sale-SC-119` keep their meaning and their durable coverage
- **Reissue** - `grade10-admin-auction-post-sale-SC-107` to `-SC-115`, `grade10-admin-auction-post-sale-SC-125`, `grade10-admin-auction-post-sale-SC-126`, `grade10-admin-auction-post-sale-SC-133`, `grade10-admin-auction-post-sale-SC-134` keep their meaning and their durable coverage

**Out of suite:** none of this change's scenarios.

**Run:** 2026-10-08, amendment for the card fee, not blind: the quote and reissue fee steps and refusals, the durable suite and the cases above. `complete-auction-post-sale` prices a card invoice's fee from the Payment Settings card rule instead of the payment provider's fees, and this change carries that edit because it already modifies both requirements (decisions Q17).

- **Folded** - `post-sale-US5-TC18-1`, the card fee read before send is the card rule's gross-up -> `grade10-admin-auction-post-sale-SC-69`; `post-sale-US5-TC19-1`, a card invoice refused with `CARD_FEE_UNSET` when its currency has no card rule -> `grade10-admin-auction-post-sale-SC-70`
- **Revised** - `post-sale-US7-TC25-2`, from `-TC25-1`: the bank transfer quote no longer sets the provider's fees as unreadable, since no send reads them -> `grade10-admin-auction-post-sale-SC-117`, `SC-118`, `SC-119`
- **Deprecated** - `post-sale-US7-TC11-1` and `-TC12-1` read the provider's fees. `post-sale-US7-TC47-1` replaces the first: switching to card prices the fee from the card rule -> `grade10-admin-auction-post-sale-SC-125`. `post-sale-US7-TC48-1` replaces the second: a card reissue is refused with `CARD_FEE_UNSET` when the currency has no card rule -> `grade10-admin-auction-post-sale-SC-126`
- **No longer carried unchanged** - `grade10-admin-auction-post-sale-SC-69`, `SC-70`, `SC-117`, `SC-119`, `SC-125` and `SC-126`, listed as unchanged by the run above, now read the card rule and are reached by the cases in this run. They keep their ids and titles: `validate:changes` refuses a MODIFIED block that drops or retitles a durable scenario, so `SC-70` and `SC-126` carry a note that their titles are historical, and none is removed
