## Goals

- A listing's story on My bids reads as the price ladder, higher amount on top
- A bid and the automatic response it set off read the same way every time, at one timestamp or across pages
- The requirement, its scenario, the walk and the PRD say one thing

## Non-Goals

- The admin Bids tab ([#1321](https://github.com/9gag/grade10/issues/1321)) keeps its own order
- No change to which events the history holds, to the amounts shown, to pseudonyms, or to page size and cursors
- No change to the code here: the ordering change in `combinedHistory.ts` is made in `9gag/grade10` after acceptance

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | In what order does the combined history read? | By bid amount, higher on top - settled on the issue, not reopened | Chronology by clock, challenger first: at one timestamp the clock cannot tell the bid from its response |
| Q2 | Where does the automatic response sit against the challenger's bid at one timestamp? | Above it: the challenger's bid is older, so it reads below - settled on the issue | The challenger above its response, which is today's rule and what the issue replaces |
| Q3 | Where does the owner's "Maximum set" event sit? | Below the bid it causes, by the same rule - settled on the issue | Above the bid, as a setup step; it breaks the one rule |
| Q4 | Which scenario states the old order? | The scenario "An automatic response is attributed to You" says the challenger comes first and is restated. The two the issue named are the retired one and the paging scenario, which states no order - decided by the round | Editing the paging scenario: it holds no ordering text |
| Q5 | Does the equal-maximum tie follow it? | Yes: both records show the same resolved amount and the earlier leader still leads; the response reads above the challenger's record - decided by the round | A separate tie order: two rules for one ladder |
| Q6 | Do public recent bids on the listing change order? | No: only the account's combined history on My bids changes; the public list is untouched - decided by the round (the issue names My bids alone) | Reordering the public list too: not asked for, and it is another surface |
| Q7 | At what amount does a maximum set sort, when it exceeds the bid it causes? | With the bid it causes, below it - decided by the round, following Q3 | Sorting by its own amount: it would lift a maximum above the bid, against Q3 |
| Q8 | Where does a maximum raise that causes no bid sort? | By its own time among the other records, newer above older - decided by the round, following Q3: a record whose decision wrote no bid has none to follow | Pinning it to its own amount: it would lift a raise above bids newer than it. Leaving it unsaid: the owner's own set and raise could swap places with no rule saying which |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/bidding-history` | Where does a maximum raise that causes no bid sort, the input naming only a maximum set below the bid it causes? Options: (a) with the decision's highest public bid, or with none by its own time, newer above older; (b) by its own amount; (c) always below the earliest bid. recommended: (a) | Q8 |
