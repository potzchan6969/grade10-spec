## Context

The durable specs hold the viewer-local contract as `d0fa6f0a3` wrote it: the
viewer's zone, a short name that follows the viewer, and `GMT+8` on documents.
The deltas add what that commit lacks: a named closed lot, offset names, the
first paint, the refusal of an unrecognised zone, the invoice page, the letter
footers, the shop's clock and the scenarios for them. Acceptance publishes them;
until then the durable files hold the older text. Part of the store half is
built: `11e4dbbcf` (collector formatters, `AuctionCard`, fixtures, play
assertions) and `8f889848c` (PDF label). The pin in `grade10`
(`external/grade10-spec` at `2608abf84`) is behind store main and predates both,
so the application has not consumed any of it: its PDFs still print `HKT`,
`formatListing*` still take a locale string, and `formatCollectorDeadline` still
names no zone. Store groups 1 and 2 finish the store half; the application work,
groups 3 and 4, is not started.

`grade10` formats its own dates with `@grade10/utils/dates`, not the store's
formatters. The one store formatter it calls is `formatCollectorDeadline` in the
listing view. The application's own formatter names zones with the date-fns
`zzz` token, so it prints `GMT+8` for Hong Kong, `GMT-4` for New York and `UTC`
when no zone is given - three rules for one instant beside the store's `HKT` /
`EDT`.

## Goals / Non-Goals

**Goals:**

- One rule names a viewer's zone, in one place, from the instant.
- Every collector deadline in `@grade10/ui` renders in the zone it is given,
  never the machine's, and names that zone when it shows a clock, a closed lot's
  close included; a deadline that shows only a day reads that day in the viewer's
  zone and names none.
- Document and message dates state `Asia/Hong_Kong` as `GMT+8` wherever they
  are produced, including the application's invoice page, auction emails,
  grading letters and vault letters.
- The application's catalogue tile, My Auctions and Winner Order read the
  viewer's zone through the same formatter, and its invoice page states the
  brand zone through its own `formatDeadline` and `formatDay`.
- The tests that prove each scenario cite its id, and its case id where a
  manual row credits the test.

**Non-Goals:**

- Operator tables and admin forms, except the auction order surfaces (the
  Orders worklist, the order page with its timeline and invoice log, and the
  send and reissue dialog's payment deadline), which state Asia/Hong_Kong as
  `GMT+8` (Q31, Decision 13); `Starts at (HKT)` in the admin listing
  editor is an operator form, not a collector surface).
- Calendar days a brand judges (programme dates, shop midnight). The day of a
  collector deadline is not one of them: it reads in the viewer's zone.
- Moving a shop-clock page (appointment booking, drop-off, vault case
  deadlines, signing) onto the viewer's zone: it keeps the shop's clock (Q22,
  Q25). How those pages name the zone, and one name for it, is a follow-up, not
  this change (Q27).
- Relative countdowns, and T&C dates that carry no clock.
- Naming a shop's own zone in a message for a shop outside Hong Kong (Q24).
  Every message states `Asia/Hong_Kong` as `GMT+8`; `add-multi-store-appointments`
  owes a delta on the message requirement for mail about such a shop.
- A grading letter's weekly shop-hours line: it is not a date or a time of an
  event, and keeps its own wording (Q28, Decision 8).
- The arrangement and month words of a document date, and the tile's English
  `Ends`, `Opens` and `Closed` words with a Chinese month that reads as a bare
  number; the first is a later decision, the second goes to the bug lane.

## Decisions

The deltas govern the zone each surface reads in and the name it carries:
[dates-and-times](specs/shared/dates-and-times/spec.md),
[auction-listing](specs/shared/ui/auction-listing/spec.md) and
[invoice-and-receipt-pdf](specs/shared/ui/invoice-and-receipt-pdf/spec.md).
The `grade10` half builds from the durable specs, which hold them once
acceptance publishes them. These are the implementation choices under them.

### Built in the store (`packages/ui`)

