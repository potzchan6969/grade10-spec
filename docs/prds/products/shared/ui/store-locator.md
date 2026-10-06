---
title: Store Locator Block
spec: shared/ui/store-locator
order: 12
---

🚧 **Shared export** — applications import `StoreLocator` from `@grade10/ui`:
the Location & Hours block between site chrome, with a map that opens Google
Maps, the store name, the street address lines and the week's hours. The
application supplies every word, every hours row, the map and the Maps
destination; the block invents none of them

## Designs

::story{id="pages-store-locator-page--default" title="Store Locator page — composes the block"}

❓ **Agreed look** — no Figma frame draws the page; the designer confirms the
Storybook assembly, the empty-hours state, one hours row per day and the
map's box when Google's map does not load, or draws a frame
