---
title: End-to-End Tests
order: 2
---

Browser end-to-end tests for behavior that spans a real page, real session
cookies, and real worker APIs. Unit and backend lanes stay in
[Testing Lanes](/platform/testing); this file is the E2E contract.

## Contract

| Rule | Detail |
| --- | --- |
| Target | Local complete stack only for the first lane: nginx + Docker Postgres + workers + SPA. Never production. |
| Environment | Dev-only endpoints run under `ENVIRONMENT` in `development` \| `testing` \| `e2e` (`assertDevEndpointsAllowed`). Staging and production refuse them, so this lane cannot run against a deployed stack. Prefer `e2e` when the stack is dedicated to Playwright. |
| Site under test | Unified Grade10 site at `https://grade10.dev` (`apps/frontend/grade10`, dev service `web`). |
| Session | Real cookies through nginx. Cookie parent domain is `.grade10.dev`, shared with `api.grade10.dev` and `admin.grade10.dev`. |
| Data | Create and reset state through auth/store HTTP APIs. Never open Postgres/Neon from Playwright. |
| Honesty | Seed the precondition or fail. Never `test.skip` / guarded `if (data)` that can pass vacuously. |
| Queries | Role and accessible name, not CSS class or test id. |
| Waits | Poll with a predicate and backoff; exhaustion errors must say what was last observed. |
| TLS | Browsers hit `https://grade10.dev` with certificate validation enabled. Do not set `ignoreHTTPSErrors`. Node trusts the repo CA via `NODE_EXTRA_CA_CERTS`. Playwright Chromium does not; it is launched with `--ignore-certificate-errors-spki-list` for that leaf and CA only. |

## First surface and scenarios

**In scope:** Grade10 storefront flows on `https://grade10.dev`.

| # | Scenario | Setup | Expect |
| --- | --- | --- | --- |
| 1 | Anonymous catalog | No session | Fixture catalog products are visible |
| 2 | Dev session → profile | `POST /auth/dev/login` | `/profile` answers with the account, and with sign-in for a visitor |
| 3 | Seeded order history | Login, then `POST /store/dev/setup` with that `userId` | The browser session reads that user's paid + pending demo orders |
| 4 | Empty order history | Login only (no store seed for that user) | The browser session reads an empty order list, not another user's |

**Out of scope for this lane:** payments, live Shopify, admin/2FA, staging/Neon, AceTrader-style migration cohorts, wallet auth, cron/price overrides.

## Auth and seed (already available)

- `POST https://api.grade10.dev/auth/dev/login` — body `{ email, role? }`; mints a real product session cookie on `.grade10.dev`.
- `POST https://api.grade10.dev/store/dev/setup` — optional body `{ userId }`; migrates and seeds paid + pending demo orders for that better-auth user (skips if the user already has orders). Without `userId`, seeds the documented default `dev-user`.

No extra scenario-seed endpoint is required for the four scenarios above.

## Complete-stack launcher

Playwright's `webServer` runs `scripts/e2e/start-local.sh` unless
`https://grade10.dev` already answers (a running `pnpm dev`). Specs then wait
on that site plus `/auth/health` and `/store/health`, so the SPA answering
first cannot start a test against a dead gateway. The launcher is a thin
wrapper around `pnpm dev --only=auth,store-service,api,web`:

| Piece | Why |
| --- | --- |
| nginx + Docker Postgres | Real TLS and session cookies on `*.grade10.dev` |
| `auth`, `store-service` | Dev login and store seed / catalog |
| `api` | nginx proxies `https://api.grade10.dev` to the gateway |
| `web` | Unified site at `https://grade10.dev` |

`GRADE10_E2E_STACK=1` keeps nginx/docker enabled even when `CI=1` (unit jobs
still skip the proxy). Specs wait on site + `/auth/health` + `/store/health`
so Vite answering first cannot start a test against a dead gateway. CI tears
down the compose project; a local run leaves Docker up if you already had a
dev session. Linux/macOS CA trust lives in `scripts/setup-nginx.sh`.

The workers still boot the wrangler `development` env — `assertDevEndpointsAllowed`
already allows those endpoints. A dedicated wrangler `e2e` env is not part of
this step.

## Decisions (v1 rollout)

- Execution: complete local stack in CI (not deployed staging).
- Trigger: PR label `e2e` or `workflow_dispatch`. Not on every push. The
  label is removed when the run finishes so it can be re-applied. Create it
  once with `gh label create e2e`.
