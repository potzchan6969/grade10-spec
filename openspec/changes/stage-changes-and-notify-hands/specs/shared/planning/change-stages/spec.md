# shared/planning/change-stages Specification

## Purpose

Where a change stands, who is on it, and how they are told: eight stages read
from the change's files on `main`, one hand per stage whose word moves it, a
closed set of overlays beside the stage, and one message per move pointing at
the change's thread, shown the same on the board, the change page, the page's
ribbon, My turn and Slack.

## Feature set

- Stages read from files
  - One of eight: Proposed, Designed, Specified, Planned, Building, On staging, Released, Archived, each proven by what is on `main`, never set by a key
  - One projection: the four lanes, the stepper, the pip and every message read the same derivation
  - Proposed whole: the proposal, the decisions and the journeys are one stage, with ❓ on what is still open
  - Waivers as written: `ui_waived` and `design_waived` stand for the artifact they name, so Designed needs both designs or their line
  - Tech design first: the tech design is drawn beside the UI design, before the requirements, on every change
- Drafted, landed on a word
  - Agent mark: the five stages from Proposed to Building are drafted by the change's agent and carry the hand's move beside the mark
  - Landed by: `landed_by:` names the hand whose word landed each artifact, written by the landing itself
- Hands and whose turn
  - Hands mapping: `hands:` names one handle per role, written by the product manager, the local manual or the application repository's command, refused when the team map does not know it
  - Whose turn: derived from the stage and the hands, the product manager holding Proposed until the decisions, the journeys and the hands are on `main`
  - Unnamed hand: a stage whose hand is unnamed shows the hand as open and routes to the role's channel
  - Team map: one entry per handle with its Slack member and roles, and a channel per role
- Overlays, a closed set
  - Five overlays: Waiting, Blocked, Idle, Behind and Suite, each read from a file and shown beside the stage
  - Idle counts landings: days since the last tick, claim or artifact landing, never since a repository-wide commit; shelved at 30
  - Behind is shown: an artifact whose linked page lines or artifacts before it changed after it was drawn or last read again is marked on the card and the artifact, holds no tick, claim or wait here
  - Open questions: a ❓ decisions row or a ❓ line under a linked section, counted per artifact and listed per hand
- Messages, once per move
  - Your turn: one direct message to the hand a change reaches, keyed by change, stage and role, never sent twice for one move
  - Behind and staging: one message to the hand of an artifact newly behind, and one to QA when a change reaches staging
  - Channel and digest: the post per push names each change's stage; a weekly digest per person lists open questions, idle, behind and waiting
- Surfaces that show the stage
  - Board: eight lanes with the agent mark and the hand's move on five, filters for Mine, Waiting, Idle, Behind and Blocked, and the shelf
  - Change page: the stepper, the Your turn card with the thread and the command, the hands, each artifact fresh or behind with its questions and who landed it, delivery and handoff
  - My turn: the reader's open questions, then the changes on them now, then the ones theirs later
  - Ribbon and pip: a section's in-flight row shows the stage and the hand, and each 🚧 line wears its change's stage
  - Assign: the local manual writes a hand; the hosted manual shows it read-only

## ADDED Requirements

### Requirement: A change is in exactly one of eight stages, read from `main`

The stage says how far a change has got, and only what is on `main` proves it.

- **The ladder** — the stage SHALL be the furthest stage whose proof, and
  every proof before it, is on `main`
- **Never set** — the store SHALL NOT read the stage from a key anybody sets
- **Out of order** — a proof that lands while an earlier one is missing SHALL
  NOT move the stage past the missing one
- **Taken back** — a proof that leaves `main` SHALL drop the stage to the
  furthest rung still proven
- **Unreadable** — a change whose record cannot be read SHALL show as
  Proposed, SHALL be named as unreadable with its hands open, and SHALL NOT be
  left out of the lanes

| # | Stage | Proven by, on `main` |
| --- | --- | --- |
| 1 | Proposed | `proposal.md` |
| 2 | Designed | `ui-design.md` or `ui_waived:` · `tech-design.md` or `design_waived:` |
| 3 | Specified | `spec.md` carrying requirements · `feature-tcs.md` · every Raised row landed |
| 4 | Planned | `tasks.md` · `promoted_by:` |
| 5 | Building | at least one task ticked |
| 6 | On staging | every task ticked · `deployed_env: staging` |
| 7 | Released | `released_in:` naming the tag that carried the change |
| 8 | Archived | the change's directory under the archive |

#### Scenario: shared-planning-change-stages-SC-01 - Each rung is proven by its row
**Serves:** Stages read from files - every push to `main` is read here before any surface shows a change

**WHEN** each row of the table above is satisfied in turn for a change
**THEN** its stage SHALL be that row's stage
**AND** a proof that leaves `main` SHALL drop the stage to the furthest rung still proven

#### Scenario: shared-planning-change-stages-SC-02 - A proof lands while an earlier one is missing
**Serves:** Stages read from files - a change whose plan was written before its designs is read on the same push

**GIVEN** a change carrying neither design and neither waiver
**WHEN** `spec.md` with requirements, `feature-tcs.md` and `tasks.md` land on `main`
**THEN** its stage SHALL be Proposed
**AND** it SHALL NOT be shown as Planned

#### Scenario: shared-planning-change-stages-SC-03 - A record nothing can read
**Serves:** shared-planning-change-stages-US-02 - the product manager meets a half-written change on the board instead of missing it

**WHEN** a change's record cannot be read
**THEN** its stage SHALL be Proposed
**AND** the change SHALL be named as unreadable, with its hands open
**AND** it SHALL NOT be left out of the lanes

