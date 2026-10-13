**Author:** @mason5991 - 2026-10-12

Product context: [Daily Reminder](../../../docs/prds/products/grade10-admin/console/daily-reminder.md).

## Why

An order waits for an operator without anything bringing the operator to it.
The Orders worklist and the Today count show what needs action, but only to an
operator who opens them, and nothing says which listings closed yesterday. An
invoice not sent, a proof not checked or a card not dispatched stays quiet
until someone happens to look.

**Metric:** orders that have waited 48 hours or more for an invoice, a proof
check or a dispatch, counted at each Hong Kong midnight. It falls once the
reminder runs.

## What Changes

- **Daily dialog** - on entering the console, a dialog lists what is new and
  what is still waiting on the operator, until they close it for the Hong Kong
  day. It does not open when neither list has a row for them.
- **What's New** - each listing that closed on the previous Hong Kong day, one
  row by outcome: a sold listing opens its winner order, an unsold one opens
  the listing.
- **Still Waiting** - each order that has waited 48 hours in Preparing
  Invoice, Payment Verifying or Preparing Shipment, longest first, every day
  until it moves on. Overdue orders stay in Needs you; a flagged order is listed
  by its own wait.
- **Three columns on Today** - What's New, Still Waiting and Needs you, so an
  operator who closed the dialog finds the lists again. Needs you holds the
  section cards it holds now, in one column; Approvals, Recent and All
  sections sit below.
- **Slack message** - at 08:00 Hong Kong time every day, each product posts its
  own lists as one message to its own Slack channel, headed with the product,
  with a link on each row, sent once with no retry and no record.
  The channel is shared, so it carries every row and no customer names.
- **By grant** - in the console, an operator sees only the rows whose action
  their grants let them take.
- **No messages stored** - both lists are read from current listings and
  orders; there is no bell or read state. Chosen over a notification table,
  which could disagree with the worklist.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/console/daily-reminder`: the two lists, who sees a row, the
  dialog, the three Today columns and the daily Slack message, with auction as
  the first source.

### Modified Capabilities

None.

## Impact

- Console: a dialog until the operator closes it for the day, and Today in
  three columns.
- Auction backend: one read for new listings and orders, one for orders
  waiting past the threshold, each scoped to the caller's grants for the
  console and unscoped for Slack.
- Slack: one daily post per product to its own channel. Each service sets its
  own channel and token as environment settings, so staging and production can differ.
- PRDs: Daily Reminder carries 🚧 for every outcome above; Auction Management
  carries one 🚧 line pointing at it; the console index's pointer is reworded.
- Does not change any order status, worklist row, order page or the Needs you
  counts.
- No domain impact: the reminder reads auction orders and moves no auction
  rule. No platform impact: no sign-in, role or date rule changes.

## Open Questions

None.

## Follow-on changes

- Inventory and vault add their own rows to the same two lists.

## References

- [Daily Reminder · Rules](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#rules)
- [Daily Reminder · What's New](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#what-s-new)
- [Daily Reminder · Still Waiting](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#still-waiting)
- [Daily Reminder · Who Sees a Row](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#who-sees-a-row)
- [Daily Reminder · Opening](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#opening)
- [Daily Reminder · Today](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#today)
- [Daily Reminder · Slack](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#slack)
- [Auction Management · Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/management.md#post-sale-queue)
