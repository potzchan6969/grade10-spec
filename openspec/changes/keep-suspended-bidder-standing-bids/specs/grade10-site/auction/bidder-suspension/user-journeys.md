## User journeys

### suspension-US-01: Collector who misses a deadline loses their auction standing

**As a** collector who let a payment deadline pass,
**I want** to be told plainly that I can no longer bid, what I still owe, and
how to resolve it,
**so that** I understand what I can still do and what it takes to bid again.

**Accepted by:**

- `suspension-SC-01` — An elapsed deadline suspends the account
- `suspension-SC-03` — A suspended account can still pay what it owes
- `suspension-SC-16` — A lot already won stays won
- `suspension-SC-12` — A suspended account cannot bid or raise its maximum
- `suspension-SC-09` — Paying does not lift the suspension

### suspension-US-02: Bidder competes on a lot whose leader is suspended

**As a** bidder on a lot led by an account that is then suspended,
**I want** the lot's price, leader and bid history to stay as they were,
**so that** the bids I placed against that account still count as I made them.

**Accepted by:**

- `suspension-SC-13` — Suspension leaves open lots and their history unchanged
- `suspension-SC-14` — A standing maximum keeps bidding after suspension
- `suspension-SC-15` — A suspended account wins through a standing maximum

### suspension-US-03: Collector suspended by an operator learns they can no longer bid

**As a** collector an operator has suspended from auctions,
**I want** to be told plainly that I can no longer bid and how to contact Grade10,
**so that** I know where I stand without being refused on a lot first.

**Accepted by:**

- `suspension-SC-20` — The collector is told without the operator's reason
- `suspension-SC-21` — A missed deadline on a suspended account adds a cause
