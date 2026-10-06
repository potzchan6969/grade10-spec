# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-auction-listing-US1: The listing surface's rendering contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As an** application composing the shared lot gallery,
**I want** several images to show a left thumbnail rail only when the gallery
is wide enough for that rail beside the main frame,
**so that** a stacked column keeps a clear stage with previous/next and
progress instead of a crowded second rail.

<!-- trace:case id=g10.shared-ui-auction-listing.TC-8ch rev=1 covers=g10.shared-ui-auction-listing.SC-xsa -->
### shared-ui-auction-listing-US1-TC30-1: Wide ListingLotGallery shows a left rail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Gallery strip

**Pre-conditions:**

* Storybook or preview renders `ListingLotGallery` with two or more images in
  a gallery column wide enough for a left rail beside the main frame.

**Steps:**

1. Render the gallery.
2. Check the main frame and the area beside it.

**Expected Results:**

* A thumbnail exists for each image in a rail beside the main frame.
* Previous and next remain available.

<!-- trace:case id=g10.shared-ui-auction-listing.TC-1o6 rev=1 covers=g10.shared-ui-auction-listing.SC-mt3 -->
### shared-ui-auction-listing-US1-TC31-1: Stacked ListingLotGallery hides the rail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Gallery strip

**Pre-conditions:**

* Storybook or preview renders `ListingLotGallery` with two or more images in
  a stacked gallery column that is not wide enough for a left rail beside the
  main frame.

**Steps:**

1. Render the gallery.
2. Check for a thumbnail rail, previous/next, and carousel progress.

**Expected Results:**

* No thumbnail rail is shown.
* Previous and next remain available.
* Carousel progress remains available.

<!-- trace:case id=g10.shared-ui-auction-listing.TC-u8m rev=1 covers=g10.shared-ui-auction-listing.SC-75i -->
### shared-ui-auction-listing-US1-TC32-1: One ListingLotGallery image has no rail

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Gallery strip

**Pre-conditions:**

* Storybook or preview renders `ListingLotGallery` with exactly one image.

**Steps:**

1. Render the gallery.
2. Check for a thumbnail rail and previous/next.

**Expected Results:**

* That image is shown.
* No thumbnail rail is shown.
* Previous and next are not available.

<!-- trace:case id=g10.shared-ui-auction-listing.TC-bas rev=1 covers=g10.shared-ui-auction-listing.SC-vnj -->
### shared-ui-auction-listing-US1-TC33-1: Empty ListingLotGallery has no item or navigation

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
* **Trace:** Gallery strip

**Pre-conditions:**

* Storybook or preview renders `ListingLotGallery` without images.

**Steps:**

1. Render the gallery.
2. Check the gallery region and navigation controls.

**Expected Results:**

* No gallery item is shown.
* Previous and next are not available.

## Settled

- Wide enough means the gallery can place a left rail beside the main frame;
  the implementation threshold stays in code.
- Stacked several-image galleries hide the rail; previous/next and progress
  remain; no substitute strip under the stage.
- A one-image gallery shows no rail or previous/next. An empty gallery shows
  no item or previous/next.
- `ListingGallery` strip rules are unchanged by this change.

## Reconciliation

**Run:** Blind pass read Purpose (durable), Feature set (delta),
user-journeys.md (Walked by nobody), proposal.md, decisions.md (goals,
non-goals, Q1–Q4, empty Raised), PRD Gallery strip lines, and durable
feature-tcs.md for id continuity with Reconciliation stripped. Denied:
every Requirements section, openspec/specs/ beyond those excerpts,
openspec/changes/archive/.

| Finding | Disposition |
| --- | --- |
| Wide ListingLotGallery shows a left rail | Folded as covered by `shared-ui-auction-listing-SC-47` / `shared-ui-auction-listing-US1-TC30-1` |
| Stacked ListingLotGallery hides the rail, keeps previous/next and progress | Folded as covered by `shared-ui-auction-listing-SC-48` / `shared-ui-auction-listing-US1-TC31-1` |
| One ListingLotGallery image has no rail | Folded as covered by `shared-ui-auction-listing-SC-49` / `shared-ui-auction-listing-US1-TC32-1` |
| Empty ListingLotGallery has no item or navigation | Folded as covered by `shared-ui-auction-listing-SC-55` / `shared-ui-auction-listing-US1-TC33-1` |
| Raised questions from the blind pass | None — Q1–Q4 already settled width rule, stacked replacement, ListingGallery carve-out, and unnamed threshold |

**Uncovered anchors:** none after the stated scenario and case patches.
