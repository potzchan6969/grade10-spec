# grade10-site/auction/listing-media Test Cases

**Status:** reopened
**Reviewed:** 2026-09-07, lapsed 2026-10-05
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-auction-listing-media-US1: Operator attaches an image to a listing gallery

**As an** operator with catalogue grant,
**I want** to drop one or several supported images into a listing's gallery
and see each one stored as it lands,
**so that** photographing a card costs one move rather than a confirm per
file, and the gallery stays within the cap admin-listing sets.

<!-- trace:case id=g10.auction-listing-media.TC-pzu rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### grade10-site-auction-listing-media-US1-TC1-1: One-image listing publishes with no empty slots

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_1> is a draft with only one JPEG in the gallery.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A draft auction listing whose gallery holds exactly one JPEG |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open <listing_1>.
3. Create <listing_1>, then publish it.
4. Navigate to <listing_1 public url>.

**Expected Results:**

* <listing_1> is published.
* The details page shows that one image.
* No empty gallery slots are invented.

<!-- trace:case id=g10.auction-listing-media.TC-sga rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### grade10-site-auction-listing-media-US1-TC2-1: Accepted JPEG becomes a gallery image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_2> is a draft with fewer than eight media items.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A draft auction listing with fewer than eight media items |
| `<jpeg_ok>` | charizard-front.jpg, JPEG, under the media size bound |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open <listing_2>.
3. Upload <jpeg_ok> into the gallery and confirm.
4. Check <listing_2> on the admin listings surface.

**Expected Results:**

* <jpeg_ok> is stored in gallery order.
* The admin listings surface can show it on <listing_2>.

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

<!-- trace:case id=g10.auction-listing-media.TC-c94 rev=1 covers=g10.auction-listing-media.SC-c93 -->
### grade10-site-auction-listing-media-US1-TC6-1: Ninth media item is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_6> is a draft with eight media items.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A draft auction listing with eight media items |
| `<jpeg_ok>` | charizard-front.jpg, JPEG, under the media size bound |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open <listing_6>.
3. Upload <jpeg_ok> as a ninth image.

**Expected Results:**

* The upload is refused.
* The gallery still has eight items.

<!-- trace:case id=g10.auction-listing-media.TC-ark rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### grade10-site-auction-listing-media-US1-TC7-1: Unsupported type is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_7> is a draft open in the admin media manager.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A draft auction listing open in the media manager |
| `<pdf_file>` | grading-report.pdf, PDF |

**Steps:**

1. Upload <pdf_file> as gallery media.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-brl rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### grade10-site-auction-listing-media-US1-TC8-1: Oversized image is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_8>` is a draft open in the admin media manager.

**Test data:**

| Field | Value |
| --- | --- |
| listing_8 | A draft auction listing open in the media manager |
| oversized_image | An image larger than 100 mebibytes |

**Steps:**

1. Upload `<oversized_image>`.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-5c5 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### grade10-site-auction-listing-media-US1-TC9-1: Published listing can gain another image

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_9> is published with one gallery image and room under the eight-item cap.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A published auction listing with one gallery image and room under the cap |
| `<jpeg_second>` | A second JPEG under the media size bound |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open <listing_9>.
3. Upload <jpeg_second> and confirm.
4. Navigate to <listing_9 public url>.

**Expected Results:**

* The details page shows both images in gallery order.
* The first image is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-qd3 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### grade10-site-auction-listing-media-US1-TC10-1: Adding after close is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_10> is closed with one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A closed auction listing with one gallery image |
| `<jpeg_ok>` | charizard-front.jpg, JPEG, under the media size bound |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open <listing_10>.
3. Upload <jpeg_ok>.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

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

---

## grade10-site-auction-listing-media-US2: Operator inspects a stored image at zoom size

**As an** operator with catalogue grant,
**I want** the admin media manager to show each stored image at card size and
reveal it at zoom size on hover,
**so that** I can judge a card's condition without clicking through to it.

<!-- trace:case id=g10.auction-listing-media.TC-92w rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### grade10-site-auction-listing-media-US2-TC1-1: Media manager shows stored image at card size

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-02

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_11> is a draft with a stored gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A draft auction listing with one stored gallery image |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the media manager for <listing_11>.
3. Check the stored image.

