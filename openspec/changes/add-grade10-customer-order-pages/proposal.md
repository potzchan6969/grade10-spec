**Author:** @kinisworking - 2026-09-05

## Why

A signed-in collector can complete the Store checkout, but the Grade10 site has
no customer route that renders the order list or one order. Owner-scoped order
reads and the shared order blocks already exist; the missing work is the
customer-facing composition and frontend integration.

Success is measured by the share of paid Store orders whose owner opens Your
Orders or an order detail without contacting support for basic fulfilment,
refund, or tracking information. The first delivery establishes the baseline.

## What Changes

- Add a signed-in Your Orders surface at `/profile/orders`, with Active orders
  above Past orders, the designed empty state, loading and recoverable error
  states, and links to one order.
- Add an owner-only order detail surface at `/store/orders/<order-id>`, composed
  from the existing shared Order Details block and the current Store order read.
- Integrate both pages through `@grade10/store-frontend`; the Grade10
  application does not call the Store transport or Shopify directly.
- Derive every displayed badge from `grade10-site/store/order-status`, and keep
  quoted, paid, refunded, fulfilment, and delivery facts distinct.
- Open a valid carrier tracking URL from either page when the order is
  trackable, and never invent a tracking action from a carrier number alone.
- Let the shared Order Details block omit payment, address, loyalty, delivery,
  summary, or individual money rows that the current typed order contract does
  not supply.
- Add all page, state, action, and order-field copy to the Grade10 English,
  Traditional Chinese, and Simplified Chinese catalogs.
- Update the Orders product record with the two settled addresses and the
  current Order Details Figma frame.

## Non-Goals

- Implementing or changing Store backend procedures, database tables,
  Shopify reads, webhooks, reconciliation, deployment, or environment setup.
- Building an admin order surface or changing any admin order workflow.
- Changing checkout, cart, discount, shipping-rate, tax, payment, refund, or
  return behavior.
- Defining the order-status mapping; `add-store-order-status` owns that
  customer-facing rule.
- Redesigning the shared order blocks, the design system, Figma components, or
  tokens. The only shared UI change is making unavailable detail sections
  optional.
- Adding a secondary status-note slot to either shared order block.
- Guest order lookup, customer-initiated cancellation, refund, return, or
  address editing.
- Displaying a payment method, shipping or pickup address, discount, shipping
  charge, tax, product image, or loyalty amount before the typed Store order
  contract supplies that fact.

## Capabilities

### New Capabilities

- `grade10-site/store/order-history`: the signed-in customer order list,
  Active/Past composition, empty and failure states, and navigation to tracking
  or one order.
- `grade10-site/store/order-detail`: owner-only rendering of one order's
  items, quoted and paid money, refunds, fulfilment, and tracking facts.
- `shared/ui/store-order-detail`: the reusable Order Details block and its
  optional data sections, so an application can omit facts it does not hold.

### Modified Capabilities

None.

## Impact

- `apps/frontend/grade10`: two session surfaces, route modules, profile and
  order navigation, page composition, catalog use, and focused browser tests.
- `packages/grade10-store/frontend`: customer-order presentation models and
  adapters over the typed `listOrders` and `getOrder` procedures, with fixture
  and hook coverage.
- `packages/ui`: a backwards-compatible optional-section contract for the
  existing Order Details block, with stories and component tests.
- Grade10 catalogs in this store: customer-order copy for `en`, `zh-Hant`, and
  `zh-Hans`.
- `docs/prds/products/grade10-site/store/orders.md`: settled addresses and
  current in-flight capability links.

This change contains no backend or admin implementation task. Frontend tests
exercise the typed Store contract through fixtures; live integration evidence
belongs to the Grade10 application delivery, not to this planning store.
