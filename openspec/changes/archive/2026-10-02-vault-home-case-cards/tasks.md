## 1. The Blocks (grade10-spec) (owner: @ecchochan)

- [x] 1.1 `VaultCases` stories with play functions: the board's three cases, then one card each for an offer waiting, a booked visit, terms agreed with a visit, the item in the vault, a loan running, past due, repaid, back with you, a draft, a walk-in draft, an ended case and an untitled item; `public-exports.test.ts` names the three blocks and their types, with the card fixtures in `fixtures.ts`, in their own commit before the block (`shared-ui-vault-case-SC-01`, `shared-ui-vault-case-SC-24`, `shared-ui-vault-case-SC-25`, `shared-ui-vault-case-SC-26`, `shared-ui-vault-case-SC-27`, `shared-ui-vault-case-SC-28`)
- [x] 1.2 `vault-cases.tsx` and its unexported `vault-case-card.tsx` in `packages/ui/src/blocks/vault-case/`, `VaultCases` exported from `src/index.ts` under `shared/ui/vault-case` (`shared-ui-vault-case-SC-01`, `shared-ui-vault-case-SC-24` to `shared-ui-vault-case-SC-28`)
- [x] 1.3 `vault.list.yourCases` in every shared locale; `vault.list.open` and `vault.list.noVisit` removed from every locale
- [x] 1.4 Verify: `pnpm --filter @grade10/ui test`, `pnpm run test:stories:ui`, `pnpm run lint`, `pnpm run typecheck`, `pnpm --filter @grade10/i18n test`, `pnpm check:manual`

## 2. The Site's List (grade10) (owner: @ecchochan)

- [x] 2.1 `caseCardOf` and `CaseList.test.tsx` cases for the card's map: both chips, the facts with the reference, the next step, the calendar line with a past visit, the title fallback, opening a case; the `openCaseCard` E2E helper replacing the Open clicks at `request.spec.ts` 375, 580, 612 and `walk-in.spec.ts` 426, 602, and the offer spec reading Answer by as the next step; in their own commit before the code (`grade10-site-vault-valuation-and-offer-SC-25`, `grade10-site-vault-case-lifecycle-SC-34`, `grade10-site-vault-case-intake-SC-01`, `grade10-site-vault-case-intake-SC-32`, `grade10-site-vault-case-intake-SC-23`)
- [x] 2.2 One commit: the submodule bump; `visitAhead` exported from `standing.ts`; `chipView.ts` with `OwnershipChip` reading it; `CaseList` rendering `VaultCases` from `caseCardOf`, its `CaseCard`, the Open button and the No visit booked line deleted; `node scripts/checks/check-store-blocks.mjs` (`grade10-site-vault-valuation-and-offer-SC-25`, `grade10-site-vault-case-lifecycle-SC-34`, `grade10-site-vault-case-intake-SC-01`, `grade10-site-vault-case-intake-SC-32`, `grade10-site-vault-case-intake-SC-23`)
- [x] 2.3 Verify: `pnpm --filter @grade10/vault-frontend test`, the vault frontend's typecheck and lint; the vault E2E specs in CI

## 3. The Walk (grade10) (owner: @ecchochan)

Uses `feature-tcs.md` reviewed with `/tcs-review vault-home-case-cards` as its input, after deployment; `/tcs-run-sheet` executes the cases that stay manual.

- [x] 3.1 The deployed Storybook shows every `Vault Case/VaultCases` story, and the site's list on staging reads as the `VaultCases` story in the same state. Dropped: the owner removed the collector site on 2026-10-02, and `retire-vault-collector-site` removes this block with it, so there is nothing to walk
- [x] 3.2 Flip the cases the stories and the E2E specs decide with `pnpm run tcs:automated <case…> --decided-by <path>`; the ones that stay manual are named in the suite. Dropped: the owner removed the collector site on 2026-10-02, and `retire-vault-collector-site` removes this block with it, so there is nothing to walk
- [x] 3.3 Verify: the store's Storybook workflow on `main`, `pnpm run tcs:validate`. Dropped: the owner removed the collector site on 2026-10-02, and `retire-vault-collector-site` removes this block with it, so there is nothing to walk
