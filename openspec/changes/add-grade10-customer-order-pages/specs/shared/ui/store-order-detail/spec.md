## Purpose

The shared Order Details block gives store applications one composable and
accessible presentation for the order facts each application can supply.

## Feature set

- Detail composition
  - Public exports: Give applications the compound and reusable parts.
  - Supplied facts: Render header, lines, money, delivery, and optional sidebar groups.
- Optional sections
  - Honest omission: Hide payment, address, loyalty, or delivery when absent.
  - Safe tracking: Report a tracking action only through the supplied callback.

## ADDED Requirements

### Requirement: The order detail surface exports

The shared UI package SHALL export `OrderDetails`, `OrderDetailsHeader`,
`OrderDetailsDeliveryStatus`, `OrderDetailsOrderTable`,
`OrderDetailsOrderItem`, `OrderDetailsSidebar`, and
`OrderDetailsPaymentLogo` from its public entry. It SHALL export their public
props and the `OrderDetailsAddress`, `OrderDetailsDelivery`,
`OrderDetailsDeliveryStep`, `OrderDetailsFulfillmentStatus`,
`OrderDetailsLineItem`, `OrderDetailsPayment`, `OrderDetailsPaymentBrand`, and
`OrderDetailsSummary` types.

Each named part SHALL remain renderable outside the `OrderDetails` compound.

#### Scenario: shared-ui-store-order-detail-SC-01 - An application imports the surface
**Serves:** Detail composition - an application imports the surface

- **WHEN** an application imports every named component and type from the shared UI public entry
- **THEN** every import resolves

#### Scenario: shared-ui-store-order-detail-SC-02 - A part renders on its own
**Serves:** Detail composition - a part renders on its own

- **WHEN** an application renders a named part outside `OrderDetails`
- **THEN** it renders with supplied props and no missing-context error

### Requirement: OrderDetails composes supplied order facts

`OrderDetails` SHALL render supplied breadcrumbs, order id, customer-facing
status, placed date, and line items. It SHALL render money summary, delivery,
payment, shipping or pickup address, loyalty, and help sections only when their
data or action is supplied. It SHALL NOT fetch, navigate, format money, derive
order status, or invent an absent section.

#### Scenario: shared-ui-store-order-detail-SC-03 - A complete order renders every supplied group
**Serves:** Detail composition - a complete order renders every supplied group

- **GIVEN** an order detail with header, lines, summary, delivery, payment, address, loyalty, and help data
- **WHEN** `OrderDetails` renders
- **THEN** every supplied group appears in the designed order

#### Scenario: shared-ui-store-order-detail-SC-04 - Missing optional groups are omitted
**Serves:** Detail composition - missing optional groups are omitted

- **GIVEN** an order detail with header and lines but no summary, delivery, payment, address, loyalty, or help data
- **WHEN** `OrderDetails` renders
- **THEN** its header and lines appear
- **AND** no heading, placeholder, or empty card for an absent group appears

### Requirement: Delivery progress and tracking are supplied behavior

`OrderDetailsDeliveryStatus` SHALL render supplied steps as display-only
progress. It SHALL show Track Order only when tracking is enabled and a callback
is supplied, and SHALL report activation through that callback. It SHALL NOT
open a URL or turn an upcoming step into a completed step.

#### Scenario: shared-ui-store-order-detail-SC-05 - Tracking needs both permission and an action
**Serves:** Optional sections - tracking needs both permission and an action

- **GIVEN** delivery progress with tracking enabled and a tracking callback
- **WHEN** it renders
- **THEN** Track Order appears
- **AND** activating it reports through the callback

#### Scenario: shared-ui-store-order-detail-SC-06 - Tracking is hidden without an action
**Serves:** Optional sections - tracking is hidden without an action

- **GIVEN** delivery progress with tracking enabled but no tracking callback
- **WHEN** it renders
- **THEN** Track Order does not appear

### Requirement: Optional sidebar facts stay independent

