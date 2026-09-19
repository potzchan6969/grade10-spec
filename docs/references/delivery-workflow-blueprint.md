# Delivery Workflow Blueprint

The owner's brief for the way a change moves from a product idea to a
released feature, as of 2026-09-17 and 2026-09-19, and the shape drawn from
it: five phases, eight stages, a round on every artifact with an agent
drafting and a person's word landing, the screens, the messages and the
rails. The illustrated version is the
[blueprint page](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC); this
document is the text of record. The changes it led to are
`stage-changes-and-notify-hands` and `run-a-round-on-every-artifact`; the
rest are named under the first change's follow-on changes. Read this as the
shape the tooling starts from, not as its requirements.

## The Brief

The owner's points, one line each.

### The Flow

1. *PM* — **Requirements** — grills the requirements with agents and
   iterates the roadmap under `docs/prds/` from several perspectives, until
   the plan says what is confirmed and what the next steps need: UI, UX,
   backend design, integration. Delivered: the pages under `docs/prds/`,
   with wording, charts and flows a person can read, then `proposal.md` and
   `user-journeys.md` in the OpenSpec shape
2. *Designer* — **UI design** — shows what is wanted on the screen.
   Delivered: the pages enriched, with a Storybook that walks most
   scenarios; drawn by hand with agents, or drawn by agents and reviewed by
   a person
3. *Technical PIC* — **Tech design** — shows how the system works.
   Delivered: the pages enriched with wording, charts and flows; drawn the
   same two ways
4. *Engineers and agents* — **Implementation** — tests first (`spec.md`,
   the `*-tcs.md` suites), then the task breakdown (`tasks.md`), then E2E
   tests that prove the flow; agents automate the phase, and a person
   reviews a summary before any code is written
5. *QA and the release hand* — **Staging deployment** — everything deploys
   to staging constantly with CI green; a release is a merge to the
   production branch, a tag, a preview and smoke tests; an issue found there
   is fixed on a branch from the production branch, and the step is redone

### The Second Brief

The owner's points of 2026-09-19, on the first draft of this shape.

- **An order among the artifacts** — the page under `docs/prds/` first, then
  `proposal.md` and `user-journeys.md`, then `ui-design.md` and
  `tech-design.md`, then `spec.md` and the suite, then `tasks.md`; when one
  changes, every group after it is read again in full, so nothing stale is
  built on; `/plan`, `/design`, `/tech` and `/specify` grill one another,
  because things change after deeper thought
- **The PM starts with what is wanted** — agents refine the rest with what
  makes the most sense, and raise what is a preference or a product decision
  as a question the PM answers
- **The tech PIC reviews, refines and challenges** — after agents propose the
  system, the architecture and the data flow through a plan, review and
  verify process
- **The designer reviews, refines and tweaks** — after agents propose the UI
  and the UX the same way
- **Cloud agents and a real-time mechanism** — local or cloud, whatever makes
  the loop smooth and responsive to a PM or a designer, whatever setup this
  store and the manual need for it
- **Layers of checks on the full-stack cycle** — a plan is written as a
  reviewable change and peer-reviewed: challenger agents, one per part, scope
  or perspective and one as devil's advocate, then verifier agents per group
  of findings; each phase of the build is audited by advisory agents and
  verified by peers; a devil's-advocate pass on simplicity after the build;
  the whole demonstrated end to end, and that demonstration kept as a test
  that runs as a guardrail
- **Nine principles for the system** — determinism (deterministic or
  stateless over many parts and mutations), conscientious (spot what is
  wrong and fix its structure, not its symptom; one solution per category of
  problem), simplicity, clarity (boring and obvious; code that explains
  itself, no bloating comments), flexibility (built on cleanly later),
  modularity, consistency (with the codebase as it is), resilience
  (idempotent, atomic), observability (fail fast, log loudly, never a
  silent error)
