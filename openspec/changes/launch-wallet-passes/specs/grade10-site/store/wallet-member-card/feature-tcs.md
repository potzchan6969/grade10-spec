# grade10-site/store/wallet-member-card Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4
**Out of suite:** grade10-site-store-wallet-member-card-SC-46, grade10-site-store-wallet-member-card-SC-47, grade10-site-store-wallet-member-card-SC-48

## grade10-site-store-wallet-member-card-US9: Operator ends a member's pass from the console

**As an** operator,
**I want** to end a member's pass from the console when the phone it was on is gone,
**so that** a member who cannot reach their own page is not left with a pass that still identifies them.

### grade10-site-store-wallet-member-card-US9-TC1-1: Operator ends one wallet's pass and the other keeps identifying

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(admin, holds store:write, reads the audit trail) is signed in to the admin console.
* customer(member with a live Google Wallet pass and a live Apple Wallet pass) has both passes on a test phone the tester holds.
* The tester can read the member's email inbox.
* admin(shop staff) has the Grade10 extension open at the till.

**Test data:**

| <ended wallet> | <kept wallet> |
| --- | --- |
| Google Wallet | Apple Wallet |
| Apple Wallet | Google Wallet |

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Click the control that ends the member's <ended wallet> pass.
3. Confirm the ending.
4. Scan the <ended wallet> pass at the till.
5. Scan the <kept wallet> pass at the till.
6. Reload the member's record.
7. On <grade10 admin audit url>, read the newest row for the member.
8. Open the member's email inbox.
9. As the member, navigate to <grade10 membership url>.
10. Click the action that adds a <ended wallet> pass.
11. Scan the new <ended wallet> pass at the till.

**Expected Results:**

* Step 1 names Google Wallet and Apple Wallet.
* Step 4 identifies nobody.
* Step 5 identifies the member.
* Step 6 names <kept wallet> alone.
* Step 7 names the operator, the member, <ended wallet> and step 3's time, and says a pass was ended.
* Step 8 holds no message about the ending.
* Step 9 shows no <ended wallet> pass carried, and offers adding one.
* Step 11 identifies the member.

### grade10-site-store-wallet-member-card-US9-TC2-1: Record names exactly the wallets carrying a live pass

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
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write) is signed in to the admin console.
* customer(member holding <member's passes>).

**Test data:**

| <member's passes> | <wallets named> |
| --- | --- |
| No pass, never added | None |
| A live Google Wallet pass only | Google Wallet |
| A live Apple Wallet pass only | Apple Wallet |
| A live Google Wallet pass and an ended Apple Wallet pass | Google Wallet |
| A live Google Wallet pass that replaced an earlier Google Wallet pass | Google Wallet, named once |

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Read the wallets the record names.

**Expected Results:**

* The record names <wallets named>, and no other wallet.
* An ending is offered for each named wallet, and none otherwise.

### grade10-site-store-wallet-member-card-US9-TC3-1: Ending a pass no longer live ends nothing and says so

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin A(holds store:write) is signed in to the admin console.
* customer(member with a live Google Wallet pass and a live Apple Wallet pass).

**Test data:**

| <first ending> |
| --- |
| The member, clicking the control that ends the Google Wallet pass on <grade10 membership url> |
| admin B(holds store:write), ending the Google Wallet pass from the member's record |

**Steps:**

1. As admin A, open the member on <grade10 loyalty admin url>.
2. Have <first ending> end the member's Google Wallet pass.
3. As admin A, on the record open since step 1, click the control that ends the Google Wallet pass.
4. Confirm the ending.
5. Read the answer.
6. Reload the member's record.
7. On <grade10 admin audit url>, read the newest row for admin A's ending.

**Expected Results:**

* Step 5 says no Google Wallet pass was held.
* Step 5 reports nothing ended.
* Step 6 names Apple Wallet alone, still offering its ending.
* Step 7 names admin A, the member, Google Wallet and step 4's time, and says nothing was ended.

### grade10-site-store-wallet-member-card-US9-TC4-1: Operator without store:write sees no wallets and no ending

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
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(reads the store, does not hold store:write) is signed in to the admin console.
* customer(member with a live Google Wallet pass and a live Apple Wallet pass).

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Read the member's record.

**Expected Results:**

* Step 1 opens the member's record.
* The record names no wallet.
* The record offers no ending.

### grade10-site-store-wallet-member-card-US9-TC5-1: Ending sent without store:write is refused and the pass stays live

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
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(reads the store, does not hold store:write) has a signed-in admin console session.
* customer(member with a live Google Wallet pass).

**Steps:**

1. In the operator's session, send the request that ends the member's Google Wallet pass.
2. Read the API response.
3. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 2 is refused as forbidden.
* Step 3 shows the member still carries a Google Wallet pass.

### grade10-site-store-wallet-member-card-US9-TC7-1: Ending the operator declines ends nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write) is signed in to the admin console.
* customer(member with a live Apple Wallet pass).

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Click the control that ends the member's Apple Wallet pass.
3. Read the confirmation.
4. Decline it.
5. Reload the member's record.
6. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 3 names Apple Wallet.
* Step 3 asks for no reason.
* Step 5 still names Apple Wallet, offering its ending.
* Step 6 shows the member still carries an Apple Wallet pass.

### grade10-site-store-wallet-member-card-US9-TC8-1: Record whose wallets cannot be read says so

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write) is signed in to the admin console.
* customer(member with a live Google Wallet pass).
* The member's wallets cannot be read.

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Read the member's wallets.

