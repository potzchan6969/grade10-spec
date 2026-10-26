# grade10-site/auction/listing-media Test Cases

**Status:** reopened · 7/18
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* The operator is admin(holds the catalogue grant), in a listing's media manager, opened from its editor on Listings in the admin console. A supported image is a JPEG, PNG, WebP or AVIF file of at most 100 MiB; a gallery holds at most eight items; alt text is at most 200 characters.
* A collector reads the gallery on `<g10url>/auction` and a listing's page. Images are served at four sizes: card on the catalogue, thumb on the rail, detail in the main frame, zoom under the magnifier.

## Walk 1: Build a gallery and see it on the site

Starting state:

- admin is in `<listing>`'s media manager; `<listing>` is a draft with no image.

Shared test data:

| Field | Value |
| --- | --- |
| listing | A draft USD listing with every other field Create needs |
| images | front.jpg, back.png and slab.webp, each under 5 MiB |

### Route

1. Drop `<images>` together.
   - Each stores at once, after the last item, in selection order. `g10.auction-listing-media.US1-TC2`
2. Drag slab.webp to the front.
   - The new order holds without Save. `g10.auction-listing-media.US1-TC14`
3. Hover slab.webp's magnify control, then move away.
   - It shows at card size, then at zoom size, then the zoom hides. `g10.auction-listing-media.US2-TC1`
4. Give front.jpg the alt text "Charizard front".
   - Its accessible name is "Charizard front"; the others take the listing title. `g10.auction-listing-media.US4-TC1`
5. Create and publish `<listing>`, then open its card and page on the site.
   - The card shows slab.webp; the page shows all three in order. `g10.auction-listing-media.US5-TC1`

## g10.auction-listing-media.US1: Operator attaches an image to a listing gallery

**As an** operator with catalogue grant,
**I want** to drop one or several supported images into a listing's gallery
and see each one stored as it lands,
**so that** photographing a card costs one move rather than a confirm per
file, and the gallery stays within the cap admin-listing sets.

<!-- trace:case id=g10.auction-listing-media.TC-sga rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### g10.auction-listing-media.US1-TC2: Supported images store as they are dropped or chosen, after the last item

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin is in `<listing>`'s media manager; `<listing>` is a draft holding one image, a.jpg.

**Test data:**

| `<files>` | `<how>` |
| --- | --- |
| b.jpg | Choose it from the file picker |
| c.png, d.webp, e.avif, in that order | Drop them together |

**Steps:**

1. Add `<files>` by `<how>`.
2. Reload the media manager.

**Expected Results:**

* Each file stores at once, with no preview, confirm or discard step, and joins after a.jpg in the order selected.
* Step 2 shows the same items in the same order.

<!-- trace:case id=g10.auction-listing-media.TC-c94 rev=1 covers=g10.auction-listing-media.SC-c93 -->
### g10.auction-listing-media.US1-TC6: An unsupported file or a ninth item is refused, naming why

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin is in `<listing>`'s media manager, `<listing>` holding `<held>`.

**Test data:**

| `<held>` | `<file>` | `<reason>` |
| --- | --- | --- |
| 3 images | scan.gif | the type is not supported |
| 3 images | notes.pdf | the type is not supported |
| 3 images | empty.jpg, 0 bytes | the file is empty |
| 8 images | ninth.jpg | the gallery holds eight items |

**Steps:**

1. Add `<file>`.

**Expected Results:**

* It is refused, naming `<reason>`, and the gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-brl rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### g10.auction-listing-media.US1-TC8: An image over 100 MiB is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* admin is in `<listing>`'s media manager, `<listing>` holding 3 images.

**Test data:**

| Field | Value |
| --- | --- |
| `<large file>` | A JPEG of 100 MiB plus 1 byte (fixed boundary) |

**Steps:**

1. Add `<large file>`.

**Expected Results:**

* It is refused, naming the 100 MiB limit, and the gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-ref rev=1 covers=g10.auction-listing-media.SC-34 -->
### g10.auction-listing-media.US1-TC12: In a mixed selection the good files store and each refused one names its reason

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

* admin is in `<listing>`'s media manager, `<listing>` holding 6 images.

**Steps:**

1. Drop a.jpg, scan.gif and b.png together.

