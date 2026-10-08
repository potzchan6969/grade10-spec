## 1. Contract and acceptance record (grade10-spec)

- [ ] 1.1 Verify amended frontend requirements and frozen anchors with the
  scoped artifact checks; preserve trace identities and draft case status.
- [ ] 1.2 Update the checkout PRD and linked architecture records for full cart-header integration, purchase reuse/recovery, provider-aware retirement and guarded conversion; retain durable carrier and settlement guarantees.
- [ ] 1.3 Verify with `pnpm check:manual` and
  `pnpm openspec validate add-shopify-checkout-integration --strict`.

## 2. Shared contract and order persistence (grade10) (owner: @kinisworking)

Previously withdrawn addresses remain historical. Replacement backend contract
and persistence work is in Groups 7-10; this group's owner preserves its claim.

| Retired Address | Withdrawn Work |
| --- | --- |
| 2.1 | Backend contract, repository and migration intent/recovery tests |
| 2.2 | Wiring intent/replay outcomes into the backend service |
| 2.3 | Intent columns, dispatch state, deadline and uniqueness migration |
| 2.4 | Persistence and migration verification |

These retired addresses are not completed tasks and are never reused.

## 3. Backend checkout and Shopify lifecycle (grade10) (owner: @kinisworking)

Previously withdrawn addresses remain historical. Replacement backend lifecycle
and recovery work is in Groups 8-10; these addresses are never reused.

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
backend-dependent integration and amended behavior land in Group 11; these
checkmarks do not prove the new full contract. Tests precede their code and the
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
  include delayed response after sign-out/member change and current domain
  result mapping without adding backend replay emission:
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
authorization. This planning run performs none; Group 12 expands the existing
staging evidence to the full contract after backend readiness.

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
- [ ] 5.6 After explicit staging authorization and backend readiness, verify deployed cart-header integration and extension placement against the staging shop, including invoice reuse, retirement, recovery and matching orders; record provider/order references.
- [ ] 5.7 Verify staging observations against the complete contract; distinguish executed evidence from remaining provider, carrier, concurrency and recovery gates. Coordinate the expanded evidence with Group 12.

## 6. The walk (grade10)

Uses the draft feature suite as planning input after frontend delivery. Cases remain draft during planning.

- [ ] 6.1 Retain the historical walks and extend through Group 13 for all six frozen checkout journeys, including safe reuse/recovery and later-cart protection; separate fixture and authorized staging observations.
- [ ] 6.2 In each walks' commit, mark only cases actually decided by them with `pnpm run tcs:automated <case…> --decided-by grade10:<walk-path>`; name manual cases in the suite and rounds row.
- [ ] 6.3 Verify existing and expanded Playwright flows, retaining completed evidence and naming every unrun gate. Full duplicate-invoice, recovery, carrier and conditional conversion evidence is required by Groups 7-13; production enablement requires separate authorization.

## 7. Contract and compatibility tests (grade10) (owner: @kinisworking)

- [ ] 7.4 Add failing zero-inclusive v2 and legacy omission contract tests before extending the wire in 7.2; cover required points and per-line seen-price fields, integer bounds and successful no-points checkout: `grade10-site-store-checkout-SC-61`, `grade10-site-store-checkout-SC-39`.

The versioned points field is required and zero-inclusive, using the existing
cart tender bounds (0..10,000,000). Legacy omission means zero. Tests in 7.1
include zero, the maximum, missing v2 input, fractions, negatives and overflow:
`grade10-site-store-checkout-SC-61`. Implement this wire distinction in 7.2.

