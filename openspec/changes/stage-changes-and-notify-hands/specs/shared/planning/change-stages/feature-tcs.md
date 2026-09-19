# shared/planning/change-stages Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-19, tcs-rules r3.0

**Out of suite:**

- `shared-planning-change-stages-SC-01` — the manual's derivation tests: every rung of the stage table, read from a tree no person walks.
- `shared-planning-change-stages-SC-02` — the manual's derivation tests: a proof landing out of order.
- `shared-planning-change-stages-SC-04` — the manual's derivation tests: the four lanes as a projection of the eight stages.
- `shared-planning-change-stages-SC-06` — the manual's derivation tests: the three files completing Proposed without moving it.
- `shared-planning-change-stages-SC-27` — the manual's derivation tests: a read record whose content id matches the tree.
- `shared-planning-change-stages-SC-28` — the manual's derivation tests: an artifact with no read record.
- `shared-planning-change-stages-SC-29` — the manual's derivation tests: what is upstream of nothing, unlinked or waived.

## shared-planning-change-stages-US1: Teammate learns a change has reached their hand

**As a** teammate named as a change's hand,
**I want** to be told once, in Slack, when the change reaches my stage, with the command to paste,
**so that** I start the day it lands rather than the day I happen to look.

### shared-planning-change-stages-US1-TC1-1: Stage landing tells the hand once

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
admin(engineer) is named as the `dev` hand on <change A>, which sits at Specified. The team map knows <dev handle> and its Slack member. <change A> has a thread in <planning channel>.

**Steps:**

1. Land <change A>'s `tasks.md` on `main`.
2. Read <dev handle>'s Slack direct messages.
3. Open <change A> at <manual change page url>.

**Expected Results:**

* One direct message names <change A>, the stage Planned and links its thread.
* The message carries the command to paste as text.
* The change page shows Planned with <dev handle> as the hand.

### shared-planning-change-stages-US1-TC2-1: Decisions and journeys tell the designer and the tech PIC

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
<change B> has only `proposal.md` on `main` and is on admin(product manager). Its `hands:` names <design handle> and <tech handle>, both known to the team map.

**Steps:**

1. Land <change B>'s `decisions.md`, `user-journeys.md`, its marked page lines and `hands:` in one push to `main`.
2. Read <design handle>'s direct messages.
3. Read <tech handle>'s direct messages.
4. Open <change B>'s card at <manual board url>.

**Expected Results:**

* Each of the two hands holds one message naming <change B>, Proposed and the thread.
* The card names the designer and the tech PIC as the hands, not the product manager.
* No message reaches <pm handle> for that move.

### shared-planning-change-stages-US1-TC3-1: A stage told once per entry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
<change A> reached Planned on `tasks.md`, and <dev handle>, its `dev` hand, was told once.

**Test data:**

| What happens next | <dev handle>'s direct messages |
| --- | --- |
| A later push leaves <change A> in Planned with the same engineer | hold one Your turn message for Planned |
| The push workflow is re-run by hand for the same push | hold one Your turn message for Planned |
| `tasks.md` is reverted off `main`, dropping the change to Specified, and lands again | hold a second Your turn message for Planned |

**Steps:**

1. Let <what happens next> happen on `main`.
2. Read <dev handle>'s direct messages.
3. Open <change A>'s card at <manual board url>.

**Expected Results:**

* <dev handle>'s direct messages read as the row states.
* The card sits in Planned.

### shared-planning-change-stages-US1-TC4-1: An unnamed hand is told in the role's channel

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
<change C>'s `hands:` names no `design` handle. The team map names a channel for the designer role.

**Steps:**

1. Land <change C>'s `decisions.md`, `user-journeys.md` and marked page lines on `main`.
2. Read the designer role's channel.
3. Read the direct messages of every handle in the team map.

**Expected Results:**

* One post in the designer role's channel names <change C>, the stage and the thread.
* No direct message is sent for that move.

### shared-planning-change-stages-US1-TC5-1: One push moving two changes tells each hand once

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
<change A> sits at Specified with <dev handle> as its engineer. <change D> sits at Designed with <pm handle> as its product manager. Both have a thread.

**Steps:**

1. Land <change A>'s `tasks.md` and <change D>'s `spec.md` and `feature-tcs.md` in one push to `main`.
2. Read <dev handle>'s and <pm handle>'s direct messages.
3. Read <planning channel>.

**Expected Results:**

* Each hand holds one message, for its own change only.
* One channel post names both changes and the stage each moved into.

### shared-planning-change-stages-US1-TC6-1: Weekly digest lists questions, idle, behind and waiting

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
admin(product manager) <pm handle> holds <change B> at its current stage, owes two ❓ decisions rows on it, holds <change E> idle 9 days, owes the artifact <change M> waits on, is the hand of one behind artifact, and holds <change F>, which the release of its dependency has just freed.

