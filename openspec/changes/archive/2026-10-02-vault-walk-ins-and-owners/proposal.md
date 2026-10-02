**Author:** @brianchacha6969 - 2026-09-30

## Why

A customer who walks in with an item and no request on their phone cannot be
served: the console opens no case, so staff talk them through the site's
wizard at the counter. Once cases exist, staff cannot say whose they are - the
queue and the held items show a case reference, never a name -
and nothing gathers one collector's cases in one place.

**Metric:** share of staff-opened drafts the customer sends the same day; the
time to find one collector's cases, read by observing the counter.

## What Changes

- **Staff open a draft for a walk-in** - the customer's email, the item and
  staff's own photos, and no name; the case opens as a draft under the
  customer's own account, or an account nobody has signed in to yet where
  there is none, which reads by its email handle until the customer names
  themselves; nothing is emailed. **BREAKING** for the rule that the console
  opens no case
- **An address signed in to before** - it is refused when the address
  belongs to an account someone has signed in to; that customer sends the
  request from their own phone, with staff beside them, because a typed
  address does not prove the account is theirs
- **The collector sends it from their own phone** - the draft is on their
  list; the wizard's check-and-send step reads it back and takes the
  statement tick; nothing is valued or emailed before
- **Collectors by name** - queue and held-item rows name the collector by the
  account's name for staff and admins, behind the identity grant; a treasurer
  reads the rows as today, with no collector column. Supersedes
  `complete-vault-collector-flow` Q111 for these two lists
- **One collector's cases** - a name narrows the queue and the held items to
  that collector; nobody is searched by name
- **A page per collector** - the console's `/vault/collectors/<user id>`,
  under the Vault entry, reached from the queue's exact email, phone or case
  reference search: the account's name and email, and every vault case they
  hold; a first version on the console's own blocks until the designer's
  page lands

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/console/collector-page`: one page per collector in the
  Grade10 console - its URL, who opens it, the header and the vault cases
  section, each section read and refused on its own

### Modified Capabilities

- `grade10-admin/vault/operator-queue`: the walk-in intake replacing "The
  console opens no case of its own"; collector names on the queue and held
  items; the collector filter; the grants table, where the identity read
  covers collector names and the operate grant opens a walk-in
- `grade10-site/vault/case-intake`: a draft staff opened under the
  collector's account, sent by the collector with the wizard's third step; a
  photograph removed from any unsent draft of the collector's own
- `grade10-site/vault/case-lifecycle`: a draft staff opened ends on the
  **7-day** draft clock or a cancel, silently; a mistyped walk-in is cancelled
  and opened again, and the account at the wrong address keeps nothing of
  it
- `grade10-site/vault/collector-notifications`: no email on a staff-opened
  draft's expiry or cancel
- `grade10-site/vault/retention-and-erasure`: a removed walk-in purged as an
  unsigned case, the collector's own actor ids rewritten as an erasure's

## Impact

- **Auth workers** - `grade10-auth` and `zzz-auth` do not change: the walk-in
  creates an account with `createUnverifiedAccount` as it stands, and
  `accountsByUserIds` answers the collector names, at most 100 ids a call
- **Vault worker** - `packages/vault/backend`: the walk-in act opening a
  draft, the silent expiry of a draft staff opened, and its cancel, which
  removes the draft and every photograph on it from the account; collector
  names by case ids under the identity grant, the collector filter, one
  collector's cases, each read that names a collector on the audit chain,
  and a collector's removal of a photograph from their unsent draft
- **Worker ladder** - `packages/worker`: `auditWhen`, so a read records its
  chain row only when it names or narrows to a collector
- **Console** - `packages/vault/admin-frontend`: the walk-in form, the
  collector column and filter on the queue and held items; the collector page
  in `apps/admin/grade10`
- **Collector SPA** - `packages/vault/frontend`: the list's line for a draft
  staff opened, rendered by `apps/frontend/grade10`
- **Contracts** - `packages/vault/contracts`: the grants map gains the walk-in
  and collector-name reads
- **This store** - `packages/i18n` gains that line's words; a submodule bump
  carries them

## Follow-on changes

- The collector page's items section - `add-item-registry`; its grading
  submissions
- A link from the Users panel to the collector page
- A customer who has signed in before served at the counter without their
  phone

No domain impact: `grade10-site/vault` has no `domain-tcs.md`, and the one
path across its capabilities this change adds - a draft staff opened, sent or
cancelled - starts at the console's walk-in, so the change's walk carries it
end to end. No product impact: `grade10-admin/product-tcs.md` traces no vault
or console journey this change touches. No platform impact: no
`platform-tcs.md` exists.

## Open questions

- **Legal** - the collection statement's text, which the walk-in open and
  the send both wait on in production; the form is built without waiting
- **Design** - the counter's form, the collector column and filter, and the
  collector page have no board yet - [Q27](decisions.md#decisions)
- **Legal** - until that text lands, the walk-in is dark in production

## References

- [Operator Console · Queue](../../../docs/prds/products/grade10-site/vault/operator-console.md#queue)
- [Collector Pages · Case page](../../../docs/prds/products/grade10-site/vault/collector-pages.md#case-page)
- [Case Lifecycle · Exits](../../../docs/prds/products/grade10-site/vault/case-lifecycle.md#exits)
- [Collector Page · Sections](../../../docs/prds/products/grade10-admin/console/collector-page.md#sections)
- [Operator Console · Permissions](../../../docs/prds/products/grade10-site/vault/operator-console.md#permissions)
- [Case Lifecycle · Timers](../../../docs/prds/products/grade10-site/vault/case-lifecycle.md#timers)
- [Compliance and Readiness · Before the First Production Case](../../../docs/prds/products/grade10-site/vault/compliance-and-readiness.md#before-the-first-production-case)
