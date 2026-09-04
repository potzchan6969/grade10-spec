---
title: Verified Identity
spec: grade10-site/e-kyc/identity-record
order: 1
---

A verified identity is one identity check, kept. It belongs to the person, not
to the case it was made for, which is what lets a second product reuse it
instead of asking for the passport again.

## What it holds

- **The person** — the legal name as the document prints it, and the date of
  birth as a calendar day with no time and no zone
- **The document** — its type, its expiry, a mask of its number, and a keyed
  digest of that number so a repeat is a question that can be asked
- **The evidence** — one image of the document the check was made against, in
  Grade10's own bucket; never an image of the person's face
- **The provider's findings** — what a verification provider checked and what it
  found: the document genuine, the person live, the face a match
- **The provenance** — which product's surface recorded it, who performed it
  (Grade10 staff, or a named verification provider), and when

## Reuse

A read of a person answers across every product; a write is scoped to the asking
product's own cases. That asymmetry is the whole reason the store exists — the
same human is the same human, and finance reusing a check the vault recorded is
the alternative to photographing the passport a second time.

A case binds exactly one identity. Binding a second replaces the first rather
than adding to it, and what is displaced stays on file until the product that
displaced it decides: keep it as evidence, or discard it.

## The two refusals

Under age and an expired document, both judged at the instant the check is
applied — a check made two years ago may have aged past its document's expiry
since. They apply to a provider's verdict exactly as they apply at the counter,
on Grade10's own reading of the dates rather than on the provider's word.

## Erasure

Nothing here is swept on a schedule. Erasure arrives as the owning service
releasing its binding, because only that service knows whether the evidence is
under legal hold; the last release to leave a record unbound purges the record
and its image.

The provider's copy runs on two clocks, because one is not enough. A release
**commands** the provider to erase its copy and keeps asking until it
acknowledges — and Grade10's own purge never waits on that answer, because a
provider under a retention duty of its own would otherwise turn a person's
erasure into a job that never finishes. A standing retention window at the
provider erases the copy anyway, which is what covers the majority of checks:
declined, expired, withdrawn, or refused on landing, none of which ever became
a record here to release.

:::detail{title="Product decisions" for="pm"}
The record is the one place a person's checked identity lives, so every decision
here is about keeping it small, reusable, and erasable.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Verified once, opens a second case | Not asked for the document again. |
| Collector | Asks to be forgotten | Every copy goes, including the provider's. |
| Vault operator | Reading a case's identity | Can tell a counter check from a hosted one, and how old it is. |
| Compliance | Auditing a signed agreement years later | The evidence is readable without a vendor. |

**Not in scope.** Sanctions, PEP and watchlist screening. Re-verification on a
schedule. A unique constraint on the document digest — the digest makes a
repeated document *findable*, and nothing queries it yet. A second copy of the
document number in any form.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Reuse rate | Share of new cases bound to an existing verified identity rather than a new check. | Product |
| Erasure completeness | Share of releases whose provider command is acknowledged within the stated window. | Compliance |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Evidence lives here | Decided | Provider images are pulled into Grade10's bucket before the identity is readable. A record naming no evidence is a claim, not a check. | Product |
| Erasure reaches the vendor | Decided | A release commands the provider and keeps asking; a standing window erases the copy regardless. Grade10's own purge never waits. | Compliance |
| The face is not stored | Decided | The record keeps the provider's finding, not the capture. | Product |
| Refusals are ours | Decided | Age and expiry are judged by Grade10 on the returned dates, never taken from the provider's verdict. | Compliance |
| Raw number | Decided | Never stored, returned or logged, whoever supplied it. | Product |
| Person-wide read | Decided | A read of a person crosses products; every write stays scoped to the caller's own cases. | Product |
| Reuse without re-consent | ❓ Open | Whether an approved check may be bound to a second case without asking the collector again. | Compliance |
| Retention windows | ❓ Open | Unset for every class, so nothing is deleted on a schedule — see [account data](/platform/account-data). | Compliance |
| The provider's window | ❓ Open | Long enough to review a disputed check, short enough to be a control. | Compliance |

**Risks.** Pulling the image home means the same document exists in two places
until the provider's window closes. The alternative — leaving the evidence at
the vendor — makes a legal record depend on a vendor's API and retention policy
years after the agreement was signed. A held case keeps its binding and
therefore its record; the provider's copy still goes on its window.
:::
