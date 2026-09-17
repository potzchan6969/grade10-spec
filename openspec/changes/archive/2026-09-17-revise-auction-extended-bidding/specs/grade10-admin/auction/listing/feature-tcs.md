# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-10, tcs-rules r3.0

## grade10-admin-auction-listing-US3: Operator creates a listing that is ready to sell

**As an** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

### grade10-admin-auction-listing-US3-TC17-2: Extension values the listing refuses

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