- [ ] 7.1 Add failing shared codec, datasource, resolver and fixture tests for v2 context/Pay, canonical alias identity, settling/terminal/conflict/recovery, strict cart/tender preconditions and unsupported-protocol refusal; cover old codecs, Grade10/ZZZ and existing operator adapters before implementation: `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-38`, `grade10-site-store-checkout-SC-41`, `grade10-site-store-checkout-SC-44`, `grade10-site-store-checkout-SC-46`, `grade10-site-store-checkout-SC-48`.
- [ ] 7.2 Implement shared schemas and canonical client/fixture/domain mapping, retaining legacy response shapes and authenticated/environment gates. Add no second quote/order client: `grade10-site-store-checkout-SC-44`, `grade10-site-store-checkout-SC-46`, `grade10-site-store-checkout-SC-48`.
- [ ] 7.3 Verify targeted contract/frontend suites and type checks; record the exact compatible old/new wire matrix. Group 8 depends on these shared shapes; Group 11 does not ship before Groups 8-10 pass.

## 8. Durable purchase identity and current decision (grade10)

**Observed Core** - Cart headers, saved tender comparison and member-edit
conversion are already merged: core `5b434c7a7d8f8e236754c27c41cdb9121982658e`,
application merge `665aaa9eee2fcd5aa552c9978ec6a099fc1d3e43`. Tracked Grade10
and ZZZ migration `0050_cart_header.sql` resets carts without backfill.
These facts do not complete the new tasks or prove dispatch/recovery safety.

**Race Tests** - Before 8.3, 8.1 delays both first callers around live reads,
purchase persistence, provider dispatch and URL binding. Assert one canonical
row and provider call, rechecked account/cart facts, and no canceled loser URL.
Exercise saved reuse with repriced, withdrawn, sold-out and quantity-reduced
lines, mismatched acknowledged prices/tender, and unchanged accepted facts.
Refusals create no order/invoice; successful reuse creates no new reservation:
`grade10-site-store-checkout-SC-39`, `grade10-site-store-checkout-SC-40`.

- [ ] 8.1 Add failing repository/real-Postgres race and service tests for repeat, terminal replay, distinct-key concurrent first creates, exact cart/tender conflict, current live decision on reuse, fresh authentication and transactional order binding; use provider call counters and assert persisted rows, not fixture outcomes: `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-06`, `grade10-site-store-checkout-SC-08`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-39`, `grade10-site-store-checkout-SC-40`, `grade10-site-store-checkout-SC-41`, `grade10-site-store-checkout-SC-43`; `grade10-site-store-checkout-SC-54`, `grade10-site-store-checkout-SC-55`, `grade10-site-store-checkout-SC-57`.
- [ ] 8.2 Verify the already merged core and migration 0050 provenance above. Generate supported additive schema/migrations for Grade10 and ZZZ; add uniqueness, immutable fingerprint, dispatch/retirement state and due indexes. Verify fresh install, legacy null rows and upgrade without losing completed history. Keep the reset/no-backfill release prerequisite explicit.
- [ ] 8.3 Implement context read, current live decision, account/cart-version serialization, canonical purchase identity, terminal replay and exact tender checks, preserving order/line atomicity and outside-transaction provider calls: `grade10-site-store-checkout-SC-08`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-39`, `grade10-site-store-checkout-SC-40`, `grade10-site-store-checkout-SC-41`, `grade10-site-store-checkout-SC-43`.
- [ ] 8.4 Verify focused backend and real Postgres race suites plus affected package checks; record migration-generated files and actual provider call counts. No migration executes on staging/production here.

## 9. Dispatch recovery and retirement (grade10)

**Dispatch Order** - Group 8's canonical purchase is persisted uniquely before
9.2 claims dispatch in a committed transition preceding network creation.
Cached legacy callers use that same decision and claim; supersession never
returns the canceled caller's request-local URL. Recovery, terminal replay and
durable retirement remain unchecked implementation prerequisites.

