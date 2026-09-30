## Goals

- An admin's revoke, ban, or role change acts on the very next read anyone
  makes against that account's session — not only a mutation or an elevated
  call.
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

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is a five-minute browse-read lag after revoke/ban a bug (restoring settled behavior) or a change? | Change — `shared/auth/sessions` and `shared/auth/users` state the closing flat, with no carve-out, but `docs/architecture/edge-cache.md` and `security.md` (grade10) document the same lag as accepted for browse reads; two settled sources disagree, which the store's own bug/change rule reads as a change. | Bug fix — dropped once the architecture docs' deliberate carve-out surfaced; a bug fix restores settled behavior, and here two sources settled opposite things. |
| Q2 | Close the browse-read gap outright, or keep it and correct `SC-04`/the ban requirement to name the lag the architecture already accepts? | Close it outright — recommended and taken: mutations and elevated calls already read fresh, so the exposure was narrow, but the spec already promises no carve-out at all, and leaving a written promise unmet is worse than paying the extra read. | Correct the spec to name the accepted lag — the cheaper option, dropped because it downgrades an existing flat guarantee rather than delivering it. |
| Q3 | Cover only the two reported actions (revoke, ban), or also role changes and account deletion, which share the same cache-staleness mechanism? | Revoke, ban, and role changes — recommended and taken: the same per-user version check covers all three at roughly the cost of covering one. | Revoke and ban only — dropped because excluding role changes would have meant maintaining two nearly-identical invalidation paths for no real savings. Account deletion is excluded for a different reason: see Non-Goals. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
