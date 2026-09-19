# shared/planning/agent-rounds Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-19, tcs-rules r3.0
**Out of suite:** shared-planning-agent-rounds-SC-06, shared-planning-agent-rounds-SC-10, shared-planning-agent-rounds-SC-23, shared-planning-agent-rounds-SC-28, shared-planning-agent-rounds-SC-29, shared-planning-agent-rounds-SC-30, shared-planning-agent-rounds-SC-35

## shared-planning-agent-rounds-US1: Product manager opens a change from one sentence

**As a** product manager,
**I want** to say what is wanted in the planning channel and answer numbered questions in the thread it starts,
**so that** the proposal, the decisions and the journeys land without my opening a terminal.

### shared-planning-agent-rounds-US1-TC1-1: First sentence opens the change and its thread

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-agent-rounds-US-01

**Pre-conditions:**

* admin(product manager) is in <planning channel>.
* No change names what they are about to ask for.

**Steps:**

1. Post one sentence in <planning channel> saying what is wanted.
2. Read the reply.

**Expected Results:**

* A change opens, with the asker recorded as its product manager.
* The reply starts the change's thread and names the change id.
* `thread:` records the channel and the message the thread hangs off.

### shared-planning-agent-rounds-US1-TC2-1: Later replies use the one recorded thread

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
* **Trace:** shared-planning-agent-rounds-US-01

**Pre-conditions:**

* <change> is open, its `thread:` recorded and its proposal on `main`.
* admin(product manager of <change>) is in <change thread>.

**Steps:**

1. Say land for `decisions.md` in <change thread>.
2. Read where the landing reply went.
3. Check `thread:`.

**Expected Results:**

* The landing reply is in <change thread>.
* `thread:` is unchanged.

### shared-planning-agent-rounds-US1-TC3-1: Three files land from answers in the thread

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-01

**Pre-conditions:**

* <change> was opened by a first sentence and its numbered questions are posted in <change thread>.
* admin(product manager of <change>) opens no terminal.

**Steps:**

1. Answer each numbered question in <change thread>.
2. Say land for each draft the agent posts there.
3. Check `main`.

**Expected Results:**

* `proposal.md`, `decisions.md` and `user-journeys.md` are on `main`.
* Each records the hand whose word landed it.

### shared-planning-agent-rounds-US1-TC4-1: Message naming an open change opens no second change

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
* **Trace:** shared-planning-agent-rounds-US-01

**Pre-conditions:**

* <change> is open with its `thread:` recorded.
* admin(product manager of <change>) is in <planning channel>.

**Steps:**

1. Post a message in <planning channel> naming <change>.
2. Check the changes in flight.
3. Read the reply.

**Expected Results:**

* No second change opens.
* The reply is in <change thread>.

### shared-planning-agent-rounds-US1-TC5-1: First sentence from a teammate with no handle map entry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-01

**Pre-conditions:**

* admin(engineer) with no entry in the handle map is in <planning channel>.

**Steps:**

1. Post one sentence saying what is wanted.
2. Read the reply.
3. Check the change's record.

**Expected Results:**

* A change opens with its product manager unnamed, and the reply names its change id.
* The reply says the hand is unnamed and asks for the handle.

### shared-planning-agent-rounds-US1-TC6-1: A round run from a terminal lands the same way

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-01

**Pre-conditions:**

* <change> is open with its proposal on `main`, and <change thread> cannot be reached.
* admin(product manager of <change>) is at a terminal in the store on <change>'s branch.

**Steps:**

1. Run the round for `decisions.md` from the terminal.
2. Say land at the terminal.
3. Check `main` and `rounds.md`.

**Expected Results:**

* The same six steps run, with the perspectives the draft summons.
* `decisions.md` is on `main` with `landed_by:` naming the product manager.
* `rounds.md` gains the round's row.

---

## shared-planning-agent-rounds-US2: Designer tweaks a proposed design

**As a** designer told a draft is ready,
**I want** to read its summary in the thread, remark on what to change, and say land,
**so that** the design lands as I want it without my writing the file.

### shared-planning-agent-rounds-US2-TC1-1: One word lands the design with the designer's handle

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
* **Trace:** shared-planning-agent-rounds-US-02

**Pre-conditions:**

* `ui-design.md` is drafted on <change>'s branch and its summary is posted in <change thread>.
* admin(designer of <change>) is in <change thread>.

**Steps:**

1. Reply `land` in <change thread>.
2. Check `main`.
3. Check `rounds.md`.

**Expected Results:**

* `ui-design.md` is on `main` with `landed_by:` naming the designer.
* `rounds.md` gains the round's row.
* The artifacts after the design are read again.

### shared-planning-agent-rounds-US2-TC2-1: Remark is applied as written and re-runs what it touches

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-02

**Pre-conditions:**

* `ui-design.md` is drafted on <change>'s branch and its summary is posted in <change thread>.
* admin(designer of <change>) is in <change thread>.

