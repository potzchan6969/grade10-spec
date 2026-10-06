# grade10-site/store/membership Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-membership-US2: Member identifies and spends at the till

**As a** member,
**I want** a dynamic code or my email to identify me, staff to see the name the site knows me by, and staff to spend my points once,
**so that** a replayed code is refused, a miss discloses nothing, and points settle once whether paid online or at the till.

<!-- trace:case id=g10.store-membership.TC-23a rev=1 covers=g10.store-membership.SC-y0k -->
### grade10-site-store-membership-US2-TC12-1: Till names the member by the site's one rule

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till.
* customer(member) is <member_1>, signed in to the account as <signed-in address>, in the <member state> of the row.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer |
| <shop_1> | A physical store running the Grade10 till |
| <signed-in address> | `kit.lam@example.com` |

| <member state> | The name reads |
| --- | --- |
| Saved `Kit Collector` as the display name on the profile; the account is named `Kit Lam` | `Kit Collector` |
| Never saved a profile; the account is named `Kit Lam` | `Kit Lam` |
| Never saved a profile; the account holds no name | `kit.lam` |

**Steps:**

1. Identify <member_1> by typing <signed-in address> in the till's membership modal.
2. Read the member's name in the modal.
3. Find <member_1>'s customer in the shop's own customer search.
4. Read the name on the customer details badge.

**Expected Results:**

* Step 2 reads the row's name.
* Step 4 reads the same name.

<!-- trace:case id=g10.store-membership.TC-zhi rev=1 covers=g10.store-membership.SC-a70,g10.store-membership.SC-y0k -->
### grade10-site-store-membership-US2-TC13-1: Till shows 會員 when the account service cannot give the name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till.
* customer(member, never saved a profile, account named `Kit Lam`) is <member_1>, signed in to the account as <signed-in address>.
* The account service's name lookup is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer, holding a points balance and a tier |
| <shop_1> | A physical store running the Grade10 till |
| <signed-in address> | `kit.lam@example.com` |

| <surface> | <route> |
| --- | --- |
| The till's membership modal | Identify <member_1> by typing <signed-in address> in the modal |
| The customer details badge | Find <member_1>'s customer in the shop's own customer search |

**Steps:**

1. <route>.
2. Read the name, tier and balance on <surface>.

**Expected Results:**

* Step 2 reads 會員 as the name.
* Step 2 still shows <member_1>'s tier and balance.

<!-- trace:case id=g10.store-membership.TC-g53 rev=1 covers=g10.store-membership.SC-jjw,g10.store-membership.SC-y0k -->
### grade10-site-store-membership-US2-TC14-1: A name saved on the profile shows at the till through an account-service outage

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till.
* customer(member, saved <saved name> as the display name on the profile, account named `Kit Lam`) is <member_1>, signed in to the account as <signed-in address>.
* The account service's name lookup is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer |
| <shop_1> | A physical store running the Grade10 till |
| <signed-in address> | `kit.lam@example.com` |
| <saved name> | `Kit Collector` |

**Steps:**

1. Identify <member_1> by typing <signed-in address> in the till's membership modal.
2. Read the member's name in the modal.
3. Find <member_1>'s customer in the shop's own customer search.
4. Read the name on the customer details badge.

**Expected Results:**

* Step 2 reads <saved name>, not 會員.
* Step 4 reads <saved name>.

<!-- trace:case id=g10.store-membership.TC-80o rev=1 covers=g10.store-membership.SC-ymg -->
### grade10-site-store-membership-US2-TC15-1: Till is sent an 80-character name whole

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
* **Trace:** grade10-site-store-membership-US-02

**Pre-conditions:**

* admin(shop staff) is on <shop_1>'s till.
* customer(member, saved <long name> as the display name on the profile) is <member_1>, signed in to the account as <signed-in address>.

**Test data:**

| Field | Value |
| --- | --- |
| <member_1> | A member paired with a commerce customer |
| <shop_1> | A physical store running the Grade10 till |
| <signed-in address> | `kit.lam@example.com` |
| <long name> | 80 Latin characters, the display name's limit |

**Steps:**

1. Identify <member_1> by typing <signed-in address> in the till's membership modal.
2. Read the API response that answers the modal.
3. Find <member_1>'s customer in the shop's own customer search.
4. Read the API response that answers the customer details badge.

**Expected Results:**

* Step 2 names the member <long name>, all 80 characters.
* Step 4 names the member <long name>, all 80 characters.

## Settled

- A member with a name saved on the profile is named by it at the till through an account-service outage; only a member with none shows 會員.
- The till and the badge are sent the member's name whole; the till lays it out.

## Reconciliation

**Run:** 2026-10-06, second QA2 reconciliation in a fresh context. Read: this suite, the delta `spec.md` and `user-journeys.md`, the durable membership suite for the cases the carried scenarios already have, `proposal.md`, `decisions.md`, `tech-design.md`, `tasks.md`, the Shopify Integration and Member Card in a Wallet pages, and the application repository's `memberName` and POS directory. The blind pass recorded no Run line of its own, so its bundle is not stated here.

- **Raised, settled by the round** — a saved name through an account-service outage (Q21): the till shows the saved name, `grade10-site-store-membership-SC-83`, walked by US2-TC14; the pass's half is settled in the wallet suite. A long name in the till's modal (Q22): the requirement sends it whole, and US2-TC15 asserted it with no scenario to reach; `grade10-site-store-membership-SC-85` now states it, as `grade10-site-store-wallet-member-card-SC-43` does for the pass
- **Rejected** — none
- **Contradicted** — none
- **Cases added after the reconciliation** — US2-TC14 (`grade10-site-store-membership-SC-83`), US2-TC15 (`grade10-site-store-membership-SC-85`): written from the decisions the blind pass raised, so they are not blind
- **Carried unchanged** — the modified requirement changes only the name clause; its other scenarios keep their durable cases
- **Left to the domain** — nothing: `grade10-site-store-e2e-US7-TC1-1` reads a saved name at the till, and US2-TC12 still asserts it with the badge
- **Uncovered** — none

| Scenario | Reached by |
| --- | --- |
| `grade10-site-store-membership-SC-75` | durable US4-TC1, US4-TC4 |
| `grade10-site-store-membership-SC-76` | durable US4-TC3 |
| `grade10-site-store-membership-SC-77` | durable US4-TC2 |
| `grade10-site-store-membership-SC-78` | US2-TC13 |
| `grade10-site-store-membership-SC-83` | US2-TC14 |
| `grade10-site-store-membership-SC-84` | US2-TC12, US2-TC13, US2-TC14 |
| `grade10-site-store-membership-SC-85` | US2-TC15 |
