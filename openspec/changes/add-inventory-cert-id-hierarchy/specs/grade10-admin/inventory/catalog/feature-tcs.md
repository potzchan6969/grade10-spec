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

---

## grade10-admin-inventory-catalog-US72: Operator configures card schemas and imports products

**As an** inventory admin,
**I want** to define card schemas from one shared template and upload
product rows separately from stock, then mark valid products created,
**so that** every product has a mapped identity and valid structured facts before inventory is added.

### grade10-admin-inventory-catalog-US72-TC1-2: Card schema uses one shared template

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Existing IP, Item, and Category tags are available for selection.

**Test data:**

| Field | Value |
| --- | --- |
| `<source rows>` | Rows with broad Category `TCG` and Set values `Pokémon`, `Lorcana`, and `One Piece` |
| `<product name>` | The workbook Item cell |
| `<card schema>` | Required Year number, Set text, Subject text; optional Card Number and Variety text |

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Map each sufficiently specific source key, including Category and Set, to one existing IP, Item, and Category tuple.
3. Try to map Category `TCG` alone to those multiple tuples.
4. Create a product schema from `<card schema>`.
5. Inspect the schema fields and product identity mapping.

**Expected Results:**

* Year is a required number; Set and Subject are required text.
* Card Number and Variety are optional text.
* `<product name>` is the product name, not the Grade10 Item tag.
* Serial, Cert ID, Grade Issuer, Grade, and Autograph Grade are not product attributes.
* The Category-only `TCG` mapping is refused because its source rows resolve to multiple tuples.
* The mapping uses existing tags and creates no taxonomy values.

### grade10-admin-inventory-catalog-US72-TC2-2: Manifest import creates drafts only

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published product schema exists for the selected existing IP, Item, and Category tuple.

**Test data:**

| Field | Value |
| --- | --- |
| `<schema manifest>` | Valid attribute definitions from the shared card template |
| `<source classification key>` | A sufficiently specific key, such as Category `TCG` plus Set `Pokémon`, mapped to the selected tuple |

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Upload `<schema manifest>` and map `<source classification key>` to the existing tuple.
3. Review the preview and import the manifest.
4. Read the schema revisions and active schema.

**Expected Results:**

* The imported schema revision is a draft.
* The current published schema remains active.
* The imported revision is not published until the admin uses the publish flow.

### grade10-admin-inventory-catalog-US72-TC3-2: Invalid manifest leaves schemas unchanged

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* One broad Category-only mapping is ambiguous because its rows target multiple tuples.

**Test data:**

| Field | Value |
| --- | --- |
| `<schema manifest>` | One valid schema row and one row with an invalid attribute definition |
| `<source classification key>` | A broad `TCG` Category-only key that maps to multiple tuples |

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Upload `<schema manifest>` with the ambiguous Category-only key unmapped.
3. Review validation and attempt to import the manifest.
4. Read the affected schema revisions and published schemas.

**Expected Results:**

* Validation identifies the affected rows and reasons.
* No schema revision from the manifest is created.
* Existing published schemas remain active.

### grade10-admin-inventory-catalog-US72-TC4-2: Product upload separates products from stock

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
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published product schema exists for the mapped tuple.

**Test data:**

| Field | Value |
| --- | --- |
| `<product workbook>` | Two sheets with repeated identical product rows and one different identity |
| `<source classification mapping>` | Category plus a distinguishing source field mapped to one existing IP, Item, and Category tuple |

**Steps:**

1. Navigate to <inventory products url>.
2. Upload `<product workbook>` and apply `<source classification mapping>`.
3. Review the product matches and row validation.
4. Confirm the product upload and read the created draft products.
5. Mark each valid imported draft `created` through the existing product status flow.
6. Read the product status and inventories.

**Expected Results:**

* Each distinct product name, exact tuple, and schema-value set has one product.
* Repeated identical rows resolve to one product.
* Newly created products use draft status until the admin marks each valid product `created`.
* No inventory quantity, unit record, or Cert ID is created.

### grade10-admin-inventory-catalog-US72-TC5-2: Incomplete product rows block every create

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
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published product schema exists for one target tuple.

**Test data:**

| Field | Value |
| --- | --- |
| `<product workbook>` | One valid row and one row with a missing required value or invalid value |
| `<source classification mapping>` | A broad `TCG` Category-only key with no tuple mapping |

**Steps:**

1. Navigate to <inventory products url>.
2. Upload `<product workbook>` without applying `<source classification mapping>`.
3. Review row validation and attempt to commit.
4. Read the product list.

**Expected Results:**

* Validation identifies the unmapped label and invalid product row.
* No product from the upload is created or changed.

### grade10-admin-inventory-catalog-US72-TC6-2: Same product name keeps distinct card identities

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
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published card schema exists for the mapped tuple.
* No product matches the uploaded rows' schema values.

**Test data:**

| Field | Value |
| --- | --- |
| `<product rows>` | Same Item display name and exact tuple; one pair differs by Card Number, and another pair differs by Set |
| `<source classification mapping>` | Category plus a distinguishing source field mapped to one existing IP, Item, and Category tuple |

**Steps:**

1. Navigate to <inventory products url>.
2. Upload `<product rows>` and apply `<source classification mapping>`.
3. Review the product matches and confirm the upload.
4. Read the created products and their schema values.

**Expected Results:**

