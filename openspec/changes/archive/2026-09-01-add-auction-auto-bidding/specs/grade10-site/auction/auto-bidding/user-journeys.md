## User journeys

### grade10-site-auction-auto-bidding-US-01: Bidder commits a maximum before leaving the page

**As a** bidder,
**I want** to commit the most I will pay and have Grade10 bid for me only
as far as needed to lead,
**so that** I can close the tab and still compete.

**Accepted by:**

- `grade10-site-auction-auto-bidding-SC-01` — A first maximum opens the bidding
- `grade10-site-auction-auto-bidding-SC-02` — A maximum below the minimum next bid is refused
- `grade10-site-auction-auto-bidding-SC-09` — A challenger below the leader's maximum raises the price only
- `grade10-site-auction-auto-bidding-SC-11` — A challenger above the leader's maximum takes the lead
- `grade10-site-auction-auto-bidding-SC-12` — The first bidder is overtaken by a higher maximum
- `grade10-site-auction-auto-bidding-SC-15` — The step to lead cannot exceed the new leader's maximum
- `grade10-site-auction-auto-bidding-SC-16` — A challenge lands at the two-maximum price, not a ladder
- `grade10-site-auction-auto-bidding-SC-19` — The hold is the maximum, not the price
- `grade10-site-auction-auto-bidding-SC-21` — An auto-bid step needs no new card check
- `grade10-site-auction-auto-bidding-SC-22` — An auto bid in the extension window extends once
- `grade10-site-auction-auto-bidding-SC-23` — An auto bid is counted and recorded
- `grade10-site-auction-auto-bidding-SC-24` — Standing maxima do not keep bidding

### grade10-site-auction-auto-bidding-US-02: Bidder raises a standing maximum

**As a** bidder,
**I want** to raise the most I will pay on an open listing,
**so that** I can compete again after being overtaken, without being able
to take a commitment back.

**Accepted by:**

- `grade10-site-auction-auto-bidding-SC-03` — A leader raises their own maximum
- `grade10-site-auction-auto-bidding-SC-04` — Lowering a maximum is refused
- `grade10-site-auction-auto-bidding-SC-10` — A challenger raises again, still below
- `grade10-site-auction-auto-bidding-SC-13` — The overtaken bidder raises but stays below
- `grade10-site-auction-auto-bidding-SC-14` — The overtaken bidder raises past the leader
- `grade10-site-auction-auto-bidding-SC-20` — A raise that cannot be authorized changes nothing

### grade10-site-auction-auto-bidding-US-03: Bidder checks their own standing

**As a** bidder,
**I want** to see my own maximum and whether I lead, as facts apart from
the current bid,
**so that** I know where I stand without other bidders learning my cap.

**Accepted by:**

- `grade10-site-auction-auto-bidding-SC-05` — A bidder reads their own commitment
- `grade10-site-auction-auto-bidding-SC-06` — An overtaken bidder sees that they no longer lead
- `grade10-site-auction-auto-bidding-SC-07` — A leader's maximum is not public
- `grade10-site-auction-auto-bidding-SC-17` — A tie goes to the earlier commitment
- `grade10-site-auction-auto-bidding-SC-18` — A tie is not a refusal

### grade10-site-auction-auto-bidding-US-04: Operator traces who committed what

**As an** auction operator,
**I want** to read each commitment's bidder, maximum, and Accepted At,
**so that** I can answer a dispute about who led and at what cap.

**Accepted by:**

- `grade10-site-auction-auto-bidding-SC-08` — An operator can answer a dispute
- `grade10-site-auction-auto-bidding-SC-23` — An auto bid is counted and recorded
