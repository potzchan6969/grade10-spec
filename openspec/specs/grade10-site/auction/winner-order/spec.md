# grade10-site/auction/winner-order Specification

## Purpose
What a winner is issued when a lot closes and what they do with it: one
invoice per lot, a delivery address they confirm, a single fresh charge, a
deadline that does not move, and the receipt, tracker and delivery proof the
order keeps afterwards. The invoice premium follows the winning bid and its
rate is disclosed earlier on the bid panel.

## Feature set

- Invoice at lot close
  - One invoice per lot: a winner of three lots owes three amounts on three deadlines, never one consolidated bill
  - Estimate-first pricing: the invoice is payable from the moment of close rather than waiting on an address
  - Final amount: names every component a winner is asked to pay, so a total is explicable line by line
  - Buyer's premium: 20% of the winning bid or the currency's minimum charge, whichever is higher, computed by Grade10
  - Invoice premium: 20% of the winning bid
  - Integer amount: rounded to the nearest minor unit
  - Bid-panel boundary: only the rate appears before invoicing
- Premium minimum
  - Currency minimum: the current Auction Payment settings mapping sets the lower bound for the calculated premium
- Delivery address
  - Account-wide address book: the platform keeps multiple named shipping addresses and one optional default for the account
  - Selection and confirmation: a winner chooses a saved address or adds one, then affirms it before payment
  - Amendment and recalculation: a winner corrects the destination and sees what it costs before paying
  - Locking at payment: the order snapshot stops moving once money has changed hands
- Settlement
  - Hold release: the bid-time authorization verified a bidder and is not the instrument that settles
  - Single fresh charge: one transaction for the final amount, retryable on failure
- Payment deadline
  - Seven days from close: a fixed end to the winner's obligation, unmoved by anything they do to the invoice
- Records the winner keeps
  - Payment receipt: proof of what was paid, itemised, retrievable for the life of the account
  - Shipping tracker: where the lot is once it has left
  - Delivery proof: what the carrier recorded on handover, given what these lots are worth

## Requirements

### Requirement: Invoice fields

Each invoice SHALL carry these fields. Every amount SHALL be an integer count
of minor units paired with the lot's ISO 4217 currency code, rendered per
`shared/money-amounts`. An invoice exists only once an operator sends it.

| Field | Notes |
| --- | --- |
| Auction order | The order this invoice is the payable record for. One each way |
| Lot | The single lot invoiced. Named unambiguously, since a winner may hold several |
| Winning bid | The accepted bid that won the lot, excluding every other component |
| Buyer's premium | The applicable fee. This capability fixes no rate |
| Shipping & Handling | Quoted by an operator for the order's confirmed delivery address. Zero or more |
| Insurance | Optional. Added by an operator for the order's confirmed delivery address, and greater than zero when added |
| Tax | An optional line reserved for the separate tax change; no rate or regime is defined here |
| Subtotal | The sum of the components above — what Grade10 keeps once the card fee is paid |
| Payment processing fee | The card fee, grossed up from the subtotal so the subtotal survives it. Absent when the order is settled manually |
| Order total | The total payable — the subtotal plus the payment processing fee |
| Sent at | When the operator sent the invoice. Stored in UTC |
| Payment deadline | 7 calendar days from Sent at. Stored in UTC, displayed in the winner's own zone |
| Invoice status | Per `grade10-site/auction/order-status` |

The payment processing fee SHALL be the amount that leaves the subtotal whole
after the payment provider takes a fixed fee and a percentage of the whole
charge. Grade10 SHALL read both from the payment provider for the invoice's
currency at the moment the invoice is sent, SHALL compute the order total as
the subtotal plus the fixed fee divided by one less the percentage, SHALL round
that total up to the next minor unit, and SHALL take the fee as the difference
between the order total and the subtotal.

The fee SHALL be fixed on the invoice once sent. A later change in the
provider's fees SHALL NOT move it; only a re-quote SHALL price it again.

