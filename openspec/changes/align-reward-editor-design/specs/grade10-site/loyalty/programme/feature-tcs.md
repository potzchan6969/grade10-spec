# grade10-site/loyalty/programme Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-loyalty-programme-US9: Operator authors a reward's full definition from the console

**As an** operator,
**I want** the reward form to set a reward's kind, discount, scope and combine setting,
**so that** publishing any reward never needs the admin API.

<!-- trace:case id=g10.loyalty-programme.TC-nzm rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC1-1: A money-off reward is authored from the console alone

Runs once per row of **Test data**.

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

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* The catalogue carries <variant_1>.

**Test data:**

| `<discount>` | `<scope>` | `<stacks with>` |
| --- | --- | --- |
| An amount, <amount> | Named variants, <variant_1> | Store default |
| A percentage, <rate>, maximum discount left empty | The whole order | Choose for this reward, Product discounts alone |
| A percentage, <rate>, maximum discount <cap> | Named variants, <variant_1> | Store default |

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale whose product holds at least two variants |
| `<amount>` | HKD 20.00 (any amount above zero) |
| `<rate>` | 10% (any whole percentage from 1 to 99) |
| `<cap>` | HKD 100.00 (any amount above zero) |
| `<name>` | A name no other reward carries |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Click the Money off card.
2. Enter <discount>.
3. Choose <scope>.
4. Choose <stacks with>.
5. Enter <name> as the reward's name.
6. Enter <cost> as its cost.
7. Click Create reward.
8. Open <name> from the rewards list.

**Expected Results:**

* Step 1 shows the discount and scope fields.
* Step 7 adds <name> to the rewards list.
* Step 8 shows Money off with <discount>, <scope> and <stacks with>.
* Where the row left it empty, the maximum discount is still empty.

<!-- trace:case id=g10.loyalty-programme.TC-bju rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC2-1: A free item is created in two choices

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* The catalogue carries <variant_1>.

**Test data:**

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale whose product holds at least two variants |
| `<variant_2>` | A variant of another product |
| `<name>` | A name no other reward carries |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Click the Free item card.
2. Pick <variant_2> from the item picker.
3. Pick <variant_1> from the item picker.
4. Enter <name> as the reward's name.
5. Enter <cost> as its cost.
6. Read the coupon sentence in the rail.
7. Click Create reward.
8. Open <name> from the rewards list.

**Expected Results:**

* Step 1 shows one item picker and the minimum spend.
* Step 1 shows no discount or scope field.
* Step 1 shows the coupon terms and the menu entry, as for Money off.
* Step 3 shows <variant_1> as the one picked item, and <variant_2> no longer picked.
* Step 6 takes <variant_1> off once it is in the basket.
* Step 6 never says the coupon adds the item.
* Step 7 lists <name>, its terms taking everything off <variant_1>.
* Step 8 shows the Free item card chosen, <variant_1> picked.

<!-- trace:case id=g10.loyalty-programme.TC-7q7 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC3-1: A free item built through money off reopens and duplicates as one

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

* <reward_1> exists, created in the reward form as Money off, Everything (free), Named variants, <variant_1> alone, minimum spend <minimum spend>, stacking with product discounts alone.
* admin(may edit rewards) is on <grade10 admin url>/rewards.

**Test data:**

| Field | Value |
| --- | --- |
| `<reward_1>` | A reward at 100% with no maximum discount, scoped to <variant_1> alone |
| `<variant_1>` | A variant for sale |
| `<minimum spend>` | HKD 500.00 (any amount above zero) |

**Steps:**

1. Open <reward_1> from the rewards list.
2. Open More and click Duplicate.
3. Read the new reward's kind, item, minimum spend and combine setting.

**Expected Results:**

* Step 1 shows the Free item card chosen, <variant_1> picked.
* Step 1 shows <minimum spend> as the minimum spend.
* Step 1 shows the reward stacking with product discounts alone.
* Step 3 shows the Free item card chosen, <variant_1> picked.
* Step 3 shows <minimum spend> as the minimum spend, stacking with product discounts alone.

<!-- trace:case id=g10.loyalty-programme.TC-nuz rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC4-1: Any other product coupon reopens as money off

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
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

* <reward> exists, created in the reward form as Money off with the row's discount and scope.
* admin(may edit rewards) is on <grade10 admin url>/rewards.

**Test data:**

| `<reward>` | Discount | Scope |
| --- | --- | --- |
| Two variants free | Everything (free) | Named variants, <variant_1> and <variant_2> |
| One variant, capped | A percentage, 100%, maximum discount <cap> | Named variants, <variant_1> |
| One variant, below 100% | A percentage, 90% | Named variants, <variant_1> |
| One product free | Everything (free) | Named products, <product_1> |
| Whole order free | Everything (free) | The whole order |

| Field | Value |
| --- | --- |
| `<variant_1>`, `<variant_2>` | Two variants for sale |
| `<product_1>` | A product for sale holding one variant |
| `<cap>` | HKD 100.00 (any amount above zero) |

**Steps:**

1. Open <reward> from the rewards list.
2. Read the kind, the discount and the scope.

**Expected Results:**

* The Money off card is chosen.
* The discount and scope match the row.

<!-- trace:case id=g10.loyalty-programme.TC-tuu rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC5-1: A capped 100% discount on one variant reopens as money off

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** deprecated
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

<!-- trace:case id=g10.loyalty-programme.TC-xlj rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC6-1: A gift with a purchase is created and reopens as a gift

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

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* The catalogue carries <variant_1>.

**Test data:**

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale |
| `<minimum spend>` | HKD 500.00 (any amount above zero) |
| `<name>` | A name no other reward carries |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Click the Gift with a purchase card.
2. Pick <variant_1> as the gift.
3. Enter <minimum spend> as the minimum spend.
4. Enter <name> as the reward's name.
5. Enter <cost> as its cost.
6. Click Create reward.
7. Open <name> from the rewards list.

**Expected Results:**

* Step 1 shows a gift picker and the minimum spend, no discount or scope.
* Step 6 adds <name> to the rewards list.
* Step 7 shows the Gift with a purchase card chosen.
* Step 7 shows <variant_1> as the gift, <minimum spend> as the minimum spend.

<!-- trace:case id=g10.loyalty-programme.TC-gm2 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC7-1: A product or catalog filter scope saves the reward online only

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
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

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* The catalogue carries <variant_1>, <product_1> and a world <world_1>.

**Test data:**

