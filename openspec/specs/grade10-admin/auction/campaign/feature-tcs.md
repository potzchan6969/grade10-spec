# grade10-admin/auction/campaign Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-09, tcs-rules r3.0

## grade10-admin-auction-campaign-US1: Operator finds the catalogue cover called a campaign

**As an** auction operator,
**I want** the catalogue cover called Campaign everywhere in the admin,
**so that** I never mistake a cover for store checkout or sold stock.

### grade10-admin-auction-campaign-US1-TC1-1: Section and editor name the cover a campaign

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-01

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on <grade10 auction admin url>.
* `<campaign_1>` exists as a draft.

**Steps:**

1. Open the catalogue-cover section that was previously Sales.
2. Read the tab and page headings.
3. Open `<campaign_1>` and read the editor chrome.

**Expected Results:**

* The tab and page are labeled Campaigns, not Sales.
* The editor chrome names it a Campaign, not a Sale.

---

## grade10-admin-auction-campaign-US2: Operator opens a campaign as a draft

**As an** auction operator,
**I want** to start a campaign with a title and optional copy that no collector can see yet,
**so that** I can prepare an event before anything is public.

### grade10-admin-auction-campaign-US2-TC1-1: New campaign editor opens empty and offers no create

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on the Campaigns section.

**Steps:**

1. Start a new campaign.
2. Read the title and copy fields, and the actions offered.

**Expected Results:**

* The editor opens with empty title and copy.
* Create and publish are not offered until the campaign exists as a draft.

### grade10-admin-auction-campaign-US2-TC2-1: Operator opens a draft campaign with a title

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on the Campaigns section.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | September Slabs |
| `<copy>` | (empty) |

**Steps:**

1. Open a campaign with title `<title>` and empty copy.
2. Read the stored campaign.
3. Read the public catalogue covers at <grade10 auction url>.

**Expected Results:**

* Grade10 persists a draft campaign titled `<title>`.
* The campaign is absent from the public catalogue covers.

### grade10-admin-auction-campaign-US2-TC3-1: Draft campaign editor offers create and cancel, never publish

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* `<campaign_1>` is a draft titled `<title>`.
* admin(holds the auction catalogue grant) is on the Campaigns section.

**Steps:**

1. Open `<campaign_1>`.
2. Read the title, the copy and the actions offered.

**Expected Results:**

* The editor shows `<campaign_1>`'s title and copy.
* Create and cancel are offered.
* Publish is not offered.

### grade10-admin-auction-campaign-US2-TC4-1: Open without a title is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on the Campaigns section.

**Steps:**

1. Open a campaign with an empty title.
2. Read the Campaigns list.

**Expected Results:**

* Grade10 refuses the open.
* No campaign is persisted.

### grade10-admin-auction-campaign-US2-TC5-1: Unauthorized open is refused

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
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(signed in, may not catalogue a campaign) is on the Campaigns section.

**Steps:**

1. Open a new campaign.
2. Read the Campaigns list.

**Expected Results:**

* Grade10 refuses the open.
* No campaign is persisted.

---

## grade10-admin-auction-campaign-US3: Operator takes a campaign from draft to published

**As an** auction operator,
**I want** to create a draft and then publish it as a public cover without publishing the listings under it,
**so that** the event is announced while each lot publishes on its own.

### grade10-admin-auction-campaign-US3-TC1-1: Draft becomes created and stays off the catalogue

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
* **Trace:** grade10-admin-auction-campaign-US-03

**Pre-conditions:**

* `<campaign_1>` is a draft titled `<title>`.
* admin(holds the auction catalogue grant) is on the Campaigns section.

**Steps:**

1. Open `<campaign_1>` and create it.
2. Read its state and the public catalogue covers.

**Expected Results:**

* Grade10 moves `<campaign_1>` to `created`.
* It remains absent from the public catalogue covers.

### grade10-admin-auction-campaign-US3-TC2-1: Created campaign editor offers publish and cancel, never create

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-03

**Pre-conditions:**

* `<campaign_2>` is created and titled `<title>`.
* admin(holds the auction catalogue grant) is on the Campaigns section.

**Steps:**

1. Open `<campaign_2>`.
2. Read the title, the copy and the actions offered.

**Expected Results:**

* The editor shows `<campaign_2>`'s title and copy.
* Publish and cancel are offered.
* Create is not offered.

### grade10-admin-auction-campaign-US3-TC3-1: Publishing a created campaign covers its unpublished lots

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
* **Trace:** grade10-admin-auction-campaign-US-03

**Pre-conditions:**

* `<campaign_2>` is created, with `<listing_1>` under it and not published.
* admin(holds the auction catalogue grant) is on the Campaigns section.

**Steps:**

1. Publish `<campaign_2>`.
2. Read the public catalogue at <grade10 auction url>.

**Expected Results:**