Wherever the winner reads the invoice's lines — the order, the receipt, and
any letter that lists them — Grade10 SHALL show Shipping & Handling of zero as
**Free**, and SHALL leave the Insurance line out when the operator added none.
Insurance and Payment Processing Fee are separate lines: omitting Insurance
does not replace it with the fee.

On Winner Order's order summary, Grade10 SHALL offer brief info tooltips beside
**Buyer’s Premium**, **Shipping & Handling**, and **Payment Processing Fee**
when those lines are shown. The Payment Processing Fee tooltip SHALL name the
card fee briefly and SHALL NOT restate the gross-up formula.

The on-page Winner Order summary MAY omit a separate Subtotal row and show the
fee lines that apply plus Order Total; the invoice and receipt itemisation
SHALL still carry Subtotal for the fee gross-up.

No component SHALL be marked as an estimate. Grade10 SHALL NOT show the winner
an invoice amount before an operator has sent it.

#### Scenario: winner-order-SC-04 - An estimated total is marked as one
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with a winning bid of 250000, a
  buyer's premium of 50000, shipping of 8000 and insurance of 4000 minor
  units in HKD
- **WHEN** the winner reads the invoice
- **THEN** the order total is 312000 minor units in HKD
- **AND** no component is marked as an estimate

#### Scenario: winner-order-SC-05 - A confirmed address makes the total firm
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose winner confirmed a delivery address
- **AND** an operator sent an invoice with Shipping & Handling quoted for that
  address, with Insurance when added
- **WHEN** the winner reads the invoice
- **THEN** its total is the order total for that address
- **AND** no component is marked as an estimate

#### Scenario: winner-order-SC-62 - The fee grosses the subtotal up
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice whose subtotal is 312000 minor units in HKD
- **AND** the payment provider's fees for HKD at that moment were 235 minor units and 3.4 per cent
- **WHEN** the winner reads the invoice
- **THEN** the payment processing fee is 11225 minor units in HKD
- **AND** the order total is 323225 minor units in HKD

#### Scenario: winner-order-SC-63 - A manually settled order carries no fee
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order an operator settled by bank transfer
- **WHEN** the winner reads the receipt
- **THEN** no payment processing fee is shown
- **AND** the amount settled is the invoice's subtotal

#### Scenario: winner-order-SC-38 - Shipping & Handling of zero reads Free
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Shipping & Handling of 0 minor units in HKD
- **WHEN** the winner opens the order
- **THEN** the Shipping & Handling line reads Free

#### Scenario: winner-order-SC-39 - An invoice with no insurance shows no Insurance line
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice without adding insurance
- **WHEN** the winner opens the order
- **THEN** no Insurance line is shown
- **AND** the Payment Processing Fee line is still shown when the winner pays by card
- **AND** the order total is the sum of the lines that are shown

#### Scenario: winner-order-SC-69 - Fee lines carry info tooltips
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an operator sent an invoice with Buyer’s Premium, Shipping &
  Handling, and Payment Processing Fee
- **WHEN** the winner opens Winner Order
- **THEN** each of those three lines offers a brief info tooltip
- **AND** the Payment Processing Fee tooltip does not describe the gross-up
  formula

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

#### Scenario: winner-order-SC-40 - The premium is 20% of the winning bid
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the HKD minimum charge is 20000 minor units
- **AND** an auction order with a hammer price of 250000 minor units in HKD
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 50000 minor units in HKD
- **AND** the operator was not asked to enter it

#### Scenario: winner-order-SC-41 - The minimum charge applies when it is higher
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the HKD minimum charge is 20000 minor units
- **AND** an auction order with a hammer price of 50000 minor units in HKD
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 20000 minor units in HKD

#### Scenario: winner-order-SC-42 - A zero minimum leaves the rounded 20%
**Serves:** winner-order-US-03 - Winner checks the buyer's premium on an invoice

- **GIVEN** the JPY minimum charge is 0
- **AND** an auction order with a hammer price of 1003 minor units in JPY
- **WHEN** an operator sends its invoice
- **THEN** the buyer's premium is 201 minor units in JPY

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
account SHALL be able to keep multiple named shipping addresses and SHALL have
at most one default. The address book SHALL be available across storefronts
that the account can use.

