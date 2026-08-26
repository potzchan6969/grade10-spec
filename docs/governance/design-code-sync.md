# Keeping Figma and code in sync

This guide covers the four artifacts that together define one design-system primitive, who owns which decision, and what is mechanically enforced. It applies to `packages/design-system`. Read it with [`ui-component-contracts.md`](ui-component-contracts.md), which covers the product components built on top of these primitives, and with [`packages/design-system/DESIGN.md`](../../packages/design-system/DESIGN.md) for the token pipeline.

For the route a component takes from the Figma file to a shipped primitive — the ordered steps, who performs each one, and what each Figma construct becomes in code — read [`figma-component-to-code.md`](figma-component-to-code.md) first. This document is the rule book behind it.

## The four artifacts

One component is one Figma component set and one basename, in four colocated files:

```
src/components/forms/button.tsx           implementation
src/components/forms/button.figma.ts      Code Connect template
src/components/forms/button.stories.tsx   rendered evidence
                                          + the Figma component set
```

The basename match is not cosmetic. `scripts/design-sync/check-components.mjs` resolves a Figma component to its code by normalizing the set's name and looking for `src/components/**/<name>.tsx`; a mismatch is reported as "no code component".

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

The template maps names, so a prop rename is a template change even when
nothing visual moved. Reshaping a component's words into a single `copy`
object renames every one of them at once, and a template still emitting
`localeLabel={localeLabel}` hands a developer a snippet that no longer
compiles. Nothing catches this for you — see "Known gaps".

## Creating a component

