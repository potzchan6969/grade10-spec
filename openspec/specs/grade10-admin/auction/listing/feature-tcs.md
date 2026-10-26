# grade10-admin/auction/listing Test Cases

**Status:** pending-review · 0/61
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
   - The editor shows `<shared slug>` filled in. `g10adm.auction-listing.US9-TC3`
2. Save the Relist draft without changing the slug.
   - The new draft holds `<shared slug>` and a listing code other than `<source code>`. `g10adm.auction-listing.US9-TC12`
   - Both listings' activity name the transfer of `<shared slug>` and the other listing. `g10adm.auction-listing.US9-TC12`
3. As customer A, open `<g10url>/auction/listings/<shared slug>` while the successor is a draft.
   - Page not found shows. `g10adm.auction-listing.US4-TC21`
4. Create the successor, select Publish now, and as customer A open the address again.
   - The page shows the published successor, not `<unsold source>`. `g10adm.auction-listing.US4-TC21`

## g10adm.auction-listing.US1: Operator saves an unfinished listing and comes back to it

**As a** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the rest arrives.

<!-- trace:case id=g10adm.auction-listing.TC-mqd rev=1 covers=g10adm.auction-listing.SC-xue,g10adm.auction-listing.SC-vnl,g10adm.auction-listing.SC-r6p,g10adm.auction-listing.SC-2pj,g10adm.auction-listing.SC-bso -->
### g10adm.auction-listing.US1-TC1: A draft saves with whatever is entered, 0 apart from empty, and stays off the catalogue

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
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(holds auction:operate) is on Listings, starting a draft, `<start>`.

**Test data:**

| `<start>` | `<entered>` | `<reads>` |
| --- | --- | --- |
| a new draft | nothing; the prefilled start and close cleared | title, prices and both times empty |
| a new draft | the title 1999 Charizard PSA 9, no starting price | that title, the starting price empty |
| a saved draft with no starting price | a starting price of 0 | USD0, not empty |
| a saved draft starting at USD1,000 | the starting price cleared | an empty starting price, not 0 |

**Steps:**

1. Enter `<entered>` and Save.
2. Reopen the draft from Listings, and open `<g10url>/auction`.

**Expected Results:**

* Step 2 reads a draft with `<reads>`, and the catalogue does not list it.

<!-- trace:case id=g10adm.auction-listing.TC-qk8 rev=3 -->
### g10adm.auction-listing.US1-TC3: A draft refuses a negative price, a price with cents or a malformed slug

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
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(holds auction:operate) is on a saved draft's editor, starting at USD1,000 with slug charizard-psa-9.

**Test data:**

| `<field>` | `<value>` | `<message>` |
| --- | --- | --- |
| starting price | -1 | a refusal |
| starting price | 120.50 | the whole-dollar rule |
| slug | Charizard PSA 9 | the slug's shape |

**Steps:**

1. Enter `<value>` as the `<field>` and Save.
2. Reopen the draft; then enter 120 as the starting price and Save.

**Expected Results:**

* Step 1 is refused, naming `<message>`.
* Step 2 reads USD1,000 and charizard-psa-9, still a draft, and USD120 then saves.

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
### g10adm.auction-listing.US2-TC1: An eighth file stores last, kept exactly as uploaded

**Classification:**

* **Severity:** major
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

* admin(holds auction:operate) is on a draft's Media action; the draft holds seven items.

**Steps:**

1. Upload charizard-back.jpg, a 2.4 MB JPEG.
2. Open the stored original from the gallery and save it.

**Expected Results:**

* Step 1: the gallery holds eight items, charizard-back.jpg last.
* Step 2: the saved original is a JPEG of the same bytes and dimensions.

<!-- trace:case id=g10adm.auction-listing.TC-4p2 rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k -->
### g10adm.auction-listing.US2-TC3: Images and a video show to collectors in the operator's order, the first on the card

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
* **Trace:** grade10-admin-auction-listing-US-02

