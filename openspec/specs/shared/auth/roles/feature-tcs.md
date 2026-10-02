# shared/auth/roles Test Cases

**Status:** reopened
**Reviewed:** 2026-10-01, tcs-rules r4, lapsed 2026-10-01
**Drafts styled:** 2026-10-02, tcs-rules r4
**Out of suite:** shared-auth-roles-SC-18 - the exact admin list in grade10's `packages/grade10-auth/contracts/test/roles.test.ts`; shared-auth-roles-SC-20 - a `parseRoles("finance,treasurer")` case in the same file; shared-auth-roles-SC-21 - the exact, ordered `PERMISSION_STATEMENTS` assertion in the same file; shared-auth-roles-SC-24 - no role holds `inventory:write` without `inventory:transfer`; the grant split is held by the role and vocabulary tests in grade10's `packages/grade10-auth/contracts/test/roles.test.ts` and the items service tests (tasks 2.1, 5.1), and walked by `grade10-admin-inventory-items-US3-TC9-1`

## shared-auth-roles-US1: Collector holds the user role only

**As a** collector who has never been granted an operator role,
**I want** my roles to be `user` only,
**so that** I cannot act as staff by accident.

### shared-auth-roles-US1-TC1-1: Collector without an operator grant is user only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* customer(has never been granted an operator role) is signed in on <grade10 store url>.

**Steps:**

1. Read who is calling.

**Expected Results:**

* The caller's roles are `user` only.

### shared-auth-roles-US1-TC2-1: Unknown role name is dropped

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* customer(stored roles include <unknown role>) is signed in on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| <unknown role> | intern |

**Steps:**

1. Read who is calling.

**Expected Results:**

* `intern` is not among the caller's roles.

### shared-auth-roles-US1-TC3-1: User role cannot take an operator action

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* customer(roles are `user` only) is signed in.

**Steps:**

1. On <grade10 admin users url>, try to ban an account.

**Expected Results:**

* The ban is refused.

### shared-auth-roles-US1-TC4-1: Admin console rejects a user sign-in

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** exploratory
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* customer(roles are `user` only) is signed out.

**Test data:**

| Field | Value |
| --- | --- |
| <collector email> | collector@example.com, an address whose roles are `user` only |

**Steps:**

1. Sign in as <collector email> on <grade10 admin url>.

**Expected Results:**

* The admin console rejects the sign-in.

---

## shared-auth-roles-US2: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

### shared-auth-roles-US2-TC1-1: Support cannot set roles but can still list and ban

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `support`) is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | An account that does not hold `admin` |
| <subject session> | A session of an account that does not hold `admin` |

**Steps:**

1. On <grade10 admin users url>, try to change another account's roles.
2. List the accounts.
3. Ban <subject user id>.
4. End <subject session>.

**Expected Results:**

* The role change is refused.
* Listing accounts, the ban, and ending the session are allowed.

### shared-auth-roles-US2-TC2-1: Staff cannot list or ban users

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `staff`) is signed in.

**Steps:**

1. On <grade10 admin users url>, try to list accounts.
2. Try to ban an account.

**Expected Results:**

* The list is refused.
* The ban is refused.

### shared-auth-roles-US2-TC3-1: Unknown permission grants nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* A signed-in person is on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| <unknown permission> | store:explode |

**Steps:**

1. Request an action that requires <unknown permission>.

**Expected Results:**

* The action is refused.

### shared-auth-roles-US2-TC4-1: Staff can write the store and operate the auction catalog

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `staff`) is signed in.

**Steps:**

1. Write a store record on <grade10 admin url>.
2. Operate the auction catalog on <grade10 admin auction catalog url>.

**Expected Results:**

* The store write is allowed.
* The auction operate action is allowed.

### shared-auth-roles-US2-TC5-1: Auditor reads the trail and nothing else

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(only operator role is `auditor`) is signed in.

**Steps:**

