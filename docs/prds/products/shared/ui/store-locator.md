---
title: Store Locator Block
spec: shared/ui/store-locator
order: 12
---

`StoreLocator` is the Location & Hours block between site chrome: a map that
opens Google Maps, the store name, street address lines, and week hours. The
application supplies every word, every hours row, the map embed, and the Maps
destination — the block invents none of them.

🚧 **Shared export** — applications import `StoreLocator` from `@grade10/ui`
rather than assembling the page from primitives alone

## Designs

::story{id="pages-store-locator-page--default" title="Store Locator page — composes the block"}
