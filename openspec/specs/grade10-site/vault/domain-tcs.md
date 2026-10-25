# grade10-site/vault Cross-Feature E2E Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## g10.vault-dmn.US1: Collector's case is known by one reference from the send to the counter

**As a** collector holding a signed paper,
**I want** the reference my send answered to be the one my paper prints and
the counter's search finds,
**so that** the paper, my letters and the console all point at one case.

<!-- trace:case id=g10.vault-domain.TC-qsi rev=1 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1,g10.vault-documents-and-signing.SC-a2s,g10.vault-documents-and-signing.SC-8ct,g10.vault-documents-and-signing.SC-08p -->
### g10.vault-dmn.US1-TC1: The sent reference is printed on the signed paper and finds the case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-05, grade10-site-vault-documents-and-signing-US-07, grade10-site-vault-documents-and-signing-US-08

**Pre-conditions:**

* customer(collector) is signed in on the Grade10 site; their storage-lane request `<case>` is sent, accepted and ready to prepare, naming a shop.
* `<collector email>` is their mailbox, which the tester reads.

**Steps:**

1. As the collector, read the reference on `<case>`'s page, and open the letter the send brought.
2. As staff on the admin console, click Prepare documents on `<case>`'s Documents tab.
3. As the collector, open the signing link on the counter iPad, turn every page of the custody agreement, tick both consents, type the verified legal name and sign.
4. As the collector, download the sealed custody agreement from `<case>`'s page.
5. As staff, search the vault queue for the reference the agreement prints, and click the case found.

**Expected Results:**

* Step 1's page and letter name the same reference, `<reference>`.
* Step 4's agreement names the case as `<reference>` in its facts and its footer, ends on a certificate reading Case: `<reference>`, and prints the case id nowhere.
* Step 5 finds `<case>` alone, and opens its page, its address keyed by the case id.
