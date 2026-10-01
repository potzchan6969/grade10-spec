# Tasks

Landing order is [`tech-design.md`](tech-design.md)'s Migration Plan. Groups 1
to 5 land in **grade10-spec** and are what the submodule bump carries; every
group after them lands in **grade10**, and group 9 bumps the pointer. Every
other order a group depends on is a prose line under that group's heading.

The four migrations `0000_grading_schema.sql` to `0003_seed_settings.sql` land
whole in group 9: nothing is live and the `grading` gate hides the site's pages
on uat and production. `0004_batch_shipments.sql`, `0005_waivers_kind.sql`,
`0006_payout_received.sql` and `0007_notice_period.sql` land in groups 16, 19,
19 and 20, numbered in that deploy order, each applied before the pull request
that reads it deploys. A task appended after a group's verify step runs that group's checks
again. Three stages deploy, and each grade10 group's prose line names
the one it lands in — (a) the shared modules, the three providers and the
registered worker answering its health probe; (b) plan through ship, the money
and the safe, with walk 33; (c) receiving through hand-back, the ladder, the
payouts and erasure, with walk 34. Each e2e spec lands with the stage that
reaches it, and `batch.spec.ts` lands with (c) because it reaches receiving, so
(b)'s ship is proven by group 16's service tests alone.

## 1. The collector's words (grade10-spec) (owner: @ecchochan)

- [x] 1.1 Name every key of the new `grading` namespace in the vocabulary type
      first, so `pnpm --filter @grade10/i18n run test` refuses each language
      that has not answered them yet
- [x] 1.2 Answer `grading.home.*` and `grading.plan.*` in
      `messages/shared/{en,zh-Hant,zh-Hans,ko}/grading.json` — the lead and the
      four how-it-works lines, the price sheet with its above-the-top line, the
      wizard's three steps, the card's words, the paste sheet's five counts,
      the service step's levels and estimate, and the review's totals, warning
      and five good-to-know lines
- [x] 1.3 Answer `grading.dropoff.*` — the shop durations, the batch line, the
      booked page's four Before you come items, the calendar, move and cancel
      words, and the joined and resized lines
- [x] 1.4 Answer `grading.submission.*` — the ten status words, the seven
      chips, the seven stages, the fourteen outcome badges and each exception's
      line, the grader block, the grades block, the pickup card, the named
      collector, every money line, the ladder's rungs and the collected record
- [x] 1.5 Answer `grading.ceremony.*` — one `RefusalWords` entry per
      `DocSignFailureCode`, the name and postal-address fields, sign, decline
      and sealed — and `grading.console.*`, the seven WhatsApp templates and
      nothing else
- [x] 1.6 Add the grading nav key to `chrome` and assemble the namespace in
      `packages/i18n/src/catalogs.ts`
- [x] 1.7 Verify: `pnpm --filter @grade10/i18n run test`, `pnpm run typecheck`,
      `pnpm run lint`
- [x] 1.8 Name `grading.plan.review.saveChanges`, the editor's save, in the
      vocabulary type first, then answer it in every language 1.2 answers;
      then run 1.7's checks
- [x] 1.9 Give `grading.submission.ladder.noticeLine` a `{period}` argument in
      place of its written 30, in the vocabulary type first, then in every
      language 1.2 answers; then run 1.7's checks

## 2. The three rungs on `Text` (grade10-spec) (owner: @ecchochan)

- [x] 2.1 Write the stories for the three rungs beside `Text` — the `display`
      size, the `mono` face and the `warning` tone, one story per rung — and
      run the axe pass over each
- [x] 2.2 Add the `display` size above `xl` and the `mono` face axis on the
      existing `--font-mono` token, leaving every size and face `Text` already
      offers as it is
- [x] 2.3 Add the `warning` tone on the existing `--warning-foreground` token,
      which the money block's due row reads
- [x] 2.4 Verify: `pnpm run design-sync:check`, whose two warnings stand on
      [`ui-design.md`](ui-design.md)'s record of `Text`'s three rungs and
      `RadioCard` as code ahead of design,
      `pnpm run test:stories:design-system`, `pnpm run typecheck`,
      `pnpm run lint`

## 3. The planning blocks (grade10-spec)

Composes the design-system primitives group 2 widens. Every export takes
`copy`, `locale` and `className`, and renders with no application behind it.

- [x] 3.1 Write the stories and the tests for the five planning blocks in
      `packages/ui/src/blocks/grading-submission/`, one story per state and
      every query by role (`shared-ui-grading-submission-SC-03`,
      `shared-ui-grading-submission-SC-04`,
      `shared-ui-grading-submission-SC-05`,
      `shared-ui-grading-submission-SC-59`,
      `shared-ui-grading-submission-SC-60`,
      `shared-ui-grading-submission-SC-06`,
      `shared-ui-grading-submission-SC-07`,
      `shared-ui-grading-submission-SC-08`,
      `shared-ui-grading-submission-SC-09`,
      `shared-ui-grading-submission-SC-10`,
      `shared-ui-grading-submission-SC-11`,
      `shared-ui-grading-submission-SC-12`,
      `shared-ui-grading-submission-SC-13`,
      `shared-ui-grading-submission-SC-14`,
      `shared-ui-grading-submission-SC-15`,
      `shared-ui-grading-submission-SC-16`,
      `shared-ui-grading-submission-SC-17`,
      `shared-ui-grading-submission-SC-18`,
      `shared-ui-grading-submission-SC-19`,
      `shared-ui-grading-submission-SC-61`,
      `shared-ui-grading-submission-SC-62`,
      `shared-ui-grading-submission-SC-20`,
      `shared-ui-grading-submission-SC-21`,
      `shared-ui-grading-submission-SC-22`,
      `shared-ui-grading-submission-SC-23`,
      `shared-ui-grading-submission-SC-63`,
      `shared-ui-grading-submission-SC-24`,
      `shared-ui-grading-submission-SC-25`,
      `shared-ui-grading-submission-SC-26`,
      `shared-ui-grading-submission-SC-27`,
      `shared-ui-grading-submission-SC-28`)
- [x] 3.2 Build `GradingFeeSheet` — a `Table` per grader under a
      `SegmentedControl`, the cover column only where the level carries one,
      the grader picked by id, the sheet drawn as it was given
      (`shared-ui-grading-submission-SC-03`,
      `shared-ui-grading-submission-SC-04`,
      `shared-ui-grading-submission-SC-05`,
      `shared-ui-grading-submission-SC-59`)
- [x] 3.3 Build `GradingLevelPicker` — the graders, the highest declared value,
      a `RadioCard` per level open or closed with the card or the count that
      closed it, the dark estimate card and the upcharge `Alert`
      (`shared-ui-grading-submission-SC-60`,
      `shared-ui-grading-submission-SC-06`,
      `shared-ui-grading-submission-SC-07`,
      `shared-ui-grading-submission-SC-08`,
      `shared-ui-grading-submission-SC-09`,
      `shared-ui-grading-submission-SC-10`,
      `shared-ui-grading-submission-SC-11`,
      `shared-ui-grading-submission-SC-12`)
- [x] 3.4 Build `GradingCardList` — a `Card` per card with `Autocomplete`,
      `NumberInput` and the minimum grade, the reference sales or the
      kept-as-typed line, the cap that refuses the card past it, the empty
      list's two ways to start, and one callback per act
      (`shared-ui-grading-submission-SC-13`,
      `shared-ui-grading-submission-SC-14`,
      `shared-ui-grading-submission-SC-15`,
      `shared-ui-grading-submission-SC-16`,
      `shared-ui-grading-submission-SC-17`,
      `shared-ui-grading-submission-SC-18`,
      `shared-ui-grading-submission-SC-19`,
      `shared-ui-grading-submission-SC-61`,
      `shared-ui-grading-submission-SC-62`)
- [x] 3.5 Build `GradingPasteSheet` — a `Drawer` over a `Textarea`, the line
      counter, the four counts with their lines and the skipped count, the Bulk
      notice, and the cards reported through `onApply`
      (`shared-ui-grading-submission-SC-20`,
      `shared-ui-grading-submission-SC-21`,
      `shared-ui-grading-submission-SC-22`,
      `shared-ui-grading-submission-SC-23`,
      `shared-ui-grading-submission-SC-63`)
- [x] 3.6 Build `GradingReview` — the schedule, the three totals, the per-card
      warning with both prices, the five good-to-know lines, the tick nothing
      is booked without, and the refusal it was given
      (`shared-ui-grading-submission-SC-24`,
      `shared-ui-grading-submission-SC-25`,
      `shared-ui-grading-submission-SC-26`,
      `shared-ui-grading-submission-SC-27`,
      `shared-ui-grading-submission-SC-28`)
- [x] 3.7 Verify: `pnpm run test:stories:ui`, `pnpm run test`,
      `pnpm run typecheck`, `pnpm run lint`
- [x] 3.8 Make `GradingReview`'s `onBook`, `onConsent` and `consented`
      optional as one set, its test and a Kept story red first: given neither, no Book and no
      statement, the save act reading the words the caller passes; then run
      3.7's checks (`shared-ui-grading-submission-SC-74`)

## 4. The submission blocks and the barrel (grade10-spec)

- [x] 4.1 Write the stories and the tests for the eight submission blocks and
      the barrel, one story per state (`shared-ui-grading-submission-SC-29`,
      `shared-ui-grading-submission-SC-30`,
      `shared-ui-grading-submission-SC-31`,
      `shared-ui-grading-submission-SC-32`,
      `shared-ui-grading-submission-SC-33`,
      `shared-ui-grading-submission-SC-34`,
      `shared-ui-grading-submission-SC-35`,
      `shared-ui-grading-submission-SC-64`,
      `shared-ui-grading-submission-SC-36`,
      `shared-ui-grading-submission-SC-37`,
      `shared-ui-grading-submission-SC-38`,
      `shared-ui-grading-submission-SC-39`,
      `shared-ui-grading-submission-SC-40`,
      `shared-ui-grading-submission-SC-41`,
      `shared-ui-grading-submission-SC-42`,
      `shared-ui-grading-submission-SC-43`,
      `shared-ui-grading-submission-SC-44`,
      `shared-ui-grading-submission-SC-45`,
      `shared-ui-grading-submission-SC-46`,
      `shared-ui-grading-submission-SC-47`,
      `shared-ui-grading-submission-SC-48`,
      `shared-ui-grading-submission-SC-49`,
      `shared-ui-grading-submission-SC-50`,
      `shared-ui-grading-submission-SC-51`,
      `shared-ui-grading-submission-SC-52`,
      `shared-ui-grading-submission-SC-53`,
      `shared-ui-grading-submission-SC-01`,
      `shared-ui-grading-submission-SC-02`,
      `shared-ui-grading-submission-SC-54`,
      `shared-ui-grading-submission-SC-55`,
      `shared-ui-grading-submission-SC-56`,
      `shared-ui-grading-submission-SC-57`,
      `shared-ui-grading-submission-SC-58`)
- [x] 4.2 Build `GradingOwnershipChip` as the two `Badge`s the status table
      pairs and `GradingStatusRail` as seven `Step`s, the reached stage
      `progress` and an ended submission staying where it ended
      (`shared-ui-grading-submission-SC-29`,
      `shared-ui-grading-submission-SC-30`,
      `shared-ui-grading-submission-SC-31`,
      `shared-ui-grading-submission-SC-32`,
      `shared-ui-grading-submission-SC-33`)
- [x] 4.3 Build `GradingCardRecord` and `GradingGradeCards` — the intake id,
      the photograph pair, the outcome badge in the tone the outcome names, the
      certificate against the address it was given, the grade at display size
      and the ungraded card in the `error` tone with its code and note
      (`shared-ui-grading-submission-SC-34`,
      `shared-ui-grading-submission-SC-35`,
      `shared-ui-grading-submission-SC-64`,
      `shared-ui-grading-submission-SC-36`,
      `shared-ui-grading-submission-SC-37`,
      `shared-ui-grading-submission-SC-38`,
      `shared-ui-grading-submission-SC-39`)
- [x] 4.4 Build `GradingPickupCard` — the code in the mono face, the items,
      where and open, the one figure to settle or none, and what to bring above
      and below the threshold — and `GradingNamedCollector`
      (`shared-ui-grading-submission-SC-40`,
      `shared-ui-grading-submission-SC-41`,
      `shared-ui-grading-submission-SC-42`,
      `shared-ui-grading-submission-SC-43`,
      `shared-ui-grading-submission-SC-44`,
      `shared-ui-grading-submission-SC-45`)
- [x] 4.5 Build `GradingMoneyBlock` as the one place the lines live, the due
      row in the `warning` tone and the settle lead above it, and
      `GradingUncollectedLadder` with its three dated rungs and the posted
      notice's day (`shared-ui-grading-submission-SC-46`,
      `shared-ui-grading-submission-SC-47`,
      `shared-ui-grading-submission-SC-48`,
      `shared-ui-grading-submission-SC-49`,
      `shared-ui-grading-submission-SC-50`,
      `shared-ui-grading-submission-SC-51`,
      `shared-ui-grading-submission-SC-52`,
      `shared-ui-grading-submission-SC-53`)
- [x] 4.6 Re-export all thirteen blocks from `packages/ui/src/index.ts` under a
      `shared/ui/grading-submission` comment, take every word, figure and act
      through props, and render each state with no application behind it
      (`shared-ui-grading-submission-SC-01`,
      `shared-ui-grading-submission-SC-02`,
      `shared-ui-grading-submission-SC-54`,
      `shared-ui-grading-submission-SC-55`,
      `shared-ui-grading-submission-SC-56`,
      `shared-ui-grading-submission-SC-57`,
      `shared-ui-grading-submission-SC-58`)
- [x] 4.7 Add the `::story` cards for the thirteen blocks to
      `docs/prds/products/shared/ui/grading-submission.md`, one per block, and
      drop the `::figma` card where a story answers the same drawing
- [x] 4.8 Verify: `pnpm run test:stories:ui`, `pnpm run test`,
      `pnpm check:manual`, `pnpm run typecheck`, `pnpm run lint`

## 5. The preview letters (grade10-spec)

Its evidence is group 22's `email/letters/render.test.tsx` in grade10, which
reads these fixtures back; a failure there is a fix here.

- [x] 5.1 Write `apps/emails/emails/grading/fixtures.ts` as one facts member
      per `NotifyKind` over the fixture submission `5TW8HN`, the data the
      worker's `email/letters/render.test.tsx` reads back through
      `external/grade10-spec` — the fixtures land before the letters that
      render them
- [x] 5.2 Add `CardLines`, `PickupBlock`, `SubmissionLine` and `GradingFooter`
      beside the existing `_components`, the footer carrying the custodian's
      registered name, the shop and its address, the complaints contact and the
      Hong Kong time line
- [x] 5.3 Add one preview letter per `NotifyKind` under
      `apps/emails/emails/grading/`, each over `Grade10EmailShell` composing
      the facts group, the blocks that kind carries and `PrimaryCta`
- [x] 5.4 Verify: `pnpm run email:build`, `pnpm run typecheck`, `pnpm run lint`

## 6. Provisioning the grading database, its buckets and its fonts (grade10)

Lands before any config names an id, so no placeholder ever owes
`check-config.mjs`'s `AWAITING` map an entry. Writes no code, so opens with no
test task; verified by `pnpm run db:status` and the uploads listed, with
`check-config.mjs` in group 9's verification, where it can pass. Stage (a).

- [ ] 6.1 Create the two Neon projects in `ap-southeast-1`,
      `stg-grade10-grading` and `prd-grade10-grading`, pg schema `grading`, and
      add their row to `neondb/registry.sh`
- [ ] 6.2 Create the Hyperdrive configs with `--caching-disabled` and the three
      buckets `ITEM_PHOTOS`, `DOCUMENTS` and `DOCUMENTS_ARCHIVE`, per
      environment
- [ ] 6.3 Upload Noto Sans TC into each environment's grading `DOCUMENTS`
      bucket, so `createFontPort` finds it and no document falls back to a
      substitute face
- [ ] 6.4 Verify: `pnpm run db:status`, with the two Hyperdrive configs, the
      three buckets and the Noto Sans TC upload listed per environment

## 7. The shared lifts and the ceremony's no-identity option (grade10)

Needs `complete-vault-collector-flow` merged: it creates `BaseLayout`, the dev
outbox and `packages/storybook`, and writes the two helpers this group lifts.
Stage (a).

- [x] 7.1 Cover the lifts and the option: the reference alphabet and the throw
      by name after eight attempts from `packages/utils`, `printedValue` per
      field from `packages/app-env`, doc-sign's `templates/identity.test.ts`
      and the ceremony suite's `KYC_REQUIRED` case on each arm
      (`grade10-site-grading-counter-documents-SC-05`)
- [x] 7.2 Lift `caseReference(random)` to `packages/utils/src/reference.ts` as
      `SHORT_REFERENCE_ALPHABET` and `shortReference(random)`, add the
      `@grade10/utils/reference` export and its Handbook card row, and move the
      vault's call sites in the same commit with no re-export left behind
- [x] 7.3 Lift `printedValue` to `packages/app-env/src/printed.ts` and move the
      vault's `legal/printed.ts` call sites the same way, so both products
      throw by name on an unset value in production and print the marked
      placeholder outside it
- [x] 7.4 Add `identity: "required" | "not_required"` to `TemplateLayout` with
      no default, and branch `ceremony/capture.ts` on the layout it already
      resolves before `deps.kyc.read`: a `not_required` packet skips the read,
      the refusal chain skips `KYC_REQUIRED` and the name rung, and the
      certificate prints its no-identity line
      (`grade10-site-grading-counter-documents-SC-05`)
- [x] 7.5 Add `identity: "required"` to the vault's three templates and arm
      `alwaysOnSql("sign_signatures", ["sign_signatures_column_guard", "sign_signatures_no_truncate"], { schema })`
      in `docSignProtectionSql`, so every host inherits the guard
- [x] 7.6 Take `ceremonyClients: Record<Host, CeremonyClient>` on
      `createDocSignCoreModule`, bind `CeremonyClient` to a
      `RoutedCeremonyClient`, take `host` on `CeremonyFlow` at mount and carry
      it through doc-sign's own context;
      `apps/frontend/grade10/src/di/container.ts` and
      `pages/vault/SignPage.tsx` pass `host: "vault"`
- [x] 7.7 Add `grading` to `ServiceId` and `BRAND_SERVICES.grade10`,
      `case_records` to `RETENTION_CLASSES` with the vault's
      `sweeps/retention.ts` and `cases.yourData` answering under it, and
      `grading:read`, `grading:operate` and `grading:approve` to the auth
      contracts and their descriptions
- [x] 7.8 Verify:
      `pnpm --dir packages/grade10-auth/contracts run generate:rbac-docs` and
      commit its output, `pnpm run check:handbook`, `pnpm run check:libs`,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`,
      `pnpm run test`

## 8. The three provider entrypoints (grade10)

Stage (a).

- [x] 8.1 Cover the three: the appointment product guard and the optional
      `serviceId`, the store's `rpc/gradingEntrypoint.test.ts` over each
      refusal, and the inventory's `rpc/gradingMatch.test.ts` over matched,
      unmatched and unavailable (`grade10-site-grading-dropoff-booking-SC-01`,
      `grade10-site-grading-dropoff-booking-SC-02`)
- [x] 8.2 Add `grading` to `APPOINTMENT_PRODUCTS`, mint
      `GradingAppointmentService` with
      `createAppointmentServiceEntrypoint("grading")` on the appointment
      worker, and move the pin in
      `packages/appointment/contracts/test/schemas.test.ts` — no appointment
      migration, the entrypoint is the guard
      (`grade10-site-grading-dropoff-booking-SC-01`,
      `grade10-site-grading-dropoff-booking-SC-02`)
- [x] 8.3 Add the optional `serviceId` to `rescheduleInputSchema`, additive,
      slot sizing staying the diary's
- [x] 8.4 Add `GradingInventoryServiceApi.{matchCards,referenceSales}` to
      `@grade10/inventory-contracts` and `GradingInventoryService` on the
      inventory worker, answering per line a product id with title and
      reference sales, `unmatched`, or `unavailable`, the token and the cache
      staying the inventory's
- [x] 8.5 Add `GradingStoreServiceApi.orderByName` and `getGradingStoreService`
      to `@grade10/store-contracts` and `GradingStoreService` on the store
      worker, answering `{ orderRef, orderName, paidAt, lines }` with the
      provider's lines verbatim or refusing `ORDER_NOT_FOUND`,
      `ORDER_AMBIGUOUS` or `ORDER_NOT_PAID` by name
- [x] 8.6 Write the store migration that indexes `orders.order_name`, with the
      `-- contract:` and `-- lock:` lines `check:migrations` asks for
- [x] 8.7 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`,
      `pnpm --dir packages/api-docs run generate` and commit its output,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 9. The grading worker, its schema and the registries (grade10)

