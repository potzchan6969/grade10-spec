# grade10-admin/auction/post-sale Specification

## Purpose
Post-sale operators can see, complete and protect the billing address needed
before a winner's invoice is sent.

## Feature set

- Queue
  - One outcome per lot: a lot before a winner, and the derived order status after, in a single column an operator scans
  - Needs-action highlight: the outcomes waiting on an operator are marked, so the queue is a worklist rather than a report
  - Winner contact: whoever must reach the buyer can, without hunting through payment records
  - Extended bidding label: an operator sees which lots are still taking bids past their scheduled close, without a second outcome
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
- Billing address on the quote
  - The quote shows Bill To beside Ship To
  - Both addresses come from the order snapshot
- Missing billing address guard
  - Send refuses an order with no billing address and names the missing fact
  - The operator can add it before sending with the existing reasoned edit
- Phone-record parity
  - Recording an address by phone asks for billing too
  - Same as delivery address is selected by default
- Queue
  - Payment Verifying: a row waiting on proof shows the outcome and needs action
  - Search: by listing code, invoice ID or bank reference, a replaced invoice's included
- Quote and send
  - Payment method on the quote: the winner's choice decides how the fee is priced
  - Bank transfer fee: entered on every bank transfer invoice, zero or more, with no cap
  - Edit before send: an operator changes the address or method in Preparing Invoice, on the winner's request, with a reason; the waiting time does not reset
- Checking proof
  - Confirm: settles the invoice with the winner's files, and the operator's own if added
  - Return to pending: an external and an internal reason, the time left shown, and not offered once expired
- Resolving an unpaid order
  - One Reissue action: address, payment method, bank transfer fee, shipping, insurance and deadline, always with a reason and at least one change
  - Card invoice paid by transfer: reissued as bank transfer, then settled
  - Operator settlement: proof required, and straight to paid
- Audit trail
  - What a reissue changed: the log names each changed part
  - Internal audit number: on the order and in the log, for operators only

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
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a published listing whose recorded close is 60 minutes or
  less away and has not passed
- **WHEN** an operator reads the queue
- **THEN** that listing's outcome is Ending soon

#### Scenario: post-sale-SC-02 - Stripe capture and manual collection are different outcomes
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** one listing whose card capture succeeded and one listing
  whose operator recorded collection, neither shipped
- **WHEN** an operator reads the queue
- **THEN** the first listing's outcome is Paid via Stripe
- **AND** the second listing's outcome is Paid via Manual
- **AND** the two marks do not share the same treatment

#### Scenario: post-sale-SC-03 - An operator works only listings awaiting wire
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** the queue contains Live, Awaiting wire, and Paid via Manual
  listings
- **WHEN** the operator filters the queue to Awaiting wire
- **THEN** Grade10 returns only listings whose outcome is Awaiting wire

#### Scenario: post-sale-SC-04 - Awaiting wire is highlighted as needing action
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

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
**Serves:** post-sale-US-02 - Operator closes out a won listing

- **GIVEN** a listing in Awaiting payment
- **AND** the operator holds payment-processing and shipment-processing
- **WHEN** they record payment collected, then shipment started, then
  shipment completed
- **THEN** the outcome becomes Paid via Manual, then Shipped, then
  Delivered
- **AND** the winner is unchanged

#### Scenario: post-sale-SC-06 - Operator opens a won listing
**Serves:** post-sale-US-02 - Operator closes out a won listing

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
**Serves:** post-sale-US-02 - Operator closes out a won listing

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
**Serves:** post-sale-US-02 - Operator closes out a won listing

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
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** a listing in Awaiting payment whose winner still has an
  open card authorization
- **AND** the operator holds payment-processing
- **WHEN** they record that the winner requested wire transfer
- **THEN** the outcome becomes Awaiting wire
- **AND** Grade10 marks that authorization for release
- **AND** it does not capture the authorization

#### Scenario: post-sale-SC-10 - Stripe capture marks the listing Paid via Stripe
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** a listing in Awaiting payment with an open winner
  authorization
- **WHEN** Grade10 records a verified card-capture success for that
  listing
- **THEN** the outcome becomes Paid via Stripe
- **AND** the trail records the change as originating from Stripe, not
  from an operator

#### Scenario: post-sale-SC-11 - Manual collection marks Paid via Manual and releases the hold
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** a listing in Awaiting payment, Payment failed, or Awaiting
  wire
- **AND** the operator holds payment-processing
- **WHEN** they record payment as collected
- **THEN** the outcome becomes Paid via Manual
- **AND** if a card authorization is still open, Grade10 marks it for
  release and does not capture it

#### Scenario: post-sale-SC-12 - A second paid attempt is refused
**Serves:** post-sale-US-03 - Operator collects payment

- **GIVEN** a listing already Paid via Stripe
- **WHEN** an operator records payment as collected
- **THEN** Grade10 refuses the action
- **AND** the outcome remains Paid via Stripe
- **AND** the winner is unchanged

#### Scenario: post-sale-SC-13 - Staff cannot record payment
**Serves:** post-sale-US-03 - Operator collects payment

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
**Serves:** post-sale-US-04 - Operator records in-house shipment

- **GIVEN** a Paid via Stripe or Paid via Manual listing
- **AND** the operator holds shipment-processing
- **WHEN** they record shipment started, then completed
- **THEN** the outcome becomes Shipped, then Delivered
- **AND** the trail names that operator and each new outcome

#### Scenario: post-sale-SC-15 - Shipment cannot skip ahead
**Serves:** post-sale-US-04 - Operator records in-house shipment

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
**Serves:** post-sale-US-04 - Operator records in-house shipment

- **GIVEN** an operator whose roles are exactly `finance` and a Paid
  via Stripe listing
- **WHEN** they open the listing and submit shipment started
- **THEN** the shipment control is visible and disabled
- **AND** Grade10 refuses the record
- **AND** the outcome remains Paid via Stripe

#### Scenario: post-sale-SC-17 - Publishing a listing does not need the shipment grant
**Serves:** post-sale-US-04 - Operator records in-house shipment

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
**Serves:** post-sale-US-04 - Operator records in-house shipment

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
| Live | Bidding open, until the lot closes | Before a sale | No |
| Unsold | Bidding ended with no winner | Before a sale | No |
| Called off | The lot was withdrawn before a sale | Before a sale | No |
| Awaiting Setup | Derived: no invoice sent, no confirmed address | Order | No |
| Preparing Invoice | Derived: no invoice sent, address confirmed | Order | **Yes** |
| Payment Verifying | Derived: invoice `payment_verifying` | Order | **Yes** |
| Pending Payment | Derived: invoice `pending` or `expired` | Order | **Yes** when the invoice is `expired` |
| Processing | Derived: invoice `paid`, not dispatched | Order | **Yes** |
| Shipped | Derived: dispatched, delivery not confirmed | Order | No |
| Delivered | Derived: delivery confirmed | Order | No |
| Cancelled | Derived: invoice `cancelled` | Order | No |
| Refunded | Derived: invoice `refunded` | Order | No |

