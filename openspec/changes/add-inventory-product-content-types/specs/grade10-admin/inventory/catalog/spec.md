## Feature set

- Product classification
  - Universal tags: require IP, Item, and Category on every product and expose them to search and filter
  - Product schema: select the exact IP + Item + Category rules that describe a product
  - Structured values: store validated facts with language-aware labels and values
- CMS configuration
  - Reusable fields: define stable keys, data types, validation, and displayed labels once
  - Product schemas: select product attributes, requiredness, and translations for an IP + Item + Category tuple
  - Publishing: validate affected products before a configuration becomes active
- Auction discovery
  - Search and filter: use universal and product-schema attributes, including optional attributes when a value exists
  - Listing attributes: store Auction-specific values without making them search or filter criteria
  - Presentation: choose and order the product and listing attributes shown for each product schema

## MODIFIED Requirements

### Requirement: Product record fields

A product SHALL carry the fields below. Creating a product SHALL also seed
exactly one inventory snapshot with every stored count set to zero and status
`draft`. An authorized inventory admin SHALL mark a `draft` product `created`
only when its universal IP, Item, and Category classification is complete, an
exact published product schema exists for its IP + Item + Category tuple, and every
required attribute value satisfies that product schema. Marking `created` is one-way
(`created` → `draft` is refused). Holder reserve and adjust-up SHALL require
product status `created`. Intake SHALL require product status `created`.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Name | Trimmed, 1 to 200 characters |
| Description | Trimmed text, may be empty |
| Status | `draft` or `created`; create defaults to `draft` |
| Product schema | The published product schema for the product's exact IP + Item + Category tuple; absent when no matching product schema exists; system-selected, not independently editable |
| Created at | Set on create, immutable |
| Updated at | Set on every successful product update or status change |
| Created by | Operator user id at create, immutable |
| Remarks | Trimmed text, may be empty |

#### Scenario: grade10-admin-inventory-catalog-SC-01 - Operator creates a draft product with empty inventory

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with a valid name
- **THEN** Grade10 persists the product with a new id and status `draft`
- **AND** creates exactly one inventory snapshot whose counts are zero
- **AND** created by is that operator

#### Scenario: grade10-admin-inventory-catalog-SC-02 - Product create without a name is refused

- **GIVEN** an authorized inventory admin
- **WHEN** they create a product with an empty name
- **THEN** Grade10 refuses the create
- **AND** no product or inventory is persisted

#### Scenario: grade10-admin-inventory-catalog-SC-52 - Operator marks a draft product created

- **GIVEN** a draft product with complete universal classification and valid required values for its published product schema
- **WHEN** an authorized inventory admin marks it created
- **THEN** product status is `created`
- **AND** updated at advances
- **AND** one `product-update` history entry records the transition

#### Scenario: grade10-admin-inventory-catalog-SC-53 - Reserve requires a created product

- **GIVEN** a draft product whose inventory has available stock
- **WHEN** Auction reserves quantity one
- **THEN** Grade10 refuses because the product is not created
- **AND** no reservation is written

- **GIVEN** the same draft product
- **WHEN** an authorized inventory admin reserves quantity one from the product
  page or through `reservations.reserve`
- **THEN** Grade10 refuses for the same reason
- **AND** no reservation is written

#### Scenario: grade10-admin-inventory-catalog-SC-54 - Created to draft is refused

- **GIVEN** a created product
- **WHEN** an authorized inventory admin attempts to set status to `draft`
- **THEN** Grade10 refuses the change
- **AND** status remains `created`

## ADDED Requirements

### Requirement: Reusable product attributes carry localized labels and validation

An authorized inventory admin SHALL be able to define a reusable product attribute
with a stable key, a data type, validation rules, and a displayed label for
each supported locale. The initial Grade10 locale set SHALL be English (`en`),
Traditional Chinese (`zh-Hant`), and Simplified Chinese (`zh-Hans`); the set
SHALL be expandable without changing existing field keys or product values.

The data types SHALL be `text`, `number`, `boolean`, `single-select`, or
`multi-select`. Text fields MAY define length and pattern rules. Number fields
MAY define minimum and maximum rules. Select fields SHALL define stable option
keys and SHALL allow a displayed value for each option in each supported
locale. English SHALL be required for every field label and selectable value;
non-English translations SHALL be optional. A missing non-English translation
SHALL be reported to the admin and SHALL fall back to English when displayed.