Needs groups 1 to 5 merged to this store's `main`: task 9.2 bumps the pointer
the words and the blocks arrive on. Stage (a).

- [x] 9.1 Cover the schema, the wiring and the two mechanisms every act group
      reads: a spec over the committed migrations for every table, the
      four-eyes CHECK on each table carrying the two approver columns, the
      append-only guards' `redactable` and `erasable` lists and every partial
      unique; every seeded default read back by key and a key nobody seeded
      refused; the audit chain refusing an act that cannot be written down; and
      `test/worker/` proving the three bindings resolve their named entrypoints
      through stub workers and the health probe answering
      (`grade10-admin-grading-counter-SC-81`)
- [x] 9.2 Bump the `external/grade10-spec` submodule pointer to the commit
      carrying groups 1 to 5
- [x] 9.3 Stand `packages/grading/{contracts,backend}` on the vault's exports
      maps — contracts `.`; backend `.`, `./schema`, `./router-type`,
      `./worker`, `./worker/secrets`, `./testing` — each with its
      `vitest.config.ts` and its Handbook card
- [x] 9.4 Stand `packages/grading/{frontend,admin-frontend}` the same way —
      frontend one subpath per slice plus `./modules`, `./core`,
      `./core/testing`; admin-frontend those and `./testing` — each with its
      `vitest.config.ts` and its Handbook card
- [x] 9.5 Add `apps/backend/grade10/grading`: `grade10-grading-service`, port
      4450, inspector 9244, crons `*/15 * * * *` and `0 * * * *`, Hyperdrive to
      `grade10_grading`, the three buckets, the `AUTH_SERVICE`,
      `APPOINTMENT_SERVICE`, `INVENTORY_SERVICE` and `STORE_SERVICE` bindings
      and no `KYC_SERVICE`, with `RESEND_API_KEY` declared in `src/secrets.ts`
- [x] 9.6 Write `0000_grading_schema.sql`, generated over every table
- [x] 9.7 Write `0001_append_only.sql` with each table's `redactable` and
      `erasable` lists armed always, `0002_sign_lifecycle_guards.sql` over
      `docSignProtectionSql`, and `0003_seed_settings.sql` seeding the clocks
      and the non-money defaults alone
- [x] 9.8 Edit the registries: `packages/app-env/src/services.ts`, the
      gateway's `wrangler.jsonc` and `routing.spec.ts`,
      `scripts/dev/services.mjs`, `scripts/deploy/components.mjs` with
      `grading` after `store` and before the gateway, the `DEFAULT_CRON_LANES`
      twin naming both cron expressions, `packages/api-docs`, and
      `check-erasure-consumers.mjs`'s row
- [x] 9.9 Write `docs/architecture/grading.md`, add the four package rows to
      `docs/conventions/packages.md` and the four cards and the topology nodes
      to `docs/architecture/handbook.html`
- [x] 9.10 Write `settings/read.ts` parsing every key through its schema and
      throwing `SETTING_UNSET` naming the key — never a default in code — so
      every group after this one reads a setting through one file
- [x] 9.11 Add the hash-chained audit port every act writes its row through, so
      an act with nowhere to record itself is refused rather than performed
      (`grade10-admin-grading-counter-SC-81`)
