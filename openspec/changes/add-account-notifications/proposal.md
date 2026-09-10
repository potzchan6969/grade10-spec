**Author:** @mason5991 - 2026-09-08

Product context: [Auction notifications](../../../docs/prds/products/grade10-auction/notifications.md).
Depends on watching a listing (`grade10-site/auction/watchlist`): progress
mail fires when a collector watches a lot **with email alerts on**.
Watching is list membership; alerts are a separate preference.

## Why

A Grade10 lot closes on a deadline that moves. The extension rule pushes the
close back for every late bid, so the one thing a collector cannot do is plan
to be there at the end. Today the platform tells them nothing: not when
bidding opens on a lot they came back to twice, not when the close is a day
away, not when someone has taken the lead from them. A collector who is outbid
finds out by returning to the page, and most do not return.

That is a bid the lot never receives, from a collector who had already
committed money to it. Being outbid is the single strongest signal of intent
the auction produces, and the platform currently discards it.

The rest of the product already assumes this mail exists. `money-amounts`
specifies how an amount is rendered in "an outbid or lot-won email", and
`dates-and-times` requires a close shown in an auction email to name its zone
and to match the page. The contracts were written for messages nobody sends.

**Metric:** the share of outbid collectors who return and bid again within the
lot's remaining window. **Noise cap:** new-bid letters per bidder per listing
stay near one per sweep pass during an extension, not one per increment.
**Acceptance signal:** a collector who is outbid overnight returns and raises
their maximum before the lot closes.

This change absorbs [`add-auction-notifications`](../archive/2026-09-09-add-auction-notifications/proposal.md)
(archived without folding into durable specs). It is the single in-flight
plan for that product, including mute. Permanent scenario ids under
`grade10-site/auction/notifications` live here.

## What Changes

- **Six auction emails**, to the collector's registered account email:
  bidding opens in 24 hours, bidding has opened, bidding closes in 24 hours,
  extended bidding has started, a lot you bid on received a new bid, and you
  have been outbid.
- **Two audiences.** Progress mail goes to collectors watching the lot with
  email alerts on; bid-activity mail goes to collectors who have bid with
  alerts on. Closing warning and extended bidding also reach bidders with
  alerts on. Bidding enrols bid-activity mail without watching.
- **A collector receives a lot's mail once**, however many reasons they have
  to receive it. A collector who both watches and bids is one recipient.
- **Mail follows the sale, not the clock.** Because the close moves, "closes
  in 24 hours" is measured against the scheduled close, and extended bidding
  announces itself when it begins. A snipe war produces one new-bid letter
  about the current lead, not one per increment.
- **One letter shape** for every auction email: subject, preheader,
  heading, body, lot block with one primary image when available,
  listing action, footer. Brand mark opens the storefront home. Letters
  offer **Manage alerts** → **My Auctions**
  so a collector can mute email alerts for that lot (not unwatch). Signed
  out, Grade10's existing sign-in flow runs first, then My Auctions.
  Outbound links carry UTM campaign tags (`utm_source=email`,
  `utm_medium=auction_notification`, kind as `utm_campaign`, control as
  `utm_content`).
- **Per-lot email alerts** default on when watching or bidding; mute stops
  mail without removing the watch or ending the bid. Unwatch turns alerts
  off. An account-level auction email alerts master can stop all auction
  mail without clearing watches or bids.
- **My Auctions** carries per-row Email alerts (and Unwatch on Watching);
  Account → Notifications holds the auction email alerts master. This
  change's `ui-design.md` is the mute UI source (replacing the My Auctions
  alerts surface previously drawn under the watchlist plan). Mute behaviour
  scenarios stay on `grade10-site/auction/watchlist`.
- **A temporary provider failure is retried; a permanent one stops.** A
  statement that has become false is not sent late.
- **Nothing is sent about a lot that was called off** before the collector
  could act on the message.
- **Operators have a send log** of type, recipient email, listing, and Sent
  At — no bodies — filterable by the collector's email.
- **English copy this change** — letters and any prepared catalog strings
  render English only; account-locale selection stays wired off until a
  follow-on turns it on.

## Non-Goals

- **In-app notification center, shell badge, or channel prefs UI** this
  change. In-app delivery is treated as always on for a later center;
  ❓ in-app toggler and global email/in-app channel toggles are deferred.
- **Device push, WhatsApp, or SMS.** Device push kind names may join the
  shared vocabulary so a follow-on does not rename them; push is not
  delivered here.
- **Migrating order / invoice mail** onto `mail_logs` — order letters keep
  `auction_order_notification_*` until that work is specified.
- **Marketing mail** — recommended lots, auction round-ups, re-engagement.
- **Mail about invoicing or shipping** beyond the auction letter kinds
  already on this spine. After-the-close order mail stays out until that
  work is specified.
- **Telling a collector they are about to be outbid**, or that their maximum
  is nearly exhausted.
- **A digest.** One event, one message — coalescing several increments of
  the same new-bid event is not a digest.
- **Localised mail this change.** Catalogs may be prepared; sends stay
  English until locale enablement ships (❓ localization owner).
- **One-click unsubscribe.** The destination is a signed-in page.
- **ZZZ site or ZZZ admin** — ❓ deferred (multi-brand owner).
- **Store worker / store DB** for this delivery — Auction owns emit, send
  log, and mute prefs storage used by fanout.

## Capabilities

### New Capabilities

- `grade10-site/auction/notifications`: which auction emails Grade10 sends,
  what each one fires on, who receives it, how a collector is enrolled,
  mute and account master, what suppresses a message, the shared letter
  shape, send failure, and the operator send log.

### Modified Capabilities

None. `grade10-site/auction/watchlist` (in-flight) supplies watching and the
mute scenarios this change's UI and fanout read.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10/auction` | Emits the six events. Owns enrolment, mute fields, send log. |
| `@grade10/auction-contracts` | Gains the notification events. Additive. |
| `@grade10/email` | Renders and talks to the provider. Classifies temporary vs permanent send failure. Does not own the log. |
| `@grade10/i18n` | May gain English catalog keys for the six kinds; locale selection stays off this change. |
| `apps/admin/grade10` | Send log: type, recipient email, listing (from metadata), provider reference/status, Sent At; filter by user email; no bodies. |
| `apps/frontend/grade10` | My Auctions Email alerts + Unwatch; Account → Notifications auction email alerts master; letter **Manage alerts** → My Auctions (sign-in first when signed out). |
| Store worker | No change. |
| ZZZ | Out of scope this change. |

**Ordering.** Watching with alerts must exist before progress mail can be
verified. Independent of `add-auction-auto-bidding`, though outbid mail is
more useful once a collector has a maximum to raise.

## Open questions

- ❓ **Locale enablement** — when to turn on account-locale rendering for the
  six kinds (localization owner).
- ❓ **Eight-kind migration** — when bid-state / ending-soon join this spine
  (auction notifications owner).
- ❓ **In-app center and toggles** — inbox, shell badge, in-app toggler,
  global channel toggles (account notifications owner).
- ❓ **ZZZ assembly** — same six messages under ZZZ identity (multi-brand
  owner).
- ❓ **Retention / erasure** for `mail_logs` and mute prefs (privacy /
  account-data owner).
