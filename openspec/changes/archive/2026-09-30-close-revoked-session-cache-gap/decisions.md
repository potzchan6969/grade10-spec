## Goals

- An admin's revoke, ban, or role change reaches an ordinary read of that
  account's session within 70 seconds everywhere — not only a mutation or an
  elevated call, and not after the cookie cache's five minutes.
- Every account an admin action has not just touched keeps the existing
  five-minute cached read, at the existing cost.
- The code finally does what `shared/auth/sessions` and `shared/auth/users`
  already say, closing the gap between that flat requirement and the
  architecture docs' accepted browse-read lag.

## Non-Goals

- **Account deletion.** It shares the same stale-browse-read mechanism, but
  it is not written down as a `shared/auth` capability today — closing it
  here would be inventing a requirement to fit an engineering fix rather
  than the other way round. A follow-on change specifies it first.
- **The cache's lifetime for anyone else.** The five-minute `maxAge`, and the
  browse/mutation split itself, stay as `docs/architecture/edge-cache.md` and
  `security.md` already describe them; only what happens to the one account
  an admin action just touched changes.
- **Sign-out from another device.** That is `shared/auth/sign-out`.
- **Natural session lifetime.** `shared/auth/session`'s own open ❓ on how
  long a session lasts on its own is unrelated to an admin ending one early.
- **Faster than the session store propagates.** Closing everywhere in under
  a minute means moving sessions off edge KV (Q5).

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is a five-minute browse-read lag after revoke/ban a bug (restoring settled behavior) or a change? | Change — `shared/auth/sessions` and `shared/auth/users` state the closing flat, with no carve-out, but `docs/architecture/edge-cache.md` and `security.md` (grade10) document the same lag as accepted for browse reads; two settled sources disagree, which the store's own bug/change rule reads as a change. | Bug fix — dropped once the architecture docs' deliberate carve-out surfaced; a bug fix restores settled behavior, and here two sources settled opposite things. |
| Q2 | Close the browse-read gap outright, or keep it and correct `SC-04`/the ban requirement to name the lag the architecture already accepts? | Close it outright — recommended and taken: mutations and elevated calls already read fresh, so the exposure was narrow, but the spec already promises no carve-out at all, and leaving a written promise unmet is worse than paying the extra read. | Correct the spec to name the accepted lag — the cheaper option, dropped because it downgrades an existing flat guarantee rather than delivering it. |
| Q3 | Cover only the two reported actions (revoke, ban), or also role changes and account deletion, which share the same cache-staleness mechanism? | Revoke, ban, and role changes — recommended and taken: the same per-user version check covers all three at roughly the cost of covering one. | Revoke and ban only — dropped because excluding role changes would have meant maintaining two nearly-identical invalidation paths for no real savings. Account deletion is excluded for a different reason: see Non-Goals. |
| Q4 | The blind pass raised it: does a read already in flight when a revoke/ban/role-change commits count as "the next read" that must reflect it? | Superseded by Q5 — the requirement is now a time bound, which a read already in flight falls inside of by construction. | "The next read that starts after the write commits" — the round's first answer, dropped once Q5 showed no location but the one that made the change can promise the next read. |
| Q5 | Code review raised it: the session store is edge KV, which can serve an old value at another location for up to 60 seconds, and the admin and the person are usually at different locations. Promise the next read, or name the window? | Name it and bound it (@sean): every location stops treating the session as it was within 70 seconds — the store's documented 60-second propagation plus a 10-second margin. | Promise the next read — dropped: no location but the one that made the change can keep it. Moving the invalidation signal to Postgres — dropped: revalidation still reads the session itself from KV, so a location that sees the new signal first can re-cache stale data under it. Moving sessions off KV — dropped as a re-architecture of auth, not this change's to make. |

| Q6 | The blind pass raised it: which reads count as an ordinary cached read, and which as an elevated call or a mutation? | Decided by the round — the requirement names the outcome for every read; which endpoints take which path is `docs/architecture/security.md`'s and the code's, not the spec's. | Enumerating endpoints in the requirement — dropped: it would make an endpoint added tomorrow a spec change. |
| Q7 | The blind pass raised it: how is "every other account keeps its cached read" verified, when a black-box read answers the same either way? | Decided by the round — below the black box: the version helper's unit test that a bump for one account leaves another's version alone. | A black-box case — dropped: no signed-in or signed-out answer distinguishes an untouched cache from a needlessly revalidated one. |
| Q8 | The blind pass raised it: is the closing keyed per session or per account, and does it change what a sibling session sees? | Decided by the round — per account (`tech-design.md`); a sibling session revalidates once and still answers signed in, which `shared-auth-sessions-SC-09` asserts. | Per session — dropped in `tech-design.md` as a second key per session for no observable difference. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/auth/sessions | Does a read already in flight when the revoke commits count as the next read? | Q4 |
| shared/auth/sessions | Which reads are cached browse reads, and which are elevated calls or mutations? | Q6 |
| shared/auth/users | Which reads are cached browse reads, and which are elevated calls or mutations? | Q6 |
| shared/auth/sessions | How is it verified that an account nobody acted on keeps its cached read? | Q7 |
| shared/auth/users | How is it verified that an account nobody acted on keeps its cached read? | Q7 |
| shared/auth/sessions | Is the closing keyed per session or per account, and what does a sibling session see? | Q8 |