**Steps:**

1. Reply with <a remark on one screen's empty state> in <change thread>.
2. Read the reply.
3. Check the draft.

**Expected Results:**

* The draft carries the remark as written.
* The reply names the perspectives the edited lines summon.
* A perspective the remark does not touch is not named.

### shared-planning-agent-rounds-US2-TC3-1: Remark that settles a choice writes a decisions row

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-02

**Pre-conditions:**

* `ui-design.md` is drafted on <change>'s branch and offers <two shapes for one screen>.
* admin(designer of <change>) is in <change thread>.

**Steps:**

1. Reply choosing one of <two shapes for one screen>.
2. Check `decisions.md`.
3. Check `rounds.md`.

**Expected Results:**

* `decisions.md` gains a numbered row carrying the choice.
* `rounds.md` gains the round's row.

### shared-planning-agent-rounds-US2-TC4-1: A round of one reader verifies itself

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-02

**Pre-conditions:**

* `ui-design.md` is drafted on <change>'s branch and its summary is posted in <change thread>.
* admin(designer of <change>) is in <change thread>.

**Steps:**

1. Reply with <a remark touching lines no perspective reads for>.
2. Read the reply.
3. Check `rounds.md`.

**Expected Results:**

* The reply names one reader, the one that argues the simpler shape.
* The round's row names that one perspective and no separate verifier.

### shared-planning-agent-rounds-US2-TC5-1: Design round with no frames writes a dated wait

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-02

**Pre-conditions:**

* <change> links a page section naming <a screen nobody has drawn>.
* admin(designer of <change>) is in <change thread>.

**Steps:**

1. Ask for the design in <change thread> with no frame link.
2. Read the reply.
3. Check the change's record.

**Expected Results:**

* A dated wait on the designer is written.
* `ui-design.md` describes <a screen nobody has drawn> in no prose.

### shared-planning-agent-rounds-US2-TC6-1: Only the hand of the stage can land the design

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-02

**Pre-conditions:**

* `ui-design.md` is drafted on <change>'s branch and its summary is posted in <change thread>.
* admin(engineer of <change>) is in <change thread> and is not the design's hand.

**Steps:**

1. Reply `land` as the engineer.
2. Check `main`.
3. Read the reply.

**Expected Results:**

* `ui-design.md` does not reach `main`.
* No `landed_by:` is written for it.
* The reply names the hand the artifact waits on.

### shared-planning-agent-rounds-US2-TC7-1: A remark on the page's marked lines

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-02

**Pre-conditions:**

* `ui-design.md` is drafted on <change>'s branch and its summary quotes <a marked line of the page the change links>.
* admin(designer of <change>) and admin(product manager of <change>) are in <change thread>.

**Test data:**

| The hand who remarks | The page gains |
| --- | --- |
| admin(designer of <change>) | a ❓ line for the product manager |
| admin(product manager of <change>) | the remark applied as written |

**Steps:**

1. Reply as the hand from the table with a remark changing what <a marked line of the page the change links> says.
2. Open the page <change> links.
3. Read the reply.

**Expected Results:**

* The page gains what the table names.
* No requirement is written from the remark before the page carries it.

---

## shared-planning-agent-rounds-US3: Tech PIC challenges a proposed design

**As a** tech PIC,
**I want** the proposed system, its data flow and its rejected options in a summary I can challenge in the thread,
**so that** a wrong mechanism is caught before the requirements are drawn from it.

### shared-planning-agent-rounds-US3-TC1-1: Summary carries the system, the flow and what was rejected

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-03

**Pre-conditions:**

* `tech-design.md` is drafted on <change>'s branch and its summary is posted in <change thread>.
* admin(tech PIC of <change>) is in <change thread>.

**Steps:**

1. Open <change thread>.
2. Read the draft's summary.

**Expected Results:**

* The summary names the proposed system, its data flow and the options rejected.
* It fits one screen.
* Each numbered question carries the agent's recommendation.

### shared-planning-agent-rounds-US3-TC2-1: Challenge becomes a decisions row with the agent's answer

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-03

**Pre-conditions:**

* `tech-design.md` is drafted on <change>'s branch and its summary is posted in <change thread>.
* admin(tech PIC of <change>) is in <change thread>.

**Steps:**

1. Reply challenging <the proposed mechanism> in <change thread>.
2. Read the reply.
3. Check `decisions.md`.

**Expected Results:**

* `decisions.md` gains a numbered row carrying the challenge and the agent's answer.
* The reply names the perspectives the challenge re-ran.

### shared-planning-agent-rounds-US3-TC3-1: The design's readers cite the eight principles

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-03

**Pre-conditions:**

* A round on `tech-design.md` has run on <change> and its summary is posted in <change thread>.
* admin(tech PIC of <change>) is in <change thread>.

**Steps:**

