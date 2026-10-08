## Context

[Dates and Times](../../specs/shared/dates-and-times/spec.md) already says every surface takes its date from the platform's shapes. Two modules carry them. `@grade10/ui`'s `src/lib/format-datetime.ts` builds text from `Intl` and UTC getters, and `@grade10/utils/dates` builds it with date-fns and `@date-fns/tz`. The application's `scripts/checks/check-dates.mjs` walks `apps`, `packages` and `integrations`, never `external`, so the store's module was never checked and the invoice PDF and the emails grew their own.

## Goals / Non-Goals

**Goals:**

- One package owns every function that returns date text, and the typed-day functions, importable without React
- A difference between the two modules' output is found by a test before a caller moves
- Each repository's CI refuses a formatter outside the package

**Non-Goals:**

- A new shape, or a changed string
- Date arithmetic - counting days, months and hours on a zone - which stays in `@grade10/utils`; reading a typed day into instants is the package's (Q2 in `decisions.md`)
- The manual viewer under `tools/`, which shows no collector or operator a date

## Decisions

The spec fixes the shapes and the zones. These choices decide how the package carries them.

| Choice | Decided | Instead of |
| --- | --- | --- |
| Engine | date-fns and `@date-fns/tz` for every pattern; `Intl` for zone short names, weekday names and ranges; `formatCalendarDayLabel` moves as it prints today (`Sep 3, Thurs`), because date-fns says `Thu` | The store's hand-built `Intl` text: month words change between ICU releases, while date-fns locale data is pinned in the lockfile |
| Name clash | The application's name and arguments win for `formatDay`, `formatMoment`, `formatEvent` and `formatDeadline`; the store's `formatLocal*` map onto them with a `timeZone` | Keeping both: the store's four always print `UTC` and no caller uses `formatMoment`, `formatEvent` or `formatDeadline` |
| Instant argument | `Date` or epoch milliseconds on every function that formats an instant; the calendar-day bridge keeps its `Date` | `Date` only: every `*_AT_MS` fixture and block call would be rewritten |
| Locale argument | A string matched without case; a tag with no words throws and names it | The store's `ShippedLocale` union: the application passes `useLocale()`, a string, and the spec says an unshipped language fails |
| Locale resolution | `ShippedLocale` and the brand-aware `resolveShippedLocale` stay in `@grade10/i18n`, which already exports them; the store module's copies are deleted. The application narrows a page's locale with `shippedLocale` in `@grade10/frontend-intl`, which `BrandIntlProvider` has already resolved to the brand's own | A second resolver in the package: it would fall back to English where the spec says the brand's default |
| Typed-day bridge | `startOfDay`, `endOfDay`, `dayValue` and `isCalendarDay` live in the package: `formatCalendarDay` reads a stored day through `startOfDay`, and the spec sets the typed day beside the shapes | Leaving them in `@grade10/utils`: the package would keep a private copy of the parse |
| Words | The package holds no sentence. Relative copy arrives as `ActivityTimeCopy`, a structural type of five strings that `@grade10/i18n`'s `Messages["dates"]` satisfies; `@grade10/i18n` is a dev dependency for the parity tests only | A runtime import of the catalogs |
| Prefixes | `formatListingEnds`, `formatListingClosed` and `formatListingOpens` move into the auction-card block, which owns their English words | Moving the words into the package |
| Surface | One pure barrel at `.`, modules by concern (`shapes`, `local`, `calendar-day`, `zone-names`, `relative`), `sideEffects: false`, consumed from `src/` | A subpath per concern: the barrel is tree-shaken, and a subpath is added only if a test lane measures a cost |
| `PLATFORM_ZONE`, `PLATFORM_LOCALE` | Defined once in the package; `@grade10/utils` imports them for its arithmetic, money and counts | A copy in each |
| Guard | A check script in each repository. The store's covers `packages/` and `apps/` and matches dates only: `Intl.DateTimeFormat`, `toLocaleDateString`, `toLocaleTimeString` and a date-fns import outside the package. Number and money formatting is not a date, and `tools/` is out of scope | A lint rule: the application's rules already live in a script and the store gets the same shape. The application's own `toLocale*String` rule: it would flag the store's number formatting |

## Risks / Trade-offs

- [date-fns and `Intl` word a month or a weekday differently for a locale] → the parity test walks every shape across the four locales and the zones the callers use before any caller moves; a difference is a question for the product owner, never a silent edit
- [The parity test finds a difference between the two modules' strings] → the change stops there: a string that has to change is a requirement change, so `skip_specs` comes off and the product owner decides
- [Records in other changes still name the deleted module] → they name a file and not a contract, and stay as history
- [The design-system calendar passes react-day-picker's locale codes such as `en-US`, which the package refuses] → the calendar maps its codes to a platform language before it calls the package
- [The store's blocks gain date-fns locale data in their bundle] → the application's pages already carry it through `@grade10/utils/dates`; `scripts/check-app-bundles.mjs` stays the measure
- [A storybook story or test that formats a date runs on a UTC machine in CI] → `packages/storybook` and the store's ui test project pin `TZ` off UTC, as `check-lanes.mjs` already requires of the application's suites
- [The Design Override hook stops a commit that rewrites a `*_MS` constant line in a watched path] → fixtures keep their constants and change only their import lines
- [A store bump lands before the application imports the package] → the order below adds before it removes: the application never takes a bump that deletes an export it still calls

## Migration Plan

1. Store: add the package, with the parity test running while the old module still exists
2. Application: bump the submodule, move every caller, delete the text half of `@grade10/utils/dates`, repoint its check
3. Store: move the blocks, the PDF, the emails and the calendar, delete `format-datetime.ts`, add the store's check
4. Application: bump the submodule again

Each step ships alone; rolling one back leaves the others working.
