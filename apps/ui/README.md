# Preview workbench

The cross-package Storybook. It is not a production application and ships
nothing: it exists so a whole page can be reviewed as a shopper meets it,
rather than as a catalogue of parts.

```bash
pnpm storybook          # this workbench
pnpm test:stories:ui    # its stories, in Chromium
```

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
   and passes it down.
3. Run `pnpm test:stories:ui`.
