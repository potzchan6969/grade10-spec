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
  publisher's site in a new tab; the card's border strengthens on hover
- 🚧 **Responsive** — wide viewports lay the cards four across; narrow
  viewports stack them in a single column under the header

- **Copy - Eyebrow style** - the page writes `IN THE NEWS` from a
  sentence-case source; the uppercase is the style, not the data
- ❓ Design - **Card overrides** - the frame's card instance binds
  `radius-3xl`, `gap-6` padding, `size-56` minimum height and a
  `border-strong` hover; the published `Card` set binds `radius-2xl` and
  `gap-4`. The page composes the frame's values as overrides until design
  confirms which is the contract
- ❓ Design - **Publication colour** - the label draws `#77736b`, bound
  to no variable; the page renders `secondary-foreground` until design
  names the token
- ❓ Product - **Navigation entry** - where Media Coverage sits in the
  chrome is undecided; the header marks no item current for the page
  today
- **Copy - Title length** - every card holds one height: the publication
  truncates to one line and the title clamps at four, so a long CMS
  title ends in an ellipsis rather than a taller card
- **Content - coverage list** - the grid carries the live
  `grade10.com/media-coverage` record verbatim; the frame's items are
  placeholders

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7204-11244" title="Media Coverage — the desktop frame"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7204-11432" title="Media Coverage — the media card"}
