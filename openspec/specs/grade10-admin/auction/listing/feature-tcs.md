# grade10-admin/auction/listing Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-05, tcs-rules r4

**Out of suite:** grade10-admin-auction-listing-SC-64, grade10-admin-auction-listing-SC-65, grade10-admin-auction-listing-SC-66, grade10-admin-auction-listing-SC-67

## grade10-admin-auction-listing-US1: Operator saves an unfinished listing and comes back to it

**As an** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the rest arrives.

<!-- trace:case id=g10adm.auction-listing.TC-mqd rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### grade10-admin-auction-listing-US1-TC1-1: Operator saves an empty draft

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.

**Steps:**

1. Click the create-listing control in the Listings heading.
2. Leave title and prices empty.
3. Clear the prefilled start time.
4. Clear the prefilled scheduled close time.
5. Click Save.
6. Reopen the saved draft from Listings.
7. Open `<grade10 auction url>`.

**Expected Results:**

* Step 6 shows a draft with title and prices empty.
* Step 6 shows both time fields empty.
* Step 7 does not list that listing.

<!-- trace:case id=g10adm.auction-listing.TC-27b rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### grade10-admin-auction-listing-US1-TC2-1: Operator saves a partial draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.

**Steps:**

1. Save a draft with a title and no starting price.
2. Reopen that draft.

**Expected Results:**

* Step 1 keeps the title on the draft.
* Step 2 still shows the listing as a draft.
* Step 2 shows the starting price empty.

<!-- trace:case id=g10adm.auction-listing.TC-qk8 rev=2 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### grade10-admin-auction-listing-US1-TC3-2: Draft refuses a negative or non-whole starting price

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on `<grade10 auction admin listings url>`.
* `<listing_1>` is a draft in the row's currency with starting price 100000 minor units.

**Test data:**

| Currency | Starting price entered | Why refused |
| --- | --- | --- |
| USD | -1 minor unit (-$0.01) | Negative, one minor unit below the 0 boundary |
| HKD | -1 minor unit (-HK$0.01) | Negative, one minor unit below the 0 boundary |
| JPY | -1 minor unit (-¥1) | Negative, one minor unit below the 0 boundary |
| USD | 0.5 minor units ($0.005) | Not a whole number of minor units |
| JPY | 0.5 minor units (¥0.5) | Not a whole number of minor units |

**Steps:**

1. Open `<listing_1>`.
2. Replace the starting-price text with the row's currency amount.
3. Click Save.
4. Reopen `<listing_1>`.
5. Read its starting price and status.

**Expected Results:**

* Step 3 refuses the save.
* Step 5 reads the original price in the row's currency, not empty.
* Step 5 still shows the listing as a draft.

<!-- trace:case id=g10adm.auction-listing.TC-09o rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### grade10-admin-auction-listing-US1-TC4-1: Draft rejects a malformed slug

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft listing is saved.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | Charizard PSA 9 (spaces and capitals; a slug is 1 to 64 lower-case hyphenated words) |

**Steps:**

1. Open that draft.
2. Set the slug to the test-data slug.
3. Read the slug.

**Expected Results:**

* Step 2 refuses the slug.
* Step 3 shows the slug unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-ys7 rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### grade10-admin-auction-listing-US1-TC5-1: Unauthorized draft save is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(may not set an auction's prices and window) is on `<grade10 auction admin listings url>`.

**Steps:**

1. Save a new draft.

**Expected Results:**

* Step 1 refuses the save.
* Step 1 stores no listing.

<!-- trace:case id=g10adm.auction-listing.TC-uka rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso,g10adm.auction-listing.SC-a6f -->
### grade10-admin-auction-listing-US1-TC6-1: Draft keeps a starting price of 0 apart from an empty one

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
* **Trace:** grade10-admin-auction-listing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* <listing_2> is a draft in HKD with a title and no starting price.
* <listing_3> is a draft in HKD with a title and starting price 100000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_2> | A draft, currency HKD, starting price empty |
| <listing_3> | A draft, currency HKD, starting price 100000 minor units |
| Starting price | 0 minor units (HK$0.00) |

**Steps:**

1. Open <listing_2>.
2. Enter a starting price of 0.
3. Save the draft.
4. Reopen <listing_2>.
5. Read its starting price.
6. Open <listing_3>.
7. Clear its starting price.
8. Save the draft.
9. Reopen <listing_3>.
10. Read its starting price.

**Expected Results:**

* Step 3 saves; the listing remains a draft.
* Step 5 reads 0 minor units HKD, not empty.
* Step 8 saves; the listing remains a draft.
* Step 10 reads empty, not 0.

---

## grade10-admin-auction-listing-US2: Operator puts a gallery on a listing

**As an** auction operator,
**I want** to attach, order, and replace the photographs and video of a card,
**so that** a collector judges the item from the images without asking me for more.

<!-- trace:case id=g10adm.auction-listing.TC-m8c rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC1-1: Operator uploads an eighth file

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft listing already holds seven media items.

**Steps:**

1. Open that draft.
2. Upload an eighth JPEG.

**Expected Results:**

* Step 2 stores eight media items in the operator's order.

<!-- trace:case id=g10adm.auction-listing.TC-yrz rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC2-1: Ninth file is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft listing already holds eight media items.

**Steps:**

1. Open that draft.
2. Upload a ninth file.

**Expected Results:**

* Step 2 refuses the upload.
* Step 2 leaves the gallery at eight items.

<!-- trace:case id=g10adm.auction-listing.TC-4p2 rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC3-1: Mixed images and videos are accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Blocked:** Listing spec author — confirm an explicit playback assertion and its interaction. SC-48 states storage order; the gallery requirement states public display order. The listing-media spec assigns playback to admin-listing and preserves the original video path, but no current scenario states the play action or its outcome. The existing playback assertion remains unresolved, not approved.

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* A saved draft has no media; every other create requirement is met.
* Its selected inventory unit has the matching saved stock hold.

**Test data:**

| Field | Value |
| --- | --- |
| gallery_jpeg | A nonempty JPEG, at most 104857600 bytes |
| gallery_mp4 | A playable nonempty MP4, at most 104857600 bytes |
| gallery_webp | A nonempty WebP, at most 104857600 bytes |

**Steps:**

1. Open that draft from Listings.
2. Open its Media action.
3. Choose `<gallery_jpeg>` with the file picker.
4. Choose `<gallery_mp4>` with the file picker.
5. Choose `<gallery_webp>` with the file picker.
6. Return to the listing editor and click Create.
7. Publish the created listing.
8. Open its public listing address as a collector.
9. Select the gallery's second item and start playback.

**Expected Results:**

* Step 5 stores the JPEG, the MP4 and the WebP in that order.
* Step 8 shows the collector the JPEG, the MP4 and the WebP in that order.
* Step 9 plays `<gallery_mp4>` from its uploaded bytes.

<!-- trace:case id=g10adm.auction-listing.TC-fsq rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC4-1: Upload is stored without processing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft listing is saved.

**Test data:**

| Field | Value |
| --- | --- |
| File | a JPEG whose body is 2 mebibytes (any JPEG under 100 mebibytes) |

**Steps:**

1. Open that draft.
2. Upload the test-data JPEG.
3. Open the stored original.

**Expected Results:**

* Step 3 serves that same body and type as the original.
* Named-size paths come from grade10-site/auction/listing-media, not a second stored object written at upload.

<!-- trace:case id=g10adm.auction-listing.TC-g0p rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC5-1: Unsupported type is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft listing is saved.

**Steps:**

1. Open that draft.
2. Upload a file that is not JPEG, PNG, WebP, AVIF, MP4, WebM or QuickTime.

**Expected Results:**

* Step 2 refuses the upload.
* Step 2 leaves the gallery unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-vfa rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC6-1: File over 100 mebibytes is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* A draft listing is saved.

**Test data:**

| Field | Value |
| --- | --- |
| File size | larger than 104857600 bytes (100 mebibytes) |

**Steps:**

1. Open that draft from Listings.
2. Open its Media action.
3. Choose a file larger than 104857600 bytes.

**Expected Results:**

* Step 3 refuses the upload.
* Step 3 leaves the gallery unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-2rk rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC7-1: Operator reorders and removes media

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A published listing has three images in order A, B, C.

**Steps:**

1. Open that listing.
2. Move C first.
3. Remove B.
4. Open <grade10 auction url>.
5. Find that listing's card.

**Expected Results:**

* Step 3 leaves the gallery as C, then A.
* Step 5 shows the collector's card as C.

<!-- trace:case id=g10adm.auction-listing.TC-9cs rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC8-1: Last media item cannot be removed after create

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A published listing has one JPEG.

**Steps:**

1. Open that listing.
2. Remove that JPEG.

**Expected Results:**

* Step 2 refuses the remove.
* Step 2 still shows that JPEG.

---

<!-- trace:case id=g10adm.auction-listing.TC-kmw rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k,g10adm.auction-listing.SC-x5f,g10adm.auction-listing.SC-89c,g10adm.auction-listing.SC-cps,g10adm.auction-listing.SC-tgj,g10adm.auction-listing.SC-8h3,g10adm.auction-listing.SC-mn8 -->
### grade10-admin-auction-listing-US2-TC9-1: Listing saves mixed media from its selected product

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
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* The listing's selected product has reusable media.

**Steps:**

1. Select product media for the listing.
2. Add a direct upload.
3. Interleave the product media and the upload.
4. Save the listing.
5. Change the source product gallery.
6. Reopen the listing.

**Expected Results:**

* Step 4 keeps one ordered gallery of both sources.
* Step 6 shows the saved gallery unchanged after the product change.

---

## grade10-admin-auction-listing-US3: Operator creates a listing that is ready to sell

**As an** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

<!-- trace:case id=g10adm.auction-listing.TC-igg rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC1-1: Operator creates a filled draft

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft has a title, slug charizard-psa-9, starting price 100000 minor units, minimum increment 5000 minor units, currency HKD, a future start, a close after that start, and one JPEG.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 (1 to 64 lower-case hyphenated words) |
| Starting price | 100000 minor units (any whole amount of 0 or more) |
| Minimum increment | 5000 minor units |
| Currency | HKD |

**Steps:**

1. Open that draft.
2. Create the listing.
3. Open the public catalogue.

**Expected Results:**

* Step 2 shows the listing as created.
* Step 3 does not list that listing.

<!-- trace:case id=g10adm.auction-listing.TC-4hw rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC2-1: Create without a title is refused on the form and the API

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft has every required field set and no title.

**Steps:**

1. Open that draft.
2. Submit create on the admin form.
3. Send create to the API without a title.
4. Read the listing's status.

**Expected Results:**

* Step 2 does not send create and names the title as missing.
* Step 3 refuses the API create.
* Step 4 still shows the listing as a draft.

<!-- trace:case id=g10adm.auction-listing.TC-yte rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC3-1: Create without a slug is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft has every required field set except the slug.