### Requirement: One derivation stands behind every surface and every message

Every surface reads the stage, the hands and the hand's move from one
derivation.

- **The four lanes** — the four lanes SHALL be a projection of the eight
  stages, so no lane disagrees with the stage
- **One reading** — the board, the change page's stepper, a page's in-flight
  ribbon and pip, My turn and every Slack message SHALL read the same
  derivation

#### Scenario: shared-planning-change-stages-SC-04 - The four lanes are the stages projected
**Serves:** Stages read from files - the lanes that ran before this change keep running on it

**WHEN** the four lanes are read for a change
**THEN** the lane SHALL be the one its stage projects to
**AND** no change SHALL appear in a lane its stage does not project to

#### Scenario: shared-planning-change-stages-SC-05 - One change, one stage everywhere
**Serves:** shared-planning-change-stages-US-02 - the product manager compares the board against the change page and the page's ribbon

**GIVEN** a change in Planned
**WHEN** the board, the stepper, the section's in-flight row, My turn and the message about it are read
**THEN** each SHALL name Planned
**AND** each SHALL name the same hands

### Requirement: Proposed holds the proposal, the decisions and the journeys

Proposed SHALL be one stage: the proposal proves it, and the decisions, the
journeys, the marked page lines and `hands:` complete it without moving it. An
item nobody has confirmed SHALL stay ❓ on the decisions or the page and SHALL
hold no stage.

#### Scenario: shared-planning-change-stages-SC-06 - The decisions and the journeys complete Proposed
**Serves:** Stages read from files - the product manager's second push on the change is read here

**GIVEN** a change in Proposed holding only its proposal
**WHEN** `decisions.md`, the journeys file, the marked page lines and `hands:` land on `main`
**THEN** its stage SHALL be Proposed

### Requirement: A waiver stands for the file it names

A change that owes no design says so in one line.

- **What each line stands for** — `ui_waived:` SHALL stand for
  `ui-design.md` and `design_waived:` SHALL stand for `tech-design.md`, so
  Designed is proven by both designs, by both lines, or by one of each
- **Shown as not owed** — a waived artifact SHALL be shown as not owed and
  fresh, carrying the reason written on its line

#### Scenario: shared-planning-change-stages-SC-07 - Either waiver stands for its design
**Serves:** shared-planning-change-stages-US-05 - the designer says a change draws nothing and the ladder moves

**GIVEN** a change in Proposed with its decisions, its journeys and `hands:` on `main`
**WHEN** `ui_waived:` with `tech-design.md`, or `ui-design.md` with `design_waived:`, or both lines land on `main`
**THEN** its stage SHALL be Designed
**AND** each waived design SHALL be shown as not owed and fresh, with its reason

#### Scenario: shared-planning-change-stages-SC-08 - A design with neither a file nor a line
**Serves:** shared-planning-change-stages-US-05 - the designer writes one line and the other design is still owed

**GIVEN** a change in Proposed with its decisions, its journeys and `hands:` on `main`
**WHEN** `ui_waived:` lands and no tech design does
**THEN** its stage SHALL be Proposed
**AND** the tech design SHALL be shown as owed

### Requirement: The tech design is drawn before the requirements

The tech design is drawn beside the UI design, from the page, the decisions
and the journeys, before anybody writes a requirement.

- **Owed on every change** — every change SHALL owe `tech-design.md` or
  `design_waived:`
- **Requirements do not stand in for it** — requirements landing while a
  design is owed SHALL NOT move the stage
- **A question for the tech PIC** — a requirement that reaches the tech design
  SHALL be written as a dated wait on the tech PIC and SHALL NOT hold the
  stage

#### Scenario: shared-planning-change-stages-SC-09 - A requirement reaches the tech design
**Serves:** shared-planning-change-stages-US-06 - the requirements run writes what it waits on and the change keeps moving

**WHEN** a wait on the requirements names what the tech design has not settled
**THEN** the wait SHALL be shown against the change's tech PIC with the date it started
**AND** the stage SHALL be unchanged

### Requirement: The five drafted stages carry the agent mark and the hand's move

Proposed to Building are drafted by the change's agent, and the hand of the
stage answers.

- **Where the pair is shown** — the board's lane heading and the change page's
  stepper step SHALL each carry the agent mark and the hand's move for
  Proposed to Building, and neither for On staging, Released and Archived
- **Read from the stage** — the mark and the move SHALL come from the stage,
  so every change in one stage carries the same pair and no change's record
  SHALL change them

| # | Stage | The agent drafts | The hand's move |
| --- | --- | --- | --- |
| 1 | Proposed | the marks and the three files, from what the hand asks | answer |
| 2 | Designed | both designs, from the page and the journeys | tweak · challenge |
| 3 | Specified | two blind readings, reconciled | read |
| 4 | Planned | the plan | read |
| 5 | Building | each group, test first | read each landing |

#### Scenario: shared-planning-change-stages-SC-10 - The mark and the move on a lane and a step
**Serves:** shared-planning-change-stages-US-02 - the product manager reads a lane heading and opens the change beneath it

**WHEN** the lane headings and the change page's stepper steps are read
**THEN** Proposed to Building SHALL each carry the agent mark and the hand's move for that stage
**AND** On staging, Released and Archived SHALL carry neither
**AND** two changes in one stage SHALL carry the same pair

### Requirement: `landed_by:` names the hand whose word landed each artifact

An artifact on `main` is one a hand's word landed, and the record says whose.

