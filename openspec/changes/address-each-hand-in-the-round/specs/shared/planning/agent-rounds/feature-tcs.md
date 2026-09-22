# shared/planning/agent-rounds Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## shared-planning-agent-rounds-US10: Product manager keeps their page through the build

**As a** product manager,
**I want** a line a build round puts on my page to reach me as a question with the line quoted, in a message that is mine,
**so that** my page says what I decided and I never learn of an edit from a diff.

### shared-planning-agent-rounds-US10-TC1-1: A line a build round puts on the page arrives as a question

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-10

**Pre-conditions:**

* <change> is building, and the round on <task group> changed one product line on <the page the change marks>.
* admin(product manager of <change>) is in <change thread>.

**Steps:**

1. Read the message addressed to the product manager.
2. Open <the page the change marks> on <change>'s branch.

**Expected Results:**

* The message is the product manager's own, not the group's summary.
* It quotes the line as it read before and as it reads after, as a ❓.
* The line on the page carries ❓, not an unmarked line.

### shared-planning-agent-rounds-US10-TC2-1: The product manager's answer is what the page says

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
* **Trace:** shared-planning-agent-rounds-US-10

**Pre-conditions:**

* A ❓ line a round put on <the page the change marks> is open on admin(product manager of <change>).
* admin(product manager of <change>) is in <change thread>.

**Steps:**

1. Answer the page question in <change thread> in wording of their own.
2. Open <the page the change marks> on <change>'s branch.
3. Read `decisions.md`.

**Expected Results:**

* The line reads what the product manager answered, no longer ❓.
* The answer and the product manager's handle are recorded.

### shared-planning-agent-rounds-US10-TC3-1: Several lines on one page arrive in one message

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
* **Trace:** shared-planning-agent-rounds-US-10

**Pre-conditions:**

* The round on <task group> changed three product lines on <the page the change marks>.
* admin(product manager of <change>) is in <change thread>.

**Steps:**

1. Read the messages addressed to the product manager.
2. Open <the page the change marks> on <change>'s branch.

**Expected Results:**

* One message reaches the product manager for the round.
* Each of the three lines is quoted before and after, as a ❓.
* Each line on the page carries ❓.

### shared-planning-agent-rounds-US10-TC4-1: A round that touches no product line sends the product manager nothing

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
* **Trace:** shared-planning-agent-rounds-US-10

**Pre-conditions:**

* The round on <task group> changed code and tests only, and <the page the change marks> is as `main` holds it.
* admin(product manager of <change>) is in <change thread>.

**Steps:**

1. Read the messages addressed to the product manager after the round.
2. Read the summary addressed to admin(engineer of <change>).

**Expected Results:**

* No message reaches the product manager for the round.
* The engineer's summary carries no page question.

### shared-planning-agent-rounds-US10-TC5-1: Another hand cannot decide a line on the product manager's page

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
* **Trace:** shared-planning-agent-rounds-US-10

**Pre-conditions:**

* A ❓ line a round put on <the page the change marks> is open on admin(product manager of <change>).
* admin(engineer of <change>) is in <change thread>.

**Steps:**

1. Reply to the page question with an answer, as the engineer.
2. Open <the page the change marks> on <change>'s branch.
3. Read the reply.

**Expected Results:**

* The line is unchanged and still ❓.
* The question stays open on the product manager.

### shared-planning-agent-rounds-US10-TC6-1: A landing never turns the page question into a decided line

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-10

**Pre-conditions:**

* A ❓ line the round on <task group> put on <the page the change marks> is open and unanswered.
* admin(engineer of <change>) is in <change thread>.

**Steps:**

1. Say land for <task group> in <change thread>, as the engineer.
2. Open <the page the change marks> on `main`.
3. Read `decisions.md` on `main`.

**Expected Results:**

* No line on the page reads as decided by the round: the line is ❓ or absent.
* Nothing records the round as having decided the line.

### shared-planning-agent-rounds-US10-TC7-1: A page written first for a new capability resolves

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-planning-agent-rounds-US-10

**Pre-conditions:**

* <change>'s `proposal.md` names <new capability> and is in flight.
* A page under `docs/prds/` names `spec: <new capability>`, and no delta for <new capability> exists under <change>'s specs.
* admin(product manager of <change>) is in a terminal at the store's root.

**Steps:**

1. Run `pnpm check:manual`.
2. Read the findings.

**Expected Results:**