1. **Publish the Figma component set first.** Code Connect only resolves published components, and `list_file_components_for_code_connect` only returns published ones.
2. **Pull tokens** if the design introduced any (`pnpm tokens:sync`), and confirm the values you need exist in `src/themes/grade10.css`. Adding a component that binds a token the baseline `default` theme lacks will render it unstyled outside `.theme-grade10` — see "Theme coverage" below.
3. **Write `<name>.tsx`** with one cva option per Figma variant option, and nothing more.
4. **Write `<name>.figma.ts`** with a `getEnum` covering *every* option of every VARIANT property. An unmapped option resolves to `undefined` and emits broken code.
5. **Write `<name>.stories.tsx`** with a story per variant, plus disabled, loading, and any other state the contract has.
6. **Run `pnpm run check:design-system`** and get to zero errors and zero *unexplained* warnings. A warning you intend to keep belongs in an OpenSpec change with a reason, not in the run log.
7. **Publish Code Connect** with `pnpm run code-connect:publish:design-system` (a block's templates publish with `code-connect:publish:ui` instead). A correct template that was never published leaves Dev Mode showing no connected code at all — verify with `get_code_connect_map`, which returns `{}` when nothing is published.

Changing an existing component follows the same list from step 3, and step 4
is not optional when only the props moved: re-read the template against the
component's current props before publishing.

To hand steps 3–7 to an AI agent, paste [`prompts/implement-primitive-from-figma.md`](prompts/implement-primitive-from-figma.md). It carries the rules above, gates on an axis table before any code is written, and stops short of step 7 rather than writing to the shared Figma file unattended.

## Publishing Code Connect

**Two packages, two publishes.** Each owns its own templates, and neither command touches the other's:

```bash
FIGMA_ACCESS_TOKEN=figd_… pnpm run code-connect:publish:design-system
FIGMA_ACCESS_TOKEN=figd_… pnpm run code-connect:publish:ui
```

There is deliberately no `pnpm run code-connect:publish` that runs both. Each command writes to a shared Figma file and cannot be undone, so which templates you are publishing is a thing to state rather than a thing to inherit from a script name.

Both scripts are `figma connect publish --exit-on-unreadable-files`. Each publishes every template its own `figma.config.json` matches — `src/**/*.figma.ts`, under the `React` label — not just the one you changed, so a template broken by an unrelated Figma edit surfaces here. `--exit-on-unreadable-files` makes an unparseable template a failure rather than a silent omission.

The `include` glob is package-relative, which is why the second command exists at all: for as long as only the first one did, the `packages/ui` block templates were matched by nothing and published by nothing. They were not being parsed either, so an unreadable one raised no failure anywhere. Publishing a block change means running both.

Append `--dry-run` to list what would be published and against which node, without writing anything — `pnpm run code-connect:publish:ui --dry-run`, with **no `--` before it**. These scripts forward through a second `pnpm`, and a literal `--` reaches the Figma CLI as an argument, which stops it parsing the rest: the flag is dropped and `--token` with it, so the run fails on `Couldn't find a Figma access token` while the token is sitting right there in the command. Do that first; it parses every template and then resolves each `url=` header against the API, so it catches a stale node ID before it reaches the file. It still needs a valid token for that second half — a dry run is not a token-free rehearsal.

**The token is not the one the checker uses.** `check:design-system` reads `FIGMA_TOKEN` and needs only `files:read`. Publishing reads `FIGMA_ACCESS_TOKEN` (or `--token`) and needs **File content: read** plus **Code Connect: write**. A `files:read` token will parse fine and fail at the write.

Publishing is a write to a shared Figma file and has no unattended path in CI by design — it is a deliberate step at the end of a change, not something a merge triggers.

## What the checker enforces

`pnpm run check:design-system` runs `scripts/design-sync/check-components.mjs`. It lives at the repository root rather than inside `packages/design-system`, because it reads both packages: a script that scans a sibling package from inside one of them has the dependency pointing the wrong way. The token data it resolves against is still the design system's, and it reads it from there.

**Source.** `FIGMA_TOKEN` is the default and needs only the `files:read` scope. Note the contrast with the token pull: `scripts/figma/pull.mjs` has no REST path because `/v1/files/:key/variables/local` requires `file_variables:read`, which Figma gates to Enterprise. That gate is specific to *variables*. Component property definitions live in the file document, so this check runs unattended even though the token pull cannot. `FIGMA_DUMP=<file.json>` remains as a manual fallback.

`tokens.config.json → figmaFile` names the target. Branch URLs (`/design/:key/branch/:branchKey/...`) resolve to the **branch** key, because a branch is a distinct file to the API.

**Errors — exit 1, Dev Mode would emit wrong code:**

- A template's `node-id` is missing or no longer resolves.
- A `getEnum` names a VARIANT property the component set does not have.
- A `getEnum` omits an option, which would resolve to `undefined`. Dev Mode renders that as an empty attribute — `<Button size="">` — which reads as a blank value rather than a broken template, so it is easy to look straight past.
- A `getEnum` emits a value the cva does not define.

**Warnings — the two sides disagree, which may be deliberate:**

- A cva option no Figma option maps to (code-only surface).
- A cva axis reachable from no Figma variant property.
- A Figma axis no template maps.
- A Figma component with no code component.
- A set whose description does not appear in its component's JSDoc.
- A template emitting a prop name the component file does not contain.
- A template whose `node-id` resolves to a node that is not a component.

**Two trees, not one, and three things beyond the axes.** The checker walks `packages/design-system/src/components` **and** `packages/ui/src/blocks`. Before it did, nothing read a block template at all — not its node ID, not its axes, and not `code-connect:publish`, whose glob never matched them. A block carries no `cva`, so the axis and value comparisons find nothing to diff and skip.

*Descriptions* are the only thing a designer writes that no rail carries — not the token pull, not Code Connect — so the JSDoc opening the component is their sole projection, and a description edited in Figma is otherwise invisible. The comparison is by **first sentence, normalized** to letters and digits, because prose is rewrapped and code notes follow it. A description field holding library search keywords (`Tag, badge, label`) or a bare upstream attribution is reported to the designer as a missing description rather than demanded of the code, and a component file that only re-exports its component is followed one hop to the module that holds the documentation.

*Prop names* close the gap that let six templates emit props that no longer existed after the `shape-ui-block-copy` reshape while the run stayed clean. The template's `// source=` header names the component file, and each name its example emits must appear there — presence, not type resolution, with inherited HTML and ARIA attributes skipped from a fixed list because `link.figma.ts` emits `href` and `link.tsx` never writes the word.

*A node that is not a component* is distinguished from a node that is gone. Both used to read as "deleted or replaced", which sends whoever reads it looking for a node sitting right there; Code Connect resolves only published components, so a template aimed at a frame maps nothing however well-formed it is.

**Axes are matched through the template, never by name.** Figma calls the axis `Type`; cva calls it `variant`. Comparing those by name produced two mutually contradicting warnings on every component, and a real `Danger`/`destructive` mismatch once hid inside that noise. Instead the checker reads the values a `getEnum` produces and finds the cva axis containing them, so `Type → variant` and `Danger → destructive` are inferred from the mapping that already states them. There is no alias config to drift out of date. A map producing no strings — a boolean gate such as `Loading → loading` — is recognized as a non-variant prop rather than a broken axis.

A separate, token-free check runs in the test suite. `vitest --project contracts` reads each `cva` config out of the component source and fails when an option no story renders — the option list comes from the cva itself rather than a restated list, because cva keeps its config in a closure and exposes nothing at runtime. It accepts both authoring styles in this package, `variant: "line"` in a story's `args` and `variant="line"` inside a `render`, and it treats a `defaultVariants` option as covered by any story that omits the prop. An `argTypes` `options` entry does not count; only a story does.

**Values, not just names.** Every axis and option can line up perfectly while the colours, heights, and padding are all wrong — which is exactly what happened to Button, whose variants matched by name for months while `default` rendered a 10% tint against a design that specifies a solid fill. So each variant's own class string is resolved and compared against the variant Figma draws: `bg-*` through `tokens.json` to an 8-digit hex, and `h-*`, `px-*`, `gap-*`, and `rounded-*` to pixels. A mismatch is a warning, not an error — the component renders, it just does not render what was drawn.

**Base states only.** The comparison reaches each axis's base option and nothing else, so every hover, disabled, and loading value is unchecked, as are label colour, icon size, and border. Verify those by hand with `get_variable_defs` on the state's own node, and compare the *rule* rather than the colour: a disabled state may be a fill swap or the variant's own colours at `Opacity/opacity-50`, and those are different code. An opacity-based state is doubly invisible here, because the `bg-*` token this check compares is unchanged by it.

This needs no variables endpoint. REST resolves every binding before it serializes, so `/v1/files/:key` reports the colour and geometry a viewer actually sees; `boundVariables` carries opaque IDs whose names would need the Enterprise-gated scope, and nothing here reads them. The plugin dump has no variant nodes at all, so it checks names only and says so rather than reporting a clean run.

A variant is only comparable when every axis other than the one under test sits at its base option, or a `Disabled` variant would be diffed against the default fill. Base is derived: for a mapped axis it is the option producing the cva `defaultVariant`, and for a boolean gate it is the option every map reports false for. That leaves `Default` and `Hover` tied, since hover is a pseudo-state with no prop behind it, so the option Figma names `Default` wins and an unresolvable tie skips the component rather than silently diffing a hover tint.

## For designers: before you create or change a component

Written to be followed in order, in Figma, without reading the rest of this document. Each rule names the symptom it prevents, and every symptom listed has actually happened here. For where these rules sit in the wider handover — and what happens to your component after you publish it — see [`figma-component-to-code.md`](figma-component-to-code.md).

### 1. Decide what you are adding: an axis value, or a new component

Answer this before drawing anything — the other rules follow from it.

**Ask: does the new thing combine with the existing axes?**

- A loading **Danger** button is a sensible thing to want, so `Loading` is a value of **State**, not of `Type`. It was originally a `Type`, which made a loading Danger button impossible to draw.
- A link cannot be "outline" or "loading", and it has its own tonal axis, so it is a **separate component set**. The file gets this right.

**The tell:** if your new value can only exist alongside one value of another axis, you have put it on the wrong axis. `Loading` had a single `State` where every other `Type` had three — a ragged row in what should be a complete cross-product. If you cannot fill in the whole grid, the axis is wrong.

### 2. Anything a developer can choose must be a VARIANT property

Not an instance-level override. Not a mode of a variable collection.

*Symptom if ignored:* the property is invisible to code. Dev Mode cannot tell a developer which size an instance is, and the generated snippet has to guess.

Reserve variable-collection **modes** for context that varies *outside* the component — theme, density — never for something a consumer picks per instance.

*Symptom if ignored:* the component set looks perfect and **every instance renders at the default size**. Instances resolve modes from where they sit on the canvas, not from the component they came from. This is not a bug you can see in the component set.

### 3. A variant must be self-contained

Bind each variant's geometry to size-specific primitives — `rounded-md`, `Typeset/size-sm`, `Spacing/space-2` — so it renders correctly wherever it is placed.

### 4. Name options after the tokens behind them

Open the variable collection and use its names. Do not infer them from a related token.

*Symptom if ignored:* the Button rungs were once named from a `rounded` binding rather than the Sizing collection, shifting every rung by one. "The sm button" meant 32px to design and 24px to code, and nothing flagged it.

### 5. Build new variants by duplicating an existing one

Never draw a variant from scratch, and after duplicating, confirm in the right-hand panel that:

- the label still shows the **Label** property, not plain text
- both icon slots are still swappable
- any other component property is still wired

*Symptom if ignored:* this is the most common defect found. The original `Loading` variant had **none** of the set's five properties wired, so a developer's generated snippet printed a stale label and the loading state ignored whatever text a consumer typed.

### 6. Publish the set, and publish Code Connect

These are two separate publishes. You publish the **set** to the team library from Figma; an engineer publishes the **Code Connect mapping** by running [`code-connect:publish`](#publishing-code-connect) from a checkout. Yours has to happen first — Code Connect only resolves published components. Neither happens automatically, so say when your set is published rather than assuming the mapping followed it.

*Symptom if ignored:* Dev Mode shows **no** connected code at all, however correct the mapping is. That is the current state of this file — `get_code_connect_map` returns `{}`.

### 7. If you are modifying rather than creating

Deleting or renaming a variant that instances already use leaves orphaned components behind and silently repoints live instances. Prefer **adding** an axis over renaming values, and check the instance count before deleting anything.

### Checking the built component yourself

Two routes. The automated diff needs only a browser; measuring in Storybook needs the repository checked out, so it is the one place here where you may need an engineer to start it for you.

**Measure it in Storybook.** Run `pnpm run storybook:design-system` and open the address it prints. Open a component, then:

1. Switch the **Theme** toolbar control to **Grade10**. It loads in `Default`, which is the baseline theme, not the designed one — comparing that against your Figma file will show differences that are not real. This is the single most common way to misread the page.
2. Press <kbd>M</kbd> for **Measure**. Hovering any element overlays its real box model — width, height, padding and margin in rendered pixels. This is the direct answer to "is the padding what I drew".
3. Press <kbd>O</kbd> for **Outline** to see every element boundary at once, which is faster for spotting a wrong gap or an unexpected wrapper.
4. Use the **Controls** panel to switch variant, size and state, so you can measure the same rungs your component set defines.

What you are measuring is the primitive as built, in a browser, at the real values — so a rung that is 24px in code and 32px in your Sizing collection is visible in about ten seconds.

**Read the automated diff.** The nightly design-sync run posts a summary table on its own run page — Actions → **Design sync** → the newest run. Each row is one disagreement, in the form `Button · size=sm · Height (h-8) · 32px in code · 24px in Figma`, covering background, height, horizontal padding, gap and corner radius. The same page states what the check does not cover, which is worth reading once: vertical padding, anything inside the component, and the hover, disabled and loading states are all unchecked, so a clean table is not proof the component matches.

### What happens next

`check:design-system` diffs your axes and options against the code on every push, and again nightly at 01:00 UTC — a Figma edit raises no event in this repository, so the scheduled run is what catches a change you make on a day nobody pushes code. A new option with no code counterpart is a warning; a renamed or removed option is an error. You do not need to run it — but it is why an unannounced rename surfaces as a failed build rather than a wrong button in production.

Anyone with repository access can also run it on demand from the Actions tab (**Design sync → Run workflow**) rather than waiting for the next nightly run.

## Rules for the Figma file

The same obligations stated for engineers, as a reference. Most drift found so far originated here, not in code.

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

`src/themes/default.css` defines the `:root` baseline; `.theme-grade10` layers over it. The `Custom/*` extension tokens exist only in the grade10 theme, so a component binding one renders with an undefined custom property — no background at all — under the baseline theme. When a component adopts a `Custom/*` token, add a derived baseline value to `default.css`, in both `:root` and `.dark` so it re-resolves against whichever base slots are in scope.

Be aware that the Storybook suite renders the **`default`** theme. It therefore exercises those baseline values, not the designed ones, and a passing run says nothing about how a component looks in Grade10. Review that in Storybook with the toolbar switched over.

## Monitoring Figma annotations

Annotations are design evidence, not automatically accepted requirements. The
annotation rail records a reviewed text baseline at
`scripts/design-sync/annotation-baseline.json` and compares it with the
annotations below registered Code Connect and audit roots. It reads the same
Figma file as the other design-sync checks and never writes to Figma or the
baseline during a scan.

Run the two read-only forms locally:

```bash
FIGMA_TOKEN=figd_… pnpm run figma:annotations -- --inventory
FIGMA_TOKEN=figd_… pnpm run figma:annotations -- --json
```

Inventory scans the whole registered surface and prints candidate node IDs and
text for the initial review. The daily scan uses only the roots recorded in
the baseline plus the current Code Connect and audit registrations, so
exploratory design areas do not become engineering findings accidentally.

The manifest has `schemaVersion: 1`, a `roots` list, and `entries` keyed by
`<file-key>:<node-id>` using a colon in the node ID. Each entry stores the
accepted annotation text, its source root, and optional exact `associations`
for a capability, change, and task group. A reviewed entry with no OpenSpec
association may carry a `noImpactReason`; similar prose is never an
association.

The scanner exits `0` for verified no change, `1` for annotation drift, and
`2` when any registered evidence is blocked or malformed. A missing Figma file,
credential, permission, request, response, or tracked node is blocked. A
missing baseline node is orphaned evidence, not an annotation removal. Newly
seen text remains in the report as `added` and `untracked` when no exact
component or OpenSpec association exists.

### Review and accept a change

1. Open the finding's Figma node link and inspect the previous and current
   text.
2. Trace it through the exact registered component, baseline association, or
   OpenSpec artifact. Do not use editor identity, Git blame, or similar words
   as ownership evidence.
3. Decide whether the text is a requirement, UI state, technical note, visual
   note, or no-impact clarification. If it changes product behaviour, update
   the OpenSpec requirement in the planning store first.
4. Patch the matching baseline entry in a reviewed change, replacing its text
   and recording the exact capability/change/task-group association or an
   explicit `noImpactReason`. The scanner has no update flag by design.
5. Run the JSON scan again and review the Git diff. A clean result is only
   meaningful when every registered surface was read successfully.

When a node is replaced, keep the old entry until the orphaned finding is
reviewed; add the new node separately and reconnect it in the same reviewed
patch. To roll back the rail, disable the annotation workflow step and leave
the versioned manifest in place as evidence. No external record or scheduler
is created by this process.

## Known gaps

Recorded so they are not mistaken for coverage:

- Value checking covers a variant's own background and box geometry, not its children. A wrong label colour, icon size, or border is still invisible to it, and only the base state of each axis is compared — hover, disabled, and loading values are unchecked.
- Design-system stories are smoke-only. During the Button work the entire 14-file suite passed with `{children}` deleted from the component. `packages/ui` stories do use `play` functions to assert that a control reports its change and does not move its own display, so the convention exists in the repository but not in this package; whether to adopt it here is still open.
- The CI job skips with a warning annotation when `FIGMA_TOKEN` is unavailable, as on forks. A skipped run is not a passing run.
- Descriptions are compared by first sentence, not in full. A designer who
  rewrites the body of a description while leaving its opening intact changes
  nothing the check can see, and prose is normalized to letters and digits
  before comparison, so wording that differs only in punctuation passes.
- The prop check asks whether the component file *contains* each name a
  template emits, not whether its type actually accepts it. A prop that
  arrives through `ComponentProps<"a">` is skipped from a fixed list of HTML
  and ARIA attributes rather than resolved, so a component that genuinely
  dropped `href` still passes.
