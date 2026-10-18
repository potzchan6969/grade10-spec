---
title: Shows
spec: grade10-site/site/shows
order: 7
---

`/shows` is the events page: where the community gathers, what the shows
prove at scale, and the record of every edition. It sits inside the same
shell as every surface — [Page Shell](/p/grade10-site/site/page-shell) — and
answers without a session, like any public surface —
[Crawlable Pages](/p/grade10-site/site/crawlable-pages).

## The Page

- 🚧 **Hero** — Grade10 Shows over "Asia’s card shows, at full scale.",
  an Explore Shows jump into the formats and a
  Press Releases link to `/press-releases`, beside a Latest Shows card
  listing the upcoming dates
- 🚧 **Event scale** — Real Trends. In the Room. over a show-floor photo
  and three statistic cards: 25,000+ visitors per show, 120+ exhibitors,
  millions in industry revenue
- 🚧 **Event formats** — Three Platforms. One Community. under a sticky
  pill link list that scrolls to each chapter: Hong Kong (Grade10 FEST HK
  with video and two editions), Overseas Partnership (Seoul Auction ×
  Gana Art with photo and caption), Chinese Mainland (CARDJOY × Grade10
  with video and two editions)
- 🚧 **Edition cards** — each edition carries a photo carousel, a date, a
  description, and a Press Release link to its `/press-releases/{slug}`
  article
- 🚧 **Video presentations** — two chapters carry a poster-first YouTube
  container: the poster and a play affordance, and on click the embed
  plays inside the same container
- 🚧 **Event records** — Every Show. A Milestone. lists the five editions
  newest first: Seoul Auction, FEST Summer 2026, Shanghai, Hangzhou,
  Festival 2025
- 🚧 **Responsive** — wide viewports draw the two-column hero, stats
  beside the photo, and editions side by side; narrow viewports stack
  everything at the page inset

::story{id="site-shows-screens-shows--default" title="The shows page, whole"}

::story{id="site-shows-screens-shows--narrow" title="The shows page, narrow"}

:::detail{title="Product decisions" for="pm"}
`/shows` is for collectors, exhibitors and partners checking where the
community gathers and what the shows prove. It is measured by the visits
it sends to `/press-releases` and its press articles.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Chapter tab semantics | Decided | The pill list is jump navigation over stacked chapters — a click scrolls to the chapter, a scroll-spy moves the active link; it is not exclusive panels. | Product |
| Seoul Auction partner name | Decided | ZZZ is the real partner name — the record reads Seoul Auction × ZZZ × Grade10. | Product |
| Latest Shows entries | Decided | The card lists shows whose month has not passed; an entry that has run out drops off rather than reads as upcoming. | Product |
| Grade10 Festival 2025 date | ❓ Open | The frame dates the edition card NOV 2026 while the live page shows November 2025; the page carries the frame's text until design confirms. | Design |
| Hero card label | ❓ Open | The frame reads LATEST SHOWS while the live page reads "Upcoming Shows"; the page carries the frame's text. | Design |
| Video and poster provenance | ❓ Open | The YouTube ids and poster images are taken from the live page, not annotated in the frame. | Design |
| Navigation entry | ❓ Open | Where Shows sits in the chrome is undecided; the header marks no item current for the page today. | Product |
:::
