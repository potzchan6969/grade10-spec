**Author:** @tangconst - 2026-09-28

## Why

An unknown address already answers with the site's not-found surface, but the
catalogs still put the failed path in the title, and there is no Storybook
page that settles what the collector sees. Specs and journeys still say the
surface names the address that failed — a product choice this change drops.

**Metric:** collectors who land on not-found leave via Back to Home rather
than retrying the same address from words on the page; Storybook Pages/Not
Found is the review surface for the static copy.

## What Changes

- **Static not-found copy** in shared `notFound` catalogs (all four locales):
  title and description with no path placeholder; CTA stays `common.backToHome`
- **Not-found no longer names the failed path** — **BREAKING** against the
  current navigation requirement and journey wording that the surface names
  the address that failed
- **Pages/Not Found Storybook assembly** — site chrome, centred static title
  and description, Back to Home; layout SoT with no Figma frame
- **Navigation pages** on grade10 and ZZZ record the static words outcome

## Non-Goals

See `decisions.md`.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/site/navigation` — not-found fallback no longer names the
  failed address; surface copy is the static catalog words
- `zzz-site/site/navigation` — same not-found words rule (shared catalogs)

## Impact

- **`@grade10/i18n`** — `shared/*/notFound.json` title and description
- **`apps/preview`** — `not-found-page.tsx`, `not-found-content.ts`,
  `not-found-page.stories.tsx`
- **grade10 and ZZZ SPAs** — not-found views must stop interpolating a path
  into title/description and match the static catalogs (application work)
- **No new `@grade10/ui` export** — pages stay brand-owned assemblies

## Open questions

None — path omitted, static catalogs, Storybook SoT, both brands share the
words. Settled in the interview (`decisions.md`).

## References

- [Navigation · One Address, One Surface](../../../docs/prds/products/grade10-site/site/navigation.md#one-address-one-surface)
- [ZZZ Navigation · Not Found](../../../docs/prds/products/zzz-site/site/navigation.md#not-found)
- Storybook: `Pages/Not Found`
