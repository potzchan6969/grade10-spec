---
tcs_rules_rev: 4
---

# Specs to Test Cases

A suite — `feature-tcs.md`, `domain-tcs.md`, `product-tcs.md`, `platform-tcs.md` — is written from the anchors a capability declares, never from the scenarios beside it and never as a second source of truth. Case shape follows [Virtuoso QA's guide](https://www.virtuosoqa.com/post/test-cases); the property vocabularies are the standard ones, so a suite reads the same to any tool that takes it.

A **feature** suite is written **blind**: by a reader who cannot see the spec's `## Requirements` at all. A suite derived from the scenarios can only find inconsistency inside them, never the behaviour they left out — and finding that is what the second reading is for. The scenarios are drafted from the same anchors in parallel, and the two are reconciled once both land.

## The Rule

- **The spec is correct** — once the scenarios exist and the two readings are reconciled, a suite that disagrees with the spec is regenerated. Before reconciliation there is nothing to disagree with: the suite is the only reading there is, and it is provisional. A proposal never links a suite in place of a spec delta
- **Anchors are given** — every section is one `user-journeys.md` journey. A capability nobody walks carries one section instead, `## <capability>-US1`, and names its feature set groups on the cases' `**Trace:**` lines — a section per group would number a case by that group's position, and an issued case id is permanent. There is no cap on the number of journeys. A suite never invents a flow, and splitting or merging journeys is an edit to the journeys file
- **A case comes from an anchor** — never from a scenario, which on a feature run does not exist yet. A case that carries behaviour no anchor implies is a product decision in disguise, and reconciliation is where it is settled
- **A hole is reported** — an anchor no case covers, a case tracing an anchor nothing defines: report it, never close it by inventing a case or a journey
- **Properties are QA's** — they classify scenarios the spec states. A wrong property is fixed in review and is never grounds to change a step or an expected result

## The Isolated Input

A feature run reads a bundle the caller assembles, and nothing outside it.

- **Included** — `## Purpose` and `## Feature set` from the capability's `spec.md`, its `user-journeys.md`, the change's `proposal.md`, its `decisions.md` — the goals and the non-goals, so no case is written against something the interview ruled out, and its `## Raised` table, which is what earlier runs asked and what came of it — its `ui-design.md` where one exists — written before the requirements, with its states tied to anchors rather than scenario ids, and with the dispositions the second requirements pass wrote onto those bullets stripped — the linked pages under `docs/prds/`, `openspec/config.yaml`'s `context`, the existing `feature-tcs.md` for id continuity with its `## Reconciliation` stripped, and that suite's `## Settled` — the questions earlier runs asked and had answered, which is what keeps a refused reading from being raised again every time
- **Excluded** — every `## Requirements` section, `openspec/specs/` beyond the two included sections, and `openspec/changes/archive/` entirely. An archived change keeps an un-stripped `## Reconciliation` naming scenario ids, so reading archive reopens the leak invisibly on the next change to that capability
- **Recorded** — the `## Reconciliation` Run line names the bundle: what the pass read, and what it was denied. Nothing in this store computes or verifies a digest of it, so the line is the run's own statement, not proof; a hash written there says only that somebody wrote a hash
- **Assembled by hand where no caller built one** — a person running the skill directly assembles it and says so in the report. Reading the requirements "just to check" is how the property is lost, and nothing downstream can detect that it was
- **An empty `## Raised`, run after run, is the failure signal** — and the only one this store can actually read. It sits in the change's `decisions.md`, and `pnpm check:manual` warns on an empty one. The Run line says what the reader saw, never how it read. A second reading that asks nothing, several runs running, has either stopped being blind or stopped being a different method, and the suite is not passed on that basis until someone has checked why
- **Different methods, not the same one twice** — the blind reader works a test-design checklist: boundary values, equivalence partitions, state transitions, CRUD completeness, empty / one / many, null and missing, permission matrix, error taxonomy, SEO and indexability. Two readings that use the same method produce synonyms, and the reconciliation then finds nothing

## Raised

The blind reading ends with its raised questions: every point the input did not settle, as a question for the author. Not cases, not defects — the things the reader had to decide for itself in order to write anything at all.

They go to the change's `decisions.md`, under `## Raised`, one row per question — `Capability | Raised | Landed`. Not to the suite, which carries no such section.

- **What belongs** — a rule the input is silent on. "Is a scheduled lot open to bid on? The spec names not-yet-published, ended and called off as failures and never places scheduled on either side." That is a question the material cannot answer, and it is how a state nobody had thought about gets found
- **What does not** — anything the input settles and the reader missed; anything for the technical design rather than the behaviour; anything the reader merely wants to know more about
- **It lands where the author is already reading** — `decisions.md` is the file the change's scope lives in, and the row carries the capability whose pass asked, so one table holds every capability's questions in the order they were raised
- **Every row lands before the change merges** — as a `Decisions` row in that same file, or as a ❓ on the capability's PRD naming who owes the answer. There is no third resting place, and `pnpm check:manual` refuses a row that names neither. That is the deadline the list used to lack: at the bottom of a suite it could sit unread until review, and a change could merge with it untouched
- **Escalated and deferred rows are written twice** — the landing in `decisions.md`, and the disposition in the suite's `## Reconciliation`, with the answer in `## Settled`. `decisions.md` archives with the change and is folded nowhere, so a row landing only there is unreadable by the pass most likely to raise it again
- **It carries no scenario id** — `decisions.md` goes into the next blind pass's isolated input whole, `## Raised` included: that section says what has already been asked, which is not what the scenarios say

## Reconciliation

Once both readings land, the caller joins them on anchors and writes a `## Reconciliation` section at the bottom of the suite. It is the evidence the blind pass ran and what it bought: without it, a pass that found nothing and a pass that never happened look identical in git.

| Diff | Disposition |
| --- | --- |
| A case carries behaviour no scenario states, and it is real | Fold it into `spec.md` as a scenario |
| A case carries behaviour no scenario states, and it is a misreading | Drop the case, record the reason |
| A case carries behaviour **nobody ever decided** | Stop and ask the author |
| A case carries behaviour **nobody present can settle** | Keep the case `draft` with `**Blocked:** <who settles it>` |
| A scenario no case reaches | Add a case, or `**Out of suite:**` naming where it is verified instead |
| The two readings **state opposite things** | Stop and ask the author |

- **A contradiction is never resolved by the run** — where a case and a scenario both describe the same behaviour and disagree, one of them is wrong and nothing in the material says which. Filing it as a misreading is how the blind reading gets overruled by the reading it exists to check, so it goes to the author like any undecided behaviour
- **A finding is recorded where it was found, and folded where it belongs** — a capability's reconciliation names what its own blind pass raised, even when the rule lands in another capability's spec. The disposition line says where it went, so the two are findable from each other
- **Settled stays settled** — a rejection is copied into the durable suite's `## Settled` at fold, one line, no scenario ids. That section is a legal part of the next blind pass's isolated input: it tells the reader what has already been asked and answered, which is not the same as telling it what the scenarios say. Without it the same misreading is raised by every future run, nobody remembers why it was refused last time, and reconciliation fills with noise until someone starts rubber-stamping it
- **Blocked is not rejected** — a question nobody could answer is not a misreading, and filing it as one deletes the most valuable thing the pass produces. The case stays, a ❓ goes on the PRD, an open question goes on the proposal, and no scenario is written
- **An escalated or deferred row is written here as well as in `decisions.md`** — that file archives with the change and is folded nowhere, so a row landing only there leaves the next blind pass with no record of what was asked. The landing says what was decided; this section says what the run did with the case, and `## Settled` carries the answer forward
- **Out of suite names its verifier** — a consuming repository's build and type check, a database constraint, a design review, a higher-level suite. A scenario that can name no such place is a hole, not an exemption
- **Manual names what a person drives** — `### Manual` carries a `| Manual | Why |` table, one row per case no automated test decides, and that row is where the reason lives. The row names the part a person walks — a message typed in a thread, a tab in the run spreadsheet, a deploy. Where a test already proves some of it, the row names that test and what the case walks beyond it. An automated case names its test on the case itself, on its Decided-by line, and is left off the run sheet
- **A credited test carries the case id** — a legend above the table binds each name a row uses to a path, `` - <name> - `<path>`, in this store `` or `` in the application repository ``; a test in this store that a row credits cites the row's case id, and `pnpm run tcs:validate` refuses one that does not, and a legend path this store does not hold; a path in the application repository is checked where that repository ticks the group
- **A row waiting on a walk names it** — a row whose walk nobody has run yet reads `to be walked in <the walk>`, and the run that runs the lane rewrites the rows to what the walk reached
- **Scenario ids are temporary here** — they may appear in `## Reconciliation` only while the change is open; archive fold and `/tcs-review` both strip them, leaving the dispositions and the reasons

## Naming

| Id | Lives in | Example |
| --- | --- | --- |
| `<capability>-US-<n>` | `user-journeys.md` journey | `grade10-site-store-product-listing-US-01` |
| `<capability>-SC-<n>` | `spec.md` scenario | `grade10-site-store-product-listing-SC-01` |
| `<capability>-US<n>` | `feature-tcs.md` journey heading | `grade10-site-store-product-listing-US1` |
| `<capability>-US<n>-TC<m>-<v>` | `feature-tcs.md` case | `grade10-site-store-product-listing-US1-TC1-1` |
| `<product>-<domain>-e2e-US<n>` | `domain-tcs.md` journey heading | `grade10-site-auction-e2e-US1` |
| `<product>-<domain>-e2e-US<n>-TC<m>-<v>` | `domain-tcs.md` case | `grade10-site-auction-e2e-US1-TC1-1` |
| `<product>-e2e-US<n>` | `product-tcs.md` journey heading | `grade10-admin-e2e-US1` |
| `<product>-e2e-US<n>-TC<m>-<v>` | `product-tcs.md` case | `grade10-admin-e2e-US1-TC1-1` |
| `platform-e2e-US<n>` | `platform-tcs.md` journey heading | `platform-e2e-US1` |
| `platform-e2e-US<n>-TC<m>-<v>` | `platform-tcs.md` case | `platform-e2e-US1-TC1-1` |

- **`<capability>`** — the full path with slashes as hyphens, `<product>-<domain>-<capability>`, so two capabilities of one name stay apart
- **A scenario added beside one takes a letter** — `<n>` may carry one lower-case letter, `…-SC-07a`, so a scenario placed beside `…-SC-07` renumbers no other; the letter is part of the id
- **`e2e` sits in the capability slot** — a domain, product or platform suite numbers its own journeys; each is a path across capabilities, domains or products, and its `**Trace:**` names every capability journey it crosses
- **A prefix never moves** — fixed at a capability's first ids; a renamed or moved capability goes on issuing what it issued. Read the ids that exist before issuing one; only a first id derives the prefix from the path
- **Compact form in a suite** — the hyphen after `US` dropped, no zero-pad: `…-US-01` becomes the section `## …-US1: …` holding `…-US1-TC1-1`. The journeys file and the `**Trace:**` line keep the canonical `…-US-01`
- **Cases number per journey from 1** — an issued id is permanent; a retired case is `deprecated`, never renumbered away; a new case takes the next unused `TC<m>`
- **`<v>` tracks behaviour, not prose** — `1` as first written; it goes up only when the requirements change what the case verifies

| What happened | `<v>` | `Status` |
| --- | --- | --- |
| A `draft` is restyled | unchanged | stays `draft` |
| An `actual` case still `manual` is re-worded | unchanged | stays `actual` |
| An `actual` case that is `automated` is re-worded | — | not a restyle: a behaviour change, or it does not happen |
| The requirements changed what the case verifies | bump | back to `draft`, rewritten, reviewed again |

## Levels

| Level | File | Covers | Derives from | Owes | A case traces |
| --- | --- | --- | --- | --- | --- |
| `platform` | `openspec/specs/platform-tcs.md` | paths across products | every product's `user-journeys.md`, the pages under `docs/prds/` | nothing: a few curated smoke paths | two or more journeys, from two or more products |
| `product` | `<product>/product-tcs.md` | paths across the domains of one product | every domain's `user-journeys.md` in it, its `docs/prds/` pages | nothing: a few curated smoke paths | two or more journeys, from two or more domains of that product |
| `domain` | `<product>/<domain>/domain-tcs.md` | paths across the capabilities of one domain | every capability's `user-journeys.md` in it, the domain's `docs/prds/` pages | every cross-capability path its journeys imply | two or more journeys, from two or more capabilities of that domain |
| `feature` | `<capability>/feature-tcs.md` | one capability's journeys, refusals and edge cases | that capability's `spec.md` and `user-journeys.md` | every scenario its journeys accept | one journey |

- **The file name carries the level** — `test-cases.md` is not a suite name
- **`product` and `platform` are health checks** — every case `**Suites:** smoke`; a suite past a page has stopped being a smoke pass
- **A suite exists only where a path exists** — a product with one domain has no `product-tcs.md`, a product with no specs has nothing, and `platform-tcs.md` starts with the first cross-product path; none of those absences is a gap
- **`shared/` gets no product suite** — its capabilities get feature suites, and paths across them `shared/<domain>/domain-tcs.md`
- **Levels run top down** — platform, product, domain, feature, deriving and reviewing alike; each level names the paths it owns and the level below covers what those do not reach
- **`/spec-to-tcs [platform|product|domain|feature] <target>`** — the level first, or inferred from the target's shape

### One purpose, one case

- **The spec that states the behaviour owns the case** — wherever the outcome is observed: `grade10-admin/auction/listing` SC-16 opens a page on the Grade10 site, and the case is the listing capability's
- **The levels above hold composed paths** — what no single spec states end to end; a composed case names every journey it walks, and one trace at a composed level fails `pnpm run tcs:validate`
- **Compose from evidence** — a run reads every `user-journeys.md` and every `docs/prds/` page in its scope before writing: a domain run reads the changed capability's journeys, every sibling capability's, and the domain's `index.md` and each PRD under it for its words and seeded values; a platform run reads the same one scope wider
- **Within a level** — two cases whose traces and outcomes say the same thing are one case; differing only in a value, one case with a row per run
- **Across levels** — a `product` or `platform` case re-walks lower coverage on purpose, to ask whether the seam holds. Duplication is a lower case that exists only to re-test a higher path, or two composed cases at one level on the same path
- **The validator reports, a human decides** — identical trace sets among composed cases, and journeys traced at more than one level, are evidence, not proof

### When a Change Touches a Suite Above It

1. Take the capabilities the change's `## Capabilities` names and the delta `spec.md` paths it carries
2. Intersect their journeys with the `**Trace:**` lines in that domain's `domain-tcs.md` and in `platform-tcs.md`
3. A hit, or a capability new to a domain that has a `domain-tcs.md`, is an impact at that level

On a hit the change carries an edit to that suite or one proposal line — `No domain impact: <why>`, `No platform impact: <why>`. No check parses it; the round's readers read for it. `## Impact` is not the signal: it records code, not paths.

## Who the Actor Is

| Class | Who |
| --- | --- |
| `customer` | anyone outside the business — the person the product is sold to |
| `admin` | anyone inside it — the people who run the shop |

- **Every role is a class holding a state or a grant** — collector, bidder, shop staff, treasurer: the state is a pre-condition, not the actor
- **A qualifier carries what the rule needs** — the class, then the state or grant in brackets; its wording is **How a Case Reads**
- **A product serves both classes** — `openspec/config.yaml` places a capability by who is held to it, not whose screen shows it
- **Any other actor is not a journey** — engineers, QA, reviewers and consuming applications are not end users: software this store ships is the system's side of a journey, and the people who build the product walk a test. An outside agent that acts on its own is a role — a crawler, a preview fetcher, a provider calling back — and its cases still name the class whose surface the rule is checked on. A capability nobody reaches writes `**Walked by:** nobody on their own — <who inherits it>`; `pnpm run tcs:validate` fails a journey whose actor resolves to none of the three
- **The team walks the delivery line** — a capability under `shared/planning/` is the store's own rails, and its users are the hands of a change: a product manager, a designer, a tech PIC, QA, an engineer, a release hand. There, and only there, a teammate is an `admin`, and a case names the role as the qualifier: `admin(product manager) is on <change page url>.`

## Where It Lives

| Capability location | Suite location |
| --- | --- |
| Durable: `openspec/specs/<product>/<domain>/<capability>/` | `.../feature-tcs.md`, beside `spec.md` and `user-journeys.md` |
| In-flight: `openspec/changes/<change>/specs/<product>/<domain>/<capability>/` | `.../feature-tcs.md`, beside the same two |
| Domain, durable: `openspec/specs/<product>/<domain>/` | `.../domain-tcs.md` |
| Domain, in-flight: `openspec/changes/<change>/specs/<product>/<domain>/` | `.../domain-tcs.md`, folded into the durable file at archive |
| Platform | `openspec/specs/platform-tcs.md`, one for the store |

- **One tree per run** — `/spec-to-tcs` writes only to the tree the argument names; when a capability is in both, ask, never prefer the delta
- **Archive carries the suite** — the delta's `feature-tcs.md` moves with its `spec.md`
- **Every capability with checkable scenarios gets a suite** — missing or empty journeys are written first, from `spec.md`, to `openspec/config.yaml` (`rules.specs`, `rules.user-journeys`); a spec with no scenarios is not ready

## When Suites Are Generated

- **Automatic** — once the proposal, the journeys and the outline are written, `/workflow-specify` runs `/spec-to-tcs <change>` on the change's branch: every case `draft`, ahead of the scenarios. A draft carries no authority, so the product manager approves nothing by it; review is `/tcs-review`, later
- **Both files on one word** — `/workflow-specify` lands `spec.md` and `feature-tcs.md` together, so `main` never carries requirements with no suite beside them; CI's `pnpm run tcs:validate --require-suites` warns on a capability that still has journeys and no suite
- **`skip_specs`** — nothing to generate
- **Manual** — `/spec-to-tcs <capability-or-change>`, either tree:

| Argument | Resolves to |
| --- | --- |
| a change name (`add-auction-auto-bidding`) | every delta under `openspec/changes/<change>/specs/` |
| a capability id (`grade10-site/store/home`) | the durable spec, or ask when an active delta also exists |
| a path under `openspec/specs/` or `openspec/changes/` | exactly that tree |

### When a Suite Already Exists

A second run is never a silent overwrite: `/spec-to-tcs` shows the suite it found — file status, journeys, cases and statuses, scenarios gained or lost — and asks.

| Choice | Does |
| --- | --- |
| Update | new cases for untraced scenarios, re-worded cases for changed ones, `deprecated` for scenarios the spec lost; ids and reviewed properties survive |
| Another target | leaves this suite untouched |
| Regenerate the drafts | offered when `**Drafts styled:**` sits below `tcs_rules_rev`: every `draft` rewritten under the current rules, as **Rules Revisions** says; `actual` and `deprecated` cases kept; one yes |
| Regenerate | rewrites the whole file; destroys review history; explicit confirmation, and only when the guard allows |

- **Regeneration guard** — a whole-file regenerate is refused when the file is `approved` or any case is `actual`. A reviewer who wants a clean rewrite moves those cases back to `draft` by hand first; an agent never does. Regenerating the drafts is not under the guard: it leaves every reviewed case as it is
- **A delta that moves the ground under an `actual` case** — resolved in the same change, before the suite lands: changed what the case verifies → `<v>` bumped, `**Status:** draft`, rewritten, reviewed again; removed the behaviour → `**Status:** deprecated`; did not touch what the case asserts → left `actual`, and the run says so. Marking is never deferred: the case goes back to `draft` at once, and only the review waits

## How a Case Reads

The house style — titles, step and result shape, pre-condition and placeholder wording, classification starting shapes, setup recipes — is [`tcs-conventions.md`](tcs-conventions.md), not this document. This document is the contract; that file is how a case reads on top of it, and it moves without a rules revision.

- **Generation writes to it** — `/spec-to-tcs` reads the conventions before it writes, the narrowest scope first; a draft is born in the current style
- **Review restyles to it** — `/tcs-review` brings every `draft` to the conventions before the first journey: id kept, `<v>` unchanged, status `draft`, coverage untouched. `actual` and `deprecated` cases are never restyled; a manual `actual` case only on the reviewer's yes
- **Review adds to it** — when a review ends, every edit the reviewer made is offered back as a candidate line; each is confirmed, reworded or refused, and lands in that file's scope or its `## Refused`. Nothing lands unasked
- **It refines how, never what** — a convention cannot add coverage, loosen "mechanism is yours, coverage is the spec's", licence an invented label, or overrule this document; a contradicting line is reported and this document followed
- **A convention that must hold everywhere is a contract** — it moves here with a rules revision

## The Review Lane

**The one lane still on a pull request**, merged by its reviewer: a verdict is a reviewer's own over a durable file, with no artifact row and no hand for the landing to land it as.

| | |
| --- | --- |
| Branch | `tcs-review/<level>-<target>`, off `main`, before the first verdict; a second reviewer on the same suite appends `-US<n>-<m>` |
| Commits | preparation first, each its own commit and pushed before the first journey: `test(<domain>): regenerate <target> test cases under tcs-rules r<n>` or `test(<domain>): restyle <target> test cases`, then `test(<domain>): fill in how to run <target> test cases`, then `test(<domain>): add test data to <target> test cases`; then `test(<domain>): approve <target> US<n> test cases`, one per journey; last, `docs(governance): conventions from the <target> review` |
| PR title | `test(<domain>): approve <target> US<n>–<m> test cases` — the journeys the branch carries |
| PR label | `documentation` |
| Merges | at journey boundaries; a stopped review still opens a draft PR for what has verdicts |

- **One journey at a time** — its three-line statement, then every `draft` case in full, with `actual` and `deprecated` cases listed by id; scenarios offered, and quoted in full on request
- **Only a human approves** — verdicts approve, change, defer or retire, in the reviewer's words; ids are echoed back and only what was named is marked. Approve → `actual`, defer → `draft`, retire → `deprecated`; the file status follows on its own
- **Questions are answered from the spec** — quoting the clause, never from an assumption about the product. A "how do I run this" is a case failing **Executable without asking**: the answer is offered as an edit to its steps
- **Prepare first** — before the first journey, in order: a draft below the rules revision is regenerated, otherwise restyled to the conventions; the mechanism is filled in until every draft is **Executable without asking**; test data is proposed. An `actual` case still `manual` is touched only on the reviewer's yes; an `automated` case is left as it is. The reviewer gets one summary of what preparation changed, and each changed case carries its note again when its journey is walked
- **A flow that disagrees is classified, not fixed** — where the spec's flow, `ui-design.md` or the PRD disagrees with a case, the PRD, the Feature set, `decisions.md`, `## Reconciliation` and `## Settled` are read first: already settled → follow it; the case misread → a proposed change; the spec wrong or silent → a gap for its author; undecidable → both sides shown to the reviewer
- **Journeys are the author's** — a doubt about a journey itself (two with one purpose, one too wide, a wrong actor) is a finding for the spec's author, landed on the PRD as a ❓ or in the next change's `decisions.md`; a review never edits `user-journeys.md`
- **Teach at the end** — every edit the reviewer made is offered back as a candidate line for [`tcs-conventions.md`](tcs-conventions.md), one at a time; confirmed lines land in their scope, refused ones under `## Refused`
- **Finding suites** — any file holding a `draft`: none → say so and name where suites live; one → review it; more → list `reopened` first, then `in-review`, then `pending-review`, with pending counts, and ask
- **Top down** — platform, product, domain, then feature; when a domain's last feature suite is approved, offer its `domain-tcs.md`, then `platform-tcs.md`
- **Two reviewers is allowed** — open PRs on the file are reported as information; the file is re-read from disk before each verdict is written
- **Push at the end of a session** — `/tcs-review` offers to commit and push what has a verdict

## The Suites This Store Does Not Yet Have

Thirty capabilities carry a suite and thirty-nine do not; seventeen of those thirty-nine are ones nobody walks, which used to be exempt and no longer are. That is eight hundred scenarios with no cases beside them, and the thirty that do have cases were derived from the scenarios rather than read independently.

**None of it is being filled in one pass, and that is a decision rather than a backlog nobody got to.**

- **A blind reading of a finished spec is not a blind reading.** These scenarios are written, reviewed and shipped. The second reading's whole value is that it happens beside the first without seeing it; run against a spec that already exists, it can only be a derived reading wearing the new shape, and its `## Raised` would come back empty — which is the signal this document names as the mechanism having failed
- **The suites are written when a change touches the capability.** `/workflow-specify` runs the blind pass on the anchor set `/workflow-plan` just fixed, as it stands at that moment, with a PM available for what it raises. Filling them ahead of time means doing every future change's QA now, with less information than that change will have
- **`pnpm check:manual`'s `derived` finding is the register.** It names every capability with anchors and no suite, recomputed on every run, so it cannot go stale the way a checklist in a document would. There is no second list to keep
- **No rules revision was bumped for this.** The cases these files hold did not change; what changed is what a *new* run must record about itself. A revision would have required sweeping thirty suites to say so, which is the work this section exists to decline

The anchors are gated accordingly: a suite is held to the new shape when it carries a `## Reconciliation`, and left alone when it does not. The raised list is gated on its own file — a change with a `decisions.md` owes the table there, and the suites written before that artifact existed are left alone.

## Rules Revisions

`tcs_rules_rev` is one integer, bumped by hand when the contract changes: a property, a vocabulary value, an id form, a file name, a level, or a rule about what a case may claim. Run the store against the new rules; a valid file now rejected is a bump, a typo is not. How a case *reads* is not a revision: it lives in `docs/governance/tcs-conventions.md` and moves without one. A stamp written before the revision was one integer (`r3.0`) reads as its first number.

| Case | The sweep does |
| --- | --- |
| `draft` below the revision | regenerated, whole file, after one yes for the set: top down — platform, product, domain, then feature — and line 1 to the end within a file; never merely restyled |
| `actual`, `manual` | restyled to the new rule at its next review, on the reviewer's yes — ids, `<v>`, status and claim unchanged |
| `actual`, `automated` | left as it is; a rule it breaks is a behaviour change, `<v>` bumped back to `draft`, or nothing |
| `deprecated` | never touched |

- **The stamp moves only on a regenerate** — `**Drafts styled:**` takes the new revision when the drafts were regenerated under it, never for a restyle and never restamped
- **An `actual` case is skipped by the regenerate** — unless the new rule changes what it verifies or the journey it walks; then the sweep shows it and asks, and on a yes it goes back to `draft` and is regenerated and reviewed again
- **Inside one journey a sweep may restructure** — merge two cases that now serve one purpose, add a step a case needs to serve it, retire a case whose purpose another holds (`deprecated`, never deleted or renumbered)
- **Across journeys it may not** — a rule that implies merging, splitting or removing a journey is a finding for the spec's author, landed on the capability's PRD as a ❓ or in the next change's `decisions.md`; the sweep leaves the journeys as they are
- **A reviewed claim does not move silently** — `pnpm run tcs:validate --capture-baseline=<file>` before and `--swept=<file>` after prove every `actual` and `deprecated` case kept its id, trace and status
- **The sweep lands in its own commits** — separate from any review verdict, pushed before review starts, so the review's diff holds only the reviewer's decisions
- **A bump does not sweep** — the bump is its own commit and touches no suite. A suite below it is regenerated when `/tcs-review` next prepares it, or when someone runs `/spec-to-tcs` on it from `pnpm run tcs:stale`; a bulk sweep is a separate run somebody chooses, never part of the bump
- **What each revision changed** — r4: the revision became one integer and how a case reads moved to `tcs-conventions.md`; a sweep regenerates drafts; the `reopened` status and the lapsed `**Reviewed:**` line; **Executable without asking**, **A result may sharpen, never move**, **A value is the rule, or stands for it** and **Rows may add what the rule implies**

## Step 1: Digest the Capability

- **Read the isolated input** — on a feature run this is the whole of what a reader may see: `## Purpose` and `## Feature set` from `spec.md` but **never its requirements**, `user-journeys.md`, `ui-design.md` where the change has one, and the change's `proposal.md`, whose acceptance signal makes a case's type `acceptance`. Domain, product and platform runs already read journeys rather than scenarios and are unchanged
- **Read the PRD** — `docs/prds/products/<product>/<domain>/index.md` and the capability's PRD: a control, state or amount the manual names is written in the manual's words
- **Read the store's context** — `openspec/config.yaml`'s `context` for the brands, products and conventions (money is minor units plus an ISO 4217 code): `<grade10 store url>`, never `<store front door URL>`
- **Read the cross-cutting specs the Purpose names** — `crawlable-pages`, `localization`, `money-amounts`, `dates-and-times`. Their facts are checked on the way past (`URL contains <lang>`), never set up as a pre-condition
- **Write missing journeys first** — to `rules.user-journeys`: from the feature set and the PRD, adding no behaviour, with permanent ids and `**As a** / **I want** / **so that**`. There is no `**Accepted by:**` list — a scenario points up at its journey through its own `**Serves:**`, and tooling joins on that; `pnpm run validate:changes <change>`
- **Confirm the ids** — `### <capability>-US-<n>: …`; older files get an ids-only upgrade

## Step 2: Journeys Become Sections

- **One `##` per journey** — `## <capability>-US<n>: <title copied unchanged>`, in the journeys file's order, carrying the same three-line statement; the actor resolves to `customer` or `admin`
- **Nothing else** — no `**Covers:**` list, no description, summary or count
- **`---` between journeys** — on its own line

## Step 3: Write the Case

| Component | Rule |
| --- | --- |
| Id | `<capability>-US<n>-TC<m>-<v>` |
| Title | a clean descriptive title naming the behaviour or condition; its wording is **How a Case Reads** |
| Classification | `**Classification:**`, a blank line, then the ten properties as `*` bullets in Step 5 order, directly under the title |
| Pre-conditions | `**Pre-conditions:**`, the condition on the line below: one sentence, or short bullets when several are independent; `None.` when nothing is needed |
| Test data | `**Test data:**`, a `Field \| Value` table; omitted whole when the case takes no input — no empty table, no `None` |
| Steps | `**Steps:**`, a blank line, a numbered list of atomic actions, no outcome on a step line |
| Expected results | `**Expected Results:**`, a blank line, `*` bullets of observable outcomes; name the step where a flow needs it (`Step 2 opens the card's page`) |

- **That order, a blank line between parts** — no description field
- **Positive first** — then refusals, empty and failure paths; a journey whose accepting scenarios include refusals but whose cases are all positive is unfinished. `destructive` only where the scenarios state cancel, remove, withdraw or unwind
- **Scenarios sharing a condition share a case** — unrelated behaviours stay apart; a distinct route to the same behaviour, where the spec states its outcome, is its own case with its own pre-condition
- **Clauses land** — GIVEN → pre-conditions or a test-data row; WHEN → a numbered step, after the steps that reach it; AND after WHEN → the next step; THEN and its ANDs → expected results, in the spec's substance
- **Every case stands alone** — never leans on another case having run, never cites another case or scenario for its setup; repeating a setup is cheaper than a suite that passes only in order
- **Mechanism is yours, coverage is the spec's** — how the tester reaches the condition, where they look and what they click is the writer's to choose, and a review fills it in from the spec's flow, its `ui-design.md` and the PRD; what must then be true is only what the traced scenarios state. A failure mode the spec says nothing about is a gap, reported, not a case
- **Executable without asking** — a tester who has never seen the product runs the case to its end without a question: every step names where (a page or its placeholder), which control, and what goes in; a state a tester reaches by hand says how, in the pre-conditions or by naming a recipe under `tcs-conventions.md`'s `## Setup Recipes`. A state only mock data, a mocked response or a manipulated environment produces states the condition alone, and its case plans `automation` in **Testability**; `pnpm run tcs:validate` warns on one that does not
- **A result may sharpen, never move** — an expected result may be rewritten into what a tester sees (`Listing is saved` → `The listing shows in the Drafts tab, marked Draft`) and take a label the spec, `ui-design.md` or the PRD gives; it never gains an assertion, loses one, or changes an outcome. That is a behaviour change: `<v>` bumped, back to `draft`
- **No invented label** — a control's text appears in a case only where the spec, its `ui-design.md` or the PRD gives it

### Pre-conditions

The concrete setup that produces the scenario's GIVEN, in the environment's terms: a manipulated condition, a stubbed upstream, seeded data, or where the actor already is. How it is worded is **How a Case Reads**.

- **Independent** — never an outcome another case produces
- **`## Background`** — optional, before the first journey, holding only the conditions and data every case shares

### Placeholders

- **For the built, deployed site** — no hedging about whether a page exists; a value the spec leaves open is an angle-bracket placeholder
- **`<lang>`** — the locale prefix in force: nothing for the default, `/tc`, `/sc`
- **Anywhere in the case** — pre-conditions, steps and results alike

## Step 4: Test Data

- **Every value is stated** — the tester never chooses one; a `Field | Value` table when there is more than one, and the steps refer to it; no input, no section
- **A value is the rule, or stands for it** — a value that *is* the rule (a constant, a threshold, a boundary, a fixed price, the value at the limit) is the scenario's and never changes. A value that *illustrates* the rule (an example, an `e.g.`, an operand of a stated formula) or only *sets the case up* (which account, which listing, a time inside a window) may change within its equivalence class, its outcome derived from the rule: `1 + 1 = 2` may become `3 + 4 = 7`. Unsure which: it is the rule
- **Rows may add what the rule implies** — a new row is another value of a class a rule states: another member of a partition, one either side of a stated boundary, a locale or a role the spec names; each row's outcome traces to a stated rule. A value whose outcome no rule states is not a row: it is a gap for the spec's author, or an `exploratory` case a reviewer adds by hand
- **Runs per row** — same steps, different data: one case, a column per varying value and one for the outcome, and under the title `Runs once per row of **Test data**.` Two refusals with one set of steps is one case
- **Name the data, then use the name** — a value a run could change gets a `<placeholder>` row and is named from pre-conditions, steps and results; a derived value states its derivation: `Highest bid reads <user B maximum> plus <increment>`, not `530000` — so a changed value never rewrites a result
- **A name means one thing in the file** — `<listing_1>` the draft with an empty gallery, `<listing_6>` the live one led by user A, numbered by first appearance; the same state shares the name and repeats its row
- **A row defines the state** — `<listing_6> | A live listing led by user A, current bid <leader price>`, so independence is checkable
- **The spec's markers become concrete assumptions** — derived from the rule, never against it: `<bid time>` is `5 minutes before the recorded close, inside <extension window>`
- **Roles are not data** — `customer(gold member)`, `admin(shop staff)` in the pre-conditions; no row

## A Case That Already Exists Is Not Written Twice

Read the suite before adding a case, by agent or by hand: a duplicate is a defect.

- **A duplicate is identical claims** — the same outcomes on the same surface from the same starting state, however phrased; or one case's results a subset of the other's by the same route; or same steps with different data, which is one case with rows
- **Distinct** — a different route where the spec states each outcome; the same assertion at another layer the spec states; a refusal beside the acceptance it mirrors
- **When one is found** — show the existing case beside the proposed one and ask: update the existing case (a step, a row, a result, under its status's re-wording rules, no new id), add anyway (record what distinguishes it), or drop it (say which case covers it). Never add silently; never delete the older case — it is `deprecated` only when the spec no longer states the behaviour
- **Across levels** — a feature case wholly covered by an `approved` domain case is a trim candidate; never trim against a domain file still holding drafts

## Step 5: Classify the Case

Ten properties, in this order, on every case. Where a value usually starts is **How a Case Reads**; it is never a substitute for reading the case.

### Values

| Property | Value | Means |
| --- | --- | --- |
| Severity | `blocker` | the journey cannot start or continue |
| | `critical` | money, permission or the public record is wrong |
| | `major` | the main outcome is wrong, nothing irreversible, no rule bypassed |
| | `normal` | a supporting behaviour is wrong while the journey completes |
| | `minor` | convenience or presentation, data correct underneath |
| | `trivial` | cosmetic |
| Priority | `high` | every pass, including a smoke pass before a release |
| | `medium` | a full pass of this capability |
| | `low` | when there is time, or when this area changed |
| Status | `draft` | generated or edited since its last review; not exported |
| | `actual` | a reviewer stands behind it against its scenarios; exports |
| | `deprecated` | the spec no longer states it; kept, never exported, never renumbered |
| Behaviour | `positive` | the intended thing, and it works |
| | `negative` | invalid input, a wrong state or a missing permission; refused, stored facts unchanged |
| | `destructive` | the actor removes, withdraws or cancels, and the product unwinds cleanly |
| Type | `functional` | a behaviour the requirement states; the default |
| | `acceptance` | traces to the proposal's acceptance signal; only with a proposal |
| | `usability` | what renders and how it responds to a person |
| | `security` | permission, ownership or disclosure |
| | `performance` | a timing or volume statement the spec makes |
| | `compatibility` | browsers, devices or locales the spec names |
| | `integration` | the seam with another service the spec names |
| | `exploratory` | added by a reviewer by hand; never generated |
| Suites | `smoke` | its failure makes the journey unusable; at most one per journey |
| | `regression` | re-run on every change to the capability or domain |
| | `exploratory` | a time-boxed roam a reviewer added; never generated; carries a `Type` too |
| | `release` | the pass before a release |
| | `none` | belongs to no named run |
| Layer | `e2e` | through the interface the actor uses |
| | `api` | against the contract beneath — a response or a stored fact |
| | `unit` | a pure rule with no I/O |
| Automation status | `manual` | no automated test runs it yet |
| | `automated` | an automated test covers it in CI |
| Testability | `automation` | deterministic; a script asserts it exactly |
| | `manual` | a judgment a script cannot reliably make |
| | `automation, manual` | both |
| Trace | `<capability>-US-<n>` | the journey, canonical form; composed levels list every journey walked, comma-separated, in the order reached |

- **Severity** — a refusal that protects money or permission is `critical` even when nothing happens
- **Priority** — the schedule, where severity is the failure: a `trivial` bug on the first screen can be `high`
- **Status** — generation writes `draft`; only `/tcs-review`, with a human's yes, writes `actual`
- **Behaviour at a limit** — the accepted edge is `positive`, the refused one `negative`
- **A broken input is `negative`** — an empty payload, a blocked asset, a `500`, a dropped connection, even when the product carries on
- **Type is exactly one** — the kind of verification; which runs it joins is `Suites`, zero or more comma-separated, written `**Suites:** none` rather than omitted
- **Automation status** — generation writes `manual`; engineering flips it when the test lands, with `pnpm run tcs:automated <case…> --decided-by <path>` in this store or `pnpm plan automated` from `grade10`, both editing the line in place, and the flag writing the Decided-by line in the same edit, so the flip rides the commit that landed the test; `automation` testability still `manual` is the backlog. It decides whether wording may move: a `manual` case may be re-worded in review, an `automated` case is frozen and changes only with its behaviour, as a `<v>` bump back to `draft`. `automation` testability plans QA's suite; it satisfies neither `ui-component-testing.md` nor a `tasks.md` checkbox
- **Trace** — one journey per feature case; a case that would trace two is two cases or a journey not yet written, and a case with no trace does not belong in the file. Every id is defined by a `user-journeys.md` in scope; `<requirement> / <journey title>` only where a spec has no ids
- **Scenario coverage is checked, not recorded** — generation verifies every scenario accepting a journey has a case and reports the rest as gaps

## The File Header

At most three lines under the title — `**Status:**`, `**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>`, `**Reviewed:** <YYYY-MM-DD>, tcs-rules r<n>[, lapsed <YYYY-MM-DD>]` — every one computed, never chosen.

| Cases in the file | `**Status:**` |
| --- | --- |
| every case `draft`, or none yet | `pending-review` |
| an `actual` or `deprecated`, and a `draft` left | `in-review` |
| a `draft` in a file that was `approved` — its `**Reviewed:**` lapsed | `reopened` |
| no `draft` left | `approved` |

- **Derived, never claimed** — `/spec-to-tcs` and `/tcs-review` recompute it after every write; `pnpm run tcs:validate` fails a header that disagrees with its cases. `in-review` reserves nothing, and a new `draft` drops `approved` to `reopened` on its own
- **Only `approved` exports** — and only its `actual` cases, only when someone runs an export
- **`**Drafts styled:**`** — the revision of this document the file's `draft` cases were last written against, and when; present exactly while the file holds a `draft`. `actual` cases carry no revision: a reviewer's yes is the convention
- **`**Reviewed:**`** — the date the file reached `approved` and the revision, written by `/tcs-review` on that transition; no reviewer name, git records who. When the file falls out of `approved` the line stays and gains `, lapsed <YYYY-MM-DD>`, written by whichever run added the draft, so the file reads `reopened` — a quick re-review of what is new, not a first review — and a new approval writes the line fresh
- **`reopened` sorts first** — `/tcs-review` lists `reopened` suites ahead of `in-review` and `pending-review` ones, with the drafts added since the lapse
- **`**Out of suite:**`** — scenario ids the suite leaves uncovered on purpose, under the header (`openspec/config.yaml`, `rules.user-journeys`); `pnpm check:manual` counts them as covered and refuses one a living case traces
- **`tcs_rules_rev`** — this document's frontmatter, one integer, bumped by hand

## The Format

````markdown
# <product>/<domain>/<capability> Test Cases

**Status:** pending-review
**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>

## <capability>-US<n>: <journey title, copied from the spec heading>

**As a** <role>,
**I want** <goal>,
**so that** <reason>.

### <capability>-US<n>-TC<m>-<v>: <clean descriptive title>

**Classification:**

* **Severity:** blocker | critical | major | normal | minor | trivial
* **Priority:** high | medium | low
* **Status:** draft
* **Behaviour:** positive | negative | destructive
* **Type:** functional | acceptance | usability | security | performance | compatibility | integration
* **Suites:** smoke | regression | release | exploratory | none
* **Layer:** e2e | api | unit
* **Automation status:** manual
* **Testability:** automation | manual | automation, manual
* **Trace:** <capability>-US-<n>

**Pre-conditions:**

* <from GIVEN — state, not actions; one condition per bullet; or "None.">

**Test data:**

| Field | Value |
| --- | --- |
| <Key> | <Value> |

**Steps:**

1. <from WHEN>
2. <from the next AND>

**Expected Results:**

* <from THEN>
* <from AND following THEN>

### <capability>-US<n>-TC<m+1>-<v>: <the next case under this journey>

…

---

## <capability>-US<n+1>: <the next journey>
````

- **Fixed points** — header lines computed; journey heading and its three-line statement copied, compact id, no `**Covers:**`; `**Classification:**` directly under the title, ten `*` bullets in order, generation writing `**Status:** draft` and `**Automation status:** manual` and never `exploratory`; a per-row case carries `Runs once per row of **Test data**.` between title and block; `## Background` optional between header and first journey; `**Test data:**` the one omittable section; a blank line after every `**Label:**` and between parts; `---` between journeys; a case with no pre-conditions line or an empty Expected Results list is not finished
- **Decided by** — ``**Decided by:** `<path>`[, `<path>`]*``, the first line after the classification block and before `**Pre-conditions:**`, one or more repository-relative paths, comma-separated. It names what decides the case: a store unit or script test, or the end-to-end walk that drives it. One rule — an automated case of an in-flight change names what decides it, in its place, once; nothing else may — which `pnpm run tcs:validate` reads as three verdicts: no line is refused, a line anywhere but there or a second line is refused, and a line on a case that is not `automated` is a warning. Every path it names resolves inside the store, to a file that exists. A durable suite under `openspec/specs/` owes no line yet; the fold carries across every line the change wrote, and `pnpm run archive:preflight` refuses one that drops or changes one
- **No execution record** — no actual result, no pass/fail column; a run lives in the run sheet against a snapshot of the case
- **Copy** — `openspec/specs/grade10-site/auction/auction/feature-tcs.md`, approved under r3; its `US2-TC1-1` is a case at the right size. A case pasted here would drift; an approved case is validator-held
- **Deltas use the same format** — under `openspec/changes/<change>/specs/<product>/<domain>/<capability>/feature-tcs.md`

## The Tools

Two pull requests: the spec PR carries the drafts, one commit per level, top down; the review PR carries the verdicts. A delta that adds, edits or removes a scenario or journey runs `/spec-to-tcs` in the same PR on the update path.

| Tool | Does |
| --- | --- |
| `/spec-to-tcs [level] <target>` (`spec-to-tcs` skill) | writes missing journeys, reads the conventions, derives the level's file with every new case `draft`, restyles existing drafts; shows an existing suite and asks; regenerates the drafts of a suite below the rules revision, top down; refuses a whole-file regenerate over `actual` cases or an `approved` file |
| `/tcs-review [<target>]` (`tcs-review` skill) | finds suites awaiting review, walks drafts one journey at a time, quotes scenarios on request, records verdicts |
| `planning-qa` skill | QA's entry point: routes to the two commands and states what a suite owes |
| `pnpm run tcs:validate` | header against cases, unique journey-scoped ids, traces resolving against `spec.md` and `user-journeys.md`, property vocabularies and order, no empty Expected Results, actors of a class, composed levels tracing what they compose; the Decided-by verdicts, and every path a Decided-by line names resolving inside the store to a file that exists; reports duplicate-purpose candidates and a case needing a mocked state that plans no automation; `--strict`, `--require-suites`, `--capture-baseline=<file>`, `--swept=<file>`; CI on every push |
| `pnpm run tcs:stale` | suites whose drafts sit below the current revision, each owed a regenerate; a report, never a sweep |
| `/tcs-run-sheet <what to walk>` (`tcs-run-sheet` skill) | resolves a request to an explicit case-id list, dry-runs it, and dispatches the run tab once a person confirms |
| `pnpm run tcs:run-sheet` | writes the selection to a new tab; `--sandbox` uses `TCS_SHEET_SANDBOX_ID`; `--overwrite <id>` rewrites that run; `--env` is `staging` or `production` and defaults to staging; `--dry-run` prints the selection and touches no network |
| `pnpm run tcs:automated <case-id…> --decided-by <path>` | flips one or more cases' Automation status to `automated`, in place, in whichever suite file holds them, writing the Decided-by line in the same edit; refuses a flip of an in-flight change's case that names no path; pushes nothing — the walk's own commit carries the flip |

## The Run Sheet

A manual pass is walked in a Google Sheet, one spreadsheet, one tab per run.

- **A tab is a snapshot** — written once, pinned to the commit it was written from, never resynced. A case that later changes, or is deprecated, leaves the tab alone: the tab says what was tested and the markdown says what the case is now
- **`actual` only** — `--include-draft` takes drafts and stone-grey-bands them; a `deprecated` case never crosses
- **A run includes automated cases** unless the person asked to leave them out. `--exclude-automated` leaves them out and still says how many, named, with what decides each
- **The selection is a list** — a filter over the properties resolves to case ids, and so does a reading of the specs; the ids are what reach the sheet, so a run can be restated. The person confirms that list before a tab is written
- **Production unless they asked for the sandbox** — `--sandbox` writes to `TCS_SHEET_SANDBOX_ID`. That id is a repository variable, never in the code
- **An occupied title is a refusal** — a new run whose tab name already exists is not written and is not given a `-2` suffix. `--overwrite <id>` recreates that run's tab and rewrites its four Summary rows in place, and only after a person names the id. If Summary and the tabs disagree, the writer prints both and stops
- **The case columns are locked** — a protected range refuses an edit at the cell. `Web`, `Mobile`, `Auto web`, `Auto mobile` and `Notes` are the tester's; the case to their left and the classification to their right are not. A wrong case is fixed in `openspec/`
- **A capability is a row, then a journey** — the file path (`shared/auth/sign-in`) above the journeys in that file, each journey above its cases, each with a collapsible group. Sorting happens inside the tab's filter view, which leaves the rows where they are
- **Four surfaces, one vocabulary** — `to_do`, `pass`, `fail`, `blocked`, `skipped`, `n/a`. Every cell starts at `to_do` so the Summary counts down, except an automation column on a case whose **Automation status** is `manual`, which starts at `n/a`. `n/a` is a surface that cannot answer; `skipped` is an answer somebody chose not to take, and only `n/a` is left out of the pass rate
- **The Summary tab is the register** — four rows per run, one per surface, grouped under the first. Identity, env and the commit sit once, on that first row, with the SHA at the far right. No filter view: a register is read, not sorted
- **Nothing returns** — no result reaches the store, and no suite carries one
- **CI holds the credentials** — the `Run sheet` workflow mints a short-lived token from the repository's own OIDC identity; no service-account key exists
- **The layout is code** — `scripts/openspec/lib/run-sheet-layout.mjs`, not a template tab inside the spreadsheet
- **Renaming or deleting a tab cannot be prevented** — Sheets protects cells, not tabs. The Summary row then reads `tab missing`, and its provenance survives

❓ Open: recording a tab somebody deleted.

## See Also

- [`prd-and-openspec.md`](prd-and-openspec.md) — why `spec.md` is the sole source of truth
- [`tcs-conventions.md`](tcs-conventions.md) — how a case reads: the house style, setup recipes, and what reviews have taught
- [`ui-component-testing.md`](ui-component-testing.md) — the automated coverage obligation for UI components
- `openspec/config.yaml` — Feature set, user-journeys and id rules this derivation assumes
