# grade10-site/vault/identity-verification Test Cases

**Status:** pending-review · 0/18
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
* **Layer:** e2e
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
* **Layer:** e2e
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

<!-- trace:case id=g10.vault-identity-verification.TC-53n rev=1 covers=g10.vault-identity-verification.SC-axm -->
### grade10-site-vault-identity-verification-US1-TC3-1: Recording a check again replaces the case's check

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` is being valued and carries `<check_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<check_1>` | A check for CHAN Tai Man on `<document_1>` |
| `<check_2>` | A check for CHAN Tai Man on `<document_2>`, a different passport |

**Steps:**

1. Record `<check_2>` on `<case_1>`.
2. Read `<case_1>`'s identity.
3. Ask the identity store for `<check_1>`.

**Expected Results:**

* Step 2 names `<check_2>` and only `<check_2>`.
* Step 3 finds no `<check_1>`: the displaced check is discarded.

<!-- trace:case id=g10.vault-identity-verification.TC-p4h rev=1 covers=g10.vault-identity-verification.SC-h78 -->
### grade10-site-vault-identity-verification-US1-TC4-1: A case whose item is in the vault takes no new check

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.

**Test data:**

| `<case_1>` is | The answer |
| --- | --- |
| In the vault | Refused, naming that the case is past custody |
| Released | Refused, naming that the case is past custody |

**Steps:**

1. Record a check on `<case_1>` for CHAN Tai Man, born 1990-04-12, on passport `<document_1>` expiring `<today>` plus 2 years, with `<photo_1>`, in person.
2. Read `<case_1>`'s identity.

**Expected Results:**

* Step 1 answers as the row states.
* Step 2 shows the identity the case already had, unchanged.

<!-- trace:case id=g10.vault-identity-verification.TC-1tc rev=1 covers=g10.vault-identity-verification.SC-vts,g10.vault-identity-verification.SC-j0w -->
### grade10-site-vault-identity-verification-US1-TC5-1: Somebody under eighteen on the shop's day is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` is being valued and carries no identity check.

**Test data:**

| Date of birth | On the shop's day | The answer |
| --- | --- | --- |
| `<today>` less 18 years plus 1 day | 17, the birthday is tomorrow | Refused by name: under 18 |
| `<today>` less 18 years | 18 today at the shop; recorded before 08:00 HKT, while Coordinated Universal Time is still on yesterday | Accepted |
| `<today>` less 30 years | 30 | Accepted |

**Steps:**

1. Record a check on `<case_1>` for CHAN Tai Man on `<document_1>`, expiring `<today>` plus 2 years, with the row's date of birth.
2. Read `<case_1>`'s identity.

**Expected Results:**

* Step 1 answers as the row states.
* A refused row leaves `<case_1>` with no identity check.

<!-- trace:case id=g10.vault-identity-verification.TC-8iv rev=1 -->
### grade10-site-vault-identity-verification-US1-TC6-1: An expired document is refused when the check is recorded

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` is being valued and carries no identity check.

**Test data:**

| Expiry | The answer |
| --- | --- |
| `<today>` less 1 day | Refused by name: the document has expired |
| `<today>` | Accepted: the document is valid through the shop's day |
| None | Accepted |

**Steps:**

1. Record a check on `<case_1>` for CHAN Tai Man, born 1990-04-12, on `<document_1>`, with the row's expiry.
2. Read `<case_1>`'s identity.

**Expected Results:**

* Step 1 answers as the row states.
* A refused row leaves `<case_1>` with no identity check.

<!-- trace:case id=g10.vault-identity-verification.TC-3n2 rev=1 covers=g10.vault-identity-verification.SC-p6q -->
### grade10-site-vault-identity-verification-US1-TC7-1: A document that lapsed after the check stops the packet

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` holds an accepted offer and carries a check whose document expired yesterday on the shop's day.
* No packet has been prepared for `<case_1>`.

**Steps:**

1. Prepare `<case_1>`'s packet for signature.

**Expected Results:**

* Step 1 is refused by name: the document has expired.
* No packet exists for `<case_1>`.

