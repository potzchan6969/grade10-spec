# A reminder is owed before a member's points lapse - design

## Context

See `proposal.md` for why. What exists in `@grade10/loyalty-service`
(`packages/loyalty/backend`) decides the shape:

- **The balance's date is already a read** - `selectLiveBalances` in
  `src/repositories/ledgerEntries.ts` answers each member's live balance and
  the latest effective expiry over their live lots, `greatest(expires_at,
  activity_expires_at)`, alive at the instant asked. Nothing waits on the
  nightly sweep for a lapse to count.
- **Every writer that moves the day or the balance already exists** - spend,
  redeem, refund claw-back, operator adjust and restart, redemption reversal,
  the return of points paid at checkout by a refund or an operator, and
  `endMembership`, which debits a deleted account's balance to zero. None
  needs to know reminders exist.
- **Calendar math runs in `program.timeZone` in TypeScript** and reaches SQL
  as instants (`docs/architecture/loyalty.md` § Calendar math);
  `@grade10/utils/zone` has `startOfLocalDay`, `shiftLocalDay`,
  `dayStartInstant` and `localDateKey`.
- **The programme is a config refused whole at boot** - `programSchema` in
  `src/loyaltyProgram.ts`; Grade10's is `GRADE10_LOYALTY_PROGRAM` in
  `packages/app-env/src/loyalty.ts`.

## Goals / Non-Goals

**Goals:**

- One read answers who is owed a reminder at an instant, true the moment it is
  asked.
- No writer, sweep or table changes to keep it true.

**Non-Goals:**

- A wire surface. Nothing reads a reminder yet; the channel change picks the
  binding it reads through.
- Recording what a channel sent. The reminder's identity is what a channel
  keys its own record on.

## Decisions

The capability spec governs who is owed a reminder, what it names, when it
stops being owed and that nothing is sent. What follows is how it lands.

- **A reminder is derived, never stored.** It is a pure function of the
  member's live lots, the programme's clock and its lead times, read at an
  instant. "Gone at once" and "the count as it stands when read" then hold by
  construction: a purchase, a claw-back, a deletion or the day passing changes
  the lots, a lead taken out of the setting changes the config, and the next
  read answers differently.
  - Rejected - an `expiry_reminders` table filled by a nightly pass. Every
    writer listed above would have to withdraw or recount rows inside its own
    transaction, a reminder would outlive its day until the next pass, and the
    table would be a second source of truth beside the ledger.
- **Identity is `(userId, expiresOn, leadDays)`** - `expiresOn` is the local
  calendar day, `YYYY-MM-DD` on `program.timeZone`, of the latest live
  effective expiry. Two purchases on the same day move the instant within the
  day and keep the reminder; a purchase on a later day moves the day and ends
  it. No id is minted, so asking twice answers the same three.
- **Owed for a lead `L`** when the member's day is no later than today plus `L`
  local days - the expiry instant is before `dayStartInstant(shiftLocalDay(
  startOfLocalDay(at, tz), L + 1), tz)` on `tz = program.timeZone` - and the
  lots are alive at `at`. The day
  exactly `L` days off is owed, the way the profile's warning counts its 30
  (`packages/loyalty/frontend/src/features/programme/member/presentation/balanceExpiry.ts:45`,
  `days <= EXPIRY_WARNING_DAYS`). The upper bound is one instant per lead,
  computed in TypeScript; SQL compares instants only.
- **The points are the live lots whose effective expiry falls on
  `expiresOn`.** Under the one-date rule that is the whole balance; counting
  by day still keeps any lot that lapses earlier off a later day.
- **Whoever holds points is a member** - registration makes every account a
  member ([Profile](../../../docs/prds/products/grade10-site/loyalty/profile.md),
  Member made), so the read keys on a balance. Whom a channel may contact is
  the channel's change.
- **A deleted account is read off the balance**, which `endMembership` debits
  to zero, and the read also filters `account_member.erased_at is null` on the
  join every expiry read already makes (`ON_MEMBER`): an earn arriving
  after the erasure still credits the ledger, since no earn path reads
  `erased_at`, and owes that account nothing.
- **Lead times live on the expiry block** - `expiry.reminderLeadDays`, a list
  of whole days. Absent means the programme owes no reminder and starts, the way an
  absent `redeem` bound means no per-unit reward; another brand's programme
  is not made to carry one. Present, the parse refuses an empty list, a lead
  below 1, a lead repeated, and a lead at or past the shortest the window can
  run, each issue at
  `expiry.reminderLeadDays` naming what it refuses.
- **The window's bound is read off `expiry.months`** - a lead is refused at
  the fewest days that many calendar months can span, 365 for twelve, so a
  programme on another window is held to its own. A pure
  `shortestWindowDays(months)` counts `addMonthsInZone` from each of the 4,800
  month starts of one 400-year Gregorian cycle in UTC and keeps the least, so a
  window across a century year that skips its 29 February is counted too; the
  parse calls it once. A window opened late in a month and clamped at its end
  never runs shorter than one opened on the next month's first day.
  - Rejected - a literal 365, which holds only while every programme runs
    twelve months.
