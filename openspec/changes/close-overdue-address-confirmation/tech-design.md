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
- `packages/grade10-auction/backend/src/services/orderStatus.ts` derives
  `address_window_open` and the order status from current facts; operator
  actions never write a status directly.
- `packages/grade10-auction/backend/src/rpc/AuctionService.ts` exposes the
  winner-facing deadline/refusal facts and applies receipt-time validation.
- `packages/grade10-auction/backend/src/services/admin/postSale.ts`, its
  repository and router own reopen, reasoned phone-address recording and
  expired-invoice settlement.
- `packages/grade10-auction/backend/src/services/auctions/winnerInvoice.ts`
  retires the address window at invoice send and preserves payment-at-deadline
  semantics.
- Order-status and Winner Order contracts expose the deadline, refusal and
  operator-contact facts; no winner-facing reopen mutation is added.

Reopen requires the existing operator grant, a reason and a non-terminal order;
each reopen gets a fresh 48-hour deadline and an invoice-log entry carrying the
named actor, timestamp and reason. Phone-recorded address changes get a matching
address-recorded invoice-log entry with actor, timestamp and reason. The same
transaction boundary prevents a late winner write, operator recording, reopen,
or invoice send from racing into an inconsistent address snapshot.

The queue Overdue mark reads the derived deadline condition for Awaiting Setup
only. Preparing Invoice has no queue Overdue mark. Its payment Overdue timer and
deadline are created only when invoice send commits and the invoice is visible
to the winner; before then the invoice remains `not_issued` and no payment timer
exists.
