## Context

The spec is [Daily Reminder](specs/grade10-admin/console/daily-reminder/spec.md); motivation is in the proposal. Everything below was read in the application repository `grade10` at the paths given.

- **One status rule** - `orderStatusSql(now)` in `packages/grade10-auction/backend/src/repositories/orderQueue.ts` derives every order status in SQL, and the worklist, its counts and the order page read it. Its wire value for Preparing Shipment is `Processing` (`packages/grade10-auction/contracts/src/winnerOrder.ts`, `orderRules.ts`); the spec's name is a label (`openspec/specs/grade10-admin/auction/post-sale/spec.md` says "Processing now reads Preparing Shipment").
- **One clock** - `orderSinceSql(now)` in the same file is the worklist's Waited: `coalesce(firstOpenFlagAt, CASE <status> …, order.created_at)`. A flagged order counts from its earliest open flag; the reminder must not (Q31).
- **Grants** - `elevatedProcedure("auction:read")` in `packages/grade10-auction/backend/src/trpc/init.ts` puts the operator in `ctx.session` with `roles`; `hasPermission(roles, grant)` from `@grade10/auth-contracts` answers a grant. `ADMIN_PERMISSIONS` in `packages/grade10-auction/contracts/src/permissions.ts` is pinned to the router by `apps/backend/grade10/auction/test/db/trpc/router.spec.ts`. `listings.get`, `orders.detail` and `orders.queue` are all `auction:read` there.
- **Needs you** - each product admin frontend exports `use<Domain>NeedsYou()`; `apps/admin/grade10/src/chrome/needsYouRegistry.ts` names them, `chrome/NeedsYou.tsx` probes the sections the operator can open through `useRegistryProbes`, and `routes/dashboard.tsx` hands the answers to `pages/dashboard/TodayPage.tsx`.
- **Console shell** - `root.tsx` renders `ConsoleShell` once around the router's `Outlet`, so it persists across in-app navigation and mounts again only on a page load or when the gate lets a newly signed-in operator through. `ConsoleShell` wraps `Console` in `OperatorGate`, which shows the sign-in panel until there is a session (`packages/grade10-auth/admin-frontend/.../OperatorGate.tsx`). The only bare surface is `pos-test` (`surfaces.ts`, `BARE_SURFACES`).
- **Sign-out** - the console signs out through `useSignOut()` from `@grade10/auth-frontend/sign-out` (`run()` resolves `true` on success). In `grade10` it is wired in `apps/admin/grade10/src/routes/settings.tsx` (`onSignOut={signOut.run}`, "Sign out of this browser" in `SettingsPage.tsx`); `NoAccessPanel` uses it for an operator with no access, who gets no dialog. Nothing clears browser storage at sign-out today: `chrome/recent.ts` keeps its per-operator list across it.
- **Cron** - the auction worker has one cron, `*/5 * * * *`, with `triggers` declared once at the top of `apps/backend/grade10/auction/wrangler.jsonc` and inherited by staging and production. `scheduled` in `packages/grade10-auction/backend/src/entrypoint.ts` runs `runSweepPass` for whatever cron fired and names no cron expression. `runSweepPass` runs `WORK_LISTS` in order, and a list that throws aborts the pass (`packages/postgres/src/sweepPass.ts`).
- **Slack** - nothing in `packages/` or `apps/` calls Slack. The only mention is a CI notice in `docs/deployment.md`. The worker has no Slack client, token or channel.

## Goals / Non-Goals

**Goals:**

- Two reads, What's New and Still Waiting, defined once and used by the console and by Slack.
- A Still Waiting clock that cannot disagree with the worklist, because it is the worklist's own SQL.
- One post a day, tried once, whose failure is loud.
- A second product adds rows through a hook and a registry entry, with no new column or mechanism.

**Non-Goals:**

