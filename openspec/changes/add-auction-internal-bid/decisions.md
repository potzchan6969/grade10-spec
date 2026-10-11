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
| Q1 | What do collectors see of the house bid? | Undisclosed: it bids under a listing pseudonym like any collector, and nothing says the house may bid (held) | Disclosing that the lot carries a house bid, the interview's recommendation: it removes the shill-bidding risk and keeps the protection. The author held undisclosed, because disclosure tells a collector when to stop. Legal sign-off is open in the proposal |
| Q2 | When the house leads at the close, how does the lot end? | Collectors see it sold, under the house's pseudonym (held) | Closing Unsold, the interview's recommendation: it reuses the existing close, but the author ruled it out because it tells collectors a house bid existed |
| Q3 | What does "lowering does not leave the lead stranded" mean once the internal bid is placed? | A lower amount is accepted only when the leader and the current bid stay the same, and never below a bid already placed for the house (recommended) | Lowering only while the house leads, which refuses harmless lowers once the house is outbid; and lowering freely until the house's first bid, which drops the flexibility asked for |
| Q4 | When can the time be set, and what changes before it? | Required, between the start and the scheduled close. Until it arrives the amount and the time can change or be removed; after it the time is fixed (recommended) | A time in extended bidding, which may never arrive because the close can pass first; and an optional time that defaults to the start, which the author ruled out |
| Q5 | What happens behind the public "sold" when the house wins? | Bought in for operators only: no order, no winner letters, stock released as at an Unsold close, Relist offered, Bought in on the Listings table (recommended) | Plain Unsold internally, which mixes bought-in lots into unsold counts; and keeping the stock held until an operator acts, which adds a manual step |
| Q6 | Who can set and see an internal bid? | `auction:reserve`, held by admin; the audit trail records each act without the amount or the time (recommended). What other operators see is Q9 | `auction:operate`, which shows every staff operator which lots are protected |
| Q7 | The internal bid is already short of the next bid at its time | Not placed and invisible to collectors; the admin sees "not placed" and can still raise it until the close, which places it at once (recommended) | Not placed and locked, which leaves the admin unable to respond to a lot running hot |
| Q8 | Can the house raise during extended bidding? | Yes, any time the lot takes a bid; a raise that moves the price restarts the timer as a collector's would (recommended) | Freezing it at the scheduled close, which leaves the house unable to respond late |
| Q13 | One internal bid per listing? | One, bidding as one internal bidder profile (Q36). Agent default, not asked; open to override | Several house maximums, which compete with each other and add nothing |
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
| Q28 | What the admin may do with a Not placed internal bid, and what places it | Before the listing takes bids (still Created), any save under the Save rules is accepted and it stays Not placed. Once the lot takes bids, a save at or above the minimum next bid, its own amount included, places it at once; a lower is accepted and it stays Not placed; a raise still below the minimum next bid is refused, naming it (Q11). Agent default, taken as recommended; open to override | Raise only, after opening, which makes the admin add a unit to an amount that was never short. Revised after accept review: 'any amount' read as accepting a short raise, which Q11 refuses |
| Q29 | May an operator with audit access only learn from the audit trail that a lot has an internal bid before the house bids? | Yes, a stated exception; never the amount or the time (Q6). Agent default, taken as recommended; open to override | Hiding internal-bid acts from audit readers without `auction:reserve`, which weakens the audit trail |
| Q30 | A lower both moves the current bid and falls below a bid already placed for the house: which refusal is named? | Below the house's bid, naming that bid, which tells the admin the lowest amount a lower can take. Agent default, taken as QA2 recommended; open to override | Naming the lead or price move, which tells the admin less; and naming both, which puts two reasons in one refusal |
| Q31 | Legal has not confirmed an undisclosed house bid; accept the plan now or wait? | Accept now: undisclosed stands, held by @htonyl, and Legal confirms the auction terms wording before release. A disclosure ruling is a follow-up change before release | Waiting for Legal before accepting, which holds the build; and switching to disclosed, which reopens Q1, Q2 and Q25 |
| Q32 | Does a bought-in listing's own admin page read Bought in, or only its Listings table row? | Both, once the lot closes, for every operator, following Q5 and Q9. Taken as recommended when the author asked to carry on; open to override | Table only, which leaves an operator who opens the lot unable to tell why it has no order |
| Q33 | The house is the public winner (Q2); is it a winner for orders, order letters and post-sale work? | Never: a lot the house leads at the close opens no order and enters no post-sale queue, following Q5. Raised by the accept review as one fact stated two ways | Leaving winner-order's close rule unqualified, which tells an engineer to create an order for the house |
| Q34 | Once the lot takes bids, is a re-save of a Not placed bid at its own amount, still below the minimum next bid, accepted? | Refused, naming the minimum next bid; only a lower is accepted below it (Q28). Agent default, open to override | Accepting it unchanged, which records a save that does nothing |
| Q35 | A lower of a Not placed bid that still reaches the minimum next bid: placed, or left Not placed? | Placed at once: a save at or above the minimum next bid places it, a lower included (Q28). Agent default, open to override | Leaving every lower Not placed, which keeps the house out of a lot its amount still protects |
| Q36 | Who does an internal bid bid as? | One of several internal bidder profiles, created by an admin with `auction:reserve` in auction admin: a name and a unique email label, with no site account behind it. Each listing's internal bid names one; one profile may serve many listings; one listing never has two | One shared house bidder for every listing; and marking existing site accounts as internal, which puts a signed-in account behind each |
| Q37 | How is the profile chosen for a listing? | A required pick at Save, from active profiles; it can change only before the internal bid's time (recommended) | A default profile with an override |
| Q38 | Can an internal bidder bid through the site's bid panel? | No: a profile has no site account, so its only bids are internal bids (recommended) | Letting it bid by hand, outside the internal bid rules |
| Q39 | What do operators read of the profile? | A reserve holder reads which profile bid on each listing; other operators read House as in Q25; collectors read the listing pseudonym as in Q1. Agent default, open to override | Showing every operator the profile, which shows staff which lots are protected |
| Q40 | Renaming and retiring a profile | A name can change any time; the email label is fixed once the profile has bid; a profile is retired only when no Scheduled or Not placed internal bid uses it, keeps its history and is no longer offered. Agent default, open to override | Deleting a profile, which loses the bids it made |
| Q41 | May a Placed internal bid keep raising and lowering after its internal bidder is retired? | Yes: a Placed or Not placed internal bid keeps its bidder, retired or not. Agent default, open to override | Refusing its raises and lowers, which leaves a running lot without its protection |
| Q42 | Email label rules | An email address, unique across every profile including retired ones, compared ignoring letter case; it may equal a collector's email and is never mailed. Agent default, open to override | Unique among active profiles only, which makes past bids ambiguous |
| Q43 | Can a retired profile be made active again? | No; a new profile is added instead. Agent default, open to override | An un-retire act with its own refusals |
| Q44 | Does a Listings search by email ever match a profile's label? | Never, for any operator. Agent default, open to override | Matching it for reserve holders |
| Q45 | Which name do past bids show after a rename? | The current name, history included; names need not be unique. Agent default, open to override | The name at the time of each bid |
| Q46 | Can operators without `auction:reserve` read the profiles? | No; they see no Internal bidders page and no profile in any read. Agent default, open to override | A read-only list for staff |
| Q47 | What the audit trail records for profiles | Profile acts (add, rename, retire) with the operator and the time; no audit row links a profile to a listing. Agent default, open to override | Naming the profile on internal-bid audit rows |

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
| grade10-admin/auction/internal-bid | Once the lot takes bids, is re-saving a Not placed bid's own amount, still below the minimum next bid, accepted or refused? | Q34 |
| grade10-admin/auction/internal-bid | A lower of a Not placed bid that still reaches the minimum next bid: placed, or a lower that stays Not placed? | Q35 |
| grade10-admin/auction/internal-bid | After Q30, can the lead-or-price refusal ever show on its own? | Q30 |
| grade10-admin/auction/internal-bid | After a rename, does a past house bid read the new name or the name at the time? | Q45 |
| grade10-admin/auction/internal-bid | Is label uniqueness case-insensitive, and must a label be an email address? | Q42 |
| grade10-admin/auction/internal-bid | Does a retired profile's label stay taken? | Q42 |
| grade10-admin/auction/internal-bid | Can a retired profile be made active again? | Q43 |
| grade10-admin/auction/internal-bid | Can a Placed internal bid whose profile was retired still be raised or lowered? | Q41 |
| grade10-admin/auction/internal-bid | Can operators without auction:reserve read the profiles list? | Q46 |
| grade10-admin/auction/internal-bid | Do audit entries name the profile, and are profile acts audited? | Q47 |
| grade10-admin/auction/internal-bid | Does the listing-edit cleared notice name the cleared profile? | Q39 |
| grade10-site/auction/auto-bidding | Does the reserve holder's committed-maximum trace name the profile? | Q39 |
| grade10-admin/auction/internal-bid | Can a collector register a site account whose email is a profile's label? | Q42 |
