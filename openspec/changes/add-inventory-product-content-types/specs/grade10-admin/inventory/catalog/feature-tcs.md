# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-10, tcs-rules r3.0

## grade10-admin-inventory-catalog-US5: Inventory admin configures a localized product schema

**As an** inventory admin,
**I want** to define reusable fields and assign them to an exact IP, Item, and Category,
**so that** each product type has clear labels, structured values, and rules.

### grade10-admin-inventory-catalog-US5-TC1-1: Localized attribute configures a Pokémon product schema

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
* **Trace:** grade10-admin-inventory-catalog-US-05

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* The IP, Item, and Category tags for <pokemon tuple> exist.

**Test data:**

| Field | Value |
| --- | --- |
| `<pokemon tuple>` | Pokémon · Single card · TCG |
| `<card number field>` | `card_number`, text, configured pattern, labels in `en`, `zh-Hant`, and `zh-Hans` |

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Define <card number field>.
3. Create a product schema for <pokemon tuple>.
4. Assign <card number field> with its displayed label.
5. Review the configured product schema.

**Expected Results:**

* One reusable field keeps the stable key `card_number`.
* Each supplied locale shows its own displayed label.
* The Pokémon product schema selects the exact three tags and its assigned attribute has a label separate from the key.

### grade10-admin-inventory-catalog-US5-TC2-1: Invalid field configuration and duplicate publish are refused

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
* **Trace:** grade10-admin-inventory-catalog-US-05

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published product schema already exists for <pokemon tuple>.

**Test data:**

| Field | Value |
| --- | --- |
| `<pokemon tuple>` | Pokémon · Single card · TCG |
| `<invalid field>` | A select field with no English displayed value for one option |

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Try to save <invalid field>.
3. Create another configuration for <pokemon tuple>.
4. Try to publish that configuration.

**Expected Results:**

* The invalid field is refused and is unavailable for product entry.
* The second configuration is not published.
* The existing published configuration remains active.

---

## grade10-admin-inventory-catalog-US6: Inventory admin enters a validated product

**As an** inventory admin,
**I want** to save localized structured values and complete a product only when they are valid,
**so that** Auction receives products with trustworthy facts.

### grade10-admin-inventory-catalog-US6-TC1-1: Valid localized values create a product

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
* **Trace:** grade10-admin-inventory-catalog-US-06

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published product schema for <pokemon tuple> requires language, card number, card set, and grading.
* A draft <pokemon product> has the <pokemon tuple> classification.

**Test data:**

| Field | Value |
| --- | --- |
| `<pokemon tuple>` | Pokémon · Single card · TCG |
| `<pokemon product>` | A draft Pokémon single card |
| `<localized values>` | Valid English, Traditional Chinese, and Simplified Chinese text values where translations are supplied |

**Steps:**

1. Navigate to <inventory product url> for <pokemon product>.
2. Enter <localized values> for the assigned fields.
3. Save the product.
4. Mark the product created.
5. Read the product in each supported locale.

**Expected Results:**

* Values are stored under their stable field keys.
* Each read shows the locale's displayed label and supplied value.
* The product becomes `created` and its updated time advances.

### grade10-admin-inventory-catalog-US6-TC2-1: Incomplete or invalid content keeps a product draft

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
* **Trace:** grade10-admin-inventory-catalog-US-06

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* <pattern product> has a published product schema with a card-number pattern and a required grading attribute.
* <unmatched product> has a complete universal classification with no matching published product schema.

**Test data:**

| Field | Value |
| --- | --- |
| `<invalid card number>` | A value that fails the configured card-number pattern |
| `<pattern product>` | A draft product without grading |
| `<unmatched product>` | A draft product without a matching published product schema |

**Steps:**

1. Navigate to <inventory product url> for <pattern product>.
2. Try to replace its card number with <invalid card number>.
3. Try to mark <pattern product> created.
4. Navigate to <inventory product url> for <unmatched product>.
5. Try to mark <unmatched product> created.

**Expected Results:**

* The invalid update is refused and the prior structured values remain unchanged.
* <pattern product> remains `draft` and reports grading as missing.
* <unmatched product> remains `draft` and cannot be listed or reserved by Auction.

### grade10-admin-inventory-catalog-US6-TC3-1: Optional value and missing translation remain usable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-06

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* A published Pokémon product schema makes PSA population optional.
* <translated product> has valid required values, an English grading value, and no Simplified Chinese grading translation.

**Steps:**

1. Navigate to <inventory product url> for <translated product>.
2. Leave PSA population empty.
3. Mark the product created.
4. Open <translated product> in Auction with Simplified Chinese active.

**Expected Results:**

* The product becomes `created` without a PSA population value.
* PSA population remains absent.
* Auction displays the English grading value without showing a stable key or translation key.

