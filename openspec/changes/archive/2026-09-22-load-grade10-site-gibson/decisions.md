## Goals

- Every surface the grade10 site answers loads Gibson through the one Adobe
  Fonts kit the design system already names, in the document head
- Body and heading type resolve to the theme sans stack — no system-sans
  fallback, no second brand sans

## Non-Goals

- A new type scale, weight set, or type role in Figma
- Changing the design-system token or preamble — `family-sans` is already
  `Gibson`; `--font-sans` / `--font-heading` already map to
  `canada-type-gibson`
- Mono — JetBrains Mono stays the mono stack
- ZZZ — `zzz-site` is out of scope; it is not held to Gibson
- Admin surfaces — operator consoles follow `shared/console/visual-standard`
- A PRD — brand sans is already a product commitment in `PRODUCT.md`; this
  change only binds the application that was missing the load

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which application and font route does this change bind? | grade10-site only, through the existing Typekit kit `lnk7gwq` the design system already names in `family-sans` — decided directly, no interview needed since the kit and family are already fixed in `tokens.json` and `DESIGN.md` | A new or self-hosted kit, or widening scope to `zzz-site`/admin, both ruled out as non-goals |
| Q2 | Does a blocked or delayed Adobe Fonts kit request get any app-level retry, timeout, or render-blocking (FOIT) before falling back to the browser's default sans? | No — the kit is a plain stylesheet link with no retry, timeout, or render-blocking logic; text renders immediately in the fallback sans and swaps in only if and when the kit resolves (FOUT), matching `ui-design.md`'s "not a designed state" - decided by the round | Building a loading or error state, or app-level retry logic, which the design already rules out |
| Q3 | Does the kit-load requirement extend to non-browser requesters — crawlers, scrapers, social-preview fetchers? | No — the SHALL is on the document head markup for every response, uniform for every requester; whether a crawler benefits from the CSS is out of this capability's remit and belongs to `grade10-site/site/crawlable-pages` - decided by the round | A crawler-specific guarantee here, which would duplicate `crawlable-pages`' contract |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/site/typography | Does a blocked or slow kit request retry, or does the page wait and render in system sans until the next full load? | Q2 |
| grade10-site/site/typography | Is there a maximum acceptable delay before falling back to system sans? | Q2 |
| grade10-site/site/typography | Should the kit load block first paint (FOIT) or render immediately with a swap (FOUT)? | Q2 |
| grade10-site/site/typography | Does the kit request need to reach non-browser requesters — crawlers, scrapers, social-preview fetchers? | Q3 |
