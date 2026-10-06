# grade10-site/auction/winner-order Specification

## Feature set

- Records the winner keeps
  - Cancelled order notice: explains the terminal date, retained lot and winning bid
  - Contact Us: gives the winner the only next action

## ADDED Requirements

### Requirement: Winner Order explains cancellation without exposing the reason

For a cancelled auction order, Winner Order SHALL show the cancellation date as a
day-only date in the viewer's local zone, the lot and winning bid, and Contact Us as the only next action. It SHALL not show
the operator's category or note, SHALL not show a stepper or payment action,
and SHALL preserve the order's retained facts.

<!-- trace:scenario id=g10.auction-winner-order.SC-1fb rev=2 -->
#### Scenario: winner-order-SC-143 - Cancelled keeps the lot and winning bid visible
**Serves:** winner-order-US-13 - Winner learns their order was cancelled

- **GIVEN** a cancelled auction order with a lot and winning bid
- **WHEN** the winner opens Winner Order
- **THEN** it shows Cancelled on the recorded day in the viewer's local zone, the lot and winning bid
- **AND** it shows Contact Us only, without the internal reason
