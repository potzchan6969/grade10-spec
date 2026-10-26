---
title: Yield
order: 3
---

| Setting | Default |
| --- | --- |
| Who earns | an item in a storage vault case that an admin enrols; never one securing a loan |
| The item's value | its market value in HKD, taken each week, times its liquidity factor; or a price an admin sets, times the factor that admin picks |
| A day's credit | the item's value × the case's annual rate / 365, to the owner's balance |
| Annual rate | **4%**, the default each case starts on; an admin may set a case's own rate |
| The start | the Monday after enrolment |
| Cash-out lock | **30** days from the start |
| Minimum term | **90** days from the start |
| Early take-out | a flat fee per item, **HKD 500** by default, set by an admin |
| The fee on plain storage | off by default; an admin may turn it on |
| A change | a price, the rate or the exchange rate applies from the next day; the weekly value from Monday; a day already worked never changes |

## Earning

An enrolled item earns its owner a credit for each whole day it spends in
the vault.

- 🚧 **Enrolled by an admin** - item by item, at intake or later; the owner
  is told the start, the day its lock ends and the day its minimum term ends
- 🚧 **Whole days** - from the start, every whole day in custody earns,
  until the day the owner asks for the item back, it sells, or it leaves,
  whichever comes first
- 🚧 **One rate a case, no bands** - each case earns its annual rate on its
  value, with no floor and no cap; a case starts on the default and an admin
  may change it, from the next day
- 🚧 **Credited once, eventually** - a day's credit is worked out after it
  closes and reaches the balance once; a late price delays it, never doubles it
- 🚧 **Exact over time** - each credit is whole cents, and what a day rounds
  away is carried into the next, so a year pays the year's yield
- 🚧 **Storage only** - an item securing a loan earns nothing
- 🚧 **Ended for good** - asking for the item back, a sale, a release, an
  unwind or an admin ending it stops the yield, and it does not restart on
  the same case

| The item's value, after its factor | A year, at the default 4% | A day |
| --- | --- | --- |
| HKD 7,500 | HKD 300 | about HKD 0.82 |
| HKD 15,000 | HKD 600 | about HKD 1.64 |
| HKD 75,000 | HKD 3,000 | about HKD 8.22 |
| HKD 250,000 | HKD 10,000 | about HKD 27.40 |

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
  no market value, and the item earns nothing until it sells again or an
  admin sets a price
- 🚧 **The liquidity factor** - activity × spread × the observation's age,
  each below, in whole basis points with test cases in the
  [reference](/references/vault-yield-liquidity); a card that rarely sells
  is worth much less to the house than its price says
- 🚧 **A set price** - where the item's exact grade has no SNKRDUNK page, or
  its page gives no value; the admin types it in HKD with its evidence and
  picks its factor, from nothing to the full price, and a second admin
  approves both; it is reviewed every **90** days and fades to nothing over
  the **28** days after a missed review
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
- 🚧 **A flat fee** - one amount per item, **HKD 500** unless an admin sets
  another, whatever the item is worth or has earned
- 🚧 **Shown first** - asking for the item back shows the fee and the day
  it stops applying; the ask ends the yield either way, so waiting earns
  nothing more
