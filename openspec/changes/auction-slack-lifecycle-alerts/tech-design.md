## Context

The spec is [Daily Reminder](specs/grade10-admin/console/daily-reminder/spec.md);
motivation is in the proposal. Everything below was read in the application
repository `grade10` at the paths given. Auction already posts the morning
lists through `@grade10/slack` (`packages/slack`) and
`services/reminder/post.ts`, using `SLACK_BOT_TOKEN` and
`SLACK_ALERTS_CHANNEL`.

- **Still Waiting today** - `repositories/reminderReads.ts` lists only the
  three waiting statuses at or past 48 hours via `statusSinceSql`; a flagged
  order is listed by its status wait, not by the flag (`services/reminder/reads.ts`).
- **Flag facts** - `flagOpenSql` and `firstOpenFlagAt` in
  `repositories/orderQueue.ts`; flag kinds and labels live in
  `FLAG_LABELS` (`admin-frontend/.../orderCopy.ts`) and `PaymentFlag` in
  contracts. Flags are written when a payment lands with a non-null `flag`
  (`services/orders/cardPayments.ts`, `operatorPayments.ts`).
- **Listing go live** - a published listing becomes biddable when
  `startsAt <= now`; there is no status write at that instant. Watcher mail
  uses the `openedReminders` sweep (`sweeps/progressFanout.ts`,
  `openedNotifiedAt` on watches).
- **Extension** - `resolveStandingMaxima.saveListing` moves `endsAt` inside
  the bid lock (`services/bidding/extension.ts`); `placeBid` returns after
  the lock and already accepts a `deferSettle` hook for best-effort work
  after the answer.
- **End** - `applyClose` in `services/listings/close.ts` commits `closed_at`
  from the settle path and the close sweep; the effective end time may
  include soft-close moves.
- **Overdue** - Setup Overdue and Payment Overdue are derived in
  `orderStatusSql`; Payment Overdue is also written when
  `expiredInvoices` expires the current invoice. Setup Overdue has no write.
- **Best effort** - `docs/conventions/backend.md`: a missable effect runs in
  `waitUntil` with a `// best effort:` comment; `check-best-effort.mjs`
  enforces it. `DeferralContext` and `deferSettle` are the local pattern.
- **Console copy** - Today and the dialog still say Still waiting
  (`TodayPage.tsx`, `DailyReminder.tsx`); the waiting column already takes
  `tone="warning"` for its count pill.

## Goals / Non-Goals

**Goals:**

- One Slack message on Auction's daily-reminder channel when a listing goes
  live, ends or is extended, and when an order becomes Setup Overdue,
  Payment Overdue or flagged, without holding the bid or order path.
- One shared env gate for the 08:00 morning post and every lifecycle alert:
  both `SLACK_BOT_TOKEN` and `SLACK_ALERTS_CHANNEL` non-empty, or skip with
  not configured and leave the usual path untouched (Q15).
- Flagged or still waiting lists every open payment flag first, any age,
  then the 48-hour waits; overdue alone stays out.
- The waiting list's title, caption and daily Slack heading match the PRD,
  with a warning mark.

**Non-Goals:**

- A second channel, token or console setting (Q2).
- A durable outbox or retry for lifecycle posts (Q10).
- Changing Needs you counts, `orderStatusSql`, or worklist derivation.
- Customer names, emails or phones in Slack (same rule as the daily post).

## Decisions

### Where it lives

