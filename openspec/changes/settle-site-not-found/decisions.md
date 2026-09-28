## Goals

- Settle the site not-found surface as static title, description, and Back to
  Home — no failed path on the page
- Put the assembly in Storybook under Pages/Not Found as the layout source of
  truth (no Figma frame)
- Align shared `notFound` catalogs and both brands' navigation requirements
  with that surface

## Non-Goals

- A shared `@grade10/ui` not-found block — pages stay brand-owned
- Showing “404” or other status codes on the page
- Changing how an unknown address resolves (still not-found under a 404)
- Publishing a Figma frame for not-found
- Reworking the manual tool's own not-found page

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Show the failed path on the not-found page? | No — title and description stay fully static (author's choice) | Path in the title, or a separate mono address line — rejected: path clutter; collector already sees the URL in the bar |
| Q2 | English title and description? | Title `Nothing is here`; description `The link may be wrong, or the page may have moved.`; CTA `Back to Home` in title case (author's choice via ux-copy) | Keep path in title (`There is nothing at {pathname}`); softer title `This page isn’t here` — rejected: path constraint and house “nothing is…” voice |
| Q5 | Chinese title as a literal of “Nothing is here”? | `找不到这个页面` / `找不到這個頁面` — “can’t find” tone (author's choice) | `这里什么都没有` / `這裡什麼都沒有` (calque); `没有这个页面` / `沒有這個頁面` — rejected for a softer “nothing exists” tone |
| Q6 | English CTA casing? | Title case — `Back to Home` (author's choice) | Sentence case `Back to home` — rejected: CTAs always use title case |
| Q3 | Shared `@grade10/ui` not-found export? | No — brand-owned page assemblies; shared piece is catalogs and the requirement (author's choice; matches archived ZZZ navigation tech design) | One shared block both apps import — rejected: pages are brand-owned |
| Q4 | Figma frame for not-found? | No — Site index already settles shell-adjacent surfaces in Storybook (decided by the round) | Draw a Figma frame first — rejected: callout already points at Storybook |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| — | — | — |
