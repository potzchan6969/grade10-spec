## Goals

- Let an operator create a listing with a starting price of 0
- Keep the first-bid minimum rule as it is

## Non-Goals

- Reserve prices
- A first bid of 0, or of one minor unit
- Changing the price-tier increments
- Changing how the collector's page shows a starting price

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | With a 0 start, what is the lowest first bid? | 0 plus the currency's lowest increment — today's rule, unchanged (author's choice) | Any bid from 0; one minor unit — rejected: both change the bidding rules |
| Q2 | Which currencies allow a 0 start? | USD, HKD and JPY (author's choice) | Only some currencies |
| Q3 | Are negative or non-whole amounts still refused? | Yes (decided by the round) | Accept any amount — rejected: out of scope |
| Q4 | With one bidder on a listing that starts at 0, what does the current bid stand at, and so what can the lot sell for? Today a lone maximum stands at the starting price | The **opening price**: the starting price, or the currency's lowest increment when the start is 0 - 100 minor units `USD`, 1000 `HKD`, 100 `JPY`. The first bid must reach it, a lone bidder stands at it, and one increment above the current bid applies from the second bid. A start of 0 and a start of 1000 `HKD` both leave a lone bidder at 1000 (author's choice, 2026-09-29) | Stand at 0 - rejected: a lot sells for nothing. The lowest increment only on a 0 start with start plus increment as every first bid - rejected: a non-zero start lets the first bidder stand on the starting price |
| Q5 | The page's Refused line still names "a starting price that is not a positive whole amount". Which line does this change rewrite? | The 🚧 line carries the change; the Refused line drops "positive" when the 🚧 comes off at archive - decided by the round | Rewriting the Refused line now - rejected: it would state 0 as accepted before it runs |
| Q6 | How does a starting price of 0 read back on the form? | As any other amount in that currency, through the same formatter - decided by the round | A special "Free" or "No reserve" label - rejected: a new label is copy nobody asked for |
| Q7 | With no currency chosen, does a 0 start create as `HKD` 0? | Yes - the existing `HKD` default applies to a 0 start as to any other - decided by the round | Requiring a chosen currency for a 0 start |
| Q8 | Is an empty or null starting price at create read as missing, or as 0? | Missing: create refuses it, and nothing stores 0 in its place - decided by the round | Coercing empty to 0 - rejected: an operator who forgot the price would publish a free lot |
| Q9 | Does publish check the starting price again? | No - create is the gate; a created listing at 0 publishes like any other - decided by the round | A second price check at publish |
| Q10 | Is a lone maximum's stand on a 0 start recorded as that collector's bid? | Yes - one public bid at the lowest increment, as a lone maximum on a positive start is recorded at the starting price - decided by the round | No bid until a second maximum arrives - rejected: the bid count and history would disagree with the current bid |
| Q11 | On a 0 start, is a starting price of 0 beside a current bid at the lowest increment the intended pair on the bid panel? | Yes - the panel shows both facts as it does today; how it shows a starting price is a non-goal - decided by the round | Hiding the starting price once a bid stands |
| Q12 | Two specs disagree on the first bid: `grade10-site/auction/auction` says it meets the starting price, `grade10-site/auction/bid-increments` says the starting price plus its tier increment, and the app takes the first. Which holds, on every start? | The opening price (Q4): the starting price, or the lowest increment on a 0 start. `grade10-site/auction/bid-increments` and the Bidding page's worked example are rewritten, and the app's floor moves only on a 0 start; the page's unmarked "A first maximum" line drops "plus one increment" when the 🚧 comes off at archive (author's choice via Q4, reversing the round's first call) | The starting price plus its tier increment on every start - the round's first call, reversed by Q4: it moved every unbid lot's floor and contradicted what the author wants a non-zero start to do |
| Q13 | Before any bid, what does quick-bid chip 1x read? | The opening price plus one increment: the chips count from the opening price before any bid, as from the current bid after - decided by the round | Chip 1x at the opening price itself - rejected: the chips are steps above what stands, and the custom field already takes the opening price |
| Q14 | The first-bid rule has no journey of its own. Is `grade10-site-auction-auction-US-02` its walk? | Yes - placing a bid inside the window is where a collector meets the minimum; no new journey - decided by the round | A first-bid journey of its own - rejected: it would restate US-02's walk |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-admin/auction/listing` | The page's Refused line contradicts the 🚧 line allowing 0 | Q5 |
| `grade10-admin/auction/listing` | The formatted read-back of 0 per currency | Q6 |
| `grade10-admin/auction/listing` | Whether a 0 start with no currency chosen creates as `HKD` 0 | Q7 |
| `grade10-admin/auction/listing` | Whether an empty or null starting price at create is missing or 0 | Q8 |
| `grade10-admin/auction/listing` | Whether publish checks the starting price again | Q9 |
| `grade10-site/auction/auto-bidding` | Whether a lone maximum's stand on a 0 start is recorded as a bid | Q10 |
| `grade10-site/auction/auto-bidding` | Whether a starting price of 0 beside a current bid at the lowest increment is the intended pair | Q11 |
| `grade10-site/auction/auction` | What quick-bid chip 1x reads before any bid | Q13 |
| `grade10-site/auction/auction` | Whether US-02 is the walk for the first-bid rule | Q14 |
