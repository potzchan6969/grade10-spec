**Author:** @tangconst - 2026-09-24

## Why

Auction launch already carries Terms and Privacy addresses, but the live
pages still say “Being prepared”, and nobody has a place to review auction-
shaped draft wording and page typography before Legal confirms what ships.
Without a Storybook assembly, review happens only after catalogs and the app
page change together.

**Metric:** reviewers open Pages/Legal in the workbench and can read draft
Terms and Privacy end to end; live `/legal/terms` and `/legal/privacy` still
show “Being prepared” until a later change publishes confirmed wording.

## What Changes

- **Storybook Terms of Service and Privacy Policy page assemblies** under
  Pages/Legal — site chrome, centred title, two-line last-updated date,
  section headings and body, with the agreed spacing and type scale
- **Draft auction-launch copy as a Storybook fixture** — not written into
  `@grade10/i18n` `legal` catalogs
- **Workbench footer legal links** point at those stories so chrome review
  reaches them
- **Compliance PRD** records that the live pages stay “Being prepared” and
  that the draft lives in Storybook until counsel confirms wording

## Non-Goals

See `decisions.md`.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- none — this change sets `skip_specs: true` because live Terms and Privacy
  behaviour does not move; a later change that publishes confirmed wording
  will use deltas on existing site capabilities (not a new capability)

## Impact

- **`apps/preview`** — `legal-page.tsx`, `legal-content.ts`,
  `legal-page.stories.tsx`; footer hrefs in `store-content.ts` /
  `workbench-story-nav.ts`
- **`@grade10/i18n`** — unchanged: `legal` catalogs keep the “Being prepared”
  status section
- **grade10 SPA** — unchanged in this change; live `LegalPage` still reads
  catalogs and still lists the status section

## Follow-on changes

- Publish confirmed Terms and Privacy into shared `legal` catalogs and adapt
  the app’s `LegalPage` (section list, last-updated lines, typography) once
  wording is confirmed — deltas only on existing capabilities

## Open questions

- Who confirms the draft wording before it may leave Storybook — Legal
  counsel, Product, or both? Recorded as ❓ on
  [Compliance and Readiness](/p/grade10-site/vault/compliance-and-readiness)

## References

- [Compliance and Readiness · Outside the code](/p/grade10-site/vault/compliance-and-readiness#outside-the-code)
- Storybook: `Pages/Legal` → Terms Of Service, Privacy Policy