| Piece | Where | What it does |
| --- | --- | --- |
| Local moment | `lib/format-datetime.ts` | `DD Mon YYYY, HH:MM` in the supplied zone, no suffix; activity time falls back to it after seven days |
| Zoned moment | same | the local moment plus the viewer's short name; `formatCollectorDeadline` and `formatListing{Ends,Opens,Closed}` go through it; `formatClosedAt`, which no caller used, went in group 2 |
| Viewer zone name | same | `Asia/Hong_Kong` is `HKT`; any other zone is `Intl` `en-US` short name at the instant, so `EDT`, `EST` and `PDT` in North America and a `GMT+N` offset elsewhere, a zone at zero offset `GMT` (`UTC` rewritten) |
| Offset helper | same | `formatZoneOffset`, `GMT+8` style, called by nothing until the PDF label used it; dropped in group 2, which prints the offset through the formatter's own `timeZoneName: "shortOffset"` (Decision 5) |
| Catalogue tile | `blocks/auction-listing/auction-card.tsx` | static Ends / Opens / Closed line from `{ locale, timeZone }` |
| Lot bid card | `blocks/auction-listing/listing-auction-bid-fields.tsx` | `Ends` / `Opens` line through the zoned moment; threads `locale` and `timeZone` down to bid history; its closed block names no zone yet |
| PDF dates | `blocks/auction-invoice-and-receipt-pdf/pdf-document.ts` | `formatDateTime` is `Asia/Hong_Kong` wall time in English plus the literal `GMT+8`; every meta-row date goes through it |
| Fixtures and stories | `lib/datetime-fixtures.ts`, `auction-card.stories.tsx`, bid-card and booking-summary stories | local-zone fixtures, a New York viewer story on the tile and the bid card and a New York shop story on the booking summary, `EDT` asserted and `HKT` / `UTC` refused |

Verified on 2026-10-06: the node lane (39 tests across the formatter, PDF and
`AuctionCard` files), the three zone story files (19 tests) and the package
typecheck all pass.

### Decisions on the code

1. **A viewer's zone name comes from `Intl`, with Hong Kong pinned, and is
   English in every language.** The rule is the zone's short name in US
   English, `HKT` for Hong Kong, and the offset in English where US English has
   no short name, so it is decided by reference to `en-US` and needs no list.
   `en-US` `short` gives `EDT` / `EST` / `PST` for North America and a
   `GMT+N` offset for everywhere else, and it gives Hong Kong `GMT+8`, so Hong
   Kong is the one zone named by hand. Seoul reads `GMT+9`, Kolkata
   `GMT+5:30`, Kathmandu `GMT+5:45`, Newfoundland in summer `GMT-2:30`, London
   `GMT+1` in summer and `GMT` in winter, and a zone at zero offset reads `GMT`,
   `UTC` included. The name never reads the reader's locale. Rejected: a per-locale `Intl` name (`en-HK` names Hong Kong
   `HKT` but New York `GMT-4`, and `ko` / `zh` names nothing); a table of
   regional abbreviations (`KST`, `JST`, `CST`, `IST` collide and need upkeep);
   a name in the reader's language (needs a table for every shipped language and
   nothing builds one); a fixed list of regional names. Decided as Q5 and Q18.

2. **The name is chosen by the instant, never by the clock.** `at` is what
   makes a January close `EST`. `formatViewerZoneName` defaulted `at` to
   `Date.now()`, and the booking blocks called it with no instant, so those
   names followed the machine's date. Make `at` required and parse it before
   any zone is named, so an invalid instant stops Hong Kong as it stops every
   zone; the booking blocks pass the slot's start, and the slot picker the
   picked day or the month it shows, so the default label of a shop outside
   Hong Kong never follows the machine's date. That corrects the
   default and promises no wording: the blocks keep the shop's clock, their
   default label is the zone's short name, `HKT` for Hong Kong, a page may pass
   its own, and how the blocks name the zone is left out (Q16, Q27, Decision
   11). The `zoneLabel` comment said the viewer's zone and is reworded to the
   shop's (task 2.7); the booking summary's New York story is gone
   (`9a02503a1`).

3. **`AuctionCard` takes `locale` and `timeZone`, both required.** The spec
   says it requires both; the code requires `timeZone` and defaults `locale`
   to `en`. Make `locale` required so an omitted language fails to compile.
   Rejected: relaxing the spec, because `ListingAuctionBidCard` and its sidebar
   already require both and a tile that quietly reads English is the failure
   `Named language` forbids. Stories are the only callers; all pass `locale`.