**Steps:**

1. Let the weekly digest run on Monday 09:00 on the Hong Kong clock.
2. Read <pm handle>'s direct messages.

**Expected Results:**

* One direct message lists what is on them now, their open questions, their idle, behind and waiting changes, and <change F> as freed by a dependency.
* Each change in it links its thread and its change page.

### shared-planning-change-stages-US1-TC7-1: A digest with nothing to say is not sent

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
<release handle> is in the team map, is the hand of no change's current stage, owes no open question, and has no idle, behind or waiting change.

**Steps:**

1. Let the weekly digest run on Monday morning.
2. Read <release handle>'s direct messages.
3. Read <pm handle>'s direct messages.

**Expected Results:**

* No digest reaches <release handle>.
* <pm handle>'s digest arrives as usual.

### shared-planning-change-stages-US1-TC8-1: Staging tells the release hand its turn

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
<change R> is at Building with every task box ticked. <qa handle> is its `qa` hand and <release handle> its `release` hand, both known to the team map. <change R> has a thread.

**Steps:**

1. Land `deployed_env: staging` for <change R> on `main`.
2. Read <release handle>'s direct messages.
3. Read <qa handle>'s direct messages.

**Expected Results:**

* <release handle> holds one Your turn message naming <change R>, the stage On staging and the thread.
* <qa handle> holds one staging message naming <change R> and the run sheet.
* Each of the two holds one message for that move, not two.

### shared-planning-change-stages-US1-TC9-1: A build push tells nobody and the channel still reads it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
<change A> sits at Planned with <dev handle> as its `dev` hand, told once when `tasks.md` landed.

**Steps:**

1. Push a commit to `main` ticking <change A>'s first task box.
2. Read the direct messages of every handle in the team map.
3. Read <planning channel>.

**Expected Results:**

* No direct message is sent for that push.
* The channel post names <change A> and the stage Building.

### shared-planning-change-stages-US1-TC10-1: A change with no thread links its change page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
<change S> sits at Specified with <dev handle> as its `dev` hand. Its record names no thread.

**Steps:**

1. Land <change S>'s `tasks.md` on `main`.
2. Read <dev handle>'s direct messages.
3. Open the link the message carries.

**Expected Results:**

* One direct message names <change S> and the stage Planned.
* The link it carries is <change S>'s change page, and no thread's.
* The link opens <change S> at <manual change page url>.

### shared-planning-change-stages-US1-TC11-1: A handle the map gives no Slack member is sent nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-01

**Pre-conditions:**
<change T> sits at Specified. Its `hands:` names <memberless handle> as its `dev` hand, and the team map holds that handle with its roles and no Slack member.

**Steps:**

1. Land <change T>'s `tasks.md` on `main`.
2. Read the direct messages of every handle in the team map.
3. Read the engineer role's channel.
4. Read the push workflow's run log.

**Expected Results:**

* No direct message is sent for that move.
* No post reaches the engineer role's channel: the hand is named, so the role is not asked for one.
* The run log names <change T> and <memberless handle> as told nothing, and the run does not fail.

---

## shared-planning-change-stages-US2: Product manager reads where every change stands

**As a** product manager,
**I want** the board to show each change in the one stage its files prove, with the hand it waits on,
**so that** I see what is stuck and on whom without asking anyone.

### shared-planning-change-stages-US2-TC1-1: Eight lanes, one stage per change

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-02

**Pre-conditions:**
admin(product manager) has one change in each of the eight stages, each with its `hands:` on `main`.

**Steps:**

1. Navigate to <manual board url>.
2. Read the lane headings in order.
3. Read one card in each lane.

**Expected Results:**

* The lanes read Proposed, Designed, Specified, Planned, Building, On staging, Released, Archived in that order.
* Each change appears in one lane only.
* Each card names its hand, its age and its task bar.

### shared-planning-change-stages-US2-TC2-1: Drafted lanes carry the agent mark and the hand's move

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-02

**Pre-conditions:**
One change sits in each of Proposed, Designed, Specified, Planned, Building, On staging, Released and Archived.

**Steps:**

1. Navigate to <manual board url>.
2. Read the headings of Proposed to Building.
3. Read the headings of On staging to Archived.

**Expected Results:**

* Each of the five headings carries the agent mark and the hand's move as text.
* The three later headings carry neither.
* A reader tells the agent's draft from the hand's move without colour.

### shared-planning-change-stages-US2-TC3-1: Idle chip at the day bounds and the shelf at 30

Runs once per row of **Test data**.

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
* **Trace:** shared-planning-change-stages-US-02

