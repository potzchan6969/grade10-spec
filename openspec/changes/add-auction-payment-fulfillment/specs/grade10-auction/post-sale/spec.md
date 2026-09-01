## Purpose

Lets Grade10 operators close out each won Auction listing: collect payment,
record in-house shipment, and keep a trail. Payment and shipment are
separate jobs.

## Feature set

- Listing queue
  - Outcome per row: each listing shows one operator-facing label
  - Outcome filter: work one outcome at a time, such as Awaiting wire
  - Needs action: highlight rows waiting on an operator, not on the clock
- Listing detail
  - Existing listing facts sit next to outcome, winner, payment, shipment, and trail
  - Trail: status changes and comments share one history
- Payment collection
  - Winner contact: operators may email the winner to collect payment or arrange a wire
  - Card capture: verified capture becomes Paid via Stripe
  - Manual collection: a payment operator records Paid via Manual, including a completed wire
  - Awaiting wire: a payment operator parks the listing so they can contact the winner
- In-house shipment
  - Shipment started: a shipment operator records that the unit left Grade10
  - Shipment completed: a shipment operator records that the winner has the unit
  - Delivery address: a shipment operator can record an address obtained offline

## User journeys

### post-sale-US-01: Operator works the listing queue by outcome

**As an** auction operator,
**I want** each listing labelled with one outcome I can filter, with rows that need me highlighted,
**so that** I work awaiting wire without mixing it with a Stripe capture.

**Accepted by:**

- `post-sale-SC-01` — A listing inside the last hour is Ending soon
- `post-sale-SC-02` — Stripe capture and manual collection are different outcomes
- `post-sale-SC-03` — An operator works only listings awaiting wire
- `post-sale-SC-04` — Awaiting wire is highlighted as needing action

### post-sale-US-02: Operator closes out a won listing

**As an** auction operator,
**I want** the listing's winner, payment, shipment, and trail on one detail,
**so that** I can contact the winner without Stripe identifiers and leave a comment next to a capture.

**Accepted by:**

- `post-sale-SC-05` — Operator closes out a won listing
- `post-sale-SC-06` — Operator opens a won listing
- `post-sale-SC-07` — Stripe paid and an operator comment share the trail
- `post-sale-SC-08` — Winner email is the contact without Stripe identifiers

### post-sale-US-03: Operator collects payment

**As a** payment operator,
**I want** a wire to release the card hold, a capture to mark Paid via Stripe, and a manual record to mark Paid via Manual,
**so that** a second paid attempt is refused and staff without the grant cannot collect.

**Accepted by:**

- `post-sale-SC-09` — Wire request releases the card hold
- `post-sale-SC-10` — Stripe capture marks the listing Paid via Stripe
- `post-sale-SC-11` — Manual collection marks Paid via Manual and releases the hold
- `post-sale-SC-12` — A second paid attempt is refused
- `post-sale-SC-13` — Staff cannot record payment

### post-sale-US-04: Operator records in-house shipment

**As a** shipment operator,
**I want** shipment to follow paid, then started, then completed,
**so that** finance cannot ship, publishing does not need the shipment grant, and recording an address does not ship.

**Accepted by:**

- `post-sale-SC-14` — Shipment follows paid, then started, then completed
- `post-sale-SC-15` — Shipment cannot skip ahead
- `post-sale-SC-16` — Finance cannot record shipment
- `post-sale-SC-17` — Publishing a listing does not need the shipment grant
- `post-sale-SC-18` — Recording an address does not ship the listing

## ADDED Requirements

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
