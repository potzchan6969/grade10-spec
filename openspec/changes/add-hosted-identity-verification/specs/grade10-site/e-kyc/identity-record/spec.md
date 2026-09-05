## Purpose

The verified identity of a person — their legal name, date of birth, document
type, masked document number, its expiry, and a photograph of the document —
held once and reused by every Grade10 service that needs to know who somebody
is, so the same human is never asked for the same document twice.

A **consumer** is a Grade10 service that asks the store about a person: one
that records identity checks and binds them to its own cases, as the vault
does, or one that only asks whether a person is verified, as the store and
the auction do. A **person** is the account
`shared/auth/users` identifies, or, where a consumer's case names no account,
the case itself — and a record made for such a case is reusable only by it. A date of birth and a document expiry are
calendar days as `shared/dates-and-times` defines them, judged in the
platform's UTC day.

## Feature set

- What a record holds
  - Identity fields: the name a document prints, the day a person was born, and what proved it
  - Provenance: which consumer recorded the check and who performed it, so a reader can weigh it
  - Provider findings: each check a verification provider ran, under the provider's own name, and whether it passed
- What never lands
  - Document number: only a mask a person is shown and a keyed digest a repeat is recognised by
  - The person's face: a provider may capture one; Grade10 keeps the finding, never the image
- Reuse across consumers
  - Person-wide read: the most recent check, whichever consumer recorded it
  - Case binding: one case holds one identity, so what displaces is settled rather than lost
- Refusals
  - Age and validity: an adult, holding a document still valid at the instant the check is applied
- Evidence
  - Held by Grade10: one image of the document, in Grade10's own store, before the identity is readable
- Erasure
  - Two clocks: the consumer's release commands the provider to erase its copy, and a standing window erases it anyway

## ADDED Requirements

### Requirement: A verified identity holds one person's checked details

The system SHALL hold a verified identity as a record of one identity check,
carrying these fields. An operator's own note about the check MAY be held
beside them and SHALL NOT be returned to any consumer.

| Field | Meaning |
| --- | --- |
| Person | Who the check is about |
| Legal name | As printed on the document, verbatim |
| Date of birth | A calendar day, with no time and no time zone |
| Document type | Passport, national ID, driving licence, or residence permit |
| Document number, masked | What a person is shown in place of the number |
| Document number, digest | A keyed digest, so a repeat of the same document is a question that can be asked |
| Document expiry | The day the document stops being valid, or absent for one that never expires |
| Evidence | One image of the document, held by Grade10 |
| Recorded by consumer | Which consumer's surface the check was made on |
| Method | Whether the document was seen in person or as an uploaded scan |
| Provider | Who performed the check — Grade10 staff, or a named verification provider |
| Provider reference | The provider's own identifier for the check, absent for a check Grade10 staff performed |
| Performed by | The staff member who checked, or, for a provider's check, the person who asked for it |
| Performed at | When the check was decided — the staff member's clock, or the provider's decision instant |
| Provider findings | Each check the provider ran, under the provider's own name, and whether it passed or failed; absent for a check Grade10 staff performed |

#### Scenario: grade10-site-e-kyc-identity-record-SC-01 - A staff check names the staff member who made it

- **WHEN** a member of staff records an identity check with the document in
  front of them
- **THEN** the verified identity names Grade10 staff as the provider, names that
  staff member as who performed it, and carries no provider reference

#### Scenario: grade10-site-e-kyc-identity-record-SC-02 - A provider check names the provider, its reference, and who asked

- **WHEN** a verification provider's approved verdict becomes a verified
  identity
- **THEN** the verified identity names that provider, carries the provider's own
  identifier for the check, and names the person who asked for the check as who
  performed it

### Requirement: The raw document number never lands

The system SHALL derive a mask and a keyed digest from a document number and
retain neither the number itself nor anything it can be recovered from. The mask
SHALL keep a stated number of characters at each end of the number, decided by
document type, and replace every character between them with a fixed masking
character. A number too short for its rule to hide at least half of itself SHALL
be masked whole, so a rule never reveals more than it hides.

| Document type | Kept at the start | Kept at the end |
| --- | --- | --- |
| Passport | 2 | 1 |
| National ID | 1 | 3 |
| Driving licence | 0 | 4 |
| Residence permit | 1 | 2 |

