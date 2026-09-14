## Screens

### Your Orders — filled

[Order history, filled — Product / Order](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1534&m=dev)

### Your Orders — empty

[Order history, empty — Product / Order](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4923-3424&m=dev)

### Order Details

**Source of truth:** Storybook —
`Store Order Detail/OrderDetailsSidebar/WithPointsCredit` and
`WithoutPointsCredit`, and the composed
`Store Order Detail/OrderDetails/WithPointsCredit`.

[Order Details — Product / Order](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1654&m=dev)
is historical reference only; it does not show the Points credit row and is not
layout authority for this surface going forward.

The cart drawer's applied Points line remains visual parity for success-styled
money credit only; it does not carry the points count in its label for this
change.

## Components

### Your Orders

- `OrderHistory` from `@grade10/ui` — filled and empty page body.
- `OrderHistoryCard`, `OrderHistoryCardHeader`, `OrderHistoryLineItem`, and
  `OrderHistoryStatus` from `@grade10/ui` — existing reusable parts composed by
  the page compound.
- `Breadcrumbs`, `BreadcrumbItem`, and `BreadcrumbSeparator` from
  `@grade10/design-system` — app-owned route context.
- `Skeleton`, `Text`, and `Button` from `@grade10/design-system` — loading and
  recoverable failure states outside the page compound.

### Order Details

- `OrderDetails` from `@grade10/ui` — detail page body.
- `OrderDetailsHeader`, `OrderDetailsDeliveryStatus`,
  `OrderDetailsOrderTable`, `OrderDetailsOrderItem`, `OrderDetailsSidebar`, and
  `OrderDetailsPaymentLogo` from `@grade10/ui` — existing public parts.
- `OrderDetailsSummary.points` — optional money row on the existing summary
  contract; no new export. The consumer supplies the label (including the
  deducted count, e.g. `Points (100 pts)`) and the money value.
- `Breadcrumbs`, `BreadcrumbItem`, and `BreadcrumbSeparator` from
  `@grade10/design-system` — app-owned route context.
- `Skeleton`, `Text`, and `Button` from `@grade10/design-system` — loading,
  recoverable failure, and not-found states outside the detail compound.

`OrderDetails` and `OrderDetailsSidebar` need one backwards-compatible contract
change in `grade10-spec`: summary and payment become optional, each money row
becomes optional (including `points`), and an absent group disappears. No new
component, variant, primitive, or token is required.

## States

### Your Orders

- **Filled active and past** — `grade10-site-store-order-history-SC-01`,
  `grade10-site-store-order-history-SC-03`, and
  `grade10-site-store-order-history-SC-04`.
- **Pending total** — `grade10-site-store-order-history-SC-05`.
- **Trackable and non-trackable** — `grade10-site-store-order-history-SC-07`
  and `grade10-site-store-order-history-SC-08`.
- **Loading** — `grade10-site-store-order-history-SC-09`.
- **Recoverable failure** — `grade10-site-store-order-history-SC-10`.
- **Empty account** — `grade10-site-store-order-history-SC-11`.
- **Sign-in overlay** — `grade10-site-store-order-history-SC-02`.

### Order Details

- **Owned web order** — `grade10-site-store-order-detail-SC-01` and
  `grade10-site-store-order-detail-SC-04`.
- **Not found without disclosure** — `grade10-site-store-order-detail-SC-02`.
- **Partial refund** — `grade10-site-store-order-detail-SC-05`.
- **Point-of-sale order** — `grade10-site-store-order-detail-SC-06`.
- **Unavailable optional groups omitted** —
  `grade10-site-store-order-detail-SC-07`,
  `shared-ui-store-order-detail-SC-04`, and
  `shared-ui-store-order-detail-SC-08` through
  `shared-ui-store-order-detail-SC-10`.
- **Points credit applied** — `grade10-site-store-order-detail-SC-17` and
  `shared-ui-store-order-detail-SC-14` — Points row after Discount; label names
  the deducted count (`Points (100 pts)`); money value uses success credit
  styling. Storybook: `WithPointsCredit`.
- **Points credit absent** — `shared-ui-store-order-detail-SC-15` — Discount
  may show; Points row omitted. Storybook: `WithoutPointsCredit`.
- **Delivery estimate and tracking** — `grade10-site-store-order-detail-SC-08`
  through `grade10-site-store-order-detail-SC-10`.
- **Loading and recoverable failure** —
  `grade10-site-store-order-detail-SC-11` and
  `grade10-site-store-order-detail-SC-12`.
- **Sign-in overlay** — `grade10-site-store-order-detail-SC-03`.
