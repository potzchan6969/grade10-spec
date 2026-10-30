---
title: KYC Service
order: 4
---

| Rule | Value |
| --- | --- |
| A started check left unfinished | Expires after **24 hours** |
| A submitted check no reviewer holds | Reads as stalled after **1 day** |
| A submitted check nobody decides | ❓ Expires after **30 days**, never while a reviewer holds it - Compliance confirms |
| The provider's copy | Erased after **30 days** |

## The Service

The KYC service holds verified identities so that **the same human is the
same human**: a product binds the check another product already recorded.

- **At the counter** - vault staff read the document in front of them and
  record it from the case, the fallback that never closes
  ([Identity Check](/p/grade10-site/finance/identity-check))
- **Who reads it** - vault staff, on the case, the name and the document
  image; an operator, on the account's Identity card, the standings and the
  findings; the collector, a standing and never a name; a bid, the same
  standing before it goes through
- **Walled** - reached only by Grade10's own services over a binding, never a
  browser ([account data](/platform/account-data))
- **One per brand** - a collector verified on grade10.com is unknown to ZZZ,
  which verifies nobody and runs none

## Verified Identity

A verified identity is one identity check, kept. It belongs to the person, not
to the case it was made for.

- **The person** - the legal name as the document prints it, and the date of
  birth as a calendar day with no time and no zone
- **The document** - its type, its expiry, a mask of its number, and a keyed
  digest of that number so a repeat is a question that can be asked; the raw
  number is never stored, returned or logged
- **The evidence** - one image of the document the check was made against, in
  Grade10's own bucket; never an image of the person's face
- **The provider's findings** - the document genuine, the person live, the
  face a match, and the screening matched or clear
- **The origin** - which product's surface recorded it, who performed it
  (Grade10 staff, or a named verification provider), and when
- **A business** - its own record in the same service -
  [Business Verification](/p/grade10-site/account/business-verification#what-grade10-keeps)

### Reuse

- **A read crosses products, a write does not** - a read of a person answers
  across every product; a write is scoped to the asking product's own cases
- **One identity per case** - binding a second replaces the first, and what is
  displaced stays on file until the product that displaced it decides to keep
  or discard it
- **A standing for a yes or no** - the store and the auction read verified,
  expired or unverified, judged on the day they ask, and nothing that names
  the person

### Refusals

- **Under age** and **an expired document**, both judged at the instant the
  check is applied, on the returned dates rather than on the provider's word

### Erasure

- **Product-driven** - erasure arrives as the owning service releasing its
  binding, and the last release purges the record and its image
- **The provider's copy, on two clocks** - a release commands the provider to
  erase its copy and keeps asking until it acknowledges; Grade10's own purge
  never waits on that answer
- **A check that never became an identity** - declined, expired, withdrawn or
  refused on landing - is left to the provider's 30-day window
- **Erasing a person** ends their live checks, drops their requests, and
  commands their whole provider account away

## Hosted Verification

A verification provider hosts the check on the collector's own phone and
decides it; Grade10 renders none of it.

:::flow{title="The hosted check" diagram="assets/diagrams/kyc-hosted-check.svg"}
## The check is raised
From the verification page, signed in. A vault case invites nobody - [Identity
Check](/p/grade10-site/finance/identity-check).
## The provider runs the check
Photograph the document, photograph your face, screened - resumable, so a
collector who stops halfway comes back to where they were.
## The verdict comes back on its own
Minutes later, usually, or after a reviewer decides a screening match.
## Grade10 judges it again
Age and document validity are refused here, on the dates the provider returns.
One image of the document is pulled into Grade10's own bucket; the face
capture stays with the provider.
## The identity is bound
To the account that raised the check.
:::

### Check States

| State | What it means |
| --- | --- |
| Invited | Raised, not started |
| Started | Opened, not finished |
| Submitted | Finished, being decided, or held by a reviewer |
| Stalled | Submitted, no reviewer holds it, and the provider has not decided in the time it usually takes |
| Approved | Vouched for, and our own refusals passed |
| Declined | Refused, by the provider, by us, or because the case could not take it |
| Expired | Ran out of time |
| Withdrawn | The case no longer needs it |

- **Final** - Approved, Declined, Expired and Withdrawn; a collector who needs
  another chance starts a new check
- **One live check per case** - asking again while one is out hands back the
  one the collector already has

:::detail{title="Code map" for="engineer"}
- **The record** - `grade10-e-kyc-service`, one record for a person or a
  business
- **The host** - `packages/grade10-store/backend/src/kyc/`: the account as
  the case, the sweeps, the erasure
- **Service design** - [the working note](/references/kyc-service-design)
:::

:::detail{title="Product decisions" for="pm"}
The KYC service is the one place a person's checked identity lives, so every
decision here keeps it small, reusable and erasable.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Verified once, opens a second case or checks out | Not asked for the document again, and the store never learns who they are. |
| Collector | Asks to be forgotten | Every copy goes, including the provider's. |
| Vault operator | Reading a case's identity | Can tell a counter check from a hosted one, and how old it is. |
| Compliance | A signed agreement years later | The evidence is readable without a vendor. |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Trust in a verdict | Decided | Proven to come from the provider, about a check we issued, acted on once. | Engineering |
| Evidence lives here | Decided | Provider images are pulled into Grade10's bucket before the identity is readable. A record naming no evidence is a claim, not a check. | Product |
| The face is not stored | Decided | Grade10 runs no matching engine; the record keeps the provider's finding, not the capture. | Product |
| Refusals are ours | Decided | Age and expiry are judged by Grade10 on the returned dates. | Compliance |
| Check lifetimes | Decided | 24 hours to finish a check not yet submitted; a submitted check no reviewer holds reads as stalled a day after submission; a check a reviewer holds never stalls. | Product |
| Undecided window | ❓ Open | 30 days before an undecided check expires, never while a reviewer holds it. | Compliance |
| Documents and countries | Decided | Passports of any country; national ID cards, driving licences and residence permits from Hong Kong, Macau, mainland China, Taiwan, Japan, South Korea and Singapore, as the provider authenticates them. | Compliance |
| Erasure reaches the vendor | Decided | A release commands the provider and keeps asking; a standing window erases the copy regardless. | Compliance |
| The provider's window | Decided | 30 days: long enough to review a disputed check, short enough to be a control on a copy Grade10 does not hold. | Compliance |
| Retention windows | ❓ Open | Unset for every class, so nothing is deleted on a schedule - see [account data](/platform/account-data). | Compliance |
| One service per brand | Decided | A brand's identities live in a KYC service of its own; ZZZ verifies nobody. | Product |

**Risks.**

- **Two copies of the document** - until the provider's window closes; leaving
  the evidence at the vendor instead makes a legal record depend on a vendor's
  API years after the agreement was signed
:::
