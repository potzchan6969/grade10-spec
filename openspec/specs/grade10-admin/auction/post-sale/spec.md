# grade10-admin/auction/post-sale Specification

## Purpose
Lets Grade10 operators close out each won Auction listing: collect payment,
record in-house shipment, and keep a trail. Payment and shipment are
separate jobs.

## Feature set

- Queue
  - One outcome per lot: a lot before a winner, and the derived order status after, in a single column an operator scans
  - Needs-action highlight: the outcomes waiting on an operator are marked, so the queue is a worklist rather than a report
  - Winner contact: whoever must reach the buyer can, without hunting through payment records
- Resolving an unpaid order
  - Reissue: a fresh invoice and a fresh deadline where non-payment was a genuine failure
  - Manual settlement: money taken outside the invoice flow, recorded against a confirmed address
  - Cancellation: the end of an order and the return of the lot
- Audit trail
  - Invoice log: every log entry against the money, including the attempts that failed
  - Fulfilment log: every log entry against the goods, with the address as it stood at each one
  - Retention: append-only, kept for the life of the account
- Grants
  - Payment processing: recording money is a grant catalogue work does not carry
  - Shipment processing: recording dispatch is a separate grant again

## Requirements

### Requirement: Listing outcomes

Each listing SHALL show exactly one outcome from this set. The queue
unit is a **listing**, not a sale. Shipment SHALL win over payment once
shipment has started. Payment SHALL win over a bare closed listing once
a winner exists. Grade10 SHALL NOT label a listing only "Paid".

| Outcome | When | Family | Needs action |
| --- | --- | --- | --- |
| Draft | Not yet available for bidding | Terminal without a sale | No |
| Scheduled | Published, start has not arrived | Terminal without a sale | No |
| Live | Bidding open, more than 60 minutes to close | Live bidding | No |
| Ending soon | Bidding open, 60 minutes or less to close | Urgency | No |
| Unsold | Bidding ended, no winner | Terminal without a sale | No |
| Canceled | Listing called off | Terminal without a sale | No |
| Awaiting payment | Winner exists, card capture still trying, no wire | Payment | No |
| Payment failed | Winner exists, card capture gave up | Payment | Yes |
| Awaiting wire | Winner will pay by wire, not yet paid | Payment | Yes |
| Paid via Stripe | Card capture succeeded, not shipped | Payment | Yes |
| Paid via Manual | Operator recorded collection, not shipped | Payment | Yes |
| Shipped | Shipment started, not completed | Shipment | Yes |
| Delivered | Shipment completed | Shipment | No |

The queue SHALL let an operator filter to one outcome. Each outcome
SHALL use a visual mark that shows this label, not an internal code.
Different families SHALL NOT share a mark. Paid via Stripe and Paid via
Manual SHALL NOT share a mark. Rows with Needs action = Yes SHALL get
an extra highlight.

#### Scenario: post-sale-SC-01 - A listing inside the last hour is Ending soon

- **GIVEN** a published listing whose recorded close is 60 minutes or
  less away and has not passed
- **WHEN** an operator reads the queue
- **THEN** that listing's outcome is Ending soon

#### Scenario: post-sale-SC-02 - Stripe capture and manual collection are different outcomes

- **GIVEN** one listing whose card capture succeeded and one listing
  whose operator recorded collection, neither shipped
- **WHEN** an operator reads the queue
- **THEN** the first listing's outcome is Paid via Stripe
- **AND** the second listing's outcome is Paid via Manual
- **AND** the two marks do not share the same treatment

#### Scenario: post-sale-SC-03 - An operator works only listings awaiting wire

- **GIVEN** the queue contains Live, Awaiting wire, and Paid via Manual
  listings
- **WHEN** the operator filters the queue to Awaiting wire
- **THEN** Grade10 returns only listings whose outcome is Awaiting wire

#### Scenario: post-sale-SC-04 - Awaiting wire is highlighted as needing action