| `<scope>` | Online-only note | Channels before saving | Channels on reopening |
| --- | --- | --- | --- |
| Named products, <product_1> | shown | Online chosen; In store and Both unavailable | Online |
| A catalog filter, worlds = <world_1> | shown | Online chosen; In store and Both unavailable | Online |
| Named variants, <variant_1> | not shown | Both | Both |
| The whole order | not shown | Both | Both |
| Named products, <product_1>, then Named variants, <variant_1> | not shown | Both | Both |

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale |
| `<product_1>` | A product for sale |
| `<world_1>` | A world at least one product for sale carries |
| `<amount>` | HKD 20.00 (any amount above zero) |
| `<name>` | A name no other reward carries |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Click the Money off card.
2. Enter <amount> as an amount off.
3. Choose Both under Where it can be spent.
4. Choose <scope>.
5. Enter <name> as the reward's name.
6. Enter <cost> as its cost.
7. Click Create reward.
8. Open <name> from the rewards list.

**Expected Results:**

* Step 4 shows or hides the online-only note as the row says.
* Step 4 shows the row's channels before saving.
* Step 7 adds <name> to the rewards list.
* Step 8 shows the channels the row names.

<!-- trace:case id=g10.loyalty-programme.TC-0t9 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC8-1: A money-off reward edited into a free item reopens as one

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

* <reward_2> exists: Money off, an amount <amount>, The whole order.
* admin(may edit rewards) is on <grade10 admin url>/rewards.

**Test data:**

| Field | Value |
| --- | --- |
| `<reward_2>` | A live reward created in the reward form |
| `<amount>` | HKD 20.00 (any amount above zero) |
| `<variant_1>` | A variant for sale |

**Steps:**

1. Open <reward_2> from the rewards list.
2. Click the Free item card.
3. Pick <variant_1> as the item.
4. Click Save reward.
5. Reload the page.

**Expected Results:**

* Step 1 shows a note that a new kind reaches only later redemptions.
* Step 2 hides the discount and scope fields.
* Step 5 shows the Free item card chosen, <variant_1> picked.
* Step 5 shows no amount or whole-order scope carried over.

<!-- trace:case id=g10.loyalty-programme.TC-90b rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC9-1: A reward missing a required part is not created

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* The catalogue carries <variant_1>.

**Test data:**

| `<choice>` | `<gap>` | Where the gap is named |
| --- | --- | --- |
| Free item | No item picked | The save bar names the missing item |
| Money off | An amount, left empty | The save bar names the missing amount |
| Money off, an amount <amount>, Named products | No product picked | The save bar names the missing product |
| Gift with a purchase | No gift picked | The save bar names the missing gift |
| Gift with a purchase, <variant_1> picked | The minimum spend, left empty | The save bar names the missing minimum spend |
| Gift with a purchase, <variant_1> picked | The minimum spend, HKD 0.00 | The save bar names the minimum spend |
| Money off, an amount <amount>, A catalog filter | No filter value chosen | The save bar names the missing filter |
| Money off, an amount <amount>, The whole order | In a window, Live until a day before Live from | Live until shows the window ends before it starts |

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale |
| `<amount>` | HKD 20.00 (any amount above zero) |
| `<name>` | A name no other reward carries |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Click the card for <choice>.
2. Enter <name> as the reward's name.
3. Enter <cost> as its cost.
4. Leave <gap> as the row states.
5. Click Create reward.
6. Click the gap's name in the save bar.
7. Click ← Rewards.

**Expected Results:**

* Step 5 names the gap where the row says.
* Where the save bar names the gap, step 6 moves focus to its field.
* Step 7 lists no reward named <name>.

<!-- trace:case id=g10.loyalty-programme.TC-z6o rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC10-1: A free item's basket check takes the item off only when it is held

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
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* The catalogue carries <variant_1> and <variant_2>.

**Test data:**

| `<basket>` | Verdict |
| --- | --- |
| One <variant_1>, one <variant_2> | Takes <variant_1>'s price off |
| One <variant_2> | Nothing in the basket matches the scope |
| One <variant_1> alone | Under the minimum spend |

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale priced under <minimum spend> |
| `<variant_2>` | A variant of another product, priced at or above <minimum spend> on its own |
| `<minimum spend>` | HKD 500.00 (any amount above zero) |
| `<name>` | A name no other reward carries |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Click the Free item card.
2. Pick <variant_1> as the item.
3. Enter <minimum spend> as the minimum spend.
4. Enter <name> as the reward's name.
5. Enter <cost> as its cost.
6. Scroll to the basket check in the rail.
7. Add the lines of <basket> by search.
8. Read the verdict.
9. Click ← Rewards.

**Expected Results:**

* Step 6 shows the basket check open.
* Step 8 shows the row's verdict.
* Step 8 shows no line added to the basket.
* Step 9 lists no reward named <name>.

<!-- trace:case id=g10.loyalty-programme.TC-y2e rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC11-1: The reward editor follows the approved page layout

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* admin(may edit rewards) is on <grade10 admin url>/rewards/new in a window <width> wide.
* The rewards list holds at least one live, one scheduled and one sold-out reward.

**Test data:**

| `<width>` | The rail |
| --- | --- |
| 1280px | beside the form |
| 400px | under the form |

**Steps:**

1. Read the page from the top.
2. Click the Money off card.
3. Scroll to the end of the page.
4. Click ← Rewards above the title.

**Expected Results:**

* Step 1 shows ← Rewards above the title.
* Step 1 shows the kinds as three cards.
* Step 2 shows discount and scope as segmented controls.
* Step 2 shows HKD before each amount.
* Step 2 shows the rail's menu card, coupon sentence and basket check.
* Step 3 keeps the save bar on screen, and the rail where the row says.
* Step 4 opens the rewards list, each state a tinted badge.

<!-- trace:case id=g10.loyalty-programme.TC-2kx rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC12-1: A product-scoped reward stored for the till saves online only

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
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* <reward_3> exists, saved through the admin API as Money off, an amount <amount>, Named products, <product_1>, for online and in store.
* admin(may edit rewards) is on <grade10 admin url>/rewards.

**Test data:**

| `<edit>` | Channels before saving | Channels on reopening |
| --- | --- | --- |
| None | Online chosen; In store and Both unavailable | Online |
| Named variants, <variant_1> | Both | Both |

