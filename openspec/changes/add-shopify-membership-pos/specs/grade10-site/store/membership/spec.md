# Membership — delta

## Purpose

Connects a Grade10 member to the commerce provider and to the physical
store: the guaranteed commerce customer behind every member, in-store
identification and the staff till session, points becoming discount codes
either channel accepts, and physical-store orders earning through
attribution.

## Feature set

- Commerce pairing
  - One customer: enrolment never waits on the provider; a conflict parks visibly
  - Opaque key: the platform account identifier never leaves Grade10
  - Erasure: deleting a member deletes the customer irreversibly
- Till identification
  - Dynamic code or email: a replay is refused; a miss discloses nothing
- Spending
  - Staff session: a double tap spends once; points become a single-use money-off code
- Attribution
  - One recording: webhook and sweep converge; a wrong claim is one action to undo
- Degradation
  - Sale always possible: the kill switch stops spending, not selling

## ADDED Requirements

### Requirement: Every member has exactly one commerce customer

Enrolment SHALL record, in the same server-side flow that creates the
member, the intent to pair them with exactly one commerce customer — and
SHALL never wait on the commerce provider to complete sign-up. Pairing SHALL converge
on its own: every member either reaches a paired customer or parks in a
visible conflict an operator can act on; it SHALL never give up silently.
A retried creation SHALL land on the same customer, never a duplicate. A
re-runnable check SHALL be able to report every member's pairing state,
so members from before this capability shipped can be verified paired.

#### Scenario: grade10-site-store-membership-SC-01 - Sign-up never waits on the provider

- **WHEN** a collector registers while the commerce provider is unreachable
- **THEN** their account is created and usable at once
- **AND** the pairing completes on its own once the provider answers

#### Scenario: grade10-site-store-membership-SC-02 - A lost response does not duplicate a customer

- **WHEN** pairing retries after a creation whose response was lost
- **THEN** the retry lands on the customer the first attempt created

#### Scenario: grade10-site-store-membership-SC-03 - A conflict parks visibly

- **WHEN** pairing cannot complete because the member's email already
  belongs to a customer of another member
- **THEN** the member parks in a conflict an operator can see and re-run
- **AND** the depth and age of unpaired members is observable

### Requirement: The commerce customer carries an opaque key and adopts only verified identity

The customer record at the provider SHALL carry an opaque membership key that
is meaningless outside the platform — never the platform's account
identifier, which would outlive deletion in a vendor system. The platform
SHALL remain the sole authority for the mapping.

A customer record that already existed SHALL be adopted into an account
that already existed only when the two are joined by an identifier the
platform itself verified; an identifier merely typed by a buyer or by
staff SHALL never attach one party's history to the other.

An account created from a purchase SHALL pair with the customer record
that purchase made. Nothing is being adopted there — the account and the
customer are the same event, so there is no prior history to mis-attach.

#### Scenario: grade10-site-store-membership-SC-04 - The account identifier never leaves Grade10

- **WHEN** a member's customer record is created or updated at the provider
- **THEN** it carries the opaque membership key and no platform account
  identifier

#### Scenario: grade10-site-store-membership-SC-05 - An unverified email attaches nothing to a member who already existed

- **WHEN** a guest checkout used an email address matching a member who
  never verified it
- **THEN** that customer is not adopted as the member's pair

#### Scenario: grade10-site-store-membership-SC-06 - A purchase that creates the account also pairs it

- **WHEN** a guest buys with an email belonging to no account, and the
  account is created once the purchase is paid
- **THEN** that account pairs with the customer record the purchase made

### Requirement: Erasing a member erases the commerce customer, irreversibly

When a member is erased, the pairing SHALL be marked terminal before any
provider call, so no repair or retry can re-create the customer afterwards.
The removal of the customer record SHALL be retried until the provider
confirms it, and any customer record the erasure race left behind SHALL be
found and removed. A terminal pairing SHALL never return to any live
state.

#### Scenario: grade10-site-store-membership-SC-07 - A crash mid-erasure does not resurrect the customer

- **WHEN** erasure fails after removing the customer record but before
  finishing
- **THEN** the removal is retried to completion
- **AND** no automatic repair re-creates the customer in the meantime

#### Scenario: grade10-site-store-membership-SC-08 - A racing creation is cleaned up

