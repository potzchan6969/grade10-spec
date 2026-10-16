---
tcs_rules_rev: 6
---

# Specs to Test Cases

A suite — `feature-tcs.md`, `domain-tcs.md`, `product-tcs.md`, `platform-tcs.md` — is written from the anchors a capability declares, never from the scenarios beside it and never as a second source of truth. This document owns creation, coverage, traceability, lifecycle and validation. [`tcs-conventions.md`](tcs-conventions.md) is the one shared writing-rule file: generation and review read it, and review may add confirmed writing rules to it.

A **feature** suite is written **blind**: by a fresh reader who cannot see the spec's `## Requirements` at all. A suite derived from the scenarios can only find inconsistency inside them, never the behaviour they left out. In the single planning run, QA1 writes cases from frozen anchors, Dev independently writes scenarios, and QA2 reconciles both after they land. New cases remain draft through acceptance; human QA reviews and classifies them after deployment makes the implementation available, through `/tcs-review`. Manual execution uses `/tcs-run-sheet`; a review classification is not a test result.

## The Rule

- **The spec is correct** — once the scenarios exist and the two readings are reconciled, a suite that disagrees with the spec is regenerated. Before reconciliation there is nothing to disagree with: the suite is the only reading there is, and it is provisional. A proposal never links a suite in place of a spec delta
- **Anchors are given** — every section is one `user-journeys.md` journey. A capability nobody walks carries one section instead, `## <app>.<domain>-<capability>.US<n>`, and names its feature set groups on the cases' `**Trace:**` lines — a section per group would number a case by that group's position, and an issued journey anchor is permanent. There is no cap on the number of journeys. A suite never invents a flow, and splitting or merging journeys is an edit to the journeys file
- **A case comes from an anchor** — never from a scenario, which on a feature run does not exist yet. A case that carries behaviour no anchor implies is a product decision in disguise, and reconciliation is where it is settled
- **A hole is reported** — an anchor no case covers, a case tracing an anchor nothing defines: report it, never close it by inventing a case or a journey
- **Coverage is an observable outcome** — count distinct outcomes a tester can observe, not every input value, row, actor or combination. Values that preserve the same route, checking and expected result stay rows in one case
- **Coverage before cost** — preserve required outcomes, boundaries, states, routes and risks first. Then reduce execution runs, setup, maintenance and failure diagnosis cost. Fewer case ids or more rows alone do not prove a saving
- **Group before splitting** — group assertions by starting state, route and checking. Split only when the purpose, route, expected checking or risk changes. A case earns its place by a distinct outcome, boundary, partition, transition, permission or error risk; one that names none is a row on the case it repeats, or not written. Coverage is counted in anchors and scenarios reached, never in cases
- **Partitions are representative** — choose one representative from each outcome-equivalent partition, plus both sides of a stated boundary; record the reason in the row or the reconciliation. A second member of a class, or a combination of dimensions, is earned only where it changes an outcome, a transition, a permission, a provider answer or a risk. Never a Cartesian product

## The Isolated Input

A feature run reads a bundle the caller assembles, and nothing outside it.

- **Included** — `## Purpose` and `## Feature set` from the capability's `spec.md`, its `user-journeys.md`, the change's `proposal.md`, its `decisions.md` — the goals and the non-goals, so no case is written against something the interview ruled out, and its `## Raised` table, which is what earlier runs asked and what came of it — its `ui-design.md` where one exists — written before the requirements, with its states tied to anchors rather than scenario ids, and with the dispositions the second requirements pass wrote onto those bullets stripped — the linked pages under `docs/prds/`, `openspec/config.yaml`'s `context`, the existing `feature-tcs.md` for id continuity with its `## Reconciliation` stripped, and that suite's `## Settled` — the questions earlier runs asked and had answered, which is what keeps a refused reading from being raised again every time — and the domain suite above the capability, the change's `domain-tcs.md` or else the durable one, with its `## Reconciliation` stripped: its cases are composed from journeys and name no scenario, so reading them costs no blindness, and it is how a feature run knows which paths are already walked (**Across levels**)
- **Excluded** — every `## Requirements` section, scenario text used as a source for case generation, `openspec/specs/` beyond the two included sections and the domain suite, and `openspec/changes/archive/` entirely. An archived change keeps an un-stripped `## Reconciliation` naming scenario ids, so reading archive reopens the leak invisibly on the next change to that capability
- **Recorded** — the `## Reconciliation` Run line names the bundle: what the pass read, and what it was denied. Nothing in this store computes or verifies a digest of it, so the line is the run's own statement, not proof. A person running the skill with no caller assembles the bundle by hand and says so; reading the requirements "just to check" is how the property is lost, and nothing downstream can detect it
- **An empty `## Raised`, run after run, is the failure signal** — and the only one this store can actually read. It sits in the change's `decisions.md`, and `pnpm check:manual` warns on an empty one. The Run line says what the reader saw, never how it read. A second reading that asks nothing, several runs running, has either stopped being blind or stopped being a different method, and the suite is not passed on that basis until someone has checked why
- **Different methods, not the same one twice** — the blind reader works a test-design checklist: boundary values, equivalence partitions, state transitions, CRUD completeness, empty / one / many, null and missing, permission matrix, error taxonomy, SEO and indexability. Two readings that use the same method produce synonyms, and the reconciliation then finds nothing

## Raised

The blind reading ends with its raised questions: every point the input did not settle, as a question for the author. Not cases, not defects — the things the reader had to decide for itself in order to write anything at all.

They go to the change's `decisions.md`, under `## Raised`, one row per question — `Capability | Raised | Landed` — the file the author already reads, one table for every capability in the order raised. Not to the suite, which carries no such section.

- **What belongs** — a rule the input is silent on. "Is a scheduled lot open to bid on? The spec names not-yet-published, ended and called off as failures and never places scheduled on either side." That is a question the material cannot answer, and it is how a state nobody had thought about gets found
- **What does not** — anything the input settles and the reader missed; anything for the technical design rather than the behaviour; anything the reader merely wants to know more about
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
| A scenario a domain case already walks, and the feature run left to it | A `- **Covered at domain** —` bullet naming the domain case in backticks and in full, `` `g10.auction-dmn.TC-a1` ``, in place of a feature case; `pnpm run tcs:validate` refuses an id no `domain-tcs.md` holds, or one `deprecated` |
| The two readings **state opposite things** | Stop and ask the author |

