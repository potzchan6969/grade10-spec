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
- **Waiting:** every one of the nineteen takes the runtime's locale, because
  none of them can be told otherwise. The platform already ships message
  catalogs (`@grade10/i18n`); the day a surface renders in a second language,
  every date on it stays in the browser's locale and reads in a different
  language from the words around it.

The repository has just been through this exact shape of problem with money
and settled it: `@grade10/utils/money` is the only module that turns an
amount into text, a shape is chosen per audience rather than reinvented per
call site, and `check:libs` fails a second copy. Dates are the same problem
one subject over, and the same answer fits.

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
- Commit the platform to four shapes chosen by what the reader is doing — a
  day, a moment, a moment to the second, and a deadline that names its zone —
  replacing five accidental variants.
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
- Visible change for collectors: the auction close gains a zone and a settled
  format on the page. No other collector-facing date changes.
- Visible change for operators: dates gain one shape across both panels.
  Tables that stopped at the minute keep doing so; audit logs keep their
  seconds.
- No wire format changes. An instant stays an instant on every wire.
- No database, deployment, or authentication impact.

## Non-goals

- Relative time ("3 days ago", "closing in 2h"). The auction demo's countdown
  is arithmetic on a remaining duration, not a formatted instant, and stays
  exactly as it is. No surface gains a countdown here.
- Time-zone arithmetic. The loyalty program's period boundaries
  (`packages/loyalty/backend/src/utils/time.ts`) compute wall-clock instants
  in a program's zone; that is domain math, not display, and is out of scope.
- Choosing or storing a reader's time zone. Surfaces keep rendering in the
  runtime's zone; only what is *shown* about that zone changes.
- Moving date strings into the message catalogs, or translating month names
  beyond what the locale already does.
- Parsing dates from external systems. Every instant in the platform arrives
  as an instant.