- **Everything written the same way** — documentation, comments, briefings,
  commit messages, replies, agent prompts: the reasoning stays in the record
  it belongs to, and only the conclusion is delivered

### What Helps

- **Progress management** — the manual and the viewer show the state of the
  flow the way a task tool does; teammates are assigned to a change for
  follow-up, and Slack tells them promptly rather than GitHub
- **No pull request** — pushing to `main` is the normal way to land,
  because everyone reads `main`
- **A change in flight that moves** — agents decide the most efficient
  reconciliation
- **Release** — tag a commit; fix what manual testing finds on a branch
  from the tag
- **Migrations** — staging never deploys with a migration change; locally
  the database restarts clean
- **Testing a feature** — staging, an E2E setup, and feature flags in
  production
- **Cleanup** — old `openspec/changes` are cleaned regularly
- **For people** — every document reads easily: tables, charts, graphics,
  flows, timelines, examples; one meaning per word; the order events happen
  in; supplementary detail later
- **Reimagined** — the skills, instructions and documents are simplified to
  fit the workflow

## The Line

Five phases, in the order they happen. A phase ends when its gate is met,
and the gate is a file on `main`. From the first phase to the fourth the
change's agent drafts and the hand of the phase lands.

| # | Phase | The agent | The hand | Leaves on `main` | Ends when |
| --- | --- | --- | --- | --- | --- |
| 1 | Requirements | Drafts the page's marks and the three files from one sentence; asks what is a preference or a product decision | PM: answers, lands | PRD lines 🚧 and ❓; `proposal.md`, `decisions.md`, `user-journeys.md`; `hands:` | Every open item is a numbered question naming who answers it |
| 2 | UI design | Proposes the screens and the states from the page and the journeys, challenged and verified | Designer: tweaks, lands | `ui-design.md`; a Storybook story per state, shown on the PRD | Every state has a story, or `ui_waived` says there is no surface |
| 3 | Tech design | Proposes the system, the data flow and the rejected options, challenged against the principles | Tech PIC: challenges, lands | `tech-design.md` with charts; the engineer block links it | A design, or `design_waived` |
| 4 | Implementation | Two blind readings reconciled; the plan; each group built test first, audited and verified; the walk | PM reads the requirements; engineer reads the plan and each landing | `spec.md`, `feature-tcs.md`, `tasks.md`, `rounds.md`, code and E2E on `main` | Every box ticked and the journeys walked |
| 5 | Staging and release | The deploy, the run sheet, the cut | QA walks; release hand cuts | `deployed_env`, the run tab, `released_in`, the tag | Released, then archived |

Two loops leave the line:

- **A detail learned late** — lands on the PRD first, marked 🚧 or ❓, and
  every artifact after it is read again before anything is built on it
- **A production defect** — is fixed on a branch from the release tag,
  tagged again, and merged back to `main`

The page and the proposal are the source of truth for the two design files:

- **`ui-design.md` is inferred** — from the surfaces and the states the page
  says a reader meets, and the journeys; it links the frames and names the
  exports, and never restates the page
- **`tech-design.md` is inferred** — from the outcomes and the constraints
  the page and the proposal state, beside the UI design and before the
  requirements; it records how they land, and never restates them
- **A gap goes upstream first** — a state or a constraint either file needs
  that the page lacks is written on the page, marked 🚧 or ❓, before the
  file cites it; a scope fact goes to the proposal or `decisions.md` first

## Stages

A change is in exactly one stage, read from its files on `main` and never
set by hand.

