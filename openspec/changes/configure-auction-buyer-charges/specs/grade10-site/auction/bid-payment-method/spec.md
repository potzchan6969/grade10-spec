# grade10-site/auction/bid-payment-method Specification

## Purpose
Lets a collector understand the buyer-premium rate that applies to a bid
without turning the bidding surface into an invoice preview.

## Feature set

- Premium disclosure
  - Bid-panel rate: the buyer's premium is shown as 20% of the winning bid
  - Amount withheld: the calculated premium amount is absent until an invoice exists

## ADDED Requirements

### Requirement: The bid panel discloses the buyer-premium rate

The listing bid panel SHALL show the buyer's premium rate as **20%** of the
winning bid before a collector submits a bid. The panel SHALL show the rate in
all supported auction currencies and SHALL not show a calculated premium amount,
an invoice total, or a premium line amount before an invoice exists.

#### Scenario: grade10-site-auction-bid-payment-method-SC-16 - Bid panel shows the premium rate
**Serves:** grade10-site-auction-bid-payment-method-US-04 - Collector understands the buyer-premium rate before bidding

- **GIVEN** a collector opens an active auction listing
- **WHEN** the bid panel is rendered
- **THEN** it shows that the buyer's premium rate is 20% of the winning bid
- **AND** it shows no calculated premium amount or invoice total

#### Scenario: grade10-site-auction-bid-payment-method-SC-17 - Premium rate is consistent across currencies
**Serves:** grade10-site-auction-bid-payment-method-US-04 - Collector understands the buyer-premium rate before bidding

- **GIVEN** a collector opens active listings in USD, HKD, and JPY
- **WHEN** they read each bid panel
- **THEN** each panel shows the buyer's premium rate as 20%
- **AND** no panel shows a currency-specific premium amount
