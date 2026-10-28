## Goals

- A collector opening `/about` reads who backs Grade10, what it does, and
  where it is going, on a page rendered by the design system at any
  viewport.
- The page's links lead somewhere real: MemeStrategy, 9GAG and Grade10 AI
  in a new tab, Grade10 in place; vaulting services and Grade10 Finance
  are named as plain text until they launch.
- The workbench renders the page before the site consumes it, at a wide
  and a narrow viewport.

## Non-Goals

- No navigation entry placement — About sits in the footer's Company
  column per `page-shell`; the header marks no item current for the page.
- No new header or footer — the page composes the production chrome as it
  stands.
- No routing, data fetching, or page shell changes — those belong to the
  implementing site and to `page-shell` / `navigation`.
- No share-metadata or crawler work — `crawlable-pages` already binds every
  public surface the site answers.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does the About page live in the workbench and the manual? | `Site/About` stories plus a new manual page `docs/prds/products/grade10-site/site/about.md` - decided by the round | A section on an existing site page - About is its own surface and earns its own PRD |
| Q2 | Which chrome does the page render? | The production auction-first `SiteHeader` and `Footer` fixtures - decided by the round | A new marketing chrome variant - no variant exists and the design does not ask for one |
| Q3 | Where will the Grade10 Finance mention lead once the service launches? | `/finance`, recorded as the post-launch destination; plain text until then (Q6) - decided by the round | Linking now - the surface does not exist on day 1 |
| Q4 | What does the change ship? | The Storybook page assembly and the manual page - decided by the round | Wider OpenSpec or production changes - routing and data belong to the implementing site |
| Q5 | Does the page keep the Figma body copy verbatim? | Tightened copy applied after a copywriting review - decided by the round | Verbatim Figma text - the review found filler adjectives and unfalsifiable claims; the divergence is flagged for design to sync back |
| Q6 | Do vaulting services and Grade10 Finance link out? | Plain text until they launch - decided by the round | Links to `/vault` and `/finance` - neither surface exists on day 1, so a link would land nowhere |
| Q7 | Does the page highlight the market indexes? | A Market indexes section ahead of the parent-company panel, each index opening in a new tab - decided by the round | No indexes block - the nav and footer already link them, and the About page earns the same highlight |
| Q8 | Must the parent-company paragraph reproduce issuer boilerplate verbatim? | No; the tightened wording stands (Q5) - decided by the round | Verbatim issuer text - rework of the copy for no collector benefit |
| Q9 | Where does the About entry sit in the chrome? | The footer's Company column, no header item - settled by `page-shell` | A header item - the header marks nothing current for the page |