**Blocked:** Listing spec author - confirm an explicit playback assertion and its interaction; no current statement names the play action or its outcome.

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing>`'s Media action; `<listing>` is `<state>`.

**Test data:**

| `<state>` | `<change>` | `<collector reads>` |
| --- | --- | --- |
| a complete draft with no media | choose charizard-front.jpg, charizard-turn.mp4 and charizard-back.webp in that order, then Create and publish | the three in that order on the page, the MP4 playing |
| published, its gallery reading A, B, C | move C first, then remove B | C, then A, and C on the catalogue card |

**Steps:**

1. Make `<change>`.
2. As a collector, open the listing's page and its catalogue card.

**Expected Results:**

* Step 1 stores the gallery in the order made; step 2 reads `<collector reads>`.

<!-- trace:case id=g10adm.auction-listing.TC-kmw rev=1 covers=g10adm.auction-listing.SC-slk,g10adm.auction-listing.SC-51l,g10adm.auction-listing.SC-md4,g10adm.auction-listing.SC-v8v,g10adm.auction-listing.SC-qna,g10adm.auction-listing.SC-vg4,g10adm.auction-listing.SC-h2e,g10adm.auction-listing.SC-49k,g10adm.auction-listing.SC-x5f,g10adm.auction-listing.SC-89c,g10adm.auction-listing.SC-cps,g10adm.auction-listing.SC-tgj,g10adm.auction-listing.SC-8h3,g10adm.auction-listing.SC-mn8 -->
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
### g10adm.auction-listing.US3-TC2: Create is refused while a required value is missing or not allowed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; the draft has every Create requirement but `<missing>`.

**Test data:**

| `<missing>` |
| --- |
| an English title, saved with the Traditional Chinese title 寶可夢 噴火龍 PSA 10 only |
| a slug |
| a starting price |
| media |
| a close after now |
| a slug of its own: it holds charizard-psa-9, which a closed listing holds |

**Steps:**

1. Select Create.
2. Reload the draft and read its status.

**Expected Results:**

* Step 1 is refused, naming what is missing; an English title is named on the form, sending nothing.
* Step 2 still reads draft, the Chinese title kept.

<!-- trace:case id=g10adm.auction-listing.TC-yte rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
<!-- trace:case id=g10adm.auction-listing.TC-xx5 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
<!-- trace:case id=g10adm.auction-listing.TC-78a rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
<!-- trace:case id=g10adm.auction-listing.TC-vtd rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
### g10adm.auction-listing.US3-TC6: A writable listing refuses an edit outside the rules, and keeps its value

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
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing>`'s editor; `<listing>` is `<state>`.

**Test data:**

| `<state>` | `<edit>` |
| --- | --- |
| created | clear the title and save |
| created, drafted as sandbox | clear Sandbox and save |
| created, closing next week | set the close before now and save |
| a draft opening tomorrow | set Starts at before now and save |
| a draft | pick two categories of one taxonomy, Pokémon and Sport, and save |
| a draft | attach a cancelled campaign and save |
| a draft | set the slug charizard-psa-9, which a live listing holds, and save |
| a draft | set the slug charizard-psa-9, which another draft holds, and save |
| published | select Create, if offered |

**Steps:**

1. Make `<edit>`.
2. Reload and read the field and the status.

**Expected Results:**

* Step 1 is refused, a time field showing its refusal before Save; Create on a published listing is not offered or is refused.
* Step 2 shows the field and the status unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-hdm rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
<!-- trace:case id=g10adm.auction-listing.TC-hr0 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
<!-- trace:case id=g10adm.auction-listing.TC-wcd rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
<!-- trace:case id=g10adm.auction-listing.TC-b59 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
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
<!-- trace:case id=g10adm.auction-listing.TC-8u6 rev=2 -->
### g10adm.auction-listing.US3-TC15: A starting price of 0 or a corrected one is accepted until publish

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

* admin(holds auction:operate) is on `<listing>`'s editor; `<listing>` is `<state>`.

**Test data:**

| `<state>` | `<new price>` | `<action>` |
| --- | --- | --- |
| a draft with every Create requirement but a starting price | 0 | Create |
| created, unpublished, starting at USD10,000 | USD1,500 | Save |
| created, unpublished, starting at USD10,000 | 0 | Save |

**Steps:**

1. Enter `<new price>` and read the field; select `<action>`.
2. Reopen and read the starting price and status.

**Expected Results:**

* Step 1 reads the amount in USD with no error, and is accepted.
* Step 2 reads `<new price>` and created.

<!-- trace:case id=g10adm.auction-listing.TC-4sr rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
<!-- trace:case id=g10adm.auction-listing.TC-o5r rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
<!-- trace:case id=g10adm.auction-listing.TC-3s0 rev=1 covers=g10adm.auction-listing.SC-mmr,g10adm.auction-listing.SC-jr4,g10adm.auction-listing.SC-9v7,g10adm.auction-listing.SC-gm3,g10adm.auction-listing.SC-neb,g10adm.auction-listing.SC-jne,g10adm.auction-listing.SC-86p,g10adm.auction-listing.SC-9fl,g10adm.auction-listing.SC-23q,g10adm.auction-listing.SC-ng3,g10adm.auction-listing.SC-g0h,g10adm.auction-listing.SC-hp2,g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-4kw,g10adm.auction-listing.SC-rj8,g10adm.auction-listing.SC-yly,g10adm.auction-listing.SC-zr3,g10adm.auction-listing.SC-bvf,g10adm.auction-listing.SC-ynn,g10adm.auction-listing.SC-8on -->
---

