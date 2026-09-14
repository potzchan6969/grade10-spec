## Context

See [proposal.md](proposal.md) for the product reason. The feature branch now
has session-gated customer order routes composed over
`@grade10/store-frontend/checkout`'s `useOrders` and `useOrder` hooks. Those
hooks use the typed `checkout.listOrders` and `checkout.getOrder` reads.

The typed buyer order now carries id, shop order number, lifecycle status,
origin, currency, quoted subtotal, eligible goods, discount, shipping charge,
tax, paid total, refunded amount, fulfilment status, fulfilments, shipping
address, payment instrument, timestamps, and line items. The frontend `Order`
model still exposes the earlier subset, so TypeScript permits the decoded
`StoreOrder` to pass through the repository while the new fields disappear at
the domain and presentation boundaries. The typed buyer order still carries no
product image or loyalty amount.

`@grade10/ui` already exports both page blocks. `OrderHistory` accepts supplied
active and past lists. The completed optional-section work lets `OrderDetails`
omit summary, delivery, payment, address, and loyalty, but its address type
still requires a recipient name and its payment type still requires a
recognized brand.

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
`/profile/orders/:orderId` to `apps/frontend/grade10/src/surfaces.ts`, then add
one route module per surface. Both modules compose the existing
`SessionDecided` boundary. The parameterized detail route is registered before
the broader profile routes, following the existing product-detail route.

The route modules own browser effects: app navigation and opening a carrier URL.
The page components receive callbacks, so they remain renderable in focused
tests without `window`.

**Alternative rejected:** nest Your Orders inside the current profile page.
That leaves no stable order-list address and couples two independently loading
surfaces.

### Keep one typed order read path

Align the existing frontend `Order` model with the buyer fields these pages
consume: `orderName`, `discountAppliedMinor`, `shippingMinor`, `taxMinor`,
`shippingAddress`, and `paymentInstrument`. Reuse the exported
`StoreShippingAddress` and `StorePaymentInstrument` value types. Keep the
repository's direct decoded return, `useOrders`, and `useOrder`; do not restore
an identity mapper or add duplicate repositories or procedures.

Add pure customer-order projections beside the order presentation layer:

| Projection | Input | Output |
| --- | --- | --- |
| History summary | `Order`, customer badge, localized formatters | `OrderHistoryOrderSummary` |
| Detail props | `Order`, customer badge, localized formatters | `OrderDetailsProps` data |
| Customer order label | shop order number and Store id | non-empty shop order number or Store id |
| Shipping address | typed shipping address | optional `OrderDetailsAddress` |
| Payment method | typed payment instrument | optional `OrderDetailsPayment` |
| Tracking target | tracking URL string or null | safe absolute `https` URL or null |

The status badge comes from `grade10-site/store/order-status`; these pages
consume that frontend rule and do not copy it. Formatting stays at the
application boundary where locale is known. Arithmetic uses minor units before
formatting. Both pages display a trimmed, non-empty `orderName` when supplied
and otherwise the Store id, but maps, callbacks, and routes remain keyed by the
Store id. Change the catalog templates from `Order #{id}` to `Order {id}` so a
provider value such as `#G10-10482` does not acquire a second prefix.

**Alternative rejected:** map the DTO directly in each page. That would hide
wire fields behind the narrower domain type and duplicate money, status, and
tracking decisions.

### Treat absent data as absent UI

Keep the existing optional summary, payment, money-row, and sidebar behavior.
The compound continues to omit an absent group and the full sidebar when no
sidebar facts remain. Existing consumers that pass complete objects keep the
same rendering and type compatibility.

The Grade10 detail projection supplies only facts present on `Order`:

- **Lines:** title, quantity, captured unit price, and derived line total.
- **Money:** quoted subtotal, discount, points credit, shipping, tax, and paid
  total when each is non-null, plus refund when positive. Format discount,
  points, and refund as deductions; normalize a zero deduction before
  formatting so it does not become negative zero. Pass points on
  `OrderDetailsSummary.points` separately from `discount` so the sidebar can
  keep the cart-drawer Points line.
