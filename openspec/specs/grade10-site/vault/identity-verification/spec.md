# grade10-site/vault/identity-verification Specification

## Purpose

Who the person signing for a case is: a check a member of staff makes at the
counter against a document in their hand, held in the identity store and only
referenced by the case.

The check gates the paper — an agreement is entered by somebody who may enter
one, holding a document that is currently valid — and is deliberately not a
screening programme. What the paper does with the name is
`grade10-site/vault/documents-and-signing`.

## Feature set

- The check at the counter
  - Read off the document: the legal name typed character for character, the
    birth date, the type, the number, the expiry and one photograph
  - Two methods: in person, or from a document the customer uploaded, and the
    certificate says which
  - Nothing else asked: no address, no screening, no monitoring
- What it refuses
  - Under eighteen: nobody below the age of majority enters an agreement
  - An expired document: judged on the shop's own day, at every act that leads
    to a signature
  - Never at release: a lapsed document is no reason to keep somebody's
    property
- Where it lives
  - Keyed to a person: every case belongs to an account, so every check
    reaches that person's erasure
  - Nothing on the case: the case holds a reference, and the person's facts
    stay in the identity store
  - Rebinding: re-recording replaces the case's check and the displaced one is
    discarded durably
- Reuse and duplicates
  - A returning customer: their latest check binds to a new case without a new
    photograph
  - The same document elsewhere: answered with a count, flagged for the
    counter, and refused never
- Reading the photograph
  - Its own grant: the identity photograph is behind the identity read grant
  - Every read recorded: each download is on the case's audit trail

## Requirements

### Requirement: Staff record the identity check at the counter

Staff holding the vault operate grant SHALL record an identity check against a
case that has not yet reached custody — a case that is a draft, submitted,
being valued, holding an offer, accepted, or signing.

The check SHALL carry exactly:

| Fact | Rule |
| --- | --- |
| Legal name | as read off the document, character for character |
| Date of birth | a calendar day |
| Document type | passport, national identity card, driving licence or residence permit |
| Document number | as read off the document; the raw number is never kept by the vault |
| Expiry | a calendar day, or none where the document does not expire |
| Photograph | one image of the document, within the identity store's own limits |
| Method | in person, or from an upload |
| Verifier | the staff member's id and the name they are called by |

Nothing else about the person SHALL be asked for or stored: no address, no
nationality, no occupation, no purpose, no source of funds, no sanctions or
politically-exposed-person screening, and no ongoing monitoring.

Recording a check again on the same case SHALL replace the case's check rather
than add a second, and the check it displaces SHALL be discarded durably.

#### Scenario: grade10-site-vault-identity-verification-SC-01 - A check binds to the case
**Serves:** grade10-site-vault-identity-verification-US-01 - Operator checks who is standing at the counter

- **WHEN** staff record a check against a case being valued
- **THEN** the case names that check and the counter sees the verified name

#### Scenario: grade10-site-vault-identity-verification-SC-02 - Recording again rebinds rather than duplicating

- **GIVEN** a case already carrying a check
- **WHEN** staff record another
- **THEN** the case carries exactly one check and the displaced one is discarded

#### Scenario: grade10-site-vault-identity-verification-SC-03 - A case in custody takes no new check

- **GIVEN** a case whose item is in the vault
- **WHEN** staff try to record a check
- **THEN** it is refused by name

### Requirement: Two refusals gate every act that leads to a signature

An identity SHALL be refused by name when the person is under 18, and when the
document had expired on the day of the act. Both SHALL be judged on the
brand's own calendar day.

Both SHALL be applied when the check is recorded, when a check is reused onto
another case, and again when a packet is prepared from it. Neither SHALL be
applied when the item is released: discharging an agreement asks neither.

#### Scenario: grade10-site-vault-identity-verification-SC-04 - Under eighteen is refused
**Serves:** grade10-site-vault-identity-verification-US-01 - Operator checks who is standing at the counter

- **WHEN** a check is recorded for somebody whose eighteenth birthday has not passed on the shop's day
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-identity-verification-SC-05 - A birthday is judged on the shop's day

- **GIVEN** a person whose eighteenth birthday is today at the shop and tomorrow in Coordinated Universal Time
- **WHEN** their identity is judged
- **THEN** they are an adult

