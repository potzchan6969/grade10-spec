---
title: Collector Page
spec: grade10-admin/console/collector-page
order: 4
---

One console page per collector: who they are, and what the shop holds or
handles for them, one section per product.

## Sections

- **URL** - `admin.grade10.com/vault/collectors/<user id>`, under the
  Vault entry in the nav, opened from a collector's name on the queue and
  held items, and from **The collector's cases** in a case's header, which
  any `vault:read` holder sees
- **Who** - `vault:read` opens it: staff, treasurers and admins
- **Header** - the account's name and email for staff and admins, under
  the grant [Operator Console](/p/grade10-site/vault/operator-console#permissions)
  names; a treasurer reads the collector's short id and no name, and the
  contact stays on each case
- **Vault cases** - every case the collector holds, with its reference,
  item, status and lane, newest-touched first, each opening its case
- **Items** - every item the collector owns but a retired one, marked by
  a place or not, under `inventory:read` -
  [Items](/p/grade10-admin/inventory/items#owners)
- **Sections stand alone** - a section the operator may not read, or that
  fails to load, shows its own refusal or error; the other sections still
  load
- **On the audit chain** - each opening records who read which collector,
  the way a search does

:::detail{title="Product decisions" for="pm"}
Staff read a customer's cases one at a time, in three places: the queue,
the held items and the identity panel. The owner asked for one page per
collector, drawn by the designer, with a first version built before it.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A page per collector | Decided | One console page gathers what the shop holds for one person, reached from their name | Owner |
| A first version on console blocks | Decided | The designer draws the page; a first version composed of the console's own blocks ships before it and is replaced by it | Owner |
| Sections stand alone | Decided | Each section reads on its own grant and fails on its own, so a fault in one product never blanks the page | Product |
| Where it sits in the nav | Decided | Under Vault, at `/vault/collectors/<user id>`: the console marks every page under a nav entry, and the vault's queue already finds a collector by exact email, phone or reference | Engineering |
:::
