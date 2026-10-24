# grade10-admin/auction/campaign Test Cases

**Status:** pending-review · 0/15
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<campaigns url>` is the Auction Campaigns page of the Grade10 admin console of the environment under test; a campaign's editor opens from its row. `<auction url>` is the Grade10 auction catalogue.

## Walk 1: Take one campaign from new to cancelled

Starting state:

- admin(holds the auction catalogue grant and the grant to call a campaign off) is in the admin console's Auction area.

Shared test data:

| Field | Value |
| --- | --- |
| title | September Slabs (any title of 1 to 200 characters) |

### Route

1. Open the catalogue-cover section and read its tab and heading.
   - Both read Campaigns, not Sales. `g10adm.auction-campaign.US1-TC1`
2. Start a new campaign and read its fields and actions.
   - The editor is named a Campaign, its title and copy are empty, and it offers neither Create nor Publish. `g10adm.auction-campaign.US2-TC1`
   - The editor is named a Campaign, not a Sale. `g10adm.auction-campaign.US1-TC1`
3. Enter `<title>`, leave the copy empty, open the campaign, then open `<auction url>`.
   - The campaign is a draft titled `<title>`, and the catalogue shows no cover for it. `g10adm.auction-campaign.US2-TC2`
4. Reopen the campaign and read its actions.
   - It offers Create and Cancel, not Publish. `g10adm.auction-campaign.US2-TC3`
5. Select Create, read the state, then open `<auction url>`.
   - The campaign reads created, and the catalogue still shows no cover for it. `g10adm.auction-campaign.US3-TC1`
6. Reopen the campaign and read its actions.
   - It offers Publish and Cancel, not Create. `g10adm.auction-campaign.US3-TC2`
7. Select Cancel and read the state.
   - The campaign reads cancelled. `g10adm.auction-campaign.US5-TC2`
8. Reopen the campaign and read it.
   - It shows its title and copy, and offers no Create, Publish, Save or Cancel. `g10adm.auction-campaign.US5-TC4`

## g10adm.auction-campaign.US1: Operator finds the catalogue cover called a campaign

**As an** auction operator,
**I want** the catalogue cover called Campaign everywhere in the admin,
**so that** I never mistake a cover for store checkout or sold stock.

<!-- trace:case id=g10adm.auction-campaign.TC-1bi rev=1 covers=g10adm.auction-campaign.SC-0ir,g10adm.auction-campaign.SC-qeg -->
### g10adm.auction-campaign.US1-TC1: The section and the editor call the cover a campaign

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-01

**Pre-conditions:**

* admin(holds the auction catalogue grant) is in the admin console's Auction area; `<campaign_1>` is a draft.

**Steps:**

1. Open the catalogue-cover section and read its tab and heading.
2. Open `<campaign_1>` and read the editor's heading.

**Expected Results:**

* Step 1 reads Campaigns, not Sales.
* Step 2 names the editor a Campaign, not a Sale.

---

## g10adm.auction-campaign.US2: Operator opens a campaign as a draft

**As an** auction operator,
**I want** to start a campaign with a title and optional copy that no collector can see yet,
**so that** I can prepare an event before anything is public.

<!-- trace:case id=g10adm.auction-campaign.TC-khb rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
### g10adm.auction-campaign.US2-TC1: A new campaign opens empty and offers no Create

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`.

**Steps:**

1. Start a new campaign and read the title, the copy and the actions offered.

**Expected Results:**

* The title and copy are empty.
* Neither Create nor Publish is offered until a draft exists.

<!-- trace:case id=g10adm.auction-campaign.TC-ppt rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
### g10adm.auction-campaign.US2-TC2: A titled draft stays off the public catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | September Slabs (any title of 1 to 200 characters) |

**Steps:**

1. Start a new campaign, enter `<title>`, leave the copy empty, and open it.
2. Read the stored campaign.
3. Open `<auction url>` and read the covers.

**Expected Results:**

* Step 2 shows a draft titled `<title>`.
* Step 3 shows no cover for it.

