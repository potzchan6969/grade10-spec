## Screens

The [CartItem Default story](https://storybook.grade10-stg.com/?path=/story/store-cart-blocks-cartitem--default) and existing thumbnail frame are the visual reference. The shared renderer already supplies the picture, item-name alt fallback and no-picture placeholder. This change adds controlled picture stories and assets without changing the frame, layout, copy, tokens or exports.

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Reviewed product with picture | Current first product picture in the existing thumbnail frame | `grade10-site-store-cart-drawer-SC-34`, `shared-ui-store-cart-SC-64` |
| Picture without alt text | Same picture with the item name in its alt attribute | `grade10-site-store-cart-drawer-SC-41`, `shared-ui-store-cart-SC-65` |
| Product without picture | Existing thumbnail placeholder | `grade10-site-store-cart-drawer-SC-35`, `shared-ui-store-cart-SC-66` |
| Sold-out product with picture | Picture with existing sold-out treatment | `grade10-site-store-cart-drawer-SC-42`, `shared-ui-store-cart-SC-64` |
| Legacy response without picture fields | Existing thumbnail placeholder | `grade10-site-store-cart-drawer-SC-39`, `shared-ui-store-cart-SC-66` |
| Failed catalogue review | Existing unresolved presentation and readiness | `grade10-site-store-cart-drawer-SC-38` |
| Picture resource fails | Existing browser image presentation; accepted cart facts remain | `grade10-site-store-cart-drawer-SC-45` |
