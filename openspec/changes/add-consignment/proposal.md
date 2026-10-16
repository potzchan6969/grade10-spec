**Author:** @tangconst - 2026-10-16

## Why

A collector who wants the shop to sell a card for them has no way in: the
store sells only what the house owns, and the auction lists only house
stock. The consignment PRD is written and mostly decided; nothing of it is
recorded as a contract yet, so the capability cannot be built or extended
against specs.

**Metric:** items consigned; the share sold within the term; days on sale;
payouts made on their due day. All zero today, because nothing can hold a
consignment.

## What Changes

- **A consignor hands collectables in, in one visit** - at the shop's
  counter or at an event such as a card show. Staff record where the
  consignment was taken and its channel - the store or the auction -
  register each item's market value and the consignment rates applying to
  it, and record whether the consignor has a Grade10 account to link. A
  consignor may be an individual or a company, a company registering its
  own facts.
- **Terms agreed, then signed** - a list price and floor per item, the
  floor alone at auction, with the commission, incentive, fees and term
  pinned from the schedule when the agreement is prepared. The consignment
  agreement is signed electronically and names where the consignment was
  taken, the consignor's information and the linked account.
- **Paid to consign, paid when it sells** - the consignor is paid the
  incentive instantly at consignment; on a sale they receive the settlement
  statement and the commission invoice and, after the return window, the
  payout.
- **On sale by itself** - each item is logged in Shopify when the
  consignment form is completed and becomes one store product, or a draft
  lot staff place at auction; the store and the auction report each sale,
  delivery and refund, and the first sale wins.
- **The consignor watches and hears** - a signed-in consignor reads each
  consignment, its items' statuses - an auction-bound one before its lot
  lists - prices, sales, payouts and documents, and hears each event by
  email in their language.
- **Staff run one queue** - the Consignment console cuts the queue by what
  each consignment waits for, offers each act on a consignment's page with
  its rule stated first, raises a flag on anything out of step, pays out
  from the due list, and holds every figure as a setting behind grants.
- **Unsold ends, a return is tracked** - at term's end the consignor picks
  extend, reprice, the other channel, the vault, or collect or ship it
  back; a return travels under its tracking and closes on a signed return
  receipt.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities
- `grade10-site/consignment/lifecycle`: the consignment - intake at the
  counter or an event, the channel and each item's registration, the terms
  and the agreement, on sale, the sale coming back, ending and the return
- `grade10-site/consignment/documents`: the signed packet - the consignment
  agreement, the intake receipt and the return receipt - signed
  electronically on the documents service
- `grade10-site/consignment/payout`: the incentive at consignment, the
  commission and fees pinned to the agreement, the settlement statement and
  commission invoice a sale issues, the payout and its refunds
- `grade10-site/consignment/consignor-portal`: the signed-in consignor's
  read of their consignments, including an auction-bound item before its
  lot lists
- `grade10-site/consignment/consignor-notifications`: the message set the
  consignor hears, in their language
- `grade10-admin/consignment/console`: the queue cut by what waits, one
  consignment's page and its acts and flags, the treasurer's payouts, the
  settings and the grants

### Modified Capabilities

None.

## Impact

- The first capabilities under the new `consignment` domain, in
  `grade10-site` and `grade10-admin` alike.
- Consumes contracts that exist or are being written elsewhere: item intake
  and hand-offs under `grade10-admin/inventory` (PRDs written, specs not
  yet), the documents service (doc-sign, PRD written, spec not yet),
  `grade10-site/vault/identity-verification`, store products in Shopify,
  and auction listings under `grade10-admin/auction/listing`.
- The commission invoice composes the invoice and receipt PDF work in
  flight under `add-invoice-and-receipt-pdf-blocks`.
- No consuming code exists yet: implementation lands in `grade10` after the
  contract is accepted.

## References

- [Consignment · Values](../../../docs/prds/products/grade10-site/consignment/index.md#values)
- [Consignment · One Consignment](../../../docs/prds/products/grade10-site/consignment/index.md#one-consignment)
- [Consignment · Commission and Payout](../../../docs/prds/products/grade10-site/consignment/index.md#commission-and-payout)
- [Consignment · When It Ends](../../../docs/prds/products/grade10-site/consignment/index.md#when-it-ends)
- [Consignment · Identity](../../../docs/prds/products/grade10-site/consignment/index.md#identity)
- [Consignment Console · One Consignment](../../../docs/prds/products/grade10-site/consignment/operator-console.md#one-consignment)
- [Consignment Console · Settings](../../../docs/prds/products/grade10-site/consignment/operator-console.md#settings)

## Follow-on changes

- A consignor's own pages on the site, drawn by the designers
- Asking online - a request page a consignor opens themselves
