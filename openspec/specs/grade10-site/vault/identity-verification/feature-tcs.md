# grade10-site/vault/identity-verification Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-10-16, tcs-rules r6

## Background

Every case below belongs to `customer(collector)`'s account, and the brand's own calendar day is Hong Kong's (`HKT`). A document's facts are typed exactly as the **Test data** gives them.

## grade10-site-vault-identity-verification-US1: Operator checks who is standing at the counter

**As a** member of shop staff,
**I want** to record the customer's document once, with a photograph of it,
**so that** the agreement they sign names the person we actually checked.

<!-- trace:case id=g10.vault-identity-verification.TC-anz rev=1 covers=g10.vault-identity-verification.SC-yx5 -->
### grade10-site-vault-identity-verification-US1-TC1-1: A check recorded on a case being valued binds and shows the verified name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` is being valued and carries no identity check.

**Test data:**

| Field | Value |
| --- | --- |
| Legal name | CHAN Tai Man |
| Date of birth | 1990-04-12 |
| Document type | Passport |
| Document number | `<document_1>` |
| Expiry | `<today>` plus 2 years |
| Photograph | `<photo_1>`, a JPEG of the document within the identity store's limits |
| Method | In person |

**Steps:**

1. Open the identity check on `<case_1>`.
2. Enter the facts from **Test data** and attach `<photo_1>`.
3. Record the check.
4. Reload `<case_1>`'s page.

**Expected Results:**

* Step 3 is accepted.
* Step 4 shows the case's identity as CHAN Tai Man, checked in person, naming the staff member who recorded it.
* The case shows one identity check.

<!-- trace:case id=g10.vault-identity-verification.TC-9rf rev=1 -->
### grade10-site-vault-identity-verification-US1-TC2-1: The check asks for the document's facts and nothing else about the person

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` is being valued and carries no identity check.

**Steps:**

1. Open the identity check on `<case_1>`.
2. Read every field the form asks for.

**Expected Results:**

* The form asks for the legal name, date of birth, document type, document number, expiry, one photograph and the method.
* The document type offers passport, national identity card, driving licence and residence permit.
* The expiry can be left as none for a document that does not expire.
* Nothing asks for an address, nationality, occupation, purpose, source of funds, or any screening.

<!-- trace:case id=g10.vault-identity-verification.TC-j5p rev=1 covers=g10.vault-identity-verification.SC-aun -->
### grade10-site-vault-identity-verification-US1-TC11-1: Every photograph download is on the case's audit trail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(shop staff holding identity read) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` carries a check with `<photo_1>`.

**Steps:**

1. Download the identity photograph.
2. Open `<case_1>`'s audit trail.

**Expected Results:**

* Step 2 shows an entry naming the staff member and the instant of the download.

---

## grade10-site-vault-identity-verification-US2: Returning customer is not asked for their passport again

**As a** collector who has used the vault before,
**I want** the check the shop already made to cover my new case,
**so that** I am not photographed a second time for the same document.

<!-- trace:case id=g10.vault-identity-verification.TC-7yx rev=1 covers=g10.vault-identity-verification.SC-h7o -->
### grade10-site-vault-identity-verification-US2-TC1-1: The last valid check binds to a new case without a photograph

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-02

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* customer(returning collector)'s previous case carries a check on `<document_1>`, expiring `<today>` plus 2 years.
* `<case_1>` is the same collector's new case, being valued, with no identity check.

**Steps:**

1. Choose to reuse the collector's last check on `<case_1>`.
2. Read `<case_1>`'s identity.

**Expected Results:**

* Step 1 asks for no photograph.
* Step 2 names the same check as the previous case.

---

## grade10-site-vault-identity-verification-US3: Operator is warned when one document is on several accounts

**As a** member of shop staff,
**I want** to be told how many other accounts hold the same document, without
being told whose,
**so that** I can ask about it at the counter without the case being blocked
and without learning about somebody else's account.

<!-- trace:case id=g10.vault-identity-verification.TC-nrj rev=1 covers=g10.vault-identity-verification.SC-6li -->
### grade10-site-vault-identity-verification-US3-TC1-1: A document held under other accounts flags the case and the binding stands

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-03

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` is being valued and carries no identity check.

**Test data:**

| Accounts already holding `<document_1>` | The case |
| --- | --- |
| None | Bound, unflagged, no staff entry |
| 2 others | Bound, flagged for the counter, with a staff-only entry reading 2 |

**Steps:**

1. Record a check on `<case_1>` for CHAN Tai Man on `<document_1>`, expiring `<today>` plus 2 years.
2. Read `<case_1>`'s page.

**Expected Results:**

* Step 1 is accepted on every row.
* Step 2 reads as the row states.

---

## grade10-site-vault-identity-verification-US4: Collector collects an item on a passport that has since lapsed

**As a** collector,
**I want** my own property back even though the document I signed under has
expired since,
**so that** the shop's own rule does not cost me the thing it is holding.

<!-- trace:case id=g10.vault-identity-verification.TC-5gc rev=1 covers=g10.vault-identity-verification.SC-zl6 -->
### grade10-site-vault-identity-verification-US4-TC1-1: A lapsed document does not hold the item at release

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-04

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>`'s item is in the vault, its agreement sealed under a check whose document expired yesterday on the shop's day.

**Steps:**

1. Prepare `<case_1>`'s release.
2. Sign the release with the collector.
3. Hand the item over.

**Expected Results:**

* Steps 1 and 2 are accepted; neither the age nor the expiry refusal is raised.
* `<case_1>` reads released.