- [ ] 9.1 Add failing worker/service/DB tests for pre-dispatch crash, lost response after provider creation, missing/duplicate/wrong-owner search results, deadline blockade, durable edit retirement, edit/payment races and old-client engine safety: `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-38`, `grade10-site-store-checkout-SC-42`, `grade10-site-store-checkout-SC-43`, `grade10-site-store-checkout-SC-44`.
- [ ] 9.2 Implement persisted dispatch claim, exact Shopify shop/order/member/fingerprint correlation and paginated lookup, bind-once recovery and audited elevated bind/cancel resolution; dispatched attempts never mint replacement invoices: `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-38`.
- [ ] 9.3 Replace best-effort-only retirement with due work committed with member edits, none for shop review changes; drain through provider-aware guarded transitions and retain truthful canceled visibility: `grade10-site-store-checkout-SC-42`, `grade10-site-store-checkout-SC-43`.
- [ ] 9.4 Implement/test safe legacy adapter and legacy pending-invoice audit/drain. Migration-reset associations, uncertain historical drafts and older bundles cannot bypass member recovery blockade; record every unresolved release gate: `grade10-site-store-checkout-SC-44`.
- [ ] 9.5 Verify focused fault-injection, worker and DB tests and package checks; preserve logs/errors and record provider-search scope prerequisites. Groups 8 and 9 are backend blockers for complete frontend delivery.

## 10. Settlement, conversion and carrier evidence (grade10)

**Conversion Tests** - Before 10.2, 10.1 proves conversion against the order's
saved member-edit counter. Later member line/tender edits and rebuilt carts
survive. Shop review-only stock changes move general revision but allow paid
conversion; general revision still protects Pay, invoice reuse and frontend
stale answers: `grade10-site-store-checkout-SC-62`.