**Expected Results:**

* The record says the wallets could not be read.
* The record never says no wallet pass is saved.
* The record offers no ending.

### grade10-site-store-wallet-member-card-US9-TC9-1: Operator ends a pass on their own member record

**Classification:**

* **Severity:** major
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write, is a member with a live Google Wallet pass) is signed in to the admin console.

**Steps:**

1. Open the operator's own member record on <grade10 loyalty admin url>.
2. Click the control that ends the Google Wallet pass.
3. Confirm the ending.
4. Reload the record.
5. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 1 names Google Wallet, offering its ending.
* Step 4 names no wallet.
* Step 5 shows no Google Wallet pass carried.

### grade10-site-store-wallet-member-card-US9-TC10-1: Shop staff holding store:write ends a member's pass

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(shop staff, holds store:write) is signed in to the admin console.
* customer(member with a live Apple Wallet pass).

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Click the control that ends the member's Apple Wallet pass.
3. Confirm the ending.
4. Reload the member's record.
5. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 1 names Apple Wallet, offering its ending.
* Step 4 names no wallet.
* Step 5 shows no Apple Wallet pass carried.

### grade10-site-store-wallet-member-card-US9-TC11-1: Ending sent for a wallet never added ends nothing

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write, reads the audit trail) has a signed-in admin console session.
* customer(member with a live Google Wallet pass, who never added an Apple Wallet pass).

**Steps:**

1. In the operator's session, send the request that ends the member's Apple Wallet pass.
2. Read the API response.
3. On <grade10 admin audit url>, read the newest row for the member.
4. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 2 says no Apple Wallet pass was held, and nothing ended.
* Step 3 names the operator, the member, Apple Wallet and step 1's time, and says nothing was ended.
* Step 4 shows the member still carries a Google Wallet pass.

### grade10-site-store-wallet-member-card-US9-TC12-1: Wallets read without store:write is refused

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
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(reads the store, does not hold store:write) has a signed-in admin console session.
* customer(member with a live Google Wallet pass).

**Steps:**

1. In the operator's session, send the request that reads the member's wallets.
2. Read the API response.

**Expected Results:**

* Step 2 is refused as forbidden.
* Step 2 names no wallet.

## Settled

