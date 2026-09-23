# shared/planning/agent-rounds Specification

## Purpose

How an artifact is written and read again — extended: whom a round addresses
and when, how a task group is sized by what it lands, how the record names a
test in the application repository, and what the checks refuse and let
through.

## Feature set

- Addressed
  - Own moves: a summary shows the hand of the stage the moves that are theirs
  - Held row as a reply: a held row for another hand is the round's own reply in the thread, mentioning that hand, posted once, with the row, the page sentence and the decision rows it touches quoted
  - Page line as a question: a line a build round puts on a page reaches the product manager as ❓, the line quoted before and after
  - Review asked: the requirements' landing is a move to QA, and the walk group names the review as its input
  - One reply, several moves: a reply carries one answer and remarks; a remark comes back before anything lands
- Sized
  - Short interview: at most three questions, one whether to do it now, the defaults listed as decided
  - Sized by what it lands: a task group's readers are summoned by its diff, the build's four on code, the reader of words on words
  - Fallback named: a reader or verifier that ran on a fallback model is named in the row and the summary; a dispatch the vendor killed stops the round
- Recorded
  - Paths by the group's tag: a row's paths are bare and live where the group's repository tag says; the landing resolves an application group's paths in the clone it runs beside
  - Cited test carries the id: a row or a Manual row crediting a test the file does not cite is refused
  - Written, not run: a group whose lane did not run says so first, keeps its tasks unticked and its Manual rows conditional
- Checked
  - Page first: a page naming a capability an in-flight change declares resolves
  - Wait inside a design: a written design may wait on its frame
  - Deltas across changes: two in-flight deltas that fold one requirement are named to each other, however each is headed
  - Manual where written: a Manual table outside the reconciliation is refused where the suite is validated
  - Walk ids signed: the application repository's tick refuses a walk id whose case is not actual

## ADDED Requirements

### Requirement: A summary addresses one hand

The summary a round posts SHALL show the hand of the stage the moves that are theirs and no other hand's; a held row addressed to another hand SHALL be posted as the round's own reply in the change's thread, mentioning that hand, once per change, round and row, carrying the row's question, the sentence it would put on the page, and every decision row it touches quoted; and a reply from a hand MAY carry one answer and any number of remarks, a remark being applied and read again before anything lands.

#### Scenario: shared-planning-agent-rounds-SC-86 - A held row for QA is QA's reply
**Serves:** shared-planning-agent-rounds-US-13 - the hand reads their moves and QA reads the row that is theirs

- **GIVEN** a build round on the engineer's group raises a row addressed to QA
- **WHEN** the round posts
- **THEN** the engineer's summary lists the engineer's moves alone and names the row as held
- **AND** one reply in the thread mentions QA and carries the row, the sentence it would put on the page, and the decision rows it touches, quoted
- **AND** a re-run of the same round posts that reply no second time
- **AND** the engineer's summary offers `land with recommendations` only while that row is open

#### Scenario: shared-planning-agent-rounds-SC-87 - One reply, an answer and remarks
**Serves:** shared-planning-agent-rounds-US-13 - one reply carries the hand's answer and remarks

- **GIVEN** a hand's reply carries `Q7: yes` and two remarks
- **WHEN** the round reads it
- **THEN** the answer is written into row Q7, each remark is applied as written and read again by the perspectives it summons, and the draft comes back to the hand before anything lands

### Requirement: A line a build round puts on a page is the product manager's question

A product detail a build round lands on a page — from a fix pass, a decided row or a reader's finding — SHALL be written as a ❓ line naming the change's product manager, never as decided by the round, and the reply to the product manager SHALL quote the page's line before and after the change, nothing before for a line added and nothing after for a line removed; the line SHALL hold no landing, and once answered SHALL carry 🚧 until the change that delivers it archives.

#### Scenario: shared-planning-agent-rounds-SC-88 - A build round's product line reaches the product manager
**Serves:** shared-planning-agent-rounds-US-10 - the product manager's page changes only on their word

- **GIVEN** a build round's verifier stands a finding that a card just taken in shows its picks alone
- **WHEN** the round writes the page
- **THEN** the page's Similar Cards section gains a ❓ line naming the product manager and the outcome
- **AND** the product manager's reply quotes the section's lines before and after
- **AND** the group's landing is not held on the line

### Requirement: QA is a hand of Specified

The landing of `spec.md` and `feature-tcs.md` SHALL be a move to the `qa` hand: the turn message every hand gets SHALL reach them naming the suite's path, its case count and `/tcs-review <change>`, the role's channel where the record names no QA; and the plan's walk group SHALL name the suite's review as an input beside the groups it needs.

#### Scenario: shared-planning-agent-rounds-SC-89 - The suite's landing tells QA
**Serves:** shared-planning-agent-rounds-US-11 - QA is asked the day the suite lands

- **GIVEN** the product manager says `land` on the requirements
- **WHEN** the landing runs
- **THEN** QA receives one turn message naming the suite's path, its case count and the review command
- **AND** a second push leaving the change in Specified sends it no second time

