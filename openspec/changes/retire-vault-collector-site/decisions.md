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
| Q12 | What about the in-flight changes that touch the removed screens? | Each keeps its own scope: `vault-home-case-cards` archives before this change is accepted; `add-item-registry` group 12, the wizard's first step, has no wizard to build on; `add-hosted-identity-verification` draws a page at `/vault/verify` under its own requirement, and its tasks 1.2, 1.5 and group 13 name it; `add-card-grading`'s pages and catalog point the collector at Your data (recommended) | Rewriting those changes from this one |
| Q13 | Where does a mailed link land, now no page answers it? | ❓ Owner, with @tangconst - recommended: unchanged; `CASE_PATH`, `VERIFY_PATH` and the sign-in resume keep their addresses and answer not-found until the screens ship | Pointing them at a page that exists, such as the front door |
| Q14 | How does a customer send a walk-in draft staff opened, with no request screen? | ❓ Owner, with @tangconst - recommended: the draft waits on its own clock and ends silently, as it does now, until the request screen ships | A console send on the customer's behalf, a new act nobody decided |
| Q15 | Is the ask to be forgotten refused while a grading submission is live? | ❓ Owner - recommended: no new guard; the worker accepts the ask, and grading's erasure refuses when an admin runs it, as it does now | A refusal on filing, which Your data's page held only by hiding the ask |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/vault/collector-notifications` | Every email's case link and the identity invitation's link land on an address no page answers | Q13 |
| `grade10-admin/vault/operator-queue` | A walk-in draft says the customer sends it from their own phone, and no screen sends it | Q14 |
| `grade10-site/vault/retention-and-erasure` | Your data hid the ask while a grading submission was live; nothing in the worker refuses it on filing | Q15 |
