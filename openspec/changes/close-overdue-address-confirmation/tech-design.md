## Shape

Persist the address deadline on the auction order when the order is created or
reopened. Treat the deadline as an order fact, not a live calculation, so
configuration changes cannot move existing orders. Address writes and invoice
send both take the order lock and are judged by receipt time.

## Boundaries

- `packages/grade10-auction/backend/src/db/schema/auctionOrders.ts` stores
  the address deadline and reopen metadata.
- `packages/grade10-auction/backend/src/services/admin/postSale.ts` owns
  reopen, reasoned address recording and expired-invoice settlement.
- `packages/grade10-auction/backend/src/services/auctions/winnerInvoice.ts`
  retires the address deadline at invoice send and preserves payment-at-
  deadline semantics.
- Order-status and Winner Order contracts expose the deadline, refusal and
  operator-contact facts; no winner-facing reopen mutation is added.

Reopen requires the existing operator grant, a reason and a non-terminal order;
each reopen gets a fresh 48-hour deadline and an audit entry. The same
transaction boundary prevents a late winner write from racing an operator
reopen or invoice send.
