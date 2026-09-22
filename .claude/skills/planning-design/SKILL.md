---
name: planning-design
description: The designer's lane on an OpenSpec change - specifying a new one the way the PM does, or supplementing a change somebody else specified - and the ui-design.md artifact either way, carrying the design reference (Storybook, design-system, ui, i18n) the outline and the requirements are built on. Use when a change alters something a user sees.
---

# The designer's lane

One of the eight artifacts in `grade10-planning` is yours on every change:

| Artifact | What it holds |
| --- | --- |
| `ui-design.md` | Screens, the exports each composes, and the states each carries |

**Which lane you are in depends on whether the change exists.**

| You are | Then | Yours to write |
| --- | --- | --- |
| Specifying a new change | The PM's lane is yours — run `/workflow-plan` | The proposal, `decisions.md`, the journeys, **and** the design reference you hand over with them |
| Picking up a change somebody specified | Supplement it | `ui-design.md`, and the design reference it stands on |

**A new change is the same job the PM does**, and `/workflow-plan` is the run that opens
it — the interview, the PRD marks, the proposal, the decisions, the journeys.
Its description says "a product manager or a designer" for this reason. Run it
rather than working from memory, and stop where it stops: `spec.md` is not that
lane's to write, in your hands any more than the PM's. `/workflow-specify` writes its
outline from your journeys and your marks, and the design reference is what
makes those groups name what exists.

What a designer brings that a PM does not is **the design reference**: what
already exists in Storybook, in `packages/design-system`, in `packages/ui` and
in `packages/i18n`. The outline's feature set and the requirements drawn from it
are cheaper and truer when they are written against the inventory rather than
against an imagined one, so the reference is not decoration on `ui-design.md` —
it is what a designer specifies from.

**Supplementing an existing change** is the other entry, and the commoner one:
the proposal, the decisions and the journeys are already written, `spec.md` is
usually not — you come before it — and what is missing is the surface. Add `ui-design.md` to that change,
never a second one, and flag what does not exist yet so `tasks.md` carries it.
A product detail you learn while drawing goes on the PRD first, marked 🚧 or ❓,
before this file cites it. A **scope** fact goes on `decisions.md` first, as a
revised row: a non-goal that turns out to be load-bearing, a goal no screen can
deliver, an option the interview dropped that the screens will not support. The
two are different records - the PRD is what the product should be, `decisions.md`
is what this change chose - and a state that contradicts a recorded decision is
not automatically your error to absorb.

Optional: **a change with no user-facing surface skips the file entirely.**
Nothing downstream waits on it. Do not write an empty one to look complete. A PM who already has the
design writes it themselves — what the file must hold does not change with who
types it.

## Link, never restate

This file holds nothing the other three already say. Each section points at its
source of truth:

- the **capability spec** owns behavior;
- **Figma** owns layout;
- **`tech-design.md`** owns technical decisions.

A section that would only repeat one of them points at it instead.

## Steps

1. **Read what already exists**, and write back to it where drawing moves it.
   The change's `decisions.md` for its goals and
   edges, its `user-journeys.md` for who walks it, and the durable
   `specs/<capability>/spec.md` for the capability's current `## Purpose` and
   `## Feature set`. **Do not wait for the change's own `spec.md`**: your file
   lands before it, so the change's groups are usually not written yet and
   `## Requirements` does not exist at all. The journeys are the anchors to
   reach for; a feature set group only where the durable capability already
   issues one. Then the capability's PRD under `docs/prds/` when one exists. A state or a variant you decide goes on the PRD first, before
   `ui-design.md` cites it, only when it changes an outcome the reader
   meets — what they can do, see counted, or are refused — and then as one
   🚧 line that replaces the line it supersedes, never beside it. Everything
   else — a breakpoint, a token, a label rule, an empty, loading or error
   treatment — is a row in this file's States table and a `::story` card on
   the page. A 🚧 line that names a control, a drawer or a pill is a
   description: rewrite it as the outcome, or drop it.
2. **Read the enriched instructions `/workflow-design` renders.** They carry this
   store's own rules from `openspec/config.yaml` on top of the schema's.
3. **Take the inventory before you name anything new** — `## The design
   reference` below is where it comes from. A page is composition, not
   invention; see `/page-from-figma` for the inventory gate when you are
   converting a drafted screen.
4. **Write the three sections.**

## The design reference

Four legs, and each answers a different question. Cite them in `ui-design.md`
where a reader would otherwise have to guess, and hand them over with the change
when it is yours to specify — the run that writes the outline has your journeys,
your marks and this reference, and nothing else.