- No notification table, read state or bell (Q1), and no record of a send (Q22): no table, no migration.
- No retry and no late post (Q22, Q29).
- No change to `orderStatusSql`, the worklist, an order page or the Needs you counts.
- No cross-product aggregation in the Slack post: each product posts its own message to its own channel (Q51), and Auction is the only one that posts today.

## Decisions

### Where it lives

| Concern | Home | Why |
| --- | --- | --- |
| The two reads | `packages/grade10-auction/backend/src/repositories/reminderReads.ts`, composed in `services/reminder/` | Table-oriented SQL beside `orderQueue.ts`; the service owns grant scoping and the HK window (`docs/conventions/backend.md`, "Entrypoints adapt transport; services own behavior; repositories own SQL") |
| Console endpoints | `trpc/routers/reminder.ts` with `whatsNew` and `stillWaiting`, merged in `trpc/router.ts`; grants in `ADMIN_PERMISSIONS` | Two procedures so one list can fail without the other (Q15) |
| Slack message and port | `@grade10/slack` (`packages/slack`): `SlackPort`, `slackClient`, the text helpers and `dailyReminderMessage`, shared by every product's worker; `services/reminder/slackMessage.ts` maps auction's lists onto it; `types/ports.ts` re-exports the port | The shape of `@grade10/webpush`: one client and message shape per vendor, each worker composing it from its own secrets (Q51); tests bind a fake at the port |
| The daily job | `services/reminder/post.ts` (`postDailyReminder`), run by its own cron in `entrypoint.ts` | Not a work list: it claims no row and has no state to select by, see Trigger |
| Console addresses | `AUCTION_CONSOLE_PATHS` in `packages/grade10-auction/contracts/src/` (new, beside `adminPaths.ts`) | The worker builds links the console must answer; a test pins it to `ROUTES.dashboard`, `ROUTES.auctionOrder` and `ROUTES.auctionListing` in `apps/admin/grade10/src/surfaces.ts` so the two cannot drift |
| Row model and list block | `packages/frontend-console/src/` beside `registries.ts` | `ReminderRow`, `ReminderAnswer`, `ReminderHook` and a `ReminderColumn` block, as `NeedsYouHook` sits there; the dialog and Today share one block |
| Auction rows in the console | `packages/grade10-auction/admin-frontend/src/features/operations/daily-reminder/` (domain, data, presentation/hooks), published as `./daily-reminder` | Same slice shape as `operations/orders`; the hook resolves a repository through DI, never the tRPC client (`react-clean-architecture`) |
| Entry, dialog, closed mark | `apps/admin/grade10/src/chrome/`: `reminderRegistry.ts`, `DailyReminder.tsx` (mounted in `ConsoleShell`), `ReminderDialog.tsx`, `reminderClosedMark.ts` | Mirrors `needsYouRegistry.ts` and `NeedsYou.tsx`; `recent.ts` is the precedent for a per-operator, storage-tolerant record |
| Today in three columns | `pages/dashboard/TodayPage.tsx`, fed by `routes/dashboard.tsx` | Props, like `needsYou` |

### The two reads

Both take `now` and an audience. An audience is either `{ roles }` for the console or `channel` for Slack. The channel audience skips grant scoping and never selects a winner column.

**What's New.** Listings with `status IN ('closed','settled')` and `closed_at` in `[start of the previous Hong Kong day, start of today)`. The window comes from `@grade10/date`: `startOfDayAfter(now, -1, zone)` and `startOfDayAfter(now, 0, zone)` (`packages/date/src/arithmetic.ts`) with `zone = brandZone("grade10")` (`@grade10/app-env`, `zone.ts`), as `email/mailZone.ts` takes the brand's zone. `closed_at` is the effective close (`services/listings/clock.ts`), written in the closing transaction (`services/listings/close.ts`, `closeListing`), so it is the instant the lot ended and not the instant the sweep ran.