The queue SHALL let an operator filter to one outcome. Each outcome SHALL use
a visual mark showing this label rather than an internal code, and two
families SHALL NOT share a mark. A row whose outcome needs action SHALL carry
an additional highlight. A Pending Payment row whose invoice is `expired`
SHALL also show the invoice status Expired beside its outcome. A row in
Awaiting Setup or Preparing Invoice that
has waited 72 hours or more in that stage SHALL also carry the Overdue mark,
per "The order detail shows how long an order has waited".

The queue SHALL let an operator search by listing code, invoice ID or bank
reference, per `grade10-site/auction/winner-order`. A replaced invoice's
invoice ID or bank reference SHALL find its order, which shows its current
invoice.

There is no Ending soon outcome: how long bidding has left is read from the
lot's close. Scenario `grade10-admin-auction-post-sale-SC-19` keeps its title
with its id. The title is historical: a lot inside its last hour is Live.

#### Scenario: grade10-admin-auction-post-sale-SC-19 - A lot inside its last hour is Ending soon
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a published lot whose close is 60 minutes or less away and has not
  passed
- **WHEN** an operator reads the queue
- **THEN** that lot's outcome is Live

#### Scenario: grade10-admin-auction-post-sale-SC-20 - A won lot's outcome is its derived order status
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a closed lot whose auction order derives as Processing
- **WHEN** an operator reads the queue
- **THEN** that lot's outcome is Processing
- **AND** it is the same value the winner reads on their own order

#### Scenario: grade10-admin-auction-post-sale-SC-21 - Expired and Processing are highlighted as needing action
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a queue holding a Pending Payment order whose invoice is `expired`,
  a Pending Payment order whose invoice is `pending`, a Processing order, and
  a Delivered order
- **WHEN** an operator reads it
- **THEN** the expired-invoice row and the Processing row carry the
  needs-action highlight
- **AND** the expired-invoice row reads Pending Payment with the invoice
  status Expired beside it
- **AND** the other two rows carry no highlight

#### Scenario: grade10-admin-auction-post-sale-SC-44 - An order ready for a quote needs action
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a queue holding one order in Preparing Invoice and one in Awaiting
  Address, both confirmed or closed less than 72 hours ago
- **WHEN** an operator reads it
- **THEN** the Preparing Invoice row carries the needs-action highlight
- **AND** the Awaiting Setup row does not

#### Scenario: grade10-admin-auction-post-sale-SC-116 - Proof waiting for a check needs action
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** a queue holding one order whose invoice is `payment_verifying` and one whose invoice is `pending` inside its deadline
- **WHEN** an operator filters to Payment Verifying
- **THEN** only the first row is shown, reading Payment Verifying
- **AND** it carries the needs-action highlight

#### Scenario: grade10-admin-auction-post-sale-SC-131 - A search finds the order by any of its identifiers
**Serves:** post-sale-US-01 - Operator works the listing queue by outcome

- **GIVEN** an order on listing `LK7P2Q` whose first invoice `INV-202609-LK7P2Q-01` was replaced by `INV-202609-LK7P2Q-02`
- **WHEN** an operator searches the queue in turn by `LK7P2Q`, `INV-202609-LK7P2Q-01`, `LK7P2Q01`, `INV-202609-LK7P2Q-02` and `LK7P2Q02`
- **THEN** each search finds that order
- **AND** the order shows `INV-202609-LK7P2Q-02` as its current invoice

### Requirement: Winner contact fields

An order's detail SHALL show the winner with their contact details
emphasised: the name on the account, the registered account email, and any
phone number Grade10 already holds. Grade10 SHALL NOT show a payment-provider
customer or payment identifier as the winner's contact.

#### Scenario: grade10-admin-auction-post-sale-SC-22 - The winner's email is the contact
**Serves:** Queue - the winner's email is the contact

- **GIVEN** an auction order with a winner
- **WHEN** an operator opens it
- **THEN** the winner's name and registered account email are shown as the
  contact
- **AND** no payment-provider identifier is shown in their place

### Requirement: An operator resolves an unpaid order

An operator holding payment-processing SHALL be able to take these actions on
an auction order that is unpaid.

| Action | Effect | Available |
| --- | --- | --- |
| Reissue | Replaces the current invoice with a new `pending` one, per "An operator reissues a sent invoice". The order reads Pending Payment | On an order whose invoice is `pending` or `expired` |
| Confirm or return proof | Settles the invoice or returns it to `pending`, per "An operator checks payment proof" | On an order whose invoice is `payment_verifying` |
| Settle manually | Records a payment with its method and proof, per "Manual settlement records the method and its proof". Invoice status becomes `paid`, so the order derives as Processing | On an order whose bank transfer invoice is `pending` or `expired` |
| Cancel order | Invoice status becomes `cancelled`. The lot returns to available | On an Awaiting Setup or Preparing Invoice order, or one whose invoice is `expired` |

While an invoice is `payment_verifying`, Grade10 SHALL offer only Confirm and
Return, and SHALL refuse Reissue, manual settlement and Cancel.

Grade10 SHALL make manual settlement available before expiry as well as
after, so money that arrived by another route need not wait for the deadline
to elapse.

Reissue, returning proof, manual settlement and cancellation SHALL each record
a named operator and a mandatory reason.

Reissuing an invoice SHALL NOT lift the winner's account suspension, per
`grade10-site/auction/bidder-suspension`. Reinstatement is a separate,
explicit action.

#### Scenario: grade10-admin-auction-post-sale-SC-23 - Reissue returns an expired order to Pending Payment
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order whose invoice is `expired`
- **AND** an operator holding payment-processing
- **WHEN** they reissue the invoice with a reason
- **THEN** the invoice status is `pending` with a new 7-day deadline
- **AND** the derived order status is Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-24 - Reissue leaves the suspension standing
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** a suspended winner whose expired order an operator reissues
- **WHEN** the reissue is committed
- **THEN** the account is still suspended
- **AND** the operator is not offered reinstatement as part of the reissue

#### Scenario: grade10-admin-auction-post-sale-SC-25 - An operator without the grant is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an operator who does not hold payment-processing
- **WHEN** they open an order whose invoice is `expired`
- **THEN** the reissue, settle and cancel controls are visible and disabled
- **AND** Grade10 refuses those actions on the server if they are attempted

#### Scenario: grade10-admin-auction-post-sale-SC-54 - An overdue order waiting on an address can be cancelled
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order in Awaiting Setup carrying the Overdue mark
- **AND** an operator holding payment-processing
- **WHEN** they cancel it with a reason
- **THEN** the order derives as Cancelled and the lot returns to available
- **AND** the winner's account is not suspended