- **GIVEN** an Awaiting wire listing and an Awaiting payment listing in
  the queue
- **WHEN** an operator views the queue
- **THEN** the Awaiting wire row carries the attention highlight
- **AND** the Awaiting payment row does not

### Requirement: Operators work each listing from the queue through delivered

An operator SHALL:

1. Open the Auction queue and see each listing with one outcome.
2. Open a listing and read its existing facts plus winner, payment,
   shipment, and trail.
3. Collect payment, or wait for a wire and then record collection.
4. Record shipment started, then completed.
5. Leave comments on the same trail as status changes.

This capability SHALL NOT change title, window, amounts, who won, or any
live-bid rule. Grade10 SHALL NOT let an operator change who won, or
reopen a Canceled or Unsold listing. An operator who can open the queue
SHALL still read listing facts, winner contact, payment, shipment, and
the trail, and SHALL still leave comments, even with neither
payment-processing nor shipment-processing.

#### Scenario: post-sale-SC-05 - Operator closes out a won listing

- **GIVEN** a listing in Awaiting payment
- **AND** the operator holds payment-processing and shipment-processing
- **WHEN** they record payment collected, then shipment started, then
  shipment completed
- **THEN** the outcome becomes Paid via Manual, then Shipped, then
  Delivered
- **AND** the winner is unchanged

#### Scenario: post-sale-SC-06 - Operator opens a won listing

- **GIVEN** a listing with a winner, a recorded close, and a winning amount
- **WHEN** the operator selects that listing from the queue
- **THEN** Grade10 shows the listing's existing facts plus outcome,
  winner, payment, shipment, and trail
- **AND** it offers no control that changes the winner

### Requirement: Trail fields

Each listing detail SHALL show a trail of that listing's events in one
consistent time order. Status changes and comments SHALL share this
trail. Comments SHALL NOT be edited or deleted once recorded. The trail
SHALL NOT include chain hashes. Winner email and delivery address SHALL
NOT be copied into a status-change entry.

| Field | Meaning |
| --- | --- |
| When | Time of the event |
| Actor | Operator, or Stripe for Paid via Stripe |
| Previous outcome | Outcome before a status change, when there was one |
| New outcome | Outcome after a status change |
| Comment | Text the operator wrote, visually distinct from status changes |

An operator who can open the listing SHALL be able to leave a comment.
Grade10 SHALL refuse an empty comment.

#### Scenario: post-sale-SC-07 - Stripe paid and an operator comment share the trail

- **GIVEN** a listing whose outcome is Paid via Stripe
- **WHEN** an operator leaves a comment
- **THEN** the trail shows the paid change with actor Stripe and
  outcome Paid via Stripe
- **AND** it shows the comment with that operator, the text, and its
  timestamp
- **AND** the two entries are ordered by time

### Requirement: Winner fields

When a listing has a winner, the detail SHALL show this block. Queue
access is enough to see it. It SHALL NOT require the grant that bans
bidders. It SHALL NOT show a Stripe customer identifier, payment-method
identifier, or card fingerprint.

| Field | Meaning |
| --- | --- |
| Email | Primary contact, shown first |
| Name | When the identity directory has one for that storefront user |
| Storefront | Storefront the winner bid through |

#### Scenario: post-sale-SC-08 - Winner email is the contact without Stripe identifiers

- **GIVEN** a won listing whose winner email is on file
- **WHEN** an operator who can open the queue views the detail
- **THEN** the winner block shows that email first
- **AND** it shows the storefront the winner bid through
- **AND** it does not show a Stripe customer or payment-method identifier

### Requirement: Payment states

A listing with a winner reaches a paid outcome in exactly one of two
ways. The first successful paid record SHALL win.