| Field | Value |
| --- | --- |
| `<reward_3>` | A live reward no other case edits |
| `<product_1>` | A product for sale |
| `<variant_1>` | A variant of <product_1> |
| `<amount>` | HKD 20.00 (any amount above zero) |

**Steps:**

1. Open <reward_3> from the rewards list.
2. Read where the coupon can be spent.
3. Make <edit> to the scope.
4. Read where the coupon can be spent.
5. Click Save reward.
6. Reload the page.

**Expected Results:**

* Step 2 shows Online chosen, In store and Both unavailable.
* Step 4 shows the row's channels before saving.
* Step 6 shows the row's channels on reopening.

<!-- trace:case id=g10.loyalty-programme.TC-rlp rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC13-1: A reward stored with a retired handover keeps it until a choice is made

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* <reward_6> exists, stored as <handover> in the loyalty database; the reward form cannot create it.
* admin(may edit rewards) is on <grade10 admin url>/rewards.

**Test data:**

| `<handover>` | The rail's menu card |
| --- | --- |
| A manual handover | No coupon limit |
| A counter collection of <variant_1>, collected within <days> | Collect in store within <days> |

| Field | Value |
| --- | --- |
| `<reward_6>` | A reward no other case edits |
| `<variant_1>` | A variant for sale |
| `<new name>` | A name no other reward carries |
| `<amount>` | HKD 20.00 (any amount above zero) |
| `<days>` | 7 days (any whole number of days other than 30) |

**Steps:**

1. Read <reward_6>'s terms in the rewards list.
2. Open <reward_6> from the rewards list.
3. Change its name to <new name>.
4. Click Save reward.
5. Read <reward_6> through the admin API.
6. Open More and click Duplicate.
7. Click ← Rewards.
8. Open <new name> from the rewards list.
9. Click the Money off card.
10. Enter <amount> as an amount off.
11. Choose The whole order as the scope.
12. Click Save reward.
13. Read <reward_6> through the admin API.

**Expected Results:**

* Step 1 shows the terms of <handover>, marked retired.
* Step 2 shows a note that <reward_6> is stored with a handover the programme has retired, no card chosen, and no discount, scope or item field.
* Step 2 shows the rail's menu card as the row says, the sentence naming <handover>, and the basket check asking for the coupon to be finished.
* Step 4 saves the reward.
* Step 5 shows <new name>, and <handover> unchanged.
* Step 6 opens a new reward with the Money off card chosen.
* Step 13 shows <reward_6> as a product coupon, <amount> off the whole order.

<!-- trace:case id=g10.loyalty-programme.TC-vet rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC14-1: The basket check reads a verdict for money off and a gift

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
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* The catalogue carries <variant_1>, <variant_2> and <gift>.

**Test data:**

