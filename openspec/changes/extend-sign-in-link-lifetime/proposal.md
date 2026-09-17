**Author:** @sean - 2026-09-17

## Why

A sign-in link dies sixty seconds after the send, which is shorter than
ordinary mail delivery: a collector who asks on a laptop and reads the mail on
their phone arrives at a dead link through no fault of their own, and has to
start again. The email has always promised fifteen minutes, so what they are
told and what they get have never agreed either.

**Metric:** the share of email sign-ins that end in a session, and the share of
link follows that expire.

**Acceptance signal:** a link followed four minutes after the send signs the
collector in; one followed after six does not, and says so.

## What Changes

- **A sign-in link lasts five minutes.** The resend wait stays at sixty
  seconds, so the countdown reaching zero no longer kills the link already
  sent.
- **The email says five minutes.** The shared `email` catalog's sign-in body
  promises fifteen today, in every language it speaks.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

### Modified Capabilities

- `shared/auth/sign-in`: how long an emailed link stays followable, and what
  the email carrying it promises.

## Impact

- **`@grade10/i18n`** — the shared `email` catalog's sign-in body, in every
  locale.
- **Auth worker** — the link's time to live, read from
  `@grade10/auth-contracts`.
- **Grade10 E2E** — the expired case ends the lifetime on the record rather
  than waiting it out, which a sixty-second link let it do.

## References

- [Sign-In · After the Send](../../../docs/prds/products/shared/auth/sign-in.md#after-the-send)
