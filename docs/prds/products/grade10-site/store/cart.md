---
title: Cart Drawer
spec: grade10-site/store/cart-drawer
order: 4
---

The Cart Drawer opens over the page the collector is on: they check what is in
the cart, put a promo code and points against it, and go on to checkout or
back to that page.

## Rules

| Rule | Value |
| --- | --- |
| Who | A signed-in member; a signed-out session holds no lines |
| Promo codes | **1 per cart** — a second replaces the first |
| Points | **After the code**, at **$1** a point, on qualifying goods only; an ask past the ceiling is trimmed to it — [Paying with Points](/p/grade10-site/loyalty/paying-with-points) |
| Estimated total | **Goods − code − points** — before shipping, tax and the shop's own sale, which the invoice prices |
| Held codes | The member's own store codes and reward coupons, the ones that fit first, the soonest to expire first; every store code is minted to a member, so the list is complete |
| Carried to checkout | The code and the points, held with the cart; `/checkout` shows the same figures and Pay sends them; a paid order clears them |

## Reviewing the Cart

- **Current read** — every line is read against the shop on open; the
  price and the stock are the shop's own —
  [Cart Validation](/p/grade10-site/store/cart-validation)
- **Unresolved** — while the read is pending or failed the lines, the
  totals and Checkout wait; nothing held is shown as current
- **Lines the shop no longer sells** — leave the cart on open, with one
  notice
- **One scope** — the member cart of the signed-in session; a signed-out
  session holds no lines and builds none
- **Edits** — quantity and removal write to the same cart the page holds
- **The choice follows the cart** — the code and the points the member
  chose are held with the lines, so both are still there after a reload and
  on another device; the figures are read again either way

## Promo Code

🚧 One code rides the cart, typed or picked; every figure is the store's,
read against the cart as it stands and held nowhere.

- 🚧 **Typed** — a code the store knows takes its cut off the total at
  once; one it refuses stays in the field with the refusal's own sentence,
  and the total does not move
- 🚧 **Picked** — a held code applies the same way from the list; one that
  cannot ride this cart is listed apart with its reason
- 🚧 **Removed** — Remove puts the code back; a cart edit that makes it
  stop fitting takes it off with a notice
- 🚧 **Wallet not answered** — the codes the store minted are still listed
  and a typed code still applies; `/checkout` says the programme's rewards
  could not be read
- 🚧 **Gift** — a code that gives an item adds it as a line at no charge;
  taking that line out puts the code back
- 🚧 **Refusals in the reader's language** — every reason a code or the
  points are refused is said in the site's own words, by its cause

The refusals are the coupon's own —
[Coupons](/p/grade10-site/loyalty/coupons#refusals).

## Points

- 🚧 **Offered** — to a member the programme knows, with the balance, the
  rate and the most this cart can take after the code
- 🚧 **Applied** — the amount typed shows as a Points row and lowers the
  total; an ask past the ceiling is trimmed to it
- 🚧 **Nothing left** — a code that took the whole of the goods leaves
  points nothing to pay, and the field says so
- 🚧 **Not offered** — to a guest, a member outside the programme, or
  while the programme has not answered

## Checkout

- 🚧 **Carried** — Checkout opens `/checkout` with the same code and
  points; that page reads the cart again and shows the same figures
- 🚧 **Sent** — Pay sends the code and the points, and the order is
  promised with them —
  [Shopify Integration](/p/grade10-site/loyalty/shopify-integration#online-checkout)

::image{src="assets/diagrams/store-cart-quote.svg" alt="How the drawer and the store arrive at the cart's total"}

## Designs

::story{id="store-cart-cartdrawer--default" title="The cart drawer"}

::story{id="store-cart-cartdrawerfooter--interactive-member" title="A code and points on the cart"}

::story{id="store-cart-cartdrawer--unavailable-items-removed" title="Lines the store no longer sells, leaving"}

::story{id="store-cart-cartdrawer--empty-state" title="An empty cart"}

:::detail{title="Code map" for="engineer"}
- **The quote** — `checkout.basketQuote`, `packages/grade10-store/backend/src/services/orders/quote.ts`, on the same `orders/tender.ts` the checkout's promise prices with
- **The held choice** — `cart.tender` and `cart.setTender`, `packages/grade10-store/backend/src/services/cart/tender.ts`
- **The wallet read** — `quoteCouponsFor`, `packages/loyalty/backend/src/services/rewards/coupons.ts`
- **The drawer** — `apps/frontend/grade10/src/chrome/CartDrawerHost.tsx`, over the `cart` and `checkout` slices of `@grade10/store-frontend`
- **Design record** — [commerce architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Product decisions" for="pm"}
The drawer serves a collector who wants to check the cart, and what a code
and points do to it, without leaving the product or collection they are
considering. Its value is a total they can trust before they go to pay.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Signed-in collector | Opens Cart from the header on any surface | Sees what a code and points take off, and carries the choice to checkout. |
| Signed-out collector | Presses Add to cart on the listing or product page | Meets the sign-in dialog; no guest cart is built. |
| Collector whose cart moved | Opens Cart before checkout | Sees current facts or a clear unresolved state, never a stale claim. |

**Not in scope.** A dedicated cart page. Creating the order from the
drawer. Product-image enrichment. Shipping and tax before the invoice. A
second code on one cart.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Drawer-to-checkout sessions | Share of sessions that open Cart and proceed to checkout without first navigating there. | Product |
| Failed open reviews | Share of drawer opens whose current-cart read cannot complete. | Engineering |
| Refused tender | Share of quotes whose code or points were refused, by reason. | Engineering |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Overlay, not page | Decided | Cart stays attached to the browsing moment; a new route would make the collector leave before the drawer solves anything. | Product |
| Global cart | Decided | Once Store answers the cart drawer, Cart stays in the header on every surface (including Auction), not only Store and checkout — so checkout stays one tap away. Absent only on auction-first while that drawer does not answer. Page-shell owns the control; this page owns the drawer. | Product |
| Current read first | Decided | The drawer waits for Cart Validation rather than dressing held values as current. | Product |
| One session scope | Decided | The cart is the signed-in member's. A signed-out session holds no lines; there is no guest checkout and no guest cart to merge. | Product |
| One quote | Decided | The drawer and `/checkout` read one store quote — the lines, the one code or reward, points after it — on the same arithmetic the checkout then writes, so no total is shown that the order records differently. | Product |
| Tender in the drawer | Decided | A signed-in member applies a code and points in the drawer and the total moves; the choice is held with the cart and carried to `/checkout`. | Product |
| Held list | Decided | The member's own store codes and reward coupons, answered before they are picked. | Product |
| Another member's code | Decided | Answered as a code nobody minted, so a typed code tells nobody whose wallet it is in. | Product |
| Points after the code | Decided | Points pay what the code leaves, so the ceiling moves with the code — [Paying with Points](/p/grade10-site/loyalty/paying-with-points). | Product |
| Shipping and sale | Decided | Unknown until the invoice; the estimated total is the goods after this store's own tender. | Product |
| Existing checkout surface | Decided | The drawer opens `/checkout`; that surface keeps ownership of its live read and checkout creation. | Engineering |
| Public codes | Decided | The store mints every code to one member. A public code is a Shopify discount, created in the shop's admin and promoted elsewhere; the cart neither lists nor takes one. | Product |
| The choice on a second visit | Decided | The cart holds which code and how many points the member means to use, so a choice survives a reload and reaches another device. The cart holds the choice, never the figures: those stay the store's, read against the cart as it stands. | Product |
:::
