# Tech design — sync-session-across-tabs

## Context

The browser auth client already does more than the surfaces above it use.
`better-auth@1.6.26` mounts a session refresh manager the first time anything
subscribes to its session atom, and the applications subscribe at entry, below
React. That manager already:

- re-reads the session when the document becomes visible, rate-limited to one
  read every five seconds
- listens for a same-origin announcement and re-reads on it
- announces a sign-out itself, so `/sign-out` in one tab already reaches the
  others
- keeps the session it last held when a read fails, and clears it only on an
  answer that nobody is signed in

So the read half of this change is largely present and unproven. What is
missing is an announcement when a session *arrives* — a followed link is a
fresh document load that tells nobody — and surfaces that act on a session
they did not create themselves. The sign-in overlay is the sharpest case: only
an in-page Google sign-in calls `signedIn()`, and the arrival path calls
`closeSignIn()`, which deliberately drops what the collector was refused.

## Goals / Non-Goals

- **Goal** — build on the refresh manager that is already running; do not add a
  second mechanism beside it.
- **Goal** — one announcement path that covers every way a session arrives, not
  the emailed link alone.
- **Non-Goal** — a transport of our own. No socket, no poll, no server push.
- **Non-Goal** — changing the auth worker. Nothing here is a backend change.

## Decisions

**The freshness contract is met by two existing legs, not one.** The spec asks
for prompt keeping-up on the same site and a return bound everywhere else
(`shared-auth-session-SC-22`, `SC-11`). Visibility refetch supplies the return
bound for every surface, including another site of the brand. The same-origin
announcement supplies promptness, and only same-origin — which is exactly what
the spec promises and no more.

**A tab announces once per document load, on the first session read that finds
somebody.** This is the echo guard: a tab that re-read *because* it was
announced to is not a fresh document load, so it does not announce back, and
there is no storm. It also covers every arrival — emailed link, Google
redirect, the dev sign-in — rather than special-casing the link.

- *Rejected: announce on every anonymous→signed-in transition.* A
  broadcast-driven refetch produces that same transition, so tabs announce each
  other in a loop.
- *Rejected: mark the callback URL and announce when the marker is present.*
  The auth worker rewrites `callbackURL` to the brand storefront
  (`brandMagicLinkUrl`), there is no callback route to hang a marker on, and it
  would cover the link alone.
- *Rejected: read `document.referrer` to detect arrival from the auth service.*
  A redirect chain does not reliably preserve it.

**The announcement reuses better-auth's own channel rather than a key of our
own.** Posting on its channel means its subscriber in every other tab does the
re-reading, so the announcement carries no session data — only "look again".
A channel of our own would need its own subscriber and its own refetch call
beside the one already running.

**A surface that cannot read the session keeps what it held.** Already the
atom's behaviour: it keeps the last data on a fetch error and clears on an
answer of nobody. `bindSessionState` maps that through unchanged. So
`shared-auth-session-SC-25` and `SC-26` are verification work, not new code —
and they need a test precisely because nothing states them today.

**The overlay learns about arrival from the application, not from itself.**
`SignInOverlayProvider` carries visibility and the held resume and nothing
else, so that anything which only needs to *ask* for sign-in mounts without
pulling the auth container in behind it. That stays. The site's `SignInDialog`
already resolves the auth container, so it is what watches the session and
calls `signedIn()`.

**`SessionDecided` must call `signedIn()`, not `closeSignIn()`.** The two exits
mean opposite things: `closeSignIn()` is the collector saying no and drops the
held resume. On arrival it is the wrong one, and it is a live defect today
whenever a collector is asked on arrival while something else holds a resume.

**The refused action is attempted, not re-checked first.** `SC-56` asks for the
ordinary refusal when the thing can no longer be done. Running the held
callback produces exactly that, because it is the same call the control makes;
a pre-flight check would be a second implementation of every refusal.

**At most once is already the overlay's shape.** `signedIn()` reads the held
resume, nulls it, then calls it, so a second arrival finds nothing to run.
`SC-57` pins that rather than asking for new machinery.

## Risks / Trade-offs

- **[A signed-in tab's ordinary page load makes every other tab re-read]** →
  Bounded and cheap: one extra session read per load, the refresh manager's
  five-second rate limit applies, and a read that finds the same session
  publishes nothing — `createSessionState` compares before notifying and the
  atom stabilizes equal data.
- **[The announcement is same-origin only, so a sibling site of the brand is
  not prompt]** → Intended. The spec promises promptness for the same site and
  the return bound elsewhere; visibility refetch covers the rest.
- **[A per-member query that is not keyed by user id serves the previous
  person's rows]** → The cart already keys on `SessionSnapshot`. Every other
  per-member read is audited in its own task, and the person-change case is
  the test that proves it.
- **[`prefers-reduced-motion` and the dialog's unmount race]** → The dialog is
  mounted only while open, so the close on arrival unmounts it; nothing
  animates out and nothing holds the last visit's answers.
- **[Two subscribers now call `signedIn()` — One Tap and the session watch]** →
  Safe by construction: the resume is nulled before it is called, so the second
  call runs nothing.

## Migration Plan

Frontend only, no schema and no worker change, so it deploys with an ordinary
site release and rolls back with one. A tab running the previous build simply
does not announce; the tabs around it still keep up on return.

## Open Questions

None. The four the blind test pass raised were settled by the author and are
recorded in the reconciliation beside each suite.
