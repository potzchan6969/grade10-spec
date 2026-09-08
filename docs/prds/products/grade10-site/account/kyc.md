---
title: KYC
spec: grade10-site/store/account-identity
order: 2
---

A collector verifies who they are once, from their own account, and is
recognised wherever Grade10 asks: at a checkout or a bid of **HKD 120,000** or
more, and at a vault visit.

- **Where they stand** — verified until a day, expired, or not yet; read from
  the KYC service the day the page is opened, whichever product verified them
- **The bar** — the order value and the bid value that ask for a verified
  identity, in the store's currency
- **Verify** — read what the provider will check, tick the agreement, press
  verify, and finish on the provider's page on this device; the result lands on
  its own
- **URL** — `grade10.com/profile`, the account page; the card is on it

:::flow{title="Verifying from the account"}
# On the account page

## Collector — Read what will be checked
The provider checks the ID document and takes a short selfie; Grade10 keeps the
document and the result, and uses it across its services; erasure on request.

## Collector — Tick the agreement and press Verify
Nothing reaches the provider before the box is ticked.

## Grade10 — Recognise a check already passed
A collector the vault verified is told so, and nothing is started.

# On the provider's page

## Collector — Complete the check
On this device, in the provider's own page.

## Provider — Decide
In its own time; the collector may close the page.

# Back at Grade10

## Grade10 — Apply the verdict
Under the two refusals every verified identity is held to.

## Collector — Read the account page
Verified, until the document's expiry.
:::

- **Nothing about the person** — the card names a standing and a day; no name,
  birth date, document or finding reaches the site
- **Declined** — the card says the check could not be completed online, names
  the counter as another way, and offers to try again; the reason stays with
  an operator
- **Erased with the account** — a check ends, keeps nothing about the person,
  and the provider is told to erase its copies

## KYC service

The KYC service holds the verified identity of a person and exists to enforce
one idea: **the same human is the same human**. A product that needs to know
who somebody is binds the check another product already recorded instead of
photographing the passport again.

- **Before the visit** — the collector completes a hosted check on their own
  phone, decided by a verification provider, and the verdict comes back on its
  own; the card on this page starts the same check with no visit
- **At the counter** — vault staff read the document in front of them and
  record it from the case, the fallback that never closes
  ([Identity Check](/p/grade10-site/vault/identity-check))
- **Who reads it** — vault staff, on the case, the name and the document image;
  the collector, on this card, a standing and never a name; a checkout or a
  bid above the bar, the same standing before it goes through
- **Walled** — reached only by Grade10's own services over a binding, never a
  browser: one misconfigured origin would otherwise put every customer's legal
  name and passport photograph in front of one
  ([account data](/platform/account-data))
- **One per brand** — a collector verified on grade10.com is unknown to ZZZ,
  which verifies nobody and runs none; the day a ZZZ product verifies
  somebody, it gets a service, a vendor account and a template of its own

## Verified identity

A verified identity is one identity check, kept. It belongs to the person, not
to the case it was made for, which is what lets a second product reuse it
instead of asking for the passport again.

- **The person** — the legal name as the document prints it, and the date of
  birth as a calendar day with no time and no zone
- **The document** — its type, its expiry, a mask of its number, and a keyed
  digest of that number so a repeat is a question that can be asked; the raw
  number crosses the binding in memory and is never stored, returned or logged
  (keyed, not a bare hash: a document number's whole space is small enough to
  walk offline, so a bare digest of one *is* the number)
- **The evidence** — one image of the document the check was made against, in
  Grade10's own bucket; never an image of the person's face
- **The provider's findings** — what a verification provider checked and what it
  found: the document genuine, the person live, the face a match
- **The origin** — which product's surface recorded it, who performed it
  (Grade10 staff, or a named verification provider), and when

### Reuse

- **A read crosses products, a write does not** — a read of a person answers
  across every product; a write is scoped to the asking product's own cases,
  so finance reusing a check the vault recorded is the alternative to
  photographing the passport a second time
