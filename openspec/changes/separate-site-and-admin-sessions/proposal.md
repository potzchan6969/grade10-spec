**Author:** @sean - 2026-10-06

## Why

An operator who signs in on the site is signed in to the admin console, and the other way round, because both read one session cookie on the brand's domain. A shopper's session therefore carries console authority the moment their account holds a role, and an unattended site tab leaves the console open. The metric that moves is the count of console requests accepted on a session the console did not itself create: it falls to zero.

## What Changes

- **BREAKING** The admin console holds a session of its own. Signing in on the site no longer signs the person in to the console, and signing in to the console no longer signs them in on the site. This reverses the rule that one sign-in covers every site of a brand.
- **BREAKING** Operators sign in to the console once more at release; the console stops honouring the site's session. Customer sessions are untouched.
- Sign-out on one surface leaves the other signed in.
- A sign-in link signs in the surface that asked for it; "already signed in as someone else" is judged on that surface alone.
- The second factor and the recent sign-in an operator action asks for are measured on the console's own session. A site sign-in never counts.
- The session list names each session's surface, and ending every session of an account, like a ban, ends both.
- Applies to both brands.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/auth/session`: sign-in no longer covers every site of the brand; the console holds its own session, and an open tab follows only its own surface's session.
- `shared/auth/sign-in`: a link signs in the surface that asked for it, and the different-account check reads that surface.
- `shared/auth/sign-out`: signing out ends the surface's own session only.
- `shared/auth/sessions`: the list names the surface, and ending every session ends both.

## Impact

- Auth worker session handling and cookie naming, the site and console auth clients, and the backends' session reads, for both brands.
- Every console request carries the console's session, so the backends' elevated procedures read it and refuse the site's.
- Existing console sessions end at release.

## Open Questions

None. A second customer site on a brand would sign in on its own under this change; that is a consequence recorded in `decisions.md`, not a question.

## References

- [Session · Two Sessions](../../../docs/prds/products/shared/auth/session.md#two-sessions)
- [Sign-In](../../../docs/prds/products/shared/auth/sign-in.md)
- [Sign-Out](../../../docs/prds/products/shared/auth/sign-out.md)
- [Sessions · Revoke](../../../docs/prds/products/shared/auth/sessions.md#revoke)
- [Accounts · Collector Half](../../../docs/prds/products/shared/auth/index.md#collector-half)
