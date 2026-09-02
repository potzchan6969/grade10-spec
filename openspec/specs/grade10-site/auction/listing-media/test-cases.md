# grade10-site/auction/listing-media Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-01, tcs-rules r1

## listing-media-US1: Operator attaches an image to a listing gallery

**As an** operator with catalogue grant,
**I want** to upload a supported image into a listing's gallery and confirm it
from a preview,
**so that** only the file I meant to store is sent, and the gallery stays
within the cap admin-listing sets.

### listing-media-US1-TC1-1: One-image listing publishes with no empty slots

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
A draft listing holds only one JPEG in the gallery. Operator has catalogue grant.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft listing.
3. Create the listing, then publish it.
4. Open the listing's public details page.

**Expected Results:**

* The listing is published.
* The details page shows that one image.
* No empty gallery slots are invented.

### listing-media-US1-TC2-1: Accepted JPEG becomes a gallery image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
A draft listing has fewer than eight media items. Operator has catalogue grant.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft listing.
3. Upload a JPEG under the media size bound into the gallery.
4. Check the listing on the admin listings surface.

**Expected Results:**

* That image is stored in gallery order.
* The admin listings surface can show it on that listing.

### listing-media-US1-TC3-1: Choosing a file shows a preview without uploading

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
A draft listing has an empty gallery slot the operator is filling.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft listing's media manager.
3. Select a JPEG under the media size bound.
4. Check the preview and the stored gallery.

**Expected Results:**

* The admin media manager shows a preview of that file.
* The listing still has no new stored image for that slot.

### listing-media-US1-TC4-1: Confirming the preview stores the image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
An operator has selected a JPEG for a draft listing gallery slot and sees its preview.

**Steps:**

1. Confirm the upload.
2. Check that gallery slot and the preview.

**Expected Results:**

* That slot holds the image.
* The preview is cleared.

### listing-media-US1-TC5-1: Discarding the preview leaves the gallery unchanged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
An operator has selected an image for a draft listing gallery slot and sees its preview.

**Steps:**

1. Discard the preview without confirming.
2. Check the gallery and the preview.

**Expected Results:**

* The gallery is unchanged.
* The preview is cleared.
* No upload was sent.

### listing-media-US1-TC6-1: Ninth media item is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
A draft listing has eight media items.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft listing.
3. Upload a ninth image.

**Expected Results:**

* The upload is refused.
* The gallery still has eight items.

### listing-media-US1-TC7-1: Unsupported type is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
A draft listing is open in the admin media manager.

**Steps:**

1. Upload a PDF as gallery media.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

### listing-media-US1-TC8-1: Oversized image is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
A draft listing is open in the admin media manager.

**Test data:**

| Field | Value |
| --- | --- |
| File size | larger than 104857600 bytes |

**Steps:**

1. Upload an image larger than 104857600 bytes.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

### listing-media-US1-TC9-1: Published listing can gain another image

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
A published listing has one gallery image and room under the eight-item cap.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Upload a second JPEG.
4. Open the listing's public details page.

**Expected Results:**

* The details page shows both images in gallery order.
* The first image is unchanged.

### listing-media-US1-TC10-1: Adding after close is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-01

**Pre-conditions:**
A closed listing has one gallery image.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Upload another image.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

---

## listing-media-US2: Operator inspects a stored image at zoom size

**As an** operator with catalogue grant,
**I want** the admin media manager to show each stored image at card size and
reveal it at zoom size on hover,
**so that** I can judge a card's condition without clicking through to it.

### listing-media-US2-TC1-1: Media manager shows stored image at card size

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-02

**Pre-conditions:**
A draft listing has a stored gallery image. Operator has catalogue grant.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the media manager for that listing.
3. Check the stored image.

**Expected Results:**

* That image shows at card size.

### listing-media-US2-TC2-1: Hovering the magnify control shows zoom size

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-02

**Pre-conditions:**
A draft listing with a stored gallery image is open in the media manager.

**Steps:**

1. Hover the magnify control on that image.
2. Check the zoom preview.

**Expected Results:**

* A zoom-size preview of that image is shown.
* That preview is at least three-quarters of the viewport height.

### listing-media-US2-TC3-1: Leaving the magnify control hides zoom

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-02

**Pre-conditions:**
The zoom-size preview is visible from hovering the magnify control.

**Steps:**

1. Move the pointer off the magnify control.

**Expected Results:**

* The zoom-size preview is hidden.

---

## listing-media-US3: Operator corrects a listing's gallery images

**As an** operator with catalogue grant,
**I want** to replace and remove gallery images while the listing is still
writable,
**so that** I can fix a bad photograph without ever leaving a published
listing with no image at all.

### listing-media-US3-TC1-1: Replacing a gallery image on a published listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-03

**Pre-conditions:**
A published listing has a gallery image at a position. Operator has catalogue grant.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Replace that image.
4. Check that position and the other gallery items.

**Expected Results:**