| State | Meaning | How it is reached |
| --- | --- | --- |
| Awaiting payment | Card capture still trying | Winner exists, no wire request |
| Payment failed | Card capture gave up | Automatic capture gave up |
| Awaiting wire | Waiting on a wire | Payment operator records a wire request from Awaiting payment or Payment failed |
| Paid via Stripe | Card capture succeeded | Verified card-capture success |
| Paid via Manual | Collected outside Stripe | Payment operator records collection, including a completed wire |

Entering Awaiting wire or Paid via Manual SHALL mark any open card
authorization for release and SHALL NOT capture it. Automatic capture
SHALL NOT run while the listing is Awaiting wire. Grade10 SHALL refuse
a wire request or a manual paid record when there is no winner, when
the listing is Canceled or Unsold, or when it is already Paid via
Stripe, Paid via Manual, Shipped, or Delivered.

Payment-processing SHALL allow recording a wire request, recording
collection, and retrying automatic capture. Bidder moderation SHALL NOT
use this grant.

| Role | Payment-processing |
| --- | --- |
| staff | No |
| finance | Yes |
| admin | Yes |

A payment control whose grant the caller lacks SHALL stay visible and
disabled. Grade10 SHALL refuse the same action on the server.

#### Scenario: post-sale-SC-09 - Wire request releases the card hold

- **GIVEN** a listing in Awaiting payment whose winner still has an
  open card authorization
- **AND** the operator holds payment-processing
- **WHEN** they record that the winner requested wire transfer
- **THEN** the outcome becomes Awaiting wire
- **AND** Grade10 marks that authorization for release
- **AND** it does not capture the authorization

#### Scenario: post-sale-SC-10 - Stripe capture marks the listing Paid via Stripe

- **GIVEN** a listing in Awaiting payment with an open winner
  authorization
- **WHEN** Grade10 records a verified card-capture success for that
  listing
- **THEN** the outcome becomes Paid via Stripe
- **AND** the trail records the change as originating from Stripe, not
  from an operator

#### Scenario: post-sale-SC-11 - Manual collection marks Paid via Manual and releases the hold

- **GIVEN** a listing in Awaiting payment, Payment failed, or Awaiting
  wire
- **AND** the operator holds payment-processing
- **WHEN** they record payment as collected
- **THEN** the outcome becomes Paid via Manual
- **AND** if a card authorization is still open, Grade10 marks it for
  release and does not capture it

#### Scenario: post-sale-SC-12 - A second paid attempt is refused

- **GIVEN** a listing already Paid via Stripe
- **WHEN** an operator records payment as collected
- **THEN** Grade10 refuses the action
- **AND** the outcome remains Paid via Stripe
- **AND** the winner is unchanged

#### Scenario: post-sale-SC-13 - Staff cannot record payment

- **GIVEN** an operator whose roles are exactly `staff` and a listing
  in Awaiting payment
- **WHEN** they open the listing and submit a payment-collected record
- **THEN** the payment control is visible and disabled
- **AND** Grade10 refuses the record
- **AND** the listing is not Paid via Manual

### Requirement: Shipment states

Shipment SHALL be recorded only by an operator who holds
shipment-processing, in this order only. Recording shipment SHALL NOT
change who won or the paid outcome that preceded it. Grade10 SHALL NOT
accept a carrier tracking number instead of either record.

| State | Outcome | Meaning | Allowed from |
| --- | --- | --- | --- |
| Not started | The paid outcome | Unit still in-house | — |
| Started | Shipped | Unit left Grade10 | Paid via Stripe or Paid via Manual |
| Completed | Delivered | Winner has the unit | Started |

Shipment-processing SHALL allow recording a delivery address, shipment
started, and shipment completed. Catalogue publishing SHALL NOT use this
grant. Bidder moderation SHALL NOT use this grant.

| Role | Shipment-processing |
| --- | --- |
| staff | Yes |
| finance | No |
| admin | Yes |

A shipment control whose grant the caller lacks SHALL stay visible and
disabled. Grade10 SHALL refuse the same action on the server.

