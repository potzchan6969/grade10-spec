**Author:** @seankcw - 2026-08-19

## Why

Nineteen places in `grade10` turn a stored instant into text, and each one
decides for itself what a date looks like. Rendering the same moment —
19 Aug 2026, 22:00:14, read in Hong Kong — through every one of them:

| Where | Renders as | Zone shown |
| --- | --- | --- |
| Auction page, "Closes …" | `8/19/2026, 10:00:14 PM` | none |
| Store demo profile and orders | `8/19/2026, 10:00:14 PM` | none |
| Auction demo listing clock | `22:00:14` | none |
| Auction email, "Closes …" | `Aug 19, 2026, 02:00 PM UTC` | UTC |
| Admin audit logs (both brands) | `Aug 19, 2026, 10:00:14 PM` | none |
| Admin order, ledger, redemption, auction, liability, rewards tables | `Aug 19, 2026, 10:00 PM` | none |
| Admin user tables, member summary, invitations | `Aug 19, 2026` | none |

Three defects, two live and one waiting:

- **Live, for a collector:** the auction page shows a close time with no zone
  and no chosen format, in whatever shape the browser's locale defaults to.
  The auction email that announces the same close deliberately stamps one —
  its own comment says "a time with no zone is a different time to every
  reader" — so a bidder comparing the mail against the page sees two
  renderings of one deadline, and only the mail is unambiguous. A deadline a
  collector bids against is the worst possible place for that.
- **Live, for an operator:** audit entries print to the second while every
  other operator table stops at the minute. Correlating an audit entry with
  the order it describes means reading `10:00:14 PM` against `10:00 PM` and
  deciding whether they are the same event. Two panels show the same rows,
  so both brands carry it.
- **Waiting:** every one of the nineteen takes whatever the runtime's locale
  happens to be, because none of them can be told otherwise. The platform
  already ships message catalogs (`@grade10/i18n`); the day a surface renders
  in a second language, every date on it follows the browser instead of the
  words around it, and nothing in the codebase can be handed the language to
  use.

The repository has just been through this exact shape of problem with money
and settled it: `@grade10/utils/money` is the only module that turns an
amount into text, a shape is chosen per audience rather than reinvented per
call site, and `check:libs` fails a second copy. Dates are the same problem
one subject over, and the same answer fits — with one difference. Money had
no library worth reaching for; dates do. The platform adopts **date-fns v4**
as the thing the shared module is built on, which the design system's own
dependency already anticipates: `@base-ui/react` declares `date-fns ^4.0.0`
and `@date-fns/tz ^1.2.0` as optional peers for its date components.

One further copy is adjacent: `apps/admin/grade10/src/dates.ts` bridges the
other direction, turning the calendar day an `<input type="date">` yields
into the instants a worker stores. It is correct and tested, and it is
app-local — the day the zzz panel grows a date filter, it gets copied.

**Metric:** date-rendering sites not routed through the shared module,
19 → 0. Secondary: surfaces showing a deadline without naming its zone,
2 → 0.

## What Changes

- Add a `dates-and-times` capability: the shapes a stored instant takes on
  screen, when a rendering must name its time zone, and how a calendar day an
  operator types becomes an instant.
- Adopt date-fns v4 and `@date-fns/tz` as the platform's date library, and
  build the shared module on them rather than on hand-written `Intl` option
  objects and hand-rolled string math.
- Commit the platform to four shapes chosen by what the reader is doing — a
  day, a moment, a moment to the second, and a deadline that names its zone —
  each a stated format the platform owns, replacing five accidental variants
  whose output depended on the reader's browser.
- State one zone for the whole platform — UTC — so an instant reads the same
  on every screen, in every message, for every reader.
- Give the auction close one rendering: the page names its zone the way the
  email already does.
- Settle the operator inconsistency deliberately rather than by accident:
  audit entries keep their seconds, because correlating events is what an
  audit log is for, and every other operator table stops at the minute.
- Move the calendar-day bridge out of the grade10 admin panel so both panels
  and any later surface read one implementation.

## Capabilities

### New Capabilities

- `dates-and-times`: How a stored instant becomes text a person reads, and
  how a calendar day a person types becomes an instant — across storefronts,
  admin panels, demos, and email.

### Modified Capabilities

- None.

## Impact

- Affected consumer: the `grade10` application repository — the site's
  auction page, both admin panels' tables and dialogs, the auction's emails,
  the store and auction demos, and the grade10 admin's date inputs.
- New dependency in `grade10`: `date-fns ^4` and `@date-fns/tz ^1`, added to
  `@grade10/utils` and reaching every surface through it. Both are pure ESM
  and tree-shakeable, so the auction email Worker pays for `format` and
  nothing else.
- Visible change for collectors: the auction close gains a zone and a settled
  format on the page. No other collector-facing date changes.
- Visible change for operators: dates gain one shape across both panels.
  Tables that stopped at the minute keep doing so; audit logs keep their
  seconds.
- Visible change for every reader outside UTC, and the largest one here:
  every time on every screen is now stated in UTC. A Hong Kong operator who
  reads `22:00` against an order today reads `14:00` after, and an instant
  near midnight can show the previous day. The same instant, stated once for
  everyone, with the deadline shape naming the zone so nobody reads it as
  their own clock.
- Visible change for every reader whose browser is not English: a date now
  reads in the format the platform states rather than the one the browser
  picks — `19 Aug 2026` where a German-locale operator sees `19.08.2026`
  today. The trade the change makes for one platform voice, and the seam that
  lets a language be passed once the message catalogs need one.
- Visible change in auction email: the close reads `19 Aug 2026, 14:00 UTC`
  where it reads `Aug 19, 2026, 02:00 PM UTC` today — the same instant, in
  the platform's format, keeping its zone label.
- Behaviour change where an operator types a date window: the window is now
  the UTC day rather than the operator's local one, so a stored boundary
  shifts by their offset. Existing windows are not migrated; the two surfaces
  that own them measure in days.
- No wire format changes. An instant stays an instant on every wire.
- No database, deployment, or authentication impact.

## Non-goals

- Relative time ("3 days ago", "closing in 2h"). The auction demo's countdown
  is arithmetic on a remaining duration, not a formatted instant, and stays
  exactly as it is. No surface gains a countdown here.
- Time-zone arithmetic. The loyalty program's period boundaries
  (`packages/loyalty/backend/src/utils/time.ts`) compute wall-clock instants
  in a program's zone; that is domain math, not display, and is out of scope.
- Choosing, storing, or offering a reader's time zone. UTC is the platform's
  zone for now; the module keeps the option that would let a reader's own be
  threaded through, and nothing threads one.
- Moving date strings into the message catalogs, or wiring a locale through
  the applications. The module accepts one; nothing passes a non-English one
  yet.
- Parsing dates from external systems. Every instant in the platform arrives
  as an instant.
