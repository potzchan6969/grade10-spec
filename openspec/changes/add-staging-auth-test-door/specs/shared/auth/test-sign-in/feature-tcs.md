# shared/auth/test-sign-in Test Cases

**Status:** pending-review · 0/33
**Drafts styled:** 2026-10-19, tcs-rules r6

Draft from the QA1 blind reading. Trace lines name the Feature set group each case covers, because the capability walks no journey of its own.

## g10.shared-test-sign-in.US1: Sign-in without the /dev door

Walked by nobody on their own. The Trace line names the Feature set group.

### g10.shared-test-sign-in.US1-TC1: The door's workflow from main on an approved dispatch captures a tester link

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Who may call, the door's own workflow

**Pre-conditions:**

* The door's workflow exists on main.
* A reviewer has approved the dispatch.
* The staging named collector has a sign-in mail sent less than fifteen minutes ago.

**Test data:**

| Field | Value |
| --- | --- |
| Caller | the door's workflow, run from main |
| Environment | staging |
| Move | capture the link |
| Address | the staging named collector |

**Steps:**

1. Dispatch the door's workflow from main on staging with the move set to capture the link for the address.
2. Read the workflow run result.

**Expected Results:**

* The run reports success.
* The run returns one sign-in link for the address.

### g10.shared-test-sign-in.US1-TC2: A run the door's workflow started from a pull request is refused

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Who may call, the door's own workflow

**Pre-conditions:**

* The door's workflow is present on a pull request branch.

**Test data:**

| Field | Value |
| --- | --- |
| Caller | the door's workflow, run from a pull request |
| Environment | staging |
| Move | capture the link |
| Address | the staging named collector |

**Steps:**

1. Run the door's workflow from the pull request branch on staging, with the move set to capture the link for the address.
2. Read the workflow run result.

**Expected Results:**

* The door refuses the move.
* No sign-in link is returned.

### g10.shared-test-sign-in.US1-TC3: A dispatch no reviewer approved does not open the door

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Who may call, the door's own workflow

**Pre-conditions:**

* The door's workflow exists on main.
* No reviewer has approved the dispatch.

**Test data:**

| Field | Value |
| --- | --- |
| Caller | the door's workflow, run from main, not approved |
| Environment | staging |
| Move | capture the link |
| Address | the staging named collector |

**Steps:**

1. Dispatch the door's workflow from main on staging with the move set to capture the link for the address, without an approval.
2. Read the workflow run result.

**Expected Results:**

* The run does not reach the door.
* No sign-in link is returned.

### g10.shared-test-sign-in.US1-TC4: Another workflow in the repository cannot open the door

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Who may call, the door's own workflow

**Pre-conditions:**

* A workflow other than the door's workflow exists on main in this repository.

**Test data:**

| Field | Value |
| --- | --- |
| Caller | another workflow in this repository, run from main |
| Environment | staging |
| Move | capture the link |
| Address | the staging named collector |

**Steps:**

1. Run the other workflow from main, with a step that asks the door for the capture of the link for the address.
2. Read the step result.

**Expected Results:**

* The door refuses the request.
* No sign-in link is returned.

### g10.shared-test-sign-in.US1-TC5: A caller with no credential, or a wrong one, is refused

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Every other caller is refused

**Pre-conditions:**

* The staging named collector has a sign-in mail sent less than fifteen minutes ago.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | none |
| Address | the staging named collector |

Runs once per row of **Test data**.

| Credential | Address |
| --- | --- |
| none | the staging named collector |
| a token that is not the QA token | the staging named collector |
| the QA token with one character changed | the staging named collector |

**Steps:**

1. Send the capture-the-link move for the address to the staging test door, with the credential in the row.
2. Read the response.

**Expected Results:**

* The door refuses the request.
* No sign-in link is returned.

### g10.shared-test-sign-in.US1-TC6: A QA agent with the QA token captures a tester link on staging

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Who may call, the QA token

**Pre-conditions:**

