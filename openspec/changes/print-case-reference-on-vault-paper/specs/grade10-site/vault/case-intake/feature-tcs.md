# grade10-site/vault/case-intake Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-vault-case-intake-US5: Collector gets a reference they can say and type

**As a** collector,
**I want** a short reference for my case,
**so that** I can read it out at the counter and type it as the transfer
reference at my bank.

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