#### Scenario: post-sale-SC-14 - Shipment follows paid, then started, then completed

- **GIVEN** a Paid via Stripe or Paid via Manual listing
- **AND** the operator holds shipment-processing
- **WHEN** they record shipment started, then completed
- **THEN** the outcome becomes Shipped, then Delivered
- **AND** the trail names that operator and each new outcome

#### Scenario: post-sale-SC-15 - Shipment cannot skip ahead

- **GIVEN** a listing in Awaiting payment
- **WHEN** an operator records shipment started
- **THEN** Grade10 refuses the action
- **AND** the outcome does not become Shipped

- **GIVEN** a Paid via Manual listing that has not been recorded as
  Shipped
- **WHEN** an operator records shipment completed
- **THEN** Grade10 refuses the action
- **AND** the outcome remains Paid via Manual

#### Scenario: post-sale-SC-16 - Finance cannot record shipment

- **GIVEN** an operator whose roles are exactly `finance` and a Paid
  via Stripe listing
- **WHEN** they open the listing and submit shipment started
- **THEN** the shipment control is visible and disabled
- **AND** Grade10 refuses the record
- **AND** the outcome remains Paid via Stripe

#### Scenario: post-sale-SC-17 - Publishing a listing does not need the shipment grant

- **GIVEN** an operator who holds catalogue publishing and does not
  hold shipment-processing
- **WHEN** they publish a draft listing
- **THEN** Grade10 accepts the publish
- **AND** they still cannot record shipment started

### Requirement: Delivery address

When Grade10 holds a delivery address for the listing, the detail SHALL
show it. When it holds none, the detail SHALL say that none is on file.
An operator with shipment-processing SHALL be able to record a missing
delivery address. That SHALL NOT mark the listing Shipped.

#### Scenario: post-sale-SC-18 - Recording an address does not ship the listing

- **GIVEN** a Paid via Stripe or Paid via Manual listing with no
  delivery address
- **AND** the operator holds shipment-processing
- **WHEN** they record a delivery address
- **THEN** the detail shows that address
- **AND** the outcome stays that paid outcome until shipment is recorded
  as started

### Requirement: The queue shows one outcome per lot

Each lot SHALL show exactly one outcome. Before a lot has a winner the
outcome describes the lot; once it has one, the outcome SHALL be the derived
order status from `grade10-site/auction/order-status`, taken unchanged.
Grade10 SHALL NOT compute a second status for the operator.

| Outcome | When | Family | Needs action |
| --- | --- | --- | --- |
| Draft | Not yet available for bidding | Before a sale | No |
| Scheduled | Published, the start has not arrived | Before a sale | No |
| Live | Bidding open, more than 60 minutes to close | Before a sale | No |
| Ending soon | Bidding open, 60 minutes or less to close | Before a sale | No |
| Unsold | Bidding ended with no winner | Before a sale | No |
| Called off | The lot was withdrawn before a sale | Before a sale | No |
| Pending Payment | Derived: invoice `pending`, deadline not elapsed | Order | No |
| Expired | Derived: invoice `pending`, deadline elapsed | Order | **Yes** |
| Processing | Derived: invoice `paid`, not dispatched | Order | **Yes** |
| Shipped | Derived: dispatched, delivery not confirmed | Order | No |
| Delivered | Derived: delivery confirmed | Order | No |
| Cancelled | Derived: invoice `cancelled` | Order | No |
| Refunded | Derived: invoice `refunded` | Order | No |

The queue SHALL let an operator filter to one outcome. Each outcome SHALL use
a visual mark showing this label rather than an internal code, and two
families SHALL NOT share a mark. A row whose outcome needs action SHALL carry
an additional highlight.

#### Scenario: grade10-admin-auction-post-sale-SC-19 - A lot inside its last hour is Ending soon

- **GIVEN** a published lot whose close is 60 minutes or less away and has not
  passed
- **WHEN** an operator reads the queue
- **THEN** that lot's outcome is Ending soon

