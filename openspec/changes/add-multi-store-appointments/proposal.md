# Multi-store appointments for every brand

**Author:** @brianchacha6969 - 2026-09-05

## Why

A collector who wants a card graded, vaulted or financed has to be in a shop
with a member of staff, at a desk that is free. Today the only way onto a
shop's diary is through a vault case: the appointment service knows shops, a
weekly opening pattern and a headcount per rule, and nothing else.

- **Grading has no way in.** A collector with a card to grade cannot book
  anything: the diary only accepts a booking that names a vault case, and no
  customer procedure exists at all. Walk-ins queue, or are turned away.
- **A shop is one undifferentiated headcount.** A grading desk, a valuation
  room and a signing iPad are three rooms with three diaries, and the service
  holds one capacity number per rule. Two collectors booked "at 14:00" may
  both need the one signing room.
- **Availability is opening hours and nothing more.** No lead time before a
  booking, no horizon after which a shop stops taking them, no gap between
  visits to reset a desk, no way to close one room for an afternoon without
  closing the shop. Operators work around it in a spreadsheet.
- **Nobody is told anything.** A booking sends no confirmation, no reminder
  and no calendar invite, so the no-show rate is whatever it happens to be.
- **The second brand cannot use it.** The service is bound to the vault by
  construction, and ZZZ, which runs no vault, has no diary to book into.

**Metric:** share of in-store visits that arrive on a booking rather than as a
walk-in, read per service and per shop, beside the no-show rate the booking
outcomes already produce.

## What Changes

- **Services are what a collector books.** A service names what the visit is
  for, how long it takes, the pause before and after it, how far ahead it can
  be booked, the notice it needs, the questions it asks, and whether a
  collector may book it directly or only a product may. Grading is a
  customer-bookable service; the vault visit is a product-bound one.
- **Resources are what a booking occupies.** A shop holds desks, rooms and
  devices; a service names which of them it can run on; a booking takes one.
  A shop's capacity for a service at an instant is how many of those
  resources are free, never a number typed on a rule.
- **Availability is a derivation with edges.** Opening rules per shop and, when
  a resource keeps its own hours, per resource; special dates that close a
  day or run it on other hours; blocks that close a resource or a whole shop
  for a span; minimum notice; a booking horizon; buffers between visits. A
  slot exists only when every one of those agrees.
- **Collectors book without an account.** A public booking surface walks
  service, shop, day, time and details, confirms by email with a calendar
  file, and hands the collector a private link to reschedule or cancel. A
  signed-in collector also sees every booking made under their address.
- **The anonymous write passes a gate.** No account behind the public booking
  surface means no rate limit an account would otherwise carry, so the write
  passes a challenge and a per-address budget before anything is written.
- **Operators run the diary from the console.** Services, shops, resources,
  opening rules, special dates and blocks; a shop's day laid out by resource;
  a booking made, moved, cancelled and closed out on behalf of a walk-in or a
  phone call. Every write is an elevated, audited action.
- **A booking tells its owner what happened.** Confirmation, reschedule and
  cancellation mails carry a calendar file; a reminder goes out ahead of the
  visit at the lead the service sets.
- **Products keep their seat, by service.** A product that owns a case books
  the same diary over its binding, naming the service, and its bookings show
  in the console beside everybody else's. **BREAKING**: every product booking
  now names a service, so the vault's visit booking carries one.
- **A shared booking surface for every brand.** The customer flow is a set of
  components in the shared UI package, with copy and state supplied by the
  brand that renders it, so ZZZ books into its own shops with the same
  screens.

## Non-Goals

- **Payment at booking.** No deposit, no card hold, no paid service. A
  service is free to book; what the visit costs is settled in the shop.
- **Staff rosters.** A resource is a desk or a room, never a person, and no
  requirement ties a booking to who is on shift.
- **Group bookings and events.** One booking is one visit for one collector.
- **Round-robin across shops.** A collector chooses the shop; the service
  never moves a booking between shops on its own.
- **Third-party calendar sync.** A calendar file is attached to every mail;
  no requirement reads or writes an external calendar.
- **SMS and push.** Email is the only channel this change builds; a booking
  with no address is reachable through the console alone.
- **Public availability of product-bound services.** A vault visit is booked
  from the vault, as today; the public surface lists only what a collector may
  book directly.
- **A ZZZ product integration.** ZZZ renders the shared surface against its
  own diary; no ZZZ product books over a binding.

## Capabilities

### New Capabilities

- `shared/appointment/scheduling` — the diary every brand and every product
  is held to: services, shops, resources, opening rules, special dates,
  blocks, how a slot is derived, how a booking takes a resource, the booking
  lifecycle, what a product binding may ask, and what every booking mail
  carries.
- `grade10-site/appointment/booking` — the collector's side: booking a
  customer-bookable service without an account, the confirmation, the private
  link to move or cancel, the reminder, and a signed-in collector's own list.
- `grade10-admin/appointment/diary` — the operator's side: setting up
  services, shops, resources and hours; closing a day, a room or a span;
  reading a shop's day by resource; booking, moving, cancelling and closing
  out a visit on a collector's behalf; and the audit every write leaves.
- `shared/ui/appointment-booking` — the shared component set the booking
  surface composes, which every brand's site imports rather than builds.

### Modified Capabilities

None. The vault's visit booking is described in the application repository,
not in a durable spec here; the `serviceId` it gains is recorded under Impact.

## Impact

- **The appointment service** — new tables for services, resources, blocks,
  booking events and a per-shop booking lock; a reshaped booking row carrying
  the attendee, the answers and its source; a public tier for the customer
  procedures beside the existing elevated one; an email port and a reminder
  sweep; erasure that anonymizes direct bookings as well as product ones.
- **The vault** — every visit booking names the vault visit service, over the
  binding and in both its consoles.
- **The grade10 site** — three public addresses under `/book`, prerendered and
  localized like every other public surface.
- **The admin console** — the Appointments section grows services, resources,
  blocks, a resource-lane day view, a bookings list and operator booking.
- **The shared packages** — a new `@grade10/ui` block set, an `appointment`
  namespace in every shared catalog, and head entries for the three new
  surfaces in every brand catalog.
- **No domain suite exists** for `grade10-site/appointment` or
  `grade10-admin/appointment`, so this change carries none. No domain impact:
  both domains are new.

## Open questions

- ❓ **Whether a customer-bookable service should ask for a phone number.** The
  spec makes it optional; a shop that calls collectors the morning of a visit
  may want it required. *Owner: Operations.*
- ❓ **How long the reminder lead should default to.** The spec seeds one day;
  a same-day grading drop-off may want an hour. *Owner: Product.*
- ❓ **Whether a collector may hold more than one live booking for one service.**
  The spec refuses a second live booking on the same service for the same
  address, so a collector grading two cards books one visit. *Owner: Product.*
