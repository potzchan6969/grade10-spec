# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

### winner-order-US1-TC12-1: Add Address opens with phone country unset

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on <the winner's auction order url> inside the address setup deadline.

**Steps:**

1. Open Complete Order Setup.
2. Open Add Address for delivery.
3. Inspect the Phone field before choosing a calling country.

**Expected Results:**

* Phone shows a globe only, with no flag and no calling-code divider.
* `+852 12345678` placeholder appears with a small gap after the globe.
* No calling country is preselected.

### winner-order-US1-TC13-1: Personal is selected and Company Name stays hidden

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address in Complete Order Setup.

**Steps:**

1. Inspect the Personal / Company control on first open.
2. Scan the fields below it.

**Expected Results:**

* Personal is selected on the segmented control.
* Company Name is not shown.

### winner-order-US1-TC14-1: Company selection reveals required Company Name

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address with Personal selected.

**Steps:**

1. Select Company on the Personal / Company control.
2. Inspect the fields below it.

**Expected Results:**

* Company is selected on the segmented control.
* Company Name appears as a required field.

### winner-order-US1-TC15-1: Empty Company Name is refused on Company

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address with Company selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Fill every required field except Company Name.
2. Attempt to confirm the address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Company Name.
* No address is saved or applied to the order.

### winner-order-US1-TC16-1: Empty phone digits are refused

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | (empty) |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Select a phone country.
2. Leave the national number empty.
3. Fill every other required field.
4. Attempt to confirm the address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Phone.
* No address is saved or applied to the order.

### winner-order-US1-TC17-1: Confirm without a phone country is refused

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | (unset) |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Type digits into Phone without choosing a calling country.
2. Fill every other required field.
3. Attempt to confirm the address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Phone.
* No address is saved or applied to the order.

### winner-order-US1-TC18-1: Unusual phone format is accepted on confirm

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | United Kingdom |
| Phone digits | +44 (0)20 7946 0958 |
| Country or region | United Kingdom |
| Town or city | London |
| Address line 1 | 10 Downing St |
| Postal code | SW1A 2AA |

**Steps:**

1. Select the phone country.
2. Enter the unusual phone digits.
3. Fill every other required field.
4. Confirm the address.

**Expected Results:**

* Grade10 accepts the confirm.
* No hard phone-format refusal appears.
* The address is applied to the order.

### winner-order-US1-TC19-1: Parseable phone is stored as E.164

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
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | (415) 555-0100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |
| Stored phone | +14155550100 |

**Steps:**

1. Enter the phone digits with punctuation.
2. Fill every other required field.
3. Confirm the address.
4. Read the stored phone on the order address snapshot.

**Expected Results:**

* Step 3 succeeds.
* The stored phone reads +14155550100.

### winner-order-US1-TC20-1: Address confirms with optional line 2 and state empty

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Address line 2 | (empty) |
| State or province | (empty) |
| Postal code | 94105 |

**Steps:**

1. Fill every required field.
2. Leave address line 2 and state or province empty.
3. Confirm the address.

**Expected Results:**

* Grade10 accepts the confirm.
* The order address snapshot shows the entered line 1 and postal code.
* Address line 2 and state or province are empty on the snapshot.

### winner-order-US1-TC21-1: Add Address collects no Apt or Suite field

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address.

**Steps:**

1. Scan every field label on the form.

**Expected Results:**

* No Apt., Suite, or Building field is shown.
* Address line 2 remains available as the optional second line.

### winner-order-US1-TC22-1: Personal saved address card title is recipient name

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on Complete Order Setup delivery picker.
* A saved personal delivery address exists for Alex Chen.

**Steps:**

1. Open the delivery address picker.
2. Read the card title on the Alex Chen personal address.

**Expected Results:**

* The card title reads Alex Chen.
* It does not read a company name.
* The card body shows street, city or region, and country.
* The card body does not show postal code or phone.

### winner-order-US1-TC23-1: Company saved address card title is company name

**Classification:**

* **Severity:** normal
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on Complete Order Setup delivery picker.
* A saved company delivery address exists for Northwind Collectibles with recipient Alex Chen.

**Steps:**

1. Open the delivery address picker.
2. Read the card title on the Northwind Collectibles company address.

**Expected Results:**

* The card title reads Northwind Collectibles.
* It does not read Alex Chen.
* The card body shows street, city or region, and country.
* The card body does not show postal code or phone.

### winner-order-US1-TC24-1: Company delivery address with phone confirms successfully

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on delivery Add Address inside the address setup deadline.

**Test data:**

