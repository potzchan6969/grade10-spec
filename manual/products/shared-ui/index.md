---
title: Shared UI
summary: The blocks every storefront is built out of, drawn once and themed per brand.
---

`shared-ui` is not a product a shopper opens. It is the component layer both
storefronts are built out of — a site header and footer, a store front door, a
browse page, a product card, a cart drawer, an auction lot page. Rather than
each application drawing those again, they are drawn once and each application
supplies its own words, images, catalogue and callbacks.

## What a block is

A block is a compound component named by a capability spec. It renders what it
is given and reports what was pressed, and that is all it does. It fetches
nothing, stores nothing, navigates nowhere, and imports no application. All the
words it renders arrive in one typed group of copy, and all its styling comes
from design tokens.

Those constraints are what let one component serve two brands: re-theming
re-brands it without touching its source. They are also what makes every visible
state reachable from a Storybook story with props alone — if a state needs a
running backend to see, the block is doing too much.

## Who consumes it

Both brands' storefront applications, and the page workbench that assembles
whole pages from them. A shopper sees its output on every screen; an engineer
building a page is the direct consumer; a designer owns the Figma frames each
block was converted from, and an automated audit holds the two together.

## How the capabilities fit

One capability is the rulebook for the package itself. The rest are surfaces, in
the order a shopper meets them: the chrome around every page, the store front
door, the browse page, the cart drawer, and the auction lot page.

:::callout{kind="note"}
Admin console shapes used to live here and no longer do. They moved to their own
product, because admin surfaces carry no brand design and belong in the
application repository. A component serving customers as well — signing in,
two-factor enrolment — stays here even when a console also renders it.
:::
