---
title: Store Locator Block
spec: shared/ui/store-locator
order: 12
---

**Shared export** - applications import `StoreLocator` from `@grade10/ui`:
the Location & Hours block between site chrome, with a map that opens Google
Maps, the store name, the street address lines and the week's hours. The
application supplies every word, the map, the Maps destination and at least
one hours row; the block invents none of them

## Designs

::story{id="store-store-locator-screens-store-locator--default" title="Store Locator page - composes the block"}

::story{id="store-store-locator-blocks-storelocator--default" title="The block, with every fact as supplied"}

::story{id="store-store-locator-blocks-storelocator--keyboard-reaches-the-map-once" title="The map, one keyboard stop"}

::story{id="store-store-locator-blocks-storelocator--narrow" title="One column on a phone"}

🚧 **Agreed look** - the Storybook assembly; no design frame is drawn for it.

:::detail{title="Test cases" for="qa"}
::cases{id="shared/ui/store-locator"}
:::
