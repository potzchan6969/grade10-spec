# shared/ui/page-blocks Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## Background

* <grade10 ui workbench url> is the `@grade10/ui` design workbench: `pnpm run storybook:ui` from the store's root, or the published workbench behind Cloudflare Access. Each block sits in its sidebar under Page Blocks, one entry per story.
* A story renders its block from props alone, with no network, application state, routing or browser storage behind it.
* A callback a block reports logs in the Actions panel under its own name. A story's own checks run when it opens and show in the Interactions panel; before a step that clicks, return the story to its start there and clear the Actions panel.
* The Controls panel changes a story's props in place; a step that plays the consumer's part sets them there.

## shared-ui-page-blocks-US1: The page parts site pages compose

**Walked by:** nobody on their own - a component contract site pages compose; the journeys of the vault's collector capabilities (`grade10-site/vault/*`) and grading's collector capabilities (`grade10-site/grading/*`) are what reach it.

**As a** consuming site page,
**I want** titled fact cards, note lists, stage rails and empty panels through props alone,
**so that** every site page composes store blocks instead of drawing its own.

### shared-ui-page-blocks-US1-TC1-1: Every named page block exports from the package entry

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

* The store's `packages/ui/src/index.ts` is open at its `shared/ui/page-blocks` comment.

**Steps:**

1. List every component exported under the `shared/ui/page-blocks` comment.
2. Match the list against the five named blocks the capability declares.
3. Find each component's prop type and copy type beside it.

**Expected Results:**

* `FactCard`, `FactCardSkeleton`, `NoteList`, `StageRail` and `EmptyPanel` are all exported.
* No other component is exported under that comment.
* Each export carries its own `<Name>Props` type and a `<Name>Copy` type for its words.

### shared-ui-page-blocks-US1-TC2-1: No page block reads a catalogue, fetches, routes or stores

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

* The store's `packages/ui/src/blocks/page-blocks/` is open.

**Steps:**

1. Read each block source that is not a story, a test or the fixtures.
2. Search each for an import of `@grade10/i18n`.
3. Search each for a network call, browser storage, a router or a data-fetching hook.

**Expected Results:**

* No block imports a message catalogue.
* No block fetches, stores, routes or subscribes to data.

### shared-ui-page-blocks-US1-TC3-1: A fact card with every part draws them in order

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
* **Trace:** Reading facts

**Pre-conditions:**

* The Every Part story gives `FactCard` a <card title>, a line under it, a lead, two rows with a <rows label>, a body line and one action.

**Test data:**

| Field | Value |
| --- | --- |
| <card title> | `Our offer` |
| <rows label> | `The offer's figures` |
| <rows> | `Loan` · `HK$8,000.00`, `Interest for the term` · `HK$480.00` |

**Steps:**

1. Open Page Blocks / FactCard / Every Part at <grade10 ui workbench url>.
2. Read the card from its title down.
3. Find the region a screen reader lands on, by its name.
4. Find the table among the card's parts, by its name.

**Expected Results:**

* The card reads the title, the line under it, the lead, the rows, the body, then the action.
* The card is one region named <card title>.
* The rows are one table named <rows label>, one row per label and value.

### shared-ui-page-blocks-US1-TC4-1: Rows alone name their table by the card's title

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
* **Trace:** Reading facts

**Pre-conditions:**

* The Rows Only story gives `FactCard` a <card title> and rows, with no rows label, lead, body or action.

**Test data:**

| Field | Value |
| --- | --- |
| <card title> | `What we keep` |

**Steps:**

1. Open Page Blocks / FactCard / Rows Only at <grade10 ui workbench url>.
2. Find the table by its name.
3. Read the card below its title.

**Expected Results:**

* The table is named <card title>.
* Nothing is drawn under the title but the table: no line, lead, body or action.

### shared-ui-page-blocks-US1-TC5-1: A card with no rows draws no table

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
* **Trace:** Reading facts

Runs once per row of **Test data**.

**Pre-conditions:**

* The Body Only story gives `FactCard` a title and a body line, and its rows as the row says.

**Test data:**

| Rows given | Outcome |
| --- | --- |
| none | the title and the body line; no table |
| an empty list | the title and the body line; no table |

**Steps:**

1. Open Page Blocks / FactCard / Body Only at <grade10 ui workbench url>.
2. Set the rows in the Controls panel as the row says.
3. Read the card.

**Expected Results:**

