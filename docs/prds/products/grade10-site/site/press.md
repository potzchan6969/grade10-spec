---
title: Press
spec: grade10-site/site/press
order: 8
---

`/press-releases` is the record page: every release Grade10 has
published, grouped by year newest first. It sits inside the same shell
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

- ❓ Copy - **Date style** - the page writes `SEP 15, 2026` while the
  live page writes `Sep 15, 2026`; the page carries the frame's
  month-first casing until design confirms
- ❓ Product - **Filter semantics** - the frame draws an All Time
  dropdown with a checked item; the page treats it as a year filter
  rather than jump navigation to each group
- ❓ Product - **Navigation entry** - where Press sits in the chrome is
  undecided; the header marks no item current for the page today
- **Content - release list** - the list carries the live
  `grade10.com/press-releases` record verbatim; the frame's items are
  placeholders
- **Product - article surface** - the `/press-releases/{slug}` articles
  the rows link to are still work in progress; this page ships the
  destinations

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7201-9699" title="Press — the desktop frame"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7201-10240" title="Press — the release row"}