## g10adm.auction-listing.US4: Operator puts a listing in front of collectors

**As an** auction operator,
**I want** to publish a listing now or at a time I set in advance,
**so that** a lot opens at the hour the sale was announced for and reads at its own public address from then on.

<!-- trace:case id=g10adm.auction-listing.TC-amk rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC1: A created listing publishes now or at its time, and collectors find it at its address

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
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing>`'s editor; `<listing>` is created, unpublished, slug charizard-psa-9, `<setup>`.

**Test data:**

| `<setup>` | `<publish>` |
| --- | --- |
| with no publish time | select Publish now |
| starting at USD0, with no publish time | select Publish now |
| with a publish time 5 minutes ahead | nothing; let the time pass |

**Steps:**

1. `<publish>`.
2. Read its status on Listings, open `<g10url>/auction`, and open `<g10url>/auction/listings/charizard-psa-9`.

**Expected Results:**

* Step 1 raises no starting-price refusal.
* Step 2 reads published, the catalogue lists it, and its address opens it.

<!-- trace:case id=g10adm.auction-listing.TC-cp1 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
<!-- trace:case id=g10adm.auction-listing.TC-4ju rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
<!-- trace:case id=g10adm.auction-listing.TC-h6l rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
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
### g10adm.auction-listing.US4-TC6: A published listing refuses a new slug, starting price or publish time

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

* admin(holds auction:operate) is on a published listing's editor; it holds charizard-psa-9 and starts at USD1,000.

**Test data:**

| `<edit>` |
| --- |
| the slug charizard-psa-9-copy |
| the starting price USD1,500 |
| the starting price USD0 |
| a new publish time |

**Steps:**

1. Set `<edit>` and save.
2. Reopen it, and open `<g10url>/auction/listings/charizard-psa-9`.

**Expected Results:**

* Step 1 is refused; step 2 still reads published at USD1,000, and the address still opens it.

<!-- trace:case id=g10adm.auction-listing.TC-ofm rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
<!-- trace:case id=g10adm.auction-listing.TC-8yj rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC8: A publish time before now or after the start is refused

Runs once per row of **Test data**.

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

* admin(holds auction:operate) is on `<listing>`'s editor; `<listing>` is `<state>`, opening at 2030-01-10 10:00.

**Test data:**

| `<state>` | `<publish at>` | `<action>` |
| --- | --- | --- |
| created, with no publish time | a time before now | Save |
| a draft with every other Create requirement | a time before now | Create |
| created, with no publish time | 2030-01-10 11:00, after the start | Save |

**Steps:**

1. Set Publish at to `<publish at>` and select `<action>`.
2. Reopen it and read the status and publish time; open `<g10url>/auction`.

**Expected Results:**

* Step 1 is refused, a refusal showing under Publish at before Save.
* Step 2 reads the earlier status with no new publish time, and the catalogue does not list it.

<!-- trace:case id=g10adm.auction-listing.TC-bjv rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
<!-- trace:case id=g10adm.auction-listing.TC-qpo rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### g10adm.auction-listing.US4-TC10: A draft never publishes, by its time or by hand

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
* **Trace:** grade10-admin-auction-listing-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* `<draft>`.

**Test data:**

| `<draft>` | `<try>` |
| --- | --- |
| a draft with no title, its publish time just arrived | wait |
| a saved draft, admin(holds auction:operate) on its editor | select Publish, if offered |

**Steps:**

1. `<try>`, then read its status on Listings and open `<g10url>/auction`.

**Expected Results:**

* Publish is not offered or is refused; it still reads draft, off the catalogue.

<!-- trace:case id=g10adm.auction-listing.TC-6j1 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
<!-- trace:case id=g10adm.auction-listing.TC-hji rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
<!-- trace:case id=g10adm.auction-listing.TC-i4e rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
<!-- trace:case id=g10adm.auction-listing.TC-0q9 rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-fcs,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
<!-- trace:case id=g10adm.auction-listing.TC-dcp rev=1 covers=g10adm.auction-listing.SC-i7s -->
### g10adm.auction-listing.US4-TC18: Publish now asks first only when it would drop a scheduled time

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
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on Listings; a created listing has `<setup>`.

**Test data:**

| `<setup>` | `<asks>` |
| --- | --- |
| a publish time ahead | a confirmation naming the scheduled time and saying publishing now removes it |
| no publish time, its start passed and its close ahead | nothing |

**Steps:**

1. Select the listing and Publish, confirming if asked.
2. Read the status and publish time.

**Expected Results:**

* Step 1 shows `<asks>`; step 2 reads published, with no publish time.

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
### g10adm.auction-listing.US4-TC21: A shared address shows Page not found between a Relist's Save and its publish, then opens the successor

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
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**

* `<unsold source>` closed Unsold in no campaign, its stock released, holding `<shared slug>` and `<source code>`; a Relist Save from it stored `<successor>` with `<shared slug>`, now `<state>`; customer A is on `<g10url>` in another session.

**Test data:**

| `<state>` | `<address opens>` |
| --- | --- |
| a draft, unpublished | Page not found |
| created, unpublished | Page not found |
| published | `<successor>`, with no redirect |

**Steps:**

1. As customer A, open `<g10url>/auction/listings/<shared slug>`.
2. As admin, read `<unsold source>`'s status, code and slug.

**Expected Results:**

* Step 1 shows `<address opens>`, never anything of `<unsold source>`.
* Step 2 reads closed Unsold under `<source code>`, without `<shared slug>`.

<!-- trace:case id=g10adm.auction-listing.TC-pcd rev=1 covers=g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-fcs,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
---

## g10adm.auction-listing.US5: Operator calls a listing off before it closes

**As an** auction operator,
**I want** to withdraw a lot at any point up to its close,
**so that** a consignor who pulls out or a card that fails authentication leaves the sale cleanly.

<!-- trace:case id=g10adm.auction-listing.TC-k37 rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC1: A listing is called off from draft, scheduled or published, charging nobody and releasing its stock

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
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing>`'s editor; `<listing>` is `<state>`.