**Pre-conditions:**
<change E> is at Building, and its last tick, claim and artifact landing are all <days> ago.

**Test data:**

| Days since the last tick, claim or artifact landing | The card shows |
| --- | --- |
| 6 days | no idle chip |
| 7 days | a red idle chip reading 7 days |
| 29 days | a red idle chip reading 29 days, in the Building lane |
| 30 days | the shelf, and no card in the Building lane |

**Steps:**

1. Push a repository-wide commit that touches every change's directory.
2. Navigate to <manual board url>.
3. Open the shelf.

**Expected Results:**

* <change E> shows what the row states.
* The repository-wide commit moves no change's day count.

### shared-planning-change-stages-US2-TC4-1: Blocked and the suite sit beside the stage

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
* **Trace:** shared-planning-change-stages-US-02

**Pre-conditions:**
<change F> is at Planned with `depends_on:` naming a change not yet released and a `draft` suite. <change G> is at Planned with an approved suite.

**Steps:**

1. Navigate to <manual board url>.
2. Read <change F>'s card.
3. Read <change G>'s card.

**Expected Results:**

* <change F> carries a blocked chip naming the change it waits for and a suite chip reading draft.
* <change G>'s suite chip reads approved.
* Neither card carries a chip outside the five overlays.
* Both cards stay in the Planned lane.

### shared-planning-change-stages-US2-TC5-1: Each filter narrows the board

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-02

**Pre-conditions:**
The board holds a change whose current stage names <pm handle>, one with a wait, one idle 9 days, one with a behind artifact, one blocked on an unreleased change, and one with none of the five.

**Test data:**

| Filter | The lanes keep |
| --- | --- |
| Mine | changes whose current stage names <pm handle> |
| Waiting | changes carrying a wait |
| Idle | changes idle 7 days or more |
| Behind | changes with a behind artifact |
| Blocked | changes waiting on a change not yet released |

**Steps:**

1. Navigate to <manual board url>.
2. Choose <pm handle> in the handle picker.
3. Apply the <filter> filter.

**Expected Results:**

* Only the changes the row names stay in the lanes.
* The lane order and the lane headings do not change.

### shared-planning-change-stages-US2-TC6-1: Board with no change in flight

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-02

**Pre-conditions:**
No change is in flight and the archive holds none the board reads.

**Steps:**

1. Navigate to <manual board url>.
2. Read each lane heading.

**Expected Results:**

* The board says there is no change in flight.
* Each lane is collapsed to its heading with a count of zero.
* The shelf link is still reachable.

### shared-planning-change-stages-US2-TC7-1: A reverted artifact drops the change a lane

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
* **Trace:** shared-planning-change-stages-US-02

**Pre-conditions:**
<change A> sits at Planned, proven by `tasks.md` on `main`.

**Steps:**

1. Revert <change A>'s `tasks.md` off `main`.
2. Navigate to <manual board url>.
3. Open <change A> at <manual change page url>.

**Expected Results:**

* The card sits in Specified.
* The stepper shows Planned as not reached.
* The hands and the overlays on the card are unchanged.

### shared-planning-change-stages-US2-TC8-1: Change page reads artifacts, questions and who landed each

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
* **Trace:** shared-planning-change-stages-US-02

**Pre-conditions:**
<change B> is at Specified. Its `decisions.md` carries two ❓ rows, its `proposal.md` is fresh with `landed_by:` naming <pm handle>, and its `ui-design.md` is behind.

**Steps:**

1. Navigate to <manual change page url> for <change B>.
2. Read the stepper and the Your turn card.
3. Read the artifacts rows.

**Expected Results:**

* The stepper shows Specified as the current stage, and the Your turn card carries the thread link and the command.
* Each artifact row reads fresh or behind, with its open question count and the handle that landed it.
* The hands, the delivery and the handoff rows read one fact per label.

### shared-planning-change-stages-US2-TC9-1: A change whose record cannot be read

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
* **Trace:** shared-planning-change-stages-US-02

**Pre-conditions:**
admin(product manager) has <change U> on `main` with a malformed record the store cannot read, and one readable change in each other lane.

**Steps:**

1. Navigate to <manual board url>.
2. Read the Proposed lane.
3. Open <change U> at <manual change page url>.

**Expected Results:**

* <change U> sits in the Proposed lane, named as unreadable.
* Its hands show as open, one row per role.
* No lane leaves <change U> out, and no lane reads as an error.

---

## shared-planning-change-stages-US3: Teammate lists what is on them

**As a** teammate,
**I want** one page listing the changes on me now and the ones that are mine later,
**so that** a free afternoon starts on the right change.

### shared-planning-change-stages-US3-TC1-1: My turn lists questions, then now, then later

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
* **Trace:** shared-planning-change-stages-US-03

