## Context

The collector's vault screens live in two places. The store holds the
`vault-case` blocks in `packages/ui/src/blocks/vault-case` (`VaultCases`,
`VaultCasesEmpty`, `VaultAcceptOfferDialog`, their stories, `fixtures.ts`
and `public-exports.test.ts`), exported from `packages/ui/src/index.ts`, and
the words they read in `@grade10/i18n`. The monorepo draws the pages from
`packages/vault/frontend` behind the site routes `vault`, `vault-new`,
`vault-case`, `vault-verify` and `your-data`.

The worker stays as it is. Every behaviour the screens showed is a read or an
act on the collector `casesRouter` in
`packages/vault/backend/src/trpc/routers/cases.ts` (`mine`, `detail`,
`create`, `updateDraft`, `collectionStatement`, `submit`, `slots`, `book`,
`reschedule`, `cancelBooking`, `accept`, `decline`, `cancel`, `yourData`,
`requestErasure`, `cancelErasure`, `requestRelease`), or a byte route in
`VAULT_PATHS` (photos, `visit.ics`, `documents.zip`). `caseDetailSchema`,
`vaultCaseSchema` and the contracts' `caseStanding` fold carry what the case
page drew.

## Goals / Non-Goals

**Goals:**

- No vault collector block, story, fixture, export or catalog key the
  removed screens alone read is left in the store
- Every collector vault address but `/vault/sign` answers not-found on every
  lane
- Every scenario a kept requirement holds is decided by a worker, API or
  contract test, or by an e2e walk that calls the API

**Non-Goals:**

- Changing the worker, the console, the emails, the PDFs or the ceremony
- The page-blocks slot names that mention the vault (`vault-case-keeps`) and
  the stage rail's `vault` stage; they are the page blocks' own
- Rewriting the in-flight changes Q12 names

## Decisions

### What leaves the store

- **The block** - `packages/ui/src/blocks/vault-case/` goes whole, with the
  exports at `packages/ui/src/index.ts` lines 722-742 and the block's own
  stories
- **The negative contract** - one test in `packages/ui/src/index.test.ts`
  reads the public entry and finds none of the three components or eleven
  types (`shared-ui-vault-case-SC-01`, `-SC-02`, `-SC-03`). It lands
  first in its own commit and fails until the block goes
- **Catalog keys removed** - from `messages/shared/{en,ko,zh-Hans,zh-Hant}/vault.json`:
  `title`, `intro`, `packetStatus`, `event`, `list`, `lane`, `request`,
  `case`, `money`, `verify` and `data`, and `visit.what`,
  `visit.loadingServices`, `visit.noServices`, `visit.loadingTimes` and
  `visit.shop`, which nothing reads. `case.refused.moved`, the one `case` word
  the booking views read, moves to `visit.moved`, so each slice reads one
  namespace. `chrome.nav.vault` in every shared `chrome.json`. The store
  change lands first; grade10 bumps its submodule past it in the same PR that
  points the booking views at `vault.visit.moved`, so no grade10 commit reads
  a key its pinned store lacks
- **Brand catalogs removed** - `messages/grade10/{en,zh-Hans,zh-Hant}/vault.json`
  and `messages/zzz/ko/vault.json` hold only `verify.consentText` and
  `consentLabel`. Nothing reads them: the profile's identity card reads the
  `identity` namespace. The files go with their imports and `vault:` entries
  in `packages/i18n/src/catalogs.ts`
- **Catalog keys kept**:

| Key | Read by |
| --- | --- |
| `vault.status` | The console, through `messages.vault.status` in `packages/vault/admin-frontend`; `packages/inventory/admin-frontend/src/test/items.ts` |
| `vault.category` | The console, through `messages.vault.category`; `packages/inventory/admin-frontend/src/test/items.ts`; the e2e helper `inventory-items.ts` |
| `vault.ceremony` | `apps/frontend/grade10/src/pages/vault/SignPage.tsx` (`useTranslations("vault.ceremony")`); the e2e helpers `vault-ceremony.ts` and `inventory-items.ts` |
| `vault.visit` | The booking views in `packages/vault/frontend/src/features/custody/booking` (`useTranslations("vault.visit")`, `"vault.visit.booked"`), `moved` among it |

The emails' words are literals in `packages/vault/backend/src/email/messages.ts`
and the PDFs name template ids, so no key behind a mail or a document moves.

### What leaves the monorepo

- **Pages and routes** - `CasePage`, `VaultPage`, `VaultSurface`,
  `VerifyPage`, `YourDataPage` and the routes `vault`, `vault-new`,
  `vault-case`, `vault-verify`, `your-data`. `surfaces.ts` keeps only the
  ceremony in the vault's set (`grade10-site-site-carried-surfaces-SC-22`,
  `-SC-26`, `-SC-40`)
