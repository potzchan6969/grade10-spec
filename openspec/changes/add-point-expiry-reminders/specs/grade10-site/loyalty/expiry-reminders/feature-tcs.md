# grade10-site/loyalty/expiry-reminders Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## Background

* Every time is Hong Kong time (Asia/Hong_Kong), the programme's clock.
* Each case sets the programme's clock and seeds its own members' balances; nothing carries between cases.
* A member's day is the day their whole balance lapses, at the time of day the case names.

## grade10-site-loyalty-expiry-reminders-US1: Who is owed a reminder before their points lapse

**Walked by:** nobody on their own - nothing delivers a reminder, so no member or operator reaches this capability; the member's story arrives with the change that binds a channel to it, and the expiry rule it reads is walked in `grade10-site/loyalty/programme`

**As a** customer(member) whose points are close to lapsing,
**I want** the programme to know I am owed a warning, naming the day and the points,
**so that** a channel chosen later can warn me before my points go.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-5wk rev=1 covers=g10.loyalty-expiry-reminders.SC-bhb,g10.loyalty-expiry-reminders.SC-7q3,g10.loyalty-expiry-reminders.SC-quh -->
### grade10-site-loyalty-expiry-reminders-US1-TC1-1: A member is owed a reminder once their day falls within the lead time

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Raising a reminder

**Pre-conditions:**

* The programme carries the lead times `<lead times>`.
* The programme's clock reads `<now>`.
* customer(member) `<member_1>` holds `<balance>` points, lapsing at 18:00 on `<day>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lead times>` | 30 days |
| `<now>` | 2027-01-03 10:00 |
| `<day>` | the date of `<now>` plus `<days away>` |

| `<days away>` | `<balance>` | Outcome |
| --- | --- | --- |
| 30, at the limit | 500 | owed |
| 29 | 500 | owed |
| 29 | 1, the smallest balance | owed |
| 0, the day itself, before 18:00 | 500 | owed |

**Steps:**

1. Ask the programme which members are owed a reminder.

**Expected Results:**

* The answer names `<member_1>` once.
* That reminder names `<day>`, `<balance>` points and the 30-day lead.
* It names `<member_1>` by user id alone: no name, email or mobile number.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-0an rev=1 covers=g10.loyalty-expiry-reminders.SC-7q3 -->
### grade10-site-loyalty-expiry-reminders-US1-TC2-1: Days are counted on the Hong Kong clock

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
* **Trace:** Raising a reminder

**Pre-conditions:**

* The programme carries the lead times `<lead times>`.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on `<day>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lead times>` | 30 days |
| `<day>` | 2027-02-02 |
| `<before midnight>` | 2027-01-02 23:59 (15:59 UTC), 31 days before `<day>` |
| `<after midnight>` | 2027-01-03 00:01 (2027-01-02 16:01 UTC), 30 days before `<day>` |

**Steps:**

1. Set the programme's clock to `<before midnight>`.
2. Ask the programme which members are owed a reminder.
3. Set the programme's clock to `<after midnight>`.
4. Ask the programme which members are owed a reminder.

**Expected Results:**

* Step 2's answer does not name `<member_1>`.
* Step 4's answer names `<member_1>`, with `<day>` and the 30-day lead.
* The UTC date is the same at both steps.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-lb0 rev=1 covers=g10.loyalty-expiry-reminders.SC-qri -->
### grade10-site-loyalty-expiry-reminders-US1-TC3-1: Two lead times on one day raise two reminders

Runs once per row of **Test data**.

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
* **Trace:** Raising a reminder

**Pre-conditions:**

* The programme carries the lead times `<lead times>`.
* The programme's clock reads `<now>`.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on `<day>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lead times>` | 30 and 7 days (any ladder of two leads) |
| `<now>` | 2027-01-03 10:00 |
| `<day>` | the date of `<now>` plus `<days away>` |

