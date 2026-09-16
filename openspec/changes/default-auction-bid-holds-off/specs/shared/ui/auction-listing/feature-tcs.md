# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## shared-ui-auction-listing-US1: The bid panel's rendering contract

**As an** application composing the shared bid panel,
**I want** every standing and every disclosure to render exactly as the
contract states,
**so that** each storefront embedding the panel shows collectors the same thing.

### shared-ui-auction-listing-US1-TC3-1: Lost standing omits release banner

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Lost standing

**Pre-conditions:**

* Bid card renders a closed listing where the viewer lost.

**Steps:**

1. Read the standing treatment.
2. Look for authorization-release banner copy.

**Expected Results:**

* Did not win status is shown.
* No card-authorization-release banner copy is shown.

## Raised

- None; this change introduces no unresolved product question.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Lost standing must not show release-banner copy at authorize-only launch | Covered as `shared-ui-auction-listing-US1-TC3-1` / `shared-ui-auction-listing-SC-46` |