- [x] 9.12 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`,
      `pnpm run cf-typegen`, `pnpm run check:submodules`,
      `pnpm run check:handbook`, `pnpm run check:libs`,
      `node scripts/checks/check-config.mjs`,
      `node scripts/checks/check-crons.mjs`,
      `node scripts/checks/check-lanes.mjs`,
      `node scripts/checks/check-erasure-consumers.mjs`,
      `pnpm --dir packages/api-docs run generate` and commit its output,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 10. The derived answers (grade10)

Every other application group reads this one's exports. Stage (b).

- [x] 10.1 Table-test the pure answers in `packages/grading/contracts`, `asOf`
      on both sides of every deadline — the standing and its badges, the
      uncollected ladder's rungs, the batch's word, storage per month started
      and the upcharge (`grade10-admin-grading-batches-SC-04`,
      `grade10-admin-grading-batches-SC-05`,
      `grade10-admin-grading-batches-SC-06`,
      `grade10-admin-grading-batches-SC-20`,
      `grade10-admin-grading-batches-SC-50`,
      `grade10-site-grading-submission-lifecycle-SC-24`,
      `grade10-site-grading-submission-lifecycle-SC-38`,
      `grade10-site-grading-submission-lifecycle-SC-39`,
      `grade10-site-grading-submission-plan-SC-28`,
      `grade10-site-grading-submission-plan-SC-29`,
      `grade10-site-grading-submission-plan-SC-30`)
- [x] 10.2 Add `submissionStanding(input, asOf, timeZone)` in `src/standing.ts`
      over a declared `SubmissionStandingInput` the list row also carries,
      answering the status word, the chip, the rail's stage and every badge —
      the drop-off today, uncollected at a month, the notice due at six, the
      payout past its window — derived and never written down
- [x] 10.3 Add `uncollectedLadder(readyAt, terms)` beside it, counting the
      three dated rungs and the notice's day once from the pinned
      `reminder_days`, `storage_from_day` and `notice_day`, so groups 20 and 21
      and the console's tiles read the same dates rather than each counting its
      own
- [x] 10.4 Add `batchState(batch, asOf)` beside it, deriving open, closed,
      shipped, returned and received from `cutoff_at`, `ship_date`,
      `received_at` and `finished_at`, with the running-late read and the
      due-back badge that stands from the estimated day until the batch is
      received (`grade10-admin-grading-batches-SC-04`,
      `grade10-admin-grading-batches-SC-05`,
      `grade10-admin-grading-batches-SC-06`,
      `grade10-admin-grading-batches-SC-20`,
      `grade10-admin-grading-batches-SC-50`)
- [x] 10.5 Add `src/money.ts`: `coverLine(declaredMinor, coverBps)` half-up to
      the cent, `upchargeOf(sheet, from, to)`,
      `storageDue(readyAt, cardsHeld, asOf, terms)` counting months started on
      `Asia/Hong_Kong` days, and `dueNow(input, asOf)` over a declared
      `DueNowInput` — accrued less the settled lines of that kind less the
      waivers, one rule for every kind
      (`grade10-site-grading-submission-lifecycle-SC-24`,
      `grade10-site-grading-submission-lifecycle-SC-38`,
      `grade10-site-grading-submission-lifecycle-SC-39`,
      `grade10-site-grading-submission-plan-SC-28`,
      `grade10-site-grading-submission-plan-SC-29`,
      `grade10-site-grading-submission-plan-SC-30`)
- [x] 10.6 Add `STAFF_ONLY_EVENT_KINDS` and `isCustomerEvent`, the
      status-to-collector-word map both SPAs import, `GradingTemplateId` and
      the closed `GraderStage` set
- [x] 10.7 Verify: `pnpm run check:libs`, `pnpm run typecheck`,
      `pnpm run lint`, `pnpm run test:backend`

## 11. The plan, the paste and the collector's own acts (grade10)

Stage (b).

- [x] 11.1 Cover the one writer and the plan: every move and every conflict in
      `submissions/transitions.test.ts`, the reference on a forced collision,
      the paste's six answers per line, the fee sheet read, and the access
      resolver on the right token, a stale token after a re-mint, no token, the
      session owner and a session that is not
      (`grade10-site-grading-submission-lifecycle-SC-01`,
      `grade10-site-grading-submission-lifecycle-SC-03`,
      `grade10-site-grading-submission-lifecycle-SC-51`,
      `grade10-site-grading-submission-plan-SC-38`,
      `grade10-site-grading-submission-plan-SC-40`,
      `grade10-site-grading-submission-plan-SC-10`,
      `grade10-site-grading-submission-plan-SC-11`,
      `grade10-site-grading-submission-plan-SC-12`,
      `grade10-site-grading-submission-plan-SC-15`,
      `grade10-site-grading-submission-plan-SC-16`,
      `grade10-site-grading-submission-plan-SC-17`,
      `grade10-site-grading-submission-plan-SC-18`,
      `grade10-site-grading-submission-plan-SC-19`,
      `grade10-site-grading-submission-plan-SC-53`,
      `grade10-site-grading-submission-plan-SC-54`,
      `grade10-site-grading-submission-plan-SC-04`,
      `grade10-site-grading-submission-plan-SC-05`,
      `grade10-site-grading-submission-plan-SC-06`,
      `grade10-site-grading-submission-plan-SC-39`,
      `grade10-site-grading-submission-plan-SC-41`,
      `grade10-site-grading-submission-plan-SC-42`,
      `grade10-site-grading-submission-plan-SC-36`,
      `grade10-site-grading-submission-plan-SC-37`,
      `grade10-site-grading-submission-lifecycle-SC-52`,
      `grade10-site-grading-submission-lifecycle-SC-48`,
      `grade10-admin-grading-counter-SC-72`,
      `grade10-admin-grading-counter-SC-74`)
- [x] 11.2 Write `submissions/transitions.ts` as the one writer of the status —
      `UPDATE … WHERE status IN (from…) RETURNING`, the `submission_events` row
      in the same transaction, zero rows a named `SUBMISSION_CONFLICT` — over
      the ten moves, leaving a card's exception to the card
      (`grade10-site-grading-submission-lifecycle-SC-01`,
      `grade10-site-grading-submission-lifecycle-SC-03`,
      `grade10-site-grading-submission-lifecycle-SC-51`)
- [x] 11.3 Write `savePlan`: the reference row inserted before the transaction
      opens, an independent insert per attempt guarded by `isUniqueViolation`
      and a throw by name after eight, `matchCards` called once outside any
      transaction, and the access token minted with `newBearerSecret(32)` and
      kept as `sha256Hex` in `submissions.access_hash`
      (`grade10-site-grading-submission-plan-SC-38`,
      `grade10-site-grading-submission-plan-SC-40`)
- [x] 11.4 Add `submissions.paste`, accounting for every line as matched, kept
      as typed, without a value, above the ceiling, skipped or unavailable, and
      writing the degrade as a `reference_unavailable` event with the count and
      the provider's error logged by name
      (`grade10-site-grading-submission-plan-SC-10`,
      `grade10-site-grading-submission-plan-SC-11`,
      `grade10-site-grading-submission-plan-SC-12`,
      `grade10-site-grading-submission-plan-SC-15`,
      `grade10-site-grading-submission-plan-SC-16`,
      `grade10-site-grading-submission-plan-SC-17`,
      `grade10-site-grading-submission-plan-SC-18`,
      `grade10-site-grading-submission-plan-SC-19`,
      `grade10-site-grading-submission-plan-SC-53`,
      `grade10-site-grading-submission-plan-SC-54`)
- [x] 11.5 Add the public `quotes.feeSheet` and `quotes.estimate`, one row per
      level with cover only where the level carries a rate and a grader nobody
      has priced still listing its levels
      (`grade10-site-grading-submission-plan-SC-04`,
      `grade10-site-grading-submission-plan-SC-05`,
      `grade10-site-grading-submission-plan-SC-06`)
- [x] 11.6 Add the `submissionAccess` resolver — the link's digest beside the
      session arm, a signed-in caller's email equal to `submissions.email`, a
      stranger reading not found — and re-mint the token on the `handed_in` and
      `ready` letters (`grade10-site-grading-submission-plan-SC-39`,
      `grade10-site-grading-submission-plan-SC-41`,
      `grade10-site-grading-submission-plan-SC-42`,
      `grade10-site-grading-submission-lifecycle-SC-52`)
- [x] 11.7 Write `pinFeeSheet` and `pinTerms` as the one pair every pin calls,
      `pinFeeSheet` pinning `pinned_fee_sheet` at `book` and every figure read
      from it after, so a sheet changed before booking reaches the plan, one
      changed after leaves the booked submission priced as it was, and a new
      fee-sheet row reaches only what is not yet booked; `pinFeeSheet` pins
      the grader's active rows, keyed by level, in one read, so an upcharge
      prices off both levels the collector agreed to
      (`grade10-site-grading-submission-plan-SC-36`,
      `grade10-site-grading-submission-plan-SC-37`,
      `grade10-admin-grading-counter-SC-72`,
      `grade10-admin-grading-counter-SC-74`)
- [x] 11.8 Add
      `submissions.{update,list,detail,cancel,nameCollector,removeCollector}`,
      cancel refused once the cards are in, `update` and the paste refused as
      `LIST_AT_COUNTER` before any write once the counter checks or refuses a
      card and the edit no longer offered from then, and every act carrying
      the detail's `asOf` so a submission that moved refuses by name
      (`grade10-site-grading-submission-lifecycle-SC-48`,
      `grade10-site-grading-submission-lifecycle-SC-59`)
- [x] 11.9 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [x] 11.10 Keep the plan's tick, its test red first: `submissions.consented_at`
      in a migration `pnpm run db:drizzle:generate` writes, set by
      `submissions.plan` and `submissions.update` given an optional
      `consented: true`, through `tickOf`, its one writer, left null by a
      plan saved unticked and never cleared, and
      `CONSENT_REQUIRED` added to
      `GRADING_FAILURE_CODES` for 12.12 to raise; then run 11.9's checks and
      `pnpm run check:migrations`
      (`grade10-site-grading-submission-plan-SC-62`)
- [x] 11.11 Cover what `plan.ts` already runs for an edit at `booked`, as
      coverage rather than a red test: the grader fixed, a level required on
      the pinned sheet, and a list edited past twenty moving the visit to the
      Bulk drop-off at its slot once, after the commit
      (`grade10-site-grading-dropoff-booking-SC-30`)

## 12. The drop-off, the joiner and the shared visit (grade10)

Stage (b).

- [x] 12.1 Cover the booking seam: the remote call outside every transaction,
      the all-or-none cache, the diary's four refusals by name, the batch the
      chosen day names opened once per shop, grader and level on its key,
      with two desks racing on a real Postgres, the joiner resolved through one
      column, and the upsize as one reschedule (`grade10-site-grading-dropoff-booking-SC-04`,
      `grade10-site-grading-dropoff-booking-SC-05`,
      `grade10-site-grading-dropoff-booking-SC-15`,
      `grade10-site-grading-dropoff-booking-SC-16`,
      `grade10-site-grading-dropoff-booking-SC-06`,
      `grade10-site-grading-dropoff-booking-SC-07`,
      `grade10-site-grading-dropoff-booking-SC-08`,
      `grade10-site-grading-dropoff-booking-SC-03`,
      `grade10-site-grading-dropoff-booking-SC-09`,
      `grade10-site-grading-dropoff-booking-SC-10`,
      `grade10-site-grading-dropoff-booking-SC-11`,
      `grade10-site-grading-dropoff-booking-SC-25`,
      `grade10-admin-grading-batches-SC-01`,
      `grade10-admin-grading-batches-SC-02`,
      `grade10-admin-grading-batches-SC-03`,
      `grade10-admin-grading-batches-SC-07`,
      `grade10-admin-grading-batches-SC-44`,
      `grade10-site-grading-dropoff-booking-SC-20`,
      `grade10-site-grading-dropoff-booking-SC-21`,
      `grade10-site-grading-dropoff-booking-SC-22`,
      `grade10-site-grading-dropoff-booking-SC-27`,
      `grade10-site-grading-submission-plan-SC-45`,
      `grade10-site-grading-submission-lifecycle-SC-47`)
- [x] 12.2 Write `booking/bind.ts` as the vault's: `bookVisit`,
      `rescheduleVisit` and `cancelVisit` calling `APPOINTMENT_SERVICE` outside
      every transaction, then `withSubmissionLock` writing `booking_ref`,
      `service_id`, `appointment_at` and `location_id` all or none, then
      `tellCustomerFor`; `dropoffServiceFor(cards)` picks Bulk at twenty cards
      or more (`grade10-site-grading-dropoff-booking-SC-04`,
      `grade10-site-grading-dropoff-booking-SC-05`,
      `grade10-site-grading-dropoff-booking-SC-15`,
      `grade10-site-grading-dropoff-booking-SC-16`)
- [x] 12.3 Let the diary's refusals reach the page by name —
      `SLOT_NOT_OFFERED`, `SLOT_FULL`, `RESOURCE_NOT_AVAILABLE`,
      `ALREADY_BOOKED` — answer no free day when the diary cannot be read,
      offer no day past the service's horizon, and refuse a plan that expired
      meanwhile (`grade10-site-grading-dropoff-booking-SC-06`,
      `grade10-site-grading-dropoff-booking-SC-07`,
      `grade10-site-grading-dropoff-booking-SC-08`,
      `grade10-site-grading-dropoff-booking-SC-03`,
      `grade10-site-grading-submission-plan-SC-45`)
- [x] 12.4 Write `openBatchFor(location, grader, level, now)` whole, the way
      every batch writer opens one — the hand-in and 30.3's new batch — the
      cut-off on `Asia/Hong_Kong` days from `settings.batch_cutoff` read share
      locked so it cannot move while a batch opens, the trio's open batch
      preferred and returned `FOR UPDATE` so no ship closes it under a
      hand-in, else the row created `ON CONFLICT DO NOTHING … RETURNING` on
      the key `(location_id, grader, level, cutoff_at)` and re-read, and its
      rule read by the booked page so the chosen
      day names the batch the cards leave in and the day back counts from it:
      one shop, one grader and one level to a batch, no second batch beside an
      open one, a card at another level waiting for its own, the cut-off
      instant falling in that week's batch, and a card handed in after it
      joining the next (`grade10-site-grading-dropoff-booking-SC-09`,
      `grade10-site-grading-dropoff-booking-SC-10`,
      `grade10-site-grading-dropoff-booking-SC-11`,
      `grade10-site-grading-dropoff-booking-SC-25`,
      `grade10-admin-grading-batches-SC-01`,
      `grade10-admin-grading-batches-SC-02`,
      `grade10-admin-grading-batches-SC-03`,
      `grade10-admin-grading-batches-SC-07`,
      `grade10-admin-grading-batches-SC-44`)
- [x] 12.5 Write `visit_owner_id` in `joinVisit` and read the visit through one
      resolver in `repositories/submissions.ts` for every predicate, index and
      read, so a joiner holds no cache of its own
      (`grade10-site-grading-dropoff-booking-SC-20`)
- [x] 12.6 Upsize with one `reschedule` carrying `serviceId` when the two lists
      pass twenty cards, at the same slot, writing nothing locally if it fails
      (`grade10-site-grading-dropoff-booking-SC-21`)
- [x] 12.7 Detach every joiner in the owner's cancel commit — its own
      `dropoff_detached` event and letter each, the joiner back to `booked` with
      no visit — and the same on the missed visit
      (`grade10-site-grading-dropoff-booking-SC-22`,
      `grade10-site-grading-dropoff-booking-SC-27`)
- [x] 12.8 Take the drop-off with the submission on `cancel`, the visit
      cancelled before the status moves, replacing the `VISIT_BOOKED` guard
      group 11 put on `cancel`, and decide what a joiner's cancel does to the
      owner's visit, since a joiner holds no booking of its own
      (`grade10-site-grading-submission-lifecycle-SC-47`)
- [x] 12.9 Serve `GET /api/submissions/:id/visit.ics` from `buildCalendarFile`
      over the owner's booking, and attach the same file to the five drop-off
      letters (`grade10-site-grading-dropoff-booking-US1-TC1-1`)
- [x] 12.10 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [x] 12.11 Write `cancellable(visit, list, at)` in the contracts, its test
      red first — the window alone, the visit not started and the list not
      the counter's, the status left to the act tables — and read it in the
      collector's `OFFERED.cancel` and in `cancelSubmission`, which refuses
      `VISIT_STARTED` or `LIST_AT_COUNTER` by name, as `withdrawable` is
      shared; then run 12.10's checks
      (`grade10-site-grading-submission-lifecycle-SC-61`)
- [x] 12.12 Give `submissions.book` and `submissions.join` an optional
      `consented: true`, its test red first: given, it writes `consented_at`
      in the booking's own commit; refused `CONSENT_REQUIRED` before the
      diary is asked only when neither the stored tick nor the input carries
      it; needs 11.10
      (`grade10-site-grading-submission-plan-SC-61`,
      `grade10-site-grading-submission-plan-SC-63`)

## 13. The hand-in, the till and the safe (grade10)

Follows group 12: the hand-in reads the batch `openBatchFor` opens. Stage (b).

- [x] 13.1 Cover the counter's writes: the check and the refusal under the
      submission lock, the till's line matching and its retry, the hand-in's
      three refusals, the safe cap taken `FOR UPDATE` by two desks at once, the
      withdrawal's refund, the desk's own list, and the audit row each act
      writes (`grade10-admin-grading-counter-SC-16`,
      `grade10-admin-grading-counter-SC-17`,
      `grade10-admin-grading-counter-SC-25`,
      `grade10-admin-grading-counter-SC-26`,
      `grade10-admin-grading-counter-SC-28`,
      `grade10-admin-grading-counter-SC-88`,
      `grade10-admin-grading-counter-SC-89`,
      `grade10-admin-grading-counter-SC-19`,
      `grade10-admin-grading-counter-SC-27`,
      `grade10-admin-grading-counter-SC-20`,
      `grade10-admin-grading-counter-SC-22`,
      `grade10-admin-grading-counter-SC-23`,
      `grade10-admin-grading-counter-SC-24`,
      `grade10-admin-grading-counter-SC-15`,
      `grade10-admin-grading-counter-SC-54`,
      `grade10-admin-grading-counter-SC-55`,
      `grade10-site-grading-submission-lifecycle-SC-58`,
      `grade10-site-grading-submission-lifecycle-SC-20`,
      `grade10-site-grading-submission-lifecycle-SC-21`,
      `grade10-site-grading-submission-lifecycle-SC-22`,
      `grade10-site-grading-submission-lifecycle-SC-15`,
      `grade10-site-grading-submission-lifecycle-SC-16`,
      `grade10-site-grading-submission-lifecycle-SC-54`,
      `grade10-admin-grading-batches-SC-40`,
      `grade10-admin-grading-batches-SC-41`,
      `grade10-admin-grading-batches-SC-42`,
      `grade10-site-grading-dropoff-booking-SC-23`,
      `grade10-site-grading-dropoff-booking-SC-24`)
- [x] 13.2 Write `checkCard` and `refuseCard` under the submission lock: the
      condition note and the two photographs, a declared value above the pinned
      ceiling refused at that level and one at the ceiling taken, a refusal
      carrying its reason and the collector's words, one refusal never holding
      the others, and the last card refused cancelling the submission
      (`grade10-admin-grading-counter-SC-16`,
      `grade10-admin-grading-counter-SC-17`,
      `grade10-admin-grading-counter-SC-25`,
      `grade10-admin-grading-counter-SC-26`,
      `grade10-admin-grading-counter-SC-28`,
      `grade10-admin-grading-counter-SC-88`,
      `grade10-admin-grading-counter-SC-89`,
      `grade10-site-grading-submission-lifecycle-SC-58`)
- [x] 13.3 Write `recordFeePaid`: `STORE_SERVICE.orderByName` read before any
      transaction opens, one store line to one card in `position` order with a
      cover line per covered card, `POS_LINES_MISMATCH` refused with the gap on
      a wrong count, a multiple, a wrong figure or a null subtotal, and the
      order claimed in `pos_orders(order_ref primary key, submission_id)`,
      append-only, `ON CONFLICT DO NOTHING` in the till's transaction before
      its lines, so one order pays one submission whatever levels it pays: a
      repeat on the claiming submission answers its own lines and writes
      nothing, and another submission presenting it is refused
      `ORDER_ALREADY_RECORDED`; each line unique on the order's line,
      `(pos_order_ref, pos_line_no)`; the store's payment method kept on each line;
      and `POST /api/submissions/:id/photos` taking one photograph of a card
      behind `grading:operate` into `ITEM_PHOTOS`, under a key naming the
      submission and the card, which `admin.checkCard` proves before it writes;
      and `GET /api/submissions/:id/photos/:photoId` serving one photograph of
      a card on that submission back by its id, `no-store`, from `ITEM_PHOTOS`,
      on the collector's own access or behind `grading:read`
      (`grade10-admin-grading-counter-SC-19`,
      `grade10-admin-grading-counter-SC-101`)
- [x] 13.4 Write `recordRefund` naming the card and the line it refunds, so a
      line already paid comes back at the till, a refused card is never
      charged, and the fee stands on a card that came back raw
      (`grade10-admin-grading-counter-SC-27`,
      `grade10-site-grading-submission-lifecycle-SC-20`,
      `grade10-site-grading-submission-lifecycle-SC-21`,
      `grade10-site-grading-submission-lifecycle-SC-22`)
- [x] 13.5 Write `handIn`: `safe_declared_cap` taken `FOR UPDATE` before the
      total is counted, then the open batch, then the submission's lock; the
      intake ids `<reference>-<n>` and the grader written onto each card, the
      intake receipt stored, one event; refusing `AGREEMENT_UNSEALED`,
      `FEE_UNPAID` and `SAFE_CAP` by name, and taking a hand-in that fills the
      safe exactly (`grade10-admin-grading-counter-SC-20`,
      `grade10-admin-grading-counter-SC-22`,
      `grade10-admin-grading-counter-SC-23`,
      `grade10-admin-grading-counter-SC-24`,
      `grade10-admin-grading-batches-SC-40`,
      `grade10-admin-grading-batches-SC-41`,
      `grade10-admin-grading-batches-SC-42`)
- [x] 13.6 Add `admin.savePlan` and `admin.addCard` for the list written at the
      desk, calling `pinFeeSheet` at `deskPlan`, and at the agreement's mint
      where `pinned_fee_sheet` is still null, and give the walk-in the diary's own customer-bookable Grading
      service as a `product: null` catalogue row, so grading never reads that
      visit and writes nothing about it (`grade10-admin-grading-counter-SC-15`,
      `grade10-site-grading-dropoff-booking-SC-23`,
      `grade10-site-grading-dropoff-booking-SC-24`)
- [x] 13.7 Write `withdrawCard`, refunding the paid line and releasing the card
      while its batch is open and taking the act away once it has closed, the
      last withdrawal cancelling the submission through an eleventh move,
      `withdrawLast` (`checked_in → cancelled`), so `cancel` stays
      `planned, booked` and the collector is never offered a cancel once the
      cards are in
      (`grade10-admin-grading-counter-SC-54`,
      `grade10-admin-grading-counter-SC-55`,
      `grade10-site-grading-submission-lifecycle-SC-15`,
      `grade10-site-grading-submission-lifecycle-SC-16`,
      `grade10-site-grading-submission-lifecycle-SC-54`)
- [x] 13.8 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [x] 13.9 Add `admin.cancel` on `grading:operate`, its tests red first, after
      12.11: the contracts' `act` input, its row in
      `contracts/src/permissions.ts`, `COUNTER_ACTS.cancel` as
      `SUBMISSION_MOVES.cancel.from`, and `cancelSubmission` taking an
      optional `staff: StaffAct` whose `recordStaffAct` is written in the
      cancel's own transaction; refused by `cancellable` and by a stale
      `expectedUpdatedAt`, the drop-off going with it and no letter drafted
      but a joiner's `dropoff_detached`; then run 13.8's checks
      (`grade10-admin-grading-counter-SC-106`,
      `grade10-admin-grading-counter-SC-107`,
      `grade10-admin-grading-counter-SC-84`)
- [ ] 13.10 Lift `batchTiles.safe` into one `safeStanding(tx)` and expose it
      as `admin.safeStanding` under `grading:read`, its test red first; then
      run 13.8's checks (`grade10-admin-grading-counter-SC-108`)
- [ ] 13.11 Refuse a card declared above `courier_cover_minor` at `checkCard`
      with `ABOVE_COVER`, naming the cover and offering no higher level, the
      setting unset refusing the check in production, its test red first;
      needs 16.8's migration; then run 13.8's checks (Q143,
      `grade10-admin-grading-counter-SC-113`)

## 14. The two templates and the intake receipt (grade10)

Stage (b).

- [x] 14.1 Cover the three documents against their pinned facts: every clause
      and figure the agreement prints, the receipt's every exception line, the
      intake receipt's ids and order, a Bulk list of 100 on each of the three
      running on and signed once on the last page, the mint refused where a
      fact is unset, a storage fee written after the seal leaving the signed
      figure alone, each act refused where what it prints moved while it
      rendered, the digest lookup, an open agreement voided by a write that
      changes its list, and the audit row each mint writes
      (`grade10-site-grading-counter-documents-SC-12`,
      `grade10-site-grading-counter-documents-SC-13`,
      `grade10-site-grading-counter-documents-SC-14`,
      `grade10-site-grading-counter-documents-SC-03`,
      `grade10-site-grading-counter-documents-SC-15`,
      `grade10-site-grading-counter-documents-SC-16`,
      `grade10-site-grading-counter-documents-SC-17`,
      `grade10-site-grading-counter-documents-SC-18`,
      `grade10-site-grading-counter-documents-SC-19`,
      `grade10-site-grading-counter-documents-SC-20`,
      `grade10-site-grading-counter-documents-SC-21`,
      `grade10-site-grading-counter-documents-SC-29`,
      `grade10-site-grading-counter-documents-SC-30`,
      `grade10-site-grading-counter-documents-SC-01`,
      `grade10-site-grading-counter-documents-SC-31`,
      `grade10-site-grading-counter-documents-SC-22`,
      `grade10-site-grading-counter-documents-SC-23`,
      `grade10-site-grading-counter-documents-SC-24`,
      `grade10-admin-grading-counter-SC-46`,
      `grade10-admin-grading-counter-SC-73`)
- [x] 14.2 Write `documents/templates/submissionAgreement.ts` as a
      `GradingTemplate` over `GradingTemplateId`: the card schedule, a cover
      line per card and the cover in total where the level carries one, the
      return date as an estimate from the day the batch leaves, and a card
      refused at the check on neither the schedule nor the fee; every grading
      paper runs on to as many pages as its list needs, doc-sign's
      `TemplateLayout.pageCount: "fitted"` recording the pages rendered and
      `SignatureFieldBox.page: "last"` stamping the one signature on the last
      (`grade10-site-grading-counter-documents-SC-12`,
      `grade10-site-grading-counter-documents-SC-13`,
      `grade10-site-grading-counter-documents-SC-14`,
      `grade10-site-grading-counter-documents-SC-31`)
- [x] 14.3 Write `documents/templates/intakeReceipt.ts` through the same page
      helpers into the documents area through doc-sign's
      `renderIssuedDocument` — issued, never a packet — naming every intake id
      and the order that paid; `handIn` takes the rendered receipt as
      required, so `admin.handIn` reaches it only through
      `handInWithReceipt`, builds its data again under the locks and compares
      it whole, writes its key and sha256 onto
      `submissions.intake_receipt_key` and `intake_receipt_sha256` in the
      move, and answers the `checked_in` letter naming it beside the sealed
      agreement
      (`grade10-site-grading-counter-documents-SC-03`,
      `grade10-site-grading-counter-documents-SC-15`)
- [x] 14.4 Write `documents/templates/handBackReceipt.ts`: who collected and
      the ID that was glanced at, the named person in the collector's place
      with a prefilled name that takes no edit, a card the grader held, a slab
      that went into a vault case, a card withdrawn before its batch closed,
      what was paid, refunded and paid out, and one line per card where two
      exceptions meet (`grade10-site-grading-counter-documents-SC-16`,
      `grade10-site-grading-counter-documents-SC-17`,
      `grade10-site-grading-counter-documents-SC-18`,
      `grade10-site-grading-counter-documents-SC-19`,
      `grade10-site-grading-counter-documents-SC-20`,
      `grade10-site-grading-counter-documents-SC-21`,
      `grade10-site-grading-counter-documents-SC-29`,
      `grade10-site-grading-counter-documents-SC-30`)
- [x] 14.5 Write `mintAgreement`, calling `pinTerms` at the mint and refusing
      while any card is unchecked, so the storage accrued on a sealed
      submission stands at the figure it signed however the settings move
      after, read through `pinnedTermsOf`; `admin.mintAgreement` over it behind
      `grading:operate`, where `COUNTER_ACTS.mintAgreement` allows; and a
      card added, revalued, refused or listed again voiding the agreement
      still out for signature in the same transaction
      (`grade10-site-grading-counter-documents-SC-01`,
      `grade10-admin-grading-counter-SC-73`)
- [x] 14.6 Print every figure from `pinned_fee_sheet` and `pinned_terms`, never
      a live table, and render the document before its transaction opens so
      `printedValue` refuses the mint in production on a fact nobody has set
      and prints the marked bracket outside it
      (`grade10-site-grading-counter-documents-SC-22`,
      `grade10-site-grading-counter-documents-SC-23`,
      `grade10-site-grading-counter-documents-SC-24`,
      `grade10-admin-grading-counter-SC-46`)
- [x] 14.7 Verify: `pnpm run typecheck`, `pnpm run lint`,
      `pnpm run test:backend`

## 15. The counter's ceremony and the sealed copies (grade10)

Stage (b).

- [x] 15.1 Cover the ceremony on the grading host: the name rung, the postal
      address, the read-to-the-end rung, the window, both declines, the copy a
      sealed link offers, the three ways out, the digest lookup, and the audit
      row each act writes (`grade10-site-grading-counter-documents-SC-07`,
      `grade10-site-grading-counter-documents-SC-08`,
      `grade10-site-grading-counter-documents-SC-04`,
      `grade10-site-grading-counter-documents-SC-28`,
      `grade10-site-grading-counter-documents-SC-06`,
      `grade10-site-grading-counter-documents-SC-09`,
      `grade10-site-grading-counter-documents-SC-10`,
      `grade10-site-grading-counter-documents-SC-26`,
      `grade10-site-grading-counter-documents-SC-11`,
      `grade10-site-grading-counter-documents-SC-25`,
      `grade10-site-grading-counter-documents-SC-27`,
      `grade10-admin-grading-counter-SC-47`,
      `grade10-admin-grading-counter-SC-48`,
      `grade10-admin-grading-counter-SC-49`,
      `grade10-admin-grading-counter-SC-93`,
      `grade10-admin-grading-counter-SC-45`)
- [x] 15.2 Mount the ceremony at `${config.services.grading}/api/sign` through
      `registerSigningRoutes`, with `routes/signing.ts` and `storage/areas.ts`
      as the vault's files in the grading schema, `documents/deps.ts` — whose
      render half `admin.handIn`, through `handInWithReceipt`, and
      `admin.mintAgreement` already read — gaining the database half, the
      documents area claiming what `claimedDocumentKeys` and
      `claimedReceiptKeys` answer together, and `DocSignDeps.kyc` throwing by
      name if it is ever read; a document not
      read to its end takes no signature and a link past its window is refused
      while staff prepare another
      (`grade10-site-grading-counter-documents-SC-07`,
      `grade10-site-grading-counter-documents-SC-08`)
- [x] 15.3 Take the signer's name from the booking and refuse another, and
      refuse a hand-back name the submission does not hold
      (`grade10-site-grading-counter-documents-SC-04`,
      `grade10-site-grading-counter-documents-SC-28`)
- [x] 15.4 Refuse the agreement's signature until the postal address is given,
      and write it to `submissions.postal_address`
      (`grade10-site-grading-counter-documents-SC-06`)
- [x] 15.5 Leave a declined agreement with nothing paid, a declined receipt
      with nothing handed back, and the declined document on none of the three
      ways out (`grade10-site-grading-counter-documents-SC-09`,
      `grade10-site-grading-counter-documents-SC-10`,
      `grade10-site-grading-counter-documents-SC-26`,
      `grade10-admin-grading-counter-SC-47`)
- [x] 15.6 Offer the copy rather than a second signature on a sealed document's
      link, serve it again at the counter through `admin.documents`, send the
      same copy to a collector who lost the email, and say so on a submission
      with nothing sealed (`grade10-site-grading-counter-documents-SC-11`,
      `grade10-admin-grading-counter-SC-48`,
      `grade10-admin-grading-counter-SC-49`,
      `grade10-admin-grading-counter-SC-93`)
- [x] 15.7 Deliver every sealed document three ways, each carrying its
      fingerprint, and answer `GET /api/documents/verify/:sha256` as unknown
      for a digest grading never issued
      (`grade10-site-grading-counter-documents-SC-25`,
      `grade10-site-grading-counter-documents-SC-27`)
- [x] 15.8 Mint one signing link per document, good for thirty minutes, through
      `admin.signingLink` (`grade10-admin-grading-counter-SC-45`)
- [x] 15.9 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [ ] 15.10 Refuse a production seal with `SETTING_UNAPPROVED` while any
      setting the document prints has no `approved_by`, naming it, its test
      red first; then run 15.9's checks (Q139,
      `grade10-admin-grading-counter-SC-115`)

## 16. The batch, the ship and the grader's stages (grade10)

Stage (b).

- [x] 16.1 Cover the batch's writes: the ship act over every submission in one
      transaction, the cover comparison inside one currency, the stage recorded
      twice, the re-estimate, and the audit row each act writes
      (`grade10-admin-grading-batches-SC-08`,
      `grade10-admin-grading-batches-SC-10`,
      `grade10-admin-grading-batches-SC-11`,
      `grade10-admin-grading-batches-SC-12`,
      `grade10-admin-grading-batches-SC-13`,
      `grade10-admin-grading-batches-SC-14`,
      `grade10-admin-grading-batches-SC-45`,
      `grade10-admin-grading-batches-SC-15`,
      `grade10-admin-grading-batches-SC-16`,
      `grade10-admin-grading-batches-SC-43`,
      `grade10-admin-grading-batches-SC-17`,
      `grade10-admin-grading-batches-SC-18`,
      `grade10-admin-grading-batches-SC-19`,
      `grade10-admin-grading-batches-SC-21`,
      `grade10-admin-grading-batches-SC-22`,
      `grade10-admin-grading-batches-SC-48`,
      `grade10-site-grading-submission-lifecycle-SC-10`)
- [x] 16.2 Derive the batch's human label and its ship day from the shop, the
      pair and the cut-off date, so the batch that closed on Thursday ships the
      next day (`grade10-admin-grading-batches-SC-08`)
- [x] 16.3 Write `shipBatch` under `lockBatch` then each submission's lock in
      id order: the packing list naming every intake id, `markShipped` per
      submission, one event each and the letters after commit; refusing a ship
      date ahead of today, an unset field, an open batch and the loser of two
      operators by name (`grade10-admin-grading-batches-SC-10`,
      `grade10-admin-grading-batches-SC-11`,
      `grade10-admin-grading-batches-SC-12`,
      `grade10-admin-grading-batches-SC-13`,
      `grade10-admin-grading-batches-SC-14`,
      `grade10-admin-grading-batches-SC-45`)
- [x] 16.4 Read the insured total off the cards in the batch and compare it to
      the courier's written cover inside one currency, refusing `OVER_COVER`
      above it and `CURRENCY_MISMATCH` otherwise, converting nothing
      (`grade10-admin-grading-batches-SC-15`,
      `grade10-admin-grading-batches-SC-16`,
      `grade10-admin-grading-batches-SC-43`)
- [x] 16.5 Write `recordBatchStage` over the closed `GraderStage` set with one
      member flagged as the move: under `lockBatch`, `grader_stage` set,
      `recordGrades` per submission in id order, one event each, the letters
      after commit, and the same stage twice writing nothing further
      (`grade10-admin-grading-batches-SC-17`,
      `grade10-admin-grading-batches-SC-18`,
      `grade10-admin-grading-batches-SC-19`)
- [x] 16.6 Write `reestimateBatch` taking a reason and refusing without one,
      one event per submission, a repeat of the same date a no-op, and every
      collector told the new date that day
      (`grade10-admin-grading-batches-SC-21`,
      `grade10-admin-grading-batches-SC-22`,
      `grade10-admin-grading-batches-SC-48`,
      `grade10-site-grading-submission-lifecycle-SC-10`)
- [x] 16.7 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [ ] 16.8 Write `0004_batch_shipments.sql` as the Migration Plan names it; then
      ship every batch as one or more shipments, its tests red first:
      `shipBatch` takes the shipments, each with its cards, courier, tracking
      and insured total read against the HKD setting `courier_cover_minor`,
      refusing a shipment past the cover, a card in no shipment or in two, and
      an unset cover in production, and moving every submission in one act
      once every shipment is recorded; the batch keeps only its order number
      and ship date, `BatchRow` reading courier and tracking from its
      shipments; each collector is told the tracking of each shipment carrying
      their cards (Q128, Q143, `grade10-admin-grading-batches-SC-13`,
      `grade10-admin-grading-batches-SC-15`, `grade10-admin-grading-batches-SC-16`,
      `grade10-admin-grading-batches-SC-57`,
      `grade10-site-grading-collector-notifications-SC-29`)
- [ ] 16.9 Refuse a ship date earlier than the day of the batch's cut-off on the
      shop's clock, its test red first (Q129,
      `grade10-admin-grading-batches-SC-56`)

## 17. Receiving, the scans and finishing (grade10)

Stage (c).

- [x] 17.1 Cover receiving: the manifest and invoice before the first scan, the
      invoice read against the sheet, the cert read under the lock before the
      insert, every exception on the card, the part-scanned batch taken up
      again, finishing held and then run twice, and the audit row each act
      writes (`grade10-admin-grading-batches-SC-23`,
      `grade10-admin-grading-batches-SC-24`,
      `grade10-admin-grading-batches-SC-39`,
      `grade10-admin-grading-batches-SC-25`,
      `grade10-admin-grading-batches-SC-26`,
      `grade10-admin-grading-batches-SC-27`,
      `grade10-admin-grading-batches-SC-46`,
      `grade10-admin-grading-batches-SC-28`,
      `grade10-admin-grading-batches-SC-34`,
      `grade10-admin-grading-batches-SC-35`,
      `grade10-admin-grading-batches-SC-36`,
      `grade10-admin-grading-batches-SC-47`,
      `grade10-admin-grading-batches-SC-37`,
      `grade10-admin-grading-batches-SC-38`,
      `grade10-admin-grading-batches-SC-30`,
      `grade10-admin-grading-batches-SC-31`,
      `grade10-admin-grading-batches-SC-32`,
      `grade10-admin-grading-batches-SC-33`,
      `grade10-site-grading-submission-lifecycle-SC-17`,
      `grade10-site-grading-submission-lifecycle-SC-18`,
      `grade10-site-grading-submission-lifecycle-SC-23`,
      `grade10-site-grading-submission-lifecycle-SC-14`)
- [x] 17.2 Add `enterManifest` and `enterInvoice`, nothing scanned until both
      are in, a manifest line naming no intake id in the batch held unmatched,
      and `enterInvoice` recording the invoice total against the batch's sheet
      sum, each with its own currency, so a gap is the shop's and the collector
      is charged the sheet's difference and nothing else
      (`grade10-admin-grading-batches-SC-23`,
      `grade10-admin-grading-batches-SC-24`,
      `grade10-admin-grading-batches-SC-39`)
- [x] 17.3 Write `scanCard` under the submission lock: the cert matched to the
      card the manifest names, `CERT_HELD_ELSEWHERE` read before the insert
      behind the partial unique on `(grader, cert)`, a cert returned in an
      earlier batch refused, and a cert the manifest does not carry refused
      (`grade10-admin-grading-batches-SC-25`,
      `grade10-admin-grading-batches-SC-26`,
      `grade10-admin-grading-batches-SC-27`,
      `grade10-admin-grading-batches-SC-46`)
- [x] 17.4 Write `recordException` over the card's closed outcome set: ungraded
      with the grader's code and note, held with the date it is expected and
      refused without one, not returned owing its declared value, a damaged
      slab photographed in the box, a card below its minimum grade coming back
      raw, and a card moved up a level (`grade10-admin-grading-batches-SC-28`,
      `grade10-admin-grading-batches-SC-34`,
      `grade10-admin-grading-batches-SC-35`,
      `grade10-admin-grading-batches-SC-36`,
      `grade10-admin-grading-batches-SC-47`,
      `grade10-site-grading-submission-lifecycle-SC-17`,
      `grade10-site-grading-submission-lifecycle-SC-18`)
- [x] 17.5 Tell the collector either outcome the same day, and tell the
      upcharge the day the grades post, at the pinned sheet's difference
      (`grade10-admin-grading-batches-SC-37`,
      `grade10-admin-grading-batches-SC-38`,
      `grade10-site-grading-submission-lifecycle-SC-23`)
- [x] 17.6 Keep a part-scanned batch's scans when it is saved and taken up
      again (`grade10-admin-grading-batches-SC-30`)
- [x] 17.7 Write `finishReceiving`: refusing `MANIFEST_UNRESOLVED` while a line
      or a slab is unresolved, each pickup code drawn in its own savepoint
      behind the partial unique among `ready` submissions, one transaction
      making every submission ready, the letters after commit, a second finish
      telling nobody twice, and a card the grader still holds keeping the
      submission ready (`grade10-admin-grading-batches-SC-31`,
      `grade10-admin-grading-batches-SC-32`,
      `grade10-admin-grading-batches-SC-33`,
      `grade10-site-grading-submission-lifecycle-SC-14`)
- [x] 17.8 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [x] 17.9 Write `receiveBatch`: the box recorded back at the shop under the
      batch lock, `received_at` stamped and `receive` moving each member
      `graded → returned` with one event each, refused by name on a batch not
      shipped, and a repeat writing nothing; the manifest, the invoice and the
      scans refused until it has run
      (`grade10-admin-grading-batches-SC-05`)
- [x] 17.10 Write `resolveManifestLine`: an unmatched line settled by staff
      naming the batch's card it meant, or closed as the grader's error with a
      reason kept on the line, never in the history; finishing holds only on
      a line settled neither way
      (`grade10-admin-grading-batches-SC-24`,
      `grade10-admin-grading-batches-SC-51`)
- [ ] 17.11 Match a manifest line in a later batch at the same grader to a
      card recorded held in an earlier received batch by its intake id, let
      `resolveManifestLine` name such a card, and have its scan record cert,
      grade and the grader's words and clear `held`, its collector sent the
      grades for that card the day it is scanned, its tests red first; then
      run 17.9's checks (Q142, `grade10-admin-grading-batches-SC-58`,
      `grade10-admin-grading-counter-SC-36`)

## 18. Hand-back, collection and the vault case (grade10)

Stage (c).

- [x] 18.1 Cover the hand-back: the code and the name, the glance above the
      threshold, what is due taken first, the ticks and the photographs, the
      mint refused on a balance due and on an unticked item, the seal that
      closes the submission and the second one that closes it later, the vault
      case, and the audit row each act writes
      (`grade10-admin-grading-counter-SC-29`,
      `grade10-admin-grading-counter-SC-37`,
      `grade10-admin-grading-counter-SC-38`,
      `grade10-admin-grading-counter-SC-39`,
      `grade10-admin-grading-counter-SC-91`,
      `grade10-admin-grading-counter-SC-92`,
      `grade10-admin-grading-counter-SC-30`,
      `grade10-admin-grading-counter-SC-31`,
      `grade10-admin-grading-counter-SC-32`,
      `grade10-admin-grading-counter-SC-33`,
      `grade10-admin-grading-counter-SC-34`,
      `grade10-admin-grading-counter-SC-43`,
      `grade10-admin-grading-counter-SC-44`,
      `grade10-admin-grading-counter-SC-35`,
      `grade10-admin-grading-counter-SC-36`,
      `grade10-admin-grading-counter-SC-90`,
      `grade10-admin-grading-counter-SC-40`,
      `grade10-admin-grading-counter-SC-41`,
      `grade10-site-grading-submission-lifecycle-SC-29`,
      `grade10-site-grading-submission-lifecycle-SC-30`,
      `grade10-site-grading-submission-lifecycle-SC-28`,
      `grade10-site-grading-submission-lifecycle-SC-26`,
      `grade10-site-grading-submission-lifecycle-SC-46`,
      `grade10-site-grading-submission-lifecycle-SC-34`)
- [x] 18.2 Open the hand-back on the pickup code and the name, refusing a wrong
      code as often as it is typed, handing over to the person the collector
      named with the receipt saying so, turning anybody else away with no
      override, and letting the collector collect although another person is
      named (`grade10-admin-grading-counter-SC-29`,
      `grade10-admin-grading-counter-SC-37`,
      `grade10-admin-grading-counter-SC-38`,
      `grade10-admin-grading-counter-SC-39`,
      `grade10-admin-grading-counter-SC-91`,
      `grade10-admin-grading-counter-SC-92`,
      `grade10-site-grading-submission-lifecycle-SC-29`,
      `grade10-site-grading-submission-lifecycle-SC-30`)
- [x] 18.3 Glance at an identity document above the `id_glance_threshold` and
      keep nothing of it, and ask for none below it
      (`grade10-admin-grading-counter-SC-30`,
      `grade10-admin-grading-counter-SC-31`,
      `grade10-site-grading-submission-lifecycle-SC-28`)
- [x] 18.4 Take everything due before anything is handed over, at the figure
      `dueNow` answers under the submission lock
      (`grade10-admin-grading-counter-SC-32`,
      `grade10-site-grading-submission-lifecycle-SC-26`)
- [x] 18.5 Tick each item and photograph each slab as it is handed over, and
      hold back a card the grader still has
      (`grade10-admin-grading-counter-SC-33`,
      `grade10-admin-grading-counter-SC-34`)
- [x] 18.6 Write `mintHandBack`, pinning `hand_back_prepared { packetId,
      cards }` as a submission event at the mint and refusing `BALANCE_DUE`
      and `ITEM_UNTICKED` by name, nothing rendered and nothing handed back
      (`grade10-admin-grading-counter-SC-43`,
      `grade10-admin-grading-counter-SC-44`,
      `grade10-site-grading-counter-documents-SC-02`)
- [x] 18.7 Write `collect` as the counter's act on the completed hand-back
      packet: under the submission lock, no open packet, `dueNow === 0` at the
      pinned figure, no card `held`, idempotent on the packet id; a second
      hand-back seals a second receipt, reads who is collecting again and
      closes the submission (`grade10-admin-grading-counter-SC-35`,
      `grade10-admin-grading-counter-SC-36`,
      `grade10-admin-grading-counter-SC-90`,
      `grade10-site-grading-submission-lifecycle-SC-46`)
- [x] 18.8 Write `vaultCard`, opening the vault case from the hand-back step on
      a settled balance and holding it while anything is due
      (`grade10-admin-grading-counter-SC-40`,
      `grade10-admin-grading-counter-SC-41`,
      `grade10-site-grading-submission-lifecycle-SC-34`)
- [x] 18.9 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [x] 18.10 Write `recordSettlement` at `ready`: the store order read before the
      transaction, matched against each card's due under the lock, a line
      above a card's due refused by name, so settled never passes accrued on
      a card (`grade10-admin-grading-counter-SC-32`,
      `grade10-site-grading-submission-lifecycle-SC-26`,
      `grade10-site-grading-submission-lifecycle-SC-40`)
- [x] 18.11 Write `tickItem` under the lock: one photograph for a slab and none
      for a raw card, refused while anything is due, for a held card and for
      a card no hand-back may carry (`grade10-admin-grading-counter-SC-32`,
      `grade10-admin-grading-counter-SC-33`,
      `grade10-admin-grading-counter-SC-34`)
- [x] 18.12 Close each hand-back on its own: `collect` stamps the cards its
      receipt printed and writes a `handed_back` event naming the packet,
      moves to `collected` only once no card is left, accepts only the newest
      sealed hand-back, and judges what is due as of the mint; storage and
      the ladder stop on a card handed back; the second receipt prints only
      its own cards and names the first; the mint and the vault take the
      pickup code or the glance themselves (`grade10-admin-grading-counter-SC-36`,
      `grade10-admin-grading-counter-SC-37`,
      `grade10-admin-grading-counter-SC-43`,
      `grade10-admin-grading-counter-SC-90`,
      `grade10-admin-grading-counter-SC-91`)
- [x] 18.13 Withdraw a card and issue its receipt in one transaction, the
      receipt its own document with its own clauses, listed with the
      submission's papers and answered by the digest check
      (`grade10-admin-grading-counter-SC-54`,
      `grade10-site-grading-counter-documents-SC-20`)

## 19. Payouts, waivers and what is due (grade10)

Stage (c).

- [x] 19.1 Cover the records: the four-eyes CHECK refusing an approver who is
      the recorder, `PAYOUT_EXISTS` on the netted read, the reversal, the
      waiver's window and its grant, the settlement rule storage rides, and the
      audit row each act writes (`grade10-admin-grading-counter-SC-62`,
      `grade10-admin-grading-counter-SC-63`,
      `grade10-admin-grading-counter-SC-64`,
      `grade10-admin-grading-counter-SC-96`,
      `grade10-admin-grading-counter-SC-97`,
      `grade10-admin-grading-counter-SC-59`,
      `grade10-admin-grading-counter-SC-60`,
      `grade10-admin-grading-counter-SC-61`,
      `grade10-admin-grading-counter-SC-95`,
      `grade10-site-grading-submission-lifecycle-SC-41`,
      `grade10-site-grading-submission-lifecycle-SC-43`,
      `grade10-site-grading-submission-lifecycle-SC-42`,
      `grade10-site-grading-submission-lifecycle-SC-40`)
- [x] 19.2 Write `recordPayout` over the append-only `payouts` table — the
      declared value, the fee refund line beside it, the route till or transfer
      with its reference, `recorded_by` and `approved_by` — refusing
      `SAME_APPROVER` and `PAYOUT_EXISTS` on the netted read under the
      submission lock, and saying on the record when it was made late
      (`grade10-admin-grading-counter-SC-62`,
      `grade10-admin-grading-counter-SC-63`,
      `grade10-admin-grading-counter-SC-96`,
      `grade10-admin-grading-counter-SC-97`,
      `grade10-site-grading-submission-lifecycle-SC-41`)
- [x] 19.3 Write `reversePayout` as one `payout_reversals` row keyed
      `payout_id`, so a card that turns up reverses its payout on the record
      rather than deleting it, its reason refused empty at the act's input
      schema, never by the column, per `docs/architecture/grading.md`'s
      exceptions table (`grade10-admin-grading-counter-SC-64`,
      `grade10-site-grading-submission-lifecycle-SC-43`)
- [x] 19.4 Write `waiveUpcharge` over `upcharge_waivers` with the same two
      approver columns and a reason, refused before the cards are back,
      refused when the second person holds no `grading:approve`, and refused
      with an empty reason at the act's input schema, never by the column,
      per `docs/architecture/grading.md`'s exceptions table
      (`grade10-admin-grading-counter-SC-59`,
      `grade10-admin-grading-counter-SC-60`,
      `grade10-admin-grading-counter-SC-61`,
      `grade10-admin-grading-counter-SC-95`)
- [x] 19.5 Tell the collector a damaged card the same day and pay it out at its
      declared value with its fee back
      (`grade10-site-grading-submission-lifecycle-SC-42`)
- [x] 19.6 Settle storage the way every other kind settles — accrued less the
      settled lines less the waivers — so a storage fee rung at the till clears
      and `collect` can pass
      (`grade10-site-grading-submission-lifecycle-SC-40`)
- [x] 19.7 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [x] 19.8 Write the approval pair: `admin.requestApproval` records the
      recorder's request for a waiver, a payout or a reversal with its reason
      and moves no money; `admin.approveRequest` is a second `grading:approve`
      holder's own call, refused for the recorder, refused on a stale
      request, and writes the record naming both from their sessions, once
      per request (`grade10-admin-grading-counter-SC-60`,
      `grade10-admin-grading-counter-SC-95`,
      `grade10-admin-grading-counter-SC-103`)
- [ ] 19.9 Write `0005_waivers_kind.sql` as the Migration Plan names it; then
      `waive` in place of `waiveUpcharge`, the ask and the record carrying
      `kind` and `dueNow` netting each kind against its own waivers, its
      tests red first; then run 19.7's checks
      (`grade10-admin-grading-counter-SC-109`,
      `grade10-admin-grading-counter-SC-59`,
      `grade10-site-grading-submission-lifecycle-SC-40`)
- [ ] 19.10 Put a reversed payout and its refunded fee back on the submission as
      one `repayment` due — `money_lines.kind` and `DUE_KINDS` taking it in
      19.9's migration, `pos_repayment_variant` ringing it, Q47's no-earn rule
      covering it and no waiver reaching it — settled at the till by
      `recordSettlement` as any due line, so the hand-back is refused while it
      is unpaid, its test red first (Q131, Q138,
      `grade10-admin-grading-counter-SC-110`,
      `grade10-site-grading-submission-lifecycle-SC-68`)
- [ ] 19.11 Write `0006_payout_received.sql` as the Migration Plan names it; then
      add `markPayoutReceived` under `grading:approve`: a till payout stamped
      received at recording, a transfer only by this act, moving no money and
      refusing a payout already received by name; the console's Money tab
      offers Mark received on a transfer not yet received (Q132,
      `grade10-admin-grading-counter-SC-111`)
- [ ] 19.12 Hand back a card whose payout was reversed on a `collected`
      submission: settle its repayment, mint a receipt for that card alone and
      hand it over or vault it, the submission staying `collected`, its tests
      red first; then run 19.7's checks (Q137,
      `grade10-admin-grading-counter-SC-114`)
- [ ] 19.13 Start a card's storage at day 90 after the later of the ready day
      and the day it came back to the shop in `dueByCard`, months counted on the
      shop's days, its tests red first; then run 19.7's checks (Q141,
      `grade10-site-grading-submission-lifecycle-SC-66`,
      `grade10-site-grading-submission-lifecycle-SC-67`)
- [ ] 19.14 Refund only the fee line on the payout path, the cover kept, and
      cover a storage waiver in `settlement.ts`'s netting with a test, its
      tests red first; then run 19.7's checks (Q138,
      `grade10-admin-grading-counter-SC-62`,
      `grade10-site-grading-submission-lifecycle-SC-41`)

## 20. The uncollected ladder and the written notice (grade10)

Stage (c).

- [x] 20.1 Cover the ladder and the notice: the rungs read off
      `uncollectedLadder`, the naming that does not pause them, the posting
      date the thirty days run from, what is offered after them, and the audit
      row each act writes (`grade10-site-grading-submission-lifecycle-SC-35`,
      `grade10-site-grading-submission-lifecycle-SC-57`,
      `grade10-site-grading-submission-lifecycle-SC-36`,
      `grade10-site-grading-submission-lifecycle-SC-37`,
      `grade10-admin-grading-counter-SC-65`,
      `grade10-admin-grading-counter-SC-66`,
      `grade10-admin-grading-counter-SC-67`,
      `grade10-admin-grading-counter-SC-68`,
      `grade10-site-grading-collector-notifications-SC-15`)
- [x] 20.2 Read every rung off group 10's `uncollectedLadder` for the
      submission's `ready_at` and its pinned terms, counting no date of its
      own, and leave the ladder running when a collector is named
      (`grade10-site-grading-submission-lifecycle-SC-35`,
      `grade10-site-grading-submission-lifecycle-SC-57`)
- [x] 20.3 Write `recordNoticePosted` as the counter's act from the Notice due
      rung, refusing before `notice_day`, taking the posting date and the
      tracking together, and writing one `notices` row per submission so a
      double-click is a no-op (`grade10-admin-grading-counter-SC-65`,
      `grade10-admin-grading-counter-SC-66`)
- [ ] 20.4 Run the pinned `notice_period_days` from the posting date (see 20.6), offer nothing further
      once they have passed, and leave the cards the collector's
      (`grade10-admin-grading-counter-SC-67`,
      `grade10-admin-grading-counter-SC-68`,
      `grade10-site-grading-submission-lifecycle-SC-36`,
      `grade10-site-grading-submission-lifecycle-SC-37`,
      `grade10-site-grading-collector-notifications-SC-15`)
- [x] 20.5 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [ ] 20.6 Write `0007_notice_period.sql` as the Migration Plan names it; then
      `notice_period_days` in `GRADING_SEEDED_SETTINGS`, pinned as the
      seventh term and read by `noticeEnds`, clause 6 and the notice letter,
      `pinnedTermsOf` throwing on a term missing and `NOTICE_PERIOD_DAYS`
      deleted, their tests red first; then run 20.5's checks
      (`grade10-admin-grading-counter-SC-67`,
      `grade10-admin-grading-counter-SC-68`,
      `grade10-site-grading-submission-lifecycle-SC-36`,
      `grade10-site-grading-submission-lifecycle-SC-37`,
      `grade10-site-grading-collector-notifications-SC-13`)
- [ ] 20.7 Rewrite the four notice walks of `uncollected.spec.ts` to the 90
      days pinned and move their acceptance links to
      `grade10-site-grading-submission-lifecycle-US8-TC3-2`,
      `grade10-site-grading-submission-lifecycle-US8-TC4-2`,
      `grade10-admin-grading-counter-US12-TC4-2` and
      `grade10-admin-grading-counter-US12-TC5-2`; then run 20.5's checks
      (`grade10-admin-grading-counter-SC-67`,
      `grade10-admin-grading-counter-SC-68`,
      `grade10-site-grading-submission-lifecycle-SC-36`,
      `grade10-site-grading-submission-lifecycle-SC-37`)
- [ ] 20.8 Skip every rung, the storage letter, the notice and the ready letter
      for a submission with no card left on the ladder, and count every rung
      on the `Asia/Hong_Kong` day, its tests red first; then run 20.5's checks
      (Q146, `grade10-site-grading-submission-lifecycle-SC-64`,
      `grade10-site-grading-submission-lifecycle-SC-65`)

## 21. The sweeps (grade10)

Stage (c). No case in the change's suites decides the repair lists of 21.7 or
the slow lane of 21.8; walk 34 decides them.

- [x] 21.1 Cover the pass: the list order pinned by a test, every per-row list
      claimed under `claimRow` with two overlapping passes, the partial unique
      behind the once-per-submission kinds, and each list's query shape
      (`grade10-site-grading-submission-plan-SC-43`,
      `grade10-site-grading-submission-plan-SC-44`,
      `grade10-site-grading-submission-plan-SC-59`,
      `grade10-site-grading-submission-lifecycle-SC-49`,
      `grade10-site-grading-dropoff-booking-SC-18`,
      `grade10-site-grading-dropoff-booking-SC-19`,
      `grade10-site-grading-collector-notifications-SC-09`,
      `grade10-site-grading-collector-notifications-SC-10`,
      `grade10-site-grading-collector-notifications-SC-11`,
      `grade10-site-grading-collector-notifications-SC-12`,
      `grade10-site-grading-collector-notifications-SC-14`,
      `grade10-site-grading-collector-notifications-SC-16`,
      `grade10-site-grading-collector-notifications-SC-17`,
      `grade10-site-grading-collector-notifications-SC-18`,
      `grade10-site-grading-collector-notifications-SC-25`,
      `grade10-site-vault-retention-and-erasure-SC-28`,
      `grade10-site-vault-retention-and-erasure-SC-29`,
      `grade10-site-vault-retention-and-erasure-SC-30`)
- [x] 21.2 Write `sweeps/pass.ts` over `createSweepPass` with `WORK_LISTS`
      laned and ordered, every row carrying its `kind` and its `limit`, so
      `grading.sweep.repair` fires for the repair lists alone, keeping group
      11's `attemptsPruned`, the slow lane's retention on `plan_attempts`
- [x] 21.3 Write the due letters as four registry rows, each with its own
      limit, cursor and due window in its query — `planNudges` at
      twenty-one days, `visitReminders` the day before for every submission
      on the visit, a joiner through its owner's booking,
      `uncollectedReminders` for the thirty- and sixty-day pair naming what
      being reminded costs, and `storageStarted` the day the fee starts —
      read off `uncollectedLadder`'s rungs and each claimed so a rung told
      twice is told once
      (`grade10-site-grading-submission-plan-SC-43`,
      `grade10-site-grading-collector-notifications-SC-09`,
      `grade10-site-grading-collector-notifications-SC-11`,
      `grade10-site-grading-collector-notifications-SC-12`,
      `grade10-site-grading-collector-notifications-SC-14`)
- [x] 21.4 Write `planExpiry` and `expiredBooked`, a plan nobody books expiring
      at `plan_expiry_days` owing nothing, one with a drop-off booked not
      expiring, a booked submission holding no visit expiring on the plan's
      own clock through `booking/standing.ts`'s `planClock`, restarted from a
      missed visit for every submission on it, and a booked submission
      expiring `booked_expiry_days` after its visit, the clock judged before
      the diary is told (`grade10-site-grading-submission-plan-SC-44`,
      `grade10-site-grading-dropoff-booking-SC-28`,
      `grade10-site-grading-submission-plan-SC-59`,
      `grade10-site-grading-submission-lifecycle-SC-49`)
- [x] 21.5 Write `missedVisits` calling
      `markOutcome(caseRef, "no_show", bookingRef)` after the grace and only
      then clearing the cache and writing `dropoff_missed` in one commit, telling
      the collector within the hour and leaving the list and the estimate as
      they were; a refused telling leaves the row due
      (`grade10-site-grading-dropoff-booking-SC-18`,
      `grade10-site-grading-dropoff-booking-SC-19`,
      `grade10-site-grading-collector-notifications-SC-10`)
- [x] 21.6 Write `retriedNotifications` over `notification_retries` on the
      vault's ladder — the cards handed in although the mail failed, the ladder
      spent and the row parked and flagged, the flag cleared only when the
      channel accepts — and `admin.resendNotification` sending a parked
      message again, on the audit chain, the lease claimed only while the row
      stands as its page read it
      (`grade10-site-grading-collector-notifications-SC-16`,
      `grade10-site-grading-collector-notifications-SC-17`,
      `grade10-site-grading-collector-notifications-SC-18`,
      `grade10-site-grading-collector-notifications-SC-25`)
- [x] 21.7 Add the fast lane's repair lists: `repairedBookings` and
      `recoveredBookings` over `visit_owner_id`, repairing a cache whose
      booking, service, shop or slot the diary no longer holds, and
      `expiredPackets`. No `sealedDeliveries` list: SC-25's attached copy is
      already carried by the step act's own letter
      (`documents/papers.ts`'s `CARRYING_STEP`), so no sweep owes a sending
      list for it — a gauge with no real predicate only fires
      `grading.sweep.repair` forever. The counter's hand-in and its
      cancel-after-last-card tell the diary the visit was kept, and only
      then clear the cache. `terminalBookingsClosed` joins this lane for a
      `cancelled` or `expired` row still caching a visit — one the diary
      could not be told at the counter — closing the booking behind it,
      `cancel` for a future slot and `no_show` for a past one; a collected
      row's visit was kept and is never closed as missed
      (`grade10-site-grading-counter-documents-SC-25`)
- [x] 21.8 Add the vault's six slow-lane lists — `verifiedChainRows`,
      `archivedObjects`, `verifiedDigests`, `retentionReviews`, `fontAsset` and
      `orphanedObjects`
- [x] 21.9 Date each submission in `retentionReviews` from its last terminal
      event, report it under each class it holds and report one that has not
      ended under none (`grade10-site-vault-retention-and-erasure-SC-28`,
      `grade10-site-vault-retention-and-erasure-SC-29`,
      `grade10-site-vault-retention-and-erasure-SC-30`)
- [x] 21.10 Verify: `node scripts/checks/check-crons.mjs`,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [ ] 21.11 Restart the plan's clock from a cancelled visit as from a missed
      one, its test red first: `lastVisitEndedAt` over `dropoff_missed`,
      `dropoff_cancelled` and `dropoff_detached` replaces `lastMissedVisitAt`
      at every call site, and `planClockAt` takes `visitEndedAt`; `planNudges`
      reads the same clock and nudges once per clock start (Q144); then run
      21.10's checks (`grade10-site-grading-dropoff-booking-SC-31`,
      `grade10-site-grading-dropoff-booking-SC-28`,
      `grade10-site-grading-submission-plan-SC-64`)
- [ ] 21.12 Send the list-saved message once from the daily sweep for a plan kept
      with no drop-off booked as the `planLinks` list, `plan_saved` joining
      `ONCE_PER_SUBMISSION_KINDS`, never on the collector leaving the page, the
      plan read as it stands when the sweep runs (Q145); a plan already mailed
      under the old immediate send is not mailed again, its existing
      `plan_saved` row holding the once-only index; move Finish later and Save for
      later off their immediate send, and update `plan.spec.ts`'s
      `US6-TC1-1` walk to read the letter after the sweep (Q134,
      `grade10-site-grading-submission-plan-SC-38`,
      `grade10-site-grading-collector-notifications-SC-26`,
      `grade10-site-grading-collector-notifications-SC-28`)

## 22. The letters (grade10)

Needs group 5 merged to this store's `main`: the render test reads the store's
fixtures through `external/grade10-spec`. Stage (c).

- [x] 22.1 Cover the catalogue as one table over `LETTERS`, kind to blocks and
      attachments, reading the store's fixtures, with `NOTIFY_FOR_EVENT`
      exhaustive over every `SubmissionEventKind` and one render snapshot per
      drawn state (`grade10-site-grading-collector-notifications-SC-01`,
      `grade10-site-grading-collector-notifications-SC-02`,
      `grade10-site-grading-collector-notifications-SC-06`,
      `grade10-site-grading-collector-notifications-SC-07`,
      `grade10-site-grading-collector-notifications-SC-03`,
      `grade10-site-grading-collector-notifications-SC-04`,
      `grade10-site-grading-collector-notifications-SC-05`,
      `grade10-site-grading-collector-notifications-SC-24`,
      `grade10-site-grading-collector-notifications-SC-19`,
      `grade10-site-grading-collector-notifications-SC-20`,
      `grade10-site-grading-collector-notifications-SC-23`,
      `grade10-site-grading-collector-notifications-SC-21`,
      `grade10-site-grading-collector-notifications-SC-22`,
      `grade10-site-grading-collector-notifications-SC-08`,
      `grade10-admin-grading-counter-SC-77`,
      `grade10-site-grading-collector-notifications-SC-13`)
- [x] 22.2 Write `notify/vocabulary.ts` with `NOTIFY_FOR_EVENT` exhaustive over
      every event kind and `null` written for each silence, so the same event
      always decides the same message: a card refused at the counter and a
      collector named on the page send nothing
      (`grade10-site-grading-collector-notifications-SC-01`,
      `grade10-site-grading-collector-notifications-SC-02`,
      `grade10-site-grading-collector-notifications-SC-06`,
      `grade10-site-grading-collector-notifications-SC-07`)
- [x] 22.3 Compose `email/letters/GradingLetter.tsx` over
      `@grade10/email/render`'s `BaseLayout` with `CardSchedule`, `PickupCard`
      and `UncollectedLadder` beside the shared blocks, every message's action
      link opening the submission it is about at its own address with no
      account asked for (`grade10-site-grading-collector-notifications-SC-03`)
- [x] 22.4 Write `LETTERS: Record<NotifyKind, Letter>` over the twenty kinds —
      nineteen messages, the hand-back receipt drawn as two kinds —
      each saying only what is true of the submission it names, the handed-in
      letter carrying the papers, a letter with no document attaching nothing,
      and the written notice naming what is due, the pickup code, the thirty
      days from the posting date and the clause it acts under
      (`grade10-site-grading-collector-notifications-SC-04`,
      `grade10-site-grading-collector-notifications-SC-05`,
      `grade10-site-grading-collector-notifications-SC-24`,
      `grade10-site-grading-collector-notifications-SC-13`)
- [x] 22.5 End every letter with the submission's line and the shop's footer,
      print every date in the shop's zone, and send one channel in one language
      (`grade10-site-grading-collector-notifications-SC-19`,
      `grade10-site-grading-collector-notifications-SC-20`,
      `grade10-site-grading-collector-notifications-SC-23`)
- [x] 22.6 Draft each letter as its act's last step inside the act's
      transaction, rendered there so `printedValue` prints the marked bracket
      outside production and refuses the act in production rather than
      sending a blank; post it after the commit, the retry row keeping the
      drafted facts
      (`grade10-site-grading-collector-notifications-SC-21`,
      `grade10-site-grading-collector-notifications-SC-22`)
- [x] 22.7 Send `plan_expired` for a booked submission that expires, keep every
      drop-off message the submission's, and send no email or push to any
      member of staff (`grade10-site-grading-collector-notifications-SC-08`,
      `grade10-admin-grading-counter-SC-77`)
- [x] 22.8 Build the facts once per send and honour `notification_retries`'s
      recorded figures over a re-derivation, classifying a permanent send
      failure as the vault does
- [x] 22.9 Verify: `pnpm run check:submodules`, `pnpm run typecheck`,
      `pnpm run lint`, `pnpm run test:backend`
- [ ] 22.10 Print the shop's weekly hours from the diary and the shop phone in every
      letter's footer, and name the brand's main shop, the setting
      `main_shop_id`, on a submission with no visit (Q135, Q136,
      `grade10-site-grading-collector-notifications-SC-27`)
- [ ] 22.11 Hold a sweep letter that would print an unset value in production:
      the row stays due and unclaimed and `grading.sweep.repair` names the
      value, its test red first (`grade10-site-grading-collector-notifications-SC-30`)

## 23. Retention and erasure (grade10)

Stage (c). From group 11 a collector's row holds an email, a name, a phone
and a named collector, and `plan_attempts` holds the address each plan was
asked under; this group erases them and moves grading into `CONSUMERS`, and
the product does not open to collectors in production before it lands. Until
it does, the grading worker refuses every collector write in production by
name (`GRADING_NOT_OPEN`) and keeps the reads open; 23.6 removes the refusal.

- [x] 23.1 Cover erasure in the portable suite `src/testing/suites/erasure.ts`
      against the committed migrations: the three holds by name, the ask
      withheld in words, the `collected` arm that keeps the packets and the
      never-signed arm that purges whole
      (`grade10-site-vault-retention-and-erasure-SC-31`,
      `grade10-site-vault-retention-and-erasure-SC-32`,
      `grade10-site-vault-retention-and-erasure-SC-38`,
      `grade10-site-vault-retention-and-erasure-SC-33`,
      `grade10-site-vault-retention-and-erasure-SC-34`,
      `grade10-site-vault-retention-and-erasure-SC-35`,
      `grade10-site-vault-retention-and-erasure-SC-36`,
      `grade10-site-vault-retention-and-erasure-SC-37`)
- [x] 23.2 Write `erasure/eraseUser.ts` with the subject `{userId, email}`,
      the address resolved from the directory when the console sends none
      and refused by name where the directory has no row for the id; the
      holds `live_submission` from `booked` through `ready`, `money_due`
      where `dueNow > 0` at `ready`, and `ready_uncollected`, each refused
      by name and leaving the rest of the account alone; a submission
      nobody booked refuses nothing
      (`grade10-site-vault-retention-and-erasure-SC-31`,
      `grade10-site-vault-retention-and-erasure-SC-32`,
      `grade10-site-vault-retention-and-erasure-SC-38`)
- [x] 23.3 Withhold the ask in the collector's own words while cards are out,
      and hold nothing back once every submission has ended
      (`grade10-site-vault-retention-and-erasure-SC-33`,
      `grade10-site-vault-retention-and-erasure-SC-34`)
- [x] 23.4 Keep a `collected` submission's sealed packets and photographs under
      `signed_documents` and purge the contact, the address, the named
      collector and the actor ids; purge one nobody signed whole,
      `eraseCeremonyPersonalData` included
      (`grade10-site-vault-retention-and-erasure-SC-35`,
      `grade10-site-vault-retention-and-erasure-SC-36`)
- [x] 23.5 Delete the owed mail and keep the history's entries under the
      append-only guards' `redactable` lists, `submission_events` redacting its
      actor alone (`grade10-site-vault-retention-and-erasure-SC-37`)
- [x] 23.6 Add `erasure.erase` and `erasure.holds` on the vault's router shape,
      and join `appointment:grading` to `check-erasure-consumers.mjs`'s `ids`,
      the console's erasure checklist and its `ERASURE_PRODUCTS`; once erasure
      runs, remove the collector rung's production refusal and its
      `GRADING_NOT_OPEN` code
- [x] 23.7 Verify: `node scripts/checks/check-erasure-consumers.mjs`,
      `pnpm --dir packages/api-docs run generate` and commit its output,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [x] 23.8 Read grading's holds on Your data beside the vault's, through the
      site's own grading client, each block failing on its own, the ask
      withheld while any hold of either product stands and each named in the
      collector's words (`grade10-site-vault-retention-and-erasure-SC-33`)
- [ ] 23.9 Date `retentionReviews` from the later of a submission's terminal event
      and the day nothing is owed either way, and refuse an erasure while money
      is due on a submission at any status, a repayment included, its tests
      red first; then run 23.7's checks (Q20,
      `grade10-site-vault-retention-and-erasure-SC-42`,
      `grade10-site-vault-retention-and-erasure-SC-43`)

## 24. The console's reads, the settings and the grants (grade10)

Stage (b).

- [x] 24.1 Cover the reads with both halves — the query shape and the rows: one
      `GROUP BY status` folded onto the seven cuts, the Today strip in slot
      order, the cursor, the row's own fields and every badge worked out at the
      read, the four tiles' folds, the timeline, the settings' refusals and the
      audit trail (`grade10-admin-grading-counter-SC-01`,
      `grade10-admin-grading-counter-SC-02`,
      `grade10-admin-grading-counter-SC-03`,
      `grade10-admin-grading-counter-SC-04`,
      `grade10-admin-grading-counter-SC-85`,
      `grade10-admin-grading-counter-SC-86`,
      `grade10-admin-grading-counter-SC-06`,
      `grade10-admin-grading-counter-SC-07`,
      `grade10-admin-grading-counter-SC-08`,
      `grade10-admin-grading-counter-SC-09`,
      `grade10-admin-grading-counter-SC-10`,
      `grade10-admin-grading-counter-SC-11`,
      `grade10-admin-grading-counter-SC-12`,
      `grade10-admin-grading-counter-SC-13`,
      `grade10-admin-grading-counter-SC-87`,
      `grade10-admin-grading-counter-SC-56`,
      `grade10-admin-grading-counter-SC-57`,
      `grade10-admin-grading-counter-SC-58`,
      `grade10-admin-grading-counter-SC-69`,
      `grade10-admin-grading-counter-SC-70`,
      `grade10-admin-grading-counter-SC-71`,
      `grade10-admin-grading-counter-SC-76`,
      `grade10-admin-grading-counter-SC-78`,
      `grade10-admin-grading-counter-SC-79`,
      `grade10-admin-grading-counter-SC-80`,
      `grade10-admin-grading-counter-SC-84`,
      `grade10-admin-grading-batches-SC-09`,
      `grade10-admin-grading-batches-SC-49`)
- [x] 24.2 Add `admin.queue` and `admin.queueCounts` — one `GROUP BY status`
      folded onto the seven cuts with every status in exactly one home, the
      Today cut carrying the day's drop-offs in slot order, a page resuming on
      its cursor, and a plan nobody booked off the queue
      (`grade10-admin-grading-counter-SC-01`,
      `grade10-admin-grading-counter-SC-02`,
      `grade10-admin-grading-counter-SC-03`,
      `grade10-admin-grading-counter-SC-04`,
      `grade10-admin-grading-counter-SC-85`)
- [x] 24.3 Carry on each row the submission id, the collector, the card count,
      the grader and level, the collector's status word, the visit, when it was
      last touched, and every reason it waits on somebody — the drop-off today,
      uncollected at thirty days, the notice due at a hundred and eighty, a
      payout past its window and a letter that ran out of attempts — each
      worked out from the submission's own dates at the read and never written
      down (`grade10-admin-grading-counter-SC-86`,
      `grade10-admin-grading-counter-SC-11`,
      `grade10-admin-grading-counter-SC-06`,
      `grade10-admin-grading-counter-SC-07`,
      `grade10-admin-grading-counter-SC-08`,
      `grade10-admin-grading-counter-SC-09`,
      `grade10-admin-grading-counter-SC-10`)
- [x] 24.4 Add `admin.tiles` — the ready slabs still in the safe against its
      declared cap, what is owed, the batch closing and the batches with
      graders — folded at one instant in the brand's zone; a closed batch with
      no submission at `checked_in` neither ships nor counts; the closing
      batch's cards, submissions and who may still join it today are
      `admin.tiles`' own. Add `admin.batchTiles` beside it for the Batches
      page's Tiles (GA4) state — ship today, with graders and how many past
      the estimate, back unchecked, and the safe against its cap
      (`grade10-admin-grading-counter-SC-12`,
      `grade10-admin-grading-counter-SC-13`,
      `grade10-admin-grading-counter-SC-87`,
      `grade10-admin-grading-batches-SC-09`,
      `grade10-admin-grading-batches-SC-49`)
- [x] 24.5 Add `admin.detail` with the timeline, `isCustomerEvent` deciding who
      sees an entry so a staff-only one never reaches the collector, and the
      grader's stage standing in its own words
      (`grade10-admin-grading-counter-SC-56`,
      `grade10-admin-grading-counter-SC-57`,
      `grade10-admin-grading-counter-SC-58`)
- [x] 24.6 Add `admin.updateSetting` under `grading:approve` over group 9's
      `settings/read.ts`: a money key taking an approver who is not the caller,
      every write filed under the `settings` subject, and a surface that needs
      a key nobody has written refused by name rather than run on a default
      (`grade10-admin-grading-counter-SC-69`,
      `grade10-admin-grading-counter-SC-70`,
      `grade10-admin-grading-counter-SC-71`)
- [x] 24.7 Map every admin procedure to its grant in
      `contracts/src/permissions.ts`, pinned both ways by a test, with the
      settings read-only below `grading:approve` and the operator's
      verification standing for twelve hours
      (`grade10-admin-grading-counter-SC-76`,
      `grade10-admin-grading-counter-SC-78`,
      `grade10-admin-grading-counter-SC-79`)
- [x] 24.8 Hash-chain the audit log so one submission's trail is one query, and
      refuse independently of the console what a stale screen offers
      (`grade10-admin-grading-counter-SC-80`,
      `grade10-admin-grading-counter-SC-84`)
- [x] 24.9 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`
- [x] 24.10 Add `admin.receiving` for one batch — the manifest's lines with
      what each matched, the invoice as entered, and the counters folded from
      them: scanned of the batch's cards, matched, ungraded, the upcharges and
      their sum, and the submissions ready once finished
      (`grade10-admin-grading-batches-SC-29`)