- **Called off** - `cancel` in `services/admin/admin.ts` refuses a lot past its effective close and writes `status = 'canceled'`, `canceled_at` and no `closed_at`, so the `status` and `closed_at` predicates leave it out (Q34).
- **No bids** - `closeListing` takes the same path with no `current_top_bid_id`: it writes `status = 'closed'` and `closed_at` and issues no order. The listing is listed, Unsold (Q34).
- **Sold or not** - a listing is sold when its `auction_orders` row exists (`uq_auction_orders_listing_id`); the close writes the order in the same transaction. Sold rows join the order and its current invoice, and read the status with `orderStatusSql(now)` as it stands now (Q26). Unsold rows carry the listing's `slug`.
- **Order** - `closed_at desc, listing_code asc, id`. Equal closes order by listing code (Q42). No cap in the console (Q23). Test lots are not filtered (Q27).

**Still Waiting.** One statement over `auction_orders` joined to `auction_invoices` on `current_invoice_id`, with:

- `status = orderStatusSql(now)` and `status IN ('Preparing Invoice','Payment Verifying','Processing')`, narrowed to the statuses the caller's grants allow;
- no flag predicate: a flagged order is listed by its own wait (Q31);
- `statusSince <= now - 48 hours`, inclusive (Q12);
- order `statusSince asc, listing_code asc, id` (Q36).

`statusSince` is the status arm of `orderSinceSql`. That function is split in `orderQueue.ts`: the `CASE` becomes an exported `statusSinceSql(now)` and `orderSinceSql` becomes `coalesce(firstOpenFlagAt, statusSinceSql(now), created_at)`. The worklist's output is byte-identical, a test holds it, and the reminder uses the status arm because a flag must not start a second clock. Reusing the function, not copying its three arms, is what keeps the reminder from drifting from Needs you (Q11, Q16). A flagged order is in Needs action whatever its status (`segmentSql` puts `flagOpenSql` first), so every row stays inside Needs action.

| Row says | Wire status | Clock, as a column or derivation | Present in code |
| --- | --- | --- | --- |
| Send invoice | `Preparing Invoice` | `auction_orders.delivery_address_confirmed_at` | Column, `db/schema/auctionOrders.ts`; nullable but non-null in this status by the `CASE` |
| Check proof | `Payment Verifying` | `coalesce(max(auction_winner_payment_proofs.created_at) over the current invoice, auction_invoices.sent_at)` | Derived, `lastProofAt` in `orderQueue.ts` |
| Dispatch | `Processing` | `auction_invoices.paid_at` of the current invoice | Column; `ck_auction_invoices_payment_state` pairs `status = 'paid'` with a non-null `paid_at` |

Every clock exists. Three points are worth saying plainly:

- The proof clock counts a row whatever its `source` (`winner` or `operator`). The worklist does the same, so the reminder follows it; narrowing to the winner's proofs would disagree with the Waited column.
- The proof clock falls back to the invoice's `sent_at` when a Payment Verifying order has no proof row. The worklist does the same.
- "The payment that paid it" is `paid_at`, the instant the invoice closed as paid. There is no payment-row clock for Preparing Shipment; `lastPaymentAt` in `orderQueue.ts` belongs to Partially Paid.

**Wait shown.** The server returns `since`; the console shows `duration(now - since)` from `packages/frontend-console/src/time.ts` (two largest units, `3d 5h`), which prints `5d` on a whole day and no `0h` (Q43, Q46). The worklist's `ago` is not used: it answers "Yesterday" or "9 Oct" past a day. Slack shows `floor((now - since) / 24h)` whole days, so 48 to 71 hours reads 2 days (Q36). No `ui-design.md` exists for this change; the `3d 5h` form is the helper's, settled in Q43.

**Grant scoping.** The console procedures sit on `elevatedProcedure("auction:read")` and filter by `hasPermission(session.roles, ...)`. Every What's New page, an order or a listing, opens on `auction:read`, so What's New, unsold rows included, needs the floor and nothing more (Q34). Still Waiting is narrowed:

