# shared/ui/vault-case Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## Background

* <grade10 ui workbench url> is the `@grade10/ui` design workbench: `pnpm run storybook:ui` from the store's root, or the published workbench behind Cloudflare Access. Each block sits in its sidebar under Vault Case, one entry per story.
* A story renders its block from props alone, with no network, application state, routing or browser storage behind it.
* A callback a block reports logs in the Actions panel under its own name. A story's own checks run when it opens and show in the Interactions panel; before a step that clicks, return the story to its start there and clear the Actions panel.
* The Controls panel changes a story's props in place; a step that plays the consumer's part sets them there.

## shared-ui-vault-case-US1: The vault collector's blocks

**Walked by:** nobody on their own - a component contract the vault's collector pages compose; the journeys of `grade10-site/vault/case-intake`, `grade10-site/vault/case-lifecycle`, `grade10-site/vault/valuation-and-offer`, `grade10-site/vault/loan-and-settlement`, `grade10-site/vault/visit-booking` and `grade10-site/vault/retention-and-erasure` are what reach it.

**As a** consuming vault page,
**I want** the collector's cards, lists, rail, accept confirmation and empty home through props alone,
**so that** every vault page composes store blocks instead of drawing its own.

### shared-ui-vault-case-US1-TC1-1: Every named vault block exports from the package entry

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
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
2. Match the list against the six named blocks the capability declares.
3. Find each component's prop type and copy type beside it.

**Expected Results:**

* `VaultFactCard`, `VaultFactCardSkeleton`, `VaultNoteList`, `VaultStageRail`, `VaultAcceptOfferDialog` and `VaultCasesEmpty` are all exported.
* No other component is exported under that comment.
* Each export carries its own `<Name>Props` type and a `<Name>Copy` type for its words.

### shared-ui-vault-case-US1-TC2-1: A booked visit composes the booking cards, not a vault copy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

### shared-ui-vault-case-US1-TC3-1: No vault block reads a catalogue, fetches, routes or stores

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

### shared-ui-vault-case-US1-TC4-1: A fact card with every part draws them in order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading a case's facts

**Pre-conditions:**

* The Every Part story gives `VaultFactCard` a <card title>, a line under it, a lead, two rows with a <rows label>, a body line and one action.

**Test data:**

| Field | Value |
| --- | --- |
| <card title> | `Our offer` |
| <rows label> | `The offer's figures` |
| <rows> | `Loan` · `HK$8,000.00`, `Interest for the term` · `HK$480.00` |

**Steps:**

1. Open Vault Case / VaultFactCard / Every Part at <grade10 ui workbench url>.
2. Read the card from its title down.
3. Find the region a screen reader lands on, by its name.
4. Find the table among the card's parts, by its name.

**Expected Results:**

* The card reads the title, the line under it, the lead, the rows, the body, then the action.
* The card is one region named <card title>.
* The rows are one table named <rows label>, one row per label and value.

### shared-ui-vault-case-US1-TC5-1: Rows alone name their table by the card's title

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading a case's facts

**Pre-conditions:**

* The Rows Only story gives `VaultFactCard` a <card title> and rows, with no rows label, lead, body or action.

**Test data:**

| Field | Value |
| --- | --- |
| <card title> | `What we keep` |

**Steps:**

1. Open Vault Case / VaultFactCard / Rows Only at <grade10 ui workbench url>.
2. Find the table by its name.
3. Read the card below its title.

**Expected Results:**

* The table is named <card title>.
* Nothing is drawn under the title but the table: no line, lead, body or action.

### shared-ui-vault-case-US1-TC6-1: A card with no rows draws no table

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading a case's facts

Runs once per row of **Test data**.

**Pre-conditions:**

* The Body Only story gives `VaultFactCard` a title and a body line, and its rows as the row says.

**Test data:**

| Rows given | Outcome |
| --- | --- |
| none | the title and the body line; no table |
| an empty list | the title and the body line; no table |

**Steps:**

1. Open Vault Case / VaultFactCard / Body Only at <grade10 ui workbench url>.
2. Set the rows in the Controls panel as the row says.
3. Read the card.