* No finding says the page's capability does not resolve.
* The page is counted against the proposal that names <new capability>.

---

## shared-planning-agent-rounds-US11: QA is asked when the suite lands

**As a** QA engineer,
**I want** to be asked to review the suite on the landing that puts it up for review, and to know the walk waits on my review,
**so that** the review is on time and no walk carries an id I have not signed.

### shared-planning-agent-rounds-US11-TC1-1: The requirements' landing tells QA the suite is up for review

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-11

**Pre-conditions:**

* <change>'s `spec.md` and `feature-tcs.md` are drafted on its branch, the suite `pending-review`.
* admin(product manager of <change>) is in <change thread>.
* admin(qa of <change>) is in <change thread>.

**Steps:**

1. Say land for the requirements in <change thread>, as the product manager.
2. Read the messages addressed to QA.
3. Check `main`.

**Expected Results:**

* QA receives a message that is theirs, in the same landing, naming the suite and that it is up for review.
* `spec.md` and `feature-tcs.md` are on `main` together.

### shared-planning-agent-rounds-US11-TC2-1: The walk group names QA's review as its input

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
* **Trace:** shared-planning-agent-rounds-US-11

**Pre-conditions:**

* <change>'s `tasks.md` is drafted on its branch, and its `feature-tcs.md` is `pending-review` on `main`.
* admin(qa of <change>) is in <change thread>.

**Steps:**

1. Open `tasks.md` on <change>'s branch.
2. Read the walk group.

**Expected Results:**

* The walk group names the review of `feature-tcs.md` as its input.
* No other group names the review.

### shared-planning-agent-rounds-US11-TC3-1: A walk citing a draft case id is refused in the application repository

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
* **Trace:** shared-planning-agent-rounds-US-11

**Pre-conditions:**

* <case id> is a `draft` case of <change>'s `feature-tcs.md`.
* The walk in the application repository carries `[<case id>]` on one test.
* admin(engineer of <change>) is in a terminal at the application repository's root.

**Steps:**

1. Run `pnpm plan`.
2. Read the output.

**Expected Results:**

* The walk is refused.
* The output names <case id> and says its case is still `draft`.

### shared-planning-agent-rounds-US11-TC4-1: The same walk passes once QA has signed the case

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
* **Trace:** shared-planning-agent-rounds-US-11

**Pre-conditions:**

* <case id> is an `actual` case of <change>'s `feature-tcs.md`.
* The walk in the application repository carries `[<case id>]` on one test.
* admin(engineer of <change>) is in a terminal at the application repository's root.

**Steps:**

1. Run `pnpm plan`.
2. Read the output.

**Expected Results:**

* No refusal names <case id>.

### shared-planning-agent-rounds-US11-TC5-1: One draft id among signed ones refuses the walk

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-agent-rounds-US-11

**Pre-conditions:**

* The walk in the application repository carries three case ids: two `actual`, one `draft`.
* admin(engineer of <change>) is in a terminal at the application repository's root.

**Steps:**

1. Run `pnpm plan`.
2. Read the output.

**Expected Results:**

* The walk is refused.
* The output names the `draft` id alone.

### shared-planning-agent-rounds-US11-TC6-1: A suite's Manual table is refused where it is written

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
* **Testability:** automation
* **Trace:** shared-planning-agent-rounds-US-11

**Pre-conditions:**

* <change>'s `feature-tcs.md` carries a `### Manual` table.
* admin(qa of <change>) is in a terminal at the store's root.

**Test data:**

| The suite's shape | What is wrong |
| --- | --- |
| The Manual table sits outside `## Reconciliation` | the place |
| A Manual row's reason is a scenario id | the reason |
| The header carries no `**Out of suite:**` line | the header |

**Steps:**

1. Write the suite in the shape from the table.
2. Run `pnpm run tcs:validate`.
3. Read the output.

**Expected Results:**

* The suite is refused, naming the file and what is wrong.
* The refusal comes from the validation, before any fold.

---

## shared-planning-agent-rounds-US12: Engineer lands an application group's row

**As an** engineer,
**I want** the group's row to land through the command with the tests it names in the application repository, and to be refused when a cited test carries no such id,
**so that** the record is written the same way for every group and never credits a file for what it does not prove.

### shared-planning-agent-rounds-US12-TC1-1: A row naming the application repository before each test path lands

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-agent-rounds-US-12

**Pre-conditions:**

