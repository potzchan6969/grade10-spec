# Decisions — shared-auth-audit

## Goals

- Trusted-product creates that mint a user id, verify flips, delete, and
  second-factor enable / disable / recovery regenerate land on the identity
  trail.
- The Audit section filters, sorts, names the subject, and jumps to a chain
  break without email or hashes.

## Non-goals

- Mixpanel Signed In / Signed Out / Account Created.
- Datadog counts and chain-sweep scheduling.
- Collector sign-in or sign-out on the identity trail.
- Export, live tail, or email search on the trail.

## Decided

| # | Decision | Choice | Why |
| --- | --- | --- | --- |
| Q1 | Who is the actor on a trusted-product create or verify? | The system (`actorId: "system"`) | AUTH_SERVICE has no operator session; genesis already uses that pair |
| Q2 | What makes a create row? | A new `users.id` with outcome `created` | An already-existed find with no data change is not a write |
| Q3 | Enable record vs enrollment start | Enable is the factor first going live; enrollment start is not | The binding is what matters for takeover |
| Q4 | Fail-closed when enable cannot append | Factor stays active; later proof writes the missing enable | Reversing the factor fights the authenticator already bound |
| Q5 | Email on the trail or Audit filters | Never | `audit:read` must not learn an address the directory withholds |
| Q6 | Directory link from a trail id | Link only for a directory person the operator can open; `system` and prefixed machine ids stay text; subject links only when type is `user` | Shipped in #307 — a vault case or till session is not a Users row |

## Raised

None.
