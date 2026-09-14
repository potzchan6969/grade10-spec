**Author:** @sean - 2026-09-14

## Why

The filter panel on `grade10.com/store/collections` lists a facet choice
counted at zero right alongside the ones counted above it — a collector who
ticks "Riftbound" or "Magic The Gathering" (both `0`) gets an empty grid for
their trouble, on a listing where nothing forced that zero. The durable spec
already refuses this at the group level — a group nothing is counted behind
is not drawn at all — but says nothing about a single dead choice inside a
group that otherwise has plenty behind it, so that half of the same rule
never got built. Zero-result facet clicks — a collector ticking a choice that
immediately empties the grid — should drop to none once nothing zero-count is
offered unnarrowed; there is no click left to make.

## What Changes

- An unnarrowed listing drops any facet choice the catalogue counts nothing
  behind, in every group the catalogue names choices for — not only a group
  where every choice is zero.
- Once any narrowing is in force, no choice already offered is dropped for
  want of a count: a zeroed choice may be that narrowing's own doing, and the
  collector needs it there to undo.
- No change to which groups are drawn, to the five-world cap, or to what
  counts as a narrowing — this only trims dead choices out of a group that
  already has something behind it.

## Non-Goals

- Does not change the all-zero group rule already in the spec, or how a
  group is capped and expanded.
- Does not add click-through or facet-interaction telemetry; the metric below
  is a structural claim (the dead control no longer exists to be clicked),
  not a newly instrumented count.
- Does not touch collection-scoped counts or the collection-vs-query
  narrowing rule.

## Capabilities

### Modified Capabilities

- `grade10-site/store/product-listing`: "The listing narrows by the
  catalogue's facets" requirement gains a choice-level rule alongside its
  existing group-level one.

## Impact

- `apps/frontend/grade10/src/pages/store/ProductListingPage.tsx` —
  `asyncGroups` already carries the fix: it drops a zero-count choice from a
  group's rendered list while the query is unnarrowed, and stops dropping
  once any narrowing is in force.
- `apps/frontend/grade10/src/pages/store/ProductListingPage.test.tsx` — a
  test covers a group with one live and one uncounted choice, unnarrowed.

## References

- [Product Listing](../../../docs/prds/products/grade10-site/store/product-listing.md)
