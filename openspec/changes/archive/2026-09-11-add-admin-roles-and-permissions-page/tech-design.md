## Context

See `proposal.md`. Deltas:
`grade10-admin/console/roles-and-permissions`,
`shared/console/user-directory`.

RBAC CI harness is `harden-roles-mapping-review`.

Source of truth: `@grade10/auth-contracts`. Honesty pattern: generate → commit
→ drift in `test:backend` (same as api-docs). No live RBAC endpoint.

## Goals / Non-Goals

**Goals:** committed roles view; admin-only page under Users; chip deep-links.

**Non-Goals:** mutating grants in UI; ZZZ page; mapping-review CI / elevated
census (other change).

## Decisions

### Descriptions + committed view

- Descriptions in auth-contracts; census refuses missing/extra keys.
- Generate → `generated/roles-and-permissions.json`. Drift in `test:backend`
  (SC-11 / SC-12).
- Page static-imports the JSON; Permissions tab joins `@grade10/api-docs`.

_Rejected:_ live `ROLE_PERMISSIONS` in the admin bundle; hand-maintained copy.

### Page shape

| Choice        | Land                                                     |
| ------------- | -------------------------------------------------------- |
| Matrix        | Permission rows × every closed role column               |
| Elevated mark | From `ADMIN_ROLES` (`user` unmarked)                     |
| Deep link     | `/roles-and-permissions?role=<id>`                       |
| Access        | `user:set-role` (admin only); chips only with that grant |
| Home          | `apps/admin/grade10/src/pages/roles-and-permissions/`    |

### `UserTable` `roleHrefs`

Optional per-role hrefs; CTAs unchanged. ZZZ omits hrefs.

## Risks / Trade-offs

- [Spec vs code closed-set drift] → view follows auth-contracts.
- [Committed JSON diffs on every grant edit] → same as api-docs `generated/`.

## Migration Plan

1. Descriptions + generate + drift.
2. `UserTable` `roleHrefs`.
3. Section + page + Users wiring.
4. Manual; archive last.

## Open Questions

None.