#### Scenario: grade10-admin-auction-post-sale-SC-122 - A pending invoice offers reissue and settlement
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose invoice is `pending`
- **AND** an operator holding payment-processing
- **WHEN** they open it
- **THEN** Reissue and Settle manually are offered
- **AND** Confirm and Return are not

#### Scenario: grade10-admin-auction-post-sale-SC-127 - Only Confirm and Return while proof is checked
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Payment Verifying
- **AND** an operator holding payment-processing
- **WHEN** they open it, and attempt to cancel it
- **THEN** only Confirm and Return are offered
- **AND** Grade10 refuses the cancel and the invoice is still `payment_verifying`

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
**Serves:** Resolving an unpaid order - a third reissue is accepted and numbered

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
**Serves:** Resolving an unpaid order - cancelling returns the lot to available

- **GIVEN** an auction order deriving as Expired
- **WHEN** an operator cancels it with a reason
- **THEN** the invoice status is `cancelled` and the order derives as Cancelled
- **AND** the lot's inventory status is available and it can be listed again

#### Scenario: grade10-admin-auction-post-sale-SC-32 - No runner-up is offered the cancelled lot
**Serves:** Resolving an unpaid order - no runner-up is offered the cancelled lot

- **GIVEN** a cancelled auction order whose lot had a second-highest bidder
- **WHEN** the cancellation completes
- **THEN** Grade10 makes that bidder no offer
- **AND** they acquire no right to the lot

### Requirement: Invoice log history

Every change to an auction order's money SHALL be written as an append-only
invoice log entry, never as a field overwrite. The order's detail SHALL show
these log entries in chronological order. It SHALL also show operators each
invoice's invoice ID, bank reference and internal audit number, and each
receipt's receipt ID and internal audit number, per
`grade10-site/auction/winner-order`.

| Field | Notes |
| --- | --- |
| Log type | Order edited before send, sent, expired, reissued, proof uploaded, proof confirmed, proof returned, paid, manually settled, cancelled, refunded, payment attempt failed |
| Timestamp | Stored in UTC, displayed in the operator's own timezone |
| Invoice ID | The invoice the entry concerns |
| Internal audit number | Sent, reissued, paid and manually settled entries: the number of the invoice or receipt the entry issued |
| Invoice status after the log entry | |
| Order total at the log entry | Captures amount changes across reissues |
| Amount delta | Where the amount changed from the prior log entry |
| Payment deadline at the log entry | The deadline trail across reissues and returned proof |
| Time left | Proof uploaded and proof returned entries |
| Deadline choice | Reissues only: kept or restarted |
| Changed parts | Order edited before send: delivery address, payment method or both, with each value before and after. Reissues: each of delivery address, payment method, bank transfer fee, Shipping & Handling, Insurance and deadline that changed |
| Reissue sequence number | Where the log entry is a reissue |
| Actor | The buyer, the system, or a named operator |
| Payment method | Paid entries: a card with its brand and last four digits, or bank transfer, cash, or other with its description |
| Proof files | Proof uploaded entries: the winner's files. Proof confirmed and manual settlement entries: every file on the payment record |
| External reference | Manual settlements only |
| Reason | Mandatory on an operator-initiated log entry. A proof returned entry carries both the external and the internal reason |
| Payment-provider reference | Where one applies |

Grade10 SHALL record failed payment attempts in the invoice log. A buyer who tried
three times with a declining card is a different case from one who never
engaged, and the difference SHALL be visible to whoever decides on
reinstatement.

#### Scenario: grade10-admin-auction-post-sale-SC-34 - Failed payment attempts appear in the invoice log
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** a winner whose card was declined three times before the deadline
  elapsed
- **WHEN** an operator reads the invoice log
- **THEN** it shows three failed payment attempts with their timestamps
- **AND** the buyer is distinguishable from one whose history holds only the
  issued log entry

#### Scenario: grade10-admin-auction-post-sale-SC-35 - An amendment's amount change is on the record
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an auction order an operator reissued, changing the order total
  from 312000 to 316000 minor units in HKD
- **WHEN** an operator reads the invoice log
- **THEN** it shows the reissued entry at 316000 minor units in HKD
- **AND** the delta from the prior entry and the deadline choice

#### Scenario: grade10-admin-auction-post-sale-SC-61 - A paid entry names how it was paid
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** one order the winner paid by a Visa card ending 4242 and one an
  operator settled by cash
- **WHEN** an operator reads each invoice log
- **THEN** the first paid entry names a Visa card ending 4242
- **AND** the second names cash, with its proof files

#### Scenario: grade10-admin-auction-post-sale-SC-123 - A reissue names what it changed
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order an operator reissued, switching the method from card to bank transfer and changing Shipping & Handling from 8000 to 12000 minor units in HKD
- **WHEN** an operator reads the invoice log
- **THEN** the reissued entry names payment method, bank transfer fee and Shipping & Handling as changed
- **AND** names no other part as changed

#### Scenario: grade10-admin-auction-post-sale-SC-124 - A proof check is on the record
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order whose winner uploaded proof, an operator returned it with an external and an internal reason, and the winner uploaded again, which an operator confirmed
- **WHEN** an operator reads the invoice log
- **THEN** it shows proof uploaded, proof returned with both reasons and the time left, proof uploaded, and proof confirmed, in that order
- **AND** each names its actor and timestamp

#### Scenario: grade10-admin-auction-post-sale-SC-132 - Operators read the internal audit numbers
**Serves:** post-sale-US-08 - Operator reconstructs an order's history

- **GIVEN** an order whose first invoice holds internal audit number `#00010482`, whose reissued invoice holds `#00010490`, and whose receipt holds `#00010495`
- **WHEN** an operator opens the order and reads its invoice log
- **THEN** the order shows all three numbers against their invoice or receipt
- **AND** the sent entry shows `#00010482`, the reissued entry `#00010490` and the paid entry `#00010495`

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
**Serves:** Audit trail - the address at dispatch survives a later edit

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
**Serves:** Queue - the detail explains the status it derived

- **GIVEN** an auction order whose invoice is `pending` and whose deadline
  elapsed two days ago
- **WHEN** an operator opens it
- **THEN** the order status shows as Expired
- **AND** the detail names the rule that produced it — a pending invoice with
  an elapsed deadline — rather than the label alone

#### Scenario: grade10-admin-auction-post-sale-SC-38 - A buyer's reissue history spans all their orders
**Serves:** Queue - a buyer's reissue history spans all their orders

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
**Serves:** Grants - staff cannot record payment

- **GIVEN** an operator holding the staff role
- **WHEN** they open an Expired order
- **THEN** the reissue, settle and cancel controls are visible and disabled
- **AND** Grade10 refuses those actions on the server

#### Scenario: grade10-admin-auction-post-sale-SC-40 - Finance cannot record dispatch
**Serves:** Grants - finance cannot record dispatch

