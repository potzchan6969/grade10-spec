---
title: Checkout
spec: grade10-site/store/checkout
order: 5
---

Checkout is Shopify's page, under `checkout.grade10.com`. The store hands it
the cart, Shopify takes the address and the money, and the order comes back
to Grade10.

:::flow{title="From the cart to the order"}
# Leaving the store

## Collector — Press checkout
In the cart drawer, signed in with Google or a magic link.

## Store — Read every line live
Current price and stock, from Shopify. A line that moved comes back named.

## Collector — Check the price
The promo code and the points chosen in the drawer, and the estimated
total they leave — [Cart Drawer](/p/grade10-site/store/cart). Pay sends
them with the lines.

# On Shopify's page

## Collector — Fill in shipping and pay
Address, shipping option, discount code, payment. Shipping and tax are added
here, so the cart's subtotal is not the charge.

## Shopify — Take the payment
An item that sold out in the meantime is refused, with the item named.

# Back at Grade10

## Shopify — Tell the store
The order moves from pending to paid within seconds.

## Collector — Open Your Orders in Grade10
The Shopify Thank You and Order status page offers a Grade10 Your Orders link.
The matching purchase appears there. The native Continue shopping button is
not the return path.

## Collector — Find the order
In Your Orders.
:::

## Integration readiness

🚧 **Checkout integration** - The drawer uses the existing checkout backend
for hosted handoff and order return; this change adds frontend integration only.

🚧 **Return path** - Shopify's Thank You and Order status extension offers a
Grade10 Your Orders link, and the staging walk proves the matching purchase
appears after return.

🚧 **No separate checkout page** - the live review, the price check and the
verification gate all run in the cart drawer; there is no `/checkout` page
to navigate to.

- **Members only** — checkout is signed in; there is no guest checkout
- **The bar** — goods worth **HKD 120,000** or more: the drawer replaces
  Proceed to Checkout with the verify message and an account link; no
  checkout session is created. A verified member, or a basket under the
  bar, proceeds. They verify on [their account](/p/grade10-site/account/kyc)
- **The cart** — kept while the collector is at Shopify; cleared once the
  order is paid
- **Another Pay** - A new submission uses the existing creation flow; earlier
  invoices are ignored and may remain payable

- **The invoice** - Fixes the purchase; later cart edits do not change it
- **Cart cleanup** - Existing payment settlement removes whole matching lines
  and clears tender choices; this integration adds no cart-edit reconciliation

:::detail{title="Design record" for="engineer"}
- **The pages** — [storefront checkout](https://github.com/9gag/grade10/blob/main/docs/architecture/storefront-checkout.md): five outcome kinds, one treatment per kind
- **The order machine, recovery, refunds** — [commerce](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Test page" for="engineer"}
- **Test page** — under an **Overrider** nav heading, development and staging only; drives the real checkout procedures against a real shop, as the signed-in buyer or with a typed email
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Checkout-open read | Decided | The read when the cart opens stands in for a separate checkout-open read, and the read at Proceed to Checkout prices the order, as [Cart Validation](/p/grade10-site/store/cart-validation) states; no client-side re-read is added before it. | Engineering |
| Verification gate | Decided | The existing drawer checkout shows the threshold-and-account-link message with an account action when the gross-goods gate answers. The identity check itself still runs only on the account page. | Product |
| The bar's basis | Decided | Checked against gross goods, not the total after code or points — unchanged from the existing checkout resolution's own goods figure. | Engineering |
:::