**Steps:**

1. Open that draft.
2. Create the listing.
3. Read the listing's status.

**Expected Results:**

* Step 2 refuses the create.
* Step 3 still shows the listing as a draft.

<!-- trace:case id=g10adm.auction-listing.TC-xx5 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC4-1: Create without a starting price is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft has a title, a window and no starting price.

**Steps:**

1. Open that draft.
2. Create the listing.
3. Read the listing's status.

**Expected Results:**

* Step 2 refuses the create.
* Step 3 still shows the listing as a draft.

<!-- trace:case id=g10adm.auction-listing.TC-78a rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC5-1: Create without media is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft has every required field set and no media.

**Steps:**

1. Open that draft.
2. Create the listing.
3. Read the listing's status.

**Expected Results:**

* Step 2 refuses the create.
* Step 3 still shows the listing as a draft.

<!-- trace:case id=g10adm.auction-listing.TC-vtd rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC6-1: Created listing cannot clear a required field

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A created listing has a title.

**Steps:**

1. Open that listing.
2. Clear the title.
3. Read the title.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 shows the title unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-hdm rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC7-1: Create of a published listing is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A listing is published.

**Steps:**

1. Open that listing.
2. Create it.
3. Read the listing's status.

**Expected Results:**

* Step 2 refuses the create.
* Step 3 still shows the listing as published.

<!-- trace:case id=g10adm.auction-listing.TC-hr0 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC8-1: Two categories from one taxonomy are refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* One taxonomy has categories Pokémon and Sport.
* A listing can take a category write.

**Steps:**

1. Open that listing from Listings.
2. Select Pokémon and Sport in its categories control.
3. Click Save.
4. Reopen the listing and read its categories.

**Expected Results:**

* Step 3 refuses the write.
* Step 4 shows the categories unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-wcd rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC9-1: Canceled sale cannot receive a listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* A sale is canceled.
* A draft listing is saved.

**Steps:**

1. Open that draft.
2. Attach it to the canceled sale.
3. Read the listing's sale.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 shows the listing's sale unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-b59 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC10-1: Duplicate slug is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A listing that is not canceled already uses slug charizard-psa-9.
* A second listing is saved.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 (1 to 64 lower-case hyphenated words) |

**Steps:**

1. Open the second listing.
2. Set its slug to the test-data slug.
3. Read the second listing's slug.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 shows the second listing's slug unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-3s0 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC11-1: Two drafts cannot share a slug

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft already uses slug charizard-psa-9.
* A second draft is saved.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 (1 to 64 lower-case hyphenated words) |

**Steps:**

1. Open the second draft.
2. Set its slug to the test-data slug.
3. Read the second draft's slug.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 shows the second draft's slug unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-ohw rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC12-1: Empty slugs on drafts are not a collision

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft is saved with no slug.

**Steps:**

1. Save another draft with no slug.
2. Read both drafts' slugs.

**Expected Results:**

* Step 1 accepts the save.
* Step 2 shows neither draft occupying a slug.

<!-- trace:case id=g10adm.auction-listing.TC-yjr rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC13-1: Create can reuse a canceled listing's original slug

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Blocked:** Listing spec author — reconcile SC-21 allowing canceled-slug reuse with the cancel requirement and SC-42 preserving the canonical slug permanently; identifier decision Q16 chooses preservation. Do not execute this contradictory expectation until its source scenario is reconciled.

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* A canceled listing previously used slug charizard-psa-9.
* A draft has every required field set, including slug charizard-psa-9.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 (1 to 64 lower-case hyphenated words) |

**Steps:**

1. Open the draft.
2. Create the draft.
3. Read the canceled listing's slug.

**Expected Results:**

* Step 2 shows the draft as created.
* Step 3 shows the canceled listing still without charizard-psa-9.

<!-- trace:case id=g10adm.auction-listing.TC-xtt rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC14-1: Create cannot reuse a closed listing's slug

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A closed listing uses slug charizard-psa-9.
* A draft has every required field set, including slug charizard-psa-9.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 |

**Steps:**

1. Open the draft.
2. Create the draft.
3. Read the draft's status.
4. Open /auction/listings/charizard-psa-9.

**Expected Results:**

* Step 2 refuses the create.
* Step 3 still shows the draft as a draft.
* Step 4 still returns the closed listing.

<!-- trace:case id=g10adm.auction-listing.TC-8u6 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC15-1: Operator corrects a created listing's starting price

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* A created listing has starting price 100000 minor units HKD.

**Test data:**

| Field | Value |
| --- | --- |
| Starting price | 150000 minor units (any whole amount of 0 or more, other than 100000) |
| Currency | HKD |

**Steps:**

1. Open that listing.
2. Set the starting price to 150000 minor units.
3. Save the listing.
4. Read its starting price and status.

**Expected Results:**

* Step 4 shows 150000 minor units HKD.
* Step 4 still shows the listing as created.

<!-- trace:case id=g10adm.auction-listing.TC-4sr rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC16-1: Scheduled close at in the past is refused at create

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft's scheduled close is not after now.

**Steps:**

1. Open that draft.
2. Create the listing.
3. Read the listing's status.

**Expected Results:**

* Step 2 refuses the create.
* Step 3 still shows the listing as a draft.

<!-- trace:case id=g10adm.auction-listing.TC-o5r rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC18-1: Sandbox cannot change after create

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* A created listing was drafted as sandbox.

**Steps:**

1. Open that listing.
2. Clear sandbox.
3. Read the sandbox setting.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 still shows the listing as sandbox.

<!-- trace:case id=g10adm.auction-listing.TC-xt0 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC20-1: Extension values the listing refuses

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_1>` is a created listing.

**Test data:**

| Setting | Value |
| --- | --- |
| Extension window | 1800 seconds (30mins) |
| Extension duration | -60 seconds |

**Steps:**

1. Write the row's setting at the row's value on `<listing_1>`.
2. Read the API response for its extension settings.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 reads the extension settings unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-o8h rev=2 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC19-2: Omitted extension duration defaults to 30 minutes

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) has an API session.
* `<extension_default_draft>` meets every create requirement, with a matching inventory-unit hold.
* The draft has no extension duration supplied; it does not hold an explicit 0.

**Test data:**

| Field | Value |
| --- | --- |
| extension_default_draft | A draft with every create requirement and matching inventory-unit hold, with extension duration unset |
| extension duration | Field absent from the create request; neither an empty string, null nor 0 |

**Steps:**

1. Send create for `<extension_default_draft>`, omitting extension duration.
2. Read the API response for the listing's extension duration.

**Expected Results:**

* Step 1 creates the listing.
* Step 2 reads 1800 seconds (30 minutes).

<!-- trace:case id=g10adm.auction-listing.TC-h7v rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on,g10adm.auction-listing.SC-rhp,g10adm.auction-listing.SC-v2q,g10adm.auction-listing.SC-hze,g10adm.auction-listing.SC-zho,g10adm.auction-listing.SC-rfu -->
### grade10-admin-auction-listing-US3-TC21-1: Create accepts a starting price of 0 in each currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* <listing_4> is a draft in the row's currency with a title, a slug, a start, a close after both the start and now, one image, and the stock hold its draft took, and no starting price.

**Test data:**

| Currency | Starting price entered | Read-back before saving |
| --- | --- | --- |
| USD | 0 minor units | A formatted zero amount in USD, with USD's decimal places |
| HKD | 0 minor units | A formatted zero amount in HKD, with HKD's decimal places |
| JPY | 0 minor units | A formatted zero amount in JPY, with JPY's decimal places |

**Steps:**

1. Open <listing_4>.
2. Enter the row's starting price.
3. Read the starting price's formatted read-back.
4. Create the listing.
5. Reopen <listing_4>.
6. Read its starting price.

**Expected Results:**

* Step 3 shows the row's read-back, with no error on the field.
* Step 4 shows the listing as created.
* Step 6 reads 0 minor units in the row's currency.

<!-- trace:case id=g10adm.auction-listing.TC-fc7 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on,g10adm.auction-listing.SC-rhp,g10adm.auction-listing.SC-v2q,g10adm.auction-listing.SC-hze,g10adm.auction-listing.SC-zho,g10adm.auction-listing.SC-rfu -->
### grade10-admin-auction-listing-US3-TC22-1: API create refuses a negative or non-whole starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_5>` is a draft in the row's currency with every create requirement set and starting price 0 minor units.

**Test data:**

| Currency | Starting price sent with create |
| --- | --- |
| USD | -1 minor unit |
| HKD | -1 minor unit |
| JPY | -1 minor unit |
| HKD | 0.5 minor units |
| JPY | 0.5 minor units |

**Steps:**

1. Send create for `<listing_5>` with the row's starting price.
2. Read the API response for `<listing_5>`.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads the listing as a draft.
* Step 2 reads starting price 0 minor units in the row's currency.

<!-- trace:case id=g10adm.auction-listing.TC-1h5 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on,g10adm.auction-listing.SC-rhp,g10adm.auction-listing.SC-v2q,g10adm.auction-listing.SC-hze,g10adm.auction-listing.SC-zho,g10adm.auction-listing.SC-rfu -->
### grade10-admin-auction-listing-US3-TC23-1: API create with no starting price is refused, not stored as 0

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_6>` is a draft in USD with every create requirement set except the starting price, which is empty.

**Test data:**

| Starting price in the create request |
| --- |
| Field absent |
| Field present, null |
| Field present, an empty string |

**Steps:**

1. Send create for `<listing_6>` with the row's starting price.
2. Read the API response for `<listing_6>`.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads the listing as a draft.
* Step 2 reads the starting price empty, not 0.

<!-- trace:case id=g10adm.auction-listing.TC-ebb rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on,g10adm.auction-listing.SC-rhp,g10adm.auction-listing.SC-v2q,g10adm.auction-listing.SC-hze,g10adm.auction-listing.SC-zho,g10adm.auction-listing.SC-rfu -->
### grade10-admin-auction-listing-US3-TC24-1: Operator lowers a created listing's starting price to 0

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* <listing_7> is created and unpublished, currency JPY, starting price 1000000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_7> | A created, unpublished listing, currency JPY, starting price 1000000 minor units (¥1,000,000) |
| Starting price | 0 minor units |

**Steps:**

1. Open <listing_7>.
2. Set the starting price to 0.
3. Save the listing.
4. Reopen <listing_7>.
5. Read its starting price and status.

**Expected Results:**

* Step 3 saves.
* Step 5 reads 0 minor units JPY.
* Step 5 reads the listing as created.

<!-- trace:case id=g10adm.auction-listing.TC-g4v rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on,g10adm.auction-listing.SC-rhp,g10adm.auction-listing.SC-v2q,g10adm.auction-listing.SC-hze,g10adm.auction-listing.SC-zho,g10adm.auction-listing.SC-rfu -->
### grade10-admin-auction-listing-US3-TC25-1: API create with 0 and no currency creates as HKD 0

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_10>` is a draft with every create requirement set except the starting price, and no currency chosen.