#### Scenario: grade10-admin-auction-post-sale-SC-20 - A won lot's outcome is its derived order status

- **GIVEN** a closed lot whose auction order derives as Processing
- **WHEN** an operator reads the queue
- **THEN** that lot's outcome is Processing
- **AND** it is the same value the winner reads on their own order

#### Scenario: grade10-admin-auction-post-sale-SC-21 - Expired and Processing are highlighted as needing action

- **GIVEN** a queue holding one Expired order, one Processing order, and one
  Delivered order
- **WHEN** an operator reads it
- **THEN** the Expired and Processing rows carry the needs-action highlight
- **AND** the Delivered row does not

### Requirement: Winner contact fields

An order's detail SHALL show the winner with their contact details
emphasised: the name on the account, the registered account email, and any
phone number Grade10 already holds. Grade10 SHALL NOT show a payment-provider
customer or payment identifier as the winner's contact.

#### Scenario: grade10-admin-auction-post-sale-SC-22 - The winner's email is the contact

- **GIVEN** an auction order with a winner
- **WHEN** an operator opens it
- **THEN** the winner's name and registered account email are shown as the
  contact
- **AND** no payment-provider identifier is shown in their place

### Requirement: An operator resolves an unpaid order

An operator holding payment-processing SHALL be able to take these actions on
an auction order whose invoice status is `pending`.

| Action | Effect | Available |
| --- | --- | --- |
| Reissue invoice | Issues a fresh invoice with a new 7-day payment deadline. Invoice status stays `pending`, so the derived order status returns to Pending Payment | On an Expired order |
| Settle manually | Records payment taken outside the invoice flow. Requires address confirmation and recalculation first. Invoice status becomes `paid`, so the order derives as Processing | On any `pending` order, expired or not |
| Cancel order | Invoice status becomes `cancelled`. The lot returns to available | On an Expired order |

Grade10 SHALL make manual settlement available before expiry as well as
after, so a winner settling by bank transfer need not let their deadline
elapse first.

Reissue, manual settlement and cancellation SHALL each record a named
operator and a mandatory reason.

Reissuing an invoice SHALL NOT lift the winner's account suspension, per
`grade10-site/auction/bidder-suspension`. Reinstatement is a separate,
explicit action.

#### Scenario: grade10-admin-auction-post-sale-SC-23 - Reissue returns an expired order to Pending Payment

- **GIVEN** an auction order deriving as Expired
- **AND** an operator holding payment-processing
- **WHEN** they reissue the invoice with a reason
- **THEN** the invoice status is still `pending` with a new 7-day deadline
- **AND** the derived order status is Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-24 - Reissue leaves the suspension standing

- **GIVEN** a suspended winner whose expired order an operator reissues
- **WHEN** the reissue is committed
- **THEN** the account is still suspended
- **AND** the operator is not offered reinstatement as part of the reissue

#### Scenario: grade10-admin-auction-post-sale-SC-25 - An operator without the grant is refused

- **GIVEN** an operator who does not hold payment-processing
- **WHEN** they open an Expired order
- **THEN** the reissue, settle and cancel controls are visible and disabled
- **AND** Grade10 refuses those actions on the server if they are attempted

### Requirement: Manual settlement confirms the address and recalculates

Manual settlement bypasses the buyer-facing flow where address confirmation
normally sits, so the operator assumes that responsibility. Grade10 SHALL
require this sequence.

1. The operator opens the unpaid order and selects settle manually.
2. Grade10 shows the delivery address currently on the order, whether it came
   from the platform address book, from the winner, or is absent.
3. The operator confirms or updates that address. Confirmation is mandatory
   and SHALL be required even where the address is unchanged.
4. On an update, Grade10 recalculates address-based shipping and insurance
   against the new address, producing a revised final amount. Tax calculation,
   rates, jurisdictions, and exemptions remain reserved for a separate tax
   change.
