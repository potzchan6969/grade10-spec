---
title: Writing the manual
summary: The page's anatomy, its blocks, canonical form, and what happens when you save.
order: 5
---

Every page here is a markdown file in the spec store under `docs/prds/` — a
capability's page is its PRD, which is why the manual lives where PRDs are
looked for. Edit one in the browser or in your editor — the grammar is the
same either way, and the same check refuses a page that breaks it.

A page is YAML frontmatter followed by a sequence of blocks. Frontmatter keys
come in this order. `title` is the surface's plain name — `Main Page`,
`Product Listing`, `Checkout` — never a metaphor. `summary` is a card
subtitle the house style leaves out: the title carries the weight, and the
page shows the rest. `spec` names the spec the page documents. `icon` is the
glyph a domain wears in the rail and on its card — one name from the fixed
list the editor's field offers, and a landing page without one draws a
warning. `audience` is `operator` or absent — `operator` files the page under
the Admin nav group, absent means the product's own users. `order` sorts it
among its siblings. `reviewed` is the day the page was last read against a
spec that had changed under it and found right as it stood — set it when the
stale warning names a page that needs no other edit, and leave it off
otherwise. Any other key is a hard error, because an editor that silently
drops a field you typed is worse than one that refuses to save.

```yaml
---
title: Points and Rewards
spec: grade10-site/loyalty/programme
order: 1
---
```

`spec` may name a capability an in-flight change is still writing — that is
how an incubating capability gets its page before it lands, and the check
warns while any delta-introduced capability has none. A page with no `spec` at
all wears the **planned** pip: it states an intended shape, and the propose
action on it is where the requirements start.

Everything between directives is prose — GitHub markdown, headings starting at
`##`, no raw HTML. Directives sit at column 0: two colons open a leaf, three
open a container that a bare three-colon line closes. Attribute values are
double-quoted, and a quote character can never appear inside one.

## Page Anatomy

Pages follow the house style — `docs/governance/writing.md` in the store.
Copy [Points](/p/grade10-site/loyalty/points) for a page about rules and
[Product Listing](/p/grade10-site/store/product-listing) for a page about a
surface. Top to bottom:

- **Frontmatter** — `title`, `spec`, `order`, and the other keys in their
  declared order
- **No opening paragraph** — the first line after it is a `##`. A page
  about a surface may open with one sentence naming what the surface is for
- **Values** — the numbers the page runs on, as a `Rule | Value` table or a
  ladder, before any behaviour
- **One `##` per concern** — a plain label in Title Case, the rail lists
  every one; under it one sentence stating the rule or none, then items
  leading with their key term in bold, then a table for a closed set or an
  `example` for a rule that moves points
- **A flow** for the steps between systems — the normal path as the flow,
  each odd shape as its own `case`, each step naming its actor first
- **A callout** — `note` for a rule that reads across sections; `warning`
  only for a divergence somebody signed
- **An engineer block** under the section it deepens — a code map of names
  and links, never how the code works
- **Product decisions** — the pm block, last, where the page records one
- **Nothing recaps the change** — no today's gap, no note that a spec is
  still being written, no scenario id. A confirmed plan reads as the product
  does, in the present tense, marked 🚧 until its change archives; the
  in-flight cards beneath say what has not shipped, and a page with no
  `spec` wears the planned pip
- **The page is the roadmap** — a change starts here, one 🚧 line per
  outcome the reader can see, and its deltas derive from those lines; a delta
  promising what no line marks is the delta's error, not the page's. The
  scenarios that prove an outcome are the delta's, however many: a 🚧 inside
  a flow step, a sub-step or mid-sentence is a scenario wearing a mark. The
  proposal links each section it marked, and the manual shows the change
  under that heading
- **The page is the essence** — every line is one the reader would act
  differently without: a value, a set they meet, an outcome they see, a
  decision. A case that only proves a rule is the suite's, a state that only
  dresses an outcome is the design record's, a mechanism is the architecture
  doc's. The check warns on a page past 120 lines of prose outside its
  examples and details, a section opening on an essay, an engineer block
  holding a paragraph, and a buried 🚧

## Blocks

The page itself carries the shape we want — plain prose and the visuals below.
Requirement text stays in the store: a page states the rule in its own
words and links the capability, and never embeds the contract.

What a page does embed is acceptance: the spec's test-case suite, out of the
spec named in the frontmatter. The block renders the suite's index — each
case, its status, and the journey it traces — so a page never lists a case
in prose; the check warns on a suite no page shows.

```md
::cases{id="grade10-site/loyalty/programme"}
```

User journeys are derivative of the page's own content and stay in the
capability's `user-journeys.md` — a page never embeds them.

A page that names a spec in its frontmatter already shows that spec's in-flight
changes. Author this block only to show a *different* spec's:

```md
::changes{spec="grade10-site/loyalty/programme"}
```

What the changes about a capability said would come next — the
`## Follow-on changes` bullets of every proposal whose delta touches that spec
or whose `## References` cite it, in flight and shipped alike:

