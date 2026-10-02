# grade10-site/auction/bid-panel-enrollment Specification

## Purpose

Records what a collector sees on a listing bid panel before they can commit a
maximum, what opens link-card setup, and when the linked card may change.
Bidding on the linked card belongs to `grade10-site/auction/bid-payment-method`.

## Feature set

- Setup modal
  - Link only: provider-hosted card entry and age attestation; the description
    says the card is charged only on a win
- Bid commit
  - One answer: committing a maximum shows Leading, Outbid or the refusal, with
    no authorization state between
  - Setup does not authorize: card-link setup takes nothing from the card

## MODIFIED Requirements

### Requirement: The bid panel enrollment states

The listing bid panel SHALL present exactly one enrollment posture to the
collector at a time. The consumer owns which posture applies; the shared bid
panel SHALL render the posture it is given.

| Panel state | Meaning | Visual group(s) | Bid action | Linked-card slot | Setup modal |
| --- | --- | --- | --- | --- | --- |
| `signed-out` | No authenticated session | `signed-out` | Sign in to bid | Hidden | Closed |
| `setup-first` | Authenticated; no linked card on this lot; setup closed | `no-linked-card` | Place bid (or equivalent) | Empty link prompt | Closed |
| `setup-in-progress` | First-link setup is open | `no-linked-card` | Setup is required before bidding | Empty link prompt | Open first-link setup |
| `setup-editable` | Change-card setup is open for an editable enrollment | `linked-card-before-bid` | Place bid (or equivalent) | Linked card with change | Open change-card setup |
| `editable` | A card is linked and no bid on this lot is accepted yet | `linked-card-before-bid` | Place bid (or equivalent) | Linked card with change | Closed |
| `enrolled` | The first accepted bid locked this lot's enrollment | `linked-card-after-bid` | Place bid (or equivalent) | Linked card without change | Closed |
| `ready` | Derived shared bid-card signal for authenticated bidding controls; not a separate persistence state | `linked-card-after-bid` | Place bid (or equivalent) | Uses the linked-card presentation of its source state | Closed |

| Visual group | Panel states | Amount controls | Bid action | Linked-card slot | Setup modal |
| --- | --- | --- | --- | --- | --- |
| `signed-out` — Signed out | `signed-out` | Hidden | Sign in to bid | Hidden | Closed |
| `no-linked-card` — Signed in, no linked card | `setup-first`, `setup-in-progress` | Visible, disabled | Link a card to bid | Empty link prompt, or hidden while setup is open | Closed, or open during link |
| `linked-card-before-bid` — Signed in, card linked, no bid on this lot | `setup-editable`, `editable` | Enabled | Set or raise maximum | Linked card with change | Closed, or open during change |
| `linked-card-after-bid` — Signed in, card linked, bid placed on this lot | `enrolled`, `ready` | Enabled | Set or raise maximum | Linked card without change | Closed |

Standing badges for highest bid or outbid SHALL appear only when the
collector is signed in and has auction standing on the lot. Recent public bids
MAY remain visible while signed out.

When the collector has no linked card, quick-bid presets and the custom
maximum field SHALL remain visible and SHALL NOT accept selection or input.
Only the primary bid action labeled for linking a card and the empty
linked-card slot SHALL open setup. Disabled presets and the custom field
SHALL NOT open setup.

A linked card on file from another lot SHALL carry over to a new lot: the
panel SHALL show the linked card, enable amount controls, and SHALL NOT open
setup solely because the collector has not yet bid on that lot. The collector
MAY change or link another card via Change until their first bid on that lot.
The linked-card label SHALL expose an info tooltip that says: Your card is
kept on file for bidding. You're only charged if you win.

Sign-in behavior SHALL follow `shared-auth/session`. Bidding on the linked
card SHALL follow `grade10-site/auction/bid-payment-method`.

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-sjy rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-01 - Sign-in is offered instead of place bid
**Serves:** grade10-site-auction-bid-panel-enrollment-US-01 - Collector signs in to bid on a lot

- **GIVEN** a signed-out collector on a live lot's bid panel
- **WHEN** they view the primary bid action
- **THEN** it offers sign-in to bid
- **AND** it does not offer place bid or link a card

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-o29 rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-02 - Standing badges stay hidden while signed out
**Serves:** grade10-site-auction-bid-panel-enrollment-US-01 - Collector signs in to bid on a lot

