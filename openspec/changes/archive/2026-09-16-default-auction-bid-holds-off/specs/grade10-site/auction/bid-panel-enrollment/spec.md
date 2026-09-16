## ADDED Requirements

### Requirement: Backend authorization selection preserves bid-panel states

The existing bid-panel states and visual groups SHALL remain unchanged. After
card-link setup succeeds, the existing pre-bid linked-card state SHALL enable
the amount controls immediately so the collector is ready to bid; it SHALL NOT
wait for a bid-time authorization. After the backend accepts the first bid,
the panel SHALL move directly to the existing `enrolled` state and lock card
change for that listing.

The backend SHALL determine whether bid acceptance waits for the optional
authorization. The panel SHALL keep the existing authorization-in-progress and
authorization-failed handling when the backend reports an enabled provider
authorization outcome; no new no-hold panel state is introduced.

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-15 - Card linking leaves the collector ready to bid
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a signed-in collector completes card-link setup on an open listing
- **WHEN** setup closes
- **THEN** the existing pre-bid linked-card state enables the amount controls immediately
- **AND** the panel does not wait for a bid-time authorization

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-16 - An accepted bid moves directly to enrolled
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a collector has linked a card and submits a valid first bid
- **WHEN** the backend accepts the bid without requiring a bid-time authorization
- **THEN** the panel moves directly to the existing `enrolled` state
- **AND** Change is no longer offered for that listing

## MODIFIED Requirements

### Requirement: Age attestation is collected once per account in setup

The setup modal SHALL include an age attestation control. A collector SHALL
attest before continue is enabled on their first link. When a collector who
already attested on a prior lot opens setup to change card, the attestation
SHALL be pre-checked. The collector MAY uncheck it; continue SHALL remain
disabled while it is unchecked.

The authenticated bidder/account record SHALL store a nullable
`age_attested_at` timestamp. A non-null value means that the collector has
completed age attestation; enrollment setup SHALL use it to pre-check the
control on later lots, while the current enrollment attempt SHALL still
require the control to remain checked.

The setup modal SHALL use the same title and description for first link and
change card. The title SHALL be Link a card to bid. When bid-time authorization
holds are disabled, the description SHALL be Link a card for bidding. You're
only charged if you win. When holds are enabled, the description SHALL also
disclose that setting a maximum authorizes a hold for that amount. Continue
SHALL be labeled Link Card. The setup modal SHALL NOT authorize a hold or use
authorize language on the primary action. While the provider link request is in
flight, continue SHALL use Linking, the provider field and age attestation
SHALL NOT be interactive, and the collector SHALL NOT dismiss the modal. Card
entry SHALL use a provider-hosted field; card details SHALL not pass through
Grade10.

When bid-time authorization holds are disabled, linked-card
`paymentMethodTooltip` copy SHALL authorize the card for bidding without
promising a bid-time hold. When holds are enabled, that tooltip MAY disclose
hold authorization on commit.

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-07 - Change opens the setup modal
**Serves:** grade10-site-auction-bid-panel-enrollment-US-03 - Collector changes the linked card before their first bid

- **GIVEN** a collector with a linked card on a lot who has not bid on it
- **WHEN** they activate change on the linked card
- **THEN** the setup modal opens
- **AND** the linked-card row remains visible behind the modal

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-08 - Change reuses setup copy with prior card shown
**Serves:** grade10-site-auction-bid-panel-enrollment-US-03 - Collector changes the linked card before their first bid

- **GIVEN** a collector changing the linked card before their first bid
- **WHEN** the setup modal opens
- **THEN** it uses the same title and description as first-link setup
- **AND** the provider field area indicates the previously linked card on
  file rather than an empty first-link placeholder

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-09 - Attestation is pre-checked when already given
**Serves:** grade10-site-auction-bid-panel-enrollment-US-03 - Collector changes the linked card before their first bid

- **GIVEN** a collector who already attested on a prior lot
- **WHEN** they open setup to change card on a new lot
- **THEN** the age attestation is pre-checked
- **AND** continue is enabled once provider card entry is satisfied

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-17 - Default setup copy does not promise a bid-time hold
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** bid-time authorization holds are disabled
- **WHEN** a collector opens the setup modal
- **THEN** the description is Link a card for bidding. You're only charged if you win.
- **AND** the description does not promise a bid-time hold

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-18 - Enabled hold setup copy discloses the authorization
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** bid-time authorization holds are enabled
- **WHEN** a collector opens the setup modal
- **THEN** the description discloses that setting a maximum authorizes a hold
- **AND** continue remains labeled Link Card

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-19 - Default payment-method tooltip does not promise a hold
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** bid-time authorization holds are disabled and a collector has a linked card
- **WHEN** they read the linked-card payment-method tooltip
- **THEN** the copy authorizes the card for bidding
- **AND** the copy does not promise a bid-time hold
