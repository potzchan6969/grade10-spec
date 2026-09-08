# UI: auction email notifications

The collector-facing surface of this change is six email messages. Operators
also get a send log. Nothing renders in the site shell, and no `@grade10/ui`
or design-system export changes. Letter markup is built with emailcn on React
Email in [`apps/auction-emails`](../../../../apps/auction-emails/); preview
with `pnpm email:dev`. Shared pieces and send details are in `tech-design.md`.

## Screens

**No Figma frame exists for these messages or the send log yet.** A message a
collector reads is a designed surface and needs one, the same as a page does;
`tasks.md` carries producing the letter and send-log frames. Until a letter
frame exists, layout follows the shared chrome below and the existing auction
letter lane.

| Message | Frame | Audience |
| --- | --- | --- |
| Bidding opens in 24 hours | *to be produced* | Watchers |
| Bidding has opened | *to be produced* | Watchers |
| Bidding closes in 24 hours | *to be produced* | Watchers and bidders |
| Extended bidding has started | *to be produced* | Watchers and bidders |
| A lot you bid on received a new bid | *to be produced* | Bidders, excluding the one who bid |
| You have been outbid | *to be produced* | The collector who stopped leading |

One template family, six messages. A single frame set covering the shared
header, lot block (one primary image), and footer is enough if it carries all
six bodies. The preserved one-hour closing reminder stays on its existing
lane; Figma may show it for parity but this change does not redesign it.

| Screen | Frame | What is on it |
| --- | --- | --- |
| Admin send log | *to be produced* | Rows of type, sent-to email, listing, and Sent At. Filter by user email. No message body. |

## Components

None from `@grade10/ui` or the design-system package. Mail shares nothing with
the site's component packages. Shared **email** pieces (`AuctionEmailShell`,
`LotBlock`, `PrimaryCta`, `EmailFooter`, `StopWatchingLink`) live with the
auction letter templates — see `tech-design.md`.

The send log is an admin assembly from existing primitives (`Input`, `Text`,
table layout).

`@grade10/i18n` is **not** involved: these messages are English regardless of
the reader's locale, per `money-amounts`.

## Letter chrome

Every kind uses the same chrome. Kinds differ in words and whether stop
watching is present (`grade10-site-auction-notifications-SC-18`).

| Element | Content |
| --- | --- |
| From name | Brand of the storefront the collector watched or bid on |
| Subject | Event in plain English plus lot title |
| Preheader | One short clause that completes the subject. Not a repeat of it. |
| Heading | Kind name |
| Body | Why they should act |
| Lot block | One primary listing image when available (contained, height-capped; no nested card); lot title; **bid amount as a highlight** when the kind carries one; secondary facts (close / start). Omit the image when none exists (`SC-29`, `SC-30`). Image may link to the listing URL |
| Primary CTA | **View lot** → listing URL on that brand. Outbid uses **Bid again** |
| Footer | Why they received the letter; brand legal footer |
| Stop watching | **Stop watching this lot** on the same line after the why-you-got-this sentence → signed-in unwatch surface, only when `canUnsubscribe` is true |

## Copy

English draft for the auction letter catalog. Placeholders use `{…}`. Amounts
and times follow `money-amounts` and `dates-and-times`.

### Bidding opens in 24 hours

- **Stop watching:** yes

| Field | Draft |
| --- | --- |
| Subject | Bidding opens tomorrow: {lotTitle} |
| Preheader | Starts {startsAt}. Be ready to bid. |
| Heading | Bidding opens in 24 hours |
| Body | The lot you are watching opens for bids soon. |
| Lot facts | Starts {startsAt} |
| Footer why | You receive this because you are watching this lot. Stop watching this lot |

### Bidding has opened

- **Stop watching:** yes

| Field | Draft |
| --- | --- |
| Subject | Bidding is open: {lotTitle} |
| Preheader | Place a bid while the lot is live. |
| Heading | Bidding has opened |
| Body | The lot you are watching is now open for bids. |
| Lot facts | Open now. Closes {scheduledClosesAt} |
| Footer why | You receive this because you are watching this lot. Stop watching this lot |

