**Author:** @tangconst - 2026-09-11

## Why

On a phone or tablet-width listing, the filter column stretches full width
above the grid. Worlds and Types fill the first screen, product tiles sit far
below, and expanding “See all worlds” pushes Types even farther down the
scroll. Collectors who came to browse cards meet a form first.

Metric: share of listing visits that apply a world or type facet on viewports
below the wide breakpoint, and time from listing open to first narrowed grid
on those viewports. Unmeasured today; first delivery sets the baseline.

## What Changes

- **Small-viewport Filter control** — below the wide breakpoint, facets sit
  behind a Filter button that opens a left drawer; the permanent full-width
  stacked panel goes away
- **Search stays on the listing** — the catalogue search field (and its
  suggestions) remain on the listing surface outside the drawer on small
  viewports; on wide viewports they stay above the facet chrome in the sidebar
- **Worlds | Types tabs on small viewports** — inside the filter drawer the
  two facet groups are tabs so expanding worlds lengthens only the Worlds
  pane; the wide sidebar still stacks groups
- **Drawer chrome** — Filter title, close, Clear, and Done; facet changes
  still report live; Done closes the drawer
- **Shared browse contract** — `ProductBrowse` / `FilterPanel` /
  `ProductFilter` adapt by viewport; copy for the Filter button and drawer
  actions is consumer-supplied
- **Small-viewport list header** — result count stays on one line; sort stacks
  under the count and left-aligns; applied chips and Clear wrap as one row
- **Filter control placement** — on small viewports the Filter button sits to
  the left of the listing search field

## Non-Goals

- **Site header or global search** — search stays listing-scoped
- **Nested facet drill-down** (Worlds → a second sheet)
- **Search within facet values** (e.g. “Search worlds”)
- **Quick-filter chip row** for Worlds/Types on the listing toolbar
- **Changing facet rules** already decided (five-world cap, types shown
  whole, counts, URL state)
- **Batched Apply** that holds facet changes until confirm — live report
  stays; Done only dismisses
- **Design-system Tabs primitive contract** — owned by
  `sync-tabs-from-figma`; this change only consumes the default pill list

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: adaptive filter chrome — drawer on small
  viewports with search outside; Worlds/Types as tabs in that drawer only;
  scenarios that assumed a permanent sidebar with search inside are
  viewport-qualified

## Impact

- **`@grade10/ui`** — `ProductBrowse`, `FilterPanel`, `ProductFilter`, and
  `ProductListHeader` layout and copy shape; stories for mobile drawer and
  tabs
- **`@grade10/design-system`** — reuses `Drawer` and synced `Tabs` (see
  `sync-tabs-from-figma`); no further primitive change here
- **Grade10 site / ZZZ** — supply Filter button and drawer action copy when
  adopting the surface; no URL or facet-rule change
- **Manual** —
  [`Product Listing`](../../../docs/prds/products/grade10-site/store/product-listing.md)
  and
  [`Product Listing Blocks`](../../../docs/prds/products/shared/ui/store-product-listing.md)
  mark the outcomes

## References

- [Product Listing · Adaptive Filter](../../../docs/prds/products/grade10-site/store/product-listing.md#adaptive-filter)
- [Product Listing Blocks · Adaptive Filter](../../../docs/prds/products/shared/ui/store-product-listing.md#adaptive-filter)
- [`sync-tabs-from-figma`](../sync-tabs-from-figma/proposal.md) — Tab / Tab List
  primitive sync this drawer consumes
