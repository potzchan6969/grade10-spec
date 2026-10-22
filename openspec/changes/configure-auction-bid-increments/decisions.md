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
