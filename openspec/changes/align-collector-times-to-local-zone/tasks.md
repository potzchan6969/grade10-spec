## 1. Collector clocks, catalogue tile and PDF dates (grade10-spec) (owner: @tangconst)

Built in store commits `11e4dbbcf` and `8f889848c`, with tests beside the code.
Group 2 closes what those commits left open, and its tests add the ids this
group names to the tests that already prove them.

- [x] 1.1 Format collector deadlines, local moments and activity time in the
      supplied zone, and name the viewer's short zone on a deadline, covering
      `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-23` and
      `shared-dates-and-times-SC-29`.
- [x] 1.2 State PDF dates in Asia/Hong_Kong followed by `GMT+8`, covering
      `shared-ui-invoice-and-receipt-pdf-SC-43`.
- [x] 1.3 Format the catalogue tile's Ends, Opens and Closed line from the
      supplied zone, covering `shared-ui-auction-listing-SC-55`.
- [x] 1.4 Move the Storybook fixtures to the viewer zone and add a New York
      story to the tile and the lot bid card, covering
      `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-29` and
      `shared-ui-auction-listing-SC-55`. The booking summary gets a New York
      story too, for a shop in New York: the booking blocks are on the shop's
      clock (Q16, Q22), so it covers no scenario.
- [ ] 1.5 Verify: `pnpm --filter @grade10/ui run typecheck`, the node and story
      lanes for the formatter, tile, bid card and PDF files, `pnpm run lint`,
      `pnpm run validate:changes align-collector-times-to-local-zone` and
      `pnpm check:manual`.

## 2. Zone names, the closed lot and sent-message wording (grade10-spec)

Needs group 1, which is built. It does not wait on group 3.

`shared-dates-and-times-SC-10` and `shared-ui-auction-listing-SC-13` are
restated unchanged in the deltas and stay verified where they were: the first by
`packages/utils/test/dates.test.ts` in `grade10`, the second by the bid history
case `shared-ui-auction-listing-US1-TC11-1` and the bid card stories.
`shared-dates-and-times-SC-11` takes revision 2: it reads a day the business
judges, and no longer a collector deadline's day, which
`shared-dates-and-times-SC-38` reads in the viewer's zone. The same
`packages/utils/test/dates.test.ts` still verifies it, and no test cites its id.

- [ ] 2.1 Add the tests first, in their own commit, each citing its scenario id
      and the case id it decides, and the formatter, story and PDF tests that
      already prove other ids gain their citations in the same commit: a New
      York deadline reads `EDT` in September and `EST` in January
      (`shared-dates-and-times-US1-TC3-1`); one instant in one supplied zone
      reads the same text with the process zone set east and west of UTC
      (`shared-dates-and-times-US1-TC9-1`); Seoul in English and in Korean,
      Kolkata, Kathmandu, Newfoundland, London in summer and in winter, Los
      Angeles and a UTC viewer read their names
      (`shared-dates-and-times-US1-TC4-1`); an
      unrecognised zone stops a local moment and a deadline with an error
      naming it (`shared-dates-and-times-US1-TC14-1`); the open and the
      scheduled lot's countdown names no zone
      (`shared-dates-and-times-US1-TC13-1`); the lot bid card's closed block
      at `sm` or wider and its closed summary line below `sm`, where each shows
      a clock (the summary with the opening time known and not known), and the
      tile's closed line name the viewer's zone for Hong Kong and New York
      (`shared-dates-and-times-US1-TC11-1`); the closed block at `sm` or wider
      with no opening time shows the close as a day alone and names no zone
      (`shared-dates-and-times-US1-TC18-1`); the rendered tile line for Hong
      Kong ends in `HKT` (`shared-ui-auction-listing-US1-TC55-1`) and a
      Traditional Chinese tile names the viewer's zone in English
      (`shared-ui-auction-listing-US1-TC57-1`); a supplied display text
      replaces a bid row's formatted time
      (`shared-ui-auction-listing-US1-TC58-1`); the invoice's and the
      receipt's date rows end in `GMT+8` across a Hong Kong midnight, and
      under Traditional Chinese copy read English with `GMT+8`, proved on the
      rendered document and not only on the formatter
      (`shared-ui-invoice-and-receipt-pdf-US1-TC49-1` and
      `shared-ui-invoice-and-receipt-pdf-US1-TC50-1`). Covering
      `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-14`,
      `shared-dates-and-times-SC-23`, `shared-dates-and-times-SC-24`,
      `shared-dates-and-times-SC-29`, `shared-dates-and-times-SC-30`,
      `shared-dates-and-times-SC-31`, `shared-dates-and-times-SC-32`,
      `shared-dates-and-times-SC-33`, `shared-dates-and-times-SC-34`,
      `shared-dates-and-times-SC-38`,
      `shared-ui-auction-listing-SC-55`,
      `shared-ui-auction-listing-SC-57`,
      `shared-ui-invoice-and-receipt-pdf-SC-43`,
      `shared-ui-invoice-and-receipt-pdf-SC-54` and
      `shared-ui-invoice-and-receipt-pdf-SC-55`.
