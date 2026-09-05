## User journeys

### grade10-admin-appointment-diary-US-01: Operator opens a shop for bookings

**As an** operator running a shop,
**I want** to set up the shop, its desks and rooms, its hours and the services each can take,
**so that** collectors book into the capacity the shop actually has.

**Accepted by:**

- `grade10-admin-appointment-diary-SC-01` — A new shop offers its first slot
- `grade10-admin-appointment-diary-SC-02` — A shop with no assigned resource lists nothing
- `grade10-admin-appointment-diary-SC-03` — Retiring a shop keeps its day readable
- `grade10-admin-appointment-diary-SC-04` — A service is created with its shape
- `grade10-admin-appointment-diary-SC-05` — Resources are assigned per shop
- `grade10-admin-appointment-diary-SC-06` — A service is retired
- `grade10-admin-appointment-diary-SC-07` — Questions are added in order
- `grade10-admin-appointment-diary-SC-08` — A weekly rule is set
- `grade10-admin-appointment-diary-SC-09` — A date is closed
- `grade10-admin-appointment-diary-SC-10` — A date runs on other hours
- `grade10-admin-appointment-diary-SC-11` — A resource keeps its own hours
- `grade10-admin-appointment-diary-SC-27` — The read grant sees and cannot write
- `grade10-admin-appointment-diary-SC-28` — Every write lands an audit entry

### grade10-admin-appointment-diary-US-02: Operator runs a shop's day from the diary

**As an** operator on the shop floor,
**I want** to read the day by desk and room, close one when it cannot be used, and record who came,
**so that** the diary matches what is happening in the shop.

**Accepted by:**

- `grade10-admin-appointment-diary-SC-12` — A resource is blocked with a reason
- `grade10-admin-appointment-diary-SC-13` — The whole shop is blocked
- `grade10-admin-appointment-diary-SC-14` — A block is removed
- `grade10-admin-appointment-diary-SC-15` — The day lays out lanes
- `grade10-admin-appointment-diary-SC-16` — A product booking is read-only
- `grade10-admin-appointment-diary-SC-17` — The operator steps between days
- `grade10-admin-appointment-diary-SC-23` — A visit is marked completed
- `grade10-admin-appointment-diary-SC-24` — A visit is marked a no-show
- `grade10-admin-appointment-diary-SC-25` — A closed booking offers no action

### grade10-admin-appointment-diary-US-03: Operator books a visit for a collector at the counter

**As an** operator at the counter,
**I want** to book, move or cancel a visit for a collector who walked in or called,
**so that** a collector without the site in front of them still gets a desk that is expecting them.

**Accepted by:**

- `grade10-admin-appointment-diary-SC-18` — A walk-in is booked at the counter
- `grade10-admin-appointment-diary-SC-19` — The operator names the desk
- `grade10-admin-appointment-diary-SC-20` — A direct booking is moved
- `grade10-admin-appointment-diary-SC-21` — A direct booking is cancelled after confirmation
- `grade10-admin-appointment-diary-SC-22` — A full time is refused by name
- `grade10-admin-appointment-diary-SC-26` — The list narrows and searches