The winner order SHALL allow the winner to choose any saved address, add a new
address, edit an unused address, archive an address, and change the default.
An address selected for an order SHALL be copied into the order as a snapshot;
editing or archiving the saved address later SHALL NOT change that order.
The platform SHALL refuse to archive the address currently selected by an
unpaid order unless the winner first selects another address for that order.

#### Scenario: winner-order-SC-22 - An account keeps multiple shipping addresses
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an account with no saved shipping addresses
- **WHEN** the winner saves a home address and a work address
- **THEN** both named addresses are available in the account address book
- **AND** the winner can choose either address for an auction order

#### Scenario: winner-order-SC-23 - The account has one optional default
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an account with a home address set as its default
- **WHEN** the winner makes the work address the default
- **THEN** the work address is the only default
- **AND** a later order is pre-filled from the work address

#### Scenario: winner-order-SC-24 - Editing a saved address does not rewrite an order
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid order whose delivery snapshot uses the home address
- **WHEN** the winner edits the saved home address in the account address book
- **THEN** the saved home address has the new value
- **AND** the order keeps the address snapshot it already showed

#### Scenario: winner-order-SC-25 - A selected address cannot be archived silently
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid order whose delivery snapshot uses the work address
- **WHEN** the winner tries to archive the work address
- **THEN** Grade10 asks the winner to select another address for that order
- **AND** does not remove the address while it remains selected

### Requirement: The delivery address is confirmed before payment

Grade10 SHALL require the winner to confirm a delivery address on the auction
order before an operator can send its invoice. When an account default exists,
Grade10 SHALL pre-fill from it, but the default SHALL not become the order's
destination until the winner confirms or selects an address.

| Condition | Behaviour |
| --- | --- |
| Account has a default shipping address | Grade10 pre-fills it. The winner still confirms explicitly |
| Account has no default shipping address | The address is empty. The winner adds one and confirms it |
| Account has multiple saved addresses | Grade10 lets the winner choose one, then confirms the selected address for this order |
| Winner changes the address before the invoice is sent | The order takes the new snapshot and stays ready for a quote. Nothing is reissued |
| Winner asks to change the address after the invoice is sent | Refused on the order. An operator re-quotes on request |
| Winner adds or edits an address | Grade10 offers to save it to the account address book. The order keeps a snapshot |

#### Scenario: winner-order-SC-07 - A pre-filled default still needs confirming
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order pre-filled from the account's default shipping address
- **WHEN** the winner leaves the order without confirming that address
- **THEN** the order's derived status is still Awaiting Address
- **AND** an operator cannot send its invoice

#### Scenario: winner-order-SC-08 - An amendment does not touch the address book by default
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner amending the delivery address on one auction order
- **AND** they leave the offer to save the amendment to the account address book untaken
- **WHEN** they confirm the amendment
- **THEN** that auction order carries the amended address
- **AND** their saved address book is unchanged

### Requirement: The bid-time hold is released, never captured

When a bid-time authorization exists, Grade10 SHALL release it on every bidder
of a closing lot, winner and losing bidders alike, and SHALL NOT leave a losing
bidder's authorization to expire on its own.

Grade10 SHALL NOT capture or increment a bid-time authorization as any part
of settlement. The winner's payment SHALL be a single new card transaction for
the order total, against a stored card or another card they enter. Grade10
SHALL offer the winner no other payment method; bank transfer, cash, and every
other method are recorded by an operator alone, per
`grade10-admin/auction/post-sale`.

Releasing an authorization that has already expired SHALL succeed as a
no-op. Grade10 SHALL NOT treat an expired authorization as a failure.

A refused or failed payment SHALL NOT void the invoice. While the invoice
status is `pending`, the invoice SHALL remain payable by card and the winner
SHALL be able to retry with the same or a different card. When the invoice
status is `expired`, Grade10 SHALL NOT offer or accept winner card payment
until an operator reissues the invoice to `pending`.

