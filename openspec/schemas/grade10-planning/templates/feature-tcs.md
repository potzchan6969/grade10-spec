<!-- One capability's suite, written as feature-tcs.md beside its spec.md.
     The file name carries the level, and the same shape serves all four:
     a path across the capabilities of one domain is domain-tcs.md beside
     them, across a product's domains is <product>/product-tcs.md, and across
     products is platform-tcs.md. Above feature level a case composes two or
     more journeys and its **Trace:** names each of them, the heading id is
     <app>.<domain>-dmn.US<n> (product: <app>-pdt.US<n>; platform:
     platform.US<n>), and product and platform carry no coverage
     obligation - they are smoke passes. Case headings use
     <app>.<domain>-<capability>.US<n>-TC<m>,
     <app>.<domain>-dmn.US<n>-TC<m>, <app>-pdt.US<n>-TC<m> or
     platform.US<n>-TC<m>.

     An INDEPENDENT reading of the user-journeys.md and feature set beside this
     file, written without sight of the spec's ## Requirements — never derived
     from the scenarios, because a suite derived from them cannot find what
     they left out. The shape below is fixed by
     docs/governance/specs-to-test-cases.md - follow that document rather than
     this sketch where the two ever part. Generate draft cases in QA1 within
     planning-dev, reconcile with QA2, and check with `pnpm run tcs:validate`.
     Human QA uses tcs-review after implementation is deployed and available. -->

<!-- <scope> is the stable marker prefix, for example
     g10.auction-account-record. The human-facing heading uses the journey and
     case numbers: g10.auction-account-record.US1-TC2. The trace:case marker
     above it keeps its own immutable machine id. -->

# <product>/<domain>/<capability> Test Cases

**Status:** pending-review · 0/<number of draft cases>
**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>

<!-- Walks come first. A walk carries Starting state, optional Shared test data,
     and Route. It references each case once or more; it never repeats a case
     definition or creates an observation. A feature walk stays in this
     capability. Higher-level routes belong in the parent suite. -->

## Walk 1: <title>

**Starting state:**

- <state that places the actor at the route's entry point>

**Shared test data:**

| Field | Value |
| --- | --- |
| `<fixture>` | <fixture or value> |

### Route

1. <action that moves the tester to the next route point>.
   - <observation to record> `g10.<domain>-<capability>.US1-TC1`
2. <action that opens an alternative route>.
   a. <condition and observation> `g10.<domain>-<capability>.US1-TC2`
   b. <condition and observation> `g10.<domain>-<capability>.US1-TC3`

<!-- Cases referenced by a walk are printed once under their owning journey.
     A case referenced only by a higher-level walk is printed under Ungrouped,
     grouped by journey. -->

## <app>.<domain>-<capability>.US<n>: <!-- journey title, copied from user-journeys.md -->

**As a** <role>,
**I want** <goal>,
**so that** <reason>.

### <app>.<domain>-<capability>.US<n>-TC<m>: <!-- clean descriptive title -->

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
<!-- or, for a capability whose journeys file says **Walked by:** nobody, a
     ## Feature set root group name matched verbatim. Never a scenario id. -->

**Pre-conditions:**

* <!-- from GIVEN — state, not actions. The actor is customer or admin, with
     its state or grant in brackets: customer(gold member) is on the shopping
     cart page. Or "None." -->

**Steps:**

1. <!-- from WHEN -->

**Expected Results:**

* <!-- from THEN -->

<!-- Repeat the journey sections in file order. After all walked cases, print
     cases that belong to no walk at this level under the following groups. -->

## Ungrouped

### <app>.<domain>-<capability>.US<n>: <!-- journey title -->

#### <app>.<domain>-<capability>.US<n>-TC<m>: <!-- clean descriptive title -->

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

**Pre-conditions:**

* <state>

**Steps:**

1. <step>

**Expected Results:**

* <result>

<!-- The blind reading's raised questions are not a section here. They go to
     the change's decisions.md, under its ## Raised table, one row per point the
     isolated input did not settle, with the capability that raised it — the
     file the author is already reading, where every row owes a landing before
     the change merges. A ## Raised in this file is a list in the wrong place
     and `pnpm run tcs:validate` says so. -->

## Settled
<!-- Questions earlier runs raised and had answered, one line each, no scenario
     ids. Carried into the durable suite at archive, and read by the next blind
     pass on purpose: it says what has already been asked, which is not what
     the scenarios say. Without it the same misreading is raised every run.

     Every raised row that was escalated or deferred lands here or in
     ## Reconciliation as well as in decisions.md, which archives with the
     change and is folded nowhere. -->

## Reconciliation
<!-- Written by the run after both readings land, and the evidence that the
     blind pass happened at all. One line per disposition:
     **Raised, folded into spec**, **Raised, rejected** with the reason,
     **Raised, escalated** with the PRD ❓ it became, **Raised, deferred** with
     who must settle it, **Contradicted** where the two readings state opposite
     things — which the run never settles on its own — and **Uncovered anchors**
     with where each is verified instead. A finding is recorded here even when
     the rule it becomes lands in another capability's spec; say where it went.
     The Run line names the isolated input: what the pass read, and what it
     was denied. Nothing verifies it, so it is a statement, not proof.

     Scenario ids may appear here only while the change is open; archive fold
     and tcs-review both strip them, leaving the dispositions and reasons. -->