- [x] 24.11 Add the settings page's reads under `grading:read`:
      `admin.settings`, every key with its value or unset, the owner who
      confirms it, whether it is money, who wrote and approved it and when,
      and its pending request; `admin.feeSheet`, each row with the figures it
      still lacks and its owner; and `admin.diaryServices`, the diary's
      grading services with their owner
      (`grade10-admin-grading-counter-SC-69`,
      `grade10-admin-grading-counter-SC-98`,
      `grade10-admin-grading-counter-SC-99`)
- [x] 24.12 Add `admin.updateFeeSheet` as a request, and make
      `admin.approveRequest` the one approval over every request — a money
      act, a money setting, a fee-sheet row — each asked against the
      version of the row it would write and refused by name once that row
      has moved, so a replay or a stale request never overwrites a newer
      confirmed value (`grade10-admin-grading-counter-SC-70`,
      `grade10-admin-grading-counter-SC-71`,
      `grade10-admin-grading-counter-SC-76`)
- [x] 24.13 Add `admin.pendingApprovals`, every request still waiting on a
      second approve holder, which 28.7's approvals read
      (`grade10-admin-grading-counter-SC-59`,
      `grade10-admin-grading-counter-SC-60`,
      `grade10-admin-grading-counter-SC-95`)
- [x] 24.14 Add the reference rate: `reference_usd_rate` a non-money key
      stored as the HKD cents one US dollar buys and seeded at 784 by the
      migration that renders its key into the CHECK;
      `referenceSaleInSheetCurrency` in the contracts; and `submissions.paste`
      answering each matched card's PSA 10 sale in HKD beside the USD one,
      a rate nobody wrote refused by name
      (`grade10-site-grading-submission-plan-SC-60`,
      `grade10-admin-grading-counter-SC-69`,
      `grade10-admin-grading-counter-SC-71`)
