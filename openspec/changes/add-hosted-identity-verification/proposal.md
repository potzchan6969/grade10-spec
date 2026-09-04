# Hosted identity verification before the visit

**Author:** @ecchochan - 2026-09-04

## Why

A collector who books a vault visit hands their passport to a member of staff.
That is the only way Grade10 has ever verified anybody: one provider kind
exists, and it means a person at a counter typing a document that is physically
in front of them. Everything about identity happens inside the appointment.

Three costs follow from that, and all three land on the collector.

- **The visit carries work that could be done at home.** Legal name character
  for character, birth date, document type, number, expiry, then a photograph
  taken and metadata-scrubbed in the browser — with the collector sitting there
  while it uploads.
- **A document problem is discovered in the room.** Under age and an expired
  document are refused at the moment of recording, so a collector whose passport
  lapsed last month learns it after travelling to the store, on an appointment
  that now cannot proceed to signing.
- **Nothing checks that the document is real, or that the person holding it is
  its owner.** The record says a staff member looked at it. There is no
  liveness check, no tamper check, no comparison of face to document — and the
  agreements the case goes on to sign are executed under exactly that identity.

Reuse compounds it. The identity store already answers across products — the
same human is the same human — but a check can only be created inside an
operator console, so the only people who can ever start one are staff, in a
shop, during an appointment. A product with no counter has no way to verify
anybody at all.

**Metric:** share of vault intake visits where the collector arrives already
verified, measured against median minutes from case submitted to identity
verified.

## What Changes

- **A collector verifies themselves before they travel.** Booking a visit
  invites them to complete an identity check on their own phone, hosted by an
  identity-verification provider, days before the appointment.
- **The provider decides, and the verdict arrives on its own.** The check leaves
  Grade10 when the collector starts it and comes back as an approved or declined
  verdict minutes later. Nothing waits on it: the case carries the state, and
  the collector is told where it stands.
- **An approved verdict is a verified identity like any other.** Same record,
  same person-wide reuse, same two refusals — under age and an expired document
  are refused on the provider's verdict exactly as at the counter, and by
  Grade10 rather than on the provider's word.
- **The document images come home.** The provider's copies are pulled into
  Grade10's own evidence store before the identity is bound, so a release packet
  read years from now needs no vendor, and one erasure story covers everything.
- **Erasure reaches the provider.** Releasing the last binding purges the
  record, its evidence, and the provider's copy of the check. Until the
  provider's copy is gone, the erasure is not done.
- **The counter check stays, and stays reachable.** A collector with no
  smartphone, a document the provider cannot read, a provider outage — every one
  of them is served by the check Grade10 already performs at the counter.
  Nothing about the hosted path gates it.
- **A verified identity says who performed it.** Every record already carries a
  provider and the provider's own reference for the check; today both are
  constant. They start meaning something, and an operator reading a case can
  tell a counter check from a hosted one.

**The vendor is Persona.** Hosted government-ID and selfie verification with a
webhook verdict and a redaction API — the last of which is what makes the
erasure requirement above deliverable rather than aspirational. The
requirements name no vendor: they describe a hosted check, so a second provider
or a replacement is a delivery decision rather than a re-specification.

## Non-Goals

- **Replacing the counter check.** It is the fallback, permanently. A change
  that retires it is a different change with a different risk.
- **Verifying anybody outside a vault case.** Finance, the auction and the
  store are named in the identity store's vocabulary and verify nobody; the
  first product to need a check beyond the vault brings its own change.
- **Sanctions, PEP and watchlist screening.** A different question from "is this
  person who they say they are", with its own legal duty, its own vendor
  configuration, and its own operator workflow.
- **Re-verification on a schedule.** A record ages and its document expires; who
  gets asked again, and when, is a retention decision nobody has taken.
- **Making the identity store publicly reachable.** No requirement here puts a
  browser in front of it. Where the collector's surface and the provider's
  verdict land is delivery's to settle, inside the wall that already exists.
- **A second copy of the document number.** The provider reads the number; what
  Grade10 keeps stays a mask and a keyed digest, as today.
- **Retention windows.** Every window in the platform is unset, and this change
  does not set one.

## Capabilities

- `grade10-site/e-kyc/identity-record` — the verified identity itself: what it
  holds, who performed it, how one person's check is reused across products,
  the two refusals, and how a release erases it. Shipped behavior, written down
  for the first time, plus what a provider-performed check adds to it.
- `grade10-site/e-kyc/hosted-verification` — the check a collector completes
  away from Grade10: the invitation, the states it moves through, the verdict
  and how it is trusted, the evidence that must land with it, and what an
  unfinished check becomes.
- `grade10-site/vault/identity-check` — the case's side: when the invitation is
  sent, what the case shows while the check is out, what a landed verdict does
  to paperwork already rendered, and the counter fallback.

## Open questions

- ❓ **How long an invitation lives, and how long a started check has** — days
  from the invitation, hours from the start. The window has to outlive a
  collector who books two weeks ahead. *Owner: Product.*
- ❓ **What a declined verdict tells the collector** — a provider states a
  reason, and repeating it can teach a fraudster what to fix. What the collector
  is told, versus what the operator sees. *Owner: Compliance, with Product.*
- ❓ **Whether a declined check blocks the counter fallback on the same case** —
  a decline that staff can immediately override is worth less than a decline
  that stands, and an override nobody records is worth nothing. *Owner:
  Compliance.*
- ❓ **Which documents and which countries the provider is configured for** —
  the record already names four document types, and a provider template accepts
  a set of its own. *Owner: Compliance.*
- ❓ **Whether an approved check may be reused for a second case without asking
  the collector again** — the record is person-wide by design, so this is a
  policy question about consent, not a capability question. *Owner: Compliance.*

## Risks

- **A verdict is a trust boundary Grade10 has never had.** Every identity in the
  estate is currently written by an authenticated operator. A verdict arrives
  unauthenticated, from outside, about a person — so it is signed, deduplicated,
  and matched to a check Grade10 itself issued, or it is not a verdict.
- **Two evidence stores, one erasure.** Pulling the images home is what keeps
  the record self-contained, and it also means the same document exists in two
  places until the provider's copy is confirmed gone. The release is not
  complete until both are.
- **An asynchronous verdict lands on a case that has moved.** Between the
  collector finishing and the verdict arriving, a case can be sealed, erased, or
  taken past custody. The existing rebind machinery already settles a displaced
  check; this change hands it a new way to be raced.
