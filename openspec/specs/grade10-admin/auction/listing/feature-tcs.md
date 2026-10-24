# grade10-admin/auction/listing Test Cases

**Status:** pending-review · 0/147
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

**Out of suite (api):**
- `grade10-admin-auction-listing-SC-176` - the editor always names the translations it holds, and no console route sends an omitted object
- `grade10-admin-auction-listing-SC-177` - a saved object naming fewer languages than the stored one is sent by no console route

**Out of suite (non-GUI):**
- `grade10-admin-auction-listing-SC-200`, `grade10-admin-auction-listing-SC-201`, `grade10-admin-auction-listing-SC-202` - the Labs fixture seed is a developer panel no operator uses

## Background

* `<listings url>` is the Auction Listings page of the Grade10 admin console of the environment under test; a listing's editor, Media action and Stats open from its row. `<g10url>` is the Grade10 site; a published listing is `<g10url>/auction/listings/<slug>`, and `<auction url>` is the auction catalogue.
* The operator is admin(holds auction:operate), the grant to set an auction's prices and window, unless a case says otherwise. Every listing is priced in USD.
* A supported gallery file is a JPEG, PNG, WebP, AVIF, MP4, WebM or QuickTime file of at most 104857600 bytes; a gallery holds one to eight items.

## Walk 1: Relist an Unsold listing at its shared address and publish it

Starting state:

- admin(holds auction:operate) is on `<listings url>`.
- `<unsold source>` closed Unsold in no campaign, its stock released, never relisted, holding `<shared slug>` and `<source code>`.
- customer A can open `<g10url>/auction/listings/<shared slug>` in a second session.

Shared test data:

| Field | Value |
| --- | --- |
| unsold source | An Unsold listing outside a campaign, stock released, never relisted |
| shared slug | The slug `<unsold source>` holds before Relist |
| source code | `<unsold source>`'s listing code |

### Route

1. Select Relist on `<unsold source>`'s row and read the Slug field.
   - The editor shows `<shared slug>` filled in. `g10adm.auction-listing.US9-TC11`
2. Save the Relist draft without changing the slug.
   - The new draft holds `<shared slug>` and a listing code other than `<source code>`. `g10adm.auction-listing.US9-TC12`
   - Both listings' activity name the transfer of `<shared slug>` and the other listing. `g10adm.auction-listing.US9-TC12`
3. As customer A, open `<g10url>/auction/listings/<shared slug>` while the successor is a draft.
   - Page not found shows. `g10adm.auction-listing.US4-TC21`
4. Create the successor, select Publish now, and as customer A open the address again.
   - The page shows the published successor, not `<unsold source>`. `g10adm.auction-listing.US4-TC22`

## g10adm.auction-listing.US1: Operator saves an unfinished listing and comes back to it

**As a** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the rest arrives.

<!-- trace:case id=g10adm.auction-listing.TC-mqd rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### g10adm.auction-listing.US1-TC1: An empty draft saves and stays off the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.

**Steps:**

1. Select the create-listing control, leave the title and prices empty, clear the prefilled start and close times, and select Save.
2. Reopen the saved draft from Listings.
3. Open `<auction url>`.

**Expected Results:**

* Step 2 shows a draft with the title, prices and both times empty.
* Step 3 does not list the draft.

<!-- trace:case id=g10adm.auction-listing.TC-27b rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### g10adm.auction-listing.US1-TC2: A partial draft keeps what was entered

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | 1999 Charizard PSA 9 |

**Steps:**

1. Save a new draft titled `<title>` with no starting price.
2. Reopen the draft.

**Expected Results:**

* Step 2 shows a draft titled `<title>`, its starting price empty.

<!-- trace:case id=g10adm.auction-listing.TC-qk8 rev=3 -->
### g10adm.auction-listing.US1-TC3: A draft refuses a negative starting price

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_1>`'s editor.
* `<listing_1>` is a draft with starting price `<original price>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A draft listing |
| `<original price>` | USD1,000 (range: any whole-dollar amount) |
| `<negative price>` | USD-1 (fixed boundary: one dollar below 0) |

**Steps:**

1. Enter `<negative price>` as the starting price and select Save.
2. Reopen `<listing_1>`.

**Expected Results:**

* Step 1 refuses the save.
* Step 2 shows a draft with starting price `<original price>`, not empty.

<!-- trace:case id=g10adm.auction-listing.TC-uka rev=2 -->
### g10adm.auction-listing.US1-TC6: A starting price of 0 saves apart from an empty one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<listing_2>` is a draft with a title and no starting price; `<listing_3>` is a draft with a title and starting price `<price>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A draft with an empty starting price |
| `<listing_3>` | A draft with a starting price |
| `<price>` | USD1,000 (range: any whole-dollar amount above 0) |

**Steps:**

1. Open `<listing_2>`, enter a starting price of 0, save and reopen it.
2. Open `<listing_3>`, clear its starting price, save and reopen it.

**Expected Results:**

* Step 1 saves; the draft reads a starting price of USD0, not empty.
* Step 2 saves; the draft reads an empty starting price, not 0.

<!-- trace:case id=g10adm.auction-listing.TC-p7c rev=1 covers=grade10-admin-auction-listing-SC-221 -->
### g10adm.auction-listing.US1-TC7: A draft refuses a starting price with cents

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_1>`'s editor.
* `<listing_1>` is a draft with starting price `<starting price>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A draft listing |
| `<starting price>` | USD120 (range: any whole-dollar amount) |
| `<price with cents>` | USD120.50 (fixed boundary: not whole dollars) |

**Steps:**

1. Enter `<price with cents>` as the starting price and save the draft.
2. Read the starting price field and the message beside it.
3. Reload the editor and read the starting price.
4. Enter `<starting price>` and save the draft.

**Expected Results:**

* Step 2 shows the save refused, with a message naming the whole-dollar rule.
* Step 3 reads `<starting price>`, and the listing is still a draft.
* Step 4 saves, so the refusal was for the cents.

<!-- trace:case id=g10adm.auction-listing.TC-09o rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### g10adm.auction-listing.US1-TC4: A draft refuses a malformed slug

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's editor.

**Test data:**

| Field | Value |
| --- | --- |
| `<slug>` | Charizard PSA 9 (spaces and capitals; a slug is 1 to 64 lower-case words joined by hyphens) |

**Steps:**

1. Set the slug to `<slug>` and save.
2. Read the slug.

**Expected Results:**

* Step 1 refuses the slug.
* Step 2 shows the slug unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-ys7 rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### g10adm.auction-listing.US1-TC5: A draft save without the grant is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(may not set an auction's prices and window) is on `<listings url>`.

**Steps:**

1. Save a new draft.
2. Reload `<listings url>`.

**Expected Results:**

* Step 1 refuses the save.
* Step 2 lists no new listing.

---

## g10adm.auction-listing.US2: Operator puts a gallery on a listing

**As an** auction operator,
**I want** to attach, order, and replace the photographs and video of a card,
**so that** a collector judges the item from the images without asking me for more.

<!-- trace:case id=g10adm.auction-listing.TC-m8c rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### g10adm.auction-listing.US2-TC1: An eighth file stores in the operator's order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's Media action; the draft holds seven media items.

**Test data:**

| Field | Value |
| --- | --- |
| `<eighth file>` | charizard-back.jpg, a 2.4 MB JPEG |

**Steps:**

1. Upload `<eighth file>`.

**Expected Results:**

* The gallery holds eight items, `<eighth file>` last.

<!-- trace:case id=g10adm.auction-listing.TC-yrz rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### g10adm.auction-listing.US2-TC2: A ninth file is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's Media action; the draft holds eight media items.

**Test data:**

| Field | Value |
| --- | --- |
| `<ninth file>` | charizard-side.jpg, a 2.4 MB JPEG |

**Steps:**

1. Upload `<ninth file>`.

**Expected Results:**

* The upload is refused, and the gallery still holds eight items.

<!-- trace:case id=g10adm.auction-listing.TC-4p2 rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### g10adm.auction-listing.US2-TC3: Images and a video show to collectors in the operator's order

**Blocked:** Listing spec author - confirm an explicit playback assertion and its interaction; no current statement names the play action or its outcome.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* A saved draft has no media, every other create requirement met, and the matching stock hold for its unit.

**Test data:**

| Field | Value |
| --- | --- |
| `<jpeg>` | charizard-front.jpg, a 3.6 MB JPEG |
| `<mp4>` | charizard-turn.mp4, a playable 24 MB MP4 |
| `<webp>` | charizard-back.webp, a 1.8 MB WebP |

**Steps:**

1. Open the draft's Media action and choose `<jpeg>`, `<mp4>` and `<webp>` in that order.
2. Return to the editor, select Create, then publish the listing.
3. As a collector, open the listing's page, select the second gallery item and play it.

**Expected Results:**

* Step 1 stores the JPEG, the MP4 and the WebP in that order.
* Step 3 shows them in that order and plays `<mp4>`.

<!-- trace:case id=g10adm.auction-listing.TC-fsq rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### g10adm.auction-listing.US2-TC4: An upload is kept as uploaded

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's Media action.

**Test data:**

| Field | Value |
| --- | --- |
| `<jpeg>` | charizard-front.jpg, a 2 MiB JPEG (range: any JPEG under 100 mebibytes) |

**Steps:**

1. Upload `<jpeg>`.
2. Open the stored original from the gallery and save it.

**Expected Results:**

* The saved original is a JPEG of the same size in bytes and the same dimensions as `<jpeg>`.

<!-- trace:case id=g10adm.auction-listing.TC-g0p rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### g10adm.auction-listing.US2-TC5: An unsupported file type is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's Media action.

**Test data:**

| Field | Value |
| --- | --- |
| `<file>` | grading-report.pdf, a 1.3 MB PDF |

**Steps:**

1. Upload `<file>`.

**Expected Results:**

* The upload is refused, and the gallery is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-vfa rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### g10adm.auction-listing.US2-TC6: A file over 100 mebibytes is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's Media action.

**Test data:**

| Field | Value |
| --- | --- |
| `<file>` | A JPEG of 104857601 bytes (fixed boundary: one byte over 100 mebibytes) |

**Steps:**

1. Choose `<file>`.

**Expected Results:**

* The upload is refused, and the gallery is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-2rk rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### g10adm.auction-listing.US2-TC7: Reordering and removing media changes the catalogue card

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a published listing's Media action; its gallery reads A, B, C.

**Steps:**

1. Move C first, then remove B.
2. Open `<auction url>` and find the listing's card.

**Expected Results:**

* Step 1 leaves the gallery reading C, then A.
* Step 2's card shows C.

<!-- trace:case id=g10adm.auction-listing.TC-9cs rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### g10adm.auction-listing.US2-TC8: The last media item cannot be removed after create

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a published listing's Media action; its gallery holds one JPEG.

**Steps:**

1. Remove the JPEG.

**Expected Results:**

* The removal is refused, and the JPEG is still there.

<!-- trace:case id=g10adm.auction-listing.TC-kmw rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k,g10adm.auction-listing.SC-x5f,g10adm.auction-listing.SC-89c,g10adm.auction-listing.SC-cps,g10adm.auction-listing.SC-tgj,g10adm.auction-listing.SC-8h3,g10adm.auction-listing.SC-mn8 -->
### g10adm.auction-listing.US2-TC9: Product media and uploads save as one gallery the product cannot change

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-02

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; its selected product has reusable media.

**Test data:**

| Field | Value |
| --- | --- |
| `<upload>` | charizard-slab.jpg, a 2.2 MB JPEG |

**Steps:**

1. Select two of the product's media items, upload `<upload>`, and order them product, upload, product.
2. Save the listing.
3. In Inventory, reorder and delete media in the product's gallery.
4. Reopen the listing.

**Expected Results:**

* Step 2 keeps one gallery of both sources in that order.
* Step 4 shows the saved gallery unchanged.

---

## g10adm.auction-listing.US3: Operator creates a listing that is ready to sell

**As a** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

<!-- trace:case id=g10adm.auction-listing.TC-igg rev=2 -->
### g10adm.auction-listing.US3-TC1: A filled draft is created and stays off the catalogue

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* A draft has a title, slug `<slug>`, starting price `<starting price>`, a future start, a close after it, one JPEG and its unit's stock hold.

