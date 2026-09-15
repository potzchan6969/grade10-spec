## User journeys

### grade10-site-auction-auction-orders-US-01: Winner finds what each won order needs next

**As a** winner
**I want** one list of my auction orders, each with the action it needs
**so that** I confirm addresses and pay invoices without guessing which order is waiting on me.

**Accepted by:**
- `grade10-site-auction-auction-orders-SC-01` — Every won order is listed once
- `grade10-site-auction-auction-orders-SC-02` — Another collector's orders are never listed
- `grade10-site-auction-auction-orders-SC-03` — Orders waiting on the winner come first
- `grade10-site-auction-auction-orders-SC-04` — Newest close first within a band
- `grade10-site-auction-auction-orders-SC-05` — An order awaiting an address offers Confirm address
- `grade10-site-auction-auction-orders-SC-06` — An unpaid order offers Pay Invoice
- `grade10-site-auction-auction-orders-SC-07` — An expired invoice still offers Pay Invoice
- `grade10-site-auction-auction-orders-SC-08` — Other statuses offer View detail
- `grade10-site-auction-auction-orders-SC-09` — View lot opens the listing
- `grade10-site-auction-auction-orders-SC-10` — An empty list points to My Auctions
- `grade10-site-auction-auction-orders-SC-11` — A failed read is not an empty list
