# From a Figma component to code

How a component drawn in the Figma file becomes a primitive in `packages/design-system`, who performs each step, and what a designer can check without an engineer.

Read this first if you are a designer handing a component over. It is the route map; [`design-code-sync.md`](design-code-sync.md) is the rule book behind it, and [`packages/design-system/DESIGN.md`](../../packages/design-system/DESIGN.md) covers the token half of the pipeline. Nothing here restates a rule from those two — it says when each one applies and who applies it.

## The short answer

**A designer does not convert a component to code, and no tool converts it either.** Design defines the contract, an engineer implements it in three files, and a checker fails the build when the two drift apart.

What that means in practice is that "converting the component" is really three separate conversions, travelling on three rails, with different owners and different failure modes:

| What travels | From → to | How | Automatic? |
| --- | --- | --- | --- |
| **Values** — colours, radii, spacing | Figma variables → `tokens.json` → theme CSS | `pnpm tokens:sync` | No. Needs a human to run a plugin in Figma. |
| **Structure** — which variants, sizes, and states exist | Figma component set → a `cva` config in `<name>.tsx` | Written by hand, diffed by `check:design-system` | Written by hand; the diff runs nightly. |
| **Usage** — the snippet that appears in Dev Mode | `<name>.figma.ts` → Figma | `code-connect:publish` | No. Deliberately a manual step. |

Conflating them is the usual source of confusion. Publishing your component set does not move a value; running the token sync does not add a variant; and a perfect Code Connect template that was never published shows a developer nothing at all.

```
   Figma component set  ──(read by check:design-system)──▶  button.tsx        (the contract, hand-written)
            │                                                    │
            │                                              button.stories.tsx (proof each option renders)
            │                                                    │
            └───◀──(code-connect:publish)──  button.figma.ts  ◀───┘           (the name mapping)

   Figma variables  ──tokens:pull──▶  tokens.json  ──tokens:build──▶  theme.css + themes/*.css
```

## The route, step by step

Ordered. Steps 1–4 and 11 are the designer's; 5–10 are the implementation steps, taken by whoever holds the checkout — a designer working in the repository or an engineer.