| `<days away>` | Reminders for `<member_1>` |
| --- | --- |
| 20 | one, naming the 30-day lead |
| 5 | two, one naming the 30-day lead and one the 7-day lead |

**Steps:**

1. Ask the programme which members are owed a reminder.

**Expected Results:**

* The answer holds the reminders for `<member_1>` the row names.
* Each names `<day>` and 500 points.
* No two name the same lead.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-oxh rev=1 covers=g10.loyalty-expiry-reminders.SC-y1d -->
### grade10-site-loyalty-expiry-reminders-US1-TC4-1: Asking again raises no second reminder

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
* **Trace:** Raising a reminder

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-13.

**Steps:**

1. Ask the programme which members are owed a reminder.
2. Ask the programme which members are owed a reminder.
3. Set the programme's clock to 2027-01-10 10:00.
4. Ask the programme which members are owed a reminder.

**Expected Results:**

* Steps 1 and 2 each name one reminder for `<member_1>`: 2027-01-13, the 30-day lead.
* Step 4 names one reminder for `<member_1>`: 2027-01-13, the 30-day lead.
* Step 4's reminder is the one step 1 named.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-fgk rev=1 covers=g10.loyalty-expiry-reminders.SC-bhb,g10.loyalty-expiry-reminders.SC-t7s,g10.loyalty-expiry-reminders.SC-4yr,g10.loyalty-expiry-reminders.SC-quh -->
### grade10-site-loyalty-expiry-reminders-US1-TC5-1: The answer names every member owed and no other

Runs once per row of **Test data**.

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
* **Trace:** Raising a reminder

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* The programme holds the members `<members>`, and no other.

**Test data:**

| Field | Value |
| --- | --- |
| `<member_A>` | customer(member), 200 points lapsing at 18:00 on 2027-01-13, 10 days away |
| `<member_B>` | customer(member), 200 points lapsing at 18:00 on 2027-02-03, 31 days away |
| `<member_C>` | customer(member), 1 point lapsing at 18:00 on 2027-01-04, 1 day away |
| `<member_D>` | customer(member), holds no points |

| `<members>` | The answer names |
| --- | --- |
| `<member_A>`, `<member_B>`, `<member_C>`, `<member_D>` | `<member_A>` and `<member_C>`, once each |
| `<member_B>`, `<member_D>` | nobody |

**Steps:**

1. Ask the programme which members are owed a reminder.

**Expected Results:**

* The programme answers.
* The answer names the members the row names, and no other.
* Each reminder names its member's own day and points.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-g1r rev=1 covers=g10.loyalty-expiry-reminders.SC-qfb -->
### grade10-site-loyalty-expiry-reminders-US1-TC6-1: A programme with no lead-time setting starts and owes no reminder

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
* **Trace:** Raising a reminder

**Pre-conditions:**

* The programme's configuration holds no lead-time setting.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-04.

**Steps:**

1. Start the programme.
2. Set the programme's clock to 2027-01-03 10:00.
3. Ask the programme which members are owed a reminder.

**Expected Results:**

* Step 1: the programme starts.
* Step 3's answer names nobody.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-yt2 rev=1 covers=g10.loyalty-expiry-reminders.SC-tvk -->
### grade10-site-loyalty-expiry-reminders-US1-TC7-1: Lead times at the limit are accepted

Runs once per row of **Test data**.

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
* **Trace:** Raising a reminder

**Pre-conditions:**

* The programme runs a twelve-month window, and its configuration holds the lead-time setting `<setting>`.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-03.

**Test data:**

| `<setting>` | Reminders for `<member_1>` |
| --- | --- |
| 1 day, the shortest lead | one, naming the 1-day lead |
| 364 days, one day short of the shortest window | one, naming the 364-day lead |

**Steps:**

1. Start the programme.
2. Set the programme's clock to 2027-01-03 10:00.
3. Ask the programme which members are owed a reminder.

