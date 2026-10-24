# grade10-site/auction/listing-media Test Cases

**Status:** reopened · 20/31
**Reviewed:** 2026-09-07, lapsed 2026-10-05
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<admin listings url>` is the Auction listings page of the Grade10 admin console; a listing's media manager opens from its editor there. `<auction url>` is the Grade10 auction catalogue, and a listing's page opens from its card.
* The operator is admin(holds the catalogue grant). A supported image is a JPEG, PNG, WebP or AVIF file of at most 100 mebibytes; a gallery holds at most eight media items.

## Walk 1: Build a draft gallery by choosing, dropping and arranging images

Starting state:

- admin(holds the catalogue grant) has `<draft listing>`'s media manager open.
- `<draft listing>`'s gallery holds only `<existing image>`.

Shared test data:

| Field | Value |
| --- | --- |
| draft listing | A draft listing whose gallery holds one image |
| existing image | The gallery's one stored image |
| chosen image | charizard-front.jpg, a 3.6 MB JPEG |
| batch images | three supported images, chosen in the order A, B, C |
| replacement image | charizard-back.png, a 2.1 MB PNG |

### Route

1. Choose `<chosen image>` with the file picker.
   - It stores at once, with no preview, confirm or discard step. `g10.auction-listing-media.US1-TC3`
2. Drop `<batch images>` onto the gallery together.
   - Each stores without a confirm step, appended after `<chosen image>` in the order A, B, C. `g10.auction-listing-media.US1-TC11`
3. Choose `<replacement image>` for the image in the second position.
   - It stores at once in the second position, and every other item keeps its position. `g10.auction-listing-media.US1-TC13`
4. Drag the last image before the first, drop it, then close and reopen the media manager.
   - The new order shows after the drop and is still there after reopening, with no Save. `g10.auction-listing-media.US1-TC14`

## Walk 2: Inspect and correct a published listing's gallery

Starting state:

- admin(holds the catalogue grant) has `<published listing>`'s media manager open.
- `<published listing>` is published, with `<first image>` described by `<old alt>` and room under the eight-item cap.

Shared test data:

| Field | Value |
| --- | --- |
| published listing | A published listing with one gallery image |
| first image | The listing's one stored image |
| old alt | Holo Charizard, front of slab |
| second image | charizard-side.jpg, a 2.4 MB JPEG |
| replacement image | charizard-side-retake.jpg, a 2.6 MB JPEG |
| new alt | Holo Charizard, front of slab, centred |

### Route

1. Read `<first image>` in the media manager.
   - It shows at card size. `g10.auction-listing-media.US2-TC1`
2. Hover the magnify control on `<first image>`, then move the pointer off it.
   - A zoom-size preview at least three-quarters of the viewport high shows while hovering. `g10.auction-listing-media.US2-TC2`
   - It hides when the pointer leaves. `g10.auction-listing-media.US2-TC3`
3. Choose `<second image>`, then open the listing's page.
   - The page shows both images in gallery order, the first unchanged. `g10.auction-listing-media.US1-TC9`
   - `<first image>` reads `<old alt>` as its accessible name. `g10.auction-listing-media.US4-TC2`
4. In the media manager, choose `<replacement image>` for the second image.
   - The second position holds `<replacement image>`, and the first is unchanged. `g10.auction-listing-media.US3-TC1`
5. Change only `<first image>`'s alt text to `<new alt>`, then reload the listing's page.
   - The image is unchanged, and the page names it `<new alt>`. `g10.auction-listing-media.US4-TC3`

## Walk 3: Read galleries on the catalogue and on listing pages

Starting state:

- customer is on `<auction url>` at a width where a listing page's gallery has room for a left rail.
- `<three image listing>`, `<one image listing>` and `<no image listing>` are published.

Shared test data:

| Field | Value |
| --- | --- |
| three image listing | A published listing titled 1999 Charizard, PSA 10, its gallery images A, B, C in that order, A with no alt text |
| one image listing | A published listing with one gallery image |
| no image listing | A published listing with no gallery image |

### Route

1. Find the three listings' cards.
   - `<three image listing>`'s card shows image A at card size, not B. `g10.auction-listing-media.US5-TC1`
   - `<no image listing>`'s card shows its title and price with no image. `g10.auction-listing-media.US5-TC4`
2. Open `<three image listing>`.
   - The gallery shows A, B, C in that order. `g10.auction-listing-media.US5-TC5`
   - A thumbnail rail shows beside the main frame. `g10.auction-listing-media.US5-TC8`
   - The rail shows thumbnails, the main frame the detail-size image, and zoom the image at zoom size. `g10.auction-listing-media.US5-TC2`
   - Image A's accessible name is 1999 Charizard, PSA 10. `g10.auction-listing-media.US4-TC1`
3. Narrow the window until the gallery stacks.
   - The rail is gone; previous, next and the carousel progress remain. `g10.auction-listing-media.US5-TC9`
4. Open `<one image listing>`, then `<no image listing>`.
   - The one image shows, with no rail, previous or next. `g10.auction-listing-media.US5-TC6`
   - The listing with none shows no image and no previous or next, and its title and bid panel remain. `g10.auction-listing-media.US5-TC7`

## g10.auction-listing-media.US1: Operator attaches an image to a listing gallery

**As an** operator with catalogue grant,
**I want** to drop one or several supported images into a listing's gallery
and see each one stored as it lands,
**so that** photographing a card costs one move rather than a confirm per
file, and the gallery stays within the cap admin-listing sets.

<!-- trace:case id=g10.auction-listing-media.TC-oyk rev=2 covers=g10.auction-listing-media.SC-31 -->
### g10.auction-listing-media.US1-TC3: Choosing a file stores it at once

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_3>`'s media manager open.
* `<listing_3>` is a draft with fewer than eight media items.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A draft listing with 1 to 7 media items |
| `<image>` | charizard-front.jpg, a 3.6 MB JPEG |

