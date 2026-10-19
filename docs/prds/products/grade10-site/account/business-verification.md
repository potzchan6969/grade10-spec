---
title: Business Verification
order: 3
---

A business verification proves that a collector's account acts for a real
business and who stands behind it, and only Grade10 asks for one.

| Rule | Value |
| --- | --- |
| Who is asked | An account an admin requires to verify its business - [KYC · Requests](/p/grade10-site/account/kyc#requests) |
| Before it starts | The person acting is verified - [KYC](/p/grade10-site/account/kyc) |
| Who runs it | The verification provider, on its own pages |
| One live check | One business check per account at a time |
| Review due | ❓ **12 months** after the business is verified - Compliance confirms |

## Business Card

The second card on the verification page, `grade10.com/verification`.

| The card reads | When |
| --- | --- |
| Verify your identity first | The person acting is not verified; the card offers nothing else |
| Not verified | Nothing is on file; the card offers to verify the business |
| Being reviewed | A reviewer at the provider is deciding |
| Waiting for the people named | Approved, and a named person has not yet verified; each reads Verified or Waiting, with an invite link to copy - [People Behind the Business](#people-behind-the-business) |
| Verified until a day | The business holds; the day is when its review is due |
| Due for review | The review day has passed; the card offers to verify the business again |
| Declined | The provider declined it; the card offers to try again, and the reason stays with an operator |

## The Check

:::flow{title="Verifying a business"}
## *Collector* - **Opens the business card**
Signed in and verified as a person; the card names what the provider asks
for.
## *Collector* - **Completes the provider's form**
The business, its registration, the people who own or run it, and its
documents, on the provider's pages.
## *Provider* - **Checks and screens**
Reads the business registry, screens the business and its people against
watchlists and lists of politically exposed people.
## *Provider* - **A reviewer decides**
In the provider's case, approved or declined.
## *Grade10* - **Keeps the record**
The verdict lands on the account, and the business card reads verified.
:::

- **Nothing about the business on the site** - the card names a standing and
  a day; the business's details reach operators under `kyc:read` only
- **A business request also asks for the person** - the account holds a
  business only while the person acting holds a verified identity too

## What Grade10 Keeps

- **The business** - its legal name, registration number, country and
  registered address
- **The people named** - what the template's way keeps of each one -
  [People Behind the Business](#people-behind-the-business)
- **The evidence** - one registration document, an image or a PDF, in
  Grade10's own bucket
- **The provider's findings** - the registry match and the screening, matched
  or clear
- **Erased with the account** - as a person's check is - [KYC Service ·
  Erasure](/p/grade10-site/account/kyc-service#erasure)

## People Behind the Business

How Grade10 is satisfied about the people a business names is set per
provider template, one of three ways.

| Way | What happens to each named person | What Grade10 keeps of them |
| --- | --- | --- |
| Screen | Screened by the provider; its reviewer judges who may act | Name, role, ownership, screening outcome |
| Accounts | Invited from the business card to link their own Grade10 account and verify it as a person; the business holds once every named person has | Name as the provider lists it, and the link to their account; nothing else |
| Provider check | The provider runs an identity check on each one | Name, role, ownership, and each person's outcome inside the business record |

- ❓ **Which way** - each template's way is still open; development and
  staging run Accounts; Compliance confirms
- **Provider check and erasure** - a named person with no account is erased
  by an operator redacting the business record
- ❓ **Whether redaction is enough** - the DPIA may change how that person is
  erased; Compliance confirms
- ❓ **Their own inquiry** - in the Provider check way, erasing a person with
  no account also queues their own provider inquiry for redaction, pending the
  DPIA; Compliance confirms

:::detail{title="Code map" for="engineer"}
- **The host** - `packages/grade10-store/backend/src/kyc/`: the business
  case beside the account's own
- **The record** - `grade10-e-kyc-service`, one record for a person or a
  business
- **The card** - `@grade10/store-frontend/identity`; words in the `identity`
  catalogue
:::

:::detail{title="Product decisions" for="pm"}
Some sales need to know the business behind an account, not only the person.
Grade10 asks for that when an admin judges it is needed, and leaves the form,
the registry and the review to the provider.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Buys for a business and was asked to verify it | Completes the provider's form once and bids again. |
| Admin | An account trades as a business | Requires a business verification, and its bids wait until it passes. |
| Compliance | Reviewing a business years later | Reads the business, its people and its registration without a vendor. |

**Not in scope.** Starting a business check unasked. Bidding or being invoiced
as the business rather than the person. Continuous monitoring of the business.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| On request only | Decided | A business is verified only when an admin requires it, decided 2026-10-13. | Owner |
| The person first | Decided | A business request requires the person acting to be verified, and the business card waits until they are. | Owner |
| Hosted | Decided | The provider hosts the form, checks the registry, screens the business and its people, and its reviewer decides. | Owner |
| People behind the business | Decided | Three ways - Screen, Accounts, Provider check - chosen per template, decided 2026-10-14. | Owner |
| Which way | ❓ Open | Each template's way. | Compliance |
| Review due | ❓ Open | 12 months after the business is verified. | Compliance |
| Provider check and erasure | ❓ Open | Whether an operator redaction is enough to erase a named person outside an account. | Compliance |
| Their own inquiry | ❓ Open | In the Provider check way, erasing a named person with no account also queues their own provider inquiry for redaction, pending the DPIA. | Compliance |
| Consent for a business check | ❓ Open | Pressing Verify business is the consent today; a dedicated line is Compliance's call. | Compliance |
| Provisioning | ❓ Open | The provider's business verification is not yet enabled on Grade10's account. | Engineering |
:::
