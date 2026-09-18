## Goals

- Keep every standing maximum and bid-history entry when an auction suspension starts
- Use one auction-standing restriction for deadline and operator causes
- Let an authorized operator suspend and reinstate from the Users panel without changing platform access

## Non-Goals

- A second suspension state for the Bidders section
- A new suspension expiry date or a manual withdrawal control
- Any change to payment, store access, loyalty, or platform bans

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is the auction admin's Bidders ban the same suspension as the Users-panel suspension? | Yes. Both actions use one active auction-scoped suspension. The Bidders section's existing `banned` value becomes a compatibility projection of that standing, and no second restriction is created. | Keeping `banned` and `bidderSuspensions` as independent gates that could disagree |
| Q2 | How does an existing Bidders action fit the required reason and cause history? | Existing ban and unban procedures delegate to the same suspension service. A Bidders action supplies its operator identity and a migration-safe moderation reason; the Users panel supplies the operator's entered reason. | Preserving a separate flag or letting the old action retract standing bids |
| Q3 | How are deadline and operator causes recorded on one active suspension? | The active suspension remains one row. Its append-only log records each cause: deadline entries keep the causing order and deadline, while operator entries keep the actor and operator-only reason. A later cause does not create a second active row. | Replacing the first cause, or creating one active row per cause |
| Q4 | What does reinstatement require? | An operator holding `auction:moderate` confirms reinstatement without entering a reason. The service closes the active row and retains every prior cause in the suspension log. | Requiring a second free-text reason for a move that already has an audit actor and timestamp |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |

