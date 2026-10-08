# grade10-site/auction/winner-order Specification

## Purpose

What a winner is sent after a lot closes and what they do with it: one order
per lot, a delivery address, payment method and billing address they choose, an
operator's invoice priced for both, payment by card or by a bank transfer they
prove, and the receipt, tracker and delivery proof the order keeps afterwards.

## Feature set

- Invoice at lot close
  - One invoice per lot: a winner of three lots owes three amounts on three deadlines, never one consolidated bill
  - Estimate-first pricing: the invoice is payable from the moment of close rather than waiting on an address
  - Final amount: names every component a winner is asked to pay, so a total is explicable line by line
  - Buyer's premium: 20% of the winning bid or the currency's minimum charge, whichever is higher, computed by Grade10
  - Invoice premium: 20% of the winning bid
  - Integer amount: rounded to the nearest minor unit
  - Bid-panel boundary: only the rate appears before invoicing
- Invoice summary guidance
  - Fee tooltips: Buyer’s Premium, Shipping & Handling, Insurance and Payment Processing Fee carry brief info tooltips when those lines are shown
  - Insurance before send: before the invoice is sent, Order Summary shows Insurance as TBD with the other fee rows; after send, Insurance stays optional and absent when none
  - Insurance tip copy: the Insurance tooltip reads `0.9% of the order value during transit.`
- Premium minimum
  - Currency minimum: the current Auction Payment settings mapping sets the lower bound for the calculated premium
- Delivery address
  - Account-wide address book: the platform keeps at most five named shipping addresses and one optional default for the account
  - Selection and confirmation: a winner chooses a saved address or adds one, then affirms it before payment
  - Amendment and recalculation: a winner corrects the destination and sees what it costs before paying
  - Locking at payment: the order snapshot stops moving once money has changed hands
  - Missed deadline closes the form: after the address deadline, counted from the lot's actual close and judged by when Grade10 receives the write, the winner cannot put an address on the order; the account address book stays open
  - Reopened by an operator: the winner has no way to reopen the form; an operator reopens it or records the address, and the winner then confirms as before
  - Retired at send: sending the invoice retires the address deadline
- Billing address at setup
  - Same as delivery address is selected by default
  - A separate saved or one-time address uses the existing address fields
  - Billing is confirmed with delivery and payment method
- Address phone and kind
  - Phone with country: country and digits required; E.164 when parseable; unusual formats accepted; phone country starts empty; placeholder shows an example with calling code
  - Personal or company: Company Name required only for company and hidden on personal; first and last name stay required on both
  - Optional locality: address line 1 and postal code required; address line 2 and state or province optional; no Apt./Suite/Building on this form
  - Picker card title: company name for a company address; recipient first and last name for a personal address
  - Picker card body: street, city or region, and country only — no postal code and no phone
  - Order summary addresses: Delivery and Billing show company when company, recipient name, phone, and full address including postal
- Country or region picker
  - Complete A–Z catalogue: delivery Add Address lists every country and region, not a short designated set
  - Searchable filter: typing in Country/Region narrows the list to matching names
  - Field label Country/Region: the picker reads Country/Region
- Address snapshots
  - The confirmed billing address is locked on the order
  - Later account-address changes do not rewrite the order
- Invoice and receipt addresses
  - Invoice shows Bill To and Ship To from the order snapshot
  - Receipt keeps the addresses of the invoice it pays
- Payment method
  - Chosen with the address: card or bank transfer, recorded when the winner confirms where to ship
  - Fee range at the choice: fixed text Grade10 sets, with no amount for bank transfer
  - Offered by currency: bank transfer only where bank details are set up
  - Locked on confirmation: once the winner confirms, they change neither the address nor the method; an operator edits them before send and reissues after
- Invoice
  - Fee priced by method: Payment Processing Fee is the card gross-up or the operator's bank transfer fee, never dropped
  - Identifier formats: an invoice ID and a bank reference built from the listing code, the month and the invoice count; a reissue takes new ones, and an old one still finds the order
  - Listing code: `L` and five characters, fixed for the listing's life, never on the public listing page
  - Internal audit number: one gapless count across invoices and receipts, never shown to the winner
  - Payment reference: the listing's own code, carried forward as the order's one collector-facing reference once a winner exists; there is no separate public order ID, and it never appears on the public listing page — `grade10-admin/auction/listing` allocates the code, this capability only carries it forward
  - Invoice ID: the payment reference plus a 2-digit issuance sequence; a reissue takes the next sequence and an old invoice ID still finds the order
  - Replacement invoice: a reissue's new invoice says `Replaces invoice {id}` and names the prior invoice it replaces
- Bank transfer
  - Three ways to pay: SWIFT, FPS and Hong Kong local bank transfer details, with the payment reference to quote; the bank-rail presentation is governed by `add-winner-how-to-pay-rails`
  - Payment proof: one upload of 1 to 3 files (1 required) in Submit Payment Proof, behind inline irreversible microcopy; on success toast **Proof submitted** / **We'll verify your payment shortly.** and Payment Verifying; on a failed upload the dialog stays open with the draft and toast **Proof not submitted** / **Nothing was saved. Try again.**; while submitting or converting HEIC the form locks and leave is blocked
  - Payment Verifying: the deadline stops, Submit Payment Proof, View Bank Details and further uploads are hidden
  - Proof not accepted: the latest reason the winner reads, and the deadline running again with the time that was left
- Records the winner keeps
  - Receipt ID and breakdown: every receipt has a unique receipt ID and shows what was billed, paid and left to pay
  - Receipt payment breakdown: each receipt identifies the invoice total, prior payments, the current payment and remaining amount
  - Historical receipt values: issued receipts and later receipts' prior-payment values remain unchanged after a refund or reversal
  - Retention: every invoice and receipt PDF kept at least 7 years, or for the life of the account if longer
  - Refunded order: shows the terminal outcome while retaining invoices and receipts
  - Refund details: Amount, Transfer to and Reason; Reference for a bank refund; Note only when the operator recorded one
  - Payment receipt: proof of what was paid, itemised, retrievable for the life of the account
  - Shipping tracker: the tracking number is the link to the carrier tracking page when the operator recorded a tracker link, plain text otherwise, with no separate carrier name
  - Delivery proof: what the carrier recorded on handover, given what these lots are worth
  - Receipt identifier: a receipt for a finalized payment uses the invoice payload plus its unpadded per-invoice sequence; historic receipt IDs remain unchanged
  - Receipt: it itemises Tax when added
  - Cancelled order notice: explains the terminal date, retained lot and winning bid
  - Contact Us: gives the winner the only next action, with the `order cancelled` ready email
  - Payment receipts: lists every partial payment on the existing receipt row
- Settlement
  - Single fresh charge: one transaction for the final amount, retryable on failure
  - Operator-collected balance: keeps a partially paid invoice out of winner self-service
- Payment deadline
  - Seven days from close: a fixed end to the winner's obligation, unmoved by anything they do to the invoice
  - Closed after partial payment: removes the self-service deadline once collection starts
- Contact Us on locked orders
  - Copy-first ready email: Contact Us opens a dialog with To, Subject and Message; Copy Message is first, Open Mail App is second
  - Subject names invoice or lot: the order's current invoice id when one exists; lot title when setup is overdue and no invoice has been issued
  - Address hidden until open: `support@grade10.com` is not on the order page before Contact Us
  - Editable message field: Message is an editable Textarea with order facts prefilled and space for the winner's question
  - Partial payment body: receipt ids may be listed; the remaining balance stays off the mail
- Order-progress tracking
  - Tracking number: while fulfilment is `fulfilled` with a tracking number, Order Progress makes the number an external link to the carrier tracking page when the operator recorded a tracker link, and plain text otherwise; no Track shipment control or carrier name appears in Order Progress; the link remains after delivery is confirmed
- Settlement progress
  - Five presentation steps: Address → Invoice → Payment → Shipping → Completed
  - Preparing Shipment and Shipped share the Shipping step as **current** (progress); Preparing Shipment subtext reads Preparing to ship
  - Status badges: Preparing Shipment and Shipped use Badge `default` (muted fill) on Winner Order, matching My Auctions
- Tax on a winner's order
  - Before send: Tax reads TBD with an info tip
  - After send: Tax shows the operator's amount or is absent when none
  - Itemisation: the invoice and receipt carry Tax between Insurance and Subtotal
  - Card fee base: Tax is part of the Subtotal the payment fee grosses up

## Requirements

### Requirement: Invoice fields

Each invoice SHALL carry these fields. Every amount SHALL be an integer count
of minor units paired with the lot's ISO 4217 currency code, rendered per
`shared/money-amounts`. An invoice exists only once an operator sends it.

| Field | Notes |
| --- | --- |
| Auction order | The order this invoice is the payable record for. An order holds one current invoice, and any invoices a reissue replaced |
| Invoice ID | Given at send, per "Every invoice carries an invoice ID and the order's payment reference". Finds the order, including after a reissue |
| Payment reference | Given at send, on every invoice. Shown to the winner only on a bank transfer invoice. Finds the order, including after a reissue |
| Internal audit number | Given at send, per "Invoices and receipts carry an internal audit number". Never shown to the winner |
| Lot | The single lot invoiced. Named unambiguously, since a winner may hold several |
| Payment method | Card or bank transfer. The winner's choice at send, or the operator's at a reissue |
| Winning bid | The accepted bid that won the lot, excluding every other component |
| Buyer's premium | The applicable fee. This capability fixes no rate |
| Shipping & Handling | Quoted by an operator for the order's confirmed delivery address. Zero or more |
| Insurance | Optional. Added by an operator for the order's confirmed delivery address, and greater than zero when added |
| Tax | Optional. Added by an operator for the order, and greater than zero when added. Grade10 defines no rate, jurisdiction or formal tax receipt |
| Subtotal | The sum of the components above |
| Payment processing fee | Priced by the payment method, below. On every invoice, and never dropped |
| Order total | The total payable — the subtotal plus the payment processing fee |
| Sent at | When the operator sent the invoice. Stored in UTC |
| Payment deadline | 7 calendar days from Sent at, stopped while proof is checked. Stored in UTC; shown in the viewer's local zone on Winner Order and in `Asia/Hong_Kong` as `GMT+8` on the invoice PDF |
| Replaces invoice | On a replacement invoice only: the prior invoice ID named by `Replaces invoice {id}` |
| Invoice status | Per `grade10-site/auction/order-status`. A replaced invoice holds none |

The payment processing fee SHALL be priced by the invoice's payment method:

| Method | Payment processing fee |
| --- | --- |
| Card | The amount that leaves the subtotal whole after the card rule's fixed amount and percentage of the whole charge, computed below |
| Bank transfer | The amount the operator entered on the quote or the reissue. Zero or more |

For card, Grade10 SHALL take the card rule for the invoice's currency from
Payment Settings, per `grade10-admin/auction/payment-settings`, at the moment
the invoice is sent, SHALL compute the order total as the subtotal plus the
rule's fixed amount divided by one less its percentage, SHALL round that total
up to the next minor unit, and SHALL take the fee as the difference between
the order total and the subtotal. Grade10 SHALL NOT read the payment
provider's fees.

The fee SHALL be fixed on the invoice once sent. A later change to the card
rule SHALL NOT move it; only a reissue SHALL price it again. No settlement
SHALL drop or change it.

Wherever the winner reads the invoice's lines — the order, the receipt, and
any letter that lists them — Grade10 SHALL show Shipping & Handling of zero as
**Free**, SHALL show a Payment Processing Fee of zero as **Free**, SHALL
leave the Insurance line out when the operator added none, and SHALL leave the
Tax line out when the operator added none. Insurance and Payment Processing
Fee are separate lines: omitting Insurance does not replace it with the fee.

Where the Tax line is shown, Winner Order's Order Summary SHALL place it
between Insurance and Payment Processing Fee, and the invoice and receipt PDFs
SHALL place it between Insurance and Subtotal.

On Winner Order's order summary, Grade10 SHALL offer brief info tooltips beside
**Buyer’s Premium**, **Shipping & Handling**, **Insurance**, and **Payment Processing Fee**
when those lines are shown. The Payment Processing Fee tooltip SHALL describe
the fee for the invoice's method briefly and SHALL NOT restate the gross-up
formula.

The on-page Winner Order summary MAY omit a separate Subtotal row and show the
fee lines that apply plus Order Total; the invoice and receipt itemisation
SHALL still carry Subtotal.

No component SHALL be marked as an estimate. Grade10 SHALL NOT show the winner
an invoice amount before an operator has sent it.

<!-- trace:scenario id=g10.auction-winner-order.SC-6nv rev=2 -->
#### Scenario: winner-order-SC-04 - An estimated total is marked as one
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent a bank transfer invoice with a winning bid of
  250000, a buyer's premium of 50000, shipping of 8000, insurance of 4000, tax of 6000 and
  a payment processing fee of 0 minor units in HKD
- **WHEN** the winner reads the invoice
- **THEN** the order total is 318000 minor units in HKD
- **AND** no component is marked as an estimate

<!-- trace:scenario id=g10.auction-winner-order.SC-33a rev=1 -->
#### Scenario: winner-order-SC-05 - A confirmed address makes the total firm
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose winner confirmed a delivery address
- **AND** an operator sent an invoice with Shipping & Handling quoted for that
  address, with Insurance when added
- **WHEN** the winner reads the invoice
- **THEN** its total is the order total for that address
- **AND** no component is marked as an estimate

<!-- trace:scenario id=g10.auction-winner-order.SC-awt rev=2 -->
#### Scenario: winner-order-SC-62 - The fee grosses the subtotal up
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent a card invoice whose subtotal is 312000 minor units in HKD
- **AND** the HKD card rule in Payment Settings when it was sent was 3.4 per cent and 235 minor units
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 11225 minor units in HKD
- **AND** the order total is 323225 minor units in HKD

Scenario `winner-order-SC-63` keeps its title with its id. The title is
historical: a manually settled order keeps its payment processing fee.

<!-- trace:scenario id=g10.auction-winner-order.SC-6if rev=1 -->
#### Scenario: winner-order-SC-63 - A manually settled order carries no fee
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a bank transfer invoice with a subtotal of 312000 and a payment
  processing fee of 5000 minor units in HKD
- **WHEN** an operator settles it manually and the winner reads the receipt
- **THEN** the payment processing fee of 5000 minor units in HKD is shown
- **AND** the amount settled is the order total of 317000 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-w9w rev=1 -->
#### Scenario: winner-order-SC-38 - Shipping & Handling of zero reads Free
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Shipping & Handling of 0 minor units in HKD
- **WHEN** the winner opens the order
- **THEN** the Shipping & Handling line reads Free

<!-- trace:scenario id=g10.auction-winner-order.SC-k0e rev=1 -->
#### Scenario: winner-order-SC-39 - An invoice with no insurance shows no Insurance line
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding insurance
- **WHEN** the winner opens the order
- **THEN** no Insurance line is shown
- **AND** the Payment Processing Fee line is still shown, whatever the method
- **AND** the order total is the sum of the lines that are shown

<!-- trace:scenario id=g10.auction-winner-order.SC-4lu rev=1 -->
#### Scenario: winner-order-SC-69 - Fee lines carry info tooltips
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Buyer’s Premium, Shipping &
  Handling, and Payment Processing Fee
- **WHEN** the winner opens Winner Order
- **THEN** each of those three lines offers a brief info tooltip
- **AND** the Payment Processing Fee tooltip does not describe the gross-up
  formula

<!-- trace:scenario id=g10.auction-winner-order.SC-c6t rev=1 -->
#### Scenario: winner-order-SC-110 - A bank transfer fee is the amount the operator entered
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an operator sent a bank transfer invoice with a subtotal of 312000
  and a bank transfer fee of 5000 minor units in HKD
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 5000 minor units in HKD
- **AND** the order total is 317000 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-16z rev=1 -->
#### Scenario: winner-order-SC-111 - A bank transfer fee of zero reads Free
**Serves:** Invoice - Payment Processing Fee priced by method

- **GIVEN** an operator sent a bank transfer invoice with a subtotal of 312000
  and a bank transfer fee of 0 minor units in HKD
- **WHEN** the winner opens the order
- **THEN** the Payment Processing Fee line is shown and reads Free
- **AND** the order total is 312000 minor units in HKD


<!-- trace:scenario id=g10.auction-winner-order.SC-ppq rev=1 -->
#### Scenario: winner-order-SC-215 - An invoice with no tax shows no Tax line
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding Tax
- **WHEN** the winner reads the invoice, receipt, or Order Summary
- **THEN** no Tax line is shown

<!-- trace:scenario id=g10.auction-winner-order.SC-deu rev=1 -->
#### Scenario: winner-order-SC-216 - Tax is included in the card fee base
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an invoice whose winning bid, buyer's premium, shipping, insurance,
  and Tax total 318000 minor units in HKD
- **WHEN** Grade10 prices its card payment processing fee
- **THEN** the Subtotal used for the gross-up is 318000 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-4z7 rev=1 -->
#### Scenario: winner-order-SC-214 - Tax is itemised on the invoice and receipt
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a paid auction order whose invoice includes Tax of 6000 minor units
  in HKD
- **WHEN** the winner reads the invoice and receipt
- **THEN** each shows Tax of 6000 minor units in HKD between Insurance and
  Subtotal

### Requirement: Insurance info tooltip

On Winner Order's order summary, Insurance explains itself when the line is
shown.

**Tooltip** - When the Insurance line is shown, Grade10 SHALL offer a brief
info tooltip beside it.

**Copy** - The tooltip SHALL read `0.9% of the order value during transit.`

<!-- trace:scenario id=g10.auction-winner-order.SC-yzf rev=1 -->
#### Scenario: winner-order-SC-169 - A shown Insurance line carries its info tooltip
**Serves:** winner-order-US-01 - the winner reads Order Summary while settling
the lot

- **GIVEN** an operator sent an invoice with Insurance of 4000 minor units in
  HKD
- **WHEN** the winner opens Winner Order
- **THEN** the Insurance line shows 4000 minor units in HKD
- **AND** the line offers a brief info tooltip
- **AND** the tooltip reads `0.9% of the order value during transit.`

<!-- trace:scenario id=g10.auction-winner-order.SC-2zt rev=1 -->
#### Scenario: winner-order-SC-170 - An absent Insurance line offers no tooltip
**Serves:** winner-order-US-01 - the winner reads Order Summary while settling
the lot

- **GIVEN** an operator sent an invoice without adding Insurance
- **WHEN** the winner opens Winner Order
- **THEN** no Insurance line is shown
- **AND** no Insurance tooltip is offered

### Requirement: Insurance before the invoice is sent

Before an operator sends the invoice, Order Summary names Insurance without an
amount.

**Before send** - Before an operator has sent the invoice, Winner Order's order
summary SHALL show Insurance as TBD with the other fee rows.

**No amount** - Grade10 SHALL NOT show a calculated Insurance amount before the
invoice is sent.

<!-- trace:scenario id=g10.auction-winner-order.SC-uii rev=1 -->
#### Scenario: winner-order-SC-171 - Insurance reads TBD before the invoice is sent
**Serves:** winner-order-US-01 - the winner reads Order Summary before the
invoice is sent

- **GIVEN** an auction order before an operator has sent its invoice
- **WHEN** the winner reads the order summary
- **THEN** Insurance is shown as TBD with the other fee rows
- **AND** no calculated Insurance amount is shown
- **AND** the Insurance line offers a brief info tooltip that reads
  `0.9% of the order value during transit.`

### Requirement: Grade10 computes the buyer's premium

Grade10 SHALL compute every invoice's buyer's premium; no operator SHALL
enter, waive or change it. The premium SHALL be the larger of:

1. 20% of the hammer price (read by the winner as Winning Bid) alone,
   rounded half up to the nearest minor unit, and
2. the minimum charge for the lot's currency.

Shipping, insurance and tax SHALL NOT be part of its base. The premium SHALL be
an integer count of minor units in the lot's currency.

Grade10 owns one minimum charge per supported currency:

| Currency | Minimum charge (minor units) |
| --- | --- |
| USD | 0 |
| HKD | 0 |
| JPY | 0 |

A minimum of 0 SHALL mean no minimum. A changed rate or minimum SHALL apply
to invoices sent or reissued after it takes effect; an invoice already sent
SHALL keep its amounts.

<!-- trace:scenario id=g10.auction-winner-order.SC-zhu rev=1 -->
#### Scenario: winner-order-SC-40 - The premium is 20% of the winning bid
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the HKD minimum charge is 20000 minor units
- **AND** an auction order with a hammer price of 250000 minor units in HKD
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 50000 minor units in HKD
- **AND** the operator was not asked to enter it

<!-- trace:scenario id=g10.auction-winner-order.SC-b16 rev=1 -->
#### Scenario: winner-order-SC-41 - The minimum charge applies when it is higher
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the HKD minimum charge is 20000 minor units
- **AND** an auction order with a hammer price of 50000 minor units in HKD
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 20000 minor units in HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-2mz rev=1 -->
#### Scenario: winner-order-SC-42 - A zero minimum leaves the rounded 20%
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the JPY minimum charge is 0
- **AND** an auction order with a hammer price of 1003 minor units in JPY
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 201 minor units in JPY

<!-- trace:scenario id=g10.auction-winner-order.SC-ip8 rev=1 -->
#### Scenario: winner-order-SC-43 - A sent invoice keeps its premium when the minimum changes
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** an invoice sent with a hammer price of 50000 and a buyer's premium of 10000 minor units in HKD while the HKD minimum was 0
- **WHEN** the HKD minimum changes to 20000 minor units
- **THEN** that invoice's buyer's premium stays 10000 minor units in HKD
- **AND** an invoice reissued for that order afterwards carries 20000 minor units in HKD

### Requirement: One invoice and one auction order per lot

Grade10 SHALL issue exactly one invoice and create exactly one auction order
per lot, and SHALL NOT combine lots won by the same winner into one invoice,
one deadline, or one shipment. Each order SHALL carry its own delivery
address, its own quote, its own payment deadline, and its own fulfilment
lifecycle.

<!-- trace:scenario id=g10.auction-winner-order.SC-a2i rev=1 -->
#### Scenario: winner-order-SC-06 - Two lots won together stay two orders
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** one winner who wins two lots in the same auction, closing at
  different times
- **WHEN** both lots close and an operator sends each invoice
- **THEN** Grade10 has created two auction orders and sent two invoices
- **AND** each carries its own payment deadline measured from its own
  invoice's send
- **AND** each is charged its own shipping

### Requirement: The account owns a reusable shipping address book

The platform auth service SHALL own the account's shipping address book. One
account SHALL be able to keep multiple named shipping addresses, up to a
maximum of five, and SHALL have at most one default. The address book SHALL
be available across storefronts that the account can use.

The winner order SHALL allow the winner to choose any saved address, add a new
address, edit an unused address, archive an address, and change the default.
An address selected for an order SHALL be copied into the order as a snapshot;
editing or archiving the saved address later SHALL NOT change that order.
The platform SHALL refuse to archive an address selected on an order in
Awaiting Setup that the winner has not yet confirmed, unless the winner
first selects another address for that order. Once the winner confirms, the
order holds its own snapshot: archiving the saved address is allowed and
leaves the order unchanged.

When the account's address book already holds five named addresses, the
winner order SHALL still let the winner add a new address and use it as the
current order's delivery address for that order alone; the platform SHALL
refuse to save that address into the account address book until the winner
removes an existing one to free a slot. An account that already holds more
than five named addresses (for example, from data that predates this cap)
SHALL keep those addresses and SHALL be refused any further save until its
count is below five. Editing an existing saved address SHALL NOT count as
adding one and SHALL NOT require a free slot. The address picker SHALL keep
a one-time address the winner has not saved visible and selectable ahead of
the account's saved addresses for the remainder of this order's confirmation.

<!-- trace:scenario id=g10.auction-winner-order.SC-ifg rev=1 -->
#### Scenario: winner-order-SC-22 - An account keeps multiple shipping addresses
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an account with no saved shipping addresses
- **WHEN** the winner saves a home address and a work address
- **THEN** both named addresses are available in the account address book
- **AND** the winner can choose either address for an auction order

<!-- trace:scenario id=g10.auction-winner-order.SC-r65 rev=1 -->
#### Scenario: winner-order-SC-23 - The account has one optional default
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an account with a home address set as its default
- **WHEN** the winner makes the work address the default
- **THEN** the work address is the only default
- **AND** a later order is pre-filled from the work address

<!-- trace:scenario id=g10.auction-winner-order.SC-la2 rev=1 -->
#### Scenario: winner-order-SC-24 - Editing a saved address does not rewrite an order
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid order whose delivery snapshot uses the home address
- **WHEN** the winner edits the saved home address in the account address book
- **THEN** the saved home address has the new value
- **AND** the order keeps the address snapshot it already showed

<!-- trace:scenario id=g10.auction-winner-order.SC-d5v rev=1 -->
#### Scenario: winner-order-SC-25 - A selected address cannot be archived silently
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an order in Awaiting Setup on which the winner has selected the work address and not yet confirmed it
- **WHEN** the winner tries to archive the work address
- **THEN** Grade10 asks the winner to select another address for that order
- **AND** does not remove the address while it remains selected

<!-- trace:scenario id=g10.auction-winner-order.SC-v7i rev=1 -->
#### Scenario: winner-order-SC-72 - Saving the fifth address still succeeds
**Serves:** winner-order-US-12 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with four saved shipping addresses
- **WHEN** the winner saves a fifth named address
- **THEN** the fifth address is added to the account address book
- **AND** the account holds five named addresses

<!-- trace:scenario id=g10.auction-winner-order.SC-0n0 rev=1 -->
#### Scenario: winner-order-SC-73 - Saving a sixth address is refused at the cap
**Serves:** winner-order-US-12 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner tries to save a sixth named address to the account address book
- **THEN** Grade10 refuses the save
- **AND** the account address book still holds only the five existing addresses

<!-- trace:scenario id=g10.auction-winner-order.SC-2hb rev=1 -->
#### Scenario: winner-order-SC-74 - A one-time address confirms the order at the cap
**Serves:** winner-order-US-12 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner adds a new address through Add new address and confirms it as the delivery address for the current order without saving it
- **THEN** the order's delivery snapshot uses the new address
- **AND** the account address book still holds only the five existing addresses

<!-- trace:scenario id=g10.auction-winner-order.SC-zbm rev=1 -->
#### Scenario: winner-order-SC-75 - Save this address for future orders is refused at the cap
**Serves:** winner-order-US-12 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner opens Add new address to enter a delivery address for the current order
- **THEN** Save this address for future orders is disabled and unchecked
- **AND** a short reason explains that the address book is full

<!-- trace:scenario id=g10.auction-winner-order.SC-esr rev=1 -->
#### Scenario: winner-order-SC-76 - Removing a saved address frees a slot
**Serves:** winner-order-US-12 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner archives one saved address and then saves a new named address
- **THEN** the new address is added to the account address book
- **AND** the account holds five named addresses again

<!-- trace:scenario id=g10.auction-winner-order.SC-5xy rev=1 -->
#### Scenario: winner-order-SC-77 - Editing a saved address does not consume a slot
**Serves:** winner-order-US-12 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner edits the details of one of the five saved addresses
- **THEN** the account address book still holds five named addresses
- **AND** the edit does not require freeing a slot first

<!-- trace:scenario id=g10.auction-winner-order.SC-bre rev=1 -->
#### Scenario: winner-order-SC-78 - An account already over the cap keeps its existing addresses
**Serves:** winner-order-US-12 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account that already holds six named addresses from before the cap existed
- **WHEN** the winner opens the account address book
- **THEN** all six named addresses remain available
- **AND** the platform refuses any further save until the count is below five

<!-- trace:scenario id=g10.auction-winner-order.SC-2ve rev=1 -->
#### Scenario: winner-order-SC-79 - The one-time address stays selectable ahead of the saved addresses
**Serves:** winner-order-US-12 - Winner confirms delivery when five addresses are already saved

- **GIVEN** an account with five saved shipping addresses
- **WHEN** the winner adds a one-time address through Add new address without saving it
- **THEN** the address picker lists the one-time address ahead of the five saved addresses
- **AND** the winner can still select it to confirm the order

<!-- trace:scenario id=g10.auction-winner-order.SC-eq0 rev=1 -->
#### Scenario: winner-order-SC-138 - Archiving a confirmed order's address leaves the order unchanged
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an order in Preparing Invoice whose winner confirmed the work address
- **WHEN** the winner archives the work address in the account address book
- **THEN** Grade10 archives it
- **AND** the order still holds the work address snapshot

### Requirement: The delivery address is confirmed before payment

Grade10 SHALL require the winner to confirm a delivery address and a payment
method on the auction order before an operator can send its invoice. When an
account default exists, Grade10 SHALL pre-fill the address from it, but the
default SHALL not become the order's destination until the winner confirms or
selects an address. Grade10 SHALL pre-select no payment method.

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
`payment_verifying`, Grade10 SHALL NOT offer or accept winner card payment.

<!-- trace:scenario id=g10.auction-winner-order.SC-aky rev=1 -->
#### Scenario: winner-order-SC-12 - The winning hold is released and the invoice is a fresh charge
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner holding an open bid-time authorization on the closing lot
- **WHEN** the lot closes
- **THEN** Grade10 releases that authorization at close without capturing it
- **AND** after an operator later sends a card invoice, the winner's payment is a
  single new transaction for the order total

<!-- trace:scenario id=g10.auction-winner-order.SC-tg2 rev=1 -->
#### Scenario: winner-order-SC-13 - An expired hold releases as a no-op
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner whose bid-time authorization expired before the lot closed
- **WHEN** the lot closes
- **THEN** Grade10 records the release as successful
- **AND** creates the auction order as normal

<!-- trace:scenario id=g10.auction-winner-order.SC-ai3 rev=1 -->
#### Scenario: winner-order-SC-14 - A losing bidder's hold is released at close
**Serves:** winner-order-US-01 - the lot close that opens the winner's order also frees every losing hold

- **GIVEN** a lot closing with one winner and three losing bidders holding
  open authorizations
- **WHEN** the lot closes
- **THEN** Grade10 releases all three losing authorizations
- **AND** does not wait for them to expire

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

### Requirement: Records the winner keeps

Each auction order SHALL carry these records, retrievable by the winner for
the life of their account. Grade10 SHALL archive every invoice PDF, replaced
invoices included, and every receipt PDF, and SHALL keep each retrievable for
at least 7 years, or for the life of the account if longer. Deleting the
account SHALL NOT shorten the 7 years.

| Record | When | Contents |
| --- | --- | --- |
| Payment receipt | Payment confirmed, by any route | A receipt ID, then itemised: winning bid, buyer's premium, Shipping & Handling, insurance when added, Tax when added, the subtotal, the payment processing fee, the order total, the invoice ID, the payment method, and the breakdown below |
| Shipping tracker | Fulfilment status is `fulfilled` | The tracking number, as the link to the carrier tracking page when the operator recorded a tracker link, plain text otherwise. No separate carrier name |
| Delivery proof | `delivery_confirmed` is set | Whatever the carrier provided - handover timestamp, signature, proof-of-delivery image |

Each receipt issued after this change SHALL carry a receipt ID, unique across
all such receipts: `RC-[CODE][INVOICE_SEQ]P[RECEIPT_SEQ]`, for example
`RC-LK42301P1`. `[CODE]` is the paid invoice's unchanged payment reference,
`[INVOICE_SEQ]` is that invoice's sequence without the `IN-` prefix, and
`[RECEIPT_SEQ]` counts finalized receipt-bearing payments on that invoice,
starting at `1` without padding. Grade10 SHALL allocate the next sequence
atomically with the finalized full or partial payment. A refund, reversal or
void SHALL allocate no receipt ID or rewrite one already issued. Receipt IDs
issued before this change, including `REC-...` IDs, remain unchanged. Formal
tax-receipt content remains outside this requirement.

Every receipt SHALL show this breakdown:

| Line | Value |
| --- | --- |
| Original Invoice Total | The paid invoice's order total |
| Previous Payments | The payments recorded against that invoice before this payment |
| Current Payment Received | The amount recorded for this payment |
| Remaining Balance Due | The amount still owed after this payment, floored at 0 once the invoice is Paid |

The four lines SHALL appear on receipts for a single full payment, ordered
partial payments, a payment that closes an invoice within the agreed tolerance,
and a confirmed overpayment. A tolerance-close or overpayment SHALL show
`Remaining Balance Due` as `0`; it SHALL NOT add a shortfall, write-off or
negative-credit line.

The values SHALL describe the invoice and payment state when the receipt was
issued. Grade10 SHALL NOT reissue a receipt or mutate an issued receipt after a
refund or reversal. A later receipt's `Previous Payments` value SHALL remain
the value recorded when that later receipt was issued.

This requirement governs receipt contents only. Winner Order's live balance
and its absence from the order page remain governed by the partial-payment
capability.

The receipt SHALL name the payment method:

| Route | Method shown |
| --- | --- |
| Card, paid by the winner | Card, with its brand and last four digits |
| Bank transfer, proof confirmed by an operator | Bank transfer |
| Recorded by an operator | Bank transfer, cash, or the description the operator gave for another method, with the external reference where one was recorded |

A receipt SHALL record the amount settled, the payment method, and the external
reference when one was recorded. No proof file, the winner's or an operator's,
SHALL appear on the receipt. It SHALL carry no settlement-origin badge.

<!-- trace:scenario id=g10.auction-winner-order.SC-49p rev=2 -->
#### Scenario: winner-order-SC-18 - A receipt is itemised and stays retrievable
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order paid at an order total of 316000 minor units in HKD
- **WHEN** the winner opens the order a year later
- **THEN** the receipt shows the winning bid, buyer's premium, Shipping &
  Handling, insurance, Tax when added, the subtotal, the payment processing
  fee, and the order total

<!-- trace:scenario id=g10.auction-winner-order.SC-9qq rev=1 -->
#### Scenario: winner-order-SC-19 - A manually settled receipt records payment facts
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order an operator settled by bank transfer with an
  external reference, after reissuing and replacing an earlier invoice
- **WHEN** the winner opens the receipt
- **THEN** it records the amount settled, which includes the payment processing
  fee, bank transfer as the method, and the external reference
- **AND** it carries no settlement-origin badge
- **AND** it shows no proof file

<!-- trace:scenario id=g10.auction-winner-order.SC-0wc rev=3 -->
#### Scenario: winner-order-SC-20 - The tracker appears once the lot is dispatched
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number attached
- **WHEN** the winner opens the order
- **THEN** it shows the tracking number as the link to the carrier tracking
  page when the operator recorded a tracker link, and as plain text otherwise
- **AND** it shows no separate carrier name

<!-- trace:scenario id=g10.auction-winner-order.SC-8xb rev=1 -->
#### Scenario: winner-order-SC-21 - Delivery proof records what the carrier provided
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** a dispatched auction order for which the carrier reports delivery
  with a handover timestamp and a signature
- **WHEN** `delivery_confirmed` is set
- **THEN** the order records that timestamp and that signature
- **AND** does not reduce them to a bare confirmation flag

<!-- trace:scenario id=g10.auction-winner-order.SC-g94 rev=1 -->
#### Scenario: winner-order-SC-36 - A card receipt names the card
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order the winner paid by a Visa card ending 4242
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads as a Visa card ending 4242

<!-- trace:scenario id=g10.auction-winner-order.SC-f2w rev=2 -->
#### Scenario: winner-order-SC-112 - Every receipt carries a receipt ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** one post-change order paid by card, one confirmed from bank transfer
  proof, and one settled manually
- **WHEN** the winner opens each receipt
- **THEN** each carries a receipt ID in the `RC-[CODE][INVOICE_SEQ]P1` form
- **AND** each names its invoice ID

<!-- trace:scenario id=g10.auction-winner-order.SC-vxf rev=1 -->
#### Scenario: winner-order-SC-113 - A confirmed bank transfer receipt names bank transfer
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose bank transfer proof an operator confirmed at an order total of 317000 minor units in HKD
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads Bank transfer and the amount paid is 317000 minor units in HKD
- **AND** it is not marked as manually settled
- **AND** it shows no proof file and no file name

<!-- trace:scenario id=g10.auction-winner-order.SC-kiz rev=2 -->
#### Scenario: winner-order-SC-131 - A receipt ID takes the paid invoice and the payment month
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an order whose bank transfer invoice is `IN-LK7P2Q02` and has an
  order total of 317000 minor units in HKD
- **WHEN** an operator confirms its first payment proof and the winner opens the receipt
- **THEN** the receipt ID is `RC-LK7P2Q02P1`
- **AND** it shows Original Invoice Total 317000, Previous Payments 0, Current Payment Received 317000 and Remaining Balance Due 0, in minor units of HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-e8v rev=1 -->
#### Scenario: winner-order-SC-132 - Two receipts never share an ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** two paid orders on different listings
- **WHEN** the winner opens both receipts
- **THEN** the two receipt IDs differ

<!-- trace:scenario id=g10.auction-winner-order.SC-pvg rev=2 -->
#### Scenario: winner-order-SC-135 - A repeated confirmation keeps one receipt ID
**Serves:** Records the winner keeps - receipt ID and breakdown

- **GIVEN** an auction order whose receipt ID is `RC-LK7P2Q01P1`
- **WHEN** the payment confirmation is delivered again
- **THEN** the receipt ID is still `RC-LK7P2Q01P1`
- **AND** no other receipt ID and no other internal audit number is issued

<!-- trace:scenario id=g10.auction-winner-order.SC-xqw rev=1 -->
#### Scenario: winner-order-SC-133 - Invoice and receipt PDFs outlive a deleted account
**Serves:** Records the winner keeps - retention

- **GIVEN** a paid order with a replaced invoice, its current invoice and a receipt, whose winner deleted their account a year after payment
- **WHEN** Grade10 retrieves the order's documents 6 years after payment
- **THEN** the replaced invoice PDF, the current invoice PDF and the receipt PDF are all returned

<!-- trace:scenario id=g10.auction-winner-order.SC-r8w rev=1 -->
#### Scenario: winner-order-SC-247 - A finalized first payment receives the new receipt ID
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** invoice `IN-LK42301` for an order whose payment reference is `LK423`
- **AND** it has no finalized receipt-bearing payment
- **WHEN** its first full or partial payment finalizes
- **THEN** its receipt ID is `RC-LK42301P1`

<!-- trace:scenario id=g10.auction-winner-order.SC-k31 rev=1 -->
#### Scenario: winner-order-SC-222 - Each finalized payment advances only its invoice's receipt sequence
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** invoice `IN-LK42301` has receipts through `RC-LK42301P9`
- **WHEN** another partial payment for it finalizes
- **THEN** the receipt ID is `RC-LK42301P10`
- **AND** a finalized payment on invoice `IN-LK42302` starts at `RC-LK42302P1`

<!-- trace:scenario id=g10.auction-winner-order.SC-4mt rev=1 -->
#### Scenario: winner-order-SC-223 - Historical and non-payment events do not receive the new receipt ID
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** a historical receipt ID is `REC-202609-LK7P2Q-01-P1`
- **WHEN** the receipt is read after this change is delivered
- **THEN** its ID remains unchanged
- **AND** a refund, reversal or void creates no receipt ID

<!-- trace:scenario id=g10.auction-winner-order.SC-6pw rev=1 -->
#### Scenario: winner-order-SC-246 - Nothing identifying the lot's order is shown before a winner exists
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** a lot that has not yet closed, and the same lot just after it closes with no winner
- **WHEN** anyone reads the lot outside a winning order
- **THEN** no payment reference, invoice ID, or receipt ID is shown for it
- **AND** the lot is identified only by its title

### Requirement: A lot close opens an order that waits for the winner's address

At lot close Grade10 SHALL, for the winner:

1. Create one auction order for the lot, with invoice status `not_issued` and
   fulfilment status `unfulfilled`, per `grade10-site/auction/order-status`.
2. Notify the winner that they have won and ask them to confirm a delivery
   address, per `grade10-site/auction/notifications-order`.

Grade10 SHALL NOT issue an invoice at lot close, and SHALL offer the winner no
way to pay until an operator has sent one.

When the winner confirms a delivery address, the order SHALL become ready for
an operator to quote, per `grade10-admin/auction/post-sale`. From then on the
winner SHALL NOT change the address, per "The delivery address locks when the
invoice is sent".

Order creation and the winner notice SHALL be idempotent. A lot
close delivered more than once SHALL produce one auction order.

<!-- trace:scenario id=g10.auction-winner-order.SC-l0b rev=1 -->
#### Scenario: winner-order-SC-26 - A lot close asks for an address, not payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a lot closing with a winner
- **WHEN** the lot closes
- **THEN** Grade10 creates one auction order with invoice status `not_issued`
  and fulfilment status `unfulfilled`
- **AND** issues no invoice
- **AND** asks the winner to confirm a delivery address

<!-- trace:scenario id=g10.auction-winner-order.SC-2p8 rev=2 -->
#### Scenario: winner-order-SC-27 - A repeated lot close creates nothing twice
**Serves:** Invoice at lot close - a repeated lot close creates nothing twice

- **GIVEN** a lot whose close has already created an auction order
- **WHEN** that same lot close is delivered again
- **THEN** Grade10 leaves one auction order
- **AND** does not notify the winner a second time

<!-- trace:scenario id=g10.auction-winner-order.SC-sko rev=1 -->
#### Scenario: winner-order-SC-28 - Confirming an address readies the order for a quote
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order waiting for its winner's address
- **WHEN** the winner confirms a delivery address
- **THEN** the order's derived status is Preparing Invoice
- **AND** the winner is offered no way to pay yet

### Requirement: The delivery address locks when the invoice is sent

The name is historical: the address and the payment method now lock for the
winner when the winner confirms them, before the invoice is sent.

Grade10 SHALL lock the delivery address and the payment method on an auction
order for the winner when the winner confirms them, and SHALL offer the
winner no self-service change to either afterwards, before or after the
invoice is sent. The order SHALL show the locked address and method and that
a change goes through Grade10.

| Order stage | Who changes the address or method |
| --- | --- |
| Awaiting Setup | The winner, freely, until they confirm |
| Preparing Invoice | Only an operator, per "An operator edits the address or method before send" in `grade10-admin/auction/post-sale`. The order stays Preparing Invoice |
| After the invoice is sent | Only an operator, through a reissue, per `grade10-admin/auction/post-sale` |

Winner Order SHALL show the address and method the order currently holds,
including an operator's edit.

Grade10 SHALL NOT offer a partial refund or a supplementary charge for a
shipping difference discovered after payment.

<!-- trace:scenario id=g10.auction-winner-order.SC-h7y rev=1 -->
#### Scenario: winner-order-SC-29 - A sent invoice refuses a self-service address change
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice has been sent and is `pending`
- **WHEN** the winner attempts to change the delivery address
- **THEN** Grade10 refuses the change
- **AND** the order shows the locked address and that a change goes through Grade10

<!-- trace:scenario id=g10.auction-winner-order.SC-34a rev=1 -->
#### Scenario: winner-order-SC-30 - A paid order refuses a self-service address change
**Serves:** `winner-order-US-01`, `winner-order-US-02` - the address stops moving, whether the winner is still settling or already settled

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** the winner attempts to change the delivery address
- **THEN** Grade10 refuses the change
- **AND** the delivery address is unchanged

<!-- trace:scenario id=g10.auction-winner-order.SC-k1a rev=1 -->
#### Scenario: winner-order-SC-106 - A sent invoice refuses a self-service method change
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice was sent for card and is `pending`
- **WHEN** the winner attempts to change the payment method to bank transfer
- **THEN** Grade10 refuses the change
- **AND** the invoice's method is still card

<!-- trace:scenario id=g10.auction-winner-order.SC-1hb rev=1 -->
#### Scenario: winner-order-SC-136 - A confirmed order refuses the winner's address or method change
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD in Preparing Invoice whose winner confirmed the home address and card
- **WHEN** the winner attempts to change the delivery address to the work address, or the payment method to bank transfer
- **THEN** Grade10 refuses each change
- **AND** the order still holds the home address and card
- **AND** the order shows that a change goes through Grade10
- **AND** the order is still Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-yc1 rev=1 -->
#### Scenario: winner-order-SC-137 - The winner sees an operator's edit before send
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD in Preparing Invoice whose winner confirmed the home address and card
- **WHEN** an operator edits the order to the work address and bank transfer
- **AND** the winner opens Winner Order
- **THEN** the order shows the work address and bank transfer
- **AND** the winner is offered no control to change either

### Requirement: The payment deadline is fixed when the invoice is sent

The payment deadline SHALL be 7 calendar days from the moment an operator
sends the invoice. Grade10 SHALL fix it at send and store it in UTC. Winner
Order SHALL display it in the viewer's local zone. The invoice PDF SHALL
display it in `Asia/Hong_Kong`, labelled `GMT+8`, per `shared/dates-and-times`.

Nothing the winner does SHALL move the deadline — not a failed payment, and
not leaving the order untouched — except uploading payment proof, which stops
it, per "The winner uploads payment proof once". While the invoice is
`payment_verifying` the deadline SHALL NOT run. When an operator returns the
proof, the deadline SHALL be the moment of return plus the time left at
upload. Otherwise only an operator SHALL set a new deadline, by reissuing the
invoice, per `grade10-admin/auction/post-sale`.

An auction order with no sent invoice SHALL have no payment deadline, and its
invoice status SHALL never become `expired`. The winner-facing address confirm
window is separate and does not write `expired` on the invoice.

When the deadline passes with the invoice `pending`, Grade10 SHALL set the
invoice status to `expired`, per `grade10-site/auction/order-status`, unless a
card payment Grade10 received before the deadline is still awaiting its
outcome. While that outcome is awaited the invoice stays `pending`, the order
reads Pending Payment and Winner Order offers no Pay Now, per
`grade10-admin/auction/post-sale`. A card session that ends unpaid after the
deadline - declined, timed out or abandoned - SHALL count as a failed outcome:
Grade10 SHALL write `expired` when the session ends, and the invoice SHALL NOT
stay `pending` past it. That replaces the timed-out and abandoned outcomes of
"An unfinished card payment leaves the invoice payable", which hold only
before the deadline. Otherwise the order reads Payment Overdue. The winner
SHALL NOT be offered card payment or proof upload while the invoice is
`expired`, and Pay Now stays closed; the order SHALL show Contact Us in its
overdue alert. An operator SHALL restore self-service payment only by
reissuing the invoice to `pending`, or SHALL settle manually or cancel, per
`grade10-admin/auction/post-sale`.

<!-- trace:scenario id=g10.auction-winner-order.SC-9nm rev=1 -->
#### Scenario: winner-order-SC-31 - The deadline is seven days from send
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice an operator sent at
  2026-09-12T09:00:00Z
- **AND** the winner opens Winner Order in a browser set to `America/New_York`
- **WHEN** the winner reads the order and its invoice PDF
- **THEN** the payment deadline is 2026-09-19T09:00:00Z
- **AND** Winner Order shows it as an absolute datetime at 05:00 `EDT`
- **AND** the invoice PDF shows it at 17:00 `GMT+8`
- **AND** no countdown is shown

<!-- trace:scenario id=g10.auction-winner-order.SC-9ea rev=1 -->
#### Scenario: winner-order-SC-33 - A declined payment does not move the deadline
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose sent invoice has a payment deadline of
  2026-09-19T09:00:00Z
- **WHEN** the winner's card is declined twice
- **THEN** the payment deadline is still 2026-09-19T09:00:00Z

<!-- trace:scenario id=g10.auction-winner-order.SC-1d9 rev=1 -->
#### Scenario: winner-order-SC-37 - An expired invoice refuses card payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner opens the order
- **THEN** Grade10 offers no card Pay control
- **AND** the overdue alert carries Contact Us
- **AND** a card payment attempt for that invoice is refused

