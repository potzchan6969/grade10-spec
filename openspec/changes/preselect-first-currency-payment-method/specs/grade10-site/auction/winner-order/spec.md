# grade10-site/auction/winner-order Specification

## Feature set

- Settlement currency
  - Winner's choice: while confirming the order the winner picks USD or HKD — the first offered currency preselected — fixed once the invoice is sent
- Payment method
  - First offered method preselected: the payment step opens with the settlement currency's first offered method selected — card where a card fee rule applies, else the first bank rail

## MODIFIED Requirements

### Requirement: The delivery address is confirmed before payment

Grade10 SHALL require the winner to confirm a delivery address and a payment
method on the auction order before an operator can send its invoice. When an
account default exists, Grade10 SHALL pre-fill the address from it, but the
default SHALL not become the order's destination until the winner confirms or
selects an address. Grade10 SHALL preselect the first payment method the
settlement currency offers.

| Condition | Behaviour |
| --- | --- |
| Account has a default shipping address | Grade10 pre-fills it. The winner still confirms explicitly |
| Account has no default shipping address | The address is empty. The winner adds one and confirms it |
| Account has multiple saved addresses | Grade10 lets the winner choose one, then confirms the selected address for this order |
| Winner changes the address or method before confirming | The order takes the new choice. The order stays Awaiting Setup until the winner confirms |
| Winner asks to change the address or method after confirming, before the invoice is sent | Refused on the order. An operator edits the order on request. The order stays Preparing Invoice |
| Winner asks to change the address or method after the invoice is sent | Refused on the order. An operator reissues on request |
| Winner adds or edits an address | Grade10 offers to save it to the account address book. The order keeps a snapshot |

<!-- trace:scenario id=g10.auction-winner-order.SC-0vs rev=1 -->
#### Scenario: winner-order-SC-07 - A pre-filled default still needs confirming
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order pre-filled from the account's default shipping address
- **WHEN** the winner leaves the order without confirming that address
- **THEN** the order's derived status is still Awaiting Setup
- **AND** an operator cannot send its invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-wah rev=1 -->
#### Scenario: winner-order-SC-08 - An amendment does not touch the address book by default
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner amending the delivery address on one auction order in Awaiting Setup
- **AND** they leave the offer to save the amendment to the account address book untaken
- **WHEN** they confirm the amendment
- **THEN** that auction order carries the amended address
- **AND** their saved address book is unchanged

### Requirement: The winner chooses a payment method with the address

The winner picks a settlement currency and a payment method at the same time as
the delivery address, and the picks lock with it.

**Chosen with the address** - When the winner confirms a delivery address on
an auction order, Winner Order SHALL also ask how they will pay:

1. Choose USD or HKD as the settlement currency, per "The winner chooses a
   settlement currency at order setup".
2. Choose a payment method that currency offers.
3. Read the fee range Grade10 sets for each method.
4. Confirm the address, the currency and the method together.

**Preselection** - Winner Order SHALL preselect the first method the
settlement currency offers — card where a card fee rule applies to the
currency, else the first bank rail it offers — and SHALL record the chosen
method on the order. A method the currency cannot take SHALL NOT be
preselected. Where one settlement currency is offered, Winner Order SHALL
name it at the choice — `Pay in {currency}` — and SHALL offer no currency
picker. A preselected method is not a confirmed one: the winner still
confirms the address, the currency and the method together.

**Methods by currency** - The methods follow the settlement currency picked:

| Settlement currency | Methods offered |
| --- | --- |
| HKD | Card, FPS, HK Local |
| USD | Card, HK Local, International via SWIFT |

FPS, HK Local and International via SWIFT are bank rails. Each rail SHALL be
its own choice at setup, and Grade10 SHALL NOT offer one bank transfer choice
that lists the rails after the winner confirms. A rail is a bank transfer
method, and the order SHALL record the rail the winner picked.

**Fee range at the choice** - The fee range for each method SHALL be text
Grade10 sets:

