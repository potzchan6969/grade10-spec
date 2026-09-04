# grade10-site/e-kyc/hosted-verification Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-04, tcs-rules r2

## grade10-site-e-kyc-hosted-verification-US1: Collector verifies their identity before travelling to the store

**As a** collector who has booked a vault visit,
**I want** to prove who I am on my own phone before I travel,
**so that** my appointment is about my card rather than my passport, and a
document problem reaches me while I can still do something about it.

### grade10-site-e-kyc-hosted-verification-US1-TC1-2: Approved hosted check verifies the case before the visit

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US1-TC2-2: Invitation opens the check it was issued for

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US1-TC3-1: Second device cannot continue an invitation

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* `<a case in started>` holds a check in Started.
* `<the started invitation>` has already been opened on one device.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case in started>` | A pre-custody vault case whose hosted check is Started, opened on one device and not finished |
| `<the started invitation>` | The invitation issued for `<a case in started>`'s check, opened on that device |

**Steps:**

1. Open `<the started invitation>` on a second device.
2. Return to the first device and open it again.

**Expected Results:**

* The second device continues no check.
* The first device still continues it.

### grade10-site-e-kyc-hosted-verification-US1-TC4-1: Invitation secret is left nowhere it can be read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* `<a case in invited>` holds a check in Invited.
* The user holds `<the invited invitation>` and has not opened it.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case in invited>` | A pre-custody vault case with no verified identity, its hosted check in Invited |
| `<the invited invitation>` | The invitation issued for `<a case in invited>`'s check, never opened |

**Steps:**

1. Open `<the invited invitation>` and let it hand the user on to the provider.
2. Read the request path and the query string of every request the browser makes.
3. Read the referrer the provider receives.
4. Read the service log lines the run wrote.

**Expected Results:**

* The secret is in no request path and no query string.
* The secret is in no log line.
* The secret is in no referrer the provider receives.

### grade10-site-e-kyc-hosted-verification-US1-TC5-1: Asking twice leaves one working invitation

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* `<a case in invited>` holds a check in Invited.
* The user holds `<the invited invitation>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case in invited>` | A pre-custody vault case with no verified identity, its hosted check in Invited |
| `<the invited invitation>` | The invitation issued for `<a case in invited>`'s check, never opened |

**Steps:**

1. Ask for a check on `<a case in invited>` again.
2. Ask for a check on that case twice at the same moment.
3. Read the checks the case holds.

**Expected Results:**

* One check exists on the case.
* Both requests answer with that check.
* The user holds one working invitation.

### grade10-site-e-kyc-hosted-verification-US1-TC6-1: Unproven verdict changes nothing and is not stored

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* A pre-custody vault case holds a hosted check in Submitted.

**Test data:**

| Verdict delivered | Outcome |
| --- | --- |
| Approved, with a signature that cannot be proven | Nothing changes; the attempt is counted, not stored |
| Approved, signed for a provider environment this deployment does not serve | Nothing changes; the attempt is counted, not stored |

**Steps:**

1. Deliver the verdict in the row.
2. Read the check's state and the case's identity.
3. Read what the run recorded.

**Expected Results:**

* No check changes state.
* No verified identity is created.
* The attempt is counted rather than written to any durable record.

### grade10-site-e-kyc-hosted-verification-US1-TC7-2: Verdict naming a check nobody raised creates nothing

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
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* No check exists under `<an unraised provider identifier>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<an unraised provider identifier>` | A provider check identifier Grade10 never raised |

**Steps:**

1. Deliver a provable verdict naming `<an unraised provider identifier>`.
2. Read what the run created and what it counted.

**Expected Results:**

* Nothing is created.
* The attempt is counted as rejected.

### grade10-site-e-kyc-hosted-verification-US1-TC8-1: Repeated verdict is applied once

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
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* `<a case decided approved>` holds an approved verdict already applied.
* A signing packet on that case was voided when the verdict bound.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case decided approved>` | A pre-custody vault case whose hosted check is Approved, its verdict applied and its identity bound |

**Steps:**

1. Deliver the same verdict again.
2. Deliver it once more under a different delivery.
3. Read the check, the identities on file, and the case's packets.

**Expected Results:**

* The check stays Approved.
* One verified identity exists and the case's identity is unchanged.
* No packet is voided a second time.

### grade10-site-e-kyc-hosted-verification-US1-TC9-1: Verdict for a check that is no longer live binds nothing

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
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* A pre-custody vault case holds the check named by the row, and the verdict names that check.

**Test data:**

| Check the verdict names | Outcome |
| --- | --- |
| Withdrawn | Stays Withdrawn; nothing bound |
| Superseded by a newer check | Stays as it is; nothing bound |
| Already decided | Stays decided; nothing bound |

**Steps:**

1. Deliver an approved verdict for the check in the row.
2. Read the check's state and the case's identity.

**Expected Results:**

* The check keeps the state it held.
* No identity is bound to the case.
* Any identity the verdict created is discarded.

### grade10-site-e-kyc-hosted-verification-US1-TC10-1: Grade10's own refusals decline an approved verdict

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* A pre-custody vault case holds a hosted check in Submitted.

**Test data:**

| Verdict the provider approves | Refusal named |
| --- | --- |
| A person under 18 | Under age |
| A document whose expiry has passed | Expired document |

**Steps:**

1. Deliver the approved verdict in the row.
2. Read the check's state and the refusal shown to the admin.
3. Read the identities on file.

**Expected Results:**

* The check is Declined.
* The refusal named is the one in the row.
* No verified identity exists.

### grade10-site-e-kyc-hosted-verification-US1-TC11-1: Check that cannot be raised invites nobody and is reported

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**

* `<a case with nothing to reuse>` holds no verified identity and no live check.
* The verification provider is stubbed to refuse every request that raises a check.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with nothing to reuse>` | A pre-custody vault case with no verified identity and no earlier check to reuse |