<!-- trace:scenario id=g10.auction-winner-order.SC-6v5 rev=1 -->
#### Scenario: winner-order-SC-107 - A deadline that passes while proof is checked expires nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that became `payment_verifying` at 2026-09-13T09:00:00Z with a deadline of 2026-09-19T09:00:00Z
- **WHEN** 2026-09-20T09:00:00Z arrives with no operator action
- **THEN** the invoice is still `payment_verifying`
- **AND** the order derives as Payment Verifying

### Requirement: The address confirm window is 48 hours from lot close

The winner SHALL have 48 hours from lot close to confirm a delivery address on
the auction order. Grade10 SHALL show the absolute datetime under Confirm
delivery address while the window is open (`Confirm by …` in the winner's
zone). Progress Address subtext SHALL use the day-only form (`Confirm by …`
without time).

When the window passes without a confirmed address, Winner Order SHALL hide
Confirm delivery address and SHALL show Contact Us in an overdue alert that
reads `Missed address deadline: {date}` (day-only, no middle-dot separator).
Derived order status SHALL be Setup Overdue. Invoice status SHALL remain
`not_issued` and SHALL NOT become `expired`. Grade10 SHALL NOT cancel the order
or suspend bidding solely because the address window passed; an operator
follows up per `grade10-admin/auction/post-sale`.

<!-- trace:scenario id=g10.auction-winner-order.SC-d74 rev=1 -->
#### Scenario: winner-order-SC-32 - An unpaid address wait never expires the invoice
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose winner has confirmed no delivery address
  30 days after its lot closed
- **WHEN** its derived status is read
- **THEN** it is Setup Overdue
- **AND** its invoice status is `not_issued`, never `expired`

<!-- trace:scenario id=g10.auction-winner-order.SC-gqs rev=1 -->
#### Scenario: winner-order-SC-70 - Address confirm is due 48 hours after lot close
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a lot that closed at 2026-09-17T13:30:00Z
- **AND** its auction order is Awaiting Setup inside the confirm window
- **WHEN** the winner opens Winner Order
- **THEN** Confirm delivery address is offered
- **AND** the confirm deadline shown under the control is 2026-09-19T13:30:00Z
  displayed in the viewer's local zone as an absolute datetime
- **AND** no countdown is shown

<!-- trace:scenario id=g10.auction-winner-order.SC-36a rev=1 -->
#### Scenario: winner-order-SC-71 - A missed address deadline hides Confirm
**Serves:** winner-order-US-07 - Winner misses the address deadline

- **GIVEN** an auction order still Awaiting Setup whose address confirm
  window has passed
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no Confirm delivery address control
- **AND** the overdue alert reads Missed address deadline with the day-only
  date and carries Contact Us
- **AND** derived status is Setup Overdue
- **AND** invoice status remains `not_issued`

### Requirement: Winner Order removes the self-service action for each overdue outcome

Winner Order SHALL show Payment Overdue when an invoice expires and SHALL
remove Pay, while retaining Contact Us and the order's payment facts. It SHALL
show Setup Overdue when address setup expires before invoice send and SHALL
remove Confirm, while retaining Contact Us and the order's address facts. The
winner SHALL not be offered a way to reopen either window.

<!-- trace:scenario id=g10.auction-winner-order.SC-9vf rev=1 -->
#### Scenario: winner-order-SC-158 - Payment Overdue removes Pay
**Serves:** winner-order-US-05 - Winner misses the payment deadline

- **GIVEN** an order with an expired invoice
- **WHEN** the winner opens Winner Order
- **THEN** it reads Payment Overdue
- **AND** Pay is absent while Contact Us remains

<!-- trace:scenario id=g10.auction-winner-order.SC-k2b rev=1 -->
#### Scenario: winner-order-SC-159 - Setup Overdue removes Confirm
**Serves:** winner-order-US-07 - Winner misses the address deadline

- **GIVEN** an order without a sent invoice whose address deadline passed
- **WHEN** the winner opens Winner Order
- **THEN** it reads Setup Overdue
- **AND** Confirm is absent while Contact Us remains

### Requirement: Winner Order shows five progress steps

Winner Order SHALL present settlement progress as five steps in this order:
**Address**, **Invoice**, **Payment**, **Shipping**, **Completed**. The steps
SHALL be presentation only and SHALL NOT replace the derived order status
vocabulary in `grade10-site/auction/order-status`.

| Current step | Derived order status |
| --- | --- |
| Address | Awaiting Setup or Setup Overdue |
| Invoice | Preparing Invoice |
| Payment | Pending Payment (invoice `pending`), Payment Overdue (invoice `expired`), or Payment Verifying |
| Shipping | Preparing Shipment or Shipped |
| Completed | Delivered |

When the derived order status is **Cancelled** or **Refunded**, Winner Order
SHALL show no progress stepper.

Step subtext SHALL use day-only dates in the winner's zone. While Address is
current and awaiting confirm, subtext SHALL read `Confirm by {date}`. While
Payment is current and the invoice is `pending`, subtext SHALL read
`Pay by {date}`. While the invoice is `payment_verifying`, Payment subtext
SHALL name no date. While Shipping is current and the derived status is
**Preparing Shipment**, Shipping subtext SHALL read **Preparing to ship**.
While Shipping is current and the derived status is **Shipped**, Shipping
subtext SHALL use the day-only ship date when one is known. Description copy SHALL wrap so five columns do not
overflow.

<!-- trace:scenario id=g10.auction-winner-order.SC-11o rev=1 -->
#### Scenario: winner-order-SC-54 - Pending Payment highlights the Payment step
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose derived status is Pending Payment
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Payment as the current step
- **AND** Address and Invoice are complete

<!-- trace:scenario id=g10.auction-winner-order.SC-fpp rev=1 -->
#### Scenario: winner-order-SC-55 - Processing maps under Shipped
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

The scenario title is historical for its permanent trace identity. Its normative
Given, When and Then use the current Preparing Shipment and Shipping vocabulary.

- **GIVEN** an auction order whose derived status is Preparing Shipment
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Shipping as the current (progress) step
- **AND** Shipping subtext reads Preparing to ship
- **AND** the title badge uses Badge `default`
- **AND** does not invent a Preparing Shipment step label
- **AND** does not leave Shipping incomplete or upcoming while Payment is complete

<!-- trace:scenario id=g10.auction-winner-order.SC-lk0 rev=2 -->
#### Scenario: winner-order-SC-253 - A shipped order keeps Shipping current
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose derived status is Shipped, with a day-only
  ship date and a tracking number when one is known
- **WHEN** the winner opens Winner Order
- **THEN** the title badge uses Badge `default`
- **AND** Shipping is the current progress step with the day-only ship date
- **AND** a tracking number is the external carrier link when the operator
  recorded a tracker link, and plain text otherwise
- **AND** Order Progress adds no separate Track shipment control and no separate carrier name

<!-- trace:scenario id=g10.auction-winner-order.SC-fm0 rev=1 -->
#### Scenario: winner-order-SC-56 - Cancelled hides the stepper
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose derived status is Cancelled
- **WHEN** the winner opens Winner Order
- **THEN** no progress stepper is shown

<!-- trace:scenario id=g10.auction-winner-order.SC-wsm rev=1 -->
#### Scenario: winner-order-SC-66 - Progress dates are day-only
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice is `pending` with a payment deadline
  of 2026-09-26T03:00:00Z
- **WHEN** the winner opens Winner Order
- **THEN** Payment step subtext reads Pay by with the day-only date
- **AND** the Pay control still shows the absolute datetime with time

<!-- trace:scenario id=g10.auction-winner-order.SC-sd5 rev=1 -->
#### Scenario: winner-order-SC-108 - Payment Verifying stays on the Payment step with no date
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose derived status is Payment Verifying
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Payment as the current step
- **AND** the Payment subtext names no date

### Requirement: The winner can view the sent invoice as a PDF

Once an operator has sent an invoice on an auction order, Winner Order SHALL
offer the winner a control to view and download the current invoice as a PDF.
The control SHALL use a PDF icon with the label **Invoice** (accessible name
Invoice PDF), SHALL render as a text link (not a button), and SHALL sit beside
the Order summary heading. The control SHALL be hidden while the invoice
status is `not_issued` and SHALL be hidden when the invoice status is
`cancelled`. The PDF SHALL carry the invoice ID and the payment method it was
sent for.

<!-- trace:scenario id=g10.auction-winner-order.SC-41c rev=1 -->
#### Scenario: winner-order-SC-57 - A sent invoice offers its PDF
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `pending`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers view and download of the invoice PDF

<!-- trace:scenario id=g10.auction-winner-order.SC-ncd rev=1 -->
#### Scenario: winner-order-SC-64 - No invoice PDF before send
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `not_issued`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no invoice PDF control

<!-- trace:scenario id=g10.auction-winner-order.SC-uet rev=1 -->
#### Scenario: winner-order-SC-65 - A cancelled order hides the invoice PDF
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `cancelled`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no invoice PDF control

<!-- trace:scenario id=g10.auction-winner-order.SC-qpe rev=1 -->
#### Scenario: winner-order-SC-109 - A reissued order offers the current invoice
**Serves:** Invoice - a replacement invoice names the invoice it replaces

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** the winner opens the invoice PDF from Winner Order
- **THEN** it is the new invoice, carrying the new invoice ID

### Requirement: The winner can view the payment receipt as a PDF

After payment is confirmed on an auction order — by the winner's card, by an
operator confirming the winner's bank transfer proof, or by operator manual
settlement — Winner Order SHALL offer the winner a control to view and
download the itemised payment receipt as a PDF. The control SHALL use a PDF
icon with the label **Receipt** (accessible name Receipt PDF), SHALL render as
a text link (not a button), and SHALL sit under the payment-method card —
not on the same row as the invoice PDF. The control SHALL be hidden before
payment, while the invoice is `payment_verifying`, and when Cancelled.

<!-- trace:scenario id=g10.auction-winner-order.SC-aaq rev=1 -->
#### Scenario: winner-order-SC-67 - A paid order offers its receipt PDF
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers view and download of the receipt PDF under the payment-method card
- **AND** the Invoice PDF control remains available beside the Order summary heading

<!-- trace:scenario id=g10.auction-winner-order.SC-08s rev=1 -->
#### Scenario: winner-order-SC-68 - No receipt PDF before payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `pending` or `payment_verifying`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no receipt PDF control

### Requirement: An invoice calculates the buyer's premium

When Grade10 creates or reissues an auction invoice, the buyer's premium SHALL
be the larger of 20% of the winning bid and the current minimum for the invoice
currency. The percentage amount is rounded to the nearest minor unit with half
values rounded up. A minimum of 0 means no minimum. The
premium SHALL be included in the invoice final amount and in every invoice
receipt. A bid panel SHALL disclose only the 20% rate; it SHALL not display this
calculated amount before an invoice exists.

<!-- trace:scenario id=g10.auction-winner-order.SC-30s rev=1 -->
#### Scenario: grade10-site-auction-winner-order-SC-46 - Invoice carries 20% of the winning bid
**Serves:** winner-order-US-08 - Winner pays an invoice with a policy premium

- **GIVEN** a winning bid of 250000 HKD minor units
- **WHEN** Grade10 creates the winner's invoice
- **THEN** the invoice buyer's premium is 50000 HKD minor units
- **AND** the final amount includes that 50000 HKD premium

<!-- trace:scenario id=g10.auction-winner-order.SC-ml2 rev=1 -->
#### Scenario: grade10-site-auction-winner-order-SC-47 - Fractional minor-unit premium rounds deterministically
**Serves:** winner-order-US-08 - Winner pays an invoice with a policy premium

- **GIVEN** a winning bid of 101 USD minor units
- **WHEN** Grade10 creates the winner's invoice
- **THEN** the buyer's premium is 20 USD minor units
- **AND** the amount is an integer minor-unit value

### Requirement: The address form refuses empty required fields

In Awaiting Setup the winner SHALL confirm a delivery address and a billing
address with the fields named by the existing address form. Billing SHALL
default to the delivery address and SHALL be confirmed with the delivery
address and payment method.

Confirming with any required field empty SHALL be refused, SHALL show an error
on each empty required field, and SHALL keep the order in Awaiting Setup.
Phone country and digits SHALL be required; a missing phone country or missing
digits SHALL show one field refusal beside Phone. Grade10 SHALL store the phone
as E.164 when parseable and SHALL NOT refuse unusual formats. The winner MAY
untick Same as delivery address and choose a saved or one-time billing address.
Cancel SHALL leave the order in Awaiting Setup with no address confirmed.

<!-- trace:scenario id=g10.auction-winner-order.SC-nle rev=1 -->
#### Scenario: winner-order-SC-152 - Same delivery details bill the order by default
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on the order-setup form with a complete delivery address
- **WHEN** the winner opens the billing step
- **THEN** Same as delivery address is selected by default
- **AND** the delivery address is shown as the billing address
- **AND** the winner can confirm setup with the delivery address and payment method

<!-- trace:scenario id=g10.auction-winner-order.SC-qnq rev=1 -->
#### Scenario: winner-order-SC-153 - A different saved address is captured for billing
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on the billing step with Same as delivery address selected
- **WHEN** the winner unticks it and chooses a saved address
- **THEN** the second address is used as the billing address
- **AND** the delivery address remains the shipping address
- **AND** both addresses are confirmed with the payment method

<!-- trace:scenario id=g10.auction-winner-order.SC-es5 rev=1 -->
#### Scenario: winner-order-SC-185 - An empty phone country is refused
**Serves:** winner-order-US-01 - confirming Add Address without a phone country

- **GIVEN** a winner on Add Address with phone digits entered and phone country empty
- **WHEN** the winner confirms the address
- **THEN** Grade10 refuses applying the address
- **AND** a field refusal shows beside Phone
- **AND** the order stays in Awaiting Setup

<!-- trace:scenario id=g10.auction-winner-order.SC-zit rev=1 -->
#### Scenario: winner-order-SC-186 - Empty phone digits are refused
**Serves:** winner-order-US-01 - confirming Add Address without phone digits

- **GIVEN** a winner on Add Address with a phone country selected and no digits entered
- **WHEN** the winner confirms the address
- **THEN** Grade10 refuses applying the address
- **AND** a field refusal shows beside Phone
- **AND** the order stays in Awaiting Setup

### Requirement: Invoices and receipts show immutable billing and delivery snapshots

The invoice and receipt identify the address that is billed separately from the
address where the lot is shipped.

**Invoice and receipt** — An invoice SHALL show Bill To and Ship To from the
order's confirmed snapshots. A receipt SHALL show the addresses of the invoice
it pays and SHALL NOT change when a saved address is edited or archived later.

<!-- trace:scenario id=g10.auction-winner-order.SC-ubz rev=1 -->
#### Scenario: winner-order-SC-154 - Bill To and Ship To stay on the paid receipt
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** a paid order whose billing and delivery snapshots are different
- **WHEN** the winner opens its invoice and receipt
- **THEN** both documents show Bill To and Ship To
- **AND** the receipt carries the same addresses as the invoice it pays
- **AND** editing the saved billing address does not change either document

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

**Offered by currency** - Grade10 SHALL offer bank transfer only in a currency
with bank details set up.

| Currency | Methods offered |
| --- | --- |
| HKD | Card, bank transfer |
| USD | Card |
| JPY | Card |

**Refused** - Grade10 SHALL refuse a confirmation with no method chosen, and
SHALL refuse bank transfer on an order whose currency does not offer it.

**Locked on confirmation** - Until the winner confirms, they SHALL be able to
change the method freely. Once they confirm, the method locks for the winner,
per "The delivery address locks when the invoice is sent".

<!-- trace:scenario id=g10.auction-winner-order.SC-v59 rev=1 -->
#### Scenario: winner-order-SC-90 - The method is recorded with the address
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Setup
- **WHEN** the winner confirms a delivery address and chooses bank transfer
- **THEN** the order records bank transfer as its payment method
- **AND** the order derives as Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-8dl rev=1 -->
#### Scenario: winner-order-SC-91 - The choice shows a fee range and no bank transfer amount
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order in HKD Awaiting Setup
- **WHEN** the winner reaches the payment method choice
- **THEN** card and bank transfer each show the fee range text Grade10 set
- **AND** the bank transfer text names no amount
- **AND** neither method is selected