- **GIVEN** an operator holding the finance role
- **WHEN** they open a Processing order
- **THEN** the dispatch control is visible and disabled
- **AND** Grade10 refuses a dispatch from them on the server

#### Scenario: grade10-admin-auction-post-sale-SC-41 - Recording an address does not dispatch the lot
**Serves:** Grants - recording an address does not dispatch the lot

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
**Serves:** Queue - a relisted lot's cancelled order is retained

- **GIVEN** a cancelled auction order whose lot has since been relisted and
  sold again
- **WHEN** an operator opens the cancelled order
- **THEN** its full invoice and fulfilment log is still readable
- **AND** no record has been deleted or edited in place

#### Scenario: grade10-admin-auction-post-sale-SC-43 - An operator event without a reason is refused
**Serves:** Queue - an operator event without a reason is refused

- **GIVEN** an operator holding payment-processing
- **WHEN** they attempt to reissue an invoice without giving a reason
- **THEN** Grade10 refuses the action
- **AND** writes no history log entry

### Requirement: The order detail shows how long an order has waited

An auction order in Awaiting Address or Preparing Invoice SHALL show, on its
detail, how long it has waited in that stage.

| Stage | Waiting since |
| --- | --- |
| Awaiting Address | The lot's close |
| Preparing Invoice | The winner's latest address confirmation |

An order that has waited 72 hours or more in its current stage SHALL carry an
**Overdue** mark on its queue row and its detail. The Overdue mark SHALL be
distinct from the needs-action highlight, and the queue SHALL let an operator
filter to overdue orders.

The Overdue mark SHALL change nothing else. Grade10 SHALL NOT expire, cancel,
or suspend on it; the operator decides whether to contact the winner, prepare
the invoice, or cancel the order.

#### Scenario: grade10-admin-auction-post-sale-SC-45 - An order waiting on an address shows time since close
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order in Awaiting Address whose lot closed 30 hours ago
- **WHEN** an operator opens it
- **THEN** the detail shows that it has waited 30 hours since the lot's close
- **AND** it carries no Overdue mark

#### Scenario: grade10-admin-auction-post-sale-SC-46 - An order idle 72 hours is marked Overdue
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** one auction order in Awaiting Address whose lot closed 72 hours ago
- **AND** one in Preparing Invoice whose winner confirmed an address 80 hours ago
- **WHEN** an operator reads the queue
- **THEN** both rows carry the Overdue mark
- **AND** filtering to overdue orders shows both

#### Scenario: grade10-admin-auction-post-sale-SC-47 - Overdue changes no status
**Serves:** Queue - overdue changes no status

- **GIVEN** an auction order in Awaiting Address carrying the Overdue mark
- **WHEN** another 30 days pass with no operator action
- **THEN** its derived status is still Awaiting Address
- **AND** the winner's account is not suspended

### Requirement: An operator quotes and sends the invoice

An operator holding payment-processing SHALL prepare and send the invoice for
an auction order in Preparing Invoice:

1. Open the order and read the winner's confirmed delivery address, the
   payment method the winner chose, the winning bid, and the buyer's premium.
2. Enter Shipping & Handling for that address, an integer count of minor
   units of zero or more in the lot's currency.
3. Optionally add Insurance for that address, an integer count of minor units
   greater than zero in the lot's currency.
4. For bank transfer, enter the bank transfer fee: an integer count of minor
   units of zero or more in the lot's currency, with no upper limit. A fee of
   zero reads Free to the winner.
5. Read the subtotal, the payment processing fee, and the order total. For
   card, Grade10 computes the fee from the payment provider's current fees;
   for bank transfer, the fee is the amount entered in step 4.
6. Send the invoice.

On send Grade10 SHALL issue the invoice with invoice status `pending`, an
invoice reference, and the payment method, record Sent at, set the payment
deadline to 7 calendar days from Sent at, lock the delivery address and the
payment method, write a sent entry to the invoice log, and send the winner the
invoice-sent letter, per `grade10-site/auction/notifications-order`.

Grade10 SHALL refuse to send an invoice when the winner has confirmed no
delivery address, when Shipping & Handling is missing, when Insurance is
added at zero, when a bank transfer invoice's fee is blank or is not an
integer of zero or more, or when a card invoice's payment provider fees cannot
be read. The refusal for unreadable fees SHALL say so, and SHALL name no stored
fee in its place. A bank transfer invoice SHALL NOT need the provider's fees.
An operator without payment-processing SHALL see the send control visible and
disabled, and Grade10 SHALL refuse the same action on the server.

#### Scenario: grade10-admin-auction-post-sale-SC-48 - Sending the invoice opens the payment window
**Serves:** Quote and send - sending issues the invoice and starts the deadline

- **GIVEN** an auction order in Preparing Invoice for bank transfer with a
  winning bid of 250000 and a buyer's premium of 50000 minor units in HKD
- **AND** an operator holding payment-processing
- **WHEN** they enter Shipping & Handling of 8000, Insurance of 4000 and a bank
  transfer fee of 0 minor units in HKD and send the invoice at
  2026-09-12T09:00:00Z
- **THEN** the invoice is `pending` with an order total of 312000 minor units
  in HKD and a payment deadline of 2026-09-19T09:00:00Z
- **AND** the delivery address and payment method are locked
- **AND** the order derives as Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-49 - No invoice is sent without a confirmed address
**Serves:** Quote and send - no invoice without a confirmed address

- **GIVEN** an auction order in Awaiting Setup
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses it
- **AND** the order is still Awaiting Setup

#### Scenario: grade10-admin-auction-post-sale-SC-50 - Staff cannot send an invoice
**Serves:** Quote and send - the send needs payment-processing

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they open an auction order in Preparing Invoice
- **THEN** the send control is visible and disabled
- **AND** Grade10 refuses a send from them on the server

#### Scenario: grade10-admin-auction-post-sale-SC-69 - The operator sees the fee before sending
**Serves:** Quote and send - the card fee read before send

- **GIVEN** an auction order in Preparing Invoice for card whose lines total a
  subtotal of 312000 minor units in HKD
- **AND** the payment provider reports fees for HKD of 235 minor units and 3.4 per cent
- **WHEN** an operator holding payment-processing opens the send step
- **THEN** they read a payment processing fee of 11225 and an order total of
  323225 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-70 - Unreadable provider fees refuse the send
**Serves:** Quote and send - a card invoice needs the provider's fees

- **GIVEN** an auction order in Preparing Invoice for card
- **AND** the payment provider's current fees cannot be read
- **WHEN** an operator attempts to send its invoice
- **THEN** Grade10 refuses the send and says the fees could not be read
- **AND** no invoice is issued

#### Scenario: grade10-admin-auction-post-sale-SC-63 - An invoice sends without insurance
**Serves:** Quote and send - insurance is optional

