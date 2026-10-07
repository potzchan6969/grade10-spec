**Author:** @ecchochan - 2026-10-07

## Why

A staging walk of the vault console found that Cancel visit and Send
forfeiture notice email the collector on a single press - the notice also
starting the borrower's period to pay - while every other act that cannot be
taken back asks first. It also found a loan 30 days past its due date reading
only "Loan running" in the case header, with the count of days on the Payouts
tab, which staff do not hold the grant to open.

**Metric:** visits staff cancel and book again on the same case within the
hour, the trace a misplaced press leaves on the audit trail, fall to none.

## What Changes

- **Cancel visit asks first** - the confirm names the slot on the booked
  shop's clock, and says the collector is emailed and the case keeps its status, so
  the operator checks the one fact a misplaced press would get wrong.
- **Send forfeiture notice asks first** - the confirm names the address the
  notice goes to and the date to pay by it sets, in the destructive tone, so
  a legal deadline never starts on a misplaced press.
- **A loan's clock in the case header** - beside the status, a live loan
  past its due date reads how many days past due, in the words the Overdue
  view and the collector's Past due stage use; once a forfeiture notice
  stands it reads the date to pay by instead. It is a clock, never a badge
  saying the case waits on staff.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

### Modified Capabilities

- `grade10-admin/vault/operator-queue`: one case's header carries a loan's
  clock, and the two acts that email the collector on one press confirm first.

## Impact

- **Pages** - [Operator Console · One case](../../../docs/prds/products/grade10-site/vault/operator-console.md#one-case)
  carries the 🚧 lines and the decisions behind them.
- **grade10** - `packages/vault/admin-frontend`: the Visit block's Cancel
  visit and the Custody tab's Send forfeiture notice go through the confirm
  the console root already mounts; the case header reads the clock from the
  case's own due figures and its forfeiture notice. Whether the case read
  carries the brand's notice period, so the confirm can name the date before
  the send, is `tech-design.md`'s to settle.
- **Worker** - no rule moves: cancelling a visit, sending the notice and the
  date it names stay as `grade10-site/vault/visit-booking` and
  `grade10-site/vault/loan-and-settlement` state them.
- **Component exports** - none move; the console's badge and confirm already
  exist.

## Open questions

- **A clock on queue rows** - the rule that a case runs a clock once terms are
  accepted sits on the queue row's requirement, and no row carries one today
  outside the Overdue view. The In custody view's rows carry none, since the
  Overdue view already lists every late loan (Q24).
- **A notice to a case with no address** - a message to a case with no
  address is counted rather than mailed, so a forfeiture notice starts its
  period with nobody told. Whether the notice is refused in that case is
  Legal's to settle, outside this change, and asked on the Loan and Money
  page's Records section;
  this change keeps the worker's rule and has the confirm say nobody is
  emailed (Q23).

## References

- [Operator Console · One case](../../../docs/prds/products/grade10-site/vault/operator-console.md#one-case)