| # | Stage | Evidence on `main` | The agent | You | Then |
| --- | --- | --- | --- | --- | --- |
| 1 | Proposed | `proposal.md`; then `decisions.md`, `user-journeys.md`, one 🚧 line per outcome on the PRD and `hands:`, ❓ on what is open | Drafts the marks and the three files; asks | PM: say what is wanted, answer | The designer and the tech PIC, told once the three are in |
| 2 | Designed | `ui-design.md` or `ui_waived`; `tech-design.md` or `design_waived` | Proposes both designs, challenged and verified | Designer: tweak. Tech PIC: challenge | The re-read runs `/specify` |
| 3 | Specified | `spec.md` with requirements; `feature-tcs.md`; every Raised row landed | Two blind readings, reconciled | PM: read the requirements and the cases together | Engineer, `/tasks <change>` |
| 4 | Planned | `tasks.md`; `promoted_by`; `landed_by` | Writes the plan, challenged for order, tests first and size | Engineer: read the summary | Engineers, `/build <change> <group>` |
| 5 | Building | Boxes ticking through `pnpm plan done`; a `rounds.md` row per group | Builds each group test first, audited and verified; the walk last | Engineer: read each landing | The deploy, on every green push |
| 6 | On staging | Every box ticked; `deployed_env: staging` | The deploy; the run sheet, automated cases left out | QA: walk it | Release hand, `/release` |
| 7 | Released | `released_in: <tag>` | The cut | Release hand: cut | Whoever archives, `/archive <change>` |
| 8 | Archived | The directory under `archive/`; the fold; the marks off | The fold | Whoever archives | — |

Every stage from Proposed to Building wears the agent mark with the hand's
move beside it, so the flow says what is a person's and what is an agent's.
Proposed is one stage for what is wanted: the proposal, the decisions and the
journeys land together, an open item stays ❓, and the designer and the tech
PIC are told once the three are in, because a move is the hand changing.

Overlays sit on a stage, a closed set of seven:

| Overlay | Read from | Told |
| --- | --- | --- |
| Waiting | `awaiting:` with the date it started | The hand that owes the artifact, once; again in the weekly digest after 14 days |
| Blocked | `depends_on:` naming a change not yet released | The blocked change's hand, when the dependency releases |
| Idle | 7 days without a tick, a claim or an artifact landing; shelved at 30. A repository-wide commit does not count | The current stage's hand, in the weekly digest |
| Behind | An artifact whose page lines or artifacts before it changed after it was drawn or last read again; never a tick, a claim or a wait | The hand of the earliest behind artifact, once; the digest after 7 days |
| Suite | `feature-tcs.md` status, `draft` or `approved`; never blocks the ladder | QA, when a suite lands as draft |
| Flag | `flag:` on the tasks heading | The release hand, while the flag is off in production |
| Hotfix | A `hotfix/<tag>` branch naming the change | The channel, on the tag |

## Rounds

Every artifact from the proposal to the code is written by one round, and
the thread is where a person works it. The page is
[Agent Rounds](../prds/products/shared/planning/agent-rounds.md).

| Step | Who | What happens |
| --- | --- | --- |
| 1 Ask | You | Say what is wanted, in the change's thread, a terminal, or an edit you push yourself |
| 2 Draft | The agent | Writes the artifact on `change/<id>` from what is before it and what you asked |
| 3 Challenge | Agents, one per perspective | Each reads the draft as one reader would |
| 4 Verify | Agents, one per group of findings | Argues whether each finding stands; what stands changes the draft |
| 5 Read | You | The summary and the numbered questions in the thread: answer, remark, or say land |
| 6 Land | The agent | On your word: `main`, `landed_by:`, a `rounds.md` row; the next hand is told; what comes after is read again |

- **Your moves** — `Q4: the second` answers; a remark is applied as written
  and re-read only by the perspectives it touches; `land` lands; an edit you
  push yourself is the same round
- **Questions** — numbered rows in the change's decisions with the agent's
  recommendation, or ❓ lines on the page; ids never reused; My turn lists
  the open ones per hand
- **Perspectives** — the plan: product, the reader, design, backend,
  integration, QA, operations; the UI design: the journeys walked, the
  design system's inventory and Figma parity, the copy; the tech design: the
  eight principles in four readers and the downstream reader; the plan of
  tasks: order, tests first, the E2E group, migration and flag, size; a
  group: missing pieces, simplicity, code smell, conventions. The
  simpler-thing reader runs always; a perspective joins when the draft
  touches what it reads for; a round of one reader verifies itself
