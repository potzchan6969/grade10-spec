---
name: design-system-components
description: Create or change a design-system primitive in `packages/design-system` whose contract is defined by a Figma component set. Use when adding a variant, size, or state, when editing a Code Connect template, or when reconciling code with the Figma file.
---

# Design-system components

Use this skill for changes under `packages/design-system/src/components/`. Product components are implemented in the consuming application, not here; see [`docs/governance/ui-component-contracts.md`](../../../docs/governance/ui-component-contracts.md) for their contract.

Read [`docs/governance/design-code-sync.md`](../../../docs/governance/design-code-sync.md) for the ownership table and the reasoning behind every rule below, and [`packages/design-system/DESIGN.md`](../../../packages/design-system/DESIGN.md) before touching the token pipeline.

One component is one Figma component set and one basename in four files: `<name>.tsx`, `<name>.figma.ts`, `<name>.stories.tsx`, and the published Figma set. The checker resolves a Figma set to code by normalizing its name and looking for `src/components/**/<name>.tsx`, so the basename match is load-bearing.

Two jobs run through this skill, and they do not share a step order. **Authoring** a component or an axis runs design-to-code, top to bottom. **Verifying or reconciling** an existing one runs cheapest-diagnostic-first; jump to that section rather than working the authoring list.

## Before you start, either way

**Establish the baseline, and re-establish it before you write up.**

```bash
git log -1 --format='%h %ci %an %s' -- 'packages/design-system/src/components/**/<name>.*'
```

Task groups here are claimed and worked in parallel across people and agents (see [`docs/governance/task-ownership.md`](../../../docs/governance/task-ownership.md)), so a component can be rewritten underneath a long-running analysis. Every conclusion drawn from a file that has since moved is stale, including conclusions that still look right. Check the hash once at the start and once before reporting.

**Confirm you can reach Figma's values.** `pnpm run design-system:check` does not degrade without `FIGMA_TOKEN` — it aborts, exit 1, printing `✗ No Figma source`, and the colour and geometry comparison never runs. A component can be green on lint, typecheck, and every story test while rendering the wrong fill. If no token is available, say so in the handoff and fall back to sampling base variants by hand with `get_variable_defs`; do not report a verified component off a run that never reached Figma.

## Decide this before editing either side

Does the new thing combine with the existing axes?

- **It combines** — it is a new option on an existing VARIANT property. A loading Danger button is sensible, so `Loading` is a value of `State`, not of `Type`.
- **It cannot combine** — if it is only valid alongside one value of another axis, it is a separate component set with its own four files. A link is not a Button variant.
- **Code and design already disagree** — note the mismatch while implementing, but do not create or update `openspec/changes/` during the edit. At the end, record it only if it meets the bar in step 9. Never resolve a mismatch silently inside a `.figma.ts` template.

The operative rule: a component may not offer a variant or size the Figma set does not define. A code-only rung is a contract a consumer will ship that no designer drew.

## The read-only Figma kit

Verification needs three tools, none of which require the `figma-design-to-code` skill — which this repository does not ship anyway: it comes from the official Figma plugin, namespaced `figma:figma-design-to-code` in Claude Code. A reconciliation runs without that plugin installed.

- `get_metadata` on the component **set** — every variant's name, so every axis and option, plus each variant's box. Bounding boxes are the fastest way to spot a rung that moved.
- `get_variable_defs` on a **single variant node** — the token names behind that variant. This is the workhorse: it resolves `Size/size-10`, `Radius/radius-sm`, `Base/primary` by name, which is what you compare the cva against.
- `get_screenshot` on the set — one image confirms fills and relative sizes at a glance and is worth the single call.

`get_design_context` is for implementing a design as code and is gated behind its own mandatory skill. A reconciliation does not need it.

## Order of operations — authoring