* Products with the same display name and tuple but different Card Number or Set remain separate.
* Each distinct schema-value set creates one draft product.
* Product name alone neither merges rows nor blocks the upload.
* No inventory quantity, unit record, or Cert ID is created.

---

### grade10-admin-inventory-catalog-US72-TC7-1: Mapped values trim and omit blank placeholders

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published card schema exists for the mapped tuple.

**Test data:**

| Field | Value |
| --- | --- |
| `<product workbook>` | One row with padded Year, Set, and Subject values, optional Card Number `-`, and blank Variety; a second row with required Set `-` |
| `<source classification mapping>` | A sufficiently specific key mapped to one existing IP, Item, and Category tuple |

**Steps:**

1. Navigate to <inventory products url>.
2. Upload `<product workbook>` and apply `<source classification mapping>`.
3. Review the normalized preview and source workbook.

**Expected Results:**

* Surrounding whitespace is removed from the mapped Year, Set, and Subject values.
* Blank and standalone `-` optional values are shown as absent; the required Set `-` is reported as missing.
* The upload is not committed while the required value is missing.
* The uploaded workbook remains unchanged.

## grade10-admin-inventory-catalog-US73: Operator bulk imports matched inventory units

**As an** inventory admin,
**I want** to upload physical copy rows against existing products,
**so that** inventory counts and copy-level facts are recorded together after I review the matches.

### grade10-admin-inventory-catalog-US73-TC1-2: Inventory preview shows matched copy facts

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Each uploaded row matches one existing `created` product.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One row per physical copy with Cert ID, Grade Issuer, Grade, Autograph Grade, and Serial columns |
| `<source classification mapping>` | Each sufficiently specific source key maps to one existing IP, Item, and Category tuple |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and apply `<source classification mapping>`.
3. Review the resolved products and copy-level facts.
4. Confirm the upload and read inventory counts, unit records, and history.

**Expected Results:**

* Each row resolves to one existing product and one physical unit.
* Cert ID, Grade Issuer, Grade, Autograph Grade, and Serial are stored on the unit.
* Inventory counts increase by the number of included rows.
* The batch's inventory changes and history are committed together.

### grade10-admin-inventory-catalog-US73-TC2-2: Blank status choices apply per row

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Created products match both blank-status rows.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | Two blank Item Status rows: one `RAW` row without Cert ID and one graded row with Cert ID |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and try to continue without choosing how to handle blank Item Status rows.
3. Choose to include the RAW row and exclude the graded row.
4. Confirm the import and read inventory counts and unit records.

**Expected Results:**

* Grade10 requires a separate include or exclude choice for each blank-status row; there is no batch-wide default.
* The included RAW unit is accepted without Cert ID.
* The excluded graded unit adds no unit or stock.

### grade10-admin-inventory-catalog-US73-TC3-2: Unmatched products block inventory import

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* The product catalogue has no match for one uploaded row and multiple matches for another.

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload rows for the unmatched and ambiguous products.
3. Review matches and attempt to commit the batch.
4. Read inventory counts, unit records, and history.

**Expected Results:**

* Validation identifies both the unmatched and ambiguous rows.
* No inventory, unit, or history change from the upload is committed.

### grade10-admin-inventory-catalog-US73-TC4-1: Duplicate Cert IDs block every unit

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A created product inventory already owns Cert ID `PSA-123`.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One valid row and one row with Cert ID ` PSA-123 ` |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>`.
3. Review validation and attempt to commit.
4. Read inventory counts, unit records, and history.

**Expected Results:**

* Grade10 trims surrounding whitespace and reports the duplicate Cert ID.
* The valid row is not committed with the duplicate row.
* Inventory counts, unit records, and history remain unchanged.

### grade10-admin-inventory-catalog-US73-TC5-1: Invalid inventory values block the batch

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A created product has the required card schema.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One valid row and one row whose Year value is not a number |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and apply a sufficiently specific source classification mapping.
3. Review validation and attempt to commit.
4. Read inventory counts, unit records, and history.

**Expected Results:**

* Validation identifies the invalid Year value.
* No row from the upload changes inventory counts, unit facts, or history.

### grade10-admin-inventory-catalog-US73-TC6-1: Inventory import normalizes copy facts

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A created product matches the uploaded `RAW` row.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One `RAW` row with blank Cert ID, Grade `-`, Autograph Grade `-`, and Serial `-` |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and review the copy facts.
3. Confirm the upload and inspect the unit record and source workbook.

**Expected Results:**

* Blank Cert ID remains absent for the `RAW` unit.
* Blank and standalone `-` optional copy facts are absent rather than stored as text.
* One unit is committed and the uploaded workbook remains unchanged.

### grade10-admin-inventory-catalog-US73-TC7-1: Cert ID requirements follow grading status

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
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Created products match both uploaded rows.

**Test data:**

| Field | Value |
| --- | --- |
| `<inventory workbook>` | One `RAW` row with Cert ID `RAW-001` and one graded row with issuer `PSA` and no Cert ID |

**Steps:**

1. Navigate to <inventory bulk upload url>.
2. Upload `<inventory workbook>` and review row validation.
3. Attempt to confirm the upload and inspect inventory counts, unit records, and history.

**Expected Results:**

* Validation rejects the RAW row because it has a Cert ID.
* Validation rejects the graded row because it has no Cert ID.
* Neither row changes inventory counts, unit facts, or history.
