# shared/auth/test-sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-21, tcs-rules r3.0

## shared-auth-test-sign-in-US1: The locked staging door for sign-in tests

**Walked by:** nobody on their own - a makers door for the staging Actions job; collectors walk sign-in, operators walk ban and role on the Users desk

**As an** admin,
**I want** the staging door to answer one approved workflow, act on tester addresses only, and do only the five moves,
**so that** staging auth cases finish a sign-in without a mailbox and nothing else mints a session.

<!-- trace:case id=g10.shared-test-sign-in.TC-6jb rev=1 covers=g10.shared-test-sign-in.SC-xog,g10.shared-test-sign-in.SC-gpm,g10.shared-test-sign-in.SC-sy2,g10.shared-test-sign-in.SC-57d,g10.shared-test-sign-in.SC-6c0,g10.shared-test-sign-in.SC-93o -->
### shared-auth-test-sign-in-US1-TC1-1: An approved dispatch from main is answered

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
* **Trace:** Who may call

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and holds an unused sign-in mail.

**Steps:**

1. Ask the door on `<grade10 staging site url>` for the last sign-in mail for `<tester address>`.
2. Ask the door to age that link.

**Expected Results:**

* Step 1 returns the link from that address's last sign-in mail.
* Step 2 is answered, and the link no longer signs the address in.

<!-- trace:case id=g10.shared-test-sign-in.TC-3ni rev=1 covers=g10.shared-test-sign-in.SC-xog,g10.shared-test-sign-in.SC-gpm,g10.shared-test-sign-in.SC-sy2,g10.shared-test-sign-in.SC-57d,g10.shared-test-sign-in.SC-6c0,g10.shared-test-sign-in.SC-93o -->
### shared-auth-test-sign-in-US1-TC2-1: Callers that are not the door's own workflow are refused

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
* **Trace:** Who may call

**Pre-conditions:**

* `<tester address>` is minted under `<tester domain>` and holds an unused sign-in mail.

**Test data:**

| Caller | Outcome |
| --- | --- |
| A laptop sending the same request with no run identity | refused |
| A run of `<another workflow of this repository>` | refused |
| A run in a fork of this repository | refused |
| A run in another repository | refused |

**Steps:**

1. Ask the door on `<grade10 staging site url>` for the last sign-in mail for `<tester address>` as the caller in the row.
2. Ask the door for the same mail from an approved dispatch of `<the door's workflow>` on the main branch.

**Expected Results:**

* The caller in the row is refused and gets no link.
* Step 2 returns the link, unchanged by the refused call.

<!-- trace:case id=g10.shared-test-sign-in.TC-xa3 rev=1 covers=g10.shared-test-sign-in.SC-xog,g10.shared-test-sign-in.SC-gpm,g10.shared-test-sign-in.SC-sy2,g10.shared-test-sign-in.SC-57d,g10.shared-test-sign-in.SC-6c0,g10.shared-test-sign-in.SC-93o -->
### shared-auth-test-sign-in-US1-TC3-1: The door's workflow off the main branch is refused

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
* **Trace:** Who may call

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running from a branch other than main.
* `<tester address>` is minted under `<tester domain>` and holds an unused sign-in mail.

**Steps:**

1. Ask the door on `<grade10 staging site url>` for the last sign-in mail for `<tester address>`.
2. Ask the door for the same mail from an approved dispatch of the same workflow on the main branch.

**Expected Results:**

* Step 1 is refused and gets no link.
* Step 2 returns the link.

<!-- trace:case id=g10.shared-test-sign-in.TC-fwx rev=1 covers=g10.shared-test-sign-in.SC-xog,g10.shared-test-sign-in.SC-gpm,g10.shared-test-sign-in.SC-sy2,g10.shared-test-sign-in.SC-57d,g10.shared-test-sign-in.SC-6c0,g10.shared-test-sign-in.SC-93o -->
### shared-auth-test-sign-in-US1-TC4-1: A run a pull request started is refused

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
* **Trace:** Who may call

**Pre-conditions:**

* A run of `<the door's workflow>` is started by a pull request against this repository.
* `<tester address>` is minted under `<tester domain>` and holds an unused sign-in mail.

**Steps:**

1. Ask the door on `<grade10 staging site url>` for the last sign-in mail for `<tester address>`.
2. Ask the door to prepare `<tester address>` so it holds `admin`.

**Expected Results:**

