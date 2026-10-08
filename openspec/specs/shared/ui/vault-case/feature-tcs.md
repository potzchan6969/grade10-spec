# shared/ui/vault-case Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-02, tcs-rules r4

## Background

* <grade10 ui workbench url> is the `@grade10/ui` design workbench: `pnpm run storybook:ui` from the store's root, or the published workbench behind Cloudflare Access. Each block sits in its sidebar under Vault Case, one entry per story.
* A story renders its block from props alone, with no network, application state, routing or browser storage behind it.
* A callback a block reports logs in the Actions panel under its own name. A story's own checks run when it opens and show in the Interactions panel; before a step that clicks, return the story to its start there and clear the Actions panel.
* The Controls panel changes a story's props in place; a step that plays the consumer's part sets them there.

## shared-ui-vault-case-US1: The vault collector's blocks

**Walked by:** nobody on their own - a component contract the vault's collector pages compose; the journeys of `grade10-site/vault/case-intake`, `grade10-site/vault/case-lifecycle`, `grade10-site/vault/valuation-and-offer`, `grade10-site/vault/loan-and-settlement`, `grade10-site/vault/visit-booking` and `grade10-site/vault/retention-and-erasure` are what reach it.

**As a** consuming vault page,
**I want** the collector's accept confirmation, home with cases and empty home through props alone,
**so that** every vault page composes store blocks instead of drawing its own.

<!-- trace:case id=g10.shared-vault-case.TC-khu rev=1 covers=g10.shared-vault-case.SC-k73,g10.shared-vault-case.SC-abf,g10.shared-vault-case.SC-jrc -->
### shared-ui-vault-case-US1-TC1-1: Every named vault block exports from the package entry

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* The store's `packages/ui/src/index.ts` is open at its `shared/ui/vault-case` comment.

**Steps:**

1. List every component exported under the `shared/ui/vault-case` comment.
2. Match the list against the three named blocks the capability declares.
3. Find each component's prop type and copy type beside it, and the types the capability names beside them.
4. Read the `VaultCasesCard` type.

**Expected Results:**

* `VaultAcceptOfferDialog`, `VaultCases` and `VaultCasesEmpty` are all exported.
* No other component is exported under that comment; the card `VaultCases` draws is not exported.
* Each export carries its own `<Name>Props` type and a `<Name>Copy` type for its words; `VaultCases` also carries `VaultCasesCard`, and `VaultCasesEmpty` carries `VaultCasesEmptyStep`.
* `VaultCasesCard` holds the case's id and the card's words and tones, and no case status.

<!-- trace:case id=g10.shared-vault-case.TC-58x rev=1 covers=g10.shared-vault-case.SC-k73,g10.shared-vault-case.SC-abf,g10.shared-vault-case.SC-jrc -->
### shared-ui-vault-case-US1-TC2-1: A booked visit composes the booking cards, not a vault copy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The export contract

**Pre-conditions:**

* The store's `packages/ui/src/index.ts` is open.

**Steps:**

1. Find `BookingConfirmation` and `BookingManageCard` under the `shared/ui/appointment-booking` comment.
2. Read every export under the `shared/ui/vault-case` comment.
3. Look for a vault confirmation or a vault visit card, under any name.

**Expected Results:**

* Both booking cards resolve from the package's public entry.
* No vault export duplicates a booking card.

<!-- trace:case id=g10.shared-vault-case.TC-0v9 rev=1 covers=g10.shared-vault-case.SC-k73,g10.shared-vault-case.SC-abf,g10.shared-vault-case.SC-jrc -->
### shared-ui-vault-case-US1-TC3-1: No vault block reads a catalogue, fetches, routes or stores

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* The store's `packages/ui/src/blocks/vault-case/` is open.

**Steps:**

1. Read each block source that is not a story, a test or the fixtures.
2. Search each for an import of `@grade10/i18n`.
3. Search each for a network call, browser storage, a router or a data-fetching hook.

**Expected Results:**

* No block imports a message catalogue.
* No block fetches, stores, routes or subscribes to data.

<!-- trace:case id=g10.shared-vault-case.TC-v61 rev=1 covers=none -->
### shared-ui-vault-case-US1-TC16-1: The accept confirmation reads the terms and reports Accept

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Accepting an offer