**Pre-conditions:**
admin(designer) <design handle> is addressed by two ❓ rows, is the hand of <change B> at its current stage, and is named as the `design` hand on <change R>, which is at Building.

**Steps:**

1. Navigate to <manual my turn url>.
2. Choose <design handle> in the handle picker.
3. Read the page from the top.

**Expected Results:**

* The open questions addressed to <design handle> come first, each with its change and its question id.
* The changes whose current stage names <design handle> come next.
* The changes that are theirs at a later stage come last.

### shared-planning-change-stages-US3-TC2-1: Handle is chosen once per browser

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-03

**Pre-conditions:**
No handle has been chosen in this browser.

**Steps:**

1. Navigate to <manual my turn url>.
2. Choose <qa handle> in the handle picker.
3. Navigate to <manual board url> and apply the Mine filter.

**Expected Results:**

* Before a handle is chosen the page asks for one and lists no change.
* After Step 2 the page lists what is on <qa handle>.
* The Mine filter uses <qa handle> without asking again.

### shared-planning-change-stages-US3-TC3-1: A handle the team map does not know

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
* **Trace:** shared-planning-change-stages-US-03

**Pre-conditions:**
<unknown handle> is in no team map entry and on no change's `hands:`.

**Steps:**

1. Navigate to <manual my turn url>.
2. Choose <unknown handle> in the handle picker.

**Expected Results:**

* The page says the team map does not know the handle.
* No change and no open question is listed.

### shared-planning-change-stages-US3-TC4-1: My turn with nothing on the reader

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-03

**Pre-conditions:**
<release handle> is in the team map, is on no change now or later, and is addressed by no ❓ row.

**Steps:**

1. Navigate to <manual my turn url>.
2. Choose <release handle> in the handle picker.

**Expected Results:**

* The page says nothing is on them.
* The per-role Pending page is still reachable from it.

---

## shared-planning-change-stages-US4: Product manager names the hands on a change

**As a** product manager closing the interview,
**I want** to name who takes each hand on the change,
**so that** the next hand is told instead of found.

### shared-planning-change-stages-US4-TC1-1: Hands written at the interview's end show on every surface

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
* **Trace:** shared-planning-change-stages-US-04

**Pre-conditions:**
admin(product manager) holds <change J> at Proposed with no `hands:`. The team map knows <pm handle>, <design handle>, <tech handle>, <dev handle>, <qa handle> and <release handle>.

**Steps:**

1. Write `hands:` in <change J>'s record, one handle per role.
2. Push to `main`.
3. Open <change J> at <manual change page url>.
4. Read <change J>'s card at <manual board url>.

**Expected Results:**

* The hands table lists one handle per role, product manager to release hand.
* The card names the hand of the current stage.
* Each handle shows the Slack member the team map gives it.

### shared-planning-change-stages-US4-TC2-1: Assign writes locally and reads on the hosted manual

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-04

**Pre-conditions:**
The manual runs locally at <local manual url> and hosted at <hosted manual url>. <change J>'s `hands:` names no `qa` handle.

**Steps:**

1. Open <change J> at <local manual url> and assign <qa handle> to QA.
2. Push the written record to `main`.
3. Open <change J> at <hosted manual url>.

**Expected Results:**

* Step 1 writes the QA handle into <change J>'s record.
* The hosted page shows the hands read-only and offers no Assign.
* The hosted page shows <qa handle> once the record is on `main`.

### shared-planning-change-stages-US4-TC3-1: A hand removed shows the hand as open

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
* **Trace:** shared-planning-change-stages-US-04

**Pre-conditions:**
<change J>'s `hands:` names all six roles, and the change sits at Designed.

**Steps:**

1. Remove the `design` handle from <change J>'s `hands:`.
2. Push to `main`.
3. Read <change J>'s card at <manual board url>.
4. Read the hands table at <manual change page url>.

**Expected Results:**

* The card shows the design hand as open.
* The hands table shows the designer role with no handle.
* The other five handles are unchanged.

### shared-planning-change-stages-US4-TC4-1: A handle the team map does not know is refused

Runs once per row of **Test data**.

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
* **Trace:** shared-planning-change-stages-US-04

**Pre-conditions:**
<change K> is at Designed. <unknown handle> is in no team map entry.

**Test data:**

| Key carrying <unknown handle> | The check names |
| --- | --- |
| `hands:` under the `qa` role | the change, the role and the handle |
| `landed_by:` on `ui-design.md` | the change, the artifact and the handle |

**Steps:**

1. Write <unknown handle> into <change K>'s <key>.
2. Run the manual check.

**Expected Results:**

* The check refuses and names what the row states.
* No message is sent for <unknown handle>.

