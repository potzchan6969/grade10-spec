# shared/planning/agent-rounds Specification

## Purpose

How an artifact is written and read again — extended: whom a round addresses
and when, how a round is sized by what it lands, how the record names a test
in the application repository, and what the checks refuse and let through.

## Feature set

- Addressed
  - Own moves: a summary shows the hand of the stage the moves that are theirs
  - Held row as a message: a held row for another hand is its own keyed message, with the row, the page sentence and the decision rows it touches quoted
  - Page line as a question: a line a round puts on a page reaches the product manager as ❓, the line quoted before and after
  - Review asked: the requirements' landing tells QA the suite is up for review, and the walk group names the review as its input
  - One reply, several moves: a reply carries one answer and remarks; a remark comes back before anything lands
- Sized
  - Short interview: at most three questions, one whether to do it now, the defaults listed as decided
  - Prose group: a task group that lands prose alone is read by the reader of words, QA and the simpler thing
  - Verified together: one verifier reads a round's readings; a finding several readers filed is one row naming them
  - Fallback named: a reader or verifier that ran on a fallback model is named in the row
- Recorded
  - Repository per path: a `--tests` path and a `**Decided by:**` path may name a repository, resolved where the landing runs
  - Cited test carries the id: a row or a Manual row crediting a test the file does not cite is refused
  - Written, not run: a group whose lane did not run says so first, and its tasks do not tick until a later row says it ran
- Checked
  - Page first: a page naming a capability an in-flight proposal names resolves
  - Wait inside a design: a written design may wait on its frame
  - Scenarios across deltas: two in-flight deltas on one requirement whose scenarios state opposite outcomes are refused
  - Manual where written: a suite's Manual table is refused where it is written
  - Walk ids signed: the application repository refuses a walk id whose case is draft

## ADDED Requirements

### Requirement: A summary addresses one hand

The summary a round posts SHALL show the hand of the stage the moves that are theirs and no other hand's; a held row addressed to another hand SHALL be sent to that hand as its own keyed message carrying the row's question, the sentence it would put on the page, and every decision row it touches quoted; and a reply from a hand MAY carry one answer and any number of remarks, a remark being applied and read again before anything lands.

#### Scenario: shared-planning-agent-rounds-SC-86 - A held row for QA is QA's message
**Serves:** shared-planning-agent-rounds-US-13 - the hand reads their moves and QA reads the row that is theirs

- **GIVEN** a build round on the engineer's group raises a row addressed to QA
- **WHEN** the round posts
- **THEN** the engineer's summary lists the engineer's moves alone and names the row as held
- **AND** QA receives one message carrying the row, the sentence it would put on the page, and the decision rows it touches, quoted
- **AND** the engineer's summary offers `land with recommendations` only while that row is open

#### Scenario: shared-planning-agent-rounds-SC-87 - One reply, an answer and remarks
**Serves:** shared-planning-agent-rounds-US-13 - one reply carries the hand's answer and remarks

- **GIVEN** a hand's reply carries `Q7: yes` and two remarks
- **WHEN** the round reads it
- **THEN** the answer is written into row Q7, each remark is applied as written and read again by the perspectives it summons, and the draft comes back to the hand before anything lands

### Requirement: A line a round puts on a page is the product manager's question

A product detail a round lands on a page — from a fix pass, a decided row or a reader's finding — SHALL be written as a ❓ line naming the product manager, never as decided by the round, and the message to the product manager SHALL quote the page's line before and after the change.

#### Scenario: shared-planning-agent-rounds-SC-88 - A build round's product line reaches the product manager
**Serves:** shared-planning-agent-rounds-US-10 - the product manager's page changes only on their word

- **GIVEN** a build round's verifier stands a finding that a card just taken in shows its picks alone
- **WHEN** the round writes the page
- **THEN** the page's Similar Cards section gains a ❓ line naming the product manager and the outcome
- **AND** the product manager's message quotes the section's lines before and after

### Requirement: QA is asked on the requirements' landing

The landing of `spec.md` and `feature-tcs.md` SHALL send the `qa` hand one message naming the suite, its case count and that the walk waits on the review; and the plan's walk group SHALL name the suite's review as an input beside the groups it needs.

#### Scenario: shared-planning-agent-rounds-SC-89 - The suite's landing tells QA
**Serves:** shared-planning-agent-rounds-US-11 - QA is asked the day the suite lands