- **A contradiction is never resolved by the run** — where a case and a scenario both describe the same behaviour and disagree, one of them is wrong and nothing in the material says which. Filing it as a misreading is how the blind reading gets overruled by the reading it exists to check, so it goes to the author like any undecided behaviour
- **A finding is recorded where it was found, and folded where it belongs** — a capability's reconciliation names what its own blind pass raised, even when the rule lands in another capability's spec. The disposition line says where it went, so the two are findable from each other
- **Settled stays settled** — a rejection is copied into the durable suite's `## Settled` when the suite is published at acceptance, one line, no scenario ids. That section is a legal part of the next blind pass's isolated input: it tells the reader what has already been asked and answered, which is not the same as telling it what the scenarios say. Without it the same misreading is raised by every future run, nobody remembers why it was refused last time, and reconciliation fills with noise until someone starts rubber-stamping it
- **Blocked is not rejected** — a question nobody could answer is not a misreading, and filing it as one deletes the most valuable thing the pass produces. The case stays, a ❓ goes on the PRD, an open question goes on the proposal, and no scenario is written
- **Out of suite names its verifier** — a consuming repository's build and type check, a database constraint, a design review, a higher-level suite. A scenario that can name no such place is a hole, not an exemption
- **Covered at domain** — a scenario the feature run left to a domain case names that case, and the domain case is its verifier the way a higher-level suite is for **Out of suite**. It names a case, not a scenario, so the id survives the archive strip; if the domain case is later deprecated or rewritten, the feature suite owes the case back
- **Manual names what a person drives** — `### Manual` carries a `| Manual | Why |` table, one row per case no automated test decides, and that row is where the reason lives. The row names the part a person walks — a message typed in a thread, a tab in the run spreadsheet, a deploy. Where a test already proves some of it, the row names that test and what the case walks beyond it. An automated case names its test on the case itself, on its Decided-by line, and remains eligible for the run sheet unless explicitly excluded
- **A credited test carries the case id** — a legend above the table binds each name a row uses to a path, `` - <name> - `<path>`, in this store `` or `` in the application repository ``; a test in this store that a row credits cites the row's case id, and `pnpm run tcs:validate` refuses one that does not, and a legend path this store does not hold; a path in the application repository is checked where that repository ticks the group
- **A row waiting on a walk names it** — a row whose walk nobody has run yet reads `to be walked in <the walk>`, and the run that runs the lane rewrites the rows to what the walk reached
- **Scenario ids are temporary here** — they may appear in `## Reconciliation` only while the change is open; acceptance and `/tcs-review` strip them from the durable suite, leaving the dispositions and the reasons

## Coverage and Traceability

The suite has two different coverage relationships. They must not be collapsed into one field.

- **Formal coverage points to anchors** — a case's `**Trace:**` is its durable, required coverage. For a feature case it names one journey anchor; composed cases name every journey they intentionally cross. This relationship decides which suite owns the case and whether a case belongs in the file
- **Scenario links are post-hoc evidence** — `trace:case ... covers=...` is optional until QA2 compares the independent case and scenario readings. QA1 and `/spec-to-tcs` never read scenarios to create or shape a case. QA2 may link one case to one or more scenarios after both readings exist
- **One case may cover several scenarios** — use multiple scenario links only when the same route, starting state and checking fully assert each scenario. Separate the case when the scenarios require a different route, purpose, expected checking or risk
- **No scenario link is valid during blind generation** — a new active case may have a trace marker with `id` and `rev` only. It is anchor-covered and scenario-link-pending, not invalid; an existing marker with `covers` keeps its links. `covers=none` remains reserved for deprecated cases
- **QA2 owns scenario coverage** — QA2 identifies scenarios with no asserting case, cases whose outcomes have no scenario, and contradictions. It records links and dispositions after the blind reading; it does not feed scenario text back into generation
- **A missing scenario link is not a missing anchor** — the validator distinguishes an anchor with no case, an active case with no post-hoc scenario links, and a scenario with no asserting case. Only the first and third are coverage findings; the second is pending QA2 evidence
- **Coverage findings stay reviewable** — a validator reports the scope and severity of a gap. It does not invent a case, link a scenario by similarity, or reject an otherwise valid anchor-only draft solely because QA2 has not run

## Naming

| Kind | Human-facing form | Lives in or means | Example |
| --- | --- | --- | --- |
| Journey anchor | `<app>.<domain>-<capability>.US<n>` | `user-journeys.md`, the feature suite heading and `**Trace:**` | `g10.auction-bidder-suspension.US1` |
| Scenario id | `<app>.<domain>-<capability>.SC<n>` | `spec.md`; a scenario marker's existing id never changes | `g10.auction-bidder-suspension.SC1` |
| Feature case heading | `<app>.<domain>-<capability>.US<n>-TC<m>` | `feature-tcs.md`; the display id may change when the case moves journey | `g10.auction-bidder-suspension.US1-TC1` |
| Domain journey and case | `<app>.<domain>-dmn.US<n>` and `<app>.<domain>-dmn.US<n>-TC<m>` | `domain-tcs.md`; composed suite headings | `g10.auction-dmn.US1`, `g10.auction-dmn.US1-TC1` |
| Product journey and case | `<app>-pdt.US<n>` and `<app>-pdt.US<n>-TC<m>` | `product-tcs.md`; composed suite headings | `g10-pdt.US1`, `g10-pdt.US1-TC1` |
| Platform journey and case | `platform.US<n>` and `platform.US<n>-TC<m>` | `platform-tcs.md`; composed suite headings | `platform.US1`, `platform.US1-TC1` |

- **`<product>` remains the path owner** — a capability still lives under `openspec/specs/<product>/<domain>/<capability>/`. `<app>` is its stable display code: `grade10-site` → `g10`, `grade10-admin` → `g10adm`, future `grade10-store` → `g10str`, `zzz-site` → `zzz`, and `zzz-admin` → `zzzadm`
- **Trace marker ids are immutable** — never change the `id`, `rev` or `covers` text inside an existing `trace:case` marker. The marker id is the machine identity; the heading id is the human-facing route reference
- **Scenario marker ids are immutable** — never change the `id` inside an existing `trace:scenario` marker. New scenario headings use the current human-facing form; the CLI may allocate a separate machine marker id, and old marker ids remain valid evidence for existing case markers
- **A case heading may move** — when a case moves from `US1-TC1` to `US2-TC4`, change only the heading and its suite references. Keep the adjacent case marker unchanged. Bump `rev` only when the behaviour changes
- **No local case reference** — the full heading id is the case reference in a walk, report, manual row or higher-level suite. Do not add a second `(US<n>-TC<m>)` suffix
- **Numbers are permanent within a suite** — a new case takes the next unused `TC<m>` for its journey. A deprecated case keeps its heading history and number; the number is never reused
- **`rev` tracks behaviour, not prose** — `rev=1` is the first written version. It is bumped only when product behaviour changes what the case verifies. Walk-route optimization, restyling and purpose-preserving heading changes do not bump it

