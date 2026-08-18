## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the listing surface — `ProductBrowse`, `FilterPanel`,
`ProductListHeader`, `ProductList`, and `ProductCard` — and exactly these
types: `AsyncState`, `AsyncAction`, `ProductSummary`, `FilterGroup`,
`FilterOption`, `FilterSelection`, `SortOption`, `ProductBrowseProps`,
`FilterPanelProps`, `ProductListHeaderProps`, `ProductListProps`, and
`ProductCardProps`.

`FilterPanel`, `ProductListHeader`, `ProductList`, and `ProductCard` SHALL
each be renderable on their own, outside `ProductBrowse`, so a later surface
can reuse one without the others.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders the product list, the filter panel, the list header, or a product card without the browse root
- **THEN** it renders and behaves as specified, with no missing-context error and no requirement to supply browse-root props

## REMOVED Requirements

### Requirement: The collection banner displays store-supplied trail, title, and description

**Reason:** The listing surface no longer has a collection hero. Collection
identity is the list header title the consumer already supplies.

**Migration:** Stop importing `CollectionBanner` and `CollectionBannerProps`.
Drop breadcrumbs, description, and image from the listing page. Keep passing
the collection name as `title` on `ProductListHeader` / `ProductBrowse`.
