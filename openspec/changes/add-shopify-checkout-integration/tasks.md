## 1. Contract and acceptance record (grade10-spec)

- [ ] 1.1 Verify amended frontend requirements and frozen anchors with the
  scoped artifact checks; preserve trace identities and draft case status.
- [ ] 1.2 Update the checkout PRD and linked frontend architecture records for
  current drawer creation, the cart's one payable invoice, fixed invoices and
  the cart cleared by its own payment; do not add backend intent or recovery
  contracts.
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
  include delayed response after sign-out/member change and compatible domain
  result mapping without asserting backend replay emission:
  `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-34`,
  `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-36`,
  `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-38`.
- [x] 4.9 Complete current review/accepted-tender submission, existing
  verification feedback and frontend request gating; capture immutable request/member
  scope and ignore stale UI effects; omit intent persistence and invoice reuse:
  `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`,
  `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`,
  `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-34`,
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
authorization. No shop/provider/carrier/backend configuration is delivered by
this planning or implementation phase.

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
- [ ] 5.6 After explicit staging authorization, verify deployed frontend and
  existing extension placement against the existing shop; record observed
  invoice/order references and outcomes, including the unchanged cart's
  returned invoice and the cart cleared by its payment, without adding
  recovery or carrier work.
- [ ] 5.7 Verify the recorded frontend staging observations against the scoped
  draft suite; record environment, commands, observed results and unrun gates.

## 7. Cart header (grade10) (owner: @cheunglok97)

The backend piece of Q20, in [Grade10 PR #880](https://github.com/9gag/grade10/pull/880).
Tests land before their code and the test checkbox is ticked last.

- [ ] 7.1 Add failing backend tests for a paid invoice clearing its cart, a
  basket that is not the cart, Pay twice on the unchanged cart, Pay after an
  edit, an edit discarding the invoice once and never again, an edit kept when
  Shopify refuses the discard, an invoice paid before its discard lands, and a
  late payment after an edit or a rebuild, through the webhook and the
  reconcile pass, with an edit racing the payment on real Postgres:
  `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-33`,
  `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-36`.
- [ ] 7.2 Add the cart header: one active cart per member with its version,
  lines keyed by cart, the order's cart link and invoice URL, and one migration
  per brand that resets staging carts:
  `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-36`.
- [ ] 7.3 Link a checkout whose lines are the cart to it, answer the unchanged
  cart's open invoice, retire the cart's other open invoices, and discard the
  cart's older invoice after an edit commits:
  `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-35`.
- [ ] 7.4 Convert the cart in the paid transition only while it holds the
  order's version, and delete every cart on erasure:
  `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-36`.
- [ ] 7.5 Verify the store backend unit lane, both brands' db and worker lanes,
  the Postgres lane and `pnpm run check:migrations`; record commands and results.

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
  authorized staging proof separately. No backend recovery or carrier
  guarantees are part of this walk; production enablement requires separate
  authorization.
