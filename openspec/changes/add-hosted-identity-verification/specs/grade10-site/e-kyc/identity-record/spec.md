## Purpose

The verified identity of a person — their legal name, date of birth, document
type, masked document number, its expiry, and a photograph of the document —
held once and reused by every Grade10 product that needs to know who somebody
is, so the same human is never asked for the same document twice.

## Feature set

- What a record holds
  - Identity fields: the name a document prints, the day a person was born, and what proved it
  - Provenance: which product recorded the check and who performed it, so a reader can weigh it
  - Evidence: the photograph the check was made against, held by Grade10
- What never lands
  - Document number: only a mask a person is shown and a keyed digest a repeat is recognised by
- Reuse across products
  - Person-wide read: the most recent check, whichever product recorded it
  - Case binding: one case holds one identity, so what displaces is settled rather than lost
- Refusals
  - Age and validity: an adult, holding a document still valid on the day of asking
- Erasure
  - Release: the owning product drops its binding, and the last release purges everything the check left anywhere

## ADDED Requirements

### Requirement: A verified identity holds one person's checked details

The system SHALL hold a verified identity as a record of one identity check,
carrying these fields and no free-text copy of the person beyond them.

| Field | Meaning |
| --- | --- |
| Person | Who the check is about |
| Legal name | As printed on the document, verbatim |
| Date of birth | A calendar day, with no time and no time zone |
| Document type | Passport, national ID, driving licence, or residence permit |
| Document number, masked | What a person is shown in place of the number |
| Document number, digest | A keyed digest, so a repeat of the same document is a question that can be asked |
| Document expiry | The day the document stops being valid, or absent for one that never expires |
| Evidence | The photograph of the document, held by Grade10 |
| Recorded by product | Which product's surface the check was made on |
| Provider | Who performed the check — Grade10 staff, or a named verification provider |
| Provider reference | The provider's own identifier for the check, absent for a check Grade10 staff performed |
| Performed by | The staff member who checked, or the provider's check when no person did |
| Performed at | When the check was made |

#### Scenario: grade10-site-e-kyc-identity-record-SC-01 - A staff check names the staff member who made it

- **WHEN** a member of staff records an identity check with the document in
  front of them
- **THEN** the verified identity names Grade10 staff as the provider, names that
  staff member as who performed it, and carries no provider reference

#### Scenario: grade10-site-e-kyc-identity-record-SC-02 - A provider check names the provider and its reference

- **WHEN** a verification provider's approved verdict becomes a verified
  identity
- **THEN** the verified identity names that provider, carries the provider's own
  identifier for the check, and names no staff member as having performed it

### Requirement: The raw document number never lands

The system SHALL derive a mask and a keyed digest from a document number and
retain neither the number itself nor anything it can be recovered from. The
number SHALL NOT be stored, returned to any caller, or written to any log or
audit entry, whoever supplied it — a member of staff, a collector, or a
verification provider.

#### Scenario: grade10-site-e-kyc-identity-record-SC-03 - A recorded check answers with a mask

- **WHEN** an identity check is recorded from a document number
- **THEN** what is stored and what is returned is the masked number and the
  digest
- **AND** no surface, log or audit entry holds the number itself

#### Scenario: grade10-site-e-kyc-identity-record-SC-04 - The same document is recognisable across two records

- **GIVEN** two verified identities recorded from the same document number
- **WHEN** their digests are compared
- **THEN** they match, so a repeated document can be found
- **AND** neither digest yields the number it was derived from

### Requirement: A verified identity belongs to the person, not to a case

The system SHALL answer a request for a person's most recent verified identity
across every product, regardless of which product recorded it. Recording,
binding and releasing SHALL be scoped to the asking product's own cases, and a
product SHALL NOT bind, read or release a binding belonging to another product.

#### Scenario: grade10-site-e-kyc-identity-record-SC-05 - A second product reads a check the first recorded

- **GIVEN** a verified identity recorded on a vault case
- **WHEN** another product asks for that person's most recent verified identity
- **THEN** it is answered with that record, without a second document check

#### Scenario: grade10-site-e-kyc-identity-record-SC-06 - A product cannot reach another product's case binding

- **GIVEN** a case belonging to one product
- **WHEN** another product asks to read, bind or release the identity on that
  case
- **THEN** the request is refused, and no input the asking product supplies
  selects a case it does not own

### Requirement: A case binds exactly one verified identity

The system SHALL allow a case to hold one verified identity at a time. Binding
an identity to a case that already holds one SHALL replace the binding rather
than add a second, SHALL leave the displaced identity on file, and SHALL name
the displaced identity to the caller so the owning product decides whether it is
evidence to restore or a leftover to discard. A verified identity nothing binds
any more SHALL be purged when the product that displaced it says so.

#### Scenario: grade10-site-e-kyc-identity-record-SC-07 - Re-recording a case replaces its identity