- [ ] 2.2 Make the instant a required argument of the viewer zone name and the
      zone offset helpers, and have every caller pass the instant it names, so
      no zone name follows the machine's date, covering
      `shared-dates-and-times-SC-30`.
- [ ] 2.3 Require `locale` on the catalogue tile, so an omitted language fails
      to compile, covering `shared-ui-auction-listing-SC-55`.
- [ ] 2.4 Derive the PDF label from the document zone through the offset
      helper instead of a literal, with the rendered text unchanged, covering
      `shared-ui-invoice-and-receipt-pdf-SC-43` and
      `shared-ui-invoice-and-receipt-pdf-SC-54`.
- [ ] 2.5 Name the viewer's short zone after the close time in the lot bid
      card's closed block, in the desktop block and in the compact summary
      line, wherever the close shows a clock, through the zone-name helper the
      open lot's deadline uses; a close shown as a day alone names none,
      covering `shared-dates-and-times-SC-14` and
      `shared-dates-and-times-SC-38`.
- [ ] 2.6 Say `Dates and times are Hong Kong time (GMT+8).` in the footer of
      the grading letter template, `apps/emails/emails/grading/_components/grading-letter.tsx`,
      and `Dates and times are in Hong Kong time (GMT+8).` in the vault
      fixture's footer lines, `footerLines` in
      `apps/emails/emails/vault/fixtures.ts`. Neither has a test lane here;
      tasks 3.1 and 3.4 prove the rendered letters.
- [ ] 2.7 Rename the booking summary's `ViewerZoneNewYork` story, in
      `packages/ui/src/blocks/appointment-booking/booking-summary.stories.tsx`,
      to `ShopZoneNewYork`, in the tests-first commit of task 2.1, and reword
      the comment on `zoneLabel` in
      `packages/ui/src/blocks/appointment-booking/booking-copy.ts` from the
      viewer's short name to the short name of the zone the block is given,
      which is the shop's. The booking blocks are on the shop's clock (Q16, Q22),
      so the story is a shop in New York, not a viewer. No scenario or case
      reads the booking blocks, so this task cites none.
- [ ] 2.8 Verify: `pnpm --filter @grade10/ui run typecheck`,
      `pnpm --filter @grade10/emails run typecheck`, the node and story lanes,
      `pnpm run lint`,
      `pnpm run validate:changes align-collector-times-to-local-zone` and
      `pnpm check:manual`.

## 3. Bump the store and state sent messages in GMT+8 (grade10)

Needs group 2 landed on the store's main, and `external/grade10-spec` bumped to
it, before it starts. The store pin, `2608abf84`, is behind store main, so the
bump lands with its typecheck fixes in one pull request.