<!-- trace:case id=g10.vault-identity-verification.TC-wjl rev=1 covers=g10.vault-identity-verification.SC-5by -->
### grade10-site-vault-identity-verification-US1-TC8-1: The case holds a reference and nothing about the person

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` carries a check for CHAN Tai Man on `<document_1>`.

**Steps:**

1. Read `<case_1>`'s own record from the vault, not the identity store.
2. Read the check `<case_1>` names from the identity store.

**Expected Results:**

* Step 1 names the check and carries no name, birth date or document number.
* Step 2 holds the name, birth date, type, expiry, photograph and the number masked; the raw `<document_1>` appears nowhere.

<!-- trace:case id=g10.vault-identity-verification.TC-ntj rev=1 -->
### grade10-site-vault-identity-verification-US1-TC9-1: A check is reached by its account's erasure

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* customer(collector) owns `<case_1>`, which carries a check, and the case's retention has run out.
* An erasure request for the collector's account has been accepted.

**Steps:**

1. Run the erasure for the collector's account.
2. Ask the identity store for the check `<case_1>` named.

**Expected Results:**

* Step 2 finds no check, photograph or masked number for that account.

<!-- trace:case id=g10.vault-identity-verification.TC-y7x rev=1 covers=g10.vault-identity-verification.SC-nov -->
### grade10-site-vault-identity-verification-US1-TC10-1: Reading the identity photograph needs its own grant

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-01

**Pre-conditions:**

* `<case_1>` carries a check with `<photo_1>`.
* admin(`<grant>`) is signed in to <grade10 admin url>.

**Test data:**

| `<grant>` | The answer |
| --- | --- |
| Vault operate, without identity read | Refused by name |
| Vault operate and identity read | The photograph downloads |

**Steps:**

1. Ask for `<case_1>`'s identity photograph.

**Expected Results:**

* Step 1 answers as the row states.

<!-- trace:case id=g10.vault-identity-verification.TC-j5p rev=1 covers=g10.vault-identity-verification.SC-aun -->
### grade10-site-vault-identity-verification-US1-TC11-1: Every photograph download is on the case's audit trail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
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
* **Layer:** e2e
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

<!-- trace:case id=g10.vault-identity-verification.TC-6vj rev=1 covers=g10.vault-identity-verification.SC-ybg -->
### grade10-site-vault-identity-verification-US2-TC2-1: A reused check is judged again at the moment of reuse

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-02

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` is the collector's new case, being valued, with no identity check.

**Test data:**

| The collector's last check | The answer |
| --- | --- |
| Its document expired yesterday on the shop's day | Refused by name: the document has expired |
| Its document expires `<today>` plus 2 years | Bound to `<case_1>` |

**Steps:**

1. Reuse the collector's last check on `<case_1>`.
2. Read `<case_1>`'s identity.

**Expected Results:**

* Step 1 answers as the row states.
* A refused row leaves `<case_1>` with no identity check.

<!-- trace:case id=g10.vault-identity-verification.TC-hjs rev=1 -->
### grade10-site-vault-identity-verification-US2-TC3-1: A collector with no earlier check has nothing to reuse

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-02

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` is being valued and the collector has no earlier check.

**Steps:**

1. Ask to reuse the collector's last check on `<case_1>`.

**Expected Results:**

* Step 1 is refused by name: there is no check to reuse.
* `<case_1>` carries no identity check.

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
* **Layer:** e2e
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

<!-- trace:case id=g10.vault-identity-verification.TC-m7t rev=1 covers=g10.vault-identity-verification.SC-14d -->
### grade10-site-vault-identity-verification-US3-TC2-1: The duplicate flag never names the other accounts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-verification-US-03

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` is flagged because `<document_1>` is held under 2 other accounts.

**Steps:**

1. Read `<case_1>`'s page, its staff-only entries and its audit trail.
2. Read `<case_1>` through the vault's operator API.

**Expected Results:**

* Every surface carries the count, 2.
* No surface names, links or identifies either other account.

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
* **Layer:** e2e
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

<!-- trace:case id=g10.vault-identity-verification.TC-fnm rev=1 covers=g10.vault-identity-verification.SC-k6o -->
### grade10-site-vault-identity-verification-US4-TC2-1: A case carrying a sealed agreement keeps the identity it was signed under

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-verification-US-04

**Pre-conditions:**

* admin(shop staff holding the vault operate grant) is on `<case_1>`'s page in <grade10 admin url>.
* `<case_1>` carries a sealed agreement executed under `<check_1>`.

**Steps:**

1. Record a new check on `<case_1>` for CHAN Tai Man on `<document_2>`.
2. Read `<case_1>`'s identity.

**Expected Results:**

* Step 1 is refused by name: the case holds sealed evidence.
* Step 2 still names `<check_1>`.
