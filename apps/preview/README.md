# Preview app

The cross-package Storybook, `@grade10/preview`. It is not a production
application and ships nothing: it exists so a whole page can be reviewed as a
shopper meets it, rather than as a catalogue of parts.

```bash
pnpm storybook                 # the page assemblies alone
pnpm storybook:workbench       # those assemblies plus both packages' stories
pnpm test:stories:app          # the assemblies, in Chromium
```

The workbench build is published on every push to `main` (and on demand) to
**https://grade10-storybook.memeland-qa.workers.dev**. Locally:

```bash
pnpm run storybook:deploy:staging             # needs CLOUDFLARE_API_TOKEN
```

Two Storybook configs live here, and they differ only in which stories they
load. `.storybook/` is the page assemblies alone. `.storybook-workbench/`
extends it — same addons, same preview, re-exported rather than restated — with
both packages' colocated stories read in place, so the sidebar carries the
assemblies, then the `@grade10/ui` compound components, then the
`@grade10/design-system` primitives, and a primitive can be opened beside the
page that composes it. Nothing is copied into this workspace; `pnpm
storybook:ui` and `pnpm storybook:design-system` remain the focused
single-package views.

Tests run against `.storybook/` only, so each package keeps testing its own
stories rather than having them run a second time here.

## What belongs here

Assemblies — whole pages composed from `@grade10/design-system` primitives and
`@grade10/ui` compound components. This is the only workspace that can import
both, which is what makes it the right home for a page.

It also plays the part of a consuming store: every string, every filter group,
and every product is supplied from `src/pages/store-content.ts`, and the state
loop for filters, sort, page, and cart lives in the page component. Neither
package holds any of it, so if a page renders correctly here, an application
can render it the same way.

| Layer | Home |
| --- | --- |
| Primitive stories | `packages/design-system`, colocated with each primitive |
| Compound component stories | `packages/ui`, colocated with each component |
| Page assemblies | here |

A page story is an example, never a contract. Anything testable about a
surface — its column progression, its empty and error behavior, its
accessible structure — belongs in that capability's spec under
`openspec/specs/`, not in a story here. A story that starts carrying
requirements is how `packages/design-system/src/pages/` went wrong.

## Adding a page

1. Put the content in `src/pages/<page>-content.ts`. Never import it from a
   package: content that lives in a package is content a second store would
   inherit.
2. Write `src/pages/<page>.stories.tsx` with a component that owns the state
   and passes it down. Declare `layout: "fullscreen"` in its meta; the default
   here is `centered`, so that the primitives and compound components the
   combined view borrows frame as they do in their own Storybook.
3. Run `pnpm test:stories:app`.
