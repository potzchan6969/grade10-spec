# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-admin-inventory-catalog-US69: Operator records a received graded unit

**As an** inventory admin,
**I want** to record optional Cert IDs when I intake stock,
**so that** each numbered graded unit can be traced without preventing
unnumbered stock from entering inventory.

<!-- trace:case id=g10adm.inventory-catalog.TC-50a rev=1 covers=g10adm.inventory-catalog.SC-fq8,g10adm.inventory-catalog.SC-irv,g10adm.inventory-catalog.SC-a57,g10adm.inventory-catalog.SC-skp,g10adm.inventory-catalog.SC-ah9,g10adm.inventory-catalog.SC-0ac -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-gvc rev=1 covers=g10adm.inventory-catalog.SC-fq8,g10adm.inventory-catalog.SC-irv,g10adm.inventory-catalog.SC-a57,g10adm.inventory-catalog.SC-skp,g10adm.inventory-catalog.SC-ah9,g10adm.inventory-catalog.SC-0ac -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-tzz rev=1 covers=g10adm.inventory-catalog.SC-sls,g10adm.inventory-catalog.SC-ux1,g10adm.inventory-catalog.SC-q36,g10adm.inventory-catalog.SC-u9i,g10adm.inventory-catalog.SC-6vy,g10adm.inventory-catalog.SC-rn5 -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-peb rev=1 covers=g10adm.inventory-catalog.SC-sls,g10adm.inventory-catalog.SC-ux1,g10adm.inventory-catalog.SC-q36,g10adm.inventory-catalog.SC-u9i,g10adm.inventory-catalog.SC-6vy,g10adm.inventory-catalog.SC-rn5 -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-q7e rev=1 covers=g10adm.inventory-catalog.SC-bck,g10adm.inventory-catalog.SC-63a,g10adm.inventory-catalog.SC-ol8 -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-tq8 rev=1 covers=g10adm.inventory-catalog.SC-bck,g10adm.inventory-catalog.SC-63a,g10adm.inventory-catalog.SC-ol8 -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-lzo rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-7vt rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-01d rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-arw rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-ii9 rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-bdu rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-vud rev=1 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-4u2 rev=2 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-i75 rev=2 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-rr6 rev=2 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-9ou rev=1 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-5r1 rev=1 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-4v4 rev=1 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
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

<!-- trace:case id=g10adm.inventory-catalog.TC-wz7 rev=1 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
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

## grade10-admin-inventory-catalog-US74: Inventory admin prepares reusable product media

**As an** inventory admin,
**I want** to attach, order, replace, and remove photographs and video on a catalogue product,
**so that** Auction operators can begin a listing with prepared material.

### grade10-admin-inventory-catalog-US74-TC1-1: Product accepts an ordered reusable gallery

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
* **Trace:** grade10-admin-inventory-catalog-US-74

**Pre-conditions:**

* An admin(inventory admin) is editing a product with no media.

**Steps:**

1. Add supported assets, reorder them, and save the product.

**Expected Results:**

* The product retains the selected order and exposes the assets to Auction.

## grade10-admin-inventory-catalog-US9: Inventory admin sees unsold auction stock come back

**As an** inventory admin,
**I want** the stock of an auction that closed with no winner to show as available, with the hold closed and the listing named on the product page and in the history,
**so that** I can trust the count and see why it moved.

### grade10-admin-inventory-catalog-US9-TC1-2: Unsold close returns the hold and names the listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* admin(holds the inventory catalogue grant, no Auction grant) is on <inventory product url> of `<product_1>`.
* `<product_1>` has stored stock `<stock>` and no hold but `<listing_1>`'s.
* `<listing_1>` holds `<held quantity>` units and has just closed with no winner.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An Auction listing of `<product_1>`, code `<code_1>`, title `<title_1>`, quantity `<held quantity>`, no bids |
| `<stock>` | 10 units (any count of at least `<held quantity>`) |
| `<held quantity>` | 4 units (any quantity from 1 to 500; more than 1, so a rise of one unit is told apart) |
| `<available before>` | 6 units: `<stock>` minus `<held quantity>` |
| `<available after>` | 10 units: `<available before>` plus `<held quantity>` |
| `<close time>` | The date and time `<listing_1>`'s close passed |

**Steps:**

1. Read stock, reserved and available.
2. Read `<listing_1>`'s Auction hold.
3. Open the product history.
4. Read the newest entry.

**Expected Results:**

* Step 1: available reads `<available after>`, up by `<held quantity>`; reserved reads 0.
* Step 2: the hold reads closed and released, remaining 0.
* Step 2: the hold names `<code_1>` and `<title_1>`.
* Step 4: one release entry of `<held quantity>` units.
* Step 4: When reads the date and time, at `<close time>`.
* Step 4: it shows its action, quantity and an actor.
* Step 4: Holder reads `<code_1>` and `<title_1>`.
* Step 4: Remarks read `Released by unsold listing`.
* Step 4: no admin step appears between the close and the entry.

