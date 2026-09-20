# House writing style

How everything here is written: manual pages, specs' prose, references,
proposals, governance docs, commits, PR bodies, replies. Copy the page
nearest your task and keep it open while you draft.

| Writing | Copy |
| --- | --- |
| A page about rules and numbers | `docs/prds/products/grade10-site/loyalty/points.md` and `tiers.md` |
| A page about an instrument and its refusals | `docs/prds/products/grade10-site/loyalty/coupons.md` |
| A page about a surface | `docs/prds/products/grade10-site/store/product-listing.md` |
| An owner's draft or a reference | `docs/references/grade10-finance.md` |
| A page block — flow, example, detail, callout | `docs/prds/guides/writing-the-manual.md` |

## Shape

- **No opening essay** — a page about rules starts on its first heading; a
  page about a surface may open with one sentence on what it is for and
  what it shows. A section opens with its rule in a sentence or two, or
  with nothing, then its items
- **Values first** — the numbers the page runs on — the rate, the window,
  the cap, the clock — come before any behaviour, as a `Rule | Value` table
  or a ladder. A reader who reads only that table can already use the thing
- **A `##` is a plain label in Title Case** — `Refunds`, `Keeping a Tier`,
  `Moving Points`: the name the reader would give the topic, the way a
  contents list reads. Not a sentence, a question or a play on words, and
  no leading article. A `###` labels a part or states one rule
- **One concern per section** — the normal case first; failures and odd
  shapes after it under their own label
- **Items lead with the key term in bold** — `**Window** — twelve calendar
  months on the Hong Kong clock`. The bold alone reads as the outline. No
  full stop on a fragment
- **Siblings share one form** — term, dash, value, then the note, in the
  same place on every item
- **Numbered where order or count matters** — steps, ranked fallbacks;
  bullets everywhere else; three levels at most
- **A table where rows share columns** — tiers, states, refusals, what
  earns and what does not. A cell holds one fact in the fewest marks:
  `+15`, `13 pts × 1.2`, `earn → lapses 2027/01/03`, `·` between facts
- **A worked example where a rule moves numbers over steps or days** — the
  priced lines, a ledger table, then one sentence on what to notice, or
  none where the table already says it
- **A flow for steps between systems** — each step `*Actor* — **What
  happens**`, a line of plain words, and the real payload where one exists
- **A closed set the reader meets is stated whole** — every tier, refusal
  or state, as a table in their words; a set stated in part is worse than
  none, because nothing says it was partial. A set only an engineer or a
  tester meets is the spec's and the suite's; a surface's own states —
  empty, loading, error, narrow — are `::story` cards and the change's
  `ui-design.md`, never a list
- **Marks** — two, never both on one line:
  - ❓, or `TBC` where words fit better, marks what nobody has confirmed —
    a decision, a value, a name, whether a way exists — and names who
    confirms it. It marks the page, not the product: nothing is built from
    it. The product page pools these lines as its pending spec, so the mark
    sits where a reader can act on it. The mark leads its line, its bullet
    or its cell, after the key term at most: one written further into a
    sentence is read as words and pooled nowhere
  - 🚧 starts a line that is confirmed and being built: the page says what
    will run, an active change on its spec delivers it, and the mark comes
    off when that change archives. A line still open is never 🚧. One line
    per outcome the reader can see; the scenarios that prove it are the
    delta's. A 🚧 inside a flow
    step, a sub-step or mid-sentence is a scenario wearing a mark: lift it
    to its section as one outcome, or drop it

## Voice

- **The reader's words** — what a member or an operator would say
  unprompted: `the member goes back to Silver`, not `demotion`; `points
  earned`, not `tier points`; `label`, not `eyebrow`. A plain word the
  code also uses says what it means; the identifier stays in the engineer
  block. The reader of a governance page or a change's record is a
  teammate, so its words are theirs
- **The requirement's word for a defined thing** — `tier period`, because
  the spec calls it that. One name per thing, the same on every page
