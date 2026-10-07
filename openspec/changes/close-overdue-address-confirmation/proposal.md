**Author:** @jeffffej0909 - 2026-09-16

Product context: [Address Deadline](../../../docs/prds/products/grade10-site/auction/post-bidding.md#address-deadline),
[Missed Address Deadline](../../../docs/prds/products/grade10-site/auction/post-bidding.md#missed-address-deadline),
[Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/management.md#post-sale-queue).

## Why

The durable Winner Order rules give the winner 48 hours from lot close to
confirm a delivery address. When the deadline passes it hides Confirm and shows
Contact Us, and says only that an operator follows up. Four things are left
open:

- **A late write.** Hiding Confirm does not say that Grade10 refuses an address
  it receives after the deadline, or which clock judges it.
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

- **A missed address deadline closes the address form.** The winner cannot
  confirm an address until an operator reopens the form or records the order
  address. A confirmed address locks on confirm, and invoice send retires the
  deadline.
- **The deadline counts from the actual close**, after any extended bidding. A
  write is judged by when Grade10 receives it.
- **The operator's reopen and record-setup actions are
  `complete-auction-post-sale`'s.** An operator reopens an unconfirmed Setup
  Overdue address form, with a mandatory reason, for a fresh 48 hours, or
  records the winner's setup given by phone, without reopening. This change
  stores the deadline those actions reset and gates the winner's write on it.
- **An unconfirmed passed address deadline derives Setup Overdue.** Preparing
  Invoice stays distinct after an address is confirmed. Its payment Overdue
  timer starts only after the invoice is sent and visible to the winner.
- **The account address book stays open.** Only putting an address on this
  order is refused.
- **A missed address deadline reads Setup Overdue.** The derived status applies
  while no address is confirmed; a confirmed address still reads Preparing
  Invoice. `address_window_open` gates the winner's write, and operator actions
  do not write a status directly.
- **An expired invoice is paid only in the admin portal.** An operator records
  it manually; a full payment settles it, while a shortfall below the 90% closing
  tolerance stays Partially Paid with no new self-service deadline or
  close-as-paid choice. A reissue is the only way back to
  the winner's card.
- **A card payment started in time counts.** One Grade10 received before the
  payment deadline completes even if it confirms after, and the invoice stays
  `pending` while its card session is open, never written `expired` while it is
  in flight. A session that then fails, times out or is abandoned counts as a
  failed outcome: the invoice is written `expired` when the session ends, and
  Pay Now stays closed. One received at or after the deadline is refused and not
  charged.
- **The Post-Sale Queue page no longer says an expired invoice "stays
  payable"**, which read as if the winner could still pay it.

## Non-Goals

- **The address deadline's duration and winner-facing copy.** Its 48 hours,
  `Confirm by …`, the `Missed address deadline` alert and Contact Us are
  inherited durable behavior; this change carries the settled Setup Overdue
  derivation and does not duplicate that copy.
- **The expired invoice's own rules.** Hiding card Pay, and reissue and
  cancellation remain existing durable behavior. Writing `expired` is held while
  a card session started in time is open, and written when it ends unpaid.
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
  deadline closes the address form, and only an operator reopens it. The
  requirement "The payment deadline is fixed when the invoice is sent" is
  modified so a card payment started in time holds the invoice `pending`, and a
  session that ends unpaid writes `expired` then.
- `grade10-site/auction/order-status`: a new requirement adding the condition
  `address_window_open`, which gates the winner's address write; an
  unconfirmed missed deadline derives Setup Overdue.
- `grade10-admin/auction/post-sale`: one new requirement — only an operator
  settles an expired invoice. The requirement that an operator reopens the
  address form or records setup is `complete-auction-post-sale`'s, which this
  change depends on.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | After the address deadline, Winner Order refuses an address write and offers no winner change control. |
| `apps/admin/grade10` | Settle an expired invoice. The reopen and record-setup controls are `complete-auction-post-sale`'s. |
| Auction service | A deadline a reopen resets, refusal of late address writes, an invoice held `pending` while a card session started in time is open, and written `expired` when that session ends unpaid. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. |

## Ordering and dependencies

- **Builds on the durable address deadline, `not_issued` invoice state and
  address lock at send, and on `complete-auction-post-sale`**, declared in
  `.openspec.yaml`. That change owns the operator's reopen-setup and
  record-setup actions and their requirement; this change owns the persisted
  address deadline and `address_window_open` they act on.
- **Accepted after `complete-auction-post-sale`**, which waits for its own
  dependencies to archive first.
- **Owns the persisted deadline, the derived write gate and the race behavior.**
  It does not reopen the winner-facing deadline wording.
- **Feature sets carry this change's own items only.** The fold merges them by
  label into the durable sets.
- **Deferred modification.** Order Status's "An auction order carries two
  writable status fields" and "Permitted transitions" are modified by
  `complete-auction-post-sale`; after it archives, a follow-up modifies them for
  the in-flight exception (tasks.md 5.1).

### Durable contract updates carried by this change

- **Setup Overdue** — an unconfirmed order derives this status when the
  persisted 48-hour address deadline passes. Preparing Invoice does not derive
  Setup Overdue; its payment Overdue timer starts only when the invoice is sent
  and visible to the winner.
- **Race behavior** — serializing address writes, operator reopen/record and
  invoice send under the order boundary is `complete-auction-post-sale`'s
  (its `SC-90`).

## Assumptions

- **A reopen needs payment-processing**, the grant that already covers reissue
  and manual settlement, and is written to the invoice log, as
  `complete-auction-post-sale` states.
- **"Started" means Grade10 received the winner's payment** before the deadline,
  not that the winner opened the page.
- **The 48 hours stay one Grade10-owned figure.** A new figure applies to lots
  closing after it is set.

## Follow-on changes

- A rule for a lot nobody ever claims, so an abandoned order leaves the queue
  without an operator deciding each one.

## References

- [Post-Bidding · Address Deadline](../../../docs/prds/products/grade10-site/auction/post-bidding.md#address-deadline)
- [Post-Bidding · Missed Address Deadline](../../../docs/prds/products/grade10-site/auction/post-bidding.md#missed-address-deadline)
- [Auction Management · Address Confirmation Window](../../../docs/prds/products/grade10-admin/auction/management.md#address-confirmation-window)
- [Auction Management · Manual Payment Collection](../../../docs/prds/products/grade10-admin/auction/management.md#manual-payment-collection)
