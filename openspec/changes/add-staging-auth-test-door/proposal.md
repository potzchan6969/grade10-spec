**Author:** @caspertsang99 - 2026-09-21

## Why

QA cannot walk sign-in on staging the way the local suite does. Staging
refuses the disposable `/dev` endpoint, so the workflow cannot capture the sign-in
link, expire it, ban a tester, or grant an admin. Opening that endpoint on the
public staging worker would generate sessions for any address. Leaving it closed
means staging auth tests need a real mailbox, or they do not run.

**Metric:** share of staging auth cases that finish a sign-in without a
mailbox.

**Acceptance signal:** the test endpoint's own workflow captures the last sign-in link
for a tester address and follows it; on production and preview it does so for
production's named testers alone; any other caller and any other address are
refused.

## What Changes

- **A gated staging endpoint for sign-in tests.** One workflow, on a reviewed
  dispatch, may capture the last sign-in mail, expire an unused link, ban a
  tester address, grant it to hold `admin`, set a scoped role on a plus-tag of
  the collector, and clear the sign-in limits
  that would otherwise throttle a suite as an attacker.
- **A second caller: the QA agent.** An agent walking a manual pass on
  staging captures a tester's link through the same endpoint, with a
  staging-only QA token committed to the repository: capture, expire and
  clear only (Q38, Q39).
- **Named testers.** Each environment names its own testers in the code: four on
  staging and uat, the collector alone on production. On staging and uat a run
  generates a unique plus-tag of one. Ban and grant create the account when the
  address has never signed in (decisions Q40).
- **Production and preview, for smoke tests.** The workflow alone may capture
  and clear for production's named testers, today the collector, so a smoke
  test can sign in there (Q41). No ban, grant or role.
- **Closed everywhere else.** Local stacks, and `/dev` on staging, uat and
  production, stay closed. The workflow does not generate a session without following the mail, and it
  does not unban.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `shared/auth/test-sign-in`: the gated endpoint QA uses to walk sign-in on
  staging — who may call, which testers, what the workflow may do, and where it
  stays closed.

### Modified Capabilities

- `shared/auth/audit`: the test endpoint's bans, grants, scoped roles and created accounts land on the identity trail, named by the caller's kind.

## Impact

- **Auth worker (staging, uat, production)** — the gated endpoint; `/dev` stays 403.
- **Identity trail** — the endpoint's bans, grants and scoped roles are recorded under the caller's kind ([Audit Log](../../../docs/prds/products/grade10-site/account/audit.md#what-lands-on-the-trail)).
- **Sign-in send (staging, uat, production)** — record the last mail for a tester address so
  the workflow can capture it; Resend still delivers.
- **Sign-in limits (staging, uat, production)** — unchanged for every caller, and clearable for
  a tester address through the test endpoint.
- **Grade10 Actions** — one workflow, on a reviewed dispatch, holds the token
  and calls the test endpoint in a workflow that checks out no pull-request code. Local
  disposable stacks keep `/dev`.
- **The manual** — Sign-In Tests; Accounts · Tests.

No domain impact: nobody walks this endpoint on their own, and `shared/auth/domain-tcs.md` traces collector and operator journeys that compose no capability this change adds.

No platform impact: no path crosses a product.

## Follow-on changes

- A dedicated disposable stack, branched from staging, for the full suite
  that still generates a new address per test.
- A smoke lane against production and `preview.grade10.com`, on the same
  dispatch as this one, that signs in as production's named testers through
  capture and clear, so a release can be checked before collectors meet it.
- PR previews under the staging base domain, so an unmerged frontend can hold
  a staging session. Nothing publishes a PR preview today, and the
  `workers.dev` host in `packages/app-env/src/origins.ts` is cross-site, so no
  session reaches it.
- The suite shape for a capability nobody walks. This is the store's first
  suite for one, and `validate-test-cases.mjs` requires a three-line story
  that `planning-qa` forbids inventing, so this suite names an actor it should
  not. Settling it means an exemption in the validator and the shape in
  `docs/governance/specs-to-test-cases.md`, which is governance, not this
  endpoint.

## Open questions

None. The tester addresses are named in the code (Q40), and a generated plus-tag's
account is removed in the next cleanup after the run that generated it (Q21).

## References

- [Sign-In Tests · Who May Call](../../../docs/prds/products/grade10-site/account/sign-in.md#who-may-call)
- [Sign-In Tests · Testers](../../../docs/prds/products/grade10-site/account/sign-in.md#testers)
- [Sign-In Tests · What the Workflow May Do](../../../docs/prds/products/grade10-site/account/sign-in.md#what-the-workflow-may-do)
- [Sign-In Tests · Closed](../../../docs/prds/products/grade10-site/account/sign-in.md#closed)
- [Audit Log · What Lands on the Trail](../../../docs/prds/products/grade10-site/account/audit.md#what-lands-on-the-trail)
- [Accounts · Tests](../../../docs/prds/products/grade10-site/account/accounts.md#tests)
