## User journeys

### grade10-site-auction-bid-increments-US-01: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

**Accepted by:**

- `grade10-site-auction-bid-increments-SC-01` — A first bid clears the starting-price tier
- `grade10-site-auction-bid-increments-SC-02` — A boundary selects the higher tier
- `grade10-site-auction-bid-increments-SC-03` — A bid may exceed the minimum
- `grade10-site-auction-bid-increments-SC-04` — A bid below the minimum is refused
- `grade10-site-auction-bid-increments-SC-05` — An open listing publishes its next minimum

### grade10-site-auction-bid-increments-US-02: Collector bids up to the currency ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

**Accepted by:**

- `grade10-site-auction-bid-increments-SC-08` — A bid at the ceiling is accepted
- `grade10-site-auction-bid-increments-SC-09` — A bid above the ceiling is refused
- `grade10-site-auction-bid-increments-SC-10` — An auto-bid maximum above the ceiling is refused
- `grade10-site-auction-bid-increments-SC-11` — A listing at the ceiling takes no further bid
