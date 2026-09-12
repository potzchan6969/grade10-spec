# UI: auction email notifications

The collector-facing surface of this change is six email messages, My
Auctions mute controls, and the account-level auction email alerts master.
Operators also get a send log. Nothing renders in the site shell for mail
itself. Letter markup is built with emailcn (shadcn registry `@emailcn`) on
React Email in [`apps/emails`](../../../../apps/emails/);
preview with `pnpm email:dev`. Shared pieces and send details are in
`tech-design.md`.

## Screens

Letters are authored and previewed in [`apps/emails`](../../../../apps/emails/)
(`pnpm email:dev`) and the shared React Email chrome below — not Figma.
My Auctions states live in Storybook (`AuctionRecord`). The admin send log
has no separate design supplement; it follows existing admin table patterns.

| Message | Preview | Audience |
| --- | --- | --- |
| Bidding opens in 24 hours | `apps/emails` auction letter | Watchers with email alerts on |
| Bidding has opened | `apps/emails` auction letter | Watchers with email alerts on |
| Bidding closes in 24 hours | `apps/emails` auction letter | Watchers and bidders with alerts on |
| Extended bidding has started | `apps/emails` auction letter | Watchers and bidders with alerts on |
| A lot you bid on received a new bid | `apps/emails` auction letter | Bidders with alerts on, excluding the one who bid |
| You have been outbid | `apps/emails` auction letter | The collector who stopped leading, alerts on |

One template family, six messages. Shared header, lot block (one primary
image), and footer. The preserved one-hour closing reminder stays on its
existing lane.

| Screen | Storybook / surface | What is on it |
| --- | --- | --- |
| Admin send log | Admin auction **Send log** tab | Rows of type, sent-to email, listing, and Sent At. Filter by user email. No message body. |
| My Auctions | `Filled`, `Bidding only`, `Watching only`, `Empty`, `Closed and called off`, `Unavailable`, `Bid-on mark`, `Unwatch`, `Email alerts muted`, `Email alerts pending` | Account page: breadcrumbs, title, **Bidding** then **Watching**; per-row **Email alerts** + **Unwatch** on Watching; **Email alerts** on Bidding |
| Account → Notifications | *auction email alerts master only* | Global **Auction email alerts** master. Not an inbox or channel-prefs matrix this change |

## My Auctions (mute UI)

**Watch vs email alerts.** Watching is list membership. Email alerts are a
separate per-lot preference (default on when watching). Unwatch removes the
lot from Watching and turns alerts off. Mute is not Unwatch. Account →
Notifications holds the global **Auction email alerts** master; when it is
off, per-lot toggles show off or disabled with explanation.

**Placement.** My Auctions in the account area. Entrance copy names **lots** /
auction so the list is not read as a store watchlist. Bidding and Watching
are **sections**, not tabs. Do not put the account master only as a matrix
on My Auctions.

**Section order.** **Bidding first, Watching second.** Each heading carries
its row count. Watching order is Watched At descending.

**Row anatomy.** Key image, lot title, labelled **Current bid** and
**Closes** cells, state `Badge`, bid-on mark, Email alerts, Unwatch.

**Email alerts control.** Design-system `Switch` in a bell-marked pill beside
Unwatch. Bidding rows carry the same toggle without Unwatch. One row's
toggle changes that row only. Muting or unmuting toasts once the application
confirms — "It stays on Watching" or "Your bid stands". While a change is
in flight the switch is busy and locked.

**Components.** `AuctionRecord` page body; `AuctionRecordRow` with Email
alerts pill; `WatchButton` aligned with lot details. This change replaces
the earlier My Auctions alerts surface from the watchlist plan.

## Components (letters)

None from `@grade10/ui` or the design-system package for the letter itself.
Shared **email** pieces (`AuctionEmailShell`, `LotBlock`, `PrimaryCta`,
`EmailFooter` with mute link) live with the auction letter templates.

`@grade10/i18n` may hold English catalog keys for the six kinds; locale
selection stays off this change — sends are English regardless of the
reader's account locale.

## Letter chrome

Every kind uses the same chrome. Kinds differ in words; the mute control
**Manage alerts** follows the why sentence when `canUnsubscribe` is true
(`grade10-site-auction-notifications-SC-18`).

| Element | Content |
| --- | --- |
| Brand mark | Storefront logo. Activating it opens that storefront's home (`SC-35`), with campaign tags (`SC-36`). |
| From name | Brand of the storefront the collector watched or bid on |
| Subject | Event in plain English plus lot title |
| Preheader | One short clause that completes the subject. Not a repeat of it. |
| Heading | Kind name |
| Body | Why they should act (event-first; not “because you are watching”) |
| Lot block | One primary listing image when available; lot title; **bid amount as a highlight** when the kind carries one; secondary facts (close / start). Omit the image when none exists (`SC-29`, `SC-30`). Image may link to the listing URL. Listing links carry campaign tags (`SC-36`). |
| Primary CTA | **View lot** → listing URL on that brand. Outbid uses **Bid again**. Carries campaign tags (`SC-36`). |
| Footer | Why they received the letter; brand legal footer |
| Mute link | Why: **Email alerts are on for this lot.** Link: **Manage alerts** → **My Auctions** (per-row Email alerts), when `canUnsubscribe` is true. Signed out: existing sign-in flow, then My Auctions. Not the account-wide Auction email alerts master. Carries campaign tags (`SC-36`). |
| Campaign tags | On every outbound link: `utm_source=email`, `utm_medium=auction_notification`, `utm_campaign` = letter kind, `utm_content` = `logo` \| `cta` \| `lot_image` \| `lot_title` \| `manage_alerts`. No `utm_term`. |

