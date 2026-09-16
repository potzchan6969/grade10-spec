---
name: planning-design
description: Write the ui-design.md artifact on an OpenSpec change - the designer's by default, and the product manager's when they already have the design - mapping each screen to its Figma frame, its component exports, and its states. Use when a change alters something a user sees.
---

# The designer's artifact

One of the seven artifacts in `grade10-planning` is yours:

| Artifact | What it holds |
| --- | --- |
| `ui-design.md` | Screens, the exports each composes, and the states each carries |

It is yours by default, and not exclusively: **a product manager who already
has the design writes it themselves**, in the same change, rather than holding
the change open for one to be drawn. What the file must hold does not change
with who types it - everything below applies either way.

Optional: **a change with no user-facing surface skips the file entirely.**
Nothing downstream waits on it, and `openspec status` simply lists it as not
produced. Do not write an empty one to look complete.

## Link, never restate

This file holds nothing the other three already say. Each section points at its
source of truth:

- the **capability spec** owns behavior;
- **Figma** owns layout;
- **`tech-design.md`** owns technical decisions.

A section that would only repeat one of them points at it instead.

## Steps

1. **Read what already exists.** The change's `user-journeys.md`, and
   `specs/<capability>/spec.md` for its `## Purpose` and `## Feature set` —
   together they are the anchor set, and the states you document dress the
   outcomes those anchors name. **Do not wait for requirements**: your file is
   written before them, and `## Requirements` is empty or absent while you
   work. Then the capability's PRD under `docs/prds/` when one exists. A state or a variant you decide goes on the PRD first, before
   `ui-design.md` cites it, only when it changes an outcome the reader
   meets — what they can do, see counted, or are refused — and then as one
   🚧 line that replaces the line it supersedes, never beside it. Everything
   else — a breakpoint, a token, a label rule, an empty, loading or error
   treatment — is a row in this file's States table and a `::story` card on
   the page. A 🚧 line that names a control, a drawer or a pill is a
   description: rewrite it as the outcome, or drop it.
2. **Read the enriched instructions.**

   ```bash
   openspec instructions ui-design --change <change-name>
   ```

   It carries this store's own rules from `openspec/config.yaml` on top of the
   schema's.
3. **Take an inventory before you name anything new.** Read
   `packages/design-system/src/components/` for the primitives and
   `packages/ui/src/blocks/` for the compound components. A page is
   composition, not invention — see `/page-from-figma` for the inventory gate
   when you are converting a drafted screen.
4. **Write the three sections.**

## Screens

One subsection per user-facing surface, each linking its Figma frame. **The
frame is the layout's source of truth, so never describe a screen in prose** —
a description and a frame that disagree is drift nobody can adjudicate.

## Components

The design-system primitives and `@grade10/ui` exports each screen composes,
**named exactly**: the export name is the cross-repo contract, and the
capability spec keeps the authoritative set in one requirement.

A component, variant, or token that does not exist yet is **work in
grade10-spec**. Flag it here so `tasks.md` carries it, and say which of the
three it is:

| Missing | Where it lands | Skill |
| --- | --- | --- |
| A variant, size, or state of a primitive | `packages/design-system/src/components/` | `design-system-primitives` |
| A token value | `packages/design-system/tokens.json` | `design-tokens` |
| A compound component a capability names | `packages/ui/src/blocks/` | the capability spec's export requirement |

A primitive may not offer a variant or size the Figma component set does not
define. Where code and design genuinely disagree, that is an OpenSpec change,
not something absorbed into a Code Connect template — read
`docs/governance/design-code-sync.md`.

## States

Loading, empty, error and edge states per screen, **each tied to the anchor it
dresses** — a journey id from `user-journeys.md`, or a `## Feature set` root
group. A state with no anchor behind it means the anchor set is missing one —
say so to the PM, and do not invent the journey yourself.

**Never a scenario id.** The scenarios are written after this file, by
`/planning-qa`, and `pnpm check:manual` refuses an id the store issues nowhere.
The tie still does its work: a scenario serves the anchor your state named, so
your edge case reaches the requirements rather than restating them.

**Copy each id from the heading that issues it, and write it in backticks.**
A prefix is read, never reconstructed: most capabilities issue
`grade10-site-auction-account-record-US-02`, a few issue `winner-order-US-04`
and keep it, so shortening one to match its neighbour names nothing. Outside
backticks nothing reads the citation, so a renumber leaves the row pointing at
a journey nobody issues any more and no check says so.

## Finish

```bash
pnpm run validate:changes <change-name>
openspec status --change <change-name>
```

A change that needs an artifact nobody has written yet says so: `awaiting:`
with `<artifact>: <what is missing>` in its `.openspec.yaml`. That line is
what puts it on [Pending](/pending) under the teammate who owes it.

Then say the change still needs its delivery plan — `ui-design.md` does not
move it off the planning board. Only `tasks.md` does.

## Related

- `planning-pm` — the journeys and the anchor set your states hang off.
- `planning-qa` — the scenarios written after yours, serving the same anchors.
- `planning-dev` — the plan that carries the component work you flagged.
- `page-from-figma` — converting a drafted screen into composed code.
- `design-system-primitives`, `design-tokens`, `design-sync-check` — the rails
  for the three kinds of missing thing.
