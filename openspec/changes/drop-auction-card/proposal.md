# Drop AuctionCard — repoint the catalogue tile deadline at AuctionLotCard

## Why

`shared/ui/auction-listing` still contracts `AuctionCard`, the shared catalogue
tile that required `locale` and `timeZone` and printed a zone-named Ends / Opens
/ Closed line. No page composes it — the real catalogue tile is the preview
part `AuctionLotCard`, which shows a countdown on live and upcoming lots and a
consumer-supplied `closeLabel` on ended lots. The component is dead weight, but
the requirement it carried — a catalogue tile's close follows the viewer's
zone — is product behaviour the PRD already states.

## What Changes

- `AuctionCard`, `AuctionCardProps` and `AuctionCardWhen` leave `@grade10/ui`;
  the block, its story and its test are deleted. Nothing imports them.
- The tile deadline requirement and its scenario are repointed at
  `AuctionLotCard`: the tile requires `locale` and `timeZone`, keeps the
  countdown it draws on open lots, reads the zoned deadline to a screen
  reader, and formats a closed lot's close line with
  `formatCollectorDeadline`, naming the viewer's zone.
- The `dates-and-times` suite cases that rendered `AuctionCard` as the carrier
  surface now name a closed `AuctionLotCard`; the deciding formatter test is
  unchanged.

## Non-Goals

- Extracting `AuctionLotCard` into `packages/ui`. The tile stays a preview
  part; the contract names the behaviour it must keep, not a package export.
- Retiring the zone-naming rule. The rule moves carriers; it does not weaken.
- Any open-lot visual change beyond the accessible deadline already described.

## Capabilities

### Modified Capabilities

- `shared/ui/auction-listing` — the tile deadline requirement and SC-55 name
  `AuctionLotCard`
- `shared/dates-and-times` — suite only; three cases repoint their rendered
  surface, no requirement moves

## Impact

- `packages/ui` — **BREAKING**: `AuctionCard` leaves the public barrel.
  No known consumer.
- `apps/preview` — `AuctionLotCard`, `FeaturedAuctions` and
  `FeaturedAuctionsPair` require `locale` and `timeZone`; every call site in
  the catalogue page, the all-auctions grid and the stories passes them.

## References

- [Auction Listing · Bid History](../../../docs/prds/products/shared/ui/auction-listing.md#bid-history)

Author: @tangconst
