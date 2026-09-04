## Purpose

Records what a collector sees on a listing bid panel before they are
bid-ready on that lot, what opens each enrollment step, and when the linked
card may change. Authorization and holds belong to
`grade10-auction/bid-payment-method`.

## Feature set

- Bid panel enrollment
  - Signed-out entry: the primary bid action offers sign-in before any bid
  - Lot enrollment: a collector completes setup for this lot before their
    first accepted bid
  - Linked-card slot: empty, enrolled with change, or enrolled without
    change, below the bid panel
- Setup modal
  - First link: provider-hosted card entry and age attestation in one modal
  - Change card: same modal and copy, with the prior linked card indicated
    in the provider field and attestation pre-checked when already given
  - Dismissal: closing without continue leaves the lot unenrolled
- Age attestation
  - Once per account: the collector attests inside setup; later lots may
    pre-check when they change card
- After enrollment
  - Change before first bid: the linked-card row offers change until the
    first bid on this lot
  - Locked after first bid: the linked card stays visible without change

## ADDED Requirements

### Requirement: The bid panel enrollment states

The listing bid panel SHALL present exactly one enrollment posture to the
collector at a time. The consumer owns which posture applies; the shared bid
panel SHALL render the posture it is given.

| State | Bid action | Linked-card slot | Setup modal |
| --- | --- | --- | --- |
| Signed out | Sign in to bid | Hidden | Closed |
| Signed in, lot not enrolled | Place bid (or equivalent) | Empty link prompt, or hidden while setup is open | Closed, or open during setup |
| Lot enrolled, no bid yet | Place bid (or equivalent) | Linked card with change | Closed, or open during change |
| Lot enrolled, bid placed | Place bid (or equivalent) | Linked card without change | Closed |

Standing badges for highest bid or outbid SHALL appear only when the
collector is signed in and has auction standing on the lot. Recent public bids
MAY remain visible while signed out.

Sign-in behavior SHALL follow `shared-auth/session`. Card authorization
SHALL follow `grade10-auction/bid-payment-method` once enrollment completes.

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-01 - Sign-in is offered instead of place bid

- **GIVEN** a signed-out collector on a live lot's bid panel
- **WHEN** they view the primary bid action
- **THEN** it offers sign-in to bid
- **AND** it does not offer place bid

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-02 - Standing badges stay hidden while signed out

- **GIVEN** a signed-out collector on a lot where recent bids are shown
- **WHEN** the bid panel renders
- **THEN** highest-bid and outbid standing badges are not shown
- **AND** recent bids remain visible

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-03 - Place bid opens setup before enrollment

- **GIVEN** a signed-in collector who has not enrolled on an open listing
- **WHEN** they activate the primary bid action
- **THEN** the setup modal opens
- **AND** the bid is not treated as placed

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-04 - Setup requires card and attestation

- **GIVEN** a signed-in collector in the first-link setup modal
- **WHEN** they have not completed provider card entry and age attestation
- **THEN** continue is disabled
- **AND** when both are complete, continue is enabled

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-05 - Dismissing setup leaves the lot unenrolled

- **GIVEN** a signed-in collector who opened setup for a lot they have not
  enrolled on
- **WHEN** they close the modal without continuing
- **THEN** the lot remains unenrolled
- **AND** the linked-card slot shows the empty link prompt
- **AND** no linked card row is shown

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-06 - Completing setup shows the linked card

- **GIVEN** a signed-in collector who completes setup for a lot
- **WHEN** the modal closes
- **THEN** the linked-card slot shows the enrolled card
- **AND** change is available
- **AND** the primary bid action remains available

### Requirement: Age attestation is collected once per account in setup

The setup modal SHALL include an age attestation control. A collector SHALL
attest before continue is enabled on their first enrollment. When a collector
who already attested on a prior lot opens setup to change card on a new lot,
the attestation SHALL be pre-checked. The collector MAY uncheck it; continue
SHALL remain disabled while it is unchecked.

The setup modal SHALL use the same title and description for first link and
change card. Card entry SHALL use a provider-hosted field; card details SHALL
not pass through Grade10.

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-07 - Change opens the setup modal

- **GIVEN** a collector enrolled on a lot who has not bid on it
- **WHEN** they activate change on the linked card
- **THEN** the setup modal opens
- **AND** the linked-card row remains visible behind the modal

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-08 - Change reuses setup copy with prior card shown

- **GIVEN** a collector changing the linked card before their first bid
- **WHEN** the setup modal opens
- **THEN** it uses the same title and description as first-link setup
- **AND** the provider field area indicates the previously linked card on
  file rather than an empty first-link placeholder

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-09 - Attestation is pre-checked when already given

- **GIVEN** a collector who already attested on a prior lot
- **WHEN** they open setup to change card on a new lot
- **THEN** the age attestation is pre-checked
- **AND** continue is enabled once provider card entry is satisfied

### Requirement: Linked card change ends after the first bid on a lot

After a collector places their first bid on a listing, the linked-card slot
SHALL continue to show the committed card and SHALL NOT offer change on that
listing. Raising a bid on the same listing SHALL NOT reopen setup for card
selection.

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-10 - Change is hidden after the first bid

- **GIVEN** a collector enrolled on a lot who has placed at least one bid on
  it
- **WHEN** the bid panel renders
- **THEN** the linked card is shown
- **AND** change is not offered

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-11 - First maximum does not reopen setup

- **GIVEN** a collector enrolled on a lot who has not yet placed a bid on it
- **WHEN** they activate the primary bid action with a valid maximum
- **THEN** the setup modal does not open
- **AND** the commitment proceeds under `grade10-auction/auto-bidding` and
  `grade10-auction/bid-payment-method`
