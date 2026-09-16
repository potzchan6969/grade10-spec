**Author:** @jeffffej0909 - 2026-09-16

Product context: [Winner Order](../../../docs/prds/products/grade10-site/auction/winner-order.md),
[Auction Order Status](../../../docs/prds/products/grade10-site/auction/order-status.md),
[Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/post-sale.md).

## Why

A winner who never comes back holds a lot forever. `revise-auction-winner-invoicing`
moves the invoice behind an address the winner confirms, and deliberately gives
that step no end: an order 30 days past its close still reads Awaiting Address
and its invoice status is never `expired` (`winner-order-SC-32`). The only thing
that happens is an Overdue mark on an operator's queue row, which changes nothing
and which the winner never sees. So the card cannot be re-listed, the consignor
cannot be told when it will settle, and no moment ever tells the winner to get in
touch.

The payment side already has that moment. An expired invoice hides card Pay and
carries Contact Us, and an operator reissues, settles manually, or cancels
(`winner-order-SC-37`). The address side is the same shape of obligation with
none of the same end. This change gives it one.

**Metric:** the share of won lots whose address is confirmed inside 48 hours.
**Second signal:** reopens per 100 won lots — a number that climbs says 48 hours
is too short, which is why the window is tentative.

## What Changes

- **BREAKING — The address entrance closes 48 hours after lot close.** Until
  then the winner confirms an address as they do today. After that Grade10
  refuses the confirmation.
- **A closed window stops changes too.** A winner who confirmed inside the
  window cannot correct the address after it closes, so the rule is one entrance
  rather than two.
- **Contact Us takes the form's place.** Winner Order shows the closed window and
  how to reach Grade10, matching what an expired invoice already shows.
- **An operator reopens the entrance**, with a mandatory reason, which gives the
  winner a fresh 48 hours from the reopen. There is no limit on how often.
- **The order status does not move.** A closed window is a condition, not a
  state: the order still reads Awaiting Address or Preparing Invoice.
- **Every delta here is ADDED.** No requirement another in-flight change folds
  is touched, so `check:manual`'s two-changes-one-requirement rule stays quiet.
- **48 hours is tentative.** It is one Grade10-owned figure, and the reopen count
  is the signal for changing it.

## Non-Goals

- **The expired invoice.** `revise-auction-winner-invoicing` already hides card
  Pay, shows Contact Us, and leaves reissue, manual settlement in the admin
  portal, and cancellation to an operator. This change restates none of it.
- **Suspension.** A closed address window restricts nobody from bidding. Only an
  unpaid invoice past its deadline does, and that rule is unchanged.
- **A letter about the closing window.** No reminder before it closes and no
  notice when it does; the winner finds out on Winner Order. Named as a
  follow-on.
- **Automatic cancellation.** A closed window never returns the lot to stock on
  its own.
- **Changes after the invoice is sent.** Those stay an operator re-quote.
- **A winner-facing countdown.** The window is shown as the datetime it closes,
  per `shared/dates-and-times`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order`: the address entrance closes 48 hours
  after lot close; a closed window refuses both a confirmation and a change; the
  order shows the closing datetime, then Contact Us; an operator reopening it
  starts a fresh 48 hours.
- `grade10-site/auction/order-status`: a new requirement adding the condition
  `address_window_open`, read from the order's own facts; the derived order
  status is unchanged by it.
- `grade10-admin/auction/post-sale`: a new requirement letting an operator
  reopen the address entrance with a reason, or record the address themselves.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Winner Order shows when the address window closes, refuses the address form once it has, and shows Contact Us in its place. |
| `apps/admin/grade10` | A Reopen address entrance action with a mandatory reason, and an Overdue mark computed from the window rather than from idle time. |
| Auction service | The window's closing time on the order, a reopen that resets it, and the refusal of an address write once it has passed. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. The closed-window copy is catalog work for the engineer. |

## Ordering and dependencies

- **This change follows `revise-auction-winner-invoicing` and cannot archive
  before it.** Every requirement here is written against that change's folded
  shape — `not_issued`, Awaiting Address, Preparing Invoice, and an address that
  locks at send. Its `depends_on` records that.
- **This change folds no requirement that change folds.** An earlier draft
  modified six of them and `pnpm check:manual` refused it outright, under
  *Requirements two in-flight changes both fold* — whichever archived second
  would revert the first. Every delta here is ADDED instead, and each new
  requirement carries its own rule rather than editing one of theirs.
- **The feature sets are cumulative.** The delta files here carry that change's
  feature set plus this one's groups, because archive copies the feature set
  across by hand.

### Handed to `revise-auction-winner-invoicing`

Two edits belong in that change, because the requirements are its own and this
one may not touch them:

- **The Overdue mark should follow the address window**, not 72 hours idle, in
  **"The order detail shows how long an order has waited"** and **"The queue
  shows one outcome per lot"**. With a 48-hour window and a 72-hour mark, a
  winner is locked out for a full day before any operator is told. ❓ on the
  Post-Sale Queue page until that change makes the edit.
- **"Invoice log history"** should name *address entrance reopened* and *address
  recorded by an operator* among its log types. This change's own requirement
  already obliges Grade10 to write the reopened entry; the type list is theirs.

## Assumptions

- **48 hours is measured from lot close**, including every extended-bidding
  extension, and is stored in UTC.
- **A reopen needs payment processing** — the grant that already covers reissue
  and manual settlement — and is recorded on the invoice log like any other
  operator act.
- **An operator may still cancel a pre-invoice order**, closed window or not,
  which is unchanged.
- **Sending the invoice retires the window.** The address locks at send, so the
  window has nothing left to govern.
- **A write is judged on receipt.** An address Grade10 receives at or after the
  closing time is refused, however long the winner spent composing it.
- **An operator may record the address themselves** on a closed-window order,
  without reopening the entrance, so a winner who telephones is quoted in one
  step.
- **The account address book is unaffected.** It is account-wide; only putting
  an address on this order is refused.
- **A cancelled order never reopens.** Cancellation has already returned the lot
  to stock.

## Open questions

- **Does a reopen tell the winner?** No letter is specified, on the assumption
  that the winner asked for the reopen and the operator answers them directly.
  A winner who is not watching never learns the form is back. ❓ on the Winner
  Order page; `winner-order-US7-TC15-1` is held `draft` and `**Blocked:**` on
  Product until it is settled.

## Follow-on changes

- A reminder to a winner whose address window is about to close, and a notice
  when it has.
- A rule for a lot nobody ever claims, so a permanently abandoned order leaves
  the queue without an operator deciding each one.

## References

- [Winner Order · Invoice and Settlement](../../../docs/prds/products/grade10-site/auction/winner-order.md#invoice-and-settlement)
- [Post-Sale Queue · Payment](../../../docs/prds/products/grade10-admin/auction/post-sale.md#payment)
- [Auction Order Status](../../../docs/prds/products/grade10-site/auction/order-status.md)
