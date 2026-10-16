# shared/ui/auction-listing Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-13, tcs-rules r5

These cases were drafted after implementation landed, on the change's own
decision (decisions Q6, "code first, spec after"); they are not a blind
reading. QA2 reconciled them against the modified and added anchors.

## g10.shared-auction-listing.US1: The listing surface's rendering contract

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As an** application composing the shared bid panel,
**I want** the panel to never offer an amount the supplied currency ceiling refuses,
**so that** the collector reads the limit instead of a broken raise form.

<!-- trace:case id=g10.shared-auction-listing.TC-9l4 rev=1 covers=g10.shared-auction-listing.SC-teu,g10.shared-auction-listing.SC-v9a -->
### g10.shared-auction-listing.US1-TC65: The lens follows the pointer and reads the zoom source

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Gallery magnification

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-lot-gallery.stories.tsx`

**Pre-conditions:**

* Storybook or preview renders a gallery whose selected image supplies
  distinct `src` and `zoomSrc`.

**Steps:**

1. Render the gallery.
2. Move the pointer over the main frame.
3. Check the lens and the image it renders.

**Expected Results:**

* A magnifier lens shows at the pointer position.
* The magnified image inside the lens requests `zoomSrc`.

<!-- trace:case id=g10.shared-auction-listing.TC-ar2 rev=1 covers=g10.shared-auction-listing.SC-4sr -->
### g10.shared-auction-listing.US1-TC66: A missing zoom source magnifies the main one

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Gallery sources

**Pre-conditions:**

* Storybook or preview renders a gallery whose selected image supplies only
  `src` and `alt`.

**Steps:**

1. Render the gallery.
2. Move the pointer over the main frame.

**Expected Results:**

* The lens shows and its magnified image requests `src`.

<!-- trace:case id=g10.shared-auction-listing.TC-jd4 rev=1 covers=g10.shared-auction-listing.SC-bk7,g10.shared-auction-listing.SC-53x -->
### g10.shared-auction-listing.US1-TC67: A focused lens moves with arrows, never steps, and hides on Escape

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Gallery magnification

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-lot-gallery.stories.tsx`, `packages/design-system/src/components/display/lens.stories.tsx`

**Pre-conditions:**

* Storybook or preview renders a gallery with several images.

**Steps:**

1. Focus the lens group over the main frame.
2. Press an arrow key.
3. Press Escape.

**Expected Results:**

* The lens shows on focus and moves within the frame on each arrow key.
* The gallery does not step to another image while the lens moves.
* Escape hides the lens.

<!-- trace:case id=g10.shared-auction-listing.TC-br7 rev=1 covers=g10.shared-auction-listing.SC-qlq -->
### g10.shared-auction-listing.US1-TC68: A touch pointer raises no lens and a swipe still steps

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Gallery magnification

**Pre-conditions:**

* Storybook or preview renders a gallery with several images on a touch
  pointer.

**Steps:**

1. Move a touch pointer over the main frame.
2. Swipe across the gallery.

**Expected Results:**

* No lens is shown.
* The swipe steps the gallery to the next image.

<!-- trace:case id=g10.shared-auction-listing.TC-v48 rev=1 covers=g10.shared-auction-listing.SC-qyd,g10.shared-auction-listing.SC-73b -->
### g10.shared-auction-listing.US1-TC69: Non-selected slides and video carry no focusable lens

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Gallery magnification

**Pre-conditions:**

* Storybook renders a `ListingLotGallery` with several images, and a
  `ListingGallery` whose selected item is a video.

**Steps:**

1. Tab through the lot gallery.
2. Move the pointer over the selected video item.

**Expected Results:**

* Only the selected slide's lens group takes focus in the lot gallery.
* The video item shows no lens, and its own controls keep working.

## Settled

- Magnification happens in place under a pointer-following lens; the
  magnifier button and zoom dialog are gone (decisions Q1).
- A touch pointer raises nothing, and no fallback replaces the dialog on
  touch (decisions Q2).
- The lens group takes the consumer's `zoom` plus optional
  `zoomInstructions` as its accessible name; the magnified copy stays
  hidden from assistive technology (decisions Q3).
- `zoomSrc` feeds the magnified view and still falls back to `src`
  (decisions Q4).

## Reconciliation

**Run:** Not a blind pass — the change was written code-first on its own
decision (decisions Q6), so these cases were drafted with sight of the
implementation and the delta scenarios. This reconciliation maps each
modified and added anchor to a case, records what the durable suite already
carries, and names what remains pending.

| Finding | Disposition |
| --- | --- |
| The pointer raises the lens over the selected image | Covered by `shared-ui-auction-listing-SC-67` / `g10.shared-auction-listing.US1-TC65` (`TC-9l4`) |
| A focused lens moves with arrows, never steps, and hides on Escape | Covered by `shared-ui-auction-listing-SC-68`, `shared-ui-auction-listing-SC-69` / `g10.shared-auction-listing.US1-TC67` (`TC-jd4`) |
| A touch pointer raises no lens and a swipe still steps | Covered by `shared-ui-auction-listing-SC-70` / `g10.shared-auction-listing.US1-TC68` (`TC-br7`) |
| Non-selected slides and video carry no focusable lens | Covered by `shared-ui-auction-listing-SC-71`, `shared-ui-auction-listing-SC-72` / `g10.shared-auction-listing.US1-TC69` (`TC-v48`) |
| The magnified view requests `zoomSrc` | Modified `shared-ui-auction-listing-SC-03` (`SC-v9a`) is covered by `g10.shared-auction-listing.US1-TC65` (`TC-9l4`) |
| An omitted zoom source magnifies `src` | Modified `shared-ui-auction-listing-SC-04` (`SC-4sr`) is covered by `g10.shared-auction-listing.US1-TC66` (`TC-ar2`) |
| Labels, including `zoomInstructions`, come from the consumer | Durable `g10.shared-auction-listing.US1-TC10` carries modified `shared-ui-auction-listing-SC-08`; no new case needed |
| Raised questions from the reading | None — Q1–Q6 settled the dialog removal, the touch limitation, the accessible name, the zoom source, the package, and the order |

**Uncovered anchors:** none. Post-hoc `covers` links for the modified
source scenarios land on TC65 and TC66.