- **Plain nouns, no idiom** — the reader's first language may not be
  English. `Discount`, `Scope`, `Not allowed when`; never `Takes off`,
  `Applies to`, `rides no line`, `Spend this much, take this away too`
- **Short plain sentences** — a rule is a sentence, a bullet is a
  fragment. `Only earning moves the progress.` A sentence that needs a
  second reading is rewritten
- **No flourish** — no metaphor, aphorism, echo or twist. A line that
  sounds clever is rewritten plain
- **Name what happens, not a noun for it** — `the member loses the tier`,
  never `the drop`; a noun made from an event needs defining first, and
  the lines after it fill with pronouns. This is about the product: a rule
  says what happens, never a noun standing in for it
- **A capability, named as one** — what the repository, the store or its
  tooling gains is named plainly and directly: `Support pending teammates
  in a change request`, `Support a second brand on the till`. Say
  `Support` and the thing; the rule above does not reach these, because
  the subject is the tooling rather than the product. A title, a heading
  and a change's summary all take this form
- **Digits for values** — `$139`, `1.2×`, `≥ 500`, `a rolling 12 months`
  in a table, a cell or a bold lead. Running prose may spell a small number. The currency is named once in
  the values table, then `$`
- **The reason inline, short** — `so spending can never cost a member
  their tier`. A reason longer than its rule is a paragraph
- **Present tense, flat** — a decided fact reads as the product does,
  planned ones included. Never `we will`, `the plan is`, `today we still`
- **Define first** — what a thing is, then what it does; a rule the
  definition already implies is not restated
- **Carry no word from the draft** — rewriting a hard line drops the word
  that made it hard rather than fitting it into a new sentence

## Placement

- **A line earns its place** — the reader would act differently without
  it: a value, a set they can meet, an outcome they can see, a decision. A
  line a stated rule implies is the spec's; a case that only proves a rule
  is the suite's; how a surface arranges, labels or sizes an outcome is
  the design record's; how the code does it is the architecture doc's.
  The page is the essence a reader expands from, never the expansion: the
  manual renders the suite under its `::cases` block, the change's artifacts on its In Flight
  entry, and the architecture doc from the engineer block's links
- **The spec holds the contract** — a testable statement lives in
  `openspec/specs/` and nowhere else. A page states the rule in its own
  words and links the capability; it never restates, and never cites a
  scenario id (`…-SC-32`)
- **A page holds what it owns** — a sibling's rule appears as its outcome
  and a link: `the tier is judged again at once — [Tiers](…)`. What a
  sibling says about this page's topic moves here, so a thin page is built
  from what its siblings and the index hold of it, and nothing is said
  twice
- **The spec is linked, never embedded** — the frontmatter names it and
  the manual shows it; a `::spec` block, or a section listing the specs
  the page documents, is deleted
- **The engineer block is a code map** — the config name, the module, the
  architecture doc, as names and links, nothing else. Ledger kinds, keys,
  locks, metrics, columns and what was tried are deleted; the architecture
  docs and the code hold them
- **The page states what runs, and what should** — unmarked lines are what
  runs; what should be carries its mark. A warning that the spec, the
  durable text or the code says otherwise is deleted; the gap is a change
  proposal. A `warning` callout nobody signed with `author` and
  `date` is that warning: what it knows becomes a 🚧 or ❓ line in its
  section
- **One flow per topic** — the steps between systems are walked once, on
  the page that owns the mechanism; a sibling states each step's outcome
  as items and links into the flow
- **No proposal voice in durable text** — today's gap, the intended fix
  and the success metric belong to the change and rot when it archives
- **No history** — replace superseded content; git carries the deltas
- **A rewrite cuts** — moving a fact to where it belongs, or deleting one
  the page never owned, is part of the rewrite, not a loss

## Where a Rule Lives

Instruction text for agents follows Placement too, with the load path —
what a worker holds when it writes — as the page: `AGENTS.md` on every path; the CLI's payload — schema
instruction, template and that artifact's `rules` block in
`openspec/config.yaml` — on a change artifact; a skill and the one
document it names on a command.

