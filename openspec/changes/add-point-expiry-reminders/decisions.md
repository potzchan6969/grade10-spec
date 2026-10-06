## Goals

- The programme answers, whenever asked, which members are owed a warning
  before their balance lapses, naming the member, the day, the points and the
  lead time.
- A reminder that has stopped being true stops being owed at once.
- A channel chosen later reads who is owed a reminder rather than working it
  out again.

## Non-Goals

- Choosing the channel that carries a reminder - left open on
  [Expiry Reminders](../../../docs/prds/products/grade10-site/loyalty/expiry-reminders.md),
  under Carrying a Reminder
- Letting a member decline reminders - nothing reaches them yet
- Showing an operator what a member is owed
- Changing what moves a member's expiry date, or what the profile's Membership
  section says

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does the programme record? | That a reminder is owed, naming the member, the day, the points and the lead time that raised it - the proposal, @brianchacha6969, 2026-09-15 | |
| Q2 | Does raising a reminder send anything? | No: no channel is named and nothing is sent; knowing who is owed one is what lets the channel be chosen later - the proposal, @brianchacha6969, 2026-09-15 | |
| Q3 | Is who is owed a reminder settled together with what carries it? | Apart: this change settles who is owed one, and the channel is its own change - the proposal, @brianchacha6969, 2026-09-15 | Choosing the channel first, which has held the rule for who is owed one since the programme shipped |
| Q4 | Are lead times a rule or a value? | A set the programme carries as configuration, so one reminder or a ladder is a value the product picks; a programme that carries none owes no reminder and still starts - the proposal, @brianchacha6969, 2026-09-15 | |
| Q5 | Which lead times does Grade10's programme carry? (a) one lead of 30 days, the horizon the profile's Membership section already warns on; (b) a ladder, such as 30 and 7 days; (c) none until a channel ships, so nobody is owed one meanwhile | ❓ Product - recommended: (a) one lead of 30 days, so the reminder matches the warning the member already sees | |
| Q6 | What is the smallest balance owed a reminder? (a) any balance of 1 point or more, with no setting; (b) a configured minimum, with its own rule | ❓ Product - recommended: (a) any balance of 1 point or more, the simplest rule and the one the delta already states | |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/loyalty/expiry-reminders` | Accept-review: Grade10's lead times are not settled, and task group 3 waits on them | Q5 |
| `grade10-site/loyalty/expiry-reminders` | Accept-review: the delta owed a reminder to any balance of 1 point or more while the page held the smallest balance open | Q6 |
