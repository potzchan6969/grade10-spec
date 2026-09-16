## Feature set

- Listing search suggestions
  - Supplied groups: product and filter rows the consumer supplies under the field
  - Draft, commit, select: the field reports typing, submitting, and picking a row; it never fetches or navigates
  - Row shape: id, label, optional image and trailing chrome the consumer supplies

## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductBrowse`, `FilterPanel`,
`ProductFilter`, `ProductListHeader`, `ProductList`, `ProductCard`, and
`ProductCardImage` — and exactly these types: `AsyncState`, `AsyncAction`,
`ProductSummary`, `FilterGroup`, `FilterOption`, `FilterSelection`,
`AppliedFilter`, `SortOption`, `UtilityLink`, `SearchSuggestion`,
`SearchSuggestionGroup`, `ProductBrowseProps`, `FilterPanelProps`,
`ProductFilterProps`, `ProductListHeaderProps`, `ProductListProps`,
`ProductCardProps`, `ProductCardImageProps`, and the copy type of each of
those components.

Each of those components SHALL take the words it renders in a single `copy`
prop of its own copy type, and `ProductBrowseCopy` SHALL be composed of the
copy types of the components `ProductBrowse` renders.

A word every tile renders the same SHALL be supplied once for the list rather
than per tile; a tile SHALL carry only what differs between one product and
the next.

`FilterPanel`, `ProductFilter`, `ProductListHeader`, `ProductList`,
`ProductCard`, and `ProductCardImage` SHALL each be renderable on their own,
outside `ProductBrowse`, so a later surface can reuse one without the others.

#### Scenario: shared-ui-store-product-listing-SC-01 - An application imports the surface
**Serves:** Surface exports - an application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: shared-ui-store-product-listing-SC-02 - A part is reused alone
**Serves:** Surface exports - a part is reused alone

- **WHEN** an application renders the product list, the filter panel, the product filter, the list header, a product card, or the product card image without the browse root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply browse-root props

#### Scenario: shared-ui-store-product-listing-SC-03 - A tile is named once
**Serves:** Surface exports - a tile is named once

- **GIVEN** a product tile whose card is activatable and whose cart control needs a name
- **WHEN** the consumer supplies the tiles and the words around them
- **THEN** the card's accessible name is the product's own name, supplied once per product
- **AND** the cart control's name comes from the list's copy, supplied once for every tile
- **AND** no prop repeats either

## ADDED Requirements

### Requirement: A search suggestion carries display fields

A `SearchSuggestion` SHALL carry the fields below. A `SearchSuggestionGroup`
SHALL carry an id, a label, and an ordered list of suggestions. The surface
SHALL render optional image and trailing content when supplied and SHALL NOT
invent either.

| Field | Required | Purpose |
| --- | --- | --- |
| `id` | yes | Stable identity for the row within its group |
| `label` | yes | Primary text the shopper reads on the row |
| `imageSrc` | no | Optional leading image URL for a product row |
| `imageAlt` | no | Accessible name for that image when supplied |
| `trailing` | no | Optional trailing chrome the consumer assembles |

#### Scenario: shared-ui-store-product-listing-SC-73 - Optional image and trailing render as supplied
**Serves:** Listing search suggestions - optional image and trailing render as supplied

- **GIVEN** a suggestion supplied with an image URL and trailing content
- **WHEN** that suggestion is displayed
- **THEN** the row shows that image and that trailing content
- **AND** no other image or trailing chrome is invented

### Requirement: The listing search field offers supplied suggestions

The search field on the filter panel SHALL display suggestion groups the
consumer supplies while the shopper types, and SHALL report each draft change
to the query through the existing change callback. It SHALL NOT put free text
in force by itself: committing the field with no suggestion selected SHALL
report a search commit through a named callback. Selecting a suggestion SHALL
report that selection through a named callback identifying the suggestion.

When the consumer omits suggestion groups, the suggestion panel SHALL stay
closed and the field SHALL still accept draft edits and search commits. When
the consumer supplies an empty suggestion list with a non-empty draft, the
field SHALL show its empty-suggestions copy and SHALL still accept a search
commit. When the consumer marks suggestions as pending, the field SHALL show
its searching indication and SHALL NOT invent suggestion rows. Suggestion
rows SHALL be operable by keyboard alone with a visible focus indicator.
Closing the suggestion panel without selecting SHALL leave the draft query as
supplied.

The surface SHALL NOT fetch suggestions, decide which products or filters
match, cap how many rows a group may hold, or navigate. Those stay with the
consumer.

`ProductFilterProps`, `FilterPanelProps`, and `ProductBrowseProps` SHALL admit
the suggestion list, a pending indication, and the commit and selection
callbacks. `ProductFilterCopy` SHALL admit empty-suggestions and searching
copy.

#### Scenario: shared-ui-store-product-listing-SC-67 - Suggestions are displayed as supplied
**Serves:** Listing search suggestions - suggestions are displayed as supplied

- **GIVEN** a draft query and supplied suggestion groups with product and
  filter rows
- **WHEN** the search field is focused with that draft
- **THEN** those groups and rows are displayed under the field
- **AND** no other suggestion is invented

#### Scenario: shared-ui-store-product-listing-SC-68 - A draft change is reported
**Serves:** Listing search suggestions - a draft change is reported

- **GIVEN** a supplied search query of `pi`
- **WHEN** a shopper edits the field and the consumer supplies no new query
- **THEN** the field still displays `pi`
- **AND** the change was reported once through the draft callback

#### Scenario: shared-ui-store-product-listing-SC-69 - Committing reports a search commit
**Serves:** Listing search suggestions - committing reports a search commit

- **GIVEN** a non-empty draft query and no suggestion selected
- **WHEN** a shopper commits the search field
- **THEN** the search commit is reported once with that draft
- **AND** the field still displays the supplied query until the consumer
  supplies a new one

#### Scenario: shared-ui-store-product-listing-SC-70 - Selecting a suggestion is reported
**Serves:** Listing search suggestions - selecting a suggestion is reported

- **GIVEN** a displayed suggestion row
- **WHEN** a shopper activates that row
- **THEN** the selection is reported once, identifying that suggestion
- **AND** the surface does not navigate or change filters itself

#### Scenario: shared-ui-store-product-listing-SC-71 - No suggestions still commits
**Serves:** Listing search suggestions - no suggestions still commits

- **GIVEN** a non-empty draft query and an empty suggestion list supplied
- **WHEN** a shopper commits the search field
- **THEN** the search commit is reported once with that draft
- **AND** before commit the field showed its empty-suggestions copy

#### Scenario: shared-ui-store-product-listing-SC-72 - Suggestions are keyboard operable
**Serves:** Listing search suggestions - suggestions are keyboard operable

- **WHEN** a shopper using a keyboard alone opens suggestions under the
  search field
- **THEN** each suggestion row can be reached and activated
- **AND** the focused row is visibly indicated

#### Scenario: shared-ui-store-product-listing-SC-74 - Pending suggestions show searching
**Serves:** Listing search suggestions - pending suggestions show searching

- **GIVEN** a non-empty draft query and suggestions marked pending
- **WHEN** the search field is open
- **THEN** the field shows its searching indication
- **AND** no suggestion row is invented