**Expected Results:**

* a.jpg and b.png store after the last item; scan.gif is refused naming its type; the gallery then holds 8.

<!-- trace:case id=g10.auction-listing-media.TC-5c5 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### g10.auction-listing-media.US1-TC9: An image joins at any state until the close

Runs once per row of **Test data**.

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

* admin is in `<listing>`'s media manager, `<listing>` `<state>` with 2 images.

**Test data:**

| `<state>` |
| --- |
| created |
| published, taking bids |

**Steps:**

1. Add c.jpg, then open `<listing>`'s page on the site if published.

**Expected Results:**

* c.jpg stores third; a published page shows it third.

<!-- trace:case id=g10.auction-listing-media.TC-qd3 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### g10.auction-listing-media.US1-TC10: Adding an image after the close is refused

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

* admin is in the media manager of `<listing>`, which has closed.

**Steps:**

1. Add c.jpg.

**Expected Results:**

* It is refused, saying the listing has closed, and the gallery is unchanged.

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

* admin is in `<listing>`'s media manager; `<listing>` holds uploaded a.jpg, b.jpg and c.jpg, and no inventory image waits for Save.

**Steps:**

1. Drag c.jpg to the front.
2. Reload without saving.

**Expected Results:**

* Step 2 reads c.jpg, a.jpg, b.jpg.

<!-- trace:case id=g10.auction-listing-media.TC-stg rev=1 covers=g10.auction-listing-media.SC-36 -->
### g10.auction-listing-media.US1-TC15: A reorder made while inventory images wait for Save holds only after Save

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

* admin is in `<listing>`'s editor; `<listing>` holds uploaded a.jpg, and inv.jpg is chosen from the inventory product and not yet saved.

**Steps:**

1. Drag inv.jpg in front of a.jpg.
2. Reload without saving, and choose inv.jpg again and drag it in front.
3. Save and reload.

**Expected Results:**

* Step 2 reads a.jpg alone; step 3 reads inv.jpg, a.jpg.

---

## g10.auction-listing-media.US2: Operator inspects a stored image at zoom size

**As an** operator with catalogue grant,
**I want** the admin media manager to show each stored image at card size and
reveal it at zoom size on hover,
**so that** I can judge a card's condition without clicking through to it.

<!-- trace:case id=g10.auction-listing-media.TC-92w rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### g10.auction-listing-media.US2-TC1: A stored image shows at card size and at zoom size while its magnifier is hovered

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

* admin is in `<listing>`'s media manager; `<listing>` holds front.jpg, larger than the zoom size.

**Steps:**

1. Read front.jpg's tile.
2. Hover its magnify control, or focus it from the keyboard.
3. Move away, or move focus on.

**Expected Results:**

* Step 1 shows it at card size; step 2 reveals it at zoom size; step 3 hides the zoom.

---

## g10.auction-listing-media.US3: Operator corrects a listing's gallery images

**As an** operator with catalogue grant,
**I want** to replace and remove gallery images while the listing is still
writable,
**so that** I can fix a bad photograph without ever leaving a published
listing with no image at all.

<!-- trace:case id=g10.auction-listing-media.TC-8sq rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### g10.auction-listing-media.US3-TC1: A replacement stores at once in the item's place

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* admin is in `<listing>`'s media manager; `<listing>`, `<state>`, holds a.jpg, b.jpg and c.jpg.

**Test data:**

| `<state>` |
| --- |
| a draft |
| published, taking bids |

**Steps:**

1. Replace b.jpg with new.png.
2. Reload, and open the page on the site if published.

**Expected Results:**

* new.png stores at once, second, with no preview step; the page shows it second.

<!-- trace:case id=g10.auction-listing-media.TC-c4i rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### g10.auction-listing-media.US3-TC3: A draft's only image can be replaced and then removed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* admin is in the media manager of draft `<listing>`, which holds only a.jpg.

**Steps:**

1. Replace a.jpg with b.png.
2. Remove b.png and confirm.

**Expected Results:**

* Step 1 shows b.png alone; step 2 leaves the draft with no image.

<!-- trace:case id=g10.auction-listing-media.TC-2we rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### g10.auction-listing-media.US3-TC2: Removing the last image once created is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* admin is in the media manager of created `<listing>`, which holds only a.jpg.