#### Scenario: winner-order-SC-12 - The winning hold is released and the invoice is a fresh charge
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a winner holding an open bid-time authorization on the closing lot
- **WHEN** the lot closes
- **THEN** Grade10 releases that authorization at close without capturing it
- **AND** after an operator later sends the invoice, the winner's payment is a
  single new transaction for the order total

#### Scenario: winner-order-SC-13 - An expired hold releases as a no-op
**Serves:** Settlement - an expired hold releases as a no-op

- **GIVEN** a winner whose bid-time authorization expired before the lot closed
- **WHEN** the lot closes
- **THEN** Grade10 records the release as successful
- **AND** creates the auction order as normal

#### Scenario: winner-order-SC-14 - A losing bidder's hold is released at close
**Serves:** winner-order-US-06 - Losing bidder gets their hold back when the lot closes

- **GIVEN** a lot closing with one winner and three losing bidders holding
  open authorizations
- **WHEN** the lot closes
- **THEN** Grade10 releases all three losing authorizations
- **AND** does not wait for them to expire

#### Scenario: winner-order-SC-15 - A declined payment leaves the invoice payable
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an unpaid invoice inside its payment deadline
- **WHEN** the winner's payment is declined
- **THEN** the invoice status remains `pending`
- **AND** the winner can retry with the same or a different card

#### Scenario: winner-order-SC-35 - The winner is offered card payment only
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice has been sent and is `pending`
- **WHEN** the winner opens the order to pay
- **THEN** Grade10 offers card payment
- **AND** offers no bank transfer, cash, or other method

### Requirement: Records the winner keeps

Each auction order SHALL carry these records, retrievable by the winner for
the life of their account.

| Record | When | Contents |
| --- | --- | --- |
| Payment receipt | Payment confirmed, by either route | Itemised: winning bid, buyer's premium, Shipping & Handling, insurance when added, any tax amount, the subtotal, the payment processing fee when the winner paid by card, the order total, and the payment method |
| Shipping tracker | Fulfilment status is `fulfilled` | Carrier name, tracking number, and a link to the carrier |
| Delivery proof | `delivery_confirmed` is set | Whatever the carrier provided — handover timestamp, signature, proof-of-delivery image |

The receipt SHALL name the payment method:

| Route | Method shown |
| --- | --- |
| Card, paid by the winner | Card, with its brand and last four digits |
| Recorded by an operator | Bank transfer, cash, or the description the operator gave for another method, with the external reference where one was recorded |

A receipt for a manually settled order SHALL be marked as manually settled,
SHALL be visually distinguishable from a card-settled receipt, and SHALL
record the amount settled, the payment method, the external reference, and a
pointer to any invoice it supersedes. The proof files an operator attached
SHALL NOT appear on the winner's receipt.

#### Scenario: winner-order-SC-18 - A receipt is itemised and stays retrievable
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order paid at an order total of 316000 minor units in HKD
- **WHEN** the winner opens the order a year later
- **THEN** the receipt shows the winning bid, buyer's premium, Shipping &
  Handling, insurance, any tax amount supplied by the separate tax capability,
  the subtotal, the payment processing fee, and the order total

#### Scenario: winner-order-SC-19 - A manually settled receipt says so
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order an operator settled by bank transfer with an
  external reference, after re-quoting and superseding an earlier invoice
- **WHEN** the winner opens the receipt
- **THEN** it is marked as manually settled and is distinguishable from a
  card-settled receipt
- **AND** it records the amount settled, bank transfer as the method, the
  external reference, and the invoice it supersedes
- **AND** it shows no proof file

#### Scenario: winner-order-SC-20 - The tracker appears once the lot is dispatched
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number attached
- **WHEN** the winner opens the order
- **THEN** it shows the carrier name, the tracking number, and a link to the
  carrier

#### Scenario: winner-order-SC-21 - Delivery proof records what the carrier provided
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** a dispatched auction order for which the carrier reports delivery
  with a handover timestamp and a signature
- **WHEN** `delivery_confirmed` is set
- **THEN** the order records that timestamp and that signature
- **AND** does not reduce them to a bare confirmation flag