- **Returned points keep the running day, already** - `restoreConsumedLots`
  in `src/services/ledger/lots.ts` copies each lot's own date and leaves the
  member's clock where it is, for a reversal (`services/rewards/reversal.ts`)
  and for points paid at checkout that a refund or an operator returns
  (`reversePay` in `services/ledger/payment.ts`, which `returnSpend` in
  `services/ledger/spends.ts` calls for the operator); only `operatorCreditLife` in
  `services/ledger/expiry.ts`, which grants and corrections call, starts a
  window where nothing is live. The programme delta states this, and one
  behavior test pins it; no writer changes. A reminder dropped when the
  balance emptied is then answered again with the same identity, by
  construction.
- **Grade10's value is Q5's** in `decisions.md`; the code does not depend on
  it. It is one line of `GRADE10_LOYALTY_PROGRAM`, left out where Q5 settles
  none, and the delta's Grade10's lead times anchor gains its requirement and
  scenario from that answer. Q6 settles any balance of 1 point or more, the
  delta's "still holds points", so the read carries no minimum.

## Service Interfaces

One repository read and one service function, both in
`packages/loyalty/backend`; the pure step between them is unit-testable without
a database.

| Layer | Name | Input | Output |
| --- | --- | --- | --- |
| Repository | `selectExpiringLots` in `src/repositories/ledgerEntries.ts` | `{ at: Date, before: Date, after: string \| null, limit: number }` | the live lots `{ userId, effectiveExpiresAt, remaining }` of up to `limit` members, ordered by `userId`, whose latest live effective expiry is before `before`, after `after`, `erased_at is null` |
| Pure | `remindersOwed` in `src/services/ledger/reminders.ts` | `(program, lots of one member, at)` | `ExpiryReminder[]`, one per lead the day falls within |
| Service | `listOwedExpiryReminders` in `src/services/ledger/reminders.ts`, exported from `services/ledger` | `(db, program, { at?: Date, after?: string, limit?: number })` | `{ reminders: ExpiryReminder[], next: string \| null }` |

`ExpiryReminder` is `{ userId: string; expiresOn: string; points: number;
leadDays: number }`.

- **Reads only** - no transaction, no lock, no write, no metric. The read takes
  one snapshot of the lots, so a page is consistent with itself.
- **Paged by member** - `before` is the bound of the longest lead, so one
  statement finds every candidate; a member's reminders never split across
  pages. Keyset on `userId` as `listMemberIds` in
  `src/services/members/listing.ts` pages: `limit` defaults to 200 and is
  clamped to 1..500, and `next` is the last member id of a full page,
  otherwise `null`.
- **Absent leads** - answers `{ reminders: [], next: null }` without reading.
- **Deterministic** - the same lots, `at` and config answer the same list in
  the same order: by member, then lead descending.

Example - Grade10's clock, leads `[30, 7]`, `at` = `2027-03-01T02:00:00Z`
(10:00 on 1 March in Hong Kong):

| Member | Live lots, effective expiry | Remaining | Answered |
| --- | --- | --- | --- |
| `u-a` | `2027-03-08T06:23:00Z` (14:23, 8 March) | 80 + 40 | `{ u-a, 2027-03-08, 120, 30 }`, `{ u-a, 2027-03-08, 120, 7 }` |
| `u-b` | `2027-03-31T01:00:00Z` (09:00, 31 March) | 40 | `{ u-b, 2027-03-31, 40, 30 }` |
| `u-c` | `2027-04-01T01:00:00Z` (1 April, 31 days) | 15 | nothing - `selectExpiringLots` never returns it |
| `u-d` | `2027-03-05T16:30:00Z` (00:30, 6 March) | 0 after a claw-back | nothing - no live lot |

## Risks / Trade-offs

- [The candidate read groups every open lot by member, and pages scan from the
  cursor] → it runs on `idx_ledger_entries_open_lots`, already ordered by
  `user_id`, with the `HAVING` on the grouped maximum; the read is checked with
  `EXPLAIN` against staging's volume before the channel change schedules it.
  Driving it from `idx_account_member_activity_expires_at` instead would trust
  the member's clock over the lots the rule reads, and miss any member whose
  clock is null
- [A config refused at boot takes the worker down] → the same parse runs in
  `program.spec.ts` and the package's tests over `GRADE10_LOYALTY_PROGRAM`, so
  a bad lead fails CI before a deploy
- [A read answers a reminder a second before the day moves] → a channel acts
  on a reminder after reading it; the channel change re-reads under the
  identity before sending, which this design leaves to it

## Migration Plan

No schema change and no migration. The config gains one optional key; rolling
back is a revert, and nothing persisted depends on it.
