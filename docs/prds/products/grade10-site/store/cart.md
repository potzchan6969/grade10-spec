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
| Who | A signed-in member, at the store; a guest, in this browser |
| Promo codes | **1 per cart** — a second replaces the first |
| Points | **After the code**, at **$1** a point, on qualifying goods only; an ask past the ceiling is trimmed to it — [Paying with Points](/p/grade10-site/loyalty/paying-with-points) |
| Estimated total | **Goods − site discounts − code − points**, as the shop's checkout prices them — before shipping and tax |
| Shop's answer | Within **2.5 s**; past it, or where the shop does not answer, the drawer shows the store's own figures, with no site discount in them |
| Held codes | The member's own store codes and reward coupons, plus codes open to everyone; a guest sees the public codes only. The ones that fit first, the soonest to expire first |
| Carried to checkout | 🚧 The code and the points, held with the cart; Proceed to Checkout sends them straight to Shopify; paying the invoice clears the cart, them included — [Checkout](/p/grade10-site/store/checkout#integration-readiness) |

## Reviewing the Cart

- 🚧 **Product pictures** - the cart shows each product's current picture so the collector can recognise what they are buying
- **Current read** — every line is read against the shop on open; the
  price and the stock are the shop's own —
  [Cart Validation](/p/grade10-site/store/cart-validation)
- **Unresolved** — while the read is pending or failed the lines, the
  totals and Checkout wait; nothing held is shown as current
- **Lines whose product left the shop** — leave the cart on open, with one
  notice; a sold-out line stays, marked, until the collector removes it —
  [Cart Validation](/p/grade10-site/store/cart-validation)
- **Whose cart** - a signed-in member's cart is kept at the store; a guest's
  is kept in this browser. Signing in moves the browser's lines into the
  member's cart
- ❓ **A product in both carts** — signing in combines the two lines into
  one, its quantity the sum of both. Product confirms it runs
- **When the session ends** - an open drawer closes by itself, with no
  message, when the member signs out in another tab of this site or the
  session expires. A guest's drawer stays open, and so does a member's
  through a session read that is still pending or fails. A member who
  switches by signing out and in elsewhere finds it closed, while a switch
  the tab reads directly leaves it open on the new member's cart. Signing
  in again does not reopen it unless the collector has opened the cart
  since, whether the end came from another tab or from checkout meeting an
  expired session
- **Edits** — quantity and removal write to the same cart the page holds
- **The choice follows the cart** — the code and the points the member
  chose are held with the lines, so both are still there after a reload and
  on another device; the figures are read again either way
- **Discounts on a line and below it** — which price a line strikes, and
  the footer's rows in order, are on
  [Discounts](/p/grade10-site/store/discounts#where-each-shows)

## Pending Operations

- **Wait before another action** — the drawer accepts no cart edits, promo or points actions, or product and checkout links while it reads, saves or starts checkout. The collector can still close it.

::story{id="store-cart-blocks-cartdrawer--interaction-pending" title="A cart drawer that stays dismissible while pending"}

## Promo Code

One code rides the cart, typed or picked; every figure is the store's,
read against the cart as it stands and held nowhere.

- **Typed** — a code the store knows takes its cut off the total at
  once; one it refuses stays in the field with the refusal's own sentence,
  and the total does not move
- **Picked** — a held code applies the same way from the list; one that
  cannot ride this cart is listed apart with its reason
- **Public codes** — codes open to everyone are listed to guests and
  members alike; a member-only code typed by a guest gets the same refusal
  as a code nobody minted —
  [Discounts](/p/grade10-site/store/discounts#public-codes)
- 🚧 **Running out reads louder** — in the cart picker, a live promo code
  whose expiry is within its last 14 days keeps its discount title and its
  expiry/conditions detail slot; only the “Use by” detail is emphasised. The
  picker does not change the text or replace the title with the expiry.
- **Set aside for a site discount** — where the code and a site discount
  cannot both apply and the site discount takes more, the drawer says so and
  the total shows the site discount, the answer the shop's checkout gives;
  the code stays in the wallet —
  [Discounts](/p/grade10-site/store/discounts#order-of-application)
- **Refused by the shop** — a code the store holds but the shop would not
  apply to this basket is listed with that reason, and the total does not move
- **The shop's figure** — a code's cut is what the shop takes, so a 10% code
  takes 10% as the shop rounds it
- 🚧 **Removed** — Remove puts the code back; a cart edit that makes it
  stop fitting takes it off with a notice
- 🚧 **Wallet not answered** — the codes the store minted are still listed
  and a typed code still applies; the drawer says the programme's rewards
  could not be read
- 🚧 **Gift** — a code that gives an item adds it as a line at no charge;
  taking that line out puts the code back
- 🚧 **Refusals in the reader's language** — every reason a code or the
  points are refused is said in the site's own words, by its cause

The refusals are the coupon's own —
[Coupons](/p/grade10-site/loyalty/coupons#refusals).

## Points

- **Offered** — to a member the programme knows, with the balance, the
  rate and the most this cart can take after the code
- **Applied** — Apply or Use max carries the accepted points choice to
  checkout and shows the store-quoted saving. Remove clears points and keeps
  the existing code; a failed change keeps the last accepted choice. An ask
  past the ceiling is trimmed to it
- **Nothing left** — a code that took the whole of the goods leaves
  points nothing to pay, and the field says so
- **Not offered** — to a guest, a member outside the programme, or
  while the programme has not answered

## Checkout

- **Created from the drawer** — Proceed to Checkout sends the reviewed
  lines, the code and the points straight to Shopify; there is no separate
  checkout page to reopen or re-read them
- 🚧 **Sent** — the order is promised with the same code and points the
  drawer shows —
  [Shopify Integration](/p/grade10-site/loyalty/shopify-integration#online-checkout)
- **Guest** - the signed-out drawer's primary button is Check out as
  guest; under it a quiet Sign in link for points and rewards. Signing in
  merges the browser cart and reopens the drawer with points and the
  wallet; the guest's code moves to the member's cart unless that cart
  already holds one -
  [Checkout](/p/grade10-site/store/checkout#guest-checkout)
- **No identity check** — a checkout of any value asks nothing about who the
  buyer is — [KYC](/p/grade10-site/account/kyc)

::image{src="assets/diagrams/store-cart-quote.svg" alt="How the drawer and the store arrive at the cart's total"}

## Designs

::story{id="store-cart-blocks-cartdrawer--default" title="The cart drawer"}

::story{id="store-cart-blocks-cartdrawerfooter-interactive--interactive-member" title="A code and points on the cart"}

::story{id="store-cart-blocks-cartdrawer--unavailable-items-removed" title="Lines whose product left the shop, leaving"}

::story{id="store-cart-blocks-cartdrawer--empty-state" title="An empty cart"}

::story{id="store-cart-screens-cart-drawer-guest--guest" title="The drawer's guest checkout"}

::story{id="store-cart-blocks-cartdrawerfooter-guest--guest-with-public-code" title="A guest's codes, public only"}

::story{id="store-cart-blocks-cartdrawerfooter-guest--member-with-public-codes" title="A member's codes beside the public ones"}

:::detail{title="Test cases" for="qa"}
[Test cases · grade10-site/store/cart-drawer](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/store/cart-drawer)
:::

:::detail{title="Code map" for="engineer"}
- **The quote** - `quote.basket`, `packages/grade10-store/backend/src/services/orders/quote.ts`, on the same `orders/tender.ts` the checkout's promise prices with
- **The held choice** — `cart.tender` and `cart.setTender`, `packages/grade10-store/backend/src/services/cart/tender.ts`
- **The wallet read** — `quoteCouponsFor`, `packages/loyalty/backend/src/services/rewards/coupons.ts`
- **The drawer** — `apps/frontend/grade10/src/chrome/CartDrawerHost.tsx`, over the `cart` and `checkout` slices of `@grade10/store-frontend`
- **Design record** — [commerce architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Product decisions" for="pm"}
The drawer serves a collector who wants to check the cart, and what a code
and points do to it, without leaving the product or collection they are
considering. Its value is a total they can trust before they go to pay.

- **Overlay, not page** — the cart stays attached to the browsing moment; a new route would make the collector leave before the drawer solves anything
- **Cart in the header everywhere** — on every surface the drawer answers, Auction included, so checkout stays one tap away
- **Wait, rather than disable Checkout alone** — the drawer waits for its reads and writes before accepting another action
- **Dismissible while pending** — close, backdrop and Escape stay available, so a slow request does not trap the collector; chosen over disabling dismissal
- **The product's first picture** — as the collection card shows it, from the current read; variant pictures, or pictures held with the cart, can differ from the catalogue
- **Closes when the session ends** — chosen over leaving it open and empty, which reads as a cart with nothing in it beside a header that says Sign In
- **Another member's code** — answered as a code nobody minted, so a typed code tells nobody whose wallet it is in
- **Priced by the shop** — the shop prices the basket as its checkout will, so a code shown as applied is applied at checkout; the held list stays on the store's own rules, because asking the shop once per held code on every edit is too many calls
- **Not in scope** — a dedicated cart page; variant-specific pictures; shipping and tax before the invoice; a second code on one cart
- **Measured by** — drawer-to-checkout sessions, as Cart Opened then Checkout Started — [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events)
  - ❓ **Unmeasured** — failed open reviews, and refused codes and points by reason; nothing records them yet. Engineering confirms
:::