- **GIVEN** an auction order in Preparing Invoice for bank transfer with a
  winning bid of 250000 and a buyer's premium of 50000 minor units in HKD
- **WHEN** an operator enters Shipping & Handling of 0 and a bank transfer fee
  of 0, adds no Insurance, and sends
- **THEN** the invoice is `pending` with an order total of 300000 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-68 - Insurance added at zero is refused
**Serves:** Quote and send - insurance is never zero once added

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator adds Insurance of 0 minor units and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

#### Scenario: grade10-admin-auction-post-sale-SC-117 - The quote shows the winner's method
**Serves:** Quote and send - the winner's choice decides how the fee is priced

- **GIVEN** an auction order in Preparing Invoice whose winner chose bank transfer
- **WHEN** an operator holding payment-processing opens the quote
- **THEN** the quote names bank transfer
- **AND** asks for a bank transfer fee instead of showing a provider-priced fee

#### Scenario: grade10-admin-auction-post-sale-SC-118 - A blank bank transfer fee refuses the send
**Serves:** Quote and send - the bank transfer fee is required

- **GIVEN** an auction order in Preparing Invoice for bank transfer
- **WHEN** an operator leaves the bank transfer fee blank, or enters -100 minor units, and sends
- **THEN** Grade10 refuses the send
- **AND** no invoice is issued

#### Scenario: grade10-admin-auction-post-sale-SC-119 - A bank transfer fee has no cap and needs no provider fees
**Serves:** Quote and send - zero or more, with no cap

- **GIVEN** an auction order in Preparing Invoice for bank transfer with a subtotal of 312000 minor units in HKD
- **AND** the payment provider's current fees cannot be read
- **WHEN** an operator enters a bank transfer fee of 500000 minor units in HKD and sends
- **THEN** the invoice is `pending` with an order total of 812000 minor units in HKD

### Requirement: Manual settlement records the method and its proof

Manual settlement is the operator's backup for money the winner did not pay by
card or by bank transfer with proof an operator confirmed. An operator holding
payment-processing SHALL record it on an order whose bank transfer invoice is
`pending` or `expired`:

1. Open the order and read the current invoice's order total, which is the
   amount to settle, its payment method, and the locked delivery address.
2. Choose the method: bank transfer, cash, or other. Card SHALL NOT be
   offered.
3. For other, describe the method, in 1 to 200 characters.
4. Enter the external reference. It is required for a bank transfer and
   optional for cash and other.
5. Attach proof: 1 to 5 files, each a PDF, JPEG, or PNG of at most 10 MB
   (10,485,760 bytes). One file that breaks this refuses the commit, and no
   file is stored.
6. Commit.

On commit the invoice status SHALL become `paid` at the current invoice's full
order total, directly and without passing through `payment_verifying`. The
invoice SHALL keep its payment processing fee line unchanged, and Grade10
SHALL write a payment record carrying the method, any description, the
external reference, and the proof files. An amount different from the current
invoice SHALL be reached through a reissue first, never at settlement.

Manual settlement SHALL NOT be offered, and SHALL be refused, on a card
invoice, whatever the method; the operator reissues it as bank transfer
first. It SHALL NOT be offered on a `payment_verifying` invoice; the operator
confirms or returns the proof instead.

Proof files SHALL be readable by any operator who can open the order, SHALL be
retained for the life of the account, and SHALL NOT be deleted or replaced.
They SHALL NOT be shown to the winner. Grade10 SHALL log the operator, the
timestamp, the amount, the method, the external reference, and the proof
files.

#### Scenario: grade10-admin-auction-post-sale-SC-55 - A bank transfer with a slip settles the order
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice totals
  312000 minor units in HKD, with a bank transfer fee of 0
- **AND** an operator holding payment-processing
- **WHEN** they record a bank transfer with an external reference and one PDF
  transfer slip, and commit
- **THEN** the invoice is `paid` at 312000 minor units in HKD
- **AND** the payment record carries bank transfer, the reference, and the slip
- **AND** the order derives as Processing

Scenario `grade10-admin-auction-post-sale-SC-67` keeps its title with its id.
The title is historical: manual settlement keeps the payment processing fee.

#### Scenario: grade10-admin-auction-post-sale-SC-67 - Manual settlement drops the processing fee
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice has a
  subtotal of 312000 and a payment processing fee of 5000 minor units in HKD
- **WHEN** an operator settles it by bank transfer with a reference and a proof file
- **THEN** the invoice is `paid` at 317000 minor units in HKD
- **AND** the invoice still carries the payment processing fee of 5000 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-56 - Settlement without proof is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator records a cash payment with no proof file and commits
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

#### Scenario: grade10-admin-auction-post-sale-SC-57 - Another method needs a description
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator chooses other, attaches proof, leaves the description
  empty, and commits
- **THEN** Grade10 refuses it
- **AND** the invoice is still `pending`

#### Scenario: grade10-admin-auction-post-sale-SC-58 - No settlement before an invoice is sent
**Serves:** post-sale-US-07 - settlement waits for the invoice the quote sends

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator attempts to record a manual settlement
- **THEN** Grade10 refuses it
- **AND** the order is still Preparing Invoice

#### Scenario: grade10-admin-auction-post-sale-SC-59 - A settled order refuses a second settlement
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an auction order whose invoice status is `paid`
- **WHEN** an operator attempts to record a second settlement against it
- **THEN** Grade10 refuses it
- **AND** the existing payment record is unchanged

#### Scenario: grade10-admin-auction-post-sale-SC-60 - Manual settlement is available before expiry
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer, three
  days from its deadline, and whose winner has arranged payment by bank transfer
- **AND** an operator holding payment-processing
- **WHEN** they record the settlement with its reference and proof
- **THEN** Grade10 accepts it
- **AND** the order derives as Processing without having expired first
- **AND** the order never read Payment Verifying

#### Scenario: grade10-admin-auction-post-sale-SC-62 - A proof file of the wrong kind is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **WHEN** an operator attaches a valid PDF with a 12 MB JPEG, or with a file
  that is not a PDF, JPEG, or PNG, and commits
- **THEN** Grade10 refuses the commit and stores no file
- **AND** the invoice is still `pending`

#### Scenario: grade10-admin-auction-post-sale-SC-120 - No manual settlement while proof is checked
**Serves:** Resolving an unpaid order - operator settlement

- **GIVEN** an order in Payment Verifying
- **WHEN** an operator attempts to record a manual settlement
- **THEN** Grade10 refuses it
- **AND** the invoice is still `payment_verifying`

#### Scenario: grade10-admin-auction-post-sale-SC-121 - A card invoice cannot be settled manually
**Serves:** Resolving an unpaid order - card invoice paid by transfer

- **GIVEN** an order in Pending Payment whose invoice was sent for card
- **WHEN** an operator opens the order
- **THEN** manual settlement is not offered
- **AND** Grade10 refuses a bank transfer, cash or other settlement attempted on that invoice

