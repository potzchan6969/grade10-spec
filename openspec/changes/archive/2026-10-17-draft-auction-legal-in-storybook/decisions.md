## Goals

- Put auction-launch Terms and Privacy draft copy and typography in
  Storybook so reviewers can read them before live catalogs change
- Keep live `/legal/terms` and `/legal/privacy` on “Being prepared” until
  wording is confirmed

## Non-Goals

- Publishing confirmed wording to `@grade10/i18n` or the live site in this
  change
- Opening a new `legal-pages` capability — when wording ships, use deltas on
  existing site capabilities only
- Wiring grade10’s `LegalPage` (`LEGAL_SECTIONS`, last-updated keys,
  typography) in this change
- Counsel-approved legal claims — the Storybook fixture is a product draft
  for review, not counsel’s text
- Translations of the draft in Storybook — English fixture only until the
  live catalogs change

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Ship sample Terms/Privacy on live `/legal/terms` and `/legal/privacy` now, or keep them in Storybook until wording is confirmed? | Stay in Storybook until wording is confirmed (author’s choice) | Publish sample catalogs to live now, marked pending counsel — rejected: live must not claim unfinished wording |
| Q2 | New `grade10-site/site/legal-pages` capability, or deltas only on existing site capabilities when requirements land? | Deltas only on existing capabilities when a later change publishes wording (author’s choice) | A new legal-pages capability — rejected: carriage and chrome already live under carried-surfaces and page-shell |
| Q3 | Does this change include grade10 app `LegalPage` wiring? | Out of this change — waits on confirmed wording, same gate as live catalogs (decided by the round; author was unsure) | Wire `LEGAL_SECTIONS` and typography in the app now against draft copy — rejected: would put draft wording one submodule bump from production while catalogs still say Being prepared only if the section list stays frozen; safer to keep app and catalogs together in the publish change |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| — | — | — |
