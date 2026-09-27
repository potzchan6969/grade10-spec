## Goals

- A collector who already signed in on one device is not left staring at a
  stale Check Your Email wait, counting down toward a resend, on another.
- The waiting surface finds out its address is already settled without
  handing anyone who isn't already holding that address's own request the
  means to learn that.

## Non-Goals

- Granting the waiting device a session of its own — only the device that
  actually completed sign-in holds one.
- Changing the signed-in-mismatch Switch/Stay toast (SC-63–69) — that is for
  a device that already has a session and follows a link meant for another
  account; this change is about a device with no session yet, still waiting.
- A fixed detection-latency bound — cadence (poll or push, interval) is a
  tech-design/mechanism choice, not a requirement this artifact pins down.
- Handling the waiting device already being signed in as a different account
  when this fires.
- An endpoint that reveals whether an arbitrary address has a live session
  from the address alone.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does the device that didn't follow the link end up signed in too? | No session hand-off — the waiting surface only recognizes the flow is settled and gets out of the way - decided by the round | Also granting the waiting device a session — rejected: `shared/auth/sign-in` already states a link signs in at most once (SC-06), and dual-session hand-off from one token is a materially bigger, riskier feature than ending a stale wait. |
| Q2 | What counts as "settled elsewhere" — only the exact link followed, or any method? | Any successful sign-in for that address (link or Google) ends the wait - decided by the round | Scoping to the exact token only — rejected: the same confusion returns unfixed the moment the other device signs in with Google instead of the emailed link. |
| Q3 | What does the waiting surface show once it learns this? | Closes with a brief message that sign-in completed on another device - decided by the round | Closing silently, matching SC-50's rule — rejected: SC-50's silence works because that surface ends up signed in and can see it for itself; this surface stays signed out, so a silent close there reads as broken rather than resolved. |
| Q4 | Does this change also touch the mismatch toast, set a latency SLA, or handle the waiting device already holding a different session? | None of the three — all out of scope - decided by the round | Folding any of the three in here — rejected: each is a distinct existing rule or an implementation cadence, not this change's problem to redefine. |
| Q5 | Should the "signed in elsewhere" check be un-guessable from a bare email address? | Yes — gated behind the flow's own token/secret, never a bare email - decided by the round | A bare "is `<email>` signed in" endpoint — rejected: reopens the account-enumeration oracle SC-09 already guards against. |
| Q6 | Does a pending, unused, unexpired link stay valid after its address signs in elsewhere by another method? | Yes — unaffected; it stays valid until its own expiry or a later send supersedes it, exactly as today - decided by the round | Retiring the pending link the moment another method succeeds — rejected: this change is scoped to the waiting surface's own behavior, not the link's lifecycle, and revisiting `shared-auth-sign-in-SC-06`/`SC-36` here is scope creep the interview never called for. |

## Raised

The blind test-case pass raised one question the proposal, this file, the
journeys and the PRD did not settle.

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/auth/sign-in` | Does a pending, unused, unexpired link stay valid after its address signs in elsewhere by another method? | Q6 |
