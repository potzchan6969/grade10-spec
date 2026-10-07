## Goals

- An admin protects a lot's final price with a hidden house maximum, without
  raising its starting price
- The house enters the bidding at a time the admin chooses, not from the
  start
- An admin can change the internal bid as the sale runs, without moving a
  price or a lead that collectors have already seen
- Operators can tell a lot the house bought in from a sale and from a lot
  nobody bid on

## Non-Goals

- Disclosing the house bid to collectors, on the listing or in Recent bids
- A collector-facing reserve price, or a "reserve met" signal
- More than one internal bid on a listing
- Lowering or withdrawing a collector's maximum
- An order, invoice or settlement for a lot the house wins
- Carrying an internal bid to a relisted lot
- An internal bid on a campaign, or set once for many listings
- Reporting beyond the Bought in label and the existing Stats dialog

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What do collectors see of the house bid? | Undisclosed: it bids under a listing pseudonym like any collector, and nothing says the house may bid (held) | Disclosing that the lot carries a house bid, the interview's recommendation: it removes the shill-bidding risk and keeps the protection. The author held undisclosed. Legal sign-off is open in the proposal |
| Q2 | When the house leads at the close, how does the lot end? | Collectors see it sold, under the house's pseudonym (held) | Closing Unsold, the interview's recommendation: it reuses the existing close, but the author ruled it out because it tells collectors a house bid existed |
| Q3 | What does "lowering does not leave the lead stranded" mean once the internal bid is placed? | A lower amount is accepted only when the leader and the current bid stay the same, and never below a bid already placed for the house (recommended) | Lowering only while the house leads, which refuses harmless lowers once the house is outbid; and lowering freely until the house's first bid, which drops the flexibility asked for |
| Q4 | When can the time be set, and what changes before it? | Required, between the start and the scheduled close. Until it arrives the amount and the time can change or be removed; after it the time is fixed (recommended) | A time in extended bidding, which may never arrive because the close can pass first; and an optional time that defaults to the start, which the author ruled out |
| Q5 | What happens behind the public "sold" when the house wins? | Bought in for operators only: no order, no winner letters, stock released as at an Unsold close, Relist offered, Bought in on the Listings table (recommended) | Plain Unsold internally, which mixes bought-in lots into unsold counts; and keeping the stock held until an operator acts, which adds a manual step |
| Q6 | Who can set and see an internal bid? | `auction:reserve`, held by admin; the audit trail records "set" without the amount (recommended) | `auction:operate`, which shows every staff operator which lots are protected |
| Q7 | The internal bid is already short of the next bid at its time | Not placed and invisible to collectors; the admin sees "not placed" and can still raise it until the close, which places it at once (recommended) | Not placed and locked, which leaves the admin unable to respond to a lot running hot |
| Q8 | Can the house raise during extended bidding? | Yes, any time the lot takes a bid; a raise that moves the price restarts the timer as a collector's would (recommended) | Freezing it at the scheduled close, which leaves the house unable to respond late |
| D1 | One internal bid per listing? | One. Agent default, not asked; open to override | Several house maximums, which compete with each other and add nothing |
| D2 | Which bidder checks apply to the house? | Ceiling and minimum next bid only; no card, enrollment, verified-identity or suspension check. Agent default, not asked; open to override | Holding the house to collector checks it cannot meet, such as a linked card |
| D3 | What happens to an internal bid on Relist or call-off? | Relist starts without one; call-off drops it with the listing. Agent default, following the existing rule that a relisted draft starts its reserve as a new draft does | Carrying it to the relisted draft, which commits a floor the admin did not choose again |
| D4 | Do collectors outbid by the house get the ordinary letters? | Yes, the same outbid, new-bid and lost letters, following Q1. Agent default, not asked | Holding letters back for house bids, which reveals the house through a missing letter |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
