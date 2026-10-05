# grade10-admin/auction/featured Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

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

* admin(holds auction:write and auction:operate) is on <grade10 auction admin featured url>.
* No Featured slot holds a lot or a front page image.

**Steps:**

1. Read the Featured slots.

**Expected Results:**

* Step 1 shows up to three empty slots, ready to fill.
* Step 1 offers no fourth slot.

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

* admin(holds auction:write and auction:operate) is on <grade10 auction admin featured url>.
* At least one empty Featured slot is available.
* <active lot> is a published Active lot eligible for Featured.

**Test data:**

| Field | Value |
| --- | --- |
| `<active lot>` | A published Active lot |
| `<front page image>` | One front page image file for that slot |

**Steps:**

1. Bind <active lot> into an empty Featured slot.
2. Upload <front page image> into that slot.
3. Read that slot.
4. Open <grade10 auction catalogue url> as a collector.
5. Read the Featured band.

**Expected Results:**

* Step 3 shows the lot title or id and front page image preview.
* Step 5 leads /auction with that slide, <front page image> as banner and slab.

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

* admin(holds auction:write and auction:operate) is on <grade10 auction admin featured url>.
* At least one empty Featured slot is available.
* <upcoming lot> is a published Upcoming lot eligible for Featured.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming lot>` | A published Upcoming lot |
| `<front page image>` | One front page image file for that slot |

**Steps:**

1. Bind <upcoming lot> into an empty Featured slot.
2. Upload <front page image> into that slot.
3. Read that slot.
4. Open <grade10 auction catalogue url> as a collector.
5. Read the Featured band.

**Expected Results:**

* Step 3 shows <upcoming lot> and its front page image preview.
* Step 5 shows that slide on /auction Featured.

### grade10-admin-auction-featured-US1-TC04-1: A fourth slot is refused at the limit

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

* admin(holds auction:write and auction:operate) is on <grade10 auction admin featured url>.
* Three Featured slots each hold an eligible lot and a front page image.

**Steps:**

1. Read the three Featured slots.
2. Try to add a fourth Featured slot.

**Expected Results:**

* Step 2 offers no fourth slot.
* Step 2 leaves the three filled slots unchanged.

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

* admin(holds auction:write and auction:operate) is on <grade10 auction admin featured url>.
* At least one empty or replaceable Featured slot is available.
* <ended lot> is an Ended lot.

**Test data:**

| Field | Value |
| --- | --- |
| `<ended lot>` | An Ended lot that is not Active or Upcoming |

**Steps:**

1. Bind <ended lot> into a Featured slot.
2. Read that slot.

**Expected Results:**

* Step 1 refuses the Ended lot.
* Step 2 does not hold <ended lot> as a complete slide.

### grade10-admin-auction-featured-US1-TC06-1: Lot without a front page image stays off /auction

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

* admin(holds auction:write and auction:operate) is on <grade10 auction admin featured url>.
* The only Featured work in progress binds <active lot> with no front page image uploaded.
* No other complete Featured slot is set.

**Test data:**

| Field | Value |
| --- | --- |
| `<active lot>` | A published Active lot bound to the incomplete slot |

**Steps:**

1. Open <grade10 auction catalogue url> as a collector.
2. Read the page for a Featured band.

**Expected Results:**

* Step 2 leaves the incomplete slot off /auction Featured.
* Step 2 shows no Featured band from that slot alone.

### grade10-admin-auction-featured-US1-TC07-1: Missing catalogue grants block Featured curation

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

* admin(lacks auction:write or auction:operate) is on <grade10 auction admin listings url>.
* At least one empty Featured slot exists.

**Steps:**

1. Open <grade10 auction admin featured url>.
2. Bind a published lot into an empty slot.
3. Upload a front page image into that slot.

**Expected Results:**

* Each step leaves controls visible and disabled, or refuses.
* No step fills or alters a Featured slot.

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

1. Click "Manage Featured" beside "Create listing".

**Expected Results:**

* Step 1 opens the Manage Featured sub-page.
* Step 1 shows the ordered Featured slots.

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

* admin(holds auction:write) is on <grade10 auction admin featured url>.
* An empty or replaceable Featured slot is available.
* A published Active listing with a gallery image exists.

**Steps:**

1. Bind that Active listing into the slot.
2. Open the front page image control for that slot.

**Expected Results:**

* Step 2 offers an upload for the front page image.
* Step 2 does not offer the listing gallery as that image.

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

* admin(holds auction:write and auction:operate) is on <grade10 auction admin featured url>.
* Two or three complete Featured slots are set in order <lot A>, then <lot B> (and <lot C> when present).

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Complete Featured slot currently first |
| `<lot B>` | Complete Featured slot currently second |

**Steps:**

1. Move <lot B> ahead of <lot A>.
2. Read the slot order.
3. Open <grade10 auction catalogue url> as a collector.
4. Read the Featured order.

**Expected Results:**

* Step 2 shows <lot B> before <lot A>.
* Step 4 shows Featured in that new order.

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

* admin(holds auction:write and auction:operate) is on <grade10 auction admin featured url>.
* Two complete Featured slots are set for <lot A> then <lot B>.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Complete Featured slot to clear |
| `<lot B>` | Complete Featured slot that remains |

**Steps:**

1. Clear the slot holding <lot A>.
2. Read that slot.
3. Open <grade10 auction catalogue url> as a collector.
4. Read the Featured band.

**Expected Results:**

* Step 2 shows the cleared slot empty.
* Step 4 drops <lot A> and still shows complete <lot B>.

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

* admin(holds auction:write and auction:operate) is on <grade10 auction admin featured url>.
* Exactly one complete Featured slot is set.

**Steps:**

1. Clear that complete slot.
2. Read that slot.
3. Open <grade10 auction catalogue url> as a collector.
4. Read the page for a Featured band.

**Expected Results:**

* Step 2 shows the slot empty.
* Step 4 shows no /auction Featured band; All auctions remains.

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
