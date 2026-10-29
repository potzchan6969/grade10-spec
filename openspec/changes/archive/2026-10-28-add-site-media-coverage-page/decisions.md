## Goals

- A collector opening `/media-coverage` reads the heading, the
  external-reporting intro, and the coverage as a grid of media cards, on
  a page rendered by the design system at any viewport.
- The page's links lead somewhere real: every media card opens its story
  on the publisher's site in a new tab.
- The workbench renders the page before the site consumes it, at a wide
  and a narrow viewport.

## Non-Goals

- No navigation entry placement — where Media Coverage sits in the chrome
  is undecided, and the header marks no item current for the page today.
- No new header or footer — the page composes the production chrome as it
  stands.
- No routing, data fetching, or page shell changes — those belong to the
  implementing site and to `page-shell` / `navigation`.
- No share-metadata or crawler work — `crawlable-pages` already binds
  every public surface the site answers.
- No editing surface — entries are composed in the Admin Portal; this
  change ships the reading surface only.
- No filter or grouping — the frame draws one flat grid and the live
  record carries no dates for the cards.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Whose media items does the grid carry? | The live `grade10.com/media-coverage` record verbatim - decided by the round | The frame's items — it repeats one placeholder card five times; the task names the live page as the content source |
| Q2 | What does a media card's hover do? | The card lifts 4px, draws a soft shadow, and its border strengthens to `border-strong` - decided by the designer | A fill or arrow move — the frame's hover variant draws the shadow and binds `Base/border-strong`; the lift is the designer's addition on top |
| Q3 | How does the page reveal? | Mount-enter reveal like About and Press - decided by the round | Scroll-driven reveals — the page's below-fold content is a plain grid, not a composition that greets the scroll |
| Q4 | How does the grid collapse on a narrow viewport? | One column, two at `sm`, four at `lg`; the card slims to `p-5`, `min-h-48` and a `text-base` title - decided by the designer | No small-viewport frame exists; the collapse and the compaction follow the sibling pages' conventions |
| Q5 | Do cards grow with long CMS entries? | No — every card holds one height: the publication truncates to one line and the title clamps, three lines on small viewports and four at `sm`, ending in an ellipsis - decided by the designer | Free-height cards — the frame's `self-start` rows let card heights vary |
| Q6 | Do the card's overrides, hover shadow and publication colour stand? | The card composes the frame's values (`radius-3xl`, `gap-6`, `size-56`, `border-strong` on hover) over the published `Card`; the hover shadow is the weakened house shadow `0 4px 16px -4px` of `--shadow-color`; the publication label is `secondary-foreground` - decided by the round. Recorded in `ui-design.md` | Adopting `radius-2xl`/`gap-4`, a new shadow token or a new colour token — nothing in the frame or the published set names one |
| Q7 | Where does the Media Coverage entry sit in the chrome? | The footer's Company column; the header lists no item for the page and marks nothing current - decided by the round, as the PRD's Navigation entry line states | A header item — none is placed or marked current today |
| Q8 | What does the page show while no coverage is published? | The header block over an empty grid, no message - decided by the round | A designed empty message — no frame draws one |
| Q9 | In what order do the cards run? | The order the Admin Portal publishes them - decided by the round | A fixed sort — the cards carry no date to sort by |
| Q10 | Does a card mark a story written in another language? | Yes, the card's link marks the story's language - decided by the round, stated on the PRD | Dropping the marking — the block already carries it |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/site/media-coverage` | The card instance in the frame binds `radius-3xl`, `gap-6`, `size-56` and `container-3xs`; the published `Card` set binds `radius-2xl` and `gap-4`. Intentional override or drift? | Q6 |
| `grade10-site/site/media-coverage` | The publication label binds no colour variable (`#77736b`). Which token? | Q6 |
| `grade10-site/site/media-coverage` | The card's hover drop shadow binds no variable. Which effect? | Q6 |
| `grade10-site/site/media-coverage` | Where does the Media Coverage entry sit in the chrome? | Q7 |
| `grade10-site/site/media-coverage` | What does the page show while the Admin Portal has published no coverage? The site draws the header block over an empty grid (`mediaCoverageOf(null)` is `[]`); no frame or PRD line draws an empty state. Options: (A) the header over nothing; (B) a designed empty message. recommended: A | Q8 |
| `grade10-site/site/media-coverage` | In what order do the cards run? The site keeps the order the Admin Portal publishes; the PRD and frame name none. Options: (A) the editor's order; (B) a fixed sort. recommended: A | Q9 |
| `grade10-site/site/media-coverage` | A card whose story is in another language marks it (`lang` and `hrefLang` on the link), and the block's `MediaItem` carries the optional field. No PRD line states it. Options: (A) keep and state it on the PRD; (B) drop the marking. recommended: A | Q10 |
