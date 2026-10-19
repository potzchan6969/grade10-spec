---
title: Company Site
order: 6
---

The company site under `/about` tells readers who Grade10 is. Its press
releases and media coverage are written and published in the admin's
[Press](/p/grade10-admin/press) section; the site shows only what is
published there.

## Press Pages

| Address | Shows | Rendered |
| --- | --- | --- |
| `/about` | The About front page, with a news strip of the newest releases | At build; the strip is read in the browser |
| `/about/press-releases` | Every published release, newest first | On every request |
| `/about/press-releases/<slug>` | One published release, its About blocks and media contacts | On every request |
| `/about/media-coverage` | The coverage list, in the order the admin set | On every request |

- **A publish is live at once** — the index, a release and the coverage are
  read on every request, never from a cache, so a reader's next visit shows
  what was just published or unpublished
- **Not published, not found** — a release address whose slug is unpublished,
  deleted or never made answers 404 with the not-found page
- **News strip** — the About front page lists the newest 7 releases; until
  they arrive, or if they never do, the strip lists nothing
- **Empty** — with nothing published, the index says "No press releases yet."
  and the coverage page "No coverage yet."
- **A missing language** — a release not written in the reader's language
  reads in English, with a note that it is available in English only;
  a coverage headline always reads as the outlet wrote it
- **Sitemap** — lists the index, the coverage page and every published
  release

:::detail{title="Code map" for="engineer"}
- **Surfaces** — `aboutPress`, `aboutPressRelease`, `aboutMediaCoverage` in `apps/frontend/grade10/src/surfaces.ts`
- **Pages** — `apps/frontend/grade10/src/pages/about/press`; the strip is `HomeNews`
- **Reads and renderer** — `@grade10/press-frontend`
- **Design record** — [press architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/press.md#reads)
:::
