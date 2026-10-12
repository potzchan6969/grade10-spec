**Author:** @mason5991 - 2026-10-12

Product context: [Daily Reminder](../../../docs/prds/products/grade10-admin/console/daily-reminder.md).

## Why

An order waits for an operator without anything bringing the operator to it.
The Orders worklist and the Today count show what needs action, but only to an
operator who opens them, and nothing says which listings closed yesterday. An
invoice not sent, a proof not checked or a card not dispatched stays quiet
until someone happens to look.

**Metric:** orders that have waited more than 48 hours for an invoice, a proof
check or a dispatch, counted at each Hong Kong midnight. It falls once the
reminder runs.

## What Changes

- **Daily dialog** - on the first entry of each Hong Kong day, a dialog lists
  what is new and what is waiting on the operator. It does not open when
  neither list has a row for them.
- **What's New** - each listing that closed on the previous Hong Kong day, one
  row by outcome: a sold listing opens its winner order, an unsold one opens
  the listing.
- **Waiting on You** - each order that has waited 48 hours in Preparing
  Invoice, Payment Verifying or Preparing Shipment, longest first, every day
  until it moves on.
- **Same lists on Today** - an operator who closed the dialog finds the lists
  again on Today.
- **By grant** - an operator sees only the rows whose action their grants let
  them take.
- **Nothing stored** - both lists are read from current listings and orders;
  the only memory is the browser's closed mark for the day. Chosen over a
  notification table with read state per operator, which could disagree with
  the worklist.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/console/daily-reminder`: the two lists, who sees a row, and
  when the dialog opens, with auction as the first source.

### Modified Capabilities

None.

## Impact

- Console: a dialog on first entry of the day, and a section on Today.
- Auction backend: one read for new listings and orders, one for orders
  waiting past the threshold, each scoped to the caller's grants.
- PRDs: Daily Reminder carries 🚧 for every outcome above; Auction Management
  carries one 🚧 line pointing at it.
- Does not change any order status, worklist row, order page or the Needs you
  count.

## Open Questions

- ❓ **Their waits** - which wait, if any, Setup Overdue, Payment Overdue and
  flagged payments carry. Owed by Product; the first version leaves them out.

## Follow-on changes

- Inventory and vault add their own rows to the same two lists.
- Setup Overdue, Payment Overdue and flagged payments join Waiting on You once
  Product sets their waits.

## References

- [Daily Reminder · Rules](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#rules)
- [Daily Reminder · What's New](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#what-s-new)
- [Daily Reminder · Waiting on You](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#waiting-on-you)
- [Daily Reminder · Who Sees a Row](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#who-sees-a-row)
- [Daily Reminder · Opening](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#opening)
- [Auction Management · Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/management.md#post-sale-queue)
