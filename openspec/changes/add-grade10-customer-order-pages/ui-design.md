## Screens

### Your Orders — filled

[Order history, filled — Product / Order](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1534&m=dev)

### Your Orders — empty

[Order history, empty — Product / Order](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4923-3424&m=dev)

### Order Details

**Source of truth:** Storybook —
`Store/Order Detail/Blocks/OrderDetailsSidebar/WithPointsCredit` and
`WithoutPointsCredit`, and the composed
`Store/Order Detail/Blocks/OrderDetails/WithPointsCredit`.

[Order Details — Product / Order](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1654&m=dev)
is historical reference only; it does not show the Points credit row and is not
layout authority for this surface going forward.

The cart drawer's applied Points line remains visual parity for success-styled
money credit only; it does not carry the points count in its label for this
change.

### Your Orders - Product Pictures

Keep the existing [Order history frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1534&m=dev)
and [line item component](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4901-3026).
The [filled story](https://storybook.grade10-stg.com/?path=/story/store-order-history-screens-order-history--filled)
is the composed reference, including the existing thumbnail frame.

### Order Details - Product Pictures

Keep the existing [order item component](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=5010-6440)
and [composed detail story](https://storybook.grade10-stg.com/?path=/story/store-order-detail-blocks-orderdetails--item-coupon).
This item reference adds no authority over the sidebar layout described above.
Private links and the existing admin customer preview keep the same item frame.

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

### Thumbnail Extension

- `OrderHistory`, `OrderHistoryLineItem`, and `OrderHistoryLineSummary` already
  accept supplied `imageSrc` and `imageAlt` through the existing line props.
- `OrderDetails`, `OrderDetailsOrderTable`, `OrderDetailsOrderItem`, and
  `OrderDetailsLineItem` already carry the same optional image props.
- [History renderer](../../../packages/ui/src/blocks/store-order-history/order-history-line-item.tsx)
  and [detail renderer](../../../packages/ui/src/blocks/store-order-detail/order-details-order-item.tsx)
  own the current image frame and absent-image placeholder.
- The application supplies the recorded product title when catalogue alt text
  is blank. No new component, variant, token, message key or error treatment
  is required for thumbnails. Controlled loaded-image browser evidence is
  application work; existing story assets are design references only.

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

### Your Orders - Product Pictures

| State | Shows | Anchor |
| --- | --- | --- |
| Available picture | First current product picture in the existing frame, including an earlier purchase | `g10.store-order-history.US5` |
| Blank alt text | Same picture with the recorded item title as its accessible name | `g10.store-order-history.US5` |
| No supplied picture | Existing placeholder beside unchanged purchase facts | `g10.store-order-history.US5` |
| Catalogue lookup fails | Existing placeholder; order items and actions remain usable | `g10.store-order-history.US5` |
| Legacy response | Existing placeholder when optional picture fields are absent | `g10.store-order-history.US5` |
| Image resource fails | Existing browser image presentation; other order facts remain usable | `g10.store-order-history.US5` |

### Order Details - Product Pictures

| State | Shows | Anchor |
| --- | --- | --- |
| Available picture | First current product picture beside the recorded item | `g10.store-order-detail.US7` |
| Blank alt text | Same picture with the recorded item title as its accessible name | `g10.store-order-detail.US7` |
| No supplied picture | Existing placeholder beside unchanged purchase facts | `g10.store-order-detail.US7` |
| Catalogue lookup fails | Existing placeholder; the order remains readable | `g10.store-order-detail.US7` |
| Legacy response | Existing placeholder when optional picture fields are absent | `g10.store-order-detail.US7` |
| Valid private link | Same supplied picture with the private link's existing account-data restrictions | `g10.store-order-detail.US8` |
| Image resource fails | Existing browser image presentation; other order facts remain usable | `g10.store-order-detail.US7` |
| Admin customer preview | Same supplied picture as the existing customer projection | `g10.store-order-detail.US7` |
