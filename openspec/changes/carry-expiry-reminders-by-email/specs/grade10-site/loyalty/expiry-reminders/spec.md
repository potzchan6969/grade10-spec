# Loyalty expiry reminders - delta

## REMOVED Requirements

### Requirement: A reminder names no channel and delivers nothing

**Reason:** Email is the settled first channel — the reminder still names
no channel in what it holds, but the programme now sends it.

## ADDED Requirements

### Requirement: Owed reminders are delivered by email

The reminder a member is owed reaches them by email.

**One email per reminder** - The programme SHALL send one email to the
member's address for each reminder owed, naming the day the balance
expires and the points lapsing on it. A reminder SHALL be sent once: the
same member, day and lead time SHALL raise one send however often the
programme is asked, so a grant, a correction or a claw-back that only
moves the count raises no second email.

**Unsent when no longer owed** - A reminder that stops being owed before
it is sent SHALL NOT be sent. The send SHALL follow the reminder as it
stands, not as it stood.

**No channel in the record** - What a reminder holds SHALL continue to
name no channel, so a push, the wallet card or the site can read the same
owed reminder later without the raising rules changing.

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-20 - An owed reminder raises one email
**Serves:** g10.loyalty-expiry-reminders.US1 - the email names the day and the points

- **WHEN** a member is owed a reminder for a lead time
- **THEN** one email is sent to their address naming the day their balance expires and the points lapsing on it

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-21 - The same reminder sends once
**Serves:** Delivery - one email per member, day and lead time

- **GIVEN** an email already sent for a reminder
- **WHEN** the programme is asked again while the reminder still stands
- **THEN** no second email is sent

#### Scenario: grade10-site-loyalty-expiry-reminders-SC-22 - A reminder that stops being owed goes unsent
**Serves:** Delivery - a member never reads a warning that is no longer true

- **GIVEN** a member owed a reminder not yet sent
- **WHEN** their expiry day moves past the lead time, or their balance is brought to nothing
- **THEN** no email is sent
