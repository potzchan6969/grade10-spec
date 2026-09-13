---
title: How this manual works
summary: The store, the loop, and how to work both with an agent.
order: 1
---

This site is a reading surface over the spec store — a git repository where
every product spec, in-flight change, and page of prose lives as a file. A
page states the shape we want in plain words and pictures; the evidence
around it is live. Work in flight shows up on the pages it touches with
tasks done over total, journeys and test cases are embedded from the spec
named in the page's frontmatter, and visuals come straight from Figma and
the deployed Storybook.

## How it is organized

Read it the way the platform is used, not the way the store is filed. The rail
groups by brand first — Grade10's products, ZZZ's — with what both brands
share beside them. **Admin** collects every operator-facing page in one place,
grouped by the product it operates: a capability lives once in the store, and
an `audience: operator` line in its page's frontmatter is all that files it
under Admin instead. **Platform** holds the contracts only builders read — the
shared blocks, the console kit, design sync — and conventions every product
inherits, like how money is written, have their own groups below.
**References** is the store's evidence — the owner's drafts, competitor
research, vendor working notes — read here as written, never edited here.
The row of the page you are reading opens to its sections, and the one you
are in is marked as you scroll.

A capability's page is its PRD. The prose states the shape; the
`Product decisions` detail at the end of the page carries who it is for,
what it rules out, what it is measured on and the decisions behind its
requirements, so there is one place to read a capability and nothing beside
it to keep in step.

Every capability has a page, whatever state its contract is in, and the pip
beside it says which: **planned** (the page states an intended shape nothing
carries yet), **incubating** (a change in flight is writing the spec),
**changing** (a change touches a durable spec), or no pip at all — stable. A
page whose spec is moving carries the change in its in-flight ribbon; the
delta itself, requirement by requirement, is read on the change's own page.
How we work lives under Guides, and [Start here](/guides/start-here) lays a
first hour's path for each job.

## The loop

Specs are not paperwork trailing the code — they are what the work is made
from. A person names what should change, an agent does the drafting and the
building, and git carries every step, so nobody ever updates this site by
hand.

:::flow{title="An idea becomes shipped truth"}
## Propose it where you read it
On the locally-run manual, any requirement row or page header has a propose
action — the hosted site is read-only, here as everywhere. Say why in your
own words — the ids travel along on their own. The proposal lands in
[In Flight](/in-flight)'s Proposed lane.
## An agent drafts the change
Someone points an agent at the proposal — the card names the command to
paste, `/planning-pm <change>`. The agent writes
the change: the reasoning, and a delta against each spec it touches — never a
rewritten copy of the file. People discuss the delta, because the delta is
what there is to decide.
## The work ticks in git
A full change carries a task list, and a task is done when its box is ticked
in a commit. PRDs show the count the moment it moves. There is no
board to update.
## The archive folds it in
Once the code is live, archiving folds the delta into the durable specs and
files the change away. The spec now says in present tense what it used to
promise.
## The manual already knows
Every page names its spec, so its acceptance shelf and its ribbon show the
new truth on the next build.
:::

## Working with an agent

The store is the agent's memory as much as yours: point it at a change or a
capability by id and it reads the same files this site renders. Two habits
make that work.

Cite permanent ids — `grade10-site-loyalty-programme-SC-04`, not "the expiry rule" — in proposals,
bug reports, and prompts. Ids survive renames; prose does not.

Never retype a requirement into a proposal or a prompt. Cite its id; a copy
is the one thing here that can go stale.

The governance docs linked from [How we plan](/guides/how-we-plan) walk the
whole loop once, end to end, in agent terms.

## Editing

Every page is editable in the browser when the manual is running locally, and
every edit lands in git as a commit — git is the only state this app has. The
hosted site is a static build of the store and is always read-only.
[Writing the manual](/guides/writing-the-manual) covers the page grammar and
the block palette.
