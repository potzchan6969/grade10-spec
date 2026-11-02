# grade10-site/loyalty/tier-reminders Specification

## Purpose

Answer which members are owed a warning before their tier period closes
below the keep line, and carry that warning by email, so a Gold member
can earn what still keeps the tier before they drop.

## Feature set

- Raising a tier reminder
  - Owed by the period's end: a Gold member whose period ends within a
    lead time and whose points earned inside it fall short of the keep
    line is owed a reminder
  - Lead times: configuration, as the points expiry reminder carries
    them; Grade10 starts from 30 days
  - Raised once: told apart by the member and the period's end, so the
    same pair is one reminder however often the programme is asked
- What a reminder holds
  - The member, the day the period ends, the points earned inside it and
    the points still needed to keep the tier
- Keeping a reminder true
  - Gone at once: reaching the keep line, the period ending, or a refund
    or an operator removing the tier ends what is still owed
- Delivery
  - Email: the owed reminder is sent to the member's address, once per
    member and period end

## ADDED Requirements

### Requirement: The programme answers which members are owed a tier reminder

A member is owed a tier reminder when their Gold period closes below the
keep line inside a lead time.

**Owed by the period's end** - The programme SHALL answer, at any instant,
which members are owed a tier reminder. A member SHALL be owed one for a
lead time once the calendar day their current Gold period ends is no more
than that many whole days after the current calendar day, read on the
programme's clock, and their points earned inside the running period are
below the keep line the tier names.

**What a reminder names** - Each reminder SHALL name the member, the day
the period ends, the points earned inside it and the points still needed
to reach the keep line, kept current while the period stands.

**Raised once** - A reminder SHALL be identified by the member and the
period's end. The same two SHALL be one reminder however often the
programme is asked.

**Lead times** - The programme SHALL carry lead times as configuration,
under the same rules the points expiry reminder's lead times follow.
Grade10's programme SHALL carry one lead time of 30 days.

**Silver and Black excluded** - A member on Silver SHALL be owed nothing:
a Silver period rolls into a fresh one and nothing is lost. A Black
invitation SHALL raise no reminder: its end is operator-set and observed,
not scheduled.

#### Scenario: grade10-site-loyalty-tier-reminders-SC-01 - A Gold member below the keep line is owed a reminder
**Serves:** Raising a tier reminder - owed inside the lead time

- **WHEN** a Gold member's period ends within 30 days and their earned points in it are below the keep line
- **THEN** that member is owed a reminder naming the day, the points earned and the points still needed

#### Scenario: grade10-site-loyalty-tier-reminders-SC-02 - Reaching the keep line ends the reminder
**Serves:** Keeping a reminder true - gone at once

- **GIVEN** a member owed a tier reminder
- **WHEN** an order takes their earned points in the period to the keep line
- **THEN** no reminder is owed to them for that period's end

### Requirement: Owed tier reminders are delivered by email

**One email per reminder** - The programme SHALL send one email to the
member's address for each reminder owed, naming the day the period ends,
the points earned and the points still needed. The same member and period
end SHALL raise one send however often the programme is asked.

**Unsent when no longer owed** - A reminder that stops being owed before
it is sent SHALL NOT be sent.

#### Scenario: grade10-site-loyalty-tier-reminders-SC-03 - An owed tier reminder raises one email
**Serves:** g10.loyalty-tier-reminders.US1 - the email names the closing day and the gap

- **WHEN** a member is owed a tier reminder
- **THEN** one email is sent to their address naming the day their period ends, the points earned and the points still needed to keep the tier

#### Scenario: grade10-site-loyalty-tier-reminders-SC-04 - The same tier reminder sends once
**Serves:** Delivery - one email per member and period end

- **GIVEN** an email already sent for a period's end
- **WHEN** the programme is asked again while the reminder still stands
- **THEN** no second email is sent