| # | Who | Step | Done when |
| --- | --- | --- | --- |
| 1 | Designer | Decide whether the new thing is an **option on an existing axis** or a **new component set**. See ["Decide what you are adding"](design-code-sync.md#1-decide-what-you-are-adding-an-axis-value-or-a-new-component). | You can fill in the whole variant grid without a ragged row. |
| 2 | Designer | Build it as **VARIANT properties**, each variant self-contained, options named after the variable collection behind them. | Every axis a developer can choose appears in the right-hand panel as a variant property. |
| 3 | Designer | **Publish the set** to the team library. | Nothing else can start — Code Connect resolves only published components. |
| 4 | Designer | **Say that you published it.** A Figma edit raises no event in this repository. | An engineer knows to start, or someone runs **Actions → Design sync → Run workflow**. |
| 5 | Designer/Engineer | Pull tokens if the design introduced values — see [`figma-token-export.md`](figma-token-export.md) — then confirm they exist in `src/themes/grade10.css`. | `git diff tokens.json` shows exactly what design changed. |
| 6 | Designer/Engineer | Write `src/components/<group>/<name>.tsx` with **one cva option per Figma option, and nothing more**. | The basename matches the set name; the checker resolves a set to code by that name alone. |
| 7 | Designer/Engineer | Write `<name>.figma.ts` mapping every option of every variant property. | No option is left unmapped — an unmapped one resolves to `undefined` and emits broken code. |
| 8 | Designer/Engineer | Write `<name>.stories.tsx` — one story per option, plus disabled, loading, and every contract state. | `pnpm run test:stories` passes; it fails on any cva option no story renders. |
| 9 | Designer/Engineer | `pnpm run check:design-system` to zero errors and zero unexplained warnings. | Axes, options, colours, and box geometry all agree with the file. |
| 10 | Designer/Engineer | `pnpm --filter @grade10/design-system run code-connect:publish`. | `get_code_connect_map` stops returning `{}` for the node. |
| 11 | Designer | Verify: read the snippet in Dev Mode, and measure the built component in Storybook. | See ["Checking it yourself"](#checking-it-yourself-no-checkout-no-engineer) below. |

Steps 3 and 10 are two different publishes, in that order, neither of which happens automatically.

## What each Figma construct becomes

This is the actual translation. It is why step 2 above is worth care: a construct not in the left column has no way to reach code.

| In Figma | Becomes in code | Read through |
| --- | --- | --- |
| A component set | One `<name>.tsx` with one `cva` | Basename match |
| A VARIANT property (`size`) | A `cva` axis (`size`) | `instance.getEnum("size", …)` |
| A VARIANT option (`sm`) | A `cva` option key | The `getEnum` map's value |
| A two-option variant that gates behaviour (`isLoading`) | A boolean prop, not an axis | A `getEnum` producing no strings |
| A TEXT property (`label#318:0`) | `children` | `instance.getString`, key **verbatim including the `#id`** |
| An INSTANCE_SWAP + its BOOLEAN toggle | A `ReactNode` slot prop (`leading`, `trailing`) | `getBoolean` gating `getInstanceSwap` |
| A variable bound to a fill or radius | A Tailwind token utility (`bg-primary-muted`) | The token pipeline; the value check diffs it |
| A variable collection **mode** | A theme class (`.theme-grade10`) | `tokens.config.json → themes` |
| An instance-level override | **Nothing.** Invisible to code. | — |
| A mode used as a size axis | **Nothing** — and every instance silently renders at the default size | — |

The last two rows are the ones that cost a rebuild here. A property a developer can choose has to be a variant property; modes are for context that varies *outside* the component, like theme.

Axis *names* need not match. Figma calls Button's tonal axis `variant` and draws its base option as `primary`; the cva calls that option `default`, because it is the cva default. The checker matches axes through the template's mapping rather than by name, so `Danger → destructive` is a legitimate mapping and not drift. What it will not tolerate is an option present on one side and absent on the other.

## Worked example: Button

The Figma set carries `variant`, `state`, `size`, `isDisabled`, and `isLoading` as variant properties over a complete cross-product, plus a `label` text property and two swappable icon slots.

`button.tsx` — the contract. Five tonal options, three size rungs, and nothing invented:

```ts
variants: {
  variant: { default: …, outline: …, secondary: …, ghost: …, destructive: … },
  size:    { xs: "h-6 …", sm: "h-8 …", default: "h-12 …" },
},
defaultVariants: { variant: "default", size: "default" },
```

`button.figma.ts` — the mapping. Every option listed, including the ones that emit nothing:

```ts
const variant = instance.getEnum("variant", {
  primary: "default",       // Figma's base option, the cva's defaultVariant
  secondary: "secondary", outline: "outline", destructive: "destructive", ghost: "ghost",
});
instance.getEnum("state", { default: false, hover: false });  // pseudo-state: no prop behind it
const loading = instance.getEnum("isLoading", { false: false, true: true });  // boolean gate
const label = instance.getString("label#318:0");
```

The result a developer sees in Dev Mode, for three different instances of the same set:

```tsx
<Button>Continue</Button>                                       // primary, default size
<Button variant="secondary" size="sm" loading>Saving</Button>    // props omitted where they are the default
<Button variant="destructive" leading={<TrashIcon />}>Delete</Button>
```

Note what the template deliberately does *not* emit: `variant="default"` and `size="default"` are omitted because they are the cva defaults, and the trailing icon is dropped while loading because the component gives that slot to the spinner. A Code Connect template's job is to emit what someone would actually write, not to enumerate the instance.

## Checking it yourself: no checkout, no engineer

**Read the snippet in Dev Mode.** Select an instance, open the Code section of the inspect panel. With the mapping published you get the `<Button …>` line above; with it unpublished you get a generated guess, however correct the template in the repository is. If you see no connected code, step 10 has not been run — that is the state [`design-code-sync.md`](design-code-sync.md#6-publish-the-set-and-publish-code-connect) records for this file.

**Measure the built component in Storybook.** Every push to `main` publishes the design-system Storybook to this repository's GitHub Pages site (Actions → **Storybook**; the `deploy` step links the URL). Switch the **Theme** toolbar control to **Grade10** first — it loads in `Default`, which is stock shadcn and not the designed theme, and comparing that against your file shows differences that are not real. Then press <kbd>M</kbd> for Measure to read the real box model, and <kbd>O</kbd> for Outline.

**Read the automated diff.** Actions → **Design sync** → the newest run posts a table of disagreements, one row per mismatch: `Button · size=sm · Height (h-8) · 32px in code · 24px in Figma`. It runs nightly at 01:00 UTC and on demand via **Run workflow**. It covers background, height, horizontal padding, gap, and corner radius on each axis's base state only — vertical padding, anything inside the component, and the hover, disabled, and loading states are unchecked, so a clean table is not proof of a match.

## Four failures that look like success

Each has happened here, and each passes every check that does not specifically look for it.

- **A size axis built from variable modes.** The component set looks perfect; every instance renders at the default size, because an instance resolves modes from where it sits on the canvas, not from its main component.
- **A variant duplicated by `clone()`.** The copy loses `componentPropertyReferences`, so nothing is wired to the set's own properties — the generated snippet prints a stale label and ignores whatever text a consumer types.
- **Options named from a related token.** Button's size rungs were once read off a `rounded` binding rather than the Sizing collection, shifting every rung by one: "the sm button" meant 32px to design and 24px to code, and nothing flagged it.
- **A published set with an unpublished mapping.** Dev Mode shows no connected code at all, so a developer writes the instance by hand and the contract quietly diverges from the first use.

## Related reading

- [`design-code-sync.md`](design-code-sync.md) — the ownership table, everything `check:design-system` enforces, and the rules for the Figma file.
- [`packages/design-system/DESIGN.md`](../../packages/design-system/DESIGN.md) — the token pipeline: `tokens:pull`, `tokens:build`, `tokens:push`, and why every leg needs a human in Figma.
- [`ui-component-contracts.md`](ui-component-contracts.md) — product components, which are specified here and implemented in the consuming application.
- `.cursor/skills/design-system-components/SKILL.md` — the working checklist an agent or engineer follows for steps 5–10.
