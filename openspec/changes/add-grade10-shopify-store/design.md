# Design: Shopify-backed Grade10 Store

Capability delta: [`grade10-site/store/shopify-commerce`](specs/grade10-site/store/shopify-commerce/spec.md).
Product context: [Grade10 foundation](../../../docs/prds/products/grade10-store/index.md).

## Authority and data flow

```text
Grade10 Store browser
  -> Store API -> Shopify Storefront API: catalogue, variant availability
  -> Store API -> Shopify Admin API: customer association, draft-order checkout URL, 15-minute reservation
  -> Store API -> Store Postgres: local order, customer-visible lifecycle
  -> Shopify hosted checkout
Shopify Admin API + verified webhooks -> Store API -> local order events/status
```

Shopify is authoritative for product publication, current variant availability,
checkout totals, payment, refunds, and fulfilment/tracking. Store Postgres is
authoritative only for the Store's order identity, request idempotency, and its
auditable projection of those external facts. It never becomes a catalogue,
inventory, payment, or shipping database.

The Storefront API is used for shopper-safe reads. The Admin API is server-only
and used for customer association, draft-order creation, order/payment and
fulfilment reads, staff refunds, webhook registration, and reconciliation.
Neither token can reach the browser.

## Catalogue and availability

Public catalogue reads may use short-lived tagged edge cache. Product changes
purge those tags via verified Shopify product webhooks; expiry bounds the stale
window when a purge is missed. A cache is display-only: checkout resolves every
requested variant from Shopify live, checks that it remains purchasable in the
requested quantity, and prices it from that response before an order is made.

The Store exposes display-ready products, variants, price/currency, media, and
availability rather than Shopify's raw GraphQL shapes. A removed, unpublished,
or unavailable variant is omitted or marked unavailable in browsing, and is
always refused at checkout. Shopify API/shape failures are explicit unavailable
or integration failures, never fabricated stock or price data.

## Checkout, reservation, and order identity

Before hosted checkout, the browser supplies an email, variant identifiers, and
quantities. If the email is already attached to a Grade10 account, the Store
requires Grade10 magic-link sign-in before handoff and uses the existing linked
Shopify customer. Otherwise it creates one guest Shopify customer before
checkout, after confirming that no Grade10 account uses that email, then creates
one idempotent Shopify draft order with a fifteen-minute inventory reservation.
Every finite-stock line must reserve successfully; the Store does not support
backorders or extend an expired reservation.

The Store records the local order and Shopify draft-order reference before it
returns Shopify's secure hosted checkout URL. Shopify revalidates stock and
payment at checkout. A reservation expires automatically after fifteen minutes;
the buyer must start checkout again, and the Store reports an unavailable item
if it can no longer reserve it.

After Shopify confirms payment, the Store creates and links the Grade10 account
for that guest Shopify customer when needed, sends Grade10's email magic link,
and returns the buyer to that account's order page. The permanent order URL is
only an address: it grants no access without the matching Grade10 authenticated
session. Shopify owns shipping-address collection, shipping options, tax,
discounts, and final totals. The Store's pre-check total is never represented
as the amount paid.

## Payment and shipping projection

Verified `orders/paid`, cancellation, refund, and fulfilment events are
normalized into idempotent provider events and advance the local order only
through valid lifecycle transitions. A status read and scheduled reconciliation
also query Shopify Admin by the stored reference, so correctness does not depend
on webhook delivery.

The customer-facing projection separates payment (`pending`, `paid`, `failed`,
`cancelled`, `refunded`) from shipping (`not_ready`, `unfulfilled`,
`partially_fulfilled`, `fulfilled`, `shipped`, `delivered`, when Shopify reports
the corresponding fact). It includes each Shopify-reported fulfilment, carrier,
tracking number, tracking URL, and delivered state, without inventing a delivery
estimate. A delivery state is shown only when Shopify reports carrier
confirmation. A payment settlement alone does not make an order shipped.

Staff initiate any valid refund through Shopify. The Store observes its
Shopify-reported result in payment status. Customer disputes, their evidence,
staff adjudication, and detailed payment lifecycle are separate follow-on
capabilities.

## Security and operational boundaries

- Verify the Shopify webhook HMAC over the raw request body before parsing or
  making any external call; store `(provider, eventId)` once to deduplicate.
- Require an authenticated Grade10 user to view only their own local orders;
  staff/admin access uses the existing admin authorization boundary.
- Treat all Shopify Admin and Storefront requests as server-side integration
  calls. Log the operation name and safe identifiers, never tokens, addresses,
  card data, or raw webhook bodies.
- API version, shop domain, Storefront token, Admin token, and webhook secret
  are environment-specific configuration. Startup/configuration validation
  names an absent setting and prevents a partial integration.
- The checkout-return mechanism is verified against the selected Shopify plan
  and enabled checkout capabilities before release; a Shopify-hosted success
  page must not leave a paid buyer without the Grade10 order-page route.

## Alternatives considered

### Mirror Shopify data into Store Postgres

Rejected: a product/inventory/order mirror adds a second system of record and
sync race conditions. Tagged browse caching and live checkout revalidation give
responsive browsing without permitting a cache to set a charge or stock fact.

### Trust Shopify webhooks as the only lifecycle source

Rejected: event delivery is an optimization, not a correctness boundary. A
status read and scheduled reconciliation repair delayed, failed, and deleted
subscriptions.

### Let the storefront call Shopify directly

Rejected: it exposes integration behavior and permits the browser to choose
unvalidated checkout inputs. The Store boundary keeps authorization,
idempotency, price/availability checks, and customer-order access in one place.

### Treat paid as shipped

Rejected: payment and fulfilment are independently reported facts. Combining
them misleads customers and removes support's ability to diagnose a paid but
unfulfilled order.

### Use a Storefront cart for finite-stock checkout

Rejected: a cart describes intended merchandise but does not make the required
fifteen-minute finite-stock hold. A Shopify draft order supplies a reservation
expiry and secure hosted checkout link, so it makes the hold explicit and
recoverable.

## Validation approach

Use Shopify transport fixtures behind the real Store adapters. Test the public
Store contract independently from raw Shopify GraphQL payloads, then test the
worker webhook route with a valid signature, invalid signature, duplicate event,
and a delayed/missed event repaired by a status read or reconciliation pass.
Run the backend, frontend, and admin feature lanes that consume this contract,
then run the OpenSpec validation named in the proposal.