| What happened | `rev` | `Status` |
| --- | --- | --- |
| A `draft` is restyled | unchanged | stays `draft` |
| An `actual` case still `manual` is re-worded | unchanged | stays `actual` |
| An `actual` case that is `automated` is re-worded | — | not a restyle: a behaviour change, or it does not happen |
| Product behaviour changed what the case verifies | bump `rev` | back to `draft`, rewritten, reviewed again |

## Levels

| Level | File | Covers | Derives from | Owes | A case traces |
| --- | --- | --- | --- | --- | --- |
| `platform` | `openspec/specs/platform-tcs.md` | paths across products | every product's `user-journeys.md`, the pages under `docs/prds/` | nothing: a few curated smoke paths | two or more journeys, from two or more products |
| `product` | `<product>/product-tcs.md` | paths across the domains of one product | every domain's `user-journeys.md` in it, its `docs/prds/` pages | nothing: a few curated smoke paths | two or more journeys, from two or more domains of that product |
| `domain` | `<product>/<domain>/domain-tcs.md` | paths across the capabilities of one domain | every capability's `user-journeys.md` in it, the domain's `docs/prds/` pages | every cross-capability path its journeys imply | two or more journeys, from two or more capabilities of that domain |
| `feature` | `<capability>/feature-tcs.md` | one capability's journeys, refusals and edge cases | that capability's `spec.md` and `user-journeys.md`, and the domain suite above it | every scenario its journeys accept, by its own case or by a domain case its `## Reconciliation` records as **Covered at domain** | one journey |

- **The file name carries the level** — `test-cases.md` is not a suite name
- **`product` and `platform` are curated seam suites** — they cover high-value paths across domains or products. There is no fixed case-count cap and no requirement to enumerate lower-level coverage; stop when every important seam, critical path and cross-scope failure risk has a representative case, with duplicates grouped into rows or lower-level references
- **A suite exists only where a path exists** — a product with one domain has no `product-tcs.md`, a product with no specs has nothing, and `platform-tcs.md` starts with the first cross-product path; none of those absences is a gap
- **`shared/` gets no product suite** — its capabilities get feature suites, and paths across them `shared/<domain>/domain-tcs.md`
- **Levels run top down** — platform, product, domain, feature, deriving and reviewing alike; each level names the paths it owns and the level below covers what those do not reach. A feature run reads the domain suite first, so a path a domain case walks is not written twice
- **The suite file sets walk scope** — a walk in `feature-tcs.md` stays within its capability, one in `domain-tcs.md` may cross that domain's capabilities, one in `product-tcs.md` may cross that product's domains, and one in `platform-tcs.md` may cross products. A route that crosses the file's scope moves to the parent suite; it does not become an exception in the lower suite

### Walks and Case Placement

- **A walk is an execution route** — it arranges independent cases so a human tester can reuse a starting state, test data and page path; it is not a journey, a case or a second source of requirements
- **A walk does not replace a journey** — journeys keep the actor, goal and value; walks keep the route a tester drives. A feature walk may cross journeys within one capability, and a higher-level walk may cross the journeys and capabilities in its file scope
- **A case stays independent** — its own pre-conditions, test data, steps and complete Expected Results remain runnable without another case having passed. A walk may share setup without making one case depend on another
- **A case may serve several walks** — each walk may reference the same case, including different existing observations from that case. The walk chooses only which already-defined observation is recorded at that route point; it never creates a new one
- **A case definition appears once** — a higher-level walk may reference a lower-level case, but never copies its definition. A feature case referenced by a domain, product or platform walk but by no feature walk remains in the owning feature suite under `## Ungrouped`, grouped by journey
- **Walks come first** — in a suite that carries walks, print walks before case definitions; print grouped cases by journey, then `## Ungrouped` for cases with no walk at that suite level. A case referenced by several walks is printed once
- **Deprecated cases come last** — within each journey group, including the journey groups under `## Ungrouped`, preserve the existing case order for non-deprecated cases and place every `deprecated` case at the bottom; ids and case numbers never change
- **A route cannot invent an observation** — every product-behaviour observation in a walk belongs to a referenced case. A pairing check may verify only cross-scope continuity, such as carrying the same listing id from an admin app to a site app; it has no case id and does not become a new observation. If that check needs its own purpose, independent execution or automation coverage, write a composed case instead
- **Pairing checks stay lightweight** — a higher-level walk may add continuity checks beside lower-level case references, but it does not copy their Expected Results or record pass/fail in `*-tcs.md`. A tester-only shortcut belongs in the downstream case's own steps and carries no automation reference. A `**Remarks:**` note may say the seam could become a composed case later; it records a design choice, not an observation
- **Out-of-scope cases do not change a walk** — a tester follows the same route and skips checking or recording a case outside the test run's scope. The walk is not rewritten to help the scope filter
- **Walk references are checked** — `pnpm run tcs:validate` requires every human-facing `<scope>.US<n>-TC<m>` route reference to resolve to one case definition in the same suite. A domain, product or platform walk may reference a lower-level case in its owning suite; the referenced case's own journey and case number must match. A feature walk cannot reference another suite. The validator does not infer whether the prose repeats an observation; the referenced case's Expected Results remain the authority

### One purpose, one case

- **The spec that states the behaviour owns the case** — wherever the outcome is observed: `grade10-admin/auction/listing` SC-16 opens a page on the Grade10 site, and the case is the listing capability's
- **The levels above hold composed paths** — what no single spec states end to end; a composed case names every journey it walks, and one trace at a composed level fails `pnpm run tcs:validate`
- **Compose from evidence** — a run reads every `user-journeys.md` and every `docs/prds/` page in its scope before writing: a domain run reads the changed capability's journeys, every sibling capability's, and the domain's `index.md` and each PRD under it for its words and seeded values; a platform run reads the same one scope wider
- **Within a level** — two cases whose traces and outcomes say the same thing are one case; differing only in a value, one case with a row per run. If the purpose, route or checking differs, use a separate case
- **Across levels** — a `product` or `platform` case re-walks lower coverage on purpose, to ask whether the seam holds. Duplication is a lower case that exists only to re-test a higher path, or two composed cases at one level on the same path
- **A higher-level walk does not replace a feature case** — a feature run may leave a scenario to a domain-owned case only when reconciliation records **Covered at domain** and that case's Expected Results fully assert the scenario. A domain, product or platform walk that only reuses a feature case does not create that disposition; the feature case remains in its owning suite and may sit under `## Ungrouped`
- **The validator reports, a human decides** — identical trace sets among composed cases, and journeys traced at more than one level, are evidence, not proof

