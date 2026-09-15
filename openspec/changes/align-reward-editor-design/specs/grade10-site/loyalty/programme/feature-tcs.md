# grade10-site/loyalty/programme Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-loyalty-programme-US9: Operator authors a reward's full definition from the console

**As an** operator,
**I want** the reward form to set a reward's kind, discount, scope and combine setting,
**so that** publishing any reward never needs the admin API.

### grade10-site-loyalty-programme-US9-TC1-1: A money-off reward is created from the console alone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* Operator signed in to the Grade10 admin with the rewards catalogue grant.
* Catalogue carries at least one variant.

**Steps:**

1. Navigate to <grade10 admin url>/rewards/new.
2. Choose Money off, an amount, and Named variants with one variant picked.
3. Choose Store default under Stacks with the shop's own discounts.
4. Fill name and cost, then create the reward.

**Expected Results:**

* Reward is listed on the rewards page.
* Reopened, it shows the same kind, amount, variant and combine setting.

### grade10-site-loyalty-programme-US9-TC2-1: A free item is created from one variant

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
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* Operator signed in to the Grade10 admin with the rewards catalogue grant.
* Catalogue carries at least one variant.

**Steps:**

1. Navigate to <grade10 admin url>/rewards/new.
2. Choose Free item and pick one variant.
3. Fill name and cost, then create the reward.
4. Reopen the reward from the rewards page.

**Expected Results:**

* Rewards page terms read Everything off that variant.
* Reopened, Free item is chosen with that variant picked.

### grade10-site-loyalty-programme-US9-TC3-1: A stored free item reopens and duplicates as a free item

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
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* Reward stored as a product coupon at 100%, with no maximum discount,
  scoped to one variant, with a minimum spend of HKD 500.

**Steps:**

1. Navigate to <grade10 admin url>/rewards/<that reward's address>.
2. Check the kind, the picked item and the minimum spend.
3. Press Duplicate.
4. Check the kind, the picked item and the minimum spend on the new reward.

**Expected Results:**

* Free item is the chosen kind on both.
* Stored variant is the picked item on both.
* Minimum spend reads HKD 500 on both.

### grade10-site-loyalty-programme-US9-TC4-1: A 100% discount on two variants reopens as money off

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* Reward stored as a product coupon at 100%, with no maximum discount,
  scoped to two variants.

**Steps:**

1. Open the reward in the reward form.
2. Check the kind, the discount and the picked variants.

**Expected Results:**

* Money off is the chosen kind.
* Discount reads Everything (free).
* Both variants are picked.

### grade10-site-loyalty-programme-US9-TC5-1: A capped 100% discount on one variant reopens as money off

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* Reward stored as a product coupon at 100%, with a maximum discount of
  HKD 100, scoped to one variant.

**Steps:**

1. Open the reward in the reward form.
2. Check the kind, the discount and the picked variant.

**Expected Results:**

* Money off is the chosen kind.
* Discount reads A percentage at 100%, with a maximum discount of HKD 100.
* The variant is picked.
