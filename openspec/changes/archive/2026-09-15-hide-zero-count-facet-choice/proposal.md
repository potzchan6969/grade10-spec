**Author:** @sean - 2026-09-14

## Why

The filter panel on `grade10.com/store/collections` lists a facet choice
counted at zero right alongside the ones counted above it — a collector who
ticks "Riftbound" or "Magic The Gathering" (both `0`) gets an empty grid for
their trouble, on a listing where nothing forced that zero. The durable spec
already refuses this at the group level — a group nothing is counted behind
is not drawn at all — but says nothing about a single dead choice inside a
group that otherwise has plenty behind it, so that half of the same rule
never got built. The same choices are dead whether the listing is narrowed by
something else or not: `worlds=shohei-ohtani` still shows Riftbound and
Magic The Gathering at `0`. Zero-result facet clicks — a collector ticking a
choice that immediately empties the grid — should drop to none, since there
is no click left to make on a choice the catalogue never carries anywhere.

## What Changes

- A facet choice the catalogue counts nothing behind, over the whole
  catalogue with nothing narrowed, is not offered — this holds whatever the
  rest of the query narrows by, since narrowing by something else can never
  resurrect a choice that was never there.
- A choice the catalogue does carry something for elsewhere stays offered
  however little the query in force counts behind it right now, so the
  collector can see what that query starved and undo it, or a selection that
  did the starving.
- The group-level rule generalizes the same way: a group with nothing behind
  any of its choices, over the whole catalogue, is not drawn — whatever
  narrows the rest of the query, not only when the listing itself is
  unnarrowed.
- No change to the five-world cap or to what counts as a narrowing.

## Non-Goals

- Does not change how a group is capped and expanded.
- Does not add click-through or facet-interaction telemetry; the metric below
  is a structural claim (the dead control no longer exists to be clicked),
  not a newly instrumented count.
- Does not touch collection-scoped counts or the collection-vs-query
  narrowing rule.

## Capabilities

### Modified Capabilities

- `grade10-site/store/product-listing`: "The listing narrows by the
  catalogue's facets" requirement keys its choice- and group-level drop on
  the catalogue's unnarrowed, whole-set count rather than on whether the
  listing itself is narrowed.

## Impact

- `apps/frontend/grade10/src/pages/store/ProductListingPage.tsx` —
  `asyncGroups` already carries the fix: a second `useCatalogFilters` call,
  fetched with an empty query, supplies each choice's baseline count. A
  choice or group renders only where that baseline is above zero, or the
  choice is selected; the count *displayed* still comes from the query in
  force.
- `apps/frontend/grade10/src/pages/store/ProductListingPage.test.tsx` — tests
  cover a mixed group with nothing narrowed, a baseline-dead choice that
  stays hidden once an unrelated facet is narrowed, and a selection that
  starves its own choice or a sibling group without either being baseline-dead.

## References

- [Product Listing](../../../docs/prds/products/grade10-site/store/product-listing.md)