- [ ] 24.15 Add `courier_cover_minor` (money), `main_shop_id` and
      `pos_repayment_variant` to the settings, each unset until its owner
      writes it, the grant table naming every batch act under
      `grading:operate`, its tests red first (Q143, Q136,
      `grade10-admin-grading-counter-SC-116`)

## 25. The collector's home, the wizard and the paste sheet (grade10)

Needs group 10's exports and the worker of groups 11 and 24: the tests run
25.2's transport on the real router in-process, and the stories replay
recordings of those runs. `packages/storybook` arrives with
`complete-vault-collector-flow`, and its globs over
`packages/*/frontend/src/**` and `packages/*/admin-frontend/src/**` already
read this group's stories. Stage (b).

- [x] 25.1 Cover the home and the three steps: the signed-out price read, the
      home still reading and the home that cannot read, the wizard's step
      marker, the cards step's refusals, the cap and the ceiling, the level
      picker's closed reasons and the review's tick
      (`grade10-site-grading-submission-plan-SC-01`,
      `grade10-site-grading-submission-plan-SC-02`,
      `grade10-site-grading-submission-plan-SC-03`,
      `grade10-site-grading-submission-plan-SC-46`,
      `grade10-site-grading-submission-plan-SC-47`,
      `grade10-site-grading-submission-plan-SC-07`,
      `grade10-site-grading-submission-plan-SC-48`,
      `grade10-site-grading-submission-plan-SC-08`,
      `grade10-site-grading-submission-plan-SC-09`,
      `grade10-site-grading-submission-plan-SC-49`,
      `grade10-site-grading-submission-plan-SC-50`,
      `grade10-site-grading-submission-plan-SC-13`,
      `grade10-site-grading-submission-plan-SC-14`,
      `grade10-site-grading-submission-plan-SC-52`,
      `grade10-site-grading-submission-plan-SC-51`,
      `grade10-site-grading-submission-plan-SC-20`,
      `grade10-site-grading-submission-plan-SC-21`,
      `grade10-site-grading-submission-plan-SC-55`,
      `grade10-site-grading-submission-plan-SC-56`,
      `grade10-site-grading-submission-plan-SC-22`,
      `grade10-site-grading-submission-plan-SC-23`,
      `grade10-site-grading-submission-plan-SC-24`,
      `grade10-site-grading-submission-plan-SC-25`,
      `grade10-site-grading-submission-plan-SC-26`,
      `grade10-site-grading-submission-plan-SC-27`,
      `grade10-site-grading-submission-plan-SC-57`,
      `grade10-site-grading-submission-plan-SC-31`,
      `grade10-site-grading-submission-plan-SC-32`,
      `grade10-site-grading-submission-plan-SC-33`,
      `grade10-site-grading-submission-plan-SC-34`,
      `grade10-site-grading-submission-plan-SC-35`,
      `grade10-site-grading-submission-plan-SC-58`,
      `grade10-site-grading-submission-plan-SC-60`)
