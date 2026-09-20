**Author:** @tangconst - 2026-09-17

## Why

After a setup or payment deadline, Winner Order and My Auctions still read
**Awaiting Setup** or **Pending Payment** — the same labels as inside the
window — so a winner cannot tell from Status alone that self-service has
closed. The column that carries those labels is still named Your Standing,
which no longer matches a table that mixes bid standings with order statuses.

**Metric:** share of overdue won rows where Status reads Setup Overdue or
Payment Overdue (not Awaiting Setup / Pending Payment) on both Winner Order
and My Auctions.

## What Changes

- **BREAKING — derived order status after each deadline.** Inside the setup
  window the order reads **Awaiting Setup**; once the setup deadline passes
  incomplete it reads **Setup Overdue**. Inside the payment window it reads
  **Pending Payment**; once the payment deadline passes unpaid (invoice
  `expired`) it reads **Payment Overdue**. Winner Order, My Auctions and the
  operator queue all use the same names. Replaces the rule that an expired
  invoice keeps Pending Payment and that a missed setup deadline leaves the
  status unchanged.
- **My Auctions column Your Standing → Status.** Bid standing while the lot
  is open; the order's status once won — including Setup Overdue and Payment
  Overdue.
- **Badge tones stay calm.** Setup Overdue and Payment Overdue use the error
  tone; Payment Verifying stays default (already on bank-transfer).

## Non-Goals

Recorded in [`decisions.md`](./decisions.md).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/order-status`: Setup Overdue and Payment Overdue in
  the derivation chain; expired invoice no longer keeps Pending Payment;
  missed setup no longer leaves Awaiting Setup.
- `grade10-site/auction/winner-order`: Winner Order surfaces for Setup
  Overdue and Payment Overdue (Contact Us, no self-service Confirm / Pay).
- `grade10-site/auction/account-record`: Won Status values include Setup
  Overdue and Payment Overdue; column renamed Status.
- `shared/ui/auction-record`: Column copy formerly Your Standing is Status.
- `grade10-admin/auction/post-sale`: Queue / filter outcomes use Setup
  Overdue and Payment Overdue where they today keep Awaiting Setup /
  Pending Payment past the deadline.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Derived status labels; My Auctions Status column and overdue won rows. |
| `apps/admin/grade10` | Post-sale outcomes and filters for Setup Overdue / Payment Overdue. |
| Auction service | Derivation rules for the two overdue statuses. |
| `@grade10/ui`, `@grade10/i18n` | Auction-record column key; standing badge copy. |
| Notification service | No letter kind change — setup-overdue and payment-overdue mail stay on `add-winner-setup-overdue-mail`. |

## Ordering and dependencies

Overlaps `close-overdue-address-confirmation` (setup lock) and
`add-winner-setup-overdue-mail` (overdue letters) on the same deadlines —
this change owns the **derived status names**, not the mail or the form
lock. `add-winner-bank-transfer` still owns Payment Verifying.
`add-winner-partial-payment` still owns Partially Paid.

## References

- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
- [Post-Bidding · Edge Cases](../../../docs/prds/products/grade10-site/auction/post-bidding.md#edge-cases)
- [Bidding · My Auctions](../../../docs/prds/products/grade10-site/auction/bidding.md#my-auctions-watchlist-and-notifications)
- [Auction Record Blocks](../../../docs/prds/products/shared/ui/auction-record.md)
