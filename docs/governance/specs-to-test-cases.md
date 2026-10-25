---
tcs_rules_rev: 7
---

# Specs to Test Cases

What a test case is, what it covers, where it lives and how it changes. A suite - `feature-tcs.md`, `domain-tcs.md`, `product-tcs.md`, `platform-tcs.md` - is written from the anchors a capability declares, never from the scenarios beside it, and never as a second source of truth.

| Question | Answered in |
| --- | --- |
| What a case is, covers and claims | This document |
| How a case reads | [`tcs-conventions.md`](tcs-conventions.md) |
| What a suite file looks like | The template, [`templates/feature-tcs.md`](../../openspec/schemas/grade10-planning/templates/feature-tcs.md) |
| Trace markers and test links | [`test-traceability.md`](test-traceability.md) |
| The steps of writing, reviewing and running | The `spec-to-tcs`, `tcs-review` and `tcs-run-sheet` skills |

A **feature** suite is written **blind**: by a fresh reader who cannot see the spec's `## Requirements`. A suite derived from the scenarios can only find inconsistency inside them, never the behaviour they left out. In the planning run QA1 writes cases from frozen anchors, Dev writes scenarios independently, and QA2 reconciles the two. Cases stay `draft` through acceptance; human QA reviews them with `/tcs-review` once the implementation is deployed, and runs them with `/tcs-run-sheet`. A review is not a test result.

## The Rule

- **Every case is a GUI walk** - a product user, a customer or an admin, acts in the product's own screens in `grade10-site`, `grade10-admin`, `zzz-site` or `zzz-admin`, and checks what a screen, an email, a PDF or a notification shows. A Slack message is not one of them. An admin screen is a product screen. Every case is worth a manual tester's run or a Playwright script
- **Written for testers** - a suite serves the manual tester who walks it and the automation that runs it, and no one else. Anyone may read or reuse a case, for a demo, a design review or a product question, but testers answer only for its use in testing: no case is written, kept, shaped or worded for another reader's use
- **GUI cases give the coverage** - cases derived from the journeys reach what the API answers, because a response shows on a screen. There is no separate API, unit, SEO or injection case
- **A request the GUI never sends is still a GUI case** - the tester prepares the state, such as an invoice an operator rejected in admin or another collector's order address, and checks what the screen allows. A permission, ownership or disclosure check is checked this way, never with an injection payload
- **A shared link's preview is a case** - the title, description and address a link unfurls with are what a person reads in a chat. It is not SEO
- **A makers tool gets no suite** - a capability no customer or admin reaches in the products, used only by the people who build, test or run the store - a test door, a docs reference, a design-sync rail, the planning rails, a QA helper in the admin console - is not a product feature. Its journeys file says `**Walked by:** makers only - <who uses it>`; no suite is written or owed, and `pnpm run tcs:validate` refuses one. Who uses it decides, not where it is drawn
- **A capability nobody walks gets no suite of its own** - a policy, a format or a component contract a product user meets only through other capabilities - money amounts, dates and times, a shared block - writes `**Walked by:** nobody on their own - <the capabilities whose journeys reach it>`. Those capabilities' suites walk its rules on their own screens: the case that shows the block or applies the policy checks it there, and a boundary, precision or time zone it states rides as a row on that case. A suite beside it is folded into those suites at its next regeneration, and `pnpm run tcs:validate` warns on one
- **`shared/` holds a case only where nothing else can walk it** - a `shared/` capability is met on the applications' screens, so its use case rides on a living case outside `shared/` first: an observation on the case that already reaches the screen, else a row on it, else a new case in that application's suite. A case is written under `shared/` only for a use case no application screen reaches, such as a component variant no application renders, walked in its Storybook. A capability with its own flows, such as sign-in, sign-out, sessions and the account directory, keeps its suite, and an application screen that only sets it up - the console's Users page - is walked there rather than in the application's suite
- **Out of suite is not tested by QA** - a scenario no product user can reach from any screen is listed under **Out of suite**, and no case is owed
- **The spec is correct** - once the two readings are reconciled, a suite that disagrees with the spec is regenerated. Before reconciliation the suite is the only reading there is. A proposal never links a suite in place of a spec delta
- **A case comes from an anchor** - never from a scenario, which on a feature run does not exist yet. A case carrying behaviour no anchor implies is a product decision in disguise, settled at reconciliation
- **A hole is reported** - an anchor no case covers, or a case tracing an anchor nothing defines, is reported, never closed by inventing a case or a journey
- **Coverage is an observable outcome** - count distinct outcomes a tester can see, not every value, row, actor or combination. Coverage is counted in anchors and scenarios reached, never in cases
- **Coverage before cost** - keep every required outcome, boundary, state, route and risk first; then cut runs, setup and maintenance. Fewer ids or more rows alone prove no saving
- **Group before splitting** - group assertions by starting state, route and checking. Split only when the purpose, route, checking or risk changes. A case earns its place by a distinct outcome, boundary, partition, transition, permission or error risk
- **One purpose per case** - rows change the input, never the direction of the result: every row ends the way the title says, such as each login error with its own message. A row whose result goes the other way - signed in against refused, shown against hidden, offered against not offered - is its own case. Each row is its own result on the run sheet
- **Partitions are representative** - one value from each outcome-equivalent partition, plus both sides of a stated boundary. A second member of a class, or a combination, is earned only where it changes an outcome, a transition, a permission, a provider answer or a risk. Never a Cartesian product
- **The same on every platform and every environment** - a case runs unchanged on web and mobile and against any environment. A requirement only one platform has is tagged `[Mobile only]` or `[Web only]` in the title and named in the pre-condition, and the run sheet marks the other platform `n/a`. An address is `<g10url>/<path>`; no case names an environment unless the environment is the partition under test

