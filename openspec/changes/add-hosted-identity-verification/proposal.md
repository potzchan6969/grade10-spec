# Hosted identity verification before the visit

**Author:** @ecchochan - 2026-09-04

## Why

A collector who books a vault visit hands their passport to a member of staff.
That is the only way Grade10 has ever verified anybody: one provider kind
exists, and it means a person at a counter typing a document that is physically
in front of them. Everything about identity happens inside the appointment.

Three costs follow, and all three land on the collector.

- **Nothing checks that the document is real, or that the person holding it is
  its owner.** The record says a staff member looked at it. There is no liveness
  check, no tamper check, no comparison of face to document — and the custody
  and loan agreements the case goes on to sign are executed under exactly that
  identity.
- **A document problem is discovered in the room.** Under age and an expired
  document are refused at the moment of recording, so a collector whose passport
  lapsed last month learns it after carrying a graded card across the city, on
  an appointment that then cannot reach signing. They carry the item home again.
- **A mistyped name fails at the signature, not at the keyboard.** The legal name
  is typed character for character off the document, and the ceremony refuses the
  first signature when the name does not match. Recovery is not retyping it:
  re-recording voids the packet, so the document is photographed again, every
  page re-rendered and the ceremony re-issued — with the customer holding the
  tablet.

Reuse compounds it. The identity store already answers across products — the
same human is the same human — but a check can only be created inside an
operator console, so the only people who can ever start one are staff, in a
shop, during an appointment. A product with no counter has no way to verify
anybody at all.

**Metric:** share of intake visits where a document problem was found before the
collector travelled, rather than at the counter. Read beside the visit no-show
rate, which the booking outcomes already produce.

## What Changes

- **A collector verifies themselves before they travel.** Booking a visit on a
  case with nothing to reuse invites them to complete an identity check on their
  own phone, hosted by a verification provider, days before the appointment.
- **A check the collector already passed is reused rather than repeated.** The
  case asks for their most recent verified identity first, and only invites when
  there is nothing to bind.
- **The provider decides, and the verdict arrives on its own.** Nothing waits on
  it: the case carries the state and moves through every pre-custody status while
  a check is out. A provider that never answers is a stalled check an operator
  can see, not a silence.
- **An approved verdict is a verified identity like any other.** Same record,
  same person-wide reuse, same two refusals — under age and an expired document
  are refused on Grade10's own reading of the dates, at the instant the verdict
  is applied.
- **One document image comes home. The face does not.** The document image is
  fetched into Grade10's own evidence store before the identity is readable, so
  a release packet read years from now needs no vendor. Grade10 runs no matching
  engine, so a stored selfie could never be re-compared — what the record keeps
  instead is what the provider checked and what it found, readable without them.
- **Erasure runs on two clocks.** Releasing a binding commands the provider to
  erase its copy and keeps asking until it acknowledges; a standing retention
  window at the provider erases it anyway, which is what covers every check that
  never became an identity. Grade10's own purge never waits on either.
- **The counter stays, and stays reachable — but an override is recorded.** A
  collector with no smartphone, an unreadable document, a provider outage: all
  served by the counter check, ungated. A counter check on a case the provider
  *declined* is an override, carrying a reason, taking the grant that approves
  rather than the grant that operates.
- **A verified identity says who performed it.** Every record already carries a
  provider and the provider's own reference; today both are constant. They start
  meaning something.

**The vendor is Persona.** Hosted government-ID and selfie verification, a
webhook verdict, a redaction command, and org-level retention policies — the
last two are what make the erasure above deliverable. The requirements name no
vendor: they describe a hosted check, so a replacement is a delivery decision.

## Non-Goals

- **Replacing the counter check.** It is the fallback, permanently.
- **Verifying anybody outside a vault case.** Finance is named in the identity
  store's vocabulary and verifies nobody; the first product to need a check
  beyond the vault brings its own change.
