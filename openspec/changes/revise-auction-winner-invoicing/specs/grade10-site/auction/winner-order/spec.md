## Feature set

- Order at lot close
  - Address first: a closed lot opens an order that waits for the winner's delivery address, with no invoice and nothing yet to pay
  - One order per lot: a winner of three lots confirms three addresses and receives three invoices
- Invoice
  - Operator quote: Shipping & Handling, and Insurance when added, are quoted by an operator for the confirmed address, never estimated
  - Order total: names every component a winner is asked to pay, so a total is explicable line by line
- Delivery address
  - Selection and confirmation: a winner chooses a saved address or adds one, then affirms it, which is what lets an invoice be prepared
  - Locking at send: the address stops moving once the invoice is sent; a change after that goes through Grade10
- Settlement
  - Card only for the winner: the order offers one payment method; every other method is an operator's backup
  - Hold release: the bid-time authorization verified a bidder and is not the instrument that settles
- Payment deadline
  - Seven days from send: the window opens when the winner has an amount to pay, not before
- Records the winner keeps
  - Payment receipt: what was paid, itemised, with the method that paid it
  - Shipping tracker and delivery proof: unchanged

## REMOVED Requirements

### Requirement: A winner is invoiced when the lot closes

**Reason**: A lot close no longer issues an invoice. The order now waits for
the winner to confirm a delivery address, and an operator quotes and sends
the invoice afterwards.

**Migration**: Replaced by "A lot close opens an order that waits for the
winner's address" in this capability, and by "An operator quotes and sends
the invoice" in `grade10-admin/auction/post-sale`. Its three scenarios
retire; the idempotent close is carried by "A repeated lot close creates
nothing twice" under the new requirement.

### Requirement: Amending the address recalculates and reissues

**Reason**: Shipping is quoted by an operator rather than calculated, and the
winner cannot change the address once the invoice is sent.

**Migration**: Before the invoice is sent, the winner changes the address
freely with no invoice to reissue. After it is sent, an operator re-quotes and
reissues on the winner's request, per "An operator re-quotes a sent invoice"
in `grade10-admin/auction/post-sale`. Its two scenarios retire.

### Requirement: The delivery address locks at payment

**Reason**: The address now locks earlier — when the invoice is sent — because
the operator's quote is priced against it.

**Migration**: Replaced by "The delivery address locks when the invoice is
sent". Its scenario retires; "A paid order refuses a self-service address
change" carries the same refusal under the new requirement.

### Requirement: The payment deadline is fixed at lot close

**Reason**: The 7-day window now opens when the invoice is sent, since the
winner has nothing to pay before then.

**Migration**: Replaced by "The payment deadline is fixed when the invoice is
sent". Its two scenarios retire. A
winner who never confirms an address no longer expires; an operator follows
the order up, per "The order detail shows how long an order has waited" in
`grade10-admin/auction/post-sale`.

## ADDED Requirements

### Requirement: A lot close opens an order that waits for the winner's address

At lot close Grade10 SHALL, for the winner:

1. Create one auction order for the lot, with invoice status `not_issued` and
   fulfilment status `unfulfilled`, per `grade10-site/auction/order-status`.
2. Release the winner's bid-time authorization.
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

- **GIVEN** a lot closing with a winner
- **WHEN** the lot closes
- **THEN** Grade10 creates one auction order with invoice status `not_issued`
  and fulfilment status `unfulfilled`
- **AND** issues no invoice
- **AND** asks the winner to confirm a delivery address

#### Scenario: winner-order-SC-27 - A repeated lot close creates nothing twice

- **GIVEN** a lot whose close has already created an auction order
- **WHEN** that same lot close is delivered again
- **THEN** Grade10 leaves one auction order
- **AND** does not release the authorization a second time
- **AND** does not notify the winner a second time

#### Scenario: winner-order-SC-28 - Confirming an address readies the order for a quote

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

- **GIVEN** an auction order whose invoice has been sent and is `pending`
- **WHEN** the winner attempts to change the delivery address
- **THEN** Grade10 refuses the change
- **AND** the order shows the locked address and how to reach Grade10

#### Scenario: winner-order-SC-30 - A paid order refuses a self-service address change

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
invoice status SHALL never become `expired`.

When the deadline passes unpaid, Grade10 SHALL set the invoice status to
`expired`, per `grade10-site/auction/order-status`. The order still reads
Pending Payment, and the winner can still pay the invoice by card.

