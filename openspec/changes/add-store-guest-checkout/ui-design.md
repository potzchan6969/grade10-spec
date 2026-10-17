# UI Design

## Screens

- **Cart Drawer** — signed-out guest footer and the bar ask. Composes
  `CartDrawer` (`CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`),
  and the `GuestBarSignInAsk` part. ❓ TBC — Figma frames pending.
- **Order Link** — the public order page every order's private link opens,
  including the return from checkout. Composes `SiteHeader`, `OrderDetails`
  and the `Toast` primitive: the receipt's email rides the header's
  placed-on line via a new `placedOnNote` prop, and the sign-in ask is a
  persistent `toast()` with description and one action, bottom-right.
  Loyalty never renders — no points section or Points summary row, member
  order or guest. A wrong secret gets the existing `OrderDetailsNotFound`
  treatment. ❓ TBC — Figma frames pending.
- **Order History** — guest orders under the member's email listed with the
  member's orders. Composes `SiteHeader`, `OrderHistory` and `Footer`,
  unchanged.

## Components

- `CartDrawer` / `CartDrawerFooter` (`CartDrawerFooterProps`,
  `CartDrawerFooterCopy`) — new additive props: `onSignIn`, copy keys
  `signInPrompt`, `signInAction`, `signInSuffix`, `publicPromoCodes`; a
  `publicPromoCodes`
  list for the promo sheet's own section. `heldPromoCodes: null` already
  hides the member section, which is what a guest's sheet takes.
- The account ask — the design-system `Toast` primitive, a persistent
  `toast()` with description + action; no new shared export.
- `OrderDetails` / `OrderDetailsHeader` — additive `placedOnNote` prop:
  a second sentence on the placement line, e.g. "Receipt sent to
  ada@example.com".
- `OrderHistory`, `SiteHeader`, `SignInCard`, `SignInEmailForm` — composed
  unchanged.
- Parts drawn for the features, promotion candidates for `@grade10/ui`:
  `GuestBarSignInAsk`.
- Design reference (workbench): `store-cart-blocks-cartdrawerfooter-guest--guest`,
  `store-cart-blocks-cartdrawerfooter-guest--guest-with-public-code`,
  `store-cart-blocks-cartdrawerfooter-guest--member-with-public-codes`,
  `store-cart-screens-cart-drawer-guest--guest`,
  `store-cart-screens-cart-drawer-guest--guest-at-the-bar`,
  `store-order-detail-screens-order-link--just-paid`,
  `store-order-detail-screens-order-link--guest-order`,
  `store-order-detail-screens-order-link--member-order-signed-out`,
  `store-order-detail-screens-order-link--not-found`,
  `store-order-history-screens-order-history--with-guest-orders`

## States

### Cart Drawer

| State | Shows | Anchor | Scenario / Disposition |
| --- | --- | --- | --- |
| Guest | Guest checkout primary, quiet sign-in line under it, public codes, no points | `g10.store-cart-drawer.US15` | `g10.store-cart-drawer.SC55`, `g10.store-cart-drawer.SC56`, `shared-ui-store-cart-SC-80` |
| Guest At The Bar | Sign-in ask where the guest button was; no checkout starts | `g10.store-checkout.US9` | **Out of suite:** dropped 2026-10-14 with the identity bar ([Non-Goals](decisions.md#non-goals)); no state ships |

### Order Link

| State | Shows | Anchor | Scenario / Disposition |
| --- | --- | --- | --- |
| Back From Checkout | A guest back from payment — a normal order page; the placed-on line names the receipt's email; a persistent toast carries one Sign in action | `g10.store-order-detail.US3` | `grade10-site-store-checkout-SC-69`; **Out of suite:** the ask's toasts are `OrderLinkPage` tests until `grade10-site/store/order-detail` is durable |
| Ask outcomes | The ask's results ride the toast's standard variants — no stories of their own: sent (names where the link went), added (success + View in your orders), another email (names the order's email, offers a magic link to it), send failed (error + retry, `design-system-overlays-toast--types`) | `g10.store-order-detail.US4` | `grade10-site-store-checkout-SC-69`; **Out of suite:** the ask's toasts are `OrderLinkPage` tests until `grade10-site/store/order-detail` is durable |
| Guest Order From Email | The same page opened cold from the order email's View order link | `g10.store-order-detail.US5` | `grade10-site-store-checkout-SC-69`; **Out of suite:** the ask's toasts are `OrderLinkPage` tests until `grade10-site/store/order-detail` is durable |
| Member Order Signed Out | The same page, with a persistent "Is this your order?" toast offering sign-in | `g10.store-order-detail.US5` | `grade10-site-store-checkout-SC-69`; **Out of suite:** the ask's toasts are `OrderLinkPage` tests until `grade10-site/store/order-detail` is durable |
| Owner Signed In | Redirect to the order inside the account | `g10.store-order-detail.US6` | **Out of suite:** `OrderLinkPage` tests; `grade10-site/store/order-detail` is introduced by `add-grade10-customer-order-pages` |
| Not Found | Unknown order or wrong secret: the same not-found treatment | `g10.store-order-detail.US5` | `grade10-site-store-checkout-SC-70` |

### Order History

| State | Shows | Anchor | Scenario / Disposition |
| --- | --- | --- | --- |
| With Guest Orders | Guest orders under the member's email among their orders; none earns points | `g10.store-order-history.US4` | `grade10-site-store-checkout-SC-71`, `grade10-site-store-checkout-SC-75` |
