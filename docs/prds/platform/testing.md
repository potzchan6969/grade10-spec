---
title: Testing Lanes
order: 1
---

Which lane a piece of code tests in, and the rules that keep the suites honest.

## Lanes

| Lane | Runs | Command |
| --- | --- | --- |
| Frontend unit (jsdom) | components, hooks, DI modules — every SPA has one | `pnpm run test` |
| Lib unit (node) | pure lib logic: utils, mixpanel, auth-contracts, worker | in `pnpm run test:backend` (`test/`) |
| Postgres (pglite, node) | everything touching a database, against the committed migration SQL | in `pnpm run test:backend` (an app's `test/db/`, or a package's `test/repositories/`) |
| Postgres (real server, node) | what one session cannot show — two claims in flight at once | `pnpm run test:pg` (`test/pg/`) |
| Workers pool (workerd) | Durable Objects, TaskScheduler, routes | in `pnpm run test:backend` (`test/` or `test/worker/`; `packages/durable/test/` for the scheduler itself) |
| E2E (Playwright) | Cross-page flows against the complete local stack | Suite under `apps/frontend/grade10/e2e/` — see [End-to-End Tests](/platform/e2e) |

### Placement

- Postgres or Hyperdrive → the pglite lane; pg cannot run under the workers pool
- Two connections doing something to each other → the real-server lane, and only that: it is the one thing pglite cannot do
- A Durable Object or a binding → the workers pool
- A component needing only a document → jsdom
- Color, breakpoints, or loaded images → Storybook, never jsdom
- Storybook (rendering plus axe in real Chromium) and Playwright left with the example app; both return with the first storefront UI
- In service/repository packages, all new files are `*.test.ts`; seam is carried in the filename (`listings.test.ts`, `bids.drizzle.test.ts`, `bids.repo.test.ts`)

### Running a lane

- `scripts/test.mjs` runs one, and resolves membership from the path: a product's `frontend`, `admin-frontend` or `demo`, the flat browser infrastructure (`frontend-di`, `demo-shell`), and every SPA and admin panel are the frontend lane; everything else with a `test` script is the backend lane
- Nothing lists packages, so a new one joins its lane by existing — and `pnpm run check:libs` fails a package whose vitest config asks for a runtime its lane does not run
- One budget for the machine, spent by the lane (`scripts/test/budget.mjs`): a lane may have one test worker per core in flight, and hands each package the pool it may open — never more than half the budget, never more than it has spec files. Widest first, and whatever is left over goes to whatever fits, so the one-file packages run many at a time instead of holding a share they cannot spend
- A package's vitest config never sizes a pool: it cannot know what else is running. A suite that must not run its files in parallel says `fileParallelism: false`, which the lane does not override
- Output is held until a package finishes, so the whole lane reports: a failure prints in full where it happened and the rest still runs
- `node scripts/test.mjs store auth` runs what matches, across lanes; `--list` shows what a lane holds and the pool each package gets, `--budget=` (or `TEST_BUDGET`) changes how much of the machine the lane may spend, and `TEST_VERBOSE=1` prints the packages that passed too

### Coverage

- `vitest run --coverage` in any backend app, with istanbul, into a gitignored `coverage/`

## Honesty rules

### A test may not decide its precondition is absent

- `if (data.length) { expect… }` and `test.skip(!data, …)` pass for a run where nothing ran
- Seed the data or fail on its absence
- A tautology (`toBeGreaterThanOrEqual(0)`) is the same defect
- A test that has never failed may never have run

### Scheduled work is driven, not assumed

- DO alarms are off under `ENVIRONMENT=testing`
- Drive the scheduler with `drainScheduledTasks(stub)` and assert what executed
- Never infer a task ran from a green run

### Fire-and-forget side effects need a capture seam

- A path ending in an unobservable `fetch` never gets tested
- Mixpanel has one (`installMixpanelCapture`); give any new outbound side effect the same transport seam

### Registries get a total-map oracle

- Type a sample map as `{ [K in EventName<Catalog>]: … }` so adding an entry without a test is a compile error

## Workers pool

### Pin time with `withMockedTime`, never fake timers

- `withMockedTime(stub, seconds, fn)` pins `Date.now` inside the DO
- `vi.useFakeTimers()` with a DO breaks storage isolation

### Assert DO state, never spy on the stub

- A DO stub is a proxy and cannot be spied on
- Read the DO's SQLite through `runInDurableObject`, or assert through its RPC surface

### Know what `runInDurableObject` does not prove

- State mutated inside it is not automatically visible cross-DO — initialize and mutate through RPC when another DO must read it
- It reuses the live instance, so it cannot prove eviction-safety; to test survival, assert against what is in SQLite

### Bindings and globals

- Cross-worker bindings are stubbed in `vitest.config.ts` — `serviceBindings` for fetch-only, an auxiliary worker module for RPC (`apps/backend/grade10/store/vitest.config.ts` answers `AUTH_SERVICE` signed-out)
- Isolate-wide state (a swapped transport, a patched global) leaks between specs — restore in `finally`/`afterEach`, every time

## Postgres lane

### One Postgres per file, one rolled-back transaction per test

