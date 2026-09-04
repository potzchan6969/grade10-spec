## 1. Ladder meta and build provenance (grade10) (owner: @sean)

Shared groundwork every later group reads. Lands first; groups 2 and 3 can
then be claimed in parallel.

- [x] 1.1 Record the caller on the shared ladder: `authedProcedure` → `session`, `freshAuthedProcedure` → `fresh`, `elevatedProcedure` → `elevated` beside its grants, `publicProcedure` unrecorded. Test-first in the worker library's ladder suite: meta survives a chained `.meta()`, and every rung reports its word — the evidence behind `grade10-admin-console-api-docs-SC-09` and `grade10-admin-console-api-docs-SC-10`.
- [x] 1.2 Add `VITE_BUILD_COMMIT` to the shared Vite define beside `VITE_DEPLOY_ENV`: `GITHUB_SHA`, else `git rev-parse HEAD`, else `development`. Cover the three sources in the app-env node suite (`grade10-admin-console-api-docs-SC-12`).
- [x] 1.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, `pnpm run test`.
- [x] 1.4 Record `forwardsTo` on the ladder's meta and set it on the store's `auction.*`, the one router that fronts another worker. The walker carries it, the page says it once above a forwarding router's list and as a badge in the detail (`grade10-admin-console-api-docs-SC-14`).

## 2. The document and its generator (grade10) (owner: @sean)

- [x] 2.1 Create `packages/api-docs` (`@grade10/api-docs`, backend lane): the document type — services → procedures → path, kind, caller, grants, principal, input schema, output schema — and a `.` loader over `generated/`. A Handbook card and `pnpm run check:handbook` come with the package.
- [x] 2.2 Write the walker under `./generate`: enumerate a router's mounted procedures, convert each validator to JSON Schema, refuse a validator with no schema AST, sort paths and keys, serialise. Test-first against a fixture router: every mounted procedure and nothing else (`grade10-admin-console-api-docs-SC-01`); two runs are byte-identical (`grade10-admin-console-api-docs-SC-13`).
- [x] 2.3 Add the service table: store (session ladder plus the till router built with the loyalty acts as the grade10 assembly mounts it), auction, auth, loyalty, vault, appointment, finance, inventory. A `generate` package script writes `generated/<service>.json`; commit the first documents.
- [x] 2.4 Write the drift test: regenerate every service in memory and assert byte equality with `generated/`, failing with the service and the first differing procedure path and the instruction to run `generate` (`grade10-admin-console-api-docs-SC-02`). Also assert every procedure carrying grants reports caller `elevated`, and list the distinct JSON Schema keywords seen so a new one is a visible diff.
- [x] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, `pnpm run check:handbook`, `pnpm run check:libs`.
- [x] 2.6 Declare the auth worker's three erasure inputs as Effect schemas, the only validators across every router the walker could not read, and guard it twice: the api-docs census fails on any opaque validator anywhere, and the auth backend's own suite refuses a router input without a schema AST.

## 3. The surface in the Grade10 console (grade10) (owner: @sean)

Depends on group 2's package for the document type; builds against the
committed documents, never a running backend.

- [x] 3.1 Register the surface: `api-docs` as a `test`-kind address in `surfaces.ts`, the route inside the `TEST_SURFACES_ENABLED` branch of `routes.ts`, `[]` permissions and the `DEV` category in `sections.ts`, icon and workspace summary. Extend the existing surface and section suites: a production build answers the address with not-found (`grade10-admin-console-api-docs-SC-04`); a staging build lists it under Dev and opens it whatever the roles (`grade10-admin-console-api-docs-SC-05`).
- [x] 3.2 Build the page under `src/pages/api-docs/` from the console vocabulary per `ui-design.md`: `SectionHeader` naming the build commit (`grade10-admin-console-api-docs-SC-12`); the services rail with counts and unfolding routers (`grade10-admin-console-api-docs-SC-03`); the procedure table with kind, caller, input and output summaries (`grade10-admin-console-api-docs-SC-06`). Documents load lazily behind the route.
- [x] 3.3 Build the detail panel and the schema renderer for the subset `tech-design.md` names: wire path, caller badges, field tables with required, type and constraints, alternatives named by discriminator (`grade10-admin-console-api-docs-SC-07`); elevated with its grant (`grade10-admin-console-api-docs-SC-09`); `session` apart from `session · fresh` (`grade10-admin-console-api-docs-SC-10`); the undeclared-output `Notice` and per-service count (`grade10-admin-console-api-docs-SC-11`); raw schema behind `InfoDialog` and `Payload`.
- [x] 3.4 Add the filter: narrows every service by dotted path or grant, counts follow, empty copy when nothing matches (`grade10-admin-console-api-docs-SC-08`).
- [x] 3.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build` for the admin app, `pnpm run check:frontend-layers`.

## 4. Documentation (grade10) (owner: @sean)

- [x] 4.1 Add `pnpm run test:backend` as the drift check to the Validation list in `AGENTS.md` beside the drizzle generate/check pair, and describe `generate` in the package's Handbook card.

## 5. Manual and archive (grade10-spec)

- [ ] 5.1 Write the capability's manual page under `docs/prds/products/grade10-admin/console/` — the shape in prose, the canvas linked, a `Product decisions` block carrying the metric, the non-goals, and the generated-and-checked decision. The domain is new: write its `index.md` as well, and add `grade10-admin/console` to the Admin group in `docs/prds/manual.yaml`. Verify with `pnpm check:manual`.
- [ ] 5.2 At archive time, copy the delta's `## Feature set` and `## User journeys` into the durable `openspec/specs/grade10-admin/console/api-docs/spec.md`; the fold carries `## Requirements` only. Run `pnpm run archive:preflight`.
