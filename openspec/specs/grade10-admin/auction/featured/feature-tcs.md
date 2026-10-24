# grade10-admin/auction/featured Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<listings url>` is the Auction Listings tab of the Grade10 admin console of the environment under test; Manage Featured opens from its toolbar. `<auction url>` is the Grade10 auction catalogue, whose Featured band leads the page.

## Walk 1: Fill, order and clear the Featured slots

Starting state:

- admin(holds auction:write and auction:operate) is on `<listings url>`.
- No Featured slot holds a lot or an image; no Featured band shows on `<auction url>`.
- `<lot a>` and `<lot c>` are published and Active, `<lot b>` is published and Upcoming, and `<ended lot>` has Ended.

Shared test data:

| Field | Value |
| --- | --- |
| lot a | A published Active listing with a gallery image |
| lot b | A published Upcoming listing |
| lot c | Another published Active listing |
| ended lot | A listing whose bidding has ended |
| image a | featured-charizard.jpg, a 1.2 MB JPEG |
| image b | featured-umbreon.jpg, a 1.1 MB JPEG |
| image c | featured-pikachu.jpg, a 0.9 MB JPEG |

### Route

1. Select Manage Featured beside Create listing.
   - The Manage Featured page opens, showing the ordered slots. `g10adm.auction-featured.US1-TC8`
   - Up to three empty slots show, ready to fill, and no fourth is offered. `g10adm.auction-featured.US1-TC1`
2. Bind `<ended lot>` into the first slot.
   - The Ended lot is refused, and the slot holds no slide. `g10adm.auction-featured.US1-TC5`
3. Bind `<lot a>` into the first slot, then open `<auction url>` in a second session.
   - No Featured band shows from a slot with a lot and no image. `g10adm.auction-featured.US1-TC6`
4. Open the slot's front page image control.
   - It offers an upload and not `<lot a>`'s gallery. `g10adm.auction-featured.US1-TC9`
5. Upload `<image a>`, read the slot, and reload `<auction url>`.
   - The slot shows `<lot a>` and a preview of `<image a>`. `g10adm.auction-featured.US1-TC2`
   - Featured leads the catalogue with `<lot a>`'s slide, `<image a>` as its banner and slab. `g10adm.auction-featured.US1-TC2`
6. Fill the second slot with `<lot b>` and `<image b>`, and the third with `<lot c>` and `<image c>`, then reload `<auction url>`.
   - The Upcoming slide shows in Featured. `g10adm.auction-featured.US1-TC3`
   - No fourth slot is offered, and the three filled slots are unchanged. `g10adm.auction-featured.US1-TC4`
7. Move `<lot b>` ahead of `<lot a>`, read the slot order, and reload `<auction url>`.
   - The slots read `<lot b>`, `<lot a>`, `<lot c>`, and Featured shows them in that order. `g10adm.auction-featured.US2-TC1`
8. Clear `<lot a>`'s slot, read it, and reload `<auction url>`.
   - The slot is empty, and Featured drops `<lot a>` and keeps the others. `g10adm.auction-featured.US2-TC2`
9. Clear `<lot b>`'s and `<lot c>`'s slots, and reload `<auction url>`.
   - No Featured band shows, and All auctions remains. `g10adm.auction-featured.US2-TC3`

## g10adm.auction-featured.US1: Operator fills a Featured slot

**As an** authorized auction operator on Listings,
**I want** Manage Featured to open the ordered slots so I can bind a published
Active or Upcoming listing and upload one front page image,
**so that** that slide leads the collector catalogue.

<!-- trace:case id=g10adm.auction-featured.TC-cs2 rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC1: Up to three empty slots show, ready to fill

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on Manage Featured; no slot holds a lot or an image.

**Steps:**

1. Read the Featured slots.

**Expected Results:**

* Up to three empty slots show, ready to fill, and no fourth is offered.

<!-- trace:case id=g10adm.auction-featured.TC-6yi rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC2: An Active lot and its image lead the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on Manage Featured with an empty slot; `<active lot>` is published and Active.

**Test data:**

| Field | Value |
| --- | --- |
| `<active lot>` | A published Active listing |
| `<image>` | featured-charizard.jpg, a 1.2 MB JPEG |

**Steps:**

1. Bind `<active lot>` into the empty slot, upload `<image>`, and read the slot.
2. Open `<auction url>` as a collector and read the Featured band.

**Expected Results:**

* Step 1 shows the lot and a preview of `<image>`.
* Step 2 leads with `<active lot>`'s slide, `<image>` as its banner and slab.

