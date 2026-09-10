<!-- One capability's suite, written as feature-tcs.md beside its spec.md.
     The file name carries the level, and the same shape serves all four:
     a path across the capabilities of one domain is domain-tcs.md beside
     them, across a product's domains is <product>/product-tcs.md, and across
     products is platform-tcs.md. Above feature level a case composes two or
     more journeys and its **Trace:** names each of them, the heading id is
     <product>-<domain>-e2e-US<n> (product: <product>-e2e-US<n>; platform:
     platform-e2e-US<n>), and product and platform carry no coverage
     obligation - they are smoke passes.

     A derived reading of the spec.md and user-journeys.md beside this file,
     never a second source of truth. The shape below is fixed by
     docs/governance/specs-to-test-cases.md - follow that document rather than
     this sketch where the two ever part. Generate the first draft with the
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

**Pre-conditions:**

* <!-- from GIVEN — state, not actions. The actor is customer or admin, with
     its state or grant in brackets: customer(gold member) is on the shopping
     cart page. Or "None." -->

**Steps:**

1. <!-- from WHEN -->

**Expected Results:**

* <!-- from THEN -->
