---
title: Scheduling
spec: shared/appointment/scheduling
order: 1
---

How a bookable moment comes to exist, how a booking takes it, and what
happens to it afterwards. Every brand's diary and every product booking a
visit obey these rules.

- **Service** — what is booked: length, buffers before and after, minimum
  notice, booking horizon, increment between starts, questions, reminder
  lead, and whether a collector may book it directly or only a product may
- **Shop** — a place with one time zone; every wall-clock rule is read in it
- **Resource** — a desk, room or device; a booking occupies exactly one, and a
  shop's capacity for a service is its free assigned resources
- **Hours** — weekly rules per shop, and per resource where one keeps its own;
  a special date closes a day or runs it on other hours; a block closes a
  span with a reason
- **Slot** — derived when asked: starts on the service's increment, inside a
  window the whole visit fits, not sooner than the notice, not later than the
  horizon, on a resource nobody else occupies once buffers are counted

:::flow{title="Booking a visit"}
## Refuse what has written nothing
An unknown or retired service or shop, a service with no resource at that
shop, a start in the past, an unanswered required question, a choice outside
its options.
## Replay or refuse the identity
The same identity, service, shop and start answers with the booking it
already holds. The same identity and service at another time is refused
while that booking is live.
## Take the shop's lock
Every booking at one shop is written one at a time.
## Derive the slot again
Under the lock, from the rules, the blocks and the live occupations, for the
one instant asked for.
## Assign a resource
The named one, or the free assigned resource with the lowest sort order.
None free is full.
## Write it
The booking, its occupation, and its first event.
:::

## Booking states

| State | Live | Means |
| --- | --- | --- |
| `booked` | yes | The visit is expected; the resource is held |
| `cancelled` | no | Called off; the resource is free |
| `completed` | no | The visit happened |
| `no_show` | no | Nobody came |

A move keeps the booking, its attendee and its answers, and judges the target
exactly as a new booking. A closed booking refuses every further move,
cancellation or outcome, and repeating the same cancellation or outcome
answers the booking unchanged.

## Notifications

A booking with an address gets a confirmation, an update when it moves, a
cancellation, and one reminder at the service's lead, each with a calendar
file naming the service, the shop, its address, the start and the end in the
shop's zone. A booking without an address is told nothing.

## Erasure

A person's bookings lose the person, keep the occupancy: the shop, the
resource, the start, the state and the events stay; the name, address,
phone, notes and answers go, and the manage link stops answering.

:::detail{title="Design guarantees" for="engineer"}
Two guarantees carry the design. **Availability is derived, never stored**:
one pure derivation, parameterized by the clock, serves the public picker,
the operator's day view and the booking processor, which runs it again under
the shop's lock for the one instant it was asked for. **An occupation is an
interval the database refuses to overlap**: every live booking stores the
span it occupies on its resource, buffers included, and an exclusion
constraint makes two live occupations on one resource unwritable whatever
path wrote them.

The daylight-saving decisions are unchanged and made once, in the contracts
package: a wall clock the spring-forward gap swallowed drops the slot, and
on fall back the earlier reading wins. The manage secret travels in the
address fragment and is stored as a hash; the procedures that take it are
mutations, so it never sits in a query string.
:::
