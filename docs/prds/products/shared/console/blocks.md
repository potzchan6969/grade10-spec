---
title: Console Blocks
spec: shared/console/blocks
order: 1
---

Every console draws the same handful of shapes: a data table with its rows and
cells, dates and amounts, a status line, a form dialog, a section header, an
operator identity strip, a status badge, a key-value figure list, and a cursor
pager. They ship from one package, and a console surface renders them from there
rather than keeping a local copy that slowly stops matching.

A block carries no brand and no product state. It composes design-system
primitives, receives everything already resolved by the console — copy, dates,
amounts — and reports every interaction through a callback. It never fetches,
persists, navigates, or imports an application.

## The behaviours worth knowing

Loading, refused and empty are three distinct states that never collapse into
one. A surface that is still reading says so and offers no rows and no empty
message; a refused read renders in the error tone; an empty result says there is
nothing, in the secondary tone, with no error anywhere.

An irreversible move always confirms in a dialog the surface renders, naming the
move in the console's own words and offering cancel — never the browser's native
confirmation. Switching panels announces itself as tabs. Narrowing a dataset is
one segmented choice whose selected option is announced, rather than buttons
distinguished only by styling.

An amount in a table arrives as a whole number of minor units plus its ISO
currency code, and renders naming that code — never a symbol two currencies
could share, in a console where two currencies routinely sit in one column. And
a queue longer than its page is walkable in both directions, rather than merely
told it has more.

## Journeys

::journeys{id="shared/console/blocks"}
