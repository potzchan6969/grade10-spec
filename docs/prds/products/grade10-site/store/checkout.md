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

🚧 **Checkout integration** - The drawer integrates the cart-header backend and the complete checkout contract; every required backend guarantee remains a dependency of delivery.

🚧 **Another Pay** - An unchanged purchase returns its existing invoice or order state, including after reload or a lost answer.

🚧 **Changed purchase** - A changed basket or tender starts a new purchase and retires the older unpaid invoice through the store's recovery path. Only the member's own edit retires it; the shop's stock or price review leaves it for the next Pay to replace.

🚧 **Later cart** - Payment clears the cart it bought unless the member edited or rebuilt it afterwards; the shop's stock or price review alone does not keep a paid cart.

🚧 **Recovery** - An uncertain payment handoff keeps the existing purchase visible and recoverable without opening a second payable invoice.

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
- **The cart** - Kept while the collector is at Shopify

- **The invoice** - Fixes the purchase; later cart edits do not change it
- **Order labels** - Existing shared order-status labels remain in use; this change adds no new badge

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
| Current decision | Decided | Cart open provides the early review; Pay makes its own current decision, including when it resumes an invoice. An earlier drawer quote never replaces that decision. | Product |
| Cart-header integration | Decided | Integrate every backend cart-header change and retain the complete durable requirements. Missing backend guarantees remain delivery dependencies, not scope waivers. | @kinisworking |
| Repeated purchase | Decided | The store owns invoice reuse and recovery; the frontend keeps the purchase identity across Pay and a same-session reload. | @kinisworking |
| Paid cart | Decided | Preserve later member edits and rebuilt carts; stock or price changes written by the shop's review alone still allow the paid cart to clear. | @kinisworking |
| Invoice retirement | Decided | Only the member's own line or tender edit retires an open invoice. The shop's stock or price review leaves it for the next Pay to replace. Decided 2026-10-08. | Product |
| Payment labels | Decided | Follow existing shared status contracts and the order-status capability. A new Awaiting payment badge needs a separate product and shared-contract change. | @kinisworking |
| Verification gate | Decided | The existing drawer checkout shows the threshold-and-account-link message with an account action when the gross-goods gate answers. The identity check itself still runs only on the account page. | Product |
| The bar's basis | Decided | Checked against gross goods, not the total after code or points — unchanged from the existing checkout resolution's own goods figure. | Engineering |
:::
