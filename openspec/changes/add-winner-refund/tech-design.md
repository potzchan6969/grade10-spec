## Shape

Add an append-only refund record keyed by auction order. Refunds are operator
records of money moved outside Grade10; the service validates them against
cumulative payments, writes the terminal order event and fixes the stock
choice in one transaction.

## Boundaries

- `packages/grade10-auction/backend/src/db/schema/auctionOrders.ts` owns
  refund facts and the one-refund constraint.
- `packages/grade10-auction/backend/src/services/auctions/winnerInvoice.ts`
  validates the amount and writes the refund plus invoice log.
- `packages/grade10-auction/backend/src/services/orderStatus.ts` derives
  terminal `Refunded`.
- Auction contracts, the admin post-sale client and Winner Order expose only
  refund facts needed by their surfaces; payment credentials never cross the
  boundary.

The mutation requires `auction:refund`, is idempotent on its request key and
uses the existing audit sequence. It does not call Stripe, create a pending
refund state or add a second refund workflow.