1. **Publish the Figma component set first.** Code Connect resolves only published components, and `list_file_components_for_code_connect` returns only published ones.
2. **Pull tokens if design introduced any** (`pnpm tokens:pull` — the `design-tokens` skill carries that leg) and confirm the values exist in `src/themes/grade10.css`. Never hand-edit `src/theme.css` or `src/themes/grade10.css`; edit `tokens.json` or `tokens.config.json` and run `pnpm run tokens:build`.
3. **Write `<name>.tsx`** with one cva option per Figma variant option and nothing more. Open the JSDoc above the export with the **set's Figma description** (it lives on the set, never on a variant), then add any code-specific notes after it. If the description is empty or is only library search keywords ("todo, task, list…" — search metadata, not documentation), write a real one and tell the designer the set has none. A description edit in Figma is a code change: no rail carries it, so the JSDoc is its only projection.
4. **Write `<name>.figma.ts`** with a `getEnum` covering every option of every VARIANT property. An unmapped option resolves to `undefined`, which Dev Mode emits as an empty attribute — `<Button size="">` — not as a visible error. Axes are matched through the template, not by name, so `Type → variant` and `Danger → destructive` are inferred from the mapping itself.
5. **Write `<name>.stories.tsx`** with a story per variant plus disabled, loading, and every other contract state. Stories are colocated in this package, unlike `apps/preview/src/pages/`. `pnpm run test:stories` fails on any cva option no story renders; listing it in `argTypes` does not count.
6. **Run `pnpm run design-system:check`** to zero errors and zero *unexplained* warnings. It aborts without `FIGMA_TOKEN` — see the precondition above. A plugin dump checks names only and says so. A warning you intend to keep belongs in an OpenSpec change with a reason, not in the run log.
7. **Publish Code Connect** and verify with `get_code_connect_map`; it returns `{}` when nothing is published, and Dev Mode then shows no connected code however correct the template is.
8. **Run `pnpm run lint` and `pnpm run typecheck`.** Commit regenerated theme CSS with the token change that produced it.
9. **Update OpenSpec only if the export contract moved.** A prop added or removed, an option renamed, a rung dropped, or a mismatch you are deliberately keeping — those are changes a consumer must adapt to, and the delta names the exact exports and the consuming applications. Reconciling a value — a fill, a height, a disabled treatment — to what Figma already draws is not a contract change and lands as a plain commit; three Button reconciliations have landed that way. When an option is renamed, say so loudly: a removed option is a type error, but a renamed one that still exists compiles and ships the wrong size.

## Order of operations — verifying or reconciling

Cheapest and highest-signal first. Stop as soon as a step tells you the component is not what you were told it is.

1. **Baseline the file**, as above.
2. **`get_code_connect_map` on the set.** One call, no token, and it separates three unrelated failures that all present as "Dev Mode looks wrong": `{}` means the template was never published; `size=""` in a snippet means a `getEnum` is missing that option; a resolution error means a stale `node-id`. A correct local `.figma.ts` proves nothing here — publishing is a separate manual step, so the template and the published mapping drift apart routinely.
3. **`get_metadata` on the set.** Read the axis and option names off the variant names, and diff them against the cva. Read the set's description too, against the JSDoc's opening — a description that moved in Figma is part of a reconciliation, and nothing else will ever flag it. Compare the boxes across variants at the same rung: a rung that is one size for some variants and another size for the rest is a Figma-side drawing error, not something to model in code.
4. **`get_variable_defs` on base variants**, then on at least one **disabled** and one **hover** node, for one solid variant and one borderless one. The checker compares base states only, so a whole state model can drift without a single warning.
5. **`get_screenshot` of the set** to confirm fills and relative sizes.
6. **`pnpm run design-system:check`**, then `pnpm run lint`, `pnpm run typecheck`, and `pnpm run test:stories`.
7. **Re-baseline the file** before writing up.

## Failures that have already cost a rebuild here

- `clone()` silently drops `componentPropertyReferences`. A cloned variant's children come back with `refs: {}`, so nothing is wired to the component's own properties and the failure is invisible until someone sets a label. Capture the references before cloning and reapply them by child index.
- A variant axis driven by a mode-switched variable renders every instance at the default size while the component set looks correct. Instances resolve modes from their own ancestor chain. Bind size-specific primitives directly — `Rounded/rounded-*`, `Typeset/size-*`, `Spacing/space-*` — so each variant is self-contained. Reserve collection modes for context that varies outside the component, such as theme.
- Renaming a size axis shifted every Button rung by one, twice. Design moved `default | sm | xs` to `lg | md | sm`, so `size="sm"` went from meaning 32px to meaning 40px while still type-checking at every call site. A dropped option is caught by the compiler; a renamed one that still exists is not. When a scale is renamed, migrate every call site in the same change and name the consuming applications in the delta.
- A `Custom/*` token exists only in `.theme-grade10`. When a component binds one, add a derived baseline value to `default.css` in both `:root` and `.dark`, or it renders with no background outside the theme.
- Deleting or renaming a variant that instances use leaves an orphaned component and silently repoints live instances. Prefer adding an axis over renaming values.
- Branch URLs resolve to the branch key, which is a distinct file to the API. Repointing a file means updating `tokens.config.json` and every `url=` header.

## What the checker does not cover

Value checking reaches a variant's own background and box geometry only, and only at each axis's base state. A wrong label colour, icon size, or border is invisible to it, and so is every hover, disabled, and loading value.

That gap is not theoretical — verify those states by hand. Sample the disabled and hover nodes with `get_variable_defs` for one solid and one borderless variant, and compare the whole model, not the colour: Figma may express disabled as a fill swap or as `Opacity/opacity-50` over the variant's own colours, and those are different rules in code. An opacity-based state is doubly invisible to the checker, because the fill token it compares is unchanged.

Stories are smoke-only — a story is asserted to exist per cva option, but not to render anything correct. The Storybook suite renders the `default` theme, so a passing run says nothing about how the component looks in Grade10 — review that with the toolbar switched over. The CI job fails when `FIGMA_TOKEN` should have been available and was not, and warns instead on forks and Dependabot, which cannot read secrets; a skipped run is not a passing run.