#### Scenario: grade10-admin-auction-post-sale-SC-130 - A settlement at another amount is refused
**Serves:** Resolving an unpaid order - operator settlement

- **GIVEN** an order in Pending Payment whose bank transfer invoice has an order total of 312000 minor units in HKD
- **WHEN** an operator attempts to record a settlement of 311999 or 312001 minor units in HKD with proof
- **THEN** Grade10 refuses each
- **AND** the invoice is still `pending`

### Requirement: A queue row shows when its lot is in extended bidding

While a lot is in extended bidding, as `grade10-site/auction/auction` defines
it, its queue row SHALL carry the label **Extended bidding: ON** beside its
outcome. A lot not in extended bidding SHALL carry no such label.

The label SHALL NOT be an outcome. It SHALL NOT change the lot's outcome,
SHALL NOT be offered as an outcome filter, and SHALL NOT mark the row as
needing action.

#### Scenario: grade10-admin-auction-post-sale-SC-64 - A lot in extended bidding carries the label
**Serves:** post-sale-US-06 - Operator sees which lots are still in extended bidding

- **GIVEN** a lot past its scheduled close and in extended bidding
- **WHEN** an operator reads the queue
- **THEN** its row carries the label Extended bidding: ON beside its outcome
- **AND** its outcome is the one it carries without the label

#### Scenario: grade10-admin-auction-post-sale-SC-65 - A lot not in extended bidding carries no label
**Serves:** post-sale-US-06 - Operator sees which lots are still in extended bidding

- **GIVEN** one lot whose scheduled close has not arrived, and one that closed
  after its extended bidding ended
- **WHEN** an operator reads the queue
- **THEN** neither row carries the label Extended bidding: ON

#### Scenario: grade10-admin-auction-post-sale-SC-66 - Extended bidding is not an outcome filter
**Serves:** post-sale-US-06 - Operator sees which lots are still in extended bidding

- **GIVEN** a queue holding a lot in extended bidding
- **WHEN** an operator opens the outcome filter
- **THEN** no outcome named Extended bidding is offered
- **AND** that lot's row carries no needs-action highlight because of the label

### Requirement: An invoice cannot be sent without a billing address

The post-sale quote and send flow keep billing and delivery addresses
separate.

**Quote** — The quote SHALL show Bill To beside Ship To from the order
snapshot.

**Send guard** — Sending SHALL be refused when the order has no billing
address, and the refusal SHALL name the missing billing address. An operator
with payment-processing SHALL be able to add the billing address with the
existing reasoned edit before sending.

**Phone record** — Recording an address by phone SHALL ask for billing too,
with Same as delivery address selected by default.

#### Scenario: post-sale-SC-153 - Send names a missing billing address
**Serves:** post-sale-US-11 - Operator adds a missing billing address before sending

- **GIVEN** an order with a delivery address and no billing address
- **WHEN** an operator tries to send its invoice
- **THEN** sending is refused
- **AND** the refusal names the missing billing address
- **AND** no invoice is sent

#### Scenario: post-sale-SC-154 - The operator adds billing before send
**Serves:** post-sale-US-11 - Operator adds a missing billing address before sending

- **GIVEN** an order with a delivery address and no billing address
- **WHEN** an operator adds billing with a reason and records the order by phone
- **THEN** the phone record asks for billing with Same as delivery address selected
- **AND** the quote shows Bill To and Ship To
- **AND** the operator can send the invoice after the billing address is recorded

### Requirement: An operator checks payment proof

An operator reads the winner's proof, then confirms the payment or returns
the invoice to the winner.

**Steps** - An operator holding payment-processing SHALL check the proof on
an order whose invoice is `payment_verifying`:

1. Open the order and read the winner's uploaded files, the invoice ID and
   bank reference, the payment method, and the order total.
2. Choose Confirm or Return.
3. For Confirm, optionally attach 0 to 5 files of their own, each a PDF,
   JPEG or PNG of at most 10 MB (10,485,760 bytes). Commit.
4. For Return, enter an external reason, which the winner reads, and an
   internal reason, which only operators read. Both are required. Read a
   confirmation prompt showing the time left, then commit.

| Outcome | Invoice status | Payment deadline | Record |
| --- | --- | --- | --- |
| Confirm | `paid`, at the current invoice's order total | No longer applies | A payment record: method bank transfer, the winner's files as proof, and any operator files |
| Return | `pending` | The moment of return plus the time left at upload | The external and internal reasons, in the invoice log |

**Letters** - On Confirm Grade10 SHALL send the payment-received letter; on
Return it SHALL send the proof-not-accepted letter with the external reason,
per `grade10-site/auction/notifications-order`.

**Order total** - Neither outcome SHALL change the order total.

**Operator files** - Grade10 SHALL refuse a Confirm, and store no file, when
any operator file breaks step 3.

**When offered** - Confirm and Return SHALL be offered only on a
`payment_verifying` invoice, and while it is `payment_verifying` they are the
only actions offered.

**Not offered once expired** - Return SHALL NOT be offered on an `expired`
invoice. That is a guard: the deadline is stopped while proof is checked, so a
checked invoice never expires.

**Without payment-processing** - An operator without payment-processing SHALL
see both controls visible and disabled, and Grade10 SHALL refuse both on the
server.

**Who reads the files** - The winner's files SHALL be readable by any operator
who can open the order, and never by the winner, per "Manual settlement
records the method and its proof".

#### Scenario: grade10-admin-auction-post-sale-SC-100 - Confirming proof settles the order
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an order in Payment Verifying whose bank transfer invoice has a subtotal of 312000, a fee of 5000 and an order total of 317000 minor units in HKD, with two files the winner uploaded
- **AND** an operator holding payment-processing
- **WHEN** they confirm the proof
- **THEN** the invoice is `paid` at 317000 minor units in HKD
- **AND** the payment record names bank transfer and carries the winner's two files as proof
- **AND** the order derives as Processing

#### Scenario: grade10-admin-auction-post-sale-SC-101 - The operator may add their own proof on confirm
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an order in Payment Verifying with one file the winner uploaded
- **WHEN** an operator attaches one PDF bank statement and confirms
- **THEN** the payment record carries both files as proof
- **AND** the operator's file is not shown to the winner

#### Scenario: grade10-admin-auction-post-sale-SC-102 - Returning proof restores the time that was left
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an order whose invoice had a deadline of 2026-09-19T09:00:00Z and became `payment_verifying` at 2026-09-13T09:00:00Z
- **WHEN** an operator chooses Return at 2026-09-16T09:00:00Z
- **THEN** the confirmation prompt shows 6 days left
- **AND** after commit with both reasons the invoice is `pending` with a deadline of 2026-09-22T09:00:00Z
- **AND** the order derives as Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-103 - A return needs both reasons
**Serves:** Checking proof - an external and an internal reason