- **GIVEN** a signed-out collector on a lot where recent bids are shown
- **WHEN** the bid panel renders
- **THEN** highest-bid and outbid standing badges are not shown
- **AND** recent bids remain visible

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-ju5 rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-03 - Link CTA opens setup when no card is linked
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a signed-in collector with no linked card on an open listing
- **WHEN** they view the bid panel
- **THEN** quick-bid presets and the custom maximum field are visible and disabled
- **AND** the primary bid action is labeled Link a card to bid
- **WHEN** they activate the primary bid action
- **THEN** the setup modal opens
- **AND** the bid is not treated as placed

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-4ix rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-04 - Setup requires card and attestation
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a signed-in collector in the first-link setup modal
- **WHEN** they have not completed provider card entry and age attestation
- **THEN** continue is disabled
- **AND** when both are complete, continue is enabled
- **AND** continue is labeled Link Card

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-cic rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-14 - Setup linking locks dismiss and controls
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a signed-in collector who submitted Link Card and the provider link is in flight
- **WHEN** the setup modal shows the linking state
- **THEN** continue is labeled Linking and busy
- **AND** the provider field and age attestation are not interactive
- **AND** the collector cannot dismiss the modal

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-cnv rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-05 - Dismissing setup leaves no linked card
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a signed-in collector who opened setup with no linked card
- **WHEN** they close the modal without continuing
- **THEN** no linked card is on file for bidding
- **AND** the linked-card slot shows the empty link prompt
- **AND** amount controls remain visible and disabled

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-pnc rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-06 - Completing setup unlocks amount controls
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a signed-in collector who completes setup and links a card
- **WHEN** the modal closes
- **THEN** the linked-card slot shows the linked card
- **AND** change is available
- **AND** quick-bid presets and the custom maximum field are enabled
- **AND** the primary bid action offers set or raise maximum

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-htr rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-12 - Empty linked-card slot opens setup
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a signed-in collector with no linked card and the empty linked-card slot visible
- **WHEN** they activate the empty-slot link control
- **THEN** the setup modal opens
- **AND** disabled presets and the custom maximum field do not open setup

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-xwd rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-13 - Card on file carries over to a new lot
**Serves:** grade10-site-auction-bid-panel-enrollment-US-05 - Collector returns to a new lot with a card already linked

- **GIVEN** a signed-in collector who linked a card on a prior lot and has not bid on a new open listing
- **WHEN** they view that listing's bid panel
- **THEN** the linked-card slot shows the card on file with change available
- **AND** quick-bid presets and the custom maximum field are enabled
- **AND** the setup modal does not open

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
change card. The title SHALL be Link a card to bid. The description SHALL be
Link a card for bidding. You’re only charged if you win. Continue SHALL be
labeled Link Card. Setup SHALL take nothing from the card, and SHALL NOT use
authorize language on the primary action. While the provider link request is in flight,
continue SHALL use Linking, the provider field and age attestation SHALL NOT be
interactive, and the collector SHALL NOT dismiss the modal. Card entry SHALL use
a provider-hosted field; card details SHALL not pass through Grade10.

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-beq rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-07 - Change opens the setup modal
**Serves:** grade10-site-auction-bid-panel-enrollment-US-03 - Collector changes the linked card before their first bid

- **GIVEN** a collector with a linked card on a lot who has not bid on it
- **WHEN** they activate change on the linked card
- **THEN** the setup modal opens
- **AND** the linked-card row remains visible behind the modal

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-ofn rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-08 - Change reuses setup copy with prior card shown
**Serves:** grade10-site-auction-bid-panel-enrollment-US-03 - Collector changes the linked card before their first bid

- **GIVEN** a collector changing the linked card before their first bid
- **WHEN** the setup modal opens
- **THEN** it uses the same title and description as first-link setup
- **AND** the provider field area indicates the previously linked card on
  file rather than an empty first-link placeholder

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-1sa rev=1 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-09 - Attestation is pre-checked when already given
**Serves:** grade10-site-auction-bid-panel-enrollment-US-03 - Collector changes the linked card before their first bid

- **GIVEN** a collector who already attested on a prior lot
- **WHEN** they open setup to change card on a new lot
- **THEN** the age attestation is pre-checked
- **AND** continue is enabled once provider card entry is satisfied

## RENAMED Requirements

- FROM: `### Requirement: Backend authorization selection preserves bid-panel states`
- TO: `### Requirement: A bid commit answers in one step`

### Requirement: A bid commit answers in one step

After card-link setup succeeds, the panel SHALL be `editable` with the
amount controls enabled at once, so the collector is ready to bid. Committing
a maximum SHALL show its answer in one step: Leading or Outbid once the bid is
accepted, or the refusal under the bid action. There SHALL be no authorizing
state; the bid action is busy only until the answer arrives. The first accepted bid SHALL move the panel to `enrolled` and
lock card change for that listing; a refused bid leaves the panel as it was.

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-fho rev=2 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-15 - Card linking leaves the collector ready to bid
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a signed-in collector completes card-link setup on an open listing
- **WHEN** setup closes
- **THEN** the panel is `editable` with the amount controls enabled
- **AND** nothing is held or charged on the card

<!-- trace:scenario id=g10.auction-bid-panel-enrollment.SC-kcm rev=2 -->
#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-16 - An accepted bid moves directly to enrolled
**Serves:** grade10-site-auction-bid-panel-enrollment-US-02 - Collector links a card when none is on file

- **GIVEN** a collector has linked a card and submits a valid first bid
- **WHEN** the auction accepts the bid
- **THEN** the panel moves directly to `enrolled`
- **AND** Change is no longer offered for that listing

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-20 - A commit shows its answer with nothing between
**Serves:** grade10-site-auction-bid-panel-enrollment-US-04 - Collector bids after linking a card

- **GIVEN** a collector with a linked card on an open listing
- **WHEN** they commit a maximum
- **THEN** the panel shows Leading or Outbid once the auction accepts it, or
  the refusal under the bid action once the auction refuses it
- **AND** no authorizing state shows; the bid action is busy only until the
  answer arrives
