## Feature set

- Standing
  - Gate read: whether a person is verified, for a product that has no business with the record
  - Judged when read: a lapsed document reads expired, so the product asks again rather than reuses
- Consumers
  - Two kinds: a product that records and binds holds the service; one that only asks holds a gate
- Brand
  - One store per brand: a record belongs to the brand whose product made it, and nothing crosses

## ADDED Requirements

### Requirement: A product that only gates on identity reads a standing, never the record

The system SHALL answer a person's standing to a consumer that asks for it,
carrying these fields and no other. A standing SHALL be judged at the instant
it is read — a check whose document has expired since it was made SHALL read
`expired`, so the asking product invites a new check rather than reuses an aged
one. The read SHALL answer across every consumer, as a person's most recent
verified identity does.

| Field | Meaning |
| --- | --- |
| Standing | `unverified`, `verified`, or `expired` |
| Verified at | When the check was decided; absent for `unverified` |
| Document expiry | The day the document stops being valid, or absent for one that never expires; absent for `unverified` |
| Provider | Who performed the check — Grade10 staff, or a named verification provider; absent for `unverified` |

| Standing | Meaning |
| --- | --- |
| `unverified` | No verified identity is on file for the person |
| `verified` | The person's most recent verified identity rests on a document still valid on the day of the read |
| `expired` | The person's most recent verified identity rests on a document that expired before the day of the read |

#### Scenario: grade10-site-e-kyc-identity-record-SC-29 - A gating product reads a standing the vault made

- **GIVEN** a verified identity the vault recorded for a person
- **WHEN** another consumer asks for that person's standing
- **THEN** it is answered `verified`, with when the check was decided, the
  document's expiry, and who performed it
- **AND** no legal name, date of birth, document type, masked number, evidence
  or case is answered

#### Scenario: grade10-site-e-kyc-identity-record-SC-30 - A lapsed document reads expired

- **GIVEN** a verified identity whose document expiry is before the day of the
  read
- **WHEN** a consumer asks for that person's standing
- **THEN** it is answered `expired`, and the verified identity stays on file

#### Scenario: grade10-site-e-kyc-identity-record-SC-31 - A person nobody verified reads unverified

- **WHEN** a consumer asks for the standing of a person with no verified
  identity on file
- **THEN** it is answered `unverified`, carrying no other field

### Requirement: A consumer holds the service or a gate, never more than it needs

The system SHALL issue a consumer one of two surfaces: the service, for a
consumer that records identity checks and binds them to its own cases; or a
gate, for a consumer that only asks a person's standing. A gate SHALL answer
the standing and nothing else — no record, no evidence, no case binding, no
write — and a consumer holding a gate SHALL have no way to reach the record
through it. Each surface SHALL be issued per consumer, so what a consumer holds
says which consumer it is.

#### Scenario: grade10-site-e-kyc-identity-record-SC-32 - A gate cannot be walked onto the record

- **GIVEN** a consumer holding a gate
- **WHEN** it asks for anything but a standing — a record, a document image,
  a case's identity, a bind, or a release
- **THEN** there is nothing to ask: the gate offers no such request, and no
  input it supplies selects one

### Requirement: A verified identity belongs to one brand

The system SHALL hold each brand's verified identities in an identity store of
that brand's own, reached only by that brand's consumers. A person verified by
one brand's product SHALL NOT be answered as verified, reused, or reachable by
another brand's product. A brand that verifies nobody SHALL deploy no identity
store, and its products SHALL hold neither a service nor a gate.

#### Scenario: grade10-site-e-kyc-identity-record-SC-33 - A brand's consumer reaches its own brand's store or none

- **WHEN** a brand's product is deployed
- **THEN** every identity binding it holds names that brand's own identity
  store, and a brand with no identity store deploys products holding none

#### Scenario: grade10-site-e-kyc-identity-record-SC-34 - A person verified on one brand is unknown to another

- **GIVEN** a person verified by a Grade10 product
- **WHEN** a product of another brand asks for that person's standing
- **THEN** either that brand has no identity store to ask, or its own store
  answers `unverified`
