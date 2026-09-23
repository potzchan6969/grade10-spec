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
* One saved, untagged <media type> belongs to <inventory product>.
* One Cert record with a printed Cert ID belongs to <inventory product>.

**Test data:**

| Field | Value |
| --- | --- |
| Media type | Product image |
| Media type | Product video |

**Steps:**

1. Open the saved <media type> for <inventory product>.
2. Select the Cert record for <inventory product>.
3. Save the tag.

**Expected Results:**

* The source media item is tagged to the selected Cert record of the same product.

### grade10-admin-inventory-catalog-US12-TC2-2: Media for a Cert record without a printed ID stays shared

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
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
2. Attempt to tag the media to the Cert record without a printed Cert ID.

**Expected Results:**

* Grade10 refuses the tag write.
* The source media remains untagged and shared at product level.

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
* One saved source media item for <inventory product> is tagged to a Cert record of that product with a printed Cert ID.

**Steps:**

1. Open the tagged source media item for <inventory product>.
2. Clear its Cert tag.
3. Save the tag change.

**Expected Results:**

* The source media item has no Cert tag.
* The uploaded media remains available as product-level media.

### grade10-admin-inventory-catalog-US12-TC4-2: Retag saved media to another same-product Cert with a printed ID

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
* One saved source media item for <inventory product> is tagged to <source cert record> with a printed Cert ID.
* <target cert record> belongs to <inventory product>, has a printed Cert ID, and differs from <source cert record>.

**Steps:**

1. Open the tagged source media item for <inventory product>.
2. Select <target cert record>.
3. Save the tag change.

**Expected Results:**

* The source media item is tagged to <target cert record> only.

### grade10-admin-inventory-catalog-US12-TC5-1: Invalid retag targets preserve the current tag

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(holds existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved source media item for <inventory product> is tagged to <current cert record>.

Runs once per row of **Test data**.

**Test data:**

| Target | Value |
| --- | --- |
| Record target | Missing Cert record |
| Record target | Cert record owned by another product |

**Steps:**

1. Open the tagged source media item for <inventory product>.
2. Attempt to retag it to <record target>.

**Expected Results:**

* Grade10 refuses the tag write.
* The source media item's current tag and media remain unchanged.

### grade10-admin-inventory-catalog-US12-TC6-1: Unauthorized tag changes are refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* admin(without existing Inventory media-management authority) is on <grade10 admin inventory media manager url>.
* One saved source media item for <inventory product> has a Cert tag.

**Steps:**

1. Attempt to change the source media item's Cert tag.

**Expected Results:**

* Grade10 refuses the write under existing Inventory authorization.
* The tag and source media remain unchanged.

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

## Reconciliation

**Run:** 2026-09-24; the blind inventory suite was reconciled with the independent requirement reading. The suite pass read the outline, journey, proposal, then-current decisions and Raised table, linked Intake PRD, config context, and prior suite for ID continuity. It was denied requirements, durable specs, archive, tech-design, and the other reading's draft. Q10 was settled after the original blind read and is applied here without rerunning it.

| Diff | Disposition |
| --- | --- |
| The original TC2 treated a same-product Cert record without a printed ID as taggable. | Q10 settles that the record cannot receive a tag and its media remains shared. TC2 is revised to a negative case at v2; SC-129 records the refusal and shared-media result. |
| The blind pass asked whether a cross-product Cert target is refused or merely hidden. | Q2 limits a tag to a same-product Cert record with a printed ID. SC-130 and TC5 cover refusal and preservation of the current tag; no product question remains. |
| The requirements add an explicit existing-authority refusal and distinguish missing targets from valid retags. | TC5 and TC6 cover the invalid-target and authorization scenarios SC-130 and SC-133. |
| Cert deletion must clear tags without deleting the upload. | TC1 in US13 covers SC-134. |
