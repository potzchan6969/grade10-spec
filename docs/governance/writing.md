# House writing style

How everything here is written: manual pages, specs' prose, references,
proposals, governance docs, commits, PR bodies, replies. Copy the page
nearest your task and keep it open while you draft.

| Writing | Copy |
| --- | --- |
| A page about rules and numbers | `docs/prds/products/grade10-site/loyalty/points.md` and `tiers.md` |
| A page about a surface | `docs/prds/products/grade10-site/store/product-listing.md` |
| An owner's draft or a reference | `docs/references/grade10-finance.md` |
| A page block — flow, example, detail, callout | `docs/prds/guides/writing-the-manual.md` |

## Shape

- **No opening essay** — a page about rules starts on its first heading; a
  page about a surface may open with one sentence naming what the surface
  is for and the list of what it shows. A section opens with its rule in a
  sentence or two, or with nothing, then its items
- **Values first** — the numbers the page runs on come before any
  behaviour, as a `Rule | Value` table or a ladder: the rate, the window,
  the cap, the clock. A reader who reads only that table can already use
  the thing
- **A `##` is a plain label in Title Case** — `Refunds`, `Expiry`,
  `Keeping a Tier`, `Admin Grants`: the name the reader would give the
  topic, the way a contents list reads. Not a sentence, not a question,
  not a play on words, no leading article. A `###` labels a part or states
  one rule
- **One concern per section** — the normal case first; failures and odd
  shapes after it under their own label
- **Items lead with the key term in bold** — `**Window** — twelve calendar
  months on the Hong Kong clock`. Reading only the bold gives the outline.
  No full stop on a fragment
- **Siblings share one form** — every item in a list puts the same thing in
  the same place: term, dash, value, then the note
- **Numbered where order or count matters** — steps, ranked fallbacks.
  Bullets everywhere else. Three levels at most
- **A table where rows share columns** — tiers, states, refusals, what earns
  and what does not. A cell holds one fact in the fewest marks: `+15`,
  `13 pts × 1.2`, `earn → lapses 2027/01/03`, `·` between facts
- **A worked example where a rule moves numbers over steps or days** — the
  priced lines, then a ledger table, then one sentence saying what to
  notice, or none where the table already says it
- **A flow for steps between systems** — each step `*Actor* — **What
  happens**`, a line of plain words, and the real payload where one exists
- **A closed set is stated whole** — every state, every refusal, every
  tier the reader can meet, in their words. A set stated in part is worse
  than none, because nothing says it was partial
- **Marks** — two, and never both on one line:
  - ❓, spelled `TBC` where words fit better, marks what nobody has
    confirmed — a decision, a value, a name, whether a way exists — and
    names who confirms it. It marks the page, not the product: nothing is
    built from it
  - 🚧 starts a line that is confirmed and being built; the page says what
    will run, and an active change on the page's spec is delivering it. The
    mark comes off when that change archives. A line still open is never 🚧

## Voice

- **The reader's words** — the word a member or an operator would say
  unprompted. `The member goes back to Silver`, not `demotion`;
  `points earned`, not `tier points`; `label`, not `eyebrow`. A plain word
  the code also uses is the code's word: say what it means and leave the
  identifier to the engineer block
- **The requirement's word for a defined thing** — `tier period`, because
  the spec calls it that. One name per thing, the same on every page
- **Plain nouns, no idiom** — the reader's first language may not be
  English. `Discount`, `Scope`, `Minimum spend`, `Not allowed when`; never
  `Takes off`, `Applies to`, `rides no line`, `Spend this much, take this
  away too`
- **Short plain sentences** — a rule is a sentence, a bullet is a fragment,
  both short. `Only earning moves the progress.` A sentence that needs a
  second reading is rewritten
- **No flourish** — no metaphor, aphorism, echo, or twist for effect. A
  line that sounds clever is rewritten plain
- **Name what happens, not a noun for it** — `the member loses the tier`,
  never `the drop`. A noun made from an event has to be defined first, and
  the lines after it fill with pronouns
