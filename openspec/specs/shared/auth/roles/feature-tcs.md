# shared/auth/roles Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<console url>` is the Grade10 console of the environment under test. Each operator holds the role a case names and no other operator role.
* Vault fixtures: `<vault case A>` financed, in progress, no cost agreed; `<vault case B>` cost agreed, not yet paid out, with an identity capture and a signed document; `<vault case C>` financed, paid out, a repayment due; `<vault case D>` financed, with a recorded valuation and no offer.
* `<auction order>` has an unpaid invoice; `<paid order>` is paid in full with no refund; `<item_1>` is owned by `<collector A>`, no place marks it, and its top move carries one proof.

## Walk 1: Staff's console

Starting state:

- staff signed in on `<console url>`.

Shared test data:

| Field | Value |
| --- | --- |
| vault case A | as in the Background |

### Route

1. Write a store record, then operate the auction catalogue.
   - Both are saved. `shared.auth-roles.US2-TC1`
2. Open the user directory.
   - No accounts are listed. `shared.auth-roles.US2-TC2`
3. On `<vault case A>`, start the valuation, record one and make an offer.
   - Each shows on the case. `shared.auth-roles.US3-TC1`
4. Open `<vault case B>` and look for its Payouts tab.
   - There is none. `shared.auth-roles.US3-TC2`

## Walk 2: Treasurer's console

Starting state:

- treasurer signed in on `<console url>`.

Shared test data:

| Field | Value |
| --- | --- |
| vault case B | as in the Background |

### Route

1. Record the payout on `<vault case B>`'s Payouts tab.
   - The case shows the payout. `shared.auth-roles.US3-TC1`
2. Open `<vault case A>`'s Case tab, then `<vault case B>`'s Documents tab.
   - No Start the valuation, and no View photograph. `shared.auth-roles.US3-TC2`
3. Look for Inventory in the navigation.
   - There is none. `shared.auth-roles.US2-TC2`

## shared.auth-roles.US1: Collector holds the user role only

**As a** collector who has never been granted an operator role,
**I want** my roles to be `user` only,
**so that** I cannot act as staff by accident.

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
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* `<collector A>`'s stored roles are `user` and `intern`, set outside the console; admin is signed in on `<console url>`.

**Steps:**

1. Open `<collector A>` in the user directory.
2. As `<collector A>`, open the console's user directory and try to ban an account.

**Expected Results:**

* Step 1 reads `user` only; `intern` appears nowhere.
* Step 2 is refused, and the account is not banned.

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
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* `<role>` is signed in on `<console url>`.

**Test data:**

| `<role>` | `<action>` | `<shown>` |
| --- | --- | --- |
| support | list the user directory; ban, and end a session of, an account without `admin` | the accounts listed; the account banned; the session gone |
| staff | write a store record; operate the auction catalogue | both saved |
| staff | on grading's walk-in page, Start at the desk and record a submission; on grading's settings, Approve a change another staff member asked for | the submission listed; the change approved |
| staff | Move an appointment to another free slot; Intake one unit on a stock item | the new slot; stock one higher |
| staff | Open new campaign on the auction Campaigns tab | the campaign listed |
| staff | download `<item_1>`'s top proof, then Transfer it to the custodian with a reason | the proof downloads; the custodian owns it, a new move on top |
| admin | the same as the row above | the same |
| support and staff together | list the accounts, then write a store record | both allowed |
| auditor | open the identity audit trail | its entries listed |
| finance | Record payment on `<auction order>` | the payment shown |
| admin | Refund 1 minor unit on `<paid order>` | the refund shown |
| staff | Refund the amount paid on `<paid order>` | the refund shown, though staff hold no payment settlement |

**Steps:**

1. Do `<action>`.

**Expected Results:**

* It shows `<shown>`.

<!-- trace:case id=g10.shared-roles.TC-cd2 rev=2 -->
### shared.auth-roles.US2-TC2: Each role is refused what its grants do not allow

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* `<role>` is signed in on `<console url>`.

