# Delivery Workflow Blueprint

The owner's brief for the way a change moves from a product idea to a
released feature, as of 2026-09-17, and the shape drawn from it: five
phases, eight stages, three of them an agent's to write, the screens, the
messages and the rails. The
illustrated version is the
[blueprint page](https://claude.ai/artifact/FgryWCqw2EFSvoyaSb5BRC); this
document is the text of record. The first change it led to is
`stage-changes-and-notify-hands`; the rest are named under that change's
follow-on changes. Read this as the shape the tooling starts from, not as
its requirements.

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
and the gate is a file on `main`.

| # | Phase | Hand | Leaves on `main` | Ends when |
| --- | --- | --- | --- | --- |
| 1 | Requirements | PM, grilled by an agent | PRD lines 🚧 and ❓; `proposal.md`, `decisions.md`, `user-journeys.md`; `hands:` | Every open item names who answers it |
| 2 | UI design | Designer | `ui-design.md`; a Storybook story per state, shown on the PRD | Every state has a story, or `ui_waived` says there is no surface |
| 3 | Tech design | Tech PIC | `tech-design.md` with charts; the engineer block links it | A design, or `design_waived` |
| 4 | Implementation | An agent; QA reads the cases, the engineer the summary and each landing | `spec.md`, `feature-tcs.md`, `tasks.md`, code and E2E on `main` | Every box ticked |
| 5 | Staging and release | QA, release hand | `deployed_env`, the run tab, `released_in`, the tag | Released, then archived |

Two loops leave the line:

- **A detail learned late** — lands on the PRD first, marked 🚧 or ❓, then
  `/reconcile` carries it down the change
- **A production defect** — is fixed on a branch from the release tag,
  tagged again, and merged back to `main`

The page and the proposal are the source of truth for the two design files:

- **`ui-design.md` is inferred** — from the surfaces and the states the page
  says a reader meets, and the journeys; it links the frames and names the
  exports, and never restates the page
- **`tech-design.md` is inferred** — from the outcomes and the constraints
  the page and the proposal state; it records how they land, and never
  restates them
- **A gap goes upstream first** — a state or a constraint either file needs
  that the page lacks is written on the page, marked 🚧 or ❓, before the
  file cites it; a scope fact goes to the proposal or `decisions.md` first

## Stages

A change is in exactly one stage, read from its files on `main` and never
set by hand.

| # | Stage | Evidence on `main` | Written by | Then |
| --- | --- | --- | --- | --- |
| 1 | Proposed | `proposal.md`; then `decisions.md`, `user-journeys.md`, one 🚧 line per outcome on the PRD and `hands:`, ❓ on what is open | PM, grilled by an agent | PM, `/plan <change>`, until the three are in; then designer and tech PIC, `/design`, `/tech` |
| 2 | Designed | `ui-design.md` or `ui_waived`; `tech-design.md` or `design_waived` | Designer and tech PIC, with an agent | QA, `/specify <change>` |
| 3 | Specified | `spec.md` with requirements; `feature-tcs.md`; every Raised row landed | An agent; QA reads the cases | Engineer, `/tasks <change>` |
| 4 | Planned | `tasks.md`; `promoted_by`; `plan_approved` by a person | An agent; the engineer approves the summary | Engineers, `/build <change> <group>` |
| 5 | Building | Boxes ticking through `pnpm plan done` | Agents, test first; the engineer reads each landing | The deploy, on every green push |
| 6 | On staging | Every box ticked; `deployed_env: staging` | The deploy; QA walks the run sheet | Release hand, `/release` |
| 7 | Released | `released_in: <tag>` | Release hand | Whoever archives, `/archive <change>` |
| 8 | Archived | The directory under `archive/`; the fold; the marks off | Whoever archives | — |

Specified, Planned and Building are the agent's stretch: an agent writes each
from what is upstream, a person reads it before it lands, and every surface
marks the three so the flow says what is a person's and what is an agent's.
Proposed is one stage for what is wanted: the proposal, the decisions and the
journeys land together, an open item stays ❓, and the designer and the tech
PIC are told once the three are in, because a move is the hand changing.

Overlays sit on a stage:

| Overlay | Read from | Told |
| --- | --- | --- |
| Waiting | `awaiting:` with the date it started | The hand that owes the artifact, once; again in the weekly digest after 14 days |
| Blocked | `depends_on:` naming a change not yet released | The blocked change's hand, when the dependency releases |
| Idle | 7 days without a tick, a claim or an artifact landing; stale at 30. A repository-wide commit does not count | The current stage's hand, in the weekly digest |
| Suite | `feature-tcs.md` status, `draft` or `approved`; never blocks the ladder | QA, when a suite lands as draft |
| Flag | `flag:` on the tasks heading | The release hand, while the flag is off in production |
| Hotfix | A `hotfix/<tag>` branch naming the change | The channel, on the tag |

## Hands and Messages

- **Record** — `hands:` in `.openspec.yaml`, one handle per role: `pm`,
  `design`, `tech`, `qa`, `dev`, `release`. Written by the PM at the
  interview's end, by the local manual's Assign action, or by
  `pnpm plan hand <change> <role> @handle` in `grade10`
- **Team map** — ❓ `docs/prds/team.yaml`: handle, Slack member id, roles;
  Operations confirms where it lives
- **Your turn** — one direct message when a push to `main` moves a change
  into a stage, to that stage's hand: the change, the stage, the command to
  paste; the role's channel when the hand is unnamed
- **Landed** — the channel post per push stays, and names the stage each
  change moved into
- **Main is red** — a direct message to the pusher naming the rule that
  failed
- **Staging deployed** — the channel, and the QA hands of the changes
  carried, with the run tab
- **Release cut** — the channel, with the changes released and the flags
  still off
- **Weekly digest** — one per person: on you now, idle, waiting
- **Never** — a message per commit or per tick, or the same move told twice

## Screens

| Surface | Route | Shows | Actions, local only |
| --- | --- | --- | --- |
| Board | `/board` | Eight lanes, one per stage, stacked as In Flight stacks four today, the agent-driven three marked in their heading; each card the hand, the age, the overlays, the task bar; filters Mine, Waiting, Idle, Blocked; a stale shelf | — |
| Change page | `/change/<id>` | The stepper, its agent-driven steps bracketed; the Your turn card with the command; the hands table; each artifact with its freshness; tasks by group; the delivery row: main, staging, release | Assign to me, reassign, say I am waiting, approve the summary |
| My turn | `/mine` | The changes whose current stage names the reader; then theirs later | Pick a handle |
| PRD page | `/p/…` | Unchanged prose; the in-flight ribbon names the stage and the hand; each 🚧 line wears the pip of its change's stage | Propose |
| Release | `/release` | The production tag and what it carried; what is on staging and ready to cut; pending migrations; hotfixes; flags per environment | Cut a release |
| Slack | — | The messages above, each with the command and the link | Open the change; Not me; I am waiting on… |

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

- **The chain** — PRD marks → proposal → decisions → journeys → ui-design
  and tech-design → outline → suite → requirements → tasks → code
- **Behind** — an artifact whose upstream carries a newer commit; the badge
  is computed from commit dates on `main`
- **`/reconcile`** — reads what moved and proposes the smallest edit set; a
  person approves it before it lands

| Found | Proposes | Because |
| --- | --- | --- |
| A value, a label or a state moved; the goals did not | Extend | Edit the downstream artifacts in place; a `decisions.md` row dated as reconciled |
| A goal or a non-goal moved | Supersede | A new change retires this one; the 🚧 lines are re-homed |
| Building has started and only part of the scope moved | Split | The settled part ships; the moved part opens its own change with `depends_on` |
| Nothing downstream depends on what moved | Refresh | A `reviewed:` date clears the badge |

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
| E2E | The flows across pages, cookies and workers, in a browser; the smoke subset on every staging deploy and at every cut | The E2E group in `tasks.md`; the report on the deploy post. ❓ Seeding on staging, where dev endpoints refuse today; QA and engineering decide |
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

Thirteen on the line, named by what the person does; design-to-code skills
unchanged; craft skills moved off the line.

| Skill | Replaces |
| --- | --- |
| `/plan` | `planning-pm`, `openspec-propose`, `prd-authoring`, `grilling` |
| `/design` | `planning-design` |
| `/tech` | `planning-dev`, the design half |
| `/specify` | `planning-qa`, `spec-to-tcs` |
| `/review-cases` | `tcs-review` |
| `/tasks` | `planning-dev`, the tasks half |
| `/build` | `openspec-apply-change`; `grade10`'s `implement` and `tdd` |
| `/land` | `commit`, `gen-commit-msg-staged`, `pr-push`, `spec-push`, `git-operations` |
| `/reconcile` | new |
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
| Prune | Removing an archived change from the tree after the retention window, leaving its index row | Archiving |

## Build Plan

| Milestone | Change | Done when |
| --- | --- | --- |
| M1 Stages and hands | `stage-changes-and-notify-hands` - open, on the planned page [Change Stages](../prds/products/shared/planning/change-stages.md), with its journeys, `ui-design.md` and `tech-design.md`, waiting on `/planning-qa` for the requirements | A change moving on `main` tells the next hand within a minute, and the board shows eight lanes with the agent's three marked |
| M2 Land without a pull request | `land-on-main-through-the-gate` | A week of landings with no pull request and no red `main` older than an hour |
| M3 Release line | `cut-releases-from-a-tag` | One release cut from the page and one hotfix walked end to end |
| M4 Keep it small | `keep-the-store-small` | The archive holds one quarter; a newcomer reads three pages and lands a change |

## Open Items

| # | Question | Recommendation | Owner |
| --- | --- | --- | --- |
| ❓ 1 | Tech design before the requirements, as the brief orders it, or after, as the schema does today? | Before, from the journeys and the decisions; the schema's `requires` for `tech-design` becomes `decisions` and `user-journeys`; a spec still names no mechanism | PM, tech PIC |
| ❓ 2 | What records the approval of the implementation summary? | `plan_approved: @handle YYYY-MM-DD` by `pnpm plan approve`; the first claim on a group without it is refused | Engineering lead |
| ❓ 3 | Where does the handle-to-Slack map live? | `docs/prds/team.yaml` in the store | Operations |
| ❓ 4 | A deploy that needs a migration: refuse, or apply first? | Refuse; the migration is its own command | Engineering lead |
| ❓ 5 | Feature-flag provider? | Mixpanel feature flags, already connected; else a config file per environment | Engineering lead |
| ❓ 6 | How does the smoke suite seed on staging? | A signed seed endpoint enabled by a secret on staging only | QA, engineering |
| ❓ 7 | Archive retention window, and where pruned changes are read? | 60 days; git history through the index row's commit | PM |
| ❓ 8 | Tag format and cadence? | `vYYYY.MM.DD`, `.n` for a second cut or a hotfix, on demand | Release hand |
| ❓ 9 | Which changes still get a pull request? | A breaking export contract; auth, payments, migrations when the tech PIC asks; a second reader a PM asks for | Engineering lead |
| ❓ 10 | Can the hosted manual take actions? | Local first; hosted waits for a sign-in | Operations |
