## Context

The Grade10 app already has a checkout page, a shared Store checkout feature,
typed review/quote contracts, a local order machine, a Shopify provider, signed
webhooks, reconciliation and a stateless carrier callback. The current path
prices and writes a local order before calling Shopify's Draft Order API, then
records the provider references when the call succeeds.

The missing integration seam is repetition. The orders table has provider
reference uniqueness and retry scheduling, but no browser checkout-intent key,
request fingerprint or durable provider-dispatch state. Shopify Draft Order
creation has no provider idempotency key in the current port. A response loss
can therefore leave a local order and an unbound draft, while a second Pay
request can start another promise. The public router also still exposes a
typed-email procedure even though the storefront product record says public
checkout is member-only; that procedure must remain available only for the
operator test path before launch.

The implementation must also reconcile the older cart-era wording in
`docs/architecture/checkout-domain.md` with the current Draft Order/invoice
source of truth in `docs/architecture/commerce.md`. This is a cross-cutting
data, provider and browser change, so the design is recorded before tasks.

## Goals / Non-Goals

**Goals:**

- Make the public storefront's Pay request a live, signed-in member decision.
- Persist one checkout intent and canonical reviewed-request fingerprint per
  web order, including terminal orders.
- Make repeated Pay, same-session reload and provider response loss converge on
  one local order and at most one payable Shopify invoice; surface ambiguous
  provider state for manual recovery instead of creating a second invoice.
- Preserve the existing provider/webhook/reconcile/transition seams and release
  the member cart only on the guarded `paid` transition.
- Prove the real shop, carrier callback and confirmation return in staging
  before production enablement.

**Non-Goals:**

- An embedded payment form or client-side money authority.
- Guest checkout on the public storefront.
- A second payment provider abstraction or a new production dependency.
- Moving address, shipping or tax calculation into Grade10.
- Production secrets, migrations, dashboard writes or deployment during this
  planning change.

## Decisions

### Reuse the existing checkout seams

Keep page composition in `apps/frontend/grade10/src/pages/checkout` and route
navigation in `apps/frontend/grade10/src/routes/checkout.tsx`. Add the
intent/repeat state to the existing shared checkout feature rather than
creating a second client repository. Extend the shared wire contracts in
`packages/grade10-store/contracts`, with the backend procedure remaining the
server-owned boundary.

The backend keeps the current order sequence:

1. Read the current catalog lines and tender facts.
2. Reject a moved, failed or contradictory read before an order exists.
3. In one database transaction, insert the order, lines, tender facts and
   checkout correlation.
4. Outside that transaction, create or recover the Shopify Draft Order.
5. Record the Draft Order reference and invoice URL before returning a redirect.

No provider call is placed inside a database transaction.

### Store intent identity on the existing order

Add four nullable columns to the existing `store.orders` record:

| Column | Meaning |
| --- | --- |
| `checkout_intent_id` | Opaque browser-generated key for one web checkout. Null for legacy and non-web records. |
| `checkout_request_hash` | Server-generated digest of the normalized reviewed variant ids/quantities and accepted tender choices. It is a replay guard, not a money amount. |
| `checkout_create_state` | Provider-dispatch state: `ready`, `dispatched`, `bound` or `manual_review`. Null for legacy and non-web records. |
| `checkout_recovery_deadline_at` | End of the bounded provider-recovery window. Null for legacy and records with no provider attempt. |

Add a unique index for `(user_id, checkout_intent_id)` where the order is a web
order and the intent is non-null, regardless of order status. The index is the
database race guard and preserves one row for an intent after it settles or
closes. An insert conflict loads the existing order and follows its replay
path. Keep existing provider-ref uniqueness unchanged.

The client creates an opaque intent with the platform UUID facility and keeps
it in the active checkout session. A same-session reload reuses it until the
order is terminal. Editing a line, quantity, promo or points choice clears the
old intent and creates a new one. The server never trusts a client amount: it
normalizes the ids and choices, re-reads the live catalog, and computes the
stored hash after validation.

If the existing order has the same intent and hash, the server returns its
recorded invoice or a settling response while it is open. A paid or refunded
row returns a `settled` replay outcome with its order id; a failed, canceled or
expired row returns a `terminal` replay outcome that tells the client to clear
the old key and create a new intent. Neither replay creates an order or calls
Shopify. If the hash differs, the server returns an `intentConflict` outcome
and the client must submit a new intent. A terminal order is never returned as
an active checkout.

### Make the provider call single-flight and recoverable