### shared-planning-change-stages-US4-TC5-1: A malformed hands record is refused

Runs once per row of **Test data**.

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
* **Trace:** shared-planning-change-stages-US-04

**Pre-conditions:**
<change K> is at Designed with a valid `hands:` on `main`.

**Test data:**

| Edit to the record | The check names |
| --- | --- |
| `hands:` written as a list of handles with no roles | the malformed `hands:` block and the change |
| `hands:` naming a role outside the six | the unknown role and the change |

**Steps:**

1. Apply <edit to the record> to <change K>.
2. Run the manual check.

**Expected Results:**

* The check refuses and names what the row states.
* The refusal names the change, not only the file.

### shared-planning-change-stages-US4-TC6-1: A hand taken off a change tells the role's channel

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-04

**Pre-conditions:**
<change J> sits at Planned with <dev handle> as its `dev` hand. The team map names a channel for the engineer role.

**Steps:**

1. Remove the `dev` handle from <change J>'s `hands:` and push to `main`.
2. Read the engineer role's channel.
3. Push a later commit to <change J> that leaves the hand open, and read the channel again.
4. Read <change J>'s card at <manual board url>.

**Expected Results:**

* One post in the engineer role's channel names <change J> and the stage it sits on.
* The later push adds no second post.
* The card shows the engineer hand as open.

---

## shared-planning-change-stages-US5: Designer says a change has no surface

**As a** designer,
**I want** to say a change draws nothing,
**so that** QA's run is not held behind a design nobody owes.

### shared-planning-change-stages-US5-TC1-1: A waiver stands for the design it names

Runs once per row of **Test data**.

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
* **Trace:** shared-planning-change-stages-US-05

**Pre-conditions:**
admin(designer) holds <change L> at Proposed, with its decisions, journeys and `hands:` on `main` and neither design landed.

**Test data:**

| What lands on the change | The change page shows |
| --- | --- |
| `ui_waived: "<why>"` and `tech-design.md` | the UI design not owed and fresh, the tech design fresh |
| `ui-design.md` and `design_waived: "<why>"` | the UI design fresh, the tech design not owed and fresh |
| `ui_waived: "<why>"` and `design_waived: "<why>"` | both designs not owed and fresh |

**Steps:**

1. Land <what lands on the change> on `main`.
2. Read <change L>'s card at <manual board url>.
3. Open <change L> at <manual change page url>.

**Expected Results:**

* The card sits in the Designed lane.
* The artifacts rows read what the row states, each waiver showing its reason.

### shared-planning-change-stages-US5-TC2-1: One waiver alone does not reach Designed

Runs once per row of **Test data**.

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
* **Trace:** shared-planning-change-stages-US-05

**Pre-conditions:**
<change L> is at Proposed with its decisions, journeys and `hands:` on `main`.

**Test data:**

| What lands on the change | The change page shows |
| --- | --- |
| `ui_waived: "<why>"` only | the tech design owed and missing |
| `tech-design.md` only | the UI design owed and missing |

**Steps:**

1. Land <what lands on the change> on `main`.
2. Read <change L>'s card at <manual board url>.
3. Read the direct messages of <change L>'s hands.

**Expected Results:**

* The card stays in the Proposed lane.
* The change page shows what the row states.
* No Designed message is sent.

### shared-planning-change-stages-US5-TC3-1: A waiver removed returns the design to owed

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
* **Trace:** shared-planning-change-stages-US-05

**Pre-conditions:**
<change L> sits at Designed on `ui_waived: "<why>"` and a landed `tech-design.md`.

**Steps:**

1. Remove `ui_waived` from <change L>'s record.
2. Push to `main`.
3. Read <change L>'s card at <manual board url>.
4. Open <change L> at <manual change page url>.

**Expected Results:**

* The card returns to the Proposed lane.
* The UI design row reads owed and missing.
* The card names the design hand.

---

## shared-planning-change-stages-US6: Teammate says what they wait on

**As a** teammate who is held up,
**I want** to write what I wait on and have it shown against the hand that owes it,
**so that** the wait is dated and nobody chases me for it.

### shared-planning-change-stages-US6-TC1-1: A wait shows dated against the hand that owes it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-06

**Pre-conditions:**
admin(engineer) holds <change M> at Building. <tech handle> is its tech PIC and owes its tech design. The team map knows both handles.

**Steps:**

1. Write one `awaiting:` line on <change M> naming the tech design, dated today.
2. Push to `main`.
3. Read <change M>'s card at <manual board url>.
4. Read <tech handle>'s direct messages.

**Expected Results:**

