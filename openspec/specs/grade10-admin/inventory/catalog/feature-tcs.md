# grade10-admin/inventory/catalog Test Cases

**Status:** pending-review · 0/81
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* An inventory admin holds the inventory catalogue grant with write authority, unless a case says otherwise; a product's page is on Inventory, opening its history and View Cert IDs (Cert ID details). An Admin hold is reserved from the product page.
* Regular stock is stock with no Cert ID, read as the No Cert ID rows. A Cert record is one numbered unit. Amounts are HKD.

## g10adm.inventory-catalog.US1: Record received stock

**As an** inventory admin,
**I want** to create a product and intake quantity into its inventory,
**so that** the snapshot and derived lifetime ledger reflect what Grade10 accepted.

<!-- trace:case id=g10adm.inventory-catalog.TC-5kk rev=1 -->
### g10adm.inventory-catalog.US1-TC1: An inventory admin creates a product and intakes stock into its one inventory

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-01

**Pre-conditions:**

* An inventory admin opens Inventory, no product existing.

**Steps:**

1. Read the products table, and create a product named Card A.
2. Intake 2 units, then 3, on its page.
3. Return to the products list, and read Card A's row; open its history.

**Expected Results:**

* Step 1 shows the table's empty state, then lands on the new product's page in draft, its inventory empty.
* Step 2 rises stock to 2, then 5, in one inventory, the ledger with it; reserved, vaulted, sold and withdrawn stay 0.
* Step 3's row reads draft with every count; the history holds two intake entries of 2 and 3, each with its before and after.

<!-- trace:case id=g10adm.inventory-catalog.TC-5en rev=1 -->
### g10adm.inventory-catalog.US1-TC2: A product or an intake the rules forbid is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Product stock

**Pre-conditions:**

* An inventory admin is on Inventory; product 1, created, holds stock 2.

**Test data:**

| `<tried>` | `<refused>` |
| --- | --- |
| creating a product with an empty name | the create; no product or inventory added |
| intaking 0 units on product 1 | the intake; inventory and history unchanged |
| intaking 501 units on product 1 | the intake; inventory and history unchanged |
| setting product 1 back to draft | the change; it stays created |

**Steps:**

1. Try `<tried>`.

**Expected Results:**

* It refuses `<refused>`.

---

## g10adm.inventory-catalog.US2: Oversee holds and settle them from holder apps

**As an** inventory admin,
**I want** to see Auction and Vault holds with remaining quantity on the product page, reserve house stock under `admin` holds, release those admin holds when done, while adjust, release for Auction/Vault, sell-from-reservation, change-product, and vault-from-reservation run from the owning listing or Vault console,
**so that** house stock is not over-promised and settlement stays with the application that owns the hold.

<!-- trace:case id=g10adm.inventory-catalog.TC-nzk rev=1 -->
### g10adm.inventory-catalog.US2-TC1: The product page oversees every hold, and reserves and releases house stock under Admin

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-02

**Pre-conditions:**

* A created product holds stock 5 and an Auction hold for listing 1, labelled with its code and title, and a Vault hold under reference vault-7 with no label.

**Steps:**

1. Open the product page, and read the counts and the holds.
2. Reserve 2 under an Admin hold.
3. Release the Admin hold whole.

**Expected Results:**

* Step 1 reads every count; the holds list Auction with listing 1's label, Vault with vault-7, each with its remaining quantity, only Admin rows ever offering Release.
* Step 2 lists an active Admin hold of 2 under a minted reference, available falling by 2.
* Step 3 closes it, remaining 0, available back up by 2.

---

## g10adm.inventory-catalog.US3: Auction operator holds stock the vault cannot touch

**As an** auction operator reserving house stock against a listing,
**I want** to reserve, adjust, partially sell, and release only Auction's own hold, with the vault's holds on that product invisible to me and mine to it,
**so that** both draw on one product's stock without either spending what the other reserved. Auction sells; Vault vaults.

<!-- trace:case id=g10adm.inventory-catalog.TC-jxp rev=1 -->
### g10adm.inventory-catalog.US3-TC1: The listing's product choice offers only created products in stock, at their available count

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-03

**Pre-conditions:**

* A draft product with stock; a created product with stock 10 and 3 held; a created product with none available.

**Steps:**

1. In an Auction listing's editor, open the product choice.

**Expected Results:**

* It offers only the created product in stock, reading 7 available.

<!-- trace:case id=g10adm.inventory-catalog.TC-jdh rev=1 -->
### g10adm.inventory-catalog.US3-TC2: A listing asking more than is available reserves nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-03

**Pre-conditions:**

* A created product has 1 available; an auction operator edits a listing of it.

**Steps:**

1. Set the listing's quantity to 2, and save.
2. Read the product page.

**Expected Results:**

* Step 1 is refused for insufficient stock.
* Step 2 shows no new hold, count or history entry.

---
## g10adm.inventory-catalog.US4: Reconstruct stock changes

**As an** inventory admin,
**I want** every stock and reservation transition recorded,
**so that** I can explain how the latest snapshot was reached.

<!-- trace:case id=g10adm.inventory-catalog.TC-p4i rev=2 covers=g10adm.inventory-catalog.SC-l3a,g10adm.inventory-catalog.SC-y6f,g10adm.inventory-catalog.SC-1i4,g10adm.inventory-catalog.SC-k0a,g10adm.inventory-catalog.SC-vgc,g10adm.inventory-catalog.SC-cyf,g10adm.inventory-catalog.SC-ses,g10adm.inventory-catalog.SC-7oz,g10adm.inventory-catalog.SC-txu,g10adm.inventory-catalog.SC-pgg,g10adm.inventory-catalog.SC-6lr,g10adm.inventory-catalog.SC-pi4,g10adm.inventory-catalog.SC-tbn,g10adm.inventory-catalog.SC-6zh,g10adm.inventory-catalog.SC-k28,g10adm.inventory-catalog.SC-76r,g10adm.inventory-catalog.SC-z64,g10adm.inventory-catalog.SC-59i,g10adm.inventory-catalog.SC-kdh -->
### g10adm.inventory-catalog.US4-TC1: Cert ID changes leave the ledger totals unmoved, and the history names both Cert IDs

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-04

**Pre-conditions:**

* Product 1 holds PSA-10000001, an available Cert record no hold has ever named, and 3 units of available regular stock outside every hold.

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted and available.
2. Click View Cert IDs; change PSA-10000001 to PSA-10000002, and assign PSA-10000003 to one unit of the No Cert ID available row.
3. Close Cert ID details, read the figures again, and open the product history.

**Expected Results:**

* Every figure reads as in step 1.
* The history holds two new Cert ID change entries of one unit each, reading Cert ID change · PSA-10000001 → PSA-10000002 and Cert ID change · No Cert ID → PSA-10000003, each with Holder — and Remarks —; no intake or withdrawal entry was added.

<!-- trace:case id=g10adm.inventory-catalog.TC-wx1 rev=1 covers=g10adm.inventory-catalog.SC-68f,g10adm.inventory-catalog.SC-s46,g10adm.inventory-catalog.SC-mci -->
### g10adm.inventory-catalog.US4-TC2: Reversals lower the ledger and keep every earlier entry

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-04

**Pre-conditions:**

* Product 20's regular stock was intaken as 6 units and never moved; PSA-20000001 was intaken as one unit and never moved.

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
2. In View Cert IDs, click Reduce quantity on the available No Cert ID row, enter 2 and confirm; click Remove on PSA-20000001 and confirm.
3. Close Cert ID details, read the figures, and open the product history.

**Expected Results:**

* Stock, available and the ledger each read 3 lower; reserved, sold, withdrawn and vaulted are unchanged.
* The history adds Intake reversal · No Cert ID of 2 and Intake reversal · PSA-20000001 of 1, the two intakes still showing, and no intake or withdrawal added.

<!-- trace:case id=g10adm.inventory-catalog.TC-3o0 rev=1 covers=g10adm.inventory-catalog.SC-68f,g10adm.inventory-catalog.SC-s46,g10adm.inventory-catalog.SC-mci -->
### g10adm.inventory-catalog.US4-TC3: Each reversal shows in the history of the unit it took out

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-04

**Pre-conditions:**

* Product 21's regular stock was intaken as 4 units, then an admin hold took 2, then 4 more arrived; PSA-21000001 was intaken after the hold, and PSA-21000002 was given by Assign Cert ID to a unit of the second intake; neither has moved.

**Test data:**

| `<taken out>` | `<entry>` | `<in the No Cert ID history>` |
| --- | --- | --- |
| Reduce quantity on the available No Cert ID row, 1 unit | Intake reversal · No Cert ID, 1 | yes |
| Remove on PSA-21000001 | Intake reversal · PSA-21000001, 1 | no |
| Remove on PSA-21000002 | Intake reversal · PSA-21000002, 1 | no |

**Steps:**

1. In View Cert IDs, take `<taken out>` keeping the prefilled remarks, and confirm.
2. Read the history's newest entry.
3. Read the history of the available No Cert ID row, and of the admin hold's No Cert ID row.

**Expected Results:**

* Step 2 reads `<entry>`, when it was confirmed, the admin as actor, and Remarks Entered by mistake.
* Step 3 shows the entry `<in the No Cert ID history>`, both rows alike; PSA-21000002's Cert ID change from No Cert ID still shows.

---
## g10adm.inventory-catalog.US5: Inventory admin configures a localized product schema

**As an** inventory admin,
**I want** to define reusable fields and assign them to an exact IP, Item, and Category,
**so that** each product type has clear labels, structured values, and rules.

<!-- trace:case id=g10adm.inventory-catalog.TC-93e rev=1 -->
### g10adm.inventory-catalog.US5-TC1: An inventory admin defines a localized reusable field and configures a product schema from it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-05

**Pre-conditions:**

* An inventory admin is on the product schemas.

**Steps:**

1. Define card_number as a text field with English, Traditional Chinese and Simplified Chinese labels and a text pattern.
2. Configure the Pokémon, Single card, TCG schema with language, card number, card set, grading and PSA population, and publish it.

**Expected Results:**

* Step 1 saves the field with its three labels and pattern, reusable by any schema.
* Step 2 publishes the schema for that exact tuple, its fields in the order chosen.

