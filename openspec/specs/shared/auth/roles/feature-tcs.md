# shared/auth/roles Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-10-24, tcs-rules r7
**Reviewed:** 2026-10-08, tcs-rules r4, lapsed 2026-10-24

## Background

* `<console url>` is the Grade10 console of the environment under test. Each operator holds the role a case names and no other operator role.
* The vault fixtures: `<vault case A>`, financed, in progress, no cost agreed; `<vault case B>`, cost agreed, not yet paid out, with an identity capture and a signed document; `<vault case C>`, financed, paid out, a repayment due; `<vault case D>`, financed, a recorded valuation and no offer.
* `<auction order>` has an unpaid invoice; `<paid order>` is paid in full with no refund; `<item_1>` is owned by `<collector A>`, no place marks it, and its top move carries one proof.

## Walk 1: Staff's console

**Starting state:**

- staff signed in on `<console url>`

### Route

1. Write a store record, then open the auction catalogue and operate it.
   - Both are saved `shared.auth-roles.US2-TC1`
2. Open the user directory.
   - No accounts are listed `shared.auth-roles.US2-TC2`
3. On `<vault case A>`, start the valuation, record a valuation and make an offer.
   - Each is saved and shown on the case `shared.auth-roles.US3-TC1`
4. Open `<vault case B>` and look for its Payouts tab.
   - There is none `shared.auth-roles.US3-TC2`

## Walk 2: Treasurer's console

**Starting state:**

- treasurer signed in on `<console url>`

### Route

1. Open `<vault case B>` and record the payout on its Payouts tab.
   - The case shows the payout `shared.auth-roles.US3-TC1`
2. Open `<vault case A>`'s Case tab, then `<vault case B>`'s Documents tab.
   - No `Start the valuation`, and no `View photograph` `shared.auth-roles.US3-TC2`
3. Look for Inventory in the navigation.
   - There is none `shared.auth-roles.US2-TC2`

## shared.auth-roles.US1: Collector holds the user role only

**As a** collector who has never been granted an operator role,
**I want** my roles to be `user` only,
**so that** I cannot act as staff by accident.

<!-- trace:case id=g10.shared-roles.TC-l66 rev=1 -->
### shared.auth-roles.US1-TC1: A collector holding only the user role is refused operator actions

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* customer(roles are `user` only) is signed in.

**Steps:**

1. Open the console's user directory and try to ban an account.

**Expected Results:**

* The ban is refused, and the account is not banned.

<!-- trace:case id=g10.shared-roles.TC-5hv rev=2 -->
### shared.auth-roles.US1-TC2: A role name nobody declared shows nowhere and grants nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* `<collector A>`'s stored roles are `user` and `intern`, set up outside the console.
* admin is signed in on `<console url>`.

**Steps:**

1. In the user directory, open `<collector A>`.

**Expected Results:**

* The account's roles read `user` only; `intern` appears nowhere on it.

---

## shared.auth-roles.US2: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

<!-- trace:case id=g10.shared-roles.TC-ni5 rev=2 -->
### shared.auth-roles.US2-TC1: Each role can take the actions its grants allow

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* The row's role is signed in on `<console url>`.

**Test data:**

| Role | Action | Shown afterwards |
| --- | --- | --- |
| support | list the accounts in the user directory | the accounts are listed |
| support | ban an account that does not hold `admin` | the account reads banned |
| support | end a session of an account that does not hold `admin` | the session is gone from its list |
| staff | write a store record | the record is saved |
| staff | open the auction catalogue and operate it | the change is saved |
| staff | on grading's walk-in page, select `Start at the desk` and record a submission | the submission is listed |
| staff | on grading's settings, select `Approve` on a change another staff member asked for | the change reads approved |
| staff | in appointments, open a booking and `Move` it to another free slot | the booking shows the new slot |
| staff | on a stock item's product page, select `Intake` and add one unit | stock on hand is one higher |
| staff | on the auction Campaigns tab, select `Open new campaign` and save it | the campaign is listed |
| staff | on `<item_1>`'s page, download the top move's proof, then `Transfer` it to the custodian with a reason | the proof downloads; the custodian reads as owner, with a new move on top |
| admin | the same as the row above | the same |
| support and staff together | list the accounts, then write a store record | both are allowed |
| auditor | open the identity audit trail | the trail's entries are listed |
| finance | on `<auction order>`, select `Record payment` and record it | the order shows the payment |
| admin | on `<paid order>`, select `Refund` and refund 1 minor unit | the order shows the refund |
| staff | on `<paid order>`, select `Refund` and refund the amount paid | the order shows the refund, although staff hold no payment settlement |

**Steps:**

1. Do the row's action.

**Expected Results:**

* The row's result shows.

<!-- trace:case id=g10.shared-roles.TC-cd2 rev=2 -->
### shared.auth-roles.US2-TC2: Each role is refused the actions its grants do not allow

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* The row's role is signed in on `<console url>`.