- **What it holds** — `landed_by:` SHALL map one of the change's artifacts to
  the handle whose word landed it, written by the landing in the same commit
  as the artifact
- **One handle** — an artifact SHALL carry one handle, and a later landing's
  word SHALL replace the last
- **Shown beside the artifact** — the change page SHALL show that handle
  beside the artifact, and an artifact with no entry SHALL show none
- **One artifact, every capability** — an artifact id SHALL address that
  artifact in every capability the change holds, so one entry for `spec.md`
  names the hand who landed each capability's requirements
- **Refused** — the check SHALL refuse a handle the team map does not know and
  an artifact the schema does not issue

#### Scenario: shared-planning-change-stages-SC-11 - Who landed each artifact
**Serves:** shared-planning-change-stages-US-02 - the product manager reads who approved each artifact of a change

**GIVEN** `landed_by:` naming one handle for the decisions and another for the UI design
**WHEN** the change page is read
**THEN** each artifact SHALL show the handle that landed it
**AND** an artifact with no entry SHALL show no handle
**AND** a second landing on one artifact SHALL show the later handle alone

#### Scenario: shared-planning-change-stages-SC-12 - A landing entry the check refuses
**Serves:** shared-planning-change-stages-US-04 - the product manager writes a handle or an artifact name the store cannot resolve

**WHEN** `landed_by:` names a handle the team map does not know, or an artifact the schema does not issue
**THEN** the check SHALL refuse the change
**AND** SHALL name the handle or the artifact it refused

### Requirement: `hands:` names one handle per role

Each change names who takes it at each stage.

- **What it holds** — `hands:` in the change's record SHALL map each role
  below to one handle
- **Who writes it** — the product manager at the interview's end, Assign on
  the locally run manual, or the application repository's hand command
- **Unnamed** — a role the change does not name SHALL be read as unnamed
  rather than as an error
- **Refused** — the check SHALL refuse a role the set below does not hold, a
  value that is not one handle, and a handle the team map does not know

| Role | Key | Takes the change at |
| --- | --- | --- |
| Product manager | `pm` | Proposed, and Specified |
| Designer | `design` | Proposed, once the decisions and the journeys are on `main` |
| Tech PIC | `tech` | Proposed, once the decisions and the journeys are on `main` |
| Engineer | `dev` | Planned, and Building |
| QA | `qa` | On staging; the suite's verdict at any time, as an overlay |
| Release hand | `release` | On staging |

#### Scenario: shared-planning-change-stages-SC-13 - The hands are named at the interview's end
**Serves:** shared-planning-change-stages-US-04 - the product manager closes the interview by naming who takes each role

**WHEN** `hands:` names a handle for each of the six roles
**THEN** each role SHALL show that handle on the change page and on the change's card
**AND** a role the change does not name SHALL show as open

#### Scenario: shared-planning-change-stages-SC-14 - A hands entry the check refuses
**Serves:** shared-planning-change-stages-US-04 - the product manager mistypes a role or a handle at the interview's end

**WHEN** `hands:` names a role outside the six, gives a role more than one handle, or names a handle the team map does not know
**THEN** the check SHALL refuse the change
**AND** SHALL name what it refused
**AND** no message SHALL be sent to that handle

### Requirement: Whose turn is derived from the stage and the hands

Whose turn it is SHALL be derived from the stage and `hands:`, as below. A
move SHALL be the hands changing, whether or not the stage changed with them.

| # | Stage | Whose turn |
| --- | --- | --- |
| 1 | Proposed | `pm` until `decisions.md` and the journeys file are on `main` and `hands:` names every role the next stage needs - `design` unless `ui_waived`, `tech` unless `design_waived`; then those hands |
| 2 | Designed | nobody: the requirements are drafted next and read at Specified |
| 3 | Specified | `pm` |
| 4 | Planned | `dev` |
| 5 | Building | `dev` |
| 6 | On staging | `qa` and `release` |
| 7 | Released | nobody: whoever archives takes it |
| 8 | Archived | nobody |

#### Scenario: shared-planning-change-stages-SC-15 - Proposed changes hands without changing stage
**Serves:** shared-planning-change-stages-US-02 - the product manager reads the Proposed lane before and after the three files land

**GIVEN** a change holding its proposal and not yet its decisions, its journeys or a hand for either design
**WHEN** its card is read, and read again once the decisions, the journeys and both hands are on `main`
**THEN** the turn SHALL first be the product manager's
**AND** it SHALL then be the designer's and the tech PIC's
**AND** a change carrying `ui_waived:` SHALL pass to the tech PIC alone, on that hand's name alone
**AND** the stage SHALL still be Proposed

#### Scenario: shared-planning-change-stages-SC-16 - Each later stage names its hands
**Serves:** shared-planning-change-stages-US-02 - the product manager reads across the lanes to see who each change waits on

**WHEN** a change in Specified, Planned, Building and On staging is read in turn
**THEN** the turns SHALL be the product manager's, the engineer's, the engineer's, and the QA hand's with the release hand's
**AND** a change in Designed, Released or Archived SHALL name nobody

#### Scenario: shared-planning-change-stages-SC-17 - A hand nobody has named
**Serves:** shared-planning-change-stages-US-04 - the product manager sees which changes still need a hand named

**GIVEN** a change in Planned whose `hands:` names no engineer
**WHEN** its card and its change page are read
**THEN** the card SHALL show the hand as open and name the role
**AND** the hands SHALL show that role as open
**AND** the Your turn card SHALL name the role's channel in place of a handle

### Requirement: The team map names each handle and each role's channel

One map turns a handle into a person and a role into somewhere to post.

