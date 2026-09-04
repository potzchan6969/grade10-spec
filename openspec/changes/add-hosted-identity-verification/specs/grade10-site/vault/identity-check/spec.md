## Purpose

How a vault case gets the verified identity its agreements are signed under —
asked for when the visit is booked, landed on its own while nobody waits, or
recorded by staff with the document in front of them.

## Feature set

- Asking for the check
  - At booking: the case invites its collector as soon as a visit is arranged
  - On demand: an operator asks again for a case that needs one
- While it is out
  - Nothing waits: the case carries the state and the visit is arranged around it
  - Visible to staff: the case screen says whether an identity is on file, out, or refused
- When the verdict lands
  - Bound to the case: under the case's own guard, and paperwork rendered from an older identity is voided
  - Refused when the case has moved: a sealed, erased or post-custody case keeps the identity it has
- The counter
  - Always open: staff record a check on the document itself, before custody begins
- The gate
  - No identity, no paperwork: documents are never rendered for a case with none

## ADDED Requirements

### Requirement: A case asks its collector to verify when a visit is booked

The system SHALL invite the collector to complete a hosted identity check when a
vault case books an intake visit and holds no verified identity, using the
contact details the case holds. An operator SHALL be able to ask for a check on
such a case at any time before custody begins.

#### Scenario: grade10-site-vault-identity-check-SC-01 - Booking an intake visit invites the collector

- **GIVEN** a case with no verified identity
- **WHEN** an intake visit is booked for it
- **THEN** the collector is invited to verify at the contact details the case
  holds

#### Scenario: grade10-site-vault-identity-check-SC-02 - A case that already holds an identity is not asked again

- **GIVEN** a case already bound to a verified identity
- **WHEN** an intake visit is booked for it
- **THEN** no invitation is sent

#### Scenario: grade10-site-vault-identity-check-SC-03 - An operator asks for a check on a case that needs one

- **GIVEN** a case before custody with no verified identity and no live check
- **WHEN** an operator asks for one
- **THEN** the collector is invited

### Requirement: The case shows where its identity stands

The system SHALL show an operator, on the case, which of these the case's
identity is, and SHALL NOT show a case with a check still out as one with no
identity.

| What the case shows | Meaning |
| --- | --- |
| Verified | An identity is bound; who performed the check and when |
| Out | A hosted check is invited, started or submitted |
| Refused | The last hosted check was declined, and why |
| Lapsed | The last hosted check expired or was withdrawn |
| None | Nothing has been asked for |

#### Scenario: grade10-site-vault-identity-check-SC-04 - A case with a check out is not shown as unverified

- **GIVEN** a case whose hosted check has been invited and not decided
- **WHEN** an operator opens it
- **THEN** the case shows the check as out, not as having no identity

#### Scenario: grade10-site-vault-identity-check-SC-05 - A verified case names who performed the check

- **GIVEN** a case bound to a verified identity
- **WHEN** an operator opens it
- **THEN** the case shows whether Grade10 staff or a verification provider
  performed it, and when

### Requirement: A landed verdict binds the identity and voids paperwork written from an older one

The system SHALL bind an approved verdict's verified identity to the case it was
issued for, and SHALL void any signing packet still out on that case — the
paperwork was written from the identity this bind replaces. The identity the
case displaces SHALL be settled rather than left: discarded when the bind
stands, restored when it does not.

#### Scenario: grade10-site-vault-identity-check-SC-06 - Binding a verdict voids an outstanding packet

- **GIVEN** a case with a signing packet still out, rendered from an earlier
  identity
- **WHEN** an approved verdict binds a new identity to that case
- **THEN** the outstanding packet is void, and nothing can be signed from it

#### Scenario: grade10-site-vault-identity-check-SC-07 - The displaced identity is settled

- **GIVEN** a case bound to one identity
- **WHEN** a verdict binds another
- **THEN** the displaced identity is discarded once the new binding stands, so
  no photograph of a document is left behind unbound

### Requirement: A verdict landing on a case that has moved is refused, and the case keeps what it had

The system SHALL refuse to bind a verified identity to a case whose item is in
custody or beyond, a case holding sealed signing evidence, or a case whose
personal data has been erased. Where the verdict was approved, the identity it
created SHALL be discarded and the case SHALL keep the identity it already held.
An operator SHALL be told the check landed and was refused, and why.

#### Scenario: grade10-site-vault-identity-check-SC-08 - A verdict landing after custody begins is refused

- **GIVEN** a case whose item is in the vault
- **WHEN** an approved verdict lands for it
- **THEN** the case keeps the identity it was vaulted under, the new identity is
  discarded, and the operator is told

#### Scenario: grade10-site-vault-identity-check-SC-09 - A verdict landing on sealed evidence is refused

- **GIVEN** a case holding a sealed signing packet
- **WHEN** an approved verdict lands for it
- **THEN** the case keeps the identity that evidence was executed under, and the
  new identity is discarded

#### Scenario: grade10-site-vault-identity-check-SC-10 - A verdict landing on an erased case is refused

- **GIVEN** a case whose personal data has been erased
- **WHEN** an approved verdict lands for it
- **THEN** nothing is bound and the identity the verdict created is discarded, so
  erasure is not undone by a check that was already in flight

#### Scenario: grade10-site-vault-identity-check-SC-11 - A refused landing leaves no half-finished state

- **GIVEN** a verdict refused on landing
- **WHEN** the refusal is settled
- **THEN** the case's identity is the one it held before, the check reads
  Declined, and no identity is left bound to nothing

### Requirement: A case's documents are never rendered without a bound identity

The system SHALL refuse to prepare a case's signing documents while the case
holds no verified identity, and SHALL refuse to seal a packet whose identity has
changed since it was rendered. The name printed on a document SHALL come from
the bound verified identity and from nothing an operator or a collector types.

#### Scenario: grade10-site-vault-identity-check-SC-12 - Preparing documents without an identity is refused

- **GIVEN** a case with no verified identity
- **WHEN** its signing documents are prepared
- **THEN** the request is refused, naming the missing identity check

#### Scenario: grade10-site-vault-identity-check-SC-13 - A packet whose identity moved cannot be sealed

- **GIVEN** a rendered packet
- **WHEN** the case's identity is replaced before the packet is sealed
- **THEN** sealing is refused, because the paper names a person the case no
  longer says it is about

### Requirement: Staff record a check at the counter before custody begins

The system SHALL let a member of staff record an identity check with the
document in front of them at any point from the case being drafted through the
signing of its documents, and SHALL refuse one once the item is in custody.
Neither a hosted check's state nor the absence of one SHALL be a precondition.

#### Scenario: grade10-site-vault-identity-check-SC-14 - Staff verify a collector who arrives unverified

- **GIVEN** a case before custody whose collector arrives with no verified
  identity
- **WHEN** staff record the check with the document in front of them
- **THEN** the case holds a verified identity and can proceed to signing

#### Scenario: grade10-site-vault-identity-check-SC-15 - A counter check is refused once the item is in custody

- **GIVEN** a case whose item is in the vault
- **WHEN** staff record an identity check for it
- **THEN** it is refused, because a release reads the identity the executed
  agreement already holds