**Test data:**

| Role | Tried | Shown |
| --- | --- | --- |
| support | change another account's roles | the change is refused; the roles are as they were |
| staff | open the user directory | no accounts are listed |
| staff | ban an account | the ban is refused |
| auditor | ban an account, write a store record, change another account's roles | each is refused, and nothing changes |
| finance | `Dispatch` and `Refund` on `<auction order>` | both disabled, with "Needs shipment processing" and "Needs refund processing" |
| finance | `Create listing` on the Listings tab, `Open new campaign` on the Campaigns tab | neither is offered |
| finance | Store and Vault in the navigation, then the address of `<vault case B>` | neither is in the navigation; the address lands on another section |
| treasurer | Inventory in the navigation, then the address of `<item_1>`'s page | no Inventory section; `<item_1>` is not shown, with no title edit, `Transfer` or proof download |
| admin holding `user:set-role` | change what a role grants, on another account's page | only who holds a role can be changed; what a role grants offers no control |

**Steps:**

1. Try the row's action.

**Expected Results:**

* The row's result shows.

---

## shared.auth-roles.US3: Case work and money are separate grants

**As an** operator,
**I want** the grants that run a case and the grants that pay against it to sit in different roles,
**so that** a person who only records payouts cannot open a customer's identity document.

<!-- trace:case id=g10.shared-roles.TC-w8z rev=2 -->
### shared.auth-roles.US3-TC1: The role that runs a case, the one that pays it, and the identity read each work

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* The row's operator is signed in on `<console url>`, in the vault.

**Test data:**

| Operator | Action | Shown afterwards |
| --- | --- | --- |
| holds `kyc:read` | on `<vault case B>`'s Documents tab, select `View photograph`, then `Download` on the signed document | the photograph shows; the document downloads |
| staff | on `<vault case A>`'s Case tab, select `Start the valuation`, record a valuation, then `Make an offer` and send it | the valuation and the offer show on the case |
| treasurer | open `<vault case B>`, then select `Record the payout` on its Payouts tab | the case shows the payout |

**Steps:**

1. Do the row's action.

**Expected Results:**

* The row's result shows.

<!-- trace:case id=g10.shared-roles.TC-zgr rev=2 -->
### shared.auth-roles.US3-TC2: Case work and money stay out of each other's reach, and the identity read is its own grant

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* The row's operator is signed in on `<console url>`, in the vault.

**Test data:**

| Operator | Looked for | Shown |
| --- | --- | --- |
| staff | the Payouts tab on `<vault case B>` and on `<vault case C>`, and the vault's Money tab | none of them |
| staff | `Record payment` on `<auction order>` | disabled, with "Needs payment processing" |
| treasurer | `Start the valuation` on `<vault case A>`, `Make an offer` on `<vault case D>` | neither is offered, and neither case changes |
| treasurer | `View photograph` on `<vault case B>`'s Documents tab | not offered; no identity document shows |
| holds `vault:read` without `kyc:read` | `View photograph` and the signed document's `Download` on `<vault case B>` | the case shows, but neither control is offered |

**Steps:**

1. Look for the row's controls.

**Expected Results:**

* The row's result shows.

<!-- trace:case id=g10.shared-roles.TC-dak rev=1 -->
### shared.auth-roles.US3-TC3: Nobody pays out an offer they made

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* admin(holds `staff` and `treasurer`) is signed in on `<console url>`, in the vault.
* `<second operator>` holds `treasurer` only.

**Test data:**

| Field | Value |
| --- | --- |
| `<second operator>` | another operator, holding `treasurer` only |

**Steps:**

1. On `<vault case D>`'s Case tab, select `Make an offer` and send it; have the customer accept it on their vault case page.
2. On `<vault case D>`'s Payouts tab, select `Record the payout` and confirm.
3. As `<second operator>`, record the payout on the same tab.

**Expected Results:**

* Step 2: the dialog reads "Two people" as unmet, naming the admin as the one who priced it; confirming is refused and the case shows no payout.
* Step 3: the dialog reads "Two people" as met, and the case shows the payout.

## Settled

- **Treasurer and the case** - a treasurer reads the vault case it pays against, and is refused its identity document, starting a valuation on it and making it an offer (Q4)
- **Admin and the whole vocabulary** - `admin` holds every declared permission, the vault payout and the identity read included, so one admin can do both (Q5)
- **The signed document** - the signed document printed from an identity capture sits behind `kyc:read` as the capture does, and reading the case reaches neither (Q6)
- **Staff and the vault cost** - `staff` hold `vault:approve` beside `vault:operate`, so staff set a case's cost and `treasurer` alone moves its money (Q7)
- **Staff and treasurer together** - one person may hold both; nobody approves an act they recorded, so the offer's maker is refused its payout (Q9)
- **A refused document read** - no trail is owed for it: the identity trail records refusals of ban, unban, set-role and revoke, and the vault trail files acts that change a case and reads that declare an entry (Q8)