**Test data:**

| `<state>` |
| --- |
| a saved draft with no slug |
| created, its publish time 5 minutes ahead |
| published, customer A leading over customer B, its stock held |

**Steps:**

1. Call `<listing>` off.
2. Let any publish time pass; read its status and slug, and open `<g10url>/auction`.
3. For the published row, as customer A and customer B read My Auctions and their cards, and read the product's stock in Inventory.

**Expected Results:**

* Step 2 reads cancelled, never published, with no slug invented, off the catalogue.
* Step 3: both rows say the card was not charged, neither card shows a charge, and the held stock is released.

<!-- trace:case id=g10adm.auction-listing.TC-32t rev=1 covers=g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### g10adm.auction-listing.US5-TC4: A closed, settled or cancelled listing cannot be called off or edited

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
* **Trace:** grade10-admin-auction-listing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a `<state>` listing's editor.

**Test data:**

| `<state>` | `<try>` |
| --- | --- |
| closed | call it off, if offered |
| settled | call it off, if offered |
| cancelled | call it off again, if offered |
| closed | change the title and save |
| closed | upload charizard-front.jpg on its Media action |

**Steps:**

1. `<try>`.
2. Reload and read the status, the title and the gallery.

**Expected Results:**

* Step 1 is not offered or is refused; step 2 reads them unchanged.

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

---

## g10adm.auction-listing.US6: Operator creates and publishes a listing with no campaign

**As an** auction operator,
**I want** to start a listing from the Listings section without picking a
campaign,
**so that** a one-off lot can go live without inventing a cover I do not need.

<!-- trace:case id=g10adm.auction-listing.TC-fxz rev=1 covers=g10adm.auction-listing.SC-yhm,g10adm.auction-listing.SC-s6o,g10adm.auction-listing.SC-44k,g10adm.auction-listing.SC-toy,g10adm.auction-listing.SC-8pr,g10adm.auction-listing.SC-5oo,g10adm.auction-listing.SC-ssk,g10adm.auction-listing.SC-2ir -->
### g10adm.auction-listing.US6-TC3: A listing with no campaign is drafted, created, published and found by its slug

**Classification:**

* **Severity:** critical
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

* admin(holds auction:operate) is on Listings.

**Steps:**

1. Select Create listing from the heading row, read the Campaign control, fill every Create field with slug standalone-lot-1 and no publish time, and Save.
2. Read the row's Campaign column; select Create, then Publish now.
3. Open `<g10url>/auction/listings/standalone-lot-1`.

**Expected Results:**

* Step 1: the editor opens with no campaign, and saves a draft with none, off the catalogue.
* Step 2: the Campaign column reads "-", never a bare id; the listing reads created, then published, still with no campaign.
* Step 3 shows the listing.

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
### g10adm.auction-listing.US8-TC1: Stats counts a listing's watchers across both brands, and only Stats shows them

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
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

