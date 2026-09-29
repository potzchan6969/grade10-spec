## Goals

- Let a collector reach Shopify's hosted invoice from the cart drawer without
  a second page, completing the `onCheckout` contract the shared component
  already documents.
- Keep the basket honest at the moment of payment without a dedicated
  checkout-open screen.
- Give the collector the verification gate they would otherwise lose when
  `/checkout` is removed.

## Non-Goals

- Any change to coupon or points editing: both are already interactive in
  the cart drawer (`CartDrawerHost.tsx` already wires `onApplyPromo`,
  `onSelectHeldPromo`, `onRemovePromo`, `onApplyPoints`, `onUseMaxPoints`,
  `onRemovePoints` against a continuously re-quoted basket). This change
  reads and sends that existing accepted tender; it adds no new tender UI.
- Any change to Shopify handoff mechanics, idempotent checkout intents,
  settlement, reconciliation, the carrier callback, or the order machine -
  `add-shopify-checkout-integration`'s Q2 and Q5-Q14 stand.
- Any change to the sign-in requirement or the typed-email operator test
  surface - `add-shopify-checkout-integration`'s Q3 stands.
- Any change to the identity verification action itself: it stays on the
  member's account page, per the durable requirement "A collector verifies
  from their account, on their explicit consent" in
  `grade10-site/store/account-identity`. The drawer only gates and links out,
  as `CheckoutPage`'s `VerifyPanel` does today.
- A new design-system primitive: `@grade10/ui`'s `CartDrawer` already
  exposes `onCheckout`, `checkoutRedirecting` and `checkoutFailed`.
- Any change to shipping or tax calculation, which remain Shopify's.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does the drawer preserve a checkout-open read once there is no separate checkout screen? | The drawer already runs a continuous live quote (`useBasketQuote`, `staleTime: 0`) while open and gates Proceed to Checkout on it being current; that stands in for the checkout-open read, and the server's existing transactional recheck at order-write time remains the read that gates Pay - no new client-side read is added | Adding a second explicit re-read at the button press - dropped once the interview found the drawer's existing live quote already serves that purpose; building it would have duplicated an existing gate for no benefit |
| Q2 | Where does coupon and points editing live once `/checkout` is gone? | Nowhere new - both are already interactive in the drawer (verified in `CartDrawerHost.tsx` and `packages/ui/src/blocks/store-cart/cart-drawer.tsx`); the initial interview assumed this was still checkout-page-only and asked the author, who chose to move it into the drawer, before that assumption was checked against the code and found already false | Building new coupon/points UI in the drawer - not needed; recorded here so the corrected premise is on the record rather than silently dropped |
| Q3 | Where does the HKD 120,000 verification gate live once `/checkout` is gone? | Show it inline in the drawer, blocking Proceed to Checkout for an unverified member, linking out to the account page the same way `CheckoutPage`'s `VerifyPanel` does today | Redirecting to the account KYC page instead of proceeding - rejected as an extra screen, the opposite of this change's goal. Letting the server reject an unverified attempt with no proactive gate - rejected because it drops the existing "verify before you try to pay" guidance |
| Q4 | What happens to the `/checkout` route, page and its route-level tests? | Removed entirely; its review, tender, verification and handoff behavior move to the drawer and its coverage moves to cart-drawer tests | Keeping `/checkout` as a fallback or deep-linkable route with no drawer path to it - rejected; a route nothing links to is dead surface, not a fallback |
| Q5 | How does this change relate to the two unarchived changes it touches? | Revised 2026-09-29 after `openspec validate`/`pnpm check:manual` refused the independent delta: `grade10-site/store/cart-drawer` has no durable spec, so a second change cannot issue MODIFIED requirements or reuse its scenario/journey ids against it. This change's cart-drawer requirement, scenario and test-case work is folded into `add-store-cart-drawer-ui`'s own `spec.md`/`feature-tcs.md`/`user-journeys.md` (its Q9-Q11); this change keeps `skip_specs: true` and stands only as the product record (proposal, decisions) for that fold. The `grade10-site/store/checkout` narrowing still stands as a note in `add-shopify-checkout-integration`'s own artifacts, since that capability is a different owner's problem | The original decision - land this change as its own independent review, editing neither sibling in place - held only until the store's own validators disproved it; keeping this change's spec/tcs separate was tried first and reverted rather than assumed away |
| Q6 | Is the bar checked against gross goods or the total after code and points? | Unchanged existing behaviour: the checkout resolution's `verify` outcome already carries a `goodsMinor` field distinct from the tendered total, and this change reuses that field as `CheckoutPage`'s `VerifyPanel` does today - decided by the round | A new bar calculation for the drawer - not needed; the blind test-case pass raised this as an open question, and it resolved to a fact already true in the code rather than a new choice |
| Q7 | Does the verification gate replace the Checkout action or sit disabled beside it? | Reuse `VerifyPanel`'s existing layout unchanged: it replaces the Checkout action's area with its message and link, exactly as it replaces `CheckoutPage`'s pay section today | Showing Checkout disabled alongside the message - rejected; this change's non-goals rule out new layout work, and the existing panel already answers this by replacing the action, not disabling it |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/cart-drawer` | Is the bar checked against gross goods or the total after code and points? | Q6 |
| `grade10-site/store/cart-drawer` | Does the verification gate replace the Checkout action or sit disabled beside it? | Q7 |
