# shared/ui/auction-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## shared-ui-auction-record-US1: Content ownership

**As an** application,
**I want** the shared record surface to render supplied status copy,
**so that** order-state vocabulary stays owned by the application.

### shared-ui-auction-record-US1-TC1-1: The record surface calls the mixed column Status

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Content ownership

**Pre-conditions:**

* An application supplies open bid standings and won order statuses to the shared record surface.

**Steps:**

1. Render the record surface.

**Expected Results:**

* The mixed column header is Status.
* The component does not label it Your Standing.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| The shared component renders application-owned status copy | **Folded in:** `shared-ui-auction-record-SC-16` |