**Test data:**

| Field | Value |
| --- | --- |
| `<slug>` | charizard-psa-9 (any unique slug of 1 to 64 lower-case words joined by hyphens) |
| `<starting price>` | USD1,000 (range: any whole-dollar amount of 0 or more) |

**Steps:**

1. Open the draft and select Create.
2. Open `<auction url>`.

**Expected Results:**

* Step 1 shows the listing as created.
* Step 2 does not list it.

<!-- trace:case id=g10adm.auction-listing.TC-4hw rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC2: Create without an English title is refused on the form

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; the draft has every required field but a title.

**Steps:**

1. Select Create.
2. Reload the draft and read its status.

**Expected Results:**

* Step 1 sends nothing and names the title as missing.
* Step 2 still reads draft.

<!-- trace:case id=g10adm.auction-listing.TC-yte rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC3: Create without a slug is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; the draft has every required field but a slug.

**Steps:**

1. Select Create.
2. Reload the draft and read its status.

**Expected Results:**

* Step 1 refuses the create.
* Step 2 still reads draft.

<!-- trace:case id=g10adm.auction-listing.TC-xx5 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC4: Create without a starting price is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; the draft has a title and a window and no starting price.

**Steps:**

1. Select Create.
2. Reload the draft and read its status.

**Expected Results:**

* Step 1 refuses the create.
* Step 2 still reads draft.

<!-- trace:case id=g10adm.auction-listing.TC-78a rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC5: Create without media is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; the draft has every required field and no media.

**Steps:**

1. Select Create.
2. Reload the draft and read its status.

**Expected Results:**

* Step 1 refuses the create.
* Step 2 still reads draft.

<!-- trace:case id=g10adm.auction-listing.TC-vtd rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC6: A created listing cannot clear a required field

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a created listing's editor; the listing has a title.

**Steps:**

1. Clear the title and save.
2. Reload and read the title.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 shows the title unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-hdm rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC7: A published listing cannot be created again

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a published listing's editor.

**Steps:**

1. Look for Create, and select it if it is offered.
2. Read the listing's status.

**Expected Results:**

* Step 1 offers no Create, or refuses it.
* Step 2 still reads published.

<!-- trace:case id=g10adm.auction-listing.TC-hr0 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC8: Two categories from one taxonomy are refused

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds auction:operate) is on a writable listing's editor.
* One taxonomy holds the categories Pokémon and Sport.

**Steps:**

1. Select Pokémon and Sport in the categories control and select Save.
2. Reopen the listing and read its categories.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 shows the categories unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-wcd rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC9: A cancelled campaign cannot take a listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's editor.
* `<campaign>` is cancelled.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign>` | A cancelled campaign |

**Steps:**

1. Attach the draft to `<campaign>` and save.
2. Reload and read the draft's campaign.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 shows the campaign unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-b59 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC10: A slug a live listing holds is refused

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
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* `<holder>` holds `<slug>`.
* admin(holds auction:operate) is on a second saved draft's editor.

**Test data:**

| `<holder>` |
| --- |
| A listing that is not cancelled |
| Another draft |

| Field | Value |
| --- | --- |
| `<slug>` | charizard-psa-9 |

**Steps:**

1. Set the slug to `<slug>` and save.
2. Reload and read the slug.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 shows the slug unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-ohw rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC12: Drafts with empty slugs do not collide

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`, and a draft is saved with no slug.

**Steps:**

1. Save another draft with no slug.
2. Read both drafts' slugs.

**Expected Results:**

* Step 1 saves.
* Step 2 shows both slugs empty.

<!-- trace:case id=g10adm.auction-listing.TC-yjr rev=4 covers=g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-yml -->
### g10adm.auction-listing.US3-TC13: Create reuses a called-off listing's slug and leaves its bidder's record alone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* `<original listing>` was called off; it held `<released slug>` and keeps `<original code>`, and `<original bidder>` placed accepted bids on it first.
* `<replacement>` is a complete saved draft with another slug, for another available unit.
* admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| `<original listing>` |
| --- |
| A listing called off in this pass |
| A listing called off before released slugs could be reused |

| Field | Value |
| --- | --- |
| `<released slug>` | `<original listing>`'s former slug |
| `<original code>` | `<original listing>`'s code |
| `<replacement>` | A complete draft |

**Steps:**

1. Open `<replacement>`, enter `<released slug>` as its slug, leave the field, select Save, then Create.
2. Open `<original listing>` and read its status and code.
3. As `<original bidder>`, open My Auctions and read `<original listing>`'s row and bid history.
4. Open `<g10url>/auction/listings/<released slug>`.

**Expected Results:**

* Step 1 shows no unavailable-slug error, saves the slug and creates `<replacement>` with a code other than `<original code>`.
* Step 2 reads cancelled, with `<original code>` and no longer `<released slug>`.
* Step 3 keeps the original listing and its accepted bids, says the card was not charged, and links nowhere to `<replacement>`.
* Step 4 shows Page not found while `<replacement>` is unpublished, with nothing of `<original listing>`.

<!-- trace:case id=g10adm.auction-listing.TC-xtt rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC14: Create cannot take a closed listing's slug

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* A closed listing holds `<slug>`.
* admin(holds auction:operate) is on a draft's editor; the draft has every required field, slug `<slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<slug>` | charizard-psa-9 |

**Steps:**

1. Select Create, then read the draft's status.
2. Open `<g10url>/auction/listings/<slug>`.

**Expected Results:**

* Step 1 refuses the create, and the draft is still a draft.
* Step 2 still shows the closed listing.

<!-- trace:case id=g10adm.auction-listing.TC-8u6 rev=2 -->
### g10adm.auction-listing.US3-TC15: A created listing's starting price can be corrected

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds auction:operate) is on a created, unpublished listing's editor; its starting price is `<old price>`.

**Test data:**

| `<new price>` |
| --- |
| USD1,500 (range: any whole-dollar amount other than `<old price>`) |
| USD0 (fixed boundary) |

| Field | Value |
| --- | --- |
| `<old price>` | USD10,000 |

**Steps:**

1. Set the starting price to `<new price>` and save.
2. Reopen the listing and read its starting price and status.

**Expected Results:**

* Step 1 saves.
* Step 2 reads `<new price>`, and the listing still reads created.

<!-- trace:case id=g10adm.auction-listing.TC-h7v rev=2 -->
### g10adm.auction-listing.US3-TC21: Create accepts a starting price of 0

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_4>`'s editor.
* `<listing_4>` is a draft with a title, a slug, a start, a close after the start and now, one image, its stock hold, and no starting price.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A draft with every create requirement but a starting price |

**Steps:**

1. Enter a starting price of 0 and read the formatted amount.
2. Select Create.
3. Reopen `<listing_4>` and read its starting price.

**Expected Results:**

* Step 1 reads USD0.00 with no error on the field.
* Step 2 shows the listing created.
* Step 3 reads USD0.

<!-- trace:case id=g10adm.auction-listing.TC-4sr rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC16: Create with a close that has passed is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; the draft's close is not after now.

**Steps:**

1. Select Create.
2. Reload and read the status.

**Expected Results:**

* Step 1 refuses the create.
* Step 2 still reads draft.

<!-- trace:case id=g10adm.auction-listing.TC-ow9 rev=1 covers=g10adm.auction-listing.SC-bcv -->
### g10adm.auction-listing.US3-TC27: Moving the start into the past is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; the draft opens tomorrow.

**Steps:**

1. Set Starts at to a time before now.
2. Select Save.
3. Reopen the draft and read Starts at.

**Expected Results:**

* Step 1 shows a refusal under Starts at before Save.
* Step 2 refuses the save.
* Step 3 still reads tomorrow's opening.

<!-- trace:case id=g10adm.auction-listing.TC-d11 rev=1 covers=g10adm.auction-listing.SC-d7l -->
### g10adm.auction-listing.US3-TC28: Moving the close into the past is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a created listing's editor; it closes next week.

**Steps:**

1. Set the close to a time before now.
2. Select Save.
3. Reopen the listing and read its close and status.

**Expected Results:**

* Step 1 shows a refusal under Close before Save.
* Step 2 refuses the save.
* Step 3 still reads next week's close and created.

<!-- trace:case id=g10adm.auction-listing.TC-o5r rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC18: Sandbox cannot change after create

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds auction:operate) is on a created listing's editor; it was drafted as sandbox.

**Steps:**

1. Clear Sandbox and save.
2. Reload and read the Sandbox setting.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 still reads Sandbox.

<!-- trace:case id=g10adm.auction-listing.TC-nsg rev=1 covers=g10adm.auction-listing.SC-17a -->
### g10adm.auction-listing.US3-TC30: A draft may start from a Chinese title, but Create needs the English one

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_7>`'s editor.
* `<listing_7>` is a draft with every other field Create needs, the Traditional Chinese title `<traditional title>` and no English title.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A draft with a product, quantity, starting price, slug, window and media |
| `<english title>` | Charizard PSA 10 |
| `<traditional title>` | 寶可夢 噴火龍 PSA 10 |

**Steps:**

1. Select Save, then reload.
2. Select Create, then reload.
3. Enter `<english title>` as the English title and select Create.

**Expected Results:**

* Step 1 saves the draft and shows `<traditional title>` with the English title empty.
* Step 2 refuses Create, naming the English title, and the listing is still a draft.
* Step 3 creates the listing.

<!-- trace:case id=g10adm.auction-listing.TC-3s0 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC11: Two drafts cannot share a slug

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Retirement:** The same refusal as `g10adm.auction-listing.US3-TC10` with another holder, now its row; replaced by `g10adm.auction-listing.US3-TC10`

**Pre-conditions:**

* A draft already uses slug charizard-psa-9, and a second draft is saved.

**Steps:**

1. Set the second draft's slug to charizard-psa-9.

**Expected Results:**

* The write is refused.

<!-- trace:case id=g10adm.auction-listing.TC-ebb rev=2 -->
### g10adm.auction-listing.US3-TC24: Operator lowers a created listing's starting price to 0

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Retirement:** The same correction as `g10adm.auction-listing.US3-TC15` with another value, now its row; replaced by `g10adm.auction-listing.US3-TC15`

**Pre-conditions:**

* `<listing_7>` is created and unpublished, starting price 1000000 minor units.

**Steps:**

1. Set the starting price to 0 and save.

**Expected Results:**

* The listing reads a starting price of 0 and created.

<!-- trace:case id=g10adm.auction-listing.TC-m53 rev=2 -->
### g10adm.auction-listing.US3-TC26: Currency change reformats the same minor-unit price

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Retirement:** The form offers no currency choice, so no currency change reformats a price; removed behaviour.

**Pre-conditions:**

* `<listing_13>` is a draft with every create requirement set except the starting price and currency.

**Steps:**

1. Select JPY, enter a starting price of 20, then select HKD.

**Expected Results:**

* The formatted starting price changes with the currency.

---

## g10adm.auction-listing.US4: Operator puts a listing in front of collectors

**As an** auction operator,
**I want** to publish a listing now or at a time I set in advance,
**so that** a lot opens at the hour the sale was announced for and reads at its own public address from then on.

<!-- trace:case id=g10adm.auction-listing.TC-amk rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC1: A created listing publishes at once

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a created listing's editor; it has no publish time.

**Steps:**

1. Select Publish now.
2. Open `<auction url>`.

**Expected Results:**

* Step 1 shows the listing published.
* Step 2 lists it.

