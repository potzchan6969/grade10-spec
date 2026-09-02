**Author:** @seankcw - 2026-08-19

## Why

Nine surfaces across the two brands carry a sign-out button — the grade10
site's profile, the zzz storefront's profile, and both admin panels' settings,
users, store, and no-access pages — and each hand-rolled its own handler.
They drifted: only the grade10 site's profile read the auth service's answer;
everywhere else a refused or failed sign-out silently reset the button and
left the person signed in with nothing said. On a shared or public machine
that silence is a real exposure — an operator who saw the spinner stop
reasonably believes the session ended. The drift is the evidence: the same
three-line handler existed in nine copies and only one of them was right.

If this works, no sign-out tap dead-ends silently: every tap ends in a
signed-out surface or a visible, retryable failure, and repeated same-session
sign-out taps (the dead-end retry signal) fall to noise.

## What Changes

- Sign-out becomes one shared session command in the auth frontend package of
  the `grade10` repo, beside the sign-in slice every surface already mounts.
- Every sign-out control gets the same three states: idle, busy while the
  request runs, and a visible inline failure that leaves the person signed in
  and invites a retry.
- Surface-specific after-effects (the grade10 site returning to the marketing
  page, the storefront clearing its cart) stay with the surface; the command
  only reports the outcome they chain on.

## Capabilities

- **New Capabilities:**
  - `shared/auth/sign-out`: the sign-out contract every signed-in surface
    shares — one new product directory, `shared-auth`, for cross-product
    session behavior (add its bullet to `openspec/specs/README.md` when the
    accepted delta is synced at archive time).
- **Modified Capabilities:** none

## Impact

- `grade10` repo only. Its auth frontend package grows a sign-out command and
  its session client port carries the sign-out call; the nine call sites
  across `apps/frontend/grade10`, `apps/frontend/zzz-store`,
  `apps/admin/grade10`, and `apps/admin/zzz` adopt it.
- This repo ships nothing: the failure feedback composes existing
  design-system exports. No new component, variant, or token.

## Non-goals

- Signing out other devices or listing sessions; server-side revocation UX.
- Changing how surfaces read the session, or where sign-out buttons sit.
- A toast or notification system; feedback stays inline beside the control.
- Renaming the session client port in the auth package.
