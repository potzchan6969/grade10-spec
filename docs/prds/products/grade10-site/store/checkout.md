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

🚧 **Closing during Pay** - The collector can close the drawer while checkout starts. A successful reply still opens Shopify if the submitted cart, tender and member remain current. Closing does not cancel the request.

🚧 **Later cart** - Payment clears the cart it bought unless the member edited or rebuilt it afterwards; the shop's stock or price review alone does not keep a paid cart.

- **Another Pay** - An unchanged purchase returns its existing invoice or order state, including after reload or a lost answer
- **Changed purchase** - A changed basket or tender starts a new purchase and retires the older unpaid invoice. Only the member's own edit retires it; the shop's stock or price review leaves it for the next Pay to replace
- **Recovery** - An uncertain payment handoff keeps the existing purchase visible and recoverable without opening a second payable invoice

🚧 **Return path** - Shopify's Thank You and Order status extension offers a
Grade10 Your Orders link, and the staging walk proves the matching purchase
appears after return.

- **Where it starts** - the live review and the price check run in the
  cart drawer; there is no `/checkout` page -
  [Cart Drawer](/p/grade10-site/store/cart)

- **Pay** - the drawer's Proceed to Checkout button
- **The cart** - Kept while the collector is at Shopify
- **Shipping rate** - Shopify asks the store's carrier rule; a served destination gets the same rate the store preview shows, and any other gets none

- **The invoice** - Fixes the purchase; later cart edits do not change it
- **Order labels** - Existing shared order-status labels; there is no separate unpaid badge

## Guest Checkout

A collector with no session checks out the cart this browser holds. Shopify's
page asks for the email address, and the order belongs to no account until it
joins one under that email.

