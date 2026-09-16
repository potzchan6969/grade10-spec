# Loyalty expiry reminders — delta

## Purpose

Record that a member is owed a warning before their redeemable points lapse,
naming who, when and how many, so that any channel decided later can carry the
warning without deriving again who is owed one.

## Feature set

- Raising a reminder
  - Owed by the date: a member is owed a reminder once their balance expires
    within a configured lead time and still holds points expiring on that day
  - Lead times: a configured set, so one reminder or a ladder of them is a
    value the programme carries rather than a rule
  - Raised once: the same member, day and lead time are one reminder however
    often the programme looks
- Keeping a reminder true
  - Withdrawal: a reminder whose day, balance or window has moved under it is
    dropped before anything reads it
  - Nothing revived: a day that has passed leaves nothing owed
- Delivery
  - No channel: what is raised names no channel, and the programme sends
    nothing

## ADDED Requirements

### Requirement: The programme records that a member is owed an expiry reminder

The programme SHALL record that a member is owed an expiry reminder once the
day their redeemable balance expires falls within one of the programme's
configured lead times, and the member still holds redeemable points expiring on
that day.

Each record SHALL name the member, the day their balance expires, how many of
their points expire on that day, and which lead time raised it.

The programme SHALL carry its lead times as configuration, as a set rather than
a single value. A programme configured with no lead time SHALL record nothing,
and SHALL NOT be refused for it.

A member holding no redeemable points SHALL be owed nothing, whatever date
their window carries.

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-01 - A member inside a lead time is owed a reminder
**Serves:** Raising a reminder - a member inside a lead time is owed a reminder

- **WHEN** a member holds redeemable points and the day their balance expires falls within one of the programme's lead times
- **THEN** that member is recorded as owed a reminder for that day
- **AND** the record names the member, the day, the points expiring on it, and the lead time that raised it

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-02 - A member outside every lead time is owed nothing
**Serves:** Raising a reminder - a member outside every lead time is owed nothing

- **WHEN** the day a member's balance expires is further off than every configured lead time
- **THEN** nothing is recorded as owed for that member

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-03 - A member holding no points is owed nothing
**Serves:** Raising a reminder - a member holding no points is owed nothing

- **WHEN** a member holds no redeemable points
- **THEN** nothing is recorded as owed for that member, whatever date their window carries

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-04 - Each lead time raises its own reminder
**Serves:** Raising a reminder - each lead time raises its own reminder

- **WHEN** the day a member's balance expires falls within two of the programme's lead times
- **THEN** two reminders are owed for that day, one per lead time
- **AND** each names the lead time that raised it

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-05 - Looking twice raises nothing twice
**Serves:** Raising a reminder - looking twice raises nothing twice

- **WHEN** the programme looks again for members owed a reminder, with the same member, day and lead time still matching
- **THEN** the reminder already owed is left as it is, and no second one is recorded

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-06 - A pass cut short leaves the rest to the next one
**Serves:** Raising a reminder - a pass cut short leaves the rest to the next one

- **WHEN** a pass raising reminders stops before it has reached every member it matched
- **THEN** the reminders it raised stand
- **AND** the next pass raises the rest, carrying nothing between passes

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-07 - A programme with no lead time records nothing
**Serves:** Raising a reminder - a programme with no lead time records nothing

- **WHEN** the programme is configured with no lead time
- **THEN** no reminder is ever owed, and the programme starts and runs as it does otherwise

### Requirement: A reminder that has stopped being true is withdrawn

The programme SHALL withdraw a reminder once what it says has stopped being
true: the day the member's balance expires has moved, the member holds no
points expiring on the day it names, or that day has passed.

A withdrawn reminder SHALL NOT be raised again for the day it named. Where the
member's new day falls within a lead time, a reminder for that day SHALL be
owed in its own right, under the same rules as any other.

A reminder SHALL be withdrawn whether or not anything has read it.

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-08 - Activity that moves the day withdraws the reminder
**Serves:** Keeping a reminder true - activity that moves the day withdraws the reminder

- **WHEN** a member owed a reminder buys, redeems, or has an operator restart their window, and the day their balance expires moves further out
- **THEN** the reminder owed against the day it replaced is withdrawn
- **AND** nothing is owed for the new day until it falls within a lead time

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-09 - A balance spent to nothing withdraws the reminder
**Serves:** Keeping a reminder true - a balance spent to nothing withdraws the reminder

- **WHEN** a member owed a reminder spends their whole balance
- **THEN** the reminder is withdrawn

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-10 - A day that has passed withdraws the reminder
**Serves:** Keeping a reminder true - a day that has passed withdraws the reminder

- **WHEN** the day a reminder names has passed
- **THEN** the reminder is withdrawn, whether or not anything read it

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-11 - A withdrawn reminder is not raised again for the same day
**Serves:** Keeping a reminder true - a withdrawn reminder is not raised again for the same day

- **WHEN** a reminder has been withdrawn and the programme looks again
- **THEN** no reminder is owed again for the day it named

### Requirement: A reminder names no channel and delivers nothing

A reminder SHALL name no channel, and the programme SHALL send no message on
raising one. No member SHALL be told anything as a result of a reminder being
owed.

Each reminder SHALL be distinguishable from every other by the member, the day
and the lead time it names, so that whatever reads it later can tell a reminder
it has already handled from one it has not.

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-12 - Raising a reminder tells the member nothing
**Serves:** Delivery - raising a reminder tells the member nothing

- **WHEN** a reminder is recorded as owed
- **THEN** no message reaches the member by any channel
- **AND** no surface the member reads shows the reminder

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-13 - Two reminders for one member are told apart
**Serves:** Delivery - two reminders for one member are told apart

- **WHEN** a member is owed reminders raised by two lead times for the same day
- **THEN** each is distinguishable from the other by the lead time it names
