---
title: Typography
spec: grade10-site/site/typography
order: 5
---

Every surface the grade10 site answers renders in one brand sans — Gibson,
from Adobe Fonts — never a system fallback while the design system already
names it.

## One Brand Sans

- **One kit, in the head** — the document head of every page links the one
  Adobe Fonts (Typekit) kit that carries Gibson, first in the cascade
- **Body and heading share it** — body copy and headings render through the
  theme sans stack, the CSS family `canada-type-gibson`; no second brand-sans
  family or stylesheet ships beside it
- **No forced wait** — a blocked or delayed kit request never blocks
  rendering or shows a loading, empty, or error state; the page renders in
  the browser's fallback sans immediately and swaps in Gibson only if and
  when the kit resolves, with no retry or timeout of its own

::cases{id="grade10-site/site/typography"}

:::detail{title="Product decisions" for="pm"}
A collector on staging still saw system sans — Gibson was already decided in
the design system, but the grade10 site's document head never loaded the
kit. Measured by the share of grade10-site surfaces whose head loads kit
`lnk7gwq` and whose body and heading resolve to `canada-type-gibson`: zero
before this shipped, every surface once it did.

**Not in scope.** A new or self-hosted kit. Widening the requirement to
`zzz-site` or the admin consoles — neither is held to Gibson. A loading or
error state, or app-level retry logic, for a blocked kit request. Whether a
crawler or scraper benefits from the kit load — that is
[Crawlable Pages](/p/grade10-site/site/crawlable-pages)' remit, not this
capability's.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Font route | Decided | grade10-site only, through the Typekit kit the design system already names in `family-sans` — no new or self-hosted kit, no widened scope. | Product |
| Blocked-kit behaviour | Decided | No retry, timeout, or render-blocking (FOIT); the page renders immediately in the fallback sans and swaps to Gibson on a FOUT basis if the kit resolves. | Design |
| Non-browser requesters | Decided | The requirement is on the document head markup itself, uniform for every requester; whether a crawler acts on it is out of this capability's remit. | Product |
:::