**Test data:**

| `<role>` | `<tried>` | `<shown>` |
| --- | --- | --- |
| a collector holding `user` only | ban an account from the user directory | refused; the account not banned |
| support | change another account's roles | refused; the roles as they were |
| staff | open the user directory; ban an account | no accounts listed; the ban refused |
| auditor | ban an account, write a store record, change another account's roles | each refused, nothing changed |
| finance | Dispatch and Refund on `<auction order>` | both disabled, naming shipment and refund processing |
| finance | Create listing on Listings, Open new campaign on Campaigns | neither offered |
| finance | Store and Vault in the navigation, then `<vault case B>`'s address | neither in the navigation; the address lands elsewhere |
| treasurer | Inventory in the navigation, then `<item_1>`'s address | no Inventory; `<item_1>` not shown, with no title edit, Transfer or proof download |
| admin holding `user:set-role` | change what a role grants, on another account's page | only who holds a role can change; no control for what it grants |

**Steps:**

1. Try `<tried>`.

**Expected Results:**

* It shows `<shown>`.

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
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* `<operator>` is signed in on `<console url>`, in the vault.

**Test data:**

| `<operator>` | `<action>` | `<shown>` |
| --- | --- | --- |
| holds `kyc:read` | View photograph on `<vault case B>`'s Documents tab, then Download its signed document | the photograph shows; the document downloads |
| staff | on `<vault case A>`, Start the valuation, record a valuation, then Make an offer and send it | the valuation and offer on the case |
| treasurer | Record the payout on `<vault case B>`'s Payouts tab | the payout on the case |

**Steps:**

1. Do `<action>`.

**Expected Results:**

* It shows `<shown>`.

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
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* `<operator>` is signed in on `<console url>`, in the vault.

**Test data:**

| `<operator>` | `<looked for>` | `<shown>` |
| --- | --- | --- |
| staff | the Payouts tab on `<vault case B>` and `<vault case C>`, and the vault's Money tab | none of them |
| staff | Record payment on `<auction order>` | disabled, naming payment processing |
| treasurer | Start the valuation on `<vault case A>`, Make an offer on `<vault case D>` | neither offered; neither case changes |
| treasurer | View photograph on `<vault case B>`'s Documents tab | not offered; no identity document |
| holds `vault:read` without `kyc:read` | View photograph and the signed document's Download on `<vault case B>` | the case shows; neither control offered |

**Steps:**

1. Look for `<looked for>`.

**Expected Results:**

* It shows `<shown>`.

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
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**

* admin(holds `staff` and `treasurer`) is signed in on `<console url>`, in the vault; `<second operator>` holds `treasurer` only.

**Steps:**

1. Make and send an offer on `<vault case D>`; have the customer accept it on their vault case page.
2. Select Record the payout on its Payouts tab, and confirm.
3. As `<second operator>`, record the payout.

**Expected Results:**

* Step 2: the dialog reads "Two people" unmet, naming the admin as the one who priced it; confirming is refused and no payout shows.
* Step 3: the dialog reads "Two people" met, and the payout shows.

## Settled

- **Treasurer and the case** - a treasurer reads the vault case it pays against, and is refused its identity document, starting a valuation and making an offer (Q4).
- **Admin and the whole vocabulary** - `admin` holds every declared permission, the vault payout and the identity read included (Q5).
- **The signed document** - it sits behind `kyc:read`, as the capture does; reading the case reaches neither (Q6).
- **Staff and the vault cost** - staff hold `vault:approve` beside `vault:operate`; `treasurer` alone moves the case's money (Q7).
- **Staff and treasurer together** - one person may hold both; nobody approves an act they recorded (Q9).
- **A refused document read** - owes no trail entry (Q8).

## Reconciliation

- **Covered at domain** - `shared.auth-dmn.US5-TC1` walks a saved staff role deciding the person's next action; `shared.auth-dmn.US6-TC1` walks support refused across the console
