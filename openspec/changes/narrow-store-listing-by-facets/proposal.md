**Author:** @seankcw - 2026-09-08

## Why

A collector narrowing the listing gets an answer about the page in front of
them rather than about the catalogue. Sorting by lowest price orders the cards
already loaded, so the cheapest card in the shop surfaces only when it happens
to sit on the first page; the search box matches those same loaded titles. Both
read as a shop with almost nothing in it.

The sidebar compounds it. It offers the shop's collections — the taxonomy the
published design replaced with world and collectible type in August 2026
(`sync-product-list-page`). The shared listing components were rebuilt around
filter groups for that change; the site went on feeding them collections, so a
collector browsing for Pokémon has no way to ask for it.

The catalogue already answers all of it: facet groups with a count behind every
choice, free text, ordering and paging, each over the whole narrowed set rather
than a page of it. Only the storefront still decides in the browser.

Metric: share of listing sessions that apply a narrowing at all, and the time a
collector takes to reach their first narrowed result. Both are floored today by
a panel offering the wrong taxonomy and an order that is wrong past the first
page.

## What Changes

- **Facets replace collections in the filter panel** — the panel offers the
  catalogue's own facet groups, world and collectible type, each choice
  carrying the count the catalogue puts behind it. **BREAKING:** the
  collections group leaves the panel
- **Narrowing, ordering and search become the catalogue's** — all three
  describe the whole narrowed set, never the page already loaded
- **The address carries the narrowing** — facets, free text and order live in
  it, each a history entry, so a narrowed listing links and Back widens it
- **A collection becomes a way in, not a control** — an address naming one
  still opens the listing scoped to it, shown as a chip the collector can
  dismiss
- **One narrowing at a time** — applying a facet, free text or an order leaves
  the collection behind, because the catalogue narrows by a collection or by a
  query, never both
- **Popular leaves the sort menu** — nothing ranks products by popularity, so
  the menu offers only orders the catalogue answers and the resting state is
  the catalogue's own order
- **A facet group with nothing behind it is not drawn** — a shop that has
  configured no facets gets a listing with no filter panel rather than controls
  whose only effect is to empty the grid

## Non-Goals

- **Combining a collection with a facet** — one query narrows by a collection
  or by facets, and this change does not widen the catalogue to serve both
- **A popularity signal** — nothing computes one, and this change adds nothing
  that would
- **The front door's collection grid** — unchanged, and its tiles go on opening
  the listing scoped to a collection
- **Ordering or searching inside a collection** — applying either leaves the
  collection, rather than the collection gaining an order of its own
- **The admin design-review bench** — the disposable surface this behaviour was
  decided on, deleted once this lands

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/store/product-listing`: facets narrow the listing and live in
  the address; order and search describe the whole catalogue; a collection
  becomes an arrival scope rather than a filter control

## Impact

- **Grade10 site** — the listing surface and the catalogue reads behind it
- **Message catalogs** (`@grade10/i18n`) — a name for each of the two facet
  groups, which the catalogue does not carry: a choice's label is the shop's
  and travels, a group's is the platform's
- **No backend change** — the catalogue already answers facets, counts, free
  text, order and paging over the narrowed set
- **No component change** — the shared listing components already take filter
  groups, a selection, applied-filter chips and a sort trigger; no export moves
- **Sort menu** — one option fewer, and no option selected at rest
