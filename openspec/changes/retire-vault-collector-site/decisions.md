## Goals

- The grade10 site carries no collector vault screen but the signing ceremony
  on the shop's iPad
- The store carries no vault collector block, and its catalogs no key only
  those screens read
- Every behaviour of the collector's own case stays a contract of the worker,
  so @tangconst designs the screens again from the backend as it stands
- What the removed screens alone proved leaves the suites as deprecated
  cases; what the worker proves stays and is walked against its API

## Non-Goals

- Designing the collector's screens again: @tangconst's, from the
  [Vault digital twin](../../../docs/references/grade10-vault-digital-twin.md)
- Changing the worker, its API, the console, the emails, the PDFs, the
  signing ceremony or their words
- A new guard in the worker for anything a removed screen alone held back
- Moving a mailed link to another address
- Retiring the vault's journeys: the collector still asks, answers, books and
  reads, through the worker, and the screens will walk the same journeys
- `shared/ui/page-blocks`: its loading cards and case cards stay, read by
  grading's pages

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Do the collector's vault screens stay on the site? | No: `/vault`, `/vault/new`, `/vault/cases/:caseId`, `/vault/verify`, `/profile/data`, the profile's Your data button and the header's Vault item go, with the store's `VaultCases`, `VaultCasesEmpty` and `VaultAcceptOfferDialog`; @tangconst designs the screens again from the backend - decided by the owner, 2026-10-02 | Keeping the screens until the new design lands, which ships a design nobody agreed |
| Q2 | What stays? | The worker, its API, the contracts, the sweeps, the console, the emails, the PDFs and their words, and the signing ceremony at `/vault/sign` with `vault.ceremony` - decided by the owner, 2026-10-02 | Taking the ceremony too, which leaves no way to sign at the counter |
| Q3 | What happens to a requirement that names a removed screen? | It keeps the behaviour, stated as what the worker answers or accepts on the collector's own case, with no screen, layout, words or control; a requirement that is only a screen's presentation is removed (recommended) | Removing every requirement that names a page, which takes the worker's contract out with the screen |
| Q4 | Do the vault's journeys retire? | No: they stay as they are, and the screens will walk them again (recommended) | Retiring them, which leaves every deprecated case tracing a journey the suites no longer hold |
| Q5 | What does `shared/ui/vault-case` keep? | One requirement: the package exports no vault collector block. Its feature set keeps its four groups so the deprecated cases still trace them, each labelled item read as retired (recommended) | Removing every requirement: a spec must hold one, and nothing in the store retires a whole capability |
| Q6 | What happens to a case whose subject is a removed screen? | Deprecated, copied whole, never deleted; a case proving the worker stays, and its walk calls the API (recommended) | Deleting them, which loses what was once proved |
| Q7 | What is the vault's set in carried surfaces? | The signing ceremony alone - decided by the owner, 2026-10-02 | Keeping the vault home, a case's page and the identity check in the set |
| Q8 | Which surface do navigation's sign-in scenarios ask at? | The collector's bidding history, which asks for sign-in as the vault did (recommended) | Keeping the vault as the example, an address nothing answers |
| Q9 | What does retention's Your data group become? | It keeps its name, now naming what the collector reads under their own account rather than a page: the classes and windows, the identity standing, the signed documents and the ask (recommended) | Removing the group, which loses the identity standing's rule: never the name, never the document |
| Q10 | What happens to the e2e walks of the site's vault pages? | A walk of a removed screen goes; a walk that proves the worker calls its API instead - decided by the owner, 2026-10-02 | Keeping the walks against pages that no longer exist |
| Q11 | What happens to the site's vault design boards? | Nothing retires: they exist only inside in-flight changes' `ui-design.md`, never as durable boards (recommended) | A retirement record for boards that were never durable |
| Q12 | What about the in-flight changes that touch the removed screens? | Each keeps its own scope: `vault-home-case-cards` has archived, and its cases are deprecated here with the rest of vault-case's; `add-item-registry` group 12, the wizard's first step, has no wizard to build on; `add-hosted-identity-verification` draws a page at `/vault/verify` under its own requirement, and its tasks 1.2, 1.5 and group 13 name it; `add-card-grading`'s pages and catalog point the collector at Your data. This change modifies no requirement another active change folds: `add-item-registry` keeps `A request states one item, in the brand's own currency` and `A draft holding a slab the register knows changes only its photos and description`, and `add-card-grading` keeps `An erasure is refused by name while a submission is live`, each with its screen wording; each of those changes owes them its own disposition against the removed screens, and since this change re-versions cases those changes edit (`add-item-registry`'s case-intake US1-TC22 and US1-TC23, `add-card-grading`'s retention US4-TC5, US4-TC8 and US4-TC10), their archive preflight needs compatibility acknowledgements naming this change. Grading's copy `submission.collected.whatNext.yourData` and `booked.vaultLine`, and operator-queue's "the word the collector's own case page shows", still name removed screens and are their owners' to reword (recommended) | Rewriting those changes from this one |
| Q13 | Where does a mailed link land, now no page answers it? | Unchanged: the worker keeps sending them; `CASE_PATH`, `VERIFY_PATH` and the sign-in resume keep their addresses and answer not-found until the screens ship, and the manual lists each link that lands nowhere; no page is invented - settled by recommendation, owner delegation 2026-10-02 | Pointing them at a page that exists, such as the front door |
| Q14 | How does a customer send a walk-in draft staff opened, with no request screen? | The draft waits on its own clock and ends silently, as it does now, until the request screen ships - settled by recommendation, owner delegation 2026-10-02 | A console send on the customer's behalf, a new act nobody decided |
| Q15 | Is the ask to be forgotten refused while a grading submission is live? | No new guard: the worker accepts the ask, and grading's erasure refuses when an admin runs it, as it does now - settled by recommendation, owner delegation 2026-10-02 | A refusal on filing, which Your data's page held only by hiding the ask |
| Q16 | Is filing the ask to be forgotten refused while a vault case is in flight, and by whom? | Yes, by the vault, before anything is filed with auth: the worker's own erasure ask is refused by name while the collector holds a request in flight, an item in the vault or a running loan, naming each case by its reference and its hold; a grading submission is Q15's (recommended) | Leaving the refusal to the admin's run, which files an ask the vault then refuses to act on |
| Q17 | Is a send naming a statement version other than the one in force refused? | Yes: refused by name, and the request stays unsent until it names the version in force (recommended) | Keeping the request with the older version |
| Q18 | What does the one download answer a collector who has signed nothing? | An empty archive; Your data carries them no signed document, so the count reads none before it is taken (recommended) | A refusal by name |
| Q19 | Does the borrower's own read of a live loan carry the how-to-pay block? | Yes, the same values every money message carries; no other case carries it, and in production an unset value carries no block (recommended) | Carrying it only in the money messages, which leaves the read naming an amount owed with nowhere to pay it |
| Q20 | On a lane that carries the vault, does the front door carry a vault button or card? | No, on any lane: the front door names no address no build carries, and the ceremony is reached only by the link staff hand over (recommended) | A vault card leading to the ceremony, whose address answers only with a case's token |
| Q21 | Is a second ask for the item back refused? | No: it is answered with the case as the first ask left it, and records nothing (recommended) | Refusing it by name |
| Q22 | Is a decline sent after the offer ran out refused? | As the worker does now: a decline is judged against no expiry. Before the expiry sweep runs, a decline past the expiry is taken - the offer closes `declined_by_customer` and the case goes back to valuation; after the sweep, it is refused `NO_OPEN_OFFER`. Whether a decline should be refused at the expiry as an accept is, the owner confirms in a later change (recommended) | Refusing it as an offer that ran out, a new guard this change does not add |
| Q23 | What does the calendar file answer for the collector's own case with no visit, or a cancelled one? | A case the diary never booked is refused by name as not found; a called-off visit is served as a cancellation of the same entry (recommended) | An empty calendar file for both |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/vault/collector-notifications` | Every email's case link and the identity invitation's link land on an address no page answers | Q13 |
| `grade10-admin/vault/operator-queue` | A walk-in draft says the customer sends it from their own phone, and no screen sends it | Q14 |
| `grade10-site/vault/retention-and-erasure` | Your data hid the ask while a grading submission was live; nothing in the worker refuses it on filing | Q15 |
| `grade10-site/vault/retention-and-erasure` | Your data's ask is now "refused by name while an item is held or a loan is running", where the removed page only withheld it in words; the non-goals rule out a new guard for what a screen alone held back, and the account files the ask with auth, not the vault. Is filing the ask refused while a vault case is in flight, and by which service, or is the refusal only the vault's hold when an admin runs the erasure? | Q16 |
| `grade10-site/vault/case-intake` | A send carries the collector's word on the statement version they were shown. Is a send refused when that version is not the one the vault offers at the send, such as when Legal's wording changed between the read and the send, or is it kept with the older version? | Q17 |
| `grade10-site/vault/documents-and-signing` | The removed page withheld Download all from a collector who had signed nothing. What does the one download answer them now: an empty bundle, or a refusal by name? | Q18 |
| `grade10-site/vault/loan-and-settlement` | The How to pay group still says the block stands "on the live loan", and the page that printed it under the balance is gone. Does the borrower's own read of a live loan carry the how-to-pay block? | Q19 |
| `grade10-site/site/carried-surfaces` | On a lane that carries the vault, its only surface is the signing ceremony, reached from a link staff hand over. Does the front door still carry a vault button and card there, and if so, where do they lead? | Q20 |
| `grade10-site/vault/case-lifecycle` | The collector's ask for the item back is an act on their own case. Is a second ask on the same case refused by name, or answered as the first ask again? | Q21 |
| `grade10-site/vault/valuation-and-offer` | An expired offer "cannot be accepted", and an offer that ran out is "refused by name to whoever gave it". Is a decline sent after the expiry refused too, or does it close the lapsed offer as declined? | Q22 |
| `grade10-site/vault/visit-booking` | The calendar file is served for the collector's own case. What does the worker answer for the collector's own case with no visit standing, or a visit already cancelled? | Q23 |