**Steps:**

1. Choose `<image>` with the file picker.
2. Read the gallery.

**Expected Results:**

* `<image>` is stored in the gallery at once.
* No preview, confirm or discard step appears.

<!-- trace:case id=g10.auction-listing-media.TC-bat rev=1 covers=g10.auction-listing-media.SC-32 -->
### g10.auction-listing-media.US1-TC11: Several dropped files append after the last item in selection order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_11>`'s media manager open.
* `<listing_11>` is a draft whose gallery holds only `<existing image>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A draft listing with one gallery image |
| `<existing image>` | The gallery's one stored image |
| `<batch images>` | three supported images, selected in the order A, B, C |

**Steps:**

1. Drop `<batch images>` onto the gallery together.
2. Read the gallery order.

**Expected Results:**

* Each image stores without a confirm step.
* The gallery reads `<existing image>`, then A, B and C.

<!-- trace:case id=g10.auction-listing-media.TC-rep rev=1 covers=g10.auction-listing-media.SC-33 -->
### g10.auction-listing-media.US1-TC13: A replacement stores at once in place

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_13>`'s media manager open.
* `<listing_13>` is a draft with three gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_13>` | A draft listing with three gallery images |
| `<replacement image>` | charizard-back.png, a 2.1 MB PNG |

**Steps:**

1. Choose `<replacement image>` for the second image.
2. Read the gallery.

**Expected Results:**

* `<replacement image>` is stored at once in the second position, with no confirm step.
* The first and third images keep their positions.

<!-- trace:case id=g10.auction-listing-media.TC-ord rev=1 covers=g10.auction-listing-media.SC-35 -->
### g10.auction-listing-media.US1-TC14: A dropped reorder of uploaded images holds without Save

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_14>`'s media manager open.
* `<listing_14>` is a draft whose uploaded images read A, B, C.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | A draft listing with three uploaded images in the order A, B, C |

**Steps:**

1. Drag C before A and drop it.
2. Close and reopen the media manager.

**Expected Results:**

* After step 1 the gallery reads C, A, B.
* After step 2 it still reads C, A, B, with no Save selected.

