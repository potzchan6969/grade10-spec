# grade10-admin/inventory/catalog — delta

## Purpose

Gives Grade10 one stock snapshot per catalogue product, quantity-based
application reservations with remaining / sold / vaulted / released tracking,
admin oversight by explicit `holder_kind`, an append-only trace of every count
transition, and an ordered reusable media gallery for Auction listings whose
source items stay shared at product level or associate with one physical Cert
record. An inventory admin also writes a product's name and description in English, Traditional Chinese and Simplified Chinese, reads each back on the product page, and finds a product by a name in any language.

## Feature set

- Product texts in each language
  - Entered per language: the product editor takes a name and a description in English, Traditional Chinese and Simplified Chinese
  - English is the base: only the English name is required, and a translation holds the same limits
  - Empty translation: a blank or whitespace-only translation counts as not written
  - Details section: the product page's Details section shows the name and description in a language chosen once for the section, marking a language with no text as the English fallback
- What staff and imports keep
  - English name stays: lists, history, holds and every staff reference stay on the English name
  - Imports leave translations: a catalogue upload or edit never overwrites or clears a translation
- Product search
  - Translated names: the product search matches the English name and every translated name

## ADDED Requirements

### Requirement: A product's name and description are written in each language

An authorized inventory admin SHALL be able to write, beside a product's
English name and description, a name and a description in Traditional Chinese
(`zh-Hant`) and in Simplified Chinese (`zh-Hans`), on the product editor, for a
`draft` or a `created` product. Only the English name is required, and an
English description may be empty, as today. A translation is optional: a name
of at most 200 characters, trimmed and then counted, and a description of at
most 2,000 characters, trimmed; the English description sets no limit. A translated name or description that is empty
or only spaces counts as not written and is stored as none, not refused.

An update that omits the translations SHALL leave every stored one unchanged;
one that names them SHALL replace all of them. Only the name and the
description translate: grade, Cert ID, set and every other typed value stay as
they are.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-99k rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-200 - An inventory admin writes a name and description in each language
**Serves:** grade10-admin-inventory-catalog-US-75 - Inventory admin writes a product's name and description in each language

- **GIVEN** a draft product with an English name and description
- **WHEN** an authorized inventory admin saves a Traditional Chinese and a Simplified Chinese name and description from the product editor
- **THEN** Grade10 stores all three names and all three descriptions
- **AND** the English name and description are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-v1f rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-201 - A product is created with the English name alone
**Serves:** grade10-admin-inventory-catalog-US-75 - Inventory admin writes a product's name and description in each language

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with an English name and no description or translation
- **THEN** Grade10 creates the draft product
- **AND** it reads in every language as it did before translations existed

<!-- trace:scenario id=g10adm.inventory-catalog.SC-ia2 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-202 - A translation without the English name is refused
**Serves:** grade10-admin-inventory-catalog-US-75 - Inventory admin writes a product's name and description in each language

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with a Traditional Chinese name and an empty English name
- **THEN** Grade10 refuses the create
- **AND** no product or inventory is persisted

<!-- trace:scenario id=g10adm.inventory-catalog.SC-4yk rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-203 - A translation holds the limits of the English text
**Serves:** grade10-admin-inventory-catalog-US-75 - Inventory admin writes a product's name and description in each language

- **GIVEN** a draft product
- **WHEN** an authorized inventory admin saves a Traditional Chinese name of 201 characters
- **THEN** Grade10 refuses the save and stores no translation
- **WHEN** they save a Simplified Chinese name of 200 characters with a space before and after it
- **THEN** Grade10 stores it trimmed, as the English name is counted after trimming

<!-- trace:scenario id=g10adm.inventory-catalog.SC-v7f rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-204 - A blank translation counts as not written
**Serves:** grade10-admin-inventory-catalog-US-75 - Inventory admin writes a product's name and description in each language

- **GIVEN** a draft product
- **WHEN** an authorized inventory admin saves a Traditional Chinese name and a Simplified Chinese description made only of spaces
- **THEN** Grade10 stores no Traditional Chinese name and no Simplified Chinese description
- **AND** the Details section marks both languages as the English fallback

<!-- trace:scenario id=g10adm.inventory-catalog.SC-2ie rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-205 - Saving without translations leaves them
**Serves:** grade10-admin-inventory-catalog-US-75 - Inventory admin writes a product's name and description in each language

