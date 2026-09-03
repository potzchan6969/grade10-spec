## Context

Every Grade10 backend builds its procedures on one ladder factory in the
shared worker library: `publicProcedure`, `authedProcedure`,
`freshAuthedProcedure`, and `elevatedProcedure(...grants)`. The till adds a
second factory with its own `posProcedure` / `posSessionProcedure`. Eight
services mount a router on the first (store, auction, auth, loyalty, vault,
appointment, finance, inventory); the store mounts the till's as well.

Two facts, verified in the application repository, make the spec cheap:

- The input and output validators a procedure holds at runtime are the Effect
  schemas themselves — `toStandardSchemaV1` mutates and returns its argument —
  so their AST survives and converts to JSON Schema. Every schema the eight
  routers declare converts. The auth worker's three erasure inputs were
  hand-written parsers, the one kind of validator tRPC accepts that carries no
  AST; they take Effect schemas now, and the document keeps a
  declared-and-unreadable marker for any parser a router grows later, so a
  procedure that takes something never reads as one that takes nothing. 217
  procedures across the eight routers enumerate, and the till's nine beside
  them.

  They load under Vite's node loader rather than under node itself: the
  routers are TypeScript sources with bundler-resolved imports, and the
  auction's seed images among them. It is the loader the suite runs on, so
  what the generator writes and what the drift check reads cannot come out of
  two different resolutions.
- `elevatedProcedure` already writes its grants to procedure meta, and the till
  ladder writes `principal`. Nothing else about the ladder is recorded: at
  runtime `public`, `session`, and `session · fresh` are indistinguishable.

The admin console gates its test surfaces at build time on the deploy env the
build injects (`TEST_SURFACES_ENABLED`), and its address table makes an
unregistered surface a compile error. Routers cannot be imported by a browser:
their graph pulls Hono and the database driver.

See `proposal.md` for why.

## Goals / Non-Goals

**Goals:**

- Produce the document from the routers under node, commit it, and fail the
  backend test lane when it drifts — no new check script, no live endpoint.
- Record the caller on the ladder once, so every service's document names it
  the same way and no service restates it.
- Keep the browser graph free of every router.

**Non-Goals:**

- A `design.md`-level treatment of REST routes, prose extraction, or OpenAPI:
  the proposal rules them out; nothing here leaves a hook for them.
- Any change to what a procedure enforces. Meta is added; middleware is not
  touched.

## Decisions

### The caller is recorded on the ladder, as meta

The spec requires four caller words. The ladder factory is the one place all
eight services build from, so each rung records itself:
`authedProcedure` sets `meta.caller = "session"`, `freshAuthedProcedure`
`"fresh"`, `elevatedProcedure` `"elevated"` beside the grants it already
records, and `publicProcedure` records nothing — absence is `public`. tRPC
merges chained `.meta()` calls, so a procedure adding `auditDetails` keeps
its caller. The till's procedures already carry `principal`; the document
names them as a service principal of that kind.

*Rejected:* inferring the caller from the middleware chain (not observable);
a hand-kept map from path to caller in the generator (the drift the whole
change exists to remove); re-typing the ladders as branded types (the
generator reads a value, not a type).

### One flat package, two graphs

`packages/api-docs` (`@grade10/api-docs`), brand-neutral infrastructure,
backend lane. Two subpaths, justified as a runtime boundary in the packages
convention's own terms:

- `.` — the document type, and the committed documents under `generated/`
  read through one loader. Browser-safe; the admin imports this and nothing
  else.
- `./generate` — the walker: imports each service's router, walks its mounted
  procedures, converts every validator to JSON Schema, sorts, and serialises.
  Node-only; its graph carries Hono and the database drivers, which is why it
  is not `.`.

The service list is a table in `./generate`: service id, the router export,
and for the store the till router built with the loyalty acts exactly as the
grade10 assembly mounts it. The ZZZ assembly is not generated: the console
that renders the page is Grade10's, and its store mounts no till.

*Rejected:* placing the generator under `scripts/` (it must load TypeScript
sources; the root scripts run under plain node); a `contracts`/`backend` role
split (there is no product and no wire); a page in the admin that imports
routers (the browser graph).

### Determinism is the serialiser's job

Procedures sort by dotted path, object keys sort, no timestamps, no absolute
paths. `SC-13` holds because nothing in the document depends on where or when
it ran. The commit the page names comes from the build, not the document —
see the next decision.

