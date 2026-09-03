## User journeys

### auction-US-01: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

**Accepted by:**

- `auction-SC-01` — A collector browses Auction listings
- `auction-SC-02` — A closed listing is absolute
- `auction-SC-03` — Money facts use minor units and currency
- `auction-SC-13` — A consumer reads a listing contract

### auction-US-02: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a bid accepted only when it meets the increment inside the scheduled window,
**so that** a late valid bid can extend the close without passing the cap.

**Accepted by:**

- `auction-SC-04` — A bid must meet the next increment
- `auction-SC-05` — A bid outside the window is refused
- `auction-SC-06` — A late valid bid extends the close
- `auction-SC-07` — An extension cap limits an otherwise eligible extension
- `auction-SC-07a` — Window and duration may differ
- `auction-SC-07b` — Extension off does not move the close
- `auction-SC-08` — A bidder sees live bid facts

### auction-US-03: Collector's card hold is released when they are outbid

**As a** bidder,
**I want** one authorization per listing, released when I am outbid,
**so that** a delayed lower hold or a duplicate Stripe event cannot take a second bite.

**Accepted by:**

- `auction-SC-09` — An outbid authorization is released
- `auction-SC-10` — Concurrent bids keep the highest valid outcome
- `auction-SC-11` — A delayed lower authorization cannot land
- `auction-SC-12` — An invalid or duplicate Stripe event changes nothing twice
- `auction-SC-14` — Stripe configuration is incomplete
- `auction-SC-15` — A missed authorization webhook is repaired
