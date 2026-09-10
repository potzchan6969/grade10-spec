## User journeys

### grade10-site-auction-account-record-US-01: Collector bookmarks a listing and finds it on My Auctions

**As a** collector
**I want** to watch listings before I bid, and see every bookmark on one My Auctions table
**so that** I can return to them without searching the catalogue again.

**Accepted by:**
- `grade10-site-auction-account-record-SC-01` — A collector watches from a listing's page
- `grade10-site-auction-account-record-SC-02` — A collector watches from the catalogue
- `grade10-site-auction-account-record-SC-03` — Unwatching can be undone
- `grade10-site-auction-account-record-SC-05` — A watch is private
- `grade10-site-auction-account-record-SC-06` — The watch maximum refuses a further watch
- `grade10-site-auction-account-record-SC-07` — An unpublished listing stays on the page
- `grade10-site-auction-account-record-SC-08` — A scheduled listing says when it opens
- `grade10-site-auction-account-record-SC-11` — The next close is first
- `grade10-site-auction-account-record-SC-32` — An empty Watching page offers the catalogue
- `grade10-site-auction-account-record-SC-40` — A closed published listing stays on My Auctions
- `grade10-site-auction-account-record-SC-41` — The title badge matches the row count
- `grade10-site-auction-account-record-SC-43` — Watch-only can be unwatched

### grade10-site-auction-account-record-US-02: Collector sees standing across every lot they bid on

**As a** bidder
**I want** one table that puts my bid lots first and shows Your Standing on each
**so that** I know which still need me before they close.

**Accepted by:**
- `grade10-site-auction-account-record-SC-12` — A watched listing they bid on is marked
- `grade10-site-auction-account-record-SC-13` — Unwatching leaves the bid alone
- `grade10-site-auction-account-record-SC-14` — The highest bidder is Leading
- `grade10-site-auction-account-record-SC-15` — Outbid carries the minimum next bid
- `grade10-site-auction-account-record-SC-18` — A won listing sits under Won
- `grade10-site-auction-account-record-SC-19` — A listing lost at close sits under Didn't win
- `grade10-site-auction-account-record-SC-30` — A bidder lands on Bidding
- `grade10-site-auction-account-record-SC-42` — A first bid enrolls My Auctions
- `grade10-site-auction-account-record-SC-44` — A bid row keeps Email alerts without Unwatch

### grade10-site-auction-account-record-US-03: Winner follows a won listing to delivery

**As a** winner
**I want** to see payment and shipment standing on My Auctions
**so that** I do not have to ask Grade10 what happens next.

**Accepted by:**
- `grade10-site-auction-account-record-SC-20` — Card capture reads as Paid
- `grade10-site-auction-account-record-SC-21` — Manual collection reads as the same Paid
- `grade10-site-auction-account-record-SC-22` — A payment problem says how to reach Grade10
- `grade10-site-auction-account-record-SC-23` — Shipment states reach the winner
- `grade10-site-auction-account-record-SC-24` — The winner is offered no write
- `grade10-site-auction-account-record-SC-35` — A cancelled order remains Cancelled
- `grade10-site-auction-account-record-SC-36` — A refunded order remains Refunded

### grade10-site-auction-account-record-US-04: Losing bidder sees the card hold released

**As a** losing bidder
**I want** to see that my card hold is released on My Auctions
**so that** a pending authorization is not read as a charge.

**Accepted by:**
- `grade10-site-auction-account-record-SC-25` — A release in flight says so
- `grade10-site-auction-account-record-SC-26` — A completed release says so
- `grade10-site-auction-account-record-SC-27` — A called-off listing tells the bidder about the hold