5. Grade10 shows the operator the previous total and the new total before
   they commit.
6. The operator records the settlement method and an external reference.
7. On commit, the delivery address locks, the invoice status becomes `paid`,
   and Grade10 writes a payment record **at the revised final amount**.

The payment record and the receipt SHALL carry the revised final amount, not
the amount on the last buyer-facing invoice. Where the two differ, the
receipt SHALL show both the recorded amount and a reference to the invoice it
supersedes, so the difference is explicable during reconciliation rather than
appearing as an unexplained variance.

Grade10 SHALL log the operator, the timestamp, the prior address, the new
address, the prior final amount, the revised final amount, the settlement
method, and the external reference.

#### Scenario: grade10-admin-auction-post-sale-SC-26 - Settlement cannot proceed without confirming the address

- **GIVEN** an unpaid auction order whose delivery address is unchanged from
  the account default shipping address
- **WHEN** an operator selects settle manually and attempts to commit without
  confirming that address
- **THEN** Grade10 refuses the settlement
- **AND** the invoice status is still `pending`

#### Scenario: grade10-admin-auction-post-sale-SC-27 - Updating the address recalculates before commit

- **GIVEN** an unpaid auction order whose final amount is 312000 minor units
  in HKD
- **WHEN** an operator updates the delivery address to one where shipping and
  insurance price 4000 minor units higher
- **THEN** Grade10 shows 312000 minor units and 316000 minor units in HKD
  before the operator commits

#### Scenario: grade10-admin-auction-post-sale-SC-28 - The payment record carries the revised amount

- **GIVEN** that same order, committed at a revised final amount of 316000
  minor units in HKD against a last invoice of 312000 minor units in HKD
- **WHEN** the settlement is committed
- **THEN** the payment record is written at 316000 minor units in HKD
- **AND** the receipt shows that amount and a reference to the superseded
  invoice
- **AND** the delivery address is locked

#### Scenario: grade10-admin-auction-post-sale-SC-29 - Manual settlement is available before expiry

- **GIVEN** an auction order deriving as Pending Payment, three days from its
  deadline, whose winner has said they will pay by bank transfer
- **AND** an operator holding payment-processing
- **WHEN** they settle it manually
- **THEN** Grade10 accepts the settlement
- **AND** the order derives as Processing without having expired first

#### Scenario: grade10-admin-auction-post-sale-SC-30 - A settled order refuses a second settlement

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** an operator attempts to record a second settlement against it
- **THEN** Grade10 refuses it
- **AND** the existing payment record is unchanged

### Requirement: Reissue is uncapped and fully logged

Grade10 SHALL place no limit on how many times an invoice may be reissued on
the same auction order, and SHALL write every reissue to an append-only log
carrying these fields.

| Field | Purpose |
| --- | --- |
| Auction order and lot | Which order was reissued |
| Reissue sequence number | The first, second, third reissue on this order |
| Operator | Who performed it |
| Timestamp | In UTC |
| Reason | Free text, mandatory |
| Prior deadline and new deadline | The deadline trail |
| Final amount at reissue | So amount drift across reissues is detectable |

Grade10 SHALL surface an order's reissue count on that order, and a buyer's
reissue history across **all** their orders on the account record, so a
reviewer sees the pattern before granting another.

#### Scenario: grade10-admin-auction-post-sale-SC-33 - A third reissue is accepted and numbered

- **GIVEN** an auction order already reissued twice
- **WHEN** an operator reissues it a third time with a reason
- **THEN** Grade10 accepts it
- **AND** the log records reissue sequence number 3, the operator, the reason,
  the prior and new deadlines, and the final amount at reissue

### Requirement: Cancellation reopens the lot

On cancellation Grade10 SHALL:

- Set the invoice status to `cancelled`, which is terminal. The order derives
  as Cancelled.
- Return the lot's inventory status to available, making it eligible to be
  listed in a new auction.