- [ ] 10.1 Add failing tests for duplicate/cross-shop events, reconcile/order-read repair, matching active-cart conversion, later version/rebuilt cart protection, and token-gated served/unsupported carrier parity: `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-16`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-45`, `grade10-site-store-checkout-SC-47`; `grade10-site-store-checkout-SC-56`, `grade10-site-store-checkout-SC-59`; include an authenticated other-member detail request at `packages/grade10-store/backend/test/trpc/routers/orders.test.ts` and assert no returned purchase facts or cart/order writes.
- [ ] 10.5 Add focused regression coverage before 10.2 for shop stock review changing only general revision after Pay; verify paid conversion clears bought lines/tender while member edits preserve them: `grade10-site-store-checkout-SC-62`.
- [ ] 10.2 Verify the merged member-edit conversion guard through the existing once-only transition and repair only demonstrated gaps; re-read cart/tender without variant deletion, retain provider paid totals and repair missing events: `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-16`, `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-45`, `grade10-site-store-checkout-SC-47`, `grade10-site-store-checkout-SC-62`.
- [ ] 10.3 Verify existing carrier implementation against token gate and exact preview rate/currency with no order/cart mutation; fix only in-scope failures required by the durable contract: `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`; `grade10-site-store-checkout-SC-56`.
- [ ] 10.4 Verify backend/real-Postgres suites, affected checks and provider-fact fixtures; retain Carrier rates in the final contract and readiness record.

## 11. Frontend cart-header integration (grade10)

- [ ] 11.5 Add failing zero-points handoff, required per-line price acknowledgement and review-only paid-refresh tests before 11.3; submit the persisted zero choice and immutable reviewed prices, and observe authoritative conversion through existing clients: `grade10-site-store-checkout-SC-61`, `grade10-site-store-checkout-SC-39`, `grade10-site-store-checkout-SC-62`.

Groups 7-10 pass before this group's implementation begins. Add zero-points
handoff and review-only paid-cart refresh to 11.1 before wiring them in 11.3:
`grade10-site-store-checkout-SC-61`, `grade10-site-store-checkout-SC-62`.

- [ ] 11.1 Add failing hook, canonical-port, drawer and order tests for all new behavior before implementation: same-session identity, persistence gating, delayed sign-out/member/edit responses, open-invoice current decision, tender refusal, conflict refresh, recovery blockade, terminal mapping, retired order visibility and authoritative conversion: `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-38`, `grade10-site-store-checkout-SC-41`, `grade10-site-store-checkout-SC-42`, `grade10-site-store-checkout-SC-46`, `grade10-site-store-checkout-SC-47`, `grade10-site-store-checkout-SC-48`; `grade10-site-store-checkout-SC-49`, `grade10-site-store-checkout-SC-50`, `grade10-site-store-checkout-SC-51`, `grade10-site-store-checkout-SC-52`, `grade10-site-store-checkout-SC-53`, `grade10-site-store-checkout-SC-54`, `grade10-site-store-checkout-SC-55`, `grade10-site-store-checkout-SC-57`, `grade10-site-store-checkout-SC-58`, `grade10-site-store-checkout-SC-59`, `grade10-site-store-checkout-SC-60`.
- [ ] 11.2 Extend cart/checkout slices and drawer host with session-scoped submitted identity, server context, persisted cart/tender readiness and immutable request guards; update existing clients/fixtures without invoice authority or duplicate fetching: `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-38`, `grade10-site-store-checkout-SC-41`, `grade10-site-store-checkout-SC-46`.
- [ ] 11.3 Wire created/reused, settling, terminal, conflict and recovery through the canonical resolver and existing localized feedback. Preserve verification, gross-goods gate, sign-in and operator behavior; refresh order/cart/tender on authoritative payment and retirement facts: `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-42`, `grade10-site-store-checkout-SC-47`, `grade10-site-store-checkout-SC-48`.
- [ ] 11.4 Verify focused frontend and extension suites, Grade10/ZZZ compatibility and change-sensitive validation from `docs/conventions/validation.md`. Keep existing status labels and both static Shopify return links: `grade10-site-store-checkout-SC-15`.

## 12. Integration and authorized staging evidence (grade10)

- [ ] 12.1 Add failing mounted Playwright flows on the actual local auth/store/API workers and Docker Postgres, with controllable provider boundary and real persistence: concurrent first Pay, repeated/reloaded/lost response, terminal replay, stale cross-device cart/tender, interrupted dispatch, retirement retry and later-cart settlement. Assert order rows and provider invoice-call counts. Fixtures alone cannot clear backend safety: `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-38`, `grade10-site-store-checkout-SC-40`, `grade10-site-store-checkout-SC-41`, `grade10-site-store-checkout-SC-42`, `grade10-site-store-checkout-SC-45`.
- [ ] 12.2 Run actual local backend E2E and required repository checks under pinned Node; repair scoped failures and record commands/results, exact backend revision and fixture/provider limits.
- [ ] 12.3 Prepare concrete staging readiness sheet: historical draft drain, correlation query permissions, configured recovery interval, retirement/reconcile jobs, valid webhook topics/signatures, carrier callback/scopes and both activated return extensions. Mark unverified items; do no provider operation without explicit authorization.
- [ ] 12.4 After explicit staging authorization, verify real saved-invoice reuse, concurrent creation, provider-response loss/correlation recovery, ambiguous blockade/operator resolution, retirement, paid webhook/reconcile, guarded conversion, carrier parity and both return surfaces. Include a line that sells out after invoice creation and confirm Shopify names it without marking the order paid. Record shop, drafts/orders, correlation, timestamps and observed results. A missing provider capability blocks readiness; it does not waive the contract.
- [ ] 12.5 Record implementation provenance and remaining manual evidence only after engineering checks pass; run plan doctor for the required receipts. Do not claim production readiness or executed human QA from automated tests.

## 13. The walk (grade10)

Uses draft feature cases as planning input after Groups 7-12 land. Planning marks no case approved or actual.

- [ ] 13.1 Keep one end-to-end actor walk for each frozen journey through its real interface: `grade10-site-store-checkout-US-01`, `grade10-site-store-checkout-US-02`, `grade10-site-store-checkout-US-03`, `grade10-site-store-checkout-US-04`, `grade10-site-store-checkout-US-05`, `grade10-site-store-checkout-US-06`.
- [ ] 13.2 In the walks' own commit, use `pnpm run tcs:automated <case…> --decided-by grade10:<walk-path>` only for cases the walks decide. Name remaining manual provider cases in the suite and rounds row.
- [ ] 13.3 Verify Playwright and authorized staging evidence separately; record unresolved gates and receipts without treating backend fixtures as live Shopify proof. Complete delivery only after every retained durable guarantee has evidence.
