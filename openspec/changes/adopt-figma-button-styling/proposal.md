# Adopt Figma button styling

PRD: Not applicable. This is the component-side half of a designer decision already recorded in Figma. It is the follow-up [`resync-design-tokens-from-figma`](../resync-design-tokens-from-figma/proposal.md) deferred as a non-goal ("No component source is restyled to consume the new `Custom/*` tokens in this change") and listed as a remaining task ("capture component follow-up as a separate change").

## Why

The token resync landed the `Custom/*` extension set into `src/themes/acetrader.css`, but no component consumes any of it — a repository sweep for `primary-muted`, `muted-hover`, `destructive-muted`, `disabled`, `control`, `field`, `focus-ring` and the rest of the set returns zero hits in component source. `button.tsx` has not been touched since the package was created, so it still renders the pre-resync shadcn treatment while the Figma Button set (`jlrBVwtKcun1NnJgohmFcn`, node `86:3459`) binds the new tokens throughout.

The result is that `button.figma.ts` maps correctly onto a component that does not look like the design it maps to. Code Connect would emit `<Button variant="secondary">` for a Figma variant whose fill, text colour, height, padding and type scale all differ from what that prop produces.

Read from the live Figma variable bindings, per variant:

| Figma `Type` / `State` | Fill | Text | Border |
| --- | --- | --- | --- |
| Default | `Custom/primary-muted` `#3cd48d1a` | `Custom/primary-muted-foreground` `#3cd48d` | — |
| Default / Hover | `Custom/primary-muted-hover` `#3cd48d33` | `Custom/primary-muted-foreground` | — |
| Secondary | `Base/muted` `#f9f9f91a` | `Base/muted-foreground` `#e4e5e5` | — |
| Secondary / Hover | `Custom/muted-hover` `#f9f9f933` | `Base/muted-foreground` | — |
| Outline | — | `Base/accent-foreground` | `Base/border` |
| Outline / Hover | `Base/accent` `#f9f9f91a` | `Base/accent-foreground` | `Base/border` |
| Danger | `Custom/destructive-muted` `#ed41651a` | `Custom/destructive-muted-foreground` `#f76f82` | — |
| Danger / Hover | `Custom/destructive-muted-hover` `#ed416533` | `Custom/destructive-muted-foreground` | — |
| Ghost | — | `Base/foreground` | — |
| Ghost / Hover | `Base/accent` | `Base/accent-foreground` | — |
| any / Disabled | `Custom/disabled` `#3c4240` (borderless variants: none) | `Custom/disabled-foreground` `#f9f9f94d` | preserved |
| Loading | `Custom/disabled` | `Custom/disabled-foreground` | — |

`Base/primary` and `Base/primary-foreground` are bound nowhere in the set. The Figma Button never uses a solid primary fill.

Every variant is `height 48, padding-x 16, gap 8, rounded 8`, with `text-medium` = Inter 500 at 16/24.

## Scope

- Rebind every `buttonVariants` variant to the token the Figma set binds, replacing the ad-hoc opacity arithmetic. `bg-destructive/10` in particular is not a spelling difference: it computes red-400 at 10%, where `--destructive-muted` is red-500 at 10%.
- Replace the blanket `disabled:opacity-50` with the `disabled` / `disabled-foreground` token pair, applied per variant because Figma fills the solid variants and drops only the text colour on the borderless ones.
- Point `aria-invalid` at the `--destructive-border` and `--destructive-ring` tokens the resync added for exactly that purpose.
- Resize `md` to the single size Figma models (48px tall, 16px padding, 8px gap, 16/24 text) and raise `lg` above it so the ladder stays ordered.
- Backfill the eleven `Custom/*` slots the button now binds into `src/themes/default.css`, derived from the stock slots, so the baseline theme does not render fill-less buttons.
- Fix `button.figma.ts` to print the Loading variant's real label.

## Consumer impact

This is a visible restyle of the most widely used primitive in the package, shipped from source with no export-signature change. Consuming apps need no code change and will see:

- Primary buttons change from a solid `meme-400` fill with dark text to a 10% green tint with green text.
- Default button height changes from 32px to 48px, padding from 10px to 16px, and label type from 14px to 16px. Any layout that assumed a 32px control height needs revisiting.
- Disabled buttons stop being a 50%-opacity version of themselves and take a dedicated grey fill.

### Removed surface

Everything with no counterpart in the Figma set is deleted rather than kept as an unspecified code-only rung. This is a **breaking** change to the exported contract:

| Removed | Why |
| --- | --- |
| `variant="link"` | Figma models a link as `Link` (`96:341`), a separate published component set, not a Button variant. |
| `size` rung `xs` | Not among the three sizes the design defines. |
| `size` rungs `icon`, `icon-xs`, `icon-sm`, `icon-lg` | Figma models no icon-only button. |

