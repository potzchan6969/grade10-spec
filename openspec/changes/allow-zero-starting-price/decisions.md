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
| Q4 | With one bidder on a listing that starts at 0, what does the current bid stand at, and so what can the lot sell for? Today a lone maximum stands at the starting price | ❓ pm - recommended: the currency's lowest increment - 100 minor units `USD`, 1000 `HKD`, 100 `JPY` - the same amount as the minimum first bid, so no lot stands or sells at 0 | Stand at 0, the starting price - rejected: a single bidder would win the lot for nothing, which is the first bid of 0 that Q1 and the non-goals rule out |
| Q5 | The page's Refused line still names "a starting price that is not a positive whole amount". Which line does this change rewrite? | The 🚧 line carries the change; the Refused line drops "positive" when the 🚧 comes off at archive - decided by the round | Rewriting the Refused line now - rejected: it would state 0 as accepted before it runs |
| Q6 | How does a starting price of 0 read back on the form? | As any other amount in that currency, through the same formatter - decided by the round | A special "Free" or "No reserve" label - rejected: a new label is copy nobody asked for |
| Q7 | With no currency chosen, does a 0 start create as `HKD` 0? | Yes - the existing `HKD` default applies to a 0 start as to any other - decided by the round | Requiring a chosen currency for a 0 start |
| Q8 | Is an empty or null starting price at create read as missing, or as 0? | Missing: create refuses it, and nothing stores 0 in its place - decided by the round | Coercing empty to 0 - rejected: an operator who forgot the price would publish a free lot |
| Q9 | Does publish check the starting price again? | No - create is the gate; a created listing at 0 publishes like any other - decided by the round | A second price check at publish |
| Q10 | Is a lone maximum's stand on a 0 start recorded as that collector's bid? | Yes - one public bid at the lowest increment, as a lone maximum on a positive start is recorded at the starting price - decided by the round | No bid until a second maximum arrives - rejected: the bid count and history would disagree with the current bid |
| Q11 | On a 0 start, is a starting price of 0 beside a current bid at the lowest increment the intended pair on the bid panel? | Yes - the panel shows both facts as it does today; how it shows a starting price is a non-goal - decided by the round | Hiding the starting price once a bid stands |
| Q12 | Two specs disagree on the first bid: `grade10-site/auction/auction` says it meets the starting price, `grade10-site/auction/bid-increments` says the starting price plus its tier increment, and the app takes the first. Which holds, on every start? | The starting price plus its tier increment, as the Bidding page already states ("The first bid must reach HK$210"); this change rewrites the auction requirement and moves the app's first-bid floor to match - decided by the round | Keep the starting price as the first bid - rejected: it contradicts the page, and on a 0 start it takes the one-minor-unit first bid the non-goals rule out |
| Q13 | Before any bid, what does quick-bid chip 1x read? | The first-bid minimum: the chips count from the starting price before any bid, so chip 1x is the starting price plus its tier increment - on a 0 start, the lowest increment - decided by the round | Counting from 0, or from the starting price without the increment - rejected: a chip that reads below the minimum is refused on tap |
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
