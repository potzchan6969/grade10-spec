# grade10-admin/inventory/card-price-reference Specification

## Purpose

Lets inventory operators classify collectible-card products and read a current,
traceable PriceCharting market reference without retaining a price history.

## Feature set

- Product taxonomy
  - Collectible type: limits the first provider integration to Collectible Cards
  - Required tags: classify every product by IP, Item, and Category
  - Reusable labels: keep operator-created tags consistent across products
- Card matching
  - Provider link: retains the PriceCharting page an operator supplied
  - Confirmed match: binds a card product to the provider's stable identity
- Current reference
  - PSA-focused prices: shows the available ungraded baseline and PSA-oriented grades
  - Freshness: explains when a cached provider result was last updated
  - Auction refresh: shortens refresh eligibility while a Grade10 auction is active
- Bulk card intake
  - CSV template: creates card products with the required taxonomy and provider link
  - Import preview: shows every match and validation result before any product exists
  - Atomic commit: creates every reviewed row or none of them

## ADDED Requirements

### Requirement: Product collectible classification and tags

Every inventory product SHALL have one controlled collectible type and exactly
one tag in each required controlled role. The only collectible type available
in this release is `Collectible Cards`. The controlled roles are `IP`, `Item`,
and `Category`. A tag SHALL have a non-empty trimmed label; its
case-insensitive label identifies one reusable tag regardless of the role in
which a product uses it. An authorized inventory admin SHALL be able to select
an existing tag or create one inline while creating or editing a product.

| Product field | Rules |
| --- | --- |
| Collectible type | Required controlled value; v1 permits `Collectible Cards` only |
| IP tag | Required; exactly one reusable tag |
| Item tag | Required; exactly one reusable tag |
| Category tag | Required; exactly one reusable tag |

| Tag field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Label | Required trimmed text; case-insensitively unique |
| Created at | Set when the tag is first created; immutable |

#### Scenario: card-price-SC-01 - Operator creates a tagged Collectible Card

- **GIVEN** an authorized inventory admin
- **WHEN** they create a `Collectible Cards` product with tags `IP: Pokémon`,
  `Item: Graded card`, and `Category: Anime`
- **THEN** Grade10 persists the product and its three controlled-role tags
- **AND** each product read returns its collectible type and tags

#### Scenario: card-price-SC-02 - Product missing a required tag role is refused

- **GIVEN** an authorized inventory admin
- **WHEN** they create or update a product without an `IP`, `Item`, or
  `Category` tag, or attempts to assign multiple tags to one controlled role
- **THEN** Grade10 refuses the write
- **AND** the product's prior classification remains unchanged

#### Scenario: card-price-SC-09 - Inline tag creation reuses a matching tag

- **GIVEN** a tag `Pokémon` already exists
- **WHEN** an authorized inventory admin supplies `pokemon` inline as the IP tag
- **THEN** Grade10 associates the existing tag rather than creating another
- **AND** the product's IP tag is `Pokémon`

### Requirement: Collectible-card PriceCharting identity

Only a `Collectible Cards` product SHALL accept a PriceCharting reference. An
authorized inventory admin SHALL paste a PriceCharting link, review provider
search results, and explicitly select one result before Grade10 stores the
reference. Grade10 SHALL retain the canonical provider link and the selected
stable provider product id. One stable provider product id SHALL identify no
more than one inventory product. Grade10 SHALL refuse an invalid provider link,
an unconfirmed match, or a provider id already attached to another product.

| Reference field | Rules |
| --- | --- |
| Provider | `PriceCharting` |
| Canonical link | Required after a match is confirmed; retained as supplied provider identity |
| Provider product id | Required after confirmation; stable and unique across products |
| Confirmed at | Set when the operator confirms or replaces the match |
| Confirmed by | Operator user id that confirmed or replaced the match |

#### Scenario: card-price-SC-03 - Operator confirms a PriceCharting search match

- **GIVEN** a `Collectible Cards` product and a valid pasted PriceCharting link
- **WHEN** an authorized inventory admin selects a matching provider search result
- **THEN** Grade10 persists the canonical link and selected stable provider id
- **AND** future price reads use that confirmed identity

#### Scenario: card-price-SC-04 - Non-card product cannot attach PriceCharting

- **GIVEN** a product whose collectible type is not `Collectible Cards` in a
  future type-vocabulary release
- **WHEN** an authorized inventory admin attempts to add or retain a
  PriceCharting reference
- **THEN** Grade10 refuses the reference
- **AND** it does not request PriceCharting prices for that product

### Requirement: Cached PSA-focused PriceCharting reference

Grade10 SHALL expose a PriceCharting current-price reference only for a
Collectible Cards product with a confirmed PriceCharting identity. The
reference SHALL identify PriceCharting as source, use USD minor units, show an
ungraded baseline when supplied, and show provider-returned PSA-relevant
numeric grades and PSA 10 when supplied. It SHALL show the successful fetch
time and SHALL distinguish unavailable grade values from zero prices.

The current reference is an expiring cache, not product history. Grade10 SHALL
not retain prior price observations or show a price chart. A normal cached
result is fresh for 24 hours. When a Grade10 auction for that product is
active, its lifecycle event MAY request a refresh no more often than once per
four hours. A request to shorten refresh eligibility SHALL never create a
provider result or overwrite the last successful result. On a provider failure,
Grade10 SHALL return the last successful cached result with its age and stale
state; when no successful result exists, it SHALL return an unavailable state.

