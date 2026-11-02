# Rounds

One row per round: what it read, who read it, what stood and what it asked.
Written by the landing, in the landing's own commit.

| Round | Artifact | Perspectives | Stood | Asked | Tests |
| --- | --- | --- | --- | --- | --- |
| 13 | 13.2 | qa, verifier | The current Store PRD suite owns these cases. The merged Grade10 walks decide `g10.store-cart.TC39` and `g10.store-cart.TC42`, so their automation statuses are automated with their exact `Decided by` paths. The live-Shopify cases remain manual: `TC35`–`TC38`, `TC40`, `TC43`–`TC47`; `TC41` remains manual for sign-in/cart ownership, outside provider scope. The local fixture walks do not claim live Shopify evidence. | - | `pnpm run test:openspec` passed (478 Node tests and 184 store tests); `TC39`: `grade10:apps/frontend/grade10/e2e/tests/store/cart-checkout.spec.ts`; `TC42`: `grade10:apps/frontend/grade10/e2e/tests/store/cart-review.spec.ts`; E2E walks not rerun (13.1 and 13.3 are waived) |
| 16 | 16.2 | qa, verifier | No additional current Store PRD case is decided by the pending-operation walk. `TC42` already covers Pay in flight, is automated, and is decided by `cart-review.spec.ts` as recorded in round 13. `cart-drawer-pending.spec.ts` covers pending cart writes and promo quotes, not Pay, so it causes no additional TCS status change. Manual provider cases remain `TC35`–`TC38`, `TC40`, `TC43`–`TC47`; `TC41` remains manual for sign-in/cart ownership. Fixture tests do not claim live Shopify evidence. | - | `pnpm run test:openspec` and `pnpm run tcs:validate`; pending-Pay Playwright walk not rerun (16.1 and 16.3 are waived); `TC42`: `grade10:apps/frontend/grade10/e2e/tests/store/cart-review.spec.ts` |
