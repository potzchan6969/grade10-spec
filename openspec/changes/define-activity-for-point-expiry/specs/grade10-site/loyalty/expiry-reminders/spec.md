## MODIFIED Requirements

### Requirement: A reminder that has stopped being true is no longer owed

A reminder stops being owed the moment what it says stops being true.

**Gone at once** - A reminder SHALL stop being owed at the instant what it says
stops being true: the day the member's balance expires has moved, the member
holds no points expiring on the day it names, the balance has lapsed, the
member's account has been deleted, or the programme no longer carries the lead
time it names. It SHALL NOT wait on any scheduled process,
and SHALL stop being owed whether or not anything has read it.

<!-- trace:scenario id=g10.loyalty-expiry-reminders.SC-vup rev=3 -->
#### Scenario: grade10-site-loyalty-expiry-reminders-SC-08 - Activity that moves the day ends the reminder
**Serves:** Keeping a reminder true - activity that moves the day ends the reminder

- **WHEN** the day a member's balance expires moves further out because they buy or have an operator restart their window, or because an operator grants or corrects points onto their balance brought to nothing
- **THEN** no reminder is owed against the day it replaced, from that moment
- **AND** nothing is owed for the new day until it falls within a lead time

<!-- trace:scenario id=g10.loyalty-expiry-reminders.SC-4iv rev=1 -->
#### Scenario: grade10-site-loyalty-expiry-reminders-SC-09 - A balance brought to nothing ends the reminder
**Serves:** Keeping a reminder true - a balance brought to nothing ends the reminder

- **WHEN** a member owed a reminder has their whole balance clawed back or corrected away, and the day their balance expires stays in place
- **THEN** the reminder is immediately no longer owed

<!-- trace:scenario id=g10.loyalty-expiry-reminders.SC-jbb rev=1 -->
#### Scenario: grade10-site-loyalty-expiry-reminders-SC-18 - A deleted account ends the reminder
**Serves:** Keeping a reminder true - a deleted account ends the reminder

- **WHEN** a member owed a reminder deletes their account
- **THEN** no reminder is owed to them from that moment

<!-- trace:scenario id=g10.loyalty-expiry-reminders.SC-wib rev=1 -->
#### Scenario: grade10-site-loyalty-expiry-reminders-SC-10 - A day that has passed ends the reminder
**Serves:** Keeping a reminder true - a day that has passed ends the reminder

- **WHEN** the instant the member's balance expires passes
- **THEN** the reminder naming that day is immediately no longer owed, whether or not anything read it

<!-- trace:scenario id=g10.loyalty-expiry-reminders.SC-r8n rev=4 -->
#### Scenario: grade10-site-loyalty-expiry-reminders-SC-17 - Points returned to a day are owed a reminder again
**Serves:** Keeping a reminder true - points returned to a day are owed a reminder again

- **WHEN** a member whose balance was brought to nothing has a redemption reversed, or points they paid at checkout come back through a refund or an operator's return, and the returned points take the day already running, which still falls within a lead time
- **THEN** the member is owed a reminder for that day again
- **AND** it is the same reminder as before, named by the same member, day and lead time, never a second one

<!-- trace:scenario id=g10.loyalty-expiry-reminders.SC-eci rev=1 -->
#### Scenario: grade10-site-loyalty-expiry-reminders-SC-20 - A lead time taken out of the setting is owed nothing
**Serves:** Keeping a reminder true - a lead time taken out of the setting is owed nothing

- **WHEN** the programme starts again with one lead time taken out of its setting, and a member's day still falls within it
- **THEN** no reminder naming that lead time is owed
- **AND** a reminder for a lead time the setting still carries is the same one as before
