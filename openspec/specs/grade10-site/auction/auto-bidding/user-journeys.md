## User journeys

### grade10-site-auction-auto-bidding-US-01: Collector commits a maximum on an open listing

**As a** collector,
**I want** to commit the most I will pay and raise it later,
**so that** Grade10 bids for me only as far as needed to lead.

**Accepted by:**

- `grade10-site-auction-auto-bidding-SC-01` — A first maximum opens the bidding
- `grade10-site-auction-auto-bidding-SC-02` — A maximum below the minimum next bid is refused
- `grade10-site-auction-auto-bidding-SC-03` — A leader raises their own maximum
- `grade10-site-auction-auto-bidding-SC-04` — Lowering a maximum is refused

### grade10-site-auction-auto-bidding-US-02: Collector reads their own maximum and standing

**As a** collector,
**I want** to see my own maximum, the current bid, and whether I lead,
**so that** I know where I stand without my cap being shown to anyone else.

**Accepted by:**

- `grade10-site-auction-auto-bidding-SC-05` — A bidder reads their own commitment
- `grade10-site-auction-auto-bidding-SC-06` — An overtaken bidder sees that they no longer lead
- `grade10-site-auction-auto-bidding-SC-07` — A leader's maximum is not public
- `grade10-site-auction-auto-bidding-SC-18` — A tie is not a refusal

### grade10-site-auction-auto-bidding-US-03: Collector competes through two maxima

**As a** collector,
**I want** the current bid to come from the two highest maxima,
**so that** I take the lead only when my maximum is higher, and a tie stays
with whoever committed first.

**Accepted by:**

- `grade10-site-auction-auto-bidding-SC-09` — A challenger below the leader's maximum raises the price only
- `grade10-site-auction-auto-bidding-SC-10` — A challenger raises again, still below
- `grade10-site-auction-auto-bidding-SC-11` — A challenger above the leader's maximum takes the lead
- `grade10-site-auction-auto-bidding-SC-12` — The first bidder is overtaken by a higher maximum
- `grade10-site-auction-auto-bidding-SC-13` — The overtaken bidder raises but stays below
- `grade10-site-auction-auto-bidding-SC-14` — The overtaken bidder raises past the leader
- `grade10-site-auction-auto-bidding-SC-15` — The step to lead cannot exceed the new leader's maximum
- `grade10-site-auction-auto-bidding-SC-16` — A challenge lands at the two-maximum price, not a ladder
- `grade10-site-auction-auto-bidding-SC-17` — A tie goes to the earlier commitment

### grade10-site-auction-auto-bidding-US-04: Operator traces every committed maximum

**As an** operator,
**I want** to read every committed maximum and when it was accepted,
**so that** I can answer a dispute about who committed what.

**Accepted by:**

- `grade10-site-auction-auto-bidding-SC-08` — An operator can answer a dispute

### grade10-site-auction-auto-bidding-US-05: Collector's auto-bid counts as a bid

**As a** collector,
**I want** the hold to cover my maximum and every bid Grade10 places for me to
count as a bid,
**so that** I am authorized once and still extend the close when I auto-bid in
the window.

**Accepted by:**

- `grade10-site-auction-auto-bidding-SC-19` — The hold is the maximum, not the price
- `grade10-site-auction-auto-bidding-SC-20` — A raise that cannot be authorized changes nothing
- `grade10-site-auction-auto-bidding-SC-21` — An auto-bid step needs no new card check
- `grade10-site-auction-auto-bidding-SC-22` — An auto bid in the extension window extends once
- `grade10-site-auction-auto-bidding-SC-23` — An auto bid is counted and recorded
- `grade10-site-auction-auto-bidding-SC-24` — Standing maxima do not keep bidding
