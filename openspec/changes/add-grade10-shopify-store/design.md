# Design: Shopify-backed Grade10 Store

Capability delta: [`grade10-site/store/shopify-commerce`](specs/grade10-site/store/shopify-commerce/spec.md).
Product context: [Grade10 foundation](../../../docs/prds/products/grade10-store/index.md).

## Authority and data flow

```text
Grade10 Store browser
  -> Store API -> Shopify Storefront API: catalogue, variant availability
  -> Store API -> Shopify Admin API: customer association, draft-order invoice URL, no reservation
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

## Checkout and order identity

Checkout runs on the Grade10 session, reached through Google or email magic
link. The browser supplies variant identifiers and quantities; the Store
re-prices them live, opens the pending order for the signed-in account, and
creates one idempotent Shopify draft order: lines as variant and quantity only,
the paired Shopify customer as purchasing entity, and every discount the order
earns — points, coupons, a gift — as applied discounts and discount codes.
Nothing is reserved: Shopify sells the stock until payment, and the Store does
not support backorders.

Guest checkout by a typed email is built beside it: a known email is answered
with sign-in required, and any other gets one Shopify customer before checkout
and a Grade10 account linked to it after payment. Whether the storefront
offers it at launch is `TBC`.

The Store records the local order and draft order reference before it returns
the draft's invoice URL, Shopify's hosted checkout. Shopify revalidates stock and
payment at its page; an item that sold out in between is refused there, named,
and the buyer starts again.

After Shopify confirms payment, its confirmation page offers Continue shopping,
which returns the buyer to the store; the order waits in Your Orders. The
permanent order URL is only an address: it grants no access without the
matching Grade10 authenticated session. Shopify owns shipping-address collection, shipping options, tax,
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
- Shopify's hosted checkout does not redirect on its own: Continue shopping on
  its confirmation page is the way back, so a paid order must be findable from
  Your Orders without a redirect.

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

### Use a Storefront cart for checkout

Rejected: a cart cannot name the paired customer or carry a merchant-applied
discount, so points and per-line coupons could not ride on it. A draft order
carries all of them and its invoice is the hosted checkout.

### Hold finite stock for fifteen minutes on the draft order

Rejected: no hold is wanted, and the code does not do one easily. Shopify's
own check at payment is the last word on stock.

## Validation approach

Use Shopify transport fixtures behind the real Store adapters. Test the public
Store contract independently from raw Shopify GraphQL payloads, then test the
worker webhook route with a valid signature, invalid signature, duplicate event,
and a delayed/missed event repaired by a status read or reconciliation pass.
Run the backend, frontend, and admin feature lanes that consume this contract,
then run the OpenSpec validation named in the proposal.