* That position holds the new image.
* Other gallery items are unchanged.

### listing-media-US3-TC2-1: Removing the last image after create is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-03

**Pre-conditions:**
A published listing has one JPEG.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Remove that JPEG.

**Expected Results:**

* The removal is refused.
* The gallery still has that JPEG.

### listing-media-US3-TC3-1: Draft gallery image can be replaced and removed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-03

**Pre-conditions:**
A draft listing has one gallery image.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft listing.
3. Replace the gallery image.
4. Remove it.

**Expected Results:**

* The listing has no gallery images.

---

## listing-media-US4: Operator describes a gallery image with alt text

**As an** operator with catalogue grant,
**I want** to supply and later change optional alt text on a gallery image,
**so that** each image has an accessible name, falling back to the listing
title when I have written none.

### listing-media-US4-TC1-1: Missing alt uses the listing title

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-04

**Pre-conditions:**
A published listing titled "1999 Charizard, PSA 10" whose first gallery image has no alt text.

**Test data:**

| Field | Value |
| --- | --- |
| Listing title | 1999 Charizard, PSA 10 |

**Steps:**

1. Navigate to <that listing's public url>.
2. Check the first gallery image's accessible name.

**Expected Results:**

* That image's accessible name is "1999 Charizard, PSA 10".

### listing-media-US4-TC2-1: Supplied alt is shown

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-04

**Pre-conditions:**
A published listing whose first gallery image has alt text "Holo Charizard, front of slab".

**Test data:**

| Field | Value |
| --- | --- |
| Alt text | Holo Charizard, front of slab |

**Steps:**

1. Navigate to <that listing's public url>.
2. Check the first gallery image's accessible name.

**Expected Results:**

* That image's accessible name is "Holo Charizard, front of slab".

### listing-media-US4-TC3-1: Alt can be edited on a published listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-04

**Pre-conditions:**
A published listing has a gallery image. Operator has catalogue grant.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Change only that image's alt text.
4. Check the image bytes and the public details page.

**Expected Results:**

* The image bytes are unchanged.
* The details page uses the new alt text.

### listing-media-US4-TC4-1: Over-length alt is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-04

**Pre-conditions:**
A draft listing is open. The gallery image already has alt text.

**Steps:**

1. Set alt text longer than 200 characters.

**Expected Results:**

* The edit is refused.
* Any previous alt text is unchanged.

---

## listing-media-US5: Collector views a listing's gallery images

**As a** collector,
**I want** a listing's images at the size the surface needs, in gallery order,
**so that** I can pick a listing off the catalogue and study its images on the
details page.

### listing-media-US5-TC1-1: Catalogue shows the first gallery image at card size

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-05

**Pre-conditions:**
A published listing whose gallery is image A then image B.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Find that listing's row.
3. Check which image is requested and shown.

**Expected Results:**

* The listing row shows image A at card size.
* It does not show image B on the card.
* That listing's card image is requested at size `card`.

### listing-media-US5-TC2-1: Details gallery uses thumb, detail, and zoom

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-05

**Pre-conditions:**
A published listing with two gallery images.

**Steps:**

1. Navigate to <that listing's public url>.
2. Check the thumbnail strip, the main frame, and zoom.

**Expected Results:**

* The thumbnail strip requests size `thumb`.
* The main frame requests size `detail`.
* Zoom requests size `zoom`.

### listing-media-US5-TC3-1: Unknown size is not found

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** listing-media-US-05

**Pre-conditions:**
A published gallery image is available at `card`, `detail`, `thumb`, and `zoom`.

**Steps:**

1. Request that image at a size other than `card`, `detail`, `thumb`, or `zoom`.
2. Request an image that does not exist.

**Expected Results:**

* The unknown-size response matches a missing image.

### listing-media-US5-TC4-1: Listing without a catalogue image still lists

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-05

**Pre-conditions:**
A published listing has no gallery images.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Find that listing's row.

**Expected Results:**

* The listing appears with its title and price.
* No image is shown for it by this capability.

### listing-media-US5-TC5-1: Several images appear in gallery order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-05

**Pre-conditions:**
A published listing with three gallery images uploaded in order A, B, C.

**Steps:**

1. Navigate to <that listing's public url>.
2. Check the gallery.

**Expected Results:**

* The gallery shows three images in the order A, B, C.

### listing-media-US5-TC6-1: One image has no thumbnail strip

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-05

**Pre-conditions:**
A published listing with only one gallery image.

**Steps:**

1. Navigate to <that listing's public url>.
2. Check the gallery.

**Expected Results:**

* The gallery shows that image.
* It does not show a thumbnail strip.

### listing-media-US5-TC7-1: No images still shows the listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** listing-media-US-05

**Pre-conditions:**
A published listing with no gallery images.

**Steps:**

1. Navigate to <that listing's public url>.
2. Check the page and the gallery.

**Expected Results:**

* The page shows the listing's title and bid panel.
* The gallery has no image.
