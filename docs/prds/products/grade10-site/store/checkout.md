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

🚧 **Checkout integration** - The drawer hands the member's cart to the
checkout backend for hosted handoff and order return.

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
- 🚧 **The cart** — one per member; kept while the collector is at Shopify,
  and cleared with its code and points once its invoice is paid, however the
  store learns of the payment
- 🚧 **Another Pay** — on the same cart, unchanged, opens the same invoice;
  after the cart changed, a new one is made
- 🚧 **An edit after Pay** — discards the earlier invoice, so it can no longer
  be paid; the edit never waits on Shopify
- **The invoice** — fixes the purchase; later cart edits do not change it
- 🚧 **A late payment** — an invoice paid after the collector changed the cart
  leaves the changed cart as it is

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
| One cart per member | Decided | A member holds one cart, and a paid invoice clears the cart it was made from and nothing else, so a payment the store learns of late never empties a cart built afterwards. Chosen on 2026-10-06 over keeping lines per member. | Product |
| One invoice per cart | Decided | Pay on an unchanged cart opens the invoice already made. The edit that changes the cart discards that invoice once the edit is saved, so an invoice for an earlier cart cannot be paid, and the next Pay makes a new one. Editing never waits on Shopify. Chosen on 2026-10-07 over discarding at the next Pay. | Product |
:::
