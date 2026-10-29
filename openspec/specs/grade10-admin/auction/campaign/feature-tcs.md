# grade10-admin/auction/campaign Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* Campaigns is a section of the admin console's Auction area; a campaign's editor opens from its row. A campaign is a draft, then created, then published, or cancelled from any of them. `<g10url>/auction` is the Grade10 catalogue.
* An operator holding the auction catalogue grant writes campaigns; calling one off needs its own grant.

## Walk 1: Take one campaign from new to cancelled

Starting state:

- admin(holds the auction catalogue grant and the grant to call a campaign off) is in the admin console's Auction area.

Shared test data:

| Field | Value |
| --- | --- |
| title | September Slabs |

### Route

1. Open the Campaigns section and start a new campaign.
   - Campaigns, never Sales; the editor named a Campaign, empty, offering neither Create nor Publish. `g10adm.auction-campaign.US1-TC1`
2. Enter `<title>`, open the campaign, and open `<g10url>/auction`.
   - A draft titled `<title>`, offering Create and Cancel; no cover on the catalogue. `g10adm.auction-campaign.US2-TC1`
3. Select Create, and open `<g10url>/auction`.
   - Created, offering Publish and Cancel; still no cover. `g10adm.auction-campaign.US3-TC1`
4. Select Cancel, and reopen it.
   - Cancelled, read-only. `g10adm.auction-campaign.US5-TC4`

## g10adm.auction-campaign.US1: Operator finds the catalogue cover called a campaign

**As an** auction operator,
**I want** the catalogue cover called Campaign everywhere in the admin,
**so that** I never mistake a cover for store checkout or sold stock.

<!-- trace:case id=g10adm.auction-campaign.TC-1bi rev=2 covers=g10adm.auction-campaign.SC-0ir,g10adm.auction-campaign.SC-qeg -->
### g10adm.auction-campaign.US1-TC1: The section and the editor call the cover a campaign

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-01

**Pre-conditions:**

* admin(holds the auction catalogue grant) is in the Auction area; a draft campaign exists.

**Steps:**

1. Read the section's tab and heading, then open the draft and read the editor's heading.

**Expected Results:**

* Each reads Campaign or Campaigns, never Sale or Sales.

---

## g10adm.auction-campaign.US2: Operator opens a campaign as a draft

**As an** auction operator,
**I want** to start a campaign with a title and optional copy that no collector can see yet,
**so that** I can prepare an event before anything is public.

<!-- trace:case id=g10adm.auction-campaign.TC-khb rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
### g10adm.auction-campaign.US2-TC1: A campaign opens empty, becomes a titled draft offering Create and Cancel, and stays off the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on Campaigns.

**Steps:**

1. Start a new campaign and read its fields and actions.
2. Enter September Slabs, leave the copy empty, and open it.
3. Reopen it and read its fields and actions; open `<g10url>/auction`.

**Expected Results:**

* Step 1: title and copy empty; neither Create nor Publish offered.
* Step 3: a draft titled September Slabs, offering Create and Cancel, not Publish; no cover for it on the catalogue.

<!-- trace:case id=g10adm.auction-campaign.TC-qn0 rev=1 covers=g10adm.auction-campaign.SC-gzn,g10adm.auction-campaign.SC-coz,g10adm.auction-campaign.SC-9bl,g10adm.auction-campaign.SC-vz3,g10adm.auction-campaign.SC-5pd -->
### g10adm.auction-campaign.US2-TC4: A campaign without a title, or by an operator without the grant, is not opened

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
* **Trace:** grade10-admin-auction-campaign-US-02

**Pre-conditions:**

* `<operator>` is on Campaigns.

**Test data:**

| `<operator>` | `<title>` |
| --- | --- |
| admin(holds the auction catalogue grant) | Empty |
| admin(may not catalogue a campaign) | September Slabs |

**Steps:**

1. Start a new campaign with `<title>` and open it, if offered.
2. Read the Campaigns list.

**Expected Results:**

* Step 1 is not offered, or is refused; step 2 lists no new campaign.

---

## g10adm.auction-campaign.US3: Operator takes a campaign from draft to published

