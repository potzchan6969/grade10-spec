## Purpose

Lets Grade10 operators work each Auction listing from live bidding through
paid and delivered, with payment and shipment as separate grants, a winner
they can contact, and a trail that records every status change and comment.

## ADDED Requirements

### Requirement: Operators see every listing with its outcome

Grade10 SHALL present authorized operators a queue of Auction listings. Each
row SHALL name the listing and show exactly one operator-facing outcome from
this closed set, using these labels:

- Draft — the listing is not yet available for bidding
- Scheduled — published, and the scheduled start has not arrived
- Live — published, bidding is open, and more than 60 minutes remain until
  the recorded close
- Ending soon — published, bidding is open, and 60 minutes or less remain
  until the recorded close
- Unsold — bidding has ended and there is no winner
- Canceled — the listing was called off
- Awaiting payment — there is a winner and payment is not paid and not failed
- Payment failed — there is a winner and automatic card capture has given up
- Paid — payment is recorded and shipment has not started
- Shipped — shipment has started and has not completed
- Delivered — shipment has completed

A listing SHALL NOT show two outcomes at once. Shipment state SHALL win over
payment state once shipment has started. Payment state SHALL win over a
bare closed listing once a winner exists. The queue unit is a **listing**,
not a sale event.

The queue SHALL allow an operator to restrict the rows to one outcome so
they can work Awaiting payment separately from Paid or Shipped.

#### Scenario: A published listing still taking bids is Live

- **GIVEN** a published listing whose start has arrived and whose recorded
  close is more than 60 minutes away
- **WHEN** an operator reads the queue
- **THEN** that listing's outcome is Live

#### Scenario: A listing inside the last hour is Ending soon

- **GIVEN** a published listing whose recorded close is 60 minutes or less
  away and has not passed
- **WHEN** an operator reads the queue
- **THEN** that listing's outcome is Ending soon

#### Scenario: A won listing waiting for money is Awaiting payment

- **GIVEN** a listing with a winner whose payment is not paid and has not
  given up automatic capture
- **WHEN** an operator reads the queue
- **THEN** that listing's outcome is Awaiting payment
- **AND** it is not Live, Paid, or Shipped

#### Scenario: An operator works only listings awaiting payment

- **GIVEN** the queue contains Live, Awaiting payment, and Paid listings
- **WHEN** the operator restricts the queue to Awaiting payment
- **THEN** Grade10 returns only listings whose outcome is Awaiting payment

### Requirement: Outcome indicators are visually distinct

Each outcome SHALL have a visual indicator on the queue row — a badge or
equivalent status mark — whose treatment differs by family:

- live bidding: Live
- urgency: Ending soon
- payment: Awaiting payment, Payment failed, Paid
- shipment: Shipped, Delivered
- terminal without a sale: Draft, Scheduled, Unsold, Canceled

Two outcomes in different families SHALL NOT share the same indicator
treatment. The indicator SHALL display the outcome label, not an internal
code.

#### Scenario: Ending soon does not look like Live

- **GIVEN** one Live listing and one Ending soon listing in the queue
- **WHEN** an operator views the queue
- **THEN** each row shows its outcome label
- **AND** the two indicators do not share the same visual treatment

#### Scenario: Paid does not look like Awaiting payment

- **GIVEN** one Awaiting payment listing and one Paid listing in the queue
- **WHEN** an operator views the queue
- **THEN** each row shows its outcome label
- **AND** the two indicators do not share the same visual treatment

### Requirement: Opening a listing shows its facts, winner, payment, shipment, and trail

Selecting a queue row SHALL open that listing's detail. The detail SHALL
show, together:

- listing identity and copy (title, listing label when present, sale when
  the listing belongs to one)
- bidding window (scheduled start, recorded close) and whether it has been
  extended past the published close
- money facts as integer minor units with an ISO 4217 currency code
  (starting price, current or winning amount)