<!-- trace:case id=g10adm.auction-listing.TC-cp1 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC2: A created listing publishes at its scheduled time with no further step

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* A created listing has a publish time `<publish in>` ahead, and nobody acts on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<publish in>` | 5 minutes (range: 1–60 minutes) |

**Steps:**

1. Wait until the publish time passes.
2. Read the listing's status on `<listings url>`.
3. Open `<auction url>`.

**Expected Results:**

* Step 2 reads published.
* Step 3 lists the listing.

<!-- trace:case id=g10adm.auction-listing.TC-4ju rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC3: A collector opens a published listing by its slug

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* A published listing holds `<slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<slug>` | charizard-psa-9 |

**Steps:**

1. Open `<g10url>/auction/listings/<slug>`.

**Expected Results:**

* The page shows that listing.

<!-- trace:case id=g10adm.auction-listing.TC-h6l rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC4: An unknown slug shows Page not found

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* No published, closed or settled listing holds `<slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<slug>` | no-such-lot |

**Steps:**

1. Open `<g10url>/auction/listings/<slug>`.

**Expected Results:**

* Page not found shows.

<!-- trace:case id=g10adm.auction-listing.TC-ld9 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC5: New copy on a published listing reaches collectors and nothing else moves

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a published listing's editor; it is titled `<title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | Charizard 1st Edition |
| `<description>` | Shadowless, centred, sharp corners. |

**Steps:**

1. Replace the description with `<description>` and save.
2. Open the listing's page as a collector and read the description, title, prices and window.

**Expected Results:**

* Step 2 shows `<description>`, with `<title>`, the prices and the window unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-mj0 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC6: A published listing's slug cannot change

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a published listing's editor; it holds `<slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<slug>` | charizard-psa-9 |
| `<new slug>` | charizard-psa-9-copy |

**Steps:**

1. Set the slug to `<new slug>` and save.
2. Open `<g10url>/auction/listings/<slug>`.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 still shows the listing.

<!-- trace:case id=g10adm.auction-listing.TC-ofm rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC7: A published listing refuses a new starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a published listing's editor; its starting price is `<old price>`.

**Test data:**

| `<new price>` |
| --- |
| USD1,500 (range: any whole-dollar amount other than `<old price>`) |
| USD0 (fixed boundary) |

| Field | Value |
| --- | --- |
| `<old price>` | USD1,000 |

**Steps:**

1. Set the starting price to `<new price>` and save.
2. Reopen the listing and read its starting price.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 still reads `<old price>`.

<!-- trace:case id=g10adm.auction-listing.TC-8yj rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC8: A publish time in the past is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a created, unpublished listing's editor.

**Steps:**

1. Set the publish time to before now and save.
2. Reload and read the status and publish time.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 still reads created and unpublished, with the earlier publish time.

<!-- trace:case id=g10adm.auction-listing.TC-bjv rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC9: Create with a past publish time is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; it has every required field and a publish time before now.

**Steps:**

1. Select Create, then reload and read the status.
2. Open `<auction url>`.

**Expected Results:**

* Step 1 refuses the create, and the listing is still a draft.
* Step 2 does not list it.

<!-- trace:case id=g10adm.auction-listing.TC-qpo rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC10: A draft does not publish when its publish time arrives

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* A draft has no title and a publish time that has just arrived.

**Steps:**

1. Read the listing's status on `<listings url>`.
2. Open `<auction url>`.

**Expected Results:**

* Step 1 still reads draft, not published.
* Step 2 does not list it.

<!-- trace:case id=g10adm.auction-listing.TC-6j1 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC11: A draft cannot be published by hand

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's editor.

**Steps:**

1. Select Publish if it is offered.
2. Read the status.

**Expected Results:**

* Step 1 offers no Publish, or refuses it.
* Step 2 still reads draft.

<!-- trace:case id=g10adm.auction-listing.TC-hji rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC12: The publish time cannot change after publish

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a published listing's editor.

**Steps:**

1. Set a new publish time and save.
2. Read the status.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 still reads published.

<!-- trace:case id=g10adm.auction-listing.TC-i4e rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC13: The first gallery item is the catalogue card, whatever it shows

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* A published listing's gallery is a video, then a JPEG.

**Steps:**

1. Open `<auction url>` and find the listing's card.

**Expected Results:**

* The card shows the video.

<!-- trace:case id=g10adm.auction-listing.TC-0q9 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-fcs,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC14: A listing starting at 0 publishes to its public address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_8>`'s editor; `<listing_8>` is created and unpublished, starting at USD0, slug `<slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A created listing with every create requirement, starting price USD0 |
| `<slug>` | no-reserve-charizard-psa-9 |

**Steps:**

1. Select Publish now.
2. Open `<g10url>/auction/listings/<slug>`.

**Expected Results:**

* Step 1 publishes the listing, with no starting-price refusal.
* Step 2 shows `<listing_8>`'s page.

<!-- trace:case id=g10adm.auction-listing.TC-mwk rev=1 covers=g10adm.auction-listing.SC-ow2 -->
### g10adm.auction-listing.US4-TC16: A publish time after the start is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a created listing's editor; it opens at `<starts at>` and has no publish time.

**Test data:**

| Field | Value |
| --- | --- |
| `<starts at>` | 2030-01-10 10:00 |
| `<publish at>` | 2030-01-10 11:00 (range: any time after `<starts at>`) |

**Steps:**

1. Set the publish time to `<publish at>`.
2. Select Save.
3. Reopen the listing and read the publish time.

**Expected Results:**

* Step 1 shows a refusal under Publish at before Save.
* Step 2 refuses the save.
* Step 3 shows no publish time.

<!-- trace:case id=g10adm.auction-listing.TC-dcp rev=1 covers=g10adm.auction-listing.SC-i7s -->
### g10adm.auction-listing.US4-TC18: Publish now on a scheduled listing asks first and clears its time

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; a created listing has a publish time ahead.

**Steps:**

1. Select the listing and Publish, and read the confirmation.
2. Confirm, then read the status and publish time.

**Expected Results:**

* Step 1's confirmation names the scheduled time and says publishing now removes it.
* Step 2 reads published, with no publish time.

<!-- trace:case id=g10adm.auction-listing.TC-rw9 rev=1 covers=g10adm.auction-listing.SC-2mk -->
### g10adm.auction-listing.US4-TC19: Publish now past the start publishes without asking

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; a created listing has no publish time, its start has passed and its close is ahead.

**Steps:**

1. Select the listing and Publish.
2. Read the status.

**Expected Results:**

* Step 1 asks for no confirmation.
* Step 2 reads published.

<!-- trace:case id=g10adm.auction-listing.TC-705 rev=1 covers=g10adm.auction-listing.SC-npx -->
### g10adm.auction-listing.US4-TC20: A scheduled listing names what its publish still needs

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a created listing's editor; it has a publish time ahead.

**Steps:**

1. Empty the title.
2. Read the message under Publish at.

**Expected Results:**

* The message names the title as a field the publish still needs.

<!-- trace:case id=g10adm.auction-listing.TC-rlf rev=1 covers=g10adm.auction-listing.SC-359 -->
### g10adm.auction-listing.US4-TC21: A shared address shows Page not found between Relist Save and Publish

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**

* `<unsold source>` closed Unsold in no campaign, its stock released, never relisted, and a Relist Save from it stored `<successor>` with `<shared slug>`.
* `<successor>` is `<state>`.
* admin(holds auction:operate) is on `<listings url>`; customer A is on `<g10url>` in a second session.

**Test data:**

| `<state>` |
| --- |
| A draft, unpublished |
| Created, unpublished |

| Field | Value |
| --- | --- |
| `<unsold source>` | An Unsold listing outside a campaign |
| `<shared slug>` | The slug `<unsold source>` held before Relist |

**Steps:**

1. As customer A, open `<g10url>/auction/listings/<shared slug>`.
2. As admin, open `<unsold source>` and read its slug.

**Expected Results:**

* Step 1 shows Page not found, with nothing of `<unsold source>` and no card of `<successor>`.
* Step 2 shows `<unsold source>` without `<shared slug>`.

<!-- trace:case id=g10adm.auction-listing.TC-rlx rev=1 covers=g10adm.auction-listing.SC-fde -->
### g10adm.auction-listing.US4-TC22: A shared address opens the Relist successor once it publishes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**

