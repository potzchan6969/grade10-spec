# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review · 0/16
**Drafts styled:** 2026-10-14, tcs-rules r5
**Out of suite:** grade10-admin-inventory-catalog-SC-205 - the product service's update test, task 3.1 in `tasks.md`, and the editor test of task 5.1, because the editor names every translation it holds and the console has no route that omits them; grade10-admin-inventory-catalog-SC-206 - the product service's write test, task 3.1, which reads the grade, set and Cert ID before and after a translation write; grade10-admin-inventory-catalog-SC-217 - the product service's write test, task 3.1, added after the blind pass; grade10-admin-inventory-catalog-SC-215 and grade10-admin-inventory-catalog-SC-216 - the Details and search tests of tasks 5.1 and 3.2, kept as already folded; grade10-admin-inventory-catalog-SC-218 - the Details section test of task 5.1, added after the blind pass

## g10adm.inventory-catalog.US75: Inventory admin writes a product's name and description in each language

**As an** inventory admin,
**I want** to enter a product's name and description in Traditional and Simplified Chinese beside the English,
**so that** the product reads in the collector's language wherever it is shown.

<!-- trace:case id=g10adm.inventory-catalog.TC-pdl rev=1 covers=g10adm.inventory-catalog.SC-99k -->
### g10adm.inventory-catalog.US75-TC1: Inventory admin writes all three languages on a product and reads them back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_1>` is a product with an English name only.

**Test data:**

| Field | Value |
| --- | --- |
| product_1 | A product named `<english name>` with no description and no translations |
| english name | Charizard Holo |
| english description | Base Set holographic card. |
| traditional name | 噴火龍 閃卡 |
| traditional description | 基本系列閃卡。 |
| simplified name | 喷火龙 闪卡 |
| simplified description | 基本系列闪卡。 |

**Steps:**

1. Open the editor of `<product_1>`.
2. Enter `<english description>` as the English description.
3. Enter `<traditional name>` and `<traditional description>` as the Traditional Chinese name and description.
4. Enter `<simplified name>` and `<simplified description>` as the Simplified Chinese name and description.
5. Click Save.
6. Reload the editor of `<product_1>`.
7. Read the name and description of each language.

**Expected Results:**

* Step 5 saves the product.
* Step 7 shows the English name and description as entered.
* Step 7 shows the Traditional Chinese name and description as entered.
* Step 7 shows the Simplified Chinese name and description as entered.

<!-- trace:case id=g10adm.inventory-catalog.TC-6mu rev=1 covers=g10adm.inventory-catalog.SC-v1f -->
### g10adm.inventory-catalog.US75-TC2: English name alone is enough, and the English description may stay empty

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
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.

**Test data:**

| Field | Value |
| --- | --- |
| english name | Charizard Holo |

**Steps:**

1. Open the product editor to add a product.
2. Enter `<english name>` as the English name and nothing else in the texts.
3. Fill the other fields a product needs.
4. Click Save.
5. Reload the editor of the new product.
6. Read the name and description of each language.

**Expected Results:**

* Step 4 saves the product.
* Step 6 shows the English name as entered.
* Step 6 shows the English description empty.
* Step 6 shows the Traditional and Simplified Chinese name and description empty.

<!-- trace:case id=g10adm.inventory-catalog.TC-of2 rev=1 covers=g10adm.inventory-catalog.SC-ia2 -->
### g10adm.inventory-catalog.US75-TC3: A Chinese name does not stand in for the missing English name

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
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.

**Test data:**

| Field | Value |
| --- | --- |
| traditional name | 噴火龍 閃卡 |

**Steps:**

1. Open the product editor to add a product.
2. Leave the English name empty.
3. Enter `<traditional name>` as the Traditional Chinese name.
4. Fill the other fields a product needs.
5. Click Save.

**Expected Results:**

* Step 5 refuses the save and names the English name.
* No product is added.

<!-- trace:case id=g10adm.inventory-catalog.TC-xu1 rev=1 -->
### g10adm.inventory-catalog.US75-TC4: Translated name at the length limits is accepted

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_1>` is a product named `<english name>`.

**Test data:**

| Field | Value |
| --- | --- |
| english name | Charizard Holo |
| product_1 | A product named `<english name>` with no translations |

| language | name text |
| --- | --- |
| Traditional Chinese | 200 Chinese characters (the name limit) |
| Simplified Chinese | 1 Chinese character (the lower bound) |

**Steps:**

1. Open the editor of `<product_1>`.
2. Enter `<name text>` as the `<language>` name.
3. Click Save.
4. Reload the editor of `<product_1>`.
5. Read the `<language>` name.

**Expected Results:**

* Step 3 saves the product.
* Step 5 shows `<name text>` with every character kept.

<!-- trace:case id=g10adm.inventory-catalog.TC-r0k rev=1 -->
### g10adm.inventory-catalog.US75-TC5: Translated name beyond the length limit is refused

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_1>` is a product named `<english name>` with no translations.