The digest SHALL be derived from the document type and the number together, so
the same number recorded under two document types is two documents and not one.
The number SHALL NOT be stored,
returned to any caller, or written to any log or audit entry, whoever supplied
it — a member of staff, a collector, or a verification provider — and a verdict
carrying one SHALL NOT be retained in the form it arrived in.

#### Scenario: grade10-site-e-kyc-identity-record-SC-03 - A recorded check answers with a mask

- **WHEN** an identity check is recorded from a document number
- **THEN** what is stored and returned is a mask keeping only that document
  type's stated characters at each end, every character between them replaced,
  and a keyed digest
- **AND** a number too short for its rule to hide half of itself is masked whole
- **AND** no stored record, response, log or audit entry written while recording
  the check holds any other character of the number

#### Scenario: grade10-site-e-kyc-identity-record-SC-04 - The same document is recognisable across two records

- **GIVEN** two verified identities recorded from the same document type and
  number
- **WHEN** their digests are compared
- **THEN** they match, so a repeated document can be found
- **AND** the same number recorded under a different document type does not
  match
- **AND** the digest is derived with a secret the identity store holds, so the
  same number digested without that secret does not match

### Requirement: A verified identity belongs to the person, not to a case

The system SHALL answer a request for a person's most recent verified identity
across every consumer, regardless of which one recorded it, resolving "most
recent" by when the check was performed and, where two are equal, by a stable
order that answers the same way every time. Recording, binding and releasing
SHALL be scoped to the asking consumer's own cases, and a consumer SHALL NOT
bind, read or release a binding belonging to another consumer.

#### Scenario: grade10-site-e-kyc-identity-record-SC-05 - A second consumer reads a check the first recorded

- **GIVEN** a verified identity recorded on a vault case
- **WHEN** another consumer asks for that person's most recent verified identity
- **THEN** it is answered with that record, without a second document check

#### Scenario: grade10-site-e-kyc-identity-record-SC-06 - A consumer cannot reach another consumer's case binding

- **GIVEN** a case belonging to one consumer
- **WHEN** another consumer asks to read, bind or release the identity on that
  case
- **THEN** the request is refused, and no input the asking consumer supplies
  selects a case it does not own

### Requirement: A case binds exactly one verified identity

The system SHALL allow a case to hold one verified identity at a time. Binding
an identity to a case that already holds one SHALL replace the binding rather
than add a second, SHALL leave the displaced identity on file, and SHALL name
the displaced identity to the caller so the owning consumer decides whether it is
evidence to restore or a leftover to discard. A bind carrying a request key SHALL
be applied once; a repeat of that key SHALL answer with the first attempt's
result rather than binding again.

#### Scenario: grade10-site-e-kyc-identity-record-SC-07 - Re-recording a case replaces its identity

- **GIVEN** a case bound to a verified identity
- **WHEN** a second identity is bound to that case
- **THEN** the case holds the second identity alone
- **AND** the first is still on file and is named to the consumer that displaced
  it

#### Scenario: grade10-site-e-kyc-identity-record-SC-08 - A repeated bind converges on one binding

- **GIVEN** a case with no identity, and a bind carrying a request key
- **WHEN** the same request key is submitted twice, the first attempt having
  stored the identity before failing
- **THEN** the case holds one binding, the second attempt answers with the
  first's result, and exactly one identity and one image exist

### Requirement: An identity check refuses a minor and an expired document

The system SHALL refuse to record or bind a verified identity when the person
had not reached 18 years of age, or when the document had expired, judged at the
instant the check is applied — the staff member's clock at the counter, the
instant a verdict is read for a provider's check, and the instant a stored
identity is bound to a further case — never the instant the collector submitted
or the provider decided. A document with no expiry SHALL be treated as
valid. Both refusals SHALL be applied to a verification provider's verdict as
they are to a check Grade10 staff performed, on Grade10's own reading of the date
of birth and expiry rather than on the provider's verdict.

#### Scenario: grade10-site-e-kyc-identity-record-SC-09 - A person under 18 is refused

- **WHEN** an identity check is recorded for a person who had not reached 18 on
  the day the check is applied
- **THEN** it is refused as under age, and no verified identity and no evidence
  are stored

