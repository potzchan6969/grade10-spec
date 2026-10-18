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
| Q2 | What does a media card's hover do? | The card's border strengthens to `border-strong` - decided by the round | A fill or arrow move — the frame's hover variant binds `Base/border-strong` and nothing else |
| Q3 | How does the page reveal? | Mount-enter reveal like About and Press - decided by the round | Scroll-driven reveals — the page's below-fold content is a plain grid, not a composition that greets the scroll |
| Q4 | How does the grid collapse on a narrow viewport? | One column, two at `sm`, four at `lg` - decided by the round | No small-viewport frame exists; the collapse follows the About page's convention |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/site/media-coverage` | The card instance in the frame binds `radius-3xl`, `gap-6`, `size-56` and `container-3xs`; the published `Card` set binds `radius-2xl` and `gap-4`. Intentional override or drift? | ❓ on [Media Coverage](/p/grade10-site/site/media-coverage) — the page composes the frame's values as overrides |
| `grade10-site/site/media-coverage` | The publication label binds no colour variable (`#77736b`). Which token? | ❓ on [Media Coverage](/p/grade10-site/site/media-coverage) — `secondary-foreground` ships |
| `grade10-site/site/media-coverage` | Where does the Media Coverage entry sit in the chrome? | ❓ on [Media Coverage](/p/grade10-site/site/media-coverage) — no item marked current today |
