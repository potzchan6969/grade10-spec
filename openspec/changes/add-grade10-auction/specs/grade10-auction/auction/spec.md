# Grade10 Auction — delta

## Purpose

Grade10's card-auction capability lets collectors browse an Auction listing,
place a card-backed bid within its scheduled window, complete a won order, and
read its initial manual-fulfilment progress. A **listing** is one auction lot.

## ADDED Requirements

### Requirement: Auction listing facts are available

Grade10 SHALL publish a catalogue of Auction listings grouped by their
collectible-card category. It SHALL NOT publish or represent Auction Buy Now
listings in this capability. A listing detail SHALL identify the card's grading
or condition and state that the card is Grade10 authenticated. It SHALL show
the listing's starting price, bid increment, current bid, bid count, applicable
buyer fee, bidding start and close, and whether bidding is open.

All money facts SHALL be an integer count of minor units paired with an ISO
4217 currency code. A listing's applicable fee, currency, region, and deadline
terms SHALL be an immutable snapshot of the operational policy effective when
the listing becomes available for bidding.

#### Scenario: A collector browses Auction listings

- **GIVEN** published Auction listings in Pokémon, MTG, and basketball-card categories
- **WHEN** a collector opens the Auction catalogue
- **THEN** Grade10 returns those Auction listings grouped or identifiable by category
- **AND** it returns no Buy Now listing or purchasable stock count

#### Scenario: A listing identifies its card facts

- **GIVEN** an Auction listing for a graded card
- **WHEN** a collector opens its detail
- **THEN** Grade10 displays its grading or condition
- **AND** it states that the card is Grade10 authenticated
- **AND** it displays the listing's bidding facts without exposing payment credentials

#### Scenario: Money facts use minor units and currency

- **GIVEN** an Auction listing with a starting price and buyer fee
- **WHEN** Grade10 returns its listing or checkout facts
- **THEN** every monetary amount is an integer minor-unit value and an ISO 4217 currency code
- **AND** no browser-supplied monetary value determines an accepted bid or payable total

### Requirement: Bids are valid only within the scheduled, extendable window

Each listing SHALL have a scheduled bidding start and close. A bidder MAY place
a bid only from the scheduled start through the recorded close. A valid bid
SHALL meet or exceed the current bid plus the listing's configured increment;
when there is no current bid, it SHALL meet or exceed the starting price.

When Grade10 accepts a valid bid with 30 minutes or less remaining, it SHALL
set that listing's close to exactly 30 minutes after the accepted bid. A listing
MAY define an extension cap; when it does, its close SHALL NOT exceed its
scheduled close plus that cap. Grade10 SHALL apply this rule to every later
valid bid until 30 minutes pass without a valid bid or the cap is reached.
Grade10 SHALL display the current recorded close and, to an authenticated
bidder, their highest accepted bid on that listing.

#### Scenario: A bid must meet the next increment

- **GIVEN** an open listing with a current bid and configured increment
- **WHEN** a bidder submits less than the next valid bid amount
- **THEN** Grade10 refuses the bid and names the minimum valid amount
- **AND** it creates no accepted bid or card authorization for that attempt

#### Scenario: A bid outside the window is refused

- **GIVEN** a listing whose scheduled start has not arrived or whose recorded close has passed
- **WHEN** a bidder submits a bid
- **THEN** Grade10 refuses the bid
- **AND** it does not create an accepted bid or change the recorded close

#### Scenario: A late valid bid extends the close

- **GIVEN** an open listing with 30 minutes or less until its recorded close
- **WHEN** Grade10 accepts a valid bid at time T
- **THEN** the listing close becomes T plus 30 minutes
- **AND** another valid bid within the resulting final 30 minutes applies the same rule again

#### Scenario: An extension cap limits an otherwise eligible extension

- **GIVEN** an open listing with an extension cap and a recorded close at that cap
- **WHEN** Grade10 accepts a valid bid with 30 minutes or less remaining
- **THEN** it accepts the bid without changing the recorded close
- **AND** it does not extend the listing beyond its configured cap

#### Scenario: A bidder sees live bid facts

- **GIVEN** an authenticated bidder with an accepted bid on an open listing
- **WHEN** the bidder reads that listing
- **THEN** Grade10 returns the current bid, bid count, and the bidder's highest accepted bid
- **AND** it does not disclose another bidder's identity or card authorization facts

### Requirement: Card-backed bids have one releasable authorization per bidder and listing

Before accepting a bid, Grade10 SHALL obtain a Stripe card authorization for
that bidder and active listing using a selected saved or recent payment method.
For each bidder/listing pair, Grade10 SHALL maintain at most one active
authorization and SHALL raise it only when the bidder raises their committed
bid amount. A bid is accepted only after its corresponding authorized outcome
is recorded.

When a bidder is outbid by a higher accepted bid, Grade10 SHALL immediately
mark that bidder's active authorization for asynchronous release. It SHALL also
mark every unsuccessful bidder's authorization for asynchronous release when the
listing closes. Stripe webhook signatures SHALL be verified over the unmodified
raw body before processing; provider events and bid requests SHALL be
idempotent. A delayed authorization for a bid that is no longer high enough
SHALL be marked for release and SHALL NOT become an accepted bid.

#### Scenario: An outbid authorization is released

- **GIVEN** a bidder has the active authorization for an open listing
- **WHEN** Grade10 accepts a higher valid bid from another bidder
- **THEN** Grade10 marks the outbid bidder's authorization for asynchronous release
- **AND** the outbid bidder no longer has an eligible top authorization for that listing
- **AND** Grade10 records the Stripe release outcome when it arrives

#### Scenario: Concurrent bids keep the highest valid outcome

