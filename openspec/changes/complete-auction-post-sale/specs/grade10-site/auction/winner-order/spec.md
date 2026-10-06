# Winner Order - delta

## Feature set

- Delivery address
  - One-time address kept: an unsaved one-time delivery or billing address stays on the order after the winner leaves and returns, until they confirm or the setup deadline passes
- Country or region picker
  - Billing uses the same list: billing Add Address lists the same complete A-Z catalogue with the same search as delivery
  - Names in the account's language: Country/Region names read and sort in the language of the account, as the rest of the site does
- Payment method
  - Offered where Grade10 can take it: card only in a currency with a card fee rule in Payment Settings; bank transfer only in a currency whose bank details Grade10 holds - a sample HKD account outside production, and in production the account Finance confirms
  - Card not yet available: in a currency with no card fee rule, card reads that it is not yet available there and cannot be chosen
  - No method in the currency: with neither method offered, the winner reads that payment is not yet available there, with Contact Us, and cannot confirm; the setup deadline keeps running
  - Fee wording at the choice: card reads `Card fee about 3.4% + a fixed amount`; bank transfer reads `Bank fee set on your invoice`
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
text Grade10 sets:

| Method | Reads |
| --- | --- |
| Card | `Card fee about 3.4% + a fixed amount` |
| Bank transfer | `Bank fee set on your invoice` |

The bank transfer text SHALL name no amount, since an operator sets that fee
on the invoice.

**Offered where Grade10 can take it** - Grade10 SHALL offer each method only
where it can take the payment:

| Method | Offered where |
| --- | --- |
| Card | Payment Settings holds a card fee rule for the order's currency, per `grade10-admin/auction/payment-settings` |
| Bank transfer | Grade10 holds bank details for the order's currency |

| Where | Bank details Grade10 holds |
| --- | --- |
| Outside production | A sample HKD account |
| Production | The HKD account Finance confirms; none until then |

**Card not yet available** - In a currency with no card fee rule, the choice
SHALL show card as not yet available in that currency, and the winner SHALL
NOT be able to choose it. Once Finance saves a card fee rule for the currency,
card SHALL be offered on every order in it that the winner has not yet
confirmed.

**Neither method** - Where neither method is offered, Winner Order SHALL say
that payment is not yet available in the order's currency and offer Contact
Us, per "Contact Us opens a copy-first ready email", and Grade10 SHALL refuse
a confirmation as one with no method chosen. The setup deadline SHALL keep
running: the order reads Setup Overdue once it passes, as any unconfirmed
order does, and an operator reopens or records setup by hand, per
`grade10-admin/auction/post-sale`.

**Refused** - Grade10 SHALL refuse a confirmation with no method chosen, and
SHALL refuse a method where it is not offered. A refused confirmation SHALL
record neither the address nor the method.

**Locked on confirmation** - Until the winner confirms, they SHALL be able to
change the method freely. Once they confirm, the method locks for the winner,
per "The delivery address locks when the invoice is sent".

<!-- trace:scenario id=g10.auction-winner-order.SC-v59 rev=1 -->
#### Scenario: winner-order-SC-90 - The method is recorded with the address
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Setup, where Grade10 holds HKD
  bank details
- **WHEN** the winner confirms a delivery address and chooses bank transfer
- **THEN** the order records bank transfer as its payment method
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-8dl rev=1 -->
#### Scenario: winner-order-SC-91 - The choice shows a fee range and no bank transfer amount
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Setup, where Grade10 holds HKD
  bank details and Payment Settings holds an HKD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads `Card fee about 3.4% + a fixed amount`
- **AND** bank transfer reads `Bank fee set on your invoice`, naming no amount
- **AND** neither method is selected

<!-- trace:scenario id=g10.auction-winner-order.SC-1aa rev=1 -->
#### Scenario: winner-order-SC-92 - A currency with no bank details offers card only
**Serves:** Payment method - bank transfer only where bank details are set up

- **GIVEN** an auction order in USD Awaiting Setup, where Payment Settings
  holds a USD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying bank transfer for that order is refused