* Grade10 moves `<campaign_2>` to `published`.
* It appears as a public catalogue cover.
* `<listing_1>` stays off the catalogue.

### grade10-admin-auction-campaign-US3-TC4-1: Create and publish are refused out of state

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
* **Trace:** grade10-admin-auction-campaign-US-03

Runs once per row of **Test data**.

**Test data:**

| `<campaign>` | Action | Grade10 |
| --- | --- | --- |
| A created campaign | create it again | refuses the create, the campaign remains created |
| A draft campaign | publish it | refuses the publish, the campaign remains a draft |
| A published campaign | publish it | refuses the publish, the campaign remains published |

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on the Campaigns section.

**Steps:**

1. Open `<campaign>`.
2. Take the row's action.
3. Read the campaign's state.

**Expected Results:**

* Grade10 answers as the row states.

---

## grade10-admin-auction-campaign-US4: Operator edits a campaign's cover

**As an** auction operator,
**I want** to change a campaign's title and copy while it is open,
**so that** the public cover stays right without recreating the event.

### grade10-admin-auction-campaign-US4-TC1-1: Copy changes on a published campaign

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
* **Trace:** grade10-admin-auction-campaign-US-04

**Pre-conditions:**

* `<campaign_3>` is published and titled `<title>`.
* admin(holds the auction catalogue grant) is on the Campaigns section.

**Test data:**

| Field | Value |
| --- | --- |
| `<new copy>` | A description that differs from the stored copy |

**Steps:**

1. Open `<campaign_3>` and change its copy to `<new copy>`.
2. Read the stored campaign.

**Expected Results:**

* Grade10 stores `<new copy>`.
* The title and status are unchanged.

### grade10-admin-auction-campaign-US4-TC2-1: Clearing the title is refused

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
* **Trace:** grade10-admin-auction-campaign-US-04

**Pre-conditions:**

* `<campaign_1>` is a draft with a title.
* admin(holds the auction catalogue grant) is on the Campaigns section.

**Steps:**

1. Open `<campaign_1>` and clear the title.
2. Read the stored title.

**Expected Results:**

* Grade10 refuses the write.
* The title is unchanged.

---

## grade10-admin-auction-campaign-US5: Operator calls a campaign off

**As an** auction operator,
**I want** to cancel a campaign in any open state and have its listings cancelled with it,
**so that** a called-off event leaves nothing live and nothing more to do.

### grade10-admin-auction-campaign-US5-TC1-1: Cancelling a published campaign cancels its listings

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
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* `<campaign_3>` is published with `<listing_2>` and `<listing_3>` published under it.
* admin(holds the grant to call a campaign off) is on the Campaigns section.

**Steps:**

1. Cancel `<campaign_3>`.
2. Read the state of `<campaign_3>`, `<listing_2>` and `<listing_3>`.

**Expected Results:**

* Grade10 moves `<campaign_3>` to `canceled`.
* `<listing_2>` and `<listing_3>` move to `canceled` under the listing cancel rules.

### grade10-admin-auction-campaign-US5-TC2-1: A campaign with no listings cancels from draft or created

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
* **Trace:** grade10-admin-auction-campaign-US-05

Runs once per row of **Test data**.

**Test data:**

| `<campaign>` | Starting state |
| --- | --- |
| A campaign with no listings | draft |
| A campaign with no listings | created |

**Pre-conditions:**

* admin(holds the grant to call a campaign off) is on the Campaigns section.

**Steps:**

1. Open `<campaign>` and cancel it.
2. Read its state.

**Expected Results:**

* Grade10 moves `<campaign>` to `canceled`.

### grade10-admin-auction-campaign-US5-TC3-1: A canceled campaign refuses a second cancel and a title edit

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* `<campaign_4>` is canceled.
* admin(holds the grant to call a campaign off) is on the Campaigns section.

**Steps:**

1. Open `<campaign_4>` and cancel it.
2. Change its title.
3. Read its state and title.

**Expected Results:**

* Grade10 refuses the cancel and the campaign remains canceled.
* Grade10 refuses the title write and the title is unchanged.

### grade10-admin-auction-campaign-US5-TC4-1: A canceled campaign opens read-only

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* `<campaign_4>` is canceled.
* admin(holds the auction catalogue grant) is on the Campaigns section.

**Steps:**

1. Open `<campaign_4>`.
2. Read the title, the copy and the actions offered.

**Expected Results:**

* The editor shows its title and copy.
* Create, publish, edit save and cancel are not offered.

### grade10-admin-auction-campaign-US5-TC5-1: Unauthorized cancel is refused

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
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* `<campaign_1>` is a draft.
* admin(signed in, may not call a campaign off) is on the Campaigns section.

**Steps:**

1. Open `<campaign_1>` and cancel it.
2. Read its state.

**Expected Results:**

* Grade10 refuses the cancel.
* The campaign remains a draft.
