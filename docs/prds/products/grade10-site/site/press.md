---
title: Press
spec: grade10-site/site/press
order: 8
---

`/press-releases` is the record page: every release Grade10 has
published, grouped by year newest first, each row opening its article
at `/press-releases/{slug}`. It sits inside the same shell
as every surface — [Page Shell](/p/grade10-site/site/page-shell) — and
answers without a session, like any public surface —
[Crawlable Pages](/p/grade10-site/site/crawlable-pages).

## The Page

- 🚧 **Header** — a PRESS eyebrow over "Press Releases" and the
  official-record intro: the card festivals, the vault, the
  partnerships, and the growth of Asia's trading-card market
- 🚧 **Year filter** — an All Time dropdown at the header's foot carries
  one option per year the record holds and narrows the list to the
  chosen year
- 🚧 **The record** — the releases grouped under year headings, 2026
  before 2025, each newest first; every row — date, title, arrow — is
  the link to its `/press-releases/{slug}` article
- 🚧 **Responsive** — wide viewports lay the filter beside the intro and
  each release as a date-title-arrow row; narrow viewports stack the
  filter under the header and each date over its title
- 🚧 **Article header** — a Press breadcrumb back to the record over the
  release's title, its publish date and its location badges
- 🚧 **Feature image** — the article's 1200:630 lead image; the same
  asset is its OG image
- 🚧 **Article body** — what an editor composes in the admin portal:
  paragraphs, bold and inline links, headings two through six, bullet
  and numbered lists, blockquotes, and images with or without captions,
  each drawn in the template's own styles
- 🚧 **Sidebar** — About Grade10, About MemeStrategy and Media
  Enquiries, fixed cards every article shares; sticky beside
  the body on a wide viewport, after it on a narrow one

- **Copy - Date style** - the page writes `Sep 15, 2026`: the live
  page's month-first title casing, confirmed by design
- **Product - Filter semantics** - the frame draws an All Time
  dropdown with a checked item; the page treats it as a year filter
  rather than jump navigation to each group
- **Navigation entry** — Press Releases sits in the footer's Company
  column; the header lists no item for the page and marks nothing
  current
- **Content - release list** - the list carries the live
  `grade10.com/press-releases` record verbatim; the frame's items are
  placeholders
- **Content - article sample** - the workbench's article carries the
  live CARDJOY x Grade10 Guangzhou release verbatim; every other release
  answers the same template
