**Author:** @seankcw - 2026-08-24

## Why

A collector landing on the Grade10 store home meets a hero, a collection
bento, and a product row drawn in Figma frame `Store` (`4171:9023`), but no
shared component source renders any of it. The listing surface and site chrome
already ship from `@grade10/ui` and `@grade10/design-system`; the home sections
between them are still page glue every application would re-derive from a Figma
screenshot. The preview workbench has a product-list page story and nothing for
the storefront landing.

**Metric:** the number of store-home sections that exist only as hand-written
page markup goes from three (hero, collections, section header) to zero, and the
preview app gains a page story that assembles the full `Store` frame from
named exports.

## What Changes

- **A new capability, `shared-ui/store-home`.** Export contract for the hero,
  the section header (`title` + browse-all link), and the collection bento grid.
  Blocks live in `packages/ui/src/blocks/store-home/`.
- **Preview page assembly.** `apps/preview` gains a Store Home page story
  composing `Nav`, the new blocks, `ProductCard`, and `Footer` — matching
  `4171:9023`.
- **Component-package delta.** The public entry names the new exports and their
  prop/copy types.

## Non-Goals

- **Store Nav collection cards** (`4396:2889`) — a different component set
  (image cards for navigation); not the bento tiles on the home page.
- **Routing, catalog data, or i18n wiring** — the blocks render supplied
  content; the application owns destinations and copy.
- **Mobile layouts** — no mobile frame exists for the home page; responsive
  behaviour beyond not breaking at narrow widths is design's decision.
- **Publishing Code Connect** — templates land in-repo; publish stays manual.

## Capabilities

### New Capabilities

- `shared-ui/store-home`: hero, section header, and collection bento grid for
  the store landing page.

### Modified Capabilities

- `shared-ui/component-package`: names the new `@grade10/ui` exports.

## Impact

- `@grade10/ui`: new `store-home` block directory, stories, figma templates,
  `audit.json`, public entry updates.
- `apps/preview`: Store Home page story and shared fixture content in
  `store-content.ts`.
- Consuming applications may import the new blocks when assembling `/store` or
  the site home; no breaking changes to existing exports.