* Both moves are refused.
* The address holds no `admin` afterwards.

<!-- trace:case id=g10.shared-test-sign-in.TC-b5b rev=1 covers=g10.shared-test-sign-in.SC-xog,g10.shared-test-sign-in.SC-gpm,g10.shared-test-sign-in.SC-sy2,g10.shared-test-sign-in.SC-57d,g10.shared-test-sign-in.SC-6c0,g10.shared-test-sign-in.SC-93o -->
### shared-auth-test-sign-in-US1-TC5-1: A dispatch no reviewer approved is refused

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
* **Trace:** Who may call

**Pre-conditions:**

* A dispatch of `<the door's workflow>` on the main branch is waiting for a reviewer and has not been approved.
* `<tester address>` is minted under `<tester domain>` and holds an unused sign-in mail.

**Steps:**

1. Ask the door on `<grade10 staging site url>` for the last sign-in mail for `<tester address>` from that dispatch.
2. Have a reviewer approve the dispatch, then ask for the same mail.

**Expected Results:**

* Step 1 is refused and gets no link.
* Step 2 returns the link.

<!-- trace:case id=g10.shared-test-sign-in.TC-12e rev=1 covers=g10.shared-test-sign-in.SC-4tc,g10.shared-test-sign-in.SC-n68,g10.shared-test-sign-in.SC-y6k,g10.shared-test-sign-in.SC-wse,g10.shared-test-sign-in.SC-u90,g10.shared-test-sign-in.SC-o4r,g10.shared-test-sign-in.SC-q44,g10.shared-test-sign-in.SC-1xt,g10.shared-test-sign-in.SC-bap -->
### shared-auth-test-sign-in-US1-TC6-1: A move on an address that never signed in creates the account

Runs once per row of **Test data**.

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
* **Trace:** Testers

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and has never signed in.

**Test data:**

| Move | State after |
| --- | --- |
| Ban the address | the account exists and is banned |
| Prepare the address | the account exists and holds `admin` |

**Steps:**

1. Ask the door for the move in the row on `<tester address>`.
2. Ask `<grade10 staging site url>` for a sign-in mail for `<tester address>`.
3. Ask the door for the last sign-in mail for that address.
4. Open the link the door returns.

**Expected Results:**

* An account exists for `<tester address>` after step 1.
* It is in the state the row names.
* Step 4 is refused for the banned row and signs in holding `admin` for the prepared row.

<!-- trace:case id=g10.shared-test-sign-in.TC-z9o rev=1 covers=g10.shared-test-sign-in.SC-4tc,g10.shared-test-sign-in.SC-n68,g10.shared-test-sign-in.SC-y6k,g10.shared-test-sign-in.SC-wse,g10.shared-test-sign-in.SC-u90,g10.shared-test-sign-in.SC-o4r,g10.shared-test-sign-in.SC-q44,g10.shared-test-sign-in.SC-1xt,g10.shared-test-sign-in.SC-bap -->
### shared-auth-test-sign-in-US1-TC7-1: An address outside the tester domain is refused

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
* **Trace:** Testers

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* No account exists for the address in the row.

**Test data:**

| Address | Outcome |
| --- | --- |
| A collector's own address on another domain | refused |
| An address whose domain is a subdomain of `<tester domain>` | refused |
| An address with `<tester domain>` in its local part | refused |

**Steps:**

1. Ask the door on `<grade10 staging site url>` for the last sign-in mail for the address in the row.
2. Ask the door to ban the address in the row.

**Expected Results:**

* Both moves are refused and no link is returned.
* No account exists for that address afterwards.

