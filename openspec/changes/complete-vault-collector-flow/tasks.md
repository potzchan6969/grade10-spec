# Tasks

Landing order is [`tech-design.md`](tech-design.md)'s Migration Plan. Groups 1
and 2 land in **grade10-spec** and are what the submodule bump carries; every
group after them lands in **grade10**, and group 5 bumps the pointer. Group 3
is the contract every other application group reads: once it has landed, the
backend groups (4 to 11) and the frontend groups (12 to 18) are parallel, the
frontends working against the fixture transport rather than a running worker.
Group 19 stands the Storybook the frontend groups' stories are written for,
group 20 is the manual, and group 21 is the walk.

One migration, `0031_case_reference.sql`, lands in group 4, and the worker and
both SPAs deploy from one commit in one window — Migration Plan, step 2.

## 1. The collector's words (grade10-spec)

- [ ] 1.1 Name the new keys in the vocabulary type first, so
      `pnpm --filter @grade10/i18n run test` refuses every language that has
      not answered them yet
- [ ] 1.2 Rename the flat `case.*` and `request.*` keys in
      `packages/i18n/messages/shared/<locale>/vault.json` into the nested
      `vault.case.offer.*`, `vault.money.howToPay.*`, `vault.money.owed.*` and
      `vault.request.sent.*` families, in `en`, `zh-Hant`, `zh-Hans` and `ko`,
      opening no second family beside them
- [ ] 1.3 Answer the case's own words: `vault.case.reference`, the eight
      `vault.case.stage.*`, the eight `vault.case.chip.*`, the five
      `vault.case.fact.*` with their title, body and next step, and the four
      `vault.case.ending.*` with `vault.case.startAnother`
- [ ] 1.4 Answer the money words: `vault.money.howToPay.*`,
      `vault.money.owed.*`, `vault.money.repayments.*`,
      `vault.money.notice.*` and `vault.money.reminders.*`
- [ ] 1.5 Answer the request, visit, data and list words:
      `vault.request.step.*`, `vault.request.review.*`,
      `vault.request.sent.*`, `vault.visit.booked.*`, `vault.visit.shop.*`,
      `vault.visit.rules`, `vault.data.*` and `vault.list.*`
- [ ] 1.6 Verify: `pnpm --filter @grade10/i18n run test`,
      `pnpm run typecheck`, `pnpm run lint`

## 2. The preview letters (grade10-spec)

- [ ] 2.1 Write `apps/emails/emails/vault/fixtures.ts` as one `LetterFacts`
      member per `NotifyKind`, the data the worker's `render.test.tsx` reads
      back through `external/grade10-spec` — the fixtures land before the
      letters that render them
- [ ] 2.2 Widen `EmailFooter` with the optional `lines` prop for the
      registered name and the licence line, the shop address, the complaints
      contact and the time-zone line, the one component change this store
      carries
- [ ] 2.3 Add the preview letters under `apps/emails/emails/vault/`, one file
      per kind over `Grade10EmailShell`, composing the facts table, the
      how-to-pay and reminder groups, the notice clause, the case line,
      `PrimaryCta` and the widened footer