**Test data:**

| Field | Value |
| --- | --- |
| listing_10 | A draft, currency not chosen, starting price empty, every other create requirement set |
| Starting price | 0 minor units |

**Steps:**

1. Send create for `<listing_10>` with starting price 0 and no currency.
2. Read the API response for `<listing_10>`.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads the listing as created.
* Step 2 reads starting price 0 minor units HKD.

---

## grade10-admin-auction-listing-US4: Operator puts a listing in front of collectors

**As an** auction operator,
**I want** to publish a listing now or at a time I set in advance,
**so that** a lot opens at the hour the sale was announced for and reads at its own public address from then on.

<!-- trace:case id=g10adm.auction-listing.TC-amk rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC1-1: Operator publishes a created listing immediately

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A created listing has no publish at.

**Steps:**

1. Open that listing.
2. Publish it.
3. Open <grade10 auction url>.

**Expected Results:**

* Step 2 shows the listing as published.
* Step 3 shows it on the public catalogue.

<!-- trace:case id=g10adm.auction-listing.TC-cp1 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC2-1: Created listing publishes at the scheduled time

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A created listing has a publish at still in the future.

**Steps:**

1. Wait until that publish at arrives.
2. Read the listing's status.
3. Open <grade10 auction url>.

**Expected Results:**

* Step 2 shows the listing as published.
* Step 3 shows it on the public catalogue.
* Step 2 needed no further operator action.

<!-- trace:case id=g10adm.auction-listing.TC-4ju rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC3-1: Collector opens a listing by slug

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* A published listing uses slug charizard-psa-9.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 |

**Steps:**

1. Open /auction/listings/charizard-psa-9.

**Expected Results:**

* Step 1 returns that listing.

<!-- trace:case id=g10adm.auction-listing.TC-h6l rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC4-1: Unknown slug is not found

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* No published, closed or settled listing uses slug no-such-lot.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | no-such-lot |

**Steps:**

1. Open /auction/listings/no-such-lot.

**Expected Results:**

* Step 1 answers as not found.

<!-- trace:case id=g10adm.auction-listing.TC-ld9 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC5-1: Operator updates copy on a published listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A published listing is titled Charizard 1st Edition.

**Test data:**

| Field | Value |
| --- | --- |
| Title | Charizard 1st Edition |

**Steps:**

1. Open that listing.
2. Change its copy to a new description.
3. Open the listing as a collector.
4. Read the title.
5. Read the prices.
6. Read the window.

**Expected Results:**

* Step 2 stores the new copy.
* Step 3 shows the collector the new copy.
* Steps 4 to 6 show the same title, prices and window.

<!-- trace:case id=g10adm.auction-listing.TC-mj0 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC6-1: Published slug cannot change

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A published listing uses slug charizard-psa-9.

**Test data:**

| Field | Value |
| --- | --- |
| Attempted slug | charizard-psa-9-copy (1 to 64 lower-case hyphenated words) |

**Steps:**

1. Open that listing.
2. Set the slug to the attempted slug.
3. Open /auction/listings/charizard-psa-9.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 still returns that listing.

<!-- trace:case id=g10adm.auction-listing.TC-ofm rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC7-1: Published listing refuses a price change

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* A published listing has starting price 100000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Starting price | 150000 minor units (any whole amount of 0 or more, other than 100000) |

**Steps:**

1. Open that listing.
2. Set the starting price to 150000 minor units.
3. Read the starting price.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 still shows 100000 minor units.

<!-- trace:case id=g10adm.auction-listing.TC-8yj rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC8-1: A publish at in the past is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A listing is created and unpublished.

**Steps:**

1. Open that listing.
2. Set publish at to a time that is not after now.
3. Read its status and publish at.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 still shows the listing created and unpublished.

<!-- trace:case id=g10adm.auction-listing.TC-bjv rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC9-1: Create with a past publish at is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft has every required field set and a publish at in the past.

**Steps:**

1. Open that draft.
2. Create the listing.
3. Read the listing's status.
4. Open the public catalogue.

**Expected Results:**

* Step 2 refuses the create.
* Step 3 still shows the listing as a draft.
* Step 4 does not list that listing.

<!-- trace:case id=g10adm.auction-listing.TC-qpo rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC10-1: Draft is not published when publish at arrives

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* A draft has a publish at that has arrived and a missing title.

**Steps:**

1. Wait until that publish at is reached.
2. Read the listing's status.
3. Open the public catalogue.

**Expected Results:**

* Step 2 does not show the listing as published.
* Step 2 still shows the listing as a draft.
* Step 3 does not list that listing.

<!-- trace:case id=g10adm.auction-listing.TC-6j1 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC11-1: Manual publish of a draft is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft listing is saved.

**Steps:**

1. Open that draft.
2. Publish it.
3. Read the listing's status.

**Expected Results:**

* Step 2 refuses the publish.
* Step 3 still shows the listing as a draft.

<!-- trace:case id=g10adm.auction-listing.TC-hji rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC12-1: Publish at cannot change after publish

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A listing is published.

**Steps:**

1. Open that listing.
2. Set a new publish at.
3. Read its status.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 still shows the listing as published.

<!-- trace:case id=g10adm.auction-listing.TC-i4e rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC13-1: First item is the catalogue card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* A published listing's gallery is a video, then a JPEG.

**Steps:**

1. Open <grade10 auction url>.
2. Find that listing's card.

**Expected Results:**

* Step 2 uses the video as the card's media.
* Step 2 does not require a named physical side such as front.

<!-- trace:case id=g10adm.auction-listing.TC-0q9 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-fcs,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC14-1: Listing starting at 0 publishes to its public address

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
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on <grade10 auction admin listings url>.
* <listing_8> is created and unpublished, currency USD, starting price 0 minor units, slug <zero start slug>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_8> | A created, unpublished listing, currency USD, starting price 0 minor units, every create requirement set |
| <zero start slug> | no-reserve-charizard-psa-9 |

**Steps:**

1. Open <listing_8>.
2. Publish it now.
3. Open <grade10 store url>/auction/listings/<zero start slug>.

**Expected Results:**

* Step 2 shows the listing as published, with no starting-price refusal.
* Step 3 opens <listing_8>'s public page.

<!-- trace:case id=g10adm.auction-listing.TC-pcd rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-fcs,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC15-1: Published listing refuses a change to a starting price of 0

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* <listing_9> is published, currency HKD, starting price 100000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_9> | A published listing, currency HKD, starting price 100000 minor units (HK$1,000.00) |
| Starting price | 0 minor units |

**Steps:**

1. Open <listing_9>.
2. Set the starting price to 0.
3. Save the listing.
4. Reopen <listing_9>.
5. Read its starting price.

**Expected Results:**

* Step 3 is refused.
* Step 5 reads 100000 minor units HKD.

---

## grade10-admin-auction-listing-US5: Operator calls a listing off before it closes

**As an** auction operator,
**I want** to withdraw a lot at any point up to its close,
**so that** a consignor who pulls out or a card that fails authentication leaves the sale cleanly.

<!-- trace:case id=g10adm.auction-listing.TC-k37 rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC1-1: Operator calls off a draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft listing is saved.

**Steps:**

1. Open that draft.
2. Call it off.
3. Open the public catalogue.

**Expected Results:**

* Step 2 shows the listing as canceled.
* Step 3 does not list that listing.

<!-- trace:case id=g10adm.auction-listing.TC-gw7 rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC2-1: Operator calls off a created listing before publish at

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A created listing has a publish at still in the future.

**Steps:**

1. Open that listing.
2. Call it off.
3. Wait until that publish at arrives.
4. Read the listing's status.
5. Open the public catalogue.

**Expected Results:**

* Step 2 shows the listing as canceled.
* Step 4 does not show it as published.
* Step 5 does not list that listing.

<!-- trace:case id=g10adm.auction-listing.TC-s7i rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC3-1: Operator calls off a published listing that has bids

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A published listing has a leading bid, an outbid bid, and stock held for it.

**Steps:**

1. Open that listing.
2. Call it off.
3. Read both bidders' cards.
4. Read the listing's stock.
5. Open the public catalogue.

**Expected Results:**

* Step 2 shows the listing as canceled.
* Step 3 shows both bids called off, and no bidder charged.
* Step 4 shows the held stock released.
* Step 5 does not list that listing.

<!-- trace:case id=g10adm.auction-listing.TC-32t rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC4-1: Closed listing cannot be called off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A listing is closed.

**Steps:**

1. Open that listing.
2. Call it off.
3. Read the listing's status.

**Expected Results:**

* Step 2 refuses the cancel.
* Step 3 still shows the listing as closed.

<!-- trace:case id=g10adm.auction-listing.TC-zkl rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC5-1: Settled listing cannot be called off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A listing is settled.

**Steps:**

1. Open that listing.
2. Call it off.
3. Read the listing's status.

**Expected Results:**

* Step 2 refuses the cancel.
* Step 3 still shows the listing as settled.

<!-- trace:case id=g10adm.auction-listing.TC-uba rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC6-1: Already canceled listing cannot be called off again

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A listing is already canceled.

**Steps:**

1. Open that listing.
2. Call it off.
3. Read the listing's status.

**Expected Results:**

* Step 2 refuses the cancel.
* Step 3 still shows the listing as canceled.

<!-- trace:case id=g10adm.auction-listing.TC-z2r rev=2 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC7-2: Cancel preserves the canonical slug and its public page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**

* admin(holds the grant to call off listings) is on `<grade10 auction admin listings url>`.
* `<cancel_slug_listing>` is published, has not closed, and holds `<reserved_slug>`.
* `<reuse_slug_draft>` is a separate editable draft with a different saved slug.

**Test data:**

| Field | Value |
| --- | --- |
| cancel_slug_listing | A published listing that has not closed |
| reserved_slug | The canonical slug already held by `<cancel_slug_listing>` |
| reuse_slug_draft | A saved draft holding a different slug |

**Steps:**

1. Open `<cancel_slug_listing>` and call it off.
2. Reopen the listing and read its slug.
3. Open `<grade10 auction url>/listings/<reserved_slug>`.
4. Open `<reuse_slug_draft>` from Listings.
5. Enter `<reserved_slug>` in its slug field and click Save.

**Expected Results:**

* Step 2 shows `<reserved_slug>` unchanged.
* Step 3 still opens the called-off listing's public page.
* Step 5 refuses reuse of `<reserved_slug>`.

<!-- trace:case id=g10adm.auction-listing.TC-uyd rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC8-1: Cancel of a draft with no slug does not invent one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft listing has no slug.

**Steps:**

1. Open that draft.
2. Call it off.
3. Read the listing's status and slug.

**Expected Results:**

