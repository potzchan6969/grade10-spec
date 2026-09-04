## User journeys

### grade10-site-store-membership-US-01: Collector becomes a member without waiting on commerce

**As a** collector,
**I want** my account created even when the commerce provider is down,
**so that** pairing completes on its own, a lost response does not duplicate me, and erasure cannot resurrect the customer.

**Accepted by:**

- `grade10-site-store-membership-SC-01` — Sign-up never waits on the provider
- `grade10-site-store-membership-SC-02` — A lost response does not duplicate a customer
- `grade10-site-store-membership-SC-03` — A conflict parks visibly
- `grade10-site-store-membership-SC-04` — The account identifier never leaves Grade10
- `grade10-site-store-membership-SC-05` — An unverified email attaches nothing to a member who already existed
- `grade10-site-store-membership-SC-06` — A purchase that creates the account also pairs it
- `grade10-site-store-membership-SC-07` — A crash mid-erasure does not resurrect the customer
- `grade10-site-store-membership-SC-08` — A racing creation is cleaned up

### grade10-site-store-membership-US-02: Member identifies and spends at the till

**As a** member,
**I want** my card or my email to identify me, and staff to spend my points once,
**so that** guessing is paused, a miss discloses nothing, and a cancel after tender is caught.

**Accepted by:**

- `grade10-site-store-membership-SC-09` — Guessing at a code pauses that shop
- `grade10-site-store-membership-SC-10` — An email miss discloses nothing
- `grade10-site-store-membership-SC-11` — A lookup is recorded
- `grade10-site-store-membership-SC-12` — A double tap spends once
- `grade10-site-store-membership-SC-13` — The member's phone is the monitor
- `grade10-site-store-membership-SC-14` — A cancel after tender is caught
- `grade10-site-store-membership-SC-15` — Another member cannot use the code
- `grade10-site-store-membership-SC-16` — A big code on a small cart is refused, not burned
- `grade10-site-store-membership-SC-17` — One points code per order
- `grade10-site-store-membership-SC-26` — The kill switch stops spending, not selling
- `grade10-site-store-membership-SC-27` — Email-assisted spending can be stopped alone

### grade10-site-store-membership-US-03: Member's in-store order earns through attribution

**As a** member,
**I want** a physical-store order recorded once and attributed by evidence,
**so that** a sale before I registered is not lost, two claimers cannot both win, and a gift card earns nothing.

**Accepted by:**

- `grade10-site-store-membership-SC-18` — Webhook and sweep converge
- `grade10-site-store-membership-SC-19` — The platform's own checkout is not re-ingested
- `grade10-site-store-membership-SC-20` — A refund before identity is not lost or doubled
- `grade10-site-store-membership-SC-21` — A sale rung up before registration is not lost
- `grade10-site-store-membership-SC-22` — A wrong attribution is one action to undo
- `grade10-site-store-membership-SC-23` — Two claimers cannot both win
- `grade10-site-store-membership-SC-24` — A gift card earns nothing anywhere
- `grade10-site-store-membership-SC-25` — Points spent lower the same order's earning
