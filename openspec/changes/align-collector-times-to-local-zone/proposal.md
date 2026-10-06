**Author:** @tangconst - 2026-10-06

Product context: [Dates and Times](../../../docs/prds/platform/shared/dates-and-times.md), [Invoice and Receipt PDF Blocks](../../../docs/prds/products/shared/ui/invoice-and-receipt-pdf.md), [Listing Page Blocks](../../../docs/prds/products/shared/ui/auction-listing.md#bid-history).

## Why

Collector surfaces mix UTC suffixes, hardcoded HKT, and viewer-local clocks.
A deadline that reads HKT on My Auctions and UTC on a catalogue tile is two
times for one instant. Documents that print `HKT` disagree with mail that
already prints `GMT+8`.

**Metric:** Storybook collector deadlines use the supplied viewer zone and
name that zone (`HKT`, `EDT`); invoice and receipt PDF dates end in `GMT+8`
(target: 100% of the surfaces this change names).

## What Changes

- **BREAKING — collector clocks** — in-app dates use the viewer's local
  zone. A named zone on those surfaces is the viewer's short name, so a Hong
  Kong reader still sees HKT and a New York reader sees EDT.
- **BREAKING — documents** — invoices, receipts, T&C, and emails state
  Asia/Hong_Kong as **GMT+8**, never HKT.
- Shared listing tiles and collector fixtures format from instants with
  `timeZone`, matching the lot bid card.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/dates-and-times` — collector local zone; documents labelled GMT+8.
- `shared/ui/invoice-and-receipt-pdf` — PDF dates end in GMT+8.
- `shared/ui/auction-listing` — catalogue tile close lines take `timeZone`.

## Impact

- `@grade10/ui` formatters, AuctionCard, PDF `formatDateTime`, Storybook
  fixtures and play asserts.
- Emails already print GMT+8; no template change.
- Consuming apps keep passing the viewer's `timeZone`; catalogue tiles that
  called `formatListingEnds` without a zone must pass one.

## Open Questions

None.

**Archive:** @tangconst after deploy.

## References

- [Dates and Times](../../../docs/prds/platform/shared/dates-and-times.md)
- [Invoice and Receipt PDF Blocks](../../../docs/prds/products/shared/ui/invoice-and-receipt-pdf.md)
- [Listing Page Blocks · Bid History](../../../docs/prds/products/shared/ui/auction-listing.md#bid-history)
