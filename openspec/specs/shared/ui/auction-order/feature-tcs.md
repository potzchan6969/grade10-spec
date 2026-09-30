# shared/ui/auction-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3

## shared-ui-auction-order-US1: Address form component contract

**Walked by:** nobody on their own — a component contract; phone and address kind on the form are walked through `grade10-site/auction/winner-order`, which composes the block

**As a** customer,
**I want** the shared address form to collect personal or company addresses with a country-aware phone,
**so that** Winner Order setup can confirm delivery and billing through one contract.

<!-- trace:case id=g10.shared-auction-order.TC-g8b rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC1-1: Personal is selected and Company Name is hidden

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* `AuctionAddressForm` is rendered with kind `personal` and no field errors supplied.

**Steps:**

1. Render the form at a wide viewport.
2. Inspect the kind control and the visible fields.

**Expected Results:**

* Personal is selected on the kind control.
* Company Name is not shown.

<!-- trace:case id=g10.shared-auction-order.TC-fco rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC2-1: Company selection shows Company Name as required

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
* **Trace:** Address form fields

**Pre-conditions:**

* `AuctionAddressForm` is rendered with kind `company` and no field errors supplied.

**Steps:**

1. Render the form.
2. Inspect the visible fields and required markers.

**Expected Results:**

* Company is selected on the kind control.
* Company Name is shown and marked required.

<!-- trace:case id=g10.shared-auction-order.TC-k7g rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC3-1: Switching to Company reveals Company Name

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* `AuctionAddressForm` is rendered with kind `personal`.

**Steps:**

1. Select Company on the kind control.
2. Inspect the visible fields.

**Expected Results:**

* Company Name appears.
* Personal-only layout no longer hides Company Name.

<!-- trace:case id=g10.shared-auction-order.TC-fgm rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC4-1: Switching to Personal hides Company Name

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* `AuctionAddressForm` is rendered with kind `company`.

**Steps:**

1. Select Personal on the kind control.
2. Inspect the visible fields.

**Expected Results:**

* Company Name is not shown.

<!-- trace:case id=g10.shared-auction-order.TC-pqy rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC5-1: Company confirm without Company Name is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* `AuctionAddressForm` is rendered with kind `company`, all other required fields filled, and Company Name empty.

**Steps:**

1. Click Confirm.

**Expected Results:**

* Confirm does not succeed with an empty Company Name.
* An error appears beside Company Name.

<!-- trace:case id=g10.shared-auction-order.TC-08m rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC6-1: Phone country starts with nothing selected

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
* **Trace:** Address form fields

**Pre-conditions:**

* `AuctionAddressForm` is rendered with no phone country or digits supplied.

**Steps:**

1. Render the form.
2. Inspect the phone field chrome.

**Expected Results:**

* No country is preselected.
* The phone field shows the empty-country chrome (globe, no calling code).

<!-- trace:case id=g10.shared-auction-order.TC-fih rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC7-1: Confirm without phone country is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* All required non-phone fields are filled.
* Phone country is unset and phone digits are empty.

**Steps:**

1. Click Confirm.

**Expected Results:**

* Confirm does not succeed.
* An error appears beside Phone.

<!-- trace:case id=g10.shared-auction-order.TC-sou rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC8-1: Confirm with country but no digits is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* All required non-phone fields are filled.
* A phone country is selected and phone digits are empty.

**Steps:**

1. Click Confirm.

**Expected Results:**

* Confirm does not succeed.
* An error appears beside Phone.

<!-- trace:case id=g10.shared-auction-order.TC-t7g rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC9-1: Country and digits allow confirm

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* All required fields are filled, including a selected phone country and non-empty digits.

**Test data:**

| Field | Value |
| --- | --- |
| Phone country | United States |
| Phone digits | 4155550100 |

**Steps:**

1. Fill the form using **Test data**.
2. Click Confirm.

**Expected Results:**

* Confirm succeeds.
* The confirm callback receives the entered phone country and digits.

<!-- trace:case id=g10.shared-auction-order.TC-m3r rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC10-1: Parseable phone is exported as E.164

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Address form fields

**Pre-conditions:**

