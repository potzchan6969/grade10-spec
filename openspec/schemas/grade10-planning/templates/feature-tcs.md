<!-- One capability's suite, written as feature-tcs.md beside its spec.md.
     The file name carries the level, and the same shape serves all four:
     a path across the capabilities of one domain is domain-tcs.md beside
     them, across a product's domains is <product>/product-tcs.md, and across
     products is platform-tcs.md. Above feature level a case composes two or
     more journeys and its **Trace:** names each of them, the heading id is
     <product>-<domain>-e2e-US<n> (product: <product>-e2e-US<n>; platform:
     platform-e2e-US<n>), and product and platform carry no coverage
     obligation - they are smoke passes.

     An INDEPENDENT reading of the user-journeys.md and feature set beside this
     file, written without sight of the spec's ## Requirements — never derived
     from the scenarios, because a suite derived from them cannot find what
     they left out. The shape below is fixed by
     docs/governance/specs-to-test-cases.md - follow that document rather than
     this sketch where the two ever part. Generate the draft with the
     spec-to-tcs skill, review it with tcs-review, and check it with
     `pnpm run tcs:validate`. -->

<!-- <capability> is the capability's path with slashes as hyphens:
     grade10-site/store/product-listing issues
     grade10-site-store-product-listing-SC-01, -US-01, -US1-TC1-1. -->

# <product>/<domain>/<capability> Test Cases

**Status:** pending-review
**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>

## <capability>-US<n>: <!-- journey title, copied from user-journeys.md -->

**As a** <role>,
**I want** <goal>,
**so that** <reason>.

### <capability>-US<n>-TC1-1: <!-- clean descriptive title -->

**Classification:**

* **Severity:** blocker | critical | major | normal | minor | trivial
* **Priority:** high | medium | low
* **Status:** draft
* **Behaviour:** positive | negative | destructive
* **Type:** functional | acceptance | usability | security | performance | compatibility | integration
* **Suites:** smoke | regression | release | none
* **Layer:** e2e | api | unit
* **Automation status:** manual
* **Testability:** automation | manual | automation, manual
* **Trace:** <capability>-US-<n>
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

## Raised
<!-- Written by the blind reading: every point the isolated input did not
     settle, as a question for the author. Not cases, not defects — the things
     that had to be decided in order to write anything at all. Required, and
     may be empty; empty is a claim on the record that the input settled
     everything. It stays in the file after reconciliation, because QA's review
     is largely a check on what was done with it. -->

## Settled
<!-- Questions earlier runs raised and had answered, one line each, no scenario
     ids. Carried into the durable suite at archive, and read by the next blind
     pass on purpose: it says what has already been asked, which is not what
     the scenarios say. Without it the same misreading is raised every run. -->

## Reconciliation
<!-- Written by the run after both readings land, and the evidence that the
     blind pass happened at all. One line per disposition:
     **Raised, folded into spec**, **Raised, rejected** with the reason,
     **Raised, escalated** with the PRD ❓ it became, **Raised, deferred** with
     who must settle it, **Contradicted** where the two readings state opposite
     things — which the run never settles on its own — and **Uncovered anchors**
     with where each is verified instead. A finding is recorded here even when
     the rule it becomes lands in another capability's spec; say where it went.
     Record the isolated input's hash on the Run line.

     Scenario ids may appear here only while the change is open; archive fold
     and tcs-review both strip them, leaving the dispositions and reasons. -->
