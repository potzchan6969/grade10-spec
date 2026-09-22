**Author:** @seankcw - 2026-09-22

## Why

A collector who asks for a sign-in link on one device and completes sign-in
on another is left staring at a stale **Check Your Email** wait on the
first — nothing tells that surface the address already signed in, so its
Resend countdown keeps running toward a link nobody needs. Firing that
Resend then hands them a second, redundant session for an account they are
already signed into elsewhere. Measured on the share of sign-in-link resends
that fire after the requesting address already holds a live session
elsewhere — a number this change should drive to zero.

## What Changes

- The surface showing the sign-in dialog learns, without a reload, when its
  address completes sign-in anywhere else — by the emailed link or by any
  other offered method — and closes its own wait with a message that
  sign-in completed on another device, instead of continuing to count down
  toward a resend nobody needs.
- That check is scoped to the requesting surface's own flow, never a bare
  email address, so naming an address elsewhere cannot be used to learn
  whether it currently holds a session.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `shared/auth/sign-in`: a surface showing the sign-in dialog stops waiting
  once its address's sign-in completes elsewhere, without that surface
  gaining a session of its own.

## Impact

- `grade10` repo: no mechanism for this exists today. The only "learn about
  a session elsewhere" path (`packages/grade10-auth/contracts/src/sessionAnnounce.ts`)
  rides better-auth's own same-origin `BroadcastChannel` and cannot reach a
  second device. This change needs a new, flow-scoped way for a client to
  learn its own request settled (poll or push — `tech-design.md`'s call),
  plus a backend check keyed on the flow's own secret rather than the
  address.
- `@grade10/ui`'s sign-in block gains a new terminal state and message for
  "settled elsewhere"; the trigger stays application-owned, since the block
  does no data fetching of its own — its capability spec remains the export
  contract this change extends.
- No change to the signed-in-mismatch toast (SC-63–69), the resend cap, or
  the link's five-minute lifetime.

## References

- [Sign-In · Following the Link](../../../docs/prds/products/shared/auth/sign-in.md#following-the-link)
