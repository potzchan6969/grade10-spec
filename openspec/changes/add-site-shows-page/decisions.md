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

- No navigation entry placement — `navigation` / `page-shell` own it
  (Q6).
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
| Q3 | Which copy wins where the frame and the live page disagree? | The Figma frame verbatim - decided by the round | Live copy — the frame is the redesign; mismatches (the Seoul partner's name, the card date) are settled on the PRD and by Q7 and Q8 — the hero card label since settled on Upcoming Shows. ZZZ is the real Seoul partner name, confirmed by the product owner |
| Q4 | How does the page reveal? | Mount-enter reveal like About above the fold, plus IntersectionObserver-driven reveals when below-fold sections scroll into view - decided by the round | Mount-only — a 7267px page reveals everything at once and nothing greets the scroll |
| Q5 | Do carousels auto-advance? | No timer — arrows and progress dots page the edition's photos by hand - decided by the round | Timed `durationMs` fills — the frame draws a static active pill, not a countdown |
| Q6 | Where does the Shows entry sit in the chrome? Options: this change, `navigation`. recommended: `navigation` | Outside this change: the chrome entry is decided on the PRD's Navigation entry row, and `navigation` / `page-shell` ship it - decided by the round | Placing the entry here — `navigation` / `page-shell` own the chrome |
| Q7 | Which date does the Festival 2025 card carry? | NOV 2025, the live page's date; the frame's NOV 2026 is design's to sync back - decided by the round, overriding Q3 for this value | NOV 2026 — dates a 2025 show in the future |
| Q8 | What is the Seoul partner called? | ZZZ throughout, the real partner name - decided by the round | Gana Art, the name the chapter once carried |
| Q9 | Where do the page's words and content live? | In code: hardcoded copy and content handed to the shared `ShowsPageBody` block in `packages/ui` - decided by the round | An admin-managed feed — not this change's |
| Q10 | What does a collector see after following a Press Release link while the press index and articles are a follow-on change? | The links ship and lead to their addresses; the cases check the address opened - decided by the round | Hiding the links until the articles exist — this change ships the destinations only |
| Q11 | Which clock decides a show's month has passed? | Hong Kong time - decided by the round, with the human | The viewer's local date — near a month boundary collectors in different zones would see different cards |
| Q12 | In what order does the Upcoming Shows card list its shows? | In the order the content gives, as the block draws them - decided by the round | Sorting soonest first in the block — the block lists them as given |
| Q13 | Where does Explore Shows land? | The Event Formats section top, `#shows-formats` - decided by the round | The Hong Kong chapter |
| Q14 | Does a chapter jump change the address? | Yes, each pill is a hash link to its chapter, so a chapter can be shared and Back returns - decided by the round, as the block draws it | Keeping the address `/shows` |
| Q15 | How long does the chapter list stay pinned? | It stays sticky as the block draws it - decided by the round | Releasing it before Event Records |
| Q16 | What do an edition carousel's arrows do at its first and last photo? | They wrap round to the other end - decided by the round, as the block draws it | Stopping with the end arrow unavailable |
| Q17 | Does starting one chapter video stop the other? | No, each plays on its own - decided by the round | Pausing the other |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/site/shows` | Is Grade10 Festival 2025 dated NOV 2026 or Nov 2025? Options: NOV 2026, NOV 2025. recommended: NOV 2025 | Q7 |
| `grade10-site/site/shows` | Should the chapter tabs be exclusive panels instead? Options: jump navigation, panels. recommended: jump navigation | Q1 |
| `grade10-site/site/shows` | Where does the Shows entry sit in the chrome? Options: this change, `navigation`. recommended: `navigation` | Q6 |
| `grade10-site/site/shows` | What does a collector see after following a Press Release link while the `/press-releases` index and articles are a follow-on change? US-02 promises "a door to the report rather than dead text", and the proposal ships "the destinations, not the articles". Options: links ship and land on whatever the site answers at that address until the follow-on ships; each link stays hidden until its article exists; `/shows` releases only with or after the follow-on. recommended: links ship and land on whatever the site answers - the suite asserts the address opened, and the article's content is the follow-on's | Q10 |
| `grade10-site/site/shows` | Which date decides that a show's month "has passed" on the Upcoming Shows card - Hong Kong's or the viewer's own? A viewer in another zone on the 1st of a month can see a different card. Options: Hong Kong time, the viewer's local date. recommended: Hong Kong time | Q11 |
| `grade10-site/site/shows` | In what order does the Upcoming Shows card list its shows? Nothing states it. Options: soonest first, the frame's order. recommended: soonest first | Q12 |
| `grade10-site/site/shows` | Where does Explore Shows land - the Event Formats section's top (heading and chapter list) or the Hong Kong chapter? The feature set says it scrolls "to their chapter"; the PRD says "a jump into the formats". Options: the Event Formats section's top, the Hong Kong chapter. recommended: the Event Formats section's top | Q13 |
| `grade10-site/site/shows` | Does a chapter jump change the address, so a chapter can be shared and Back returns to the previous position? Options: the address stays `/shows`; each chapter gets its own fragment, e.g. `/shows#hong-kong`. recommended: the address stays `/shows` | Q14 |
| `grade10-site/site/shows` | How long does the sticky chapter list stay pinned? Options: only while the three chapters are in view, scrolling away before Event Records; to the end of the page. recommended: only while the chapters are in view | Q15 |
| `grade10-site/site/shows` | What do an edition carousel's arrows do at its first and last photo? Options: stop, with the arrow at an end unavailable; wrap round to the other end. recommended: stop, with the arrow at an end unavailable | Q16 |
| `grade10-site/site/shows` | Starting the second chapter video while the first plays - does the first stop? Options: each video plays on its own; starting one pauses the other. recommended: each video plays on its own | Q17 |
