**Author:** @seankcw - 2026-08-19

## Why

Adding a feature slice to a product's frontend does not reach the applications that show that product. Each application's composition root names the individual feature modules it loads, so a new slice is invisible until every root is edited — and a root that is missed fails at runtime, when a page resolves a token nothing bound, rather than at compile time.

The evidence is in the merged admin panel. `apps/admin/grade10/src/di/container.ts` names seven feature modules across four products by hand; its ZZZ sibling names its own subset. A slice added to either admin frontend package today reaches neither panel on its own, and nothing reports that. Two storefronts already avoid this for two of their products, because those packages publish their modules as one list — but the same repository has four packages that publish a list, three that do not, and one core-module factory whose name does not say which product it composes, so a root loading several reads ambiguously.

This change makes one convention out of the half of it that already works: a product frontend package publishes every DI module it defines as one list, and an application loads lists. Success is a feature slice reaching every application that shows its product with no composition root changing, and an application's composition root readable as the list of products it composes.

## What Changes

- Add the `frontend-composition` capability: what a product frontend package publishes for composition, and what an application's composition root may load.
- Require every product frontend package — user-facing and admin alike — to publish its feature DI modules as one list at a dedicated subpath, including a package with a single slice today.
- Require an application's composition root to load those lists rather than an individual feature module, and keep the single-module load legal only for a test exercising one slice.
- Require a core-module factory's exported name to carry its product, so a root composing several products reads unambiguously.
- Require an application to construct its outbound clients in one place, one module per client, with the shared response cache separate from any one client.

## Capabilities

### New Capabilities

- `frontend-composition`: How a product's frontend features are published for composition and how an application assembles them.

### Modified Capabilities

- None.

## Impact

- Affected consumer: the Grade10 application repository — `packages/*/frontend`, `packages/*/admin-frontend`, and every `src/di/container.ts` under `apps/`.
- Four packages already publish a list (`store-frontend`, `auction-frontend`, `auth-frontend`, `loyalty-frontend`); three do not (`store-admin-frontend`, `auction-admin-frontend`, `audit-admin-frontend`).
- Two core-module factories do not name their product: `loyalty-frontend`'s names none, `store-admin-frontend`'s names the role rather than the product.
- One SPA groups its constructed clients; three applications keep them at their source root.
- Durable guidance lands in `docs/conventions/packages.md` and the application repository's `react-clean-architecture` skill.
- No user-visible behavior, no wire contract, no design-system export, and no backend change. Every binding that resolves today resolves after.

## Non-goals

- Deriving an application's product set from a registry — which products a panel composes stays written out, because a brand's registry is a deployment fact and a panel's contents is a product decision.
- Collapsing the per-product core modules or their ports into one; each product keeps its own, so a renamed procedure fails to compile against that product's port alone.
- A feature slice list that an application can filter or reorder — the list is every module the product defines, or it is not the thing a slice joins.
- Changing how a feature slice is laid out internally, or how its bindings are tested.