* Step 3 shows the listing as canceled.
* Step 3 still shows no slug.

<!-- trace:case id=g10adm.auction-listing.TC-u5z rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC9-1: Unauthorized cancel is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**

* admin(may not call a listing off) is on <grade10 auction admin listings url>.
* A listing is published.

**Steps:**

1. Open that listing.
2. Call it off.
3. Read its status and slug.

**Expected Results:**

* Step 2 refuses the cancel.
* Step 3 still shows the listing as published.
* Step 3 shows its slug unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-uu5 rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC10-1: Closed listing rejects a title edit

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A listing is closed.

**Steps:**

1. Open that listing.
2. Change its title.
3. Read the title.

**Expected Results:**

* Step 2 refuses the write.
* Step 3 shows the title unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-72d rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC11-1: Closed listing rejects a media upload

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A listing is closed.

**Steps:**

1. Open that listing.
2. Upload an image.
3. Read the gallery.

**Expected Results:**

* Step 2 refuses the upload.
* Step 3 shows the gallery unchanged.

---

## grade10-admin-auction-listing-US6: Operator creates and publishes a listing with no campaign

**As an** auction operator,
**I want** to start a listing from the Listings section without picking a
campaign,
**so that** a one-off lot can go live without inventing a cover I do not need.

<!-- trace:case id=g10adm.auction-listing.TC-lev rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### grade10-admin-auction-listing-US6-TC1-1: Create listing control appears for an authorized operator

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Steps:**

1. Read the section heading row.

**Expected Results:**

* Step 1 shows a Create listing action.

<!-- trace:case id=g10adm.auction-listing.TC-wnl rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### grade10-admin-auction-listing-US6-TC2-1: Listing editor opens with no campaign

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Steps:**

1. Click Create listing.
2. Read the Campaign control.

**Expected Results:**

* Step 1 opens the listing editor.
* Step 2 shows no campaign selected.

<!-- trace:case id=g10adm.auction-listing.TC-fxz rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### grade10-admin-auction-listing-US6-TC3-1: Full lifecycle with no campaign — draft, create, publish, slug lookup

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on <grade10 auction admin listings url>.
* A new listing is open with no campaign, every required create field set, slug standalone-lot-1, and no publish at.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | standalone-lot-1 (1 to 64 lower-case hyphenated words) |
| Campaign | (empty) |

**Steps:**

1. Save the draft with a title and no campaign.
2. Create the listing.
3. Publish the listing.
4. Open /auction/listings/standalone-lot-1.

**Expected Results:**

* Step 1 saves a draft with no campaign, absent from the public catalogue.
* Step 2 shows it as created, still with no campaign, and absent from the catalogue.
* Step 3 shows it as published, still with no campaign.
* Step 4 returns that listing.

<!-- trace:case id=g10adm.auction-listing.TC-34a rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### grade10-admin-auction-listing-US6-TC4-1: Listings table shows an unattached row

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on <grade10 auction admin listings url>.
* A listing with no campaign is saved.

**Steps:**

1. Read the campaign column for that listing's row.

**Expected Results:**

* Step 1 shows "-".
* Step 1 does not show only a campaign id for that row.

<!-- trace:case id=g10adm.auction-listing.TC-duk rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### grade10-admin-auction-listing-US6-TC5-1: Create listing is withheld from an unauthorized operator

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Pre-conditions:**

* admin(without auction:operate) is on <grade10 auction admin listings url>.

**Steps:**

1. Read the section heading row.
2. Send a draft save for a new listing.

**Expected Results:**

* Step 1 does not offer Create listing.
* Step 2 refuses the draft save.

---

## grade10-admin-auction-listing-US8: Operator checks a listing's watchers

**As an** auction operator,
**I want** to see how many collectors watch a listing from its Stats dialog,
**so that** I can judge interest beside the bidder count without a second
surface for the same figure.

<!-- trace:case id=g10adm.auction-listing.TC-wkx rev=1 covers=g10adm.auction-listing.SC-qlf,g10adm.auction-listing.SC-7qf,g10adm.auction-listing.SC-sil,g10adm.auction-listing.SC-de9 -->
### grade10-admin-auction-listing-US8-TC1-1: Stats counts watches across both brands

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A published listing is watched by two collectors on Grade10 and one collector on ZZZ.

**Steps:**

1. Open Stats for that listing.
2. Read the watchers figure.

**Expected Results:**

* Step 2 shows 3 watchers.
* Step 2 names no watcher.

<!-- trace:case id=g10adm.auction-listing.TC-gl0 rev=1 covers=g10adm.auction-listing.SC-qlf,g10adm.auction-listing.SC-7qf,g10adm.auction-listing.SC-sil,g10adm.auction-listing.SC-de9 -->
### grade10-admin-auction-listing-US8-TC2-1: An unwatched listing shows zero in Stats

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A published listing has no watches.

**Steps:**

1. Open Stats for that listing.
2. Read the watchers figure.

**Expected Results:**

* Step 2 shows 0 watchers, not a blank or "-".

<!-- trace:case id=g10adm.auction-listing.TC-6o9 rev=1 covers=g10adm.auction-listing.SC-qlf,g10adm.auction-listing.SC-7qf,g10adm.auction-listing.SC-sil,g10adm.auction-listing.SC-de9 -->
### grade10-admin-auction-listing-US8-TC3-1: A closed listing keeps its watchers in Stats

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A closed listing is still watched by two collectors.

**Steps:**

1. Open Stats for the closed listing.
2. Read the watchers figure.

**Expected Results:**

* Step 2 shows 2 watchers.

<!-- trace:case id=g10adm.auction-listing.TC-otd rev=1 covers=g10adm.auction-listing.SC-qlf,g10adm.auction-listing.SC-7qf,g10adm.auction-listing.SC-sil,g10adm.auction-listing.SC-de9 -->
### grade10-admin-auction-listing-US8-TC4-1: The Listings table has no Watchers column

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.

**Steps:**

1. Read the Listings table headings.

**Expected Results:**

* Step 1 shows no Watchers column.

---

## grade10-admin-auction-listing-US9: Operator lists an unsold lot again

**As an** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing,
**so that** a card nobody bought goes back on sale without me hunting for its stock.

<!-- trace:case id=g10adm.auction-listing.TC-tjt rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### grade10-admin-auction-listing-US9-TC1-2: Unsold close releases the hold with no operator step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_1>` is published in no campaign, holding `<held quantity>` units of `<product_1>`, its close a few minutes away.
* The bids on `<listing_1>` are as the row states.
* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published listing for `<product_1>`, quantity `<held quantity>`, in no campaign |
| `<product_1>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 3 units (any quantity from 1 to 500; more than 1, so a rise of one unit is told apart) |
| `<available before>` | 2 units (any count) |
| `<available after>` | 5 units: `<available before>` plus `<held quantity>` |
| `<close date>` | The date `<listing_1>`'s close passes |

| Row | Bids at close | Outcome |
| --- | --- | --- |
| No bids | None | Closes Unsold, hold released |
| Top bid demoted | Only `outbid` bids; no bid is `top` at the close | Closes Unsold, hold released |

**Steps:**

1. Note `<product_1>`'s available count on its product page.
2. Wait until `<listing_1>`'s close passes, taking no action.
3. Reload <grade10 auction admin listings url>.
4. Read `<listing_1>`'s row in the Listings table.
5. Open `<listing_1>`.
6. Read the listing's status and stock note.
7. Read `<product_1>`'s available count again.

**Expected Results:**

* Step 1 reads `<available before>`.
* Step 4: the row reads Unsold and offers Relist.
* Step 6: `<listing_1>` reads Unsold, closed.
* Step 6: the listing says its stock was released on `<close date>`.
* Step 7 reads `<available after>`, `<available before>` plus `<held quantity>`.

<!-- trace:case id=g10adm.auction-listing.TC-juv rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### grade10-admin-auction-listing-US9-TC2-2: Sold and live listings show no released note or Relist

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_2>` is in no campaign and in the state the row states, holding `<held quantity>` units of `<product_2>`.
* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<product_2>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 4 units (any count) |

| Row | `<listing_2>` | Stock outcome |
| --- | --- | --- |
| Sold | Closed with a winner, its sale recorded | Hold moves to sold; available stays `<available before>` |
| Live | Published, its close still ahead | Hold stays; available stays `<available before>` |

**Steps:**

1. Read `<listing_2>`'s row in the Listings table.
2. Open `<listing_2>`.
3. Read the listing's stock note.
4. Read `<product_2>`'s available count on its product page.

**Expected Results:**

* Step 1: the row offers no Relist.
* Step 3 shows no released-stock note.
* Step 4 reads the row's stock outcome.

