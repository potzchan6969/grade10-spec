## User journeys

### grade10-site-auction-listing-page-US-06: Watch a lot and open My Auctions from the toast

**As a** collector on a lot I have not bid on,
**I want** Watching to tell me email alerts are on and offer My Auctions,
**so that** I know how to manage that lot without hunting for the account page.

**Accepted by:**

- `grade10-site-auction-listing-page-SC-10` — A collector watches the lot they are reading
- `grade10-site-auction-listing-page-SC-14` — Watch announces alerts and My Auctions

### grade10-site-auction-listing-page-US-07: Unwatch from the lot and undo

**As a** collector who watched a lot without bidding,
**I want** Unwatch to confirm alerts are off and let me Undo,
**so that** a mis-tap does not force me to find the lot again.

**Accepted by:**

- `grade10-site-auction-listing-page-SC-15` — Unwatch announces and can be undone

### grade10-site-auction-listing-page-US-08: After bidding, Watching stays locked

**As a** bidder on this lot,
**I want** the watch control locked as Watching and one alerts toast when the bid bookmarks the lot,
**so that** I am not invited to unwatch money I already put down, and I am not toasted on every revisit.

**Accepted by:**

- `grade10-site-auction-listing-page-SC-13` — A bid locks Watching on the lot page
- `grade10-site-auction-listing-page-SC-16` — The first bid toast fires once
- `grade10-site-auction-listing-page-SC-17` — A later visit stays quiet

### grade10-site-auction-listing-page-US-09: Closed lot has no watch control

**As a** collector on a closed lot (sold or unsold),
**I want** no Watch / Watching control,
**so that** I am not invited to watch a sale that has already ended.

**Accepted by:**

- `grade10-site-auction-listing-page-SC-18` — A closed lot has no watch control