- [ ] 3.1 Add the tests first, in their own commit: an auction email states its
      close, setup and payment times as `GMT+8` and reads the same for two
      recipients (`shared-dates-and-times-US1-TC8-1`), on the order letters
      through `emailPort.ts` and on the lot letters through `render.tsx`, whose
      close, scheduled close and start times print `UTC` today, in
      `packages/grade10-auction/backend/test/email/`; a drop-off booked
      grading letter's footer reads `Dates and times are Hong Kong time
      (GMT+8).` and every vault letter's footer reads `Dates and times are in
      Hong Kong time (GMT+8).`, the vault assertion new in
      `packages/vault/backend/test/email/render.test.tsx`, which asserts no
      zone line today (`shared-dates-and-times-US1-TC15-1`); a saved-plan
      letter's kept-until day reads the Hong Kong day with no zone name beside
      it, and its footer still reads the grading line
      (`shared-dates-and-times-US1-TC16-1`; the application derives the
      kept-until instant as the plan's expiry less 1 ms, so the test seeds an
      expiry of 2026-11-19T16:00:00.001Z for the day 20 Nov 2026); and the listing page's deadline
      line names the viewer's zone (`shared-dates-and-times-US1-TC12-1`).
      Covering
      `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-13`,
      `shared-dates-and-times-SC-15`, `shared-dates-and-times-SC-16`,
      `shared-dates-and-times-SC-35` and `shared-dates-and-times-SC-36`.
- [ ] 3.2 Bump `external/grade10-spec` and fix what the typecheck then names;
      the listing view's unconfirmed-clock deadline now carries the zone name,
      covering `shared-dates-and-times-SC-12`.
- [ ] 3.3 State every date in the auction emails in Asia/Hong_Kong as `GMT+8`
      by passing the brand zone at each `formatDeadline` call, which prints
      `UTC` today: the eleven in the email port,
      `packages/grade10-auction/backend/src/email/emailPort.ts`, for the order
      letters, and the three in
      `packages/grade10-auction/backend/src/email/render.tsx`, for the lot
      letters (`closesAt`, `scheduledClosesAt` and `startsAt`), covering
      `shared-dates-and-times-SC-13`, `shared-dates-and-times-SC-15` and
      `shared-dates-and-times-SC-16`.
- [ ] 3.4 Say `Dates and times are Hong Kong time (GMT+8).` in the grading
      letter footer, from the catalogue line in
      `packages/grading/backend/src/email/messages.ts` and the zone it is
      filled with in `packages/grading/backend/src/email/letters/format.ts`,
      and update the render test and its snapshot in
      `packages/grading/backend/test/email/`. Say `Dates and times are in Hong
      Kong time (GMT+8).` in the vault letter footer the same way, from the
      `timeZone` line of the catalogue in
      `packages/vault/backend/src/email/messages.ts` and the zone it is filled
      with in `packages/vault/backend/src/email/letters/format.ts`, so the
      vault test from task 3.1 passes; the vault has no snapshot to update.
      Covering `shared-dates-and-times-SC-35`.
- [ ] 3.5 Verify: the application typecheck, the auction frontend and backend
      unit lanes, the grading and vault backend email tests, `pnpm run lint`,
      and the listing-page end-to-end smoke.

## 4. Move the collector pages onto the viewer's zone and the invoice page onto GMT+8 (grade10)

Needs group 3's bump landed. Shop-clock pages are not moved: a page that books
or confirms a visit, or a vault or signing page, keeps the shop's clock, and how
it names the zone is left out (Q27). Vault emails keep their Hong Kong clock;
only their footer label moves, in groups 2 and 3.

- [ ] 4.1 Add the tests first, in their own commit: the catalogue tile's Ends,
      Opens and Closed lines, My Auctions' watching and bidding rows and the
      four Winner Order lines that print a clock (`Payment deadline restarted`,
      `Payment deadline passed`, `Pay by` on the pay control and `Confirm by`
      under Complete Order Setup) each read a Hong Kong viewer's clock with
      `HKT` and a New York viewer's with `EDT`, never `UTC` or `GMT-4`; the
      Winner Order lines that print a day alone (the step subtext, `Cancelled
      on` and `Missed setup deadline`) read the viewer's day, the 2nd for a Hong
      Kong viewer and the 1st for a New York viewer at 2027-09-01T23:30:00Z,
      and name no zone (the application prints `Missed setup deadline`, as the
      post-bidding PRD does; the durable winner-order spec's copy reads `Missed
      address deadline`, which this change does not touch). No scenario of this
      change reads a Winner Order day. The durable winner-order spec carries the
      step subtext: its requirement `Winner Order shows five progress steps`
      states the viewer's local zone and `winner-order-SC-66` the day-only form.
      `Cancelled on` and `Missed setup deadline` have no scenario. The invoice
      page's payment deadline reads the Hong Kong clock and `GMT+8` for both
      viewers, never `UTC`, `HKT` or `EDT`
      (`shared-dates-and-times-US1-TC17-1`). Covering
      `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-14`,
      `shared-dates-and-times-SC-29`, `shared-dates-and-times-SC-37`,
      `winner-order-SC-31` and `winner-order-SC-66`.
- [ ] 4.2 Take the viewer's zone in the catalogue tile, `ListingCatalogueCard`,
      and name it through the store's formatter instead of the application's,
      which prints `GMT+8` for every viewer, covering
      `shared-dates-and-times-SC-14` and `shared-dates-and-times-SC-29`.
- [ ] 4.3 Take the viewer's zone in My Auctions, `AccountAuctionRecordPage`, for
      its watching and bidding rows, which read `GMT+8` and `UTC` today,
      covering `shared-dates-and-times-SC-12` and
      `shared-dates-and-times-SC-29`.
- [ ] 4.4 Take the viewer's zone in Winner Order, `winnerOrderView.ts`, which
      reads `UTC` today because no call is given a zone. Four lines print a
      clock through `formatDeadline` and are deadlines, so each reads the
      viewer's zone and names it, through the store's formatter: `Payment
      deadline restarted: {deadline}` on a returned proof, `Payment deadline
      passed {deadline}` in the overdue alert, `Pay by {deadline}` on the pay
      control and `Confirm by {deadline}` under Complete Order Setup. The lines
      that print a day alone through `formatDay` read the day in the viewer's
      zone and name none: the step subtext (`Confirm by`, the address and
      invoice days, `Pay by`, the paid day), `Cancelled on {day}` and `Missed
      setup deadline: {day}`. That day is the viewer's, as the durable
      winner-order spec reads its step subtext: 2027-09-01T23:30:00Z reads the
      2nd in Hong Kong and the 1st in New York, never the Hong Kong day for
      both. No scenario of this change reads a Winner Order day. The durable
      winner-order spec carries the step subtext: its requirement `Winner Order
      shows five progress steps` states the viewer's local zone and
      `winner-order-SC-66` the day-only form; `Cancelled on` and `Missed setup
      deadline` have no scenario. Covering `winner-order-SC-31`,
      `winner-order-SC-66` and `shared-dates-and-times-SC-29`.
- [ ] 4.5 State the invoice page's dates, `AuctionInvoicePage.tsx`, which read
      `UTC` today, in `Asia/Hong_Kong`: pass the brand zone as `timeZone` to the
      `formatDeadline` and `formatDay` calls the page already makes from
      `@grade10/utils/dates`, as task 3.3 does for the auction emails. The
      payment deadline then names `GMT+8` for every viewer. The store's
      `formatCollectorDeadline` is not used here: it names Hong Kong `HKT`.
      The page's sent day is a design note in the tech design (Decision 11), not
      a covered behaviour. Covering `shared-dates-and-times-SC-37`, for the
      payment deadline.
- [ ] 4.6 Verify: the application typecheck, the auction frontend unit lane,
      `pnpm run lint`, and the catalogue, My Auctions and invoice page
      end-to-end smoke.

## 5. The walk (grade10)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after
deployment (`/tcs-review align-collector-times-to-local-zone`), and
`/tcs-run-sheet` executes manual cases when needed. Groups 1 to 4 landed first.

- [ ] 5.1 Walk the changed cases through the interface each reader uses: the
      Storybook deadline, tile, bid card and PDF stories for Hong Kong, New
      York and Seoul viewers, the auction page, the catalogue, My Auctions and
      Winner Order for a Hong Kong and a New York viewer, the invoice page for
      the same two, an auction email, a grading letter, a vault letter, and the
      invoice and receipt PDFs, covering
      `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-13`,
      `shared-dates-and-times-SC-14`, `shared-dates-and-times-SC-15`,
      `shared-dates-and-times-SC-16`, `shared-dates-and-times-SC-23`,
      `shared-dates-and-times-SC-29`, `shared-dates-and-times-SC-30`,
      `shared-dates-and-times-SC-31`, `shared-dates-and-times-SC-32`,
      `shared-dates-and-times-SC-33`, `shared-dates-and-times-SC-34`,
      `shared-dates-and-times-SC-35`, `shared-dates-and-times-SC-36`,
      `shared-dates-and-times-SC-37`, `shared-dates-and-times-SC-38`,
      `shared-ui-auction-listing-SC-55`, `shared-ui-auction-listing-SC-57`,
      `shared-ui-invoice-and-receipt-pdf-SC-43`,
      `shared-ui-invoice-and-receipt-pdf-SC-54` and
      `shared-ui-invoice-and-receipt-pdf-SC-55`.
- [ ] 5.2 Flip the cases the walks decide with
      `pnpm run tcs:automated <case...> --decided-by grade10:<walk path>`, in
      the walks' own commit; the cases that stay manual remain draft and are
      named in the walk's `rounds.md` row.
- [ ] 5.3 Take the 🚧 marks off the lines this plan wrote, once the walk in
      task 5.1 passes and the work each line names is verified, the
      application's included: **Viewer local**, **Every deadline named**, **Zone
      names**, **First paint**, **GMT+8**, **Grading letters** and **Vault
      letters** in `docs/prds/platform/shared/dates-and-times.md`; **GMT+8** in
      `docs/prds/products/shared/ui/invoice-and-receipt-pdf.md`; **Localized**
      and **Closed lot** under Bid History in
      `docs/prds/products/shared/ui/auction-listing.md`; **Hong Kong time named**
      in `docs/prds/products/grade10-site/grading/messages.md` and in
      `docs/prds/products/grade10-site/vault/collector-pages.md`. Then run
      `pnpm check:manual`. The other 🚧 lines on those pages are other changes',
      and `docs/prds/products/shared/ui/appointment-booking.md` carries none.
      Tick this task before archive.
- [ ] 5.4 Verify: the walks pass and `pnpm run tcs:validate` is clean in the
      store.
