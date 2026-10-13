## Shape

Keep cancellation as a terminal auction-order transition with a required
reason category and note. Store the consequence snapshot - the consequences
the dialog showed when the operator confirmed, kept as an audit of what they
were told - and the lot link in the existing order history. A payment received after the transition is an
append-only late-payment event; it never reopens the order.

## Boundaries

- `packages/grade10-auction/backend/src/db/schema/auctionOrders.ts` stores
  cancellation reason, note, consequence facts and the late-payment flag.
- `packages/grade10-auction/backend/src/services/admin/postSale.ts` owns the
  confirmation, category filter and clear-flag action.
- `packages/grade10-auction/backend/src/services/orderStatus.ts` keeps
  Cancelled terminal and derives the Paid-after-cancel flag separately.
- Winner Order contracts expose only the cancellation date, lot, winning bid
  and Contact Us; the internal reason stays operator-only. Contact Us on a
  cancelled order prefills the `order cancelled` reason (subject
  `Auction lot {lot title}: order cancelled`, status label `Cancelled`, the
  invoice id in the body when one exists) and carries neither category nor note.

Cancellation and late-payment handling are idempotent and serialized per
order. Before the transition, committed money that counts toward the balance
blocks cancellation; money that counts toward nothing remains recorded and does
not block it. Finance returns a late payment outside Grade10; an `auction:payment`
operator clears the flag through a separate mutation with a required reason
and optional return reference that does not change stock or status.