| Concern | Home | Why |
| --- | --- | --- |
| Lifecycle message text | `@grade10/slack`: pure helpers beside `dailyReminderMessage` (e.g. `lifecycleAlertMessage`) | Same vendor package every product already uses for morning posts; workers still pass token and channel |
| Post + logging + metrics | `packages/grade10-auction/backend/src/services/reminder/lifecycle.ts` (`postLifecycleAlert`) | Same folder as `post.ts`; reuses `reminderDeps` Slack port and console origin |
| Hook after a write | `deferLifecycleAlert(ctx, deps, payload)` using `ctx.waitUntil` | Matches `deferSettle`; bid and order answers return before Slack runs |
| Go-live and Setup Overdue | A routine list on the existing `*/5` sweep in `sweeps/pass.ts` | Those transitions have no write to hang `waitUntil` on; the sweep is not the bid path |
| Payment Overdue | `waitUntil` after `expiredInvoices` commits `expired`, and the same sweep window as a net for Setup Overdue | The expire write is the transition; Setup Overdue stays time-only |
| Flag | `waitUntil` after the payment row that sets `flag` commits | The flag write is the transition (Q6) |
| Extension | `waitUntil` after `placeBid` succeeds and `endsAt` moved, via a `deferLifecycleAlert` on `BidDeps` like `deferSettle` | Must not run inside the listing lock or before the bid answer |
| End | `waitUntil` after `applyClose` returns `closed: true` from settle and the close sweep | Close already commits the fact; Slack follows |
| Flagged list read | Widen `reminderReads` / `readStillWaiting`; keep procedure name `reminder.stillWaiting` | Avoids a breaking rename; wire and UI words change |
| Console copy | `TodayPage.tsx`, `DailyReminder.tsx` props; Slack heading in `slackMessage.ts` | ui-design: no new primitive |

### Auction Slack env gate (morning and lifecycle)

`reminderDeps(env)` is the only place that builds Auction's Slack port. It
returns `slack: null` unless both `SLACK_BOT_TOKEN` and
`SLACK_ALERTS_CHANNEL` are non-empty (`isSet`). The 08:00
`postDailyReminder` and every lifecycle send read that port and, when it is
null, log not configured, count `not_configured`, and return without calling
Slack and without raising into the scheduled run or the bid, close or order
path (Q15). Empty strings count as unset. No second env key.

### Lifecycle posts

**Shared sender.** `postLifecycleAlert(deps, message)`:

1. If `deps.slack` is null → log that lifecycle alerts are not configured,
   count `not_configured`, return. Never throw into the caller.
2. `deps.slack.post(message)` behind the existing port deadline.
3. Success → count `sent` with a `kind` tag. Failure → `console.error` with
   kind and Slack's reason, count `failed`, return. Nothing is stored; nothing
   retries (Q10).

**Message shape.** One short `chat.postMessage`: plain-text fallback plus a
section (and a warning mark on overdue and flagged). Each row names listing
code and lot title (cut and escaped as the daily message), the times or flag
reason the PRD names, and a console link. No winner name, email or phone.

| Kind | When it fires | Body carries |
| --- | --- | --- |
| `listing_live` | Sweep finds a published listing whose `startsAt` crossed into the past since the previous pass window, including a publish that opens bidding because start is already due (Q14) | Start time; listing link |
| `listing_ended` | After a committed close | End time (`closed_at` / effective ends, including extension); listing or order link |
| `listing_extended` | After a bid commit that moved `endsAt` | Extension length as whole minutes rounded down from the seconds moved (Q16), and the new end time; listing link |
| `order_setup_overdue` | Sweep finds an order whose status is Setup Overdue and whose `addressDeadlineAt` crossed in the pass window | Warning mark; Setup Overdue; order link |
| `order_payment_overdue` | After `expiredInvoices` writes `expired` (Payment Overdue), with the sweep window as a net | Warning mark; Payment Overdue; order link |
| `order_flagged` | After a payment insert/update first sets a non-null uncleared `flag`, including a new flag after every prior flag was cleared (Q13); reason is the earliest open flag's (Q11) | Warning mark; flag reason from `FLAG_LABELS` / contracts words; order link |

**Once (Q6).** Write-path kinds fire only at the transition site, so staying
overdue or flagged does not post again. Sweep kinds select rows whose
deadline or start sits in `(now - PASS_SLACK, now]`, where `PASS_SLACK` is
slightly wider than the five-minute cron, so a late pass still alerts once
in the window and a miss outside it is accepted (Q10). No alert stamp column
and no outbox.

**Last step after usual work (Q10).** Slack is never on the critical path.
`placeBid` answers and unlocks first; only then, when the accepted bid moved
`endsAt`, the caller schedules `deferLifecycleAlert` on `executionCtx.waitUntil`
the same way as `deferSettle`, with
`// best effort: a missed extension alert is logged; the bid already stands`.
Close, Payment Overdue and flag paths schedule the same way only after their
transactions have committed and the usual response or sweep step is done. A
failure inside `waitUntil` is caught, counted and logged; it must not reject
the deferred promise uncaught or change the already-completed move.