| Price-reference field | Rules |
| --- | --- |
| Source | `PriceCharting` |
| Currency | USD; integer minor units |
| Baseline | Current ungraded value when supplied |
| PSA-oriented grades | Current numeric grades and PSA 10 when supplied; missing is unavailable |
| Fetched at | Time of the last successful provider result |
| Freshness | Fresh for 24 hours; stale thereafter unless a valid shorter auction refresh succeeds |
| Retention | Current cache only; no historical observations |

#### Scenario: card-price-SC-05 - Operator reads a fresh PSA-focused price reference

- **GIVEN** a matched Collectible Cards product with a successful PriceCharting
  result fetched within 24 hours
- **WHEN** an authorized inventory admin reads the product
- **THEN** Grade10 returns PriceCharting as source, the ungraded baseline and
  each supplied PSA-oriented grade in USD minor units
- **AND** returns the successful fetch time and fresh state

#### Scenario: card-price-SC-06 - Expired regular cache refreshes before display

- **GIVEN** a matched Collectible Cards product whose last successful price
  result is older than 24 hours and has no active auction refresh eligibility
- **WHEN** an authorized inventory admin reads its price reference
- **THEN** Grade10 requests a current provider result before answering
- **AND** replaces the cached result only when the request succeeds

#### Scenario: card-price-SC-07 - Failed refresh preserves and labels stale data

- **GIVEN** a matched Collectible Cards product with a cached price result
- **AND** its next eligible provider refresh fails
- **WHEN** an authorized inventory admin reads its price reference
- **THEN** Grade10 returns the last successful values with their fetch time
- **AND** identifies the result as stale

#### Scenario: card-price-SC-08 - Active auction requests shorter refresh eligibility

- **GIVEN** a matched Collectible Cards product with an active Grade10 auction
- **WHEN** the auction lifecycle requests a price refresh
- **THEN** Grade10 permits a provider refresh when the most recent successful
  result is at least four hours old
- **AND** refuses to request another provider refresh before four hours pass

### Requirement: Bulk Collectible Cards import

An authorized inventory admin SHALL upload a CSV of at most 500 new
`Collectible Cards` products. The CSV SHALL have exactly the required columns
below and MAY include the optional columns. Each row supplies one tag label for
each required controlled role. The CSV SHALL NOT update an existing product.

| Column | Rules |
| --- | --- |
| `name` | Required product name |
| `ip_tag` | Required IP tag label |
| `item_tag` | Required Item tag label |
| `category_tag` | Required Category tag label |
| `pricecharting_url` | Required valid PriceCharting link |
| `description` | Optional product description |
| `remarks` | Optional product remarks |

Grade10 SHALL parse the uploaded CSV into a preview before creating a product.
For each row, it SHALL validate the required fields, resolve/reuse tags by
case-insensitive label, assign them to their named controlled roles, search
PriceCharting, and present the
candidate selected for confirmation. A missing, malformed, unmatched,
ambiguous, or duplicate provider item SHALL make the preview invalid. A
provider item already confirmed for any inventory product is a duplicate.

The operator SHALL explicitly confirm every previewed candidate before commit.
Grade10 SHALL refuse confirmation while any row is invalid or unconfirmed.
On confirmation, Grade10 SHALL revalidate each provider identity and create
all products, zero-count inventory snapshots, tags/associations, and confirmed
PriceCharting references in one transaction. If any row cannot be created,
Grade10 SHALL create none of the batch. A successful import SHALL not fetch a
price; the normal price-cache policy applies to its new products.

#### Scenario: card-price-SC-10 - Operator previews a valid card CSV

- **GIVEN** an authorized inventory admin has a CSV with no more than 500 rows
  and every required column
- **WHEN** they upload rows with valid card fields and PriceCharting links
- **THEN** Grade10 returns a preview with each row's normalized tags and one
  PriceCharting candidate for confirmation
- **AND** creates no product, inventory snapshot, or confirmed reference

#### Scenario: card-price-SC-11 - Invalid CSV row blocks confirmation

- **GIVEN** an uploaded CSV has a missing required field, malformed link,
  unmatched/ambiguous provider result, duplicate provider item, or more than
  500 rows
- **WHEN** an authorized inventory admin views or attempts to confirm its preview
- **THEN** Grade10 identifies the invalid row and reason
- **AND** refuses confirmation and creates no product from the CSV

#### Scenario: card-price-SC-12 - Operator confirms every PriceCharting match

- **GIVEN** a CSV preview has valid rows with PriceCharting candidates
- **WHEN** an authorized inventory admin confirms every row's selected candidate
- **THEN** Grade10 marks the preview ready for commit
- **AND** retains the selected canonical link and stable provider id for each row

#### Scenario: card-price-SC-13 - Import commits every reviewed row atomically

- **GIVEN** a ready CSV preview of two valid, confirmed rows
- **WHEN** an authorized inventory admin commits the import
- **THEN** Grade10 creates both products with their required tags, one empty
  inventory snapshot each, and their confirmed PriceCharting references
- **AND** if a duplicate or other write refusal is found at commit, Grade10
  creates neither product