* All required fields are filled with a parseable phone number.

**Test data:**

| Field | Value |
| --- | --- |
| Phone country | United States |
| Phone digits | 4155550100 |
| Expected E.164 | +14155550100 |

**Steps:**

1. Fill the form using **Test data**.
2. Click Confirm.
3. Read the phone value in the confirm payload.

**Expected Results:**

* The exported phone reads **Expected E.164**.

<!-- trace:case id=g10.shared-auction-order.TC-ygt rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC11-1: Unusual phone format is still accepted

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* All required fields are filled.
* Phone country and non-empty digits are supplied in an unusual format that hard validity would reject.

**Test data:**

| Field | Value |
| --- | --- |
| Phone country | United States |
| Phone digits | An unusual but non-empty national format |

**Steps:**

1. Fill the form using **Test data**.
2. Click Confirm.

**Expected Results:**

* Confirm succeeds.
* The form does not refuse the number for hard libphonenumber validity.

<!-- trace:case id=g10.shared-auction-order.TC-1gj rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC12-1: Address line 1 and postal code are required

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

Runs once per row of **Test data**.

**Test data:**

| Empty field | Other required fields |
| --- | --- |
| Address line 1 | Filled |
| Postal code | Filled |

**Pre-conditions:**

* `AuctionAddressForm` is rendered with the row's empty field blank and the other required fields filled.

**Steps:**

1. Click Confirm.

**Expected Results:**

* Confirm does not succeed.
* An error appears beside the empty required field.

<!-- trace:case id=g10.shared-auction-order.TC-czf rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC13-1: Address line 2 may be left empty

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* All required fields are filled and address line 2 is empty.

**Steps:**

1. Click Confirm.

**Expected Results:**

* Confirm succeeds.
* Address line 2 is empty in the confirm payload.

<!-- trace:case id=g10.shared-auction-order.TC-h1k rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC14-1: State may be left empty

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* All required fields are filled and state is empty.

**Steps:**

1. Click Confirm.

**Expected Results:**

* Confirm succeeds.
* State is empty in the confirm payload.

<!-- trace:case id=g10.shared-auction-order.TC-ga6 rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC15-1: Apt, Suite, and Building field is not collected

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Address form fields

**Pre-conditions:**

* `AuctionAddressForm` is rendered with default props.

**Steps:**

1. Render the form.
2. Inspect the visible locality fields.

**Expected Results:**

* No Apt., Suite, or Building field is shown.

<!-- trace:case id=g10.shared-auction-order.TC-l1e rev=1 covers=g10.shared-auction-order.SC-7db -->
### shared-ui-auction-order-US1-TC16-1: Confirm exports address kind with delivery values

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Address form export

**Pre-conditions:**

* All required delivery fields are filled for a company address.

**Steps:**

1. Click Confirm.
2. Read the confirm payload for delivery.

**Expected Results:**

* Delivery kind reads `company`.
* Delivery includes the entered company name and other delivery fields.

<!-- trace:case id=g10.shared-auction-order.TC-xlg rev=1 covers=g10.shared-auction-order.SC-7db -->
### shared-ui-auction-order-US1-TC17-1: Confirm exports phone with delivery values

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Address form export

**Pre-conditions:**

* All required delivery fields are filled, including phone country and digits.

**Steps:**

1. Click Confirm.
2. Read the confirm payload for delivery phone.

**Expected Results:**

* Delivery phone includes the selected country and entered digits.
* When parseable, delivery phone reads E.164.

<!-- trace:case id=g10.shared-auction-order.TC-y94 rev=1 covers=g10.shared-auction-order.SC-7db -->
### shared-ui-auction-order-US1-TC18-1: The form renders on its own with supplied props

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Address form export

**Pre-conditions:**

* None.

**Steps:**

1. Render `AuctionAddressForm` alone with labels, values, and callbacks supplied through props.
2. Inspect the rendered fields and actions.

**Expected Results:**

* The form renders without a parent dialog or page shell.
* Confirm and Cancel are visible and wired to their callbacks.