- **What it holds** — one entry per handle, carrying that handle's Slack
  member and the roles it may take, and one channel per role
- **Who reads it** — every surface that names a person and every message that
  addresses one SHALL read it
- **No member** — a handle the map gives no Slack member SHALL be sent no
  message

#### Scenario: shared-planning-change-stages-SC-18 - A handle and a role resolve
**Serves:** shared-planning-change-stages-US-04 - the hand the product manager wrote is shown as a person and messaged as one

**WHEN** a handle in `hands:` and that role are read against the team map
**THEN** the map SHALL give the Slack member the message is addressed to and the roles that handle may take
**AND** it SHALL give one channel for that role
**AND** a handle with no Slack member SHALL be sent no message

### Requirement: Five overlays sit beside the stage

An overlay is a fact beside the stage, never a stage of its own.

- **The set** — exactly the five below, each read from what is on `main` and
  shown beside the stage on the card and the change page
- **Closed** — nothing outside this set SHALL be shown as an overlay, and no
  overlay SHALL move the stage

| Overlay | Read from | Shown as |
| --- | --- | --- |
| Waiting | `awaiting:`, one line per artifact | the line as written, with its date where the line carries one |
| Blocked | `depends_on:` naming a change not yet released | the change it waits for |
| Idle | the whole calendar days on the Hong Kong date since the last tick, claim or artifact landing | the day count, from the seventh day |
| Behind | an artifact whose page lines or artifacts before it changed after it was drawn or last read again | the earliest behind artifact and its hand |
| Suite | `feature-tcs.md` status, `draft` or `approved` | the verdict |

#### Scenario: shared-planning-change-stages-SC-19 - The overlays a change wears
**Serves:** shared-planning-change-stages-US-02 - the product manager reads why a change with every file in place is not moving

**GIVEN** a change whose `depends_on:` names a change not yet released and whose suite is `draft`
**WHEN** its card is read
**THEN** each SHALL be shown beside the stage as the table says
**AND** a change whose suite is `approved` SHALL show that verdict instead
**AND** no stage SHALL differ because of an overlay

#### Scenario: shared-planning-change-stages-SC-20 - Nothing outside the set
**Serves:** shared-planning-change-stages-US-02 - the product manager reads every card against one list of chips

**WHEN** a change carrying every overlay is read
**THEN** exactly the five SHALL be shown
**AND** its stage SHALL be the one its files prove

#### Scenario: shared-planning-change-stages-SC-21 - A wait, dated or not
**Serves:** shared-planning-change-stages-US-06 - the teammate who wrote the wait sees it against the hand that owes it

**GIVEN** a change whose record carries a dated wait on one artifact and an undated wait on another
**WHEN** its card and its change page are read
**THEN** each wait SHALL be shown as written, one line per artifact, against the hand that owes it
**AND** the undated line SHALL be shown undated
**AND** no message SHALL be sent for a wait
**AND** the stage SHALL be unchanged

### Requirement: Idle counts landings, never commits

Idle SHALL be the whole calendar days on the Hong Kong date since the last
tick, claim or artifact landing on the change.

- **What does not count** — a commit that ticks no task, claims no group and
  adds no artifact SHALL NOT move the count, so one commit touching every
  change moves nobody's
- **The bounds** — the count SHALL be shown from the seventh day, and a
  change SHALL move to the shelf and off the lanes from the thirtieth — ❓ the
  recommendation of `Q21`, open on the product manager; another answer changes
  the day the chip and the shelf appear and the zone the day is counted on

#### Scenario: shared-planning-change-stages-SC-22 - A change that has stopped moving
**Serves:** shared-planning-change-stages-US-02 - the product manager reads which changes have stopped moving

**GIVEN** a change whose last tick, claim and artifact landing were 7 whole days ago
**WHEN** its card is read
**THEN** it SHALL be shown as idle with the day count
**AND** a change whose last landing was 6 days ago SHALL NOT be shown as idle

#### Scenario: shared-planning-change-stages-SC-23 - One commit across the whole store
**Serves:** shared-planning-change-stages-US-02 - the product manager's board is not reset by one reformat

**GIVEN** a change idle 9 days
**WHEN** a commit touches every change's directory and ticks no task, claims no group and adds no artifact
**THEN** the change SHALL still be shown as idle 9 days

#### Scenario: shared-planning-change-stages-SC-24 - A change idle a month
**Serves:** shared-planning-change-stages-US-02 - the product manager reads a board that is not filled with abandoned work

**WHEN** a change reaches 30 days idle
**THEN** it SHALL be shown on the shelf
**AND** SHALL NOT be shown in its lane

### Requirement: Behind is computed from what is before an artifact

An artifact SHALL be behind when what is before it changed after the artifact
was drawn or last read again.

- **What is before it** — the upstream set `shared/planning/agent-rounds`
  states for that artifact, read in the schema's order
- **The read record** — `reviewed:` names, per artifact, a content id of
  everything before that artifact; the artifact is behind when the content id
  read from `main` differs from the recorded one
- **With no record line** — the artifact is behind when one of the change's
  own artifacts before it changed on `main` after the artifact itself last
  changed; a linked page section puts nothing behind until a record line is
  written
- **Never upstream** — the change's record is before no artifact, so writing a
  hand, a waiver or a wait puts nothing behind
- **Waived** — a waived artifact is never behind, and the artifacts after it
  are read against the page sections the change links
- **Only what the change links** — a page section the change does not link
  puts nothing behind
- **Held** — behind SHALL hold no tick, no claim, no wait and no stage; the
  archive check SHALL refuse a behind delta