- **GIVEN** an order in Payment Verifying
- **WHEN** an operator commits a Return with the external reason empty, or with the internal reason empty
- **THEN** Grade10 refuses it
- **AND** the invoice is still `payment_verifying`

#### Scenario: grade10-admin-auction-post-sale-SC-104 - Only the external reason reaches the winner
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an operator returned proof with the external reason "Amount does not match" and the internal reason "Statement shows 300000"
- **WHEN** the winner opens the order and reads the proof-not-accepted letter
- **THEN** both show "Amount does not match"
- **AND** neither shows "Statement shows 300000"
- **AND** the invoice log shows both reasons

#### Scenario: grade10-admin-auction-post-sale-SC-105 - Confirm and Return are offered only while proof is checked
**Serves:** Checking proof - not offered once expired

- **GIVEN** one order whose invoice is `expired` and one whose invoice is `pending`
- **WHEN** an operator opens each
- **THEN** neither offers Confirm or Return
- **AND** Grade10 refuses a Return attempted on the expired invoice

#### Scenario: grade10-admin-auction-post-sale-SC-106 - Staff cannot check proof
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they open an order in Payment Verifying
- **THEN** Confirm and Return are visible and disabled
- **AND** Grade10 refuses both from them on the server
- **AND** they can read the files the winner uploaded

#### Scenario: grade10-admin-auction-post-sale-SC-128 - A wrong operator file refuses the confirm
**Serves:** Checking proof - the operator's own files if added

- **GIVEN** an order in Payment Verifying
- **WHEN** an operator attaches a PDF and a JPEG of 10,485,761 bytes, or six PDFs, and confirms
- **THEN** Grade10 refuses the confirm and stores no operator file
- **AND** the invoice is still `payment_verifying`

#### Scenario: grade10-admin-auction-post-sale-SC-129 - A return after a confirm is refused
**Serves:** post-sale-US-10 - Operator checks a winner's payment proof

- **GIVEN** an order in Payment Verifying open for two operators holding payment-processing
- **WHEN** the first confirms the proof and the second then commits a Return
- **THEN** Grade10 refuses the Return
- **AND** the invoice is still `paid` and no proof-not-accepted letter is sent

### Requirement: An operator reissues a sent invoice

An operator changes a sent invoice by replacing it with a new one, with a
reason and at least one change.

**One Reissue action** - Reissue is the one way to change an invoice after it
is sent.

**Steps** - An operator holding payment-processing SHALL reissue an order
whose invoice is `pending` or `expired`:

1. Choose Reissue on the order.
2. Change what the winner asked for or the operator decided: delivery address,
   payment method, bank transfer fee, Shipping & Handling, Insurance. Each
   starts from the current invoice.
3. For bank transfer, read the bank transfer fee: prefilled from the current
   invoice when it was bank transfer, empty after a switch from card. It
   follows the quote's rules. For card, Grade10 prices the fee at send from the
   payment provider's current fees.
4. Choose the deadline: keep the current one, or a fresh 7 days from the
   moment the new invoice is sent. On an `expired` invoice only a fresh 7 days
   is offered.
5. Read the previous and the new order total.
6. Give a reason. The reason is mandatory.
7. Send the new invoice.

**At least one change** - Grade10 SHALL refuse a reissue that changes none of
the delivery address, payment method, bank transfer fee, Shipping & Handling,
Insurance or deadline. A new reason alone is not a change; a fresh 7 days is.

**On send** - On send Grade10 SHALL replace the current invoice with a new one
carrying a new invoice ID, bank reference and internal audit number, per
`grade10-site/auction/winner-order`, issue it as `pending` with the chosen
deadline, lock the address and method it carries, write a reissued entry to
the invoice log naming each part that changed, and send the winner the
invoice-reissued letter.

**Replaced invoice** - The replaced invoice SHALL hold no status of its own and
SHALL NOT be written `cancelled`.

**Payment method** - Only an operator SHALL change an invoice's payment method
after send.

**Not while checked or paid** - Reissue SHALL NOT be offered, and SHALL be
refused, on an invoice that is `payment_verifying` or `paid`.

**Same refusals as a first send** - Grade10 SHALL refuse a reissue under the
same conditions it refuses a first send.

**Card invoice paid by transfer** - A card invoice whose money arrived any
other way — bank transfer, cash or another method — SHALL be reissued as bank
transfer first, then settled manually at the new invoice's order total. Where
the money arrived at the subtotal, the operator enters a bank transfer fee of
0.

#### Scenario: grade10-admin-auction-post-sale-SC-107 - A reissue keeps the deadline when the operator says so
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice totals 312000 minor units in HKD, with a bank transfer fee of 0 and a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it to a new address with Shipping & Handling 12000 and Insurance 4000 minor units in HKD, keeps the deadline, and sends with a reason
- **THEN** the new invoice's order total is 316000 minor units in HKD
- **AND** the payment deadline is still 2026-09-19T09:00:00Z
- **AND** the operator saw 312000 and 316000 minor units in HKD before sending

#### Scenario: grade10-admin-auction-post-sale-SC-108 - A reissue restarts the deadline when the operator says so
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment with a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it, chooses a fresh 7 days, and sends at 2026-09-15T10:00:00Z with a reason
- **THEN** the payment deadline is 2026-09-22T10:00:00Z

#### Scenario: grade10-admin-auction-post-sale-SC-109 - A reissue without a reason is refused
**Serves:** Resolving an unpaid order - always with a reason

- **GIVEN** an order in Pending Payment
- **WHEN** an operator attempts to send a reissue without a reason
- **THEN** Grade10 refuses it
- **AND** the current invoice, its amount, and its deadline are unchanged

#### Scenario: grade10-admin-auction-post-sale-SC-110 - A switch from card leaves the bank transfer fee empty
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose card invoice has a subtotal of 312000 and a fee of 11225 minor units in HKD
- **WHEN** an operator reissues it and switches the method to bank transfer
- **THEN** the bank transfer fee is empty
- **AND** Grade10 refuses to send until a fee is entered
- **AND** with a fee of 3000 entered, the new invoice is bank transfer at 315000 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-111 - The bank transfer fee starts from the current invoice
**Serves:** Resolving an unpaid order - the bank transfer fee starts from the previous invoice

- **GIVEN** an order whose bank transfer invoice carries a bank transfer fee of 5000 minor units in HKD
- **WHEN** an operator opens Reissue on it
- **THEN** the bank transfer fee reads 5000 minor units in HKD

#### Scenario: grade10-admin-auction-post-sale-SC-112 - An expired invoice is reissued with a fresh deadline
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose invoice is `expired`
- **WHEN** an operator opens Reissue, then sends it at 2026-09-25T09:00:00Z with a reason
- **THEN** keeping the current deadline is not offered
- **AND** the new invoice is `pending` with a deadline of 2026-10-02T09:00:00Z
- **AND** the order derives as Pending Payment