| Method | Reads |
| --- | --- |
| Card | `Card fee about {percentage}% + a fixed amount` |
| FPS, HK Local, International via SWIFT | no fee line |

`{percentage}` SHALL be the percentage of the card fee rule Payment Settings
holds for the currency picked, as Finance saved it. Finance MAY set it to any
value Payment Settings accepts, and the text SHALL read that value, not a fixed
figure. A bank rail SHALL read no fee line at the choice — no fee is
required for those options.

**Offered where Grade10 can take it** - Grade10 SHALL offer each method only
where it can take the payment:

| Method | Offered where |
| --- | --- |
| Card | Payment Settings holds a card fee rule for the settlement currency, per `grade10-admin/auction/payment-settings` |
| A bank rail | Grade10 holds that rail's bank details |

| Where | Bank details Grade10 holds |
| --- | --- |
| Outside production | Sample accounts for each rail |
| Production | The accounts Finance confirms for each rail; none until then |

**Card not yet available** - In a currency with no card fee rule, the choice
SHALL show card as not yet available in that currency, and the winner SHALL
NOT be able to choose it. Once Finance saves a card fee rule for the currency,
card SHALL be offered on every order in it that the winner has not yet
confirmed.

**Currency change** - A winner who switches currency before confirming SHALL
keep the method they chose only where the new currency offers it. Otherwise
Grade10 SHALL clear the method, preselect none and refuse a confirmation until
the winner chooses one.

**Neither method** - Where the currency offers neither card nor a bank rail,
Winner Order SHALL say that payment is not yet available in the order's
currency and offer Contact Us, per "Contact Us opens a copy-first ready
email", and Grade10 SHALL refuse a confirmation as one with no method chosen.
The setup deadline SHALL keep running: the order reads Setup Overdue once it
passes, as any unconfirmed order does, and an operator reopens or records setup
by hand, per `grade10-admin/auction/post-sale`.

**Refused** - Grade10 SHALL refuse a confirmation with no method chosen, and
SHALL refuse a method the settlement currency does not offer or that is not
offered where Grade10 cannot take it. A refused confirmation SHALL record
neither the address, the currency nor the method.

**Locked on confirmation** - Until the winner confirms, they SHALL be able to
change the currency and the method freely. Once they confirm, both lock for the
winner, per "The delivery address locks when the invoice is sent". An operator
MAY change either before the invoice is sent, and on a reissue after, per
`grade10-admin/auction/post-sale`.

**Historical confirmed bank method** - An ordinary historical order that is
already confirmed for bank transfer but has no recorded rail is a legacy read
state, distinct from an unselected setup choice. Winner Order SHALL show the
bank method with an unknown rail and SHALL NOT choose a default. New
confirmation, an operator edit, a first send for a confirmed order with no
invoice, or a reissue SHALL require a supported offered rail. Internal or house
orders receive no exception to their settled HKD and FPS rule.

Scenarios `winner-order-SC-92` and `winner-order-SC-226` keep their titles
with their ids. The titles are historical: each rail is offered or withheld on
its own bank details, and card on its own rule.

<!-- trace:scenario id=g10.auction-winner-order.SC-oyi rev=1 -->
#### Scenario: winner-order-SC-293 - HKD offers card, FPS and HK Local
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup, where Payment Settings holds an
  HKD card fee rule and Grade10 holds FPS, HK Local and SWIFT bank details
- **WHEN** the winner picks HKD
- **THEN** card, FPS and HK Local are offered, each as its own choice
- **AND** International via SWIFT is not offered

<!-- trace:scenario id=g10.auction-winner-order.SC-crs rev=1 -->
#### Scenario: winner-order-SC-294 - USD offers card, HK Local and SWIFT
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup, where Payment Settings holds a
  USD card fee rule and Grade10 holds FPS, HK Local and SWIFT bank details
- **WHEN** the winner picks USD
- **THEN** card, HK Local and International via SWIFT are offered, each as its
  own choice
- **AND** FPS is not offered

