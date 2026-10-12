## Context

The spec is [Daily Reminder](specs/grade10-admin/console/daily-reminder/spec.md); motivation is in the proposal. Everything below was read in the application repository `grade10` at the paths given.

- **One status rule** - `orderStatusSql(now)` in `packages/grade10-auction/backend/src/repositories/orderQueue.ts` derives every order status in SQL, and the worklist, its counts and the order page read it. Its wire value for Preparing Shipment is `Processing` (`packages/grade10-auction/contracts/src/winnerOrder.ts`, `orderRules.ts`); the spec's name is a label (`openspec/specs/grade10-admin/auction/post-sale/spec.md` says "Processing now reads Preparing Shipment").
- **One clock** - `orderSinceSql(now)` in the same file is the worklist's Waited. It is `coalesce(<earliest open flag>, <status clock>, order.created_at)`.
- **Grants** - `elevatedProcedure("auction:read")` in `packages/grade10-auction/backend/src/trpc/init.ts` puts the operator in `ctx.session` with `roles`; `hasPermission(roles, grant)` from `@grade10/auth-contracts` answers a grant. `ADMIN_PERMISSIONS` in `packages/grade10-auction/contracts/src/permissions.ts` is pinned to the router by `apps/backend/grade10/auction/test/db/trpc/router.spec.ts`.
- **Needs you** - each product admin frontend exports `use<Domain>NeedsYou()`; `apps/admin/grade10/src/chrome/needsYouRegistry.ts` names them, `chrome/NeedsYou.tsx` probes them through the generic `useRegistryProbes`, and `routes/dashboard.tsx` hands the answers to `pages/dashboard/TodayPage.tsx`. `ConsoleShell.tsx` wraps every route.
- **Sweep** - the auction worker has one cron, `*/5 * * * *` (`apps/backend/grade10/auction/wrangler.jsonc`), running `WORK_LISTS` in `sweeps/pass.ts`. One deployment serves both brands.
- **Slack** - nothing in `packages/` or `apps/` calls Slack. The only mention is a CI notice in `docs/deployment.md`. The worker has no Slack client, token or channel.

## Goals / Non-Goals

**Goals:**

- Two reads, What's New and Still Waiting, defined once and used by the console and by Slack.
- A Still Waiting clock that cannot disagree with the worklist, because it is the worklist's own SQL.
- One post a day that survives a failed send without a duplicate-prone loop.
- A second product adds rows through a hook and a registry entry, with no new column or mechanism.

**Non-Goals:**

- No notification table, read state or bell (decisions Q1).
- No second cron, no new worker binding, no change to `wrangler.jsonc`.
- No change to `orderStatusSql`, the worklist, an order page or the Needs you counts.
- No cross-product aggregation in the Slack post; Auction is the only source today.

## Decisions

### Where it lives

