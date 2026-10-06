# grade10-site/loyalty/programme Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-loyalty-programme-US9: Operator authors a reward's full definition from the console

**As an** operator,
**I want** the reward form to set a reward's kind, discount, scope and combine setting,
**so that** publishing any reward never needs the admin API.

<!-- trace:case id=g10.loyalty-programme.TC-nzm rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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
5. Enter <name> and <cost>.
6. Click Create reward.
7. Open <name> from the rewards list.

**Expected Results:**

* Step 1 shows the discount and scope fields.
* Step 6 adds <name> to the rewards list.
* Step 7 shows Money off with <discount>, <scope> and <stacks with>.
* Where the row left it empty, the maximum discount is still empty.

<!-- trace:case id=g10.loyalty-programme.TC-bju rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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
| `<name>` | A name no other reward carries |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Click the Free item card.
2. Search the item picker for <variant_1>.
3. Pick <variant_1>.
4. Enter <name> and <cost>.
5. Read the coupon sentence in the rail.
6. Click Create reward.
7. Open <name> from the rewards list.

**Expected Results:**

* Step 1 shows one item picker and the minimum spend.
* Step 1 shows no discount or scope field.
* Step 3 shows <variant_1> as the one picked item.
* Step 5 takes <variant_1> off once it is in the basket.
* Step 5 never says the coupon adds the item.
* Step 6 lists <name>, its terms taking everything off <variant_1>.
* Step 7 shows the Free item card chosen, <variant_1> picked.

<!-- trace:case id=g10.loyalty-programme.TC-7q7 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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

* <reward_1> exists, created in the reward form as Money off, Everything (free), Named variants, <variant_1> alone, minimum spend <minimum spend>.
* admin(may edit rewards) is on <grade10 admin url>/rewards.

**Test data:**

| Field | Value |
| --- | --- |
| `<reward_1>` | A reward at 100% with no maximum discount, scoped to <variant_1> alone |
| `<variant_1>` | A variant for sale |
| `<minimum spend>` | HKD 500.00 (any amount above zero) |

**Steps:**

1. Open <reward_1> from the rewards list.
2. Click Duplicate.
3. Read the new reward's kind, item and minimum spend.

**Expected Results:**

* Step 1 shows the Free item card chosen, <variant_1> picked.
* Step 1 shows <minimum spend> as the minimum spend.
* Step 3 shows the Free item card chosen, <variant_1> picked.
* Step 3 shows <minimum spend> as the minimum spend.

<!-- trace:case id=g10.loyalty-programme.TC-nuz rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
### grade10-site-loyalty-programme-US9-TC4-1: Any other 100% coupon reopens as money off

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

<!-- trace:case id=g10.loyalty-programme.TC-tuu rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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

<!-- trace:case id=g10.loyalty-programme.TC-xlj rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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
4. Enter <name> and <cost>.
5. Click Create reward.
6. Open <name> from the rewards list.

**Expected Results:**

* Step 1 shows a gift picker and the minimum spend, no discount or scope.
* Step 5 adds <name> to the rewards list.
* Step 6 shows the Gift with a purchase card chosen.
* Step 6 shows <variant_1> as the gift, <minimum spend> as the minimum spend.

<!-- trace:case id=g10.loyalty-programme.TC-gm2 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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
| Named products, <product_1> | shown | Online, In store and Both unavailable | Online |
| A catalog filter, worlds = <world_1> | shown | Online, In store and Both unavailable | Online |
| Named variants, <variant_1> | not shown | Both | Both |
| The whole order | not shown | Both | Both |

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
3. Choose Both under where the coupon can be spent.
4. Choose <scope>.
5. Enter <name> and <cost>.
6. Click Create reward.
7. Open <name> from the rewards list.

**Expected Results:**

* Step 4 shows or hides the online-only note as the row says.
* Step 4 shows the row's channels before saving.
* Step 6 adds <name> to the rewards list.
* Step 7 shows the channels the row names.

<!-- trace:case id=g10.loyalty-programme.TC-0t9 rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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

<!-- trace:case id=g10.loyalty-programme.TC-90b rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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

| `<kind>` | `<gap>` | Where the gap is named |
| --- | --- | --- |
| Free item | No item picked | The save bar names the missing item |
| Money off | An amount, left empty | The save bar names the missing amount |
| Gift with a purchase | No gift picked | The save bar names the missing gift |
| Gift with a purchase, <variant_1> picked | The minimum spend, left empty | The save bar names the missing minimum spend |
| Money off, an amount <amount>, The whole order | In a window, Live until a day before Live from | Live until shows the window ends before it starts |

