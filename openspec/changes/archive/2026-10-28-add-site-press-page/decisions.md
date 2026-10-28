## Goals

- A collector opening `/press-releases` reads the heading, the
  official-record intro, and the releases grouped by year newest first,
  on a page rendered by the design system at any viewport.
- The page's links lead somewhere real: every release row opens its
  `/press-releases/{slug}` article destination.
- The All Time filter narrows the record to one year.
- The workbench renders the page before the site consumes it, at a wide
  and a narrow viewport.

## Non-Goals

- No navigation entry placement — where Press sits in the chrome is
  undecided, and the header marks no item current for the page today.
- No new header or footer — the page composes the production chrome as it
  stands.
- No routing, data fetching, or page shell changes — those belong to the
  implementing site and to `page-shell` / `navigation`.
- No share-metadata or crawler work — `crawlable-pages` already binds
  every public surface the site answers.
- No press-release article surface — this change ships the link
  destinations only.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Whose press items does the list carry? | The live `grade10.com/press-releases` record verbatim - decided by the round | The frame's items — it repeats one placeholder release four times; the task names the live page as the content source |
| Q2 | What does the All Time dropdown do? | A single-select year filter — one option per year the record holds, narrowing the groups shown - decided by the round | Anchor links to each year group — the frame draws a selected item with a check, which reads as a filter |
| Q3 | Which date style wins? | `Sep 15, 2026` — the live page's month-first title casing - decided by the designer | `SEP 15, 2026` — the page carried the frame's casing until design confirmed |
| Q4 | How does the page reveal? | Mount-enter reveal like About - decided by the round | Scroll-driven reveals — the page's below-fold content is a plain list, not a composition that greets the scroll |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/site/press` | Is the date style `SEP 15, 2026` or `Sep 15, 2026`? | Q3 |
| `grade10-site/site/press` | Is the All Time dropdown a filter or jump navigation? | Q2 |
| `grade10-site/site/press` | Where does the Press entry sit in the chrome? | [Press · Navigation entry](/p/grade10-site/site/press) - the footer's Company column, no header item - decided by the round |