| Concern | Home | Why |
| --- | --- | --- |
| The two reads | `packages/grade10-auction/backend/src/repositories/reminderReads.ts`, composed in `services/reminder/` | Table-oriented SQL beside `orderQueue.ts`; the service owns grant scoping and the HK window (`docs/conventions/backend.md`, "Entrypoints adapt transport; services own behavior; repositories own SQL") |
| Console endpoints | `trpc/routers/reminder.ts` with `whatsNew` and `stillWaiting`, merged in `trpc/router.ts`; grants in `ADMIN_PERMISSIONS` | Two procedures so one list can fail without the other (Q15) |
| Slack message and port | `services/reminder/slackMessage.ts` (pure), `slack/` (the port's fetch implementation), `SlackPort` in `types/ports.ts` | The shape of `stripe/`, `storage/` and `types/ports.ts`; tests bind a fake at the port |
| The daily job | `sweeps/dailyReminder.ts`, one entry in `WORK_LISTS` | "Selecting rows by state and stamping them is what a sweep is" (`code-layout.md`) |
| Send record | `repositories/dailyReminderPosts.ts` and `db/schema/dailyReminderPosts.ts` | One table, below |
| Console addresses | `AUCTION_CONSOLE_PATHS` in `packages/grade10-auction/contracts/src/` (new, beside `adminPaths.ts`) | The worker builds links the console must answer; a test pins it to `ROUTES.dashboard`, `ROUTES.auctionOrder` and `ROUTES.auctionListing` in `apps/admin/grade10/src/surfaces.ts` so the two cannot drift |
| Row model and list block | `packages/frontend-console/src/` beside `registries.ts` | `ReminderRow`, `ReminderAnswer`, `ReminderHook` and a `ReminderColumn` block, as `NeedsYouHook` sits there; the dialog and Today share one block |
| Auction rows in the console | `packages/grade10-auction/admin-frontend/src/features/operations/daily-reminder/` (domain, data, presentation/hooks), published as `./daily-reminder` | Same slice shape as `operations/orders`; the hook resolves a repository through DI, never the tRPC client (`react-clean-architecture`) |
| Entry, dialog, closed mark | `apps/admin/grade10/src/chrome/`: `reminderRegistry.ts`, `DailyReminder.tsx` (provider, mounted in `ConsoleShell`), `ReminderDialog.tsx`, `reminderClosedMark.ts` | Mirrors `needsYouRegistry.ts` and `NeedsYou.tsx`; `recent.ts` is the precedent for a per-operator, storage-tolerant mark |
| Today in three columns | `pages/dashboard/TodayPage.tsx`, fed by `routes/dashboard.tsx` | Props, like `needsYou` |

### The two reads

Both take `now` and an audience. An audience is either `{ roles }` for the console or `channel` for Slack. The channel audience skips grant scoping and never selects a winner column.

**What's New.** Listings with `status IN ('closed','settled')` and `closed_at` in `[start of the previous Hong Kong day, start of today)`. The window comes from `@grade10/date`: `startOfDayAfter(now, -1, zone)` and `startOfDayAfter(now, 0, zone)` with `zone = brandZone("grade10")`, as `email/mailZone.ts` takes the brand's zone. `closed_at` is the effective close (`services/listings/clock.ts`), set in the closing transaction (`services/listings/close.ts`), so it is the instant the lot ended and not the instant the sweep ran. A called-off listing has `canceled_at` and no `closed_at`, so it is not listed.

A listing is sold when its `auction_orders` row exists (`uq_auction_orders_listing_id`); the close writes the order in the same transaction. Sold rows join the order and its current invoice, and read the status with `orderStatusSql(now)` as it stands now (Q26). Unsold rows carry the listing's `slug`. Order: `closed_at desc, id`. No cap in the console (Q23). Test lots are not filtered (Q27).

**Still Waiting.** One statement over `auction_orders` joined to `auction_invoices` on `current_invoice_id`, with:

- `status = orderStatusSql(now)` and `status IN ('Preparing Invoice','Payment Verifying','Processing')`, narrowed to the statuses the caller's grants allow;
- `NOT flagOpenSql`;
- `statusSince <= now - 48 hours`, inclusive;
- order `statusSince asc, id`.

`statusSince` is the status arm of `orderSinceSql`. That function is split in `orderQueue.ts`: the `CASE` becomes an exported `statusSinceSql(now)` and `orderSinceSql` becomes `coalesce(firstOpenFlagAt, statusSinceSql(now), created_at)`. The worklist's output is byte-identical, a test holds it, and the reminder uses the status arm because a flagged order is not listed. Reusing the function, not copying its three arms, is what keeps the reminder from drifting from Needs you (Q11, Q16).

| Row says | Wire status | Clock, as a column or derivation | Present in code |
| --- | --- | --- | --- |
| Send invoice | `Preparing Invoice` | `auction_orders.delivery_address_confirmed_at` | Column, `db/schema/auctionOrders.ts`; nullable but non-null in this status by the `CASE` |
| Check proof | `Payment Verifying` | `coalesce(max(auction_winner_payment_proofs.created_at) over the current invoice, auction_invoices.sent_at)` | Derived, `lastProofAt` in `orderQueue.ts` |
| Dispatch | `Processing` | `auction_invoices.paid_at` of the current invoice | Column; `ck_auction_invoices_payment_state` pairs `status = 'paid'` with a non-null `paid_at` |

Every clock exists. Three points are worth saying plainly:

- The proof clock counts a row whatever its `source` (`winner` or `operator`). The worklist does the same, so the reminder follows it; narrowing to the winner's proofs would disagree with the Waited column.
- The proof clock falls back to the invoice's `sent_at` when a Payment Verifying order has no proof row. The worklist does the same.
- "The payment that paid it" is `paid_at`, the instant the invoice closed as paid. There is no payment-row clock for Preparing Shipment; `lastPaymentAt` in `orderQueue.ts` belongs to Partially Paid.

Days waited is `floor((now - since) / 24h)`: 48 to 71 hours reads 2 days. The console shows the exact duration with the worklist's helper (`ago`); Slack shows whole days. Raised to the human as question 3 of the planning report.

**Grant scoping.** The console procedures sit on `elevatedProcedure("auction:read")` and filter by `hasPermission(session.roles, ...)`. Every What's New page, an order or a listing, opens on `auction:read` (`orders.detail`, `listings.get` in `ADMIN_PERMISSIONS`), so What's New needs the floor and nothing more. Still Waiting is narrowed:

| Action | Grant | Held by |
| --- | --- | --- |
| Send invoice, Check proof | `auction:payment` | `finance`, `treasurer`, `admin` |
| Dispatch | `auction:shipment` | `staff`, `admin` |

The grants table is in `docs/prds/products/grade10-admin/auction/management.md`. The filter is in SQL (an `IN` list of statuses), so a caller who lacks a grant gets an empty list and not a refusal. A caller with no `auction:read` is refused by the rung; the console never calls it, because the registry mounts a hook only for a section the operator can open (as `useRegistryProbes` does for Needs you).

### Hong Kong day

The server derives the window from the instant it is given and `brandZone("grade10")`, and returns `day` (`yyyy-MM-dd`, the Hong Kong date of `now`) with What's New. The browser needs the day before it reads, to look at the closed mark, and takes it from its own clock with `dayValue(new Date(), config.timeZone)`; `config.timeZone` is the console's Hong Kong zone (`apps/admin/grade10/src/brand.ts`). A browser whose clock is wrong can show the dialog on the wrong day. The alternative, reading first and comparing the server's `day`, spends a read on every entry for a mark that mostly says "closed". Kept as is, in Risks.

### The Today page and the dialog

The registry is `Partial<Record<SectionId, ReminderHook>>`, `{ auction: useAuctionReminder }`, probed with the generic `useRegistryProbes` as Needs you is. A `ReminderAnswer` is `{ whatsNew, stillWaiting }`, each `"reading" | "failed" | readonly ReminderRow[]`. A row is `{ key, product, code, title, outcome | action, status?, winner?, since?, href }`; `product` is the group Today draws, Auction first.

- **Reads** - `useAuctionReminder` runs two `useQuery`s with the shared `LIST_QUERY`, `refetchOnWindowFocus: true` and no interval, as `useOrdersNeedingAction.ts` does (Q28). Refresh bumps the provider's `generation`, the same remount Needs you uses.
- **Dialog on entry** - `DailyReminder.tsx` sits in `ConsoleShell` and reads the closed mark once, at mount. With today's mark set it renders nothing and reads nothing. Without it, it mounts the registry's probes, which read through react-query under keys the Today route's probes share, so a dialog and an open Today cost one read. The dialog mounts, as a boolean the caller holds (`docs/conventions/dialogs.md`, "nothing, but it has content"), when at least one list that loaded has a row. A failed list shows its failure inside the dialog beside the list that loaded. A failure with no row in the other list opens nothing until the human answers raised question 4; Today shows the failure. Navigation inside the shell never re-evaluates: the mount is the entry (Q24).
- **Closing** writes today's day under `grade10.console.dailyReminder.<operatorId>` in `localStorage`. When `localStorage` throws, the same value goes to `sessionStorage`; when that throws too, to a module variable, so the dialog opens once per page load. Reads and writes are wrapped in `try/catch`, as in `chrome/recent.ts`, and the page renders without them.
- **Today** - `TodayPage` takes a `reminder` prop and renders three columns: `ReminderColumn` for What's New, for Still Waiting, then the existing Needs you section. The Approvals card is today a card inside the Needs you grid (`TodayPage.tsx`, the `approvals ? <ApprovalsCard …>` child). The change lifts it into its own section under the columns beside Recent and All sections, as decisions Q17 requires; the Needs you cards, counts, links and the "All clear" card are unchanged. Below the narrow breakpoint the columns stack with Needs you last (`useNarrow` already exists in `frontend-console`).

### The Slack post

**Trigger.** No new cron. `*/5 * * * *` fires at 00:00 UTC, which is 08:00 in Hong Kong (Hong Kong keeps no summer time), so the first pass of the day already runs at 08:00. A new work list `dailyReminder` goes into `WORK_LISTS`, after `canceledCampaignListings` and before the mail fanouts so a slow fanout cannot delay it. It is `kind: "routine"` and takes no budget; `SweepLimits` gains it in the exclusion list beside `orphanedObjects`, `prunedEvents` and `prunedMailLogs`. The order test is updated. A dedicated `0 0 * * *` cron was rejected: the auction entrypoint dispatches nothing by cron today (`entrypoint.ts` runs one pass), a second cron would add a branch graded by `check:libs` in both directions, and the five-minute pass would still have to retry a failed send.

**One row a day is the fact.** The send record is a due row (`docs/conventions/backend.md`, "A guaranteed side effect is a due row"); the day is its key, so two passes cannot create two. One pass:

1. `now < 08:00 on today's Hong Kong date` - return 0.
2. Mark every `pending` row with an earlier `day` as `lapsed`, log it as an error with its attempts and last error, count it. It is never posted (Q29).
3. Insert today's row (`pending`, `next_attempt_at = now`) `ON CONFLICT DO NOTHING`.
4. Claim it as `sweeps/claim.ts` claims its rows (`.for("update", { of, skipLocked: true })`, which the auction uses throughout; it builds no `createWorkLists` instance): `state = 'pending' AND next_attempt_at <= now`, `attempts + 1`, `next_attempt_at` moved out by one rung of `@grade10/postgres/ladder` (`{ baseSeconds: 300, maxSeconds: 1800 }`, no attempt cap; the day ending is the cap).
5. In the claiming transaction, read both lists with the channel audience. Both empty - set `empty`, count, post nothing. Otherwise build the message and call the port. The call carries the 10 second deadline (`fetchWithDeadline`, `VENDOR_DEADLINE_MS`), as the stock release's inventory call does under its lock.
6. Success - `posted`, `posted_at`, `slack_ts`. Failure - keep `pending`, store the error code, raise `next_attempt_at` to the later of the ladder and `Retry-After`, log an error naming the day, attempt and Slack error, count it.

The lists are recomputed on every attempt, not frozen in the row: a retry at 10:00 must not name an order dispatched at 09:00. Q22 and Q29 are about the message, not its bytes.

**Unconfigured.** When both `SLACK_BOT_TOKEN` and `SLACK_REMINDER_CHANNEL` are unset (`isSet` from `@grade10/utils/config`), the list returns 0, writes no row and logs a warning once per UTC day on the 00:00 UTC pass. When exactly one is set, `requireSet` throws by name inside the claim; the list catches it with `rowError` and carries on, so a half-set environment cannot stop the pass that closes lots, and the error repeats each retry until the day lapses.

**Slack errors.** From Slack's documented Web API, not verified in this repository:

| Answer | Treated as |
| --- | --- |
| HTTP 429 with `Retry-After`, or `ratelimited` | Retry no sooner than `Retry-After` seconds |
| Network error, deadline, HTTP 5xx, `internal_error`, `service_unavailable`, `fatal_error` | Retry on the ladder |
| `invalid_auth`, `not_authed`, `token_revoked`, `account_inactive` | Configuration. Same ladder, logged with `reason: invalid_token` |
| `channel_not_found`, `not_in_channel`, `is_archived` | Configuration. Same ladder, logged with `reason: channel` |
| Any other `ok: false` | Retry on the ladder, error code logged |

Permanent-looking errors keep retrying through the day because an operator who fixes the token at 09:30 expects that day's post (Q29). The backend convention of parking a permanent refusal is met by `lapsed` at the end of the day, counted and logged as an error. No Slack error is ever swallowed.

**At-least-once.** `chat.postMessage` has no idempotency key. If the worker stops after Slack accepts the post and before the transaction commits, the row is still `pending` and the next pass posts again, within five minutes. Q22 says the day's message never posts twice; this window is the part no design here can close. Raised to the human as question 1 of the planning report.

**The message.** `chat.postMessage` with `channel`, `text` (counts only, the notification fallback), `blocks`, `unfurl_links: false`, `unfurl_media: false`. Blocks: one header (the Hong Kong weekday and day), then per non-empty list a heading section, one section per row, and a context line `N more on Today` linked to Today when the list has more than 10. One block per row keeps the post under Slack's 3,000-character section limit even after escaping, and a full post is at most 25 blocks against the limit of 50.

Row text: `<link|CODE> Title` with the title cut to 60 characters, then ` - Sold` or ` - Unsold` for What's New and ` - Send invoice - 3 days` for Still Waiting. `&`, `<` and `>` in a title are escaped as Slack requires. The message is built by a pure function from the rows and the console origin, and takes no winner field at all: the channel audience does not select one.

**Links.** `runningAdminUrl(brand, deployEnv, env.E2E_ADMIN_ORIGIN)` from `@grade10/app-env` (`sites.ts`, used by `packages/worker/src/serviceApp.ts`), joined with `AUCTION_CONSOLE_PATHS`. Staging posts staging links. `BRAND` and `DEPLOY_ENV` already sit in `wrangler.jsonc` vars.

**Composition.** `deps.ts` `sweepDeps(env, events)` builds `slack: SlackPort | null` from the two secrets and hands `consoleOrigin` and `zone` alongside, so the list takes ports and the test lane binds a fake (`apps/backend/grade10/auction/test/helpers/fakeSlack.ts`, beside `fakeStripe.ts`).

### Environment and secrets

| Name | Where | Declared |
| --- | --- | --- |
| `SLACK_BOT_TOKEN` | `.dev.vars` locally, `wrangler secret` per env via `pnpm run secrets` | `AUCTION_SECRETS` in `packages/grade10-auction/backend/src/secrets.ts`, `optional: "an environment with no Slack workspace posts nothing; the job logs that on every 00:00 UTC pass"` |
| `SLACK_REMINDER_CHANNEL` | the same | the same, same reason; a channel id such as `C0123456789`, never a name |

The apps' `src/secrets.ts` re-exports `AUCTION_SECRETS`, so the app changes nothing. Neither is read by the console. `pnpm run secrets --check` (the deploy workflow) skips optional entries; the unconfigured warning is the signal.

### Database Schema

A table is needed. "Once a day" and "never on the next day" are facts across invocations, and nothing existing holds them: `storage_cursors` is a resume position, not a record, and posting from a bare cron would repeat on every retry tick. One row per Hong Kong day, in `packages/grade10-auction/backend/src/db/schema/dailyReminderPosts.ts`, `auction.daily_reminder_posts`:

| Column | Type | Null | Default | Note |
| --- | --- | --- | --- | --- |
| `day` | `text` | no | none | Primary key. Hong Kong date, `yyyy-MM-dd` |
| `state` | `text` | no | `'pending'` | Check: `pending`, `posted`, `empty`, `lapsed` |
| `attempts` | `integer` | no | `0` | |
| `next_attempt_at` | `msTimestamp` | no | none | Claim moves it out by a ladder rung |
| `posted_at` | `msTimestamp` | yes | none | Set with `posted` |
| `slack_ts` | `text` | yes | none | Slack's message id, for support |
| `last_error` | `text` | yes | none | A Slack error code or `timeout`; never a title or a name |
| `created_at` | `msTimestamp` | no | `defaultNow()` | |

Check `ck_daily_reminder_posts_posted`: `(state = 'posted') = (posted_at IS NOT NULL)`, the shape of `ck_auction_invoices_payment_state`. One row a day, so no index beyond the key and no pruning. The authoritative facts are the listings and orders; the row holds only whether the day's message went out. Migration `0026_*` in `apps/backend/grade10/auction/src/db/migrations/`, generated with `pnpm run db:drizzle:generate`; a new table needs no `-- lock:` line.

### API Contracts

Two additive authenticated reads in `@grade10/auction-contracts` (`operator-order` beside the queue schemas):

- `reminder.whatsNew` - input `{}`; output `{ day, items: [{ listingId, code, title, slug, closedAt, outcome: "sold" | "unsold", order: { id, status, winner: string } | null }] }`.
- `reminder.stillWaiting` - input `{}`; output `{ items: [{ orderId, code, title, action: "sendInvoice" | "reviewProof" | "dispatch", status, winner: string, since }] }`.

`winner` is the name the worklist row shows (`operatorOrderRow` in `services/orders/queue.ts`), with the same fallback. `ADMIN_PERMISSIONS` gains `"reminder.whatsNew": ["auction:read"]` and `"reminder.stillWaiting": ["auction:read"]`. Neither declares `auditDetails`: like `orders.queue` they name winners, as the worklist row does, and write no audit row. `pnpm --dir packages/api-docs run generate` and `generate:rbac-docs` are re-run.

### Metrics

One counter, `auction.reminder.post`, tagged `result` (`posted`, `retry`, `empty`, `lapsed`, `unconfigured`). It passes the gate in `docs/conventions/datadog-metrics.md`: a daily job's failure is silence, which logs cannot alert on; a monitor on `posted` missing for 25 hours is the signal; no existing metric covers it (`auction.sweep.rows` counts moved rows per list per pass and cannot say that a day's post failed). The monitor itself is a follow-up in `docs/observability/datadog/monitors/`, not in this change. No distribution.