- [x] 25.2 Write `core/api/GradingApi.ts` over the site's `gradingTrpcClient`,
      lifting the raw token out of the address's `#t=` fragment and sending it
      as a header, so groups 25 to 30 test on the worker in-process and their
      stories replay its recordings
- [x] 25.3 Build the grading home over `GradingFeeSheet`: the lead and the four
      how-it-works lines, every grader with active levels, the price read
      before a name is given, the counter line for a card above the top
      ceiling, the submissions list still reading, unreadable, or empty
      (`grade10-site-grading-submission-plan-SC-01`,
      `grade10-site-grading-submission-plan-SC-02`,
      `grade10-site-grading-submission-plan-SC-03`,
      `grade10-site-grading-submission-plan-SC-46`,
      `grade10-site-grading-submission-plan-SC-47`,
      `grade10-site-grading-submission-plan-SC-07`,
      `grade10-site-grading-submission-plan-SC-48`)
- [x] 25.4 Build the wizard over `WizardRail`'s three steps: the step marker,
      the contact details filled in for a signed-in collector, the cards step
      opening with nothing on it, a card removed leaving the rest, a card with
      no declared value and an empty list each holding the step, the minimum
      grade costing nothing, and a card added by hand matched the way a pasted
      line is (`grade10-site-grading-submission-plan-SC-08`,
      `grade10-site-grading-submission-plan-SC-09`,
      `grade10-site-grading-submission-plan-SC-49`,
      `grade10-site-grading-submission-plan-SC-50`,
      `grade10-site-grading-submission-plan-SC-13`,
      `grade10-site-grading-submission-plan-SC-14`,
      `grade10-site-grading-submission-plan-SC-52`,
      `grade10-site-grading-submission-plan-SC-51`)
- [x] 25.5 Read the cap and the ceilings on the list: the twenty-first card
      leaving Bulk the only level open, twenty leaving every level open, the
      hundredth added at Bulk's cap, the card past it refused rather than
      dropped, and a card above Bulk's ceiling moved into a second submission
      on the same drop-off (`grade10-site-grading-submission-plan-SC-20`,
      `grade10-site-grading-submission-plan-SC-21`,
      `grade10-site-grading-submission-plan-SC-55`,
      `grade10-site-grading-submission-plan-SC-56`,
      `grade10-site-grading-submission-plan-SC-22`)
- [x] 25.6 Build the service step over `GradingLevelPicker`: one grader and one
      level for the whole list, a level closed by a declared value naming the
      card and one closed by the count naming the count, every level closed
      sending the collector to the counter, no estimate before a level is
      picked, and an open level reading its ceiling, its fee and its weeks back
      (`grade10-site-grading-submission-plan-SC-23`,
      `grade10-site-grading-submission-plan-SC-24`,
      `grade10-site-grading-submission-plan-SC-25`,
      `grade10-site-grading-submission-plan-SC-26`,
      `grade10-site-grading-submission-plan-SC-27`,
      `grade10-site-grading-submission-plan-SC-57`)
- [x] 25.7 Build the review step over `GradingReview`: the three totals, the
      per-card warning with both prices and none where no card is above a
      ceiling, the five good-to-know lines, booking refused until the statement
      is ticked, and Save for later taking no tick
      (`grade10-site-grading-submission-plan-SC-31`,
      `grade10-site-grading-submission-plan-SC-32`,
      `grade10-site-grading-submission-plan-SC-33`,
      `grade10-site-grading-submission-plan-SC-34`,
      `grade10-site-grading-submission-plan-SC-35`,
      `grade10-site-grading-submission-plan-SC-58`); the warning compares
      the paste's PSA 10 sale in HKD, 24.14's, with the ceiling
      (`grade10-site-grading-submission-plan-SC-60`)
      Reopened: `onBooked` and `onSaved` carry the plan's id and drop its
      access token, so a signed-out collector's page answers not found; ruled
      after group 31's audit, one `onKept(plan)` carrying the `KeptPlan`
      replaces both, and the page it opens lands on the picker, 27.7's; the
      review's Book sends `consented: true` on either keep, `plan` or
      `update`, so a plan kept ticked is asked nothing more; needs 11.10
      (`grade10-site-grading-submission-lifecycle-SC-60`,
      `grade10-site-grading-submission-plan-SC-62`)
- [x] 25.8 Write the stories for `Grading/Home`, `Grading/Plan/PlanWizard` and
      the paste sheet, one per distinct layout, each with `surface: site`
- [x] 25.9 Verify: `pnpm run test`,
      `pnpm --filter @grade10/storybook run test:stories`,
      `pnpm run check:libs`, `pnpm run typecheck`, `pnpm run lint`
- [x] 25.10 Open the wizard on a kept plan, its test red first:
      `usePlanWizard` reading `submissions.detail` on the `#t=` access, each
      card mapped to a `PlanCard` and its reference asked again by the card's
      name, a sale kept only for the card's own `referenceProductId`, and
      saving through `submissions.update` with the
      `updatedAt` it read, the same submission and never a second plan at
      `planned` and `booked`; the editor never books, keeping `GradingReview`
      with `onBook` and `onConsent` left out and Save changes its save's
      words; at `booked` the grader fixed and a level required; an edited card
      above the ceiling still warned; an edit the counter's list refuses read
      by name; and the stories for ui-design's Kept rows. Needs 1.8, 3.8 and
      11.11 (`grade10-site-grading-submission-lifecycle-SC-62`,
      `grade10-site-grading-submission-lifecycle-SC-59`,
      `grade10-site-grading-submission-plan-SC-32`)

## 26. The collector's drop-off screens (grade10)

Needs group 10's exports and group 25's `GradingApi` and recorded worker.
Stage (b).

- [x] 26.1 Cover the picker and the booked page: the four Before you come
      items, the Bulk duration, the vault line, the acts withdrawn once the
      visit has started, and the page that reads booked until the diary answers
      (`grade10-site-grading-dropoff-booking-SC-12`,
      `grade10-site-grading-dropoff-booking-SC-13`,
      `grade10-site-grading-dropoff-booking-SC-14`,
      `grade10-site-grading-dropoff-booking-SC-17`,
      `grade10-site-grading-dropoff-booking-SC-26`)
- [x] 26.2 Compose the picker from `BookingLocationPicker` and
      `BookingSlotPicker` for a first booking and for a move alike, with
      `BatchLine` beside the picked day carrying the cut-off, the ship day and
      the day back
- [x] 26.3 Build the booked page over `BookingConfirmation` and
      `BookingManageCard`: the visit, the four items to bring, the calendar
      file at `visit.ics`, the Bulk visit's about-45-minutes line, and the line
      saying a card that is not being graded can be vaulted on the same visit
      (`grade10-site-grading-dropoff-booking-SC-12`,
      `grade10-site-grading-dropoff-booking-SC-13`,
      `grade10-site-grading-dropoff-booking-SC-14`)
- [x] 26.4 Offer neither move nor cancel once the visit has started, and read
      the visit as booked until the diary answers it missed
      (`grade10-site-grading-dropoff-booking-SC-17`,
      `grade10-site-grading-dropoff-booking-SC-26`)
- [x] 26.5 Write the stories for `Grading/Dropoff/Dropoff Booking` and
      `Grading/Dropoff/Dropoff Booked`, each with `surface: site`
- [x] 26.6 Verify: `pnpm run test`,
      `pnpm --filter @grade10/storybook run test:stories`,
      `pnpm run check:libs`, `pnpm run typecheck`, `pnpm run lint`

## 27. The collector's submission page (grade10)

Needs group 10's exports and group 25's `GradingApi` and recorded worker.
Stage (b).

- [x] 27.1 Cover the page per status: the word, the chip and the rail, the
      grader block, the cards, the pickup card, the named collector, the
      collected record, and the acts each status offers
      (`grade10-site-grading-submission-lifecycle-SC-02`,
      `grade10-site-grading-submission-lifecycle-SC-04`,
      `grade10-site-grading-submission-lifecycle-SC-05`,
      `grade10-site-grading-submission-lifecycle-SC-06`,
      `grade10-site-grading-submission-lifecycle-SC-07`,
      `grade10-site-grading-submission-lifecycle-SC-08`,
      `grade10-site-grading-submission-lifecycle-SC-09`,
      `grade10-site-grading-submission-lifecycle-SC-11`,
      `grade10-site-grading-submission-lifecycle-SC-12`,
      `grade10-site-grading-submission-lifecycle-SC-13`,
      `grade10-site-grading-submission-lifecycle-SC-19`,
      `grade10-site-grading-submission-lifecycle-SC-25`,
      `grade10-site-grading-submission-lifecycle-SC-27`,
      `grade10-site-grading-submission-lifecycle-SC-31`,
      `grade10-site-grading-submission-lifecycle-SC-32`,
      `grade10-site-grading-submission-lifecycle-SC-33`,
      `grade10-site-grading-submission-lifecycle-SC-55`,
      `grade10-site-grading-submission-lifecycle-SC-56`,
      `grade10-site-grading-submission-lifecycle-SC-44`,
      `grade10-site-grading-submission-lifecycle-SC-45`,
      `grade10-site-grading-submission-lifecycle-SC-50`,
      `grade10-site-grading-submission-lifecycle-SC-53`)
- [x] 27.2 Render `GradingOwnershipChip` and `GradingStatusRail` from
      `submissionStanding`, deriving nothing on the page: the rail at the
      status's stage, the chip naming the grader while the cards are away, and
      an ended submission staying where it ended
      (`grade10-site-grading-submission-lifecycle-SC-02`,
      `grade10-site-grading-submission-lifecycle-SC-04`,
      `grade10-site-grading-submission-lifecycle-SC-05`,
      `grade10-site-grading-submission-lifecycle-SC-06`,
      `grade10-site-grading-submission-lifecycle-SC-53`)
- [x] 27.3 Build `GraderStagesCard`: the grader's stage in its own words, the
      estimate counted from the day the batch left, the running-late line past
      it, a re-estimated day shown the day it is set, and nothing to do while
      the cards are away
      (`grade10-site-grading-submission-lifecycle-SC-07`,
      `grade10-site-grading-submission-lifecycle-SC-08`,
      `grade10-site-grading-submission-lifecycle-SC-09`,
      `grade10-site-grading-submission-lifecycle-SC-10`,
      `grade10-site-grading-submission-lifecycle-SC-11`)
- [x] 27.4 Render the cards over `GradingCardRecord` and `GradingGradeCards` —
      one outcome line per card, three ready while one did not come back — and
      offer a review as a new submission
      (`grade10-site-grading-submission-lifecycle-SC-12`,
      `grade10-site-grading-submission-lifecycle-SC-13`,
      `grade10-site-grading-submission-lifecycle-SC-14`,
      `grade10-site-grading-submission-lifecycle-SC-17`,
      `grade10-site-grading-submission-lifecycle-SC-19`)
