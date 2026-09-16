## Purpose

How a vault case gets the verified identity its agreements are signed under —
reused from a check the collector already passed, asked for before the visit,
landed on its own while nobody waits, or recorded by staff with the document in
front of them. The record itself is `grade10-site/e-kyc/identity-record`; the
check a collector walks is `grade10-site/e-kyc/hosted-verification`.

A case is **pre-custody** while its status is `draft`, `submitted`,
`under_valuation`, `offer_made`, `accepted` or `signing`. Every other status —
`vaulted`, `active`, `repaid`, `released`, `declined`, `cancelled`, `expired`
and `forfeited` — is **past recording**: no identity is bound or recorded there.

## Feature set

- Asking for the check
  - Reuse first: a check the collector already passed is bound rather than asked for again
  - At booking: a case with nothing to reuse invites its collector
  - On demand: an operator holding `vault:operate` asks again for a case that needs one
- While it is out
  - Nothing waits: the case carries the state and the visit is arranged around it
  - Visible to staff: the case screen says whether an identity is on file, out, stalled, refused or lapsed
  - Seeing the person: `kyc:read` shows an identity's details, its document, and why a check was refused
- When the verdict lands
  - Bound to the case: under the case's own guard, and paperwork rendered from an older identity is voided
  - Refused when the case has moved: a sealed, erased, post-custody or otherwise-verified case keeps the identity it has
- The gate
  - No identity, no paperwork: documents are never rendered for a case with none
- The counter
  - Always open: staff record a check on the document itself, before custody begins
  - An override is recorded: a counter check over a decline carries a reason and names who gave it

## ADDED Requirements

### Requirement: A case reuses a check before it asks for one

The system SHALL, before inviting a collector, ask for that person's most recent
verified identity and bind it when it exists and passes the refusals
`grade10-site/e-kyc/identity-record` defines. Only a case with nothing to reuse
SHALL invite.

#### Scenario: grade10-site-vault-identity-check-SC-02 - A collector already verified is not asked again
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** a collector holding a verified identity that is still valid
- **WHEN** an intake visit is booked on a case of theirs with no identity
- **THEN** that identity is bound to the case and no invitation is sent

### Requirement: A case asks its collector to verify when a visit is booked

The system SHALL invite the collector to complete a hosted identity check when a
pre-custody vault case books an intake visit, holds no verified identity and has
nothing to reuse, using the contact details the case holds. An operator holding
`vault:operate` SHALL be able to ask for a check on such a case at any time
before custody begins. A case holding no email address, or naming no
person at all, SHALL be left with no check, and SHALL be reported to an operator
rather than passing as a check nobody answered.

#### Scenario: grade10-site-vault-identity-check-SC-01 - Booking an intake visit invites the collector
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** a pre-custody case with no verified identity and nothing to reuse
- **WHEN** an intake visit is booked for it
- **THEN** the collector is invited to verify at the contact details the case
  holds

#### Scenario: grade10-site-vault-identity-check-SC-03 - An operator asks for a check on a case that needs one
**Serves:** grade10-site-vault-identity-check-US-02 - Operator records a check at the counter

- **GIVEN** a pre-custody case with no verified identity and no live check
- **WHEN** an operator holding `vault:operate` asks for one
- **THEN** the collector is invited

#### Scenario: grade10-site-vault-identity-check-SC-19 - A case nobody can be invited on is reported, not left silently unchecked
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** a pre-custody case that names no person, or holds no email address
- **WHEN** an intake visit is booked for it
- **THEN** no check is raised, and an operator is told why it could not be
  raised rather than the case reading as a check nobody answered

### Requirement: The case shows where its identity stands

The system SHALL show an operator, on the case, which of these the case's
identity is, and SHALL NOT show a case with a check still out as one with no
identity. No case action SHALL wait on a verdict: a check being out
SHALL NOT itself refuse any booking, valuation, offer or status move the case
would otherwise allow.

| What the case shows | Meaning |
| --- | --- |
| Verified | An identity is bound; who performed the check and when |
| Out | A hosted check is invited, started or submitted |
| Stalled | A hosted check was submitted and the provider has not decided |
| Refused | The last hosted check was declined |
| Lapsed | The last hosted check expired or was withdrawn |
| None | Nothing has been asked for |

