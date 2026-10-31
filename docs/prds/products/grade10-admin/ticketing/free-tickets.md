---
title: Free Tickets
order: 5
---

Tickets at no charge for press, sponsors, crew and guests, given on the
event's Free tickets tab. Each is a real ticket: one QR code that admits at
the door like a paid one.

| Rule | Value |
| --- | --- |
| 🚧 Tickets in one batch | 1 to 200 |
| 🚧 Fast Pass days on each | None up to the days its pass admits; included on VIP |

## Giving Free Tickets

- 🚧 **Make codes to share** — the pass, how many, Fast Pass days, a label
  only staff see such as "Press, [Outlet]", a reason, and guest names if
  known, matched to the tickets in order. No email. One batch is one order
  at no charge, and each ticket gets its own QR code and its own private
  link that opens that one ticket
- 🚧 **Email them** — the pass, how many, Fast Pass days, the guest's name
  and email, and a reason; an order at no charge, marked Issued by staff,
  mailed with its PDF. It counts toward that email's limit
- 🚧 **Who** — staff holding `ticketing:manage`
- 🚧 **Audited** — each batch, order, rename, replacement and cancellation,
  with its reason

## Sharing a Batch

- 🚧 **Each ticket** — copy its link, download its QR code or its PDF, or
  share it from a phone
- 🚧 **The whole batch** — one PDF with a page per ticket, the QR codes in a
  zip, or the links as a CSV
- 🚧 **Tracking** — each ticket shows not opened, opened, saved to an
  account, or let in at the door, and the batch sums them
- 🚧 **Rename** — the guest's name, which prints on the ticket
- 🚧 **Replace code** — a new QR code and link for the same ticket; the old
  ones stop working at once
- 🚧 **Cancel ticket** — the door turns the code away as refunded or
  cancelled, and the link says the ticket was cancelled

## The Guest's Link

- 🚧 **The link is the ticket** — anyone holding it can use it, once each
  day its pass covers, like a printed ticket; staff send each link to one
  guest
- 🚧 **The page** — the event, the pass, the guest's name, Fast Pass and the
  QR code, with Download PDF; no account needed —
  [Your Tickets](/p/grade10-site/ticketing/your-tickets#a-shared-free-ticket)
- 🚧 **Save to My Tickets** — a guest who signs in keeps it on their
  account; the link keeps working after
- 🚧 **Private** — the page sends no referrer, is never cached or indexed,
  and loads no third-party script

:::detail{title="Product decisions" for="pm"}
Staff give tickets to people whose email they don't have, or who will get
the ticket from someone else: a sponsor's allocation, a radio giveaway, the
crew. A ticket they can forward as a link or a picture fits how those
tickets travel, and the console still knows each one. Out of scope: a
guest's points, and free tickets beyond what a pass admits.

| Measure | Counts |
| --- | --- |
| Free tickets used | Free tickets let in, against free tickets given |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Codes with no email | Decided | A batch made to share holds no email, so it counts toward nobody's limit, and staff hand out the links themselves. | Product |
| The link is the ticket | Decided | One link opens one ticket; a leaked link is fixed with Replace code, not with a sign-in the guest would have to make. | Product |
| Saved tickets | Decided | Saving to My Tickets keeps the link working, since the QR code is the same either way. Decided 2026-10-30. | Product |
| Free tickets earn nothing | Decided | No points, and they count in Sold at HKD 0.00. | Product |
| No grant of its own | Decided | Giving free tickets needs only `ticketing:manage`, the grant that shapes the event; each batch is audited with its reason. Decided 2026-10-30. | Product |
:::