| Field | Rules |
| --- | --- |
| Key | Required, trimmed, stable, and unique across reusable fields |
| Data type | One of `text`, `number`, `boolean`, `single-select`, or `multi-select`; immutable after a product uses the field |
| Label | One English label required; a label may be supplied for every supported locale; labels are displayed values, not field keys |
| Validation | Rules valid for the selected data type; invalid combinations refused |
| Options | Required for select fields; each option has a stable key and one English displayed value; non-English displayed values are optional |
| Search/filter | Enabled for attributes assigned as required or optional product attributes |

#### Scenario: grade10-admin-inventory-catalog-SC-69 - Operator defines a localized reusable field

- **GIVEN** an authorized inventory admin
- **WHEN** they define `card_number` as a text field with English, Traditional Chinese, and Simplified Chinese labels and a text pattern
- **THEN** Grade10 stores one reusable field with one stable key
- **AND** each supplied locale returns its own displayed label
- **AND** the attribute is available for assignment to product schemas

#### Scenario: grade10-admin-inventory-catalog-SC-70 - Invalid field definition is refused

- **GIVEN** an authorized inventory admin
- **WHEN** they define a field with an unsupported data type, invalid validation rule, duplicate key, or a select option without an English displayed value
- **THEN** Grade10 refuses the definition
- **AND** no invalid field or option is available for product entry

#### Scenario: grade10-admin-inventory-catalog-SC-71 - Missing non-English translations are reported without blocking publish

- **GIVEN** a reusable field has an English label and no Simplified Chinese label
- **WHEN** an authorized inventory admin reviews or publishes a product schema that uses it
- **THEN** the CMS reports the missing Simplified Chinese translation
- **AND** the product schema remains eligible for publishing
- **AND** Auction displays the English label when the active locale is Simplified Chinese

### Requirement: Product schemas configure exact IP, Item, and Category attributes

An authorized inventory admin SHALL be able to create a product schema for one
exact IP + Item + Category tuple. A product schema SHALL assign reusable
product attributes as `required` or `optional`, supply the displayed label for
every assigned attribute, and define the localized displayed values for any
select options it uses. A product schema SHALL have at most one published
configuration for an exact tuple.
The IP, Item, and Category tags SHALL all participate in selecting a content
type.

| Product-schema attribute | Rules |
| --- | --- |
| IP | One existing universal IP tag; required |
| Item | One existing universal Item tag; required |
| Category | One existing universal Category tag; required |
| Assigned attributes | Reusable product attributes, each assigned once with `required` or `optional` status |
| Displayed labels | One English label per assigned attribute required; translations optional; a product schema may override the reusable attribute's labels |
| Option values | Stable option keys with localized displayed values; English required, other supported locales optional |

#### Scenario: grade10-admin-inventory-catalog-SC-72 - Operator configures a Pokémon TCG product schema

- **GIVEN** reusable fields for language, card number, card set, grading, and PSA population
- **WHEN** an authorized inventory admin configures the exact `Pokémon` + `Single card` + `TCG` product schema
- **THEN** language, card number, card set, and grading can be assigned as required or optional attributes
- **AND** PSA population can be assigned as an optional attribute
- **AND** every assigned attribute has its own displayed label separate from its stable key

#### Scenario: grade10-admin-inventory-catalog-SC-73 - Duplicate published product schema for exact tuple is refused

- **GIVEN** a published product schema for the exact `Pokémon` + `Single card` + `TCG` tuple
- **WHEN** an authorized inventory admin attempts to publish another product schema for that exact tuple
- **THEN** Grade10 refuses the publish
- **AND** the existing published product schema remains active

### Requirement: Products store values that satisfy their product schema

When a product has an exact published product schema, an authorized inventory
admin SHALL be able to enter values for its assigned attributes while creating or
editing the product. A draft MAY omit required values and MAY be saved without
a matching product schema, but every value supplied SHALL satisfy its attribute's
data type and validation rules. A product SHALL NOT be marked `created` without
complete universal classification, a matching published product schema, and all
required values.