#### Scenario: grade10-site-vault-identity-check-SC-04 - A case with a check out is not shown as unverified, and nothing waits on it
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** a case whose hosted check has been invited and not decided
- **WHEN** an operator opens it
- **THEN** the case shows the check as out, not as having no identity
- **AND** the case can be booked, valued and moved exactly as a case with no
  check out

#### Scenario: grade10-site-vault-identity-check-SC-05 - A verified case names who performed the check
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** a case bound to a verified identity
- **WHEN** an operator opens it
- **THEN** the case shows whether Grade10 staff or a verification provider
  performed it, when, and what the provider found

### Requirement: Seeing an identity takes `kyc:read`

The system SHALL require `kyc:read` to show a verified identity's details, the
document image, or the reason a hosted check was refused, and SHALL answer the
rest of the case to a caller holding `vault:read` alone. Whether a case holds an
identity, and which of the states below it is in, SHALL be readable under
`vault:read`, because an operator arranging a visit needs to know that much
without being shown the person. The reason a check was refused, and what a
provider checked and found, SHALL take `kyc:read`.

#### Scenario: grade10-site-vault-identity-check-SC-16 - A case's identity state is readable, its details are not
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** an operator holding `vault:read` and not `kyc:read`
- **WHEN** they open a case bound to a verified identity
- **THEN** the case shows that an identity is on file and who performed the
  check
- **AND** no name, birth date, masked number, document image, provider finding
  or refusal reason is returned

### Requirement: A landed verdict binds the identity and voids paperwork written from an older one

The system SHALL bind an approved verdict's verified identity to the case its
check was raised for, and SHALL void any signing packet still out on that case —
the paperwork was written from the identity this bind replaces. The identity the
case displaces SHALL be settled rather than left: discarded when the bind stands,
restored when it does not.

#### Scenario: grade10-site-vault-identity-check-SC-06 - Binding a verdict voids an outstanding packet
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** a case with a signing packet still out, rendered from an earlier
  identity
- **WHEN** an approved verdict binds a new identity to that case
- **THEN** the outstanding packet is void, and nothing can be signed from it

#### Scenario: grade10-site-vault-identity-check-SC-07 - The displaced identity is settled
**Serves:** grade10-site-vault-identity-check-US-03 - Operator settles a verdict that lands after the case has moved

- **GIVEN** a case bound to one identity
- **WHEN** a verdict binds another
- **THEN** the displaced identity is on file until the vault settles it, and is
  discarded once the new binding stands, so no image of a document is left
  behind unbound

### Requirement: A verdict landing on a case that has moved is refused, and the case keeps what it had

The system SHALL refuse to bind a verified identity to a case past recording, a
case holding sealed signing evidence, a case whose personal data has
been erased, or a case that has bound an identity from another source since the
check was raised. Where the verdict was approved, the identity it created SHALL
be discarded with its evidence and the case SHALL keep the identity it already
held. An operator SHALL be told the check landed and was refused, and why.

#### Scenario: grade10-site-vault-identity-check-SC-08 - A verdict landing after custody begins is refused
**Serves:** grade10-site-vault-identity-check-US-03 - Operator settles a verdict that lands after the case has moved

- **GIVEN** a case past recording — `vaulted`, `active`, `repaid`, `released`,
  `declined`, `cancelled`, `expired` or `forfeited`
- **WHEN** an approved verdict lands for it
- **THEN** the case keeps the identity it was vaulted under, the new identity is
  discarded, and the operator is told

#### Scenario: grade10-site-vault-identity-check-SC-09 - A verdict landing on sealed evidence is refused
**Serves:** grade10-site-vault-identity-check-US-03 - Operator settles a verdict that lands after the case has moved

- **GIVEN** a case holding a sealed signing packet
- **WHEN** an approved verdict lands for it
- **THEN** the case keeps the identity that evidence was executed under, and the
  new identity is discarded

#### Scenario: grade10-site-vault-identity-check-SC-10 - A verdict landing on an erased case is refused
**Serves:** grade10-site-vault-identity-check-US-03 - Operator settles a verdict that lands after the case has moved

- **GIVEN** a case whose personal data has been erased
- **WHEN** an approved verdict lands for it
- **THEN** nothing is bound and the identity the verdict created is discarded
  with its evidence, so erasure is not undone by a check that was already in
  flight

