---
title: Writing the manual
summary: The voice, the block palette, canonical form, and what happens when you save.
order: 4
---

Every page here is a markdown file in the spec store under `docs/prds/` — a
capability's page is its PRD, which is why the manual lives where PRDs are
looked for. Edit one in the browser or in your editor — the grammar is the
same either way, and the same check refuses a page that breaks it.

A page is YAML frontmatter followed by a sequence of blocks. Frontmatter keys
come in this order. `title` is the surface's plain name — `Main Page`,
`Product Listing`, `Checkout` — never a metaphor. `summary` is a card
subtitle the house style leaves out: the title carries the weight, and the
page shows the rest. `spec` names the spec the page documents. `audience` is
`operator` or absent — `operator` files the page under the Admin nav group,
absent means the product's own users. `order` sorts it among its siblings.
Any other key is a hard error, because an editor that silently drops a field
you typed is worse than one that refuses to save.

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

## Voice

Pages follow the house style — `docs/governance/writing.md` in the store —
and its application here is short:

- **A prose block is an outline** — two sentences at most on what the
  surface is, none of which the items then repeat, then items leading with
  their key term in bold, fragments rather than paragraphs, one concern per
  `##` section, enumerable facts in a table
- **Define the thing flatly**, in present tense, so a reader infers the
  rules from what it is
- **A product's index holds only what no capability page carries** — the
  child cards beneath it already name the capabilities, and a flow or a rule
  that belongs to one of them lives on that page
- **A flow holds the steps** — each `#` phase named as the owner's notes
  name one (`Phase 1 — Online connection`), each `##` step naming its actor
  first, then the action (`User — Book a time slot`), with a line or a short
  outline beneath, never a paragraph
- **Never recap the change** that introduced a capability — today's gap, the
  intended fix, and the success metric belong to the proposal and rot the
  moment it archives
- **Future tense only on a planned page**, and even there the intended
  shape reads as a shape, not a pitch

## The block palette

The page itself carries the shape we want — plain prose and the visuals below.
Requirement text stays in the store: cite it by id where one matters (see
Citing the spec), and never embed the contract into the page.

What a page does embed is acceptance. Journeys and test cases come out of the
spec named in the frontmatter, and journeys are usually the best thing on a
capability page:

```md
::journeys{id="grade10-site/loyalty/programme"}
::cases{id="grade10-site/loyalty/programme"}
```

A page that names a spec in its frontmatter already shows that spec's in-flight
changes. Author this block only to show a *different* spec's:

```md
::changes{spec="grade10-site/loyalty/programme"}
```

Visuals. Figma URLs and Storybook ids are never invented — take them from the
design record or the workbench, and the check now holds you to it: a url naming
another Figma file, or a frame the nightly design sync no longer finds, is a
warning. `alt` on an image is required:

```md
::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493" title="Cart drawer"}
::story{id="blocks-store-cart--default" title="The cart block" height="480"}
::image{src="assets/tier-ladder.png" alt="The four tiers and their thresholds"}
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
so it stays searchable and deep-linkable:

```md
:::callout{kind="warning" author="@echo" date="2026-08-30"}
What ships and what the spec says have parted company here.
:::

:::detail{title="For engineers" for="engineer"}
The data shape, the architecture link, the thing a PM does not need.
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

## Citing the spec

Prose can cite the store by id, and the reference stays honest when the
store moves. Write the id in double brackets:

```md
Expiry is exact — [[loyalty-SC-12]] — and a balance is never negative
([[grade10-site/loyalty/programme#loyalty-SC-04]]).
```

A reference renders the target's current title as a link, so a renamed
scenario can never orphan the prose that cites it. On a page with a `spec`
in its frontmatter, a bare id resolves inside that spec; anywhere else —
this guide, say — qualify it as `spec-id#item-id`, like
[[grade10-site/loyalty/programme#loyalty-SC-04]]. A reference that resolves to
nothing renders as a marked dead link and draws a check warning.

## Canonical form

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
a commit bar appears as soon as the working tree has manual edits, and
pressing it stages `docs/prds/` and commits. Push and open a PR like any other
change in the repo. The hosted site is a static build of the store and is
always read-only.

Each read carries a version — a content hash of the file. If somebody saved
before you, you get their version and yours side by side rather than a
silent overwrite.

## What the check enforces

`check:manual` runs in CI, in the same job as spec validation, so the two can
never drift apart quietly. It fails on a page that does not parse or is not
canonical, and on a reference that does not resolve: a `spec` id, a
`requirement=` that matches no heading in that spec, a `scenario=` or `story=`
id, a missing image, a Storybook id no story answers. It also fails when a
durable spec has no page mentioning it, when a product or platform topic has no
page at all, and when `manual.yaml` lists a product twice. A page whose embedded
specs changed after the page's last commit is flagged stale — a warning, not a
failure.

:::callout{kind="note"}
Write short and straight. The page states the desired shape and shows what it
looks like; the spec store carries the contract, and a `[[ref]]` is how the
two meet. A paragraph a figma card can replace is a paragraph to delete.
:::
