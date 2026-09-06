---
title: Book a Visit
spec: grade10-site/appointment/booking
order: 1
---

A collector books a visit to a shop without an account, in five picks, and
leaves holding a link that manages it.

- **Service** — every customer-bookable service, with its length
- **Shop** — the shops offering it, with their addresses
- **Day** — a month calendar marking the days with something free, no further
  than the service's horizon
- **Time** — the day's offered starts, in the shop's zone with the zone named
- **Details** — name, email, a phone number if they wish, the service's
  questions, notes
- **URL**
  1. `grade10.com/book` — the flow
  2. `grade10.com/book?service=<slug>` — the flow opened at one service
  3. `grade10.com/book/manage#<secret>` — one booking, from the link in the mail
  4. `grade10.com/book/mine` — every visit under a signed-in collector's address

## After booking

- **Confirmation** — what was booked, where, when, and the manage link; the
  same arrives by mail with a calendar file
- **Manage link** — moves the visit through the same day and time picks, or
  cancels it after a confirmation; a closed visit shows its state and offers
  nothing
- **Secret** — travels in the address fragment, so no server log holds it,
  and reaches the diary only inside the booking's own reads and writes
- **Reminder** — once, ahead of the visit, at the lead the service sets
- **One live visit per service** — booking the same service twice under one
  address is told about the visit already held

## What it looks like

::story{id="appointment-booking-bookingslotpicker--default" title="Picking a day and a time"}

::story{id="appointment-booking-bookingdetailsform--default" title="The details step"}

::story{id="appointment-booking-bookingconfirmation--default" title="The confirmation"}

:::detail{title="Product decisions" for="pm"}
A visit is booked by the person who will turn up, not by an account, because
the first thing a new collector does with Grade10 is bring a card in. The
account comes later, and the diary finds their visits by the address they
gave.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Account | Decided | None needed; a name and an email book a visit. | Product |
| Time zone shown | Decided | The shop's, named; the visit is physical. | Product |
| Second visit, same service | Decided | Refused while one is live; a collector with two cards books one visit. | Product |
| Phone number | ❓ Open | Optional today; a shop that calls the morning of a visit may want it required. | Operations |
| Reminder lead | ❓ Open | One day by default; a same-day drop-off may want an hour. | Product |
| Payment at booking | Decided | None; what the visit costs is settled in the shop. | Product |
| Anonymous write | Decided | A challenge plus a per-address budget of ten asks a day. A booking holds a desk and sends mail on nobody's authority, and the two brakes answer different questions: whether a person is there at all, and how much one address may spend however convincingly it asks. | Product |
:::