<!-- trace:case id=g10adm.inventory-catalog.TC-3s4 rev=1 -->
### g10adm.inventory-catalog.US5-TC2: A field definition or a schema the rules forbid is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-05

**Pre-conditions:**

* An inventory admin is on the product schemas; a schema is published for Pokémon, Single card, TCG.

**Test data:**

| `<tried>` |
| --- |
| a field of an unsupported data type |
| a field with an invalid validation rule |
| a field whose key another field holds |
| a select option with no English label |
| publishing a second schema for Pokémon, Single card, TCG |

**Steps:**

1. Try `<tried>`.

**Expected Results:**

* It is refused by name, and nothing is saved or published.

---

## g10adm.inventory-catalog.US6: Inventory admin enters a validated product

**As an** inventory admin,
**I want** to save localized structured values and complete a product only when they are valid,
**so that** Auction receives products with trustworthy facts.

<!-- trace:case id=g10adm.inventory-catalog.TC-km4 rev=1 -->
### g10adm.inventory-catalog.US6-TC1: An inventory admin saves localized values and marks the product created

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-06

**Pre-conditions:**

* A draft product's tuple has the published Pokémon, Single card, TCG schema, PSA population optional.

**Steps:**

1. Save its language, card number, card set and grading, each with its translations, leaving PSA population empty.
2. Mark it created.
3. Click its grading attribute.

**Expected Results:**

* Step 1 saves every value with its translations.
* Step 2 marks it created, the empty optional value valid.
* Step 3 opens the product filter on that attribute.

<!-- trace:case id=g10adm.inventory-catalog.TC-swl rev=1 -->
### g10adm.inventory-catalog.US6-TC2: A product is not marked created on invalid or missing values, or without a schema

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-06

**Pre-conditions:**

* `<product>`.

**Test data:**

| `<product>` | `<tried>` | `<refused>` |
| --- | --- | --- |
| a product with the published schema | saving a card number failing its pattern | the value, by name |
| a draft with the published schema and no grading value | marking it created | the change, naming grading |
| a draft whose tuple has no published schema | marking it created | the change; it stays draft |

**Steps:**

1. Try `<tried>`.

**Expected Results:**

* It refuses `<refused>`, and nothing changes.

---

## g10adm.inventory-catalog.US7: Collector finds and reads a card through Auction fields

**As a** collector,
**I want** to search, filter, and read card facts in my active locale,
**so that** I can find the right product and understand its identifying details.

<!-- trace:case id=g10adm.inventory-catalog.TC-64a rev=1 -->
### g10adm.inventory-catalog.US7-TC1: A collector filters by universal and structured fields, and reads a card's facts in their locale

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-07

**Pre-conditions:**

* Auction lists products of different IPs, categories, languages and grades, one with a PSA population and one without; listing 1's schema puts language before card number with Traditional Chinese translations; listing 2 carries a PSA cert number with an English label and value only.

**Steps:**

1. On the Auction site, filter by an IP, then by a grade attribute, then by both; then by a PSA population.
2. Open listing 1 in Traditional Chinese, and listing 2 in Simplified Chinese.

**Expected Results:**

* Step 1 lists only the products matching each filter, the one without a PSA population not matching that filter.
* Step 2 reads listing 1's labels and values in Traditional Chinese, language before card number, and listing 2's cert number in English.

<!-- trace:case id=g10adm.inventory-catalog.TC-0uq rev=1 -->
### g10adm.inventory-catalog.US7-TC2: A listing attribute is not a search or filter criterion

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-07

**Pre-conditions:**

* An Auction listing carries a vaulted listing attribute.

**Steps:**

1. Open Auction's search and filter controls.

**Expected Results:**

* Vaulted is not offered.

---

## g10adm.inventory-catalog.US8: Inventory admin publishes a safe product-schema configuration

**As an** inventory admin,
**I want** to review the impact of a product-schema change before publishing it,
**so that** the active Auction catalogue never knowingly uses invalid product data.

<!-- trace:case id=g10adm.inventory-catalog.TC-r9g rev=1 -->
### g10adm.inventory-catalog.US8-TC1: A schema change publishes only once every product it touches is valid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-08

**Pre-conditions:**

* A schema draft makes grading required; one existing product of its tuple lacks grading; a reusable field has no Simplified Chinese label.

**Steps:**

1. Publish the draft.
2. Review the incompatible products, and correct the product's grading.
3. Publish again.

**Expected Results:**

* Step 1 is refused, naming the product without grading; the missing Simplified Chinese label is reported without blocking.
* Step 2 lists that product with its missing value, and saves the correction.
* Step 3 publishes the whole schema at once.

<!-- trace:case id=g10adm.inventory-catalog.TC-dwd rev=1 -->
### g10adm.inventory-catalog.US8-TC2: A product with no matching schema stays visible and unavailable to Auction

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-08

**Pre-conditions:**

* A created product predates product schemas, and its tuple has none published.

**Steps:**

1. Read it on Inventory, and look for it in an Auction listing's product choice.

**Expected Results:**

* Inventory shows it; Auction does not offer it.

---

<!-- trace:case id=g10adm.inventory-catalog.TC-hzq rev=1 -->
### g10adm.inventory-catalog.US8-TC3: An admin without inventory grants is offered no Inventory

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Admin console

**Pre-conditions:**

* An admin holds no inventory grant.

**Steps:**

1. Open the admin console, and the Inventory products address.

**Expected Results:**

* No Inventory section is offered, and the address is refused.
## g10adm.inventory-catalog.US9: Inventory admin sees unsold auction stock come back

**As an** inventory admin,
**I want** the stock of an auction that closed with no winner to show as available, with the hold closed and the listing named on the product page and in the history,
**so that** I can trust the count and see why it moved.

<!-- trace:case id=g10adm.inventory-catalog.TC-bzc rev=2 covers=g10adm.inventory-catalog.SC-fac,g10adm.inventory-catalog.SC-74t,g10adm.inventory-catalog.SC-h6i,g10adm.inventory-catalog.SC-evn,g10adm.inventory-catalog.SC-j3i -->
### g10adm.inventory-catalog.US9-TC1: A listing's close settles its hold, and the history names the listing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* An admin holding the inventory catalogue grant and no Auction grant is on product 1's page; product 1 holds 10 units, 4 of them held by listing 1, code `<code 1>`, title `<title 1>`, which has just `<closed>`.

**Test data:**

| `<closed>` | `<figures>` | `<hold reads>` | `<entry>` |
| --- | --- | --- | --- |
| closed with no bid | available up to 10, reserved 0 | closed and released, remaining 0 | a release of 4 at the close, Remarks Released by unsold listing |
| closed with a winner, the sale recorded | available 6, sold up by 4 | sold, not released | the sale, and no Released by unsold listing |
| been called off before its close | available up to 10 | released, remaining 0 | a release of 4, Remarks — |

**Steps:**

1. Read the figures and listing 1's hold.
2. Open the product history, and read listing 1's entries.

**Expected Results:**

* Step 1 reads `<figures>`; the hold reads `<hold reads>`, naming `<code 1>` and `<title 1>`.
* Step 2 reads `<entry>`, with its action, quantity, actor and Holder `<code 1>` and `<title 1>`, no admin step between the close and the entry.

<!-- trace:case id=g10adm.inventory-catalog.TC-2wi rev=2 covers=g10adm.inventory-catalog.SC-fac,g10adm.inventory-catalog.SC-74t,g10adm.inventory-catalog.SC-h6i,g10adm.inventory-catalog.SC-evn,g10adm.inventory-catalog.SC-j3i -->
### g10adm.inventory-catalog.US9-TC4: The clean-up releases the Unsold holds left behind, and reads as the clean-up's

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* Before this change shipped, listings 4, 5 and 6 closed Unsold holding 5, 1 and 2 units of their products; listing 7 is still live holding 1 unit; the clean-up has not run.

**Steps:**

1. Run the one-off clean-up of held Unsold stock.
2. On each of products 4, 5 and 6, read available, the listing's hold and the newest history entry.
3. On product 7, read listing 7's hold.

**Expected Results:**

* Step 2: available rose by the held units; each hold reads closed and released, naming its listing's code and title; the entry is a release of the held units at the clean-up's time, Holder the listing, Remarks Released by unsold listing (clean-up).
* Step 3: listing 7's hold is unchanged and active.

<!-- trace:case id=g10adm.inventory-catalog.TC-izt rev=1 covers=g10adm.inventory-catalog.SC-fac,g10adm.inventory-catalog.SC-74t,g10adm.inventory-catalog.SC-h6i,g10adm.inventory-catalog.SC-evn,g10adm.inventory-catalog.SC-j3i -->
### g10adm.inventory-catalog.US9-TC5: Every history entry shows its holder and remarks

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-09

**Pre-conditions:**

* Product 8's history holds `<entry>`.

**Test data:**

| `<entry>` | `<holder>` | `<remarks>` |
| --- | --- | --- |
| listing 8 reserving 1 unit, its label `<code 8> · <title 8>`, then adjusting it to 2 with a new label | Auction and listing 8's latest label | not asserted |
| an admin reserving 1 unit, typing Held for a trade show | Admin and the reference the reserve minted | — |
| Vault reserving 1 unit | Vault and its reference | not asserted |
| an admin renaming product 8 | — | — |

**Steps:**

1. Open the product history, and read the entry.

**Expected Results:**

* It reads its date and time, action, quantity and actor; Holder reads `<holder>`, and Remarks `<remarks>` where asserted.

---

## g10adm.inventory-catalog.US12: Operator classifies source media for one copy

**As an** Inventory operator,
**I want** to tag, untag, or retag saved product media for one Cert record,
**so that** a listing for that physical copy can begin with the photographs
that document it while shared product media stays available to every copy.

<!-- trace:case id=g10adm.inventory-catalog.TC-9q6 rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### g10adm.inventory-catalog.US12-TC1: Source media is tagged to one Cert record, retagged only by hand, and untagged for the whole product

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* An admin holding media-management authority is on the media manager; a saved, untagged `<media>` belongs to the product, which holds Cert records A and B with printed Cert IDs.

**Test data:**

