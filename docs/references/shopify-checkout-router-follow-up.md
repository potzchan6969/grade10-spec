# Shopify Checkout Router Follow-Up

Implementation follow-up dated 2026-10-02, based on [PR #653](https://github.com/9gag/grade10/pull/653) and the current Shopify checkout branch.
The [checkout change](../../openspec/changes/add-shopify-checkout-integration/README.md), its [technical design](../../openspec/changes/add-shopify-checkout-integration/tech-design.md), and the [checkout delta](../../openspec/changes/add-shopify-checkout-integration/specs/grade10-site/store/checkout/spec.md) carry the proposed requirements; this reference records the code findings and proposed delivery order.

## Evidence

| Source | Inspected Baseline |
| --- | --- |
| PR #653 | Merged router split, merge commit `58ff12f7aa5f4e10bdaff3389b83928d26389f3f`; GitHub diff inspected |
| Grade10 | `codex/feat-shopify-checkout-integration`, `8e8d7c614`; PR merge is an ancestor |
| Spec store | Fetched `origin/main`, `4aced6b4363be61826e2e11e1ad83c29be9ad212`; checkout change compared with local main and has no difference |

- **Scope** - Source inspection establishes the gaps below; it does not establish test success, deployed behavior or real Shopify search support.
- **Provenance** - The published change has no `acceptance.json` or `implementation.json`, and published main has no durable checkout spec at `openspec/specs/grade10-site/store/checkout/spec.md`; reconcile its planning acceptance and record a claimed baseline through the current workflow before further implementation.
- **Preservation** - Keep unrelated local work, the application submodule pin, accepted contract text and task completion records unchanged during this follow-up study.

## Router Ownership

PR #653 moves procedures without changing their behavior, schemas or authentication.
Its deprecated paths mount the same procedure objects, covering separately deployed Workers and browser tabs holding an older bundle.

| Responsibility | Canonical Procedure | Boundary |
| --- | --- | --- |
| Member Pay | `checkout.createCheckout` | Fresh member session |
| Typed-email checkout | `checkout.createCheckoutWithEmail` | Public in PR #653 and current source; requires the checkout integration's planned operator/sandbox restriction |
| Operator Pay as member | `checkout.createCheckoutAsMember` | Elevated `store:write` and sandbox environment |
| Basket and points estimates | `quote.basket`, `quote.points` | Member session; no tender reservation |
| Operator points estimate | `quote.pointsAsMember` | Elevated `store:write` and sandbox environment |
| Live line review and shipping preview | `quote.reviewItems`, `quote.shipping` | Public; no order creation |
| Member coupons | `coupons.me` | Member session |
| Buyer order detail and history | `orders.get`, `orders.list` | Member session and ownership filtering |

- **Creation** - Extend the checkout service behind the existing creation procedures; keep state transitions, SQL and provider recovery out of quote routers.
- **Review** - Preserve `quote.reviewItems` as a mutation at the wire level even though its behavior is a stateless read.
- **Detail** - Keep the ownership check before `orders.get` invokes provider reconciliation; an unknown or foreign order answers null.
- **History** - Keep `orders.list` as a database projection; detail reads and cron repair orders without adding a provider call per history row.
- **Clients** - The current storefront transport already calls `quote.*` and `orders.*`; keep client port method names and query keys unless their meaning changes.
- **Compatibility** - Retain aliases and `test/trpc/checkoutAliases.test.ts` during this capability work; alias removal is a separate release decision based on deployed client compatibility.

## Implementation Findings

Paths below are relative to the Grade10 application repository at the recorded baseline.

| Area | Observed Code | Follow-Up |
| --- | --- | --- |
| Wire vocabulary | `packages/grade10-store/contracts/src/schemas.ts` includes settling, settled, terminal, intentConflict and recoveryRequired | Reuse these schemas; finish service outcomes and fixtures rather than adding another result union |
| Router input | `packages/grade10-store/backend/src/trpc/routers/checkout.ts` accepts optional intentId but omits it from service calls | Thread the member intent through creation; settle old-bundle behavior before making it mandatory |
| Persistence | `packages/grade10-store/backend/src/db/schema/orders.ts` lacks the designed intent identity, hash, dispatch state and deadline | Add nullable columns and all-status member/intent uniqueness with repository claims |
| Creation | `packages/grade10-store/backend/src/services/checkout.ts` promises an order for each call | Resolve existing intents before new reservations, coupon minting or supersession |
| Additional creates | `services/checkout.ts` retries a refused customer without its pairing and retires/recreates drafts when gifts are replaced | Cover each create with durable attempt ownership and recovery; prove a prior draft cannot remain payable before replacement |
| Shopify recovery | `packages/grade10-store/backend/src/adapters/shopify/shopifyProvider.ts` reads recorded draft refs but findByOrderId returns notFound | Add searchable draft correlation and exact request verification through the existing Shopify package |
| Shared recovery | `services/orders/resolveOrderPayment.ts` uses provider key replay windows and then order-id search | Add dispatch-aware Shopify recovery while preserving idempotent providers and legacy rows |
| Browser intent | `useCheckoutIntent.ts` exists; `apps/frontend/grade10/src/chrome/CartDrawerHost.tsx` submits Pay without intentId | Wire the actual drawer entry point and verify same-session reload and tender edits |
| Public identity | Typed-email creation remains a public procedure | Apply the planned elevated/sandbox restriction and update operator callers and tests |

## Delivery Order

### 1. Reconcile The Planning Baseline

- **Artifacts** - Read the durable contract and current change on the registered store's published main; retain the existing Groups 1-5 scope.
- **Routes** - Replace live planning references to old wire paths with the canonical map above, including the cart PRD's `checkout.basketQuote` reference; do not rewrite archived evidence.
- **Acceptance** - Run `/planning-dev` if acceptance or consequential design clarification is needed; record acceptance and the claimed baseline before `pnpm plan build-preflight add-shopify-checkout-integration`.
- **Compatibility** - Specify how old bundles without an intent are handled during deployment overlap: they must not silently enter an unprotected Shopify creation path.
- **Decision** - TBC: the implementation owner confirms whether an old Pay request is refused with an actionable reload response or supported by an equally replay-safe bridge; inspect existing error handling before selecting the response shape.
- **Repricing** - Reconcile safe draft replacement with the existing technical design's recovery-only rule after dispatch; distinguish proven refusal or retirement from a timeout or unknown provider state.
- **Exit** - A reviewed baseline identifies old-client behavior and every permitted provider create, with no unresolved choice affecting duplicate-payment protection.

### 2. Complete Intent Persistence Before Provider Work

Maps to existing Group 2.

- **Identity** - Normalize reviewed variant quantities and tender choices into a server hash; exclude mutable buyer email, pairing state and client money claims.
- **Transactions** - Persist the order, intent identity and accepted tender facts together; claim concurrent requests through database constraints and guarded writes.
- **Replay** - Read a matching intent before a new promise or tender reservation; return its recorded invoice, settling, settled or terminal outcome without creating another order.
- **Conflict** - Reject the same intent with changed input; serialize the member's new-intent eligibility check with creation so manual-review blocking cannot race another purchase.
- **Schema** - Generate additive migrations for both store deployments; leave legacy, POS and external rows valid with null intent fields.
- **Tests** - Prove simultaneous same-intent requests, changed hashes, replay after every terminal state, rollback during reservations and unchanged non-web behavior.
- **Exit** - One member/intent produces one local order across concurrency and terminal replay; schema and repository checks pass.

### 3. Complete Dispatch And Shopify Recovery

Maps to existing Group 3 and depends on persistence.

- **Dispatch** - Persist the dispatch claim and recovery deadline before the outbound call; commit before contacting Shopify and never hold a database transaction across a provider request.
- **Lookup** - Extend `packages/shopify/contracts`, `packages/shopify/backend/src/types/ports/draftOrders.ts`, `admin/draftOrders.ts` and their testing seams with tagged-draft lookup where required; adapt the result in the store's existing Shopify provider.
- **Verification** - Bind exactly one draft whose local-order attribute and expected line/tender fingerprint match; incomplete, ambiguous or unavailable lookup remains recovery-only.
- **Binding** - Record provider references and the safe invoice URL, or a verified way to recover that URL, before returning created; retain the existing atomic Checkout Started outbox write and prevent duplicate events on replay.
- **Create Audit** - Route initial create, customer-refusal fallback and coupon/gift replacement through the guarded lifecycle; only a proven non-created or retired attempt can permit another draft, and each later attempt must survive response loss.
- **Recovery** - Let buyer detail and cron use the same recovery service; ready rows can dispatch, dispatched rows only look up, and overdue unresolved rows require operator recovery.
- **Operators** - Use existing admin authorization and service seams for binding a verified draft or confirming orphan cancellation; new member intents remain blocked until the uncertainty is resolved.
- **Settlement** - Reuse guarded transitions for webhook, detail read and cron; preserve paid totals, coupon/points accounting and cart release only on paid.
- **Identity** - Restrict typed-email checkout to the intended operator/sandbox boundary; preserve member fresh authentication, revocation checks and the configured high-value identity gate.
- **Tests** - Inject crashes before and after dispatch, provider response loss, reference-write failure, delayed draft visibility, duplicate matches, late completion and races between webhook, detail read and cron.
- **Exit** - No browser retry, cron pass or fallback creates a second payable invoice for an uncertain attempt; provider refusals and accounting regressions pass.

### 4. Finish Storefront Integration And Contract Evidence

Maps to existing Group 4; client work can start after the wire contract is stable, while end-to-end verification waits for backend recovery.

- **Drawer** - Use the existing intent hook in the cart drawer's Pay flow; bind storage to member and basket/tender identity, preserve it across same-session reload and clear it on the defined terminal or edited-input paths.
- **Outcomes** - Verify resolveCheckout and each real caller handles settling, settled, terminal, intentConflict and recoveryRequired; repeated Pay must retain the pending purchase.
- **Reads** - Continue quote reads through `quote.*` and buyer order reads through `orders.*`; keep the authoritative Pay-time repricing on the server.
- **Orders** - Poll or refresh the owned order detail when settlement is pending; avoid treating a history listing as a bulk repair trigger.
- **Return** - Review the existing hosted-order-link work against `packages/app-env` ownership and the accepted static Your Orders link; verify staging and production targets without clearing the cart on return navigation.
- **Operator Bench** - Update typed-email test calls for the backend restriction and retain the named-member sandbox exercise.
- **API Evidence** - Regenerate `packages/api-docs/generated/store.json` through `pnpm --dir packages/api-docs run generate`; retain canonical paths and compatibility aliases together.
- **Exit** - Drawer and checkout-page tests prove the same intent across retries/reload, fresh intent after edits, actionable recovery and paid-only cart release for both brands.

### 5. Verify Repository Gates Before The Real Shop

Maps to existing Group 5; real staging configuration and writes require separate authorization.

- **Backend** - Run focused contracts, repository, service, provider and router suites, both store-worker database lanes, then `pnpm run test:backend`, typecheck, lint and the affected backend-quality gates.
- **Frontend** - Run focused drawer, checkout, order and operator-bench suites, then repository frontend tests, build and relevant Playwright smoke coverage.
- **Artifacts** - Run migration checks, submodule checks when its pointer changes, API-doc drift checks and scoped spec/manual validation when their owning artifacts change.
- **Compatibility** - Exercise canonical procedures and alias identity; prove legacy requests receive the selected safe response during mixed deployment versions.
- **Staging** - Prove tagged draft search, exact matching, ambiguous recovery, missed webhooks, duplicate Pay, configured carrier destinations, hosted return links and the high-value verified-buyer path against the real shop.
- **Receipt** - Record local order ids, provider refs, recovery timing, settlement, cart release and duplicate-invoice evidence; report every unrun or failing check explicitly.

## Boundaries

- **Plan Status** - This reference does not publish acceptance, claim a task group, mark a task complete or replace the existing change's requirements.
- **Release** - Alias removal, external Shopify configuration, secrets, deployed migrations, production data operations and production enablement stay outside this study.
- **Dependencies** - Reuse existing packages and provider ports; adding a production dependency requires a separate decision.
