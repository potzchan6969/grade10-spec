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
- **Sold out** — what a collector reads for out of stock, on the tile, the
  page and the cart line
- **Selling past zero is the shop's call** — a variant Shopify keeps selling
  at a count of zero stays available; one it stops selling at zero goes out
  of stock
- **A card rolls up on the listing** — its tile reads out of stock only when
  every Shopify variant is
- **One item per card** — the first variant for sale, or the first listed
  when none is; the tile and the page show its price, and both add it, with
  no choice between variants
- **Priced either way** — an out-of-stock variant keeps its price, and
  nothing that adds it can be pressed
- **A line keeps its item** — a cart line reads the variant it was added as;
  once the card's one item moves to another variant, a page add puts that
  variant on a line of its own

## Browsing Limits

🚧 The listing says whether any variant on a product is available; the product
page says whether its one internal sale item can be bought. Neither browse
surface says how many are left — no remaining count, no scarcity label, no
difference between a variant with one left and one with four hundred. An
unpublished product carries no unavailable tile; it is absent from the
listing, and its own address answers as any missing product's does.

## Quantity Requests

🚧 The listing and product page may carry the collector's requested add
quantity, but do not expose or apply a stock-derived limit. When the cart opens
or is offered for checkout, the shop answers a requested quantity in one of
three ways:

| Answer | When |
| --- | --- |
| Fillable | The variant is available, and Shopify exposes no count above zero or the request is at or below it |
| Fillable in part | The variant is available, and the request is above a count above zero — the answer names what it can fill |
| Not fillable | The variant is out of stock |

- **Selling past a count** — a request above a count above zero fills in
  part even when the shop sells the variant past zero, because the store
  never reads that setting

What the cart does with a line that cannot be filled in full belongs to
[Cart Validation](/p/grade10-site/store/cart-validation).