- **An ending the audit trail fails to record** — not this capability's: whether a store act rolls back on a failed append is the Audit Trail's rule for every elevated act
- **A reason for an operator ending** — none typed; the cause is always the lost phone
- **A message to the member** — none; the member asked for the ending, and their own page shows the wallet no longer held
- **An attempt that ended nothing** — recorded on the audit trail as ending nothing
- **An ending refused for want of `store:write`** — not recorded; the trail records acts that ran, for every elevated act
- **An ending on the operator's own record** — allowed, as on any other member's
- **Confirming the ending** — the record asks, naming the wallet; declining ends nothing
- **Proving a member saves a pass** — the save is US-06's, walked by `grade10-site-store-wallet-member-card-US6-TC1-1` on each wallet in staging

## Reconciliation

**Run:** 2026-10-06, QA2 in a fresh context, the second on US-09. It read this suite, the delta's scenarios, `decisions.md`, `tech-design.md`, `tasks.md`, the [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card) page, the durable suite, and the shipped code in grade10. The blind pass (QA1) left no Run line of its own; its raised rows, R3 to R9 in `decisions.md`, quote the page, `decisions.md` and the Users page, and none names a scenario or a requirement. The first QA2 reconciled US9-TC1 to US9-TC5 and US9-TC7 to US9-TC8 the same day; US9-TC9 to US9-TC11 and `grade10-site-store-wallet-member-card-SC-49` came after it and are reconciled here for the first time.

- **Agreed** — `grade10-site-store-wallet-member-card-SC-38` and `grade10-site-store-wallet-member-card-SC-43` are walked by US9-TC1: the ending, the audit row, no message, the new pass and the other wallet left identifying; US9-TC10 walks `grade10-site-store-wallet-member-card-SC-38` for shop staff, who hold `store:write` (Q2). `grade10-site-store-wallet-member-card-SC-41` by US9-TC2 for the wallets named, by US9-TC1's reload for a wallet leaving the list, and by US9-TC4 for an operator without `store:write`. `grade10-site-store-wallet-member-card-SC-40` by US9-TC5. `grade10-site-store-wallet-member-card-SC-42` by US9-TC3 for a pass ended first elsewhere and US9-TC11 for a wallet never added. `grade10-site-store-wallet-member-card-SC-44` by US9-TC7, `grade10-site-store-wallet-member-card-SC-45` by US9-TC8, `grade10-site-store-wallet-member-card-SC-49` by US9-TC9
- **Raised, landed** — a typed reason (Q14: none); a message to the member (Q15: none); an operator ending a pass on their own record (Q17: allowed, now `grade10-site-store-wallet-member-card-SC-49`); which case proves a member saving a pass (Q19: the durable `grade10-site-store-wallet-member-card-US6-TC1-1`, walked in staging by task 8.3); an ending refused for want of `store:write` (Q20: not recorded, as for every elevated act). No case changed
- **Raised, folded into spec** — an attempt that ended nothing is recorded as ending nothing (Q16), stated in the requirement and `grade10-site-store-wallet-member-card-SC-42`; US9-TC3 and US9-TC11 read the audit row. The record asks the operator to confirm, naming the wallet, and declining ends nothing (Q18, from the shipped console), stated as `grade10-site-store-wallet-member-card-SC-44`; US9-TC1 and US9-TC3 confirm their ending
- **Rejected** — US9-TC6, dropped: it held that an ending the audit trail cannot record does not take effect. The trail is the platform's: the append follows the act, and a failed append fails the request over an act already committed (`packages/worker/src/trpc.ts:429-444` in grade10). Whether a store act rolls back on a failed append is the [Audit Trail](/p/grade10-admin/audit) page's to decide, not this capability's
- **Contradicted** — none: where a case and a scenario state the same behaviour they agree
- **Found by neither reading** — a record whose wallets cannot be read says so and never that none are held: shipped in grade10's console and its test, folded as `grade10-site-store-wallet-member-card-SC-45`. A request for the member's wallets without `store:write` is refused as forbidden: decided in Q5 and the technical design, which moves the read from `store:read` to `store:write` (task 2.4), and tested by task 2.1, but stated by no scenario and walked by no case. Folded into the requirement and `grade10-site-store-wallet-member-card-SC-41`, walked by US9-TC12
- **Cases added after a reconciliation** — US9-TC7 (`grade10-site-store-wallet-member-card-SC-44`), US9-TC8 (`grade10-site-store-wallet-member-card-SC-45`) and US9-TC12 (`grade10-site-store-wallet-member-card-SC-41`), written from the scenarios, so they are not blind. US9-TC9 to US9-TC11 record no reading of their own
- **Out of suite** — `grade10-site-store-wallet-member-card-SC-46`, `grade10-site-store-wallet-member-card-SC-47` and `grade10-site-store-wallet-member-card-SC-48` serve the Configuration group, which no journey walks: the launch check is a command only Engineering runs. They are decided by grade10's tests, task 3.1 - `scripts/secrets/status.test.mjs`, `packages/utils/test/config.test.ts` and the store backend's `walletPassSecrets` test - and run against every deployed store worker by task 7.1
- **Carried, not this change's** — `grade10-site-store-wallet-member-card-SC-12` is carried word for word in the modified requirement and walked by the durable `grade10-site-store-wallet-member-card-US1-TC3-1`
- **Corrected** — `grade10-site-store-wallet-member-card-SC-43` served US-09 under a title the journey does not carry; it now names the journey's own