- **The blind readings** — the requirements and the cases stay two readings
  reconciled after both; their stops go to the PM; no verifier over them
- **Read again** — a landing wakes the change's agent, which reads every
  artifact after it: an edit opens a round for that artifact's hand; a read
  that changes nothing writes `reviewed:` with the content id of what is
  before the artifact. An artifact lands only on a fresh chain; the fold
  refuses a behind delta; a moved goal is a question to the PM: extend,
  supersede or split
- **The record** — `rounds.md`, one row per round; a landing or a tick
  without its row is refused on a change opened after the rule
- **The walk** — the last group demonstrates the journeys in a browser,
  flips the cases it automates, leaves the E2E suite that runs on every push
  to `main` and its smoke cases on every staging deploy and cut; the run
  sheet leaves automated cases out
- **The runner** — the thread's app answers a hand there; the store's push
  workflow runs the re-read; ❓ which app, its approval and where the secret
  lives, Operations and the tech PIC confirm

## Hands and Messages

- **Record** — `hands:` in `.openspec.yaml`, one handle per role: `pm`,
  `design`, `tech`, `qa`, `dev`, `release`. Written by the PM at the
  interview's end, by the local manual's Assign action, or by
  `pnpm plan hand <change> <role> @handle` in `grade10`
- **Team map** — ❓ `docs/prds/team.yaml`: handle, Slack member id, roles;
  Operations confirms where it lives
- **Your turn** — one direct message when a push to `main` moves a change
  to a hand: the change, the stage, the thread to answer in; the role's
  channel when the hand is unnamed
- **A draft is ready** — one reply in the change's thread to its hand: the
  summary and the numbered questions
- **Behind** — one message to the hand of the earliest behind artifact:
  the artifact, and what changed before it
- **Landed** — the channel post per push stays, and names the stage each
  change moved into
- **Main is red** — a direct message to the pusher naming the rule that
  failed
- **Staging deployed** — the channel, and the QA hands of the changes
  carried, with the run tab
- **Release cut** — the channel, with the changes released and the flags
  still off
- **Weekly digest** — one per person: on you now, open questions, idle,
  behind, waiting
- **Never** — a message per commit or per tick, or the same move told twice

## Screens

| Surface | Route | Shows | Actions, local only |
| --- | --- | --- | --- |
| Board | `/board` | Eight lanes, one per stage, stacked as In Flight stacks four today, the five drafted lanes with the agent mark and the hand's move in their heading; each card the hand, the age, the overlays, the task bar; filters Mine, Waiting, Idle, Behind, Blocked; the shelf | — |
| Change page | `/change/<id>` | The stepper with the agent mark and the move under its first five steps; the Your turn card with the thread and the command; the hands table; each artifact fresh or behind, its open questions, who landed it; the rounds; tasks by group; the delivery row: main, staging, release | Assign to me, reassign, say I am waiting |
| My turn | `/mine` | The open questions on the reader; the changes whose current stage names them; then theirs later | Pick a handle |
| The thread | Slack | One per change: the first sentence, the draft summaries, the numbered questions, each landing and re-read | Answer, remark, land |
| PRD page | `/p/…` | Unchanged prose; the in-flight ribbon names the stage and the hand; each 🚧 line wears the pip of its change's stage | Propose |
| Release | `/release` | The production tag and what it carried; what is on staging and ready to cut; pending migrations; hotfixes; flags per environment | Cut a release |
| Slack | — | The messages above, each with the thread and the link | Open the thread; Not me; I am waiting on… |

