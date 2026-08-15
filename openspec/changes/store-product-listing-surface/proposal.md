# The store product-listing surface, shared by both stores

**Author:** @seankcw - 2026-08-15

## Why

A shopper browsing a category is about to meet the same surface in two
applications, and the pieces that surface is made of currently answer to only
one of them.

`packages/design-system/src/pages/product-list-page.stories.tsx` assembles the
whole listing surface today — filter sidebar, result count, sort menu, product
grid, pagination — as ad-hoc JSX inside a story. Nothing about it is a
requirement anyone can check: the four-column grid, the 260px sticky sidebar,
the five sort options, and what happens when a filter matches nothing exist
only as markup in a file the specs do not describe. Both stores are expected to
render this, so the first application to build it will re-derive all of that by
reading a story, and the second will re-derive it differently.

Underneath it, two design-system primitives already answer to Grade10 alone.
`StoreHeader` defaults `logo` to `"Grade10 Marketplace"`, `navItems` to
`SHOP / NEW ARRIVALS / GRADE / AUCTION`, and `utilityLinks` to Grade10's four
utility links. `Footer` defaults its social links, its three link columns, and
its legal row the same way. These are shared components that render one store's
brand and information architecture when asked for nothing. A zzz-store engineer
who writes `<StoreHeader />` gets Grade10's navigation and Grade10's name, and
nothing fails — not a type error, not a check, not a story. The failure is
silent and it ships.

Both problems have the same cause and the same evidence: the components were
built while one store existed, and a second store is now arriving.

## What would move

If this change works, the number of application-owned implementations of the
product-listing surface is zero — one component source, two stores, differing
only by the props and theme tokens each supplies. Without it, that number
trends to one per application.

The second measure is smaller and sharper: the number of shared components
that render a specific store's brand or navigation when a consumer supplies no
content goes from three (`StoreHeader`'s logo, nav, and utility links;
`Footer`'s columns, social, and legal links; `StoreHeader`'s locale label) to
zero.

## Scope

- **A new capability, `shared-ui/store-product-listing`.** The export contract
  for the listing surface: a controlled root, a filter panel, a toolbar, and a
  product grid, all in `packages/ui` and consumed by both stores. These are the
  first components the package ships.
- **Removing store content from design-system defaults.** `StoreHeader` and
  `Footer` keep their Figma-defined shells and lose every default that names a
  store: logo, navigation, utility links, footer columns, social links, legal
  links, and locale label become consumer-supplied. Carried as a delta on
  `shared-ui/component-package`.
- **Retiring `packages/design-system/src/pages/`.** The surface story moves to
  `packages/ui` alongside the components it now exercises, and the undocumented
  `pages/` directory in the design system goes away.

The two halves are one change because the second is what makes the first true:
a shared listing surface whose page chrome silently brands itself Grade10 is
not shared. A reviewer who wants them split can take task group 1 as its own
pull request — it stands alone and lands first.

## Affected component exports and consuming applications

New exports from `@grade10/ui`, named in the capability spec:

| Export | Kind |
| --- | --- |
| `ProductListing` | Component — controlled root for the surface |
| `ProductFilterPanel` | Component — filter groups with counts |
| `ProductListingToolbar` | Component — result count and sort control |
| `ProductGrid` | Component — responsive product tile grid |
| `AsyncState`, `AsyncAction` | Types — discriminated async boundary and its retry/clear affordance |
| `ProductSummary`, `FilterGroup`, `FilterOption`, `FilterSelection`, `SortOption` | Types — normalized presentation data |
| `ProductListingProps`, `ProductFilterPanelProps`, `ProductListingToolbarProps`, `ProductGridProps` | Types — prop shapes |

Changed exports from `@grade10/design-system`:

| Export | Change |
| --- | --- |
| `StoreHeader` | `logo`, `navItems`, `utilityLinks`, `localeLabel`, and `promo` become required; their Grade10 defaults are removed |
| `Footer` | `logo`, `description`, `attribution`, `socialLinks`, `columns`, `copyright`, `legalLinks`, and `locale` become required; their Grade10 defaults are removed |
| `PaginationEllipsis` | Gains an optional `label` for its screen-reader string, which was a hardcoded English `More pages`; the default is unchanged |

`Footer`'s `description` and `attribution` default to Grade10's catalog blurb and
its corporate attribution (`A division of MemeStrategy (HKEX: 2440)`), so they
are store content by the same test as the rest and are removed with them.

Neither component's `logoHref` nor its accessible-name props (`searchLabel`,
`accountLabel`, `wishlistLabel`, `cartLabel`) change. Those name a control's
function rather than any store's content; see the capability delta.

Both Code Connect templates emit a bare `<StoreHeader />` and `<Footer />`
today. With the content props required, that snippet no longer compiles, so
each template is updated to emit the required props.

Consuming applications:

- **grade10** — bumps the submodule SHA. It must supply the header and footer
  content it previously inherited by default, and it adopts the listing surface
  from `@grade10/ui` rather than building one. Its own adapters map catalog and
  search responses into the normalized props.
- **zzz-store application** — consumes both from its first listing surface.
  Nothing to migrate; it never grows a local copy and never inherits Grade10's
  navigation.

## Non-goals

- **No search surface, no product detail page.** Both reuse `ProductGrid` and
  `ProductFilterPanel`, and both are separate capabilities with their own
  changes. This change only proves those two exports are reusable by not
  binding them to the listing root.
- **No filtering, sorting, or pagination logic.** The components render a
  selection and report a change. Which products match a filter, how they are
  ordered, and how many pages exist are computed by the application.
- **No new design-system primitives.** The surface composes what already
  exists. `StoreHeader` and `Footer` change their prop requirements only; their
  markup, tokens, and Figma component sets are untouched.
- **No store chrome composite.** A store's header and footer content is that
  store's information architecture. It stays in the application, which is the
  point of removing the defaults rather than moving them.
- **No message catalog dependency.** `@grade10/ui` does not import
  `@grade10/i18n`; every string reaches these components as a prop.
- **No product decision recorded as a PRD.** This change carries no judgment a
  requirement cannot hold — the product decision to share compound components
  across stores is already recorded by `reinstate-shared-ui-package`. Add a PRD
  if the listing surface later turns on a merchandising choice.

## Compatibility and migration

`@grade10/ui` ships its first exports here, so nothing can break on that side.

The design-system change is breaking for any consumer that relies on the
removed defaults. Today that is the design-system's own stories and the page
story being retired, both fixed in this change; no application renders
`StoreHeader` or `Footer` yet. Making the props required rather than optional
is deliberate — a silent fallback to another store's navigation is the failure
this change exists to remove, so it should be a type error, not a default.

The package remains source-consumed. No build step, no committed artifact, no
version bump: applications move the pinned submodule SHA by normal pull
request.

## Sequencing

The `shared-ui/component-package` delta assumes
[`reinstate-shared-ui-package`](../reinstate-shared-ui-package/proposal.md) is
accepted; that change creates the capability this one adds a requirement to.
Fold its deltas into `openspec/specs/` before folding these.

## Validation

- In this repository: `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run check:design-system`, `pnpm run test:stories`, and
  `openspec validate --specs` plus
  `openspec validate store-product-listing-surface`.
- Story coverage in `packages/ui` for every consumer-observable state the spec
  names — loading, empty, no-match, error, and a narrow viewport — plus a play
  interaction for filter, sort, and page changes.
- In each application: its own build and its feature-level tests for the
  adapters that map catalog data into these props. Filtering, sorting, and
  pagination correctness is verified there, never in the package.
