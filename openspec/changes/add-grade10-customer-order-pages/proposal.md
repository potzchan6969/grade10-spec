**Author:** @kinisworking - 2026-09-05

## Why

Collectors need a trustworthy account of their Store purchases, with enough
product information to recognise each item. My Orders and Order Details now
exist, but their image frames remain empty because the typed order items and
page projections carry no picture.

Success is measured by the share of paid Store orders whose owner opens My
Orders or an order detail without contacting support for basic fulfilment,
refund, or tracking information. The first delivery establishes the baseline.

**Product pictures** - the cart already receives current product pictures.
The 2026-10-22 scope extension supplies the same product identification on
existing orders.
Measure the share of order lines with an available catalogue picture whose
matching thumbnail loads on each page; controlled browser checks establish
the first baseline without adding production instrumentation.

## What Changes

- Add a signed-in My Orders surface at `/profile/my-orders`, with Active orders
  above Past orders, the designed empty state, loading and recoverable error
  states, and links to one order.
- Add an owner-only order detail surface at `/profile/my-orders/<order-id>`, composed
  from the existing shared Order Details block and the current Store order read.
- Integrate both pages through `@grade10/store-frontend`; the Grade10
  application does not call the Store transport or Shopify directly.
- Show each item's first current product picture on My Orders and Order
  Details, including existing purchases, private order links and the console's
  customer preview. Missing picture facts preserve the existing placeholder;
  a failed picture lookup does not fail the order read.
- Preserve compatible order responses without picture fields, meaningful
  image alt text, recorded purchase facts and existing access checks.
- Derive every displayed badge from `grade10-site/commerce/order-status`, and keep
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

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/store/order-history`: the signed-in customer order list,
  Active/Past composition, empty and failure states, and navigation to tracking
  or one order, with current product pictures when supplied.
- `grade10-site/store/order-detail`: owner-only rendering of one order's
  identity, items, supplied settlement breakdown, shipping address, payment,
  refunds, fulfilment, tracking facts and supplied current product pictures.
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
  and hook coverage; picture fields reach both customer page projections.
- `packages/grade10-store/backend` and `packages/grade10-store/contracts`:
  compatible optional picture facts on order items, supplied through existing
  catalogue reads after access checks. Reuse one shared enrichment path for
  member reads, order lists, private links and the existing admin preview.
- `packages/ui`: a backwards-compatible optional-section, partial-address, and
  payment-fallback contract for the existing Order Details block, with stories
  and component tests.
- Grade10 catalogs in this store: customer-order copy for `en`, `zh-Hant`, and
  `zh-Hans`.
- `docs/prds/products/grade10-site/store/order-history.md` and
  `docs/prds/products/grade10-site/store/order-detail.md`: settled addresses
  and current in-flight capability links.
- `docs/prds/products/shared/ui/store-order-detail.md`: the shared optional
  sections and supplied tracking action used by the customer detail surface.

The thumbnail extension adds backend read enrichment and keeps the existing
admin preview aligned with the customer pages. It adds no admin workflow.
The existing batch variant read already carries the first product picture;
delivery planning must cover deduplicated, bounded batches, lookup failures,
response decoding and images that actually load in the application browser.

## Related Changes

- **Order links** - `add-store-guest-checkout` owns private-link access and
  joining guest orders. This extension supplies pictures only after those
  checks; it adds no access or points entitlement.
- **Order status** - the durable spec `grade10-site/commerce/order-status` owns the badge mapping.
- **Cart pictures** - `add-store-cart-thumbnails` owns cart enrichment and
  rendering. Its first-current-product-picture rule is reused for orders;
  its persistence and review behavior stay in that change.
- **Points credit** - `name-points-discount-deduction` retains the points
  label scope. Thumbnails alter no summary amount or label.

## Planning Handoff

No domain impact: the thumbnail extension preserves the existing history-to-detail
route. Feature suites own its picture observations; the Store domain suite
introduces no new cross-capability path for this additive display data.

No platform impact: order access, account joining and checkout remain with
their existing owners; thumbnail supply adds no path between products.

The thumbnail extension includes independent draft cases, backend read design,
requirement scenarios and unchecked delivery tasks. QA2 reconciles the cases
against whole scenario outcomes. Existing case and scenario identities and
completed task history remain. Acceptance review and publication follow the
planning gates; draft cases claim no execution or human approval.

## References

- [My Orders · Product Pictures](../../../docs/prds/products/grade10-site/store/order-history.md#product-pictures)
  - current product pictures on earlier and new purchases.
- [Order Details · Product Pictures](../../../docs/prds/products/grade10-site/store/order-detail.md#product-pictures)
  - pictures on owned details and private order links.
- [My Orders · Orders](../../../docs/prds/products/grade10-site/store/order-history.md#orders)
  — the private address, Active and Past groups, order actions and empty account.
- [Order Details · Order](../../../docs/prds/products/grade10-site/store/order-detail.md#order)
  — the owner-only address, supplied facts and fulfilment actions.
- [Order Details · Order Summary](../../../docs/prds/products/grade10-site/store/order-detail.md#order-summary)
  — points credit row after Discount, with the deducted count in the label.
- [Order Details Blocks · Optional Sections](../../../docs/prds/products/shared/ui/store-order-detail.md#optional-sections)
  — reusable supplied facts, honest omission and callback-owned tracking.

## Follow-on changes

- Show the deducted points count on the cart drawer's applied Points row, so cart
  and order detail share the same label shape.
