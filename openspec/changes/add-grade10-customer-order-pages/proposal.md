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
- Add an owner-only order detail surface at `/profile/orders/<order-id>`, composed
  from the existing shared Order Details block and the current Store order read.
- Integrate both pages through `@grade10/store-frontend`; the Grade10
  application does not call the Store transport or Shopify directly.
- Derive every displayed badge from `grade10-site/store/order-status`, and keep
  quoted, paid, refunded, fulfilment, and delivery facts distinct.
- Prefer the Store-supplied shop order number in customer-facing order labels,
  while keeping the immutable Store order id as the route and action key.
- Present the supplied discount, points credit, shipping charge, tax, shipping
  address, and payment instrument on the owner-only detail without turning
  absent values into zeroes, empty sections, or guessed facts. Points credit
  stays a separate summary row after Discount, matching the cart drawer.
- Open a valid carrier tracking URL from either page when the order is
  trackable, and never invent a tracking action from a carrier number alone.
- Let the shared Order Details block omit payment, address, loyalty, delivery,
  summary, or individual money rows that the typed order contract does not
  supply, and render partial addresses or unrecognized payment methods without
  requiring invented display data.
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
  tokens. Shared UI changes remain backwards-compatible extensions to optional
  detail data.
- Adding a secondary status-note slot to either shared order block.
- Guest order lookup, customer-initiated cancellation, refund, return, or
  address editing.
- Displaying a product image or loyalty amount before the typed Store order
  contract supplies that fact, or inventing a pickup address from the supplied
  shipping address.
- Changing the cart drawer's applied Points label to include the points count;
  Order Details owns that count-in-label treatment for this change.

## Capabilities

### New Capabilities

- `grade10-site/store/order-history`: the signed-in customer order list,
  Active/Past composition, empty and failure states, and navigation to tracking
  or one order.
- `grade10-site/store/order-detail`: owner-only rendering of one order's
  identity, items, supplied settlement breakdown, shipping address, payment,
  refunds, fulfilment, and tracking facts.
- `shared/ui/store-order-detail`: the reusable Order Details block and its
  optional data sections, including partial addresses and payment methods with
  or without a recognized brand logo.

### Modified Capabilities

None.

## Impact

- `apps/frontend/grade10`: two session surfaces, route modules, profile and
  order navigation, page composition, catalog use, and focused browser tests.
- `packages/grade10-store/frontend`: customer-order presentation models and
  adapters over the typed `listOrders` and `getOrder` procedures, with fixture
  and hook coverage.
- `packages/ui`: a backwards-compatible optional-section, partial-address, and
  payment-fallback contract for the existing Order Details block, with stories
  and component tests.
- Grade10 catalogs in this store: customer-order copy for `en`, `zh-Hant`, and
  `zh-Hans`.
- `docs/prds/products/grade10-site/store/order-history.md` and
  `docs/prds/products/grade10-site/store/order-detail.md`: settled addresses
  and current in-flight capability links.

This change contains no backend or admin implementation task. Frontend tests
exercise the typed Store contract through fixtures; live integration evidence
belongs to the Grade10 application delivery, not to this planning store.

## References

- [Order Details · Order Summary](../../../docs/prds/products/grade10-site/store/order-detail.md#order-summary)
  — points credit row after Discount, with the deducted count in the label.

## Follow-on changes

- Show the deducted points count on the cart drawer's applied Points row, so cart
  and order detail share the same label shape.
