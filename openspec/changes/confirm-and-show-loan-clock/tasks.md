## 1. The One Case page (grade10-spec) (owner: @ecchochan)

- [ ] 1.1 Read the three 🚧 lines under One case in
      `docs/prds/products/grade10-site/vault/operator-console.md`
      against the accepted requirements, and reword any line they now say
      otherwise; then run `pnpm check:manual`.
- [ ] 1.2 Verify: `openspec validate confirm-and-show-loan-clock --strict` and
      `pnpm check:manual`.

## 2. The cure date as one function (grade10) (owner: @ecchochan)

Moves the worker's cure-date arithmetic into `@grade10/vault-contracts` with
no change in what the worker writes. No scenario turns on it alone; groups 4
and 5 cite the ones it serves.

- [ ] 2.1 Add the tests first, in their own commit: `noticePayBy` names the
      brand-zone day 14 days on at 10:00 and at 23:59 Hong Kong time, and a
      `sentAt` two minutes later across the brand's midnight names the next
      day, never an earlier one.
- [ ] 2.2 Add `noticePayBy(sentAt, noticeDays, timeZone)` beside
      `forfeitHold` in `packages/vault/contracts/src`, and have
      `sendForfeitureNotice` in `packages/vault/backend/src/custody/forfeit.ts`
      call it, keeping its `LENDING_POLICY_UNSET` refusal.
- [ ] 2.3 Verify: the contracts unit tests, `pnpm run test:backend` for the
      vault worker's notice and forfeiture suites, and the typecheck.

## 3. The loan's clock in the case header (grade10) (owner: @ecchochan)

- [ ] 3.1 Add the tests first, in their own commit: `loanClock` and
      `loanClockWords` for each row of the requirement's table, the count
      folded beside `caseStanding` at 23:00 on the due date, 00:30 the day
      after and three days on, a 3-day grace that does not reduce the count,
      a notice date kept after it passes, and a case kept at a shop on
      `Asia/Tokyo` under a brand on `Asia/Hong_Kong` reading the brand's day;
      then `CaseDetailPanel` drawing the clock beside the status for an
      operator without the payout grant, at instants whose UTC day differs
      from the brand's
      (`grade10-admin-vault-operator-queue-SC-97`,
      `grade10-admin-vault-operator-queue-SC-98`,
      `grade10-admin-vault-operator-queue-SC-99`,
      `grade10-admin-vault-operator-queue-SC-100`,
      `grade10-admin-vault-operator-queue-SC-101`,
      `grade10-admin-vault-operator-queue-SC-102`,
      `grade10-admin-vault-operator-queue-SC-103`,
      `grade10-admin-vault-operator-queue-SC-104`,
      `grade10-admin-vault-operator-queue-SC-143`,
      `grade10-admin-vault-operator-queue-SC-144`).
- [ ] 3.2 Add `cases/domain/loanClock.ts`, and draw its words as an `info`
      `Badge` beside the status badge in `CaseDetailPanel.tsx`, judged and
      formatted on the brand's zone, never the case's shop's, covering
      `grade10-admin-vault-operator-queue-SC-97`,
      `grade10-admin-vault-operator-queue-SC-98`,
      `grade10-admin-vault-operator-queue-SC-99`,
      `grade10-admin-vault-operator-queue-SC-100`,
      `grade10-admin-vault-operator-queue-SC-101`,
      `grade10-admin-vault-operator-queue-SC-102`,
      `grade10-admin-vault-operator-queue-SC-103`,
      `grade10-admin-vault-operator-queue-SC-104`,
      `grade10-admin-vault-operator-queue-SC-143` and
      `grade10-admin-vault-operator-queue-SC-144`.
- [ ] 3.3 Add `CaseDetailPanel` stories for a loan past its due date and for
      one with a notice standing.
- [ ] 3.4 Verify: `node scripts/test.mjs vault-admin-frontend`, the typecheck,
      `pnpm run lint` and the Storybook lane for the two stories.

## 4. Cancel visit asks first (grade10) (owner: @ecchochan)

Starts from the console zone fix's commit and from
`read-vault-console-on-shop-clock`'s where they have landed, and takes their
zone on `BookingRow` rather than adding a second.

- [ ] 4.1 Add the tests first, in their own commit: `cancelVisitConfirm` for a
      case with and without an address at 10:00 Hong Kong time on 15 June 2026,
      and for a shop on `Asia/Tokyo` under a brand on `Asia/Hong_Kong`;
      then `BookingRow` under `ConfirmProvider` and `ConfirmDialog`, asking in
      the default tone with `Keep visit` and `Cancel visit`, sending nothing
      on `Keep visit`, cancelling on confirm, keeping a refusal in the open
      confirm, opening no confirm on a visit cancelled since the case was
      read, naming a visit moved since at its new slot, and opening none on a
      failed read or a shop the lookup cannot find
      (`grade10-admin-vault-operator-queue-SC-105`,
      `grade10-admin-vault-operator-queue-SC-142`,
      `grade10-admin-vault-operator-queue-SC-106`,
      `grade10-admin-vault-operator-queue-SC-107`,
      `grade10-admin-vault-operator-queue-SC-108`,
      `grade10-admin-vault-operator-queue-SC-109`,
      `grade10-admin-vault-operator-queue-SC-116`,
      `grade10-admin-vault-operator-queue-SC-117`,
      `grade10-admin-vault-operator-queue-SC-118`,
      `grade10-admin-vault-operator-queue-SC-119`).
