# grade10-site/vault/case-intake Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-vault-case-intake-US5: Collector gets a reference they can say and type

**As a** collector,
**I want** a short reference for my case,
**so that** I can read it out at the counter and type it as the transfer
reference at my bank.

<!-- trace:case id=g10.vault-case-intake.TC-43b rev=1 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### grade10-site-vault-case-intake-US5-TC9-1: A draft staff opened at the counter carries its reference from the start

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_9>` is a draft admin(staff) opened for the collector at the counter, never sent.

**Steps:**

1. Ask for the collector's own cases.
2. Ask for the collector's own read of `<case_9>`.

**Expected Results:**

* Step 1 lists `<case_9>` as a draft opened at the counter, carrying a six-character reference.
* The reference is drawn only from digits and capitals without 0, O, 1, I and L.
* Step 2 names the same reference, and keys `<case_9>` by its id.

## Reconciliation

**Run:** QA2, 2026-10-07, for change `print-case-reference-on-vault-paper`. QA1's blind pass read the Feature set, US-05, the proposal, `decisions.md` through Q7 and the durable suite with its Reconciliation stripped; it was denied every requirement. QA2 read this suite, the delta and `tech-design.md`. It is a statement, not proof.

- **Covered** - `grade10-site-vault-case-intake-US5-TC9-1` by `grade10-site-vault-case-intake-SC-19`: the requirement's *Issued with the case* names no opener, so a draft staff opened is one more case opened, and the case adds no rule
- **Carried unchanged** - `grade10-site-vault-case-intake-SC-19` to `grade10-site-vault-case-intake-SC-23` keep their durable cases under US5; the modified *Where it is read* names the signed paper, whose outcome is `grade10-site/vault/documents-and-signing`'s and is walked there and by `grade10-site-vault-e2e-US1-TC1-1`
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none