- **The slices** - `request`, `cases` and `retention` leave
  `packages/vault/frontend` with the grading-holds port only Your data read,
  and `vaultModules` lists `booking` alone. The core stays whole: `VaultApi`
  is the worker's collector surface the returning screens compose, and its
  `FixtureVaultState` and `paths.ts` are the console's fixture world too. No
  app depends on the package, so `design-override.config.json` stops listing
  it and `e-kyc-frontend` until a screen places them (Q24)
- **Why no requirement holds the booking views** - they are presentation a
  screen composes, and no kept requirement names a screen; their own
  component tests and stories prove them, and the visit's behaviour is the
  worker's, walked through its API
- **The chrome** - the profile page loses Your data, `siteContent.ts`'s
  `NAV_LINKS` loses Vault, and `SignInBeforeNavigating`'s tests ask at
  `ROUTES.bids` (`grade10-site-site-navigation-SC-17` to `-SC-25`)
- **Kept** - `CASE_PATH`, `VERIFY_PATH` and `SIGNING_PATH` stay in
  `packages/vault/contracts/src/paths.ts`; mail links keep their addresses
  (Q13)

### Where coverage moves

- **The e2e walks** - `request`, `offer`, `loan`, `visit`, `walk-in` and
  `your-data` under `apps/frontend/grade10/e2e/tests/vault/`, and
  `grading/uncollected`, call the collector API through `page.request` with
  `queryProcedure` and `mutateProcedure` in `e2e/helpers/vault.ts`. The
  console and the ceremony stay walked through their screens
- **Worker tests** - a scenario the removed views alone decided is decided by
  a test on the router, the repository or the contract read it names:
  `intake.repo.test.ts` (`grade10-site-vault-case-intake-SC-13`),
  `photos.repo.test.ts` (`-SC-09`), `collectorRouter.test.ts`
  (`grade10-site-vault-visit-booking-SC-30`), and the groups in `tasks.md`
- **The e-KYC slice** - `packages/e-kyc/frontend` stays, unmounted, as
  `add-hosted-identity-verification`'s slice; `design-override.config.json`
  drops it from the site's packages, because `check-store-blocks` derives a
  site's packages from the app's dependencies and the site no longer depends
  on it
- **The rule** - a test deciding a kept scenario asserts the field the worker
  answers, never a word or a control. A read the worker cannot answer is not
  tested; the requirement says what the collector's account carries. The
  booking views' own tests are the slice's and decide no kept scenario

## Risks / Trade-offs

- [Scenarios lose their only test when the views go] → Group 2 of `tasks.md`
  names each one and the worker test that decides it before the views
  are deleted. Ten were never cited at HEAD and are named with them
- [`grade10-site-vault-retention-and-erasure-SC-18`, retention on an ended
  case, loses its walk; only `collectorRouter.test.ts` decides it] → The test
  reads `retention` on a released and a forfeited case and none on a live one,
  so the e2e walk adds no field the router test misses
- [Cases stay `Decided by` a walk that no longer cites them] → 72 draft cases
  across seven vault capabilities name `request`, `offer`, `loan`, `visit`,
  `walk-in`, `your-data` or `grading/uncollected` after the rewrite drops their
  titles. The walk group flips each to its API test with `pnpm run
  tcs:automated`, or back to manual by name in `rounds.md`
- [A mailed `CASE_PATH` or `VERIFY_PATH` link answers not-found (Q13)]
  → The addresses stay, so links mailed now land on the screens once they
  ship; the risk is a collector who follows a mail before then
- [A walk-in draft has no screen to send it (Q14)] → The draft ends on
  its own clock (`grade10-site-vault-case-lifecycle-SC-41` to `-SC-48`), so
  nothing is stranded; staff tell the customer at the counter
- [The ask is filed while a grading submission is live (Q15)] → The filing
  is accepted, and grading's erasure refuses when an admin runs it
  (`grade10-site-vault-retention-and-erasure-SC-33`), a requirement
  `add-card-grading` owns
- [In-flight changes build on what goes (Q12)] → `vault-home-case-cards`
  has archived. `add-item-registry` group 12 has no wizard, and it keeps the
  two case-intake requirements it folds, as `add-card-grading` keeps the
  live-submission erasure requirement: this change modifies neither;
  `add-hosted-identity-verification` tasks 1.2, 1.5 and group 13 draw a page
  at `/vault/verify` and need `vault.verify` words this change removes;
  `add-card-grading` points the collector at Your data. Each change owns its
  own rewrite; the one that lands second rebases its catalog edits