**Test data:**

| Field | Value |
| --- | --- |
| english name | Charizard Holo |
| product_1 | A product named `<english name>` with no translations |

| language | name text | why refused |
| --- | --- | --- |
| Traditional Chinese | 201 Chinese characters | One above the 200 limit |
| Simplified Chinese | 201 Chinese characters | One above the 200 limit |

**Steps:**

1. Open the editor of `<product_1>`.
2. Enter `<name text>` as the `<language>` name.
3. Click Save.
4. Reload the editor of `<product_1>`.
5. Read the `<language>` name.

**Expected Results:**

* Step 3 refuses the save and names the name field.
* Step 5 shows the `<language>` name empty.

<!-- trace:case id=g10adm.inventory-catalog.TC-piz rev=1 covers=g10adm.inventory-catalog.SC-v7f -->
### g10adm.inventory-catalog.US75-TC6: Blank translation counts as not written

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_2>` has a written Traditional Chinese name and description.

**Test data:**

| Field | Value |
| --- | --- |
| english name | Charizard Holo |
| english description | Base Set holographic card. |
| traditional name | 噴火龍 閃卡 |
| traditional description | 基本系列閃卡。 |
| product_2 | A product with `<english name>`, `<english description>`, `<traditional name>` and `<traditional description>` |

| field | input |
| --- | --- |
| Traditional Chinese name | Cleared to empty |
| Traditional Chinese name | 3 spaces |
| Traditional Chinese description | 3 spaces |

**Steps:**

1. Open the editor of `<product_2>`.
2. Set `<field>` to `<input>`.
3. Click Save.
4. Reload the editor of `<product_2>`.
5. Open the Details section on the product page and choose Traditional Chinese.

**Expected Results:**

* Step 3 saves the product.
* Step 5 shows the English text for `<field>`, marked as the fallback.
* Step 5 shows the other Traditional Chinese text as written, not marked.

<!-- trace:case id=g10adm.inventory-catalog.TC-8ef rev=1 -->
### g10adm.inventory-catalog.US75-TC7: Translations survive a catalogue upload that matches the product

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
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_2>` has all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| product_2 | A product named `<english name>` with all three languages written |
| product import file | A catalogue upload with one row matching `<product_2>` and no translated text |
| english name | Charizard Holo |
| english description | Base Set holographic card. |
| traditional name | 噴火龍 閃卡 |
| traditional description | 基本系列閃卡。 |
| simplified name | 喷火龙 闪卡 |
| simplified description | 基本系列闪卡。 |

**Steps:**

1. Upload `<product import file>`, whose one row has the English name, taxonomy and typed values of `<product_2>`.
2. Read the upload result.
3. Open the editor of `<product_2>`.
4. Read the name and description of each language.

**Expected Results:**

* Step 2 shows the row resolved to `<product_2>`, with no second product added.
* Step 4 shows every translation still as written.

<!-- trace:case id=g10adm.inventory-catalog.TC-d8p rev=1 -->
### g10adm.inventory-catalog.US75-TC8: Lists, history and holds keep the English name once translations exist

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
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_2>` has all three languages written, and holds stock for a listing.

**Test data:**

| Field | Value |
| --- | --- |
| product_2 | A product with all three languages written and a stock hold taken by a draft listing |
| english name | Charizard Holo |
| english description | Base Set holographic card. |
| traditional name | 噴火龍 閃卡 |
| traditional description | 基本系列閃卡。 |
| simplified name | 喷火龙 闪卡 |
| simplified description | 基本系列闪卡。 |

**Steps:**

1. Open the product list.
2. Read the row of `<product_2>`.
3. Open the stock history of `<product_2>`.
4. Read the entry that names the hold.

**Expected Results:**

* Step 2 reads `<english name>`.
* Step 4 names `<english name>`.
* Neither shows `<traditional name>` or `<simplified name>`.

---

## g10adm.inventory-catalog.US76: Inventory admin reads a product's texts in each language

**As an** inventory admin,
**I want** to switch the product page's Details section between languages and see which ones I have not written,
**so that** I can check each language and fill the gaps.

<!-- trace:case id=g10adm.inventory-catalog.TC-qkd rev=1 covers=g10adm.inventory-catalog.SC-4vd -->
### g10adm.inventory-catalog.US76-TC1: Details section switches name and description together and opens in English again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-76

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_2>` has all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| product_2 | A product with all three languages written |
| english name | Charizard Holo |
| english description | Base Set holographic card. |
| traditional name | 噴火龍 閃卡 |
| traditional description | 基本系列閃卡。 |
| simplified name | 喷火龙 闪卡 |
| simplified description | 基本系列闪卡。 |