---

## g10.auction-listing-media.US2: Operator inspects a stored image at zoom size

**As an** operator with catalogue grant,
**I want** the admin media manager to show each stored image at card size and
reveal it at zoom size on hover,
**so that** I can judge a card's condition without clicking through to it.

<!-- trace:case id=g10.auction-listing-media.TC-92w rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### g10.auction-listing-media.US2-TC1: The media manager shows a stored image at card size

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-02

**Pre-conditions:**

* admin(holds the catalogue grant) is on `<admin listings url>`.
* `<listing_16>` is a draft with one stored gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_16>` | A draft listing with one stored gallery image |

**Steps:**

1. Open `<listing_16>`'s media manager and read its image.

**Expected Results:**

* The image shows at card size.

<!-- trace:case id=g10.auction-listing-media.TC-sss rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### g10.auction-listing-media.US2-TC2: Hovering the magnify control shows the image at zoom size

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-02

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_17>`'s media manager open.
* `<listing_17>` is a draft with one stored gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_17>` | A draft listing with one stored gallery image |

**Steps:**

1. Hover the magnify control on the image.

**Expected Results:**

* A zoom-size preview of the image shows.
* The preview is at least three-quarters of the viewport high.

<!-- trace:case id=g10.auction-listing-media.TC-mkq rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### g10.auction-listing-media.US2-TC3: Leaving the magnify control hides the zoom

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-02

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_18>`'s media manager open, with the zoom preview of its image showing from a hover on the magnify control.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_18>` | A draft listing with one stored gallery image |

**Steps:**

1. Move the pointer off the magnify control.

**Expected Results:**

* The zoom preview hides.

---

## g10.auction-listing-media.US3: Operator corrects a listing's gallery images

**As an** operator with catalogue grant,
**I want** to replace and remove gallery images while the listing is still
writable,
**so that** I can fix a bad photograph without ever leaving a published
listing with no image at all.

<!-- trace:case id=g10.auction-listing-media.TC-8sq rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### g10.auction-listing-media.US3-TC1: A gallery image on a published listing is replaced

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_19>`'s media manager open.
* `<listing_19>` is published with two gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_19>` | A published listing with two gallery images |
| `<replacement image>` | charizard-side-retake.jpg, a 2.6 MB JPEG |

**Steps:**

1. Choose `<replacement image>` for the second image.
2. Read the gallery.

**Expected Results:**

* The second position holds `<replacement image>`.
* The first image is unchanged.

---

## g10.auction-listing-media.US4: Operator describes a gallery image with alt text

**As an** operator with catalogue grant,
**I want** to supply and later change optional alt text on a gallery image,
**so that** each image has an accessible name, falling back to the listing
title when I have written none.

<!-- trace:case id=g10.auction-listing-media.TC-ygm rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC1: An image with no alt text takes the listing title as its name

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* `<listing_22>` is published, titled `<listing title>`, and its first gallery image has no alt text.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_22>` | A published listing whose first gallery image has no alt text |
| `<listing title>` | 1999 Charizard, PSA 10 |

**Steps:**

1. Open `<listing_22>`'s page and read the first image's accessible name.

**Expected Results:**

* The first image's accessible name is `<listing title>`.

<!-- trace:case id=g10.auction-listing-media.TC-m2x rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC2: An image's alt text is its accessible name

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* `<listing_23>` is published, and its first gallery image has alt text `<alt text>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_23>` | A published listing whose first gallery image has alt text |
| `<alt text>` | Holo Charizard, front of slab |

**Steps:**

1. Open `<listing_23>`'s page and read the first image's accessible name.

**Expected Results:**

* The first image's accessible name is `<alt text>`.

<!-- trace:case id=g10.auction-listing-media.TC-eeh rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC3: Alt text changes on a published listing without touching the image

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_24>`'s media manager open.
* `<listing_24>` is published with a gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_24>` | A published listing with a gallery image |
| `<alt text>` | Holo Charizard, front of slab, centred |

**Steps:**

1. Change only the image's alt text to `<alt text>`.
2. Read the image in the media manager, then on `<listing_24>`'s page.

**Expected Results:**

* The image is unchanged.
* The page names the image `<alt text>`.

---

## g10.auction-listing-media.US5: Collector views a listing's gallery images

**As a** collector,
**I want** a listing's images at the size the surface needs, in gallery order,
**so that** I can pick a listing off the catalogue and study its images on the
details page.

<!-- trace:case id=g10.auction-listing-media.TC-v1b rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC1: The catalogue card shows the first gallery image at card size

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* customer is on `<auction url>`.
* `<listing_26>` is published, its gallery A then B.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_26>` | A published listing whose gallery is image A, then image B |