<!-- trace:scenario id=g10.auction-winner-order.SC-1aa rev=1 -->
#### Scenario: winner-order-SC-92 - A currency with no bank details offers card only
**Serves:** Payment method - bank transfer only where bank details are set up

- **GIVEN** an auction order in USD Awaiting Setup
- **WHEN** the winner reaches the payment method choice
- **THEN** only card is offered
- **AND** a confirmation carrying bank transfer for that order is refused

<!-- trace:scenario id=g10.auction-winner-order.SC-pt5 rev=1 -->
#### Scenario: winner-order-SC-93 - The method can change until the winner confirms
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order in HKD Awaiting Setup on which the winner has chosen card and not yet confirmed
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

### Requirement: A bank transfer invoice shows how to pay

A pending bank transfer invoice tells the winner where to send the money and
what reference to quote.

**Three ways to pay** - While an invoice sent for bank transfer is `pending`,
Winner Order SHALL show these three ways to pay in place of card Pay. Each
SHALL ask the winner to quote the invoice's bank reference. Submit Payment
Proof SHALL offer icon copy controls for the account number / IBAN, the total
amount due, and the transfer reference (each with a success toast on copy).
The account details are TBC.

| Way to pay | Details shown |
| --- | --- |
| SWIFT | Beneficiary name, SWIFT/BIC, account number or IBAN |
| FPS | FPS ID, beneficiary name |
| Hong Kong local bank transfer | Bank name and bank code, beneficiary name, account number |

**No card Pay** - Grade10 SHALL offer no card Pay control on a bank transfer
invoice and SHALL refuse a card payment attempted against one. A winner who
wants to pay by card asks Grade10, and an operator reissues the invoice.

<!-- trace:scenario id=g10.auction-winner-order.SC-bmm rev=1 -->
#### Scenario: winner-order-SC-95 - A bank transfer invoice shows three ways and the reference
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** the winner opens Winner Order
- **THEN** SWIFT, FPS and Hong Kong local bank transfer details are shown with the fields above
- **AND** each asks the winner to quote the bank reference
- **AND** no card Pay control is offered

<!-- trace:scenario id=g10.auction-winner-order.SC-dvp rev=1 -->
#### Scenario: winner-order-SC-96 - A card payment on a bank transfer invoice is refused
**Serves:** Bank transfer - card Pay is not offered on a bank transfer invoice

- **GIVEN** an auction order whose invoice was sent for bank transfer and is `pending`
- **WHEN** a card payment is attempted for that invoice
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

### Requirement: Invoices and receipts carry an internal audit number

Every invoice and receipt takes the next number in one count that operators
read and the winner never sees.

**Internal audit number** - Grade10 SHALL give every invoice and every receipt
an internal audit number when it is issued: one gapless sequence shared by
invoices and receipts, in the order they are issued, for example `#00010482`.

**On a reissue** - A replaced invoice SHALL keep its number, and a reissue
SHALL take the next one.

**Operators only** - The number SHALL NOT reach the winner: not on any PDF,
letter, or Winner Order. Operators read it per
`grade10-admin/auction/post-sale`.

<!-- trace:scenario id=g10.auction-winner-order.SC-xpb rev=1 -->
#### Scenario: winner-order-SC-129 - The winner never sees the internal audit number
**Serves:** Invoice - internal audit number

- **GIVEN** a paid order whose invoice holds internal audit number `#00010482` and whose receipt holds `#00010483`
- **WHEN** the winner opens Winner Order, the invoice PDF, the receipt PDF and every letter sent about the order
- **THEN** neither `#00010482` nor `#00010483` appears in any of them

<!-- trace:scenario id=g10.auction-winner-order.SC-3y8 rev=1 -->
#### Scenario: winner-order-SC-130 - Invoices and receipts share one gapless count
**Serves:** Invoice - internal audit number

- **GIVEN** the last internal audit number issued is `#00010481`
- **WHEN** an operator sends an invoice, then reissues it, then the winner pays the new invoice by card, with nothing else issued meanwhile
- **THEN** the first invoice holds `#00010482`, the new invoice `#00010483` and the receipt `#00010484`
- **AND** the replaced invoice still holds `#00010482`

### Requirement: The winner uploads payment proof once

The winner sends proof of a bank transfer in one upload, and Grade10 holds the
invoice while an operator checks it.

**Payment proof** - On an invoice sent for bank transfer whose status is
`pending`, the winner SHALL be able to send Grade10 proof of payment once:

1. Choose 1 to 3 files (**1** required). Each file SHALL be a PDF, PNG, JPG
   (JPEG), or HEIC/HEIF of at most **5 MB** (5,242,880 bytes). The set SHALL
   total at most **15 MB** (15,728,640 bytes). HEIC/HEIF SHALL be converted to
   JPEG before storage so an operator can open it without a special viewer.
2. Read irreversible microcopy saying nothing can be added or changed after
   submit (inline in Submit Payment Proof - no second confirm screen).
3. Confirm submit.

**On confirm** - On a successful confirm Grade10 SHALL store the files against
the invoice, set the invoice status to `payment_verifying`, stop the payment
deadline and record the time left, per `grade10-site/auction/order-status`,
and write a proof-uploaded entry to the invoice log. The order SHALL derive as
Payment Verifying. Winner Order SHALL show a success toast titled **Proof
submitted** with description **We'll verify your payment shortly.** for an
English locale, and localized copy for Simplified Chinese and Traditional
Chinese. No letter is sent.

**Payment Verifying** - While the invoice is `payment_verifying`, Winner Order
SHALL show no payment deadline running, SHALL offer no card Pay and no upload,
SHALL hide Submit Payment Proof and View Bank Details, and SHALL refuse a
further upload. It SHALL show an inline default Alert with the Hourglass icon,
stating that Grade10 is verifying the transfer and will email when payment is
confirmed. The Alert sits under Order progress on small viewports and under the
lot from `lg` up, where the Preparing Invoice alert sits.

**Busy** - While the upload is submitting, or while HEIC/HEIF is converting,
Submit Payment Proof SHALL lock the whole form and SHALL block leave (Cancel,
Escape and overlay dismiss do nothing) until that beat finishes.

**Refused** - Grade10 SHALL refuse the whole upload and store nothing when any
file breaks step 1. It SHALL judge a file's type by its content, not its name:
a file whose content is not PDF, PNG, JPEG, HEIC or HEIF SHALL be refused and
never relabelled. Grade10 SHALL refuse a confirm with no file, and SHALL refuse an
upload on a card invoice, on any invoice not `pending`, and from anyone but
the order's winner.

**Nothing stored until it succeeds** - Leaving Submit Payment Proof without a
successful confirm SHALL store nothing. An upload that fails part-way SHALL
store nothing, leave the invoice `pending`, keep Submit Payment Proof open with
the draft the winner had entered, and show an error toast titled **Proof not
submitted** with description **Nothing was saved. Try again.** for an English
locale, and localized copy for Simplified Chinese and Traditional Chinese; the
winner may upload again. The one upload counts only once an upload succeeds.

**Who reads the files** - Payment proof files SHALL be readable by any operator
who can open the order, per `grade10-admin/auction/post-sale`, and never by the
winner. Winner Order, the receipt and every letter SHALL show no payment proof
file and no file name, the winner's or an operator's. Only the Payment Verifying
status shows that proof was sent.

<!-- trace:scenario id=g10.auction-winner-order.SC-bsl rev=2 -->
#### Scenario: winner-order-SC-99 - Uploading proof stops the deadline
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice, `pending`, with a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** the winner uploads two PDF files and confirms at 2026-09-13T09:00:00Z
- **THEN** the invoice is `payment_verifying` and the order derives as Payment Verifying
- **AND** the time left recorded is 6 days
- **AND** Winner Order offers no card Pay and no further upload
- **AND** Submit Payment Proof and View Bank Details are hidden

<!-- trace:scenario id=g10.auction-winner-order.SC-q86 rev=1 -->
#### Scenario: winner-order-SC-100 - Files outside the limits are refused
**Serves:** Bank transfer - one upload of 1 to 3 files

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner confirms four files, or a PNG with a JPEG of 5,242,881 bytes, or a PDF with a GIF, or a set over 15 MB
- **THEN** Grade10 refuses each whole upload
- **AND** stores no file
- **AND** the invoice is still `pending`

<!-- trace:scenario id=g10.auction-winner-order.SC-fgj rev=1 -->
#### Scenario: winner-order-SC-101 - A second upload is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that is `payment_verifying`
- **WHEN** an upload is attempted against it
- **THEN** Grade10 refuses it
- **AND** the files already stored are unchanged

<!-- trace:scenario id=g10.auction-winner-order.SC-7jw rev=2 -->
#### Scenario: winner-order-SC-102 - Leaving the confirm step uploads nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner chooses one PNG, reads the irreversible microcopy, and leaves without confirming
- **THEN** no file is stored
- **AND** the invoice is still `pending` and the winner can upload

<!-- trace:scenario id=g10.auction-winner-order.SC-01a rev=1 -->
#### Scenario: winner-order-SC-103 - No upload on an expired or card invoice
**Serves:** Bank transfer - proof is uploaded only on a pending bank transfer invoice

- **GIVEN** one bank transfer invoice that is `expired` and one card invoice that is `pending`
- **WHEN** an upload is attempted against each
- **THEN** Grade10 refuses both
- **AND** neither invoice changes status

<!-- trace:scenario id=g10.auction-winner-order.SC-ymi rev=1 -->
#### Scenario: winner-order-SC-115 - The winner never sees proof files
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose winner uploaded "transfer-slip.pdf", which an operator confirmed after adding a bank statement
- **WHEN** the winner opens Winner Order and the receipt, and requests either stored file
- **THEN** neither file nor its name is shown
- **AND** Grade10 refuses both requests

<!-- trace:scenario id=g10.auction-winner-order.SC-9ec rev=1 -->
#### Scenario: winner-order-SC-116 - A file of exactly 5 MB is accepted
**Serves:** Bank transfer - one upload of 1 to 3 files

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner uploads one PDF of 5,242,880 bytes and confirms
- **THEN** the invoice is `payment_verifying`

<!-- trace:scenario id=g10.auction-winner-order.SC-67v rev=1 -->
#### Scenario: winner-order-SC-117 - A card payment while proof is checked is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an invoice that is `payment_verifying`
- **WHEN** the winner tries to start a card payment for it
- **THEN** Grade10 starts none and makes no charge
- **AND** the invoice is still `payment_verifying`

<!-- trace:scenario id=g10.auction-winner-order.SC-d3x rev=1 -->
#### Scenario: winner-order-SC-118 - No upload before send or after payment
**Serves:** Bank transfer - proof is uploaded only on a pending bank transfer invoice

- **GIVEN** one order in Preparing Invoice with bank transfer chosen, and one whose bank transfer invoice is `paid`
- **WHEN** the winner opens each, and an upload is attempted against each
- **THEN** neither offers an upload
- **AND** Grade10 refuses both attempts

<!-- trace:scenario id=g10.auction-winner-order.SC-uxu rev=2 -->
#### Scenario: winner-order-SC-119 - An upload that fails part-way stores nothing
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending` and Submit Payment Proof open with a filled draft
- **WHEN** the winner confirms three files and the upload fails before it completes
- **THEN** no file is stored and the invoice is still `pending`
- **AND** Submit Payment Proof stays open with the draft
- **AND** an error toast reads **Proof not submitted** / **Nothing was saved. Try again.**
- **AND** the winner can upload again

<!-- trace:scenario id=g10.auction-winner-order.SC-7nh rev=1 -->
#### Scenario: winner-order-SC-121 - Another collector cannot upload proof
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** an auction order whose bank transfer invoice is `pending`, won by another collector
- **WHEN** a signed-in collector who is not its winner attempts an upload against it
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

<!-- trace:scenario id=g10.auction-winner-order.SC-8q1 rev=1 -->
#### Scenario: winner-order-SC-218 - Successful proof submit shows the success toast
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner confirms a valid proof upload
- **THEN** the invoice is `payment_verifying` and the order derives as Payment Verifying
- **AND** a success toast reads **Proof submitted** / **We'll verify your payment shortly.**
- **AND** an inline default Hourglass Alert says Grade10 is verifying the transfer and will email when payment is confirmed, under Order progress on small viewports and under the lot from `lg` up

<!-- trace:scenario id=g10.auction-winner-order.SC-bb1 rev=1 -->
#### Scenario: winner-order-SC-219 - Leave is blocked while submitting or converting
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** Submit Payment Proof is open and either the upload is submitting or HEIC conversion is running
- **WHEN** the winner tries Cancel, Escape or overlay dismiss
- **THEN** the dialog stays open
- **AND** the form stays locked until that beat finishes

<!-- trace:scenario id=g10.auction-winner-order.SC-8uw rev=1 -->
#### Scenario: winner-order-SC-220 - Confirm stays inline microcopy
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** the winner opens Submit Payment Proof
- **THEN** irreversible microcopy says nothing can be added or changed after submit
- **AND** no second confirm screen is shown

<!-- trace:scenario id=g10.auction-winner-order.SC-ddi rev=1 -->
#### Scenario: winner-order-SC-239 - A file whose content is not a type Grade10 takes is refused
**Serves:** winner-order-US-09 - Winner pays an invoice by bank transfer

- **GIVEN** a bank transfer invoice that is `pending`
- **WHEN** an upload carries a GIF file named `slip.jpg`
- **THEN** Grade10 refuses the whole upload and stores no file
- **AND** the invoice is still `pending`

### Requirement: Returned proof reopens the invoice

When an operator sends proof back, the winner reads why, the deadline runs
again, and they upload again.

**Proof not accepted** - When an operator returns a `payment_verifying`
invoice to `pending`, per `grade10-admin/auction/post-sale`, Winner Order
SHALL show the operator's latest external reason and the new payment deadline,
which is the moment of return plus the time left at upload. No grace is added,
however little time was left.

**Upload again** - The winner SHALL then be able to upload proof again, under
the same rules as the first upload.

**Internal reason** - The operator's internal reason SHALL NOT be shown to the
winner.

**Latest reason only** - After a second return Winner Order SHALL show only
the latest external reason; the invoice log keeps every reason, per
`grade10-admin/auction/post-sale`.

<!-- trace:scenario id=g10.auction-winner-order.SC-xdj rev=1 -->
#### Scenario: winner-order-SC-104 - A returned invoice shows the reason and the time that was left
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice the winner uploaded proof for at 2026-09-13T09:00:00Z, with a deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator returns it at 2026-09-16T09:00:00Z with the external reason "Amount does not match" and an internal reason
- **THEN** the invoice is `pending` with a payment deadline of 2026-09-22T09:00:00Z
- **AND** Winner Order shows "Amount does not match"
- **AND** Winner Order does not show the internal reason

<!-- trace:scenario id=g10.auction-winner-order.SC-o2b rev=1 -->
#### Scenario: winner-order-SC-105 - A returned invoice accepts a new upload
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice an operator returned to `pending`
- **WHEN** the winner uploads one PDF and confirms
- **THEN** the invoice is `payment_verifying`
- **AND** the deadline stops again with the time left recorded

<!-- trace:scenario id=g10.auction-winner-order.SC-adl rev=1 -->
#### Scenario: winner-order-SC-120 - A return adds no grace
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice that became `payment_verifying` with 1 minute left
- **WHEN** an operator returns it at 2026-09-16T09:00:00Z and 2026-09-16T09:01:00Z passes unpaid
- **THEN** the invoice is `expired` and the order reads Payment Overdue
- **AND** Winner Order offers no upload and shows Contact Us in its overdue alert

<!-- trace:scenario id=g10.auction-winner-order.SC-tt1 rev=1 -->
#### Scenario: winner-order-SC-134 - Only the latest return reason is shown
**Serves:** winner-order-US-10 - Winner's payment proof is not accepted

- **GIVEN** a bank transfer invoice an operator returned with the external reason "Amount does not match", then returned again with "Reference missing" after a second upload
- **WHEN** the winner opens Winner Order
- **THEN** it shows "Reference missing"
- **AND** it does not show "Amount does not match"
- **AND** the invoice log holds both reasons

### Requirement: Contact Us opens a copy-first ready email

When Contact Us is offered on a locked Winner Order, the winner reaches
Grade10 through a ready email they can copy into any mail app.

**Opens** — Contact Us SHALL open a dialog. It SHALL NOT open a mail client
as the first action, and SHALL NOT show only a toast that names the address.

**Hidden until open** — `support@grade10.com` SHALL NOT appear on the order
page before Contact Us opens the dialog.

**Ready email** — The open dialog SHALL show, in order:

1. To — `support@grade10.com`, not editable by the winner, with copy in place
2. Subject — the ready subject for this order and reason, not editable by the
   winner, with copy in place
3. Message — an editable `Textarea` prefilled with the ready body and space
   for the winner's question. No copy control SHALL sit beside the Message
   field; Copy Message stays footer-only

**Footer** — The dialog footer SHALL offer, in order:

1. Copy Message first — copies the full ready email (To, Subject and
   Message) for pasting into any mail app
2. Open Mail App second — optional; opens a `mailto:` to
   `support@grade10.com` carrying the current Subject and Message

**Export** — The design system SHALL export `Textarea` as a labelled
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

### Requirement: The ready email names the invoice or the lot and the reason

The ready email's subject and body identify the order so support can open it
without a follow-up.

**Subject** - For `order cancelled` the subject SHALL be
`Auction lot {lot title}: order cancelled`, invoice or not. Otherwise, when
the order's current invoice id exists, the subject SHALL be
`Auction order {invoice id}: {reason}`. When no invoice id exists (including
setup overdue before send), the subject SHALL be
`Auction lot {lot title}: {reason}`.

**Reason** - On Winner Order the reason fragment SHALL be one of
`setup overdue`, `payment overdue`, `partial payment`, or `order cancelled`.
A Cancelled Winner Order is locked, so it offers Contact Us under "Contact Us
opens a copy-first ready email" with the `order cancelled` reason. The
operator's cancellation category and note SHALL NOT appear in the subject or
body.

**Body** - Message SHALL greet Grade10, say the winner needs help with this
auction order, name the lot title, name the status label for the reason
(`Setup overdue`, `Payment overdue`, `Partially paid`, or `Cancelled`), and
leave space for the winner's question. When an invoice id exists and the reason
is not setup overdue, the body SHALL name that invoice id; a Cancelled order
that never had an invoice names none.

**Partial payment** - When the reason is partial payment, the body MAY list
receipt ids and MUST NOT name the remaining balance. When no receipt id
exists yet, the body SHALL list none.

<!-- trace:scenario id=g10.auction-winner-order.SC-g9z rev=1 -->
#### Scenario: winner-order-SC-164 - Setup overdue names the lot, not an invoice
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose setup deadline has passed with no invoice
  issued, for lot title "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction lot Charizard Base Set PSA 10: setup overdue`