### When a Change Touches a Suite Above It

1. Take the capabilities the change's `## Capabilities` names and the delta `spec.md` paths it carries
2. Intersect their journeys with the `**Trace:**` lines in that domain's `domain-tcs.md`, its product's `product-tcs.md` and `platform-tcs.md`
3. A hit, or a capability new to a domain that has a `domain-tcs.md`, is an impact at that level
4. A domain with no `domain-tcs.md` whose journeys the change touches in two or more capabilities is a hit too: the path across them may be new, and the domain run decides whether one exists

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
- **The team walks the delivery line** — a capability under `shared/planning/` is the store's own rails, and its users are the hands of a change: a product manager, a designer, QA, an engineer, a release hand. There, and only there, a teammate is an `admin`, and a case names the role as the qualifier: `admin(product manager) is on <change page url>.`

## Where It Lives

| Capability location | Suite location |
| --- | --- |
| Durable: `openspec/specs/<product>/<domain>/<capability>/` | `.../feature-tcs.md`, beside `spec.md` and `user-journeys.md` |
| In-flight: `openspec/changes/<change>/specs/<product>/<domain>/<capability>/` | `.../feature-tcs.md`, beside the same two |
| Domain, durable: `openspec/specs/<product>/<domain>/` | `.../domain-tcs.md` |
| Domain, in-flight: `openspec/changes/<change>/specs/<product>/<domain>/` | `.../domain-tcs.md`, published with its accepted snapshot before implementation |
| Product, durable and in-flight: `openspec/specs/<product>/`, `openspec/changes/<change>/specs/<product>/` | `.../product-tcs.md`, published the same way |
| Platform | `openspec/specs/platform-tcs.md`, one for the store |

- **One tree per run** — `/spec-to-tcs` writes only to the tree the argument names; when a capability is in both, ask, never prefer the delta
- **Acceptance publishes the suite** — the accepted `feature-tcs.md` snapshot publishes beside its durable `spec.md` before implementation, every case under its stable id, `rev` and status; archive preserves the accepted source and later human QA updates the durable suite. Changes archived before acceptance carried suites are read by `pnpm run tcs:validate`, which warns on each archived case no live suite holds under its id and the durable suite does not name; a person brings it back as `draft` for review, or names what replaced it in the durable suite, one line, and the warning stops

## When Suites Are Generated

- **Automatic, top down** — once the proposal, journeys and outline are written, `/planning-dev` runs on the frozen anchors in a fresh QA1 context, levels first: **When a Change Touches a Suite Above It** is checked, a domain or product hit runs `/spec-to-tcs <level> <target>` into the change's tree, a platform hit is an edit to `platform-tcs.md`, and a hit that needs no case is its `No <level> impact: <why>` line; then `/spec-to-tcs <change>` writes the feature suites, each reading the domain draft above it. New cases are `draft`, ahead of the scenarios. QA2 reconciles the cases and Dev scenarios before one human accepts the complete plan; human review is `/tcs-review` after deployment makes implementation available
- **Both files publish together** — `pnpm spec:accept` publishes accepted requirements and `feature-tcs.md` with their content fingerprint, so durable requirements and their blind suite stay paired; CI's `pnpm run tcs:validate --require-suites` warns on a capability that still has journeys and no suite
- **The fold holds each case once** - a change's case replaces the durable case with the same `TC<m>`. It is the same revision restyled, or a higher one the change rewrote; a revised case without its own `trace:case` marker takes the durable one, moved to the new `rev`. An older revision is refused. The fold compares the durable file's approved share with the folded result and writes the status transition; when an `approved` file falls below 100%, it also lapses the `**Reviewed:**` line on that day. Draft cases and their file status never block the fold. Before anything is written, `accept:preflight` and `spec:accept` run `tcs:validate --require-suites` on a copy of the store that holds the fold, and check that every trace marker in a folded file sits directly above its heading. Either failure refuses acceptance. A journey child the fold cannot place, or a durable suite that already repeats a TC number, is refused too
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
| Regenerate the drafts | offered when `**Drafts styled:**` sits below `tcs_rules_rev`: every `draft` rewritten under the current rules, as **Rules Revisions** says; `actual` and `deprecated` cases kept; no yes needed — an `actual` case the new rule moves is still asked about |
| Regenerate | rewrites the whole file; destroys review history; explicit confirmation, and only when the guard allows |

- **Regeneration guard** — a whole-file regenerate is refused when the file is `approved` or any case is `actual`. A reviewer who wants a clean rewrite moves those cases back to `draft` by hand first; an agent never does. Regenerating the drafts is not under the guard: it leaves every reviewed case as it is
- **A delta that moves the ground under an `actual` case** — resolved in the same change, before the suite lands: changed what the case verifies → `rev` bumped, `**Status:** draft`, rewritten, reviewed again; removed the behaviour → `rev` bumped, `**Status:** deprecated`; did not touch what the case asserts → left `actual`, and the run says so. Marking is never deferred: the case goes back to `draft` at once, and only the review waits

## How a Case Reads

The house style — titles, step and result shape, pre-condition and placeholder wording, classification starting shapes, setup recipes — is [`tcs-conventions.md`](tcs-conventions.md). This document is the creation contract; the conventions file is the only writing-rule source and moves without a creation-rules revision.

- **Generation writes to it** — `/spec-to-tcs` reads the conventions before it writes, a narrower line over a store-wide one; a draft is born in the current style
- **Review restyles to it** — `/tcs-review` brings every `draft` to the conventions before the first journey: stable id kept, `rev` unchanged, status `draft`, coverage untouched. A manual `actual` case only on the reviewer's yes; `automated` and `deprecated` cases never
- **Review follows its gate** — `/tcs-review` uses `tcs-conventions.md`'s candidate and conflict gate. A confirmed style rule applies to the reviewed suite; a same-domain propagation may touch other cases only as a separately listed, style-only follow-up that preserves purpose, expected results, trace, status, test data meaning and automation links
- **It refines how, never what** — a convention cannot add coverage, loosen "mechanism is yours, coverage is the spec's", licence an invented label, or overrule this document; a contradicting line is reported and this document followed
- **A convention cannot silently become a contract** — if a writing rule changes coverage, ownership, traceability, lifecycle or validation, it is proposed here as a contract change instead of being added to `tcs-conventions.md`

## Review Contract

`/tcs-review` owns the review procedure. This section owns the invariant contract; branch, commit, push, presentation and interaction steps live only in the skill.

