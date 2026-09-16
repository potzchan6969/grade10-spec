## User journeys

### grade10-site-auction-auction-US-01: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

**Accepted by:**

- `grade10-site-auction-auction-SC-01` — A collector browses Auction listings
- `grade10-site-auction-auction-SC-02` — A closed listing is absolute
- `grade10-site-auction-auction-SC-03` — Money facts use minor units and currency
- `grade10-site-auction-auction-SC-13` — A consumer reads a listing contract

### grade10-site-auction-auction-US-02: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

**Accepted by:**

- `grade10-site-auction-auction-SC-04` — A bid must meet the next increment
- `grade10-site-auction-auction-SC-05` — A bid outside the window is refused
- `grade10-site-auction-auction-SC-06` — A late valid bid extends the close
- `grade10-site-auction-auction-SC-07` — An extension cap limits an otherwise eligible extension
- `grade10-site-auction-auction-SC-07a` — Window and duration may differ
- `grade10-site-auction-auction-SC-07b` — Extension off does not move the close
- `grade10-site-auction-auction-SC-08` — A bidder sees live bid facts
- `grade10-site-auction-auction-SC-19` — A listing with no bid closes at its scheduled close
- `grade10-site-auction-auction-SC-20` — One bid is enough to enter extended bidding
- `grade10-site-auction-auction-SC-21` — A bid before the scheduled close does not move the close
- `grade10-site-auction-auction-SC-22` — A bid at the scheduled close counts toward entry
- `grade10-site-auction-auction-SC-23` — Each listing runs its own extended bidding
- `grade10-site-auction-auction-SC-24` — A new bidder may bid during extended bidding