**Expected Results:**

* That image shows at card size.

<!-- trace:case id=g10.auction-listing-media.TC-sss rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### grade10-site-auction-listing-media-US2-TC2-1: Hovering the magnify control shows zoom size

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-02

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_26> is open in the media manager with a stored gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_26>` | A draft auction listing with one stored gallery image, open in the media manager |

**Steps:**

1. Hover the magnify control on that image.
2. Check the zoom preview.

**Expected Results:**

* A zoom-size preview of that image is shown.
* That preview is at least three-quarters of the viewport height.

<!-- trace:case id=g10.auction-listing-media.TC-mkq rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### grade10-site-auction-listing-media-US2-TC3-1: Leaving the magnify control hides zoom

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-02

**Pre-conditions:**

* An admin holds the catalogue grant.
* The zoom-size preview for <listing_27> is visible from hovering the magnify control.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_27>` | A draft auction listing with one stored gallery image; zoom preview is visible |

**Steps:**

1. Move the pointer off the magnify control.

**Expected Results:**

* The zoom-size preview is hidden.

---

## grade10-site-auction-listing-media-US3: Operator corrects a listing's gallery images

**As an** operator with catalogue grant,
**I want** to replace and remove gallery images while the listing is still
writable,
**so that** I can fix a bad photograph without ever leaving a published
listing with no image at all.

<!-- trace:case id=g10.auction-listing-media.TC-8sq rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### grade10-site-auction-listing-media-US3-TC1-1: Replacing a gallery image on a published listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_12> is published with a gallery image at a position.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | A published auction listing with at least one gallery image |
| `<jpeg_replacement>` | A replacement JPEG under the media size bound |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open <listing_12>.
3. Replace that image with <jpeg_replacement> and confirm.
4. Check that position and the other gallery items.

**Expected Results:**

* That position holds <jpeg_replacement>.
* Other gallery items are unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-2we rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### grade10-site-auction-listing-media-US3-TC2-1: Removing the last image after create is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_13> is published with one JPEG.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_13>` | A published auction listing with exactly one JPEG |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open <listing_13>.
3. Remove that JPEG.

**Expected Results:**

* The removal is refused.
* The gallery still has that JPEG.

<!-- trace:case id=g10.auction-listing-media.TC-c4i rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### grade10-site-auction-listing-media-US3-TC3-1: Draft gallery image can be replaced and removed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_14> is a draft with one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | A draft auction listing with one gallery image |
| `<jpeg_replacement>` | A replacement JPEG under the media size bound |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open <listing_14>.
3. Replace the gallery image with <jpeg_replacement> and confirm.
4. Remove it.

**Expected Results:**

* <listing_14> has no gallery images.

---

## grade10-site-auction-listing-media-US4: Operator describes a gallery image with alt text

**As an** operator with catalogue grant,
**I want** to supply and later change optional alt text on a gallery image,
**so that** each image has an accessible name, falling back to the listing
title when I have written none.

<!-- trace:case id=g10.auction-listing-media.TC-ygm rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### grade10-site-auction-listing-media-US4-TC1-1: Missing alt uses the listing title

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* <listing_15> is published titled "1999 Charizard, PSA 10".
* Its first gallery image has no alt text.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_15>` | A published auction listing titled "1999 Charizard, PSA 10"; first gallery image has no alt |
| `<listing title>` | 1999 Charizard, PSA 10 |

**Steps:**

1. Navigate to <listing_15 public url>.
2. Check the first gallery image's accessible name.

**Expected Results:**

* That image's accessible name is <listing title>.

<!-- trace:case id=g10.auction-listing-media.TC-m2x rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### grade10-site-auction-listing-media-US4-TC2-1: Supplied alt is shown

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* <listing_16> is published.
* Its first gallery image has alt text <alt text>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_16>` | A published auction listing whose first gallery image has alt text |
| `<alt text>` | Holo Charizard, front of slab |

**Steps:**

1. Navigate to <listing_16 public url>.
2. Check the first gallery image's accessible name.

**Expected Results:**

* That image's accessible name is <alt text>.