- **Review unit** — review one journey at a time. The reviewer sees the journey, all relevant walk context, the draft cases, duplicates and coverage questions, then gives verdicts before the next journey.
- **Walk context** — show every walk that references the current journey before its cases. A walk is an execution route, not a case, journey or verdict unit. Cases with no walk remain in the suite and are handled as `## Ungrouped`.
- **Orientation** — give a suite-level product walkthrough before the first verdict. Explain TCS concepts just in time while reviewing; orientation is not a requirement or an execution result.
- **Human verdict** — only the reviewer may approve, change, defer or retire a case. The file status follows the verdicts; the review never writes execution results.
- **Coverage and findings** — QA2 links scenarios post-hoc; review reports anchor gaps, uncovered scenarios, contradictions, duplicate and merge candidates across all non-deprecated statuses, and journey findings without inventing coverage. Apply **A Case That Already Exists Is Not Written Twice** for the scan and approved changes.
- **Convention boundary** — only a reusable writing rule may become a convention. Case facts stay in the case; a contract change is reported here, not added as a convention. If no candidate survives the gate, no convention follow-up is created.
- **Review output** — the suite carries its status and durable reconciliation memory; the skill reports verdicts, remaining drafts, findings and any style-only propagation. The run sheet owns execution results.

## Rules Revisions

`tcs_rules_rev` is one integer, bumped by hand when the case contract changes: a property, a vocabulary value, an id form, a file name, a level, or a rule about what a case may claim. Run the store against the new rules; a valid case body now rejected is a bump, a derived header migration or a typo is not. How a case *reads* is not a revision: it lives in `docs/governance/tcs-conventions.md` and moves without one. A stamp written before the revision was one integer (`r3.0`) reads as its first number.

| Case | The sweep does |
| --- | --- |
| `draft` below the revision | regenerated, whole file, without asking and without narrating the move: top down — platform, product, domain, then feature — and line 1 to the end within a file; never merely restyled |
| `actual`, `manual` | restyled to the new rule at its next review, on the reviewer's yes — ids, `rev`, status and claim unchanged |
| `actual`, `automated` | left as it is; a rule it breaks is a behaviour change, `rev` bumped back to `draft`, or nothing |
| `deprecated` | never touched |

- **The stamp moves only on a regenerate** — `**Drafts styled:**` takes the new revision when the drafts were regenerated under it, never for a restyle and never restamped
- **An `actual` case is skipped by the regenerate** — unless the new rule changes what it verifies or the journey it walks; then the sweep shows it and asks, and on a yes it goes back to `draft` and is regenerated and reviewed again
- **Inside one journey a sweep may restructure** — merge two cases that now serve one purpose, add a step a case needs to serve it, retire a case whose purpose another holds (`deprecated`, never deleted or renumbered)
- **Across journeys it may not** — a rule that implies merging, splitting or removing a journey is a finding for the spec's author, landed on the capability's PRD as a ❓ or in the next change's `decisions.md`; the sweep leaves the journeys as they are
- **A reviewed claim does not move silently** — `pnpm run tcs:validate --capture-baseline=<file>` before and `--swept=<file>` after prove every `actual` and `deprecated` case kept its id, trace and status
- **The sweep lands in its own commits** — separate from any review verdict, pushed before review starts, so the review's diff holds only the reviewer's decisions
- **A bump does not sweep** — the bump is its own commit and touches no suite. A suite below it is regenerated when `/tcs-review` next prepares it, or when someone runs `/spec-to-tcs` on it from `pnpm run tcs:stale`; a bulk sweep is a separate run somebody chooses, never part of the bump
- **What each revision changed** — r4: the revision became one integer and how a case reads moved to `tcs-conventions.md`; a sweep regenerates drafts; the `reopened` status and the lapsed `**Reviewed:**` line; **Executable without asking**, **A result may sharpen, never move**, **A value is the rule, or stands for it** and **Rows may add what the rule implies**. The current r5 major change includes anchor-first formal coverage, post-hoc QA2 scenario evidence, multiple scenario links per case, outcome-equivalent rows and approved export evidence; keep these changes under r5 until this major change closes

## Step 1: Digest the Capability

- **Read the isolated input** — on a feature run this is the whole of what a reader may see: `## Purpose` and `## Feature set` from `spec.md` but **never its requirements**, `user-journeys.md`, `ui-design.md` where the change has one, and the change's `proposal.md`, whose acceptance signal makes a case's type `acceptance`. Domain, product and platform runs already read journeys rather than scenarios and are unchanged
- **Read the PRD** — `docs/prds/products/<product>/<domain>/index.md` and the capability's PRD: a control, state or amount the manual names is written in the manual's words
- **Read the store's context** — `openspec/config.yaml`'s `context` for the brands, products and conventions (money is minor units plus an ISO 4217 code): `<grade10 store url>`, never `<store front door URL>`
- **Read the cross-cutting specs the Purpose names** — `crawlable-pages`, `localization`, `money-amounts`, `dates-and-times`. Their facts are checked on the way past (`URL contains <lang>`), never set up as a pre-condition
- **Write missing journeys first** — to `rules.user-journeys`: from the feature set and the PRD, adding no behaviour, with permanent ids and `**As a** / **I want** / **so that**`. There is no `**Accepted by:**` list — a scenario points up at its journey through its own `**Serves:**`, and tooling joins on that; `pnpm run validate:changes <change>`

## Step 2: Journeys Become Sections

- **One `##` per journey** — `## <app>.<domain>-<capability>.US<n>: <title copied unchanged>`, in the journeys file's order, carrying the same three-line statement and nothing else — no `**Covers:**` list, description, summary or count; the actor resolves to `customer` or `admin`; `---` on its own line between journeys

## Step 3: Write the Case

| Component | Rule |
| --- | --- |
| Id | `<app>.<domain>-<capability>.US<n>-TC<m>` |
| Title | a clean descriptive title naming the behaviour or condition; its wording is **How a Case Reads** |
| Classification | `**Classification:**`, a blank line, then the ten properties as `*` bullets in Step 5 order, directly under the title |
| Pre-conditions | `**Pre-conditions:**`, the condition on the line below: one sentence, or short bullets when several are independent; `None.` when nothing is needed |
| Test data | `**Test data:**`, a `Field \| Value` table; omitted whole when the case takes no input — no empty table, no `None` |
| Steps | `**Steps:**`, a blank line, a numbered list of atomic actions, no outcome on a step line |
| Expected results | `**Expected Results:**`, a blank line, `*` bullets of observable outcomes; name the step where a flow needs it (`Step 2 opens the card's page`) |