- **Digits for values** — `$139`, `1.2×`, `≥ 500`, `500 points earned in a
  rolling 12 months` in a table, a cell, or a bold lead. Running prose may
  spell a small number. The currency is named once in the values table,
  then `$`
- **The reason inline, short** — `so spending can never cost a member
  their tier`; `because the shop applies its rate after the line
  discounts`. A reason longer than its rule is a paragraph
- **Present tense, flat** — a decided fact reads as the product does, a
  planned one included. Never `we will`, `the plan is`, `today we still`
- **Define first** — what a thing is, then what it does. A rule the
  definition already implies is not restated
- **Carry no word from the draft** — rewriting a hard line means dropping
  the word that made it hard, not fitting it into a new sentence

## Placement

- **The spec holds the contract** — a testable statement lives in
  `openspec/specs/` and nowhere else. A page distills and links, never
  restates, and never cites a scenario id (`…-SC-32`): it states the rule
  in its own words and links the capability
- **A page holds what it owns** — a sibling's rule appears as its outcome
  and a link: `the tier is judged again at once — [Tiers](…)`. The rule
  runs both ways: what a sibling says about this page's topic moves here,
  so a thin page is built from what its siblings and the index hold of
  it, and nothing is said twice
- **The spec is linked, never embedded** — a `::spec` block, or a section
  that lists which specs the page documents, is deleted; the frontmatter
  names the spec and the manual shows it
- **The engineer block is a code map** — the config name, the module, the
  architecture doc, as names and links, and nothing else. Ledger kinds,
  keys, locks, metrics, columns, and what was tried and dropped are deleted
  from the page; the architecture docs and the code hold them
- **The page states what runs, and what should** — unmarked lines are what
  runs; what should be carries its mark. A warning that the spec, the
  durable text, or the code says otherwise is deleted; the gap is a change
  proposal.
  A `warning` callout nobody signed with `author` and `date` is that
  warning; what it knows becomes a 🚧 or ❓ line in its section
- **One flow per topic** — the steps between systems are walked once, on
  the page that owns the mechanism; a sibling states each step's outcome as
  items and links into the flow. Two pages never walk the same steps
- **No proposal voice in durable text** — today's gap, the intended fix and
  the success metric belong to the change and rot when it archives
- **No history** — replace superseded content; git carries the deltas
- **A rewrite cuts** — moving a fact off the page to where it belongs, or
  deleting one the page never owned, is part of the rewrite, not a loss.
  What survives is reshaped; what does not belong is removed

## Before and After

From the loyalty pages as they were drafted, and as they were corrected.

An opening that explains the machinery:

> A tier is the rate a member earns at. It is derived on every read from
> what the member has earned, the term they hold it for, and any live
> invitation — never stored as a decision — so a term that ran out a second
> ago already reads as Silver before any sweep runs.

The page opens on the table:

> ## Ladder
>
> | Tier | Earns | Reached by | Kept by |
> | --- | --- | --- | --- |
> | Silver | 1× | Every member starts here | — |
> | Gold | 1.2× | 500 points earned in a rolling 12 months | 500 points earned inside the 12-month period |
> | Black | 1.7× | Invitation only | Until the invitation ends or is revoked |

Headings that play:

> ## Two counts
> ## Keeping and losing a tier
> ## Black, by invitation

Headings that name:

> ## Tier Progress
> ## Keeping a Tier
> ## Black Tier

A paragraph the reader has to mine:

> Promotion is immediate. The instant an earn takes a member's tier points
> past 500, including on a first purchase, they hold Gold and a twelve-month
> term starts that day. The higher rate applies from the next purchase: the
> multiplier is read before the purchase is priced, so one large order
> cannot claim a rate it had not reached when it was made.

Two sentences that say it:

> Customer reaches a tier upon reaching the points required for that tier.
> The multiplier is only applied starting from the next order.

A stand-in where the fact should be:

