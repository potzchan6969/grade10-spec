# shared/ui/store-home Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## shared-ui-store-home-US1: What the store home blocks hold

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/store/home`, which composes the blocks

### shared-ui-store-home-US1-TC1-1: Section header renders title alone with no browse link

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Section header

**Pre-conditions:**

* customer is on <a card's page rendering the You may also like rail>.
* The rail supplies the section header a title and no browse address, and no browse-all copy.

**Steps:**

1. Read the You may also like heading.
2. Look for a browse-all link beside it.

**Expected Results:**

* The heading renders alone, title only.
* No browse link or browse label is drawn anywhere in the header.

## Settled

None yet.

## Reconciliation

**Run:** Read only the isolated bundle at `.round/blind-store-home/` — `outline.md` (`## Purpose` and `## Feature set`), `user-journeys.md`, `decisions.md`, `ui-design.md`, `prd-cross-sell.md`, `prd-store-home.md`, `context.md` — plus `docs/governance/specs-to-test-cases.md` and `openspec/specs/grade10-site/auction/auction/feature-tcs.md` for house style; denied the capability's `## Requirements`, every other file under `openspec/`, and `openspec/changes/archive/`.