- **Shown** — the artifact's row SHALL name what changed before it, or what is
  before it where no record line dates the edit, and the card SHALL name the
  earliest behind artifact and its hand

#### Scenario: shared-planning-change-stages-SC-25 - A page line changes after an artifact was drawn
**Serves:** shared-planning-change-stages-US-09 - the hand opens the change and reads what moved under their artifact

**GIVEN** a change whose UI design was drawn from a linked page section, and whose `reviewed:` line was written
**WHEN** that section changes on `main` afterwards
**THEN** the UI design SHALL be shown as behind
**AND** its row SHALL name the section that changed, or what is before it where no record line dates the edit

#### Scenario: shared-planning-change-stages-SC-26 - The card names the earliest behind artifact
**Serves:** shared-planning-change-stages-US-09 - the hand finds the change from the board rather than from the message

**GIVEN** a change whose decisions and whose requirements are both behind
**WHEN** its card is read
**THEN** it SHALL be shown as behind
**AND** SHALL name the decisions and their hand

#### Scenario: shared-planning-change-stages-SC-27 - The read record matches the tree
**Serves:** Overlays, a closed set - an artifact read again is read against the same content on the next push

**GIVEN** an artifact whose `reviewed:` content id equals the one read from `main`
**WHEN** the change is read
**THEN** the artifact SHALL be shown as fresh

#### Scenario: shared-planning-change-stages-SC-28 - An artifact with no read record
**Serves:** Overlays, a closed set - an artifact written before the record line existed is still read against what is before it

**GIVEN** an artifact carrying no `reviewed:` line
**WHEN** one of the change's own artifacts before it changes on `main` after the artifact last changed
**THEN** the artifact SHALL be shown as behind
**AND** a commit on a linked page section SHALL put nothing behind
**AND** an artifact no commit dates, or whose upstream no commit dates, SHALL NOT be shown as behind

#### Scenario: shared-planning-change-stages-SC-29 - What puts nothing behind
**Serves:** Overlays, a closed set - a push that touches something else must not mark a change

**GIVEN** a change carrying `ui_waived:` whose artifacts are all fresh
**WHEN** `hands:`, a waiver or a wait is written into its record
**AND** a page section the change does not link changes on `main`
**THEN** no artifact SHALL be behind
**AND** a change to a linked page section SHALL leave the waived design fresh
**AND** the artifacts after it SHALL be read against that section

#### Scenario: shared-planning-change-stages-SC-30 - Behind holds no tick, claim or wait
**Serves:** shared-planning-change-stages-US-09 - the hand keeps working while the artifact waits to be read again

**GIVEN** a change whose requirements are behind
**WHEN** a task is ticked, a group is claimed and a wait is written
**THEN** each SHALL be accepted
**AND** the change SHALL still be shown as behind

#### Scenario: shared-planning-change-stages-SC-31 - A behind delta at the archive
**Serves:** shared-planning-change-stages-US-09 - the fold refuses while the hand has not read their artifact again

**WHEN** a change is archived while its delta is behind
**THEN** the archive check SHALL refuse it
**AND** SHALL name the artifact and what changed before it

### Requirement: Open questions are read from the decisions and the pages

An open question is a line nobody has answered yet, and it holds no stage.

- **What counts** — a decisions row whose decision starts with ❓ and names
  the role that settles it, or a ❓ line under a top-level page section the
  change links; a row inside a titled block belongs to the page, not to the
  change
- **What it carries** — the row's number or the section, and the hand it is
  addressed to: the handle `hands:` names for that role, or the role itself
  when the change names none
- **Counted against** — a decisions row against the decisions, a ❓ page line
  against the proposal that links the section
- **A role outside the six** — a question naming one SHALL be listed under
  that role and routed to its channel, the way an unnamed hand is
- **Holds nothing** — an open question SHALL hold no stage

#### Scenario: shared-planning-change-stages-SC-32 - A decisions row nobody has settled
**Serves:** shared-planning-change-stages-US-03 - the teammate the row names reads it on the page listing their work

**GIVEN** a decisions row whose decision starts with ❓ and names a role
**WHEN** the change is read
**THEN** the row SHALL be listed as an open question with its number
**AND** SHALL be addressed to the handle `hands:` names for that role
**AND** a row naming a role outside the six SHALL be listed under that role and routed to its channel

#### Scenario: shared-planning-change-stages-SC-33 - A question on the page
**Serves:** shared-planning-change-stages-US-03 - the teammate reads the questions the page still carries against the change

**GIVEN** a ❓ line under a top-level page section the change links
**WHEN** the change is read
**THEN** the line SHALL be listed as an open question against the proposal
**AND** SHALL name the section it sits under
**AND** a ❓ row inside a titled block of that page SHALL NOT be listed

#### Scenario: shared-planning-change-stages-SC-34 - Questions counted per artifact
**Serves:** shared-planning-change-stages-US-02 - the product manager opens the change to see what is unanswered and who answered what

**GIVEN** a change with two open decisions rows and a landed UI design
**WHEN** the change page is read
**THEN** the decisions row SHALL show a count of two
**AND** the UI design SHALL show the handle that landed it

#### Scenario: shared-planning-change-stages-SC-35 - An open question holds nothing
**Serves:** shared-planning-change-stages-US-02 - the product manager reads a change that moved with a question still open

**GIVEN** a change carrying two open questions
**WHEN** the artifacts of its next stage land on `main`
**THEN** the stage SHALL move
**AND** the questions SHALL still be listed

### Requirement: Every message is keyed and sent once per move

