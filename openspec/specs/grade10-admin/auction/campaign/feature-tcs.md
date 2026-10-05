# grade10-admin/auction/campaign Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-admin-auction-campaign-US1: Operator finds the catalogue cover called a campaign

**As an** auction operator,
**I want** the catalogue cover called Campaign everywhere in the admin,
**so that** I never mistake a cover for store checkout or sold stock.

<!-- trace:case id=g10adm.auction-campaign.TC-1bi rev=1 covers=g10adm.auction-campaign.SC-0ir,g10adm.auction-campaign.SC-qeg -->
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
* <campaign_1> exists as a draft.

**Steps:**

1. Open the catalogue-cover section formerly called Sales.
2. Read the tab label.
3. Read the page heading.
4. Open <campaign_1>.
5. Read the editor heading.

**Expected Results:**

* Steps 2 and 3 read Campaigns, not Sales.
* Step 5 names the editor a Campaign, not a Sale.

---

## grade10-admin-auction-campaign-US2: Operator opens a campaign as a draft

**As an** auction operator,
**I want** to start a campaign with a title and optional copy that no collector can see yet,
**so that** I can prepare an event before anything is public.

<!-- trace:case id=g10adm.auction-campaign.TC-khb rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
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

* admin(holds the auction catalogue grant) is on the Campaigns page.

**Steps:**

1. Start a new campaign.
2. Read the title field.
3. Read the copy field.
4. Read the actions offered.

**Expected Results:**

* Steps 2 and 3 show an empty title and empty copy.
* Create and publish are not offered until a draft exists.

<!-- trace:case id=g10adm.auction-campaign.TC-ppt rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
### grade10-admin-auction-campaign-US2-TC2-1: Titled draft stays off the public catalogue

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

* admin(holds the auction catalogue grant) is on the Campaigns page.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | September Slabs (any title of 1 to 200 characters) |
| `<copy>` | (empty) |

**Steps:**

1. Start a new campaign.
2. Enter <title> in the title field.
3. Leave the copy field empty.
4. Open the campaign.
5. Read the stored campaign.
6. Open <grade10 auction url>.
7. Read the catalogue covers.

**Expected Results:**

* Step 5 shows a draft campaign titled <title>.
* Step 7 omits that campaign from the public covers.

<!-- trace:case id=g10adm.auction-campaign.TC-o3t rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
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

* <campaign_1> is a draft titled <title>.
* admin(holds the auction catalogue grant) is on the Campaigns page.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | September Slabs (any title of 1 to 200 characters) |

**Steps:**

1. Open <campaign_1>.
2. Read the title.
3. Read the copy.
4. Read the actions offered.

**Expected Results:**

* Steps 2 and 3 show the stored title and copy.
* Create and cancel are both offered on the editor.
* Publish is not offered on the editor.

<!-- trace:case id=g10adm.auction-campaign.TC-qn0 rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
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

* admin(holds the auction catalogue grant) is on the Campaigns page.

**Steps:**

1. Start a new campaign.
2. Leave the title empty.
3. Open the campaign.
4. Read the Campaigns list.

**Expected Results:**

* Step 3 refuses the open with an empty title.
* Step 4 shows that no campaign was stored.

<!-- trace:case id=g10adm.auction-campaign.TC-e8o rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
### grade10-admin-auction-campaign-US2-TC5-1: Unauthorized campaign open is refused

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

* admin(signed in, may not catalogue a campaign) is on the Campaigns page.

**Steps:**

1. Open a new campaign.
2. Read the Campaigns list.

**Expected Results:**

* Step 1 refuses the unauthorized open.
* Step 2 shows that no campaign was stored.

---

## grade10-admin-auction-campaign-US3: Operator takes a campaign from draft to published

**As an** auction operator,
**I want** to create a draft and then publish it as a public cover without publishing the listings under it,
**so that** the event is announced while each lot publishes on its own.

<!-- trace:case id=g10adm.auction-campaign.TC-bkn rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
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

* <campaign_1> is a draft titled <title>.
* admin(holds the auction catalogue grant) is on the Campaigns page.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | September Slabs (any title of 1 to 200 characters) |

**Steps:**

1. Open <campaign_1>.
2. Create the campaign.
3. Read its state.
4. Open <grade10 auction url>.
5. Read the catalogue covers.

**Expected Results:**

* Step 3 shows <campaign_1> moved to created.
* Step 5 omits <campaign_1> from the public covers.

<!-- trace:case id=g10adm.auction-campaign.TC-a8a rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
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

* <campaign_2> is created and titled <title>.
* admin(holds the auction catalogue grant) is on the Campaigns page.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | September Slabs (any title of 1 to 200 characters) |

**Steps:**

1. Open <campaign_2>.
2. Read the title.
3. Read the copy.
4. Read the actions offered.

**Expected Results:**

* Steps 2 and 3 show the stored title and copy.
* Publish and cancel are both offered on the editor.
* Create is not offered on the editor.

<!-- trace:case id=g10adm.auction-campaign.TC-z1p rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
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

* <campaign_2> is created, with <listing_1> under it and not published.
* admin(holds the auction catalogue grant) is on the Campaigns page.

**Steps:**

