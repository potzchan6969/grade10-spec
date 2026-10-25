# grade10-site/vault/identity-verification Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* Every case belongs to customer(collector)'s account and is read on its console case page by admin(holds `vault:operate`) unless a step names `kyc:read`. The shop's calendar day is Hong Kong's.
* A check records the legal name, date of birth, document type and number, expiry, one photograph and the method; `<passport>` is CHAN Tai Man, born 1990-04-12, passport `<document_1>`, expiring in two years, with a JPEG photograph.

## Walk 1: Check a customer, then reuse the check

Starting state:

- admin(holds `vault:operate`) on a case being valued with no check; the collector has no earlier check.

Shared test data:

| Field | Value |
| --- | --- |
| passport | as in the Background |

### Route

1. Record `<passport>` on the case, in person.
   - The case names CHAN Tai Man, checked in person. `g10.vault-identity-verification.US1-TC1`
2. Open the same collector's next case, being valued, and reuse the last check.
   - Bound, with no photograph asked. `g10.vault-identity-verification.US2-TC1`

## g10.vault-identity-verification.US1: Operator checks who is standing at the counter

**As a** member of shop staff,
**I want** to record the customer's document once, with a photograph of it,
**so that** the agreement they sign names the person we actually checked.

<!-- trace:case id=g10.vault-identity-verification.TC-anz rev=1 covers=g10.vault-identity-verification.SC-yx5 -->
### g10.vault-identity-verification.US1-TC1: A check recorded on a case being valued binds to it, asking only the document's facts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case being valued, with no check.

**Steps:**

1. Open the identity check, and read every field.
2. Enter `<passport>`, attach its photograph, choose In person, and record it.
3. Reload the case page.

**Expected Results:**

* Step 1 asks the legal name, date of birth, document type (passport, national identity card, driving licence or residence permit), number, expiry (which may be none), one photograph and the method, and no address, nationality, occupation, purpose, source of funds or screening.
* Step 3 names the one check, CHAN Tai Man, in person, and the staff member who recorded it; the case shows no name, birth date or document number of its own.

<!-- trace:case id=g10.vault-identity-verification.TC-p5p rev=1 -->
### g10.vault-identity-verification.US1-TC5: A person whose eighteenth birthday is today on the shop's day is an adult

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case being valued, with no check; it is 23:30 Hong Kong time, 15:30 UTC.

**Steps:**

1. Record a check for a person born on this day eighteen years ago.

**Expected Results:**

* It is accepted and binds to the case.

<!-- trace:case id=g10.vault-identity-verification.TC-9rf rev=1 -->
### g10.vault-identity-verification.US1-TC4: A check is refused for a minor, an item already in custody, or a document that lapsed before signing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What it refuses

**Pre-conditions:**

* admin(holds `vault:operate`) is on `<case>`.

**Test data:**

| `<case>` | `<attempt>` | `<refusal names>` |
| --- | --- | --- |
| being valued, no check | record a check for a person whose eighteenth birthday is tomorrow on the shop's day | the person being under eighteen |
| its item in the vault | record a new check | the item being in custody |
| its check recorded on a document that has since expired, its agreement unsigned | prepare the signing packet | the document's expiry |

**Steps:**

1. Do `<attempt>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; the case's check is as it was.

<!-- trace:case id=g10.vault-identity-verification.TC-j5p rev=1 covers=g10.vault-identity-verification.SC-aun -->
### g10.vault-identity-verification.US1-TC11: The photograph opens only with the identity read, and every download is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Reading the photograph

**Pre-conditions:**

* A case carries a check with its photograph.

**Steps:**

1. As admin(holds `vault:operate`, not `kyc:read`), ask for the photograph.
2. As admin(holds `kyc:read`), download it, then open the case's audit trail.

**Expected Results:**

* Step 1 is refused, naming the missing grant.
* Step 2 downloads it; the trail names that staff member and the instant.

---

## g10.vault-identity-verification.US2: Returning customer is not asked for their passport again

**As a** collector who has used the vault before,
**I want** the check the shop already made to cover my new case,
**so that** I am not photographed a second time for the same document.

<!-- trace:case id=g10.vault-identity-verification.TC-7yx rev=1 covers=g10.vault-identity-verification.SC-h7o -->
### g10.vault-identity-verification.US2-TC1: The last valid check binds to a new case without a photograph

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

* The collector's previous case carries a check on `<document_1>`, expiring in two years; admin(holds `vault:operate`) is on their new case, being valued, with no check.

**Steps:**

1. Reuse the collector's last check, and read the case.

**Expected Results:**

* No photograph is asked; the case names the same check as the previous one.

<!-- trace:case id=g10.vault-identity-verification.TC-kmg rev=1 -->
### g10.vault-identity-verification.US2-TC2: A check whose document has since expired cannot be reused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-02

**Pre-conditions:**

* The collector's last check was on a document that expired yesterday; admin(holds `vault:operate`) is on their new case, being valued.

**Steps:**

1. Try to reuse the last check.

**Expected Results:**

* It is refused, naming the expiry; the case carries no check.

<!-- trace:case id=g10.vault-identity-verification.TC-hgk rev=1 -->
### g10.vault-identity-verification.US2-TC3: Recording a check again replaces the case's one check

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Reuse and duplicates

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case being valued that already carries a check.

**Steps:**

1. Record another check, and read the case.

**Expected Results:**

* The case carries exactly one check, the new one.

---

## g10.vault-identity-verification.US3: Operator is warned when one document is on several accounts

**As a** member of shop staff,
**I want** to be told how many other accounts hold the same document, without
being told whose,
**so that** I can ask about it at the counter without the case being blocked
and without learning about somebody else's account.

<!-- trace:case id=g10.vault-identity-verification.TC-nrj rev=1 covers=g10.vault-identity-verification.SC-6li -->
### g10.vault-identity-verification.US3-TC1: A document held under other accounts flags the case by count alone, and the check still binds

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-03

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case being valued, with no check; `<others>` already hold `<document_1>`.

**Test data:**

| `<others>` | `<case reads>` |
| --- | --- |
| no other account | bound, with no flag |
| 2 other accounts | bound, flagged for the counter, a staff-only entry reading 2 |

**Steps:**

1. Record `<passport>` on the case.
2. Read the case page, its flag, and the queue row.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<case reads>`; no other account is named anywhere.

---

## g10.vault-identity-verification.US4: Collector collects an item on a passport that has since lapsed

**As a** collector,
**I want** my own property back even though the document I signed under has
expired since,
**so that** the shop's own rule does not cost me the thing it is holding.

<!-- trace:case id=g10.vault-identity-verification.TC-5gc rev=1 covers=g10.vault-identity-verification.SC-zl6 -->
### g10.vault-identity-verification.US4-TC1: A lapsed document does not hold the item at release

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-04

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case whose item is in the vault, its agreement sealed under a document that expired yesterday on the shop's day.

**Steps:**

1. Prepare the release, sign it with the collector, and hand the item over.

**Expected Results:**

* No age or expiry refusal is raised; the case reads released.

<!-- trace:case id=g10.vault-identity-verification.TC-iwd rev=1 -->
### g10.vault-identity-verification.US4-TC2: A signed case refuses a new check and keeps the identity it was signed under

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-04

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case carrying a sealed agreement.

**Steps:**

1. Try to record another check.

**Expected Results:**

* It is refused, naming the sealed agreement; the case keeps its check.