The screens are drawn on two canvases. The blueprint page holds the mock-ups
of each surface; the [Day-to-Day Flow](https://claude.ai/artifact/3s5HjqvM9izRSQKPvUvJHk)
canvas holds the flow between them: the loop every hand runs, one hand's day as
a walkthrough, each hand's six steps, what one push does, and an example week.

## Rails

### Land Without a Pull Request

- **`pnpm land`** — rebases onto `origin/main`, runs the gate CI runs,
  pushes; a non-fast-forward rebases again, up to three times
- **The gate** — store: `check:manual`, `validate:changes` on the changes
  touched, `tcs:validate`, lint, typecheck; application: typecheck, lint,
  the unit lanes the diff touches
- **History** — linear; GitHub's *require linear history* on, *require a
  pull request* off
- **A red `main`** — fixed forward by the pusher within the hour, never
  force-pushed; lint's auto-fix commit stays; the manual deploy runs page
  rules alone, so a store break never takes the site down
- **Still a pull request** — ❓ a breaking public export contract; auth,
  payments and migrations in `grade10` when the tech PIC asks; a decision
  the PM wants a second reader on. The engineering lead confirms the list

### A Change That Moves While in Flight

- **The order** — the page's marked lines → proposal, decisions, journeys →
  ui-design and tech-design → the requirements and the cases → tasks → code
- **Behind** — an artifact whose page lines or artifacts before it changed
  after it was drawn or last read again; read from the content, so a
  one-commit checkout can compute it and a rebase cannot fool it
- **Read again** — a landing wakes the change's agent, which reads every
  artifact after it in order; nothing lands on a behind artifact, and the
  fold at archive refuses a behind delta; a tick, a claim and a wait are
  never held

| The re-read finds | It does | Because |
| --- | --- | --- |
| A value, a label or a state moved; the goals did not | Opens a round for that artifact's hand | The edit is the hand's to land |
| Nothing after it depends on what moved | Writes `reviewed:` alone, and says so in the thread | A read that changed nothing needs no person |
| A goal or a non-goal moved | Asks the PM: extend, supersede or split | A change mid-build is never rewritten in place without their word |
| Building has started and only part of the scope moved | Asks the PM to split | The settled part ships; the moved part opens its own change with `depends_on` |

### Release and Hotfix

| Rule | Value |
| --- | --- |
| Staging | `main`, on every green push |
| Production | The `production` branch, fast-forward only, one tag per deploy |
| Tag | ❓ `vYYYY.MM.DD`, a `.n` suffix for a second cut or a hotfix; the release hand confirms |
| Cut | `pnpm release cut [sha]`: fast-forward, tag, deploy the preview, smoke suite, promote; `released_in` on every change carried |
| Hotfix | `pnpm release hotfix <tag>`: branch from the tag, fix, tag `<tag>.n`, deploy, merge into `main`; never a migration |
| Record | `pnpm plan released <change> <tag>` writes `released_in:`; the archive reads it |

### Migrations

| Environment | Rule |
| --- | --- |
| Local | `pnpm db:reset` recreates the database from the committed migration SQL and the seed |
| Staging | A deploy carries no migration change: ❓ the deploy refuses while `migrations/` moved since the last deployed sha and `pnpm db:migrate staging` has not applied it; the engineering lead confirms refuse rather than apply-first |
| Production | The same at the cut; a hotfix never carries one |
| Planning | The tech design names the migration; `tasks.md` carries a Migration group ending in "applied on staging by @handle" |

### Testing a Feature

| Lane | Proves | Recorded as |
| --- | --- | --- |
| Staging | A person can walk the journeys on a deployed stack | The run tab count on the change page |
| E2E | The walk: the journeys in a browser at the end of Building; the whole suite on every push to `main`, the smoke cases on every staging deploy and at every cut | The E2E group in `tasks.md`; each case it covers marked automated, and left out of the run sheet; the report on the deploy post. ❓ Seeding on staging, where dev endpoints refuse today; QA and engineering decide |
| Production flag | A change ships dark and is turned on for a few | `flag:` on the tasks heading; the flags table on the Release page; archive refuses while the flag is off. ❓ Provider: Mixpanel feature flags or a config file; the engineering lead decides |

### Keeping the Store Small

| Rule | Value | What happens |
| --- | --- | --- |
| Archive retention | ❓ 60 days; the PM confirms | A monthly job removes older archived changes from the tree and leaves one row per change in `archive/INDEX.md`: id, shipped on, capabilities, the archive commit |
| Idle | 7 days | The overlay and the digest |
| Stale | 30 days idle, no wait | The board's stale shelf; the PM hand is asked to answer, reassign or drop |
| Drop | 60 days stale | The monthly job proposes it; a person confirms; the directory goes with the reason in the commit, and its 🚧 lines become ❓ |

On 2026-09-17: 101 archived changes since 2026-08-13, 7.6 MB in 748 files;
71 in flight, 29 with no `tasks.md`, 18 with every box ticked and not
archived, 8 waiting.

### Written for People

- **In the order it happens** — a page about a process is ordered as the
  events occur; the first thing a reader does is the first thing on the
  page
- **One word, one meaning** — every term of the line is defined once, in
  the glossary below and later on a Glossary page, and used with that
  meaning everywhere
- **Supplement last** — what most readers do not need sits after what they
  do
- **Show it** — a rule that moves over time gets a timeline; a set gets a
  table; a path between systems gets a flow with a chart; a rule that moves
  numbers gets a worked example

### Fewer Skills

Thirteen on the line, named by what the person does, each calling one
`round` skill; challenger and verifier agents under `.claude/agents/`;
design-to-code skills unchanged; craft skills moved off the line.

| Skill | Replaces |
| --- | --- |
| `round` | new: the six steps every line skill calls; the perspectives are schema data |
| `/plan` | `planning-pm`, `openspec-propose`, `prd-authoring`, `grilling` |
| `/design` | `planning-design` |
| `/tech` | `planning-dev`, the design half |
| `/specify` | `planning-qa`, `spec-to-tcs` |
| `/review-cases` | `tcs-review` |
| `/tasks` | `planning-dev`, the tasks half |
| `/build` | `openspec-apply-change`; `grade10`'s `implement` and `tdd` |
| `/land` | `commit`, `gen-commit-msg-staged`, `pr-push`, `spec-push`, `git-operations` |
| `/reconcile` | the re-read, inside `round` |
| `/run-sheet` | `tcs-run-sheet` |
| `/release` | new, in `grade10` |
| `/archive` | `openspec-archive-change` |
| `/status` | `dev-help` |

Unchanged: `design-system-primitives`, `design-tokens`,
`design-sync-check`, `page-from-figma`, `reconcile-figma-annotations`,
`ux-copy`, `email-templating`, `writing-style`. Off the line, under
`craft/`: the nine animation skills, `pick-ui-library`, `prototype`.

Documents, in the order a newcomer needs them: Start here; The delivery line
(new); Working a change; Writing the manual; Glossary (new); `AGENTS.md` cut
to the sources-of-truth table and the map to the rulebooks; the governance
rulebooks ordered by stage.

## Glossary

One meaning per word, as the line uses it.

| Term | Means | Not |
| --- | --- | --- |
| Capability | One thing a product does, at `openspec/specs/<product>/<domain>/<capability>/` | A change, a page |
| Spec | The durable requirements of a capability, what runs today | A delta, a PRD |
| PRD | The capability's page under `docs/prds/`, what the product should be | A spec, a proposal |
| Change | One directory under `openspec/changes/`, the work from proposal to archive | A commit, a pull request |
| Delta | A change's requirements against a spec, folded at archive | The spec itself |
| Fold | Writing a delta into the durable spec at archive | A merge |
| Stage | Which of the eight a change is in, read from its files | A status somebody sets |
| Overlay | Waiting, blocked, idle, suite, flag, hotfix - a fact beside the stage | A stage |
| Hand | The person a stage names, from `hands:` | An owner, who claimed a task group |
| Wait | An `awaiting:` line: what the change cannot write until somebody answers | Idle |
| Land | A push to `main` through the gate | A merge, a deploy |
| Deploy | Staging from `main`; production from a tag | A release |
| Release | A tag on `production` and the deploy it names | A deploy to staging |
| Hotfix | A branch from a release tag that ends as the next tag | A fix on `main` |
| Archive | The fold, the marks off, the directory filed under `archive/` | Deleting a change |
| Round | Ask, draft, challenge, verify, read, land: how one artifact or one task group is written | An interview, a review |
| Question | A numbered decisions row, or a ❓ line on the page, waiting on a hand | A finding an agent settled |
| Behind | An artifact whose page lines or artifacts before it changed after it was drawn or last read again | Idle, stale |
| Read again | The agent reading every artifact after a landing, opening a round where the change reaches one | A rewrite |
| The walk | The last task group: the journeys demonstrated in a browser, kept as the E2E suite | The run sheet |
| Prune | Removing an archived change from the tree after the retention window, leaving its index row | Archiving |

## Build Plan

| Milestone | Change | Done when |
| --- | --- | --- |
| M1 Stages and hands | `stage-changes-and-notify-hands` - open, on the planned page [Change Stages](../prds/products/shared/planning/change-stages.md), with its journeys, `ui-design.md` and `tech-design.md`, waiting on `/planning-qa` for the requirements | A change moving on `main` tells the next hand within a minute, and the board shows eight lanes with the agent mark and the hand's move on five |
| M2 Rounds | `run-a-round-on-every-artifact` - open, on the planned page [Agent Rounds](../prds/products/shared/planning/agent-rounds.md), depending on M1 | A PM opens a change from one sentence in Slack and lands the three files from the thread; a designer and a tech PIC land a draft they tweaked or challenged; an artifact behind is read again before anything lands after it; a change ends with its walk |
| M3 Land without a pull request | `land-on-main-through-the-gate` | A week of landings with no pull request and no red `main` older than an hour; `pnpm land` is the round's landing step |
| M4 Release line | `cut-releases-from-a-tag` | One release cut from the page and one hotfix walked end to end |
| M5 Keep it small | `keep-the-store-small` | The archive holds one quarter; a newcomer reads three pages and lands a change |

## Open Items

| # | Question | Recommendation | Owner |
| --- | --- | --- | --- |
| 1 | Tech design before the requirements? | Decided by the second brief: before, beside the UI design; the schema's `requires` for `tech-design` becomes `decisions` and `user-journeys`; a requirement that reaches it is a dated wait on the tech PIC | — |
| 2 | What records the approval of an artifact? | Decided: the landing on the hand's word, `landed_by:` per artifact; no `plan_approved`, no `pnpm plan approve` | — |
| ❓ 3 | Where does the handle-to-Slack map live? | `docs/prds/team.yaml` in the store | Operations |
| ❓ 4 | A deploy that needs a migration: refuse, or apply first? | Refuse; the migration is its own command | Engineering lead |
| ❓ 5 | Feature-flag provider? | Mixpanel feature flags, already connected; else a config file per environment | Engineering lead |
| ❓ 6 | How does the smoke suite seed on staging? | A signed seed endpoint enabled by a secret on staging only | QA, engineering |
| ❓ 7 | Archive retention window, and where pruned changes are read? | 60 days; git history through the index row's commit | PM |
| ❓ 8 | Tag format and cadence? | `vYYYY.MM.DD`, `.n` for a second cut or a hotfix, on demand | Release hand |
| ❓ 9 | Which changes still get a pull request? | A breaking export contract; auth, payments, migrations when the tech PIC asks; a second reader a PM asks for | Engineering lead |
| ❓ 10 | Can the hosted manual take Assign? | Local first; hosted waits for a sign-in | Operations |
| ❓ 11 | Which app holds a change's thread, and which run re-reads on a landing? | The vendor's Slack app for the thread, in a channel thread per change; the store's push workflow for the re-read; the secret in the workflow | Operations, tech PIC |