<!-- trace:case id=g10.shared-test-sign-in.TC-qtf rev=1 covers=g10.shared-test-sign-in.SC-4tc,g10.shared-test-sign-in.SC-n68,g10.shared-test-sign-in.SC-y6k,g10.shared-test-sign-in.SC-wse,g10.shared-test-sign-in.SC-u90,g10.shared-test-sign-in.SC-o4r,g10.shared-test-sign-in.SC-q44,g10.shared-test-sign-in.SC-1xt,g10.shared-test-sign-in.SC-bap -->
### shared-auth-test-sign-in-US1-TC8-1: A move naming no address is refused

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
* **Trace:** Testers

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>`, holds an unused sign-in mail, is not banned and holds no `admin`.

**Test data:**

| Move | Outcome |
| --- | --- |
| Capture the last sign-in mail | refused |
| Age the unused link | refused |
| Ban the address | refused |
| Prepare the address | refused |
| Clear the sign-in limits | refused |

**Steps:**

1. Ask the door for the move in the row without naming an address.
2. Ask the door for the last sign-in mail for `<tester address>`.

**Expected Results:**

* Step 1 is refused.
* No address is read as a default: step 2 returns the same link, the address is neither banned nor holding `admin`, and the sign-in wait on that address still holds.

<!-- trace:case id=g10.shared-test-sign-in.TC-6j4 rev=1 covers=g10.shared-test-sign-in.SC-4tc,g10.shared-test-sign-in.SC-n68,g10.shared-test-sign-in.SC-y6k,g10.shared-test-sign-in.SC-wse,g10.shared-test-sign-in.SC-u90,g10.shared-test-sign-in.SC-o4r,g10.shared-test-sign-in.SC-q44,g10.shared-test-sign-in.SC-1xt,g10.shared-test-sign-in.SC-bap -->
### shared-auth-test-sign-in-US1-TC9-1: Two tester addresses differing by a plus tag stay apart

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Testers

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` and `<plus-tagged tester address>` are minted under `<tester domain>`, and both hold an unused sign-in mail, the plus-tagged one sent last.

**Steps:**

1. Ask the door for the last sign-in mail for `<tester address>`.
2. Open the link the door returns on `<grade10 staging site url>`.

**Expected Results:**

* The link differs from the one sent to `<plus-tagged tester address>`.
* The signed-in account is `<tester address>`.

<!-- trace:case id=g10.shared-test-sign-in.TC-lil rev=1 covers=g10.shared-test-sign-in.SC-4tc,g10.shared-test-sign-in.SC-n68,g10.shared-test-sign-in.SC-y6k,g10.shared-test-sign-in.SC-wse,g10.shared-test-sign-in.SC-u90,g10.shared-test-sign-in.SC-o4r,g10.shared-test-sign-in.SC-q44,g10.shared-test-sign-in.SC-1xt,g10.shared-test-sign-in.SC-bap -->
### shared-auth-test-sign-in-US1-TC10-1: A sign-in mail to a tester address is sent the ordinary way

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Testers

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>`.

**Steps:**

1. Ask `<grade10 staging site url>` for a sign-in mail for `<tester address>`.
2. Ask the door for the last sign-in mail for `<tester address>`.

**Expected Results:**

* The mail is sent the ordinary way.
* The door returns that link.
* The door neither skipped nor replaced the send.

<!-- trace:case id=g10.shared-test-sign-in.TC-x9g rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC11-1: The job captures the link and follows it into a session

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and has never signed in.

**Steps:**

1. Ask `<grade10 staging site url>` for a sign-in mail for `<tester address>`.
2. Ask the door for the last sign-in mail for that address.
3. Open the link the door returns.

**Expected Results:**

* Step 2 returns the link with no mailbox opened.
* Step 3 signs `<tester address>` in on `<grade10 staging site url>`.

<!-- trace:case id=g10.shared-test-sign-in.TC-d7d rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC12-1: Capture for an address with no last mail returns no link

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and has been sent no sign-in mail.

**Steps:**

1. Ask the door for the last sign-in mail for `<tester address>`.
2. Ask `<grade10 staging site url>` for a sign-in mail for that address.
3. Ask the door for the last sign-in mail again.

**Expected Results:**

* Step 1 returns no link.
* Step 3 returns the link from the mail step 2 sent.

<!-- trace:case id=g10.shared-test-sign-in.TC-mdj rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC13-1: Capture returns only the named address's last mail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` and `<second tester address>` are minted under `<tester domain>`, and both hold an unused sign-in mail, `<second tester address>`'s sent last.

**Steps:**

1. Ask the door for the last sign-in mail for `<tester address>`.
2. Open the link the door returns on `<grade10 staging site url>`.

**Expected Results:**

* The link is `<tester address>`'s, not the newer one sent to `<second tester address>`.
* The signed-in account is `<tester address>`.

<!-- trace:case id=g10.shared-test-sign-in.TC-30m rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC14-1: A second capture returns the same link until another send

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and holds an unused sign-in mail.

**Steps:**

1. Ask the door for the last sign-in mail for `<tester address>` and open the link.
2. Ask the door for the last sign-in mail for that address again.
3. Ask `<grade10 staging site url>` for a second sign-in mail for that address.
4. Ask the door for the last sign-in mail a third time.