<!-- trace:scenario id=g10.auction-winner-order.SC-4lj rev=1 -->
#### Scenario: winner-order-SC-295 - Switching currency clears a method the new currency does not offer
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD and
  International via SWIFT, and has not confirmed
- **WHEN** the winner switches the currency to HKD
- **THEN** no method is selected
- **AND** a confirmation without a new choice is refused

<!-- trace:scenario id=g10.auction-winner-order.SC-6un rev=1 -->
#### Scenario: winner-order-SC-296 - Switching currency keeps a method both currencies offer
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD and HK
  Local, and has not confirmed
- **WHEN** the winner switches the currency to HKD
- **THEN** HK Local stays selected

<!-- trace:scenario id=g10.auction-winner-order.SC-vbp rev=1 -->
#### Scenario: winner-order-SC-297 - USD card waits for a USD card fee rule
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD, where
  Payment Settings holds no USD card fee rule and Grade10 holds HK Local and
  SWIFT bank details
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads that it is not yet available in USD and cannot be chosen
- **AND** HK Local and International via SWIFT are offered

<!-- trace:scenario id=g10.auction-winner-order.SC-rge rev=1 -->
#### Scenario: winner-order-SC-298 - A method the currency does not offer is refused
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD
- **WHEN** a confirmation carrying FPS reaches Grade10
- **THEN** Grade10 refuses it
- **AND** the order records neither the address, the currency nor the method

<!-- trace:scenario id=g10.auction-winner-order.SC-v59 rev=2 -->
#### Scenario: winner-order-SC-90 - The method is recorded with the address
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in Awaiting Setup, where Grade10 holds FPS bank
  details
- **WHEN** the winner confirms a delivery address, picks HKD and chooses FPS
- **THEN** the order records bank transfer as its payment method, on the FPS
  rail
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-8dl rev=3 -->
#### Scenario: winner-order-SC-91 - The choice shows a fee range and no bank transfer amount
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD, where
  Grade10 holds FPS and HK Local bank details and Payment Settings holds an
  HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads `Card fee about 3.4% + a fixed amount`
- **AND** FPS and HK Local read no fee line
- **AND** card is selected

<!-- trace:scenario id=g10.auction-winner-order.SC-o4y rev=1 -->
#### Scenario: winner-order-SC-303 - The card fee range reads the percentage of the currency picked
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup, where Payment Settings holds an
  HKD card fee rule of 3.4 per cent and a USD card fee rule of 4.4 per cent
- **WHEN** the winner picks USD, then switches to HKD
- **THEN** card reads `Card fee about 4.4% + a fixed amount` under USD
- **AND** card reads `Card fee about 3.4% + a fixed amount` under HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-1aa rev=2 -->
#### Scenario: winner-order-SC-92 - A currency with no bank details offers card only
**Serves:** Payment method - bank transfer only where bank details are set up

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD, where
  Grade10 holds HK Local bank details and no FPS bank details, and Payment
  Settings holds an HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** card and HK Local are offered
- **AND** FPS is not offered
- **AND** a confirmation carrying FPS for that order is refused

<!-- trace:scenario id=g10.auction-winner-order.SC-pt5 rev=2 -->
#### Scenario: winner-order-SC-93 - The method can change until the winner confirms
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD, where
  Grade10 holds HK Local bank details and Payment Settings holds an HKD card
  fee rule, on which the winner has chosen card and not yet confirmed
- **WHEN** the winner changes the choice to HK Local and confirms the address
- **THEN** the order records bank transfer, on the HK Local rail
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-wn1 rev=2 -->
#### Scenario: winner-order-SC-94 - A confirmation with no method is refused
**Serves:** Payment method - card or bank transfer recorded with the address

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD
- **WHEN** the winner confirms a delivery address without choosing a method
- **THEN** Grade10 refuses the confirmation
- **AND** the order is still Awaiting Setup

