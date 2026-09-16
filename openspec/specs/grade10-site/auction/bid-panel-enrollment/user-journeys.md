## User journeys

### grade10-site-auction-bid-panel-enrollment-US-01: Collector signs in to bid on a lot

**As a** signed-out collector on a live lot,
**I want** the bid panel to offer sign-in when I try to bid,
**so that** I can authenticate before linking a card.

### grade10-site-auction-bid-panel-enrollment-US-02: Collector links a card when none is on file

**As a** signed-in collector with no linked card,
**I want** setup to leave me ready to bid immediately and to move me to
enrolled after my first accepted bid,
**so that** the panel does not wait for a bid-time authorization that the
backend does not require.

**Accepted by:**

- `grade10-site-auction-bid-panel-enrollment-SC-15` — Card linking leaves the collector ready to bid
- `grade10-site-auction-bid-panel-enrollment-SC-16` — An accepted bid moves directly to enrolled

### grade10-site-auction-bid-panel-enrollment-US-03: Collector changes the linked card before their first bid

**As a** collector with a linked card on a lot who has not yet bid on it,
**I want** to change or link another card from the panel,
**so that** I can update payment before my first bid without a separate flow.

### grade10-site-auction-bid-panel-enrollment-US-04: Collector bids after linking a card

**As a** collector who has a linked card on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

### grade10-site-auction-bid-panel-enrollment-US-05: Collector returns to a new lot with a card already linked

**As a** signed-in collector who linked a card on a prior lot,
**I want** that card and enabled amount controls on a new lot without setup,
**so that** I am not asked to link again before I bid.
