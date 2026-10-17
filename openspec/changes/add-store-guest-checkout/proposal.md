**Author:** @devin - 2026-10-13

## Why

A signed-out collector can build a cart, but the durable checkout contract
still asks them to sign in at Pay — so a buyer who does not want an account
cannot buy at all. The product decided on 2026-10-12/13 to let them check out
as guests, and to invite an account only after payment.

**Metric:** share of signed-out drawer sessions that reach a paid order;
secondary: share of guest orders linked to an account.

## What Changes

- **Gateway** — a signed-out drawer's footer carries a primary Check out as
  guest, with a quiet Sign in link under it for points and rewards; no
  extra step
- **Guest tender** — a guest may type or pick a public code (from
  `add-store-public-codes`); no points, and no member's codes or rewards are
  shown
- **Hosted invoice for a guest** — the store creates a Shopify invoice with
  no customer; Shopify's page takes the email and Shopify's emails go to it.
  Grade10 sends no store email of its own
- **Sign-in from the drawer** — the browser cart merges into the member cart
  and the drawer reopens with points and the wallet; a public code on the
  cart stays if it still fits
- **Order confirmed, then an account ask** — on return from checkout
  (`/orders/latest` → `/orders/<id>#secret`, same browser, within a day) the
  guest's order page is a normal order page whose placed-on line names the
  email the receipt went to, and a persistent toast asks to add the order to
  an account — Sign in
  to see it with your other orders, one Sign in action; closing it hides it
  for that order. A sign-in that proves the order's email links the order
  to the account — a magic link to that email, or a Google account under
  it. A Google account under another email signs the buyer in and adds
  nothing: the toast names the order's email and offers a magic link to
  it. The email note and the ask show on any signed-out view of the
  order — this return or a link opened later; signed in, neither shows
- **Guest orders join the account** — every paid guest order placed under an
  email is listed in Your Orders automatically once a sign-in proves that
  email, on any sign-in; the order gets an owner
- **No points for a guest order** — a guest order never earns, linked or
  not; only an order placed with an account earns
- **Order link for every order** — every order email's View order button
  carries the private link. Signed out: the public order page names the
  receipt's email on its placed-on line and carries a persistent sign-in
  toast — add this order on a guest's, sign in to see it on a member's.
  Owner signed in: sent to
  `/profile/orders/<id>`. Someone else signed in: the public page. A wrong
  secret or unknown order shows not-found, and the page carries no points,
  wallet or account facts

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `grade10-site/store/checkout` — the storefront boundary: a guest gets a
  hosted invoice with no customer and the email taken on Shopify's page;
  today's signed-out-asked-to-sign-in journey is rewritten
- `grade10-site/store/cart-drawer` — guest footer and gateway. No durable
  spec yet: the capability is being introduced by `add-store-cart-drawer-ui`,
  which this change depends on accepting first
- `shared/ui/store-cart` — guest footer props on `CartDrawer` /
  `CartDrawerFooter` (`CartDrawerFooterProps`, `CartDrawerFooterCopy`)
- `grade10-site/store/order-detail` — order link for every order, the
  post-checkout prompt, and saving the order on sign-in. Owned by
  `add-grade10-customer-order-pages`, which this change depends on
- `grade10-site/store/order-history` — guest orders under the member's email
  listed after sign-in. Owned by `add-grade10-customer-order-pages`, which
  this change depends on

## Impact

- **`@grade10/ui`** — additive props on `CartDrawerFooter`
  (`CartDrawerFooterProps`, `CartDrawerFooterCopy`); the account ask uses
  the existing `Toast` primitive, no new shared export. Design Override
  needed for the footer visuals
- **grade10 application** — a guest `createCheckout` with no session, the
  order secret link and its `/orders/<id>` route, linking guest orders on
  sign-in by proven email, a magic link that proves the order's email, the
  View order link in Shopify's notification templates, and the
  `/orders/latest` prompt. A linked guest order earns nothing. These are
  built in the application repository
- **Depends on** — `add-store-cart-drawer-ui` and
  `add-grade10-customer-order-pages` landing first, and
  `add-store-public-codes` for the public-code list

## References

- [Checkout · Guest Checkout](../../../docs/prds/products/grade10-site/store/checkout.md#guest-checkout)
- [Cart Drawer · Checkout](../../../docs/prds/products/grade10-site/store/cart.md#checkout)
- [Cart Drawer · Promo Code](../../../docs/prds/products/grade10-site/store/cart.md#promo-code)
- [Order Details · Order Link](../../../docs/prds/products/grade10-site/store/order-detail.md#order-link)
- [Order Details · Back From Checkout](../../../docs/prds/products/grade10-site/store/order-detail.md#back-from-checkout)
- [Your Orders · Orders](../../../docs/prds/products/grade10-site/store/order-history.md#orders)
- [Membership · Purchases Before the Account](../../../docs/prds/products/grade10-site/loyalty/membership.md#purchases-before-the-account)
- [Points · Rules](../../../docs/prds/products/grade10-site/loyalty/points.md#rules)
- [Discounts · Public Codes](../../../docs/prds/products/grade10-site/store/discounts.md#public-codes)