### grade10-admin-inventory-catalog-US9-TC2-2: Sold close moves the hold to sold, not available

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
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* admin(holds the inventory catalogue grant) is on <inventory product url> of `<product_2>`.
* `<product_2>` has stored stock `<stock>` and an Auction hold of `<held quantity>` for `<listing_2>`, which closed with a winner whose sale is recorded.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | An Auction listing of `<product_2>`, code `<code_2>`, title `<title_2>`, closed sold |
| `<stock>` | 10 units (any count of at least `<held quantity>`) |
| `<held quantity>` | 3 units (any quantity from 1 to 500) |
| `<expected available>` | 7 units: `<stock>` minus `<held quantity>`, unchanged by the close |

**Steps:**

1. Read stock, sold and available.
2. Read `<listing_2>`'s Auction hold.
3. Open the product history.
4. Read the entries for `<listing_2>`.

**Expected Results:**

* Step 1: available reads `<expected available>`; sold is up by `<held quantity>`.
* Step 2: the hold reads sold, not released.
* Step 4: the sale entry's Holder reads `<code_2>` and `<title_2>`.
* Step 4: no entry reads `Released by unsold listing`.

### grade10-admin-inventory-catalog-US9-TC3-2: Called-off release carries no remarks

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* admin(holds the inventory catalogue grant) is on <inventory product url> of `<product_3>`.
* `<product_3>` had an Auction hold of `<held quantity>` for `<listing_3>`, which an operator called off before its close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An Auction listing of `<product_3>`, code `<code_3>`, title `<title_3>`, called off |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |

**Steps:**

1. Read `<listing_3>`'s Auction hold.
2. Open the product history.
3. Read the release entries for `<listing_3>`.

**Expected Results:**

* Step 1: the hold reads released, remaining 0.
* Step 3: one release entry of `<held quantity>` units.
* Step 3: its Holder reads `<code_3>` and `<title_3>`.
* Step 3: its Remarks read `—`.

### grade10-admin-inventory-catalog-US9-TC4-2: Clean-up release reads as the clean-up's

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
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* Seeded before this change shipped: `<listing_4>`, `<listing_5>` and `<listing_6>` closed Unsold, each still holding its stock of its own product.
* `<product_7>`'s Auction hold belongs to `<listing_7>`, which is live.
* The one-time clean-up has not yet run.
* admin(holds the inventory catalogue grant) is signed in to the inventory console.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | Closed Unsold, code `<code_4>`, title `<title_4>`, holding 5 units of `<product_4>` |
| `<listing_5>` | Closed Unsold, code `<code_5>`, title `<title_5>`, holding 1 unit of `<product_5>` |
| `<listing_6>` | Closed Unsold, code `<code_6>`, title `<title_6>`, holding 2 units of `<product_6>` |
| `<listing_7>` | Published, its close still ahead, holding 1 unit of `<product_7>` |
| `<clean-up time>` | The date and time the clean-up runs |

**Steps:**

1. Run the one-off clean-up of held Unsold stock.
2. Navigate to <inventory product url> of `<product_4>`.
3. Read available and `<listing_4>`'s hold.
4. Open the product history.
5. Read the newest entry.
6. Repeat steps 2 to 5 for `<product_5>` and `<product_6>`.
7. Navigate to <inventory product url> of `<product_7>`.
8. Read `<listing_7>`'s hold.

**Expected Results:**

* Step 3: available rose by the listing's held units; the hold reads closed and released and names the listing's code and title.
* Step 5: one release entry of the held units, When at `<clean-up time>`.
* Step 5: Holder reads the listing's code and title.
* Step 5: Remarks read `Released by unsold listing (clean-up)`.
* Step 6 finds the same for `<listing_5>` and `<listing_6>`.
* Step 8: `<listing_7>`'s hold is unchanged, still active.

### grade10-admin-inventory-catalog-US9-TC5-1: Every history entry shows its holder and remarks

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
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* admin(holds the inventory catalogue grant) is on <inventory product url> of `<product_8>`.
* `<product_8>`'s history holds the row's entry.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | An Auction listing of `<product_8>`, code `<code_8>`, title `<title_8>` |
| `<admin reference>` | The holder reference an admin reserve on `<product_8>` minted |
| `<vault reference>` | The holder reference of a Vault hold on `<product_8>` |
| `<admin remarks>` | `Held for a trade show` (any remarks the admin typed) |