- **GIVEN** a case bound to a verified identity
- **WHEN** a second identity is bound to that case
- **THEN** the case holds the second identity alone
- **AND** the first is still on file and is named to the product that displaced
  it

#### Scenario: grade10-site-e-kyc-identity-record-SC-08 - A repeated bind converges on one binding

- **GIVEN** a bind that failed after the identity was stored
- **WHEN** the product retries it
- **THEN** the case holds one binding, not two, and one identity is left
  unbound rather than a second photograph kept

### Requirement: An identity check refuses a minor and an expired document

The system SHALL refuse to record or bind a verified identity when the person
had not reached 18 years of age, or when the document had expired, judged at the
time the asking product states. A document with no expiry SHALL be treated as
valid. Both refusals SHALL be applied to a verification provider's verdict as
they are to a check Grade10 staff performed, on Grade10's own reading of the
date of birth and expiry rather than on the provider's verdict alone.

#### Scenario: grade10-site-e-kyc-identity-record-SC-09 - A person under 18 is refused

- **WHEN** an identity check is recorded for a person who had not reached 18 on
  the day of the check
- **THEN** it is refused as under age, and no verified identity and no evidence
  are stored

#### Scenario: grade10-site-e-kyc-identity-record-SC-10 - A document that expired before today is refused

- **WHEN** an identity check is recorded from a document whose expiry is before
  the day of the check
- **THEN** it is refused as expired, and no verified identity and no evidence are
  stored

#### Scenario: grade10-site-e-kyc-identity-record-SC-11 - A document valid on its last day is accepted

- **WHEN** an identity check is recorded on the day the document expires
- **THEN** it is accepted, because a document is honoured on the date it reads
  valid until

#### Scenario: grade10-site-e-kyc-identity-record-SC-12 - An aged record is refused on reuse

- **GIVEN** a verified identity whose document has expired since it was recorded
- **WHEN** a product asks to bind it to a new case
- **THEN** it is refused as expired, judged at the day of the request rather
  than the day of the check

#### Scenario: grade10-site-e-kyc-identity-record-SC-13 - A provider's approval of a minor is still refused

- **GIVEN** a verification provider that approves a check for a person under 18
- **WHEN** the verdict is read
- **THEN** it is refused as under age, and no verified identity is created

### Requirement: Every verified identity names evidence Grade10 holds

The system SHALL store the photograph of the document the check was made
against, in Grade10's own evidence store, and SHALL NOT hold a verified identity
that names none. Where a verification provider performed the check, its copies
of the document images SHALL be fetched into that store before the identity
becomes readable; a verdict whose images cannot be fetched SHALL NOT become a
verified identity and SHALL be retried until they are.

#### Scenario: grade10-site-e-kyc-identity-record-SC-14 - Evidence is stored before the identity is readable

- **WHEN** an identity check is recorded
- **THEN** the photograph is in Grade10's evidence store before any product can
  read the verified identity

#### Scenario: grade10-site-e-kyc-identity-record-SC-15 - A provider verdict whose images cannot be fetched creates nothing

- **GIVEN** an approved verdict from a verification provider
- **WHEN** its document images cannot be fetched
- **THEN** no verified identity exists and no case is bound
- **AND** the fetch is retried, so a provider outage delays the check rather
  than losing it

#### Scenario: grade10-site-e-kyc-identity-record-SC-16 - The evidence is reachable only through the case that holds it

- **GIVEN** a verified identity bound to one product's case
- **WHEN** a product asks for the photograph naming a case it has not bound to
  that identity
- **THEN** nothing is returned, because naming an identity is not what
  authorizes reading its evidence

### Requirement: Releasing the last binding erases the check everywhere

The system SHALL purge a verified identity, its evidence, and — where a
verification provider performed the check — the provider's own copy of it, once
no case binding names that identity. A release SHALL be repeatable without
error, and SHALL NOT report itself complete while any copy remains, in Grade10's
store or at the provider.

#### Scenario: grade10-site-e-kyc-identity-record-SC-17 - The last release purges the record and its evidence

- **GIVEN** a verified identity bound to one case
- **WHEN** that product releases its binding
- **THEN** the record and its photograph are purged

#### Scenario: grade10-site-e-kyc-identity-record-SC-18 - A record another case still binds survives a release

- **GIVEN** a verified identity bound to two products' cases
- **WHEN** one product releases its binding
- **THEN** the record and its photograph are kept, because a live binding still
  names them

#### Scenario: grade10-site-e-kyc-identity-record-SC-19 - A provider's copy is erased with ours

- **GIVEN** a verified identity a verification provider performed
- **WHEN** its last binding is released
- **THEN** the provider is asked to erase its copy of that check
- **AND** the release is not complete until the provider confirms it

#### Scenario: grade10-site-e-kyc-identity-record-SC-20 - A release repeats without error

- **GIVEN** a case whose binding is already released
- **WHEN** the release is asked for again
- **THEN** it succeeds and changes nothing, so an interrupted erasure finishes
  when it is retried
