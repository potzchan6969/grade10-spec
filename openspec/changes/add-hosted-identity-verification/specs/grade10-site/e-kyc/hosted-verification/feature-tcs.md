# grade10-site/e-kyc/hosted-verification Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-09-04, tcs-rules r2

## grade10-site-e-kyc-hosted-verification-US1: Collector verifies their identity before travelling to the store

**As a** collector who has booked a vault visit,
**I want** to prove who I am on my own phone before I travel,
**so that** my appointment is about my card rather than my passport, and a
document problem reaches me while I can still do something about it.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-prt rev=2 covers=g10.e-kyc-hosted-verification.SC-a2i,g10.e-kyc-hosted-verification.SC-jav,g10.e-kyc-hosted-verification.SC-5n5,g10.e-kyc-hosted-verification.SC-1ve,g10.e-kyc-hosted-verification.SC-i84,g10.e-kyc-hosted-verification.SC-vvo,g10.e-kyc-hosted-verification.SC-lz8,g10.e-kyc-hosted-verification.SC-lv9,g10.e-kyc-hosted-verification.SC-14n,g10.e-kyc-hosted-verification.SC-bhk,g10.e-kyc-hosted-verification.SC-1en,g10.e-kyc-hosted-verification.SC-6w3,g10.e-kyc-hosted-verification.SC-csg -->
### grade10-site-e-kyc-hosted-verification-US1-TC1-2: Approved hosted check verifies the case before the visit

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* `<a case in invited>` has asked for an identity check.
* The user holds `<the invited invitation>` and has not opened it.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case in invited>` | A pre-custody vault case with no verified identity, its hosted check in Invited |
| `<the invited invitation>` | The invitation issued for `<a case in invited>`'s check, never opened |

**Steps:**

1. Open `<the invited invitation>` as the user.
2. Read what the user's verification surface asks for.
3. Complete the provider's check with a valid document.
4. Read `<a case in invited>` as the admin once the verdict lands.

**Expected Results:**

* The case holds a verified identity, and holds it before the visit.
* The identity names the provider that performed the check.
* The user's verification surface asks for no document number, no expiry and no image of the document.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-urm rev=2 covers=g10.e-kyc-hosted-verification.SC-a2i,g10.e-kyc-hosted-verification.SC-jav,g10.e-kyc-hosted-verification.SC-5n5,g10.e-kyc-hosted-verification.SC-1ve,g10.e-kyc-hosted-verification.SC-i84,g10.e-kyc-hosted-verification.SC-vvo,g10.e-kyc-hosted-verification.SC-lz8,g10.e-kyc-hosted-verification.SC-lv9,g10.e-kyc-hosted-verification.SC-14n,g10.e-kyc-hosted-verification.SC-bhk,g10.e-kyc-hosted-verification.SC-1en,g10.e-kyc-hosted-verification.SC-6w3,g10.e-kyc-hosted-verification.SC-csg -->
### grade10-site-e-kyc-hosted-verification-US1-TC2-2: Invitation opens the check it was issued for

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* `<a case in invited>` and `<a second case in invited>` each hold a check in Invited, issued to different users.
* The user holds `<the invited invitation>`, and no device has opened it.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case in invited>` | A pre-custody vault case with no verified identity, its hosted check in Invited |
| `<a second case in invited>` | A second pre-custody vault case, its hosted check in Invited for another user |
| `<the invited invitation>` | The invitation issued for `<a case in invited>`'s check, never opened |

**Steps:**

1. Open `<the invited invitation>` on the first device to use it.
2. Read which case and which person the check that opens belongs to.

**Expected Results:**

* The check that opens is the one raised for `<a case in invited>`.
* The surface offers nothing that selects `<a second case in invited>` or its user.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-1gc rev=1 covers=g10.e-kyc-hosted-verification.SC-a2i,g10.e-kyc-hosted-verification.SC-jav,g10.e-kyc-hosted-verification.SC-5n5,g10.e-kyc-hosted-verification.SC-1ve,g10.e-kyc-hosted-verification.SC-i84,g10.e-kyc-hosted-verification.SC-vvo,g10.e-kyc-hosted-verification.SC-lz8,g10.e-kyc-hosted-verification.SC-lv9,g10.e-kyc-hosted-verification.SC-14n,g10.e-kyc-hosted-verification.SC-bhk,g10.e-kyc-hosted-verification.SC-1en,g10.e-kyc-hosted-verification.SC-6w3,g10.e-kyc-hosted-verification.SC-csg -->
### grade10-site-e-kyc-hosted-verification-US1-TC12-1: Tampered invitation values open no other check

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* A pre-custody vault case holds a check in Invited, its invitation issued to one user.
* A second pre-custody vault case holds a check in Invited, its invitation issued to another user.