---

## grade10-admin-inventory-catalog-US7: Collector finds and reads a card through Auction fields

**As a** collector,
**I want** to search, filter, and read card facts in my active locale,
**so that** I can find the right product and understand its identifying details.

### grade10-admin-inventory-catalog-US7-TC1-1: Universal and structured filters match stable values

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
* **Trace:** grade10-admin-inventory-catalog-US-07

**Pre-conditions:**

* Auction has created products with different IP, Category, language, and grading values.
* The active locale has translations for the selected filters.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Filter by an IP tag.
3. Add a content-field filter.
4. Inspect the results and filter controls.

**Expected Results:**

* Results match the selected stable tag and field values.
* Filter labels and values use the active locale.
* Products with other matching dimensions are not returned.

### grade10-admin-inventory-catalog-US7-TC2-1: Optional and listing attributes follow their different rules

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
* **Trace:** grade10-admin-inventory-catalog-US-07

**Pre-conditions:**

* One Auction product has a PSA population value and another does not.
* The Auction listing has a vaulted listing attribute with a stored value.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Filter by PSA population.
3. Remove the PSA population filter.
4. Open the search and filter controls.
5. Open the product listing.

**Expected Results:**

* The PSA population filter returns only the product with that value.
* Both products remain available when the filter is removed.
* Vaulted is absent from the controls and remains available on the listing.

### grade10-admin-inventory-catalog-US7-TC3-1: Auction fields vary by product schema and locale

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
* **Trace:** grade10-admin-inventory-catalog-US-07

**Pre-conditions:**

* Pokémon and One Piece product schemas configure different Auction field selections.
* A One Piece listing has Traditional Chinese labels and values for language and card number.

**Steps:**

1. Open the Pokémon listing in Auction.
2. Open the One Piece listing in Auction with Traditional Chinese active.
3. Inspect the configured product fields.

**Expected Results:**

* The Pokémon listing omits grading.
* The One Piece listing shows card number and character.
* The One Piece fields appear in configured order with Traditional Chinese copy or English fallback.

### grade10-admin-inventory-catalog-US7-TC4-1: Listing PSA cert numbers stay separate from product facts

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
* **Trace:** grade10-admin-inventory-catalog-US-07

**Pre-conditions:**

* Two Auction listings use the same Pokémon product.
* The Pokémon product schema defines PSA cert number as a listing attribute.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing A cert>` | `0001234567` |
| `<listing B cert>` | `0007654321` |

**Steps:**

1. Enter <listing A cert> on the first Auction listing.
2. Enter <listing B cert> on the second Auction listing.
3. Open both listings.
4. Open Auction search and filter controls.

**Expected Results:**

* Each listing displays its own PSA cert number.
* The shared product's grading and product attributes remain unchanged.
* PSA cert number is absent from Auction search and filter controls.

---

## grade10-admin-inventory-catalog-US8: Inventory admin publishes a safe product-schema configuration

**As an** inventory admin,
**I want** to review the impact of a product-schema change before publishing it,
**so that** the active Auction catalogue never knowingly uses invalid product data.

### grade10-admin-inventory-catalog-US8-TC1-1: Valid configuration publishes with translation warnings

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
* **Trace:** grade10-admin-inventory-catalog-US-08

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* Every product matching <pokemon tuple> has valid required values.
* The draft configuration lacks a Simplified Chinese label and has optional fields without values.

**Test data:**

| Field | Value |
| --- | --- |
| `<pokemon tuple>` | Pokémon · Single card · TCG |

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Open the draft configuration for <pokemon tuple>.
3. Review the publication report.
4. Publish the configuration.
5. Read an Auction listing using <pokemon tuple>.

**Expected Results:**

* The report identifies the missing Simplified Chinese translation.
* Publishing succeeds despite the warning and absent optional values.
* Fields, filters, and Auction presentation take effect together; missing Chinese copy uses English.

### grade10-admin-inventory-catalog-US8-TC2-1: Invalid and legacy products do not enter Auction

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
* **Trace:** grade10-admin-inventory-catalog-US-08

**Pre-conditions:**

* An admin holds the inventory catalogue grant.
* <invalid product> matches a draft product schema but lacks its newly required grading value.
* <legacy product> is `created`, visible in inventory, and has no matching published product schema.
* A previous published configuration exists for <invalid product>.

**Steps:**

1. Navigate to <inventory product schemas url>.
2. Try to publish the draft product schema for <invalid product>.
3. Open <legacy product> in inventory.
4. Try to list or reserve <legacy product> in Auction.

**Expected Results:**

* Publishing reports <invalid product> and its missing grading value.
* The previous published configuration remains active.
* <legacy product> remains visible in inventory and reports its missing product schema.
* Auction refuses to list or reserve <legacy product>.
