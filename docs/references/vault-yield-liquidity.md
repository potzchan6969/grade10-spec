# Vault Yield Liquidity

An advisor's working, 2026-10-26, for the valuation and the liquidity factor
behind the vault's yield: what an enrolled item's value is, how much of it the
house will pay on, and how a day's credit is worked out exactly. The decisions
it led to are on [Yield](../prds/products/grade10-site/vault/yield.md) and
[Market Prices](../prds/products/grade10-admin/inventory/market-prices.md);
where this document and those pages disagree, the pages are right. No spec or
change carries it.

The owner's sketch, 2026-10-26: a daily credit of
`30-day average × liquidity factor × annual rate / 365`, a set price paying
`price × annual rate / 365`, and yearly amounts by value band - HKD 300 for an
item worth HKD 5,000-10,000, HKD 600 for 10,000-20,000, HKD 1,300 for
20,000-50,000, HKD 3,000 for 50,000-100,000 and HKD 4,000 above.

## Summary

1. **Weekly value** - each enrolled item is valued as of Sunday from its exact
   SNKRDUNK grade; every day with sales casts one vote, its median price, and
   the value V is the lower median of those votes over the last 30 days
2. **Thin months** - topped up to the five most recent sale days within 90;
   under three sale days in 90 there is no value
3. **Rise cap** - V is at most 125% of the 90-day median, so a rise is paid
   as it holds and a fall at once
4. **The factor** - `L = A × D × O` in whole basis points: activity, spread
   and the observation's age
5. **The credit** - an exact integer per day, credited as
   `floor(cumulative) − floor(previous cumulative)`: one rounding rule, no
   residue lost, nothing paid twice
6. **A set price** - a fixed factor of **40%** and a 90-day review, rather
   than the full price

## Assumptions

1. **The owner's amounts** - HKD per item per year
2. **The source** - SNKRDUNK shows a sold history per product grade: each
   sale's date, price and condition; dates are kept as the source gives them,
   in JST
3. **The examples' rate** - **0.052** HKD per JPY, written `fx_e8 = 5,200,000`
   (HKD per JPY × 10⁸)
4. **A wash trade's cost** - at least about 5% of the price in fees and
   shipping; ❓ SNKRDUNK's current fee to confirm
5. **What L is** - a statement of risk appetite, not a value-at-risk model;
   its knots are versioned parameters, each with its reason

## The Value

A plain 30-day mean is the wrong statistic: one mislabelled grade, typo or
shill print moves it. Over 400 simulated markets per case with 5% bad prints,
the mean's 95th-percentile error was **17% / 37% / 48%** for liquid, medium
and thin markets, against **8% / 10% / 14%** for the statistic below; on clean
data the two tie, the statistic slightly conservative.

1. **The exact grade only** - the product and the grade or condition linked at
   intake; PSA 10 is never pooled with PSA 9, nor raw A with B. A grade
   SNKRDUNK does not list (BGS 9.5, CGC 10) maps only to an equal or lower one
   it does, or goes to a set price
2. **One vote per day** - each date votes the lower median of its prices, so a
   wash spree or a dealer selling ten copies in one day counts once
3. **The sample** - the last 30 days' sale days when there are at least five,
   otherwise the five most recent sale days within 90
4. **V** - the lower median of the sample: always a real sale price, never
   rounded
5. **The rise cap** - `V = min(V_S, floor(5 × V90 / 4))`, V90 being the lower
   median of every vote in 90 days; stateless, and it limits what manipulation
   can buy to +25%
6. **No trimming** - the median already ignores one huge sale; a print above
   twice or below half the current V is flagged at ingestion for a second
   person, never dropped unseen

Trimmed and winsorised means trim nothing at the three to six sale days a thin
card has, and weighting by volume gives a wash trader more weight, not less.

## The Factor

