## Goals

- Collectors bid on steps that match Goldin's published schedule
- Retuning an increment is a configuration change, with no change to the spec
- The manual shows the values in force

## Non-Goals

- An operator screen or an API to edit the schedule
- A schedule per listing, per campaign or per bidder
- A currency other than USD, or a second schedule
- Moving the bid ceiling, the opening-price rule or the verified-bidder threshold
- Re-pricing a bid that already stands
- Defining Goldin's extended bidding, buyer's premium or other FAQ rules

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does the schedule live, and who changes it? | A versioned configuration file, changed by pull request and deploy - decided by the round (recommended) | A database setting edited in the admin app: it adds a table, a screen, an audit trail and a fetch on every client, for a schedule that changes rarely. An environment variable: it has no review and no history |
| Q2 | What happens to bids already standing when the values change? | The next bid reads the schedule afresh from the amount being beaten, and standing bids keep their amount - decided by the round (recommended) | Freezing the schedule on each listing when it opens: it contradicts the rule that no listing keeps its own increment, and adds state per listing |
| Q3 | What is the increment below $10, where Goldin names none? | $1, so the opening price on a $0 start stays $1 - decided by the round (recommended) | $2, extending Goldin's first tier down to $0: it also moves the opening price on a $0 start |
| Q4 | Which values does the schedule start with? | Goldin's published schedule from [How does bidding work?](https://goldin.co/faq), eighteen tiers from $10 to $1,500,000 and up | The current six tiers: they sit below Goldin's at every price above $100, so the same lot steps differently on the two sites |
| Q5 | Do the values stay in the requirement? | No: the requirement carries the rule, and the manual shows the values in force | Keeping the table in the spec: every retune would need a delta and an acceptance, which is what this change removes |
| Q6 | Does the change reach lots already open? | Yes, on the next bid; a lot open at deploy takes the new minimum - decided by the round | Applying it to lots scheduled after deploy: two schedules would run at once, and a collector could not tell which one a lot follows |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/bid-increments | A collector holds an open listing page when the configured schedule changes. Does the page's Min refresh on its own, or only on the next read or bid attempt? Options: (a) Min refreshes on the next page read or bid attempt; (b) Min refreshes live on the open page. recommended: (a) | |
| grade10-site/auction/bid-increments | That collector then submits a bid at the old minimum, which is below the new minimum. Is it refused, with the new minimum shown, or accepted because the page showed it? Options: (a) refused, new minimum shown, nothing recorded; (b) accepted at the old minimum. recommended: (a) | |
| grade10-site/auction/bid-increments | A maximum committed before a schedule change is standing. When it later answers a rival bid, does it read the changed schedule at the amount being beaten? Options: (a) yes, every proxy step reads the schedule afresh; (b) the schedule in force when the maximum was committed. recommended: (a) | |
| grade10-site/auction/bid-increments | May a bid or a tier boundary carry a fractional dollar? Is a price one minor unit below a tier's lower bound in the lower tier? Options: (a) amounts are whole minor units and the bound is inclusive at the exact minor unit; (b) bids are whole dollars only. recommended: (a) | |
| grade10-site/auction/bid-increments | A maximum is committed below the minimum next bid, or below the starting price on a first maximum. Is it refused with the minimum shown? Options: (a) refused with Min shown, nothing recorded; (b) accepted and held until it can act. recommended: (a) | |
| grade10-site/auction/bid-increments | What happens when the configured schedule is invalid: no tier from $0, overlapping or unsorted tiers, a zero or negative increment, or an empty schedule? Options: (a) it is rejected before it takes effect and the last good schedule stays in force; (b) it loads and bids are refused until fixed. recommended: (a) | |
| grade10-site/auction/bid-increments | The $1 floor tier is named in the shape, but the opening price on a $0 start is the lowest configured increment. If a retune sets the floor increment above $1, is the opening minimum that amount, and is the $1 floor a fixed rule or only the starting value? Options: (a) the floor increment is configuration like any other and the opening minimum follows it; (b) the $1 floor is fixed and cannot be retuned. recommended: (a) | |
| grade10-site/auction/bid-increments | A collector who views Grade10 in another display currency, such as HKD, opens a listing. Do Min, Highest bid and the bid field still read USD only, or does a converted amount show beside them? Options: (a) USD only on every bid surface; (b) a converted reading beside the USD amount. recommended: (a) | |
| grade10-site/auction/bid-increments | Does a house maximum, or a bid placed in extended bidding, read the same schedule at the amount being beaten as a collector's bid? Options: (a) yes, one lookup for every bidder; (b) the house steps differently. recommended: (a) | |
| grade10-site/auction/auto-bidding, bidding-history, auction, account-record; grade10-admin/auction/internal-bid | Dev pass: scenarios and worked examples in these capabilities quote amounts that follow the old six tiers, for example a current bid of 30000 whose next minimum is 30500, or a maximum of 1000 plus 100 giving 1100. After the new values land they read wrong, though no behaviour changes. Options: A - give each affected capability a MODIFIED delta in this change that restates the amounts so they hold under any values, the proposal's Modified Capabilities growing from one to five; B - leave them as illustrative given values and rewrite only the tests and fixtures in grade10, leaving the durable specs stating amounts the configured values contradict. recommended: A | |
