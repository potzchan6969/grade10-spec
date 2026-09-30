---
title: Collector Page
spec: grade10-admin/console/collector-page
order: 4
---

One console page per collector: who they are, and what the shop holds or
handles for them, one section per product.

## The Page

- 🚧 **Address** - `admin.grade10.com/collectors/<user id>`, opened from a
  collector's name wherever the console shows one
- 🚧 **Who** - `vault:read` opens it: staff, treasurers and admins
- 🚧 **Header** - the account's name and email for staff and admins, behind
  `kyc:read`; a treasurer reads the contact the collector's cases hold, and
  no name
- 🚧 **Vault cases** - every case the collector holds, with its reference,
  item, status and lane, newest-touched first, each opening its case
- 🚧 **One section at a time** - a section the operator may not read, or one
  that fails to load, says so on its own and leaves the rest of the page
- 🚧 **On the audit chain** - each opening records who read which collector,
  the way a search does

:::detail{title="Product decisions" for="pm"}
Staff piece a customer together from the queue, the held items and the
identity panel, one case at a time. The owner asked for one page per
collector, drawn by the designer, with a first version built before it.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A page per collector | Decided | One console page gathers what the shop holds for one person, reached from their name | Owner |
| A first version on console blocks | Decided | The designer draws the page; a first version composed of the console's own blocks ships before it and gives way to it | Owner |
| A name, not a directory | Decided | The page opens from a name the console already shows; it adds no search, and nobody is found by name | Owner |
| Names behind the identity grant | Decided | The header shows the account's name and email under `kyc:read`, the grant the queue's owner names sit behind; a treasurer reads the contact the cases hold | Owner |
| Sections stand alone | Decided | Each section reads on its own grant and fails on its own, so a fault in one product never blanks the page | Product |
:::