## Reconciliation

**Run:** QA2, 2026-10-01. QA1's blind pass read the Feature set, the journeys, the proposal, `decisions.md`, the roles PRD page, the durable roles suite and `shared/auth/domain-tcs.md` with their Reconciliation stripped, and the two rulebooks; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. After it ran, the non-anchor leaf "Split by cost" was clarified to name running a flow, setting its cost and moving money as separate actions, with no vault money grant shared by staff and treasurer, and acceptance review later narrowed it to the vault; no QA1 case read the leaf otherwise. QA2 read QA1's suite and raised list, the delta spec, `tech-design.md`, `tasks.md`, the durable spec and suite, and `ROLE_PERMISSIONS` in grade10's `packages/grade10-auth/contracts/src/schemas.ts`. It is a statement, not proof. Reviewed 2026-10-08.

- **Raised, answered by the scenario pass** - all five rows, landed as Q4 to Q8: the treasurer reads the case it pays against, and `shared-auth-roles-US3-TC3-1` gains the read; admin holds the payout and the identity read, out of suite; the signed document sits behind `kyc:read`, and `shared-auth-roles-US3-TC1-1` and `shared-auth-roles-US3-TC4-1` open both documents; staff hold `vault:approve`, walked by `shared-auth-roles-US3-TC2-1`; a refused document read owes no trail, by `shared/auth/audit` and `grade10-admin/vault/operator-queue`, so no case here asserts one
- **Raised, escalated** - none; the staff-and-treasurer pair, the proposal's open question and raised by no reader, was answered by the product owner as Q9 after this run
- **Raised, rejected** - none
- **Joined** - finance's grants into `shared-auth-roles-US2-TC11-1`, which gains the order read, the shipment, the operate action, the catalogue write and the vault case, and whose refund refusal also reaches the durable refund rule; staff's vault split into `shared-auth-roles-US3-TC2-1`, which gains the repayment, the money book and the auction payment; the treasurer's split into `shared-auth-roles-US3-TC3-1`; the identity-document grant into `shared-auth-roles-US3-TC4-1`, which gains the signed document; staff's catalogue write, which no durable case reached, into `shared-auth-roles-US2-TC14-1`
- **Added by QA2** - `shared-auth-roles-US2-TC14-1`, staff at the grading counter, bookings and stock, which no blind case reached; `shared-auth-roles-US3-TC5-1`, added with Q9: one person holding both roles is refused the payout of their own offer, and a second person records it
- **Dropped as unobservable** - acceptance review dropped `shared-auth-roles-US2-TC10-1`, `shared-auth-roles-US2-TC12-1` and `shared-auth-roles-US2-TC13-1`: none is runnable or observable at api or e2e as written. Their rules are out of suite, each with its verifier in grade10's `packages/grade10-auth/contracts/test/roles.test.ts` named on the suite's `**Out of suite:**` line. The unknown-name and undeclared-permission refusals stay with the durable `shared-auth-roles-US1-TC2-1` and `shared-auth-roles-US2-TC3-1` and the units. The operator-visible permission list is the Permissions tab, which `grade10-admin/console/roles-and-permissions` owns and walks
- **Patched, not re-run** - `shared-auth-roles-US3-TC2-1` and `shared-auth-roles-US3-TC3-1` name the vault acts by the spec's words, starting a valuation for the operate action and an offer for the cost. Both keep `<v>`
- **Kept beside a near neighbour** - `shared-auth-roles-US3-TC4-1` beside `shared-auth-roles-US3-TC3-1`: the first holds the grant rule for both documents, whoever holds `vault:read`; the second the treasurer's whole split
- **Changed in review** - the console offers no per-submission grading approval, so `shared-auth-roles-US2-TC14-1` approves a settings or fee-sheet change; an offer is made only on a financed case with a recorded valuation, so `shared-auth-roles-US3-TC2-1`, `shared-auth-roles-US3-TC3-1` and `shared-auth-roles-US3-TC5-1` start from one, and `shared-auth-roles-US3-TC3-1` looks for each hidden act on a case where it would otherwise show; `shared-auth-roles-US3-TC5-1` reads the payout dialog's "Two people" line; `shared-auth-roles-US2-TC15-1` names the new move apart from the one whose proof it opens
- **Contradicted** - none: every QA1 outcome agrees with the delta's role table and `ROLE_PERMISSIONS`
- **Uncovered anchors** - none: `shared-auth-roles-US-02` has two new cases beside the durable nine, `shared-auth-roles-US-03` has five; the Feature set's "Two people on an approval" leaf is walked by `shared-auth-roles-US3-TC5-1`, and its "Split by cost" and "Identity documents" leaves by `shared-auth-roles-US3-TC2-1`, `shared-auth-roles-US3-TC3-1` and `shared-auth-roles-US3-TC4-1`, and "Resources and actions" by the durable `shared-auth-roles-US2-TC3-1`