**Pre-conditions:**

* The Open story gives `VaultAcceptOfferDialog` the offer's lead, <total line>, <late line> and <sign line>, open, with nothing in flight.

**Test data:**

| Field | Value |
| --- | --- |
| <total line> | `Total to repay: HK$8,480.00.` |
| <late line> | a late day's cost, `HK$16.00 a day` |
| <sign line> | `Sign the loan and custody agreements.` |

**Steps:**

1. Open Vault Case / VaultAcceptOfferDialog / Open at <grade10 ui workbench url>.
2. Read the dialog.
3. Click Accept.

**Expected Results:**

* The dialog reads its title, the lead, <total line>, <late line> and <sign line>.
* Go back and Accept are offered.
* Step 3 logs `onConfirm` once.

<!-- trace:case id=g10.shared-vault-case.TC-fwl rev=1 covers=none -->
### shared-ui-vault-case-US1-TC17-1: Going back reports it and answers nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Accepting an offer

Runs once per row of **Test data**.

**Pre-conditions:**

* The Open story is open at <grade10 ui workbench url>, nothing in flight.

**Test data:**

| Way back | Outcome |
| --- | --- |
| Click Go back | `onGoBack` logged once |
| Press Escape | `onGoBack` logged once |

**Steps:**

1. Go back the way the row says.

**Expected Results:**

* The Actions panel shows the row's outcome.
* `onConfirm` is not logged.

<!-- trace:case id=g10.shared-vault-case.TC-h4p rev=1 covers=none -->
### shared-ui-vault-case-US1-TC18-1: An answer in flight holds the dialog open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Accepting an offer

**Pre-conditions:**

* The Pending story gives `VaultAcceptOfferDialog` an answer in flight.

**Steps:**

1. Open Vault Case / VaultAcceptOfferDialog / Pending at <grade10 ui workbench url>.
2. Look at Accept and Go back.
3. Press Escape.

**Expected Results:**

* Accept shows it is busy; Go back cannot be clicked.
* Step 3 leaves the dialog open and logs nothing.

<!-- trace:case id=g10.shared-vault-case.TC-pzj rev=1 covers=none -->
### shared-ui-vault-case-US1-TC19-1: A refusal reads beside the terms, the dialog open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Accepting an offer

**Pre-conditions:**

* The Refused story gives `VaultAcceptOfferDialog` a <refusal>, nothing in flight.

**Test data:**

| Field | Value |
| --- | --- |
| <refusal> | `This offer ran out. Read the page again for what stands now.` |

**Steps:**

1. Open Vault Case / VaultAcceptOfferDialog / Refused at <grade10 ui workbench url>.
2. Read the dialog.

**Expected Results:**

* <refusal> is announced as an alert, with the terms still in the dialog.
* Go back and Accept can both be clicked.

<!-- trace:case id=g10.shared-vault-case.TC-spt rev=1 covers=none -->
### shared-ui-vault-case-US1-TC20-1: The accept confirmation never opens itself

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Accepting an offer

**Pre-conditions:**

* The Closed story gives `VaultAcceptOfferDialog` the offer's words, closed.

**Steps:**

1. Open Vault Case / VaultAcceptOfferDialog / Closed at <grade10 ui workbench url>.
2. Look for a dialog.

**Expected Results:**

* No dialog is drawn.

<!-- trace:case id=g10.shared-vault-case.TC-3ec rev=1 covers=none -->
### shared-ui-vault-case-US1-TC21-1: The empty vault home draws its parts and reports the start

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** An empty vault home

**Pre-conditions:**

* The Default story gives `VaultCasesEmpty` the intro, <start label>, How it works with four steps, the empty panel's title and line, and the draft cap.

**Test data:**

| Field | Value |
| --- | --- |
| <start label> | `Start a Request` |

**Steps:**

1. Open Vault Case / VaultCasesEmpty / Default at <grade10 ui workbench url>.
2. Read the block from the top.
3. Click <start label>.

**Expected Results:**

* The intro, <start label>, How it works, its four steps each with a title and a line, the empty panel, then the draft cap, in that order.
* Step 3 logs `onStartRequest` once.

<!-- trace:case id=g10.shared-vault-case.TC-dgq rev=1 covers=none -->
### shared-ui-vault-case-US1-TC22-1: The home with cases draws its parts in order and reports the start

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The vault home's cases

