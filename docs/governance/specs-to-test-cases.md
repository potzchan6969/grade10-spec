---
tcs_rules_rev: 3.0
---

# Specs to Test Cases

A suite — `feature-tcs.md`, `domain-tcs.md`, `product-tcs.md`, `platform-tcs.md` — is written from the anchors a capability declares, never from the scenarios beside it and never as a second source of truth. Case shape follows [Virtuoso QA's guide](https://www.virtuosoqa.com/post/test-cases); property vocabularies are Qase's, so a suite exports without translation.

A **feature** suite is written **blind**: by a reader who cannot see the spec's `## Requirements` at all. A suite derived from the scenarios can only find inconsistency inside them, never the behaviour they left out — and finding that is what the second reading is for. The scenarios are drafted from the same anchors in parallel, and the two are reconciled once both land.

## The Rule

- **The spec is correct** — once the scenarios exist and the two readings are reconciled, a suite that disagrees with the spec is regenerated. Before reconciliation there is nothing to disagree with: the suite is the only reading there is, and it is provisional. A proposal never links a suite in place of a spec delta
- **Anchors are given** — every section is one `user-journeys.md` journey. A capability nobody walks carries one section instead, `## <capability>-US1`, and names its feature set groups on the cases' `**Trace:**` lines — a section per group would number a case by that group's position, and an issued case id is permanent. There is no cap on the number of journeys. A suite never invents a flow, and splitting or merging journeys is an edit to the journeys file
- **A case comes from an anchor** — never from a scenario, which on a feature run does not exist yet. A case that carries behaviour no anchor implies is a product decision in disguise, and reconciliation is where it is settled
- **A hole is reported** — an anchor no case covers, a case tracing an anchor nothing defines: report it, never close it by inventing a case or a journey
- **Properties are QA's** — they classify scenarios the spec states. A wrong property is fixed in review and is never grounds to change a step or an expected result

## The Isolated Input

A feature run reads a bundle the caller assembles, and nothing outside it.

- **Included** — `## Purpose` and `## Feature set` from the capability's `spec.md`, its `user-journeys.md`, the change's `proposal.md`, its `ui-design.md` where one exists — written before the requirements, with its states tied to anchors rather than scenario ids, so it carries no leak — the linked pages under `docs/prds/`, `openspec/config.yaml`'s `context`, the existing `feature-tcs.md` for id continuity with its `## Reconciliation` stripped, and that suite's `## Settled` — the questions earlier runs asked and had answered, which is what keeps a refused reading from being raised again every time
- **Excluded** — every `## Requirements` section, `openspec/specs/` beyond the two included sections, and `openspec/changes/archive/` entirely. An archived change keeps an un-stripped `## Reconciliation` naming scenario ids, so reading archive reopens the leak invisibly on the next change to that capability
- **Recorded** — the `## Reconciliation` Run line names the bundle: what the pass read, and what it was denied. Nothing in this store computes or verifies a digest of it, so the line is the run's own statement, not proof; a hash written there says only that somebody wrote a hash
- **Assembled by hand where no caller built one** — a person running the skill directly assembles it and says so in the report. Reading the requirements "just to check" is how the property is lost, and nothing downstream can detect that it was
- **An empty `## Raised`, run after run, is the failure signal** — and the only one this store can actually read. The Run line says what the reader saw, never how it read. A second reading that asks nothing, several runs running, has either stopped being blind or stopped being a different method, and the suite is not passed on that basis until someone has checked why
- **Different methods, not the same one twice** — the blind reader works a test-design checklist: boundary values, equivalence partitions, state transitions, CRUD completeness, empty / one / many, null and missing, permission matrix, error taxonomy, SEO and indexability. Two readings that use the same method produce synonyms, and the reconciliation then finds nothing

## Raised

The blind reading ends with a `## Raised` section: every point the input did not settle, as a question for the author. Not cases, not defects — the things the reader had to decide for itself in order to write anything at all.

- **What belongs** — a rule the input is silent on. "Is a scheduled lot open to bid on? The spec names not-yet-published, ended and called off as failures and never places scheduled on either side." That is a question the material cannot answer, and it is how a state nobody had thought about gets found
- **What does not** — anything the input settles and the reader missed; anything for the technical design rather than the behaviour; anything the reader merely wants to know more about
- **It is owed by any suite that carries a `## Reconciliation`** — that section is what says a blind reading happened, so it is what makes the raised list due. A reconciliation with no raised list fails: the reading ran and what it could not settle was thrown away. A suite with an empty raised list is a claim, made on the record, that the input settled everything
- **It survives the run** — QA's review is largely a check on what was done with these, and a reviewer cannot check a list that was deleted once it was processed

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
- **Out of suite names its verifier** — a consuming repository's build and type check, a database constraint, a design review, a higher-level suite. A scenario that can name no such place is a hole, not an exemption
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

On a hit the change carries an edit to that suite or one proposal line — `No domain impact: <why>`, `No platform impact: <why>` — and `/spec-push` refuses without one. `## Impact` is not the signal: it records code, not paths.

## Who the Actor Is

| Class | Who |
| --- | --- |
| `customer` | anyone outside the business — the person the product is sold to |
| `admin` | anyone inside it — the people who run the shop |

- **Every role is a class holding a state or a grant** — collector, bidder, shop staff, treasurer: the state is a pre-condition, not the actor
- **Class, qualifier, place** — `customer(gold member) is on the shopping cart page.`, `admin(holds auction:operate) is on <grade10 auction admin listings url>.` The qualifier carries what the rule under test needs and nothing more; a bare `customer` is right where state does not matter; two of a class are `customer A` and `customer B`
- **A product serves both classes** — `openspec/config.yaml` places a capability by who is held to it, not whose screen shows it
- **Any other actor is not a journey** — engineers, QA, reviewers and consuming applications are not end users: software this store ships is the system's side of a journey, and the people who build the product walk a test. An outside agent that acts on its own is a role — a crawler, a preview fetcher, a provider calling back — and its cases still name the class whose surface the rule is checked on. A capability nobody reaches writes `**Walked by:** nobody on their own — <who inherits it>`; `pnpm run tcs:validate` fails a journey whose actor resolves to none of the three

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

- **Automatic** — once `/planning-pm` has the proposal, the journeys and the outline through `pnpm run validate:changes <change>`, `/planning-qa` runs `/spec-to-tcs <change>` on that same branch: every case `draft`, as its own `test(<domain>): derive test cases for <capability>` commit, ahead of the scenarios. A draft carries no authority, so the spec's reviewer approves nothing by it; review is a later pull request
- **`/spec-push` refuses** — a change whose capability has `user-journeys.md` and no `feature-tcs.md`; it runs `pnpm run tcs:validate` with the other checks
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
| Regenerate | rewrites the whole file; destroys review history; explicit confirmation, and only when the guard allows |

- **Regeneration guard** — refused when the file is `approved` or any case is `actual`. A reviewer who wants a clean rewrite moves those cases back to `draft` by hand first; an agent never does
- **A delta that moves the ground under an `actual` case** — resolved in the same change, or `/spec-push` refuses: changed what the case verifies → `<v>` bumped, `**Status:** draft`, rewritten, reviewed again; removed the behaviour → `**Status:** deprecated`; did not touch what the case asserts → left `actual`, and the run says so. Marking is never deferred: the case goes back to `draft` at once, and only the review waits

## What the approved suites teach the next one

- **The corpus** — every `actual` case under `openspec/specs/` and `openspec/changes/`, never `archive/`, weighted capability first, then product, then store
- **A convention** — a pattern across three or more approved cases, or two in the capability at hand; below that the defaults here stand, and a corpus under three cases teaches nothing, which the run says
- **Only the current major teaches** — `**Reviewed:**` records the revision; the corpus is filtered on `tcs_rules_rev`'s major, so a minor behind still teaches. A bare-dated file teaches nothing until reviewed again
- **It refines how, never what** — it cannot add coverage, loosen "mechanism is yours, coverage is the spec's", licence an invented label, or overrule this document; a contradicting approved case is reported and the written rule followed. A convention becomes permanent only by amending this document
- **Drafts follow it** — every `draft` in the resolved suite is re-worded to the convention, id kept, `<v>` unchanged, status `draft`; coverage never moves. `actual` and `deprecated` cases are never restyled
- **The reviewer's lever** — edit a case during `/tcs-review`, approve it, and it is evidence from then on

## The Review Lane

| | |
| --- | --- |
| Branch | `tcs-review/<level>-<target>`, off `main`, before the first verdict; a second reviewer on the same suite appends `-US<n>-<m>` |
| Commits | `test(<domain>): approve <target> US<n> test cases`, one per journey |
| PR title | `test(<domain>): approve <target> US<n>–<m> test cases` — the journeys the branch carries |
| PR label | `documentation` |
| Merges | at journey boundaries; a stopped review still opens a draft PR for what has verdicts |

- **One journey at a time** — its three-line statement, then every `draft` case in full, with `actual` and `deprecated` cases listed by id; scenarios offered, and quoted in full on request
- **Only a human approves** — verdicts approve, change, defer or retire, in the reviewer's words; ids are echoed back and only what was named is marked. Approve → `actual`, defer → `draft`, retire → `deprecated`; the file status follows on its own
- **Questions are answered from the spec** — quoting the clause, never from an assumption about the product
- **Restyle first** — drafts to the current revision before review; offered for an `actual` case still `manual`; an `automated` case left as it is
- **Finding suites** — any file holding a `draft`: none → say so and name where suites live; one → review it; more → list with pending counts and ask
- **Top down** — platform, product, domain, then feature; when a domain's last feature suite is approved, offer its `domain-tcs.md`, then `platform-tcs.md`
- **Two reviewers is allowed** — open PRs on the file are reported as information; the file is re-read from disk before each verdict is written
- **Push at the end of a session** — `/tcs-review` offers to commit and push what has a verdict

## The Suites This Store Does Not Yet Have

Thirty capabilities carry a suite and thirty-nine do not; seventeen of those thirty-nine are ones nobody walks, which used to be exempt and no longer are. That is eight hundred scenarios with no cases beside them, and the thirty that do have cases were derived from the scenarios rather than read independently.

**None of it is being filled in one pass, and that is a decision rather than a backlog nobody got to.**

- **A blind reading of a finished spec is not a blind reading.** These scenarios are written, reviewed and shipped. The second reading's whole value is that it happens beside the first without seeing it; run against a spec that already exists, it can only be a derived reading wearing the new shape, and its `## Raised` would come back empty — which is the signal this document names as the mechanism having failed
- **The suites are written when a change touches the capability.** `/planning-qa` runs the blind pass on the anchor set `/planning-pm` just fixed, as it stands at that moment, with a PM available for what it raises. Filling them ahead of time means doing every future change's QA now, with less information than that change will have
- **`pnpm check:manual`'s `derived` finding is the register.** It names every capability with anchors and no suite, recomputed on every run, so it cannot go stale the way a checklist in a document would. There is no second list to keep
- **No rules revision was bumped for this.** The cases these files hold did not change; what changed is what a *new* run must record about itself. A major revision would have required sweeping thirty suites to say so, which is the work this section exists to decline

`## Raised` and the anchors are gated accordingly: a suite is held to the new shape when it carries a `## Reconciliation`, and left alone when it does not.

## Rules Revisions

`tcs_rules_rev` is `<major>.<minor>`. Run the store against the new rules: a valid file now rejected is a **major**, nothing broken is a **minor**, a typo is neither.

| | Minor | Major |
| --- | --- | --- |
| What changed | how a case reads | the contract: a property, a vocabulary value, an id form, a file name, a level |
| Existing suites | valid, in an older voice | non-conformant until they move |
| How it reaches them | restyle, one capability at a time: `pnpm run tcs:stale`, then `/spec-to-tcs <capability>`, one PR each | sweep, every suite, in the bump's own commit |

- **A minor restyle** — drafts re-worded, ids kept, `<v>` unchanged, status `draft`; only `**Drafts styled:**` moves; `actual` and `deprecated` never
- **A sweep rewrites, never restamps** — if the drafts are not rewritten, the revision does not move
- **A sweep changes no claim** — same ids, same traces, no `<v>` bump; `pnpm run tcs:validate --capture-baseline=<file>` before and `--swept=<file>` after prove it
- **A major may only require what is mechanically derivable on an approved case** — anything more is a re-review programme, scoped or budgeted, and the bump states which outcome it takes
- **An approved case is never migrated silently** — the sweep reports what it derives, on how many cases, in which files, and waits for a yes

| The new rule | The sweep does |
| --- | --- |
| derivable from what the case carries | migrates it, `actual` included |
| not derivable, old shape still readable | grandfathers it: shape kept, `**Reviewed:**` revision says why, it stops teaching |
| not derivable, not readable | that suite goes back to `draft`, one at a time, a human deciding each |

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
| Title | five to twelve words, sentence case, naming the behaviour or condition: `Core navigation is accessible before scripts run`. Not opened with the actor unless the actor is the point; never the journey title; never a trailing `(Negative)` |
| Classification | `**Classification:**`, a blank line, then the ten properties as `*` bullets in Step 5 order, directly under the title |
| Pre-conditions | `**Pre-conditions:**`, the condition on the line below: one sentence, or short bullets when several are independent; `None.` when nothing is needed |
| Test data | `**Test data:**`, a `Field \| Value` table; omitted whole when the case takes no input — no empty table, no `None` |
| Steps | `**Steps:**`, a blank line, a numbered list of atomic actions, no outcome on a step line |
| Expected results | `**Expected Results:**`, a blank line, `*` bullets of observable outcomes; name the step where a flow needs it (`Step 2 opens the card's page`) |

- **That order, a blank line between parts** — no description field
- **Positive first** — then refusals, empty and failure paths; a journey whose accepting scenarios include refusals but whose cases are all positive is unfinished. `destructive` only where the scenarios state cancel, remove, withdraw or unwind
- **A case is a run, not a transcribed scenario** — one to four steps, one to three results; a one-step case restating a WHEN left out the arrival and the observation
- **Scenarios sharing a condition share a case** — unrelated behaviours stay apart; a distinct route to the same behaviour, where the spec states its outcome, is its own case with its own pre-condition
- **Clauses land** — GIVEN → pre-conditions or a test-data row; WHEN → a numbered step, after the steps that reach it; AND after WHEN → the next step; THEN and its ANDs → expected results, in the spec's substance
- **One action per step** — "sign in, open settings, change the password" is three; a continuous flow with one outcome stays one case
- **Every case stands alone** — never leans on another case having run, never cites another case or scenario for its setup; repeating a setup is cheaper than a suite that passes only in order
- **Mechanism is yours, coverage is the spec's** — how the tester reaches the condition, where they look and what they click is invented freely; what must then be true is only what the traced scenarios state. A failure mode the spec says nothing about is a gap, reported, not a case
- **The arrival may be the first result** — `The listing loads` tells "could not get there" from "wrong"; a case whose results are only the arrival is not a case
- **Plain words, no internal names** — `Click the collection tile`, not `dispatch the tile's click handler`

### Pre-conditions

The concrete setup that produces the scenario's GIVEN, in the environment's terms, one condition per bullet: a manipulated condition (`Network conditions are manipulated to block static styling assets (CSS)`), a stubbed upstream (`The catalogue endpoint is mocked to return a 500`), seeded data (`At least one collection is missing its artwork`), or where the actor already is.

- **State, not actions** — `The admin is on <admin listings url>` is state; `Open the media manager` is a step
- **Specific** — `A user is signed in with <card> saved and is on <listing_4>`, qualified by what the rule needs
- **Domain words, not plumbing** — never an endpoint name, a table or a provider's product
- **Independent** — never an outcome another case produces
- **Reusable** — the same condition in the same words everywhere it appears
- **Never that the feature exists** — only what state it is in
- **`## Background`** — optional, before the first journey, holding only the conditions and data every case shares

### Steps and Expected Results

- **Arrive once** — the first step (`Navigate to <grade10 store url>`) or a pre-condition placing the actor; one or the other, never neither
- **Then look, then act** — `Scroll to the collections section`, `Click the incomplete collection tile`, `Wait for the catalogue request to fail`
- **Results are checkable by looking** — the thing that worked and, where the spec states it, what survived beside it (`Both buttons still work`); none is a step in disguise
- **The UI event, not the spec's UX term** — activate → the click; navigate or render → the browser event; unscoped → `The listing URL names no collection`. Never `affordance`, `unscoped`, `narrowing`, `way on` in a case, even when the spec says them; never an invented label (`"Shop now"`) unless the spec gives it, and `e.g.` only where the spec gives the example
- **Few words** — ten per bullet, a step a short imperative; cut `successfully`, `as expected`, `the application`, `the user is able to`; one idea per bullet. Short is not vague: `Hero is missing` is vague, `Hero collapses, page layout intact` is short and checkable
- **Before** — step `1. The user is able to open the store front door successfully.`, result `The front door renders successfully, with the marketing hero visible immediately, and both buttons work.`
- **After** — steps `1. Navigate to <grade10 store url>.` `2. Click the shop button in the hero.` `3. Click the auction button in the hero.`, results `Front door renders, hero visible.` `Both buttons open their destinations without JavaScript.`

### Placeholders

- **For the built, deployed site** — no hedging about whether a page exists; a value the spec leaves open is an angle-bracket placeholder
- **Self-describing, in the store's words** — `<grade10 browse listing url>`, `<a collection with no artwork>`; never `<url1>`, `<TBD>`, or a bare `<store url>` where the store runs more than one brand
- **`<lang>`** — the locale prefix in force: nothing for the default, `/tc`, `/sc`
- **For the value, not the thing** — where the spec names a control, name what the tester clicks
- **Consistent within a suite** — one surface, one placeholder
- **Anywhere in the case** — pre-conditions, steps and results alike
- **Never wrapped, never capitalised** — rewrite the sentence instead

## Step 4: Test Data

- **Every value is stated** — the tester never chooses one; a `Field | Value` table when there is more than one, and the steps refer to it
- **Every value comes from a scenario** — the table never generates variations the spec did not state; no input, no section
- **Runs per row** — same steps, different data: one case, a column per varying value and one for the outcome, and under the title `Runs once per row of **Test data**.` Two refusals with one set of steps is one case
- **Readable units, the requirement's unit** — `100 mebibytes`, `30 minutes`; never a rounded megabyte that moves the bound
- **Name the data, then use the name** — a value a run could change gets a `<placeholder>` row and is named from pre-conditions, steps and results; a derived value states its derivation: `Highest bid reads <user B maximum> plus <increment>`, not `530000`
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

Ten properties, in this order, on every case. Starting shapes, not substitutes for reading the case: a core positive path `critical` / `high`; a degradation the journey survives `major` / `medium`; an empty state `normal` / `medium`; a presentational fallback `minor` / `low`; a case run through the interface `e2e`; worth a script and a human eye `automation, manual`.

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
- **Behaviour at a limit** — the accepted edge is `positive`, the refused one `negative`; say "at the limit" in the title
- **A broken input is `negative`** — an empty payload, a blocked asset, a `500`, a dropped connection, even when the product carries on
- **Type is exactly one** — the kind of verification; which runs it joins is `Suites`, zero or more comma-separated, written `**Suites:** none` rather than omitted
- **Automation status** — generation writes `manual`; engineering flips it when the test lands, and `automation` testability still `manual` is the backlog. It decides whether wording may move: a `manual` case may be re-worded in review, an `automated` case is frozen and changes only with its behaviour, as a `<v>` bump back to `draft`. `automation` testability plans QA's suite; it satisfies neither `ui-component-testing.md` nor a `tasks.md` checkbox
- **Trace** — one journey per feature case; a case that would trace two is two cases or a journey not yet written, and a case with no trace does not belong in the file. Every id is defined by a `user-journeys.md` in scope; `<requirement> / <journey title>` only where a spec has no ids
- **Scenario coverage is checked, not recorded** — generation verifies every scenario accepting a journey has a case and reports the rest as gaps

## The File Header

At most three lines under the title — `**Status:**`, `**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>`, `**Reviewed:** <YYYY-MM-DD>, tcs-rules r<n>` — every one computed, never chosen.

| Cases in the file | `**Status:**` |
| --- | --- |
| every case `draft`, or none yet | `pending-review` |
| an `actual` or `deprecated`, and a `draft` left | `in-review` |
| no `draft` left | `approved` |

- **Derived, never claimed** — `/spec-to-tcs` and `/tcs-review` recompute it after every write; `pnpm run tcs:validate` fails a header that disagrees with its cases. `in-review` reserves nothing, and a new `draft` drops `approved` on its own
- **Only `approved` exports** — and only its `actual` cases, only when someone runs an export
- **`**Drafts styled:**`** — the revision of this document the file's `draft` cases were last written against, and when; present exactly while the file holds a `draft`. `actual` cases carry no revision: a reviewer's yes is the convention
- **`**Reviewed:**`** — the date the file reached `approved` and the revision, written by `/tcs-review` on that transition, removed when the file falls out of `approved`; no reviewer name, git records who
- **`**Out of suite:**`** — scenario ids the suite leaves uncovered on purpose, under the header (`openspec/config.yaml`, `rules.user-journeys`); `pnpm check:manual` counts them as covered and refuses one a living case traces
- **`tcs_rules_rev`** — this document's frontmatter, bumped by hand

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
- **No execution record** — no actual result, no pass/fail column; a run lives in Qase against the exported case
- **Copy** — `openspec/specs/grade10-site/auction/auction/feature-tcs.md`, the one suite approved under the current revision; its `US2-TC1-1` is a case at the right size. A case pasted here would drift; the corpus is validator-held
- **Deltas use the same format** — under `openspec/changes/<change>/specs/<product>/<domain>/<capability>/feature-tcs.md`

## The Tools

Two pull requests: the spec PR carries the drafts, one commit per level, top down; the review PR carries the verdicts. A delta that adds, edits or removes a scenario or journey runs `/spec-to-tcs` in the same PR on the update path.

| Tool | Does |
| --- | --- |
| `/spec-to-tcs [level] <target>` (`spec-to-tcs` skill) | writes missing journeys, learns the corpus, derives the level's file with every new case `draft`, restyles existing drafts; shows an existing suite and asks; refuses to regenerate over `actual` cases or an `approved` file |
| `/tcs-review [<target>]` (`tcs-review` skill) | finds suites awaiting review, walks drafts one journey at a time, quotes scenarios on request, records verdicts |
| `planning-qa` skill | QA's entry point: routes to the two commands and states what a suite owes |
| `pnpm run tcs:validate` | header against cases, unique journey-scoped ids, traces resolving against `spec.md` and `user-journeys.md`, property vocabularies and order, no empty Expected Results, actors of a class, composed levels tracing what they compose; reports duplicate-purpose candidates; `--strict`, `--require-suites`, `--capture-baseline=<file>`, `--swept=<file>`; CI on every push |
| `pnpm run tcs:stale` | suites whose drafts sit below the current minor; a report, never a sweep |

## See Also

- [`prd-and-openspec.md`](prd-and-openspec.md) — why `spec.md` is the sole source of truth
- [`ui-component-testing.md`](ui-component-testing.md) — the automated coverage obligation for UI components
- `openspec/config.yaml` — Feature set, user-journeys and id rules this derivation assumes
