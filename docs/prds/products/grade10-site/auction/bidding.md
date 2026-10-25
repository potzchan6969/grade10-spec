---
title: Bidding
spec: grade10-site/auction/auction
order: 3
reviewed: 2026-10-14
---

How a lot is won: the rules every bid is held to, the panel a collector bids
from, and the record and letters that follow their lots.

## Auction Logic

Every Grade10 listing is absolute — no reserve and no buy-now price — and the
highest accepted bid at the close wins it.

An admin sets a time for Grade10 to commit the house maximum. Before that
time the house is not in the bidding. The house then bids under a listing
pseudonym like any collector, and a lot it leads at close reads sold to
collectors. Collectors do not see that the bidder is the house - [Internal
Bid](/p/grade10-admin/auction/internal-bid)

| Rule | Value |
| --- | --- |
| Bidding window | From the scheduled start to the recorded close |
| Extension duration | **30 minutes** by default, set per listing; **0** turns extended bidding off |
| Extension cap | Optional, per listing; the close never moves past the scheduled close plus the cap |
| Bid currency | **USD** for every lot; a collector always types USD — [Currencies](#currencies) |
| Bid ceiling | **USD 10,000,000** on every lot |
| 🚧 Verified bidder | A bid of **USD 15,000** or more, or any new or raised maximum from an account Grade10 asked to verify - [Account · Verified Identity](/p/grade10-site/auction/account#verified-identity) |
| Card | The card on file; nothing is held or charged on it when a collector bids, and only the winner pays, by the invoice on their order |
| Listing terms | The fee, currency, region and deadline terms are fixed when bidding opens |

### Currencies

Auction bids use USD. Winners choose USD or HKD for settlement.

| | Bid currency | Settlement currency |
| --- | --- | --- |
| Which | **USD** | **USD** or **HKD** |
| Chosen by | Fixed for every lot | The winner, once, at [Order Setup](/p/grade10-site/auction/post-bidding#order-setup) |
| What it is for | The unit of every lot, bid and maximum | What the invoice, order total, fees and letters are paid in |

- **One unit for every lot** — a bid, a maximum, a quick bid, the ceiling
  and the increment are all USD; no lot is priced in another currency
- **Settlement currency** — a USD fact becomes an HKD fact only at
  settlement, at one fixed rate — [Post-Bidding · Settling in HKD](/p/grade10-site/auction/post-bidding#settling-in-hkd)

### Extended Bidding

Until the scheduled close, no bid moves the recorded close. At it, a listing
with at least one accepted bid enters extended bidding, and the listing closes
when the timer runs out with no new bid.

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
- **Extension off** — a bid at exactly the scheduled close still counts,
  and the listing closes with it
- **Each listing on its own** — every listing runs its own timer, whatever
  campaign it belongs to
- **Accepted once** — a bid advances the highest bid atomically, so a delayed
  lower bid never displaces a higher one however the network reorders them
- **A price move restarts the timer** — an accepted bid that moves the
  price, from anyone, sets the close to the full extension duration after it.
  Equal maxima at a higher price move it: at 1,000, with A's maximum at 2,000,
  B's maximum of 2,000 makes the price 2,000, A keeps the lead as the earlier,
  and the lot extends. A leader raising their own maximum does not
- **A bid counts when it is accepted** — judged under the lot's lock at that
  moment, and answered at once; nothing waits on the card
- **No bid after the close** — however late the close is recorded, no bid
  counts at or after the effective close. Until extended bidding is recorded,
  that is the scheduled close plus the extension duration or the cap,
  whichever is shorter; once it is, it is the recorded close. A cap of **0**
  turns extended bidding off, as a duration of **0** does

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
- **Raise only** — a collector's maximum goes up at any time and never down,
  because lowering would withdraw a commitment others have bid against
- **House maximum lowered** - the house maximum may go down, only while the
  leader and the current bid stay as they are and never below a bid already
  placed for the house
- **Own standing** — a bidder reads their maximum, the current bid and whether
  they lead; never another bidder's maximum, identity or card
- **A bid Grade10 places is a bid** — it counts in the bid count and the
  history, and restarts the extended-bidding timer as a manual bid would; two
  standing maxima never keep extending the close on their own
- **An erased leader** — when the leader's account is erased, their maxima
  are withdrawn and the highest maximum left takes the lead, priced at the next
  maximum plus one increment, capped at the new leader's maximum and never
  above the price before; with one maximum left, it stands at the opening
  price; with none left, the lot has no leader
- **Close and settlement** — nothing is held on any card; the winner pays the
  invoice — [Post-Bidding](/p/grade10-site/auction/post-bidding#the-close)

### Bid Increments

The increment is selected by the USD amount being beaten. A tier includes its
lower bound, and the last tier has no upper bound. Grade10 sets one schedule,
and no listing overrides it. The schedule is configuration, not a
requirement, kept in `packages/grade10-auction/contracts/src/bidIncrementSchedule.ts`:
Grade10 can change its values without changing this rule, and the
table below shows the values in force. They follow the increments Goldin
publishes under [How does bidding work?](https://goldin.co/faq), with $1 below
$10, where Goldin names none.

| From | Increment |
| ---: | ---: |
| $0 | +$1 |
| $10 | +$2 |
| $50 | +$5 |
| $100 | +$10 |
| $200 | +$25 |
| $500 | +$50 |
| $1,000 | +$100 |
| $2,500 | +$250 |
| $5,000 | +$500 |
| $10,000 | +$1,000 |
| $20,000 | +$2,000 |
| $30,000 | +$3,000 |
| $50,000 | +$5,000 |
| $100,000 | +$10,000 |
| $200,000 | +$20,000 |
| $300,000 | +$25,000 |
| $600,000 | +$50,000 |
| $1,000,000 | +$50,000 |
| $1,500,000 | +$100,000 |

| Lot | Amount being beaten | Next minimum | Outcome |
| --- | ---: | ---: | --- |
| Lot opening at $200 | $200 | $200 | The first bid may stand on the starting price; $225 from the second |
| Lot opening at $0 | $0 | $1 | The first bid must reach the lowest increment; a lone bidder stands at $1, never $0 |
| Lot on a tier boundary | $100 | $110 | The $100 tier applies, not the $50 tier |
| A bidder offers more | $100 | $110 | $120 is accepted as $120; nothing rounds it to a multiple |
| Lot at the ceiling | $10,000,000 | — | Every further bid is refused |

- **One configured schedule** — the USD tiers above apply to every lot, to
  the house's maximum and to a bid in extended bidding as to any other, and a
  change to their values reaches the next bid on every lot, open ones
  included; a bid already standing keeps its amount
- **Whole dollars only** — a bid, a maximum, a starting price, every tier
  bound and every increment are whole dollars; a bid with cents is refused and
  nothing moves, and a starting price an operator or a consignment sets with
  cents is not saved. A price already stored with cents is left as it is
- **What a collector sees** — the next minimum for the lot, never the
  schedule
- **A first maximum** — must reach the opening price, and the public price it
  creates is the opening price itself
- **Opening price** — the first bid must reach the starting price, or the
  lowest increment when the lot starts at 0, and a lone bidder stands there;
  one increment above the current bid applies from the second bid
- **Opening price of a stored price with cents** - a listing already stored
  with a starting price that has cents opens at the next whole dollar at or
  above it; the page still shows the starting price

### Refusals

A refused bid is not a bid. Except for an above-ceiling refusal, the bid form says why, and nothing else moves: no
row on My Auctions or Bidding History, no change to the price, the leader or
any maximum.

| Refused when | What the bid form says |
| --- | --- |
| Below the next minimum the page shows | Nothing is sent: the custom field says **Min:** the minimum, and the bid action stays disabled |
| Below a next minimum that moved after the page showed it | **Minimum bid is** the minimum |
| Above the USD ceiling | No maximum-bid message; custom entry already stops or corrects the amount at the ceiling |
| Not above the bidder's own maximum | **Your new maximum must be higher than your current one.** |
| At or above the bar without a verified identity | **Bids this high need a verified identity. Verify from your account, then bid again.** and a **Verify** link |
| Grade10 asked the account to verify, and it has not | **We asked you to verify before you bid again.** and a **Verify** link |
| No linked card | **Link a card to bid.** |
| Another card after the first accepted bid on the lot | **This listing's card is locked after the first accepted bid.** |
| Bidding suspended on the account | **Bidding is suspended on this account. Contact Us to resolve it.** |
| Account banned from bidding | **This account cannot bid.** |
| A typed amount that is not valid, caught before the bid is sent | **Enter a valid amount.** |
| Before the start, after the close, or any other refusal | **Your bid did not go through.** |

- **Kept for operators** — each refusal is one operational log line naming the
  lot and the reason; the bidder's record never shows it
- **Bidder and amount** — the log line also names the bidder, the amount sent,
  and the floor or ceiling the refusal names
- **An answer lost on the way** — when a bid's answer never arrives, the bid
  reads as placed if the bidder's standing holds it, and the bid form says
  **Could not place this bid.** if it does not
- **Restricted region** — a bid or a watch sent from a region where auctions
  are not offered is refused before the auction hears of it; the restriction
  page, not a bid-form line, is the answer. A winner's order stays open there,
  so a won lot is settled, and unwatching or muting alerts is never refused

## Auction Panel

The panel on the lot page is where a collector enrols — sign-in, then a
linked card — and names a maximum; the blocks themselves are [Listing Page
Blocks](/p/shared/ui/auction-listing).

| Rule | Value |
| --- | --- |
| Buyer fee on the panel | 🚧 **20%** of the winning bid, the rate only, always on; the amount first appears on the invoice |
| Quick bids | 🚧 Three chips at **1×**, **2×** and **4×** the listing increment, from the current bid or from their own maximum when they lead; before any bid, chip **1×** is the opening price itself, the next eligible bid |
| Custom maximum | Whole USD units only, up to the USD bid ceiling; extra typed digits stop, and an oversized paste or replacement becomes the ceiling silently |
| A leader's typed raise | 🚧 Starts at their maximum plus **100 minor units** |
| Chips beyond the ceiling | A quick bid above the ceiling is offered at the ceiling, captioned as the limit; duplicates collapse to one chip |
| Nothing left to offer | Their maximum at the ceiling, or the lot's next minimum above it, collapses the chips, custom field and bid action to the amount reached and a limit line; the buyer-fee line stays |

:::flow{title="From sign-in to a standing bid"}
## *Collector* — **Opens a live lot**
Signed out, the bid action offers sign-in; the recent public bids stay
visible.
## *Collector* — **Links a card, once**
In a provider-hosted field, with an age attestation once per account. Card
details never pass through Grade10, nothing is charged, and the card carries
to every later lot.
## *Collector* — **Names a maximum**
A quick bid or a typed amount, at or above the next minimum. The panel says
Grade10 bids only as needed up to it, and that it can be raised, never
lowered.
## *Grade10* — **Accepts or refuses at once**
The maximum stands as Leading or Outbid in the same answer, or the bid form
says why it was refused and the prior maximum stays in place.
## *Grade10* — **Bids for them**
As far as needed to lead, and tells them once when they lose the lead —
[Notifications](/p/grade10-site/auction/bidding#my-auctions-watchlist-and-notifications).
## *Collector* — **Raises**
On the same card, locked by the first accepted bid.
:::

### Display

| State | What the collector sees |
| --- | --- |
| **Signed out** | The bid action offers sign-in; no standing, no fee line |
| **No linked card** | Amount controls visible but disabled; the bid action and the empty card slot open setup |
| **Card on file** | Amount controls enabled, with Change until the first accepted bid on this lot |
| **Leading** | Their maximum, the current bid and Leading |
| **Outbid** | Outbid, and the next valid bid |
| **Lost** | Did not win; My Auctions says the card was not charged |
| **Open, no bids** | **No bids yet** under the starting bid |
| **Closed, no bids** | **Ended** as the result, and **No bids** under it — never **No bids yet** |

- 🚧 **Time left (extended)** — while the lot is in extended bidding the label
  says so, and its tooltip names the extension duration only
- **Recent bids Winner** — after the lot closes sold, the winning public
  row shows a primary crown after the amount; rows tied on amount list the
  earlier maximum first, and each row below it, at the current price or
  lower down, carries an Info tip in the amount tone: when maximums match,
  the earlier one leads — [Listing Page Blocks · Bid
  History](/p/shared/ui/auction-listing#bid-history)
- **Recent bids avatar** — each public Recent Bids row shows one avatar
  letter from that bidder's email local part; the readable label stays
  Bidder N; never the full email or a name — [Listing Page Blocks · Bid
  History](/p/shared/ui/auction-listing#bid-history)
- **Your bidding** — a signed-in bidder opens their own record for the lot
  beside the public recent bids — [Bidding
  History](/p/grade10-site/auction/bidding#auction-panel)

::story{id="auction-bidding-screens-bid-panel--signed-out" title="Signed out"}

::story{id="auction-bidding-blocks-listingauctionbidcard--outbid" title="The bid panel after being outbid"}

### Enrolment Flow

- **Link before amount** — with no linked card the chips and the custom field
  stay visible and disabled; only the bid action and the empty card slot open
  setup
- **Setup is link only** — Continue enables with a card entered and the
  attestation checked, reads Linking while the provider works, and closing
  before it is done leaves no card on file; nothing is charged in setup
- **The card carries across lots** — a card linked on an earlier lot needs no
  setup; Change stays until the first accepted bid on this lot, and later
  raises keep that card
- **Enrolled** — an accepted first bid completes enrolment, bookmarks the lot
  on My Auctions and turns its email alerts on

::story{id="auction-bidding-screens-bid-panel-dialogs--setup-modal" title="Setup modal"}

### Bidding History

The account keeps one retained record of everything bidding did, at the
account's bids address; signed out, sign-in runs first.

- **One row per listing** — every listing the account placed a bid on, by
  latest activity, with its current or final price and the collector's
  standing: Leading, Outbid, Won or Canceled
- **Active and Completed** — two filters; it opens on Active, and a row
  expands its story in place
- **One listing's story** — every maximum set or raised, interleaved with the public movements that changed the
  collector's standing; they read as You and every rival by the lot's
  pseudonym, and no rival's maximum ever appears
- **Highest bid on top** — a listing's story follows bid amount, the higher
  amount above the lower. When one bid and the automatic bid it set off share a
  moment, the automatic response reads above the bid that caused it; a maximum
  set or raised reads below the bid it causes; a raise that causes no bid
  reads by its time, newer above older
- **Your bidding, on the lot** — two tabs, Bid placed, the bids Grade10 placed
  for them, then Your maximums; amount and time only, owner only
- **Never edited** — nothing deletes or hides an entry, because the record is
  the audit

## My Auctions, Watchlist and Notifications

One record of every lot a collector bookmarks, by watching or by bidding, and
the letters that follow those lots.

On a small viewport, My Auctions shows the same lots and actions as the
table without horizontal scrolling; each lot is a stacked card below `md`.

| Rule | Value |
| --- | --- |
| Opening warning | **24 hours** before the scheduled start |
| Closing warning | **24 hours** before the scheduled close, which extended bidding never moves; no one-hour reminder |
| Copies | One per lot per collector per letter; a temporary failure retries, and an operator re-queues a given-up letter |

### My Auctions

🚧 One list holds every bookmarked lot once — bid lots before watch-only,
soonest close first in each band, closed lots after open ones — with the row
count in the title. The former Bidding and Watching sections do not appear.
On a small viewport each lot is a stacked card; the whole card opens the lot
or Winner Order, and Unwatch and Email alerts stay on the card. From tablet
the same facts sit in the five-column table.

| Column | What it shows |
| --- | --- |
| Lot | The key image, the title and the close |
| Current bid | The auction's current price, or its final price once it closes — never the collector's own bid |
| 🚧 **Your Standing** | Leading · Outbid, with the next valid bid; a refused attempt moves neither · Won, reading the order's status (Awaiting Setup, Setup Overdue, Preparing Invoice, Pending Payment, Payment Overdue, Payment Verifying, Partially Paid, …) · Didn't win, saying the card was not charged · `--` for a watch-only lot |
| Email alerts | The per-lot switch; off and locked when the account's **Auction email alerts** master is off, or the lot has ended |
| Unwatch | Only when the collector has not bid |

- **No window tabs** — the list is not split by bidding window: Active,
  Upcoming and Ended lots share it, and the title count is the total
- **Page frame** — the breadcrumb sits above the container; the title with
  its count heads the list
- **After the close** — Your Standing reads Won or Didn't win once the
  result is recorded, never from the page's own clock
- **Won** — every Won row offers View order into the lot's order, Cancelled
  and Refunded included — [Post-Bidding · Winner
  Order](/p/grade10-site/auction/post-bidding#winner-order)
- **Payment Verifying and Partially Paid** — a won lot reads Payment
  Verifying while its proof waits for an operator, and Partially Paid while
  an operator collects it in parts
- **Setup Overdue and Payment Overdue** — a won lot reads Setup Overdue
  once the setup deadline passes incomplete, and Payment Overdue once the
  payment deadline passes unpaid — not Awaiting Setup or Pending Payment
  after the miss
- 🚧 **A bid bookmarks the lot** — with no separate Watch
- **Removed with the listing** — unpublishing or removing a listing takes it
  off My Auctions
- **Honest reads** — nothing bookmarked offers the catalogue; a failed read
  says so and can be retried; a close or a bid that could not be refreshed is
  shown as not current

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
- 🚧 **Each action says what it did** — watching from the lot page announces
  that email alerts are on, with View My Auctions; unwatching announces the
  same action with Undo —
  [Auction Details](/p/grade10-site/auction/display#auction-details)
- **After the close** — the entry stays until its owner unwatches it
- 🚧 **Called off** — a called-off lot leaves the watched list —
  [Lot Status](/p/grade10-site/auction/display#auction-details)
- **Private** — no public fact carries a watch count or a watcher's identity;
  operators see how many collectors watch a lot, across both brands and never
  a name

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
| You did not win | The lot stops taking bids with a winner | Bidders who lost, with Winning bid and Their bid |
| Lot watched, sold | The lot stops taking bids with a winner | Watch-only collectors, with Sold for |
| Lot watched, ended | The lot stops taking bids with no bids | Watch-only collectors, Ended only — never unsold, no sale or Highest bid |

- **One letter** - nobody hears about their own bid, an outbid collector gets
  the outbid letter and not also a new-bid one, a watcher who bid gets the
  non-winner letter, and a collector winner gets only the auction-won order
  letter; an internal bidder's order sends no letter to anyone - [Post-Bidding ·
  The Close](/p/grade10-site/auction/post-bidding#the-close)
- **House bids** - collectors outbid by the house get the ordinary outbid
  letter, other enrolled bidders get the ordinary new-bid letter, and losing
  bidders and watchers get the ordinary close letters. No letter names the
  house - [Internal Bid](/p/grade10-admin/auction/internal-bid)
- **Account master** — Account → Notifications carries an **Auction email
  alerts** switch; off stops all per-lot auction mail without clearing lists
  or bids
- **No one-hour reminder** — Grade10 sends no one-hour closing reminder; the
  last warnings before a close are Bidding closes in 24 hours, then Extended
  bidding has started if the lot extends
- **Footer** — every letter says email alerts are on for this auction, and
  **Manage alerts** opens My Auctions to mute that auction; never an
  unauthenticated one-click stop, never unwatch
- **Never a false statement** — a called-off lot sends nothing further, and a
  letter that would state something no longer true is not sent late
- **Send log** — operators answer "I was never told" from message type,
  recipient, lot and when it was sent, never the body
- **Log retention** — **90 days**; troubleshooting only. Resend keeps the
  durable trail
- **No card line on the non-winner letter** — the letter does not mention the
  card; My Auctions says it was not charged

:::detail{title="Code map" for="engineer"}
- **Service** — [Auction Service](/platform/auction-service): the bid, maximum and close invariants, and the sweeps
- **Blocks** — `ListingAuctionBidCard`, `ListingUserBidHistory`, `EnrollmentSetupSheet`, `PaymentMethodRow` and `WatchButton`, in `packages/ui` — [Listing Page Blocks](/p/shared/ui/auction-listing) and [Auction Record Blocks](/p/shared/ui/auction-record)
- **Signal** — `bidEnrollment`: `signed-out`, `needs-card` or `ready`
- **Extension settings** — `packages/ui/src/blocks/auction-listing/listing-extension-policy.ts`
- **Mail** — `apps/emails/emails/auction/`
:::

:::detail{title="Test cases" for="qa"}
[Test cases · grade10-site/auction/auction](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/auction/auction)

[Test cases · grade10-site/auction/auto-bidding](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/auction/auto-bidding)

[Test cases · grade10-site/auction/bid-increments](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/auction/bid-increments)

[Test cases · grade10-site/auction/bid-panel-enrollment](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/auction/bid-panel-enrollment)

[Test cases · grade10-site/auction/bid-payment-method](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/auction/bid-payment-method)

[Test cases · grade10-site/auction/bidding-history](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/auction/bidding-history)

[Test cases · grade10-site/auction/account-record](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/auction/account-record)

[Test cases · grade10-site/auction/notifications](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/auction/notifications)
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
| Losing bidder | Bid and did not win | Confirms the outcome and that the card was not charged, so a lost lot is not read as a charge. |
| Auction operator | A dispute about who led, or a collector who says they were never told | Reads each maximum with when it was accepted, and which letters went to that address. |

**Not in scope.** Reserve prices. Lowering or withdrawing a collector's maximum, or
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
| Absolute sale | 🚧 In flight | No reserve and no buy-now price; the highest accepted bid at the close wins, and that bid may be the house's internal bid. The house bids under a listing pseudonym and is not disclosed; Legal confirms the auction terms wording before release. Replaces "No reserve and no buy-now price; the highest accepted bid at the close wins." Disclosing the house bid was ruled out, because it tells a collector when to stop. | Product (@htonyl) |
| Internal bid, lowered | Decided | A house maximum already committed may go down only when the leader and the current bid stay as they are, and never below a bid already placed for the house. Collector maximums stay raise only. | Product (@htonyl) |
| Extended bidding | Decided | Starts at the scheduled close for a listing with a bid, runs 30 minutes by default, restarts on each accepted bid that moves the price, and ends at the listing's optional cap. A listing with no bid, or with the duration or the cap set to 0, closes on schedule. Replaces "restarts on every accepted bid", which let a leader keep a lot open by raising their own maximum. | Product |
| A bid counts when accepted | Decided | A bid stands when it is judged under the lot's lock, and nothing waits on the card. Replaces "a bid counts when its payment confirms", which kept a pending bid and an Authorizing… state. | Product |
| My Auctions price | Decided | A bidding row shows the auction's current or final price, as Bidding History does, and the standing after the close comes from the recorded result. The collector's own last bid was ruled out: a losing bidder misreads what the lot sold for. | Product |
| Resolve | Decided | Second-highest maximum plus the listing increment, capped at the leader's maximum; equal maxima, the earlier leads; one resulting price, never intermediate bids. | Product |
| Public Recent bids Winner | 🚧 In flight | After close sold, public Recent bids mark the winning row with a primary crown after the amount; every row tied on amount with a row above it shows an Info tip in the amount tone (when maximums match, the earlier one leads), at the current price and at any older tie lower down. Live lots keep leading as first-row treatment only, with no winner crown. | Product and design (@tangconst) |
| Public Recent bids avatar | Decided | Each public Recent Bids avatar shows one letter from the bidder email local part (first A-Z or 0-9, uppercased; `B` when none or the email is erased). Readable label stays Bidder N. Full email and name stay private. Separate public field from the label. | Product (@mason5991) |
| Hidden cap, raise only | Decided | A leading maximum is not public; a collector's can go up but never down. | Product |
| Increments | Decided | One USD schedule for every lot, selected from the amount being beaten; a threshold includes its lower bound. The values are configuration in `packages/grade10-auction/contracts/src/bidIncrementSchedule.ts`, retuned by pull request and shown in the manual table. Bids, maximums, starting prices, tier bounds and increments are whole dollars, and a bid may exceed the minimum. No listing-level override; collectors see the next minimum, not the schedule. A stored price with cents is left alone and opens at the next whole dollar. Replaces "need not be a multiple". Decided by the product manager. | Product (@htonyl) |
| Bid ceiling | Decided | USD 10,000,000 on every lot, refused above it. The custom field uses that same ceiling. | Product |
| Card on file | Decided | A bid is placed on the card linked to the account and holds nothing on it; only the winner pays, by the invoice on their order. No backwards compatibility, since nothing is launched. Replaces the optional bid-time hold. | Product and finance |
| If card holds return | Decided | The line stays at acceptance: a bid exists only once every precondition, a card authorization included, has succeeded and been judged under the lot's lock. The authorization is taken outside the lock, for the maximum, keyed to the attempt, and released if the attempt is refused; a later failure or expiry never revokes an accepted bid and is the winner's settlement at the close. Accepting first and revoking later moves the price down, swaps the leader and unwinds automatic bids, extensions and closes; eBay, Catawiki, Heritage, real-time bidding and exchanges all draw the line at acceptance. | Product and engineering |
| Story order | Decided | A listing's story on My bids follows bid amount, higher on top. Within one moment the challenger's bid is older than the leader's automatic response, so it reads below the response, and an owner's maximum set reads below the bid it causes. Chronology by clock (the challenger first) was ruled out: at one moment the clock cannot tell the two apart, and a collector reads the price ladder, not the order of arrival. The admin Bids tab keeps its own order. | Product (@htonyl) |
| A refused bid is not a bid | Decided | No My Auctions row, no Bidding History entry and no standing moves. The form explains refusals except an amount above the USD ceiling, which shows no maximum-bid message. | Product |
| Below the minimum on the page | Decided | The bid action stays disabled and the custom field says Min: the minimum; nothing is sent. The server's Minimum bid is refusal answers only a minimum that moved after the page showed it. Enabling the action to let the server refuse was ruled out: it costs a round trip for a bid the page already knows is too low ([#1007](https://github.com/9gag/grade10/issues/1007)). | Product |
| Refusals kept for operators | Decided | One structured operational log at the auction service per refusal, naming the bidder, the lot, the reason, the amount sent and, where the refusal names one, the floor or the USD ceiling; never in the bidder's record. | Product and engineering |
| An erased leader | Decided | The highest maximum left takes the lead, priced from the maxima left and never above the price before. Forfeiting the lead with the price kept was ruled out: it left a lot with no leader at a price nobody had bid. | Product |
| Verified bidder | 🚧 In flight | A bid of USD 15,000 or more, or any new or raised maximum from an account Grade10 asked to verify, needs what is asked, checked by the storefront before the auction hears of the bid. | Product |
| Bid currency | Decided | USD is the single bid currency for every lot. Winners choose USD or HKD settlement. Chosen over per-lot bid currencies, which made bids incomparable and required separate increments and ceilings. | Product |
| Existing lots | Decided | Every existing lot is test data: its currency is overwritten to USD with the amounts unchanged and no conversion. | Product |
| Setup is link only | Decided | Title Link a card to bid; body Link a card for bidding. You’re only charged if you win.; continue Link Card. The card carries to a new lot, and Change stays until the first bid on that lot. | Product |
| Mechanism disclosure | Decided | Always-on subtext under Set your private maximum: bid as needed, raise only. | Product |
| Quick bids and custom maximum | Decided | Three chips at 1×, 2× and 4× the increment - from the committed maximum for a leader, from the current bid otherwise; a leader's typed floor is the maximum plus 100 minor units and is not chip 1. Custom entry uses the USD ceiling: extra typed digits retain the prior draft, an oversized paste or replacement becomes the ceiling, and no maximum-bid message appears. Replaces the universal 9,999,999,999 field cap and restore-only rule, following [the owner's decision](https://github.com/9gag/grade10/issues/1008#issuecomment-6076137634). | Product (@tangconst) |
| Ceiling reached | Decided | A quick bid computed above the ceiling is offered at the ceiling, captioned as the limit; when no legal amount remains — the collector's maximum already at it, or the lot's next minimum above it — chips, custom field and bid action collapse to the amount reached and a line that the auction accepts no higher amount, with the buyer fee still shown. Keeping the controls disabled was ruled out: every number they showed was above what the auction accepts. | Product (@tangconst) |
| Buyer fee on the panel | Decided | The 20% rate is disclosed under the bid action, never behind a tooltip; the amount first appears on the invoice. | Product |
| Your bidding | Decided | The lot's personal dialog: two tabs, Bid placed then Your maximums, amount and time only, owner only; the live maximum stays on the panel. | Product |
| Watch ≠ email alerts | Decided | Watch is list membership; email alerts are a per-lot preference, on by default when watched, off on unwatch; mute is not unwatch. An account-wide Auction email alerts switch covers every lot without clearing lists. | Product |
| Privacy of a watch | Decided | Visible only to its owner; no public count. Operators see a Watchers column on the admin Listings table. | Product and design |
| One table | 🚧 In flight | My Auctions is one bookmark table with bid rows first, Your Standing separating commitment from watch-only (`--`), close urgency beside the listing identity, and no Bidding or Watching sections; a lot both watched and bid on appears once, and Unwatch is offered only without a bid. | Product and design |
| Your Standing column | 🚧 In flight | Leading, Outbid, Won, or Didn't win for bid rows; a refused attempt adds no row and moves no standing; `--` for watch-only. Close urgency is not a standing value. | Product and design (@tangconst) |
| Called-off leaves the list | 🚧 In flight | A called-off lot is hidden, so it leaves the watched list; supersedes "survives close" for called-off lots and the watchlist delta's own "shown as called off". | Product |
| Won hands off to orders | Decided | Every Won row offers View order into Winner Order and no helper lines; the order status vocabulary is the auction's. | Product (@tangconst) |
| Not charged, stated plainly | Decided | A losing bidder's row says the card was not charged, because a lost lot must not read as a charge. | Product and finance |
| Letter audiences | Decided | Start letters reach watchers; close-in-24h and extended-bidding reach a bidder who unwatched while alerts stay on; new-bid letters coalesce to the current leading bid; bid beats watch and a win beats both, so nobody gets two letters for one event. | Product |
| No-bids close copy | Decided | Watch-only get the watched-ended letter (Ended only — never unsold, no sale or Highest bid); sold closes use watched-sold with Sold for. No bidder letter when nobody bid. | Product |
| Unsubscribe | Decided | Stop means mute for this auction: Manage alerts opens My Auctions, sign-in first when signed out; not unwatch, not the account master. Every outbound link carries `utm_source=email`, `utm_medium=auction_notification`, the letter kind as `utm_campaign` and the control as `utm_content`. | Product |
| Card line on the non-winner letter | Decided | The letter omits it; My Auctions says the card was not charged. | Product |
| Send-log retention | Decided | 90 days. Troubleshooting only; Resend keeps the durable trail. | Engineering |
| One-hour reminder | Decided | Dropped. Bidding closes in 24 hours is the last warning before close; extended bidding still mails. Replaces the decision that it stays beside the 24-hour letter. | Product (@jeffffej0909) |
| Restricted regions | Decided | A region where auctions are not offered sees no auction entry point — the Auction nav item, account-menu auction items, watch controls and My Auctions included — and a direct auction address answers the restriction page. Bids and watches from that region are refused before the auction hears of them. The regions are CU, IR, KP and SY, ❓ Product and legal confirm the list. | Product |
| Restricted collector with open commitments | Decided | A winner's order and invoice stay open with their address, payment and proof actions, so money already won is settled; unwatching and muting alerts stay open. My Auctions, the bidding history, standings and new bids are refused. | Engineering (agent) |
:::
