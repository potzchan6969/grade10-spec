## Context

See [proposal.md](proposal.md) for the product reason. The current Grade10
application has session-gated checkout and profile routes, but no customer
order routes. `@grade10/store-frontend/checkout` already exposes `useOrders`
and `useOrder` over the typed `checkout.listOrders` and `checkout.getOrder`
reads.

The wire order already carries id, lifecycle status, origin, currency, quoted
subtotal, eligible goods, paid total, refunded amount, fulfilment status,
fulfilments, timestamps, and line items. The frontend `Order` model currently
drops fulfilment fields because its mapper returns the DTO through a narrower
type. It carries no payment method, address, discount, shipping charge, tax,
product image, or loyalty amount.

`@grade10/ui` already exports both page blocks. `OrderHistory` accepts supplied
active and past lists. `OrderDetails` can omit delivery, address, and loyalty,
but currently requires summary and payment even when the source order has
neither.

## Goals / Non-Goals

**Goals:**

- Keep route and state composition in the Grade10 app and order reads in the
  existing store frontend feature.
- Project only typed order facts into shared UI props.
- Preserve owner privacy by treating a null order as not found.
- Keep each page testable with frontend fixtures and an injected procedure
  client.

**Non-Goals:**

- Adding or changing a Store procedure, provider read, database record, webhook,
  or reconciliation path.
- Reorganizing the existing checkout feature solely to rename order reads.
- Adding a second order-status mapping inside either page.

## Decisions

### Add two explicit session surfaces

Add `orderHistory` at `/profile/orders` and `orderDetail` at
`/store/orders/:orderId` to `apps/frontend/grade10/src/surfaces.ts`, then add one
route module per surface. Both modules compose the existing `SessionDecided`
boundary. The parameterized detail route is registered before the broader Store
route, following the existing product-detail route.

The route modules own browser effects: app navigation and opening a carrier URL.
The page components receive callbacks, so they remain renderable in focused
tests without `window`.

**Alternative rejected:** nest Your Orders inside the current profile page.
That leaves no stable order-list address and couples two independently loading
surfaces.

### Keep one typed order read path

Extend the existing frontend `Order` model and explicit mapper with the
fulfilment fields already present on `StoreOrder`. Keep `useOrders` and
`useOrder` as the only query hooks; do not add duplicate repositories or
procedures for the pages.

Add pure customer-order projections beside the order presentation layer:

| Projection | Input | Output |
| --- | --- | --- |
| History summary | `Order`, customer badge, localized formatters | `OrderHistoryOrderSummary` |
| Detail props | `Order`, customer badge, localized formatters | `OrderDetailsProps` data |
| Tracking target | tracking URL string or null | safe absolute `https` URL or null |

The status badge comes from `grade10-site/store/order-status`; these pages
consume that frontend rule and do not copy it. Formatting stays at the
application boundary where locale is known. Arithmetic uses minor units before
formatting.

**Alternative rejected:** map the DTO directly in each page. That would hide
wire fields behind the narrower domain type and duplicate money, status, and
tracking decisions.

### Treat absent data as absent UI

Make `summary` and `payment` optional on `OrderDetails`; make payment and every
money row optional on `OrderDetailsSidebar`. The compound omits an absent group
and omits the full sidebar when no sidebar facts remain. Existing consumers
that pass the complete objects keep the same rendering and type compatibility.

The Grade10 detail projection supplies only facts present on `Order`:

- **Lines:** title, quantity, captured unit price, and derived line total.
- **Money:** quoted subtotal when non-null, paid total when non-null, and refund
  when positive.
- **Fulfilment:** status, display status, estimated delivery, and tracking.

No generic card brand, zero subtotal, empty line, delivery event, or product
image stands in for a missing fact.

**Alternative rejected:** pass a generic payment label to satisfy the current
required prop. It would present checkout origin as a payment method the Store
does not know.

### Validate tracking before exposing an action

Parse a supplied tracking target once in a pure frontend helper. Accept only an
absolute `https` URL with no username or password. The route callback opens it
with a new browsing context and `noopener,noreferrer`. Invalid, relative,
credential-bearing, or absent URLs return null; carrier names and tracking
numbers remain display data only.

**Alternative rejected:** build carrier URLs from tracking numbers. Carrier URL
formats and regional hosts are not a Grade10 contract.

### Keep query states outside the shared blocks

Pages render `Skeleton` while the first query is pending, a localized error and
Retry action when it fails, and the shared page block only after success. A
successful null detail renders the site's not-found treatment. History passes
empty arrays to `OrderHistory` only after a successful empty read.

**Alternative rejected:** teach shared UI blocks about query libraries. Shared
blocks are prop-driven and used by more than this application.

### Localize only application-supplied copy

Add Your Orders, Order Details, pending-total, loading, error, retry, money-row,
fulfilment, tracking, and empty-state copy to the
Grade10 `en`, `zh-Hant`, and `zh-Hans` catalogs. Keep dates and money on the
existing shared formatters; no Korean entries are added because Korean is a ZZZ
locale.

## Risks / Trade-offs

- **[Risk] The order-status change is revised while these pages are built.** →
  Consume one exported badge and keep raw lifecycle values out of page
  components, limiting any adjustment to the projection boundary.
- **[Risk] A later order contract adds richer detail fields.** → Optional UI
  groups remain additive; a later frontend change can map new typed facts
  without changing these routes or fabricating data now.
- **[Risk] A malformed carrier URL creates an unsafe navigation.** → Centralize
  URL parsing, reject credentials and non-HTTPS schemes, and test the browser
  flags at the route boundary.
- **[Risk] A null owner read is mistaken for a transport failure.** → Keep null,
  error, and pending branches explicit in the detail page tests.

## Migration Plan

1. Land the optional Order Details prop and Grade10 catalog additions in
   `grade10-spec`, with component stories and catalog tests.
2. Advance the Grade10 app's `external/grade10-spec` pointer to that landed
   commit.
3. Extend the frontend order model and projections, then add the two routes and
   pages against fixtures.
4. Roll back by removing the two route registrations and reverting the gitlink;
   existing checkout and owner-scoped reads remain unchanged. No data migration
   or backend rollout is involved.