<!-- trace:case id=g10adm.auction-listing.TC-xzh rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### grade10-admin-auction-listing-US9-TC3-2: Relist from the row opens a new draft holding stock on Save

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
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_3>` closed Unsold with no bids, in no campaign, and its hold is released.
* `<listing_3>` has never been relisted.
* `<product_3>` shows `<available before>` units available.
* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An Unsold listing for `<product_3>` with `No Cert ID`, quantity `<quantity>`, a title, copy, starting price `<price>`, currency JPY, a gallery of three items, slug `<slug_3>`, listing code `<code_3>`, extension 600 seconds, a taxonomy category, a start and close, and a history |
| `<product_3>` | The product `<listing_3>` sold nothing of, regular stock without Cert IDs |
| `<quantity>` | 2 units (any quantity from 1 to 500) |
| `<price>` | JPY 8000 (any positive whole amount) |
| `<available before>` | 5 units (at least `<quantity>`) |
| `<available after Save>` | 3 units: `<available before>` minus `<quantity>` |

**Steps:**

1. Click Relist on `<listing_3>`'s row in the Listings table.
2. Read the new draft's form.
3. Read `<product_3>`'s available count on its product page.
4. Set a start and a close on the draft.
5. Click Save.
6. Read `<product_3>`'s available count again.
7. Return to <grade10 auction admin listings url>.
8. Read `<listing_3>`'s row.
9. Open `<listing_3>`.

**Expected Results:**

* Step 2 shows a new draft, not `<listing_3>`.
* Step 2: product `<product_3>`, `No Cert ID`, quantity `<quantity>`, and `<listing_3>`'s title and copy.
* Step 2: starting price `<price>`, currency JPY, the same gallery in the same order.
* Step 2: no start or close, no campaign, no bids, no history.
* Step 2: extension, taxonomy and sandbox read as on a new blank draft.
* Step 3 still reads `<available before>`.
* Step 5 saves a draft whose slug is not `<slug_3>` and whose listing code is not `<code_3>`.
* Step 6 reads `<available after Save>`, `<available before>` minus `<quantity>`.
* Step 8: the row still reads Unsold and offers no Relist.
* Step 9: `<listing_3>` still reads Unsold, closed, with its history.

<!-- trace:case id=g10adm.auction-listing.TC-bf8 rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### grade10-admin-auction-listing-US9-TC4-2: Relist is hidden from an admin without the operate grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_4>` closed Unsold in no campaign, its hold is released, and it has never been relisted.
* admin(reads listings, without auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An Unsold listing for `<product_4>`, quantity 1 |

**Steps:**

1. Read `<listing_4>`'s row in the Listings table.
2. Open `<listing_4>`.
3. Read the listing's actions.

**Expected Results:**

* Step 1: the row reads Unsold and shows no Relist, not even disabled.
* Step 3 shows no Relist.

<!-- trace:case id=g10adm.auction-listing.TC-hh5 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### grade10-admin-auction-listing-US9-TC5-1: Clean-up frees each earlier Unsold hold once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* Seeded before this change shipped: `<listing_5>` and `<listing_6>` closed Unsold in no campaign, each still holding its stock.
* `<listing_7>` closed Unsold after this change shipped, its hold already released at the close.
* `<listing_8>` closed with a winner, its hold moved to sold.
* The one-time clean-up has not yet run.
* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | Closed Unsold with no bids on `<old close date>`, holding 2 units of `<product_5>` |
| `<listing_6>` | Closed Unsold after its top bid was demoted, holding 1 unit of `<product_5>` |
| `<listing_7>` | Closed Unsold on `<recent close date>`, 4 units of `<product_5>` already released |
| `<listing_8>` | Closed sold, 1 unit of `<product_5>` sold |
| `<product_5>` | 6 units available before the clean-up (any count) |
| `<available after>` | 9 units: 6 plus 2 plus 1 |
| `<old close date>` | A date before this change shipped |
| `<recent close date>` | A date after this change shipped, before the clean-up |
| `<clean-up date>` | The date the clean-up runs |

**Steps:**

1. Read `<listing_5>`'s row in the Listings table.
2. Read `<product_5>`'s available count on its product page.
3. Run the clean-up.
4. Read `<product_5>`'s available count again.
5. Reload <grade10 auction admin listings url>.
6. Read the rows of `<listing_5>` and `<listing_6>`.
7. Open `<listing_5>`.
8. Read the listing's stock note.
9. Open `<listing_7>`.
10. Read the listing's stock note.
11. Run the clean-up again.
12. Read `<product_5>`'s available count.

**Expected Results:**

* Step 1: the row offers no Relist.
* Step 2 reads 6.
* Step 4 reads `<available after>`, 6 plus the holds of `<listing_5>` and `<listing_6>`; `<listing_8>`'s unit stays sold.
* Step 6: both rows offer Relist.
* Step 8: the stock was released on `<clean-up date>`, not `<old close date>`.
* Step 10: the stock was released on `<recent close date>`, not repeated.
* Step 12 still reads `<available after>`.

<!-- trace:case id=g10adm.auction-listing.TC-et4 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### grade10-admin-auction-listing-US9-TC6-1: No note or Relist while the release is retried

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_9>` is published in no campaign with no bids, holding `<held quantity>` units of `<product_9>`, its close a few minutes away.
* The inventory release is made to fail until the tester lets it through.
* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A published listing for `<product_9>`, quantity `<held quantity>`, no bids |
| `<product_9>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 3 units (any count) |
| `<available after>` | 5 units: `<available before>` plus `<held quantity>` |
| `<close time>` | `<listing_9>`'s scheduled close |

**Steps:**

1. Wait until `<close time>` passes.
2. Reload <grade10 auction admin listings url>.
3. Read `<listing_9>`'s row.
4. Open `<listing_9>`.
5. Read the listing's status and stock note.
6. Read `<product_9>`'s available count on its product page.
7. Let the inventory release through.
8. Wait for the next retry.
9. Reload `<listing_9>`.
10. Read the listing's stock note.
11. Return to <grade10 auction admin listings url>.
12. Read `<listing_9>`'s row.

**Expected Results:**

* Step 3: the row reads Unsold and offers no Relist.
* Step 5: `<listing_9>` reads Unsold, closed at `<close time>`, with no released-stock note.
* Step 6 reads `<available before>`.
* Step 10: the listing says its stock was released, dated the successful release.
* Step 12: the row offers Relist.

<!-- trace:case id=g10adm.auction-listing.TC-r14 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### grade10-admin-auction-listing-US9-TC7-1: Relist is not offered in a campaign or after call-off

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_10>` is in the state the row states, and its hold is released.
* `<listing_10>` has never been relisted.
* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_1>` | A campaign `<listing_10>` sits in |

| Row | `<listing_10>` | Row status |
| --- | --- | --- |
| In a campaign | Closed Unsold with no bids, in `<campaign_1>` | Unsold |
| Called off | Called off before its close, in no campaign | Canceled |

**Steps:**

1. Read `<listing_10>`'s row in the Listings table.
2. Open `<listing_10>`.
3. Read the listing's actions.

**Expected Results:**

* Step 1: the row reads the row's status and offers no Relist.
* Step 3 shows no Relist.

<!-- trace:case id=g10adm.auction-listing.TC-smc rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### grade10-admin-auction-listing-US9-TC8-1: Relist left unsaved stores nothing and stays offered

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
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_11>` closed Unsold in no campaign, its hold is released, and it has never been relisted.
* `<product_11>` shows `<available before>` units available.
* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | An Unsold listing for `<product_11>`, quantity 1 |
| `<available before>` | 2 units (any count of at least 1) |

**Steps:**

1. Note the number of draft rows in the Listings table.
2. Click Relist on `<listing_11>`'s row.
3. Leave the draft editor without saving.
4. Read `<listing_11>`'s row.
5. Click Relist on `<listing_11>`'s row again.
6. Leave the draft editor without saving.
7. Read the Listings table.
8. Read `<product_11>`'s available count on its product page.

**Expected Results:**

* Step 2 opens the draft editor filled from `<listing_11>`.
* Step 4: the row still offers Relist.
* Step 5 opens another filled draft editor.
* Step 7 shows the same number of draft rows as step 1.
* Step 8 still reads `<available before>`.

<!-- trace:case id=g10adm.auction-listing.TC-tr8 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### grade10-admin-auction-listing-US9-TC9-1: A second Relist editor saved after the first is refused

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
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_12>` closed Unsold in no campaign, its hold is released, and it has never been relisted.
* `<product_12>` shows `<available before>` units available.
* admin(holds auction:operate) has <grade10 auction admin listings url> open in two browser tabs.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | An Unsold listing for `<product_12>`, quantity `<quantity>` |
| `<quantity>` | 3 units (any quantity from 1 to 500) |
| `<available before>` | 5 units (at least `<quantity>`) |
| `<available after>` | 2 units: `<available before>` minus `<quantity>` |

**Steps:**

1. In the first tab, click Relist on <listing_12>'s row.
2. In the second tab, click Relist on <listing_12>'s row.
3. In the first tab, set a start.
4. In the first tab, set a close.
5. In the first tab, click Save.
6. In the second tab, set a start.
7. In the second tab, set a close.
8. In the second tab, click Save.
9. Read the Listings table.
10. Read <product_12>'s available count on its product page.

**Expected Results:**

* Step 5 saves a new draft.
* Step 8 is refused as already relisted, and the editor stays open unsaved.
* Step 9 shows one new draft relisted from <listing_12>, and <listing_12>'s row offers no Relist.
* Step 10 reads <available after>.

---

## grade10-admin-auction-listing-US11: Operator starts a Cert-specific listing with its usual media

**As an** Auction operator,
**I want** selecting a product and Cert ID to show product-level media and
media tagged to that Cert first,
**so that** I can build the listing gallery from the source most likely to
document the unit I selected.

<!-- trace:case id=g10adm.auction-listing.TC-hhu rev=1 covers=g10adm.auction-listing.SC-vhc,g10adm.auction-listing.SC-lvn -->
### grade10-admin-auction-listing-US11-TC1-1: A Cert listing offers only matching source media

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-11

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> has untagged source media, media tagged to <selected Cert ID>, and media tagged to <other Cert ID>.
* <selected Cert ID> and <other Cert ID> are printed Cert IDs for <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product with all three source-media groups> |
| Selected Cert ID | <selected Cert ID> |
| Other Cert ID | <other Cert ID> |

**Steps:**

1. Select <product>.
2. Select <selected Cert ID>.
3. Open the main source media selector.

**Expected Results:**

* Step 3 offers untagged media and media tagged to <selected Cert ID>.
* Step 3 leaves media tagged to <other Cert ID> out of the main selector.

<!-- trace:case id=g10adm.auction-listing.TC-qqv rev=1 covers=g10adm.auction-listing.SC-vhc,g10adm.auction-listing.SC-lvn -->
### grade10-admin-auction-listing-US11-TC2-1: A Cert without printed ID gets untagged media

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-11

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> has untagged source media and media tagged to <other Cert ID>.
* <selected Cert record> belongs to <product> and has no printed Cert ID; its media remains untagged and shared across the product.
* <other Cert ID> is a printed Cert ID for <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product with untagged and Cert-tagged media> |
| Selected Cert record | <Cert record without a printed Cert ID> |
| Other Cert ID | <other Cert ID> |
| Untagged media | <shared product media, including media left untagged for the selected record> |

**Steps:**

1. Select <product>.
2. Select <selected Cert record>.
3. Open the main source media selector.

**Expected Results:**

* The selector offers untagged product media, including <untagged media>.
* Media tagged to <other Cert ID> is absent from the main selector.

<!-- trace:case id=g10adm.auction-listing.TC-hb3 rev=1 covers=g10adm.auction-listing.SC-vhc,g10adm.auction-listing.SC-lvn -->
### grade10-admin-auction-listing-US11-TC3-1: A source from another product is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-11

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <listing product> is selected and <other product source media> belongs to a different product.
* <draft listing> has an existing gallery.

**Steps:**

1. Try to add <other product source media> to <draft listing>.
2. Read the listing gallery.

**Expected Results:**

* Step 1 refuses the selection.
* Step 2 shows the listing gallery unchanged.

---

## grade10-admin-auction-listing-US12: Operator deliberately uses another Cert's media

**As an** Auction operator,
**I want** another Cert's media separated into a labelled drawer and named
before I add it,
**so that** I can make an intentional exception without mistaking it for the
selected unit's normal media.

<!-- trace:case id=g10adm.auction-listing.TC-hhx rev=1 covers=g10adm.auction-listing.SC-xyf,g10adm.auction-listing.SC-01q,g10adm.auction-listing.SC-emr -->
### grade10-admin-auction-listing-US12-TC1-1: The Other Cert drawer groups media by printed ID

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-12

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> has media tagged to <selected Cert ID>, <other Cert ID A>, and <other Cert ID B>.
* <selected Cert ID>, <other Cert ID A>, and <other Cert ID B> are printed Cert IDs for <product>.
* <product> also has untagged source media.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product with untagged and Cert-tagged media> |
| Selected Cert ID | <selected Cert ID> |
| Other Cert IDs | <other Cert ID A> and <other Cert ID B> |

**Steps:**

1. Select <product>.
2. Select <selected Cert ID>.
3. Open the Other Cert media drawer.

**Expected Results:**

* Step 3 groups media for <other Cert ID A> and <other Cert ID B> under their printed Cert IDs.
* Step 3 leaves untagged product media out of the Other Cert drawer.

<!-- trace:case id=g10adm.auction-listing.TC-l19 rev=1 covers=g10adm.auction-listing.SC-xyf,g10adm.auction-listing.SC-01q,g10adm.auction-listing.SC-emr -->
### grade10-admin-auction-listing-US12-TC2-1: Adding other-Cert media identifies its source Cert

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-12

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> is selected with <selected Cert ID>.
* <source media> is tagged to the other printed Cert ID <source Cert ID> for <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product> |
| Selected Cert ID | <selected Cert ID> |
| Source Cert ID | <source Cert ID> |
| Source media | <media tagged to source Cert ID> |

**Steps:**

1. Open the Other Cert media drawer.
2. Choose <source media> under <source Cert ID>.
3. Select Add to listing for <source Cert ID>.

**Expected Results:**

* Step 3 adds <source media> to the listing gallery.
* Step 3 names <source Cert ID> as the source Cert.

<!-- trace:case id=g10adm.auction-listing.TC-msa rev=1 covers=g10adm.auction-listing.SC-xyf,g10adm.auction-listing.SC-01q,g10adm.auction-listing.SC-emr -->
### grade10-admin-auction-listing-US12-TC3-1: Source media additions use existing listing authority

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-12

**Pre-conditions:**

* admin(without existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <source media> is tagged to printed Cert ID <source Cert ID> for <product>.
* <listing> belongs to <product> and has a saved gallery.

**Steps:**

1. Request the Other Cert media drawer for <listing>.
2. Attempt to add <source media> from <source Cert ID> to <listing>.

**Expected Results:**

* Steps 1 and 2 are refused under existing Auction authorization.
* Step 2 leaves the listing gallery unchanged.

---

## grade10-admin-auction-listing-US13: Operator lists an unnumbered unit

**As an** Auction operator,
**I want** No Cert ID to show product-level media without bringing forward
another Cert's media,
**so that** I can start an unnumbered listing without assuming a numbered
copy's photographs apply.

<!-- trace:case id=g10adm.auction-listing.TC-pxu rev=1 covers=g10adm.auction-listing.SC-itk -->
### grade10-admin-auction-listing-US13-TC1-1: A No Cert ID listing offers only untagged media

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-13

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> has untagged source media and media tagged to printed Cert IDs.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product with untagged and Cert-tagged media> |
| Untagged media | <product-level source media> |
| Cert-tagged media | <source media tagged to a printed Cert ID> |

**Steps:**

1. Select <product>.
2. Select No Cert ID.
3. Open the main source media selector.

**Expected Results:**

* Step 3 offers <untagged media> only.
* Step 3 leaves media tagged to a printed Cert ID out of the main selector.

---

## grade10-admin-auction-listing-US14: Operator keeps a listing gallery independent of its source

**As an** Auction operator,
**I want** a selected source item's alt text copied into my listing gallery
and then editable with its order,
**so that** the listing records what I chose even if Inventory source media
changes later.

<!-- trace:case id=g10adm.auction-listing.TC-7b7 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC1-1: Saved source media copies current bytes and alt text

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <product> and <selected Cert ID> are selected for a draft listing.
* <source media> is available to the selected listing and has current alt text <source alt text>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product> |
| Selected Cert ID | <selected Cert ID> |
| Source media | <source image> |
| Source alt text | <current source alt text> |

**Steps:**

1. Open the main source media selector.
2. Add <source media> to the listing gallery.
3. Save the draft listing.

**Expected Results:**

* Step 3 shows a copy of <source media>'s bytes and <source alt text>.

<!-- trace:case id=g10adm.auction-listing.TC-i8h rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC2-1: Listing gallery copy supports alt and order edits

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has a copied source item <listing media> and another gallery item <other listing media>.

**Test data:**

| Field | Value |
| --- | --- |
| Listing media | <copied source item> |
| Other listing media | <another gallery item> |
| Listing alt text | <edited listing alt text> |

**Steps:**

1. Edit <listing media>'s alt text to <listing alt text>.
2. Move <listing media> after <other listing media>.
3. Save the draft listing.

**Expected Results:**

* Step 3 shows <listing alt text> for <listing media>.
* Step 3 shows <listing media> after <other listing media>.

<!-- trace:case id=g10adm.auction-listing.TC-mop rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC3-1: Later source edits leave the listing snapshot unchanged

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
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Inventory operator with existing Inventory media-management authority) is on <grade10 Inventory media manager url>.
* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <saved listing> contains a copy of <source media> with <original alt text> before <other listing media>.
* <source media> and <other source media> belong to <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Source media | <original source image> |
| Replacement bytes | <replacement source image> |
| Original alt text | <original alt text> |
| Replacement alt text | <replacement alt text> |
| Other source media | <another source image> |

**Steps:**

1. Edit <source media> to use <replacement bytes>.
2. Set its alt text to <replacement alt text>.
3. Move <source media> after <other source media> in Inventory.
4. Open <saved listing>'s gallery as the Auction operator.

**Expected Results:**

* Step 4 keeps the original bytes and <original alt text>.
* Step 4 still shows the copy before <other listing media>.

<!-- trace:case id=g10adm.auction-listing.TC-mx8 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC4-1: Retagging source media preserves the listing snapshot

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
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Inventory operator with existing Inventory media-management authority) is on <grade10 Inventory media manager url>.
* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <saved listing> contains a copy of <source media>, which is tagged to <source Cert ID>.
* <other Cert ID> is another printed Cert ID for <product>.

