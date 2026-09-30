# Technical design

## Overview

The point of this design is to keep countdown, public status, and extended
close aligned across browsers and machines on the same auction. Postgres stays
the only store of bids and the recorded close. Live Durable Objects relay
public snapshots after a write so every open page sees the same hammer and
restarted close. Every open page counts down from the auction service clock.

```
Browser auction / catalogue
  |  GET /api/public/time  (offset; re-probe on sleep / reconnect / focus)
  |  WS  /api/public/live/listing   → ListingLive DO
  |  WS  /api/public/live/catalogue → CatalogueLive DO
  v
Auction worker
  placeBid / close  →  Postgres (row lock)  →  announceListing → DO.refresh
                                                      │
                                                      v
                                              re-read publicState
                                              broadcast + re-arm alarm
```

Sequence diagram (bid path, close path, catalogue fan-out):

![How our live auction relays a change](assets/live-relay.svg)

## Modules

| Piece | Role |
| --- | --- |
| `ListingLive` DO | One room per open auction; hibernating sockets; alarm at recorded close |
| `CatalogueLive` DO | One hub; card summaries (id, close, top, next minimum) |
| `services/live/relay.ts` | `readLiveListing`, `announceListing`, `settleLiveListing`, `maybeSettleOverdueListing` |
| `contracts` `externalStatus` | `upcoming` \| `active` \| `closing` \| `ended` |
| Frontend `MeasuredClock` / `WebSocketAuctionLive` | Clock offset + live apply; Closing mapping in `listingUi` |
| Account record | `topAmountMinor` on bidding rows |

## Closing and settle

1. At the recorded close, public reads report **Closing** while status is still
   published.
2. ListingLive alarm runs `settleLiveListing` (same close path as cron for one
   auction).
3. A public read more than **2s** past `endsAt` may call
   `maybeSettleOverdueListing` (best effort; skips if the row is locked).
4. Cron every five minutes remains the net under a missed alarm.

Pages never treat Closing as Ended from the local clock alone. After settle,
won/lost badges use recorded standing plus winner identity (leading that won →
Auction won; stale leading that lost → Did not win).

## Equal maxima and extension

Unchanged auction rules: earlier equal maximum keeps the lead; an accepted bid
in extended bidding restarts the close by the auction's extension duration
(unless the cap holds). The live room only relays the public result.

## My Auctions

Bidding rows expose the auction top (`topAmountMinor`), so Ended shows the
hammer for winners and losers alike.

## Test evidence

- Unit / worker: ListingLive refresh, live routes, listingUi Closing and badges
- Browser: `apps/frontend/grade10/e2e/tests/auction/live-close.spec.ts` —
  multi-bidder equal maxima, live refresh without reload, extension restart,
  auto-close badges, My Auctions auction top