- [ ] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run email:build`

## 3. The derived facts and the wire (grade10)

Every other application group reads this one's exports.

- [ ] 3.1 Table-test the pure answers in `packages/vault/contracts`, `asOf` on
      both sides of every deadline: the chip, the stage, the lane and the fact
      (`grade10-site-vault-case-lifecycle-SC-24`, `SC-25`, `SC-26`, `SC-27`,
      `SC-29`, `SC-30`, `SC-31`, `SC-32`, `SC-33`, `SC-34`, `SC-35`, `SC-36`,
      `SC-38`, `SC-40`), the identity's six words
      (`grade10-admin-vault-operator-queue-SC-42`) and the four calendar
      escapes
- [ ] 3.2 Add `caseStanding(input, asOf, timeZone)` and
      `offerLapsed(expiresAt, status, asOf)` in
      `packages/vault/contracts/src/standing.ts`, over the six scalars both
      reads carry, answering `{ chip, stage, lane, fact }` — the storage lane
      walks the same list without `offer` and `loan`
      (`grade10-site-vault-case-lifecycle-SC-24`–`SC-27`, `SC-29`–`SC-36`,
      `SC-38`, `SC-40`)
- [ ] 3.3 Add `caseEnding(detail)` over the detail's typed `ended`, `notice`
      and `forfeiture` fields, `identityStanding(state)` over `checkState` and
      `verified`, the status-to-collector-word map both SPAs import, and
      `CASE_REFERENCE_ALPHABET` (`grade10-admin-vault-operator-queue-SC-42`)
- [ ] 3.4 Replace `caseDetailSchema.paymentInstructions` with
      `howToPay: NullOr({ payee, fpsId, bankAccount, reference })` and add
      `repayments[].balanceAfterMinor`, `notice`, `forfeiture`, `ended` and
      `reminders`; add `reference`, `offerExpiresAt`, `dueAt` and `endedAs` to
      `vaultCaseSchema`
- [ ] 3.5 Drop `paymentInstructions` from `LEGAL_IDENTITY_FIELDS` in
      `packages/app-env/src/legalIdentity.ts` for `fpsId` and `bankAccount`,
      neither blocking, and keep `check:libs` naming both unset
- [ ] 3.6 Fix `escapeCalendarText` in
      `packages/appointment/contracts/src/calendar.ts`, where `;` is replaced
      by itself
- [ ] 3.7 Verify: `pnpm run typecheck`, `pnpm run lint`,
      `pnpm run test:backend`, `pnpm run check:libs`

## 4. The case reference (grade10)

- [ ] 4.1 Cover the reference: an insert per draw and the throw by name after
      eight, the alphabet, the unique index, the backfill over seeded rows,
      and the case-folded prefix search's query shape
      (`grade10-site-vault-case-intake-SC-19`, `SC-20`, `SC-21`, `SC-22`,
      `grade10-admin-vault-operator-queue-SC-24`, `SC-26`, `SC-47`,
      `SC-48`)
- [ ] 4.2 Write `0031_case_reference.sql`: the column nullable, the unique
      index, one deterministic per-row backfill, then the check and
      `SET NOT NULL`, with the `-- contract:` and `-- lock:` lines
      `check:migrations` asks for
- [ ] 4.3 Add `caseReference(random)` in `cases/reference.ts` and issue it in
      `cases/intake.ts` beside the `vc_` id — an independent insert guarded by
      `isUniqueViolation`, eight attempts, then a throw by name, before
      `openCase`'s transaction (`grade10-site-vault-case-intake-SC-19`,
      `SC-20`, `SC-21`)
- [ ] 4.4 Read a case-folded term of two to six characters of the alphabet as
      `termKind: "reference"` in `repositories/cases.ts` `searchCases` and one
      of seven or more as an id prefix, and keep the id in every route, link
      and `CASE_PATH` (`grade10-admin-vault-operator-queue-SC-24`,
      `SC-26`, `SC-47`, `SC-48`, `grade10-site-vault-case-intake-SC-22`)
- [ ] 4.5 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 5. The letters (grade10)

Needs group 2 merged to this store's `main`: the render test reads the store's
fixtures through `external/grade10-spec`.

- [ ] 5.1 Cover the catalogue as one table over `LETTERS`, kind to blocks and
      attachments, reading the store's fixtures, plus `printedValue` per field
      (`grade10-site-vault-collector-notifications-SC-03`, `SC-04`, `SC-20`,
      `SC-21`, `SC-22`, `SC-23`, `SC-24`, `SC-25`, `SC-26`, `SC-27`, `SC-28`,
      `SC-29`, `SC-30`, `SC-31`, `SC-32`, `SC-33`, `SC-34`,
      `grade10-site-vault-loan-and-settlement-SC-36`, `SC-38`)
- [ ] 5.2 Bump the `external/grade10-spec` submodule pointer to the commit
      carrying groups 1 and 2
- [ ] 5.3 Add `printedValue(ports, field)` in
      `packages/vault/backend/src/legal/printed.ts` — production and null
      throws `LEGAL_IDENTITY_UNSET` by field, any other environment answers
      the marked placeholder — and compose `printedEntity` over it with every
      fallback it has today (`grade10-site-vault-collector-notifications-SC-32`,
      `SC-33`, `grade10-site-vault-loan-and-settlement-SC-38`)
- [ ] 5.4 Compose `email/letters/VaultLetter.tsx` over `@grade10/email/render`'s
      `BaseLayout`, hoisting the facts table and the action button beside it,
      and keep `TermsTable`, `HowToPay`, `ReminderSchedule`, `NoticeClause` and
      `LicenceFooter` vault-side
- [ ] 5.5 Write one file per family under `letters/` — `offer.tsx`,
      `money.tsx`, `notice.tsx`, `visit.tsx`, `case.tsx`, `identity.tsx` — and
      the exhaustive `LETTERS: Record<NotifyKind, Letter>` in `letters/index.ts`
      that `renderVaultLetter(kind, facts)` reads
      (`grade10-site-vault-collector-notifications-SC-03`, `SC-04`, `SC-20`,
      `SC-21`, `SC-22`, `SC-23`, `SC-24`, `SC-25`, `SC-26`, `SC-27`, `SC-28`,
      `SC-29`, `SC-30`, `SC-31`, `SC-34`)
- [ ] 5.6 Widen `email/messages.ts`'s `Copy` to a typed `LetterCopy` per kind
      and keep `createEmailTranslator` reading it, so the path to
      `@grade10/i18n` is unchanged
- [ ] 5.7 Build the facts once in `letterFacts(db, vaultCase, kind, extra)`,
      called by `tellCustomer` and by `sweeps/notify.ts`'s resend, honouring
      `notification_retries`'s `amountMinor`, `notifyAt` and `packetId` over a
      re-derivation
- [ ] 5.8 Render at the head of `recordPayout`, `recordRepayment`,
      `sendForfeitureNotice` and the reminder pass, before each transaction
      opens, and classify `PermanentEmailSendError` in `notifyQuietly` as the
      auction's `parkNotifyFailure` does
      (`grade10-site-vault-collector-notifications-SC-33`)
- [ ] 5.9 Verify: `pnpm run check:submodules`, `pnpm run typecheck`,
      `pnpm run lint`, `pnpm run test:backend`

## 6. The case read and the collector's acts (grade10)

- [ ] 6.1 Cover the detail read's new fields and the acts' refusals: the
      balance after each repayment, the reminder ladder, the notice, the
      statement version on the `intake_submitted` event, a stale quote and a
      stranger's case (`grade10-site-vault-case-intake-SC-17`,
      `grade10-site-vault-case-lifecycle-SC-39`,
      `grade10-site-vault-valuation-and-offer-SC-27`,
      `grade10-site-vault-loan-and-settlement-SC-29`, `SC-31`, `SC-33`,
      `SC-48`)
- [ ] 6.2 Answer `repayments[].balanceAfterMinor` as the fold at that value
      date through `money/computeDue.ts`, the one authority, so a repayment
      taken back leaves the list
      (`grade10-site-vault-loan-and-settlement-SC-29`)
- [ ] 6.3 Answer `notice` from `custody/forfeit.ts`'s
      `latestForfeitureNotice`, `forfeiture`, `ended`, and
      `reminders: { next, ladder }` folded from the due date, the offsets in
      `sweeps/remind.ts` and the notice — only what is ahead
      (`grade10-site-vault-loan-and-settlement-SC-31`, `SC-33`, `SC-48`)
- [ ] 6.4 Answer `howToPay` from `legalIdentity(brand)` and the case
      reference, null on every case but a live loan
- [ ] 6.5 Refuse an answer naming the superseded offer, and refuse
      `QUOTE_STALE` where the balance moved under an act carrying the detail's
      `asOf` (`grade10-site-vault-valuation-and-offer-SC-27`)
- [ ] 6.6 Take `collectionStatement: { acknowledged: true }` on `cases.submit`,
      refuse without it, and write `COLLECTION_STATEMENT_VERSION` from
      `documents/plan.ts` into the `intake_submitted` event's details
      (`grade10-site-vault-case-intake-SC-17`)
- [ ] 6.7 Answer a case the caller does not own as not found
      (`grade10-site-vault-case-lifecycle-SC-39`)
- [ ] 6.8 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 7. Erasure, filed by the account holder (grade10)

- [ ] 7.1 Cover both workers: self files with no ban, self cancels without
      lifting a conduct ban, an operator filing converts an open self-filed
      row, `enforceOpenErasure` leaves a self-filed session alone, and a held
      case refuses the ask in words (`shared-auth-users-SC-28`, `SC-29`,
      `SC-30`, `SC-31`, `SC-32`, `SC-33`, `SC-34`, `SC-35`, `SC-36`, `SC-37`,
      `SC-38`, `SC-39`, `SC-40`, `SC-41`,
      `grade10-site-vault-retention-and-erasure-SC-23`)
- [ ] 7.2 Condition the ban in `erasureRequests.ts` on `actor.id === userId` —
      a self-filed row bans nothing, a cancel lifts the ban only where
      `open.requestedBy !== userId`, an operator filing over a self-filed row
      takes it over — and give `readSession.ts`'s `enforceOpenErasure` the same
      branch (`shared-auth-users-SC-30`, `SC-31`, `SC-32`, `SC-34`, `SC-35`,
      `SC-36`, `SC-40`, `SC-41`)
- [ ] 7.3 Make a second filing answer the open row's `executeAfter` and a
      cancel with no open row a no-op, in place of
      `ERASURE_ALREADY_REQUESTED` and `ERASURE_NO_REQUEST`
      (`shared-auth-users-SC-28`, `SC-29`, `SC-33`, `SC-37`, `SC-38`, `SC-39`)
- [ ] 7.4 Add `ownErasureStatus`, `requestOwnErasure` and `cancelOwnErasure` to
      `packages/grade10-auth/backend/src/entrypoint.ts` and to
      `AuthServiceBinding`, each resolving the person from the session the
      headers carry as `lookupUsers` does
- [ ] 7.5 Add `cases.yourData` answering the retention classes off
      `packages/app-env/src/retention.ts`, the identity standing over
      `kyc.latestForUser`, the sealed documents paged by case, the vault's own
      `holds` and the open request
- [ ] 7.6 Add `cases.requestErasure`, refusing `ERASURE_HELD` with the holds in
      words while any stand, and `cases.cancelErasure`
      (`grade10-site-vault-retention-and-erasure-SC-23`)
- [ ] 7.7 Move `docs/architecture/account-data.md` to what an operator's
      filing over a self-filed row now does
- [ ] 7.8 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 8. The one download of every signed document (grade10)

- [ ] 8.1 Cover the route: a stranger refused by `caseOwner`, the byte ceiling
      refused before the first read, the documents of two of the caller's own
      cases, a read row per document and one chain row
      (`grade10-site-vault-documents-and-signing-SC-26`, `SC-28`, `SC-29`)
- [ ] 8.2 Lift the ZIP writer from `packages/wallet-pass/src/apple/zip.ts` into
      `packages/utils/src/zip.ts`, add the `@grade10/utils/zip` export and its
      Handbook card row, and leave `wallet-pass` reading it
- [ ] 8.3 Serve `GET /api/cases/documents.zip` (`VAULT_PATHS.documentsZip`)
      under the session tier over the cursor `cases.yourData` takes, summing
      the recorded object sizes first and refusing `TOO_LARGE` by name past
      52,428,800 bytes
      (`grade10-site-vault-documents-and-signing-SC-26`, `SC-28`)
- [ ] 8.4 Append `recordDocumentRead` per document through `documents/serve.ts`
      before its bytes go, and one `vault.documents.setDownloaded` row — who,
      when, how many (`grade10-site-vault-documents-and-signing-SC-29`)
- [ ] 8.5 Verify: `pnpm run check:handbook`, `pnpm run typecheck`,
      `pnpm run lint`, `pnpm run test:backend`

## 9. The visit's calendar file (grade10)

- [ ] 9.1 Cover the route: the booking's own `UID` and sequence, a moved visit
      keeping both, `METHOD:CANCEL` after a cancel, a stranger refused, and the
      three visit letters carrying the file
      (`grade10-site-vault-visit-booking-SC-22`, `SC-23`, `SC-24`, `SC-25`,
      `SC-26`)
- [ ] 9.2 Serve `GET /api/cases/:caseId/visit.ics`
      (`VAULT_PATHS.visitCalendar`) in `routes/visit.ts` on `caseOwner`,
      answering `text/calendar` from `buildCalendarFile` over
      `appointments.getBooking(caseId)` — `<bookingId>@grade10-appointments`
      and the diary's own revision (`grade10-site-vault-visit-booking-SC-22`,
      `SC-23`, `SC-24`)
- [ ] 9.3 Answer a cancelled visit from the booking the diary keeps, so
      `METHOD:CANCEL` goes out against the `UID` and `DTSTART` the phone holds
      (`grade10-site-vault-visit-booking-SC-25`)
- [ ] 9.4 Attach the same file to `visit_booked`, `visit_rescheduled` and
      `visit_cancelled`, each sent one at a time
      (`grade10-site-vault-visit-booking-SC-26`)
- [ ] 9.5 Verify: `pnpm run typecheck`, `pnpm run lint`,
      `pnpm run test:backend`

## 10. The console's queue and custody reads (grade10)

- [ ] 10.1 Cover the reads with both halves — the query shape and the rows:
      one `GROUP BY status` folded onto the seven cuts, the Today cut ordered
      by `appointment_at`, the search trail, the custody totals and the key
      terms the plan names (`grade10-admin-vault-operator-queue-SC-01`,
      `SC-02`, `SC-07`, `SC-08`, `SC-09`, `SC-43`, `SC-44`,
      `grade10-site-vault-documents-and-signing-SC-23`, `SC-24`)
- [ ] 10.2 Add `admin.queueCounts` under `vault:read` — one `GROUP BY status`
      folded onto the seven cuts, one instant and the brand's zone passed in —
      and leave the Today block reading `admin.list` with `filter: "today"`
      ordered by `appointment_at` (`grade10-admin-vault-operator-queue-SC-01`,
      `SC-02`)
- [ ] 10.3 Keep the search's chain row off the term and leave listing the queue
      recording nothing (`grade10-admin-vault-operator-queue-SC-07`, `SC-08`,
      `SC-09`)
- [ ] 10.4 Add `totals: { inVault, perShop, withLoan, pickupBooked }` to
      `admin.custodyList` from the same predicate the rows use
      (`grade10-admin-vault-operator-queue-SC-43`, `SC-44`)
- [ ] 10.5 Add `admin.policy` answering `lendingPolicy(brand)`, `accrualOf`,
      the reminder ladder's days and `REQUIRED_FOR_OFFER`'s unset fields, and
      `admin.keyTerms` answering the loan agreement's clause ids and headings
      from `documents/templates/loanAgreement.ts`
      (`grade10-site-vault-documents-and-signing-SC-24`)
- [ ] 10.6 Take `terms: string[]` on `recordTermsExplained` and refuse any set
      short of the plan's, holding a storage case to no list
      (`grade10-site-vault-documents-and-signing-SC-23`)
- [ ] 10.7 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 11. The money book's reads and the file (grade10)

- [ ] 11.1 Cover the folds and the file: the net out per currency, the arrears
      count and figures over the filter in force, the kind filter's query
      shape, the arrears rows' contact and notice fields, and the CSV route's
      grant, page and chain row (`grade10-admin-vault-money-book-SC-07`,
      `SC-08`, `SC-13`, `SC-14`, `SC-15`, `SC-16`, `SC-17`, `SC-20`,
      `SC-21`, `SC-23`, `SC-25`, `SC-26`, `SC-29`, `SC-30`, `SC-31`)
- [ ] 11.2 Add `netOut` to `money/position.ts` — payouts less repayments per
      currency, a correction netting its row once, positive when money is out
      (`grade10-admin-vault-money-book-SC-13`, `SC-14`, `SC-15`)
- [ ] 11.3 Add `admin.arrearsSummary`: the count and the two figures, folding
      `computeDue` at one instant over every loan the filter in force holds
      (`grade10-admin-vault-money-book-SC-16`, `SC-17`)
- [ ] 11.4 Add `kind: payout | repayment | adjustment` to `admin.moneyLedger`'s
      input, narrowing with the method filter already there
      (`grade10-admin-vault-money-book-SC-25`, `SC-26`)
- [ ] 11.5 Carry the borrower's contact, the notice date and the last
      `reminder_sent` on `overdueLoans` rows, and keep the cursor, the order
      and the page boundary as they are
      (`grade10-admin-vault-money-book-SC-07`, `SC-08`, `SC-29`, `SC-30`,
      `SC-31`)
- [ ] 11.6 Serve `GET /api/admin/money-ledger.csv`
      (`VAULT_PATHS.moneyLedgerCsv`) on `elevatedRoute` under `vault:payout`,
      taking the ledger's own filter, cursor and limit and writing the filter
      and the row count to the chain
      (`grade10-admin-vault-money-book-SC-20`, `SC-21`, `SC-23`)
- [ ] 11.7 Verify: `pnpm --dir packages/api-docs run generate` and commit its
      output, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 12. The case page (grade10)

Needs group 3's exports; the fixture transport stands in for groups 4 and 6.

- [ ] 12.1 Cover the page per chip, per stage and per ending, each
      confirmation's words, and each refusal named where the answer was given
      (`grade10-site-vault-case-lifecycle-SC-16`, `SC-17`, `SC-18`, `SC-19`,
      `SC-20`, `SC-21`, `SC-22`, `SC-23`, `SC-28`, `SC-37`,
      `grade10-site-vault-valuation-and-offer-SC-21`, `SC-22`, `SC-23`,
      `SC-24`, `SC-25`, `SC-26`, `SC-28`, `SC-29`)
- [ ] 12.2 Build `CaseStepper` and `OwnershipChip` over `caseStanding`, both
      rendering the answer and deriving nothing, and put the reference in the
      case header as a mono `Text`
- [ ] 12.3 Build `CaseFactCard` and render the fact the case meets and the
      ending it reached over `caseEnding`
      (`grade10-site-vault-case-lifecycle-SC-20`, `SC-21`, `SC-22`, `SC-23`,
      `SC-28`)
- [ ] 12.4 Build `OfferCard` and `AcceptOfferDialog`, the dialog mounted on a
      boolean because it carries the terms, and read a superseded offer beside
      the live one (`grade10-site-vault-valuation-and-offer-SC-21`, `SC-22`,
      `SC-25`, `SC-26`)
- [ ] 12.5 Add `accept`, `decline` and `cancel` to
      `packages/vault/frontend/src/core/api/VaultApi.ts` beside
      `requestRelease`, answer all four from the fixture transport, and ask
      Decline, Cancel this request and Ask for it back through `useConfirm`
      (`grade10-site-vault-case-lifecycle-SC-16`, `SC-17`, `SC-18`, `SC-19`,
      `SC-37`, `grade10-site-vault-valuation-and-offer-SC-23`)
- [ ] 12.6 Carry the detail's `asOf` into every act, send an answer once, and
      name a lapsed offer, a stale quote and a case that moved where the
      answer was given (`grade10-site-vault-valuation-and-offer-SC-24`,
      `SC-28`, `SC-29`, `grade10-site-vault-case-lifecycle-SC-19`)
- [ ] 12.7 Write the view's stories as `Vault/Cases/CaseDetailView`, one per
      distinct layout, the varied value an args control
- [ ] 12.8 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 13. The live loan on the case page (grade10)

- [ ] 13.1 Cover the live loan: the repayments list empty, one and many, the
      reminders still ahead, the notice with its date to pay by, and the
      how-to-pay block on a live loan, on no loan and in production
      (`grade10-site-vault-loan-and-settlement-SC-27`, `SC-28`, `SC-30`,
      `SC-32`, `SC-34`, `SC-35`, `SC-37`, `SC-47`)
- [ ] 13.2 Build `WhatIsOwedCard` with the as-at figures, the progress line and
      the term breakdown, and `RepaymentsList` under it, each row with its
      value date, method and the balance after it
      (`grade10-site-vault-loan-and-settlement-SC-27`, `SC-28`)
- [ ] 13.3 Render the reminders still to come and the final notice through
      `CaseFactCard` (`grade10-site-vault-loan-and-settlement-SC-30`, `SC-32`,
      `SC-34`)
- [ ] 13.4 Build `HowToPayBlock` over the detail's `howToPay` — the payee, the
      FPS id, the account, the case reference as the transfer reference, and
      card or cash at the counter — shown on a live loan alone, with the
      counter line in place of an unset value in production
      (`grade10-site-vault-loan-and-settlement-SC-35`, `SC-37`, `SC-47`)
- [ ] 13.5 Write the stories for the loan states under
      `Vault/Cases/CaseDetailView`
- [ ] 13.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 14. The request wizard and the case list (grade10)

- [ ] 14.1 Cover the third step and the list: the read-back, the tick a send is
      refused without, a statement nobody has written yet, the draft list, a
      photograph refused after the send, and the reference where a person
      needs it (`grade10-site-vault-case-intake-SC-01`, `SC-02`, `SC-15`,
      `SC-16`, `SC-18`, `SC-23`)
- [ ] 14.2 Build `RequestReview` as the wizard's third step — the read-back
      with Edit per block, what happens next, and the collection statement's
      tick (`grade10-site-vault-case-intake-SC-15`, `SC-16`)
- [ ] 14.3 Show "Being prepared" in place of a statement no brand has set, and
      leave the request sendable (`grade10-site-vault-case-intake-SC-18`)
- [ ] 14.4 Send `collectionStatement` with the submit, keep a draft listed as
      unsent, and refuse a photograph once the request has gone
      (`grade10-site-vault-case-intake-SC-01`, `SC-02`)
- [ ] 14.5 Read the reference on the list card and the sent step, and the chip
      and the answer-by day on every list row
      (`grade10-site-vault-case-intake-SC-23`)
- [ ] 14.6 Write the stories for `Vault/Request/RequestWizard` and
      `Vault/Cases/CaseList`, the empty list among them
- [ ] 14.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 15. The booked visit (grade10)

- [ ] 15.1 Cover the booked screen and the picker: the confirmation taking the
      picker's place, what to bring on each lane and each identity standing,
      the visit read on the case, a cancel, a move, a window with nothing free,
      a slot taken while the collector chose, and a sibling case
      (`grade10-site-vault-visit-booking-SC-15`, `SC-16`, `SC-17`, `SC-18`,
      `SC-19`, `SC-20`, `SC-21`, `SC-27`, `SC-28`, `SC-29`, `SC-30`)
- [ ] 15.2 Build `VisitBooked` over `@grade10/ui`'s `BookingConfirmation` and
      `BookingManageCard`, with the Before you come list, add to calendar
      pointing at `visit.ics`, move and cancel
      (`grade10-site-vault-visit-booking-SC-15`, `SC-16`, `SC-17`, `SC-18`,
      `SC-19`)
- [ ] 15.3 Read the standing visit on the case and leave the case standing when
      the visit is called off (`grade10-site-vault-visit-booking-SC-20`,
      `SC-21`)
- [ ] 15.4 Compose the picker from `BookingLocationPicker` and
      `BookingSlotPicker` for a first booking and for a move alike, say so when
      a window has nothing free, and name a slot taken under the collector
      (`grade10-site-vault-visit-booking-SC-27`, `SC-28`, `SC-29`)
- [ ] 15.5 Show a sibling case the lead's visit and no picker of its own
      (`grade10-site-vault-visit-booking-SC-30`)
- [ ] 15.6 Write the stories for `Vault/Booking/VisitBooked` and
      `Vault/Booking/VisitBooking`
- [ ] 15.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 16. Your data (grade10)

- [ ] 16.1 Cover the page: the account holder's own page, the retention
      classes, the identity standing in its four words, the documents listed
      under their case, a block that cannot be answered, and the ask filed,
      refused, cancelled and past its window
      (`grade10-site-vault-retention-and-erasure-SC-12`, `SC-13`, `SC-15`,
      `SC-16`, `SC-17`, `SC-18`, `SC-19`, `SC-20`, `SC-21`, `SC-22`, `SC-24`,
      `SC-25`, `SC-26`, `SC-27`, `SC-39`, `SC-40`,
      `grade10-site-vault-documents-and-signing-SC-27`)
- [ ] 16.2 Build `YourDataView` over `cases.yourData`, each block standing on
      its own so one that cannot be answered leaves the rest
      (`grade10-site-vault-retention-and-erasure-SC-12`, `SC-15`)
- [ ] 16.3 Build `RetentionTable` for the classes and their windows, reading a
      class nobody has decided as undecided, and render it on the released case
      as well (`grade10-site-vault-retention-and-erasure-SC-16`, `SC-17`,
      `SC-18`)
- [ ] 16.4 Render the identity standing through `identityStanding`, naming
      neither the person nor their document
      (`grade10-site-vault-retention-and-erasure-SC-19`, `SC-20`, `SC-21`,
      `SC-22`, `SC-39`, `SC-40`)
- [ ] 16.5 List every sealed document under its case and offer the one download
      `grade10-site/vault/documents-and-signing` defines, which offers none
      where nothing is signed
      (`grade10-site-vault-retention-and-erasure-SC-13`,
      `grade10-site-vault-documents-and-signing-SC-27`)
- [ ] 16.6 Ask for the erasure through `useConfirm`, read when it may run,
      cancel inside the window, name the holds beside an open request, and
      offer no cancel once the window has passed
      (`grade10-site-vault-retention-and-erasure-SC-24`, `SC-25`, `SC-26`,
      `SC-27`)
- [ ] 16.7 Write the stories for `Vault/Retention/YourDataView`
- [ ] 16.8 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 17. The console's queue, case tabs and identity panel (grade10)

- [ ] 17.1 Cover the console's reads and tabs: a count on every cut, the Today
      block in slot order and a day with none, the collector's word on a row,
      the reference on every case surface, the visit checklist in order, an act
      withheld with its reason, the identity panel's six states, the held-items
      rows and the custody log (`grade10-admin-vault-operator-queue-SC-21`,
      `SC-22`, `SC-23`, `SC-27`, `SC-28`, `SC-29`, `SC-30`, `SC-31`, `SC-32`,
      `SC-33`, `SC-34`, `SC-35`, `SC-36`, `SC-37`, `SC-38`, `SC-39`, `SC-40`,
      `SC-41`, `SC-45`, `SC-46`, `SC-49`, `SC-50`, `SC-51`, `SC-52`,
      `grade10-site-vault-documents-and-signing-SC-22`, `SC-25`)
- [ ] 17.2 Ride each cut's count on its own `Choice` label and mount the Today
      block as the Today cut with its count, saying so on a day with no visit
      (`grade10-admin-vault-operator-queue-SC-21`, `SC-22`, `SC-23`)
- [ ] 17.3 Print the collector's word from the shared map, the reference on
      every case surface, and say on a row when the collector is the one being
      waited on (`grade10-admin-vault-operator-queue-SC-27`, `SC-28`, `SC-29`)
- [ ] 17.4 Build `VisitChecklist` over `caseStanding`'s stage and the events —
      the counter's steps in order, each with its button or the reason it is
      waiting, the custody terms on a case that borrows nothing, no checklist
      with no visit today, and the next step handed on after an act
      (`grade10-admin-vault-operator-queue-SC-30`, `SC-31`, `SC-32`, `SC-33`,
      `SC-50`)
- [ ] 17.5 Build `ForfeitWithheld` on the Custody tab — the cure date, the day
      the notice went, the `FORFEITURE_NOTICE_REQUIRED` refusal in words, and
      Forfeit offered once nothing holds it — and say on each tab what the
      status withholds (`grade10-admin-vault-operator-queue-SC-34`, `SC-35`,
      `SC-36`, `SC-37`, `SC-38`, `SC-51`)
- [ ] 17.6 Rewrite `IdentityPanel` to the six words `identityStanding` answers,
      each with its own panel and who may record over it
      (`grade10-admin-vault-operator-queue-SC-39`, `SC-40`, `SC-41`, `SC-52`)
- [ ] 17.7 Build `KeyTermsDialog` over `admin.keyTerms` — the agreement's own
      terms as `Check`s, the reference optional — replacing the
      reference-only dialog, and hold a storage case to no list
      (`grade10-site-vault-documents-and-signing-SC-22`, `SC-25`)
- [ ] 17.8 Render the held-items tiles and rows from `custodyList.totals`, a
      shop holding nothing saying so, and read the locker moves back on the
      custody log (`grade10-admin-vault-operator-queue-SC-45`, `SC-46`,
      `SC-49`)
- [ ] 17.9 Write the stories for `Vault/Admin/Cases/*` — the queue panel, the
      case detail panel, the custody panel and the identity panel
- [ ] 17.10 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run check:admin-bundle`

## 18. The console's money panels and the three dialogs (grade10)

- [ ] 18.1 Cover the money panels and the dialogs: the register's order and its
      correction line, the kind filter, an empty range, the arrears read at
      zero and per currency, the row that chases the borrower, the file
      offered and withheld, and each dialog stating its rule before the act
      (`grade10-admin-vault-money-book-SC-01`, `SC-02`, `SC-12`, `SC-18`,
      `SC-22`, `SC-24`, `SC-27`, `SC-28`,
      `grade10-site-vault-loan-and-settlement-SC-40`, `SC-41`, `SC-42`,
      `SC-43`, `SC-44`, `SC-45`, `SC-46`)
- [ ] 18.2 Extend `MoneyLedgerPanel` with the kind filter and the net out over
      the range, reading the register in written order and naming the record a
      correction takes back, and say so on a range with nothing in it
      (`grade10-admin-vault-money-book-SC-01`, `SC-02`, `SC-27`)
- [ ] 18.3 Add `ExportCsv` over `money-ledger.csv`, passing the panel's own
      filter, cursor and limit, offering no file on an empty range and none at
      all without `vault:payout` (`grade10-admin-vault-money-book-SC-22`,
      `SC-24`)
- [ ] 18.4 Render the arrears summary above the list — the count, the two
      figures, zero where nothing is late, each row in its own currency and
      carrying what it takes to chase the borrower
      (`grade10-admin-vault-money-book-SC-12`, `SC-18`, `SC-28`)
- [ ] 18.5 Build `PolicyGates` over `admin.policy` and state the rule in the
      offer dialog: the figures derived from the terms entered and the bound a
      failing offer names before the send
      (`grade10-site-vault-loan-and-settlement-SC-40`, `SC-41`)
- [ ] 18.6 State the missing precondition in the vault dialog and the two
      people the payout dialog needs, and follow the due date and the reminder
      dates from the value date
      (`grade10-site-vault-loan-and-settlement-SC-42`, `SC-43`, `SC-44`)
- [ ] 18.7 Pass a bound nobody has set outside production and refuse it in
      production, and let the recording refuse what a dialog let through
      (`grade10-site-vault-loan-and-settlement-SC-45`, `SC-46`)
- [ ] 18.8 Write the stories for `Vault/Admin/Settlement/*` and
      `Vault/Admin/Valuation/OfferDialog`
- [ ] 18.9 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      `pnpm run check:admin-bundle`

## 19. The Storybook (grade10)

- [ ] 19.1 Stand `packages/storybook` (`@grade10/storybook`) on the store's
      `apps/preview` shape: plain Vite, Storybook 10.5.4 with `addon-a11y`,
      `addon-docs` and `addon-vitest`, globbing
      `packages/*/frontend/src/**/*.stories.tsx` and
      `packages/*/admin-frontend/src/**/*.stories.tsx`
- [ ] 19.2 Pick the decorator off a `surface` parameter — `site` mounts the
      grade10 theme root and the Theme toolbar, `console` mounts
      `apps/admin/grade10/src/AppProviders` and the Astryx theme with no
      toolbar — and add that one preview path to `check-astryx-boundary`'s
      allowlist
- [ ] 19.3 Add a `storybook` job to `.github/workflows/test.yml` beside
      `admin-bundle`: `storybook build`, then the a11y run through
      `@storybook/addon-vitest` in browser mode on the runner's chromium,
      failing on an axe violation
- [ ] 19.4 Verify: `pnpm run typecheck`, `pnpm run lint`, the new job green on
      every story groups 12 to 18 wrote

## 20. The manual (grade10-spec)

Lands once groups 1 to 19 are green and the change is deployed.

- [ ] 20.1 Take the 🚧 marks off the lines this change delivered on
      `docs/prds/products/grade10-site/vault/collector-pages.md`,
      `case-lifecycle.md`, `loan-and-money.md`, `documents-and-signing.md`,
      `compliance-and-readiness.md` and `operator-console.md`, and on
      `docs/prds/products/shared/auth/users.md` and
      `docs/prds/platform/account-data.md`, leaving the marks the
      `add-hosted-identity-verification` change still owes
- [ ] 20.2 Leave `TBC Legal` and ❓ Finance on what nobody has answered — the
      notice's wording, the licence line, the complaints contact, the
      collection statement, the FPS id and the bank account — and say on
      `loan-and-money.md` that the block prints its placeholders outside
      production until they are set
- [ ] 20.3 Verify: `pnpm check:manual`, then
      `pnpm run validate:changes complete-vault-collector-flow`

## 21. The walk (grade10)

- [ ] 21.1 Add the development-only routes the walks drive in
      `packages/vault/backend/src/routes/dev.ts` under
      `app.use("/dev/*", devOnly())`: `POST /dev/cases/seed` driving
      `cases/transitions.ts` to the named status and answering
      `{ caseId, reference }`, `POST /dev/sweep` taking
      `{ lane: "fast" | "slow" }`, and `GET /dev/outbox` reading the letters
      sent with their attachments
- [ ] 21.2 Lift auth's `magicLinkOutbox` into `@grade10/worker` beside
      `devOnly` and record the vault's email channel into it outside
      production
- [ ] 21.3 Add `vault-service,appointment-service,e-kyc-service` to
      `scripts/e2e/start-isolated.sh`'s default service list and
      `/vault/health` and `/appointment/health` to `STACK_READY_URLS` in
      `e2e/helpers/env.ts` — e-kyc is reached over a binding and has no
      address to probe
- [ ] 21.4 Walk the request in
      `apps/frontend/grade10/e2e/tests/vault/request.spec.ts`:
      `grade10-site-vault-case-intake-US-01`, `-US-04`, `-US-05` and
      `grade10-site-vault-case-lifecycle-US-01`
- [ ] 21.5 Walk the offer in `vault/offer.spec.ts`:
      `grade10-site-vault-valuation-and-offer-US-01`, `-US-02`, `-US-05`,
      `grade10-site-vault-case-lifecycle-US-02` and `-US-05`
- [ ] 21.6 Walk the loan in `vault/loan.spec.ts`:
      `grade10-site-vault-loan-and-settlement-US-01`, `-US-02`, `-US-04`,
      `-US-05`, `-US-06`, `-US-07`,
      `grade10-site-vault-case-lifecycle-US-04`,
      `grade10-site-vault-collector-notifications-US-01`, `-US-02`, `-US-04`
      and `-US-05`
- [ ] 21.7 Walk the visit in `vault/visit.spec.ts`:
      `grade10-site-vault-visit-booking-US-01`, `-US-04`,
      `grade10-site-vault-documents-and-signing-US-01`, `-US-03`,
      `grade10-site-vault-collector-notifications-US-03`, `-US-06`,
      `grade10-admin-vault-operator-queue-US-03`, `-US-04`, `-US-07` and
      `-US-09`
- [ ] 21.8 Walk the collector's own data in `vault/your-data.spec.ts`:
      `grade10-site-vault-retention-and-erasure-US-01`, `-US-02`, `-US-03`,
      `-US-05`, `grade10-site-vault-documents-and-signing-US-05`,
      `shared-auth-users-US-02` and `-US-05`
- [ ] 21.9 Walk the console's own reads in `vault/console.spec.ts`:
      `grade10-admin-vault-operator-queue-US-01`, `-US-02`, `-US-05`, `-US-06`,
      `-US-08`, `grade10-admin-vault-money-book-US-01`, `-US-02`, `-US-03`,
      `-US-04` and `-US-05`
- [ ] 21.10 Flip the cases the walks decide with
      `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks'
      own commit, and name the ones that stay manual in their suite and in this
      change's `rounds.md` row
- [ ] 21.11 Verify: `pnpm run test:e2e` on the isolated stack,
      `pnpm run typecheck`, `pnpm run lint`, `pnpm run tcs:validate` in
      grade10-spec