- the operator-facing outcome
- the winner block when a winner exists
- payment state and, once paid, the payment source
- shipment state
- the listing trail

The detail SHALL NOT let an operator change who won or reopen a Canceled or
Unsold listing.

#### Scenario: An operator opens a won listing

- **GIVEN** a listing with a winner, a recorded close, and a winning amount
- **WHEN** the operator selects that listing from the queue
- **THEN** Grade10 shows the listing's title, window, winning amount with
  its currency, outcome, winner block, payment state, shipment state, and
  trail
- **AND** it offers no control that changes the winner

#### Scenario: A listing without a winner has no winner block

- **GIVEN** a Live or Unsold listing
- **WHEN** the operator opens it
- **THEN** Grade10 shows listing facts and outcome
- **AND** it does not present a winner as if one existed

### Requirement: Winner contact is visible to payment and shipment operators

When a listing has a winner, the detail SHALL present a winner block that
emphasizes contact:

- the winner's email as the primary contact, shown more prominently than
  identifiers
- the storefront the winner bid through
- the winner's name when the identity directory returns one for that
  storefront user
- the delivery address when Grade10 holds one for the listing; when it
  holds none, the block SHALL say that no delivery address is on file

An operator who can open the queue SHALL see this block. Seeing it SHALL
NOT require the grant that bans bidders. The block SHALL NOT show a Stripe
customer identifier, a payment-method identifier, or a card fingerprint.

An operator with the shipment-processing grant SHALL be able to record a
delivery address obtained offline when none is on file. Recording an
address SHALL NOT by itself mark the listing Shipped.

#### Scenario: The winner's email is the emphasized contact

- **GIVEN** a won listing whose winner's email snapshot is on file
- **WHEN** an operator who can open the queue views the detail
- **THEN** the winner block shows that email as the primary contact
- **AND** it shows the storefront the winner bid through
- **AND** it does not show a Stripe customer or payment-method identifier

#### Scenario: A shipment operator can record a missing delivery address

- **GIVEN** a paid listing with no delivery address on file
- **AND** the operator holds the shipment-processing grant
- **WHEN** the operator records a delivery address
- **THEN** the winner block shows that address
- **AND** the listing outcome remains Paid until shipment is recorded as
  started

#### Scenario: A payment operator sees winner contact without the ban grant

- **GIVEN** an operator who holds payment-processing and queue access and
  does not hold the grant that bans bidders
- **WHEN** they open a won listing
- **THEN** they see the winner block including email
- **AND** they are not offered a control that bans the winner

### Requirement: Payment reaches Paid from Stripe or from an operator

A listing with a winner SHALL reach Paid in exactly one of two ways:

1. **Stripe** — Grade10 records a verified card-capture success for that
   listing (a verified payment-provider event or the scheduled
   reconciliation that repairs a missed one).
2. **Manual** — an operator who holds the payment-processing grant records
   payment as collected.

The first successful paid record SHALL win. A listing already Paid SHALL
NOT be charged again and SHALL NOT change payment source. Grade10 SHALL
refuse a manual paid record when there is no winner, when the listing is
Canceled or Unsold, or when it is already Paid.

When an operator records payment manually and a card authorization for
that listing is still open, Grade10 SHALL mark that authorization for
release and SHALL NOT capture it.

Every money amount on this surface SHALL be an integer count of minor
units paired with an ISO 4217 currency code.

#### Scenario: Stripe capture marks the listing Paid

- **GIVEN** a listing in Awaiting payment with an open winner authorization
- **WHEN** Grade10 records a verified Stripe capture success for that
  listing
- **THEN** the listing outcome becomes Paid
- **AND** the payment source is Stripe
- **AND** the listing trail records the paid change as originating from
  Stripe, not from an operator

#### Scenario: An operator records payment collected offline

