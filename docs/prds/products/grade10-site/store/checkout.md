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

🚧 **Checkout integration** - The live review, hosted handoff, safe recovery
and settlement run through staging before production enablement.

🚧 **Return path** - Shopify's Thank You and Order status extension offers a
Grade10 Your Orders link, and the staging walk proves the matching purchase
appears after return.

🚧 **No separate checkout page** - the live review, the price check and the
verification gate all run in the cart drawer; there is no `/checkout` page
to navigate to.

- **Members only** — checkout is signed in; there is no guest checkout
- **The bar** — goods worth **HKD 120,000** or more need a verified buyer;
  an unverified one is sent to [verify from their account](/p/grade10-site/account/kyc)
  before any order is made
- **The cart** — kept while the collector is at Shopify; cleared once the
  order is paid
- **A second press** — returns the same checkout, never a second order

❓ **Changed purchase** - @kinisworking confirms whether an earlier payable
invoice must be canceled before a basket or tender edit starts another checkout.

❓ **Added quantity** - @kinisworking confirms what remains in the cart when
the collector adds quantity to a paid line while paying at Shopify.

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
| Checkout-open read | Decided | The cart drawer's own continuous live quote, kept current while the drawer is open, stands in for a separate checkout-open read; no second client-side re-read is added before Pay. | Engineering |
| Verification gate | Decided | Shown inline in the cart drawer — the same threshold-and-account-link message the former checkout page showed, replacing the checkout action rather than sitting disabled beside it. The identity check itself still runs only on the account page. | Product |
| The bar's basis | Decided | Checked against gross goods, not the total after code or points — unchanged from the existing checkout resolution's own goods figure. | Engineering |
:::
