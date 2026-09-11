---
title: Roles & Permissions
spec: grade10-admin/console/roles-and-permissions
order: 2
reviewed: 2026-09-11
---

What each closed role may do, and what each permission means, shown to
operators from the shipped mapping — never edited from the console.

- **Roles tab** — one matrix: every permission as a row; every closed role
  including `user` as a column (Allowed / Not allowed); elevated roles marked
  (every closed role except `user`)
- **Permissions tab** — every permission with id, description, the closed
  roles that hold it, and the elevated APIs that ask for it; filter by
  resource and by API path prefix (matched prefix highlighted)
- **Deep link** — `/roles-and-permissions?role=<id>` opens the Roles tab with
  that role's column highlighted
- **Sidebar** — production entry directly under Users; `admin` only (gated on
  `user:set-role`)
- **Read-only** — no control creates a role or changes what a role grants;
  who holds a role stays on [Users](/p/shared/console/user-directory)

## Accuracy

- **Derived** — one committed JSON view generated from `@grade10/auth-contracts`
  (`ROLES`, `ROLE_PERMISSIONS`, vocabulary, descriptions)
- **APIs** — procedure names on the Permissions tab come from the committed
  `@grade10/api-docs` documents
- **Checked** — `pnpm run test:backend` regenerates the view in memory and
  fails when the committed file disagrees, naming the first differing key
- **Not the Users dialog** — assigning roles and the short grant summary on
  that dialog stay where they are

## Role chips on Users

When Grade10 supplies a per-role address (only for sessions that may open
this page), each role name in a Users row links to that role's column here.
Sessions, edit-roles, ban, and delete stay as they are. See
[User Directory](/p/shared/console/user-directory).

:::detail{title="Product decisions" for="pm"}
An admin granting roles, or a QA reviewer designing access-boundary cases,
had one place that enforces what a role may do — reviewed code — and no
console surface that shows it. This page is that lens.

| User | Job |
| --- | --- |
| Admin | Compare what `staff` can do that `support` cannot, without opening source |
| QA reviewer | Cite the page's role and permission views when writing access-boundary cases |

| Measure | Reading |
| --- | --- |
| Comparison answered from the page alone | A reviewer names the differing grants without opening authorization source |

Non-goals:

- **Not editing grants** — the mapping stays in code
- **Not custom roles** — closed set only
- **Not ZZZ** — Grade10 console only
:::
