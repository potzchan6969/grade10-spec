**Author:** @caspertsang99 - 2026-09-21

## Why

QA cannot walk sign-in on staging the way the local suite does. Staging
refuses the disposable `/dev` door, so the job cannot capture the sign-in
link, age it, ban a tester, or prepare an admin. Opening that door on the
public staging worker would mint sessions for any address. Leaving it closed
means staging auth tests need a real mailbox, or they do not run.

**Metric:** share of staging auth cases that finish a sign-in without a
mailbox.

**Acceptance signal:** the door's own workflow captures the last sign-in link
for a tester address and follows it; any other caller, any other address,
preview, and production are refused.

## What Changes

- **A locked staging door for sign-in tests.** One workflow, on a reviewed
  dispatch, may capture the last sign-in mail, age an unused link, ban a
  tester address, prepare it to hold `admin`, and clear the sign-in limits
  that would otherwise throttle a suite as an attacker.
- **A tester domain.** Any address under one domain Ops names, minted per
  run, with a catch-all inbox so nothing bounces. Ban and prepare create the
  account when the address has never signed in.
- **Closed everywhere else.** Preview, production, and `/dev` on staging stay
  closed. The job does not mint a session without following the mail, and it
  does not unban.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `shared/auth/test-sign-in`: the locked door QA uses to walk sign-in on
  staging — who may call, which testers, what the job may do, and where it
  stays closed.

### Modified Capabilities

None.

## Impact

- **Auth worker (staging)** — the locked door; `/dev` stays 403.
- **Sign-in send (staging)** — record the last mail for a tester address so
  the job can capture it; Resend still delivers.
- **Sign-in limits (staging)** — unchanged for every caller, and clearable for
  a tester address through the door.
- **Grade10 Actions** — one workflow, on a reviewed dispatch, holds the token
  and calls the door in a job that checks out no pull-request code. Local
  disposable stacks keep `/dev`.
- **The manual** — Sign-In Tests; Accounts · Tests.

No domain impact: nobody walks this door on their own, and `shared/auth/domain-tcs.md` traces collector and operator journeys that compose no capability this change adds.

No platform impact: no path crosses a product.

## Follow-on changes

- A dedicated disposable stack, branched from staging, for the full suite
  that still mints a new address per test.
- An anonymous smoke lane against `preview.grade10.com`, on the same label and
  dispatch as this one. Preview is the production backend, so that lane never
  signs in and never gains this door; what it covers is what a signed-out
  visitor sees on the production candidate.
- PR previews under the staging base domain, so an unmerged frontend can hold
  a staging session. Nothing publishes a PR preview today, and the
  `workers.dev` host in `packages/app-env/src/origins.ts` is cross-site, so no
  session reaches it.
- The suite shape for a capability nobody walks. This is the store's first
  suite for one, and `validate-test-cases.mjs` requires a three-line story
  that `planning-qa` forbids inventing, so this suite names an actor it should
  not. Settling it means an exemption in the validator and the shape in
  `docs/governance/specs-to-test-cases.md`, which is governance, not this
  door.

## Open questions

- **The tester domain, and its catch-all** — Ops. Until they land, the door
  has no subjects. ❓ on [Sign-In Tests · Testers](../../../docs/prds/products/shared/auth/test-sign-in.md#testers).
- **Sweeping tester accounts** — Ops. A run leaves one account per test
  behind. ❓ on [Sign-In Tests · Testers](../../../docs/prds/products/shared/auth/test-sign-in.md#testers).

## References

- [Sign-In Tests · Who May Call](../../../docs/prds/products/shared/auth/test-sign-in.md#who-may-call)
- [Sign-In Tests · Testers](../../../docs/prds/products/shared/auth/test-sign-in.md#testers)
- [Sign-In Tests · What the Job May Do](../../../docs/prds/products/shared/auth/test-sign-in.md#what-the-job-may-do)
- [Sign-In Tests · Closed](../../../docs/prds/products/shared/auth/test-sign-in.md#closed)
- [Accounts · Tests](../../../docs/prds/products/shared/auth/index.md#tests)
