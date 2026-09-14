**Author:** @tangconst - 2026-09-09

## Why

The catalogue cannot answer a popularity order, yet the listing workbench still
offers it and opens on it. Collectors should arrive on latest product — an
order the catalogue can answer — with a trigger that names that choice.

## What Changes

- **Latest at rest** — the listing opens with latest product in force
- **A collection opens the same way** — and an order chosen in a collection
  orders it rather than leaving it, so the collection read takes an order
- **Answerable menu only** — latest, lowest price, highest price; no popularity
- **Trigger copy** — `Sort by <option>` for the active choice
- **Storybook fixtures** — match the same menu and resting sort

## Non-Goals

- **Photo or cart presentation** — sibling listing changes
- **Collection arrival chrome**
- **Computing a popularity signal**

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/store/product-listing`: resting order is latest; menu and
  trigger follow

## Impact

- **Grade10 site** — supplies latest as resting sort and `Sort by …` copy, and
  keeps the collection in force when an order is chosen in it
- **Store worker and Shopify port** — the collection read takes an order and
  passes it to the products connection of the collection it already fetches
- **Storybook** — `store-product-listing` fixtures and preview listing page,
  already matching
- **ZZZ** — unchanged; supplies its own sort options
- **Scenario ids** — SC-15 modified wording; SC-06 and SC-09 no longer count an
  order among the acts that leave a collection; SC-29, SC-39 and SC-40 added
- **Manual** — the Product decisions rows “No popularity order” and “One
  narrowing at a time” update when this lands, and ordering leaves the page's
  not-in-scope line

## Open questions

- none
