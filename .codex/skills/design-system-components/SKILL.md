---
name: design-system-components
description: Create or change a design-system primitive in `packages/design-system` whose contract is defined by a Figma component set. Use when adding a variant, size, or state, when editing a Code Connect template, or when reconciling code with the Figma file.
---

# Design-system components

Use this skill for changes under `packages/design-system/src/components/`. `packages/ui-components` is a separate package with a different contract; use `stateless-ui-components` there.

Read [`docs/governance/design-code-sync.md`](../../../docs/governance/design-code-sync.md) for the ownership table and the reasoning behind every rule below, and [`packages/design-system/DESIGN.md`](../../../packages/design-system/DESIGN.md) before touching the token pipeline.

One component is one Figma component set and one basename in four files: `<name>.tsx`, `<name>.figma.ts`, `<name>.stories.tsx`, and the published Figma set. The checker resolves a Figma set to code by normalizing its name and looking for `src/components/**/<name>.tsx`, so the basename match is load-bearing.

## Decide this before editing either side

Does the new thing combine with the existing axes?

- **It combines** — it is a new option on an existing VARIANT property. A loading Danger button is sensible, so `Loading` is a value of `State`, not of `Type`.
- **It cannot combine** — if it is only valid alongside one value of another axis, it is a separate component set with its own four files. A link is not a Button variant.
- **Code and design already disagree** — record the decision in an `openspec/changes/<change-name>/` proposal before writing anything. Never resolve a mismatch inside a `.figma.ts` template.

The operative rule: a component may not offer a variant or size the Figma set does not define. A code-only rung is a contract a consumer will ship that no designer drew.

## Order of operations

1. **Publish the Figma component set first.** Code Connect resolves only published components, and `list_file_components_for_code_connect` returns only published ones.
2. **Pull tokens if design introduced any** (`pnpm tokens:sync`) and confirm the values exist in `src/themes/acetrader.css`. Never hand-edit `src/theme.css` or `src/themes/acetrader.css`; edit `tokens.json` or `tokens.config.json` and run `pnpm run tokens:build`.
3. **Write `<name>.tsx`** with one cva option per Figma variant option and nothing more.
4. **Write `<name>.figma.ts`** with a `getEnum` covering every option of every VARIANT property. An unmapped option resolves to `undefined` and emits broken code. Axes are matched through the template, not by name, so `Type → variant` and `Danger → destructive` are inferred from the mapping itself.
5. **Write `<name>.stories.tsx`** with a story per variant plus disabled, loading, and every other contract state. Stories are colocated in this package, unlike `apps/ui/src/stories/`. `pnpm run test:stories` fails on any cva option no story renders; listing it in `argTypes` does not count.
6. **Run `pnpm run check:design-system`** to zero errors and zero *unexplained* warnings. A warning you intend to keep belongs in an OpenSpec change with a reason, not in the run log.
7. **Publish Code Connect** and verify with `get_code_connect_map`; it returns `{}` when nothing is published, and Dev Mode then shows no connected code however correct the template is.
8. **Run `pnpm run lint` and `pnpm run typecheck`.** Commit regenerated theme CSS with the token change that produced it.

## Failures that have already cost a rebuild here

- `clone()` silently drops `componentPropertyReferences`. A cloned variant's children come back with `refs: {}`, so nothing is wired to the component's own properties and the failure is invisible until someone sets a label. Capture the references before cloning and reapply them by child index.
- A variant axis driven by a mode-switched variable renders every instance at the default size while the component set looks correct. Instances resolve modes from their own ancestor chain. Bind size-specific primitives directly — `Rounded/rounded-*`, `Typeset/size-*`, `Spacing/space-*` — so each variant is self-contained. Reserve collection modes for context that varies outside the component, such as theme.
- Naming variant options from a related token rather than the collection behind them shifted every Button size rung by one: "the sm button" meant 32px to design and 24px to code.
- A `Custom/*` token exists only in `.theme-acetrader`. When a component binds one, add a derived baseline value to `default.css` in both `:root` and `.dark`, or it renders with no background outside the theme.
- Deleting or renaming a variant that instances use leaves an orphaned component and silently repoints live instances. Prefer adding an axis over renaming values.
- Branch URLs resolve to the branch key, which is a distinct file to the API. Repointing a file means updating `tokens.config.json` and every `url=` header.

## What the checker does not cover

Token values and geometry are unchecked: every axis and option can line up while the colours, heights, and padding are wrong. Stories are smoke-only — a story is asserted to exist per cva option, but not to render anything correct. The Storybook suite renders the `default` theme, so a passing run says nothing about how the component looks in AceTrader — review that with the toolbar switched over. The CI job skips with a warning when `FIGMA_TOKEN` is unavailable, and a skipped run is not a passing run.
