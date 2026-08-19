**Author:** @seankcw - 2026-08-19

## Why

The sign-out unification (`unify-sign-out-feedback`) fixed a race its review
found: a sign-out activated twice during flight started two concurrent
requests. Sign-in carries the same unguarded shape — it has just been masked
by the submit button's own loading state, so it regresses silently the moment
a surface forgets to wire that state. And the email step has a concurrency
hole no button can mask: "send me a link" and "send me a code instead" are
two independent commands, each disabled only by its own in-flight state, so a
collector can fire both and receive two competing sign-in emails. Two emails
for one intent reads as a glitch at best and a phishing scare at worst.

If this works, one sign-in intent produces at most one in-flight request and
one email: duplicate send-link/send-code requests reaching the auth service
drop to zero.

## What Changes

- A sign-in command activated while its own request is in flight joins that
  request instead of starting a duplicate — the same idempotency sign-out
  now has, guaranteed by the command itself rather than by button wiring.
- The email step runs one command at a time: while either "send link" or
  "send code" is in flight, both controls refuse activation, and only the
  running one shows the busy state.

## Capabilities

- **New Capabilities:**
  - `shared-auth/sign-in`: the in-flight contract for sign-in commands and
    the email step's one-command-at-a-time rule. Lands beside
    `shared-auth/sign-out` (added by `unify-sign-out-feedback`, not yet
    archived); the `shared-auth` README bullet arrives with whichever
    change archives first.
- **Modified Capabilities:** none

## Impact

- This repo: the email-step form in `packages/ui` gates both controls on
  either command being in flight — existing props carry what it needs, so no
  export, prop, or token changes.
- `grade10` repo: the auth frontend package's sign-in commands gain the same
  in-flight guard its sign-out command has; consumed after a submodule bump.

## Non-goals

- Changing sign-out (shipped), Google One Tap, or the two-factor flows.
- Server-side rate limiting or invalidating previously sent links/codes.
- Queuing or replaying an input changed during flight: an activation while a
  request runs does nothing, including with edited input.
- New visual states — existing busy affordances carry the behavior.