#### Scenario: winner-order-SC-36 - A card receipt names the card
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order the winner paid by a Visa card ending 4242
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads as a Visa card ending 4242

### Requirement: A lot close opens an order that waits for the winner's address

At lot close Grade10 SHALL, for the winner:

1. Create one auction order for the lot, with invoice status `not_issued` and
   fulfilment status `unfulfilled`, per `grade10-site/auction/order-status`.
2. Release the winner's existing bid-time authorization, when one exists.
3. Notify the winner that they have won and ask them to confirm a delivery
   address, per `grade10-site/auction/notifications-order`.

Grade10 SHALL NOT issue an invoice at lot close, and SHALL offer the winner no
way to pay until an operator has sent one.

When the winner confirms a delivery address, the order SHALL become ready for
an operator to quote, per `grade10-admin/auction/post-sale`. Until an invoice
is sent, the winner SHALL be able to change the confirmed address; each change
replaces the order's address snapshot.

Order creation, hold release and the winner notice SHALL be idempotent. A lot
close delivered more than once SHALL produce one auction order.

#### Scenario: winner-order-SC-26 - A lot close asks for an address, not payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a lot closing with a winner
- **WHEN** the lot closes
- **THEN** Grade10 creates one auction order with invoice status `not_issued`
  and fulfilment status `unfulfilled`
- **AND** issues no invoice
- **AND** asks the winner to confirm a delivery address

#### Scenario: winner-order-SC-27 - A repeated lot close creates nothing twice
**Serves:** Invoice at lot close - a repeated lot close creates nothing twice

- **GIVEN** a lot whose close has already created an auction order
- **WHEN** that same lot close is delivered again
- **THEN** Grade10 leaves one auction order
- **AND** does not release the authorization a second time
- **AND** does not notify the winner a second time

#### Scenario: winner-order-SC-28 - Confirming an address readies the order for a quote
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order waiting for its winner's address
- **WHEN** the winner confirms a delivery address
- **THEN** the order's derived status is Preparing Invoice
- **AND** the winner is offered no way to pay yet

### Requirement: The delivery address locks when the invoice is sent

Grade10 SHALL lock the delivery address on an auction order when an operator
sends its invoice, and SHALL offer the winner no self-service change
afterwards. The order SHALL show the locked address and how to reach Grade10
to request a change. An address change after send SHALL happen only through an
operator re-quote, per `grade10-admin/auction/post-sale`.

Grade10 SHALL NOT offer a partial refund or a supplementary charge for a
shipping difference discovered after payment.

#### Scenario: winner-order-SC-29 - A sent invoice refuses a self-service address change
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice has been sent and is `pending`
- **WHEN** the winner attempts to change the delivery address
- **THEN** Grade10 refuses the change
- **AND** the order shows the locked address and how to reach Grade10

#### Scenario: winner-order-SC-30 - A paid order refuses a self-service address change
**Serves:** `winner-order-US-01`, `winner-order-US-02` - the address stops moving, whether the winner is still settling or already settled

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** the winner attempts to change the delivery address
- **THEN** Grade10 refuses the change
- **AND** the delivery address is unchanged

### Requirement: The payment deadline is fixed when the invoice is sent

The payment deadline SHALL be 7 calendar days from the moment an operator
sends the invoice. Grade10 SHALL fix it at send, store it in UTC, and display
it in the winner's own timezone on both the invoice and the auction order, per
`shared/dates-and-times`.

Nothing the winner does SHALL move the deadline — not a failed payment, and
not leaving the order untouched. Only an operator SHALL set a new deadline:
by reissuing an expired invoice, or by choosing to reset it on a re-quote, per
`grade10-admin/auction/post-sale`.

An auction order with no sent invoice SHALL have no payment deadline, and its
invoice status SHALL never become `expired`. The winner-facing address confirm
window is separate and does not write `expired` on the invoice.