The first request that wins the intent race owns Draft Order creation. It moves
the local order into the existing `processing` state and claims its
`checkout_create_state` before the provider call; another request for the same
open intent returns the existing invoice when its reference is present, or the
wire-level settling outcome when creation is still in flight. It never calls
Shopify a second time merely because the first HTTP response has not arrived.

The durable dispatch state closes the crash window. A new order starts `ready`.
The worker may retry a lease that crashed before it marked the request
`dispatched`. Immediately before the first provider call, one transaction
changes the state to `dispatched` and sets the recovery deadline. Once that
marker exists, every retry performs recovery lookup only; it never creates a
replacement draft. A crash between the marker and the network call is treated
as ambiguous and follows the same safe path as a lost response.

Extend the Shopify Draft Order port with a recovery lookup keyed by a
deterministic correlation tag derived from the local order id. Keep the current
order-id custom attribute for the completed order, and add a provider-supported
searchable draft tag such as `grade10_checkout_<order-id>`. The Shopify adapter
must:

- send that tag on create;
- query open drafts by the tag after a response loss;
- verify the exact local-order attribute and expected line/tender fingerprint;
- accept exactly one matching draft, record its reference and invoice URL, and
  return it; and
- refuse loudly when no match or more than one match exists.

The recovery path can also use an already recorded Draft Order reference. It
must never create a replacement draft for the same intent. A `dispatched` row
with no unique match remains `settling` through the recovery deadline. At the
deadline it becomes `manual_review`, returns `recoveryRequired` to the buyer,
and raises an operator diagnostic. The operator must bind the one matching
draft or cancel every orphan before the member can start a new purchase. The
checkout service rejects any new intent from that member while a
`manual_review` row remains unresolved. A provider lookup that is unavailable
or ambiguous never becomes permission to create. Provider lookup, tag search
and the recovery deadline are staged against the real shop before the feature
is enabled; a dashboard/API limitation is a release blocker, not a fallback to
duplicate creation.

Use the existing `next_attempt_at`/reconcile claim machinery for abandoned
`processing` rows. A lost response with no immediately recoverable draft stays
pending/settling and is observable; reconciliation retries a provider read or
the correlation lookup and applies the same guarded transition used by
webhooks. No browser retry bypasses that ladder. A row still `ready` after its
lease is safe to dispatch; a row already `dispatched` is recovery-only.

### Keep the public identity boundary explicit

`createCheckout` remains a fresh-authenticated procedure and carries the
session member id to the service. Public storefront code must not call the
typed-email procedure. Preserve typed-email checkout only behind the existing
development/staging Overrider test surface and an elevated/sandbox backend
guard; add a regression test that an unauthenticated public request cannot
create an order from an email alone.

The existing high-value identity/KYC gate remains before the order transaction.
The gate receives the live goods total and refuses above the configured
HKD 120,000 threshold until the member has verified standing.

### Extend the wire outcome without inventing provider data

Keep the existing `created` result for a recorded hosted URL. Add a small
wire-level `settling` result carrying the local order id and any already-known
tender facts when an unchanged intent owns an order but has no safe hosted URL
yet. Add `settled`, `terminal`, `intentConflict` and `recoveryRequired` replay
outcomes with the local order id and server-owned status/detail fields. Both
`createCheckout` and the operator-only test procedure use the same result
mapping. The shared frontend checkout resolution maps `settling` to the
existing settling presentation, `settled` to the order route, `terminal` and
`intentConflict` to a fresh-intent action, and `recoveryRequired` to support.
It never fabricates a checkout URL or exposes a provider secret.

The existing `failed` and `contradicted` outcomes remain for provider refusal,
catalog failure and changed lines. A Shopify sold-out response names the line,
keeps the local order unpaid/recoverable, and returns the collector to the
amend-and-retry path.

### Reuse one settlement transition

Webhook verification, reconciliation and the buyer's order read all call the
existing guarded order transition. The transition records Shopify's paid
total, goods, shipping, tax, order name, settled lines and payment instrument
when supplied; ignores duplicate/cross-shop/invalid-signature events; and
releases the matching member cart lines only inside the successful paid
transition. The confirmation page uses a Shopify Thank You and Order status
checkout UI extension to offer a static Grade10 Your Orders link. The member
finds the matching purchase in that surface after returning. The extension is
the return mechanism; the native Continue shopping button and a per-draft
return URL are not relied on. The link is not a page-return signal that clears
the cart.

### Reuse the carrier rule and current architecture records

The carrier callback remains token-gated, stateless and side-effect free. It
uses the same configured destination/rate rule as the store preview and returns
no rate for an unsupported destination. The staging task registers and verifies
the callback against the real shop.

