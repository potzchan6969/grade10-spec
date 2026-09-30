# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-01, tcs-rules r1

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
An authorized operator on the Grade10 auction listings section.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Save a new listing with no title, no prices, and no window.
3. Check the public catalogue.

**Expected Results:**

* Grade10 persists a draft listing with those fields empty.
* The listing is absent from the public catalogue.

<!-- trace:case id=g10adm.auction-listing.TC-27b rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### grade10-admin-auction-listing-US1-TC2-1: Operator saves a partial draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**
An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Save a draft with a title and no starting price.

**Expected Results:**

* Grade10 persists the title.
* The listing remains a draft.
* Starting price stays empty.

<!-- trace:case id=g10adm.auction-listing.TC-qk8 rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### grade10-admin-auction-listing-US1-TC3-1: Draft rejects a malformed price

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**
A draft listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Set starting price to a non-positive or non-integer amount.

**Expected Results:**

* Grade10 refuses the write.
* Starting price is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-09o rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### grade10-admin-auction-listing-US1-TC4-1: Draft rejects a malformed slug

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**
A draft listing.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | Charizard PSA 9 |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Set slug to `Charizard PSA 9`.

**Expected Results:**

* Grade10 refuses the write.
* The slug is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-ys7 rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### grade10-admin-auction-listing-US1-TC5-1: Unauthorized draft save is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**
A signed-in operator who may not set an auction's prices and window.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Save a new draft.

**Expected Results:**

* Grade10 refuses the save.
* It persists no listing.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**
A draft listing with seven media items. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Upload an eighth JPEG.

**Expected Results:**

* Grade10 stores eight media items in the operator's order.

<!-- trace:case id=g10adm.auction-listing.TC-yrz rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC2-1: Ninth file is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**
A draft listing with eight media items.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Upload a ninth file.

**Expected Results:**

* Grade10 refuses the upload.
* The gallery still has eight items.

<!-- trace:case id=g10adm.auction-listing.TC-4p2 rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC3-1: Mixed images and videos are accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**
A draft listing with no media. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Upload a JPEG, then an MP4, then a WebP.
4. Publish the listing.
5. Open it as a collector.

**Expected Results:**

* Grade10 stores three media items in that order.
* A collector reading the published listing receives the JPEG, the MP4, and the WebP in that order.
* The MP4 plays as video from the uploaded bytes.

<!-- trace:case id=g10adm.auction-listing.TC-fsq rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC4-1: Upload is stored without processing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**
A draft listing.

**Test data:**

| Field | Value |
| --- | --- |
| File | a JPEG whose body is 2 mebibytes |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Upload a JPEG whose body is 2 mebibytes.
4. Fetch the stored original.

**Expected Results:**

* Grade10 stores and serves that same body and type as the item's original.
* Any named-size paths for the image come from `grade10-site/auction/listing-media`, not from a second stored object written at upload.

<!-- trace:case id=g10adm.auction-listing.TC-g0p rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC5-1: Unsupported type is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**
A draft listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Upload a file that is not JPEG, PNG, WebP, AVIF, MP4, WebM, or QuickTime.

**Expected Results:**

* Grade10 refuses the upload.
* The gallery is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-vfa rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC6-1: File over 100 mebibytes is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**
A draft listing.

**Test data:**

| Field | Value |
| --- | --- |
| File size | larger than 104857600 bytes |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Upload a file larger than 104857600 bytes.

**Expected Results:**

* Grade10 refuses the upload.
* The gallery is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-2rk rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC7-1: Operator reorders and removes media

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**
A published listing with three images in order A, B, C.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Move C first and remove B.
4. Navigate to <grade10 auction url> and find that listing's card.

**Expected Results:**

* The gallery is C, A.
* A collector's catalogue card is C.

<!-- trace:case id=g10adm.auction-listing.TC-9cs rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### grade10-admin-auction-listing-US2-TC8-1: Last media item cannot be removed after create

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**
A published listing with one JPEG.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Remove that JPEG.

**Expected Results:**

* Grade10 refuses the remove.
* The gallery still has that JPEG.

---

### grade10-admin-auction-listing-US2-TC9-1: Listing saves mixed media from its selected product

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
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**

* An admin(auction operator) edits a listing whose selected product has reusable media.

**Steps:**

1. Select product media, add a direct upload, interleave their order, and save.
2. Change the source product gallery and reopen the listing.

**Expected Results:**

