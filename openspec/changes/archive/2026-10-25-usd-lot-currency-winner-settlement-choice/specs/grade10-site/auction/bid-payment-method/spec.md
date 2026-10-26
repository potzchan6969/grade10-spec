# grade10-site/auction/bid-payment-method Specification

## Purpose

Lets a collector bid on the card linked to their account: the card carries to
every lot, can change until their first accepted bid on a lot, and is then
locked to that lot. Nothing is held or charged on the card when they bid; only
the winner pays, by the invoice on their winner order. The bid panel
discloses the buyer-premium rate without turning the bidding surface into an
invoice preview.

## Feature set

- Premium disclosure
  - USD bid: the panel shows the 20% premium rate for the USD bid without a calculated amount or invoice total
- Linked card
  - One card per lot: the linked method carries to new lots and locks after the first accepted bid
  - No card charge at bid: the winner pays later through the invoice

## MODIFIED Requirements

### Requirement: The bid panel discloses the buyer-premium rate

The listing bid panel SHALL show the buyer's premium rate as **20%** of the
winning bid before a collector submits a bid. The panel SHALL show the rate
for the USD winning bid only, per `grade10-site/auction/bid-increments`, and
SHALL not show a calculated premium amount,
an invoice total, or a premium line amount before an invoice exists.

SC-17 retains its historical title and id. Its body discloses the premium
rate for USD only; HKD and JPY are not bid currencies.

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-x21 rev=2 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-16 - Bid panel shows the premium rate
**Serves:** grade10-site-auction-bid-payment-method-US-04 - Collector understands the buyer-premium rate before bidding

- **GIVEN** a collector opens an active USD auction listing
- **WHEN** the bid panel is rendered
- **THEN** it shows that the buyer's premium rate is 20% of the winning bid
- **AND** it shows no calculated premium amount or invoice total

<!-- trace:scenario id=g10.auction-bid-payment-method.SC-oeb rev=2 -->
#### Scenario: grade10-site-auction-bid-payment-method-SC-17 - Premium rate is consistent across currencies
**Serves:** grade10-site-auction-bid-payment-method-US-04 - Collector understands the buyer-premium rate before bidding

- **GIVEN** a collector opens an active USD listing
- **WHEN** they read its bid panel
- **THEN** it shows the USD premium rate as 20%
- **AND** no HKD or JPY listing or bid amount is used to show another rate
