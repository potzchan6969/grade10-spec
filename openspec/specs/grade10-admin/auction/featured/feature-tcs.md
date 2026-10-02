# grade10-admin/auction/featured Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-25, tcs-rules r4

## grade10-admin-auction-featured-US1: Operator fills a Featured slot

**As an** authorized auction operator on Listings,
**I want** Manage Featured to open the ordered slots so I can bind a published
Active or Upcoming listing and upload one front page image,
**so that** that slide leads the collector catalogue.

### grade10-admin-auction-featured-US1-TC01-1: Empty slots show up to three ready to fill

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on `<grade10 auction admin featured url>`.
* No Featured slot holds a lot or a front page image.

**Steps:**

1. Read the Featured curation surface.

**Expected Results:**

* Up to three empty ordered slots are ready to fill.
* No fourth slot is offered.

### grade10-admin-auction-featured-US1-TC02-1: Fill a slot with an Active lot and front page image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on `<grade10 auction admin featured url>`.
* At least one empty Featured slot is available.
* `<active lot>` is a published Active lot eligible for Featured.

**Test data:**

| Field | Value |
| --- | --- |
| `<active lot>` | A published Active lot |
| `<front page image>` | One front page image file for that slot |

**Steps:**

1. Bind `<active lot>` into an empty Featured slot.
2. Upload `<front page image>` into that slot.
3. Read the slot on the curation surface.
4. Open `<grade10 auction catalogue url>` as a collector and read Featured.

**Expected Results:**

* The slot shows the lot title or id and a front page image preview.
* `/auction` Featured leads with that slide using `<front page image>` as banner and slab.

### grade10-admin-auction-featured-US1-TC03-1: Fill a slot with an Upcoming lot and front page image

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on `<grade10 auction admin featured url>`.
* At least one empty Featured slot is available.
* `<upcoming lot>` is a published Upcoming lot eligible for Featured.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming lot>` | A published Upcoming lot |
| `<front page image>` | One front page image file for that slot |

**Steps:**

1. Bind `<upcoming lot>` into an empty Featured slot.
2. Upload `<front page image>` into that slot.
3. Open `<grade10 auction catalogue url>` as a collector and read Featured.

**Expected Results:**

* The slot is filled with `<upcoming lot>` and its front page image preview.
* `/auction` Featured shows that slide.

### grade10-admin-auction-featured-US1-TC04-1: Cap of three refuses a fourth slot

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
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on `<grade10 auction admin featured url>`.
* Three Featured slots each hold an eligible lot and a front page image.

**Steps:**

1. Read the Featured curation surface for a way to add another slot.
2. Attempt to create or fill a fourth Featured slot if any control is offered.

**Expected Results:**

* No fourth slot is offered.
* The three filled slots remain unchanged.

### grade10-admin-auction-featured-US1-TC05-1: Ended lot is refused for a Featured slot

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
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on `<grade10 auction admin featured url>`.
* At least one empty or replaceable Featured slot is available.
* `<ended lot>` is an Ended lot.

**Test data:**

| Field | Value |
| --- | --- |
| `<ended lot>` | An Ended lot that is not Active or Upcoming |

**Steps:**

1. Attempt to bind `<ended lot>` into a Featured slot.
2. Read the slot state and any refusal.

**Expected Results:**

* Grade10 refuses the Ended lot for the Featured slot.
* The slot does not hold `<ended lot>` as a complete slide.

### grade10-admin-auction-featured-US1-TC06-1: Slot with lot but no front page image is not shown on /auction

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on `<grade10 auction admin featured url>`.
* The only Featured work in progress binds `<active lot>` with no front page image uploaded.
* No other complete Featured slot is set.

**Test data:**

| Field | Value |
| --- | --- |
| `<active lot>` | A published Active lot bound to the incomplete slot |

**Steps:**

1. Leave the slot with `<active lot>` and no front page image.
2. Open `<grade10 auction catalogue url>` as a collector.
3. Read whether a Featured band is present.

**Expected Results:**

* The incomplete slot is not shown on `/auction` Featured.
* No Featured band appears from that slot alone.

### grade10-admin-auction-featured-US1-TC07-1: Operator without catalogue grants cannot curate Featured

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
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(lacks auction:write or auction:operate) is signed in to Grade10 auction admin.
* At least one empty Featured slot exists.

**Steps:**

1. Open `<grade10 auction admin featured url>` or the Featured curation controls.
2. Attempt to bind a lot or upload a front page image into a slot.

**Expected Results:**

* Curation controls stay visible and disabled, or the server refuses the change.
* No Featured slot is filled or altered.


### grade10-admin-auction-featured-US1-TC08-1: Manage Featured opens from the Listings toolbar

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write) is on the auction admin Listings tab.

**Steps:**

1. Activate **Manage Featured** beside Create listing.

**Expected Results:**

* The Manage Featured sub-page opens.
* Ordered Featured slots are shown.

### grade10-admin-auction-featured-US1-TC09-1: Front page image upload offers no gallery picker

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-01

**Pre-conditions:**

* admin(holds auction:write) is on Manage Featured with an empty or replaceable slot.
* A published Active listing with a gallery image exists.

**Steps:**

1. Bind the Active listing into the slot.
2. Set the front page image for that slot.

**Expected Results:**

* The operator uploads a front page image for the slot.
* The listing gallery is not offered as the front page image.

---

## grade10-admin-auction-featured-US2: Operator orders and clears Featured slots

**As an** authorized auction operator on Manage Featured,
**I want** to reorder up to three Featured slots and clear a slot that should
no longer lead,
**so that** `/auction` shows only the slides I still mean to feature.

### grade10-admin-auction-featured-US2-TC01-1: Reorder filled slots updates site Featured order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-02

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on `<grade10 auction admin featured url>`.
* Two or three complete Featured slots are set in order `<lot A>`, then `<lot B>` (and `<lot C>` when present).

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Complete Featured slot currently first |
| `<lot B>` | Complete Featured slot currently second |

**Steps:**

1. Reorder so `<lot B>` precedes `<lot A>`.
2. Read the slot order on the curation surface.
3. Open `<grade10 auction catalogue url>` as a collector and read Featured order.

**Expected Results:**

* Admin slots show `<lot B>` before `<lot A>`.
* Site Featured follows that new order.

### grade10-admin-auction-featured-US2-TC02-1: Clear a slot removes that slide from /auction Featured

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-featured-US-02

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on `<grade10 auction admin featured url>`.
* Two complete Featured slots are set for `<lot A>` then `<lot B>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Complete Featured slot to clear |
| `<lot B>` | Complete Featured slot that remains |

