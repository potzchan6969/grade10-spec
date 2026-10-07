# grade10-site/auction/listing-media Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-auction-listing-media-US1: Operator attaches an image to a listing gallery

**As an** operator with catalogue grant,
**I want** to drop one or several supported images into a listing's gallery
and see each one stored as it lands,
**so that** photographing a card costs one move rather than a confirm per
file, and the gallery stays within the cap admin-listing sets.

<!-- trace:case id=g10.auction-listing-media.TC-oyk rev=2 covers=g10.auction-listing-media.SC-31 -->
### grade10-site-auction-listing-media-US1-TC3-2: Choosing a file stores it without a preview

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_3>` is a draft with fewer than eight media items.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A draft auction listing with fewer than eight media items |
| `<jpeg_ok>` | charizard-front.jpg, JPEG, under the media size bound |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the media manager for `<listing_3>`.
3. Choose `<jpeg_ok>`.
4. Check the gallery.

**Expected Results:**

* `<jpeg_ok>` is stored in the gallery immediately.
* No preview, confirm or discard step is required.

<!-- trace:case id=g10.auction-listing-media.TC-eq0 rev=1 covers=g10.auction-listing-media.SC-07 -->
### grade10-site-auction-listing-media-US1-TC4-1: Confirming a preview stores the image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin has selected `<jpeg_ok>` for a `<listing_4>` gallery slot and sees its preview.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A draft auction listing with a selected JPEG preview in one gallery slot |
| `<jpeg_ok>` | charizard-front.jpg, JPEG, under the media size bound |

**Steps:**

1. Confirm the upload.
2. Check the gallery slot and the preview.

**Expected Results:**

* That slot holds `<jpeg_ok>`.
* The preview is cleared.

**Deprecated:** Superseded by immediate upload on drop or choose; the confirm step no longer exists.

<!-- trace:case id=g10.auction-listing-media.TC-h3k rev=1 covers=g10.auction-listing-media.SC-08 -->
### grade10-site-auction-listing-media-US1-TC5-1: Discarding the preview leaves the gallery unchanged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin has selected an image for a `<listing_5>` gallery slot and sees its preview.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A draft auction listing with a selected image preview in one gallery slot |

**Steps:**

1. Discard the preview without confirming.
2. Check the gallery and the preview.

**Expected Results:**

* The gallery is unchanged.
* The preview is cleared.
* No upload was sent.

**Deprecated:** Superseded by immediate upload on drop or choose; the discard step no longer exists.

<!-- trace:case id=g10.auction-listing-media.TC-bat rev=1 covers=g10.auction-listing-media.SC-32 -->
### grade10-site-auction-listing-media-US1-TC11-1: Several files append after the last gallery item

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_7>` is a draft whose gallery already contains `<existing_image>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A draft auction listing with one existing gallery image |
| `<batch_images>` | Three supported images selected in a known order |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the media manager for `<listing_7>`.
3. Drop `<batch_images>` together.
4. Check the gallery order.

**Expected Results:**

* Each image stores without a confirm step.
* The images appear after `<existing_image>` in selection order.

<!-- trace:case id=g10.auction-listing-media.TC-ref rev=1 covers=g10.auction-listing-media.SC-34 -->
### grade10-site-auction-listing-media-US1-TC12-1: Refused files keep their reasons in a mixed selection

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_8>` is a draft with room for two more media items.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A draft auction listing with room for two more media items |
| `<mixed_files>` | Two supported images, a PDF, an image over the size bound, and a file beyond the eight-item cap |

**Steps:**

1. Open the media manager for `<listing_8>`.
2. Choose `<mixed_files>` together.
3. Read the gallery and each refusal result.

**Expected Results:**

* The two supported images are stored.
* The PDF, oversized image and over-cap file remain unstored.
* Each refused file is named with its refusal reason.

<!-- trace:case id=g10.auction-listing-media.TC-rep rev=1 covers=g10.auction-listing-media.SC-33 -->
### grade10-site-auction-listing-media-US1-TC13-1: Replacement stores without confirmation

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_9>` is a draft with a stored image at one gallery position.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A draft auction listing with at least two gallery images |
| `<replacement_image>` | A supported image different from the image being replaced |

**Steps:**

1. Open the media manager for `<listing_9>`.
2. Choose `<replacement_image>` for one stored image.
3. Check that position and the other gallery items.

**Expected Results:**

* `<replacement_image>` is stored immediately at the selected position.
* No confirm step appears.
* Other gallery items retain their positions.

<!-- trace:case id=g10.auction-listing-media.TC-ord rev=1 covers=g10.auction-listing-media.SC-35 -->
### grade10-site-auction-listing-media-US1-TC14-1: Direct-upload reorder holds on drop

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_10>` is a draft with direct-upload images in order A, B, C.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A draft auction listing with three direct-upload images in order A, B, C |

**Steps:**

1. Open the media manager for `<listing_10>`.
2. Drag C before A and drop it.
3. Leave and reopen the media manager.

**Expected Results:**

* The gallery order is C, A, B after the drop.
* The order remains C, A, B after reopening without a separate Save action.

<!-- trace:case id=g10.auction-listing-media.TC-stg rev=1 covers=g10.auction-listing-media.SC-36 -->
### grade10-site-auction-listing-media-US1-TC15-1: Staged inventory reorder waits for Save

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_11>` has inventory assets staged in the media manager but not saved.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A draft listing with two staged inventory assets |

**Steps:**

1. Reorder the staged inventory assets.
2. Leave the listing without saving.
3. Reopen the listing.

**Expected Results:**

* The stored listing retains its prior inventory order.
* The reordered inventory assets apply only after the listing is saved.

## Reconciliation

Two independent readings of the same anchors: QA1 wrote the blind cases
without sight of the scenarios, and Dev wrote the scenarios without sight of
the blind suite. QA2 reconciled both against the modified US-01 journey and
the upload feature-set root.

| Finding | Disposition |
| --- | --- |
| The preview, confirm and discard flow no longer matches the journey | **Deprecated:** `US1-TC4-1` and `US1-TC5-1`; `US1-TC3-2` carries the revised case and `SC-31` |
| A single supported file stores as soon as it is chosen | **Folded in:** `SC-31` and `US1-TC3-2` |
| Several files need deterministic append order | **Folded in:** `SC-32` and `US1-TC11-1` |
| Replacement follows the same immediate path | **Folded in:** `SC-33` and `US1-TC13-1` |
| Mixed selections need per-file refusal reasons without rolling back accepted files | **Folded in:** `SC-34` and `US1-TC12-1` |
| Direct-upload reorder and staged inventory reorder have different persistence timing | **Folded in:** `SC-35` and `SC-36`, walked by `US1-TC14-1` and `US1-TC15-1` |
| Existing accepted types, size bound, cap, remove confirmation, alt text, zoom and writable-state behavior | **Kept:** these remain covered by the durable suite and unchanged requirements |
| QA1 or Dev raised an unresolved product question | **None:** decisions Q1 to Q6 settle the changed behavior |
