## 1. Shared UI contract and tests (grade10-spec)

- [ ] 1.1 Make `shared-ui-store-cart-SC-26` and `shared-ui-store-cart-SC-28` pass by omitting typed promo entry, held-code Apply, points entry, points Apply, and Use max when their matching callbacks are absent while preserving the supplied display-only context.
- [ ] 1.2 Make `shared-ui-store-cart-SC-27` and `shared-ui-store-cart-SC-29` pass by preserving the complete interactive callback path, payloads, state transitions, and loading behavior when callbacks are supplied.
- [ ] 1.3 Make `shared-ui-store-cart-SC-30` pass by gating disclosure and applied-tender removal controls independently, then add Storybook interaction coverage for the read-only, interactive, and partial-callback matrices.
- [ ] 1.4 Verify the affected shared UI with `pnpm run test:stories:ui`, `pnpm run typecheck`, and `pnpm run lint`; do not run `pnpm run test:backend` because this change adds no backend files.

## 2. Capability record (grade10-spec)

- [ ] 2.1 Keep the shared Cart Drawer PRD's callback-gated outcome aligned with `shared-ui-store-cart-SC-26` through `shared-ui-store-cart-SC-30` and the change proposal.
- [ ] 2.2 Verify `pnpm run validate:changes guard-cart-drawer-read-only-tender`, `pnpm openspec validate guard-cart-drawer-read-only-tender --strict`, the focused feature suite with `pnpm run tcs:validate openspec/changes/guard-cart-drawer-read-only-tender/specs/shared/ui/store-cart/feature-tcs.md`, and the affected manual pages with `pnpm check:manual --pages`.
