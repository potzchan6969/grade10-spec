**Author:** @kinisworking - 2026-09-03

## Why

The Grade10 storefront already has a scoped member cart, live cart review, and
a working checkout page, but its navigation does not expose the designed Cart
Drawer. Collectors must leave the page they are browsing before they can see
whether held lines changed. During pending operations, separate guards block Checkout and tender actions but do not establish one rule for all drawer actions.

**Metric:** share of sessions that open the cart and proceed to checkout
without first navigating to checkout. The first delivery establishes the
baseline.

**Pending-action metric:** count of drawer action attempts that start another operation or navigation while drawer work is pending; target 0, excluding dismissal. This adds no telemetry implementation.

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

## Pending Operations

- **Actions** - Disable quantity changes, removal, promo and points inputs and disclosures, Apply, Use max, held-code selection, tender removal, product and account/loyalty links, and Checkout while a drawer operation is pending, including controls in an already-open promo sheet.
- **Scope interpretation** - Reads of the open cart, current price and stock, saved tender, promo eligibility and points, plus quantity/removal writes, tender quote and persistence, their confirming refreshes, and checkout creation all count. Unrelated page or catalogue refreshes do not.
- **Dismissal** - Keep Close, backdrop click and Escape available while pending, including dismissal of an open promo sheet. Closing does not cancel or roll back an operation already sent.
- **Completion** - Wait for every active drawer operation to finish. Success, refusal or failure ends that operation; existing errors, Retry and current-data availability rules still decide what the collector can do next. No action is replayed automatically. A failed read is not itself a request still running.
- **Presentation** - Keep the existing skeleton and accepted-figure treatments. Disabling actions covers pointer and keyboard activation and blocks action callbacks; it does not change prices, discard entered values or prevent reading and scrolling.
- **Checkout overlap** - This change owns drawer-wide interaction availability; `add-shopify-checkout-integration` consumes it for pending Pay and retains stale-answer protection for changes elsewhere.
- **Compatibility** - Delivery planning chooses a backwards-compatible shared contract and maps Grade10 operations to it; the shared block acquires no product data or persistence of its own.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/store/cart-drawer` — the Grade10 Store's cart drawer,
  current-cart review, honest summary, cart edits, and existing-address
  handoffs.

### Modified Capabilities

- `shared/ui/store-cart` - consumer-owned pending state disables drawer actions across body, footer and promo sheet without changing their layout or adding promo editing; existing optional tender and picture props retain their compatibility and fallback behavior.

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
The pending-operations increment adds optional `interactionPending` to the
existing drawer, body, item, footer and promo-sheet props. It extends body, navigation and
nested-sheet guards while keeping `tenderPending` compatibility and existing
read-only callback guards. The shared delta owns the public contract.
The application owner archives after deployment acceptance.

## References

- [Shared Pending Operations](../../../docs/prds/products/shared/ui/store-cart.md#pending-operations)
- [Cart Pending Operations](../../../docs/prds/products/grade10-site/store/cart.md#pending-operations)
- [Cart Drawer · Reviewing the Cart](../../../docs/prds/products/grade10-site/store/cart.md#reviewing-the-cart)
- [Shared Cart · Product Pictures](../../../docs/prds/products/shared/ui/store-cart.md#product-pictures)
- [Approved Thumbnail Brief](../../../docs/references/store-cart-thumbnails.md)
- [Shared Tender Actions](../../../docs/prds/products/shared/ui/store-cart.md#tender-actions)
- [Cart Promo Code](../../../docs/prds/products/grade10-site/store/cart.md#promo-code)
- [Cart Points](../../../docs/prds/products/grade10-site/store/cart.md#points)
- [Cart Checkout](../../../docs/prds/products/grade10-site/store/cart.md#checkout)
- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)
- [Storybook](https://storybook.grade10-stg.com/?path=/story/store-cart-blocks-cartdrawer--default)

No platform impact: this changes the existing Grade10 cart-to-checkout path only.
