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
| Q4 | Which scenario states the old order? | The scenario "An automatic response is attributed to You" (`SC-12`, id `g10.auction-bidding-history.SC-9ii`) says the challenger comes first and is restated. The issue named `SC-13` / `SC-k4s`; `SC-13` is retired and `SC-k4s` is `SC-14`, the paging scenario, which states no order - decided by the round | Editing `SC-14`: it holds no ordering text |
| Q5 | Does the equal-maximum tie follow it? | Yes: both records show the same resolved amount and the earlier leader still leads; the response reads above the challenger's record - decided by the round | A separate tie order: two rules for one ladder |
| Q6 | Do public recent bids on the listing change order? | No: only the account's combined history on My bids changes; the public list is untouched - decided by the round (the issue names My bids alone) | Reordering the public list too: not asked for, and it is another surface |
| Q7 | At what amount does a maximum set sort, when it exceeds the bid it causes? | With the bid it causes, below it - decided by the round, following Q3 | Sorting by its own amount: it would lift a maximum above the bid, against Q3 |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