```
eff = min(asof, watermark);  obs_age = asof − eff     (watermark: the last date the source was read in full)
days = distinct sale dates with 0 ≤ eff − date ≤ 89
W = Σ_days (90 − (eff − date));   r = 2W / 273 sale days per 30 days   (trading every day reads 30)
A = linear between knots (r, bps): (1, 0) (2, 1000) (4, 4000) (8, 8000) (12, 10000); 0 below, 10000 above
    on [r_k, r_k+1): A_k + floor((A_k+1 − A_k) × (2W − 273 × r_k) / (273 × (r_k+1 − r_k)))
q = floor(10000 × upperMedian(|x − V_S| for x in the sample) / V_S)
D = max(0, 10000 − 3 × max(0, q − 500))
O = 10000 if obs_age ≤ 7;  0 if obs_age ≥ 42;  else floor(10000 × (42 − obs_age) / 35)
L = floor(A × D × O / 10^8)
```

| Parameter | Default | Why |
| --- | --- | --- |
| Activity unit | sale days, on a triangular 90-day kernel | its mean weighted age is 29.7 days, so it reads as a 30-day measure without the cliff when a sale leaves the window; a same-day burst counts once |
| Activity knots | under 1 → 0, 2 → 10%, 4 → 40%, 8 → 80%, 12 or more → 100% | at rate r the chance of two or more sale days within 14 days is 8 / 24 / 57 / 92 / 99%; the knots sit at or below it |
| Spread | free to a 5% MAD/median, then −3 bps per bp, nothing at 38.3% | graded markets simulate at 3-4.5% and raw-condition ones at 6-8%; a slope of 3 is about a 2σ haircut on the excess |
| Observation grace and zero | 7 and 42 days | one missed weekly read is free, then 20 points a week; six weeks dark stops the yield |
| Cadence | weekly, as of Sunday, from rows ingested before Monday 06:00 HKT | least jitter, and stateless |

| Market | L, at 6% sale noise |
| --- | --- |
| Trades daily | about 100% |
| About 8 sales a month | about 70% |
| Weekly | about 37% |
| About 2.5 sales a month | about 13% |

- **Jitter** - over a simulated year of a medium market, a daily 30-day mean
  times a 30-day count moved the daily credit 153 times and 16 times its mean;
  the weekly kernel moved it 52 times and 4.4 times, the rest being real price
  change; a week's lag after a 50% fall overpays 0.06% of the value
- **Gaming** - L only rises with activity and only falls with spread and age.
  Lifting a HKD 20,000 card from 4 to 12 sale days a month takes about eight
  extra trades, at least HKD 8,000 in fees, to earn HKD 60 a month more;
  moving V needs over half the window's sale days and buys at most 25%. The
  real risk is insiders: the attached page and grade, and set prices

## Staleness

Every source - a fetcher, staff typing, a licensed feed - records each read,
its outcome and the sales it saw. Staff finding nothing new is a successful
read. Where reads overlap, each day, grade and price keeps the highest count
one read showed.

- **We failed to observe** - no read succeeded, so the watermark stops; the
  snapshot is taken as of it, sale ages freeze, and O takes the haircut below.
  At nothing, the item stops earning and the console asks for the source to
  be mended or a price to be set
- **The market had no trades** - reads succeed, the watermark moves, the
  sales age, and A falls on its own

| Days without a successful read | 7 or fewer | 14 | 21 | 28 | 35 | 42 or more |
| --- | --- | --- | --- | --- | --- | --- |
| O | 100% | 80% | 60% | 40% | 20% | 0 |

| Days without a trade, reads good | 0 | 14 | 30 | 45 | 60 | 75 |
| --- | --- | --- | --- | --- | --- | --- |
| A card that traded daily | 100% | 100% | 100% | 76% | 31% | 0 |
| A card that traded weekly | 46% | 30% | 8% | 0.3% | 0 | no value |