| `<media>` |
| --- |
| product image |
| product video |

**Steps:**

1. Open the `<media>`, select Cert record A, and save.
2. Retag it from A to B, and save.
3. Tag it to A again, clear its tag, and save.

**Expected Results:**

* Step 1 tags it to A, on the same product.
* Step 2 leaves it on the product with no Cert tag, shared at product level; it is not moved to B, a tag to B being a separate act.
* Step 3 leaves it untagged, still available as product-level media.

<!-- trace:case id=g10adm.inventory-catalog.TC-p5b rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### g10adm.inventory-catalog.US12-TC5: A tag write the rules forbid is refused, the current tag kept

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* A saved source media item of the product is tagged to a Cert record; `<operator>` acts.

**Test data:**

| `<operator>` | `<tried>` |
| --- | --- |
| an admin holding media-management authority | a retag to a missing Cert record |
| an admin holding media-management authority | a retag to a Cert record of another product |
| an admin without media-management authority | any change of its tag |

**Steps:**

1. Try `<tried>`.

**Expected Results:**

* It is refused; the tag and the media are unchanged.

<!-- trace:case id=g10adm.inventory-catalog.TC-j5n rev=1 covers=g10adm.inventory-catalog.SC-sbt,g10adm.inventory-catalog.SC-hcz,g10adm.inventory-catalog.SC-ec6,g10adm.inventory-catalog.SC-6tq,g10adm.inventory-catalog.SC-fbv,g10adm.inventory-catalog.SC-hhf -->
### g10adm.inventory-catalog.US12-TC7: Regular stock is not a tag target

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-12

**Pre-conditions:**

* The product holds regular stock with no Cert record and one Cert record with a Cert ID; a saved untagged item belongs to it.

**Steps:**

1. Open the item, and read the tag choices.

**Expected Results:**

* The Cert record is offered and regular stock is not; the item stays untagged and shared.

---

## g10adm.inventory-catalog.US13: Operator removes an available copy and its source media

**As an** Inventory operator,
**I want** to remove an available physical unit and its Cert record together,
**so that** the unit is withdrawn and its Cert-scoped source media cannot be reused.

<!-- trace:case id=g10adm.inventory-catalog.TC-x83 rev=3 covers=g10adm.inventory-catalog.SC-gpb,g10adm.inventory-catalog.SC-lvy -->
### g10adm.inventory-catalog.US13-TC1: Removing a physical unit withdraws it and deletes only its tagged media

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-13

**Pre-conditions:**

* Product 22's PSA-22000001 reads Available, an admin hold having named it and released it whole; one image is tagged to it, one is untagged, and one is tagged to PSA-22000002.

**Steps:**

1. Read stock, withdrawn and the ledger; in View Cert IDs, select PSA-22000001 and read its actions.
2. Click Remove physical unit, read the confirmation, and Cancel.
3. Click Remove physical unit again, enter Damaged in storage, and confirm.
4. Close Cert ID details; read the figures, the history and the product's media.

**Expected Results:**

* Step 1 offers Remove physical unit and not Remove.
* Step 2's confirmation names PSA-22000001 and asks for a reason, Confirm unavailable until one is entered; cancelling leaves it listed, Available.
* Step 3 removes it from the rows.
* Step 4: stock is one lower and withdrawn one higher, the ledger as before; one withdrawal entry records the reason and no Intake reversal; the tagged image is deleted, the other two kept with their tags.

<!-- trace:case id=g10adm.inventory-catalog.TC-ktu rev=1 covers=g10adm.inventory-catalog.SC-gpb,g10adm.inventory-catalog.SC-k3v -->
### g10adm.inventory-catalog.US13-TC2: A Cert unit held or no longer available cannot be removed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-13

**Pre-conditions:**

* A Cert record `<state>`, one source media item tagged to it.

**Test data:**

| `<state>` |
| --- |
| held by an active reservation |
| sold |
| withdrawn |
| vaulted |

**Steps:**

1. Try to remove its physical unit.

**Expected Results:**

* It is refused; the reservation, stock, withdrawn, the ledger, the record and its media are unchanged.

<!-- trace:case id=g10adm.inventory-catalog.TC-dd3 rev=1 covers=g10adm.inventory-catalog.SC-k3v,g10adm.inventory-catalog.SC-lvy -->
### g10adm.inventory-catalog.US13-TC4: A Cert record that has only been intaken offers Remove, not Remove physical unit

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-13

**Pre-conditions:**

* Product 23 holds `<record>`, which no hold has ever named.

**Test data:**

| `<record>` |
| --- |
| PSA-23000001, intaken with its Cert ID |
| PSA-23000002, given by Assign Cert ID |
| PSA-23000003, corrected from PSA-23000009 after intake |
| PSA-23000004, intaken, the product's regular stock since sold and held |

**Steps:**

1. In View Cert IDs, select it and read its actions.

**Expected Results:**

* Remove is offered, and Remove physical unit is not.

---
## g10adm.inventory-catalog.US14: Inventory admin accounts for every unit in Cert ID details

**As an** inventory admin,
**I want** Cert ID details to list the regular stock without a Cert ID beside the Cert records, by state and holder,
**so that** I can see where every unit of the product is without adding up the counts myself.

<!-- trace:case id=g10adm.inventory-catalog.TC-ebs rev=1 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
### g10adm.inventory-catalog.US14-TC1: Cert ID details lists every unit on hand by state and holder, adding up to stock

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* Product 3 holds only: PSA-30000001 available; PSA-30000002 held by listing 1; PSA-30000003 sold; 500 units of regular stock outside every hold; an admin hold of 2 regular units; listing 2's hold of 3 regular units with 1 sold from it; a released admin hold; 4 regular units sold and 1 withdrawn.

**Steps:**

1. Read the stock, and click View Cert IDs.
2. Read the rows, their order, and add up the Available and Reserved rows.

**Expected Results:**

* One row each for the three Cert records with its state, PSA-30000002 naming listing 1, none showing Grade Issuer, Grade, Autograph Grade or Serial.
* One available No Cert ID row of 500; a Reserved row for the admin hold, Admin, its reference and 2; one for listing 2's hold, Auction, listing 2 and 2; no row for the released hold, the sold or the withdrawn.
* Cert records come first by Cert ID, then the available No Cert ID row, then the hold rows; the sum equals the stock.

<!-- trace:case id=g10adm.inventory-catalog.TC-b0u rev=1 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
### g10adm.inventory-catalog.US14-TC2: A product lists only what its stock has held

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* A created product holds only `<held>`.

**Test data:**

| `<held>` | `<rows>` |
| --- | --- |
| 6 units of available regular stock, no Cert record | one No Cert ID row, available, 6 |
| one unit intaken with PSA-17000001, no regular stock ever | PSA-17000001 alone, no No Cert ID row |
| nothing, never intaken | none, one line saying no unit is on hand |

**Steps:**

1. Click View Cert IDs, and read the rows.

**Expected Results:**

* It lists `<rows>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-ei7 rev=2 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
### g10adm.inventory-catalog.US14-TC3: A No Cert ID row shows the regular stock's history, and not a Cert record's

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* Product 5's regular stock was intaken as 5 units; an admin hold took 2; PSA-50000002, corrected from PSA-50000001, is held by an admin hold; a regular unit was given PSA-50000003.

**Test data:**

| `<row>` |
| --- |
| the available No Cert ID row, 2 units |
| the admin hold's No Cert ID row, 2 remaining |

**Steps:**

1. In View Cert IDs, click `<row>`, and read its history.

**Expected Results:**

* It shows the intake, the admin hold's reserve and the Cert ID change from No Cert ID to PSA-50000003; not the change from PSA-50000001, nor PSA-50000002's hold.

<!-- trace:case id=g10adm.inventory-catalog.TC-9ow rev=1 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
### g10adm.inventory-catalog.US14-TC4: Regular stock that is all held reads Available 0, and offers no Cert ID

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* Product 14 has no Cert record; 3 regular units sold, 1 withdrawn, and listing 14 holds the 2 on hand.

**Steps:**

1. Click View Cert IDs, and read the rows and their actions.

**Expected Results:**

* Two rows, in order: No Cert ID, Available, —, 0; and No Cert ID, Reserved, Auction, listing 14's code and title, 2; none for the sold or withdrawn.
* Neither offers the assign action; the rows say no free regular unit can take a Cert ID.

<!-- trace:case id=g10adm.inventory-catalog.TC-v6a rev=1 covers=g10adm.inventory-catalog.SC-4o8,g10adm.inventory-catalog.SC-2h0,g10adm.inventory-catalog.SC-nf2,g10adm.inventory-catalog.SC-ji2,g10adm.inventory-catalog.SC-ekd,g10adm.inventory-catalog.SC-pwt -->
### g10adm.inventory-catalog.US14-TC5: A released hold's units return to the available row

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* Product 15 holds 1 available regular unit, and an admin hold of 2 regular units.

**Steps:**

1. Read the No Cert ID rows in View Cert IDs.
2. Release the admin hold whole from the product page, and read them again.

**Expected Results:**

* Step 1 reads 1 available and 2 held.
* Step 2 reads 3 available, and no row for the hold.

<!-- trace:case id=g10adm.inventory-catalog.TC-56a rev=1 covers=g10adm.inventory-catalog.SC-oth -->
### g10adm.inventory-catalog.US14-TC7: A reversal lowers the rows, which still add up to stock

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* `<product>`.

**Test data:**

| `<product>` | `<reversed>` | `<rows after>` |
| --- | --- | --- |
| product 24: 2 regular units intaken and all held, then 5 more intaken; PSA-24000001 available | Reduce quantity, 2 units | the available No Cert ID row 3, the hold 2, PSA-24000001 Available |
| the same | Reduce quantity, 5 units | the available No Cert ID row 0, the hold 2, PSA-24000001 Available |
| product 25: PSA-25000001 unmoved, PSA-25000002 available, 3 regular units available | Remove PSA-25000001 | PSA-25000002, then the available No Cert ID row 3 |
| product 26: 3 regular units intaken, one given PSA-25000003, unmoved since | Remove PSA-25000003 | the available No Cert ID row 2 |
| product 27: PSA-25000001 alone | Remove PSA-25000001 | none, one line saying no unit is on hand |

**Steps:**

1. Read the stock; in View Cert IDs take `<reversed>`, and confirm.
2. Read the rows, and the available No Cert ID row's history where one is listed.
3. Read the stock again.

**Expected Results:**

* Step 2 reads `<rows after>`, no row reading a removed Cert ID; a reduction's history newest reads Intake reversal · No Cert ID with its units, the intakes still showing; a removal leaves no entry there, a numbered record's Cert ID change still showing.
* Step 3 equals the rows' sum.

<!-- trace:case id=g10adm.inventory-catalog.TC-dok rev=1 covers=g10adm.inventory-catalog.SC-4lh -->
### g10adm.inventory-catalog.US14-TC9: A reader without the write grant cannot reverse an intake

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-14

**Pre-conditions:**

* An admin reads Inventory without write authority; product 42's 4 regular units, never moved, had 1 taken out by an earlier reduction; PSA-42000001 is unmoved.

**Steps:**

1. In View Cert IDs, read the rows, their actions, and the available row's history.
2. Send a reduction of 1, and a removal of PSA-42000001, outside the page; read the rows and the history again.

**Expected Results:**

* Step 1 reads the available row as 3 with PSA-42000001 listed, offering no Reduce quantity or Remove; the earlier reduction shows.
* Step 2 refuses both; the rows read as before, and no new Intake reversal was added.

---

## g10adm.inventory-catalog.US15: Inventory admin corrects or assigns a unit's Cert ID

**As an** inventory admin,
**I want** to change a wrong Cert ID on an available unit, or give an available unit of regular stock its Cert ID, from Cert ID details,
**so that** the record matches the card on the shelf without removing the unit and losing its history.

<!-- trace:case id=g10adm.inventory-catalog.TC-77a rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### g10adm.inventory-catalog.US15-TC1: Correcting a Cert ID keeps the record, its history and its media

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* Product 6 holds PSA-60000001, available and never named by a hold, with one image tagged to it, and PSA-60000004, sold; another product holds PSA-60000003.

**Test data:**

| `<new>` | `<remarks typed>` | `<remarks read>` |
| --- | --- | --- |
| PSA-60000002, unused anywhere | Digit misread at intake | Digit misread at intake |
| PSA-60000003, used on another product only | none | — |
| psa-60000004, the sold record in lower case | none | — |

**Steps:**

1. In View Cert IDs, open the correct action on PSA-60000001, enter `<new>` and `<remarks typed>`, and save.
2. Read the rows, then the new Cert ID's history, the product history and the image's tag.

**Expected Results:**

* The row reads `<new>` exactly as entered, still available; none reads PSA-60000001; PSA-60000004 still reads Sold.
* Its history shows the intake below a Cert ID change of one, PSA-60000001 before and `<new>` after, at the save, the admin as actor and `<remarks read>`, the same entry in the product history; the image is tagged to `<new>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-ytb rev=2 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### g10adm.inventory-catalog.US15-TC2: Assigning a Cert ID alone turns one regular unit into a Cert record

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* Product 7 holds 4 available regular units and an admin hold of 1; nothing reads CGC-70000001.

