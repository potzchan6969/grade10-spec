# shared/auth/users Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## shared-auth-users-US2: Operator bans and unbans an account

**As an** operator who can ban,
**I want** a ban to stop money-moving and sign-in, and an unban to restore them,
**so that** a person who must leave cannot keep acting, and a mistaken ban is reversible.

### shared-auth-users-US2-TC1-1: Ban stops money-moving and sign-in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as an operator who holds `user:ban`. <a subject user id> is unbanned and signed in.

**Steps:**

1. Ban <a subject user id>.
2. Try a money-moving action as that person.
3. Complete a sign-in method as that person.
4. Ask a product who is calling on that person's existing session.

**Expected Results:**

* That person cannot complete a money-moving action.
* Completing a sign-in method does not sign them in.
* A product reading who is calling reports no person.

### shared-auth-users-US2-TC2-1: Unban lets the person sign in again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
<a subject user id> is banned. Signed in as an operator who can ban.

**Steps:**

1. Unban <a subject user id>.
2. Complete a sign-in method as that person.

**Expected Results:**

* That person can sign in again.

### shared-auth-users-US2-TC3-1: Caller without the ban grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as an operator who does not hold `user:ban`. <a subject user id> is unbanned.

**Steps:**

1. Try to ban <a subject user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

### shared-auth-users-US2-TC4-1: Operator cannot ban themselves

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:ban`.

**Steps:**

1. Try to ban the operator's own account.

**Expected Results:**

* The system refuses the request.
* Their account remains unbanned.

### shared-auth-users-US2-TC5-1: Support cannot ban an admin

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator whose role is `support`. <an admin user id> holds `admin`.

**Steps:**

1. Try to ban <an admin user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

### shared-auth-users-US2-TC6-1: Last admin cannot be banned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who can ban. <an admin user id> is the only account that holds `admin`.

**Steps:**

1. Try to ban <an admin user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

### shared-auth-users-US2-TC7-1: An operator's erasure filing bans the account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as an operator who holds `user:delete`. <a subject user id> holds no open erasure request and is unbanned.

**Steps:**

1. File an erasure request for <a subject user id> from the directory.
2. Complete a sign-in method as that person.

**Expected Results:**

* One open erasure request stands for that person.
* Completing a sign-in method does not sign them in.

### shared-auth-users-US2-TC8-1: Cancelling an operator's request lets the person back in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:delete`. <a subject user id> is banned by an operator's open erasure request, filed less than seven days ago, and was unbanned before it.

**Steps:**

1. Cancel that erasure request.
2. Complete a sign-in method as <a subject user id>.

**Expected Results:**

* The request closes as cancelled.
* That person can sign in again.

### shared-auth-users-US2-TC9-1: A cancel leaves a ban the filing did not apply

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
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:delete`. <a subject user id> was banned for conduct before an operator's erasure request was filed over the account, and that request is open.

**Steps:**

1. Cancel that erasure request.
2. Complete a sign-in method as <a subject user id>.

**Expected Results:**

* The account is still banned.
* Completing a sign-in method does not sign them in.

### shared-auth-users-US2-TC10-1: An erasure request over an admin is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as an operator who holds `user:delete`. <an admin user id> holds `admin` and is unbanned.

**Steps:**

1. Try to file an erasure request for <an admin user id>.

**Expected Results:**

* The system refuses the filing.
* No erasure request is open for that account.
* That person can still sign in.


### shared-auth-users-US2-TC11-1: Ban and unban are refused while an erasure request is open

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
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:ban` and `user:delete`. <a subject user id> holds the open erasure request and the standing named in **Test data**.

**Test data:**

| Request filed by | Standing | Act |
| --- | --- | --- |
| the account holder | unbanned | ban |
| an operator | banned by that filing | unban |

**Steps:**

1. Send the row's act for <a subject user id>.

**Expected Results:**

* The system refuses the act by name.
* The account's standing is unchanged.
* The erasure request is still open.

---

## shared-auth-users-US5: Account holder files their own request to be forgotten

**As an** account holder,
**I want** to file the request to be forgotten from my own account's Your data
page, and to cancel it there inside the seven days,
**so that** I need not ask an operator to file it, and can change my mind
before anything is erased.

### shared-auth-users-US5-TC1-1: Filing opens a seven-day erasure window

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. No erasure request is open for that account.

**Steps:**

1. Open Ask to be forgotten.
2. Confirm the request.

