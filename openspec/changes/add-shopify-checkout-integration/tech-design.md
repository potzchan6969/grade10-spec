## Context

The application already creates Shopify hosted invoices from the cart drawer.
PR #653 separates creation from canonical quote, coupon and order clients.
`CartDrawerHost.tsx` sends reviewed items and accepted tender through
`useCreateCheckout`; `CheckoutApiService` decodes the existing contract through
the injected `StoreProcedureClient`. Customer order surfaces already poll open
orders and refresh cart projections after observing a paid web order.

The existing optional intent field and frontend result variants do not prove
backend replay support. The current router accepts `intentId` but does not
pass it to creation. This plan consumes existing behavior and adds no backend
intent, provider or settlement guarantee.

## Goals / Non-Goals

- **Goals** - Complete drawer response handling, pending submission gating,
  inline verification and order return against existing clients and fixtures.
- **Non-Goals** - Backend, persistence, wire-contract, provider, recovery,
  carrier and settlement changes; old-invoice cancellation; reconciliation of
  cart edits made during payment; new dependencies or shared UI exports.

## Decisions

### Keep the Existing Frontend Boundaries

The [checkout contract](specs/grade10-site/store/checkout/spec.md) governs the
collector's handoff and return. Keep product orchestration in the Grade10
drawer host, domain outcome decisions in the existing checkout feature, and
API decoding in its data layer. Reuse the current DI tokens, repository and
procedure client rather than adding a parallel checkout client.

Use `quote.basket`, `quote.points`, the canonical coupon clients, `orders.get`
and `orders.list` where their existing adapters already answer. Preserve
deprecated backend aliases and operator test adapters. No endpoint is renamed
or changed by this amendment.

### Submit Current Review and Accepted Tender

Use the drawer's current continuous review and quote. Keep the existing
`sendableTender` projection and seen-price metadata; do not derive payable
money in the browser or add a separate pre-Pay read. Existing server validation
remains authoritative. Freeze the submitted items and accepted tender in the
mutation variables; later drawer changes do not rewrite that request or the
invoice it creates.

Guard the action before mutation and keep it unavailable until the current
frontend request resolves. A later deliberate Pay invokes creation again.
Do not wire `useCheckoutIntent`, persist an intent, reuse a stored invoice or
search for an earlier provider draft. The old invoice is ignored and may
remain payable. A transport failure does not establish whether creation ran.

### Use Existing Outcome Decisions

Keep `resolveCheckout` as the total domain decision and let the drawer render
its answer. Redirect only for an existing hosted URL; settling opens the
existing order surface. Named-line contradictions/refusals refresh the current
review and show the existing feedback. Transport and contract failures stay
distinct from resolved business outcomes and restore the ready-basket retry.

Replace the drawer action with the existing inline account-verification state
when required; use the existing gross-goods threshold and account route.
Sign-out uses the current sign-in action and cannot fall back to typed-email
checkout. `createCheckoutWithEmail` remains `publicProcedure` on the backend;
the unchanged operator surface retains its existing access and sandbox gates.

The published union also contains settled, terminal, intent-conflict and
recovery-required outcomes. Preserve exhaustive handling and safe existing
order/support navigation if one is received. Fixture coverage can exercise
that compatibility vocabulary without claiming the current backend emits it,
or adding intent/recovery behavior to make it do so.

### Reflect Existing Paid Cleanup

Keep the existing order hooks, pending polling and `orderSettlement.ts` cart
invalidation. No redirect, confirmation-link click or merely returned browser
clears cart data. The existing backend paid transition removes whole matching
variant lines and clears cart tender. Browser reads reflect its result,
including when quantity or tender changed during payment; there is no new
client reconciliation or quantity-subtraction algorithm.

### Reuse the Shopify Confirmation Extensions

Use `integrations/shopify-pos/grade10/extensions/thank-you`, `order-status` and
their shared `yourOrdersLink.ts`. Preserve Shopify layout primitives and
localized labels. Verify the static Grade10 orders destination in fixtures;
no purchase-specific resolver or `@grade10/ui` export is added. Shop activation
and real staging payment are later, separately authorized operational work.

## Database Schema

Unchanged. No columns, indexes, migrations, request fingerprints, dispatch
states or recovery deadlines are added. Existing order and cart records remain
authoritative; frontend cached reads are projections.

## Acceptance Hold

TBC - The acceptance fold merges feature lists additively. Its preview retains
the withdrawn Safe repetition and recovery descriptions even though the intent
requirement is removed. Resolve this workflow limitation before acceptance;
do not publish those descriptions as part of the frontend contract. Historical
acceptance snapshots and the implementation claim remain unchanged meanwhile.

## Service Interfaces

Existing interfaces are consumed without modification.

| Frontend Boundary | Input | Output |
| --- | --- | --- |
| Creation use case and repository | Reviewed product handle, variant id, quantity, optional seen unit price; accepted points/coupon choices; optional device id | Existing checkout outcome or transport/contract error |
| Creation data service | Existing `CreateCheckoutPayload` through injected `StoreProcedureClient` | Decoded `checkoutResultSchema` in the Effect success channel; `ApiError` in failure channel |
| Domain resolution | Existing `CheckoutOutcome` | Redirect, settling, verification, cart amendment, retry/support, or existing compatibility outcome |
| Order reads | Existing order id or list limit | Existing order/list response; polling follows existing open statuses |

Capture immutable mutation variables and originating member scope before
submission. A synchronous current-request guard prevents a second handler
invocation before React renders pending state; rendered `isPending` keeps the
action unavailable thereafter. Late completion after a member change cannot
redirect or render the previous member's outcome. These are frontend controls,
not backend locks or deduplication. The browser performs no persistence writes
or transaction ownership beyond existing cart operations.

## Risks / Trade-offs

- **Repeated creation** - A later Pay can create another payable invoice.
  Gate the in-flight frontend action and avoid any copy promising deduplication.
- **Response loss** - Creation may have happened before a transport failure.
  Present the existing error/order outcome without promising invoice recovery.
- **Member changes during a request** - Capture the originating member scope
  and reject stale UI effects after sign-out or switching member; do not render
  another member's order or redirect from their late response.
- **Cart edits during payment** - The invoice remains fixed. Refresh the
  server's existing cleanup result; do not preserve added quantity with a new
  reconciliation policy.
- **Real-shop setup** - Fixture proof cannot prove extension placement or
  provider payment. Record those observations only in an authorized staging walk.

## Migration Plan

1. Add meaningful failing frontend fixture and browser integration coverage
   before the corresponding frontend changes.
2. Complete drawer wiring, order response handling and existing extension
   integration; run focused frontend and extension checks.
3. After staging authorization, deploy frontend assets and activate/verify the
   existing extension return surfaces. No backend or data migration is needed.
4. Roll back affected frontend assets or extension activation if required;
   existing invoices and backend order state remain authoritative.