* The card reads as the row's outcome says.

### shared-ui-page-blocks-US1-TC6-1: Loading cards are one busy status, placeholders hidden

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
* **Trace:** Reading facts

**Pre-conditions:**

* The Two story gives `FactCardSkeleton` a count of 2 and a <loading label>.

**Test data:**

| Field | Value |
| --- | --- |
| <loading label> | `Loading your cases…` |

**Steps:**

1. Open Page Blocks / FactCardSkeleton / Two at <grade10 ui workbench url>.
2. Count the placeholder cards.
3. List the status regions a screen reader announces.

**Expected Results:**

* Two placeholder cards are drawn.
* One busy status is announced, named <loading label>.
* No placeholder is announced on its own.

### shared-ui-page-blocks-US1-TC7-1: A count below one draws no loading cards

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
* **Trace:** Reading facts

**Pre-conditions:**

* `FactCardSkeleton` is given a <loading label>.

**Test data:**

| Field | Value |
| --- | --- |
| <loading label> | `Loading your cases…` |
| <count below one> | `0` |

**Steps:**

1. Render `FactCardSkeleton` with <count below one> as its count.

**Expected Results:**

* The render throws an error naming <count below one>.
* No status and no placeholder is drawn.

### shared-ui-page-blocks-US1-TC8-1: Dividers fall between two lines, never after the last

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

* The story the row names gives `NoteList` its lines.

**Test data:**

| Story | Lines | Dividers |
| --- | --- | --- |
| Before You Come Storage | 3: verified, bring, sign the custody agreement | under the first and the second; none under the third |
| Before You Come Financed | 4: verified, bring, sign both agreements, the money follows | under the first, the second and the third |
| One | 1 | none |

**Steps:**

1. Open Page Blocks / NoteList / the row's story at <grade10 ui workbench url>.
2. Read the lines in order.
3. Look for a divider under each line.

**Expected Results:**

* The lines read in the order given.
* A divider sits where the row says, and none under the last line.

### shared-ui-page-blocks-US1-TC9-1: A line carrying a link keeps its link

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

* The With Link Item story gives `NoteList` Before you come for a collector not yet verified: its first line holds a <verify link> and the in-person line.

**Test data:**

| Field | Value |
| --- | --- |
| <verify link> | `Verify now`, to `/vault/verify` |

**Steps:**

1. Open Page Blocks / NoteList / With Link Item at <grade10 ui workbench url>.
2. Find the <verify link> in the first line.

**Expected Results:**

* The first line holds <verify link> as a link to its address, then the in-person line.
* Every other line reads as given.

### shared-ui-page-blocks-US1-TC10-1: An empty note list draws nothing

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

* The Empty story gives `NoteList` no lines.

**Steps:**

1. Open Page Blocks / NoteList / Empty at <grade10 ui workbench url>.
2. Look for a list in the story's canvas.

**Expected Results:**

* No list and no divider is drawn.

### shared-ui-page-blocks-US1-TC11-1: The rail marks the stage reached and every stage around it

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
* **Trace:** How far along

Runs once per row of **Test data**.

**Pre-conditions:**

* The story the row names gives `StageRail` its stages and the current one.

**Test data:**

| Story | Stages | Current | Done | To come |
| --- | --- | --- | --- | --- |
| Financed Mid | Request, Valued, Offer, Agreed, Signed, Vault, Loan, Home | Signed | Request, Valued, Offer, Agreed | Vault, Loan, Home |
| Storage Lane | Request, Valued, Agreed, Signed, Vault, Home | Vault | Request, Valued, Agreed, Signed | Home |
| Wizard First | Describe, Photograph, Review | Describe | none | Photograph, Review |

**Steps:**

1. Open Page Blocks / StageRail / the row's story at <grade10 ui workbench url>.
2. Read the stages in order.
3. Find the stage a screen reader hears as current.

**Expected Results:**

* The stages read in the row's order.
* Current is in progress and is the one current step.
* The row's Done stages read done, its To come stages still to come.

### shared-ui-page-blocks-US1-TC12-1: An ended case stays at its stage with the ending's word

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
* **Trace:** How far along

**Pre-conditions:**

* The Ended story gives `StageRail` the financed lane, Offer as the current stage and <ending word>.

**Test data:**

| Field | Value |
| --- | --- |
| <ending word> | `Declined` |

**Steps:**

