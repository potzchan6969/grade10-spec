---
title: Product Status
spec: grade10-site/commerce/product-status
order: 5
---

Product Status defines Shopify's answer for each variant, the listing tile's
rollup for a product, and the one internal sale identity a product page uses.
The cart reads the identity on each line again when it reviews the cart.

## Availability

- **The shop's own answer** — a variant is available when Shopify offers it
  for sale on the store's channel, out of stock when it does not; the store
  never reads a stock count or an inventory policy to decide
- **Selling past zero is the shop's call** — a variant Shopify keeps selling
  at a count of zero stays available; one it stops selling at zero goes out
  of stock
- **A card rolls up on the listing** — its tile reads out of stock only when
  every Shopify variant is; its page reports availability for the one sellable
  item, using that item's internal Shopify sale identity
- **Priced either way** — an out-of-stock variant keeps its price and offers
  no control that cannot be used

## Browsing limits

🚧 The listing says whether any variant on a product is available; the product
page says whether its one internal sale item can be bought. Neither browse
surface says how many are left — no remaining count, no scarcity label, no
difference between a variant with one left and one with four hundred. An
unpublished product carries no unavailable tile; it is absent from the
listing, and its own address answers as any missing product's does.

## Quantity requests

🚧 The listing and product page may carry the collector's requested add
quantity, but do not expose or apply a stock-derived limit. When the cart opens
or is offered for checkout, the shop answers a requested quantity in one of
three ways:

| Answer | When |
| --- | --- |
| Fillable | The variant is available, and the request is at or below any count Shopify exposes |
| Fillable in part | The variant is available, and the request is above a count above zero — the answer names what it can fill |
| Not fillable | The variant is out of stock |

A count of zero the shop still sells past, or no count at all, bounds
nothing — every request of that variant is fillable. What the cart does with
a line that cannot be filled in full belongs to
[Cart](/p/grade10-site/store/cart).