* The card carries an amber waiting chip with the line and its date.
* The change page shows the line against <tech handle>, the hand that owes the artifact.
* No direct message reaches <tech handle> for the wait; it is a line of Monday's digest.
* The card stays in the Building lane.

### shared-planning-change-stages-US6-TC2-1: Many waits, one line per artifact

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
* **Trace:** shared-planning-change-stages-US-06

**Pre-conditions:**
<change M> carries three `awaiting:` lines on `main`, one per artifact, each dated. <change G> carries none.

**Steps:**

1. Navigate to <manual board url>.
2. Apply the Waiting filter.
3. Open <change M> at <manual change page url>.

**Expected Results:**

* <change M> stays under the filter and <change G> drops out.
* The change page shows one waiting line per artifact, each with its date and the hand that owes it.

### shared-planning-change-stages-US6-TC3-1: A wait removed clears the chip

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-06

**Pre-conditions:**
<change M> carries one `awaiting:` line on `main`, naming the tech design <tech handle> owes.

**Steps:**

1. Remove the `awaiting:` line from <change M>.
2. Push to `main`.
3. Read <change M>'s card at <manual board url>.
4. Read <tech handle>'s direct messages.

**Expected Results:**

* The waiting chip is gone and the Waiting filter drops <change M>.
* The change stays in the Building lane.
* No message reaches <tech handle> for the wait, written or removed.

### shared-planning-change-stages-US6-TC4-1: A wait with no date shows as written

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
* **Trace:** shared-planning-change-stages-US-06

**Pre-conditions:**
<change M> sits at Building and carries one `awaiting:` line on `main` naming the tech design <tech handle> owes, written with no date.

**Steps:**

1. Navigate to <manual board url>.
2. Read <change M>'s card.
3. Open <change M> at <manual change page url>.

**Expected Results:**

* The waiting chip carries the line as written, with no date beside it.
* The change page shows the line against <tech handle>.
* <change M> stays under the Waiting filter and in the Building lane.

---

## shared-planning-change-stages-US7: Reader sees how far a promised line has come

**As a** reader of a page,
**I want** each 🚧 line to show the stage of the change delivering it,
**so that** I know how far the promise has come without leaving the page.

### shared-planning-change-stages-US7-TC1-1: A marked line wears its change's stage

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
* **Trace:** shared-planning-change-stages-US-07

**Pre-conditions:**
<manual page with a marked line> carries one 🚧 line delivered by <change N>, which sits at Building with <dev handle> as its hand.

**Steps:**

1. Navigate to <manual page with a marked line>.
2. Read the section's in-flight row.
3. Read the 🚧 line.

**Expected Results:**

* The in-flight row names <change N>, the stage Building and <dev handle>.
* The 🚧 line carries a pip with the stage number.
* The pip's hover names the change and the hand.

### shared-planning-change-stages-US7-TC2-1: A line whose change archived wears no pip

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
* **Trace:** shared-planning-change-stages-US-07

**Pre-conditions:**
<manual page with a marked line> carries a 🚧 line whose only change has archived.

**Steps:**

1. Navigate to <manual page with a marked line>.
2. Read the line and the section's in-flight row.

**Expected Results:**

* The line wears no pip.
* The in-flight row names no archived change.

### shared-planning-change-stages-US7-TC3-1: A line two changes deliver wears one stage

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-07

**Pre-conditions:**
<shared marked line> is linked by <change P> at Specified and by <change Q> at On staging.

**Steps:**

1. Navigate to the page holding <shared marked line>.
2. Read the line's pip.

**Expected Results:**

* The pip shows On staging, the further of the two stages.
* The line wears one pip, not two.

### shared-planning-change-stages-US7-TC4-1: The pip reads without colour

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-change-stages-US-07

**Pre-conditions:**
<manual page with a marked line> carries 🚧 lines from changes at three different stages.

**Steps:**

1. Navigate to <manual page with a marked line> with colour removed from the display.
2. Read each pip.
3. Read the section's in-flight row.

**Expected Results:**

* Each pip's stage number is readable with no colour.
* The pips stay legible at the line's text size.

---

## shared-planning-change-stages-US8: QA learns a change has reached staging

**As a** QA teammate,
**I want** to be told when a change reaches staging, with the run sheet,
**so that** the manual pass starts the day it deploys.

### shared-planning-change-stages-US8-TC1-1: Staging tells QA with the run sheet

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-08

**Pre-conditions:**
<change R> is at Building with every task box ticked. <qa handle> is its QA hand and the team map knows it. The run sheet exists in the store.

**Steps:**

1. Land `deployed_env: staging` for <change R> on `main`.
2. Read <qa handle>'s direct messages.
3. Read <change R>'s card at <manual board url>.

**Expected Results:**

* One direct message names <change R>, the stage On staging, and links the run sheet and its thread.
* The card sits in the On staging lane.