#### Scenario: grade10-site-e-kyc-identity-record-SC-10 - A document that expired before today is refused

- **WHEN** an identity check is recorded from a document whose expiry is before
  the day the check is applied
- **THEN** it is refused as expired, and no verified identity and no evidence are
  stored

#### Scenario: grade10-site-e-kyc-identity-record-SC-11 - A document valid on its last day is accepted

- **WHEN** an identity check is applied on the day the document expires
- **THEN** it is accepted, because a document is honoured on the date it reads
  valid until

#### Scenario: grade10-site-e-kyc-identity-record-SC-12 - An aged record is refused on reuse

- **GIVEN** a verified identity whose document has expired since it was recorded
- **WHEN** a consumer asks to bind it to a new case
- **THEN** it is refused as expired, judged at the day of the request rather
  than the day of the check

#### Scenario: grade10-site-e-kyc-identity-record-SC-13 - A provider's approval of a minor is still refused

- **GIVEN** a verification provider that approves a check for a person under 18
- **WHEN** the verdict is read
- **THEN** it is refused as under age, and no verified identity is created

### Requirement: Every verified identity names one document image Grade10 holds

The system SHALL store one image of the document the check was made against, in
Grade10's own evidence store, and SHALL NOT hold a verified identity that names
none. Where a verification provider performed the check, that image SHALL be
fetched into that store before the identity becomes readable. The capture of the
person's face SHALL NOT be fetched or stored by Grade10.

A verdict whose document image cannot be fetched SHALL create no verified
identity and SHALL be retried a stated number of times, and SHALL then become
visible to an operator rather than retried indefinitely. ❓ How many attempts a
fetch is given is `TBC` — *Owner: Product*. A verdict whose
image the evidence store may not hold — the wrong kind of file, or one larger
than the store accepts — SHALL leave the check declined rather than retried.

#### Scenario: grade10-site-e-kyc-identity-record-SC-14 - A read never answers before the evidence is stored

- **GIVEN** a verified identity a provider performed, whose document image
  Grade10 has not yet fetched
- **WHEN** a consumer reads it
- **THEN** it is not answered until that image is retrievable from Grade10's
  evidence store

#### Scenario: grade10-site-e-kyc-identity-record-SC-15 - A provider verdict whose image cannot be fetched creates nothing

- **GIVEN** an approved verdict from a verification provider
- **WHEN** its document image cannot be fetched
- **THEN** no verified identity exists and no case is bound
- **AND** the fetch is retried, and the check is reported to an operator once
  the attempts allowed for it are spent

#### Scenario: grade10-site-e-kyc-identity-record-SC-16 - The evidence is reachable only through the case that holds it

- **GIVEN** a verified identity bound to one consumer's case
- **WHEN** a consumer asks for the document image naming a case it has not bound
  to that identity
- **THEN** the request is refused, no image and no identity field are returned,
  and the refusal says nothing about whether that identity exists

#### Scenario: grade10-site-e-kyc-identity-record-SC-21 - An image the evidence store may not hold declines rather than retries

- **GIVEN** an approved verdict whose document image is not one of the kinds the
  evidence store accepts, or is larger than it accepts
- **WHEN** the image is fetched
- **THEN** the check is declined with that reason recorded, no verified identity
  exists, and the fetch is not retried

#### Scenario: grade10-site-e-kyc-identity-record-SC-22 - No face capture is stored

- **GIVEN** a verification provider that captured the person's face
- **WHEN** its approved verdict becomes a verified identity
- **THEN** Grade10's evidence store holds the document image and no image of the
  person's face

### Requirement: A provider-performed check records what was checked and what was found

The system SHALL record, for a check a verification provider performed, each
check the provider ran under the provider's own name for it and whether it
passed or failed — nothing dropped for want of a translation, and nothing the
provider attached to a finding beyond its name and outcome — and SHALL make
them readable to an operator reading the case, without asking the provider. A
declined check that produced no record SHALL keep its findings on the check.

#### Scenario: grade10-site-e-kyc-identity-record-SC-23 - The provider's findings survive the provider

- **GIVEN** a verified identity a verification provider performed
- **WHEN** an operator reads it, with the provider unreachable
- **THEN** they are shown what the provider checked and what each check found

### Requirement: Erasure reaches the provider that performed the check

