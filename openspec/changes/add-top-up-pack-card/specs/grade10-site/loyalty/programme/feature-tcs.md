# grade10-site/loyalty/programme Top-up surface Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-28, tcs-rules r7

## Walk 1: Pick a pack for top-up

Starting state:

* customer(member) is signed in and opens the top-up picker on `<loyalty>`.

Shared test data:

| Field | Value |
| --- | --- |
| loyalty | The member's Membership page |
| pack | 10,000 points at HK$9,500, list HK$10,000 |

### Route

1. Read the 10,000-point pack's row.
   * The card shows the paid points plus the bonus points under the count, with the price. `g10.loyalty-programme.US14-TC1`
2. Read a pack over today's remaining limit.
   * The pack cannot be picked, and its reason is in its name and a tooltip on the warning icon. `g10.loyalty-programme.US14-TC2`

## Background

* The member's surface is `<loyalty>` on the Grade10 site; the top-up picker opens over it.
* Packs are points with an operator-set discount; a pack over what is left of the day's top-up limit cannot be picked.

---

## g10.loyalty-programme.US14: Member buys a points pack

**As a** member,
**I want** to pick a points pack from my membership surface and pay for it,
**so that** I can top up a balance that will not cover what I want.

<!-- trace:case id=g10.loyalty-programme.TC-p7a rev=1 covers=g10.loyalty-programme.SC-x4k -->
### g10.loyalty-programme.US14-TC1: A discounted pack shows its paid points and its bonus

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-14

**Pre-conditions:**

* customer(member) is signed in with the top-up picker open on `<loyalty>`, and `<pack>` is offered.

**Steps:**

1. Read `<pack>`'s row.

**Expected Results:**

* The card shows 10,000 points, with 9,500 plus 500 bonus points under the count, and HK$9,500.

<!-- trace:case id=g10.loyalty-programme.TC-q3d rev=1 covers=g10.loyalty-programme.SC-9m2 -->
### g10.loyalty-programme.US14-TC2: A pack over today's limit cannot be picked and says why

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-14

**Pre-conditions:**

* customer(member) is signed in with the top-up picker open on `<loyalty>`, and one offered pack is more than what is left of today's top-up limit.

**Steps:**

1. Try to pick the pack over the limit.
2. Hover the warning icon beside its points count.

**Expected Results:**

* Step 1 leaves the pack unpicked, and its accessible name states the reason.
* Step 2 shows the same reason in a tooltip, and the card body shows no other reason text.