**Steps:**

1. Open the product page of `<product_2>`.
2. Read the name and description in the Details section.
3. Choose Traditional Chinese in the Details section's language choice.
4. Read the name and description.
5. Choose Simplified Chinese.
6. Read the name and description.
7. Reload the product page.
8. Read the language the Details section shows.

**Expected Results:**

* Step 2 shows the English name and description, with no fallback mark.
* Step 4 shows the Traditional Chinese name and description together, with no fallback mark.
* Step 6 shows the Simplified Chinese name and description together, with no fallback mark.
* Step 8 shows the Details section in English again.

<!-- trace:case id=g10adm.inventory-catalog.TC-tb5 rev=1 covers=g10adm.inventory-catalog.SC-lj3 -->
### g10adm.inventory-catalog.US76-TC2: A language missing one text marks only that text as the fallback

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
* **Trace:** grade10-admin-inventory-catalog-US-76

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_3>` has a Traditional Chinese name and no Traditional Chinese description.

**Test data:**

| Field | Value |
| --- | --- |
| product_3 | A product with `<english name>`, `<english description>` and `<traditional name>`; no Traditional Chinese description |
| english name | Charizard Holo |
| english description | Base Set holographic card. |
| traditional name | 噴火龍 閃卡 |
| traditional description | 基本系列閃卡。 |

**Steps:**

1. Open the product page of `<product_3>`.
2. Choose Traditional Chinese in the Details section's language choice.
3. Read the name.
4. Read the description.

**Expected Results:**

* Step 3 shows `<traditional name>`, not marked as the fallback.
* Step 4 shows `<english description>`, marked as the fallback.

<!-- trace:case id=g10adm.inventory-catalog.TC-bbu rev=1 -->
### g10adm.inventory-catalog.US76-TC3: A product with no translations reads English in each Chinese choice

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
* **Trace:** grade10-admin-inventory-catalog-US-76

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_4>` is a product created before translations existed, with an English name and description only.

**Test data:**

| Field | Value |
| --- | --- |
| product_4 | A product with `<english name>` and `<english description>` only |
| english name | Charizard Holo |
| english description | Base Set holographic card. |

**Steps:**

1. Open the product page of `<product_4>`.
2. Choose Traditional Chinese in the Details section's language choice.
3. Read the name and description.
4. Choose Simplified Chinese.
5. Read the name and description.
6. Choose English.
7. Read the name and description.

**Expected Results:**

* Step 3 shows `<english name>` and `<english description>`, both marked as the fallback.
* Step 5 shows `<english name>` and `<english description>`, both marked as the fallback.
* Step 7 shows the same two texts, not marked.

<!-- trace:case id=g10adm.inventory-catalog.TC-rfp rev=1 covers=g10adm.inventory-catalog.SC-70a -->
### g10adm.inventory-catalog.US76-TC4: Traditional Chinese text is never shown as the Simplified Chinese fallback

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
* **Trace:** grade10-admin-inventory-catalog-US-76

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_3>` has Traditional Chinese text and no Simplified Chinese text.

**Test data:**

| Field | Value |
| --- | --- |
| product_3 | A product with `<english name>`, `<english description>`, `<traditional name>` and `<traditional description>`; no Simplified Chinese text |
| english name | Charizard Holo |
| english description | Base Set holographic card. |
| traditional name | 噴火龍 閃卡 |
| traditional description | 基本系列閃卡。 |

**Steps:**

1. Open the product page of `<product_3>`.
2. Choose Simplified Chinese in the Details section's language choice.
3. Read the name and description.

**Expected Results:**

* Step 3 shows `<english name>` and `<english description>`, both marked as the fallback.
* Step 3 shows no Traditional Chinese character.

---

## g10adm.inventory-catalog.US77: Inventory admin finds a product by a translated name

**As an** inventory admin,
**I want** the product search to match a name in any language,
**so that** I find the product from whichever name a colleague quotes.

<!-- trace:case id=g10adm.inventory-catalog.TC-29r rev=1 covers=g10adm.inventory-catalog.SC-j29,g10adm.inventory-catalog.SC-7lv -->
### g10adm.inventory-catalog.US77-TC1: Product search finds a product by a part of its name in any language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-77

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_5>` has an English, a Traditional Chinese and a Simplified Chinese name, and no other product's names contain the fragment.