**Expected Results:**

* Step 1: the programme starts.
* Step 3's answer holds the reminders the row names, for 2027-01-03.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-sbr rev=2 covers=g10.loyalty-expiry-reminders.SC-aib -->
### grade10-site-loyalty-expiry-reminders-US1-TC8-2: Grade10's programme owes one reminder 30 days ahead

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Raising a reminder

**Pre-conditions:**

* The programme runs Grade10's own configuration.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on `<day>`.

**Test data:**

| `<day>` | Outcome |
| --- | --- |
| 2027-02-02, 30 days away | one reminder: `<member_1>`, 2027-02-02, 500 points, the 30-day lead |
| 2027-02-03, 31 days away | no reminder for `<member_1>` |

**Steps:**

1. Ask the programme which members are owed a reminder.

**Expected Results:**

* The answer for `<member_1>` is the row's Outcome.
* No reminder names any lead other than 30 days.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-iyo rev=1 covers=g10.loyalty-expiry-reminders.SC-9az -->
### grade10-site-loyalty-expiry-reminders-US1-TC9-1: The points stay current while the day stands

Runs once per row of **Test data**.

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
* **Trace:** What a reminder holds

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-13.

**Test data:**

| `<event>` | `<balance after>` |
| --- | --- |
| admin(operator) makes a campaign grant of 100 points | 600 |
| admin(operator) makes a correction taking off 50 points | 450 |
| A refund claws back 30 points the refunded order earned | 470 |
| A whole refund of an order paid wholly with 100 points returns them | 600 |
| A paid order of 2026-01-05, recorded late, earns 12 points | 512 |
| An order of 2025-12-01, older than the window, is recorded | 500 |
| A checkout promises 100 points and is never paid | 500 |

**Steps:**

1. Ask the programme which members are owed a reminder.
2. Apply `<event>` to `<member_1>`.
3. Ask the programme which members are owed a reminder.

**Expected Results:**

* Step 1 names one reminder: `<member_1>`, 2027-01-13, 500 points, the 30-day lead.
* Step 3 names one reminder: `<member_1>`, 2027-01-13, the 30-day lead.
* Step 3's reminder reads `<balance after>` points.
* Step 3's reminder is the one step 1 named.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-gjy rev=1 covers=g10.loyalty-expiry-reminders.SC-vup -->
### grade10-site-loyalty-expiry-reminders-US1-TC10-1: A reminder is gone at once when its day moves

Runs once per row of **Test data**.

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
* **Trace:** Keeping a reminder true

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-13.

**Test data:**

| `<event>` | `<new day>` |
| --- | --- |
| `<member_1>` pays an order of $150 that earns points | 2028-01-03 |
| `<member_1>` pays an order of $8, too small to earn a point | 2028-01-03 |
| `<member_1>` redeems a reward for 100 points | 2028-01-03 |
| admin(operator) restarts `<member_1>`'s window | 2028-01-03 |

**Steps:**

1. Ask the programme which members are owed a reminder.
2. Apply `<event>`.
3. Ask the programme which members are owed a reminder, at once.

**Expected Results:**

* Step 1 names a reminder for `<member_1>` on 2027-01-13.
* Step 3 names no reminder for `<member_1>` on 2027-01-13.
* Step 3 names no reminder for `<member_1>` on `<new day>`.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-bl4 rev=1 covers=g10.loyalty-expiry-reminders.SC-4iv -->
### grade10-site-loyalty-expiry-reminders-US1-TC11-1: A reminder is gone when the balance is brought to nothing

