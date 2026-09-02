## Context

Nineteen date renderings exist in `grade10`, listed in the proposal. None is
wrong the way a fixed `÷100` was wrong for money — the calendar arithmetic is
correct everywhere — so this change is about agreement, about the one thing
nothing decides for you (whether a rendering names its zone), and about
moving from nineteen hand-written option objects onto a library the platform
states its formats in.

Constraints the approach has to respect:

- Dates cross every layer, exactly as money does. The same rendering runs in a
  Worker composing an email, in a browser painting a table, and in a demo
  running neither, so the module cannot depend on a runtime, a design system,
  or a brand.
- `@grade10/utils` already holds `money`, which this change deliberately
  mirrors — same home, same shape-per-audience idea, same guard. A reader who
  has seen one should need no second explanation. It does not mirror money's
  formatter cache: `format` is a function call, not an object to build, so
  there is nothing to memoize.
- The grade10 admin's `src/dates.ts` is correct and covered by
  `src/dates.test.ts`. Its behaviour is preserved exactly; its hand-rolled
  string math is not.
- `date-fns ^4.0.0` and `@date-fns/tz ^1.2.0` are already the versions this
  dependency graph anticipates: `@base-ui/react ^1.6.0`, which the design
  system depends on, declares both as optional peers for its date components.
  Neither is installed today — the peers are optional and nothing has needed
  them.
- Requirements: [`shared/dates-and-times`](specs/shared/dates-and-times/spec.md).

## Goals / Non-Goals

**Goals:**

- One place an instant becomes text, reachable from every layer.
- A shape chosen by what the reader is doing, not by what the last author
  typed.
- A deadline that cannot be rendered without its zone.
- A format and a zone the platform states, identical on every reader's
  machine.
- A language a caller can pass, before a second one needs to be shown.
- A twentieth copy fails a check rather than passing review.

**Non-Goals:**

- Relative time, countdowns, durations.
- Zone arithmetic, or recording a reader's zone.
- Date parsing from external systems.
- A `Timestamp` value type through the wire contracts.

## Decisions

### One module at `@grade10/utils/dates`

A single file plus its tests, beside `money.ts`.

The same three reasons hold as for money: `utils` is the flat brand-neutral
lib whose subpaths each name a concern, every consumer already depends on it
or can in one line, and a formatter is data rather than presentation, so the
package rule against importing a design system is not in tension.

*Rejected — a `dates.ts` per app:* the shape the repository has today. Two
admin panels already disagree, and the site, the demos, and the email worker
are outside any of them. Three owners cannot be guarded; one can.

*Rejected — a new `packages/dates`:* a hundred lines arriving with a
`package.json`, a tsconfig, a vitest config, and a workspace entry. The layout
convention reserves a flat package for a role with something to own.

*Rejected — a `packages/dates` on top of date-fns:* the library is the
dependency; the module is four functions and a bridge. Same argument.

### date-fns v4, with `@date-fns/tz` for the zone

The module is a thin layer over `format` from `date-fns`, with `tz` from
`@date-fns/tz` supplying the zone through v4's `in` option.

Three reasons this beats hand-written `Intl.DateTimeFormatOptions`:

- **A format the platform states.** `Intl`'s `dateStyle: "medium"` means
  whatever the reader's ICU data says it means — the source of half the
  divergence in the proposal's table, since a surface cannot state a format
  even when it wants to. A date-fns pattern is one string, and it renders the
  same everywhere.
- **A stated format is testable.** `format(at, "d MMM yyyy, HH:mm")` asserts
  as a literal. The `Intl` equivalent has to be asserted against a
  reconstruction of itself, or against an ICU version.
- **An invalid date fails.** `format` throws `RangeError: Invalid time value`;
  `Intl` renders the string `Invalid Date` into the page. Failing loudly on a
  bad instant is the repository's stated principle, and it is the reason the
  spec now has a requirement for it.