- **WHEN** a pairing retry creates the customer at the provider while the
  member's erasure is completing
- **THEN** that customer is found and removed

### Requirement: A member identifies at the till by a dynamic code or their email

The member card SHALL present a dynamic identification code — short-lived,
usable exactly once, refused on reuse naming where and when it was first
used — rendered both scannable and as a short typed fallback that is
infeasible to guess, with repeated failed attempts pausing entry for that
shop. Staff SHALL also be able to identify a member by their exact email
address; a miss SHALL disclose nothing beyond that no member was found.
Either way the programme SHALL record the account identity and SHALL NOT
store the email address.

Either identification SHALL open a time-limited till session authorizing
the terminal to read and act for that member, with no confirmation on the
member's own device. The session SHALL record how the member was
identified, and every read and act inside it SHALL be recorded with the
claimed staff and location labels; identifier-typed lookups SHALL be
rate-limited.

#### Scenario: grade10-site-store-membership-SC-09 - A replayed code is refused with its history

- **WHEN** an identification code is presented a second time
- **THEN** it is refused, naming where and when it was first used
- **AND** the member's own card shows the same

#### Scenario: grade10-site-store-membership-SC-10 - An email miss discloses nothing

- **WHEN** staff enter an email that matches no member
- **THEN** the answer says only that no member was found
- **AND** it does not distinguish an unknown address from an unpaired one

#### Scenario: grade10-site-store-membership-SC-11 - A lookup is recorded

- **WHEN** staff identify a member by typed email
- **THEN** the lookup is recorded with the staff and location labels and
  how the member was identified

### Requirement: A till session reads the member and spends on their behalf

Inside a till session, staff SHALL see the member's display name, tier,
redeemable balance, qualifying-window progress, tier renewal and
balance-lapse dates, recent activity, affordable rewards, open discount
codes, and pending collections — and SHALL be able to redeem points against the
current sale, apply an open code, cancel the last redemption, and confirm
a collection. Cancelling is the programme's operator reversal reached from
the till: it SHALL require the permission that action requires, be recorded
in the operator log like any other, and be refused on anything already
consumed. Staff holding no such permission SHALL see it refused, not hidden. Spending SHALL present a read-back facing the member —
points spent, money still due, balance after, points this sale will
earn, computed by the platform — before it commits.

Submitting the same spend twice SHALL cost once and answer the same both
times. Every staff-assisted redemption and every collection SHALL notify
the member immediately with the points, amount, and location — never the
code itself. A cancel SHALL be refused once an order carrying the code is
seen; a cancel that slips through before the order is visible SHALL be
detected and surfaced for claw-back, never silent.

#### Scenario: grade10-site-store-membership-SC-12 - A double tap spends once

- **WHEN** staff submit the same spend twice in quick succession
- **THEN** exactly one redemption is recorded
- **AND** both submissions answer with the same discount code

#### Scenario: grade10-site-store-membership-SC-13 - The member's phone is the monitor

- **WHEN** points are spent or a reward collected through a till session
- **THEN** the member is notified immediately with points, amount, and
  location
- **AND** the notification never contains the code

#### Scenario: grade10-site-store-membership-SC-14 - A cancel after tender is caught

- **WHEN** a redemption is cancelled and an order carrying its code
  appears afterwards
- **THEN** the mismatch is surfaced for an operator to claw back
- **AND** it is never silently ignored

### Requirement: Points become a single-use money-off code either channel accepts

Redeeming points for money off SHALL produce a discount code scoped to
the member's own commerce customer, single-use, for a fixed amount of
minor units, requiring a purchase of at least its own value, and refusing
to combine with another order-level discount. The code SHALL apply
natively at online checkout and at the till. An unused code SHALL stay
valid until its own validity ends and SHALL be listed to the member and
in their till session. When a member's pairing moves to a different
customer, their outstanding codes SHALL be re-scoped to it.

#### Scenario: grade10-site-store-membership-SC-15 - Another member cannot use the code

- **WHEN** a code is presented on a purchase by anyone but the member it
  was minted for
- **THEN** it is refused

#### Scenario: grade10-site-store-membership-SC-16 - A big code on a small cart is refused, not burned

