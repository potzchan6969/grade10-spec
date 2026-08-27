---
name: design-sync-check
description: Run `pnpm run design-sync:check` and act on what it reports - the Figma-vs-code drift check over every component set, its Code Connect templates, and the values they render. Use when the Design sync job fails or a nightly run reports drift, when asked whether the code still matches Figma, when a run prints `No Figma source`, when triaging a `node-id`, `getEnum`, or value-mismatch line, and also when the symptom arrives with no checker named - Dev Mode emitting an empty attribute or a snippet that will not compile, a component rendering a colour or size the design does not draw, or a designer having renamed, republished, or deleted a variant. For authoring a component, use `design-system-components`; for token values, `design-tokens`.
---

# Design-system check

`pnpm run design-sync:check` runs `scripts/design-sync/check-components.mjs` from the repository root. It walks **two** trees — `packages/design-system/src/components` and `packages/ui/src/blocks` — and diffs three things that nothing else keeps honest: the Figma component set's axes, the `cva()` config, and the Code Connect template that maps between them. It takes no arguments and checks no subset; there is no way to scope it to one component.

Read [`docs/governance/design-code-sync.md`](../../../docs/governance/design-code-sync.md) for what each rail enforces and why. This skill is about running it and deciding what to do with the result.

## What brings people here

Half the arrivals name the checker — "run the drift check", "is the design system still in sync with Figma", "Design sync failed overnight", "what does `getEnum('Size') is missing xs` mean", "I get `✗ No Figma source`". Those are unambiguous; skip to the section you need.

The other half describe a symptom and do not know a rail exists. Each of these is the checker's output arriving by a slower route:

| What they say | What it usually is |
| --- | --- |
| "Dev Mode is generating `<Button size="">`" | A `getEnum` missing an option — an error the run names outright. |
| "The Dev Mode snippet doesn't compile" | A prop rename the template did not follow. |
| "Dev Mode shows no connected code at all" | Nothing published. `get_code_connect_map` returns `{}`; the checker cannot see this, so verify it there first. |
| "The badge is a different yellow in the app than in the file" | A value diff, already an error on the last run. |
| "A designer renamed a variant and I don't know what it broke" | A renamed option still type-checks at every call site — this is the rail that catches it. |
| "This component looks wrong but lint and tests pass" | Expected. None of those rails read Figma; only this one does. |

Run the check before theorizing. It is one command and it has usually already found the thing.


## It aborts rather than degrades

**`✗ No Figma source` is exit 1 with nothing checked.** Set `FIGMA_TOKEN` (scope `files:read`) in a `.env` at the repository root — see `.env.example` — or export it. `FIGMA_ACCESS_TOKEN` is a different variable for Code Connect publishing with a different scope, and is not a substitute.

A component can be green on lint, typecheck, and every story while rendering the wrong fill, so **never report a component verified off a run that never reached Figma.** If no token is available, say so and fall back to sampling variants by hand with `get_variable_defs`.

`FIGMA_DUMP=/absolute/path pnpm run design-sync:check` is the manual fallback. A plugin dump carries no variant nodes, so colours and geometry go unchecked; the run warns that it checked names only. Do not read that as coverage. The path is resolved against the repository root, so make it absolute.

## Four output classes, one of them fails

| Line | Meaning | Fails the run |
| --- | --- | --- |
| `✓` | that comparison matched | — |
| `⚠` | the two sides disagree and it may be deliberate | No |
| `–` | a set whose description the designer never wrote | No |
| `✗` | Dev Mode will emit wrong code, or code renders a value Figma does not draw | **Yes** |

A value mismatch is an **error**, not a warning. It was a warning once, and Button's `default` painted a 10% tint against a solid fill for months while the run stayed green — a rail that cannot fail is documentation.

## Triage by the line you got

| Message | What is actually wrong |
| --- | --- |
| `no node-id in the url= comment` | The template's `url=` header lost its node ID; publish would fail validation too. |
| `node-id … not found in Figma` | Deleted, replaced, or aimed at the wrong file. Branch URLs resolve to the **branch** key — check `tokens.config.json → figmaFile` and every `url=` header. |
| `resolves to a node that is not a component` (warn) | The node is sitting right there but is a frame. Code Connect resolves published components only. |
| `getEnum('X') but <set> has no such VARIANT property` | The axis was renamed or removed in Figma, or the template names something that was never a variant property. |
| `getEnum('X') is missing a, b` | Those options resolve to `undefined`; Dev Mode emits `<Button size="">`, which reads as a blank value rather than a broken template. |
| `emits …, which <file> does not define` | The template maps a Figma option onto a **cva option** that does not exist. |
| `<cls> is 32px in code but 24px in Figma` | Value drift. Decide which side is right — see below. |
| `the Figma variant sets no <prop>` | The code paints something the variant does not draw. |
| `the variant draws a fill/stroke …` | Figma draws a colour no class claims. |
| `cannot tell which of … is the base state` (warn) | The value check **skipped** that component rather than diff a hover tint. |
| `emits …, which <file> does not name` (warn) | A **prop** rename the template did not follow — the Dev Mode snippet would not compile. Presence in the file, not type resolution, so a genuinely dropped `href` still passes. |

**A value row is not automatically a code bug.** The code may be right and the Figma file stale. Settle which side is correct before editing either:

- Reconciling code to what Figma already draws is a plain commit. Three Button reconciliations landed that way.
- A **Figma-side** fix is a message to the designer, never a code edit that hides it.
- An option renamed, dropped, or a mismatch you are deliberately keeping is a contract change — hand off to `design-system-components`, and record an OpenSpec change naming the exact exports and the consuming applications. A warning you intend to keep belongs there with a reason, not in the run log.

Never resolve a mismatch by editing the `.figma.ts` template to agree with the code. The template maps names; papering over a disagreement there deletes the only evidence of it.

## What a clean run does not say

- **Base states only.** Hover, disabled, and loading values are never compared. An opacity-based disabled state is doubly invisible — the `bg-*` token this compares is unchanged by it.
- **The variant's own box only.** Label colour, icon size, borders, vertical padding, and anything inside the component are unchecked.
- **Classes, not pixels.** Values come from the utility classes the code declares, not a rendered page.
- **Components with no variant axes have no set to diff.** They are covered by `pnpm run design-sync:audit --all-blocks` against each directory's `audit.json`, and a directory without one is listed as uncovered. A green `design-sync:check` alone is not a green Design sync.
- **Stories are smoke-only**, and the token-free option-coverage rail is `vitest --project contracts`, not this.

## When CI is what failed

Actions → **Design sync** → the newest run. The job summary renders value drift as a table — `Button · size=sm · Height (h-8) · 32px in code · 24px in Figma` — plus the structural errors and warnings, and states its own coverage every run.

The nightly at 01:00 UTC is the run that matters: a Figma edit raises no event in this repository, so push and pull_request runs only catch drift a code change happens to walk into. Re-check on demand with **Run workflow** rather than waiting for the next night.

A run that skipped is not a run that passed. Forks and Dependabot cannot read secrets and emit a warning annotation instead; anywhere else a missing token fails the job as a misconfiguration.
