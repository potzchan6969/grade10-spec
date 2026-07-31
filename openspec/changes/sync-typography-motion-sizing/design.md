# Design

## The two `pull.mjs` defects

`key()` normalizes a Figma variable name to a token key. It strips the first path segment, then cleans the remainder:

```js
.replace(/^-|-$/g, "")
```

The `/g` flag does not help here — `^-` is anchored, so it matches only at index 0 and strips a single dash. `Motion` names are ungrouped and already start with `--`, so `--duration-stagger` normalizes to `-duration-stagger`, which then emits as `---duration-stagger` in CSS. Either strip repeatedly (`/^-+|-+$/g`) or normalize the leading `--` before the segment split. `Foundation` and `Semantic` never exposed this because every one of their names is grouped.

`emit()` handles two resolved types and falls through for the rest:

```js
if (resolvedType === "COLOR") return toHex(value);
if (resolvedType === "FLOAT") return `${value}px`;
return String(value);
```

`Motion` uses `TIMING` (seconds as a float) and `EASING` (an object). `TIMING` would fall to `String(value)` and emit `0.25` with no unit; `EASING` would emit `[object Object]`. Both need real branches — `TIMING` as `0.25s`, `EASING` as `cubic-bezier(x1, y1, x2, y2)` read from `easingFunctionCubicBezier`.

The blanket `FLOAT` → `px` rule also needs revisiting per collection. It is right for `Spacing` and `Container`, wrong for `Typography`'s `weight-*` (400, 500, 600, 700 are unitless) and for `Motion`'s `scale-*` (0.96–0.99). It is already arguably wrong for `Opacity`, which currently emits `75px`; that quirk predates this change and is left alone unless the config gains a per-collection unit rule.

## Configuration shape

`tokens.config.json` currently hardcodes two roles, `primitiveCollection` and `semanticCollection`, each a bare collection name. Three more collections with different projection needs do not fit that shape. The change should move to a list where each entry declares its collection name, its projection kind, and its output — leaving the existing two expressible in the new form so the migration is mechanical and `tokens.json` keeps its current top-level layout.

Whatever shape is chosen, an unknown collection present in the dump should be reported rather than ignored. Silence is what made these three invisible.

## `Sizing` is the hard one

`Sizing` holds six variables across three modes:

| Variable | `default` | `sm` | `xs` |
| --- | --- | --- | --- |
| `height` | 48 | 32 | 24 |
| `gap` | `{space-2}` | `{space-2}` | `{space-1}` |
| `rounded` | `{rounded-lg}` | `{rounded-md}` | `{rounded-sm}` |
| `padding-x` | 16 | 8 | 8 |
| `size` | `{size-base}` | `{size-sm}` | `{size-xs}` |
| `leading` | `{leading-base}` | `{leading-sm}` | `{leading-xs}` |

The model is good: one named size selects a coherent bundle of height, padding, gap, radius, and type, replacing the flat `h-sm`/`h-md`/`h-lg` primitives it absorbed.

It does not fit the current projection. `tokens.config.json` treats a Figma mode as a *theme* — one CSS selector per mode, applied to `<html>` — because `Semantic`'s modes really are themes. `Sizing`'s modes are variants that must coexist on a single page: a small button next to a default one. That is a scoped selector (`[data-size="sm"]`), a set of utility classes, or a code-side lookup, not a root class.

There is also an ordering constraint. `size` and `leading` alias into `Typography`, and `gap` and `rounded` alias into `Foundation`. `pull.mjs` dies on a dangling alias, so `Sizing` cannot land before `Typography` does.

Adopting `height` is a re-scale, not a rename: 48/32/24 against the old `h-sm`/`h-md`/`h-lg` of 28/32/36. No component reads the old tokens today — the previous change's sweep confirmed that — so nothing breaks on landing, but anything wired up later inherits the new proportions.

## Validation

The pipeline's round-trip property is the useful check: pushing `tokens.json` into a file, dumping it, and pulling it back should reproduce `tokens.json` byte for byte. Extending `emit()` with new types puts that at risk, so it should be exercised for `TIMING` and `EASING` specifically rather than assumed.

Note that `pnpm test:stories:design-system` does not cover the AceTrader theme at all — `.storybook/preview.tsx` sets `initialGlobals` to `colorTheme: "default"`, `mode: "light"`, so every story and every axe check runs against stock shadcn. Any claim that these tokens are verified by the story suite would be false until that gap is closed.
