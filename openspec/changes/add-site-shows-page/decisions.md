## Goals

- A collector opening `/shows` reads the hero, the scale of the events,
  the three format chapters and the record of past editions, on a page
  rendered by the design system at any viewport.
- The page's links lead somewhere real: Press Releases to
  `/press-releases`, each edition's Press Release to its article.
- Videos play inside the page — poster first, embed on click — without
  navigating away.
- The workbench renders the page before the site consumes it, at a wide
  and a narrow viewport.

## Non-Goals

- No navigation entry placement — where Shows sits in the chrome is
  undecided, and the header marks no item current for the page today.
- No new header or footer — the page composes the production chrome as it
  stands.
- No routing, data fetching, or page shell changes — those belong to the
  implementing site and to `page-shell` / `navigation`.
- No share-metadata or crawler work — `crawlable-pages` already binds
  every public surface the site answers.
- No press-release index or article surfaces — this change ships the link
  destinations only.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does the pill tab list over the chapters do? | Jump navigation — all three chapters render stacked; a tab click scrolls to its chapter and a scroll-spy moves the active tab - decided by the round | Exclusive `Tabs`/`TabsContent` panels — the frame draws all three chapters below the list at once |
| Q2 | Where do the story's images come from? | Hotlinked `grade10.com` asset paths in the content module - decided by the round | Downloaded `.fixture.webp` files — ~40 images of repo weight; the live paths are the source the task names |
| Q3 | Which copy wins where the frame and the live page disagree? | The Figma frame verbatim - decided by the round | Live copy — the frame is the redesign; mismatches (Festival 2025 dated NOV 2026) are flagged ❓ on the PRD for design to sync back — the hero card label since settled on Upcoming Shows. ZZZ is the real Seoul partner name, confirmed by the product owner |
| Q4 | How does the page reveal? | Mount-enter reveal like About above the fold, plus IntersectionObserver-driven reveals when below-fold sections scroll into view - decided by the round | Mount-only — a 7267px page reveals everything at once and nothing greets the scroll |
| Q5 | Do carousels auto-advance? | No timer — arrows and progress dots page the edition's photos by hand - decided by the round | Timed `durationMs` fills — the frame draws a static active pill, not a countdown |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/site/shows` | Is Grade10 Festival 2025 dated NOV 2026 or Nov 2025? | ❓ on [Shows](/p/grade10-site/site/shows) — the page carries the frame's NOV 2026 |
| `grade10-site/site/shows` | Should the chapter tabs be exclusive panels instead? | ❓ on [Shows](/p/grade10-site/site/shows) — jump navigation ships |
| `grade10-site/site/shows` | Where does the Shows entry sit in the chrome? | ❓ on [Shows](/p/grade10-site/site/shows) — no item marked current today |