#### Scenario: grade10-site-vault-identity-verification-SC-06 - A document that lapsed before the signature is refused
**Serves:** grade10-site-vault-identity-verification-US-01 - Operator checks who is standing at the counter

- **GIVEN** a case whose check was recorded against a document that has since expired
- **WHEN** a packet is prepared
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-identity-verification-SC-07 - A lapsed document does not hold somebody's property
**Serves:** grade10-site-vault-identity-verification-US-04 - Collector collects an item on a passport that has since lapsed

- **GIVEN** a case in the vault whose customer's document has expired
- **WHEN** the release is prepared and signed
- **THEN** neither refusal applies and the item goes home

### Requirement: The person's facts stay in the identity store

A case SHALL hold a reference to its check and nothing about the person. The
name, birth date, document type, expiry, photograph, the masked number and the
keyed digest of it SHALL live in the identity store, and the raw number SHALL
never be kept.

Every case SHALL belong to an account, so every check SHALL be reachable from
that account's erasure request. There SHALL be no identity keyed to a case
alone.

#### Scenario: grade10-site-vault-identity-verification-SC-08 - The case says nothing about the person
**Serves:** grade10-site-vault-identity-verification-US-01 - Operator checks who is standing at the counter

- **WHEN** a case carrying a check is read
- **THEN** it names the check and carries no name, birth date or document number of its own

### Requirement: A returning customer's check is reused

Staff SHALL be able to bind a customer's latest check to a new case without
taking a new photograph, under the same two refusals judged at the moment of
reuse.

A case with no account behind it SHALL have nothing to reuse from.

#### Scenario: grade10-site-vault-identity-verification-SC-09 - The last check binds to the new case
**Serves:** grade10-site-vault-identity-verification-US-02 - Returning customer is not asked for their passport again

- **GIVEN** a customer whose previous case carries a valid check
- **WHEN** staff reuse it on a new case
- **THEN** the new case names that check and no new photograph was taken

#### Scenario: grade10-site-vault-identity-verification-SC-10 - A check that has aged out cannot be reused
**Serves:** grade10-site-vault-identity-verification-US-02 - Returning customer is not asked for their passport again

- **GIVEN** a customer whose last check was made against a document that has since expired
- **WHEN** staff reuse it
- **THEN** it is refused by name

### Requirement: The same document under another account is flagged, never refused

Every binding SHALL be answered with how many other accounts hold a check
against the same document. Where that count is not zero the case SHALL record
a staff-only entry carrying the count, and the case SHALL be flagged for the
counter.

Nothing SHALL be refused for it, and which accounts they are SHALL never leave
the identity store.

#### Scenario: grade10-site-vault-identity-verification-SC-11 - A duplicate document flags the case
**Serves:** grade10-site-vault-identity-verification-US-03 - Operator is warned when one document is on several accounts

- **GIVEN** a document already held under two other accounts
- **WHEN** a check against it is bound to a case
- **THEN** the case records the count for staff, the case is flagged, and the binding stands

#### Scenario: grade10-site-vault-identity-verification-SC-12 - The other accounts are never named
**Serves:** grade10-site-vault-identity-verification-US-03 - Operator is warned when one document is on several accounts

- **WHEN** the duplicate flag is read
- **THEN** it carries a count and no account, on any surface

### Requirement: A case carrying sealed evidence keeps the identity it was executed under

A case that holds a sealed document SHALL refuse a new identity check by name.
Where a seal lands between a check being taken and it being written down, the
case's own binding SHALL stand and the check just taken SHALL be discarded.

#### Scenario: grade10-site-vault-identity-verification-SC-13 - A signed case refuses a re-record
**Serves:** grade10-site-vault-identity-verification-US-04 - Collector collects an item on a passport that has since lapsed

- **GIVEN** a case carrying a sealed agreement
- **WHEN** staff try to record another check
- **THEN** it is refused by name and the case keeps the identity its agreement was executed under

### Requirement: The identity photograph is read under its own grant, and every read is recorded

The identity photograph SHALL be readable only by an operator holding the
identity read grant, and every read SHALL be recorded on the case's audit
trail naming who read it and when.

#### Scenario: grade10-site-vault-identity-verification-SC-14 - A read without the grant is refused

- **WHEN** an operator without the identity read grant asks for the photograph
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-identity-verification-SC-15 - A read leaves a trail

- **WHEN** an operator holding the grant downloads the photograph
- **THEN** the case's audit trail names them and the instant