<!-- trace:scenario id=g10.auction-winner-order.SC-pt5 rev=1 -->
#### Scenario: winner-order-SC-93 - The method can change until the winner confirms
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup, where Grade10 holds HKD
  bank details and Payment Settings holds an HKD card fee rule, on which the
  winner has chosen card and not yet confirmed
- **WHEN** the winner changes the choice to bank transfer and confirms the address
- **THEN** the order records bank transfer
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-wn1 rev=1 -->
#### Scenario: winner-order-SC-94 - A confirmation with no method is refused
**Serves:** Payment method - card or bank transfer recorded with the address

- **GIVEN** an auction order in HKD Awaiting Setup
- **WHEN** the winner confirms a delivery address without choosing a method
- **THEN** Grade10 refuses the confirmation
- **AND** the order is still Awaiting Setup

<!-- trace:scenario id=g10.auction-winner-order.SC-er5 rev=1 -->
#### Scenario: winner-order-SC-226 - Production offers card only until Finance confirms the account
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup in production, where
  Grade10 holds no HKD bank details and Payment Settings holds an HKD card
  fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying the home address and bank transfer is refused
- **AND** the order holds no delivery address and no method

#### Scenario: winner-order-SC-248 - A currency with no card fee rule does not offer card
**Serves:** Payment method - card only where Finance set a card fee rule

- **GIVEN** an auction order in HKD Awaiting Setup outside production, where
  Grade10 holds the sample HKD bank details and Payment Settings holds no HKD
  card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** card reads that it is not yet available in HKD and cannot be chosen
- **AND** bank transfer is offered
- **AND** a confirmation carrying card for that order is refused
- **AND** the order holds no delivery address and no method

#### Scenario: winner-order-SC-249 - A currency with neither method cannot confirm setup
**Serves:** Payment method - card only where Finance set a card fee rule

- **GIVEN** an auction order in USD Awaiting Setup, where Payment Settings
  holds no USD card fee rule
- **WHEN** the winner reaches the payment method choice
- **THEN** the page says payment is not yet available in USD and offers
  Contact Us
- **AND** neither card nor bank transfer can be chosen
- **AND** Grade10 refuses a confirmation of the delivery address
- **AND** the order is still Awaiting Setup, holding no delivery address and no
  method

#### Scenario: winner-order-SC-257 - The setup deadline runs where no method is offered
**Serves:** winner-order-US-07 - Winner misses the address deadline

- **GIVEN** an auction order in USD Awaiting Setup, where Payment Settings
  holds no USD card fee rule, whose winner has not confirmed setup
- **WHEN** 48 hours pass from the lot's close
- **THEN** the order reads Setup Overdue
- **AND** an operator holding payment processing can reopen or record its
  setup

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

<!-- trace:scenario id=g10.auction-winner-order.SC-bbg rev=1 -->
#### Scenario: winner-order-SC-49 - A timed-out payment session stays payable
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a winner whose payment session for a Pending Payment order timed out
- **WHEN** they return to the order
- **THEN** the page says payment was not completed
- **AND** the order is still Pending Payment with Pay Now available

<!-- trace:scenario id=g10.auction-winner-order.SC-7ra rev=1 -->
#### Scenario: winner-order-SC-50 - Pay Now after an unfinished session starts fresh
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a Pending Payment order whose last payment session was abandoned
- **WHEN** the winner selects Pay Now
- **THEN** a new payment session starts for the same invoice amount

<!-- trace:scenario id=g10.auction-winner-order.SC-u5t rev=1 -->
#### Scenario: winner-order-SC-51 - A completed session confirms before reading Preparing Shipment
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a winner whose hosted card session completed but whose
  authenticated auction-order read model has not yet recorded invoice status
  `paid`
- **WHEN** they return to the order
- **THEN** the page shows Confirming payment
- **AND** the order does not yet read Preparing Shipment

<!-- trace:scenario id=g10.auction-winner-order.SC-49w rev=1 -->
#### Scenario: winner-order-SC-52 - A recorded payment reads Preparing Shipment
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** an order whose authenticated auction-order read model returns
  invoice status `paid` and fulfilment status `unfulfilled`
- **WHEN** the winner opens it
- **THEN** its status is Preparing Shipment

