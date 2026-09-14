## User journeys

### grade10-site-auction-lot-status-US-01: Collector sees whether a lot can still be bid on

**As a** collector,
**I want** every lot to show whether it is Upcoming, Active or Ended,
**so that** I can see at a glance whether I can still bid on it.

**Accepted by:**

- `grade10-site-auction-lot-status-SC-01` — A lot whose bidding has not started is Upcoming
- `grade10-site-auction-lot-status-SC-02` — A lot open for bidding is Active
- `grade10-site-auction-lot-status-SC-03` — A lot in extended bidding is Active
- `grade10-site-auction-lot-status-SC-04` — A lot with a winner is Ended whatever state its order is in
- `grade10-site-auction-lot-status-SC-12` — A lot that ended with no winner is Ended
- `grade10-site-auction-lot-status-SC-05` — The winner sees their order status separately
- `grade10-site-auction-lot-status-SC-10` — Listing data includes the external lot status

### grade10-site-auction-lot-status-US-02: Collector does not see draft or called-off lots

**As a** collector,
**I want** lots that were never published or were called off to be hidden from me,
**so that** I do not spend time on a lot that never went to auction.

**Accepted by:**

- `grade10-site-auction-lot-status-SC-06` — A draft lot is not in the catalogue, but an unsold lot is
- `grade10-site-auction-lot-status-SC-07` — A called-off lot is removed from the catalogue
- `grade10-site-auction-lot-status-SC-08` — A called-off lot is removed from the watchlist
- `grade10-site-auction-lot-status-SC-11` — Listing data leaves out called-off lots

### grade10-site-auction-lot-status-US-03: Bidder sees what happened to a called-off lot

**As a** bidder,
**I want** a called-off lot I bid on to stay in My Auctions,
**so that** I can see my card hold was released.

**Accepted by:**

- `grade10-site-auction-lot-status-SC-09` — A bidder still sees a called-off lot