When the deadline passes unpaid, Grade10 SHALL set the invoice status to
`expired`, per `grade10-site/auction/order-status`. The order still reads
Pending Payment. The winner SHALL NOT be offered card payment while the
invoice is `expired`; the order SHALL show Contact Us in its overdue alert.
An operator SHALL restore self-service pay only by reissuing the invoice to
`pending`, or SHALL settle manually or cancel, per `grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-31 - The deadline is seven days from send
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice an operator sent at
  2026-09-12T09:00:00Z
- **WHEN** the winner reads the invoice
- **THEN** the payment deadline is 2026-09-19T09:00:00Z
- **AND** it is displayed in the winner's own timezone as an absolute datetime
- **AND** no countdown is shown

#### Scenario: winner-order-SC-33 - A declined payment does not move the deadline
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose sent invoice has a payment deadline of
  2026-09-19T09:00:00Z
- **WHEN** the winner's card is declined twice
- **THEN** the payment deadline is still 2026-09-19T09:00:00Z

#### Scenario: winner-order-SC-37 - An expired invoice refuses card payment
**Serves:** winner-order-US-05 - Winner misses the payment deadline

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner opens the order
- **THEN** Grade10 offers no card Pay control
- **AND** the overdue alert carries Contact Us
- **AND** a card payment attempt for that invoice is refused

### Requirement: The address confirm window is 48 hours from lot close

The winner SHALL have 48 hours from lot close to confirm a delivery address on
the auction order. Grade10 SHALL show the absolute datetime under Confirm
delivery address while the window is open (`Confirm by …` in the winner's
zone). Progress Address subtext SHALL use the day-only form (`Confirm by …`
without time).

When the window passes without a confirmed address, Winner Order SHALL hide
Confirm delivery address and SHALL show Contact Us in an overdue alert that
reads `Missed address deadline: {date}` (day-only, no middle-dot separator).
Derived order status SHALL remain **Awaiting Address**. Invoice status SHALL
remain `not_issued` and SHALL NOT become `expired`. Grade10 SHALL NOT cancel
the order or suspend bidding solely because the address window passed; an
operator follows up per `grade10-admin/auction/post-sale`.

#### Scenario: winner-order-SC-32 - An unpaid address wait never expires the invoice
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose winner has confirmed no delivery address
  30 days after its lot closed
- **WHEN** its derived status is read
- **THEN** it is Awaiting Address
- **AND** its invoice status is `not_issued`, never `expired`

#### Scenario: winner-order-SC-70 - Address confirm is due 48 hours after lot close
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** a lot that closed at 2026-09-17T13:30:00Z
- **AND** its auction order is Awaiting Address inside the confirm window
- **WHEN** the winner opens Winner Order
- **THEN** Confirm delivery address is offered
- **AND** the confirm deadline shown under the control is 2026-09-19T13:30:00Z
  displayed in the winner's zone as an absolute datetime
- **AND** no countdown is shown

#### Scenario: winner-order-SC-71 - A missed address deadline hides Confirm
**Serves:** winner-order-US-07 - Winner misses the address deadline

- **GIVEN** an auction order still Awaiting Address whose address confirm
  window has passed
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no Confirm delivery address control
- **AND** the overdue alert reads Missed address deadline with the day-only
  date and carries Contact Us
- **AND** derived status remains Awaiting Address
- **AND** invoice status remains `not_issued`

### Requirement: Winner Order shows five progress steps

Winner Order SHALL present settlement progress as five steps in this order:
**Address**, **Invoice**, **Payment**, **Shipped**, **Completed**. The steps
SHALL be presentation only and SHALL NOT replace the eight-value derived order
status vocabulary in `grade10-site/auction/order-status`.

| Current step | Derived order status |
| --- | --- |
| Address | Awaiting Address |
| Invoice | Preparing Invoice |
| Payment | Pending Payment (invoice `pending` or `expired`) |
| Shipped | Processing or Shipped |
| Completed | Delivered |

When the derived order status is **Cancelled** or **Refunded**, Winner Order
SHALL show no progress stepper.

Step subtext SHALL use day-only dates in the winner's zone. While Address is
current and awaiting confirm, subtext SHALL read `Confirm by {date}`. While
Payment is current and the invoice is `pending`, subtext SHALL read
`Pay by {date}`. Description copy SHALL wrap so five columns do not overflow.

#### Scenario: winner-order-SC-54 - Pending Payment highlights the Payment step
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose derived status is Pending Payment
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Payment as the current step
- **AND** Address and Invoice are complete

#### Scenario: winner-order-SC-55 - Processing maps under Shipped
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose derived status is Processing
- **WHEN** the winner opens Winner Order
- **THEN** the progress stepper marks Shipped as the current step
- **AND** does not invent a Processing step label

#### Scenario: winner-order-SC-56 - Cancelled hides the stepper
**Serves:** winner-order-US-05 - Winner misses the payment deadline

- **GIVEN** an auction order whose derived status is Cancelled
- **WHEN** the winner opens Winner Order
- **THEN** no progress stepper is shown

#### Scenario: winner-order-SC-66 - Progress dates are day-only
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice is `pending` with a payment deadline
  of 2026-09-26T03:00:00Z
- **WHEN** the winner opens Winner Order
- **THEN** Payment step subtext reads Pay by with the day-only date
- **AND** the Pay control still shows the absolute datetime with time

### Requirement: The winner can view the sent invoice as a PDF

Once an operator has sent an invoice on an auction order, Winner Order SHALL
offer the winner a control to view and download that invoice as a PDF. The
control SHALL use a PDF icon with the label **Invoice** (accessible name
Invoice PDF). The control SHALL be hidden while the invoice status is
`not_issued` and SHALL be hidden when the invoice status is `cancelled`.

#### Scenario: winner-order-SC-57 - A sent invoice offers its PDF
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `pending`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers view and download of the invoice PDF

#### Scenario: winner-order-SC-64 - No invoice PDF before send
**Serves:** winner-order-US-05 - Winner misses the payment deadline

- **GIVEN** an auction order whose invoice status is `not_issued`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no invoice PDF control

#### Scenario: winner-order-SC-65 - A cancelled order hides the invoice PDF
**Serves:** winner-order-US-05 - Winner misses the payment deadline

- **GIVEN** an auction order whose invoice status is `cancelled`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers no invoice PDF control

### Requirement: The winner can view the payment receipt as a PDF

After payment is confirmed on an auction order — by card or by operator manual
settlement — Winner Order SHALL offer the winner a control to view and download
the itemised payment receipt as a PDF. The control SHALL use a PDF icon with
the label **Receipt** (accessible name Receipt PDF) and SHALL sit on the same
row as the invoice PDF when both exist. The control SHALL be hidden before
payment and when Cancelled.

#### Scenario: winner-order-SC-67 - A paid order offers its receipt PDF
**Serves:** winner-order-US-02 - Winner follows a settled lot to delivery

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** the winner opens Winner Order
- **THEN** Grade10 offers view and download of the receipt PDF
- **AND** the Invoice PDF control remains available on the same row

#### Scenario: winner-order-SC-68 - No receipt PDF before payment
**Serves:** winner-order-US-01 - Winner settles a won lot

- **GIVEN** an auction order whose invoice status is `pending`
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

#### Scenario: grade10-site-auction-winner-order-SC-46 - Invoice carries 20% of the winning bid
**Serves:** winner-order-US-08 - Winner pays an invoice with a policy premium

- **GIVEN** a winning bid of 250000 HKD minor units
- **WHEN** Grade10 creates the winner's invoice
- **THEN** the invoice buyer's premium is 50000 HKD minor units
- **AND** the final amount includes that 50000 HKD premium

#### Scenario: grade10-site-auction-winner-order-SC-47 - Fractional minor-unit premium rounds deterministically
**Serves:** winner-order-US-08 - Winner pays an invoice with a policy premium

- **GIVEN** a winning bid of 101 USD minor units
- **WHEN** Grade10 creates the winner's invoice
- **THEN** the buyer's premium is 20 USD minor units
- **AND** the amount is an integer minor-unit value
