## Feature set

- Settlement progress
  - Five presentation steps: Address → Invoice → Payment → Shipping → Completed
  - Preparing Shipment and Shipped share the Shipping step as **current** (progress); Preparing Shipment subtext reads Preparing to ship
  - Status badges: Preparing Shipment and Shipped use Badge `default` (muted fill) on Winner Order, matching My Auctions

## MODIFIED Requirements

### Requirement: Winner Order shows five progress steps

Winner Order SHALL present settlement progress as five steps in this order:
**Address**, **Invoice**, **Payment**, **Shipping**, **Completed**. The steps
SHALL be presentation only and SHALL NOT replace the derived order status
vocabulary in `grade10-site/auction/order-status`.

| Current step | Derived order status |
| --- | --- |
| Address | Awaiting Setup or Setup Overdue |
| Invoice | Preparing Invoice |
| Payment | Pending Payment (invoice `pending`), Payment Overdue (invoice `expired`), or Payment Verifying |
| Shipping | Preparing Shipment or Shipped |
| Completed | Delivered |

When the derived order status is **Cancelled** or **Refunded**, Winner Order
SHALL show no progress stepper.

Step subtext SHALL use day-only dates in the winner's zone. While Address is
current and awaiting confirm, subtext SHALL read `Confirm by {date}`. While
Payment is current and the invoice is `pending`, subtext SHALL read
`Pay by {date}`. While the invoice is `payment_verifying`, Payment subtext
SHALL name no date. While Shipping is current and the derived status is
**Preparing Shipment**, Shipping subtext SHALL read **Preparing to ship**.
While Shipping is current and the derived status is **Shipped**, Shipping
subtext SHALL use the day-only ship date when one is known. Description copy SHALL wrap so five columns do not
overflow.

<!-- trace:scenario id=g10.auction-winner-order.SC-11o rev=1 -->
#### Scenario: winner-order-SC-54 - Pending Payment highlights the Payment step
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose derived status is Pending Payment
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Payment as the current step
- **AND** Address and Invoice are complete

<!-- trace:scenario id=g10.auction-winner-order.SC-fpp rev=1 -->
#### Scenario: winner-order-SC-55 - Processing maps under Shipped
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose derived status is Preparing Shipment
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Shipping as the current (progress) step
- **AND** Shipping subtext reads Preparing to ship
- **AND** does not invent a Preparing Shipment step label
- **AND** does not leave Shipping incomplete or upcoming while Payment is complete

<!-- trace:scenario id=g10.auction-winner-order.SC-fm0 rev=1 -->
#### Scenario: winner-order-SC-56 - Cancelled hides the stepper
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose derived status is Cancelled
- **WHEN** the winner opens Winner Order
- **THEN** no progress stepper is shown

<!-- trace:scenario id=g10.auction-winner-order.SC-wsm rev=1 -->
#### Scenario: winner-order-SC-66 - Progress dates are day-only
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice is `pending` with a payment deadline
  of 2026-09-26T03:00:00Z
- **WHEN** the winner opens Winner Order
- **THEN** Payment step subtext reads Pay by with the day-only date
- **AND** the Pay control still shows the absolute datetime with time

<!-- trace:scenario id=g10.auction-winner-order.SC-sd5 rev=1 -->
#### Scenario: winner-order-SC-108 - Payment Verifying stays on the Payment step with no date
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose derived status is Payment Verifying
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Payment as the current step
- **AND** the Payment subtext names no date