**Test data:**

| `<entered>` | `<remarks typed>` | `<remarks read>` |
| --- | --- | --- |
| CGC-70000001 | Numbered after grading returned | Numbered after grading returned |
| CGC-70000001 | none | — |
| ` CGC-70000001 ` | none | — |

**Steps:**

1. In View Cert IDs, open the assign action on the available No Cert ID row, and read its fields.
2. Enter `<entered>` and `<remarks typed>`, and save; read the rows and CGC-70000001's history.

**Expected Results:**

* Step 1 asks for the Cert ID and remarks only, no grade or serial field.
* Step 2 reads the available row 3, the hold still 1, and a new row CGC-70000001, Available, —, 1; its history holds one Cert ID change of one, No Cert ID before and CGC-70000001 after, at the save, the admin as actor and `<remarks read>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-l2h rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### g10adm.inventory-catalog.US15-TC3: An unusable Cert ID is refused, on a correction or an assignment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* Product 8 holds PSA-80000001, available and never named by a hold, PSA-80000002 sold, and 2 available regular units.

**Test data:**

| `<action>` | `<entered>` | `<refusal names>` |
| --- | --- | --- |
| correct PSA-80000001 | nothing | no unit |
| correct PSA-80000001 | three spaces | no unit |
| correct PSA-80000001 | no cert id | no unit |
| correct PSA-80000001 | ` PSA-80000002 ` | PSA-80000002, Sold |
| correct PSA-80000001 | PSA-80000001 | PSA-80000001, Available |
| assign the No Cert ID row | NO CERT ID | no unit |
| assign the No Cert ID row | PSA-80000002 | PSA-80000002, Sold |

**Steps:**

1. In View Cert IDs, open `<action>`, enter `<entered>`, and save.
2. Read the rows and the product history.

**Expected Results:**

* Step 1 is refused, naming `<refusal names>` where it names a unit.
* Step 2 reads every row as before, no new record, and no Cert ID change added.

<!-- trace:case id=g10adm.inventory-catalog.TC-d3n rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### g10adm.inventory-catalog.US15-TC5: A unit that is held or has moved offers no Cert ID change

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* Product 10 holds `<unit>`.

**Test data:**

| `<unit>` |
| --- |
| PSA-10100001, held by a listing's active hold |
| PSA-10100002, held by an active admin hold |
| PSA-10100003, sold |
| PSA-10100004, withdrawn |
| PSA-10100005, vaulted |
| PSA-10100006, released by a listing that closed Unsold, reading Available |
| the No Cert ID row of an active admin hold |

**Steps:**

1. In View Cert IDs, find it and read its actions.

**Expected Results:**

* No correct or assign action is offered; the row says why its Cert ID cannot change.

<!-- trace:case id=g10adm.inventory-catalog.TC-p63 rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### g10adm.inventory-catalog.US15-TC6: A unit held after the form opened is refused at save

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Cert ID details

**Pre-conditions:**

* Product 11 holds PSA-11000001, never named by a hold, and exactly 1 available regular unit; admin A and admin B each have it open.

**Test data:**

| `<admin A opens>` | `<admin B, before A saves>` |
| --- | --- |
| the correct action on PSA-11000001 | reserves PSA-11000001 under an admin hold |
| the assign action on the No Cert ID row | reserves the last regular unit under an admin hold |

**Steps:**

1. As admin A, open `<admin A opens>`, and enter PSA-11000002.
2. As admin B, `<admin B, before A saves>`.
3. As admin A, save; read Cert ID details and the product history.

**Expected Results:**

* The save is refused; nothing reads PSA-11000002, PSA-11000001 is unchanged, admin B's hold stands, and no Cert ID change was added.

<!-- trace:case id=g10adm.inventory-catalog.TC-qwg rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### g10adm.inventory-catalog.US15-TC7: A reader without the write grant cannot change a Cert ID

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* An admin reads Inventory without write authority; product 12 holds PSA-12000001, never named by a hold, and available regular stock.

**Steps:**

1. In View Cert IDs, read the rows, their actions and PSA-12000001's history.
2. Send a change of PSA-12000001, and an assignment of PSA-12000002, outside the page; read the rows again.

**Expected Results:**

* Step 1 lists every row with its history, offering no correct or assign action.
* Step 2 refuses both; nothing reads PSA-12000002 and the rows are as before.

<!-- trace:case id=g10adm.inventory-catalog.TC-ouv rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### g10adm.inventory-catalog.US15-TC9: An assigned unit can be held by its new Cert ID

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* Product 16 holds 2 available regular units; another unit was given BGS-16000001, available with no hold.

**Steps:**

1. Read the available No Cert ID row.
2. Reserve one under an admin hold, choosing BGS-16000001; read the rows again.

**Expected Results:**

* The hold is saved, one unit, naming BGS-16000001; its row reads Reserved with Admin and the hold's reference, the No Cert ID row as before.

<!-- trace:case id=g10adm.inventory-catalog.TC-twb rev=1 covers=g10adm.inventory-catalog.SC-u13,g10adm.inventory-catalog.SC-9io,g10adm.inventory-catalog.SC-auy,g10adm.inventory-catalog.SC-blo,g10adm.inventory-catalog.SC-d8o,g10adm.inventory-catalog.SC-sky,g10adm.inventory-catalog.SC-tl1,g10adm.inventory-catalog.SC-e5t,g10adm.inventory-catalog.SC-nlh,g10adm.inventory-catalog.SC-myo,g10adm.inventory-catalog.SC-sbe,g10adm.inventory-catalog.SC-zu9 -->
### g10adm.inventory-catalog.US15-TC10: Copy facts sent with an assignment are ignored

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-15

**Pre-conditions:**

* Product 19 holds 2 available regular units; nothing reads CGC-19000001.

**Test data:**

| `<facts>` |
| --- |
| CGC, 9.8, autograph 10 and serial 12/50 |
| RAW, and nothing else |
| 300 characters of 9 as the grade, and the number 50 as the serial |

**Steps:**

1. Send an assignment of CGC-19000001 with `<facts>` outside the page.
2. Read the rows and CGC-19000001's history.

**Expected Results:**

* It is saved: the available row reads 1, a new row CGC-19000001, Available, —, 1, with one Cert ID change from No Cert ID.

---
## g10adm.inventory-catalog.US16: Inventory admin takes out units intaken by mistake

**As an** inventory admin,
**I want** to take out regular stock or a Cert record that was intaken by mistake and has never moved, from Cert ID details,
**so that** the stock and the ledger count only the units the shop received.

<!-- trace:case id=g10adm.inventory-catalog.TC-tcu rev=1 covers=g10adm.inventory-catalog.SC-w4o,g10adm.inventory-catalog.SC-9lp,g10adm.inventory-catalog.SC-cbm,g10adm.inventory-catalog.SC-8rx -->
### g10adm.inventory-catalog.US16-TC1: Units intaken by mistake are taken out, stock and the ledger falling with them

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* `<product>`.

**Test data:**

| `<product>` | `<taken out>` | `<fall>` | `<entry>` |
| --- | --- | --- | --- |
| product 30: 5 regular units intaken, 2 sold outside any hold, then 10 intaken where 1 was received | Reduce quantity on the available No Cert ID row, 9 units, the row then reading 4 | 9 | Intake reversal · No Cert ID, 9 |
| product 31: PSA-31000001 intaken, never moved; PSA-31000002 available; 3 regular units; one image tagged to PSA-31000001, one untagged, one tagged to PSA-31000002 | Remove on PSA-31000001 | 1 | Intake reversal · PSA-31000001, 1 |
| product 31 as above, PSA-31000003 given by Assign Cert ID in PSA-31000001's place | Remove on PSA-31000003 | 1 | Intake reversal · PSA-31000003, 1 |

**Steps:**

1. Read stock, reserved, sold, withdrawn, vaulted, available and the ledger.
2. In View Cert IDs, take `<taken out>`, and confirm.
3. Read the rows; close; read the figures, the newest history entry, and the product's media.

**Expected Results:**

* Stock, available and the ledger each fall by `<fall>`; reserved, sold, withdrawn and vaulted are unchanged; no removed Cert ID is listed, the other rows as before.
* The newest entry reads `<entry>`, when confirmed, the admin as actor, Remarks Entered by mistake; a removed record's tagged image is deleted, the others kept with their tags.

<!-- trace:case id=g10adm.inventory-catalog.TC-7el rev=1 covers=g10adm.inventory-catalog.SC-4jy,g10adm.inventory-catalog.SC-grz,g10adm.inventory-catalog.SC-9iv -->
### g10adm.inventory-catalog.US16-TC3: Each reversal's confirmation says what it takes out

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* `<product>`.

**Test data:**

| `<product>` | `<action>` | `<confirmation reads>` |
| --- | --- | --- |
| product 32: 7 regular units intaken, never moved | Reduce quantity on the available No Cert ID row | the number empty, Confirm unavailable, 7 as the most that can be taken; entering 3, stock and the ledger falling by 3, Confirm available |
| product 33: PSA-33000001 intaken, an image and a video tagged to it | Remove on PSA-33000001 | its Cert ID, stock and the ledger falling by one, its tagged media deleted, Confirm available |
| product 33: PSA-33000002 intaken, nothing tagged to it | Remove on PSA-33000002 | its Cert ID, stock and the ledger falling by one, its tagged media deleted, Confirm available |

**Steps:**

1. In View Cert IDs, hover over `<action>`, then click it and read the confirmation.

**Expected Results:**

* The hover says it takes out units intaken by mistake as if never received, withdrawn not moving.
* The confirmation reads `<confirmation reads>`, Remarks prefilled Entered by mistake.

<!-- trace:case id=g10adm.inventory-catalog.TC-te3 rev=1 covers=g10adm.inventory-catalog.SC-4jy -->
### g10adm.inventory-catalog.US16-TC5: Edited remarks are recorded on the reversal

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* Product 34's 4 regular units never moved; PSA-34000001 is unmoved.

**Test data:**

| `<action>` | `<typed>` | `<read>` |
| --- | --- | --- |
| Reduce quantity, 1 unit | Counted twice at intake | Counted twice at intake |
| Remove on PSA-34000001 | Received, then returned before listing | Received, then returned before listing |
| Remove on PSA-34000001 | ` Card never arrived ` | Card never arrived |

**Steps:**

1. In View Cert IDs, take `<action>`, replace the remarks with `<typed>`, and confirm.
2. Read the history's newest entry.

**Expected Results:**

* An Intake reversal entry reads Remarks `<read>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-xzl rev=1 covers=g10adm.inventory-catalog.SC-w4o,g10adm.inventory-catalog.SC-9lp -->
### g10adm.inventory-catalog.US16-TC6: A reduction of one unit, and of the reducible count, is taken

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* Product 35: 3 regular units intaken, 1 sold outside any hold, then 4 intaken; 6 available, 4 reducible.