### Manual

No case is decided by an automated test yet. The tests that prove part of each, in these words:

- the store's suite - `packages/grade10-store/backend/src/testing/suites/posGateway.ts`, in the application repository
- the console's test - `apps/admin/grade10/src/pages/members/MembersPage.test.tsx`, in the application repository
- the walk - `apps/frontend/grade10/e2e/tests/admin/wallet-pass-ending.spec.ts`, in the application repository, task 8.2

| Manual | Why |
| --- | --- |
| `grade10-site-store-wallet-member-card-US9-TC1-1` | the store's suite proves the ending, the audit row and the other wallet left live; to be walked in the walk; a person scans both passes at a staging till, task 8.3 |
| `grade10-site-store-wallet-member-card-US9-TC2-1` | the store's suite proves the wallets held and none; the console's test proves no ending offered for none; to be walked in the walk |
| `grade10-site-store-wallet-member-card-US9-TC3-1` | the store's suite proves the nothing-held answer; the console's line and the audit outcome are task 2's; a person ends the pass from a second session first |
| `grade10-site-store-wallet-member-card-US9-TC4-1` | the console's test proves no ending offered without `store:write`; to be walked in the walk |
| `grade10-site-store-wallet-member-card-US9-TC5-1` | the store's suite proves the refusal and the pass still identifying; flipped once task 1.3 links it |
| `grade10-site-store-wallet-member-card-US9-TC7-1` | the console's test for a declined confirmation is task 2's; to be walked in the walk |
| `grade10-site-store-wallet-member-card-US9-TC8-1` | the console's test proves an unreadable wallet is never called empty; flipped once task 1.3 links it |
| `grade10-site-store-wallet-member-card-US9-TC9-1` | the store's suite for an ending on the operator's own record is task 2's; a person signs in as an operator who is also a member |
| `grade10-site-store-wallet-member-card-US9-TC10-1` | a person signs in as shop staff; which roles hold `store:write` is the console's role table, which no test here reads |
| `grade10-site-store-wallet-member-card-US9-TC11-1` | the store's suite for the nothing-held answer and its audit outcome is task 2's; flipped once task 2.5 links it |
| `grade10-site-store-wallet-member-card-US9-TC12-1` | the store's suite for a `support` operator's refused read is task 2's; flipped once task 2.5 links it |