#### Scenario: grade10-site-vault-identity-check-SC-18 - A verdict landing on a case verified elsewhere is refused
**Serves:** grade10-site-vault-identity-check-US-03 - Operator settles a verdict that lands after the case has moved

- **GIVEN** a case that bound an identity at the counter after its hosted check
  was raised
- **WHEN** the hosted check's approved verdict lands
- **THEN** the case keeps the identity staff recorded, the verdict's identity is
  discarded, and no packet is voided

#### Scenario: grade10-site-vault-identity-check-SC-11 - A refused landing leaves no half-finished state
**Serves:** grade10-site-vault-identity-check-US-03 - Operator settles a verdict that lands after the case has moved

- **GIVEN** an approved verdict refused on landing
- **WHEN** the verdict is read
- **THEN** the case's identity is the one it held before, the identity the
  verdict created is purged with its evidence, the check reads Declined with the
  reason recorded, and no identity is left bound to nothing

### Requirement: A case's documents are never rendered without a bound identity

The system SHALL refuse to prepare a case's signing documents while the case
holds no verified identity, and SHALL refuse to seal a packet whose bound
identity is not the one it was prepared under. The name printed on a document
SHALL come from the bound verified identity and from nothing an operator or a
collector types.

#### Scenario: grade10-site-vault-identity-check-SC-12 - Preparing documents without an identity is refused
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** a case with no verified identity
- **WHEN** its signing documents are prepared
- **THEN** the request is refused, naming the missing identity check

#### Scenario: grade10-site-vault-identity-check-SC-13 - A packet whose identity moved cannot be sealed
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** a rendered packet
- **WHEN** the case's identity is replaced before the packet is sealed
- **THEN** sealing is refused, because the paper names a person the case no
  longer says it is about

#### Scenario: grade10-site-vault-identity-check-SC-20 - A prepared document carries the bound identity's name
**Serves:** grade10-site-vault-identity-check-US-01 - Operator opens a case for a collector who verified before arriving

- **GIVEN** a case bound to a verified identity whose legal name differs from
  the name an operator typed on the case
- **WHEN** its signing documents are prepared
- **THEN** the name printed is the bound identity's, and nothing typed reaches
  the paper

### Requirement: Staff record a check at the counter before custody begins

The system SHALL let a member of staff holding `vault:operate` record an identity
check with the document in front of them while the case is pre-custody, and SHALL
refuse one once the case is past recording. Neither a hosted check's state
nor the absence of one SHALL be a precondition. Recording a counter check on a
case whose last hosted check was Declined SHALL be an override: it SHALL carry a
reason, SHALL be recorded on the case's history naming the staff member who
gave it, SHALL leave the declined check on record beside the counter check, and
SHALL be refused when no reason is given.

An override takes no grant an ordinary counter check does not: the recorded
reason, naming who gave it, is the control. No role the platform ships holds
`vault:operate` without `vault:approve`, so a separate grant would separate
nobody; the day the role set separates them is a `shared/auth/roles` change,
and this requirement stands until then.

#### Scenario: grade10-site-vault-identity-check-SC-14 - Staff verify a collector who arrives unverified
**Serves:** grade10-site-vault-identity-check-US-02 - Operator records a check at the counter

- **GIVEN** a pre-custody case whose collector arrives with no verified identity
- **WHEN** staff record the check with the document in front of them
- **THEN** the case holds a verified identity and can proceed to signing

#### Scenario: grade10-site-vault-identity-check-SC-15 - A counter check is refused once the item is in custody
**Serves:** grade10-site-vault-identity-check-US-02 - Operator records a check at the counter

- **GIVEN** a case past recording — `vaulted`, `active`, `repaid`, `released`,
  `declined`, `cancelled`, `expired` or `forfeited`
- **WHEN** staff record an identity check for it
- **THEN** it is refused, because a release reads the identity the executed
  agreement already holds

#### Scenario: grade10-site-vault-identity-check-SC-17 - An override of a refused check carries a reason
**Serves:** grade10-site-vault-identity-check-US-02 - Operator records a check at the counter

- **GIVEN** a pre-custody case whose last hosted check was Declined
- **WHEN** staff record a counter check giving no reason
- **THEN** it is refused
- **AND** the same check recorded with a reason is accepted, the reason is
  recorded on the case's history naming the staff member who gave it, and the
  case shows the counter check standing over the declined check
