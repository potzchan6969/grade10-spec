## 1. Nav Slot Contract (grade10-spec) (owner: @kinisworking)

The slot API already exists. Close its verification gap; retain the current implementation unless the scenarios expose a mismatch.

- [ ] 1.1 Prove `shared-ui-site-chrome-SC-22` in a Nav story: a supplied cart slot replaces the built-in control even with `onCartClick` present, and activating the slot invokes only its own callback. Retain omitted-slot handler gating from `shared-ui-site-chrome-SC-04`.
- [ ] 1.2 Verify: run `pnpm --filter @grade10/design-system exec vitest run --project storybook src/components/layout/nav`, `pnpm --filter @grade10/design-system run typecheck`, and `pnpm run lint`; run `pnpm run design-sync:check` if the primitive implementation changes. Record the scenario evidence.

## 2. SiteHeader Count Acceptance and PRD (grade10-spec) (owner: @kinisworking)

This group can be claimed independently of Group 1 because both shared APIs are already present. Application integration is tracked separately in Groups 4 and 5.

- [ ] 2.1 Prove `shared-ui-site-chrome-SC-23` and the handler-absent requirement in the cart stories: zero and omitted counts preserve the cart control without an indicator; a positive count with no handler renders neither. Use omitted/zero input for signed-out and unknown-count fixtures.
- [ ] 2.2 Prove `shared-ui-site-chrome-SC-24`, `shared-ui-site-chrome-SC-25`, and `shared-ui-site-chrome-SC-26` through the existing 1, 3, and 12 stories. Assert count/brand presentation and accessible names, verify cart activation calls its handler once, add an above-99 full-number case, and render a controlled count of 3 into both `SiteHeader` and `CartDrawerHeader` to prove agreement.
- [ ] 2.3 Verify the positive-count stories in wide and compact containers for `shared-ui-site-chrome-SC-24` through `shared-ui-site-chrome-SC-26`: full digits remain visible, the cart stays operable, and the account/menu controls retain their layout. Apply only contract-required component fixes found by this verification.
- [ ] 2.4 Update `docs/prds/products/shared/ui/site-chrome.md` with the settled omitted/unknown-count and signed-out outcomes; retain the 🚧 cart-count mark until delivery is confirmed. Keep mechanism details in `tech-design.md` and preserve the existing proposal, deltas, and suite.
- [ ] 2.5 Verify: run `pnpm --filter @grade10/ui exec vitest run --project storybook src/blocks/site-chrome/site-header.auction-store.cart-count.stories.tsx`, `pnpm --filter @grade10/ui run typecheck`, `pnpm run lint`, `pnpm check:manual`, and `pnpm run validate:changes nav-cart-count-badge`. Record browser and visual evidence separately from live application acceptance.


## 3. Application Product Record (grade10-spec)

- [ ] 3.1 Update `docs/prds/products/grade10-site/site/page-shell.md` for the member header count, its closed-drawer updates, and unknown/signed-out outcome. Keep the delivery mark until application acceptance is confirmed.
- [ ] 3.2 Verify: `pnpm run validate:changes nav-cart-count-badge`, `pnpm run tcs:validate`, and `pnpm check:manual`. Record unrelated generated-index failures separately.

## 4. Member Cart Count State (grade10)

Depends on Group 3's merged application contract; uses the existing shared badge API. Review the merged store pin before implementation and run `pnpm run check:submodules` if it moves.

- [ ] 4.1 Make `grade10-site-site-page-shell-SC-42` and `grade10-site-site-page-shell-SC-43` pass with a cart-feature projection of distinct reviewed active lines, retaining adjusted lines and excluding sold-out/unavailable lines. Do not change the existing quantity-total API.
- [ ] 4.2 Make `grade10-site-site-page-shell-SC-46`, `grade10-site-site-page-shell-SC-47`, `grade10-site-site-page-shell-SC-48`, `grade10-site-site-page-shell-SC-49`, and `grade10-site-site-page-shell-SC-53` pass with one member-scoped cart/review observer active while the drawer is closed; retain the last verified same-member count while checking and clear it on failure; reuse mutation invalidation and review retry without adding polling or automatic unavailable-line removal.
- [ ] 4.3 Make `grade10-site-site-page-shell-SC-50`, `grade10-site-site-page-shell-SC-51`, and `grade10-site-site-page-shell-SC-52` pass for unresolved sessions, sign-out, member switching, and late responses.
- [ ] 4.4 Verify: run the cart feature's focused domain/hook tests, `node scripts/test.mjs grade10-store-frontend`, `pnpm run typecheck`, and `pnpm run lint`. Include delayed review and mutation races in the named scenario tests.

## 5. Header and Drawer Integration (grade10)

Depends on Group 4's cart projection and shared observer. Preserve existing sign-in and account-menu behavior when adapting the store pin.

- [ ] 5.1 Make `grade10-site-site-page-shell-SC-42`, `grade10-site-site-page-shell-SC-45`, and `grade10-site-site-page-shell-SC-46` pass through root composition and `SiteShell`, supplying the optional count to `SiteHeader` and sharing reviewed basket state with `CartDrawerHost`. Preserve fresh drawer-open review and keep quote/tender/cleanup effects drawer-gated.
- [ ] 5.2 Make `grade10-site-site-page-shell-SC-04`, `grade10-site-site-page-shell-SC-05`, `grade10-site-site-page-shell-SC-44`, and `grade10-site-site-page-shell-SC-50` pass through real application composition: first paint, stable controls, full digits at wide/375px widths, and unchanged sign-in activation.
- [ ] 5.3 Make `grade10-site-site-page-shell-SC-47`, `grade10-site-site-page-shell-SC-49`, and `grade10-site-site-page-shell-SC-52` pass in application integration tests and local browser flows: add/remove/change quantity with the drawer closed, navigate Store → Auction, open the drawer to compare counts, recover a failed review, and switch members without stale counts.
- [ ] 5.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and the focused Grade10 Playwright flows using the repository E2E lane. Record local visual evidence separately from deployed acceptance; no backend test or migration is needed unless implementation changes that scope.
