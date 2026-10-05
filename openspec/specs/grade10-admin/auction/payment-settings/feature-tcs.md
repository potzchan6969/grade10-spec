# grade10-admin/auction/payment-settings Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-admin-auction-payment-settings-US1: Operator maintains the auction premium minimums

**As a** settlement-authorized auction operator,
**I want** one place under `/auction` to review and update the minimum buyer
premium for each auction currency,
**so that** invoice amounts follow the configured policy.

<!-- trace:case id=g10adm.auction-payment-settings.TC-q43 rev=1 covers=g10adm.auction-payment-settings.SC-erw,g10adm.auction-payment-settings.SC-veg,g10adm.auction-payment-settings.SC-ieg,g10adm.auction-payment-settings.SC-s8d -->
### grade10-admin-auction-payment-settings-US1-TC1-1: Initial page shows every supported currency

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* admin(holds the auction settlement permission) is on Payment settings under `/auction`.
* No minimum has been saved yet.

**Steps:**

1. Read the USD row.
2. Read the HKD row.
3. Read the JPY row.

**Expected Results:**

* USD shows 0 minor units.
* HKD shows 0 minor units.
* JPY shows 0 minor units.

<!-- trace:case id=g10adm.auction-payment-settings.TC-nzx rev=1 covers=g10adm.auction-payment-settings.SC-erw,g10adm.auction-payment-settings.SC-veg,g10adm.auction-payment-settings.SC-ieg,g10adm.auction-payment-settings.SC-s8d -->
### grade10-admin-auction-payment-settings-US1-TC2-1: Complete mapping save persists all values

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* admin(holds the auction settlement permission) is on Payment settings under `/auction`.

**Test data:**

| Field | Value |
| --- | --- |
| `<usd>` | 100 minor units (any whole amount of 0 or more) |
| `<hkd>` | 500 minor units (any whole amount of 0 or more) |
| `<jpy>` | 100 minor units (any whole amount of 0 or more) |

**Steps:**

1. Set USD to <usd>.
2. Set HKD to <hkd>.
3. Set JPY to <jpy>.
4. Save the mapping.
5. Reload Payment settings.

**Expected Results:**

* Step 5 shows <usd>, <hkd> and <jpy> as saved.
* The save names this operator and the time it was saved.

<!-- trace:case id=g10adm.auction-payment-settings.TC-s5q rev=1 covers=g10adm.auction-payment-settings.SC-erw,g10adm.auction-payment-settings.SC-veg,g10adm.auction-payment-settings.SC-ieg,g10adm.auction-payment-settings.SC-s8d -->
### grade10-admin-auction-payment-settings-US1-TC3-1: Invalid save changes nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

Runs once per row of **Test data**.

**Pre-conditions:**

* admin(holds the auction settlement permission) is on Payment settings under `/auction`.
* The saved mapping is USD 0, HKD 0, and JPY 0 minor units.

**Test data:**

| `<mapping>` | `<refusal>` |
| --- | --- |
| USD −1 minor units, HKD 0, JPY 0 | a negative amount |
| USD 0, HKD 0, JPY 0, EUR 100 minor units | an unsupported currency |

**Steps:**

1. Submit <mapping>.
2. Read the saved mapping.

**Expected Results:**

* The save is refused because <refusal>.
* USD, HKD and JPY remain 0 minor units.

<!-- trace:case id=g10adm.auction-payment-settings.TC-7de rev=1 covers=g10adm.auction-payment-settings.SC-erw,g10adm.auction-payment-settings.SC-veg,g10adm.auction-payment-settings.SC-ieg,g10adm.auction-payment-settings.SC-s8d -->
### grade10-admin-auction-payment-settings-US1-TC4-1: Missing settlement permission refuses access

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-payment-settings-US-01

**Pre-conditions:**

* admin(signed in, without the auction settlement permission) is under `/auction`.

**Test data:**

| Field | Value |
| --- | --- |
| `<usd>` | 100 minor units |

**Steps:**

1. Open Payment settings.
2. Save USD as <usd>.

**Expected Results:**

* Step 1 is refused.
* Step 2 is refused.

## Raised

- The latest product reading confirms one fixed 20% premium rate and editable currency minimums under `/auction`; no unresolved product question remains.

## Settled

- `grade10-admin-auction-payment-settings-US-01-TC1` is `grade10-admin-auction-payment-settings-US1-TC1`: renamed to the compact id form while still draft.
- `grade10-admin-auction-payment-settings-US-01-TC2` is `grade10-admin-auction-payment-settings-US1-TC2`: renamed to the compact id form while still draft.
- `grade10-admin-auction-payment-settings-US-01-TC3` is `grade10-admin-auction-payment-settings-US1-TC3`: renamed to the compact id form while still draft.
- `grade10-admin-auction-payment-settings-US-01-TC4` is `grade10-admin-auction-payment-settings-US1-TC4`: renamed to the compact id form while still draft.

## Reconciliation

**Run:** 2026-09-16; scenario and suite readings were reconciled by the author.

- **Uncovered anchors:** none.