<!-- trace:scenario id=g10.auction-winner-order.SC-er5 rev=2 -->
#### Scenario: winner-order-SC-226 - Production offers card only until Finance confirms the account
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD, in
  production, where Grade10 holds no FPS and no HK Local bank details and
  Payment Settings holds an HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying the home address and FPS is refused
- **AND** the order holds no delivery address and no method

<!-- trace:scenario id=g10.auction-winner-order.SC-7y2 rev=2 -->
#### Scenario: winner-order-SC-248 - A currency with no card fee rule does not offer card
**Serves:** Payment method - card only where Finance set a card fee rule

- **GIVEN** an auction order in Awaiting Setup whose winner picked HKD,
  outside production, where Grade10 holds the sample bank details and Payment
  Settings holds no HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads that it is not yet available in HKD and cannot be chosen
- **AND** FPS and HK Local are offered
- **AND** a confirmation carrying card for that order is refused
- **AND** the order holds no delivery address and no method

<!-- trace:scenario id=g10.auction-winner-order.SC-cz1 rev=2 -->
#### Scenario: winner-order-SC-249 - A currency with neither method cannot confirm setup
**Serves:** Payment method - card only where Finance set a card fee rule

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD, where
  Payment Settings holds no USD card fee rule and Grade10 holds no HK Local
  and no SWIFT bank details
- **WHEN** the winner reaches the payment method choice
- **THEN** the page says payment is not yet available in USD and offers
  Contact Us
- **AND** neither card nor a bank rail can be chosen
- **AND** Grade10 refuses a confirmation of the delivery address
- **AND** the order is still Awaiting Setup, holding no delivery address and no
  method

<!-- trace:scenario id=g10.auction-winner-order.SC-ii6 rev=2 -->
#### Scenario: winner-order-SC-257 - The setup deadline runs where no method is offered
**Serves:** winner-order-US-07 - Winner misses the address deadline

- **GIVEN** an auction order in Awaiting Setup whose winner picked USD, where
  Payment Settings holds no USD card fee rule and Grade10 holds no HK Local
  and no SWIFT bank details, whose winner has not confirmed setup
- **WHEN** 48 hours pass from the lot's close
- **THEN** the order reads Setup Overdue
- **AND** an operator holding payment processing can reopen or record its
  setup

<!-- trace:scenario id=g10.auction-winner-order.SC-zk3 rev=1 -->
#### Scenario: winner-order-SC-305 - The step opens with the currency's first method selected
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup offered USD and HKD, where
  Payment Settings holds a USD card fee rule and Grade10 holds HK Local and
  SWIFT bank details
- **WHEN** the winner reaches the payment method choice
- **THEN** USD is selected and card is selected
- **AND** the winner can still choose HK Local or International via SWIFT
  before confirming

<!-- trace:scenario id=g10.auction-winner-order.SC-mw8 rev=1 -->
#### Scenario: winner-order-SC-306 - A single settlement currency names itself and offers no picker
**Serves:** winner-order-US-25 - Winner picks a payment method their currency offers

- **GIVEN** an auction order in Awaiting Setup that settles in HKD only, where
  Payment Settings holds an HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** the choice reads `Pay in HKD` and offers no currency picker
- **AND** card is selected

### Requirement: The winner chooses a settlement currency at order setup

At order setup the winner SHALL choose the order's settlement currency from
`USD` and `HKD`, in the same step as the delivery address and the payment
method. Grade10 SHALL preselect the first offered currency, and
a single offered currency SHALL be the selection. Grade10 SHALL refuse a
confirmation that carries no currency. The lot is bid in USD whichever
currency the winner picks.

This choice applies to a collector winner. For an internal bidder's win,
`grade10-admin/auction/internal-bid` sets HKD settlement, bank transfer and
FPS at lot close; the internal order does not wait for winner setup.

Until the winner confirms, they SHALL be able to change the currency freely.
Once they confirm, the currency locks for the winner with the address and the
method, per "The delivery address locks when the invoice is sent". An operator
MAY change it before the invoice is sent, and on a reissue after, per
`grade10-admin/auction/post-sale`. A sent invoice SHALL keep its own currency
and amounts; a reissue replaces it with a new invoice in the currency the
operator chose, and the replaced invoice keeps its own.

