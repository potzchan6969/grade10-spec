---
title: Cart
spec: grade10-site/store/cart-validation
order: 4
---

The cart is a drawer over the page: what is in it, what it costs, and the
button to check out.

- **Add** — from a product's details page; the cart is kept in this browser,
  so no sign-in to fill it, a reload keeps it, another device starts empty
- **Lines** — name, grade, price, quantity; change the quantity or remove the
  line; the badge on the cart button counts the lines that can still be bought
- **Opens on today's prices** — every line is re-read as the drawer opens
  1. **Sold out** — marked, and stays for the collector to remove
  2. **Fewer left** — drops to what the shop can fill, and says so
  3. **Gone from the store** — leaves, with one toast
  4. **Repriced** — shows the new price, once
- **Promo code** — entered in the drawer; each cut shows once
  1. **Order-level** — the footer shows the code and the cut; lines keep their
     catalogue or sale price
  2. **Product** — the line shows the code and the discounted unit price; the
     footer does not repeat that cut
- **Checkout** — the button hands the cart to Shopify; every line is checked
  again on the way, and a line that moved comes back named

## Designs

::story{id="store-cart-cartdrawer--default" title="The cart drawer"}

::story{id="store-cart-cartdrawer--unavailable-items-removed" title="Lines the store no longer sells, leaving"}

::story{id="store-cart-cartdrawer--empty-state" title="An empty cart"}

::story{id="store-cart-cartitem--product-coupon" title="A product promo on a cart line"}