* The QA agent holds the QA token committed to the repository.
* The staging named collector has a sign-in mail sent less than fifteen minutes ago.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the QA token |
| Environment | staging |
| Move | capture the link |
| Address | the staging named collector |

**Steps:**

1. Send the capture-the-link move for the address to the staging test door, with the QA token.
2. Read the response.

**Expected Results:**

* The door accepts the move.
* The response holds one sign-in link for the address.

### g10.shared-test-sign-in.US1-TC7: The QA token is refused outside staging

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Who may call, the QA token

**Pre-conditions:**

* The environment named in the row holds a tester address that a sign-in mail has reached.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the QA token |
| Move | capture the link |

Runs once per row of **Test data**.

| Environment | Address |
| --- | --- |
| uat | the uat named collector |
| production | the production collector |
| preview | the production collector |
| local stack | a named tester on the local stack |

**Steps:**

1. Send the capture-the-link move for the address to the test door in the environment, with the QA token.
2. Read the response.

**Expected Results:**

* The door refuses the move.
* No sign-in link is returned.

### g10.shared-test-sign-in.US1-TC8: The QA token is refused for the admin-only tester

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Who may call, the QA token

**Pre-conditions:**

* The admin-only tester has a sign-in mail sent less than fifteen minutes ago.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the QA token |
| Move | capture the link |

Runs once per row of **Test data**.

| Environment | Address |
| --- | --- |
| staging | the staging admin-only tester |
| uat | the uat admin-only tester |

**Steps:**

1. Send the capture-the-link move for the address to the test door in the environment, with the QA token.
2. Read the response.

**Expected Results:**

* The door refuses the move.
* No sign-in link is returned.

### g10.shared-test-sign-in.US1-TC9: The QA token is refused for ban, prepare and scoped-role moves

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Who may call, the QA token

**Pre-conditions:**

* The staging ban-only address exists and has never signed in.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the QA token |
| Environment | staging |
| Address | the staging ban-only address |

Runs once per row of **Test data**.

| Move |
| --- |
| ban the address |
| prepare the address |
| prepare a scoped role, `staff` |

**Steps:**

1. Send the move in the row for the address to the staging test door, with the QA token.
2. Read the response.
3. Attempt a sign-in with the address.

**Expected Results:**

* The door refuses the move.
* The address keeps its prior state, with no ban and no role set.

### g10.shared-test-sign-in.US1-TC10: The QA token ages and clears on a staging tester address

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Who may call, the QA token

**Pre-conditions:**

* The staging named collector has an unused sign-in link.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the QA token |
| Environment | staging |
| Address | the staging named collector |

Runs once per row of **Test data**.

| Move |
| --- |
| age the unused link |
| clear the sign-in limits |

**Steps:**

1. Send the move in the row for the address to the staging test door, with the QA token.
2. Read the response.

**Expected Results:**

* The door accepts the move.
* For the age row, the link is marked expired.
* For the clear row, the sign-in limits no longer apply to the address.

### g10.shared-test-sign-in.US1-TC11: The named testers on staging and uat are accepted

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Testers, the named testers

**Pre-conditions:**

* Each address in the rows has a sign-in mail sent less than fifteen minutes ago, or is a named tester with no account yet.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Move | capture the link |

Runs once per row of **Test data**.

| Environment | Address |
| --- | --- |
| staging | the staging named collector |
| staging | the staging plus-tag sibling |
| staging | the staging ban-only address |
| uat | the uat named collector |
| uat | the uat ban-only address |

**Steps:**

1. Send the capture-the-link move for the address in the row to the test door in the environment.
2. Read the response.

**Expected Results:**

* The door accepts the move.
* The response holds one sign-in link for the address.

### g10.shared-test-sign-in.US1-TC12: A minted plus-tag on staging is accepted, and an account is created when a move needs one

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Testers, the named testers

**Pre-conditions:**

* The staging named collector has never been used as a plus-tag base in this run.
* No account exists for the plus-tag the run mints.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Move | ban the address |
| Address | a plus-tag of the staging named collector minted by the run |

**Steps:**

