## Shape

Persist `address_deadline_at` on the auction order when the order is created or
reopened. Treat that timestamp as an order fact, not a live calculation, so
configuration changes cannot move existing orders. Derive
`address_window_open` at read/write time from the persisted timestamp, the
invoice status and current order facts; never persist it as a status enum.
Address writes, operator actions and invoice send use the same order boundary
and are judged by receipt time.

Backfill existing orders from each lot's actual close timestamp, not the order
creation timestamp. If a legacy order has no reliable close time, stop the
migration with a repair report rather than guessing a deadline.

## Boundaries

- `packages/grade10-auction/backend/src/db/schema/auctionOrders.ts` stores
  `address_deadline_at`, reopen metadata and the append-only address audit
  facts.
- `packages/grade10-auction/backend/src/services/auctions/auctionOrders.ts`
  owns the persisted order facts and the address-window transition.
- `packages/grade10-auction/backend/src/services/orderStatus.ts` derives the
  order status from current facts, reading `address_deadline_passed`, and
  `address_window_open` as a write gate outside that derivation; operator
  actions never write a status directly.
- `packages/grade10-auction/backend/src/rpc/AuctionService.ts` exposes the
  winner-facing deadline/refusal facts and applies receipt-time validation.
- `packages/grade10-auction/backend/src/services/admin/postSale.ts`, its
  repository and router own expired-invoice settlement. The operator's reopen
  and reasoned phone-recorded setup are `complete-auction-post-sale`'s
  `reopenSetup` and `recordSetup`, which this change's deadline serves.
- `packages/grade10-auction/backend/src/services/auctions/winnerInvoice.ts`
  retires the address window at invoice send. Refusing a payment received at or
  after the deadline and holding the invoice `pending` while an in-time payment
  is in flight are new.
- Order-status and Winner Order contracts expose the deadline, refusal and
  operator-contact facts; no winner-facing reopen mutation is added.

`complete-auction-post-sale` owns the operator actions: reopen requires the
existing operator grant, a reason, an unconfirmed Setup Overdue order and no
sent invoice, and each reopen gets a fresh 48-hour deadline and an invoice-log
entry carrying the named actor, timestamp and reason. A phone-recorded setup
gets a matching address-recorded entry. Here the reopen only resets the
persisted `address_deadline_at`. The same transaction boundary prevents a late
winner write, operator recording, reopen, or invoice send from racing into an
inconsistent address snapshot.

An unconfirmed order derives Setup Overdue from `address_deadline_passed`;
an operator reopen restores Awaiting Setup from its new deadline. Preparing
Invoice never derives Setup Overdue. Its payment Overdue timer and deadline are
created only when invoice send commits and the invoice is visible to the winner;
before then the invoice remains `not_issued` and no payment timer exists.