**Steps:**

1. Clear the slot holding `<lot A>`.
2. Read that slot on the curation surface.
3. Open `<grade10 auction catalogue url>` as a collector and read Featured.

**Expected Results:**

* The cleared slot is empty.
* `/auction` Featured no longer shows `<lot A>` and still shows `<lot B>` when that slot remains complete.

### grade10-admin-auction-featured-US2-TC03-1: Clearing the last complete slot leaves Featured absent

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
* **Trace:** grade10-admin-auction-featured-US-02

**Pre-conditions:**

* admin(holds auction:write and auction:operate) is on `<grade10 auction admin featured url>`.
* Exactly one complete Featured slot is set.

**Steps:**

1. Clear that complete slot.
2. Open `<grade10 auction catalogue url>` as a collector.
3. Read whether a Featured band is present.

**Expected Results:**

* The slot is empty on the curation surface.
* `/auction` shows no Featured band; All auctions remains.

## Settled

- Replace in place without clearing first
- Incomplete slots (lot without front page image or front page image without lot) may exist in admin and never appear on `/auction`
- Cap of three; Ended refused; unique lot across slots
- Grants: `auction:write`

## Reconciliation

**Run:** Same blind bundle as the site suite for this change's admin capability (Purpose/Feature set, journeys, proposal, decisions, ui-design admin states, PRD Featured/grants). Denied requirements and durable specs. Scenario pass read admin outline, journeys, tech-design, PRD Featured.

### Raised, folded
- Manage Featured from Listings → `grade10-admin-auction-featured-SC-11`
- Front page image is upload-only, not gallery → `grade10-admin-auction-featured-SC-12`
- Cap / empty / fill Active & Upcoming / Ended refuse / incomplete not shown / reorder / clear / last clear leaves Featured absent / write grant and refusal → `grade10-admin-auction-featured-SC-01` through `SC-10`

### Raised, rejected
- None

### Uncovered anchors
- None — every journey and Feature set root group has at least one case and one scenario