**Steps:**

1. Find `<listing_26>`'s card.

**Expected Results:**

* The card shows image A at card size.
* The card does not show image B.

<!-- trace:case id=g10.auction-listing-media.TC-mu3 rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC4: A listing with no image still lists on the catalogue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* customer is on `<auction url>`.
* `<listing_29>` is published with no gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_29>` | A published listing with no gallery image |

**Steps:**

1. Find `<listing_29>`'s card.

**Expected Results:**

* The card shows its title and price.
* The card shows no image.

<!-- trace:case id=g10.auction-listing-media.TC-del rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC5: Several images show in gallery order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* `<listing_30>` is published with gallery images A, B, C in that order.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_30>` | A published listing whose gallery is images A, B, C |

**Steps:**

1. Open `<listing_30>`'s page and read the gallery.

**Expected Results:**

* The gallery shows A, B, C in that order.

<!-- trace:case id=g10.auction-listing-media.TC-pls rev=1 covers=g10.auction-listing-media.SC-5tk -->
### g10.auction-listing-media.US5-TC8: A wide gallery shows a thumbnail rail

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* customer's window is wide enough for the gallery to place a left rail beside its main frame.
* `<listing_33>` is published with two or more gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_33>` | A published listing with two to eight gallery images |

**Steps:**

1. Open `<listing_33>`'s page and read the gallery.

**Expected Results:**

* A thumbnail rail shows beside the main frame.

<!-- trace:case id=g10.auction-listing-media.TC-3vh rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC2: The gallery shows thumbnails, the detail image and the zoom image

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* customer's window is wide enough for the gallery to place a left rail beside its main frame.
* `<listing_27>` is published with two gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_27>` | A published listing with two gallery images |

**Steps:**

1. Open `<listing_27>`'s page.
2. Read the thumbnail rail and the main frame, then open zoom.

**Expected Results:**

* The rail shows each image as a thumbnail.
* The main frame shows the selected image at detail size.
* Zoom shows it at zoom size.

<!-- trace:case id=g10.auction-listing-media.TC-pbt rev=1 covers=g10.auction-listing-media.SC-cd3 -->
### g10.auction-listing-media.US5-TC9: A stacked gallery drops the rail and keeps its navigation

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* customer's window is narrow enough for the gallery to stack.
* `<listing_34>` is published with two or more gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_34>` | A published listing with two to eight gallery images |

**Steps:**

1. Open `<listing_34>`'s page and read the gallery.

**Expected Results:**

* No thumbnail rail shows.
* Previous, next and the carousel progress remain.

<!-- trace:case id=g10.auction-listing-media.TC-ic0 rev=2 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC6: One image shows no rail or navigation

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* `<listing_31>` is published with one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_31>` | A published listing with one gallery image |

**Steps:**

1. Open `<listing_31>`'s page and read the gallery.

**Expected Results:**

* The image shows.
* No thumbnail rail, previous or next control shows.