| Row | Entry | Holder | Remarks |
| --- | --- | --- | --- |
| Auction hold | `<listing_8>` reserves 1 unit | `Auction`, `<code_8>` and `<title_8>` | Not asserted |
| Admin hold | An admin reserves 1 unit, typing `<admin remarks>` | `Admin` and `<admin reference>` | `—` |
| Vault hold | Vault reserves 1 unit | `Vault` and `<vault reference>` | Not asserted |
| Product edit | An admin renames `<product_8>` | `—` | `—` |

**Steps:**

1. Open the product history.
2. Read the row's entry.

**Expected Results:**

* Step 2: When reads a date and a time.
* Step 2: the entry shows its action, quantity and actor.
* Step 2: Holder reads the row's holder.
* Step 2: Remarks read the row's remarks, where the row asserts them.

## Settled

- Product-gallery management uses existing inventory-admin authorization; unauthorized requests are refused.
- **Remarks on a reserve** - Remarks is the entry's own reason, so an admin hold's reserve entry reads `—` (Q17)
- **Holder kind** - read as Auction, Vault or Admin; the stored kind and reference are unchanged (Q16)

## Reconciliation

**Run:** Blind pass read the inventory outline, journey, decisions, and marked PRD; it was denied requirements and scenarios.

- **Raised, folded into spec:** CRUD, bounds, validation, reuse, and access for product assets are covered.

**Run:** QA2, 2026-09-30, after the anchors moved on Q10, Q13 and Q14. QA1's blind pass read the Feature set, the journeys, `decisions.md`, the proposal, the linked PRD sections, the durable suite and the domain suite with their Reconciliation stripped, and the two rulebooks; it was denied every `## Requirements` section, `openspec/specs/` beyond those, and the archive. QA2 read both suites, both deltas, `tech-design.md` and `tasks.md`. It is a statement, not proof.

- **Raised, folded into spec** - the holder label on each Auction write, as `grade10-admin-inventory-catalog-SC-140`; the Holder and Remarks columns, as `grade10-admin-inventory-catalog-SC-141`, `grade10-admin-inventory-catalog-SC-142` and `grade10-admin-inventory-catalog-SC-143`; the two remarks texts, as `grade10-admin-inventory-catalog-SC-136` and `grade10-admin-inventory-catalog-SC-137`
- **Raised, escalated** - whether Remarks shows an admin hold's typed remarks on its reserve entry (see Contradicted), and how the holder kind reads in the Holder column, landed as Q17 and Q16
- **Raised, rejected** - none this run
- **Joined** - `grade10-admin-inventory-catalog-SC-136`, `grade10-admin-inventory-catalog-SC-139` and `grade10-admin-inventory-catalog-SC-141` into `grade10-admin-inventory-catalog-US9-TC1-2`; `grade10-admin-inventory-catalog-SC-137` into `grade10-admin-inventory-catalog-US9-TC4-2`; `grade10-admin-inventory-catalog-SC-138` into `grade10-admin-inventory-catalog-US9-TC3-2`; `grade10-admin-inventory-catalog-SC-142` into `grade10-admin-inventory-catalog-US9-TC5-1` as its Product edit row, added by QA2; `grade10-admin-inventory-catalog-SC-143`'s history Holder into `grade10-admin-inventory-catalog-US9-TC5-1`'s Vault row
- **Out of suite** - `grade10-admin-inventory-catalog-SC-140`, a label replaced by a later write and kept by one that sends none: decided by the inventory service tests in grade10 (task 2.1); `grade10-admin-inventory-catalog-SC-143`'s Reference cell reading the holder reference: decided by the product page's component tests in grade10 (task 6.1)
- **Patched, not re-run** - `grade10-admin-inventory-catalog-US9-TC2-2` now records the sale, since a hold stays active after a winning close until the sale moves it to sold; `grade10-admin-inventory-catalog-US9-TC3-2` reads Remarks as `—`, the value the Remarks column shows for an entry with none; `grade10-admin-inventory-catalog-US9-TC4-2` says "before this change shipped" where it said "before the release". All keep `<v>`
- **Settled by the artifacts, not raised** - what Holder reads on an entry with no hold (`—`, the Holder column's rule); the When of a retried release (the successful release, since an entry's time is the server time of the mutation that succeeded)
- **Trimmed by the simpler reading** - cases that repeat another case or a durable rule
- **Contradicted** - `grade10-admin-inventory-catalog-US9-TC5-1`'s Admin hold row expects the admin's typed remarks in the reserve entry's Remarks; the Change history fields requirement makes Remarks the entry's reason, which is null on a reserve, so the column would read `—`. settled by Q17: Remarks is the entry's own reason, so the row now reads `—`
- **Uncovered anchors** - none: `grade10-admin-inventory-catalog-US-09` has five cases; the group anchor `Unsold auction stock` is walked by the same cases
