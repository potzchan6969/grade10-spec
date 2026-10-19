## Goals

- A collector never sees a bid amount the auction's currency ceiling refuses
- A collector whose maximum is already the ceiling reads that fact instead of a broken raise form
- A collector on a lot whose next minimum is above the ceiling reads that bidding has reached the limit

## Non-Goals

- Changing the USD, HKD or JPY ceilings, increments, minimum bids, refusal codes, refusal logs or accepted bids
- A new component export, layout, token or primitive-variant work
- Disclosing the ceiling on the field in the normal case; the typed-draft correction is settled copy
- The signed-out panel; it carries no floor data and keeps its sign-in action
- A ceiling row on the standing banner, a toast, or any surface other than the raise group itself

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does the raise group show when no legal amount exists? | Collapse to a status row - no chips, no custom field, no bid action - the amount reached leads, with the existing private-maximum Info tooltip, then one line that the auction accepts no higher amount - decided by the round | Keeping the controls visible but disabled, like the needs-card lock; it leaves dead controls on screen and still invites entry. A standalone status row with no amount was ruled out: the viewer's maximum is only printed inside this group |
| Q2 | What triggers the collapse? | `floor > ceiling` - no legal amount exists - decided by the round | Testing `viewerMaximum == ceiling`; it misses the lot whose minimum next bid already exceeds the ceiling, which would still draw chips above the ceiling |
| Q3 | Does the buyer-fee line survive the collapse? | Yes - decided by the round | Dropping it with the bid action, matching the signed-out precedent; the premium still applies to the maximum the collector holds |
| Q4 | What happens to a chip computed above the ceiling? | Clamp to the ceiling, caption it as the limit, and merge duplicates - decided by the round | Dropping the chip, which shrinks the row without saying why; or offering the ceiling only once every preset exceeds it |
| Q5 | Does the collapsed row keep the mechanism line? | No - "you can raise" is no longer true; the limit line replaces it - decided by the round | Keeping it under the row; it would promise an action the row removed |
| Q6 | Does a chip landing exactly on the ceiling read the limit caption? | Yes - committing it leaves no higher amount, so it reads the same way a clamped chip does - decided by the round | The delta caption; the amount is legal, but naming it a raise over the maximum invites a further step that does not exist |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/auction-listing | A chip landing exactly on the ceiling is legal - does it read the limit caption or the delta caption? | Q6 |
