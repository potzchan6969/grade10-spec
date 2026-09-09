**Author:** @tangconst - 2026-09-09

## Why

A collector on the grade10 staging site still sees system sans. The brand
sans — Gibson from Adobe Fonts — is already decided in the design system
(`family-sans`, theme sans stack, Typekit kit `lnk7gwq`), and Storybook and
the manual already load the kit, but the grade10 site application does not.
Nothing in the durable specs holds that application to the kit, so staging
can ship without it and nothing fails a requirement.

**Metric:** share of grade10-site surfaces whose document head loads kit
`lnk7gwq` and whose body and heading type resolve to the theme sans stack —
zero on staging today, every surface once this lands.

## What Changes

- **A new capability** `grade10-site/site/typography`: the grade10 site SHALL
  load Gibson for every surface it answers, through the one Adobe Fonts kit
  the design system already names, and SHALL apply that family as body and
  heading type with no second brand sans.
- **The grade10 site application** puts the Typekit stylesheet in the
  document head and renders through the theme sans stack the design system
  already maps.

## Non-Goals

- **A new type scale, weight set, or type role in Figma.** The Typography
  tokens already carry the sizes and leadings; this change does not reopen
  them.
- **Changing the design-system token or preamble.** `family-sans` is already
  `Gibson`; `--font-sans` / `--font-heading` already map to
  `canada-type-gibson`. No further work in grade10-spec packages.
- **Mono.** JetBrains Mono stays the mono stack; this change does not touch
  it.
- **ZZZ.** `zzz-site` is out of scope; it is not held to Gibson.
- **Admin surfaces.** Operator consoles follow `shared/console/visual-standard`,
  not this capability.
- **A PRD.** Brand sans is already a product commitment in `PRODUCT.md`; this
  change only binds the application that was missing the load.

## Capabilities

### New Capabilities

- `grade10-site/site/typography`: how the grade10 site loads and applies its
  brand sans on every surface.

### Modified Capabilities

None.

## Impact

- **grade10-site (application repository)** — document head loads
  `https://use.typekit.net/lnk7gwq.css`; body and heading type use the theme
  sans stack. No page content or layout change.
- **grade10-spec** — durable requirement only. Tokens, preamble, Storybook
  heads, and `DESIGN.md` already match; no package change expected.
- **Backends** — none.
- **ZZZ / admin** — none.