**Expected Results:**

* Step 2 returns the link step 1 used.
* Step 4 returns the link from the mail step 3 sent.

<!-- trace:case id=g10.shared-test-sign-in.TC-2dr rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC15-1: An aged unused link is refused before its lifetime passes

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and holds an unused sign-in mail sent less than `<link lifetime>` ago.

**Steps:**

1. Ask the door for the last sign-in mail for `<tester address>`.
2. Ask the door to age that link.
3. Open the link on `<grade10 staging site url>`.

**Expected Results:**

* Step 3 is refused as expired.
* No session starts, and less than `<link lifetime>` has passed since the mail was sent.

<!-- trace:case id=g10.shared-test-sign-in.TC-lfd rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC16-1: Aging a used link changes nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and holds an unused sign-in mail.

**Steps:**

1. Ask the door for the last sign-in mail for `<tester address>` and open the link.
2. Open the same link a second time and note the answer.
3. Ask the door to age that link.
4. Open the link again.

**Expected Results:**

* Step 4 answers exactly as step 2 did.
* No new session starts.

<!-- trace:case id=g10.shared-test-sign-in.TC-o35 rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC17-1: Aging an address with no link ages nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and has been sent no sign-in mail.

**Steps:**

1. Ask the door to age the link for `<tester address>`.
2. Ask `<grade10 staging site url>` for a sign-in mail for that address.
3. Ask the door for the last sign-in mail and open the link it returns.

**Expected Results:**

* No link exists to open after step 1.
* Step 3 signs `<tester address>` in, inside `<link lifetime>`.

<!-- trace:case id=g10.shared-test-sign-in.TC-xm8 rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC18-1: A banned tester address cannot follow its captured link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>`, is not banned, and holds an unused sign-in mail.

**Steps:**

1. Ask the door for the last sign-in mail for `<tester address>`.
2. Ask the door to ban `<tester address>`.
3. Open the captured link on `<grade10 staging site url>`.

**Expected Results:**

* Step 3 is refused for a banned address.
* No session starts.

<!-- trace:case id=g10.shared-test-sign-in.TC-tka rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC19-1: A prepared tester address holds admin once the link is followed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>`, holds no `admin`, and holds an unused sign-in mail.

**Steps:**

1. Ask the door to prepare `<tester address>` so it holds `admin`.
2. Ask the door for the last sign-in mail for that address.
3. Open the link the door returns.
4. Open `<grade10 admin console url>`.

**Expected Results:**

* Step 3 signs the address in.
* Step 4 admits the session, which holds `admin`.

<!-- trace:case id=g10.shared-test-sign-in.TC-6x5 rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC20-1: Clearing the limits sends a second mail without the wait

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and was sent a sign-in mail less than `<the send wait>` ago.

**Steps:**

1. Ask `<grade10 staging site url>` for a second sign-in mail for `<tester address>`.
2. Ask the door to clear the sign-in limits for `<tester address>`.
3. Ask for a second sign-in mail again.
4. Ask the door for the last sign-in mail for that address.

**Expected Results:**

* Step 1 is held by the wait between two mails.
* Step 3 sends the mail at once.
* Step 4 returns the newer link.

<!-- trace:case id=g10.shared-test-sign-in.TC-b7v rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC21-1: Clearing the limits lets the caller ask past the count

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>`, and the run has already asked for `<the mail count>` sign-in mails, the limit on how many a caller may ask for.

**Steps:**

1. Ask `<grade10 staging site url>` for one more sign-in mail for `<tester address>`.
2. Ask the door to clear the sign-in limits for the caller and `<tester address>`.
3. Ask for one more sign-in mail.
4. Ask the door for the last sign-in mail for that address.

**Expected Results:**

* Step 1 is held by the count a caller may ask for.
* Step 3 sends the mail.
* Step 4 returns its link.

<!-- trace:case id=g10.shared-test-sign-in.TC-2ca rev=1 covers=g10.shared-test-sign-in.SC-tx7,g10.shared-test-sign-in.SC-56z,g10.shared-test-sign-in.SC-u3l,g10.shared-test-sign-in.SC-i2h,g10.shared-test-sign-in.SC-d7r,g10.shared-test-sign-in.SC-9gy -->
### shared-auth-test-sign-in-US1-TC22-1: The door is closed on preview and production

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
* **Trace:** Closed

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>`, is not banned, and holds an unused sign-in mail on staging.

