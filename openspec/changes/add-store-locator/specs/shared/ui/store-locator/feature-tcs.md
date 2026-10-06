# shared/ui/store-locator Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## Background

* <grade10 ui workbench url> is the `@grade10/ui` design workbench: `pnpm run storybook:ui` from the store's root, or the published workbench behind Cloudflare Access. The `StoreLocator` block's stories sit in its sidebar.
* A story renders its block from props alone, with no network, application state, routing or browser storage behind it.
* The Controls panel changes a story's props in place; a step that plays the consumer's part sets them there.

## shared-ui-store-locator-US1: The Location & Hours block

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/store/store-locator`, which composes the block.

**As a** consuming store page,
**I want** the map, store name, address and hours drawn from the props I pass,
**so that** every application shows the one shop the same way without a copy of its own.

<!-- trace:case id=g10.shared-store-locator.TC-c18 rev=1 covers=g10.shared-store-locator.SC-al8 -->
### shared-ui-store-locator-US1-TC1-1: StoreLocator exports from the package entry and holds no copy

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
* **Trace:** Surface exports

**Pre-conditions:**

* The store's `packages/ui/src/index.ts` is open.

**Steps:**

1. Find `StoreLocator` among the package entry's exports.
2. Find the types exported beside it.
3. Open the block's source under `packages/ui/src/blocks/store-locator/`.
4. Read every import and every literal word or shop fact in it.

**Expected Results:**

* Step 1 finds `StoreLocator` exported from the package entry.
* Step 2 finds `StoreLocatorProps`, `StoreLocatorCopy` and `StoreLocatorHoursRow`.
* Steps 1 and 2 find no other component or type for the block.
* Step 4 finds no import from `@grade10/i18n`.
* Step 4 finds no store name, address, hours or Maps address written in.

<!-- trace:case id=g10.shared-store-locator.TC-haj rev=1 covers=g10.shared-store-locator.SC-7zw,g10.shared-store-locator.SC-pyw,g10.shared-store-locator.SC-2cu,g10.shared-store-locator.SC-xyp -->
### shared-ui-store-locator-US1-TC2-1: Supplied name, address and hours show as given

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Location & Hours

**Pre-conditions:**

* The `StoreLocator` block's default story is open on <grade10 ui workbench url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<store name>` | Test Shop Kowloon |
| `<address lines>` | 1 Test Street; Mong Kok; Hong Kong, in that order |
| `<hours rows>` | Monday 10am – 6pm; Tuesday closed, in that order |
| `<maps destination>` | A Google Maps address for 1 Test Street, Mong Kok |

**Steps:**

1. In the Controls panel, set the store name to `<store name>`.
2. Set the address lines to `<address lines>`.
3. Set the hours rows to `<hours rows>`.
4. Set the Maps destination to `<maps destination>`.
5. Read the block.
6. Click the map.

**Expected Results:**

* Step 5 shows `<store name>`, word for word.
* Step 5 shows each of `<address lines>` as given, in order.
* Step 5 shows each of `<hours rows>` as given, in order, and no other row.
* Step 6 opens `<maps destination>` in a new tab.

<!-- trace:case id=g10.shared-store-locator.TC-nio rev=1 covers=g10.shared-store-locator.SC-7zw,g10.shared-store-locator.SC-pyw,g10.shared-store-locator.SC-2cu,g10.shared-store-locator.SC-xyp -->
### shared-ui-store-locator-US1-TC3-1: The map is one named keyboard stop and the only way to Maps

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Location & Hours

**Pre-conditions:**

* The `StoreLocator` block's default story is open on <grade10 ui workbench url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<map name>` | Open Test Shop in Google Maps |

**Steps:**

1. In the Controls panel, set the copy that names the map to `<map name>`.
2. Click above the block, then press Tab through every stop in it.
3. Read the accessible name of the map's stop.
4. Press Enter on the map's stop.

**Expected Results:**

* Step 2: the map is one stop; nothing inside the map takes focus.
* Step 2: no other stop leads to the Maps destination.
* Step 3 reads `<map name>`.
* Step 4 opens the Maps destination in a new tab.

<!-- trace:case id=g10.shared-store-locator.TC-3ab rev=1 covers=g10.shared-store-locator.SC-7zw,g10.shared-store-locator.SC-pyw,g10.shared-store-locator.SC-2cu,g10.shared-store-locator.SC-xyp -->
### shared-ui-store-locator-US1-TC4-1: No hours rows leave the hours section out

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Location & Hours

**Blocked:** The designer - what the block draws with no hours rows is Q15 in `decisions.md`.

**Pre-conditions:**

* The `StoreLocator` block's default story is open on <grade10 ui workbench url>.

**Steps:**

1. In the Controls panel, set the hours rows to an empty list.
2. Read the block.

**Expected Results:**

* No hours title shows, and no empty hours list.
* The map, store name and address lines still show.

## Settled

- A block with no Maps destination is not a state: the map embed and the Maps destination are both required props.

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-06, in a fresh context. Read: this suite, the delta `spec.md` with its scenarios, `tech-design.md`, `ui-design.md`, `decisions.md`, `tasks.md` and the Store Locator Block page. The blind pass recorded no Run line of its own; its question is the shared/ui row of `decisions.md`'s `## Raised`. A second QA2 run, 2026-10-06 in a fresh context after the accept review's edits, read the same set, and checked each disposition below against the current scenarios. A third QA2 run, 2026-10-06 in a fresh context, read the same set and rechecked every disposition. A fourth QA2 run, 2026-10-06 in a fresh context, read the same set and rechecked every disposition; nothing moved.

- **Folded** — `shared-ui-store-locator-US1-TC1-1` to `shared-ui-store-locator-SC-01`, gaining the three named types and no other export for the block; `shared-ui-store-locator-US1-TC2-1` to `shared-ui-store-locator-SC-02`; `shared-ui-store-locator-US1-TC3-1` to `shared-ui-store-locator-SC-03` and `shared-ui-store-locator-SC-05`
- **Folded into spec** — `shared-ui-store-locator-US1-TC1-1` reads the block for words and shop facts written in; the requirement's Props-only content said so and no scenario did, so `shared-ui-store-locator-SC-02` now asserts no word or fact the props did not supply
- **Raised, answered** — a block with no Maps destination (Q21): not a state the block has. Both map props are required, and `shared-ui-store-locator-SC-06` holds a block missing either to a refused type check
- **Blocked** — `shared-ui-store-locator-US1-TC4-1`, the block with no hours rows: the designer's Q15. Its expected results are the blind reading's guess, one of Q15's options and not its recommendation: the case stays draft and no requirement takes a side. When the answer lands, the case is rewritten to it with a scenario, or retired if the hours become a required non-empty list
- **Contradicted** — none
- **Uncovered anchors** — none: both root groups, Surface exports and Location & Hours, are reached

### Out of suite

* `shared-ui-store-locator-SC-06` - a block missing its map does not type-check: `packages/ui/src/blocks/store-locator/public-exports.test.ts` under `pnpm run typecheck`, in this store