**Pre-conditions:**

* The Cases story gives `VaultCases` <start label>, Your cases, the several-items note and <case A>, <case B> and <case C>.

**Test data:**

| Field | Value |
| --- | --- |
| <start label> | `Start a request` |
| <case A> | a case titled `Charizard Base Set Holo` |
| <case B> | a case titled `Pikachu Illustrator` |
| <case C> | a case titled `Blastoise Base Set Holo` |

**Steps:**

1. Open Vault Case / VaultCases / Cases at <grade10 ui workbench url>.
2. Read the block from the top.
3. Click <start label>.

**Expected Results:**

* <start label> spans the block's width, with a plus icon.
* Then Your cases with the count, three cards, then the several-items note, in that order.
* Step 3 logs `onStartRequest` once.

<!-- trace:case id=g10.shared-vault-case.TC-c9u rev=1 covers=none -->
### shared-ui-vault-case-US1-TC23-1: Your cases counts the cases it is given

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The vault home's cases

Runs once per row of **Test data**.

**Pre-conditions:**

* Vault Case / VaultCases / Cases is open at <grade10 ui workbench url>.

**Test data:**

| Cases given in Controls | Count read | Cards drawn |
| --- | --- | --- |
| one case | 1 | 1 |
| three cases | 3 | 3 |

**Steps:**

1. In the Controls panel, set the cases to the row's cases.
2. Read the Your cases heading.
3. Count the cards under it.

**Expected Results:**

* Your cases reads the row's count.
* The row's number of cards is drawn.

<!-- trace:case id=g10.shared-vault-case.TC-65o rev=1 covers=none -->
### shared-ui-vault-case-US1-TC24-1: A card per case, in the order the consumer gives

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The vault home's cases

**Pre-conditions:**

* Vault Case / VaultCases / Cases is open at <grade10 ui workbench url>, given <case A>, <case B>, <case C> in that order.

**Test data:**

| Field | Value |
| --- | --- |
| <case A> | a case titled `Charizard Base Set Holo` |
| <case B> | a case titled `Pikachu Illustrator` |
| <case C> | a case titled `Blastoise Base Set Holo` |

**Steps:**

1. Read the cards' titles from the top.
2. In the Controls panel, give the cases as <case C>, <case A>, <case B>.
3. Read the cards' titles from the top again.

**Expected Results:**

* Step 1 reads <case A>, <case B>, <case C>, one card each.
* Step 3 reads <case C>, <case A>, <case B>; no card is re-sorted.

<!-- trace:case id=g10.shared-vault-case.TC-ub8 rev=1 covers=none -->
### shared-ui-vault-case-US1-TC25-1: Clicking a card opens that case, and only that case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The vault home's cases

**Pre-conditions:**

* Vault Case / VaultCases / Cases is open at <grade10 ui workbench url>, given <case A>, <case B>, <case C>, the Actions panel clear.

**Test data:**

| Field | Value |
| --- | --- |
| <case A> | a case titled `Charizard Base Set Holo` |
| <case B> | a case titled `Pikachu Illustrator` |
| <case C> | a case titled `Blastoise Base Set Holo` |

**Steps:**

1. Look over <case B>'s card for its controls.
2. Click <case B>'s card away from its title, on its facts line.
3. Clear the Actions panel, then press Tab until <case A>'s title is focused, and press Enter.

**Expected Results:**

* The card's title is its one control, with a caret; no Open button is drawn.
* Step 2 logs `onOpen` once, with <case B>'s id.
* Step 3 logs `onOpen` once, with <case A>'s id.

<!-- trace:case id=g10.shared-vault-case.TC-1gw rev=1 covers=none -->
### shared-ui-vault-case-US1-TC26-1: An offer waiting reads its terms, its deadline and the visit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The vault home's cases

**Pre-conditions:**

* The Offer waiting story gives `VaultCases` a case with an offer waiting, a loan asked for and a booked visit.

**Test data:**

| Field | Value |
| --- | --- |
| <title> | `Charizard Base Set Holo` |
| <opened> | the day the case opened, as the story gives it |
| <amount asked> | `HK$8,000` |
| <reference> | `VLT-2026-0042` |
| <answer by> | `Answer by` and the offer's deadline, as the story gives it |
| <visit> | the booked visit's day and time, as the story gives it |

