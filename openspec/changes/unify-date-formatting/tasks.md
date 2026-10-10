## 1. Add the date package (grade10-spec) (owner: @seankcw)

- [x] 1.1 Tests first, in their own commit: the application's date suite and the store's `format-datetime` suite, ported to `packages/date` with `TZ` pinned off UTC, plus a parity test that walks every shape across `en`, `zh-Hant`, `zh-Hans`, `ko` and the zones the callers use
- [x] 1.2 Create `packages/date`: `package.json`, `tsconfig.json`, a node `vitest.config.ts` modelled on `packages/i18n`, and the modules `shapes`, `local`, `calendar-day`, `zone-names` and `relative` behind one barrel
- [x] 1.3 Add `@grade10/date` to the root `typecheck` script and to the lockfile
- [x] 1.4 Verify: `pnpm --filter @grade10/date run test`, `pnpm --filter @grade10/date run typecheck`, `pnpm run check:manual`, `pnpm run lint`

## 2. Move the application onto the package (grade10)

The bump in 2.1 takes the store's booking block change too, so it waits for the application side of `add-multi-store-appointments` (its task 13.1); typecheck reports 9 errors in `packages/appointment/frontend`, `packages/vault/frontend` and `packages/grading/frontend` on a bump alone.

- [x] 2.1 Bump `external/grade10-spec` to the commit that adds the package
- [x] 2.2 Rewrite imports of `@grade10/utils/dates` formatters and typed-day functions and of `@grade10/ui`'s date formatters to `@grade10/date`, with `formatLocalDay`, `formatLocalMoment` and `formatLocalTime` now `formatDay`, `formatMoment` and `formatTimeOfDay`; add the dependency to each package that imports it; add `shippedLocale` to `@grade10/frontend-intl`, a new helper that takes a locale string and stops by name on a tag the platform does not ship, and use it to narrow a page's locale; take `ShippedLocale` from `@grade10/i18n`
- [x] 2.3 Delete from `packages/utils/src/dates.ts` and its tests the text half, the typed-day functions and `PLATFORM_ZONE`; keep the arithmetic and `Clock`, importing `PLATFORM_ZONE` from the package; make `packages/utils/src/locale.ts` re-export `PLATFORM_LOCALE` from the package and `packages/utils/src/schema.ts` take `isCalendarDay` from it
- [x] 2.4 Delete the exact duplicates: grading's `calendarDays.ts` `formatCalendarDay` and grading's `printedDay`
- [x] 2.5 Repoint `check-dates.mjs` and `check-lanes.mjs` at `@grade10/date`, keeping the `TZ` pin rule on every suite that reaches it
- [x] 2.6 Rewrite the date section of `docs/conventions/code-layout.md` and the utils lines of `docs/conventions/packages.md`
- [x] 2.7 Verify: `pnpm run typecheck`, every test lane, `pnpm run check:libs`, the email render and document template tests, the auction e2e walks that assert `HKT`

## 3. Move the store onto the package (grade10-spec) (owner: @seankcw)

- [x] 3.1 Rewrite the `@grade10/ui` blocks, `apps/preview`, `apps/emails`, the invoice PDF and the design-system calendar to format through `@grade10/date`, the calendar mapping react-day-picker's locale codes to a platform language first and getting its short month and two-letter weekday words from new package exports, with tests; type the blocks' `locale` props as `string` and their `activityTimeCopy` as `ActivityTimeCopy` from `@grade10/date`, and add the dependency to `@grade10/ui`; move `formatListing*` into the auction-card block
- [x] 3.2 Add `packages/date/**` to the `storybook.yml` and `manual.yml` path filters and teach `scripts/storybook/changed-page-links.mjs` to follow `@grade10/date`, with its test
- [x] 3.3 Delete `packages/ui/src/lib/format-datetime.ts`, its test and its exports from `packages/ui/src/index.ts`; keep `datetime-fixtures.ts` importing the package
- [x] 3.4 Add the store's date check and its test, and run it in CI: over `packages/` and `apps/`, matching `Intl.DateTimeFormat`, `toLocaleDateString`, `toLocaleTimeString` and a date-fns import, and not number formatting
- [x] 3.5 Verify: `pnpm run test:stories`, `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run check:manual`

## 4. Take the final bump (grade10) (owner: @seankcw)

- [x] 4.1 Bump `external/grade10-spec` to the commit that deletes the store's formatters
- [x] 4.2 Verify: `pnpm run typecheck`, every test lane, `pnpm run check:libs`
