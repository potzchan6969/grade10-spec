## 1. Lead times in the programme config (grade10)

- [ ] 1.1 The tests this group's scenarios name, in their own commit before its code, ticked last: `packages/loyalty/backend/test/loyaltyProgram.test.ts` parses a config with no `expiry.reminderLeadDays`, parses a valid set and a lead of 364 on twelve months, and refuses an empty set, a lead of 0, a negative lead, a lead repeated, a lead of 365 on twelve months and of 181 on six, each naming what it refuses; and `shortestWindowDays` answers 28, 181, 365 and 1460 for 1, 6, 12 and 48 months, the last across 2100 (`grade10-site-loyalty-expiry-reminders-SC-07`, `grade10-site-loyalty-expiry-reminders-SC-16`)
- [ ] 1.2 Make `grade10-site-loyalty-expiry-reminders-SC-07` and `grade10-site-loyalty-expiry-reminders-SC-16` pass: `expiry.reminderLeadDays` on `LoyaltyProgramConfig` and `programSchema` in `src/loyaltyProgram.ts`, optional, refused in the schema's filter against `shortestWindowDays(expiry.months)` as `tech-design.md` § Decisions sets out
- [ ] 1.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 2. Who is owed a reminder (grade10)

Needs group 1. Nothing here changes a writer, a sweep or a table.