- **GIVEN** a created product holding a Traditional Chinese name and description
- **WHEN** an authorized inventory admin updates its remarks and names no translations
- **THEN** the remarks change
- **AND** the Traditional Chinese name and description are unchanged

<!-- trace:scenario id=g10adm.inventory-catalog.SC-yp5 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-206 - Only the name and the description translate
**Serves:** grade10-admin-inventory-catalog-US-75 - Inventory admin writes a product's name and description in each language

- **GIVEN** a product with a grade, a set and a Cert ID
- **WHEN** an authorized inventory admin writes a name and description in each language
- **THEN** the product's grade, set, Cert ID and every other typed value are unchanged
- **AND** the editor offers no translation of them

### Requirement: The Details section reads a product's texts in one chosen language

The product page's Details section SHALL show the product's name and
description in a language chosen once for the section: English, Traditional
Chinese or Simplified Chinese. The section SHALL open in English. Each text
SHALL fall back on its own: a field with no text in the chosen language shows
the English text of that field, marked as the English fallback, and one Chinese
SHALL never stand in for the other.

Where the English text is empty and a Chinese text is written, a language with no
text shows an empty text, not marked as a fallback.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-4vd rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-207 - One choice switches the name and the description together
**Serves:** grade10-admin-inventory-catalog-US-76 - Inventory admin reads a product's texts in each language

- **GIVEN** a product with a name and a description in each language
- **WHEN** an inventory admin opens its page and chooses Traditional Chinese for the Details section
- **THEN** the name and the description both show their Traditional Chinese text
- **AND** the section opened in English before the choice

<!-- trace:scenario id=g10adm.inventory-catalog.SC-lj3 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-208 - A language with no text shows the English text marked as the fallback
**Serves:** grade10-admin-inventory-catalog-US-76 - Inventory admin reads a product's texts in each language

- **GIVEN** a product with a Simplified Chinese name and no Simplified Chinese description
- **WHEN** an inventory admin chooses Simplified Chinese
- **THEN** the name shows its Simplified Chinese text with no mark
- **AND** the description shows the English description, marked as the English fallback

<!-- trace:scenario id=g10adm.inventory-catalog.SC-70a rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-209 - The other Chinese is never borrowed
**Serves:** grade10-admin-inventory-catalog-US-76 - Inventory admin reads a product's texts in each language

- **GIVEN** a product with a Traditional Chinese name and no Simplified Chinese text
- **WHEN** an inventory admin chooses Simplified Chinese
- **THEN** the name shows the English name, marked as the English fallback

<!-- trace:scenario id=g10adm.inventory-catalog.SC-8a9 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-218 - A language with no text over an empty English description shows an empty text
**Serves:** grade10-admin-inventory-catalog-US-76 - Inventory admin reads a product's texts in each language

- **GIVEN** a product with a Traditional Chinese description and an empty English description
- **WHEN** an inventory admin chooses Traditional Chinese, and then Simplified Chinese, for the Details section
- **THEN** Traditional Chinese shows its description
- **AND** Simplified Chinese shows an empty description, not marked as a fallback

### Requirement: Staff references and imports keep the English name

Product lists, change history, holds and every staff reference SHALL name a
product by its English name. A catalogue upload or an edit made by import SHALL
never overwrite or clear a translation, and no sync or import SHALL write one.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-xoy rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-210 - Lists, history and holds keep the English name
**Serves:** What staff and imports keep - English name stays

- **GIVEN** a product with a Traditional Chinese name that holds a reservation and has a history entry
- **WHEN** an inventory admin reads the product list, the history and the holds
- **THEN** each names the product by its English name

<!-- trace:scenario id=g10adm.inventory-catalog.SC-dln rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-211 - A catalogue upload leaves translations alone
**Serves:** What staff and imports keep - imports leave translations

- **GIVEN** a created product holding Traditional Chinese and Simplified Chinese names and descriptions
- **WHEN** an authorized inventory admin commits a product upload whose rows resolve to that product
- **THEN** the product's translations are exactly as they were
- **AND** a product the upload creates has none

### Requirement: The product search finds a product by a translated name