### shared-planning-change-stages-US8-TC2-1: Staging names the run sheet with no tab written for the change

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-08

**Pre-conditions:**
<change S> is at Building with every task box ticked, <qa handle> as its QA hand, and no tab written in the run sheet for <change S>.

**Steps:**

1. Land `deployed_env: staging` for <change S> on `main`.
2. Read <qa handle>'s direct messages.

**Expected Results:**

* The message names <change S>, the stage On staging and the run sheet.
* The message says nothing about a tab, and the thread link is shown.

### shared-planning-change-stages-US8-TC3-1: Ticked boxes alone do not reach staging

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
* **Trace:** shared-planning-change-stages-US-08

**Pre-conditions:**
<change R> is at Building with every task box ticked and no `deployed_env:` on the change.

**Steps:**

1. Navigate to <manual board url>.
2. Read <change R>'s card.
3. Read <qa handle>'s direct messages.

**Expected Results:**

* The card stays in the Building lane.
* No staging message reaches <qa handle>.

### shared-planning-change-stages-US8-TC4-1: A second staging deploy tells QA once

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-08

**Pre-conditions:**
<change R> sits at On staging and <qa handle> was told once.

**Steps:**

1. Deploy <change R> to staging again, leaving `deployed_env: staging` in place.
2. Read <qa handle>'s direct messages.

**Expected Results:**

* <qa handle> holds one staging message for <change R>, not two.
* The card stays in the On staging lane.

---

## shared-planning-change-stages-US9: Hand learns an artifact of theirs is behind

**As a** hand of an artifact,
**I want** to be told once when something before it changed after it was written,
**so that** I read it again before anything is built on it.

### shared-planning-change-stages-US9-TC1-1: The earliest behind artifact tells its hand

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-09

**Pre-conditions:**
<change T> is at Planned with `ui-design.md`, `tech-design.md`, `spec.md` and `tasks.md` on `main`, all fresh. <design handle> is the hand of `ui-design.md`.

**Steps:**

1. Land a change to the page lines <change T> links.
2. Read <design handle>'s direct messages.
3. Read <change T>'s card at <manual board url>.
4. Open <change T> at <manual change page url>.

**Expected Results:**

* One direct message names `ui-design.md` and what changed before it.
* The card carries a behind chip naming `ui-design.md` and <design handle>.
* Each behind artifact row on the change page reads behind.

### shared-planning-change-stages-US9-TC2-1: Behind twice before a re-read tells once

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-09

**Pre-conditions:**
<change T>'s `ui-design.md` is behind, <design handle> was told, and the artifact has not been read again.

**Steps:**

1. Land a second change to the page lines <change T> links.
2. Read <design handle>'s direct messages.
3. Read <change T>'s card at <manual board url>.

**Expected Results:**

* <design handle> holds one behind message for `ui-design.md`, not two.
* The behind chip still names `ui-design.md`.

### shared-planning-change-stages-US9-TC3-1: Behind holds no tick, claim or wait

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-09

**Pre-conditions:**
<change T> is at Building with `ui-design.md` behind and <dev handle> as its engineer.

**Steps:**

1. Tick a task box on <change T> and push to `main`.
2. Claim a task group on <change T> and push to `main`.
3. Write an `awaiting:` line on <change T> and push to `main`.

**Expected Results:**

* All three land, and the task bar, the claim and the waiting chip show on the card.
* The behind chip stays beside the stage.

### shared-planning-change-stages-US9-TC4-1: Archiving is refused while a delta is behind

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
* **Trace:** shared-planning-change-stages-US-09

**Pre-conditions:**
<change T> has every task box ticked, sits at Released, and carries one behind delta.

**Steps:**

1. Run the archive check on <change T>.
2. Read <change T>'s card at <manual board url>.

**Expected Results:**

* The check refuses and names the behind artifact.
* The card stays out of the Archived lane.

### shared-planning-change-stages-US9-TC5-1: Behind reaches the digest at 7 days

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-09

**Pre-conditions:**
<change T>'s `ui-design.md` has been behind for <days> and has not been read again. <design handle> is its hand.

**Test data:**

| Days the artifact has been behind | The digest |
| --- | --- |
| 6 days | does not list it |
| 7 days | lists it under behind, naming the artifact |

**Steps:**

1. Let the weekly digest run on Monday morning.
2. Read <design handle>'s direct messages.

**Expected Results:**

* The digest reads as the row states.
* The behind chip on the card is unchanged either way.

## Settled

None yet - the first blind pass.

## Reconciliation