<!-- trace:case id=g10adm.auction-campaign.TC-o3t rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
### g10adm.auction-campaign.US2-TC3: A draft campaign offers Create and Cancel, never Publish

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`; `<campaign_1>` is a draft titled `<title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | September Slabs |

**Steps:**

1. Open `<campaign_1>` and read the title, the copy and the actions.

**Expected Results:**

* The stored title and copy show.
* Create and Cancel are offered; Publish is not.

---

## g10adm.auction-campaign.US3: Operator takes a campaign from draft to published

**As an** auction operator,
**I want** to create a draft and then publish it as a public cover without publishing the listings under it,
**so that** the event is announced while each lot publishes on its own.

<!-- trace:case id=g10adm.auction-campaign.TC-bkn rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
### g10adm.auction-campaign.US3-TC1: A created campaign stays off the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-03

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`; `<campaign_1>` is a draft.

**Steps:**

1. Open `<campaign_1>`, select Create and read its state.
2. Open `<auction url>` and read the covers.

**Expected Results:**

* Step 1 reads created.
* Step 2 shows no cover for `<campaign_1>`.

<!-- trace:case id=g10adm.auction-campaign.TC-a8a rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
### g10adm.auction-campaign.US3-TC2: A created campaign offers Publish and Cancel, never Create

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-03

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`; `<campaign_2>` is created.

**Steps:**

1. Open `<campaign_2>` and read the title, the copy and the actions.

**Expected Results:**

* The stored title and copy show.
* Publish and Cancel are offered; Create is not.

---

## g10adm.auction-campaign.US4: Operator edits a campaign's cover

**As an** auction operator,
**I want** to change a campaign's title and copy while it is open,
**so that** the public cover stays right without recreating the event.

<!-- trace:case id=g10adm.auction-campaign.TC-4lv rev=1 covers=g10adm.auction-campaign.SC-1xm,g10adm.auction-campaign.SC-h9c -->
### g10adm.auction-campaign.US4-TC1: A published campaign's copy can change

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-04

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`; `<campaign_3>` is published, titled `<title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | September Slabs |
| `<new copy>` | Graded slabs from the September intake (any copy up to 4,000 characters, unlike the copy on file) |

**Steps:**

1. Open `<campaign_3>`, change the copy to `<new copy>` and save.
2. Reload and read the copy, title and status.

**Expected Results:**

* Step 2 reads `<new copy>`, with the title and status unchanged.

<!-- trace:case id=g10adm.auction-campaign.TC-esv rev=1 covers=g10adm.auction-campaign.SC-1xm,g10adm.auction-campaign.SC-h9c -->
### g10adm.auction-campaign.US4-TC2: Clearing a campaign's title is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-04

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`; `<campaign_1>` is a draft with a title.

**Steps:**

1. Open `<campaign_1>`, clear the title and save.
2. Reload and read the title.

**Expected Results:**

* Step 1 refuses the write.
* Step 2 shows the title unchanged.

---

## g10adm.auction-campaign.US5: Operator calls a campaign off

**As an** auction operator,
**I want** to cancel a campaign in any open state and have its listings cancelled with it,
**so that** a called-off event leaves nothing live and nothing more to do.

<!-- trace:case id=g10adm.auction-campaign.TC-7ck rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
### g10adm.auction-campaign.US5-TC2: A campaign with no listings is cancelled from draft or created

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* admin(holds the grant to call a campaign off) is on `<campaigns url>`; `<campaign>` has no listings and is `<state>`.

**Test data:**

| `<state>` |
| --- |
| draft |
| created |

**Steps:**

1. Open `<campaign>`, select Cancel and read its state.

**Expected Results:**

* It reads cancelled.

<!-- trace:case id=g10adm.auction-campaign.TC-52j rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
### g10adm.auction-campaign.US5-TC4: A cancelled campaign opens read-only

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`; `<campaign_4>` is cancelled.

**Steps:**

1. Open `<campaign_4>` and read the title, the copy and the actions.

**Expected Results:**

* The stored title and copy show.
* Create, Publish, Save and Cancel are not offered.

## Ungrouped

### g10adm.auction-campaign.US2: Operator opens a campaign as a draft