**Steps:**

1. Open Vault Case / VaultCases / Offer waiting at <grade10 ui workbench url>.
2. Read the card from the top.

**Expected Results:**

* <title> heads the card.
* The chips read Offer waiting for you and Waiting on you, the second with its icon.
* One facts line: <opened>, With a loan, <amount asked>, then <reference>.
* <answer by> sits in a primary-tinted row with an arrow.
* The calendar line, with its icon, names <visit>.

<!-- trace:case id=g10.shared-vault-case.TC-thx rev=1 covers=none -->
### shared-ui-vault-case-US1-TC27-1: A booked visit reads on the calendar line

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The vault home's cases

**Pre-conditions:**

* The Visit booked story gives `VaultCases` a sent request with a booked <visit>.

**Test data:**

| Field | Value |
| --- | --- |
| <visit> | the booked visit's day and time, as the story gives it |

**Steps:**

1. Open Vault Case / VaultCases / Visit booked at <grade10 ui workbench url>.
2. Read the chips and the calendar line.

**Expected Results:**

* The chips read Request sent and With us, the second with its vault icon.
* The calendar line, with its icon, names <visit>.

<!-- trace:case id=g10.shared-vault-case.TC-69v rev=1 covers=none -->
### shared-ui-vault-case-US1-TC28-1: An item in the vault reads since when, with no next step

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The vault home's cases

**Pre-conditions:**

* The In the vault story gives `VaultCases` a storage-only case whose item went in on <day in>, with no next step and no booked visit.

**Test data:**

| Field | Value |
| --- | --- |
| <day in> | the day the item went into the vault, as the story gives it |

**Steps:**

1. Open Vault Case / VaultCases / In the vault at <grade10 ui workbench url>.
2. Read the card from the top.

**Expected Results:**

* The chips read In the vault and With us since <day in>.
* The facts line names Storage only.
* No next-step row, calendar line or note is drawn; <day in> reads once, on the chip.

<!-- trace:case id=g10.shared-vault-case.TC-ytv rev=1 covers=none -->
### shared-ui-vault-case-US1-TC29-1: A draft owes photographs and reads no calendar line

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The vault home's cases

**Pre-conditions:**

* The Draft story gives `VaultCases` an unsent case, its next step to add photographs, and no visit or day in.

**Steps:**

1. Open Vault Case / VaultCases / Draft at <grade10 ui workbench url>.
2. Read the card from the top.

**Expected Results:**

* The chips read Not sent yet and With you.
* The add-photographs step sits in a muted-tinted row.
* No calendar line is drawn.

<!-- trace:case id=g10.shared-vault-case.TC-xr5 rev=1 covers=none -->
### shared-ui-vault-case-US1-TC30-1: A walk-in draft carries the counter line as its next step

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The vault home's cases

**Pre-conditions:**

* The Walk-in draft story gives `VaultCases` an unsent walk-in case with <counter line> as its next step.

**Test data:**

| Field | Value |
| --- | --- |
| <counter line> | the walk-in draft's counter line, as the story gives it |

**Steps:**

1. Open Vault Case / VaultCases / Walk-in draft at <grade10 ui workbench url>.
2. Read the chips and the next step.

**Expected Results:**

* The chips read Not sent yet and With you.
* <counter line> sits in a muted-tinted row, unchanged.

<!-- trace:case id=g10.shared-vault-case.TC-h92 rev=1 covers=none -->
### shared-ui-vault-case-US1-TC31-1: An ended case reads its ending and the reason, no next step

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The vault home's cases

**Pre-conditions:**

* The Ended story gives `VaultCases` an ended case with <ending> and <reason>, and no next step.

**Test data:**

| Field | Value |
| --- | --- |
| <ending> | the case's ending, as the story gives it |
| <reason> | the reason staff gave, as the story gives it |

**Steps:**

1. Open Vault Case / VaultCases / Ended at <grade10 ui workbench url>.
2. Read the card from the top.

**Expected Results:**

* The chips read <ending> and Closed with the day it closed, the second with no icon.
* <reason> reads last on the card, in the error tone.
* No next-step row is drawn.