A card with r of 4 or more that shows no sale for 14 days of good reads is
flagged: a moved page is likelier than a stopped market.

The yield stops (L = 0) on any of: under three sale days in 90; r under 1; a
spread of 38.3% or more; 42 days without a good read; a set price past its
review; the item out of custody, pledged or held.

## The Schedule

| Scheme | At band edges | Cost against the table |
| --- | --- | --- |
| The table as steps | a 2× jump at each floor: HKD 9,999 earns 300, HKD 10,000 earns 600 | 1.00 |
| One rate per band, on the whole value | a jump wherever the rate changes | — |
| Marginal brackets, 6% to HKD 50,000 and 2% to HKD 100,000 | none | 1.22-1.29 |
| One rate, 4%, at most HKD 4,000 | none | 0.93-0.98 |
| Steps with hysteresis | rarer, still 2× | about 1.00 |

The advisor recommends the brackets: they hit the table at four of its five
band floors and keep the owner's `value × L × rate / 365` below HKD 50,000.
One 4% rate hits the table at the middle of each band instead, at its cost;
it is the proposal on [Yield](../prds/products/grade10-site/vault/yield.md),
and the owner chooses. Either way the HKD 5,000 floor is checked once, at
enrolment, so nothing flips at it later.

| Factored value (HKD) | 5,000 | 7,500 | 9,999 | 10,000 | 15,000 | 20,000 | 35,000 | 50,000 | 75,000 | 100,000+ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| The table | 300 | 300 | 300 | 600 | 600 | 1,300 | 1,300 | 3,000 | 3,000 | 4,000 |
| Brackets 6% / 2% | 300 | 450 | 599.94 | 600 | 900 | 1,200 | 2,100 | 3,000 | 3,500 | 4,000 |
| One rate, 4% | 200 | 300 | 399.96 | 400 | 600 | 800 | 1,400 | 2,000 | 3,000 | 4,000 |

## A Set Price

A typed price has no market behind it, so it is the riskiest value in the
yield; at the full price it would beat every thin market and reward an owner
for having no page.

1. **Only without a page** - where the exact grade has no SNKRDUNK listing,
   such as a sports card or a one-off; typed in HKD with evidence, approved by
   a second admin
2. **The factor** - a fixed **40%**, about what a card selling weekly earns
3. **Validity** - 90 days from approval, then falling to nothing over 28 days
   unless reviewed again
4. **Comparables** - sold prices from elsewhere (eBay, Goldin, Yahoo!
   Auctions) entered as reads of a second source, valued by the same function

## The Arithmetic

FLOOR throughout, as `applyBasisPoints` in `@grade10/utils/percent` does. JPY
has no minor unit, so V is already in minor units.

```
MV = floor(V × fx_e8 / 10^6)                      HKD cents, at the rate in force on the day credited
E  = floor(MV × L / 10^4)                         = applyBasisPoints(MV, L); a set price uses its factor
N  = the year's yield × 10^4, exact               brackets: 600 × min(E, 5,000,000) + 200 × clamp(E − 5,000,000, 0, 5,000,000)
                                                  one rate: min(400 × E, 4,000,000,000)
C_d = C_(d−1) + N_d;   credit_d = floor(C_d / 3,650,000) − floor(C_(d−1) / 3,650,000)
```

- **Exact over a year** - 365 days at a constant N credit exactly
  `floor(N / 10^4)`
- **Safe integers** - everything fits JavaScript's safe integers for V up to
  about ¥1.29 billion at 0.07 HKD per JPY; assert it, as `applyBasisPoints`
  does

## Worked Examples

The rate is 0.052; the brackets schedule; "Day 1" is a new item's first credit.