**Test data:**

| `<units>` | `<available after>` |
| --- | --- |
| 1 | 5 |
| 4 | 2, Reduce quantity no longer offered, the row saying its units were intaken before regular stock last moved |

**Steps:**

1. Reduce the available No Cert ID row by `<units>`, and read the row and its newest entry.

**Expected Results:**

* It is saved; the row reads `<available after>`; one Intake reversal · No Cert ID of `<units>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-y4w rev=1 covers=g10adm.inventory-catalog.SC-zoe,g10adm.inventory-catalog.SC-srm,g10adm.inventory-catalog.SC-9lp,g10adm.inventory-catalog.SC-sm9,g10adm.inventory-catalog.SC-c7i -->
### g10adm.inventory-catalog.US16-TC7: The reducible count starts after regular stock's latest move

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* The product's stock went through `<history>` and nothing else, every intake with no Cert ID unless named.

**Test data:**

| `<history>` | `<available>` | `<reducible>` |
| --- | --- | --- |
| intake 5, intake 3 | 8 | 8 |
| intake 5, one unit given PSA-36000002 | 4 | 4 |
| intake 5, 2 sold outside any hold, intake 10 | 13 | 10 |
| intake 5, 1 withdrawn, intake 2 | 6 | 2 |
| intake 5, admin hold of 2 active, intake 4 | 7 | 4 |
| intake 5, admin hold of 2 released whole, intake 3 | 8 | 3 |
| intake 5, Auction hold of 2 with 1 sold from it, intake 3 | 6 | 3 |
| intake 5, Vault hold of 1 vaulted, intake 2 | 6 | 2 |
| intake 5, 1 sold, intake 4, one unit given PSA-36000002 | 7 | 3 |
| intake 5, 1 sold, intake 4, a reduction of 1 | 7 | 3 |
| intake 5, PSA-36000001 intaken and sold | 5 | 5 |
| intake 5, one unit given PSA-36000002, held by an active admin hold | 4 | 4 |

**Steps:**

1. In View Cert IDs, read the available No Cert ID row, click Reduce quantity, and read the most it can take.

**Expected Results:**

* The row reads `<available>`; the confirmation states `<reducible>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-12l rev=1 covers=g10adm.inventory-catalog.SC-i1t -->
### g10adm.inventory-catalog.US16-TC8: A removed Cert ID can be intaken again as a new record

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* Product 37 holds PSA-37000001, intaken and never moved.

**Steps:**

1. Remove PSA-37000001 and confirm.
2. Intake one unit with Cert ID PSA-37000001; read its row and history.

**Expected Results:**

* Step 2 is saved: one row reads PSA-37000001, Available, 1, its history the new intake alone, with no Intake reversal.

<!-- trace:case id=g10adm.inventory-catalog.TC-3ae rev=1 covers=g10adm.inventory-catalog.SC-zu3,g10adm.inventory-catalog.SC-4jy,g10adm.inventory-catalog.SC-7hq -->
### g10adm.inventory-catalog.US16-TC9: A number outside one to the reducible count, or empty remarks, keeps Confirm unavailable

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* Product 38: 3 regular units intaken, 1 sold, 4 intaken, so 6 available and 4 reducible; PSA-39000001 unmoved.

**Test data:**

| `<action>` | `<filled>` |
| --- | --- |
| Reduce quantity | nothing as the number |
| Reduce quantity | 0 |
| Reduce quantity | 5, one past the reducible count |
| Reduce quantity | 6, every available unit |
| Reduce quantity | 2.5 |
| Reduce quantity | -1 |
| Reduce quantity, 1 unit | the remarks cleared |
| Reduce quantity, 1 unit | three spaces as the remarks |
| Remove on PSA-39000001 | the remarks cleared |
| Remove on PSA-39000001 | three spaces as the remarks |

**Steps:**

1. Open `<action>`, fill `<filled>`, and read Confirm.
2. Cancel, and read the rows and the available row's history.

**Expected Results:**

* Confirm is unavailable; the rows read as before, and no Intake reversal shows.

<!-- trace:case id=g10adm.inventory-catalog.TC-zld rev=1 covers=g10adm.inventory-catalog.SC-nnc -->
### g10adm.inventory-catalog.US16-TC11: Regular stock with no unit intaken since its latest move offers no Reduce quantity

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* The product's regular stock went through `<history>` and nothing else.

**Test data:**

| `<history>` | `<available>` |
| --- | --- |
| intake 3, an Auction hold of 3 active | 0 |
| intake 5, 1 sold outside any hold | 4 |
| intake 3, an admin hold of 1 released whole | 3 |
| intake 3, 1 withdrawn outside any hold | 2 |
| intake 3, an Auction hold of 1 moved to another product | 2 |
| intake 3, a reduction of 3 | 0 |
| intake 1, the unit given PSA-40000001 | 0 |

**Steps:**

1. In View Cert IDs, read the available No Cert ID row and its actions.

**Expected Results:**

* The row reads `<available>`, saying where it reads 1 or more that its units were intaken before regular stock last moved; Reduce quantity is not offered.

<!-- trace:case id=g10adm.inventory-catalog.TC-ipi rev=1 covers=g10adm.inventory-catalog.SC-lvy,g10adm.inventory-catalog.SC-8m1,g10adm.inventory-catalog.SC-x7l -->
### g10adm.inventory-catalog.US16-TC12: A Cert record that has moved offers no Remove

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* Product 41 holds `<record>`.

**Test data:**

| `<record>` | `<remove physical unit>` |
| --- | --- |
| PSA-41000001, held by an active admin hold | not offered |
| PSA-41000002, held by a live listing | not offered |
| PSA-41000003, its admin hold released | offered |
| PSA-41000004, released by a listing that closed Unsold | offered |
| PSA-41000005, once held by a hold since moved to another product | offered, and Change Cert ID not, its Cert ID shown as fixed |
| PSA-41000006, sold | not offered |
| PSA-41000007, withdrawn | not offered |
| PSA-41000008, vaulted | not offered |

**Steps:**

1. In View Cert IDs, select it and read its actions.

**Expected Results:**