- **That order, a blank line between parts** — no description field
- **Positive first** — then refusals, empty and failure paths; a journey whose accepting scenarios include refusals but whose cases are all positive is unfinished. `destructive` only where the scenarios state cancel, remove, withdraw or unwind
- **Clauses land** — GIVEN → pre-conditions or a test-data row; WHEN → a numbered step, after the steps that reach it; AND after WHEN → the next step; THEN and its ANDs → expected results, in the spec's substance
- **Every case stands alone** — never leans on another case having run, never cites another case or scenario for its setup; repeating a setup is cheaper than a suite that passes only in order
- **Mechanism is yours, coverage is the spec's** — how the tester reaches the condition, where they look and what they click is the writer's to choose, and a review fills it in from the spec's flow, its `ui-design.md` and the PRD; what must then be true is only what the traced scenarios state. A failure mode the spec says nothing about is a gap, reported, not a case
- **Executable without asking** — a tester who has never seen the product runs the case to its end without a question: every step names where (a page or its placeholder), which control, and what goes in; a state a tester reaches by hand says how, in the pre-conditions or by naming a recipe under `tcs-conventions.md`'s `## Setup Recipes`. A state only mock data, a mocked response or a manipulated environment produces states the condition alone, and its case plans `automation` in **Testability**; `pnpm run tcs:validate` warns on one that does not
- **A result may sharpen, never move** — an expected result may be rewritten into what a tester sees (`Listing is saved` → `The listing shows in the Drafts tab, marked Draft`) and take a label the spec, `ui-design.md` or the PRD gives; it never gains an assertion, loses one, or changes an outcome. That is a behaviour change: `rev` bumped, back to `draft`
- **No invented label** — a control's text appears in a case only where the spec, its `ui-design.md` or the PRD gives it

### Pre-conditions

The concrete setup that produces the scenario's GIVEN, in the environment's terms: a manipulated condition, a stubbed upstream, seeded data, or where the actor already is. How it is worded is **How a Case Reads**.

- **Independent** — never an outcome another case produces
- **`## Background`** — optional, before the first journey, holding only the conditions and data every case shares
- **Placeholders** — the case is for the built, deployed site, so it never hedges about whether a page exists; a value the spec leaves open is an angle-bracket placeholder anywhere in the case, and `<lang>` is the locale prefix in force: nothing for the default, `/tc`, `/sc`

## Step 4: Test Data

- **Every value is stated** — the tester never chooses one; a `Field | Value` table when there is more than one, and the steps refer to it; no input, no section
- **A value is the rule, or stands for it** — a value that *is* the rule (a constant, a threshold, a boundary, a fixed price, the value at the limit) is the scenario's and never changes. A value that *illustrates* the rule (an example, an `e.g.`, an operand of a stated formula) or only *sets the case up* (which account, which listing, a time inside a window) may change within its equivalence class, its outcome derived from the rule: `1 + 1 = 2` may become `3 + 4 = 7`. Unsure which: it is the rule
- **Rows may add what the rule implies** — a new row is another value of a class a rule states: another member of a partition, one either side of a stated boundary, a locale or a role the spec names; each row's outcome traces to a stated rule. A value whose outcome no rule states is not a row: it is a gap for the spec's author; do not add it as a case until the product behaviour is settled
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
- **Reuse at generation** — read the existing suite and domain suite before adding a case. A new assertion on the same starting state, route and checking joins the existing case under its id. A path fully asserted by a domain case gets a **Covered at domain** reference instead of a new feature case. Report candidates affecting reviewed cases for human approval
- **Scan every active case** — review compares all non-deprecated cases in scope, including `actual` and `automated`, within the selected suite and against related higher- and lower-level suites. Compare results, starting states, routes, partitions and risks; include actual-to-actual and automated-to-automated pairs. Report duplicates, subset coverage and merge candidates separately. A validator warning is a hint, not the complete scan
- **Propose before changing** — show each candidate group in full, its retained and retiring ids, an assertion-by-assertion coverage mapping, any distinct state or risk, and the expected cost saving. The reviewer approves, changes or refuses each proposal, individually or as an explicit batch. Similar titles or purposes alone never justify retirement
- **Modify or merge** — keep a surviving id and move the approved assertions, rows or route into it. Preserve every required distinction; use a shared walk instead when combining cases would obscure different routes or failures. A changed `draft` keeps its `rev`. A change to what an `actual` case verifies bumps `rev` and returns it to `draft`; recompute its suite header. Product requirements remain unchanged unless a separate spec change settles them
- **Retire with a reason** — on the reviewer's retirement verdict, mark the case `deprecated`, keeping its id, number and historical content. Add `**Retirement:** <reason>; replaced by <full case id(s)>`. Retirement is allowed for duplicate coverage, consolidation, or behaviour removed from the spec. A coverage transfer requires its replacement to contain all required assertions before retirement. Removed behaviour needs no replacement and bumps `rev`; retirement that only transfers unchanged assertions keeps `rev`. Update walks, reconciliation and coverage references to the surviving cases
- **Across levels** — a feature case may be retired when a domain-owned case fully asserts its required outcomes, states and risks. Record `**Retirement:** Covered at domain: <full case id>; <reason>` on the retired case and **Covered at domain** in the feature reconciliation. The replacement may be `draft`; neither it nor its suite needs prior approval. Keep its true review status. A walk that only references the feature case is not a replacement. Preserve a distinct seam or outcome the other level does not verify
- **Automation follows coverage** — modifying or merging automated cases is allowed on the reviewer's approval. A surviving case whose verified content changes returns to `draft`, bumps `rev` if previously `actual`, and is `manual` until a test proves the complete revision. Remove an obsolete Decided-by claim from that surviving case. Keep the retiring case's historical automation evidence. Existing tests may remain pending migration; do not inherit an `automated` classification from a source case
- **Deferred test migration** — retirement need not wait for test changes. Put each unfinished migration only in the commit body as `TODO: migrate <source case id(s)> to <target case id>@<rev> — <test paths or repository; required changes and completion check>`. Include revision links and test assertions that need updating. Do not create a suite TODO ledger or a tasks.md item for this review debt. The TODO records unfinished work; it does not waive validation or claim the replacement is automated
- **Recheck replacements** — before rewriting or retiring a replacement, find every retirement remark and **Covered at domain** reference that depends on it. Recheck their assertion mappings. Restore missing coverage or name another complete replacement in the same reviewed edit; report affected suites. A replacement that no longer covers the claim cannot keep its credit

## Step 5: Classify the Case

Ten properties, in this order, on every case. Where a value usually starts is **How a Case Reads**; it is never a substitute for reading the case.

### Values