* <task group>'s code and tests are on <change>'s branch in the application repository, and the submodule's pin holds <application test>.
* <application test> cites the scenario ids the row credits it for.
* admin(engineer of <change>) is in a terminal where the landing runs.

**Steps:**

1. Run the land command for <task group> with `--tests` naming the application repository before <application test>'s path.
2. Read <task group>'s row in `rounds.md`.
3. Read the reply.

**Expected Results:**

* The row lands with the repository named before the path.
* Nothing is refused, and the reply names the row.

### shared-planning-agent-rounds-US12-TC2-1: A Decided-by path in the application repository resolves where the landing runs

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-planning-agent-rounds-US-12

**Pre-conditions:**

* A case in <change>'s `feature-tcs.md` is `automated`, its `**Decided by:**` naming the application repository before a path the submodule's pin holds.
* admin(engineer of <change>) is in a terminal where the landing runs.

**Steps:**

1. Run `pnpm run tcs:validate`.
2. Read the output.

**Expected Results:**

* The path resolves through the submodule.
* No refusal names the case or the path.

### shared-planning-agent-rounds-US12-TC3-1: A test path the pin holds no file at is refused

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
* **Trace:** shared-planning-agent-rounds-US-12

**Pre-conditions:**

* The submodule's pin holds no file at <missing test path>.
* admin(engineer of <change>) is in a terminal where the landing runs.

**Steps:**

1. Run the land command for <task group> with `--tests` naming the application repository before <missing test path>.
2. Read the output.
3. Check `main`.

**Expected Results:**

* The landing is refused, naming <missing test path> and the pin.
* No row lands, and `main` is unchanged.

### shared-planning-agent-rounds-US12-TC4-1: A cited test that does not carry the credited id is refused

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
* **Trace:** shared-planning-agent-rounds-US-12

**Pre-conditions:**

* <application test> exists at the submodule's pin and cites none of <credited id>.
* admin(engineer of <change>) is in a terminal where the landing runs.

**Test data:**

| Where the credit is written | The landing |
| --- | --- |
| The `--tests` cell of <task group>'s row names <application test> for <credited id> | the land command for <task group> |
| A `### Manual` row of <change>'s `feature-tcs.md` names <application test> for <credited id> | the land command for the suite |

**Steps:**

1. Run the landing from the table.
2. Read the output.
3. Check `main`.

**Expected Results:**

* The landing is refused, naming <application test> and <credited id>.
* Nothing lands on `main`.

### shared-planning-agent-rounds-US12-TC5-1: A test citing several ids is credited for the one the row names

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
* **Trace:** shared-planning-agent-rounds-US-12

**Pre-conditions:**

* <application test> cites three scenario ids, <credited id> among them.
* admin(engineer of <change>) is in a terminal where the landing runs.

**Steps:**

1. Run the land command for <task group> with `--tests` crediting <application test> for <credited id>.
2. Read <task group>'s row in `rounds.md`.

**Expected Results:**

* The row lands, crediting <application test> for <credited id>.

### shared-planning-agent-rounds-US12-TC6-1: A lane that did not run says so first and ticks nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-12

**Pre-conditions:**

* The environment cannot start <task group>'s test lane, and the group's tests and code are written on <change>'s branch.
* admin(engineer of <change>) is in a terminal where the landing runs.

**Steps:**

1. Run the land command for <task group>.
2. Read <task group>'s row in `rounds.md`.
3. Read `tasks.md` and the walk's rows in `feature-tcs.md`.

**Expected Results:**

* The row begins `written, not run`.
* <task group>'s tasks are unticked.
* The walk's rows in the suite read as conditional on the lane running.

### shared-planning-agent-rounds-US12-TC7-1: A later row saying the lane ran ticks the tasks

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
* **Trace:** shared-planning-agent-rounds-US-12

**Pre-conditions:**

* <task group>'s row on `main` begins `written, not run`, its tasks unticked.
* The environment now starts the lane, and admin(engineer of <change>) is in a terminal where the landing runs.

**Steps:**

1. Run <task group>'s lane.
2. Run the land command for <task group> with the run's tests.
3. Read `rounds.md` and `tasks.md`.

**Expected Results:**

* A later row says the lane ran.
* <task group>'s tasks are ticked.
* The earlier row is unchanged.

### shared-planning-agent-rounds-US12-TC8-1: A reader or verifier on a fallback model is named in the row

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
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-12

**Pre-conditions:**

