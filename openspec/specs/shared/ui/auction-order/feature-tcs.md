# shared/ui/auction-order Test Cases

**Status:** pending-review · 0/28
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

1. Fill the required form fields, selecting phone country `<Phone country>` and entering `<Phone digits>`.
2. Click Confirm.

**Expected Results:**

* Confirm succeeds.
* The confirm callback receives phone country `<Phone country>` and digits `<Phone digits>`.

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

1. Fill the required form fields, selecting phone country `<Phone country>` and entering `<Phone digits>`.
2. Click Confirm.
3. Read the phone value in the confirm payload.

**Expected Results:**

* The exported phone reads `<Expected E.164>`.

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

1. Fill the required form fields, selecting phone country `<Phone country>` and entering `<Phone digits>`.
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

**Pre-conditions:**

* `AuctionAddressForm` is rendered with `<empty field>` blank and the other required fields filled.

**Test data:**

| `<empty field>` | Other required fields |
| --- | --- |
| Address line 1 | Filled |
| Postal code | Filled |

**Steps:**

1. Click Confirm.

**Expected Results:**

* Confirm does not succeed.
* An error appears beside `<empty field>`.

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


* The summary receives USD line items `<USD line items>`, USD total `<USD total>`, HKD total `<HKD total>` and HKD card fee `<HKD card fee>`.
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

* `AuctionWinnerOrder` receives details for `<selected rail>`.

**Test data:**

| `<selected rail>` |
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

<!-- trace:case id=g10.shared-auction-order.TC-ibm rev=1 covers=g10.shared-auction-order.SC-7su -->
### g10.shared-auction-order.US1-TC34: Subtotal row carries its note and the fee row follows in the same group

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

* `AuctionWinnerOrder` is rendered for an HKD order with USD line items, `summary.subtotal` carrying a note, one `summary.feeLines` row and an Order Total.

**Test data:**

| Field | Value |
| --- | --- |
| line items | Five USD line items, supplied as ready-made strings |
| subtotal text | `HK$1,970.35` (fixed: the Subtotal string supplied) |
| note text | `Converted from US$251.00 at 1 USD = 7.85 HKD` (fixed: the note string supplied) |
| fee row | A row labelled `Payment Processing Fee` with value `HK$71.79` (fixed: the fee string supplied) |
| total text | `HK$2,042.14` (fixed: the Order Total string supplied) |

**Steps:**

1. Read the summary from top to bottom.

**Expected Results:**

* The line items remain in USD, in the order supplied.
* The Subtotal row follows the last line item and reads `<subtotal text>`.
* The Subtotal row carries `<note text>`.
* The fee row follows the Subtotal row and reads `<fee row>`.
* The Subtotal row and the fee row sit together as one group between two separators, one above the Subtotal and one above the Order Total.
* The Order Total reads `<total text>` below them.
* No amount is derived or converted by the block.

<!-- trace:case id=g10.shared-auction-order.TC-lnf rev=1 -->
### g10.shared-auction-order.US1-TC35: Several fee lines render in the order supplied, each as given

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
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with `summary.subtotal`, an Order Total and a `summary.feeLines` list of two rows.

**Test data:**

| Field | Value |
| --- | --- |
| fee row 1 | A row labelled `Payment Processing Fee` with value `HK$196.57` (fixed: the first row supplied) |
| fee row 2 | A row labelled `<fee label 2>` with value `Free` (fixed: the second row supplied, a string the block must print as given) |
| fee label 2 | Any label different from the first row's, for example `Second fee` (range: any text) |

**Steps:**

1. Read the rows between the Subtotal row and the Order Total.

**Expected Results:**

* `<fee row 1>` shows first and `<fee row 2>` second, as supplied.
* Both fee rows sit in the same group as the Subtotal row, between two separators.
* `<fee row 2>` prints Free as given.

## Settled