### Requirement: Contact Us opens a copy-first ready email

When Contact Us is offered on a locked Winner Order, the winner reaches
Grade10 through a ready email they can copy into any mail app.

**Opens** - Contact Us SHALL open a dialog. It SHALL NOT open a mail client
as the first action, and SHALL NOT show only a toast that names the address.

**Hidden until open** - `support@grade10.com` SHALL NOT appear on the order
page before Contact Us opens the dialog.

**Ready email** - The open dialog SHALL show, in order:

1. To - `support@grade10.com`, not editable by the winner, with copy in place
2. Subject - the ready subject for this order and reason, not editable by the
   winner, with copy in place
3. Message - an editable `Textarea` prefilled with the ready body and space
   for the winner's question. No copy control SHALL sit beside the Message
   field; Copy Message stays footer-only

**Footer** - The dialog footer SHALL offer, in order:

1. Copy Message first - copies the full ready email (To, Subject and
   Message) for pasting into any mail app
2. Open Mail App second - optional; opens a `mailto:` to
   `support@grade10.com` carrying the current Subject and Message

**Copy Message confirms in place** - Once Copy Message has copied the email,
the button itself SHALL read Copied for a moment, then Copy Message again. No
toast SHALL appear, so the dialog stays the only thing on screen.

**Export** - The design system SHALL export `Textarea` as a labelled
multi-line field that shares TextInput's label, status and message contract.

<!-- trace:scenario id=g10.auction-winner-order.SC-nlr rev=1 -->
#### Scenario: winner-order-SC-160 - Contact Us opens the copy-first dialog
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment or setup self-service has closed
  and whose overdue or partially paid alert offers Contact Us
- **WHEN** the winner chooses Contact Us
- **THEN** a dialog opens showing To `support@grade10.com`, Subject and
  Message
- **AND** Copy Message is the first footer action
- **AND** Open Mail App is the second footer action
- **AND** no mail client opens as the first action

<!-- trace:scenario id=g10.auction-winner-order.SC-fu8 rev=1 -->
#### Scenario: winner-order-SC-161 - The support address stays off the order until Contact Us
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose overdue or partially paid alert offers
  Contact Us
- **WHEN** the winner reads Winner Order before choosing Contact Us
- **THEN** `support@grade10.com` does not appear on the order page
- **AND** after Contact Us opens the dialog, To shows `support@grade10.com`

<!-- trace:scenario id=g10.auction-winner-order.SC-lh0 rev=1 -->
#### Scenario: winner-order-SC-162 - Message is an editable Textarea and Copy Message stays footer-only
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** the Contact Us dialog is open on a locked Winner Order
- **WHEN** the winner edits Message and chooses Copy Message
- **THEN** Message is an editable `Textarea`
- **AND** no copy control sits beside the Message field
- **AND** Copy Message copies To, Subject and the current Message together

<!-- trace:scenario id=g10.auction-winner-order.SC-fnc rev=1 -->
#### Scenario: winner-order-SC-163 - Open Mail App carries the current subject and body
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** the Contact Us dialog is open with Subject and Message filled
- **WHEN** the winner chooses Open Mail App
- **THEN** a `mailto:` to `support@grade10.com` opens with that Subject and
  Message

<!-- trace:scenario id=g10.auction-winner-order.SC-sfn rev=1 -->
#### Scenario: winner-order-SC-167 - To and Subject copy in place and stay fixed
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** the Contact Us dialog is open on a locked Winner Order
- **WHEN** the winner uses the To and Subject copy controls
- **THEN** each control copies only that field's value
- **AND** the winner cannot edit To or Subject
- **AND** Copy Message remains the footer control for the full ready email

#### Scenario: winner-order-SC-250 - Copy Message confirms through its own state
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** the Contact Us dialog is open on a locked Winner Order
- **WHEN** the winner chooses Copy Message and the email is copied
- **THEN** the button reads Copied for a moment, then Copy Message again
- **AND** no toast appears

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