**Test data:**

| Field | Value |
| --- | --- |
| product_5 | A product with English name `Charizard Holo`, Traditional Chinese name `噴火龍 Pokémon 閃卡` and Simplified Chinese name `喷火龙 闪卡` |

| language typed | fragment | why this row |
| --- | --- | --- |
| English | harizard | Part of an English name |
| Traditional Chinese | 噴火龍 | Part of a Traditional Chinese name |
| Simplified Chinese | 喷火龙 | Part of a Simplified Chinese name |
| Latin letters in a translated name | pokémon (lower case) | Matches any case |

**Steps:**

1. Type `<fragment>` in the product search.
2. Read the rows.

**Expected Results:**

* Step 2 lists `<product_5>` once.
* Step 2 shows its row under the English name.

<!-- trace:case id=g10adm.inventory-catalog.TC-b4r rev=1 -->
### g10adm.inventory-catalog.US77-TC2: A product matching in two languages is listed once

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
* **Trace:** grade10-admin-inventory-catalog-US-77

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_6>` has English name `Charizard Holo` and Traditional Chinese name `Charizard 噴火龍`.

**Test data:**

| Field | Value |
| --- | --- |
| product_6 | A product whose English and Traditional Chinese names both contain `Charizard` |

**Steps:**

1. Type `Charizard` in the product search.
2. Read the rows.

**Expected Results:**

* Step 2 lists `<product_6>` exactly once.

<!-- trace:case id=g10adm.inventory-catalog.TC-s9o rev=1 -->
### g10adm.inventory-catalog.US77-TC3: Product search does not fold Traditional and Simplified Chinese

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
* **Trace:** grade10-admin-inventory-catalog-US-77

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_7>` has a Traditional Chinese name and no Simplified Chinese name.

**Test data:**

| Field | Value |
| --- | --- |
| product_7 | A product with English name `<english name>` and Traditional Chinese name `<traditional name>`; no Simplified Chinese name |
| english name | Charizard Holo |
| traditional name | 噴火龍 閃卡 |
| traditional fragment | 噴火龍 |
| simplified fragment | 喷火龙 |

**Steps:**

1. Type `<simplified fragment>` in the product search.
2. Read the rows.
3. Type `<traditional fragment>` in the product search.
4. Read the rows.

**Expected Results:**

* Step 2 does not list `<product_7>`.
* Step 4 lists `<product_7>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-idw rev=1 -->
### g10adm.inventory-catalog.US77-TC4: Editing or clearing a translated name moves what the search finds

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
* **Trace:** grade10-admin-inventory-catalog-US-77

**Pre-conditions:**

* admin(inventory admin) is on `<grade10 admin inventory products url>`.
* `<product_8>` has Traditional Chinese name `<traditional name>`.

**Test data:**

| Field | Value |
| --- | --- |
| product_8 | A product with English name `<english name>` and Traditional Chinese name `<traditional name>` |
| english name | Charizard Holo |
| traditional name | 噴火龍 初版 |
| new traditional name | 水箭龜 初版 |
| old fragment | 噴火龍 |
| new fragment | 水箭龜 |

**Steps:**

1. Replace the Traditional Chinese name of `<product_8>` with `<new traditional name>` and click Save.
2. Type `<old fragment>` in the product search and read the rows.
3. Type `<new fragment>` in the product search and read the rows.
4. Clear the Traditional Chinese name of `<product_8>` and click Save.
5. Type `<new fragment>` in the product search and read the rows.

**Expected Results:**

* Step 2 does not list `<product_8>`.
* Step 3 lists `<product_8>`.
* Step 5 does not list `<product_8>`.

---

## Reconciliation

**Run:** 2026-10-14, QA2 in a fresh context, after QA1's blind pass (16 draft cases from the frozen anchors, `proposal.md` and `decisions.md`) and Dev's independent delta. It read this suite, the delta's `spec.md` and `user-journeys.md`, `decisions.md` with `## Raised`, `tech-design.md`, `tasks.md`, the [Products and Stock](/p/grade10-admin/inventory/catalog#product-identity) page, and the shipped code in grade10 (`productService.ts`, `repositories/products.ts`, `contracts/src/admin.ts`, `packages/utils/src/schema.ts`, the Auction `productSearch` procedure). No case was written or reworded from a scenario, and every case stays `draft`. QA1's own bundle line is not in the draft; the planning run adds it.

