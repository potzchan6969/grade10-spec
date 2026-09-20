## Shape

Keep auction payment facts in the auction service and derive the public order
status from those facts. Add an append-only payment collection table keyed by
`auctionOrderId`; keep the invoice total and the cumulative payment total
separate so an operator can reconcile every payment without mutating the
original quote.

## Boundaries

- `packages/grade10-auction/backend/src/db/schema/auctionOrders.ts` owns the
  payment rows, receipt number, method, reference, proof metadata and actor.
- `packages/grade10-auction/backend/src/services/auctions/winnerInvoice.ts`
  owns balance, tolerance and idempotent payment recording.
- `packages/grade10-auction/backend/src/services/orderStatus.ts` derives
  `Partially Paid` and suppresses self-service actions.
- Auction contracts expose the payment history and remaining balance; the
  admin client owns the collection prompt and the winner client renders the
  locked record.

Payment recording runs in one transaction with a per-order lock, rejects an
amount above the current balance unless the explicit tolerance choice closes
the invoice, and is idempotent on the operator mutation key. Receipt numbers
come from the existing audit sequence. No Stripe capture or refund is added.
