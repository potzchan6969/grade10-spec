## Shape

Keep overdue outcomes derived from the authoritative address deadline and
invoice status. Do not add a second persisted status enum. Extend the shared
order-status projection and pass the resulting labels through the account,
Winner Order and post-sale queue contracts.

## Boundaries

- `packages/grade10-auction/backend/src/services/orderStatus.ts` derives
  Setup Overdue and Payment Overdue.
- `packages/grade10-auction/backend/src/services/admin/postSale.ts` maps
  those outcomes into queue filters while preserving winner and action facts.
- Auction contracts own the closed vocabulary; `auction-frontend` and
  `auction-admin-frontend` render the labels and remove Confirm or Pay as
  appropriate.
- The shared auction-record component receives Status copy from its caller and
  does not infer order state.

The existing deadline writers remain owned by the address-confirmation and
invoice changes. This change only projects outcomes and renames the mixed My
Auctions column.
