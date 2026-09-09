**Author:** @tangconst - 2026-09-09

## Why

The catalogue cannot answer a popularity order, yet the listing workbench still
offers it and opens on it. Collectors should arrive on latest product — an
order the catalogue can answer — with a trigger that names that choice.

## What Changes

- **Latest at rest** — the listing opens with latest product in force
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

- **Grade10 site** — supplies latest as resting sort and `Sort by …` copy
- **Storybook** — `store-product-listing` fixtures and preview listing page
- **ZZZ** — unchanged; supplies its own sort options
- **Scenario ids** — SC-15 modified wording; SC-22 added
- **Manual** — Product decisions row “No popularity order / at rest” updates
  when this lands

## Open questions

- none
