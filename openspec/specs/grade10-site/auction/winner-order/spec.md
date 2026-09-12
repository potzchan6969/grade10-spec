# grade10-site/auction/winner-order Specification

## Purpose
What a winner is issued when a lot closes and what they do with it: one
invoice per lot, a delivery address they confirm, a single fresh charge, a
deadline that does not move, and the receipt, tracker and delivery proof the
order keeps afterwards.

## Feature set

- Invoice at lot close
  - One invoice per lot: a winner of three lots owes three amounts on three deadlines, never one consolidated bill
  - Estimate-first pricing: the invoice is payable from the moment of close rather than waiting on an address
  - Final amount: names every component a winner is asked to pay, so a total is explicable line by line
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

### Requirement: A winner is invoiced when the lot closes

At lot close Grade10 SHALL, for the winner:

1. Create one auction order for the lot, with invoice status `pending` and
   fulfilment status `unfulfilled`, per
   `grade10-site/auction/order-status`.
2. Release the winner's bid-time authorization.
3. Issue one invoice for the final amount, priced from the account's default
   shipping address when one exists.
4. Notify the winner that they have won and what they owe, per
   `grade10-site/auction/notifications-order`.

The invoice SHALL be payable from the moment it is issued. Grade10 SHALL
label every component priced from the account's default shipping address as an estimate until the
winner confirms a delivery address.

Where the account has no default shipping address, Grade10 SHALL issue the invoice
showing hammer price and buyer's premium, SHALL show shipping, insurance and
tax as still to be calculated, and SHALL refuse payment until a delivery
address is supplied.

Order creation, hold release and invoice issuance SHALL be idempotent. A lot
close delivered more than once SHALL produce one auction order and one
invoice.

#### Scenario: winner-order-SC-01 - An invoice is issued at lot close

- **GIVEN** a lot closing with a winner whose account default shipping address
  is on file
- **WHEN** the lot closes
- **THEN** Grade10 creates one auction order with invoice status `pending`
  and fulfilment status `unfulfilled`
- **AND** issues one invoice for the final amount
- **AND** shipping, insurance and tax on that invoice are labelled as
  estimates

#### Scenario: winner-order-SC-02 - A winner with no default address cannot yet pay

- **GIVEN** a lot closing with an account that has no default shipping address
- **WHEN** the lot closes
- **THEN** the invoice shows the hammer price and the buyer's premium
- **AND** shows shipping, insurance and tax as still to be calculated
- **AND** Grade10 refuses payment on that invoice until a delivery address is
  supplied

#### Scenario: winner-order-SC-03 - A repeated lot close creates nothing twice

- **GIVEN** a lot whose close has already created an auction order and an
  invoice
- **WHEN** that same lot close is delivered again
- **THEN** Grade10 leaves one auction order and one invoice
- **AND** does not release the authorization a second time
- **AND** does not notify the winner a second time

### Requirement: Invoice fields

Each invoice SHALL carry these fields. Every amount SHALL be an integer count
of minor units paired with the lot's ISO 4217 currency code, rendered per
`shared/money-amounts`.

| Field | Notes |
| --- | --- |
| Auction order | The order this invoice is the payable record for. One each way |
| Lot | The single lot invoiced. Named unambiguously, since a winner may hold several |
| Hammer price | The winning bid, excluding every other component |
| Buyer's premium | The applicable fee. This capability fixes no rate |
| Shipping | Priced against the address currently on the order |
| Insurance | Priced against the address currently on the order |
| Tax | An optional line reserved for the separate tax change; no rate or regime is defined here |
| Final amount | The total payable — the sum of the components above |
| Estimated | Whether shipping, insurance, and any tax amount are still estimates |
| Payment deadline | Stored in UTC, displayed in the winner's own zone |
| Invoice status | Per `grade10-site/auction/order-status` |

#### Scenario: winner-order-SC-04 - An estimated total is marked as one

- **GIVEN** an auction order whose delivery address has not been confirmed
- **WHEN** the winner reads the invoice
- **THEN** the shipping, insurance and tax components are marked as estimates
- **AND** the final amount is marked as an estimate

#### Scenario: winner-order-SC-05 - A confirmed address makes the total firm

- **GIVEN** an auction order whose winner has confirmed a delivery address
- **WHEN** the winner reads the invoice
- **THEN** no component is marked as an estimate

### Requirement: One invoice and one auction order per lot

Grade10 SHALL issue exactly one invoice and create exactly one auction order
per lot, and SHALL NOT combine lots won by the same winner into one invoice,
one deadline, or one shipment. Each order SHALL carry its own payment
deadline, its own shipping charge, and its own fulfilment lifecycle.

