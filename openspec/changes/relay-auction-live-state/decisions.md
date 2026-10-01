# Decisions

## Goals

- Every open lot page and catalogue card on one lot counts down on the same
  clock and shows the same price, close and result soon after the commit that
  decides them, without a reload
- A lot closes at its effective close for everyone: no bid counts after it,
  and its result appears when the close commits rather than at the next sweep
- My Auctions bidding rows show the auction's current or final price, and a
  bidder's standing after the close reads Won or Did not win from the
  committed result

## Non-Goals

- New states or copy on any page: no Closing status, no Final deadline line,
  no new refusal or confirming wording
- A fourth public lot status
- A grace period for a payment still confirming at the close
- Private maxima, identity, storefront or card facts on the live wire
- Replacing Postgres as the authority: rooms decide nothing and store nothing
  but an alarm
- Removing the five-minute sweep, which stays the net under a missed alarm
- Web push to closed tabs, and edge-caching the snapshot reads
- Pushing inventory product panels through the live room

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When does a bid count? | When its payment confirms, judged at that moment under the listing lock. A confirm that lands after the effective close loses, with no grace, and its hold is released. A lone first bid still confirming at the scheduled close leaves the lot unsold, and its hold is released | A grace for a confirm already in flight - the payment event would not arrive before the close anyway, and the moment payment succeeded is the decision; counting from when the bid was pressed - a bid that never confirms would hold the lot open |
| Q2 | When bid-time holds are off, when does a bid count? | When it is placed, since no payment waits to confirm - decided by the round | Reading Q1 as needing a payment on every bid - holds are off by default, and the rule would refuse every bid on those lots |
| Q3 | What does a page show between the effective close and the committed close? | The existing Closed state with no result yet; Won or Unsold appears when the close commits, normally within about a second and at worst at the next sweep. The public status stays three values: Upcoming, Active, Ended | A fourth status, Closing, with its own copy, and the draft requirement "the public status SHALL be Closing" - a new state and new copy in four locales for a gap normally under a second; Ended from the page's own clock - shows Unsold to the winner before the close commits |
| Q4 | Which words cover the moments in between? | Existing copy only: Authorizing… while a payment confirms; Your bid did not go through for a bid not confirmed in time or one that arrived after the close; Extended bidding for an extension; no Final deadline line | New words for confirming, not confirmed before the close, and Final deadline, no further extensions - each covers a moment the existing words already name |
| Q5 | Which bids extend the close? | Only a bid that moves the public price. Equal maxima at a higher price move it: price 1,000, A's maximum 2,000, B sets 2,000, the price becomes 2,000, A keeps the lead as the earlier, and the lot extends. A leader raising their own maximum does not extend | Every accepted bid, and the draft "a second equal maximum always restarts the timer" - a leader could keep their own lot open by raising, and the rule would hang on whether a maximum is equal rather than on whether the price moved |
| Q6 | Where does the late-bid window end? | At the scheduled close plus the extension reach, the shorter of the extension duration and the cap. A duration of 0 or a cap of 0 means no extension | No upper bound, as today - while the sweep lags, a bid after the effective close is accepted and can extend the lot again; a cap of 0 read as no cap - an operator who sets 0 means no extension |
| Q7 | What clock do countdowns run on? | The auction service's clock, probed from its time route and probed again after sleep, a reconnect or a return to the tab. A countdown rounds up, so the last second never reads 0 | Each device's own clock - devices disagree by seconds; rounding down - the last second reads 0 while the lot still takes bids |
| Q8 | How do pages learn that a lot changed? | One room per lot and one for the catalogue. After Postgres commits, the room reads the committed lot back and sends it whole to every open page; rooms decide nothing. A page that cannot open a socket polls | Polling only - one database read per viewer per poll; the writer sending the state - a writer could publish a wrong or out-of-order state; server-sent events - a room holding an open stream could never hibernate |
| Q9 | Who settles a lot that is due? | The lot room's alarm first, then any read that finds the lot overdue, settling after it answers, then the five-minute sweep as the net. A bid or a payment confirm never settles inside its own transaction | The sweep alone - a lot closes up to five minutes late; settling inside the bid's transaction - a close that fails would fail the bid or the payment webhook |
| Q10 | What does a My Auctions bidding row show? | The auction's current or final price, as Bidding History already states, and a standing after the close of Won or Did not win from the committed result | The viewer's own latest bid - a losing bidder misreads the final price; standing from the page's own clock - a lead that was true a second before the close is not a win |
| Q11 | How does it roll out? | Rooms and sockets ship behind the `auction.realtime` flag; the close rules in Q1, Q2, Q5, Q6 and Q9 ship without a flag | Flagging the close rules too - the late-bid acceptance stays live behind a flag; rooms without a flag - rolling back a socket problem needs a deploy |
| Q12 | When another bidder outbids me while my lot page is open, does my own standing turn to Outbid without a reload? | Open - recommended: yes. A frame that raises the lot's version makes the page re-read the viewer's own standing, so Outbid and the next valid bid show without a reload; the frame itself stays public. On a yes, `grade10-site/auction/listing-page` gains a scenario under its live requirement | The price moving live while my standing waits for a reload - a bidder reads Leading under a price they no longer lead |
| Q13 | The one existing string is "Your bid did not go through. The card was not authorized." Its second sentence is untrue for a confirm after the close or a bid past it. Which words show? | Open - recommended: the first sentence alone, under its own key holding each locale's existing first sentence, so no new wording is written | The whole string - it blames a card that was authorized; "Auction closed" - it does not say the collector's bid failed |
| Q14 | The Feature-set leaf "Bounded late window" reads as the end of all extended bidding, but the worked example's lot C takes a bid at 20:35 and closes at 21:05. Is the leaf reworded? | Open - recommended: reword it to "until extended bidding is recorded, no bid counts after the scheduled close plus the shorter of the extension duration and the cap". The requirement already says this, but the leaf is a frozen anchor, so rewording it restarts QA1 and Dev | Leaving the leaf as written - every later blind pass reads it as a hard end at 20:30 and asks again |
| Q15 | This change and `allow-zero-starting-price` both modify "Bids are valid only within the scheduled, extendable window", and whichever archives second overwrites the first. Which goes first? | Open - recommended: `allow-zero-starting-price` is accepted and archived first, and this change rebases its modified block onto that text, keeping the opening-price sentence, before it is accepted | This change first - `allow-zero-starting-price` would then have to rebase onto the bounded window, and its code is already merged in grade10 |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/listing-page` | Does my own standing turn to Outbid live, or only the price? | Q12 |
| `grade10-site/auction/listing-page` | The existing "Your bid did not go through" string also says the card was not authorized | Q13 |
| `grade10-site/auction/auction` | Where does the late window end with no cap, or a cap at or above the duration, beside lot C closing at 21:05? | Q14 |
| `grade10-site/auction/auction` | The window requirement is modified by `allow-zero-starting-price` too | Q15 |
