# Keeping Figma and code in sync

This guide covers the four artifacts that together define one design-system primitive, who owns which decision, and what is mechanically enforced. It applies to `packages/design-system`. Read it with [`ui-component-contracts.md`](ui-component-contracts.md), which covers the separate portable-component package, and with [`packages/design-system/DESIGN.md`](../../packages/design-system/DESIGN.md) for the token pipeline.

## The four artifacts

One component is one Figma component set and one basename, in four colocated files:

```
src/components/forms/button.tsx           implementation
src/components/forms/button.figma.ts      Code Connect template
src/components/forms/button.stories.tsx   rendered evidence
                                          + the Figma component set
```

The basename match is not cosmetic. `scripts/check-components.mjs` resolves a Figma component to its code by normalizing the set's name and looking for `src/components/**/<name>.tsx`; a mismatch is reported as "no code component".

## Ownership

Each artifact is the sole authority over exactly one thing, and no artifact owns two:

| Artifact | Sole authority over | Must never |
| --- | --- | --- |
| Figma component set | Which variants, states, and sizes exist | Be where a value is hardcoded past the token layer |
| `tokens.json` | What the values are | Be edited to suit one component |
| `<name>.tsx` | How the contract is implemented | Invent a variant or size rung |
| `<name>.figma.ts` | The name mapping between the two | Paper over a mismatch |
| `<name>.stories.tsx` | Proof that each contract state renders | Be treated as a source of truth |

The operative rule: **a component may not offer a variant or size the design does not define.** A code-only rung is not a harmless extra — it is a thing a consumer will ship that no designer ever drew, and it silently becomes a contract you cannot change later.

Where code and design genuinely disagree, that is a decision to record in an OpenSpec change, not a difference to smooth over in a template.

## Creating a component

1. **Publish the Figma component set first.** Code Connect only resolves published components, and `list_file_components_for_code_connect` only returns published ones.
2. **Pull tokens** if the design introduced any (`pnpm tokens:sync`), and confirm the values you need exist in `src/themes/acetrader.css`. Adding a component that binds a token the baseline `default` theme lacks will render it unstyled outside `.theme-acetrader` — see "Theme coverage" below.
3. **Write `<name>.tsx`** with one cva option per Figma variant option, and nothing more.
4. **Write `<name>.figma.ts`** with a `getEnum` covering *every* option of every VARIANT property. An unmapped option resolves to `undefined` and emits broken code.
5. **Write `<name>.stories.tsx`** with a story per variant, plus disabled, loading, and any other state the contract has.
6. **Run `pnpm run check:design-system`** and get to zero errors and zero *unexplained* warnings. A warning you intend to keep belongs in an OpenSpec change with a reason, not in the run log.
7. **Publish Code Connect.** A correct template that was never published leaves Dev Mode showing no connected code at all — verify with `get_code_connect_map`, which returns `{}` when nothing is published.

## What the checker enforces

`pnpm run check:design-system` runs `scripts/check-components.mjs`.

**Source.** `FIGMA_TOKEN` is the default and needs only the `files:read` scope. Note the contrast with the token pull: `scripts/figma/pull.mjs` has no REST path because `/v1/files/:key/variables/local` requires `file_variables:read`, which Figma gates to Enterprise. That gate is specific to *variables*. Component property definitions live in the file document, so this check runs unattended even though the token pull cannot. `FIGMA_DUMP=<file.json>` remains as a manual fallback.

`tokens.config.json → figmaFile` names the target. Branch URLs (`/design/:key/branch/:branchKey/...`) resolve to the **branch** key, because a branch is a distinct file to the API.

**Errors — exit 1, Dev Mode would emit wrong code:**

- A template's `node-id` is missing or no longer resolves.
- A `getEnum` names a VARIANT property the component set does not have.
- A `getEnum` omits an option, which would resolve to `undefined`.
- A `getEnum` emits a value the cva does not define.

**Warnings — the two sides disagree, which may be deliberate:**

- A cva option no Figma option maps to (code-only surface).
- A cva axis reachable from no Figma variant property.
- A Figma axis no template maps.
- A Figma component with no code component.

