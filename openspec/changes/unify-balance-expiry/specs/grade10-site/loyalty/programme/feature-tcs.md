# grade10-site/loyalty/programme Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-loyalty-programme-US2: Member earns only on what they actually paid

**As a** member,
**I want** points from qualifying goods I paid for, and inactivity to expire the balance,
**so that** a discount, a gift card, or an auction win does not invent earn, and a quiet year empties spendable points.

### grade10-site-loyalty-programme-US2-TC6-1: Operator points take the date the balance already names

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding 60 live points) whose whole balance expires on <balance expiry day>.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Credit | Amount | Day the added points expire |
| --- | --- | --- |
| Correction | 50 points | <balance expiry day> |
| Campaign grant | 100 points | <balance expiry day> |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Add the row's credit with a reason.
3. Read the member's expiry line on <grade10 loyalty url>.

**Expected Results:**

* The member's expiry line still reads <balance expiry day>.
* The added points expire on the day the row names.

### grade10-site-loyalty-programme-US2-TC7-1: Backdated grant joins the window already running

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
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding 60 live points) whose whole balance expires on <balance expiry day>.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Grant | 100 campaign points |
| Date on the grant | <a day before today> |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Add the grant dated <a day before today>, with a reason.
3. Read the member's expiry line on <grade10 loyalty url>.

**Expected Results:**

* The 100 granted points expire on <balance expiry day>.
* The member's expiry line has not moved.

### grade10-site-loyalty-programme-US2-TC8-1: Operator points to an empty balance start the window

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
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding no live points) whose <lapsed amount> lapsed on <lapse day>.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Grant | 50 campaign points |
| <lapsed amount> | 200 points |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Add the grant today, with a reason.
3. Read the member's balance and expiry line on <grade10 loyalty url>.

**Expected Results:**

* The balance reads 50 points, expiring twelve months after today.
* The <lapsed amount> that lapsed on <lapse day> does not count again.

### grade10-site-loyalty-programme-US2-TC9-1: A reward handed over outright is not the member's activity

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding 60 live points) whose whole balance expires on <balance expiry day>, with no purchase or redemption since.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Give them a reward outright, taking no points for it.
3. Read the member's expiry line on <grade10 loyalty url>.

**Expected Results:**

* The membership summary loads with one expiry line.
* That line still reads <balance expiry day>.

### grade10-site-loyalty-programme-US2-TC10-1: A reversal into a lapsed balance returns nothing spendable

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member who paid <points paid> at checkout) whose balance lapsed on <lapse day>, after that payment.
* That payment in points can still be reversed.

**Test data:**

| Field | Value |
| --- | --- |
| <points paid> | 200 points |

**Steps:**

1. Reverse that payment in points.
2. Read the member's balance on <grade10 loyalty url>.

**Expected Results:**

* No points return: no credit against that payment appears in the member's activity.
* The member has nothing to spend.
* The answer names the <points paid> it could not return.

### grade10-site-loyalty-programme-US2-TC11-1: A refund claws points back without moving the expiry date

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-02

**Pre-conditions:**

* customer(member holding 60 live points) whose whole balance expires on <balance expiry day>.
* One of that member's purchases can still be refunded.

**Steps:**

1. Refund that purchase in full.
2. Read the member's balance and expiry line on <grade10 loyalty url>.

**Expected Results:**

* The points that purchase earned leave the balance.
* The expiry line still reads <balance expiry day>.

---

## grade10-site-loyalty-programme-US4: Member reads two counts and redeems from one surface

**As a** member,
**I want** my tier, balance, and activity on one surface, in the programme's dates,
**so that** I can join, redeem, and never see the operator's reasons behind an entry.

### grade10-site-loyalty-programme-US4-TC5-1: Membership summary names one expiry line

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
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(member holding <live balance>) whose whole balance expires on <balance expiry day>.

**Test data:**

| Field | Value |
| --- | --- |
| <live balance> | 160 points |

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read the membership section.

**Expected Results:**

* One line names <live balance> and <balance expiry day>.
* No second expiry figure sits beside it.

### grade10-site-loyalty-programme-US4-TC6-1: Member holding no points is shown no expiry line

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(member holding no live points).

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read the membership section.

**Expected Results:**

* The membership section loads with nothing to spend.
* No expiry line is shown.

---

### grade10-site-loyalty-programme-US4-TC7-1: Expiry line warns inside the last 30 days

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(member holding points whose balance expires in `<days>`).

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read the membership section.

**Expected Results:**

* The expiry line is shown in the `<tone>` tone.
* The line says what keeps the points when the tone is the warning one.

**Test data:**

| days | tone |
| --- | --- |
| 9 | warning |
| 0 | warning |
| 120 | plain |

---

## grade10-site-loyalty-programme-US5: Operator runs the programme from one console

**As an** operator,
**I want** each action behind a named permission, with a record that cannot be rewritten,
**so that** I can correct, reverse, and find a member without holding powers I was not given.

### grade10-site-loyalty-programme-US5-TC8-1: Restart lands one window from today

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* customer(member holding 120 live points) whose whole balance expires on <balance expiry day>, inside the next twelve months.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Reason | Goodwill for a delayed order |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Restart their expiry window, giving the reason.
3. Open the operator log.

**Expected Results:**

* The whole balance now expires twelve months after today.
* The log carries the restart and the reason the operator gave.

### grade10-site-loyalty-programme-US5-TC9-1: Restart writes off what already lapsed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* customer(member whose <lapsed amount> lapsed on <lapse day>), holding <points after lapse> recorded after that day.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| <lapsed amount> | 200 points |
| <points after lapse> | 50 points |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Restart their expiry window, giving a reason.
3. Read the member's balance and expiry date.

**Expected Results:**

* The <lapsed amount> stays written off and does not return.
* Only the <points after lapse> expire, twelve months after today.

### grade10-site-loyalty-programme-US5-TC10-1: Restart leaves a window already further out

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* customer(member holding 120 live points) whose whole balance expires on <far expiry day>, more than twelve months from today.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Restart their expiry window, giving a reason.
3. Read the member's expiry date.

**Expected Results:**

* The console takes the restart.
* The expiry date still reads <far expiry day>.

### grade10-site-loyalty-programme-US5-TC11-1: Restart moves no points and reaches no activity

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
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* customer(member holding <live balance>) whose activity list ends with <last activity>.
* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| <live balance> | 160 points |
| <last activity> | A redemption the member made |

**Steps:**

1. Open that member on <grade10 loyalty admin url>.
2. Restart their expiry window, giving a reason.
3. Read the member's activity on <grade10 loyalty url>.

**Expected Results:**

* The balance still reads <live balance>.
* The activity list still ends with <last activity>, and names no restart.

### grade10-site-loyalty-programme-US5-TC12-1: Form names the expiry day before the points are written

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-05

**Pre-conditions:**

* admin(holds the permission to move points) is on <grade10 loyalty admin url>.

**Test data:**

| Member | Balance | What the form names |
| --- | --- | --- |
| <live member> | 60 points expiring <balance expiry day> | <balance expiry day>, joining the window already running |
| <lapsed member> | no live points | twelve months from today, starting the member's window |

**Steps:**

1. Open the row's member on <grade10 loyalty admin url>.
2. Open the form that adds points.

**Expected Results:**

* The form names the day the row gives, before anything is written.
* It says whether those points start the member's window or join one.
