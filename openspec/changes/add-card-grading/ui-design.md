# UI: Card grading

No Figma frame exists. The design canvas is the frame:
[Grading canvas](https://claude.ai/artifact/GtDo31jHhqGuhirojtEeJZ), one
board per screen, named below by its id (`G05`, `GA5`, `M10`). A board is the
layout's source of truth; [decisions.md](decisions.md) owns the scope, the
journeys beside each delta own the behaviour, and `tech-design.md` owns the
data and the mechanism. The [inventory](../../../docs/prds/products/grade10-site/grading/index.md)
the pages carry is the product; this file carries the surface.

- **The collector's site screens** — the home (`G16`, `G01`), the wizard
  with its paste sheet (`G02`–`G04`, `G17`) and the submission page
  (`G07`–`G13`) are @tangconst's to draw again from the backend, and their
  boards are not carried here; the drop-off booking (`G05`, `G06`) and the
  signing (`G14`, `G15`, `G18`) boards stay, drawn as grading's own views
  (`decisions.md` Q147, Q151)
- **Where the views live** — the drop-off booking and signing views in
  `packages/grading/frontend`, the console's views in
  `packages/grading/admin-frontend` composing `@grade10/frontend-console`;
  the store carries no grading block
- **Stories** — every view gets a `<View>.stories.tsx` beside it in
  `packages/grading/frontend/src/**` or `packages/grading/admin-frontend/src/**`,
  which `packages/storybook`, the one monorepo Storybook, reads, titled
  `Grading/<Feature>/<View>` and `Grading Admin/<Feature>/<View>`, so an id
  reads `grading-<feature>-<view>--<state>` for the collector's views and
  `grading-admin-<feature>-<view>--<state>` for the console's
- **An id is composed, never listed** — each `### ` under `## States` opens
  with its story prefix, and `<state>` is that row's name in kebab-case:
  lowercased, an apostrophe dropped, every other run of other characters a
  hyphen, and a board id in brackets left out. `Bulk lead` is
  `grading-dropoff-dropoff-booking--bulk-lead`. A row names an id only where
  it departs — a range, or a story it shares — and a row whose Shows opens
  **No story** has none
- **The iPad** — the two documents ride `packages/doc-sign`'s `CeremonyFlow`
  unchanged, with grading's `RefusalWords` and templates; the board is the
  document, the ceremony's chrome is the vault's
- **Copy** — the collector's words are keys in
  `packages/i18n/messages/shared/<locale>/grading.json`, a new namespace, in
  the families named under Components and never their words; the console's
  words are the console's own English, as its panels already carry them; a
  letter's words live in the letter

## Screens

| Screen | Board | Route | Composes |
| --- | --- | --- | --- |
| Book the drop-off | `G05` | a view the collector's page opens wherever the submission holds no visit and Book is offered | `DropoffBooking` → `BookingLocationPicker`, `BookingSlotPicker`, `BatchLine`, `CheckboxListInput` for the statement tick, `Skeleton`, `Text`, `Button` |
| Drop-off booked | `G06` | a view the collector's page shows after a booking | `DropoffBooked` → `BookingConfirmation`, `BookingManageCard`, `NoteList`, `Alert` for the vault line and the detached notice, `Skeleton`, `Link`, `Button`, `Text` |
| Walk-in booking | none; `G00-Main` names it | `grade10.com/book` | the site's own booking flow, unchanged: the Grading visit is a listed service, and the visit it books is the diary's own, which grading never reads |
| Submission agreement | `G14` | `/grading/sign#<token>` | `CeremonyFlow` → `PdfPageCanvas`, `SignatureField`, `RefusalNotice`; the template in `packages/grading/backend` |
| Hand-back receipt | `G15`, `G18` | `/grading/sign#<token>` | the same ceremony with the receipt template |
| Queue | `GA1` | `admin.grade10.com/grading` | `QueuePanel` → `SectionHeader`, `ChoiceList`, `Choice`, `Figure`, `Table`, `Row`, `Cell`, `At`, `Money`, `Status`, `StatusBadge`, `Badge`, `CursorPager`, `Button` |
| Walk-in desk | `GA2` | `/grading/walk-in`; once the submission is open, its own address | `WalkInForm` → `Panel`, `TextField`, `ChoiceList`, `Choice`, `MoneyField`, `Notice`, `Button` |
| Hand-in runbook | `GA2` | `/grading/submissions/:submissionId` while the hand-in is offered, a walk-in's included | `IntakeRunbook` → `CheckList`, `Check`, `Panel`, `Table`, `Row`, `Cell`, `Money`, `MediaFrame`, `TextField`, `Notice`, `Button`, `Link`, `Code` |
| Refuse a card | `GA7` | dialog from the hand-in runbook | `RefuseCardDialog` → `FormDialog`, `ChoiceList`, `Choice`, `NotesField`, `Notice` |
| Batches | `GA4` | `/grading/batches` | `BatchesPanel`, `ShipBatchForm`, `ReestimateDialog` → `Figure`, `Table`, `Row`, `Cell`, `At`, `Money`, `Status`, `CursorPager`, `CheckList`, `Check`, `ChoiceList`, `Choice`, `NotesField`, `TextField`, `DateField`, `MoneyField`, `FormDialog`, `Notice`, `Button` |
| Receive a batch | `GA5` | `/grading/batches/:batchId/receive` | `ReceivePanel` → `SectionHeader`, `Figure`, `Search`, `Table`, `Row`, `Cell`, `Status`, `Notice`, `EntryList`, `Entry`, `FormDialog`, `Button` |
| Hand-back runbook | `GA6`, `G18` | `/grading/submissions/:submissionId` while the hand-back is offered | `HandbackRunbook` → `CheckList`, `Check`, `Panel`, `TextField`, `Table`, `Row`, `Cell`, `Money`, `MediaFrame`, `Notice`, `Button`, `Link`, `Code` |
| One submission | `GA3` | `/grading/submissions/:submissionId` while no runbook is offered, or with `?view=record`; one press from the runbook, and the runbook one press from it | `SubmissionPanel` → `Tabs`, `Tab`, `TabPanel`, `StatusBadge`, `Badge`, `Panel`, `EntryList`, `Entry`, `Table`, `Row`, `Cell`, `Money`, `At`, `FormDialog`, `MoneyField`, `DateField`, `NotesField`, `Notice`, `Button`, `Link` |
| Written notice | none drawn; `GA1`'s Notice due badge and `M18` | dialog from the Ready view or the submission | `PostNoticeDialog` → `FormDialog`, `Text`, `DateField`, `TextField`, `Notice` |
| Settings | none drawn; the console page's table | `/grading/settings` | `SettingsPanel` → `SectionHeader`, `Table`, `Row`, `Cell`, `SaveableField`, `MoneyField`, `PercentField`, `NumberField`, `FormDialog`, `Notice` |

## Components

### `@grade10/design-system` — existing, and three rungs this change asks for

`Alert` for the booked view's vault line and detached notice, `Button`,
`CheckboxListInput` for the statement tick, `Link`, `Skeleton`, `Text` and
`VStack`; the rest of a collector's view is the booking blocks'.

- **Three rungs on `Text`, work in `packages/design-system`** — a `display`
  size above `xl`, a `mono` face axis on the existing `--font-mono` token,
  and a `warning` tone on the existing `--warning-foreground` token. `Text`
  has no `text.figma.ts`, so the rungs are code ahead of design, recorded
  here as [`design-code-sync.md`](../../../docs/governance/design-code-sync.md)
  asks

### `@grade10/ui` — existing, reused unchanged

`BookingLocationPicker`, `BookingSlotPicker`, `BookingDetailsForm`,
`BookingConfirmation` (`calendarHref` serves the calendar file, `manageHref`
is the submission address) and `BookingManageCard` from
`shared/ui/appointment-booking`, and `NoteList` from `shared/ui/page-blocks`.

### Composed in `packages/grading/frontend` — work in grade10

- **`DropoffBooking`**, **`DropoffBooked`** — the drop-off views a
  collector's page composes; the cancel-visit confirm is
  `BookingManageCard`'s own
- **`BatchLine`** — `Text` in a `VStack` beside the picked day: the cut-off,
  the ship day, the next batch's dates, the estimate-runs-from line

### Console blocks — existing, `@grade10/frontend-console`

`SectionHeader`, `Search`, `ChoiceList`, `Choice`, `Select`, `Figure`,
`Status`, `StatusBadge`, `Table`, `Row`, `Cell`, `At`, `Money`, `CursorPager`,
`Badge`, `Tabs`, `Tab`, `TabPanel`, `Panel`, `Notice`, `CheckList`, `Check`,
`EntryList`, `Entry`, `FormDialog`, `InfoDialog`, `MoneyField`, `PercentField`,
`NumberField`, `DateField`, `DateTimeField`, `TextField`, `NotesField`,
`SaveableField`, `FilePicker`, `MediaFrame`, `Thumbnail`, `Code`, `Button`,
`Link`, `Text`, `OperatorIdentity`, `keepRefusal`, and `useConfirm` from
`@grade10/frontend-dialog` for an act that cannot be taken back. A tile is a `Figure`; a
runbook is a `CheckList` of `Check`s, each with its button or its reason; a
photograph pair is two `MediaFrame`s. Nothing the console package lacks.

### New in `packages/grading/admin-frontend` — work in grade10

- **`QueuePanel`** — the seven `Choice`s with counts, the Today strip, the
  four tiles, the table with the badge column
- **`IntakeRunbook`** — the six `Check`s, the cards table with Present,
  Condition, the photograph pair, the level check and Refuse per row, Add a
  card, the fee `Panel`, the sign `Panel`, the check-in `Panel`. The
  console has no paste: a walk-in's list is written card by card with the
  collector at the desk, and the paste stays the collector's alone; the runbook always takes a `submissionId`, and `recordHref` is the
  one press to the record
- **`WalkInForm`** — the Walk-in desk's own form: the collector's email,
  name and phone, the grader, the level, the shop and the first card with
  its declared value, then Open the submission; `onStarted(id)` reports the
  submission it mints, and the runbook takes the cards from there
- **`RefuseCardDialog`** — the three reasons, the collector's-words field,
  the consequence `Notice`
- **`BatchesPanel`**, **`ShipBatchForm`**, **`ReestimateDialog`**,
  **`NewBatchDialog`** — a stage is recorded from the grader's own stages
  as a `ChoiceList`, one of them the move to graded, with the grader's
  words in a `NotesField` beside it; never free text
- **`ReceivePanel`** — the manifest and invoice entry, the counters, the scan
  table, the cards no line names under it with Add to the manifest, the
  exceptions `EntryList`, Save and Finish
- **`HandbackRunbook`** — the six `Check`s, the items table with Handed over
  and Vault instead per row, the sign `Panel`, the money `Panel`, the vault
  `Panel`, the photographs; `recordHref` is the one press to the record
- **`SignStep`**, **`CardPhotoSlot`** — one sign step and one photograph
  frame, which both runbooks compose: the step reads the paper for the
  agreement or the receipt in that document's words, and the frame holds its
  shape while a photograph loads
- **`SubmissionPanel`** — the header chips, the pickup or drop-off block,
  the collector block with the WhatsApp templates, the four tabs,
  `runbookHref` where a runbook is offered, Cancel behind `useConfirm`;
  **`WaiveUpchargeDialog`**, **`PayoutDialog`**, **`WithdrawCardDialog`**,
  **`SettlementDialog`**, **`MintDialog`** on its tabs
- **`PostNoticeDialog`** — the address from the agreement as `Text`, the
  posting date and the tracking
- **`SettingsPanel`** — one `SaveableField` per row, the fee sheet and the
  diary services as their own tables, the second-person dialog on a money row
- **The status word** — every panel prints the collector's word for a
  status, never the raw id, and the badge column the queue's ten words

### Letters — work in grade10 and in this store

Every collector email is a React Email letter the worker renders from
`packages/grading/backend/src/email`, one kind per letter in
`notify/vocabulary.ts`. One shell, `GradingLetter`, on `Grade10EmailShell`:
the heading, the greeting, the lead paragraph, then the blocks the table
under States gives that letter, then `SubmissionLine` and `GradingFooter`.
The same five components and twenty-five preview letters land under
`apps/emails/emails/grading/`, over a fixture submission (`5TW8HN`).

- **The facts** — the label · value rows are `ProductEmail`'s facts group,
  as the vault's letters use it; no table component of its own
- **`CardLines`** — grade, name, cert or the ungraded code, one line a card;
  **`PickupBlock`** — code · where · open · to settle · bring;
  **`SubmissionLine`** — id · n cards to grader level, above the footer
- **`PrimaryCta`** — existing, `apps/emails/emails/_components`
- **`GradingFooter`** — the custodian's registered name trading as Grade10,
  the shop and its address, the complaints contact, the Hong Kong time line

### Words — work in `packages/i18n`

Every key below is answered in `shared/` for every language it speaks, in
the new `grading` namespace; the words are not written here. The `home`,
`plan` and `submission` families stay for @tangconst's screens
(`decisions.md` Q152), and `DropoffBooked` reads `grading.submission.visit.*`.

- **`grading.home.*`** — the lead, howItWorks (four), priceSheet (lead,
  aboveTop, bulkLine, table), start, bookWithoutList, signIn,
  submissions (title, empty), lostLink
- **`grading.plan.*`** — step (four), aboutYou (fields, signedInLine,
  emailLine), card (matched, keptAsTyped, edit, remove, declaredValue,
  referenceSales, referenceNote, minimumGrade, noValue, aboveCeiling,
  referenceUnavailable), paste, capNotice, overTwenty, overCap,
  continueWithCount, finishLater, finishLaterEmail; pasteSheet (lead,
  yourList, labels, matching, matched, keptAsTyped, withoutValue,
  aboveCeiling, skipped, bulkNotice, add, goBack); service (highestDeclaredLabel,
  grader, level (open, closedByValue, closedByCount, bulkOnly, allClosed,
  coverLine, backIn), estimate (title, perCard, coverPerCard, paidAtCounter,
  includes), upchargeNotice); review (title, header, backIn, summary, edit,
  schedule, totals (declared, fee, cover), warning (line, nowLine),
  goodToKnow (five), consent, book, saveForLater, saveChanges, expired,
  noEmail, noCards, withoutValue)
- **`grading.dropoff.*`** — lead, bulkLead, shop (durations, moreShops,
  joinsExisting), batchLine (before, after, estimateFrom), moveOrCancel,
  book, joined, resized, levelRequired; booked (title, emailLine, calendar, move, cancel,
  beforeYouCome (four), openTheList, vaultLine, bulkDuration)
- **`grading.submission.*`** — status (ten words), chip (waitingOnYou,
  withUs, withGrader, runningLate, dropoff, collected, onTheirWayBack),
  stage (seven), lead per status, outcome (fourteen badges), visit (missed,
  bookAgain), edit, levelNeeded, cancel (line, dialogTitle, dialogBody,
  confirm, back), actRefused (a line per refusal a collector can meet),
  withdraw (title, body, whatsapp), grader (order, readMostDays, stages,
  nextStage, runningLate), grades (headline, settle (title), ungraded (body),
  aboutGrades, cards (the labels, noReason)), pickup (title, items, where,
  open, toSettle, bring (aboveThreshold, named, none)), named (lead, field,
  placeholder, save, badge, line, change, remove), vaultIt (title,
  body, howItWorks), money (every line label, footnote), ladder (readyLabel,
  cardsHeldLabel, passedLabel, postedLabel, reminders, storage, notice,
  noticeLine, afterNotice, closing), collected (lead, record, lookUp,
  whatNext (vault, auction, yourData)), history (title, events), notFound,
  loading, error
- **`grading.ceremony.*`** — the `RefusalWords` entry per
  `DocSignFailureCode`, yourName (label, hint, hintNamed), postalAddress
  (label, hint), agreeLabel on the e-sign disclosure, decline,
  declined
- **`grading.console.*`** — the WhatsApp templates (seven), and nothing
  else: the console's own words stay the console's English

## States

### Book the drop-off

Stories `grading-dropoff-dropoff-booking--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Statement unticked | a plan kept unticked: the collection statement in the review's words and its tick before the shop and the days; a join waits on the same tick | `grade10-site-grading-submission-plan-SC-61` |
| Lead (`G05`) | bring the n cards; about 20 minutes; nothing paid until each card is checked and signed | `grade10-site-grading-dropoff-booking-SC-04` |
| Bulk lead | 20 or more: the longer visit, about 45 minutes | `grade10-site-grading-dropoff-booking-SC-05` |
| Shop | `BookingLocationPicker`: one shop with the address and the two durations; the more-shops line; the already-booked line | `grade10-site-grading-dropoff-booking-SC-04` |
| Days | `BookingSlotPicker` within the service's horizon; a day with nothing free disabled; a day past the horizon disabled | `grade10-site-grading-dropoff-booking-SC-03` |
| Batch line | `BatchLine` beside the picked day: hand in by the cut-off and the cards leave the next day; the estimate runs from the ship day | `grade10-site-grading-dropoff-booking-SC-09` |
| Batch line, past the cut-off | a day after the week's cut-off: the next batch's close and ship days | `grade10-site-grading-dropoff-booking-SC-10` |
| Times | the day's times in the shop's zone; Book <day, time> | `grade10-site-grading-dropoff-booking-SC-04` |
| Nothing free | `dropoff.nothingFree`; no times | `grade10-site-grading-dropoff-booking-SC-07` |
| The diary refuses | the refusal in the diary's words — the slot is not offered, the slot is full, the resource is not available, the day is already booked — and a move offered; the times read again | `grade10-site-grading-dropoff-booking-SC-06` |
| Loading | **No story** — the shop and the days as `Skeleton` | **Out of suite:** the view's colocated test |
| Error | **No story** — the diary's failure in the error tone; no day reads as free | `grade10-site-grading-dropoff-booking-SC-08` |
| Move or cancel line (`G05`) | **No story** — the notice: any time before it starts; a missed visit closes the visit, not the list | `grade10-site-grading-dropoff-booking-SC-15`, `grade10-site-grading-dropoff-booking-SC-17` |
| Joins a visit | a drop-off already booked under the email: the second submission listed under its day and time; no picker | `grade10-site-grading-dropoff-booking-SC-20` |
| Slot resized | two lists passing 20 together: the longer service named, and the visit moved once in the diary | `grade10-site-grading-dropoff-booking-SC-21` |

The walk-in booking at `/book` is the site's own flow, unchanged: the Grading
visit listed, `BookingDetailsForm` with name and email, no list, and the
diary's own visit, which the submission never reads
(`grade10-site-grading-dropoff-booking-SC-23`). Grading draws nothing for it.

### Drop-off booked

Stories `grading-dropoff-dropoff-booked--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Booked (`G06`) | `BookingConfirmation` day, time, shop, address, Add to calendar; Move, Cancel; the email line; Before you come, four items; Open the list | `grade10-site-grading-dropoff-booking-SC-12` |
| Bulk | the visit takes about 45 minutes | `grade10-site-grading-dropoff-booking-SC-13` |
| Fee with cover | item 3 names the fee and the cover line | `grade10-site-grading-dropoff-booking-SC-12` |
| The day the cards leave | item 4: the ship day when handed in by the cut-off, the estimated day back | `grade10-site-grading-dropoff-booking-SC-12` |
| Vault line | the vault-on-the-same-visit `Alert` | `grade10-site-grading-dropoff-booking-SC-14` |
| Joined | the second submission: the visit the first one owns, named, and read through it | `grade10-site-grading-dropoff-booking-SC-20` |
| Visit detached | the owner cancelled or missed the visit: every joiner loses it, is told by letter, and is asked to book again | `grade10-site-grading-dropoff-booking-SC-22`, `grade10-site-grading-dropoff-booking-SC-27` |
| Moved | the new day and time; the moved email line | `grade10-site-grading-dropoff-booking-SC-15` |

### The documents on the iPad

Stories `grading-documents-sign-page--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Agreement, signable (`G14`) | the ceremony chrome: the shop, the link timer, one document · the submission; the document: the parties, the schedule, seven clauses; Your name as on the booking; Postal address, typed at the counter; draw or type; Sign; Decline | `grade10-site-grading-counter-documents-SC-12`, `grade10-site-grading-counter-documents-SC-14` |
| Agreement, cover schedule | the cover column per card and the cover in total | `grade10-site-grading-counter-documents-SC-12` |
| Postal address empty | Sign names the empty line | `grade10-site-grading-counter-documents-SC-06` |
| Pages not viewed | the refusal by name; the document scrolled to the end first | `grade10-site-grading-counter-documents-SC-07` |
| Name mismatch | the refusal by name against the booking | `grade10-site-grading-counter-documents-SC-04`, `grade10-site-grading-counter-documents-SC-28` |
| Declined | the declined outcome; nothing paid, nothing signed | `grade10-site-grading-counter-documents-SC-09`, `grade10-site-grading-counter-documents-SC-10` |
| Sealed | Signed and sealed; the copies on the submission page and the fingerprint; Download per document | `grade10-site-grading-counter-documents-SC-25` |
| Link expired | the refusal by name: ask staff for a new link | `grade10-site-grading-counter-documents-SC-08` |
| Already signed | the refusal by name; the sealed copy on the page | `grade10-site-grading-counter-documents-SC-11` |
| Receipt, signable (`G15`) | handed back, settled, collected by, where and when; three clauses; the same signing block; the slabs-are-yours footer | `grade10-site-grading-counter-documents-SC-16`, `grade10-site-grading-counter-documents-SC-21` |
| Receipt, named person (`G18`) | Your name prefilled as named; the hint; the first clause names them, printed as drawn until Legal confirms it (`decisions.md` Q48) | `grade10-site-grading-counter-documents-SC-17`, `grade10-site-grading-counter-documents-SC-29` |
| Receipt, ID matched | Collected by names the glance and that nothing was kept | `grade10-site-grading-counter-documents-SC-16` |
| Receipt, card held | Handed back names the card still out | `grade10-site-grading-counter-documents-SC-18`, `grade10-site-grading-counter-documents-SC-30` |
| Receipt, vaulted slab | Handed back says the card went to the vault | `grade10-site-grading-counter-documents-SC-19`, `grade10-site-grading-counter-documents-SC-30` |
| Receipt, withdrawn card | one card, its fee refunded | `grade10-site-grading-counter-documents-SC-20` |
| Receipt, paid out | what was paid out and how | `grade10-site-grading-counter-documents-SC-21` |
| Placeholders outside production | the brackets, marked | `grade10-site-grading-counter-documents-SC-24` |

### Letters

One row per letter, its kind, and the blocks it carries after the lead.

| Letter | Kind | Board | Blocks after the lead | Preview | Anchor |
| --- | --- | --- | --- | --- | --- |
| The plan's link | `plan_saved` | `M13` | facts cards · estimate · kept until; the not-sent-when-booked line; `PrimaryCta` Book the drop-off | `apps/emails/emails/grading/plan-saved.tsx` | `grade10-site-grading-submission-plan-SC-38` |
| The nudge | `plan_nudged` | `M13` | the same letter on the nudge day | `plan-nudged.tsx` | `grade10-site-grading-submission-plan-SC-43` |
| The plan's link, no level yet | `plan_saved`, `plan_nudged` | `M13` | the same letters for a list kept before a level is picked: cards and kept until, no estimate row, the submission line without grader or level | `plan-saved-no-level.tsx`, `plan-nudged-no-level.tsx` | `grade10-site-grading-submission-plan-SC-27` |
| Expired | `plan_expired` | `M16` | the nothing-paid line; the prices-move line; `PrimaryCta` Start a submission | `plan-expired.tsx` | `grade10-site-grading-submission-plan-SC-44` |
| Drop-off booked | `dropoff_booked` | `M12` | facts where · bring · your cards leave · estimated back; the move-or-cancel line; the missed line; `PrimaryCta`; the calendar file attached | `dropoff-booked.tsx` | `grade10-site-grading-collector-notifications-SC-08` |
| Drop-off moved | `dropoff_moved` | none drawn | facts the new visit; `PrimaryCta` | `dropoff-moved.tsx` | `grade10-site-grading-dropoff-booking-SC-15` |
| Drop-off cancelled | `dropoff_cancelled` | none drawn | facts the visit closed; the list kept; `PrimaryCta` | `dropoff-cancelled.tsx` | `grade10-site-grading-dropoff-booking-SC-16` |
| Drop-off missed | `dropoff_missed` | none drawn | facts the visit; the list and the estimate kept; the book-again line; `PrimaryCta` | `dropoff-missed.tsx` | `grade10-site-grading-dropoff-booking-SC-18`, `grade10-site-grading-collector-notifications-SC-10` |
| The day before | `dropoff_reminder` | none drawn | facts the visit and what to bring; `PrimaryCta` | `dropoff-reminder.tsx` | `grade10-site-grading-collector-notifications-SC-09` |
| Visit detached | `dropoff_detached` | none drawn | facts the visit the owner closed; the book-again line; `PrimaryCta` | `dropoff-detached.tsx` | `grade10-site-grading-dropoff-booking-SC-22`, `grade10-site-grading-dropoff-booking-SC-27` |
| Handed in | `checked_in` | `M07` | facts paid · cards · estimated back · includes; the photographs line; the changed-your-mind line; the keep-in-account line; `PrimaryCta`; the receipt and the signed agreement attached | `checked-in.tsx` | `grade10-site-grading-collector-notifications-SC-05` |
| Handed in, cover | `checked_in` | `M07` | the paid line names the cover | `checked-in-with-cover.tsx` | `grade10-site-grading-collector-notifications-SC-05` |
| On their way | `batch_shipped` | `M08` | facts courier · order · estimated back; the past-the-estimate line; `PrimaryCta` | `batch-shipped.tsx` | `grade10-admin-grading-batches-SC-11` |
| Running late | `batch_reestimated` | `M14` | facts stage · was · now; the nothing-to-do line; `PrimaryCta` | `batch-reestimated.tsx` | `grade10-admin-grading-batches-SC-21` |
| Grades are in | `grades_posted` | `M09` | `CardLines`; the settle paragraph where an upcharge stands; the ungraded paragraph where a card came back raw; the back-at-the-shop-by line; the review line; facts how to settle · reference; `PrimaryCta` See the grades | `grades-posted.tsx` | `grade10-site-grading-submission-lifecycle-SC-23` |
| Grades are in, nothing to settle | `grades_posted` | `M09` | neither paragraph | `grades-posted-clean.tsx` | `grade10-site-grading-collector-notifications-SC-04` |
| Not back with the box (`Q114`) | `card_not_back` | `M15` | a line per card not back, naming whether the grader holds it (with the day it holds it until), it did not come back, or it came back damaged; facts we settle · we refund · by · the other cards; the we-claim line; `PrimaryCta` | `card-not-back.tsx` | `grade10-site-grading-submission-lifecycle-SC-41`, `grade10-site-grading-submission-lifecycle-SC-42`, `grade10-admin-grading-batches-SC-37` |
| Ready to collect | `ready` | `M10` | `PickupBlock`; the vault line; the not-collected paragraph; the someone-else paragraph with the ID line; `PrimaryCta` | `ready.tsx` | `grade10-site-grading-submission-lifecycle-SC-25` |
| Ready, below the threshold | `ready` | `M10` | the someone-else paragraph without the ID line | `ready-below-threshold.tsx` | `grade10-site-grading-submission-lifecycle-SC-29` |
| Still here | `uncollected_reminder`, twice | `M11` | `PickupBlock` without bring; facts from · on; the next-reminder line; `PrimaryCta` | `uncollected-reminder.tsx` | `grade10-site-grading-submission-lifecycle-SC-35` |
| Storage fee | `storage_started` | `M17` | `PickupBlock`; facts on; the vault line; `PrimaryCta` | `storage-started.tsx` | `grade10-site-grading-submission-lifecycle-SC-38` |
| Written notice | `notice_posted` | `M18` | facts due today · pickup code · after; the registered-post line; the WhatsApp line; `PrimaryCta` | `notice-posted.tsx` | `grade10-site-grading-submission-lifecycle-SC-36` |
| Hand-back receipt, collected | `collected` | none drawn | `CardLines` of what was handed back; facts settled · refunded; `PrimaryCta`; the signed receipt attached | `collected.tsx` | `grade10-site-grading-counter-documents-SC-25` |
| Hand-back receipt, withdrawn | `card_withdrawn` | none drawn | one card, its fee refunded | `card-withdrawn.tsx` | `grade10-site-grading-submission-lifecycle-SC-15` |
| Values set | every kind | none drawn | `GradingFooter` prints the registered name, the shop address, the complaints contact | every preview | `grade10-site-grading-collector-notifications-SC-19`, `grade10-site-grading-collector-notifications-SC-20` |
| Values unset outside production | every kind | none drawn | the brackets, marked | `footer-placeholders.tsx` | `grade10-site-grading-collector-notifications-SC-21`, `grade10-site-grading-collector-notifications-SC-22` |
| Silence on purpose | none | none drawn | no letter for a refused card or a named collector | none | `grade10-site-grading-collector-notifications-SC-06`, `grade10-site-grading-collector-notifications-SC-07` |

### Queue

Stories `grading-admin-queue-queue-panel--`; every Badge row shares `--badges` and every Tile row `--tiles`. A badge is derived at the read from the submission's own dates, never stored.

| State | Shows | Anchor |
| --- | --- | --- |
| Views (`GA1`) | seven `Choice`s with counts; newest touched first, 50 a page; `CursorPager` | `grade10-admin-grading-counter-SC-02`, `grade10-admin-grading-counter-SC-04` |
| Today strip | the day's drop-offs in slot order: time, collector, id, cards, grader; the pickups-walk-in line | `grade10-admin-grading-counter-SC-85` |
| Rows | id, collector, cards, grader · level, the status word, visit, last touched, waiting on | `grade10-admin-grading-counter-SC-86` |
| Badge: Visit today | the submission's drop-off falls today | `grade10-admin-grading-counter-SC-06` |
| Badge: Batch closes today | the submission is handed in and its batch's cut-off is today | `grade10-admin-grading-counter-SC-10` |
| Badge: Due back | the batch's estimated day back has come | `grade10-admin-grading-batches-SC-50` |
| Badge: Running late | the batch is past its estimated day back | `grade10-admin-grading-batches-SC-20` |
| Badge: Upcharge to settle | a card moved up a level and the difference is unpaid | `grade10-admin-grading-counter-SC-10` |
| Badge: Ungraded card | a card came back with no grade | `grade10-admin-grading-counter-SC-10` |
| Badge: Unchecked return | the batch has been back a day and is not received | `grade10-admin-grading-batches-SC-05` |
| Badge: Uncollected 30 d | ready 30 days and not collected | `grade10-admin-grading-counter-SC-07` |
| Badge: Storage fee from day 90 | ready 90 days: the storage fee accrues | `grade10-admin-grading-counter-SC-10` |
| Badge: Notice due | ready 180 days: the written notice is owed | `grade10-admin-grading-counter-SC-08` |
| Badge: Payout past its window | a payout owed and not yet recorded past the settlement window, 14 days from the day the batch was received (`decisions.md` Q24); an unreceived transfer does not count | `grade10-admin-grading-counter-SC-09` |
| Badge: Transfer unconfirmed | a transfer payout recorded and not yet marked received, counted on To settle (`decisions.md` Q140) | `grade10-admin-grading-counter-SC-112` |
| Badge: Message not sent | a letter out of attempts; Send again on the row | `grade10-admin-grading-counter-SC-11` |
| Tile: Batch closing | the grader · level, cards, submissions, more today, ships | `grade10-admin-grading-counter-SC-87` |
| Tile: With graders | the count and how many past their estimate | `grade10-admin-grading-counter-SC-87` |
| Tile: Ready, uncollected | the count and how many past 30 days | `grade10-admin-grading-counter-SC-12` |
| Tile: To settle | the sum of what is due (upcharges, storage, repayments) and the submissions owing it; the transfers unconfirmed | `grade10-admin-grading-counter-SC-13`, `grade10-admin-grading-counter-SC-112` |
| Empty view | `EmptyState` in the view | `grade10-admin-grading-counter-SC-05` |
| Loading | the console's async status line | **Out of suite:** the panel's colocated test |
| Error | the console's async status line, retry | **Out of suite:** the panel's colocated test |
| Read grant | no row action past Open | `grade10-admin-grading-counter-SC-75` |
| Walk-in desk | the section's desks read Queue · Walk-in · Batches · Settings; Walk-in shown only with `admin.savePlan`, and absent for a read holder | `grade10-admin-grading-counter-SC-15`, `grade10-admin-grading-counter-SC-75` |

### Walk-in form

Stories `grading-admin-intake-walk-in-form--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Walk-in | the Walk-in desk at `/grading/walk-in`, no submission yet: the counter opens one at the desk and writes the list card by card with the collector, Add a card at a time and no paste, then hands it in from Not handed in yet | `grade10-admin-grading-counter-SC-15` |

### Hand-in runbook

Stories `grading-admin-intake-intake-runbook--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Header (`GA2`) | the summary, the id, the status word, declared in total, the visit in progress at the desk; the drop-off card with Move, Cancel visit, Open in diary | `grade10-admin-grading-counter-SC-14` |
| Visit not started | step 1 offers Start at the desk; the rest wait | `grade10-admin-grading-counter-SC-14` |
| Second submission on the visit | the other submission named under the visit; each runs its own runbook | `grade10-admin-grading-counter-SC-21` |
| Cards table | per row: the card, declared with its reference, Present, Condition, the level check, Refuse; the photograph pair | `grade10-admin-grading-counter-SC-16` |
| Card present | Present ticked; the photograph pair taken | `grade10-admin-grading-counter-SC-16` |
| Card, condition noted | the note as typed in place of Nothing noted | `grade10-admin-grading-counter-SC-16` |
| Level check | every declared value inside the ceiling: the banner | `grade10-admin-grading-counter-SC-88` |
| Level check failed | a card above the ceiling: the row marked; move to a second submission or refuse | `grade10-admin-grading-counter-SC-17` |
| Second submission offered | the card refused at this level; a second submission on the same visit, prefilled with the card and the collector, offering only the levels whose ceiling carries it | `grade10-admin-grading-counter-SC-17` |
| Card added | a card not on the list added with the collector, one at a time | `grade10-admin-grading-counter-SC-15` |
| Card refused | the row struck with the reason; the fee and the receipt drop | `grade10-admin-grading-counter-SC-25` |
| Fee (`GA2`) | cards × fee, the fee, declared in total, insured to | `grade10-admin-grading-counter-SC-19` |
| Fee with cover | the cover line per card and in total | `grade10-admin-grading-counter-SC-19` |
| Sign, not mintable | a card unchecked: the reason on the step | `grade10-admin-grading-counter-SC-42` |
| Sign, mintable | Show on iPad and Copy link; the 30-minute line | `grade10-admin-grading-counter-SC-45` |
| Sign, link shown | the link and its timer | `grade10-admin-grading-counter-SC-45` |
| Sign, declined | the decline on the step; mint again | `grade10-admin-grading-counter-SC-47` |
| Sign, sealed | the seal's instant and fingerprint | `grade10-admin-grading-counter-SC-48` |
| Mint refused in production | a fact unset: the refusal naming it | `grade10-admin-grading-counter-SC-46` |
| Take payment, waiting | disabled until the agreement is sealed | `grade10-admin-grading-counter-SC-18` |
| Take payment | the till opens with one line per card and the cover lines | `grade10-admin-grading-counter-SC-19` |
| Paid | the order written back by line with its reference | `grade10-admin-grading-counter-SC-19` |
| Refused after payment | the line refunded at the till | `grade10-admin-grading-counter-SC-27` |
| No paid line | check in refused: the submission stays booked, the seal stands, the cards go home; run the till again or rebook | `grade10-admin-grading-counter-SC-23` |
| Safe full | check in refused past the cap: the line and Book the next drop-off | `grade10-admin-grading-counter-SC-24` |
| Labels and check in | Print n labels and check in; the receipt email goes | `grade10-admin-grading-counter-SC-20` |
| Checked in | the runbook closed; the submission at Handed in | `grade10-admin-grading-counter-SC-20` |
| Read grant | the runbook with no button | `grade10-admin-grading-counter-SC-75` |
| Stale | an act refused because the submission moved; the page reads again | `grade10-admin-grading-counter-SC-84` |
| Record, one press | the header's link to the record, `?view=record`; Cancel lives there | **Out of suite:** the route test of task 31.1 |

### Refuse a card

Stories `grading-admin-intake-refuse-card-dialog--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Open (`GA7`) | the card and the submission; three reasons; the collector's-words field with its hint; the consequence `Notice`; Keep it on the list, Refuse this card | `grade10-admin-grading-counter-SC-25` |
| Nothing picked | Refuse disabled until a reason and the words | `grade10-admin-grading-counter-SC-26` |
| After payment | the `Notice` adds the refund line | `grade10-admin-grading-counter-SC-27` |
| Last card | refusing the last card: the `Notice` says the submission has no card left, and the counter cancels the submission at the desk | `grade10-admin-grading-counter-SC-89` |
| Refusing | pending | **Out of suite:** the panel's colocated test |
| Refused by the worker | the refusal by name in the dialog | `grade10-admin-grading-counter-SC-84` |

### Batches

Stories `grading-admin-batches-batches-panel--`, the Ship form rows `grading-admin-batches-ship-batch-form--`. A batch's word — open, closed, shipped, returned, received — is read from its own stamps; no act on this panel sets it.

| State | Shows | Anchor |
| --- | --- | --- |
| Tiles (`GA4`) | Ship today, With graders and how many past the estimate, Back unchecked, Declared value in the safe against its cap | `grade10-admin-grading-batches-SC-09` |
| Safe over the cap | the tile in the warning tone | `grade10-admin-grading-batches-SC-49` |
| Row: open | building until the cut-off; Open | `grade10-admin-grading-batches-SC-45` |
| Row: closed, ships today | Closed Thu 19:00 · ships today; Ship | `grade10-admin-grading-batches-SC-08` |
| Row: with the grader | the stage in its words; shipped and tracking; due back; Open, and Arrived once the grades are in | `grade10-admin-grading-batches-SC-17` |
| Row: past the estimate | Due back in the warning tone; Re-estimate, and Arrived once the grades are in | `grade10-admin-grading-batches-SC-20` |
| Row: grades not in | no Arrived while a submission in the batch is not yet graded; the row names the grader's stage that puts the grades in | `grade10-admin-grading-batches-SC-52` |
| Row: back, unchecked | Receive | `grade10-admin-grading-batches-SC-05` |
| Row: received | Closed with the received date; Open | `grade10-admin-grading-batches-SC-06` |
| Row: closed, nothing to ship | Closed with its cut-off; no Ship; listed among the older batches | `grade10-admin-grading-batches-SC-55` |
| Order and older batches | every batch not yet received on each page, what waits on the shop first: back unchecked, closed with cards to ship, past the estimate, then the rest with the grader soonest due, then open; the received ones newest first behind the pager | `grade10-admin-grading-batches-SC-55` |
| Empty | no batch; New batch | `grade10-admin-grading-batches-SC-44` |
| New batch | grader, and only the levels the grader's active sheet carries; a card that fits neither waits | `grade10-admin-grading-batches-SC-44` |
| Ship form (`GA4`) | the checklist: packing list printed, the grader's form filled; order number, shipped on, estimated back; one shipment block with its courier and tracking, insured to its cards' declared total against the courier's cover setting, read-only; Mark as shipped · email n collectors | `grade10-admin-grading-batches-SC-43` |
| Cover unset | Mark as shipped refused naming the courier's cover, in production (`decisions.md` Q143) | `grade10-admin-grading-batches-SC-16` |
| Above the courier's cover | the insured line in the warning tone; Mark as shipped refused as one shipment, and Split into shipments offered (`decisions.md` Q128) | `grade10-admin-grading-batches-SC-15` |
| Split into shipments | one block per shipment: its cards picked from the packing list, courier and tracking, its insured total against the cover; a card in no shipment or a shipment past the cover named; Mark as shipped once every card is in one | `grade10-admin-grading-batches-SC-57` |
| Shipped on in the future | refused on the field | `grade10-admin-grading-batches-SC-12` |
| Shipped on before the cut-off | refused on the field (`decisions.md` Q129) | `grade10-admin-grading-batches-SC-56` |
| Incomplete | Mark as shipped disabled naming the field | `grade10-admin-grading-batches-SC-13` |
| Shipping | pending | **Out of suite:** the panel's colocated test |
| Shipped | every submission at Sent; the letters sent | `grade10-admin-grading-batches-SC-11` |
| Re-estimate | `ReestimateDialog`: the stage picked from the grader's stages, the new date, the reason; emails every collector | `grade10-admin-grading-batches-SC-21` |
| Stage recorded | the morning read: the stage picked from the grader's stages, one of them the move to graded, the grader's words in the note beside it; the stage on the batch and every submission's timeline | `grade10-admin-grading-batches-SC-17` |
| Read grant | no New batch, Ship, Re-estimate, Arrived or Receive | `grade10-admin-grading-counter-SC-75` |

### Receive a batch

Stories `grading-admin-receiving-receive-panel--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Header (`GA5`) | the batch, grader · level, cards from submissions, the grader's last stage with the day it was recorded, arrived; the progress | `grade10-admin-grading-batches-SC-29` |
| Before the manifest | Scan disabled; Enter the manifest and the invoice first | `grade10-admin-grading-batches-SC-23` |
| Manifest entry | typed lines, as the morning read is; no file to import (`decisions.md` Q130) | `grade10-admin-grading-batches-SC-23` |
| Invoice entry | the invoice's lines and total | `grade10-admin-grading-batches-SC-23` |
| Unmatched manifest line | a line naming no intake id in the batch listed unmatched; Finish held | `grade10-admin-grading-batches-SC-24` |
| Line resolved | on an unmatched line, the batch's card it meant named, or the line closed as the grader's error with the reason; the line reads its card, unscanned, until the cert scans, or reads closed with its reason | `grade10-admin-grading-batches-SC-51` |
| Counters | scanned of total, matched, ungraded, upcharges and their sum, submissions ready when finished | `grade10-admin-grading-batches-SC-29` |
| Scan matched | the row: grade · cert, the card, the submission, Matched, Scanned | `grade10-admin-grading-batches-SC-25` |
| Cert held elsewhere | the scan refused naming the submission that holds it | `grade10-admin-grading-batches-SC-26` |
| Cert not on the manifest | the scan refused by name | `grade10-admin-grading-batches-SC-27` |
| Ungraded row | the code, Returned raw with the note; the fee stands | `grade10-admin-grading-batches-SC-28` |
| Upcharge row | the level moved and the sheet's difference | `grade10-admin-grading-batches-SC-38` |
| Invoice gap | the invoice's figure against the sheet's; the gap always Commercial's to read, since a US-dollar invoice is not reconciled against the sheet's HKD differences | `grade10-admin-grading-batches-SC-39` |
| Not scanned yet | On the manifest, not scanned; Scan | `grade10-admin-grading-batches-SC-31` |
| Held by the grader | the card recorded held with its expected date | `grade10-admin-grading-batches-SC-34` |
| Not returned | the card recorded not returned; the payout line | `grade10-admin-grading-batches-SC-35` |
| Damaged | the slab photographed in the box; Damaged on the card, recorded before its cert is scanned | `grade10-admin-grading-batches-SC-36` |
| Not on the manifest | a card that went out and no line names, listed under the table; Held, Not returned, Add to the manifest; Finish held until it is accounted for | `grade10-admin-grading-batches-SC-53` |
| Added to the manifest | the slab in the box on no line: its line added for the card with the cert and the grade, marked the grader's omission; then scanned as any line | `grade10-admin-grading-batches-SC-54` |
| Exceptions (`GA5`) | the `EntryList`: ungraded, upcharges, not scanned, damaged | `grade10-admin-grading-batches-SC-29` |
| Save, finish later | the scans kept; the batch stays back, unchecked | `grade10-admin-grading-batches-SC-30` |
| Finish held | an unmatched line or an unscanned slab unresolved: Finish disabled naming it | `grade10-admin-grading-batches-SC-31` |
| Finish | Finish receiving · notify n collectors; every submission ready, the codes emailed | `grade10-admin-grading-batches-SC-32` |
| Finished | the batch closed with its received date | `grade10-admin-grading-batches-SC-06` |
| Read grant | no Scan, Enter or Finish | `grade10-admin-grading-counter-SC-75` |

### Hand-back runbook

Stories `grading-admin-handback-handback-runbook--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Header (`GA6`) | the summary, the id, Ready to collect, declared, ready since, to settle; the pickup block: walk-in, nothing in the diary | `grade10-admin-grading-counter-SC-29` |
| Who is collecting | the code field and the name; the declared total against the threshold | `grade10-admin-grading-counter-SC-29` |
| Code matched | the collector in person; the ID line above the threshold, nothing kept | `grade10-admin-grading-counter-SC-30` |
| Below the threshold | no ID line; the code and the name release | `grade10-admin-grading-counter-SC-31` |
| Wrong code | refused on the field | `grade10-admin-grading-counter-SC-37`, `grade10-admin-grading-counter-SC-91` |
| Named person (`G18`) | the named person read from the page; the receipt names them | `grade10-admin-grading-counter-SC-38` |
| Somebody else | turned away, code or no code; no override; the name-from-the-page line | `grade10-admin-grading-counter-SC-39` |
| Settle | the upcharge and the storage lines; Take payment | `grade10-admin-grading-counter-SC-32` |
| Nothing due | the step ticked with nothing to take | `grade10-admin-grading-counter-SC-33` |
| Settled | the paid line with its reference | `grade10-admin-grading-counter-SC-32` |
| Items (`GA6`) | per row: the item, cert, outcome, Handed over; Vault instead on a slab | `grade10-admin-grading-counter-SC-33` |
| Item ticked | handed over and inspected; the slab photographed | `grade10-admin-grading-counter-SC-33` |
| Item held by the grader | the row reads still out; not tickable | `grade10-admin-grading-counter-SC-34` |
| Sign, refused | something due or an item unticked: the reason on the step, before the iPad; what is due is fixed as the receipt is minted | `grade10-admin-grading-counter-SC-43`, `grade10-admin-grading-counter-SC-44` |
| Sign, mintable | Show on iPad, Copy link; the 30-minute line | `grade10-admin-grading-counter-SC-45` |
| Sign, declined | the decline; nothing handed back | `grade10-admin-grading-counter-SC-47` |
| Hand over | the receipt sealed on the iPad, then Hand over on the step: the packet goes over the counter and the submission reads Back with you; the record stays | `grade10-admin-grading-counter-SC-35` |
| Second hand-back | the held card back: the rest already collected; one item; Close | `grade10-admin-grading-counter-SC-36`, `grade10-admin-grading-counter-SC-90` |
| Money (`GA6`) | paid at hand-in, due now, storage from the day | `grade10-admin-grading-counter-SC-52` |
| Vault, waiting | Open a vault case disabled until the balance is settled | `grade10-admin-grading-counter-SC-41` |
| Vault | the slab handed to the vault; the case opened; the receipt says so | `grade10-admin-grading-counter-SC-40` |
| Read grant | the runbook with no button | `grade10-admin-grading-counter-SC-75` |
| Record, one press | the header's link to the record, `?view=record` | **Out of suite:** the route test of task 31.1 |

### One submission

Stories `grading-admin-submission-submission-panel--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Header (`GA3`) | the summary, the id, the status word, declared, upcharge to settle, ungraded card, the batch; the collector block with email, phone, WhatsApp and the templates | `grade10-admin-grading-counter-SC-50` |
| Pickup block | no visit needed, ready once checked in, walk-in with the code, a named person may collect | `grade10-admin-grading-counter-SC-38` |
| Drop-off block | the visit, the desk, Move, Cancel visit, Open in diary | `grade10-admin-grading-counter-SC-14` |
| Cards tab (`GA3`) | per card intake id, declared, level and the one moved to, grade · cert, outcome | `grade10-admin-grading-counter-SC-51` |
| Withdraw a card | offered per card at Handed in until the batch closes; `WithdrawCardDialog`: the refund and the receipt | `grade10-admin-grading-counter-SC-54` |
| Withdraw gone | the batch closed: the act absent | `grade10-admin-grading-counter-SC-55` |
| Money tab | paid at hand-in with the POS reference, the upcharge, storage, to settle, refunds, payouts | `grade10-admin-grading-counter-SC-52` |
| Record a settlement | `SettlementDialog`: the line and the till's reference | `grade10-admin-grading-counter-SC-32` |
| Waive the upcharge | `WaiveUpchargeDialog`: the reason, the second approve holder | `grade10-admin-grading-counter-SC-59` |
| Waive, cards not back | the act absent until the cards are back | `grade10-admin-grading-counter-SC-61` |
| Second person is the recorder | refused by name in the dialog | `grade10-admin-grading-counter-SC-60` |
| Payout | `PayoutDialog`: declared value, the fee refunded, the route, the window, the second person | `grade10-admin-grading-counter-SC-62` |
| Payout reversed | the reversal on the record; the card back | `grade10-admin-grading-counter-SC-64` |
| Payout past the window | the window passed marked on the dialog | `grade10-admin-grading-counter-SC-97` |
| Documents tab | the three with fingerprints; Show on iPad, Copy link, Send again | `grade10-admin-grading-counter-SC-48` |
| Documents, none yet | before hand-in: nothing sealed | `grade10-admin-grading-counter-SC-93` |
| Send again | the letter re-sent; the grades email the same | `grade10-admin-grading-counter-SC-49` |
| Message not sent | the failed letter flagged with its reason; Send again | `grade10-admin-grading-counter-SC-11` |
| Timeline tab | every event with its figures, the grader's stages in its words, staff-only entries marked | `grade10-admin-grading-counter-SC-56` |
| Actions by status (`GA3`) | only the status's acts; Cancel absent once the visit starts, a card is checked or refused, or the cards have left | `grade10-admin-grading-counter-SC-82`, `grade10-admin-grading-counter-SC-83`, `grade10-admin-grading-counter-SC-107` |
| Runbook, one press | where the hand-in or the hand-back is offered, the header's link back to its runbook | **Out of suite:** the route test of task 31.1 |
| Cancel | `useConfirm`: the confirm names the drop-off that goes with it and says it is on the collector's word, and that the collector is sent nothing; Yes, cancel and Go back | `grade10-admin-grading-counter-SC-106` |
| Cancelled | the status word Cancelled; the drop-off block gone; the cancel on the Timeline with the operator; no act but Open | `grade10-admin-grading-counter-SC-106` |
| Stale | an act refused because the submission moved; the panel reads again | `grade10-admin-grading-counter-SC-84` |
| Read grant | the tabs with no act | `grade10-admin-grading-counter-SC-75` |
| Not found | the console's not-found line | `grade10-admin-grading-counter-SC-94` |

### Written notice

Stories `grading-admin-notice-post-notice-dialog--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Notice due | the badge on the Ready view and the submission; Post the notice | `grade10-admin-grading-counter-SC-65` |
| Post the notice | `PostNoticeDialog`: the address from the agreement, posting date, tracking; the email goes the same day | `grade10-admin-grading-counter-SC-66`, `grade10-admin-grading-counter-SC-105` |
| Incomplete | Record disabled naming the field | `grade10-admin-grading-counter-SC-66` |
| Posted | the posting date and tracking on the timeline; the notice period pinned at signing counted from it | `grade10-admin-grading-counter-SC-67` |
| After the notice period | nothing more offered; storage accrues | `grade10-admin-grading-counter-SC-68` |

### Settings

Stories `grading-admin-settings-settings-panel--`.

| State | Shows | Anchor |
| --- | --- | --- |
| Table | every setting with its value in force, or "not set", its owner and the pinned line | `grade10-admin-grading-counter-SC-99` |
| Fee sheet | one row per grader and level: ceiling, fee, cover rate, weeks, cards a submission | `grade10-admin-grading-counter-SC-99` |
| Diary services | the three entries with their durations | `grade10-admin-grading-counter-SC-99` |
| Edit a clock | `SaveableField`; saved under the settings subject | `grade10-admin-grading-counter-SC-71` |
| Edit the reference rate | `SaveableField` taking the HKD one US dollar buys, 7.84 at the start; saved by one approve holder under the settings subject, nought refused on the field | `grade10-admin-grading-counter-SC-71` |
| Edit a money setting | the second-person dialog with the reason; the row then reads waiting on a second approver | `grade10-admin-grading-counter-SC-70` |
| Approve a money setting | Approve on the waiting row for an approve holder who did not ask; the value written carrying both names; the recorder offered no Approve on their own request | `grade10-admin-grading-counter-SC-60` |
| Refused | the refusal by name on the field | `grade10-admin-grading-counter-SC-104` |
| Operate grant | the table read-only; no field opens | `grade10-admin-grading-counter-SC-76` |
| Fact unset | a bracketed value marked; the readiness line naming its owner | `grade10-admin-grading-counter-SC-98` |

## Flags

- **Frames nobody drew** — the booking's joined, resized and detached forms
  and the diary's refusals, the booked view moved, the ceremony's refusals,
  the letters for a moved, cancelled, missed or detached drop-off, the day
  before, damage and the hand-back receipt, the queue's badges, empty and read-only forms, the hand-in
  runbook before the visit starts, on a walk-in, with no paid line and with
  the safe full, the refuse dialog's last card, the batches' empty and
  new-batch forms, receiving's manifest and invoice entry, the hand-back's
  wrong code, second hand-back and turned-away forms, the written notice,
  the settings and every grant-shaped state. Each is a row above, drawn
  from its drawn sibling; the stories are their frame
- **What the design system still owes** — three rungs on `Text` and
  nothing else: every other screen composes what `packages/design-system`
  and `@grade10/frontend-console` already publish
- **Story ids** — the console's ids carry `admin` after `grading`, so a
  collector view and a console view can never share one
- **The day picker** — `G05` draws a week strip; `BookingSlotPicker` draws
  a month grid, and the reuse stands (`decisions.md` Q37)
- **Journeys the states reach past** — a card refused at the counter has no
  collector journey of its own; its page rows anchor on the silence in
  `grade10-site-grading-collector-notifications-US-02`. A card held by the
  grader is walked by staff (`grade10-admin-grading-batches-US-03`) and
  read by the collector under `grade10-site-grading-submission-lifecycle-US-01`.
  The PM may issue a collector journey for each, or the requirements pass
  states them out of suite
- **The last card refused** — the counter cancels the submission and tells
  the collector there; no message sends, nothing was paid and nothing is
  owed (`decisions.md` Q75;
  `grade10-site-grading-submission-lifecycle-SC-58` and
  `grade10-admin-grading-counter-SC-89`)
- **Refusal words** — the grading `RefusalWords` for the doc-sign codes
  grading can meet are `tech-design.md`'s, over `grading.ceremony`
- **Operations' answers** — the manifest and the invoice are typed, so
  `GA5`'s Import is not built; a batch above the courier's cover ships split
  into shipments each under it, a form `GA4` does not draw
  (`decisions.md` Q128, Q130)
- **Legal words** — the receipt's first clause when a named person collects
  prints as drawn until Legal confirms it (`decisions.md` Q48); the row
  prefills the name
- **Drawn, not carried** — `G00-Main`'s disposal step, `GA3`'s WhatsApp
  templates' words, `G06`'s vault cross-sell copy beyond one line, `GA6`'s
  ten-to-fifteen-minutes line, and the console's 2FA strip; the first
  release stops at the notice, and the console's chrome is the console's
- **Copy that rides along** — the booked view's Before you come is keys
  above with no delta of its own; its rows anchor on the journey that reads
  them
- **Console words** — the console's badges and status words are the
  status table's; `grading.console.*` carries only the WhatsApp templates
