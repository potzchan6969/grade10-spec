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
**I want** the collector's accept confirmation and empty home through props alone,
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
2. Match the list against the two named blocks the capability declares.
3. Find each component's prop type and copy type beside it.

**Expected Results:**

* `VaultAcceptOfferDialog` and `VaultCasesEmpty` are both exported.
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
| `shared-ui-vault-case-US1-TC17-1` - the overlay | Kept | The requirement's table names the overlay beside Escape as a way back; the case walks Go back and Escape, the two a tester reaches without aiming at the backdrop, and `shared-ui-vault-case-SC-19` names the same two |
| The fact card, loading, note list and stage rail cases | Moved | To `shared/ui/page-blocks` when those blocks were generalised for grading's pages: `US1-TC4-1` to `US1-TC15-1` and `SC-04` to `SC-17`, with the raised rows `Q113` and `Q114` |
| The other 8 cases | Joined, unchanged | Each reaches the one scenario that states it; no case was dropped, and nothing in the two readings stated opposite things |
| Every case in this suite | Blind reading owed | One hand wrote both readings, so a blind QA1 pass is owed at the post-build suite review; acceptance does not wait on it |