1. Read the identity audit trail on <grade10 admin audit url>.
2. On <grade10 admin users url>, try to ban an account.
3. Try a store write on <grade10 admin url>.
4. Try to change another account's roles.

**Expected Results:**

* Reading the trail is allowed.
* The ban, the store write, and the role change are refused.

### shared-auth-roles-US2-TC6-1: Combined roles stack their grants

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(holds `support` and `staff`) is signed in.

**Steps:**

1. List accounts on <grade10 admin users url>.
2. Write a store record on <grade10 admin url>.

**Expected Results:**

* The list is allowed.
* The store write is allowed.

### shared-auth-roles-US2-TC7-1: Operator cannot widen what a role grants

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(holds `user:set-role`) is signed in.

**Steps:**

1. Open another account on <grade10 admin users url>.
2. Read what can be changed for that account.

**Expected Results:**

* Who holds a role can be changed.
* What that role grants cannot be changed.

### shared-auth-roles-US2-TC8-1: Admin can record a refund

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `admin`) is signed in.

**Steps:**

1. Request a refund, which requires `auction:refund`, on <grade10 admin auction url>.

**Expected Results:**

* The refund is allowed.

### shared-auth-roles-US2-TC9-1: Settlement permission is not required for a refund

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `staff`) is signed in.
* That caller holds refund processing and does not hold payment settlement.

**Steps:**

1. Request a refund, which requires `auction:refund`, on <grade10 admin auction url>.
2. Read the caller's grants.

**Expected Results:**

* The refund is allowed.
* The caller does not hold `auction:settle`.

### shared-auth-roles-US2-TC11-1: Finance collects auction money and holds nothing else

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(only operator role is `finance`) is on <grade10 admin auction url>.
* <auction order> is awaiting payment.
* <vault case> is awaiting payout.

**Test data:**

| Field | Value |
| --- | --- |
| <auction order> | An auction order with an unpaid invoice |
| <vault case> | A vault case whose cost is agreed and not yet paid out |

**Steps:**

1. Open <auction order>.
2. Record a payment against <auction order>.
3. Try to record a shipment on <auction order>.
4. Try to record a refund on <auction order>.
5. On <grade10 admin auction catalog url>, try an auction operate action.
6. Try to write the auction catalogue.
7. On <grade10 admin url>, try a store write.
8. On <grade10 admin vault url>, try to open <vault case>.
9. Try to pay out <vault case>.

**Expected Results:**

* Steps 1 and 2 are allowed; <auction order> shows the payment recorded.
* The shipment, the refund, the operate action, the catalogue write, the store write, the vault case and the payout are refused.
* <auction order> shows no shipment and no refund; <vault case> shows no payout.

### shared-auth-roles-US2-TC14-1: Staff run the grading counter, bookings, stock and catalogue

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(only operator role is `staff`) is signed in on <grade10 admin url>.
* <grading request> was raised by another staff member and awaits approval.
* <booking> and <stock item> exist.

**Test data:**

| Field | Value |
| --- | --- |
| <grading request> | A grading request another staff member raised, awaiting a second approver |
| <booking> | A booked appointment |
| <stock item> | An inventory item with stock on hand |

**Steps:**

1. On <grade10 admin grading url>, record a grading counter act.
2. Approve <grading request>.
3. On <grade10 admin appointments url>, change <booking>.
4. On <grade10 admin inventory url>, change the stock of <stock item>.
5. On <grade10 admin auction catalog url>, write the auction catalogue.

**Expected Results:**

* The counter act, the approval, the booking change, the stock change and the catalogue write are each allowed.

### shared-auth-roles-US2-TC15-1: Staff and admin move an item and open its proof

