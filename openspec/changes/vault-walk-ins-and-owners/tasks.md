# Tasks

Group 1 lands in **grade10-spec** first, and group 3 bumps the submodule to
it. Group 3 is the contract every later group reads: once it lands, the
backend groups (5 to 7) and the frontend groups (8 to 10) are parallel, the
frontends working against the fixture transports rather than a running
worker. Group 4's migration lands before group 5. Group 2 is the manual and
lands once every grade10 group is verified; group 11 is the walk.

## 1. The collector's words (grade10-spec) (owner: @ecchochan)

- [ ] 1.1 Name `vault.list.openedAtCounter` in the vocabulary type first, so
      `pnpm --filter @grade10/i18n run test` refuses every language that has
      not answered it
- [ ] 1.2 Answer `vault.list.openedAtCounter` — the list's line saying staff
      opened the request at the counter and it waits for the collector to
      check and send it — in `packages/i18n/messages/shared/<locale>/vault.json`
      for `en`, `zh-Hant`, `zh-Hans` and `ko`
- [ ] 1.3 Verify: `pnpm --filter @grade10/i18n run test`,
      `pnpm run typecheck`, `pnpm run lint`

## 2. The manual (grade10-spec) (owner: @ecchochan)

Lands once every grade10 group is green and its implementation verified.

- [ ] 2.1 Take the 🚧 marks off the lines this change delivered:
      **Collector by name**, **Narrow by collector**, **Walk-ins**, **An
      address signed in to before**, **The statement first**, **The
      collector's cases** and **Walk-ins and names** on
      `docs/prds/products/grade10-site/vault/operator-console.md`; **A draft
      staff opened** and **An address typed wrong** on `case-lifecycle.md`;
      **A draft staff opened** on `collector-pages.md`; **URL**, **Who**,
      **Header**, **Vault cases**, **Sections stand alone** and **On the
      audit chain** on `docs/prds/products/grade10-admin/console/collector-page.md`,
      leaving the marks `add-item-registry` and `complete-vault-collector-flow`
      still owe
- [ ] 2.2 Leave `TBC Legal` on the collection statement's wording, and say on
      `operator-console.md` that the walk-in refuses in production until it is
      set: the walk-in is dark in production until Legal's statement lands
- [ ] 2.3 Verify: `pnpm check:manual`, then
      `pnpm run validate:changes vault-walk-ins-and-owners`

## 3. The contracts (grade10) (owner: @ecchochan)

- [ ] 3.1 Cover the grant map and the wire both ways: every new procedure and
      byte route in `ADMIN_PERMISSIONS` and `ROUTE_PERMISSIONS` against the
      router, the walk-in on `vault:operate`, the name reads on `kyc:read`,
      and the new fields decoding on the fixtures
      (`grade10-admin-vault-operator-queue-SC-63`,
      `grade10-admin-vault-operator-queue-SC-70`)
- [ ] 3.2 Bump `external/grade10-spec` to the commit carrying group 1;
      `check:submodules` guards the pin
- [ ] 3.3 Add `admin.openWalkIn` and `admin.collectionStatement` on
      `vault:operate`, `admin.collectorNames` and `admin.collectorAccount` on
      `kyc:read`, `admin.collectorCases` on `vault:read`, and
      `VAULT_PATHS.walkInPhotoUpload` with
      `ROUTE_PERMISSIONS.walkInPhotoUpload = ["vault:operate"]`
      (`grade10-admin-vault-operator-queue-SC-63`,
      `grade10-admin-vault-operator-queue-SC-70`)
- [ ] 3.4 Add the walk-in's input schema, `ADDRESS_SIGNED_IN` to the failure
      codes, `collectorId` on `vaultCaseSchema` and `custodyHoldingSchema`,
      `openedAtCounter` on `vaultCaseSchema`, the optional `collectorId` input
      on the list, count and custody reads, and the three collector reads'
      answers, as `tech-design.md` § API Contracts names them
