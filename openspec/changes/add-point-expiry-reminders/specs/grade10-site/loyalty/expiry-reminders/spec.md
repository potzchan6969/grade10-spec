# Loyalty expiry reminders — delta

## Purpose

Answer which members are owed a warning before their redeemable points lapse,
naming who, when and how many, so that any channel decided later can carry the
warning without deriving again who is owed one.

## Feature set

- Raising a reminder
  - Owed by the date: a member is owed a reminder once the day their balance
    expires falls within a lead time, counted in whole days on the
    programme's clock, and they still hold points expiring on that day
  - Lead times: a configured set, so one reminder or a ladder of them is a
    value the programme carries rather than a rule; a programme carrying no
    lead times owes no reminder and still starts, while a set that is present
    but cannot work stops the programme from starting
  - Raised once: a reminder is told apart by its member, day and lead time, so
    the same three are one reminder however often the programme is asked
- What a reminder holds
  - The member, the day and the lead time that raised it
  - The points: how many expire on the day, kept current while the day stands
- Keeping a reminder true
  - Gone at once: a reminder stops being owed the moment its day moves, its
    balance is brought to nothing or the balance lapses, whether or not
    anything has read it
- Delivery
  - No channel: what is raised names no channel, and the programme sends
    nothing

## ADDED Requirements

### Requirement: The programme answers which members are owed an expiry reminder

A member is owed a reminder when their points expire within a lead time, and
the lead times are configuration.

**Owed by the date** - The programme SHALL answer, at any instant, which
members are owed an expiry reminder. A member SHALL be owed one for a lead
time once the calendar day their redeemable balance
expires is no more than that many whole days after the current calendar day,
both read on the programme's clock, and the member still holds redeemable
points expiring on that day. Whether a reminder is owed SHALL depend only on
whether the member's account stands, their current expiry day and balance,
the programme's clock and its lead times.

**What a reminder names** - Each reminder SHALL name the member, the day their
balance expires, how many of their points expire on that day, and which lead
time raised it. The count SHALL be what expires on that day as the balance
stands when the reminder is read, so a grant, a correction, a claw-back or a
reversal that leaves the day in place changes the count and raises no second
reminder.

**Raised once** - A reminder SHALL be identified by the member, the day and
the lead time it names. The same three SHALL be one reminder however often the
programme is asked, so whatever reads it later can tell a reminder it has
already handled from one it has not.

**Lead times** - The programme SHALL carry its lead times as configuration, as
a set of whole days rather than a single value. A programme that carries no
lead times SHALL owe no reminder and SHALL start. A set that is present but
empty, holds a lead of zero or less, repeats a lead, or holds a lead as long
as the programme's expiry window or longer - 365 days on a twelve-month
window - SHALL fail the product at start-up, naming what it refuses.

**No points** - A member holding no redeemable points SHALL be owed nothing,
whatever date their window carries.

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-01 - A member inside a lead time is owed a reminder
**Serves:** Raising a reminder - a member inside a lead time is owed a reminder

- **WHEN** a member holds redeemable points and the day their balance expires falls within one of the programme's lead times
- **THEN** that member is owed a reminder for that day
- **AND** the reminder names the member, the day, the points expiring on it, and the lead time that raised it

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-14 - A lead time counts whole days on the programme's clock
**Serves:** Raising a reminder - a lead time counts whole days on the programme's clock

- **WHEN** the day a member's balance expires is exactly as many whole days after today, on the programme's clock, as one of the programme's lead times
- **THEN** the member is owed a reminder for that lead time
- **AND** a member whose day falls one day later is owed none for it

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-02 - A member outside every lead time is owed nothing
**Serves:** Raising a reminder - a member outside every lead time is owed nothing

- **WHEN** the day a member's balance expires is further off than every configured lead time
- **THEN** nothing is owed to that member

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-03 - A member holding no points is owed nothing
**Serves:** Raising a reminder - a member holding no points is owed nothing