**Test data:**

| Field | Value |
| --- | --- |
| Source media | <media tagged to source Cert ID> |
| Source Cert ID | <source Cert ID> |
| Other Cert ID | <other Cert ID> |
| Saved listing | <listing with a copy of source media> |

**Steps:**

1. Retag <source media> from <source Cert ID> to <other Cert ID>.
2. Open <saved listing>'s gallery as the Auction operator.

**Expected Results:**

* Step 2 keeps the same bytes and alt text as before the retag.

<!-- trace:case id=g10adm.auction-listing.TC-kk1 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC5-1: Untagging source media preserves the listing snapshot

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
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Inventory operator with existing Inventory media-management authority) is on <grade10 Inventory media manager url>.
* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <saved listing> contains a copy of <source media>, which is tagged to <source Cert ID>.

**Test data:**

| Field | Value |
| --- | --- |
| Source media | <media tagged to source Cert ID> |
| Source Cert ID | <source Cert ID> |
| Saved listing | <listing with a copy of source media> |

**Steps:**

1. Untag <source media> from <source Cert ID>.
2. Open <saved listing>'s gallery as the Auction operator.

**Expected Results:**

* Step 2 keeps the same bytes and alt text as before the untag.

<!-- trace:case id=g10adm.auction-listing.TC-xa0 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC6-1: Physical Cert removal deletes the source and preserves the listing snapshot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Inventory operator with existing Inventory media-management authority) is on <grade10 Inventory Cert record url>.
* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <source Cert record> is available with no active reservation.
* <source media> is tagged to printed Cert ID <source Cert ID> for <product>.
* <saved listing> contains a copy of <source media>.

**Test data:**

| Field | Value |
| --- | --- |
| Product | <product> |
| Source media | <media tagged to source Cert ID> |
| Source Cert ID | <source Cert ID> |
| Saved listing | <listing with a copy of source media> |

**Steps:**

1. Remove the physical unit for <source Cert ID> in Inventory.
2. Open <saved listing>'s gallery as the Auction operator.

**Expected Results:**

* Step 1 deletes the Cert record and its tagged source media.
* Step 2 keeps the same bytes and alt text as before that removal.

<!-- trace:case id=g10adm.auction-listing.TC-h87 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC7-1: Source selection accepts an eighth gallery item

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has seven gallery items and <source media> is available in its main selector.

**Test data:**

| Field | Value |
| --- | --- |
| Draft listing | <listing with seven gallery items> |
| Source media | <eligible source media> |

**Steps:**

1. Open the main source media selector.
2. Add <source media> to the listing gallery.
3. Save the draft listing.

**Expected Results:**

* Step 3 shows eight gallery items, including <source media>.

<!-- trace:case id=g10adm.auction-listing.TC-14t rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC8-1: A ninth source item is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has eight gallery items and <source media> is available in its main selector.

**Test data:**

| Field | Value |
| --- | --- |
| Draft listing | <listing with eight gallery items> |
| Source media | <eligible source media not already in the gallery> |

**Steps:**

1. Open the main source media selector.
2. Attempt to add <source media> to the listing gallery.
3. Save the draft listing.

**Expected Results:**

* Step 3 still shows eight gallery items.
* Step 3 leaves <source media> out of the saved gallery.