| # | Case | V (¥) | A / D / O | L | MV (HKD) | E (HKD) | Day 1 | HKD a year |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E1 | Liquid PSA 10, 80 sale days in 90 | 1,210,000 | 100 / 100 / 100 | 100% | 62,920.00 | 62,920.00 | 892 c | 3,258.40 |
| E2a | Thin, two sales in 90 days | none | — | 0 | — | 0 | 0 | 0 |
| E2b | Thin, two sales in 30 days and two older | 760,000 | 5.38 / 91.33 / 100 | 4.91% | 39,520.00 | 1,940.43 | 31 c | 116.42 |
| E3 | One ¥480,000 print among ¥100,000 sales | 100,500 (the mean says 154,143) | 53.18 / 100 / 100 | 53.18% | 5,226.00 | 2,779.18 | 45 c | 166.75 |
| E4 | A sale every 4 days | 300,000 | 75.82 / 100 / 100 | 75.82% | 15,600.00 | 11,827.92 | 194 c | 709.67 |
| E4a | E4, last good read 10 days ago | 300,000 | 71.79 / 100 / 91.42 | 65.63% | 15,600.00 | 10,238.28 | 168 c | 614.29 |
| E4b | E4, read today, no trade for 10 days | 300,000 | 57.14 / 100 / 100 | 57.14% | 15,600.00 | 8,913.84 | 146 c | 534.83 |
| E6 | Sealed box, a sale every 3 days | 150,000 | 91.09 / 100 / 100 | 91.09% | 7,800.00 | 7,105.02 | 116 c | 426.30 |
| E7 | A set price of HKD 30,000, within review | — | factor 40% | — | 30,000.00 | 12,000.00 | 197 c | 720.00 |

E4a and E4b show the two clocks: an outage holds the last state with a small
haircut, and silence is evidence that costs more.

## Test Vectors

Sales are `age:¥price`, ages counted back from the snapshot's effective date
(the watermark during an outage); `obs_age` is the as-of date less the
watermark; the rate is 5,200,000 unless noted; credits are a new item's days
1 to 3 on the brackets schedule.

| id | Sales | obs_age | V | W | A | q | D | O | L | MV c | E c | N | Credits |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | 3:500000, 20:510000 | 0 | — | — | 0 | — | 0 | 10000 | 0 | — | 0 | 0 | 0,0,0 |
| T2 | 0,1,2:100000 | 0 | 100000 | 267 | 956 | 0 | 10000 | 10000 | 956 | 520000 | 49712 | 29827200 | 8,8,8 |
| T3 | 0:200000, 10:210000, 30:190000, 47:205000 | 0 | 200000 | 273 | 1000 | 500 | 10000 | 10000 | 1000 | 1040000 | 104000 | 62400000 | 17,17,17 |
| T4 | 0-19 and 62:300000 | 0 | 300000 | 1638 | 10000 | 0 | 10000 | 10000 | 10000 | 1560000 | 1560000 | 936000000 | 256,256,257 |
| T5 | 2:98000, 6:480000, 9:101000, 13:99500, 18:103000, 24:97000, 27:100500, 35:99000, 44:96000, 52:100000, 61:97500, 70:98500, 83:96500 | 0 | 100500 | 726 | 5318 | 248 | 10000 | 10000 | 5318 | 522600 | 277918 | 166750800 | 45,46,46 |
| T6 | 1,4,8,12,20:140000; 31,36,41,47,53,58,64,70,77,85:100000 | 0 | 125000 | 743 | 5443 | 0 | 10000 | 10000 | 5443 | 650000 | 353795 | 212277000 | 58,58,58 |
| T7 | 1:100000, 5:85000, 9:115000, 14:100000, 22:130000 | 0 | 100000 | 399 | 2384 | 1500 | 7000 | 10000 | 1668 | 520000 | 86736 | 52041600 | 14,14,14 |
| T8a | T4's sales | 8 | 300000 | 1638 | 10000 | 0 | 10000 | 9714 | 9714 | 1560000 | 1515384 | 909230400 | 249,249,249 |
| T8b | T4's sales | 14 | 300000 | 1638 | 10000 | 0 | 10000 | 8000 | 8000 | 1560000 | 1248000 | 748800000 | 205,205,205 |
| T8c | T4's sales | 42 | 300000 | 1638 | 10000 | 0 | 10000 | 0 | 0 | 1560000 | 0 | 0 | 0,0,0 |
| T9 | 0-29:3000000 | 0 | 3000000 | 2265 | 10000 | 0 | 10000 | 10000 | 10000 | 15600000 | 15600000 | 4000000000 | 1095,1096,1096 |
| T10 | 0-29:1200000 | 0 | 1200000 | 2265 | 10000 | 0 | 10000 | 10000 | 10000 | 6240000 | 6240000 | 3248000000 | 889,890,890 |
| T11 | 0-29:333333, fx_e8 5123457 | 0 | 333333 | 2265 | 10000 | 0 | 10000 | 10000 | 10000 | 1707817 | 1707817 | 1024690200 | 280,281,281 |
| T12 | 0:260000 eight sales; 3,9,15,21,27,33:200000 | 0 | 200000 | 522 | 3736 | 0 | 10000 | 10000 | 3736 | 1040000 | 388544 | 233126400 | 63,64,64 |