- **GIVEN** the product manager says `land` on the requirements
- **WHEN** the landing runs
- **THEN** QA receives one message naming the suite's path, its case count and the walk that waits on the review

#### Scenario: shared-planning-agent-rounds-SC-90 - The walk names the review
**Serves:** shared-planning-agent-rounds-US-11 - the walk waits on QA's review by name

- **GIVEN** the plan's walk group
- **WHEN** the plan is validated
- **THEN** the group's preamble names the suite's review as an input, and a plan whose walk group names none is refused

### Requirement: The interview asks what changes what is built

The first round's interview SHALL ask at most three questions, each one whose answer changes what is built and one of them whether to do the change now, and SHALL list every default it applies as decided by the round in the same message.

#### Scenario: shared-planning-agent-rounds-SC-91 - Three questions and the defaults
**Serves:** shared-planning-agent-rounds-US-14 - the product manager spends the round on decisions

- **GIVEN** a first sentence whose frontier holds ten open points
- **WHEN** the interview is posted
- **THEN** it asks at most three, one of them whether to do the change now, and lists the seven it decided with the option each took

### Requirement: A round is sized by what it lands

A task group that lands prose alone SHALL be read by the reader of words, QA and the simpler thing; one that lands code SHALL be read by the build's four readings, QA and the simpler thing; one that lands both by all; the `apply` block's perspectives SHALL carry `when:` triggers read from the group's diff as an artifact's are.

#### Scenario: shared-planning-agent-rounds-SC-92 - A prose group summons the page's readers
**Serves:** shared-planning-agent-rounds-US-13 - a hand's prose is read by the reader of words, not the build

- **GIVEN** a task group whose diff touches manual pages and a suite alone
- **WHEN** its readers are computed
- **THEN** the reader of words, QA and the simpler thing are summoned and the build's four readings are not

#### Scenario: shared-planning-agent-rounds-SC-93 - A code group summons the build
**Serves:** shared-planning-agent-rounds-US-12 - the engineer's code is read by the build

- **GIVEN** a task group whose diff touches a package
- **WHEN** its readers are computed
- **THEN** the build's four readings, QA and the simpler thing are summoned

### Requirement: One verifier reads a round's readings

A round that dispatched two or more readers SHALL dispatch one verifier with every reader's findings, and the verifier's table SHALL carry one row per kind of finding naming every reader that filed it; a round of one reader verifies itself.

#### Scenario: shared-planning-agent-rounds-SC-94 - One finding, four readers, one verdict
**Serves:** shared-planning-agent-rounds-US-13 - a hand reads one verdict per finding

- **GIVEN** four readers each file the same order-assertion finding
- **WHEN** the round verifies
- **THEN** one verifier returns one row for it naming the four, with one verdict

### Requirement: A fallback model is named in the row

A reader or verifier the round ran on a fallback model SHALL be named in the row's perspectives cell as `<name> (fallback)`, and the landing SHALL hold the name to the schema's list with the suffix stripped.

#### Scenario: shared-planning-agent-rounds-SC-95 - A verifier that fell back
**Serves:** shared-planning-agent-rounds-US-12 - the engineer's row says which reader fell back

- **GIVEN** a verifier ran on the fallback model after its model refused twice
- **WHEN** the row is written
- **THEN** its perspectives cell reads `verifier (fallback)` and the landing accepts it

### Requirement: The record names the repository with a path

A `--tests` path and a `**Decided by:**` path MAY take the form `<repository>:<path>` where the repository is a task group tag the plan issues; a bare path is this store's. The landing SHALL resolve a path tagged for this store against the store, a path tagged for another repository against `--app-root` when given, and SHALL mark a tagged path it could not resolve `(unresolved)` in the row; it SHALL refuse a store path that does not exist.

#### Scenario: shared-planning-agent-rounds-SC-96 - An application group's row lands
**Serves:** shared-planning-agent-rounds-US-12 - the engineer lands an application group's row through the command

- **GIVEN** a group tagged `grade10` whose tests cell names `grade10:apps/frontend/grade10/src/pages/store/ProductPage.test.tsx`
- **WHEN** the landing runs from the application repository with `--app-root .`
- **THEN** the path resolves there and the row lands

#### Scenario: shared-planning-agent-rounds-SC-97 - A tagged path with no root to resolve against
**Serves:** shared-planning-agent-rounds-US-12 - a row lands where the landing cannot see the application repository

