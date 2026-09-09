# shared/ui/store-cart Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-09, tcs-rules r3.0

## shared-ui-store-cart-US8: Shopper raises a line to the last unit the shop has

**As a** shopper,
**I want** a line's stepper to stop where the shop runs out, and the line to
say how many are left,
**so that** I am not still raising a number the checkout will quietly put back
down.

### shared-ui-store-cart-US8-TC1-1: Stepper stops at the maximum and still counts down

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-08

**Pre-conditions:**

* customer is on the cart drawer, holding `<line_1>`.
* `<line_1>` is supplied with a quantity of `<line quantity>` and a maximum of `<line maximum>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<line_1>` | A cart line whose supplied quantity equals its supplied maximum |
| `<line quantity>` | `2` |
| `<line maximum>` | `2` |

**Steps:**

1. Activate `<line_1>`'s increment control.
2. Activate `<line_1>`'s decrement control.

**Expected Results:**

* Step 1 invokes no `onQuantityChange`.
* The increment control is inoperable and announced as unavailable.
* Step 2 invokes `onQuantityChange` with `<line quantity>` less one.

### shared-ui-store-cart-US8-TC2-1: Line supplied no maximum counts on

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
* **Trace:** shared-ui-store-cart-US-08

**Pre-conditions:**

* customer is on the cart drawer, holding `<line_2>`.
* `<line_2>` is supplied with a quantity of `<line quantity>` and no maximum.

**Test data:**

| Field | Value |
| --- | --- |
| `<line_2>` | A cart line supplied with no maximum |
| `<line quantity>` | `2` |

**Steps:**

1. Activate `<line_2>`'s increment control.

**Expected Results:**

* `onQuantityChange` is invoked with `<line quantity>` plus one.

### shared-ui-store-cart-US8-TC3-1: Remaining count is displayed only where supplied

Runs once per row of **Test data**.

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
* **Trace:** shared-ui-store-cart-US-08

**Pre-conditions:**

* customer has the row's line in the cart.

**Test data:**

| Line | Supplied remaining count | Displayed on that line |
| --- | --- | --- |
| `<line_3>` | `Only 2 left` | `Only 2 left`, and no other remaining-count copy |
| `<line_4>` | none | no remaining count |

**Steps:**

1. Open the cart drawer.
2. Read the row's line.

**Expected Results:**

* The line displays what the row's last column names.
* Nothing else on the line says what is left.