<!-- trace:case id=g10adm.auction-featured.TC-ot7 rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC3: An Upcoming lot and its image show in Featured

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on Manage Featured with an empty slot; `<upcoming lot>` is published and Upcoming.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming lot>` | A published Upcoming listing |
| `<image>` | featured-umbreon.jpg, a 1.1 MB JPEG |

**Steps:**

1. Bind `<upcoming lot>` into the empty slot, upload `<image>`, and read the slot.
2. Open `<auction url>` as a collector and read the Featured band.

**Expected Results:**

* Step 1 shows the lot and a preview of `<image>`.
* Step 2 shows its slide in Featured.

<!-- trace:case id=g10adm.auction-featured.TC-2ti rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC4: No fourth slot is offered

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on Manage Featured; three slots each hold an eligible lot and an image.

**Steps:**

1. Look for a way to add a fourth slot.

**Expected Results:**

* None is offered, and the three slots are unchanged.

<!-- trace:case id=g10adm.auction-featured.TC-09m rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC5: An Ended lot is refused for a slot

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on Manage Featured with an empty slot; `<ended lot>` has Ended.

**Steps:**

1. Bind `<ended lot>` into the slot, then read the slot.

**Expected Results:**

* The Ended lot is refused, and the slot holds no slide.

<!-- trace:case id=g10adm.auction-featured.TC-pcc rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC6: A slot with a lot and no image stays off the catalogue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* The only filled Featured slot binds `<active lot>` with no image uploaded.

**Steps:**

1. Open `<auction url>` as a collector and look for a Featured band.

**Expected Results:**

* No Featured band shows from that slot.

<!-- trace:case id=g10adm.auction-featured.TC-ghv rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC8: Manage Featured opens from the Listings toolbar

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write) is on `<listings url>`.

**Steps:**

1. Select Manage Featured beside Create listing.

**Expected Results:**

* The Manage Featured page opens, showing the ordered slots.

<!-- trace:case id=g10adm.auction-featured.TC-1hr rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC9: A slot's image is uploaded, not picked from the gallery

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write) is on Manage Featured with an empty slot; a published Active listing has a gallery image.

**Steps:**

1. Bind the listing into the slot and open its front page image control.

**Expected Results:**

* It offers an upload, and not the listing's gallery.

---

## g10adm.auction-featured.US2: Operator orders and clears Featured slots

**As an** authorized auction operator on Manage Featured,
**I want** to reorder up to three Featured slots and clear a slot that should
no longer lead,
**so that** `/auction` shows only the slides I still mean to feature.

<!-- trace:case id=g10adm.auction-featured.TC-fzo rev=1 covers=g10adm.auction-featured.SC-u2e,g10adm.auction-featured.SC-u1c -->
### g10adm.auction-featured.US2-TC1: Reordering slots reorders Featured on the catalogue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-02

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on Manage Featured; complete slots read `<lot a>`, then `<lot b>`.

**Steps:**

1. Move `<lot b>` ahead of `<lot a>` and read the slot order.
2. Open `<auction url>` as a collector and read the Featured order.

**Expected Results:**

* Step 1 reads `<lot b>`, then `<lot a>`.
* Step 2 shows Featured in that order.

<!-- trace:case id=g10adm.auction-featured.TC-1f6 rev=1 covers=g10adm.auction-featured.SC-u2e,g10adm.auction-featured.SC-u1c -->
### g10adm.auction-featured.US2-TC2: Clearing a slot takes its slide off the catalogue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-02

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on Manage Featured; complete slots read `<lot a>`, then `<lot b>`.

**Steps:**

1. Clear `<lot a>`'s slot and read it.
2. Open `<auction url>` as a collector and read the Featured band.

**Expected Results:**

* Step 1 shows the slot empty.
* Step 2 drops `<lot a>` and still shows `<lot b>`.

<!-- trace:case id=g10adm.auction-featured.TC-ycf rev=1 covers=g10adm.auction-featured.SC-u2e,g10adm.auction-featured.SC-u1c -->
### g10adm.auction-featured.US2-TC3: Clearing the last complete slot removes the Featured band

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-02

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on Manage Featured; exactly one slot is complete.

**Steps:**

1. Clear that slot and read it.
2. Open `<auction url>` as a collector.

**Expected Results:**

* Step 1 shows the slot empty.
* Step 2 shows no Featured band, and All auctions remains.

## Ungrouped

### g10adm.auction-featured.US1: Operator fills a Featured slot

<!-- trace:case id=g10adm.auction-featured.TC-3p8 rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
#### g10adm.auction-featured.US1-TC7: Featured cannot be curated without the catalogue grants

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(lacks auction:write or auction:operate) is on `<listings url>`; an empty Featured slot exists.

**Test data:**

| Field | Value |
| --- | --- |
| `<image>` | featured-charizard.jpg, a 1.2 MB JPEG |

**Steps:**

1. Open Manage Featured, if offered.
2. Bind a published lot into the empty slot and upload `<image>`, if allowed.

**Expected Results:**

* Each control is disabled or refuses, and no slot changes.
