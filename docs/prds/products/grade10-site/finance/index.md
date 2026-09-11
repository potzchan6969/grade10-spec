---
title: Finance
icon: bank
---

Grade10 Finance is the loan the vault's financed lane runs: a collector's
graded card in the shop's vault, an offer, a signature, and a bank transfer a
treasurer records. It is a lane on a case rather than a service of its own,
and the lender it is made under is not the entity that holds the item.

- **The product** — a loan against graded cards at **~40%** loan to value and
  **1.5% to 2.5%** interest per **30 days**, announced for **Q4 2026**; the
  owner's notes are [Grade10 Finance](/references/grade10-finance)
- **Where it runs** — the vault's financed lane, on the case that holds the
  collateral; every page of [the vault](/p/grade10-site/vault) describes it
- **Who lends** — the lender named in the brand's legal identity, whose name
  and licence print on the loan agreement; the custodian holds the item and
  signs the custody agreement
- **Where it answers** — `grade10.com/vault`, one host and a path, with a
  vanity domain redirecting to it
- **One of everything** — one case, one database, one worker, one console
  section: the loan lives where its collateral does, and infrastructure held
  in reserve for a product nobody has described is a moving part with no owner

## Owner's flow and gaps

| Step | Built | Gap |
| --- | --- | --- |
| Sign in with Google or a magic link | yes | — |
| Verify the phone by SMS | no; the number is stored in E.164 and confirmed by nothing | an SMS provider and a verified-phone fact |
| Submit photos, amount, items | the vault wizard, one item per case | a multi-card request is several requests, with one visit booked on the first |
| Preliminary authentication and valuation | staff valuation on the case, capped at the brand's **40%** of it | — |
| e-KYC at the request step | no; identity is checked at the counter by staff | online capture, a hosted provider, screening |
| The offer and contact on WhatsApp | an offer email the collector answers from their own case page, and a click-to-chat link staff press | no WhatsApp Business API, no inbound channel |
| Choose the custodian, Grade10 Vault or Tiny | no; the item is held at the shop the case names | a second custodian entity, its own agreement and its own staff |
| Book a time slot | the diary, at every live status but a draft | — |
| Visit, e-KYC, inspection | yes | — |
| Recorded call explaining key terms | the counter records that the terms were explained, with a recording reference where there is one, before the loan packet may be prepared | telephony and the storage of the recording itself |
| Both sign, staff from the admin and the user on the iPad or their own account | the borrower signs; the agreement states the lender executes it on the advance | a staff signer role and its ceremony leg |
| Manual FPS payout with proof recorded | a payout record with a required bank reference and the date the money left, correctable by a second money holder | — |
| Repayment recorded manually | yes | — |
| Automated reminders | **7** and **1** days before the due date, then every **7** days overdue, by email | a channel beyond email |

:::detail{title="Code map" for="engineer"}
- **The lane** — `packages/vault/{contracts,backend,frontend,admin-frontend}`;
  the financing amount at intake is the lane, and every guard reads it off the
  case
- **The entity** — `packages/app-env/src/legalIdentity.ts` carries both
  parties; `documents/legalEntity.ts` answers which one a document prints
- **The policy** — `packages/app-env/src/lending.ts`, seeded for grade10
- **Background** —
  [vault architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
  for the case machine and the two lanes, and
  [account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
  for the isolation and ledger policy
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Finance is the vault's financed lane | Decided | The owner's notes describe the vault's flow step for step, and the collateral is the item the vault itself holds; a second service would be a second copy of one product | Owner |
| Two entities, one table | Decided | The custodian holds and the lender lends, each printing on its own paper; the lender's name refuses an offer in production, so custody opens while the lender is still being registered | Legal |
| Host | Decided | One host and a path, `grade10.com/vault`; a vanity domain redirects, because a second host would not share the session cookie | Owner |
| A second custodian | Deferred | Tiny holding items under its own name, agreement and staff. Reopens with a signed custody contract | Owner |
| Online e-KYC at the request step | Deferred | The counter check stands. Reopens when Legal names a duty that the counter cannot meet | Legal |
| The recorded call | Decided | The counter records that the key terms were explained and the borrower signs a line saying so; the telephony and the recording's storage are a vendor's, and no packet is prepared without the record | Owner |
| The book | Decided | Single entry with derived balances is the product's book; double entry is the general ledger, kept in the firm's accounting system from a ledger export | Finance |
:::
