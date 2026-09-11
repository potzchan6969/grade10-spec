## User journeys

### grade10-site-auction-lot-status-US-01: Collector reads where a lot stands

**As a** collector,
**I want** every lot described in one of three words,
**so that** I can tell at a glance whether I can still bid on it.

**Accepted by:**

- `grade10-site-auction-lot-status-SC-01` — A lot whose bidding has not opened is Upcoming
- `grade10-site-auction-lot-status-SC-02` — A lot open for bidding is Active
- `grade10-site-auction-lot-status-SC-03` — A lot in extended bidding is Active
- `grade10-site-auction-lot-status-SC-04` — A won lot is Ended whatever its order's state
- `grade10-site-auction-lot-status-SC-05` — A winner reads their order apart from the lot
- `grade10-site-auction-lot-status-SC-10` — A consumer reads the collector status

### grade10-site-auction-lot-status-US-02: Collector meets only lots that sold or can sell

**As a** collector,
**I want** lots that never opened, did not sell, or were called off kept out of my way,
**so that** I do not spend time on a lot nobody can buy.

**Accepted by:**

- `grade10-site-auction-lot-status-SC-06` — A draft or unsold lot is not in the catalogue
- `grade10-site-auction-lot-status-SC-07` — A called-off lot leaves the catalogue
- `grade10-site-auction-lot-status-SC-08` — A hidden lot leaves the watched list
- `grade10-site-auction-lot-status-SC-11` — A listing read returns no hidden lot

### grade10-site-auction-lot-status-US-03: Bidder reads what became of a called-off lot

**As a** bidder,
**I want** a lot I bid on that was called off to stay in my own record,
**so that** I can see my card hold was released.

**Accepted by:**

- `grade10-site-auction-lot-status-SC-09` — A bidder still reads a called-off lot
