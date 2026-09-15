## User journeys

### grade10-site-auction-notifications-US-06: Collector who lost hears the lot closed

**As a** collector who bid on a lot,
**I want** to be emailed when someone else wins it,
**so that** I know the outcome without reopening the lot.

**Accepted by:**

- `grade10-site-auction-notifications-SC-37` — A losing bidder is told the lot closed
- `grade10-site-auction-notifications-SC-41` — A watcher who also bid gets one close letter
- `grade10-site-auction-notifications-SC-42` — The winner does not get a close-outcome letter

### grade10-site-auction-notifications-US-07: Watcher hears a sold lot ended

**As a** collector watching a lot without bidding,
**I want** to be emailed when that lot ends with a winner,
**so that** I know bidding is over on a lot I followed.

**Accepted by:**

- `grade10-site-auction-notifications-SC-38` — A watch-only collector is told a sold lot ended
- `grade10-site-auction-notifications-SC-43` — Muted alerts stop close-outcome mail

### grade10-site-auction-notifications-US-08: Collector hears a no-bids close as ended only

**As a** collector watching a lot,
**I want** to be emailed that the lot ended when nobody bid,
**so that** I learn the close without being told the lot did not sell.

**Accepted by:**

- `grade10-site-auction-notifications-SC-39` — A watcher on a no-bids close hears ended only
- `grade10-site-auction-notifications-SC-40` — No-bids close keeps lot_ended Ended-only and skips bidder mail
