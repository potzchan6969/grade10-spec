# UI: Auction legal pages (Storybook draft)

Layout SoT: Storybook page assemblies under **Pages/Legal** — no Figma frame
for Terms or Privacy. The callout on the Site index already allows shell-
adjacent surfaces settled in Storybook rather than Figma.

## Screens

### Terms of Service

::story{id="pages-legal--terms-of-service" title="Terms of Service"}

Site header, centred document title, two-line last-updated block, section
list, footer. Footer LEGAL links reach this story and Privacy.

### Privacy Policy

::story{id="pages-legal--privacy-policy" title="Privacy Policy"}

Same shell and type scale as Terms; privacy sections from the Storybook
fixture.

## Components

| Export / file | Package | Notes |
| --- | --- | --- |
| `SiteHeader` | `@grade10/ui` | Preview supplies auction-capable chrome props |
| `Footer` | `@grade10/design-system` | Preview supplies legal hrefs to story ids |
| `VStack` | `@grade10/design-system` | Page measure and section stacks |
| `legal-page.tsx` | `apps/preview` | Page assembly only — not a `@grade10/ui` export |
| `legal-content.ts` | `apps/preview` | English draft fixture; not `@grade10/i18n` |

No new design-system primitive or `@grade10/ui` block. Copy stays out of
catalogs until a publish change.

## Typography and spacing (assembly contract)

| Element | Treatment |
| --- | --- |
| Page title | `text-4xl` → `sm:text-5xl` → `lg:text-6xl`, bold, centred |
| Last updated | Two lines — label then date; `text-base`; `text-secondary-foreground`; centred; `gap-lg` under the title |
| After last updated | `mt-20` (80px) before the first section |
| Section headings | `text-3xl font-semibold` |
| Section body | `text-lg`; `text-foreground` |
| Between sections | `gap-16` (64px) |
| Page padding | `py-20` (80px) top and bottom |

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Terms default | Full Terms draft, chrome, footer TERMS link active to this story | **Out of suite:** Storybook play on `pages-legal--terms-of-service` (`skip_specs`) |
| Privacy default | Full Privacy draft, chrome, footer PRIVACY POLICY link active to this story | **Out of suite:** Storybook play on `pages-legal--privacy-policy` (`skip_specs`) |

Live “Being prepared” status on the app routes is unchanged and out of this
file’s screens.
