## Context

`SignInFlow` in `packages/grade10-auth/frontend` is the one email sign-in
step every surface shares — both storefronts, both consoles, the auth demo.
It renders `SignInCard` around `SignInEmailForm` and, after a send that went
out, puts a line of status copy in the card's `message` slot. The entry step
never leaves the screen.

The shared half of this change has landed: `@grade10/ui` exports
`SignInLinkSent`, and the shared `signIn` catalogs answer `linkSentTitle`,
`resendLabel`, and `resendCountdown` in all four languages. What is left is
the consumer wiring and the link's time to live.

The send cap is already sixty seconds, as `SIGN_IN_SEND_WINDOW_SECONDS` in
`packages/grade10-auth/backend/src/signInMail.ts`. The link's time to live is
better-auth's default of 300 seconds.

## Goals / Non-Goals

**Goals:**

- Swap the dialog to the link-sent step after a send, with the countdown and
  the resend the spec names.
- Hold the wait and the link's lifetime to one number both sides read.

**Non-Goals:**

- The mailed letter, the follow-failure toasts (`sign-in-link-follow-feedback`
  owns those), and the server's one-email-a-minute cap itself.
- A new shared export: `SignInLinkSent` already exists.

## Decisions

### What the spec already governs

After a send: the title **Check Your Email**, the lead line above the address
on its own line, Resend with a **Resend (n)** countdown, no Back, an entry CTA
reading **Sign In with Email**, and a link that lasts sixty seconds
(`shared-auth-sign-in-SC-42` through `SC-49`). The block's own contract —
what it draws and when Resend is disabled — is `shared-ui-auth-sign-in-SC-10`
through `SC-15`, and is already satisfied.

### One timestamp decides the step and the countdown

The flow holds `sent: { email, at } | null`. A non-null `sent` is what titles
the dialog from `linkSentTitle`, drops `providerSlot`, and renders
`SignInLinkSent` instead of the email step. The seconds left are computed from
`at` on each tick of a one-second interval, not decremented, and the interval
stops at zero.

Rejected alternatives:

- **A `step` union beside the address** — two pieces of state saying the same
  thing, and a resend has to move both.
- **A counter the interval decrements** — a sleeping tab stops the interval
  and the label resumes lying about the wait; `Resend (30)` on a link sent ten
  minutes ago is worse than no countdown.

### The consumer owns the clock

`SignInLinkSent` takes `resendCooldownRemaining` and does not tick — it holds
no product state by contract. The interval therefore belongs to the flow,
which is the component that knows when a send happened.

Rejected: ticking inside the block. Every consumer would inherit a timer it
cannot stop, and the export contract forbids the block holding state of this
kind.

### The wait and the link's lifetime are named in `@grade10/auth-contracts`

`SIGN_IN_SEND_WINDOW_SECONDS` moves out of the backend's `signInMail.ts` and
into `packages/grade10-auth/contracts/src/signIn.ts`, beside a new
`SIGN_IN_LINK_TTL_SECONDS`. The backend imports the first for its cap and
passes the second to `magicLink({ expiresIn })`, which reads seconds; the
frontend imports the first for the countdown.

Rejected alternatives:

- **A literal sixty in the flow** — the countdown and the server's cap would
  drift apart with nothing failing.
- **One constant for both** — they are the same number today and answer
  different questions: how long before another email, how long this link
  works. A change to one should not silently move the other.

### Dismissal clears the sent step

The link-sent step has no Back, so reopening the dialog is the only way back
to Google or to a different address. The flow clears `sent` when `open` goes
false. A second send inside the window is then refused by the server as it is
now, and the email step reports it with the existing `sendWait` copy.

Rejected: keeping the step across a reopen. It reads as accurate — the flow is
mounted for the life of the page and the countdown is computed, not stored —
but it leaves a collector who mistyped their address with no way out of the
step at all.

### A refused resend lands in the card's message slot

Resend calls the same send command with the stored address. The link-sent
block carries no error slot, and the card's `message` is free once the
confirmation moves into the block, so a refusal renders there — `sendWait` for
a refusal to send again, the failed-send copy otherwise.

### The countdown label is a function on the copy type

`SignInFlowCopy` gains `linkSentTitle`, `resend`, and
`resendCountdown: (seconds: number) => string`. A function rather than a
template holding `{seconds}`: the translated path already interpolates through
`tSignIn("resendCountdown", { seconds })`, and a console writing its own
English should not make the flow reimplement that.

## Risks / Trade-offs

- [A sleeping tab or a skewed clock puts the countdown out of step with the
  server's cap] → the seconds are read from the send timestamp on every tick,
  so a wake re-reads the true number; the server stays authoritative and a
  refused resend reports the wait.
- [Sixty seconds is short enough that a slow inbox delivers an expired link] →
  the step now offers Resend, and a follow after expiry already toasts
  (`sign-in-link-follow-feedback`). The wait and the lifetime are the same
  number, so the countdown reaching zero and the link dying are the same
  moment.
- [Playwright follows a link from the dev outbox] → the e2e flows follow
  immediately; a spec that pauses longer than sixty seconds between send and
  follow has to resend.

## Migration Plan

1. Shared UI and catalogs in `grade10-spec` — done, and pinned.
2. Move the window constant, set the link's time to live, wire the flow, and
   answer the new copy in the console.
3. Rollback: revert the flow's swap and the `expiresIn` option. The shared
   export stays exported and unused, and no data is written either way.
