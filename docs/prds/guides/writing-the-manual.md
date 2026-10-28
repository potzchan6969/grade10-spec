---
title: Writing the manual
summary: How to write a page someone can read on the first pass.
order: 5
---

Each page under `docs/prds/` describes one part of the product: what it does,
who it is for, and the decisions behind it. The syntax for blocks is in the
[Block reference](/guides/block-reference); `pnpm check:manual` tells you when
a page breaks it.

## How to Write a Page

Write for a teammate who joined this week and has never seen the code.

- **Name it, then define it** — one item per thing the user meets: its name
  in bold, then the shortest phrase that defines it, such as
  "**Product Count** — number of products given the filters". Write a
  sentence only where a phrase can't carry it. Where examples say it faster,
  give them: "such as Pokémon and One Piece", not "the franchise a card comes
  from". Each definition reads alone, never only against its neighbour
- **Group by what the user does** — browsing, filtering, searching, paying.
  Everything about one topic sits in one section, and each fact is said
  once, in the section that owns it
- **Names are plain** — "Sale Price", "Search Box", in the words a customer
  or a shopkeeper would use. Not slogans, riddles or the system's internal
  names; a term of our own is defined the first time
- **One meaning everywhere** — a name never borrows a word the product
  already uses for something else, so it reads the same on any page, out of
  context: "Sort Options", not "Orders", where an order is what a customer
  pays for. Choose the word that carries the meaning alone, rather than
  rely on the section around it
- **Things are nouns, behaviours are verbs** — a thing the user meets is
  named with a noun: "Product Link", not "Opening a Product"; "Sort", not
  "Sorting". A behaviour, what happens when the user does something, keeps
  its verb: "Combining Options", because the act is what the line defines
- **Define what it is, not what it isn't** — "number of products given the
  filters" already rules out counting the loaded cards. Say what doesn't
  happen only when the block can do it and the product doesn't, such as a
  stock count the card can show
- **Nest what belongs to something** — a part sits under its whole: how a
  card opens sits under the grid, not beside it. Siblings are things of the
  same kind. The heading is the top parent, so an item that only names its
  children goes
- **Most important first** — at each level, the item the user meets first,
  or acts on, leads
- **Leave out what belongs elsewhere** — every edge case is in the test
  cases, how it works is in `docs/architecture`, and small UI choices are in
  the design record. Link to them instead
- **Decisions are product judgments** — the `Product decisions` block at the
  end records why we chose something, for whom, and what we ruled out. It is
  not a log of every detail or of which change decided it

## Screens and Stories

A section about a screen is a short list of what the user gets, its open
items in a note, and its stories.

- **When a story exists** — don't describe what it shows. Write only what a
  story can't: which data appears (what is hidden, what a count counts, what
  a sort covers), what happens across pages (the address, Back, the cart),
  and which of a block's states the product uses, where the block can do more
- **One story a section** — the one that shows the section best. Its other
  states are a click away in Storybook; embed a second only when the page
  names a rule that only that state shows
- **When the design is still pending** — list the rules the design must
  carry, so the designer and the engineer start from the same list

```md
## Products Display

- **Product Count** — number of products given the filters
- **Product Grid** — product cards; more load when scrolling to the bottom
  - **Opening a Product** — the photo or the name; a sold-out card doesn't open

:::callout{kind="note"}
- ❓ **Draft products** — left out. Product confirms
:::

::story{id="store-product-listing-screens-product-list--default" title="The listing"}
```

## Marks

- **❓ or `TBC`** — not confirmed yet. Say who confirms it
- **🚧** — confirmed and being built. One line per outcome; remove the mark
  once it ships and is checked
- **One mark a line** — never 🚧 and ❓ on the same line

## Naming a Control

Button and tab labels change without anyone touching the manual, so don't find
a control by its label. Describe where it is instead: "the bid button in the
bid panel".

When the exact words matter, such as an error the user must see or a legal
line, cite the message key and its English words:

```md
A refusal ends in a `auctionListing.verifyAction` ("Verify") link.
```

`check:manual` fails a key the English catalogs in `packages/i18n/messages`
don't hold, or words that don't match; `pnpm check:manual --fix` updates the
words. Words that aren't ours, such as a vendor's button, are quoted as they
are.
