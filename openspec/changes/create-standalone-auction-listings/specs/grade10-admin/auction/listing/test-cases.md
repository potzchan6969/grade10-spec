# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-03, tcs-rules r1

## admin-listing-US6: Operator creates and publishes a listing with no campaign

**As an** auction operator,
**I want** to start a listing from the Listings section without picking a
campaign,
**so that** a one-off lot can go live without inventing a cover I do not need.

### admin-listing-US6-TC1-1: Create listing control appears for an authorized operator

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** admin-listing-US-06

**Pre-conditions:**
An authorized operator (holding `auction:operate`) on the Grade10 auction Listings section.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Check the section heading row.

**Expected Results:**

* A Create listing action is present.

### admin-listing-US6-TC2-1: Listing editor opens with no campaign

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** admin-listing-US-06

**Pre-conditions:**
An authorized operator on <grade10 auction admin listings url>.

**Steps:**

1. Activate Create listing.
2. Check the Campaign control.

**Expected Results:**

* The listing editor opens.
* No campaign is selected in the Campaign control.

### admin-listing-US6-TC3-1: Full lifecycle with no campaign — draft, create, publish, slug lookup

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** admin-listing-US-06

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

### admin-listing-US6-TC4-1: Listings table shows an unattached row

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** admin-listing-US-06

**Pre-conditions:**
A listing with no campaign exists. An authorized operator is on <grade10 auction admin listings url>.

**Steps:**

1. Check the campaign column for that listing's row.

**Expected Results:**

* The column shows the listing stands on its own.
* A campaign id is not the only label shown for that row.

### admin-listing-US6-TC5-1: Create listing is withheld from an unauthorized operator

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** admin-listing-US-06

**Pre-conditions:**
A signed-in operator without `auction:operate` on <grade10 auction admin listings url>.

**Steps:**

1. Check the section heading row for a Create listing action.
2. Send a draft save for a new listing.

**Expected Results:**

* Create listing is not offered.
* The draft save is refused.

---

## admin-listing-US7: Developer seeds and drops standalone fixture listings

**As a** developer running the auction service locally,
**I want** to seed fixture listings with no campaign from the Test panel,
**so that** I can test the standalone listing lifecycle without a campaign
cover.

### admin-listing-US7-TC1-1: Listings tab is present in the Test panel

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** admin-listing-US-07

**Pre-conditions:**
The grade10 admin is running locally with `LOCAL_FIXTURES_ENABLED` true.

**Steps:**

1. Navigate to <grade10 auction admin test panel url>.
2. Check the tab bar.

**Expected Results:**

* A Listings tab is present beside the Campaign tab.

### admin-listing-US7-TC2-1: Developer seeds standalone fixture listings

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** admin-listing-US-07

**Pre-conditions:**
The Listings tab is open in the Test panel. No standalone fixture listings exist.

**Steps:**

1. Open the Listings tab.
2. Select one or more fixture ids.
3. Click Add listings.
4. Navigate to <grade10 auction admin listings url>.

**Expected Results:**

* Step 3 creates each selected fixture as a listing with no campaign, a reserved inventory product, and a media item.
* The instance counts on the Listings tab update.
* Step 4 shows each seeded listing in the Listings table with no campaign.

### admin-listing-US7-TC3-1: Developer drops a standalone fixture listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** admin-listing-US-07

**Pre-conditions:**
At least one standalone fixture listing exists (seeded from the Listings tab).

**Steps:**

1. Open the Listings tab in the Test panel.
2. Select a standalone fixture listing from the drop select.
3. Click Drop listing and confirm.
4. Navigate to <grade10 auction admin listings url>.

**Expected Results:**

* The listing is removed and its inventory hold is released.
* Step 4 shows the listing is no longer in the Listings table.