1. Run the door's workflow from main on staging, minting a unique plus-tag of the staging named collector.
2. Send the ban move for the minted plus-tag address to the staging test door.
3. Read the account for the minted plus-tag address.

**Expected Results:**

* The door accepts the move.
* An account exists for the minted plus-tag address.
* The account is in the banned state.

### g10.shared-test-sign-in.US1-TC13: Mixed-case addresses are refused

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Testers, the named testers

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Move | capture the link |

Runs once per row of **Test data**.

| Address |
| --- |
| the staging named collector with one capital letter in the local part |
| the staging named collector with one capital letter in the domain |

**Steps:**

1. Send the capture-the-link move for the address in the row to the staging test door.
2. Read the response.

**Expected Results:**

* The door refuses the move.
* No sign-in link is returned.

### g10.shared-test-sign-in.US1-TC14: Addresses outside the named testers are refused

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Testers, the named testers

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Move | capture the link |

Runs once per row of **Test data**.

| Address |
| --- |
| an address on another domain |
| a real customer address that is not a named tester |
| a plus-tag of an address that is not a named tester |

**Steps:**

1. Send the capture-the-link move for the address in the row to the staging test door.
2. Read the response.

**Expected Results:**

* The door refuses the move.
* No sign-in link is returned, and no account is created.

### g10.shared-test-sign-in.US1-TC15: A move that names no address is refused

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Testers, the named testers

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Move | capture the link |
| Address | none |

**Steps:**

1. Send the capture-the-link move to the staging test door with no address.
2. Read the response.

**Expected Results:**

* The door refuses the move.
* Nothing changes on any account.

### g10.shared-test-sign-in.US1-TC16: Capture returns the last sign-in mail link for a tester address without a mailbox

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: What the job may do, capture the link

**Pre-conditions:**

* The staging named collector has received two sign-in mails, the second sent after the first, both less than fifteen minutes ago.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Move | capture the link |
| Address | the staging named collector |

**Steps:**

1. Send the capture-the-link move for the address to the staging test door.
2. Read the response.
3. Compare the returned link with the link in the second sign-in mail.

**Expected Results:**

* The returned link is the link from the second sign-in mail.
* The capture is made with no mailbox opened by the tester.

### g10.shared-test-sign-in.US1-TC17: A sign-in mail older than fifteen minutes cannot be captured

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: What the job may do, capture the link

**Pre-conditions:**

* The staging named collector's last sign-in mail was sent more than fifteen minutes ago.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Move | capture the link |
| Address | the staging named collector |

**Steps:**

1. Send the capture-the-link move for the address to the staging test door.
2. Read the response.

**Expected Results:**

* The door returns no sign-in link.

### g10.shared-test-sign-in.US1-TC18: Following a captured link signs the tester in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: What the job may do, capture the link

**Pre-conditions:**

* A sign-in link for the staging named collector was captured less than five minutes ago.

**Test data:**

| Field | Value |
| --- | --- |
| Environment | staging |
| Address | the staging named collector |

**Steps:**

1. Open the captured sign-in link in a browser with no session.
2. Read the page the browser lands on.

**Expected Results:**

* The browser signs in as the staging named collector.
* The session belongs to the collector's account.

### g10.shared-test-sign-in.US1-TC19: An aged unused link cannot be followed

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: What the job may do, age the unused link

**Pre-conditions:**

* The staging named collector has an unused sign-in link, captured and not followed.

**Test data:**

| Field | Value |
| --- | --- |
| Environment | staging |
| Address | the staging named collector |

**Steps:**

1. Send the age-the-unused-link move for the address to the staging test door with the workflow.
2. Open the captured sign-in link in a browser with no session.
3. Read the page the browser lands on.

**Expected Results:**

* The page shows the link has expired.
* The browser is not signed in.

### g10.shared-test-sign-in.US1-TC20: A banned tester cannot sign in through a followed link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: What the job may do, ban the address

**Pre-conditions:**

* The staging ban-only address has a captured sign-in link, and the workflow has banned the address.

**Test data:**

| Field | Value |
| --- | --- |
| Environment | staging |
| Address | the staging ban-only address |

