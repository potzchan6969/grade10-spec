## User journeys

### bid-panel-enrollment-US-01: Collector signs in to bid on a lot

**As a** signed-out collector on a live lot,
**I want** the bid panel to offer sign-in when I try to bid,
**so that** I can authenticate before enrollment begins.

**Accepted by:**

- `bid-panel-enrollment-SC-01` — Sign-in is offered instead of place bid
- `bid-panel-enrollment-SC-02` — Standing badges stay hidden while signed out

### bid-panel-enrollment-US-02: Collector enrolls for a lot before bidding

**As a** signed-in collector who has not enrolled on this lot,
**I want** to link a card and attest my age in one setup step,
**so that** I know this lot is ready before I bid.

**Accepted by:**

- `bid-panel-enrollment-SC-03` — Place bid opens setup before enrollment
- `bid-panel-enrollment-SC-04` — Setup requires card and attestation
- `bid-panel-enrollment-SC-05` — Dismissing setup leaves the lot unenrolled
- `bid-panel-enrollment-SC-06` — Completing setup shows the linked card

### bid-panel-enrollment-US-03: Collector changes the linked card before their first bid

**As a** collector enrolled on a lot who has not yet bid on it,
**I want** to change the linked card from the panel,
**so that** I can update payment before my first bid without a separate flow.

**Accepted by:**

- `bid-panel-enrollment-SC-07` — Change opens the setup modal
- `bid-panel-enrollment-SC-08` — Change reuses setup copy with prior card shown
- `bid-panel-enrollment-SC-09` — Attestation is pre-checked when already given

### bid-panel-enrollment-US-04: Collector bids after enrolling on a lot

**As a** collector who has enrolled on a lot,
**I want** the linked card to lock after my first bid on that lot,
**so that** my committed payment method stays stable while I raise bids.

**Accepted by:**

- `bid-panel-enrollment-SC-10` — Change is hidden after the first bid
- `bid-panel-enrollment-SC-11` — First auto bid may open confirm-maximum