1. Open Page Blocks / StageRail / Ended at <grade10 ui workbench url>.
2. Read the current stage and the line under it.
3. Read every later stage.

**Expected Results:**

* Offer is in progress, with <ending word> under it.
* Every stage after Offer reads still to come.

### shared-ui-page-blocks-US1-TC13-1: A stage the rail does not hold is refused by name

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
* **Trace:** How far along

**Pre-conditions:**

* `StageRail` is given the storage lane's six stages.

**Test data:**

| Field | Value |
| --- | --- |
| <stage not held> | `loan`, a financed-lane stage the storage lane skips |

**Steps:**

1. Render `StageRail` with <stage not held> as the current stage.

**Expected Results:**

* The render throws an error naming <stage not held>.
* No rail is drawn.

### shared-ui-page-blocks-US1-TC14-1: A narrow screen scrolls the rail, not the page

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
* **Trace:** How far along

**Pre-conditions:**

* The Narrow story draws the financed lane's eight stages in a 320-pixel frame.

**Steps:**

1. Open Page Blocks / StageRail / Narrow at <grade10 ui workbench url>.
2. Scroll the rail sideways.
3. Scroll the page sideways.

**Expected Results:**

* The rail scrolls to show Home.
* The page does not scroll sideways.

### shared-ui-page-blocks-US1-TC15-1: An empty panel reads its title and reports its way out

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
* **Trace:** Nothing here yet

**Pre-conditions:**

* The With Action story gives `EmptyPanel` a title and a Start action, and no line.

**Steps:**

1. Open Page Blocks / EmptyPanel / With Action at <grade10 ui workbench url>.
2. Clear the Actions panel.
3. Click Start a submission.

**Expected Results:**

* Step 1: the title reads, with no line under it.
* Step 3: the action logs once.

### shared-ui-page-blocks-US1-TC16-1: A block carries the slot it is given, or its own

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
* **Trace:** The export contract

**Pre-conditions:**

* Each of the five page blocks has one story without a slot and one with a slot.

**Steps:**

1. Open Page Blocks / FactCard / Every Part at <grade10 ui workbench url> and inspect the card's root; then open With Slot and inspect it again.
2. Open Page Blocks / FactCardSkeleton / Two and inspect the status's root; then open With Slot and inspect it again.
3. Open Page Blocks / NoteList / Before You Come Storage and inspect the list's root; then open With Slot and inspect it again.
4. Open Page Blocks / StageRail / Financed Mid and inspect the rail's root and the stepper inside it; then open With Slot and inspect the rail's root again.
5. Open Page Blocks / EmptyPanel / Title And Description and inspect the panel's root; then open With Action and inspect it again.

**Expected Results:**

* Step 1: the root carries `data-slot="card"`, then `data-slot="vault-case-keeps"`.
* Step 2: the root carries `data-slot="stack"`, then `data-slot="vault-cases-loading"`.
* Step 3: the root carries `data-slot="list"`, then `data-slot="vault-case-before-you-come"`.
* Step 4: the rail's root carries no `data-slot` and the stepper carries `data-slot="stepper"`; then the rail's root carries `data-slot="vault-case-stages"`.
* Step 5: the root carries `data-slot="empty-state"`, then `data-slot="grading-home-submissions-empty"`.

## Reconciliation

**Run:** the cases for the fact card, the loading cards, the note list and the stage rail were written blind for `shared/ui/vault-case` and moved here unchanged but for their names and ids when those blocks were generalised for grading's pages; the export, empty panel and slot cases were written by the coordinator against the anchors and reconciled at once, so they are not a blind reading.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| The fact card, loading, note list and stage rail cases | Moved | From `shared/ui/vault-case`, `US1-TC4-1` to `US1-TC15-1`, renamed to `US1-TC3-1` to `US1-TC14-1`, their scenarios `SC-04` to `SC-17` renamed to `shared-ui-page-blocks-SC-03` to `SC-16`; the raised rows Q113 and Q114 stand as settled there |
| `shared-ui-page-blocks-US1-TC1-1`, `-TC2-1`, `-TC15-1`, `-TC16-1` | Written with the move | The export contract, the reach, the empty panel and the slot, each reaching the one scenario that states it |
| The coordinator's cases | Blind reading owed | `US1-TC1-1`, `-TC2-1`, `-TC15-1` and `-TC16-1` get a blind QA1 pass at the post-build suite review; acceptance does not wait on it |
