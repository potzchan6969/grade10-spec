**Author:** @tangconst - 2026-09-14

## Why

A signed-out collector can press Add to cart on the listing or the product
page and build a guest cart, but checkout is members only and there is no
guest checkout. The cart they filled cannot become an order without signing
in later, so the add looked successful and then stranded them.

**Metric:** share of signed-out Add to cart presses that end in a signed-in
cart line in the same session (dialog opened, sign-in completed, add
resumed), and the share of checkout starts from sessions that never held a
guest line.

**Acceptance signal:** on the listing and on the product page, a signed-out
Add to cart opens the existing sign-in dialog and puts nothing in a cart;
after a successful sign-in the intended add completes when practical.

## What Changes

- **Signed-out Add to cart opens sign-in** — on the product listing and the
  product details page alike; nothing is added while signed out
- **No guest cart from add** — a signed-out session gains no cart line from
  Add to cart; guest checkout stays off
- **Resume after sign-in** — when practical, a successful sign-in from that
  dialog completes the add the collector asked for, on the same surface
- **Manual alignment** — Cart Drawer and Checkout pages state members-only
  cart and no guest checkout

## Non-Goals

- **Changing the sign-in dialog itself** — `shared/ui/auth-sign-in` already
  fronts mid-flow sign-in; this change only says when Add to cart summons it
- **Guest checkout** — remains out; this change does not add it
- **Merging a guest cart into a member cart** — there is no guest cart to
  merge once add is gated
- **Rewriting the Cart Drawer change** — `add-store-cart-drawer-ui` still
  carries guest-line scenarios; retiring those is a follow-on on that change
- **Header cart badge behaviour** — Storybook signed-in alignment for cart
  with items is separate (#415); no OpenSpec there
- **ZZZ storefront** — Grade10 site only unless a later change holds ZZZ to
  the same gate

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/store/product-listing` — signed-out Add to cart opens
  sign-in; no line is added; after sign-in the add completes when practical
- `grade10-site/store/product-page` — the same gate and resume on the
  product details page

## Impact

- **Grade10 site storefront** — listing tile cart control and product page
  Add to cart check the session before writing a line; open `SignInCard`
  when signed out; resume the pending add after success when practical
- **Cart scope** — signed-out sessions stay empty of lines from these
  surfaces; member cart remains the only cart that receives adds
- **No new `@grade10/ui` export** — the listing and product page consume
  the existing sign-in dialog; cart controls keep reporting quantity to the
  consumer
- **No domain impact:** store `domain-tcs.md` traces no path that crosses
  these signed-out add journeys yet
- **No platform impact:** no cross-product path

## Follow-on changes

- Retire guest-line cart drawer scenarios in `add-store-cart-drawer-ui` so
  the drawer matches a signed-out cart that holds no lines

## Open questions

- none — product locked: no guest checkout; login on add on listing and
  PDP; resume when practical

## References

- [Product Listing · Product Tile](../../../docs/prds/products/grade10-site/store/product-listing.md#product-tile)
- [Product Details · Buy](../../../docs/prds/products/grade10-site/store/product-page.md#buy)
- [Cart Drawer · Reviewing the Cart](../../../docs/prds/products/grade10-site/store/cart.md#reviewing-the-cart)
- [Checkout](../../../docs/prds/products/grade10-site/store/checkout.md)
- [Sign-In Dialog](../../../docs/prds/products/shared/ui/auth-sign-in.md)