Runs once per row of **Test data**.

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
* **Trace:** Keeping a reminder true

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, all earned by `<order_1>`, lapsing at 18:00 on 2027-01-13.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_1>` | A paid order that earned 500 points |

| `<event>` |
| --- |
| A whole refund of `<order_1>` claws back its 500 points |
| admin(operator) makes a correction taking off 500 points |

**Steps:**

1. Ask the programme which members are owed a reminder.
2. Apply `<event>`.
3. Ask the programme which members are owed a reminder, at once.

**Expected Results:**

* Step 1 names a reminder for `<member_1>` on 2027-01-13.
* Step 3 names no reminder for `<member_1>`.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-dy1 rev=1 covers=g10.loyalty-expiry-reminders.SC-wib -->
### grade10-site-loyalty-expiry-reminders-US1-TC12-1: A reminder is gone the moment the balance lapses

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
* **Trace:** Keeping a reminder true

**Pre-conditions:**

* The programme carries the lead times 30 days.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-13.

**Steps:**

1. Set the programme's clock to 2027-01-13 17:59.
2. Ask the programme which members are owed a reminder.
3. Set the programme's clock to 2027-01-13 18:01.
4. Ask the programme which members are owed a reminder.

**Expected Results:**

* Step 2 names a reminder for `<member_1>`: 2027-01-13, 500 points.
* Step 4 names no reminder for `<member_1>`.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-7xb rev=1 covers=g10.loyalty-expiry-reminders.SC-vup -->
### grade10-site-loyalty-expiry-reminders-US1-TC13-1: A reminder nobody asked for is gone too

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Keeping a reminder true

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-13.
* Nothing has asked the programme who is owed a reminder since 2026-12-14 00:00, 30 days before 2027-01-13.

**Steps:**

1. As admin(operator), restart `<member_1>`'s window.
2. Ask the programme which members are owed a reminder.

**Expected Results:**

* Step 2 names no reminder for `<member_1>` on 2027-01-13.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-2lr rev=1 covers=g10.loyalty-expiry-reminders.SC-q6l -->
### grade10-site-loyalty-expiry-reminders-US1-TC14-1: A raised reminder names no channel and nothing is sent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Delivery

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-13, and has a registered email.

**Steps:**

1. Ask the programme which members are owed a reminder.
2. Open `<member_1>`'s email inbox.
3. Sign in as `<member_1>` and open the profile's Activity list.

**Expected Results:**

* Step 1 names a reminder for `<member_1>` holding no channel.
* Step 2: no mail about expiring points has arrived.
* Step 3: the Activity list has gained no line.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-9gd rev=1 covers=g10.loyalty-expiry-reminders.SC-tvk -->
### grade10-site-loyalty-expiry-reminders-US1-TC15-1: A lead-time setting that cannot work stops the programme starting

Runs once per row of **Test data**.

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
* **Trace:** Raising a reminder

**Pre-conditions:**

* The programme runs a `<window>` window, and its configuration holds the lead-time setting `<setting>`.

**Test data:**

| `<setting>` | `<window>` | Why it cannot work |
| --- | --- | --- |
| a setting with no lead in it | twelve-month | no lead |
| 30 and 30 days | twelve-month | a lead repeated |
| 0 days, at the limit | twelve-month | a lead under 1 day |
| 365 days, at the limit | twelve-month | as long as the shortest the window can run |
| 181 days, at the limit | six-month | as long as the shortest the window can run |

**Steps:**

1. Start the programme.

**Expected Results:**

* The programme does not start.
* The start-up failure names the lead-time setting and the row's reason.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-plu rev=1 covers=g10.loyalty-expiry-reminders.SC-jbb -->
### grade10-site-loyalty-expiry-reminders-US1-TC16-1: Deleting the account drops the member's reminder

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
* **Trace:** Keeping a reminder true

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-13.

**Steps:**

1. Ask the programme which members are owed a reminder.
2. Delete `<member_1>`'s account.
3. Ask the programme which members are owed a reminder, at once.

**Expected Results:**

* Step 1 names a reminder for `<member_1>` on 2027-01-13.
* Step 3 names no reminder for `<member_1>`.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-pdh rev=2 covers=g10.loyalty-expiry-reminders.SC-r8n -->
### grade10-site-loyalty-expiry-reminders-US1-TC17-2: Points returned to the running day are owed the same reminder again

Runs once per row of **Test data**.

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
* **Trace:** Keeping a reminder true

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` earned 600 points on 2026-01-03 and spent 100 of them by `<spend>` at 18:00 on 2026-01-13, so `<balance>` points lapse at 18:00 on 2027-01-13.

