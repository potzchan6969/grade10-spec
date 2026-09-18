## Feature set

- Derived order status
  - Refunded from partial collection: makes a refund terminal after any recorded payment

## ADDED Requirements

### Requirement: Refunded is a terminal auction order status

An auction order with a recorded refund SHALL derive status Refunded whether
the cumulative payment was full or partial. The status SHALL be terminal and
SHALL not be replaced by a later payment or shipment event.

#### Scenario: auction-status-SC-51 - A refund derives Refunded
**Serves:** Derived order status - a refund derives Refunded

- **GIVEN** an order with a recorded refund after partial collection
- **WHEN** any order-status surface reads it
- **THEN** the derived status is Refunded
- **AND** a later payment event does not change that status

#### Scenario: auction-status-SC-54 - An overpayment does not derive Refunded
**Serves:** Derived order status - an overpayment keeps the order status

- **GIVEN** an order with a payment above its invoice total and a returned
  difference
- **WHEN** any order-status surface reads it
- **THEN** the derived status remains the status before the overpayment return
- **AND** it is not Refunded
