**Author:** @kinisworking - 2026-09-03

## Why

The Grade10 storefront already has a scoped member cart, live cart review, and
a working checkout page, but its navigation does not expose the designed Cart
Drawer. Collectors must leave the page they are browsing before they can see
whether held lines changed.

**Metric:** share of sessions that open the cart and proceed to checkout
without first navigating to checkout. The first delivery establishes the
baseline.

**Acceptance signal:** a signed-in collector opens Cart from any surface once
Store answers the cart drawer, reviews and edits the member cart, and reaches
the existing checkout without first leaving that surface.

The reported cart has blank picture boxes for products whose catalogue pictures load on the collection. The approved [thumbnail brief](../../../docs/references/store-cart-thumbnails.md) extends this change to current product pictures.

**Thumbnail metric:** share of reviewed cart lines with a catalogue picture whose matching thumbnail loads in the drawer. The seeded browser regression requires all such lines to load.

## What Changes

- Expose Cart in the site header on every surface once the Store cart drawer
  answers (including Auction and other non-Store pages), and open one drawer
  over the current surface.
- Connect the drawer to the signed-in member cart through the existing typed
  Store integration.
- Run the existing live cart review on every open; keep unconfirmed values and
  Checkout unavailable while the read is pending or failed.
- Map only reviewed line and subtotal facts, including current product pictures, into the shared drawer, and keep
  shipping, promo redemption, points, tax, and discounts neutral or
  absent where the current integration supplies no answer.
- For a signed-in collector, read held promo-code eligibility and the basket's
  points ceiling against the reviewed lines. Preserve existing promo editing;
  apply, maximise or remove points through the existing persisted tender and
  combined basket quote, preserving any existing selected code.
- Keep edits on the current cart, and send product and checkout actions
  through the site's existing addresses.
- Add the drawer copy to the Grade10 `store` catalog overlay for English,
  Traditional Chinese, and Simplified Chinese (including empty-cart title
  fields required by `cart-drawer-empty-state`).
- Consume `cart-drawer-empty-state` for the shared empty `EmptyState` and the
  retirement of `CartItemSlot` / Browse More.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/store/cart-drawer` — the Grade10 Store's cart drawer,
  current-cart review, honest summary, cart edits, and existing-address
  handoffs.

### Modified Capabilities

- `shared/ui/store-cart` — optional consumer-owned pending tender state disables
  existing controls without changing their layout or adding promo editing; specifies the existing optional picture props and fallback rendering.

- `grade10-site/site/page-shell` — carries Cart in the header: absent until
  the Store cart drawer answers, then global on every surface. Scenarios
  `grade10-site-site-page-shell-SC-09` and
  `grade10-site-site-page-shell-SC-16` live on the durable spec, folded there
  from the archived `auction-first-site-header`.

## Impact

- `apps/frontend/grade10`: global Cart trigger once the drawer answers, one
  drawer host, reviewed-line mapping, member tender context and interactive points,
  existing cart actions, and focused tests.
- `packages/grade10-store/frontend`: backwards-compatible review controls that
  let the drawer own unavailable-line cleanup while checkout keeps its current
  behavior.
- Grade10 catalogs and manual pages in `grade10-spec`: localized drawer copy,
  the Cart Drawer product record, and the corrected Cart validation record.
- Depends on `cart-drawer-empty-state` landing in the submodule first (or the
  same submodule bump) so `emptyTitle` and the empty `EmptyState` contract
  exist.

The thumbnail extension also touches Shopify variant reads, optional reviewed-line response fields, application joins and fixtures in grade10. Shared picture stories and controlled assets stay in grade10-spec. `CartItemSummary`, `CartItem`, `CartDrawerBody` and `CartDrawer` retain their existing exports and presentation; the Grade10 storefront supplies the enriched props. No database, admin, deployment or new production dependency is required.

No domain impact: the drawer reuses existing product and checkout addresses
without changing the journeys those destination capabilities own.

## Points Delivery

The user-approved Storybook plan supersedes the read-only points scope in
completed Group 4; Group 5 delivers only the new points integration. The
shared `CartDrawer` export already supports these actions; optional
`tenderPending` on its existing props supplies the missing pending guard.
No new primitive or component export is planned. Existing read-only callback guards stay intact.
The application owner archives after deployment acceptance.

## References

- [Cart Drawer · Reviewing the Cart](../../../docs/prds/products/grade10-site/store/cart.md#reviewing-the-cart)
- [Shared Cart · Product Pictures](../../../docs/prds/products/shared/ui/store-cart.md#product-pictures)
- [Approved Thumbnail Brief](../../../docs/references/store-cart-thumbnails.md)
- [Shared Tender Actions](../../../docs/prds/products/shared/ui/store-cart.md#tender-actions)
- [Cart Promo Code](../../../docs/prds/products/grade10-site/store/cart.md#promo-code)
- [Cart Points](../../../docs/prds/products/grade10-site/store/cart.md#points)
- [Cart Checkout](../../../docs/prds/products/grade10-site/store/cart.md#checkout)
- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)
- [Storybook](https://storybook.grade10-stg.com/?path=/story/store-cart-cartdrawer--default)

No platform impact: this changes the existing Grade10 cart-to-checkout path only.