* `<unsold source>` closed Unsold in no campaign, its stock released, never relisted, holding `<shared slug>` and `<source code>`.
* admin(holds auction:operate) is on `<listings url>`; customer A is on `<g10url>` in a second session.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold source>` | An Unsold listing outside a campaign |
| `<shared slug>` | The slug `<unsold source>` holds before Relist |
| `<source code>` | `<unsold source>`'s listing code |

**Steps:**

1. Select Relist on `<unsold source>`'s row and save the draft with `<shared slug>` unchanged.
2. Create the successor, then select Publish now.
3. As customer A, open `<g10url>/auction/listings/<shared slug>`.
4. As admin, read `<unsold source>`'s status, code and slug.

**Expected Results:**

* Step 3 shows the published successor, reached at that one address with no redirect.
* Step 4 leaves `<unsold source>` closed Unsold under `<source code>`, without `<shared slug>`.

<!-- trace:case id=g10adm.auction-listing.TC-pcd rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-fcs,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC15: Published listing refuses a change to a starting price of 0

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Retirement:** The same claim as `g10adm.auction-listing.US4-TC7` on another value; replaced by `g10adm.auction-listing.US4-TC7`

**Pre-conditions:**

* <listing_9> is published, currency HKD, starting price 100000 minor units.

**Steps:**

1. Set the starting price to 0 and save.

**Expected Results:**

* The save is refused.

---

## g10adm.auction-listing.US5: Operator calls a listing off before it closes

**As an** auction operator,
**I want** to withdraw a lot at any point up to its close,
**so that** a consignor who pulls out or a card that fails authentication leaves the sale cleanly.

<!-- trace:case id=g10adm.auction-listing.TC-k37 rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC1: A draft is called off

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's editor.

**Steps:**

1. Call the draft off.
2. Open `<auction url>`.

**Expected Results:**

* Step 1 shows the listing cancelled.
* Step 2 does not list it.

<!-- trace:case id=g10adm.auction-listing.TC-gw7 rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC2: A scheduled listing called off never publishes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a created listing's editor; its publish time is `<publish in>` ahead.

**Test data:**

| Field | Value |
| --- | --- |
| `<publish in>` | 5 minutes (range: 1–60 minutes) |

**Steps:**

1. Call the listing off.
2. Wait until the publish time passes, then read the status.
3. Open `<auction url>`.

**Expected Results:**

* Step 1 shows the listing cancelled.
* Step 2 still reads cancelled, not published.
* Step 3 does not list it.

<!-- trace:case id=g10adm.auction-listing.TC-s7i rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC3: A published listing with bids is called off, charging nobody and releasing its stock

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a published listing's editor; customer A leads it, customer B was outbid, and its stock is held for it.

**Steps:**

1. Call the listing off.
2. As customer A and customer B, open My Auctions and read the listing's row; read both cards at the card provider.
3. Open the listing's product in Inventory and read its stock.
4. Open `<auction url>`.

**Expected Results:**

* Step 1 shows the listing cancelled.
* Step 2: both rows say the card was not charged, and neither card shows a charge.
* Step 3 shows the held stock released.
* Step 4 does not list the listing.

<!-- trace:case id=g10adm.auction-listing.TC-32t rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC4: A closed listing cannot be called off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a closed listing's editor.

**Steps:**

1. Call the listing off, if offered.
2. Read the status.

**Expected Results:**

* Step 1 offers no call-off, or refuses it.
* Step 2 still reads closed.

<!-- trace:case id=g10adm.auction-listing.TC-zkl rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC5: A settled listing cannot be called off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a settled listing's editor.

**Steps:**

1. Call the listing off, if offered.
2. Read the status.

**Expected Results:**

* Step 1 offers no call-off, or refuses it.
* Step 2 still reads settled.

<!-- trace:case id=g10adm.auction-listing.TC-uba rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC6: A cancelled listing cannot be called off again

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a cancelled listing's editor.

**Steps:**

1. Call the listing off, if offered.
2. Read the status.

**Expected Results:**

* Step 1 offers no call-off, or refuses it.
* Step 2 still reads cancelled.

<!-- trace:case id=g10adm.auction-listing.TC-z2r rev=4 covers=g10adm.auction-listing.SC-xck,g10adm.auction-listing.SC-ysx -->
### g10adm.auction-listing.US5-TC7: Calling a listing off frees its slug and keeps its bidder's record

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**

* admin(holds the grant to call off listings) is on `<listings url>`.
* `<listing>` is published, not closed, holds `<slug>` and `<code>`, and `<original bidder>` has accepted bids on it.
* `<draft>` is a separate editable draft with another slug.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | A published listing that has not closed |
| `<slug>` | `<listing>`'s slug |
| `<code>` | `<listing>`'s code |
| `<draft>` | A saved draft with another slug |

**Steps:**

1. Call `<listing>` off.
2. Open `<draft>`, enter `<slug>` as its slug, leave the field and select Save.
3. Open `<g10url>/auction/listings/<slug>`, then search `<auction url>` for `<listing>`'s title.
4. Reopen `<listing>` in admin.
5. As `<original bidder>`, open My Auctions and read `<listing>`'s row and bid history.

**Expected Results:**

* Step 1 shows `<listing>` cancelled.
* Step 2 shows no unavailable-slug error and saves `<slug>` on `<draft>`.
* Step 3 shows Page not found, never the cancelled listing, which no search finds.
* Step 4 still reads cancelled, under `<code>`.
* Step 5 keeps the listing and its accepted bids, says the card was not charged, and links nowhere to `<draft>`.

<!-- trace:case id=g10adm.auction-listing.TC-uyd rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC8: Calling off a draft with no slug invents none

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; it has no slug.

**Steps:**

1. Call the draft off.
2. Read its status and slug.

**Expected Results:**

* Step 2 reads cancelled, with no slug.

<!-- trace:case id=g10adm.auction-listing.TC-u5z rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC9: A call-off without the grant is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(may not call a listing off) is on a published listing's editor.

**Steps:**

1. Call the listing off, if offered.
2. Read its status and slug.

**Expected Results:**

* Step 1 offers no call-off, or refuses it.
* Step 2 still reads published, with its slug unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-uu5 rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC10: A closed listing refuses a title edit

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a closed listing's editor.

**Steps:**

1. Change the title and save.
2. Reload and read the title.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 shows the title unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-72d rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC11: A closed listing refuses a media upload

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a closed listing's Media action.

**Test data:**

| Field | Value |
| --- | --- |
| `<image>` | charizard-front.jpg, a 3.6 MB JPEG |

**Steps:**

1. Upload `<image>`.
2. Read the gallery.

**Expected Results:**

* Step 1 refuses the upload.
* Step 2 shows the gallery unchanged.

---

## g10adm.auction-listing.US6: Operator creates and publishes a listing with no campaign

**As an** auction operator,
**I want** to start a listing from the Listings section without picking a
campaign,
**so that** a one-off lot can go live without inventing a cover I do not need.

<!-- trace:case id=g10adm.auction-listing.TC-lev rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### g10adm.auction-listing.US6-TC1: The Listings page offers Create listing to an operator

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.

**Steps:**

1. Read the section's heading row.

**Expected Results:**

* It offers Create listing.

<!-- trace:case id=g10adm.auction-listing.TC-wnl rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### g10adm.auction-listing.US6-TC2: The listing editor opens with no campaign

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.

**Steps:**

1. Select Create listing and read the Campaign control.

**Expected Results:**

* The editor opens with no campaign selected.

<!-- trace:case id=g10adm.auction-listing.TC-fxz rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### g10adm.auction-listing.US6-TC3: A listing with no campaign is drafted, created, published and found by its slug

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) has a new listing open with no campaign, every create field set, slug `<slug>`, and no publish time.

**Test data:**

| Field | Value |
| --- | --- |
| `<slug>` | standalone-lot-1 (any unique slug of 1 to 64 lower-case words joined by hyphens) |

**Steps:**

1. Save the draft.
2. Select Create.
3. Select Publish now.
4. Open `<g10url>/auction/listings/<slug>`.

**Expected Results:**

* Step 1 saves a draft with no campaign, absent from `<auction url>`.
* Step 2 reads created, still with no campaign and absent from the catalogue.
* Step 3 reads published, still with no campaign.
* Step 4 shows the listing.

<!-- trace:case id=g10adm.auction-listing.TC-34a rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### g10adm.auction-listing.US6-TC4: A listing with no campaign reads "-" in the Listings table

**Classification:**

* **Severity:** trivial
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; a listing with no campaign is saved.

**Steps:**

1. Read that row's Campaign column.

**Expected Results:**

* It reads "-", not a bare campaign id.

<!-- trace:case id=g10adm.auction-listing.TC-duk rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### g10adm.auction-listing.US6-TC5: Create listing is withheld from an operator without the grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(without auction:operate) is on `<listings url>`.

**Steps:**

1. Read the section's heading row.

**Expected Results:**

* It offers no Create listing.

---

## g10adm.auction-listing.US8: Operator checks a listing's watchers

**As an** auction operator,
**I want** to see how many collectors watch a listing from its Stats dialog,
**so that** I can judge interest beside the bidder count without a second
surface for the same figure.

<!-- trace:case id=g10adm.auction-listing.TC-wkx rev=1 covers=g10adm.auction-listing.SC-qlf,g10adm.auction-listing.SC-7qf,g10adm.auction-listing.SC-sil,g10adm.auction-listing.SC-de9 -->
### g10adm.auction-listing.US8-TC1: Stats counts watchers across both brands

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; a published listing is watched by `<grade10 watchers>` collectors on Grade10 and `<zzz watchers>` on ZZZ.

**Test data:**

| Field | Value |
| --- | --- |
| `<grade10 watchers>` | 2 (range: 1–5) |
| `<zzz watchers>` | 1 (range: 1–5) |
| `<watchers>` | 3 (fixed derived): `<grade10 watchers>` plus `<zzz watchers>` |

**Steps:**

1. Open the listing's Stats and read the watchers figure.

**Expected Results:**

* It reads `<watchers>` and names no watcher.

<!-- trace:case id=g10adm.auction-listing.TC-gl0 rev=1 covers=g10adm.auction-listing.SC-qlf,g10adm.auction-listing.SC-7qf,g10adm.auction-listing.SC-sil,g10adm.auction-listing.SC-de9 -->
### g10adm.auction-listing.US8-TC2: An unwatched listing reads 0 watchers

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; a published listing has no watcher.

**Steps:**

1. Open the listing's Stats and read the watchers figure.

**Expected Results:**

* It reads 0, not blank or "-".

<!-- trace:case id=g10adm.auction-listing.TC-6o9 rev=1 covers=g10adm.auction-listing.SC-qlf,g10adm.auction-listing.SC-7qf,g10adm.auction-listing.SC-sil,g10adm.auction-listing.SC-de9 -->
### g10adm.auction-listing.US8-TC3: A closed listing keeps its watchers in Stats

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; a closed listing is still watched by two collectors.

**Steps:**

1. Open the listing's Stats and read the watchers figure.

**Expected Results:**

* It reads 2.

<!-- trace:case id=g10adm.auction-listing.TC-otd rev=1 covers=g10adm.auction-listing.SC-qlf,g10adm.auction-listing.SC-7qf,g10adm.auction-listing.SC-sil,g10adm.auction-listing.SC-de9 -->
### g10adm.auction-listing.US8-TC4: The Listings table has no Watchers column

**Classification:**

* **Severity:** trivial
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-08

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.

**Steps:**

1. Read the Listings table's headings.

**Expected Results:**

* No heading reads Watchers.

---

## g10adm.auction-listing.US9: Operator lists an unsold lot again

**As an** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing that keeps the lot's public address,
**so that** a card nobody bought goes back on sale without me hunting for its stock, and a shared link still opens the live lot.

<!-- trace:case id=g10adm.auction-listing.TC-tjt rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC1: An Unsold close releases the stock with no operator step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_1>` is published in no campaign, holding `<held quantity>` units of `<product_1>`, its close a few minutes away, with `<bids at close>`.
* admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| `<bids at close>` |
| --- |
| No bids |
| Bids, none of them leading at the close |

| Field | Value |
| --- | --- |
| `<listing_1>` | A published listing for `<product_1>`, in no campaign |
| `<product_1>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 3 units (range: 2–500, so a rise of one unit is told apart) |
| `<available before>` | 2 units (any count) |
| `<available after>` | 5 units (fixed derived): `<available before>` plus `<held quantity>` |

**Steps:**

1. Read `<product_1>`'s available count on its product page.
2. Wait until `<listing_1>`'s close passes, taking no action, then reload `<listings url>` and read its row.
3. Open `<listing_1>` and read its status and stock note.
4. Read `<product_1>`'s available count again.

**Expected Results:**

* Step 1 reads `<available before>`.
* Step 2's row reads Unsold and offers Relist.
* Step 3 reads Unsold, closed, and says the stock was released on the date the close passed.
* Step 4 reads `<available after>`.

<!-- trace:case id=g10adm.auction-listing.TC-juv rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC2: A sold or live listing shows no released note or Relist

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_2>` is in no campaign and `<state>`, holding `<held quantity>` units of `<product_2>`.
* admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| `<state>` |
| --- |
| Closed with a winner, its sale recorded |
| Published, its close still ahead |

| Field | Value |
| --- | --- |
| `<product_2>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (range: 1–500) |
| `<available before>` | 4 units (any count) |

**Steps:**

1. Read `<listing_2>`'s row.
2. Open `<listing_2>` and read its stock note.
3. Read `<product_2>`'s available count.

**Expected Results:**

* Step 1's row offers no Relist.
* Step 2 shows no released-stock note.
* Step 3 still reads `<available before>`.

<!-- trace:case id=g10adm.auction-listing.TC-xzh rev=4 -->
### g10adm.auction-listing.US9-TC3: Relist opens a filled new draft that holds stock only on Save

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_3>` closed Unsold with no bids, in no campaign, its stock released and never relisted.
* `<product_3>` shows `<available before>` units available.
* admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An Unsold listing for `<product_3>` with No Cert ID, quantity `<quantity>`, a title, copy, starting price `<price>`, three gallery items, slug `<slug_3>`, code `<code_3>`, a taxonomy category, Sandbox on, a window and a history |
| `<product_3>` | Regular stock without Cert IDs |
| `<quantity>` | 2 units (range: 1–500) |
| `<price>` | USD80 (range: any whole-dollar amount above 0) |
| `<available before>` | 5 units (range: at least `<quantity>`) |
| `<available after>` | 3 units (fixed derived): `<available before>` minus `<quantity>` |

**Steps:**

1. Select Relist on `<listing_3>`'s row and read the new draft's form.
2. Read `<product_3>`'s available count.
3. Set a start and a close on the draft, and select Save.
4. Read `<product_3>`'s available count, and the saved draft's campaign, taxonomy and Sandbox.
5. Return to `<listings url>`, read `<listing_3>`'s row, and open it.

**Expected Results:**

* Step 1 shows a new draft for `<product_3>`, No Cert ID, quantity `<quantity>`, with `<listing_3>`'s title, copy, starting price `<price>` and gallery in order, and no window, bids or history.
* Step 2 still reads `<available before>`.
* Step 3 saves a draft holding `<slug_3>` and a code other than `<code_3>`.
* Step 4 reads `<available after>`, and the draft has no campaign, no taxonomy category and Sandbox off.
* Step 5's row still reads Unsold with no Relist, and `<listing_3>` keeps its history.

<!-- trace:case id=g10adm.auction-listing.TC-bf8 rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC4: Relist is hidden from an admin without the operate grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_4>` closed Unsold in no campaign, its stock released and never relisted.
* admin(reads listings, without auction:operate) is on `<listings url>`.

**Steps:**

1. Read `<listing_4>`'s row.
2. Open `<listing_4>` and read its actions.

**Expected Results:**

* Step 1's row reads Unsold and shows no Relist, not even disabled.
* Step 2 shows no Relist.

<!-- trace:case id=g10adm.auction-listing.TC-hh5 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC5: The clean-up frees each earlier Unsold hold once

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_5>` and `<listing_6>` closed Unsold in no campaign before Unsold closes released stock, each still holding it.
* `<listing_7>` closed Unsold since, its stock already released at the close; `<listing_8>` closed with a winner.
* The one-time clean-up has not run; admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | Closed Unsold with no bids on `<old close date>`, holding 2 units of `<product_5>` |
| `<listing_6>` | Closed Unsold with bids none of which led, holding 1 unit of `<product_5>` |
| `<listing_7>` | Closed Unsold on `<recent close date>`, its 4 units of `<product_5>` released |
| `<listing_8>` | Closed sold, 1 unit of `<product_5>` sold |
| `<product_5>` | 6 units available before the clean-up (any count) |
| `<available after>` | 9 units (fixed derived): 6 plus 2 plus 1 |
| `<old close date>` | A date before Unsold closes released stock |
| `<recent close date>` | A date after it, before the clean-up |