**Test data:**

| Field | Value |
| --- | --- |
| `<order_1>` | A paid order of $300 in qualifying goods: 100 points and $200 in money, which earned 20 points; step 2 takes those 20 too, so a refund claws back nothing |

| `<spend>` | `<balance>` | `<return>` |
| --- | --- | --- |
| redeeming `<reward_1>`, whose coupon stays unused | 500 | admin(operator) reverses the redemption of `<reward_1>` |
| paying toward `<order_1>` | 520 | a refund of every qualifying good in `<order_1>` |
| paying toward `<order_1>` | 520 | admin(operator) returns the points paid toward `<order_1>` from the loyalty admin |

**Steps:**

1. Ask the programme which members are owed a reminder.
2. As admin(operator), make a correction taking off every point `<member_1>` holds.
3. Ask the programme which members are owed a reminder.
4. Apply `<return>`, giving back the 100 points.
5. Ask the programme which members are owed a reminder.

**Expected Results:**

* Step 1 names one reminder: `<member_1>`, 2027-01-13, `<balance>` points, the 30-day lead.
* Step 3 names no reminder for `<member_1>`.
* Step 5 names one reminder: `<member_1>`, 2027-01-13, 100 points, the 30-day lead.
* Step 5's reminder is the one step 1 named.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-spx rev=1 covers=g10.loyalty-expiry-reminders.SC-eci -->
### grade10-site-loyalty-expiry-reminders-US1-TC18-1: A lead time taken out of the setting is owed nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Keeping a reminder true

**Pre-conditions:**

* The programme carries the lead times 30 and 7 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-08.

**Steps:**

1. Ask the programme which members are owed a reminder.
2. Change the lead-time setting to 30 days alone, and start the programme again.
3. Ask the programme which members are owed a reminder.

**Expected Results:**

* Step 1 names two reminders for `<member_1>` on 2027-01-08: one naming the 30-day lead, one the 7-day lead.
* Step 3 names one reminder for `<member_1>`: 2027-01-08, 500 points, the 30-day lead.
* Step 3's reminder is the 30-day reminder step 1 named.
* Step 3 names no reminder with the 7-day lead.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-6nx rev=1 covers=g10.loyalty-expiry-reminders.SC-vup -->
### grade10-site-loyalty-expiry-reminders-US1-TC19-1: A day moved but still within the lead owes a reminder for the new day

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
* **Trace:** Keeping a reminder true

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points; their latest purchase was at 18:00 on 2026-01-13, so the balance lapses at 18:00 on 2027-01-13.

**Test data:**

| Field | Value |
| --- | --- |
| `<late order>` | A paid order of `<member_1>`'s dated 18:00 on 2026-01-20, recorded late, earning 10 points |

**Steps:**

1. Ask the programme which members are owed a reminder.
2. Record `<late order>`.
3. Ask the programme which members are owed a reminder, at once.

**Expected Results:**

* Step 1 names one reminder: `<member_1>`, 2027-01-13, 500 points, the 30-day lead.
* Step 3 names no reminder for `<member_1>` on 2027-01-13.
* Step 3 names one reminder: `<member_1>`, 2027-01-20, 510 points, the 30-day lead.

<!-- trace:case id=g10.loyalty-expiry-reminders.TC-5lh rev=1 covers=g10.loyalty-expiry-reminders.SC-4iv -->
### grade10-site-loyalty-expiry-reminders-US1-TC20-1: Points granted onto a balance brought to nothing owe no reminder for the old day