**Test data:**

| Where | Outcome |
| --- | --- |
| `<grade10 preview site url>` | refused |
| `<grade10 production site url>` | refused |

**Steps:**

1. Ask the door at the place in the row for the last sign-in mail for `<tester address>`.
2. Ask the door at the same place to ban `<tester address>`.

**Expected Results:**

* Both moves are refused and no link is returned.
* `<tester address>` is not banned afterwards.

<!-- trace:case id=g10.shared-test-sign-in.TC-brm rev=1 covers=g10.shared-test-sign-in.SC-tx7,g10.shared-test-sign-in.SC-56z,g10.shared-test-sign-in.SC-u3l,g10.shared-test-sign-in.SC-i2h,g10.shared-test-sign-in.SC-d7r,g10.shared-test-sign-in.SC-9gy -->
### shared-auth-test-sign-in-US1-TC23-1: The disposable dev door on staging stays 403

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
* **Testability:** automation, manual
* **Trace:** Closed

**Pre-conditions:**

* `<tester address>` is minted under `<tester domain>`.

**Test data:**

| Caller | Outcome |
| --- | --- |
| An approved dispatch of `<the door's workflow>` on the main branch | 403 |
| A signed-out visitor in a browser | 403 |

**Steps:**

1. Open `<the disposable dev door on staging>` as the caller in the row.
2. Ask it for a session for `<tester address>`.

**Expected Results:**

* Both steps answer 403.
* No session starts on `<grade10 staging site url>`.

<!-- trace:case id=g10.shared-test-sign-in.TC-dv3 rev=1 covers=g10.shared-test-sign-in.SC-tx7,g10.shared-test-sign-in.SC-56z,g10.shared-test-sign-in.SC-u3l,g10.shared-test-sign-in.SC-i2h,g10.shared-test-sign-in.SC-d7r,g10.shared-test-sign-in.SC-9gy -->
### shared-auth-test-sign-in-US1-TC24-1: The door mints no session without the mail

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
* **Trace:** Closed

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and has been sent no sign-in mail.

**Steps:**

1. Ask the door for a session for `<tester address>` without a mail.
2. Open `<grade10 staging site url>`.

**Expected Results:**

* Step 1 is refused and returns no session.
* Step 2 shows nobody signed in.

<!-- trace:case id=g10.shared-test-sign-in.TC-z4u rev=1 covers=g10.shared-test-sign-in.SC-tx7,g10.shared-test-sign-in.SC-56z,g10.shared-test-sign-in.SC-u3l,g10.shared-test-sign-in.SC-i2h,g10.shared-test-sign-in.SC-d7r,g10.shared-test-sign-in.SC-9gy -->
### shared-auth-test-sign-in-US1-TC25-1: The door does not unban

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
* **Trace:** Closed

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and was banned through the door.

**Steps:**

1. Ask the door to unban `<tester address>`.
2. Ask `<grade10 staging site url>` for a sign-in mail for that address.
3. Ask the door for the last sign-in mail for that address.
4. Open the link the door returns.

**Expected Results:**

* Step 1 is refused.
* Step 4 is refused for a banned address.

<!-- trace:case id=g10.shared-test-sign-in.TC-rzt rev=1 covers=g10.shared-test-sign-in.SC-tx7,g10.shared-test-sign-in.SC-56z,g10.shared-test-sign-in.SC-u3l,g10.shared-test-sign-in.SC-i2h,g10.shared-test-sign-in.SC-d7r,g10.shared-test-sign-in.SC-9gy -->
### shared-auth-test-sign-in-US1-TC26-1: The door seeds no store or auction data

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Closed

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>`.

**Steps:**

1. Ask the door to seed a store product for `<tester address>`.
2. Ask the door to seed an auction listing for `<tester address>`.
3. Open `<grade10 staging store url>`.
4. Open `<grade10 staging auction url>`.

**Expected Results:**

* Both seed moves are refused.
* No new product shows in step 3 and no new listing in step 4.

<!-- trace:case id=g10.shared-test-sign-in.TC-pb7 rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC27-1: Clearing one address leaves another address's wait standing

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
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<first tester address>` and `<second tester address>` are minted under `<tester domain>`, and each was sent a sign-in mail less than `<the send wait>` ago.

**Steps:**

1. Ask the door to clear the sign-in limits for `<first tester address>`.
2. Ask `<grade10 staging site url>` for a second sign-in mail for `<second tester address>`.