* The listing retains one ordered mixed gallery.
* Later product-gallery changes do not alter the saved listing.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A draft listing with a title, slug `charizard-psa-9`, a starting price of 100000 minor units, a minimum increment of 5000 minor units, currency `HKD`, a start in the future, a scheduled close at after that start, and one JPEG.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 |
| Starting price | 100000 minor units |
| Minimum increment | 5000 minor units |
| Currency | HKD |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Create the listing.
4. Check the public catalogue.

**Expected Results:**

* Grade10 moves it to `created`.
* The listing is still absent from the public catalogue.

<!-- trace:case id=g10adm.auction-listing.TC-4hw rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC2-1: Create without a title is refused on the form and the API

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A draft listing with no title and every other required field set.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Submit create on the admin form.
4. Send create to the API without a title.

**Expected Results:**

* The admin form does not send create and names title as missing.
* A create sent to the API without a title is refused.
* The listing remains a draft.

<!-- trace:case id=g10adm.auction-listing.TC-yte rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC3-1: Create without a slug is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A draft listing with every required field set except slug.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Create the listing.

**Expected Results:**

* Grade10 refuses the create.
* The listing remains a draft.

<!-- trace:case id=g10adm.auction-listing.TC-xx5 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC4-1: Create without a starting price is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A draft listing with a title, a window, and no starting price.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Create the listing.

**Expected Results:**

* Grade10 refuses the create.
* The listing remains a draft.

<!-- trace:case id=g10adm.auction-listing.TC-78a rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC5-1: Create without media is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A draft listing with every required field set except media.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Create the listing.

**Expected Results:**

* Grade10 refuses the create.
* The listing remains a draft.

<!-- trace:case id=g10adm.auction-listing.TC-vtd rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC6-1: Created listing cannot clear a required field

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A created listing with a title.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Clear the title.

**Expected Results:**

* Grade10 refuses the write.
* The title is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-hdm rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC7-1: Create of a published listing is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A published listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Create it.

**Expected Results:**

* Grade10 refuses the create.
* The listing remains published.

<!-- trace:case id=g10adm.auction-listing.TC-hr0 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC8-1: Two categories from one taxonomy are refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A taxonomy with categories Pokémon and Sport. A listing the operator can write categories on.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Assign both Pokémon and Sport to the same listing.

**Expected Results:**

* Grade10 refuses the write.
* The listing's categories are unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-wcd rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC9-1: Canceled sale cannot receive a listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A canceled sale. A draft listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Attach the draft listing to the canceled sale.

**Expected Results:**

* Grade10 refuses the write.
* The listing's sale is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-b59 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC10-1: Duplicate slug is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A listing that is not canceled whose slug is `charizard-psa-9`. A second listing.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the second listing.
3. Set its slug to `charizard-psa-9`.

**Expected Results:**

* Grade10 refuses the write.
* The second listing's slug is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-3s0 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC11-1: Two drafts cannot share a slug

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A draft whose slug is `charizard-psa-9`. A second draft.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the second draft.
3. Set its slug to `charizard-psa-9`.

**Expected Results:**

* Grade10 refuses the write.
* The second draft's slug is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-ohw rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC12-1: Empty slugs on drafts are not a collision

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A draft with no slug. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Save another draft with no slug.

**Expected Results:**

* Grade10 accepts the save.
* Neither draft occupies a slug.

<!-- trace:case id=g10adm.auction-listing.TC-yjr rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC13-1: Create can reuse a canceled listing's original slug

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A canceled listing that previously used slug `charizard-psa-9`. A draft with every required field set, including slug `charizard-psa-9`.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the draft.
3. Create the draft.
4. Check the canceled listing's slug.

**Expected Results:**

* Grade10 moves the draft to `created`.
* The canceled listing still does not hold `charizard-psa-9`.

<!-- trace:case id=g10adm.auction-listing.TC-xtt rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC14-1: Create cannot reuse a closed listing's slug

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A closed listing whose slug is `charizard-psa-9`. A draft with every required field set, including slug `charizard-psa-9`.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the draft.
3. Create the draft.
4. Navigate to `/auction/listings/charizard-psa-9`.

**Expected Results:**

* Grade10 refuses the create.
* The draft remains a draft.
* `/auction/listings/charizard-psa-9` still returns the closed listing.

<!-- trace:case id=g10adm.auction-listing.TC-8u6 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC15-1: Operator corrects a created listing's starting price

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A created listing with starting price 100000 minor units `HKD`.

**Test data:**

| Field | Value |
| --- | --- |
| Starting price | 150000 minor units |
| Currency | HKD |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Set starting price to 150000 minor units.

**Expected Results:**

* Grade10 stores 150000 minor units `HKD`.
* The listing remains created.