**Expected Results:**

* The card reads as the row's outcome says.

### shared-ui-vault-case-US1-TC7-1: Loading cards are one busy status, placeholders hidden

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Reading a case's facts

**Pre-conditions:**

* The Two story gives `VaultFactCardSkeleton` a count of 2 and a <loading label>.

**Test data:**

| Field | Value |
| --- | --- |
| <loading label> | `Loading your cases…` |

**Steps:**

1. Open Vault Case / VaultFactCardSkeleton / Two at <grade10 ui workbench url>.
2. Count the placeholder cards.
3. List the status regions a screen reader announces.

**Expected Results:**

* Two placeholder cards are drawn.
* One busy status is announced, named <loading label>.
* No placeholder is announced on its own.

### shared-ui-vault-case-US1-TC8-1: A count below one draws no loading cards

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reading a case's facts

**Pre-conditions:**

* `VaultFactCardSkeleton` is given a <loading label>.

**Test data:**

| Field | Value |
| --- | --- |
| <loading label> | `Loading your cases…` |
| <count below one> | `0` |

**Steps:**

1. Render `VaultFactCardSkeleton` with <count below one> as its count.

**Expected Results:**

* The render throws an error naming <count below one>.
* No status and no placeholder is drawn.

### shared-ui-vault-case-US1-TC9-1: Dividers fall between two lines, never after the last

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing notes

Runs once per row of **Test data**.

**Pre-conditions:**

* The story the row names gives `VaultNoteList` its lines.

**Test data:**

| Story | Lines | Dividers |
| --- | --- | --- |
| Before You Come Storage | 3: verified, bring, sign the custody agreement | under the first and the second; none under the third |
| Before You Come Financed | 4: verified, bring, sign both agreements, the money follows | under the first, the second and the third |
| One | 1 | none |

**Steps:**

1. Open Vault Case / VaultNoteList / the row's story at <grade10 ui workbench url>.
2. Read the lines in order.
3. Look for a divider under each line.

**Expected Results:**

* The lines read in the order given.
* A divider sits where the row says, and none under the last line.

### shared-ui-vault-case-US1-TC10-1: A line carrying a link keeps its link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing notes

**Pre-conditions:**

* The With Link Item story gives `VaultNoteList` Before you come for a collector not yet verified: its first line holds a <verify link> and the in-person line.

**Test data:**

| Field | Value |
| --- | --- |
| <verify link> | `Verify now`, to `/vault/verify` |

**Steps:**

1. Open Vault Case / VaultNoteList / With Link Item at <grade10 ui workbench url>.
2. Find the <verify link> in the first line.

**Expected Results:**

* The first line holds <verify link> as a link to its address, then the in-person line.
* Every other line reads as given.

### shared-ui-vault-case-US1-TC11-1: An empty note list draws nothing

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Listing notes

**Pre-conditions:**

* The Empty story gives `VaultNoteList` no lines.

**Steps:**

1. Open Vault Case / VaultNoteList / Empty at <grade10 ui workbench url>.
2. Look for a list in the story's canvas.

**Expected Results:**

* No list and no divider is drawn.

### shared-ui-vault-case-US1-TC12-1: The rail marks the stage reached and every stage around it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where a case stands

Runs once per row of **Test data**.

**Pre-conditions:**

* The story the row names gives `VaultStageRail` its stages and the current one.

**Test data:**

| Story | Stages | Current | Done | To come |
| --- | --- | --- | --- | --- |
| Financed Mid | Request, Valued, Offer, Agreed, Signed, Vault, Loan, Home | Signed | Request, Valued, Offer, Agreed | Vault, Loan, Home |
| Storage Lane | Request, Valued, Agreed, Signed, Vault, Home | Vault | Request, Valued, Agreed, Signed | Home |
| Wizard First | Describe, Photograph, Review | Describe | none | Photograph, Review |

**Steps:**

1. Open Vault Case / VaultStageRail / the row's story at <grade10 ui workbench url>.
2. Read the stages in order.
3. Find the stage a screen reader hears as current.

**Expected Results:**

