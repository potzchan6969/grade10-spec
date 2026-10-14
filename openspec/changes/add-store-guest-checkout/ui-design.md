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
  A wrong secret gets the existing `OrderDetailsNotFound` treatment.
  ❓ TBC — Figma frames pending.
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

| State | Shows | Anchor |
| --- | --- | --- |
| Guest | Guest checkout primary, quiet sign-in line under it, public codes, no points | `g10.store-cart-drawer.US10` |
| Guest At The Bar | Sign-in ask where the guest button was; no checkout starts | `g10.store-checkout.US9` |

### Order Link

| State | Shows | Anchor |
| --- | --- | --- |
| Back From Checkout | A guest back from payment — a normal order page; the placed-on line names the receipt's email; a persistent toast carries one Sign in action | `g10.store-order-detail.US3` |
| Ask outcomes | The ask's results ride the toast's standard variants — no stories of their own: sent (names where the link went), added (success + View in your orders), another email (names the order's email, offers a magic link to it), send failed (error + retry, `design-system-overlays-toast--types`) | `g10.store-order-detail.US4` |
| Guest Order From Email | The same page opened cold from the order email's View order link | `g10.store-order-detail.US5` |
| Member Order Signed Out | The same page, with a persistent "Is this your order?" toast offering sign-in | `g10.store-order-detail.US5` |
| Owner Signed In | Redirect to the order inside the account | `g10.store-order-detail.US6` |
| Not Found | Unknown order or wrong secret: the same not-found treatment | `g10.store-order-detail.US5` |

### Order History

| State | Shows | Anchor |
| --- | --- | --- |
| With Guest Orders | Guest orders under the member's email among their orders; none earns points | `g10.store-order-history.US4` |