**Same channel (Q2, Q15).** `reminderDeps` already builds one `SlackPort | null`
from `SLACK_BOT_TOKEN` and `SLACK_ALERTS_CHANNEL`, and returns null unless
both are non-empty. Lifecycle reuses that port; no new secrets. Secret `why`
strings widen to name lifecycle alerts beside the daily reminder.

### Flagged or still waiting read

Replace the Still Waiting composition with one ordered list:

1. **Flagged** - every order with `flagOpenSql`, any status and any age.
   `since` is `firstOpenFlagAt` (earliest open flag). Row action is a new
   wire value `flagged`; words are the flag reason (the open flag's kind
   label). Grant: `auction:payment` (PRD: payment processing).
2. **Waiting** - the existing three statuses at or past 48 hours on
   `statusSinceSql`, **and** `NOT flagOpenSql`, so a flagged order never
   appears twice (Q3).
3. **Order** - flagged rows first (oldest open flag first, then listing
   code), then waits longest first, then listing code.
4. **Overdue alone** - Setup Overdue and Payment Overdue are not waiting
   statuses today and stay out unless flagged (Q1).

Console audience still narrows by grant; channel audience returns every row
and empty winner strings. Procedure stays `reminder.stillWaiting`; contracts
gain `flagged` on the reminder action vocabulary. Repository tests pin one
statement and the flagged-before-waits order with `countStatements`.

### Console and daily Slack copy

| Surface | Change |
| --- | --- |
| Today column title | **Flagged or still waiting**, with a warning mark beside the title; keep `tone="warning"` on the count pill |
| Today caption | **Something wrong or waiting a while, needing your action** |
| Today / dialog empty | **Nothing flagged or waiting too long.** |
| Dialog heading | Same title and warning mark; empty copy as Today |
| Daily Slack list heading | Warning mark plus **Something wrong or waiting a while, needing your action**; flagged rows lead; tally words update from "still waiting" |

No new `@grade10/ui` export; English strings stay as props where Today already
inlines them (`ui-design.md`).

### Database Schema

None. Lists still read current rows; lifecycle posts are not recorded.

### API Contracts

Additive on the existing reminder still-waiting item: `action` may be
`flagged`, and the row may carry the flag reason the console shows as the
tag. Regenerate API docs and RBAC docs if permissions tables change; grants
for the procedure stay `auction:read` with SQL narrowing.

### Metrics

Counter `auction.reminder.lifecycle` tagged `result`
(`sent` / `failed` / `not_configured`) and `kind` (the six kinds above).
Same gate as `auction.reminder.post`: without a send record, the counter and
the error log are the signal.

## Risks / Trade-offs

- **[Missed go-live or Setup Overdue]** Windowed sweep can miss a start or
  deadline if the pass is down longer than the window → accepted (Q10); the
  morning list and Needs you still show the order.
- **[Duplicate sweep alert]** Two overlapping passes could both see the same
  window → rare; accepted the way a double daily cron is (prior Q38).
- **[Lost waitUntil]** Isolate death after commit and before Slack → miss
  logged only; chosen over an outbox on the bid path (Q10).
- **[Flagged hides a long dispatch from shipping-only staff]** A flagged
  dispatch wait is one flagged row gated by payment processing → matches the
  PRD grant table; Needs you still counts the order for every grant.
- **[Procedure name stays stillWaiting]** Wire name lags the UI words →
  avoids a breaking rename; documented in the contracts comment.

## Migration Plan

1. Land contracts and read widening; deploy worker so Today and Slack lists
   show flags before lifecycle hooks ship if needed.
2. Land lifecycle helpers and hooks; with secrets unset, posts no-op and log
   not configured.
3. No migration. Rollback: unset Slack secrets, or revert the hooks; lists
   fall back by reverting the read.

## Open Questions

None. Q1 to Q10 in `decisions.md` settle channel, once, best effort, copy,
flag membership and overdue-not-on-list.