**Steps:**

1. Read `<listing_5>`'s row and `<product_5>`'s available count.
2. Run the clean-up, then read `<product_5>`'s available count and the rows of `<listing_5>` and `<listing_6>`.
3. Open `<listing_5>` and `<listing_7>` and read their stock notes.
4. Run the clean-up again and read `<product_5>`'s available count.

**Expected Results:**

* Step 1's row offers no Relist, and the count reads 6.
* Step 2 reads `<available after>`, `<listing_8>`'s unit still sold, and both rows offer Relist.
* Step 3: `<listing_5>`'s stock was released on the clean-up's date, and `<listing_7>`'s on `<recent close date>`, not again.
* Step 4 still reads `<available after>`.

<!-- trace:case id=g10adm.auction-listing.TC-et4 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC6: No note or Relist shows until a failed release succeeds

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_9>` is published in no campaign with no bids, holding `<held quantity>` units of `<product_9>`, its close a few minutes away.
* The inventory release is made to fail until the tester lets it through; admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<product_9>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (range: 1–500) |
| `<available before>` | 3 units (any count) |

**Steps:**

1. Wait until the close passes, reload `<listings url>`, read the row, then open `<listing_9>` and read its status and stock note.
2. Read `<product_9>`'s available count.
3. Let the release through, wait for the next retry, reload `<listing_9>` and read its stock note.
4. Return to `<listings url>` and read the row.

**Expected Results:**

* Step 1's row reads Unsold with no Relist, and `<listing_9>` reads Unsold, closed, with no released-stock note.
* Step 2 reads `<available before>`.
* Step 3 says the stock was released, dated the successful release.
* Step 4's row offers Relist.

<!-- trace:case id=g10adm.auction-listing.TC-r14 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC7: Relist is not offered in a campaign or after a call-off

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_10>` is `<state>`, its stock released, never relisted.
* admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| `<state>` | `<row status>` |
| --- | --- |
| Closed Unsold with no bids, in a campaign | Unsold |
| Called off before its close, in no campaign | Cancelled |

**Steps:**

1. Read `<listing_10>`'s row.
2. Open `<listing_10>` and read its actions.

**Expected Results:**

* Step 1's row reads `<row status>` and offers no Relist.
* Step 2 shows no Relist.

<!-- trace:case id=g10adm.auction-listing.TC-smc rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC8: A Relist left unsaved stores nothing and stays offered

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_11>` closed Unsold in no campaign, its stock released, never relisted; `<product_11>` shows `<available before>` available.
* admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | An Unsold listing for `<product_11>`, quantity 1 |
| `<available before>` | 2 units (range: at least 1) |

**Steps:**

1. Count the draft rows, then select Relist on `<listing_11>`'s row and leave the editor without saving.
2. Read `<listing_11>`'s row, select Relist again and leave without saving.
3. Count the draft rows and read `<product_11>`'s available count.

**Expected Results:**

* Step 1 opens an editor filled from `<listing_11>`.
* Step 2's row still offers Relist, and it opens another filled editor.
* Step 3 shows the same number of draft rows as step 1, and `<available before>`.

<!-- trace:case id=g10adm.auction-listing.TC-tr8 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC9: A second Relist saved after the first is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_12>` closed Unsold in no campaign, its stock released, never relisted; `<product_12>` shows `<available before>` available.
* admin(holds auction:operate) has `<listings url>` open in two tabs.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | An Unsold listing for `<product_12>`, quantity `<quantity>` |
| `<quantity>` | 3 units (range: 1–500) |
| `<available before>` | 5 units (range: at least `<quantity>`) |
| `<available after>` | 2 units (fixed derived): `<available before>` minus `<quantity>` |

**Steps:**

1. In each tab, select Relist on `<listing_12>`'s row.
2. In the first tab, set a start and a close and select Save.
3. In the second tab, set a start and a close and select Save.
4. Read the Listings table and `<product_12>`'s available count.

**Expected Results:**

* Step 2 saves a new draft.
* Step 3 is refused as already relisted, and the editor stays open, unsaved.
* Step 4 shows one new draft relisted from `<listing_12>`, `<listing_12>`'s row with no Relist, and `<available after>`.

<!-- trace:case id=g10adm.auction-listing.TC-icj rev=1 -->
### g10adm.auction-listing.US9-TC10: Relist carries every written language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<listing_16>` closed Unsold, its stock released, holding `<texts written>`.

**Test data:**

| `<texts written>` |
| --- |
| English, Traditional Chinese and Simplified Chinese titles and descriptions |
| English and Traditional Chinese only |

| Field | Value |
| --- | --- |
| `<listing_16>` | An Unsold listing titled Charizard PSA 10, 寶可夢 噴火龍 PSA 10 and 宝可梦 喷火龙 PSA 10 where written |

**Steps:**

1. Select Relist on `<listing_16>`'s row and read each language's title and description.
2. Select Save, reload and read them again.
3. Open `<listing_16>` and read its texts.

**Expected Results:**

* Step 1 shows each text `<listing_16>` holds in its own language, and each language it left empty still empty.
* Step 2 shows the same texts as step 1.
* Step 3 shows `<listing_16>` unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-rls rev=1 -->
### g10adm.auction-listing.US9-TC11: The Relist editor fills in the source's slug

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<unsold source>` closed Unsold in no campaign, its stock released, never relisted, holding `<shared slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold source>` | An Unsold listing outside a campaign |
| `<shared slug>` | The slug `<unsold source>` holds |

**Steps:**

1. Select Relist on `<unsold source>`'s row and read the Slug field.
2. Leave the editor without saving and open `<unsold source>`.

**Expected Results:**

* Step 1 shows `<shared slug>`, not a new title-and-code slug.
* Step 2 shows `<unsold source>` still holding `<shared slug>`.

<!-- trace:case id=g10adm.auction-listing.TC-rlt rev=1 covers=g10adm.auction-listing.SC-ace,g10adm.auction-listing.SC-eaf,g10adm.auction-listing.SC-c83 -->
### g10adm.auction-listing.US9-TC12: Relist Save moves the slug, keeps a code of its own and records it on both listings

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<unsold source>` closed Unsold in no campaign, its stock released, never relisted, holding `<shared slug>`, `<source code>` and English title `<source title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold source>` | An Unsold listing outside a campaign |
| `<shared slug>` | The slug `<unsold source>` holds before Relist |
| `<source code>` | `<unsold source>`'s code |
| `<source title>` | `<unsold source>`'s English title |

**Steps:**

1. Select Relist on `<unsold source>`'s row and select Save with the slug unchanged.
2. Read the new draft's slug, code and English title.
3. Open `<unsold source>` and read its slug, code and activity.
4. Read the new draft's activity.

**Expected Results:**

* Step 2 shows `<shared slug>`, a code other than `<source code>`, and `<source title>`.
* Step 3 shows `<source code>` and no slug, and an activity entry naming `<shared slug>` and the new draft by its code and English title.
* Step 4 shows an activity entry naming `<shared slug>` and `<unsold source>` by `<source code>` and `<source title>`.

<!-- trace:case id=g10adm.auction-listing.TC-rlc rev=1 covers=g10adm.auction-listing.SC-d22 -->
### g10adm.auction-listing.US9-TC13: A Relist saved under a new slug frees the source's address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<unsold source>` closed Unsold in no campaign, its stock released, never relisted, holding `<shared slug>` and `<source code>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold source>` | An Unsold listing outside a campaign |
| `<shared slug>` | The slug `<unsold source>` holds before Relist |
| `<source code>` | `<unsold source>`'s code |
| `<new slug>` | charizard-psa-9-relisted (any valid unused slug) |

**Steps:**

1. Select Relist on `<unsold source>`'s row, replace the slug with `<new slug>`, and select Save.
2. Read the new draft's slug and code, then open `<unsold source>` and read its slug.
3. Open another editable draft, enter `<shared slug>` as its slug and leave the field.

**Expected Results:**

* Step 2 shows `<new slug>` and a code other than `<source code>`, and `<unsold source>` holding no slug.
* Step 3 shows no unavailable-slug error.

<!-- trace:case id=g10adm.auction-listing.TC-u8m rev=1 covers=g10adm.auction-listing.SC-ib3 -->
### g10adm.auction-listing.US9-TC14: A Relist saved with its slug cleared takes a generated address and frees the source's

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<unsold source>` closed Unsold in no campaign, its stock released, never relisted, holding `<shared slug>`, `<source code>` and English title `<source title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold source>` | An Unsold listing outside a campaign |
| `<shared slug>` | The slug `<unsold source>` holds before Relist |
| `<source code>` | `<unsold source>`'s code |
| `<source title>` | `<unsold source>`'s English title |

**Steps:**

1. Select Relist on `<unsold source>`'s row, clear the slug and select Save.
2. Read the new draft's slug and code, then open `<unsold source>` and read its slug.
3. Open another editable draft, enter `<shared slug>` as its slug and leave the field.

**Expected Results:**

* Step 2 shows a slug built from `<source title>` and the new draft's code, not `<shared slug>`, and a code other than `<source code>`.
* Step 2 shows `<unsold source>` holding no slug.
* Step 3 shows no unavailable-slug error.

<!-- trace:case id=g10adm.auction-listing.TC-rlb rev=1 covers=g10adm.auction-listing.SC-rlb -->
### g10adm.auction-listing.US9-TC15: The Unsold source reads Relisted once its Relist is saved

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<unsold source>` closed Unsold and has a saved Relist successor; `<other unsold>` closed Unsold and was never relisted.

**Steps:**

1. Open `<unsold source>`'s detail page.
2. Find `<unsold source>`'s and `<other unsold>`'s rows in the Listings table.

**Expected Results:**

* Step 1's header shows Relisted beside Unsold.
* Step 2 shows Relisted beside Unsold in `<unsold source>`'s Status, and Unsold alone for `<other unsold>`.

---

## g10adm.auction-listing.US11: Operator starts a Cert-specific listing with its usual media

**As an** Auction operator,
**I want** selecting a product and Cert ID to show product-level media and
media tagged to that Cert first,
**so that** I can build the listing gallery from the source most likely to
document the unit I selected.

<!-- trace:case id=g10adm.auction-listing.TC-hhu rev=1 covers=g10adm.auction-listing.SC-vhc,g10adm.auction-listing.SC-lvn -->
### g10adm.auction-listing.US11-TC1: A Cert listing's selector offers only shared media and that Cert's

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor.
* `<product>` has untagged media, media tagged to `<selected cert>` and media tagged to `<other cert>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A product with three source-media groups |
| `<selected cert>` | A Cert ID of `<product>` |
| `<other cert>` | Another Cert ID of `<product>` |

**Steps:**

1. Select `<product>` and `<selected cert>`, and open the main source selector.

**Expected Results:**

* It offers the untagged media and the media tagged to `<selected cert>`.
* It leaves out the media tagged to `<other cert>`.

<!-- trace:case id=g10adm.auction-listing.TC-hb3 rev=1 covers=g10adm.auction-listing.SC-vhc,g10adm.auction-listing.SC-lvn -->
### g10adm.auction-listing.US11-TC3: No selector offers another product's media

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor with `<listing product>` selected and a saved gallery.
* `<other media>` belongs to `<other product>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing product>` | The draft's product |
| `<other product>` | A different product with source media |
| `<other media>` | A source image of `<other product>` |

**Steps:**

1. Open the main source selector, then the Other Cert media drawer, and look for `<other media>`.
2. Read the gallery.

**Expected Results:**

* Neither offers `<other media>`.
* Step 2 shows the gallery unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-qqv rev=1 covers=g10adm.auction-listing.SC-vhc,g10adm.auction-listing.SC-lvn -->
### g10adm.auction-listing.US11-TC2: A Cert without printed ID gets untagged media

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-11

**Retirement:** Every Cert record now has a Cert ID, so no Cert record without one exists to select; removed behaviour.

**Pre-conditions:**

* <selected Cert record> belongs to <product> and has no printed Cert ID.

**Steps:**

1. Select <product> and <selected Cert record>, and open the main source selector.

**Expected Results:**

* The selector offers untagged product media.

---

## g10adm.auction-listing.US12: Operator deliberately uses another Cert's media

**As an** Auction operator,
**I want** another Cert's media separated into a labelled drawer and named
before I add it,
**so that** I can make an intentional exception without mistaking it for the
selected unit's normal media.

<!-- trace:case id=g10adm.auction-listing.TC-hhx rev=1 covers=g10adm.auction-listing.SC-xyf,g10adm.auction-listing.SC-01q,g10adm.auction-listing.SC-emr -->
### g10adm.auction-listing.US12-TC1: The Other Cert drawer groups other Certs' media by Cert ID

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor.
* `<product>` has untagged media and media tagged to `<selected cert>`, `<other cert a>` and `<other cert b>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A product with untagged and Cert-tagged media |
| `<selected cert>`, `<other cert a>`, `<other cert b>` | Three Cert IDs of `<product>` |