`@date-fns/tz` is the v4-native companion — `tz("UTC")` passed as `{ in }` —
not the older `date-fns-tz`, whose `formatInTimeZone` belongs to v2/v3. The
optional peer `@base-ui/react` declares is `@date-fns/tz ^1.2.0`, so the two
halves of the dependency graph agree.

*Rejected — `Intl.DateTimeFormat` directly:* what the repository has now. It
cannot state a format, silently renders `Invalid Date`, and makes every test
assert against ICU rather than against a string.

*Rejected — `Temporal`:* not in the Workers runtime the auction email
renders in, and a polyfill is heavier than date-fns for formatting alone.

*Rejected — `date-fns-tz`:* the v3-era package. `formatInTimeZone` would work,
but it pairs with the version of date-fns this graph is not on.

### Four named shapes, not an options object

```ts
formatDay(at: Date, opts?: DateFormat): string       // 19 Aug 2026
formatMoment(at: Date, opts?: DateFormat): string    // 19 Aug 2026, 22:00
formatEvent(at: Date, opts?: DateFormat): string     // 19 Aug 2026, 22:00:14
formatDeadline(at: Date, opts?: DateFormat): string  // 19 Aug 2026, 14:00 UTC

type DateFormat = { locale?: string; timeZone?: string };  // BCP-47; UTC by default
```

One pattern per shape, and the patterns are the module's whole vocabulary:

| Shape | Pattern |
| --- | --- |
| `formatDay` | `d MMM yyyy` |
| `formatMoment` | `d MMM yyyy, HH:mm` |
| `formatEvent` | `d MMM yyyy, HH:mm:ss` |
| `formatDeadline` | `d MMM yyyy, HH:mm 'UTC'` |

`HH` rather than `hh a`: a 24-hour clock is unambiguous at a glance, needs no
locale to disambiguate, and is what an operator table wants in a fixed-width
column. The outputs above are verified, not assumed.

The shapes are named for the reader's task, not for their pattern, because
the choice a call site has to make is "what is this reader doing with this
date" and not "which format string did the last table use". A name a reviewer
can check against the surrounding code is the whole mechanism: three of the
nineteen sites carry `timeStyle: "medium"` where every neighbour is `"short"`,
and no reviewer could have caught that. Exporting the patterns instead would
reproduce the problem in a new alphabet.

*Rejected — `formatDate(at, style, opts)` with a `style` union:* one export,
but the call site reads `formatDate(order.createdAt, "moment")` — a string
argument that has to be looked up, where `formatMoment(order.createdAt)` says
it. `money` took the option-object route for `currencyDisplay` because there
the two shapes differ by one `Intl` option with an `Intl` name; here the four
differ in which fields exist at all.

*Rejected — exporting a `format(at, pattern, opts)` passthrough:* that is the
status quo with a nicer import. Nothing would stop the twentieth shape, and
the guard in group 5 exists precisely to make a raw pattern unreachable.

### Every surface renders in UTC

`timeZone` defaults to `"UTC"`, and nothing overrides it. One zone for the
whole platform: the storefront, both admin panels, the demos, and the mail
the auction sends all state the same instant the same way.

This is the largest behavioural change in the change, and it is chosen rather
than inherited. The alternative the code has today — every browser surface in
its reader's own zone, mail in UTC — means an operator in Hong Kong and one in
London describing the same order to each other are eight hours apart with
nothing on screen to say so, and it means the mail about an auction and the
page about the same auction disagree by design.

*Reconsider when* the platform has somewhere to get a reader's zone from. The
option stays on the signature, so that day is a changed default and a place to
thread the value through — not a rewrite.

### `formatDeadline` names the zone, and the zone is a literal

Its pattern is `d MMM yyyy, HH:mm 'UTC'`.

With one zone, the label is a constant, so it is written as one — a quoted
literal in the pattern rather than a `zzz` token resolving to `GMT+0`. Two
things fall out: the auction email's close keeps the exact zone label it
prints today, and no reader has to work out that `GMT+0` and `UTC` are the
same thing.