Every message the push workflow and the digest send SHALL be one of the kinds
below and SHALL be sent once for the key it carries, so a re-run of the same
push sends nothing again.

- **Five kinds** — nothing else SHALL be sent: a written wait and a change
  freed by a dependency SHALL be lines of the digest, and the round's own
  replies are `shared/planning/agent-rounds` — ❓ the recommendation of `Q31`,
  open on the product manager; another answer adds a message for a written wait
  and one for a freed dependency
- **Never per commit** — no message SHALL be sent per commit or per tick
- **Per entry** — a stage re-entered after a revert SHALL send again, and one
  entry SHALL never send twice

| Kind | Sent when | Who is told | Key |
| --- | --- | --- | --- |
| Your turn | a push to `main` moves the change to a hand | that hand, by direct message; the role's channel when the hand is unnamed | the change, the stage and the role |
| Staging | a change reaches On staging | its QA hand, with the run sheet | the change, the stage and QA |
| Behind | an artifact is newly behind | the hand of the earliest behind artifact | the change and the artifact |
| Landed | every push to `main` | the channel | the push |
| Digest | Monday 09:00 on the Hong Kong clock | each person with a line to say | the person and the week |

#### Scenario: shared-planning-change-stages-SC-36 - One message per key
**Serves:** shared-planning-change-stages-US-01 - the hand is told when the change reaches them and not again

**GIVEN** a change that reached Planned and whose engineer was told
**WHEN** a later push leaves it in Planned with the same engineer
**AND** the push workflow is run again for that push
**THEN** no second Your turn message SHALL be sent

#### Scenario: shared-planning-change-stages-SC-37 - A stage re-entered after a revert
**Serves:** shared-planning-change-stages-US-01 - a landing taken back and pushed again is a real move for the hand

**GIVEN** a change whose Planned landing was reverted
**WHEN** `tasks.md` lands again
**THEN** one Your turn message SHALL be sent to the engineer

#### Scenario: shared-planning-change-stages-SC-38 - A push that moves nobody
**Serves:** shared-planning-change-stages-US-01 - a build push ticks a box and tells nobody

**GIVEN** a change in Planned whose engineer is named
**WHEN** a push ticks its first task and moves it to Building
**THEN** no Your turn message SHALL be sent
**AND** the channel post SHALL still name the change and Building

#### Scenario: shared-planning-change-stages-SC-39 - An artifact goes behind twice
**Serves:** shared-planning-change-stages-US-09 - the hand is told once and reads the artifact when they get to it

**GIVEN** an artifact behind, whose hand was told
**WHEN** something before it changes again and it has not been read again
**THEN** no second Behind message SHALL be sent

### Requirement: Your turn reaches the hand of the stage

A push to `main` that moves a change to a hand SHALL send one direct message
to that hand.

- **What it carries** — the change, the stage it reached, the link to the
  change's thread and the command to paste
- **The link** — `thread:` SHALL name the thread, and the change page's link
  SHALL be sent in its place when the record names none; the key is read here
  and written by the round that opens the thread
- **An unnamed hand** — a stage whose hand is unnamed SHALL be told on the
  role's channel with the same body, and no direct message SHALL be sent
- **A hand taken off** — removing the hand of the role a change sits on SHALL
  be a move: the role's channel SHALL be told once and the card SHALL show
  the hand as open

#### Scenario: shared-planning-change-stages-SC-40 - A stage lands and its hands are told
**Serves:** shared-planning-change-stages-US-01 - the hand starts the day the change lands, from the message

**GIVEN** a change in Proposed whose designer and tech PIC are named
**WHEN** a push lands `decisions.md`, the journeys file and `hands:`
**THEN** one direct message SHALL be sent to each of the two
**AND** each SHALL name the change, the stage, the thread and the command
**AND** no message SHALL be sent to the product manager for that move

#### Scenario: shared-planning-change-stages-SC-41 - The hand is unnamed
**Serves:** shared-planning-change-stages-US-04 - the role is told even before the product manager has named a hand

**GIVEN** a change reaching a stage whose hand `hands:` does not name
**WHEN** the push is read
**THEN** the same body SHALL be posted to that role's channel
**AND** no direct message SHALL be sent

#### Scenario: shared-planning-change-stages-SC-42 - A hand is taken off a change it sits on
**Serves:** shared-planning-change-stages-US-04 - the product manager takes a hand off a change and the role hears once

**GIVEN** a change in Designed whose designer is named
**WHEN** the designer's handle is removed from `hands:`
**THEN** the role's channel SHALL be told once
**AND** the card SHALL show the hand as open

#### Scenario: shared-planning-change-stages-SC-43 - The change has no thread yet
**Serves:** shared-planning-change-stages-US-01 - the hand still reaches the change from the message

**GIVEN** a change whose record names no thread
**WHEN** a Your turn message is sent
**THEN** it SHALL carry the change page's link in place of the thread's

### Requirement: An artifact going behind and a change reaching staging are told

Two moves that are not a stage landing still reach a person.

- **Behind** — an artifact newly behind SHALL send one message to its hand,
  naming the artifact and what changed before it
- **Staging** — a change reaching On staging SHALL send one message to its QA
  hand, naming the change and the run sheet to walk, and one Your turn message
  to its release hand

#### Scenario: shared-planning-change-stages-SC-44 - An artifact goes behind
**Serves:** shared-planning-change-stages-US-09 - the hand is told before anything is built on the artifact

**WHEN** a push puts a fresh artifact behind
**THEN** one direct message SHALL be sent to that artifact's hand
**AND** it SHALL name the artifact and what changed before it