* The model of the agent from the table is unavailable for the round on <task group>, and its fallback runs.
* admin(engineer of <change>) is in <change thread>.

**Test data:**

| The agent | Named as |
| --- | --- |
| <a reader of the round> | `<a reader of the round> (fallback)` |
| the round's verifier | `<the verifier> (fallback)` |

**Steps:**

1. Run the round on <task group>.
2. Read the round's row in `rounds.md`.

**Expected Results:**

* The perspectives cell names the agent from the table with `(fallback)`.
* An agent that ran on its own model carries no suffix.

### shared-planning-agent-rounds-US12-TC9-1: A group landing prose alone is read by words, QA and the simpler thing

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
* **Trace:** shared-planning-agent-rounds-US-12

**Pre-conditions:**

* <task group> lands what the table names.
* admin(engineer of <change>) is in <change thread>.

**Test data:**

| What the group lands | Who reads it |
| --- | --- |
| Pages under `docs/` alone | the reader of words, QA and the simpler thing; no code reading |
| Pages under `docs/` and one code file | the reader of words, QA, the simpler thing and the build's code readings |

**Steps:**

1. Run the round on <task group>.
2. Read the round's row in `rounds.md`.

**Expected Results:**

* The perspectives cell names the readers from the table and no other.

---

## shared-planning-agent-rounds-US13: Hand reads one message that is theirs

**As a** hand,
**I want** the summary to show my moves alone, a held row for me to arrive with everything the answer needs quoted, and one reply to carry my answer and my remarks,
**so that** I decide from the message and never open a file to check a count.

### shared-planning-agent-rounds-US13-TC1-1: The summary shows a hand only the moves that are theirs

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-13

**Pre-conditions:**

* The round on <change>'s open artifact drafted it, holding one question for admin(hand A of <change>) and one held row for admin(hand B of <change>).
* admin(hand A of <change>) is in <change thread>.

**Steps:**

1. Read the summary addressed to hand A.

**Expected Results:**

* The summary lists hand A's moves on the artifact: the question to answer, remark, land.
* Hand B's held row is not in it.
* No footer tells any other hand to land.

### shared-planning-agent-rounds-US13-TC2-1: A held row for another hand is its own message with the facts quoted

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
* **Trace:** shared-planning-agent-rounds-US-13

**Pre-conditions:**

* The round on <change>'s open artifact holds one row for admin(hand B of <change>), which would put a sentence on <the page the change marks> and touches two decision rows.
* admin(hand B of <change>) is in <change thread>.

**Steps:**

1. Read the messages addressed to hand B.

**Expected Results:**

* One message is addressed to hand B for the row.
* It quotes the row, the sentence it would put on the page and the two decision rows it touches.
* Hand B can answer from the message without opening a file.

### shared-planning-agent-rounds-US13-TC3-1: A held row sent again is one message, not two

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
* **Trace:** shared-planning-agent-rounds-US-13

**Pre-conditions:**

* A held row for admin(hand B of <change>) has already reached them as its own message, unanswered.
* The round on the same artifact runs again with the row unchanged.

**Steps:**

1. Read the messages addressed to hand B.

**Expected Results:**

* Hand B has one message for the row.
* The message still quotes the row, the page sentence and the decision rows.

### shared-planning-agent-rounds-US13-TC4-1: One reply carries an answer and remarks, and the remark comes back first

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
* **Trace:** shared-planning-agent-rounds-US-13

**Pre-conditions:**

* A summary on <change>'s open artifact waits on admin(hand A of <change>), with <question id> open.
* admin(hand A of <change>) is in <change thread>.

**Steps:**

1. Reply once with `<question id>: <answer>` and a remark on the draft.
2. Read the replies.
3. Check `main`.

**Expected Results:**

* `decisions.md` records <answer> against <question id>.
* The remark is applied, and its result comes back to hand A.
* Nothing has landed on `main`.

### shared-planning-agent-rounds-US13-TC5-1: A finding several readers filed is one row naming them

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
* **Trace:** shared-planning-agent-rounds-US-13

**Pre-conditions:**

