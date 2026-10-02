## 1. Contract and acceptance record (grade10-spec)

- [ ] 1.1 Verify the amended requirement blocks and frozen journey/feature
  anchors, retaining existing trace identities and draft cases; human case
  review and classification follow deployed implementation in the final walk.
- [ ] 1.2 Update the checkout PRD and the linked storefront/commerce
  architecture records so the Draft Order invoice, checkout-intent recovery,
  cart-release, provider-dispatch state and Thank You/Order status link rules
  agree with the approved requirements.
- [ ] 1.3 Verify the store artifacts with `pnpm check:manual`, the scoped
  checkout test-case validator, and `openspec validate
  add-shopify-checkout-integration --strict`.

## 2. Shared contract and order persistence (grade10) (owner: @kinisworking)

- [ ] 2.1 Add failing contract, repository and migration coverage for one
  active intent, changed-intent rejection, terminal replay, provider-response
  recovery, dispatch-crash recovery and invalid payment-event handling:
  `grade10-site-store-checkout-SC-09` through
  `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-16`,
  and `grade10-site-store-checkout-SC-19` through
  `grade10-site-store-checkout-SC-21`.
- [ ] 2.2 Wire the existing optional `intentId` input and published
  `settling`, `settled`, `terminal`, `intentConflict` and `recoveryRequired`
  contracts into the service and fixtures, preserving the existing
  created/failed/contradicted/identity-required vocabulary and fixture clients
  for both storefront brands.
- [ ] 2.3 Add the nullable checkout-intent id, server request fingerprint,
  provider-dispatch state and recovery deadline to the Store orders schema,
  generate the additive migration and all-status per-member intent uniqueness
  guard, and expose repository reads/claims without changing legacy, POS or
  external order rows.
- [ ] 2.4 Verify the shared contract and persistence layer with the focused
  store contract/repository tests, `pnpm run typecheck`, `pnpm run
  check:migrations`, and `pnpm run check:submodules`.

Additional coverage belongs in test-first task 2.1: hash conflict, session
reload and terminal replay before catalog/KYC changes
(`grade10-site-store-checkout-SC-23`, `grade10-site-store-checkout-SC-24`,
`grade10-site-store-checkout-SC-25`). Existing schemas require no duplicate union.

## 3. Backend checkout and Shopify lifecycle (grade10) (owner: @kinisworking)

- [ ] 3.1 Add failing service/router/provider coverage for live review,
  hosted handoff, signed-in access, line refusal, one-intent repetition,
  terminal replay, dispatch-crash and manual recovery, settlement,
  reconciliation and carrier behavior: `grade10-site-store-checkout-SC-01`
  through `grade10-site-store-checkout-SC-08`, `grade10-site-store-checkout-SC-10`,
  `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`,
  `grade10-site-store-checkout-SC-16`, `grade10-site-store-checkout-SC-17`,
  `grade10-site-store-checkout-SC-18`, and
  `grade10-site-store-checkout-SC-19` through
  `grade10-site-store-checkout-SC-21`.
- [ ] 3.2 Thread the intent key through the authenticated checkout router and
  service: normalize the reviewed basket/tender, compute the server hash,
  claim the order, replay terminal outcomes, return the existing
  invoice/settling result, enforce the provider-dispatch state machine, and
  keep the public storefront from using typed-email identity. Preserve the
  elevated/sandbox operator test path.
- [ ] 3.3 Extend the Shopify draft contract and adapter with a deterministic
  order correlation tag, searchable draft lookup and exact fingerprint
  verification; record the Draft Order reference and invoice URL before
  returning, and refuse to create a second draft after a dispatched request,
  response loss or ambiguous provider lookup.
- [ ] 3.4 Route Shopify refusal, webhook, order-read and reconciliation
  results through the existing guarded order transition; retain provider
  paid totals and settled facts, ignore duplicate/cross-shop events, and
  release member cart lines only after `paid`. Mark unresolved dispatched
  orders for manual recovery after the deadline; reject new intents for that
  member until the provider draft is bound or canceled.
- [ ] 3.5 Keep the carrier callback token-gated and stateless, make it use the
  configured preview rule, return no rate for an unsupported destination, and
  add diagnostics for the staging correlation/return path.
- [ ] 3.6 Verify the backend with focused service/provider suites, `pnpm run
  test:backend`, `pnpm run typecheck`, `pnpm run lint`, and the relevant
  backend-quality checks, including the appended tasks; frontend integration
  independently uses contract fixtures.
- [ ] 3.7 Add failing then passing coverage for Pay recheck, conflict/replay
  ordering, every Shopify creation path and canonical read boundaries:
  `grade10-site-store-checkout-SC-22`, `grade10-site-store-checkout-SC-24`,
  `grade10-site-store-checkout-SC-25`, `grade10-site-store-checkout-SC-26`,
  `grade10-site-store-checkout-SC-27`, `grade10-site-store-checkout-SC-28`,
  `grade10-site-store-checkout-SC-29`, `grade10-site-store-checkout-SC-30`,
  `grade10-site-store-checkout-SC-31`, `grade10-site-store-checkout-SC-32`.
  Move live goods/KYC behind unchanged replay; enforce one conditional dispatch
  and safe refusal for customer/gift fallback, preserve original payable facts
  on uncertain cleanup, and retain stateless reads and deprecated aliases.