## Risks / Trade-offs

- **[A duplicate post after a lost commit]** Slack has no idempotency key → the post and the `posted` stamp share one transaction and the claim lock; the window is the commit after Slack's answer. Accepted, raised as question 1; the alternative, stamping before sending, trades a duplicate for a post that never happens, and that is worse for a reminder.
- **[The post lands up to five minutes after 08:00]** The pass is a fixed cadence → the 00:00 UTC tick is a pass of its own, so the first attempt is on time; only a retry waits for the next tick.
- **[A pass that runs long delays the post]** Lists run in order → `dailyReminder` sits ahead of the mail fanouts, and a test pins the order.
- **[The sweep's transaction holds the day's row across a Slack call]** Ten seconds at most (`VENDOR_DEADLINE_MS`) and one row; no other list reads it.
- **[Clock disagreement between server and browser on the day]** The mark uses the browser's clock → the console already trusts it for `useNow`; the worst case is one extra or one missed dialog.
- **[Late close commit]** A listing whose close commits after 08:00 but whose effective close was yesterday is missing from that day's Slack post and present in the console after the commit → accepted; the sweep commits a close within one pass.
- **[`closed_at` has no index]** What's New filters `auction_listings` by `status` and `closed_at` → the table holds listings, not bids; a repository test with `countStatements` pins one statement, and an index waits for evidence.
- **[A large day]** The console shows every row (Q23) → one statement and a response of a few hundred rows at most; Slack stops at 10 per list.
- **[Drift between the reminder and the worklist]** → the status and the clocks are the worklist's functions, and a repository test seeds one order per status and asserts the reminder is a subset of the Needs action segment (Q16).
- **[Single source today]** The Slack job sits in the auction worker → when Inventory or Vault add rows, the message needs one composer over several products, and that move is that change's.

## Migration Plan

1. Merge the store change, bump the submodule.
2. Ship the migration `0026` (a new table). `docs/deployment.md` applies it to staging on merge and to production through the `Migrate` workflow, before the worker ships.
3. Deploy the worker. With no Slack secret set nothing posts and the 00:00 UTC pass logs the warning.
4. Set `SLACK_BOT_TOKEN` and `SLACK_REMINDER_CHANNEL` on staging, invite the bot to the channel, and watch the next 08:00 post.
5. Set them on production.

Rollback: unset the secrets to stop posts; drop nothing. The console lists have no server state to unwind.

## Open Questions

- The Slack app's scopes (`chat:write`, and `chat:write.public` if the bot is not invited) are the operator's to grant when the app is created; no task depends on them.