- **GIVEN** two bidders submit different valid bid amounts against the same current listing state
- **WHEN** Grade10 evaluates the requests concurrently
- **THEN** it records bid outcomes in one listing order
- **AND** the current bid is the highest valid accepted amount
- **AND** no lower bid can overwrite that current bid

#### Scenario: A delayed lower authorization cannot land

- **GIVEN** a bidder's card authorization is pending for a listing
- **AND** Grade10 has accepted a higher valid bid before Stripe confirms that pending authorization
- **WHEN** Stripe later confirms the lower authorization
- **THEN** Grade10 releases the lower authorization
- **AND** it does not record that lower bid as accepted or change the current bid

#### Scenario: An invalid or duplicate Stripe event changes nothing twice

- **GIVEN** Grade10 receives a Stripe authorization, release, or capture webhook
- **WHEN** the webhook signature is invalid or its provider event was already processed
- **THEN** Grade10 rejects the invalid event or returns the duplicate outcome without another state transition
- **AND** it does not duplicate a bid, hold, release, capture, invoice, or order state

### Requirement: A closed listing creates a payable winner order

When a listing closes with an accepted highest bid, Grade10 SHALL create one
winner order. Before Auction starts payment, the winner SHALL supply home
delivery information. Grade10 SHALL use the supplied delivery information and
the listing's recorded policy terms to calculate the winner's server-side
payable total: winning bid, applicable buyer fee, taxes, fixed home-delivery
shipping, and any required international customs declaration. The winner SHALL
review that complete total and be able to select a saved or recent credit-card
payment method. Grade10 SHALL capture the final payable amount only after
Stripe has authorized that amount; it SHALL obtain any necessary additional
authorization before capture rather than capture more than Stripe authorized.

After Stripe confirms payment, Grade10 SHALL create a Stripe invoice and mark
the order paid. It SHALL report order state independently as `won`, `paid`,
`shipping_started`, or `shipped`. Only an authorized operator MAY advance a
paid order to `shipping_started` and then `shipped`; no state in this
capability implies carrier tracking or delivery.

#### Scenario: A closed listing creates its winner order

- **GIVEN** a listing reaches its recorded close with an accepted highest bid
- **WHEN** Grade10 closes the listing
- **THEN** it creates exactly one order for that highest bidder in `won` state
- **AND** it releases every non-winner authorization

#### Scenario: A winner sees a complete checkout breakdown

- **GIVEN** a winner opens their won order before payment
- **WHEN** Grade10 returns checkout facts
- **THEN** it displays the winning bid, buyer fee, taxes, fixed home-delivery shipping, any required customs declaration, and order total
- **AND** it permits a saved or recent credit-card payment method

#### Scenario: A winner provides delivery information before payment

- **GIVEN** a winner order in won state
- **WHEN** the winner supplies valid home-delivery information
- **THEN** Grade10 calculates the server-side taxes, fixed shipping, and any required customs declaration for that delivery information
- **AND** it returns the complete payable total before starting card payment

#### Scenario: Payment cannot start without delivery information

- **GIVEN** a winner order without home-delivery information
- **WHEN** the winner attempts to start card payment
- **THEN** Grade10 refuses payment and requests delivery information
- **AND** it does not capture or create an additional Stripe authorization

#### Scenario: A winner payment becomes paid once

- **GIVEN** a winner order with a Stripe authorization sufficient for its payable total
- **WHEN** Stripe confirms its capture
- **THEN** Grade10 marks the order paid and creates one Stripe invoice
- **AND** duplicate or delayed Stripe events do not create another capture, invoice, or paid transition

#### Scenario: A winner sees their order state

- **GIVEN** a winner has an Auction order
- **WHEN** the winner reads that order
- **THEN** Grade10 returns its current Won, Paid, Shipping Started, or Shipped state
- **AND** it returns no invented tracking or delivery status

#### Scenario: An authorized operator advances manual shipping

- **GIVEN** a paid Auction order
- **WHEN** an authorized operator records that fulfilment has begun and later records dispatch
- **THEN** Grade10 advances the order from paid to shipping started and then shipped
- **AND** it records the authorized operator and transition times

#### Scenario: A customer cannot read another customer's order

- **GIVEN** a signed-in Auction customer
- **WHEN** the customer requests an order belonging to another customer
- **THEN** Grade10 refuses the request
- **AND** returns no order, payment, shipping, address, or authorization facts

#### Scenario: An unauthorized user cannot update an Auction order

- **GIVEN** a user without Auction-operator authorization
- **WHEN** the user attempts to advance an Auction order's shipping state
- **THEN** Grade10 refuses the request
- **AND** the order state remains unchanged

### Requirement: Stripe configuration and delayed payment facts are handled explicitly

Grade10 SHALL require the configured Stripe account, payment-method capability,
webhook secret, and authorization/capture capability before it offers a
card-backed Auction action. Missing configuration or an unsupported Stripe
outcome SHALL fail the affected action explicitly without exposing credentials,
card data, or customer address data. A winner-order read and scheduled
reconciliation SHALL query Stripe by the recorded provider reference to repair
a delayed or missed valid webhook.

#### Scenario: Stripe configuration is incomplete

- **GIVEN** an Auction operation requiring Stripe
- **WHEN** required Stripe configuration is absent or does not support the required authorization/capture action
- **THEN** Grade10 fails that operation explicitly naming the unavailable capability
- **AND** it does not silently create a bid, order payment, or fixture-backed outcome

#### Scenario: A missed payment webhook is repaired

- **GIVEN** Stripe has captured a winner payment but Grade10 has not processed its webhook
- **WHEN** the winner reads the order or scheduled reconciliation reaches it
- **THEN** Grade10 reads the recorded Stripe payment reference
- **AND** it marks the order paid and creates its invoice exactly once
