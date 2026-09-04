# grade10-site/e-kyc/hosted-verification Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-04, tcs-rules r2

## grade10-site-e-kyc-hosted-verification-US1: Collector verifies their identity before travelling to the store

**As a** collector who has booked a vault visit,
**I want** to prove who I am on my own phone before I travel,
**so that** my appointment is about my card rather than my passport, and a
document problem reaches me while I can still do something about it.

### grade10-site-e-kyc-hosted-verification-US1-TC1-1: Approved hosted check verifies the case before the visit

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
`<a case awaiting a check>` has asked for an identity check and its user holds `<the invitation link>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case awaiting a check>` | A pre-custody vault case with no verified identity and a check in Invited |
| `<the invitation link>` | The invitation issued for that check |

**Steps:**

1. Open `<the invitation link>` as the user.
2. Complete the provider's check with a valid document.
3. Read `<a case awaiting a check>` as the admin once the verdict lands.

**Expected Results:**

* The case holds a verified identity, and holds it before the visit.
* The identity names the provider that performed the check.
* No Grade10 surface asked for the document number, its expiry, or an image of it.

### grade10-site-e-kyc-hosted-verification-US1-TC2-1: Invitation opens the check it was issued for

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
`<a case awaiting a check>` and a second pre-custody case each hold a check in Invited, issued to different users.

**Steps:**

1. Open `<the invitation link>` on the first device to use it.
2. Read which case and which person the check that opens belongs to.
3. Vary every value the invitation carries and open it again.

**Expected Results:**

* The check that opens is the one raised for `<a case awaiting a check>`.
* Nothing supplied selects the second case or the second person.

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
`<the invitation link>` has already been opened on one device.

**Steps:**

1. Open `<the invitation link>` on a second device.
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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-e-kyc-hosted-verification-US-01

**Pre-conditions:**
`<a case awaiting a check>` holds a check in Invited and its user holds `<the invitation link>`.

**Steps:**

1. Open `<the invitation link>` and let it hand the user on to the provider.
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
`<a case awaiting a check>` holds a check in Invited.

**Steps:**

1. Ask for a check on that case again.
2. Ask for a check on that case twice at the same moment.
3. Read the checks the case holds.

**Expected Results:**

* One check exists on the case.
* Both requests answer with that check.
* The user holds one working invitation.

### grade10-site-e-kyc-hosted-verification-US1-TC6-1: Unproven verdict changes nothing and is not stored

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
`<a case awaiting a check>` holds a check in Submitted.

Runs once per row of **Test data**.

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

### grade10-site-e-kyc-hosted-verification-US1-TC7-1: Verdict naming a check nobody raised creates nothing

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
No check exists under the provider identifier the verdict names.

**Steps:**

1. Deliver a provable verdict naming that identifier.
2. Read what the run created and what it recorded.

**Expected Results:**

* Nothing is created.
* The attempt is recorded as rejected.

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
An approved verdict for `<a case awaiting a check>` has already been applied, and a signing packet was voided when it bound.

**Steps:**

1. Deliver the same verdict again.
2. Deliver it once more under a different delivery.
3. Read the check, the identities on file, and the case's packets.

**Expected Results:**

* The check stays Approved.
* One verified identity exists and the case's identity is unchanged.
* No packet is voided a second time.

### grade10-site-e-kyc-hosted-verification-US1-TC9-1: Verdict for a check that is no longer live binds nothing

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
`<a case awaiting a check>` holds a check that has been withdrawn, superseded, or decided.

Runs once per row of **Test data**.

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
`<a case awaiting a check>` holds a check in Submitted.

Runs once per row of **Test data**.

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

---

## grade10-site-e-kyc-hosted-verification-US2: Collector falls back to the counter when the hosted check does not complete

**As a** collector whose check ran out, was refused, or never suited me,
**I want** the shop to check my document in front of me,
**so that** a check I could not finish costs me nothing but the counter's own
minute.

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
`<the invitation link>` names a check that has been decided.

