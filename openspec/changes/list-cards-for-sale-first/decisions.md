## Goals

- A collector who orders the listing sees the cards they can buy before the
  sold-out ones, in every order.
- The listing requirement states the order Grade10 runs, so a test of it
  asserts what the listing shows.

## Non-Goals

- Hiding a sold-out card from the listing.
- How a tile shows a sold-out card - `add-store-product-status`.
- Adding or removing an order in the sort menu.
- What free text matches, and whether a collection takes a facet - their own
  open rows on Product Listing.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does a card for sale list before a sold-out one, and in which orders? | In every order: latest product, lowest price and highest price, at rest and inside a collection. The order asked for holds within each group. Grade10 runs it (`packages/grade10-store/backend/src/services/catalog/browse.ts:87-92`, `collection.ts:52-54`) - decided by the product owner on the recommendation, 2026-10-07, as `add-store-product-status` Q6 | For sale first in the price orders only; no grouping, so the first card in a lowest-price order may be one nobody can buy |
| Q2 | Which price does a price order sort on? | ❓ Product - recommended: the price the tile shows, the one item's price, so the first card in a lowest-price order shows the lowest price on the listing. Grade10 sorts on the lowest price of every variant (`packages/grade10-store/backend/src/services/catalog/projection.ts:136-141`), so the recommendation adds a backend change | The lowest price of every variant, as runs, where a card can list ahead of one whose tile shows a lower price |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