- **Linked** - `g10adm.inventory-catalog.US75-TC1` asserts `grade10-admin-inventory-catalog-SC-200`; `US75-TC2` asserts `grade10-admin-inventory-catalog-SC-201`; `US75-TC3` asserts `grade10-admin-inventory-catalog-SC-202`; `US75-TC6` asserts `grade10-admin-inventory-catalog-SC-204`; `US76-TC1` asserts `grade10-admin-inventory-catalog-SC-207`; `US76-TC2` asserts `grade10-admin-inventory-catalog-SC-208`; `US76-TC4` asserts `grade10-admin-inventory-catalog-SC-209`; `US77-TC1` asserts `grade10-admin-inventory-catalog-SC-212` and `grade10-admin-inventory-catalog-SC-213`, one row each, on one route and one fixture
- **Jointly asserted, not linked** - `grade10-admin-inventory-catalog-SC-203` is split between `US75-TC4` (a name at 200 and at 1 accepted) and `US75-TC5` (201 refused). No single case asserts it
- **Partly asserted, not linked** - `grade10-admin-inventory-catalog-SC-210` by `US75-TC8`: the list and the history entry that names the hold are read, and the holds view is not. `grade10-admin-inventory-catalog-SC-211` by `US75-TC7`: the matching row leaves translations alone, and the second clause, that a product the upload creates has none, is unread. `grade10-admin-inventory-catalog-SC-214` by `US77-TC3`: the unfolded scripts are asserted, and no case searches a description fragment
- **Out of suite** - `grade10-admin-inventory-catalog-SC-205` and `grade10-admin-inventory-catalog-SC-206`: the editor names every translation it holds and the console has no route that omits them, and the grade, set and Cert ID are read before and after in the service test; tasks 3.1 and 5.1 are the verifiers
- **Carried** - `grade10-admin-inventory-catalog-SC-13` and `grade10-admin-inventory-catalog-SC-57` are unchanged scenarios; the durable suite holds their cases
- **Cases with no scenario** - `US76-TC3` (an untranslated product in each Chinese choice): the requirement's per-text fallback states it; fold one scenario or keep the case on the requirement. `US77-TC2` (matching in two languages is listed once) and `US77-TC4` (an edit or a clear moves what the search finds): real and unstated, and `tech-design.md` D8 makes a repeat structurally impossible; fold the second, and keep or drop the first
- **Over-claimed** - none. `US75-TC2` expects an empty English description, and the requirement states it
- **Contradicted** - none between a case and a scenario. Between artifacts: `tech-design.md` D3 says the wire checks the product name limit on the raw string before the trim, while the shipped name codec is `label`, which trims and then counts (`packages/utils/src/schema.ts`), so the English name counts after trimming today and a translated name that reuses it would too; the spec says only "a name is trimmed on save". `tech-design.md` D9, task 3.4 and the Raised row call Auction's `productSearch` "collector-facing": it is a `publicProcedure` (`packages/grade10-auction/backend/src/trpc/routers/public.ts`) that returns the English `products.name`, no frontend in grade10 calls it, and no decision settles it. Decision 29 names "the inventory product search", which is `matching` behind the admin list's `q`; decision 30 (only name and description translate) does not reach it. Leaving it on the English name is the safe reading, because a hit on a translated name it does not show would be unexplained, and it matches the Follow-on that the store pages come later; the wording and the follow-on line belong to Dev and the human (Raised, below)
- **Raised, settled** - every row this pass raised is landed in `decisions.md` (Q7 to Q40, the human's defaults); the open PM confirmations are Q43 and Q49 in `decisions.md`; no case waits on a row
- **Anchors** - `grade10-admin-inventory-catalog-US-75`, `grade10-admin-inventory-catalog-US-76` and `grade10-admin-inventory-catalog-US-77` each hold cases. The context journey `grade10-admin-inventory-catalog-US-06` holds none here; the durable suite keeps its cases
- **Levels** - `grade10-admin/inventory` has no domain suite, and the change touches one capability in it, so there is no domain impact; `grade10-admin/product-tcs.md` traces `grade10-admin-inventory-catalog-US-12` and `grade10-admin-inventory-catalog-US-13`, which this change leaves alone
- **After the human's reply (2026-10-14)** - Dev folded `US76-TC3` as `grade10-admin-inventory-catalog-SC-215` and `US77-TC4` as `grade10-admin-inventory-catalog-SC-216`; `US77-TC2` is dropped as a guard D8 makes structural. The description half of `grade10-admin-inventory-catalog-SC-214` is verified by task 3.2. Rows settled in `decisions.md` 36 to 40
