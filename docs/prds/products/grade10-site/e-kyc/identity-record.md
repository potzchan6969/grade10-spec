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
- **The evidence** — the photograph the check was made against, in Grade10's own
  bucket
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

Under age and an expired document, both judged at the clock of whoever is
asking — a check made two years ago may have aged past its document's expiry
since. They apply to a provider's verdict exactly as they apply at the counter,
on Grade10's own reading of the dates rather than on the provider's word.

## Erasure

Nothing here is swept on a schedule. Erasure arrives as the owning product
releasing its binding, because only that product knows whether the evidence is
under legal hold; the last release to leave a record unbound purges the record,
its photograph, and — for a check a provider performed — the provider's copy.
Until the provider confirms its copy is gone, the erasure is not done.

:::callout{kind="warning"}
Retention windows are unset for every class, which means nothing is ever
deleted on a schedule. That is a decision nobody has taken yet, not a disabled
feature — see [account data](/platform/account-data).
:::

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
| Erasure completeness | Share of releases that confirm the provider's copy gone within the day. | Compliance |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Evidence lives here | Decided | Provider images are pulled into Grade10's bucket before the identity is readable. A record naming no evidence is a claim, not a check. | Product |
| Erasure reaches the vendor | Decided | A release is incomplete until the provider confirms its copy is erased. | Compliance |
| Refusals are ours | Decided | Age and expiry are judged by Grade10 on the returned dates, never taken from the provider's verdict. | Compliance |
| Raw number | Decided | Never stored, returned or logged, whoever supplied it. | Product |
| Person-wide read | Decided | A read of a person crosses products; every write stays scoped to the caller's own cases. | Product |
| Reuse without re-consent | ❓ Open | Whether an approved check may be bound to a second case without asking the collector again. | Compliance |

**Risks.** Pulling the images home means the same document exists in two places
until the provider's copy is confirmed gone. The alternative — leaving the
evidence at the vendor — makes a legal record depend on a vendor's API and
retention policy years after the agreement was signed.
:::