1. Read the draft's summary in <change thread>.
2. Read the round's row in `rounds.md`.

**Expected Results:**

* Each finding that stood names the principle it holds the draft to.
* The row names the perspectives run and what stood.

### shared-planning-agent-rounds-US3-TC4-1: Requirement reaching the design waits on the tech PIC

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-03

**Pre-conditions:**

* `tech-design.md` is on `main` and the requirements draft needs <a mechanism the tech design does not carry>.
* admin(tech PIC of <change>) is at a terminal in the store on <change>'s branch.

**Steps:**

1. Read the change's record.
2. Push the tech PIC's edit carrying <a mechanism the tech design does not carry>.
3. Read the change's record again.

**Expected Results:**

* Step 1 shows a dated `awaiting: tech-design:` line for the tech PIC.
* Step 3 shows the wait cleared.
* The round records the push as the tech PIC's word for the lines it touched.

---

## shared-planning-agent-rounds-US4: Hand answers only what only they can

**As a** hand,
**I want** the agent to ask a preference or a product decision as a numbered question with its recommendation, and to decide nothing else,
**so that** I answer once and never argue with a draft.

### shared-planning-agent-rounds-US4-TC1-1: Numbered question carries a recommendation and the hand

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-04

**Pre-conditions:**

* A draft round on <change> turns on <a preference nobody has stated>.
* admin(hand of <change>'s open artifact) is in <change thread>.

**Steps:**

1. Open <change thread>.
2. Read the questions.
3. Check `decisions.md`.

**Expected Results:**

* Each question carries a number and the agent's recommendation.
* Each names the hand it waits on.
* Nothing but a preference or a product decision is asked.

### shared-planning-agent-rounds-US4-TC2-1: An answer writes the row and closes the question

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
* **Trace:** shared-planning-agent-rounds-US-04

**Pre-conditions:**

* <change> has <question id> open on admin(hand of <change>'s open artifact).

**Steps:**

1. Reply `<question id>: <answer>` in <change thread>.
2. Check `decisions.md`.
3. Open <change page url>.

**Expected Results:**

* The row for <question id> carries <answer>.
* The change page no longer lists <question id> open.

### shared-planning-agent-rounds-US4-TC3-1: A question id alone takes its recommendation

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
* **Trace:** shared-planning-agent-rounds-US-04

**Pre-conditions:**

* <change> has <question id> open, carrying the agent's recommendation.

**Steps:**

1. Reply `<question id>` alone in <change thread>.
2. Check `decisions.md`.

**Expected Results:**

* The row records the recommendation as the answer.
* The question closes.

### shared-planning-agent-rounds-US4-TC4-1: A product detail goes to the page, not the decisions

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-04

**Pre-conditions:**

* A draft round on <change> turns on <a product detail nobody has confirmed>.
* admin(product manager of <change>) is in <change thread>.

**Steps:**

1. Read the questions in <change thread>.
2. Open the page <change> links.
3. Check `decisions.md`.

**Expected Results:**

* The page carries a ❓ line for <a product detail nobody has confirmed>.
* `decisions.md` holds no numbered row for it.

### shared-planning-agent-rounds-US4-TC5-1: Question ids are per change and never reused

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
* **Trace:** shared-planning-agent-rounds-US-04

**Pre-conditions:**

* <change> has <question id> answered and closed.

**Steps:**

1. Open a later round on <change> that raises a question.
2. Check the ids in `decisions.md`.

**Expected Results:**

* The new question takes an id no earlier question on <change> used.
* <question id> still carries its own answer.

### shared-planning-agent-rounds-US4-TC6-1: Open questions list per hand, and with none

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-04

**Pre-conditions:**

* <change> has two questions open on its designer and none on its engineer.

**Test data:**

| Reader | Questions on them | My turn shows |
| --- | --- | --- |
| admin(designer of <change>) | two open | both questions above the changes |
| admin(engineer of <change>) | none | the changes alone |

**Steps:**

1. Open <my turn url> and choose the reader's handle.
2. Read the top of the page.
3. Open <change page url>.

**Expected Results:**

* My turn shows what the table names, each question row carrying the change, the id, the question's first line and the thread link.
* The change page lists each artifact's open question ids by hand.

### shared-planning-agent-rounds-US4-TC7-1: A reply naming an unissued question changes nothing

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
* **Trace:** shared-planning-agent-rounds-US-04

**Pre-conditions:**

* <change> has <question id> open and <unissued question id> issued to nothing.

**Steps:**

1. Reply `<unissued question id>: <answer>` in <change thread>.
2. Check `decisions.md`.
3. Check `main`.

**Expected Results:**

* No decisions row changes.
* The reply says what it could not do.
* No artifact reaches `main` on that reply.

### shared-planning-agent-rounds-US4-TC8-1: A reply that is none of the moves holds the question open

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-04

**Pre-conditions:**

* <change> has <question id> open on admin(hand of <change>'s open artifact).

**Steps:**

1. Reply <a message that is neither an answer, a remark nor land> in <change thread>.
2. Open <change page url>.
3. Check `main`.

**Expected Results:**

* <question id> stays listed open on its hand.
* No artifact reaches `main` on that reply.

---

## shared-planning-agent-rounds-US5: Hand sees an artifact read again after what it was drawn from moved

**As a** hand of an artifact,
**I want** the change's agent to read my artifact again when something before it changes, and to open a round for me only when the change reaches it,
**so that** nothing stale is built on and I am not asked to re-read for a typo.

### shared-planning-agent-rounds-US5-TC1-1: A landing reads every artifact after it, oldest first

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
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change> has `ui-design.md`, `tech-design.md`, `spec.md` and `feature-tcs.md` on `main`.
* An edit to `proposal.md` is drafted and ready to land.

**Steps:**

1. Say land for `proposal.md` in <change thread>.
2. Read <change thread>.
3. Check `reviewed:`.

**Expected Results:**

* One reply names what was read.
* Every artifact after the proposal is read, oldest first.
* `reviewed:` carries one content id per artifact read.

### shared-planning-agent-rounds-US5-TC2-1: A read that changes nothing writes the record line alone

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change> has `tech-design.md` on `main` and fresh.
* An edit to `proposal.md` that leaves the tech design right is ready to land.

**Steps:**

1. Say land for `proposal.md` in <change thread>.
2. Check `tech-design.md` and the change's record.
3. Read <change thread>.

**Expected Results:**

* `tech-design.md` is unchanged and its `reviewed:` line carries the new content id.
* The reply says what was read and that nothing changed.
* Writing `reviewed:` puts no artifact behind.

### shared-planning-agent-rounds-US5-TC3-1: A read that edits opens a round for that hand

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change> has `ui-design.md` on `main` and fresh.
* An edit to `proposal.md` reaching <a state the design does not carry> is ready to land.

**Steps:**

1. Say land for `proposal.md` in <change thread>.
2. Read <change thread>.
3. Check `main`.

**Expected Results:**

* A round opens for the design's hand, naming the change that reached the artifact.
* The edited design does not reach `main` on the agent's own word.

### shared-planning-agent-rounds-US5-TC4-1: Edits outside the linked text leave the artifacts fresh

Runs once per row of **Test data**.

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
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change> links some sections of <the page the change marks> and has every artifact on `main` and fresh.

**Test data:**

| Edit landed on the page | Artifacts after |
| --- | --- |
| A copy edit to a section <change> does not link | stay fresh |
| A whitespace-only edit to a section <change> links | stay fresh |

**Steps:**

1. Land the edit from the table on <the page the change marks>.
2. Open <change page url>.
3. Check `reviewed:`.

**Expected Results:**

* No artifact of <change> goes behind.
* No round opens and no content id moves.

### shared-planning-agent-rounds-US5-TC5-1: A landing is refused while something before it is behind

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
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change>'s `tech-design.md` is behind.
* `spec.md` is drafted on <change>'s branch and admin(product manager of <change>) is in <change thread>.

**Steps:**

1. Say land for `spec.md` in <change thread>.
2. Read the reply.
3. Check `main`.

**Expected Results:**

* `spec.md` does not reach `main`.
* The reply names the behind artifact before it.

### shared-planning-agent-rounds-US5-TC6-1: A waived artifact is fresh and holds nothing after it

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
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change> carries a waiver in place of `ui-design.md`.
* An edit to `proposal.md` is drafted and `spec.md` is ready to land.

**Steps:**

1. Say land for `proposal.md` in <change thread>.
2. Say land for `spec.md`.
3. Check `main`.

**Expected Results:**

* The waived design puts nothing behind.
* `spec.md` lands.

### shared-planning-agent-rounds-US5-TC7-1: Behind holds no tick, no claim and no wait

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
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change>'s `tasks.md` is behind.
* admin(engineer of <change>) is at a terminal in the application repository.

**Steps:**

1. Tick a task whose tests and code are on `main`.
2. Write a wait on the tech PIC.
3. Open <change page url>.

**Expected Results:**

* The tick is accepted.
* The wait is written.
* Neither is refused for the behind artifact.

### shared-planning-agent-rounds-US5-TC8-1: A landed Raised row puts the requirements and the cases behind

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
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change>'s `decisions.md` carries a Raised row with no answer, and `spec.md` and `feature-tcs.md` are fresh.
* admin(product manager of <change>) is in <change thread>.

**Steps:**

1. Answer the Raised row in <change thread>.
2. Open <change page url>.
3. Read <change thread>.

**Expected Results:**

* `spec.md` and `feature-tcs.md` go behind.
* They are read again before `tasks.md` lands.

### shared-planning-agent-rounds-US5-TC9-1: Two landings before one read are read once

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change> has every artifact on `main` and fresh.
* Edits to `proposal.md` and to `decisions.md` are both ready to land.

**Steps:**

1. Say land for `proposal.md` in <change thread>.
2. Say land for `decisions.md` before the first read finishes.
3. Read <change thread> and check `reviewed:`.

**Expected Results:**

* One run at a time reads <change>, and the second landing joins it.
* The content ids it writes cover both edits.

### shared-planning-agent-rounds-US5-TC10-1: A run that loses the race says so and stops

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* A read of <change> is running after a landing.
* admin(engineer of <change>) is at a terminal on <change>'s branch.

**Steps:**

1. Push to <change>'s branch while the read is running.
2. Read <change thread>.
3. Check <change>'s branch.

**Expected Results:**

* The run says it lost the push and stopped.
* Nothing the run drafted is on the branch.

### shared-planning-agent-rounds-US5-TC11-1: A landing with nothing after it opens no round

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
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change> has `proposal.md` on `main` and no artifact after it.

**Steps:**

1. Say land for an edit to `proposal.md` in <change thread>.
2. Open <change page url>.
3. Check `reviewed:`.

**Expected Results:**

* No round opens.
* No `reviewed:` line changes.

### shared-planning-agent-rounds-US5-TC12-1: A read that edits several artifacts stops at the earliest

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change> has the designs, the requirements, the cases and the plan on `main`.
* An edit to `proposal.md` reaching the design and the requirements is ready to land.

**Steps:**

1. Say land for `proposal.md` in <change thread>.
2. Read <change thread>.
3. Open <change page url>.

**Expected Results:**

* Each artifact after the proposal is read, oldest first.
* A round opens for the earliest edited artifact's hand, and the read stops there.
* The artifacts after that one are read again once that round lands.

### shared-planning-agent-rounds-US5-TC13-1: The fold at archive refuses a behind delta

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
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* <change> has every box ticked and `spec.md` behind.
* admin(engineer of <change>) is at a terminal in the store.

**Steps:**

1. Run the archive check for <change>.
2. Read its output.

**Expected Results:**

* The check refuses the fold.
* It names the behind delta.

### shared-planning-agent-rounds-US5-TC14-1: A resumed run continues from the pushed draft

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-05

**Pre-conditions:**

* A run for <change> pushed a draft to <change>'s branch and then stopped.

**Steps:**

1. Start a run for <change> again.
2. Read <change thread>.
3. Check <change>'s branch.

**Expected Results:**

* The run reads <change>'s branch, `main` and <change thread>.
* It continues from the pushed draft rather than drafting it again.
* A question already answered in the thread is not asked again.

---

## shared-planning-agent-rounds-US6: Engineer reads a landing that was checked

**As an** engineer,
**I want** each task group built test first, read by its perspectives and verified before its landing summary reaches me,
**so that** I read a summary, not a diff.

### shared-planning-agent-rounds-US6-TC1-1: A group lands its tests first, then its code

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
* **Trace:** shared-planning-agent-rounds-US-06

**Pre-conditions:**

* <change> is building and <task group> names <the scenario ids it covers>.
* admin(engineer of <change>) is in <change thread>.

**Steps:**

1. Read <task group>'s commits on `main`.
2. Read its landing summary in <change thread>.

**Expected Results:**

* The tests <the scenario ids it covers> name land in their own commit, before the code.
* The summary arrives after the group's readers and the verify, not before.

### shared-planning-agent-rounds-US6-TC2-1: Landing summary names the readers and the tests per scenario

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-06

**Pre-conditions:**

* <task group> of <change> has landed and admin(engineer of <change>) is in <change thread>.

**Steps:**

1. Read <task group>'s landing summary in <change thread>.
2. Read the group's row in `rounds.md`.

**Expected Results:**

* The summary names the perspectives that read the group and what stood.
* It names the tests each scenario landed with.
* The row carries the same perspectives, findings and tests.

### shared-planning-agent-rounds-US6-TC3-1: The last group walks the journeys and leaves the suite

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-06

**Pre-conditions:**

* Every earlier task group of <change> is ticked and its journeys are on `main`.
* admin(engineer of <change>) is in <change thread>.

**Steps:**

1. Read the last group's landing summary in <change thread>.
2. Check the end-to-end suite on `main`.
3. Check `feature-tcs.md`.

**Expected Results:**

* The journeys are walked in a browser and kept as the end-to-end suite.
* Each case the walk covers is marked automated.

### shared-planning-agent-rounds-US6-TC4-1: One reader argues the simpler shape for the whole change

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-06

**Pre-conditions:**

* Every task group of <change> is ticked and nothing of it is on staging.

**Steps:**

1. Read `rounds.md`.
2. Read <change thread>.

**Expected Results:**

* One round covers the whole change, run by the reader that argues the simpler shape.
* It runs before <change> reaches staging.

### shared-planning-agent-rounds-US6-TC5-1: A tick is refused without a scenario a test cites

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
* **Trace:** shared-planning-agent-rounds-US-06

**Pre-conditions:**

* <change> is building and admin(engineer of <change>) is at a terminal in the application repository.

**Test data:**

| The task | The tick |
| --- | --- |
| Names no scenario id | refused, naming the task |
| Names a scenario id no test in the tree cites | refused, naming the scenario id |

**Steps:**

1. Mark the task from the table done.
2. Read the output.
3. Check `tasks.md`.

**Expected Results:**

* The tick is refused as the table names.
* The task's box stays unticked.

---

## shared-planning-agent-rounds-US7: Product manager decides what a moved goal means

**As a** product manager,
**I want** to be asked whether a change whose goals moved is extended, superseded or split,
**so that** a change mid-build is never rewritten in place without my word.

### shared-planning-agent-rounds-US7-TC1-1: A moved goal asks extend, supersede or split

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
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-07

**Pre-conditions:**

* <change> is building with every artifact on `main`.
* admin(product manager of <change>) is in <change thread>.

**Test data:**

| What moved | The question |
| --- | --- |
| A goal in `decisions.md` | extend, supersede or split |
| A non-goal in `decisions.md` | extend, supersede or split |

**Steps:**

1. Land the edit from the table.
2. Read <change thread>.
3. Check the artifacts after `decisions.md`.

**Expected Results:**

* A question to the product manager names extend, supersede and split.
* No artifact after the moved line is rewritten in place.

### shared-planning-agent-rounds-US7-TC2-1: The answer is recorded and does what it names

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
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-07

**Pre-conditions:**

* <change> has a moved-goal question open on its product manager.

**Test data:**

| The answer | What it does |
| --- | --- |
| extend | <change> goes on with the moved goal, and everything after its proposal is read again |
| supersede | a new change opens from the moved goal and <change> is withdrawn |
| split | a new change takes the moved part and <change> keeps the rest |

**Steps:**

1. Answer the moved-goal question in <change thread> with the answer from the table.
2. Check `decisions.md`.
3. Check the changes in flight and the artifacts after the moved line.

**Expected Results:**

* What the table names has happened.
* The decisions row records the answer and the hand who gave it.
* No goal or non-goal is rewritten in place.

### shared-planning-agent-rounds-US7-TC3-1: Nothing lands while a moved-goal question is open

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
* **Trace:** shared-planning-agent-rounds-US-07

**Pre-conditions:**

* <change>'s moved-goal question is open and unanswered.
* `tasks.md` is drafted on <change>'s branch.

**Steps:**

1. Say land for `tasks.md` in <change thread>.
2. Read the reply.
3. Check `main`.

**Expected Results:**

* `tasks.md` does not reach `main`.
* The reply names the open moved-goal question.

---

## shared-planning-agent-rounds-US8: QA walks only what staging proves

**As a** QA teammate,
**I want** the cases the end-to-end walk automates left out of the run sheet,
**so that** the pass on staging covers what only a deployed stack can show.

### shared-planning-agent-rounds-US8-TC1-1: The run tab leaves automated cases out and says how many

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
* **Trace:** shared-planning-agent-rounds-US-08

**Pre-conditions:**

* <change> is on staging and its suite holds <cases the walk automated> and <cases still manual>.
* admin(QA of <change>) is at a terminal in the store.

**Steps:**

1. Write the run tab for <change>.
2. Open the tab.
3. Read what the run said.

**Expected Results:**

* The tab holds <cases still manual> alone.
* The run says how many automated cases it left out.

### shared-planning-agent-rounds-US8-TC2-1: The change page counts automated cases against the total

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
* **Trace:** shared-planning-agent-rounds-US-08

**Pre-conditions:**

* <change> is on staging and its run tab is written.

**Steps:**

1. Open <change page url>.
2. Read the Delivery row.

**Expected Results:**

* The row shows the suite's automated count against its total.
* It shows the run tab's count beside them.

### shared-planning-agent-rounds-US8-TC3-1: Every case automated, and none

Runs once per row of **Test data**.

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
* **Trace:** shared-planning-agent-rounds-US-08

**Pre-conditions:**

* admin(QA of <change>) is at a terminal in the store and <change> is on staging.

**Test data:**

| The suite | The tab |
| --- | --- |
| Every case automated | holds no case |
| No case automated | holds every case |

**Steps:**

1. Write the run tab for the suite from the table.
2. Open the tab.
3. Read what the run said.

**Expected Results:**

* The tab holds what the table names.
* The run says how many cases it left out, zero included.

### shared-planning-agent-rounds-US8-TC4-1: The suite runs on every push, its smoke cases on deploy and cut

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-agent-rounds-US-08

**Pre-conditions:**

* <change>'s end-to-end suite is on `main` in the application repository.

**Steps:**

1. Push to `main`.
2. Deploy to staging.
3. Cut a release.
4. Read each run's result.

**Expected Results:**

* The whole suite runs on the push.
* The suite's smoke cases run on the deploy and on the cut.

---

## shared-planning-agent-rounds-US9: Reader sees what a round did

**As a** reader of a change,
**I want** one row per round saying which perspectives read the draft, what stood and what was asked,
**so that** a round that found nothing and one that never ran do not look the same.

### shared-planning-agent-rounds-US9-TC1-1: One row per round, on the page and in the file

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
* **Trace:** shared-planning-agent-rounds-US-09

**Pre-conditions:**

* <change> has three rounds run on it.

**Steps:**

1. Open <change page url>.
2. Read the Rounds row.
3. Open `rounds.md`.

**Expected Results:**

* One line per round names the artifact or group, the perspectives run, what stood and the question ids raised.
* The page and the file carry the same three rounds.

### shared-planning-agent-rounds-US9-TC2-1: A task group's row names the tests per scenario

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
* **Trace:** shared-planning-agent-rounds-US-09

**Pre-conditions:**

* <task group> of <change> has landed, naming <the scenario ids it covers>.

**Steps:**

1. Open `rounds.md`.
2. Read the row for <task group>.

**Expected Results:**

* The row names the group, its perspectives and what stood.
* It names the tests each of <the scenario ids it covers> landed with.

### shared-planning-agent-rounds-US9-TC3-1: A round that found nothing still writes its row

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
* **Trace:** shared-planning-agent-rounds-US-09

**Pre-conditions:**

* A round on <change> ran whose readers found nothing.

**Steps:**

1. Open `rounds.md`.
2. Read that round's row.

**Expected Results:**

* The row names the perspectives run and that nothing stood.
* It lists no question id.

### shared-planning-agent-rounds-US9-TC4-1: A landing or a tick with no row is refused

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
* **Trace:** shared-planning-agent-rounds-US-09

**Pre-conditions:**

* <change> was opened after the round rule.
* admin(engineer of <change>) is at a terminal in the store.

**Test data:**

| What has no row in `rounds.md` | The check |
| --- | --- |
| A landed artifact | refuses, naming the artifact |
| A ticked task group | refuses, naming the group |

**Steps:**

1. Run the manual check.
2. Read its output.

**Expected Results:**

* The check refuses as the table names.
* `rounds.md` is unchanged by the check.

### shared-planning-agent-rounds-US9-TC5-1: A change opened before the rule is not refused

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-agent-rounds-US-09

**Pre-conditions:**

* <change opened before the round rule> has a landed artifact and no rows in `rounds.md`.
* admin(engineer of <change>) is at a terminal in the store.

**Steps:**

1. Run the manual check.
2. Read its output.

**Expected Results:**

* The check does not refuse <change opened before the round rule>.
* It names no missing row for it.

### shared-planning-agent-rounds-US9-TC6-1: A change with no round yet shows none and passes

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-09

**Pre-conditions:**

* <change> is open with its first round still running and no artifact landed.

**Steps:**

1. Open <change page url>.
2. Run the manual check.

**Expected Results:**

* The Rounds row lists no round.
* The check does not refuse <change>.

### shared-planning-agent-rounds-US9-TC7-1: A row missing a column is refused

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
* **Trace:** shared-planning-agent-rounds-US-09

**Pre-conditions:**

* <change> was opened after the round rule, and its `rounds.md` holds a row naming no perspective.
* admin(engineer of <change>) is at a terminal in the store.

**Steps:**

1. Run the manual check.
2. Read its output.

**Expected Results:**

* The check refuses and names the column the row leaves empty.
* The file's other rows are not reported.

### shared-planning-agent-rounds-US9-TC8-1: The record archives with the change and folds nowhere

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
* **Trace:** shared-planning-agent-rounds-US-09

**Pre-conditions:**

* <change> is archived, having run rounds on every artifact.

**Steps:**

1. Open the archived change's directory.
2. Read its `rounds.md`.
3. Check the capability's durable files.

**Expected Results:**

* `rounds.md` sits in the archived change with every row it had.
* No durable file gained its rows.

## Settled

None yet - the first blind pass.

## Reconciliation

Run: 2026-09-19, blind pass over the isolated input: the outline (Purpose and Feature set), user-journeys.md, proposal.md, decisions.md with its Raised table, ui-design.md, the Agent Rounds and Change Stages pages and the Planning index, the store context; denied every `## Requirements` section, openspec/specs/ and openspec/changes/archive/.

### Folded

* **The summary is one screen, and each question carries its recommendation** - `US3-TC1-1` asked of every draft's summary what the design file states of the thread's replies, and no scenario said it. Folded into `shared-planning-agent-rounds-SC-01` and the round's own requirement.
* **A round that found nothing still writes its row** - `US9-TC3-1` reads the case the record exists for, and the scenarios said only that there is one row per round. Folded into `shared-planning-agent-rounds-SC-51` and the record's requirement.
* **Every case automated, and none** - `US8-TC3-1` walks both ends of the run sheet's rule. Kept as a boundary of `shared-planning-agent-rounds-SC-61`, which decides both; no scenario of its own.

### Rejected

None. No case read a non-goal as behaviour, and none took the stage, the direct messages or the Behind chip - `shared/planning/change-stages`' - for this capability's.

### Escalated

Thirteen questions went to the change's `decisions.md`, and the answers landed as `Q17` to `Q28`.

* **A message naming an open change** → `Q17`. Answered in that change's thread, the reply naming the id; folded into `shared-planning-agent-rounds-SC-18`, and `US1-TC4-1` stands.
* **An asker with no entry in the team map** → `Q18`. The change opens with its product manager unnamed and the reply asks for the handle; folded as `shared-planning-agent-rounds-SC-19`, and `US1-TC5-1` recast onto the unnamed hand.
* **Who may say land** → `Q19`, on the product manager, with the hand of the stage alone recommended and a ❓ on the page. Folded as `shared-planning-agent-rounds-SC-05`; `US2-TC6-1` stands as the blind pass wrote it.
* **A reply that is none of the moves** → `Q20`. It is a remark, applied as written, and a reply the round cannot apply is answered with what it could not do; folded as `shared-planning-agent-rounds-SC-15`. `US4-TC8-1` stands and `US4-TC7-1` gained that reply.
* **A re-read that would edit several artifacts** → `Q21`. It reads in order, opens a round for the earliest edited artifact's hand and stops; folded into `shared-planning-agent-rounds-SC-41`, and `US5-TC12-1` recast onto the stop, which is the one place the two readings disagreed.
* **Two landings inside one run's life** → `Q22`. A no-op re-read is not a round and writes no row, so a joined run leaves none; folded into `shared-planning-agent-rounds-SC-39` and the record's requirement.
* **A landing with nothing after it** → `Q23`. Nothing beyond the landing line; folded as `shared-planning-agent-rounds-SC-42`, and `US5-TC11-1` stands.
* **When `rounds.md` exists** → `Q24`. With the first round, absent until then; folded as `shared-planning-agent-rounds-SC-53`, and `US9-TC6-1` stands.
* **A row missing a column** → `Q25`. Refused as a missing row is, naming the column; folded as `shared-planning-agent-rounds-SC-56`, and `US9-TC7-1` recast from reported to refused.
* **The agent's own `reviewed:` landing** → `Q22`, with the row above: the landed artifacts and the ticked groups owe rows, and a read that ran no perspective owes none.
* **What each answer to a moved goal does** → `Q26`, on the product manager, with extend, supersede and split each doing something recommended and a ❓ on the page. Folded as `shared-planning-agent-rounds-SC-47`, and `US7-TC2-1` recast onto what each answer does.
* **Where the product manager's read of the requirements is walked** → `Q27`. In `shared/planning/change-stages`, as the hand's move at Specified; here `shared-planning-agent-rounds-SC-06` states the two readings' exemption alone, and no journey and no case of this capability walks the read.
* **A remark that touches a page's marked lines** → `Q28`. From the product manager it is applied as written; from any other hand it becomes a ❓ line for the product manager. Folded as `shared-planning-agent-rounds-SC-16`, with `US2-TC7-1` added.

### Out of suite

* `shared-planning-agent-rounds-SC-06` - the two readings and no verifier over them: `pnpm check:manual`'s `blind` rule, which refuses a delta whose moved behaviour no second reading brought back.
* `shared-planning-agent-rounds-SC-10` - no record key changes a round's size: the store's unit tests over the round's size, which compute the readers from the diff and read no key.
* `shared-planning-agent-rounds-SC-23` - an open row holds no stage: `shared/planning/change-stages`' suite, where the stage's derivation is walked.
* `shared-planning-agent-rounds-SC-28` - every round reads one table: `pnpm run test:openspec`, which reads the perspectives the schema records per artifact.
* `shared-planning-agent-rounds-SC-29` - a new reader is one row: `pnpm run test:openspec`, as above.
* `shared-planning-agent-rounds-SC-30` - a reader sees no other reader's output: the store's unit tests over the round's dispatch, which give each challenger the draft and what is before it alone.
* `shared-planning-agent-rounds-SC-35` - the content id comparison: the store's unit tests over the content id, a pure derivation no surface shows.

### Anchors no case reaches

Every journey from `shared-planning-agent-rounds-US-01` to `shared-planning-agent-rounds-US-09` is walked. No case traces a feature set root group - this suite carries a section per journey - so a rule with no actor is reached through the journey that meets it, or listed out of suite above. `Your moves` is served by no scenario: every move a hand has is a rule somebody walks, and each scenario names that walk instead.
