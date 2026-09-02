# House writing style

How everything here is written — a spec's prose, a PRD, a reference, a
proposal, a manual page, a governance doc, a commit message, a PR body, a
review reply. Two documents demonstrate it:

- **Shape** — `docs/references/grade10-finance.md`: a heading, then an
  outline the eye scans in seconds, every line leading with the term that
  matters
- **Voice** — `docs/references/grade10-loyalty-program.md`: a reader learns
  the product from definitions and infers the rules; nothing asks them to
  reconstruct how the text came to be

## Shape

Outline first. A document is a heading and an outline, never an essay.

- **Open in two sentences at most** — what the document is and what the
  reader leaves with. Then the outline. The opening says nothing the
  outline then repeats: a fact belongs in one of the two, never both.
- **Numbered items** where order or count matters: phases, steps, ranked
  facts. **Bullets** everywhere else. Nest up to three levels; a fourth
  level is a new section.
- **Lead every item with its key term in bold**, then the plain words —
  `**Timeline** — shop opens mid Oct (~23rd)`. Reading only the bold gives
  the outline of the outline.
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
- **A table** when every row carries the same three or more attributes —
  tiers, statuses, messages. Reasoning stays in prose, and a cell that needs
  a paragraph belongs outside the table.
- **Prose only for reasoning an outline cannot carry**, and then one short
  paragraph, not three.
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
- Simple words. Write for the least-context reader who must act on the
  text, not for its author.
- Group one concern per section; the heading names the concern in plain
  words.

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
