---
title: How this manual works
summary: The store, the loop, and how to work both with an agent.
order: 1
---

This site is a reading surface over the spec store — a git repository where
every product spec, in-flight change, and page of prose lives as a file. The
manual restates none of it. Requirements are embedded from the spec that
governs them, work in flight shows up on the pages it touches with tasks done
over total, and visuals come straight from Figma and the deployed Storybook.
A page cannot quietly drift from what the platform actually does, because it
never held a copy in the first place.

## How it is organized

Read it product first. A product's landing page says what it is and who it
serves; under it sits a page per capability — one thing the product does, for
one audience. Conventions every product inherits, like how money is written
and which zone a date is stated in, have their own sidebar groups. How we
work lives under Guides, and [Start here](/guides/start-here) lays a first
hour's path for each job.

## The loop

Specs are not paperwork trailing the code — they are what the work is made
from. A person names what should change, an agent does the drafting and the
building, and git carries every step, so nobody ever updates this site by
hand.

:::flow{title="An idea becomes shipped truth"}
## Propose it where you read it
Any requirement row or page header has a propose action. Say why in your own
words — the ids travel along on their own. The proposal lands in
[Planning](/planning)'s Proposed lane.
## An agent drafts the change
Someone points an agent at the proposal. It writes the change: the reasoning,
and a delta against each spec it touches — never a rewritten copy of the
file. People discuss the delta, because the delta is what there is to decide.
## The work ticks in git
A full change carries a task list, and a task is done when its box is ticked
in a commit. Capability pages show the count the moment it moves. There is no
board to update.
## The archive folds it in
Once the code is live, archiving folds the delta into the durable specs and
files the change away. The spec now says in present tense what it used to
promise.
## The manual already knows
Every page embedding that spec shows the new truth on the next build. Nothing
was copied, so nothing had to be caught up.
:::

## Working with an agent

The store is the agent's memory as much as yours: point it at a change or a
capability by id and it reads the same files this site renders. Two habits
make that work.

Cite permanent ids — `loyalty-SC-04`, not "the expiry rule" — in proposals,
bug reports, and prompts. Ids survive renames; prose does not.

Never retype a requirement. Embed it or cite it; a copy is the one thing
here that can go stale.

The governance docs linked from [How we plan](/guides/how-we-plan) walk the
whole loop once, end to end, in agent terms.

## Editing

Every page is editable in the browser when the manual is running locally, and
every edit lands in git as a commit — git is the only state this app has. The
hosted site is a static build of the store and is always read-only.
[Writing the manual](/guides/writing-the-manual) covers the page grammar and
the block palette.
