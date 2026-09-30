**Author:** @brianchacha6969 - 2026-09-30

## Why

A customer who walks in with an item and no request on their phone cannot be
served: the console opens no case, so staff talk them through the site's
wizard at the counter. Once cases exist, staff cannot say whose they are - the
queue and the held items show a case reference and a contact, never a name -
and nothing gathers one collector's cases in one place.

**Metric:** share of cases opened at the counter that the customer confirms
the same day, and the time staff take to find one collector's cases. Neither
can be read today, because neither act exists.

## What Changes

- **Staff open a case for a walk-in** - the customer's email and name, the
  item and staff's own photos; the case opens as submitted under the
  customer's own account, created unsigned where there is none, and nothing
  is emailed. **BREAKING** for the rule that the console opens no case
- **An address someone has signed into is refused by name** - that customer
  sends the request from their own phone, with staff beside them, because a
  typed address proves nothing about a proven account
- **The collector confirms the case on their own phone** - they sign in, read
  the request and staff's photos back, and tick the collection statement; the
  valuation and every email wait for it, so a mistyped address reaches
  nobody, and staff cancel it and open another
- **Owners by name** - queue and held-item rows name the owner by the
  account's name for staff and admins, behind the identity grant; a treasurer
  keeps the reference and the contact. Supersedes `complete-vault-collector-flow`
  Q111 for these two lists
- **One owner's cases** - a name narrows the queue and the held items to that
  owner; nobody is searched by name
- **A page per collector** - the console's `/collectors/<user id>`: the
  account's name and email, and every vault case they hold; a first version
  on the console's own blocks until the designer's page lands

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/console/collector-page`: one page per collector in the
  Grade10 console - its address, who opens it, the header and the vault cases
  section, each section read and refused on its own

### Modified Capabilities

- `grade10-admin/vault/operator-queue`: the walk-in intake replacing "The
  console opens no case of its own"; owner names on the queue and held items;
  the owner filter; the grants table, where the identity read covers owner
  names and the operate grant opens a walk-in
- `grade10-site/vault/case-intake`: a case staff opened, confirmed by its
  collector with the collection-statement tick
- `grade10-site/vault/case-lifecycle`: the valuation waits for the
  confirmation; a mistyped walk-in is cancelled silently
- `grade10-site/vault/collector-notifications`: no message on a case staff
  opened until its collector confirms it
- `shared/ui/vault-case`: the confirmation card the case page composes, a new
  export beside `VaultAcceptOfferDialog`; the capability is new in
  `complete-vault-collector-flow`, so its delta follows that change's
  publication

## Impact

- **Auth workers** - `grade10-auth` and `zzz-auth`: `createUnverifiedAccount`
  takes the name staff type and applies it only to an account it creates;
  `accountsByUserIds` answers the owner names, at most 100 ids a call
- **Vault worker** - `packages/vault/backend`: the walk-in act, the
  confirmation on the customer router, the guard on starting the valuation and
  on every letter, owner names by case ids under the identity grant, the owner
  filter, and one collector's cases
- **Console** - `packages/vault/admin-frontend`: the walk-in form, the owner
  column and filter on the queue and held items; the collector page in
  `apps/admin/grade10`
- **Collector SPA** - `packages/vault/frontend`: the confirmation on the case
  page, rendered by `apps/frontend/grade10`
- **Contracts** - `packages/vault/contracts`: the grants map gains the walk-in
  and owner-name reads
- **This store** - `packages/ui` gains the confirmation card and
  `packages/i18n` its words; a submodule bump carries both

## Follow-on changes

- The collector page gains the items a collector owns and their grading
  submissions
- A link from the Users panel to the collector page
- A customer who has signed in before served at the counter without their
  phone

## Open questions

- **Legal** - when the walk-in customer reads the collection statement, a ❓
  row in [Operator Console](../../../docs/prds/products/grade10-site/vault/operator-console.md)'s
  decisions
- **Product** - what ends a walk-in nobody confirms, a ❓ row in
  [Case Lifecycle](../../../docs/prds/products/grade10-site/vault/case-lifecycle.md)'s
  decisions
- **Design** - the counter's form, the confirmation card and the collector
  page have no board yet; `ui-design.md` waits on them

## References

- [Operator Console · Queue](../../../docs/prds/products/grade10-site/vault/operator-console.md#queue)
- [Collector Pages · Case page](../../../docs/prds/products/grade10-site/vault/collector-pages.md#case-page)
- [Case Lifecycle · Exits](../../../docs/prds/products/grade10-site/vault/case-lifecycle.md#exits)
- [Collector Page · The Page](../../../docs/prds/products/grade10-admin/console/collector-page.md#the-page)