Naming the zone matters *more* under this decision, not less. A Hong Kong
collector reading an unlabelled `19 Aug 2026, 14:00` will read their own
clock and be eight hours wrong about when bidding ends; the label is what
stops that.

The literal holds only while UTC is what was asked for. `timeZone` is public,
so `formatDeadline(at, { timeZone: "Asia/Tokyo" })` has to be answerable: it
renders Tokyo's clock and labels it with the `zzz` token, never `UTC`. A
deadline shape that printed another zone's time under a `UTC` label would be
wrong in exactly the way this shape exists to prevent, and "nothing calls it
today" is not a property of a public function.

*Rejected — the `zzz` token everywhere:* correct, and it renders `GMT+0` for
UTC, which is a lookup the reader has to do for the one zone every surface
actually uses.

*Rejected — dropping `timeZone` from the shapes:* it would make the literal
unconditionally true, and give up the reversibility the decision above is
built on.

### `locale` is a BCP-47 string, as it is in `money`

```ts
formatMoney(minor, code, { locale?: string, currencyDisplay?: … })   // shipped
formatMoment(at,         { locale?: string, timeZone?: string })     // this change
```

`@grade10/utils` publishes two formatters, and an option that appears in both
under the same name means the same thing and takes the same values. Anything
else is a trap with a type error at the bottom of it: `{ locale: "en-US" }`
is how every caller in the repository already writes it, and a second
formatter that silently needs `{ locale: enUS }` — a date-fns object — reads
identical and compiles differently.

So `formatDay` and friends take a BCP-47 string and resolve it to a date-fns
`Locale` inside the module, through a map that mirrors the languages
`@grade10/i18n` actually ships — `en` and `zh-hant`, so two entries. It grows
when a catalog does, in the same commit, which is the point: the module's
supported languages and the platform's are one list. A test asserts that,
reading `locales` from `@grade10/i18n` and rendering under each — a copy of a
published list drifts unless something fails when it does.

A tag the map has no entry for **throws, naming the tag** — the same failure
`currencyExponent` gives an unknown currency code, for the same reason. No
caller passes a locale by accident: omitting it is the documented way to get
English, so a tag that arrives and is not recognized is a mistake in the code
that passed it, not a preference to shrug at.

*Rejected — taking a date-fns `Locale` object directly:* zero mapping and no
registry, at the cost of the collision above. It also leaks the library
through the module's own signature, which is the thing a wrapper exists to
avoid — swapping date-fns out later would touch every call site that names a
language rather than one file.

*Rejected — a registry of every locale date-fns publishes:* the objection to
mapping, and a real one, but only against the wrong registry. Statically
importing all ~200 into every bundle to serve callers that do not exist is
waste; importing the one the platform ships is an import.

*Rejected — falling back to English on an unknown tag:* a French page whose
dates quietly read English, discovered by a customer. Failing names the tag
and the fix.

### The two formatters differ in one thing, on purpose

`formatMoney` defaults to the reader's own locale. The date shapes default to
the platform's format for everyone. Same package, opposite defaults, and the
difference is the point rather than an oversight:

- A number's locale styling is **unambiguous either way**. `2,490.00` and
  `2.490,00` are the same amount to any reader who sees one of them, so
  following the browser is a courtesy with no downside.
- A date's ordering is **ambiguous across locales**. `08/19/2026` and
  `19/08/2026` are different dates to different readers, and nothing in the
  string says which one you are looking at. A platform that lets the browser
  decide has surfaces whose meaning depends on a setting nobody chose.

Stated here because a reader of one module will find the other and read the
difference as a bug. It belongs in `docs/conventions/code-layout.md` beside
both rules, which group 5 carries.

### `timeZone` is a zone name, applied through `@date-fns/tz`, defaulting to UTC

`timeZone` takes an IANA name and reaches `format` as `{ in: tz(name) }`.
Omitted — which is every call site in this change — it is `"UTC"`.

Keeping the option rather than hard-coding the zone inside the patterns costs
one line and is what makes the decision above reversible. It also means the
demos and the module's own tests need nothing special to be deterministic:
the default already is.