**Steps:**

1. Remove a.jpg and confirm.

**Expected Results:**

* It is refused, saying a created listing keeps at least one item, and a.jpg stays.

---

## g10.auction-listing-media.US4: Operator describes a gallery image with alt text

**As an** operator with catalogue grant,
**I want** to supply and later change optional alt text on a gallery image,
**so that** each image has an accessible name, falling back to the listing
title when I have written none.

<!-- trace:case id=g10.auction-listing-media.TC-ygm rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC1: An image's accessible name is its alt text, or the listing title without one

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* Published `<listing>`, titled Charizard PSA 10, holds front.jpg with alt text `<alt>`.

**Test data:**

| `<alt>` | `<name>` |
| --- | --- |
| Charizard front | Charizard front |
| Empty | Charizard PSA 10 |

**Steps:**

1. Open `<listing>`'s page and read front.jpg's accessible name with a screen reader.

**Expected Results:**

* It reads `<name>`.

<!-- trace:case id=g10.auction-listing-media.TC-eeh rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC3: Alt text changes on a published listing without touching the image

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* admin is in the media manager of published `<listing>`; front.jpg has the alt text "Charizard front".

**Test data:**

| Field | Value |
| --- | --- |
| `<new alt>` | 200 characters of "A" (fixed boundary) |

**Steps:**

1. Set front.jpg's alt text to `<new alt>` and save.
2. Open the page and read the image and its accessible name.

**Expected Results:**

* Step 2 reads `<new alt>`, the image itself unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-rn2 rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC4: Alt text over 200 characters is refused

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

* admin is in `<listing>`'s media manager; front.jpg has the alt text "Charizard front".

**Steps:**

1. Set its alt text to 201 characters of "A" and save.

**Expected Results:**

* It is refused, naming the 200-character limit, and "Charizard front" stays.

---

## g10.auction-listing-media.US5: Collector views a listing's gallery images

**As a** collector,
**I want** a listing's images at the size the surface needs, in gallery order,
**so that** I can pick a listing off the catalogue and study its images on the
details page.

<!-- trace:case id=g10.auction-listing-media.TC-v1b rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC1: The catalogue card shows the first gallery image, or lists without one

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* `<listing>` is published with `<gallery>`.

**Test data:**

| `<gallery>` | `<card shows>` |
| --- | --- |
| front.jpg, then back.png | front.jpg at card size |
| A video first, then front.jpg | No image and no placeholder |

**Steps:**

1. Open `<g10url>/auction` and find `<listing>`'s card.

**Expected Results:**

* The card is listed and shows `<card shows>`.

<!-- trace:case id=g10.auction-listing-media.TC-del rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC5: The listing page shows every image in gallery order, at the size each place needs

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* `<listing>` is published with front.jpg, back.png and slab.webp, each larger than the zoom size, and is opened on a wide screen.

**Steps:**

1. Read the rail and the main frame.
2. Select back.png on the rail, then hover the main frame.

**Expected Results:**

* Step 1: the rail lists front, back, slab at thumb size, and the main frame shows front.jpg at detail size.
* Step 2 shows back.png at detail size, then under the lens at zoom size.

<!-- trace:case id=g10.auction-listing-media.TC-pls rev=1 covers=g10.auction-listing-media.SC-5tk -->
### g10.auction-listing-media.US5-TC8: The rail shows only for several images on a wide enough gallery

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
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

* `<listing>` is published with `<images>` and opened at `<width>`.

**Test data:**

| `<images>` | `<width>` | `<gallery shows>` |
| --- | --- | --- |
| 3 | 1440 pixels | The left rail beside the main frame |
| 3 | 390 pixels | No rail; previous, next and the progress |
| 1 | 1440 pixels | The image alone: no rail, previous or next |
| None (a draft-era listing) | 1440 pixels | No image and no previous or next, the rest of the page whole |

**Steps:**

1. Read the gallery.

**Expected Results:**

* It shows `<gallery shows>`, and no empty slot.

---

## Settled

- Wide enough means the gallery can place a left rail beside the main frame; the threshold stays in code.
- The thumbnail size applies when the rail shows; the detail and zoom sizes still apply to the main frame.