**Steps:**

1. Ask for a check on `<a case with nothing to reuse>`.
2. Read the invitations sent and the checks the case holds.
3. Read what the admin was told.
4. Remove the provider stub and ask for a check again.

**Expected Results:**

* No invitation is sent and the case holds no live check.
* The admin is told the check could not be raised.
* Step 4 raises one check and sends one invitation.

### grade10-site-e-kyc-hosted-verification-US1-TC12-1: Tampered invitation values open no other check

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US2-TC6-1: User returning mid-check carries on where they were

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

### grade10-site-e-kyc-hosted-verification-US2-TC14-1: Invitation says what to do next in every state

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US2-TC8-2: Counter check withdraws a live hosted check

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US2-TC9-2: Counter check after a decline is recorded as an override

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US2-TC10-1: Provider outage does not stop a visit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US2-TC7-1: Declined user is told what to do and not why

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US2-TC1-1: Decided invitation opens to state and nothing else

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US2-TC2-1: Expired invitation is refused and says how to be invited again

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US2-TC3-2: Check that runs out of time expires

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* A pre-custody vault case holds a hosted check in the state named by the row.
* The service clock is advanced past the life the row names.

**Test data:**

| Check state | Life that runs out | Outcome |
| --- | --- | --- |
| Invited, never opened | `<invitation life>` — ❓ `TBC`, awaiting Product | Expired; no verified identity |
| Started, never finished | `<started check life>` — ❓ `TBC`, awaiting Product | Expired; the case can be invited again |
| Started, with less of `<invitation life>` left than `<started check life>` | `<invitation life>` — ❓ `TBC`, awaiting Product | Expired when the invitation's life runs out, before the started check's own |

**Steps:**

1. Read the check's state.
2. Read whether the case can be invited again.

**Expected Results:**

* The check is Expired.
* The outcome is the one the row names.

### grade10-site-e-kyc-hosted-verification-US2-TC11-2: Verdict that never arrives leaves the check stalled

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* A pre-custody vault case holds a hosted check in Submitted.
* The provider is stubbed to send no verdict.
* The service clock is advanced past `<the usual verdict time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<the usual verdict time>` | The time a verdict usually takes — ❓ `TBC`, awaiting Product |

**Steps:**

1. Read the check's state and what the case shows.
2. Read what the run read back from the provider.

**Expected Results:**

* The check is Stalled, not Expired.
* The case shows it as stalled rather than as arriving.
* The check is read back from the provider and settled from what it says.

### grade10-site-e-kyc-hosted-verification-US2-TC12-1: Stalled check the provider never settles expires

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* `<a case in stalled>` holds a check in Stalled whose read-back has failed throughout `<the stalled read-back period>`.
* The service clock is advanced past that period.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case in stalled>` | A pre-custody vault case whose hosted check is Stalled, its read-back failing |
| `<the stalled read-back period>` | The period a stalled read-back is given before the check expires — ❓ `TBC`, awaiting Product |

**Steps:**

1. Read the check's state.
2. Read what the case shows.
3. Ask for a check on `<a case in stalled>`.

**Expected Results:**

* The check is Expired.
* The case shows it as lapsed.
* Step 3 invites the case again.

### grade10-site-e-kyc-hosted-verification-US2-TC4-2: Decided check does not move again

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-e-kyc-hosted-verification-US-02

**Pre-conditions:**

* A pre-custody vault case holds a hosted check in the state named by the row.

**Test data:**

| Decided state | Outcome |
| --- | --- |
| Approved | Stays Approved; asking issues a new check with its own invitation |
| Declined | Stays Declined; asking issues a new check with its own invitation |

**Steps:**

1. Deliver a further verdict for that check.
2. Ask for a check on that case.
3. Read the checks the case holds.

**Expected Results:**

* The decided check stays where it is.
* Asking issues a new check with its own invitation.

### grade10-site-e-kyc-hosted-verification-US2-TC5-1: Withdrawing a check frees the case to be invited again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-e-kyc-hosted-verification-US2-TC13-1: Admin clears a check that is going nowhere

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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