### Audit logs keep their seconds; every other operator table stops at the minute

The inconsistency the proposal names is settled rather than flattened. An
audit log exists to order and correlate records, which is what `formatEvent`
is for; an order table is read for its rows and not its ordering, so
`formatMoment` is right there. Both are now a named choice a reviewer can
disagree with, instead of a difference nobody chose.

### The calendar-day bridge moves in, and its string math goes

`startOfDay`, `endOfDay`, and `dayValue` move from
`apps/admin/grade10/src/dates.ts` into the module, keeping their names and
signatures, and losing both their hand-rolled bodies and their zone. Today
they build a `Date` from an interpolated template string in the operator's
own zone; on date-fns, in UTC, they are:

```ts
startOfDay(parseISO(day, { in: UTC }), { in: UTC })
endOfDay(parseISO(day, { in: UTC }), { in: UTC })
format(at, "yyyy-MM-dd", { in: UTC })
```

**The `{ in: UTC }` on `parseISO` is the whole thing, and it is easy to
lose.** `startOfDay(parseISO(day), { in: UTC })` reads correctly and is wrong:
`parseISO` resolves a bare `2026-08-19` to local midnight, and truncating that
instant to UTC midnight lands on **18 Aug** for any operator east of UTC.
Worse, it is right on a UTC machine — so CI passes it and Hong Kong finds it.
The suite pins a non-UTC `TZ` for exactly this reason.

Because the zone changes, this is not the behaviour-preserving move it was
before UTC was settled: a day typed in Hong Kong stored `2026-08-18T16:00Z →
2026-08-19T15:59:59.999Z` and now stores `2026-08-19T00:00Z →
2026-08-19T23:59:59.999Z`. The window an operator types shifts by their
offset. Existing stored windows are not migrated — they were typed against
the old boundaries and keep meaning what they meant; the two rewards and
invitations surfaces that own them are the only callers, and their windows are
days long, so an eight-hour edge moves no decision. The existing
`dates.test.ts` moves with them, with its expectations restated in UTC.

They belong here because they are the same subject — the seam between a
calendar day and an instant, differing only in direction. Left app-local, the
zzz panel copies them the first time it grows a date filter, which is the
mechanism that produced all nineteen renderings.

*Rejected — moving them to a `packages/utils/src/calendarDay.ts`:* a second
module for three functions, split from the formatting they sit beside on every
screen that has a date filter.

### A check keeps the twentieth copy out

`scripts/check-dates.mjs`, wired into `pnpm run check:libs` beside
`check-money.mjs`, fails when `Intl.DateTimeFormat`, `toLocaleDateString`,
`toLocaleTimeString`, or `toLocaleString` appears outside
`packages/utils/src/dates.ts` — and equally when `date-fns` or `@date-fns/tz`
is imported outside it.

It reads the `.ts`/`.tsx` under `apps/` and `packages/`, which is where a date
reaches a reader. Build scripts under `scripts/` are `.mjs` and render to a
terminal, so they are outside it; submodules under `external/` and `tools/`
belong to other repositories and are not this check's to police.

The second half is what makes the first half hold. A library in the
dependency tree is easier to reach for than four lines of `Intl` were, so
adopting date-fns without guarding the import would trade nineteen hand-rolled
renderings for nineteen `format(at, "dd/MM/yy")` calls and no way to see them.
The module owns the patterns; nothing else names one.

Two exemptions, each declared in the script with its reason, and both in
loyalty:

- `src/utils/time.ts` builds an `Intl.DateTimeFormat` to read wall-clock
  *parts* through `formatToParts` and compute a program's period boundaries in
  its zone.
- `src/loyaltyProgram.ts` builds one to find out whether an IANA zone name is
  real, and throws it away. `Intl` is the only zone table the runtime has.

Neither renders anything to a reader. The second was found by the check on its
first run rather than by this design — which is the argument-in-a-diff the
rule below asks for, made and accepted.

