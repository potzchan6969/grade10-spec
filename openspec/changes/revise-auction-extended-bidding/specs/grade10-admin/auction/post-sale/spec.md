## Feature set

- Queue rows
  - Extended bidding label: an operator sees which lots are still taking bids
    past their scheduled close, without a second outcome

## ADDED Requirements

### Requirement: A queue row shows when its lot is in extended bidding

While a lot is in extended bidding, as `grade10-site/auction/auction` defines
it, its queue row SHALL carry the label **Extended bidding: ON** beside its
outcome. A lot not in extended bidding SHALL carry no such label.

The label SHALL NOT be an outcome. It SHALL NOT change the lot's outcome,
SHALL NOT be offered as an outcome filter, and SHALL NOT mark the row as
needing action.

#### Scenario: grade10-admin-auction-post-sale-SC-64 - A lot in extended bidding carries the label

- **GIVEN** a lot past its scheduled close and in extended bidding
- **WHEN** an operator reads the queue
- **THEN** its row carries the label Extended bidding: ON beside its outcome
- **AND** its outcome is the one it carries without the label

#### Scenario: grade10-admin-auction-post-sale-SC-65 - A lot not in extended bidding carries no label

- **GIVEN** one lot whose scheduled close has not arrived, and one that closed
  after its extended bidding ended
- **WHEN** an operator reads the queue
- **THEN** neither row carries the label Extended bidding: ON

#### Scenario: grade10-admin-auction-post-sale-SC-66 - Extended bidding is not an outcome filter

- **GIVEN** a queue holding a lot in extended bidding
- **WHEN** an operator opens the outcome filter
- **THEN** no outcome named Extended bidding is offered
- **AND** that lot's row carries no needs-action highlight because of the label
