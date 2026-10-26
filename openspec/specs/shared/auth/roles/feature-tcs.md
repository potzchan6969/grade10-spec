# shared/auth/roles Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<console url>` is the Grade10 console of the environment under test. Each operator holds the role a case names and no other operator role.
* What each role may do on a feature's own screen is walked in that feature's suite, and the roles' grants on Roles & Permissions; this suite holds the console's navigation, which no feature owns.

## shared.auth-roles.US2: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

<!-- trace:case id=g10.shared-roles.TC-cd2 rev=2 -->
### shared.auth-roles.US2-TC2: The console's navigation shows only the sections a role's grants reach

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

* `<role>` is signed in on `<console url>`.

**Test data:**

| `<role>` | `<absent>` | `<address opened>` |
| --- | --- | --- |
| finance | Store and Vault | a vault case's address |
| treasurer | Inventory | an item's address |
| auditor | Store, Vault, Inventory and Users | an account's address in Users |
| staff, without `audit:read` | Audit | Audit's address |

**Steps:**

1. Read the navigation.
2. Open `<address opened>`.

**Expected Results:**

* Step 1 shows no `<absent>`.
* Step 2 lands elsewhere, showing nothing of the record.

---

## Settled

- **Treasurer and the case** - a treasurer reads the vault case it pays against, and is refused its identity document, starting a valuation and making an offer (Q4).
- **Admin and the whole vocabulary** - `admin` holds every declared permission, the vault payout and the identity read included (Q5).
- **The signed document** - it sits behind `kyc:read`, as the capture does; reading the case reaches neither (Q6).
- **Staff and the vault cost** - staff hold `vault:approve` beside `vault:operate`; `treasurer` alone moves the case's money (Q7).
- **Staff and treasurer together** - one person may hold both; nobody approves an act they recorded (Q9).
- **A refused document read** - owes no trail entry (Q8).