The order summary SHALL render only when at least one money row is supplied.
Subtotal, discount, points, refund, shipping, tax, and total rows SHALL each
render only when supplied. When a points credit is supplied, it SHALL appear
after the discount row (or after subtotal when discount is absent), SHALL name
the points deducted in its label (for example `Points (100 pts)`), and SHALL
use the same success-styled money-credit treatment as an applied cart-drawer
Points line. A shipping or pickup address SHALL accept an omitted recipient name and
render only its supplied lines. A payment method SHALL accept an optional
recognized brand, text label, and masked number; it SHALL render only when at
least one of those display facts is supplied. A recognized brand SHALL render
its logo, while a method without a recognized brand SHALL remain renderable
through its text label or masked number without an unrelated logo. When both a
wallet label and masked number are supplied, they SHALL remain visibly
associated. Payment, one shipping or pickup address, and loyalty SHALL each
render independently of the other optional groups. When no sidebar group is
supplied, `OrderDetails` SHALL omit the sidebar.

#### Scenario: shared-ui-store-order-detail-SC-07 - A refund renders without other optional money rows
**Serves:** Optional sections - a refund renders without other optional money rows

- **GIVEN** a summary with subtotal, refund, and total but no discount, points, shipping, or tax
- **WHEN** the sidebar renders
- **THEN** subtotal, refund, and total appear
- **AND** discount, points, shipping, and tax rows do not appear

#### Scenario: shared-ui-store-order-detail-SC-08 - Payment can be omitted independently
**Serves:** Optional sections - payment can be omitted independently

- **GIVEN** a sidebar with a summary and address but no payment
- **WHEN** it renders
- **THEN** the summary and address appear
- **AND** no Payment Method section appears

#### Scenario: shared-ui-store-order-detail-SC-09 - A paid total renders without a subtotal
**Serves:** Optional sections - a paid total renders without a subtotal

- **GIVEN** a summary with a total but no subtotal
- **WHEN** the sidebar renders
- **THEN** the total appears
- **AND** no Subtotal row appears

#### Scenario: shared-ui-store-order-detail-SC-10 - No sidebar facts omit the sidebar
**Serves:** Optional sections - no sidebar facts omit the sidebar

- **GIVEN** an order detail with no summary, payment, address, or loyalty data
- **WHEN** `OrderDetails` renders
- **THEN** no sidebar or empty sidebar card appears

#### Scenario: shared-ui-store-order-detail-SC-11 - An address needs no recipient placeholder
**Serves:** Optional sections - an address needs no recipient placeholder

- **GIVEN** an address with supplied lines and no recipient name
- **WHEN** the sidebar renders
- **THEN** the supplied address lines appear
- **AND** no empty or placeholder recipient appears

#### Scenario: shared-ui-store-order-detail-SC-12 - An unrecognized payment method needs no logo
**Serves:** Optional sections - an unrecognized payment method needs no logo

- **GIVEN** a payment method with a text label and masked number but no recognized brand
- **WHEN** the sidebar renders
- **THEN** the text label and masked number appear
- **AND** no unrelated payment logo appears

#### Scenario: shared-ui-store-order-detail-SC-13 - A wallet label stays associated with its mask
**Serves:** Optional sections - a wallet label stays associated with its mask

- **GIVEN** a payment method with a wallet label and masked device-account number
- **WHEN** the sidebar renders
- **THEN** the wallet label and masked number appear together in the Payment Method section

#### Scenario: shared-ui-store-order-detail-SC-14 - Applied points credit follows discount
**Serves:** Optional sections - applied points credit follows discount

- **GIVEN** a summary with subtotal, discount, points credit, and total
- **WHEN** the sidebar renders
- **THEN** the Points row appears after Discount
- **AND** its label names the points deducted
- **AND** the money credit uses the success credit treatment

#### Scenario: shared-ui-store-order-detail-SC-15 - Absent points credit omits the Points row
**Serves:** Optional sections - absent points credit omits the Points row

- **GIVEN** a summary with discount but no points credit
- **WHEN** the sidebar renders
- **THEN** the Discount row appears
- **AND** no Points row appears