```md
::next{spec="grade10-site/loyalty/programme"}
```

Every bullet stays under the change that wrote it, dated by that change, and
the block says so out loud — a follow-on is one author's intent on one day, and
pooling them into a bare list turns it into a promise nobody made. Nothing else
on the page may repeat them: the prose above still describes the product as it
is, in the present tense. The product page pools the same reading over every
capability it owns, after every ❓ and `TBC` its pages carry, as its pending
spec.

Visuals. Figma URLs and Storybook ids are never invented — take them from the
design record or the workbench, and the check now holds you to it: a url naming
another Figma file, or a frame the nightly design sync no longer finds, is a
warning. `alt` on an image is required:

```md
::story{id="blocks-store-cart--default" title="The cart block" height="480"}
::image{src="assets/tier-ladder.png" alt="The four tiers and their thresholds"}
```

A chart is an SVG the build renders from a source under `docs/prds/diagrams/`
— archify's JSON, named `<slug>.<workflow|lifecycle|sequence|dataflow|architecture>.json`
— into `assets/diagrams/<slug>.svg` with `pnpm diagrams`, and CI refuses a
chart that is stale against its source. A flow names its chart and lights, at
each step, every node whose id is that step's slug (an id's tail after `_`
lets several nodes share one) and every edge pointing at such a node; an
`::image` shows a chart anywhere else, in the page's own theme:

```md
:::flow{title="The hosted check" diagram="assets/diagrams/kyc-hosted-check.svg"}
## The check is raised
Lit while the reader is here, with the node `the-check-is-raised`.
:::

::image{src="assets/diagrams/vault-identity-states.svg" alt="How a case moves between its identity states"}
```

An example is one worked case. It opens with the cart, a list of priced
lines, and `tier` badges the member while `shipping` names the fee on the
order. Then comes a ledger, a table whose columns are
`Step | Event | Points | Balance`, each row a thing that happened in order,
points signed (`+15`, `−10`, or blank where none moved), the balance running
from zero or from the first one stated. Where the day is what the reader
follows, the first column is `When` instead: a day written `2026/01/03`, or
blank to share the day above, and the rows hang on a timeline. Two columns may
follow: `Progress`, a second running figure each row states rather than the
points reach — what a window holds, what a term has counted — and `Period`,
what a run of days is inside, a term, a window, a tier's life, written once and
left blank for as long as it runs, `—` closing it. A period is drawn as a
labelled rail down the left, coloured by `periods="Gold=gold"` on the block —
`orange`, `gold`, `blue`, `green`, `red`, `ink` — and a period named no colour
runs with a blank rail, which is how a span that is inside nothing looks. A
steps ledger has no span of days, so it is refused a `Period`. Prose after the
table is the why. Examples that follow one another fold behind one `Examples`
toggle, collapsed until opened or deep-linked into, each case open beneath it.
The check refuses a cart line without a price, a timeline that runs back in
time, and a balance the points do not reach, so an example cannot rot when a
rule changes. An example is a points ledger, so a page whose rules move no
points — money off a line, a refusal, a surface's own states — has none, and
reaches for a table instead:

```md
:::example{title="Refund in two parts" tier="Gold" shipping="$30"}
- Gengar single $139

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | 13 pts × 1.2 | +15 | 15 |
| Refunds | $100 of the single | −10 | 5 |
| Refunds | $39 more | −5 | 0 |

Priced apart the two would take 14.
:::
```

A `::figma` card is a placeholder for a component still being built. Once a
`::story` card exists for it, drop the `::figma` card for that same
component — Storybook is the live reference from then on:

```md
::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493" title="Cart drawer"}
```

A figma card badges what the nightly found for the component set behind it,
joined by the frame's node id. An assembly frame answers to no set, so name one
by hand — the check holds the value to the sets the report actually carries:

```md
::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4765-2301" title="Cart item, adjusted row" set="Product / Cart / Cart Item"}
```

Child page cards, for a landing page that needs them somewhere other than the
bottom:

```md
::children
```

Containers hold markdown and, one level deep, leaf directives. A callout is
`note`, `decision` or `warning`. A `warning` wears a signature — whose
judgment it is and when it was last shaped — because hand-written divergence
prose is the one thing here that rots silently. The build derives it from
git, so writing one costs nothing; add `author` and `date` only to sign a
judgment git cannot attribute, such as one recorded on someone's behalf. A
detail block is depth for one audience —
`pm`, `designer`, `qa`, `engineer` or `operator` — collapsed but never hidden,
so it stays searchable and deep-linkable. Its title names what it holds: the
title is all a collapsed block shows, the badge already says who it is for,
and the block's link is made from the title, so `Data model`, never
`For engineers`, and never two alike on one page. Engineer depth sits under
the section it deepens; a fact another page owns is a link, not a
restatement:

```md
:::callout{kind="warning" author="@echo" date="2026-08-30"}
What ships and what the spec says have parted company here.
:::

:::detail{title="Code map" for="engineer"}
- **Config** — `GRADE10_LOYALTY_PROGRAM` in `packages/app-env`
- **Design record** — [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
:::
```

