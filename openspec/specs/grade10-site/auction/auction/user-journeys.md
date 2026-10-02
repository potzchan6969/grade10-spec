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

### grade10-site-auction-auction-US-04: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a lot,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** my card is not held for a bid the auction cannot take, and I can verify and bid again before the lot closes.

### grade10-site-auction-auction-US-11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a lot to stop taking bids at its close for everyone, and a bid to count only once its payment confirms before then,
**so that** nobody wins with a bid that arrived after the close, and a card hold for a bid that did not count is released.

### grade10-site-auction-auction-US-12: Bidder keeps a lot open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the lot's price,
**so that** a leader cannot keep a lot open by raising their own maximum.
