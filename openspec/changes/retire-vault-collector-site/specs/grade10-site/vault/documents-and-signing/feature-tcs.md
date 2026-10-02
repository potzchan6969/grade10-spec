# grade10-site/vault/documents-and-signing Test Cases

**Status:** pending-review

## grade10-site-vault-documents-and-signing-US5: Collector downloads every document they ever signed

**As a** collector,
**I want** every sealed document from every case in one download, each with
its fingerprint,
**so that** I hold my own record without opening each case in turn.

### grade10-site-vault-documents-and-signing-US5-TC2-1: Download all is absent when nothing has been signed yet

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**

* A collector on <a collector account with no signed documents> is on <the collector's Your data page>.

**Steps:**

1. Look for Download all.

**Expected Results:**

* Download all is absent; nothing has been signed yet.

---

### grade10-site-vault-documents-and-signing-US5-TC3-1: The download shows a pending state while in flight

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* A collector holding <every case whose documents are sealed> is on <the collector's Your data page>.

**Steps:**

1. Click Download all.

**Expected Results:**

* Download all shows pending while the file is being built.

---

### grade10-site-vault-documents-and-signing-US5-TC4-1: A failed download surfaces its error and can be retried

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-documents-and-signing-US-05

**Pre-conditions:**

* A collector holding <every case whose documents are sealed> is on <the collector's Your data page>, with the download stubbed to fail.

**Steps:**

1. Click Download all.

**Expected Results:**

* An error line appears under the button; no file downloads.
* Download all is available again to retry.