- **GIVEN** the same cell and no `--app-root`
- **WHEN** the landing runs
- **THEN** the row lands with `(unresolved)` after the path

### Requirement: A cited test carries the id it is credited for

The landing SHALL refuse a `--tests` entry whose resolved file does not contain the scenario id it is credited for, and the suite's validation SHALL warn on a Manual row whose named test, where it resolves in this store, cites neither the row's case nor a scenario id of the capability.

#### Scenario: shared-planning-agent-rounds-SC-98 - A file credited for an id it does not carry
**Serves:** shared-planning-agent-rounds-US-12 - a row never credits a file for what it does not prove

- **GIVEN** a tests cell crediting a serving test for the rail's first scenario, and the file contains no such id
- **WHEN** the landing runs with the path resolved
- **THEN** it is refused, naming the path and the id

### Requirement: A group whose lane did not run says so first

A landing on a group whose verify lane could not run SHALL take `--unrun "<why>"`, SHALL write `written, not run — <why>` as the first clause of the row's stood cell, and the group's tasks SHALL not tick until a later row on the same group carries no such clause.

#### Scenario: shared-planning-agent-rounds-SC-99 - An unrun walk keeps its ticks
**Serves:** shared-planning-agent-rounds-US-12 - an unrun lane keeps its ticks

- **GIVEN** the walk group's row lands with `--unrun "no Docker daemon"`
- **WHEN** the engineer ticks the group's tasks
- **THEN** the tick is refused naming the row, until a row on the group without the clause lands

### Requirement: The checks refuse only what is wrong

The manual's checks SHALL resolve a page whose `spec:` names a capability an in-flight proposal names under New Capabilities; SHALL let a written design wait on its frame where the wait names what is wanted; SHALL refuse two in-flight deltas on one requirement whose scenarios share a GIVEN and state opposite outcomes, however each delta is headed. The suite's validation SHALL refuse, on a suite in a change carrying `decisions.md`, a `### Manual` outside `## Reconciliation`, a scenario id as a Manual row's reason, and an out-of-suite declaration with no `**Out of suite:**` header line.

#### Scenario: shared-planning-agent-rounds-SC-100 - A page written first resolves
**Serves:** shared-planning-agent-rounds-US-10 - the product manager's page written first is not refused

- **GIVEN** a new page names `spec: grade10-site/store/cross-sell` and the change's proposal names that capability as new, with no delta yet
- **WHEN** `check:manual` runs
- **THEN** the reference resolves

#### Scenario: shared-planning-agent-rounds-SC-101 - A written design waits on its frame
**Serves:** shared-planning-agent-rounds-US-13 - a designer's written design may wait on its frame

- **GIVEN** `ui-design.md` is written and the record waits `awaiting: ui-design: "2026-09-24, the frame for the rail - @tangconst"`
- **WHEN** `check:manual` runs
- **THEN** the wait stands and is listed, and a wait naming nothing wanted is refused

#### Scenario: shared-planning-agent-rounds-SC-102 - Opposite outcomes across two deltas
**Serves:** shared-planning-agent-rounds-US-12 - the engineer is told of two deltas that contradict before building

- **GIVEN** one change's MODIFIED requirement says a sold-out tile's name stays inert and another's ADDED requirement on the same requirement says it opens where no cart control is drawn, on the same GIVEN
- **WHEN** `check:manual` runs
- **THEN** both changes are named and the check fails

#### Scenario: shared-planning-agent-rounds-SC-103 - A Manual table outside the reconciliation
**Serves:** shared-planning-agent-rounds-US-11 - QA's suite is refused where it is written, not at the fold

- **GIVEN** a suite in a change with `decisions.md` whose `### Manual` sits under a journey
- **WHEN** the suite is validated
- **THEN** it is refused, naming the section the table belongs under

### Requirement: The application repository refuses an unsigned walk id

`pnpm plan check-walk <file>` SHALL read every bracketed case id in a Playwright spec's test titles and refuse one whose case is not `actual` in the store's suite at the submodule's pin, and `pnpm plan done` SHALL run it over the group's end-to-end files before ticking.

#### Scenario: shared-planning-agent-rounds-SC-104 - A walk carrying a draft case's id
**Serves:** shared-planning-agent-rounds-US-11 - no walk carries an id QA has not signed

- **GIVEN** a spec's test is titled with a case id whose case is `draft`
- **WHEN** the engineer ticks the walk's group
- **THEN** the tick is refused naming the id and its status