Product values SHALL retain the stable field key and the underlying value. A
text value MAY have one value per supported locale. A number or boolean SHALL
have one language-neutral value. A select value SHALL use its stable option
key, and a multi-select value SHALL use a set of stable option keys. When a
value is displayed, Grade10 SHALL use the active locale's value or fall back
to English when that translation is missing.

#### Scenario: grade10-admin-inventory-catalog-SC-74 - Product without a matching product schema remains a draft

- **GIVEN** an authorized inventory admin creates a product with valid universal classification but no published product schema for its IP + Item + Category tuple
- **WHEN** they save the product
- **THEN** Grade10 saves it as `draft`
- **AND** the product cannot be marked `created`
- **AND** no Auction reservation or listing may use it

#### Scenario: grade10-admin-inventory-catalog-SC-75 - Operator saves localized Pokémon TCG values

- **GIVEN** a published Pokémon + Single card + TCG product schema with required language, card number, card set, and grading attributes
- **WHEN** an authorized inventory admin supplies valid English, Traditional Chinese, and Simplified Chinese values where translations are available
- **THEN** Grade10 stores the values under their stable field keys
- **AND** each product read returns the field's displayed label and the value for the requested locale

#### Scenario: grade10-admin-inventory-catalog-SC-76 - Invalid structured value is refused

- **GIVEN** a product with a published product schema whose card number requires a configured pattern
- **WHEN** an authorized inventory admin supplies a value that fails that pattern or the field's data type
- **THEN** Grade10 refuses the product update
- **AND** the product's previous structured values remain unchanged

#### Scenario: grade10-admin-inventory-catalog-SC-77 - Missing required value blocks creation

- **GIVEN** a draft product with a published product schema and no grading value
- **WHEN** an authorized inventory admin attempts to mark it `created`
- **THEN** Grade10 refuses the status change
- **AND** reports grading as a missing required value

#### Scenario: grade10-admin-inventory-catalog-SC-78 - Missing optional value remains valid

- **GIVEN** a published Pokémon + Single card + TCG product schema where PSA population is optional
- **WHEN** an authorized inventory admin marks a product with no PSA population value `created`
- **THEN** Grade10 accepts the status change when all required values are valid
- **AND** the missing optional value remains absent

#### Scenario: grade10-admin-inventory-catalog-SC-79 - A missing locale falls back to English

- **GIVEN** a product has an English grading value and no Simplified Chinese grading translation
- **WHEN** Auction reads the product in Simplified Chinese
- **THEN** the English grading value is displayed
- **AND** no stable field key or raw translation key is displayed

### Requirement: Universal tags and product attributes are searchable and filterable

Auction SHALL support search and filter criteria for every universal IP, Item,
and Category tag and every required or optional product attribute assigned by a
product schema. The filter control and displayed values SHALL use the active locale,
while matching SHALL preserve the stable field and option identity. A product
without a value for an optional field SHALL be excluded when that field is
filtered, and SHALL remain in an unfiltered result.


#### Scenario: grade10-admin-inventory-catalog-SC-80 - Auction filters by universal and structured fields

- **GIVEN** Auction products with different IP, Category, language, and grading values
- **WHEN** a collector filters by an IP tag, a product attribute, or both
- **THEN** Auction returns only products whose stable tag or field value matches
- **AND** the filter labels and values use the active locale

#### Scenario: grade10-admin-inventory-catalog-SC-81 - Missing optional value is excluded from its filter

- **GIVEN** one Auction product has a PSA population value and another has no PSA population value
- **WHEN** a collector filters by a PSA population value
- **THEN** only the product with that value matches
- **AND** the product without a value remains available in an unfiltered result

#### Scenario: grade10-admin-inventory-catalog-SC-82 - Listing attribute cannot be filtered

- **GIVEN** an Auction listing has a `vaulted` listing attribute
- **WHEN** a collector opens Auction search and filter controls
- **THEN** `vaulted` is not offered as a search or filter criterion
- **AND** its stored value remains available for Auction display

### Requirement: Auction listing attributes and presentation are scoped to a listing

An authorized auction admin SHALL choose and order the product attributes shown
for each published IP + Item + Category product schema. The selection MAY
include universal tags and required or optional product attributes. A product
attribute that is stored and searchable MAY be omitted from Auction display.

