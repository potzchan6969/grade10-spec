---
title: Yield
order: 3
---

| Setting | Default |
| --- | --- |
| Who earns | an item in a storage vault case that an admin enrols, worth at least **HKD 5,000** when enrolled; never one securing a loan |
| The item's value | its market value in HKD, taken each week, times its liquidity factor; or a price an admin sets, times the set-price factor |
| A year's yield | ❓ **4%** of that value, at most **HKD 4,000** an item - the owner confirms |
| A day's credit | a 365th of the year's yield, to the owner's balance |
| The start | the Monday after enrolment |
| Cash-out lock | **30** days from the start |
| Minimum term | **90** days from the start |
| Early take-out | ❓ an administrative fee, unset - the owner sets it |
| A change | a price, the rate or the exchange rate applies from the next day; the weekly value from Monday; a day already worked never changes |

## Earning

An enrolled item earns its owner a credit for each whole day it spends in
the vault.

- 🚧 **Enrolled by an admin** - item by item, at intake or later, once its
  value is at least **HKD 5,000**; the owner is told the start, the day its
  lock ends and the day its minimum term ends
- 🚧 **Whole days** - from the start, every whole day in custody earns,
  until the day the owner asks for the item back, it sells, or it leaves,
  whichever comes first
- 🚧 **Credited once, eventually** - a day's credit is worked out after it
  closes and reaches the balance once; a late price delays it, never doubles it
- 🚧 **Exact over time** - each credit is whole cents, and what a day rounds
  away is carried into the next, so a year pays the year's yield
- 🚧 **Storage only** - an item securing a loan earns nothing
- 🚧 **Ended for good** - asking for the item back, a sale, a release, an
  unwind or an admin ending it stops the yield, and it does not restart on
  the same case

| The item's value, after its factor | A year | A day |
| --- | --- | --- |
| HKD 7,500 | HKD 300 | about HKD 0.82 |
| HKD 15,000 | HKD 600 | about HKD 1.64 |
| HKD 75,000 | HKD 3,000 | about HKD 8.22 |
| HKD 100,000 or more | HKD 4,000 | about HKD 10.96 |

## The Value

- 🚧 **Weekly** - the market value and its factor are taken as of each
  Sunday from what was observed before Monday 06:00, and hold for the week;
  a week worked late gives the figures it would have on time -
  [Market Prices](/p/grade10-admin/inventory/market-prices)
- 🚧 **The market value** - the item's exact SNKRDUNK page and grade, never
  a near one; each day with sales casts one vote, its median price, and the
  value is the median vote of the last 30 days, topped up to five sale days
  from 90, and at most **1.25** times the 90-day median, so a rise is paid
  as it holds and a fall at once
- 🚧 **Too few sales** - fewer than **3** days with a sale in 90 days gives
  no market value, and the item earns nothing until it sells again or sold
  comparables from elsewhere are entered
- 🚧 **The liquidity factor** - activity × spread × the observation's age,
  each below, in whole basis points with test cases in the
  [reference](/references/vault-yield-liquidity); a card that rarely sells
  is worth much less to the house than its price says
- 🚧 **A set price** - only where the item's exact grade has no SNKRDUNK
  page; typed in HKD with its evidence and approved by a second admin; it
  is reviewed every **90** days and fades to nothing over the **28** days
  after a missed review
- ❓ Owner - **The set-price factor** - the owner's formula pays a set price
  in full; proposed **40%**, about what a card selling weekly earns, so
  nobody prefers a set price to a page; sold comparables found elsewhere can
  instead be entered as a second source and valued like SNKRDUNK
- 🚧 **Yen to dollars** - at the admin's rate in force on the day credited

| Sale days a month | Activity |
| --- | --- |
| under 1 | 0% |
| 2 | 10% |
| 4 | 40% |
| 8 | 80% |
| 12 or more | 100% |

- **Sale days a month** - days with a sale over the last 90, the recent ones
  counting more, read per 30 days; between two rows the activity runs in a
  straight line
- **Spread** - prices within **5%** of the typical one cost nothing; beyond
  it each point of spread takes three points off, so **15%** leaves **70%**
- **The observation's age** - full for **7** days without a successful read
  of the source, then **20** points off a week, nothing at **42** days, when
  the item stops earning and the console asks for the source to be mended

## Cash-Out

- 🚧 **Locked for 30 days** - a day's credit can be withdrawn from the 30th
  day after the start, or the day after it was earned if that is later
