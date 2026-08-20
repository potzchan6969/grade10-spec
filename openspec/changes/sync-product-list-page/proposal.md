# Sync Product List page with Figma

**Author:** @constancetang - 2026-08-19

## Why

The published Product List page
([4098:1868](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868))
now filters by world (IP) and product type in the sidebar, and the list header
shows only the result count, a sort dropdown, and chips for filters already
applied. Code still renders the earlier collection menu and a header of sort
chips plus type/series controls, so a shopper comparing Storybook to the file
meets a different way to choose a product.

Time to a first filtered result should fall: worlds and types are checkboxes
in one sidebar, not a collection row plus a second row of header chips, and
the applied set is visible above the grid so it can be cleared without
re-finding each control.

This supersedes `sync-product-list-header`, which described the header-chip
layout the file has now left.

## What Changes

- **Sidebar is a product filter.** `ProductFilter` (Figma `Product / Product
  Filter`, `4357:527`) lists consumer-supplied groups as multi-select
  checkboxes with optional counts and an optional expand link. Empty selection
  is unrestricted. **BREAKING:** `CollectionMenu`, `CollectionMenuItem`, and
  `CollectionOption` leave the public entry; `FilterPanel` / `ProductBrowse`
  take `groups` and a filter selection instead of `collections` and
  `activeCollection`.
- **Header shows count, applied filters, and a sort dropdown.** The count is
  the heading. Applied-filter chips and a clear action appear only when a
  filter is applied. Sort is a dropdown; sort chips, paired Price reversal,
  header type chips, and the series dropdown leave. **BREAKING:** `title`,
  `chipFilters`, and `selectFilters` are removed; `sortTriggerLabel` and
  `appliedFilters` are added.
- **Product list uses infinite scroll.** Pagination leaves the browse surface.
  Scrolling near the list end reports `onLoadMore`; `loadingMore` appends ten
  Boneyard skeleton tiles by default. **BREAKING:** `page`, `pageCount`,
  `onPageChange`, `previousLabel`, `nextLabel`, `paginationLabel`, and
  `morePagesLabel` leave `ProductBrowse`.
- **Product list gap matches the page; card metadata badges are hidden.**
  Horizontal gap 24px, vertical 32px, minimum tile 250px. Tiles do not display
  `cardProps` / `tags` badges.
- **Footer fill is `background`.** Value reconciliation on the existing
  `Footer` primitive (`4171:9653`); not a contract change.

## Non-Goals

- Store Nav collection cards on the page (`4396:2889`).
- Computing which products match, how groups are ordered, or which worlds sit
  behind "See all worlds" — the application supplies the visible options and
  their order.
- A new Chip primitive. Applied-filter chips reuse `FilterChip`.
- Publishing Code Connect.
- Folding `sync-product-list-header` into the archive; that change is
  superseded here and should not be implemented as written.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared-ui/store-product-listing`: sidebar filter groups replace the
  collection menu; the list header shows applied filters and a sort dropdown;
  the grid gap and tile badges match the page.

## Impact

- `@grade10/ui`: `ProductFilter`, `FilterPanel`, `ProductListHeader`,
  `ProductBrowse`, `ProductList`, `ProductCard`, types, fixtures, stories, and
  Code Connect templates. Delete `CollectionMenu` and `CollectionMenuItem`.
- `@grade10/design-system`: `Footer` background token.
- `apps/preview` product list page: worlds/types selection, applied-filter
  chips, sort trigger copy, no header title.
- Consuming applications must stop importing `CollectionMenu` /
  `CollectionMenuItem`, stop passing `collections` / `activeCollection` /
  `title` / `chipFilters` / `selectFilters`, and pass `groups`, `selection`,
  `appliedFilters`, and `sortTriggerLabel`. Pagination props leave
  `ProductBrowse`; infinite scroll uses `hasMore`, `loadingMore`, and
  `onLoadMore` instead.