## The Isolated Input

A feature run reads a bundle the caller assembles, and nothing outside it.

- **Included** - from the capability: `## Purpose` and `## Feature set` of `spec.md`, and `user-journeys.md`. From the change: `proposal.md`, and `decisions.md` with its goals, non-goals and `## Raised`. `ui-design.md` where one exists, with the requirements pass's dispositions stripped. The linked `docs/prds/` pages and `openspec/config.yaml`'s `context`. The existing suite, without its `## Reconciliation` and with its `## Settled`, to extend a live case - a row, or a revision with its `rev` bumped where what it verifies changes - before writing a new one, and for id continuity. The domain suite above, the change's or else the durable one, without its `## Reconciliation`, so the run knows which paths are already walked
- **Excluded** - every `## Requirements` section, scenario text as a source, `openspec/specs/` beyond the above, and `openspec/changes/archive/`. An archived change keeps a reconciliation that names scenario ids, so reading it reopens the leak
- **Recorded** - the `## Reconciliation` Run line names what the pass read and what it was denied. Nothing verifies it: it is the run's statement, not proof. A person running the skill by hand assembles the bundle and says so
- **An empty `## Raised`, run after run, is the failure signal** - a second reading that asks nothing has stopped being blind or stopped being a different method. `pnpm check:manual` warns on an empty one
- **A different method** - the blind reader works a checklist: boundary values, equivalence partitions, state transitions, CRUD completeness, empty / one / many, null and missing, permission matrix, error taxonomy

## Raised

The blind reading ends with its raised questions: every point the input did not settle, as a question for the author.

They go to the change's `decisions.md` under `## Raised`, one row per question, `Capability | Raised | Landed`, with the options and `recommended: <option>` in the Raised cell. Never to the suite.