## Copy

English draft for the auction letter catalog. Placeholders use `{…}`. Amounts
and times follow `money-amounts` and `dates-and-times`.

### Bidding opens in 24 hours

- **Mute link:** yes (Manage alerts)

| Field | Draft |
| --- | --- |
| Subject | Bidding opens tomorrow: {lotTitle} |
| Preheader | Starts {startsAt}. Be ready to bid. |
| Heading | Bidding opens in 24 hours |
| Body | This lot opens for bids soon. |
| Lot facts | Starts {startsAt} |
| Footer why | Email alerts are on for this lot. Manage alerts |

### Bidding has opened

- **Mute link:** yes (Manage alerts)

| Field | Draft |
| --- | --- |
| Subject | Bidding is open: {lotTitle} |
| Preheader | Place a bid while the lot is live. |
| Heading | Bidding has opened |
| Body | This lot is now open for bids. |
| Lot facts | Open now. Closes {scheduledClosesAt} |
| Footer why | Email alerts are on for this lot. Manage alerts |

### Bidding closes in 24 hours

- **Mute link:** yes (Manage alerts)

| Field | Draft |
| --- | --- |
| Subject | Closes in 24 hours: {lotTitle} |
| Preheader | Scheduled close {scheduledClosesAt}. The close can still move. |
| Heading | Bidding closes in 24 hours |
| Body | This lot’s scheduled close is about a day away. If bidding extends, the close may move later. You will get a separate notice when extended bidding starts. |
| Highlight | Current bid {currentBid} |
| Lot facts | Scheduled close {scheduledClosesAt} |
| Footer why | Email alerts are on for this lot. Manage alerts |

### Extended bidding has started

- **Mute link:** yes (Manage alerts)

| Field | Draft |
| --- | --- |
| Subject | Extended bidding: {lotTitle} |
| Preheader | The close has moved. Current close {effectiveClosesAt}. |
| Heading | Extended bidding has started |
| Body | A late bid moved this lot’s close. Bidding continues until no further bid lands in the extension window. |
| Highlight | Current bid {currentBid} |
| Lot facts | Current close {effectiveClosesAt} |
| Footer why | Email alerts are on for this lot. Manage alerts |

### New bid on a lot you bid on

- **Mute link:** yes (Manage alerts)

| Field | Draft |
| --- | --- |
| Subject | New bid on {lotTitle} |
| Preheader | Leading bid is now {currentBid}. |
| Heading | A lot you bid on received a new bid |
| Body | Someone else bid on this lot. |
| Highlight | Leading bid {currentBid} |
| Lot facts | Closes {effectiveClosesAt} |
| Footer why | Email alerts are on for this lot. Manage alerts |

### You have been outbid

- **Mute link:** yes (Manage alerts)

| Field | Draft |
| --- | --- |
| Subject | You have been outbid: {lotTitle} |
| Preheader | Leading bid is now {currentBid}. Closes {effectiveClosesAt}. |
| Heading | You have been outbid |
| Body | Another bid took the lead on this lot. |
| Highlight | Leading bid {currentBid} |
| Secondary | Your bid {yourBid} — same size/weight, to the right of Leading bid, in destructive colour; omit when not supplied. Never the maximum |
| Lot facts | Closes {effectiveClosesAt} |
| Primary CTA | Bid again |
| Footer why | Email alerts are on for this lot. Manage alerts |

Do not print the reader's own prior amount unless the template supplied it
(`grade10-site-auction-notifications` letter-shape requirement). Never print
the reader's maximum in mail.

## States

An email has no interaction states. What varies between one send and the next
is content, and each variation is tied to the scenario that defines it.

| Variation | Scenario |
| --- | --- |
| A lot whose close has moved past its scheduled close | `grade10-site-auction-notifications-SC-08` |
| Start letter, mute link | `grade10-site-auction-notifications-SC-05`, `SC-19` |
| Has-started letter, mute link | `grade10-site-auction-notifications-SC-07` |
| Close-in-24h; mute link | `grade10-site-auction-notifications-SC-08` |
| Extended-bidding; mute link | `grade10-site-auction-notifications-SC-09` |
| Outbid letter, mute link | `grade10-site-auction-notifications-SC-12`, `SC-20` |
| New-bid letter, mute link | `grade10-site-auction-notifications-SC-11` |
| Mute while watching | `grade10-site-auction-notifications-SC-32` |
| Mute while bidding | `grade10-site-auction-notifications-SC-33` |
| Same chrome on two kinds | `grade10-site-auction-notifications-SC-18` |
| Lot block with one primary image | `grade10-site-auction-notifications-SC-29` |
| Lot block without an image | `grade10-site-auction-notifications-SC-30` |
| A recipient enrolled by both watching and bidding | `grade10-site-auction-notifications-SC-02` |
| The send log filtered to one collector | `grade10-site-auction-notifications-SC-26` |
| A log row for a sent message | `grade10-site-auction-notifications-SC-25` |
| Watching + alerts muted | `grade10-site-auction-watchlist-SC-19` |
| Account master off | notifications account master |
| No letter | `SC-04`, `SC-15`, `SC-23`, `SC-27`, `SC-28`, `SC-31`, `SC-32`, `SC-33` |