- **A public code** - the guest may type one or pick one in the drawer;
  a member's own codes and rewards are never shown to a guest -
  [Discounts](/p/grade10-site/store/discounts#public-codes)
- **Gateway** - the signed-out drawer's primary button is Check out as
  guest; under it a quiet Sign in link for points and rewards, and no
  extra step -
  [Cart Drawer](/p/grade10-site/store/cart#checkout)
- **Email on Shopify's page** - the address the guest types there is kept
  with the order once it is paid
- **No account** - paying makes no account, now or later
- **Joining an account** - a guest order joins the account whose proven
  email it was placed under: at payment when that account exists, otherwise
  at that account's next sign-in. Every other guest order under that email
  joins with it
- 🚧 **No points** - a guest order never earns, joined or not; only an
  order placed with an account earns -
  [Points](/p/grade10-site/loyalty/points#rules)
- **The cart** - this browser's cart keeps the basket until it reads the
  order paid, so a guest who leaves Shopify's page unpaid comes back to a full
  cart; a cart the guest changed after Pay is kept
- **Post-checkout account** - the order page after payment asks the
  buyer to sign in to add the order to an account; a sign-in that proves
  the order's email adds it -
  [Order Detail](/p/grade10-site/store/order-detail#back-from-checkout)
- **Order link** - every web order's emails, guest and member, carry the
  private link; Grade10 sends no store email of its own -
  [Order Detail](/p/grade10-site/store/order-detail#order-link)

## Designs

::story{id="store-cart-screens-cart-drawer-guest--guest" title="The signed-out drawer leads with guest checkout"}

::story{id="store-order-detail-screens-order-link--just-paid" title="Back from checkout, the account ask as a toast"}

:::detail{title="Design record" for="engineer"}
- **The pages** — [storefront checkout](https://github.com/9gag/grade10/blob/main/docs/architecture/storefront-checkout.md): five outcome kinds, one treatment per kind
- **The order machine, recovery, refunds** — [commerce](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Guest checkout | Decided | A collector with no session checks out the browser's cart. Shopify's page takes the email; the order belongs to no account until it joins one under that email — paying makes none. Supersedes members-only checkout. | Product |
| Guest tender | Decided | A guest may type or pick a public code in the drawer, and spends no points. Decided 2026-10-13; supersedes the basket-only rule (2026-10-12). | Product |
| Guest order link | Decided | Every order now carries a private link to its page, guest and member alike, and every order email's View order button shows it. The link carries its secret and needs no account — see [Order Detail](/p/grade10-site/store/order-detail#order-link). One email, from Shopify; rejected a Grade10 email of its own, which repeated the link and needed the order email read. Decided 2026-10-12; widened 2026-10-13. | Product |
| Gateway in the footer | Decided | The signed-out drawer's primary button is Check Out as Guest, with a quiet sign-in link under it. Chosen over a choice step after Checkout, which adds a tap for every guest. Decided 2026-10-13. | Product |
| Guest order linking | Decided | Every paid guest order placed under an email joins the member's account automatically once a sign-in proves that email — a magic link to it or a Google account under it — on any sign-in, including from the prompt. The order gets an owner and earns nothing. Decided 2026-10-13; supersedes prompt-only saving (earlier 2026-10-13). | Product |
| Guest order points | Decided | A guest order never earns, joined or not; only an order placed with an account earns. It joins an account only because Shopify holds it under that email, so Your Orders lists it; no account was there when it was placed, so it earns nothing. Decided 2026-10-14, the owner's answer; supersedes earning on completion when joined before it completed (2026-10-13). | Product |
| Join at payment | Decided | A guest order placed under the proven email of an existing account joins that account at payment, without waiting for a sign-in. Decided 2026-10-13, the owner's answer. | Product |
| Prompt location | Decided | The account prompt lives on the Grade10 order page. Rejected a Shopify Thank-you extension, which lives outside the store and limits Google sign-in. Decided 2026-10-13. | Product |
| Existing-account banner | Decided | Dropped from scope 2026-10-13. Shopify's page holds the email before payment and a lookup there needs an extension. | Product |
| Current decision | Decided | Cart open provides the early review; Pay makes its own current decision, including when it resumes an invoice. An earlier drawer quote never replaces that decision. | Product |
| Frontend scope | Decided | The drawer uses the store's current checkout request and changes no backend. Invoice reuse, recovery and durable retirement are a separate backend change. Decided 2026-10-09. | @kinisworking |
| Repeated purchase | Decided | The store owns invoice reuse and recovery. The drawer holds no purchase identity; it accepts one Pay at a time. | @kinisworking |
| Reply after closing | Decided | A still-current successful checkout reply opens Shopify after dismissal. Chosen over ignoring navigation on 2026-10-13. | @kinisworking |
| Guest paid cart | Decided | A guest's cart empties when this browser reads the order paid, not when the invoice opens; a cart changed after Pay is kept. Decided 2026-10-15, the owner's answer; supersedes emptying at invoice open. | Product |
| Paid cart | Decided | Preserve later member edits and rebuilt carts; stock or price changes written by the shop's review alone still allow the paid cart to clear. | @kinisworking |
| Invoice retirement | Decided | Only the member's own line or tender edit retires an open invoice. The shop's stock or price review leaves it for the next Pay to replace. Decided 2026-10-08. | Product |
| Payment labels | Decided | Follow existing shared status contracts and the order-status capability. A new Awaiting payment badge needs a separate product and shared-contract change. | @kinisworking |
| Verification gate | Decided | Dropped 2026-10-13. Grade10 never required a sign-in or a verified identity for a checkout at HKD 120,000, for a member or a guest. | Product |
| Session ends at Proceed to Checkout | ❓ Open | When a member's session has ended as they press it, the cart drawer closes. Does the collector then meet a sign-in dialog, as the drawer opens today, or check out as a guest, as Guest Checkout says of a collector with no session? Recommended: no dialog; the collector presses Cart and checks out as a guest. | @kinisworking |
:::

:::detail{title="Test cases" for="qa"}
::cases{id="grade10-site/store/checkout"}
:::
