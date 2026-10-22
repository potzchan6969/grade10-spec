**Author:** @tangconst - 2026-10-22

> The Winner Order receipt link names the receipt it opens — `Receipt
> #RC-LK7P2Q01P1 (22 Sep 2026)`. Several receipts keep oldest issued first;
> a record carrying no ID reads `Receipt`.

## Why

The row labels its links `Receipt · P1`, `Receipt · P2` — ordinals that
match nothing outside the row. The receipt PDF itself carries
`RC-LK7P2Q01P1`, and the ready email for a partially paid order lists
receipt IDs for support to work from. A winner asking about a payment
needs the label to match the document it opens and the ID a letter quotes.
The issue date adds the when to the what.

## What Changes

- **The link names the receipt** — `Receipt #<receipt ID> (<issue date>)`;
  the ID keeps its `RC-` prefix so it matches the PDF and Grade10's letters
  character for character.
- **An unnamed record degrades plainly** — a receipt with no recorded ID
  reads `Receipt`.
- **Order keeps oldest first** — the existing rule holds; the label change
  does not touch it.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — the receipt link's label names the
  receipt ID and issue date, and a record without an ID reads `Receipt`.

## Impact

- `packages/ui` `AuctionWinnerOrder` needs no contract change: the label
  and accessible name ride the receipt item's existing `label` /
  `ariaLabel`.
- `grade10` supplies each receipt's label and accessible name —
  `Receipt #<id> (<issued>)` / `… PDF` — oldest issued first.
  `apps/preview` models the same: `WinnerOrderReceipt` carries `id`,
  `issuedOn` and `fileName` in place of a hardcoded label.

## References

- [Post-Bidding · Receipts](../../../docs/prds/products/grade10-site/auction/post-bidding.md#receipt-documents)
