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

- **GIVEN** a signed-in collector completes card-link setup on an open listing
- **WHEN** setup closes
- **THEN** the existing pre-bid linked-card state enables the amount controls immediately
- **AND** the panel does not wait for a bid-time authorization

#### Scenario: grade10-site-auction-bid-panel-enrollment-SC-16 - An accepted bid moves directly to enrolled

- **GIVEN** a collector has linked a card and submits a valid first bid
- **WHEN** the backend accepts the bid without requiring a bid-time authorization
- **THEN** the panel moves directly to the existing `enrolled` state
- **AND** Change is no longer offered for that listing
