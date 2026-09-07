---
title: Diary
spec: grade10-admin/appointment/diary
order: 1
---

The Appointments section of the admin console: what an operator sets up, what
they read, and what they do for a collector at the counter.

- **Services** — create, edit, retire; its questions; the resources it runs on,
  per shop
- **Shops** — create, edit, retire; each with its resources, weekly rules and
  special dates
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
| Staff rosters | Decided | Out of scope; a resource is a desk or a room, never a person. | Product |
:::
