## Feature set

- Order status
  - Status badge: Show the consumer's chosen status, one of the six Status-set variants, with its label.
- Order line item
  - Product thumbnail and line copy: Show image, product×qty text, and line total.
- Order card
  - Header metadata and actions: Show order id, status, date, total, optional Track, and View Details.
  - Scrollable line slot: List line items horizontally with scroll-fade on overflow.
- Order history page
  - Active and Past sections: List consumer-split orders; hide empty sections.
  - Empty state: Show Empty State when both lists are empty.

## MODIFIED Requirements

### Requirement: Order status maps the six Status-set variants

`OrderHistoryStatus` SHALL accept exactly the statuses `completed`, `shipped`,
`processing`, `pickup`, `canceled`, and `refunded`, and SHALL display the
consumer-supplied label for that status. It SHALL NOT invent other status values.

The consumer SHALL choose the status, and the component SHALL NOT define what
an order's status means. For a Grade10 Store order, `grade10-site/commerce/order-status`
defines it. `pickup` SHALL remain an accepted status even though no
consumer supplies it yet.

<!-- trace:scenario id=g10.shared-store-order-history.SC-fem rev=1 -->
#### Scenario: shared-ui-store-order-history-SC-08 - Each status renders its label
**Serves:** shared-ui-store-order-history-US-01 - Collector reviews active and past orders

- **GIVEN** a status of `completed`, `shipped`, `processing`, `pickup`, `canceled`, or `refunded`
- **WHEN** `OrderHistoryStatus` renders with a label for that status
- **THEN** that label is displayed
