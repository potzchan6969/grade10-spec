## Goals

- One catalogue tile: the requirement a tile's close follows the viewer's
  zone is carried by the tile the catalogue draws, `AuctionLotCard`
- `AuctionCard` leaves the package and the contract; nothing imports it

## Non-Goals

- No extraction: `AuctionLotCard` stays a preview part; the contract names
  the behaviour, not a package export
- No change to the open-lot countdown the tile already draws
- No change to `formatCollectorDeadline` or any other formatter

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When `AuctionCard` is removed, what happens to the tile deadline rule? | Repoint it to `AuctionLotCard` — the human chose B over retiring the rule | Retire the rule with the block, or re-word it to describe the tile's old `closeLabel` pass-through — a weaker contract than the page can already meet |
| Q2 | How does the tile carry the rule? | It requires `locale` and `timeZone`: an ended lot's close line is `formatCollectorDeadline` in that zone, naming the viewer's zone; an open lot keeps the countdown and reads the same zoned deadline to a screen reader | Draw the static Ends / Opens / Closed line on every tile — a look nobody asked for |
| Q3 | Where do `locale` and `timeZone` come from? | The page and its featured wrappers pass them in, like every other auction surface | Defaulting inside the tile — hides who owns the viewer's clock |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/auction-listing | The countdown `AuctionLotCard` draws names no zone — does an open tile need the zoned line visible, not only read? | Q2 |