| Set price 3,000,000 c, factor 4000: days since review | Factor | E c | N | Credits |
| --- | --- | --- | --- | --- |
| 0-90 | 4000 | 1200000 | 720000000 | 197,197,197 |
| 91 | 3857 | 1157100 | 694260000 | 190,190,190 |
| 100 | 2571 | 771300 | 462780000 | 126,127,127 |
| 118 or more | 0 | 0 | 0 | 0,0,0 |

## Versioning

1. **Parameter rows** - each set is an immutable row: an id, the algorithm,
   the day it takes effect, the values and their digest. Valuation and factor
   sets take effect only from a future Monday; the schedule and exchange rates
   from tomorrow at the earliest; nothing is back-dated
2. **Chosen by the day, not the run** - a snapshot takes the set in force for
   its week, a credit the schedule and rate in force on its day, so a late run
   computes what an on-time one would have
3. **The snapshot row** - per reference and week: the set, the cutoff, the
   watermark, the sales used or their ids and digest, and every intermediate
   figure (V_S, V90, V, W, A, q, D, O, L)
4. **The credit row** - per item and day, unique: the snapshot, schedule and
   rate, MV, E, N, the cumulative before, and the credit; written with its
   delivery to the balance as one fact
5. **Code** - each algorithm is a pure function keyed by its id and never
   edited after first use; a fix ships as the next id from the next Monday;
   each id's vectors run in CI, and a nightly replay of stored snapshots
   alarms on any difference
6. **Corrections** - a past day is never worked again; a remedy is an explicit
   adjustment line

## What the Owner Is Missing

1. **Exposure limits** - ❓ a yearly cap per owner and a budget for the whole
   yield; a stop that sets the rate to nothing from tomorrow; a daily run-rate
2. **Concentration** - ten enrolled copies of one grade share one market's
   exits, while L assumes each exits alone; count copies per grade against r,
   and a later version could divide r by the copies above a threshold
3. **Exit costs** - fees and shipping to Japan put what a sale nets near
   85-90% of V; fine for a yield, but if V × L ever feeds the loan's
   valuation it needs an exit-cost haircut, and the two valuations of one
   item must not drift apart unnoticed
4. **Insider controls** - a second person checks the page and grade at
   intake; staff-typed sales record who and when; four eyes on set prices
5. **The exchange rate** - an alert past 30 days old, a second approval for a
   move above 5%
6. **The word interest** - the vault already lends under the Money Lenders
   Ordinance; interest paid on goods in custody may raise deposit-taking or
   collective-investment questions, so counsel confirms the name and the
   structure
7. **The collector's view** - the sales used with the middle one marked, each
   part of L with a one-line reason, E, the schedule and the day's credit