| Field | Value |
| --- | --- |
| Kind | Company |
| Company name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone country | United States |
| Phone digits | 4155550100 |
| Country or region | United States |
| Town or city | San Francisco |
| Address line 1 | 100 Market St |
| Postal code | 94105 |

**Steps:**

1. Select Company.
2. Fill every required field, including Company Name and phone.
3. Confirm the address.
4. Reopen the delivery address picker.

**Expected Results:**

* Step 3 succeeds.
* The delivery address on the order carries Northwind Collectibles, Alex Chen, a phone with country and digits, and postal code 94105.
* Step 4 shows the address card title as Northwind Collectibles.
* Step 4 card body does not show the phone or postal code.

### winner-order-US1-TC25-1: Order summary shows the full address snapshot after setup

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer(winner) is on Winner Order Awaiting Setup inside the address setup deadline.

**Test data:**

| Field | Value |
| --- | --- |
| Kind | Company |
| Company name | Northwind Collectibles |
| First name | Alex |
| Last name | Chen |
| Phone | +14155550100 |
| Address line 1 | 100 Market St |
| Town or city | San Francisco |
| Postal code | 94105 |
| Country or region | United States |
| Billing | Same as delivery |

**Steps:**

1. Complete Order Setup with the company delivery address from **Test data** and Same as delivery checked.
2. Read Delivery address and Billing address on the Order summary.

**Expected Results:**

* Delivery shows Northwind Collectibles, Alex Chen, the phone, 100 Market St, San Francisco with 94105, and United States.
* Billing matches Delivery.
* The values are the full snapshot, not the lean picker card body alone.

---

## winner-order-US11: Winner bills a won lot to a different address

**As a** winner who pays from a different address than the one the lot ships to,
**I want** to give that billing address when I confirm where to ship,
**so that** my invoice and receipt show who is billed as well as where the lot goes.

### winner-order-US11-TC1-1: Billing Add Address shows phone and Personal or Company

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on Complete Order Setup with billing set to differ from delivery.

**Steps:**

1. Open Add Address for billing.
2. Inspect the form controls and fields.

**Expected Results:**

* Personal / Company control is shown above the address fields.
* Phone shows a country selector and national number input.
* Phone country starts empty with a globe only.
* Company Name is hidden while Personal is selected.

### winner-order-US11-TC2-1: Billing Add Address refuses empty phone

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
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on billing Add Address with Personal selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | (empty) |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps:**

1. Select a phone country.
2. Leave the national number empty.
3. Fill every other required billing field.
4. Attempt to confirm the billing address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Phone.
* Billing address on the order stays unchanged.

### winner-order-US11-TC3-1: Billing company address requires Company Name

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
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on billing Add Address with Company selected.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Alex |
| Last name | Chen |
| Phone country | Canada |
| Phone digits | 4165550100 |
| Country or region | Canada |
| Town or city | Toronto |
| Address line 1 | 1 Front St |
| Postal code | M5E 1B2 |

**Steps:**

1. Fill every required field except Company Name.
2. Attempt to confirm the billing address.

**Expected Results:**

* Grade10 refuses the confirm.
* A refusal appears beside Company Name.
* Billing address on the order stays unchanged.

### winner-order-US11-TC4-1: Billing address with phone and kind applies separately from delivery

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-11

**Pre-conditions:**

* customer(winner) is on Complete Order Setup with a confirmed personal delivery address for Alex Chen in San Francisco.

**Test data:**

| Field | Value |
| --- | --- |
| Billing kind | Company |
| Billing company name | Northwind Billing Ltd |
| Billing first name | Alex |
| Billing last name | Chen |
| Billing phone country | Canada |
| Billing phone digits | 4165550199 |
| Billing country or region | Canada |
| Billing town or city | Toronto |
| Billing address line 1 | 1 Front St |
| Billing postal code | M5E 1B2 |

**Steps:**

1. Untick billing same as delivery.
2. Open billing Add Address.
3. Enter the company billing address with phone country and digits.
4. Confirm billing.
5. Read delivery and billing on the setup form.

**Expected Results:**

* Step 4 succeeds.
* Delivery still shows the San Francisco personal address.
* Billing shows Northwind Billing Ltd with the entered Toronto address and phone.

---

## winner-order-US12: Winner confirms delivery when five addresses are already saved

**As a** winner with five saved shipping addresses,
**I want** to confirm a different address for this order without saving a sixth,
**so that** a full address book does not block settlement before the address deadline.

### winner-order-US12-TC1-1: Add Address at the five-address cap shows phone and kind

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) with exactly five saved shipping addresses is on <the winner's auction order url> before the address deadline.

