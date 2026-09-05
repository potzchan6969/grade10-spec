## Purpose

The identity check a collector completes on their own device before they visit a
store — invited by Grade10, hosted and decided by a verification provider, and
returned as a verdict that becomes a verified identity without anybody waiting
for it. What the check produces is defined by `grade10-site/e-kyc/identity-record`,
which also sets the two refusals every check answers to.

## Feature set

- The invitation
  - One person, one case: a link that opens the check it was sent for and no other
  - One live check: a case holds one at a time, so a collector never juggles two invitations
  - A life of its own: an invitation expires, and a new one is a new check
- The ceremony
  - Hosted away from Grade10: the provider captures the document and the face
  - Resumable: an interrupted check continues rather than starting over
- The verdict
  - Trusted narrowly: raised by Grade10, signed by the provider, about the case's live check, acted on once
  - Judged again here: age and document validity are Grade10's refusals, not the provider's
- Where a check stands
  - States: what the collector is told, and what the case shows
  - Stalled checks: a provider that never answers is a state, not a silence
- The counter is never gated
  - Always available: staff can check a document in front of them whatever the hosted check did
  - An override is recorded: a counter check over a refusal says so, and takes a higher grant

## ADDED Requirements

### Requirement: A collector verifies themselves before the visit

The system SHALL let a collector complete an identity check away from a Grade10
store, in this order.

1. *Grade10* — **Raise the check with the provider** and record the provider's
   own identifier for it, before the collector is invited
2. *Grade10* — **Invite the collector**, at the contact details the case holds
3. *Collector* — **Open the invitation** on their own device, at a time of their
   choosing
4. *Provider* — **Host the check**, capturing the document and the collector's
   face, and decide it
5. *Grade10* — **Read the verdict** when it arrives, apply its own refusals, and
   fetch the document image into its own evidence store
6. *Grade10* — **Bind the verified identity** to the case the check was raised
   for, and show the collector and the case that it is done

No field of an arriving verdict SHALL select which check, case or person the
verdict is about; only the identifier Grade10 recorded at step 1 SHALL resolve
it. The collector SHALL NOT be asked for any detail the provider itself
collects.

A check that cannot be raised with the provider SHALL invite nobody, SHALL leave
the case holding no live check, and SHALL be reported to an operator rather than
leaving the case reading as a check nobody answered.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-01 - A collector completes the check before arriving

- **GIVEN** a case that has asked for an identity check
- **WHEN** the collector opens the invitation and completes the provider's check
- **AND** the provider approves it
- **THEN** the case holds a verified identity before the visit, naming that
  provider

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-02 - Grade10 asks for nothing the provider collects

- **WHEN** a collector walks the hosted check
- **THEN** the collector's verification surface asks them for no document number,
  no expiry and no image of the document

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-27 - A check that cannot be raised invites nobody and is reported

- **GIVEN** a case with nothing to reuse and a verification provider that cannot
  be reached
- **WHEN** a check is asked for
- **THEN** no invitation is sent, the case holds no live check, and an operator
  is told the check could not be raised
- **AND** asking again once the provider answers raises one check and sends one
  invitation

### Requirement: An invitation names one person and one case

The system SHALL issue an invitation that opens the check it was issued for and
no other, and SHALL refuse an invitation that has been completed, withdrawn or
expired. The invitation SHALL carry a secret that cannot be guessed from another
invitation, a case reference, or anything a collector is shown, and that secret
SHALL NOT appear in a request path, a query string, a log, or a referrer sent to
the provider. Which device continues a check is the provider's own session to
decide — its ceremony hands itself from one device to another. What a
link-holder can read SHALL be the state and what to do next, and SHALL carry no
identity field and no reason a check was refused.