* Remove is not offered; Remove physical unit is `<remove physical unit>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-n7h rev=1 covers=g10adm.inventory-catalog.SC-gbg,g10adm.inventory-catalog.SC-y0i -->
### g10adm.inventory-catalog.US16-TC14: A move or reversal after the confirmation opened refuses the reversal

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* Product 44's 3 regular units never moved; PSA-44000001 is unmoved; admin A and admin B each have it open.

**Test data:**

| `<admin A fills>` | `<admin B, before A confirms>` |
| --- | --- |
| Reduce quantity, 3 units | reserves 1 regular unit under an admin hold |
| Reduce quantity, 3 units | reduces 1 unit |
| Remove on PSA-44000001 | reserves PSA-44000001 under an admin hold |
| Remove on PSA-44000001 | removes PSA-44000001 |

**Steps:**

1. As admin A, open and fill `<admin A fills>`.
2. As admin B, `<admin B, before A confirms>`.
3. As admin A, confirm; read Cert ID details and the history.

**Expected Results:**

* Admin A's reversal is refused; the rows read as admin B left them, any hold of B's intact, and only B's step added an entry.

<!-- trace:case id=g10adm.inventory-catalog.TC-0ut rev=1 covers=g10adm.inventory-catalog.SC-9iv -->
### g10adm.inventory-catalog.US16-TC15: Cancelling a confirmation changes nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-16

**Pre-conditions:**

* Product 45's 3 regular units never moved; PSA-45000001 is unmoved, an image tagged to it.

**Test data:**

| `<action>` | `<filled>` |
| --- | --- |
| Reduce quantity | 2 units, remarks Counted twice |
| Remove on PSA-45000001 | the remarks left prefilled |

**Steps:**

1. Read stock, available, withdrawn and the ledger.
2. Open `<action>`, fill `<filled>`, and cancel.
3. Read the rows, the figures, the history and the media.

**Expected Results:**

* The available row reads 3 and PSA-45000001 is listed; every figure is as before; no Intake reversal was added; the image is still tagged to PSA-45000001.

---
## g10adm.inventory-catalog.US69: Operator records a received graded unit

**As an** inventory admin,
**I want** to record optional Cert IDs when I intake stock,
**so that** each numbered graded unit can be traced without preventing
unnumbered stock from entering inventory.

<!-- trace:case id=g10adm.inventory-catalog.TC-50a rev=1 covers=g10adm.inventory-catalog.SC-fq8,g10adm.inventory-catalog.SC-irv,g10adm.inventory-catalog.SC-a57,g10adm.inventory-catalog.SC-skp,g10adm.inventory-catalog.SC-ah9,g10adm.inventory-catalog.SC-0ac -->
### g10adm.inventory-catalog.US69-TC1: An intake records numbered and unnumbered stock

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-69

**Pre-conditions:**

* A created product's inventory holds stock 2.

**Steps:**

1. On the product page, intake 2 units with PSA-123 and BGS-456.
2. Intake 3 units with no Cert ID.
3. Read the inventory, Cert ID details and the history.

**Expected Results:**

* Stock rose by 5; PSA-123 and BGS-456 are records of the product, and the unnumbered intake made none.
* One intake entry records the two Cert IDs.

<!-- trace:case id=g10adm.inventory-catalog.TC-gvc rev=1 covers=g10adm.inventory-catalog.SC-fq8,g10adm.inventory-catalog.SC-irv,g10adm.inventory-catalog.SC-a57,g10adm.inventory-catalog.SC-skp,g10adm.inventory-catalog.SC-ah9,g10adm.inventory-catalog.SC-0ac -->
### g10adm.inventory-catalog.US69-TC2: An intake naming a Cert ID the product holds, or too many, is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-69

**Pre-conditions:**

* The product holds `<holds>`, stock 2.

**Test data:**

| `<holds>` | `<intake>` |
| --- | --- |
| PSA-123, intaken | 1 unit with PSA-123 |
| PSA-123, intaken | 1 unit with two Cert IDs |
| PSA-20000002, given by correcting PSA-20000001 | 1 unit with PSA-20000002 |
| PSA-20000002, given by Assign Cert ID | 1 unit with PSA-20000002 |

**Steps:**

1. Try the `<intake>`, and read the inventory, Cert ID details and the history.

**Expected Results:**

* It is refused; stock and the records are unchanged, and no entry was added.

---

## g10adm.inventory-catalog.US70: Operator configures the product identity and display

**As an** inventory admin,
**I want** products to use IP, Category, and Item while choosing whether Cert
ID appears in displayed attributes,
**so that** product facts stay structured and each Auction presentation shows
only the fields I choose.

<!-- trace:case id=g10adm.inventory-catalog.TC-tzz rev=1 covers=g10adm.inventory-catalog.SC-sls,g10adm.inventory-catalog.SC-ux1,g10adm.inventory-catalog.SC-q36,g10adm.inventory-catalog.SC-u9i,g10adm.inventory-catalog.SC-6vy,g10adm.inventory-catalog.SC-rn5 -->
### g10adm.inventory-catalog.US70-TC1: The product form offers the hierarchy, and Cert ID is shown or hidden among the displayed fields

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-70

**Pre-conditions:**

* A published product schema for one IP, Category and Item tuple displays two typed attributes; listing A of its product selects PSA-123, listing B No Cert ID.

**Steps:**

1. Open a product's form, and read its identity fields.
2. On the product schemas, add Cert ID to the displayed fields, first; read listing A.
3. Remove Cert ID from the displayed fields; read the schema and listing B.

**Expected Results:**

* Step 1 shows IP, Category and Item, with no collectible type or product metadata.
* Step 2 needs no ordinary attribute key; listing A shows PSA-123 first among its product fields.
* Step 3 keeps the two attributes in their order, Cert ID no longer displayed; listing B shows no Cert ID row and no metadata fallback.

---

## g10adm.inventory-catalog.US71: Holder reserves a specific inventory unit

**As an** inventory admin,
**I want** to choose a specific Cert ID or explicitly choose `No Cert ID` when
I reserve stock,
**so that** every reservation identifies whether it owns a physical numbered
unit or only aggregate stock.

<!-- trace:case id=g10adm.inventory-catalog.TC-q7e rev=1 covers=g10adm.inventory-catalog.SC-bck,g10adm.inventory-catalog.SC-63a,g10adm.inventory-catalog.SC-ol8 -->
### g10adm.inventory-catalog.US71-TC1: A hold records the Cert ID chosen

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-71

**Pre-conditions:**

* A created product holds available PSA-123 and BGS-456; a holder may reserve it.

**Steps:**

1. In the holder's reservation flow, choose PSA-123 and save.
2. Read the hold, and the unit choices again.

**Expected Results:**

* The hold stores PSA-123, quantity one; PSA-123 is no longer offered to another hold.

<!-- trace:case id=g10adm.inventory-catalog.TC-tq8 rev=1 covers=g10adm.inventory-catalog.SC-bck,g10adm.inventory-catalog.SC-63a,g10adm.inventory-catalog.SC-ol8 -->
### g10adm.inventory-catalog.US71-TC2: A hold needs an explicit unit choice, No Cert ID taking regular stock

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-71

**Pre-conditions:**

* A created product holds available stock and no intended numbered unit.

**Steps:**

1. In the reservation flow, try to save with neither a Cert ID nor No Cert ID chosen.
2. Choose No Cert ID and quantity 3, and save.

**Expected Results:**

* Step 1 is refused, the inventory unchanged.
* Step 2 holds 3 by product-level quantity, allocating no Cert record.

---

## g10adm.inventory-catalog.US72: Operator configures card schemas and imports products

**As an** inventory admin,
**I want** to define card schemas from one shared template and upload
product rows separately from stock, then mark valid products created,
**so that** every product has a mapped identity and valid structured facts before inventory is added.

<!-- trace:case id=g10adm.inventory-catalog.TC-lzo rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### g10adm.inventory-catalog.US72-TC1: A card schema comes from one shared template, mapped onto existing tags

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* Rows with the broad Category TCG carry Set values Pokémon, Lorcana and One Piece; existing IP, Item and Category tags stand.

**Steps:**

1. On the product schemas, map each source key, Category with Set, to one existing tuple.
2. Try to map Category TCG alone onto those tuples.
3. Create a schema from the card template, and read its fields and mapping.

**Expected Results:**

* Step 2 is refused, its rows resolving to several tuples.
* Year is a required number, Set and Subject required text, Card Number and Variety optional text; the workbook Item cell is the product name, not the Item tag; no Serial, Cert ID, Grade Issuer, Grade or Autograph Grade is an attribute; no tag was created.

<!-- trace:case id=g10adm.inventory-catalog.TC-7vt rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### g10adm.inventory-catalog.US72-TC2: A schema manifest imports as drafts, the published schema staying active

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* A published schema stands for an existing tuple; the manifest holds valid definitions from the card template.

**Steps:**

1. Upload the manifest, mapping Category TCG with Set Pokémon to the tuple; preview and import it.
2. Read the schema's revisions and the active one.

**Expected Results:**

* The imported revision is a draft, unpublished until the publish flow; the published schema stays active.

<!-- trace:case id=g10adm.inventory-catalog.TC-01d rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### g10adm.inventory-catalog.US72-TC3: An invalid schema manifest creates no revision

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* The manifest holds one valid row and one with an invalid attribute definition; the Category-only TCG key, ambiguous, is unmapped.

**Steps:**

1. Upload it, read the validation, and try to import.
2. Read the schema's revisions.

**Expected Results:**

* Validation names the rows and their reasons; no revision is created and the published schemas stay active.

<!-- trace:case id=g10adm.inventory-catalog.TC-arw rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### g10adm.inventory-catalog.US72-TC4: A product upload makes one draft per card identity, and no stock

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* A published card schema stands for the mapped tuple; `<workbook>`.

**Test data:**

| `<workbook>` | `<products>` |
| --- | --- |
| two sheets of repeated identical rows and one different identity | two, the repeated rows resolving to one |
| rows sharing a name and tuple, one pair differing by Card Number and another by Set | one per distinct Card Number and Set, the shared name neither merging nor blocking them |

**Steps:**

1. Upload the workbook on the products page, mapping Category with a distinguishing field to one tuple; review and confirm.
2. Mark each valid draft created; read the products and their inventories.

**Expected Results:**

* It makes `<products>`, each a draft until marked created; no stock, unit record or Cert ID is created.

<!-- trace:case id=g10adm.inventory-catalog.TC-ii9 rev=2 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### g10adm.inventory-catalog.US72-TC5: A product upload with an incomplete row creates nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* A published schema stands for one tuple; the workbook holds a valid row and one missing a required value; the Category-only TCG key is unmapped.

**Steps:**

1. Upload it, read the validation, and try to commit; read the product list.

**Expected Results:**

* Validation names the unmapped label and the invalid row; no product is created or changed.

<!-- trace:case id=g10adm.inventory-catalog.TC-vud rev=1 covers=g10adm.inventory-catalog.SC-ml0,g10adm.inventory-catalog.SC-p05,g10adm.inventory-catalog.SC-30a,g10adm.inventory-catalog.SC-ikp,g10adm.inventory-catalog.SC-hqo,g10adm.inventory-catalog.SC-1d9,g10adm.inventory-catalog.SC-3c8,g10adm.inventory-catalog.SC-t1v -->
### g10adm.inventory-catalog.US72-TC7: Mapped values are trimmed and blank placeholders read as absent

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-72

**Pre-conditions:**

* A published card schema stands; one row pads Year, Set and Subject, with Card Number - and Variety blank; another has Set -.

**Steps:**

1. Upload the workbook, map it, and read the preview and the source workbook.

**Expected Results:**

* The padded values are trimmed; the blank and - optional values read absent, and the required Set - is reported missing, holding the commit; the workbook is unchanged.

---

## g10adm.inventory-catalog.US73: Operator bulk imports matched inventory units

**As an** inventory admin,
**I want** to upload physical copy rows against existing products,
**so that** inventory counts and copy-level facts are recorded together after I review the matches.

<!-- trace:case id=g10adm.inventory-catalog.TC-4u2 rev=2 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### g10adm.inventory-catalog.US73-TC1: An inventory upload previews each copy against its product, and commits together

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* Each row of the workbook, one per copy with Cert ID, Grade Issuer, Grade, Autograph Grade and Serial, matches one created product.

**Steps:**

1. On the inventory bulk upload, upload and map it, and review the matches and copy facts.
2. Confirm, and read the counts, unit records and history.

**Expected Results:**

* Each row resolves to one product and one unit, its copy facts stored on the unit; counts rise by the rows included, the batch committed together.

<!-- trace:case id=g10adm.inventory-catalog.TC-i75 rev=2 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### g10adm.inventory-catalog.US73-TC2: Each row of blank status asks its own choice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* Two rows have a blank Item Status: a RAW row without Cert ID, and a graded row with one.

**Steps:**

1. Upload it, and try to continue without choosing.
2. Include the RAW row and exclude the graded one; confirm, and read the counts and units.

**Expected Results:**

* Step 1 asks a choice per row, with no batch-wide default.
* Step 2 accepts the RAW unit without Cert ID; the excluded row adds nothing.

<!-- trace:case id=g10adm.inventory-catalog.TC-rr6 rev=2 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### g10adm.inventory-catalog.US73-TC3: One invalid row blocks the whole inventory upload

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* The workbook holds a valid row and `<invalid>`.

**Test data:**

| `<invalid>` | `<validation names>` |
| --- | --- |
| a row matching no product, and one matching two | both rows |
| a row with Cert ID ` PSA-123 `, which the product already holds | the duplicate PSA-123, trimmed |
| a row whose Year is not a number | the Year |
| a RAW row with Cert ID RAW-001, and a graded PSA row with none | both, by grading status |

**Steps:**

1. Upload it, read the validation, and try to commit; read the counts, units and history.

**Expected Results:**

* Validation names `<validation names>`; nothing from the upload is committed.

<!-- trace:case id=g10adm.inventory-catalog.TC-4v4 rev=1 covers=g10adm.inventory-catalog.SC-3ab,g10adm.inventory-catalog.SC-1c7,g10adm.inventory-catalog.SC-crr,g10adm.inventory-catalog.SC-dc8,g10adm.inventory-catalog.SC-bc7,g10adm.inventory-catalog.SC-4hn,g10adm.inventory-catalog.SC-sfn -->
### g10adm.inventory-catalog.US73-TC6: Copy facts are trimmed and blank placeholders read as absent

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-73

**Pre-conditions:**

* A RAW row has a blank Cert ID and Grade, Autograph Grade and Serial of -.

**Steps:**

1. Upload it, review the copy facts, confirm, and read the unit and the workbook.

**Expected Results:**

* The Cert ID stays absent, and the - facts are absent rather than text; one unit is committed and the workbook is unchanged.

---

## g10adm.inventory-catalog.US74: Inventory admin prepares reusable product media

**As an** inventory admin,
**I want** to attach, order, replace, and remove photographs and video on a
catalogue product,
**so that** Auction operators can begin a listing with material already
prepared for that product.

<!-- trace:case id=g10adm.inventory-catalog.TC-tf3 rev=1 covers=g10adm.inventory-catalog.SC-nmq,g10adm.inventory-catalog.SC-w9x,g10adm.inventory-catalog.SC-hwk,g10adm.inventory-catalog.SC-vz9,g10adm.inventory-catalog.SC-qs1 -->
### g10adm.inventory-catalog.US74-TC1: A product keeps an ordered gallery

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-74

**Pre-conditions:**

* An inventory admin is editing a product with no media.

**Steps:**

1. Add supported assets, reorder them, and save.

**Expected Results:**

* The product keeps the chosen order and offers the assets to Auction.

---
## g10adm.inventory-catalog.US75: Inventory admin writes a product's name and description in each language

**As an** inventory admin,
**I want** to enter a product's name and description in Traditional and Simplified Chinese beside the English,
**so that** the product reads in the collector's language wherever it is shown.

<!-- trace:case id=g10adm.inventory-catalog.TC-pdl rev=1 covers=g10adm.inventory-catalog.SC-99k -->
### g10adm.inventory-catalog.US75-TC1: An inventory admin writes all three languages on a product and reads them back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* Product 1 is named Charizard Holo, with no description and no translation.

**Steps:**

1. Open its editor; enter the English description Base Set holographic card., the Traditional Chinese 噴火龍 閃卡 and 基本系列閃卡。, and the Simplified Chinese 喷火龙 闪卡 and 基本系列闪卡。; save.
2. Reload the editor, and read each language.

**Expected Results:**

* Step 1 saves; step 2 shows each name and description as entered.

<!-- trace:case id=g10adm.inventory-catalog.TC-6mu rev=1 covers=g10adm.inventory-catalog.SC-v1f -->
### g10adm.inventory-catalog.US75-TC2: The English name alone makes a product

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* An inventory admin is on the products list.

**Steps:**

1. Add a product with the English name Charizard Holo and no other text, filling the other fields it needs; save.
2. Reload its editor, and read each language.

**Expected Results:**

* It saves; the English name reads as entered, every other text empty.

<!-- trace:case id=g10adm.inventory-catalog.TC-xu1 rev=1 -->
### g10adm.inventory-catalog.US75-TC4: A translated name at its limits is kept whole

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* Product 1 is named Charizard Holo, with no translation.

**Test data:**

| `<language>` | `<name>` |
| --- | --- |
| Traditional Chinese | 200 Chinese characters |
| Simplified Chinese | 1 Chinese character |

**Steps:**

1. Enter `<name>` as the `<language>` name, save, reload and read it.

**Expected Results:**

* It saves, every character kept.

<!-- trace:case id=g10adm.inventory-catalog.TC-of2 rev=1 covers=g10adm.inventory-catalog.SC-ia2 -->
### g10adm.inventory-catalog.US75-TC3: A translation is refused without the English name, or past the English text's limits

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* An inventory admin `<on>`.

**Test data:**

| `<on>` | `<entered>` | `<refusal names>` |
| --- | --- | --- |
| adds a product | the Traditional Chinese name 噴火龍 閃卡 and no English name | the English name, no product added |
| edits product 1 | a Traditional Chinese name of 201 characters | the name field |
| edits product 1 | a Simplified Chinese name of 201 characters | the name field |
| edits product 1 | a Traditional Chinese description of 2,001 characters | the description field |

**Steps:**

1. Enter `<entered>`, save, then reload.

**Expected Results:**

* The save is refused, naming `<refusal names>`; nothing of it is kept.

<!-- trace:case id=g10adm.inventory-catalog.TC-piz rev=1 covers=g10adm.inventory-catalog.SC-v7f -->
### g10adm.inventory-catalog.US75-TC6: A blank translation counts as not written

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-75

**Pre-conditions:**

* Product 2 holds the English and the Traditional Chinese name and description.

**Test data:**

| `<field>` | `<input>` |
| --- | --- |
| the Traditional Chinese name | cleared |
| the Traditional Chinese name | 3 spaces |
| the Traditional Chinese description | 3 spaces |

**Steps:**

1. Set `<field>` to `<input>`, save, and choose Traditional Chinese in the product page's Details.

**Expected Results:**

* It saves; `<field>` shows the English text marked as the fallback, the other text as written.

<!-- trace:case id=g10adm.inventory-catalog.TC-8ef rev=1 -->
### g10adm.inventory-catalog.US75-TC7: A catalogue upload and a save without translations leave them alone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What staff and imports keep

**Pre-conditions:**

* Product 2, created, holds all three languages, a grade, a set and a Cert ID.

**Test data:**

| `<then>` |
| --- |
| a catalogue upload with one row matching it and no translated text |
| a save of its remarks naming no translation |

**Steps:**

1. Make `<then>`, and read the result and the editor.

**Expected Results:**

* No second product is added; every translation reads as written, and the grade, set and Cert ID are unchanged.

<!-- trace:case id=g10adm.inventory-catalog.TC-d8p rev=1 -->
### g10adm.inventory-catalog.US75-TC8: Lists, history and holds keep the English name

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What staff and imports keep

**Pre-conditions:**

* Product 2 holds all three languages and a hold taken by a draft listing.

**Steps:**

1. Read its row in the product list, and the history entry naming the hold.

**Expected Results:**

* Both read Charizard Holo, showing neither Chinese name.

---

## g10adm.inventory-catalog.US76: Inventory admin reads a product's texts in each language

**As an** inventory admin,
**I want** to switch the product page's Details section between languages and see which ones I have not written,
**so that** I can check each language and fill the gaps.

<!-- trace:case id=g10adm.inventory-catalog.TC-qkd rev=1 covers=g10adm.inventory-catalog.SC-4vd -->
### g10adm.inventory-catalog.US76-TC1: One choice switches the name and the description together, opening in English again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-76

**Pre-conditions:**

* Product 2 holds all three languages.

**Steps:**

1. Open its page, and read Details; choose Traditional Chinese, then Simplified Chinese, reading each.
2. Reload, and read Details' language.

**Expected Results:**

* Each choice shows that language's name and description together, none marked as a fallback.
* Step 2 opens in English again.

<!-- trace:case id=g10adm.inventory-catalog.TC-tb5 rev=1 covers=g10adm.inventory-catalog.SC-lj3 -->
### g10adm.inventory-catalog.US76-TC2: A language missing one text marks only that text as the fallback

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-76

**Pre-conditions:**

* Product 3 holds `<held>`.

**Test data:**

| `<held>` | `<choice>` | `<reads>` |
| --- | --- | --- |
| the English texts and a Traditional Chinese name | Traditional Chinese | 噴火龍 閃卡 unmarked; the English description marked as the fallback |
| a Traditional Chinese description and an empty English description | Traditional Chinese | the Traditional Chinese description; for the name, the English, marked |
| a Traditional Chinese description and an empty English description, no Simplified Chinese | Simplified Chinese | an empty description, the English name marked |

**Steps:**

1. Open its page, and choose `<choice>` in Details.

**Expected Results:**

* It reads `<reads>`.

<!-- trace:case id=g10adm.inventory-catalog.TC-bbu rev=1 covers=g10adm.inventory-catalog.SC-70a -->
### g10adm.inventory-catalog.US76-TC3: A Chinese choice with no text reads the English, never the other Chinese

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-76

**Pre-conditions:**

* Product `<product>`.

**Test data:**

| `<product>` | `<choice>` |
| --- | --- |
| 4 holds English texts only | Traditional Chinese |
| 4 holds English texts only | Simplified Chinese |
| 3 holds English and Traditional Chinese texts, no Simplified Chinese | Simplified Chinese |

**Steps:**

1. Open its page, choose `<choice>` in Details, then English.

**Expected Results:**

* `<choice>` shows the English name and description, both marked as the fallback, with no Traditional Chinese character; English shows them unmarked.

---

## g10adm.inventory-catalog.US77: Inventory admin finds a product by a translated name

**As an** inventory admin,
**I want** the product search to match a name in any language,
**so that** I find the product from whichever name a colleague quotes.

<!-- trace:case id=g10adm.inventory-catalog.TC-29r rev=1 covers=g10adm.inventory-catalog.SC-j29,g10adm.inventory-catalog.SC-7lv -->
### g10adm.inventory-catalog.US77-TC1: A part of a name in any language finds the product, listed once

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-77

**Pre-conditions:**

* Product 5 is named Charizard Holo, 噴火龍 Pokémon 閃卡 and 喷火龙 闪卡; product 6 Charizard Holo and Charizard 噴火龍; no other product holds the fragments.

**Test data:**

| `<fragment>` | `<lists>` |
| --- | --- |
| harizard | products 5 and 6 |
| 噴火龍 | products 5 and 6 |
| 喷火龙 | product 5 |
| pokémon | product 5 |
| Charizard | product 6 among them, once |

**Steps:**

1. Search `<fragment>`.

**Expected Results:**

* It lists `<lists>`, each once, under its English name.

<!-- trace:case id=g10adm.inventory-catalog.TC-s9o rev=1 -->
### g10adm.inventory-catalog.US77-TC3: Search does not fold Traditional and Simplified Chinese, nor read a description

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-77

**Pre-conditions:**

* Product 7 is named Charizard Holo and 噴火龍 閃卡, no Simplified Chinese name; its Traditional Chinese description holds 首版.

**Steps:**

1. Search 喷火龙, then 首版, then 噴火龍.

**Expected Results:**

* The first two do not list product 7; the third does.

<!-- trace:case id=g10adm.inventory-catalog.TC-idw rev=1 -->
### g10adm.inventory-catalog.US77-TC4: An edit or a clear moves what the search finds

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-catalog-US-77

**Pre-conditions:**

* Product 8's Traditional Chinese name is 噴火龍 初版.

**Steps:**

1. Change it to 水箭龜 初版 and save; search 噴火龍, then 水箭龜.
2. Clear it and save; search 水箭龜.

**Expected Results:**

* Step 1 finds it by 水箭龜 and not 噴火龍.
* Step 2 does not find it.

## Settled

- Product-gallery management uses existing inventory-admin authorization; unauthorized requests are refused.
- **Remarks on a reserve** - Remarks is the entry's own reason, so an admin hold's reserve entry reads `—` (Q17)
- **Holder kind** - read as Auction, Vault or Admin; the stored kind and reference are unchanged (Q16)
- **A corrected-away Cert ID** — once a record is corrected, no record holds its old Cert ID, so the product may give it again; uniqueness reads the Cert IDs records hold now
- **The record's own Cert ID** — refused like any Cert ID a record of the product holds; the record itself counts
- **A Cert ID a sold, withdrawn or vaulted record holds** — refused on a correction and an assignment like any other, and the refusal names that unit and its status; a card that comes back goes through intake, which brings back its record and its history
- **Letter case** — Cert IDs are compared exactly after trimming, so `psa-1243` and `PSA-1243` are different Cert IDs
- **`No Cert ID` as a Cert ID** — refused in any letter case after trimming, on a correction and an assignment
- **Which Cert records change** — only one that is available and that no hold, active or closed, has ever named; a record once held, listed, sold, withdrawn or vaulted keeps its Cert ID, even when it is available again
- **An Auction listing after a correction** — no listing shows a changed Cert ID, since a record that was ever listed or reserved cannot change
- **The available `No Cert ID` row** — shown whenever regular stock has any history, reading 0 when no unit is free; not shown when regular stock has none; a product with no row shows one line saying no unit is on hand
- **Copy facts in Cert ID details** — not shown; the page shows Cert ID, status, holder and quantity; a correction keeps the record's facts, read in the history entry's snapshot, and an assigned record carries none
- **Vaulted regular stock** — not listed, with sold and withdrawn; a vaulted Cert record is listed as Vaulted
- **One regular stock history** — every `No Cert ID` row, available or held, shows the same regular stock history; the Cert ID change that numbered a unit shows there and opens the new record's own history
- **Holder on a hold row** — Auction, Vault or Admin, then the hold's label, else its reference, as the product page reads them
- **A corrected or assigned Cert ID** — the intake rules: required, trimmed and unique on the product, with no pattern, and never `No Cert ID`
- **Copy facts sent with an assignment** — a Grade Issuer, Grade, Autograph Grade or Serial sent from outside the page is ignored, whatever its value, a `RAW` Grade Issuer, a Serial that is not text and an over-long Grade included; the record is created with none and the assignment is not refused for them
- **A unit's history** — the columns of the product's history: When, Action, Quantity, Actor, Holder and Remarks
- **Regular stock at 0** — the available `No Cert ID` row reading 0 is still listed and offers no `Reduce quantity`: a reduction takes a whole number from 1 to the reducible count, and there is none (Q8)
- **No other ceiling** — a reduction takes any whole number from 1 to the reducible count in one entry, however large (Q8)
- **Regular stock after a move** — the units intaken since regular stock last moved can be reduced, less those given a Cert ID or reduced since, never more than available; units intaken before it cannot. Regular stock that never moved counts from its first intake. Every step of a hold naming no Cert record is a move, its release included, and so is a sale or withdrawal of available regular stock (Q2, Q12)
- **The action names** — `Reduce quantity` on the available `No Cert ID` row and `Remove` on a Cert record that has only been intaken, each with a tooltip saying it takes out units intaken by mistake as if never received and that withdrawn does not move; `Remove physical unit` stays only on a record that has moved (Q14)
- **The number of units** — opens empty; Confirm stays unavailable until a whole number from 1 to the reducible count is entered, and the confirmation states that count (Q15, Q18)
- **Remarks of spaces only** — read as empty, since every remarks field is trimmed; Confirm stays unavailable (Q4)
- **A removed Cert record in the regular stock history** — not shown, a record numbered from regular stock included; a Cert record's removal shows in the product's history (Q7)
- **The media line** — every Cert record's confirmation says its tagged media are deleted, whether or not any are tagged to it (Q11)
- **Which Cert records reverse** — the records whose Cert ID can be corrected: available, and never named by a hold, active or closed, a hold since moved to another product included, nor sold, withdrawn or vaulted (Q5)
- **Remove physical unit's reason** — asked in its own confirmation, which names the Cert ID; Confirm stays unavailable while the reason is blank, and cancelling changes nothing (Q19)
- **One removal per Cert record** — Remove physical unit is offered only on an Available record that has moved and no active hold names; a record that has only been intaken offers the reversal instead (Q3)
- **A Cert record's moves and regular stock** — a sold or held Cert record leaves regular stock reducible, one given its Cert ID from regular stock included, and moved regular stock leaves an unmoved Cert record removable (Q2, Q5, Q13)
- **What falls** — stock, available and the ledger fall by the units taken out; reserved, sold, withdrawn and vaulted stay the same (Q1)
- **A removed Cert ID** — free on the product, so a later intake takes it as a new record whose history starts at that intake (Q6)
- **An inventory workbook import** — an intake: its history entry is an `intake`, the one action the history gives stock received. Regular stock it adds is reducible as any intake's, and a Cert record it creates, available, has only been intaken and offers `Remove` (the history's Action list; the reduction requirement's moves, where an intake is not one)
- **Remove physical unit sent for a record that has only been intaken** — refused from outside the page as on it; stock, withdrawn, the record, its media and the history stay as they were (the Cert record requirement: physical removal needs a record that has moved)
- **An intake reversal's Quantity and Holder** — Quantity reads the units taken out as a positive number, one for a Cert record; Holder reads `—`, since a reversal names no hold (the history fields; the product history's columns)
- **A hold of regular stock moved to another product** — a move of regular stock on both products: the one it left, where it named no Cert record, and the one it joined, where it names none (the reduction requirement's moves)