<!-- trace:case id=g10.auction-listing-media.TC-l76 rev=2 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC7: A listing with no image still shows its page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* `<listing_32>` is published with no gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_32>` | A published listing with no gallery image |

**Steps:**

1. Open `<listing_32>`'s page and read it.

**Expected Results:**

* The gallery shows no image and no previous or next control.
* The listing's title and bid panel remain.

## Ungrouped

### g10.auction-listing-media.US1: Operator attaches an image to a listing gallery

<!-- trace:case id=g10.auction-listing-media.TC-4xd rev=1 -->
#### g10.auction-listing-media.US1-TC1: A one-image listing publishes with no empty slots

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) is on `<admin listings url>`.
* `<listing_1>` is a draft whose gallery holds only the JPEG `<existing image>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A draft listing whose gallery holds exactly one JPEG |
| `<existing image>` | The gallery's one JPEG |

**Steps:**

1. Open `<listing_1>`, create it, then publish it.
2. Open `<listing_1>`'s page.

**Expected Results:**

* Step 1 publishes `<listing_1>`.
* Step 2 shows `<existing image>`, and no empty gallery slot.

<!-- trace:case id=g10.auction-listing-media.TC-sga rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
#### g10.auction-listing-media.US1-TC2: An accepted JPEG becomes a gallery image

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) is on `<admin listings url>`.
* `<listing_2>` is a draft with fewer than eight media items.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A draft listing with 1 to 7 media items |
| `<image>` | charizard-front.jpg, a 3.6 MB JPEG |

**Steps:**

1. Open `<listing_2>`'s media manager and choose `<image>`.
2. Return to `<admin listings url>` and read `<listing_2>`.

**Expected Results:**

* `<image>` is stored last in gallery order.
* `<listing_2>` shows it on the listings page.

<!-- trace:case id=g10.auction-listing-media.TC-c94 rev=1 covers=g10.auction-listing-media.SC-c93 -->
#### g10.auction-listing-media.US1-TC6: A ninth media item is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_6>`'s media manager open.
* `<listing_6>` is a draft with eight media items.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A draft listing with eight media items (fixed boundary: the cap) |
| `<image>` | charizard-front.jpg, a 3.6 MB JPEG |

**Steps:**

1. Choose `<image>`.

**Expected Results:**

* The upload is refused.
* The gallery still holds eight items.

<!-- trace:case id=g10.auction-listing-media.TC-ark rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
#### g10.auction-listing-media.US1-TC7: An unsupported file type is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_7>`'s media manager open; `<listing_7>` is a draft.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A draft listing with 1 to 7 media items |
| `<pdf file>` | grading-report.pdf, a 1.3 MB PDF |

**Steps:**

1. Choose `<pdf file>`.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-brl rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
#### g10.auction-listing-media.US1-TC8: An image over 100 mebibytes is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_8>`'s media manager open; `<listing_8>` is a draft.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A draft listing with 1 to 7 media items |
| `<oversized image>` | A JPEG of 104857601 bytes or more (fixed boundary: one byte over 100 mebibytes) |

**Steps:**

1. Choose `<oversized image>`.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-5c5 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
#### g10.auction-listing-media.US1-TC9: A published listing gains another image

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_9>`'s media manager open.
* `<listing_9>` is published with one gallery image and room under the cap.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A published listing with one gallery image |
| `<second image>` | charizard-side.jpg, a 2.4 MB JPEG |

**Steps:**

1. Choose `<second image>`.
2. Open `<listing_9>`'s page.

**Expected Results:**

* The page shows both images in gallery order.
* The first image is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-qd3 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
#### g10.auction-listing-media.US1-TC10: Adding an image after the close is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_10>`'s media manager open.
* `<listing_10>` is closed with one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A closed listing with one gallery image |
| `<image>` | charizard-front.jpg, a 3.6 MB JPEG |

**Steps:**