**Steps:**

1. Open the captured sign-in link in a browser with no session.
2. Read the page the browser lands on.

**Expected Results:**

* The page refuses the sign-in because the address is banned.
* The browser is not signed in.

### g10.shared-test-sign-in.US1-TC21: The admin-only tester is prepared as admin before the link is followed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: What the job may do, prepare the address

**Pre-conditions:**

* The staging admin-only tester has never signed in.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Move | prepare the address with `admin` |
| Address | the staging admin-only tester |

**Steps:**

1. Send the prepare move for the address to the staging test door with the workflow.
2. Send the capture-the-link move for the same address.
3. Open the captured sign-in link in a browser with no session.
4. Read the role shown for the signed-in account.

**Expected Results:**

* The account holds `admin` before the link is followed.
* The browser signs in as the admin-only tester with `admin`.

### g10.shared-test-sign-in.US1-TC22: A scoped role is prepared on a minted plus-tag of the collector

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: What the job may do, prepare a scoped role

**Pre-conditions:**

* The workflow has minted a unique plus-tag of the staging named collector for this run.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Address | the minted plus-tag of the staging named collector |

Runs once per row of **Test data**.

| Role |
| --- |
| `staff` |
| `support` |
| `finance` |
| `treasurer` |
| `auditor` |

**Steps:**

1. Send the prepare-a-scoped-role move for the address with the role in the row to the staging test door.
2. Send the capture-the-link move for the address.
3. Open the captured sign-in link in a browser with no session.
4. Read the role shown for the signed-in account.

**Expected Results:**

* The account holds the role in the row.
* The browser signs in as the minted plus-tag with that role.
* The named collector's role is unchanged.

### g10.shared-test-sign-in.US1-TC23: A scoped role is refused on a named tester

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: What the job may do, prepare a scoped role

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Move | prepare a scoped role, `staff` |

Runs once per row of **Test data**.

| Address |
| --- |
| the staging named collector |
| the staging plus-tag sibling |

**Steps:**

1. Send the prepare-a-scoped-role move for the address in the row to the staging test door.
2. Read the response.

**Expected Results:**

* The door refuses the move.
* The address holds no scoped role.

### g10.shared-test-sign-in.US1-TC24: Clearing the sign-in limits lets a suite request mails without throttling

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: What the job may do, clear the sign-in limits

**Pre-conditions:**

* The staging named collector has just been sent a sign-in mail.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Address | the staging named collector |

**Steps:**

1. Send the clear-the-sign-in-limits move for the address to the staging test door.
2. Request a second sign-in mail for the address straight away.
3. Read the response for the second request.

**Expected Results:**

* The second sign-in mail is sent without the wait between mails applying.
* The count of requests the caller may ask for is not reached by the suite's requests.

### g10.shared-test-sign-in.US1-TC25: Every move works on staging and uat for a named tester

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Where it opens, staging and uat

**Pre-conditions:**

* The named tester in the row has a sign-in mail sent less than fifteen minutes ago, and no ban, role or unused link state that the move would conflict with.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |

Runs once per row of **Test data**.

| Environment | Move | Address |
| --- | --- | --- |
| staging | capture the link | the staging named collector |
| staging | age the unused link | the staging named collector |
| staging | ban the address | the staging ban-only address |
| staging | prepare the address with `admin` | the staging admin-only tester |
| staging | prepare a scoped role, `staff` | a minted plus-tag of the staging named collector |
| staging | clear the sign-in limits | the staging named collector |
| uat | capture the link | the uat named collector |
| uat | ban the address | the uat ban-only address |

**Steps:**

1. Send the move in the row for the address to the test door in the environment with the workflow.
2. Read the response.

**Expected Results:**

* The door accepts the move.
* The state named by the move holds for the address afterwards.

### g10.shared-test-sign-in.US1-TC26: Production and preview answer capture and clear for the production collector

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Where it opens, production and preview

**Pre-conditions:**

* The production collector has a sign-in mail sent less than fifteen minutes ago.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Address | the production collector |