### Drift is a test, not a script

The package's node-lane suite regenerates every service in memory and asserts
byte equality with `generated/`, failing with the service and the first
differing procedure path. `pnpm run test:backend` — already in the validation
list and in CI — is therefore the check `SC-02` names. A package script
`generate` writes the files; the failure message tells the engineer to run it.

*Rejected:* a `scripts/checks/check-api-docs.mjs` (would need a TypeScript
loader the check runner does not have, and duplicates what the lane already
runs).

### Provenance rides the build, not the document

The admin's Vite config injects one variable today, `VITE_DEPLOY_ENV`, from
the shared app-env helper. The helper gains a second define,
`VITE_BUILD_COMMIT`, read from `GITHUB_SHA` in CI and `git rev-parse HEAD`
locally (`"development"` when neither answers). Because the drift test proves
the committed document matches the routers at every commit that passes CI,
the build's commit *is* the commit the document was read from — `SC-12` —
without writing a commit into the document and breaking `SC-13`.

### The page lives in the console, as a test surface

`apps/admin/grade10/src/pages/api-docs/`, registered in `surfaces.ts` as
`"api-docs": { address: "/api-docs", kind: "test" }` and in `routes.ts`
inside the existing `TEST_SURFACES_ENABLED` branch, with `[]` permissions in
`sections.ts` and the `DEV` category. This is the checkout-test surface's own
pattern; the `satisfies` maps on `SECTION_ICONS`, `WORKSPACE_SUMMARIES`, and
`SECTION_PERMISSIONS` make each missing entry a compile error.

The page holds no data layer: the document is a static import, not a
transport, so there is no port, no query, no DI module. The three async
states do not arise — the only failure a static import has is a build
failure. Filtering is client-side over the loaded documents.

*Rejected:* an `admin-frontend` feature slice with a datasource (a static
import is not a call to a backend); a block in `@grade10/frontend-console`
(one surface's view is not shared furniture).

### Rendering a JSON Schema subset

The renderer handles the subset Effect emits from these routers: `object`
with `properties`/`required`/`additionalProperties`, `array` with
`items`/`minItems`/`maxItems`, `anyOf` (nullable and discriminated
alternatives), `enum`, `const`, `string` with `minLength`/`maxLength`/
`pattern`/`format`, `integer`/`number` bounds including `exclusiveMinimum`,
`boolean`, `null`, and `$ref` into `definitions`. A discriminated `anyOf` is
named by the one property every alternative pins to a single `const`/`enum`
value (`outcome` in the store's checkout). Anything outside the subset
renders as its raw JSON rather than being dropped, and the generator test
lists every distinct keyword seen so a new one is a visible diff.

## Risks / Trade-offs

- [Effect is a release candidate; `toStandardSchemaV1` returning its argument
  and `toJsonSchemaDocument`'s output shape are what the walker leans on] →
  the drift test fails loudly on a bump that changes either; the walker
  asserts `ast` is present on every validator and refuses to emit a document
  from one without it.
- [A schema whose encoded side is not JSON (a `Date`, a `BigDecimal`)
  arrives] → conversion throws; the generator fails the run naming the
  procedure rather than emitting a partial document. None exists today.
- [A router that grows a `cloudflare:workers` import stops loading under
  node] → the generator test fails at import, naming the service; the
  packages convention already keeps worker assemblies behind a subpath for
  this reason.
- [Documents are large and change often, inflating diffs] → one file per
  service, keys sorted, so a diff is the procedure that changed; the admin
  bundle imports them lazily behind the route so a production build carries
  none and a staging build loads them on entry to the surface.
- [`session · fresh` on a query means "re-read now"; on a mutation
  `authedProcedure` also re-reads] → the document records the ladder rung,
  not the read strategy, and the caller table in the spec says so; the page
  does not claim more.

## Migration Plan

1. Land the ladder meta and the app-env define (shared groups). No behaviour
   changes; existing ladder tests still pass and gain assertions on meta.
2. Land the package with its first generated documents and the drift test.
   From this point `test:backend` refuses a router change without a
   regeneration.
3. Land the surface. Staging carries it on the next deploy; production builds
   drop it at build time. Rollback is removing the surface entry — the package
   and its test stand on their own.