* admin(holds auction:operate) is on Listings; `<listing>` is `<state>`, watched by `<grade10>` Grade10 and `<zzz>` ZZZ collectors.

**Test data:**

| `<state>` | `<grade10>` | `<zzz>` | `<reads>` |
| --- | --- | --- | --- |
| published | 2 | 1 | 3 |
| published | 0 | 0 | 0, not blank or "-" |
| closed | 2 | 0 | 2 |

**Steps:**

1. Read the Listings table's headings, then open `<listing>`'s Stats.

**Expected Results:**

* No column reads Watchers; Stats reads `<reads>` watchers and names no watcher.

---

## g10adm.auction-listing.US9: Operator lists an unsold lot again

**As an** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing that keeps the lot's public address,
**so that** a card nobody bought goes back on sale without me hunting for its stock, and a shared link still opens the live lot.

<!-- trace:case id=g10adm.auction-listing.TC-tjt rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC1: An Unsold close releases its stock once, with no operator step, earlier holds included

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

* admin(holds auction:operate) is on Listings; `<listing>` is in no campaign, holding 3 units of `<product>`, which has 2 more available; `<case>`.

**Test data:**

| `<case>` | `<release on>` |
| --- | --- |
| it closes in a few minutes with no bids | the close |
| it closes in a few minutes with bids, none leading at the close | the close |
| it closed Unsold before Unsold closes released stock, still holding them, and the one-time clean-up runs, twice | the first clean-up only |
| it closes with no bids while the inventory release fails, until the tester lets it through | the successful retry |

**Steps:**

1. Let `<case>` play out, taking no action.
2. Read `<listing>`'s row, its status and stock note, and `<product>`'s available count.

**Expected Results:**

* Until the release, the row reads Unsold with no Relist and no released note, and 2 are available.
* After `<release on>`, the note says the stock was released on that date, 5 are available, never more, and the row offers Relist.

<!-- trace:case id=g10adm.auction-listing.TC-juv rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC2: Relist is offered only on a released Unsold listing outside a campaign, to an operator

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

* `<listing>` is `<state>`; `<operator>` is on Listings.

**Test data:**

| `<state>` | `<operator>` | `<row reads>` |
| --- | --- | --- |
| closed with a winner, its sale recorded | admin(holds auction:operate) | its status, no released note |
| published, its close ahead | admin(holds auction:operate) | its status, no released note |
| closed Unsold in a campaign, released | admin(holds auction:operate) | Unsold |
| called off before its close, released | admin(holds auction:operate) | Cancelled |
| closed Unsold in no campaign, released | admin(reads listings, without auction:operate) | Unsold |

**Steps:**

1. Read `<listing>`'s row, then open it and read its actions.

**Expected Results:**

* The row reads `<row reads>`; neither the row nor the listing offers Relist, not even disabled.

<!-- trace:case id=g10adm.auction-listing.TC-xzh rev=4 -->
### g10adm.auction-listing.US9-TC3: Relist opens a filled draft, every language and the slug included, that holds stock only on Save

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

* `<source>` closed Unsold in no campaign, released, never relisted: No Cert ID, quantity 2, starting at USD80, three gallery items, slug charizard-psa-10, a category, Sandbox on, a history, and `<texts>`; its product has 5 available; admin(holds auction:operate) is on Listings.

**Test data:**

| `<texts>` |
| --- |
| English, Traditional and Simplified Chinese titles and descriptions |
| English and Traditional Chinese only |

**Steps:**

1. Select Relist, read the draft, and leave without saving; select Relist again.
2. Read the draft rows and the available count.
3. Set a start and a close and Save; read the count and the saved draft; read `<source>`.

**Expected Results:**

* Step 1 opens a new draft each time: the product, No Cert ID, quantity 2, `<source>`'s texts in each written language and empties where none, USD80, the gallery in order, slug charizard-psa-10, and no window, bids or history.
* Step 2: no new draft row, and 5 available.
* Step 3 saves; 3 are available; the draft has no campaign, no category and Sandbox off; `<source>` keeps its history, reads Unsold, Relisted, and offers no Relist.

<!-- trace:case id=g10adm.auction-listing.TC-bf8 rev=2 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
<!-- trace:case id=g10adm.auction-listing.TC-hh5 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
<!-- trace:case id=g10adm.auction-listing.TC-et4 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
<!-- trace:case id=g10adm.auction-listing.TC-r14 rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
<!-- trace:case id=g10adm.auction-listing.TC-smc rev=1 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
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