- Make **no runner-up offer**. The second-highest bidder SHALL acquire no
  right to the lot.
- Retain the lot's prior auction history — hammer price and bid history — for
  audit, and SHALL NOT carry it into the new listing.

#### Scenario: grade10-admin-auction-post-sale-SC-31 - Cancelling returns the lot to available

- **GIVEN** an auction order deriving as Expired
- **WHEN** an operator cancels it with a reason
- **THEN** the invoice status is `cancelled` and the order derives as Cancelled
- **AND** the lot's inventory status is available and it can be listed again

#### Scenario: grade10-admin-auction-post-sale-SC-32 - No runner-up is offered the cancelled lot

- **GIVEN** a cancelled auction order whose lot had a second-highest bidder
- **WHEN** the cancellation completes
- **THEN** Grade10 makes that bidder no offer
- **AND** they acquire no right to the lot

### Requirement: Invoice log history

Every change to an auction order's money SHALL be written as an append-only
invoice log entry, never as a field overwrite. The order's detail SHALL show
these log entries in chronological order.

| Field | Notes |
| --- | --- |
| Log type | Issued, reissued, paid, manually settled, cancelled, refunded, payment attempt failed |
| Timestamp | Stored in UTC, displayed in the operator's own timezone |
| Invoice status after the log entry | |
| Final amount at the log entry | Captures amount changes across address amendments and reissues |
| Amount delta | Where the amount changed from the prior log entry |
| Payment deadline at the log entry | The deadline trail across reissues |
| Reissue sequence number | Where the log entry is a reissue |
| Actor | The buyer, the system, or a named operator |
| Settlement method and external reference | Manual settlements only |
| Reason | Mandatory on an operator-initiated log entry |
| Payment-provider reference | Where one applies |

Grade10 SHALL record failed payment attempts in the invoice log. A buyer who tried
three times with a declining card is a different case from one who never
engaged, and the difference SHALL be visible to whoever decides on
reinstatement.

#### Scenario: grade10-admin-auction-post-sale-SC-34 - Failed payment attempts appear in the invoice log

- **GIVEN** a winner whose card was declined three times before the deadline
  elapsed
- **WHEN** an operator reads the invoice log
- **THEN** it shows three failed payment attempts with their timestamps
- **AND** the buyer is distinguishable from one whose history holds only the
  issued log entry

#### Scenario: grade10-admin-auction-post-sale-SC-35 - An amendment's amount change is on the record

- **GIVEN** an auction order whose winner amended the address, changing the
  final amount from 312000 to 316000 minor units in HKD
- **WHEN** an operator reads the invoice log
- **THEN** it shows the reissued event at 316000 minor units in HKD
- **AND** the delta from the prior event

### Requirement: Fulfilment log history

Every change to an auction order's goods SHALL be written as an append-only
fulfilment log entry. The order's detail SHALL show these log entries in
chronological order.

| Field | Notes |
| --- | --- |
| Log type | Created, address confirmed, address amended, dispatched, delivery confirmed, delivery exception |
| Timestamp | Stored in UTC |
| Fulfilment status after the log entry | |
| Delivery address at the log entry | A full snapshot, never a pointer — the address at dispatch SHALL remain reconstructable after a later edit |
| Actor | The buyer, the warehouse, the carrier, or a named operator |
| Carrier and tracking number | From dispatch onward |
| Delivery proof | Timestamp, signature, proof-of-delivery image, as the carrier provided |
| Reason | Mandatory on an operator-initiated change |

Because amending an address changes the final amount, the address history and
the invoice amount history SHALL be independently reconstructable and
cross-referenceable, so an amount change can be explained afterwards.

#### Scenario: grade10-admin-auction-post-sale-SC-36 - The address at dispatch survives a later edit

- **GIVEN** an auction order dispatched to one address, whose address an
  operator later corrects
- **WHEN** an operator reads the fulfilment log
- **THEN** the dispatch event still shows the full address as it stood at
  dispatch
