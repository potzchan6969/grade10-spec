## Context

`@grade10/date` reads a typed day into instants and writes every instant as text. `@grade10/utils/dates` counts: `packages/utils/src/dates.ts` holds `addDays`, `startOfDayAfter`, `endOfDayAfter`, `atOrBefore`, `elapsedDays`, `calendarDaysBetween`, `wholeMonthsBetween`, `hourOf` and `firstOfMonth`, built on `date-fns` and `@date-fns/tz`, and it already takes `PLATFORM_ZONE` from the package. It is the only file in `packages/utils` that imports either library. 56 application files import a moved function; 4 of them also import `Clock` or the reminder rule.

## Goals / Non-Goals

**Goals:**

- The eight functions live in `@grade10/date`, with the cases that pin them, run off UTC
- A day is read, written and counted in one package, and `check-dates.mjs` names one owner
- No function changes its answer; the one text that changes is named in the decisions below

**Non-Goals:**

- The reminder rule, `Clock`, the wall-clock fold in `@grade10/utils/zone`, countdowns and the manual viewer, as [decisions.md](decisions.md#non-goals) states

## Decisions

| Choice | Decided | Instead of |
| --- | --- | --- |
| Module | `src/arithmetic.ts` in `packages/date`, exported from the barrel, with `src/arithmetic.test.ts` beside it. The package's vitest config pins `TZ` to `Asia/Hong_Kong`, and `src/shapes.test.ts` already asserts the suite runs off UTC | A subpath: the barrel is tree-shaken, and a subpath is added only if a test lane measures a cost (the Surface decision of `unify-date-formatting`) |
| Names and defaults | The eight keep their names, arguments and the `PLATFORM_ZONE` default, so a caller changes its import path and nothing else | Renaming to match the shape names: 56 files would change more than a path |
| Error text | `edgeOfDayAfter` names the package that throws: `@grade10/date: the day cannot be read on the zone "..."`. The three matchers (`packages/utils/test/dates.test.ts`, `packages/vault/contracts/test/noticePayBy.test.ts`, the auth `selfErasure` suite) match only the words after the prefix, so none changes | Keeping `@grade10/utils:` in a message the package throws |
| Two zone errors | The arithmetic keeps its own thrown text and does not call `assertZone`, which throws `@grade10/date: unknown time zone` for the same cause. The three matchers above pin the existing words; joining the two messages is a later fix | Calling `assertZone` now: the three matchers would change inside a move |
| One plain-date helper | `calendar-day.ts` keeps a private `instant(at)` that turns a zoned date back into a plain `Date`. It moves into the existing `src/instant.ts` and both modules use it | A third copy of the same four lines |
| Left in utils | `packages/utils/src/dates.ts` keeps `Clock`, `REMINDER_SEND_FROM_HOUR` and `sendableFromMorning`, which reads `hourOf` and `PLATFORM_ZONE` from the package. Its test keeps the zone check and gains the reminder rule's cases, because the hour cases move with `hourOf` | Moving the rule: the store has no reminder spec |
| Dependencies | `packages/utils` drops `date-fns` and `@date-fns/tz`; `packages/date` already holds both. `packages/coupons/contracts`, `packages/grade10-auth/backend` and `packages/vault/frontend` add `@grade10/date`, since they import a moved function and do not depend on it | Keeping them in utils unused: `check-dates` would still allow a `date-fns` import there |
| Dead code | `elapsedDays` is deleted with its cases. A `git grep` finds no import of it | Moving it |
| No alias | `@grade10/utils/dates` re-exports nothing it gave up. The application's imports move in the same pull request | A re-export for a transition: two owners again, and `check-dates` could not tell which import is current |
| `check-dates.mjs` | `OWNER` loses `packages/utils/src/dates.ts` and its test, because they no longer read the date library; `zone.ts` and its test stay, because they use `Intl.DateTimeFormat`. Every `why` and the success line name `@grade10/date` as the owner of shapes and arithmetic | Keeping the two files exempt: a `date-fns` import in them would pass |
| `check-lanes.mjs` | A suite that imports `@grade10/date` keeps the off-UTC pin. `@grade10/utils/dates` no longer counts, since it holds a clock seam and a rule that names its zone, so its import stops marking a suite and `@grade10/utils` is never itself a reader. The 13 `vitest.config.ts` comments that say "as every package that reaches `@grade10/utils/dates`" name `@grade10/date` | Keeping both imports in the pattern: a suite that only takes `Clock` would be pinned for nothing |

## Risks / Trade-offs

- [A moved function answers differently off the machine it was written on] → the cases move first and unchanged, run with `TZ` off UTC, and pass in the package before any caller moves
- [A Worker that only counts days now imports the barrel, which also holds the formatters and four date-fns locales] → the package is `sideEffects: false` and the arithmetic reaches no locale, so a bundler drops what a Worker does not call; 17 backend files already import the barrel, and `check-worker-bundle.mjs` and `check-app-bundles.mjs` stay the measure
- [Another change lands an import of a moved function from `@grade10/utils/dates` between the bump and the merge] → utils no longer exports it, so typecheck names the file; the pull request rebases onto `main` and runs the scan again before it merges
- [Suites stop being pinned off UTC when the `check-lanes` pattern narrows] → `check-lanes.mjs` prints no list of pinned suites, so a throwaway script replays its `reachesDates` walk over the tree before the rewrite and after it, and the two sets must match
- [Records in other changes and `docs/architecture/handbook.html` still name `@grade10/utils/dates` for the arithmetic] → the other changes name a file and not a contract and stay as history; the handbook's `/dates` entry is rewritten, since `check:handbook` compares only subpaths and would not catch it

## Migration Plan

1. Store: add the module, the tests and the barrel export, and name the owner in `AGENTS.md`. Nothing is removed, so the application keeps working on the old pin
2. Application: bump, move the 56 imports, delete the moved code from utils, drop the two dependencies, repoint the checks and the docs

Each step ships alone; step 1 only adds.