- **What belongs** - a rule the input is silent on: "Is a scheduled lot open to bid on? The spec names not-yet-published, ended and called off, and never places scheduled on either side"
- **What does not** - anything the input settles and the reader missed, anything for the technical design, anything the reader merely wants to know
- **QA2 closes what the held test does not hold** - each row the [held test](../../.claude/skills/workflow-round/SKILL.md#questions-held-or-decided-by-the-round) does not hold closes on its recommendation, as a `Decisions` row written `<answer> - decided by the round`, and its answer goes to the suite's `## Settled`. Only a held row stays open and holds acceptance; a contradiction between the readings is always held
- **Every row lands before the change merges** - as a `Decisions` row, or as a ❓ on the capability's PRD naming who owes the answer. `pnpm check:manual` refuses a row that names neither
- **Escalated and deferred rows are written twice** - in `decisions.md`, and in the suite's `## Reconciliation` with the answer in `## Settled`, because `decisions.md` archives with the change
- **No scenario id** - `decisions.md` goes into the next blind pass whole

## Reconciliation

Once both readings land, QA2 joins them on anchors and writes `## Reconciliation` at the bottom of the suite: the evidence that the blind pass ran and what it bought.

| Diff | Disposition |
| --- | --- |
| A case carries behaviour no scenario states, and it is real | Fold it into `spec.md` as a scenario |
| A case carries behaviour no scenario states, and it is a misreading | Drop the case, record the reason |
| A case carries behaviour nobody ever decided | Stop and ask the author |
| A case carries behaviour nobody present can settle | Keep it `draft` with `**Blocked:** <who settles it>` |
| A scenario no case reaches | Add its observation to a live case on the same route, or a GUI case; list it out of suite only when no product user can reach it |
| A scenario a domain case already walks | A `- **Covered at domain** -` bullet naming the domain case in full; `pnpm run tcs:validate` refuses an id no `domain-tcs.md` holds, or one `deprecated` |
| The two readings state opposite things | Stop and ask the author |

- **A contradiction is never resolved by the run** - one of the two readings is wrong and nothing says which, so it goes to the author
- **Recorded where found, folded where it belongs** - a capability's reconciliation names what its own pass raised, and says where the rule landed
- **Settled stays settled** - a rejection is copied into the durable suite's `## Settled` at acceptance, one line, no scenario ids, so the next blind pass does not raise it again
- **Blocked is not rejected** - the case stays, a ❓ goes on the PRD, and no scenario is written
- **Covered at domain** - names a domain case, not a scenario, so the reference survives the archive strip. If that case is later deprecated or rewritten, the feature suite owes the case back
- **Manual names what a person drives** - `### Manual` carries a `| Manual | Why |` table, one row per case no automated test decides. A legend above it binds each test a row names to a path, in this store or in the application repository; `pnpm run tcs:validate` refuses a store test that does not cite the row's case id
- **Scenario ids are temporary here** - they appear in `## Reconciliation` only while the change is open; acceptance and `/tcs-review` strip them

## Out of Suite

`**Out of suite (<category>):**` under the file header lists scenarios QA does not test. It counts as covered: `pnpm check:manual` never warns about a listed scenario, so every coverage warning left is a GUI case still owed.

| Category | The scenario is |
| --- | --- |
| `api` | a fact only the server holds, which no product user can reach from a screen even through a prepared state: a duplicate delivery, a race, a provider's metadata |
| `unit` | a pure rule with no I/O and no screen that shows it |
| `non-GUI` | an outcome no product user sees on a screen, email, PDF or notification: an analytics event, a cache header, a Slack message |
| `seo` | what only a crawler reads: canonical, robots, sitemap, structured data, indexability |

- **One line per category** - an optional ` - <note>` follows the ids. It names no verifier
- **Covered elsewhere is not out of suite** - a scenario a live case walks, in this suite, another tree, a domain suite or another capability, is not listed
- **Checked** - `pnpm check:manual` refuses a listed id a living case traces, and a list with no category or an unknown one. `**Out of suite:** none` lists nothing and needs none

## Coverage and Traceability

A case has two coverage relationships, never collapsed into one.

- **Formal coverage points to anchors** - `**Trace:**` is the case's required coverage: one journey for a feature case, every journey crossed for a composed case. It decides which suite owns the case
- **Scenario links are post-hoc evidence** - the `trace:case` marker's `covers` list is added by QA2 after both readings exist. QA1 and `/spec-to-tcs` never read scenarios. A new case's marker carries `id` and `rev` only, and is anchor-covered and link-pending, not invalid
- **One case may cover several scenarios** - only when one route, starting state and checking fully assert each of them
- **QA2 owns scenario coverage** - it finds scenarios with no asserting case, cases with no scenario, and contradictions, and never feeds scenario text back into generation
- **Findings stay reviewable** - the validator separates an anchor with no case (a finding), a case with no scenario link yet (pending QA2) and a scenario with no asserting case (a finding). It never invents a case or links by similarity

## Naming

| Kind | Form | Example |
| --- | --- | --- |
| Journey anchor | `<app>.<domain>-<capability>.US<n>` | `g10.auction-bidder-suspension.US1` |
| Scenario | `<app>.<domain>-<capability>.SC<n>` | `g10.auction-bidder-suspension.SC1` |
| Feature case | `<app>.<domain>-<capability>.US<n>-TC<m>` | `g10.auction-bidder-suspension.US1-TC1` |
| Domain journey and case | `<app>.<domain>-dmn.US<n>`, `…-TC<m>` | `g10.auction-dmn.US1-TC1` |
| Product journey and case | `<app>-pdt.US<n>`, `…-TC<m>` | `g10-pdt.US1-TC1` |
| Platform journey and case | `platform.US<n>`, `…-TC<m>` | `platform.US1-TC1` |
| Store case | `g10.store-<page>.TC<n>` | `g10.store-order-detail.TC12` |

- **`<app>` is the product's display code** - `grade10-site` → `g10`, `grade10-admin` → `g10adm`, `zzz-site` → `zzz`, `zzz-admin` → `zzzadm`
- **Issued by a command** - `pnpm run spec:issue` prints every new journey, scenario and case id, read from the branch and the fetched `main` together; nobody counts by hand. `pnpm run spec:issue move <change>` moves a branch's ids above `main`'s
- **Markers are immutable** - never change the `id`, `rev` or `covers` text of an existing marker, except QA2 adding links to `covers`. The marker is the machine identity; the heading id is the human reference
- **A heading may move** - a case moving journey changes only its heading and references; its marker and number stay
- **Numbers are permanent** - a deprecated case keeps its number, never reused, except that a regeneration may renumber headings to remove duplicate numbering. The full heading id is the reference everywhere; no second local reference
- **`rev` tracks behaviour, not prose**

| What happened | `rev` | Status |
| --- | --- | --- |
| A `draft` is restyled or gains a row | unchanged | stays `draft` |
| An `actual` case gains a row | bumped | back to `draft`, reviewed again |
| A `manual` `actual` case is re-worded | unchanged | stays `actual` |
| An `automated` `actual` case is re-worded | - | a behaviour change, or it does not happen |
| What the case verifies changed | bumped | back to `draft`, reviewed again |

## Levels

| Level | File | Covers | A case traces |
| --- | --- | --- | --- |
| `platform` | `openspec/specs/platform-tcs.md` | a few curated paths across products | journeys of two or more products |
| `product` | `<product>/product-tcs.md` | a few curated paths across one product's domains | journeys of two or more domains |
| `domain` | `<product>/<domain>/domain-tcs.md` | every cross-capability path the domain's journeys imply | journeys of two or more capabilities |
| `feature` | `<capability>/feature-tcs.md` | every scenario its journeys accept, by its own case or a domain case | one journey |

- **The file name carries the level**
- **A suite exists only where a path exists** - a product with one domain has no `product-tcs.md`; `platform-tcs.md` starts with the first cross-product path. `shared/` gets no product suite
- **Levels run top down** - platform, product, domain, feature, for writing and reviewing alike. A feature run reads the domain suite first, so no path is walked twice
- **The spec that states the behaviour owns the case**, wherever the outcome shows
- **A composed case names every journey it walks**; one trace at a composed level fails `pnpm run tcs:validate`. A run reads every journeys file and PRD page in its scope before writing

### When a Change Touches a Suite Above It

1. Take the capabilities the change's `## Capabilities` names
2. Intersect their journeys with the `**Trace:**` lines of the domain, product and platform suites above
3. A hit, a capability new to a domain with a `domain-tcs.md`, or a change touching two capabilities of a domain with none, is an impact at that level

On a hit the change carries an edit to that suite, or one proposal line: `No domain impact: <why>`.

## Walks

A walk is a route for a manual tester: it orders existing cases so one person reuses a starting state, test data and a page path. It is for manual passes only.

- **Never coverage, never a source** - a walk is not a journey, a case or a requirement. Nothing cites a walk: no Decided-by line, automated test, `tasks.md`, `tech-design.md` or other suite. The `tasks.md` group titled "The walk" is an engineering step and unrelated
- **Written in review** - `/spec-to-tcs` may draft a walk; `/tcs-review` settles it with a human
- **It saves setup and time** - a walk covers at least 2 cases and aims for 3 to 20, in no more than about 25 steps (23 to 27 where the route needs it). One walk per case, or a walk of a hundred steps, saves nothing and is not written
- **One walk, one starting state, one continuous route** - a case that needs a different setup, record or page path starts another walk. A walk never continues another walk, and never strings separate setups together under one title. An alternative route that needs its own record of the same kind, ready before the first step, names it in the starting state and as a shared test data row
- **Not a catch-all** - cases that share no route are not gathered into a walk such as "Additional fixture checks" or "Execute every case"; they sit under `## Ungrouped`
- **A case stays independent** - its own pre-conditions, test data, steps and complete expected results run without another case having passed
- **A walk invents nothing** - every observation on a route belongs to a referenced case. A higher-level walk may add a continuity check, such as the same listing id crossing from admin to site, with no case id and no result recorded in the suite
- **Scope follows the file** - a feature walk stays in its capability, a domain walk in its domain, and so on. A route crossing the file's scope moves to the parent suite
- **Referenced once, printed once** - a case is defined once, under its journey; a higher-level walk references a lower case without copying it. A case no walk at its level references sits under `## Ungrouped`. Deprecated cases come last in their group
- **Checked** - `pnpm run tcs:validate` requires every walk reference to resolve to one case definition, and that a feature walk references no other suite. It refuses a walk whose starting state or test data is cut into step ranges, such as `Steps 1–3 setup:` or `Steps 4–8 data:`, in a durable suite whose drafts are styled to the current revision, and warns on one in an older suite or a change's; a change's walk is held to it when acceptance validates its fold. It warns on a walk of fewer than 2 cases, more than 27 steps, or a catch-all title

## Who the Actor Is

| Class | Who |
| --- | --- |
| `customer` | anyone outside the business - the person the product is sold to |
| `admin` | anyone inside it - the people who run the shop |

- **A role is a class with a state or grant** - collector, bidder, staff, treasurer: the state is a pre-condition, written as the qualifier, `customer(gold member)`
- **Nobody else is an actor** - engineers, QA and consuming applications are not users. An outside agent acting on its own, such as a provider calling back, is a role whose result a class reads on a screen. A capability nobody reaches writes `**Walked by:** nobody on their own - <who inherits it>`; `pnpm run tcs:validate` fails a journey whose actor resolves to no class

## Where It Lives

| Capability | Suite |
| --- | --- |
| Durable, `openspec/specs/<product>/<domain>/<capability>/` | `feature-tcs.md` beside `spec.md` |
| In a change, `openspec/changes/<change>/specs/<product>/<domain>/<capability>/` | `feature-tcs.md` beside the delta |
| A domain, a product | `domain-tcs.md`, `product-tcs.md` at that level, durable or in a change |
| The platform | `openspec/specs/platform-tcs.md` |
| Grade10 store | only `docs/prds/products/grade10-site/store/tests/` - see **Store** |

- **One tree per run** - `/spec-to-tcs` writes only to the tree it is given; when a capability is in both, it asks
- **Acceptance publishes the suite** - the accepted `feature-tcs.md` publishes beside its durable `spec.md`, every case under its id, `rev` and status. `pnpm run tcs:validate` warns on an archived case no live suite holds and the durable suite does not name; a person restores it as `draft` or names its replacement in one line

### Store

The PRD and Storybook are the store's only sources of truth. What a store spec says and its PRD page does not, the store's cases ignore.

- **One folder** - every store case lives in `docs/prds/products/grade10-site/store/tests/`. No `*-tcs.md` exists under `openspec/specs/grade10-site/store/` or under any change's `specs/grade10-site/store/`, and `pnpm run tcs:validate` refuses one
- **A file per page** - each file covers one store page and states what it holds in a header line: `**Capabilities:** grade10-site/store/cart-drawer, grade10-site/store/checkout`. A feature shown on several pages stays in the page file it sits in
- **A case traces a PRD section** - `**Trace:** order-detail#product-pictures`, a heading anchor on that page under `docs/prds/products/grade10-site/store/`, or the page name alone, `**Trace:** home`, for the rules it states before its first heading. Sections in the file are named for PRD sections. Nothing in openspec is traced, unless the PM moves journeys into the PRD
- **A store change writes there directly** - its QA1 drafts cases in the page file on the change's branch, and acceptance has nothing to fold. QA1 stays blind to the requirements; QA2 reconciles against the PRD page and Storybook, so store cases carry no scenario links
- **Checked for shape, not scenarios** - store files are checked for format, ids, header, the `**Capabilities:**` line and that each trace resolves. Scenario coverage does not apply

## When Suites Are Written

- **In the planning run, top down** - once the proposal, journeys and outline are written, `/planning-dev` runs QA1 on the frozen anchors: suites above first, as **When a Change Touches a Suite Above It** finds them, then `/spec-to-tcs <change>` for the feature suites. QA2 reconciles before one human accepts the plan
- **Requirements and suite publish together** - `pnpm spec:accept` publishes both with their content fingerprint. CI's `pnpm run tcs:validate --require-suites` warns on a capability with journeys and no suite
- **The fold holds each case once** - a change's case replaces the durable case with the same `TC<m>`, at the same `rev` or a higher one; an older revision is refused. The fold writes the file's status transition. Acceptance runs `tcs:validate --require-suites` on a copy that holds the fold, and refuses on any error
- **`skip_specs`** - nothing to write
- **By hand** - `/spec-to-tcs <change | capability | path>`, either tree

### When a Suite Already Exists

`/spec-to-tcs` never overwrites silently: it shows the suite it found and asks.

| Choice | Does |
| --- | --- |
| Update | cases for untraced scenarios, re-worded cases for changed ones, `deprecated` for scenarios the spec lost; ids and reviewed properties kept |
| Regenerate the drafts | offered when `**Drafts styled:**` is below `tcs_rules_rev`: every `draft` rewritten; `actual` and `deprecated` kept |
| Regenerate | writes the whole file again as if it were new, by the same steps as a new suite - the same inputs, the blind reading, QA2's reconciliation - on explicit confirmation |
| Another target | leaves the suite alone |

- **A regeneration overrides review** - on the person's explicit confirmation it rewrites `actual` and `automated` cases and an `approved` file too. The file status follows **The File Header**, and a sweep, `/tcs-review` or a change's delta never does this
- **An unchanged case keeps its standing** - a rewritten case that checks the same behaviour as the case it replaces - the same journey, the same outcomes, no assertion gained or lost, only its words changed - keeps its marker, `rev`, status, automation status and Decided-by line; the re-wording rows of the `rev` table do not apply. Any other case comes back `draft` and `manual` with no Decided-by line: one split, merged, or now checking something else. The commit lists each case kept, each case reset and each automated test that names a reset case, for the person to update
- **A regeneration keeps only identity** - the old file is not a template: no case, test value or walk is copied, and every case is written and reconciled afresh. What carries over is the markers - a surviving case keeps its stable id - and the lines **What a Suite Holds** keeps. Headings take the form under **Naming** and may be renumbered to remove duplicate numbering, and walks are written afresh, so a legacy suite comes out with walks that reference it; a heading never overrides its marker
- **A regeneration cleans as it writes** - whatever **What a Suite Holds** leaves out is dropped from the file, the header gains `**Regenerated:**`, and its commit message carries what the run did
- **Anything less is a partial update**, never called a regeneration - changing a few cases' numbers or words, adding or rewriting walks, renaming headings, re-applying draft or actual formatting, keeping old content and adding traces, or resolving a merge without re-reading the cases
- **A delta that moves the ground under an `actual` case** - resolved in the same change: what it verifies changed → `rev` bumped, back to `draft`; behaviour removed → `rev` bumped, `deprecated`; untouched → left `actual`, and the run says so

## Writing the Case

How each part reads is [`tcs-conventions.md`](tcs-conventions.md); the shape of each part is the template.

- **Positive first** - then refusals, empty and failure paths. A journey whose scenarios include refusals but whose cases are all positive is unfinished
- **Clauses land** - GIVEN → pre-conditions or a test-data row; WHEN → a step; THEN and its ANDs → expected results
- **Every case stands alone** - never relies on another case having run
- **A Common Rule holds where the sources are silent** - a rule under `## Common Rules` in [`tcs-conventions.md`](tcs-conventions.md#common-rules), from a published standard or from how comparable products handle it, may be assumed with no PRD or spec line. It rides on a live case as a test-data row, is never raised, and is recorded `- **Assumed** - <rule> (Common Rules)` in `## Reconciliation`. A PRD or spec line overrides it; a product that disagrees with neither is a failure the tester raises
- **Mechanism is yours, coverage is the spec's** - where the tester goes and what they select is the writer's; what must then be true is only what the anchors imply. A failure mode nobody stated is a gap, reported, not a case
- **Executable without asking** - a tester who has never seen the product runs it to the end: every step names where and what. A state reached by hand says how, or names a setup recipe. A state only mock data or a manipulated environment produces plans `automation`, and `pnpm run tcs:validate` warns when it does not
- **A result may sharpen, never move** - a result may be rewritten into what a tester sees and take a label the spec, `ui-design.md` or PRD gives; gaining or losing an assertion is a behaviour change
- **No invented label** - a control's text appears only where the spec, `ui-design.md` or PRD gives it
- **Storybook shows what a state looks like** - an expected result may end with `UI matching <story-id>` for a state a story draws; the id is checked against this store's Storybook
- **Pre-conditions are independent** - never an outcome of another case. `## Background` holds only what every case shares

### Test Data

- **Every value is stated** - the tester never chooses one
- **A value is the rule, or stands for it** - a value that is the rule (a constant, a threshold, a boundary, a configured value) never changes. A value that illustrates or only sets up the case may change within its class, and states its rule or range, so a changed fixture rewrites nothing. Unsure: it is the rule
- **Rows add only what a rule implies** - another member of a partition, either side of a boundary, a locale or role the spec names, or a Common Rule. A value whose outcome no rule states is a gap, not a row
- **Runs per row** - same steps, different data: one case, a row each, with `Runs once per row of **Test data**.` under the title
- **Name the data, then use the name** - `<listing_6>` in pre-conditions, steps and results; a derived value states its derivation, `<user B maximum> plus <increment>`, never a bare number. A name means one thing in the file
- **Roles are not data** - `customer(gold member)` is a pre-condition, not a row

## A Case That Already Exists Is Not Written Twice

A duplicate is a defect. Read the suite, the domain suite and the live cases before adding anything.

- **Live case first** - a new observation, or a new value at an edge (very long, non-Latin, zero, an optional field left empty), joins a live case whose route already shows it, as a result or a test-data row. A new case is written only when no live route shows it. One expectation never lives in two cases
- **A change's new case is grouped before it folds** - QA2 checks each case a change adds to a journey that already has live cases: it joins one, as a row or a revision carrying that case's marker, or stays new with `- **New, not an extension** - <case id> - <why no live case takes it>` in `## Reconciliation`. `pnpm run tcs:validate` warns on a new case with neither; acceptance does not refuse it. An amendment's QA2 rerun groups again for the scope it touches
- **Numbers after grouping** - the cases left new take the next unused numbers from `pnpm run spec:issue`, never a temporary id. Nothing is automated before acceptance, so no test's id moves
- **Review catches the rest** - `/tcs-review` scans the durable suite for duplicates and merge candidates when it next prepares it
- **A duplicate is identical claims** - the same outcomes on the same surface from the same starting state; a subset of another case's results by the same route; or the same steps with other data, which is one case with rows
- **Distinct** - a different route where the spec states each outcome; a refusal beside the acceptance it mirrors
- **Scan every active case** - review compares every non-deprecated case in scope, `actual` and `automated` included, within the suite and against the levels above and below
- **Propose before changing** - show each merge or retirement in full, with an assertion-by-assertion mapping. The reviewer approves, changes or refuses each
- **Modify or merge** - keep a surviving id and move the approved assertions or rows into it. A changed `draft` keeps its `rev`; an `actual` case whose verification changes is bumped and back to `draft`
- **Retire with a reason** - a retired case is `deprecated`, keeps its id and content, and carries `**Retirement:** <reason>; replaced by <full case id(s)>`. Removed behaviour needs no replacement and bumps `rev`
- **Across levels** - a feature case may retire when a domain case fully asserts it: `**Retirement:** Covered at domain: <case id>; <reason>`
- **Automation follows coverage** - a surviving case whose verification changes is `manual` again until a test proves it; its stale Decided-by line goes. An unfinished test migration is written only in the commit body: `TODO: migrate <source> to <target>@<rev> - <what changes>`
- **Recheck replacements** - before changing a case others retired into, recheck every retirement and **Covered at domain** that depends on it

## Classifying the Case

Nine properties, in the template's order, on every case.

| Property | Values |
| --- | --- |
| Severity | `blocker` - a main flow cannot start or finish · `critical` - money, data integrity, permission or privacy is wrong · `major` - a main result is wrong · `minor` - supporting behaviour is wrong, the flow still completes · `trivial` - presentation only |
| Priority | `high` - core flows and major risks; run first · `medium` - rules and branches beside the main functions · `low` - presentation or convenience |
| Status | `draft` - new or changed since review; not exported · `actual` - a reviewer stands behind it; exported · `deprecated` - retired; kept, never exported or renumbered |
| Behaviour | `positive` - the intended thing works · `negative` - a wrong input, state or permission is refused and nothing stored changes · `destructive` - the actor removes, withdraws or cancels and the product unwinds |
| Type | `functional` - behaviour, rules and results; the default · `usability` - whether a person can understand and operate it · `security` - identity, permission, ownership, data protection · `performance` - a stated timing or capacity · `compatibility` - the browsers, devices or locales the spec names |
| Suites | `acceptance` - the fixed core-flow baseline · `smoke` - a build's key functions · `regression` - protects existing behaviour, selected by impact · `health-check` - the environment and its dependencies are up · `prod` - read-only, safe in production · `none` |
| Automation status | `manual` - no test runs it yet · `automated` - a test covers it in CI |
| Testability | `automation` - a script asserts it exactly · `manual` - a judgment a script cannot make · `automation, manual` |
| Trace | the journey, or for store the PRD section; composed levels list every journey, in the order reached |

- **Severity is the impact if it fails** - take the higher of two. A refusal protecting money or permission is `critical` even when nothing changes
- **Priority is run order**, not fix urgency
- **Status** - generation writes `draft`; only `/tcs-review`, with a human's yes, writes `actual`
- **Behaviour at a limit** - the accepted edge is `positive`, the refused one `negative`; a broken input, a `500` or a dropped connection is `negative`
- **Type is exactly one** - the primary quality checked. Crossing a service boundary is not a type
- **Suites classify selection** - zero or more, `none` alone. They imply no execution and no verdict. `prod` is set by real side effects
- **Classification is QA's** - a property edit never changes a step or result, and keeps id, `rev`, status and automation. Former values (r6: Severity `normal`, Type `acceptance` and `integration`, Suites `release` and `exploratory`) warn until reviewed; never rename them mechanically
- **Trace identity** - every active case carries the `trace:case` marker [`test-traceability.md`](test-traceability.md) requires
- **Automation status** - generation writes `manual`. Engineering flips it with `pnpm run tcs:automated <case…> --decided-by <path>`, which writes the Decided-by line in the same edit. An in-flight change's automated case must name its test; a Decided-by line on a case that is not `automated` warns. An application path is written `grade10:<path>`
- **One journey per feature case** - a case tracing two is two cases

## The File Header

Up to five kinds of line under the title, every one computed, never chosen: `**Status:**`, `**Drafts styled:**`, `**Regenerated:**`, `**Reviewed:**` and `**Out of suite (<category>):**`. The store adds `**Capabilities:**`.

| Transition | Next `**Status:**` |
| --- | --- |
| every case `deprecated` | `retired` |
| every active case `actual` | `approved · <n>/<n>` |
| the approved share falls | `reopened · <actual>/<active>` |
| a `reopened` file keeps its share | stays `reopened` |
| the share rises below 100%, or a new file | `pending-review · <actual>/<active>` |

- **A transition, never a claim** - the writer compares the old and new shares by exact cross multiplication; `/spec-to-tcs`, `/tcs-review` and the fold do this after every write, and `pnpm run tcs:validate` checks the ratio
- **`**Drafts styled:**`** - the rules revision the file's drafts were last written to, present exactly while a draft exists
- **`**Regenerated:**`** - `<YYYY-MM-DD>, tcs-rules r<n>`, the date and revision of the last confirmed full regeneration. Every change archived on or before it is settled: `pnpm run tcs:validate` no longer asks the suite to name that change's old case ids, which the regeneration's commit maps instead
- **`**Reviewed:**`** - the date the file reached `approved`, and the revision. When it falls out of `approved` the line gains `, lapsed <date>`; a new approval writes it fresh
- **Only approved suites export** - and only their `actual` cases
- **Review activity lives in Git** - a `tcs-review/*` branch or pull request, never a file status

## What a Suite Holds

A suite holds what a tester runs and what a tool reads. What a run did is history, and history lives in Git: the commit message, and the archived change's own suite.

| Holds | Never holds |
| --- | --- |
| the header lines; `**Out of suite (<category>):**`; `## Background`; walks; journeys and cases, deprecated cases with their `**Retirement:**`; `## Ungrouped`; `## Settled` | a run's narration once accepted - `**Run:**`, `**Rerun:**`, revised, joined, corrected, renumbered, carried, counts, review findings |
| under `## Reconciliation` in a durable suite: `**Covered at domain**`, `**Assumed**` and `### Manual` | an old→new case map or a fold record; a disposition with nothing in it, such as `Contradicted - none` |
| in a change, until acceptance: the `**Run:**` line, QA2's dispositions and `**New, not an extension**` | a notes column or a binding note in test data; a note on how a case or walk was written |

- **The commit message carries the run** - the old→new case map, the cases kept and reset, the dispositions of a pass, and an unfinished test migration
- **Acceptance keeps what the durable suite holds** - the fold carries `**Covered at domain**`, `**Assumed**` and the `### Manual` rows into the durable reconciliation and drops the rest, the durable suite's own older narration included; the change's run and dispositions stay in the archived change

## How a Case Reads

[`tcs-conventions.md`](tcs-conventions.md) is the one writing-rule file. `/spec-to-tcs` writes to it; `/tcs-review` restyles drafts to it and adds lines to it through its gate.

- **It refines how, never what** - a convention cannot add coverage, invent a label or overrule this document; a contradicting line is reported and this document followed
- **Common Rules are the exception** - this document lets a Common Rule add a test-data row
- **A convention cannot become a contract by stealth** - a writing rule that changes coverage, ownership, traceability, lifecycle or validation is proposed here instead

## Review Contract

`/tcs-review` holds the procedure; these are its fixed points.

- **One journey at a time** - the reviewer sees the journey, every walk referencing it, its draft cases, duplicates and coverage questions, and gives verdicts before the next
- **A product walkthrough first** - orientation before the first verdict; it is not a requirement or a result
- **Only the reviewer decides** - approve, change, defer or retire. The file status follows; the review records no execution result
- **Findings without invention** - anchor gaps, uncovered scenarios, contradictions and duplicate candidates are reported, never covered by invention

## Rules Revisions

`tcs_rules_rev` is one integer, bumped by hand when the case contract changes: a property, a vocabulary value, an id form, a file name, a level, or what a case may claim. How a case reads moves without one. A stamp like `r3.0` reads as its first number.

| Case below the revision | The sweep |
| --- | --- |
| `draft` | regenerated, top down, never merely restyled |
| `actual`, `manual` | restyled at its next review, on the reviewer's yes |
| `actual`, `automated` | left; a rule it breaks is a behaviour change |
| `deprecated` | never touched |

- **The rules have one owner** - this document, the suite template and the `spec-to-tcs` skill decide what every suite holds, and other teams' planning runs generate from them, so they change only by the hand of the [`team.yaml`](../prds/team.yaml) handle that `owns: [tcs-rules]`. Anyone else proposes the change to them. `pnpm run tcs:rules-owner` refuses another author's commit, in the push gate and in CI. [`tcs-conventions.md`](tcs-conventions.md) says only how a case reads and stays open to everyone
- **A bump does not sweep** - a suite below it is regenerated when `/tcs-review` next prepares it, or when someone runs `/spec-to-tcs` on it from `pnpm run tcs:stale`
- **Inside one journey a sweep may restructure; across journeys it may not** - merging or splitting a journey is the spec author's call, landed on the PRD as a ❓
- **A reviewed claim never moves silently** - `pnpm run tcs:validate --capture-baseline=<file>` before and `--swept=<file>` after prove every `actual` and `deprecated` case kept its id, trace and status. A regeneration the person confirmed is the exception, and lists what it kept and what it reset
- **The sweep lands in its own commits**, before review starts
- **What each revision changed** - r4: one integer, conventions split out, drafts regenerate. r5: anchor-first coverage, post-hoc scenario links, outcome-equivalent rows. r6: the classification vocabulary. r7: every case is a GUI walk; the Layer property and unit, API, SEO and injection cases are gone; out of suite means not tested by QA; platform and environment tags; live case first, and the blind pass reads the suite to extend it; suites are written for testers alone; the rules have one owner; one purpose per case; a change's new cases are grouped into live ones before they fold; Common Rules hold where the sources are silent; a confirmed regeneration overrides review and writes current ids and walks, keeping the standing of a case whose behaviour is unchanged; a suite holds what a tester runs and a tool reads, and a run's history lives in Git; walks are for manual testers; the store's cases live only in its PRD folder

## The Tools

| Tool | Does |
| --- | --- |
| `/spec-to-tcs [level] <target>` | writes or updates the drafts of one level's suite |
| `/tcs-review [<target>]`, `/tcs-review walk <target>` | reviews drafts one journey at a time; walk mode shows a suite read-only |
| `/tcs-run-sheet <what to walk>`, `pnpm run tcs:run-sheet` | selects cases for a manual pass and records one snapshot per run; results live in the sheet, never in a suite |
| `pnpm run tcs:validate` | checks every suite against this document; errors block, warnings report. `--strict`, `--require-suites`, `--capture-baseline`, `--swept` |
| `pnpm run tcs:stale` | lists suites whose drafts are below the current revision |
| `pnpm run tcs:automated <case…> --decided-by <path>` | flips cases to `automated` and writes their Decided-by line |