| Action | Grant | Held by |
| --- | --- | --- |
| Send invoice, Check proof | `auction:payment` | `finance`, `treasurer`, `admin` |
| Dispatch | `auction:shipment` | `staff`, `admin` |

The grants table is in `docs/prds/products/grade10-admin/auction/management.md`. The filter is in SQL (an `IN` list of statuses), so a caller who lacks a grant gets an empty list and not a refusal. A caller with no `auction:read` is refused by the rung (Q35); the console never calls it, because the registry mounts a hook only for a section the operator can open (`NeedsYouProvider` in `chrome/NeedsYou.tsx` hands `useRegistryProbes` only the `sections` the operator can open).

### Hong Kong day

The server derives the window from the instant it is given and `brandZone("grade10")`, and returns `day` (`yyyy-MM-dd`, the Hong Kong date of `now`) with What's New. The browser needs the day before it reads, to look at the closed mark, and takes it from its own clock with `dayValue(new Date(), config.timeZone)` (`packages/date/src/calendar-day.ts`); `config.timeZone` is the console's Hong Kong zone (`apps/admin/grade10/src/brand.ts`). A browser whose clock is wrong can show the dialog on the wrong day. Reading first and comparing the server's `day` would spend a read on every entry for a mark that mostly says "closed". Kept as is, in Risks.

### The dialog and the closed mark

An entry is the mount of `DailyReminder` (Q32): a page load, or the gate letting a newly signed-in operator through, since it renders inside `OperatorGate`. Navigation inside the shell never remounts it, a tab return does not, and a deep link while signed out mounts it after sign-in on the page the link names.

- **Mount** - `DailyReminder.tsx` sits in `ConsoleShell` inside the gate and reads the closed mark once. With today's mark set it renders nothing and reads nothing. Without it, it mounts the entry probes for the sections the operator can open and waits for both answers.
- **Own reads** - the entry probes use their own query keys with no refetch on focus and no interval, separate from Today's. The dialog is a snapshot of the morning that reads when it opens (Q39), so a tab return or Refresh on Today never changes it. The cost is that a Today load right after the dialog reads each list twice; accepted over a shared key that would move the open dialog. The probes unmount once the entry is decided (no dialog, or the dialog closed).
- **Deciding** - the dialog opens, as a boolean the caller holds (`docs/conventions/dialogs.md`, "nothing, but it has content"), when at least one list that loaded has a row or a list failed (Q35). A list that loaded with no row is left out; a failed list shows its failure beside the other, with a Retry that reads that list again. An entry that opens nothing sets nothing, so a later entry that has rows opens it (Q40).
- **Closing** - the dialog's `onOpenChange(false)` covers the close control, Escape and a click outside; following a row is a link click that also calls the close. Each writes today's Hong Kong day under `grade10.console.dailyReminder.<operatorId>` in `localStorage` (Q33).
- **Storage** - reads and writes are wrapped in `try/catch`, as in `chrome/recent.ts`, and the page renders without them. When `localStorage` throws, the mark lives in a module variable: the dialog opens once per page load (Q2). There is no `sessionStorage` step, since it survives a reload and Q2 asks for once per page load.
- **Sign-out** - `reminderClosedMark.ts` exports `forgetClosedMark(operatorId)`. `routes/settings.tsx` wraps the command it already has: `onSignOut={async () => { const signedOut = await signOut.run(); if (signedOut) forgetClosedMark(operator.id); return signedOut; }}`. That is the one place `grade10` signs out. A session that ends any other way (expiry, "Sign out everywhere", another device) leaves the mark until the Hong Kong day ends (Q44). Another browser keeps its own mark because the key is local to the browser.

### Today