- [ ] 27.5 Render `GradingPickupCard` and `GradingNamedCollector` on a ready
      submission: the code, the hours and the one figure to settle or none, a
      name saved and replaced, an empty name naming nobody, Remove leaving
      nobody named, and naming refused once the cards are collected
      (`grade10-site-grading-submission-lifecycle-SC-25`,
      `grade10-site-grading-submission-lifecycle-SC-27`,
      `grade10-site-grading-submission-lifecycle-SC-31`,
      `grade10-site-grading-submission-lifecycle-SC-32`,
      `grade10-site-grading-submission-lifecycle-SC-33`,
      `grade10-site-grading-submission-lifecycle-SC-55`,
      `grade10-site-grading-submission-lifecycle-SC-56`)
      Reopened: the page renders no ladder, since the detail carries none;
      ruled after group 34's walk, the page composes
      `GradingUncollectedLadder` from `SubmissionDetail.ladder`, counting
      nothing: each rung with its day and passed once reached, the cards
      held, and the notice's posting date, the days left of the 30 and the
      day they end. Test red first
      (`grade10-site-grading-submission-lifecycle-SC-35`,
      `grade10-site-grading-submission-lifecycle-SC-36`,
      `grade10-site-grading-submission-lifecycle-SC-37`,
      `grade10-site-grading-submission-lifecycle-SC-57`)
- [x] 27.6 Build `WhatNextCard` and `YourDataLine` on the collected page, the
      record carrying the grade, the cert and the papers, and no collected slab
      reading as the shop's stock
      (`grade10-site-grading-submission-lifecycle-SC-44`,
      `grade10-site-grading-submission-lifecycle-SC-45`)
- [x] 27.7 Offer each status its own acts and no others, through `useConfirm`
      where the act cannot be taken back
      (`grade10-site-grading-submission-lifecycle-SC-50`)
      Reopened: at `planned`, Book and Join go to `bookHref` and no page books
      a first drop-off; ruled after group 31's audit, the page opens
      `DropoffBooking` wherever the submission holds no visit and `book` is
      offered, never for `join`, and `bookHref` goes; a plan held unticked is
      asked for the statement, in the review's words, before the picker or
      the join, and sends `consented: true` on the `book` or `join` it asked
      for. Test red first;
      needs 11.10 and 12.12
      (`grade10-site-grading-submission-plan-SC-42`,
      `grade10-site-grading-dropoff-booking-SC-04`,
      `grade10-site-grading-dropoff-booking-SC-20`,
      `grade10-site-grading-submission-plan-SC-61`,
      `grade10-site-grading-submission-plan-SC-63`)
- [x] 27.8 Write the stories for `Grading/Submission/Submission Page`, one per
      distinct layout, the varied value an args control, each with
      `surface: site`
- [x] 27.9 Verify: `pnpm run test`,
      `pnpm --filter @grade10/storybook run test:stories`,
      `pnpm run check:libs`, `pnpm run typecheck`, `pnpm run lint`
- [x] 27.10 Build grading's sign page at `/grading/sign`, mounting
      `CeremonyFlow` with `host: "grading"` and grading's ceremony words, one
      refusal per code: the postal address line on the agreement, the named
      person's name held and not taking an edit, and a used link pointing at
      the copy at the counter and on the submission page, with a story per
      design state (`grade10-site-grading-counter-documents-SC-06`,
      `grade10-site-grading-counter-documents-SC-11`,
      `grade10-site-grading-counter-documents-SC-17`,
      `grade10-site-grading-counter-documents-SC-29`)
- [x] 27.11 Show a payout on the card it pays for: the amount, the route, the
      day it was recorded, and a reversal once the card turns up
      (`grade10-site-grading-submission-lifecycle-SC-41`,
      `grade10-site-grading-submission-lifecycle-SC-43`)
- [x] 27.12 Build the page's own `SubmissionAccess` from the address's `#t=`
      fragment with `core/api/accessToken.ts`'s `accessFromHash`
      (`accessTokenFromHash` underneath it), sent as the access header on
      every read and act the page makes — the token group 25.2 lifts out is
      wired in here, at the one page that reads it

- [ ] 27.13 Pass the pinned notice period into `ladder.noticeLine`'s
      `{period}` from the detail's terms, its test red first; needs 1.9,
      and lands with stage (c) after 20.6; then run 27.9's checks
      (`grade10-site-grading-submission-lifecycle-SC-36`)
- [ ] 27.14 Link a vaulted card's case by resolving its recorded reference at each
      read of the submission page, the reference as plain text where no case
      matches (Q133, `grade10-site-grading-submission-lifecycle-SC-63`)

## 28. The console's queue, tiles and one submission (grade10)

Needs group 10's exports and group 25's recorded worker. Stage (b).

- [x] 28.1 Cover the console's reads and tabs: a view with nothing in it, the
      header and the four tabs, the money tab against the till, the id that
      resolves to nothing, and every act the operator's grants withhold
      (`grade10-admin-grading-counter-SC-05`,
      `grade10-admin-grading-counter-SC-50`,
      `grade10-admin-grading-counter-SC-51`,
      `grade10-admin-grading-counter-SC-52`,
      `grade10-admin-grading-counter-SC-53`,
      `grade10-admin-grading-counter-SC-94`,
      `grade10-admin-grading-counter-SC-75`,
      `grade10-admin-grading-counter-SC-82`,
      `grade10-admin-grading-counter-SC-83`,
      `grade10-admin-grading-counter-SC-100`)
- [x] 28.2 Build `QueuePanel` over `@grade10/frontend-console`: the seven
      `Choice`s with their counts, the Today strip, the four `Figure` tiles,
      the table with the badge column and the collector's status word, and a
      cut with nothing in it saying so (`grade10-admin-grading-counter-SC-05`)
- [x] 28.3 Build `SubmissionPanel`: the header answering the phone, the cards
      tab carrying each card's record, the money tab reading the till's figure,
      the documents and timeline tabs, staff reaching the collector from the
      header, and a submission id that resolves to nothing saying so; the
      timeline words the kinds `STAFF_ONLY_EVENT_KINDS` holds in the
      console's own English, each marked Staff only: `reference_unavailable`
      "Price reference unavailable for N of the list: kept as typed",
      `booking_cache_repaired` "Booking copy put back in step with the diary"
      and `card_checked` "<card> checked at the desk, declared <amount>:
      note and photographs", with ", condition noted" where one was
      (`grade10-admin-grading-counter-SC-50`,
      `grade10-admin-grading-counter-SC-51`,
      `grade10-admin-grading-counter-SC-52`,
      `grade10-admin-grading-counter-SC-53`,
      `grade10-admin-grading-counter-SC-94`)
- [x] 28.4 Offer only the acts the operator's grants and the submission's
      status allow, keep Cancel off a submission whose cards have left, offer
      the acts of every grant an operator holds, and read the worker's refusal
      where a stale screen offered one (`grade10-admin-grading-counter-SC-75`,
      `grade10-admin-grading-counter-SC-82`,
      `grade10-admin-grading-counter-SC-83`,
      `grade10-admin-grading-counter-SC-100`)
- [x] 28.5 Write the stories for `Grading/Admin/Queue` and
      `Grading/Admin/Submission`, each with `surface: console`
- [x] 28.6 Verify: `pnpm run test`, `pnpm run check:app-bundles`,
      `pnpm --filter @grade10/storybook run test:stories`,
      `pnpm run check:libs`, `pnpm run typecheck`, `pnpm run lint`
- [x] 28.7 Build `PayoutDialog`, `WaiveUpchargeDialog` and the approvals
      waiting on a second person: the recorder asks with a reason, a second
      `grading:approve` holder approves on their own console, the recorder's
      own request is never theirs to approve, and the card shows its payout,
      its reversal, its waiver and what is due
      (`grade10-admin-grading-counter-SC-59`,
      `grade10-admin-grading-counter-SC-60`,
      `grade10-admin-grading-counter-SC-61`,
      `grade10-admin-grading-counter-SC-95`,
      `grade10-admin-grading-counter-SC-97`)
- [x] 28.8 Build the documents tab's list, each paper with its fingerprint,
      Send again where its letter failed, and a sealed copy shown on the iPad
      or its link copied (`grade10-admin-grading-counter-SC-48`), and
      `ReversalDialog`,
      which asks for a payout's reversal the way the payout is asked
      (`grade10-admin-grading-counter-SC-49`,
      `grade10-admin-grading-counter-SC-64`)
- [x] 28.9 Build `WithdrawDialog` on the submission's cards: a card withdrawn
      with its line refunded and its receipt issued, and the act gone once
      the batch closes (`grade10-admin-grading-counter-SC-54`,
      `grade10-admin-grading-counter-SC-55`)
- [x] 28.10 Build the console's Cancel on `SubmissionPanel`, its tests red
      first; needs 13.9: offered by `COUNTER_ACTS.cancel` and `cancellable`,
      behind `useConfirm` whose words name the drop-off and say it is on the
      collector's word, the Cancelled record after it, a stale refusal read
      again, and the `runbook` link where one is offered
      (`grade10-admin-grading-counter-SC-106`,
      `grade10-admin-grading-counter-SC-107`,
      `grade10-admin-grading-counter-SC-84`)
- [ ] 28.11 Offer Waive the storage on `MoneyTab` beside Waive the upcharge,
      per card and while that card's storage is unsettled, the request
      naming its kind and the record read back under the card, its tests
      red first; needs 19.9; then run 28.6's checks
      (`grade10-admin-grading-counter-SC-109`)
- [ ] 28.12 Badge Transfer unconfirmed on a row whose transfer payout has no
      `received_at`, and count those on the To settle tile beside every kind
      due, its tests red first; then run 28.6's checks (Q140,
      `grade10-admin-grading-counter-SC-112`)

## 29. The console's hand-in and hand-back runbooks (grade10)

Needs group 10's exports and group 25's recorded worker. Stage (b).

- [x] 29.1 Cover both runbooks: the day's booking opening its submission, the
      till step held until the agreement is sealed, a second submission on one
      visit running its own hand-in, and each step carrying its button or the
      reason it waits (`grade10-admin-grading-counter-SC-14`,
      `grade10-admin-grading-counter-SC-18`,
      `grade10-admin-grading-counter-SC-21`,
      `grade10-admin-grading-counter-SC-42`)
- [x] 29.2 Build `IntakeRunbook` as a `CheckList` of six `Check`s: the day's
      booking opening its submission, the cards table with Present, Condition,
      the photograph pair, the level check and Refuse per row, Add a card
      written at the desk with no paste, the fee panel, the sign panel and the
      check-in panel (`grade10-admin-grading-counter-SC-14`,
      `grade10-admin-grading-counter-SC-21`)
- [x] 29.3 Open the till step only on the sealed agreement, and hand the next
      step on after each act; the sign step shows a decline and offers the
      agreement again, offers Show on iPad and Copy link, shows the sealed
      copies' fingerprints, and says when nothing has been sealed yet
      (`grade10-admin-grading-counter-SC-18`,
      `grade10-admin-grading-counter-SC-42`,
      `grade10-admin-grading-counter-SC-47`,
      `grade10-admin-grading-counter-SC-48`,
      `grade10-admin-grading-counter-SC-93`)
- [x] 29.4 Build `RefuseCardDialog` with the three reasons, the
      collector's-words field and the consequence `Notice`
- [x] 29.5 Build `HandbackRunbook` as six `Check`s: the code and name step, the
      identity glance, the money panel, the items table with Handed over and
      Vault instead per row, the sign panel and the photographs
      (`grade10-admin-grading-counter-US4-TC1-1`,
      `grade10-admin-grading-counter-US4-TC2-1`,
      `grade10-admin-grading-counter-US4-TC5-1`,
      `grade10-admin-grading-counter-US4-TC7-1`,
      `grade10-admin-grading-counter-US4-TC9-1`)
- [x] 29.6 Write the stories for `Grading/Admin/Intake` and
      `Grading/Admin/Handback`, each with `surface: console`, one per States
      row of the intake and hand-back runbooks
- [x] 29.7 Verify: `pnpm run test`, `pnpm run check:app-bundles`,
      `pnpm --filter @grade10/storybook run test:stories`,
      `pnpm run check:libs`, `pnpm run typecheck`, `pnpm run lint`
- [x] 29.8 Start a walk-in at the desk in `WalkInForm`, the walk-in's own
      form: a submission opened with the collector there, then its cards
      added one at a time and handed in from its `IntakeRunbook` with the fee
      sheet pinned at the hand-in (`grade10-admin-grading-counter-SC-15`)
      Reopened: the runbook reports no submission it mints, so a reload loses
      the walk-in; ruled after group 31's audit, it calls `onStarted(id)` once
      it mints one, and the address is the id's one owner: `onStarted(id)`
      replaces `setStartedId`, and `startedId` goes; ruled after the group 31
      amendment's audit, `WalkInPage` renders `WalkInForm`, which calls
      `onStarted(id)`, and `IntakeRunbook` always takes a `submissionId`
- [x] 29.9 Give `IntakeRunbook` and `HandbackRunbook` a `recordHref`, the one
      press to the record, its test red first; 31.5 routes it
- [ ] 29.10 Open `IntakeRunbook` on `admin.safeStanding` and turn a list the
      safe cannot take to Book the next drop-off before the first check, its
      tests red first; needs 13.10; then run 29.7's checks
      (`grade10-admin-grading-counter-SC-108`)

## 30. The console's batches, receiving, the notice and the settings (grade10)

Needs group 10's exports and group 25's recorded worker; types against
36.1 from the start, and its reads and acts answer once the rest of group 36
lands. Stage (c).

- [x] 30.1 Cover the batch and settings screens: the scan counters as the box
      gives cards up, a setting nobody has written marked with the owner who
      owes it, and a read holder who changes nothing; then the list's rows
      and Arrived, a new batch, a line resolved and an exception recorded
      from the receive panel, and the notice dialog printing the address
      (`grade10-admin-grading-batches-SC-29`,
      `grade10-admin-grading-batches-US2-TC14-1`,
      `grade10-admin-grading-batches-SC-44`,
      `grade10-admin-grading-batches-SC-51`,
      `grade10-admin-grading-batches-SC-34`,
      `grade10-admin-grading-batches-SC-35`,
      `grade10-admin-grading-batches-SC-36`,
      `grade10-admin-grading-counter-SC-98`,
      `grade10-admin-grading-counter-SC-99`,
      `grade10-admin-grading-counter-SC-105`)
- [x] 30.2 Build `BatchesPanel` and `ShipBatchForm`: the batch list off
      `admin.batches`, a row per state — open, closed and shipping today,
      closed with nothing to ship, with the grader, past the estimate, back
      unchecked, received — and empty, every batch not yet received listed
      in the order the answer gives and the rest behind `CursorPager`; its
      Tiles (GA4) state off `admin.batchTiles` — ship today, with graders
      and how many past the estimate, back unchecked, the safe at its cap —
      the closing batch staying the queue's `admin.tiles`; Arrived on a row
      with the grader only where the row's `gradesIn` holds, through
      `admin.receiveBatch`, the row then reading back, unchecked with
      Receive, and until then the grader's grades-in stage named in its
      place; the insured total read off the batch's cards and no typed
      figure taken, and shipping withheld while the batch is open, holds no
      submission at `checked_in`, or a field is missing (`grade10-admin-grading-batches-SC-09`,
      `grade10-admin-grading-batches-SC-49`,
      `grade10-admin-grading-batches-SC-52`,
      `grade10-admin-grading-batches-SC-55`,
      `grade10-admin-grading-batches-US1-TC1-1`,
      `grade10-admin-grading-batches-US1-TC3-1`,
      `grade10-admin-grading-batches-US1-TC4-1`,
      `grade10-admin-grading-batches-US1-TC12-1`,
      `grade10-admin-grading-batches-US1-TC15-1`,
      `grade10-admin-grading-batches-US2-TC14-1`)
- [x] 30.3 Build `NewBatchDialog` and `ReestimateDialog`, the stage recorded
      from the grader's own stages as a `ChoiceList` with one member the move
      to graded and the grader's words in a `NotesField` beside it, never free
      text; the new batch opens through `admin.openBatch`, the shop from
      `admin.shops` and only the levels the grader's active sheet carries
      offered, so it opens through `openBatchFor` as the hand-in's does,
      never a second insert (`grade10-admin-grading-batches-US1-TC7-1`,
      `grade10-admin-grading-batches-US4-TC1-1`,
      `grade10-admin-grading-batches-US4-TC3-1`,
      `grade10-admin-grading-batches-US4-TC4-1`,
      `grade10-admin-grading-batches-US4-TC6-1`)
- [x] 30.4 Build `ReceivePanel`: the header off `admin.receiving`'s batch —
      the shop named from `admin.shops`, grader · level, the day it went out,
      the grader's last stage with the day it was recorded, arrived — the
      manifest and invoice entry, the counters reading what the box has given
      up so far, the scan table with each line's state, the cards no line
      names under it, Resolve on an unmatched line through
      `admin.resolveManifestLine`, Held, Not returned and Damaged on a line's
      card, Held and Not returned on an unlisted one, through
      `admin.recordException`, Add to the manifest on an unlisted card whose
      slab is in the box through `admin.addManifestLine`, the exceptions
      `EntryList`, Save and Finish
      (`grade10-admin-grading-batches-SC-29`,
      `grade10-admin-grading-batches-SC-53`,
      `grade10-admin-grading-batches-SC-54`,
      `grade10-admin-grading-batches-US2-TC16-1`,
      `grade10-admin-grading-batches-US3-TC1-1`,
      `grade10-admin-grading-batches-US3-TC2-1`,
      `grade10-admin-grading-batches-US3-TC3-1`)
- [x] 30.5 Build `PostNoticeDialog` with the address off `admin.noticeForm`,
      the posting date and the tracking, opened from the Notice due rung and
      recording nothing while either is
      missing (`grade10-admin-grading-counter-US12-TC2-1`,
      `grade10-admin-grading-counter-US12-TC3-1`)
- [x] 30.6 Build `SettingsPanel`: one `SaveableField` per row and a
      `MoneyField` on a money row, the fee sheet
      and the diary services as their own tables, the second-person dialog on a
      money row, a row nobody has written marked unset with its owner, and
      every field closed to a `grading:read` holder, and the reference rate
      a single approve holder's row; `SETTING_UNSET` and `SETTING_MALFORMED`
      worded with the setting their `domainDetails` name, as the other
      refusals read their figures
      (`grade10-admin-grading-counter-SC-69`,
      `grade10-admin-grading-counter-SC-71`,
      `grade10-admin-grading-counter-SC-98`,
      `grade10-admin-grading-counter-SC-99`,
      `grade10-admin-grading-counter-SC-104`)
- [x] 30.7 Write the stories for `Grading/Admin/Batches`,
      `Grading/Admin/Receiving` and `Grading/Admin/Settings`, each with
      `surface: console`
- [ ] 30.8 Verify: `pnpm run test`, `pnpm run check:app-bundles`,
      `pnpm --filter @grade10/storybook run test:stories`,
      `pnpm run check:libs`, `pnpm run typecheck`, `pnpm run lint`
- [ ] 30.9 Read the notice period off the detail's pinned terms in
      `PostNoticeDialog` and the timeline's notice entry, the detail carrying
      `noticePeriodDays`, its tests red first; needs 20.6; then run 30.8's
      checks (`grade10-admin-grading-counter-SC-67`)
- [ ] 30.10 Draw the ship form's Split into shipments on `GA4`'s components, one block
      per shipment with its cards, courier, tracking and insured total against
      the cover, and keep manifest entry typed with no import (Q128, Q130,
      `grade10-admin-grading-batches-SC-57`, `grade10-admin-grading-batches-SC-23`)

## 31. The application wiring (grade10)

Follows groups 25 to 30; groups 33 and 34 open nothing until it lands. Stage
(b).

- [x] 31.1 Cover the addresses: a route test per surface over the site's five
      and the console's six, each resolving to its page with its modules
      installed; the console's submission address opening the runbook its acts
      offer, the record with `?view=record`, and each one press from the
      other; a reloaded walk-in keeping its submission; the Walk-in desk and
      its address absent without `admin.savePlan`; and the site's five
      resolving nowhere on a uat or production build