The product record — who a capability is for, what it rules out, what it is
measured on, the decisions behind its requirements and the risks — is a
`detail` for the `pm` audience, titled `Product decisions`, at the end of the
page. Users, measurement and decisions read as tables; an open item is a row
marked ❓; the problem is stated flatly in the present tense, never as today's
gap. Source material is linked, and a reference under `docs/references/` is
read here at `/references/<slug>`:

```md
:::detail{title="Product decisions" for="pm"}
A watch is the cheap, private mark that closes the gap between browsing and
bidding. The owner's brief is [the draft](/references/grade10-loyalty-program).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Privacy | Decided | A watch is visible only to its owner. | Product |
| List placement | ❓ Open | Header vs account area. | Design |
:::
```

A flow reads top to bottom with every step open. Each `##` in its body starts a
step:

```md
:::flow{title="Checkout"}
## The cart is priced
What happens, in plain words.
## Payment is taken
The next thing.
:::
```

The normal path is the flow; the failures and the odd shapes are its cases.
Write each as its own flow under the same title, `case` naming the one it
walks, and they arrive as one flow with a dropdown beside the title. Each
case keeps its own steps and its own drawing, so nothing exceptional is drawn
beside the ordinary path, and a link into any case's step opens that case:

```md
:::flow{title="From a paid order to points" case="Normal" diagram="assets/diagrams/pricing.svg"}
## *Shop* — **Order paid**
The shop sends the paid order.
:::

:::flow{title="From a paid order to points" case="Nothing itemised" diagram="assets/diagrams/pricing-unitemised.svg"}
## *Shop* — **Order paid**
One goods total and no lines at all.
:::
```

A flow that stands alone names no case, every flow in a run names one, and no
two name the same — the check refuses each of those, and two same-titled flows
that sit apart, whose steps would share ids.

A long flow can say which steps belong together. Each `#` opens a phase, and
whatever you write before its first step says what its scope is. Steps stay
numbered straight through, so a link to step 5 still lands on step 5:

```md
:::flow{title="Intake to release"}
# Intake
The item arrives and gets on the diary.

## Open a draft
The collector fills the request wizard.

# Valuation and offer

## Start the valuation
What it is worth.
:::
```

## Citing the Spec

Prose can cite the store by id, and the reference stays honest when the
store moves. Write the id in double brackets:

```md
Expiry is exact — [[grade10-site-loyalty-programme-SC-96]] — and a balance is never negative
([[grade10-site/loyalty/programme#grade10-site-loyalty-programme-SC-04]]).
```

**A page never cites a scenario.** `…-SC-32` says nothing to the person
reading the page, so a rule is stated in the page's own words and the
capability is linked whole. The scenario form below is for the specs and the
guides that quote them.

A reference renders the target's current title as a link, so a renamed
scenario can never orphan the prose that cites it. On a page with a `spec`
in its frontmatter, a bare id resolves inside that spec; anywhere else —
this guide, say — qualify it as `spec-id#item-id`, like
[[grade10-site/loyalty/programme#grade10-site-loyalty-programme-SC-04]]. A reference that resolves to
nothing renders as a marked dead link and draws a check warning.

## Canonical Form

There is exactly one correct text for any page, and committed pages are already
in it: frontmatter keys in the declared order, one blank line between blocks,
attributes in each block's declared order, defaults omitted, prose kept verbatim
inside its trimmed bounds. The editor writes canonical text on every save, so
the rule only bites when you edit a file by hand.

Two things people trip on. Prose headings start at `##`, never `#` — the page
title is the `h1`, and `#` means a phase inside a flow and nothing anywhere
else. And the scanner tracks fenced code blocks, which is why every
directive on this page renders as text instead of as a block: inside a fence,
`::` is just two colons.

## Saving

The block editor only saves when the manual is running locally (`pnpm dev`):
a save writes straight to the working tree. Commit and push like any other
change in the repo, and open a PR. The hosted site is a static build of the
store and is always read-only.

Each read carries a version — a content hash of the file. If somebody saved
before you, you get their version and yours side by side rather than a
silent overwrite.

## Checks

`check:manual` runs in CI, in the same job as spec validation, so the two can
never drift apart quietly. It fails on a page that does not parse or is not
canonical, and on a reference that does not resolve: a `spec` id, a
`requirement=` that matches no heading in that spec, a `scenario=` or `story=`
id, a missing image, a Storybook id no story answers. It also fails when a
durable spec has no page mentioning it, when a product or platform topic has no
page at all, and when `manual.yaml` lists a product twice. A page whose embedded
specs changed meaning after the page's last commit is flagged stale — a
warning, not a failure — naming the requirements that moved and the commit
that moved them. Read the page against them; an edit clears it, and so does
`reviewed:` dated in the frontmatter when the page already reads right.

:::callout{kind="note"}
Write short and straight. The page states the shape and shows what it looks
like; the spec store carries the contract, and a `[[ref]]` is how the two
meet. Delete a paragraph a figma card can replace.
:::
