**Author:** @jeffffej0909 - 2026-09-16

Product context: [Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order),
[Auction Order Status](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order),
[Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/management.md#post-sale-queue).

## Why

The durable Winner Order rules give the winner 48 hours from lot close to
confirm a delivery address. When the deadline passes it hides Confirm and shows
Contact Us, and says only that an operator follows up. Four things are left
open:

- **Changing a confirmed address.** Nothing stops a winner who confirmed in time
  from changing the address after the deadline.
- **Getting the form back.** A winner who gets in touch has no way back to the
  form. Nothing lets an operator reopen it.
- **An expired invoice.** It can be settled manually, but that sits only in an
  action table. No requirement says the admin portal is the only place it is
  paid.
- **A payment already on its way.** A card payment sent just before the payment
  deadline has no stated outcome if it confirms after.

This change closes those four gaps.

**Metric:** the share of won lots whose address is confirmed inside 48 hours.
**Second signal:** reopens per 100 won lots — a rising count says 48 hours is
too short.

## What Changes

- **A missed address deadline closes the whole address form.** The winner can
  neither confirm an address nor change one already confirmed, until the invoice
  is sent.
- **The deadline counts from the actual close**, after any extended bidding. A
  write is judged by when Grade10 receives it.
- **An operator reopens the address form**, with a mandatory reason, which gives
  the winner a fresh 48 hours. There is no limit on reopens, and a cancelled
  order never reopens.
- **An operator can record an address the winner gives by phone**, without
  reopening the form.
- **The Awaiting Setup queue Overdue mark follows the 48-hour address
  deadline.** Preparing Invoice has no queue Overdue mark. Its payment Overdue
  timer starts only after the invoice is sent and visible to the winner.
- **The account address book stays open.** Only putting an address on this
  order is refused.
- **The order status does not move.** A new condition gates the winner's write;
  the order still reads Awaiting Setup or Preparing Invoice.
- **An expired invoice is paid only in the admin portal.** An operator settles
  it manually; a reissue is the only way back to the winner's card.
- **A card payment started in time counts.** One Grade10 received before the
  payment deadline completes even if it confirms after, and the invoice stays
  `pending` until then. One received at or after the deadline is refused and not
  charged.
- **The Post-Sale Queue page no longer says an expired invoice "stays
  payable"**, which read as if the winner could still pay it.

## Non-Goals

- **The address deadline's duration and winner-facing copy.** Its 48 hours,
  `Confirm by …`, the `Missed address deadline` alert and Contact Us are
  inherited durable behavior; this change maps the settled deadline to the
  Awaiting Setup queue mark and does not duplicate that copy.
- **The expired invoice's own rules.** Writing `expired`, hiding card Pay, and
  reissue and cancellation remain existing durable behavior.
- **Letters.** Address reminders are that change's. A reopen sends no letter;
  the operator tells the winner directly.
- **Suspension and automatic cancellation.** A missed address deadline does
  neither, as that change already says.
- **Changes after the invoice is sent.** Those stay an operator re-quote.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order`: a new requirement — a missed address
  deadline closes the whole address form, and only an operator reopens it.
- `grade10-site/auction/order-status`: a new requirement adding the condition
  `address_window_open`, which gates the winner's address write and changes no
  status.
- `grade10-admin/auction/post-sale`: two new requirements — an operator reopens
  the address form or records the address, and only an operator settles an
  expired invoice.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | After the address deadline, Winner Order hides the address change control as it hides Confirm, and refuses an address write. |
| `apps/admin/grade10` | Reopen address form, with a mandatory reason; record an address by phone; settle an expired invoice. |
| Auction service | A deadline a reopen resets, refusal of late address writes, and an invoice held `pending` while a payment started in time confirms. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. |

## Ordering and dependencies

- **Builds on the durable address deadline, `not_issued` invoice state and
  address lock at send.** This change has no dependency on an archived or
  unfinished change.
- **Owns the queue mark mapping, derived condition, audit entries and race
  behavior.** It does not reopen the winner-facing deadline wording.
- **Cumulative feature sets.** The delta files copy that change's feature set and
  add this change's leaves, because archive copies the feature set by hand.

### Durable contract updates carried by this change

- **Overdue mark** — the Awaiting Setup queue mark appears when the persisted
  48-hour address deadline passes. Preparing Invoice has no queue Overdue mark;
  its payment Overdue timer starts only when the invoice is sent and visible to
  the winner.
- **Invoice log** — the log types name *address form reopened* and *address
  recorded by an operator*, each with actor, timestamp and reason.
- **Race behavior** — address writes, operator reopen/record, and invoice send
  serialize under the order boundary.

## Assumptions

- **A reopen needs payment-processing**, the grant that already covers reissue
  and manual settlement, and is written to the invoice log.
- **"Started" means Grade10 received the winner's payment** before the deadline,
  not that the winner opened the page.
- **The 48 hours stay one Grade10-owned figure.** A new figure applies to lots
  closing after it is set.

## Follow-on changes

- A rule for a lot nobody ever claims, so an abandoned order leaves the queue
  without an operator deciding each one.

## References

- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
- [Post-Bidding · Edge Cases](../../../docs/prds/products/grade10-site/auction/post-bidding.md#edge-cases)
- [Auction Management · Payment](../../../docs/prds/products/grade10-admin/auction/management.md#payment)
