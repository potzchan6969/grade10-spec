# A reminder is owed before a member's points lapse

**Author:** @brianchacha6969 - 2026-09-15

Product context: [Expiry Reminders](../../../docs/prds/products/grade10-site/loyalty/expiry-reminders.md).

## Why

A member's whole balance lapses on one day, and nothing says so before it
arrives. The Membership section of the profile warns inside the last 30 days,
but only a member who opens it sees that; a member who does not open it loses
every point they hold without being told once. The programme knows the day
months ahead.

Telling them is two decisions, not one: who is owed a warning, and what
carries it. They have been stuck together, and the second one — email, a push,
the wallet card — has held the first back since the programme shipped.

This change settles the first alone. The programme answers who is close to
losing points and how many, and stops there. Nothing is sent. A channel picked
next reads who is owed a reminder rather than working it out again, and the
rule for who is owed one is written once.

The measurable claim: **share of members who spend rather than lose a balance
that was about to lapse**. It cannot move until a channel ships; knowing who is
owed a reminder is what makes that a small change rather than another argument about the rule.

## What Changes

- **A reminder is owed to a member close to losing points.** A member whose
  balance expires within a lead time, counted in whole days on the programme's
  clock, and who still holds points expiring on that day, is owed a reminder.
  It names them, the day, the points and the lead time that raised it.
- **A lead time is configuration, not a rule.** The programme carries a set of
  them, so one reminder or a ladder of them is a value the product picks. A
  programme that carries none owes no reminder and still starts; a set that
  cannot work stops it from starting. Which
  values Grade10 carries is held for Product in
  [decisions](decisions.md#decisions).
- **One reminder per member, day and lead time.** Two lead times on one day are
  two reminders, each naming its lead; asking again raises no second one.
- **The points it names stay current.** A grant, a correction or a claw-back
  that leaves the day in place changes the count, not the reminder.
- **A reminder that stops being true is gone at once.** Buying, redeeming or an
  operator restarting the window moves the day; the balance lapsing, or a
  claw-back, a correction or a deleted account bringing it to nothing, leaves
  nothing to warn about. In each case the reminder stops being owed the
  moment it stops being true, unsent.
- **Nothing is delivered.** No email, no push, no page reads what is raised.
  A reminder names no channel and the programme sends nothing.

## Non-Goals

What this change leaves out is in [decisions](decisions.md#non-goals).

## Capabilities

- Added: `grade10-site/loyalty/expiry-reminders`

## Impact

- **Spec store** — one new capability beside `grade10-site/loyalty/programme`,
  and a manual page for it. No component export changes, and no consuming
  application adapts: nothing renders a reminder.
- **Application** — the programme's own service. No member surface, no
  operator console, no till.
- **Members** — none see anything change. A member close to losing points is
  owed a reminder and is still not told.

## Follow-on changes

- Carry a reminder to the member over a channel the product picks.
- Let a member decline reminders, once one reaches them.
- Show an operator what a member is owed, and what they were told.

## References

- [Expiry Reminders · Values](../../../docs/prds/products/grade10-site/loyalty/expiry-reminders.md#values)
- [Expiry Reminders · Raising a Reminder](../../../docs/prds/products/grade10-site/loyalty/expiry-reminders.md#raising-a-reminder)
- [Expiry Reminders · What a Reminder Holds](../../../docs/prds/products/grade10-site/loyalty/expiry-reminders.md#what-a-reminder-holds)
- [Expiry Reminders · Delivery](../../../docs/prds/products/grade10-site/loyalty/expiry-reminders.md#delivery)
- [Points · Expiry](../../../docs/prds/products/grade10-site/loyalty/points.md#expiry)
