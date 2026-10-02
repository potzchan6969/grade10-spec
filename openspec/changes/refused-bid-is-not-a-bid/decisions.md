## Goals

- Every requirement, journey and draft case states the bid grade10 runs: it stands on the card on file when accepted, and nothing is held on the card
- From the bidder's view, a refused attempt placed no bid: the bid form says why, and nothing else moves
- A losing or called-off bidder reads that their card was not charged
- Refusals are kept where operators read them, never in the bidder's record
- A hold that returns one day keeps the line at acceptance

## Non-Goals

- Changing what grade10 shows: grade10#773, #783, #785, #789 and #795 already show it. The one code change is the refusal log's fields
- Post-sale payment states and their card capture on the admin side: `complete-auction-post-sale` removes those requirements whole
- The paragraph in "A winner reads their own payment and shipment state" that points at the old hold requirement: `clarify-auction-shipping-progress-copy` folds that requirement while in flight and drops it there
- "An Unsold close releases the listing's inventory hold" and its demoted top bid: `release-stock-on-unsold-close` owns that requirement while in flight
- Renaming the `authorizationMessage` and `authorizationStatus` props on the store's bid blocks: they carry the bid form's refusal, and the block is the store's
- Three requirements other changes fold while in flight, each carrying this change's hold-free text in its own delta: the winner's payment requirement, renamed from "The bid-time hold is released, never captured" (`complete-auction-post-sale`), "Operator may call off a listing that has not closed" and "Collectors never see hidden lots" (`define-public-auction-identifiers`)
- A retried bid answering its first outcome by a key per attempt: its own change, since it builds a contract field, a column and a client retry, while this change records what runs
- A refusal count or alarm: the operational log is the record, and nothing reads a count today

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is a bidder's card checked or held when they bid? | No. Bidding is card-on-file: a bid stands when it is accepted, nothing is held or charged on the card, and only the winner pays, through hosted Checkout - decided by the owner, 2026-10-02 | An optional bid-time authorization hold, off by default, which kept a pending bid, an "Authorizing…" state and a hold to release on every path |
| Q2 | What does a losing or called-off bidder's row say about the card? | "Your card was not charged." on every Didn't win row, lost at the close or called off (option B) - decided by the owner, 2026-10-02 | Naming a hold being released or released, which no bid takes |
| Q3 | Does a bid ever read as unconfirmed on the lot page? | No. SC-39 is dropped: a bid is accepted or refused in one answer - decided by the owner, 2026-10-02 | "Authorizing…" while a payment confirms, and a bid confirmed after the close losing |
| Q4 | What happens to a lot when its leader's account is erased? | The leader's maxima are withdrawn, the highest maximum left takes the lead, and the price is the next maximum plus one increment, capped at the new leader's maximum, never above the price before the erasure; with nobody left the lot has no leader - decided by the owner, 2026-10-02 | Forfeiting the lead with the price kept, which left a lot with no leader at a price nobody had bid |
| Q5 | Do old hold-era rows and states stay readable? | No backwards compatibility: nothing is launched, so the hold switch, pending and failed-only states and the refusal reasons go - decided by the owner, 2026-10-02 | Keeping them for rows nobody outside staging wrote |
| Q6 | What is a refused attempt from the bidder's view? | Not a bid. The refusal shows on the bid form only; there is no My Auctions row, no `/bids` entry or history line, and no row moves. Bid submitted and Bid not accepted go. Replaces "refusals stay on the account chronology" - decided by the owner, 2026-10-02 | A refused attempt kept in the account chronology with its reason, a failed-only listing on `/bids`, and Bid not accepted on My Auctions |
| Q7 | Where are refusals kept? | Operator-side only: one structured operational log at the auction service's boundary, naming the bidder, the lot, the code, the amount and the floor. Never the bidder's record or history - decided by the owner, 2026-10-02 | An account-history event the bidder reads, or a store of refusals nobody reads |
| Q8 | What does a bid whose answer is lost on the way back show? | Placed, when a read of the bidder's standing holds the maximum they sent; otherwise the bid form says the bid could not be placed - decided by the owner, 2026-10-02 | Calling a bid that committed failed |
| Q9 | If bid-time card holds ever return, where is the line? | At acceptance. A bid exists only once every precondition, a card authorization included, has succeeded and been judged under the listing lock. The authorization is taken outside the lock, for the maximum, keyed to the attempt, and released if the attempt is refused. A later failure or expiry of a hold never revokes an accepted bid; it is the winner's settlement at the close. eBay, Catawiki, Heritage, real-time bidding and exchanges all draw the line at acceptance and keep refusals operator-side - decided by the owner, 2026-10-02 | Accepting a bid at once and revoking it when its hold fails, which moves the price down, swaps the leader, unwinds the automatic bids answering it, and undoes an extension or a close |
| Q10 | What does the bid form say for a maximum not raised, a suspended bidder and a banned one? | Each its own words: the new maximum must be higher, bidding is suspended with Contact Us, the account cannot bid (grade10-spec#829, grade10#795) - decided by the owner, 2026-10-02 | "Your bid did not go through.", which names no reason the bidder can act on |
| Q11 | Does the history paging fix need a requirement? | Yes, as one sentence: the combined history already states that one auction decision reads as one step and pages without omission, so a page ends on a whole decision (grade10#789) (recommended) | Leaving it as a fix with no rule, which a later paging change could undo unseen |
| Q12 | Where does the erasure rule live? | `grade10-site/auction/auction`, beside the other rules that set the leader and the price (recommended) | `shared/auth/users`, which states what erasure removes and nothing about a lot |
| Q13 | How does a requirement lose a hold scenario? | A requirement that keeps its subject is modified and keeps its ids; one whose subject was the hold is removed whole; a retired id is never reissued, and a retired journey leaves a line under `## Retired` (recommended) | Rewording a hold scenario into a different rule under its old id |
| Q14 | What does `/bids` read for a lot the collector lost at the close, beside Didn't win on My Auctions? | Outbid, as grade10 runs: `/bids` reads a losing completed listing as Outbid, and My Auctions reads Didn't win. A Lost standing on `/bids` would be its own change (recommended) | One word for a lost lot on both pages |
| Q15 | When the answer to a first bid is lost and the bid stood, is the lot bookmarked and does the alerts toast show? | Bookmarked, with no alerts toast, as grade10 runs: the auction wrote the watch, and the standing read carries no alerts flag. The follow-on change that replays a retried bid's first answer brings the toast back (recommended) | Showing the toast from the standing read |
| Q16 | Does the new leader of a lot re-stood after an erasure get a letter? | No, as grade10 runs: the re-stand writes no letter. A "you now lead" letter would be its own change (recommended) | Telling the runner-up they now lead |
| Q17 | Can an operator call off a lot past its effective close whose close is not yet recorded? | No, as grade10 runs: it refuses the call-off as not cancelable. The rule is stated by a change of its own (recommended) | Calling it off as any published lot, which the requirement's wording allows |
| Q18 | With bid-time holds gone, what is the panel state after card linking called, and does the linked-card tooltip scenario keep its title? | `linked-editable` replaces `authorization-editable`; `shared-ui-auction-listing-SC-30` keeps its title, since retitling needs a new id. Design confirms the state's name (recommended) | Retitling the scenario under a new id |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/bidding-history` | A lot lost at the close reads Outbid on `/bids` and Didn't win on My Auctions - is that one standing named two ways on purpose? | Q14 |
| `grade10-site/auction/auction` | After a lost answer on a first bid that stood, is the lot watched, and does the alerts toast show? | Q15 |
| `grade10-site/auction/auction` | When an erasure re-stands a lot, does its new leader get a letter, and does the close move? | Q16 |
| `grade10-admin/auction/listing` | Grade10 refuses to call off a lot past its effective close, but the requirement lets any published lot be called off - which holds? | Q17 |
| `grade10-site/auction/bid-panel-enrollment`, `shared/ui/auction-listing` | What is the panel state after card linking called now, and does the scenario titled for a hold tooltip keep its title? | Q18 |