- **GIVEN** a listing in Awaiting payment or Payment failed
- **AND** the operator holds the payment-processing grant
- **WHEN** the operator records payment as collected
- **THEN** the listing outcome becomes Paid
- **AND** the payment source is Manual
- **AND** the listing trail records the paid change as that operator's
  action with source Manual

#### Scenario: Manual payment releases an open authorization instead of capturing it

- **GIVEN** a listing in Awaiting payment whose winner still has an open
  card authorization
- **WHEN** an operator records payment as collected
- **THEN** Grade10 marks that authorization for release
- **AND** it does not capture the authorization
- **AND** the listing is Paid with source Manual

#### Scenario: A second paid attempt is refused

- **GIVEN** a listing already Paid from Stripe
- **WHEN** an operator records payment as collected
- **THEN** Grade10 refuses the action
- **AND** the payment source remains Stripe
- **AND** the winner is unchanged

#### Scenario: Manual payment is refused without a winner

- **GIVEN** a Live or Unsold listing
- **WHEN** an operator records payment as collected
- **THEN** Grade10 refuses the action
- **AND** the listing outcome does not become Paid

### Requirement: Shipment is recorded in two offline milestones

Shipment SHALL be recorded only by an operator who holds the
shipment-processing grant. Grade10 SHALL accept two shipment records, in
this order only:

1. **Started** — the unit has left Grade10. The listing outcome becomes
   Shipped.
2. **Completed** — the winner has the unit. The listing outcome becomes
   Delivered.

Grade10 SHALL refuse Started unless the listing is Paid. It SHALL refuse
Completed unless the listing is Shipped. It SHALL NOT skip a milestone, go
backwards, or accept a carrier tracking number as a substitute for either
record. Recording shipment SHALL NOT change payment source or who won.

#### Scenario: An operator records that shipment started

- **GIVEN** a Paid listing
- **AND** the operator holds the shipment-processing grant
- **WHEN** the operator records shipment as started
- **THEN** the listing outcome becomes Shipped
- **AND** the trail records that operator, the previous outcome Paid, and
  the new outcome Shipped

#### Scenario: An operator records that shipment completed

- **GIVEN** a Shipped listing
- **AND** the operator holds the shipment-processing grant
- **WHEN** the operator records shipment as completed
- **THEN** the listing outcome becomes Delivered
- **AND** the trail records that operator and the new outcome Delivered

#### Scenario: Shipment cannot start before the listing is Paid

- **GIVEN** a listing in Awaiting payment or Payment failed
- **WHEN** an operator records shipment as started
- **THEN** Grade10 refuses the action
- **AND** the outcome does not become Shipped

#### Scenario: Completion cannot skip Started

- **GIVEN** a Paid listing that has not been recorded as Shipped
- **WHEN** an operator records shipment as completed
- **THEN** Grade10 refuses the action
- **AND** the outcome remains Paid

### Requirement: The listing trail records status changes and operator comments

Each listing detail SHALL show a trail of that listing's events in time
order, oldest to newest or newest to oldest consistently, including:

- every outcome change this capability records (payment reaching Paid,
  shipment Started, shipment Completed, and the automatic capture giving
  up)
- every operator comment on that listing

Each status-change entry SHALL show when it happened, who did it, the
outcome before and after when both exist, and — for a paid change — the
payment source Stripe or Manual. A Stripe-originated entry SHALL name the
payment provider as the actor, not an operator. A manual entry SHALL name
the operator.

An operator who can open the listing SHALL be able to leave a comment.
A comment SHALL be timestamped, SHALL name the operator, and SHALL appear
in the same trail as status changes, visually distinct from them. Grade10
SHALL refuse an empty comment. Comments SHALL NOT be edited or deleted
once recorded.

The trail SHALL NOT include chain hashes. Winner email and delivery
address SHALL NOT be copied into a status-change entry's details as a
side effect of recording the change; a comment contains only what the
operator wrote.

#### Scenario: Stripe paid and a later comment share one trail