#### Scenario: shared-planning-change-stages-SC-45 - A change reaches staging
**Serves:** shared-planning-change-stages-US-08 - QA starts the manual pass the day the change deploys

**WHEN** a push moves a change to On staging
**THEN** one direct message SHALL be sent to its QA hand, naming the change and the run sheet
**AND** one Your turn message SHALL be sent to its release hand, naming the change and On staging

### Requirement: The channel post per push and the weekly digest

The channel reads what a push moved, and each person reads their own week on
Monday.

- **The post** — the post to the channel on every push to `main` SHALL name
  each change the push moved and the stage it moved into
- **The digest** — one digest per person SHALL be sent Monday 09:00 on the
  Hong Kong clock, listing the changes on them now, their open questions,
  their idle changes, their behind artifacts, their waits and the changes a
  dependency has freed
- **Behind in the digest** — a behind artifact SHALL be listed from the
  seventh day it has been behind
- **Nothing to say** — a digest with nothing to say SHALL NOT be sent

#### Scenario: shared-planning-change-stages-SC-47 - A push moves three changes
**Serves:** shared-planning-change-stages-US-02 - the product manager reads the channel to see what a push moved

**WHEN** a push to `main` moves three changes
**THEN** one channel post SHALL name each of the three and the stage each moved into
**AND** each hand SHALL be told of its own change alone

#### Scenario: shared-planning-change-stages-SC-48 - Monday morning
**Serves:** shared-planning-change-stages-US-01 - the teammate starts the week from one message

**GIVEN** a person with a change on them, an open question, an idle change, a wait and a change a dependency has freed
**WHEN** the digest is sent
**THEN** one direct message SHALL list all five

#### Scenario: shared-planning-change-stages-SC-49 - A behind artifact in the digest
**Serves:** shared-planning-change-stages-US-09 - the hand who did not read the first message is told again

**GIVEN** an artifact behind for 7 days
**WHEN** the digest is sent to its hand
**THEN** it SHALL be listed
**AND** an artifact behind for 6 days SHALL NOT be

#### Scenario: shared-planning-change-stages-SC-50 - A person with nothing to say
**Serves:** shared-planning-change-stages-US-01 - a quiet week reaches nobody's inbox

**WHEN** the digest finds a person with no change on them, no open question, no idle change, no behind artifact and no wait
**THEN** no message SHALL be sent to them

### Requirement: The board shows eight lanes

The board is where every change in flight is read at once.

- **The lanes** — one lane per stage, in stage order, each holding the changes
  in that stage
- **A card** — the change, its hand, its age, its overlays and its task bar
- **Collapsed** — a lane SHALL collapse to its heading with its count and its
  open hands
- **The filters** — exactly Mine, Waiting, Idle, Behind and Blocked, with the
  shelf reachable from the board
- **Nothing in flight** — with no change in flight the board SHALL say so

#### Scenario: shared-planning-change-stages-SC-51 - The lanes and a card
**Serves:** shared-planning-change-stages-US-02 - the product manager opens the board and reads it top to bottom

**WHEN** the board is read
**THEN** it SHALL show eight lanes in stage order
**AND** each card SHALL carry its hand, its age, its overlays and its task bar

#### Scenario: shared-planning-change-stages-SC-52 - A lane with nothing in it
**Serves:** shared-planning-change-stages-US-02 - the product manager reads a long board without scrolling past empty stages

**WHEN** a lane holds no change
**THEN** it SHALL show its heading with a count of none
**AND** SHALL name the roles open in that stage

#### Scenario: shared-planning-change-stages-SC-53 - Nothing in flight
**Serves:** shared-planning-change-stages-US-02 - the product manager reads the board on a store with every change archived

**WHEN** the board is read and no change is in flight
**THEN** it SHALL say there is nothing in flight
**AND** SHALL show no lane as an error

#### Scenario: shared-planning-change-stages-SC-54 - The filters narrow the board
**Serves:** shared-planning-change-stages-US-02 - the product manager reads only what is stuck

**GIVEN** changes waiting, idle, behind and blocked
**WHEN** each filter is applied in turn
**THEN** the board SHALL show only the changes that overlay marks
**AND** Mine SHALL show only the changes the chosen handle is a hand of

#### Scenario: shared-planning-change-stages-SC-55 - Mine with no handle chosen
**Serves:** shared-planning-change-stages-US-03 - the teammate filters the board before telling it who they are

**WHEN** Mine is applied and no handle has been chosen
**THEN** the board SHALL ask for a handle
**AND** SHALL narrow nothing until one is chosen

#### Scenario: shared-planning-change-stages-SC-56 - The shelf
**Serves:** shared-planning-change-stages-US-02 - the product manager reads what was set aside

**WHEN** the shelf is read
**THEN** it SHALL list every change idle 30 days
**AND** each SHALL carry its stage and its day count

### Requirement: The change page shows the stage, the turn and the artifacts

The change page SHALL show, in this order down the reading column:

1. the stepper, one step per stage, the change's stage marked, the agent mark
   and the hand's move under the first five
2. the Your turn card: the hand, the link to the change's thread and the
   command to paste
3. the hands, one row per role with its handle or open
4. the artifacts, each fresh, behind or not owed, with its open question count
   and the handle that landed it
5. delivery: where the code is — `main`, staging and the release that carried
   the change
6. the handoff: for each stage the change has left, the days from the stage
   landing to that hand's first word

#### Scenario: shared-planning-change-stages-SC-57 - The stepper marks the stage
**Serves:** shared-planning-change-stages-US-02 - the product manager opens one change to see how far it has come