- **AND** Message names that lot title and status Setup overdue
- **AND** Message names no invoice id

<!-- trace:scenario id=g10.auction-winner-order.SC-30l rev=2 -->
#### Scenario: winner-order-SC-165 - Payment overdue names the invoice
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment deadline has passed unpaid, with
  current invoice id `IN-LK42301` and lot title "Charizard Base Set PSA 10"
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42301: payment overdue`
- **AND** Message names that invoice id, that lot title, and status Payment
  overdue

<!-- trace:scenario id=g10.auction-winner-order.SC-kjq rev=2 -->
#### Scenario: winner-order-SC-166 - Partial payment may list receipts and never the balance
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** a partially paid auction order with current invoice id
  `IN-LK42301`, lot title "Charizard Base Set PSA 10", and receipt ids
  `RC-LK42301P1` and `RC-LK42301P2`
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42301: partial payment`
- **AND** Message may list those receipt ids
- **AND** Message names no remaining balance

<!-- trace:scenario id=g10.auction-winner-order.SC-hx5 rev=2 -->
#### Scenario: winner-order-SC-168 - A reissued invoice uses the current invoice id
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** an auction order whose payment deadline has passed unpaid after a
  reissue, with current invoice id `IN-LK42302` and a replaced invoice id
  `IN-LK42301`
- **WHEN** the winner opens Contact Us
- **THEN** Subject is `Auction order IN-LK42302: payment overdue`
- **AND** Subject does not name `IN-LK42301`

<!-- trace:scenario id=g10.auction-winner-order.SC-e1w rev=1 -->
#### Scenario: winner-order-SC-275 - Contact Us on a cancelled order names the lot and the cancellation
**Serves:** winner-order-US-16 - Winner emails Grade10 from a locked order

- **GIVEN** a cancelled auction order for lot title "Charizard Base Set PSA 10", with current invoice id `IN-LK42301` and an operator cancellation category and note
- **WHEN** the winner chooses Contact Us
- **THEN** Subject is `Auction lot Charizard Base Set PSA 10: order cancelled`
- **AND** Message names that lot title, that invoice id and status Cancelled
- **AND** neither Subject nor Message names the cancellation category or note

### Requirement: Add Address collects phone with country

Add Address on Winner Order setup collects the winner's phone with a country
selector.

**Country selector** — The phone field SHALL include a country selector. Phone
country SHALL start empty on Add Address — nothing preselected.

**Placeholder** — When phone country is empty, the phone field SHALL show an
example placeholder with a calling code (`+852 12345678`).

**Required parts** — Phone country and digits SHALL be required.

**Storage** — Grade10 SHALL store the phone as E.164 when parseable. When the
value is not parseable to E.164, Grade10 SHALL still apply the address with the
entered phone value and SHALL NOT refuse it for format.

**Unusual formats** — Grade10 SHALL NOT refuse a phone value because its format
is unusual or fails hard validity checks.

<!-- trace:scenario id=g10.auction-winner-order.SC-p5b rev=1 -->
#### Scenario: winner-order-SC-187 - Add Address opens with no phone country preselected
**Serves:** winner-order-US-01 - entering a phone on Add Address

- **GIVEN** a winner opening Add Address on Winner Order setup
- **WHEN** Add Address is shown
- **THEN** phone country is empty with nothing preselected

<!-- trace:scenario id=g10.auction-winner-order.SC-5r2 rev=1 -->
#### Scenario: winner-order-SC-201 - Phone shows an example placeholder with calling code
**Serves:** winner-order-US-01 - entering a phone on Add Address

- **GIVEN** a winner on Add Address with phone country empty
- **WHEN** the phone field is shown
- **THEN** the placeholder shows an example with a calling code (`+852 12345678`)

<!-- trace:scenario id=g10.auction-winner-order.SC-f6t rev=1 -->
#### Scenario: winner-order-SC-188 - A parseable phone is stored as E.164
**Serves:** winner-order-US-01 - saving a phone on Add Address

- **GIVEN** a winner on Add Address with a phone country selected and digits that parse to E.164
- **WHEN** the winner confirms the address
- **THEN** Grade10 stores the phone as E.164
- **AND** the address is applied

<!-- trace:scenario id=g10.auction-winner-order.SC-a0z rev=1 -->
#### Scenario: winner-order-SC-189 - An unusual phone format is accepted
**Serves:** winner-order-US-01 - saving a phone that does not pass hard validity

- **GIVEN** a winner on Add Address with a phone country selected and digits in an unusual format
- **WHEN** the winner confirms the address
- **THEN** Grade10 accepts the phone
- **AND** the address is applied
- **AND** no field refusal shows beside Phone for format

<!-- trace:scenario id=g10.auction-winner-order.SC-lth rev=1 -->
#### Scenario: winner-order-SC-197 - A non-parseable phone still applies with the entered value
**Serves:** winner-order-US-01 - saving a phone that does not parse to E.164

- **GIVEN** a winner on Add Address with a phone country selected and digits that do not parse to E.164
- **WHEN** the winner confirms the address
- **THEN** Grade10 applies the address with the entered phone value
- **AND** no field refusal shows beside Phone for format

### Requirement: Add Address is Personal or Company

Add Address lets the winner mark the address Personal or Company.

**Toggle** — Add Address SHALL offer Personal and Company. Personal SHALL be
selected by default.

**Company Name** — Company Name SHALL be required only when Company is
selected. Company Name SHALL be hidden when Personal is selected. Confirming
while Personal is selected SHALL NOT require Company Name, including after the
winner had entered a company name and switched back to Personal.

**Recipient names** — First name and last name SHALL remain required for both
Personal and Company.

**Picker card title** — A company address SHALL show the company name as the
picker card title. A personal address SHALL show the recipient's first and last
name as the picker card title.

**Picker card body** — The picker card body SHALL show street, city or region,
and country only. It SHALL NOT show postal code or phone.

**Order summary** — After setup is confirmed, Winner Order Delivery address and
Billing address SHALL show the confirmed snapshot: company name when the
address is company, recipient first and last name, phone, and the full address
including postal code.

<!-- trace:scenario id=g10.auction-winner-order.SC-41a rev=1 -->
#### Scenario: winner-order-SC-190 - Personal is selected by default and Company Name is hidden
**Serves:** winner-order-US-01 - choosing a personal address on Add Address

- **GIVEN** a winner opening Add Address on Winner Order setup
- **WHEN** Add Address is shown
- **THEN** Personal is selected
- **AND** Company Name is not shown

<!-- trace:scenario id=g10.auction-winner-order.SC-5xb rev=1 -->
#### Scenario: winner-order-SC-191 - Company requires Company Name
**Serves:** winner-order-US-01 - choosing a company address on Add Address

- **GIVEN** a winner on Add Address with Company selected
- **WHEN** the winner confirms with Company Name empty
- **THEN** Grade10 refuses applying the address
- **AND** a field refusal shows beside Company Name
- **AND** the order stays in Awaiting Setup

<!-- trace:scenario id=g10.auction-winner-order.SC-lyz rev=1 -->
#### Scenario: winner-order-SC-198 - Switching back to Personal drops the Company Name requirement
**Serves:** winner-order-US-01 - leaving a company name after switching to Personal

- **GIVEN** a winner on Add Address who selected Company, entered a Company Name, then switched to Personal
- **WHEN** the winner confirms with every Personal required field complete
- **THEN** Grade10 applies the address as personal
- **AND** no field refusal shows beside Company Name

<!-- trace:scenario id=g10.auction-winner-order.SC-42u rev=1 -->
#### Scenario: winner-order-SC-192 - A personal saved address shows the recipient name on the picker card
**Serves:** winner-order-US-01 - picking a personal delivery address

- **GIVEN** a winner on the delivery picker with a saved personal address
- **WHEN** the picker lists saved addresses
- **THEN** that address card title is the recipient's first and last name

<!-- trace:scenario id=g10.auction-winner-order.SC-nl8 rev=1 -->
#### Scenario: winner-order-SC-193 - A company saved address shows the company name on the picker card
**Serves:** winner-order-US-01 - picking a company delivery address

- **GIVEN** a winner on the delivery picker with a saved company address
- **WHEN** the picker lists saved addresses
- **THEN** that address card title is the company name

<!-- trace:scenario id=g10.auction-winner-order.SC-f86 rev=1 -->
#### Scenario: winner-order-SC-202 - Picker card body omits postal code and phone
**Serves:** winner-order-US-01 - reading a saved address on the delivery picker

- **GIVEN** a winner on the delivery picker with a saved address that has street, city or region, country, postal code, and phone
- **WHEN** the picker lists that address
- **THEN** the card body shows street, city or region, and country
- **AND** the card body does not show postal code or phone

<!-- trace:scenario id=g10.auction-winner-order.SC-pgh rev=1 -->
#### Scenario: winner-order-SC-203 - Order summary shows the full address snapshot
**Serves:** winner-order-US-01 - reading Delivery and Billing after setup

- **GIVEN** a winner who confirmed Complete Order Setup with a company delivery address that includes company name, recipient name, phone, and postal code
- **WHEN** Winner Order shows Delivery address and Billing address
- **THEN** each block shows the company name, recipient name, phone, and full address including postal code

<!-- trace:scenario id=g10.auction-winner-order.SC-y14 rev=1 -->
#### Scenario: winner-order-SC-194 - A one-time address applies without saving a sixth
**Serves:** winner-order-US-12 - confirming delivery when five addresses are already saved

- **GIVEN** a winner with five saved shipping addresses on Winner Order setup
- **WHEN** the winner adds a one-time address with Personal or Company, phone country and digits, and the other required fields complete
- **THEN** Grade10 applies the one-time address for this order
- **AND** no sixth address is saved to the account

<!-- trace:scenario id=g10.auction-winner-order.SC-14a rev=1 -->
#### Scenario: winner-order-SC-199 - Billing Add Address uses the same phone and kind rules
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on billing Add Address after unticking Same as delivery address
- **WHEN** Add Address is shown
- **THEN** Personal or Company and the country-aware phone are offered with the same required fields as delivery Add Address

<!-- trace:scenario id=g10.auction-winner-order.SC-l8x rev=1 -->
#### Scenario: winner-order-SC-200 - Billing Company requires Company Name
**Serves:** winner-order-US-11 - Winner bills a won lot to a different address

- **GIVEN** a winner on billing Add Address with Company selected
- **WHEN** the winner confirms with Company Name empty
- **THEN** Grade10 refuses applying the billing address
- **AND** a field refusal shows beside Company Name

### Requirement: Add Address optional locality fields

Add Address collects locality with required and optional parts.

**Required** — Address line 1 and postal code SHALL be required.

**Optional** — Address line 2 and state or province SHALL be optional.
Confirming with them empty SHALL NOT be refused.

**Not collected** — Apt./Suite/Building SHALL NOT be collected on Add Address.

<!-- trace:scenario id=g10.auction-winner-order.SC-12v rev=1 -->
#### Scenario: winner-order-SC-195 - Address line 2 and state may be left empty
**Serves:** winner-order-US-01 - confirming Add Address with only required locality fields

- **GIVEN** a winner on Add Address with address line 1 and postal code filled and address line 2 and state or province empty
- **WHEN** the winner confirms the address with every other required field complete
- **THEN** Grade10 applies the address
- **AND** no field refusal shows beside address line 2 or state or province

<!-- trace:scenario id=g10.auction-winner-order.SC-km1 rev=1 -->
#### Scenario: winner-order-SC-196 - Apt./Suite/Building is not collected
**Serves:** winner-order-US-01 - entering locality on Add Address

- **WHEN** a winner is on Add Address on Winner Order setup
- **THEN** Apt./Suite/Building is not shown

### Requirement: Delivery Add Address Country/Region picker

On Winner Order setup, delivery Add Address names the destination country or
region through a Country/Region picker.

**Label** — The field SHALL read Country/Region.

**Catalogue** — The Country/Region popup SHALL list every country and
region in A–Z order, not a short designated set.

**Search** — While the Country/Region picker is open, typing SHALL filter the
list to names that match the typed query.

**No match** — A typed query that matches no catalogue name SHALL leave the
list empty; confirming without a selected catalogue country or region SHALL
be refused as an empty Country/Region.

**Empty country or region** — Confirming with Country/Region empty SHALL be
refused with a field refusal beside Country/Region, as for other empty
required address fields.

<!-- trace:scenario id=g10.auction-winner-order.SC-fm8 rev=1 -->
#### Scenario: winner-order-SC-174 - Delivery Add Address lists every country and region
**Serves:** winner-order-US-01 - choosing where the lot ships on delivery Add Address

- **GIVEN** a winner on Winner Order setup delivery Add Address
- **WHEN** the winner opens the Country/Region picker
- **THEN** the popup lists every country and region in A–Z order

<!-- trace:scenario id=g10.auction-winner-order.SC-ckz rev=1 -->
#### Scenario: winner-order-SC-175 - Typing filters the list to matching names
**Serves:** winner-order-US-01 - finding a country or region by search on delivery Add Address

