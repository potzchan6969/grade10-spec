## 1. Add the arithmetic to the date package (grade10-spec)

- [x] 1.1 Tests first, in their own commit: port the cases for the eight functions from `packages/utils/test/dates.test.ts` to `packages/date/src/arithmetic.test.ts`, without `elapsedDays`
- [x] 1.2 Create `packages/date/src/arithmetic.ts` with the eight functions as they behave today, the error naming `@grade10/date`; move the plain-date helper from `calendar-day.ts` into `src/instant.ts`; export the eight from the barrel
- [x] 1.3 Name the package as the owner of date maths in the `packages/date` line of `AGENTS.md`
- [x] 1.4 Verify: `pnpm --filter @grade10/date run test`, `pnpm --filter @grade10/date run typecheck`, `pnpm run check:manual`, `pnpm run lint`

## 2. Move the application onto it (grade10)

- [x] 2.1 Tests first, in their own commit: `packages/utils/test/dates.test.ts` keeps the zone check and gains the reminder rule's cases, before 09:00, at 09:00 and on a named zone
- [x] 2.2 Bump `external/grade10-spec` to the commit that adds the arithmetic
- [x] 2.3 Rewrite the imports of the eight from `@grade10/utils/dates` to `@grade10/date` in the 56 files, splitting the 4 that also take `Clock` or the reminder rule; add `@grade10/date` to `packages/coupons/contracts`, `packages/grade10-auth/backend` and `packages/vault/frontend`
- [x] 2.4 Delete the eight and `elapsedDays` from `packages/utils/src/dates.ts` and their cases from its test; read `hourOf` and `PLATFORM_ZONE` from the package; drop `date-fns` and `@date-fns/tz` from `packages/utils/package.json` and the lockfile
- [x] 2.5 Repoint `check-dates.mjs` and `check-lanes.mjs` at `@grade10/date` as the owner, and reword the comment in the 13 `vitest.config.ts` files that names `@grade10/utils/dates`; replay the `reachesDates` walk with a throwaway script before and after, and confirm the same suites are pinned
- [x] 2.6 Rewrite the date lines of `docs/conventions/code-layout.md`, the `utils` row of `docs/conventions/packages.md` and the `/dates` entry of `docs/architecture/handbook.html`
- [x] 2.7 Verify: `pnpm run typecheck`, every test lane, `pnpm run check:libs`, `pnpm run check:app-bundles`, the vault and grading reminder sweep tests

## 3. The walk (grade10)

- [ ] 3.1 Run the E2E specs that reach a moved function, directly (auction listing media, vault loan, vault offer) or through `helpers/grading-uncollected.ts` (grading uncollected and handback), and compare any failure with `main`'s own E2E run — blocked: the E2E specs need the local application stack (Docker), which this environment does not have