Runs once per row of **Test data**.

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
* **Trace:** Keeping a reminder true

**Pre-conditions:**

* The programme carries the lead times 30 days.
* The programme's clock reads 2027-01-03 10:00.
* customer(member) `<member_1>` holds 500 points, lapsing at 18:00 on 2027-01-13.

**Test data:**

| `<credit>` |
| --- |
| a campaign grant of 50 points |
| a correction adding 50 points |

**Steps:**

1. Ask the programme which members are owed a reminder.
2. As admin(operator), make a correction taking off every point `<member_1>` holds.
3. As admin(operator), add `<credit>` to `<member_1>`.
4. Ask the programme which members are owed a reminder.

**Expected Results:**

* Step 1 names one reminder: `<member_1>`, 2027-01-13, 500 points, the 30-day lead.
* Step 4 names no reminder for `<member_1>`: the 50 points lapse on 2028-01-03.

## Settled

- **The day exactly a lead time away** - owed, as the profile's 30-day warning counts it
- **A lead time taken out of the setting** - owed nothing once the programme starts without it; a lead it still carries keeps the same reminder
- **Grade10's lead times** - one lead of 30 days, Q5
- **Points returned to the running day** - points a reversal gives back, or points paid at checkout that a refund or an operator returns, are owed the same reminder again, never a second one

## Reconciliation

**Run:** QA1 blind feature pass, 2026-10-06, tcs-rules r4. Read the `## Purpose` and `## Feature set` of the change's `expiry-reminders` `spec.md`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised`, `docs/prds/products/grade10-site/loyalty/expiry-reminders.md`, `points.md`, `operator-console.md`, `profile.md`, `paying-with-points.md`, `rewards.md` and `index.md`, `openspec/config.yaml`'s `context`, `docs/governance/specs-to-test-cases.md` and `tcs-conventions.md`. Denied: every `## Requirements` section, `tech-design.md`, `tasks.md`, QA2 material and `openspec/changes/archive/`. No `ui-design.md`, no earlier suite and no domain suite above the capability existed.

**Run:** QA2 reconciliation, 2026-10-06, in a fresh context. Joined the sixteen blind cases and the delta's sixteen scenarios on the anchors `Raising a reminder`, `What a reminder holds`, `Keeping a reminder true` and `Delivery`. Read the delta `spec.md` whole, `user-journeys.md`, `proposal.md`, `decisions.md`, `tech-design.md`, `tasks.md`, the pages [Expiry Reminders](../../../../../../../docs/prds/products/grade10-site/loyalty/expiry-reminders.md) and [Points](../../../../../../../docs/prds/products/grade10-site/loyalty/points.md), and in grade10 the profile's expiry warning and the ledger's lot restoration and expiry rule. No durable spec, suite or `## Settled` exists for this capability, and no `domain-tcs.md` traces it. Since the blind pass the delta added the sub-bullet `Grade10's lead times` under `Raising a reminder`; the root groups are unchanged.

**Run:** QA2 rerun, accept-review fix round 2, 2026-10-06. Q10 settles that points a refund gives back take the day still running, as a reversal's do; `grade10-site-loyalty-expiry-reminders-SC-17` names both, and US1-TC17 gains the refund row. The anchors are unchanged.

**Run:** QA1 blind feature pass, accept-review round 3, 2026-10-06, tcs-rules r4, in a fresh context. Read the `## Purpose` and `## Feature set` of the change's `expiry-reminders` and `programme` `spec.md`, both `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised`, the pages Expiry Reminders, Points, Rewards, Paying with Points, Operator Console, Profile and the loyalty index, `openspec/config.yaml`'s `context`, this suite above `## Reconciliation` with its `## Settled`, and both rulebooks. No loyalty `domain-tcs.md`, `product-tcs.md` or `platform-tcs.md` exists, and the change walks journeys in one capability only, so no suite above was hit. Denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive; a heading search surfaced this section's earlier Run lines, one naming a scenario id. Added US1-TC19 and US1-TC20, joined a disclosure result to US1-TC1 and a later ask to US1-TC4, restyled US1-TC13 and cut a duplicate refusal row from US1-TC15. No new raised question.