An authorized auction admin SHALL also define listing attributes for a product
schema and enter their values on each Auction listing. A listing attribute
belongs to one listing, not the product; it SHALL have a stable key, data type,
validation, localized displayed label, and localized displayed text values by
the same English-base and fallback rules as product attributes. Listing
attributes SHALL be displayed only in Auction and SHALL NOT be searchable or
filterable. Auction SHALL store the listing's canonical values and optional
localized text values together as one listing attribute document.

#### Scenario: grade10-admin-inventory-catalog-SC-83 - Operator configures different Auction fields per product schema

- **GIVEN** Pokémon and One Piece product schemas with card number, language, and grading attributes
- **WHEN** an authorized inventory admin selects card number for Pokémon and card number plus character for One Piece
- **THEN** Pokémon Auction listings omit grading
- **AND** One Piece Auction listings show the card number and character, such as Luffy or Chopper
- **AND** both product schemas retain grading for validation and search/filter when assigned

#### Scenario: grade10-admin-inventory-catalog-SC-84 - Auction shows localized labels and values in configured order

- **GIVEN** an Auction listing whose product schema selects language before card number and supplies Traditional Chinese translations
- **WHEN** a collector opens the listing in Traditional Chinese
- **THEN** the selected fields appear in the configured order
- **AND** each field uses its Traditional Chinese displayed label and value
- **AND** a missing translation falls back to English

#### Scenario: grade10-admin-inventory-catalog-SC-88 - Listing-specific PSA cert number does not change the product

- **GIVEN** two Auction listings use the same Pokémon product
- **WHEN** an authorized auction admin enters a different PSA cert number on each listing
- **THEN** each listing displays its own PSA cert number
- **AND** the product's grading and product attribute values remain unchanged
- **AND** PSA cert number is not offered as an Auction search or filter criterion

#### Scenario: grade10-admin-inventory-catalog-SC-89 - Listing attribute falls back to English

- **GIVEN** an Auction listing has an English PSA cert number label and value but no Simplified Chinese translations
- **WHEN** a collector opens the listing in Simplified Chinese
- **THEN** Auction displays the English PSA cert number label and value
- **AND** no stable listing attribute key or raw translation key is displayed

### Requirement: Product schema publishing validates affected products atomically

An authorized inventory admin SHALL edit a product schema as a `draft` and
publish it only after Grade10 validates every existing product with the same
IP + Item + Category tuple against the proposed required fields, data types, and validation
rules. A product with a missing optional value SHALL pass. Missing non-English
translations SHALL be reported but SHALL NOT block publishing. If any affected
product fails product-value validation, Grade10 SHALL refuse the publish, keep
the current published configuration active, and report the affected products
and reasons.

| Configuration state | Rules |
| --- | --- |
| Draft | Editable by an authorized inventory admin; not used for created-product eligibility or Auction output |
| Published | One active configuration for an exact IP + Item + Category tuple; used for product validation and search/filter |

#### Scenario: grade10-admin-inventory-catalog-SC-85 - Invalid existing product blocks product schema publish

- **GIVEN** an existing product matches the product schema's IP + Item + Category tuple but lacks a newly required grading value
- **WHEN** an authorized inventory admin attempts to publish that product schema
- **THEN** Grade10 refuses the publish
- **AND** reports the product and missing value
- **AND** the previously published product schema remains active

#### Scenario: grade10-admin-inventory-catalog-SC-86 - Valid product schema publishes atomically

- **GIVEN** every affected product has valid required values and optional fields may be absent
- **WHEN** an authorized inventory admin publishes the product schema
- **THEN** the complete product schema configuration becomes active
- **AND** its attributes and search/filter behavior take effect together

#### Scenario: grade10-admin-inventory-catalog-SC-87 - Legacy product without a matching product schema stays visible but unavailable to Auction

- **GIVEN** a `created` product predates product schemas and has no published product schema for its IP + Item + Category tuple
- **WHEN** an authorized inventory admin opens the product and Auction evaluates its eligibility
- **THEN** the product remains visible to the inventory admin with a reported missing product schema
- **AND** Auction refuses to list or reserve it until a matching published product schema and valid required values exist