<!-- trace:case id=g10.auction-listing-media.TC-eeh rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### grade10-site-auction-listing-media-US4-TC3-1: Alt can be edited on a published listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_17> is published with a gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_17>` | A published auction listing with a gallery image |
| `<alt text>` | Updated accessible name for the image |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open <listing_17>.
3. Change only that image's alt text to <alt text>.
4. Check the image bytes and <listing_17 public url>.

**Expected Results:**

* The image bytes are unchanged.
* The details page uses <alt text>.

<!-- trace:case id=g10.auction-listing-media.TC-rn2 rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### grade10-site-auction-listing-media-US4-TC4-1: Over-length alt is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_18> is a draft open with a gallery image that already has alt text.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_18>` | A draft auction listing open; gallery image already has alt text |
| `<previous alt>` | The alt text already stored on that image |
| `<alt text>` | A string longer than 200 characters |

**Steps:**

1. Set alt text to <alt text>.

**Expected Results:**

* The edit is refused.
* The stored alt remains <previous alt>.

---

## grade10-site-auction-listing-media-US5: Collector views a listing's gallery images

**As a** collector,
**I want** a listing's images at the size the surface needs, in gallery order,
**so that** I can pick a listing off the catalogue and study its images on the
details page.

<!-- trace:case id=g10.auction-listing-media.TC-v1b rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### grade10-site-auction-listing-media-US5-TC1-1: Catalogue shows the first gallery image at card size

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_19> is published.
* Its gallery is image A then image B.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_19>` | A published auction listing whose gallery is image A then image B |

**Steps:**

1. Navigate to <grade10 auction url>.
2. Find <listing_19>'s row.
3. Check which image is requested and shown.

**Expected Results:**

* The listing row shows image A at card size.
* It does not show image B on the card.
* That listing's card image is requested at size `card`.

<!-- trace:case id=g10.auction-listing-media.TC-3vh rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### grade10-site-auction-listing-media-US5-TC2-1: Details gallery uses thumb, detail, and zoom

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_20> is published with two gallery images.
* The details gallery is wide enough for a left rail beside the main frame.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_20>` | A published auction listing with two gallery images |

**Steps:**

1. Navigate to <listing_20 public url>.
2. Check the thumbnail rail, the main frame, and zoom.

**Expected Results:**

* The thumbnail rail requests size `thumb`.
* The main frame requests size `detail`.
* Zoom requests size `zoom`.

<!-- trace:case id=g10.auction-listing-media.TC-77a rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### grade10-site-auction-listing-media-US5-TC3-1: Unknown size is not found

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* A published gallery image on `<listing_21>` is available at `card`, `detail`, `thumb`, and `zoom`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_21 | A published auction listing with a gallery image |
| unknown size | A size name other than `card`, `detail`, `thumb`, or `zoom` |

**Steps:**

1. Request that image at `<unknown size>`.
2. Request an image that does not exist.

**Expected Results:**

* The unknown-size response matches a missing image.

<!-- trace:case id=g10.auction-listing-media.TC-mu3 rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### grade10-site-auction-listing-media-US5-TC4-1: Listing without a catalogue image still lists

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_22> is published with no gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_22>` | A published auction listing with no gallery images |

**Steps:**

1. Navigate to <grade10 auction url>.
2. Find <listing_22>'s row.

**Expected Results:**

* The listing appears with its title and price.
* No image is shown for it by this capability.

<!-- trace:case id=g10.auction-listing-media.TC-del rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### grade10-site-auction-listing-media-US5-TC5-1: Several images appear in gallery order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_23> is published with three gallery images uploaded in order A, B, C.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_23>` | A published auction listing with gallery images A, B, C in that order |

**Steps:**

1. Navigate to <listing_23 public url>.
2. Check the gallery.

**Expected Results:**

* The gallery shows three images in the order A, B, C.