**Steps:**

1. Select `<product>` and `<selected cert>`, and open the Other Cert media drawer.

**Expected Results:**

* It groups the media of `<other cert a>` and `<other cert b>` under their Cert IDs.
* It holds no untagged media and none of `<selected cert>`'s.

<!-- trace:case id=g10adm.auction-listing.TC-l19 rev=1 covers=g10adm.auction-listing.SC-xyf,g10adm.auction-listing.SC-01q,g10adm.auction-listing.SC-emr -->
### g10adm.auction-listing.US12-TC2: Adding another Cert's media names that Cert

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor with `<product>` and `<selected cert>` selected.
* `<source media>` is tagged to `<source cert>`, another Cert ID of `<product>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<source media>` | An image tagged to `<source cert>` |

**Steps:**

1. Open the Other Cert media drawer, choose `<source media>` under `<source cert>`, and select Add to listing.

**Expected Results:**

* `<source media>` joins the gallery, and the action names `<source cert>`.

<!-- trace:case id=g10adm.auction-listing.TC-msa rev=1 covers=g10adm.auction-listing.SC-xyf,g10adm.auction-listing.SC-01q,g10adm.auction-listing.SC-emr -->
### g10adm.auction-listing.US12-TC3: Another Cert's media is out of reach without listing-edit authority

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(without listing-edit authority) opens `<listing>`, which belongs to `<product>` and has a saved gallery.
* `<source media>` is tagged to a Cert ID of `<product>`.

**Steps:**

1. Look for the Other Cert media drawer, and open it if it is offered.
2. Add `<source media>`, if anything allows it, then read the gallery.

**Expected Results:**

* The drawer is not offered, or opening it is refused.
* The gallery is unchanged.

---

## g10adm.auction-listing.US13: Operator lists an unnumbered unit

**As an** Auction operator,
**I want** No Cert ID to show product-level media without bringing forward
another Cert's media,
**so that** I can start an unnumbered listing without assuming a numbered
copy's photographs apply.

<!-- trace:case id=g10adm.auction-listing.TC-pxu rev=1 covers=g10adm.auction-listing.SC-itk -->
### g10adm.auction-listing.US13-TC1: A No Cert ID listing's selector offers only untagged media

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor.
* `<product>` has untagged media and media tagged to its Cert IDs.

**Steps:**

1. Select `<product>` and No Cert ID, and open the main source selector.

**Expected Results:**

* It offers the untagged media only.

---

## g10adm.auction-listing.US14: Operator keeps a listing gallery independent of its source

**As an** Auction operator,
**I want** a selected source item's alt text copied into my listing gallery
and then editable with its order,
**so that** the listing records what I chose even if Inventory source media
changes later.

<!-- trace:case id=g10adm.auction-listing.TC-7b7 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC1: A saved source item copies its image and current alt text

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor with a product and Cert ID selected.
* `<source media>` is in the main selector with alt text `<source alt>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<source alt>` | Charizard PSA 9, front |

**Steps:**

1. Add `<source media>` from the main selector and save the draft.

**Expected Results:**

* The gallery holds a copy of `<source media>`'s image with alt text `<source alt>`.

<!-- trace:case id=g10adm.auction-listing.TC-i8h rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC2: A copied item's alt text and place can be edited

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; its gallery holds a copied source item `<copy>` before `<other item>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<new alt>` | Charizard PSA 9, front, listing copy |

**Steps:**

1. Change `<copy>`'s alt text to `<new alt>`, move it after `<other item>`, and save.

**Expected Results:**

* `<copy>` reads `<new alt>` and sits after `<other item>`.

<!-- trace:case id=g10adm.auction-listing.TC-mop rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC3: Later edits to the source leave the listing's copy unchanged

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds Inventory media-management and auction:operate) has the product's media manager and a saved listing open.
* The saved listing holds a copy of `<source media>`, alt text `<original alt>`, before its other gallery item.

**Test data:**

| Field | Value |
| --- | --- |
| `<replacement image>` | charizard-front-retake.jpg, a 3.1 MB JPEG |
| `<original alt>` | Charizard PSA 9, front |
| `<replacement alt>` | Charizard PSA 9, front, retaken |

**Steps:**

1. In Inventory, replace `<source media>`'s image with `<replacement image>`, set its alt text to `<replacement alt>`, and move it after another item.
2. Open the saved listing's gallery.

**Expected Results:**

* Step 2 keeps the original image and `<original alt>`, still before the listing's other item.

<!-- trace:case id=g10adm.auction-listing.TC-mx8 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC4: Retagging the source leaves the listing's copy unchanged

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds Inventory media-management and auction:operate) has the product's media manager and a saved listing open.
* The saved listing holds a copy of `<source media>`, which is tagged to `<source cert>`; `<other cert>` is another Cert ID of the product.

**Steps:**

1. In Inventory, retag `<source media>` from `<source cert>` to `<other cert>`.
2. Open the saved listing's gallery.

**Expected Results:**

* Step 2 keeps the same image and alt text as before.

<!-- trace:case id=g10adm.auction-listing.TC-kk1 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC5: Untagging the source leaves the listing's copy unchanged

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds Inventory media-management and auction:operate) has the product's media manager and a saved listing open.
* The saved listing holds a copy of `<source media>`, which is tagged to `<source cert>`.

**Steps:**

1. In Inventory, untag `<source media>`.
2. Open the saved listing's gallery.

**Expected Results:**

* Step 2 keeps the same image and alt text as before.

<!-- trace:case id=g10adm.auction-listing.TC-xa0 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC6: Removing the source's physical unit leaves the listing's copy

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds Inventory write and auction:operate) has `<source cert>`'s record and a saved listing open.
* `<source cert>` is available, has moved since intake, and has no active reservation; `<source media>` is tagged to it, and the saved listing holds a copy.

**Test data:**

| Field | Value |
| --- | --- |
| `<withdrawal reason>` | Damaged in transit (any non-empty reason) |

**Steps:**

1. In Inventory, select Remove physical unit for `<source cert>`, enter `<withdrawal reason>` and confirm.
2. Read the product's Cert records and media, then open the saved listing's gallery.

**Expected Results:**

* Step 2: `<source cert>`'s record and `<source media>` are gone.
* Step 2: the listing keeps the same image and alt text as before the removal.

<!-- trace:case id=g10adm.auction-listing.TC-h87 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC7: A source item can be the eighth gallery item

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; its gallery holds seven items and `<source media>` is in the main selector.

**Steps:**

1. Add `<source media>` from the main selector and save.

**Expected Results:**

* The gallery holds eight items, `<source media>` among them.

<!-- trace:case id=g10adm.auction-listing.TC-14t rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC8: A ninth source item is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; its gallery holds eight items and `<source media>`, not in it, is in the main selector.

**Steps:**

1. Add `<source media>` from the main selector, then save.

**Expected Results:**

* The gallery still holds eight items, without `<source media>`.

<!-- trace:case id=g10adm.auction-listing.TC-qbp rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC9: Source media and uploads share one ordered gallery

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor with no media; `<source video>` is in its main selector.

**Test data:**

| Field | Value |
| --- | --- |
| `<upload>` | charizard-front.jpg, a 3.6 MB JPEG |
| `<source video>` | A source video of the selected product |

**Steps:**

1. Upload `<upload>`, add `<source video>` after it, and save.

**Expected Results:**

* The gallery reads `<upload>`, then `<source video>`.

<!-- trace:case id=g10adm.auction-listing.TC-y48 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC10: Save is refused when a chosen source item has gone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) chose `<source media>` in a draft's editor and has not saved; in a second session, `<source media>` has since been deleted in Inventory.

**Steps:**

1. Save the draft.

**Expected Results:**

* Save is refused, and the gallery is unchanged.

---

## g10adm.auction-listing.US70: Operator attaches one inventory unit to a listing

**As an** auction operator,
**I want** to choose a specific Cert ID or `No Cert ID` for the product I am
listing,
**so that** the listing identifies the physical unit it will sell without
blocking unnumbered stock.

<!-- trace:case id=g10adm.auction-listing.TC-hwp rev=1 -->
### g10adm.auction-listing.US70-TC1: A draft keeps the Cert ID or No Cert ID chosen for its product

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-70

**Pre-conditions:**

* admin(holds auction:operate) is on a new draft's editor.
* `<product>` has an available Cert ID `<cert>` and available regular stock without a Cert ID.

**Test data:**

| `<unit>` | `<available change>` |
| --- | --- |
| `<cert>` | The Cert ID count falls by one |
| No Cert ID | The regular stock falls by the draft's quantity |

| Field | Value |
| --- | --- |
| `<product>` | A product with Cert records and regular stock |
| `<cert>` | An available Cert ID of `<product>` |

**Steps:**

1. Select `<product>`, choose `<unit>`, and select Save.
2. Reopen the draft and read its unit, then read `<product>`'s stock in Inventory.

**Expected Results:**

* Step 2 shows `<unit>` kept on the draft, and `<available change>`, held for the listing.

---

## g10adm.auction-listing.US71: Operator creates and presents the selected unit

**As an** auction operator,
**I want** create to verify the inventory unit I saved and the listing to show
its configured identity,
**so that** a created lot cannot drift from the unit I intended to sell.

<!-- trace:case id=g10adm.auction-listing.TC-h8q rev=1 -->
### g10adm.auction-listing.US71-TC1: A created listing shows its unit, and No Cert ID shows no certificate row

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-71

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; it has every create field, its saved unit `<unit>`, and that unit's stock hold.

**Test data:**

| `<unit>` | `<certificate row>` |
| --- | --- |
| A Cert ID of the product | The certificate row names that Cert ID |
| No Cert ID | No certificate row shows |

**Steps:**

1. Select Create, then Publish now.
2. Open the listing's page on `<g10url>`.

**Expected Results:**

* Step 1 creates and publishes the listing on `<unit>`.
* Step 2 shows the product's identity from Inventory, and `<certificate row>`.

<!-- trace:case id=g10adm.auction-listing.TC-tgo rev=1 -->
### g10adm.auction-listing.US71-TC2: Create is refused when the saved unit has lost its hold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-71

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; it has every create field and a saved Cert ID, and in Inventory that unit no longer holds stock for the draft.

**Steps:**

1. Select Create.
2. Reload and read the status.

**Expected Results:**

* Step 1 refuses the create.
* Step 2 still reads draft.

---

## g10adm.auction-listing.US72: Operator reads a listing's code to act on a quoted reference

**As an** auction operator,
**I want** to see a listing's code on its admin screen,
**so that** I can match a support, finance or reconciliation request that quotes the code (or the payment reference built from it) back to the right listing and order.