<!-- trace:case id=g10adm.auction-listing.TC-qbp rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC9-1: Source media and direct uploads share one ordered gallery

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/admin-listing.spec.ts`

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has no media and has <selected source media> available from its selected product.

**Test data:**

| Field | Value |
| --- | --- |
| Direct upload | <supported JPEG> |
| Selected source media | <eligible source video> |

**Steps:**

1. Add <direct upload> to <draft listing>.
2. Add <selected source media> after <direct upload>.
3. Save the draft listing.

**Expected Results:**

* Step 3 shows both items in the chosen order.
* Step 3 shows no more than eight items.

<!-- trace:case id=g10adm.auction-listing.TC-y48 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### grade10-admin-auction-listing-US14-TC10-1: A missing source media item refuses Save

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-14

**Pre-conditions:**

* admin(Auction operator with existing Auction listing-edit authority) is on <grade10 auction listing editor url>.
* <draft listing> has <selected source media> selected, but that source media is absent before Save.

**Steps:**

1. Save <draft listing>.

**Expected Results:**

* Step 1 refuses Save.
* Step 1 leaves the listing gallery unchanged.

---

## grade10-admin-auction-listing-US72: Operator reads a listing's code to act on a quoted reference

**As an** auction operator,
**I want** to see a listing's code on its admin screen,
**so that** I can match a support, finance or reconciliation request that quotes the code (or the payment reference built from it) back to the right listing and order.

<!-- trace:case id=g10adm.auction-listing.TC-4tj rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC1-1: Operator sees the code on a newly created listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* An authorized operator is on <grade10 auction admin listings url>.
* `<listing_1>` is a draft with every required create field set.

**Steps:**

1. Open `<listing_1>`.
2. Create the listing.

**Expected Results:**

* The Listings table and listing detail screen show the same listing code.
* The code is present with no further operator action.

<!-- trace:case id=g10adm.auction-listing.TC-01g rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC2-1: A draft listing shows no listing code yet

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* An authorized operator has a draft listing that has not yet been created.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.

**Expected Results:**

* The draft's admin screen shows no listing code.

<!-- trace:case id=g10adm.auction-listing.TC-q6k rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC3-1: Listing code matches its fixed two-letter-prefix shape

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* An authorized operator has a created listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Read the listing code shown.

**Expected Results:**

* The code is exactly 5 characters.
* Its first two characters are letters only, drawn from `ABCDEFGHJKMNPQRSTVWXYZ`, with no digit.
* Its remaining three characters are drawn from the full Crockford Base32 charset `0123456789ABCDEFGHJKMNPQRSTVWXYZ`.

<!-- trace:case id=g10adm.auction-listing.TC-0qe rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC4-1: Two listings receive distinct codes

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
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* An authorized operator is on <grade10 auction admin listings url>.
* `<listing_1>` and `<listing_2>` are drafts, each with every required create field set.

**Steps:**

1. Create `<listing_1>`.
2. Create `<listing_2>`.
3. Read the listing code shown on each listing's admin screen.

**Expected Results:**

* `<listing_1>` and `<listing_2>` show different listing codes.

<!-- trace:case id=g10adm.auction-listing.TC-8gd rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC5-1: A closed listing keeps its original listing code

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A closed listing whose code was `<listing code>` when it was created.
* An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the closed listing.

**Expected Results:**

* The admin screen still shows `<listing code>`.

<!-- trace:case id=g10adm.auction-listing.TC-z3q rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC6-1: A called-off listing keeps its original listing code

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A listing called off before close, whose code was `<listing code>` when it was created.
* An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the called-off listing.

**Expected Results:**

* The admin screen still shows `<listing code>`.

<!-- trace:case id=g10adm.auction-listing.TC-m09 rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC7-1: Listing code has no editable control on the form or the API

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
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A created listing whose code is `<listing code>`.
* An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Check the listing code for an editable input control.
4. Send an API write setting the listing code to a different value.

**Expected Results:**

* The listing code renders as read-only text, not an editable field.
* The API write is refused.
* The listing code remains `<listing code>`.

<!-- trace:case id=g10adm.auction-listing.TC-63a rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC8-1: Listing code follows existing admin listing access

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A created listing whose code is `LK423`.
* One signed-in operator has existing listing-admin read access.
* Another signed-in operator lacks that existing access.

**Steps:**

1. As the authorized operator, read `LK423` in the Listings table and listing detail screen.
2. As the other operator, attempt to open those same surfaces, including a request that names `LK423`.

**Expected Results:**

* The authorized operator sees `LK423` in both the Listings table and detail screen.
* The other operator receives the ordinary listing-access denial and cannot read private listing data.
* Knowing `LK423` does not grant or broaden admin access; no separate code permission is evaluated.

<!-- trace:case id=g10adm.auction-listing.TC-gc4 rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC9-1: Allocation retries a projected collision

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A newly created listing's 5-character candidate collides with an active code or retained reservation.

**Steps:**

1. Create the listing.
2. Read its code on the admin screen.

**Expected Results:**

* Allocation retries atomically.
* The stored code has the required shape and differs from the colliding code.

<!-- trace:case id=g10adm.auction-listing.TC-4rj rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC10-1: A retained listing-code reservation is never allocated again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A retained reservation holds the previously issued code `LK423`.

**Steps:**

1. Create a later listing.
2. Read its allocated code.

**Expected Results:**

* `LK423` remains unavailable.
* The later listing receives a different code.

<!-- trace:case id=g10adm.auction-listing.TC-1jo rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### grade10-admin-auction-listing-US72-TC11-1: Cancel preserves the canonical URL and does not release it

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
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A published listing has canonical URL `<listing_url>` and code `<listing_code>`.

**Steps:**

1. Call the listing off.
2. Open `<listing_url>` directly.
3. Search for the listing in browse and search.
4. Attempt to create another listing with the same canonical URL.

**Expected Results:**

* `<listing_url>` still serves the called-off listing's public page.
* The listing is absent from browse and search.
* The canonical URL and `<listing_code>` remain permanently reserved.
* A later listing cannot claim `<listing_url>`.

---

## grade10-admin-auction-listing-US73: Operator keeps a usable listing address while drafting

**As an** auction operator,
**I want** a saved draft to suggest a listing slug from its title and stable code,
**so that** I can start with a distinct public address and learn before Save when a chosen address is already reserved.

<!-- trace:case id=g10adm.auction-listing.TC-agw rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### grade10-admin-auction-listing-US73-TC1-1: A saved draft receives a title-and-code slug

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
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* An authorized operator has an unsaved draft titled `Charizard PSA 10`.

**Steps:**

1. Save the draft.

**Expected Results:**

* The draft receives a listing code.
* The Slug field is prefilled with normalized title words followed by the lower-case code, such as `charizard-psa-10-<lowercase code>`.
* The complete slug is at most 64 characters.

<!-- trace:case id=g10adm.auction-listing.TC-7zt rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### grade10-admin-auction-listing-US73-TC2-1: A titleless draft uses the neutral slug prefix

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
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* An authorized operator has an unsaved draft with no title.

**Steps:**

1. Save the draft.

**Expected Results:**

* The draft receives a slug in the form `lot-<lowercase code>`.

<!-- trace:case id=g10adm.auction-listing.TC-w2u rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### grade10-admin-auction-listing-US73-TC3-1: An untouched generated slug follows a title edit

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
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* A saved draft's Slug field still equals its last generated value.

**Steps:**

1. Change the title.
2. Save the draft.

**Expected Results:**

* The slug title portion is regenerated.
* The lower-case listing-code suffix is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-sry rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### grade10-admin-auction-listing-US73-TC4-1: An operator-edited slug survives a title edit

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
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* A saved draft has a generated slug that the operator replaced with another valid slug.

**Steps:**

1. Change the title.
2. Save the draft.

**Expected Results:**

* The operator's slug remains unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-6k1 rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### grade10-admin-auction-listing-US73-TC5-1: Leaving Slug reports a retained address collision

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
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* A completed, expired, or unsold listing already holds `charizard-psa-10-lk423`.
* An authorized operator is editing another draft.

**Steps:**

1. Enter `charizard-psa-10-lk423` in Slug.
2. Leave the Slug field.

**Expected Results:**

* The editor reports that the slug is unavailable without exposing the other listing's details.
* The value remains available for correction.
* Helper text states: `Slug must be unique. Completed, expired, and unsold listings also reserve their addresses.`

<!-- trace:case id=g10adm.auction-listing.TC-m70 rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### grade10-admin-auction-listing-US73-TC6-1: Save remains authoritative after a race

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* A draft's field-exit check reports `charizard-psa-10-lk423` available.
* Another listing claims that slug before the draft is saved.

**Steps:**

1. Save the draft with `charizard-psa-10-lk423`.

**Expected Results:**

* Save is refused with an unavailable-slug result.
* The draft's stored slug remains unchanged.

## Settled

- Asset selection uses existing listing-edit authorization; unauthorized requests are refused.
- `grade10-admin-auction-listing-US-08-TC1` is `grade10-admin-auction-listing-US8-TC1`: renamed to the compact id form while still draft.
- `grade10-admin-auction-listing-US-08-TC2` is `grade10-admin-auction-listing-US8-TC2`: renamed to the compact id form while still draft.
- `grade10-admin-auction-listing-US-08-TC3` is `grade10-admin-auction-listing-US8-TC3`: renamed to the compact id form while still draft.
- `grade10-admin-auction-listing-US-08-TC4` is `grade10-admin-auction-listing-US8-TC4`: renamed to the compact id form while still draft.
- **Refused relist Save** - the editor shows the refusal's name inline, such as Already relisted (Q15)
- **Relisted for good** - once a draft is saved from its Relist, the listing offers no second Relist, even if that draft is called off (Q18)

## Reconciliation

**Run:** QA2, 2026-09-30, after the anchors moved on Q10, Q13 and Q14. QA1's blind pass read the Feature set, the journeys, `decisions.md`, the proposal, the linked PRD sections, the durable suite and the domain suite with their Reconciliation stripped, and the two rulebooks; it was denied every `## Requirements` section, `openspec/specs/` beyond those, and the archive. QA2 read both suites, both deltas, `tech-design.md` and `tasks.md`. It is a statement, not proof.