The invoice, the order total, every fee, every payment and refund, the receipt
and every order letter that states an amount owed or paid SHALL carry the
settlement currency. A winning bid on the lot card SHALL stay in USD. Payment
method availability SHALL follow the settlement currency, per "The winner
chooses a payment method with the address".

`settlement_currency: null` is allowed only before confirmation. A missing
`bank_rail` on an ordinary historical confirmed bank order is a separate
legacy fact and SHALL NOT be treated as a missing currency or filled with a
default rail.

Scenario `winner-order-SC-278` keeps its title with its id. The title is
historical: the choice now opens with the first offered currency selected.

<!-- trace:scenario id=g10.auction-winner-order.SC-o92 rev=2 -->
#### Scenario: winner-order-SC-278 - Setup offers USD and HKD with neither picked
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order for a lot bid in `USD`, in Awaiting Setup
- **WHEN** the winner opens the setup form
- **THEN** the settlement currency choice offers USD and HKD
- **AND** the first offered currency — USD — is selected

<!-- trace:scenario id=g10.auction-winner-order.SC-j1l rev=1 -->
#### Scenario: winner-order-SC-279 - A confirmation with no currency is refused
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order in Awaiting Setup, whose winner has chosen a
  delivery address and a billing address but no currency
- **WHEN** the winner confirms setup
- **THEN** Grade10 refuses the confirmation
- **AND** the order holds no delivery address, no currency and no method, and
  is still Awaiting Setup

<!-- trace:scenario id=g10.auction-winner-order.SC-lq9 rev=1 -->
#### Scenario: winner-order-SC-280 - The winner confirms with the currency they picked
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order in Awaiting Setup where the winner has picked
  HKD and a method HKD offers
- **WHEN** the winner confirms the delivery address
- **THEN** the order records HKD as its settlement currency
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-8c6 rev=1 -->
#### Scenario: winner-order-SC-281 - A USD order is priced in USD without conversion
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order whose winner picked USD, with a hammer price of
  250000 minor units in USD
- **WHEN** an operator sends its invoice
- **THEN** the invoice's Winning Bid is 250000 minor units in USD
- **AND** the buyer's premium is 50000 minor units in USD
- **AND** no line is converted

<!-- trace:scenario id=g10.auction-winner-order.SC-k63 rev=1 -->
#### Scenario: winner-order-SC-282 - A sent invoice keeps its currency
**Serves:** winner-order-US-24 - Winner chooses the currency they pay in

- **GIVEN** an auction order whose invoice was sent in HKD
- **WHEN** a write that is not an operator's reissue sets the order's
  settlement currency to USD
- **THEN** Grade10 refuses the write
- **AND** the order and its invoice still carry HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-rau rev=1 -->
#### Scenario: winner-order-SC-300 - An operator changes the currency before the invoice is sent
**Serves:** `winner-order-US-24`, `grade10-admin/auction/post-sale#post-sale-US-05` - the winner's pick is corrected before the quote

- **GIVEN** an auction order in Preparing Invoice whose winner confirmed HKD and
  HK Local
- **WHEN** an operator holding payment-processing changes the settlement
  currency to USD with a reason
- **THEN** the order records USD, and the winner reads Winner Order in USD
- **AND** the winner's own write to the currency is still refused

<!-- trace:scenario id=g10.auction-winner-order.SC-d84 rev=1 -->
#### Scenario: winner-order-SC-301 - A reissue carries the currency the operator chose
**Serves:** `winner-order-US-24`, `winner-order-US-26` - the winner's currency is corrected after the invoice is sent

- **GIVEN** an auction order whose invoice was sent in HKD with a Winning Bid
  of 78500 minor units
- **WHEN** an operator reissues it in USD
- **THEN** the new invoice carries a Winning Bid of 10000 minor units in USD
- **AND** the replaced invoice still reads 78500 minor units in HKD