### Bidding closes in 24 hours

- **Stop watching:** only if watcher who never bid

| Field | Draft |
| --- | --- |
| Subject | Closes in 24 hours: {lotTitle} |
| Preheader | Scheduled close {scheduledClosesAt}. The close can still move. |
| Heading | Bidding closes in 24 hours |
| Body | This lot’s scheduled close is about a day away. If bidding extends, the close may move later. You will get a separate notice when extended bidding starts. |
| Highlight | Current bid {currentBid} |
| Lot facts | Scheduled close {scheduledClosesAt} |
| Footer why | You receive this because you are watching or have bid on this lot. Stop watching this lot (watcher who never bid only) |

### Extended bidding has started

- **Stop watching:** only if watcher who never bid

| Field | Draft |
| --- | --- |
| Subject | Extended bidding: {lotTitle} |
| Preheader | The close has moved. Current close {effectiveClosesAt}. |
| Heading | Extended bidding has started |
| Body | A late bid moved this lot’s close. Bidding continues until no further bid lands in the extension window. |
| Highlight | Current bid {currentBid} |
| Lot facts | Current close {effectiveClosesAt} |
| Footer why | You receive this because you are watching or have bid on this lot. Stop watching this lot (watcher who never bid only) |

### New bid on a lot you bid on

- **Stop watching:** no

| Field | Draft |
| --- | --- |
| Subject | New bid on {lotTitle} |
| Preheader | Leading bid is now {currentBid}. |
| Heading | A lot you bid on received a new bid |
| Body | Someone else bid on this lot. |
| Highlight | Leading bid {currentBid} |
| Lot facts | Closes {effectiveClosesAt} |
| Footer why | You receive this because you have bid on this lot. |

### You have been outbid

- **Stop watching:** no

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
| Footer why | You receive this because you have bid on this lot. |

Do not print the reader's own prior amount unless the template supplied it
(`grade10-site-auction-notifications` letter-shape requirement). Never print
the reader's maximum in mail.

## States

An email has no interaction states. What varies between one send and the next
is content, and each variation is tied to the scenario that defines it.

| Variation | Scenario |
| --- | --- |
| A lot whose close has moved past its scheduled close | `grade10-site-auction-notifications-SC-08` — the warning states the scheduled close |
| Start letter, listing + start instant, unsubscribe | `grade10-site-auction-notifications-SC-05`, `grade10-site-auction-notifications-SC-19` |
| Has-started letter, unsubscribe | `grade10-site-auction-notifications-SC-07` |
| Close-in-24h letter; unsubscribe only if they never bid | `grade10-site-auction-notifications-SC-08`; `grade10-site-auction-notifications-SC-03` for a participant who unwatched |
| Extended-bidding letter; unsubscribe only if they never bid | `grade10-site-auction-notifications-SC-09` |
| Outbid letter, own amount + new lead, no unsubscribe | `grade10-site-auction-notifications-SC-12`, `grade10-site-auction-notifications-SC-20` |
| New-bid letter, listing, no unsubscribe | `grade10-site-auction-notifications-SC-11` |
| Same chrome on two kinds | `grade10-site-auction-notifications-SC-18` |
| Lot block with one primary image | `grade10-site-auction-notifications-SC-29` |
| Lot block without an image | `grade10-site-auction-notifications-SC-30` |
| A recipient enrolled by both watching and bidding | `grade10-site-auction-notifications-SC-02` — one message |
| The send log filtered to one collector | `grade10-site-auction-notifications-SC-26` |
| A log row for a sent message | `grade10-site-auction-notifications-SC-25` — type, email, listing, Sent At; no body |
| No letter | `grade10-site-auction-notifications-SC-04`, `grade10-site-auction-notifications-SC-15`, `grade10-site-auction-notifications-SC-23`, `grade10-site-auction-notifications-SC-27`, `grade10-site-auction-notifications-SC-28`, `grade10-site-auction-notifications-SC-31` |

Every message states the lot it concerns. None recommends another lot, per the
proposal's non-goal on marketing mail.