| Field | Value |
| --- | --- |
| `<variant_1>` | A variant for sale |
| `<amount>` | HKD 20.00 (any amount above zero) |
| `<name>` | A name no other reward carries |
| `<cost>` | 100 points (any whole number above zero) |

**Steps:**

1. Click the card for <kind>.
2. Enter <name> and <cost>.
3. Leave <gap> as the row states.
4. Click Create reward.
5. Click ← Rewards.

**Expected Results:**

* Step 4 names the gap where the row says.
* Step 5 lists no reward named <name>.

<!-- trace:case id=g10.loyalty-programme.TC-z6o rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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

**Steps:**

1. Click the Free item card.
2. Pick <variant_1> as the item.
3. Enter <minimum spend> as the minimum spend.
4. Open the basket check in the rail.
5. Add the lines of <basket> by search.
6. Read the verdict.

**Expected Results:**

* Step 4 opens the basket check.
* Step 6 shows the row's verdict.
* Step 6 shows no line added to the basket.

<!-- trace:case id=g10.loyalty-programme.TC-y2e rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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
* The rewards list holds at least one live and one scheduled reward.

**Test data:**

| `<width>` | The rail |
| --- | --- |
| 1280px | beside the form |
| 390px | under the form |

**Steps:**

1. Read the page from the top.
2. Click the Money off card.
3. Scroll to the end of the page.
4. Click ← Rewards above the title.

**Expected Results:**

* Step 1 shows ← Rewards above the title.
* Step 1 shows the kinds as three cards.
* Step 2 shows discount and scope as segmented controls.
* Step 2 shows the currency mark before each amount.
* Step 3 keeps the save bar on screen, and the rail where the row says.
* Step 4 opens the rewards list, each state a tinted badge.

<!-- trace:case id=g10.loyalty-programme.TC-2kx rev=1 covers=g10.loyalty-programme.SC-1bu,g10.loyalty-programme.SC-rwu,g10.loyalty-programme.SC-7w0,g10.loyalty-programme.SC-72a,g10.loyalty-programme.SC-zq0,g10.loyalty-programme.SC-jnr,g10.loyalty-programme.SC-h6j,g10.loyalty-programme.SC-fut -->
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
| None | Online, In store and Both unavailable | Online |
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

---

## grade10-site-loyalty-programme-US7: Member redeems any reward as one coupon

**As a** member,
**I want** every reward I redeem — money off, a gift, or a physical item — to become a coupon with its own kind, discount and scope,
**so that** a physical reward settles like an ordinary purchase and I never wait for a separate collection.

<!-- trace:case id=g10.loyalty-programme.TC-t2k rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32 -->
### grade10-site-loyalty-programme-US7-TC1-1: A coupon scoped to products or a filter is online only at the till

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

<!-- trace:case id=g10.loyalty-programme.TC-9xj rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32 -->
### grade10-site-loyalty-programme-US7-TC2-1: A coupon takes off what its discount and scope name

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

<!-- trace:case id=g10.loyalty-programme.TC-ixx rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32 -->
### grade10-site-loyalty-programme-US7-TC3-1: A gift adds its free line once the basket reaches its minimum spend

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

<!-- trace:case id=g10.loyalty-programme.TC-xnm rev=1 covers=g10.loyalty-programme.SC-qyo,g10.loyalty-programme.SC-gmn,g10.loyalty-programme.SC-0tt,g10.loyalty-programme.SC-90a,g10.loyalty-programme.SC-29i,g10.loyalty-programme.SC-mn8,g10.loyalty-programme.SC-3q5,g10.loyalty-programme.SC-oqd,g10.loyalty-programme.SC-wks,g10.loyalty-programme.SC-z32 -->
### grade10-site-loyalty-programme-US7-TC4-1: A free item's coupon rings its variant up at nothing at the till

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


## Reconciliation

**Run:** 2026-10-06, QA2 in a fresh context: the blind feature pass of 2026-10-06 joined on the anchors with Dev's scenarios, `tech-design.md`, `ui-design.md`, the linked pages, and what grade10 runs where a case's outcome turns on it. The blind pass's run left no record of its bundle; its one question is the QA1 row in `decisions.md`'s `## Raised`. No domain suite sits above this capability.