* The stages read in the row's order.
* Current is in progress and is the one current step.
* The row's Done stages read done, its To come stages still to come.

### shared-ui-vault-case-US1-TC13-1: An ended case stays at its stage with the ending's word

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where a case stands

**Pre-conditions:**

* The Ended story gives `VaultStageRail` the financed lane, Offer as the current stage and <ending word>.

**Test data:**

| Field | Value |
| --- | --- |
| <ending word> | `Declined` |

**Steps:**

1. Open Vault Case / VaultStageRail / Ended at <grade10 ui workbench url>.
2. Read the current stage and the line under it.
3. Read every later stage.

**Expected Results:**

* Offer is in progress, with <ending word> under it.
* Every stage after Offer reads still to come.

### shared-ui-vault-case-US1-TC14-1: A stage the rail does not hold is refused by name

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Where a case stands

**Pre-conditions:**

* `VaultStageRail` is given the storage lane's six stages.

**Test data:**

| Field | Value |
| --- | --- |
| <stage not held> | `loan`, a financed-lane stage the storage lane skips |

**Steps:**

1. Render `VaultStageRail` with <stage not held> as the current stage.

**Expected Results:**

* The render throws an error naming <stage not held>.
* No rail is drawn.

### shared-ui-vault-case-US1-TC15-1: A narrow screen scrolls the rail, not the page

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Where a case stands

**Pre-conditions:**

* The Narrow story draws the financed lane's eight stages in a 320-pixel frame.

**Steps:**

1. Open Vault Case / VaultStageRail / Narrow at <grade10 ui workbench url>.
2. Scroll the rail sideways.
3. Scroll the page sideways.

**Expected Results:**

* The rail scrolls to show Home.
* The page does not scroll sideways.

### shared-ui-vault-case-US1-TC16-1: The accept confirmation reads the terms and reports Accept

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### shared-ui-vault-case-US1-TC17-1: Going back reports it and answers nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### shared-ui-vault-case-US1-TC18-1: An answer in flight holds the dialog open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### shared-ui-vault-case-US1-TC19-1: A refusal reads beside the terms, the dialog open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

### shared-ui-vault-case-US1-TC20-1: The accept confirmation never opens itself

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
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

### shared-ui-vault-case-US1-TC21-1: The empty vault home draws its parts and reports the start

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

## Reconciliation

**Run:** the blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the vault blocks' states anchored on feature set groups, and the PRD pages the proposal links. It was denied every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/` and `tech-design.md`. One hand wrote both readings, the contract having been planned before either: the suite was written and its questions raised before the requirements existed, which is the order this line can vouch for, not the reader's independence.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-ui-vault-case-US1-TC8-1` - a count below one | Raised, settled | The input named no floor for the loading count. Decisions `Q113`: a count below one is refused with an error naming it; folded as `shared-ui-vault-case-SC-08`, and the case's step rewritten from a Controls edit to a render, its **Blocked** line removed |
| `shared-ui-vault-case-US1-TC6-1` - an empty list of rows | Raised, settled | The input named a part left out, not a part given empty. Decisions `Q114`: an empty list draws no table, the same as none; folded into the fact card's requirement and `shared-ui-vault-case-SC-06` |
| `shared-ui-vault-case-US1-TC9-1` - the lanes' dividers | Fixed | The coordinator's ruling that Before you come's dividers are fixed on both lanes is stated in `shared-ui-vault-case-SC-09`; the case's rows re-worded to the two lanes and a single line, `<v>` kept |
| `shared-ui-vault-case-US1-TC12-1` | Joined, unchanged | One case over three rows reaches `shared-ui-vault-case-SC-12`, `shared-ui-vault-case-SC-13` and `shared-ui-vault-case-SC-14`: one route, three starting states the rows name |
| `shared-ui-vault-case-US1-TC17-1` - the overlay | Kept | The requirement's table names the overlay beside Escape as a way back; the case walks Go back and Escape, the two a tester reaches without aiming at the backdrop, and `shared-ui-vault-case-SC-19` names the same two |
| The other 17 cases | Joined, unchanged | Each reaches the one scenario that states it; no case was dropped, and nothing in the two readings stated opposite things |