Exempting by path — rather than by pattern — keeps each exemption visible and
reviewable; a third file wanting the same treatment has to argue for it in a
diff.

*Rejected — exempting `formatToParts` by pattern:* a display formatter is one
`.format()` away from a `formatToParts` that looks exempt, and the guard would
stop meaning what it says.

### The capability sits at the top level of `specs/`

`shared/dates-and-times` binds storefronts, admin panels, demos, and email across
both brands rather than belonging to one product, so it sits beside the
product directories the way `shared/money-amounts` does.

### No `ui.md`

No screen is added or laid out, and no design-system or `@grade10/ui` export
changes. The collector-visible deltas — the auction close gaining its zone,
and every time reading UTC — are text inside existing `Text` nodes, named in
the proposal's Impact and in the risks below.

## Risks / Trade-offs

- **Every time on every screen moves to UTC.** The largest consequence in the
  change. A Hong Kong operator who reads `22:00` on an order today reads
  `14:00` after it. Deliberate, and the reason the deadline shape labels its
  zone — but it will generate questions on the day it ships, and it is worth
  saying so in the release note rather than letting an operator discover it.
- **An unlabelled moment can still be misread.** `formatMoment` and
  `formatEvent` carry no zone, so a dense operator table shows UTC times that
  look local. Acceptable while the panels are read by a small team who will
  know; if it bites, the fix is the panel stating "times in UTC" once in its
  chrome, not a label in every cell.
- **A date near midnight changes its day.** An order placed
  `2026-08-19T16:30Z` reads `20 Aug` to a Hong Kong operator today and
  `19 Aug` after. The same instant, and the more defensible of the two, but
  reports of "the date is wrong" should be read as this before they are read
  as a bug.
- **Every date loses the reader's locale ordering.** Deliberate and covered
  above: a German-locale operator reads `19 Aug 2026, 14:00` where
  `19.08.2026, 22:00` shows today. Consistency across the platform is bought
  with a browser preference nobody set on purpose.
- **The auction close changes shape for collectors.** Intended, and part of
  why the change is worth making. `Closes 8/19/2026, 10:00:00 PM` becomes
  `Closes 19 Aug 2026, 14:00 UTC`.
- **Typed date windows shift by the operator's offset**, as the day bridge
  moves to UTC. Covered above: no migration, and the two surfaces that own
  such windows measure them in days.
- **Two new dependencies in every bundle that shows a date**, including the
  auction email Worker. Both are pure ESM and tree-shakeable, and the module
  imports `format`, `parseISO`, `startOfDay`, `endOfDay` and `tz` by name —
  but this is weight the repository did not carry before, and the first
  measurement belongs in the group that lands it.
- **A table gains a column's worth of width** wherever `formatDeadline`
  replaces a bare moment. Only the auction page does that today.
- **The guard's patterns are broad**, and `toLocaleString` in particular is a
  `Date` method a non-date object could plausibly have. If the false positives
  are noisy, narrow the pattern rather than adding exemptions — exemptions are
  the thing that erodes a guard.
- **One shared module is one shared blast radius.** Mitigated by the module
  being pure, total, and covered per shape with an explicit locale and zone.

## Migration Plan

The module lands first; nothing else depends on the order after that. Each
call site moves with its own tests, and the file it empties is deleted in the
same task — no compatibility period, since every caller is in this repository.

1. `date-fns` and `@date-fns/tz` added to `@grade10/utils`, then
   `@grade10/utils/dates`: the four shapes, plus the day bridge moved in from
   the grade10 admin with its tests.
2. Auction email repointed at `formatDeadline` — the rendered close changes
   shape, keeps its `UTC` label, and its suite's expectation changes with it.
3. Both admin panels: thirteen inline formatters removed, the day bridge's
   two callers repointed, `apps/admin/grade10/src/dates.ts` deleted.
4. Auction page and the three demos repointed; the auction close gains its
   zone.
5. The check that keeps the copies from coming back, plus the convention note
   and the handbook.