| Property | Values |
| --- | --- |
| Severity | `blocker` — a main user flow cannot start or complete · `critical` — money, data integrity, permission or privacy is wrong · `major` — a main result or important function is wrong, below blocker and critical · `minor` — supporting behaviour is wrong; the main flow still completes correctly · `trivial` — presentation only; understanding, operation and data are unaffected |
| Priority | `high` — core flows or major product risks; verify first · `medium` — rules and branches supporting the main functions · `low` — presentation or convenience that does not affect correct operation |
| Status | `draft` — new, or verified content changed since its last review; not export-eligible · `actual` — a reviewer stands behind it against its scenarios; exports · `deprecated` — behaviour removed or coverage transferred by an approved retirement; kept, never exported, never renumbered |
| Behaviour | `positive` — the intended thing, and it works · `negative` — invalid input, a wrong state or a missing permission; refused, stored facts unchanged · `destructive` — the actor removes, withdraws or cancels, and the product unwinds cleanly |
| Type | `functional` — correctness of behaviour, business rules and results; the default · `usability` — whether a person can understand and operate the product effectively · `security` — identity, permission, ownership and data protection · `performance` — a timing or capacity requirement the spec states · `compatibility` — correct behaviour across the browsers, devices or locales the spec names |
| Suites | `acceptance` — the fixed business-validation baseline for the most important user flows, such as landing, sign-in and payment · `smoke` — a small set checking that a build's key functions work well enough to proceed with planned testing · `regression` — protects existing behaviour against adverse effects of changes; manually triggered and selected by impact · `health-check` — checks availability of the environment, services and required dependencies; not business-rule correctness · `prod` — confirmed read-only cases suitable for production; may accompany any other suite · `none` — belongs to no named set; appears alone |
| Layer | `e2e` — through the interface the actor uses · `api` — against the contract beneath — a response or a stored fact · `unit` — a pure rule with no I/O |
| Automation status | `manual` — no automated test runs it yet · `automated` — an automated test covers it in CI |
| Testability | `automation` — deterministic; a script asserts it exactly · `manual` — a judgment a script cannot reliably make · `automation, manual` — both |
| Trace | `<app>.<domain>-<capability>.US<n>` — the journey, canonical form; composed levels list every journey walked, comma-separated, in the order reached |

- **Severity** — the expected impact if the verified behaviour fails, not an execution result. Order: blocker, critical, major, minor, trivial; take the higher when both apply. A flow means a main user journey, not every supporting action. A refusal protecting money or permission is critical even when the correct result changes nothing. This project scale does not decide release approval
- **Priority** — execution order, not defect-fix urgency or release approval. UI, copy and code logic are hints, never fixed grades: an incorrect displayed amount or misleading destructive confirmation is classified by product risk. There is no urgent value
- **Status** — generation writes `draft`; only `/tcs-review`, with a human's yes, writes `actual`
- **Behaviour at a limit** — the accepted edge is `positive`, the refused one `negative`
- **A broken input is `negative`** — an empty payload, a blocked asset, a `500`, a dropped connection, even when the product carries on
- **Type is exactly one** — the primary quality being verified, not a release gate or test entry point. A correct amount sent to another service is functional; its response-time limit is performance; disclosure of another person's data is security. Crossing a service boundary does not make integration a Type
- **Suites classify selection** — zero or more comma-separated sets, written `**Suites:** none` when empty. They imply neither execution nor a pass or release verdict. Acceptance is this project's narrow core-flow baseline, not every business acceptance condition or every branch of a core feature. Membership stays stable across concurrent versions. Smoke has no one-case-per-journey limit. Regression has no every-PR, fixed-version-count or automatic schedule requirement. `prod` is set by actual business side effects, not by whether a step clicks Save; missing it means suitability is unconfirmed. There is no exploratory set, and no core, full or confirmation tag
- **Classification edits** — properties are QA's: content review may rewrite Type, Suites, Severity and Priority from the case's purpose and assertions, and a wrong property is never grounds to change a step or an expected result. Classification-only edits preserve id, rev, review status and automation evidence; they do not approve a case or claim automation. Content changes trigger reclassification, but only a change to verified behaviour triggers the revision and automation rules under **A Case That Already Exists Is Not Written Twice**
- **Classification migration** — r6 removes Severity normal, Type acceptance and integration, and Suites release and exploratory. Re-read each case; never mechanically rename release to acceptance, transfer Type acceptance to Suites, or fill none with regression. Keep deprecated history. Until reviewed, the validator reports these former values as migration warnings rather than silently converting them; deprecated history remains readable. Drafts stamped r6 or later reject former values. New and reclassified cases use the current values
- **Trace identity** — every active and durable case carries the stable `trace:case` marker required by [Test Traceability](test-traceability.md), including cases without an automated acceptance link. Its `rev` is the case version. Keep the id across revisions; allocate a new one only for a genuinely new case, through the trace CLI. The marker's `covers` list is optional post-hoc QA2 evidence and may name multiple scenarios; it never replaces the case's required anchor in `**Trace:**`. Resolve unclear legacy coverage with the suite owner; do not guess
- **Automation status** — generation writes `manual`; engineering flips it when the test lands, with `pnpm run tcs:automated <case…> --decided-by <path>` in this store, editing the line in place, and the flag writing the Decided-by line in the same edit, so the flip rides the commit that landed the test; `automation` testability still `manual` is the backlog. It decides whether wording may move: a `manual` case may be re-worded in review, an `automated` case follows **A Case That Already Exists Is Not Written Twice** when modified, merged or retired; routine restyling still leaves it unchanged. `automation` testability plans QA's suite; it satisfies neither `ui-component-testing.md` nor a `tasks.md` checkbox. Selected app-test links use [Test Traceability](test-traceability.md)
- **Trace** — one journey per feature case; a case that would trace two is two cases or a journey not yet written, and a case with no trace does not belong in the file. Every id is defined by a `user-journeys.md` in scope; `<requirement> / <journey title>` only where a spec has no ids

## The File Header

At most three lines under the title — `**Status:**`, `**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>`, `**Reviewed:** <YYYY-MM-DD>, tcs-rules r<n>[, lapsed <YYYY-MM-DD>]` — every one computed, never chosen. The status line is compact: `**Status:** <status> · <actual>/<total - deprecated>`. Deprecated cases are history and count in neither side. A `retired` suite has no active denominator and writes only `**Status:** retired`.

| Transition from the current file | Next `**Status:**` |
| --- | --- |
| all cases are `deprecated` | `retired` |
| every active case is `actual` | `approved · <n>/<n>` |
| approved share falls — `9/10 → 8/10`, `9/10 → 9/12` | `reopened · <actual>/<active>` |
| a `reopened` file keeps the same approved share | stays `reopened` |
| approved share rises but remains below 100% | `pending-review · <actual>/<active>` |
| a new file, or an incomplete file whose share does not fall | `pending-review · <actual>/<active>` |

