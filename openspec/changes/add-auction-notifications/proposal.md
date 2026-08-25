# Auction email notifications

**Author:** @jeffffej0909 - 2026-08-24

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).
Depends on [`add-auction-watchlist`](../add-auction-watchlist/proposal.md):
the before-and-during-auction mail fires on a watch, which does not exist yet.

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
lot's remaining window. **Acceptance signal:** a collector who is outbid
overnight returns and raises their maximum before the lot closes.

## What Changes

- **Six auction emails**, to the collector's registered account email:
  bidding opens in 24 hours, bidding has opened, bidding closes in 24 hours,
  extended bidding has started, a lot you bid on received a new bid, and you
  have been outbid.
- **Two audiences.** The first four go to collectors watching the lot; the
  last two go to collectors who have bid on it. Bidding on a lot enrols the
  collector in its bid-activity mail without watching it.
- **A collector receives a lot's mail once**, however many reasons they have
  to receive it. A collector who both watches and bids is one recipient.
- **Mail follows the sale, not the clock.** Because the close moves, "closes
  in 24 hours" is measured against the scheduled close, and extended bidding
  announces itself when it begins.
- **Nothing is sent about a lot that was called off** before the collector
  could act on the message.
- **Amounts and times follow the platform's existing rules.** English money in
  a sent message; every close names its zone and matches the page.
- **Operators have a send log** of type, recipient email, listing, and Sent
  At — no bodies — filterable by the collector's email.

## Non-Goals

- **In-app, push, WhatsApp, or SMS notification.** Email only. The source
  document mentions an in-app notification and then states every notification
  is delivered by email; this change specifies the email.
- **Notification preferences or per-lot muting.** Everything here is
  transactional mail about a lot the collector chose to engage with.
  Preferences are a change of their own, and need a settings surface.
- **Marketing mail** — recommended lots, auction round-ups, re-engagement.
- **Mail about winning, losing, paying, invoicing, or shipping.** The
  after-the-close flow is deliberately out of scope until the orders and
  invoices work is specified.
- **Telling a collector they are about to be outbid**, or that their maximum
  is nearly exhausted.
- **A digest.** One event, one message.
- **Localised mail.** Sent messages are English today, per `money-amounts`.

## Capabilities

### New Capabilities

- `grade10-auction/notifications`: which auction emails Grade10 sends, what
  each one fires on, who receives it, how a collector is enrolled, what
  suppresses a message, and the operator send log.

### Modified Capabilities

None. `grade10-auction/watchlist` supplies the watch this change reads; it is
a separate in-flight change and is not modified here.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10/auction` | Emits the six events. Owns which collectors are enrolled on a lot. |
| `@grade10/auction-contracts` | Gains the notification events. Additive. |
| Email sending service | Renders and sends. Owns the send log. Not the auction service and not the store service. See `design.md`. |
| `@grade10/i18n` | **No change.** Sent messages are English; nothing enters the locale catalogs. |
| `apps/admin/grade10` | A send log showing type, recipient email, listing, and Sent At, filterable by user email. No message bodies. |

**Ordering.** `add-auction-watchlist` must land first. Independent of
`add-auction-proxy-bidding`, though the outbid mail becomes considerably more
useful once a collector has a maximum to raise.
