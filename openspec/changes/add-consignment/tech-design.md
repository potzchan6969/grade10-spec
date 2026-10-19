## Context

The consignment service is built: `packages/consignment/{contracts,backend,admin-frontend,frontend}`,
worker `apps/backend/grade10/consignment`, never deployed, holding no rows.
This change reconciles it with the decided rows of [decisions.md](decisions.md)
and records the requirements it now meets. Motivation is in
[proposal.md](proposal.md).

What the build already did that the decisions ask:

- **Q3 Seen before it lists** - the consignor's read (`reads/mine.ts`) shows
  every item from `received`, an auction-bound one included.
- **Q11 Checked before it lists** - `items.receive` registers the item in
  inventory after it is identified, checked, photographed and labelled, and
  `items.list` refuses `NOT_RECEIVED`.
- **Q6 The Grade10 account** - every person consignor is opened under a
  directory account, and the register names that account as owner; someone
  with none is added in People first.

## Decisions

- **Where it was taken** - `ORIGINS` is `counter | event`; the request asked
  online, which the build carried as an origin, goes, since only staff open a
  consignment. `consignments.event_name` names the event; a check holds
  `(origin = 'event') = (event_name IS NOT NULL)`. `site_id` stays the shop the
  items are received into, as inventory's intake needs one.
- **The channel at intake** - `openInputSchema.channel` is required and each
  item takes it; an item added later takes the channel already on the
  consignment.
- **Who in law** - `consignor_entity` (`individual | company`) and
  `registered_office`, held together by a check. Partners keep their deal.
- **Graded only and the market value** - `askedItemSchema` requires `slab`
  and `marketValue`; `consignment_items.market_value` holds it.
- **The incentive** - `incentivePercent` joins the schedule, unset by default,
  pinned with the rest and refused unset by `scheduleProblem`. `incentiveOf`
  rounds market value times the rate to the minor unit. The incentive is
  derived, never stored as owed: owed from the agreement's seal, paid once in
  `incentive_payments` (one row per consignment, its bank or till reference
  unique across payouts and incentives). `payouts.recordIncentive` sits under
  `consignment:payout`; the due list carries `incentives` beside its rows and
  never nets them.
- **Logged in Shopify at the form** - the agreement's seal owes the store
  channel a sync for each received store item. A key with no live listing is
  sent `live: false` with its photographs, and the store creates the product
  as a draft; listing publishes the same product. Auction items wait for their
  lot.
- **A return's parcel** - `item_returns.carrier` and `tracking`, only on a
  shipped return, written by `items.recordTracking`.
- **The consignor's read** - each item reads its market value, the commission
  rate and the estimated net at the agreed price under the pinned terms or the
  schedule in force (`atListOf`), and the days left on a running term
  (`daysLeftOn`).

## Migration Plan

`0005_consignment_terms_of_intake.sql` in the consignment worker: the new
table, columns and checks. Nothing is deployed, so the `NOT NULL` column and
the validating checks carry `contract:` and `lock:` notes.

## Risks / Trade-offs

- **A draft product for a vault-held item** - a key held off the channel by a
  vault case is still logged as a draft; it is unpublished, so no buyer sees it.
- **The sale's paper is not built** - the settlement statement and the
  commission invoice a sale issues wait on the invoice and receipt PDF blocks
  (`add-invoice-and-receipt-pdf-blocks`); the payout statement stands until
  then.