**As an** auction operator,
**I want** to create a draft and then publish it as a public cover without publishing the listings under it,
**so that** the event is announced while each lot publishes on its own.

<!-- trace:case id=g10adm.auction-campaign.TC-bkn rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
### g10adm.auction-campaign.US3-TC1: A created campaign offers Publish and Cancel and stays off the catalogue

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

* admin(holds the auction catalogue grant) is on draft `<campaign>`'s editor.

**Steps:**

1. Select Create, and read its state, fields and actions.
2. Open `<g10url>/auction`.

**Expected Results:**

* Step 1 reads created, with the stored title and copy, offering Publish and Cancel, not Create.
* Step 2 shows no cover for `<campaign>`.

<!-- trace:case id=g10adm.auction-campaign.TC-qvp rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i -->
### g10adm.auction-campaign.US3-TC4: Create and Publish are refused out of turn

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

* admin(holds the auction catalogue grant) is on `<campaign>`'s editor; it is `<state>`.

**Test data:**

| `<state>` | `<action>` |
| --- | --- |
| created | Create it again |
| draft | Publish it |
| published | Publish it again |

**Steps:**

1. `<action>`, if offered, and read its state.

**Expected Results:**

* The action is not offered, or is refused; it still reads `<state>`.

---

## g10adm.auction-campaign.US4: Operator edits a campaign's cover

**As an** auction operator,
**I want** to change a campaign's title and copy while it is open,
**so that** the public cover stays right without recreating the event.

<!-- trace:case id=g10adm.auction-campaign.TC-4lv rev=2 covers=g10adm.auction-campaign.SC-1xm,g10adm.auction-campaign.SC-h9c -->
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

* admin(holds the auction catalogue grant) is on published `<campaign>`'s editor, titled September Slabs.

**Steps:**

1. Change the copy to "Graded slabs from the September intake" and save.
2. Reload.

**Expected Results:**

* Step 2 reads the new copy, the title and status unchanged.

<!-- trace:case id=g10adm.auction-campaign.TC-esv rev=1 covers=g10adm.auction-campaign.SC-1xm,g10adm.auction-campaign.SC-h9c -->
### g10adm.auction-campaign.US4-TC2: Clearing a campaign's title is refused

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-04

**Pre-conditions:**

* admin(holds the auction catalogue grant) is on draft `<campaign>`'s editor.

**Steps:**

1. Clear the title and save; reload.

**Expected Results:**

* The save is refused, and the title is unchanged.

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
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* admin(holds the grant to call a campaign off) is on `<campaign>`'s editor; it has no listings and is `<state>`.

**Test data:**

| `<state>` |
| --- |
| draft |
| created |

**Steps:**

1. Select Cancel and read its state.

**Expected Results:**

* It reads cancelled.

<!-- trace:case id=g10adm.auction-campaign.TC-52j rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
### g10adm.auction-campaign.US5-TC4: A cancelled campaign is read-only and refuses every write

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

* admin(holds the auction catalogue grant and the grant to call a campaign off) is on Campaigns; `<campaign>` is cancelled.

**Steps:**

1. Open `<campaign>` and read its fields and actions.
2. Select Cancel and change the title, if offered; reload.

**Expected Results:**

* Step 1 shows its title and copy, and offers no Create, Publish, Save or Cancel.
* Step 2 is not offered, or is refused; it still reads cancelled, title unchanged.

<!-- trace:case id=g10adm.auction-campaign.TC-okx rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6 -->
### g10adm.auction-campaign.US5-TC5: Cancelling without the grant is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05

**Pre-conditions:**

* admin(may not call a campaign off) is on draft `<campaign>`'s editor.

**Steps:**

1. Select Cancel, if offered, and read its state.

**Expected Results:**

* Cancel is not offered, or is refused; it still reads draft.

---

## Reconciliation

- **Covered at domain** - a created campaign publishes as a public cover while its unpublished lots stay off the catalogue, walked by `g10adm.auction-dmn.US1-TC1`
- **Covered at domain** - cancelling a published campaign cancels the listings under it, walked by `g10adm.auction-dmn.US2-TC1`