#### Scenario: winner-order-SC-06 - Two lots won together stay two orders

- **GIVEN** one winner who wins two lots in the same auction, closing at
  different times
- **WHEN** both lots close
- **THEN** Grade10 creates two auction orders and issues two invoices
- **AND** each carries its own payment deadline measured from its own lot's
  close
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

- **GIVEN** an account with no saved shipping addresses
- **WHEN** the winner saves a home address and a work address
- **THEN** both named addresses are available in the account address book
- **AND** the winner can choose either address for an auction order

#### Scenario: winner-order-SC-23 - The account has one optional default

- **GIVEN** an account with a home address set as its default
- **WHEN** the winner makes the work address the default
- **THEN** the work address is the only default
- **AND** a later order is pre-filled from the work address

#### Scenario: winner-order-SC-24 - Editing a saved address does not rewrite an order

- **GIVEN** an unpaid order whose delivery snapshot uses the home address
- **WHEN** the winner edits the saved home address in the account address book
- **THEN** the saved home address has the new value
- **AND** the order keeps the address snapshot it already showed

#### Scenario: winner-order-SC-25 - A selected address cannot be archived silently

- **GIVEN** an unpaid order whose delivery snapshot uses the work address
- **WHEN** the winner tries to archive the work address
- **THEN** Grade10 asks the winner to select another address for that order
- **AND** does not remove the address while it remains selected

### Requirement: The delivery address is confirmed before payment

Grade10 SHALL require the winner to confirm a delivery address on the auction
order before payment can complete. When an account default exists, Grade10
SHALL price and pre-fill from it, but the default SHALL not become the order's
destination until the winner confirms or selects an address.

| Condition | Behaviour |
| --- | --- |
| Account has a default shipping address | Grade10 pre-fills it and prices the estimate from it. The winner still confirms explicitly |
| Account has no default shipping address | The address is empty and shipping, insurance, and any tax amount are still to be calculated. Payment is refused |
| Account has multiple saved addresses | Grade10 lets the winner choose one, then confirms the selected address for this order |
| Winner amends the address | Grade10 recalculates address-based shipping and insurance and reissues the invoice at the revised final amount; tax remains reserved for the separate tax change |
| Winner adds or edits an address | Grade10 offers to save it to the account address book. The order amendment remains a snapshot |

#### Scenario: winner-order-SC-07 - A pre-filled default still needs confirming

- **GIVEN** an auction order pre-filled from the account's default shipping address
- **WHEN** the winner attempts to pay without confirming that address
- **THEN** Grade10 refuses the payment
- **AND** asks the winner to confirm the delivery address

#### Scenario: winner-order-SC-08 - An amendment does not touch the address book by default

- **GIVEN** a winner amending the delivery address on one auction order
- **AND** they leave the offer to save the amendment to the account address book untaken
- **WHEN** they confirm the amendment
- **THEN** that auction order carries the amended address
- **AND** their saved address book is unchanged

### Requirement: Amending the address recalculates and reissues

On an amendment Grade10 SHALL recalculate address-based shipping and
insurance against the new address and SHALL reissue the invoice at a revised
final amount that wholly replaces the prior amount. Tax calculation, rates,
jurisdictions, and exemptions are reserved for a separate tax change; this
change SHALL NOT infer or apply them. Grade10 SHALL NOT raise a supplementary
charge for the difference.

Grade10 SHALL show the winner the previous total and the new total before
they proceed to pay. Amending SHALL NOT reset or extend the payment deadline,
however many times the address is amended.

#### Scenario: winner-order-SC-09 - An amendment shows the total delta before payment

- **GIVEN** an auction order whose final amount is 312000 minor units in HKD
- **WHEN** the winner amends the delivery address to one where shipping and
  insurance price 4000 minor units higher
- **THEN** the reissued invoice's final amount is 316000 minor units in HKD
- **AND** Grade10 shows the winner 312000 minor units and 316000 minor units
  in HKD before they proceed to pay
- **AND** raises no separate charge for 4000 minor units

#### Scenario: winner-order-SC-10 - Amending does not move the deadline

- **GIVEN** an auction order whose payment deadline is seven days from its
  lot's close
- **WHEN** the winner amends the delivery address twice
- **THEN** the payment deadline is unchanged

### Requirement: The delivery address locks at payment

Grade10 SHALL lock the delivery address on an auction order when payment is
received, and SHALL offer the winner no self-service change afterwards. Where
an order is settled manually, the lock SHALL apply at the moment the operator
confirms the address and records settlement, per
`grade10-admin/auction/post-sale`.