- **GIVEN** a winner with the Country/Region picker open on delivery Add Address
- **WHEN** the winner types a query that matches one or more catalogue names
- **THEN** the list shows only names that match that query
- **AND** names that do not match are not shown

<!-- trace:scenario id=g10.auction-winner-order.SC-98w rev=1 -->
#### Scenario: winner-order-SC-178 - A query with no match leaves the list empty
**Serves:** winner-order-US-01 - searching for a country or region that is not in the catalogue

- **GIVEN** a winner with the Country/Region picker open on delivery Add Address
- **WHEN** the winner types a query that matches no catalogue name
- **THEN** the list shows no country or region options

<!-- trace:scenario id=g10.auction-winner-order.SC-vuk rev=1 -->
#### Scenario: winner-order-SC-176 - The field reads Country/Region
**Serves:** winner-order-US-01 - naming the destination on delivery Add Address

- **WHEN** a winner is on Winner Order setup delivery Add Address
- **THEN** the picker field label reads Country/Region

<!-- trace:scenario id=g10.auction-winner-order.SC-h2c rev=1 -->
#### Scenario: winner-order-SC-177 - An empty Country/Region is refused
**Serves:** winner-order-US-01 - confirming delivery Add Address without a country or region

- **GIVEN** a winner on delivery Add Address with Country/Region empty
- **WHEN** the winner confirms the address
- **THEN** Grade10 refuses applying the address
- **AND** a field refusal shows beside Country/Region

### Requirement: Winner Order renders a refunded order as a retained record

When an order is Refunded, Winner Order SHALL show Refunded as the order and
invoice status, the invoice and receipts already issued, and no stepper, Pay,
address form or other self-service action. The page SHALL show the refund
details in a dialog that stacks, each a label above its value: Amount, then
Transfer to, then Reference when the refund is a bank transfer, then Reason,
then Note when the operator recorded one. Transfer to SHALL use `PaymentMethodCard`. A card refund SHALL show
the brand logo and only the last four digits, and SHALL not show a provider
reference. A bank refund SHALL show a bank icon, the masked destination on the
primary line, and the free-text bank name as secondary text under it, and SHALL
show the operator's bank provider reference as Reference. The page SHALL omit
Note when the operator left none. The page SHALL not show operator proof, a
Stripe provider reference, a full card number, or a full account number.

<!-- trace:scenario id=g10.auction-winner-order.SC-zfp rev=1 -->
#### Scenario: winner-order-SC-157 - A refunded order keeps its documents
**Serves:** winner-order-US-14 - seeing a refunded order after full or partial payment

- **GIVEN** a refunded order that had one partial payment and an invoice
- **WHEN** the winner opens Winner Order
- **THEN** the order and invoice read Refunded
- **AND** the invoice and payment receipt remain downloadable
- **AND** no Pay, address form or stepper appears
- **AND** the refund details show Transfer to with the card payment marks or bank destination

### Requirement: Winner Order shows an overpayment without closing the order

When an overpayment is returned, Winner Order SHALL show only the returned
difference below Order Total. It SHALL keep the order's existing status and
the invoice lines unchanged, and SHALL offer the refund details without
showing the operator's proof or a Stripe provider reference.

<!-- trace:scenario id=g10.auction-winner-order.SC-7m4 rev=1 -->
#### Scenario: winner-order-SC-155 - An overpayment keeps the order open
**Serves:** winner-order-US-15 - seeing an overpayment returned without closing the sale

- **GIVEN** an order whose recorded payment exceeds its invoice total and the
  difference has been returned
- **WHEN** the winner opens Winner Order
- **THEN** the order status and invoice lines are unchanged
- **AND** the returned difference appears below Order Total
- **AND** the winner can open the refund details

<!-- trace:scenario id=g10.auction-winner-order.SC-yhv rev=1 -->
#### Scenario: winner-order-SC-172 - Refund details show statement-recognition clues
**Serves:** winner-order-US-14 - seeing a refunded order after full or partial payment

- **GIVEN** a refunded order with a card refund, a refund detail record and an operator note
- **WHEN** the winner opens the refund details
- **THEN** the details show Amount, then Transfer to, then Reason, then Note
- **AND** Transfer to shows the card brand logo and only the last four digits
- **AND** Reference is not shown
- **AND** the full card number, Stripe provider reference and proof are not shown

<!-- trace:scenario id=g10.auction-winner-order.SC-u8s rev=1 -->
#### Scenario: winner-order-SC-173 - Bank refund details show destination and reference
**Serves:** winner-order-US-17 - matching a bank refund against their own statement

- **GIVEN** a refunded order with a bank transfer refund and a refund detail record with no operator note
- **WHEN** the winner opens the refund details
- **THEN** the details show Amount, then Transfer to, then Reference, then Reason
- **AND** Transfer to shows a bank icon, the masked destination on the primary line, and the free-text bank name as secondary text under it
- **AND** Reference shows the operator's bank provider reference
- **AND** Note is not shown
- **AND** the full account number and proof are not shown

### Requirement: Every receipt records its payment-time breakdown

Every payment receipt SHALL record the values for the payment it proves:

| Line | Value |
| --- | --- |
| Original Invoice Total | The total of the invoice the payment was made against |
| Previous Payments | The payments recorded against that invoice before this payment |
| Current Payment Received | The amount recorded for this payment |
| Remaining Balance Due | The amount still owed after this payment, floored at 0 once the invoice is Paid |

The four lines SHALL appear on receipts for a single full payment, ordered
partial payments, a payment that closes an invoice within the agreed tolerance,
and a confirmed overpayment. A tolerance-close or overpayment SHALL show
`Remaining Balance Due` as `0`; it SHALL NOT add a shortfall, write-off or
negative-credit line.

The values SHALL describe the invoice and payment state when the receipt was
issued. Grade10 SHALL NOT reissue a receipt or mutate an issued receipt after a
refund or reversal. A later receipt's `Previous Payments` value SHALL remain
the value recorded when that later receipt was issued.

This requirement governs receipt contents only. Winner Order's live balance and
its absence from the order page remain governed by
`add-winner-partial-payment`.

<!-- trace:scenario id=g10.auction-winner-order.SC-58l rev=1 -->
#### Scenario: winner-order-SC-204 - A full payment receipt shows zero previous and remaining
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD with one confirmed
  payment of 100000 minor units
- **WHEN** the winner opens that payment receipt
- **THEN** Original Invoice Total is 100000 minor units in HKD
- **AND** Previous Payments is 0
- **AND** Current Payment Received is 100000 minor units in HKD
- **AND** Remaining Balance Due is 0

<!-- trace:scenario id=g10.auction-winner-order.SC-u1h rev=1 -->
#### Scenario: winner-order-SC-205 - Ordered partial receipts preserve the payment history
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD
- **AND** a first payment of 40000 minor units and a second payment of
  30000 minor units were recorded in that order
- **WHEN** the winner opens the receipt for each payment
- **THEN** the first receipt shows Original Invoice Total 100000,
  Previous Payments 0, Current Payment Received 40000 and Remaining Balance
  Due 60000, all in minor units of HKD
- **AND** the second receipt shows Original Invoice Total 100000,
  Previous Payments 40000, Current Payment Received 30000 and Remaining
  Balance Due 30000, all in minor units of HKD

<!-- trace:scenario id=g10.auction-winner-order.SC-dzh rev=1 -->
#### Scenario: winner-order-SC-206 - A tolerance-close receipt floors the remaining balance at zero
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD
- **AND** 90000 minor units have already been paid
- **AND** the operator records a 5000-minor-unit payment and closes the invoice
  as Paid within the agreed closing tolerance
- **WHEN** the winner opens that payment receipt
- **THEN** Original Invoice Total is 100000 minor units in HKD
- **AND** Previous Payments is 90000 minor units in HKD
- **AND** Current Payment Received is 5000 minor units in HKD
- **AND** Remaining Balance Due is 0
- **AND** the receipt contains no shortfall or write-off line

<!-- trace:scenario id=g10.auction-winner-order.SC-cdf rev=1 -->
#### Scenario: winner-order-SC-207 - A confirmed overpayment receipt records the full payment
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD
- **AND** the operator confirms a payment of 110000 minor units
- **WHEN** the winner opens that payment receipt
- **THEN** Original Invoice Total is 100000 minor units in HKD
- **AND** Previous Payments is 0
- **AND** Current Payment Received is 110000 minor units in HKD
- **AND** Remaining Balance Due is 0
- **AND** the receipt contains no negative balance or credit line

<!-- trace:scenario id=g10.auction-winner-order.SC-6b0 rev=1 -->
#### Scenario: winner-order-SC-208 - A refund or reversal does not rewrite issued receipts
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an invoice total of 100000 minor units in HKD
- **AND** payments of 20000, 30000 and 10000 minor units were recorded in that
  order, with a receipt issued for each
- **AND** the second payment is later refunded or reversed
- **WHEN** the winner opens the three receipts
- **THEN** the first receipt still shows Previous Payments 0,
  Current Payment Received 20000 and Remaining Balance Due 80000
- **AND** the second receipt still shows Previous Payments 20000,
  Current Payment Received 30000 and Remaining Balance Due 50000
- **AND** the third receipt still shows Previous Payments 50000,
  Current Payment Received 10000 and Remaining Balance Due 40000
- **AND** no issued receipt is reissued

### Requirement: An unfinished card payment leaves the invoice payable

Pay Now SHALL start a hosted card payment session for the current invoice. Its
outcome SHALL read as follows.

| Session outcome | The winner sees | Order |
| --- | --- | --- |
| Completed | **Confirming payment** until Grade10 records the invoice `paid` | Preparing Shipment once paid |
| Timed out | Payment was not completed; Pay Now is available again | Stays Pending Payment |
| Abandoned or cancelled by the winner | Payment was not completed; Pay Now is available again | Stays Pending Payment |
| Declined | The refusal, per "The bid-time hold is released, never captured" | Stays Pending Payment |

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

### Requirement: The auction order page is the Winner Order design

The auction order page SHALL render `AuctionWinnerOrder` from
`shared/ui/auction-order`, the block the Winner Order stories render, and no
rebuild of it.

| Part | Carries |
| --- | --- |
| Header | The page title and the order status badge |
| Order Progress | The five steps, per "Winner Order shows five progress steps" |
| Lot | The lot's key image, title and winning bid, opening the lot |
| Alerts | Under the lot: the status's outcome, suspension, a returned proof, a card checkout's return |
| Sidebar | The order summary with its lines and Invoice PDF, the pay controls and deadline, the payment method with its receipts, the delivery and billing addresses, and Complete Order Setup while setup is open |

The page SHALL NOT show Order Information, Collection Method, an Order Status
list or a Lots section.

What the page offers SHALL follow the order status.

| Order status | The page offers |
| --- | --- |
| Awaiting Setup | Complete Order Setup, which opens setup, per "The address form refuses empty required fields" |
| Preparing Invoice | The confirmed address, per "The delivery address is confirmed before payment"; no invoice and no way to pay |
| Pending Payment | The full invoice with every line, per "Invoice fields", and the pay control for the chosen method; the confirmed address |
| Preparing Shipment, Shipped, Delivered, Cancelled, Refunded | Read-only detail, with the records per "Records the winner keeps" |

An invoice whose status is `expired` SHALL still be presented under the
derived Pending Payment order status, per `revise-auction-winner-invoicing`,
with its full invoice and **Contact Us** instead of the pay control. The page
SHALL not derive a second Expired order status.

<!-- trace:scenario id=g10.auction-winner-order.SC-cu4 rev=1 -->
#### Scenario: winner-order-SC-241 - The page shows the lot once
**Serves:** winner-order-US-19 - Winner confirms where a won lot ships

- **GIVEN** an auction order in any status
- **WHEN** the winner opens it
- **THEN** the page shows the header, the lot card and the sidebar
- **AND** the lot's title shows in the lot card only
- **AND** no Order Information, Collection Method, Order Status list or Lots
  section shows

<!-- trace:scenario id=g10.auction-winner-order.SC-1yn rev=1 -->
#### Scenario: winner-order-SC-240 - A suspended winner reads it under the lot
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** a suspended winner's auction order whose invoice is `pending`
- **WHEN** the winner opens it
- **THEN** an alert under the lot says bidding is suspended and payment does
  not lift it
- **AND** offers Pay what is owed

<!-- trace:scenario id=g10.auction-winner-order.SC-y2j rev=1 -->
#### Scenario: winner-order-SC-242 - An unpaid order shows the invoice and the pay control
**Serves:** winner-order-US-04 - Winner pays an invoice by card

- **GIVEN** an auction order whose status is Pending Payment
- **WHEN** the winner opens it
- **THEN** the sidebar shows every invoice line and the pay control
- **AND** the confirmed delivery address and the lot

<!-- trace:scenario id=g10.auction-winner-order.SC-apq rev=1 -->
#### Scenario: winner-order-SC-243 - An order preparing its invoice offers no payment
**Serves:** winner-order-US-19 - Winner confirms where a won lot ships

- **GIVEN** an auction order whose status is Preparing Invoice
- **WHEN** the winner opens it
- **THEN** the page shows the confirmed address
- **AND** offers no invoice and no pay control

### Requirement: Every invoice carries an invoice ID and the order's payment reference

Every sent invoice carries the order's payment reference and an invoice ID
built from it; a reissue takes the next invoice ID while the payment
reference never changes.

**Payment reference** - The bank reference and payment reference are the same
value; Grade10 SHALL NOT issue a second identifier. The payment reference
SHALL be the winner's order's one collector-facing reference: the listing
code that `grade10-admin/auction/listing` allocates for the lot, carried
forward unchanged once a winner exists on it. This capability SHALL NOT allocate,
derive, or reissue the code; it only consumes the value
`grade10-admin/auction/listing` already holds for the listing. There is no
separate public order ID — the payment reference stands in for one.

**Invoice ID** - Grade10 SHALL give every invoice, card or bank transfer, an
invoice ID when it is sent. Each SHALL be unique across all invoices.

| Identifier | Format | Example |
| --- | --- | --- |
| Payment reference | the listing code, unchanged | `LK423` |
| Invoice ID | `IN-[PAYMENT_REF][SEQ]` | `IN-LK42301` |

| Part | Rule |
| --- | --- |
| `[PAYMENT_REF]` | The order's payment reference, above |
| `[SEQ]` | The count of the order's invoices: `01` for the first invoice sent, the next number on each reissue; it uses at least two digits and continues as `100` after `99` |

**Invariant across reissue** - A reissue replaces the current invoice with a
new one, per `grade10-admin/auction/post-sale`, and the new invoice SHALL take
the next `[SEQ]`. The payment reference SHALL NOT change on a reissue, or at
any other point in the order's life — it is fixed on the listing's first saved
draft and carried forward as-is.

**Where shown** - Winner Order and the invoice PDF SHALL show both the
invoice ID and the payment reference, on every invoice regardless of payment
method; the payment reference is also the value quoted in FPS, local bank
transfer and SWIFT notes on a bank transfer invoice, per "A bank transfer
invoice shows how to pay". Grade10 SHALL NOT show the payment reference, the
invoice ID, or any receipt ID before a winning order exists on the listing;
until then a lot is identified by its title and canonical address. The public
listing page exposes the lower-case code only through that address, per
`grade10-site/auction/listing-page`.

**An old invoice ID still finds the order** - Looking up any invoice's
invoice ID, including a replaced invoice's, or the order's payment reference,
SHALL find the auction order.

**Replacement relationship** - A reissue's new invoice SHALL retain the prior
invoice ID as `replacesInvoice` and its PDF SHALL say `Replaces invoice {id}`.
The prior invoice remains retained, SHALL hold no invoice status of its own
and SHALL never read `cancelled`; the order's invoice status is its current
invoice's, per `grade10-site/auction/order-status`.

**Stripe metadata** - When creating a card payment for the order, Grade10
SHALL write the order's payment reference to the Stripe payment's metadata
under `payment_reference_code`. Stripe's own returned provider reference
SHALL be stored by Grade10 separately from every collector-facing identifier,
used only in internal document filenames created after the payment is
obtained, and SHALL NOT reach the winner on any surface.

