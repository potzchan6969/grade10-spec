---
title: Media Coverage
spec: grade10-site/site/media-coverage
order: 9
---

`/media-coverage` is the record of what the press says about Grade10:
every external story, each card naming its publication and title, each
opening the report on the publisher's site. It sits inside the same shell
as every surface — [Page Shell](/p/grade10-site/site/page-shell) — and
answers without a session, like any public surface —
[Crawlable Pages](/p/grade10-site/site/crawlable-pages). Editors compose
the entries in the Admin Portal; the card carries the publication, the
title and the link, nothing else.

## The Page

- 🚧 **Header** — an IN THE NEWS eyebrow over "Media Coverage" and the
  external-reporting intro: coverage across Grade10 events, collectible
  markets, vaulting, finance, and the wider trading card ecosystem
- 🚧 **The record** — the coverage as a grid of media cards, each naming
  the story's publication and title over a Read article affordance
- 🚧 **Every card a link** — the whole card opens its story on the
  publisher's site in a new tab; on hover the card lifts a touch, draws
  a soft shadow, and its border strengthens
- 🚧 **Responsive** — wide viewports lay the cards four across; narrow
  viewports stack them in a single column under the header, each card
  slimmer (smaller padding, minimum height and title)

- **Copy - Eyebrow style** - the page writes `IN THE NEWS` from a
  sentence-case source; the uppercase is the style, not the data
- ❓ Design - **Card overrides** - the frame's card instance binds
  `radius-3xl`, `gap-6` padding, `size-56` minimum height and a
  `border-strong` hover; the published `Card` set binds `radius-2xl` and
  `gap-4`. The page composes the frame's values as overrides until design
  confirms which is the contract
- ❓ Design - **Card shadow** - the frame's hover variant draws a soft
  drop shadow bound to no variable; the page ships a weakened house
  shadow (`0 4px 16px -4px` of `--shadow-color`) until design names
  the effect
- ❓ Design - **Publication colour** - the label draws `#77736b`, bound
  to no variable; the page renders `secondary-foreground` until design
  names the token
- **Navigation entry** — Media Coverage sits in the footer's Company
  column; the header lists no item for the page and marks nothing
  current
- **Copy - Title length** - every card holds one height: the publication
  truncates to one line and the title clamps — three lines on small
  viewports, four at `sm` — so a long CMS title ends in an ellipsis
  rather than a taller card
- **Content - coverage list** - the grid carries the live
  `grade10.com/media-coverage` record verbatim; the frame's items are
  placeholders
