---
title: Appointments
---

The appointment service is a diary and nothing more. It knows shops, when each
one is open, how many people it can see at once, and who has taken which seat.
It deliberately does not know what the appointment is *for*: a product that runs
cases hands it a case reference, and the diary answers with slots and bookings.

Two audiences, and only one of them touches it. **Operators** run the diary from
the Appointments section of the admin console — open and retire shops, set the
weekly opening rules, close a day or run it differently, read one shop's day.
**Customers** never reach it: they book from the vault's own pages, and the
vault relays the request over a service binding. The worker has no public tier
and no customer procedure at all.

Two ideas carry the design. **Availability is rules, never stored slots** — a
year of five-minute slots across a dozen shops is millions of rows to regenerate
every time an opening time moves, so slots are derived on read from the weekly
rules, the exceptions for that date, and what is already booked. And **a slot
claim is a lock row, not a record**, so two people reaching for the last seat at
the same instant resolve against the database rather than against luck.

Nothing is ever deleted. A shop is retired rather than removed, because old
bookings still name it, and a weekly rule can be closed by setting its capacity
to zero without losing the window it describes.

:::flow{title="Booking a visit"}
## The product asks
The vault calls `book` over its own service binding, naming the case, the shop
and the slot start. Everything after this happens inside one transaction.
## Have we been here before?
A case that already holds a live booking for the same shop and slot gets that
booking back. A different one refuses. This is judged before the clock is, so a
retry that crosses its own slot boundary still replays instead of failing.
## Is the slot real?
A slot in the past, an unknown shop or a retired one refuses here — the last
refusal that has written nothing.
## Take the lock
The schedule is derived again and the slot's claim row is created and locked. A
claim row only ever exists for a slot the diary actually offers, so a mistyped
timestamp cannot grow the table.
## Count the seats under the lock
The schedule is derived once more and live bookings are counted. Full, or no
longer offered, refuses here.
## Write it
The booking lands. A case holds exactly one live booking at a time, and may
book again once that one has closed.
:::

A booking ends up `booked`, `cancelled`, `completed` or `no_show`, and only
`booked` is live. Rescheduling holds both claim rows at once, in a fixed order,
so two reschedules swapping the same pair of slots cannot deadlock each other.

:::callout{kind="decision"}
There is no operator action that books, moves or cancels a visit. Every booking
mutation belongs to the product that owns the case and arrives over the service
binding — the diary holds seats, the product holds the reason for them.
:::

:::callout{kind="note"}
No spec covers the diary. Nothing in the store describes shops, weekly rules,
exceptions, derived slots, the claim-row lock or the booking lifecycle — the
design is written down in the application repository and in the code's own
comments, which are unusually explicit about the reasoning.
:::

:::detail{title="For engineers" for="engineer"}
`packages/appointment/` in the application repository, deployed as
`grade10-appointment-service`. Every tRPC procedure is elevated and operator
only; the customer path is RPC over a service binding, minted by a class factory
so the deployment decides which products exist. Today that is exactly one, the
vault. Finance is allowed by the vocabulary and has no entrypoint.

The structural guarantee is a composite foreign key from `bookings
(location_id, slot_start)` to `slot_claims`, which makes *counted the seats
without holding the lock* unwritable. Refusals travel as data rather than as
throws, because an exception crossing a service binding loses its class.

Two daylight-saving decisions are made once, in the contracts package: a wall
clock the spring-forward gap swallowed drops the slot, and on fall back the
earlier reading wins, so a day's slot starts stay strictly increasing. The
hourly sweep retries parked deletion holds, walks the auth worker's deletion
log, then reclaims stale claim rows — in that order, deliberately. Erasure
anonymizes rather than deletes: the seat taken at 14:00 last Tuesday is the
shop's record of its own day.

Background:
[the vault](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md)
from the consumer's side,
[cross-service edges](https://github.com/9gag/grade10/blob/main/docs/architecture/cross-service.md)
for the binding, and
[account data](https://github.com/9gag/grade10/blob/main/docs/architecture/account-data.md)
for erasure.
:::
