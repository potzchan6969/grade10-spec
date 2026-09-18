## Goals

- One auction standing governs deadline suspensions and operator suspensions
- A suspension blocks new bidding while leaving accepted bids and their history unchanged
- Operators can act from Users without exposing their moderation reason to the collector

## Non-Goals

- A second platform-ban state or a separate Bidders-only suspension state
- Bulk suspension, scheduled expiry, or a new suspension request workflow
- Changes to payment, store access, loyalty, or sign-in

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is the Bidders-section ban the same auction suspension? | Yes. One active auction-scoped suspension is authoritative. The existing Bidders `banned` field and filter remain a compatibility projection while callers move to the suspension service. | Maintaining two flags that can disagree about whether a bidder may act |
| Q2 | What happens when a second cause arrives while the account is already suspended? | Keep one active suspension row and append a cause log entry. A missed deadline records the expired order; an operator action records the actor and reason. No second suspension and no duplicate standing transition. | Replacing the first reason or creating one active row per cause |
| Q3 | What does reinstatement lift? | One authorized reinstatement lifts the active auction suspension and all causes recorded on it. The append-only history remains available to operators. | Reinstating only the cause that an operator selected |
| Q4 | What happens to bids already placed? | Suspension checks apply only to new bids and maximum raises. Existing maxima continue through the normal locked auto-bidding and close paths; suspension writes no bid-history event. | Retraction and re-resolution on every open listing |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/bidder-suspension` | Whether the Bidders ban and auction suspension share one state | Q1 |
| `grade10-site/auction/bidder-suspension` | Whether a second cause creates a second active suspension | Q2 |
