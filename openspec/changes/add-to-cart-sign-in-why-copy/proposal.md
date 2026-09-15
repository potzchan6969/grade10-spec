**Author:** @tangconst - 2026-09-14

## Why

A signed-out collector who presses Add to cart already meets the sign-in
dialog (`require-sign-in-to-add-to-cart`), but the heading still says
**Sign In to Grade10** — the same line as header Sign In. Nothing on the
dialog says why they were stopped, so the gate reads like a cold login
rather than a pause on the add they asked for.

**Metric:** share of signed-out Add to cart presses that complete sign-in
in the same session, versus the same rate when the dialog used the bare
default title.

**Acceptance signal:** on the listing and the product page, the sign-in
dialog opened from Add to cart is titled **Sign In to Add to Cart**;
header Sign In and other default entry points stay **Sign In to Grade10**.

## What Changes

- **Contextual title from Add to cart** — when Add to cart opens sign-in,
  the dialog title is **Sign In to Add to Cart** (cart, matching store
  copy — not bag)
- **Default entry points unchanged** — header Sign In and other surfaces
  that already pass **Sign In to Grade10** keep that title
- **Catalog key** — Grade10 `signIn.titleAddToCart` holds the string for
  consumers that wire `SignInCard` `copy.title`

## Non-Goals

- **Changing `SignInCard` props or layout** — `copy.title` already carries
  consumer-owned wording; no new export, variant, or Figma frame
- **A second description line** — the title names why; no
  `copy.description` for this entry point
- **Rewriting the gate or resume** — open-on-add, no guest cart, and
  resume-when-practical stay on `require-sign-in-to-add-to-cart`
- **Auction or appointment titles** — bid and visits keep their own why
  copy; this change is store Add to cart only
- **ZZZ storefront** — Grade10 site only unless a later change holds ZZZ
  to the same title

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/store/product-listing` — Add to cart sign-in dialog title
  is **Sign In to Add to Cart**
- `grade10-site/store/product-page` — the same title on product-page Add
  to cart sign-in

## Impact

- **Grade10 site storefront** — when opening `SignInCard` from signed-out
  Add to cart, pass `copy.title` from `signIn.titleAddToCart` (or the
  same literal)
- **`@grade10/i18n`** — Grade10 `signIn` catalogs gain `titleAddToCart`
- **Storybook** — `Auth Sign In/SignInCard` → **From add to cart** shows
  the why title
- **No new `@grade10/ui` export** — existing `SignInCard` `copy.title`
- **No domain or platform impact**

## Open questions

- none — title locked to **Sign In to Add to Cart** (Title Case for
  Modal titles); cart not bag; description omitted; default entry points
  keep **Sign In to Grade10**

## References

- [Product Listing · Product Tile](../../../docs/prds/products/grade10-site/store/product-listing.md#product-tile)
- [Product Details · Buy](../../../docs/prds/products/grade10-site/store/product-page.md#buy)
- [Sign-In Dialog](../../../docs/prds/products/shared/ui/auth-sign-in.md)
- Follows [`require-sign-in-to-add-to-cart`](../require-sign-in-to-add-to-cart/proposal.md)
