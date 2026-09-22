# UI: Card grading

No Figma frame exists. The design canvas is the frame:
[Grading canvas](https://claude.ai/artifact/GtDo31jHhqGuhirojtEeJZ), one
board per screen, named below by its id (`G11`, `GA5`, `M10`). A board is the
layout's source of truth; [decisions.md](decisions.md) owns the scope, the
journeys beside each delta own the behaviour, and `tech-design.md` owns the
data and the mechanism. The [inventory](../../../docs/prds/products/grade10-site/grading/index.md)
the pages carry is the product; this file carries the surface.

- **Where the views live** — the collector-facing blocks in
  `packages/ui/src/blocks/grading-submission/` as `shared/ui/grading-submission`,
  the pages that compose them in `packages/grading/frontend`, the console's
  views in `packages/grading/admin-frontend` composing
  `@grade10/frontend-console`; nothing console-shaped enters `packages/ui`
- **Stories** — every block gets a colocated `<block>.stories.tsx` in the
  workbench, titled `Blocks/Grading Submission/<Component>`, so an id reads
  `blocks-grading-submission-<component>--<state>`; every page and console
  view gets a colocated `<View>.stories.tsx` in the monorepo Storybook the
  vault change stands up, an id reading `grading-<feature>-<view>--<state>`
  for the collector's pages and `grading-admin-<feature>-<view>--<state>` for
  the console's, as the vault's do. The state is the `## States` row's name in
  kebab-case; every row names its story after a `·`, and the Stories column
  below gives each screen's prefix
- **The iPad** — the two documents ride `packages/doc-sign`'s `CeremonyFlow`
  unchanged, with grading's `RefusalWords` and templates; the board is the
  document, the ceremony's chrome is the vault's
- **Letters** — every collector email is a React Email letter the worker
  renders from `packages/grading/backend/src/email`; `apps/emails/emails/grading/`
  in this store carries the preview copy of each, one file per kind
- **Copy** — the collector's words are keys in
  `packages/i18n/messages/shared/<locale>/grading.json`, a new namespace, in
  the families named under Components and never their words; the console's
  words are the console's own English, as its panels already carry them; a
  letter's words live in the letter

## Screens

| Screen | Board | Route | Composes | Stories |
| --- | --- | --- | --- | --- |
| Grading home | `G16`, `G01` | `grade10.com/grading` | `GradingHome` → `GradingFeeSheet`, `GradingOwnershipChip`, `Card`, `List`, `EmptyState`, `Button`, `Link`, `Text` | `grading-plan-grading-home--*` |
| Plan wizard | `G02`, `G03`, `G04` | `/grading`, mounted by the home — ❓ the tech design fixes the step addresses | `PlanWizard` → `Stepper`, `Step`, `TextInput`, `GradingCardList`, `GradingPasteSheet`, `GradingLevelPicker`, `GradingReview`, `Alert`, `Button` | `grading-plan-plan-wizard--*` |
| Paste a list | `G17` | a sheet over the cards step | `GradingPasteSheet` → `Drawer`, `Textarea`, `List`, `Alert`, `Button` | `blocks-grading-submission-gradingpastesheet--*` |
| Book the drop-off | `G05` | from the review or the submission page — ❓ the tech design fixes the address | `DropoffBooking` → `BookingLocationPicker`, `BookingSlotPicker`, `Alert` for the batch line, `Text`, `Button` | `grading-dropoff-dropoff-booking--*` |
| Drop-off booked | `G06` | on the submission page, after a booking | `DropoffBooked` → `BookingConfirmation`, `BookingManageCard`, `List`, `Alert`, `Link`, `Button` | `grading-dropoff-dropoff-booked--*` |
| Submission page | `G07`–`G12`, `G13`, `G18` | `/grading/submissions/:submissionId` | `SubmissionPage` → `GradingStatusRail`, `GradingOwnershipChip`, `BookingManageCard`, `GradingCardRecord`, `GradingGradeCards`, `GradingPickupCard`, `GradingNamedCollector`, `GradingMoneyBlock`, `GradingUncollectedLadder`, `Card`, `Alert`, `Dialog`, `List`, `Link`, `Button`, `Text` | `grading-submission-submission-page--*` |
| Walk-in booking | none; `G00-Main` names it | `grade10.com/book` | the site's own booking flow, unchanged; the Grading visit is a listed service | none of this change's |
| Submission agreement | `G14` | `/grading/sign#<token>` | `CeremonyFlow` → `PdfPageCanvas`, `SignatureField`, `RefusalNotice`; the template in `packages/grading/backend` | `grading-documents-sign-page--*` |
| Hand-back receipt | `G15`, `G18` | `/grading/sign#<token>` | the same ceremony with the receipt template | `grading-documents-sign-page--*` |
| Queue | `GA1` | `admin.grade10.com/grading` | `QueuePanel` → `SectionHeader`, `ChoiceList`, `Choice`, `Figure`, `Table`, `Row`, `Cell`, `At`, `Money`, `Status`, `StatusBadge`, `Badge`, `CursorPager`, `Button` | `grading-admin-queue-queue-panel--*` |
| Hand-in runbook | `GA2` | `/grading/submissions/:submissionId` at `booked` | `IntakeRunbook` → `CheckList`, `Check`, `Panel`, `Table`, `Row`, `Cell`, `Money`, `MediaFrame`, `TextField`, `Notice`, `Button`, `Link`, `Code` | `grading-admin-intake-intake-runbook--*` |
| Refuse a card | `GA7` | dialog from the hand-in runbook | `RefuseCardDialog` → `FormDialog`, `ChoiceList`, `Choice`, `NotesField`, `Notice` | `grading-admin-intake-refuse-card-dialog--*` |
| Batches | `GA4` | `/grading/batches` | `BatchesPanel`, `ShipBatchForm`, `ReestimateDialog` → `Figure`, `Table`, `Row`, `Cell`, `At`, `Money`, `Status`, `CheckList`, `Check`, `TextField`, `DateField`, `MoneyField`, `FormDialog`, `Notice`, `Button` | `grading-admin-batches-batches-panel--*`, `grading-admin-batches-ship-batch-form--*` |
| Receive a batch | `GA5` | `/grading/batches/:batchId/receive` | `ReceivePanel` → `SectionHeader`, `Figure`, `FilePicker`, `Search`, `Table`, `Row`, `Cell`, `Status`, `Notice`, `EntryList`, `Entry`, `FormDialog`, `Button` | `grading-admin-receiving-receive-panel--*` |
| Hand-back runbook | `GA6`, `G18` | `/grading/submissions/:submissionId` at `ready` | `HandbackRunbook` → `CheckList`, `Check`, `Panel`, `TextField`, `Table`, `Row`, `Cell`, `Money`, `MediaFrame`, `Notice`, `Button`, `Link`, `Code` | `grading-admin-handback-handback-runbook--*` |
| One submission | `GA3` | `/grading/submissions/:submissionId` | `SubmissionPanel` → `Tabs`, `Tab`, `TabPanel`, `StatusBadge`, `Badge`, `Panel`, `EntryList`, `Entry`, `Table`, `Row`, `Cell`, `Money`, `At`, `FormDialog`, `MoneyField`, `DateField`, `NotesField`, `Notice`, `Button`, `Link` | `grading-admin-submission-submission-panel--*` |
| Written notice | none drawn; `GA1`'s Notice due badge and `M18` | dialog from the Ready view or the submission | `PostNoticeDialog` → `FormDialog`, `DateField`, `TextField`, `Notice` | `grading-admin-notice-post-notice-dialog--*` |
| Settings | none drawn; the console page's table | `/grading/settings` — ❓ the tech design fixes the address | `SettingsPanel` → `SectionHeader`, `Table`, `Row`, `Cell`, `SaveableField`, `MoneyField`, `PercentField`, `NumberField`, `FormDialog`, `Notice` | `grading-admin-settings-settings-panel--*` |

### Letters

One shell, `GradingLetter`, on `Grade10EmailShell`: the heading, the greeting,
the lead paragraph, then the blocks in the order below, then
`SubmissionLine` and `GradingFooter`. The blocks: `FiguresTable` (label ·
value rows), `CardLines` (one line per card: grade, name, cert or the
ungraded code), `PickupBlock` (code · where · open · to settle · bring),
`PrimaryCta`, `SubmissionLine` (id · n cards to grader level),
`GradingFooter` (the custodian's registered name trading as Grade10, the
shop and its address, the complaints contact, the Hong Kong time line).

| Letter | Kind | Board | Blocks after the lead |
| --- | --- | --- | --- |
| The plan's link | `plan_saved`, and again as `plan_nudged` | `M13` | `FiguresTable` cards · estimate · kept until; the not-sent-when-booked line; `PrimaryCta` Book the drop-off |
| Expired | `plan_expired` | `M16` | the nothing-paid line; the prices-move line; `PrimaryCta` Start a submission |
| Drop-off booked | `dropoff_booked` | `M12` | `FiguresTable` where · bring · your cards leave · estimated back; the move-or-cancel line; the missed line; `PrimaryCta`; the calendar file attached |
| Drop-off moved, cancelled, missed, the day before | `dropoff_moved`, `dropoff_cancelled`, `dropoff_missed`, `dropoff_reminder` | none drawn | `FiguresTable` the visit; on a missed one the book-again line; on a moved one the new visit and the calendar file; `PrimaryCta` |
| Handed in | `checked_in` | `M07` | `FiguresTable` paid · cards · estimated back · includes; the photographs line; the changed-your-mind line; the keep-in-account line; `PrimaryCta`; the receipt and the signed agreement attached |
| On their way | `batch_shipped` | `M08` | `FiguresTable` courier · order · estimated back; the past-the-estimate line; `PrimaryCta` |
| Running late | `batch_reestimated` | `M14` | `FiguresTable` stage · was · now; the nothing-to-do line; `PrimaryCta` |
| Grades are in | `grades_posted` | `M09` | `CardLines`; the settle paragraph where an upcharge stands; the ungraded paragraph where a card came back raw; the checked-in-by line; the review line; `FiguresTable` how to settle · reference; `PrimaryCta` See the grades |
| Not returned | `card_not_returned`, `card_damaged` | `M15` | `FiguresTable` we settle · we refund · by · the other cards; the we-claim line; `PrimaryCta` |
| Ready to collect | `ready` | `M10` | `PickupBlock`; the vault line; the not-collected paragraph; the someone-else paragraph with the ID line; `PrimaryCta` |
| Still here | `uncollected_reminder`, twice | `M11` | `PickupBlock` without bring; `FiguresTable` from · on; the next-reminder line; `PrimaryCta` |
| Storage fee | `storage_started` | `M17` | `PickupBlock`; `FiguresTable` on; the vault line; `PrimaryCta` |
| Written notice | `notice_posted` | `M18` | `FiguresTable` due today · pickup code · after; the registered-post line; the WhatsApp line; `PrimaryCta` |
| Hand-back receipt | `card_withdrawn`, `collected` | none drawn | `CardLines` of what was handed back; `FiguresTable` settled · refunded; `PrimaryCta`; the signed receipt attached |

## Components

### `@grade10/design-system` — existing, no new variant or token

`Alert` (`status`, `layout=inline`), `Autocomplete` for the card search,
`Avatar`, `Badge` (`default`, `success`, `error`, `warning`, `info`, `brand`,
`outline`), `Button`, `Card` and its parts, `CheckboxListInput` for the
consent tick, `Dialog` and its parts, `Divider`, `Drawer` for the paste
sheet, `EmptyState`, `IconButton`, `Link`, `List`, `NumberInput` for a
declared value, `RadioCard` for a level, `RadioList` and `RadioListItem`,
`SegmentedControl` and `SegmentedControlItem` for the grader, `Skeleton`,
`Step` (`completed`, `progress`, `upcoming`), `Stepper`, `Table` and its
parts, `Tabs`, `Text`, `TextInput`, `Textarea`, `HStack`, `VStack`.

- **The status word and the chip** are two `Badge`s: the word in the tone
  the status table names (`default`, `info`, `brand`, `success`), the chip
  `outline` while it is the collector's move, `info` while the cards are with
  us or the grader, `warning` past the estimate. `Chip` is a dismissible
  control and does not fit
- **A card's outcome** is a `Badge` on the card line: `outline` Listed and
  Handed in, `success` a grade, `error` Refused, Ungraded, Not returned and
  Damaged, `warning` Moved up a level, Held by the grader and Minimum grade
  not met, `default` Withdrawn, Collected and Vaulted
- **The pickup code** is `Text` at display size in the mono face on a dark
  `Card`; no primitive draws a code and none is asked for
- **The grade** is `Text` at display size with the label word under it; the
  ungraded card is the same card in the `error` tone
- **The day picker** is `BookingSlotPicker`'s month grid; `G05` draws a
  week strip, and the block stands as the vault's booking does

### `@grade10/ui` — new, work in this repository

Every export below lands in `packages/ui/src/blocks/grading-submission/`
with a story per state, `packages/ui/src/index.ts` re-exporting them under a
`shared/ui/grading-submission` comment. Every one takes `copy` (its words as
one typed group), `locale`, and `className`; money is minor units and an
ISO 4217 code formatted through the package's `formatMoney`, a day or an
instant through `formatLocalTime` in the zone given.

- **`GradingFeeSheet`** — `graders` (each with its name and its levels:
  name, ceiling, cards a submission, fee, cover rate or none, weeks),
  `selectedGraderId`, `aboveTopLine`, `onSelectGrader`; a `Table` per
  grader under a `SegmentedControl` when there is more than one
- **`GradingCardList`** — the editable planning list: `cards` (id, name,
  set line, matched or kept as typed, declared value or none, reference
  sales or none, minimum grade or none), `cap` (the count and the level it
  closes), `search` as `AsyncState` of matches, `onSearch`, `onAdd`,
  `onEdit`, `onRemove`, `onDeclare`, `onMinimumGrade`, `onPaste`; `Card` per
  card with `Autocomplete`, `NumberInput`, `CheckboxListInput` and `Text`
- **`GradingCardRecord`** — the read-only list after hand-in: `cards` (id,
  intake id or none, name, set line, declared value, minimum grade, outcome
  badge, the outcome's line in the collector's words, cert or none, the
  photograph pair or none, the slab photograph or none), `lookupHref` per
  cert; `List` of `Card`s
- **`GradingPasteSheet`** — `open`, `result` as `AsyncState` of the four
  counts with their lines (matched, kept as typed, without a value, above the
  ceiling) and the skipped count, `bulkNotice` or none, `onChange`, `onAdd`,
  `onClose`; a `Drawer` with a `Textarea`, the line counter and a `List` of
  result rows
- **`GradingLevelPicker`** — `graders`, `selectedGraderId`, `levels` (each
  open, or closed with the card or the count that closes it), `selectedLevelId`,
  `highestDeclared`, `estimate` (cards × fee, the cover line or none, the
  total, the weeks) or none, `onSelectGrader`, `onSelectLevel`; a
  `SegmentedControl`, a `RadioCard` per level, the dark estimate `Card`, the
  upcharge `Alert`
- **`GradingReview`** — `summary` (cards, grader, level, weeks), `schedule`
  (name, set line, minimum grade, declared value, cover or none), `totals`
  (declared, fee, cover or none), `warnings` (per card: the reference above
  the ceiling, the level, the difference, the higher level's fee now) or
  none, `goodToKnow` (five), `consented`, `pending`, `error`, `onEdit`,
  `onConsent`, `onBook`, `onSaveForLater`
- **`GradingStatusRail`** — `stage` (one of Planned, Booked, Handed in,
  Sent, Graded, Back, Home), `ended` or none; a `Stepper` of seven `Step`s,
  the stage `progress`, earlier `completed`, later `upcoming`
- **`GradingOwnershipChip`** — `status` (the word and its tone) and `chip`
  (the word and its tone, or none on a closed submission); the two `Badge`s
  the status table pairs, drawn as one pair on every board
- **`GradingPickupCard`** — `code`, `items` (slabs, raw cards), `where`
  (shop, address), `open`, `due` (the lines and the total, or nothing),
  `bring` (an ID line naming the collector, the collector or the named
  person, or nothing)
- **`GradingNamedCollector`** — `named` (name, named at) or none, `pending`,
  `error`, `onSave`, `onChange`, `onRemove`; the field, Save, or the Named
  card with Change and Remove
- **`GradingGradeCards`** — `cards` (grade or none, label word, grader, name,
  cert or none, outcome badge or none, the ungraded code and note or none);
  one `Card` per card, the ungraded in the `error` tone
- **`GradingMoneyBlock`** — `lines` in order (fee as n × fee = total, cover,
  paid with method · instant · reference, moved up a level, waived, storage,
  refunded, paid out with its route, settled, due at the counter), `lead`
  (the settle lead when something is due, or none), `includes`, `footnote`;
  a `Card` of `Text` rows, the due row in the `warning` tone
- **`GradingUncollectedLadder`** — `rungs` (the reminder days, the storage
  day with the fee a card a month, the notice day with the posting date once
  posted and the 30 days), `readyOn`, `cardsHeld`, `vaultLine`; a `List` of
  three rungs, a passed rung marked

### `@grade10/ui` — existing, reused unchanged

`BookingLocationPicker`, `BookingSlotPicker`, `BookingDetailsForm`,
`BookingConfirmation` (`calendarHref` serves the calendar file, `manageHref`
is the submission address) and `BookingManageCard` from
`shared/ui/appointment-booking`. `BookingSteps` is not reused: it is pinned
to the diary's five steps, and the wizard's rail is three `Step`s.

### Composed in `packages/grading/frontend` — work in grade10

- **`WizardRail`** — three `Step`s The cards · The service · Book
- **`BatchLine`** — an `Alert` beside the picked day: the cut-off, the ship
  day, the next batch's dates, the estimate-runs-from line
- **`SubmissionList`** — the home's Your submissions, one `Card` per
  submission with `GradingOwnershipChip`
- **`SubmissionHistory`** — the History `List`: instant, event, by whom
- **`DocumentsList`** — the three documents with signed or issued instant,
  fingerprint, download
- **`VaultItCard`**, **`WhatNextCard`**, **`YourDataLine`** — the ready
  page's vault offer, the collected page's next steps and its retention line
- **`WithdrawCard`** — the changed-your-mind `Card` with the WhatsApp link
- **`CancelSubmissionDialog`**, the cancel-visit confirm is
  `BookingManageCard`'s own
- **`GraderStagesCard`** — the order, the stages in the grader's words with
  dates, the next stage, the running-late line

### Console blocks — existing, `@grade10/frontend-console`

`SectionHeader`, `Search`, `ChoiceList`, `Choice`, `Select`, `Figure`,
`Status`, `StatusBadge`, `Table`, `Row`, `Cell`, `At`, `Money`, `CursorPager`,
`Badge`, `Tabs`, `Tab`, `TabPanel`, `Panel`, `Notice`, `CheckList`, `Check`,
`EntryList`, `Entry`, `FormDialog`, `InfoDialog`, `MoneyField`, `PercentField`,
`NumberField`, `DateField`, `DateTimeField`, `TextField`, `NotesField`,
`SaveableField`, `FilePicker`, `MediaFrame`, `Thumbnail`, `Code`, `Button`,
`Link`, `Text`, `OperatorIdentity`, `keepRefusal`. A tile is a `Figure`; a
runbook is a `CheckList` of `Check`s, each with its button or its reason; a
photograph pair is two `MediaFrame`s. Nothing the console package lacks.

### New in `packages/grading/admin-frontend` — work in grade10

- **`QueuePanel`** — the seven `Choice`s with counts, the Today strip, the
  four tiles, the table with the badge column
- **`IntakeRunbook`** — the six `Check`s, the cards table with Present,
  Condition, the photograph pair, the level check and Refuse per row, Add a
  card and Paste a list, the fee `Panel`, the sign `Panel`, the check-in
  `Panel`
- **`RefuseCardDialog`** — the three reasons, the collector's-words field,
  the consequence `Notice`
- **`BatchesPanel`**, **`ShipBatchForm`**, **`ReestimateDialog`**,
  **`NewBatchDialog`**
- **`ReceivePanel`** — the manifest and invoice entry, the counters, the scan
  table, the exceptions `EntryList`, Save and Finish
- **`HandbackRunbook`** — the six `Check`s, the items table with Handed over
  and Vault instead per row, the sign `Panel`, the money `Panel`, the vault
  `Panel`, the photographs
- **`SubmissionPanel`** — the header chips, the pickup or drop-off block,
  the collector block with the WhatsApp templates, the four tabs;
  **`WaiveUpchargeDialog`**, **`PayoutDialog`**, **`WithdrawCardDialog`**,
  **`SettlementDialog`**, **`MintDialog`** on its tabs
- **`PostNoticeDialog`** — posting date and tracking
- **`SettingsPanel`** — one `SaveableField` per row, the fee sheet and the
  diary services as their own tables, the second-person dialog on a money row
- **The status word** — every panel prints the collector's word for a
  status, never the raw id, and the badge column the queue's ten words

### Letters — work in grade10 and in this store

`GradingLetter`, `FiguresTable`, `CardLines`, `PickupBlock`, `SubmissionLine`
and `GradingFooter` in `packages/grading/backend/src/email`, one letter per
kind in `notify/vocabulary.ts`; the same six components and the seventeen
preview letters under `apps/emails/emails/grading/`, with a fixture
submission (`5TW8HN`). `FiguresTable` and `PrimaryCta` already exist for the
vault's letters — ❓ whether they move to `apps/emails/emails/_components`
or are copied is the tech design's.

### Words — work in `packages/i18n`

Every key below is answered in `shared/` for every language it speaks, in
the new `grading` namespace; the words are not written here.

- **`grading.home.*`** — the lead, howItWorks (four), priceSheet (lead,
  aboveTop, bulkLine, columns, coverLine), start, bookWithoutList, signIn,
  submissions (title, empty, open, closed), lostLink
- **`grading.plan.*`** — step (three), aboutYou (fields, signedInLine,
  emailLine), card (matched, keptAsTyped, edit, remove, declaredValue,
  referenceSales, referenceNote, minimumGrade, noValue, aboveCeiling,
  referenceUnavailable), add, paste, capNotice, overTwenty, overCap,
  continueWithCount, finishLater, finishLaterEmail; pasteSheet (lead,
  yourList, linesRead, matched, keptAsTyped, withoutValue, aboveCeiling,
  skipped, bulkNotice, add, goBack); service (lead, highestDeclared, grader,
  level (open, closedByValue, closedByCount, bulkOnly, allClosed, coverLine,
  backIn), estimate (title, perCard, coverPerCard, paidAtCounter, includes),
  upchargeNotice); review (title, header, backIn, edit, schedule, totals
  (declared, fee, cover), warning (line, nowLine), goodToKnow (five),
  consent, book, saveForLater, expired)
- **`grading.dropoff.*`** — lead, bulkLead, shop (durations, moreShops,
  joinsExisting), batchLine (before, after, estimateFrom), moveOrCancel,
  book, joined, resized; booked (title, emailLine, calendar, move, cancel,
  beforeYouCome (four), openTheList, vaultLine, bulkDuration)
- **`grading.submission.*`** — status (ten words), chip (waitingOnYou,
  withUs, withGrader, runningLate, dropoff, collected, onTheirWayBack),
  stage (seven), lead per status, outcome (fourteen badges), exception
  (each fact's line), visit (booked, missed, bookAgain), edit, cancel (line,
  dialogTitle, dialogBody, confirm, back), cancelled, expired, paid,
  withdraw (title, body, whatsapp, closed), grader (order, readMostDays,
  stages, nextStage, runningLate), grades (headline, settle (title, body,
  payAtCounter, nothingToDo, reference), ungraded (title, body, codesLink),
  aboutGrades), pickup (title, items, where, open, toSettle, bring
  (aboveThreshold, named, none)), named (lead, field, placeholder, save,
  badge, namedAt, line, change, remove), vaultIt (title, body, howItWorks),
  money (every line label, includes, footnote), ladder (reminders, storage,
  notice, afterNotice, closing), collected (lead, record, lookUp,
  photographs, documents, whatNext (vault, auction, yourData)), history
  (title, events), notFound, loading, error
- **`grading.ceremony.*`** — the `RefusalWords` entry per
  `DocSignFailureCode`, yourName (label, hint, hintNamed), postalAddress
  (label, hint), sign, decline, afterAgreement, afterReceipt, sealed
  (download, emailed), declined
- **`grading.console.*`** — the WhatsApp templates (seven), and nothing
  else: the console's own words stay the console's English

## States

### Grading home

| State | Shows | Anchor |
| --- | --- | --- |
| Loading | `home.loading`; no list · `grading-plan-grading-home--loading` | `grade10-site-grading-submission-plan-US-06` |
| Signed out (`G16`) | the lead, the four-step How it works, `GradingFeeSheet`, Start a submission, Book a drop-off without a list, Sign in in the header · `grading-plan-grading-home--signed-out` | `grade10-site-grading-submission-plan-US-01` |
| Signed in (`G01`) | the account line; Your submissions as one `Card` per submission with the summary, the status word, the chip and the id; What it costs below · `grading-plan-grading-home--signed-in` | `grade10-site-grading-submission-plan-US-06` |
| Signed in, none | `EmptyState` under Your submissions; Start a submission · `grading-plan-grading-home--signed-in-empty` | `grade10-site-grading-submission-plan-US-06` |
| Sign in, link sent | the same-email, no-password line after the address is given · `grading-plan-grading-home--sign-in-sent` | `grade10-site-grading-submission-plan-US-06` |
| Fee sheet, one grader | the level rows: ceiling, cards a submission, fee, weeks; the example-fees lead; the above-the-top and Bulk lines · `blocks-grading-submission-gradingfeesheet--default` | `grade10-site-grading-submission-plan-US-01` |
| Fee sheet, cover column | Express and Super Express rows carry the cover rate · `blocks-grading-submission-gradingfeesheet--with-cover` | `grade10-site-grading-submission-plan-US-01` |
| Fee sheet, three graders | a `SegmentedControl` per grader over its own sheet · `blocks-grading-submission-gradingfeesheet--three-graders` | `grade10-site-grading-submission-plan-US-01` |
| Error | the message in the error tone; no list · `grading-plan-grading-home--error` | `grade10-site-grading-submission-plan-US-06` |

### Plan wizard — the cards

| State | Shows | Anchor |
| --- | --- | --- |
| Rail | `WizardRail`: The cards `progress`, The service and Book `upcoming` · `grading-plan-plan-wizard--cards` | `grade10-site-grading-submission-plan-US-02` |
| About you, signed in (`G02`) | name, email, phone prefilled; the change-for-this-submission line · `grading-plan-plan-wizard--about-you-signed-in` | `grade10-site-grading-submission-plan-US-02` |
| About you, signed out | empty fields; the emailed-link line under the email · `grading-plan-plan-wizard--about-you-signed-out` | `grade10-site-grading-submission-plan-US-06` |
| Empty list | no card; Add a card and Paste a list; Continue disabled · `blocks-grading-submission-gradingcardlist--empty` | `grade10-site-grading-submission-plan-US-02` |
| Card search | `Autocomplete` over the reference as the name is typed; a miss keeps the name · `blocks-grading-submission-gradingcardlist--searching` | `grade10-site-grading-submission-plan-US-02` |
| Card, matched (`G02`) | the set · number · matched line; Edit and remove; the declared value; the three reference sales with the reference note · `blocks-grading-submission-gradingcardlist--default` | `grade10-site-grading-submission-plan-US-02` |
| Card, kept as typed | the name as typed; no reference row · `blocks-grading-submission-gradingcardlist--kept-as-typed` | `grade10-site-grading-submission-plan-US-03` |
| Card, no value | the declared value asked for on the card; Continue disabled naming the count · `blocks-grading-submission-gradingcardlist--no-value` | `grade10-site-grading-submission-plan-US-03` |
| Card, minimum grade | the caption: only encapsulate at PSA 9 or above, the fee applies either way · `blocks-grading-submission-gradingcardlist--minimum-grade` | `grade10-site-grading-submission-plan-US-02` |
| Card, above Bulk's ceiling | more than 20 cards and the card above Bulk's ceiling: the line naming a second submission on the same drop-off · `blocks-grading-submission-gradingcardlist--above-ceiling` | `grade10-site-grading-submission-plan-US-04` |
| Reference out of reach | every card kept as typed with the reason; the value still asked for · `blocks-grading-submission-gradingcardlist--reference-unavailable` | `grade10-site-grading-submission-plan-US-03` |
| Cap notice (`G02`) | one grader at one level; 20 from Value to Super Express, 100 at Bulk; the second-submission line · `blocks-grading-submission-gradingcardlist--cap-notice` | `grade10-site-grading-submission-plan-US-04` |
| More than 20 | the notice reads Bulk is the only level open at the next step · `blocks-grading-submission-gradingcardlist--over-twenty` | `grade10-site-grading-submission-plan-US-04` |
| Over the cap | the 101st card refused with the second-submission-another-day line · `blocks-grading-submission-gradingcardlist--over-cap` | `grade10-site-grading-submission-plan-US-04` |
| Continue | the count on the button · `grading-plan-plan-wizard--continue` | `grade10-site-grading-submission-plan-US-02` |
| Finish later | the plan kept; the emailed-link line · `grading-plan-plan-wizard--finish-later` | `grade10-site-grading-submission-plan-US-06` |
| Finish later, no email | the email asked for before the plan is kept · `grading-plan-plan-wizard--finish-later-no-email` | `grade10-site-grading-submission-plan-US-06` |

### Paste a list

| State | Shows | Anchor |
| --- | --- | --- |
| Open (`G17`) | `Drawer`: the lead, Your list `Textarea`, the lines-read counter; Add n cards, Go back · `blocks-grading-submission-gradingpastesheet--default` | `grade10-site-grading-submission-plan-US-03` |
| Nothing read | the empty `Textarea`; Add disabled · `blocks-grading-submission-gradingpastesheet--empty` | `grade10-site-grading-submission-plan-US-03` |
| Matching | the counter reads matching; Add disabled · `blocks-grading-submission-gradingpastesheet--matching` | `grade10-site-grading-submission-plan-US-03` |
| Matched | the row with the count and the references-show line · `blocks-grading-submission-gradingpastesheet--matched` | `grade10-site-grading-submission-plan-US-03` |
| Kept as typed | the row naming each line kept · `blocks-grading-submission-gradingpastesheet--kept-as-typed` | `grade10-site-grading-submission-plan-US-03` |
| Without a value | the row naming each line; the list asks for it before Continue · `blocks-grading-submission-gradingpastesheet--without-value` | `grade10-site-grading-submission-plan-US-03` |
| Above the ceiling | the row naming the card and its value, and the second-submission line · `blocks-grading-submission-gradingpastesheet--above-ceiling` | `grade10-site-grading-submission-plan-US-04` |
| Skipped | a line naming a listed card: the skipped count · `blocks-grading-submission-gradingpastesheet--skipped` | `grade10-site-grading-submission-plan-US-03` |
| Bulk notice | more than 20 lines: Bulk the only level, its fee, ceiling, weeks, the longer drop-off, up to 100 · `blocks-grading-submission-gradingpastesheet--bulk` | `grade10-site-grading-submission-plan-US-04` |
| Reference out of reach | every line kept as typed with the reason; Add enabled · `blocks-grading-submission-gradingpastesheet--reference-unavailable` | `grade10-site-grading-submission-plan-US-03` |

### Plan wizard — the service

| State | Shows | Anchor |
| --- | --- | --- |
| Grader (`G03`) | `SegmentedControl` PSA · CGC · BGS; the highest-declared line · `blocks-grading-submission-gradinglevelpicker--default` | `grade10-site-grading-submission-plan-US-05` |
| Level open | `RadioCard`: the name, value up to, fee a card, back in about · `blocks-grading-submission-gradinglevelpicker--open` | `grade10-site-grading-submission-plan-US-05` |
| Level open, cover | the cover line on Express and Super Express · `blocks-grading-submission-gradinglevelpicker--with-cover` | `grade10-site-grading-submission-plan-US-05` |
| Level closed by a value | greyed: Not available, the card declared above the ceiling · `blocks-grading-submission-gradinglevelpicker--closed-by-value` | `grade10-site-grading-submission-plan-US-05` |
| Level closed by a count | Bulk greyed: Not available, Bulk starts at 20 and you have n · `blocks-grading-submission-gradinglevelpicker--closed-by-count` | `grade10-site-grading-submission-plan-US-05` |
| Bulk only | more than 20 cards: every other level closed by the count, Bulk open · `blocks-grading-submission-gradinglevelpicker--bulk-only` | `grade10-site-grading-submission-plan-US-04` |
| Every level closed | a card above the top ceiling: the ask-at-the-counter line; Continue disabled · `blocks-grading-submission-gradinglevelpicker--all-closed` | `grade10-site-grading-submission-plan-US-05` |
| No level picked | no estimate; Continue disabled · `blocks-grading-submission-gradinglevelpicker--none-picked` | `grade10-site-grading-submission-plan-US-05` |
| Estimate | the dark `Card`: the total, n × fee · level · weeks, the paid-at-the-counter line, includes · `blocks-grading-submission-gradinglevelpicker--estimate` | `grade10-site-grading-submission-plan-US-05` |
| Estimate with cover | the cover line per card under the fee and the total with it · `blocks-grading-submission-gradinglevelpicker--estimate-with-cover` | `grade10-site-grading-submission-plan-US-05` |
| Upcharge notice (`G03`) | the `Alert`: moved up a level, the difference passed on, told before collection · `blocks-grading-submission-gradinglevelpicker--upcharge-notice` | `grade10-site-grading-submission-plan-US-07` |
| Grader with example figures | CGC or BGS: the levels as data with the example-fees line · `blocks-grading-submission-gradinglevelpicker--example-figures` | `grade10-site-grading-submission-plan-US-05` |
| Rail | The cards `completed`, The service `progress` · `grading-plan-plan-wizard--service` | `grade10-site-grading-submission-plan-US-05` |

### Plan wizard — book

| State | Shows | Anchor |
| --- | --- | --- |
| Review (`G04`) | the header `Card` n cards to grader · level, back in about, Edit; the schedule; the totals; Good to know; the consent tick; Book the drop-off, Save and book later · `blocks-grading-submission-gradingreview--default` | `grade10-site-grading-submission-plan-US-07` |
| Totals with cover | the cover line under the fee, per card and in total · `blocks-grading-submission-gradingreview--with-cover` | `grade10-site-grading-submission-plan-US-07` |
| Minimum grade on the schedule | the min line beside the card · `blocks-grading-submission-gradingreview--minimum-grade` | `grade10-site-grading-submission-plan-US-02` |
| Upcharge warning | per card: the PSA 10 reference above the ceiling, the level the grader moves it to, the difference due before collection, the higher level's fee now · `blocks-grading-submission-gradingreview--upcharge-warning` | `grade10-site-grading-submission-plan-US-07` |
| No warning | no card above the ceiling: the block absent · `blocks-grading-submission-gradingreview--no-warning` | `grade10-site-grading-submission-plan-US-07` |
| Good to know | the five lines in order · `blocks-grading-submission-gradingreview--good-to-know` | `grade10-site-grading-submission-plan-US-07` |
| Consent unticked | Book the drop-off disabled until the statement is ticked · `blocks-grading-submission-gradingreview--consent-unticked` | `grade10-site-grading-submission-plan-US-07` |
| Booking | Book pending; both buttons disabled · `blocks-grading-submission-gradingreview--pending` | `grade10-site-grading-submission-plan-US-07` |
| Saved for later | the plan kept; the page opens at Planned · `grading-plan-plan-wizard--saved` | `grade10-site-grading-submission-plan-US-06` |
| Plan expired meanwhile | the refusal by name; Start again · `blocks-grading-submission-gradingreview--expired` | `grade10-site-grading-submission-plan-US-08` |
| Rail | The cards and The service `completed`, Book `progress` · `grading-plan-plan-wizard--book` | `grade10-site-grading-submission-plan-US-07` |

### Book the drop-off

| State | Shows | Anchor |
| --- | --- | --- |
| Lead (`G05`) | bring the n cards; about 20 minutes; nothing paid until each card is checked and signed · `grading-dropoff-dropoff-booking--default` | `grade10-site-grading-dropoff-booking-US-01` |
| Bulk lead | 20 or more: the longer visit, about 45 minutes · `grading-dropoff-dropoff-booking--bulk` | `grade10-site-grading-dropoff-booking-US-06` |
| Shop | `BookingLocationPicker`: one shop with the address and the two durations; the more-shops line; the already-booked line · `grading-dropoff-dropoff-booking--shop` | `grade10-site-grading-dropoff-booking-US-01` |
| Days | `BookingSlotPicker` within the service's horizon; a day with nothing free disabled; a day past the horizon disabled · `grading-dropoff-dropoff-booking--days` | `grade10-site-grading-dropoff-booking-US-01` |
| Batch line | `BatchLine` beside the picked day: hand in by the cut-off and the cards leave the next day; the estimate runs from the ship day · `grading-dropoff-dropoff-booking--batch-line` | `grade10-site-grading-dropoff-booking-US-01` |
| Batch line, past the cut-off | a day after the week's cut-off: the next batch's close and ship days · `grading-dropoff-dropoff-booking--next-batch` | `grade10-site-grading-dropoff-booking-US-01` |
| Times | the day's times in the shop's zone; Book <day, time> · `grading-dropoff-dropoff-booking--times` | `grade10-site-grading-dropoff-booking-US-01` |
| Nothing free | `dropoff.nothingFree`; no times · `grading-dropoff-dropoff-booking--nothing-free` | `grade10-site-grading-dropoff-booking-US-01` |
| Time taken | the refusal by name; the times read again · `grading-dropoff-dropoff-booking--time-taken` | `grade10-site-grading-dropoff-booking-US-01` |
| Loading | the shop and the days as `Skeleton` · `grading-dropoff-dropoff-booking--loading` | `grade10-site-grading-dropoff-booking-US-01` |
| Error | the diary's failure in the error tone; no day reads as free · `grading-dropoff-dropoff-booking--error` | `grade10-site-grading-dropoff-booking-US-01` |
| Move or cancel line (`G05`) | the notice: any time before it starts; a missed visit closes the visit, not the list · `grading-dropoff-dropoff-booking--rules` | `grade10-site-grading-dropoff-booking-US-02` |
| Joins a visit | a drop-off already booked under the email: the second submission listed under its day and time; no picker · `grading-dropoff-dropoff-booking--joins-existing` | `grade10-site-grading-dropoff-booking-US-04` |
| Slot resized | two lists passing 20 together: the longer service named · `grading-dropoff-dropoff-booking--resized` | `grade10-site-grading-dropoff-booking-US-04` |
| Walk-in | `/book`: the Grading visit listed; `BookingDetailsForm` with name and email; no list · none of this change's stories | `grade10-site-grading-dropoff-booking-US-05` |

### Drop-off booked

| State | Shows | Anchor |
| --- | --- | --- |
| Booked (`G06`) | `BookingConfirmation` day, time, shop, address, Add to calendar; Move, Cancel; the email line; Before you come, four items; Open the list · `grading-dropoff-dropoff-booked--default` | `grade10-site-grading-dropoff-booking-US-01` |
| Bulk | the visit takes about 45 minutes · `grading-dropoff-dropoff-booked--bulk` | `grade10-site-grading-dropoff-booking-US-06` |
| Fee with cover | item 3 names the fee and the cover line · `grading-dropoff-dropoff-booked--with-cover` | `grade10-site-grading-dropoff-booking-US-01` |
| The day the cards leave | item 4: the ship day when handed in by the cut-off, the estimated day back · `grading-dropoff-dropoff-booked--batch-item` | `grade10-site-grading-dropoff-booking-US-01` |
| Vault line | the vault-on-the-same-visit `Alert` · `grading-dropoff-dropoff-booked--vault-line` | `grade10-site-grading-dropoff-booking-US-01` |
| Joined | the second submission: the visit the first one owns, named · `grading-dropoff-dropoff-booked--joined` | `grade10-site-grading-dropoff-booking-US-04` |
| Moved | the new day and time; the moved email line · `grading-dropoff-dropoff-booked--moved` | `grade10-site-grading-dropoff-booking-US-02` |

### Submission page

| State | Shows | Anchor |
| --- | --- | --- |
| Loading | `submission.loading`; nothing else · `grading-submission-submission-page--loading` | `grade10-site-grading-submission-lifecycle-US-01` |
| Not found | the site's not-found copy; a link naming nothing the same · `grading-submission-submission-page--not-found` | `grade10-site-grading-submission-lifecycle-US-01` |
| Header | n cards to grader · level, Submission id, planned on; `GradingOwnershipChip`; `GradingStatusRail` · `grading-submission-submission-page--header` | `grade10-site-grading-submission-lifecycle-US-01` |
| Rail, one per stage | seven `Step`s Planned → Home; the status's stage `progress`, earlier `completed`, later `upcoming` · `blocks-grading-submission-gradingstatusrail--planned` through `--home` | `grade10-site-grading-submission-lifecycle-US-01` |
| Rail, ended | the stage the submission ended at stays `progress`; the word says the ending · `blocks-grading-submission-gradingstatusrail--ended` | `grade10-site-grading-submission-lifecycle-US-10` |
| Chip: Waiting on you | Not handed in yet, Ready to collect · `blocks-grading-submission-gradingownershipchip--waiting-on-you` | `grade10-site-grading-submission-lifecycle-US-01` |
| Chip: Drop-off | Drop-off booked with the visit's day · `blocks-grading-submission-gradingownershipchip--dropoff` | `grade10-site-grading-dropoff-booking-US-01` |
| Chip: With us | Handed in, Back at the shop · `blocks-grading-submission-gradingownershipchip--with-us` | `grade10-site-grading-submission-lifecycle-US-01` |
| Chip: With the grader | With the grader, the grader named · `blocks-grading-submission-gradingownershipchip--with-grader` | `grade10-site-grading-submission-lifecycle-US-01` |
| Chip: Running late | past the estimate, the grader named · `blocks-grading-submission-gradingownershipchip--running-late` | `grade10-site-grading-submission-lifecycle-US-01` |
| Chip: On their way back | Grades are in · `blocks-grading-submission-gradingownershipchip--on-their-way-back` | `grade10-site-grading-submission-lifecycle-US-01` |
| Chip: Collected | Back with you and the date · `blocks-grading-submission-gradingownershipchip--collected` | `grade10-site-grading-submission-lifecycle-US-09` |
| Chip: none | Cancelled, Expired: the word alone · `blocks-grading-submission-gradingownershipchip--closed` | `grade10-site-grading-submission-lifecycle-US-10` |
| Planned | Not handed in yet · Waiting on you; the estimate; Book the drop-off; Edit the list; `GradingCardRecord` without intake ids; `GradingMoneyBlock` at the estimate; the kept-until line; History; Cancel this submission · `grading-submission-submission-page--planned` | `grade10-site-grading-submission-plan-US-06` |
| Nudged | the kept-until line reads the expiry day · `grading-submission-submission-page--nudged` | `grade10-site-grading-submission-plan-US-08` |
| Expired | Expired; the rail ended at Planned; nothing paid, nothing owed; Start a submission · `grading-submission-submission-page--expired` | `grade10-site-grading-submission-plan-US-08` |
| Booked (`G07`) | Drop-off booked · Drop-off <day>; the lead; Edit the list; `BookingManageCard` with Add to calendar, Move, Cancel visit and the day-before line; the cards; the money block; History; Cancel this submission · `grading-submission-submission-page--booked` | `grade10-site-grading-dropoff-booking-US-01` |
| Booked, joined | the visit card names the submission that owns it · `grading-submission-submission-page--booked-joined` | `grade10-site-grading-dropoff-booking-US-04` |
| Move | the picker on the page; the batch line reads again · `grading-submission-submission-page--move` | `grade10-site-grading-dropoff-booking-US-02` |
| Cancel visit | `BookingManageCard`'s confirm: the visit closes, the list stays · `grading-submission-submission-page--cancel-visit` | `grade10-site-grading-dropoff-booking-US-02` |
| Visit missed | Drop-off booked with the visit closed; chip Waiting on you; the list and the estimate as they were; Book another drop-off · `grading-submission-submission-page--visit-missed` | `grade10-site-grading-dropoff-booking-US-03` |
| Cancel this submission | the button with its line; `CancelSubmissionDialog` naming the drop-off it cancels; Yes, cancel and Go back · `grading-submission-submission-page--cancel-submission` | `grade10-site-grading-submission-lifecycle-US-10` |
| Cancelled | Cancelled; the rail ended; the cards never left, nothing paid; Start a submission · `grading-submission-submission-page--cancelled` | `grade10-site-grading-submission-lifecycle-US-10` |
| Handed in (`G08`) | Checked in · With us; the lead with the cut-off and the ship day; the estimate; the paid `Card` with the POS reference; `WithdrawCard`; `GradingCardRecord` with intake ids and photograph pairs; `DocumentsList` with the agreement and the intake receipt; History · `grading-submission-submission-page--checked-in` | `grade10-site-grading-submission-lifecycle-US-01` |
| Refused card | the card's Refused badge and the staff's words as typed; the list and the fee dropped · `grading-submission-submission-page--refused-card` | `grade10-site-grading-collector-notifications-US-02` |
| Withdrawn card | the card's Withdrawn badge with the refund line; the estimate dropped · `grading-submission-submission-page--withdrawn-card` | `grade10-site-grading-submission-lifecycle-US-02` |
| Batch closed | `WithdrawCard` gone once the batch closed · `grading-submission-submission-page--batch-closed` | `grade10-site-grading-submission-lifecycle-US-02` |
| With the grader (`G09`) | With the grader · With PSA; the lead; `GraderStagesCard`; Nothing to do; the cards with intake ids; History · `grading-submission-submission-page--sent` | `grade10-site-grading-submission-lifecycle-US-01` |
| Running late | chip Running late · with PSA; the new date with the stage; the emailed-the-day-we-set-it line · `grading-submission-submission-page--running-late` | `grade10-site-grading-submission-lifecycle-US-01` |
| Grades in (`G10`) | Grades are in · On their way back; the headline; `GradingGradeCards`; `GradingMoneyBlock` with the settle lead; About the ungraded card; About the grades; the cards; History · `grading-submission-submission-page--graded` | `grade10-site-grading-submission-lifecycle-US-01` |
| Back, being checked | Back at the shop, being checked · With us; the arrived line; nothing to do · `grading-submission-submission-page--returned` | `grade10-site-grading-submission-lifecycle-US-01` |
| Ready (`G11`) | Ready to collect · Waiting on you; `GradingPickupCard`; `GradingNamedCollector`; `VaultItCard`; the cards; `GradingMoneyBlock`; `GradingUncollectedLadder`; History · `grading-submission-submission-page--ready` | `grade10-site-grading-submission-lifecycle-US-06` |
| Ready, one card held | the held card's badge with the grader's date; the receipt-names-it line · `grading-submission-submission-page--card-held` | `grade10-site-grading-submission-lifecycle-US-01` |
| Not returned | the card's badge with the payout at declared value, the fee refunded, the window · `grading-submission-submission-page--not-returned` | `grade10-site-grading-submission-lifecycle-US-05` |
| Damaged | the same with Damaged · `grading-submission-submission-page--damaged` | `grade10-site-grading-submission-lifecycle-US-05` |
| Payout reversed | the card back with the reversal line · `grading-submission-submission-page--payout-reversed` | `grade10-site-grading-submission-lifecycle-US-05` |
| Storage accruing | the money block's storage line and the ladder's rung reached · `grading-submission-submission-page--storage-accruing` | `grade10-site-grading-submission-lifecycle-US-08` |
| Notice posted | the ladder's notice rung with the posting date and the 30 days · `grading-submission-submission-page--notice-posted` | `grade10-site-grading-submission-lifecycle-US-08` |
| Collected (`G12`) | Back with you · Collected <date>; the lead; the graded record with Look up per slab; the slab photographs; `DocumentsList` with the three; `WhatNextCard`; `YourDataLine` · `grading-submission-submission-page--collected` | `grade10-site-grading-submission-lifecycle-US-09` |
| Collected, one card still out | the record with the card held and the second-hand-back line · `grading-submission-submission-page--collected-card-out` | `grade10-site-grading-submission-lifecycle-US-09` |
| Vaulted slab | the card's Vaulted badge linking the case · `grading-submission-submission-page--vaulted` | `grade10-site-grading-submission-lifecycle-US-06` |
| Acts by status | only the status's acts on the page; nothing from Sent to Back · `grading-submission-submission-page--acts` | `grade10-site-grading-submission-lifecycle-US-11` |
| Erasure refused | Your data: the ask refused by name while the submission is live · `grading-submission-submission-page--erasure-refused` | `grade10-site-vault-retention-and-erasure-US-04` |
| Error | the message in the error tone; the page reads again · `grading-submission-submission-page--error` | `grade10-site-grading-submission-lifecycle-US-01` |

### Cards on the submission page

| State | Shows | Anchor |
| --- | --- | --- |
| Listed | number, name, set line, declared value; no intake id · `blocks-grading-submission-gradingcardrecord--listed` | `grade10-site-grading-submission-lifecycle-US-01` |
| Handed in (`G08`) | intake id; the photograph pair, front and back · `blocks-grading-submission-gradingcardrecord--handed-in` | `grade10-site-grading-submission-lifecycle-US-01` |
| Minimum grade | the min line on the set line · `blocks-grading-submission-gradingcardrecord--minimum-grade` | `grade10-site-grading-submission-lifecycle-US-03` |
| Refused at the counter | the badge and the reason as typed; never charged · `blocks-grading-submission-gradingcardrecord--refused` | `grade10-site-grading-collector-notifications-US-02` |
| Withdrawn | the badge and the refund line · `blocks-grading-submission-gradingcardrecord--withdrawn` | `grade10-site-grading-submission-lifecycle-US-02` |
| Graded (`G10`) | the grade badge in the grader's words and the cert · `blocks-grading-submission-gradingcardrecord--graded` | `grade10-site-grading-submission-lifecycle-US-01` |
| Moved up a level | the badge and the difference due · `blocks-grading-submission-gradingcardrecord--moved-up` | `grade10-site-grading-submission-lifecycle-US-04` |
| Ungraded | the badge with the code and the note; the fee stands · `blocks-grading-submission-gradingcardrecord--ungraded` | `grade10-site-grading-submission-lifecycle-US-03` |
| Minimum grade not met | the badge; raw; the fee stands · `blocks-grading-submission-gradingcardrecord--minimum-not-met` | `grade10-site-grading-submission-lifecycle-US-03` |
| Held by the grader | the badge with the expected date · `blocks-grading-submission-gradingcardrecord--held` | `grade10-site-grading-submission-lifecycle-US-01` |
| Not returned | the badge with the payout line · `blocks-grading-submission-gradingcardrecord--not-returned` | `grade10-site-grading-submission-lifecycle-US-05` |
| Damaged | the badge with the payout line · `blocks-grading-submission-gradingcardrecord--damaged` | `grade10-site-grading-submission-lifecycle-US-05` |
| Collected (`G12`) | the record: grade, grader, cert, Look up; the slab photograph · `blocks-grading-submission-gradingcardrecord--collected` | `grade10-site-grading-submission-lifecycle-US-09` |
| Vaulted | the badge linking the case · `blocks-grading-submission-gradingcardrecord--vaulted` | `grade10-site-grading-submission-lifecycle-US-06` |
| Grade card (`G10`) | the number, the label word, the grader, the name, the cert · `blocks-grading-submission-gradinggradecards--default` | `grade10-site-grading-submission-lifecycle-US-01` |
| Grade card, moved up | the Moved up a level badge · `blocks-grading-submission-gradinggradecards--moved-up` | `grade10-site-grading-submission-lifecycle-US-04` |
| Grade card, ungraded | the `error` card: the code, Returned ungraded, the note · `blocks-grading-submission-gradinggradecards--ungraded` | `grade10-site-grading-submission-lifecycle-US-03` |
| Grade card, minimum not met | the grade and the badge; raw · `blocks-grading-submission-gradinggradecards--minimum-not-met` | `grade10-site-grading-submission-lifecycle-US-03` |
| Grade card, held | no grade; the badge and the date · `blocks-grading-submission-gradinggradecards--held` | `grade10-site-grading-submission-lifecycle-US-01` |
| Grade card, not returned | no grade; the badge · `blocks-grading-submission-gradinggradecards--not-returned` | `grade10-site-grading-submission-lifecycle-US-05` |

### Pickup, the named person and the ladder

| State | Shows | Anchor |
| --- | --- | --- |
| Pickup, above the threshold (`G11`) | the code, the items, where, open, to settle, Bring an ID matching the name · `blocks-grading-submission-gradingpickupcard--default` | `grade10-site-grading-submission-lifecycle-US-06` |
| Pickup, below the threshold | Bring: nothing; the code and the name release the cards · `blocks-grading-submission-gradingpickupcard--below-threshold` | `grade10-site-grading-submission-lifecycle-US-06` |
| Pickup, someone named (`G18`) | Bring names an ID, yours or theirs · `blocks-grading-submission-gradingpickupcard--named` | `grade10-site-grading-submission-lifecycle-US-07` |
| Pickup, nothing due | To settle: nothing · `blocks-grading-submission-gradingpickupcard--nothing-due` | `grade10-site-grading-submission-lifecycle-US-06` |
| Pickup, storage due | To settle: the upcharge and the storage to the day · `blocks-grading-submission-gradingpickupcard--with-storage` | `grade10-site-grading-submission-lifecycle-US-08` |
| Nobody named (`G11`) | the lead; Their name with its placeholder; Save · `blocks-grading-submission-gradingnamedcollector--empty` | `grade10-site-grading-submission-lifecycle-US-07` |
| Name empty | Save disabled · `blocks-grading-submission-gradingnamedcollector--name-empty` | `grade10-site-grading-submission-lifecycle-US-07` |
| Saving | Save pending · `blocks-grading-submission-gradingnamedcollector--pending` | `grade10-site-grading-submission-lifecycle-US-07` |
| Named (`G18`) | the Named badge, `Avatar`, the name, named when, the one-person line; Change, Remove · `blocks-grading-submission-gradingnamedcollector--named` | `grade10-site-grading-submission-lifecycle-US-07` |
| Refused | the refusal by name under the field: already collected · `blocks-grading-submission-gradingnamedcollector--refused` | `grade10-site-grading-submission-lifecycle-US-07` |
| Ladder (`G11`) | the three rungs with their dates, none reached; the vault line · `blocks-grading-submission-gradinguncollectedladder--default` | `grade10-site-grading-submission-lifecycle-US-08` |
| Ladder, reminded | the reminder rung passed · `blocks-grading-submission-gradinguncollectedladder--reminded` | `grade10-site-grading-submission-lifecycle-US-08` |
| Ladder, storage | the storage rung reached; the fee accruing per card · `blocks-grading-submission-gradinguncollectedladder--storage` | `grade10-site-grading-submission-lifecycle-US-08` |
| Ladder, notice | the notice rung with the posting date and the 30 days; after it · `blocks-grading-submission-gradinguncollectedladder--notice` | `grade10-site-grading-submission-lifecycle-US-08` |
| Ladder, cards excluded | a card withdrawn, paid out or vaulted not counted · `blocks-grading-submission-gradinguncollectedladder--cards-excluded` | `grade10-site-grading-submission-lifecycle-US-08` |

### Money on the submission page

| State | Shows | Anchor |
| --- | --- | --- |
| Estimate (`G07`) | Fee n × fee = total; Paid: at the counter once checked; Includes; the ungraded and refused footnote · `blocks-grading-submission-gradingmoneyblock--estimate` | `grade10-site-grading-submission-plan-US-07` |
| Estimate with cover | the cover line under the fee · `blocks-grading-submission-gradingmoneyblock--with-cover` | `grade10-site-grading-submission-plan-US-07` |
| Paid (`G08`) | Paid: method · instant · POS reference · `blocks-grading-submission-gradingmoneyblock--paid` | `grade10-site-grading-submission-lifecycle-US-01` |
| Refunded | a refunded line, the way it was paid · `blocks-grading-submission-gradingmoneyblock--refunded` | `grade10-site-grading-submission-lifecycle-US-02` |
| Due (`G10`) | the settle lead; Moved up a level and the card; Due at the counter before collection · `blocks-grading-submission-gradingmoneyblock--due` | `grade10-site-grading-submission-lifecycle-US-04` |
| Waived | the upcharge waived; due nothing · `blocks-grading-submission-gradingmoneyblock--waived` | `grade10-admin-grading-counter-US-08` |
| Storage | the storage line, per card and per month, accruing · `blocks-grading-submission-gradingmoneyblock--storage` | `grade10-site-grading-submission-lifecycle-US-08` |
| Paid out | the payout at declared value and its route; the fee refunded beside it · `blocks-grading-submission-gradingmoneyblock--paid-out` | `grade10-site-grading-submission-lifecycle-US-05` |
| Settled (`G12`) | settled at collection with the POS reference; nothing due · `blocks-grading-submission-gradingmoneyblock--settled` | `grade10-site-grading-submission-lifecycle-US-09` |

### The documents on the iPad

| State | Shows | Anchor |
| --- | --- | --- |
| Agreement, signable (`G14`) | the ceremony chrome: the shop, the link timer, one document · the submission; the document: the parties, the schedule, seven clauses; Your name as on the booking; Postal address prefilled; draw or type; Sign; Decline · `grading-documents-sign-page--agreement` | `grade10-site-grading-counter-documents-US-01` |
| Agreement, cover schedule | the cover column per card and the cover in total · `grading-documents-sign-page--agreement-with-cover` | `grade10-site-grading-counter-documents-US-01` |
| Postal address empty | Sign disabled naming the line · `grading-documents-sign-page--address-empty` | `grade10-site-grading-counter-documents-US-01` |
| Pages not viewed | the refusal by name; the document scrolled to the end first · `grading-documents-sign-page--pages-not-viewed` | `grade10-site-grading-counter-documents-US-01` |
| Name mismatch | the refusal by name against the booking · `grading-documents-sign-page--name-mismatch` | `grade10-site-grading-counter-documents-US-01` |
| Declined | the declined outcome; nothing paid, nothing signed · `grading-documents-sign-page--declined` | `grade10-site-grading-counter-documents-US-02` |
| Sealed | the sealed outcome; the download; then the fee at the till · `grading-documents-sign-page--sealed` | `grade10-site-grading-counter-documents-US-05` |
| Link expired | the refusal by name: ask staff for a new link · `grading-documents-sign-page--expired` | `grade10-site-grading-counter-documents-US-01` |
| Already signed | the refusal by name; the sealed copy on the page · `grading-documents-sign-page--already-signed` | `grade10-site-grading-counter-documents-US-05` |
| Receipt, signable (`G15`) | handed back, settled, collected by, where and when; three clauses; the same signing block; the slabs-are-yours footer · `grading-documents-sign-page--receipt` | `grade10-site-grading-counter-documents-US-03` |
| Receipt, named person (`G18`) | Your name prefilled as named; the hint; the first clause names them — ❓ Legal words it · `grading-documents-sign-page--receipt-named` | `grade10-site-grading-counter-documents-US-04` |
| Receipt, ID matched | Collected by names the glance and that nothing was kept · `grading-documents-sign-page--receipt-id-matched` | `grade10-site-grading-counter-documents-US-03` |
| Receipt, card held | Handed back names the card still out · `grading-documents-sign-page--receipt-card-held` | `grade10-site-grading-counter-documents-US-03` |
| Receipt, vaulted slab | Handed back says the card went to the vault · `grading-documents-sign-page--receipt-vaulted` | `grade10-site-grading-counter-documents-US-03` |
| Receipt, withdrawn card | one card, its fee refunded · `grading-documents-sign-page--receipt-withdrawn` | `grade10-site-grading-submission-lifecycle-US-02` |
| Receipt, paid out | what was paid out and how · `grading-documents-sign-page--receipt-paid-out` | `grade10-site-grading-counter-documents-US-03` |
| Placeholders outside production | the brackets, marked · `grading-documents-sign-page--placeholders` | `grade10-site-grading-counter-documents-US-01` |

### Letters

| State | Shows | Anchor |
| --- | --- | --- |
| The plan's link (`M13`) | the blocks tabled above · `apps/emails/emails/grading/plan-saved.tsx` | `grade10-site-grading-submission-plan-US-06` |
| The nudge (`M13`) | the same letter on the nudge day · `plan-nudged.tsx` | `grade10-site-grading-submission-plan-US-08` |
| Expired (`M16`) | the blocks tabled above · `plan-expired.tsx` | `grade10-site-grading-submission-plan-US-08` |
| Drop-off booked (`M12`) | the blocks tabled above; the calendar file · `dropoff-booked.tsx` | `grade10-site-grading-collector-notifications-US-01` |
| Drop-off moved | the new visit; the calendar file · `dropoff-moved.tsx` | `grade10-site-grading-dropoff-booking-US-02` |
| Drop-off cancelled | the visit closed, the list kept · `dropoff-cancelled.tsx` | `grade10-site-grading-dropoff-booking-US-02` |
| Drop-off missed | the visit closed, the list and the estimate kept, the book-again line · `dropoff-missed.tsx` | `grade10-site-grading-dropoff-booking-US-03` |
| The day before | the visit and what to bring · `dropoff-reminder.tsx` | `grade10-site-grading-collector-notifications-US-01` |
| Handed in (`M07`) | the blocks tabled above; the receipt and the agreement attached · `checked-in.tsx` | `grade10-site-grading-collector-notifications-US-01` |
| Handed in, cover | the paid line names the cover · `checked-in-with-cover.tsx` | `grade10-site-grading-collector-notifications-US-01` |
| On their way (`M08`) | the blocks tabled above · `batch-shipped.tsx` | `grade10-site-grading-collector-notifications-US-01` |
| Running late (`M14`) | the blocks tabled above · `batch-reestimated.tsx` | `grade10-site-grading-collector-notifications-US-01` |
| Grades are in (`M09`) | the blocks tabled above with the settle and the ungraded paragraphs · `grades-posted.tsx` | `grade10-site-grading-submission-lifecycle-US-04` |
| Grades are in, nothing to settle | neither paragraph · `grades-posted-clean.tsx` | `grade10-site-grading-collector-notifications-US-01` |
| Not returned (`M15`) | the blocks tabled above · `card-not-returned.tsx` | `grade10-site-grading-submission-lifecycle-US-05` |
| Damaged | the same letter naming damage · `card-damaged.tsx` | `grade10-site-grading-submission-lifecycle-US-05` |
| Ready to collect (`M10`) | the blocks tabled above · `ready.tsx` | `grade10-site-grading-submission-lifecycle-US-06` |
| Ready, below the threshold | the someone-else paragraph without the ID line · `ready-below-threshold.tsx` | `grade10-site-grading-submission-lifecycle-US-06` |
| Still here (`M11`) | the blocks tabled above · `uncollected-reminder.tsx` | `grade10-site-grading-submission-lifecycle-US-08` |
| Storage fee (`M17`) | the blocks tabled above · `storage-started.tsx` | `grade10-site-grading-submission-lifecycle-US-08` |
| Written notice (`M18`) | the blocks tabled above · `notice-posted.tsx` | `grade10-site-grading-submission-lifecycle-US-08` |
| Hand-back receipt, collected | the receipt attached · `collected.tsx` | `grade10-site-grading-counter-documents-US-05` |
| Hand-back receipt, withdrawn | one card, the refund · `card-withdrawn.tsx` | `grade10-site-grading-submission-lifecycle-US-02` |
| Values set | `GradingFooter` prints the registered name, the shop address, the complaints contact · every preview | `grade10-site-grading-collector-notifications-US-01` |
| Values unset outside production | the brackets, marked · `footer-placeholders.tsx` | `grade10-site-grading-collector-notifications-US-01` |
| Silence on purpose | no letter for a refused card or a named collector · none | `grade10-site-grading-collector-notifications-US-02` |

### Queue

| State | Shows | Anchor |
| --- | --- | --- |
| Views (`GA1`) | seven `Choice`s with counts; newest touched first, 50 a page; `CursorPager` · `grading-admin-queue-queue-panel--default` | `grade10-admin-grading-counter-US-01` |
| Today strip | the day's drop-offs in slot order: time, collector, id, cards, grader; the pickups-walk-in line · `grading-admin-queue-queue-panel--today` | `grade10-admin-grading-counter-US-01` |
| Rows | id, collector, cards, grader · level, the status word, visit, last touched, waiting on · `grading-admin-queue-queue-panel--rows` | `grade10-admin-grading-counter-US-01` |
| Badge: Visit today | · `grading-admin-queue-queue-panel--badge-visit-today` | `grade10-admin-grading-counter-US-01` |
| Badge: Batch closes today | · `grading-admin-queue-queue-panel--badge-batch-closes` | `grade10-admin-grading-counter-US-01` |
| Badge: Due back | · `grading-admin-queue-queue-panel--badge-due-back` | `grade10-admin-grading-batches-US-04` |
| Badge: Running late | · `grading-admin-queue-queue-panel--badge-running-late` | `grade10-admin-grading-batches-US-04` |
| Badge: Upcharge to settle | · `grading-admin-queue-queue-panel--badge-upcharge` | `grade10-admin-grading-counter-US-10` |
| Badge: Ungraded card | · `grading-admin-queue-queue-panel--badge-ungraded` | `grade10-admin-grading-counter-US-10` |
| Badge: Unchecked return | after a day · `grading-admin-queue-queue-panel--badge-unchecked` | `grade10-admin-grading-batches-US-02` |
| Badge: Uncollected 30 d | · `grading-admin-queue-queue-panel--badge-uncollected` | `grade10-admin-grading-counter-US-12` |
| Badge: Storage fee from day 90 | · `grading-admin-queue-queue-panel--badge-storage` | `grade10-admin-grading-counter-US-12` |
| Badge: Notice due | the rung · `grading-admin-queue-queue-panel--badge-notice-due` | `grade10-admin-grading-counter-US-12` |
| Badge: Message not sent | a letter out of attempts; Send again on the row · `grading-admin-queue-queue-panel--badge-not-sent` | `grade10-site-grading-collector-notifications-US-03` |
| Tile: Batch closing | the grader · level, cards, submissions, more today, ships · `grading-admin-queue-queue-panel--tiles` | `grade10-admin-grading-batches-US-05` |
| Tile: With graders | the count and how many past their estimate · the same story | `grade10-admin-grading-batches-US-05` |
| Tile: Ready, uncollected | the count and how many past 30 days · the same story | `grade10-admin-grading-counter-US-12` |
| Tile: To settle | the sum and the count of upcharges · the same story | `grade10-admin-grading-counter-US-10` |
| Empty view | `EmptyState` in the view · `grading-admin-queue-queue-panel--empty` | `grade10-admin-grading-counter-US-01` |
| Loading | the console's async status line · `grading-admin-queue-queue-panel--loading` | `grade10-admin-grading-counter-US-01` |
| Error | the console's async status line, retry · `grading-admin-queue-queue-panel--error` | `grade10-admin-grading-counter-US-01` |
| Read grant | no row action past Open · `grading-admin-queue-queue-panel--read-only` | `grade10-admin-grading-counter-US-14` |

### Hand-in runbook

| State | Shows | Anchor |
| --- | --- | --- |
| Header (`GA2`) | the summary, the id, the status word, declared in total, the visit in progress at the desk; the drop-off card with Move, Cancel visit, Open in diary · `grading-admin-intake-intake-runbook--default` | `grade10-admin-grading-counter-US-02` |
| Visit not started | step 1 offers Start at the desk; the rest wait · `grading-admin-intake-intake-runbook--not-started` | `grade10-admin-grading-counter-US-02` |
| Walk-in | no list: the cards table empty with Add a card and Paste a list · `grading-admin-intake-intake-runbook--walk-in` | `grade10-admin-grading-counter-US-02` |
| Second submission on the visit | the other submission named under the visit; each runs its own runbook · `grading-admin-intake-intake-runbook--joined` | `grade10-site-grading-dropoff-booking-US-04` |
| Cards table | per row: the card, declared with its reference, Present, Condition, the level check, Refuse; the photograph pair · `grading-admin-intake-intake-runbook--cards` | `grade10-admin-grading-counter-US-02` |
| Card present | Present ticked; the photograph pair taken · `grading-admin-intake-intake-runbook--card-checked` | `grade10-admin-grading-counter-US-02` |
| Card, condition noted | the note as typed in place of Nothing noted · `grading-admin-intake-intake-runbook--condition-noted` | `grade10-admin-grading-counter-US-02` |
| Level check | every declared value inside the ceiling: the banner · `grading-admin-intake-intake-runbook--level-fits` | `grade10-admin-grading-counter-US-02` |
| Level check failed | a card above the ceiling: the row marked; move to a second submission or refuse · `grading-admin-intake-intake-runbook--level-exceeded` | `grade10-admin-grading-counter-US-03` |
| Card added | a card not on the list added with the collector · `grading-admin-intake-intake-runbook--card-added` | `grade10-admin-grading-counter-US-02` |
| Card refused | the row struck with the reason; the fee and the receipt drop · `grading-admin-intake-intake-runbook--card-refused` | `grade10-admin-grading-counter-US-03` |
| Fee (`GA2`) | cards × fee, the fee, declared in total, insured to · `grading-admin-intake-intake-runbook--fee` | `grade10-admin-grading-counter-US-02` |
| Fee with cover | the cover line per card and in total · `grading-admin-intake-intake-runbook--fee-with-cover` | `grade10-admin-grading-counter-US-02` |
| Sign, not mintable | a card unchecked: the reason on the step · `grading-admin-intake-intake-runbook--not-mintable` | `grade10-admin-grading-counter-US-11` |
| Sign, mintable | Show on iPad and Copy link; the 30-minute line · `grading-admin-intake-intake-runbook--mintable` | `grade10-admin-grading-counter-US-11` |
| Sign, link shown | the link and its timer · `grading-admin-intake-intake-runbook--link-shown` | `grade10-admin-grading-counter-US-11` |
| Sign, declined | the decline on the step; mint again · `grading-admin-intake-intake-runbook--declined` | `grade10-site-grading-counter-documents-US-02` |
| Sign, sealed | the seal's instant and fingerprint · `grading-admin-intake-intake-runbook--sealed` | `grade10-admin-grading-counter-US-02` |
| Mint refused in production | a fact unset: the refusal naming it · `grading-admin-intake-intake-runbook--mint-refused` | `grade10-admin-grading-counter-US-11` |
| Take payment, waiting | disabled until the agreement is sealed · `grading-admin-intake-intake-runbook--payment-waiting` | `grade10-admin-grading-counter-US-02` |
| Take payment | the till opens with one line per card and the cover lines · `grading-admin-intake-intake-runbook--payment` | `grade10-admin-grading-counter-US-02` |
| Paid | the order written back by line with its reference · `grading-admin-intake-intake-runbook--paid` | `grade10-admin-grading-counter-US-02` |
| Refused after payment | the line refunded at the till · `grading-admin-intake-intake-runbook--refunded-line` | `grade10-admin-grading-counter-US-03` |
| No paid line | check in refused: the submission stays booked, the seal stands, the cards go home; run the till again or rebook · `grading-admin-intake-intake-runbook--no-paid-line` | `grade10-admin-grading-counter-US-02` |
| Safe full | check in refused past the cap: the line and Book the next drop-off · `grading-admin-intake-intake-runbook--safe-full` | `grade10-admin-grading-batches-US-05` |
| Labels and check in | Print n labels and check in; the receipt email goes · `grading-admin-intake-intake-runbook--check-in` | `grade10-admin-grading-counter-US-02` |
| Checked in | the runbook closed; the submission at Handed in · `grading-admin-intake-intake-runbook--checked-in` | `grade10-admin-grading-counter-US-02` |
| Read grant | the runbook with no button · `grading-admin-intake-intake-runbook--read-only` | `grade10-admin-grading-counter-US-14` |
| Stale | an act refused because the submission moved; the page reads again · `grading-admin-intake-intake-runbook--stale` | `grade10-admin-grading-counter-US-14` |

### Refuse a card

| State | Shows | Anchor |
| --- | --- | --- |
| Open (`GA7`) | the card and the submission; three reasons; the collector's-words field with its hint; the consequence `Notice`; Keep it on the list, Refuse this card · `grading-admin-intake-refuse-card-dialog--default` | `grade10-admin-grading-counter-US-03` |
| Nothing picked | Refuse disabled until a reason and the words · `grading-admin-intake-refuse-card-dialog--incomplete` | `grade10-admin-grading-counter-US-03` |
| After payment | the `Notice` adds the refund line · `grading-admin-intake-refuse-card-dialog--after-payment` | `grade10-admin-grading-counter-US-03` |
| Last card | refusing the last card: the `Notice` says the submission has no card left — ❓ what the submission becomes, flagged below · `grading-admin-intake-refuse-card-dialog--last-card` | `grade10-admin-grading-counter-US-03` |
| Refusing | pending · `grading-admin-intake-refuse-card-dialog--pending` | `grade10-admin-grading-counter-US-03` |
| Refused by the worker | the refusal by name in the dialog · `grading-admin-intake-refuse-card-dialog--refused` | `grade10-admin-grading-counter-US-14` |

### Batches

| State | Shows | Anchor |
| --- | --- | --- |
| Tiles (`GA4`) | Ship today, With graders and how many past the estimate, Back unchecked, Declared value in the safe against its cap · `grading-admin-batches-batches-panel--default` | `grade10-admin-grading-batches-US-05` |
| Safe over the cap | the tile in the warning tone · `grading-admin-batches-batches-panel--over-cap` | `grade10-admin-grading-batches-US-05` |
| Row: open | building until the cut-off; Open · `grading-admin-batches-batches-panel--row-open` | `grade10-admin-grading-batches-US-01` |
| Row: closed, ships today | Closed Thu 19:00 · ships today; Ship · `grading-admin-batches-batches-panel--row-closed` | `grade10-admin-grading-batches-US-01` |
| Row: with the grader | the stage in its words; shipped and tracking; due back; Open · `grading-admin-batches-batches-panel--row-with-grader` | `grade10-admin-grading-batches-US-04` |
| Row: past the estimate | Due back in the warning tone; Re-estimate · `grading-admin-batches-batches-panel--row-late` | `grade10-admin-grading-batches-US-04` |
| Row: back, unchecked | Receive · `grading-admin-batches-batches-panel--row-back` | `grade10-admin-grading-batches-US-02` |
| Row: received | Closed with the received date; Open · `grading-admin-batches-batches-panel--row-received` | `grade10-admin-grading-batches-US-02` |
| Empty | no batch; New batch · `grading-admin-batches-batches-panel--empty` | `grade10-admin-grading-batches-US-01` |
| New batch | grader and level; a card that fits neither waits · `grading-admin-batches-batches-panel--new-batch` | `grade10-admin-grading-batches-US-01` |
| Ship form (`GA4`) | the checklist: packing list printed, the grader's form filled, insured to the declared total against the courier's cover; courier and tracking, order number, shipped on, estimated back; Mark as shipped · email n collectors · `grading-admin-batches-ship-batch-form--default` | `grade10-admin-grading-batches-US-01` |
| Above the courier's cover | the insured line in the warning tone; split or hold — ❓ Operations · `grading-admin-batches-ship-batch-form--over-cover` | `grade10-admin-grading-batches-US-01` |
| Shipped on in the future | refused on the field · `grading-admin-batches-ship-batch-form--future-date` | `grade10-admin-grading-batches-US-01` |
| Incomplete | Mark as shipped disabled naming the field · `grading-admin-batches-ship-batch-form--incomplete` | `grade10-admin-grading-batches-US-01` |
| Shipping | pending · `grading-admin-batches-ship-batch-form--pending` | `grade10-admin-grading-batches-US-01` |
| Shipped | every submission at Sent; the letters sent · `grading-admin-batches-ship-batch-form--shipped` | `grade10-admin-grading-batches-US-01` |
| Re-estimate | `ReestimateDialog`: the stage typed, the new date, the reason; emails every collector · `grading-admin-batches-batches-panel--reestimate` | `grade10-admin-grading-batches-US-04` |
| Stage typed | the morning read: the stage on the batch and every submission's timeline · `grading-admin-batches-batches-panel--stage` | `grade10-admin-grading-batches-US-04` |
| Read grant | no Ship, Re-estimate or Receive · `grading-admin-batches-batches-panel--read-only` | `grade10-admin-grading-counter-US-14` |

### Receive a batch

| State | Shows | Anchor |
| --- | --- | --- |
| Header (`GA5`) | the batch, grader · level, cards from submissions, shipped back, arrived; the progress · `grading-admin-receiving-receive-panel--default` | `grade10-admin-grading-batches-US-02` |
| Before the manifest | Scan disabled; Import the manifest and the invoice first · `grading-admin-receiving-receive-panel--no-manifest` | `grade10-admin-grading-batches-US-02` |
| Manifest entry | `FilePicker` or typed lines — ❓ Operations · `grading-admin-receiving-receive-panel--manifest-entry` | `grade10-admin-grading-batches-US-02` |
| Invoice entry | the invoice's lines and total · `grading-admin-receiving-receive-panel--invoice-entry` | `grade10-admin-grading-batches-US-02` |
| Unmatched manifest line | a line naming no intake id in the batch listed unmatched; Finish held · `grading-admin-receiving-receive-panel--unmatched-line` | `grade10-admin-grading-batches-US-02` |
| Counters | scanned of total, matched, ungraded, upcharges and their sum, submissions ready when finished · `grading-admin-receiving-receive-panel--counters` | `grade10-admin-grading-batches-US-02` |
| Scan matched | the row: grade · cert, the card, the submission, Matched, Scanned · `grading-admin-receiving-receive-panel--scan-matched` | `grade10-admin-grading-batches-US-02` |
| Cert held elsewhere | the scan refused naming the submission that holds it · `grading-admin-receiving-receive-panel--cert-held` | `grade10-admin-grading-batches-US-02` |
| Cert not on the manifest | the scan refused by name · `grading-admin-receiving-receive-panel--cert-unknown` | `grade10-admin-grading-batches-US-02` |
| Ungraded row | the code, Returned raw with the note; the fee stands · `grading-admin-receiving-receive-panel--ungraded` | `grade10-admin-grading-batches-US-02` |
| Upcharge row | the level moved and the sheet's difference; the invoice reconciled · `grading-admin-receiving-receive-panel--upcharge` | `grade10-admin-grading-batches-US-02` |
| Invoice gap | the invoice's figure against the sheet's; the gap marked Commercial's · `grading-admin-receiving-receive-panel--invoice-gap` | `grade10-admin-grading-batches-US-02` |
| Not scanned yet | On the manifest, not scanned; Scan · `grading-admin-receiving-receive-panel--not-scanned` | `grade10-admin-grading-batches-US-03` |
| Held by the grader | the card recorded held with its expected date · `grading-admin-receiving-receive-panel--held` | `grade10-admin-grading-batches-US-03` |
| Not returned | the card recorded not returned; the payout line · `grading-admin-receiving-receive-panel--not-returned` | `grade10-admin-grading-batches-US-03` |
| Damaged | the slab photographed in the box; Damaged on the card · `grading-admin-receiving-receive-panel--damaged` | `grade10-admin-grading-batches-US-03` |
| Exceptions (`GA5`) | the `EntryList`: ungraded, upcharges, not scanned, damaged · `grading-admin-receiving-receive-panel--exceptions` | `grade10-admin-grading-batches-US-03` |
| Save, finish later | the scans kept; the batch stays back, unchecked · `grading-admin-receiving-receive-panel--saved` | `grade10-admin-grading-batches-US-02` |
| Finish held | an unmatched line or an unscanned slab unresolved: Finish disabled naming it · `grading-admin-receiving-receive-panel--finish-held` | `grade10-admin-grading-batches-US-02` |
| Finish | Finish receiving · notify n collectors; every submission ready, the codes emailed · `grading-admin-receiving-receive-panel--finish` | `grade10-admin-grading-batches-US-02` |
| Finished | the batch closed with its received date · `grading-admin-receiving-receive-panel--finished` | `grade10-admin-grading-batches-US-02` |
| Read grant | no Scan, Import or Finish · `grading-admin-receiving-receive-panel--read-only` | `grade10-admin-grading-counter-US-14` |

### Hand-back runbook

| State | Shows | Anchor |
| --- | --- | --- |
| Header (`GA6`) | the summary, the id, Ready to collect, declared, ready since, to settle; the pickup block: walk-in, nothing in the diary · `grading-admin-handback-handback-runbook--default` | `grade10-admin-grading-counter-US-04` |
| Who is collecting | the code field and the name; the declared total against the threshold · `grading-admin-handback-handback-runbook--who` | `grade10-admin-grading-counter-US-04` |
| Code matched | the collector in person; the ID line above the threshold, nothing kept · `grading-admin-handback-handback-runbook--code-matched` | `grade10-admin-grading-counter-US-04` |
| Below the threshold | no ID line; the code and the name release · `grading-admin-handback-handback-runbook--below-threshold` | `grade10-admin-grading-counter-US-04` |
| Wrong code | refused on the field · `grading-admin-handback-handback-runbook--wrong-code` | `grade10-admin-grading-counter-US-05` |
| Named person (`G18`) | the named person read from the page; the receipt names them · `grading-admin-handback-handback-runbook--named-person` | `grade10-admin-grading-counter-US-05` |
| Somebody else | turned away, code or no code; no override; the name-from-the-page line · `grading-admin-handback-handback-runbook--turned-away` | `grade10-admin-grading-counter-US-05` |
| Settle | the upcharge and the storage lines; Take payment · `grading-admin-handback-handback-runbook--settle` | `grade10-admin-grading-counter-US-04` |
| Nothing due | the step ticked with nothing to take · `grading-admin-handback-handback-runbook--nothing-due` | `grade10-admin-grading-counter-US-04` |
| Settled | the paid line with its reference · `grading-admin-handback-handback-runbook--settled` | `grade10-admin-grading-counter-US-04` |
| Items (`GA6`) | per row: the item, cert, outcome, Handed over; Vault instead on a slab · `grading-admin-handback-handback-runbook--items` | `grade10-admin-grading-counter-US-04` |
| Item ticked | handed over and inspected; the slab photographed · `grading-admin-handback-handback-runbook--item-ticked` | `grade10-admin-grading-counter-US-04` |
| Item held by the grader | the row reads still out; not tickable · `grading-admin-handback-handback-runbook--item-held` | `grade10-admin-grading-counter-US-04` |
| Sign, refused | something due or an item unticked: the reason on the step · `grading-admin-handback-handback-runbook--sign-refused` | `grade10-admin-grading-counter-US-11` |
| Sign, mintable | Show on iPad, Copy link; the 30-minute line · `grading-admin-handback-handback-runbook--mintable` | `grade10-admin-grading-counter-US-11` |
| Sign, declined | the decline; nothing handed back · `grading-admin-handback-handback-runbook--declined` | `grade10-site-grading-counter-documents-US-02` |
| Closed | `ready → collected` on the seal; the record stays · `grading-admin-handback-handback-runbook--closed` | `grade10-admin-grading-counter-US-04` |
| Second hand-back | the held card back: the rest already collected; one item; Close · `grading-admin-handback-handback-runbook--second-handback` | `grade10-admin-grading-counter-US-04` |
| Money (`GA6`) | paid at hand-in, due now, storage from the day · `grading-admin-handback-handback-runbook--money` | `grade10-admin-grading-counter-US-04` |
| Vault, waiting | Open a vault case disabled until the balance is settled · `grading-admin-handback-handback-runbook--vault-waiting` | `grade10-admin-grading-counter-US-06` |
| Vault | the slab handed to the vault; the case opened; the receipt says so · `grading-admin-handback-handback-runbook--vault` | `grade10-admin-grading-counter-US-06` |
| Read grant | the runbook with no button · `grading-admin-handback-handback-runbook--read-only` | `grade10-admin-grading-counter-US-14` |

### One submission

| State | Shows | Anchor |
| --- | --- | --- |
| Header (`GA3`) | the summary, the id, the status word, declared, upcharge to settle, ungraded card, the batch; the collector block with email, phone, WhatsApp and the templates · `grading-admin-submission-submission-panel--default` | `grade10-admin-grading-counter-US-10` |
| Pickup block | no visit needed, ready once checked in, walk-in with the code, a named person may collect · `grading-admin-submission-submission-panel--pickup-block` | `grade10-admin-grading-counter-US-10` |
| Drop-off block | the visit, the desk, Move, Cancel visit, Open in diary · `grading-admin-submission-submission-panel--dropoff-block` | `grade10-admin-grading-counter-US-02` |
| Cards tab (`GA3`) | per card intake id, declared, level and the one moved to, grade · cert, outcome · `grading-admin-submission-submission-panel--cards` | `grade10-admin-grading-counter-US-10` |
| Withdraw a card | offered per card at Handed in until the batch closes; `WithdrawCardDialog`: the refund and the receipt · `grading-admin-submission-submission-panel--withdraw` | `grade10-admin-grading-counter-US-07` |
| Withdraw gone | the batch closed: the act absent · `grading-admin-submission-submission-panel--withdraw-gone` | `grade10-admin-grading-counter-US-07` |
| Money tab | paid at hand-in with the POS reference, the upcharge, storage, to settle, refunds, payouts · `grading-admin-submission-submission-panel--money` | `grade10-admin-grading-counter-US-10` |
| Record a settlement | `SettlementDialog`: the line and the till's reference · `grading-admin-submission-submission-panel--settlement` | `grade10-admin-grading-counter-US-10` |
| Waive the upcharge | `WaiveUpchargeDialog`: the reason, the second approve holder · `grading-admin-submission-submission-panel--waive` | `grade10-admin-grading-counter-US-08` |
| Waive, cards not back | the act absent until the cards are back · `grading-admin-submission-submission-panel--waive-waiting` | `grade10-admin-grading-counter-US-08` |
| Second person is the recorder | refused by name in the dialog · `grading-admin-submission-submission-panel--same-person` | `grade10-admin-grading-counter-US-08` |
| Payout | `PayoutDialog`: declared value, the fee refunded, the route, the window, the second person · `grading-admin-submission-submission-panel--payout` | `grade10-admin-grading-counter-US-09` |
| Payout reversed | the reversal on the record; the card back · `grading-admin-submission-submission-panel--payout-reversed` | `grade10-admin-grading-counter-US-09` |
| Payout past the window | the window passed marked on the dialog · `grading-admin-submission-submission-panel--payout-late` | `grade10-admin-grading-counter-US-09` |
| Documents tab | the three with fingerprints; Show on iPad, Copy link, Send again · `grading-admin-submission-submission-panel--documents` | `grade10-admin-grading-counter-US-11` |
| Documents, none yet | before hand-in: nothing sealed · `grading-admin-submission-submission-panel--documents-empty` | `grade10-admin-grading-counter-US-11` |
| Send again | the letter re-sent; the grades email the same · `grading-admin-submission-submission-panel--send-again` | `grade10-admin-grading-counter-US-11` |
| Message not sent | the failed letter flagged with its reason; Send again · `grading-admin-submission-submission-panel--not-sent` | `grade10-site-grading-collector-notifications-US-03` |
| Timeline tab | every event with its figures, the grader's stages in its words, staff-only entries marked · `grading-admin-submission-submission-panel--timeline` | `grade10-admin-grading-counter-US-13` |
| Actions by status (`GA3`) | only the status's acts; Cancel absent once the cards have left · `grading-admin-submission-submission-panel--actions` | `grade10-admin-grading-counter-US-14` |
| Stale | an act refused because the submission moved; the panel reads again · `grading-admin-submission-submission-panel--stale` | `grade10-admin-grading-counter-US-14` |
| Read grant | the tabs with no act · `grading-admin-submission-submission-panel--read-only` | `grade10-admin-grading-counter-US-14` |
| Not found | the console's not-found line · `grading-admin-submission-submission-panel--not-found` | `grade10-admin-grading-counter-US-10` |

### Written notice

| State | Shows | Anchor |
| --- | --- | --- |
| Notice due | the badge on the Ready view and the submission; Post the notice · `grading-admin-notice-post-notice-dialog--due` | `grade10-admin-grading-counter-US-12` |
| Post the notice | `PostNoticeDialog`: the address from the agreement, posting date, tracking; the email goes the same day · `grading-admin-notice-post-notice-dialog--default` | `grade10-admin-grading-counter-US-12` |
| Incomplete | Record disabled naming the field · `grading-admin-notice-post-notice-dialog--incomplete` | `grade10-admin-grading-counter-US-12` |
| Posted | the posting date and tracking on the timeline; the 30 days counted from it · `grading-admin-notice-post-notice-dialog--posted` | `grade10-admin-grading-counter-US-12` |
| After the 30 days | nothing more offered; storage accrues · `grading-admin-notice-post-notice-dialog--after` | `grade10-admin-grading-counter-US-12` |

### Settings

| State | Shows | Anchor |
| --- | --- | --- |
| Table | every setting with its default, its owner and the pinned line · `grading-admin-settings-settings-panel--default` | `grade10-admin-grading-counter-US-15` |
| Fee sheet | one row per grader and level: ceiling, fee, cover rate, weeks, cards a submission · `grading-admin-settings-settings-panel--fee-sheet` | `grade10-admin-grading-counter-US-15` |
| Diary services | the three entries with their durations · `grading-admin-settings-settings-panel--diary-services` | `grade10-admin-grading-counter-US-15` |
| Edit a clock | `SaveableField`; saved under the settings subject · `grading-admin-settings-settings-panel--edit-clock` | `grade10-admin-grading-counter-US-15` |
| Edit a money setting | the second-person dialog with the reason · `grading-admin-settings-settings-panel--edit-money` | `grade10-admin-grading-counter-US-15` |
| Refused | the refusal by name on the field · `grading-admin-settings-settings-panel--refused` | `grade10-admin-grading-counter-US-15` |
| Operate grant | the table read-only; no field opens · `grading-admin-settings-settings-panel--read-only` | `grade10-admin-grading-counter-US-14` |
| Fact unset | a bracketed value marked; the readiness line naming its owner · `grading-admin-settings-settings-panel--unset` | `grade10-admin-grading-counter-US-15` |

## Flags

- **Frames nobody drew** — the home's empty list and its sign-in-sent line,
  the wizard at Bulk only, every level closed and the reference out of reach,
  the review's pending and expired forms, the booking's joined and resized
  forms, the booked page moved, the submission page at Planned, Expired,
  Cancelled, Back and with a missed visit, a refused, withdrawn, held, not
  returned, damaged or vaulted card, storage accruing and the notice posted,
  the chip beyond the boards' five, the ceremony's refusals, the letters for
  a moved, cancelled or missed drop-off, the day before, damage and the
  hand-back receipt, the queue's empty and read-only forms, the hand-in
  runbook before the visit starts, on a walk-in, with no paid line and with
  the safe full, the refuse dialog's last card, the batches' empty and
  new-batch forms, receiving's manifest and invoice entry, the hand-back's
  wrong code, second hand-back and turned-away forms, the written notice,
  the settings and every grant-shaped state. Each is a row above, drawn
  from its drawn sibling; the stories are their frame
- **No missing primitive, block or token** — every screen composes what
  `packages/design-system` and `@grade10/frontend-console` publish; the
  code and the grade are `Text` at display size, the chip a `Badge`, the
  paste sheet a `Drawer`
- **The export set** — the proposal's thirteen, kept: no merge and no
  split. `GradingOwnershipChip` draws the status word and the chip as the
  one pair every board shows; `GradingLevelPicker` keeps the estimate card
  inside it, because the estimate is the pick; `GradingMoneyBlock` carries
  `G10`'s settle card as its due lead. Three things every submission board
  draws have no export — History, the documents list and the home's
  submissions list — and are composed in `packages/grading/frontend`; the
  proposal may add `GradingHistory`, `GradingDocuments` and
  `GradingSubmissionList` to the set if a second brand is to draw them once
- **Story ids** — the block stories take `Blocks/Grading Submission/<Component>`
  as titled, which departs from the package's `<Capability>/<Component>`
  form (`Appointment Booking/BookingManageCard`); the ids above follow the
  title, and the pages' `::story` cards will too. The console's ids carry
  `admin` after `grading` so a collector view and a console view can never
  share one
- **The day picker** — `G05` draws a week strip; `BookingSlotPicker` draws
  a month grid, and the reuse stands (`decisions.md` Q37)
- **Journeys the states reach past** — a card refused at the counter has no
  collector journey of its own; its page rows anchor on the silence in
  `grade10-site-grading-collector-notifications-US-02`. A card held by the
  grader is walked by staff (`grade10-admin-grading-batches-US-03`) and
  read by the collector under `grade10-site-grading-submission-lifecycle-US-01`.
  The upcharge waived reaches the collector's money block from
  `grade10-admin-grading-counter-US-08`. The PM may issue a collector
  journey for each, or the requirements pass states them out of suite
- **❓ Product** — what the submission becomes when the last card is
  refused at the counter: cancelled, or booked with nothing to hand in; the
  PRD says a refused card never charges and the rest go on, and names
  nothing for none going on
- **❓ Tech design** — the wizard's and the booking's addresses under
  `/grading`, the settings page's address, the console feature that holds
  the submission's tabs (`admin-frontend`'s code map names
  `queue,intake,batches,receiving,handback,notice` and no `submission` or
  `settings`), whether the vault's `FiguresTable` and `PrimaryCta` move to
  `apps/emails/emails/_components`, and the grading `RefusalWords` for the
  doc-sign codes grading can meet
- **❓ Operations** — the manifest and the invoice's entry (`GA5` draws
  Import and the read types the rest), and a batch above the courier's
  cover; the rows above draw both forms
- **❓ Legal** — the receipt's first clause when a named person collects;
  the row prefills the name and prints the clause as drawn
- **Drawn, not carried** — `G00-Main`'s disposal step and `G13`'s twelfth
  exception's disposal line (`decisions.md` Q44), `GA3`'s WhatsApp
  templates' words, `G06`'s vault cross-sell copy beyond one line, `GA6`'s
  ten-to-fifteen-minutes line, and the console's 2FA strip; the first
  release stops at the notice, and the console's chrome is the console's
- **Copy that rides along** — the home's How it works, the wizard's hints,
  the review's Good to know and the booked page's Before you come are keys
  above with no delta of their own; their rows anchor on the journey that
  reads them
- **Console words** — the console's badges and status words are the
  status table's; `grading.console.*` carries only the WhatsApp templates
