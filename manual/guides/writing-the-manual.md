---
title: Writing the manual
summary: The block palette, canonical form, and what happens when you save.
order: 3
---

Every page here is a markdown file in the spec store under `manual/`. Edit one
in the browser or in your editor — the grammar is the same either way, and the
same check refuses a page that breaks it.

A page is YAML frontmatter followed by a sequence of blocks. Frontmatter has
exactly four keys, always in this order. `title` is a short product-voiced name.
`summary` is one plain sentence and becomes the card subtitle. `spec` names the
spec the page documents. `order` sorts it among its siblings. Any other key is a
hard error, because an editor that silently drops a field you typed is worse
than one that refuses to save.

```yaml
---
title: Loyalty
summary: Points, tiers, and what a member gets back.
spec: grade10-store/loyalty
order: 2
---
```

Everything between directives is prose — GitHub markdown, headings starting at
`##`, no raw HTML. Directives sit at column 0: two colons open a leaf, three
open a container that a bare three-colon line closes. Attribute values are
double-quoted, and a quote character can never appear inside one.

## The block palette

Embed a spec whole, or select one piece of it. Scenario and story ids are
permanent, so prefer them when a single requirement is making your point:

```md
::spec{id="grade10-store/loyalty"}
::spec{id="grade10-store/loyalty" scenario="loyalty-SC-04"}
::spec{id="grade10-store/loyalty" story="loyalty-US-01"}
::spec{id="grade10-store/loyalty" requirement="Exact heading text"}
```

Journeys and test cases come out of the same spec. Journeys are usually the
best thing on a capability page — put them before the full contract:

```md
::journeys{id="grade10-store/loyalty"}
::cases{id="grade10-store/loyalty"}
```

A page that names a spec in its frontmatter already shows that spec's in-flight
changes. Author this block only to show a *different* spec's:

```md
::changes{spec="grade10-store/loyalty"}
```

Visuals. Figma URLs and Storybook ids are never invented — take them from the
design record or the workbench. `alt` on an image is required:

```md
::figma{url="https://www.figma.com/design/abc/Store" title="Cart, empty and filled"}
::story{id="blocks-store-cart--default" title="The cart block" height="480"}
::image{src="assets/tier-ladder.png" alt="The four tiers and their thresholds"}
```

Child page cards, for a landing page that needs them somewhere other than the
bottom:

```md
::children
```

Containers hold markdown and, one level deep, leaf directives. A callout is
`note`, `decision` or `warning`. A detail block is depth for one audience —
`pm`, `designer`, `qa`, `engineer` or `operator` — collapsed but never hidden,
so it stays searchable and deep-linkable:

```md
:::callout{kind="warning"}
What ships and what the spec says have parted company here.
:::

:::detail{title="For engineers" for="engineer"}
The data shape, the architecture link, the thing a PM does not need.
:::
```

A flow is a step player. Each `##` in its body starts a step:

```md
:::flow{title="Checkout"}
## The cart is priced
What happens, in plain words.
## Payment is taken
The next thing.
:::
```

## Canonical form

There is exactly one correct text for any page, and committed pages are already
in it: frontmatter keys in the declared order, one blank line between blocks,
attributes in each block's declared order, defaults omitted, prose kept verbatim
inside its trimmed bounds. The editor writes canonical text on every save, so
the rule only bites when you edit a file by hand.

Two things people trip on. Prose headings start at `##`, never `#` — the page
title is the `h1`. And the scanner tracks fenced code blocks, which is why every
directive on this page renders as text instead of as a block: inside a fence,
`::` is just two colons.

## Saving

Running the manual locally, a commit bar appears as soon as the working tree has
manual edits; pressing it stages `manual/` and commits. On the hosted site you
paste a fine-grained GitHub token in settings, and the first write creates or
reuses a branch named for your login *and* its pull request together, so an edit
can never rot on a branch nobody opened. Without a token the site is read-only.

Each read carries a version — a content hash locally, the blob SHA on GitHub.
If somebody saved before you, you get their version and yours side by side
rather than a silent overwrite.

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
Write prose first and blocks second. Never retype a requirement in your own
words: embed it. The page exists to connect and narrate; the spec block carries
the contract, and only one of those two can go out of date.
:::