**Run:** QA2 rerun after the round 3 blind pass, 2026-10-06, in a fresh context. Joined the twenty cases and the delta's seventeen scenarios on the same four anchors. Read the delta `spec.md` whole, `tech-design.md`, `tasks.md`, `decisions.md`, the pages Expiry Reminders and Points, the durable programme requirement that the programme holds no names or email addresses, and in grade10 the operator credit's window. Gave US1-TC19 and US1-TC20 their trace markers. The anchors are unchanged, and no scenario, requirement or page line moved.

**Run:** QA2 rerun, accept-review fix round 3, 2026-10-06. Q10 now names an operator's return of points paid at checkout, which runs the same restoration as a refund; `grade10-site-loyalty-expiry-reminders-SC-17` and the page's Owed again line name it, and US1-TC17-2 gains its row. US1-TC8-1 stays blocked on Q5. The anchors are unchanged.

**Run:** QA2 rerun before accept-review round 4, 2026-10-06, in a fresh context. Joined the twenty cases and the delta's seventeen scenarios on the same four anchors; every scenario is reached and none contradicts a case. Read the delta `spec.md` whole, `tech-design.md`, `tasks.md`, `decisions.md`, the pages Expiry Reminders, Points, Operator Console and Rewards, and in grade10 the refund's claw-back reach and the return of points paid at checkout. Three cases sharpened: US1-TC1-1's lead no longer offers any lead from 1 to 364 days, which its 30- and 29-day rows would fail; US1-TC9-1's refund row names an order paid wholly in points, so it earned nothing to claw back; US1-TC17-2's refund rows say the correction already took the 20 points the order earned, so the refund claws back nothing and 100 points come back. No new raised question. The anchors are unchanged.

