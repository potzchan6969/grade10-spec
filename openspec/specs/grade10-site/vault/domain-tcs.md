# grade10-site/vault Cross-Feature E2E Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-vault-e2e-US1: Collector's case is known by one reference from the send to the counter

**As a** collector holding a signed paper,
**I want** the reference my send answered to be the one my paper prints and
the counter's search finds,
**so that** the paper, my letters and the console all point at one case.

<!-- trace:case id=g10.vault-domain.TC-qsi rev=1 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1,g10.vault-documents-and-signing.SC-a2s,g10.vault-documents-and-signing.SC-8ct,g10.vault-documents-and-signing.SC-08p -->
### grade10-site-vault-e2e-US1-TC1-1: The sent reference is printed on the signed paper and finds the case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-05, grade10-site-vault-documents-and-signing-US-07, grade10-site-vault-documents-and-signing-US-08

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's storage-lane request, sent, its send answering `<reference_1>`.
* `<case_1>` is accepted and ready to prepare, naming a shop.
* `<collector email>` is the collector's mailbox, which the tester reads.

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Open the letter the send brought to `<collector email>`.
3. As admin(staff), click Prepare documents on the Documents tab of <grade10 admin vault case page url> for `<case_1>`.
4. As the collector, open `<the vault signing link>` for the packet on the counter iPad.
5. Turn every page of the custody agreement, tick both consents, type `<the case's verified legal name>` and sign.
6. Ask for the collector's own read of `<case_1>` and take the sealed custody agreement.
7. As admin(holds vault:read), type the reference the sealed agreement prints into the search on <grade10 admin vault queue url>.
8. Click the case the search returns.

**Expected Results:**

* Step 1 names `<reference_1>`.
* Step 2's letter names `<reference_1>`.
* Step 6's agreement names the case as `<reference_1>` in its facts and its footer, and prints the case id nowhere.
* Step 6's sealed copy ends on a certificate reading `Case: <reference_1>`.
* Step 7 returns `<case_1>` alone.
* Step 8 opens `<case_1>`'s page, its address keyed by the case id.

## Reconciliation

**Run:** QA2, 2026-10-07, for change `print-case-reference-on-vault-paper`. QA2 read this suite against both deltas. It is a statement, not proof.

- **Covered** - `grade10-site-vault-e2e-US1-TC1-1` by `grade10-site-vault-case-intake-SC-19` and `grade10-site-vault-case-intake-SC-23` for the reference the send answers, `grade10-site-vault-documents-and-signing-SC-39` and `grade10-site-vault-documents-and-signing-SC-43` for the sealed agreement, and `grade10-site-vault-documents-and-signing-SC-41` for the search; step 6's "prints the case id nowhere" reads the certificate too, which Q8 settles
- **Rejected** - none
- **Contradicted** - none