1. Choose `<image>`.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-ref rev=1 covers=g10.auction-listing-media.SC-34 -->
#### g10.auction-listing-media.US1-TC12: Refused files in a mixed selection each name their reason

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_12>`'s media manager open.
* `<listing_12>` is a draft with six media items, room for two more.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | A draft listing with six media items |
| `<supported a>`, `<supported b>` | two supported images, first in the selection |
| `<pdf file>` | grading-report.pdf, a 1.3 MB PDF |
| `<oversized image>` | A JPEG of 104857601 bytes or more |
| `<over cap image>` | A third supported image, last in the selection |

**Steps:**

1. Choose `<supported a>`, `<supported b>`, `<pdf file>`, `<oversized image>` and `<over cap image>` together.
2. Read the gallery and the refusals.

**Expected Results:**

* `<supported a>` and `<supported b>` are stored.
* `<pdf file>`, `<oversized image>` and `<over cap image>` are not stored.
* Each refused file is named with its reason: its type, its size, and the eight-item cap.

<!-- trace:case id=g10.auction-listing-media.TC-stg rev=1 covers=g10.auction-listing-media.SC-36 -->
#### g10.auction-listing-media.US1-TC15: A staged reorder of inventory images waits for Save

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_15>`'s editor open, with two inventory images staged in the media manager and not saved, stored in the order A, B.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_15>` | A draft listing with two staged inventory images, stored A, B |

**Steps:**

1. Reorder the staged images to B, A.
2. Leave the listing without saving, then reopen it.

**Expected Results:**

* The reopened listing reads A, B.
* The order B, A applies only once the listing is saved.

<!-- trace:case id=g10.auction-listing-media.TC-eq0 rev=1 covers=g10.auction-listing-media.SC-07 -->
#### g10.auction-listing-media.US1-TC4: Confirming a preview stores the image

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Retirement:** Superseded by immediate upload on drop or choose; replaced by `g10.auction-listing-media.US1-TC3`

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

<!-- trace:case id=g10.auction-listing-media.TC-h3k rev=1 covers=g10.auction-listing-media.SC-08 -->
#### g10.auction-listing-media.US1-TC5: Discarding the preview leaves the gallery unchanged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Retirement:** Superseded by immediate upload on drop or choose; the discard step no longer exists

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

### g10.auction-listing-media.US3: Operator corrects a listing's gallery images

<!-- trace:case id=g10.auction-listing-media.TC-2we rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
#### g10.auction-listing-media.US3-TC2: Removing the last image after create is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_20>`'s media manager open.
* `<listing_20>` is published with only the JPEG `<existing image>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_20>` | A published listing with exactly one JPEG |
| `<existing image>` | The gallery's one JPEG |

**Steps:**

1. Remove `<existing image>`.

**Expected Results:**

* The removal is refused.
* The gallery still holds `<existing image>`.

<!-- trace:case id=g10.auction-listing-media.TC-c4i rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
#### g10.auction-listing-media.US3-TC3: A draft's only image can be replaced and then removed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_21>`'s media manager open.
* `<listing_21>` is a draft with one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_21>` | A draft listing with one gallery image |
| `<replacement image>` | charizard-back.png, a 2.1 MB PNG |

**Steps:**

1. Choose `<replacement image>` for the image.
2. Remove it.

**Expected Results:**

* Step 1 stores `<replacement image>` in place.
* After step 2 `<listing_21>` has no gallery image.

### g10.auction-listing-media.US4: Operator describes a gallery image with alt text

<!-- trace:case id=g10.auction-listing-media.TC-rn2 rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
#### g10.auction-listing-media.US4-TC4: Alt text over 200 characters is refused

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* admin(holds the catalogue grant) has `<listing_25>`'s media manager open.
* `<listing_25>` is a draft whose image's alt text is `<previous alt>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_25>` | A draft listing whose gallery image has alt text |
| `<previous alt>` | Holo Charizard, front of slab |
| `<long alt>` | 201 characters (fixed boundary: one over the 200-character limit) |

**Steps:**

1. Set the image's alt text to `<long alt>`.

**Expected Results:**

* The edit is refused.
* The alt text stays `<previous alt>`.

## Settled

- Wide enough means the gallery can place a left rail beside the main frame; the threshold stays in code.
- A stacked gallery of several images hides the rail; previous, next and the progress remain.
- The thumbnail size applies when the rail shows; the detail and zoom sizes still apply to the main frame.
- A one-image gallery has no rail or previous and next. An empty gallery has no image or previous and next, while the listing page remains.