- [ ] 3.8 Provide the elevated, sandbox-authorized, audited operator bind/cancel
  recovery needed by `grade10-site-store-checkout-SC-21`; verify the configured
  provider's unique draft/payment or confirmed cancellation before clearing the
  member blockade. Reuse an adequate existing operation; do not require database edits.

## 4. Storefront checkout and order surfaces (grade10) (owner: @kinisworking)

Depends on Group 2 contracts, not a running backend; build against fixtures.

- [ ] 4.1 Add failing frontend coverage for live review gating, changed-line
  recovery, one hosted invoice, signed-out access, repeated Pay, terminal
  replay, dispatch-crash and recovery-required outcomes, paid cart release and
  confirmation return: `grade10-site-store-checkout-SC-01`
  through `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-09`,
  `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-12`,
  `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-15`,
  and `grade10-site-store-checkout-SC-19` through
  `grade10-site-store-checkout-SC-21`.
- [ ] 4.2 Add same-session intent storage and invalidation to the existing
  cart drawer checkout feature; include the intent in Pay requests, keep Pay disabled
  during pending/failed/contradictory live reads, and render the existing
  tender estimate without presenting shipping or tax as final.
- [ ] 4.3 Map the existing settling, settled, terminal, intent-conflict and
  recovery-required outcomes through `resolveCheckout`, keep the pending order
  visible in Your Orders, refresh order settlement, and clear the member cart
  only after the paid transition.
- [ ] 4.4 Preserve the Overrider checkout-test page for signed-in and typed
  email staging exercises while ensuring the public route requires the member
  session and the identity/KYC outcome remains actionable.
- [ ] 4.5 Add the Shopify Thank You and Order status extension in the existing
  Shopify integration package; render the static Grade10 Your Orders link from
  `ui-design.md` without adding a new `@grade10/ui` export or a
  purchase-specific resolver.
- [ ] 4.6 Verify the affected frontend with focused checkout/order tests,
  `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`,
  and the relevant Playwright smoke coverage, including the appended task.
- [ ] 4.7 Add failing then passing drawer/session coverage for reload, member
  scope, changed-intent conflict and gross-goods verification against fixtures:
  `grade10-site-store-checkout-SC-22`, `grade10-site-store-checkout-SC-23`,
  `grade10-site-store-checkout-SC-24`, `grade10-site-store-checkout-SC-25`,
  `grade10-site-store-checkout-SC-28`, `grade10-site-store-checkout-SC-32`.
  Preserve optional-intent older-bundle compatibility and gate production until
  older public creation bundles drain; test elevated typed-email bench adapters.

## 5. Staging shop readiness and release walk (grade10) (owner: @kinisworking)

- [ ] 5.1 Prepare the staging evidence cases for one normal payment, repeated
  Pay, terminal-intent replay, a crash before dispatch, response-loss recovery,
  ambiguous recovery, changed/sold-out line, missed webhook, served carrier
  destination, unsupported destination and the Grade10 confirmation link.
- [ ] 5.2 After explicit staging authorization, configure the real Shopify
  shop/app scopes, correlation-tag behavior, webhook topics, carrier service,
  Thank You/Order status checkout UI extension, checkout hostname/return
  surface and the staging feature gate; do not make production writes.
- [ ] 5.3 Run one real staging walk for `grade10-site-store-checkout-US-01`,
  `grade10-site-store-checkout-US-02`,
  `grade10-site-store-checkout-US-03`, and
  `grade10-site-store-checkout-US-04`, recording the order id, provider refs,
  settlement timing, cart release and no-duplicate result. Include the
  HKD 120,000 verified-buyer path.
- [ ] 5.4 Verify the release evidence with the draft feature suite,
  `pnpm run test:e2e:smoke`, the relevant backend checks and
  `pnpm run check:manual`; production deployment, secrets and migrations stay
  outside this plan until separately authorized.

## 6. The walk (grade10)

Uses the draft feature suite as input after Groups 2–5 land. Human QA reviews
the deployed implementation with `/tcs-review add-shopify-checkout-integration`;
manual execution uses `/tcs-run-sheet` where needed. This group classifies no
planning case as already approved or executed.

- [ ] 6.1 Keep end-to-end walks for every checkout journey, including drawer
  review, Pay recheck, repeat/reload, changed purchase, Shopify refusal, signed-out
  gate and confirmation return; exercise `grade10-site-store-checkout-US-01`,
  `grade10-site-store-checkout-US-02`, `grade10-site-store-checkout-US-03`,
  `grade10-site-store-checkout-US-04` against staging and retain evidence.
- [ ] 6.2 In the walks' commit, mark only cases actually decided by those walks
  with `pnpm run tcs:automated <case…> --decided-by grade10:<walk-path>`; name
  cases remaining manual in the suite and the walk's rounds row.
- [ ] 6.3 Verify the relevant Playwright suite and real provider no-duplicate,
  recovery, carrier and return gates; record observed settlement timing and
  provider references. Production enablement remains separately authorized.
