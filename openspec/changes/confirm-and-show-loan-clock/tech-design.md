## Context

The work is in `packages/vault/admin-frontend`, the vault console slice that
`apps/admin/grade10` mounts. Motivation is in [proposal.md](proposal.md).

- **Cancel visit** - `cases/presentation/views/BookingRow.tsx` runs
  `useVisitMoves().run({ kind: "cancel" })` on one press, and shares one
  mutation, and so one refusal line, with Book and Move.
- **Send forfeiture notice** - `CustodyPanel.tsx` hands `ForfeitWithheld` an
  `onSend` that runs `useCaseMoves().run({ kind: "sendForfeitureNotice" })` on
  one press. Release, Unwind and Forfeit open `PromptDialog` there because each
  takes a typed reason or note.
- **The header** - `CaseDetailPanel.tsx` draws the status `Badge` beside the
  reference and already destructures `due` from the case read. Its `timeZone`
  prop is the brand's zone, which the console treats as the shop's clock.
- **What the read carries** - `CaseDetail` has `asOf` (the worker's instant),
  `due.dueAt`, `notice` (`{ writtenAt, payBy }`, the newest notice) and
  `case.contact.email`. `admin.policy` (`vault:read`), read by
  `useLendingPolicy` with an infinite stale time, carries
  `policy.forfeitureNoticeDays`.
- **The cure date** - computed only in the worker,
  `vault/backend/src/custody/forfeit.ts`: the last instant of the brand-zone
  day `forfeitureNoticeDays` after the send. The worker refuses a brand with no
  period as `LENDING_POLICY_UNSET` and a case not held for want of a notice by
  `forfeitHold`.
- **Confirm** - `ConfirmProvider` and `ConfirmDialog` are mounted in
  `apps/admin/grade10/src/AppProviders.tsx`; `useConfirm` takes the effect,
  shows a rejection inside the open dialog, and captures its words once.
- **Clock and zone** - `@grade10/utils/dates` formatters read UTC unless
  given `{ timeZone }`. A separate bug fix is giving the console's zoneless
  calls their zone; every call this change writes passes the zone itself.

## Goals / Non-Goals

**Goals:**

- Both confirms name what the worker will act on, read from the worker at the
  press rather than from a page that may have sat open
- The date the notice confirm names and the date the worker writes come from
  one function
- The header clock is a pure derivation of the case read, tested at the
  shop's midnight

**Non-Goals:**

- Any new procedure, wire field, migration or worker rule
- A change to `ConfirmDialog`, `Badge` or any `@grade10/ui` block
- The Overdue view's own count, or rows in any other view

## Decisions

The spec governs what each confirm names, its tone and its dismiss label, and
what the header reads for which case. These decisions say how the console
lands it.

### 1. Both acts confirm through `useConfirm`

Each is words and one effect, which `docs/conventions/dialogs.md` assigns to
`useConfirm`. `onConfirm` awaits the move's `run`, so a worker refusal rejects
and stays in the open dialog.

- **Cancel visit** - default tone, `confirmLabel` `Cancel visit`,
  `cancelLabel` `Keep visit`.
- **Send forfeiture notice** - `tone: "destructive"`, `confirmLabel` from
  `ACT_NAMES.sendForfeitureNotice`, the default `Cancel` to dismiss.
- **A mutation of its own** - Cancel visit gets its own `useVisitMoves()`
  instance, so its refusal shows in the confirm and not on the Book and Move
  line behind it. The notice's inline refusal line in `CustodyPanel` goes, as
  the confirm now holds that refusal.

Rejected: `PromptDialog`, which carries a field neither act takes; a
caller-held `useDialogSubject` dialog, which adds state for words that do not
change while the dialog is open; an undo toast, which Q2 rejected.

### 2. The press reads the worker before it asks

A confirm's words are captured once, so they are built from a read made at
the press:

1. The button shows pending and calls `queryClient.fetchQuery` for the case's
   own detail key with `staleTime: 0`, which also refreshes the panel. The
   notice press reads `admin.policy` the same way, into the cache entry
   `useLendingPolicy` fills.
2. Where the fresh read no longer allows the act - the visit is gone, or a
   notice now stands - no confirm opens and the panel redraws from the cache.
3. Otherwise the words are built from the fresh detail, with its `asOf` as
   the instant, and `confirm` is asked.
4. A failed read shows its message beside the button, where the refusal
   showed before, and opens nothing.

One hook in the cases slice does step 1:
`useFreshCase(): (caseId: string) => Promise<CaseDetail>`.

Rejected: the detail already on screen, whose `asOf` can be hours old and
name an earlier pay-by day than Q13 asks for; the browser's clock, which can
run ahead of the worker and name a later day than the worker writes, the one
direction Q13 rules out.

### 3. The cure date is one function in the contracts

`noticePayBy(sentAt: Date, noticeDays: number, timeZone: string): Date` moves
the worker's arithmetic into `@grade10/vault-contracts` beside `forfeitHold`:
the last instant of the brand-zone day `noticeDays` after `sentAt`, throwing
where no such day exists. `sendForfeitureNotice` calls it and keeps its
`LENDING_POLICY_UNSET` refusal; the console calls it with the fresh `asOf`.

The worker's notice is sent at or after that `asOf`, so the date it writes is
the confirm's date or a later one, which Q13 accepts.

Rejected: a console copy of three date calls, which can drift from the date
that binds the borrower; a new procedure answering the date, which is a wire
change for what one pure function gives.

### 4. The words are pure functions in the cases slice

`cases/domain/confirmWords.ts`:

| Function | Input | Output |
| --- | --- | --- |
| `cancelVisitConfirm` | `{ appointmentAt: Date, email: string \| null, timeZone }` | `{ title, description }` naming the slot through `formatMoment(at, { timeZone })`, the address or that nobody is emailed, and that the case keeps its status |
| `forfeitureNoticeConfirm` | `{ email: string \| null, payBy: Date \| null, timeZone }` | `{ title, description }` naming the address or nobody, and `formatDay(payBy, { timeZone })`, or that no date can be named while the brand has no notice period |

The address is `case.contact.email`, the one every message to the collector
goes to (Q12).

### 5. The clock is a pure derivation of the case read

`cases/domain/loanClock.ts`:

```ts
type LoanClock = { kind: "pastDue"; days: number } | { kind: "payBy"; at: Date };
function loanClock(detail: CaseDetail, timeZone: string): LoanClock | null;
function loanClockWords(clock: LoanClock, timeZone: string): string;
```

- **Null** - unless the case is on the financed lane, `active` and has a
  `due`: storage, repaid and ended cases carry none (Q10).
- **`payBy`** - where `detail.notice` stands, its `payBy`, passed or not
  (Q7, Q11).
- **`pastDue`** - otherwise
  `calendarDaysBetween(due.dueAt, detail.asOf, timeZone)` when it is at
  least 1, the count `caseStanding` gives the collector's Past due stage. It
  never reads `due.overdueDays`, which is net of grace (Q9).
- **Words** - `1 day past due`, `N days past due`, `pay by <formatDay>`.

`CaseDetailPanel` draws it as a second `Badge` beside the status in the
`info` tone. The waiting-on-staff badges keep `warning` and are drawn from
`needsStaffReasons`, which the clock never touches (Q6).

Rejected: reading the chip from `caseStanding`, which answers a recorded fact
before the loan's clock and so hides the count on a late loan whose collector
missed a visit or asked for the item back.

## Risks / Trade-offs

- [The clock's count and the collector's Past due count drift] -> a unit test
  folds the same case through `loanClock` and `caseStanding` and asserts one
  count at three instants either side of the shop's midnight.
- [A brand sets grace above zero, and the header's count runs ahead of the
  Overdue view's, which shows `overdueDays` net of grace] -> both brands hold
  zero grace today (`packages/app-env/src/lending.ts`); the divergence is
  raised for the product owner rather than designed around.
- [The shop's day turns between the confirm and the press] -> the instant is
  the worker's `asOf`, so the worker's date can only be later (Q13); the
  `noticePayBy` test pins that order.
- [A confirm opens on a slot or a hold another operator has since changed] ->
  the press re-reads the case before it asks (Decision 2).
- [The notice confirm names a period changed since the console last read the
  policy, which `useLendingPolicy` never re-reads on its own] -> the press
  reads the policy with `staleTime: 0` (Decision 2).
- [Moving the cure date into the contracts changes the worker] -> the
  backend suites' notice and forfeiture cases run unchanged against it.
- [A zoneless call reads a correct day on a test machine set to the shop's
  zone] -> the package's vitest runs on `Asia/Hong_Kong`, and the formatters
  default to UTC, so each test picks an instant whose UTC day differs from the
  shop's, such as 00:30 Hong Kong time.
- [The zone bug fix also edits `BookingRow`] -> group 3 starts from that
  fix's commit where it has landed and takes its `timeZone` prop rather than
  adding a second.

## Migration Plan

Console and contracts only. The contracts move ships with the worker in the
same deploy; there is no data to move, and rollback is the previous deploy.

## Test Lanes

| Lane | What it proves |
| --- | --- |
| Contracts unit | `noticePayBy` at the shop's midnight, and a later `sentAt` never naming an earlier day |
| Backend (`pnpm run test:backend`) | The notice and forfeiture suites, unchanged, against the moved function |
| SPA unit, vault admin frontend | `loanClock` and `confirmWords`; the header in `CaseDetailPanel.test.tsx`; both confirms in `BookingRow.test.tsx` and `CustodyPanel.test.tsx`, rendered under `ConfirmProvider` and `ConfirmDialog` |
| Storybook | `CaseDetailPanel` stories for a loan past due and one with a notice standing |
| E2E (`apps/frontend/grade10/e2e/tests/vault/console.spec.ts`) | The three journeys on the local stack, with a payout seeded days back so the loan is past due |
| Staging walk | The same three journeys in the deployed console |
