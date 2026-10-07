## Context

The application already creates Shopify hosted invoices from the cart drawer.
PR #653 separates creation from canonical quote, coupon and order clients.
`CartDrawerHost.tsx` sends reviewed items and accepted tender through
`useCreateCheckout`; `CheckoutApiService` decodes the existing contract through
the injected `StoreProcedureClient`. Customer order surfaces already poll open
orders and refresh cart projections after observing a paid web order.

The existing optional intent field and frontend result variants do not prove
backend replay support. The current router accepts `intentId` but does not
pass it to creation. This plan adds no backend intent, provider or recovery
guarantee. The one backend piece is the cart header (Q20): `store.cart_lines`
was keyed by member with no cart of its own, and the paid transition removed
the member's lines matching the paid order's variants, so a payment learned
late emptied a cart built afterwards.

## Goals / Non-Goals

- **Goals** - Complete drawer response handling, pending submission gating,
  existing verification feedback and order return against existing clients and
  fixtures.
- **Goals, backend** - One active cart per member; one payable invoice per
  cart; payment clears only the cart it bought, on every settlement path.
- **Non-Goals** - Wire-contract, provider, recovery and carrier changes;
  reconciling a cart edit into an invoice already made; new dependencies or
  shared UI exports.

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
frontend request resolves. A later deliberate Pay invokes creation again; the
backend answers the cart's open invoice or replaces it. Do not wire
`useCheckoutIntent`, persist an intent in the browser or search for an earlier
provider draft. A transport failure does not establish whether creation ran.

### Use Existing Outcome Decisions

Keep `resolveCheckout` as the total domain decision and let the drawer render
its answer. Redirect only for an existing hosted URL; settling opens the
existing order surface. Named-line contradictions/refusals refresh the current
review and show the existing feedback. Transport and contract failures stay
distinct from resolved business outcomes and restore the ready-basket retry.

Keep the existing drawer-host account-verification feedback when required. It
shows the gross-goods threshold and account action, then returns the drawer to
its existing checkout-failure treatment; the identity check still runs on the
account route. No shared drawer slot or export is added by this integration.
Sign-out uses the current sign-in action and cannot fall back to typed-email
checkout. `createCheckoutWithEmail` remains `publicProcedure` on the backend;
the unchanged operator surface retains its existing access and sandbox gates.

The published union also contains settled, terminal, intent-conflict and
recovery-required outcomes. Preserve exhaustive handling and safe existing
order/support navigation if one is received. Fixture coverage can exercise
that compatibility vocabulary without claiming the current backend emits it,
or adding intent/recovery behavior to make it do so.

### Reflect Paid Cleanup

Keep the existing order hooks, pending polling and `orderSettlement.ts` cart
invalidation. No redirect, confirmation-link click or merely returned browser
clears cart data. The backend paid transition converts the cart the order was
made from; browser reads reflect its result, an empty cart after a payment for
the unchanged cart and the edited cart otherwise. There is no client
reconciliation.

### Hang the Member Cart from One Cart Header

- **`store.carts`** - one `active` row per member by a partial unique index,
  the tender columns `cart_tender` held, and `version`, bumped by a write that
  changes a line or the tender and by a review write-back that changed a row.
  A read never creates a cart; the first write does, under the owner lock.
  `status` is `active` or `converted`; a converted cart stays as the record.
- **`store.cart_lines`** - keyed `(cart_id, variant_id)`, cascading from its
  cart. `cart_tender` is dropped.
- **Linking** - `createCheckout` reads the active cart and its lines in one
  statement. When the request's items are exactly those lines, the order
  records `cart_id` and `cart_version`. Any other basket records neither.
- **Same cart** - an open (`pending`/`processing`) web order for the same
  `cart_id` and `cart_version` with a recorded ref and
  `payment_checkout_url` is answered as `created`, with no order written and
  no provider call.
- **Edit** - each cart procedure that writes (`setLine`, `merge`,
  `setTender`, `review`), once its write commits, lists the active cart's open
  orders with a recorded ref and a `cart_version` below the cart's. Any it
  finds are retired past the response with `defer`: the draft is deleted at
  Shopify, then the order is `canceled`. Best effort, so a lost or refused
  retire leaves the order to the next Pay or the reconcile give-up; a cart
  with no such order makes no Shopify call.
- **Changed cart** - the existing supersede pass, run before the new order and
  again after its refs, also lists every other open order with this
  `cart_id`: the draft is retired at Shopify, then the order is `canceled`; a
  draft that will not die stays for the reconcile pass.
