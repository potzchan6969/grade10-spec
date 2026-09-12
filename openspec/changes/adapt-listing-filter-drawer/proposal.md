**Author:** @tangconst - 2026-09-11

## Why

The first small-viewport chrome (Filter icon, left facet drawer, search on the
listing, chips under the count) still reads as a desktop sidebar squeezed onto
a phone. Collectors need sort and each facet group one tap away, with labels
that show what is already on, without a separate chip row.

Metric: share of listing visits that change sort or a world/type facet on
viewports below the wide breakpoint, and time from listing open to first
narrowed grid on those viewports.

## What Changes

- **Narrow chrome** — below the wide breakpoint: result count, then a row of
  pills for sort and each facet group (Worlds, Types). No listing search, no
  Filter icon, no left facet drawer, no applied-filter chips on that viewport
- **Sort pill** — shows the active option’s short name (e.g. Latest). Opens a
  bottom drawer; choosing an option applies immediately and closes; no confirm
- **Facet pills** — one per filter group. Label rules: none selected → group
  name (Worlds / Types); one selected → that option’s label; several → compact
  name with count (World (2) / Type (2)). Opens a bottom drawer for that group
  only
- **Facet drawer apply** — draft while open; Show Results applies the draft
  for that group and closes; Clear clears that group’s draft (does not apply
  until Show Results)
- **Wide unchanged** — sidebar keeps search, stacked groups, utility links;
  header keeps sort dropdown and applied chips

## Non-Goals

- **Restoring listing search on narrow** — deferred; wide keeps search
- **Batched Apply across all groups** — each facet drawer commits its own group
- **Nested facet sheets** or Worlds | Types tabs
- **Changing facet rules** (caps, counts, URL) or cart-on-narrow behaviour
- **A new public export for narrow chrome** — stays inside `ProductBrowse`

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: narrow chrome is pill + bottom drawers;
  left Filter drawer and narrow search are withdrawn; wide sidebar contract
  stays

## Impact

- **`@grade10/ui`** — `ProductBrowse` narrow path; list header / chrome; copy
- **Grade10 site / ZZZ** — supply short sort labels and Show Results / Clear
  copy when adopting
- **Manual** — Product Listing and Product Listing Blocks Adaptive Filter
  sections

## References

- [Product Listing · Adaptive Filter](../../../docs/prds/products/grade10-site/store/product-listing.md#adaptive-filter)
- [Product Listing Blocks · Adaptive Filter](../../../docs/prds/products/shared/ui/store-product-listing.md#adaptive-filter)