**Steps:**

1. Open `<the invitation link>` again.
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
`<the invitation link>` is past its life.

**Steps:**

1. Open `<the invitation link>`.
2. Read what the page says to do next.

**Expected Results:**

* The invitation is refused as expired.
* The page says how to be invited again.

### grade10-site-e-kyc-hosted-verification-US2-TC3-1: Check that runs out of time expires

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
`<a case awaiting a check>` holds a check in the state named by the row.

Runs once per row of **Test data**.

**Test data:**

| Check state | Life that runs out | Outcome |
| --- | --- | --- |
| Invited, never opened | `<invitation life>` | Expired; no verified identity |
| Started, never finished | `<started check life>` | Expired; the case can be invited again |

**Steps:**

1. Let the life in the row run out.
2. Read the check's state.
3. Read whether the case can be invited again.

**Expected Results:**

* The check is Expired.
* The outcome is the one the row names.

### grade10-site-e-kyc-hosted-verification-US2-TC4-1: Decided check does not move again

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
`<a case awaiting a check>` holds a check in Approved or Declined.

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
`<a case awaiting a check>` holds a live check and its user holds `<the invitation link>`.

**Steps:**

1. Withdraw the live check.
2. Ask for a new check on that case.
3. Open `<the invitation link>`.
4. Open the invitation the new check issued.

**Expected Results:**

* The old invitation starts no check.
* The new invitation does.

### grade10-site-e-kyc-hosted-verification-US2-TC6-1: Collector returning mid-check carries on where they were

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
`<a case awaiting a check>` holds a check in Started, opened on one device and not finished.

**Steps:**

1. Open `<the invitation link>` again on the device that started the check.
2. Read where the provider's check resumes.

**Expected Results:**

* The provider's check continues rather than starting over.

### grade10-site-e-kyc-hosted-verification-US2-TC7-1: Declined collector is told what to do and not why

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
`<a case awaiting a check>` holds a check in Declined.

**Steps:**

1. Open `<the invitation link>`.
2. Read everything the page shows.

**Expected Results:**

* The page says the check did not pass.
* The page says the document can be checked at the store.
* The page shows no reason it did not pass.

### grade10-site-e-kyc-hosted-verification-US2-TC8-1: Counter check withdraws a live hosted check

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
`<a case awaiting a check>` holds a check in Invited, Started, Submitted or Stalled, and its user holds `<the invitation link>`.

**Steps:**

1. Record an identity check at the counter as the admin, with the document in hand.
2. Read the case's identity and the hosted check's state.
3. Open `<the invitation link>`.

**Expected Results:**

* The case holds the identity the admin recorded.
* The hosted check is Withdrawn.
* The old invitation starts no check.

### grade10-site-e-kyc-hosted-verification-US2-TC9-1: Counter check after a decline is recorded as an override

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
`<a case awaiting a check>` holds a check in Declined, and the admin holds `vault:approve`.

**Steps:**

1. Record an identity check at the counter, giving a reason.
2. Read the case's identity and what the case shows beside it.

**Expected Results:**

* The check is accepted on the case's own rules.
* It is recorded as an override carrying the reason and the admin who gave it.
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
The verification provider is unreachable, and `<a case awaiting a check>` has a user arriving with no verified identity.

**Steps:**

1. Record an identity check at the counter as the admin.
2. Read the case's identity and its status.

**Expected Results:**

* The check is recorded and the case proceeds.
* No call to the provider was required for it to succeed.

### grade10-site-e-kyc-hosted-verification-US2-TC11-1: Verdict that never arrives leaves the check stalled

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
`<a case awaiting a check>` holds a check in Submitted, and the provider is stubbed to send no verdict.

**Steps:**

1. Let `<the usual verdict time>` pass.
2. Read the check's state and what the case shows.
3. Read what the run read back from the provider.

**Expected Results:**

* The check is Stalled.
* The case shows it as stalled rather than as arriving.
* The check is read back from the provider and settled from what it says.