- **Payment** - `applyOrderTransition(paid)` runs one guarded UPDATE in its
  transaction: `converted` where `id = cart_id`, `version = cart_version` and
  `status = 'active'`. It replaces the matching-line delete and the tender
  delete. A concurrent edit holds the cart row; Postgres re-reads the version
  after it commits.
- **Till** - untouched: till sales promise caller-priced lines and never read
  `store.cart_lines`; their orders carry no `cart_id`.

### Reuse the Shopify Confirmation Extensions

Use `integrations/shopify-pos/grade10/extensions/thank-you`, `order-status` and
their shared `yourOrdersLink.ts`. Preserve Shopify layout primitives and
localized labels. Verify the static Grade10 orders destination in fixtures;
no purchase-specific resolver or `@grade10/ui` export is added. Shop activation
and real staging payment are later, separately authorized operational work.

## Database Schema

| Table | Change |
| --- | --- |
| `store.carts` | New: `id`, `user_id`, `status`, `version`, `coupon_kind`, `coupon_code`, `coupon_id`, `spend_points`, timestamps; `uq_carts_active` on `user_id` where `status = 'active'` |
| `store.cart_lines` | Rebuilt keyed `(cart_id, variant_id)`, `cart_id` cascading from `carts` |
| `store.cart_tender` | Dropped |
| `store.orders` | `cart_id` (set null on cart delete), `cart_version`, `payment_checkout_url`; partial index on `cart_id` |

One migration per brand, identical. It drops and rebuilds the cart tables
rather than copying them: the store runs on staging only, where carts are
reset. No request fingerprints, dispatch states or recovery deadlines are
added. Frontend cached reads stay projections.

## Acceptance Fold

The delta uses an explicit `## REMOVED Feature set` section to retire the
withdrawn Safe repetition and recovery group. The acceptance fold removes that
root group before publishing the frontend contract, while preserving the
historical acceptance snapshot and implementation claim.

## Service Interfaces

Existing interfaces are consumed without modification.

| Frontend Boundary | Input | Output |
| --- | --- | --- |
| Creation use case and repository | Reviewed product handle, variant id, quantity, optional seen unit price; accepted points/coupon choices; optional device id | Existing checkout outcome or transport/contract error |
| Creation data service | Existing `CreateCheckoutPayload` through injected `StoreProcedureClient` | Decoded `checkoutResultSchema` in the Effect success channel; `ApiError` in failure channel |
| Domain resolution | Existing `CheckoutOutcome` | Redirect, settling, verification, cart amendment, retry/support, or existing compatibility outcome |
| Order reads | Existing order id or list limit | Existing order/list response; polling follows existing open statuses |
| Backend creation | The same `createCheckout` input | The cart's open invoice for an unchanged cart, else a new one with the cart's other open invoices retired |
| Backend cart procedures | The same `cart.*` inputs | The member's active cart; unchanged wire shapes |

Capture immutable mutation variables and originating member scope before
submission. A synchronous current-request guard prevents a second handler
invocation before React renders pending state; rendered `isPending` keeps the
action unavailable thereafter. Late completion after a member change cannot
redirect or render the previous member's outcome. These are frontend controls,
not backend locks or deduplication. The browser performs no persistence writes
or transaction ownership beyond existing cart operations.

## Risks / Trade-offs

- **Repeated creation** - Two tabs pressing Pay at once can each create a
  draft; the supersede pass's second run keeps the newest and retires the
  other, so one tab holds a dead URL. The frontend still gates its in-flight
  action.
- **Response loss** - Creation may have happened before a transport failure.
  Present the existing error/order outcome without promising invoice recovery.
- **Member changes during a request** - Capture the originating member scope
  and reject stale UI effects after sign-out or switching member; do not render
  another member's order or redirect from their late response.
- **Cart edits during payment** - The invoice remains fixed and the edit
  discards it. Paid before the discard lands, or where the discard failed and
  the next Pay has not run, it settles its order and the edited cart is kept.
- **Real-shop setup** - Fixture proof cannot prove extension placement or
  provider payment. Record those observations only in an authorized staging walk.

## Migration Plan

1. Add meaningful failing frontend fixture and browser integration coverage
   before the corresponding frontend changes.
2. Complete drawer wiring, order response handling and existing extension
   integration; run focused frontend and extension checks.
3. Apply the cart-header migration to staging, which resets staging carts,
   then deploy the store worker.
4. After staging authorization, deploy frontend assets and activate/verify the
   existing extension return surfaces.
5. Roll back affected frontend assets or extension activation if required;
   existing invoices and backend order state remain authoritative.
