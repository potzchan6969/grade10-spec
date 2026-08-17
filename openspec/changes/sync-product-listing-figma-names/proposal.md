# Sync product-listing names with Figma

## Why

The Product Listing page in Figma
([4098:1868](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868))
now publishes the listing pieces as named components, several of them renamed,
and extracts the category hero into `Product / Collection Banner`. Code still
uses the names from the first listing-surface change (`StoreHeader`,
`ProductFilterPanel`, `ProductListingToolbar`, `ProductGrid`) and assembles the
banner as ad-hoc JSX in the page story. The checker resolves a Figma set by
normalized name, so `Nav` and `Product / Product Card` already miss their code
files, and a consumer copying a Dev Mode snippet will not find
`ProductListingToolbar`.

## What would change

Code names match the published Figma sets. The page assembly uses
`CollectionBanner` as a sibling of `ProductBrowse`, the way the file draws it,
instead of stuffing the hero into a listing `header` slot Figma does not have.

## Scope

- **Rename design-system `StoreHeader` → `Nav`.** Same chrome, Figma set
  `Nav` (`4171:9937`).
- **Put every Figma `Product / …` set in `packages/ui` listing blocks.**
  `CollectionBanner` (`Product / Collection Banner`, `4248:5104`) and
  `ProductCard` (`Product / Product Card`, `4200:155`) move out of the design
  system. `Nav` and `Footer` stay there — they are chrome, not a product item.
- **Rename listing compounds to the Figma sets they implement:**
  `ProductFilterPanel` → `FilterPanel`, `ProductListingToolbar` →
  `ProductListHeader`, `ProductGrid` → `ProductList`. The compound that is
  not a published set is `ProductBrowse` (was `ProductListing`) — "Listing"
  collided with `ProductList`, and the Figma page of that name also includes
  chrome this component does not own.
- **Consumers:** `apps/preview` page story. No production application lives in
  this repository; store apps must rename the listing imports, including
  `ProductListing` → `ProductBrowse`.

## Non-goals

- Visual restyle of any piece beyond the new banner primitive.
- Publishing Code Connect (writes to the shared file).
- Teaching `check:design-system` to look inside `packages/ui`. Every Figma
  `Product / …` set, plus `Filter Panel`, will warn as having no design-system
  file — they are listing blocks.

## Affected exports

| Was | Becomes | Package |
| --- | --- | --- |
| `StoreHeader`, `StoreHeaderProps`, `StoreHeaderLink`, `StoreHeaderNavItem` | `Nav`, `NavProps`, `NavLink`, `NavItem` | `@grade10/design-system` |
| — | `CollectionBanner`, `CollectionBannerProps` | `@grade10/ui` |
| `ProductCard`, `ProductCardProps` | same names; home moves to `@grade10/ui` | `@grade10/ui` |
| `ProductFilterPanel`, `ProductFilterPanelProps` | `FilterPanel`, `FilterPanelProps` | `@grade10/ui` |
| `ProductListingToolbar`, `ProductListingToolbarProps` | `ProductListHeader`, `ProductListHeaderProps` | `@grade10/ui` |
| `ProductGrid`, `ProductGridProps` | `ProductList`, `ProductListProps` | `@grade10/ui` |
| `ProductListing`, `ProductListingProps` | `ProductBrowse`, `ProductBrowseProps` | `@grade10/ui` |
| `ProductListing.header` | removed; the page renders `CollectionBanner` beside `ProductBrowse` | `@grade10/ui` |
