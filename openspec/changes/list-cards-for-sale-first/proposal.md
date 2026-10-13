**Author:** @ecchochan - 2026-10-07

## Why

A collector who orders the listing by lowest price wants the cheapest card
they can buy first. Grade10 lists every card for sale before a sold-out one,
in every order, but the listing requirement says a lowest-price order lists
the lowest-priced card first, sold out or not. A test written from the
requirement asserts the opposite of what runs.

**Metric:** share of lowest-price listings whose first card is for sale,
where the narrowing holds one. It is 100% on what runs; the requirement holds
it there.

**Acceptance signal:** a tester working from the listing requirement expects
the cards for sale first in every order, as the listing shows them.

## What Changes

- **For sale first in every order** - a card for sale lists before a sold-out
  one under latest product, lowest price and highest price, at rest and inside
  a collection. The order asked for holds within each group. Grade10 runs it
  (`packages/grade10-store/backend/src/services/catalog/browse.ts:87-92`,
  `projection.ts:73-76`, `collection.ts:52-54`)
- **The price a price order sorts on** - the lowest price of every variant
  (`services/catalog/projection.ts:136-141`), which can differ from the one
  item's price the tile shows. ❓ Whether it sorts on the tile's price instead
  is Q2, held for Product
- **The requirement** - MODIFIED `Order and free text describe the whole
  catalogue` states both, and its scenario An order covers the whole
  catalogue lists the lowest-priced card for sale first

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/store/product-listing`: `Order and free text describe the
  whole catalogue` lists a card for sale before a sold-out one in every order
  and names the price a price order sorts on

## Impact

- **Application** - nothing moves for the for-sale-first order or for a price
  order on the lowest price of every variant: both run. A price order on the
  tile's price, if Q2 lands there, changes
  `packages/grade10-store/backend/src/services/catalog/` and owes a technical
  design. Inside a collection the shop's own price sort orders the cards
  (`collection.ts:26-35`), so the tile's price there needs the store to order
  the collection itself
- **Cases** - every listing case that expects the lowest-priced card first is
  read again against the for-sale grouping
- **Overlap** - `add-store-product-status` carries no ordering requirement and
  hands the order here (its Q6). No other active change modifies this
  requirement

## Open Questions

- ❓ **Price order basis** - Product: does a price order sort on the price the
  tile shows? Recommended: yes (Q2)

## References

- [Product Listing](../../../docs/prds/products/grade10-site/store/product-listing.md)
- [`add-store-product-status` decisions, Q6](../add-store-product-status/decisions.md)
