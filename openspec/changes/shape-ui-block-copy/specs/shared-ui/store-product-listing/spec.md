# shared-ui/store-product-listing Specification

## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductBrowse`, `FilterPanel`,
`CollectionMenu`, `CollectionMenuItem`, `ProductListHeader`, `ProductList`, and
`ProductCard` — and exactly these types: `AsyncState`, `AsyncAction`,
`ProductSummary`, `FilterGroup`, `FilterOption`, `FilterSelection`,
`SortOption`, `CollectionOption`, `UtilityLink`, `ProductBrowseProps`,
`FilterPanelProps`, `CollectionMenuProps`, `CollectionMenuItemProps`,
`ProductListHeaderProps`, `ProductListProps`, `ProductCardProps`, and the copy
type of each of those components.

Each of those components SHALL take the words it renders in a single `copy`
prop of its own copy type, and `ProductBrowseCopy` SHALL be composed of the
copy types of the components `ProductBrowse` renders.

`FilterPanel`, `CollectionMenu`, `CollectionMenuItem`, `ProductListHeader`,
`ProductList`, and `ProductCard` SHALL each be renderable on their own, outside
`ProductBrowse`, so a later surface can reuse one without the others.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves

#### Scenario: A part is reused alone

- **WHEN** an application renders the product list, the filter panel, the list header, a collection menu item, or a product card without the browse root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply browse-root props

#### Scenario: A tile is named once

- **GIVEN** a product tile whose card is activatable and whose cart control needs a name
- **WHEN** the consumer supplies the tile's words
- **THEN** the card's accessible name and the cart control's name each come from one word in the copy type, with no separate prop repeating either
