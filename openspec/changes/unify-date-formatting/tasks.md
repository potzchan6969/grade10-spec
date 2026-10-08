## 1. Add the date package (grade10-spec)

- [ ] 1.1 Tests first, in their own commit: the application's date suite and the store's `format-datetime` suite, ported to `packages/date` with `TZ` pinned off UTC, plus a parity test that walks every shape across `en`, `zh-Hant`, `zh-Hans`, `ko` and the zones the callers use
- [ ] 1.2 Create `packages/date`: `package.json`, `tsconfig.json`, a node `vitest.config.ts` modelled on `packages/i18n`, and the modules `shapes`, `local`, `calendar-day`, `zone-names` and `relative` behind one barrel
- [ ] 1.3 Add `@grade10/date` to the root `typecheck` script and to the lockfile
- [ ] 1.4 Verify: `pnpm --filter @grade10/date run test`, `pnpm --filter @grade10/date run typecheck`, `pnpm run check:manual`, `pnpm run lint`

## 2. Move the application onto the package (grade10)

- [ ] 2.1 Bump `external/grade10-spec` to the commit that adds the package
- [ ] 2.2 Rewrite imports of `@grade10/utils/dates` formatters and of `@grade10/ui`'s date formatters to `@grade10/date`; add the dependency to each package that imports it
- [ ] 2.3 Delete the text half of `packages/utils/src/dates.ts` and its tests; keep the arithmetic, importing `PLATFORM_ZONE` from the package
- [ ] 2.4 Delete the exact duplicates: grading's `calendarDays.ts` `formatCalendarDay`, vault admin's `identity.ts` `formatCalendarDay`, the inline copy in `ProfilePage.tsx`, and grading's `printedDay`
- [ ] 2.5 Repoint `check-dates.mjs` `OWNER` and its messages and `check-lanes.mjs` `DATES_IMPORT`; pin `TZ` in `packages/storybook`
- [ ] 2.6 Rewrite the date section of `docs/conventions/code-layout.md` and the utils lines of `docs/conventions/packages.md`
- [ ] 2.7 Verify: `pnpm run typecheck`, every test lane, `pnpm run check:libs`, the email render and document template tests, the auction e2e walks that assert `HKT`

## 3. Move the store onto the package (grade10-spec)

- [ ] 3.1 Rewrite the `@grade10/ui` blocks, `apps/preview`, `apps/emails`, the invoice PDF and the design-system calendar to format through `@grade10/date`; move `formatListing*` into the auction-card block
- [ ] 3.2 Add `packages/date/**` to the `storybook.yml` and `manual.yml` path filters and teach `scripts/storybook/changed-page-links.mjs` to follow `@grade10/date`, with its test
- [ ] 3.3 Delete `packages/ui/src/lib/format-datetime.ts`, its test and its exports from `packages/ui/src/index.ts`; keep `datetime-fixtures.ts` importing the package
- [ ] 3.4 Add the store's date check and its test, and run it in CI
- [ ] 3.5 Verify: `pnpm run test:stories`, `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run check:manual`

## 4. Take the final bump (grade10)

- [ ] 4.1 Bump `external/grade10-spec` to the commit that deletes the store's formatters
- [ ] 4.2 Verify: `pnpm run typecheck`, every test lane, `pnpm run check:libs`