Update `docs/architecture/checkout-domain.md` so its routing and lifecycle
description agrees with Draft Order/invoice handoff and the intent/recovery
rules in `docs/architecture/commerce.md`. Do not introduce a second durable
commerce description in the application code.

## Data and interface shape

### Local order relationship

```text
member user
    │
    └──< store.orders
          ├── checkout_intent_id + checkout_request_hash
          ├── checkout_create_state + checkout_recovery_deadline_at
          ├──< store.order_items
          ├── payment_checkout_ref ── Shopify Draft Order / invoice
          ├── payment_ref ─────────── Shopify paid order
          └── payment_events / order_events
```

`checkout_intent_id` is an immutable web-correlation key for one attempted
purchase, not a provider id. The provider references remain the settlement and
reconciliation keys. Existing POS, external and legacy web rows remain valid
with null intent columns.

### Procedure input/output

The authenticated create input becomes:

```text
{
  intentId: string,
  items,
  spendPoints?,
  couponCodes?,
  couponId?,
  deviceId?
}
```

The amount and currency fields remain server outputs. The result union gains:

```text
{ outcome: "settling", orderId, discountMinor, discountPoints,
  couponCodes, replacedCouponCodes, couponLineDiscountMinor }
{ outcome: "settled" | "terminal", orderId, status }
{ outcome: "intentConflict", orderId }
{ outcome: "recoveryRequired", orderId, detail }
```

The operator test procedure accepts the same intent field but keeps its
existing member/email selection and sandbox authorization. No guest procedure
is added to the public storefront contract.

### Provider port

The Shopify draft port adds a lookup operation that returns the existing draft
or an explicit not-found/ambiguous/error answer, plus the searchable tag on
create. The adapter maps a recovered draft through the same
`ProviderCheckoutOutcome` path as a successful create, so reference recording
and URL checks have one implementation. The staging task must prove that an
open draft can be found by its tag and that a duplicate tag is reported as
ambiguous.

## Risks / Trade-offs

- **Shopify draft search is an external dependency.** The correlation tag and
  lookup are verified in staging; inability to search uniquely blocks launch.
- **The provider has no create idempotency key.** The dispatch marker is written
  before the first create. A crash after that marker is recovery-only and can
  end in `manual_review`; this protects the member from a duplicate invoice at
  the cost of an operator-assisted recovery.
- **A hosted invoice is a bearer URL.** Grade10 records it only after the
  local order is bound and never logs or stores a client payment secret.
- **A provider call can succeed after the worker times out.** The local order
  remains recoverable, the next attempt reads the correlation, and a second
  create is forbidden. A draft that appears after the recovery deadline is
  quarantined for the operator rather than settled automatically.
- **A catalog price can move between review and the draft.** The Pay read is
  repeated immediately before the order transaction; Shopify remains final for
  address-aware shipping, tax and its own automatic discounts.
- **A webhook can race reconciliation.** Both use the guarded transition and
  provider/event uniqueness, so the loser observes an unchanged paid order.
- **The typed-email path has legitimate test coverage today.** Keep it behind
  the operator/sandbox boundary rather than deleting the test surface or
  allowing it to define public identity.

## Migration Plan

1. Land the additive order columns/index and contract changes with tests. The
   migration is nullable/backward-compatible and does not rewrite or delete
   existing orders.
2. Deploy the backend/provider recovery code and frontend intent handling with
   the public storefront path disabled or gated until staging configuration is
   complete.
3. Configure staging Shopify credentials/scopes, the searchable correlation
   tag behavior, webhook topics, carrier service and the Thank You/Order status
   extension that links to Grade10 Your Orders.
4. Run the real staging walkthrough for the four journeys, including repeated
   Pay, terminal-intent replay, a crash before dispatch, response-loss recovery,
   an ambiguous recovery, sold-out refusal, missed webhook, served and
   unsupported destinations, the Grade10 confirmation link, and the HKD
   120,000 identity gate.
5. Enable the public staging path only after the manual suite is reviewed and
   the observed provider behavior matches the requirements. Production
   enablement remains an explicitly authorized release operation.
6. Roll back by disabling the new storefront path and deploying the previous
   worker; retain the additive columns and recorded legacy orders. Do not drop
   columns or delete provider drafts as part of rollback.

## Open Questions

None that change the requirements or implementation order. The exact Shopify
Admin dashboard labels, extension placement and credentials are release-time
operational details; the staging walkthrough must prove the selected
configuration before launch.