- **WHEN** a member holds no redeemable points
- **THEN** nothing is owed to that member, whatever date their window carries

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-04 - Each lead time raises its own reminder
**Serves:** Raising a reminder - each lead time raises its own reminder

- **WHEN** the day a member's balance expires falls within two of the programme's lead times
- **THEN** two reminders are owed for that day, one per lead time
- **AND** each is told apart from the other by the lead time it names

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-05 - Asking again raises nothing twice
**Serves:** Raising a reminder - asking again raises nothing twice

- **WHEN** the programme is asked again who is owed a reminder, with the same member, day and lead time still matching
- **THEN** the reminder already owed is the one answered, and no second one is owed

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-07 - A programme with no lead times owes nothing and starts
**Serves:** Raising a reminder - a programme with no lead times owes nothing and starts

- **WHEN** the programme carries no lead times
- **THEN** the product starts
- **AND** no member is owed a reminder, whatever their balance and the day it expires

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-16 - A lead set that cannot work stops the programme from starting
**Serves:** Raising a reminder - a lead set that cannot work stops the programme from starting

- **WHEN** the programme carries a set of lead times that is empty, holds a lead of zero or less, repeats a lead, or holds a lead as long as its expiry window or longer, such as 365 days on a twelve-month window
- **THEN** the product fails at start-up, naming what it refuses
- **AND** a lead one day shorter than the window starts

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-15 - The points a reminder names stay current
**Serves:** What a reminder holds - the points a reminder names stay current

- **WHEN** a member owed a reminder receives a grant, a correction or a claw-back that leaves the day their balance expires in place
- **THEN** the reminder names the points that now expire on that day
- **AND** no second reminder is owed

### Requirement: A reminder that has stopped being true is no longer owed

A reminder stops being owed the moment what it says stops being true.

**Gone at once** - A reminder SHALL stop being owed at the instant what it says
stops being true: the day the member's balance expires has moved, the member
holds no points expiring on the day it names, the balance has lapsed, or the
member's account has been deleted. It SHALL NOT wait on any scheduled process,
and SHALL stop being owed whether or not anything has read it.

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-08 - Activity that moves the day ends the reminder
**Serves:** Keeping a reminder true - activity that moves the day ends the reminder

- **WHEN** a member owed a reminder buys, redeems, or has an operator restart their window, and the day their balance expires moves further out
- **THEN** the reminder owed against the day it replaced is immediately no longer owed
- **AND** nothing is owed for the new day until it falls within a lead time

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-09 - A balance brought to nothing ends the reminder
**Serves:** Keeping a reminder true - a balance brought to nothing ends the reminder

- **WHEN** a member owed a reminder has their whole balance clawed back or corrected away, and the day their balance expires stays in place
- **THEN** the reminder is immediately no longer owed

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-18 - A deleted account ends the reminder
**Serves:** Keeping a reminder true - a deleted account ends the reminder

- **WHEN** a member owed a reminder deletes their account
- **THEN** no reminder is owed to them from that moment

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-10 - A day that has passed ends the reminder
**Serves:** Keeping a reminder true - a day that has passed ends the reminder

- **WHEN** the instant the member's balance expires passes
- **THEN** the reminder naming that day is immediately no longer owed, whether or not anything read it

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-17 - Points returned to a day are owed a reminder again
**Serves:** Keeping a reminder true - points returned to a day are owed a reminder again

- **WHEN** a member whose balance was brought to nothing has a redemption reversed, and the returned points take the day already running, which still falls within a lead time
- **THEN** the member is owed a reminder for that day again

### Requirement: A reminder names no channel and delivers nothing

Raising a reminder sends nothing.

**No channel** - A reminder SHALL name no channel, and the programme SHALL
send no message on raising one. No member SHALL be told anything as a result
of a reminder being owed.

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-12 - Raising a reminder tells the member nothing
**Serves:** Delivery - raising a reminder tells the member nothing

- **WHEN** a reminder is owed
- **THEN** no message reaches the member by any channel
- **AND** no surface the member reads shows the reminder
