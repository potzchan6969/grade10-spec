## Purpose

The identity check a collector completes on their own device before they visit a
store — invited by Grade10, hosted and decided by a verification provider, and
returned as a verdict that becomes a verified identity without anybody waiting
for it.

## Feature set

- The invitation
  - One person, one case: a link that opens the check it was sent for and no other
  - A life of its own: an invitation expires, and a new one is a new check
- The ceremony
  - Hosted away from Grade10: the provider captures the document and the face
  - Resumable: an interrupted check continues rather than starting over
- The verdict
  - Trusted narrowly: signed by the provider, about a check Grade10 issued, acted on once
  - Judged again here: age and document validity are Grade10's refusals, not the provider's
- Where a check stands
  - States: what the collector is told, and what the case shows
  - Unfinished checks: expire, and can be asked for again
- The counter is never gated
  - Always available: staff can check a document in front of them whatever the hosted check did

## ADDED Requirements

### Requirement: A collector verifies themselves before the visit

The system SHALL let a collector complete an identity check away from a Grade10
store, in this order.

1. *Grade10* — **Invite the collector**, when their case asks for a check, at
   the contact details the case holds
2. *Collector* — **Open the invitation** on their own device, at a time of their
   choosing
3. *Provider* — **Host the check**, capturing the document and the collector's
   face, and decide it
4. *Grade10* — **Read the verdict** when it arrives, apply its own refusals, and
   fetch the document images into its own evidence store
5. *Grade10* — **Bind the verified identity** to the case the invitation named,
   and show the collector and the case that it is done

The collector SHALL NOT be required to be signed in to Grade10 to complete the
check, and SHALL NOT be asked for any detail the provider itself collects.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-01 - A collector completes the check before arriving

- **GIVEN** a case that has asked for an identity check
- **WHEN** the collector opens the invitation and completes the provider's check
- **AND** the provider approves it
- **THEN** the case holds a verified identity before the visit, naming that
  provider

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-02 - Grade10 asks for nothing the provider collects

- **WHEN** a collector walks the hosted check
- **THEN** no Grade10 surface asks them for their document number, its expiry or
  a photograph of it

### Requirement: An invitation names one person and one case

The system SHALL issue an invitation that opens the check for the case it was
issued for and no other, and SHALL refuse an invitation that has been completed,
withdrawn or expired. An invitation SHALL NOT be guessable from another
invitation, a case reference, or anything a collector is shown.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-03 - An invitation opens the check it names

- **WHEN** a collector opens their invitation
- **THEN** the check that opens is the one issued for their case, and nothing
  they supply selects another case or another person

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-04 - A completed invitation does not open again

- **GIVEN** an invitation whose check has been decided
- **WHEN** it is opened again
- **THEN** it does not start a new check, and the collector is shown where their
  check stands

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-05 - An expired invitation is refused

- **GIVEN** an invitation past its life
- **WHEN** the collector opens it
- **THEN** it is refused as expired, and the collector is told how to be invited
  again

### Requirement: An identity check moves through these states

The system SHALL hold one hosted check in exactly one of these states, and SHALL
show the collector and the case which.

| State | Meaning | Moves to |
| --- | --- | --- |
| Invited | The collector has been asked and has not started | Started, Expired, Withdrawn |
| Started | The collector opened the check and has not finished it | Submitted, Expired, Withdrawn |
| Submitted | The collector finished; the provider has not decided | Approved, Declined |
| Approved | The provider vouched, and Grade10's own refusals passed | — |
| Declined | The provider refused, or Grade10's own refusals did | — |
| Expired | The invitation or the started check ran out of time | — |
| Withdrawn | The case no longer needs the check | — |

Approved, Declined, Expired and Withdrawn SHALL be final: a collector who needs
another chance is invited again, as a new check.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-06 - An unopened invitation expires

- **GIVEN** a check in Invited that the collector never opens
- **WHEN** its life runs out
- **THEN** it is Expired, and no verified identity exists

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-07 - An abandoned check expires rather than waiting forever

- **GIVEN** a check in Started that the collector does not finish
- **WHEN** its life runs out
- **THEN** it is Expired, and the case may be invited again

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-08 - A decided check does not move again

- **GIVEN** a check in Approved or Declined
- **WHEN** anything asks it to move
- **THEN** it stays where it is, and a further attempt at that case is a new
  check with its own invitation