Runs once per row of **Test data**.

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(only operator role is the row's) is signed in to the Grade10 console.
* `<item_1>` is owned by `<collector A>`, no place marks it, and its top move carries one proof.

**Test data:**

| Operator role |
| --- |
| `staff` |
| `admin` |

**Steps:**

1. Navigate to <grade10 admin item page url> for `<item_1>`.
2. Click the proof on the top move.
3. Transfer `<item_1>` to the custodian with a reason.

**Expected Results:**

* The proof downloads.
* `<item_1>` reads the custodian as owner, with the move at the top.

### shared-auth-roles-US2-TC16-1: Treasurer holds no inventory grant

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(only operator role is `treasurer`) is signed in to the Grade10 console.
* `<item_1>` is owned by `<collector A>`, no place marks it, and its top move carries one proof.

**Steps:**

1. Read `<item_1>` from the register.
2. Edit `<item_1>`'s title.
3. Transfer `<item_1>` to the custodian with a reason.
4. Request the proof of `<item_1>`'s top move.

**Expected Results:**

* Each step is refused.
* `<item_1>` keeps its title, its owner and its moves.

---

## shared-auth-roles-US3: Case work and money are separate grants

**As an** operator,
**I want** the grants that run a case and the grants that pay against it to sit in different roles,
**so that** a person who only records payouts cannot open a customer's identity document.

### shared-auth-roles-US3-TC1-1: Identity documents open with their own read grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* admin(holds `kyc:read`) is on <grade10 admin vault url>.
* <vault case> holds a customer's identity capture and a signed document.

**Test data:**

| Field | Value |
| --- | --- |
| <vault case> | A vault case whose customer has submitted an identity capture and signed its document |

**Steps:**

1. Open <vault case>'s identity capture.
2. Open <vault case>'s signed document.

**Expected Results:**

* The identity capture shows.
* The signed document shows.

### shared-auth-roles-US3-TC2-1: Staff runs a vault case and is refused its money

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
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* admin(only operator role is `staff`) is on <grade10 admin vault url>.
* <vault case A> is awaiting an agreed cost.
* <vault case B> has an agreed cost and is awaiting payout.
* <vault case C> is a financed case with a repayment due.
* <auction order> is awaiting payment.

**Test data:**

| Field | Value |
| --- | --- |
| <vault case A> | A vault case in progress with no cost agreed |
| <vault case B> | A vault case whose cost is agreed and not yet paid out |
| <vault case C> | A financed vault case, paid out, with a repayment due |
| <auction order> | An auction order with an unpaid invoice |

**Steps:**

1. Start a valuation on <vault case A>.
2. Make an offer on <vault case A>.
3. Try to pay out <vault case B>.
4. Try to record a repayment on <vault case C>.
5. Try to open the vault money book.
6. On <grade10 admin auction url>, try to record a payment against <auction order>.

**Expected Results:**

* Steps 1 and 2 are allowed; <vault case A> shows the valuation started and the offer made.
* The payout, the repayment, the money book and the auction payment are refused.
* <vault case B> shows no payout, <vault case C> no repayment, <auction order> no payment.

### shared-auth-roles-US3-TC3-1: Treasurer pays out but cannot run a case, set its cost or open the identity document

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
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* admin(only operator role is `treasurer`) is on <grade10 admin vault url>.
* <vault case A> is awaiting an agreed cost.
* <vault case B> has an agreed cost, is awaiting payout, and holds a customer's identity document.

**Test data:**

| Field | Value |
| --- | --- |
| <vault case A> | A vault case in progress with no cost agreed |
| <vault case B> | A vault case whose cost is agreed, not yet paid out, with an identity document submitted |

**Steps:**

1. Open <vault case B>.
2. Pay out <vault case B>.
3. Try to start a valuation on <vault case A>.
4. Try to make an offer on <vault case A>.
5. Try to open <vault case B>'s identity document.

**Expected Results:**

* Step 1 shows the case; step 2 is allowed and <vault case B> shows the payout.
* Steps 3, 4 and 5 are refused.
* <vault case A> shows no valuation started and no offer made, and no identity document shows.

### shared-auth-roles-US3-TC4-1: Reading a case does not open the person's identity documents

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
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* admin(holds `vault:read` and does not hold `kyc:read`) is on <grade10 admin vault url>.
* <vault case> holds a customer's identity capture and a signed document.

**Test data:**

| Field | Value |
| --- | --- |
| <vault case> | A vault case whose customer has submitted an identity capture and signed its document |

**Steps:**

1. Open <vault case>.
2. Try to open <vault case>'s identity capture.
3. Try to open <vault case>'s signed document.

**Expected Results:**

* Step 1 shows the case.
* Steps 2 and 3 are refused; neither document shows.

### shared-auth-roles-US3-TC5-1: One person holding staff and treasurer cannot pay out their own offer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* admin(holds `staff` and `treasurer`) is on <grade10 admin vault url>.
* <second operator> holds `treasurer` only.
* <vault case> is awaiting an agreed cost.

**Test data:**

| Field | Value |
| --- | --- |
| <vault case> | A vault case in progress with no cost agreed |
| <second operator> | Another operator, holding `treasurer` only |

**Steps:**

1. Make an offer on <vault case> and have the customer accept it.
2. Try to pay out <vault case>.
3. As <second operator>, pay out <vault case>.

**Expected Results:**

* The offer is made.
* Step 2 is refused and <vault case> shows no payout.
* Step 3 is allowed and <vault case> shows the payout.

## Settled

- **Treasurer and the case** - a treasurer reads the vault case it pays against, and is refused its identity document, starting a valuation on it and making it an offer (Q4)
- **Admin and the whole vocabulary** - `admin` holds every declared permission, the vault payout and the identity read included, so one admin can do both (Q5)
- **The signed document** - the signed document printed from an identity capture sits behind `kyc:read` as the capture does, and reading the case reaches neither (Q6)
- **Staff and the vault cost** - `staff` hold `vault:approve` beside `vault:operate`, so staff set a case's cost and `treasurer` alone moves its money (Q7)
- **Staff and treasurer together** - one person may hold both; nobody approves an act they recorded, so the offer's maker is refused its payout (Q9)
- **A refused document read** - no trail is owed for it: the identity trail records refusals of ban, unban, set-role and revoke, and the vault trail files acts that change a case and reads that declare an entry (Q8)

## Reconciliation

**Run:** QA2, 2026-10-01. QA1's blind pass read the Feature set, the journeys, the proposal, `decisions.md`, the roles PRD page, the durable roles suite and `shared/auth/domain-tcs.md` with their Reconciliation stripped, and the two rulebooks; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. After it ran, the non-anchor leaf "Split by cost" was clarified to name running a flow, setting its cost and moving money as separate actions, with no vault money grant shared by staff and treasurer, and acceptance review later narrowed it to the vault; no QA1 case read the leaf otherwise. QA2 read QA1's suite and raised list, the delta spec, `tech-design.md`, `tasks.md`, the durable spec and suite, and `ROLE_PERMISSIONS` in grade10's `packages/grade10-auth/contracts/src/schemas.ts`. It is a statement, not proof.

- **Raised, answered by the scenario pass** - all five rows, landed as Q4 to Q8: the treasurer reads the case it pays against (`shared-auth-roles-SC-13`; `shared-auth-roles-US3-TC3-1` gains the read); admin holds the payout and the identity read (`shared-auth-roles-SC-18`, out of suite); the signed document sits behind `kyc:read` (`shared-auth-roles-SC-11`; `shared-auth-roles-US3-TC1-1` and `shared-auth-roles-US3-TC4-1` open both documents); staff hold `vault:approve` (`shared-auth-roles-SC-12`; `shared-auth-roles-US3-TC2-1`); a refused document read owes no trail, by `shared/auth/audit` and `grade10-admin/vault/operator-queue`, so no case here asserts one
- **Raised, escalated** - none; the staff-and-treasurer pair, the proposal's open question and raised by no reader, was answered by the product owner as Q9 after this run
- **Raised, rejected** - none
- **Joined** - `shared-auth-roles-SC-16` into `shared-auth-roles-US2-TC11-1`, which gains the order read, the shipment, the operate action, the catalogue write and the vault case, and whose refund refusal also reaches the durable `shared-auth-roles-SC-15`; `shared-auth-roles-SC-12` into `shared-auth-roles-US3-TC2-1`, which gains the repayment, the money book and the auction payment; `shared-auth-roles-SC-13` into `shared-auth-roles-US3-TC3-1`; `shared-auth-roles-SC-11` into `shared-auth-roles-US3-TC4-1`, which gains the signed document; the durable `shared-auth-roles-SC-07a`, which no durable case reaches, into `shared-auth-roles-US2-TC14-1`'s catalogue write
- **Added by QA2** - `shared-auth-roles-US2-TC14-1` for `shared-auth-roles-SC-19`, staff at the grading counter, bookings and stock, which no blind case reached; `shared-auth-roles-US3-TC5-1` for `shared-auth-roles-SC-22`, added with Q9: one person holding both roles is refused the payout of their own offer, and a second person records it
- **Dropped as unobservable** - acceptance review dropped `shared-auth-roles-US2-TC10-1`, `shared-auth-roles-US2-TC12-1` and `shared-auth-roles-US2-TC13-1`: none is runnable or observable at api or e2e as written. Their scenarios `shared-auth-roles-SC-20`, `shared-auth-roles-SC-18` and `shared-auth-roles-SC-21` are out of suite, each with its verifier in grade10's `packages/grade10-auth/contracts/test/roles.test.ts` named on the suite's `**Out of suite:**` line. The unknown-name and undeclared-permission refusals stay with the durable `shared-auth-roles-US1-TC2-1` and `shared-auth-roles-US2-TC3-1` and the units. The operator-visible permission list is the Permissions tab, which `grade10-admin/console/roles-and-permissions` owns and walks
- **Patched, not re-run** - `shared-auth-roles-US3-TC2-1` and `shared-auth-roles-US3-TC3-1` name the vault acts by the spec's words, starting a valuation for the operate action and an offer for the cost. Both keep `<v>`
- **Kept beside a near neighbour** - `shared-auth-roles-US3-TC4-1` beside `shared-auth-roles-US3-TC3-1`: the first holds the grant rule for both documents, whoever holds `vault:read`; the second the treasurer's whole split
- **Contradicted** - none: every QA1 outcome agrees with the delta's role table and `ROLE_PERMISSIONS`
- **Uncovered anchors** - none: `shared-auth-roles-US-02` has two new cases beside the durable nine, `shared-auth-roles-US-03` has five; the Feature set's "Two people on an approval" leaf is walked by `shared-auth-roles-US3-TC5-1`, and its "Split by cost" and "Identity documents" leaves by `shared-auth-roles-US3-TC2-1`, `shared-auth-roles-US3-TC3-1` and `shared-auth-roles-US3-TC4-1`, and "Resources and actions" by the durable `shared-auth-roles-US2-TC3-1`

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journey, the proposal, `decisions.md` with its empty `## Raised`, the Roles and Items PRD pages, the durable roles suite and `shared/auth/domain-tcs.md` with their Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite, the delta spec, `tech-design.md`, `tasks.md` and the items delta. It is a statement, not proof.

- **Folded** - `shared-auth-roles-US2-TC15-1` into `shared-auth-roles-SC-23` for staff and admin, also reaching `grade10-admin-inventory-items-SC-44`; `shared-auth-roles-US2-TC16-1` into `shared-auth-roles-SC-23` for the treasurer and `grade10-admin-inventory-items-SC-68`
- **Added by QA2** - none
- **Raised, answered by the round** - read-only grant sets no role holds (Q45); `shared-auth-roles-SC-24` is stated for that reason and is out of suite
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none: US-02 has two new cases beside the durable fourteen; the modified requirements' other scenarios keep their durable cases
