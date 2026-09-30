**Author:** @seankcw - 2026-09-29

## Why

The shared `CartDrawer.onCheckout` contract already says the consuming
application creates the checkout session and redirects from the drawer -
`packages/ui/src/blocks/store-cart/cart-drawer.tsx`'s own doc comment: "Attach
the one applied promo code... and any points amount to the draft order, then
redirect to Shopify. The shared component does not perform the redirect."
`add-store-cart-drawer-ui` wired everything else the drawer needs for this -
the live re-quoted basket, interactive promo and points, the redirecting and
failed states - but named "tender selection or checkout creation... `/checkout`
remains the owner of checkout creation" as an explicit non-goal, deferred to a
later change. Today `CartDrawerHost.handleCheckout` still navigates to
`/checkout`, so a collector who is ready to pay leaves the page for a second
screen that re-reads the same basket the drawer is already holding current.

**Metric:** the share of Proceed to Checkout presses that reach Shopify's
hosted invoice, and the time between the press and that invoice opening. The
first delivery establishes the baseline.

## What Changes

- Proceed to Checkout calls `createCheckout` directly with the drawer's
  already-live, continuously re-quoted basket and accepted tender (coupon,
  points), and redirects to Shopify's hosted invoice on success - completing
  the `onCheckout` contract the shared component already documents, rather
  than navigating to a separate page. Coupon and points editing are
  unaffected: both are already interactive in the drawer and are not part of
  this change.
- **BREAKING** The identity/KYC verification gate for a basket at or above the
  HKD 120,000 bar moves inline into the drawer - today it exists only on
  `CheckoutPage` - blocking Proceed to Checkout for an unverified member. The
  verification action itself stays on the member's account page, unchanged
  from `grade10-site/store/account-identity`; the drawer only shows the same
  threshold message and link out that `CheckoutPage`'s `VerifyPanel` shows
  today.
- **BREAKING** Narrows `add-shopify-checkout-integration`'s draft requirement
  "Checkout reviews the current member basket before payment", which reads a
  distinct "checkout open" moment and a distinct "Pay" moment as two reads on
  one page. With no separate page, the drawer's existing continuous live
  quote (gated by its current `checkoutDisabled` check) stands in for the
  checkout-open read, and the server's already-decided transactional recheck
  at order-write time (that change's Q5) remains the read that gates Pay.
  Its Shopify handoff, idempotent-intent, settlement and carrier decisions
  (Q2, Q5-Q14) are unchanged.
- The `/checkout` route, `CheckoutPage`, and their route-level tests are
  removed once the drawer covers review, tender, verification and handoff.
  A changed line or a provider refusal is named inline in the drawer instead
  of on a page.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None carried by this change. `grade10-site/store/cart-drawer` has no
durable spec yet, and `add-store-cart-drawer-ui` is its one owner while it
stays unarchived; the store's id and MODIFIED/ADDED rules refuse a second
change independently versioning the same not-yet-durable capability (see
`decisions.md` Q5). This proposal's requirement, scenario and test-case work
- direct checkout creation, the verification gate, the removed `/checkout`
page - is folded into `add-store-cart-drawer-ui`'s own `spec.md`,
`feature-tcs.md` and `user-journeys.md` (its decisions Q9-Q11), rather than
issued here. `skip_specs: true` records that in this change's
`.openspec.yaml`.

`grade10-site/store/checkout` is likewise not listed: it has no durable spec
yet either, its only record is the unarchived `add-shopify-checkout-
integration`'s own draft, and this proposal's narrowing of that draft's Q1
is recorded directly in that change's `decisions.md` and `proposal.md` for
its own QA pass to reconcile.

## Impact

- **Frontend** - `apps/frontend/grade10`: `CartDrawerHost.handleCheckout`
  calls `useCreateCheckout` with the accepted tender already held in
  `quoted`, shows the shared component's existing redirecting/failed states,
  and renders the verification gate inline; `src/routes/checkout.tsx`,
  `src/pages/checkout/CheckoutPage.tsx`, the `/checkout` route and surface
  entry, and `e2e/tests/store/checkout.spec.ts` are removed or folded into
  cart-drawer coverage.
- **Packages** - `packages/grade10-store/frontend`: no new use case,
  repository or API service; the existing `checkout.createCheckout`
  procedure and `VerifyPanel` presentation are consumed from the drawer
  instead of the checkout page. No change to `@grade10/ui`'s `CartDrawer`
  export - its `onCheckout` contract already covers this.
- **Backend** - none. `createCheckout`'s contract, transactional recheck,
  idempotency, Shopify handoff and settlement are unchanged.
- **Persistence** - none.

No domain impact: this changes where the existing checkout journeys are
walked from, not what Shopify, settlement or the order record do.

## Open questions

None that change the product contract. `add-shopify-checkout-integration`
and `add-store-cart-drawer-ui` are both unarchived; their remaining
decisions stand, and only the rows this proposal names are narrowed or
completed - see the note added to each change's `decisions.md`.

## References

None. This change carries `skip_specs: true` and marks no PRD section of
its own; the outcomes it proposes are marked and delivered by
`add-store-cart-drawer-ui`'s own proposal and References.
