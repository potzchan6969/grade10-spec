# A reminder is owed before a member's points lapse

**Author:** @brianchacha6969 - 2026-09-15

Product context: [Expiry Reminders](../../../docs/prds/products/grade10-site/loyalty/expiry-reminders.md).

## Why

A member's whole balance lapses on one day, and nothing says so before it
arrives. The membership card warns inside the last thirty days, but only a
member who opens it sees that; a member who does not open it loses every point
they hold without being told once. The programme knows the day months ahead.

Telling them is two decisions, not one: who is owed a warning, and what
carries it. They have been stuck together, and the second one — email, a push,
the wallet card — has held the first hostage since the programme shipped. It
is the older of the two ❓ marks on the Points page.

This change settles the first alone. The programme records who is close to
losing points and how many, and stops there. Nothing is sent. A channel picked
next month reads the record it finds rather than re-deriving who to tell, and
the rule for who is owed a reminder is written once and never again.

The measurable claim: **share of members who spend rather than lose a balance
that was about to lapse**. It cannot move until a channel ships, which is the
point — the record is what makes that a small change rather than another
argument about the rule.

## What Changes

- **A reminder is raised for a member close to losing points.** A member whose
  balance expires within a configured lead time, and who still holds points
  expiring on that day, is owed a reminder. It names them, the day, the points
  and the lead time that raised it.
- **A lead time is configuration, not a rule.** The programme carries a set of
  them, so one reminder or a ladder of them is a value the product picks rather
  than a change to what this says. The values are ❓ on the Points page.
- **Two lead times on one day are two reminders.** Each carries which lead
  raised it, so a ladder never reads as the same reminder repeated.
- **Looking twice raises nothing twice.** The same member, day and lead time
  are one reminder however often the programme looks, so the pass that raises
  them is safe to re-run and safe to cut short.
- **A reminder that stops being true is dropped.** Buying, redeeming or an
  operator restarting the window moves the day; a balance spent to nothing and
  a day that has passed leave nothing to warn about. In each case what is still
  owed against the old day is dropped, unsent.
- **Nothing is delivered.** No email, no push, no page reads what is raised.
  The record names no channel and the programme sends nothing.

## Non-Goals

- Choosing the channel that carries a reminder. That is the ❓ this change
  leaves open, and the next change settles.
- Choosing the lead times or the smallest balance worth a reminder. Both are ❓
  on the Points page, and both are configuration once this lands.
- Letting a member decline reminders. Nothing reaches them, so there is nothing
  yet to decline.
- Changing what moves a member's expiry date, or what the membership card says.

## Capabilities

- Added: `grade10-site/loyalty/expiry-reminders`

## Impact

- **Spec store** — one new capability beside `grade10-site/loyalty/programme`,
  and a manual page for it. No component export changes, and no consuming
  application adapts: nothing renders a reminder.
- **Application** — the programme's own service and its nightly pass. No
  member surface, no operator console, no till.
- **Members** — none see anything change. A member close to losing points is
  recorded as owed a reminder and is still not told.

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
