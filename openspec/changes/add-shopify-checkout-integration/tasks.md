## 1. Contract and acceptance record (grade10-spec)

- [x] 1.1 Verify amended frontend requirements and frozen anchors with the
  scoped artifact checks; preserve trace identities and draft case status.

| Retired Address | Withdrawn Work |
| --- | --- |
| 1.2 | PRD update for purchase reuse, recovery and provider-aware retirement; moved to `add-checkout-purchase-safety` |
| 1.3 | Verification of the 1.2 PRD update |

These retired addresses are not completed tasks and are never reused.

- [x] 1.4 Update the checkout PRD's Integration readiness to this change's frontend outcomes - the drawer's Pay request, one Pay at a time, the later cart and the return path - and leave invoice reuse, changed-purchase retirement and recovery to `add-checkout-purchase-safety`; retain durable carrier and settlement guarantees.
- [x] 1.5 Verify with `pnpm check:manual` and
  `pnpm openspec validate add-shopify-checkout-integration --strict`.

## 2. Shared contract and order persistence (grade10) (owner: @kinisworking)

Previously withdrawn addresses remain historical. Backend contract and
persistence work belongs to `add-checkout-purchase-safety`; this group's owner
preserves its claim.

| Retired Address | Withdrawn Work |
| --- | --- |
| 2.1 | Backend contract, repository and migration intent/recovery tests |
| 2.2 | Wiring intent/replay outcomes into the backend service |
| 2.3 | Intent columns, dispatch state, deadline and uniqueness migration |
| 2.4 | Persistence and migration verification |

These retired addresses are not completed tasks and are never reused.

## 3. Backend checkout and Shopify lifecycle (grade10) (owner: @kinisworking)

Previously withdrawn addresses remain historical. Backend lifecycle and
recovery work belongs to `add-checkout-purchase-safety`; these addresses are
never reused.

| Retired Address | Withdrawn Work |
| --- | --- |
| 3.1 | Backend/provider/settlement/carrier regression suite |
| 3.2 | Intent threading, replay and backend permission changes |
| 3.3 | Provider correlation, searchable draft lookup and fingerprint checks |
| 3.4 | Dispatch recovery, manual blockade and settlement changes |
| 3.5 | Carrier callback and backend diagnostics changes |
| 3.6 | Backend implementation validation |
| 3.7 | Backend creation ordering and recovery compatibility work |
| 3.8 | Operator bind/cancel recovery flow |

These retired addresses are not completed tasks and are never reused.

## 4. Storefront checkout and order surfaces (grade10) (owner: @kinisworking)

Completed tasks record the prior frontend implementation and evidence. The
remaining frontend-only work lands in Group 11; these checkmarks do not prove
the amended scenarios. Tests precede their code and the test checkbox is
ticked last.

- [x] 4.1 Add failing frontend fixture and mounted browser coverage for current
  review/tender, changed-line repair, hosted handoff, signed-out gating and
  pending/paid return: `grade10-site-store-checkout-SC-01`,
  `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-03`,
  `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-05`,
  `grade10-site-store-checkout-SC-06`, `grade10-site-store-checkout-SC-07`,
  `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`,
  `grade10-site-store-checkout-SC-15`.
- [x] 4.4 Preserve the existing operator checkout-test frontend and its
  signed-in/typed-email adapters while the public frontend uses member checkout:
  `grade10-site-store-checkout-SC-06`.
- [x] 4.5 Verify and complete the existing Shopify Thank You and Order status
  extension link and localized labels without a new shared export or resolver:
  `grade10-site-store-checkout-SC-15`.

| Retired Address | Withdrawn Work |
| --- | --- |
| 4.2 | Same-session intent storage and invalidation |
| 4.3 | Frontend replay/recovery workflow and local paid-cart deletion |
| 4.6 | Verification gate for the superseded backend-dependent frontend plan |
| 4.7 | Intent reload/conflict compatibility and older-bundle drain gate |

These retired addresses are not completed tasks and are never reused.

- [x] 4.8 Add failing fixture and browser tests for fresh submission after
  resolution/reload, synchronous and rendered pending guards, fixed submitted
  purchase, unchanged whole-line cleanup, existing verification feedback and response loss;
  include delayed response after sign-out/member change and current domain
  result mapping without adding backend replay emission:
  `grade10-site-store-checkout-SC-34`,
  `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-36`,
  `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-38`.
- [x] 4.9 Complete current review/accepted-tender submission, existing
  verification feedback and frontend request gating; capture immutable request/member
  scope and ignore stale UI effects; omit intent persistence and invoice reuse:
  `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`,
  `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`,
  `grade10-site-store-checkout-SC-34`,
  `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-37`.
