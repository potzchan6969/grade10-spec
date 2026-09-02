# shared/ui/store-product-listing Specification

## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductBrowse`, `FilterPanel`,
`ProductFilter`, `ProductListHeader`, `ProductList`, and `ProductCard` — and
exactly these types: `AsyncState`, `AsyncAction`, `ProductSummary`,
`FilterGroup`, `FilterOption`, `FilterSelection`, `AppliedFilter`,
`SortOption`, `UtilityLink`, `ProductBrowseProps`, `FilterPanelProps`,
`ProductFilterProps`, `ProductListHeaderProps`, `ProductListProps`,
`ProductCardProps`, and the copy type of each of those components.

Each of those components SHALL take the words it renders in a single `copy`
prop of its own copy type, and `ProductBrowseCopy` SHALL be composed of the
copy types of the components `ProductBrowse` renders.

A word every tile renders the same SHALL be supplied once for the list rather
than per tile; a tile SHALL carry only what differs between one product and
the next.

`FilterPanel`, `ProductFilter`, `ProductListHeader`, `ProductList`, and
`ProductCard` SHALL each be renderable on their own, outside `ProductBrowse`,
so a later surface can reuse one without the others.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders the product list, the filter panel, the product filter, the list header, or a product card without the browse root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply browse-root props

#### Scenario: A tile is named once

- **GIVEN** a product tile whose card is activatable and whose cart control needs a name
- **WHEN** the consumer supplies the tiles and the words around them
- **THEN** the card's accessible name is the product's own name, supplied once per product
- **AND** the cart control's name comes from the list's copy, supplied once for every tile
- **AND** no prop repeats either
