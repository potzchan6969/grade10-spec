## 1. Contract and acceptance record (grade10-spec)

- [ ] 1.1 Verify amended frontend requirements and frozen anchors with the
  scoped artifact checks; preserve trace identities and draft case status.
- [ ] 1.2 Update the checkout PRD and linked frontend architecture records for
  current drawer creation, fresh submissions, fixed invoices and unchanged
  backend cleanup; do not add backend intent or recovery contracts.
- [ ] 1.3 Verify with `pnpm check:manual` and
  `pnpm openspec validate add-shopify-checkout-integration --strict`.

## 2. Shared contract and order persistence (grade10) (owner: @kinisworking)

Withdrawn by the frontend-only amendment. No implementation or verification
work remains in this group. Owner and addresses preserve the existing claim.

| Retired Address | Withdrawn Work |
| --- | --- |
| 2.1 | Backend contract, repository and migration intent/recovery tests |
| 2.2 | Wiring intent/replay outcomes into the backend service |
| 2.3 | Intent columns, dispatch state, deadline and uniqueness migration |
| 2.4 | Persistence and migration verification |

These retired addresses are not completed tasks and are never reused.

## 3. Backend checkout and Shopify lifecycle (grade10) (owner: @kinisworking)

Withdrawn by the frontend-only amendment. Existing backend behavior remains a
dependency, without changes or delivery tasks here.

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

Consumes existing canonical clients and fixtures; depends on no new backend
or Group 2 implementation. Tests land before their corresponding code and the
test checkbox is ticked last.

- [ ] 4.1 Add failing frontend fixture and mounted browser coverage for current
  review/tender, changed-line repair, hosted handoff, signed-out gating and
  pending/paid return: `grade10-site-store-checkout-SC-01`,
  `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-03`,
  `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-05`,
  `grade10-site-store-checkout-SC-06`, `grade10-site-store-checkout-SC-07`,
  `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`,
  `grade10-site-store-checkout-SC-15`.
- [ ] 4.4 Preserve the existing operator checkout-test frontend and its
  signed-in/typed-email adapters while the public frontend uses member checkout:
  `grade10-site-store-checkout-SC-06`.
- [ ] 4.5 Verify and complete the existing Shopify Thank You and Order status
  extension link and localized labels without a new shared export or resolver:
  `grade10-site-store-checkout-SC-15`.

| Retired Address | Withdrawn Work |
| --- | --- |
| 4.2 | Same-session intent storage and invalidation |
| 4.3 | Frontend replay/recovery workflow and local paid-cart deletion |
| 4.6 | Verification gate for the superseded backend-dependent frontend plan |
| 4.7 | Intent reload/conflict compatibility and older-bundle drain gate |

These retired addresses are not completed tasks and are never reused.

- [ ] 4.8 Add failing fixture and browser tests for fresh submission after
  resolution/reload, synchronous and rendered pending guards, fixed submitted
  purchase, unchanged whole-line cleanup, existing verification feedback and response loss;
  include delayed response after sign-out/member change and compatible domain
  result mapping without asserting backend replay emission:
  `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-34`,
  `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-36`,
  `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-38`.
- [ ] 4.9 Complete current review/accepted-tender submission, existing
  verification feedback and frontend request gating; capture immutable request/member
  scope and ignore stale UI effects; omit intent persistence and invoice reuse:
  `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`,
  `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`,
  `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-34`,
  `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-37`.
- [ ] 4.10 Complete existing outcome navigation/feedback, pending order reads
  and paid cart refresh without local deletion or new reconciliation:
  `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-07`,
  `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`,
  `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-38`.
- [ ] 4.11 Verify focused frontend/extension tests and the mounted Playwright
  integration flows, then run the affected package checks defined by
  `docs/conventions/validation.md`; record commands and results without backend
  migrations, provider writes or production enablement.

## 5. Staging shop readiness and release walk (grade10) (owner: @kinisworking)

Real staging configuration, deployment and payment require later explicit
authorization. No shop/provider/carrier/backend configuration is delivered by
this planning or implementation phase.

| Retired Address | Withdrawn Work |
| --- | --- |
| 5.1 | Real-shop intent/replay/dispatch/recovery/carrier evidence cases |
| 5.2 | Provider scopes, tags, topics, carrier and backend shop configuration |
| 5.3 | Backend recovery/no-duplicate/provider settlement release walk |
| 5.4 | Backend/carrier release verification |

These retired addresses are not completed tasks and are never reused.

- [ ] 5.5 Prepare frontend staging observations for current drawer handoff,
  later fresh submission, fixed invoice, sign-in/verification, pending/paid
  order display, unchanged cart refresh and both Shopify return surfaces.
- [ ] 5.6 After explicit staging authorization, verify deployed frontend and
  existing extension placement against the existing shop; record observed
  invoice/order references and outcomes without adding recovery, carrier or
  settlement work or claiming duplicate prevention.
- [ ] 5.7 Verify the recorded frontend staging observations against the scoped
  draft suite; record environment, commands, observed results and unrun gates.

## 6. The walk (grade10)

Uses the draft feature suite as input after frontend delivery. Human QA reviews
deployed implementation with `/tcs-review add-shopify-checkout-integration`;
manual execution uses `/tcs-run-sheet`. Cases remain draft during planning.

- [ ] 6.1 Keep browser walks for all checkout journeys through drawer review,
  Pay, refusal repair, sign-in and Shopify/order return, using existing
  contract fixtures for automation and separately authorized staging for real
  shop observations: `grade10-site-store-checkout-US-01`,
  `grade10-site-store-checkout-US-02`, `grade10-site-store-checkout-US-03`,
  `grade10-site-store-checkout-US-04`.
- [ ] 6.2 In the walks' commit, mark only cases actually decided by them with
  `pnpm run tcs:automated <case…> --decided-by grade10:<walk-path>`; name cases
  remaining manual in the suite and the walk's rounds row.
- [ ] 6.3 Verify the relevant Playwright flows and record fixture versus
  authorized staging proof separately. No duplicate-invoice, backend recovery
  or carrier guarantees are part of this walk; production enablement requires
  separate authorization.