<!-- trace:case id=g10.shared-vault-case.TC-n00 rev=1 covers=none -->
### shared-ui-vault-case-US1-TC32-1: An item with no name reads the vault's untitled word

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The vault home's cases

**Pre-conditions:**

* The Untitled item story gives `VaultCases` <untitled word> as the title of a case whose item has no name.

**Test data:**

| Field | Value |
| --- | --- |
| <untitled word> | the vault's word for an item with no name, as the case page reads it |

**Steps:**

1. Open Vault Case / VaultCases / Untitled item at <grade10 ui workbench url>.
2. Read the card's title.

**Expected Results:**

* The title reads <untitled word>, and still opens the case.
* The title's control is described by the case's reference, so two untitled cards stay apart.

<!-- trace:case id=g10.shared-vault-case.TC-lk2 rev=1 covers=none -->
### shared-ui-vault-case-US1-TC33-1: At the narrow column, chips and facts wrap

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The vault home's cases

**Blocked:** The owner - whether the reference stays whole and nothing scrolls sideways at the board's column is raised in `decisions.md`.

**Pre-conditions:**

* Vault Case / VaultCases / Offer waiting is open at <grade10 ui workbench url>, the canvas at <narrow width>.

**Test data:**

| Field | Value |
| --- | --- |
| <narrow width> | 390 px |
| <long title> | `Charizard Base Set Holo 1st Edition Shadowless` |

**Steps:**

1. In the Controls panel, set the case's title to <long title>.
2. Read the card at <narrow width>.

**Expected Results:**

* The chips wrap onto another line rather than overflow.
* The facts line wraps rather than overflow; the reference stays whole.
* Nothing scrolls sideways.

<!-- trace:case id=g10.shared-vault-case.TC-r2n rev=1 covers=none -->
### shared-ui-vault-case-US1-TC34-1: A part the consumer gives no words for is not drawn

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The vault home's cases

Runs once per row of **Test data**.

**Pre-conditions:**

* The row's story is open at <grade10 ui workbench url>.

**Test data:**

| Story | Part cleared in Controls | Not drawn |
| --- | --- | --- |
| Vault Case / VaultCases / Offer waiting | the next step | the tinted next-step row |
| Vault Case / VaultCases / Offer waiting | the visit | the calendar line and its icon |
| Vault Case / VaultCases / Ended | the note | the note |

**Steps:**

1. In the Controls panel, clear the row's part.
2. Read the card from the top.

**Expected Results:**

* The row's part is gone, with no empty row or stray icon in its place.
* The title, both chips and the facts line still read.

<!-- trace:case id=g10.shared-vault-case.TC-fr0 rev=1 covers=none -->
### shared-ui-vault-case-US1-TC35-1: The reference ends the facts line, in mono

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The vault home's cases

**Pre-conditions:**

* The Offer waiting story gives `VaultCases` <reference> among its facts.

**Test data:**

| Field | Value |
| --- | --- |
| <reference> | `VLT-2026-0042` |

**Steps:**

1. Open Vault Case / VaultCases / Offer waiting at <grade10 ui workbench url>.
2. Read the facts line.

**Expected Results:**

* The facts sit on one line, a middle dot between each.
* <reference> is the line's last fact, in a monospaced face.

<!-- trace:case id=g10.shared-vault-case.TC-4hk rev=1 covers=none -->
### shared-ui-vault-case-US1-TC36-1: A card given every part reads them in order, its control named by the item

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The vault home's cases

**Pre-conditions:**

* Vault Case / VaultCases / Offer waiting is open at <grade10 ui workbench url>.

**Test data:**

| Field | Value |
| --- | --- |
| <title> | `Charizard Base Set Holo` |
| <reference> | `VLT-2026-0042` |
| <note> | `Photos too blurry to value` |

**Steps:**

1. In the Controls panel, give the case <note> beside its next step and visit.
2. Read the card from the top.
3. Inspect the card's one control in the Accessibility panel.

**Expected Results:**

* The card reads <title>, the two chips, the facts ending in <reference>, the next step, the calendar line, then <note>, in that order.
* The control is named <title> and described by <reference>.

<!-- trace:case id=g10.shared-vault-case.TC-74a rev=1 covers=g10.shared-vault-case.SC-k73,g10.shared-vault-case.SC-abf,g10.shared-vault-case.SC-jrc -->
### shared-ui-vault-case-US1-TC37-1: The package entry exports no vault collector block

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* The store's `packages/ui/src/index.ts` is open.