- **One identity per case** — binding a second replaces the first rather than
  adding to it, and what is displaced stays on file until the product that
  displaced it decides: keep it as evidence, or discard it
- **A standing for a yes or no** — the store at a checkout and the auction at
  a bid read verified, expired or unverified, judged on the day they ask, with
  when the check was decided and who performed it, and nothing that names the
  person; only a product that records or binds holds the record

:::callout{kind="note"}
"One verified identity per person" is checkable, not enforced. A case holds one
identity and that much is guaranteed. The document-number digest makes a
repeated document findable, and nothing looks — so the same document under a
second account is a query somebody could run, not an alarm that fires.
:::

### Refusals

- **Under age** and **an expired document**, both judged at the instant the
  check is applied — a check made two years ago may have aged past its
  document's expiry since
- **Grade10's own reading** — they apply to a provider's verdict exactly as
  they apply at the counter, on the returned dates rather than on the
  provider's word

### Erasure

- **Product-driven** — nothing here is swept on a schedule; erasure arrives as
  the owning service releasing its binding, because only that service knows
  whether the evidence is under legal hold, and the last release to leave a
  record unbound purges the record and its image
- **The provider's copy, on two clocks** — a release commands the provider to
  erase its copy and keeps asking until it acknowledges, and Grade10's own
  purge never waits on that answer (a provider under a retention duty of its
  own would otherwise turn a person's erasure into a job that never finishes)
- **A check that never became an identity** — declined, expired, withdrawn,
  refused on landing — is left to a standing retention window at the provider,
  so a disputed decline stays reviewable there until the window closes
- **Erasing a person** ends their live check and commands their whole account
  away, every check of theirs at once

::changes{spec="grade10-site/e-kyc/identity-record"}

## Hosted verification

A collector proves who they are on their own phone, from the account card or
days before a vault visit. A verification provider hosts the check and decides
it; Grade10 renders none of it, asks for nothing the provider collects, and
reads the verdict when it arrives.

:::flow{title="The hosted check" diagram="assets/diagrams/kyc-hosted-check.svg"}
## The check is raised
From the account card, or by the link a vault case emails when a visit is
booked. The link is the whole credential: the collector signs in to nothing,
and a case may exist before its collector has an account.
## The provider runs the check
Photograph the document, photograph your face, done — resumable, so a collector
who stops halfway comes back to where they were.
## The verdict comes back on its own
Minutes later, usually. Nobody waits for it.
## Grade10 judges it again
Age and document validity are refused here, on the dates the provider returns.
One image of the document is pulled into Grade10's own bucket; the face
capture stays with the provider, and what the record keeps of it is the
finding.
## The identity is bound
To whatever raised the check — the account, or the vault case the link named,
which settles its own paperwork
([Identity Check](/p/grade10-site/vault/identity-check)).
:::

### Check states

| State | What it means |
| --- | --- |
| Invited | Asked, not started |
| Started | Opened, not finished |
| Submitted | Finished, being decided |
| Stalled | Submitted, and the provider has not decided in the time it usually takes |
| Approved | Vouched for, and our own refusals passed |
| Declined | Refused, by the provider, by us, or because the case could not take it |
| Expired | Ran out of time |
| Withdrawn | The case no longer needs it |

- **Final** — Approved, Declined, Expired and Withdrawn; a collector who needs
  another chance is invited again, as a new check, and a decided check never
  moves
- **Submitted never expires on its own** — a verdict may still arrive, so it
  goes stalled instead, and an operator can tell a check that is coming from
  one that is not
- **One live check per case** — asking again while one is out hands back the
  one the collector already has, so nobody ends up holding two invitations and
  guessing

::changes{spec="grade10-site/e-kyc/hosted-verification"}

:::detail{title="Code map" for="engineer"}
- **The host** — `packages/grade10-store/backend/src/identity/`: the
  account as the case, the published lifecycle, the gate, the sweeps, the
  erasure
- **The card** — `@grade10/store-frontend/identity`, one slice; every word a
  prop until the application's submodule carries the `identity` catalogue
- **The gates** — `checkout.createCheckout`, `createCheckoutWithEmail` and
  `auction.placeBid` in the store's tRPC routers, on `identityGates` from
  `@grade10/app-env`
:::

:::detail{title="Service design" for="engineer"}
`packages/e-kyc/` in the application repository, deployed once per brand —
`grade10-e-kyc-service` for Grade10, with its own Neon project and bucket, and
a `BRAND` var that selects the hosted template. Its entire HTTP surface is a
health route and dev setup; everything a product asks arrives over a service
binding, minted per product by a class factory in two kinds. The service —
the record, its case bindings and the five hosted calls — is what a host
holds as `KYC_SERVICE`: the vault for its cases, the store for the site's own
accounts. The gate — one method, a person's standing and no identity field —
is what a product that only reads would hold; none does today, and the
factory is published for the day one does.

Writes and case bindings are scoped to the calling product by the entrypoint its
binding names. What cannot be scoped is the person: `latestForUser` and the
standing read across every product deliberately, and that read is the whole
reason this service left the vault.

Capture keys are content-addressed, so the object name is the digest of its
bytes and no folder scheme exists. Two mechanisms move bytes out, and only one is
erasure: a purge drain settles rows first and bytes second, re-judging each key
immediately before deleting it; an hourly orphan sweep is garbage collection,
reclaiming aged objects no row names, with three proofs before every delete.
There is no deletion-log sweep here at all — erasure arrives as the owning
product releasing its binding, because only that product knows whether the
evidence is under legal hold.

The record carries a provider and a provider reference: constants on a counter
check, the vendor's on a hosted one. The hosted check's own life — raise with
reuse first, open, start, settle, withdraw, the two sweeps and the three
routes — is published by the package over a host port the product supplies,
and the collector's page is the package's own slice; the vault is the first
host, and a second product mounts the same hundred lines. A case binds exactly
one identity, enforced by the bindings table's primary key; the document-number
digest carries no unique index and nothing queries it.

Background:
[account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
and
[the vault](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md).
:::

:::detail{title="Product decisions" for="pm"}
The KYC service is the one place a person's checked identity lives, so every
decision here keeps it small, reusable and erasable; the check is the
collector's to complete on their own device, because a document read at a
counter produces no liveness or tamper signal, cannot fail early enough to be
fixed, and puts a legal name through a keyboard on its way to a signature page.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Buying or bidding above the bar | Verifies once, from the account, and is not asked at the next high-value purchase. |
| Collector | Booked a visit, at home | Verifies in minutes, arrives ready. |
| Collector | Document lapsed | Finds out at home, not after travelling. |
| Collector | Verified once, opens a second case or checks out | Not asked for the document again, and the store never learns who they are. |
| Collector | Asks to be forgotten | Every copy goes, including the provider's. |
| Vault operator | Reading a case's identity | Can tell a counter check from a hosted one, and how old it is. |
| Compliance | A sale above the bar, or a signed agreement years later | The account holds a verified identity with consent on record; the face matched the document, and the evidence is readable without a vendor. |

**Not in scope.** Verifying a guest, or anybody outside a vault case or an
account. Any identity field on the site. Inviting by email from the store.
Sanctions, PEP and watchlist screening.
Re-verification on a schedule. A unique constraint on the document digest. A
second copy of the document number in any form. Putting a browser in front of
the KYC service.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Verified above the bar | Share of orders and bids at or above the bar placed by a verified collector. | Product |
| Recognised | Share of verifications reused rather than repeated, and of new cases bound to an existing identity. | Product |
| Drop-off | Share of checks started that never decide, and of invitations that expire undecided. | Product |
| Erasure completeness | Share of releases whose provider command is acknowledged within the stated window. | Compliance |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The bar | Decided | HKD 120,000.00 on an order's goods and on a bid — the value at which a Hong Kong dealer in high-value goods has to know its customer. One value per brand. | Product |
| Where the gate stands | Decided | At the storefront, before an order is written or the auction hears of a bid. | Engineering |
| Guests | Decided | Above the bar a guest signs in; a standing belongs to an account. | Product |
| A gate reads a standing | Decided | A product that only asks whether a person is verified holds a gate — verified, expired or unverified — and never the record. | Product |
| Person-wide read | Decided | A read of a person crosses products; every write stays scoped to the caller's own cases. | Product |
| Consent | Decided | Explicit, on the page that starts the check, stamped on the check; the text names the document and face check, what is kept, reuse across Grade10, and erasure. A DPIA is completed before production; the provider's DPA governs the transfer. | Compliance |
| Reuse without re-consent | Decided | One consent covers every Grade10 service and says so; a check passed anywhere counts everywhere, bound to a second case or read as a standing without asking again. | Compliance |
| Vendor | Decided | Persona — hosted government-ID and selfie check, verdict by webhook, a redaction command, and org-level retention policies. The spec names no vendor, so replacing one is a delivery decision. | Product |
| When a check is asked for | Decided | From the account card with no visit, and from a vault case before custody ([Identity Check](/p/grade10-site/vault/identity-check)). | Product |
| Sign-in | Decided | Not required for a visit's check; a case can exist before its collector has an account. | Product |
| Trust in a verdict | Decided | Proven to come from the provider, about a check we issued, acted on once. Anything else changes nothing and is recorded as rejected. | Engineering |
| Evidence lives here | Decided | Provider images are pulled into Grade10's bucket before the identity is readable. A record naming no evidence is a claim, not a check. | Product |
| The face is not stored | Decided | Grade10 runs no matching engine, so a stored selfie could never be re-compared; the record keeps the provider's finding, not the capture. | Product |
| Refusals are ours | Decided | Age and expiry are judged by Grade10 on the returned dates, never taken from the provider's verdict. | Compliance |
| Raw number | Decided | Never stored, returned or logged, whoever supplied it. | Product |
| What a decline says | Decided | That the check could not be completed online and the counter is another way — no reason. The findings are an operator's, behind `kyc:read`. | Compliance |
| Invitation and check lifetimes | Decided | 14 days and 24 hours; stalled a day after submission, expired after 7 days undecided. Outlives a collector who books two weeks ahead. | Product |
| Documents and countries | Decided | Passports of any country; national ID cards, driving licences and residence permits from Hong Kong, Macau, mainland China, Taiwan, Japan, South Korea and Singapore, as the provider authenticates them. Set on the template, recorded in the deployment checklist. | Compliance |
| Erasure reaches the vendor | Decided | A release commands the provider and keeps asking; a standing window erases the copy regardless. Grade10's own purge never waits. | Compliance |
| The provider's window | Decided | 30 days: long enough to review a disputed check, short enough to be a control on a copy Grade10 does not hold. | Compliance |
| Retention windows | ❓ Open | Unset for every class, so nothing is deleted on a schedule — see [account data](/platform/account-data). | Compliance |
| One service per brand | Decided | A brand's identities live in a KYC service of its own, reached only by its products; ZZZ verifies nobody and gates nothing until a ZZZ product verifies somebody. | Product |

**Risks.**

- **A first-time bar** — a collector reaching it at checkout meets a
  verification they did not plan for; the card on the account page and the
  recognition of a vault check keep that a one-time cost
- **A trust boundary** — a verdict is one the estate has never had, every
  identity before it written by an authenticated operator
- **Two copies of the document** — until the provider's window closes; the
  alternative, leaving the evidence at the vendor, makes a legal record depend
  on a vendor's API and retention policy years after the agreement was signed,
  and a held case keeps its binding and its record while the provider's copy
  still goes on its window
:::
