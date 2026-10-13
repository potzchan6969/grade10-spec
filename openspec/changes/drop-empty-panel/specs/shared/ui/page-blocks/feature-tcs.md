# shared/ui/page-blocks Test Cases

**Status:** pending-review · 0/3

## Background

* <grade10 ui workbench url> is the `@grade10/ui` design workbench: `pnpm run storybook:ui` from the store's root, or the published workbench behind Cloudflare Access. Each block sits in its sidebar under Page Blocks, one entry per story.
* A story renders its block from props alone, with no network, application state, routing or browser storage behind it.
* A callback a block reports logs in the Actions panel under its own name. A story's own checks run when it opens and show in the Interactions panel; before a step that clicks, return the story to its start there and clear the Actions panel.
* The Controls panel changes a story's props in place; a step that plays the consumer's part sets them there.

## g10.shared-page-blocks.US1: The page parts site pages compose

**Walked by:** nobody on their own - a component contract site pages compose; the journeys of the vault's collector capabilities (`grade10-site/vault/*`) and grading's collector capabilities (`grade10-site/grading/*`) are what reach it.

**As a** consuming site page,
**I want** titled fact cards, note lists and stage rails through props alone,
**so that** every site page composes store blocks instead of drawing its own.

<!-- trace:case id=g10.shared-page-blocks.TC-aau rev=2 covers=g10.shared-page-blocks.SC-zu0,g10.shared-page-blocks.SC-pmq,g10.shared-page-blocks.SC-33c -->
### g10.shared-page-blocks.US1-TC1-2: Every named page block exports from the package entry

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
2. Match the list against the four named blocks the capability declares.
3. Find each component's prop type and copy type beside it.

**Expected Results:**

* `FactCard`, `FactCardSkeleton`, `NoteList` and `StageRail` are all exported.
* No other component is exported under that comment; `EmptyPanel` resolves nowhere.
* Each export carries its own `<Name>Props` type and a `<Name>Copy` type for its words.

<!-- trace:case id=g10.shared-page-blocks.TC-dwb rev=2 covers=g10.shared-page-blocks.SC-zu0,g10.shared-page-blocks.SC-pmq,g10.shared-page-blocks.SC-33c -->
### g10.shared-page-blocks.US1-TC16-2: A block carries the slot it is given, or its own

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

* Each of the four page blocks has one story without a slot and one with a slot.

**Steps:**

1. Open Page Blocks / FactCard / Every Part at <grade10 ui workbench url> and inspect the card's root; then open With Slot and inspect it again.
2. Open Page Blocks / FactCardSkeleton / Two and inspect the status's root; then open With Slot and inspect it again.
3. Open Page Blocks / NoteList / Before You Come Storage and inspect the list's root; then open With Slot and inspect it again.
4. Open Page Blocks / StageRail / Financed Mid and inspect the rail's root and the stepper inside it; then open With Slot and inspect the rail's root again.

**Expected Results:**

* Step 1: the root carries `data-slot="card"`, then `data-slot="vault-case-keeps"`.
* Step 2: the root carries `data-slot="stack"`, then `data-slot="vault-cases-loading"`.
* Step 3: the root carries `data-slot="list"`, then `data-slot="vault-case-before-you-come"`.
* Step 4: the rail's root carries no `data-slot` and the stepper carries `data-slot="stepper"`; then the rail's root carries `data-slot="vault-case-stages"`.

<!-- trace:case id=g10.shared-page-blocks.TC-vgl rev=2 covers=none -->
### g10.shared-page-blocks.US1-TC15-2: An empty panel reads its title and reports its way out

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** The export contract

**Pre-conditions:**

* `EmptyPanel` is removed; the Page Blocks sidebar no longer lists it.

**Steps:**

1. Open Page Blocks at <grade10 ui workbench url>.
2. Look for an EmptyPanel entry.

**Expected Results:**

* No EmptyPanel entry exists; the behaviour it covered is the design system's EmptyState, tested under Design System / Display / EmptyState.

## Settled

## Reconciliation

**Run:** no blind pass - a removal change: the export and slot cases were revised in place for four blocks, and the empty-panel case deprecated as the behaviour it walked is the design system's `EmptyState`, whose suite covers it.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| US1-TC1 | Revised as US1-TC1-2, rev 2 | The contract names four blocks; the case now also expects `EmptyPanel` to resolve nowhere |
| US1-TC15 | Deprecated as US1-TC15-2, rev 2 | The requirement and `EmptyPanel` are removed; the drawing is `EmptyState`'s own suite |
| US1-TC16 | Revised as US1-TC16-2, rev 2 | Its fifth step walked `EmptyPanel`'s slot; the four remaining blocks keep theirs |