- `usePgliteDb()` from `@grade10/postgres/testing` binds the database to the suite and hands back a handle
- pglite applies the committed migration SQL, so the lane also proves the migrations; an in-memory KV stands in for the CACHE binding
- Each test starts from the migrated schema with none of its neighbours' rows
- Whatever the code under test opens becomes a savepoint, so its own transactions still behave
- The handle's `db` is the same shape repositories take in production, so repo tests call repository functions directly with `fixture.db` rather than inventing a second adapter seam

### Service/repository evidence

- Service tests fake the repositories that service imports and assert policy/coordination outcomes without worker runtime or database setup
- Query-shape tests (`*.drizzle.test.ts`) assert material SQL clauses and bound values through `emittedSql()`, never broad full-query snapshots
- Repository execution tests (`*.repo.test.ts`) seed data and execute real repository functions against migrated pglite

### A real server only for what one session cannot show

- `useServerDb()` from `@grade10/postgres/testing-server` opens a connection per
  session, so a transaction held open on one genuinely holds its locks against
  the others — which is how `for update skip locked` gets proven
- `fixture.hold(work)` parks a transaction mid-flight and releases it after the
  test whatever happened; without that a failing test leaves a one-connection
  pool busy and every test after it hangs instead of reporting. `release()`
  rolls it back, `commit()` keeps what it wrote — a rollback shows only that
  the other session waited, never what it reads once it stops waiting
- Isolation is a truncate, not pglite's rollback: a transaction the fixture held
  open would be invisible to every session but its own. The truncate runs inside
  `asDbOwner` from `@grade10/postgres/db-owner`, which stands each guard trigger
  down and puts it back in the state it found it — the guards are installed
  `ENABLE ALWAYS`, so `session_replication_role` no longer reaches them and
  nothing short of the table owner's own DDL does. That is what a fixture is
  entitled to: it owns the database outright. It is also the only seat a tamper
  test can write from, which is why `tamperAsDbOwner` is the same call
- `TEST_POSTGRES_URL` is required and never defaulted — a lane that passed
  without a server would report the exclusion proven on every machine that has
  none
- **One database per app, never one for the fan-out.** `pnpm run test:pg` runs
  every app declaring a `test:pg` script and reads each one's server from
  `TEST_POSTGRES_URL_<APP>`, refusing a run where two apps name the same URL.
  They must differ: the fixture truncates every table between tests and the
  migration gate is a single high-water mark, so two apps on one database clear
  each other's rows and silently skip each other's migrations — and both suites
  still report green. CI creates a database per app on one `postgres:16`
  service; locally, `createdb` one each on the docker Postgres
- Keep the fixture's statement timeout under the suite's own: whichever fires
  first writes the message, and "test timed out" names no lock

### `isolation: "database"` only when a rejection is the point

- It boots a separate Postgres per test, at about a second each
- Read a suite carrying it as a suite about the database's own guards

### Fixtures own the lifecycle

- Each app wraps the lane in one `test/helpers/fixture.ts` — `useAuthFixture()`, `useStoreFixture()` — that also carries the suite's vocabulary (sign in, read a session, call a router)
- A spec registers no lifecycle hooks of its own

## Frontend

### Fake at the boundary the composition root fakes

- Bind the fixture clients through the DI container — `installTestContainer` from `@grade10/frontend-di/testing`, which each package wraps in its own `test/harness.tsx` — keeping the feature's real graph in between
- Mock a module (`vi.mock("../../auth")`) only for app-shell clients that reach the network at import time

### Queries and setup

- Query by role and accessible name, never class or test id
- Each SPA carries the same 3-line jsdom setup (`src/test/setup.ts`): jest-dom matchers plus `cleanup` after each test

## E2E

Full contract, scenarios, and rollout: [End-to-End Tests](/platform/e2e).

### What this lane is for

- Behavior that spans a real browser page, real `.grade10.dev` session cookies through nginx, and real worker HTTP APIs
- Not a substitute for jsdom unit tests or the pglite / workers-pool backend lanes

### Rules that apply here as well

- Seed the precondition or fail — the honesty rules above still apply
- Poll with a predicate and backoff, never a bare timeout; exhaustion errors must say what was last observed
- A defect that is real but owned elsewhere is recorded with `test.fail()`, not deleted
- Create test data through auth/store HTTP APIs only — never direct SQL from Playwright
- First lane targets the complete local stack only — never production
- `pnpm --dir apps/frontend/grade10 run e2e` reuses `https://grade10.dev` when
  it is already up; otherwise Playwright starts `scripts/e2e/start-local.sh`
  (`pnpm dev --only=auth,store-service,api,web`). Run it through that script:
  it sets `NODE_EXTRA_CA_CERTS` so Node trusts the local nginx CA
- CI: `.github/workflows/e2e.yml` — PR label `e2e` or `workflow_dispatch`.
  HTML report is a GitHub Actions artifact; when `E2E_REPORTS_R2_*` secrets
  are set it is also published to R2 and the PR comment links that URL.

## Q & A

- Why do the honesty rules exist?
  - Each is a way a green suite once lied — it passed while testing nothing.
- Why istanbul instead of V8 coverage?
  - V8 coverage does not work under the workers pool.
- Why is a rejected statement a reason for `isolation: "database"`?
  - The first rejected statement poisons a transaction, so the assertions after it report the poison instead of what they meant to catch; a fresh database per test keeps rejection suites honest.