The only in-repo consumer of any removed value was `Dialog`'s close button, which used `size="icon-sm"`; it now sets its square sizing through `className`. A consuming app using `variant="link"` or any removed rung will fail to compile — deliberately, since the alternative is silently rendering something the design does not define.

Note the package no longer has an icon-button size at all. That is a real capability gap, recorded below.

### Sizing

The design does define three sizes, in "Buttons Size Reference" (`96:546`):

| Rung | height | padding-x | gap | radius | text |
| --- | --- | --- | --- | --- | --- |
| `sm` | 24 | 8 | 4 | 4 | 12/16 |
| `md` | 32 | 8 | 8 | 6 | 14/20 |
| `lg` | 48 | 16 | 8 | 8 | 16/24 |

They are named after the `rounded` binding, which resolves to the `rounded-lg` / `rounded-md` / `rounded-sm` primitives. Each text pair maps exactly onto a Tailwind default. `md` at 32px is what the component's `md` already was before this change.

This corrects an earlier reading in this change, which took the component set's single drawn size as the default and moved `md` to 48px. 48px is `lg`; `md` stays 32px and stays the default.

`packages/ui-components` does not import this package, so its `dist/` does not need regenerating.

- Add a `loading` prop so Figma's `Type=Loading` has a real counterpart, and emit it from Code Connect in place of the `disabled` stand-in.

## Consumer-facing contract change

This change adds one optional prop, `loading`, and exports the `ButtonProps` type. Both are additive and backward compatible — existing call sites keep compiling and rendering unchanged.

`loading` sets `disabled` internally and renders a leading spinner. It deliberately carries no colour of its own, because Figma's Loading variant binds the same `Custom/disabled` fill and `Custom/disabled-foreground` text as every `State=Disabled` variant; the disabled treatment is what paints it and the spinner is what distinguishes it. Figma draws Loading only on the default type, so pairing `loading` with another variant falls back to that variant's disabled treatment — a consistent extrapolation rather than a designed state.

The spinner is `LoaderCircleIcon` from `lucide-react`, already a package dependency and already the source of `XIcon` in `dialog.tsx`. Figma uses Phosphor's `SpinnerGap`; the package does not depend on Phosphor and adopting it for one glyph was not worth a new dependency.

## Non-goals

No replacement for the removed `link` variant. The file publishes exactly two component sets, `Button` (`86:3459`) and `Link` (`96:341`), and `Link` is a peer on its own page rather than a Button variant: a three-tone `Type` axis (Default/Secondary/Danger) against `Base/foreground`, `Base/secondary-foreground` and `Custom/destructive-muted-foreground`, regular weight rather than medium, a resting underline, its own leading/trailing icon slots, and no fill, padding or height. The old cva `link` variant matched it on none of those and could not express its tonal axis, since `variant` is already the axis it occupies. Building `Link` as its own component is separate work.

The `Custom/*` backfill in `default.css` covers only the eleven slots the button binds, not all 22. The rest stay undefined under the baseline theme until a component needs them.

## Open decisions

| Question | Owner | Note |
| --- | --- | --- |
| **The published Button set has no Size axis.** | Design | This is a file defect, not a modelling decision. "Buttons Size Reference" (`96:546`) varies size by switching the Sizing collection's mode on each instance, and instance modes are not component properties — so no Code Connect template can read the size. Until a Size VARIANT is added to the set, the mapping has to hardcode `size="lg"`, because every variant of the set is drawn at 48px while the component default is `md`. Adding the axis is the fix; everything else here is a workaround. |
| Does `sm` need an icon-size rung of its own? | Design | The Sizing collection binds `height`, `padding-x`, `gap`, `rounded` and the type pair, but nothing for the icon. `sm` drops its glyphs to 12px by inference from its 12px text; `md` and `lg` keep the inherited 16px. |
| Figma's explicit radius scale disagrees with the derived one. | Design + Eng | The rungs use `rounded-sm` / `rounded-md`, which the preamble derives as 4.8px and 6.4px, while Figma's primitives are 4px and 6px. Left on the derived ladder rather than hardcoded, because [`resync-design-tokens-from-figma`](../resync-design-tokens-from-figma/proposal.md) already owns this decision. |
| Should `outline` keep `bg-background`? | Design | Figma binds no fill on `Outline` at rest. Absence of a bound variable is not positive evidence of transparency, so the existing `bg-background` is retained. The two differ only over a non-page surface such as a card or popover. |
| Do the `Custom/*` slots belong in the baseline `default` theme at all? | Eng | The alternative is to declare the button acetrader-only and let the stock theme render it unstyled. |
| Does this restyle need a PRD? | Product | Sharpens the same open question in the resync change, which assumed the button would move to a solid `--primary` fill. It does not — the Figma Button uses a tint. |