**Steps:**

1. Search the exports for `VaultCases`, `VaultCasesEmpty` and `VaultAcceptOfferDialog`.
2. Search the exports for `VaultAcceptOfferDialogProps`, `VaultAcceptOfferDialogCopy`, `VaultCasesProps`, `VaultCasesCopy`, `VaultCasesCard`, `VaultCasesChip`, `VaultCasesTone`, `VaultCasesIcon`, `VaultCasesEmptyProps`, `VaultCasesEmptyCopy` and `VaultCasesEmptyStep`.
3. Search the exports for any vault-named confirmation or visit card.
4. List the blocks under `packages/ui/src/blocks`.

**Expected Results:**

* Step 1 finds none of the three.
* Step 2 finds none of the eleven types.
* Step 3 finds none.
* Step 4 lists no vault collector block.

## Settled

- **The reports** — the home reports its start as `onStartRequest` and a card's opening as `onOpen` with that case's id
- **The stories** — every state is a story under Vault Case / VaultCases, named as the design's states; the card has no entry of its own, and the narrow column is a story read at 390 px rather than a story of its own
- **A day read once** — a day the ownership chip names is not drawn again on the calendar line: an item in the vault reads With us since its day and no calendar line, and Visit carries its own day
- **The keyboard** — the card's one control is a button holding the item's name, so Tab reaches it and Enter opens the case
- **An ended case** — the reason staff gave is the card's note, in the error tone; the chips read the ending and Closed with its day
- **Chip tones and icons** — `decisions.md` Q6; a submitted case's ownership chip is With us
- **The several-items note** — drawn on every home with cases, below the cards
- **The count** — a bare number beside Your cases, so one case reads 1 and there is no singular wording
- **No case status** — a card takes its words and tones already chosen and carries no case status, checked on the exported `VaultCasesCard` type

## Reconciliation

**Run:** the blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the vault blocks' states anchored on feature set groups, and the PRD pages the proposal links. It was denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. One hand wrote both readings, the contract having been planned before either: the suite was written and its questions raised before the requirements existed, which is the order this line can vouch for, not the reader's independence.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-vault-case-US1-TC17-1` - the overlay | Kept | The requirement's table names the overlay beside Escape as a way back; the case walks Go back and Escape, the two a tester reaches without aiming at the backdrop, and `shared-ui-vault-case-SC-19` names the same two |
| The fact card, loading, note list and stage rail cases | Moved | To `shared/ui/page-blocks` when those blocks were generalised for grading's pages: `US1-TC4-1` to `US1-TC15-1` and `SC-04` to `SC-17`, with the raised rows Q113 and Q114 |
| The other 8 cases | Joined, unchanged | Each reaches the one scenario that states it; no case was dropped, and nothing in the two readings stated opposite things |
| Every case in this suite | Blind reading owed | One hand wrote both readings, so a blind QA1 pass is owed at the post-build suite review; acceptance does not wait on it |

**Run:** QA1 blind pass, 2026-10-02. Read the change's `user-journeys.md`, the delta `spec.md`'s `## Purpose` and `## Feature set`, `proposal.md`, `decisions.md`, `ui-design.md`, the durable suite with its `## Reconciliation` stripped, and the suite rules and template. Denied the durable `spec.md`'s requirements and scenarios, every `tech-design.md` and `tasks.md`, archived changes and code.