An invitation SHALL expire 14 days after it is issued. A check the collector has
opened and not yet submitted SHALL expire 24 hours after it was opened or when
the invitation's own life runs out, whichever comes first — a started check
SHALL NOT outlive the invitation that carried it. A submitted check SHALL NOT
expire on either clock. ❓ Both windows are `TBC` — they await Product (the
proposal's first open question), and no other value may be built until they are
set.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-03 - An invitation opens the check it names

- **WHEN** a collector opens their invitation on the first device to use it
- **THEN** the check that opens is the one raised for their case, and nothing
  they supply selects another case or another person

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-04 - A completed invitation does not open again

- **GIVEN** an invitation whose check has been decided
- **WHEN** it is opened again
- **THEN** it starts no check, and what is shown is the state and what to do
  next, naming no identity field and no reason

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-05 - An expired invitation is refused

- **GIVEN** an invitation past its life
- **WHEN** the collector opens it
- **THEN** it is refused as expired, and the collector is told how to be invited
  again

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-24 - The invitation's secret is left nowhere it can be read

- **WHEN** a collector opens their invitation and is handed on to the provider
- **THEN** the secret is in no request path, no query string, no log line, and
  no referrer the provider receives

### Requirement: An identity check moves through these states

The system SHALL hold one hosted check in exactly one of these states, and SHALL
show the collector and the case which.

| State | Meaning | Moves to |
| --- | --- | --- |
| Invited | The collector has been asked and has not started | Started, Expired, Withdrawn |
| Started | The collector opened the check and has not finished it | Submitted, Expired, Withdrawn |
| Submitted | The collector finished; the provider has not decided | Approved, Declined, Stalled, Withdrawn |
| Stalled | A submitted check the provider has not decided within the time it usually takes — a reading of Submitted from the check's own instants, not a state of its own | Approved, Declined, Expired, Withdrawn |
| Approved | The provider vouched, and Grade10's own refusals passed | — |
| Declined | The provider refused, Grade10's own refusals did, or the case could not take the verdict | — |
| Expired | The invitation or the started check ran out of time | — |
| Withdrawn | The case no longer needs the check | — |

Approved, Declined, Expired and Withdrawn SHALL be final: a collector who needs
another chance is invited again, as a new check. A check in Submitted SHALL NOT
expire on its own — a verdict may still arrive — and SHALL become Stalled
instead, so an operator can see the difference between a check that is arriving
and one that is not coming. A check in Stalled SHALL become Expired once the
provider has left it undecided for a stated period, so no check stays live for
ever on a provider that never answers.

❓ The time a verdict usually takes, and the period a stalled read-back is given
before the check expires, are both `TBC` — *Owner: Product*, with the two windows
above.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-06 - An unopened invitation expires

- **GIVEN** a check in Invited that the collector never opens
- **WHEN** its life runs out
- **THEN** it is Expired, and no verified identity exists

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-07 - An abandoned check expires rather than waiting forever

- **GIVEN** a check in Started that the collector does not finish
- **WHEN** its life runs out
- **THEN** it is Expired, and the case is eligible to be invited again

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-08 - A decided check does not move again

- **GIVEN** a check in Approved or Declined
- **WHEN** a further verdict arrives for it, or a check is asked for on that case
- **THEN** the check stays where it is, and asking issues a new check with its
  own invitation

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-22 - A check the provider never decides is stalled rather than lost

- **GIVEN** a check in Submitted whose verdict has not arrived within the time a
  verdict usually takes
- **WHEN** that time passes
- **THEN** the check is Stalled, the case shows it as stalled rather than as
  arriving, and the check is read back from the provider and settled from what
  it says

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-25 - A check the provider never settles stops being live

- **GIVEN** a check in Stalled the provider has left undecided for the stated
  period
- **WHEN** that period passes
- **THEN** the check is Expired, the case shows it as lapsed, and the case can be
  invited again

### Requirement: A case has one live check at a time

The system SHALL allow a case at most one check in Invited, Started, Submitted
or Stalled, and SHALL make that a constraint rather than a question asked before
writing, so two requests arriving together cannot both raise one. Asking for a
check while one is live SHALL answer with the live check rather than issue a
second. An operator holding `vault:operate` SHALL be able to withdraw a case's
live check at any time before custody begins, and asking for a check after a
withdrawal SHALL issue a new one with its own invitation.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-09 - Asking twice does not invite twice

- **GIVEN** a case with a check in Invited
- **WHEN** a check is asked for again, including at the same moment as the first
- **THEN** one check exists, both requests answer with it, and the collector
  holds one working invitation

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-10 - A withdrawn check frees the case to be invited again

- **GIVEN** a case with a live check
- **WHEN** the check is withdrawn and a new one asked for
- **THEN** the old invitation no longer starts a check, and the new one does

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-26 - An operator clears a check that is going nowhere

- **GIVEN** a case whose check is Invited, Started, Submitted or Stalled
- **WHEN** an operator holding `vault:operate` withdraws it
- **THEN** the check is Withdrawn, the collector's invitation starts no check,
  and the case holds no live check

### Requirement: A verdict is trusted only as the provider's, about the case's live check, once

The system SHALL act on a verdict only when it is proven to come from the
verification provider and names a check Grade10 itself raised which is still
that case's live check. An approval SHALL be the provider's own decision: a
check whose ceremony the collector has finished but the provider has not
decided is Submitted, never Approved. A
verdict SHALL be acted on once, keyed on the provider's own identifier for the
check rather than on the delivery that carried it, so one check decided under
several deliveries is applied once. A verdict repeated by the provider SHALL
leave the same result as the first.

A verdict whose signature cannot be proven SHALL change nothing and SHALL be
counted rather than written to any durable record. A verdict that is proven but
names no check Grade10 raised SHALL change nothing, and SHALL be counted as
rejected — there is no check to record it against. A verdict naming a check that
is no longer that case's live check SHALL change nothing, and SHALL be recorded
against the check it names.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-11 - An unproven verdict changes nothing and is not recorded

- **WHEN** a verdict arrives that cannot be proven to come from the provider
- **THEN** nothing about any check changes, no identity is created, and the
  attempt is counted rather than stored

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-12 - A verdict for a check nobody raised changes nothing

- **WHEN** a proven verdict names a check Grade10 did not raise
- **THEN** nothing is created, and the attempt is counted as rejected

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-13 - A repeated verdict is applied once

- **GIVEN** an approved verdict already applied
- **WHEN** the provider sends the same verdict again, under any delivery
- **THEN** the check stays Approved, one verified identity exists, the case's
  identity is unchanged, and no packet is voided a second time

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-14 - A verdict for a check that is no longer the case's live check binds nothing

- **GIVEN** a check that was withdrawn, superseded, or decided
- **WHEN** its verdict arrives
- **THEN** the check keeps the state it holds, no identity is bound to the case,
  and any identity the verdict created is discarded

### Requirement: Grade10 decides age and document validity itself

The system SHALL apply the refusals `grade10-site/e-kyc/identity-record` defines
to an approved verdict, reading the date of birth and expiry the provider
returns, at the instant the verdict is applied. A verdict failing either SHALL
leave the check Declined, SHALL create no verified identity, and SHALL say which
refusal it was to the operator.

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
their invitation, and SHALL tell them what to do next for every state.

| State | What the collector is told to do |
| --- | --- |
| Invited | Start the check |
| Started | Carry on where they left off |
| Submitted | Wait; nothing is needed from them |
| Stalled | Wait; nothing is needed from them |
| Approved | Nothing further; their identity is on file |
| Declined | Bring the document to the store |
| Expired | Ask to be invited again |
| Withdrawn | Ask to be invited again |

❓ What a declined collector is told awaits Compliance (the proposal's second
open question); the words are `TBC` and the collector and the operator may not
be shown the same ones.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-17 - A collector returning mid-check is shown where they are

- **GIVEN** a check in Started
- **WHEN** the collector opens the invitation again on the device that started
  it
- **THEN** they continue the provider's check rather than starting a new one

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-18 - A declined collector is told what to do next

- **GIVEN** a check in Declined
- **WHEN** the collector opens the invitation
- **THEN** they are told the check did not pass and that the document can be
  checked at the store, and are shown no reason it did not pass

### Requirement: The hosted check never gates the counter, and an override is recorded

The system SHALL allow a member of staff to record an identity check with the
document in front of them at any point the case allows one, whatever state a
hosted check on that case is in, and SHALL NOT require a hosted check to have
been attempted first. A counter check recorded while a hosted check is live SHALL
withdraw the hosted check.

A counter check recorded on a case whose last hosted check was Declined SHALL be
an override: it SHALL carry a reason, SHALL name the staff member who gave it,
and SHALL show on the case beside the declined check. A counter check offered
without a reason on such a case SHALL be refused. Which grant an override takes
is the consumer's to say, and `grade10-site/vault/identity-check` says it.

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-19 - Staff record a check while a hosted one is live

- **GIVEN** a pre-custody case with a check in Invited, Started, Submitted or
  Stalled
- **WHEN** staff record an identity check at the counter
- **THEN** the case holds the identity staff recorded
- **AND** the hosted check is Withdrawn, so the collector's old invitation no
  longer starts a check

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-20 - A counter check after a decline is recorded as an override

- **GIVEN** a case whose hosted check is Declined
- **WHEN** staff record an identity check at the counter
- **THEN** it is accepted on the case's own rules, and is recorded as an
  override carrying a reason and the staff member who gave it
- **AND** the same check offered with no reason is refused
- **AND** the declined check stays on record beside it

#### Scenario: grade10-site-e-kyc-hosted-verification-SC-21 - A provider outage does not stop a visit

- **GIVEN** a verification provider that cannot be reached
- **WHEN** staff record an identity check at the counter for a collector who
  arrived unverified
- **THEN** the check is recorded and the case proceeds, and no call to the
  provider is required for it to succeed
