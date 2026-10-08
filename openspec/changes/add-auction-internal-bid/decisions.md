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
| Q6 | Who can set and see an internal bid? | `auction:reserve`, held by admin; the audit trail records each act without the amount or the time (recommended). What other operators see is Q9 | `auction:operate`, which shows every staff operator which lots are protected |
| Q7 | The internal bid is already short of the next bid at its time | Not placed and invisible to collectors; the admin sees "not placed" and can still raise it until the close, which places it at once (recommended) | Not placed and locked, which leaves the admin unable to respond to a lot running hot |
| Q8 | Can the house raise during extended bidding? | Yes, any time the lot takes a bid; a raise that moves the price restarts the timer as a collector's would (recommended) | Freezing it at the scheduled close, which leaves the house unable to respond late |
| Q13 | One internal bid per listing? | One. Agent default, not asked; open to override | Several house maximums, which compete with each other and add nothing |
| Q14 | Which bidder checks apply to the house? | Ceiling and minimum next bid only; no card, enrollment, verified-identity or suspension check. Agent default, not asked; open to override | Holding the house to collector checks it cannot meet, such as a linked card |
| Q15 | What happens to an internal bid on Relist or call-off? | Relist starts without one; call-off drops it with the listing. Agent default, following the existing rule that a relisted draft starts its reserve as a new draft does | Carrying it to the relisted draft, which commits a floor the admin did not choose again |
| Q16 | Do collectors outbid by the house get the ordinary letters? | Yes, the same outbid, new-bid and lost letters, following Q1. Agent default, not asked | Holding letters back for house bids, which reveals the house through a missing letter |
| Q9 | What do operators without `auction:reserve` see? | The house's bids labelled House in operator reads (revised by Q25), and Bought in after the close so they can Relist; never the amount, the time, or that a lot has an internal bid before the house bids. Collectors still see only the listing pseudonym (Q1). Revises Q6's "never learns a lot has one" | Hiding a bought-in lot as Unsold from staff, which miscounts sales for them; and showing staff which lots are protected before the house bids, which drops most of the secrecy |
| Q10 | On which listing statuses can an internal bid be set? | Created and Published. A window change on a Created listing that leaves the commit time outside the window clears the internal bid, and a reserve holder sees that it was cleared | Published only, the interview's recommendation, which keeps the window fixed but stops the admin preparing a bid before publishing; and refusing the window change, which tells staff the lot is protected |
| Q11 | What is checked at Save, and what at the commit time? | Refused at Save: above the currency ceiling, below the starting price, a commit time already past. The minimum next bid is judged at the commit time. A raise still short of the minimum next bid is refused. A Not placed internal bid can be lowered or removed (recommended) | Judging everything at the commit time, which leaves more internal bids Not placed for reasons known at Save |
| Q12 | Optional: a Bought in filter on the Listings table? | Yes, beside Unsold and Won (recommended) | All only, which leaves bought-in lots hard to find |
| Q17 | Commit-time bounds and amount step | From the start to the scheduled close, both included, since a bid at the scheduled close counts; amounts in whole major units, as the custom maximum is. Agent default, not asked | An exclusive close, which refuses a time the bidding rules accept |
| Q18 | Does "one per listing" refuse a second set? | A save edits the listing's one internal bid; there is never a second. Agent default, not asked | Refusing a second set, which only adds an error path |
| Q19 | Relist on a bought-in lot | The same exclusions as an Unsold lot: not in a campaign, not already relisted, stock released. Agent default, not asked | Different exclusions for one kind of closed lot |
| Q20 | Stats and the bid count | The house counts as a bidder and its bids count, matching the public bid count. Agent default, following Q9 | Leaving it out, which makes the staff count disagree with the public one |
| Q21 | A lot only the house bid on | Enters extended bidding and closes sold to the house's pseudonym at the opening price, as any lone bid does. Agent default, following the bidding rules | Closing it without extended bidding, which tells collectors a house bid was alone |
| Q22 | What reserve holders read in the bid trace | Every house commitment, raise and lower, with its Accepted At, beside the collectors'. Agent default, not asked | Leaving lowers out of the trace, which breaks dispute answers |
| Q23 | The commit time arrives while the listing is still Created | Not placed, as a bid that came too late; once the listing opens the admin can raise it, which places it at once (recommended) | Committing it when the listing is published, which adds a second trigger and bids at a time nobody set |
| Q24 | A starting-price or currency change on a Created listing leaves the internal bid outside its limits | The save goes through and clears the internal bid, as a window move does (Q10); only a reserve holder sees it was cleared (recommended) | Refusing the edit, which tells staff the lot is protected; and judging it at its time, which keeps an over-ceiling amount alive |
| Q25 | The house's row in the staff bid ledger has no account or maximum, so it stands out | Accepted, and named House in operator reads, not given a pseudonym there. Collectors still see the pseudonym | Hiding every bidder's maximum from staff, which changes existing staff reads; and a placeholder account, which shows staff a made-up account |
| Q26 | A House bid row shows staff when it was placed, and the house's first bid lands at its commit time | Shown: Q9's "never the time" protects the scheduled time before it fires; a house bid's own time is what collectors already read in Recent bids. Agent default, taken as recommended after the author declined the prompt; open to override | Hiding House bid times from staff, which drops a column collectors can read anyway |
| Q27 | What amount a kept internal bid holds after a currency change | The same count of minor units, as the starting price keeps; cleared when that count is no longer a whole major unit of the new currency, as any Save limit (Q24). Agent default, taken as recommended; open to override | Clearing on any currency change, which drops bids that still fit; and keeping major units, which changes the stored count unlike the starting price |
| Q28 | What the admin may do with a Not placed internal bid, and what places it | Save it at any amount the Save rules allow, before or after publishing; while the listing takes bids, a save at or above the minimum next bid, the same amount included, places it at once. Agent default, taken as recommended; open to override | Raise only, after opening, which makes the admin add a unit to an amount that was never short |
| Q29 | May an operator with audit access only learn from the audit trail that a lot has an internal bid before the house bids? | Yes, a stated exception; never the amount or the time (Q6). Agent default, taken as recommended; open to override | Hiding internal-bid acts from audit readers without `auction:reserve`, which weakens the audit trail |
| Q30 | A lower both moves the current bid and falls below a bid already placed for the house: which refusal is named? | Below the house's bid, naming that bid, which tells the admin the lowest amount a lower can take. Agent default, taken as QA2 recommended; open to override | Naming the lead or price move, which tells the admin less; and naming both, which puts two reasons in one refusal |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-admin/auction/internal-bid | Does Bought in on the Listings table, shown to staff, let them learn a lot had an internal bid? What should staff see? | Q9 |
| grade10-site/auction/auto-bidding | Do operators reading every committed maximum see the house's, under what identity, and is a lower recorded with its own Accepted At? | Q9 |
| grade10-admin/auction/internal-bid | An internal bid or raise above the currency ceiling: refused at Save or not placed at its time? | Q11 |
| grade10-admin/auction/internal-bid | A raise that is still short of the minimum next bid, on a committed or a Not placed internal bid: refused or Not placed? | Q11 |
| grade10-admin/auction/internal-bid | May a commit time already past be set on a lot taking bids? | Q11 |
| grade10-admin/auction/internal-bid | An amount below the starting price or the current minimum next bid set before its time: refused at Save or judged at its time? | Q11 |
| grade10-admin/auction/internal-bid | Can a committed internal bid be removed, or only before its time? | Q11 |
| grade10-admin/auction/internal-bid | Can an internal bid be set on a Draft or Created listing, and what if its time comes before publishing? | Q10 |
| grade10-admin/auction/internal-bid | Which internal-bid acts reach the audit trail? | Q6 |
| grade10-admin/auction/internal-bid | Is the amount entered in whole major units or minor units? | Q17 |
| grade10-admin/auction/listing | Do the Unsold Relist exclusions apply to a bought-in lot? | Q19 |
| grade10-admin/auction/listing | Does the Stats bidder count include the house? | Q20 |
| grade10-site/auction/auction | Does a lot the house alone bid on extend and read sold at the opening price, including a commit exactly at the scheduled close? | Q21 |
| grade10-admin/auction/internal-bid | Under one per listing, is a second set refused or does it replace the first? | Q18 |
| grade10-admin/auction/internal-bid | The commit time arrives while the listing is still Created: committed on publishing, Not placed, or cleared? | Q23 |
| grade10-admin/auction/internal-bid | A starting-price or currency change on a Created listing leaves the internal bid outside its limits: refused, cleared, or judged at its time? | Q24 |
| grade10-site/auction/auto-bidding | In the committed-maximum trace, how does a staff operator see the house's rows? | Q25 |
| grade10-admin/auction/internal-bid | An amount typed with a fraction of a major unit: refused at Save or not typeable? | Q17 |
| grade10-admin/auction/internal-bid | A House bid row shows the time it was placed; the first equals the commit time. Is it shown to staff? | Q26 |
| grade10-admin/auction/internal-bid | On a Created listing whose internal bid went Not placed, can the admin raise, lower or remove it before publishing? | Q28 |
| grade10-admin/auction/internal-bid | After a currency change that keeps the internal bid, does it hold the same minor units or major units? | Q27 |
