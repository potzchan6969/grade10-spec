# Design: unify sign-out feedback

## Context

Requirements: [`specs/shared-auth/sign-out/spec.md`](specs/shared-auth/sign-out/spec.md).

The `grade10` repo's auth frontend package (`@grade10/auth-frontend`) already
holds the shared sign-in slice behind a structural client port that each
app's better-auth client satisfies at its composition root
(`react-clean-architecture` skill in that repo). Sign-out sat outside it:
nine hand-rolled handlers calling the better-auth client directly, one of
which read the error envelope. Session *reads* stay on better-auth's
`useSession` atom by that repo's own doctrine.

This change was designed and implemented in one session on a `grade10`
branch; this document records the decisions and their rejected alternatives
for the reviewer and the record.

## Decisions

### A presentation hook, not a domain use case

`useSignOut` lives in a `features/session/sign-out` slice as a hook alone —
the mutation shape (`run` + `pending` + `failed`) over `useState`, resolving
the session client port straight off the auth core tokens. Nothing new loads
into the container.

- **Rejected: full slice (use case + repository).** The repo's two-blessed-
  depths rule reserves a use case for an invariant. Sign-out has none; an
  `execute()` here could only forward, and the sign-in slice already
  deliberately dropped equivalent ritual files (`models/`, `mappers/`).
- **Rejected: leave per-app handlers.** That is the drifted status quo the
  spec's "never silent" requirement exists to kill.
- **Rejected: TanStack Query mutation.** No server state to cache or
  invalidate, and the auth demo mounts no `QueryClientProvider` — the same
  delta the sign-in slice records.

### Widen the existing session client port

The auth package's client port gains the sign-out call (answering the same
`{ error }` envelope as the sign-in calls); its fixture gains the matching
call record and refusal queue. The port keeps its name.

- **Rejected: a second port and core module for sign-out.** The same
  better-auth client satisfies both; a second binding is ritual.
- **Rejected: renaming the port to a session client.** Cosmetic churn across
  four composition roots and every test; the port's drift-catching job is
  unchanged. Recorded as accepted debt in the proposal's non-goals.

### The hook reports; the surface decides what follows

`run()` resolves a boolean. Success-side effects stay app-owned — the
grade10 site navigates to marketing, the storefront's profile page clears
the cart — so the shared command carries no navigation or product coupling.
Failure renders inline beside each control from the hook's `failed` flag.

- **Rejected: success/failure callbacks on the hook.** A resolved boolean is
  the same power with less surface.
- **Rejected: centralized toast.** No toast system exists in the admin
  panels; inline text next to the control is where the person is looking.

## Risks / Trade-offs

- A port named for sign-in now carries sign-out. Accepted; noted above.
- The busy state relies on the control's own loading affordance; a surface
  that forgets to pass `pending` regresses silently. The shared hook keeps
  the logic right, but wiring stays per-surface — the spec scenarios are the
  check.

## Migration Plan

None. Internal to the `grade10` repo; no data, no API, no published package.

## Open Questions

None.