**Test data:**

| Value tampered with | Outcome |
| --- | --- |
| The case reference in the first invitation, replaced with the second case's | No check opens for either case |
| The first invitation's secret, replaced with one derived from the second case's reference | No check opens for either case |

**Steps:**

1. Replace the value the row names in the first invitation.
2. Open the tampered invitation on the first device to use it.
3. Read which check, case and person opened.

**Expected Results:**

* No check opens for the tampered invitation.
* Nothing supplied selects the second case or the second user.

---

## grade10-site-e-kyc-hosted-verification-US2: Collector falls back to the counter when the hosted check does not complete

**As a** collector whose check ran out, was refused, or never suited me,
**I want** the shop to check my document in front of me,
**so that** a check I could not finish costs me nothing but the counter's own
minute.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-arb rev=1 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC6-1: User returning mid-check carries on where they were

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* `<a case in started>` holds a check in Started, opened on one device and not finished.
* The user holds `<the started invitation>` on the device that started it.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case in started>` | A pre-custody vault case whose hosted check is Started, opened on one device and not finished |
| `<the started invitation>` | The invitation issued for `<a case in started>`'s check, opened on that device |

**Steps:**

1. Open `<the started invitation>` again on the device that started the check.
2. Read where the provider's check resumes.

**Expected Results:**

* The invitation opens on the device that started the check.
* The provider's check continues rather than starting over.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-uv9 rev=1 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC14-1: Invitation says what to do next in every state

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* A pre-custody vault case holds a hosted check in the state named by the row.
* The user holds the invitation issued for that check.

**Test data:**

| Check state | What the user is told to do |
| --- | --- |
| Invited | Start the check |
| Started | Carry on where they left off |
| Submitted | Wait; nothing is needed from them |
| Stalled | Wait; nothing is needed from them |
| Approved | Nothing further; their identity is on file |
| Declined | Bring the document to the store — ❓ `TBC`, the words await Compliance |
| Expired | Ask to be invited again |
| Withdrawn | Ask to be invited again |

**Steps:**

1. Open the invitation as the user.
2. Read the state the page shows.
3. Read what the page says to do next.

**Expected Results:**

* The page shows the state the row names.
* The page says what to do next, as the row names it.
* The page names no identity field.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-vai rev=2 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC8-2: Counter check withdraws a live hosted check

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* `<a case with a live check>` is pre-custody and holds a live check.
* The user holds `<the live check's invitation>`.
* The admin holds `vault:operate` and is on `<grade10 admin vault case url>` for that case.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with a live check>` | A pre-custody vault case whose hosted check is Invited, Started, Submitted or Stalled |
| `<the live check's invitation>` | The invitation issued for `<a case with a live check>`'s check |

**Steps:**

1. Record an identity check at the counter with the document in hand.
2. Read the case's identity and the hosted check's state.
3. Open `<the live check's invitation>` as the user.

**Expected Results:**

* The case holds the identity the admin recorded.
* The hosted check is Withdrawn.
* The old invitation starts no check.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-k6a rev=2 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC9-2: Counter check after a decline is recorded as an override

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* `<a case declined>` is pre-custody and holds a check in Declined.
* The admin holds `vault:operate` and is on `<grade10 admin vault case url>` for that case.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case declined>` | A pre-custody vault case whose hosted check is Declined |
| `<the override reason>` | The reason the admin gives for checking the document at the counter |

**Steps:**

1. Record an identity check at the counter, giving no reason.
2. Record the same check again, giving `<the override reason>`.
3. Read the case's identity and what the case shows beside it.

**Expected Results:**

* The check offered with no reason is refused.
* The check carrying `<the override reason>` is accepted on the case's own rules, and is recorded as an override naming the admin who gave it.
* The declined check stays on record beside it.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-mi0 rev=1 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC10-1: Provider outage does not stop a visit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* The verification provider is unreachable.
* `<a case with no check>` has a user arriving with no verified identity.
* The admin holds `vault:operate` and is on `<grade10 admin vault case url>` for that case.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with no check>` | A pre-custody vault case with no verified identity and no live check |