- Reporting: Playwright HTML → R2 (browsable URL) when
  `E2E_REPORTS_R2_*` secrets are set, else the GitHub Actions zip. A run on
  a branch with an open PR comments the best available link.

## Rollout

| Step | Status | Notes |
| --- | --- | --- |
| 1. Contract + scenarios | Done | This file + `testing.md` |
| 2. Playwright tree | Done | `apps/frontend/grade10/e2e/` — Chromium, list+HTML reporters, failure screenshots |
| 3. Complete-stack launcher | Done | `scripts/e2e/start-local.sh` → `pnpm dev --only=auth,store-service,api,web` |
| 4. Auth cookie → browser context | Done | `authenticatedStore` fixture signs the browser in per test |
| 5. Diagnostics / reporting | Partial | Failure screenshots on; HTML report is a CI artifact; richer failure context later |
| 6. `e2e.yml` | Done | Label `e2e` or `workflow_dispatch`; local stack; report artifact + PR comment |
| 7. R2 report hosting | Borrowed | AceTrader bucket + Worker; prefix `reports/grade10-web/<run-id>-<attempt>/`. Own bucket later is vars only. |
| 8. Incremental validation | Pending | |

### Run the suite (local)

```bash
# once per machine
pnpm --dir apps/frontend/grade10 run e2e:install

# reuses https://grade10.dev when a `pnpm dev` is already up; otherwise starts the slice
pnpm --dir apps/frontend/grade10 run e2e

pnpm --dir apps/frontend/grade10 run e2e:report
```

From the repo root, `pnpm run test:e2e` and `pnpm run test:e2e:report` are the
same two commands. Playwright's own "To open last HTML report" hint points at
the root, where it finds no `playwright` binary — that package owns it.

CI runs the same command from `.github/workflows/e2e.yml` when a PR is
labelled `e2e` or someone dispatches the workflow.
The HTML report uploads as the `playwright-report` artifact; a failing stack
also uploads `.dev-logs`. When `E2E_REPORTS_R2_*` secrets are set on this
repo, the same report is synced to AceTrader's R2 bucket and the PR comment
links a page on `e2e-reports.memeland-qa.9gaginc.com` (Cloudflare Access,
same login as AceTrader reports). Unset secrets skip the upload; the zip
still lands. An own Grade10 bucket later is `E2E_REPORTS_R2_BUCKET` +
`E2E_REPORTS_BASE_URL` — the object prefix does not change.

All five tests pass against the local stack today.

## Signing a test in

The `authenticatedStore` fixture is the only way a spec gets a session: a
unique email per call → `POST /auth/dev/login` → the cookies that response set,
read out of the request context's own jar and added to the browser context →
optionally `POST /store/dev/setup` with that `userId`.

Playwright has already parsed `Set-Cookie` into domain, path and flags, so
nothing re-implements that and the browser holds the cookie production issues
rather than a hand-built one. A login that sets no `better-auth.session_token`
on `.grade10.dev` throws, and so does a seed that reports `skipped` — a fresh
email cannot already own orders, so a skip means an identity leaked between
tests.

The site renders no order list yet, so scenarios 3 and 4 read orders through
`page.request`, which shares the browser's cookie jar. That endpoint answers
401 without a session, so the empty case cannot pass vacuously. When an order
surface ships, those two assertions move onto the page.

### Steps 7–8

R2 is Cloudflare object storage. The Playwright HTML report is synced to
AceTrader's private bucket (`acetrader-e2e-reports`) and served by that
report Worker. `/` on that host is not an index — a report URL is
`https://e2e-reports.memeland-qa.9gaginc.com/reports/grade10-web/<run-id>-<attempt>/index.html`.
Objects under `reports/` expire after 30 days.

Secrets are per repo. Copy the three `E2E_REPORTS_R2_*` values from
AceTrader onto `9gag/grade10`. Optional vars: `E2E_REPORTS_R2_BUCKET` and
`E2E_REPORTS_BASE_URL` (workflow defaults match AceTrader). Without the
secrets the publish step exits 0.

Own bucket later: create `grade10-e2e-reports`, point those two vars at it,
and scope a new token to that bucket. Prefix stays
`reports/grade10-web/<run-id>-<attempt>/`.

Then validate catalog → cookie login → order isolation in CI, hunt flakes,
and link the report before expanding scope.