- **WHEN** a code exceeds the purchase total
- **THEN** it does not apply and remains usable
- **AND** the purchase can complete without it

#### Scenario: grade10-site-store-membership-SC-17 - One points code per order

- **WHEN** a second points code is presented on an order already carrying
  one
- **THEN** it is refused

### Requirement: Physical-store orders are recorded exactly once

Orders originating at the commerce provider SHALL be recorded exactly once each,
whether they arrive by webhook, by a scheduled sweep, or both — and SHALL
never duplicate an order the platform's own checkout created. A refund
for an order not yet recorded SHALL cause that order to be fetched and
recorded rather than lost. Recording SHALL keep whatever money facts are
known even when no owner is known yet, and a refund on an ownerless order
SHALL be kept exactly-once for replay when an owner appears.

#### Scenario: grade10-site-store-membership-SC-18 - Webhook and sweep converge

- **WHEN** the same provider order arrives by webhook and by the sweep
- **THEN** exactly one order is recorded

#### Scenario: grade10-site-store-membership-SC-19 - The platform's own checkout is not re-ingested

- **WHEN** the sweep or a webhook carries an order the platform's own
  checkout created
- **THEN** no second record is created for it

#### Scenario: grade10-site-store-membership-SC-20 - A refund before identity is not lost or doubled

- **WHEN** a refund arrives twice for an order with no owner yet
- **THEN** the refund is recorded once
- **AND** it is applied to the member when the order is later attributed

### Requirement: An order is attributed to a member by evidence, and one claim lives at a time

An order SHALL become a member's through recorded evidence — the pairing
at sale time, the commerce customer on the order, or an operator's
judgement — with exactly one live claim per order; a second claimer SHALL
be refused naming the holder. Attribution SHALL grant the earning and
replay any recorded refunds in order. A claim SHALL be revocable: revoking
claws back what it granted, and a later re-attribution earns correctly.
Operator claims SHALL record the evidence and the operator. An order
whose earnable amount is not yet known SHALL be refused attribution
loudly, never guessed.

#### Scenario: grade10-site-store-membership-SC-21 - A sale rung up before registration is not lost

- **WHEN** a collector completes registration after their sale was
  finalised as a guest
- **THEN** an operator can attribute that order to them with evidence
  recorded
- **AND** the earning lands as if the sale had been theirs

#### Scenario: grade10-site-store-membership-SC-22 - A wrong attribution is one action to undo

- **WHEN** an operator revokes a claim
- **THEN** the points it granted are clawed back
- **AND** a re-attribution to the right member earns correctly

#### Scenario: grade10-site-store-membership-SC-23 - Two claimers cannot both win

- **WHEN** two attributions race for one order
- **THEN** exactly one claim lives and the other is refused naming the
  holder

### Requirement: Only eligible goods earn, on every channel

Every channel SHALL price earning from the order's goods after discounts,
applying the loyalty capability's own rule on what earns and what does
not — identically for online and physical orders, so no channel is a way
around it. An order whose eligible amount cannot be determined SHALL be
refused earning loudly rather than priced from a guess.

#### Scenario: grade10-site-store-membership-SC-24 - A gift card earns nothing anywhere

- **WHEN** an order containing a gift card completes, online or at the
  till
- **THEN** the gift card's amount earns no points

#### Scenario: grade10-site-store-membership-SC-25 - Points spent lower the same order's earning

- **WHEN** a points discount code pays part of an order
- **THEN** earning prices only the goods amount after that discount

### Requirement: The till degrades to a normal sale, never a blocked one

A store manager SHALL be able to disable the till's membership
capabilities — and staff-typed-email spending separately — with effect
within seconds. A disabled or unreachable membership surface SHALL never
block a sale: the sale completes as a guest sale, earning for an attached
customer still arrives through order recording, and attribution repairs
the rest later.

#### Scenario: grade10-site-store-membership-SC-26 - The kill switch stops spending, not selling

- **WHEN** the manager disables the membership surface mid-day
- **THEN** every till completes sales normally
- **AND** orders with an attached customer still earn

#### Scenario: grade10-site-store-membership-SC-27 - Email-assisted spending can be stopped alone

- **WHEN** the manager disables staff-typed-email spending
- **THEN** identification by the member card still spends
- **AND** email lookup still reads
