## Feature set

- Payment method
  - Offered where Grade10 holds bank details: card in every currency, bank transfer only in a currency whose bank details Grade10 holds - a sample HKD account outside production, and in production the account Finance confirms
- Bank transfer
  - Proof judged by its content: a file whose bytes are not a type Grade10 takes is refused, whatever its name
- Card payment
  - No start once closed: no card payment starts on an expired or checked invoice, and one that completes anyway is recorded

## MODIFIED Requirements

### Requirement: The winner chooses a payment method with the address

The winner picks card or bank transfer at the same time as the delivery
address, and the pick locks with it.

**Chosen with the address** - When the winner confirms a delivery address on
an auction order, Winner Order SHALL also ask how they will pay:

1. Choose card or bank transfer.
2. Read the fee range Grade10 sets for each method.
3. Confirm the address and the method together.

**No preselection** - Grade10 SHALL preselect neither method and SHALL record
the chosen method on the order.

**Fee range at the choice** - The fee range for each method SHALL be fixed
text Grade10 sets; its wording is TBC. The bank transfer text SHALL name no
amount, since an operator sets that fee on the invoice.

**Offered where Grade10 holds bank details** - Grade10 SHALL offer card in
every currency, and bank transfer only in a currency whose bank details it
holds:

| Where | Bank details Grade10 holds |
| --- | --- |
| Outside production | A sample HKD account |
| Production | The HKD account Finance confirms; none until then |

**Refused** - Grade10 SHALL refuse a confirmation with no method chosen, and
SHALL refuse bank transfer where it is not offered. A refused confirmation
SHALL record neither the address nor the method.

**Locked on confirmation** - Until the winner confirms, they SHALL be able to
change the method freely. Once they confirm, the method locks for the winner,
per "The delivery address locks when the invoice is sent".

#### Scenario: winner-order-SC-90 - The method is recorded with the address
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Setup, where Grade10 holds HKD
  bank details
- **WHEN** the winner confirms a delivery address and chooses bank transfer
- **THEN** the order records bank transfer as its payment method
- **AND** the order derives as Preparing Invoice

#### Scenario: winner-order-SC-91 - The choice shows a fee range and no bank transfer amount
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Setup
- **WHEN** the winner reaches the payment method choice
- **THEN** card and bank transfer each show the fee range text Grade10 set
- **AND** the bank transfer text names no amount
- **AND** neither method is selected

#### Scenario: winner-order-SC-92 - A currency with no bank details offers card only
**Serves:** Payment method - bank transfer only where bank details are set up

- **GIVEN** an auction order in USD Awaiting Setup
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying bank transfer for that order is refused

#### Scenario: winner-order-SC-93 - The method can change until the winner confirms
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup, where Grade10 holds HKD
  bank details, on which the winner has chosen card and not yet confirmed
- **WHEN** the winner changes the choice to bank transfer and confirms the address
- **THEN** the order records bank transfer
- **AND** the order derives as Preparing Invoice

#### Scenario: winner-order-SC-94 - A confirmation with no method is refused
**Serves:** Payment method - card or bank transfer recorded with the address

- **GIVEN** an auction order in HKD Awaiting Setup
- **WHEN** the winner confirms a delivery address without choosing a method
- **THEN** Grade10 refuses the confirmation
- **AND** the order is still Awaiting Setup

#### Scenario: winner-order-SC-226 - Production offers card only until Finance confirms the account
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup in production, where
  Grade10 holds no HKD bank details
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying the home address and bank transfer is refused
- **AND** the order holds no delivery address and no method

### Requirement: The bid-time hold is released, never captured

When a bid-time authorization exists, Grade10 SHALL release it on every bidder
of a closing lot, winner and losing bidders alike, and SHALL NOT leave a losing
bidder's authorization to expire on its own.

Grade10 SHALL NOT capture or increment a bid-time authorization as any part
of settlement. The winner SHALL pay by the method the invoice was sent for:

| Invoice method | How the winner pays |
| --- | --- |
| Card | A single new card transaction for the order total, against a stored card or another card they enter |
| Bank transfer | A transfer they make themselves, then proof uploaded per "The winner uploads payment proof once" |

Cash and every other method are recorded by an operator alone, per
`grade10-admin/auction/post-sale`.

Releasing an authorization that has already expired SHALL succeed as a
no-op. Grade10 SHALL NOT treat an expired authorization as a failure.

A refused or failed card payment SHALL NOT void the invoice. While a card
invoice's status is `pending`, it SHALL remain payable by card and the winner
SHALL be able to retry with the same or a different card. The primary pay
control SHALL read **Pay with Card**. When the invoice status is `expired` or
`payment_verifying`, Grade10 SHALL NOT offer or start winner card payment; one
that completes anyway is recorded per "Money that lands is always recorded" in
`grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-12 - The winning hold is released and the invoice is a fresh charge
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner holding an open bid-time authorization on the closing lot
- **WHEN** the lot closes
- **THEN** Grade10 releases that authorization at close without capturing it
- **AND** after an operator later sends a card invoice, the winner's payment is a
  single new transaction for the order total

#### Scenario: winner-order-SC-13 - An expired hold releases as a no-op
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner whose bid-time authorization expired before the lot closed
- **WHEN** the lot closes
- **THEN** Grade10 records the release as successful
- **AND** creates the auction order as normal

#### Scenario: winner-order-SC-14 - A losing bidder's hold is released at close
**Serves:** winner-order-US-01 - the lot close that opens the winner's order also frees every losing hold

- **GIVEN** a lot closing with one winner and three losing bidders holding
  open authorizations
- **WHEN** the lot closes
- **THEN** Grade10 releases all three losing authorizations
- **AND** does not wait for them to expire

#### Scenario: winner-order-SC-15 - A declined payment leaves the invoice payable
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid card invoice inside its payment deadline
- **WHEN** the winner's payment is declined
- **THEN** the invoice status remains `pending`
- **AND** the winner can retry with the same or a different card

#### Scenario: winner-order-SC-35 - The winner is offered card payment only
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice was sent for card and is `pending`
- **WHEN** the winner opens the order to pay
- **THEN** Grade10 offers Pay with Card
- **AND** shows no bank transfer details, no proof upload, and no cash or other method