- **GIVEN** a listing whose payment Grade10 recorded from Stripe
- **WHEN** an operator leaves the comment "Called winner about address"
- **THEN** the trail shows the paid change with actor Stripe and source
  Stripe
- **AND** it shows the comment with that operator, the comment text, and
  its timestamp
- **AND** the two entries are ordered by time

#### Scenario: Manual paid and Stripe paid are distinguishable on the trail

- **GIVEN** one listing paid from Stripe and one listing paid by an
  operator
- **WHEN** an operator reads each listing's trail
- **THEN** the Stripe listing's paid entry names Stripe as actor and
  Stripe as source
- **AND** the manually paid listing's paid entry names the operator as
  actor and Manual as source

#### Scenario: An empty comment is refused

- **GIVEN** an operator viewing a listing detail
- **WHEN** they submit a comment with no text
- **THEN** Grade10 refuses the comment
- **AND** the trail is unchanged

#### Scenario: A comment cannot be taken back

- **GIVEN** a comment already on a listing's trail
- **WHEN** the same operator, or another, tries to edit or delete it
- **THEN** Grade10 offers no successful edit or delete
- **AND** the original comment remains on the trail

### Requirement: Payment and shipment grants are split and the controls follow them

Grade10 SHALL enforce two distinct operator grants for this capability:

- **Payment-processing** — record payment as collected, and retry
  automatic capture where a retry already exists.
- **Shipment-processing** — record a delivery address, record shipment
  started, and record shipment completed.

Catalogue work that publishes or reschedules a listing SHALL NOT use the
shipment-processing grant. Bidder moderation SHALL NOT use either grant.

The `staff` role SHALL hold shipment-processing and SHALL NOT hold
payment-processing. Grade10 SHALL provide a `finance` role that holds
payment-processing and SHALL NOT hold shipment-processing. The `admin`
role SHALL hold both. An operator holds both grants only when their
assigned roles grant both.

On the listing detail, a control whose grant the caller lacks SHALL stay
visible and disabled, and SHALL NOT look like the listing lacks that
step. Grade10 SHALL refuse the same action on the server even if the
control is invoked.

An operator who can open the queue and holds neither grant SHALL still
read listing facts, winner contact, payment state, shipment state, and
the trail, and SHALL still leave comments.

#### Scenario: A staff operator sees payment controls disabled

- **GIVEN** an operator whose roles are exactly `staff`
- **AND** a listing in Awaiting payment
- **WHEN** they open the listing detail
- **THEN** the payment-recording control is visible and disabled
- **AND** they are not offered an enabled control that records payment

#### Scenario: A staff operator is refused if they record payment anyway

- **GIVEN** an operator whose roles are exactly `staff`
- **AND** a listing in Awaiting payment
- **WHEN** they submit a payment-collected record
- **THEN** Grade10 refuses it
- **AND** the listing is not Paid

#### Scenario: A finance operator sees shipment controls disabled

- **GIVEN** an operator whose roles are exactly `finance`
- **AND** a Paid listing
- **WHEN** they open the listing detail
- **THEN** the shipment-started control is visible and disabled
- **AND** they are not offered an enabled control that records shipment

#### Scenario: A finance operator is refused if they record shipment anyway

- **GIVEN** an operator whose roles are exactly `finance`
- **AND** a Paid listing
- **WHEN** they submit shipment-started
- **THEN** Grade10 refuses it
- **AND** the outcome remains Paid

#### Scenario: An admin can do both

- **GIVEN** an operator whose roles include `admin`
- **AND** a listing in Awaiting payment
- **WHEN** they record payment as collected and then record shipment as
  started
- **THEN** both actions succeed
- **AND** the outcome becomes Shipped

#### Scenario: Publishing a listing does not require shipment-processing

- **GIVEN** an operator who holds catalogue publishing and does not hold
  shipment-processing
- **WHEN** they publish a draft listing
- **THEN** Grade10 accepts the publish
- **AND** they still cannot record shipment started
