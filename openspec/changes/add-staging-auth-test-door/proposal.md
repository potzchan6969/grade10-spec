**Author:** @caspertsang - 2026-09-21

## Why

QA cannot walk sign-in on staging the way the local suite does. Staging
refuses the disposable `/dev` door, so the job cannot capture the sign-in
link, age it, ban a tester, or prepare an admin. Opening that door on the
public staging worker would mint sessions for any address. Leaving it closed
means staging auth tests need a real mailbox, or they do not run.

**Metric:** share of staging auth cases that finish a sign-in without a
mailbox.

**Acceptance signal:** this repository's Actions job captures the last sign-in
link for an allowlisted tester and follows it; any other caller, any other
address, preview, and production are refused.

## What Changes

- **A locked staging door for sign-in tests.** The Actions job for this
  repository may capture the last sign-in mail, age an unused link, ban the
  ban-only tester, and prepare the admin-only tester.
- **A finite tester list.** One collector, one ban-only, one admin-only.
  Ops names the addresses.
- **Closed everywhere else.** Preview, production, and `/dev` on staging stay
  closed. The job does not mint a session without following the mail.

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
- **Sign-in send (staging)** — record the last mail for an allowlisted tester
  so the job can capture it; Resend still delivers.
- **Grade10 Actions** — the staging auth job proves it is this repository and
  calls the door. Local disposable stacks keep `/dev`.
- **The manual** — Sign-In Tests; Accounts · Tests.

## Follow-on changes

- A dedicated disposable stack, branched from staging, for the full suite
  that still mints a new address per test.

## Open questions

- **Exact tester addresses** — Ops. Until they land, the door has no
  subjects. ❓ on [Sign-In Tests · Testers](../../../docs/prds/products/shared/auth/test-sign-in.md#testers).

## References

- [Sign-In Tests · Who May Call](../../../docs/prds/products/shared/auth/test-sign-in.md#who-may-call)
- [Sign-In Tests · Testers](../../../docs/prds/products/shared/auth/test-sign-in.md#testers)
- [Sign-In Tests · What The Job May Do](../../../docs/prds/products/shared/auth/test-sign-in.md#what-the-job-may-do)
- [Sign-In Tests · Closed](../../../docs/prds/products/shared/auth/test-sign-in.md#closed)
- [Accounts · Tests](../../../docs/prds/products/shared/auth/index.md#tests)
