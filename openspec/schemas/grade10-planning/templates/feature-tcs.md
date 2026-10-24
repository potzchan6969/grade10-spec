<!-- The shape of every suite file. What a case is and claims is
     docs/governance/specs-to-test-cases.md; how it reads is
     docs/governance/tcs-conventions.md. This template is the only statement
     of the format.

     The same shape serves every level; the file name carries it:
     feature-tcs.md beside the capability's spec.md; domain-tcs.md,
     <product>/product-tcs.md and platform-tcs.md for composed paths, whose
     headings are <app>.<domain>-dmn.US<n>, <app>-pdt.US<n> and
     platform.US<n>, and whose **Trace:** names every journey walked.

     The Grade10 store differs: its files live only in
     docs/prds/products/grade10-site/store/tests/, one per page, with a
     **Capabilities:** header line, ## sections named for PRD sections, and
     **Trace:** naming a PRD heading anchor such as order-detail#product-pictures.
     New store case ids are g10.store-<page>.TC<n>. -->

# <product>/<domain>/<capability> Test Cases

**Status:** pending-review · 0/<number of active cases>
**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>
<!-- Computed lines, never chosen. **Reviewed:** <YYYY-MM-DD>, tcs-rules r<n>
     is added when the file reaches approved, and gains ", lapsed <YYYY-MM-DD>"
     when it falls out. A store file adds **Capabilities:** <capability>, … -->

**Out of suite (api):** <scenario id>, <scenario id>
<!-- Optional, one line per category: api, unit, non-GUI or seo. Only
     scenarios no product user can reach from any screen. The ids may instead
     be "- `<id>` - <note>" bullets beneath the label. -->

## Background

<!-- Optional. Only the conditions and test data every case shares. -->

## Walk 1: <title naming the route>

<!-- Optional, for manual testers only. Walks come before cases. One starting
     state and one shared test data table per walk: a branch that needs its
     own record says so in the starting state and names it as a data row,
     never as a second setup or data block. -->

Starting state:

- <actor(qualifier)> is on `<surface url>` with <the grant or state the route needs>.
- <every fixture's state before the first step>.
- For the <branch> branch, `<branch record>` <its state>; use it instead of <the main record>.

Shared test data:

| Field | Value |
| --- | --- |
| surface url | <the screen, by what it shows> |
| <fixture> | <exact value, or its rule or range in brackets> |
| branch record | <a separate record and the state it is in> |

### Route

1. <action>.
   - <observation an existing case records> `<app>.<domain>-<capability>.US<n>-TC<m>`
   - <another observation on the same screen> `<app>.<domain>-<capability>.US<n>-TC<m>`
2. <action leading into alternative routes>:
   a. <the condition, then the actions on this branch>.
      - <observation on this branch> `<app>.<domain>-<capability>.US<n>-TC<m>`
   b. For `<branch record>`, <the actions on this branch>.
      - <observation on this branch> `<app>.<domain>-<capability>.US<n>-TC<m>`
3. <the next action, back on the shared route>.
   - <observation> `<app>.<domain>-<capability>.US<n>-TC<m>`

## <app>.<domain>-<capability>.US<n>: <journey title, copied from user-journeys.md>

**As a** <role>,
**I want** <goal>,
**so that** <reason>.

<!-- trace:case id=<scope>.TC-<xyz> rev=1 -->
### <app>.<domain>-<capability>.US<n>-TC<m>: <title naming the behaviour>

<!-- A platform requirement opens the title: [Mobile only] … or [Web only] … -->

Runs once per row of **Test data**.
<!-- Only on a case that runs the same steps for each row. -->

**Classification:**

* **Severity:** blocker | critical | major | minor | trivial
* **Priority:** high | medium | low
* **Status:** draft
* **Behaviour:** positive | negative | destructive
* **Type:** functional | usability | security | performance | compatibility
* **Suites:** acceptance | smoke | regression | health-check | prod | none
* **Automation status:** manual
* **Testability:** automation | manual | automation, manual
* **Trace:** <app>.<domain>-<capability>.US<n>
<!-- Or, for a capability walked by nobody, a ## Feature set group name. -->

**Decided by:** `grade10:<path to the test>`
<!-- Only on an automated case; written by pnpm run tcs:automated. -->

**Pre-conditions:**

* <state, not action; one condition per bullet; the actor as class(qualifier); or "None.">

**Test data:**

| Field | Value |
| --- | --- |
| `<name>` | <exact value, or its rule or range> |
<!-- Omitted whole when the case takes no input. A per-row case has a column
     per varying value and one for the outcome. No notes column, and no note
     on how a run binds the value. -->

**Steps:**

1. <one action, platform-neutral: select, enter, open>
2. <the next action>

**Expected Results:**

* <what the tester sees, naming the step where needed>
* <a state a story draws ends: UI matching <story-id>>

---

## <app>.<domain>-<capability>.US<n+1>: <the next journey>

<!-- Repeat journeys in file order, --- between them, deprecated cases last in
     each. Cases no walk at this level references go here instead: -->

## Ungrouped

### <app>.<domain>-<capability>.US<n>: <journey title>

#### <app>.<domain>-<capability>.US<n>-TC<m>: <title>

<!-- The same case shape, one heading level down. -->

## Settled

<!-- Questions earlier runs raised and had answered, one line each, no
     scenario ids. Read by the next blind pass on purpose. -->

## Reconciliation

**Run:** <date and run>; read <the bundle>; denied <what it could not see>.
<!-- In a change only; acceptance drops it. -->

- **Covered at domain** - <scenario> - `<domain case id>`
- **Assumed** - <rule> (Common Rules)
- **New, not an extension** - `<case id>` - <why no live case takes it>
<!-- In a change, QA2's dispositions too, one line each: folded into spec,
     rejected with the reason, escalated to a PRD ❓, deferred to who settles
     it, contradicted, uncovered; a disposition with nothing in it is left
     out. Scenario ids only while the change is open. Raised questions go to
     the change's decisions.md ## Raised, never here.
     A durable suite keeps only Covered at domain, Assumed and Manual. What a
     run did - revised, joined, renumbered, carried, old→new ids - is its
     commit message's. -->

### Manual

<!-- Optional legend binding each named test to a path, then: -->

| Manual | Why |
| --- | --- |
| `<case id>` | <the part a person walks, and any test that proves the rest> |