- **Address:** join the supplied first and last names only when present, then
  render non-empty street, locality, country, and phone lines in postal order.
  Keep the address on the owner-only detail and never project it into history.
- **Payment:** omit a null or all-null instrument. When `wallet` is supplied,
  derive a known wallet brand from it and do not fall back to a card logo;
  retain the wallet identity beside any mask. Without a wallet, normalize
  known Visa, Mastercard, and American Express values to their shared logo.
  For every other value, use the first non-empty company or provider method as
  a text label beside the supplied mask.
- **Fulfilment:** status, display status, estimated delivery, and tracking.

Null discount, shipping, tax, address, and payment values remain absent. A
supplied numeric zero remains a visible statement. No generic card brand, zero
subtotal, empty line, pickup address, delivery event, product image, or loyalty
value stands in for a missing fact.

Extend `OrderDetailsAddress.name` to be optional. Extend
`OrderDetailsPayment` so `brand`, `label`, and `maskedNumber` are independently
optional, and omit an all-empty payment section. The shared sidebar renders a
logo only for a supplied recognized brand and renders a supplied label without
requiring a logo. Existing consumers that provide `name` and `brand` remain
source-compatible.

**Alternative rejected:** map every unknown provider to a generic or nearest
card logo. That would turn incomplete provider data into a claim the Store did
not make and can mislabel a wallet's device-account digits as a card number.

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

Add Discount, Shipping, and Tax money-row copy, and update the order-label
template, in the Grade10 `en`, `zh-Hant`, and `zh-Hans` catalogs. Keep dates,
money, provider names, and masks on the existing formatters or supplied data;
no Korean entries are added because Korean is a ZZZ locale.

## Risks / Trade-offs

- **[Risk] The order-status change is revised while these pages are built.** →
  Consume one exported badge and keep raw lifecycle values out of page
  components, limiting any adjustment to the projection boundary.
- **[Risk] A later order contract adds richer detail fields.** → Optional UI
  groups remain additive; a later frontend change can map new typed facts
  without changing these routes or fabricating data now.
- **[Risk] Older orders and ingestion arms carry null or partial settlement
  facts.** → Test null separately from numeric zero and let each address or
  payment part render independently.
- **[Risk] Provider payment names do not match the shared brand union.** → Keep
  normalization explicit and case-insensitive, then fall back to supplied text
  without a guessed logo.
- **[Risk] Shipping address and payment data escape the owner surface.** → Keep
  both projections detail-only, exclude them from logs and analytics, and rely
  on the existing owner-scoped read and not-found treatment.
- **[Risk] A malformed carrier URL creates an unsafe navigation.** → Centralize
  URL parsing, reject credentials and non-HTTPS schemes, and test the browser
  flags at the route boundary.
- **[Risk] A null owner read is mistaken for a transport failure.** → Keep null,
  error, and pending branches explicit in the detail page tests.
- **[Risk] The buyer read shape drifts again before implementation.** → Compile
  frontend fixtures against `StoreOrder` and keep the domain model structurally
  aligned with the decoded contract.

## Migration Plan

1. Land the widened Order Details address and payment contract plus Grade10
   catalog additions in `grade10-spec`, with component stories and catalog
   tests.
2. Advance the Grade10 app's `external/grade10-spec` pointer to that landed
   commit.
3. Align the frontend order model, fixtures, and projections, then pass the new
   optional props through the existing history and detail pages.
4. Land the separate `add-store-order-status` dependency before claiming the
   customer pages complete; this change continues to consume that capability
   rather than defining a temporary status rule.
5. Roll back the rich-field presentation by reverting the app projections and
   gitlink together; the existing owner-scoped reads remain unchanged. No data
   migration or backend rollout is involved.