**Steps:**

1. Open the Confirm Delivery Address selector.
2. Select Add new address.
3. Inspect the form.

**Expected Results:**

* Personal / Company control is shown.
* Phone shows a country selector and national number input with no country preselected.
* Company Name is hidden while Personal is selected.

### winner-order-US12-TC2-1: One-time personal address at the cap collects phone and confirms

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) with exactly five saved shipping addresses is on <the winner's auction order url> before the address deadline.

**Test data:**

| Field | Value |
| --- | --- |
| First name | Jordan |
| Last name | Lee |
| Phone country | United States |
| Phone digits | 2125550147 |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

**Steps:**

1. Open Add new address.
2. Fill every required field, including phone country and digits.
3. Leave Save this address for future orders unselected.
4. Confirm the address for this order.

**Expected Results:**

* Step 4 succeeds.
* The order delivery address is the entered one-time address with phone country and digits.
* The account still holds exactly five saved addresses.

### winner-order-US12-TC3-1: One-time company address at the cap requires Company Name and phone

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
* **Trace:** winner-order-US-12

**Pre-conditions:**

* customer(winner) with exactly five saved shipping addresses is on Add new address for delivery.

**Test data:**

| Field | Value |
| --- | --- |
| Kind | Company |
| Company name | (empty) |
| First name | Jordan |
| Last name | Lee |
| Phone country | (unset) |
| Phone digits | (empty) |
| Country or region | United States |
| Town or city | New York |
| Address line 1 | 350 5th Ave |
| Postal code | 10118 |

**Steps:**

1. Select Company.
2. Fill name and locality fields only.
3. Leave Company Name, phone country, and phone digits empty.
4. Leave Save this address for future orders unselected.
5. Attempt to confirm the one-time address.

**Expected Results:**

* Grade10 refuses the confirm.
* Refusals appear beside Company Name and Phone.
* The order delivery address stays unchanged.
* The account still holds exactly five saved addresses.

---

## Settled

- Non-parseable phone still applies with the entered value; E.164 only when parseable
- Missing phone country or digits share one refusal beside Phone
- Switching back to Personal drops the Company Name requirement
- Billing country or region list parity stays the open PRD question, outside this change

## Reconciliation

**Run:** Blind suite re-read 2026-09-22 for change `add-winner-address-phone-and-kind` capability `grade10-site/auction/winner-order` after Q15 Order summary full-snapshot decision. Prior same-day letter dispositions kept; Order summary finding added.

| Finding | Disposition |
| --- | --- |
| Empty phone country / digits refused beside Phone | Folded as `winner-order-SC-185`, `winner-order-SC-186` |
| Phone country starts empty; E.164 when parseable; unusual formats accepted | Folded as `winner-order-SC-187`, `winner-order-SC-188`, `winner-order-SC-189` |
| Phone placeholder with calling-code example | Folded as `winner-order-SC-201` |
| Non-parseable phone storage shape | **Raised, folded into spec** as `winner-order-SC-197` — entered value applied, not refused for format |
| Personal default / Company Name hidden and required | Folded as `winner-order-SC-190`, `winner-order-SC-191` |
| Company → Personal switch-back | **Raised, folded into spec** as `winner-order-SC-198` |
| Picker card titles personal vs company | Folded as `winner-order-SC-192`, `winner-order-SC-193` |
| Picker card body omits postal code and phone | Folded as `winner-order-SC-202` |
| Order summary shows full snapshot (company, name, phone, postal) | Folded as `winner-order-SC-203`; case `winner-order-US1-TC25-1` |
| Optional line 2 / state; no Apt field | Folded as `winner-order-SC-195`, `winner-order-SC-196` |
| Billing Add Address same phone/kind rules | Folded as `winner-order-SC-199`, `winner-order-SC-200` |
| One-time address at the five-address cap still collects phone/kind | Folded as `winner-order-SC-194`; cases `winner-order-US12-TC1-1`–`TC3-1` |
| Billing country or region list parity | **Raised, rejected** for this change — already PRD ❓ Billing country or region list; owned by `full-winner-order-country-region-list` / Product |
| Combined vs split Phone refusals | **Raised, folded into spec** — one refusal beside Phone (MODIFIED requirement) |
| Phone chrome states (globe, flag, calling code, country popup) | **Out of suite:** `ui-design.md` Add Address · Phone states and Storybook `AuctionAddressForm` |

**Uncovered anchors:** none for `winner-order-US-01`, `winner-order-US-11`, `winner-order-US-12` for this change's behaviour.