**WHEN** the change page is read for a change in Building
**THEN** the stepper SHALL show all eight stages
**AND** SHALL mark Building as the one the change is in

#### Scenario: shared-planning-change-stages-SC-58 - The Your turn card
**Serves:** shared-planning-change-stages-US-01 - the hand opens the change from the message and sees what to run

**WHEN** the change page is read for a change whose current stage names a hand
**THEN** the Your turn card SHALL name that hand
**AND** SHALL carry the thread's link and the command as text

#### Scenario: shared-planning-change-stages-SC-59 - Where the code is and where the days went
**Serves:** shared-planning-change-stages-US-02 - the product manager reads whether a finished change shipped and where its days went

**GIVEN** a change carrying a staging deploy, a release tag, and a Proposed landing 3 days before its designer's first word
**WHEN** the change page is read
**THEN** delivery SHALL name `main`, staging and that tag
**AND** the handoff SHALL show 3 days against Proposed

### Requirement: My turn lists what is on the reader

My turn SHALL list, in this order: the open questions addressed to the reader,
then the changes whose current stage names them, then the changes that name
them for a later stage.

- **The handle** — chosen once per browser and remembered there, and used by
  the board's Mine filter without asking again
- **Before a handle** — until a handle is chosen the page SHALL ask for one
  and SHALL list nothing
- **A handle nobody knows** — a handle the team map does not know SHALL be
  reported as unknown and SHALL list nothing

#### Scenario: shared-planning-change-stages-SC-60 - The order of the page
**Serves:** shared-planning-change-stages-US-03 - the teammate reads the page from the top and starts on the first thing

**GIVEN** a reader with an open question, a change on them now and a change theirs later
**WHEN** My turn is read
**THEN** the open question SHALL be listed first with its change and its number
**AND** the change on them now SHALL be listed above the one theirs later

#### Scenario: shared-planning-change-stages-SC-61 - Nothing on the reader
**Serves:** shared-planning-change-stages-US-03 - the teammate reads the page on a clear afternoon

**WHEN** My turn is read for a handle with no open question and no change
**THEN** it SHALL say nothing is on the reader

#### Scenario: shared-planning-change-stages-SC-62 - Before a handle is chosen
**Serves:** shared-planning-change-stages-US-03 - the teammate opens the page for the first time

**WHEN** My turn is read and no handle has been chosen
**THEN** it SHALL ask for a handle
**AND** SHALL list nothing

#### Scenario: shared-planning-change-stages-SC-63 - The handle is remembered
**Serves:** shared-planning-change-stages-US-03 - the teammate returns to the page the next morning

**GIVEN** a handle chosen in one browser
**WHEN** My turn and the board's Mine filter are read again in that browser
**THEN** each SHALL use that handle without asking again
**AND** another browser SHALL ask for a handle

#### Scenario: shared-planning-change-stages-SC-64 - A handle the team map does not know
**Serves:** shared-planning-change-stages-US-03 - the teammate mistypes their handle or has not been added

**WHEN** My turn is read for a handle the team map does not know
**THEN** it SHALL say the handle is unknown
**AND** SHALL list nothing

### Requirement: A page's in-flight row and every marked line show the stage

A page says how far the change behind each promised line has come.

- **The in-flight row** — a page section's in-flight row SHALL name the stage
  and the hand of each change on it
- **The pip** — each 🚧 line SHALL carry the pip of the change delivering it,
  bearing that change's stage number, so no colour carries the meaning alone
- **Archived** — a line whose change has archived SHALL carry no pip
- **Two changes** — a line two changes deliver SHALL carry the further stage

#### Scenario: shared-planning-change-stages-SC-65 - The in-flight row and the pip
**Serves:** shared-planning-change-stages-US-07 - the reader of the page sees who is on the change and how far it has come without leaving it

**WHEN** a page section carrying an in-flight change in Planned is read
**THEN** its row SHALL name the change's stage and its hand
**AND** the section's 🚧 line SHALL carry the pip for Planned
**AND** the pip SHALL bear the stage number

#### Scenario: shared-planning-change-stages-SC-66 - The change has archived
**Serves:** shared-planning-change-stages-US-07 - the reader meets a line whose change shipped before the marks came off

**WHEN** a 🚧 line's change is archived
**THEN** the line SHALL carry no pip

#### Scenario: shared-planning-change-stages-SC-67 - Two changes deliver one line
**Serves:** shared-planning-change-stages-US-07 - the reader meets a line a second change extended

**GIVEN** a 🚧 line delivered by a change in Designed and a change in Building
**WHEN** the line is read
**THEN** it SHALL carry the pip for Building

### Requirement: Assign writes a hand on the locally run manual only

Naming a hand from the change page is a local action until the hosted manual
has a sign-in.

- **Local** — the locally run manual SHALL write a role's handle into the
  change's record as one commit
- **Hosted** — the hosted manual SHALL show the hands and Assign as
  read-only, and SHALL write nothing

#### Scenario: shared-planning-change-stages-SC-68 - Assign names a hand
**Serves:** shared-planning-change-stages-US-04 - the product manager names a hand from the change page instead of editing the record

**WHEN** a role and a handle are assigned on the locally run manual
**THEN** `hands:` SHALL carry that handle for that role in one commit
**AND** the change page SHALL show the handle

#### Scenario: shared-planning-change-stages-SC-69 - The hosted manual
**Serves:** shared-planning-change-stages-US-01 - the hand opens the change from the message on the hosted manual

**WHEN** the change page is read on the hosted manual
**THEN** the Your turn card and the hands SHALL be shown
**AND** Assign SHALL be shown as read-only