- **AND** the correction is a separate later event with its own snapshot

### Requirement: The order detail explains its status

An auction order's detail SHALL show:

- The invoice status, the fulfilment status, and the **derived** order status,
  together with the derivation rule that produced it — for example, Expired
  because the invoice is pending and the deadline elapsed two days ago.
- The payment deadline, with a countdown or an elapsed indicator.
- The reissue count for this order.
- The winner's account suspension state and its reason.
- The winner's reissue history across all of their orders.
- The full invoice log and the full fulfilment log.
- A link to the source lot and its bid history.

#### Scenario: grade10-admin-auction-post-sale-SC-37 - The detail explains the status it derived

- **GIVEN** an auction order whose invoice is `pending` and whose deadline
  elapsed two days ago
- **WHEN** an operator opens it
- **THEN** the order status shows as Expired
- **AND** the detail names the rule that produced it — a pending invoice with
  an elapsed deadline — rather than the label alone

#### Scenario: grade10-admin-auction-post-sale-SC-38 - A buyer's reissue history spans all their orders

- **GIVEN** a buyer with reissues on three different auction orders
- **WHEN** an operator opens any one of those orders
- **THEN** the detail shows that buyer's reissue history across all three
- **AND** the reissue count for the order in front of them

### Requirement: Payment and shipment are separate grants

Recording money and recording dispatch SHALL be distinct grants held by
different roles. Catalogue work and bidder moderation SHALL carry neither.

| Role | Payment-processing | Shipment-processing |
| --- | --- | --- |
| staff | No | Yes |
| finance | Yes | No |
| admin | Yes | Yes |

Payment-processing SHALL allow reissue, manual settlement, and cancellation.
Shipment-processing SHALL allow recording a delivery address and recording
dispatch. A control whose grant the caller lacks SHALL stay visible and
disabled, and Grade10 SHALL refuse the same action on the server.

Recording a delivery address SHALL NOT dispatch the lot.

#### Scenario: grade10-admin-auction-post-sale-SC-39 - Staff cannot record payment

- **GIVEN** an operator holding the staff role
- **WHEN** they open an Expired order
- **THEN** the reissue, settle and cancel controls are visible and disabled
- **AND** Grade10 refuses those actions on the server

#### Scenario: grade10-admin-auction-post-sale-SC-40 - Finance cannot record dispatch

- **GIVEN** an operator holding the finance role
- **WHEN** they open a Processing order
- **THEN** the dispatch control is visible and disabled
- **AND** Grade10 refuses a dispatch from them on the server

#### Scenario: grade10-admin-auction-post-sale-SC-41 - Recording an address does not dispatch the lot

- **GIVEN** a Processing order with no delivery address
- **AND** an operator holding shipment-processing
- **WHEN** they record a delivery address
- **THEN** the detail shows that address
- **AND** the order still derives as Processing until dispatch is recorded

### Requirement: History is append-only and retained

Grade10 SHALL retain every invoice and fulfilment log record for the life
of the account, whatever the order's outcome, including cancelled orders
whose lots have been relisted. No record SHALL be deleted or edited in place.

Every operator-initiated log entry SHALL carry a named operator and a reason.
A system-initiated log entry SHALL record the event that triggered it.

#### Scenario: grade10-admin-auction-post-sale-SC-42 - A relisted lot's cancelled order is retained

- **GIVEN** a cancelled auction order whose lot has since been relisted and
  sold again
- **WHEN** an operator opens the cancelled order
- **THEN** its full invoice and fulfilment log is still readable
- **AND** no record has been deleted or edited in place

#### Scenario: grade10-admin-auction-post-sale-SC-43 - An operator event without a reason is refused

- **GIVEN** an operator holding payment-processing
- **WHEN** they attempt to reissue an invoice without giving a reason
- **THEN** Grade10 refuses the action
- **AND** writes no history log entry