- **A transition, never a claim** — the writer compares the current and next approved shares by exact cross multiplication, then writes the table above. `/spec-to-tcs`, `/tcs-review` and the fold do this after every write. `pnpm run tcs:validate` verifies the stored ratio and the statuses the snapshot can carry; the prior file is what proves whether incomplete progress is `pending-review` or `reopened`
- **Activity lives in Git** — `in-review` is not a file status. A remote `tcs-review/*` branch or its open pull request means review work is in flight; closing or merging it ends that activity. A partially reviewed file at rest remains `pending-review` or `reopened`
- **Only eligible suites export** — a suite must be `approved` and the exported cases must be `actual`; `draft`, `deprecated`, anchor-only pending cases and `reopened` suites are not export-eligible. A pending QA2 link is a review finding, not a reason to invent `covers`
- **`**Drafts styled:**`** — the revision of this document the file's `draft` cases were last written against, and when; present exactly while the file holds a `draft`. `actual` cases carry no revision: a reviewer's yes is the convention
- **`**Reviewed:**`** — the date the file reached `approved` and the revision, written by `/tcs-review` on that transition; no reviewer name, git records who. When the file falls out of `approved` the line stays and gains `, lapsed <YYYY-MM-DD>`, written by whichever run added the draft. A new approval writes the line fresh
- **`**Out of suite:**`** — scenario ids the suite leaves uncovered on purpose, under the header (`openspec/config.yaml`, `rules.user-journeys`); `pnpm check:manual` counts them as covered and refuses one a living case traces

## The Format

````markdown
# <product>/<domain>/<capability> Test Cases

**Status:** pending-review · 0/<number of draft cases>
**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>

## <app>.<domain>-<capability>.US<n>: <journey title, copied from the spec heading>

**As a** <role>,
**I want** <goal>,
**so that** <reason>.

### <app>.<domain>-<capability>.US<n>-TC<m>: <clean descriptive title>

**Classification:**

* **Severity:** blocker | critical | major | minor | trivial
* **Priority:** high | medium | low
* **Status:** draft
* **Behaviour:** positive | negative | destructive
* **Type:** functional | usability | security | performance | compatibility
* **Suites:** acceptance | smoke | regression | health-check | prod | none
* **Layer:** e2e | api | unit
* **Automation status:** manual
* **Testability:** automation | manual | automation, manual
* **Trace:** <app>.<domain>-<capability>.US<n>

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

### <app>.<domain>-<capability>.US<n>-TC<m+1>: <the next case under this journey>

…

---

## <app>.<domain>-<capability>.US<n+1>: <the next journey>
````

- **Fixed points** — header lines computed; journey heading and its three-line statement copied, compact id, no `**Covers:**`; `**Classification:**` directly under the title, ten `*` bullets in order, generation writing `**Status:** draft` and `**Automation status:** manual`; a per-row case carries `Runs once per row of **Test data**.` between title and block; `## Background` optional between header and first journey; `**Test data:**` the one omittable section; a blank line after every `**Label:**` and between parts; `---` between journeys; a case with no pre-conditions line or an empty Expected Results list is not finished
- **Decided by** — ``**Decided by:** `<path>`[, `<path>`]*``, the first line after the classification block and before `**Pre-conditions:**`, one or more repository-relative paths, comma-separated. It names what decides the case: a store unit or script test, or the end-to-end walk that drives it. One rule — an automated case of an in-flight change names what decides it, in its place, once; nothing else may — which `pnpm run tcs:validate` reads as three verdicts: no line is refused, a line anywhere but there or a second line is refused, and a line on a case that is not `automated` is a warning. A path to a store test resolves inside the store, to a file that exists; a test or a walk in the application repository is named by its tag, `grade10:<path>`, which the store checks for form and resolves only when `--app-root` or the clone it is a submodule of holds the application repository, and which that repository's own `check:decided-by` holds to a file on every push. A durable suite under `openspec/specs/` owes no line yet; the fold carries across every line the change wrote. Archive compares only accepted claim targets, so a suite target that changed needs a compatibility acknowledgement
- **No execution record** — no actual result, no pass/fail column; a run lives in the run sheet against a snapshot of the case
- **Copy** — `openspec/specs/shared/auth/roles/feature-tcs.md`, the most recently approved suite (r4); its `shared-auth-roles-US1-TC1-1` is a case at the right size. A case pasted here would drift; an approved case is validator-held
- **Deltas use the same format** — under `openspec/changes/<change>/specs/<product>/<domain>/<capability>/feature-tcs.md`

## The Tools

Two pull requests: the spec PR carries the drafts, one commit per level, top down; the review PR carries the verdicts. A delta that adds, edits or removes a scenario or journey runs `/spec-to-tcs` in the same PR on the update path.

| Tool | Does |
| --- | --- |
| `/spec-to-tcs [level] <target>` (`spec-to-tcs` skill) | runs the creation workflow, reads this document plus the sole writing-rule file, derives the level's file with every new case `draft`, restyles existing drafts; on a feature run reads the domain suite above and leaves the paths it walks to it, and joins a new assertion to the case whose run it shares; shows an existing suite and asks; regenerates the drafts of a suite below the rules revision, top down; refuses a whole-file regenerate over `actual` cases or an `approved` file |
| `/tcs-review [<target>]` or `/tcs-review walk <target>` (`tcs-review` skill) | verdict mode finds suites awaiting review and walks drafts one journey at a time; read-only walk mode shows product context, walks one by one, then ungrouped case headers |
| `pnpm run tcs:validate` | validates the suite contract and anchor coverage; errors on malformed headers, duplicate or invalid ids, unresolved anchor traces, invalid properties/order, empty Expected Results, invalid actors, invalid composed levels, broken Decided-by paths, invalid **Covered at domain** ids, and an `approved` suite whose `actual` case is still anchor-only; warns on QA2-pending scenario links, legacy shape, archived cases left behind, duplicate-purpose candidates and a mocked state with no automation plan; `--strict`, `--require-suites`, `--capture-baseline=<file>`, `--swept=<file>`; CI on every push |
| `pnpm run tcs:stale` | suites whose drafts sit below the current revision, each owed a regenerate; a report, never a sweep |
| `/tcs-run-sheet <what to walk>` (`tcs-run-sheet` skill), `pnpm run tcs:run-sheet` | selects and confirms coverage, prints a trial, and finalizes one snapshot per run; results stay in the Sheet, never in a suite |
| `pnpm run tcs:automated <case-id…> --decided-by <path>` | flips one or more cases' Automation status to `automated`, in place, in whichever suite file holds them, writing the Decided-by line in the same edit; refuses a flip of an in-flight change's case that names no path; pushes nothing — the walk's own commit carries the flip |