### Requirement: A case has one live check at a time

The system SHALL allow a case at most one check in Invited, Started or
Submitted. Asking for a check while one is live SHALL answer with the live check
rather than issuing a second, and withdrawing the live check SHALL be what
precedes issuing a new one.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-09 - Asking twice does not invite twice

- **GIVEN** a case with a check in Invited
- **WHEN** a check is asked for again
- **THEN** the live check is answered with, and the collector holds one working
  invitation

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-10 - A withdrawn check frees the case to be invited again

- **GIVEN** a case with a live check
- **WHEN** the check is withdrawn and a new one asked for
- **THEN** the old invitation no longer opens, and the new one does

### Requirement: A verdict is trusted only as the provider's, about a check Grade10 issued, once

The system SHALL act on a verdict only when it is proven to come from the
verification provider, names a check Grade10 itself issued, and has not been
acted on before. A verdict failing any of those SHALL change nothing and SHALL
be recorded as rejected. A verdict repeated by the provider SHALL leave the same
result as the first, so a provider's retries are safe.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-11 - An unproven verdict changes nothing

- **WHEN** a verdict arrives that cannot be proven to come from the provider
- **THEN** nothing about the check changes, no identity is created, and the
  attempt is recorded as rejected

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-12 - A verdict for a check nobody issued changes nothing

- **WHEN** a proven verdict names a check Grade10 did not issue
- **THEN** nothing is created, and the attempt is recorded as rejected

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-13 - A repeated verdict is applied once

- **GIVEN** an approved verdict already applied
- **WHEN** the provider sends the same verdict again
- **THEN** the check stays Approved, one verified identity exists, and no second
  photograph is stored

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-14 - A verdict that arrives late is still applied

- **GIVEN** a check in Submitted whose verdict was delayed
- **WHEN** the verdict arrives
- **THEN** it is applied, because Submitted has no life of its own — only
  Invited and Started expire

### Requirement: Grade10 decides age and document validity itself

The system SHALL apply its own refusals to an approved verdict — the person is
an adult and the document is still valid — reading the date of birth and expiry
the provider returns. A verdict failing either SHALL leave the check Declined,
SHALL create no verified identity, and SHALL say which refusal it was to the
operator.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-15 - An approved verdict for a minor is Declined

- **GIVEN** a provider verdict approving a person under 18
- **WHEN** it is read
- **THEN** the check is Declined as under age and no verified identity exists

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-16 - An approved verdict on an expired document is Declined

- **GIVEN** a provider verdict approving a document whose expiry has passed
- **WHEN** it is read
- **THEN** the check is Declined as expired and no verified identity exists

### Requirement: The collector is told where their check stands

The system SHALL show the collector the state of their check whenever they open
their invitation, and SHALL tell them what to do next for every state that has a
next step — start it, finish it, ask to be invited again, or bring the document
to the store.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-17 - A collector returning mid-check is shown where they are

- **GIVEN** a check in Started
- **WHEN** the collector opens the invitation again
- **THEN** they continue the provider's check rather than starting a new one

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-18 - A declined collector is told what to do next

- **GIVEN** a check in Declined
- **WHEN** the collector opens the invitation
- **THEN** they are told the check did not pass and that the document can be
  checked at the store

### Requirement: The hosted check never gates the counter

The system SHALL allow a member of staff to record an identity check with the
document in front of them at any point the case allows one, whatever state a
hosted check on that case is in, and SHALL NOT require a hosted check to have
been attempted first. A counter check recorded while a hosted check is live
SHALL withdraw the hosted check.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-19 - Staff record a check while a hosted one is live

- **GIVEN** a case with a check in Invited or Started
- **WHEN** staff record an identity check at the counter
- **THEN** the case holds the identity staff recorded
- **AND** the hosted check is Withdrawn, so the collector's old invitation no
  longer opens

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-20 - A declined hosted check leaves the counter open

- **GIVEN** a case whose hosted check is Declined
- **WHEN** staff record an identity check at the counter
- **THEN** it is accepted on the case's own rules, and the declined check stays
  on record beside it

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-21 - A provider outage does not stop a visit

- **GIVEN** a provider that cannot be reached
- **WHEN** a collector arrives for their visit unverified
- **THEN** staff record the check at the counter and the case proceeds