<!-- trace:scenario id=g10.auction-winner-order.SC-n8j rev=1 -->
#### Scenario: winner-order-SC-97 - A replaced invoice's identifiers still find the order
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** a payment quoting the first invoice's invoice ID, or the order's payment reference, is looked up
- **THEN** it finds that auction order
- **AND** the order's current invoice carries its own invoice ID, built from the same unchanged payment reference

<!-- trace:scenario id=g10.auction-winner-order.SC-sjx rev=1 -->
#### Scenario: winner-order-SC-98 - A replacement invoice names the invoice it replaces
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** an auction order whose first invoice an operator replaced with a reissue
- **WHEN** the winner opens the replacement invoice's PDF
- **THEN** it shows `Replaces invoice` and the first invoice's invoice ID
- **AND** the first invoice remains retained, holds no invoice status and does not read `cancelled`

<!-- trace:scenario id=g10.auction-winner-order.SC-12a rev=1 -->
#### Scenario: winner-order-SC-114 - The invoice ID is shown on the order and the PDF
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** one auction order whose invoice was sent for card and one sent for bank transfer
- **WHEN** the winner opens each order and its invoice PDF
- **THEN** each order shows its invoice ID and its payment reference
- **AND** its PDF shows the same invoice ID
- **AND** the card order's payment reference is shown exactly as the bank transfer order's is

<!-- trace:scenario id=g10.auction-winner-order.SC-q9s rev=1 -->
#### Scenario: winner-order-SC-122 - The invoice ID and payment reference use the payment reference
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** a lot on an order whose payment reference is `LK423`, with no invoice sent yet
- **WHEN** an operator sends its first invoice
- **THEN** the invoice ID is `IN-LK42301`

<!-- trace:scenario id=g10.auction-winner-order.SC-8dg rev=1 -->
#### Scenario: winner-order-SC-123 - A reissue takes the next invoice number
**Serves:** Invoice - a reissue takes a new invoice ID while the payment reference stays put

- **GIVEN** an order whose payment reference is `LK423` and whose first invoice `IN-LK42301` was sent
- **WHEN** an operator reissues it
- **THEN** the new invoice ID is `IN-LK42302`
- **AND** the order's payment reference is still `LK423`, unchanged by the reissue
- **AND** looking up `IN-LK42301`, `IN-LK42302`, or `LK423` all find the same order
- **AND** the new invoice's PDF says `Replaces invoice IN-LK42301`

<!-- trace:scenario id=g10.auction-winner-order.SC-qt4 rev=1 -->
#### Scenario: winner-order-SC-124 - The invoice count grows to three digits after 99
**Serves:** Invoice - a reissue takes a new invoice ID while the payment reference stays put

- **GIVEN** an order whose payment reference is `LK423` and whose latest invoice is `IN-LK42399`
- **WHEN** an operator reissues it
- **THEN** the new invoice ID is `IN-LK423100`
- **AND** the payment reference remains `LK423`

<!-- trace:scenario id=g10.auction-winner-order.SC-upc rev=1 -->
#### Scenario: winner-order-SC-125 - A listing code that is already held is hashed again
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** a listing-code candidate collides with an active code or retained reservation
- **WHEN** its draft is first saved
- **THEN** allocation retries and stores a distinct valid 5-character code

<!-- trace:scenario id=g10.auction-winner-order.SC-g6f rev=1 -->
#### Scenario: winner-order-SC-126 - A stored listing code never moves
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** a listing already stores payment reference `LK423`
- **WHEN** the allocator implementation changes
- **THEN** the listing and its order continue to use `LK423`

<!-- trace:scenario id=g10.auction-winner-order.SC-1pz rev=1 -->
#### Scenario: winner-order-SC-127 - The public listing page does not show the listing code
**Serves:** winner-order-US-21 - Winner quotes their order

- **GIVEN** a listing whose payment reference is `LK423`
- **WHEN** its public page or shared preview is fetched
- **THEN** the payment reference appears only as the lower-case canonical URL suffix
- **AND** no public representation exposes a labelled payment-reference field

<!-- trace:scenario id=g10.auction-winner-order.SC-ly9 rev=1 -->
#### Scenario: winner-order-SC-128 - Each invoice shows the payment reference
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** one pending invoice sent for card and one pending invoice sent for bank transfer
- **WHEN** the winner opens each invoice
- **THEN** both show the payment reference
- **AND** the card invoice requires no separate bank-reference identifier

<!-- trace:scenario id=g10.auction-winner-order.SC-dsa rev=1 -->
#### Scenario: winner-order-SC-244 - The payment reference is shown unconditionally, not gated by payment method
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** one order whose `pending` invoice was sent for bank transfer, and one whose `pending` invoice was sent for card
- **WHEN** the winner opens each on Winner Order
- **THEN** both orders show the payment reference

<!-- trace:scenario id=g10.auction-winner-order.SC-l1s rev=1 -->
#### Scenario: winner-order-SC-245 - Stripe metadata carries the payment reference and never the provider reference to the winner
**Serves:** winner-order-US-22 - Winner reviews invoice and payment details

- **GIVEN** an auction order paid by card
- **WHEN** Grade10 creates the Stripe payment for that order
- **THEN** the Stripe payment's metadata carries `payment_reference_code` equal to the order's payment reference
- **AND** Stripe's own returned provider reference appears on no surface the winner reads

### Requirement: Winner Order makes the tracking number the carrier link

While an auction order's fulfilment is `fulfilled` and it has a tracking
number, Winner Order SHALL show that number as the external link to the carrier
tracking page in Order Progress when the operator recorded a tracker link. The
link SHALL open in a new tab. Order Progress SHALL show no separate Track
shipment control or carrier name. The link SHALL remain after
`delivery_confirmed` is set while the fulfilment stays `fulfilled`. When the
operator recorded no tracker link, Winner Order SHALL show the tracking number
as plain text, with no carrier name and no Track shipment control.

This requirement governs the live Winner Order presentation only.

<!-- trace:scenario id=g10.auction-winner-order.SC-h7d rev=2 -->
#### Scenario: winner-order-SC-251 - A dispatched lot shows the tracking number as the carrier link
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number and a tracker link attached
- **WHEN** the winner opens the order
- **THEN** Order Progress shows the tracking number as a link to the carrier
  tracking page
- **AND** the link opens in a new tab
- **AND** it shows no separate Track shipment control and no carrier name in
  Order Progress

<!-- trace:scenario id=g10.auction-winner-order.SC-k4r rev=2 -->
#### Scenario: winner-order-SC-252 - The tracker remains after delivery is confirmed
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order that is `fulfilled` with a tracking number and a
  tracker link, and `delivery_confirmed` is set
- **WHEN** the winner opens the order
- **THEN** Order Progress still shows the tracking number as a link to the
  carrier tracking page

<!-- trace:scenario id=g10.auction-winner-order.SC-tgb rev=1 -->
#### Scenario: winner-order-SC-276 - Without a tracker link the tracking number is plain text
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order that is `fulfilled` with a tracking number and no
  tracker link recorded by the operator
- **WHEN** the winner opens the order
- **THEN** Order Progress shows the tracking number as plain text, not a link
- **AND** it shows no carrier name and no Track shipment control

### Requirement: Tax info tooltip

On Winner Order's Order Summary, Tax explains itself whenever the line is shown.

**Tooltip** - Grade10 SHALL offer a brief info tooltip beside Tax whenever the
Tax line is shown.

**Copy** - The tooltip SHALL read `Set by Grade10 for where your order ships.
Some orders have none.`

<!-- trace:scenario id=g10.auction-winner-order.SC-d0w rev=1 -->
#### Scenario: winner-order-SC-217 - A shown Tax line carries its info tooltip
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Tax of 6000 minor units in HKD
- **WHEN** the winner reads Order Summary
- **THEN** the Tax line shows 6000 minor units in HKD
- **AND** the Tax line sits between Insurance and Payment Processing Fee
- **AND** it offers an info tooltip reading `Set by Grade10 for where your order
  ships. Some orders have none.`

<!-- trace:scenario id=g10.auction-winner-order.SC-mph rev=1 -->
#### Scenario: winner-order-SC-212 - An absent Tax line offers no tooltip
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding Tax
- **WHEN** the winner reads Order Summary
- **THEN** no Tax line is shown
- **AND** no Tax tooltip is offered

### Requirement: Tax before the invoice is sent

Before an operator sends the invoice, Order Summary names Tax without an amount.

**Before send** - Before an operator has sent the invoice, Winner Order's Order
Summary SHALL show Tax as TBD with the other fee rows.

**No amount** - Grade10 SHALL NOT show a calculated Tax amount before the
operator sends the invoice.

<!-- trace:scenario id=g10.auction-winner-order.SC-1ok rev=1 -->
#### Scenario: winner-order-SC-213 - Tax reads TBD before the invoice is sent
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order before an operator has sent its invoice
- **WHEN** the winner reads Order Summary
- **THEN** Tax is shown as TBD with the other fee rows
- **AND** no calculated Tax amount is shown
- **AND** the Tax line offers its info tooltip

### Requirement: Winner Order explains cancellation without exposing the reason

For a cancelled auction order, Winner Order SHALL show the cancellation date as a
day-only date in the viewer's local zone, the lot and winning bid, and Contact Us as the only next action. It SHALL not show
the operator's category or note, SHALL not show a stepper or payment action,
and SHALL preserve the order's retained facts.

<!-- trace:scenario id=g10.auction-winner-order.SC-1fb rev=2 -->
#### Scenario: winner-order-SC-143 - Cancelled keeps the lot and winning bid visible
**Serves:** winner-order-US-13 - Winner learns their order was cancelled

- **GIVEN** a cancelled auction order with a lot and winning bid
- **WHEN** the winner opens Winner Order
- **THEN** it shows Cancelled on the recorded day in the viewer's local zone, the lot and winning bid
- **AND** it shows Contact Us only, without the internal reason

### Requirement: Winner Order shows a locked partially paid record

When an operator has recorded money but has not closed the invoice, Winner
Order SHALL show Partially Paid as a locked state with Contact Us and a receipt
link for each payment in the existing receipt row, oldest first. It SHALL show
no running balance: it SHALL keep showing the full invoice amount, never a
remaining balance. It SHALL hide Pay, Submit Payment Proof, View Bank Details,
address changes, invoice reissue and cancellation, and SHALL show no further
payment deadline.

<!-- trace:scenario id=g10.auction-winner-order.SC-34b rev=1 -->
#### Scenario: winner-order-SC-156 - The partially paid order is locked
**Serves:** winner-order-US-20 - Winner sees partial collection without a second order

- **GIVEN** an order with one partial payment and money still due
- **WHEN** the winner opens Winner Order
- **THEN** it reads Partially Paid
- **AND** it offers Contact Us, shows the full invoice amount and shows no
  remaining balance
- **AND** it shows a separate receipt link for each recorded payment, oldest first
- **AND** it shows no Pay, Submit Payment Proof, View Bank Details, reissue,
  address change or cancel action

### Requirement: A missed address deadline closes the address form

This requirement builds on "The address confirm window is 48 hours from lot
close", which sets the address deadline, hides Confirm once it passes, and
shows Contact Us. It adds what that closing means and how the form comes back.

The address deadline SHALL be measured from the lot's actual close, counting
every extended-bidding extension, and SHALL NOT be measured from its scheduled
close. The 48 hours SHALL be one Grade10-owned figure, the same for every lot.
A new figure SHALL apply to lots closing after it is set and SHALL NOT move the
deadline of an order that already has one.

A write SHALL be judged by the moment Grade10 receives it. A delivery address
Grade10 receives at or after the address deadline SHALL be refused, however
long the winner spent composing it.

Once the address deadline has passed and no invoice has been sent, Grade10
SHALL refuse the winner's address writes on the order:

| Winner's write | Behaviour after the address deadline |
| --- | --- |
| Confirm a delivery address | Refused |
| Add, edit or archive an address in the account address book | Unaffected |

The account address book is account-wide and shared across storefronts, per
"The account owns a reusable shipping address book". Only the write that puts
an address on this order SHALL be refused.

Grade10 SHALL offer the winner no way to reopen the address form. Only an
operator reopens it or records the address, per
"An operator reopens the address form" in `grade10-admin/auction/post-sale`;
after a reopen the winner SHALL confirm the address as before. A confirmed
address stays locked, per "The delivery address locks when the invoice is
sent". Grade10 SHALL send the winner no letter when the form is reopened; the
operator tells them directly.

Sending the invoice SHALL retire the address deadline. The delivery address
locks at send, per "The delivery address locks when the invoice is sent", so
Grade10 SHALL neither show the address deadline nor refuse on it afterwards.

<!-- trace:scenario id=g10.auction-winner-order.SC-oos rev=1 -->
#### Scenario: winner-order-SC-144 - The address deadline counts from the extended close
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** a lot whose scheduled close was 2026-09-12T08:45:00Z and whose
  actual close, after extended bidding, was 2026-09-12T09:00:00Z
- **WHEN** the winner opens the order
- **THEN** the address deadline shown is 2026-09-14T09:00:00Z

<!-- trace:scenario id=g10.auction-winner-order.SC-r6m rev=1 -->
#### Scenario: winner-order-SC-145 - An address received just inside the deadline is accepted
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** an auction order whose address deadline is 2026-09-14T09:00:00Z
- **WHEN** Grade10 receives the winner's delivery address at 2026-09-14T08:59:00Z
- **THEN** Grade10 accepts the confirmation
- **AND** the order's derived status is Preparing Invoice

<!-- trace:scenario id=g10.auction-winner-order.SC-kz8 rev=1 -->
#### Scenario: winner-order-SC-146 - An address received after the deadline is refused
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** an auction order in Setup Overdue whose address deadline was
  2026-09-14T09:00:00Z
- **WHEN** Grade10 receives the winner's delivery address at 2026-09-14T09:01:00Z
- **THEN** Grade10 refuses the confirmation
- **AND** the order has no confirmed delivery address
- **AND** its derived status is still Setup Overdue

<!-- trace:scenario id=g10.auction-winner-order.SC-6ax rev=1 -->
#### Scenario: winner-order-SC-148 - A reopen gives the winner a fresh 48 hours
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** an unconfirmed auction order in Setup Overdue with invoice status
  `not_issued` whose address deadline was 2026-09-14T09:00:00Z
- **WHEN** an operator reopens the address form at 2026-09-16T14:00:00Z
- **THEN** the order shows Confirm delivery address with the deadline
  2026-09-18T14:00:00Z
- **AND** the winner can confirm a delivery address again
- **AND** Grade10 offers the winner no way to reopen it themselves

<!-- trace:scenario id=g10.auction-winner-order.SC-90v rev=1 -->
#### Scenario: winner-order-SC-149 - A reopen sends the winner no letter
**Serves:** winner-order-US-23 - Winner gets the address form back

- **GIVEN** an unconfirmed auction order in Setup Overdue with invoice status
  `not_issued` whose address deadline has passed
- **WHEN** an operator reopens the address form
- **THEN** the order offers Confirm delivery address again
- **AND** Grade10 sends the winner no letter about the reopen

<!-- trace:scenario id=g10.auction-winner-order.SC-js5 rev=1 -->
#### Scenario: winner-order-SC-150 - Sending the invoice retires the address deadline
**Serves:** Delivery address - retired at send

- **GIVEN** an auction order whose winner confirmed an address and whose
  invoice an operator sent at 2026-09-13T09:00:00Z
- **WHEN** 2026-09-14T09:00:00Z passes
- **THEN** the order shows no address deadline and no missed-deadline alert
- **AND** it shows the locked address and how to reach Grade10 to request a
  change

<!-- trace:scenario id=g10.auction-winner-order.SC-byg rev=1 -->
#### Scenario: winner-order-SC-151 - A missed address deadline leaves the address book alone
**Serves:** Delivery address - missed deadline closes the form

- **GIVEN** an auction order whose address deadline has passed
- **WHEN** the winner edits a saved address in their account address book and
  saves a new one
- **THEN** Grade10 accepts both writes
- **AND** neither reaches that auction order
- **AND** the order still has no confirmed delivery address
