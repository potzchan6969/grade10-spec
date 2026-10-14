---
title: KYC
spec: grade10-site/store/account-identity
order: 2
---

A collector verifies who they are once, from their own account, and is
recognised wherever Grade10 asks: at a bid at or above the bar,
when Grade10 asks them to verify, and at a vault visit.

## Values

A bar is the amount at or above which a bid needs a verified person. Each
currency has its own fixed bar, with no exchange rate between them.

| Rule | Value |
| --- | --- |
| Bid on an HKD lot | **HKD 120,000** |
| Bid on a USD lot | ❓ **USD 15,000** - Compliance confirms |
| Bid on a JPY lot | ❓ **JPY 2,300,000** - Compliance confirms |
| A request from Grade10 | Every new or raised maximum, any amount, until the account passes - [Requests](#requests) |

## Verification Page

The page where a collector sees where they stand and verifies.

- **URL** - `grade10.com/verification`, signed in; a held bid links here and
  the page offers **Back to the lot**
- **Identity** - verified until a day, expired, being reviewed, or not yet;
  read from the KYC service the day the page is opened, whichever product
  verified them
- **Business** - the business card, offered once the person is verified -
  [Business Verification](/p/grade10-site/account/business-verification)
- **Requests** - each request not yet met reads **We asked you to verify
  your identity** or **your business**, never the reason
- **Nothing about the person** - the page names a standing and a day; no
  name, birth date, document or finding reaches the site
- ❓ **The account page** - whether `grade10.com/profile` keeps its identity
  card beside a link to this page; Design confirms

### Verifying

- **Consent first** - the page says the provider checks the ID document,
  takes a short selfie and screens the name against watchlists and lists of
  politically exposed people, what Grade10 keeps, that it counts across
  Grade10, and that erasure is on request; nothing reaches the provider before
  the box is ticked
- **Recognised** - a collector the vault verified is told so, and nothing is
  started
- **On the provider's page** - on this device; the verdict lands on its own -
  [Hosted Verification](/p/grade10-site/account/kyc-service#hosted-verification)
- **Being reviewed** - a check a reviewer holds reads as being reviewed, and
  nothing is asked of the collector
- **Declined** - the page says the check could not be completed online, names
  the counter as another way, and offers to try again; the reason stays with
  an operator

## Requests

An admin can require any account to verify its person or its business, with a
reason, from the account's Identity card - [Users](/p/grade10-admin/console/user-directory#identity).

- **Every bid held** - until the account passes, every new or raised maximum
  is held at the storefront, at any amount and in any currency
- **Forward only** - a maximum that already stands keeps bidding, as it does
  under a suspension
- **The store** - a checkout asks nothing about identity, request or not
- **A business request** - also requires the person acting for the business
  to be verified
- **What the collector reads** - that Grade10 asked them to verify, never the
  reason
- **Met or dropped** - a request is met while the account holds what it asks
  for, and holds nothing while met; it stays on the account until an admin
  drops it, which takes no reason. The audit names the account and the
  subject, never the reason
- ❓ **Who is asked** - rules that raise a request on their own come later;
  today an admin asks; Product confirms

## Screening

Every hosted check screens the person against watchlists and lists of
politically exposed people.

- **A match** - waits for a reviewer at the provider, who approves or declines
  it; the collector reads that the check is being reviewed
- **The finding** - matched or clear, for operators under `kyc:read`, never
  for the collector
- ❓ **At the counter** - whether a counter check is screened too before
  production; Compliance confirms

## KYC Service

Where a verified identity lives, what it holds, how it is reused and erased,
and the hosted check's states - [KYC Service](/p/grade10-site/account/kyc-service).

:::detail{title="Code map" for="engineer"}
- **The host** - `packages/grade10-store/backend/src/kyc/`: the account as
  the case, the gate, the requests
- **The page** - `@grade10/store-frontend/identity`; words in the `identity`
  and `verification` catalogues
- **The gate** - `auction.placeBid` in the store's tRPC routers, on `identityGates` from
  `@grade10/app-env`
- **The switch** - the `identity` gate in `@grade10/app-env`
- **The service** - [KYC Service](/p/grade10-site/account/kyc-service)
:::

:::detail{title="Product decisions" for="pm"}
The check is the collector's to complete on their own device, because a
document read at a counter produces no liveness or tamper signal; the service
behind it has its own decisions - [KYC Service](/p/grade10-site/account/kyc-service).

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Bidding above the bar | Verifies once, from the account, and is not asked at the next high-value bid. |
| Collector | Asked by Grade10 to verify | Sees what is asked and where, verifies, and bids again. |
| Collector | Document lapsed | Finds out at home, not after travelling. |
| Admin | An account needs a closer look | Requires a verification with a reason, and the account's bids wait until it passes. |
| Compliance | A bid above the bar, or a signed agreement years later | The account holds a verified, screened identity with consent on record; the evidence is readable without a vendor. |

**Not in scope.** Verifying a guest. Any identity field on the site. Inviting
by email from the store. Telling the collector why they were asked.
Continuous monitoring after a check. Re-verification on a schedule. A unique
constraint on the document digest. Putting a browser in front of the KYC
service.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Verified above the bar | Share of bids at or above the bar placed by a verified collector. | Product |
| Requests met | Share of requests met, and the median days from request to met. | Compliance |
| Recognised | Share of verifications reused rather than repeated. | Product |
| Drop-off | Share of checks started that never decide. | Product |
| Erasure completeness | Share of releases whose provider command is acknowledged within the stated window. | Compliance |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The bar | Decided | HKD 120,000 on a bid on an HKD lot - the value at which a Hong Kong dealer in high-value goods has to know its customer. A bid on a lot in another currency meets that currency's own fixed bar, with no exchange rate, decided 2026-10-13. | Product |
| USD and JPY bars | ❓ Open | USD 15,000 and JPY 2,300,000 proposed. | Compliance |
| Requests | Decided | An admin may require any account to verify its person or its business, with a reason; until met, every new or raised maximum is held at any amount; a business request requires the person too; the collector never reads the reason; decided 2026-10-13. | Owner |
| Rules that ask | ❓ Open | Which facts raise a request on their own. | Product |
| Verification page | Decided | Verification moves to its own page, `grade10.com/verification`, with the identity card, the business card and the requests; a held bid links there and returns to the lot, decided 2026-10-13. | Owner |
| Where identity is off | Decided | No request can be made and none is offered; the page shows nothing about identity. | Owner |
| Where the gate stands | Decided | At the storefront, before the auction hears of a bid. | Engineering |
| Checkout bar | Decided | Dropped 2026-10-13. Grade10 never required a sign-in or a verified identity for a checkout at HKD 120,000; only a bid asks. | Product |
| A gate reads a standing | Decided | A product that only asks whether a person is verified reads a standing and never the record; it reads one only when the bar or a request applies. | Product |
| Screening | Decided | Every hosted check is screened against watchlists and politically exposed people; a match waits for the provider's reviewer, decided 2026-10-13. An approval without every screening ready - errored, still running or missing - waits as reviewing rather than landing, decided 2026-10-14. | Owner |
| Counter screening | ❓ Open | Whether a counter check is screened before production. | Compliance |
| An unverified winner's invoice | ❓ Open | Whether a won lot's invoice waits for a verified winner, at the bar with the premium or on a request, before production. | Compliance |
| Consent | Decided | Explicit, on the page that starts the check, stamped on the check; the text names the document and face check, watchlist and political-exposure screening, what is kept, reuse across Grade10, and erasure. A DPIA is completed before production; the provider's DPA governs the transfer. | Compliance |
| Reuse without re-consent | Decided | One consent covers every Grade10 service and says so. | Compliance |
| Vendor | Decided | Persona - hosted government-ID and selfie check, screening, a reviewer's case, verdict by webhook, a redaction command, and org-level retention policies. The spec names no vendor. | Product |
| What a decline says | Decided | That the check could not be completed online and the counter is another way - no reason. The findings are an operator's, behind `kyc:read`. | Compliance |

**Risks.**

- **A first-time bar** - a collector reaching it meets a verification they did
  not plan for; the verification page and the recognition of a vault check
  keep that a one-time cost
- **A held collector** - a request holds every new or raised maximum, so an
  account asked in error waits until an admin drops it
:::