Runs once per row of **Test data**.

| Environment | Move |
| --- | --- |
| production | capture the link |
| production | clear the sign-in limits |
| preview | capture the link |
| preview | clear the sign-in limits |

**Steps:**

1. Send the move in the row for the address to the test door in the environment with the workflow.
2. Read the response.

**Expected Results:**

* The door accepts the move.
* For the capture row, one sign-in link is returned for the production collector.

### g10.shared-test-sign-in.US1-TC27: Age, ban, prepare and scoped-role moves are refused in production and preview

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Where it opens, production and preview

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |

Runs once per row of **Test data**.

| Environment | Move | Address |
| --- | --- | --- |
| production | age the unused link | the production collector |
| production | ban the address | the production collector |
| production | prepare the address with `admin` | the production collector |
| production | prepare a scoped role, `staff` | the production collector |
| production | capture the link | the production admin-only tester |
| preview | ban the address | the production collector |

**Steps:**

1. Send the move in the row for the address to the test door in the environment with the workflow.
2. Read the response.

**Expected Results:**

* The door refuses the move.
* The account keeps its prior state.

### g10.shared-test-sign-in.US1-TC28: A plus-tag is refused in production

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Where it opens, production and preview

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | production |
| Move | capture the link |
| Address | a plus-tag of the production collector |

**Steps:**

1. Send the capture-the-link move for the address to the production test door with the workflow.
2. Read the response.

**Expected Results:**

* The door refuses the move.
* No sign-in link is returned.

### g10.shared-test-sign-in.US1-TC29: The door opens no move on a local stack

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Closed, everywhere else

**Pre-conditions:**

* The local stack is running with a named tester.

**Test data:**

| Field | Value |
| --- | --- |
| Environment | local stack |
| Address | a named tester on the local stack |
| Move | capture the link |

Runs once per row of **Test data**.

| Credential |
| --- |
| the door's workflow, run from main, approved |
| the QA token |

**Steps:**

1. Send the capture-the-link move for the address to the local test door with the credential in the row.
2. Read the response.

**Expected Results:**

* The door refuses the move.
* No sign-in link is returned.

### g10.shared-test-sign-in.US1-TC30: The disposable dev door returns 403 on staging, uat and production

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Closed, everywhere else

**Pre-conditions:**

* None.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |

Runs once per row of **Test data**.

| Environment |
| --- |
| staging |
| uat |
| production |

**Steps:**

1. Request the disposable `/dev` door in the environment in the row.
2. Read the response status.

**Expected Results:**

* The response status is 403.
* No session is created.

### g10.shared-test-sign-in.US1-TC31: The job does not mint a session without following the mail

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Closed, everywhere else

**Pre-conditions:**

* The staging named collector has never signed in.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Address | the staging named collector |

**Steps:**

1. Send a request to the staging test door that asks for a session for the address, without capturing or following a link.
2. Read the response.

**Expected Results:**

* The door returns no session.
* The collector remains signed out.

### g10.shared-test-sign-in.US1-TC32: The job does not unban an address

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Closed, everywhere else

**Pre-conditions:**

* The staging ban-only address is banned.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |
| Address | the staging ban-only address |

**Steps:**

1. Send a request to the staging test door that asks the door to unban the address.
2. Read the response.
3. Attempt a sign-in for the address through a followed link.

**Expected Results:**

* The door refuses the request.
* The address remains banned.

### g10.shared-test-sign-in.US1-TC33: The job does not seed store or auction data

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
* **Trace:** g10.shared-test-sign-in.US1 - Feature set: Closed, everywhere else

**Pre-conditions:**

* The staging store and auction data are in a known state, recorded before the request.

**Test data:**

| Field | Value |
| --- | --- |
| Credential | the door's workflow, run from main, approved |
| Environment | staging |

**Steps:**

1. Send a request to the staging test door that asks the door to seed store and auction data.
2. Read the response.
3. Compare the store and auction data with the recorded state.

**Expected Results:**

* The door refuses the request.
* The store and auction data are unchanged.