<!-- trace:case id=g10.shared-auction-order.TC-joz rev=1 covers=g10.shared-auction-order.SC-7db -->
### shared-ui-auction-order-US1-TC19-1: Supplied values and errors render as controlled props

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Address form export

**Pre-conditions:**

* `AuctionAddressForm` is rendered with supplied field values and a supplied error beside Phone.

**Steps:**

1. Inspect the phone value and the Phone error.
2. Re-render with updated phone value and no Phone error.

**Expected Results:**

* Step 1 shows the supplied phone value and the supplied Phone error.
* Step 2 shows the updated phone value and no Phone error.

<!-- trace:case id=g10.shared-auction-order.TC-g9u rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### shared-ui-auction-order-US1-TC20-1: Application-supplied field errors render beside named fields

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Address form fields

**Pre-conditions:**

* `AuctionAddressForm` is rendered with application-supplied errors beside Phone and Company Name.

**Steps:**

1. Inspect the Phone and Company Name fields.

**Expected Results:**

* Each supplied error appears beside its named field.

<!-- trace:case id=g10.shared-auction-order.TC-1f8 rev=1 covers=g10.shared-auction-order.SC-qy4 -->
### shared-ui-auction-order-US1-TC21-1: The current step decides every step's state

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
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with Payment as the current step.

**Steps:**

1. Read the five steps.

**Expected Results:**

* Address and Invoice read complete.
* Payment reads current.
* Shipping and Completed read upcoming.

<!-- trace:case id=g10.shared-auction-order.TC-fjf rev=1 covers=g10.shared-auction-order.SC-ofq -->
### shared-ui-auction-order-US1-TC22-1: A press is reported, never acted on

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
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with a pay control and a spy on its callback.

**Steps:**

1. Choose the pay control.

**Expected Results:**

* The pay callback is called once.
* No network request is made.

## Settled

- Non-parseable phone still exports the entered value; E.164 only when parseable
- Soft local refuse beside Phone / Company Name when the application has not supplied an error; application-supplied errors still win
- First and last name stay required on Personal and Company
- Personal is the default kind when the application supplies no initial kind

## Reconciliation

**Run:** Blind suite reading 2026-09-22 for change `add-winner-address-phone-and-kind` capability `shared/ui/auction-order`. Read isolated bundle under `/tmp/phone-kind-blind/` (`proposal.md`, `decisions.md`, `ui-design.md`, `prd-auction-order.md`, `auction-order/outline.md`, `auction-order/user-journeys.md`) and store shape docs `docs/governance/specs-to-test-cases.md`. Denied: every `## Requirements` section; durable `openspec/specs/**` beyond the outline; `openspec/changes/archive/`; `/tmp/phone-kind-scenarios/` and any scenario draft.

| Finding | Disposition |
| --- | --- |
| Personal / Company and Company Name requiredness | Folded as the matching scenario, the matching scenario; cases TC1–TC5 |
| Phone country empty start; refuse missing country/digits; E.164 / unusual formats | Folded as the matching scenario, the matching scenario; cases TC6–TC11 |
| Optional locality; no Apt field | Folded as the matching scenario; cases TC12–TC15 |
| Confirm exports kind and phone | Folded as the matching scenario; cases TC16–TC17 |
| Controlled render and application-supplied errors | Cases TC18–TC20 — component export contract |
| Non-parseable phone export shape | **Raised, folded into spec** on the phone requirement (entered value reported) |
| Who refuses empty required fields | **Raised, folded into spec** — soft local refuse when no application error; application-supplied errors preserved (MODIFIED billing requirement) |
| First and last name required on company | **Raised, folded into spec** — stated on Personal or Company requirement |
| Personal default when no initial kind | **Raised, folded into spec** — Personal default |
| Billing Same as delivery / second address nesting | **Raised, rejected** for this change — already durable the matching scenario, the matching scenario |
| Same-as-delivery billing payload omit vs repeat | **Raised, folded into spec** lightly via the matching scenario (same kind and phone for billing when Same as delivery) |

**Uncovered anchors:** none for feature set groups `Address form fields`, `Address form export`. Billing address form behaviour for this change is covered by modified the matching scenario and durable SC-05/SC-06.
