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
In the cart drawer, signed in or as a guest.

## Store — Read every line live
Current price and stock, from Shopify. A line that moved comes back named.

## Collector — Check the price
The promo code and points chosen in the drawer, and the estimated total.

# On Shopify's page

## Collector — Fill in shipping and pay
Shipping and tax are added here.

## Shopify — Take the payment
An item that sold out meanwhile is refused, named.

# Back at Grade10

## Shopify — Tell the store
The order moves from pending to paid within seconds.

## Collector — Find the order
In My Orders.
:::

## Proceed to Checkout

- **Pay** — the cart drawer's Proceed to Checkout button, signed in with Google or a magic link, or as a guest; there is no checkout page of the store's own — [Cart Drawer](/p/grade10-site/store/cart)
- **Live Read** — every line's current price and stock, from Shopify; a line that moved comes back named
- **Price Check** — the promo code and the points chosen in the drawer, and the estimated total they leave; Pay sends them with the reviewed lines, and the drawer shows the store's answer — [Cart Drawer](/p/grade10-site/store/cart)
- **One Pay at a Time** — while a Pay is starting, drawer actions wait — [Cart Drawer](/p/grade10-site/store/cart#pending-operations); an answer for an older cart, code and points, or member opens nothing
  - **Closing During Pay** — the drawer can close while checkout starts, which doesn't cancel it; the reply still opens Shopify if the cart, code and points, and member it was sent for are current

## Paying Again

- **Invoice** — fixes the purchase; later cart edits don't change it
- **Another Pay** — an unchanged purchase returns its existing invoice or order state, after a reload, from a second tab or after a lost answer; a purchase already paid opens its order
- **Changed Purchase** — a changed basket, code or points starts a new purchase and retires the older unpaid invoice
  - **Shop's Review** — only the member's own edit retires it; the shop's stock or price review leaves it for the next Pay to replace
- **After a Refusal** — a Pay after the purchase's order failed or was canceled starts the purchase again
- **Lost Answer** — Pay keeps looking for the invoice Shopify made for about 6 seconds, then asks the collector to try again
  - **Purchase With No Invoice** — closes once **2 minutes** have passed, or later while Shopify can't be read, returning its coupons and points; the next Pay starts it again. Until then it holds only its own coupon and points, and the collector's other purchases go ahead
- **Recovery** — an uncertain payment handoff keeps the existing purchase visible and recoverable, without opening a second payable invoice

## On Shopify's Page

- **Shopify's Checkout** — address, shipping option, discount code, payment; shipping and tax are added here, so the cart's subtotal is not the charge
  - **Shipping Rate** — Shopify asks the store's carrier rule; a served destination gets the same rate the store preview shows, and any other gets none
- **Sold Out Meanwhile** — an item that sold out since the drawer's read is refused, with the item named
- **The Cart** — kept while the collector is at Shopify

:::callout{kind="note"}
- ❓ **A Declined Card** — Shopify's page refuses it and places no order; the cart stays, and the next payment places exactly one order. Product confirms
:::

## After Paying

- **Paid Order** — Shopify tells the store, and the order moves from pending to paid within seconds
- 🚧 **My Orders Link** — Shopify's Thank You and Order status page offers a link to My Orders in Grade10, where the matching purchase appears; Shopify's own Continue shopping button is not the way back
- **Cleared Cart** — payment clears the cart it bought, unless the member edited or rebuilt it afterwards; the shop's stock or price review alone does not keep a paid cart
- **Order Labels** — the shared order-status labels, with no unpaid badge of its own

## Guest Checkout

- **Gateway** — the signed-out drawer's primary button, Check out as guest, checks out the cart this browser holds; under it a quiet Sign in link for points and rewards, and no extra step — [Cart Drawer](/p/grade10-site/store/cart#checkout)
  - **A Public Code** — the guest may type one or pick one in the drawer; a member's own codes and rewards are never shown to a guest — [Discounts](/p/grade10-site/store/discounts#public-codes)
  - **The Cart** — this browser's cart keeps the basket until it reads the order paid, so a guest who leaves Shopify's page unpaid comes back to a full cart; a cart the guest changed after Pay is kept
- **Email on Shopify's Page** — Shopify's page asks for it, and it is kept with the order once paid; the order belongs to no account until it joins one under that email
  - **No Account** — paying makes no account, now or later
  - **Joining an Account** — a guest order joins the account whose proven email it was placed under: at payment when that account exists, otherwise at that account's next sign-in. Every other guest order under that email joins with it
    - **Post-Checkout Account** — the order page after payment asks the buyer to sign in to add the order to an account; a sign-in that proves the order's email adds it — [Order Detail](/p/grade10-site/store/order-detail#back-from-checkout)
    - **No Points** — a guest order never earns, joined or not; only an order placed with an account earns — [Points](/p/grade10-site/loyalty/points#rules)
- **Order Link** — every web order's emails, guest and member, carry the private link; Grade10 sends no store email of its own — [Order Detail](/p/grade10-site/store/order-detail#order-link)

::story{id="store-cart-screens-cart-drawer-guest--guest" title="The signed-out drawer leads with guest checkout"}

::story{id="store-order-detail-screens-order-link--just-paid" title="Back from checkout, the account ask as a toast"}

:::detail{title="Design record" for="engineer"}
- **The pages** — [storefront checkout](https://github.com/9gag/grade10/blob/main/docs/architecture/storefront-checkout.md): five outcome kinds, one treatment per kind
- **The order machine, recovery, refunds** — [commerce](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Product decisions" for="pm"}
- **One email, from Shopify** — every order email's View order button carries the order's private link; a Grade10 email of its own was rejected, since it repeated the link and needed the order email read — [Order Detail](/p/grade10-site/store/order-detail#order-link)
- **Guest checkout in the drawer's footer** — chosen over a choice step after Checkout, which adds a tap for every guest
- **A joined guest order earns nothing** — it joins only because Shopify holds it under that email; no account was there when it was placed
- **The account prompt on the Grade10 order page** — a Shopify Thank-you extension was rejected: it lives outside the store and limits Google sign-in
- **A lost answer closes itself** — after 2 minutes, giving back its coupons and points; supersedes operator review, which held the member's every purchase until a person bound or canceled the invoice
- **Not in scope** — a banner for an email that already has an account, since Shopify's page holds the email before payment and a lookup there needs an extension; an Awaiting payment badge, which needs its own product and shared-contract change
- ❓ **Session ends at Proceed to Checkout** — the drawer closes; does the collector then meet a sign-in dialog, or check out as a guest? Recommended: no dialog, the collector presses Cart and checks out as a guest. @kinisworking confirms
:::

:::detail{title="Test cases" for="qa"}
[Test cases · grade10-site/store/checkout](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/store/checkout)
:::