The registry is `Partial<Record<SectionId, ReminderHook>>`, `{ auction: useAuctionReminder }`, probed with the generic `useRegistryProbes` as Needs you is. A `ReminderAnswer` is `{ whatsNew, stillWaiting }`, each `"reading" | "failed" | readonly ReminderRow[]`. A row is `{ key, product, code, title, outcome | action, status?, winner?, since?, href }`; `product` is the group Today draws, Auction first.

- **Reads** - `useAuctionReminder` runs two `useQuery`s with the shared `LIST_QUERY`, `refetchOnWindowFocus: true` and no interval, as `useOrdersNeedingAction.ts` does (Q28). Today's Refresh bumps the provider's `generation`, the remount Needs you uses, so all three columns read again (Q39).
- **Columns** - `TodayPage` takes a `reminder` prop and renders `ReminderColumn` for What's New, for Still Waiting, then the existing Needs you section, each always shown (Q25). A failed list shows the notice and Retry in its column (Q35), as Needs you shows `ReadFailureNotice` today. Below the narrow breakpoint the columns stack with Needs you last (`useNarrow` already exists in `frontend-console`).
- **Fold and scroll** - one list block, `ReminderGroups` in `packages/frontend-console`, draws both places with a `layout` (Q48). On Today (`collapsible`) the first group with rows starts opened and each other group is one line with its count and a chevron button carrying `aria-expanded`; one group is open at a time in a column (Q49). The three columns stretch to one height, and the opened group's rows take the rest of the column as a flex item with a floor of about five and a half rows, scrolling inside it with the edge that has more beyond it faded (Q50). Store, Consignment, Inventory and Appointments stand as empty groups that say Nothing yet (Q50). In the dialog (`scroll`) each group's rows sit in a box with a fixed `max-height` of about four and a half rows and `overflow-y: auto`, so the dialog keeps its size and its close control stays in view.
- **Approvals** - today `ApprovalsCard` is a child of the Needs you grid (`TodayPage.tsx`, the `approvals ? <ApprovalsCard …>` child). It moves into its own section under the three columns beside Recent and All sections (Q41); the card and its props are unchanged. The total pill ("approvals included") and `todaySummary`'s sentence keep counting Approvals (Q45).

### The Slack post

**Trigger.** A dedicated cron, `0 0 * * *`, which is 08:00 in Hong Kong (Hong Kong keeps no summer time), beside the existing `*/5 * * * *` in `triggers.crons`. `scheduled` branches on `controller.cron`: the reminder cron runs `postDailyReminder` and nothing else, the five-minute cron runs the pass, and any other cron fails the run, so a cron added to `wrangler.jsonc` without a branch is caught at once. Both expressions become literals in the entrypoint, so `scripts/checks/check-crons.mjs` starts grading the worker in both directions (today it reports the worker as one that "runs one pass for whatever fires"). Loyalty is the precedent for two named crons (`NIGHTLY_CRON`, `DRAIN_CRON` in `packages/loyalty/backend/src/entrypoint.ts`).

Chosen over a work list in the existing pass, gated to 00:00 UTC:

| | Dedicated cron | Work list, gated to the first pass after 00:00 UTC |
| --- | --- | --- |
| Fires | Once a day by construction | Once per `*/5` tick inside a five-minute window the list must test |
| Late pass | Not affected by the sweep's duration | An earlier list that overruns past the window loses the day; a throwing earlier list aborts the pass before it (`sweepPass.ts`) |
| Needs | A cron line, a branch, a literal pinned by `check-crons` | A clock predicate in a list that otherwise only selects rows by state, which `code-layout.md` calls what a sweep is |
| State | None | None |

The window test makes a list lie about what it is, and its silent failure is the one the owner chose to avoid (a lost message with no sign). The cron is one line and a branch with no clock arithmetic.

**One attempt.** `postDailyReminder(db, deps, clock)`:

