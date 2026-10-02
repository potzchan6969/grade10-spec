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

### Requirement: An unfinished card payment leaves the invoice payable

Pay Now SHALL start a hosted card payment session for the current invoice. Its
outcome SHALL read as follows.

| Session outcome | The winner sees | Order |
| --- | --- | --- |
| Completed | **Confirming payment** until Grade10 records the invoice `paid` | Preparing Shipment once paid |
| Timed out | Payment was not completed; Pay Now is available again | Stays Pending Payment |
| Abandoned or cancelled by the winner | Payment was not completed; Pay Now is available again | Stays Pending Payment |
| Declined | The refusal, per "The winner pays a sent invoice by the method it was sent for" | Stays Pending Payment |

Pay Now after an unfinished session SHALL start a fresh session. An unfinished
session SHALL NOT change the invoice, its amount or its deadline. Grade10 SHALL
NOT show the order as paid before it records the invoice `paid`.

#### Scenario: winner-order-SC-49 - A timed-out payment session stays payable
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a winner whose payment session for a Pending Payment order timed out
- **WHEN** they return to the order
- **THEN** the page says payment was not completed
- **AND** the order is still Pending Payment with Pay Now available

#### Scenario: winner-order-SC-50 - Pay Now after an unfinished session starts fresh
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a Pending Payment order whose last payment session was abandoned
- **WHEN** the winner selects Pay Now
- **THEN** a new payment session starts for the same invoice amount

#### Scenario: winner-order-SC-51 - A completed session confirms before reading Preparing Shipment
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a winner whose hosted card session completed but whose
  authenticated auction-order read model has not yet recorded invoice status
  `paid`
- **WHEN** they return to the order
- **THEN** the page shows Confirming payment
- **AND** the order does not yet read Preparing Shipment

#### Scenario: winner-order-SC-52 - A recorded payment reads Preparing Shipment
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** an order whose authenticated auction-order read model returns
  invoice status `paid` and fulfilment status `unfulfilled`
- **WHEN** the winner opens it
- **THEN** its status is Preparing Shipment

## RENAMED Requirements

- FROM: `### Requirement: The bid-time hold is released, never captured`
- TO: `### Requirement: The winner pays a sent invoice by the method it was sent for`

### Requirement: The winner pays a sent invoice by the method it was sent for

The winner SHALL pay by the method the invoice was sent for:

| Invoice method | How the winner pays |
| --- | --- |
| Card | A single new card transaction for the order total, against a stored card or another card they enter |
| Bank transfer | A transfer they make themselves, then proof uploaded per "The winner uploads payment proof once" |

Cash and every other method are recorded by an operator alone, per
`grade10-admin/auction/post-sale`.

A refused or failed card payment SHALL NOT void the invoice. While a card
invoice's status is `pending`, it SHALL remain payable by card and the winner
SHALL be able to retry with the same or a different card. The primary pay
control SHALL read **Pay with Card**. When the invoice status is `expired` or
`payment_verifying`, Grade10 SHALL NOT offer or start winner card payment; one
that completes anyway is recorded per "Money that lands is always recorded" in
`grade10-admin/auction/post-sale`.

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
