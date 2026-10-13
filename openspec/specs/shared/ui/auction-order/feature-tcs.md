# shared/ui/auction-order Test Cases

**Status:** pending-review · 0/33
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** shared-ui-auction-order-SC-15, shared-ui-auction-order-SC-16, shared-ui-auction-order-SC-17, shared-ui-auction-order-SC-19, shared-ui-auction-order-SC-20

## g10.shared-auction-order.US1: Address form component contract

**Walked by:** nobody on their own - a component contract; the order detail and the address form are walked through `grade10-site/auction/winner-order`, which composes the blocks

**As a** customer,
**I want** the shared blocks to render what the application supplies,
**so that** Winner Order composes one contract instead of drawing its own.

<!-- trace:case id=g10.shared-auction-order.TC-g8b rev=1 covers=g10.shared-auction-order.SC-duw,g10.shared-auction-order.SC-2id,g10.shared-auction-order.SC-02t,g10.shared-auction-order.SC-76f,g10.shared-auction-order.SC-0cg -->
### g10.shared-auction-order.US1-TC1: Personal is selected and Company Name is hidden

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
### g10.shared-auction-order.US1-TC2: Company selection shows Company Name as required

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
### g10.shared-auction-order.US1-TC3: Switching to Company reveals Company Name

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
### g10.shared-auction-order.US1-TC4: Switching to Personal hides Company Name

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
### g10.shared-auction-order.US1-TC5: Company confirm without Company Name is refused

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
### g10.shared-auction-order.US1-TC6: Phone country starts with nothing selected

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
### g10.shared-auction-order.US1-TC7: Confirm without phone country is refused

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
### g10.shared-auction-order.US1-TC8: Confirm with country but no digits is refused

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
### g10.shared-auction-order.US1-TC9: Country and digits allow confirm

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
### g10.shared-auction-order.US1-TC10: Parseable phone is exported as E.164

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
### g10.shared-auction-order.US1-TC11: Unusual phone format is still accepted

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
### g10.shared-auction-order.US1-TC12: Address line 1 and postal code are required

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
### g10.shared-auction-order.US1-TC13: Address line 2 may be left empty

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
### g10.shared-auction-order.US1-TC14: State may be left empty

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
### g10.shared-auction-order.US1-TC15: Apt, Suite, and Building field is not collected

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
### g10.shared-auction-order.US1-TC16: Confirm exports address kind with delivery values

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
### g10.shared-auction-order.US1-TC17: Confirm exports phone with delivery values

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
### g10.shared-auction-order.US1-TC18: The form renders on its own with supplied props

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
### g10.shared-auction-order.US1-TC19: Supplied values and errors render as controlled props

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
### g10.shared-auction-order.US1-TC20: Application-supplied field errors render beside named fields

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

<!-- trace:case id=g10.shared-auction-order.TC-1f8 rev=2 covers=g10.shared-auction-order.SC-i3e -->
### g10.shared-auction-order.US1-TC21: The current step decides every step's state

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

<!-- trace:case id=g10.shared-auction-order.TC-fjf rev=2 covers=g10.shared-auction-order.SC-qb6 -->
### g10.shared-auction-order.US1-TC22: A press is reported, never acted on

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

<!-- trace:case id=g10.shared-auction-order.TC-2fz rev=1 covers=g10.shared-auction-order.SC-cdc -->
### g10.shared-auction-order.US1-TC23: Setup offers USD and HKD without a selection

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form and no settlement currency chosen.

**Steps:**

1. Read the settlement currency choices and selected value.

**Expected Results:**

* The form offers USD and HKD only.
* Neither currency is selected.

<!-- trace:case id=g10.shared-auction-order.TC-3cr rev=1 covers=g10.shared-auction-order.SC-8j6 -->
### g10.shared-auction-order.US1-TC24: Winner currency choice calls the supplied callback

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
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

* `AuctionWinnerOrder` is rendered with no currency chosen and a spy on its currency callback.

