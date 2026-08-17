# Add a Shopify-backed Grade10 Store

**Author:** @htonyl - 2026-08-17

Product context: [Grade10 foundation](../../../docs/prds/grade10/foundation.md).

## Why

Grade10 customers can discover Store, but Store has no product contract for a
catalogue, checkout, or an order after checkout. Shopify already owns the
catalogue and can authoritatively report stock, payment, and fulfilment. The
Store must use those facts without creating a second catalogue or treating a
browser's price, payment, or shipping claim as authoritative.

## Expected outcome

- A shopper can browse Shopify products, see their current availability, and
  begin a Shopify-hosted checkout with their finite-stock items reserved for
  fifteen minutes.
- A shopper lands on an authenticated Grade10 order page after payment and can
  later browse every current and historic order in their Grade10 account.
- The Store renders its order lifecycle from Shopify's payment and shipping
  facts, including when webhooks are delayed or lost.
- Shopify remains the source of truth for products, inventory, charged money,
  and shipment progress; the Store remains the source of truth for its local
  order and customer experience.

## Scope

- A new `grade10-store/shopify-commerce` capability defining catalogue,
  availability, account association, reserved checkout handoff, payment, and
  shipping-status behavior.
- Read-only Shopify Storefront API catalogue and availability reads, with
  cache-safe browsing and live revalidation before checkout.
- Shopify draft-order checkout creation with a fifteen-minute reservation for
  finite stock, server-side order creation, and a return to the Store's
  authenticated order page after hosted checkout.
- Verified Shopify Admin API reads and webhooks for payment, cancellation,
  refund, fulfilment, tracking, and shipment state; reconciliation repairs
  missed events.
- Guest and signed-in checkout identity handling, customer-facing order
  history/detail, and the Grade10 admin order view.

## Affected consumer applications and contracts

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10-store` | Uses the Store catalogue, checkout, and order-status contracts; it never calls Shopify directly. |
| `apps/backend/grade10/store` | Owns the Store API, local orders, webhook endpoint, and reconciliation schedule; it binds Shopify credentials server-side. |
| `apps/admin/grade10` | Reads the same Store order and shipping-status projection for support; it does not edit Shopify inventory, payment, or fulfilment data. |
| `@grade10/shopify-contracts` / `@grade10/shopify-backend` | Adds the typed Shopify product, customer, draft-order, payment, and fulfilment reads needed by the Store boundary. |
| `@grade10/store-contracts` / `@grade10/store-backend` | Exposes the Store-facing catalogue, checkout, and order-status contract while preserving provider-neutral order state. |

No shared UI or design-system export changes are proposed.

## Non-goals

- Customer profile synchronization beyond the one-to-one account association,
  or a new sign-in method beyond Grade10 email magic links.
- A product, inventory, price, payment, or shipping mirror in Postgres.
- Embedded Shopify checkout, saved cards, manual payment capture, or a second
  payment provider in this delivery.
- Backorders, inventory holds longer than fifteen minutes, or a customer ability
  to extend a reservation.
- Customer-submitted disputes, dispute adjudication, returns, exchanges, or a
  customer ability to request a refund. Staff may initiate refunds in Shopify;
  the Store observes and displays their result.
- Operator edits to Shopify catalogues, inventory, shipping rates, or
  fulfilment from the Grade10 admin portal.
- Loyalty earning, notification delivery, returns policy, exchanges, or
  third-party selling.

## Compatibility and migration

The new Store routes are additive. Existing locally recorded orders retain
their provider and state; they are not silently reinterpreted as Shopify
orders. A deployment requires a per-environment Shopify custom app with the
least scopes needed for catalogue reads, customer association, draft orders,
payment, and fulfilment reads, plus separate Storefront, Admin, and webhook
credentials. Missing or invalid credentials fail Store integration reads loudly
rather than falling back to a different source.

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Net sales | Shopify-confirmed settled payment amounts less Shopify-confirmed refund amounts, reported separately for each transaction currency. | Product and finance |

## Validation

- Feature tests cover catalogue availability, reservation creation/expiry,
  stale-price/stock rejection, checkout handoff, account association, webhook
  verification and deduplication, and reconciliation.
- Customer and admin tests cover pending, paid, cancelled, refunded,
  unfulfilled, partially fulfilled, fulfilled, and tracking-visible orders.
- Run `openspec validate add-grade10-shopify-store` and
  `openspec validate --specs` before implementation begins.

## Follow-on changes

- Store-originated notifications for payment and shipment events.
- Customer-submitted disputes, staff adjudication, and refund policy.
- Detailed payment lifecycle, including failed, cancelled, expired, and
  asynchronous-payment customer states.
- Returns, exchanges, and other post-purchase support actions.