1. Open <campaign_2>.
2. Publish <campaign_2>.
3. Read <campaign_2>'s state.
4. Open <grade10 auction url>.
5. Read the catalogue covers.
6. Read <listing_1> on the catalogue.

**Expected Results:**

* Step 3 shows <campaign_2> moved to published.
* Step 5 shows <campaign_2> as a public cover.
* Step 6 leaves <listing_1> off the catalogue.

<!-- trace:case id=g10adm.auction-campaign.TC-qvp rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
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

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on the Campaigns page.

**Test data:**

| `<campaign>` | Action | Grade10 |
| --- | --- | --- |
| A created campaign | create it again | refuses the create, the campaign remains created |
| A draft campaign | publish it | refuses the publish, the campaign remains a draft |
| A published campaign | publish it | refuses the publish, the campaign remains published |

**Steps:**

1. Open <campaign>.
2. Take the row's action.
3. Read the campaign's state.

**Expected Results:**

* Step 2 is refused, and step 3 still matches the row.

---

## grade10-admin-auction-campaign-US4: Operator edits a campaign's cover

**As an** auction operator,
**I want** to change a campaign's title and copy while it is open,
**so that** the public cover stays right without recreating the event.

<!-- trace:case id=g10adm.auction-campaign.TC-4lv rev=1 covers=g10adm.auction-campaign.SC-1xm,g10adm.auction-campaign.SC-h9c -->
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

* <campaign_3> is published and titled <title>.
* admin(holds the auction catalogue grant) is on the Campaigns page.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | September Slabs (any title of 1 to 200 characters) |
| `<new copy>` | A revised cover line (any copy up to 4,000 characters, different from the copy on file) |

**Steps:**

1. Open <campaign_3>.
2. Change the copy to <new copy>.
3. Save the edit.
4. Read the stored copy.
5. Read the stored title.
6. Read the stored status.

**Expected Results:**

* Step 4 shows the copy stored as <new copy>.
* Steps 5 and 6 show the title and status unchanged.

<!-- trace:case id=g10adm.auction-campaign.TC-esv rev=1 covers=g10adm.auction-campaign.SC-1xm,g10adm.auction-campaign.SC-h9c -->
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

* <campaign_1> is a draft with a title.
* admin(holds the auction catalogue grant) is on the Campaigns page.

**Steps:**

1. Open <campaign_1>.
2. Clear the title.
3. Save the edit.
4. Read the stored title.

**Expected Results:**

* Step 3 refuses the write that clears the title.
* Step 4 shows the stored title unchanged.

---

## grade10-admin-auction-campaign-US5: Operator calls a campaign off

**As an** auction operator,
**I want** to cancel a campaign in any open state and have its listings cancelled with it,
**so that** a called-off event leaves nothing live and nothing more to do.

<!-- trace:case id=g10adm.auction-campaign.TC-x3q rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
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

* <campaign_3> is published with <listing_2> and <listing_3> published under it.
* admin(holds the grant to call a campaign off) is on the Campaigns page.

**Steps:**

1. Open <campaign_3>.
2. Cancel the campaign.
3. Read <campaign_3>'s state.
4. Read <listing_2>'s state.
5. Read <listing_3>'s state.

**Expected Results:**

* Step 3 shows <campaign_3> moved to canceled.
* Both listing reads show canceled under the listing cancel rules.

<!-- trace:case id=g10adm.auction-campaign.TC-7ck rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
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

**Pre-conditions:**

* admin(holds the grant to call a campaign off) is on the Campaigns page.

**Test data:**

| `<campaign>` | Starting state |
| --- | --- |
| A campaign with no listings | draft |
| A campaign with no listings | created |

**Steps:**

1. Open <campaign>.
2. Cancel the campaign.
3. Read its state.

**Expected Results:**

* Step 3 shows <campaign> moved to canceled.

<!-- trace:case id=g10adm.auction-campaign.TC-s0x rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
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

* <campaign_4> is canceled.
* admin(holds the grant to call a campaign off) is on the Campaigns page.

**Steps:**

1. Open <campaign_4>.
2. Cancel the campaign.
3. Change its title.
4. Save the edit.
5. Read its state.
6. Read its title.

**Expected Results:**

* Step 2 refuses the cancel; step 5 still shows canceled.
* Step 4 refuses the title write; the title stays unchanged.

<!-- trace:case id=g10adm.auction-campaign.TC-52j rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
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

* <campaign_4> is canceled.
* admin(holds the auction catalogue grant) is on the Campaigns page.

**Steps:**

1. Open <campaign_4>.
2. Read the title.
3. Read the copy.
4. Read the actions offered.

**Expected Results:**

* Steps 2 and 3 show the stored title and copy.
* Create, publish, edit save and cancel are not offered.

<!-- trace:case id=g10adm.auction-campaign.TC-okx rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
### grade10-admin-auction-campaign-US5-TC5-1: Unauthorized campaign cancel is refused

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

* <campaign_1> is a draft.
* admin(signed in, may not call a campaign off) is on the Campaigns page.

**Steps:**

1. Open <campaign_1>.
2. Cancel the campaign.
3. Read its state.

**Expected Results:**

* Step 2 refuses the unauthorized cancel.
* Step 3 still shows the campaign as a draft.