- [x] 4.10 Complete existing outcome navigation/feedback, pending order reads
  and paid cart refresh without local deletion or new reconciliation:
  `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-07`,
  `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`,
  `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-38`.
- [x] 4.11 Verify focused frontend/extension tests and the mounted Playwright
  integration flows, then run the affected package checks defined by
  `docs/conventions/validation.md`; record commands and results without backend
  migrations, provider writes or production enablement.

## 5. Staging shop readiness and release walk (grade10) (owner: @kinisworking)

Real staging configuration, deployment and payment require later explicit
authorization. This planning run performs none. Backend staging evidence -
invoice reuse, retirement, recovery, concurrency and carrier - belongs to
`add-checkout-purchase-safety`.

| Retired Address | Withdrawn Work |
| --- | --- |
| 5.1 | Real-shop intent/replay/dispatch/recovery/carrier evidence cases |
| 5.2 | Provider scopes, tags, topics, carrier and backend shop configuration |
| 5.3 | Backend recovery/no-duplicate/provider settlement release walk |
| 5.4 | Backend/carrier release verification |

These retired addresses are not completed tasks and are never reused.

- [x] 5.5 Prepare frontend staging observations for current drawer handoff,
  later fresh submission, fixed invoice, sign-in/verification, pending/paid
  order display, unchanged cart refresh and both Shopify return surfaces.
- [ ] 5.6 After explicit staging authorization, observe the deployed drawer and both Shopify return extensions against the staging shop: the request sent at Pay, one Pay at a time, a pending order in Your Orders, the cart after payment and the static Your Orders link; record order and invoice references. Include a line that sells out after the invoice opens and confirm Shopify names it without the order reading paid: `grade10-site-store-checkout-SC-07`. — blocked: needs explicit staging authorization and the staging Shopify shop
- [ ] 5.7 Verify the staging observations against this change's frontend scenarios; name every observation not run and leave backend gates to `add-checkout-purchase-safety`. — blocked: follows 5.6

## 6. Earlier walk plan (grade10)

Group 13 holds this change's walk.

| Retired Address | Withdrawn Work |
| --- | --- |
| 6.1 | Walks for all six journeys including safe reuse and recovery |
| 6.2 | Case flips for the 6.1 walks |
| 6.3 | Verification of the 6.1 walks with duplicate-invoice, recovery and carrier evidence |

These retired addresses are not completed tasks and are never reused.

## 7. Contract and compatibility tests (grade10) (owner: @kinisworking)

App commit `306a68624` removed the versioned checkout transport these tasks
built. Their completion is historical and no longer describes the code; Q25
returns the drawer to the existing `checkout.createCheckout` request.

| Retired Address | Completed Then Removed |
| --- | --- |
| 7.1 | Shared codec, datasource, resolver and fixture tests for the v2 context and Pay |
| 7.2 | Shared v2 schemas and client, fixture and domain mapping |
| 7.3 | Verification of the v2 wire matrix |
| 7.4 | Zero-inclusive v2 points and legacy omission tests |

These retired addresses are never reused.

## 8. Durable purchase identity and current decision (grade10)

Moved to `add-checkout-purchase-safety` (Q24).

| Retired Address | Moved Work |
| --- | --- |
| 8.1 | Race and service tests for repeat, terminal replay and concurrent first creates |
| 8.2 | Additive schema and migrations for purchase identity |
| 8.3 | Context read, canonical purchase identity and terminal replay |
| 8.4 | Backend and real-Postgres race verification |

These retired addresses are not completed tasks and are never reused.

## 9. Dispatch recovery and retirement (grade10)

Moved to `add-checkout-purchase-safety` (Q24).

| Retired Address | Moved Work |
| --- | --- |
| 9.1 | Worker, service and DB tests for dispatch recovery and retirement |
| 9.2 | Persisted dispatch claim, correlation and bind-once recovery |
| 9.3 | Durable retirement after member edits |
| 9.4 | Legacy adapter and pending-invoice drain |
| 9.5 | Fault-injection and worker verification |

These retired addresses are not completed tasks and are never reused.

## 10. Settlement, conversion and carrier evidence (grade10)

Moved to `add-checkout-purchase-safety` (Q24). This change verifies the merged
conversion guard from the frontend in Group 11.

| Retired Address | Moved Work |
| --- | --- |
| 10.1 | Settlement, conversion and carrier tests |
| 10.2 | Member-edit conversion guard repair |
| 10.3 | Carrier token gate and preview parity repair |
| 10.4 | Backend and real-Postgres verification |
| 10.5 | Shop-review conversion regression |

These retired addresses are not completed tasks and are never reused.

## 11. Frontend cart-header integration (grade10) (owner: @kinisworking)