#### Scenario: winner-order-SC-31 - The deadline is seven days from send

- **GIVEN** an auction order whose invoice an operator sent at
  2026-09-12T09:00:00Z
- **WHEN** the winner reads the invoice
- **THEN** the payment deadline is 2026-09-19T09:00:00Z
- **AND** it is displayed in the winner's own timezone

#### Scenario: winner-order-SC-32 - An order waiting on an address never expires

- **GIVEN** an auction order whose winner has confirmed no delivery address
  30 days after its lot closed
- **WHEN** its derived status is read
- **THEN** it is Awaiting Address
- **AND** its invoice status is `not_issued`, never `expired`

#### Scenario: winner-order-SC-33 - A declined payment does not move the deadline

- **GIVEN** an auction order whose sent invoice has a payment deadline of
  2026-09-19T09:00:00Z
- **WHEN** the winner's card is declined twice
- **THEN** the payment deadline is still 2026-09-19T09:00:00Z

#### Scenario: winner-order-SC-37 - An expired invoice can still be paid by card

- **GIVEN** an auction order whose invoice status is `expired`
- **WHEN** the winner opens the order and pays by card
- **THEN** Grade10 accepts the payment
- **AND** the invoice status is `paid`

## MODIFIED Requirements

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
| Order total | The total payable — the sum of the components above |
| Sent at | When the operator sent the invoice. Stored in UTC |
| Payment deadline | 7 calendar days from Sent at. Stored in UTC, displayed in the winner's own zone |
| Invoice status | Per `grade10-site/auction/order-status` |

Wherever the winner reads the invoice's lines — the order, the receipt, and
any letter that lists them — Grade10 SHALL show Shipping & Handling of zero as
**Free**, and SHALL leave the Insurance line out when the operator added none.

No component SHALL be marked as an estimate. Grade10 SHALL NOT show the winner
an invoice amount before an operator has sent it.

#### Scenario: winner-order-SC-04 - An estimated total is marked as one

- **GIVEN** an operator sent an invoice with a winning bid of 250000, a
  buyer's premium of 50000, shipping of 8000 and insurance of 4000 minor
  units in HKD
- **WHEN** the winner reads the invoice
- **THEN** the order total is 312000 minor units in HKD
- **AND** no component is marked as an estimate

#### Scenario: winner-order-SC-05 - A confirmed address makes the total firm

- **GIVEN** an auction order whose winner confirmed a delivery address
- **AND** an operator sent an invoice with shipping and insurance quoted for
  that address
- **WHEN** the winner reads the invoice
- **THEN** its total is the order total for that address
- **AND** no component is marked as an estimate

#### Scenario: winner-order-SC-38 - Shipping & Handling of zero reads Free

- **GIVEN** an operator sent an invoice with Shipping & Handling of 0 minor units in HKD
- **WHEN** the winner opens the order
- **THEN** the Shipping & Handling line reads Free

#### Scenario: winner-order-SC-39 - An invoice with no insurance shows no Insurance line

- **GIVEN** an operator sent an invoice without adding insurance
- **WHEN** the winner opens the order
- **THEN** no Insurance line is shown
- **AND** the order total is the sum of the lines that are shown

### Requirement: One invoice and one auction order per lot

Grade10 SHALL issue exactly one invoice and create exactly one auction order
per lot, and SHALL NOT combine lots won by the same winner into one invoice,
one deadline, or one shipment. Each order SHALL carry its own delivery
address, its own quote, its own payment deadline, and its own fulfilment
lifecycle.

#### Scenario: winner-order-SC-06 - Two lots won together stay two orders

- **GIVEN** one winner who wins two lots in the same auction, closing at
  different times
- **WHEN** both lots close and an operator sends each invoice
- **THEN** Grade10 has created two auction orders and sent two invoices
- **AND** each carries its own payment deadline measured from its own
  invoice's send
- **AND** each is charged its own shipping

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

- **GIVEN** an auction order pre-filled from the account's default shipping address
- **WHEN** the winner leaves the order without confirming that address
- **THEN** the order's derived status is still Awaiting Address
- **AND** an operator cannot send its invoice

#### Scenario: winner-order-SC-08 - An amendment does not touch the address book by default

- **GIVEN** a winner amending the delivery address on one auction order
- **AND** they leave the offer to save the amendment to the account address book untaken
- **WHEN** they confirm the amendment
- **THEN** that auction order carries the amended address
- **AND** their saved address book is unchanged