- 🚧 **On the balance's rules** - the minimum, the identity check and the
  payout account - [Balance](/p/grade10-site/account/balance#cash-out)

## Taking It Out

- 🚧 **Inside the minimum term** - an item that leaves custody before the
  90th day after the start owes the early take-out fee
- 🚧 **Shown first** - asking for the item back shows the fee and the day
  it stops applying; the ask ends the yield either way, so waiting earns
  nothing more
- 🚧 **Paid before release** - the fee is a bill, paid from the balance, by
  FPS, by card or at the counter; the item is released once it is paid -
  [Balance](/p/grade10-site/account/balance#paying-grade10)
- 🚧 **A sale is not a take-out** - an item sold under its consignment owes
  no fee
- ❓ Owner - **The fee** - proposed: the yield the item has been credited
  plus a flat amount, so enrolling and leaving early never pays; or a flat
  amount alone, which must exceed the most an item earns in 90 days, about
  **HKD 990**
- ❓ Owner - **Plain storage** - whether an item earning no yield owes the fee
  too; proposed not, storage staying free

## Consigned Items

- 🚧 **Held in the vault** - signing a consignment agreement opens a storage
  case on each item not already in one, straight into custody; the item
  stays in its case while it is on sale
- 🚧 **Yield picked at intake** - an admin picks whether each consigned item
  earns; consignment itself never pays yield
- 🚧 **Sold** - the yield stops the day the item sells, the case closes when
  the item leaves to its buyer, and no fee is owed
- 🚧 **Taken back** - a consigned item taken back inside its minimum term
  owes the fee as any item does
- 🚧 **Unsold at the term's end** - the item stays in its case, still earning
- ❓ Legal - **The paper** - that the custody and yield terms ride in the
  consignment agreement, signed once at the counter, rather than in a
  second agreement

## What the Owner Hears

| Message | When |
| --- | --- |
| Yield starts | an item is enrolled: the start, the lock's end, the minimum term's end and the fee |
| Price set | an admin set or changed the item's price, and the day it applies from |
| Early take-out fee | the item was asked for back inside its minimum term: the fee, the day it stops applying, and how to pay |
| Yield ends | the item's yield stopped: the day and what it earned |

- **What it earned** - each credit is a line on the balance, and the month's
  statement totals it by item - [Balance](/p/grade10-site/account/balance)

:::detail{title="Product decisions" for="pm"}
The vault pays an owner for keeping a card the house values in its custody,
and pays less for a card that would be hard to sell, because a thin market
is where the house's risk sits. The owner's sketch is a table of yearly
amounts by value band and a formula, value × liquidity factor × annual rate
/ 365; the advisor's working is
[Vault Yield Liquidity](/references/vault-yield-liquidity).

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Keeps a valuable card in the vault | Sees what it earns a year and each day, and withdraws it after the lock |
| Consignor | A card waiting to sell | Earns while it waits, without the sale paying for it |
| Shop staff | A card at intake | Attaches its page once and never prices it by hand again |
| Treasurer | Month end | Reads what the yield cost and what it owes a year at this week's values |

**Not in scope.** Yield on a financed case; compounding; yield on the
balance itself; an owner enrolling their own item.

**Measurement.** Items enrolled and their value; yield credited a month;
items earning nothing for want of a price; items released inside the
minimum term.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Yield is the vault's | Decided | The vault enrols and credits; consignment never pays it, so a consigned item earns as any vault item does - on the owner's direction, 2026-10-26 | Owner |
| Optional, per item | Decided | An admin picks each item, at intake or later - on the owner's direction, 2026-10-26 | Owner |
| Credited daily, to the account's balance | Decided | One credit per item per day, keyed by the item and the day, so the balance can be told twice and pay once - on the owner's direction, 2026-10-26 | Owner |
| Eventually right | Decided | A week's value is worked from what was observed before its cutoff, so a late run equals an on-time one; a day once credited is never worked again - on the owner's direction, 2026-10-26 | Owner |
| A weekly value | Decided | The value and the factor move once a week rather than daily: a daily value moves the credit three times as much for nothing but noise, and a week's lag after a fall costs about 0.06% of the item's value - 2026-10-26, on the advisor's working | Product |
| Liquidity depreciates the value | Decided | Activity, spread and the observation's age, multiplied; nothing under three sale days in 90 - 2026-10-26, on the advisor's working | Product |
| A median, not a mean | Decided | One sale far from the rest moved a 30-day mean by half in the advisor's example and the median not at all - 2026-10-26 | Product |
| Enrolled from HKD 5,000 | Decided | The table's floor is checked once, at enrolment, so no item flips in and out of earning around it - 2026-10-26 | Product |
| Lock and minimum term | Decided | **30** days before a credit can be withdrawn and **90** before the item leaves without a fee, both counted per item from its start - on the owner's direction, 2026-10-26 | Owner |
| Asking ends the yield | Decided | The house stops paying the day the owner asks for the item back, so a slow collection earns nothing - 2026-10-26 | Product |
| Four eyes on what sets a value | Decided | A second person checks the page and grade attached at intake and approves every set price; the yield pays from both - 2026-10-26 | Product |
| Called yield | Decided | Not interest: the vault's loan already charges interest, and a card held is not money deposited - 2026-10-26; Legal confirms the name | Product |
| The schedule | ❓ Open | The table and the formula disagree. Proposed: one rate, **4%** of the factored value, at most **HKD 4,000** a year: the table's amount at the middle of each band, at **0.93-0.98** times the table's cost, with no cliff between bands. The advisor's alternative: **6%** on the first HKD 50,000 and **2%** on the next: the table's amount at the bottom of each band, at **1.22-1.29** times its cost. The table as steps pays HKD 1,300 at HKD 49,999 and HKD 3,000 at HKD 50,000 | Owner |
| The set-price factor | ❓ Open | The owner's formula pays a set price in full; the advisor proposes **40%** and comparables as a second source | Owner |
| The early take-out fee | ❓ Open | Its figure and its form | Owner |
| Limits | ❓ Open | A yearly cap per owner, a budget for the whole yield, and a stop that sets the rate to nothing from the next day | Owner |
| Fetching SNKRDUNK | ❓ Open | Its terms forbid crawling and commercial use without consent; prices are typed by staff until SNKRDUNK agrees | Legal |
| Paying a yield | ❓ Open | Whether paying an owner for an item in custody needs a licence or wording beyond the custody agreement, and which entity pays it | Legal |
:::
