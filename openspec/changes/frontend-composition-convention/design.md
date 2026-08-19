## Context

The requirements are in [`specs/frontend-composition/spec.md`](specs/frontend-composition/spec.md).

The application repository already composes with Inversify: each product frontend package owns a `src/core/` of ports and a core-module factory, each feature slice owns a `ContainerModule`, and an application's `src/di/container.ts` builds the clients and loads the modules. Four of the seven packages already publish a module list; the convention is half-built, not new.

The constraints that shape the approach:

- A package may not import a design system, and a `*Module` may not be imported by anything but a composition root — both are existing rules in `docs/conventions/packages.md` and the `react-clean-architecture` skill.
- Packages are source-only and workspace-linked: `exports` point at `./src` with no build step, so a new subpath is a `package.json` entry and nothing else.
- `loyalty-frontend` has no application consumer today — only its own test harness resolves its core module — so renaming its factory touches one package.
- The grade10 storefront builds one chunk per route and checks what a cold visit downloads. A module list is loaded eagerly by the composition root either way, so gathering slices into a list moves nothing between chunks.

## Decisions

### The list is a package-root module, not a barrel export

Each product's list lives in its own file at the package root (`storeModules.tsx`, `authModules.tsx`) and is reached at a `./modules` subpath, rather than being one more export of the package's main barrel.

A barrel cannot carry order, and `organizeImports` re-sorts a barrel's exports on the first `lint:fix` — an existing finding in `docs/conventions/code-layout.md`. More importantly a barrel over the whole package would pull every slice's presentation into any consumer that wanted only the list. The dedicated subpath keeps the list's import graph to the slices themselves.

*Rejected: a `.` barrel exporting `modules` alongside components.* It makes the anti-pattern easy — an application reaching for a single module from the same import — and the packages deliberately have no `.` export today.

*Rejected: deriving the list by directory scan.* Vite could glob `src/features/*/*/index.ts`, but the list would then be silent about order and a slice would join it by existing rather than by declaring itself composable. The list is a value with a reason on it, which `docs/conventions/code-layout.md` already prefers over adjacency.

### The list ships even for a one-slice package

`auth-frontend` defines one composable slice (sign-in; sign-out binds nothing and is a hook over a port the core module already binds). The list is published anyway.

The alternative — publish the list when the second slice arrives — puts the cost exactly where it is highest: at that moment every composition root and test harness changes, which is the edit the convention exists to prevent. Publishing the one-entry list makes the second slice a one-line change in the package. This matches the existing rule that a one-file folder still carries its `index.ts` so nobody re-decides when the second file arrives.

### A focused test may still load one module

The spec keeps a single-module load legal for a test exercising one slice. Four `SignInPage.test.tsx` files compose one core module plus one feature module against a fixture client; folding them onto the full list would widen what each test installs without making the assertion stronger.

The line drawn is by role, not by file type: a harness that stands in for a whole application (`renderAt.tsx`, a package's `test/harness.tsx`) composes the list, because its doc comment claims it composes the way the application does — and a claim that drifts is worse than the duplication.

*Rejected: forbidding the direct load entirely.* It would force every slice test through the product's full list, so an unrelated slice's binding failure fails an unrelated test.

### A core-module factory carries its product, not its layer

`createStoreCoreModule`, `createAuthCoreModule`, `createAuctionCoreModule` — the product, then the role. Two names do not fit: `loyalty-frontend` exports `createCoreModule`, and `store-admin-frontend` exports `createAdminCoreModule`, which names the layer and leaves the product implicit.

`createAdminCoreModule` is the harder one and the reason the requirement says "product" rather than "not generic": a brand's panel composes the store admin, the auction admin, and the audit trail, so "admin" identifies none of them. `createStoreAdminCoreModule` reads at the call site next to `createAuctionAdminCoreModule`.

*Rejected: leaving `loyalty-frontend` alone because nothing consumes it.* Having no consumer is what makes it cheap to fix now; the first application to compose loyalty inherits the ambiguity otherwise.

### An application's clients group in a directory, one per client

An application constructs its clients in `src/clients/`, one module each, with the shared cache its own module beside them.

The cache is the case that motivates the split. Left as an export of the store client's module, cache-wide policy — a global error handler, retry defaults — has to be added to a file named for one backend. The admin panel already discovered this from the other direction: its `trpc/queryClient.ts` exists because four backends need one cache, and it grew a two-factor gate handler and a router-name-disjointness proof that belong to none of them.

*Rejected: a directory per transport (`trpc/`, `auth/`).* Three of the four applications reach exactly one backend per transport, so the level separates nothing. The admin panel's existing `trpc/` folder earns its keep by holding four clients, and stays.

*Rejected: leaving flat modules at the source root.* It works at two clients and stops working at four — and the root of a framework-mode SPA is already crowded with files the framework pins by name.

## Risks / Trade-offs

- **A published list is a wider surface than a single module.** A consumer that wanted one slice can no longer express that through the package entry. Accepted: that consumer is the anti-pattern, and the test exception covers the legitimate case.
- **Renaming an exported factory touches every consumer in one commit.** Mitigated by the type checker — these are workspace-linked source packages, so a missed call site is a compile error, not a runtime one.
- **The convention is not mechanically enforced.** `pnpm run check:libs` guards package wiring that fails silently, and a rule about which subpath a composition root imports from could join it. Not proposed here: the failure is loud (a missing binding throws on first resolve) and the check's existing subjects are all silent failures. Revisit if a composition root drifts back.

## Migration Plan

Every step is additive at the package end and mechanical at the application end; nothing needs a deploy to be safe, and no two groups have to land together.

1. A package gains its list and its `./modules` entry. Existing single-module imports keep working, so nothing breaks between this and step 2.
2. Composition roots switch to the list. Type-checked, so the switch is complete or it does not compile.
3. Factory renames land as one commit each, all call sites together.
4. Applications group their clients. Pure file moves plus import rewrites.

A package-root module must be added to its `tsconfig.json` `include` in the same edit. `include: ["src"]` silently leaves a root-level file untypechecked — a known silent failure in `docs/conventions/code-layout.md`, and `store-frontend`'s tsconfig already carries the entry for its list.

## Open Questions

- Whether `packages/*/demo` applications are bound by the client-grouping requirement. They are applications by shape but ship nowhere, and each reaches one fixture-backed client today. Answering either way changes no spec scenario and no task: the demos already satisfy the list requirement through the same composition root they always used.