- [ ] 3.5 Reword `kyc:read` in `packages/grade10-auth/contracts/src/descriptions.ts`
      to "Read identity documents and collector names."
- [ ] 3.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run check:submodules`

## 4. The opener column (grade10) (owner: @ecchochan)

- [ ] 4.1 Cover the migration: applied over a database at
      `0032_case_reference.sql`, it leaves every existing case's opener null
      and the old worker's insert still valid
- [ ] 4.2 Write `<n>_case_opened_by.sql` adding `vault.vault_cases.opened_by
      text NULL`, and `openedBy` on the Drizzle table in
      `packages/vault/backend/src/db/schema/cases.ts`
- [ ] 4.3 Verify: `pnpm run check:migrations`, `pnpm db:status`,
      `pnpm run test:backend`

## 5. Opening a walk-in (grade10) (owner: @ecchochan)

- [ ] 5.0 Extract the gate `submitIntake` holds inline
      (`cases/intake.ts:248-258`) into `requireStatementShown(brand,
      deployEnv, version)`, called by `submitIntake` and later by
      `openWalkIn`; the existing intake tests stay green
- [ ] 5.1 Cover the open at the service and repository seams: a new account, an
      account nobody has signed in to, one someone has, the statement shown
      and kept, the statement unwritten in production and outside it, the cap,
      a replay, a refused open writing nothing and asking auth nothing, the
      account's handle, an address in other capitals, a refused fact, and the
      staff photo route's refusals, the eleventh photograph among them
      (`grade10-admin-vault-operator-queue-SC-55`,
      `grade10-admin-vault-operator-queue-SC-56`,
      `grade10-admin-vault-operator-queue-SC-57`,
      `grade10-admin-vault-operator-queue-SC-58`,
      `grade10-admin-vault-operator-queue-SC-59`,
      `grade10-admin-vault-operator-queue-SC-60`,
      `grade10-admin-vault-operator-queue-SC-61`,
      `grade10-admin-vault-operator-queue-SC-62`,
      `grade10-admin-vault-operator-queue-SC-63`,
      `grade10-admin-vault-operator-queue-SC-64`,
      `grade10-admin-vault-operator-queue-SC-65`,
      `grade10-admin-vault-operator-queue-SC-74`,
      `grade10-admin-vault-operator-queue-SC-75`,
      `grade10-admin-vault-operator-queue-SC-76`,
      `grade10-site-vault-case-intake-SC-36`)
- [ ] 5.2 Add the `accounts` port — `createUnverifiedAccount` and
      `accountsByUserIds` off `authServiceBinding` — to the vault's context,
      refusing by name where `AUTH_SERVICE` is unbound
      (`grade10-admin-vault-operator-queue-SC-55`,
      `grade10-admin-vault-operator-queue-SC-56`,
      `grade10-admin-vault-operator-queue-SC-57`)
- [ ] 5.3 Widen `openCase` to `openedBy`, writing `opened_by`, the staff actor
      and the statement version on `draft_opened`, and answering a replay of
      the dialog's minted id with the draft it opened
      (`grade10-admin-vault-operator-queue-SC-62`,
      `grade10-site-vault-case-intake-SC-36`)
- [ ] 5.4 Add `admin.collectionStatement`, and `admin.openWalkIn` in the order
      `tech-design.md` § The walk-in's order and atomic boundary names, its
      `auditDetails` holding the outcome and never the address
      (`grade10-admin-vault-operator-queue-SC-55`,
      `grade10-admin-vault-operator-queue-SC-57`,
      `grade10-admin-vault-operator-queue-SC-58`,
      `grade10-admin-vault-operator-queue-SC-59`,
      `grade10-admin-vault-operator-queue-SC-60`,
      `grade10-admin-vault-operator-queue-SC-61`,
      `grade10-admin-vault-operator-queue-SC-63`,
      `grade10-admin-vault-operator-queue-SC-64`,
      `grade10-admin-vault-operator-queue-SC-65`)
- [ ] 5.5 Widen `attachCasePhoto` to an uploader and serve
      `PUT /api/admin/cases/:caseId/photos` through `elevatedRoute`, attaching
      only to a draft staff opened (`grade10-admin-vault-operator-queue-SC-55`)
- [ ] 5.6 Seed a walk-in in `cases/devSeed.ts` and the dev routes the walk
      drives, and regenerate the procedure record with
      `pnpm --dir packages/api-docs run generate`
- [ ] 5.7 Verify: `pnpm run typecheck`, `pnpm run lint`,
      `pnpm run test:backend`

## 6. The silent endings and the removal (grade10) (owner: @ecchochan)

- [ ] 6.1 Cover the endings of a draft staff opened: the staff cancel and the
      clock each moving and purging in one transaction with no letter drafted
      or owed, the collector's own cancel keeping it listed and silent, the
      removed case read as not found by its account, its photographs not
      served, the list's `openedAtCounter`, nothing offered before the send, a
      sent one cancelled and told as any case, and a cancel read before the
      send refused as a case that moved
      (`grade10-site-vault-case-lifecycle-SC-41`,
      `grade10-site-vault-case-lifecycle-SC-42`,
      `grade10-site-vault-case-lifecycle-SC-43`,
      `grade10-site-vault-case-lifecycle-SC-44`,
      `grade10-site-vault-case-lifecycle-SC-45`,
      `grade10-site-vault-case-lifecycle-SC-46`,
      `grade10-site-vault-collector-notifications-SC-35`,
      `grade10-site-vault-collector-notifications-SC-36`,
      `grade10-site-vault-case-intake-SC-32`,
      `grade10-site-vault-case-intake-SC-35`)
- [ ] 6.2 Lift the unsigned purge out of `eraseLocally` into
      `purgeUnsignedCase`, keeping its rewrite of the collector's own actor
      ids before `user_id` is nulled, the erasure suites unchanged and green;
      a walk-in removed after the collector edited it names no collector in
      its history (`grade10-site-vault-retention-and-erasure-SC-44`,
      `grade10-site-vault-case-lifecycle-SC-47`,
      `grade10-site-vault-case-lifecycle-SC-48`)
- [ ] 6.3 Add `staffOpenedDraft` and end such a draft silently in
      `expireDrafts`, `admin.cancel` and `cases.cancel`, purging in the move's
      own transaction for the staff cancel and the clock
      (`grade10-site-vault-case-lifecycle-SC-41`,
      `grade10-site-vault-case-lifecycle-SC-42`,
      `grade10-site-vault-case-lifecycle-SC-43`,
      `grade10-site-vault-case-lifecycle-SC-44`,
      `grade10-site-vault-case-lifecycle-SC-45`,
      `grade10-site-vault-case-lifecycle-SC-46`,
      `grade10-site-vault-collector-notifications-SC-35`,
      `grade10-site-vault-collector-notifications-SC-36`)
- [ ] 6.4 Answer `openedAtCounter` on every audience of `toVaultCase`
      (`grade10-site-vault-case-intake-SC-32`,
      `grade10-site-vault-case-intake-SC-35`)
- [ ] 6.5 Verify: `pnpm run typecheck`, `pnpm run lint`,
      `pnpm run test:backend`

## 7. The collector reads (grade10) (owner: @ecchochan)

- [ ] 7.1 Cover the reads: names by case ids in batches of 100 with an absent
      account left out, a treasurer refused the names, the filter narrowing
      every cut, its count and the held figures, the header's account and its
      `NOT_FOUND` and its refusal without `kyc:read`, the collector's cases
      over every status with `found`, and
      one chain row per read naming the collector and no name
      (`grade10-admin-vault-operator-queue-SC-66`,
      `grade10-admin-vault-operator-queue-SC-67`,
      `grade10-admin-vault-operator-queue-SC-68`,
      `grade10-admin-vault-operator-queue-SC-69`,
      `grade10-admin-vault-operator-queue-SC-70`,
      `grade10-admin-vault-operator-queue-SC-71`,
      `grade10-admin-vault-operator-queue-SC-73`,
      `grade10-admin-console-collector-page-SC-06`,
      `grade10-admin-console-collector-page-SC-07`,
      `grade10-admin-console-collector-page-SC-08`,
      `grade10-admin-console-collector-page-SC-11`,
      `grade10-admin-console-collector-page-SC-12`,
      `grade10-admin-console-collector-page-SC-13`,
      `grade10-admin-console-collector-page-SC-14`,
      `grade10-admin-console-collector-page-SC-15`,
      `grade10-admin-console-collector-page-SC-18`)
- [ ] 7.2 Answer `collectorId` on the queue and staff audiences and on the held
      rows, and add `admin.collectorNames`
      (`grade10-admin-vault-operator-queue-SC-66`,
      `grade10-admin-vault-operator-queue-SC-67`,
      `grade10-admin-vault-operator-queue-SC-68`,
      `grade10-admin-vault-operator-queue-SC-69`,
      `grade10-admin-vault-operator-queue-SC-70`)
- [ ] 7.3 Take `collectorId` on `admin.list`, `admin.queueCounts` and
      `admin.custodyList` (`grade10-admin-vault-operator-queue-SC-71`,
      `grade10-admin-vault-operator-queue-SC-73`)
- [ ] 7.4 Add `admin.collectorAccount`, and `admin.collectorCases` with its
      `auditDetails` and `auditSubject`
      (`grade10-admin-console-collector-page-SC-06`,
      `grade10-admin-console-collector-page-SC-07`,
      `grade10-admin-console-collector-page-SC-08`,
      `grade10-admin-console-collector-page-SC-11`,
      `grade10-admin-console-collector-page-SC-12`,
      `grade10-admin-console-collector-page-SC-13`,
      `grade10-admin-console-collector-page-SC-14`,
      `grade10-admin-console-collector-page-SC-15`)
- [ ] 7.6 Add `auditWhen(input)` to the tRPC ladder in
      `packages/worker/src/trpc.ts`, deciding before the procedure runs
      whether a read writes its chain row, with ladder tests: declared and
      true writes one row, false writes none, an unwritable chain refuses the
      read. Record `admin.collectorNames` (`collectorIds`), the narrowed
      `admin.list`, `admin.queueCounts` and `admin.custodyList`, and
      `admin.collectorAccount`, subject `vault_collector`, never a name;
      re-key `console.spec.ts`'s walk of
      `grade10-admin-vault-operator-queue-US2-TC7-1` to a treasurer on an
      unnarrowed queue
      (`grade10-admin-vault-operator-queue-SC-09`,
      `grade10-admin-vault-operator-queue-SC-81`,
      `grade10-admin-vault-operator-queue-SC-82`,
      `grade10-admin-console-collector-page-SC-06`,
      `grade10-admin-console-collector-page-SC-07`)
- [ ] 7.7 Scope `admin.collectorAccount` to an id that holds or held a vault
      case, answering `{ userId, holdsCase, account }` and never `NOT_FOUND`;
      take any string up to 64 characters as a collector id
      (`grade10-admin-console-collector-page-SC-10`,
      `grade10-admin-console-collector-page-SC-11`,
      `grade10-admin-console-collector-page-SC-22`,
      `grade10-admin-vault-operator-queue-SC-77`)
- [ ] 7.8 Remove a photograph: `DELETE /api/cases/:caseId/photos/:photoId`
      (`VAULT_PATHS.photoRemove`) for the case's owner on a `draft`, under the
      case lock, refusing a sent case; the wizard's photograph step offers it
      on every own unsent draft
      (`grade10-site-vault-case-intake-SC-37`,
      `grade10-site-vault-case-intake-SC-38`,
      `grade10-site-vault-case-intake-SC-33`)
- [ ] 7.5 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 8. The console's walk-in and collector column (grade10) (owner: @ecchochan)

Built on the console's existing blocks, as `ui-design.md` composes them, while
Q27 stands open on the designer's boards.

- [ ] 8.1 Cover `WalkInDialog` and the columns against the fixture transport:
      the statement before the address, no name field, the photographs, the
      refusals in words with the form kept, the replay's minted id, the
      control only for `vault:operate`; the name and "name unavailable", no
      column without `kyc:read`, the name narrowing through the address and
      the control clearing it, the empty cut, the link beside the name and
      **The collector's cases** in a case's header
      (`grade10-admin-vault-operator-queue-SC-55`,
      `grade10-admin-vault-operator-queue-SC-57`,
      `grade10-admin-vault-operator-queue-SC-58`,
      `grade10-admin-vault-operator-queue-SC-63`,
      `grade10-admin-vault-operator-queue-SC-66`,
      `grade10-admin-vault-operator-queue-SC-69`,
      `grade10-admin-vault-operator-queue-SC-70`,
      `grade10-admin-vault-operator-queue-SC-71`,
      `grade10-admin-vault-operator-queue-SC-72`,
      `grade10-admin-vault-operator-queue-SC-73`,
      `grade10-admin-console-collector-page-SC-03`,
      `grade10-admin-console-collector-page-SC-04`,
      `grade10-admin-console-collector-page-SC-05`)
- [ ] 8.2 Build `WalkInDialog` in `packages/vault/admin-frontend`, opened from
      `CaseQueuePanel`'s header: the statement first, the form, the photos
      sent to the staff photo route once the draft opens, and the case's page
      after (`grade10-admin-vault-operator-queue-SC-55`,
      `grade10-admin-vault-operator-queue-SC-57`,
      `grade10-admin-vault-operator-queue-SC-58`,
      `grade10-admin-vault-operator-queue-SC-63`)
- [ ] 8.3 Add the collector column to `CaseQueueTable` and
      `CustodyHoldingsPanel` over `admin.collectorNames`, the narrowing
      through `?collector=` in `useVaultAddresses`, the line above the rows
      that clears it, and the link beside each name
      (`grade10-admin-vault-operator-queue-SC-66`,
      `grade10-admin-vault-operator-queue-SC-69`,
      `grade10-admin-vault-operator-queue-SC-70`,
      `grade10-admin-vault-operator-queue-SC-71`,
      `grade10-admin-vault-operator-queue-SC-72`,
      `grade10-admin-vault-operator-queue-SC-73`,
      `grade10-admin-console-collector-page-SC-03`)
- [ ] 8.4 Add **The collector's cases** to `CaseDetailPanel`'s header for every
      `vault:read` holder, absent on a case with no collector
      (`grade10-admin-console-collector-page-SC-04`,
      `grade10-admin-console-collector-page-SC-05`)
- [ ] 8.5 Write the stories: `Vault/Admin/WalkIn/Walk In Dialog` over every
      state of the form's `ui-design.md` table, and the collector column's
      named, unavailable, treasurer and narrowed states on the existing queue
      and held items stories
- [ ] 8.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `storybook build` and the a11y run over this group's stories,
      `pnpm run check:admin-bundle`

## 9. The collector SPA's line (grade10) (owner: @ecchochan)

- [ ] 9.1 Cover the list's line for a draft staff opened, its reopening in the
      wizard at the photograph step, and a draft the collector cancelled
      staying on the list (`grade10-site-vault-case-intake-SC-32`,
      `grade10-site-vault-case-lifecycle-SC-44`)
- [ ] 9.2 Map `openedAtCounter` in `packages/vault/frontend`'s cases feature
      and fixture transport, and print `vault.list.openedAtCounter` on the
      draft's card (`grade10-site-vault-case-intake-SC-32`,
      `grade10-site-vault-case-lifecycle-SC-44`)
- [ ] 9.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `storybook build`

## 10. The collector page (grade10) (owner: @ecchochan)

- [ ] 10.1 Cover the page against the fixture transport: the address under
      the Vault entry, the refusal without `vault:read`, the header for staff,
      for a treasurer, unavailable and unknown, the cases section paged and
      empty, each section loading and failing on its own with a retry
      (`grade10-admin-console-collector-page-SC-01`,
      `grade10-admin-console-collector-page-SC-02`,
      `grade10-admin-console-collector-page-SC-08`,
      `grade10-admin-console-collector-page-SC-09`,
      `grade10-admin-console-collector-page-SC-10`,
      `grade10-admin-console-collector-page-SC-11`,
      `grade10-admin-console-collector-page-SC-12`,
      `grade10-admin-console-collector-page-SC-13`,
      `grade10-admin-console-collector-page-SC-14`,
      `grade10-admin-console-collector-page-SC-15`,
      `grade10-admin-console-collector-page-SC-16`,
      `grade10-admin-console-collector-page-SC-17`)
- [ ] 10.2 Add `vaultCollector` at `/vault/collectors/:userId`, `kind:
      "detail"`, to `SURFACES` in `apps/admin/grade10/src/surfaces.ts`, so
      `SECTION_OF.vaultCollector` is `vault`, with `vaultCollectorAddress`,
      and mount `routes/vault-collector.tsx` above `ROUTES.vault` in
      `routesFor` (`grade10-admin-console-collector-page-SC-01`,
      `grade10-admin-console-collector-page-SC-02`)
- [ ] 10.3 Build `pages/vault/CollectorPage.tsx`: the header over
      `admin.collectorAccount` for `kyc:read` holders and the short id
      otherwise, and the vault cases section as a view of
      `packages/vault/admin-frontend` over `admin.collectorCases`, each with
      its own `Status`, error and retry; the header's **Their cases on the
      queue** link to `/vault?collector=<user id>` for every reader
      (`grade10-admin-console-collector-page-SC-19`,
      `grade10-admin-console-collector-page-SC-20`,
      `grade10-admin-console-collector-page-SC-22`,
      `grade10-admin-console-collector-page-SC-08`,
      `grade10-admin-console-collector-page-SC-09`,
      `grade10-admin-console-collector-page-SC-10`,
      `grade10-admin-console-collector-page-SC-11`,
      `grade10-admin-console-collector-page-SC-12`,
      `grade10-admin-console-collector-page-SC-13`,
      `grade10-admin-console-collector-page-SC-14`,
      `grade10-admin-console-collector-page-SC-15`,
      `grade10-admin-console-collector-page-SC-16`,
      `grade10-admin-console-collector-page-SC-17`)
- [ ] 10.4 Write the stories for every state of the page's `ui-design.md`
      table
- [ ] 10.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `storybook build` and the a11y run, `pnpm run check:admin-bundle`

## 11. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review vault-walk-ins-and-owners`) as
its input, and groups 3 to 10 landed; `/tcs-run-sheet` executes the manual
cases after deployment.

- [ ] 11.1 Walk the counter in `apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`:
      `grade10-admin-vault-operator-queue-US-10` from the console's walk-in to
      the draft's page, then `grade10-site-vault-case-intake-US-06` from the
      collector's own sign-in to the send, asserting on the dev outbox that
      nothing was mailed before the send
- [ ] 11.2 Walk the typo in the same file:
      `grade10-site-vault-case-lifecycle-US-06`, the cancel, the account at
      the wrong address finding nothing and receiving nothing, the Closed view
      listing it as erased, and the draft opened again under the right
      address
- [ ] 11.3 Walk the names in `vault/collectors.spec.ts`:
      `grade10-admin-vault-operator-queue-US-11`,
      `grade10-admin-vault-operator-queue-US-12`,
      `grade10-admin-console-collector-page-US-01` and, signed in as a
      treasurer, `grade10-admin-console-collector-page-US-02`
- [ ] 11.4 Flip the cases the walks decide with
      `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks'
      own commit, and name the ones that stay manual in their suite and in
      this change's `rounds.md` row
- [ ] 11.5 Verify: `pnpm run test:e2e` on the isolated stack,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run tcs:validate` in
      grade10-spec
