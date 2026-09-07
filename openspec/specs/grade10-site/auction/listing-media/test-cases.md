# grade10-site/auction/listing-media Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-07, tcs-rules r2

## grade10-site-auction-listing-media-US1: Operator attaches an image to a listing gallery

**As an** operator with catalogue grant,
**I want** to upload a supported image into a listing's gallery and confirm it
from a preview,
**so that** only the file I meant to store is sent, and the gallery stays
within the cap admin-listing sets.

### grade10-site-auction-listing-media-US1-TC1-1: One-image listing publishes with no empty slots

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US1-TC2-1: Accepted JPEG becomes a gallery image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US1-TC3-1: Choosing a file shows a preview without uploading

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_3> is a draft with an empty gallery slot the admin is filling.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A draft auction listing with an empty gallery slot being filled |
| `<jpeg_ok>` | charizard-front.jpg, JPEG, under the media size bound |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the media manager for <listing_3>.
3. Select <jpeg_ok>.
4. Check the preview and the stored gallery.

**Expected Results:**

* The media manager shows a preview of <jpeg_ok>.
* <listing_3> still has no new stored image for that slot.

### grade10-site-auction-listing-media-US1-TC4-1: Confirming the preview stores the image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin has selected <jpeg_ok> for a <listing_4> gallery slot and sees its preview.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A draft auction listing with a selected JPEG preview in one gallery slot |
| `<jpeg_ok>` | charizard-front.jpg, JPEG, under the media size bound |

**Steps:**

1. Confirm the upload.
2. Check that gallery slot and the preview.

**Expected Results:**

* That slot holds <jpeg_ok>.
* The preview is cleared.

### grade10-site-auction-listing-media-US1-TC5-1: Discarding the preview leaves the gallery unchanged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin has selected an image for a <listing_5> gallery slot and sees its preview.

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

### grade10-site-auction-listing-media-US1-TC6-1: Ninth media item is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US1-TC7-1: Unsupported type is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* <listing_8> is a draft open in the admin media manager.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A draft auction listing open in the media manager |
| `<oversized_image>` | An image larger than 100 mebibytes |

**Steps:**

1. Upload <oversized_image>.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

### grade10-site-auction-listing-media-US1-TC9-1: Published listing can gain another image

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US1-TC10-1: Adding after close is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

---

## grade10-site-auction-listing-media-US2: Operator inspects a stored image at zoom size

**As an** operator with catalogue grant,
**I want** the admin media manager to show each stored image at card size and
reveal it at zoom size on hover,
**so that** I can judge a card's condition without clicking through to it.

### grade10-site-auction-listing-media-US2-TC1-1: Media manager shows stored image at card size

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US2-TC2-1: Hovering the magnify control shows zoom size

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US2-TC3-1: Leaving the magnify control hides zoom

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US3-TC1-1: Replacing a gallery image on a published listing

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

### grade10-site-auction-listing-media-US3-TC2-1: Removing the last image after create is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US3-TC3-1: Draft gallery image can be replaced and removed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US4-TC1-1: Missing alt uses the listing title

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US4-TC2-1: Supplied alt is shown

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

### grade10-site-auction-listing-media-US4-TC3-1: Alt can be edited on a published listing

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

### grade10-site-auction-listing-media-US4-TC4-1: Over-length alt is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US5-TC1-1: Catalogue shows the first gallery image at card size

**Classification:**

* **Severity:** critical
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

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_20>` | A published auction listing with two gallery images |

**Steps:**

1. Navigate to <listing_20 public url>.
2. Check the thumbnail strip, the main frame, and zoom.

**Expected Results:**

* The thumbnail strip requests size `thumb`.
* The main frame requests size `detail`.
* Zoom requests size `zoom`.

### grade10-site-auction-listing-media-US5-TC3-1: Unknown size is not found

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* A published gallery image on <listing_21> is available at `card`, `detail`, `thumb`, and `zoom`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_21>` | A published auction listing with a gallery image |
| `<unknown size>` | A size name other than `card`, `detail`, `thumb`, or `zoom` |

**Steps:**

1. Request that image at <unknown size>.
2. Request an image that does not exist.

**Expected Results:**

* The unknown-size response matches a missing image.

### grade10-site-auction-listing-media-US5-TC4-1: Listing without a catalogue image still lists

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

### grade10-site-auction-listing-media-US5-TC5-1: Several images appear in gallery order

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

### grade10-site-auction-listing-media-US5-TC6-1: One image has no thumbnail strip

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_24> is published with only one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_24>` | A published auction listing with exactly one gallery image |

**Steps:**

1. Navigate to <listing_24 public url>.
2. Check the gallery.

**Expected Results:**

* The gallery shows that image.
* It does not show a thumbnail strip.

### grade10-site-auction-listing-media-US5-TC7-1: No images still shows the listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_25> is published with no gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_25>` | A published auction listing with no gallery images |

**Steps:**

1. Navigate to <listing_25 public url>.
2. Check the page and the gallery.

**Expected Results:**

* The page shows the listing's title and bid panel.
* The gallery has no image.
