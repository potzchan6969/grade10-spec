# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## grade10-admin-inventory-catalog-US12: Operator classifies source media for one copy

**As an** Inventory operator,
**I want** to tag, untag, or retag saved product media for one Cert record,
**so that** a listing for that physical copy can begin with the photographs
that document it while shared product media stays available to every copy.

### grade10-admin-inventory-catalog-US12-TC1-1: Tag saved media to one Cert record
Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved, untagged source media item belongs to <inventory product>.
* One Cert record belongs to <inventory product>.

**Test data:**

| Field | Value |
| --- | --- |
| Media type | Product image |
| Media type | Product video |

**Steps:**

1. Open the saved source media item for <inventory product>.
2. Select the Cert record for <inventory product>.
3. Save the tag.

**Expected Results:**

* The source media item is tagged to the selected Cert record of the same product.

### grade10-admin-inventory-catalog-US12-TC2-1: Tag media when the Cert ID is absent

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
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved, untagged source media item belongs to <inventory product>.
* One Cert record belongs to <inventory product> and has no printed Cert ID.

**Steps:**

1. Open the saved source media item for <inventory product>.
2. Select the Cert record without a printed Cert ID.
3. Save the tag.

**Expected Results:**

* The source media item is tagged to the selected Cert record.

### grade10-admin-inventory-catalog-US12-TC3-1: Untag saved media for product-level sharing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved source media item for <inventory product> is tagged to a Cert record of that product.

**Steps:**

1. Open the tagged source media item for <inventory product>.
2. Clear its Cert tag.
3. Save the tag change.

**Expected Results:**

* The source media item has no Cert tag.
* The uploaded media remains available as product-level media.

### grade10-admin-inventory-catalog-US12-TC4-1: Retag saved media to another same-product Cert

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
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved source media item for <inventory product> is tagged to <source cert record>.
* <target cert record> belongs to <inventory product> and differs from <source cert record>.

**Steps:**

1. Open the tagged source media item for <inventory product>.
2. Select <target cert record>.
3. Save the tag change.

**Expected Results:**

* The source media item is tagged to <target cert record> only.

---

## grade10-admin-inventory-catalog-US13: Operator keeps source media after a Cert record is removed

**As an** Inventory operator,
**I want** the media to remain on the product when its tagged Cert record is
removed,
**so that** deleting a stock record does not delete a reusable uploaded asset.

### grade10-admin-inventory-catalog-US13-TC1-1: Removing a Cert record preserves its source media

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-13

**Pre-conditions:**

* admin is on <grade10 admin inventory record url>.
* One saved source media item for <inventory product> is tagged to <cert record>.
* <cert record> belongs to <inventory product>.

**Steps:**

1. Open <cert record> for <inventory product>.
2. Remove <cert record>.

**Expected Results:**

* <cert record> is removed.
* The uploaded source media remains on <inventory product> without a Cert tag.