### Requirement: The bid-time hold is released, never captured

Grade10 SHALL release the bid-time authorization on every bidder of a closing
lot, winner and losing bidders alike, and SHALL NOT leave a losing bidder's
authorization to expire on its own.

Grade10 SHALL NOT capture or increment a bid-time authorization as any part
of settlement. The winner's payment SHALL be a single new card transaction for
the order total, against a stored card or another card they enter. Grade10
SHALL offer the winner no other payment method; bank transfer, cash, and every
other method are recorded by an operator alone, per
`grade10-admin/auction/post-sale`.

Releasing an authorization that has already expired SHALL succeed as a
no-op. Grade10 SHALL NOT treat an expired authorization as a failure.

A refused or failed payment SHALL NOT void the invoice. The invoice SHALL
remain payable, before its deadline and after it has expired, and the winner
SHALL be able to retry with the same or a different card.

#### Scenario: winner-order-SC-12 - The winning hold is released and the invoice is a fresh charge

- **GIVEN** a winner holding an open bid-time authorization on the closing lot
- **WHEN** the lot closes and the winner pays the invoice
- **THEN** Grade10 released that authorization at close without capturing it
- **AND** the payment is a single new transaction for the order total

#### Scenario: winner-order-SC-13 - An expired hold releases as a no-op

- **GIVEN** a winner whose bid-time authorization expired before the lot closed
- **WHEN** the lot closes
- **THEN** Grade10 records the release as successful
- **AND** creates the auction order as normal

#### Scenario: winner-order-SC-14 - A losing bidder's hold is released at close

- **GIVEN** a lot closing with one winner and three losing bidders holding
  open authorizations
- **WHEN** the lot closes
- **THEN** Grade10 releases all three losing authorizations
- **AND** does not wait for them to expire

#### Scenario: winner-order-SC-15 - A declined payment leaves the invoice payable

- **GIVEN** an unpaid invoice inside its payment deadline
- **WHEN** the winner's payment is declined
- **THEN** the invoice status remains `pending`
- **AND** the winner can retry with the same or a different card

#### Scenario: winner-order-SC-35 - The winner is offered card payment only

- **GIVEN** an auction order whose invoice has been sent and is `pending`
- **WHEN** the winner opens the order to pay
- **THEN** Grade10 offers card payment
- **AND** offers no bank transfer, cash, or other method

### Requirement: Records the winner keeps

Each auction order SHALL carry these records, retrievable by the winner for
the life of their account.

| Record | When | Contents |
| --- | --- | --- |
| Payment receipt | Payment confirmed, by either route | Itemised: winning bid, buyer's premium, Shipping & Handling, insurance when added, any tax amount, order total, and the payment method |
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

- **GIVEN** an auction order paid at a order total of 316000 minor units in HKD
- **WHEN** the winner opens the order a year later
- **THEN** the receipt shows the winning bid, buyer's premium, Shipping &
  Handling, insurance, any tax amount supplied by the separate tax capability,
  and the order total

#### Scenario: winner-order-SC-19 - A manually settled receipt says so

- **GIVEN** an auction order an operator settled by bank transfer with an
  external reference, after re-quoting and superseding an earlier invoice
- **WHEN** the winner opens the receipt
- **THEN** it is marked as manually settled and is distinguishable from a
  card-settled receipt
- **AND** it records the amount settled, bank transfer as the method, the
  external reference, and the invoice it supersedes
- **AND** it shows no proof file

#### Scenario: winner-order-SC-20 - The tracker appears once the lot is dispatched

- **GIVEN** an auction order whose fulfilment status has just become
  `fulfilled` with a tracking number attached
- **WHEN** the winner opens the order
- **THEN** it shows the carrier name, the tracking number, and a link to the
  carrier

#### Scenario: winner-order-SC-21 - Delivery proof records what the carrier provided

- **GIVEN** a dispatched auction order for which the carrier reports delivery
  with a handover timestamp and a signature
- **WHEN** `delivery_confirmed` is set
- **THEN** the order records that timestamp and that signature
- **AND** does not reduce them to a bare confirmation flag

#### Scenario: winner-order-SC-36 - A card receipt names the card

- **GIVEN** an auction order the winner paid by a Visa card ending 4242
- **WHEN** the winner opens the receipt
- **THEN** the payment method reads as a Visa card ending 4242
