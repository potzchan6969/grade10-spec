**Author:** @seankcw - 2026-09-25

Product context: [Sign-In · Google One Tap](../../../docs/prds/products/shared/auth/sign-in.md#google-one-tap).

## Why

Google sign-in only appears once a collector has already opened the sign-in
dialog and chosen not to type an email — the one moment they no longer need
convincing. Better-auth already ships the auto-prompt Google's own guide
describes, wired in this repository since the Google control shipped, and it
has never been called.

**Metric:** the share of signed-out sessions on a brand with Google sign-in
that end signed in, before and after; unmeasured until instrumented.

## What Changes

- **Google's own corner prompt** offers sign-in to a signed-out collector on
  any brand that already has Google sign-in, without them opening the dialog
  first. Tapping it signs them in the same way the Google control does.
- **One ask at a time** — the prompt does not show while the sign-in dialog
  is open, and opening the dialog dismisses an already-showing prompt.
- **Every page** the prompt follows the Google control's own brand rule, so
  a brand without Google sign-in never shows it, and a brand that gets one
  later picks up the prompt with no further change here.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `shared/auth/sign-in` — adds the auto-prompt to the Google feature set:
  when it shows, and how it yields to the sign-in dialog.

## Impact

- `packages/grade10-auth/frontend` (grade10 repository) gains a second way
  into the already-registered `oneTapClient`, beside today's rendered
  button.
- Each consuming app's root shell mounts it once, gated on the same
  signed-out check the sign-in dialog already uses.
- No new infrastructure: better-auth's server and client plugins are
  already registered, and neither path needs a CSP entry the repository
  does not otherwise set.

## Follow-on changes

- zzz-site's own prompt, once a separate change gives it a Google client
  id.

## References

- [Sign-In · Google One Tap](../../../docs/prds/products/shared/auth/sign-in.md#google-one-tap)
