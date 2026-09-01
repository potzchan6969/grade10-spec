# shared-ui/store-order-history Specification

## Purpose

The shared blocks a store Order History page assembles between site chrome and
footer: a status badge, a product line item, an order card with header and
horizontally scrollable line items, and the page compound that lists Active and
Past orders or shows the empty state. Every store application renders them from
one component source, supplying copy, imagery, formatted values, and callbacks.

## Feature set

- Order status
  - Status badge: Show fulfillment state with the six Status-set variants.
- Order line item
  - Product thumbnail and line copy: Show image, product×qty text, and line total.
- Order card
  - Header metadata and actions: Show order id, status, date, total, optional Track, and View Details.
  - Scrollable line slot: List line items horizontally with scroll-fade on overflow.
- Order history page
  - Active and Past sections: List consumer-split orders; hide empty sections.
  - Empty state: Show Empty State when both lists are empty.

## User journeys

### store-order-history-US-01: Collector reviews active and past orders

**As a** signed-in collector,
**I want** my active and past orders on one page, with status, lines, and track
when a shipment is underway,
**so that** I can follow a live order or reopen an older one without the
surface inventing which orders belong where.

**Accepted by:**

- `store-order-history-SC-01` — Active and Past both render when non-empty
- `store-order-history-SC-02` — An empty section is omitted
- `store-order-history-SC-03` — Track Order appears only when enabled
- `store-order-history-SC-04` — Card lists supplied line items
- `store-order-history-SC-06` — An application imports the surface
- `store-order-history-SC-07` — A part is reused alone
- `store-order-history-SC-08` — Each status renders its label
- `store-order-history-SC-09` — Line item displays supplied fields
- `store-order-history-SC-10` — Track Order is hidden when disabled

### store-order-history-US-02: Collector starts shopping when there are no orders

**As a** signed-in collector with no orders,
**I want** an empty state that sends me to the store,
**so that** I know where my first order will appear and can browse.

**Accepted by:**

- `store-order-history-SC-05` — Zero orders shows empty state

## Requirements

### Requirement: The order history surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the order history surface — `OrderHistoryStatus`,
`OrderHistoryLineItem`, `OrderHistoryCardHeader`, `OrderHistoryCard`, and
`OrderHistory` — and exactly these types: `OrderHistoryStatusProps`,
`OrderHistoryFulfillmentStatus`, `OrderHistoryLineItemProps`,
`OrderHistoryCardHeaderProps`, `OrderHistoryCardHeaderCopy`,
`OrderHistoryCardProps`, `OrderHistoryProps`, `OrderHistoryCopy`,
`OrderHistoryOrderSummary`, and `OrderHistoryLineSummary`.

`OrderHistoryStatus`, `OrderHistoryLineItem`, `OrderHistoryCardHeader`, and
`OrderHistoryCard` SHALL each be renderable on their own, outside
`OrderHistory`.

#### Scenario: store-order-history-SC-06 - An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: store-order-history-SC-07 - A part is reused alone

- **WHEN** an application renders the status, line item, card header, or card without `OrderHistory`
- **THEN** it renders and behaves as specified, with no missing-context error

### Requirement: Order status maps the six Status-set variants

`OrderHistoryStatus` SHALL accept exactly the statuses `completed`, `shipped`,
`processing`, `pickup`, `canceled`, and `refunded`, and SHALL display the
consumer-supplied label for that status. It SHALL NOT invent other status values.

| Status | Meaning |
| --- | --- |
| `completed` | Paid or picked up in store, or delivered for an online order |
| `shipped` | Shipped and in transit (online) |
| `processing` | Submitted but not yet shipped (online) |
| `pickup` | Ready for pickup in the physical store (online) |
| `canceled` | Canceled (online) |
| `refunded` | Payment refunded (in-store or online) |

#### Scenario: store-order-history-SC-08 - Each status renders its label

- **GIVEN** a status of `completed`, `shipped`, `processing`, `pickup`, `canceled`, or `refunded`
- **WHEN** `OrderHistoryStatus` renders with a label for that status
- **THEN** that label is displayed

### Requirement: A line item shows image, product text, and total

`OrderHistoryLineItem` SHALL display a supplied product image (with accessible
name), the consumer-formatted product text that already includes quantity
(e.g. `Name × 2`), and the consumer-formatted line total. It SHALL NOT split
quantity into a separate field and SHALL NOT navigate or fetch.

#### Scenario: store-order-history-SC-09 - Line item displays supplied fields

- **WHEN** a line item renders with image, product text, and total
- **THEN** all three are displayed

### Requirement: The card header shows metadata and actions

`OrderHistoryCardHeader` SHALL display the supplied order id, status, placed-on
date text, and total text. It SHALL show Track Order only when `trackOrder` is
true, and SHALL report Track and View Details through named callbacks. It SHALL
NOT open URLs itself except by calling the Track callback the application
supplies.

#### Scenario: store-order-history-SC-03 - Track Order appears only when enabled

- **GIVEN** a card header with `trackOrder` true and Track copy
- **WHEN** the header renders
- **THEN** the Track Order control appears
- **AND** activating it reports through the Track callback

#### Scenario: store-order-history-SC-10 - Track Order is hidden when disabled

- **GIVEN** a card header with `trackOrder` false
- **WHEN** the header renders
- **THEN** no Track Order control appears
- **AND** View Details still appears when its handler is supplied

### Requirement: The order card frames header and a scrollable line slot

`OrderHistoryCard` SHALL render `OrderHistoryCardHeader` from supplied order
summary props and SHALL render its children as the horizontally scrollable body
slot. When line items overflow the body, the body SHALL apply scroll-fade mask
styling on the overflow edges. The card SHALL NOT fetch orders or navigate.

#### Scenario: store-order-history-SC-04 - Card lists supplied line items

- **GIVEN** an order card with header props and one or more line item children
- **WHEN** the card renders
- **THEN** the header and each child line item appear
- **AND** the body uses horizontal overflow with scroll-fade styling

### Requirement: OrderHistory lists Active and Past or shows empty

`OrderHistory` SHALL render a breadcrumbs slot, a page title from copy, then
either:

1. the empty state when both the active and past order lists are empty, or
2. an Active Orders section when the active list is non-empty and/or a Past
   Orders section when the past list is non-empty.

It SHALL omit a section whose list is empty. It SHALL NOT sort orders; the
application supplies each list already ordered latest to oldest. It SHALL NOT
classify an order as active or past.

Empty state SHALL use the design-system empty placeholder with consumer-supplied
title, description, icon, and a Shop Now action that reports through a named
callback.

#### Scenario: store-order-history-SC-01 - Active and Past both render when non-empty

- **GIVEN** a non-empty active list and a non-empty past list
- **WHEN** `OrderHistory` renders
- **THEN** both section headings and their order cards appear
- **AND** the empty state does not appear

#### Scenario: store-order-history-SC-02 - An empty section is omitted

- **GIVEN** a non-empty active list and an empty past list
- **WHEN** `OrderHistory` renders
- **THEN** only the Active Orders section appears
- **AND** the Past Orders heading does not appear
- **AND** the empty state does not appear

#### Scenario: store-order-history-SC-05 - Zero orders shows empty state

- **GIVEN** empty active and past lists
- **WHEN** `OrderHistory` renders
- **THEN** the empty state appears with the supplied title, description, and Shop Now action
- **AND** neither Active nor Past section headings appear
- **AND** activating Shop Now reports through its callback
