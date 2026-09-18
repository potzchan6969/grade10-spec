## User journeys

### grade10-site-auction-auction-US-05: Collector reads the catalogue in one order

**As a** collector,
**I want** the catalogue to lead with the lots I can bid on, soonest to close
first, and to keep that order as I read on,
**so that** what I can still bid on is in front of me and reading further never
shows me a lot twice or skips one.
### grade10-site-auction-auction-US-01: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

### grade10-site-auction-auction-US-02: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

**Accepted by:**

- `grade10-site-auction-auction-SC-23` — The default bid path creates no authorization hold

### grade10-site-auction-auction-US-03: Collector's card hold is released when they are outbid

**As a** bidder,
**I want** one authorization per listing, released when I am outbid,
**so that** a delayed lower hold or a duplicate Stripe event cannot take a second bite.