4. **A closed lot names its zone where it shows a clock.** A collector
   deadline that shows a clock names the viewer's zone, a closed lot's close
   included (Q6), and a deadline that shows only a day names none (Q20, which
   carries Q12's naming rule from messages and documents to collector
   deadlines). That day is the viewer's, as the durable winner-order spec
   reads its step subtext; the brand's day is for a day the business judges.
   A surface whose own spec already fixes its zone keeps it, so the loyalty
   programme's expiry days stay on the programme's zone and nothing here
   touches them (Q29). Q21 keeps the naming to deadlines: a local moment and an
   older activity row name none.
   The bid card's closed block builds its day and time from `formatLocalDay` /
   `formatLocalTime` and names no zone, in two places: `TimeBlock`'s closed subtext on wide screens
   and `compactClosedSummary` on narrow ones. Both read one closed-close
   reading, the day, the clock and how long the lot ran, and name the zone
   through `formatZonedLocalTime`, which `formatZonedLocalMoment`, the open
   lot's deadline line, builds on. The wide block shows a clock only
   when the lot's open time is known, in `Closed at {time}. Ran {duration}`,
   and names the zone there; without it the block shows the close day alone,
   which reads in the viewer's zone and names none. The narrow summary shows a clock with the open time known
   or not, so it always names the zone. `AuctionCard`'s Closed line shows a clock and names it
   today. Rejected: leaving the naming to each surface, which is how an open lot
   read `08:00 EDT` and the same lot closed read `08:00`.

5. **The PDF label is derived from the document zone.** The literal `GMT+8` in
   `documentZoneName()` can drift from `DOCUMENT_TIME_ZONE`. The formatter that
   already pins the document zone asks `Intl` for `timeZoneName: "shortOffset"`,
   so the label comes from the zone; Hong Kong has no daylight saving, so the
   output is unchanged. Rejected: keeping `formatZoneOffset` for the
   application's emails and any later document, because the emails and the
   invoice page go through date-fns (Decisions 7 and 11) and the PDF was its
   only caller; a later store document repeats one `Intl` option.

6. **A document's date words and `GMT+8` ignore the copy language.** The
   renderer prints the month in English and the offset as the helper returns it;
   no `copy` entry reaches either. No code moves: the decision is the test, a
   Traditional Chinese `copy` rendering the same date row. Decided as Q9.
   Rejected: following the winner's language, which needs a language input and
   translated months nobody has planned.

7. **The application states Hong Kong in mail by passing the zone.** The auction
   emails call `formatDeadline(at, { locale })`, which defaults to `UTC`: eleven
   calls in `emailPort.ts` for the order letters and three in `render.tsx` for
   the lot letters (`closesAt`, `scheduledClosesAt` and `startsAt`). The store's
   sample strings in `apps/emails` print `GMT+8`, the application's emails do
   not. Each call passes the brand zone, `Asia/Hong_Kong`, through one helper,
   `mailTime(at)` in `mailZone.ts`, which also binds the mail's English, so a
   mail date cannot print without a zone; the date-fns `zzz` token prints
   `GMT+8`. Rejected: a store-side email
   formatter, because the sender is the application's backend and the templates
   take strings.

