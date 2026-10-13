**Author:** @mason5991 - 2026-10-13

Product context: [Daily Reminder](../../../docs/prds/products/grade10-admin/console/daily-reminder.md).

## Why

The morning Slack list is late for a listing that just went live, an extension
in the last minutes of a sale, or an order that just became overdue or flagged.
Operators learn those moves only if they are watching the console. Flagged
orders also hide when they are younger than 48 hours, so a fresh flag waits for
Needs you by chance.

**Metric:** time from a listing going live, ending or extending, or an order
becoming overdue or flagged, to a Slack post in Auction's channel; and the
count of open flags that appear on Flagged or still waiting the same day they
are set.

## What Changes

- **Lifecycle Slack** - Auction posts one message to its daily reminder channel
  when a listing goes live (with start time), when it ends (with end time,
  including any extension), when it is extended (with how long and the new end
  time), when an order becomes Setup Overdue or Payment Overdue, and when an
  order is flagged (with the flag reason). Overdue and flagged alerts carry a
  warning mark.
- **Best effort and shared env gate** - lifecycle posting runs only after the
  usual bid, close, extension, overdue or flag step has completed. Every
  Auction Slack send - the 08:00 morning post and each lifecycle alert -
  attempts only when both the bot token and the channel are non-empty. If
  either env is missing or empty, the send is skipped with a not-configured
  log and the 08:00 run and every other usual path continue. A missed or
  failed post is logged and not retried.
- **Flagged or still waiting** - Still Waiting is renamed on Today, in the
  dialog and in the daily Slack list. Every order with an open payment flag has
  one row at the top, any age, with the flag reason and wait. The 48-hour
  invoice, proof and dispatch waits stay below. Setup Overdue and Payment
  Overdue stay out of the list unless also flagged.
- **Warning copy** - the list title carries a warning mark; its caption and
  daily Slack heading read **Something wrong or waiting a while, needing your
  action**.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/console/daily-reminder`: lifecycle Slack alerts on Auction's
  channel; shared both-env gate and bypass for the morning post and lifecycle
  alerts; Flagged or still waiting list membership, order and titles; warning
  marks on the waiting list and on overdue and flagged alerts.

## Impact

- Auction backend: fire-and-forget Slack posts on listing go-live, end and
  extension, and on overdue and flag transitions; Still Waiting read widened
  for open flags.
- Console Today and daily dialog: renamed column and caption, warning mark,
  flagged rows first.
- Slack: same Auction channel and token as the daily reminder; both must be
  non-empty for any send; no new environment settings.
- PRDs: Daily Reminder carries 🚧 for every outcome above; Auction Management
  points at the daily list and at lifecycle alerts.
- Does not change order status derivation, Needs you counts, or the bid path.
- Builds on the accepted daily reminder channel, lists and 08:00 post.

## Open Questions

None.

## References

- [Daily Reminder · Rules](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#rules)
- [Daily Reminder · Flagged or Still Waiting](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#flagged-or-still-waiting)
- [Daily Reminder · Today](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#today)
- [Daily Reminder · Slack](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#slack)
- [Daily Reminder · Lifecycle Alerts](../../../docs/prds/products/grade10-admin/console/daily-reminder.md#lifecycle-alerts)
- [Auction Management · Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/management.md#post-sale-queue)
