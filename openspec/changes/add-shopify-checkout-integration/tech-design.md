## Context

The Grade10 app already has a checkout page, a shared Store checkout feature,
typed review/quote contracts, a local order machine, a Shopify provider, signed
webhooks, reconciliation and a stateless carrier callback. The current path
prices and writes a local order before calling Shopify's Draft Order API, then
records the provider references when the call succeeds.

The missing integration seam is repetition. The orders table has provider
reference uniqueness and retry scheduling, but no browser checkout-intent key
or request fingerprint. Shopify Draft Order creation has no provider
idempotency key in the current port. A response loss can therefore leave a
local order and an unbound draft, while a second Pay request can start another
promise. The public router also still exposes a typed-email procedure even
though the storefront product record says public checkout is member-only; that
procedure must remain available only for the operator test path before launch.

The implementation must also reconcile the older cart-era wording in
`docs/architecture/checkout-domain.md` with the current Draft Order/invoice
source of truth in `docs/architecture/commerce.md`. This is a cross-cutting
data, provider and browser change, so the design is recorded before tasks.

## Goals / Non-Goals

**Goals:**

- Make the public storefront's Pay request a live, signed-in member decision.
- Persist one checkout intent and canonical reviewed-request fingerprint per
  active web order.
- Make repeated Pay, same-session reload and provider response loss converge on
  one local order and at most one payable Shopify invoice.
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

Add two nullable columns to the existing `store.orders` record:

| Column | Meaning |
| --- | --- |
| `checkout_intent_id` | Opaque browser-generated key for one active web checkout. Null for legacy and non-web records. |
| `checkout_request_hash` | Server-generated digest of the normalized reviewed variant ids/quantities and accepted tender choices. It is a replay guard, not a money amount. |

Add a partial unique index for `(user_id, checkout_intent_id)` where the order
is a web order, the intent is non-null, and the status is open (`pending` or
`processing`). The index is the database race guard; an insert conflict loads
the existing order and follows its recovery path. Keep existing provider-ref
uniqueness unchanged.

The client creates an opaque intent with the platform UUID facility and keeps
it in the active checkout session. A same-session reload reuses it until the
order is terminal. Editing a line, quantity, promo or points choice clears the
old intent and creates a new one. The server never trusts a client amount: it
normalizes the ids and choices, re-reads the live catalog, and computes the
stored hash after validation.

If the existing order has the same intent and hash, the server returns its
recorded invoice or a settling response. If the hash differs, it refuses to
reuse the old order and the client must submit the new intent. A terminal order
is never returned as an active checkout.

### Make the provider call single-flight and recoverable

The first request that wins the intent race owns Draft Order creation. It moves
the local order into the existing `processing` state before the provider call;
another request for the same open intent returns the existing invoice when its
reference is present, or the new wire-level settling outcome when creation is
still in flight. It never calls Shopify a second time merely because the first
HTTP response has not arrived.

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
must never create a replacement draft for the same intent. Provider lookup and
the tag/query support are staged against the real shop before the feature is
enabled; a dashboard/API limitation is a release blocker, not a fallback to
duplicate creation.

Use the existing `next_attempt_at`/reconcile claim machinery for abandoned
`processing` rows. A lost response with no immediately recoverable draft stays
pending/settling and is observable; reconciliation retries a provider read or
the correlation lookup and applies the same guarded transition used by
webhooks. No browser retry bypasses that ladder.

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
yet. Both `createCheckout` and the operator-only test procedure use the same
result mapping. The shared frontend checkout resolution maps it to the existing
settling presentation and refreshes the order; it does not fabricate a
checkout URL or expose a provider secret.

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
transition. The confirmation return is a configured Shopify/staging surface
that links to the Grade10 order route; it is not a page-return signal that
clears the cart.

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
          ├──< store.order_items
          ├── payment_checkout_ref ── Shopify Draft Order / invoice
          ├── payment_ref ─────────── Shopify paid order
          └── payment_events / order_events
```

`checkout_intent_id` is an active web-correlation key, not a provider id. The
provider references remain the settlement and reconciliation keys. Existing
POS, external and legacy web rows remain valid with null intent columns.

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
```

The operator test procedure accepts the same intent field but keeps its
existing member/email selection and sandbox authorization. No guest procedure
is added to the public storefront contract.

### Provider port

The Shopify draft port adds a lookup operation that returns the existing draft
or an explicit not-found/ambiguous/error answer. The adapter maps a recovered
draft through the same `ProviderCheckoutOutcome` path as a successful create,
so reference recording and URL checks have one implementation.

## Risks / Trade-offs

- **Shopify draft search is an external dependency.** The correlation tag and
  lookup are verified in staging; inability to search uniquely blocks launch.
- **A hosted invoice is a bearer URL.** Grade10 records it only after the
  local order is bound and never logs or stores a client payment secret.
- **A provider call can succeed after the worker times out.** The local order
  remains recoverable, the next attempt reads the correlation, and a second
  create is forbidden.
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
   tag behavior, webhook topics, carrier service and confirmation return.
4. Run the real staging walkthrough for the four journeys, including repeated
   Pay, response-loss recovery, sold-out refusal, missed webhook, served and
   unsupported destinations, and the HKD 120,000 identity gate.
5. Enable the public staging path only after the manual suite is reviewed and
   the observed provider behavior matches the requirements. Production
   enablement remains an explicitly authorized release operation.
6. Roll back by disabling the new storefront path and deploying the previous
   worker; retain the additive columns and recorded legacy orders. Do not drop
   columns or delete provider drafts as part of rollback.

## Open Questions

None that change the requirements or implementation order. The exact Shopify
Admin dashboard labels and credentials are release-time operational details;
the staging walkthrough must prove the selected configuration before launch.
