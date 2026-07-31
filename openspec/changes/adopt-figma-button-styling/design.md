# Design

## Where the divergence came from

`button.tsx` has one commit against it: the one that created the package. `button.figma.ts` has two, the second being the retarget onto the live Figma file. Nothing has ever reconciled the component's own styling with the design, so the resync moved the tokens underneath a component that was still written against the shadcn defaults.

That is why the mismatch is systematic rather than incidental. The button was not drifting from Figma one property at a time; it was never aligned to begin with, and the resync made the gap legible by giving every Figma binding a named token in code.

## Reading the design

Variant colours were taken from `get_variable_defs` per variant node rather than from the component-set aggregate, because the aggregate cannot attribute a binding to a state. The per-node reads are what established that `Outline` and `Ghost` hover on `Base/accent` while `Secondary` hovers on `Custom/muted-hover` — three states that all resolve to a translucent white and would have been indistinguishable from a screenshot.

`--accent` and `--muted` are both `slate-50-opacity-10` in `acetrader.css`, so `bg-accent` and `bg-muted` render identically today. They are kept distinct anyway: Figma binds distinct semantic variables, and collapsing them in code would silently fuse two slots that a future theme may separate.

Two mappings worth recording:

- **Loading is disabled.** The Loading variant binds `Custom/disabled` and `Custom/disabled-foreground` — byte-identical to every `State=Disabled` variant. The existing decision in `button.figma.ts` to map it to `disabled` was made on the reasoning that it was the closest honest approximation; the bindings show it is exact. Only the SpinnerGap icon is lost.
- **Disabled is not uniform.** `Default`, `Secondary` and `Danger` take the `Custom/disabled` fill. `Outline` and `Ghost` take no fill and only drop their text colour, with `Outline` keeping `Base/border`. This is why `disabled:bg-disabled` sits on three variants rather than in the shared base string.

## Why `disabled:` overrides resolve correctly

`disabled:bg-disabled` and `bg-primary-muted` are both emitted into the same Tailwind layer, and `cn` merges them without conflict because tailwind-merge treats them as different keys. Tailwind v4 orders variant utilities after their unprefixed counterparts, so the disabled fill wins on a disabled button and is inert otherwise. `disabled:pointer-events-none` in the base string keeps hover from firing underneath it.

## The `default.css` backfill

`default.css` defines the `:root` baseline that `.theme-acetrader` layers over, and it carries none of the `Custom/*` slots — they arrived from Figma into `acetrader.css` only. A component binding `bg-primary-muted` therefore renders with an undefined custom property, which is not a fallback to something sensible but no background at all.

The backfill derives each slot from a stock slot already in the file (`color-mix(in oklab, var(--primary) 10%, transparent)`, matching the form Tailwind itself emits for `bg-primary/10`) rather than inventing hex values for a palette this repository does not own.

It is restated verbatim in `.dark` rather than declared once in `:root`. A custom property's `var()` references resolve against the element the property is *declared* on. With the derived set in `:root` only, a `.dark` applied to a nested element would inherit `--primary-muted` already computed from the light `--primary`. Duplicating the block makes it re-resolve against whichever base slots are in scope, and is a no-op in the common case where `.dark` sits on the same element as `:root`.

`scripts/figma/seed-default.mjs` parses this file to seed Figma variables. Its `convert()` returns `null` for values it cannot parse and pushes them onto a `skipped` warning list rather than failing, so the `color-mix()` declarations are reported and passed over. That is the correct outcome: these are derived baseline values, and the seed exists to establish the stock shadcn palette in Figma, not this repository's extension set.

## Size

Figma models a single button: 48px tall, 16px horizontal padding, 8px gap, 8px radius, Inter 500 at 16/24. There is no size axis to map, which means Code Connect can only ever emit the cva default. Making `md` that size turns the mapping's silence about `size` from a compromise into the correct emission.

The knock-on is that `lg` at 36px now sits below `md`. Raising it to 56px keeps the ladder ordered and pairs `icon-lg` with it, but the value is an engineering choice with no design behind it, as is `icon` at 48px pairing with the new `md`. `xs`, `sm`, `icon-xs` and `icon-sm` are deliberately left alone: they are equally unspecified, but changing them would break the one in-repo consumer (`Dialog`'s `icon-sm` close button) for no gain. The uneven 28px → 48px step between `sm` and `md` is recorded as an open decision rather than smoothed over by inventing a full ladder.

## Reading the Loading label

The Loading variant hides the layer bound to `Label#318:0` and shows a static text layer named `Loading` instead. `getString("Label#318:0")` still returns whatever the property holds underneath, so the snippet printed a stale label for that variant. The fix reads the visible layer via `findText("Loading")` with the `type === "TEXT"` guard the API requires, falling back to the property for every other variant — which keeps the copy sourced from the design rather than hardcoded in the template.

## The leading and trailing icon slots

Figma exposes each icon as a pair of component properties — a `Show …` BOOLEAN gating an INSTANCE_SWAP. `button.tsx` has no matching props: icons arrive as children marked `data-icon="inline-start"` or `"inline-end"`. That is a modelling-style difference rather than a missing capability, and the children form is the package convention, not a Button shortcut. `badge.tsx` and `tabs.tsx` carry the same `has-data-[icon=…]` selectors and document them in their stories, and no primitive in the package exposes a `ReactNode` slot prop. Giving Button `leading` / `trailing` props would make it the only primitive of the three modelled that way, so the convention is kept and the question recorded for design instead.

The two models meet in the template, which emits each resolved snippet as a child in reading order around the label. What a template cannot do is annotate that snippet: `executeTemplate()` returns an opaque section list, so the emitted icon can never carry `data-icon`.

Which turns out not to matter, for a reason that comes from the design rather than from the tooling. Figma binds `padding-x: 16` on every variant, and `INSTANCE[Plus]` is present in all fifteen non-Loading `Type`/`State` combinations — the design shows a leading icon and uniform padding at the same time. There is no tighten-on-icon behaviour to reproduce, so `md` and `lg` drop the compensation entirely and the unreachable attribute stops being load-bearing. `xs` and `sm` keep it; they are code-only rungs, and Code Connect cannot emit them anyway because Figma has no size axis to select them with.

## What remains out of reach

`get_code_connect_map` on `86:3459` returns `{}`. `button.figma.ts` is correct against the live component but has never been published, so Figma Dev Mode shows no connected code for the Button regardless of anything in this change. The Phosphor icons are unpublished for the same reason, which is why no icon snippet is emitted today.
