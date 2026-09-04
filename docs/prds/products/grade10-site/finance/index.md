---
title: Finance
---

Grade10 Finance is the loan against graded cards the owner announced for
Q4 2026, and the application repository holds two things under that name: a
financed lane inside the vault that already runs the loan, and an empty
service shell reserved for a product nobody has defined.

- **The owner's product** — a loan against graded cards from a separate legal
  entity, **~40%** loan to value, **1.5% to 2.5%** interest, the shop opening
  mid October and Finance in **Q4 2026**, licences obtained; the notes are
  [Grade10 Finance](/references/grade10-finance)
- **Where the loan runs today** — the vault's financed lane, under the shop's
  name and in the shop's database; every page of
  [the vault](/p/grade10-site/vault) describes that product
- **The shell** — a deployed worker with its own database, an hourly
  audit-chain walk, the session and permission ladder, and no business logic:
  no tables, no procedures, no customer or operator surface, no console
  section; its permission map is empty and pinned that way by a test
- **The grants** — `finance:read`, `finance:operate`, `finance:approve` and
  `finance:payout` already exist in the shared vocabulary; staff hold the
  first three, treasurers read and pay out, so a disbursement would take two
  people the day a procedure exists

## The owner's flow against what is built

| Step | Built | Gap |
| --- | --- | --- |
| Sign in with Google or a magic link | yes, plus an emailed code | a `finance.grade.com` host would not share the `.grade10.com` session cookie |
| Verify the phone by SMS | no; the WhatsApp number is free text | an SMS provider and a verified-phone fact |
| Submit photos, amount, items | the vault wizard, one item per case | a multi-card request is several cases |
| Preliminary authentication and valuation | staff valuation on the case | a **100%** ceiling only until the brand's loan-to-value cap is set; the owner's ~40% is one unset value |
| e-KYC at the request step ❓ | no; identity is checked at the counter by staff | online capture, a hosted provider, screening |
| The offer and contact on WhatsApp | an offer email and a click-to-chat link staff press | no WhatsApp Business API, no inbound channel |
| Choose the custodian, Grade10 Vault or Tiny | no; a location is a shop to visit, and the paper says "a Grade10 store vault" | a custodian entity, a recorded legal choice, an agreement per custodian |
| Book a time slot | the diary, for the vault only | a finance entrypoint and binding if finance books on its own |
| Visit, e-KYC, inspection | yes | — |
| Recorded call explaining key terms | no | telephony, storage as sealed evidence, a precondition to signing |
| Both sign, staff from the admin and the user on the iPad or their own account | the collector alone signs, on any device holding the link | a staff signer role and its ceremony leg |
| Manual FPS payout with proof recorded | a payout record with a required bank reference and the date the money left | a proof attachment, a reference format |
| Repayment recorded manually | yes | — |
| Automated reminders | no; every other event now mails | the two reminder kinds on the existing map, a scheduled pass, the cadence, a channel beyond email |

## What a first lending procedure needs

- **Tables** — cases, items, valuations, offers, payouts, repayments,
  custodians, and the signing tables the document package publishes as
  factories
- **Bindings** — a finance entrypoint on the diary and on the identity store,
  each one line where the vault's is minted, plus the two service bindings
  the worker does not declare
- **Storage** — buckets for documents, photos and a locked archive; the fonts
  a Chinese name needs to seal
- **Surfaces** — a public tier, a console section with its grant and nav
  entry, an admin-frontend package, a customer surface or a new site id
- **Wiring** — the notification channel and its mail key, retention classes,
  erasure fan-out, a development Hyperdrive id
- **Policy** — values for the entity and lending tables the platform now
  carries unset: legal name and licence, loan to value, rate band, term
  presets, offer validity, grace, an accrued cap; fees

:::callout{kind="warning"}
The shell is reserved for a product nobody has described. The owner's notes,
the one primary source, name graded cards as the collateral and describe step
for step what the vault's financed lane does. Three resolutions are open and
none is chosen: Finance is the vault's lane re-papered under the lending
entity; Finance is a second product rebuilt on vault machinery with its own
cases and database; or Finance is genuinely something else and the Q4 loan
ships from the vault regardless.
:::

:::callout{kind="warning"}
The lender on the paper is a string. The custody, loan and release documents
print "Grade10", the email catalogue is the shop's, and the loan rows live in
the vault's database, while the account-data policy walls Finance in a project
of its own. A separately licensed lender cannot sign paper that says "Grade10
lends you the principal".
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A shell from day one | Decided | The first procedure lands behind a database, session, permission ladder and audit sink with no wiring change | Engineering |
| Own database | Decided | A wall around money beside auth, the identity store and the vault | Engineering |
| Two people on a disbursement | Decided | Staff approve, treasurers pay; disjoint on payout | Product |
| Which product Finance is | ❓ Open | The vault's lane re-papered under the lending entity, a second product on vault machinery, or something else | Owner |
| Entity as data | Decided | A per-brand table carrying trading name, legal name, licence number and wording, read by the templates; every legal field is unset and production refuses paper until it is named | Engineering |
| Custodian | ❓ Open | Whether Tiny runs the same ceremony and console or its own staff under its own name | Owner |
| Host | ❓ Open | `finance.grade.com` or a path on `grade10.com`; the notes say one domain and the registry another | Owner |
| Online e-KYC | ❓ Open | Required at the request step, or is the counter check sufficient for the licence | Legal |
| Recorded call | ❓ Open | Vendor, storage, retention | Owner |
| Ledger | ❓ Open | The account-data policy promises append-only double entry; the vault, the live lender, keeps single-entry records and the shell keeps none | Finance |
:::

:::detail{title="For engineers" for="engineer"}
- **Shell** — `packages/grade10-finance/{contracts,backend}` and
  `apps/backend/grade10/finance`, deployed as `grade10-finance-service`;
  migrations `0000` to `0006` create `audit_logs`, its genesis row, the verify
  cursor and their guards; the router mounts `audit` only; secrets are empty
- **Reachable** — the gateway routes `/finance`; the console lists its chain
  in the audit section, and its diary erasure client for finance works today
  because erasure takes the product as an argument; what is unminted is the
  booking entrypoint
- **Reusable** — the diary and the identity store mint services per product
  from class factories and already name `finance`; the document package is a
  host contract the vault alone implements
- **Vault-coupled** — the three templates, the `customer` signer role, the
  lane packet sets, the `/vault/sign` route and the shop's email catalogue
- **Background** —
  [account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
  for the isolation and ledger policy, and
  [operations](https://github.com/9gag/grade10/blob/main/docs/operations.md)
  for the chain walk
:::
