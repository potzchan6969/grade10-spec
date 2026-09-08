# House writing style

How everything here is written — a spec's prose, a PRD, a reference, a
proposal, a manual page, a governance doc, a commit message, a PR body, a
review reply. Three documents demonstrate it; read the one nearest your
task before drafting, and hold the draft beside it:

- **Shape** — `docs/references/grade10-finance.md`: a heading, then an
  outline the eye scans in seconds, every line leading with the term that
  matters
- **A capability page** —
  `docs/prds/products/grade10-site/store/product-listing.md`: what the
  surface shows, where each thing leads, what its URL looks like, and
  nothing the spec beneath it already says
- **Voice** — `docs/references/grade10-loyalty-program.md`: a reader learns
  the product from definitions and infers the rules; nothing asks them to
  reconstruct how the text came to be

## Shape

Outline first. A document is a heading and an outline, never an essay.

- **Pick the format that beats words** — a list for items, a table for rows
  that share attributes, a fenced tree or a diagram for structure, a flow
  for steps. Words only where no format carries the meaning better, and
  then one short paragraph.
- **Order by hierarchy, then by time** — the whole before its parts, the
  first thing that happens first. That is the order a reader perceives in.
- **The normal path, then the other cases** — a flow, a list or a chart
  states what happens when everything answers; a failure, a fallback and a
  shape almost nobody sends sit after it under their own label. Drawn
  beside the ordinary path they read as an equal fork, and the reader can
  no longer tell which one is Tuesday.
- **Open in two sentences at most** — what the document is and what the
  reader leaves with. Then the outline. The opening says nothing the
  outline then repeats: a fact belongs in one of the two, never both.
- **A heading is a label** — the name of what its section holds, in the
  reader's words, the way a contents list reads: `Refunds`, `Expiry`,
  `Paying with points`. Not a question or its stub (`What earns`, `Who uses
  it`), not a sentence (`Bids are holds, not payments`), not a leading
  article (`The rate`). A gerund names a repeatable activity, never one
  occurrence. A `###` beneath it labels a part or, on a rule list, states
  one rule — all of a section's `###` the same way. A flow's title, phases
  and steps keep their own form. Test: reading the headings alone, each
  still says what it holds.
- **Only what the page owns** — a fact a child page, a sibling, or a
  platform page states is a link away, never repeated; a product's index
  says what no capability page carries, and nothing true of every product
- **What the reader asks, not what the spec enumerates** — a page says
  what a surface is for, what it shows, where each thing leads, what its
  URL looks like. The spec's cases and edge rules stay in the spec, a link
  away; a page that walks the spec's feature set is the spec said twice.
- **Numbered items** where order or count matters: phases, steps, ranked
  facts. **Bullets** everywhere else. Nest up to three levels; a fourth
  level is a new section.
- **Lead every item with its key term in bold**, then the plain words —
  `**Timeline** — shop opens mid Oct (~23rd)`. Reading only the bold gives
  the outline of the outline.
- **Siblings share one form** — every item in a list puts the same thing
  in the same place: term, dash, path or value, then the note
- **Roles are named by what they do and where** — `**Shopkeepers** — sell
  at the till through the Shopify app on an iPad` — never an umbrella such
  as Staff
- **Fragments, not sentences.** No full stop on a fragment. A parenthesis
  carries the mechanism, the reason, or the exception —
  `(the choice is required for legal)`.
- **Steps name the actor first** — *User*, *Grade10*, *Staff*, *Both* — in
  italics, a dash, the action in bold, then how:
  `*User* — **Book a time slot** depending on the custodian (booking
  system)`.
- **Phases are the sub-headings of a flow** — `Phase 1 — Online
  connection`, `Phase 2 — Offline drop-off` — and steps number straight
  through them.
- **An inventory reads `Name: verb, verb, verb`** — what a surface does, one
  line per surface: `Card registry: create, edit, search, import, export
  cards; manage identifiers, variants, images`.