**Test data:**

| Settlement currency |
| --- |
| USD |
| HKD |

**Steps:**

1. Choose the row's settlement currency.
2. Read the spy.

**Expected Results:**

* The row's choice reads selected.
* The callback is called once with the row's currency.

<!-- trace:case id=g10.shared-auction-order.TC-giz rev=1 covers=g10.shared-auction-order.SC-7if -->
### g10.shared-auction-order.US1-TC25: Payment methods follow the selected currency

Runs once per row of **Test data**.

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

* `AuctionWinnerOrder` receives different payment methods for USD and HKD.

**Test data:**

| Settlement currency | Supplied methods | Expected choices |
| --- | --- | --- |
| USD | card, hk_local and swift | Card, HK Local and SWIFT; no FPS |
| HKD | card, fps and hk_local | Card, FPS and HK Local; no SWIFT |

**Steps:**

1. Choose the row's currency.
2. Read the payment method choices.

**Expected Results:**

* Only the row's expected choices appear, as separate choices.

<!-- trace:case id=g10.shared-auction-order.TC-kiy rev=1 covers=g10.shared-auction-order.SC-7if -->
### g10.shared-auction-order.US1-TC26: Each bank rail is its own choice

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

* `AuctionWinnerOrder` is rendered with HKD selected and two HKD bank rails supplied.

**Steps:**

1. Read the payment method choices.
2. Choose the second bank rail.

**Expected Results:**

* Each rail appears as a separate choice.
* The second rail reads selected.

<!-- trace:case id=g10.shared-auction-order.TC-bu1 rev=3 covers=g10.shared-auction-order.SC-z03,g10.shared-auction-order.SC-m7x -->
### g10.shared-auction-order.US1-TC27: HKD summary keeps USD lines and orders both totals

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered for an HKD order with USD line items and totals.

**Test data:**

| Field | Value |
| --- | --- |
| USD line items | 10100, 2020 and 1001 minor units |
| USD total | 13121 minor units |
| HKD total | 103100 minor units |
| HKD card fee | 3873 minor units |

**Steps:**

1. Read the line items and totals from top to bottom.

**Expected Results:**

* The three line items remain in USD.
* Order Total shows 13121 minor units in USD, then 103100 minor units in HKD.
* The fee reads 3873 minor units in HKD after the separator, below both totals.
* Neither total includes the fee.

<!-- trace:case id=g10.shared-auction-order.TC-p6m rev=2 covers=g10.shared-auction-order.SC-hc5 -->
### g10.shared-auction-order.US1-TC28: Bank details show only the supplied rail

Runs once per row of **Test data**.

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

* `AuctionWinnerOrder` receives details for the row's selected bank rail.

**Test data:**

| Selected rail |
| --- |
| FPS |
| HK Local |
| International via SWIFT |

**Steps:**

1. Choose View Bank Details.
2. Read the dialog.

**Expected Results:**

* One dialog shows only the selected rail's details and reference.
* No rail tabs or copy controls appear.