**Axes are matched through the template, never by name.** Figma calls the axis `Type`; cva calls it `variant`. Comparing those by name produced two mutually contradicting warnings on every component, and a real `Danger`/`destructive` mismatch once hid inside that noise. Instead the checker reads the values a `getEnum` produces and finds the cva axis containing them, so `Type → variant` and `Danger → destructive` are inferred from the mapping that already states them. There is no alias config to drift out of date. A map producing no strings — a boolean gate such as `Loading → loading` — is recognized as a non-variant prop rather than a broken axis.

**What it does not check yet:** token values and geometry. Every axis and option can line up perfectly while the colours, heights, and padding are all wrong — which is exactly what happened to Button, whose variants matched by name for months while `default` rendered a solid fill against a design that specifies a tint.

## Rules for the Figma file

These are design-side obligations. Most drift found so far originated here, not in code.

- **Every axis code must read has to be a VARIANT property on the component set.** Not an instance-level override, and not a mode of a variable collection. Modes are not component properties, so no template can read them.
- **A variant axis cannot be driven by a mode-switched variable.** This is the subtler half of the rule above and it costs a rebuild to discover. Pinning a collection mode on a variant (`setExplicitVariableModeForCollection`) affects only that variant node's own rendering; an *instance* resolves modes from its own ancestor chain, not from its main component. So a Size axis built that way looks right in the component set and renders every instance at the default size. Each variant must bind size-specific primitives directly — `Rounded/rounded-*`, `Typeset/size-*`, `Spacing/space-*` — so it is self-contained. Reserve collection modes for things that genuinely vary by context, such as theme.
- **One concept, one component set.** A link is its own set, not a Button variant. If it cannot be expressed as an option on an existing axis, it is a different component.
- **Publish both the set and its Code Connect mapping.**
- **Do not repoint or duplicate a file without updating `tokens.config.json` and every `url=` header.** A previous change left both templates aimed at a file that had been replaced; every `getEnum` would have missed.
- **Name variant options after the tokens behind them.** The Button size rungs were once guessed from a `rounded` binding rather than read from the Sizing collection, which shifted every rung by one: "the sm button" meant 32px to design and 24px to code. Read the collection.

### Editing a component set through the Plugin API

`clone()` silently drops `componentPropertyReferences`. A cloned variant's children come back with `refs: {}`, so a clone-based build produces variants with nothing wired to the component's own properties — and the failure is invisible until someone tries to set a label. Capture the references before cloning and reapply them by child index.

Deleting a variant that instances still use leaves an orphaned component behind (`Button/Loading/Default`) and a stale entry in the page traversal index, on which even `.parent` throws. Prefer addressing known node IDs over `findAllWithCriteria` after structural edits.

## Theme coverage

`src/themes/default.css` defines the `:root` baseline; `.theme-acetrader` layers over it. The `Custom/*` extension tokens exist only in the acetrader theme, so a component binding one renders with an undefined custom property — no background at all — under the baseline theme. When a component adopts a `Custom/*` token, add a derived baseline value to `default.css`, in both `:root` and `.dark` so it re-resolves against whichever base slots are in scope.

Be aware that the Storybook suite renders the **`default`** theme. It therefore exercises those baseline values, not the designed ones, and a passing run says nothing about how a component looks in AceTrader. Review that in Storybook with the toolbar switched over.

## Known gaps

Recorded so they are not mistaken for coverage:

- No token-value or geometry checking, as above.
- No story-coverage assertion: nothing requires a story per variant.
- Design-system stories are smoke-only. During the Button work the entire 14-file suite passed with `{children}` deleted from the component. `apps/ui/src/stories` does use `play` functions, so the convention exists in the repository but not in this package; whether to adopt it here belongs to [`define-ui-component-interaction-test-scope`](../../openspec/changes/define-ui-component-interaction-test-scope/proposal.md).
- The CI job skips with a warning annotation when `FIGMA_TOKEN` is unavailable, as on forks. A skipped run is not a passing run.