| Leg | Answers | Where |
| --- | --- | --- |
| **Storybook** | What a primitive or a block already does, running | `pnpm run storybook:design-system`, `pnpm run storybook:ui`, `pnpm run storybook:workbench` for page assemblies; deployed under the `storybookBase` in `docs/prds/manual.yaml` |
| **`packages/design-system`** | Which primitives exist, and every token value | `src/components/{display,forms,layout,overlays,providers}/`, and `tokens.json` |
| **`packages/ui`** | Which compound components a capability already ships | `src/blocks/<capability>/` |
| **`packages/i18n`** | Which words exist, in which languages | `messages/{shared,<brand>}/<locale>/<namespace>.json` |

**Storybook is the fastest of the four and the only running one.** A `::story`
card on the PRD points a reader at the same story, and `pnpm check:manual`
resolves its id against the workbench build under
`apps/preview/storybook-static*` — where one has been built. Where none has,
the run says how many ids it could not check rather than passing them, so an
invented id is caught by whoever builds it next.

**Copy is inventory too.** A block never imports the catalogs; content reaches
it through props, and the consuming application wires `@grade10/i18n`. So a
label you draw is a key somebody answers: `shared/` answers what no brand
claims, once per language, and a brand answers only what says something about
itself, in every language it speaks. `pnpm run test` refuses a key left
unanswered or answered twice, which is why new copy is work to carry rather
than a string to drop in.

## Screens

One subsection per user-facing surface, each linking its Figma frame. **The
frame is the layout's source of truth, so never describe a screen in prose** —
a description and a frame that disagree is drift nobody can adjudicate.

## Components

The design-system primitives and `@grade10/ui` exports each screen composes,
**named exactly**: the export name is the cross-repo contract, and the
capability spec keeps the authoritative set in one requirement.

A component, variant, token or word that does not exist yet is **work in
grade10-spec**. Flag it here so `tasks.md` carries it, and say which of the
four it is:

| Missing | Where it lands | Skill |
| --- | --- | --- |
| A variant, size, or state of a primitive | `packages/design-system/src/components/` | `design-system-primitives` |
| A token value | `packages/design-system/tokens.json` | `design-tokens` |
| A compound component a capability names | `packages/ui/src/blocks/` | the capability spec's export requirement |
| A word nobody has written yet | `packages/i18n/messages/…/<namespace>.json` | the layer rule above — every language of its layer answers it |

A primitive may not offer a variant or size the Figma component set does not
define. Where code and design genuinely disagree, that is an OpenSpec change,
not something absorbed into a Code Connect template — read
`docs/governance/design-code-sync.md`.

## States

Loading, empty, error and edge states per screen, as a **markdown table** under
one `###` per screen — columns **State**, **Shows**, **Anchor**, **one state
per row**. State is the short name; Shows is what is on screen (controls, copy,
what is hidden); Anchor is the journey id from `user-journeys.md`, or a
`## Feature set` root group the durable capability already issues. A state with
no anchor behind it means the journeys are missing one — say so to whoever wrote
them, and do not invent the journey yourself.

**One per row is what makes the table countable.** The requirements' second
pass walks it and closes every row — replacing Anchor with the scenario it
became, or an `**Out of suite:**` naming where the state is stated instead —
and `pnpm check:manual` names one it left open. A cell holding three states can
be closed by one scenario and look complete, which is the shape that let empty
and error treatments arrive as reconciliation findings run after run.

The dispositions are written onto your rows, by the hand that writes the
requirements. Leave them alone; they are not yours to fill in ahead of the pass,
and a state you argue with is a conversation with that hand rather than an edit.

**Never a scenario id.** The whole of `spec.md` is written after this file, by
`/workflow-specify`, and `pnpm check:manual` refuses an id the store issues nowhere.
The tie still does its work: a scenario serves the anchor your state named, so
your edge case reaches the requirements rather than restating them.

**Copy each id from the heading that issues it, and write it in backticks.**
A prefix is read, never reconstructed: most capabilities issue
`grade10-site-auction-account-record-US-02`, a few issue `winner-order-US-04`
and keep it, so shortening one to match its neighbour names nothing. Outside
backticks nothing reads the citation, so a renumber leaves the row pointing at
a journey nobody issues any more and no check says so.

Do not flatten a screen into a semicolon-joined bullet list. One named state,
what shows, one anchor — dense prose in a single cell is the failure mode.

## Finish

A change that needs an artifact nobody has written yet says so: `awaiting:`
with `<artifact>: <what is missing>` in its `.openspec.yaml`. That line is
what puts it on [Pending](/pending) under the teammate who owes it.

Then say the change still needs its delivery plan — `ui-design.md` does not
move it off the planning board. Only `tasks.md` does.

## Related

- `planning-pm` — your own lane on a new change, and the journeys your states
  hang off on somebody else's.
- `planning-qa` — the scenarios written after yours, serving the same anchors.
- `planning-dev` — the plan that carries the component and copy work you flagged.
- `page-from-figma` — converting a drafted screen into composed code.
- `design-system-primitives`, `design-tokens`, `design-sync-check` — the rails
  for the kinds of missing thing.
