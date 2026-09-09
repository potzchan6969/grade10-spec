# UI — load-grade10-site-gibson

## Screens

No screen is added, moved, or re-laid-out. There is no new Figma frame —
layout stays with each surface's own capability. This change only binds the
brand sans every grade10-site surface already sits under.

**Type source of truth** — Figma Typography collection, token `family-sans`
value `Gibson` (projected into `packages/design-system/tokens.json`). The
frame for any given page remains that page's own design; type family is not
re-specified per screen here.

Every grade10-site surface is in scope: marketing, store, auction, loyalty,
vault, profile, sign-in, and not-found. The visible delta on each is the
family, not the arrangement.

## Components

No design-system primitive, `@grade10/ui` export, variant, or token is added
or altered by this change.

| Already present | Where |
| --- | --- |
| Typography token `family-sans` = `Gibson` | `packages/design-system/tokens.json` |
| `--font-sans` / `--font-heading` → `canada-type-gibson` | `packages/design-system/src/theme.preamble.css` |
| Kit load pattern (`<link>` to `lnk7gwq`) | `DESIGN.md`; Storybook / preview / manual `preview-head.html` files |

**Nothing in this change is work in grade10-spec packages.** The application
repository loads the same kit the design system already documents. Flag for
`tasks.md`: grade10-site document head only.

## States

| State | Spec scenario |
| --- | --- |
| Kit in the document head on every surface | `grade10-site-site-typography-SC-01` |
| Body and headings render as Gibson | `grade10-site-site-typography-SC-02` |
| No second brand sans | `grade10-site-site-typography-SC-03` |

No loading, empty, or error UI is introduced — a blocked or delayed kit falls
back to the browser's sans stack without a product-owned empty or error
surface. That fallback is not a designed state in this change.