**Expected Results:**

* Step 2 is held by the wait between two mails.
* No second mail is sent to `<second tester address>`.

<!-- trace:case id=g10.shared-test-sign-in.TC-u45 rev=1 covers=g10.shared-test-sign-in.SC-w6r,g10.shared-test-sign-in.SC-a82,g10.shared-test-sign-in.SC-tjs,g10.shared-test-sign-in.SC-i3g,g10.shared-test-sign-in.SC-fdk,g10.shared-test-sign-in.SC-xo7,g10.shared-test-sign-in.SC-xe4,g10.shared-test-sign-in.SC-bj0,g10.shared-test-sign-in.SC-21a,g10.shared-test-sign-in.SC-tfs,g10.shared-test-sign-in.SC-cy4,g10.shared-test-sign-in.SC-to0,g10.shared-test-sign-in.SC-dcz -->
### shared-auth-test-sign-in-US1-TC28-1: A mail older than the capture window is no longer readable

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** What the job may do

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>` and was sent a sign-in mail more than `<the capture window>` ago.

**Steps:**

1. Ask the door for the last sign-in mail for `<tester address>`.

**Expected Results:**

* The call is not refused.
* No link is returned, as for an address no mail was sent to.

<!-- trace:case id=g10.shared-test-sign-in.TC-ug2 rev=1 covers=g10.shared-test-sign-in.SC-4tc,g10.shared-test-sign-in.SC-n68,g10.shared-test-sign-in.SC-y6k,g10.shared-test-sign-in.SC-wse,g10.shared-test-sign-in.SC-u90,g10.shared-test-sign-in.SC-o4r,g10.shared-test-sign-in.SC-q44,g10.shared-test-sign-in.SC-1xt,g10.shared-test-sign-in.SC-bap -->
### shared-auth-test-sign-in-US1-TC29-1: A tester address in mixed case is acted on

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Testers

**Pre-conditions:**

* An approved dispatch of `<the door's workflow>` is running on the main branch of this repository.
* `<tester address>` is minted under `<tester domain>`, written with its domain in mixed case.

**Steps:**

1. Ask the door to ban `<tester address>`.

**Expected Results:**

* The move is carried out.
* That address is banned.

## Reconciliation

The blind suite pass never read the scenarios; the scenario pass never read the suite. This block is what changed when they were put side by side, and who moved.

**Uncovered anchors:** none.

**Raised by the blind pass, answered as a decision:** twenty questions, every one landed in `decisions.md` under `## Raised`. Ten needed a new decision — Q23 to Q32 — and the rest were already answered by a scenario the blind pass could not see.

**Raised by the blind pass, folded into the spec:** four, each a case the blind pass wrote that no scenario proved.

- A subdomain of the tester domain — `shared-auth-test-sign-in-US1-TC7-1` → `shared-auth-test-sign-in-SC-30`.
- A mixed-case domain, which the blind pass raised beside the subdomain and its refusal table could not hold, because the answer is acceptance — `shared-auth-test-sign-in-SC-34`, with `TC29` added for it.
- Two addresses differing only by a plus tag — `shared-auth-test-sign-in-US1-TC9-1` → `shared-auth-test-sign-in-SC-31`.
- The door's own workflow off the main branch — `shared-auth-test-sign-in-US1-TC3-1` → `shared-auth-test-sign-in-SC-32`. The requirement had the bullet; only the pull-request half had a scenario.

**Found in the scenario pass, patched into the suite:** two, where a scenario had no case.

- Clearing one address leaves another's wait standing — `shared-auth-test-sign-in-SC-22` → `TC27`.
- The caller's own count, cleared — `shared-auth-test-sign-in-SC-33`, written after `TC21` was found to prove a bound no scenario stated.

**Found in review, patched into both:** two, and they came from neither pass.

- A governance review of the earlier draft found the fifteen-minute capture window living only in `tech-design.md`, which made the second-capture requirement stronger than what ships. It is now `Q22`, a 🚧 row on the page, `shared-auth-test-sign-in-SC-29`, and `TC28`.
- The merge review found age taking a `seconds` knob the spec did not grant, clear able to name no address in `SC-33`, and a catch-all SHALL the page marked ❓. Age takes `{ email }` only; `SC-33` names an address; `SC-11` is the ordinary send, not the inbox.

**Out of suite:** none.