- **Hierarchy is a fenced tree** — a repository, a navigation, a service
  map — with one annotation per line, aligned in a column:

  ```
  apps/
  ├── admin/grade10/     (admin.grade10.com, one panel for all services)
  └── backend/grade10/   (api.grade10.com, gateway to each service)
      ├── auth/          (thin identity layer, deployable on its own)
      └── store/         (internal service worker)
  ```

- **Numbers stay visible** — bold, with unit and range, `~` for an
  estimate: `**~40% loan to value**`, `**1.5% to 2.5% interest**`.
- **Symbols over words in a cell** — a table or ledger cell says one thing
  in the fewest marks: `+15 pts`, `13 pts × 1.2`, `earn → lapses 3 Jan
  2027`, `·` between facts. `earns 15 points, alive to 3 January 2027` is
  prose in a cell; the arrow, the unit and the number carry it.
- **A table** when every row carries the same three or more attributes —
  tiers, statuses, messages. A cell that needs a paragraph belongs outside
  the table.
- **Open items wear a mark** — ❓ at the start of the line with the
  question, or `TBC` after the value still missing. Never blur a decided
  fact to sit beside an undecided one.
- **Self-contained** — no bare section references ("see above"). Name or
  link the thing.

## Voice

- State decided facts flatly, in present tense. "A tier is valid 12 months
  from its activation date" — never "we will" or "the plan is to".
- Define first: the first item says what a thing is; what it does or
  forbids follows. A rule the reader can infer from the definition needs no
  restating.
- Important things first. The opening line says what the document is; the
  first item is the one the reader most needs.
- Fewest words. Short lines, common words picked for the exact meaning, so
  a reader takes a line in at a glance. Write for the least-context reader
  who must act on the text, not for its author.
- The reader's word, not the code's or the designer's. A page says "a small
  label above the headline" even where the component and the spec call it
  an eyebrow; the term belongs to the spec, the plain word to the page.
- Group one concern per section.
- The roadmap, stated as the product. A decided plan reads in the present
  tense as though shipped; where it stands is a status card or a ❓, never
  an apology in the prose that a spec is still being written.

## One source of truth

- A testable statement lives in `openspec/specs/` and nowhere else. Every
  other document distills and links; none restates the contract or grows
  into a second source of truth.
- No proposal voice in durable text. Today's gap, the intended fix, and
  the success metric belong to a change proposal and rot the moment it
  archives.
- No changelog deltas: replace superseded content. A document reads as if
  written today; git carries the history.

## Before and after

Essay shape, which a reader has to mine:

> What exists is real: a deployed worker, its own database, an audit chain,
> an hourly cron, and the session and permission ladder every procedure
> will mount behind. What does not exist is any business logic at all — no
> lending tables, no repositories, no services, no customer surface, no
> operator surface, and no section in the admin console.

Outline shape, which a reader scans:

> - **Built** — a deployed worker, its own database, an audit chain, an
>   hourly cron, the session and permission ladder
> - **Not built** — any business logic: no lending tables, repositories,
>   services, customer or operator surface, admin section

Spec voice, which says the spec twice:

> The interesting part is the collection in the address. A collection is a
> narrowing of this one listing, not a surface of its own, so every
> collection opens the same document: an address naming one the catalogue
> carries opens already narrowed to it, one naming none lists everything,
> and one naming a collection the catalogue has nothing for lists
> everything as itself rather than refusing.

Reader voice, which answers what they came to ask:

> - **Every product** — a card that opens its Product Details Page
> - **URL** — the collection is in it, so a listing can be linked and shared
>   1. `grade10.com/store/collections` — the whole catalogue
>   2. `grade10.com/store/collections?collection=<handle>` — one collection

Proposal voice, which rots:

> Today a bidder has no way to follow a lot without bidding. This change
> adds a watchlist so engagement can be measured before the first bid.

Definition voice, which stays true:

> A watch is a free, private way to follow a lot. It needs a signed-in
> account, works from any brand, and never notifies the seller.

The first paragraph describes the change and stops being true when the
change ships. The second describes the product and stays correct until the
product itself changes.

## What holds text to this page

No linter judges voice or shape; the deterministic checks cover structure
and references only. Agents load the `writing-style` skill before drafting,
and review holds prose to this page the way it holds code to the specs.