1. `deps.slack` is null when `SLACK_BOT_TOKEN` or `SLACK_ALERTS_CHANNEL` is unset (`isSet` from `@grade10/utils/config`). Log a warning that the reminder is not configured, count `not_configured`, return (Q37).
2. Read both lists with the channel audience for `now`. A database error propagates and fails the invocation visibly; there is no retry.
3. Both empty - count `empty`, post nothing.
4. Build the message and call the port with the 10 second deadline (`fetchWithDeadline`, `VENDOR_DEADLINE_MS` in `packages/utils/src/deadline.ts`).
5. Success - count `sent`. Any failure (network, deadline, non-2xx, `ok: false`) - `console.error` with the Hong Kong day and Slack's error code or `timeout`, count `failed`, and end. Nothing is stored, so nothing can post the day's message later (Q22, Q29).

**A repeat is accepted (Q38).** `chat.postMessage` has no idempotency key. If the cron is delivered twice, or the invocation dies after Slack accepts the post and the platform runs it again, the channel sees the message twice. Nothing in the repository guards it; whether Cloudflare re-runs a failed cron invocation is not verified here.

**The message.** `chat.postMessage` with `channel`, `text` (counts only, the notification fallback), `blocks`, `unfurl_links: false`, `unfurl_media: false` (Q37). Blocks: one header naming the product and the Hong Kong weekday and day, as `Auction daily reminder · Mon 12 Oct` (Q51), then per list that has a row a heading section, one section holding its rows one per line, and a context line `N more on Today` linked to Today when the list has more than 10. A list with no row has no heading. Ten rows of at most about 200 characters each keep a section under Slack's 3,000-character limit after escaping, and a full post is a handful of blocks against the limit of 50.

Row text: `<link|CODE> Title` with a title over 60 characters cut to its first 59 and `…`, then ` - Sold` or ` - Unsold` for What's New and ` - Send invoice - 3 days` for Still Waiting. `&`, `<` and `>` in a title are escaped as Slack requires. The message is built by a pure function from the rows and the console origin, and takes no winner field at all: the channel audience does not select one. Slack's API is from its documented Web API and is not verified in this repository.

**Links.** `runningAdminUrl(brand, deployEnv, env.E2E_ADMIN_ORIGIN)` from `@grade10/app-env` (`sites.ts`), joined with `AUCTION_CONSOLE_PATHS`. Staging posts staging links. `BRAND` and `DEPLOY_ENV` already sit in `wrangler.jsonc` vars.

**Composition.** `deps.ts` gains `reminderDeps(env)` building `slack: SlackPort | null` from the two secrets with `consoleOrigin` and `zone`; the test lane binds a fake (`apps/backend/grade10/auction/test/helpers/fakeSlack.ts`, beside `fakeStripe.ts`). The entrypoint's seam follows `sweepOnSchedule`: a function takes the post as an argument so `test/worker/scheduled.spec.ts` can drive the dispatch without a database.

### Environment and secrets

| Name | Where | Declared |
| --- | --- | --- |
| `SLACK_BOT_TOKEN` | `.dev.vars` locally, `wrangler secret` per env via `pnpm run secrets` | `AUCTION_SECRETS` in `packages/grade10-auction/backend/src/secrets.ts`, `optional: "an environment with no Slack workspace posts nothing; the daily trigger logs that it is not configured"` |
| `SLACK_ALERTS_CHANNEL` | the same | the same, same reason; a channel id such as `C0123456789`, never a name |

The apps' `src/secrets.ts` re-exports `AUCTION_SECRETS`, so the app changes nothing. Neither is read by the console. `pnpm run secrets --check` (the deploy workflow) skips optional entries; the daily warning is the signal.

### Database Schema

None. Both lists read current listings and orders; nothing records a send (Q1, Q22). No migration.

### API Contracts

Two additive authenticated reads in `@grade10/auction-contracts` (`operator-order` beside the queue schemas):