The system SHALL purge a verified identity and its evidence once no case binding
names that identity, and SHALL command the verification provider that performed
it to erase its own copy of the check. It SHALL retain what it needs to name that
check to the provider until the provider has acknowledged the command, and SHALL
keep asking until one does. Purging the record, its evidence, and the erasing
consumer's own data SHALL NOT wait on the provider's answer. A completion report
SHALL name what is still outstanding at a provider rather than reporting the
erasure whole. A release SHALL be repeatable without error.

The command SHALL be issued when a released identity's record is purged. A
check that ended without becoming an identity — declined, expired, withdrawn or
refused on landing — SHALL be left to the provider's standing window, so a
disputed decline stays reviewable at the provider until that window closes.

Erasing a consumer's own data SHALL also end any check still live for that case,
purge what that check holds about the person, and command the provider to erase
everything it holds on that person — every check of theirs at once — so no
invitation outlives the erasure and no identifier of an erased person is left
on a check nobody will finish.

#### Scenario: grade10-site-e-kyc-identity-record-SC-17 - The last release purges the record and commands the provider

- **GIVEN** a verified identity bound to one case
- **WHEN** that consumer releases its binding
- **THEN** the record and its document image are purged, and the provider is
  commanded to erase its copy

#### Scenario: grade10-site-e-kyc-identity-record-SC-18 - A record another case still binds survives a release

- **GIVEN** a verified identity bound to two consumers' cases
- **WHEN** one consumer releases its binding
- **THEN** the record and its document image are kept, because a live binding
  still names them

#### Scenario: grade10-site-e-kyc-identity-record-SC-19 - A provider that cannot be reached does not hold up the erasure

- **GIVEN** a released verified identity a verification provider performed
- **WHEN** the provider cannot be reached
- **THEN** Grade10's own record and image are already gone
- **AND** the command stays outstanding and is asked again until acknowledged

#### Scenario: grade10-site-e-kyc-identity-record-SC-20 - A release repeats without error

- **GIVEN** a case whose binding is already released
- **WHEN** the release is asked for again
- **THEN** it succeeds and changes nothing, so an interrupted erasure finishes
  when it is retried

#### Scenario: grade10-site-e-kyc-identity-record-SC-24 - A provider that refuses is reported rather than dropped

- **GIVEN** a provider that refuses to erase its copy, under a retention duty of
  its own
- **WHEN** the refusal is read
- **THEN** the refusal and its reason are recorded against the outstanding
  command, and a completion report names it as outstanding at the provider

#### Scenario: grade10-site-e-kyc-identity-record-SC-27 - An erased person's live check stops being live

- **GIVEN** a case holding a check that has been invited or started, and no
  verified identity
- **WHEN** that case's personal data is erased
- **THEN** the check is ended, its invitation opens nothing, and the check keeps
  no identifier of the person it was about

#### Scenario: grade10-site-e-kyc-identity-record-SC-25 - A check that never became an identity is left to the provider's window

- **GIVEN** a check the provider declined, whose findings an operator may still
  need to review
- **WHEN** the check reaches its ending
- **THEN** no erasure is commanded for it, and the provider's standing window is
  what erases its copy

#### Scenario: grade10-site-e-kyc-identity-record-SC-28 - Erasing a person commands their whole account away

- **GIVEN** a person with checks at the provider, on one or more cases
- **WHEN** their personal data is erased
- **THEN** the provider is commanded to erase everything it holds on that person,
  and the command stays outstanding until acknowledged

### Requirement: A provider holds its copy no longer than a stated window

The system SHALL have every verification provider it uses configured to erase
its own copy of a check within a stated window, so a check nobody erases still
stops existing at the provider. The provider offers no way to read that window
back, so it SHALL be set with the provider and recorded in the deployment
checklist before a deployment is enabled, and a deployment SHALL NOT be enabled
without it.

❓ The window's length awaits Compliance — it must outlive an operator's need to
review a disputed check, and it is `TBC` until they set it.

#### Scenario: grade10-site-e-kyc-identity-record-SC-26 - A provider's window is set before a deployment is enabled

- **WHEN** a deployment is enabled against a verification provider
- **THEN** the deployment checklist records the provider's erasure window as set
  to the stated one, and a deployment whose window is absent or longer is not
  enabled