<!-- trace:case id=g10adm.auction-campaign.TC-qn0 rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
#### g10adm.auction-campaign.US2-TC4: Opening a campaign without a title is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`.

**Steps:**

1. Start a new campaign, leave the title empty and open it.
2. Read the Campaigns list.

**Expected Results:**

* Step 1 refuses the open.
* Step 2 lists no new campaign.

<!-- trace:case id=g10adm.auction-campaign.TC-e8o rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
#### g10adm.auction-campaign.US2-TC5: Opening a campaign without the grant is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(may not catalogue a campaign) is on `<campaigns url>`.

**Steps:**

1. Open a new campaign, if anything allows it.
2. Read the Campaigns list.

**Expected Results:**

* Step 1 is not offered, or is refused.
* Step 2 lists no new campaign.

### g10adm.auction-campaign.US3: Operator takes a campaign from draft to published

<!-- trace:case id=g10adm.auction-campaign.TC-qvp rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
#### g10adm.auction-campaign.US3-TC4: Create and Publish are refused out of turn

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
* **Trace:** grade10-admin-auction-campaign-US-03

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on `<campaigns url>`; `<campaign>` is `<state>`.

**Test data:**

| `<state>` | `<action>` |
| --- | --- |
| created | Create it again |
| draft | Publish it |
| published | Publish it again |

**Steps:**

1. Open `<campaign>` and `<action>`, if offered.
2. Read its state.

**Expected Results:**

* Step 1 is not offered, or is refused.
* Step 2 still reads `<state>`.

<!-- trace:case id=g10adm.auction-campaign.TC-z1p rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
#### g10adm.auction-campaign.US3-TC3: Publishing a created campaign covers its unpublished lots

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-03

**Retirement:** Covered at domain: `g10adm.auction-dmn.US1-TC1`; a published cover with its unpublished lots off the catalogue is walked there

**Pre-conditions:**

* <campaign_2> is created, with <listing_1> under it and not published.

**Steps:**

1. Publish <campaign_2> and open the catalogue.

**Expected Results:**

* <campaign_2> shows as a public cover; <listing_1> stays off the catalogue.

### g10adm.auction-campaign.US5: Operator calls a campaign off

<!-- trace:case id=g10adm.auction-campaign.TC-s0x rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
#### g10adm.auction-campaign.US5-TC3: A cancelled campaign refuses a second cancel and a title edit

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* admin(holds the grant to call a campaign off) is on `<campaigns url>`; `<campaign_4>` is cancelled.

**Steps:**

1. Open `<campaign_4>` and select Cancel, if offered.
2. Change the title and save, if offered.
3. Reload and read the state and title.

**Expected Results:**

* Steps 1 and 2 are not offered, or are refused.
* Step 3 still reads cancelled, with the title unchanged.

<!-- trace:case id=g10adm.auction-campaign.TC-okx rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
#### g10adm.auction-campaign.US5-TC5: Cancelling without the grant is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* admin(may not call a campaign off) is on `<campaigns url>`; `<campaign_1>` is a draft.

**Steps:**

1. Open `<campaign_1>` and select Cancel, if offered.
2. Read its state.

**Expected Results:**

* Step 1 is not offered, or is refused.
* Step 2 still reads draft.

<!-- trace:case id=g10adm.auction-campaign.TC-x3q rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
#### g10adm.auction-campaign.US5-TC1: Cancelling a published campaign cancels its listings

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05

**Retirement:** Covered at domain: `g10adm.auction-dmn.US2-TC1`; a cancelled campaign's listings are walked there

**Pre-conditions:**

* <campaign_3> is published with <listing_2> and <listing_3> published under it.

**Steps:**

1. Cancel <campaign_3>.

**Expected Results:**

* <campaign_3> and both listings read cancelled.

## Reconciliation

- **Covered at domain** — a created campaign publishes as a public cover and its unpublished lots stay off the catalogue, walked by `g10adm.auction-dmn.US1-TC1`
- **Covered at domain** — cancelling a published campaign cancels the listings under it, walked by `g10adm.auction-dmn.US2-TC1`