8. **A grading or vault letter names `GMT+8` once, in its footer.** Their dates
   carry no suffix, so the footer's line is the message's naming of the zone
   (Q8, Q17). A grading footer reads `Dates and times are Hong Kong time
   (GMT+8).`; the vault keeps its own `are in` wording and reads `Dates and
   times are in Hong Kong time (GMT+8).` The store's previews read `Dates and
   times are Hong Kong time.`
   (`apps/emails/emails/grading/_components/grading-letter.tsx`) and `Dates and
   times are in Hong Kong Standard Time.` (`footerLines` in
   `apps/emails/emails/vault/fixtures.ts`). The application's catalogues
   (`packages/grading/backend/src/email/messages.ts` and
   `packages/vault/backend/src/email/messages.ts`) read `Dates and times are in
   {zone}.`, filled with the long name `Hong Kong Standard Time` by `zoneName`
   in each package's `letters/format.ts`. All four change to their one line, and
   `zoneName` goes. The application does not derive the offset: a letter has no
   instant in scope and nothing below a service reads the clock, so the
   catalogue holds the literal line and each render test holds the brand zone
   to `GMT+8` through `formatZone`, in a winter and a summer instant, so a
   footer cannot drift from the clock its dates are read on. Each render test
   takes the new text. The grading test has a snapshot too. The vault's
   render test asserts no zone line today and the vault has no snapshot, so
   group 3 adds the assertion. The grading spec says the footer "says so" and
   the vault spec names the footer's party and complaints contact and no zone,
   so neither is edited. A calendar day with no clock (`format.day`) prints no
   zone (Q12). The grading letter's shop-hours line, `Open {hours}.`, is a
   weekly schedule, not the date or the time of an event. `formatOpenings` in
   `@grade10/grading-contracts` ends it in the shop's long zone name,
   `Hong Kong Standard Time`, and it keeps that wording (Q28): the letter then
   names Hong Kong twice, the schedule in the shop's words and the footer as
   the clock its dates and times are read on. Rejected: moving the hours line
   to `GMT+8`, which changes the one formatter the collector's page, the
   console and the letter share, for a line that states no event.

9. **An unrecognised zone is the platform's own refusal.** `Intl.DateTimeFormat`
   throws `RangeError: Invalid time zone specified: <zone>`, and every
   collector formatter builds one before it prints a character, so a local
   moment or a deadline fails naming the zone with no wrapper and no `UTC`
   fallback (Q10). A missing zone is a compile error: `timeZone` is a required
   string in every collector formatter's options. Activity time under seven
   days reads no zone and so cannot fail on one. No test pins this today; the
   node lane adds one. Rejected: falling back to `UTC`, which hides a wrong clock,
   and to the machine's zone, which contradicts `Supplied, not read`.

10. **The application's collector clock is the viewer's, and the first paint
    reads UTC.** `useLocalTimeZone` returns the browser zone after hydration and
    `UTC` before it. The listing view already passes it. First paint therefore
    reads `GMT` with the UTC clock, then the local zone (Q11). The deadline
    requirement says so: until the zone is known a deadline MAY read in UTC and
    name it `GMT`, and SHALL switch once it is known. The label keeps the first
    paint honest, and the page already withholds its countdown until the server
    clock syncs. The scenarios read the page once the zone is known.
    Rejected: showing no dated line until the zone is known, which leaves a gap
    in the layout that fills a moment late.

11. **Three application pages take the store's formatter; the invoice page
    states the brand zone.** The catalogue tile, My Auctions and Winner Order
    pass the viewer's zone and name it through `formatZonedLocalMoment`, and a
    day alone through `formatLocalDay`, each page resolving the shipped locale
    once, not through `@grade10/utils/dates`, so one function owns the rule and
    New York reads `EDT`, not `GMT-4` (Q7). A day with no clock on
    Winner Order is the viewer's day, as the durable spec reads its step
    subtext, and names no zone (Q20). A surface whose own spec fixes its zone
    keeps it (Q29). The invoice page is the invoice
    document, so it states `Asia/Hong_Kong` as `GMT+8`, as the PDF does,
    whoever opens it (Q19). It cannot take that name from
    `formatCollectorDeadline`: `formatViewerZoneName` pins Hong Kong to `HKT`,
    which the scenario forbids. The page already calls the application's own
    `formatDeadline` and `formatDay`, so it passes them the brand zone,
    `timeZone: "Asia/Hong_Kong"`, as the auction emails do (Decision 7), and the
    date-fns `zzz` token prints `GMT+8`. Its payment deadline carries a clock
    and names `GMT+8`. Design note, with no scenario or case behind it: its
    sent day carries no clock, so it reads the Hong Kong day and names no zone
    (Q12, Q21). Rejected: composing the name from `@grade10/ui`, because it adds
    a second import to a page that needs none and leaves the page and the
    emails on two routes to one label.
    Shop-clock pages stay where they are: a page that books or confirms a
    visit, or a vault or signing page, keeps the shop's clock whatever zone the
    viewer is in (Q22, Q25), so a viewer in New York reads Hong Kong time
    there. How those pages name the zone is left out (Q27): the drop-off
    cut-off lines, the joined-visit time and the vault visit time print an
    unnamed Hong Kong clock today, and the booking blocks' default label is
    `HKT` for Hong Kong; their one consumer in the application, the drop-off
    page, passes its own label, the zone's long name in the reader's language
    (`Hong Kong Standard Time`). None of that moves here. Wherever a zone is named it follows a clock and
    never a day alone (Q23). The pages are a list, not found by who sets a
    deadline: Winner Order's payment and address-confirmation deadlines are
    collector deadlines in the viewer's zone (Q7; the payment deadline is
    `winner-order-SC-31`). Rejected: a follow-up change for the four pages,
    which leaves the disagreement this change exists to close; the viewer's zone
    on the invoice page, which makes the page and the PDF of one invoice read
    two clocks; the viewer's zone on a shop-clock page, which tells a collector
    the time of a visit at the shop in a zone the shop does not keep; promising
    the shop's zone, named, on those pages now, which moves the drop-off, vault
    and signing pages in this change; a definition by who sets a deadline,
    which would put Winner Order's payment deadline on the shop's clock.

12. **Tests carry the ids.** The formatter, story and PDF tests prove the
    scenarios but cite none of their ids, so the group landing cannot join them.
    Cite each scenario id in the story name or the test title, and the case id
    where a manual row credits the test.

13. **The zone reaches the auction order surfaces as an argument at each date
    call.** The operator formatter reads UTC unless it is given a zone, so the
    Orders worklist, the order page, its timeline and invoice log, and the send
    and reissue dialog's payment deadline pass `Asia/Hong_Kong` and print
    `GMT+8`, and no other operator table passes one, so each stays `UTC` (Q31,
    task 6.1). The order timeline and invoice log are not the audit trail: the
    audit trail is a record a machine reads and stays `UTC`. Rejected: a zone
    set once for the whole admin app, which moves every operator table; a
    setting the operator picks, which gives two operators two clocks for one
    order and breaks `grade10-admin-auction-post-sale-SC-239`.

### Surfaces and who moves them

Read in `grade10` at its current main.

| Surface | Where | Prints now | Contract | Moved by |
| --- | --- | --- | --- | --- |
| Auction page close | `ListingView` into the lot bid card | viewer zone, no name until the bump | viewer zone and name | group 3 |
| Lot bid card, closed block | `@grade10/ui` | viewer zone, no name | viewer zone and name; a day alone reads in the viewer's zone and names none | group 2 |
| Auction emails | `emailPort.ts`, `render.tsx` | `UTC` | `GMT+8` | group 3 |
| Grading letters | `messages.ts`, `grading-letter.tsx` | `Dates and times are in Hong Kong Standard Time.`, `Dates and times are Hong Kong time.` | `Dates and times are Hong Kong time (GMT+8).` | groups 2 and 3 |
| Catalogue tile | `ListingCatalogueCard` | brand zone, `GMT+8` | viewer zone, `HKT` / `EDT` / offset | group 4 |
| My Auctions | `AccountAuctionRecordPage` | watching rows `GMT+8`, bidding rows `UTC` | viewer zone, `HKT` / `EDT` / offset | group 4 |
| Winner Order | `winnerOrderView.ts` | `UTC` | viewer zone, named on a clock (lines below) | group 4 |
| Invoice page | `AuctionInvoicePage.tsx` | `UTC` | `Asia/Hong_Kong`, `GMT+8`, as the PDF, through the application's `formatDeadline` and `formatDay` given the brand zone | group 4 |
| Appointment, drop-off, vault, signing pages | the shop's or brand zone | an unnamed Hong Kong clock on the drop-off cut-off lines, the joined-visit time and the vault visit time; the booking blocks' default label `HKT`, and the drop-off page's own label, `Hong Kong Standard Time` | the shop's clock; how the zone is named is left out (Q27) | none |
| Auction order operator surfaces | the auction admin's Orders worklist, order page, timeline, invoice log and send and reissue dialog | `UTC` | `Asia/Hong_Kong`, `GMT+8`; every other operator table stays `UTC` | group 6 |
| Vault letters | `packages/vault/backend/src/email/messages.ts`, `vault/fixtures.ts` | `Dates and times are in Hong Kong Standard Time.` | `Dates and times are in Hong Kong time (GMT+8).` | groups 2 and 3 |

Shop-clock pages keep the shop's clock and name its zone no one way today: an
unnamed Hong Kong clock on the drop-off cut-off lines, the joined-visit time and
the vault visit time, and the booking blocks' default label `HKT`. Q22 fixes
that the clock is the shop's, Q25 lists the pages and Q27 leaves how they name
the zone out. One name for the shop's zone is a follow-up and moves no page
here. Vault letters are messages, not pages: their dates keep the Hong Kong
clock and only the footer label moves (groups 2 and 3).

Winner Order prints through two `@grade10/utils/dates` functions and gives
neither a zone, so every line reads `UTC` today. `winner-order-SC-66` already
splits the two forms: step subtext is day-only and the pay control shows the
datetime. Read in `winnerOrderView.ts` at `grade10` main on 2026-10-06:

| Line | Line no. | Prints now | Contract |
| --- | --- | --- | --- |
| `Payment deadline restarted: {deadline}`, on a returned proof | 339 | `formatDeadline`, a clock | a deadline: the viewer's zone, named |
| `Payment deadline passed {deadline}`, in the overdue alert | 357 | `formatDeadline`, a clock | a deadline: the viewer's zone, named |
| `Pay by {deadline}`, on the pay control | 383 | `formatDeadline`, a clock | a deadline: the viewer's zone, named |
| `Confirm by {deadline}`, under Complete Order Setup | 421 | `formatDeadline`, a clock | a deadline: the viewer's zone, named |
| Step subtext: `Confirm by {day}`, the address and invoice days, `Pay by {day}`, the paid day | 245 to 269 | `formatDay`, a day | day only: the day in the viewer's zone, no zone |
| `Cancelled on {day}` | 306 | `formatDay`, a day | day only: the day in the viewer's zone, no zone |
| `Missed setup deadline: {day}` | 428 | `formatDay`, a day | day only: the day in the viewer's zone, no zone |

## Risks / Trade-offs

- [Two naming rules, `utils/dates` and the store] -> the catalogue tile, My
  Auctions and Winner Order move to the store's formatter in group 4, so one
  function owns the rule for the viewer's zone; a page still on `formatDeadline`
  is a shop-clock page, the invoice page or a message: the invoice page and a
  message print the brand's zone as `GMT+8`, and a shop-clock page keeps the
  shop's clock (Q27).
- [Zones with no US English short name read as offsets] -> the offset is always
  correct and unambiguous; a local abbreviation is not. The form is held in one
  scenario and one case with Seoul in English and Korean.
- [Machine date reaches a zone name] -> `at` becomes required, so a call that
  forgets the instant fails to compile.
- [A zone the runtime does not know stops a page's render] -> the browser's zone
  comes from the same `Intl` that formats it, so it is known; a zone from stored
  or served data is checked where it is read, and a failing render names it.
- [Bump breaks the typecheck] -> `AuctionCard` and `formatListing*` take new
  arguments and `formatCollectorDeadline` gains a suffix. The application has
  no `AuctionCard` caller and one `formatCollectorDeadline` caller, so the
  bump lands with its fix in one pull request.
- [The closed block has two layouts] -> the wide block and the compact line
  read one closed-close reading, so the zone is named in one place, and the
  stories read both.
- [Each footer line has two copies, the store's preview and the application's
  catalogue, for grading letters and for vault letters] -> each pair carries one
  line, and the application's render tests hold the text.
- [`add-invoice-and-receipt-pdf-blocks` is open on the same PDF capability] ->
  it carries the same `GMT+8` leaf under `Presentation-only contract` and its
  acceptance names the retired requirement `Dates render in the winner's time
  zone`. This delta holds the root group and no leaf under it, so the durable
  leaf stays the one bullet under either fold order; that change owes an
  acknowledgement of the renamed requirement at archive.
- [`add-multi-store-appointments` cites `shared/dates-and-times` for a shop's
  zone name in a sent message] -> its requirement `A booking with an address is
  told` says the mail states the start in the shop's zone naming that zone, "as
  `shared/dates-and-times` requires of a sent message". After this change that
  rule is `Asia/Hong_Kong` as `GMT+8`, so that change must raise its own delta
  on the message requirement (Q24). This change does not edit it.
- [Four pages pass the brand zone or none today] -> each page's test supplies a
  Hong Kong and a New York viewer, so a page that falls back reads wrong in one
  of them; the invoice page reads the same `GMT+8` text for both.

## Migration Plan

1. Store group 1 is on main. Group 2 lands next: the required instant, the
   required tile locale, the derived PDF label, the closed block's zone name
   and the grading template and vault fixture lines. The PRD pages already state
   the contract, with their work-in-progress marks.
2. In `grade10`, bump `external/grade10-spec` past group 2 in the same pull
   request as the call-site fixes, the email zone and the grading and vault
   footers, so the typecheck never stands red on main.
3. Move the catalogue tile, My Auctions and Winner Order onto the viewer's zone
   and the invoice page onto `GMT+8` in group 4, after the bump.
4. Run the application's unit lane, then the auction email, grading letter,
   vault letter and PDF tests, which gain a `GMT+8` assertion.
5. Take the work-in-progress marks off the PRD pages once the walk passes
   (task 5.3), before archive.
6. Rollback is reverting that pull request; the store's contract and code stay.

## Open Questions

None. `formatClosedAt` and its `formatAuction*` aliases, which no block or
application surface called, were deleted in group 2.