- **Folded, as written** — US9-TC1 (`grade10-site-loyalty-programme-SC-158`, the maximum discount left empty as the requirement allows); US9-TC3 (`grade10-site-loyalty-programme-SC-188`); US9-TC4's two-variants and capped rows (`grade10-site-loyalty-programme-SC-189`), its 90% and whole-order rows under the requirement's "any other"; US9-TC6 (`grade10-site-loyalty-programme-SC-158`, a gift); US9-TC8 (`grade10-site-loyalty-programme-SC-187`, on a reward being edited); US9-TC9 (`grade10-site-loyalty-programme-SC-213`); US9-TC12 (`grade10-site-loyalty-programme-SC-212`); US7-TC1 (`grade10-site-loyalty-programme-SC-210`), its named-variants row against `grade10-site-loyalty-programme-SC-152`'s till scope
- **Raised, folded into spec** — US9-TC4's one-named-product row: `grade10-site-loyalty-programme-SC-189` names a product scope, as grade10 `rewardCouponDraft.test.ts` holds it; US9-TC8, money off edited into a free item: `grade10-site-loyalty-programme-SC-187` covers a reward being edited; US9-TC9, a missing part or an inverted window: the requirement's text and `grade10-site-loyalty-programme-SC-213`, with the page's **Missing parts** line, from grade10 `rewardGaps.ts`; US9-TC10, the basket check: the requirement's text and `grade10-site-loyalty-programme-SC-214`, with the page's **Basket check** line; US7-TC1's refused apply and the member presenting a coupon stored for the till: `grade10-site-loyalty-programme-SC-210`'s ANDs, from grade10 `integrations/shopify-pos/grade10/src/acts/view.ts:221` and the page's 🚧 **Refused at the till by its scope**
- **Raised, settled** — the QA1 question, a stored product or filter reward naming the till: Q7, from what runs; `grade10-site-loyalty-programme-SC-212` gains the AND that moving the scope to named variants shows the stored channels again, and US9-TC12 walks it
- **Folded, corrected** — US9-TC2 (`grade10-site-loyalty-programme-SC-187`): the list's terms read as `ui-design.md` keeps staging's words, everything off the variant, rather than "free"; US9-TC7 (`grade10-site-loyalty-programme-SC-211`): it now asserts the channels the form shows before saving, the first THEN it had left to the reopened reward; US9-TC10 (`grade10-site-loyalty-programme-SC-214`): the evaluator refuses a basket under the minimum spend before it reads the scope (grade10 `packages/coupons/contracts/src/evaluate.ts:193`), so `<variant_2>` alone now reaches the minimum spend and the out-of-scope row reads its own verdict
- **Settled in the design** — US9-TC2's rail sentence and US9-TC8's kind note: `ui-design.md` § Copy; US9-TC10's verdicts: § Basket Verdicts; US9-TC11's layout: § Screens and Grade10 Admin Theme Values, walked by the capture pass in tasks 5.2. The mark in front of an amount waits on Q5; its place before the amount is decided, so US9-TC11 holds either way
- **Rejected** — none
- **Retired** — US9-TC5: US9-TC4's one-variant, capped row holds it
- **Contradicted** — none: no case and scenario state opposite outcomes
- **Cases added after the reconciliation** — written by QA2 from what the blind pass left unreached, so they are not blind: US7-TC2 (`grade10-site-loyalty-programme-SC-152`, `grade10-site-loyalty-programme-SC-153`, `grade10-site-loyalty-programme-SC-154`, `grade10-site-loyalty-programme-SC-155`, `grade10-site-loyalty-programme-SC-209`); US7-TC3 (`grade10-site-loyalty-programme-SC-156`, `grade10-site-loyalty-programme-SC-157`); US9-TC9's gift-without-minimum-spend row; US7-TC4, the Settlement by kind anchor this change rewrites, which no case reached: a free item authored in the form rings its variant up at nothing at the till, by either way in (`grade10-site-loyalty-programme-SC-159`, `grade10-site-loyalty-programme-SC-166`, `grade10-site-loyalty-programme-SC-172`)
- **Uncovered** — none: every anchor and every scenario in the delta has a case
- **Outside this change** — the rest of "A redemption settles as a coupon" is durable and untouched here; US7-TC4 walks only what the Settlement by kind anchor states
