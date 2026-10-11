---
title: Diary
spec: grade10-admin/appointment/diary
order: 1
---

The Appointments section of the admin console: what an operator sets up, what
they read, and what they do for a collector at the counter.

- **Services** — create, edit, retire; its questions; whether a booking must
  carry a phone number; payment at booking and its refunds; its reminders and
  after-visit mail; the resources it runs on, per shop
- **Shops** — create, edit, retire; each with its resources, weekly hours with
  breaks, special dates and public holidays; a day's hours copy to other days,
  a week's to other shops; a preview shows the times a collector would see
- **Resources** — a shop's desks, rooms and devices; each may keep its own hours
- **Blocks** — a resource or a whole shop closed from one instant to another,
  with the reason on record
- **Day** — one shop's day, one lane per resource, every booking and block in
  its lane, on the shop's clock
- **Bookings** — every booking across shops, narrowed by shop, service, state
  and date, searched by name or email

## At the counter

- **Book** — a customer-bookable service for a collector who walked in or
  called: shop, time, the desk if it matters, a name, an email if they have
  one, the service's answers
- **Move and cancel** — a direct booking, from the day or the list; a cancel
  confirms first
- **Close out** — completed, or a no-show
- **Product bookings** — shown with their product and case, read-only; the
  vault moves its own visits
- ❓ **Front desk** - The Day on today checks visitors in, keeps Waiting and calls the next person to a free counter; [Front Desk](/p/grade10-admin/appointment/front-desk)

## Permissions

- **Read** — `appointment:read` sees every shop, service, day and booking and
  renders no write control
- **Manage** — `appointment:manage` writes; every write runs on a fresh
  session and lands one entry in the audit chain

:::detail{title="Product decisions" for="pm"}
Capacity is a set of named resources rather than a number, because two
collectors booked at the same minute may need the one signing room; the
resource is what the diary can promise.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Capacity | Decided | Resources, assigned per service; a rule carries no seat count. | Product |
| Blocks over bookings | Decided | A block never cancels a booking already inside it; the operator sees both. | Operations |
| Product visits | Decided | Read-only here; moved from the product that owns the case. | Product |
| Hours | Decided | Up to four windows a day, so a lunch break closes the shop; a counter follows the shop's hours or keeps its own. | Operations |
| Public holidays | Decided | Hong Kong's general holidays load per year; each is closed, has special hours or opens as usual, per shop. | Operations |
| Messages | Decided | Every booking moment mails the collector through one sink; email is the only channel, and WhatsApp joins it later without a change to what triggers a message. Walk-ins get none. | Product |
| Staff rosters | Decided | Out of scope; a resource is a desk or a room, never a person. | Product |
| Source | ❓ Open | Booked by reads as the source: Online, Staff or Walk-in. | Product |
| Insights | ❓ Open | A tab beside Bookings: booked share, missed, walk-in wait and walk-ins lost, with one busy-hours chart. | Operations |
| Service editor | ❓ Open | One page per service in English and 繁中, adding the hold, walk-ins and what to bring. | Product |
| Staff booking | ❓ Open | Staff book any start from now, up to a year ahead; the notice and the horizon are the collector's. | Operations |
:::