<!-- trace:case id=g10.shared-auction-order.TC-62a rev=1 covers=g10.shared-auction-order.SC-pd1 -->
### g10.shared-auction-order.US1-TC29: No method appears before currency selection

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` receives USD and HKD methods with no currency chosen.

**Steps:**

1. Read the payment method choices and selected value.

**Expected Results:**

* No payment method appears or is selected.

<!-- trace:case id=g10.shared-auction-order.TC-pm2 rev=1 covers=g10.shared-auction-order.SC-nxj -->
### g10.shared-auction-order.US1-TC30: A payment method supplied as unavailable shows its text and cannot be chosen

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form and USD chosen.
* The USD card choice is supplied with an unavailable text, with a spy on the payment method callback.

**Steps:**

1. Read the card choice.
2. Try to choose the card choice.
3. Read the spy.

**Expected Results:**

* The card choice shows the unavailable text it was supplied.
* The card choice cannot be chosen.
* The payment method callback is not called.

<!-- trace:case id=g10.shared-auction-order.TC-y6r rev=1 covers=g10.shared-auction-order.SC-bzz -->
### g10.shared-auction-order.US1-TC31: Parent clears a method absent from new currency

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

* The setup form is rendered with USD selected and a selected USD bank rail that HKD does not offer.

**Steps:**

1. Read the selected method.
2. Switch to HKD.
3. Read the method choices and selected value.

**Expected Results:**

* The USD bank rail is cleared when HKD is supplied with no selected method.
* No HKD method is selected.

<!-- trace:case id=g10.shared-auction-order.TC-mvr rev=1 covers=g10.shared-auction-order.SC-k6i -->
### g10.shared-auction-order.US1-TC32: Summary shows one total when conversion is absent

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

* The summary receives a USD total and no converted total.

**Steps:**

1. Read the summary totals.

**Expected Results:**

* One USD Order Total appears.
* No amount is derived or converted by the block.

<!-- trace:case id=g10.shared-auction-order.TC-9r5 rev=1 covers=g10.shared-auction-order.SC-8eq -->
### g10.shared-auction-order.US1-TC33: Order detail omits controls it was not given

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* The order summary receives no invoice PDF and no pay control.

**Steps:**

1. Read the order summary and look for an invoice link or pay control.

**Expected Results:**

* The summary shows its supplied lines.
* No invoice link or pay control appears.

## Settled

- Non-parseable phone still exports the entered value; E.164 only when parseable
- Soft local refuse beside Phone / Company Name when the application has not supplied an error; application-supplied errors still win
- First and last name stay required on Personal and Company
- Personal is the default kind when the application supplies no initial kind
- None this run. The blind reading raised nothing that needed an answer here; the one contract question went to `decisions.md` `## Raised` and landed as Q26.

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

**Run:** removal reconciliation, 2026-10-12, for `remove-my-auction-orders`, `shared/ui/auction-order`. The exports requirement is removed and restated as "The winner-order surface exports" with fresh scenario ids; `TC-1f8` and `TC-fjf` move `covers` from the retired `g10.shared-auction-order.SC-qy4`/`SC-ofq` to `SC-i3e`/`SC-qb6` at rev 2. Every other case stays — none names the list, row or empty blocks.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-auction-order-SC-01` to `SC-04`, `SC-13`, `SC-14` | Retired with their requirement | Restated as `SC-15` to `SC-20` under "The winner-order surface exports"; `SC-02`'s row assertion becomes the non-export check `SC-16` |
| `g10.shared-auction-order.TC-1f8`, `TC-fjf` | Kept, re-linked | Same steps and results; `covers` moves to the restated scenarios |
| The list, row and empty blocks | No case | No durable case covered them; the public-exports test and task 1.1's expectation cover the removal |

**Cases** - All 11 cases remain drafts. `TC-2fz@1` covers SC-cdc; `TC-3cr@1` SC-8j6; `TC-giz@1` and `TC-kiy@1` SC-7if; `TC-bu1@3` SC-z03 and SC-m7x; `TC-p6m@2` SC-hc5; `TC-62a@1` SC-pd1; `TC-pm2@1` SC-nxj; `TC-y6r@1` SC-bzz; `TC-mvr@1` SC-k6i; and `TC-9r5@1` SC-8eq. `TC-25` asserts USD methods Card, HK Local and SWIFT without FPS, and HKD methods Card, FPS and HK Local without SWIFT. `TC-26` checks each HKD bank rail separately.

**Scenario coverage** - Eleven of 16 scenarios are covered. `SC-xdd` and `SC-tm6` use the public-exports test; `SC-10a` uses durable `TC-g9u` and `TC-l1e`; `SC-i3e` uses durable `TC-1f8`; and `SC-qb6` uses durable `TC-fjf`. These scenarios describe unchanged behavior. `TC-giz` and `TC-kiy` fully assert the USD/HKD method partition and separate bank rails.