**Run:** QA2 reconciliation, 2026-10-02. Read both readings beside the change's `proposal.md`, `decisions.md`, `ui-design.md`, `tech-design.md`, `tasks.md`, the delta `spec.md` whole, and the durable `spec.md` and suite. Since the blind pass the plan moved to one new export, `VaultCases`, drawing an unexported card, with every story under Vault Case / VaultCases; the cases are reconciled to that plan.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-vault-case-US1-TC1-1` | Contradicted by the plan, rewritten | The blind reading exported a card component; the plan exports three blocks, `VaultCases` carrying `VaultCasesCard`. Reaches `shared-ui-vault-case-SC-01`, and now also checks the card type carries no case status |
| `shared-ui-vault-case-US1-TC22-1` | Covered | `shared-ui-vault-case-SC-24` |
| `shared-ui-vault-case-US1-TC23-1` | Covered | `shared-ui-vault-case-SC-24`'s count; the one-case row is the same rule at its lower edge |
| `shared-ui-vault-case-US1-TC24-1` | Covered | `shared-ui-vault-case-SC-24`'s order; reordering in Controls is the same rule read twice |
| `shared-ui-vault-case-US1-TC25-1` | Covered, fold owed | `shared-ui-vault-case-SC-25` and `shared-ui-vault-case-SC-28`. Its keyboard step is the requirement's one control read from the keyboard, which no scenario states; deferred to Dev to fold as a scenario |
| `shared-ui-vault-case-US1-TC26-1` | Covered | `shared-ui-vault-case-SC-26`'s parts on the Offer waiting story; the words each state reads are the site's map, held by its `CaseList` test |
| `shared-ui-vault-case-US1-TC27-1` | Contradicted by the plan, rewritten | The blind reading's With you; Q6 makes a submitted case's ownership chip With us. Reaches `shared-ui-vault-case-SC-26` |
| `shared-ui-vault-case-US1-TC28-1` | Covered, sharpened | `shared-ui-vault-case-SC-27`: no next step, no calendar line and no note, the day read once on the chip as Q7 decides |
| `shared-ui-vault-case-US1-TC29-1`, `shared-ui-vault-case-US1-TC30-1` | Covered | `shared-ui-vault-case-SC-26`'s parts on the two draft stories |
| `shared-ui-vault-case-US1-TC31-1` | Covered, sharpened | `shared-ui-vault-case-SC-26`; the Closed chip and the note's place added from Q6 and the requirement's table |
| `shared-ui-vault-case-US1-TC32-1` | Covered, sharpened | `shared-ui-vault-case-SC-26`'s control described by the reference, which keeps two untitled cards apart |
| `shared-ui-vault-case-US1-TC33-1` | Raised, escalated | No Narrow story is planned; the case reads the Offer waiting story at 390 px. The wrap is `ui-design.md`'s Narrow state, out of suite to a design review; whether the reference stays whole and nothing scrolls sideways is raised in `decisions.md`, the case **Blocked** on it |
| `shared-ui-vault-case-US1-TC34-1` | Covered | `shared-ui-vault-case-SC-27`, one part at a time; the note row moves to the Ended story, the only one with a note |
| `shared-ui-vault-case-US1-TC35-1` | Covered | `shared-ui-vault-case-SC-26`'s facts with the reference, and the requirement's fixed-width face |
| `shared-ui-vault-case-US1-TC36-1` | Added | `shared-ui-vault-case-SC-26` whole: every part in order and the control's name and description, which no blind case asserted together |
| `shared-ui-vault-case-SC-02`, `shared-ui-vault-case-SC-03` | Covered, unchanged | The durable `shared-ui-vault-case-US1-TC2-1` and `shared-ui-vault-case-US1-TC3-1`, not repeated here; `TC3-1` reads every block source in the folder, so it reaches `VaultCases` and its card |
| `shared-ui-vault-case-SC-18` to `shared-ui-vault-case-SC-23` | Covered, unchanged | The durable `shared-ui-vault-case-US1-TC16-1` to `shared-ui-vault-case-US1-TC21-1`, not repeated here |
| `shared-ui-vault-case-SC-24`, `shared-ui-vault-case-SC-25`, `shared-ui-vault-case-SC-26`, `shared-ui-vault-case-SC-28` | Deferred to Dev | Each serves another capability's journey only, and a feature case traces one anchor, `The vault home's cases`; once folded, `pnpm check:manual` reads them as untraced. Their **Serves:** lines owe `The vault home's cases` beside the journey, as `shared-ui-vault-case-SC-27` and the accept-offer scenarios serve their groups |

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `packages/ui/src/index.ts`. It is a statement, not proof.

- **Corrected** - `shared-ui-vault-case-US1-TC37-1` lists the eleven types, finds no vault-named confirmation or visit card (`shared-ui-vault-case-SC-02`) and no vault block under `packages/ui/src/blocks` (`shared-ui-vault-case-SC-03`), dropping the booking cards no requirement names
- **Contradicted** - none
- **Uncovered anchors** - none