**Run:** accept-review fix round 4, 2026-10-07. The product owner settled Q5 as one lead of 30 days: the delta's `Grade10's lead times` sub-bullet gains its requirement and `grade10-site-loyalty-expiry-reminders-SC-21`, and US1-TC8-2 revises the blocked case to it. The root groups and the journeys are unchanged.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-loyalty-expiry-reminders-US1-TC1-1` | Reached, sharpened | `grade10-site-loyalty-expiry-reminders-SC-01`; the 30-days row is `grade10-site-loyalty-expiry-reminders-SC-14`, settled as owed by Q7; the 1-point row is `grade10-site-loyalty-expiry-reminders-SC-19`; the lead is 30 days alone, which every row is written to; the member named by user id alone is the programme's own rule that it holds no names or email addresses, so no scenario here restates it |
| `grade10-site-loyalty-expiry-reminders-US1-TC2-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-14`, the day one further off owed nothing, read across Hong Kong midnight |
| `grade10-site-loyalty-expiry-reminders-US1-TC3-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-04` |
| `grade10-site-loyalty-expiry-reminders-US1-TC4-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-05`, asked twice at once and again a week on |
| `grade10-site-loyalty-expiry-reminders-US1-TC5-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-01`, `grade10-site-loyalty-expiry-reminders-SC-02`, `grade10-site-loyalty-expiry-reminders-SC-03` and `grade10-site-loyalty-expiry-reminders-SC-19` in one answer |
| `grade10-site-loyalty-expiry-reminders-US1-TC6-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-07` |
| `grade10-site-loyalty-expiry-reminders-US1-TC7-1` | Reached, sharpened | `grade10-site-loyalty-expiry-reminders-SC-16`'s lead that starts; the twelve-month window the 364 row rests on is named in the pre-conditions |
| `grade10-site-loyalty-expiry-reminders-US1-TC8-2` | Reached, revised | `grade10-site-loyalty-expiry-reminders-SC-21`, written from Q5's one lead of 30 days; revision 1 was blocked on Q5 and covered `grade10-site-loyalty-expiry-reminders-SC-01` meanwhile |
| `grade10-site-loyalty-expiry-reminders-US1-TC9-1` | Reached, wider | `grade10-site-loyalty-expiry-reminders-SC-15` for the grant, correction and claw-back rows; the reversal, late-record and unpaid-checkout rows read the requirement's count as the balance stands, with no second reminder; the refund row names an order paid wholly in points, so nothing it earned is clawed back |
| `grade10-site-loyalty-expiry-reminders-US1-TC10-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-08`, every activity that moves the day |
| `grade10-site-loyalty-expiry-reminders-US1-TC11-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-09` |
| `grade10-site-loyalty-expiry-reminders-US1-TC12-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-10` |
| `grade10-site-loyalty-expiry-reminders-US1-TC13-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-08` with nothing having read the reminder, as the Gone at once requirement states |
| `grade10-site-loyalty-expiry-reminders-US1-TC14-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-12` |
| `grade10-site-loyalty-expiry-reminders-US1-TC15-1` | Reached, sharpened | `grade10-site-loyalty-expiry-reminders-SC-16`: a row for 181 days on a six-month window added, and the failure naming what it refuses asserted; a negative lead is the 0-day row's refusal, left to the parse's unit test in `tasks.md` 1.1 |
| `grade10-site-loyalty-expiry-reminders-US1-TC16-1` | Reached | `grade10-site-loyalty-expiry-reminders-SC-18` |
| `grade10-site-loyalty-expiry-reminders-US1-TC17-2` | Added, widened | `grade10-site-loyalty-expiry-reminders-SC-17`, which no blind case reached; the same reminder owed again is Q9, and points paid at checkout coming back through a refund or an operator's return are its second and third rows, Q10; the order's own 20 earned points go with the correction, so the refund claws back nothing, as the programme's claw-back reaches only that order's unspent points (grade10 `packages/loyalty/backend/src/services/earning/refunds.ts:58`) |
| `grade10-site-loyalty-expiry-reminders-US1-TC18-1` | Added | `grade10-site-loyalty-expiry-reminders-SC-20`, folded from Q8 |
| `grade10-site-loyalty-expiry-reminders-US1-TC19-1` | Reached, wider | `grade10-site-loyalty-expiry-reminders-SC-08`'s second clause from the other side: a late record moves the day to one already inside the lead, so the old day's reminder is gone and the new day's is owed at once, holding every point |
| `grade10-site-loyalty-expiry-reminders-US1-TC20-1` | Reached, wider | `grade10-site-loyalty-expiry-reminders-SC-09`, and the contrast to `grade10-site-loyalty-expiry-reminders-SC-17`: a grant or a correction onto a balance brought to nothing starts a window of its own, a year off, so the old day is owed nothing again |
| `grade10-site-loyalty-expiry-reminders-SC-20` | Folded | Q8: a lead time the programme starts without is owed nothing; the delta's Gone at once requirement, its feature-set line and the page's Gone at once line gain it, and `tasks.md` 2.1 and 2.3 name it |

- **Raised for the human** - none open: Q5 settles Grade10's lead times as one lead of 30 days
- **Settled by QA2** - the three QA1 rows in `decisions.md` `## Raised` land as Q7, Q8 and Q9: the day exactly a lead time away is owed, as the profile's 30-day warning counts; a lead time taken out of the setting is owed nothing; points a reversal returns to the running day are owed the same reminder again. Each is a page line marked 🚧
- **Folded** - `grade10-site-loyalty-expiry-reminders-SC-20`
- **Rejected** - none
- **Contradicted** - none: where a case and a scenario state the same behaviour they agree
- **Uncovered** - none: every scenario is reached by a case
