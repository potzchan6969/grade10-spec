# shared/ui/store-home Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## shared-ui-store-home-US1: What the store home blocks hold

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/store/home` and `grade10-site/store/cross-sell`, which compose the blocks
**As a** shopper reading a surface that composes the store home blocks,
**I want** each block to show what its surface supplies and nothing it was not given,
**so that** every surface built from them reads as one store.

<!-- trace:case id=g10.shared-store-home.TC-tvf rev=1 covers=g10.shared-store-home.SC-rkl,g10.shared-store-home.SC-fxb,g10.shared-store-home.SC-l81 -->
### shared-ui-store-home-US1-TC1-1: Section header renders title alone with no browse link

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** Section header

**Decided by:** `packages/ui/src/blocks/store-home/store-section-header.stories.tsx`

**Pre-conditions:**

* A section header is drawn on its own with a title, a browse destination, and copy carrying no browse-all label.

**Steps:**

1. Read the heading.
2. Look for a browse-all link beside it.

**Expected Results:**

* The heading renders alone, title only.
* No browse link or browse label is drawn anywhere in the header, the destination notwithstanding.

## Settled

None.

## Reconciliation

- **Raised** — nothing: the input settled the widening (`decisions.md` Q17, Q28; `ui-design.md` Components)
- **Uncovered anchors** — none of this delta's: `shared-ui-store-home-SC-10` is walked by `shared-ui-store-home-US1-TC1-1`
- **Folded** - US1-TC1's destination with no browse label draws no link, as the durable header requirement says: a link only when an href and its label are both supplied

**Run:** Read only the isolated bundle at `.round/blind-store-home/` — `outline.md` (`## Purpose` and `## Feature set`), `user-journeys.md`, `decisions.md`, `ui-design.md`, `prd-cross-sell.md`, `prd-store-home.md`, `context.md` — plus `docs/governance/specs-to-test-cases.md` and `openspec/specs/grade10-site/auction/auction/feature-tcs.md` for house style; denied the capability's `## Requirements`, every other file under `openspec/`, and `openspec/changes/archive/`.
