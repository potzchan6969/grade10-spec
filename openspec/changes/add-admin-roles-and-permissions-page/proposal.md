**Author:** @rita-liu - 2026-09-08

## Why

Operators and QA need one admin surface that shows what each role can and
cannot do. Today that answer lives only in authorization source (or a short
summary on the Users roles dialog).

**Metric:** answer “what can `staff` do that `support` cannot?” from the page
alone.

## What Changes

- **Roles & Permissions page** — production nav under Users; `admin` only
  (`user:set-role`); read-only.
- **Roles tab** — permission × role matrix (including `user`); Allowed / Not
  allowed; elevated roles marked.
- **Permissions tab** — id, description, closed roles that hold each grant,
  elevated APIs that ask for it.
- **Derived view** — from shipped vocabulary + role map; drift fails
  `test:backend` until regenerated; API names from committed procedure docs.
- **Users chips** — optional per-role links into the matrix; CTAs unchanged.

Mapping-review CI and elevated-grant census live in
`harden-roles-mapping-review` (separate change / PR).

## Non-Goals

- Changing grants, roles, or vocabulary; editing them from the UI; custom roles.
- ZZZ admin page; replacing the Users roles dialog summary.
- CI human-review gate or elevated-grant census (see
  `harden-roles-mapping-review`).

## Capabilities

### New

- `grade10-admin/console/roles-and-permissions` — the page.

### Modified

- `shared/console/user-directory` — optional per-role chip hrefs.

## Impact

- **grade10:** page, nav, derived JSON + drift, chip wiring.
- **grade10-spec:** console manual page; deltas above.
- No runtime authorization change; no ZZZ page.
