## 1. Nav Slot Contract (grade10-spec)

The slot API already exists. Close its verification gap; retain the current implementation unless the scenarios expose a mismatch.

- [ ] 1.1 Prove `shared-ui-site-chrome-SC-22` in a Nav story: a supplied cart slot replaces the built-in control even with `onCartClick` present, and activating the slot invokes only its own callback. Retain omitted-slot handler gating from `shared-ui-site-chrome-SC-04`.
- [ ] 1.2 Verify: run `pnpm --filter @grade10/design-system exec vitest run --project storybook src/components/layout/nav`, `pnpm --filter @grade10/design-system run typecheck`, and `pnpm run lint`; run `pnpm run design-sync:check` if the primitive implementation changes. Record the scenario evidence.

## 2. SiteHeader Count Acceptance and PRD (grade10-spec)

This group can be claimed independently of Group 1 because both shared APIs are already present. Live grade10-site wiring and a submodule bump are outside the settled scope.

- [ ] 2.1 Prove `shared-ui-site-chrome-SC-23` and the handler-absent requirement in the cart stories: zero and omitted counts preserve the cart control without an indicator; a positive count with no handler renders neither. Use omitted/zero input for signed-out and unknown-count fixtures.
- [ ] 2.2 Prove `shared-ui-site-chrome-SC-24`, `shared-ui-site-chrome-SC-25`, and `shared-ui-site-chrome-SC-26` through the existing 1, 3, and 12 stories. Assert count/brand presentation and accessible names, verify cart activation calls its handler once, add an above-99 full-number case, and render a controlled count of 3 into both `SiteHeader` and `CartDrawerHeader` to prove agreement.
- [ ] 2.3 Verify the positive-count stories in wide and compact containers for `shared-ui-site-chrome-SC-24` through `shared-ui-site-chrome-SC-26`: full digits remain visible, the cart stays operable, and the account/menu controls retain their layout. Apply only contract-required component fixes found by this verification.
- [ ] 2.4 Update `docs/prds/products/shared/ui/site-chrome.md` with the settled omitted/unknown-count and signed-out outcomes; retain the 🚧 cart-count mark until delivery is confirmed. Keep mechanism details in `tech-design.md` and preserve the existing proposal, deltas, and suite.
- [ ] 2.5 Verify: run `pnpm --filter @grade10/ui exec vitest run --project storybook src/blocks/site-chrome/site-header.cart.stories.tsx`, `pnpm --filter @grade10/ui run typecheck`, `pnpm run lint`, `pnpm check:manual`, and `pnpm run validate:changes nav-cart-count-badge`. Record browser and visual evidence separately from live application acceptance.