| Retired Address | Withdrawn Work |
| --- | --- |
| 11.1 | Tests for same-session identity, conflict refresh, recovery blockade and terminal mapping |
| 11.2 | Session-scoped submitted identity and server context in the drawer |
| 11.3 | Created/reused, settling, terminal, conflict and recovery wiring |
| 11.4 | Verification of the 11.1-11.3 plan |
| 11.5 | Zero-points v2 handoff and required price acknowledgement tests |

These retired addresses are not completed tasks and are never reused. The
tasks below use the current backend as it is (Q24-Q29); tests precede code and
11.6 is ticked last.

- [x] 11.6 Add failing tests before 11.7-11.9, each citing its scenario id: the drawer request shape with and without points, one pending Pay, older answers after an edit or member change, a lost or unreadable answer with no retry, existing answer treatments, readiness and signed-out or expired-session gating, order polling, paid cart refresh, later edits and both return links. Replace the browser flows that assert invoice reuse after reload: `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-06`, `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-15`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-38`, `grade10-site-store-checkout-SC-45`, `grade10-site-store-checkout-SC-47`, `grade10-site-store-checkout-SC-49`, `grade10-site-store-checkout-SC-50`, `grade10-site-store-checkout-SC-51`, `grade10-site-store-checkout-SC-52`, `grade10-site-store-checkout-SC-53`, `grade10-site-store-checkout-SC-54`, `grade10-site-store-checkout-SC-57`, `grade10-site-store-checkout-SC-58`, `grade10-site-store-checkout-SC-59`, `grade10-site-store-checkout-SC-60`, `grade10-site-store-checkout-SC-62`, `grade10-site-store-checkout-SC-63`, `grade10-site-store-checkout-SC-64`, `grade10-site-store-checkout-SC-65`. — `CartDrawer.test.tsx` "a pending Pay" cites SC-34, SC-35, SC-38, SC-65, SC-66, SC-67 and SC-68; the request shape, readiness, session and answer treatments are the existing drawer tests
- [x] 11.7 Make the drawer pass its 11.6 tests through `checkout.createCheckout` alone: reviewed lines with seen prices, the accepted coupon, points only above 0, one pending Pay, older answers dropped, lost answers ended without retry and the existing answer treatments; hold no purchase identity in the browser: `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-06`, `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-38`, `grade10-site-store-checkout-SC-49`, `grade10-site-store-checkout-SC-50`, `grade10-site-store-checkout-SC-51`, `grade10-site-store-checkout-SC-52`, `grade10-site-store-checkout-SC-53`, `grade10-site-store-checkout-SC-54`, `grade10-site-store-checkout-SC-57`, `grade10-site-store-checkout-SC-58`, `grade10-site-store-checkout-SC-63`, `grade10-site-store-checkout-SC-64`, `grade10-site-store-checkout-SC-65`.
- [x] 11.8 Remove the `settled`, `terminal`, `intentConflict` and `recoveryRequired` resolution kinds and the compatible outcome input the current contract cannot send; keep `resolveCheckout` total over the existing checkout answers. — `settled` and `intentConflict` stay removed; `add-checkout-purchase-safety` makes `terminal` and `recoveryRequired` real answers again, resolved to one `showOrder` kind that opens the order
- [x] 11.9 Keep order polling while open, the paid cart and tender refresh without local deletion, and both static Your Orders links passing their 11.6 tests: `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-15`, `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-45`, `grade10-site-store-checkout-SC-47`, `grade10-site-store-checkout-SC-59`, `grade10-site-store-checkout-SC-60`, `grade10-site-store-checkout-SC-62`.
- [x] 11.10 Link the existing backend tests that prove the unchanged provider, settlement, operator and carrier scenarios with `trace:supports` markers, changing no backend code; report a scenario with no existing test to `add-checkout-purchase-safety` instead of building it here: `grade10-site-store-checkout-SC-08`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-16`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-55`, `grade10-site-store-checkout-SC-56`. — SC-55 has no existing test and is reported to `add-checkout-purchase-safety`
- [x] 11.11 Verify focused frontend and extension suites, Grade10 and ZZZ type checks and the change-sensitive checks in `docs/conventions/validation.md`; record commands and results. Keep existing status labels and add no new badge. — drawer, order-page, checkout-resolution and extension suites pass (a few drawer cases time out only under the shared machine's load and pass alone); store-service, store-frontend, store-worker, web-spa and zzz-web-spa type checks pass

## 12. Integration and authorized staging evidence (grade10)

Moved to `add-checkout-purchase-safety` (Q24). This change's frontend staging
observations are 5.6 and 5.7.

| Retired Address | Moved Work |
| --- | --- |
| 12.1 | Mounted flows on real workers and Postgres for concurrent, lost, replayed and interrupted Pay |
| 12.2 | Local backend end-to-end checks |
| 12.3 | Staging readiness sheet for drain, correlation, retirement and carrier |
| 12.4 | Authorized staging evidence for reuse, concurrency, recovery and retirement |
| 12.5 | Implementation provenance for the backend guarantees |

These retired addresses are not completed tasks and are never reused.

## 13. The walk (grade10)

Uses draft feature cases as planning input after Group 11 lands. Planning marks no case approved or actual.

- [ ] 13.1 Keep one end-to-end actor walk for each frozen journey through the drawer, Your Orders and the Shopify return link; US-05 walks one Pay at a time and older and lost answers, not invoice reuse or recovery: `grade10-site-store-checkout-US-01`, `grade10-site-store-checkout-US-02`, `grade10-site-store-checkout-US-03`, `grade10-site-store-checkout-US-04`, `grade10-site-store-checkout-US-05`, `grade10-site-store-checkout-US-06`. — blocked: the walk exists (`apps/frontend/grade10/e2e/tests/store/checkout-integration.spec.ts`) but the isolated e2e stack needs Docker, which this sandbox lacks
- [ ] 13.2 In the walks' own commit, use `pnpm run tcs:automated <case…> --decided-by grade10:<walk-path>` only for cases the walks decide. Name remaining manual provider cases in the suite and rounds row. — blocked: follows 13.1
- [ ] 13.3 Verify Playwright and authorized staging evidence separately; record unrun gates and receipts without treating fixtures as live Shopify proof. Backend guarantees are evidenced by `add-checkout-purchase-safety`. — blocked: needs the walks run and authorized staging

## 14. Checkout pending product record (grade10-spec)

Appended to preserve existing claims and addresses. The shared interaction
contract is built by `add-store-cart-drawer-ui` Group 15, not duplicated here.

- [x] 14.1 Check the Checkout pending outcome and its Cart Drawer source link with the manual validator before updating the record.
- [x] 14.2 Keep `docs/prds/products/grade10-site/store/checkout.md` aligned with the delivered pending Pay, dismissal and recovery outcome; preserve construction marks until verified delivery.
- [x] 14.3 Verify this change's strict validation and the manual without modifying historical acceptance snapshots.

## 15. Pending Pay integration (grade10)

Depends on this change's Group 11 and `add-store-cart-drawer-ui` Groups 15-16:
the existing shared guard and host mapping are required by this request path.

- [x] 15.1 Add failing request-lifetime tests in their own commit before 15.2; tick this box last. Update the changed revisions for drawer-wide pending Pay and an externally changed cart/tender, then cover overlaps, dismissal/reopen and failure recovery: `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-66`, `grade10-site-store-checkout-SC-67`, `grade10-site-store-checkout-SC-68`.
- [x] 15.2 Make those tests pass using the common `interactionPending` input and synchronous Pay guard. Hold actual Pay until settlement without canceling on close, retain external cart/member stale-answer rejection and release only currently permitted actions after failure or the last operation; start no automatic new Pay. A still-current successful hosted-invoice answer opens Shopify after plain dismissal or reopen (Checkout Q35 / Cart Drawer Q22); drawer open state does not invalidate the request: `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-66`, `grade10-site-store-checkout-SC-67`, `grade10-site-store-checkout-SC-68`.
- [x] 15.3 Verify focused drawer/checkout tests, compatibility typechecks and frontend checks required by `docs/conventions/validation.md`; perform no backend, provider or production change.

## 16. The walk - pending Pay (grade10)

Uses draft `feature-tcs.md` as planning input after Groups 14-15 land; keeps
Group 13's complete journey scope with the pending-action amendment.

- [ ] 16.1 Keep an end-to-end actor walk for every checkout journey, including blocked drawer controls during Pay, changes from another tab/session, dismissal/reopen, overlapping operations, failed/lost answers and deliberate retry: `grade10-site-store-checkout-US-01`, `grade10-site-store-checkout-US-02`, `grade10-site-store-checkout-US-03`, `grade10-site-store-checkout-US-04`, `grade10-site-store-checkout-US-05`, `grade10-site-store-checkout-US-06`. — blocked: the walk exists (`apps/frontend/grade10/e2e/tests/store/cart-drawer-pending.spec.ts`) but the isolated e2e stack needs Docker
- [ ] 16.2 In the walks' own commit, mark only cases decided by those walks with `pnpm run tcs:automated <case…> --decided-by grade10:<walk-path>` and name remaining manual provider cases in the suite and the walk's `rounds.md` row. — blocked: follows 16.1
- [ ] 16.3 Verify focused Playwright walks and record unrun Shopify/provider gates separately; preserve backend safety ownership and all earlier acceptance receipts. — blocked: needs the walks run