- **Raised, folded into spec** - a close whose only bids are `outbid`, its top bid demoted, releasing like one with no bids (`grade10-admin-auction-listing-US9-TC1-2`'s second row), as `grade10-admin-auction-listing-SC-146`, cited in tasks 3.1, 3.2 and 7.1; Relist on the row once released, outside a campaign, once per listing, as `grade10-admin-auction-listing-SC-137`, `grade10-admin-auction-listing-SC-141`, `grade10-admin-auction-listing-SC-142` and `grade10-admin-auction-listing-SC-143`; the note dated by the successful release, as `grade10-admin-auction-listing-SC-134`
- **Raised, escalated** - the words an operator reads when a relist Save is refused, landed as Q15, the refusal's name shown inline
- **Raised, rejected** - none this run; a Relist on a called-off listing stays refused by Q10
- **Joined** - `grade10-admin-auction-listing-SC-135` into `grade10-admin-auction-listing-US9-TC3-2`; `grade10-admin-auction-listing-SC-136` into `grade10-admin-auction-listing-US9-TC3-2` and `grade10-admin-auction-listing-US9-TC8-1`; `grade10-admin-auction-listing-SC-132` into `grade10-admin-auction-listing-US9-TC2-2`; `grade10-admin-auction-listing-SC-133` and `grade10-admin-auction-listing-SC-141` into `grade10-admin-auction-listing-US9-TC6-1`; `grade10-admin-auction-listing-SC-137` into `grade10-admin-auction-listing-US9-TC2-2` and `grade10-admin-auction-listing-US9-TC7-1`; `grade10-admin-auction-listing-SC-138` into `grade10-admin-auction-listing-US9-TC4-2`; `grade10-admin-auction-listing-SC-142` into `grade10-admin-auction-listing-US9-TC7-1`; `grade10-admin-auction-listing-SC-139` and `grade10-admin-auction-listing-SC-140` into `grade10-admin-auction-listing-US9-TC5-1`, the live listing's hold walked by `grade10-admin-inventory-catalog-US9-TC4-2`
- **Added by QA2** - `grade10-admin-auction-listing-US9-TC9-1` for `grade10-admin-auction-listing-SC-144`, two Relist editors on one listing, which no blind case reached
- **Out of suite** - `grade10-admin-auction-listing-SC-145`, a relist Save naming a sold, in-campaign or unreleased source: the row never offers Relist on one, so the refusals are decided by the relist save's service tests in grade10 (task 4.1)
- **Patched, not re-run** - `grade10-admin-auction-listing-US9-TC2-2`'s Sold row now records the sale, since a hold stays active after a winning close until the sale moves it to sold; `grade10-admin-auction-listing-US9-TC5-1` says "before this change shipped" where it said "before the release", which read as the stock release. Both keep `<v>`
- **Settled by the artifacts, not raised** - the listing attributes Relist carries (none: every field outside the Relist list starts as on a new draft, per the Relist requirement and the tech design); the listing's own page offering Relist (no: Q10 puts it on the row); a called-off relist draft freeing its source (no: the Relisted condition counts a saved listing, and a canceled draft stays saved); a called-off listing's note (none: the note belongs to a listing that closed with no winner)
- **Trimmed by the simpler reading** - the short-stock refusal on Relist Save, proved by the durable draft-save rule; the closed-listing-unchanged clause, held by `grade10-admin-auction-listing-US9-TC3-2`'s last step
- **Retired** - SC-131, a top bid under the reserve: no listing carries a reserve price, so the case cannot arise; its id is not reused
- **Restored** - the Purpose's gallery clause, to the wording `main` carries; no anchor or case moved
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-admin-auction-listing-US-09` has nine cases; the group anchor `Unsold close` is walked by `grade10-admin-auction-listing-US9-TC1-2`, `grade10-admin-auction-listing-US9-TC2-2`, `grade10-admin-auction-listing-US9-TC5-1` and `grade10-admin-auction-listing-US9-TC6-1`

**Run:** QA2 reconciliation 2026-10-01 for change `relay-auction-live-state`, joining QA1's blind cases with Dev's delta scenarios on `grade10-admin-auction-listing-US-01`, `-US-03` and `-US-04`. Read the change's `proposal.md`, `decisions.md` (Q16 to Q30 from `allow-zero-starting-price`), `tech-design.md`, `tasks.md`, this delta `spec.md`, `user-journeys.md` and `domain-tcs.md`. QA1 had read the frozen anchors only.

| Finding | Disposition |
| --- | --- |
| Draft refuses a negative or non-whole starting price, in each currency | **Folded in:** `grade10-admin-auction-listing-SC-03` |
| Draft keeps 0 apart from an empty price, both ways | **Folded in:** `grade10-admin-auction-listing-SC-124`; clearing back to empty is the requirement's "empty is allowed only while draft" |
| Create takes 0 in `USD`, `HKD` and `JPY`, with a formatted zero read-back on the form | **Folded in:** `grade10-admin-auction-listing-SC-125`; the read-back is the requirement's formatted-amount line (Q21) |
| API create refuses -1 and 0.5 | **Folded in:** `grade10-admin-auction-listing-SC-126`; 0.5 is the requirement's integer minor units |
| API create with the price absent, null or empty is refused and stores no 0 | **Folded in:** `grade10-admin-auction-listing-SC-127` (Q23) |
| A created listing lowers to 0 and stays created | **Folded in:** `grade10-admin-auction-listing-SC-128` |
| API create with 0 and no currency creates as `HKD` 0 | **Folded in:** `grade10-admin-auction-listing-SC-125a`, added by this run (Q22) |
| A created listing at 0 publishes and its slug opens it | **Folded in:** `grade10-admin-auction-listing-SC-129`; publish does not check the price again (Q24) |
| A published listing refuses a change to 0 | **Folded in:** `grade10-admin-auction-listing-SC-25`; the requirement refuses any price write once published |
| Unchanged scenarios restated by the modified blocks - `SC-01`, `SC-02`, `SC-04`, `SC-05`, `SC-56`, `SC-24`, `SC-26`, `SC-27`, `SC-27a`, `SC-28`, `SC-70` | **Out of suite:** the durable suite's existing cases; this change does not alter what they verify |

**Uncovered anchors:** none. Every scenario serving `-US-01`, `-US-03` and `-US-04` that this change writes has a case.

**Run:** 2026-09-24; the listing blind suite was resumed from its original isolated reading after Q10 was added to the allowed decisions input. The reader saw the outline, journey, proposal, updated decisions and Raised table, linked Listings PRD, config context, and permitted suite material. It was denied Requirements, durable specs, archive, tech-design, and the inventory reading's draft. Its original missing-printed-ID question is settled by Q10; it raised no other genuine product question.

| Diff | Disposition |
| --- | --- |
| The first listing pass asked how a Cert record without a printed ID could be named in the Other Cert drawer and Add to listing action. | Q10 settles that every Cert record has an ID; No Cert ID stock is regular inventory with no Cert record. US11-TC2-1 is deprecated, SC-102 is removed, and US13-TC1-1 covers the untagged-only default for regular stock. |
| The outline separates the normal selector from deliberate cross-Cert selection. | TC1-1 and TC2-1 cover the default selector, TC1-1 of US12 covers drawer grouping, and TC2-1 of US12 covers an explicit addition naming its source Cert. SC-101 through SC-105 state those rules. |
| Inventory edits, retagging, untagging, and Cert deletion must not mutate a saved listing copy. | TC1-1 through TC6-1 of US14 cover copying current bytes/alt, listing edits, and later source changes; SC-106 through SC-111 state the snapshot behavior. |
| Existing direct uploads and gallery bounds remain unchanged while source media uses the same ordered gallery. | TC7-1 and TC8-1 cover source additions at the eight-item boundary; TC9-1 covers combined order; TC10-1 covers refusal when the selected source is no longer available at Save. Existing direct-upload type, size, order, and ninth-upload cases remain covered by the durable listing feature suite at `openspec/specs/grade10-admin/auction/listing/feature-tcs.md`. |
| Existing authority governs drawer reads and additions; a source belonging to another product is not eligible. | TC3-1 of US11 and TC3-1 of US12 cover refusal and unchanged gallery. SC-114 and SC-115 state those behaviors; no new grant is introduced. |

**Run:** Scenario reading from `spec.md` `## Requirements` plus the durable
capability's spec, journeys and PRD; suite reading from the isolated bundle
(Purpose, Feature set, `user-journeys.md`, `decisions.md` including
`## Raised`, the PRD's Listing code bullet, and the durable `feature-tcs.md`
for id continuity, `## Reconciliation` stripped) — the two run without sight
of each other's draft.

| Case | Scenario | Disposition |
| --- | --- | --- |
| `US72-TC1-1` | `SC-87` | Same claim, expanded to both the Listings table and detail screen, kept |
| `US72-TC2-1` | `SC-88` | Same claim, kept |
| `US72-TC3-1` | `SC-87` | Real, distinct route (shape assertion) to a scenario the requirement already stated; kept as its own case |
| `US72-TC4-1` | none | Real behaviour (uniqueness) the requirement's "unique-constrained column" implies but no scenario stated; folded in as `SC-91`, case retraced to it |
| `US72-TC5-1` | `SC-90` | Same claim, kept |
| `US72-TC6-1` | `SC-90` | Distinct route (call-off vs. close) to the same scenario, kept |
| `US72-TC7-1` | `SC-89` | Same claim, kept |
| `US72-TC8-1` | `SC-94` | Folded in: existing listing-admin read access controls the code; knowing it cannot grant access or private data. |
| `US72-TC9-1` | `SC-92` | Folded in: projection collision retry is implementation-backed behavior required by the allocation rule. |
| `US72-TC10-1` | `SC-93` | Folded in: permanent reservation includes deleted listings. |
| `US73-TC1-1` | `SC-118` | Same generated title-and-code behavior, with the length bound made observable, kept |
| `US73-TC2-1` | `SC-119` | Same neutral-prefix behavior, kept |
| `US73-TC3-1` | `SC-120` | Same untouched-generated-slug title-edit behavior, kept |
| `US73-TC4-1` | `SC-121` | Same operator-edit preservation behavior, kept |
| `US73-TC5-1` | `SC-122` | Same blur collision feedback and retained-address note, kept |
| `US73-TC6-1` | `SC-123` | Same authoritative save race behavior, kept |

No contradiction: both readings agree on every point they both covered.

**Settled**, added to `decisions.md`: the code is visible in both the Listings
table and detail screen under existing listing-admin read access; knowing it
cannot grant access or private data.

The called-off address case is part of this identifier change because the
canonical URL is a permanent listing reference. It replaces the former
`US5-TC7-1` expectation that call off rewrites and releases the slug.

Out of scope for this capability's reconciliation (raised by the blind
reading, not carried forward): whether pre-existing listings get a
backfilled code (a migration/tech-design question, not a behaviour this PM
proposal covers per its Non-Goals); a copy-to-clipboard affordance on the
code (a display-mechanism detail, not a stated requirement); an operator-
facing hard delete distinct from call off (no such action exists in this
capability's feature set; `decisions.md` Q12's "deleted entirely" describes a
record-retention case with no operator-facing control here).

### Review Findings — 2026-10-08

| Case | Specification basis | Disposition |
| --- | --- | --- |
| US1-TC1 | [Draft save and SC-01](spec.md#requirement-operator-saves-a-listing-as-a-draft): draft save does not require starts at or scheduled close at; saving without a window persists a draft off the catalogue. | Clear both time fields to reach the stated condition. Prefilled values are setup, not required behavior. |
| US1-TC3 | [SC-03](spec.md#scenario-grade10-admin-auction-listing-sc-03---draft-rejects-a-malformed-price): refuse the write and leave the starting price unchanged. | Keep refusal and the original price; do not accept an empty stored price because the implementation currently sends null. |
| US2-TC3 | [SC-48 and the gallery requirement](spec.md#requirement-listing-media-is-an-ordered-gallery-of-one-to-eight-uploads): store JPEG, MP4 and WebP in that order; deliver the public gallery in display order. [Listing media](../../../grade10-site/auction/listing-media/spec.md#requirement-the-details-page-shows-gallery-images-in-order) assigns playback to admin-listing but supplies no playback scenario. | Storage and display order are supported. The existing playback assertion and the added play step remain blocked on the listing spec author; an original public video path alone does not prove a player interaction. |
| US3-TC13 and US5-TC7 | [SC-21](spec.md#scenario-grade10-admin-auction-listing-sc-21---create-can-reuse-a-canceled-listings-original-slug) permits reuse, while [the cancel requirement and SC-42 body](spec.md#requirement-operator-may-call-off-a-listing-that-has-not-closed) preserve the slug, its public page and its reservation. [Identifier decision Q16](../../../../changes/archive/2026-10-06-define-public-auction-identifiers/decisions.md#decisions) selects preservation. | US5-TC7 revision 2 follows SC-42's body. US3-TC13 stays blocked until the author reconciles SC-21 and the older slug requirement. |
| US3-TC19 | [Prices and window, SC-27a](spec.md#requirement-prices-and-window-are-writable-before-publish): no extension duration supplied; create stores 1800 seconds. An explicit 0 disables extended bidding. | Revision 2 uses a draft with no duration supplied and an API create omitting the field. API is the chosen test mechanism, not a spec-mandated layer; it does not replace verification of the form's empty-field behavior. |
