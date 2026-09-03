# grade10-admin/inventory/card-price-reference Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-03, tcs-rules r1

## grade10-admin-inventory-card-price-reference-US1: Inventory admin classifies a card product

**As an** inventory admin,
**I want** to create or edit a collectible-card product with its required tags
and a confirmed PriceCharting match,
**so that** the catalogue identifies the card consistently and can retrieve the
right price reference.

### grade10-admin-inventory-card-price-reference-US1-TC1-1: Create a classified collectible card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-01

**Pre-conditions:**
An inventory admin can access <grade10 admin inventory product URL>.

**Test data:**

| Field | Value |
| --- | --- |
| Collectible type | Collectible Cards |
| IP tag | Pokémon |
| Item tag | Graded card |
| Category tag | Anime |

**Steps:**

1. Navigate to <grade10 admin inventory product URL>.
2. Start creating a product.
3. Enter the collectible type and three required tags.
4. Save the product.

**Expected Results:**

* The product is created with Collectible Cards as its type.
* The product shows the IP, Item, and Category tags.

### grade10-admin-inventory-card-price-reference-US1-TC2-2: Refuse incomplete card taxonomy

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-01

**Pre-conditions:**
An existing classified card product is open in <grade10 admin inventory product URL>.

**Steps:**

1. Remove the product's Category tag.
2. Save the product.

**Expected Results:**

* The product update is refused for its missing controlled role.
* The product retains its prior classification.

### grade10-admin-inventory-card-price-reference-US1-TC3-1: Reuse an inline matching tag

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-01

**Pre-conditions:**
The inventory catalogue already has the IP tag `Pokémon`.

**Test data:**

| Field | Value |
| --- | --- |
| Inline IP label | pokemon |

**Steps:**

1. Navigate to <grade10 admin inventory product URL>.
2. Start creating a Collectible Cards product.
3. Supply `pokemon` as the inline IP tag.
4. Supply the required Item and Category tags.
5. Save the product.

**Expected Results:**

* The saved product shows the existing Pokémon IP tag.
* The catalogue has no second IP tag differing only by letter case.

### grade10-admin-inventory-card-price-reference-US1-TC4-1: Confirm a PriceCharting card match

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-01

**Pre-conditions:**
A classified Collectible Cards product is open, and PriceCharting search has a
matching card result for <a valid PriceCharting card URL>.

**Steps:**

1. Paste <a valid PriceCharting card URL> into the provider link field.
2. Review the returned card candidates.
3. Select the matching card.
4. Confirm the selection.

**Expected Results:**

* The product shows its confirmed PriceCharting reference.
* Later price reads use the selected provider identity.

### grade10-admin-inventory-card-price-reference-US1-TC5-1: Refuse a non-card PriceCharting reference

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-01

**Pre-conditions:**
A future inventory type-vocabulary release has seeded a non-card product.

**Steps:**

1. Submit a PriceCharting reference for the non-card product.

**Expected Results:**

* The reference is refused.
* The product has no PriceCharting price request.

---

## grade10-admin-inventory-card-price-reference-US2: Inventory admin reads a current card reference

**As an** inventory admin,
**I want** to see the current PSA-focused PriceCharting reference and its
freshness,
**so that** I can use an attributable market signal without mistaking it for
permanent product value or PSA certification data.

### grade10-admin-inventory-card-price-reference-US2-TC1-1: Read a fresh PSA-focused reference

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-02

**Pre-conditions:**
A matched Collectible Cards product has a successful PriceCharting result less
than 24 hours old with an ungraded baseline and PSA-oriented values.

**Steps:**

1. Navigate to <grade10 admin inventory product URL>.
2. Open the matched product.
3. Inspect the current price reference.

**Expected Results:**

* The reference identifies PriceCharting and its successful update time.
* The ungraded baseline and supplied PSA-oriented grades show in USD.
* Missing grades show as unavailable rather than zero.

### grade10-admin-inventory-card-price-reference-US2-TC2-1: Refresh an expired regular cache

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-02

**Pre-conditions:**
A matched Collectible Cards product has a successful price result more than 24
hours old, and PriceCharting is configured to return a current result.

**Steps:**

1. Request the product's current price reference.

**Expected Results:**

* Grade10 requests a current provider result before answering.
* The returned reference replaces the expired values and is fresh.

### grade10-admin-inventory-card-price-reference-US2-TC3-1: Preserve stale prices after refresh failure

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-02

**Pre-conditions:**
A matched Collectible Cards product has cached values, and its eligible
PriceCharting refresh is configured to fail.

**Steps:**

1. Request the product's current price reference.

**Expected Results:**

* The prior values and their successful update time remain available.
* The reference is marked stale.

---

## grade10-admin-inventory-card-price-reference-US3: Inventory admin imports card products

**As an** inventory admin,
**I want** to preview and confirm a CSV of classified card products,
**so that** I can add a large collection without creating partial or
misidentified catalogue data.

### grade10-admin-inventory-card-price-reference-US3-TC1-1: Preview a valid card CSV

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-03

**Pre-conditions:**
PriceCharting search is configured to return one candidate for each row in
<a valid card import CSV>.

**Test data:**

| Field | Value |
| --- | --- |
| CSV | <a valid card import CSV> |
| Rows | 2 |
| Required columns | `name`, `ip_tag`, `item_tag`, `category_tag`, `pricecharting_url` |

**Steps:**

1. Navigate to <grade10 admin inventory products URL>.
2. Open the bulk card import control.
3. Upload <a valid card import CSV>.
4. Review the import preview.

**Expected Results:**

* Every row shows normalized IP, Item, and Category tags.
* Every row shows one PriceCharting candidate for confirmation.
* No imported product, inventory snapshot, or confirmed reference exists yet.

### grade10-admin-inventory-card-price-reference-US3-TC2-1: Block an invalid CSV row

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-03

**Pre-conditions:**
<an invalid card import CSV> contains a row with a missing required tag or an
unmatched PriceCharting link.

**Steps:**

1. Navigate to <grade10 admin inventory products URL>.
2. Open the bulk card import control.
3. Upload <an invalid card import CSV>.
4. Attempt to confirm the preview.

**Expected Results:**

* The invalid row and its reason are visible.
* The preview cannot be confirmed.
* No product from the CSV exists.

### grade10-admin-inventory-card-price-reference-US3-TC3-1: Confirm every imported card candidate

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-03

**Pre-conditions:**
A valid card import preview is open with a PriceCharting candidate for each row.

**Steps:**

1. Review the candidate for the first row.
2. Confirm the first row's candidate.
3. Confirm each remaining row's candidate.

**Expected Results:**

* The preview becomes ready for commit only after every candidate is confirmed.
* Each row retains its selected canonical link and provider identity.

### grade10-admin-inventory-card-price-reference-US3-TC4-1: Commit an entire reviewed import

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-03

**Pre-conditions:**
A ready import preview contains two valid, confirmed card rows.

**Steps:**

1. Commit the ready import.
2. Open the inventory products list.

**Expected Results:**

* Both imported products appear with their required tags.
* Each product has one empty inventory snapshot and a confirmed PriceCharting reference.

### grade10-admin-inventory-card-price-reference-US3-TC5-1: Roll back a conflicted import

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-card-price-reference-US-03

**Pre-conditions:**
A ready import preview contains two valid confirmed rows, and one provider
identity is claimed by another product before commit.

**Steps:**

1. Commit the ready import.

**Expected Results:**

* The import is refused for the conflicting provider identity.
* Neither previewed product is created.
