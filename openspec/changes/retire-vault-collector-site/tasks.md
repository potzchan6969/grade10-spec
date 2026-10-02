# Tasks: Retire the vault collector screens from the site

## 1. The store's blocks and words (grade10-spec) (owner: @ecchochan)

- [ ] 1.1 A test in its own commit: `packages/ui/src/index.test.ts` reads the public entry and finds none of `VaultCases`, `VaultCasesEmpty`, `VaultAcceptOfferDialog` and the eleven types beside them (`grade10-shared-ui-vault-case-SC-01`, `grade10-shared-ui-vault-case-SC-02`, `grade10-shared-ui-vault-case-SC-03`)
- [ ] 1.2 Remove `packages/ui/src/blocks/vault-case/` whole, its exports in `packages/ui/src/index.ts`, and the preview stories that import it (`grade10-shared-ui-vault-case-SC-01`)
- [ ] 1.3 Remove `title`, `intro`, `packetStatus`, `event`, `list`, `lane`, `request`, `case`, `money`, `visit`, `verify` and `data` from `packages/i18n/messages/shared/{en,ko,zh-Hans,zh-Hant}/vault.json`, and `nav.vault` from each shared `chrome.json`, after a search of grade10 at the claimed baseline finds no reader. Keep `status`, `category` and `ceremony`
- [ ] 1.4 Remove `packages/i18n/messages/grade10/{en,zh-Hans,zh-Hant}/vault.json` and `messages/zzz/ko/vault.json` with their imports and `vault:` entries in `packages/i18n/src/catalogs.ts`
- [ ] 1.5 Verify: `pnpm --filter @grade10/ui test`, `pnpm --filter @grade10/i18n test`, the typecheck of both, and `pnpm run validate:changes retire-vault-collector-site` in grade10-spec.

## 2. The worker's tests (grade10) (owner: @ecchochan)

Each scenario a removed view alone decided gets a test on the worker or the contracts before the views go, one commit per file. A test asserts the field the worker answers.

- [ ] 2.1 `packages/vault/backend/test/trpc/collectorRouter.test.ts`: `create` opens one item in the brand's currency and refuses a second open draft past the limit; `submit` refuses a stale statement version and records the statement in force (`grade10-site-vault-case-intake-SC-01`, `-SC-02`, `-SC-03`, `-SC-04`, `-SC-16`); `detail` answers another collector's case as `CASE_NOT_FOUND`, `accept` and `decline` refuse a superseded or expired offer by name, and `requestRelease` replays (`grade10-site-vault-case-lifecycle-SC-18`, `grade10-site-vault-valuation-and-offer-SC-24`, `-SC-25`, `-SC-28`); `detail` and `mine` carry the booked shop, slot and lane, and `slots` answers the same shops for a move as for a first booking (`grade10-site-vault-visit-booking-SC-15` to `-SC-21`, `-SC-27`, `-SC-28`, `-SC-29`)
- [ ] 2.2 `packages/vault/backend/test/cases/intake.repo.test.ts`: a case's reference is six characters and found by its letters; a draft holding a known slab takes only photo and description changes (`grade10-site-vault-case-intake-SC-21`, `-SC-40`, `-SC-41`). `packages/vault/contracts/test/schemas.test.ts`: the category set is the register's ten (`grade10-site-vault-case-intake-SC-39`)
- [ ] 2.3 `packages/vault/contracts/test/standing.test.ts` and `ended.test.ts`: the stage and whose-the-item-is chip for each standing, and the ended case's reason in the collector's words (`grade10-site-vault-case-lifecycle-SC-23`, `-SC-29`, `-SC-31`, `-SC-32`, `-SC-33`, `-SC-35`, `-SC-36`, `-SC-38`, `-SC-40`)
- [ ] 2.4 `packages/vault/backend/test/cases/wire.test.ts`: repayments in value-date order with the balance each left, reversed ones left out; the forfeiture notice's written and pay-by dates; how to pay null while a value is unset (`grade10-site-vault-loan-and-settlement-SC-27`, `-SC-28`, `-SC-32`, `-SC-34`, `-SC-52`)
- [ ] 2.5 `packages/vault/backend/test/cases/yourData.repo.test.ts`: the classes with their days, the identity answered or failed, signed documents by case, the next cursor and the holds (`grade10-site-vault-retention-and-erasure-SC-12`, `-SC-17`, `-SC-19`, `-SC-21`, `-SC-22`, `-SC-39`, `-SC-40`); `packages/vault/backend/test/trpc/erasureRouter.test.ts`: filing and cancelling inside the window, refused by name with each hold (`-SC-24`, `-SC-26`); a live grading submission accepts the filing and refuses the run (`-SC-43`)
- [ ] 2.6 `packages/vault/backend/test/routes/documents.test.ts`: the zip answers one Your data page of cases by cursor (`grade10-site-vault-documents-and-signing-SC-27`)
- [ ] 2.7 Verify: the touched test files and `pnpm run typecheck` for `packages/vault/backend` and `packages/vault/contracts`.

