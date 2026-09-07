---
title: Product Status
spec: grade10-site/commerce/product-status
order: 5
---

Product Status is what "can this be bought" means for a Shopify variant, read
the same way everywhere one appears — the listing, a product's own page, and
the cart never derive their own answer.

## Availability

- **The shop's own answer** — a variant is available when Shopify offers it
  for sale on the store's channel, out of stock when it does not; the store
  never reads a stock count or an inventory policy to decide
- **Selling past zero is the shop's call** — a variant Shopify keeps selling
  at a count of zero stays available; one it stops selling at zero goes out
  of stock
- **A card rolls up to its best variant** — a card reads out of stock only
  when every variant on it is; its own page still answers per variant
- **Priced either way** — an out-of-stock variant keeps its price and offers
  no control that cannot be used

## What browsing never shows

The listing and a product's own page say whether a variant can be bought and
nothing about how many are left — no remaining count, no scarcity label, no
difference between a variant with one left and one with four hundred. An
unpublished product carries no unavailable tile; it is absent from the
listing, and its own address answers as any missing product's does.

## A quantity, once one is asked for

Only the cart and checkout ask for a quantity, and the shop answers one of
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