Grade10 SHALL NOT offer a partial refund or a supplementary charge for a
shipping difference discovered after payment.

#### Scenario: winner-order-SC-11 - A paid order refuses a self-service address change

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** the winner attempts to change the delivery address
- **THEN** Grade10 refuses the change
- **AND** the delivery address is unchanged

### Requirement: The bid-time hold is released, never captured

Grade10 SHALL release the bid-time authorization on every bidder of a closing
lot, winner and losing bidders alike, and SHALL NOT leave a losing bidder's
authorization to expire on its own.

Grade10 SHALL NOT capture or increment a bid-time authorization as any part
of settlement. Payment SHALL be a single new transaction for the final
amount, against the winner's stored payment method or an alternative method
they choose.

Releasing an authorization that has already expired SHALL succeed as a
no-op. Grade10 SHALL NOT treat an expired authorization as a failure.

A refused or failed payment SHALL NOT void the invoice. The invoice SHALL
remain payable until its deadline and the winner SHALL be able to retry with
the same or a different payment method.

#### Scenario: winner-order-SC-12 - The winning hold is released and the invoice is a fresh charge

- **GIVEN** a winner holding an open bid-time authorization on the closing lot
- **WHEN** the lot closes and the winner pays the invoice
- **THEN** Grade10 released that authorization at close without capturing it
- **AND** the payment is a single new transaction for the final amount

#### Scenario: winner-order-SC-13 - An expired hold releases as a no-op

- **GIVEN** a winner whose bid-time authorization expired before the lot closed
- **WHEN** the lot closes
- **THEN** Grade10 records the release as successful
- **AND** creates the auction order and issues the invoice as normal

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
- **AND** the winner can retry with the same or a different payment method

### Requirement: The payment deadline is fixed at lot close

The payment deadline SHALL be 7 calendar days from lot close, including every
extended-bidding extension. Grade10 SHALL fix it at close, store it in UTC,
and display it in the winner's own timezone on both the invoice and the
auction order, per `shared/dates-and-times`.

Nothing the winner does SHALL move the deadline — not confirming an address,
not amending one, not a failed payment, and not leaving the order untouched.
Only an operator reissuing the invoice SHALL set a new deadline, per
`grade10-admin/auction/post-sale`.

A winner who never supplies a delivery address SHALL still reach the deadline.
Expiry SHALL NOT be contingent on the winner having completed anything.

#### Scenario: winner-order-SC-16 - The deadline is seven days from lot close

- **GIVEN** a lot whose bidding was extended twice and closed at
  2026-09-03T12:00:00Z
- **WHEN** the winner reads the invoice
- **THEN** the payment deadline is 2026-09-10T12:00:00Z
- **AND** it is displayed in the winner's own timezone

#### Scenario: winner-order-SC-17 - A winner who never gives an address still expires

- **GIVEN** an auction order whose winner has supplied no delivery address
- **WHEN** the payment deadline passes with the invoice still `pending`
- **THEN** the derived order status is Expired, per
  `grade10-site/auction/order-status`

### Requirement: Records the winner keeps

Each auction order SHALL carry these records, retrievable by the winner for
the life of their account.

| Record | When | Contents |
| --- | --- | --- |
| Payment receipt | Payment confirmed, by either route | Itemised: hammer price, buyer's premium, shipping, insurance, any tax amount, final amount |
| Shipping tracker | Fulfilment status is `fulfilled` | Carrier name, tracking number, and a link to the carrier |
| Delivery proof | `delivery_confirmed` is set | Whatever the carrier provided — handover timestamp, signature, proof-of-delivery image |

A receipt for a manually settled order SHALL be marked as manually settled,
SHALL be visually distinguishable from a Stripe-settled receipt, and SHALL
record the amount the operator confirmed, the settlement method, the external
reference, and a pointer to any invoice it supersedes.

#### Scenario: winner-order-SC-18 - A receipt is itemised and stays retrievable

- **GIVEN** an auction order paid at a final amount of 316000 minor units in HKD
- **WHEN** the winner opens the order a year later
- **THEN** the receipt shows the hammer price, buyer's premium, shipping,
  insurance, any tax amount supplied by the separate tax capability, and the
  final amount

#### Scenario: winner-order-SC-19 - A manually settled receipt says so

- **GIVEN** an auction order an operator settled manually at a revised final
  amount, superseding an earlier invoice
- **WHEN** the winner opens the receipt
- **THEN** it is marked as manually settled and is distinguishable from a
  Stripe-settled receipt
- **AND** it records the confirmed amount, the settlement method, the external
  reference, and the invoice it supersedes

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
