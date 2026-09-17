---
title: Bidding
spec: grade10-site/auction/auction
order: 3
---

How a lot is won: the rules every bid is held to, the panel a collector bids
from, and the record and letters that follow their lots.

## Auction Logic

Every Grade10 listing is absolute — no reserve and no buy-now price — and the
highest accepted bid at the close wins it.

| Rule | Value |
| --- | --- |
| Bidding window | From the scheduled start to the recorded close |
| Extension duration | **30 minutes** by default, set per listing; **0** turns extended bidding off |
| Extension cap | Optional, per listing; the close never moves past the scheduled close plus the cap |
| Currencies | **USD**, **HKD** or **JPY**, one per lot, each with its own increment schedule |
| Ceiling | **USD 10,000,000**, **HKD 80,000,000**, **JPY 150,000,000,000**, the same on every lot |
| Verified bidder | 🚧 A bid of **HKD 120,000** or more — [Account · Verified Identity](/p/grade10-site/auction/account#verified-identity) |
| Bid-time hold | **Off** by default; when on, one card authorization per bidder per listing covers the maximum |
| Listing terms | The fee, currency, region and deadline terms are fixed when bidding opens |

### Extended Bidding

Until the scheduled close, no bid moves the recorded close. At it, a listing
with at least one accepted bid enters extended bidding: every accepted bid,
from anyone, sets the close to the full extension duration after that bid,
and the listing closes when the timer runs out with no new bid.

| Listing, scheduled close 20:00 | Bids by 20:00 | Bids after | Closes |
| --- | --- | --- | --- |
| A | None | — | 20:00 |
| B | One | None | 20:30 |
| C | Three | 20:10, then 20:35 | 21:05 |
| D, extension duration 0 | One | — | 20:00 |
| E, cap 30 minutes | One | 20:10 | 20:30 |

- **A bid at the scheduled close** — counts as accepted by it, so the listing
  extends; a bid that would move the close past the cap is accepted without
  moving it
- **Each listing on its own** — every listing runs its own timer, whatever
  campaign it belongs to
- **Accepted once** — a bid advances the highest bid atomically, so a delayed
  lower bid never displaces a higher one however the network reorders them

### Auto-Bidding

A collector names the most they will pay, and Grade10 bids for them only as
far as needed to lead. The price is the least that beats the field — the
second-highest maximum plus one increment, never more than the leader's
maximum — settled once per accepted maximum and never on a timer.

A lot starts at 20,000 with a 2,500 increment:

| Step | Who | Maximum | Price | Leader |
| --- | --- | ---: | ---: | --- |
| 1 | You commit | 50,000 | 20,000 | You |
| 2 | They commit | 80,000 | 52,500 | Them |
| 3 | Nobody | — | 52,500 | Them; Grade10 places no bid on a timer |
| 4 | You raise | 90,000 | 82,500 | You |

Where A leads with a maximum of 1,000, the current bid is 400 and the
increment is 100:

| B's maximum | Price | Leader | Public records |
| ---: | ---: | --- | --- |
| 450 | 400 | A | None; refused below the next minimum |
| 950 | 1,000 | A | B at 950, then A at 1,000 |
| 1,000 | 1,000 | A | B at 1,000, then A at 1,000 — the earlier maximum leads |
| 1,001 | 1,001 | B | B at 1,001 |

- **Private** — a leading maximum is never public; another bidder learns it
  only by beating it
- **Raise only** — a maximum goes up at any time and never down, because
  lowering would withdraw a commitment others have bid against
- **Own standing** — a bidder reads their maximum, the current bid and whether
  they lead; never another bidder's maximum, identity or card
- **A bid Grade10 places is a bid** — it counts in the bid count and the
  history, restarts the extended-bidding timer as a manual bid would, and
  needs no fresh card check; two standing maxima never keep extending the
  close on their own
- **A raise the card cannot cover** — nothing moves: the maximum, the leader
  and the price stay as they were

### Bid Increments

The increment is selected by the amount being beaten. A tier includes its
lower bound, the schedules are Grade10's, and no listing overrides them.

| From | USD | From | HKD | From | JPY |
| ---: | ---: | ---: | ---: | ---: | ---: |
| $0 | +$1 | HK$0 | +HK$10 | ¥0 | +¥100 |
| $100 | +$5 | HK$800 | +HK$40 | ¥15,000 | +¥500 |
| $500 | +$10 | HK$4,000 | +HK$80 | ¥75,000 | +¥1,000 |
| $1,000 | +$25 | HK$8,000 | +HK$200 | ¥150,000 | +¥4,000 |
| $5,000 | +$50 | HK$40,000 | +HK$400 | ¥750,000 | +¥8,000 |
| $10,000 | +$100 | HK$80,000 | +HK$800 | ¥1,500,000 | +¥15,000 |

| Lot | Amount being beaten | Next minimum | Outcome |
| --- | ---: | ---: | --- |
| HKD lot opening at HK$200 | HK$200 | HK$210 | The first bid must reach HK$210 |
| USD lot on a tier boundary | $100 | $105 | The $100 tier applies, not the $0 tier |
| A bidder offers more | $100 | $105 | $120 is accepted as $120; nothing rounds it to a multiple |
| USD lot at the ceiling | $10,000,000 | — | Every further bid is refused |

- **What a collector sees** — the next minimum for the lot, never the
  schedule
- **A first maximum** — must reach the starting price plus one increment; the
  public price it creates is the starting price itself

### Refusals

| Refused when | What the bidder sees |
| --- | --- |
| Below the next minimum | Refused, naming the minimum |
| Before the start, or after the recorded close | Refused |
| Above the currency's ceiling | Refused, naming the ceiling; the price, the leader and every maximum stay as they were |
| 🚧 At or above the bar without a verified identity | Held at the storefront, with where to verify; nothing is recorded |
| No linked card, or a declined hold when holds are on | Refused before the bid stands — [Auction Panel](/p/grade10-site/auction/bidding#auction-panel) |

## Auction Panel

The panel on the lot page is where a collector enrols — sign-in, then a
linked card — and names a maximum; the blocks themselves are [Listing Page
Blocks](/p/shared/ui/auction-listing).

| Rule | Value |
| --- | --- |
| Buyer fee on the panel | 🚧 **20%** of the winning bid, the rate only, always on; the amount first appears on the invoice |
| Quick bids | 🚧 Three chips at **1×**, **2×** and **4×** the listing increment, from the current bid, or from their own maximum when they lead |
| Custom maximum | 🚧 Whole major units only, up to **9,999,999,999**; a typed decimal mark is refused |
| A leader's typed raise | 🚧 Starts at their maximum plus **100 minor units** |
| Hold window | 🚧 At least **14 days** after the scheduled close, where the provider offers it |

:::flow{title="From sign-in to a standing bid"}
## *Collector* — **Opens a live lot**
Signed out, the bid action offers sign-in; the recent public bids stay
visible.
## *Collector* — **Links a card, once**
In a provider-hosted field, with an age attestation once per account. Card
details never pass through Grade10, no hold is taken, and the card carries to
every later lot.
## *Collector* — **Names a maximum**
A quick bid or a typed amount, at or above the next minimum. The panel says
Grade10 bids only as needed up to it, and that it can be raised, never
lowered.
## *Grade10* — **Authorizes the card, when holds are on**
One authorization for the whole maximum, in the background; the bid stands
only once it is confirmed, and a refusal shows on the bid action with the
prior maximum still in place.
## *Grade10* — **Bids for them**
As far as needed to lead, and tells them once when they lose the lead —
[Notifications](/p/grade10-site/auction/bidding#my-auctions-watchlist-and-notifications).
## *Collector* — **Raises**
On the same card, locked by the first accepted bid; a raise updates the one
authorization rather than adding a second.
:::

### Display

| State | What the collector sees |
| --- | --- |
| **Signed out** | The bid action offers sign-in; no standing, no fee line |
| **No linked card** | Amount controls visible but disabled; the bid action and the empty card slot open setup |
| **Card on file** | Amount controls enabled, with Change until the first accepted bid on this lot |
| **Authorization running** | Setup and the bid action wait |
| **Authorization failed** | **Your card could not be authorized. Try another card.** on the bid action, and the controls stay usable |
| **Leading** | Their maximum, the current bid and Leading |
| **Outbid** | Outbid, and the next valid bid |
| **Lost** | Did not win, with no hold-release copy; that reads on My Auctions |

- 🚧 **Time left (extended)** — while the lot is in extended bidding the label
  says so, and its tooltip names the extension duration only
- **Your bidding** — a signed-in bidder opens their own record for the lot
  beside the public recent bids — [Bidding
  History](/p/grade10-site/auction/bidding#auction-panel)

::story{id="auction-listing-bid-panel--signed-out" title="Signed out"}

::story{id="auction-listing-listingauctionbidcard--outbid" title="The bid panel after being outbid"}

::changes{spec="shared/ui/auction-listing"}

### Enrolment Flow

- **Link before amount** — with no linked card the chips and the custom field
  stay visible and disabled; only the bid action and the empty card slot open
  setup
- **Setup is link only** — Continue enables with a card entered and the
  attestation checked, reads Linking while the provider works, and closing
  before it is done leaves no card on file; no hold is taken in setup
- **The card carries across lots** — a card linked on an earlier lot needs no
  setup; Change stays until the first accepted bid on this lot, and later
  raises keep that card
- **Enrolled** — an accepted first bid completes enrolment, bookmarks the lot
  on My Auctions and turns its email alerts on
- 🚧 **A raise keeps its reference** — a supported raise updates the existing
  authorization; a refused raise settles at once with the card message, and
  the prior maximum stands

::story{id="auction-listing-bid-panel-dialogs--setup-modal" title="Setup modal"}

::changes{spec="grade10-site/auction/bid-payment-method"}

### Bidding History

The account keeps one retained record of everything bidding did, at the
account's bids address; signed out, sign-in runs first.

- **One row per listing** — every listing the account submitted a maximum on,
  by latest activity, with its current or final price and the collector's
  standing: pending, leading, outbid, won, lost, canceled, or failed-only when
  every attempt was refused
- **Active and Completed** — two filters; it opens on Active, and a row
  expands its story in place
- **One listing's story** — every maximum set, raised, accepted or refused
  with its reason, interleaved with the public movements that changed the
  collector's standing; they read as You and every rival by the lot's
  pseudonym, and no rival's maximum ever appears
- **Your bidding, on the lot** — two tabs, Bid placed, the bids Grade10 placed
  for them, then Your maximums; amount and time only, owner only, and
  refusals stay on the account record
- **Never edited** — nothing deletes or hides an entry, because the record is
  the audit

| Refusal reason | Meaning |
| --- | --- |
| Window | The listing was outside its bidding window |
| Minimum | The maximum did not meet the next minimum |
| Account | The account may not bid |
| Payment | The card authorization did not succeed |
| Stale price | A competing price arrived first |
| Unavailable | Bidding could not be evaluated at that moment |

## My Auctions, Watchlist and Notifications

One record of every lot a collector bookmarks, by watching or by bidding, and
the letters that follow those lots.

| Rule | Value |
| --- | --- |
| Watch limit | ❓ A maximum number of watches per collector, bids counted; Design sets the value |
| Opening warning | **24 hours** before the scheduled start |
| 🚧 Closing warning | **24 hours** before the scheduled close, which extended bidding never moves; the one-hour reminder is retired |
| Copies | One per lot per collector per letter; a temporary failure retries, and an operator re-queues a given-up letter |

### My Auctions

🚧 One table holds every bookmarked lot once — bid rows before watch-only,
soonest close first in each band, closed lots after open ones — under Active,
Upcoming and Ended tabs, with the row count in the title.

| Column | What it shows |
| --- | --- |
| Lot | The key image, the title and the close |
| Current bid | The lot's current bid |
| Your Standing | Leading · Outbid, with the next valid bid · Bid submitted · Bid not accepted, and why · Won, reading the order's status · Didn't win, with whether the card hold is being released or released · `--` for a watch-only lot |
| Email alerts | The per-lot switch; off and locked when the account's **Auction email alerts** master is off, or the lot has ended |
| Unwatch | Only when the collector has not bid |

- **Won** — every Won row offers View order into the lot's order, Cancelled
  and Refunded included — [Post-Bidding · Winner
  Order](/p/grade10-site/auction/post-bidding#winner-order)
- 🚧 **Payment Verifying** — a won lot whose payment proof is waiting for an
  operator reads so on its row
- 🚧 **Partially Paid** — a won lot with at least one operator-recorded
  payment and a balance still owed reads Partially Paid on its row
- 🚧 **A bid bookmarks the lot** — with no separate Watch, and counts toward
  the watch limit
- **At the limit** — a further watch is refused and says the limit is reached
- **Removed with the listing** — unpublishing or removing a listing takes it
  off My Auctions
- **Honest reads** — nothing bookmarked offers the catalogue; a failed read
  says so and can be retried; a close or a bid that could not be refreshed is
  shown as not current

::changes{spec="grade10-site/auction/account-record"}

### Watchlist

A watch is one action on a lot that says come back to this, and it costs
nothing: no money is held, and the sale never changes because somebody
watches.

| Word | Meaning |
| --- | --- |
| **Watch**, **Watching** | The lot is on the collector's list |
| **Email alerts** | The per-lot mail preference, apart from the watch; muting leaves the watch and any bid intact |
| **Unwatch** | Leaves the list and turns email alerts off; Undo restores it at once |

- **Signed in** — a signed-out viewer is offered sign-in, never a watch the
  browser would forget; a watch follows the collector across devices, and
  both brands' collectors may watch one lot, each seeing only their own
- **From where the lot is shown** — the lot page, the catalogue card and the
  watched list; a bid keeps the lot watched until it closes
- **After the close** — the entry stays until its owner unwatches it
- 🚧 **Called off** — a called-off lot leaves the watched list —
  [Lot Status](/p/grade10-site/auction/display#auction-details)
- **Private** — no public fact carries a watch count or a watcher's identity;
  operators see how many collectors watch a lot, across both brands and never
  a name

::changes{spec="grade10-site/auction/watchlist"}

### Notifications

Grade10 mails an enrolled collector when a lot needs them. Enrolment is
watching or bidding **and** email alerts on for that lot; every letter goes to
the account's registered address, and the letters about a won lot are
[Post-Bidding](/p/grade10-site/auction/post-bidding#winner-order)'s.

| Letter | When | Who |
| --- | --- | --- |
| Bidding opens in 24 hours | 24 hours before the scheduled start | Watchers |
| Bidding has opened | When bidding starts | Watchers |
| Bidding closes in 24 hours | 24 hours before the scheduled close | Watchers and bidders, a bidder who unwatched included |
| Extended bidding has started | The lot enters extended bidding | Watchers and bidders |
| New bid on a lot you bid on | A bid is accepted | Every other bidder, once per leading bid they have not been told of |
| You have been outbid | The leader stops leading | The displaced leader; a raise their own maximum absorbed is not outbid |
| You did not win | The lot stops taking bids | Bidders who lost, with Winning bid and Their bid |
| The lot has ended | The lot stops taking bids | Watch-only collectors, with Sold for when a bid won; on a no-bids close, Ended only |

- **One letter** — nobody hears about their own bid, an outbid collector gets
  the outbid letter and not also a new-bid one, a watcher who bid gets the
  non-winner letter, and the winner gets only the auction-won order letter
- **Account master** — Account → Notifications carries an **Auction email
  alerts** switch; off stops all per-lot auction mail without clearing lists
  or bids
- 🚧 **No one-hour reminder** — the one-hour closing reminder to watchers
  stops; the last warnings before a close are Bidding closes in 24 hours,
  then Extended bidding has started if the lot extends
- **Footer** — every letter says email alerts are on for this lot, and
  **Manage alerts** opens My Auctions to mute that lot; never an
  unauthenticated one-click stop, never unwatch
- **Never a false statement** — a called-off lot sends nothing further, and a
  letter that would state something no longer true is not sent late
- **Send log** — operators answer "I was never told" from message type,
  recipient, lot and when it was sent, never the body
- ❓ **Hold line on the non-winner letter** — whether the body also says the
  card hold is being released; Product confirms
- ❓ **Log retention** — how long send-log rows are kept; Engineering confirms

:::detail{title="Code map" for="engineer"}
- **Service** — [Auction Service](/platform/auction-service): the bid, maximum and close invariants, and the sweeps
- **Blocks** — `ListingAuctionBidCard`, `ListingUserBidHistory`, `EnrollmentSetupSheet`, `PaymentMethodRow` and `WatchButton`, in `packages/ui` — [Listing Page Blocks](/p/shared/ui/auction-listing) and [Auction Record Blocks](/p/shared/ui/auction-record)
- **Signal** — `bidEnrollment`: `signed-out`, `needs-card` or `ready`
- **Extension settings** — `packages/ui/src/blocks/auction-listing/listing-extension-policy.ts`
- **Mail** — `apps/emails/emails/auction/`
:::

:::detail{title="Test cases" for="qa"}
::cases{id="grade10-site/auction/auction"}

::cases{id="grade10-site/auction/auto-bidding"}

::cases{id="grade10-site/auction/bid-increments"}

::cases{id="grade10-site/auction/bid-panel-enrollment"}

::cases{id="grade10-site/auction/bid-payment-method"}

::cases{id="grade10-site/auction/bidding-history"}

::cases{id="grade10-site/auction/account-record"}

::cases{id="grade10-site/auction/notifications"}
:::

:::detail{title="Product decisions" for="pm"}
Bidders arrive in the last minutes, so a close that cannot move rewards
whoever is last; extended bidding starts at the announced close and runs until
bidding stops, lot by lot. A hidden maximum resolved at second-highest plus
one increment is how eBay and Goldin bid for an absent collector. A watch is
the cheap, private mark between browsing and bidding, and the letters are the
moments that change what a collector should do next, never a snipe war in an
inbox.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Bidder | Wants the lot, cannot sit on the page | Sets a maximum once and still competes; raises it, never lowers it. |
| Bidder | Bidding across several lots that close the same evening | Sees which they lead, which they lost, and which closes next, and reaches the one that needs a bid in one step. |
| Collector | Found a lot, not ready to bid | Marks it, leaves, and hears in time to come back. |
| Losing bidder | Bid and did not win | Confirms the outcome and that the card hold is released, so a pending authorization is not read as a charge. |
| Auction operator | A dispute about who led, or a collector who says they were never told | Reads each maximum with when it was accepted, and which letters went to that address. |

**Not in scope.** Reserve prices. Lowering or withdrawing a maximum, or
retracting a bid — a placed bid is binding. Nudging a bidder to raise. A
general account payment manager, or changing the card after the first bid on a
lot. Push, SMS or in-app alerts; a digest across listings; one-click
unsubscribe. Search, saved searches and recommendations. Watching store
products — the wishlist heart stays removed. ZZZ gains no account auction
surface.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Auto-bid share | Share of accepted bids placed by the platform on a bidder's behalf. | Product |
| Absent winners | Share of lots whose winner was not on the page when the lot closed. | Product |
| Link-to-bid-ready | Share of signed-in collectors who link a card and reach an enabled panel without abandoning. | Product |
| Outbid recovery | Outbid collectors who bid again within the lot's remaining window, segmented by whether My Auctions was opened between. | Product |
| Watch-to-bid | Share of watched lots their watcher later bids on. | Product |
| Bid-activity noise | New-bid letters per bidder per listing per hour during an extension; near one per sweep, not one per bid. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Absolute sale | Decided | No reserve and no buy-now price; the highest accepted bid at the close wins. | Product |
| Extended bidding | Decided | Starts at the scheduled close for a listing with a bid, runs 30 minutes by default, restarts on every accepted bid, and ends at the listing's optional cap. A listing with no bid, or with the duration set to 0, closes on schedule. | Product |
| Resolve | Decided | Second-highest maximum plus the listing increment, capped at the leader's maximum; equal maxima, the earlier leads; one resulting price, never intermediate bids. | Product |
| Hidden cap, raise only | Decided | A leading maximum is not public and can go up but never down. | Product |
| Increments | Decided | Grade10 owns one fixed schedule per currency, selected from the amount being beaten; a threshold includes its lower bound; a bid may exceed the minimum and need not be a multiple; no listing-level override; collectors see the next minimum, not the schedule. | Product |
| Bid ceiling | Decided | One ceiling per currency for every lot, refused above it: USD 10,000,000, HKD 80,000,000, JPY 150,000,000,000. | Product |
| Bid-time hold | Decided | Off by default; when on, one manual-capture authorization per bidder per listing covers the maximum, taken when the maximum is committed and never in setup, and a raise updates it. | Product and finance |
| Hold window | 🚧 In flight | At least 14 days past the scheduled close, where the provider offers it; a raise increments the same authorization. | Product and finance |
| Verified bidder | 🚧 In flight | A bid of HKD 120,000 or more needs a verified identity, checked by the storefront before the auction hears of the bid. | Product |
| Setup is link only | Decided | Title Link a card to bid; body Link a card for bidding. When you set a maximum, we authorize a hold for that amount. You are only charged if you win.; continue Link Card. The card carries to a new lot, and Change stays until the first bid on that lot. | Product |
| Mechanism disclosure | Decided | Always-on subtext under Set your private maximum: bid as needed, raise only; with holds on, that the hold matches the maximum. | Product |
| Quick bids and custom maximum | Decided | Three chips at 1×, 2× and 4× the increment — from the committed maximum for a leader, from the current bid otherwise; a leader's typed floor is the maximum plus 100 minor units and is not chip 1; whole major units only, capped at 9,999,999,999, and an over-limit entry restores the previous draft. | Product |
| Buyer fee on the panel | Decided | The 20% rate is disclosed under the bid action, never behind a tooltip; the amount first appears on the invoice. | Product |
| Your bidding | Decided | The lot's personal dialog: two tabs, Bid placed then Your maximums, amount and time only, owner only; the live maximum stays on the panel; refusals stay on the account chronology. | Product |
| Watch ≠ email alerts | Decided | Watch is list membership; email alerts are a per-lot preference, on by default when watched, off on unwatch; mute is not unwatch. An account-wide Auction email alerts switch covers every lot without clearing lists. | Product |
| Privacy of a watch | Decided | Visible only to its owner; no public count. Operators see a Watchers column on the admin Listings table. | Product and design |
| One table | 🚧 In flight | My Auctions is one bookmark table with bid rows first, Your Standing separating commitment from watch-only (`--`), and Active, Upcoming and Ended tabs by bidding window; a lot both watched and bid on appears once, and Unwatch is offered only without a bid. | Product and design |
| Called-off leaves the list | 🚧 In flight | A called-off lot is hidden, so it leaves the watched list; supersedes "survives close" for called-off lots and the watchlist delta's own "shown as called off". | Product |
| Won hands off to orders | Decided | Every Won row offers View order into Winner Order and no helper lines; the order status vocabulary is the auction's. | Product (@tangconst) |
| Card holds stated plainly | Decided | A losing bidder's row names being released or released, because a pending authorization on a bank statement reads as a charge. | Product and finance |
| Letter audiences | Decided | Start letters reach watchers; close-in-24h and extended-bidding reach a bidder who unwatched while alerts stay on; new-bid letters coalesce to the current leading bid; bid beats watch and a win beats both, so nobody gets two letters for one event. | Product |
| No-bids close copy | Decided | Ended only — never unsold, no sale or Highest bid; no bidder letter when nobody bid. | Product |
| Unsubscribe | Decided | Stop means mute for this lot: Manage alerts opens My Auctions, sign-in first when signed out; not unwatch, not the account master. Every outbound link carries `utm_source=email`, `utm_medium=auction_notification`, the letter kind as `utm_campaign` and the control as `utm_content`. | Product |
| Watch limit | ❓ Open | A limit exists so the list stays a considered list; Design sets the value and what the collector sees on reaching it, revisited against watch depth after the first release. | Design |
| Hold line on the non-winner letter | ❓ Open | Draft omits it; My Auctions keeps hold state. | Product |
| Send-log retention | ❓ Open | How long rows are kept. | Engineering |
| One-hour reminder | 🚧 In flight | The one-hour watcher reminder is retired; Bidding closes in 24 hours is the last warning before close, and extended bidding still mails. Replaces the decision that it stays beside the 24-hour letter. | Product (@jeffffej0909) |
:::