Run: 2026-09-19, blind pass over the isolated input: the outline (Purpose and Feature set), user-journeys.md, proposal.md, decisions.md with its Raised table, ui-design.md, the Change Stages and Agent Rounds pages and the Planning index, the store context; denied every `## Requirements` section, openspec/specs/ and openspec/changes/archive/.

### Folded

- `shared-planning-change-stages-US1-TC2-1`, the product manager hearing nothing when the change leaves them → `shared-planning-change-stages-SC-40`
- `shared-planning-change-stages-US1-TC5-1`, one push moving two changes telling each hand of its own → `shared-planning-change-stages-SC-47`
- `shared-planning-change-stages-US2-TC3-1`, the day below the bound wearing no chip → `shared-planning-change-stages-SC-22`
- `shared-planning-change-stages-US2-TC7-1`, a proof reverted off `main` dropping the change a lane → `shared-planning-change-stages-SC-01`
- `shared-planning-change-stages-US3-TC2-1`, the board's Mine filter using the handle My turn remembered → `shared-planning-change-stages-SC-63`
- `shared-planning-change-stages-US5-TC3-1`, a waiver removed returning the design to owed → `shared-planning-change-stages-SC-01`
- `shared-planning-change-stages-US6-TC2-1`, each wait shown against the hand that owes it → `shared-planning-change-stages-SC-21`
- `shared-planning-change-stages-US7-TC4-1`, the pip carrying the stage number so no colour carries the meaning alone → `shared-planning-change-stages-SC-65`
- `shared-planning-change-stages-US4-TC3-1`, a hand taken off a change showing the hand as open → `shared-planning-change-stages-SC-42`

Four cases went the other way: the rulings settled behaviour no case walked, so the suite gained one case each.

- `shared-planning-change-stages-US1-TC8-1`, the release hand told its turn at staging, `Q18` → `shared-planning-change-stages-SC-45`
- `shared-planning-change-stages-US2-TC9-1`, a record nothing can read shown in Proposed with its hands open, `Q23` → `shared-planning-change-stages-SC-03`
- `shared-planning-change-stages-US4-TC6-1`, a hand taken off a change telling the role's channel once, `Q25` → `shared-planning-change-stages-SC-42`
- `shared-planning-change-stages-US6-TC4-1`, a wait written with no date shown undated, `Q20` → `shared-planning-change-stages-SC-21`

### Rejected

- `shared-planning-change-stages-US6-TC1-1`'s direct message to the hand that owes a wait — `Q31` keeps five message kinds, and a written wait is a line of the digest rather than a message of its own; the case keeps the dated chip and the hand it is shown against, and the page loses the row it was read from.
- No case was dropped whole: every reading of the input turned out to be behaviour the rulings kept or a question they answered.

### Escalated

- On staging names two hands: is one message sent to each, or only to QA? → `Q18`
- What does a message link before the change has a thread? → `Q19`
- An `awaiting:` line with no date or no artifact named: shown, or refused? → `Q20`
- Are the idle bounds inclusive: the chip at 7 days, the shelf at 30? → `Q21`
- Does idle count calendar days or working days, and on which clock? → `Q21`
- Is a 🚧 line whose change has archived left marked, or refused? → `Q22`
- Does a change whose record the check refuses show with its hands open, or stay off the board? → `Q23`
- Is `deployed_env: staging` enough for On staging on its own? → `Q24`
- Is the role's channel told when a hand is removed while the change sits on them? → `Q25`
- Is "once per move" keyed for the life of the change, or per entry? → `Q26`
- Does the weekly digest reach a handle the team map does not know? → `Q27`
- Does `landed_by:` hold one handle per artifact, or both? → `Q28`

`Q26` moved a case: `shared-planning-change-stages-US1-TC3-1` read the key as one per change and now runs a row per entry, the revert and re-landing telling the engineer again.

### Out of suite

- `shared-planning-change-stages-SC-01` → the manual's derivation tests
- `shared-planning-change-stages-SC-02` → the manual's derivation tests
- `shared-planning-change-stages-SC-04` → the manual's derivation tests
- `shared-planning-change-stages-SC-06` → the manual's derivation tests
- `shared-planning-change-stages-SC-27` → the manual's derivation tests
- `shared-planning-change-stages-SC-28` → the manual's derivation tests
- `shared-planning-change-stages-SC-29` → the manual's derivation tests

### Anchors no case reaches

Every journey is walked by at least one case. The six feature set root groups are reached by none, and each says why:

- Stages read from files — holds the derivations listed out of suite above
- Overlays, a closed set — holds the derivations listed out of suite above
- Drafted, landed on a word — its rules sit on the journeys the hands walk
- Hands and whose turn — its rules sit on the journeys the hands walk
- Messages, once per move — its rules sit on the journeys the hands walk
- Surfaces that show the stage — its rules sit on the journeys the hands walk
