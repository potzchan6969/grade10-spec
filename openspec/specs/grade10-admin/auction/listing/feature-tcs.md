# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-01, tcs-rules r1

**Out of suite:** grade10-admin-auction-listing-SC-64, grade10-admin-auction-listing-SC-65, grade10-admin-auction-listing-SC-66, grade10-admin-auction-listing-SC-67

## grade10-admin-auction-listing-US1: Operator saves an unfinished listing and comes back to it

**As an** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the rest arrives.

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

## grade10-admin-auction-listing-US3: Operator creates a listing that is ready to sell

**As an** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

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

### grade10-admin-auction-listing-US3-TC17-1: Extension window without a duration is refused

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
A created listing.

**Test data:**

| Field | Value |
| --- | --- |
| Extension window | 1800 seconds |
| Extension duration | 0 |

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Set an extension window of 1800 seconds and an extension duration of 0.

**Expected Results:**

* Grade10 refuses the write.
* The listing's extension settings are unchanged.

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

---

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