- [x] 31.2 Register `grading` (`/grading`, session, `open`), `gradingNew`
      (`/grading/new`, session, `open`), `gradingEdit`
      (`/grading/submissions/:submissionId/edit`, session, `open`),
      `gradingSubmission` (`/grading/submissions/:submissionId`, `open`) and
      `gradingSign` (`/grading/sign`, `open`) in the site's `src/surfaces.ts`,
      and their routes in `src/routes.ts` and `react-router.config.ts`; point
      the home's Start, `startHref`, `editHref` and the not-found link at
      `gradingNew` and `gradingEdit`; 31.8 makes `grading` `prerendered`
- [x] 31.3 Add the `grading` row to `Gate` and `gatesFor` as the vault's, read
      at build time, so the site carries no grading address where the gate is
      shut and opening the gate is an edit, a build and a redeploy
- [x] 31.4 Install `gradingModules.ts` in
      `apps/frontend/grade10/src/di/container.ts` and bind `gradingTrpcClient`
      there and in the console's container, so the pages groups 25 to 30 built
      read the deployed worker through the transports their tests ran
- [x] 31.5 Register the console's `grading`, `gradingSubmission`,
      `gradingBatches`, `gradingBatch`, `gradingSettings` and `gradingWalkIn`
      (`/grading/walk-in`) surfaces and their routes, grant-gated on
      `ADMIN_PERMISSIONS["admin.queue"]` with no environment gate, and the
      walk-in on `ADMIN_PERMISSIONS["admin.savePlan"]`; `GradingDesks` gaining
      a fourth desk, Queue · Walk-in · Batches · Settings, the Walk-in shown
      only with that grant; the submission's address opening the runbook
      `COUNTER_ACTS.handIn` or `COUNTER_ACTS.collect` offers and the record
      otherwise, `?view=record` opening the record, and the runbooks'
      `recordHref` and the panel's `runbook` routed to each other; the
      walk-in's `onStarted(id)` replacing the address with the bare
      submission address; and the appointments section's
      `CASE_ADDRESS.grading` set to `gradingSubmissionAddress`. Needs 28.10
      and 29.9
- [x] 31.6 Render the grading nav item from the `chrome` key task 1.6 added, so
      the collector reaches `/grading` from the shell
- [ ] 31.7 Verify: `pnpm run test`, `pnpm run check:libs`,
      `pnpm run typecheck`, `pnpm run lint`
- [x] 31.8 Make `grading` `prerendered` and public as `book` is, once 31.2
      has landed: its head meta, the `/tc` and `/sc` variants, the sitemap
      row, and an anonymous smoke reading the lead and How it works as static
      HTML and the fee sheet and Your submissions loading until the page
      reads them; then run 31.7's checks

## 32. The dev routes and the isolated stack (grade10)

Both walks drive these routes, so it lands with stage (b).

- [x] 32.1 Add `packages/grading/backend/src/routes/dev.ts` under
      `app.use("/dev/*", devOnly())`, covered by a route test that it answers
      nowhere else
- [x] 32.2 Add `POST /dev/submissions/seed`, replaying
      `submissions/transitions.ts` to the named status — no second writer — and
      injecting beside it what no transition writes: the booking cache, the fee
      and cover lines, a dev-sealed agreement packet, the batch row and its
      manifest lines, and `created_at`, `appointment_at` and `ready_at` in the
      past; a repeat answers the same submission
- [x] 32.3 Seed the unset money keys and the fee sheet in `/dev/setup`'s
      `seed` where nothing stands, as inventory's does, so `pnpm dev` and the
      e2e stack open on the same settings; `POST /dev/settings` runs the same
      seed; no spec and no global setup seeds them
- [x] 32.4 Add `POST /dev/sweep { lane }` running a pass now, and
      `GET /dev/outbox` over the shared dev outbox in `@grade10/worker`, a
      grading entry carrying the kind, the attachment names and the collector's
      access link
- [x] 32.5 Add `appointment-service` and `grading-service` to
      `scripts/e2e/start-isolated.sh`'s default service list and both health
      probes to `STACK_READY_URLS` in
      `apps/frontend/grade10/e2e/helpers/env.ts`
- [ ] 32.6 Verify: `pnpm run test:backend`, `pnpm run test:e2e:smoke` on the
      isolated stack, `pnpm run typecheck`, `pnpm run lint`
- [x] 32.7 Seed a customer-bookable diary service under the slug `grading` at
      the isolated stack's start, so the site's `/book?service=grading` link
      resolves on the dev and e2e stacks; then run 32.6's checks

## 33. The walk — the plan, the drop-off and the hand-in (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review add-card-grading`) as its input,
and groups 31 and 32 landed. `POST /dev/submissions/seed` stands in for what
the walk cannot take at the counter: the paid POS order and its money lines,
the dev-sealed agreement packet for a submission seeded past `checked_in`, the
batch row with its manifest lines, and the past `created_at`, `appointment_at`
and `ready_at` that stand in for waiting. Stage (b).

- [ ] 33.1 Walk the plan in
      `apps/frontend/grade10/e2e/tests/grading/plan.spec.ts`
      (`grade10-site-grading-submission-plan-US-01`,
      `grade10-site-grading-submission-plan-US-02`,
      `grade10-site-grading-submission-plan-US-03`,
      `grade10-site-grading-submission-plan-US-04`,
      `grade10-site-grading-submission-plan-US-05`,
      `grade10-site-grading-submission-plan-US-06`,
      `grade10-site-grading-submission-plan-US-07`,
      `grade10-site-grading-submission-plan-US-08`)
- [ ] 33.2 Walk the drop-off in `grading/dropoff.spec.ts`
      (`grade10-site-grading-dropoff-booking-US-01`,
      `grade10-site-grading-dropoff-booking-US-02`,
      `grade10-site-grading-dropoff-booking-US-03`,
      `grade10-site-grading-dropoff-booking-US-04`,
      `grade10-site-grading-dropoff-booking-US-05`,
      `grade10-site-grading-dropoff-booking-US-06`)
- [ ] 33.3 Walk the counter's hand-in in `grading/handin.spec.ts`
      (`grade10-admin-grading-counter-US-01`,
      `grade10-admin-grading-counter-US-02`,
      `grade10-admin-grading-counter-US-03`,
      `grade10-admin-grading-counter-US-07`,
      `grade10-admin-grading-counter-US-14`,
      `grade10-admin-grading-counter-US-15`,
      `grade10-site-grading-counter-documents-US-01`,
      `grade10-site-grading-counter-documents-US-02`,
      `grade10-site-grading-submission-lifecycle-US-01`,
      `grade10-site-grading-submission-lifecycle-US-02`,
      `grade10-site-grading-submission-lifecycle-US-10`,
      `grade10-site-grading-submission-lifecycle-US-11`,
      `grade10-admin-grading-batches-US-05`,
      `grade10-site-grading-collector-notifications-US-01`,
      `grade10-site-grading-collector-notifications-US-02`)
- [ ] 33.4 Flip the cases these walks decide with
      `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks'
      own commit, and name in the counter suite and in this change's
      `rounds.md` row the two that stay walked by hand — the till at hand-in
      (`grade10-admin-grading-counter-US2-TC8-1`) and the refund of a refused
      card's paid line (`grade10-admin-grading-counter-US3-TC4-1`), both
      `STORE_SERVICE.orderByName` over a paid POS order the seed injects. Every
      other step, the agreement signed at `/grading/sign` included, is driven
- [ ] 33.5 Verify: `pnpm run test:e2e` on the isolated stack,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run tcs:validate` in
      grade10-spec

## 34. The walk — the batch, the hand-back and what is left behind (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review add-card-grading`) as its input,
and groups 31 and 32 landed. `POST /dev/submissions/seed` stands in for what
the walk cannot take at the counter: the paid POS order and its money lines,
the dev-sealed agreement packet for a submission seeded past `checked_in`, the
batch row with its manifest lines, and the past `created_at`, `appointment_at`
and `ready_at` that stand in for waiting. Stage (c).

- [ ] 34.1 Walk the batch from ship to received in `grading/batch.spec.ts`
      (`grade10-admin-grading-batches-US-01`,
      `grade10-admin-grading-batches-US-02`,
      `grade10-admin-grading-batches-US-03`,
      `grade10-admin-grading-batches-US-04`,
      `grade10-site-grading-submission-lifecycle-US-03`,
      `grade10-site-grading-submission-lifecycle-US-04`,
      `grade10-site-grading-submission-lifecycle-US-05`)
- [ ] 34.2 Walk the hand-back in `grading/handback.spec.ts`
      (`grade10-admin-grading-counter-US-04`,
      `grade10-admin-grading-counter-US-05`,
      `grade10-admin-grading-counter-US-06`,
      `grade10-admin-grading-counter-US-09`,
      `grade10-admin-grading-counter-US-10`, the held card back in a later
      batch then the second hand-back (`grade10-admin-grading-counter-US4-TC10-1`,
      `grade10-admin-grading-batches-US2-TC19-1`),
      `grade10-admin-grading-counter-US-11`,
      `grade10-admin-grading-counter-US-13`,
      `grade10-site-grading-counter-documents-US-03`,
      `grade10-site-grading-counter-documents-US-04`,
      `grade10-site-grading-counter-documents-US-05`,
      `grade10-site-grading-submission-lifecycle-US-06`,
      `grade10-site-grading-submission-lifecycle-US-07`,
      `grade10-site-grading-submission-lifecycle-US-09`)
- [ ] 34.3 Walk what is left behind in `grading/uncollected.spec.ts`, an
      admin's erasure refused while a submission is live and taken once it is
      collected (`grade10-admin-grading-counter-US-08`,
      `grade10-admin-grading-counter-US-12`,
      `grade10-site-grading-submission-lifecycle-US-08`,
      `grade10-site-grading-collector-notifications-US-03`,
      `grade10-site-vault-retention-and-erasure-US-01`,
      `grade10-site-vault-retention-and-erasure-US-02`,
      `grade10-site-vault-retention-and-erasure-US-03`,
      `grade10-site-vault-retention-and-erasure-US-04`)
- [ ] 34.4 Flip the cases these walks decide with
      `pnpm run tcs:automated <case…> --decided-by <walk path>` — among them
      `grade10-admin-grading-batches-US1-TC18-1` and
      `grade10-admin-grading-batches-US1-TC19-1`, and the reworded shipment
      cases `batch.spec.ts` already decides — in the walks'
      own commit, and name in the counter suite and in this change's
      `rounds.md` row the three that stay walked by hand — the till at
      hand-back (`grade10-admin-grading-counter-US4-TC5-1`), the identity
      glance above the threshold (`grade10-admin-grading-counter-US4-TC2-1`)
      and the physical posting behind `recordNoticePosted`
      (`grade10-admin-grading-counter-US12-TC2-1`). Every other step is driven
- [ ] 34.5 Verify: `pnpm run test:e2e` on the isolated stack,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run tcs:validate` in
      grade10-spec

## 35. The manual (grade10-spec)

Lands once groups 1 to 34 and 36 are green and the change is deployed.

- [ ] 35.1 Take the 🚧 marks off the lines this change delivered on
      `docs/prds/products/grade10-site/grading/index.md`, `planning.md`,
      `drop-off.md`, `submission.md`, `documents.md` and `messages.md`
- [ ] 35.2 Take them off `docs/prds/products/grade10-admin/grading/console.md`
      and `index.md`, `docs/prds/products/shared/ui/grading-submission.md`, and
      the grading lines of
      `docs/prds/products/grade10-site/vault/compliance-and-readiness.md`
- [ ] 35.3 Keep the readiness items on `index.md` matching what production
      refuses until a person sets it — the custodian's name and the complaints
      contact refusing the seal and every message, the certificate's
      no-identity line refusing the seal, the fee sheet and every money
      setting unset and refused by name until their owner writes them with a
      second approver, each bracketed outside production — and say on
      `console.md` that a money setting is unset until its owner writes it
- [ ] 35.4 Verify: `pnpm check:manual`,
      `pnpm run validate:changes add-card-grading`,
      `pnpm run archive:preflight add-card-grading`

## 36. The batch list, a new batch, the receiving lines and the notice's address (grade10)

The worker's side of group 30, after groups 17 and 24. Its first task lands
the types group 30 builds against; group 30's reads and acts answer once the
rest lands. Stage (c).

- [x] 36.1 Land the contracts first: `BatchPage` and `BatchRow`, the
      reshaped `ReceivingRead` with the pure `manifestLineState`, the lifted
      `shipsToday`, the notice-due predicate, and the inputs and answers of
      `admin.batches`, `admin.openBatch`, `admin.addManifestLine` and
      `admin.noticeForm`; their entries in `contracts/src/permissions.ts`,
      and the console transport's methods for each, so group 30 types against
      them while the worker's side is built
      (`grade10-admin-grading-batches-SC-08`,
      `grade10-admin-grading-batches-SC-24`,
      `grade10-admin-grading-batches-SC-51`,
      `grade10-admin-grading-counter-SC-65`)
- [x] 36.2 Cover the worker's side next, before 36.3 to 36.8: the list's row
      per state, `gradesIn` by `BATCH_NOT_GRADED`'s own rule, every batch
      not yet received on every answer in the spec's order, a closed batch
      with nothing to ship among the paged rest and offering no Ship, a page
      resuming on its cursor with no count read, `shipsToday` agreeing with
      the tile, and the stages' words in one read inside one snapshot; a
      batch opened from the console that the trio's first hand-in then
      joins, a second open answering the standing batch with `written`
      false and no audit row, a level the live sheet does not offer
      refused; an arrival refused while a member stands at `sent`; the
      receiving read naming the batch and its last stage reading, each
      line's state and card from the travelled cards, `matched` counting
      scanned, held, not returned and damaged, and the travelled cards no
      line names; a line added for one of them and its cert then scanned;
      every `SETTING_UNSET` and `SETTING_MALFORMED` carrying `{ keys,
      feeSheetRow? }`; and the notice's address read by an operate holder
      while the notice is due, on the chain, refused before it and below
      the grant (`grade10-admin-grading-batches-SC-04`,
      `grade10-admin-grading-batches-SC-05`,
      `grade10-admin-grading-batches-SC-06`,
      `grade10-admin-grading-batches-SC-08`,
      `grade10-admin-grading-batches-SC-17`,
      `grade10-admin-grading-batches-SC-20`,
      `grade10-admin-grading-batches-SC-44`,
      `grade10-admin-grading-batches-SC-45`,
      `grade10-admin-grading-batches-SC-24`,
      `grade10-admin-grading-batches-SC-34`,
      `grade10-admin-grading-batches-SC-51`,
      `grade10-admin-grading-batches-SC-52`,
      `grade10-admin-grading-batches-SC-53`,
      `grade10-admin-grading-batches-SC-54`,
      `grade10-admin-grading-batches-SC-55`,
      `grade10-admin-grading-counter-SC-66`,
      `grade10-admin-grading-counter-SC-69`,
      `grade10-admin-grading-counter-SC-105`)
- [x] 36.3 Add `admin.batches` under `grading:read`, its `limit` bounded as
      `queueInputSchema` bounds the queue's: `unfinished`, every batch not
      yet received but those closed with nothing to ship, whole on every
      answer in the batches spec's order; `rows`, the rest, on
      `(coalesce(finished_at, cutoff_at), id)` descending under a sort tag
      of its own; each row's name, standing, `gradesIn` by
      `BATCH_NOT_GRADED`'s own rule, counts, ship fields, estimate and last
      stage in its words; every read in one `repeatable read`, `read only`
      transaction as `listQueue` runs, the `GROUP BY` and `DISTINCT ON`
      bound to the answer's batch ids and the member status sets named;
      `shipsToday` read from the contracts by both `admin.batchTiles` and
      the row; and the comment on `idx_grading_batches_location_id_cutoff_at`
      (`db/schema/batches.ts`) corrected, since no list reads by it
      (`grade10-admin-grading-batches-SC-04`,
      `grade10-admin-grading-batches-SC-05`,
      `grade10-admin-grading-batches-SC-06`,
      `grade10-admin-grading-batches-SC-08`,
      `grade10-admin-grading-batches-SC-17`,
      `grade10-admin-grading-batches-SC-20`,
      `grade10-admin-grading-batches-SC-45`,
      `grade10-admin-grading-batches-SC-52`,
      `grade10-admin-grading-batches-SC-55`)
- [x] 36.4 Add `admin.openBatch` under `grading:operate` over `openBatchFor`
      in its own transaction: `openBatchFor` reports whether it inserted,
      and the procedure answers `{ batchId, written }` as
      `BatchWriteAnswer.written` does, files its audit row under the batch
      only when written, and lists `BATCH_CONFLICT`; the level checked by
      `offeredLevel` over the grader's live sheet (`quotes/feeSheet.ts`),
      refusing `LEVEL_NOT_OFFERED`, and the input's `grader` the contracts'
      grader schema (`grade10-admin-grading-batches-SC-44`)
- [x] 36.5 Widen `admin.receiving`: `ReceivingRead.batch` built by the
      list's row builder plus `manifestEnteredAt` and the invoice, its last
      stage reading by `lastReadingOf`; each line's card resolved by
      `lineCardOrNull`'s rule from the travelled cards the read loads, never
      one query per line, with its id, intake id and `heldUntil`, and
      `batchCard` taking the travelled predicate so manifest entry, resolve,
      scan and the read agree; `state` from `manifestLineState` in place of
      `matched` and `scanned`, `counters.matched` counting the lines
      scanned, held, not returned or damaged; `unlisted`, every travelled
      card no line names; Resolve's picks the unlisted cards with no
      outcome and no cert; `cardsFromSubmissions` dropped for
      `counters.ofCards` (`grade10-admin-grading-batches-SC-24`,
      `grade10-admin-grading-batches-SC-29`,
      `grade10-admin-grading-batches-SC-34`,
      `grade10-admin-grading-batches-SC-51`,
      `grade10-admin-grading-batches-SC-53`)
- [x] 36.6 Add `admin.addManifestLine` under `grading:operate` over
      `addManifestLine`: one line for a travelled card no line names, at the
      next line number, stamped resolved as the grader's omission and filed
      under the batch as a resolve is; refusing `NOT_IN_BATCH`,
      `LINE_RESOLVED` and `MANIFEST_DUPLICATE`; the slab's cert then scans
      onto it (`grade10-admin-grading-batches-SC-54`)
- [x] 36.7 Carry `{ keys, feeSheetRow? }` in the details at every site that
      throws `SETTING_UNSET` or `SETTING_MALFORMED` — `settings/read.ts`,
      whose parse every write reuses, the till's fee-sheet row and the
      terms' ladder at the pin — and move `sweeps/rowError.ts`'s
      `refusesList` from the message to the details' `keys`, pinned in the
      same test over them all, so production's stripped message loses
      nothing the console or a sweep names
      (`grade10-admin-grading-counter-SC-69`)
- [x] 36.8 Add `admin.noticeForm` under `grading:operate`, answering
      `{ postalAddress }` only, refused `NOTICE_NOT_DUE` unless the notice is
      due by the predicate lifted out of the badge — not posted, and
      `noticeOpen` — which the badge and `recordNoticePosted`
      (`counter/notice.ts`) then read too; `auditDetails` and
      `auditSubject`, the submission, declared on it; a due submission with
      no address failing loudly by name; `SubmissionDetail` carrying no
      address (`grade10-admin-grading-counter-SC-66`,
      `grade10-admin-grading-counter-SC-105`)
- [ ] 36.9 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 37. The status rail on the store's stage rail (grade10-spec)

Appended at landing, as `complete-vault-collector-flow` Q117 decided. Its own
group because the rail's scroll wrapper changes the DOM the slot sits on.

- [ ] 37.1 Compose `StageRail` inside `GradingStatusRail`, the block's export,
      its `copy`, `stage` and `ended` props and its stories kept: the seven
      stages in order from its copy, `current` the stage, `ended` under it,
      `slot: "grading-status-rail"` on the rail
      (`shared-ui-grading-submission-SC-32`,
      `shared-ui-grading-submission-SC-33`)
- [ ] 37.2 Verify: `pnpm run test:stories:ui`, `pnpm run test`,
      `pnpm run typecheck`, `pnpm run lint`