- [ ] 2.1 The tests this group's scenarios name, in their own commit before its code, ticked last: unit tests for `remindersOwed` over hand-built lots on `Asia/Hong_Kong`, the boundary read on a day whose Hong Kong and UTC dates differ; and the behavior suite `src/testing/suites/expiryReminders.ts`, registered in `src/testing/behavior.ts`, over a `REMINDER_PROGRAM` in `src/testing/helpers.ts` - `LADDER_PROGRAM` with leads `[30, 7]` - over `REMINDER_PROGRAM` with the 7 taken out, and over `LADDER_PROGRAM`, which carries none; a read leaves every loyalty table as it found it, the Mixpanel outbox included (`grade10-site-loyalty-expiry-reminders-SC-01`, `grade10-site-loyalty-expiry-reminders-SC-02`, `grade10-site-loyalty-expiry-reminders-SC-03`, `grade10-site-loyalty-expiry-reminders-SC-19`, `grade10-site-loyalty-expiry-reminders-SC-04`, `grade10-site-loyalty-expiry-reminders-SC-05`, `grade10-site-loyalty-expiry-reminders-SC-07`, `grade10-site-loyalty-expiry-reminders-SC-08`, `grade10-site-loyalty-expiry-reminders-SC-09`, `grade10-site-loyalty-expiry-reminders-SC-10`, `grade10-site-loyalty-expiry-reminders-SC-12`, `grade10-site-loyalty-expiry-reminders-SC-14`, `grade10-site-loyalty-expiry-reminders-SC-15`, `grade10-site-loyalty-expiry-reminders-SC-17`, `grade10-site-loyalty-expiry-reminders-SC-18`, `grade10-site-loyalty-expiry-reminders-SC-20`)
- [ ] 2.2 Make `grade10-site-loyalty-expiry-reminders-SC-01`, `grade10-site-loyalty-expiry-reminders-SC-02`, `grade10-site-loyalty-expiry-reminders-SC-03`, `grade10-site-loyalty-expiry-reminders-SC-19`, `grade10-site-loyalty-expiry-reminders-SC-04`, `grade10-site-loyalty-expiry-reminders-SC-14` and `grade10-site-loyalty-expiry-reminders-SC-15` pass: `selectExpiringLots` beside `selectLiveBalances` in `src/repositories/ledgerEntries.ts`, and `remindersOwed` in `src/services/ledger/reminders.ts` - the day, the points on it with no minimum and one reminder per lead it falls within, day bounds computed in TypeScript on the programme's clock
- [ ] 2.3 Make `grade10-site-loyalty-expiry-reminders-SC-05`, `grade10-site-loyalty-expiry-reminders-SC-07`, `grade10-site-loyalty-expiry-reminders-SC-08`, `grade10-site-loyalty-expiry-reminders-SC-09`, `grade10-site-loyalty-expiry-reminders-SC-10`, `grade10-site-loyalty-expiry-reminders-SC-12`, `grade10-site-loyalty-expiry-reminders-SC-17`, `grade10-site-loyalty-expiry-reminders-SC-18` and `grade10-site-loyalty-expiry-reminders-SC-20` pass: `listOwedExpiryReminders`, exported from `services/ledger` and the package entry, keyset-paged by member as `listMemberIds` pages, the limit defaulting to 200 and clamped to 500, answering nothing without reading where the programme carries no lead times, reading lots alive at `at` for members with no `erased_at`, writing nothing and reachable from no tRPC or RPC procedure
- [ ] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` - the grade10 loyalty worker's `test/db/scenarios.spec.ts` runs the behavior suite against its committed migrations; and `EXPLAIN` of `selectExpiringLots` on a Neon branch of staging's loyalty database, recorded in the group's `rounds.md` row

## 3. Grade10's lead times (grade10)

Needs group 1. `decisions.md` Q5 settles one lead of 30 days.

- [ ] 3.1 `expiry.reminderLeadDays: [30]` in `GRADE10_LOYALTY_PROGRAM` (`packages/app-env/src/loyalty.ts`), with the header comment saying the reminder starts on the day the profile's expiry warning does (`grade10-site-loyalty-expiry-reminders-SC-21`)
- [ ] 3.2 Verify: `pnpm run typecheck`, `pnpm run test:backend` - `apps/backend/grade10/loyalty/test/db/program.spec.ts` parses the config the worker boots on and asserts one lead of 30 days, owing a member 30 days off and not one 31 days off (`grade10-site-loyalty-expiry-reminders-SC-21`)

## 4. The record (grade10, grade10-spec)

- [ ] 4.1 `docs/architecture/loyalty.md` in grade10 gains the policy that an expiry reminder is a read - derived from the live lots, identified by member, day and lead, stored nowhere - and its Extension points table gains a row for a reminder's channel: it reads `listOwedExpiryReminders` and keys what it sends on the reminder's member, day and lead
- [ ] 4.2 `docs/prds/products/grade10-site/loyalty/expiry-reminders.md` in grade10-spec gains a Code map naming `expiry.reminderLeadDays` and the loyalty architecture doc, names and links only
- [ ] 4.3 Verify: `pnpm check:manual` in grade10-spec

## 5. Returned points and operator credits keep their day (grade10)

The programme already does this; the group pins it with a test and changes no code.

- [ ] 5.1 The test this group's scenario names, in its own commit, ticked last: in `src/testing/suites/redemptionExpiry.ts`, a member brought to nothing by a correction while their clock still runs has a redemption reversed, another has an order paid partly with points refunded, and a third has the points paid toward an order returned by an operator through `returnSpend`; each gets its points back dying at the running clock, and the clock does not move; a fourth, brought to nothing the same way, is granted points and its clock moves out to a year from the grant, never back (`grade10-site-loyalty-programme-SC-254`, `grade10-site-loyalty-programme-SC-180`)
- [ ] 5.2 Verify: `pnpm run test:backend`

## 6. The walk - one member's reminders across a life (grade10)

Uses draft `feature-tcs.md` as its planning input. Needs groups 1 and 2 landed. Nobody walks this capability through an interface, so the walk is the behavior suite's own, beside `expiryWalk.ts`, against the committed migrations.

- [ ] 6.1 One member walked end to end in `src/testing/suites/expiryReminderWalk.ts`, registered in `src/testing/behavior.ts`, kept as the change's end-to-end suite: buys and redeems part, comes inside both leads and is owed two reminders, is asked again and owed the same two, is granted points and owed the same two with the new count, buys again and is owed nothing, comes back inside a lead, has both orders refunded and the granted points corrected away, and is owed nothing, has the redemption reversed and is owed the same reminder again, and passes the day and is owed nothing; a second member deletes the account while owed one (`grade10-site-loyalty-expiry-reminders-SC-01`, `grade10-site-loyalty-expiry-reminders-SC-04`, `grade10-site-loyalty-expiry-reminders-SC-05`, `grade10-site-loyalty-expiry-reminders-SC-08`, `grade10-site-loyalty-expiry-reminders-SC-09`, `grade10-site-loyalty-expiry-reminders-SC-10`, `grade10-site-loyalty-expiry-reminders-SC-15`, `grade10-site-loyalty-expiry-reminders-SC-17`, `grade10-site-loyalty-expiry-reminders-SC-18`)
- [ ] 6.2 Flip the cases the walk decides with `pnpm run tcs:automated <case…> --decided-by grade10:packages/loyalty/backend/src/testing/suites/expiryReminderWalk.ts`, in the walk's own commit; the ones that stay manual are named in the suite and in the walk's `rounds.md` row
- [ ] 6.3 Verify: `pnpm run test:backend` in grade10, `pnpm run tcs:validate` in grade10-spec