#### Scenario: shared-planning-agent-rounds-SC-90 - The walk names the review
**Serves:** shared-planning-agent-rounds-US-11 - the walk names QA's review as its input

- **GIVEN** the plan's walk group
- **WHEN** the plan is validated
- **THEN** the group's preamble names the suite's review as an input, and a plan whose walk group names none is refused

### Requirement: The interview asks what changes what is built

The first round's interview SHALL ask at most three questions, each one whose answer changes what is built and one of them whether to do the change now, alone when nothing else is open; SHALL list every default it applies as decided by the round in the same message; and on `not now` SHALL write a wait on the product manager and draft nothing ahead.

#### Scenario: shared-planning-agent-rounds-SC-91 - Three questions and the defaults
**Serves:** shared-planning-agent-rounds-US-14 - the product manager spends the round on decisions

- **GIVEN** a first sentence whose frontier holds ten open points
- **WHEN** the interview is posted
- **THEN** it asks at most three, one of them whether to do the change now, and lists the seven it decided with the option each took
- **AND** a sentence that leaves nothing else open is asked whether to do it now, alone

### Requirement: A task group is sized by what it lands

The `apply` block's perspectives SHALL carry `when:` triggers read from the group's diff as an artifact's are: the build's four readings on `code`, the reader of words on `copy`, QA and the simpler thing always; a group that lands prose alone SHALL be read by the reader of words, QA and the simpler thing, one that lands code by the build's four readings, QA and the simpler thing, and one that lands both by all.

#### Scenario: shared-planning-agent-rounds-SC-92 - A prose group summons the page's readers
**Serves:** shared-planning-agent-rounds-US-13 - a hand's prose is read by the reader of words, not the build

- **GIVEN** a task group whose diff touches manual pages and a suite alone
- **WHEN** its readers are computed
- **THEN** the reader of words, QA and the simpler thing are summoned and the build's four readings are not

#### Scenario: shared-planning-agent-rounds-SC-93 - A code group summons the build
**Serves:** shared-planning-agent-rounds-US-12 - the engineer's code is read by the build

- **GIVEN** a task group whose diff touches a package and no page
- **WHEN** its readers are computed
- **THEN** the build's four readings, QA and the simpler thing are summoned and the reader of words is not

### Requirement: A fallback is named and a killed dispatch stops the round

A reader or verifier the round ran on the fallback model — `sonnet`, unless the definition already names it — SHALL be named in the row's perspectives cell and the summary's perspectives line as `<name> (fallback)`, written from the model the run reports; the landing SHALL accept that suffix alone and hold the name to the schema's list with it stripped; a dispatch the vendor killed SHALL be retried once on the fallback, and a reader still missing SHALL stop the round before the summary, the thread told which reader it lacks.

#### Scenario: shared-planning-agent-rounds-SC-95 - A verifier that fell back
**Serves:** shared-planning-agent-rounds-US-12 - the engineer's row says which reader fell back

- **GIVEN** a verifier ran on the fallback model after its model's dispatch was killed
- **WHEN** the row is written
- **THEN** its perspectives cell reads `verifier (fallback)`, the summary's perspectives line reads the same, and the landing accepts it
- **AND** a cell reading `verifier (banana)` is refused

#### Scenario: shared-planning-agent-rounds-SC-105 - A reader the fallback could not run
**Serves:** shared-planning-agent-rounds-US-13 - the hand is told the round is short a reader, not handed a thinner summary

- **GIVEN** a reader's dispatch is killed twice, once on its model and once on the fallback
- **WHEN** the round reaches the summary
- **THEN** no summary is posted, the thread names the reader the round lacks, and no row lands

### Requirement: A row's paths live where the group's tag says

A `--tests` path SHALL be bare, and the group's repository tag SHALL say which clone holds it; the landing SHALL resolve an application group's paths in the application clone it runs beside — `--app-root <dir>` when given, otherwise the clone the store's superproject names — and SHALL refuse a path that clone holds no file at, or a landing that reaches no clone, naming the path and the root it looked in.

#### Scenario: shared-planning-agent-rounds-SC-96 - An application group's row lands
**Serves:** shared-planning-agent-rounds-US-12 - the engineer lands an application group's row through the command

- **GIVEN** a group tagged `grade10` whose tests cell names `apps/frontend/grade10/src/pages/store/ProductPage.test.tsx`
- **WHEN** the landing runs against the store clone from inside the application repository
- **THEN** the path resolves in the application clone and the row lands

#### Scenario: shared-planning-agent-rounds-SC-97 - A path the application clone does not hold
**Serves:** shared-planning-agent-rounds-US-12 - a row never names a file that is not there

- **GIVEN** the same group and a tests cell naming a path the application clone holds no file at
- **WHEN** the landing runs
- **THEN** it is refused, naming the path and the root it looked in
- **AND** the same landing run where no application clone is reachable is refused naming the group's tag

### Requirement: A cited test carries the id it is credited for

