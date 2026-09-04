## Context

`shared/auth/roles` already lists every permission string products may check.
Auction catalogue authorship sits on `auction:catalog` while store authorship
sits on `store:write`. The rename is already implemented in grade10; this
change records the requirement and the delivery shape.

## Decisions

### Rename the grant string; do not reshape who holds it

The durable roles requirement already governs which role holds which grant.
This change only renames the auction catalogue grant to `auction:write` so it
shares the `*:write` stem with `store:write`. Staff still holds it; support,
treasurer, and auditor still do not.

**Rejected:** keep `auction:catalog` and document the asymmetry — every new
operator grant would re-teach the split.
**Rejected:** merge catalogue work into `auction:operate` — the service still
grades floor work apart from cover authorship, and collapsing them would
widen staff's floor grant rather than rename it.
**Rejected:** introduce both names during a deprecation window — permissions
are a closed vocabulary checked at compile time; one string is enough.

### No migration of stored roles

Roles are data; grants are code. Nobody stores `auction:catalog` on a user
row, so the rename is a vocabulary and call-site edit with no database step.

### Leave archived OpenSpec changes alone

Archives are the wording a change shipped under. Updating them rewrites
history; the durable spec and the live PRD are the records that move.

## Risks / Trade-offs

- **Breakage for anything that still asserts `auction:catalog`.** Mitigated by
  a repo-wide rename in grade10 (contracts, routers, admin gates, tests)
  landing with the vocabulary change.
- **Operator docs that still say `auction:catalog`.** The listing-management
  PRD callout is updated in the same change.

## Open Questions

None — the rename target and scope were fixed before planning.
