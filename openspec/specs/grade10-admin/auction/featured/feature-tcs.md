# grade10-admin/auction/featured Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* Manage Featured opens from the Listings toolbar of the admin console, beside Create listing: up to three ordered slots, each binding one published Active or Upcoming listing and one uploaded front page image. `<g10url>/auction` leads with Featured when at least one slot is complete.
* Curating Featured needs auction:write and auction:operate.

## Walk 1: Fill, order and clear the Featured slots

Starting state:

- admin(holds auction:write and auction:operate) is on Listings; no slot is filled; `<lot a>` and `<lot c>` are Active, `<lot b>` Upcoming, and `<ended lot>` has Ended.

Shared test data:

| Field | Value |
| --- | --- |
| lot a | A published Active listing with a gallery image |
| lot b | A published Upcoming listing |
| lot c | Another published Active listing |
| ended lot | A listing whose bidding has ended |
| images | featured-charizard.jpg, featured-umbreon.jpg, featured-pikachu.jpg, each about 1 MB |

### Route

1. Select Manage Featured.
   - Three empty slots, and no fourth. `g10adm.auction-featured.US1-TC1`
2. Bind `<ended lot>` into the first slot.
   - Refused. `g10adm.auction-featured.US1-TC5`
3. Bind `<lot a>` without an image, and open `<g10url>/auction`.
   - No Featured band. `g10adm.auction-featured.US1-TC6`
4. Upload an image for it, and fill the other slots with `<lot b>` and `<lot c>`; reload the catalogue.
   - Featured leads with A, B and C, each with its uploaded image. `g10adm.auction-featured.US1-TC2`
5. Move B ahead of A, then clear every slot, reloading the catalogue each time.
   - Featured follows the order, then disappears. `g10adm.auction-featured.US2-TC1`

## g10adm.auction-featured.US1: Operator fills a Featured slot

**As an** authorized auction operator on Listings,
**I want** Manage Featured to open the ordered slots so I can bind a published
Active or Upcoming listing and upload one front page image,
**so that** that slide leads the collector catalogue.

<!-- trace:case id=g10adm.auction-featured.TC-cs2 rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC1: Manage Featured opens from the Listings toolbar with three ordered slots, and no fourth

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

* admin(holds auction:write and auction:operate) is on Listings; `<state>`.

**Test data:**

| `<state>` |
| --- |
| no slot is filled |
| three slots each hold an eligible lot and an image |

**Steps:**

1. Select Manage Featured beside Create listing, and look for a way to add a slot.

**Expected Results:**

* The page shows three ordered slots, empty or as filled, and offers no fourth.

<!-- trace:case id=g10adm.auction-featured.TC-6yi rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC2: A lot and its uploaded image make a slide that leads the catalogue

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin is on Manage Featured with an empty slot; `<lot>` is published, `<status>`, with a gallery image.

**Test data:**

| `<status>` | `<image>` |
| --- | --- |
| Active | featured-charizard.jpg, a 1.2 MB JPEG |
| Upcoming | featured-umbreon.jpg, a 1.1 MB JPEG |

**Steps:**

1. Bind `<lot>` into the slot and open its front page image control.
2. Upload `<image>`, and read the slot.
3. As a collector, open `<g10url>/auction` and read Featured.

**Expected Results:**

* Step 1 offers an upload, never `<lot>`'s gallery.
* Step 2 shows `<lot>` and a preview of `<image>`.
* Step 3 shows `<lot>`'s slide with `<image>` as its banner and slab.

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

* admin is on Manage Featured with an empty slot; `<ended lot>` has Ended.

**Steps:**

1. Bind `<ended lot>` into the slot, and read it.

**Expected Results:**

* It is refused, and the slot holds no slide.

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

* The only filled slot binds an Active lot with no image uploaded.

**Steps:**

1. As a collector, open `<g10url>/auction`.

**Expected Results:**

* No Featured band shows.

<!-- trace:case id=g10adm.auction-featured.TC-3p8 rev=1 covers=g10adm.auction-featured.SC-fkl,g10adm.auction-featured.SC-8hv,g10adm.auction-featured.SC-xez,g10adm.auction-featured.SC-mag,g10adm.auction-featured.SC-l3u,g10adm.auction-featured.SC-ad7,g10adm.auction-featured.SC-t75 -->
### g10adm.auction-featured.US1-TC7: Featured cannot be curated without the catalogue grants

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(lacks auction:write or auction:operate) is on Listings; an empty slot exists.

**Steps:**

1. Open Manage Featured, bind a published lot and upload an image, if offered.

**Expected Results:**

* Each control is disabled or refuses, and no slot changes.

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

* admin is on Manage Featured; complete slots read `<lot a>`, then `<lot b>`.

**Steps:**

1. Move `<lot b>` ahead of `<lot a>`, and read the slots.
2. As a collector, open `<g10url>/auction` and read Featured.

**Expected Results:**

* Both read `<lot b>`, then `<lot a>`.

<!-- trace:case id=g10adm.auction-featured.TC-1f6 rev=1 covers=g10adm.auction-featured.SC-u2e,g10adm.auction-featured.SC-u1c -->
### g10adm.auction-featured.US2-TC2: Clearing a slot takes its slide off, and clearing the last removes the band

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
* **Trace:** grade10-admin-auction-featured-US-02

**Pre-conditions:**

* admin is on Manage Featured; `<complete>` are complete.

**Test data:**

| `<complete>` | `<catalogue after>` |
| --- | --- |
| `<lot a>`, then `<lot b>` | Featured with `<lot b>` alone |
| `<lot a>` alone | no Featured band, All auctions remaining |

**Steps:**

1. Clear `<lot a>`'s slot, and read it.
2. As a collector, open `<g10url>/auction`.

**Expected Results:**

* Step 1 shows the slot empty; step 2 shows `<catalogue after>`.