One helper in `scripts/openspec/lib/` SHALL read a file for an id with a boundary after it, so `SC-1` never matches `SC-12`; the landing SHALL refuse a `--tests` entry whose resolved file carries no such scenario id, and the suite's validation SHALL refuse a Manual row whose named test resolves in this store and carries no such case id, skipping a path this store does not hold.

#### Scenario: shared-planning-agent-rounds-SC-98 - A file credited for an id it does not carry
**Serves:** shared-planning-agent-rounds-US-12 - a row never credits a file for what it does not prove

- **GIVEN** a tests cell crediting a serving test for the rail's first scenario, and the file carries the rail's twelfth and not the first
- **WHEN** the landing runs with the path resolved
- **THEN** it is refused, naming the path and the id

#### Scenario: shared-planning-agent-rounds-SC-106 - A Manual row's test carries no such case
**Serves:** shared-planning-agent-rounds-US-11 - QA's Manual table credits only what a test proves

- **GIVEN** a Manual row naming a story in this store for a case the story never cites, and a second row naming a walk in the application repository
- **WHEN** the suite is validated
- **THEN** the first row is refused naming the path and the case id, and the second is skipped

### Requirement: A group whose lane did not run says so first

A landing on a group whose verify lane could not run SHALL take `--unrun "<why>"` and SHALL write `written, not run — <why>` as the first clause of the row's stood cell; the group's tasks SHALL stay unticked and the suite's Manual rows naming its walk SHALL read `to be walked in` until the run that ran the lane writes the row that says so and rewrites them; nothing SHALL refuse the tick on the clause.

#### Scenario: shared-planning-agent-rounds-SC-99 - An unrun walk keeps its tasks unticked
**Serves:** shared-planning-agent-rounds-US-12 - an unrun lane is said first and ticked later

- **GIVEN** the walk group's row lands with `--unrun "no Docker daemon"`
- **WHEN** the row and the suite are read
- **THEN** the stood cell opens `written, not run — no Docker daemon`, the group's tasks are unticked, and each Manual row naming the walk reads `to be walked in`
- **AND** the run that later ran the lane lands a row without the clause, ticks the tasks and rewrites the rows

### Requirement: The checks refuse only what is wrong

The manual's checks SHALL count a capability a change declares as a `specs/<capability>/` directory among the changing, so a page whose `spec:` names it resolves before the delta exists; SHALL let a written design wait on its frame, refusing only a wait that names nothing; SHALL name two in-flight deltas that fold one requirement to each other however each is headed. The suite's validation SHALL refuse a `### Manual` outside `## Reconciliation` on a suite that carries a reconciliation, and the fold's strip SHALL cover the Manual rows.

#### Scenario: shared-planning-agent-rounds-SC-100 - A page written first resolves
**Serves:** shared-planning-agent-rounds-US-10 - the product manager's page written first is not refused

- **GIVEN** a new page names `spec: grade10-site/store/cross-sell` and the change holds `specs/grade10-site/store/cross-sell/user-journeys.md` and no delta yet
- **WHEN** `check:manual` runs
- **THEN** the reference resolves

#### Scenario: shared-planning-agent-rounds-SC-101 - A written design waits on its frame
**Serves:** shared-planning-agent-rounds-US-15 - the designer's written design lands with its wait

- **GIVEN** `ui-design.md` is written and the record waits `awaiting: ui-design: "2026-09-24, the frame for the rail - @tangconst"`
- **WHEN** `check:manual` runs
- **THEN** the wait stands and is listed, and a wait naming nothing is refused where the record is read

#### Scenario: shared-planning-agent-rounds-SC-102 - Two deltas on one requirement
**Serves:** shared-planning-agent-rounds-US-16 - the engineer reads both changes before building on either

- **GIVEN** one change's delta carries a MODIFIED block on a requirement and another change's delta an ADDED block of the same name
- **WHEN** `check:manual` runs
- **THEN** each change is named to the other with the other's heading, and the check fails

#### Scenario: shared-planning-agent-rounds-SC-103 - A Manual table outside the reconciliation
**Serves:** shared-planning-agent-rounds-US-11 - QA's suite is refused where it is written, not at the fold

- **GIVEN** a suite carrying `## Reconciliation` whose `### Manual` sits under a journey
- **WHEN** the suite is validated
- **THEN** it is refused, naming the section the table belongs under

### Requirement: The application repository's tick refuses an unsigned walk id

`pnpm plan done` SHALL read every bracketed case id in the group's end-to-end files, in the pass that reads a task's scenario ids, and SHALL refuse the tick for one whose case is not `actual` in the store clone the registry names — draft, deprecated, or not issued — naming the id and its status.

#### Scenario: shared-planning-agent-rounds-SC-104 - A walk carrying a draft case's id
**Serves:** shared-planning-agent-rounds-US-11 - no walk carries an id QA has not signed

- **GIVEN** a spec's test is titled with a case id whose case is `draft`
- **WHEN** the engineer ticks the walk's group
- **THEN** the tick is refused naming the id and its status
- **AND** the same tick passes once the case is `actual`