The inventory product search SHALL match a product whose English name or any
translated name holds the typed term, anywhere in the name and in any case,
whichever language the admin types. It SHALL match names only: a description
is not searched, and Traditional and Simplified Chinese are not folded into
each other. Every other arm of the search is unchanged, and a product found by
a translated name SHALL show its English name in the list.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-j29 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-212 - A translated name finds the product
**Serves:** grade10-admin-inventory-catalog-US-77 - Inventory admin finds a product by a translated name

- **GIVEN** a product with the Traditional Chinese name "噴火龍 首版" and another with an unrelated name
- **WHEN** an authorized inventory admin searches the product list for "噴火龍"
- **THEN** only the first product is listed
- **AND** its row shows its English name

<!-- trace:scenario id=g10adm.inventory-catalog.SC-7lv rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-213 - A Simplified Chinese name and the English name both find the product
**Serves:** grade10-admin-inventory-catalog-US-77 - Inventory admin finds a product by a translated name

- **GIVEN** a product named "Charizard Holo" with the Simplified Chinese name "喷火龙 闪卡"
- **WHEN** an inventory admin searches for "喷火龙" and then for "charizard"
- **THEN** the product is listed both times

<!-- trace:scenario id=g10adm.inventory-catalog.SC-r9e rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-214 - A description is not searched and the scripts are not folded
**Serves:** grade10-admin-inventory-catalog-US-77 - Inventory admin finds a product by a translated name

- **GIVEN** a product whose Traditional Chinese description holds "首版" and whose only Chinese name is the Traditional Chinese "噴火龍"
- **WHEN** an inventory admin searches for "首版" and then for the Simplified Chinese spelling "喷火龙"
- **THEN** the product is listed for neither search

<!-- trace:scenario id=g10adm.inventory-catalog.SC-6xr rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-215 - A product nobody translated shows the English text in each Chinese choice
**Serves:** grade10-admin-inventory-catalog-US-76 - Inventory admin reads a product's texts in each language

- **GIVEN** a product with an English name and description and no translation
- **WHEN** an inventory admin chooses Traditional Chinese and then Simplified Chinese for the Details section
- **THEN** each choice shows the English name and description, each marked as the English fallback

<!-- trace:scenario id=g10adm.inventory-catalog.SC-fi4 rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-216 - An edit or a clear moves what the search finds
**Serves:** grade10-admin-inventory-catalog-US-77 - Inventory admin finds a product by a translated name

- **GIVEN** a product found by its Traditional Chinese name "噴火龍"
- **WHEN** an inventory admin changes that name to "水箭龜" and searches for each
- **THEN** only "水箭龜" finds the product
- **WHEN** they clear the translated name and search for "水箭龜"
- **THEN** the product is not listed

<!-- trace:scenario id=g10adm.inventory-catalog.SC-00r rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-217 - A translated description holds 2,000 characters
**Serves:** grade10-admin-inventory-catalog-US-75 - Inventory admin writes a product's name and description in each language

- **GIVEN** a draft product
- **WHEN** an authorized inventory admin saves a Traditional Chinese description of 2,001 characters
- **THEN** Grade10 refuses the save and stores no translation
- **WHEN** they save a Simplified Chinese description of 2,000 characters
- **THEN** Grade10 stores it

## MODIFIED Requirements

### Requirement: Operators list and edit products

An authorized inventory admin SHALL list every product with status, stock,
derived ledger, available, reserved, vaulted, sold, and withdrawn. They
SHALL update a product's name, description, remarks and translated names and
descriptions without changing inventory counts, id, created at, created by, or
status. An update SHALL refresh product updated at.

<!-- trace:scenario id=g10adm.inventory-catalog.SC-d4r rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-13 - Operator lists products with aggregate counts
**Serves:** Admin console - operator lists products with aggregate counts

- **GIVEN** two products with different inventory snapshots and statuses
- **WHEN** an authorized inventory admin lists products
- **THEN** both products appear with status and all stored counts plus derived
  available and ledger
- **AND** each row's counts satisfy both reconciliation equations

<!-- trace:scenario id=g10adm.inventory-catalog.SC-cfb rev=1 -->
#### Scenario: grade10-admin-inventory-catalog-SC-57 - Operator edits product fields
**Serves:** Admin console - operator edits product fields

- **GIVEN** a draft or created product
- **WHEN** an authorized inventory admin updates name, description, and
  remarks
- **THEN** those fields match the input
- **AND** status and inventory counts are unchanged
- **AND** updated at advances
