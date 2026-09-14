# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-admin-inventory-catalog-US69: Operator records a received graded unit

**As an** inventory admin,
**I want** to record optional Cert IDs when I intake stock,
**so that** each numbered graded unit can be traced without preventing
unnumbered stock from entering inventory.

### grade10-admin-inventory-catalog-US69-TC1-1: Intake records numbered and unnumbered stock

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-69

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A created product has an inventory with stock two.

**Test data:**

| Field | Value |
| --- | --- |
| `<numbered intake>` | Quantity two with `PSA-123` and `BGS-456` |
| `<unnumbered intake>` | Quantity three with no Cert IDs |

**Steps:**

1. Navigate to <inventory product url>.
2. Intake <numbered intake>.
3. Intake <unnumbered intake>.
4. Read the product inventory and its history.

**Expected Results:**

* Stock increases by five.
* `PSA-123` and `BGS-456` are owned by the product inventory.
* The unnumbered intake creates no Cert ID record.
* One intake history entry records the numbered identifiers.

### grade10-admin-inventory-catalog-US69-TC2-1: Invalid Cert ID intake preserves inventory

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
* **Trace:** grade10-admin-inventory-catalog-US-69

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* The product inventory already owns `PSA-123` and stock is two.

**Steps:**

1. Navigate to <inventory product url>.
2. Try to intake quantity one with duplicate `PSA-123`.
3. Try to intake quantity one with two Cert IDs.
4. Read the inventory and its history.

**Expected Results:**

* Both intakes are refused.
* Stock and Cert ID records are unchanged.
* No refused intake adds a history entry.

---

## grade10-admin-inventory-catalog-US70: Operator configures the product identity and display

**As an** inventory admin,
**I want** products to use IP, Category, and Item while choosing whether Cert
ID appears in displayed attributes,
**so that** product facts stay structured and each Auction presentation shows
only the fields I choose.

### grade10-admin-inventory-catalog-US70-TC1-1: Product display offers the hierarchy and Cert ID field

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-70

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A product schema exists for one IP, Category, and Item tuple.

**Steps:**

1. Navigate to <inventory product url>.
2. Inspect the product identity fields.
3. Navigate to <inventory product schemas url>.
4. Add Cert ID to the displayed fields and place it first.
5. Read a listing for a product with Cert ID `PSA-123`.

**Expected Results:**

* The product form shows IP, Category, and Item.
* Collectible type and product metadata are absent.
* Cert ID is available without creating an ordinary attribute key.
* The listing shows `PSA-123` first in its configured product fields.

### grade10-admin-inventory-catalog-US70-TC2-1: Hiding Cert ID preserves typed attributes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-70

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published schema displays Cert ID and two typed attributes.
* A listing explicitly selected `No Cert ID`.

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Remove Cert ID from the displayed fields.
3. Read the schema and the listing.

**Expected Results:**

* The two typed attributes remain in their prior order.
* Cert ID is not returned as a displayed field.
* The listing shows no Cert ID row and no product metadata fallback.

---

## grade10-admin-inventory-catalog-US71: Holder reserves a specific inventory unit

**As an** inventory holder,
**I want** to choose a specific Cert ID or explicitly choose `No Cert ID` when
I reserve stock,
**so that** every reservation identifies whether it owns a physical numbered
unit or only aggregate stock.

### grade10-admin-inventory-catalog-US71-TC1-1: Reservation records the selected unit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-71

**Pre-conditions:**

* An authorized holder can reserve inventory.
* A created product has available Cert IDs `PSA-123` and `BGS-456`.

**Steps:**

1. Open the holder reservation flow for the product.
2. Select Cert ID `PSA-123`.
3. Save the reservation.
4. Inspect the reservation and available unit choices.

**Expected Results:**

* The reservation stores the selected opaque Cert ID record.
* The reservation quantity is one.
* `PSA-123` is unavailable to another active reservation.

### grade10-admin-inventory-catalog-US71-TC2-1: Reservation requires an explicit unit choice

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
* **Trace:** grade10-admin-inventory-catalog-US-71

**Pre-conditions:**

* An authorized holder can reserve inventory.
* A created product has available stock and no intended numbered unit.

**Steps:**

1. Open the holder reservation flow for the product.
2. Try to save without choosing a Cert ID or `No Cert ID`.
3. Choose `No Cert ID` and quantity three.
4. Save and inspect the reservation.

**Expected Results:**

* The missing-choice request is refused without changing inventory.
* The explicit `No Cert ID` request succeeds through product-level quantity.
* No Cert ID record is allocated.