<!-- trace:case id=g10adm.auction-listing.TC-rlt rev=1 covers=g10adm.auction-listing.SC-ace,g10adm.auction-listing.SC-eaf,g10adm.auction-listing.SC-c83 -->
### g10adm.auction-listing.US9-TC12: Relist Save moves or frees the source's slug, with a code of its own, recorded on both

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
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<source>` closed Unsold in no campaign, released, never relisted, holding charizard-psa-10, code `<source code>` and English title Charizard PSA 10; admin(holds auction:operate) is on Listings.

**Test data:**

| `<slug on save>` | `<draft slug>` |
| --- | --- |
| unchanged | charizard-psa-10 |
| charizard-psa-10-relisted | charizard-psa-10-relisted |
| cleared | built from the title and the draft's own code |

**Steps:**

1. Select Relist, set the slug `<slug on save>`, and Save.
2. Read the draft's slug, code and activity, and `<source>`'s slug and activity.
3. Open another draft, enter charizard-psa-10, and leave the field.

**Expected Results:**

* Step 2: the draft holds `<draft slug>` and a code other than `<source code>`; `<source>` holds no slug; each activity names charizard-psa-10 and the other listing by code and English title.
* Step 3 shows no unavailable-slug error unless the draft kept charizard-psa-10.

---

## g10adm.auction-listing.US11: Operator starts a Cert-specific listing with its usual media

**As an** Auction operator,
**I want** selecting a product and Cert ID to show product-level media and
media tagged to that Cert first,
**so that** I can build the listing gallery from the source most likely to
document the unit I selected.

<!-- trace:case id=g10adm.auction-listing.TC-hhu rev=1 covers=g10adm.auction-listing.SC-vhc,g10adm.auction-listing.SC-lvn -->
### g10adm.auction-listing.US11-TC1: A Cert listing's selector offers shared media and that Cert's only, never another Cert's or product's

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-11

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; `<product>` has untagged media, media tagged to `<selected cert>` and to `<other cert>`; `<other product>` has its own media.

**Steps:**

1. Select `<product>` and `<selected cert>`, and open the main source selector, then the Other Cert media drawer.

**Expected Results:**

* The selector offers the untagged and `<selected cert>`'s media, not `<other cert>`'s; neither offers `<other product>`'s.

---

## g10adm.auction-listing.US12: Operator deliberately uses another Cert's media

**As an** Auction operator,
**I want** another Cert's media separated into a labelled drawer and named
before I add it,
**so that** I can make an intentional exception without mistaking it for the
selected unit's normal media.

<!-- trace:case id=g10adm.auction-listing.TC-hhx rev=1 covers=g10adm.auction-listing.SC-xyf,g10adm.auction-listing.SC-01q,g10adm.auction-listing.SC-emr -->
### g10adm.auction-listing.US12-TC1: The Other Cert drawer groups other Certs' media by Cert ID, and adding one names its Cert

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

* admin(holds auction:operate) is on a draft's editor with `<product>` and `<selected cert>` selected; media is tagged to `<other cert a>` and `<other cert b>`.

**Steps:**

1. Open the Other Cert media drawer.
2. Choose an image under `<other cert a>` and select Add to listing.

**Expected Results:**

* Step 1 groups `<other cert a>`'s and `<other cert b>`'s media under their Cert IDs, with no untagged media and none of `<selected cert>`'s.
* Step 2 adds it to the gallery, the action naming `<other cert a>`.

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
### g10adm.auction-listing.US14-TC1: A saved source item becomes the listing's own copy, its alt text and place editable there

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

* admin(holds auction:operate) is on a draft's editor with a product and Cert ID selected; `<source media>` in the selector has alt text Charizard PSA 9, front; the gallery holds `<other item>`.

**Steps:**

1. Add `<source media>` before `<other item>` and Save.
2. Change the copy's alt text to Charizard PSA 9, front, listing copy, move it after `<other item>`, and Save.

**Expected Results:**

* Step 1 shows a copy of the image with Charizard PSA 9, front.
* Step 2 shows the new alt text, after `<other item>`.

<!-- trace:case id=g10adm.auction-listing.TC-mop rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC3: Later changes to the source leave the listing's copy as it was

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
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds Inventory media-management and auction:operate) has the product's media manager and a saved listing open; the listing holds a copy of `<source media>`, tagged to `<source cert>`, alt text Charizard PSA 9, front, before its other item.

**Test data:**

| `<change in Inventory>` |
| --- |
| replace the image with charizard-front-retake.jpg, set the alt text to Charizard PSA 9, front, retaken, and move it after another item |
| retag it to another Cert ID of the product |
| untag it |

**Steps:**

1. Make `<change in Inventory>`.
2. Open the listing's gallery.

**Expected Results:**

* It keeps the original image and alt text, in its place.

<!-- trace:case id=g10adm.auction-listing.TC-h87 rev=1 covers=g10adm.auction-listing.SC-hqh,g10adm.auction-listing.SC-cyr,g10adm.auction-listing.SC-eys,g10adm.auction-listing.SC-2vy,g10adm.auction-listing.SC-38a,g10adm.auction-listing.SC-79q,g10adm.auction-listing.SC-p6h,g10adm.auction-listing.SC-z0t,g10adm.auction-listing.SC-fbm,g10adm.auction-listing.SC-vmr -->
### g10adm.auction-listing.US14-TC7: A source item can be the eighth gallery item, never the ninth

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
* **Trace:** grade10-admin-auction-listing-US-14

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor; its gallery holds `<held>` items; `<source media>` is in the selector, not in the gallery.

**Test data:**

| `<held>` | `<after save>` |
| --- | --- |
| 7 | eight items, `<source media>` among them |
| 8 | eight items, without `<source media>`, the add refused |

**Steps:**

1. Add `<source media>` from the selector, and Save.

**Expected Results:**

* The gallery holds `<after save>`.

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
### g10adm.auction-listing.US72-TC1: Each listing gets its own five-character code at its first Save, shown alike everywhere

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

* admin(holds auction:operate) is on Listings.

**Steps:**

1. Save two new drafts, and read each code on its screen.
2. Fill every Create field on both and select Create; read each code on its screen and its row.

**Expected Results:**

* Step 1: each draft shows a code of two letters from ABCDEFGHJKMNPQRSTVWXYZ, then three from 0123456789ABCDEFGHJKMNPQRSTVWXYZ, the two different.
* Step 2 shows the same codes on the screens and rows, with no further step.

<!-- trace:case id=g10adm.auction-listing.TC-8gd rev=1 covers=g10adm.auction-listing.SC-cza,g10adm.auction-listing.SC-xrt,g10adm.auction-listing.SC-7j9,g10adm.auction-listing.SC-xa1,g10adm.auction-listing.SC-hby,g10adm.auction-listing.SC-6yj,g10adm.auction-listing.SC-phl,g10adm.auction-listing.SC-rax -->
### g10adm.auction-listing.US72-TC5: A listing keeps its code when it closes or is called off, its address reused or not

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

* A listing created with `<code>` is now `<state>`; admin(holds auction:operate) is on Listings.

**Test data:**

| `<state>` |
| --- |
| closed |
| called off before its close |
| called off, its slug since saved and created on another draft, which shows a code of its own |

**Steps:**

1. Open the listing and read its status and code.

**Expected Results:**

* It reads its status under `<code>`.

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

---

## g10adm.auction-listing.US73: Operator keeps a usable listing address while drafting

**As an** auction operator,
**I want** a saved draft to suggest a listing slug from its title and stable code,
**so that** I can start with a distinct public address and learn before Save when a chosen address is already reserved.

<!-- trace:case id=g10adm.auction-listing.TC-agw rev=1 covers=g10adm.auction-listing.SC-w4n,g10adm.auction-listing.SC-hi0,g10adm.auction-listing.SC-7ew,g10adm.auction-listing.SC-jow,g10adm.auction-listing.SC-96t,g10adm.auction-listing.SC-tb7 -->
### g10adm.auction-listing.US73-TC1: A saved draft takes a slug of its title and code, which follows the title until the operator replaces it

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
* **Trace:** grade10-admin-auction-listing-US-73

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds auction:operate) is on a draft, `<start>`.

**Test data:**

| `<start>` | `<then>` | `<slug reads>` |
| --- | --- | --- |
| unsaved, titled Charizard PSA 10 | Save | charizard-psa-10- and the lower-case code, at most 64 characters |
| unsaved, with no title | Save | lot- and the lower-case code |
| saved, its slug still generated | change the title to Charizard PSA 9 and Save | charizard-psa-9- and the same code |
| saved, its slug replaced with charizard-shadowless | change the title and Save | charizard-shadowless |
| saved, its slug still generated | enter the Traditional Chinese title 寶可夢 噴火龍 PSA 10 and Save | unchanged, and the row reads the English title |

**Steps:**

1. `<then>`, and read the Slug field.

**Expected Results:**

* It reads `<slug reads>`.

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
### g10adm.auction-listing.US73-TC8: A Relist draft may keep its source's address, and no one else may take it while the draft holds it

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

* `<source>` closed Unsold in no campaign, released, never relisted, holding umbreon-v-alt; `<other unsold>` holds umbreon-v-x; `<other draft>` has no slug; admin(holds auction:operate) is on Listings.

**Steps:**

1. Select Relist on `<source>`, leave the Slug field showing umbreon-v-alt, and leave without saving.
2. Select Relist again, enter umbreon-v-x, leave the field and Save.
3. Set umbreon-v-alt back and Save; on `<other draft>`, set umbreon-v-alt and Save.
4. On the Relist draft, set umbreon-v-alt-relisted and Save; on `<other draft>`, set umbreon-v-alt and Save; open `<source>`.

**Expected Results:**

* Step 1 reports umbreon-v-alt available; `<source>` still holds it.
* Step 2 reports a collision and refuses the Save.
* Step 3 saves the Relist draft, then refuses `<other draft>`.
* Step 4 saves both; `<source>` holds no slug.

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
### g10adm.auction-listing.US75-TC1: Each language's title and description is written, trimmed, and read back; English alone is enough to create

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
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(holds auction:operate) is on a draft's editor with every Create field and the English title Charizard PSA 10.

**Test data:**

| `<written>` | `<reads back>` |
| --- | --- |
| the English description 1999 Base Set, clean front., and the Traditional and Simplified Chinese titles and descriptions | each as entered, in its own language |
| nothing more | the English title; both Chinese titles and descriptions empty |
| the Traditional Chinese title with two spaces either side | 寶可夢 噴火龍 PSA 10, with no spaces either side |
| a Traditional Chinese title of 3 spaces | empty, the English shown as the fallback in the Copy block |

**Steps:**

1. Enter `<written>` and Save; select Create.
2. Reload and read each language.

**Expected Results:**

* Step 1 saves and creates; step 2 reads `<reads back>`.

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

<!-- trace:case id=g10adm.auction-listing.TC-le3 rev=1 covers=g10adm.auction-listing.SC-kzb -->
### g10adm.auction-listing.US75-TC9: No one writes a listing's texts once it has closed, or without the grant

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

* `<operator>` is on `<listing>`'s screen; it is `<status>` and holds a Traditional Chinese title.

**Test data:**

| `<operator>` | `<status>` |
| --- | --- |
| admin(holds auction:operate) | closed |
| admin(holds auction:operate) | settled |
| admin(holds auction:operate) | called off |
| admin(may view listings but not edit their texts) | a draft |

**Steps:**

1. Look for inputs to edit any title or description.

**Expected Results:**

* None edits a translation, the English title or a description; the texts are unchanged.

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
### g10adm.auction-listing.US76-TC2: A language missing a text shows the English for that text, marked, never the other Chinese

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
* **Trace:** grade10-admin-auction-listing-US-76

**Pre-conditions:**

* admin(holds auction:operate) is on `<listing>`'s screen; it holds `<written>`.

**Test data:**

| `<written>` | `<choice>` | `<reads>` |
| --- | --- | --- |
| a Traditional Chinese title and no Traditional Chinese description | Traditional Chinese | 寶可夢 噴火龍 PSA 10 unmarked; the English description marked |
| English only | Traditional Chinese, then Simplified Chinese | the English title and description, marked, each time |
| Traditional Chinese texts and no Simplified Chinese | Simplified Chinese | the English, marked, with no Traditional Chinese character |

**Steps:**

1. Choose `<choice>` in the Copy block and read the title and description.

**Expected Results:**

* They read `<reads>`; English shows unmarked.

---

## g10adm.auction-listing.US77: Operator finds a listing by a translated title

**As an** auction operator,
**I want** the Listings search to match a title in any language,
**so that** I find the lot from whichever name a collector or colleague quotes.

<!-- trace:case id=g10adm.auction-listing.TC-lnj rev=1 covers=g10adm.auction-listing.SC-6es,g10adm.auction-listing.SC-orh,g10adm.auction-listing.SC-1x3,g10adm.auction-listing.SC-d0k -->
### g10adm.auction-listing.US77-TC1: The Listings search finds a listing once by part of any language's title, and nothing else

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

* admin(holds auction:operate) is on Listings; `<listing>` is titled Charizard PSA 10, 寶可夢 Pokémon TCG 噴火龍 and 宝可梦 喷火龙, its Traditional Chinese description holding 正面無瑕; `<other>` is titled Charizard Holo and Charizard 噴火龍; `<third>` has only a Traditional Chinese title holding 噴火龍.

**Test data:**

| `<typed>` | `<lists>` |
| --- | --- |
| harizar | `<listing>` and `<other>`, each once |
| 噴火 | all three, each once |
| 喷火 | `<listing>` only |
| pokémon tcg | `<listing>` |
| 正面無瑕 | none |

**Steps:**

1. Type `<typed>` in the Listings search.

**Expected Results:**

* The rows list `<lists>`, each under its English title.

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
