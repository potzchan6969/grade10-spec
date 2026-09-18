# shared/ui/auction-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## shared-ui-auction-order-US1: Billing address form

**Walked by:** nobody on their own — a component contract; the billing address on the form is walked through `grade10-site/auction/winner-order`, which composes the block

**As a** frontend engineer,
**I want** a controlled billing-address form contract,
**so that** a consuming flow can collect two addresses without owning layout.

### shared-ui-auction-order-US1-TC1-1: The form starts with billing copied from delivery

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Billing address form

**Pre-conditions:**

* customer is rendering `AuctionAddressForm` with a complete delivery address.

**Steps:**

1. Render the form.

**Expected Results:**

* Same as delivery address is selected.
* The billing address controls do not require a second address.

### shared-ui-auction-order-US1-TC2-1: Clearing the choice reveals a second address

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
* **Trace:** Billing address form

**Pre-conditions:**

* customer is rendering `AuctionAddressForm` with Same as delivery address selected.

**Steps:**

1. Clear Same as delivery address.

**Expected Results:**

* A second saved or one-time address picker is shown.
* Confirm can report delivery and billing values separately.

## Reconciliation

- The billing form default and alternate-address states were covered as `shared-ui-auction-order-SC-05` and `shared-ui-auction-order-SC-06`.
