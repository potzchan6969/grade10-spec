## Feature set

- External lot status
  - Preparing Shipment maps to Ended (was Processing)

## MODIFIED Requirements

### Requirement: Every visible lot has one external lot status

Every lot a collector sees carries one of three statuses, worked out from the
lot alone.

**Three values** - Every lot a collector can see SHALL have exactly one
external lot status.

**Worked out, not saved** - Grade10 SHALL work it out from the lot and SHALL
NOT save it.

| External lot status | The lot |
| --- | --- |
| Upcoming | Published. Bidding has not started |
| Active | Bidding is open, until the lot closes. Includes extended bidding |
| Ended | Bidding is over, with or without a winner. For a lot with a winner, whatever the state of the winner's order |

**From the internal status** - Each internal lot status in
`grade10-admin/auction/post-sale` SHALL map to one external lot status, or to
Hidden:

| Internal lot status | External lot status |
| --- | --- |
| Draft | Hidden |
| Scheduled | Upcoming |
| Live | Active |
| Unsold | Ended |
| Called off | Hidden |
| Awaiting Setup | Ended |
| Preparing Invoice | Ended |
| Pending Payment | Ended |
| Preparing Shipment | Ended |
| Shipped | Ended |
| Delivered | Ended |
| Cancelled | Ended |
| Refunded | Ended |

**Hidden** - A Hidden lot SHALL have no external lot status. Collectors SHALL
NOT see it, as "Collectors never see hidden lots" sets out.

**Lot, not order** - The external lot status SHALL describe the lot only. It
SHALL NOT describe a collector's bid or the winner's order. The winner's order
status, set by `grade10-site/auction/order-status`, SHALL be shown separately
in the winner's My Auctions.

**Where it shows** - The designer decides where and how pages show the external
lot status.

<!-- trace:scenario id=g10.auction-lot-status.SC-wpp rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-01 - A lot whose bidding has not started is Upcoming
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** a published lot whose scheduled start has not arrived
- **WHEN** Grade10 works out its external lot status
- **THEN** the status is Upcoming

<!-- trace:scenario id=g10.auction-lot-status.SC-orm rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-02 - A lot open for bidding is Active
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** two lots open for bidding, one closing in a day and one closing in a
  minute
- **WHEN** Grade10 works out their external lot status
- **THEN** both are Active

<!-- trace:scenario id=g10.auction-lot-status.SC-6aa rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-03 - A lot in extended bidding is Active
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** a lot past its scheduled close and in extended bidding
- **WHEN** Grade10 works out its external lot status
- **THEN** the status is Active

<!-- trace:scenario id=g10.auction-lot-status.SC-pmn rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-04 - A lot with a winner is Ended whatever state its order is in
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** three lots with a winner, whose orders are awaiting payment, shipped
  and cancelled
- **WHEN** Grade10 works out their external lot status
- **THEN** all three are Ended

<!-- trace:scenario id=g10.auction-lot-status.SC-flh rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-12 - A lot that ended with no winner is Ended
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** a published lot whose bidding ended with no winner
- **WHEN** Grade10 works out its external lot status
- **THEN** the status is Ended

<!-- trace:scenario id=g10.auction-lot-status.SC-eor rev=1 -->
#### Scenario: grade10-site-auction-lot-status-SC-05 - The winner sees their order status separately
**Serves:** grade10-site-auction-lot-status-US-01 - Collector sees whether a lot can still be bid on

- **GIVEN** a winner whose order is awaiting payment
- **WHEN** they open My Auctions
- **THEN** the lot's external lot status is Ended
- **AND** their order status is shown separately