<!-- trace:case id=g10adm.auction-listing.TC-4tj rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### g10adm.auction-listing.US72-TC1: A created listing shows the same code in the table and on its screen

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_1>`'s editor; it is a draft with every create field set.

**Steps:**

1. Select Create.
2. Read the code on the listing's screen and on its row in `<listings url>`.

**Expected Results:**

* Both show the same code, with no further operator step.

<!-- trace:case id=g10adm.auction-listing.TC-01g rev=2 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### g10adm.auction-listing.US72-TC2: A saved draft already shows its code

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.

**Steps:**

1. Save a new draft, then reopen it.
2. Select Create on it, once every create field is set, and read the code again.

**Expected Results:**

* Step 1 shows a listing code on the draft's screen.
* Step 2 shows the same code.

<!-- trace:case id=g10adm.auction-listing.TC-q6k rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### g10adm.auction-listing.US72-TC3: A listing code takes its five-character shape

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* admin(holds auction:operate) is on a created listing's screen.

**Steps:**

1. Read the listing code.

**Expected Results:**

* It is 5 characters: two letters from ABCDEFGHJKMNPQRSTVWXYZ, then three from 0123456789ABCDEFGHJKMNPQRSTVWXYZ.

<!-- trace:case id=g10adm.auction-listing.TC-0qe rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### g10adm.auction-listing.US72-TC4: Two listings get different codes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; `<listing_1>` and `<listing_2>` are drafts with every create field set.

**Steps:**

1. Create `<listing_1>` and `<listing_2>` and read each one's code.

**Expected Results:**

* The two codes differ.

<!-- trace:case id=g10adm.auction-listing.TC-8gd rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### g10adm.auction-listing.US72-TC5: A closed or called-off listing keeps its code

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A listing created with code `<listing code>` is now `<state>`; admin(holds auction:operate) is on `<listings url>`.

**Test data:**

| `<state>` |
| --- |
| Closed |
| Called off before its close |

| Field | Value |
| --- | --- |
| `<listing code>` | The code the listing showed when it was created |

**Steps:**

1. Open the listing and read its code.

**Expected Results:**

* It still reads `<listing code>`.

<!-- trace:case id=g10adm.auction-listing.TC-z3q rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### g10adm.auction-listing.US72-TC6: A called-off listing keeps its original listing code

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Retirement:** The same claim as `g10adm.auction-listing.US72-TC5` in another state, now its row; replaced by `g10adm.auction-listing.US72-TC5`

**Pre-conditions:**

* A listing called off before close, whose code was `<listing code>` when it was created.

**Steps:**

1. Open the called-off listing.

**Expected Results:**

* The admin screen still shows `<listing code>`.

<!-- trace:case id=g10adm.auction-listing.TC-m09 rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### g10adm.auction-listing.US72-TC7: A listing code cannot be edited

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* admin(holds auction:operate) is on a created listing's editor; its code is `<listing code>`.

**Steps:**

1. Look for an editable control on the listing code.
2. Save the listing and reload it.

**Expected Results:**

* Step 1 shows the code as read-only text, with no editable field.
* Step 2 still reads `<listing code>`.

<!-- trace:case id=g10adm.auction-listing.TC-63a rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### g10adm.auction-listing.US72-TC8: A listing code shows only to those who may read listings

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A created listing's code is `<listing code>`.
* admin A(may read listings) and admin B(may not) are signed in on separate sessions.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing code>` | LK423 (any created listing's code) |

**Steps:**

1. As admin A, read `<listing code>` in the Listings table and on the listing's screen.
2. As admin B, open `<listings url>` and the listing's address, and search for `<listing code>`.

**Expected Results:**

* Step 1 shows `<listing code>` in both places.
* Step 2 meets the ordinary listing-access refusal and shows no listing data; knowing the code grants nothing.

<!-- trace:case id=g10adm.auction-listing.TC-1jo rev=3 -->
### g10adm.auction-listing.US72-TC11: A called-off listing keeps its code after its address is reused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<called-off listing>` was published with `<original slug>` and `<listing code>`, then called off; `<later listing>` is a complete draft with another slug.

**Test data:**

| Field | Value |
| --- | --- |
| `<called-off listing>` | A called-off listing |
| `<original slug>` | Its former slug |
| `<listing code>` | Its code |
| `<later listing>` | A draft for a separate available unit |

**Steps:**

1. Open `<later listing>`, enter `<original slug>`, select Save, then Create, and read its code.
2. Open `<called-off listing>` and read its status and code.

**Expected Results:**

* Step 1 saves the released slug and shows a code other than `<listing code>`.
* Step 2 still reads cancelled under `<listing code>`.

---

## g10adm.auction-listing.US73: Operator keeps a usable listing address while drafting

**As an** auction operator,
**I want** a saved draft to suggest a listing slug from its title and stable code,
**so that** I can start with a distinct public address and learn before Save when a chosen address is already reserved.

<!-- trace:case id=g10adm.auction-listing.TC-agw rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### g10adm.auction-listing.US73-TC1: A saved draft takes a slug of its title and code

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) has an unsaved draft titled `<title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | Charizard PSA 10 |

**Steps:**

1. Save the draft and read its code and Slug field.

**Expected Results:**

* The draft has a code, and the slug reads charizard-psa-10- followed by the lower-case code, at most 64 characters.

<!-- trace:case id=g10adm.auction-listing.TC-7zt rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### g10adm.auction-listing.US73-TC2: A titleless draft's slug starts lot-

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) has an unsaved draft with no title.

**Steps:**

1. Save the draft and read the Slug field.

**Expected Results:**

* The slug reads lot- followed by the lower-case code.

<!-- trace:case id=g10adm.auction-listing.TC-w2u rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### g10adm.auction-listing.US73-TC3: An untouched generated slug follows a title edit

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's editor; its slug is still the generated one.

**Test data:**

| Field | Value |
| --- | --- |
| `<new title>` | Charizard PSA 9 |

**Steps:**

1. Change the title to `<new title>` and save.

**Expected Results:**

* The slug's title words become charizard-psa-9, and its code suffix is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-sry rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### g10adm.auction-listing.US73-TC4: An operator's own slug survives a title edit

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's editor; the operator replaced its generated slug with `<own slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<own slug>` | charizard-shadowless (any valid unused slug) |

**Steps:**

1. Change the title and save.

**Expected Results:**

* The slug still reads `<own slug>`.

<!-- trace:case id=g10adm.auction-listing.TC-6k1 rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### g10adm.auction-listing.US73-TC5: Leaving the Slug field reports a held address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* A completed, expired or unsold listing holds `<slug>`; admin(holds auction:operate) is editing another draft.

**Test data:**

| Field | Value |
| --- | --- |
| `<slug>` | charizard-psa-10-lk423 |

**Steps:**

1. Enter `<slug>` as the slug and leave the field.

**Expected Results:**

* The editor says the slug is unavailable, without naming the other listing, and the value stays for correction.
* The helper text reads Slug must be unique. Completed, expired, and unsold listings also reserve their addresses.

<!-- trace:case id=g10adm.auction-listing.TC-wrn rev=2 covers=g10adm.auction-listing.SC-ejg -->
### g10adm.auction-listing.US73-TC7: Two drafts saving a released slug at once leave one holder

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* admin A and admin B(each holding auction:operate) are editing `<draft a>` and `<draft b>` in separate sessions.
* A called-off listing has released `<original slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<original slug>` | The called-off listing's former slug |
| `<draft a>`, `<draft b>` | Complete drafts for separate units, with other slugs and titles |

**Steps:**

1. In both sessions, enter `<original slug>` and leave the field.
2. Submit both Saves at the same moment, and read both results.
3. Reopen both drafts; create and publish the one that saved.
4. Open `<g10url>/auction/listings/<original slug>`.

**Expected Results:**

* Step 1 reports the slug available in both sessions.
* Step 2 shows one save and one unavailable-slug refusal.
* Step 3 shows the refused draft with its earlier slug, and the called-off listing still cancelled with its code.
* Step 4 shows the draft that saved, never the other or the called-off listing.

<!-- trace:case id=g10adm.auction-listing.TC-rlv rev=1 covers=g10adm.auction-listing.SC-c90 -->
### g10adm.auction-listing.US73-TC8: Leaving the Slug field on a Relist draft treats its source's address as available

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<unsold source>` closed Unsold in no campaign, its stock released, never relisted, still holding `<shared slug>`.

**Steps:**

1. Select Relist on `<unsold source>`'s row, then leave the Slug field showing `<shared slug>`.
2. Leave the editor without saving and open `<unsold source>`.

**Expected Results:**

* Step 1 reports `<shared slug>` available, naming no collision.
* Step 2 shows `<unsold source>` still holding `<shared slug>`.

<!-- trace:case id=g10adm.auction-listing.TC-rl9 rev=1 -->
### g10adm.auction-listing.US73-TC9: A Relist draft still collides with another Unsold listing's address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<unsold source>` closed Unsold in no campaign, its stock released, never relisted; `<other unsold>` is another Unsold listing holding `<other slug>`.

**Steps:**

1. Select Relist on `<unsold source>`'s row, replace the slug with `<other slug>` and leave the field.
2. Select Save.

**Expected Results:**

* Step 1 reports a collision for `<other slug>`.
* Step 2 is refused while `<other unsold>` holds `<other slug>`.

<!-- trace:case id=g10adm.auction-listing.TC-rlw rev=1 covers=g10adm.auction-listing.SC-8b7 -->
### g10adm.auction-listing.US73-TC10: Another draft cannot take a moved slug while the Relist draft holds it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<relist draft>` was saved from Relist on `<unsold source>` and holds `<shared slug>`; `<other draft>` is an unrelated draft with no slug.

**Test data:**

| Field | Value |
| --- | --- |
| `<shared slug>` | umbreon-v-alt |
| `<other slug>` | umbreon-v-alt-relisted (any available slug) |

**Steps:**

1. On `<other draft>`, set the slug to `<shared slug>` and save.
2. On `<relist draft>`, replace the slug with `<other slug>` and save.
3. On `<other draft>`, set the slug to `<shared slug>` and save; then open `<unsold source>`.

**Expected Results:**

* Step 1 is refused while `<relist draft>` holds `<shared slug>`.
* Step 2 saves `<other slug>`.
* Step 3 saves `<shared slug>` on `<other draft>`, and `<unsold source>` holds no slug.

---

## g10adm.auction-listing.US74: Operator prices a listing in USD

**As a** auction operator,
**I want** a listing to price in USD with no other currency to choose,
**so that** I do not guess a currency for a lot every collector bids on in one unit.

<!-- trace:case id=g10adm.auction-listing.TC-htj rev=1 covers=grade10-admin-auction-listing-SC-159 -->
### g10adm.auction-listing.US74-TC1: The listing form offers no currency, and the listing reads USD

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-74

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_20>`'s editor, a new draft with a title.

**Test data:**

| Field | Value |
| --- | --- |
| `<price>` | USD5 (range: any whole-dollar amount of 0 or more) |

**Steps:**

1. Look for a currency control beside the starting price.
2. Enter `<price>` and save the draft, then reopen it.

**Expected Results:**

* Step 1 finds no currency control.
* Step 2 reads `<price>` in USD.

---

## g10adm.auction-listing.US75: Operator writes a listing's title and description in each language

**As an** auction operator,
**I want** to enter a listing's title and description in Traditional and Simplified Chinese beside the English,
**so that** collectors who browse in those languages read the lot in their own.

<!-- trace:case id=g10adm.auction-listing.TC-oxb rev=1 covers=g10adm.auction-listing.SC-eo6 -->
### g10adm.auction-listing.US75-TC1: All three languages are written on a listing and read back

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_1>`'s editor; it is a draft with a product, quantity, starting price, media and the English title `<english title>` only.

**Test data:**

| Field | Value |
| --- | --- |
| `<english title>` | Charizard PSA 10 |
| `<english description>` | 1999 Base Set, clean front. |
| `<traditional title>` | 寶可夢 噴火龍 PSA 10 |
| `<traditional description>` | 1999 年基本系列，正面無瑕。 |
| `<simplified title>` | 宝可梦 喷火龙 PSA 10 |
| `<simplified description>` | 1999 年基本系列，正面无瑕。 |

**Steps:**

1. Enter `<english description>`, then the Traditional Chinese and the Simplified Chinese titles and descriptions, and select Save.
2. Reload the draft and read each language's title and description.

**Expected Results:**

* Step 1 saves the draft.
* Step 2 shows every title and description as entered, in its own language.