**Expected Results:**

* Step 1 opens a confirmation naming the seven-day window and that the request can be cancelled inside it.
* The account holds one open erasure request, filed today, that matures in seven days.

### shared-auth-users-US5-TC2-1: An open self-filed request leaves sign-in working

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
<a subject user id> has filed their own erasure request. The seven-day window is still open.

**Steps:**

1. Complete a sign-in method as <a subject user id>.

**Expected Results:**

* That person signs in; the open request does not block it.

### shared-auth-users-US5-TC3-1: Cancelling inside the window closes the request

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. <a subject user id> has an open self-filed erasure request, filed six days ago on the brand's own zone, so the day an erasure may run has not opened.

**Steps:**

1. Cancel the request.

**Expected Results:**

* The request no longer shows as open.
* The page offers Ask to be forgotten again.

### shared-auth-users-US5-TC4-1: A new request can be filed after cancelling

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. <a subject user id> previously filed and then cancelled an erasure request.

**Steps:**

1. Open Ask to be forgotten.
2. Confirm the request.

**Expected Results:**

* A new open erasure request is created, filed today.

### shared-auth-users-US5-TC5-1: A second filing answers the already-open request

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
<a subject user id> already has an open self-filed erasure request.

**Steps:**

1. File the request to be forgotten again.

**Expected Results:**

* No second request is created.
* The existing open request is unchanged, still maturing on its original date.

### shared-auth-users-US5-TC6-1: Cancelling with nothing open changes nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as <a subject user id>. <a subject user id> holds no open erasure request.

**Steps:**

1. Try to cancel the request to be forgotten.

**Expected Results:**

* Nothing changes.
* No erasure request exists for that account after the attempt.

### shared-auth-users-US5-TC7-1: Cancel is refused once the window has matured

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
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. <a subject user id> filed their own erasure request seven days ago on the brand's own zone, so today is the day an erasure may run.

**Steps:**

1. Try to cancel the request.

**Expected Results:**

* The page reads the request as filed, with the window passed, and offers no cancel.
* The request stays open for each product's own erasure to run.

### shared-auth-users-US5-TC8-1: An operator's filing bans and takes over the request

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
<a subject user id> has an open self-filed erasure request, inside the seven-day window. An operator holding `user:delete` files an erasure request for <a subject user id> from the directory.

**Steps:**

1. Try to complete a sign-in method as <a subject user id>.

**Expected Results:**

* The request becomes the operator's, with a ban applied.
* Completing a sign-in method does not sign <a subject user id> in.

### shared-auth-users-US5-TC9-2: A taken-over request refuses the account holder's own cancel

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
<a subject user id> filed their own erasure request, and an operator holding `user:delete` then filed over it. The seven-day window has not passed.

**Steps:**

1. Send the account holder's own cancel as <a subject user id>.

**Expected Results:**

* The system refuses the cancel.
* The request stays open, filed by the operator.

### shared-auth-users-US5-TC10-1: Closing an already-cancelled request is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `Erasure requests`

**Pre-conditions:**
<a subject user id> filed their own erasure request and cancelled it inside the window.

**Steps:**

1. Send the cancel for that same request a second time.

**Expected Results:**

* The system refuses the second close.
* The request stays cancelled, closed on the day it was first cancelled.

---

## Settled

- Once an operator's filing takes a self-filed request over, the request is the shop's: the account holder's own cancel is refused, and only the run or an operator's cancel ends it. No standing changes while an erasure request is open, so the ban that filing applied stands and the person does not reach their own data page.
- There is neither a limit nor a cool-down on filing and cancelling: a person may ask and change their mind as often as they like, one open request at a time.
- The cancel is refused from the first instant of the day an erasure may run, and the request stands until every product has erased what it holds. The guard that holds it to that day is the tech design's, raised there for engineering.

## Reconciliation