<!-- trace:case id=g10adm.auction-listing.TC-4sr rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC16-1: Scheduled close at in the past is refused at create

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A draft listing whose scheduled close at is not after now.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Create the listing.

**Expected Results:**

* Grade10 refuses the create.
* The listing remains a draft.

<!-- trace:case id=g10adm.auction-listing.TC-o5r rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC18-1: Sandbox cannot change after create

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**
A created listing that was drafted as sandbox.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Clear sandbox.

**Expected Results:**

* Grade10 refuses the write.
* The listing remains sandbox.

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

* admin(holds the grant to set an auction's prices and window) has a created listing, `<listing_1>`.

**Test data:**

| Setting | Value |
| --- | --- |
| Extension window | 1800 seconds |
| Extension duration | -60 seconds |

**Steps:**

1. Write the row's setting at the row's value to `<listing_1>`.
2. Read `<listing_1>`'s extension settings.

**Expected Results:**

* Grade10 refuses the write.
* The extension settings are unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-o8h rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### grade10-admin-auction-listing-US3-TC19-1: Omitted extension duration defaults to 30 minutes

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
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_2>` is a draft with every required field set and no extension duration.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A draft listing with title, slug, prices, window and media set, extension duration empty |

**Steps:**

1. Open `<listing_2>`.
2. Create the listing.
3. Read its extension duration.

**Expected Results:**

* The listing is created.
* Its extension duration reads 1800 seconds.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A created listing with no publish at. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Publish it.
4. Navigate to <grade10 auction url>.

**Expected Results:**

* Grade10 moves it to `published`.
* A collector can read it on the public catalogue.

<!-- trace:case id=g10adm.auction-listing.TC-cp1 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC2-1: Created listing publishes at the scheduled time

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A created listing whose publish at is in the future.

**Steps:**

1. Wait until that publish at arrives.
2. Check the listing state.
3. Navigate to <grade10 auction url>.

**Expected Results:**

* Grade10 moves it to `published`.
* A collector can read it on the public catalogue.
* No further operator action was required.

<!-- trace:case id=g10adm.auction-listing.TC-4ju rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC3-1: Collector opens a listing by slug

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A published listing whose slug is `charizard-psa-9`.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | charizard-psa-9 |

**Steps:**

1. Navigate to `/auction/listings/charizard-psa-9`.

**Expected Results:**

* Grade10 returns that listing.

<!-- trace:case id=g10adm.auction-listing.TC-h6l rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC4-1: Unknown slug is not found

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
No published, closed, or settled listing with slug `no-such-lot`.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | no-such-lot |

**Steps:**

1. Navigate to `/auction/listings/no-such-lot`.

**Expected Results:**

* Grade10 answers as not found.

<!-- trace:case id=g10adm.auction-listing.TC-ld9 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC5-1: Operator updates copy on a published listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A published listing titled "Charizard 1st Edition".

**Test data:**

| Field | Value |
| --- | --- |
| Title | Charizard 1st Edition |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Change its copy to a new description.
4. Open the listing as a collector.
5. Check title, prices, and window.

**Expected Results:**

* Grade10 stores the new copy.
* A collector reading the listing sees the new copy.
* The title, prices, and window are unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-mj0 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC6-1: Published slug cannot change

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A published listing whose slug is `charizard-psa-9`.

**Test data:**

| Field | Value |
| --- | --- |
| Attempted slug | charizard-psa-9-copy |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Set slug to `charizard-psa-9-copy`.
4. Navigate to `/auction/listings/charizard-psa-9`.

**Expected Results:**

* Grade10 refuses the write.
* `/auction/listings/charizard-psa-9` still returns that listing.

<!-- trace:case id=g10adm.auction-listing.TC-ofm rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC7-1: Published listing refuses a price change

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A published listing with starting price 100000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Starting price | 150000 minor units |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Set starting price to 150000 minor units.

**Expected Results:**

* Grade10 refuses the write.
* The starting price remains 100000 minor units.

<!-- trace:case id=g10adm.auction-listing.TC-8yj rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC8-1: A publish at in the past is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A created listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Set publish at to a time that is not after now.

**Expected Results:**

* Grade10 refuses the write.
* The listing remains created and unpublished.

<!-- trace:case id=g10adm.auction-listing.TC-bjv rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC9-1: Create with a past publish at is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A draft listing with every required field set and publish at in the past.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Create the listing.
4. Check the public catalogue.

**Expected Results:**

* Grade10 refuses the create.
* The listing remains a draft.
* It stays absent from the public catalogue.

<!-- trace:case id=g10adm.auction-listing.TC-qpo rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC10-1: Draft is not published when publish at arrives

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A draft listing with a publish at that has arrived and a missing title.

**Steps:**

1. Wait until that time is reached.
2. Check the listing state.
3. Check the public catalogue.

**Expected Results:**

* Grade10 does not publish the listing.
* It remains a draft.
* It stays absent from the public catalogue.

<!-- trace:case id=g10adm.auction-listing.TC-6j1 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC11-1: Manual publish of a draft is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A draft listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Publish it.

**Expected Results:**

* Grade10 refuses the publish.
* The listing remains a draft.

<!-- trace:case id=g10adm.auction-listing.TC-hji rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC12-1: Publish at cannot change after publish

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A published listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Set a new publish at.

**Expected Results:**

* Grade10 refuses the write.
* The listing remains published.

<!-- trace:case id=g10adm.auction-listing.TC-i4e rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-listing-US4-TC13-1: First item is the catalogue card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**
A published listing whose gallery is a video then a JPEG.

**Steps:**

1. Navigate to <grade10 auction url>.
2. Find that listing's card.

**Expected Results:**

* That listing's card uses the video as its media.
* It does not require a named physical side such as `front`.

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A draft listing. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Call it off.
4. Check the public catalogue.

**Expected Results:**

* Grade10 moves it to `canceled`.
* It stays absent from the public catalogue.

<!-- trace:case id=g10adm.auction-listing.TC-gw7 rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC2-1: Operator calls off a created listing before publish at

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A created listing with a publish at still in the future. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Call it off.
4. Wait until that publish at arrives.
5. Check the public catalogue.

**Expected Results:**

* Grade10 moves it to `canceled`.
* When that publish at arrives, Grade10 does not publish it.
* It stays absent from the public catalogue.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A published listing with accepted bids and live authorizations. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Call it off.
4. Check authorizations and the public catalogue.

**Expected Results:**

* Grade10 moves it to `canceled`.
* It releases every live authorization standing against it.
* It is absent from the public catalogue.

<!-- trace:case id=g10adm.auction-listing.TC-32t rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC4-1: Closed listing cannot be called off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A closed listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Call it off.

**Expected Results:**

* Grade10 refuses the cancel.
* The listing remains closed.

<!-- trace:case id=g10adm.auction-listing.TC-zkl rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC5-1: Settled listing cannot be called off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A settled listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Call it off.

**Expected Results:**

* Grade10 refuses the cancel.
* The listing remains settled.

<!-- trace:case id=g10adm.auction-listing.TC-uba rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC6-1: Already canceled listing cannot be called off again

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A canceled listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Call it off.

**Expected Results:**

* Grade10 refuses the cancel.
* The listing remains canceled.

<!-- trace:case id=g10adm.auction-listing.TC-z2r rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC7-1: Cancel rewrites the slug and frees the original

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A published listing whose id is `auc_550e8400-e29b-41d4-a716-446655440000` and whose slug is `charizard-psa-9`. An authorized operator.

**Test data:**

| Field | Value |
| --- | --- |
| Listing id | auc_550e8400-e29b-41d4-a716-446655440000 |
| Slug | charizard-psa-9 |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Call it off.
4. Navigate to `/auction/listings/charizard-psa-9`.

**Expected Results:**

* Grade10 stores slug `charizard-psa-9-cancelled-0e8400-e29b-41d4-a716-446655440000`.
* `/auction/listings/charizard-psa-9` does not return that listing.
* A later listing may be created with slug `charizard-psa-9`.

<!-- trace:case id=g10adm.auction-listing.TC-uyd rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC8-1: Cancel of a draft with no slug does not invent one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A draft listing with no slug. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.
3. Call it off.

**Expected Results:**

* Grade10 moves it to `canceled`.
* The listing still has no slug.

<!-- trace:case id=g10adm.auction-listing.TC-u5z rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC9-1: Unauthorized cancel is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A published listing. A signed-in operator who may not call a listing off.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Call it off.

**Expected Results:**

* Grade10 refuses the cancel.
* The listing remains published.
* Its slug is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-uu5 rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC10-1: Closed listing rejects a title edit

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A closed listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Change its title.

**Expected Results:**

* Grade10 refuses the write.
* The title is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-72d rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-listing-US5-TC11-1: Closed listing rejects a media upload

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**
A closed listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Upload an image.

**Expected Results:**

* Grade10 refuses the upload.
* The gallery is unchanged.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Pre-conditions:**
An authorized operator (holding `auction:operate`) on the Grade10 auction Listings section.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Check the section heading row.

**Expected Results:**

* A Create listing action is present.

<!-- trace:case id=g10adm.auction-listing.TC-wnl rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### grade10-admin-auction-listing-US6-TC2-1: Listing editor opens with no campaign

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Pre-conditions:**
An authorized operator on <grade10 auction admin listings url>.

**Steps:**

1. Activate Create listing.
2. Check the Campaign control.

**Expected Results:**

* The listing editor opens.
* No campaign is selected in the Campaign control.

<!-- trace:case id=g10adm.auction-listing.TC-fxz rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### grade10-admin-auction-listing-US6-TC3-1: Full lifecycle with no campaign — draft, create, publish, slug lookup

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Pre-conditions:**
A new listing opened from <grade10 auction admin listings url> with no campaign, every required create field set, slug `standalone-lot-1`, and no publish at.

**Test data:**

| Field | Value |
| --- | --- |
| Slug | `standalone-lot-1` |
| Campaign | (empty) |

**Steps:**

1. Save the draft with a title and no campaign.
2. Create the listing.
3. Publish the listing.
4. Navigate to `/auction/listings/standalone-lot-1`.

**Expected Results:**

* Step 1 persists a draft with no campaign; the listing is absent from the public catalogue.
* Step 2 moves the listing to `created`; it still has no campaign and is absent from the catalogue.
* Step 3 moves the listing to `published`; it still has no campaign.
* Step 4 returns that listing.

<!-- trace:case id=g10adm.auction-listing.TC-34a rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### grade10-admin-auction-listing-US6-TC4-1: Listings table shows an unattached row

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Pre-conditions:**
A listing with no campaign exists. An authorized operator is on <grade10 auction admin listings url>.

**Steps:**

1. Check the campaign column for that listing's row.

**Expected Results:**

* The column shows "-".
* A campaign id is not the only label shown for that row.

<!-- trace:case id=g10adm.auction-listing.TC-duk rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### grade10-admin-auction-listing-US6-TC5-1: Create listing is withheld from an unauthorized operator

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Pre-conditions:**
A signed-in operator without `auction:operate` on <grade10 auction admin listings url>.

**Steps:**

1. Check the section heading row for a Create listing action.
2. Send a draft save for a new listing.

**Expected Results:**

* Create listing is not offered.
* The draft save is refused.

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
A published listing watched by two collectors on Grade10 and one collector on ZZZ. An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open Stats for that listing.
3. Check the watchers figure.

**Expected Results:**

* Stats shows 3 watchers.
* No watcher is named.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Pre-conditions:**
A published listing with no watches. An authorized operator is on <grade10 auction admin listings url>.

**Steps:**

1. Open Stats for that listing.
2. Check the watchers figure.

**Expected Results:**

* Stats shows 0 watchers, not a blank or "-".

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Pre-conditions:**
A closed listing still watched by two collectors. An authorized operator is on <grade10 auction admin listings url>.

**Steps:**

1. Open Stats for the closed listing.
2. Check the watchers figure.

**Expected Results:**

* Stats shows 2 watchers.

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
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Pre-conditions:**
An authorized operator on <grade10 auction admin listings url>.

**Steps:**

1. Check the Listings table headings.

**Expected Results:**

* There is no Watchers column.

## grade10-admin-auction-listing-US9: Operator lists an unsold lot again

**As an** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing,
**so that** a card nobody bought goes back on sale without me hunting for its stock.

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
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

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
| Top bid demoted | Only `outbid` bids; the top bid's card hold failed before the close | Closes Unsold, hold released |

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
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

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
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

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
* admin(reads listings, without `auction:operate`) is on <grade10 auction admin listings url>.

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
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

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
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

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
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

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
* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.

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
* admin(holds `auction:operate`) has <grade10 auction admin listings url> open in two browser tabs.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | An Unsold listing for `<product_12>`, quantity `<quantity>` |
| `<quantity>` | 3 units (any quantity from 1 to 500) |
| `<available before>` | 5 units (at least `<quantity>`) |
| `<available after>` | 2 units: `<available before>` minus `<quantity>` |

**Steps:**

1. In the first tab, click Relist on `<listing_12>`'s row.
2. In the second tab, click Relist on `<listing_12>`'s row.
3. In the first tab, set a start and a close, and click Save.
4. In the second tab, set a start and a close, and click Save.
5. Read the Listings table.
6. Read `<product_12>`'s available count on its product page.

**Expected Results:**

* Step 3 saves a new draft.
* Step 4 is refused as already relisted, and the editor stays open unsaved.
* Step 5 shows one new draft relisted from `<listing_12>`, and `<listing_12>`'s row offers no Relist.
* Step 6 reads `<available after>`.

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