| `<coupon>` | `<basket>` | Verdict |
| --- | --- | --- |
| Money off, an amount <amount>, Named variants, <variant_1> | One <variant_1> | Takes <amount> off, goods down to <variant_1>'s price less <amount> |
| Money off, an amount <amount>, Named variants, <variant_1> | One <variant_2> | Nothing in the basket matches the scope |
| Money off, an amount <odd cut>, Named variants, <variant_1> | One line of two <variant_1> | The discount cannot split |
| Gift with a purchase, <gift>, minimum spend <minimum spend> | One <variant_2> | Adds <gift> free, goods unchanged |
| Gift with a purchase, <gift>, minimum spend <minimum spend> | One <variant_2>, one <gift> | The gift is already in the basket |
| Gift with a purchase, <gift>, minimum spend <minimum spend> | One <variant_1> | Under the minimum spend |

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale priced above <amount> and under <minimum spend> |
| `<variant_2>` | A variant of another product, priced at or above <minimum spend> |
| `<gift>` | A variant for sale of a third product |
| `<amount>` | HKD 20.00 (any amount above zero, under <variant_1>'s price) |
| `<odd cut>` | HKD 0.01 (any amount whose minor units two does not divide) |
| `<minimum spend>` | HKD 500.00 (any amount above zero) |

**Steps:**

1. Click the card <coupon> names.
2. Fill in the rest of <coupon>.
3. Scroll to the basket check in the rail.
4. Add the lines of <basket> by search.
5. Read the verdict.

**Expected Results:**

* Step 5 shows the row's verdict in a tinted box.
* Step 5 shows the basket's lines as step 4 added them.

<!-- trace:case id=g10.loyalty-programme.TC-3z2 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC15-1: The basket check asks for a finished coupon, then a line

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* The catalogue carries <variant_1>.

**Test data:**

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale priced above <amount> |
| `<amount>` | HKD 20.00 (any amount above zero) |

**Steps:**

1. Scroll to the basket check in the rail.
2. Read the basket check.
3. Click the Money off card.
4. Enter <amount> as an amount off.
5. Choose The whole order as the scope.
6. Read the basket check.
7. Add one <variant_1> by search.
8. Read the basket check.

**Expected Results:**

* Step 2 asks for the coupon to be finished first.
* Step 6 asks for a basket line.
* Step 8 shows <amount> taken off <variant_1>'s price.

<!-- trace:case id=g10.loyalty-programme.TC-27v rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC16-1: The basket check names a catalogue it cannot read

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* Looking a basket line up in the catalogue fails.

**Test data:**

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale priced above <amount> |
| `<amount>` | HKD 20.00 (any amount above zero) |

**Steps:**

1. Click the Money off card.
2. Enter <amount> as an amount off.
3. Choose The whole order as the scope.
4. Add one <variant_1> by search.
5. Read the verdict.

**Expected Results:**

* Step 5 says the catalogue could not be read, in an error tint.
* Step 5 takes nothing off and asks to try again.

<!-- trace:case id=g10.loyalty-programme.TC-2c3 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC17-1: Archive takes the reward off the menu

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* <reward_7> is live and on the reward menu.
* admin(may edit rewards) is on <grade10 admin url>/rewards.
* customer(member) is signed in, in a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<reward_7>` | A live reward no other case edits |

**Steps:**

1. Open <reward_7> from the rewards list.
2. Open More beside the title.
3. Click Archive.
4. As customer(member), navigate to <grade10 loyalty url>.
5. Read the reward menu.

**Expected Results:**

* Step 2 lists Duplicate and Archive.
* Step 3 opens the rewards list.
* Step 5 shows no <reward_7>.

<!-- trace:case id=g10.loyalty-programme.TC-k4w rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC18-1: A choice moved to from another opens empty

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
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.
* The catalogue carries <variant_1>.

**Test data:**

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale |

**Steps:**

1. Click the Free item card.
2. Pick <variant_1> from the item picker.
3. Click the Money off card.
4. Read the discount and the scope.
5. Click the Free item card.
6. Read the item picker.

**Expected Results:**

* Step 4 shows An amount with none entered, and Named variants with none picked.
* Step 6 shows no item picked.

<!-- trace:case id=g10.loyalty-programme.TC-p8e rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-2m8,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-ji6,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC19-1: A window of one day is saved

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-09

**Pre-conditions:**

* admin(may edit rewards) is on <grade10 admin url>/rewards/new.

**Test data:**

| Field | Value |
| --- | --- |
| `<day>` | A day after today |
| `<amount>` | HKD 20.00 (any amount above zero) |
| `<name>` | A name no other reward carries |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Enter <amount> as an amount off.
2. Choose The whole order as the scope.
3. Enter <name> as the reward's name.
4. Enter <cost> as its cost.
5. Choose In a window, with <day> as Live from and as Live until.
6. Click Create reward.
7. Open <name> from the rewards list.

**Expected Results:**

* Step 5 shows no error on Live until.
* Step 6 adds <name> to the rewards list, scheduled.
* Step 7 shows <day> as Live from and as Live until.

---

## grade10-site-loyalty-programme-US7: Member redeems any reward as one coupon

**As a** member,
**I want** every reward I redeem — money off, a gift, or a physical item — to become a coupon with its own kind, discount and scope,
**so that** a physical reward settles like an ordinary purchase and I never wait for a separate collection.

<!-- trace:case id=g10.loyalty-programme.TC-t2k rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### grade10-site-loyalty-programme-US7-TC7-1: A coupon scoped to products or a filter is online only at the till

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* customer(member) holds an unused coupon redeemed from <reward>.
* A shopkeeper has the member's panel open in the loyalty terminal at the till.
* The till sale holds one <variant_1>.

**Test data:**

| `<reward>` | Saved | Applied by | At the till |
| --- | --- | --- | --- |
| Money off <amount>, Named products, <variant_1>'s product | In the reward form | The shopkeeper, from the panel | Marked online only, not applied |
| Money off <amount>, A catalog filter matching <variant_1> | In the reward form | The shopkeeper, from the panel | Marked online only, not applied |
| Money off <amount>, Named products, <variant_1>'s product, channels online and in store | Through the admin API | The shopkeeper, from the panel | Marked online only, not applied |
| Money off <amount>, Named products, <variant_1>'s product, channels online and in store | Through the admin API | The member, presenting it from their own session | Marked online only, refused |
| Money off <amount>, A catalog filter matching <variant_1>, channels online and in store | Through the admin API | The member, presenting it from their own session | Marked online only, refused |
| Money off <amount>, Named products, <variant_1>'s product, channel in store alone | Through the admin API | The member, presenting it from their own session | Marked online only, refused |
| Money off <amount>, Named variants, <variant_1>, channels Both | In the reward form | The shopkeeper, from the panel | Applied, <amount> off the sale |

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale, priced above <amount> |
| `<amount>` | HKD 20.00 (any amount above zero) |

**Steps:**

1. Open the member's coupons in the till panel.
2. Find the coupon from <reward>.
3. Apply it to the sale, as the row's Applied by column says.

**Expected Results:**

* Step 2 shows the coupon as the row's At the till column says.
* Step 3 matches the row: the sale's price unchanged where not applied or refused.
* Where refused, the member's phone reads `This coupon cannot be used on this sale.`

<!-- trace:case id=g10.loyalty-programme.TC-9xj rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### grade10-site-loyalty-programme-US7-TC8-1: A coupon takes off what its discount and scope name

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
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* customer(member) holds an unused coupon redeemed from <reward>.
* customer(member) has <basket> in the online basket.

**Test data:**

| `<reward>` | `<basket>` | Taken off |
| --- | --- | --- |
| An amount, <amount>, Named variants, <variant_1> | One <variant_1>, one <variant_2> | <amount>, from <variant_1>'s line |
| A percentage, 10%, maximum discount <cap>, The whole order | Goods worth <large basket> | <cap> |
| A percentage, 10%, no maximum discount, The whole order | Goods worth <large basket> | 10% of <large basket> |
| An amount, <amount>, A catalog filter, worlds = <world_1> | One <variant_1>, one <variant_2> | <amount>, from <variant_1>'s line |
| A percentage, 10%, no maximum discount, The whole order | One <variant_1>, one <variant_2> | 10% of each line |
| A Free item of <variant_1> | One <variant_1>, one <variant_2> | <variant_1>'s price, from <variant_1>'s line |

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale in <world_1>, priced above <amount> |
| `<variant_2>` | A variant for sale in another world |
| `<world_1>` | A world at least one product for sale carries |
| `<amount>` | HKD 20.00 (any amount above zero) |
| `<cap>` | HKD 100.00 (any amount below 10% of <large basket>) |
| `<large basket>` | HKD 2,000.00 (any amount whose 10% exceeds <cap>) |

**Steps:**

1. Open checkout with <basket>.
2. Apply the coupon from <reward>.
3. Read each line's discount and the order total.

**Expected Results:**

* Step 3 shows the row's Taken off.
* Step 3 shows full price on every line the scope does not match.

<!-- trace:case id=g10.loyalty-programme.TC-ixx rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### grade10-site-loyalty-programme-US7-TC9-1: A gift adds its free line once the basket reaches its minimum spend

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
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* customer(member) holds an unused coupon redeemed from <reward_4>.
* customer(member) has <basket> in the online basket.

**Test data:**

| `<basket>` | Outcome |
| --- | --- |
| Goods worth a cent under <minimum spend> | The coupon is refused, and no free line is added |
| Goods worth exactly <minimum spend> | A free line for <gift> is added |
| Goods worth <minimum spend>, one <gift> among them | The coupon is refused as the gift is already held, and no second <gift> line is added |

| Field | Value |
| --- | --- |
| `<reward_4>` | A gift with a purchase of <gift>, minimum spend <minimum spend> |
| `<gift>` | A variant for sale |
| `<minimum spend>` | HKD 500.00 (any amount above zero) |

**Steps:**

1. Open checkout with <basket>.
2. Apply the coupon from <reward_4>.
3. Read the order's lines and total.

**Expected Results:**

* Step 3 shows the row's Outcome.
* Where the coupon is refused, the order total is unchanged.

<!-- trace:case id=g10.loyalty-programme.TC-xnm rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### grade10-site-loyalty-programme-US7-TC10-1: A free item's coupon rings its variant up at nothing at the till

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
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* customer(member) holds an unused coupon redeemed from <reward_5>.
* A shopkeeper has the member's panel open in the loyalty terminal at the till.
* The till sale holds one <variant_1> and nothing else.

**Test data:**

| `<applied by>` |
| --- |
| The shopkeeper, from the panel |
| The member, presenting it from their own session |

| Field | Value |
| --- | --- |
| `<reward_5>` | A Free item reward of <variant_1>, created in the reward form, no minimum spend |
| `<variant_1>` | A variant for sale, priced above zero |

**Steps:**

1. Apply the coupon from <reward_5> to the sale, as <applied by>.
2. Read the sale's lines and total.
3. Complete the sale.
4. Open the member's coupons.

**Expected Results:**

* Step 2 shows <variant_1>'s line taken to nothing, and a total of HKD 0.00.
* Step 3 completes as an ordinary sale, with no separate collection step.
* Step 4 shows the coupon from <reward_5> as used.

<!-- trace:case id=g10.loyalty-programme.TC-q9z rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### grade10-site-loyalty-programme-US7-TC11-1: A reward scoped to products or a filter reads online only on the menu

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
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* <reward> is live, saved through the admin API for the row's channels.
* customer(member) is signed in.

**Test data:**

| `<reward>` | Channels | On the menu |
| --- | --- | --- |
| Money off <amount>, Named products, <product_1> | Online and in store | Online store only |
| Money off <amount>, A catalog filter, worlds = <world_1> | Online and in store | Online store only |
| Money off <amount>, Named products, <product_1> | In store alone | Online store only |
| Money off <amount>, Named variants, <variant_1> | Online and in store | No channel named |
| Money off <amount>, Named variants, <variant_1> | Online alone | Online store only |

| Field | Value |
| --- | --- |
| `<product_1>` | A product for sale in <world_1> |
| `<variant_1>` | A variant of <product_1> |
| `<world_1>` | A world at least one product for sale carries |
| `<amount>` | HKD 20.00 (any amount above zero) |

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Read <reward> on the reward menu.

**Expected Results:**

* Step 2 shows the row's On the menu beside <reward>, before it is redeemed.

<!-- trace:case id=g10.loyalty-programme.TC-fzq rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### grade10-site-loyalty-programme-US7-TC12-1: A free item's coupon never adds its item online

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* customer(member) holds an unused coupon redeemed from <reward_5>.
* customer(member) has one <variant_2> in the online basket, and no <variant_1>.

**Test data:**

| Field | Value |
| --- | --- |
| `<reward_5>` | A Free item reward of <variant_1>, created in the reward form, no minimum spend |
| `<variant_1>` | A variant for sale, priced above zero |
| `<variant_2>` | A variant of another product |

**Steps:**

1. Open checkout.
2. Apply the coupon from <reward_5>.
3. Read the order's lines and total.

**Expected Results:**

* Step 2 refuses the coupon: nothing in the basket matches it.
* Step 3 shows no <variant_1> line.
* Step 3 shows the total unchanged.

<!-- trace:case id=g10.loyalty-programme.TC-hbv rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### grade10-site-loyalty-programme-US7-TC13-1: A gift's coupon goes on at the till as its own free line

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
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* customer(member) holds an unused coupon redeemed from <reward_4>.
* A shopkeeper has the member's panel open in the loyalty terminal at the till.
* The till sale holds goods worth <minimum spend>, and no <gift>.

**Test data:**

| `<applied by>` |
| --- |
| The shopkeeper, from the panel |
| The member, presenting it from their own session |

| Field | Value |
| --- | --- |
| `<reward_4>` | A gift with a purchase of <gift>, minimum spend <minimum spend> |
| `<gift>` | A variant for sale |
| `<minimum spend>` | HKD 500.00 (any amount above zero) |

**Steps:**

1. Apply the coupon from <reward_4> to the sale, as <applied by>.
2. Read the sale's lines, discounts and total.

**Expected Results:**

* Step 2 shows a line for <gift>, taken to nothing.
* Step 2 shows every other line at full price, the total unchanged.
* Step 2 shows no discount code on the sale.

<!-- trace:case id=g10.loyalty-programme.TC-7zz rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-62s,g10.loyalty-programme.SC-gmp,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32,g10.loyalty-programme.SC-ve1,g10.loyalty-programme.SC-zzl,g10.loyalty-programme.SC-cji -->
### grade10-site-loyalty-programme-US7-TC14-1: Redeeming a free item leaves a coupon at once

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
* **Trace:** grade10-site-loyalty-programme-US-07

**Pre-conditions:**

* <reward_5> is live on the reward menu at <cost>.
* customer(member) holds at least <cost> points and is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| `<reward_5>` | A Free item reward of <variant_1>, created in the reward form, no minimum spend |
| `<variant_1>` | A variant for sale, priced above zero |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Navigate to <grade10 loyalty url>.
2. Redeem <reward_5> from the reward menu.
3. Open the member's coupons.

**Expected Results:**

* Step 2 takes <cost> off the balance.
* Step 3 shows a coupon from <reward_5>, available.
* Step 3 shows no collection step and nothing waiting.

## Reconciliation

**Run:** 2026-10-06, QA2 in a fresh context: the blind feature pass of 2026-10-06 joined on the anchors with Dev's scenarios, `tech-design.md`, `ui-design.md`, the linked pages, and what grade10 runs where a case's outcome turns on it. The blind pass's run left no record of its bundle; its one question is the QA1 row in `decisions.md`'s `## Raised`. No domain suite sits above this capability.

- **Folded, as written** — US9-TC1 (`grade10-site-loyalty-programme-SC-158`, the maximum discount left empty as the requirement allows); US9-TC3 (`grade10-site-loyalty-programme-SC-188`); US9-TC4's two-variants and capped rows (`grade10-site-loyalty-programme-SC-189`), its 90% and whole-order rows under the requirement's "any other"; US9-TC6 (`grade10-site-loyalty-programme-SC-158`, a gift); US9-TC8 (`grade10-site-loyalty-programme-SC-187`, on a reward being edited); US9-TC9 (`grade10-site-loyalty-programme-SC-251`); US9-TC12 (`grade10-site-loyalty-programme-SC-250`); US7-TC7 (`grade10-site-loyalty-programme-SC-248`), its named-variants row against `grade10-site-loyalty-programme-SC-152`'s till scope
- **Raised, folded into spec** — US9-TC4's one-named-product row: `grade10-site-loyalty-programme-SC-189` names a product scope, as grade10 `rewardCouponDraft.test.ts` holds it; US9-TC8, money off edited into a free item: `grade10-site-loyalty-programme-SC-187` covers a reward being edited; US9-TC9, a missing part or an inverted window: the requirement's text and `grade10-site-loyalty-programme-SC-251`, with the page's **Missing parts** line, from grade10 `rewardGaps.ts`; US9-TC10, the basket check: the requirement's text and `grade10-site-loyalty-programme-SC-252`, with the page's **Basket check** line; US7-TC7's refused apply and the member presenting a coupon stored for the till: `grade10-site-loyalty-programme-SC-248`'s ANDs, from grade10 `integrations/shopify-pos/grade10/src/acts/view.ts:221` and the page's 🚧 **Refused at the till by its scope**
- **Raised, settled** — the QA1 question, a stored product or filter reward naming the till: Q7, from what runs; `grade10-site-loyalty-programme-SC-250` gains the AND that moving the scope to named variants shows the stored channels again, and US9-TC12 walks it
- **Folded, corrected** — US9-TC2 (`grade10-site-loyalty-programme-SC-187`): the list's terms read as `ui-design.md` keeps staging's words, everything off the variant, rather than "free"; US9-TC7 (`grade10-site-loyalty-programme-SC-249`): it now asserts the channels the form shows before saving, the first THEN it had left to the reopened reward; US9-TC10 (`grade10-site-loyalty-programme-SC-252`): the evaluator refuses a basket under the minimum spend before it reads the scope (grade10 `packages/coupons/contracts/src/evaluate.ts:193`), so `<variant_2>` alone now reaches the minimum spend and the out-of-scope row reads its own verdict
- **Settled in the design** — US9-TC2's rail sentence and US9-TC8's kind note: `ui-design.md` § Copy; US9-TC10's verdicts: § Basket Verdicts; US9-TC11's layout: § Screens and Grade10 Admin Theme Values, walked by the capture pass in tasks 5.2. The mark in front of an amount waits on Q5; its place before the amount is decided, so US9-TC11 holds either way
- **Rejected** — none
- **Retired** — US9-TC5: US9-TC4's one-variant, capped row holds it
- **Contradicted** — none: no case and scenario state opposite outcomes
- **Cases added after the reconciliation** — written by QA2 from what the blind pass left unreached, so they are not blind: US7-TC8 (`grade10-site-loyalty-programme-SC-152`, `grade10-site-loyalty-programme-SC-153`, `grade10-site-loyalty-programme-SC-154`, `grade10-site-loyalty-programme-SC-155`, `grade10-site-loyalty-programme-SC-247`); US7-TC9 (`grade10-site-loyalty-programme-SC-156`, `grade10-site-loyalty-programme-SC-157`); US9-TC9's gift-without-minimum-spend row; US7-TC10, the Settlement by kind anchor, which this change restates word for word from never-lock-a-coupon's leaf and no case reached: a free item authored in the form rings its variant up at nothing at the till, by either way in (`grade10-site-loyalty-programme-SC-159`, `grade10-site-loyalty-programme-SC-166`, `grade10-site-loyalty-programme-SC-172`)
- **Uncovered** — none: every anchor and every scenario in the delta has a case
- **Outside this change** — the rest of "A redemption settles as a coupon" is durable and untouched here; US7-TC10 walks only what the Settlement by kind anchor states

**Rerun:** 2026-10-06, QA2 in a fresh context after the acceptance review of the rebased change, on the same anchors: the journey set and the feature-set root groups did not move; the Till scope and Reward form leaves grew the menu and the retired handovers, each with its scenario.

- **Folded, as written** — US7-TC7 (`grade10-site-loyalty-programme-SC-248`), now that the requirement states neither way into a counter sale takes such a coupon; its panel rows match the page's **Online only at the till**, which runs, and its own-phone row the page's 🚧 **Refused from the member's phone**, the two lines the first run's 🚧 **Refused at the till by its scope** split into. US7-TC10 (`grade10-site-loyalty-programme-SC-159`, `grade10-site-loyalty-programme-SC-166`, `grade10-site-loyalty-programme-SC-172`) stands, since its free item is scoped to one variant
- **Folded, corrected** — US9-TC11: the narrow width is 400px, as the walk in tasks 5.1 runs it
- **Cases added after the reconciliation** — not blind: US7-TC11 (`grade10-site-loyalty-programme-SC-245`), the menu stating a reward scoped to named products or a filter as online only, in the menu's own words (`packages/i18n/messages/shared/en/membership.json`, `onlyOnline`), with a named-variants row naming no channel; US9-TC13 (`grade10-site-loyalty-programme-SC-246`), a reward stored with a retired handover edited and duplicated, as grade10 `rewardCouponDraft.ts:193-201` keeps it, `RewardEditor.tsx:259-279` shows its note with no card chosen, and `HandoverFields.tsx:65` draws no fields for a kind
- **Trace markers** — every US7 case now covers each scenario that serves US-07 in source order, the four that serve US-03 beside it included (`grade10-site-loyalty-programme-SC-159`, `grade10-site-loyalty-programme-SC-160`, `grade10-site-loyalty-programme-SC-161`, `grade10-site-loyalty-programme-SC-162`); the US9 markers already covered US-09 whole
- **Walk** — tasks 7.3 and 7.4 walk the two outcomes still to build end to end: the menu reading online only, and the till refusing the coupon from the member's own phone
- **Uncovered** — none: every anchor and every scenario in the delta has a case
- **Waiting** — US9-TC11 holds either answer to Q5, the currency mark; an override in Q6, the departures from the mock, reruns it

**Rerun:** 2026-10-06, after the second acceptance review's fixes, on the same anchors: the journey set and the feature-set root groups did not move.

- **Renumbered** - the delta's scenarios once issued as SC-209 to SC-214 are `grade10-site-loyalty-programme-SC-247` to `grade10-site-loyalty-programme-SC-252`, the numbers never-lock-a-coupon also issued; their trace ids and every case marker stand
- **Folded, corrected** - US9-TC13 (`grade10-site-loyalty-programme-SC-246`): a manual handover and a counter collection are handovers, not kinds, so its title and test data say handover, and it reads the edit page's note with no card chosen; US9-TC9 (`grade10-site-loyalty-programme-SC-251`): its first column is the card chosen, `<choice>`, as the requirement now words it
- **Folded, as written** - `grade10-site-loyalty-programme-SC-152`: US7-TC8's fixed-amount rows online and US7-TC7's named-variants row at the till, which tasks 6.8 now tests
- **Waiting** - a fresh-context QA2 reading of this rerun

**Rerun:** 2026-10-06, QA2 in a fresh context, the reading the last rerun waited on: every case and every scenario of the delta against the journey set and the feature-set root groups, which did not move; the case markers, ids and revisions pass `pnpm run tcs:validate` and `pnpm check:manual`.

- **Raised, folded into spec** - US9-TC13 (`grade10-site-loyalty-programme-SC-246`): `ui-design.md` maps choosing a card on a retired handover to this scenario, and grade10 builds it (`RewardEditor.tsx:275`, `rewardCouponDraft.ts:500-507`), yet no page line, requirement or scenario stated it. The page's **Retired handovers** line, Q8, the requirement and the scenario now say the reward opens with no choice made and saves as the choice the operator makes; tasks 6.7 tests it, and US9-TC13 gains the steps that choose Money off and read the saved coupon
- **Folded, corrected** - US9-TC10 (`grade10-site-loyalty-programme-SC-252`): it never asserted the scenario's "the reward is not saved", so it names the reward and ends on the rewards list without it; US7-TC7 (`grade10-site-loyalty-programme-SC-248`): a catalog filter stored for both channels and presented from the member's own session joins the named-products row, since the guard's refusal turns on either scope; US9-TC7 and US9-TC12: the channels before saving read `Online chosen; In store and Both unavailable`, where the old cell read as all three unavailable, and US9-TC7 names the control as the form labels it, Where it can be spent; US9-TC4: its title names any other product coupon, since its 90% row is not a 100% coupon
- **Folded, as written** - every other case, as the earlier runs record it
- **Rejected** - none
- **Contradicted** - none
- **Uncovered** - none: every anchor and every scenario in the delta has a case, and each case marker covers its journey's scenarios in source order
- **Waiting** - US9-TC11 on Q5 and Q6, as before

**Rerun:** 2026-10-06, after the third acceptance review's fixes, on the same anchors: the journey set and the feature-set root groups did not move; the Reward form leaf is wrapped, with its words unchanged.

- **Folded, as written** - US9-TC4 (`grade10-site-loyalty-programme-SC-189`): the scenario's GIVEN now names three stored rewards apart, 100% with a maximum discount, 100% on two variants, and 100% on one named product, which are the case's capped, two-variants and one-product rows
- **Waiting** - a fresh-context QA2 reading of this rerun; US9-TC11 on Q5 and Q6, as before

**Rerun:** 2026-10-06, QA2 in a fresh context, the reading the last rerun waited on: every case and every scenario of the delta, and the US-07 scenarios of "A redemption settles as a coupon, whatever the reward" as never-lock-a-coupon leaves them, against the journey set and the feature-set root groups, which did not move.

- **Folded, corrected** - US9-TC9 (`grade10-site-loyalty-programme-SC-251`): the requirement holds a save while the choice lacks a part, and money off needs a scope as well as a discount, yet no row left the scope empty; a row now scopes money off to named products with none picked, and the scenario names that part beside the missing amount, as grade10 `rewardGaps.ts` holds it and tasks 6.5 tests it. US9-TC13 (`grade10-site-loyalty-programme-SC-246`): step 1 now reads the fields as well as the cards, since no choice made shows as no discount, scope or item field, as `ui-design.md`'s States row draws it
- **Folded, as written** - US7-TC7 (`grade10-site-loyalty-programme-SC-248`) against `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172`: those two give a counter sale the cut of a coupon the member holds, and the requirement now states that neither way takes a coupon scoped to named products or a catalog filter, so US7-TC7 refuses it both ways while US7-TC10 walks both ways with a coupon scoped to one variant. Every other case, as the earlier runs record it
- **Rejected** - none
- **Contradicted** - none
- **Uncovered** - none: every anchor and every scenario in the delta has a case, and each case marker covers its journey's scenarios in source order
- **Waiting** - US9-TC11 on Q5 and Q6, as before

**Rerun:** 2026-10-07, after the fourth acceptance review's fixes, on the same anchors: the journey set and the feature-set root groups did not move.

- **Renumbered** - never-lock-a-coupon is accepted first and issues programme scenarios up to `grade10-site-loyalty-programme-SC-242` and the case US7-TC6-1, so this delta's new scenarios once issued as SC-224 to SC-231 are `grade10-site-loyalty-programme-SC-245` to `grade10-site-loyalty-programme-SC-252`, in the same order, and its US7 cases once issued as TC1 to TC5 are US7-TC7 to US7-TC11; their trace ids, revisions and words stand, and every citation in `tech-design.md`, `ui-design.md` and `tasks.md` follows
- **Folded, corrected** - US7-TC7 (`grade10-site-loyalty-programme-SC-248`) and US7-TC11 (`grade10-site-loyalty-programme-SC-245`): every row stored such a coupon for both channels, yet the rule holds whatever channels the coupon names, so a coupon scoped to named products and stored for the till alone is good online only. US7-TC7 gains a row refusing it from the member's own session, and US7-TC11 a row reading it `Online store only`, with a Channels column for each row; tasks 6.2 and 6.6 test it
- **Waiting** - a fresh-context QA2 reading of this rerun; US7-TC7 against `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172` until never-lock-a-coupon narrows their GIVEN to a coupon scoped to named variants or the whole order; US9-TC11 on Q5 and Q6, as before

**Rerun:** 2026-10-07, QA2 in a fresh context, reading the fourth review's fixes on the same anchors: the journey set and the feature-set root groups did not move.

- **Folded, as written** - US7-TC7's row refusing a coupon scoped to named products and stored for the till alone, and US7-TC11's row reading it `Online store only` (`grade10-site-loyalty-programme-SC-248`, `grade10-site-loyalty-programme-SC-245`, whichever channels it names), as the console already saves such a reward for online alone (grade10 `rewardCouponDraft.ts:162-166`); tasks 6.2 and 6.6 and the tech design's risk name the same case
- **Ids** - new scenarios `grade10-site-loyalty-programme-SC-245` to `grade10-site-loyalty-programme-SC-252` sit above never-lock-a-coupon's 242, and US7-TC7 to US7-TC11 above its US7-TC6-1; no other change in any branch issues these numbers or trace ids, and every case marker covers its journey's scenarios in source order
- **Rejected** - none
- **Contradicted** - none in this change; never-lock-a-coupon's `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172` still give a till sale the cut of any product coupon, where US7-TC7 refuses one scoped to named products or a filter. The requirement here settles it, since neither way into a counter sale takes such a coupon
- **Uncovered** - none
- **Waiting** - never-lock-a-coupon narrowing the GIVEN of `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172` to a coupon scoped to named variants or the whole order; US9-TC11 on Q5 and Q6, as before

**Rerun:** 2026-10-07, after the fifth acceptance review's fixes: the journey set and the feature-set root groups did not move.

- **Anchor restated** - the Settlement by kind leaf now carries never-lock-a-coupon's words exactly, so the fold leaves that leaf as never-lock-a-coupon writes it; US7-TC10 keeps its anchor
- **Folded, corrected** - US7-TC7 (`grade10-site-loyalty-programme-SC-248`): a refused presentation reads `This coupon cannot be used on this sale.` on the member's phone, as grade10 `couponPresentationMapper.ts:17-22` and `membership.json` `refused` answer `coupon_refused`; the scenario's THEN now reads that the till shows the coupon as online only, and the requirement that staff cannot apply it
- **Rejected** - none
- **Contradicted** - none in this change
- **Uncovered** - none
- **Waiting** - a fresh-context QA2 reading of this rerun; US7-TC7 against `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172` until never-lock-a-coupon narrows their GIVEN to a product coupon scoped to named variants or the whole order; US9-TC11 on Q5 and Q6, as before

**Run:** 2026-10-07, QA1 blind pass in a fresh context on the rebased change. Read: the Purpose and Feature set of the durable spec and the delta, `user-journeys.md`, `proposal.md`, `decisions.md` with its Raised table, `ui-design.md` with its States table's scenario column stripped, the Rewards, Coupons and Operator Console pages, `openspec/config.yaml`'s context, and this suite above its Reconciliation; the loyalty domain has no domain suite. Denied: every Requirements section, `tech-design.md`, `tasks.md`, this Reconciliation and the archive. Added US9-TC14 to TC17 and US7-TC12 to TC14, joined rows and results to US9-TC7, TC9, TC10, TC11 and TC13 and US7-TC8, TC9 and TC11, and raised five questions in `decisions.md`.

**Rerun:** 2026-10-07, QA2 in a fresh context on the QA1 pass above: every case and every scenario of the delta against the journey set and the feature-set root groups, which did not move, with grade10 read where a case's outcome turns on what runs.

- **Raised, folded into spec** - US9-TC18, added by QA2 from the QA1 question on moving from Free item to Money off: Q9 settles it from what runs, the page's **A new choice starts empty** line, the requirement's sentence and `grade10-site-loyalty-programme-SC-253` state it, and tasks 6.9 tests it
- **Raised, settled** - Q10: US9-TC2 reads the coupon terms and the menu entry under Free item, and US9-TC3 a stored free item's combine setting reopened and duplicated (`grade10-site-loyalty-programme-SC-187`, `grade10-site-loyalty-programme-SC-188`); Q11: US9-TC19 saves a one-day window (`grade10-site-loyalty-programme-SC-251`), tested in tasks 6.5; Q12: US9-TC2's second pick replaces the first (`grade10-site-loyalty-programme-SC-187`); Q13: US9-TC13 reads the rail for each retired handover (`grade10-site-loyalty-programme-SC-246`), where the menu card's 30-day validity is a gap tasks 6.10 fixes
- **Folded, corrected** - US9-TC17: grade10 puts Duplicate and Archive under More beside the title at every width, and Archive returns to the rewards list (grade10 `apps/admin/grade10/src/pages/rewards/RewardEditorPage.tsx:128-137`), so the case opens More, drops its widths and asserts the list; US9-TC3 and US9-TC13 open More for Duplicate. `ui-design.md` now states what runs, and the placement joins Q6 for the designer
- **Folded, as written** - US9-TC14 and US9-TC15 (`grade10-site-loyalty-programme-SC-252`), each verdict and staging's two prompts as `ui-design.md`'s Basket Verdicts word them; US9-TC16 (`grade10-site-loyalty-programme-SC-252`, why it would not apply); US9-TC9's zero minimum spend and empty filter rows (`grade10-site-loyalty-programme-SC-251`, as grade10 `rewardCouponDraft.ts:381-384` and `rewardGaps.ts` hold them); US7-TC12, US7-TC13 and US7-TC14 under the Settlement by kind anchor, against never-lock-a-coupon's US-07 scenarios; every other case, as the earlier runs record it
- **Trace markers** - every US9 marker covers `grade10-site-loyalty-programme-SC-253` after `grade10-site-loyalty-programme-SC-187`, in source order; US9-TC18 and US9-TC19 take ids above every US9 case, and `grade10-site-loyalty-programme-SC-253` sits above never-lock-a-coupon's 242 and this change's 250
- **Rejected** - none
- **Contradicted** - none in this change
- **Uncovered** - none
- **Waiting** - US7-TC7 against `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172` until never-lock-a-coupon narrows their GIVEN, as before; US9-TC11 and US9-TC17 on Q5 and Q6

**Rerun:** 2026-10-07, after the sixth acceptance review's fixes: the journey set and the feature-set root groups did not move.

- **Renumbered** - never-lock-a-coupon now issues programme scenarios up to 244, so this delta's new scenarios once issued as SC-243 to SC-251 are `grade10-site-loyalty-programme-SC-245` to `grade10-site-loyalty-programme-SC-253`, in the same order; their trace ids, revisions and words stand, and every citation in `tech-design.md`, `ui-design.md` and `tasks.md` follows
- **Folded, corrected** - US9-TC11: Q5 settles the mark as `HKD`, as built, so step 2 reads HKD before each amount
- **Raised, settled** - Q6 keeps each departure from the mock as written for this change, the designer's confirmation handed to confirm-loyalty-surface-looks, so US9-TC11 and US9-TC17 stand
- **Rejected** - none
- **Contradicted** - none in this change
- **Uncovered** - none
- **Waiting** - US7-TC7 against `grade10-site-loyalty-programme-SC-166` and `grade10-site-loyalty-programme-SC-172` until never-lock-a-coupon narrows their GIVEN, as before