#### Scenario: grade10-admin-auction-post-sale-SC-113 - No reissue while proof is checked or after payment
**Serves:** Resolving an unpaid order - reissue only on a pending or expired invoice

- **GIVEN** one order whose invoice is `payment_verifying` and one whose invoice is `paid`
- **WHEN** an operator opens each
- **THEN** neither offers Reissue
- **AND** Grade10 refuses a reissue attempted on either

#### Scenario: grade10-admin-auction-post-sale-SC-114 - A card invoice paid by transfer is reissued, then settled
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order whose card invoice has a subtotal of 312000 and a fee of 11225 minor units in HKD, and whose winner transferred 312000 minor units in HKD
- **WHEN** an operator reissues it as bank transfer with a bank transfer fee of 0 and a reason, then settles it manually by bank transfer with a reference and proof
- **THEN** the invoice is `paid` at 312000 minor units in HKD
- **AND** the replaced card invoice holds no status and is not `cancelled`

#### Scenario: grade10-admin-auction-post-sale-SC-115 - A replaced invoice is not cancelled
**Serves:** Resolving an unpaid order - one Reissue action

- **GIVEN** an order in Pending Payment
- **WHEN** an operator reissues its invoice with a reason
- **THEN** the order's invoice status is the new invoice's, `pending`
- **AND** the order does not derive as Cancelled and the lot is not returned to available

#### Scenario: grade10-admin-auction-post-sale-SC-125 - A switch to card prices the fee at send
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose bank transfer invoice has a subtotal of 312000 and a bank transfer fee of 0 minor units in HKD
- **AND** the payment provider reports fees for HKD of 235 minor units and 3.4 per cent
- **WHEN** an operator reissues it as card with a reason and sends
- **THEN** the new invoice is card with a payment processing fee of 11225 and an order total of 323225 minor units in HKD
- **AND** the operator entered no fee

#### Scenario: grade10-admin-auction-post-sale-SC-126 - Unreadable provider fees refuse a card reissue
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice is bank transfer
- **AND** the payment provider's current fees cannot be read
- **WHEN** an operator reissues it as card with a reason and sends
- **THEN** Grade10 refuses the reissue and says the fees could not be read
- **AND** the current invoice is unchanged

#### Scenario: grade10-admin-auction-post-sale-SC-133 - A reissue that changes only the reason is refused
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice `INV-202609-LK7P2Q-01` has a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator opens Reissue, keeps the deadline, changes nothing else, and sends with a reason
- **THEN** Grade10 refuses it as changing nothing
- **AND** the current invoice is still `INV-202609-LK7P2Q-01`, at the same amount and deadline

#### Scenario: grade10-admin-auction-post-sale-SC-134 - A fresh deadline alone is a change
**Serves:** post-sale-US-07 - Operator resolves an unpaid order

- **GIVEN** an order in Pending Payment whose invoice has a payment deadline of 2026-09-19T09:00:00Z
- **WHEN** an operator reissues it changing only the deadline to a fresh 7 days, and sends at 2026-09-15T10:00:00Z with a reason
- **THEN** the new invoice is `pending` with a payment deadline of 2026-09-22T10:00:00Z
- **AND** the reissued entry names the deadline as the only changed part

### Requirement: An operator edits the address or method before send

Before the invoice is sent, an operator changes the delivery address or the
payment method for the winner, with a reason.

**Edit before send** - Once the winner confirms, only an operator changes the
order's delivery address or payment method before the invoice is sent, per
`grade10-site/auction/winner-order`. An operator holding payment-processing
SHALL be able to do so on an auction order in Preparing Invoice, on the
winner's request:

1. Open the order and read the address and method the winner confirmed.
2. Enter a new delivery address, choose the other payment method, or both.
3. Enter a reason. It is required.
4. Commit.

| Rule | Value |
| --- | --- |
| Order status after the edit | Preparing Invoice |
| Changes allowed | Delivery address, payment method, or both. At least one SHALL differ from what the order holds |
| Bank transfer | Refused on an order whose currency has no bank details set up. Card only for USD and JPY |
| Invoice log entry | Order edited before send: the named operator, the reason, each part that changed, and its value before and after |
| Preparing Invoice waiting time | Unchanged. It counts from the winner's confirmation, per "The order detail shows how long an order has waited" |

**After the edit** - The order SHALL hold the new address as its snapshot and
the new method, and Winner Order SHALL show them.

**Refused** - Grade10 SHALL refuse an edit with no reason, and an edit that
changes nothing.

**After send** - The edit SHALL NOT be offered once the invoice is sent; a
change after send is a reissue, per "An operator reissues a sent invoice".

**Without payment-processing** - An operator without payment-processing SHALL
see the edit control visible and disabled, and Grade10 SHALL refuse the same
action on the server.

#### Scenario: grade10-admin-auction-post-sale-SC-135 - An edit before send is recorded with its reason
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in HKD in Preparing Invoice whose winner confirmed the home address and card
- **AND** an operator holding payment-processing
- **WHEN** they change the address to the work address and the method to bank transfer, with the reason "Winner asked by email"
- **THEN** the order holds the work address and bank transfer
- **AND** the order is still Preparing Invoice
- **AND** the invoice log shows an order edited before send entry naming the operator, the reason, and the address and method before and after

#### Scenario: grade10-admin-auction-post-sale-SC-136 - An edit without a reason is refused
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in Preparing Invoice
- **WHEN** an operator holding payment-processing commits a new address with the reason empty
- **THEN** Grade10 refuses it
- **AND** the order keeps the address the winner confirmed

#### Scenario: grade10-admin-auction-post-sale-SC-137 - Staff cannot edit before send
**Serves:** Quote and send - edit before send

- **GIVEN** an operator whose roles are exactly `staff`
- **WHEN** they open an auction order in Preparing Invoice
- **THEN** the edit control is visible and disabled
- **AND** Grade10 refuses an edit from them on the server

#### Scenario: grade10-admin-auction-post-sale-SC-138 - A USD order cannot be edited to bank transfer
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order in USD in Preparing Invoice whose winner confirmed card
- **WHEN** an operator holding payment-processing changes the method to bank transfer with a reason
- **THEN** Grade10 refuses it
- **AND** the order still holds card

#### Scenario: grade10-admin-auction-post-sale-SC-139 - An edit does not reset the waiting time
**Serves:** Quote and send - edit before send

- **GIVEN** an auction order whose winner confirmed an address at 2026-09-12T09:00:00Z
- **WHEN** an operator edits its address with a reason at 2026-09-14T09:00:00Z
- **AND** an operator opens the order at 2026-09-15T09:00:00Z
- **THEN** the detail shows it has waited 72 hours since the winner's confirmation
- **AND** it carries the Overdue mark