- [ ] 4.2 Add `useFreshCase` to the cases slice, reading the case's detail key
      with `staleTime: 0` and showing a failed read beside the button that
      asked for it, covering `grade10-admin-vault-operator-queue-SC-118` and
      `grade10-admin-vault-operator-queue-SC-121`.
- [ ] 4.3 Add `cases/domain/confirmWords.ts` with `cancelVisitConfirm`, and
      route Cancel visit through `useConfirm` on its own `useVisitMoves()`
      instance after a fresh read, naming the slot on the zone `useLocations`
      gives for the case's `locationId`, opening none where the fresh read
      holds no visit or the shop is not found, covering
      `grade10-admin-vault-operator-queue-SC-105`,
      `grade10-admin-vault-operator-queue-SC-142`,
      `grade10-admin-vault-operator-queue-SC-106`,
      `grade10-admin-vault-operator-queue-SC-107`,
      `grade10-admin-vault-operator-queue-SC-108`,
      `grade10-admin-vault-operator-queue-SC-109`,
      `grade10-admin-vault-operator-queue-SC-116`,
      `grade10-admin-vault-operator-queue-SC-117` and
      `grade10-admin-vault-operator-queue-SC-119`.
- [ ] 4.4 Verify: `node scripts/test.mjs vault-admin-frontend`, the typecheck
      and `pnpm run lint`.

## 5. Send forfeiture notice asks first (grade10) (owner: @ecchochan)

Needs group 2 for `noticePayBy`, and group 4 for `useFreshCase` and
`confirmWords.ts`.

- [ ] 5.1 Add the tests first, in their own commit:
      `forfeitureNoticeConfirm` for each row of the requirement's table, and
      for a case kept at a shop on `Asia/Tokyo` under a brand on
      `Asia/Hong_Kong` read at 23:30 on 1 December Hong Kong time, 00:30 on
      2 December in Tokyo, naming 15 December 2026; then
      `CustodyPanel` under `ConfirmProvider` and `ConfirmDialog`, asking in
      the destructive tone with the address and 15 December 2026 for a
      14-day period read at 10:00 on 1 December, recording nothing on
      dismiss, sending on confirm, and keeping the worker's
      `LENDING_POLICY_UNSET` refusal in the open confirm, and opening no
      confirm on a notice sent since the case was read or on a failed read
      (`grade10-admin-vault-operator-queue-SC-110`,
      `grade10-admin-vault-operator-queue-SC-111`,
      `grade10-admin-vault-operator-queue-SC-112`,
      `grade10-admin-vault-operator-queue-SC-113`,
      `grade10-admin-vault-operator-queue-SC-114`,
      `grade10-admin-vault-operator-queue-SC-115`,
      `grade10-admin-vault-operator-queue-SC-120`,
      `grade10-admin-vault-operator-queue-SC-121`,
      `grade10-admin-vault-operator-queue-SC-145`).
- [ ] 5.2 Add `forfeitureNoticeConfirm`, and route Send forfeiture notice
      through `useConfirm` after a fresh read of the case and of
      `admin.policy`, naming `noticePayBy` from the fresh `asOf` as a day on
      the brand's zone, and opening
      none where the fresh read holds a notice; drop the panel's inline
      notice refusal line, covering
      `grade10-admin-vault-operator-queue-SC-110`,
      `grade10-admin-vault-operator-queue-SC-111`,
      `grade10-admin-vault-operator-queue-SC-112`,
      `grade10-admin-vault-operator-queue-SC-113`,
      `grade10-admin-vault-operator-queue-SC-114`,
      `grade10-admin-vault-operator-queue-SC-115`,
      `grade10-admin-vault-operator-queue-SC-120`,
      `grade10-admin-vault-operator-queue-SC-121` and
      `grade10-admin-vault-operator-queue-SC-145`.
- [ ] 5.3 Verify: `node scripts/test.mjs vault-admin-frontend`, the typecheck
      and `pnpm run lint`.

## 6. The walk (grade10) (owner: @ecchochan)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after
deployment (`/tcs-review confirm-and-show-loan-clock`), and `/tcs-run-sheet`
executes manual cases when needed. Groups 2 to 5 landed first.

- [ ] 6.1 Walk the three journeys through the console in
      `apps/frontend/grade10/e2e/tests/vault/console.spec.ts`, with a payout
      seeded days back so the loan is past due: cancel a visit, keep it, then
      cancel it and read the collector's message
      (`grade10-admin-vault-operator-queue-US-22`); send a forfeiture notice,
      dismiss it, then confirm it and read the date it names
      (`grade10-admin-vault-operator-queue-US-23`); and read the header's
      count before the notice and its date after, as a staff operator
      (`grade10-admin-vault-operator-queue-US-24`). Keep the walks as the
      change's end-to-end suite.
- [ ] 6.2 Flip the cases the walks decide with
      `pnpm run tcs:automated <case...> --decided-by grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`,
      in the walks' own commit; the cases that stay manual remain draft and
      are named in the walk's `rounds.md` row.
- [ ] 6.3 Walk the same three journeys in the staging console once the work
      is deployed there.
- [ ] 6.4 Verify: the walks pass on the local stack and on staging, and
      `pnpm run tcs:validate` is clean in the store.