- Non-parseable phone still exports the entered value; E.164 only when parseable
- Soft local refuse beside Phone / Company Name when the application has not supplied an error; application-supplied errors still win
- First and last name stay required on Personal and Company
- Personal is the default kind when the application supplies no initial kind
- None this run. The blind reading raised nothing that needed an answer here; the one contract question went to `decisions.md` `## Raised` and landed as Q26.
- `AuctionWinnerOrder` draws each of `summary.subtotal` and `summary.feeLines` as supplied: an empty fee list draws no row and no separator, the Subtotal's note is optional, and with the older converted total and fee beside them every supplied row draws; the application supplies one set (decisions Q28).
- The Subtotal and the fee rows sit together as one group between two separators, one above the Subtotal and one above the Order Total.

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

**Run:** QA1, blind pass for `convert-hkd-order-at-subtotal`, 2026-10-22. The first blind pass read a bundle whose existing suites were empty and whose PRD pages lacked the product manager's edits, both packaging defects of the coordinator. It was resumed against a corrected bundle, with the real suites and the current PRD, and revised. It read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. It is the run's own statement, not proof.

**Run:** QA1, second blind pass, 2026-10-22. It extended its cases for the operator's order page and the house order and left this capability's cases as they were. Its files started from the blind state, without the dispositions below. It is the run's own statement, not proof.

**Run:** QA2, second reconciliation pass, 2026-10-22, in a fresh context. It read the repaired deltas of the five capabilities, `tasks.md`, `tech-design.md`, `proposal.md`, the journeys and `decisions.md` through Q31, and both QA1 passes; the merged block `packages/ui/src/blocks/auction-order/auction-winner-order.tsx` was read in the first pass. It wrote no case from a scenario. A case is linked to a scenario when its results assert every outcome the scenario's THEN and ANDs state, from a starting state of the same class and with values from the same partition. It is a statement, not proof.

**Blind cases**

| Case | Disposition |
| --- | --- |
| `US1-TC34` (`TC-ibm`) | Kept and unblocked. The author repaired the Feature set bullet to the requirement's wording, so the result that the rows "each sit between their own separators" was a misreading of the old bullet; QA2 reworded it to one group between two separators, which is all it changed. Linked: `g10.shared-auction-order.SC1` |
| `US1-TC35` (`TC-lnf`) | Kept and unblocked on the same repair; the same one result reworded. No link: no scenario states the order of several fee rows |

**Existing durable cases**

- `US1-TC27` (`TC-bu1@3`) renders what the application supplies; its HKD total 103100 and fee 3873 are illustrative strings the application no longer sends. Its results do not move. Left `draft`
- `US1-TC32` (`TC-mvr@1`) is the block with no converted total. Left `draft`

**Scenario coverage**

| Scenario | Covered by |
| --- | --- |
| `shared-ui-auction-order-SC-27`, `SC-28`, `SC-30`, `SC-s7t`, `SC-29` | Unchanged; the durable cases that held them hold them |
| `g10.shared-auction-order.SC1` | `US1-TC34` |

**Out of suite:** g10.shared-auction-order.SC2, g10.shared-auction-order.SC3, g10.shared-auction-order.SC4, g10.shared-auction-order.SC5

All four are contract claims of the block: the footnote shows under the Subtotal only (SC2), a summary without the new props renders as before (SC3), each prop draws on its own (SC4) and both sets draw when both arrive (SC5). The block tests that task 2.1 plans in this store (`packages/ui/src/blocks/auction-order/auction-winner-order.test.ts`) verify them, as the public-exports test does for the other Out of suite scenarios of this suite. `US1-TC34` asserts the note under the Subtotal and not that none shows elsewhere.

**Uncovered**

- None

**Over-claimed**

- None

**Contradictions between the readings**

- None. The disagreement the first pass held over the separators is settled by the repaired Feature set bullet, the requirement and the merged block

**Anchor coverage**

| Anchor | Cases | Scenarios |
| --- | --- | --- |
| Root group Order detail | `US1-TC34`, `TC35`, and the durable `TC27`, `TC28`, `TC32` | SC1 covered; SC2 to SC5 out of suite |

**Raised**

Q28 closes the two shared rows: each prop draws on its own as supplied, and with both sets supplied both draw. The merged block already behaves so.