## 3. The site (grade10) (owner: @ecchochan)

- [ ] 3.1 Tests in their own commit: `apps/frontend/grade10/src/surfaces.test.ts` and `src/serving/worker.test.ts` answer `/vault`, `/vault/new`, `/vault/cases/:caseId`, `/vault/verify` and `/profile/data` not-found on every lane and carry `/vault/sign` (`grade10-site-site-carried-surfaces-SC-09`, `-SC-19`, `-SC-24`, `-SC-28`); `src/chrome/siteContent.test.ts` finds no Vault in the header; `src/chrome/SignInBeforeNavigating.test.tsx` and `navigation.test.tsx` ask before `ROUTES.bids` (`grade10-site-site-navigation-SC-17` to `-SC-25`); `ProfilePage.test.tsx` finds no Your data
- [ ] 3.2 Remove the routes `vault`, `vault-new`, `vault-case`, `vault-verify` and `your-data`, the pages `CasePage`, `VaultPage`, `VaultSurface`, `VerifyPage` and `YourDataPage`, and the vault's entries but the ceremony in `surfaces.ts` (`grade10-site-site-carried-surfaces-SC-19`)
- [ ] 3.3 Remove the profile's Your data button and `NAV_LINKS`' Vault (`grade10-site-site-navigation-SC-17`)
- [ ] 3.4 Move `FixtureVaultState` and `paths.ts` to `packages/vault/admin-frontend/src/core/api`, then remove `packages/vault/frontend` with its workspace entries, DI wiring and tRPC client
- [ ] 3.5 Verify: the touched test files, `pnpm run typecheck` and `pnpm run build` for `apps/frontend/grade10` and `packages/vault/admin-frontend`; full suites, lint and `check-public-pages` in CI.

## 4. The walk (grade10) (owner: @ecchochan)

Takes the draft `feature-tcs.md` as its input once groups 2 and 3 have landed; human QA reviews the suites with `/tcs-review retire-vault-collector-site` after deployment. While the cases are draft, the walk's titles cite scenarios and carry no bracketed case id.

- [ ] 4.1 Walk the collector's side of `request`, `offer`, `loan`, `visit`, `walk-in` and `your-data` under `apps/frontend/grade10/e2e/tests/vault/`, and `grading/uncollected.spec.ts`, against the collector API through `page.request` with `queryProcedure` and `mutateProcedure` in `e2e/helpers/vault.ts`; the console and the ceremony stay walked through their screens (`grade10-site-vault-case-lifecycle-SC-16`, `-SC-17`, `-SC-19`, `-SC-37`, `-SC-39`, `grade10-site-vault-valuation-and-offer-SC-22`, `-SC-23`, `-SC-26`, `-SC-27`, `-SC-29`, `grade10-site-vault-documents-and-signing-SC-17`)
- [ ] 4.2 Walk the sign-in ask at the bidding history in the navigation walk (`grade10-site-site-navigation-SC-17` to `-SC-25`)
- [ ] 4.3 In grade10-spec, flip the cases each test decides with `pnpm run tcs:automated <case…> --decided-by <path>` once they land: each draft case still `Decided by` a walk whose rewrite dropped its title moves to the API walk or worker test that cites it, or back to manual, named in the walk's `rounds.md` row; the deprecated cases whose subject is a removed screen keep no `Decided by`
- [ ] 4.4 Verify: the vault, grading and navigation walks green in CI.

## 5. The manual (grade10-spec) (owner: @ecchochan)

- [ ] 5.1 Take 🚧 off this change's lines on the pages the proposal names (Collector Pages, Vault, Compliance and Readiness, Documents and Signing, Loan and Money, Operator Console, Case Lifecycle, Vault Case Blocks, Page Blocks, Carried Surfaces, Vault Custody, Account Data) once implementation is verified, before the change archives
- [ ] 5.2 Verify: `pnpm check:manual` in grade10-spec.