**Steps:**

1. Record an identity check at the counter with the document in hand.
2. Read the case's identity and its status.
3. Read the calls the run made to the provider.

**Expected Results:**

* The check is recorded and the case proceeds.
* No call to the provider was required for it to succeed.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-y9g rev=1 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC7-1: Declined user is told what to do and not why

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* `<a case declined>` holds a check in Declined.
* The user holds `<the declined invitation>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case declined>` | A pre-custody vault case whose hosted check is Declined |
| `<the declined invitation>` | The invitation issued for `<a case declined>`'s check |

**Steps:**

1. Open `<the declined invitation>` as the user.
2. Read everything the page shows.

**Expected Results:**

* The page says the check did not pass.
* The page says the document can be checked at the store.
* The page shows no reason it did not pass.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-ian rev=1 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC1-1: Decided invitation opens to state and nothing else

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* `<a case decided approved>` holds a check that has been decided.
* The user holds `<the decided invitation>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case decided approved>` | A pre-custody vault case whose hosted check is Approved, its verdict applied and its identity bound |
| `<the decided invitation>` | The invitation issued for `<a case decided approved>`'s check |

**Steps:**

1. Open `<the decided invitation>` again.
2. Read everything the page shows.

**Expected Results:**

* No check starts.
* The page shows the state and what to do next.
* The page names no identity field and no reason.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-5f4 rev=1 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC2-1: Expired invitation is refused and says how to be invited again

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* `<the expired invitation>` was issued more than `<invitation life>` ago.
* The service clock is advanced past that life.

**Test data:**

| Field | Value |
| --- | --- |
| `<the expired invitation>` | The invitation issued for a check in Invited, now past its life |
| `<invitation life>` | The life an invitation is issued with — ❓ `TBC`, awaiting Product |

**Steps:**

1. Open `<the expired invitation>` as the user.
2. Read what the page says to do next.

**Expected Results:**

* The invitation is refused as expired.
* The page says how to be invited again.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-7lm rev=1 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC5-1: Withdrawing a check frees the case to be invited again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* `<a case with a live check>` is pre-custody and holds a live check.
* The user holds `<the live check's invitation>`.
* The admin holds `vault:operate` and is on `<grade10 admin vault case url>` for that case.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with a live check>` | A pre-custody vault case whose hosted check is Invited, Started, Submitted or Stalled |
| `<the live check's invitation>` | The invitation issued for `<a case with a live check>`'s check |

**Steps:**

1. Withdraw the live check.
2. Ask for a new check on that case.
3. Open `<the live check's invitation>` as the user.
4. Open the invitation the new check issued.

**Expected Results:**

* The old invitation starts no check.
* The new invitation starts one.

<!-- trace:case id=g10.e-kyc-hosted-verification.TC-lzi rev=1 covers=g10.e-kyc-hosted-verification.SC-8uf,g10.e-kyc-hosted-verification.SC-36d,g10.e-kyc-hosted-verification.SC-wu9,g10.e-kyc-hosted-verification.SC-fdu,g10.e-kyc-hosted-verification.SC-jan,g10.e-kyc-hosted-verification.SC-jz2,g10.e-kyc-hosted-verification.SC-hmw,g10.e-kyc-hosted-verification.SC-nym,g10.e-kyc-hosted-verification.SC-fuz,g10.e-kyc-hosted-verification.SC-y6x,g10.e-kyc-hosted-verification.SC-qkz,g10.e-kyc-hosted-verification.SC-4i1,g10.e-kyc-hosted-verification.SC-lod,g10.e-kyc-hosted-verification.SC-imv -->
### grade10-site-e-kyc-hosted-verification-US2-TC13-1: Admin clears a check that is going nowhere

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* `<a case with a live check>` is pre-custody and holds a live check.
* The user holds `<the live check's invitation>`.
* The admin holds `vault:operate` and is on `<grade10 admin vault case url>` for that case.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with a live check>` | A pre-custody vault case whose hosted check is Invited, Started, Submitted or Stalled |
| `<the live check's invitation>` | The invitation issued for `<a case with a live check>`'s check |

**Steps:**

1. Withdraw the live check.
2. Read the check's state and the case's live check.
3. Open `<the live check's invitation>` as the user.

**Expected Results:**

* The check is Withdrawn.
* The case holds no live check.
* The invitation starts no check.