- **One home per rule per path** — a rule a check enforces is named by
  its check and written nowhere else; a rule only prose enforces is
  written once on each path that needs it, as a rule, never as a list of
  topics. A second surface on the same path links the heading, in its own
  casing
- **Examples live in the corpus** — point at an approved case; a pasted
  one drifts, the corpus is validator-held
- **A budget holds the always-loaded surfaces** — `pnpm run test:openspec`
  fails `AGENTS.md` or a `rules` block past its recorded size, and a skill
  pointer that names no rulebook section. Raising a budget is a commit
  that says why

## Before and After

From the loyalty pages as drafted and as corrected.

| Drafted | Corrected |
| --- | --- |
| An opening paragraph on how a tier is derived on every read | `## Ladder` and its `Tier · Earns · Reached by · Kept by` table |
| `## Two counts`, `## Keeping and losing a tier`, `## Black, by invitation` | `## Tier Progress`, `## Keeping a Tier`, `## Black Tier` |
| Three sentences on immediate promotion, the term it starts, and when the multiplier is read | `Customer reaches a tier upon reaching the points required for that tier. The multiplier is only applied starting from the next order.` |
| `the difference is the whole point` | The question — do the points count toward the tier? — then **Campaign grant** and **Correction** as the items that answer it |
| A paragraph on the balance lapsing after twelve months without activity | **Activity** and **Forwards only** as items, then a ledger whose late order shortens nothing |
| The nightly cron's order and every metric name | **Config** and **Design records**, as names and links |
| the drop | the member loses the tier |
| tier points | points earned |
| term | tier period, the requirement's word |
| HKD 139, a rolling twelve months | $139, a rolling 12 months |

## Checklist

Read the draft once as the least-informed reader who has to act on it.

1. **Cut** — the reader would act differently without every line; a line
   that fails moves to the spec, the suite, the design record or the
   architecture doc, or is deleted
2. **Opening** — a page about rules starts on a heading and a table
3. **Headings** — every `##` reads as a plain Title Case label
4. **Paragraphs** — no section runs past two sentences before its items
5. **Items** — every item leads with a bold term, and siblings share a form
6. **Examples** — every rule that moves numbers over steps or days has one
   worked ledger, on the case that decides it, adding no fact
7. **Words** — every word is one the reader would say, the same on every
   page; a capability the tooling gains is named as one
8. **Sentences** — none carries a metaphor, a twist or a second fact
9. **Drift** — no note that the spec or the code says otherwise, no
   unsigned `warning` callout, no list of what is built against what is
   decided; a decided-but-unbuilt fact is a 🚧 line in its section
10. **Engineer block** — names and links only
11. **Ownership** — nothing left that is the spec's statement, an embedded
    spec, a sibling's rule or a flow a sibling walks; nothing about this
    page's topic still on a sibling
12. **Marks** — everything unconfirmed is ❓ or `TBC`; 🚧 only on what is
    confirmed and being built, one line per outcome

A draft that fails one line is rewritten.

## Enforcement

| Held by | What |
| --- | --- |
| `pnpm check:manual` refuses | canonical form, block attributes, a block id that resolves nothing, an example ledger whose balance does not add up, a flow whose cases cannot be told apart, a 🚧 line no in-flight change delivers |
| `pnpm check:manual` warns | a spec whose requirements changed meaning after the page embedding it was last committed, cleared by the edit the page needs or by a dated `reviewed:` in its frontmatter when it needs none; a prose reference naming nothing or two things; a ledger written as a table outside an example; a ❓ or `TBC` inside a sentence, read as words (`prose`); and `dense`, below. A warning asks for the rewrite and never blocks a fold |
| Review | voice and shape, the way code is held to the spec |
| The `writing-style` skill | loaded before drafting; it points here |

The `dense` budget:

| Warns on | Limit |
| --- | --- |
| Prose outside a page's examples and details | 120 lines |
| Sentences a section opens on before its items | 6 |
| A paragraph in an engineer block | none |
| A 🚧 inside a flow step or mid-line | none |