- 🚧 **Paid before release** - the fee is a bill, paid from the balance, by
  FPS, by card or at the counter; the item is released once it is paid -
  [Balance](/p/grade10-site/account/balance#paying-grade10)
- 🚧 **A sale is not a take-out** - an item sold under its consignment owes
  no fee
- 🚧 **Plain storage** - an item earning no yield owes no fee unless an admin
  turns the fee on for storage too; it is off by default

## Consigned Items

- 🚧 **Held in the vault** - signing a consignment agreement opens a storage
  case on each item not already in one, straight into custody; the item
  stays in its case while it is on sale
- 🚧 **Yield, not an incentive** - an admin picks at intake whether each
  consigned item earns the yield; consignment pays no incentive of its own
- 🚧 **Sold** - the yield stops the day the item sells, or the day after the
  last day already credited if the sale reaches the vault late; the case
  closes when the item leaves to its buyer, and no fee is owed
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
| Price set | an admin set or changed the item's price or its factor, and the day it applies from |
| Early take-out fee | the item was asked for back inside its minimum term: the fee, the day it stops applying, and how to pay |
| Yield ends | the item's yield stopped: the day and what it earned |

- **What it earned** - each credit is a line on the balance, and the month's
  statement totals it by item - [Balance](/p/grade10-site/account/balance)

:::detail{title="Product decisions" for="pm"}
The vault pays an owner for keeping a card the house values in its custody,
and pays less for a card that would be hard to sell, because a thin market
is where the house's risk sits. The owner's formula, value × liquidity
factor × annual rate / 365, sets the yield, and supersedes an earlier table
of yearly amounts by value band; the advisor's working is
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
| Yield is the vault's | Decided | The vault enrols and credits; consignment never pays it, so a consigned item earns as any vault item does, and the yield replaces consignment's signing incentive - decided by the owner, 2026-10-26 | Owner |
| Optional, per item | Decided | An admin picks each item, at intake or later - on the owner's direction, 2026-10-26 | Owner |
| The formula | Decided | A day's credit is the factored value × the annual rate / 365, with no bands, no floor and no cap; the band table is superseded - decided by the owner, 2026-10-26 | Owner |
| Credited daily, to the account's balance | Decided | One credit per item per day, keyed by the item and the day, so the balance can be told twice and pay once - on the owner's direction, 2026-10-26 | Owner |
| Eventually right | Decided | A week's value is worked from what was observed before its cutoff, so a late run equals an on-time one; a day once credited is never worked again - on the owner's direction, 2026-10-26 | Owner |
| A weekly value | Decided | The value and the factor move once a week rather than daily: a daily value moves the credit three times as much for nothing but noise, and a week's lag after a fall costs about 0.06% of the item's value - 2026-10-26, on the advisor's working | Product |
| Liquidity depreciates the value | Decided | Activity, spread and the observation's age, multiplied; nothing under three sale days in 90 - 2026-10-26, on the advisor's working | Product |
| A median, not a mean | Decided | One sale far from the rest moved a 30-day mean by half in the advisor's example and the median not at all - 2026-10-26 | Product |
| The set-price factor | Decided | The admin who sets a price picks its factor, and a second admin approves both - decided by the owner, 2026-10-26 | Owner |
| Lock and minimum term | Decided | **30** days before a credit can be withdrawn and **90** before the item leaves without a fee, both counted per item from its start - on the owner's direction, 2026-10-26 | Owner |
| The early take-out fee | Decided | A flat amount per item, **HKD 500** by default and changed by an admin; it supersedes consignment's early take-back fee, which stays at none; on plain storage it is a setting, off by default - decided by the owner, 2026-10-26. With no cap, an item worth HKD 250,000 earns about HKD 820 in 30 days at 4%, more than the default fee | Owner |
| Asking ends the yield | Decided | The house stops paying the day the owner asks for the item back, so a slow collection earns nothing - 2026-10-26 | Product |
| Four eyes on what sets a value | Decided | A second person checks the page and grade attached at intake and approves every set price and its factor; the yield pays from both - 2026-10-26 | Product |
| Called yield | Decided | Not interest: the vault's loan already charges interest, and a card held is not money deposited - 2026-10-26; Legal confirms the name | Product |
| The annual rate | Decided | Set per case, every case starting on a default of **4%** kept in code - decided by the owner, 2026-10-26 | Owner |
| No cap, a clear forecast | Decided | No cap per item, per owner or in total; instead the console forecasts what the yield will cost and a stop sets every rate to nothing from the next day - decided by the owner, 2026-10-26 | Owner |
| Fetching SNKRDUNK | Decided | SNKRDUNK consents; its sales are fetched daily, and staff typing stays the fallback - 2026-10-26 | Owner |
| Paying a yield | ❓ Open | Whether paying an owner for an item in custody needs a licence or wording beyond the custody agreement, and which entity pays it | Legal |
:::
