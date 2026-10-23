# Tech Design

## Contract

`AuctionWinnerOrder` needs no contract change: each `receipts` item already
carries `label` and `ariaLabel`, and the row renders the links in the order
the consumer supplies — oldest issued first.

## Consumers

- `apps/preview`'s Winner Order page derives the label from
  `WinnerOrderReceipt` — `Receipt #<id> (<issuedOn>)`, or `Receipt` when
  the record has no `id` — and passes `ariaLabel` as `<label> PDF`.
- `grade10`'s Winner Order page supplies the same strings from its receipt
  records.

## Verification

The Payment stories' `Partially Paid` play asserts the two links' names in
order; `tsc -b` and the post-bidding story suite hold the rest.
