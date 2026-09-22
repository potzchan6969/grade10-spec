# UI: Complete the vault collector flow

No Figma frame exists. The design canvas is the frame:
[Vault canvas](https://claude.ai/artifact/GtDo31jHhqGuhirojtEeJZ), one board
per screen, named below by its id (`C11`, `A07`, `M05`). A board is the
layout's source of truth; [decisions.md](decisions.md) owns the scope, the
journeys beside each delta own the behaviour, and `tech-design.md` owns the
data and the mechanism.

- **Where the views live** — `packages/vault/frontend` for the collector and
  `packages/vault/admin-frontend` for the console, as today; nothing moves
  to `packages/ui`
- **Stories** — one story per view per distinct layout, colocated as
  `<View>.stories.tsx` beside its view, wrapped in the feature's root
  element, with inline stand-in data and a Theme toolbar, in the monorepo
  Storybook the tech design stands up (`frontend-structure` § Storybook).
  Every story file sets `title` by hand to its prefix, `Vault/<Feature>/<View>`,
  so an id reads `vault-<feature>-<view>--<state>`, the state being the
  `## States` row's name in kebab-case. A value that varies inside one
  layout is an args control, never a story of its own, and a `::story`
  card deep-links the default args and names the control; the Stories
  column below gives each screen's prefix
- **Letters** — every collector email is a React Email letter the worker
  renders from `packages/vault/backend/src/email`; `apps/emails/emails/vault/`
  in this store carries the preview copy of each, one file per kind
- **Copy** — the collector's words are keys in
  `packages/i18n/messages/shared/<locale>/vault.json`; the keys this design
  adds are named under Components, never their words. The console's words
  stay the console's own English, as its panels already carry them; a
  letter's words stay in the letter catalogue
- **Values Legal owes** (Q17) — one rule over every surface that prints
  one: outside production the bracketed placeholder, marked; in production
  the act that would print an unset value is refused. Only the surface
  whose refusal differs carries a row below

## Screens

| Screen | Board | Route | Composes | Stories |
| --- | --- | --- | --- | --- |
| Vault home | `C01`, `C21` | `grade10.com/vault` | `CaseList` → `Card`, `Badge`, `Button`, `EmptyState`, `List`, `Text` | `vault-cases-case-list--*` |
| Request wizard | `C02`–`C05` | `/vault`, mounted by the home | `RequestWizard` → `Stepper`, `Step`, `RadioList`, `RadioListItem`, `TextInput`, `Textarea`, `NumberInput`, `FileDropzone`, `CheckboxListInput`, `Button`, `Text` | `vault-request-request-wizard--*` |
| Case page | `C10`–`C19`, `C22`, `C23` | `/vault/cases/:caseId` | `CaseDetailView` → `Stepper`, `Step`, `Badge`, `Card`, `Alert`, `Dialog`, `Table`, `List`, `Link`, `Button`, `Text` | `vault-cases-case-detail-view--*` |
| Book a visit | `C06`, superseded | on the case page | `VisitBooking` → `BookingLocationPicker`, `BookingSlotPicker`, `Button`, `Text` | `vault-booking-visit-booking--*` |
| Visit booked | `C07` | on the case page, after a booking | new `VisitBooked` → `BookingConfirmation`, `BookingManageCard`, `List`, `Link`, `Button` | `vault-booking-visit-booked--*` |
| Your data | `C20` | `/profile/data` — ❓ the tech design fixes the address | new `YourDataView` → `Card`, `Badge`, `Table`, `Button`, `Alert`, `Dialog`, `Text` | `vault-retention-your-data-view--*` |
| Queue | `A01` | `admin.grade10.com/vault`, the cut in the address | `VaultPage`, `CaseQueuePanel` → `SectionHeader`, `Search`, `ChoiceList`, `Choice`, `Figure`, `Table`, `Row`, `Cell`, `At`, `Money`, `Badge`, `Status`, `Button` | `vault-admin-cases-case-queue-panel--*` |
| Overdue | `A02` | `/vault`, the Overdue cut | `OverdueLoansPanel` → `Figure`, `Table`, `Badge`, `CursorPager`, `Status`, `Text` | `vault-admin-cases-overdue-loans-panel--*` |
| Money | `A07` | `/vault`, Money tab | `MoneyLedgerPanel` → `Figure`, `DateField`, `ChoiceList`, `Choice`, `Select`, `Table`, `Money`, `CursorPager`, `Button`, `Status` | `vault-admin-settlement-money-ledger-panel--*` |
| Held items | `A08` | `/vault`, Held items tab | `CustodyHoldingsPanel` → `Figure`, `Select`, `Table`, `Badge`, `CursorPager` | `vault-admin-cases-custody-holdings-panel--*` |
| Case — header and Case tab | `A03` | `/vault/cases/:caseId` | `CaseDetailPanel`, `CaseFlowPanel`, `CaseTimeline`, `BookingRow`, `WhatsAppPanel` → `Tabs`, `Tab`, `TabPanel`, `Badge`, `CheckList`, `Check`, `Panel`, `EntryList`, `Entry`, `Notice`, `Button` | `vault-admin-cases-case-detail-panel--*` |
| Case — Documents tab | `A04`, `A10` | same, Documents tab | `DocumentsPanel`, `IdentityPanel`, `KycDialog`, `MintDialog` → `Panel`, `Badge`, `CheckList`, `Check`, `FormDialog`, `TextField`, `Table`, `Link` | `vault-admin-compliance-documents-panel--*`, `vault-admin-compliance-identity-panel--*` |
| Case — Custody tab | `A05` | same, Custody tab | `CustodyPanel`, `MoveItemDialog`, `PromptDialog` → `Panel`, `Notice`, `EntryList`, `Table`, `FormDialog`, `Button` | `vault-admin-cases-custody-panel--*` |
| Make an offer | `A11` | dialog from the Case tab | `OfferDialog` → `FormDialog`, `MoneyField`, `PercentField`, `ChoiceList`, `Choice`, `DateField`, `CheckList`, `Check`, `Figure`, `Notice` | `vault-admin-valuation-offer-dialog--*` |
| Put the item in the vault | `A12` | dialog from the Custody tab | `CustodyPanel`'s vault dialog, `ShopPicker` → `FormDialog`, `CheckList`, `Check`, `Select`, `TextField`, `Notice` | `vault-admin-cases-vault-dialog--*` |
| Record the payout | `A13` | dialog from the Payouts tab | `MoneyDialog` → `FormDialog`, `CheckList`, `Check`, `MoneyField`, `TextField`, `DateField`, `Figure`, `Notice` | `vault-admin-settlement-money-dialog--*` |

## Components

### `@grade10/design-system` — existing, no new variant or token

`Alert` (`status`, `layout=inline`), `Badge` (`default`, `success`,
`error`, `warning`, `info`, `brand`, `outline`), `Button`, `Card` and its
parts, `CheckboxListInput`, `Dialog` and its parts, `Divider`, `EmptyState`,
`FileDropzone`, `Link`, `List`, `NumberInput`, `RadioList`,
`RadioListItem`, `Skeleton`, `Step` (`completed`, `progress`, `upcoming`),
`Stepper`, `Table` and its parts, `Text`, `TextInput`, `Textarea`, `HStack`,
`VStack`.

- **The ownership chip** is a `Badge` — `outline` while the item is the
  collector's, `info` while it is with us, `warning` past due, `success`
  settled. `Chip` is a dismissible control and does not fit
- **The progress line** on a live loan (sent · day n of the term · due) is a
  local composition of `HStack` and `Text`; no primitive draws a bar, and
  none is asked for

### `@grade10/ui` — existing

`BookingLocationPicker`, `BookingSlotPicker`, `BookingConfirmation`
(`calendarHref` already serves the calendar file) and `BookingManageCard`
from `shared/ui/appointment-booking`. Book a visit composes the two
pickers the diary already publishes — the shops as cards, then a month
grid and the picked day's times — rather than a third picker of its own.
The vault has no manage page, so `manageHref` is the case address.

### Console blocks — existing, `@grade10/frontend-console`

`SectionHeader`, `Search`, `ChoiceList`, `Choice`, `Select`, `Figure`,
`Status`, `Table`, `Row`, `Cell`, `At`, `Money`, `CursorPager`, `Badge`,
`StatusBadge`, `Tabs`, `Tab`, `TabPanel`, `Panel`, `Notice`, `CheckList`,
`Check`, `EntryList`, `Entry`, `FormDialog`, `InfoDialog`, `MoneyField`,
`PercentField`, `DateField`, `TextField`, `NotesField`, `Button`, `Link`,
`Text`. A tile is a `Figure`; a checklist is a `CheckList` of `Check`s; the
CSV export is a `Button` and a download. Nothing the console package lacks.

### New in `packages/vault/frontend` — work in grade10

- **`CaseStepper`** — the eight stages, six on the storage lane, each
  `Step`'s state read from the status
- **`OwnershipChip`** — the `Badge` and its word, read from the status, the
  offer and the due date
- **`CaseFactCard`** — one titled card of label · value rows, the only card
  shape these views add. Its call sites: the fact the case meets (`C22`),
  the ending (`C19`), the reminders, the final notice (`C16`), custody
  (`C14`), the identity standing, the documents download and the erasure
  ask (`C20`)
- **`OfferCard`** — the terms table with the valuation, How the loan works,
  Accept and Decline
- **`AcceptOfferDialog`** — the terms table sits in it, so the case page
  mounts it (`docs/conventions/dialogs.md`). Decline, Cancel this request,
  Cancel the visit, Ask for it back and the erasure ask are words and one
  effect: `useConfirm` with their copy keys, no component of their own
- **`HowToPayBlock`** — the structured block
- **`WhatIsOwedCard`** — the as-at figures, the progress line and the term
  breakdown; `RepaymentsList` under it, empty, one or many
- **`RetentionTable`** — what is kept and for how long, on the released case
  and on Your data
- **`RequestReview`** — the wizard's third step: the read-back with Edit per
  block, what happens next, the statement tick
- **`VisitBooked`** — the screen after a booking, composing the two
  `@grade10/ui` cards and the Before you come list
- **`YourDataView`** — `CaseFactCard` for the standing, the download and the
  ask, over `RetentionTable`
- **The reference** — a `Text` in the mono face on the header, the list card
  and the sent step; no component of its own

### Work in `packages/vault/admin-frontend` — grade10

- **`VisitChecklist`** — new: the counter's seven steps as `Check`s, each
  with its button or its reason
- **`PolicyGates`** — new: the five ticks, beside an offer and inside the
  dialog
- **`KeyTermsDialog`** — new: the loan agreement's own terms as `Check`s,
  the reference optional; replaces the reference-only dialog
- **`ForfeitWithheld`** — new: the reason in words on the Custody tab
- **`IdentityPanel`** — existing, rewritten to the six states
- **`OfferDialog`**, the vault dialog, **`MoneyDialog`** — existing,
  rewritten to state the rule before the act
- **`MoneyLedgerPanel`** — existing, extended: the method filter, the
  per-kind totals, the takes-back line and the pager already run, so the
  work is the kind filter, the net out over the range and `ExportCsv`
- **The counts and the tiles** — a cut's count rides its own `Choice`
  label and a tile is a `Figure` in the panel that reads it; neither is a
  component
- **The status word** — one map from status to the collector's word in
  `@grade10/vault-contracts`, imported by the console and the SPA alike,
  its words translated in the catalogue; the tech design names the home. No
  panel prints a raw id

### Letters — work in grade10 and in this store

One shell, `VaultLetter` — `Grade10EmailShell` in this store's previews,
`@grade10/email/render`'s `BaseLayout` in the worker — carrying the
heading, the greeting, the lead paragraph, the blocks, the case line and
the footer. One letter per kind, and twenty-four preview letters under
`apps/emails/emails/vault/` over a fixture case.

- **The facts** — the label · value rows are `ProductEmail`'s facts group;
  no table component of its own
- **`HowToPay` and `ReminderSchedule`** — a second facts group: FPS id,
  account under the lender's registered name, the case reference as the
  transfer reference, card or cash at the counter, the
  recorded-against-the-day line; then the schedule's dates
- **`PrimaryCta`** — existing, `apps/emails/emails/_components`
- **The case line** — reference · item, a `Text` above the footer
- **`EmailFooter`** — existing, widened with an optional `lines` prop for
  the registered name and the licence line, the shop address, the
  complaints contact and the time-zone line. The prop is the one component
  change this store carries

The words stay a typed `LetterCopy` per kind in
`packages/vault/backend/src/email/messages.ts` — today's `Copy`, widened to
the blocks its letter carries — so a missing line is a compile error and
the copy can still move to `@grade10/i18n`.

### Words — work in `packages/i18n`

Every key below is answered in `shared/` for every language it speaks; the
words are not written here. `vault.json` already answers the offer terms,
the accept, decline and cancel confirmations, the owed figures and the sent
step, under flat `case.*` and `request.*` keys: those keys are renamed into
the nested shape in one move, and nothing below opens a second family
beside them.

- **`vault.case.reference`**, **`vault.case.stage.*`** (eight),
  **`vault.case.chip.*`** (waitingOnYou, withUs, visit, due, pastDue,
  settled, collected, closed)
- **`vault.case.fact.*`** — offerLapsed, offerDeclined, offerReplaced,
  visitMissed, releaseRequested, each with its title, its body and its next
  step
- **`vault.case.ending.*`** — declined, cancelled, expired, forfeited, each
  with its title and body; `vault.case.startAnother`
- **`vault.case.offer.*`** — renamed from `case.offerTitle`,
  `case.offerTerms`, `case.offerRepayAfter`, `case.offerRepayBy`,
  `case.offerTotal`, `case.offerLate`, `case.offerOpen`, `case.acceptOffer`,
  `case.acceptConfirm`, `case.declineOffer`, `case.declineConfirm`,
  `case.cancelRequest` and `case.cancelConfirm`; adds howItWorks (four
  items), the valuation note and the confirmations' back labels
- **`vault.money.howToPay.*`** — renamed from `case.payTitle` and
  `case.payHolds`; adds fpsId, account, reference, counter,
  recordedAgainst, growsBy, receiptLine, placeholder
- **`vault.money.owed.*`** — renamed from `case.dueTitle`,
  `case.dueOutstanding`, `case.dueRepaid`, `case.dueRepaidLate`,
  `case.dueAsOf` and `case.owed.*`; adds progress (sent, dayOf, due),
  loan, termInterest, lateInterest, settledTable
- **`vault.money.repayments.*`** — title, empty, row, allocation,
  neverRestarts, receipt
- **`vault.money.notice.*`** — title, wroteOn, untilThen, remindersSent,
  noFurther; **`vault.money.reminders.*`** — title, schedule, free
- **`vault.request.step.*`** (three), the field hints, the photo tips,
  **`vault.request.review.*`** — title, edit, whatHappensNext (three),
  statementTick, statementRequired, statementUnset
- **`vault.request.sent.*`** — renamed from `request.sentTitle`,
  `request.sentMessage` and `request.severalItems`; adds reference,
  openCase, startAnother, closesAfter
- **`vault.visit.booked.*`** — title, emailLine, calendar, move, cancel,
  before (verify, verified, bring, sign, signStorage, moneyFollows,
  inPerson); **`vault.visit.shop.*`** — duration, moreShops;
  **`vault.visit.rules`**
- **`vault.data.*`** — title, intro, standing (verified, none, out,
  lapsed), keeps (title, classes, reviewed), download (title, body, all,
  none, failed), ask (title, body, refused, confirmTitle, confirmBody,
  confirm, keep, filed, cancel, cancelled, windowPassed)
- **`vault.list.*`** — heroIntro, howItWorks (four), emptyTitle, emptyBody,
  draftCap, draftNext, answerBy, inVaultSince

## States

### Vault home

| State | Shows | Anchor |
| --- | --- | --- |
| Loading | `list.loading`; no cards | `grade10-site-vault-case-intake-US-01` |
| Empty (`C21`) | the hero, Start a request, the four-step How it works, Nothing here yet with the three-draft cap; no cards | `grade10-site-vault-case-intake-US-01` |
| Cards (`C01`) | one `Card` per case: item title, the status word, the ownership chip, opened · lane · asked for, the reference; Open | `grade10-site-vault-case-intake-US-05` |
| Offer deadline | on an `offer_made` card with a live offer: answer by the expiry; absent once it lapsed | `grade10-site-vault-valuation-and-offer-US-02` |
| Held since | on a `vaulted`, `active` or `repaid` card: in the vault since | `grade10-site-vault-case-lifecycle-US-05` |
| Draft card | photographs attached count and the next-step line; Open resumes the wizard | `grade10-site-vault-case-intake-US-01` |
| Error | the message in the error tone; no cards | `grade10-site-vault-case-intake-US-01` |

### Request wizard

| State | Shows | Anchor |
| --- | --- | --- |
| Describe (`C02`) | step 1 of 3 on the `Stepper`; category, name with the 200 hint, description with the 2,000 hint, WhatsApp, lane, amount with the policy hint; Continue, Finish later | `grade10-site-vault-case-intake-US-01` |
| Photograph (`C03`) | step 2; `FileDropzone`, n of 10 attached, the format and 20 MB line, the location-removed line, three tips; Continue, Finish later | `grade10-site-vault-case-intake-US-01` |
| Photo refused | the existing refusals under the dropzone: type, size, empty, limit | `grade10-site-vault-case-intake-US-01` |
| Review (`C04`) | step 3; the request read back with Edit per block, What happens next (three items), the statement tick linking the statement page, Send it in, Finish later | `grade10-site-vault-case-intake-US-04` |
| Tick missing | Send it in refused on the page with the line under the tick; nothing sent | `grade10-site-vault-case-intake-US-04` |
| Statement being prepared | the tick's link opens the privacy page reading Being prepared; the tick records the version shown and still sends, in every environment | `grade10-site-vault-case-intake-US-04` |
| Sent (`C05`) | the reference in mono, Book a visit, Not now — open the case, the several-items block, Start another request, the 30-day line | `grade10-site-vault-case-intake-US-05` |
| Draft limit | `request.draftLimitReached` on Start a request | `grade10-site-vault-case-intake-US-01` |
| Moved on | `request.caseConflict` on Send it in | `grade10-site-vault-case-intake-US-01` |

### Case page

| State | Shows | Anchor |
| --- | --- | --- |
| Loading | `case.loading`; nothing else | `grade10-site-vault-case-lifecycle-US-05` |
| Not found | the site's not-found copy | `grade10-site-vault-case-lifecycle-US-05` |
| Header | item title, category · reference · opened; photographs | `grade10-site-vault-case-intake-US-05` |
| Stepper, financed | eight `Step`s Request → Home; the status's stage `progress`, earlier `completed`, later `upcoming` | `grade10-site-vault-case-lifecycle-US-05` |
| Stepper, storage | six `Step`s Request, Valued, Agreed, Signed, Vault, Home | `grade10-site-vault-case-lifecycle-US-05` |
| Stepper, ended | the stage the case ended at stays `progress`; the badge says the ending | `grade10-site-vault-case-lifecycle-US-04` |
| Chip: Waiting on you | a live offer, a missed visit, an ask for the item back | `grade10-site-vault-case-lifecycle-US-05` |
| Chip: With us | submitted, being valued, a lapsed or declined offer, ready to sign, in the vault on the storage lane | `grade10-site-vault-case-lifecycle-US-05` |
| Chip: Visit | terms agreed with a visit ahead: the visit's day | `grade10-site-vault-visit-booking-US-04` |
| Chip: Due | a live loan before the due date: due and the date | `grade10-site-vault-loan-and-settlement-US-02` |
| Chip: Past due | a live loan after it: n days past due | `grade10-site-vault-loan-and-settlement-US-02` |
| Chip: Settled | repaid: settled and the date | `grade10-site-vault-loan-and-settlement-US-02` |
| Chip: Collected | released: collected and the date | `grade10-site-vault-case-lifecycle-US-04` |
| Chip: Closed | declined, cancelled, expired, forfeited: closed and the date | `grade10-site-vault-case-lifecycle-US-04` |
| Request sent (`C10`) | the lead on valuing from photographs; the verify prompt; the visit card; the item block; Cancel this request; history | `grade10-site-vault-case-intake-US-01` |
| Offer waiting (`C11`) | hero amount, term, total, open until; Accept this offer, Decline this offer; the terms table with the valuation; How the loan works; the identity chip; the visit card with the accepting-books-nothing line | `grade10-site-vault-valuation-and-offer-US-02` |
| Accept confirmation (`C12`) | `Dialog`: the total, what a late day costs, what you sign; Yes, accept and Go back | `grade10-site-vault-valuation-and-offer-US-02` |
| Decline confirmation | the confirm's words: the request stays open, the visit stands; Yes, decline and Go back | `grade10-site-vault-valuation-and-offer-US-02` |
| Answer in flight | the confirm's button pending while the effect runs; Accept's mounted dialog holds its own | `grade10-site-vault-valuation-and-offer-US-02` |
| Answer refused | the confirm stays open with the refusal by name — the offer ran out or the case moved; the page reads again | `grade10-site-vault-valuation-and-offer-US-02` |
| Offer replaced (`C22`) | the new offer's hero naming the closed one and its date; Accept and Decline on the new offer only | `grade10-site-vault-valuation-and-offer-US-05` |
| Offer ran out (`C22`) | badge Offer ran out, chip With us; the closed offer's amount and expiry; no Accept or Decline; the visit stands | `grade10-site-vault-case-lifecycle-US-05` |
| You declined (`C22`) | badge Being valued; the declined figure and when; the visit stands; Cancel this request lower on the page | `grade10-site-vault-case-lifecycle-US-05` |
| Visit missed (`C22`) | badge the status word, chip Waiting on you; the missed slot; Book another visit | `grade10-site-vault-case-lifecycle-US-05` |
| Asked for it back (`C22`) | badge In the vault, chip Waiting on you; recorded when; Book a pickup visit; Ask for it back hidden | `grade10-site-vault-case-lifecycle-US-05` |
| Terms agreed, visit ahead (`C13`) | hero see you on the day; Add the visit to your calendar; Before you come — visit, identity, bring, sign, the money follows; the agreed terms table | `grade10-site-vault-visit-booking-US-04` |
| Terms agreed, no visit | the Book a visit prompt and the 30-day line | `grade10-site-vault-case-lifecycle-US-02` |
| Identity not verified | the Before you come item reads Verify now, linking `/vault/verify`, with the in-person line | `grade10-site-vault-visit-booking-US-04` |
| Visit card | slot, shop, address; Add to calendar, Move, Cancel visit; the bring line | `grade10-site-vault-visit-booking-US-04` |
| Cancel visit confirmation | the confirm's words: the visit closes, the case stays; the picker opens after | `grade10-site-vault-visit-booking-US-01` |
| No visit | Book a visit; the picker opens on the page | `grade10-site-vault-visit-booking-US-01` |
| Cancel this request | the button with its consequence line; the confirm names the offer and the visit it closes; Yes, cancel and Go back | `grade10-site-vault-case-lifecycle-US-01` |
| Cancelled | `case.cancelled`; the page reads again as the ending | `grade10-site-vault-case-lifecycle-US-01` |
| In the vault, storage (`C14`) | hero the shop; Book a pickup visit, Ask for it back; the custody card with outstanding Nothing; documents with fingerprints | `grade10-site-vault-case-lifecycle-US-05` |
| Loan running (`C15`) | hero total by the due date with the holds line; Book a visit to collect; What is owed as at: outstanding of total · repaid, the progress line, the breakdown | `grade10-site-vault-loan-and-settlement-US-02` |
| How to pay | the block: FPS id, account under the lender's name, reference = the case reference, the counter line; holds until, grows by after | `grade10-site-vault-loan-and-settlement-US-05` |
| How to pay, values unset | the bracketed placeholder outside production; in production the block is refused — ❓ what stands in its place, flagged below | `grade10-site-vault-loan-and-settlement-US-05` |
| Reminders | the two dates before the due date and the 7-day rung after; a reminder costs nothing | `grade10-site-vault-collector-notifications-US-01` |
| Repayments, none | the empty line: each appears here with its day and the balance after | `grade10-site-vault-loan-and-settlement-US-06` |
| Repayments, one (`C23`) | amount by method · reached us · recorded · balance after; the allocation sentence; the never-restarts line; the receipt line; the hero reads the remainder and the reduced daily figure | `grade10-site-vault-loan-and-settlement-US-06` |
| Repayments, many (`C17`) | the list in value-date order, each with its balance after | `grade10-site-vault-loan-and-settlement-US-06` |
| Past due (`C16`) | hero owed and n days past due with the daily figure; the breakdown adds late interest for n days; Book a visit to repay and collect | `grade10-site-vault-loan-and-settlement-US-02` |
| Past due, no notice | the past-due hero and the reminders card; no notice card | `grade10-site-vault-loan-and-settlement-US-06` |
| Final notice (`C16`) | `Alert` error: pay by the date, wrote to you on, until then nothing can be taken, the reminders sent, no further reminders | `grade10-site-vault-loan-and-settlement-US-06` |
| Repaid (`C17`) | hero repaid in full; Book a pickup visit, Ask for it back; the repayments; the loan settled table; custody outstanding Nothing; the no-clock line | `grade10-site-vault-loan-and-settlement-US-02` |
| Back with you (`C18`) | hero released at the shop on the date; Start another request; documents with the release receipt, fingerprints and the public verify address; the loan settled | `grade10-site-vault-documents-and-signing-US-01` |
| What we keep (`C18`) | the retention table per class with its window; the ask-to-be-forgotten line linking Your data | `grade10-site-vault-retention-and-erasure-US-05` |
| Declined (`C19`) | badge and closed date; the staff reason verbatim; the item stayed, the visit was cancelled; Start another request | `grade10-site-vault-case-lifecycle-US-04` |
| Cancelled (`C19`) | by whom and when; the offer closed and the visit cancelled with it | `grade10-site-vault-case-lifecycle-US-04` |
| Expired (`C19`) | which clock ran out; nothing signed, the item never left | `grade10-site-vault-case-lifecycle-US-04` |
| Forfeited (`C19`) | the figure the item settled, the notice date, the date to pay by; the agreements stay | `grade10-site-vault-case-lifecycle-US-04` |
| Release refused | the ask's confirm stays open with the refusal by name | `grade10-site-vault-case-lifecycle-US-05` |

### Book a visit

| State | Shows | Anchor |
| --- | --- | --- |
| Shop | the location picker: one card per shop with its address, and the 30-minute line; the more-shops line while there is one | `grade10-site-vault-visit-booking-US-01` |
| Days | the slot picker's month grid from today, a day with nothing free unpickable; the month steps inside the booking window | `grade10-site-vault-visit-booking-US-01` |
| Times | the picked day's slots on the shop's clock; the move, cancel and missed-visit line; Book the slot | `grade10-site-vault-visit-booking-US-01` |
| Nothing free | `visit.nothingFree` where the times sit; no times | `grade10-site-vault-visit-booking-US-01` |
| Time taken | `visit.unavailable`; the times read again | `grade10-site-vault-visit-booking-US-01` |
| Loading | the pickers' own loading lines, shops then times | `grade10-site-vault-visit-booking-US-01` |
| Booked | the Visit booked screen replaces the picker | `grade10-site-vault-visit-booking-US-04` |

### Visit booked

| State | Shows | Anchor |
| --- | --- | --- |
| Booked (`C07`) | `BookingConfirmation` with the slot, shop and address; Add to calendar, Move, Cancel; the email line; Before you come | `grade10-site-vault-visit-booking-US-04` |
| Calendar file | Add to calendar serves the file naming this visit; the phone's calendar opens it | `grade10-site-vault-visit-booking-US-04` |
| Moved | the new slot; Add to calendar serves a file that replaces the first on the phone | `grade10-site-vault-visit-booking-US-04` |
| Cancelled | the `BookingManageCard` confirmation, then the case page; no calendar link stands, and the file is withdrawn | `grade10-site-vault-visit-booking-US-04` |
| Before you come, verified | the identity item reads verified, nothing to bring but the item | `grade10-site-vault-visit-booking-US-04` |
| Before you come, not verified | Verify now linking `/vault/verify`; the in-person line | `grade10-site-vault-visit-booking-US-04` |
| Storage lane | the sign item names the custody agreement only; no money-follows item | `grade10-site-vault-visit-booking-US-04` |

### Your data

| State | Shows | Anchor |
| --- | --- | --- |
| Signed out | the site's sign-in dialog | `grade10-site-vault-retention-and-erasure-US-05` |
| Loading | `Skeleton` cards | `grade10-site-vault-retention-and-erasure-US-05` |
| Standing: verified | verified until the date · checked how, on which day; never the name or the document | `grade10-site-vault-retention-and-erasure-US-05` |
| Standing: none | no identity on file; verified at the next visit | `grade10-site-vault-retention-and-erasure-US-05` |
| Standing: check out | a check is out since the date | `grade10-site-vault-retention-and-erasure-US-05` |
| Standing: lapsed | the last check expired on the date | `grade10-site-vault-retention-and-erasure-US-05` |
| What the vault keeps | the table per class with its window after a case ends; the reviewed-not-deleted line | `grade10-site-vault-retention-and-erasure-US-05` |
| Download, n documents | Download all with the count; one file, bounded to the cases the page lists | `grade10-site-vault-documents-and-signing-US-05` |
| Download, none | the button absent; nothing signed yet | `grade10-site-vault-documents-and-signing-US-05` |
| Download in flight | the button pending | `grade10-site-vault-documents-and-signing-US-05` |
| Download failed | the error line under the button | `grade10-site-vault-documents-and-signing-US-05` |
| Ask available | the window, what goes and what stays; Ask to be forgotten | `shared-auth-users-US-05` |
| Ask refused | the button withheld with the reason in words: an item in the vault or a loan running | `grade10-site-vault-retention-and-erasure-US-01` |
| Ask confirmation | the confirm names the 7-day window and that it can be cancelled inside it | `shared-auth-users-US-05` |
| Ask filed | filed on the date, erased from the date; Cancel the request; the still-signed-in line | `shared-auth-users-US-05` |
| Ask filed, held | filed on the date; the hold in words beside it — an item in the vault or a loan running — and that erasure waits until it lifts; Cancel the request | `grade10-site-vault-retention-and-erasure-US-01` |
| Ask cancelled | back to Ask available | `shared-auth-users-US-05` |
| Window passed | filed on the date, the window passed; no cancel; each product erases | `shared-auth-users-US-05` |
| Error | the message; the cards stay | `grade10-site-vault-retention-and-erasure-US-05` |

### Queue

| State | Shows | Anchor |
| --- | --- | --- |
| Counts | every cut's `Choice` carries its count | `grade10-admin-vault-operator-queue-US-06` |
| Today block | the Today cut's rows in slot order with its count on the landing view: time, name · reference, lane · the status word | `grade10-admin-vault-operator-queue-US-06` |
| Today, none | the block reads no visits today | `grade10-admin-vault-operator-queue-US-06` |
| Rows | reference, item, the collector's status word, lane, asked for, visit, last touched, waiting on | `grade10-admin-vault-operator-queue-US-01` |
| Badges | Release requested, Awaiting valuation, Valuation stalled, Offer lapsed, Message parked, Document seen before, Visit today; Collector where the collector is waited on | `grade10-admin-vault-operator-queue-US-01` |
| Search by reference | prefix on the reference; the matches; the recorded-search line | `grade10-admin-vault-operator-queue-US-05` |
| Search, none | No case answers to that | `grade10-admin-vault-operator-queue-US-05` |
| Loading | `Status` pending | `grade10-admin-vault-operator-queue-US-01` |
| Error | `Status` with the message | `grade10-admin-vault-operator-queue-US-01` |
| More | Load more on the cursor; n in this view · showing m | `grade10-admin-vault-operator-queue-US-06` |

### Overdue

| State | Shows | Anchor |
| --- | --- | --- |
| Tiles | three `Figure`s: loans in arrears, outstanding in arrears, without a notice | `grade10-admin-vault-money-book-US-05` |
| Second currency | outstanding per currency, never summed | `grade10-admin-vault-money-book-US-05` |
| Rows | reference, item, borrower and contact, due date, days overdue, outstanding, notice (sent · pay by, or none yet), last reminder (date · stopped by the notice) | `grade10-admin-vault-money-book-US-05` |
| Empty | the tiles at zero; no loan is late | `grade10-admin-vault-money-book-US-03` |
| Ladder | the reminder ladder in words under the list | `grade10-site-vault-collector-notifications-US-01` |
| Loading | `Status` pending | `grade10-admin-vault-money-book-US-03` |
| Error | `Status` with the message | `grade10-admin-vault-money-book-US-03` |

### Money

| State | Shows | Anchor |
| --- | --- | --- |
| Kind filter | `ChoiceList` All, Payouts, Repayments, Corrections beside the method `Select`; the range narrows to both | `grade10-admin-vault-money-book-US-04` |
| Range totals | payouts, repayments per method, corrections, net out of the business, over the range | `grade10-admin-vault-money-book-US-04` |
| Second currency | net out per currency; no sum | `grade10-admin-vault-money-book-US-04` |
| Takes back | a correction row names the row it took back | `grade10-admin-vault-money-book-US-04` |
| Export CSV | the button; the range as filtered, bounded to what the ledger pages; the export recorded | `grade10-admin-vault-money-book-US-04` |
| Export, empty | the button disabled while the range holds no row | `grade10-admin-vault-money-book-US-04` |
| Export in flight | the button pending | `grade10-admin-vault-money-book-US-04` |
| Export failed | the error line by the button | `grade10-admin-vault-money-book-US-04` |
| Register empty | no record in the range | `grade10-admin-vault-money-book-US-01` |
| Loading | `Status` pending | `grade10-admin-vault-money-book-US-01` |
| Error | `Status` with the message | `grade10-admin-vault-money-book-US-01` |

### Held items

| State | Shows | Anchor |
| --- | --- | --- |
| Tiles | in the vault, per shop, with a loan running, waiting for a pickup | `grade10-admin-vault-operator-queue-US-04` |
| Rows | reference, item, shop, locker, held since, days, the status word, outstanding, pickup | `grade10-admin-vault-operator-queue-US-04` |
| Shop filter | `Select` all shops or one | `grade10-admin-vault-operator-queue-US-04` |
| Empty | nothing in a locker | `grade10-admin-vault-operator-queue-US-04` |
| Loading | `Status` pending | `grade10-admin-vault-operator-queue-US-04` |
| Error | `Status` with the message | `grade10-admin-vault-operator-queue-US-04` |

### Case — header and Case tab

| State | Shows | Anchor |
| --- | --- | --- |
| Header | item, reference, the status word, lane · asked for, the identity chip, the visit chip | `grade10-admin-vault-operator-queue-US-05` |
| Visit checklist | Today's visit, in order: seven `Check`s, ticked as each lands; the current step's button; a step not offered says why | `grade10-admin-vault-operator-queue-US-07` |
| Checklist, no visit today | the panel absent | `grade10-admin-vault-operator-queue-US-07` |
| Checklist, storage lane | the terms step reads custody terms; no key-terms or loan agreement step | `grade10-admin-vault-operator-queue-US-07` |
| Policy gates | the five ticks beside the offer | `grade10-site-vault-valuation-and-offer-US-01` |
| Actions not offered | the line naming the acts this status withholds | `grade10-admin-vault-operator-queue-US-03` |
| Status word | the collector's word, never the raw id | `grade10-admin-vault-operator-queue-US-01` |

### Case — Documents tab

| State | Shows | Anchor |
| --- | --- | --- |
| Identity: None | nothing asked for; Send hosted check, Record at the counter | `grade10-admin-vault-operator-queue-US-09` |
| Identity: Out | invited on the date; Send again, Record at the counter | `grade10-admin-vault-operator-queue-US-09` |
| Identity: Stalled | submitted on the date, undecided; Record at the counter, Send again | `grade10-admin-vault-operator-queue-US-09` |
| Identity: Verified | who performed it and when; the details under the identity read grant; View photograph, Record at the counter instead | `grade10-admin-vault-operator-queue-US-09` |
| Identity: Refused | declined on the date; Record at the counter with the reason field naming who records over it | `grade10-admin-vault-operator-queue-US-09` |
| Identity: Lapsed | expired or withdrawn on the date; Send hosted check, Record at the counter | `grade10-admin-vault-operator-queue-US-09` |
| Key terms dialog | the loan agreement's own terms as `Check`s; the reference field optional; Record | `grade10-site-vault-documents-and-signing-US-03` |
| Key terms, unticked | Record refused until every term is ticked | `grade10-site-vault-documents-and-signing-US-03` |
| Key terms recorded | recorded when · by; Prepare documents offered | `grade10-site-vault-documents-and-signing-US-03` |
| Key terms, storage lane | no dialog; the custody packet prepares without it | `grade10-site-vault-documents-and-signing-US-03` |

### Case — Custody tab

| State | Shows | Anchor |
| --- | --- | --- |
| Forfeit withheld: not past due | Forfeit absent; the reason: not past the due date | `grade10-admin-vault-operator-queue-US-08` |
| Forfeit withheld: no notice | the reason: no written notice sent; Send notice offered | `grade10-admin-vault-operator-queue-US-08` |
| Forfeit withheld: cure running | the reason: refused until the date the borrower was given; the notice sent on which day | `grade10-admin-vault-operator-queue-US-08` |
| Forfeit available | the earliest date passed; the reason field; Forfeit the item | `grade10-site-vault-loan-and-settlement-US-04` |
| What the collector was told | the messages sent, each with its date and channel | `grade10-admin-vault-operator-queue-US-08` |
| Movement log | the table: movement, locker, when, by | `grade10-admin-vault-operator-queue-US-04` |

### Make an offer

| State | Shows | Anchor |
| --- | --- | --- |
| Before the act | the latest valuation, the cap, asked for; principal, rate, the term presets; interest, total, a late day, per annum derived live; open until; the five gates as `Check`s | `grade10-site-vault-loan-and-settlement-US-07` |
| A gate fails | the failing gate unticked with its bound; Make the offer stays, the worker refuses | `grade10-site-vault-loan-and-settlement-US-07` |
| Bounds unset | the gates read not set and the offer goes through outside production; in production the dialog names the refusal before the act | `grade10-site-vault-loan-and-settlement-US-07` |
| Refused | the worker's refusal by name under the form | `grade10-site-vault-valuation-and-offer-US-01` |

### Put the item in the vault

| State | Shows | Anchor |
| --- | --- | --- |
| Before the act | the three preconditions as `Check`s: packet executed, identity bound, visit slot started; shop `Select` required; locker optional; the consequence line | `grade10-site-vault-loan-and-settlement-US-07` |
| A precondition unmet | the `Check` unmet with its reason; Confirm vaulted stays, the worker refuses | `grade10-site-vault-loan-and-settlement-US-07` |

### Record the payout

| State | Shows | Anchor |
| --- | --- | --- |
| Before the act | the four preconditions as `Check`s, the two people named; amount equal to the principal; bank reference; value date bounds; the due date and reminder dates the row fixes; the consequence line | `grade10-site-vault-loan-and-settlement-US-07` |
| Same person | the two-people `Check` unmet, naming the refusal | `grade10-site-vault-loan-and-settlement-US-01` |
| Value date moves | the due date and the reminder dates re-derive as the date changes | `grade10-site-vault-loan-and-settlement-US-07` |

### Letters

One row per kind, and the blocks each carries after the lead.

| State | Blocks | Anchor |
| --- | --- | --- |
| The offer (`M01`), `offer_made` | facts: loan · term · interest for the term · total to repay · if you are late · open until; the accepting-starts-nothing paragraph; `PrimaryCta` to the case; the runs-out line; the case line; `EmailFooter` naming the lender | `grade10-site-vault-collector-notifications-US-05` |
| The advance (`M02`), `payout_recorded` | facts: sent · due · total to repay · after the due date; the repay-early line; how to pay; `PrimaryCta`; the reminder schedule's two dates and the 7-day rung; the case line; `EmailFooter` naming the lender | `grade10-site-vault-collector-notifications-US-05` |
| Due soon (`M03`), `repayment_due_soon` | facts: owed today · due · from the day after; how to pay; `PrimaryCta`; the next-reminder line; the case line; `EmailFooter` naming the lender | `grade10-site-vault-collector-notifications-US-01` |
| Overdue (`M04`), `repayment_overdue` | facts: owed today · was due · of which late interest · each further day; the part-payment and notice-ahead paragraph; how to pay; `PrimaryCta`; the case line; `EmailFooter` naming the lender | `grade10-site-vault-collector-notifications-US-01` |
| Final notice (`M05`), `forfeiture_notice` | the clause lead; facts: pay in full by · owed as at today · each further day · the lapse condition · what follows a balance; the a-person-decides paragraph; the no-further-reminders line; how to pay; `PrimaryCta`; the case line; `EmailFooter` naming the lender | `grade10-site-vault-collector-notifications-US-05` |
| Verify before the visit (`M06`), `identity_check_invited` | facts: your visit · where · bring; the link-rules paragraph; `PrimaryCta` to the check; the in-person and already-verified lines; the case line; `EmailFooter` naming the custodian | `grade10-site-vault-collector-notifications-US-06` |
| The other eighteen, no board | `PrimaryCta` to the case; the case line; `EmailFooter` naming the custodian; every other kind in `notify/vocabulary.ts` | `grade10-site-vault-collector-notifications-US-02` |
| A money kind among them | `repayment_recorded`, `payout_reversed`, `repayment_reversed`, `loan_repaid` and `forfeited` add the facts their event names, how to pay under them, and name the lender | `grade10-site-vault-loan-and-settlement-US-05` |
| Reference on every letter | the case line above the footer | `grade10-site-vault-case-intake-US-05` |
| Custodian footer | a letter with no money names the custodian, not the lender | `grade10-site-vault-collector-notifications-US-02` |
| Values unset | the bracketed placeholder outside production, marked; in production a money letter's send and the notice's send are refused | `grade10-site-vault-collector-notifications-US-05` |

## Flags

- **Frames nobody drew** — terms agreed with no visit, the case with a
  lapsed offer on the list, the stepper on an ended case, the chip beyond
  the five on `Statuses` (visit, collected, closed), Your data's standing
  card in its none, out and lapsed forms and the ask filed, cancelled and
  past-window forms, the download states, the queue's search results, the
  export states, the vault dialog with a precondition unmet, the key-terms
  dialog unticked, Forfeit withheld before the due date and with no notice,
  and the eighteen letters with no board. Each is a row above, drawn from
  its drawn sibling; the stories are their frame. The five confirmations
  need none: they wear `ConfirmDialog`'s own frame
- **Boards a row supersedes** — `C01`, which draws no reference on a list
  card: the reference is on every card, spoken and typed. `A02`'s fourth
  tile, the oldest arrears: the tiles are three. `C20`, which draws the ask
  available and the ask refused as one row with an active button under a
  refusal reason: they are two states, and the refused one withholds the
  button. `C06`'s 14-day chip strip: the slot picker draws a month grid
- **No missing primitive, block or token** — every screen composes what
  `packages/design-system`, `@grade10/ui` and `@grade10/frontend-console`
  publish; the progress line is a local composition, the chip a `Badge`,
  the reference a `Text` in the mono face. The one component change this
  store carries is `EmailFooter`'s optional `lines` prop
- **Journeys the states reach past** — the stepper and the chip, the
  list card's held-since line and the storage-lane custody card (`C14`)
  hang off `grade10-site-vault-case-lifecycle-US-05`, which walks the
  facts between and not where a case stands; the PM may issue a journey
  for reading where the case stands, or the requirements pass states them
  out of suite
- **❓ Product** — what a production borrower reads in place of the
  how-to-pay block while Finance's values are unset; the PRD says refused,
  not what stands there
- **❓ Tech design** — how the withdrawal of a cancelled visit's calendar
  file reaches the phone, and the address of Your data under `/profile`
- **Drawn, not carried** — `A06`'s quote widget and recorder's key,
  `A02`'s Send notice and `A08`'s stock-take sheet (Q12), `A09`'s
  signing-room lane (Q20), `C08` and `C09`'s verify copy
  (`add-hosted-identity-verification`), `S01`–`S07`'s ceremony trimmings,
  and the timeline detail lines on every case board; none has a journey in
  this change
- **Copy that rides along** — the wizard's step hints and photo tips
  (`C02`, `C03`) and the empty home's How it works (`C21`) are keys above
  with no delta of their own; their rows anchor on the intake journey
- **Console words** — the console's badges already read the canvas's
  words in `operator-queue`'s spec; `needsStaff.ts` is brought to them