<!-- trace:case id=g10adm.auction-listing.TC-foq rev=1 covers=g10adm.auction-listing.SC-ze7 -->
### g10adm.auction-listing.US75-TC2: English alone is enough to create a listing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_2>`'s editor; it is a draft with every create field and an English title, and no Chinese text.

**Steps:**

1. Select Create.
2. Reload the listing and read each language's title and description.

**Expected Results:**

* Step 1 creates the listing.
* Step 2 shows the English title as entered, and both Chinese titles and descriptions empty.

<!-- trace:case id=g10adm.auction-listing.TC-i3w rev=1 -->
### g10adm.auction-listing.US75-TC3: A translation at its length limits is kept whole

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_1>`'s editor; it is a draft with an English title and no Chinese text.

**Test data:**

| `<language>` | `<title text>` | `<description text>` |
| --- | --- | --- |
| Traditional Chinese | 200 Chinese characters (fixed boundary: the title limit) | 4000 characters (fixed boundary: the description limit) |
| Simplified Chinese | 1 Chinese character (fixed boundary: the lower bound) | 1 character |

**Steps:**

1. Enter `<title text>` and `<description text>` as `<language>`'s title and description, and select Save.
2. Reload and read them.

**Expected Results:**

* Step 1 saves the draft.
* Step 2 shows both texts with every character kept.

<!-- trace:case id=g10adm.auction-listing.TC-56j rev=1 -->
### g10adm.auction-listing.US75-TC4: A translation past its length limit is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_1>`'s editor; it is a draft with an English title and no Chinese text.

**Test data:**

| `<field>` | `<text>` |
| --- | --- |
| Traditional Chinese title | 201 Chinese characters (fixed boundary: one over 200) |
| Simplified Chinese title | 200 Chinese characters and 1 space (fixed boundary: counted as typed, 201) |
| Traditional Chinese description | 4001 characters (fixed boundary: one over 4000) |
| Simplified Chinese description | 3999 characters and 2 spaces (fixed boundary: counted as typed, 4001) |

**Steps:**

1. Enter `<text>` in `<field>` and select Save.
2. Reload and read `<field>`.

**Expected Results:**

* Step 1 refuses the save and names `<field>`.
* Step 2 shows `<field>` empty.

<!-- trace:case id=g10adm.auction-listing.TC-hhy rev=1 covers=g10adm.auction-listing.SC-i3e -->
### g10adm.auction-listing.US75-TC5: A blank translation counts as not written

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_3>`'s editor; it is a draft with English and Traditional Chinese titles and descriptions written.

**Test data:**

| `<field>` | `<input>` |
| --- | --- |
| Traditional Chinese title | cleared to empty |
| Traditional Chinese title | 3 spaces |
| Traditional Chinese description | 3 spaces |

**Steps:**

1. Set `<field>` to `<input>` and select Save.
2. Reload, open the Copy block and choose Traditional Chinese.

**Expected Results:**

* Step 1 saves the draft.
* Step 2 shows the English text for `<field>`, marked as the fallback, and the other Traditional Chinese text as written, unmarked.

<!-- trace:case id=g10adm.auction-listing.TC-kvr rev=1 -->
### g10adm.auction-listing.US75-TC6: A translated title is trimmed on save

**Classification:**

* **Severity:** trivial
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_1>`'s editor; it is a draft with an English title and no Traditional Chinese text.

**Test data:**

| Field | Value |
| --- | --- |
| `<padded title>` | 2 spaces, 寶可夢 噴火龍 PSA 10, 2 spaces |

**Steps:**

1. Enter `<padded title>` as the Traditional Chinese title and select Save.
2. Reload and read the Traditional Chinese title.

**Expected Results:**

* Step 2 reads 寶可夢 噴火龍 PSA 10, with no leading or trailing spaces.

<!-- trace:case id=g10adm.auction-listing.TC-adp rev=1 -->
### g10adm.auction-listing.US75-TC7: A translation can be edited while the listing is draft, created or published

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_4>`'s editor; it is `<status>` and holds a Traditional Chinese title.

**Test data:**

| `<status>` |
| --- |
| Draft |
| Created |
| Published |

| Field | Value |
| --- | --- |
| `<new title>` | 寶可夢 噴火龍 初版 PSA 10 (any text under the 200 limit) |

**Steps:**

1. Replace the Traditional Chinese title with `<new title>` and select Save.
2. Reload and read the title and status.

**Expected Results:**

* Step 1 saves.
* Step 2 reads `<new title>` and `<status>`.

<!-- trace:case id=g10adm.auction-listing.TC-49e rev=1 covers=g10adm.auction-listing.SC-55h -->
### g10adm.auction-listing.US75-TC8: Writing a translated title leaves the slug and code alone

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_5>`'s editor; it is a saved draft whose slug is still the one generated from its English title and code.

**Steps:**

1. Note the slug and code, enter 寶可夢 噴火龍 PSA 10 as the Traditional Chinese title and select Save.
2. Reload and read the slug and code, then `<listing_5>`'s row in `<listings url>`.

**Expected Results:**

* Step 2 shows the slug and code unchanged, and the row reads the English title.

<!-- trace:case id=g10adm.auction-listing.TC-le3 rev=1 covers=g10adm.auction-listing.SC-kzb -->
### g10adm.auction-listing.US75-TC9: A closed, settled or called-off listing offers no text controls

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_6>`'s editor; it is `<status>` and holds a Traditional Chinese title.

**Test data:**

| `<status>` |
| --- |
| Closed |
| Settled |
| Called off |

**Steps:**

1. Look for inputs to edit any title or description.

**Expected Results:**

* No input edits a translation, the English title or the description, and the Traditional Chinese title is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-sp9 rev=1 -->
### g10adm.auction-listing.US75-TC11: An admin who may not edit a listing's texts cannot write translations

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(may view listings but not edit their texts) is on `<listing_4>`'s screen; it is a draft with an English title.

**Steps:**

1. Look for inputs to edit the Chinese titles and descriptions.

**Expected Results:**

* No input edits a translation, and `<listing_4>` holds no Chinese title.

---

## g10adm.auction-listing.US76: Operator reads a listing's texts in each language

**As an** auction operator,
**I want** to switch the listing's Copy block between languages and see which ones I have not written,
**so that** I can check what each collector will read and fill the gaps.

<!-- trace:case id=g10adm.auction-listing.TC-v7h rev=1 covers=g10adm.auction-listing.SC-z8j -->
### g10adm.auction-listing.US76-TC1: The Copy block switches title and description together and opens in English

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-76

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_8>`'s screen; it has all three languages written.

**Steps:**

1. Read the Copy block's title and description.
2. Choose Traditional Chinese, then Simplified Chinese, reading the title and description each time.
3. Reload the listing and read the Copy block's language.

**Expected Results:**

* Steps 1 and 2 show each language's title and description together, with no fallback mark.
* Step 3 shows the Copy block in English.

<!-- trace:case id=g10adm.auction-listing.TC-x3s rev=1 covers=g10adm.auction-listing.SC-jiz -->
### g10adm.auction-listing.US76-TC2: A language missing one text marks only that text as the fallback

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-76

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_9>`'s screen; it has a Traditional Chinese title and no Traditional Chinese description.

**Steps:**

1. Choose Traditional Chinese in the Copy block and read the title and description.

**Expected Results:**

* The title reads 寶可夢 噴火龍 PSA 10, unmarked, and the description reads the English, marked as the fallback.

<!-- trace:case id=g10adm.auction-listing.TC-7oa rev=1 -->
### g10adm.auction-listing.US76-TC3: A listing with no translations reads English, marked, in each Chinese choice

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-76

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_10>`'s screen; it has an English title and description only.

**Steps:**

1. Choose Traditional Chinese, then Simplified Chinese, then English, reading the title and description each time.

**Expected Results:**

* Both Chinese choices show the English title and description, marked as the fallback.
* English shows them unmarked.

<!-- trace:case id=g10adm.auction-listing.TC-tnk rev=1 covers=g10adm.auction-listing.SC-let -->
### g10adm.auction-listing.US76-TC4: Traditional Chinese is never the Simplified Chinese fallback

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-76

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing_9>`'s screen; it has Traditional Chinese text and no Simplified Chinese text.

**Steps:**

1. Choose Simplified Chinese in the Copy block and read the title and description.

**Expected Results:**

* Both read the English, marked as the fallback, with no Traditional Chinese character.

---

## g10adm.auction-listing.US77: Operator finds a listing by a translated title

**As an** auction operator,
**I want** the Listings search to match a title in any language,
**so that** I find the lot from whichever name a collector or colleague quotes.

<!-- trace:case id=g10adm.auction-listing.TC-lnj rev=1 covers=g10adm.auction-listing.SC-6es,g10adm.auction-listing.SC-orh,g10adm.auction-listing.SC-1x3,g10adm.auction-listing.SC-d0k -->
### g10adm.auction-listing.US77-TC1: The Listings search finds a listing by part of its title in any language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`.
* `<listing_11>` is titled Charizard PSA 10, 寶可夢 Pokémon TCG 噴火龍 and 宝可梦 喷火龙, and no other listing's title holds `<fragment>`.

**Test data:**

| `<fragment>` |
| --- |
| harizar (part of the English title) |
| 噴火 (part of the Traditional Chinese title) |
| 喷火 (part of the Simplified Chinese title) |
| pokémon tcg (Latin letters in a translated title, in another case) |

**Steps:**

1. Type `<fragment>` in the Listings search and read the rows.

**Expected Results:**

* `<listing_11>` is listed once, under its English title.

<!-- trace:case id=g10adm.auction-listing.TC-rxg rev=1 -->
### g10adm.auction-listing.US77-TC2: A listing matching in two languages is listed once

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; `<listing_12>` is titled Charizard Holo and Charizard 噴火龍.

**Steps:**

1. Type Charizard in the Listings search and read the rows.

**Expected Results:**

* `<listing_12>` is listed exactly once.

<!-- trace:case id=g10adm.auction-listing.TC-zkm rev=1 covers=g10adm.auction-listing.SC-4uh -->
### g10adm.auction-listing.US77-TC3: The search does not fold Traditional and Simplified Chinese

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; `<listing_13>` has a Traditional Chinese title holding 噴火龍 and no Simplified Chinese title.

**Steps:**

1. Type 喷火龙 in the Listings search and read the rows.
2. Type 噴火龍 and read the rows.

**Expected Results:**

* Step 1 does not list `<listing_13>`; step 2 does.

<!-- trace:case id=g10adm.auction-listing.TC-a79 rev=1 covers=g10adm.auction-listing.SC-46l -->
### g10adm.auction-listing.US77-TC4: The search matches titles, not descriptions

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; `<listing_14>`'s Traditional Chinese description holds 正面無瑕, and none of its titles do.

**Steps:**

1. Type 正面無瑕 in the Listings search and read the rows.

**Expected Results:**

* `<listing_14>` is not listed.

<!-- trace:case id=g10adm.auction-listing.TC-mob rev=1 -->
### g10adm.auction-listing.US77-TC5: Editing or clearing a translated title moves what the search finds

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(holds auction:operate) is on `<listings url>`; `<listing_15>`'s Traditional Chinese title holds 噴火龍.

**Steps:**

1. Replace `<listing_15>`'s Traditional Chinese title with 水箭龜 初版 and select Save.
2. Search for 噴火龍, then 水箭龜, reading the rows each time.
3. Clear the Traditional Chinese title, save, and search for 水箭龜.

**Expected Results:**

* Step 2 does not list `<listing_15>` for 噴火龍, and lists it for 水箭龜.
* Step 3 does not list it.

## Settled

- Choosing source media uses the existing listing-edit authority; a request without it is refused.
- A refused Relist Save names its reason inline, such as Already relisted.
- Once a draft is saved from its Relist, the listing offers no second Relist, even if that draft is called off.
- Transfer activity names the other listing by its code and English title when present, else its id, and always the slug that moved.
- Clearing the prefilled Relist slug before Save stores the ordinary title-and-code slug and still frees the source's former slug.
- After Relist Save, the Unsold source shows Relisted beside Unsold on its detail header and in the Listings Status column.
- A starting price an operator saves, creates or updates is a whole-dollar amount; one with cents is refused, naming the rule, and the listing is unchanged. A price already stored with cents is left as it is.
