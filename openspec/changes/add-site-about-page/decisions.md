## Goals

- A collector opening `/about` reads who backs Grade10, what it does, and
  where it is going, on a page rendered by the design system at any
  viewport.
- The page's links lead somewhere real: MemeStrategy, 9GAG and Grade10 AI
  in a new tab, vaulting services to the vault page, Grade10 Finance to
  `/finance`.
- The workbench renders the page before the site consumes it, at a wide
  and a narrow viewport.

## Non-Goals

- No navigation entry placement — where About sits in the chrome is
  undecided, and the header marks no item current for the page today.
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
| Q3 | Where does the Grade10 Finance link point? | `/finance`, matching the live page - decided by the round | Holding the link back - the destination it should carry long-term stays ❓ on the PRD |
| Q4 | What does the change ship? | The Storybook page assembly and the manual page - decided by the round | Wider OpenSpec or production changes - routing and data belong to the implementing site |
| Q5 | Does the page keep the Figma body copy verbatim? | Tightened copy applied after a copywriting review - decided by the round | Verbatim Figma text - the review found filler adjectives and unfalsifiable claims; the divergence is flagged for design to sync back |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/site/about` | Where does the About entry sit in the chrome? | ❓ on [About](/p/grade10-site/site/about) — the header marks no item current for the page today |
| `grade10-site/site/about` | Where should the Grade10 Finance link lead long-term? | ❓ on [About](/p/grade10-site/site/about) — it opens `/finance` as today's page does |
| `grade10-site/site/about` | Must the parent-company paragraph reproduce issuer boilerplate verbatim? | ❓ for the copy owner — the page carries tightened wording until then |