* Two readers of the round on <change>'s open artifact file the same finding.
* admin(hand of <change>'s open artifact) is in <change thread>.

**Steps:**

1. Read the summary.
2. Read the round's row in `rounds.md`.

**Expected Results:**

* The finding is one row, naming both readers.
* One verdict stands on it; no second verdict on the same finding disagrees.

### shared-planning-agent-rounds-US13-TC6-1: A round of one reader still verifies itself

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-13

**Pre-conditions:**

* The round on <change>'s open artifact summons one reader, the simpler thing, and it files one finding.
* admin(hand of <change>'s open artifact) is in <change thread>.

**Steps:**

1. Read the round's row in `rounds.md`.
2. Read the summary.

**Expected Results:**

* The finding was verified, and the row says what stood.
* The row names one verifier over the round.

### shared-planning-agent-rounds-US13-TC7-1: A hand with no move in a round is sent no summary

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
* **Trace:** shared-planning-agent-rounds-US-13

**Pre-conditions:**

* The round on <change>'s open artifact holds a question for admin(hand A of <change>) and nothing for admin(hand B of <change>).
* admin(hand B of <change>) is in <change thread>.

**Steps:**

1. Read the messages addressed to hand B after the round.

**Expected Results:**

* No summary and no held row reach hand B.

### shared-planning-agent-rounds-US13-TC8-1: The summary quotes what a test asserts, not its count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-13

**Pre-conditions:**

* The round on <task group> filed a finding about a list one of its tests asserts.
* admin(engineer of <change>) is in <change thread>.

**Steps:**

1. Read the summary addressed to the engineer.

**Expected Results:**

* The finding quotes the items the test asserts.
* No fact the answer needs is given as a number alone.

---

## shared-planning-agent-rounds-US14: Product manager answers a short interview

**As a** product manager,
**I want** the first round to ask me the two or three questions that change what is built, one of them whether to do it now, with the defaults it applied listed,
**so that** I spend the round on decisions, not confirmations.

### shared-planning-agent-rounds-US14-TC1-1: The first round asks at most three questions, one whether to do it now

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-14

**Pre-conditions:**

* admin(product manager) is in <planning channel>, and no change names what they are about to ask for.
* The sentence they will post leaves more than three choices open.

**Steps:**

1. Post the sentence in <planning channel>.
2. Read the reply in the thread it opens.
3. Count the numbered questions.

**Expected Results:**

* Two or three numbered questions are asked, no more.
* One asks whether to do it now.
* Each other question changes what is built.

### shared-planning-agent-rounds-US14-TC2-1: The defaults the round applied are listed as decided by the round

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
* **Trace:** shared-planning-agent-rounds-US-14

**Pre-conditions:**

* admin(product manager) is in <planning channel>, and no change names what they are about to ask for.
* The sentence they will post leaves more than three choices open.

**Steps:**

1. Post the sentence in <planning channel>.
2. Read the reply in the thread it opens.
3. Read `decisions.md` on the change's branch.

**Expected Results:**

* Every choice not asked is listed in the reply as a default the round applied.
* Each listed default is a decisions row marked decided by the round, not by the product manager.

### shared-planning-agent-rounds-US14-TC3-1: One reply overturns a listed default

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
* **Trace:** shared-planning-agent-rounds-US-14

**Pre-conditions:**

* The first round of <change> listed <default> as decided by the round.
* admin(product manager of <change>) is in <change thread>.

**Steps:**

1. Reply with a different value for <default>.
2. Read `decisions.md` on <change>'s branch.
3. Read the reply.

**Expected Results:**

* The row for <default> records the product manager's value and their handle.
* The reply says which artifacts are read again.

### shared-planning-agent-rounds-US14-TC4-1: A sentence that settles everything is still asked whether to do it now

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
* **Trace:** shared-planning-agent-rounds-US-14

**Pre-conditions:**

* admin(product manager) is in <planning channel>, and no change names what they are about to ask for.
* The sentence they will post settles every choice that changes what is built.

**Steps:**

1. Post the sentence in <planning channel>.
2. Read the reply in the thread it opens.

**Expected Results:**

* The reply asks whether to do it now.
* At most three questions are asked, and none asks to confirm what the sentence said.

### shared-planning-agent-rounds-US14-TC5-1: A fact the sentence states is not asked back as a question

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-planning-agent-rounds-US-14

**Pre-conditions:**

* admin(product manager) is in <planning channel>, and no change names what they are about to ask for.
* The sentence they will post states <a fact the round would otherwise ask>.

**Steps:**

1. Post the sentence in <planning channel>.
2. Read the reply in the thread it opens.
3. Read `decisions.md` on the change's branch.

**Expected Results:**

* No question asks to confirm <a fact the round would otherwise ask>.
* The fact is recorded as the product manager's, from the sentence.