<!-- trace:case id=g10.auction-listing-media.TC-ic0 rev=2 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### grade10-site-auction-listing-media-US5-TC6-2: One image has no thumbnail strip or navigation

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* <listing_24> is published with one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_24>` | A published listing with one gallery image |

**Steps:**

1. Navigate to <listing_24 public url>.
2. Check the gallery controls.

**Expected Results:**

* The image is shown.
* No thumbnail rail, previous control, or next control is shown.

<!-- trace:case id=g10.auction-listing-media.TC-l76 rev=2 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### grade10-site-auction-listing-media-US5-TC7-2: No images still shows the listing without navigation

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* <listing_25> is published without gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_25>` | A published listing with no gallery images |

**Steps:**

1. Navigate to <listing_25 public url>.
2. Check the gallery and the listing page.

**Expected Results:**

* The gallery has no image and no previous or next control.
* The listing title and bid panel remain visible.

<!-- trace:case id=g10.auction-listing-media.TC-pls rev=1 covers=g10.auction-listing-media.SC-5tk -->
### grade10-site-auction-listing-media-US5-TC8-1: Wide details gallery shows a left rail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_28> is published with two or more gallery images.
* The details gallery is wide enough for a left rail beside the main frame.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_28>` | A published auction listing with two or more gallery images |

**Steps:**

1. Navigate to <listing_28 public url>.
2. Check the gallery for a thumbnail rail beside the main frame.

**Expected Results:**

* A thumbnail rail is shown beside the main frame.

<!-- trace:case id=g10.auction-listing-media.TC-pbt rev=1 covers=g10.auction-listing-media.SC-cd3 -->
### grade10-site-auction-listing-media-US5-TC9-1: Stacked details gallery hides the rail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_29> is published with two or more gallery images.
* The details gallery is stacked and not wide enough for a left rail beside
  the main frame.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_29>` | A published auction listing with two or more gallery images |

**Steps:**

1. Navigate to <listing_29 public url> at a stacked gallery width.
2. Check for a thumbnail rail, previous/next.

**Expected Results:**

* No thumbnail rail is shown.
* Previous and next remain available.
* Carousel progress remains available.

## Settled

- Wide enough means the gallery can place a left rail beside the main frame;
  the implementation threshold stays in code.
- Stacked several-image galleries hide the rail; previous/next and progress
  remain.
- Named size `thumb` applies when the rail is shown; `detail` and `zoom`
  still apply to the main frame.
- A one-image details gallery has no rail or previous/next. An empty details
  gallery has no image or previous/next while the listing page remains.

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

**Run:** Blind pass read Purpose (durable), Feature set (delta),
user-journeys.md (US-05), proposal.md, decisions.md (goals, non-goals,
Q1–Q4, empty Raised), PRD Media Gallery strip lines, and durable
feature-tcs.md for id continuity with Reconciliation stripped. Denied:
every Requirements section, openspec/specs/ beyond those excerpts,
openspec/changes/archive/.

| Finding | Disposition |
| --- | --- |
| Details gallery uses thumb, detail, and zoom when a rail is shown | Folded as covered by `grade10-site-auction-listing-media-SC-22` / `grade10-site-auction-listing-media-US5-TC2-1` |
| Wide details gallery shows a left rail | Folded as covered by `grade10-site-auction-listing-media-SC-29` / `grade10-site-auction-listing-media-US5-TC8-1` |
| Stacked details gallery hides the rail, keeps previous/next and progress | Folded as covered by `grade10-site-auction-listing-media-SC-30` / `grade10-site-auction-listing-media-US5-TC9-1` |
| One details image has no rail or previous/next | Revised durable `grade10-site-auction-listing-media-US5-TC6-1` as `TC6-2`, keeping trace id `g10.auction-listing-media.TC-ic0` at rev 2, for `grade10-site-auction-listing-media-SC-27` |
| Empty details gallery leaves the listing visible without previous/next | Revised durable `grade10-site-auction-listing-media-US5-TC7-1` as `TC7-2`, keeping trace id `g10.auction-listing-media.TC-l76` at rev 2, for `grade10-site-auction-listing-media-SC-28` |
| Details order | Covered by durable `grade10-site-auction-listing-media-SC-26` / `US5-TC5-1` — unchanged by this change |
| Raised questions from the blind pass | None — Q1–Q4 already settled width rule, stacked replacement, ListingGallery carve-out, and unnamed threshold |

**Uncovered anchors:** none after the stated scenario and case patches.