<!-- trace:scenario id=g10.auction-winner-order.SC-0ex rev=1 -->
#### Scenario: winner-order-SC-15 - A declined payment leaves the invoice payable
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid card invoice inside its payment deadline
- **WHEN** the winner's payment is declined
- **THEN** the invoice status remains `pending`
- **AND** the winner can retry with the same or a different card

<!-- trace:scenario id=g10.auction-winner-order.SC-rbe rev=1 -->
#### Scenario: winner-order-SC-35 - The winner is offered card payment only
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice was sent for card and is `pending`
- **WHEN** the winner opens the order to pay
- **THEN** Grade10 offers Pay with Card
- **AND** shows no bank transfer details, no proof upload, and no cash or other method

## ADDED Requirements

### Requirement: Billing Add Address uses the delivery Country/Region picker

Billing Add Address SHALL name the billing country or region the same way
delivery Add Address does, per "Delivery Add Address Country/Region picker":
one field read Country/Region, every country and region in A-Z order, typing
narrows the list, a query with no match leaves it empty, and an empty
Country/Region is refused beside the field.

#### Scenario: winner-order-SC-259 - Billing Add Address lists every country and region
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on billing Add Address after unticking Same as delivery
  address
- **WHEN** the winner opens the Country/Region picker
- **THEN** the popup lists every country and region in A-Z order, the same
  list as delivery Add Address

#### Scenario: winner-order-SC-260 - Typing filters the billing list to matching names
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner with the Country/Region picker open on billing Add Address
- **WHEN** the winner types a query that matches one or more catalogue names
- **THEN** the list shows only names that match that query

### Requirement: Country/Region names follow the account's language

The Country/Region picker on delivery and billing Add Address reads in the
account's language, as the rest of the site does.

**Names** - Each country and region SHALL read in the account's language.

**Order** - The list SHALL keep every country and region, sorted
alphabetically in that language.

**Search** - Typing SHALL match the names as they read in that language.

**Stored** - The country or region an address holds SHALL NOT change with the
language; a winner who changes language reads the same choice in the new one.

#### Scenario: winner-order-SC-261 - A Traditional Chinese account reads and searches names in Traditional Chinese
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner whose account language is Traditional Chinese, on
  delivery Add Address
- **WHEN** the winner opens the Country/Region picker and types `日本`
- **THEN** the list reads its names in Traditional Chinese
- **AND** the list narrows to `日本`

### Requirement: An unsaved one-time address stays on the order until setup ends

A winner who adds a one-time address without saving it to the address book
can leave the order and come back to it.

**Kept** - An unsaved one-time delivery or billing address SHALL stay on the
order after the winner leaves and returns, listed and selectable as when it
was added, per "The account owns a reusable shipping address book".

**Until** - Grade10 SHALL keep it until the winner confirms setup or the setup
deadline passes, whichever comes first. After either, the order SHALL NOT
offer it again, including when an operator reopens setup.

**The order's alone** - It SHALL stay on this order only and SHALL NOT enter
the account address book or any other order.

#### Scenario: winner-order-SC-254 - An unsaved one-time delivery address is there on return
**Serves:** winner-order-US-12 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an auction order in Awaiting Setup, on which the winner added a
  one-time delivery address without saving it and has not confirmed
- **WHEN** the winner leaves the order and returns to it before the setup
  deadline
- **THEN** the address picker lists the one-time address ahead of the saved
  addresses
- **AND** the winner can select it and confirm setup with it

#### Scenario: winner-order-SC-255 - An unsaved one-time billing address is there on return
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** an auction order in Awaiting Setup, on which the winner unticked
  Same as delivery address and added a one-time billing address without
  saving it
- **WHEN** the winner leaves the order and returns to it before the setup
  deadline
- **THEN** the one-time billing address is still offered for billing
- **AND** the account address book does not hold it

#### Scenario: winner-order-SC-256 - The one-time address is gone once the setup deadline passes
**Serves:** winner-order-US-07 - Winner misses the address deadline

- **GIVEN** an auction order on which the winner added a one-time delivery
  address without saving it and did not confirm before the setup deadline
- **AND** an operator reopened setup after the deadline passed
- **WHEN** the winner opens the order
- **THEN** the address picker does not offer the one-time address