- **Sanctions, PEP and watchlist screening.** A different question, with its own
  legal duty and its own operator workflow.
- **Re-verification on a schedule.** Who gets asked again, and when, is a
  retention decision nobody has taken.
- **Storing any image of a person's face.** What is kept is the provider's
  finding, never the capture.
- **Making the identity store publicly reachable.** No requirement here puts a
  browser in front of it.
- **A second copy of the document number.** What Grade10 keeps stays a mask and
  a keyed digest.
- **Setting Grade10's own retention windows.** Every window in the platform is
  unset; this change sets the provider's, not ours.

## Capabilities

### New Capabilities

- `grade10-site/e-kyc/identity-record` — the verified identity itself: what it
  holds, who performed it, how one person's check is reused across services, the
  two refusals, the evidence, and how erasure reaches a provider. Shipped
  behavior, written down for the first time, plus what a provider-performed check
  adds to it.
- `grade10-site/e-kyc/hosted-verification` — the check a collector completes away
  from Grade10: the invitation, the states it moves through, how a verdict is
  trusted, and what an unfinished one becomes.
- `grade10-site/vault/identity-check` — the case's side: reuse before asking,
  when the invitation is sent, what the case shows, what a landed verdict does to
  paperwork already rendered, and the counter fallback.

### Modified Capabilities

None. The grants this change needs already exist and already mean what it needs
them to mean: `kyc:read` reaches an identity document, `vault:operate` runs the
flow that records one, and `vault:approve` covers what an action can cost.

## Impact

- **The identity service and its evidence store** — a check with a life of its
  own, the provider's findings on the record, and a second erasure obligation
  that outlives the row it came from.
- **The vault case surface** — an identity state an operator reads before the
  visit, an override on the counter path, and a verdict that can land while the
  case is being worked.
- **Booking** — an intake booking becomes the moment a case asks for a check.
- **Customer notifications** — a new kind, in a catalogue that is English-only
  today while the site serves traditional and simplified Chinese.
- **The provider integration** — a raised check, a signed verdict, an evidence
  fetch, a redaction command, and a retention policy read back and checked.
- **No ZZZ surface.** ZZZ runs auth and store only, and verifies nobody.
- **No new permission.** `kyc:read`, `vault:operate` and `vault:approve` already
  carry this change's grants. Separately, `shared/auth/roles` describes neither
  those grants nor the `treasurer` role the code ships — a divergence older than
  this change, and not its to close.

## Open questions

- ❓ **How long an invitation lives, and how long a started check has.** The spec
  states 14 days and 24 hours provisionally; both are `TBC` and must outlive a
  collector who books two weeks ahead. *Owner: Product.*
- ❓ **What a declined verdict tells the collector.** A repeated reason teaches a
  fraudster what to fix, and the collector and the operator may not see the same
  words. *Owner: Compliance, with Product.*
- ❓ **Which cases must hold an approved hosted check before their documents are
  prepared.** The requirement exists; until Compliance names the class, no case
  is in it, and the counter override is the only control on a decline. *Owner:
  Compliance.*
- ❓ **The lawful basis for the biometric processing.** A face match run by a
  processor on Grade10's instruction is special-category processing whichever
  way the image is stored. Explicit consent or a substantial-public-interest
  route, what the collector is shown and agreed to, whether a DPIA is required,
  and the transfer mechanism to a US processor. *Owner: Compliance, with
  counsel.*
- ❓ **How long the provider may hold its copy.** The window has to outlive an
  operator's need to review a disputed check. *Owner: Compliance.*
- ❓ **Which documents and which issuing countries the provider is configured
  for.** The record names four document types; a provider template accepts a set
  of its own, and a document most collectors carry that it cannot authenticate
  would leave the counter running every visit. *Owner: Compliance.*
- ❓ **Whether an approved check may be bound to a second case without asking the
  collector again.** The record is person-wide by design, so this is a purpose
  and consent question rather than a capability one. *Owner: Compliance.*
