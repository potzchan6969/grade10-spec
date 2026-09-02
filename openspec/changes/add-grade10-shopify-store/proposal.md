# Add a Shopify-backed Grade10 Store

**Author:** @htonyl - 2026-08-17

Product context: [Grade10 foundation](../../../docs/prds/products/grade10-store/index.md).

## Why

Grade10 customers can discover Store, but Store has no product contract for a
catalogue, checkout, or an order after checkout. Shopify already owns the
catalogue and can authoritatively report stock, payment, and fulfilment. The
Store must use those facts without creating a second catalogue or treating a
browser's price, payment, or shipping claim as authoritative.

## Expected outcome

- A shopper can browse Shopify products, see their current availability, and
  begin a Shopify-hosted checkout on the account they are signed in to.
- A shopper returns to the store through Continue shopping after payment and
  can browse every current and historic order in their Grade10 account.
- The Store renders its order lifecycle from Shopify's payment and shipping
  facts, including when webhooks are delayed or lost.
- Shopify remains the source of truth for products, inventory, charged money,
  and shipment progress; the Store remains the source of truth for its local
  order and customer experience.

## Scope

- A new `grade10-site/store/shopify-commerce` capability defining catalogue,
  availability, account association, checkout handoff, payment, and
  shipping-status behavior.
- Read-only Shopify Storefront API catalogue and availability reads, with
  cache-safe browsing and live revalidation before checkout.
- Shopify checkout creation with no inventory hold, server-side order
  creation, and Continue shopping back to the store after hosted checkout.
- Verified Shopify Admin API reads and webhooks for payment, cancellation,
  refund, fulfilment, tracking, and shipment state; reconciliation repairs
  missed events.
- Signed-in checkout identity, guest checkout by email (launching with it
  `TBC`), customer-facing order history/detail, and the Grade10 admin order
  view.

## Affected consumer applications and contracts

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10-store` | Uses the Store catalogue, checkout, and order-status contracts; it never calls Shopify directly. |
| `apps/backend/grade10-site/store` | Owns the Store API, local orders, webhook endpoint, and reconciliation schedule; it binds Shopify credentials server-side. |
| `apps/admin/grade10` | Reads the same Store order and shipping-status projection for support; it does not edit Shopify inventory, payment, or fulfilment data. |
| `@grade10/shopify-contracts` / `@grade10/shopify-backend` | Adds the typed Shopify product, customer, checkout, payment, and fulfilment reads needed by the Store boundary. |
| `@grade10/store-contracts` / `@grade10/store-backend` | Exposes the Store-facing catalogue, checkout, and order-status contract while preserving provider-neutral order state. |

No shared UI or design-system export changes are proposed.

## Non-goals

- Customer profile synchronization beyond the one-to-one account association,
  or a new sign-in method beyond Grade10's Google and email magic-link sign-in.
- A product, inventory, price, payment, or shipping mirror in Postgres.
- Embedded Shopify checkout, saved cards, manual payment capture, or a second
  payment provider in this delivery.
- Backorders, or an inventory hold of any length before payment.
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
least scopes needed for catalogue reads, customer association, checkouts,
payment, and fulfilment reads, plus separate Storefront, Admin, and webhook
credentials. Missing or invalid credentials fail Store integration reads loudly
rather than falling back to a different source.

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Net sales | Shopify-confirmed settled payment amounts less Shopify-confirmed refund amounts, reported separately for each transaction currency. | Product and finance |

## Validation

- Feature tests cover catalogue availability,
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