> An operator can add points two ways, and the difference is the whole
> point. A **campaign grant** — a sign-up promotion, a goodwill gift —
> credits both counts, so it can move a member up a tier. A
> **correction** credits or debits the redeemable balance alone, so fixing
> a mistake never promotes anyone.

The question, then the answers:

> An operator moves points by hand from the admin console two ways, and
> the two part on one question: do the points count toward the tier?
>
> - **Campaign grant** — a sign-up promotion, a goodwill gift; adds to the
>   redeemable balance and to what counts toward the next tier and
>   retention, so it can promote a member
> - **Correction** — putting a mistake right; adds to or takes from the
>   redeemable balance alone, so it never promotes anyone

A rule as prose:

> The redeemable balance lapses after twelve months with no activity. Every
> purchase and every redemption pushes that date to twelve months from its
> own day, forwards only, so a late record shortens nothing.

The rule as items and a ledger:

> - **Activity** — a purchase or a redemption, even a spend too small to
>   earn a point; each pushes the whole balance's date to twelve months
>   from its own day
> - **Forwards only** — a late record shortens nothing; the date sits where
>   the latest activity put it
>
> | When | Event | Points | Balance |
> | --- | --- | --- | --- |
> | 2026/03/08 | earn → lapses 2027/03/08 | +15 | 15 |
> | 2026/04/10 | order of 3 Jan, arriving late · date stays 2027/03/08 | +12 | 27 |
> | 2027/03/08 | lapse, both | −27 | 0 |

Engineer depth as prose:

> The nightly cron runs the expiry sweep, then the tier review, then the
> reward-template audit, then the lapsed-collection sweep, each on its own
> budget. Metrics: `loyalty.tier.changed` by tier and cause, and per review
> `loyalty.tier.review.demoted`, `.retained`, `.failures`, `.skipped`,
> `.leftover`. …

Engineer depth as a code map:

> - **Config** — one programme config, `GRADE10_LOYALTY_PROGRAM` in
>   `packages/app-env`
> - **Design records** — [loyalty architecture](…) and
>   [commerce architecture](…)

Words that were swapped:

| Drafted | Corrected |
| --- | --- |
| the drop | the member loses the tier |
| tier points | points earned |
| term | tier period, the requirement's word |
| HKD 139, a rolling twelve months | $139, a rolling 12 months |
| `([[…-SC-38]])` | nothing: the rule in the page's words, the capability linked |
| a warning that the spec says otherwise | nothing: the page states what runs |

## Checklist

Read the draft once as the least-informed reader who has to act on it.

1. **Opening** — does a page about rules start on a heading and a table?
2. **Headings** — does every `##` read as a plain Title Case label?
3. **Paragraphs** — does any section run past two sentences before its
   items? Turn the rest into items
4. **Items** — does every item lead with a bold term, and every sibling
   share its form?
5. **Examples** — does every rule that moves numbers over steps or days
   have a worked ledger? Write one where none exists; it adds no fact
6. **Words** — is every word one the reader would say, and the same word
   on every page?
7. **Sentences** — is any one carrying a metaphor, a twist, or a second
   fact?
8. **Drift** — is there a warning or a note that the spec or the code says
   otherwise, an unsigned `warning` callout, or a list of what is built
   against what is decided? Delete it; a decided-but-unbuilt fact is a 🚧
   line in the section it belongs to
9. **Engineer block** — does it hold anything but names and links? Delete
   the rest
10. **Ownership** — is anything left that is the spec's statement, an
    embedded spec, a sibling's rule, or a flow a sibling already walks? Is
    anything about this page's topic still sitting on a sibling?
11. **Marks** — is everything unconfirmed ❓ or `TBC`, and 🚧 only on
    what is confirmed and being built?

A draft that fails one line is rewritten.

## Enforcement

- **`pnpm check:manual`** — structure and references: canonical form,
  resolving ids, block attributes, a ledger whose balance does not add up,
  a flow whose cases cannot be told apart
- **Review** — voice and shape are held here the way code is held to the
  spec
- **The `writing-style` skill** — an agent loads it before drafting, and it
  points here
