## User journeys

### grade10-site-auction-auction-US-01: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

### grade10-site-auction-auction-US-02: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a valid bid accepted without requiring a bid-time authorization in
the standard configuration,
**so that** a card hold does not block me from competing.

**Accepted by:**

- `grade10-site-auction-auction-SC-23` — The default bid path creates no authorization hold

### grade10-site-auction-auction-US-03: Collector's card hold is released when they are outbid

**As a** bidder,
**I want** one authorization per listing, released when I am outbid,
**so that** a delayed lower hold or a duplicate Stripe event cannot take a second bite.