- `reminder.whatsNew` - input `{}`; output `{ day, items: [{ listingId, code, title, slug, closedAt, outcome: "sold" | "unsold", order: { id, status, winner: string } | null }] }`.
- `reminder.stillWaiting` - input `{}`; output `{ items: [{ orderId, code, title, action: "sendInvoice" | "reviewProof" | "dispatch", status, winner: string, since }] }`.

`winner` is the name the worklist row shows (`operatorOrderRow` in `services/orders/queue.ts`), with the same fallback. `ADMIN_PERMISSIONS` gains `"reminder.whatsNew": ["auction:read"]` and `"reminder.stillWaiting": ["auction:read"]`. Neither declares `auditDetails`: like `orders.queue` they name winners, as the worklist row does, and write no audit row. `pnpm --dir packages/api-docs run generate` and `generate:rbac-docs` are re-run.

### Metrics

One counter, `auction.reminder.post`, tagged `result` (`sent`, `failed`, `empty`, `not_configured`). It passes the gate in `docs/conventions/datadog-metrics.md`: with no record of a send, a daily job's failure is only a log line, and a monitor on `failed` and on no `sent` or `empty` for 25 hours is the signal; no existing metric covers it (`auction.sweep.rows` counts moved rows per list and cannot say that a day's post failed). The monitor is a follow-up in `docs/observability/datadog/monitors/`, not in this change. No distribution.

## Risks / Trade-offs

- **[A lost day]** One attempt, no record: a Slack outage at 08:00 loses that day's message, and the log line and `failed` count are the only sign → chosen by the owner (Q22, Q29).
- **[A duplicate post]** Slack has no idempotency key and nothing records the send → accepted (Q38); stamping before posting would trade it for a post that never happens.
- **[Clock disagreement between server and browser on the day]** The mark uses the browser's clock → the console already trusts it for `useNow`; the worst case is one extra or one missed dialog.
- **[Two reads on a load with the dialog]** The dialog's reads are its own, so Today reads again → one extra pair of statements an operator's first load of the day.
- **[Late close commit]** A listing whose close commits after 08:00 but whose effective close was yesterday is missing from that day's Slack post and present in the console after the commit → accepted; the sweep commits a close within one pass.
- **[`closed_at` has no index]** What's New filters `auction_listings` by `status` and `closed_at` → the table holds listings, not bids; a repository test with `countStatements` pins one statement, and an index waits for evidence.
- **[A large day]** The console shows every row (Q23) → one statement and a response of a few hundred rows at most; Slack stops at 10 per list.
- **[Drift between the reminder and the worklist]** → the status and the clocks are the worklist's functions, and a repository test seeds one order per status, flagged and not, and asserts the reminder is a subset of the Needs action segment (Q16).
- **[A new cron literal]** → `check-crons` now grades the auction worker's two expressions against `wrangler.jsonc`; a one-character edit to either fails CI.
- **[Single source today]** The Slack job sits in the auction worker → when Store, Inventory or another product adds rows, its worker composes `dailyReminderMessage` from `@grade10/slack` with its own secrets and channel; that wiring is that change's.

## Migration Plan

1. Merge the store change, bump the submodule.
2. Deploy the worker. With no Slack secret set the 00:00 UTC cron logs that the reminder is not configured and posts nothing. No migration runs.
3. Set `SLACK_BOT_TOKEN` and `SLACK_ALERTS_CHANNEL` on staging, invite the bot to the channel, and watch the next 08:00 post.
4. Set them on production.

Rollback: unset the secrets to stop posts; the cron line stays harmless. The console lists have no server state to unwind.

## Open Questions

None for the product: the tie on equal closes, a session that ends without the console's sign-out, Approvals in the Needs you total and the wait's form are settled as Q42 to Q46 in `decisions.md`, and the fold and scroll as Q48.

The Slack app's scopes (`chat:write`, and `chat:write.public` if the bot is not invited) are the operator's to grant when the app is created; no task depends on them.
