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
In the cart drawer, signed in with Google or a magic link, or as a guest.

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

🚧 **Checkout integration** - The drawer sends the reviewed lines, the accepted promo code and points through the store's checkout request, and shows its answer.

🚧 **One Pay at a time** - While a Pay is starting, drawer actions wait as the [Cart Drawer](/p/grade10-site/store/cart#pending-operations) describes. An answer for an older cart, tender or member opens nothing.

🚧 **Later cart** - Payment clears the cart it bought unless the member edited or rebuilt it afterwards; the shop's stock or price review alone does not keep a paid cart.

- **Another Pay** - An unchanged purchase returns its existing invoice or order state, including after reload or a lost answer
- **Changed purchase** - A changed basket or tender starts a new purchase and retires the older unpaid invoice. Only the member's own edit retires it; the shop's stock or price review leaves it for the next Pay to replace
- **Recovery** - An uncertain payment handoff keeps the existing purchase visible and recoverable without opening a second payable invoice

🚧 **Return path** - Shopify's Thank You and Order status extension offers a
Grade10 Your Orders link, and the staging walk proves the matching purchase
appears after return.

- **Where it starts** - the live review, the price check and the
  verification gate all run in the cart drawer; there is no `/checkout` page -
  [Cart Drawer](/p/grade10-site/store/cart)

- **Pay** - the drawer's Proceed to Checkout button
- **The bar** — goods worth **HKD 120,000** or more: pressing Proceed to
  Checkout shows the verify message, with an account link where the profile
  page is enabled; no checkout session is created. A verified member, or a basket under the
  bar, proceeds. They verify on [their account](/p/grade10-site/account/kyc)
- **The cart** - Kept while the collector is at Shopify
- **Shipping rate** - Shopify asks the store's carrier rule; a served destination gets the same rate the store preview shows, and any other gets none

- **The invoice** - Fixes the purchase; later cart edits do not change it
- **Order labels** - Existing shared order-status labels; there is no separate unpaid badge

## Guest Checkout

A collector with no session checks out the cart this browser holds. Shopify's
page asks for the email address, and the order belongs to no account.

- **The basket only** - no promo code and no points; both are a member's
- **Email on Shopify's page** - the address the guest types there is kept
  with the order once it is paid
- **No account** - paying makes no account, now or later
- **No points** - a guest order earns nothing, whoever signs in later -
  [Your Profile](/p/grade10-site/loyalty/profile#purchases-before-the-account)
- **The bar** - goods worth **HKD 120,000** or more ask the guest to sign in;
  no checkout session is created
- **The cart** - this browser's cart is emptied when the guest leaves for
  Shopify's page; the invoice holds the basket
- **Order link** - Shopify's confirmation email and thank-you page carry a
  private link to the order; Grade10 sends no email of its own -
  [Order Detail](/p/grade10-site/store/order-detail#guest-order-link)

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
| Guest checkout | Decided | A collector with no session checks out the browser's cart. Shopify's page takes the email; the order belongs to no account, makes none and earns no points. Supersedes members-only checkout. | Product |
| Guest tender | Decided | A guest pays the basket alone: no promo code and no points. Every store code is minted to a member. | Product |
| Guest order link | Decided | The order carries a private link to its page, and Shopify's confirmation email and thank-you page show it. The link carries its secret and needs no account. One email, from Shopify; rejected a Grade10 email of its own, which repeated the link and needed the order email read. Decided 2026-10-12. | Product |
| Current decision | Decided | Cart open provides the early review; Pay makes its own current decision, including when it resumes an invoice. An earlier drawer quote never replaces that decision. | Product |
| Frontend scope | Decided | The drawer uses the store's current checkout request and changes no backend. Invoice reuse, recovery and durable retirement are a separate backend change. Decided 2026-10-09. | @kinisworking |
| Repeated purchase | Decided | The store owns invoice reuse and recovery. The drawer holds no purchase identity; it accepts one Pay at a time. | @kinisworking |
| Paid cart | Decided | Preserve later member edits and rebuilt carts; stock or price changes written by the shop's review alone still allow the paid cart to clear. | @kinisworking |
| Invoice retirement | Decided | Only the member's own line or tender edit retires an open invoice. The shop's stock or price review leaves it for the next Pay to replace. Decided 2026-10-08. | Product |
| Payment labels | Decided | Follow existing shared status contracts and the order-status capability. A new Awaiting payment badge needs a separate product and shared-contract change. | @kinisworking |
| Verification gate | Decided | When the gross-goods gate answers Proceed to Checkout, the drawer shows the threshold message, with the account action where the profile page is enabled. The identity check itself still runs only on the account page. | Product |
| The bar's basis | Decided | Checked against gross goods, not the total after code or points — unchanged from the existing checkout resolution's own goods figure. | Engineering |
:::

:::detail{title="Test cases" for="qa"}
::cases{id="grade10-site/store/checkout"}
:::
