## 1. Shared UI contract tests (grade10-spec) (owner: @kinisworking)

Add the shared boundary coverage before changing or repinning any consumer.

- [ ] 1.1 Add focused `PromoTicket` story/interaction coverage for a supplied `detailEmphasis: true`, `false`, and omitted field; assert that only the existing detail slot changes, the title and detail copy stay supplied, and callbacks and ordering remain intact. Cover the muted inapplicable ticket with an emphasized detail and no Apply action. `g10.shared-store-cart.SC70`, `g10.shared-store-cart.SC71`, `g10.shared-store-cart.SC72`
- [ ] 1.2 Verify the shared type/export surface and existing `ExpiringSoon` story through the focused `@grade10/ui` checks, with no clock, date parsing, timer or new token in the component. `g10.shared-store-cart.SC70`, `g10.shared-store-cart.SC71`, `g10.shared-store-cart.SC72`
- [ ] 1.3 Verify: run the focused shared UI test, typecheck and Storybook checks, and record that `SC70`–`SC72` pass.

## 2. Shared UI contract implementation (grade10-spec)

- [ ] 2.1 Keep `HeldPromoCode.detailEmphasis?: boolean` as the additive consumer-owned state and make `PromoTicket` apply the existing emphasis treatment only to the expiry/conditions detail slot. Preserve the discount title, supplied detail text, code, refusal treatment, Apply availability, selection callback and ordering. `g10.shared-store-cart.SC70`, `g10.shared-store-cart.SC72`
- [ ] 2.2 Confirm the shared component never receives or derives `expiresAt`, reads the clock or computes the 14-day window; retain plain rendering when the field is false or omitted. `g10.shared-store-cart.SC71`
- [ ] 2.3 Verify: inspect the shared diff and rerun the focused `@grade10/ui` checks to confirm the change remains a render-only contract seam.

## 3. Grade10 frontend mapper tests (grade10)

Write and run these tests before changing the quote-to-ticket mapping. Use a
fixed consumer clock and decoded quote fixtures; do not add a backend fixture
or a service call.

- [ ] 3.1 Add focused mapper/Cart Drawer host tests for `expiresAt` exactly 14 days away, inside the window, beyond the window, missing, and at or before the current instant. Assert the inclusive boundary and the false states. `g10.store-cart-drawer.SC59`, `g10.store-cart-drawer.SC60`
- [ ] 3.2 Extend the same frontend fixtures for held, public, applicable and inapplicable live codes. Assert that the title carries the discount, `detailLabel` carries the existing expiry/conditions text rather than the discount-worth value, and code, refusal reason, Apply availability and list order remain unchanged while only `detailEmphasis` varies. `g10.store-cart-drawer.SC61`, `g10.store-cart-drawer.SC62`, `g10.store-cart-drawer.SC63`, `g10.store-cart-drawer.SC64`
- [ ] 3.3 Verify: run the focused Grade10 mapper and Cart Drawer host tests with the fixed consumer clock, including every boundary and applicability fixture.

## 4. Grade10 frontend quote mapping (grade10)

- [ ] 4.1 In the existing Grade10 Cart Drawer quote-to-`HeldPromoCode` mapper, keep the discount in `title`, route the existing expiry/conditions text to `detailLabel` instead of the repeated discount-worth value, and derive `detailEmphasis` from the existing live quote `expiresAt` and the consumer clock with an inclusive 14-day upper boundary. Pass the boolean for held and public codes, including codes the quote marks unable to apply; do not change copy wording, quote, transport shape, date formatting or selection behavior. `g10.store-cart-drawer.SC59`, `g10.store-cart-drawer.SC60`, `g10.store-cart-drawer.SC61`, `g10.store-cart-drawer.SC62`, `g10.store-cart-drawer.SC63`, `g10.store-cart-drawer.SC64`
- [ ] 4.2 Run the focused Grade10 cart/host checks and affected typecheck/lint/build checks. Confirm the mapper adds no API, backend, database, persistence, checkout or translation changes, and preserve the existing public-code merge and inapplicable-ticket treatment.
- [ ] 4.3 Verify: inspect the application diff and run the repository-defined affected frontend validation commands; confirm no backend, API, database, checkout or translation files changed.

## 5. Grade10 product record (grade10-spec)

- [ ] 5.1 Verify and land the Grade10 Cart Drawer PRD update for “Running out reads louder” and the `Expiring promo detail` decision, keeping the discount title and expiry/conditions detail as separate slots and adding no scenario ids, new wording or duplicate product rule.
- [ ] 5.2 Recheck the accepted delta, linked journeys, UI design and durable target paths with the repository planning/manual checks after the PRD record and spec-submodule revision are aligned.
- [ ] 5.3 Verify: run `pnpm run plan:review-preflight add-store-cart-expiring-promo`, the strict change validator and the Store test-case validator; record any unrelated existing warnings separately.

## 6. Spec-submodule boundary (grade10)

- [ ] 6.1 After the accepted `grade10-spec` revision is published, update only the `external/grade10-spec` gitlink through the supported submodule workflow. Preserve unrelated nested work, record the accepted revision, and make the application submodule check pass before consuming `detailEmphasis`.
- [ ] 6.2 Verify: run the application submodule/status check and confirm the gitlink points to the accepted `grade10-spec` revision with no unrelated nested changes.

## 7. The walk (grade10)

- [ ] 7.1 Run the final local cart-picker walk at the supported narrow and wide widths for a member and a guest: cover a held code at the inclusive near-expiry boundary, a distant code, a code with no expiry, a public code in the guest and merged member lists, and refused held and public codes. Check that only the existing expiry/conditions detail is emphasized, with title, copy, code, refusal, Apply behavior and order unchanged. `g10.store-cart-drawer.SC59`, `g10.store-cart-drawer.SC60`, `g10.store-cart-drawer.SC61`, `g10.store-cart-drawer.SC62`, `g10.store-cart-drawer.SC63`, `g10.store-cart-drawer.SC64`, `g10.shared-store-cart.SC70`, `g10.shared-store-cart.SC71`, `g10.shared-store-cart.SC72`
- [ ] 7.2 Verify: capture the final walk evidence for each required state and record the Storybook expiring-soon reference plus any failed or unavailable manual gate.
