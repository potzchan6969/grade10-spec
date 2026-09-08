## User journeys

### grade10-site-auction-bid-panel-enrollment-US-01: Collector signs in to bid on a lot

**As a** signed-out collector on a live lot,
**I want** the bid panel to offer sign-in when I try to bid,
**so that** I can authenticate before linking a card.

**Accepted by:**

- `grade10-site-auction-bid-panel-enrollment-SC-01` — Sign-in is offered instead of place bid
- `grade10-site-auction-bid-panel-enrollment-SC-02` — Standing badges stay hidden while signed out

### grade10-site-auction-bid-panel-enrollment-US-02: Collector links a card when none is on file

**As a** signed-in collector with no linked card,
**I want** amount entry disabled until I link a card and attest my age,
**so that** I only choose a maximum after setup is done.

**Accepted by:**

- `grade10-site-auction-bid-panel-enrollment-SC-03` — Link CTA opens setup when no card is linked
- `grade10-site-auction-bid-panel-enrollment-SC-04` — Setup requires card and attestation
- `grade10-site-auction-bid-panel-enrollment-SC-14` — Setup linking locks dismiss and controls
- `grade10-site-auction-bid-panel-enrollment-SC-05` — Dismissing setup leaves no linked card
- `grade10-site-auction-bid-panel-enrollment-SC-06` — Completing setup unlocks amount controls
- `grade10-site-auction-bid-panel-enrollment-SC-12` — Empty linked-card slot opens setup

### grade10-site-auction-bid-panel-enrollment-US-03: Collector changes the linked card before their first bid

**As a** collector with a linked card on a lot who has not yet bid on it,
**I want** to change or link another card from the panel,
**so that** I can update payment before my first bid without a separate flow.

**Accepted by:**

- `grade10-site-auction-bid-panel-enrollment-SC-07` — Change opens the setup modal
- `grade10-site-auction-bid-panel-enrollment-SC-08` — Change reuses setup copy with prior card shown
- `grade10-site-auction-bid-panel-enrollment-SC-09` — Attestation is pre-checked when already given

### grade10-site-auction-bid-panel-enrollment-US-04: Collector bids after linking a card

**As a** collector who has a linked card on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

**Accepted by:**

- `grade10-site-auction-bid-panel-enrollment-SC-10` — Change is hidden after the first bid
- `grade10-site-auction-bid-panel-enrollment-SC-11` — First maximum does not reopen setup

### grade10-site-auction-bid-panel-enrollment-US-05: Collector returns to a new lot with a card already linked

**As a** signed-in collector who linked a card on a prior lot,
**I want** that card and enabled amount controls on a new lot without setup,
**so that** I am not asked to link again before I bid.

**Accepted by:**

- `grade10-site-auction-bid-panel-enrollment-SC-13` — Card on file carries over to a new lot