**Run:** the blind pass read this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD sections the proposal links. It was denied every `## Requirements` section, `openspec/specs/` and `openspec/changes/archive/` entirely, and `tech-design.md`. Fourteen cases came back over two journeys; the scenario pass issued `shared-auth-users-SC-34` to `shared-auth-users-SC-39` and `shared-auth-users-SC-43` to `shared-auth-users-SC-48`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-auth-users-US2-TC1-1` to `shared-auth-users-US2-TC6-1` | Carried | ban and unban behaviour the durable spec already states and this delta does not touch; the cases came across with the journey |
| `shared-auth-users-US5-TC1-1` | Joined | `shared-auth-users-SC-45` |
| `shared-auth-users-US5-TC2-1` | Joined | `shared-auth-users-SC-46` |
| `shared-auth-users-US5-TC3-1` | Joined | `shared-auth-users-SC-47` |
| `shared-auth-users-US5-TC4-1` | Joined | `shared-auth-users-SC-44` |
| `shared-auth-users-US5-TC5-1` | Joined | `shared-auth-users-SC-37` |
| `shared-auth-users-US5-TC6-1` | Joined | `shared-auth-users-SC-38` |
| `shared-auth-users-US5-TC7-1` | Joined | `shared-auth-users-SC-48`; the cancel is refused from the first instant of the day an erasure may run and the request stays open, which the author confirmed as Q50 |
| `shared-auth-users-US5-TC8-1` | Joined | `shared-auth-users-SC-36`; the take-over keeps the day an erasure may run, confirmed as Q51 |
| Raised: what the account holder sees once a filing takes their request over | Escalated, then folded, then corrected | settled as Q48 and Q65: the request is the shop's from the take-over on, and the account holder's own cancel is refused. Folded as `shared-auth-users-SC-40`. The first fold read the page after a lifted ban, which nothing reaches: no standing changes while an erasure request is open. `shared-auth-users-SC-40` now sends the own cancel instead, walked by `shared-auth-users-US5-TC9-2`, the case's version bumped because the requirement changed what it verifies |
| Raised: a limit or a cool-down on file-then-cancel cycles | Escalated, then settled | settled as Q49: there is neither. No scenario beyond `shared-auth-users-SC-44`, which already lets a new request be filed once none is open |
| Raised: the maturity guard behind the cancel | Deferred | the behaviour stands in `shared-auth-users-SC-48`; the mechanism that enforces it is the tech design's cancel binding, raised for engineering in `decisions.md` |
| `shared-auth-users-SC-43` | Case added | `shared-auth-users-US5-TC10-1`, tracing `Erasure requests`, the group the scenario serves, so the group anchor is walked |
| `shared-auth-users-SC-34` | Case added | `shared-auth-users-US2-TC7-1` |
| `shared-auth-users-SC-35` | Case added | `shared-auth-users-US2-TC8-1` |
| `shared-auth-users-SC-39` | Case added | `shared-auth-users-US2-TC9-1` |
| `shared-auth-users-SC-41` | Folded, then walked | an erasure filed over an account that holds `admin` is refused by name, as a direct ban of one is, settled as Q52; walked by `shared-auth-users-US2-TC10-1` |
| `shared-auth-users-SC-42` | Written for a shipped rule, case added | The vault walk found auth refusing a ban or an unban by name while an erasure request is open, with only the console's hidden buttons in any spec. The rule now stands in `An operator's erasure request bans the account`, and `shared-auth-users-US2-TC11-1` walks it, a row per filer |
| Design: Ask available, Ask confirmation, Ask filed, Ask cancelled, Window passed | Closed on the row | `ui-design.md` under Your data now names `shared-auth-users-SC-45`, `shared-auth-users-SC-46`, `shared-auth-users-SC-47`, `shared-auth-users-SC-44` and `shared-auth-users-SC-48`, beside the vault scenarios that state what the same rows render |

### Manual

| Manual | Why |
| --- | --- |
| `shared-auth-users-US2-TC1-1` | a person drives a money-moving action at the counter and reads the refusal; the sign-in and the who-is-calling read are scriptable |
| `shared-auth-users-US2-TC2-1` | a person completes a real sign-in method after the unban |
| `shared-auth-users-US5-TC1-1` | a person reads the confirmation: that it names the seven days and says the ask can be cancelled inside them |
| `shared-auth-users-US5-TC2-1` | a person signs in while their own request is open, through the method they would really use |
| `shared-auth-users-US5-TC3-1` | a person reads the page back to Ask available after the cancel |
| `shared-auth-users-US5-TC4-1` | a person walks the page from cancelled to a fresh ask |
| `shared-auth-users-US5-TC5-1` | a person asks a second time from the page and reads the same request back |
| `shared-auth-users-US5-TC7-1` | a person reads the window as passed and finds no cancel offered |
| `shared-auth-users-US5-TC8-1` | a person tries to sign in after the shop's filing takes the request over |
