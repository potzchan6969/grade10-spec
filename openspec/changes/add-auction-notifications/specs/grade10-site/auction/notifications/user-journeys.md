## User journeys

### grade10-site-auction-notifications-US-01: Collector hears a watched lot is opening

**As a** collector,
**I want** to be emailed as a watched lot opens,
**so that** I can come back and bid without sitting on the page.

**Accepted by:**

- `grade10-site-auction-notifications-SC-02` — A watcher who also bids receives one copy
- `grade10-site-auction-notifications-SC-04` — Unwatching ends watcher enrolment
- `grade10-site-auction-notifications-SC-05` — A watcher is told bidding opens tomorrow
- `grade10-site-auction-notifications-SC-06` — A watcher added inside the window still hears
- `grade10-site-auction-notifications-SC-07` — A watcher is told bidding has opened
- `grade10-site-auction-notifications-SC-10` — A progress message is sent once per lot
- `grade10-site-auction-notifications-SC-17` — Mail reaches the registered address
- `grade10-site-auction-notifications-SC-18` — Two kinds share the layout
- `grade10-site-auction-notifications-SC-19` — A start letter can be stopped
- `grade10-site-auction-notifications-SC-21` — A rate limit is retried
- `grade10-site-auction-notifications-SC-29` — The lot block shows one primary image
- `grade10-site-auction-notifications-SC-30` — A listing without an image still mails

### grade10-site-auction-notifications-US-02: Collector returns before a lot closes

**As a** collector,
**I want** to be emailed when a lot I watch or bid on is a day from its
scheduled close,
**so that** a moving deadline does not pass without me.

**Accepted by:**

- `grade10-site-auction-notifications-SC-02` — A watcher who also bids receives one copy
- `grade10-site-auction-notifications-SC-03` — Unwatching does not end bidder enrolment
- `grade10-site-auction-notifications-SC-08` — The closing warning uses the scheduled close
- `grade10-site-auction-notifications-SC-09` — Extended bidding announces itself to watchers and bidders
- `grade10-site-auction-notifications-SC-23` — A close that landed under the send is not mailed late
- `grade10-site-auction-notifications-SC-27` — A called-off lot sends nothing further
- `grade10-site-auction-notifications-SC-28` — A scheduled message is suppressed by a call-off

### grade10-site-auction-notifications-US-03: Collector raises after being outbid

**As a** collector,
**I want** to be emailed when I lose the lead on a lot I bid on,
**so that** I can raise my maximum while the lot still takes bids.

**Accepted by:**

- `grade10-site-auction-notifications-SC-12` — A collector is told they have been outbid
- `grade10-site-auction-notifications-SC-13` — An outbid collector gets one message, not two
- `grade10-site-auction-notifications-SC-15` — Losing the lead without a new bid is not an outbid
- `grade10-site-auction-notifications-SC-20` — An outbid letter cannot be stopped
- `grade10-site-auction-notifications-SC-31` — A challenge that leaves them leading is not an outbid

### grade10-site-auction-notifications-US-04: Collector hears a new bid on a lot they bid on

**As a** collector,
**I want** to be emailed when someone else bids on a lot I already bid on,
**so that** I know the lot moved without being mailed on every increment.

**Accepted by:**

- `grade10-site-auction-notifications-SC-01` — Bidding enrols without watching
- `grade10-site-auction-notifications-SC-03` — Unwatching does not end bidder enrolment
- `grade10-site-auction-notifications-SC-11` — A bidder hears about someone else's bid
- `grade10-site-auction-notifications-SC-14` — A bid placed on a collector's behalf is still their own bid
- `grade10-site-auction-notifications-SC-16` — A snipe war does not mail every increment
- `grade10-site-auction-notifications-SC-31` — A challenge that leaves them leading is not an outbid

### grade10-site-auction-notifications-US-05: Operator looks up what a collector was sent

**As an** auction operator,
**I want** to filter sent auction mail by a collector's email,
**so that** I can answer a collector who says they were never told.

**Accepted by:**

- `grade10-site-auction-notifications-SC-22` — A refused address parks without burning the budget
- `grade10-site-auction-notifications-SC-24` — An operator can see what was sent
- `grade10-site-auction-notifications-SC-25` — The send log shows type, not content
- `grade10-site-auction-notifications-SC-26` — The send log is filterable by email
