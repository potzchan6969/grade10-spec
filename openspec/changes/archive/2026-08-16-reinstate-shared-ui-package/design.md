# Design: reinstate a shared compound-component package

Capability spec: [`shared-ui/component-package`](specs/shared-ui/component-package/spec.md)
(new).

## Package shape

`packages/ui`, published to the workspace as `@grade10/ui`, modeled on
`@grade10/design-system`:

```text
packages/ui/
  package.json          # exports point at src/, react as a peer dependency
  src/
    components/
      store-plp/        # one directory per capability, stories colocated
    index.ts            # re-exports exactly the public exports the specs name
```

- `exports` map: `"."` → `./src/index.ts` plus a `./components/*` subpath,
  matching the design-system convention. No build script, no `dist/`.
- Dependencies: `@grade10/design-system` (workspace), `react`/`react-dom` as
  peers.
- Storybook: same setup as the design system (a11y and vitest addons), run via
  a root `storybook:ui` script through `scripts/storybook.mjs --dir packages/ui`.

## Decisions and alternatives

### One shared component set, organized by capability

Chosen: `src/components/<capability>/`, mirroring capability IDs so a spec and
its implementation are trivially matched.

- *Rejected — `packages/ui/products/<product>/components/`.* A per-product
  partition contradicts the reason the package exists: a component both stores
  render would need a home product or a duplicate. Product differences are
  expressed through props and theme tokens, not through parallel trees.
- *Rejected — a shared core plus a `products/` area now.* No product-specific
  compound component exists yet. Add that area if and when a capability spec
  names an export only one product renders, rather than pre-building structure.
- *Rejected — putting composites in `packages/design-system`.* The design
  system's rules (Figma component-set parity, `check:design-system`) are
  written for primitives; mixing composites in would either dilute those rules
  or wrongly subject composites to them.

### Source-consumed, never prebuilt

Chosen: identical distribution to the design system — `exports` into `src/`,
consumed through the submodule.

- *Rejected — a built package like the removed `@acetrader/pred-spec-ui`.* The
  committed `dist/` and its regeneration commits were the recorded friction
  that led to removal. The design system has since proven cross-submodule
  source consumption works; there is no reason to rebuild the failure mode.

### Dependency direction

`@grade10/ui` depends on `@grade10/design-system`, one way, extending the
decision recorded by `move-primitives-to-design-system`. The package does not
import `@grade10/i18n`: the capability specs require all human-readable
content to be consumer-supplied, so message catalogs stay on the application
side and localization never becomes a package concern.

### Starting empty

The package ships without components: the former featured-markets capability
was retired and removed from the repository, so no existing export moves in.
Each future compound component arrives through its own change, carrying a
capability delta that names the export and this package as its home. The
retired capability's implementation and records remain reachable in git
history if a future change wants to draw on them.

### Design-sync stance for composites

Compound components are not bound to Figma component sets;
`design-code-sync.md` continues to govern primitives only. Composite designs
are referenced from their Figma source. A genuine code/design disagreement in
a composite is recorded as an OpenSpec change, the same rule primitives
follow.

### Theming

Components style exclusively through design-system token values. Each
application applies its own theme CSS (the grade10 theme today; a zzz theme
when its tokens are defined), which is how one component source renders two
branded stores.

## Compatibility

- **grade10**: nothing to migrate. A submodule bump makes the package
  available as the import source for future shared components.
- **zzz-store application**: consumes the package from its first surface;
  nothing to migrate.
- The workspace glob `packages/*` already covers the new package; no
  `pnpm-workspace.yaml` change is needed.

## Validation approach

Repository: `pnpm run typecheck`, `pnpm run lint`, `openspec validate --specs`
and `openspec validate reinstate-shared-ui-package`, and the agent-parity
scripts after instruction edits. Future component changes add story coverage
for every visible state as they land. Store/API/router/analytics wiring
remains verified by the applications' own feature tests, never by the
package.
