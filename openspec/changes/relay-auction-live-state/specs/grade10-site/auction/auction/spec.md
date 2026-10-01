## Purpose

Grade10's card-auction capability lets collectors browse an Auction listing and
place a card-backed bid within its scheduled window, closes each listing at its
effective close, and relays every committed change to the pages open on it. A
**listing** is the sole customer-facing term for one auctioned card.

## Feature set

- Catalogue
  - Auction listings only: collectors browse listings, never Buy Now, with money as minor units
  - Absolute close: the highest accepted bid wins; there is no reserve
  - Live cards: catalogue and Featured cards show each committed bid, extension and close without a reload
- Bidding window
  - Scheduled start and close: a bid must meet the increment between the scheduled start and the recorded close
  - Extended bidding after the close: a lot with a bid by its scheduled close stays open until bidding stops, lot by lot, up to an optional cap
  - A price move restarts the timer: only a bid that moves the public price extends; a leader raising their own maximum does not
  - Bounded late window: no bid counts after the scheduled close plus the shorter of the extension duration and the cap; a duration or a cap of 0 means no extension
- Card authorization
  - Optional authorization: disabled by default; a valid bid does not wait for or create a bid-time authorization hold
  - One hold per bidder: an outbid authorization is released; a delayed lower hold cannot land
  - A bid counts when its payment confirms: a confirm after the effective close loses with no grace and its hold is released; with holds off, a bid counts when placed
  - Lone first bid still confirming: at the scheduled close it leaves the lot unsold, and its hold is released
- Closing a due lot
  - Closed at the close: a lot is settled at its deadline by whichever reaches it first - the lot's own alarm, then a read that finds it overdue
  - Sweep as the net: the five-minute sweep still settles any lot nobody reached
  - Bids never settle: a bid or a payment confirm refuses a lot past its effective close and never closes it
- Live relay
  - After the commit: each committed bid, extension and close reaches every open lot page and catalogue card, read back from the database
  - Relays decide nothing: the relay holds no state the database does not, so losing it loses nothing
  - Polling fallback: a page that cannot hold a live line polls
  - Rollout flag: the live relay ships behind `auction.realtime`; the close rules ship without one
- Public contract
  - Listing and extension terms: a consumer reads the scheduled close, the recorded close, the extension duration, and the cap
  - Service time: a public read gives the auction service's clock
- Stripe failures
  - Explicit handling: incomplete configuration and a missed webhook are repaired without double-charging
- Identity bar on a bid
  - Held at the storefront: a bid at or above the bar is held before the auction hears of it
  - A verified bidder above the bar bids; another is sent to verify
