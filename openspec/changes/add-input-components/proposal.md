# Add the input family

PRD: Not applicable. This is the component-side half of a designer decision already recorded in Figma, in the same sense as [`adopt-figma-button-styling`](../adopt-figma-button-styling/proposal.md). The Figma Input page (`jlrBVwtKcun1NnJgohmFcn`, page `2132:2521`) was normalised onto the file's four-axis shape in [`sync-components-with-figma-library`](../sync-components-with-figma-library/tasks.md); this change builds the code side of it.

## Why

`packages/design-system/src/components/forms/input.tsx` is untouched stock shadcn. It matches the Figma Input page on nothing:

| | `input.tsx` today | Figma |
| --- | --- | --- |
| Height | `h-8` (32px) | 32px — the one thing that agrees |
| Radius | `rounded-lg` (8px) | `Radius/radius-sm` (4px) |
| Fill | `bg-transparent`, `dark:bg-input/30` | `Base/input` (`#f9f9f91a`) |
| Border | `border-input` | `Base/border` at rest, `Base/ring` on focus |
| Label | none | a TEXT property on every set, 14/20 `Base/secondary-foreground` |
| Message | none | a TEXT property, 12/16, tone follows status |
| Status | `aria-invalid` only | `default` / `error` / `success`, each with its own ring and message tone |

So the package has no component that renders what the design draws, and the three published sets — `Text Input` (`2132:2715`), `Number Input` (`2176:4273`), `Text Input Search` (`2132:2782`) — all report "no code component" under `check:design-system`.

## Scope

Three exported components and one shared shell:

| Figma set | File | Export |
| --- | --- | --- |
| `Text Input` (`2132:2715`) | `forms/text-input.tsx` | `TextInput` |
| `Number Input` (`2176:4273`) | `forms/number-input.tsx` | `NumberInput` |
| `Text Input Search` (`2132:2782`) | `forms/text-input-search.tsx` | `SearchInput` |
| — | `forms/input.tsx` | `Input` (bare control) + `InputShell` (label / field box / message) |

### Why three files and not one component

Mechanical: `check-components.mjs` resolves a Figma `COMPONENT_SET` to `src/components/**/<normalised-name>.tsx`. Three sets need three basenames or each stays a warning. This is the same reason `radio-button.tsx` and `radio-list-item.tsx` are separate files.

Contractual: the prop surfaces are disjoint. `unit` is meaningless on search, `message` and `isLoading` do not exist on the search set at all, and `clear` does not exist on `Text Input`. One component carrying all of them ships mutually exclusive props, which is the same defect as a code-only variant with a different spelling.

### Why it is smaller than four axes suggests

Of the four VARIANT axes each set now carries, exactly one is a prop:

| Figma axis | In code | Reason |
| --- | --- | --- |
| `state` (`default` \| `focus`) | no prop | A CSS pseudo-state, handled by `focus-within:`. The same call `button.figma.ts` and `link.figma.ts` already make for `hover`. |
| `status=placeholder` | no prop | Not a choice a consumer makes — it is what an empty field looks like. Emergent from `value`, styled with `placeholder:`. |
| `isDisabled` | native `disabled` | An `<input>` attribute; nothing to add. |
| `isLoading` | `loading` boolean | A boolean gate, not a cva axis — as on `Button`. |
| `status` (`default` \| `error` \| `success`) | **the one cva axis** | Drives the field ring and the message tone. |

So each component is a label, a field box, a control, an optional trailing slot and a message, over a single three-option axis. What is identical across all three sets in Figma — the ring tones, the vertical rhythm, the disabled greying, the trailing slot — becomes `InputShell`, and each component is thin.

## Blocking prerequisite: two missing Tailwind colour slots

Found while scoping this change, and it is not specific to it.

`--color-destructive-foreground` is defined in neither `theme.preamble.css` nor the generated `theme.css`, so the utility `text-destructive-foreground` does not exist. Three shipped primitives use it anyway — `button.tsx:21` (`destructive`), `link.tsx:18` (`error`) and `badge.tsx:17` (`error`) — and all three render an inherited colour instead of the intended one, under both themes. `--color-success-ring` is missing the same way, and the input `success` ring needs it.

The variables themselves exist in `tokens.json` and reach `.theme-acetrader`; it is the engineer-owned `@theme` mapping in the preamble that omits them. Both must be added and `pnpm tokens:build` re-run before the input `error` and `success` statuses can bind anything. Fixing it also repairs the three components above, which is a visible change to `Button`, `Link` and `Badge` that this change should not smuggle in — see Non-goals.

## Theme coverage

`--destructive-foreground` and `--success-ring` exist only in `src/themes/acetrader.css`; `src/themes/default.css` defines neither. Per the theme-coverage rule in [`design-code-sync.md`](../../../docs/governance/design-code-sync.md), a component binding them renders with an undefined custom property under the baseline theme — and the Storybook suite renders `default`, so the error and success statuses would look unstyled in exactly the place they get reviewed. Both need a derived baseline value in `:root` and `.dark`.

## Consumer impact

Three new exports, additive. One breaking change:

`Input` stops being a self-contained bordered box. The box moves to `InputShell`, which owns the fill, border, radius, height and padding, and `Input` becomes the bare control that sits inside it — no border, no background, no height of its own. Any consumer rendering `<Input />` standalone gets an unstyled field and must move to `TextInput`, or wrap it themselves.

The alternative — leaving `Input` as it is and having the shell wrap a plain `<input>` — keeps a component in the public API that matches nothing any designer drew, which is the surface `design-code-sync.md` names as the thing not to keep. Recorded as an open decision rather than settled here.

## Non-goals

- **No fix to `Button`, `Link` or `Badge` in this change.** The missing colour slots must be repaired first, in their own change, because that repair alters three shipped primitives' rendered output and deserves its own review. This change depends on it and does not contain it.
- No `Label` rework. Figma models the label as a TEXT property inside each input set, not as a component, so `Label` remains a code-only surface. Whether it should stay exported is out of scope.
- No form-level concerns: no validation, no field arrays, no controlled/uncontrolled state management. Status and message are told to the component, never derived by it.
- No `Segmented Control`, `Checkbox` or `Table` work, which are separate entries in the missing-component list.

## Open decisions

| Question | Owner | Note |
| --- | --- | --- |
| `Text Input Search` has no error or success. | Design | Its tonal axis is `type` with `default` \| `placeholder` only, so a search field cannot show an invalid state. That reads like a gap rather than a decision. Code will not offer what Figma does not draw, so if it is a gap, the Figma set needs the axis before the code can. |
| Should `Input` stay exported once the box moves to the shell? | Eng | Keeping it means a public component with no Figma counterpart. Removing it is a second breaking change on top of the restyle. |
| Should the Figma set be renamed to `Search Input`? | Design | Settled for code: the export is `SearchInput`. The **file** cannot follow — `check-components.mjs` resolves a set by normalising its Figma name, so `Text Input Search` looks for `textinputsearch.tsx` and `search-input.tsx` would report "no code component". So `forms/text-input-search.tsx` keeps the Figma name while exporting `SearchInput`. Renaming the set to `Search Input` is the one move that lets file, export and design all agree; it is safe for existing instances, which reference a component by key rather than by name. |
| Should the clear button be a `clear` boolean or an `onClear` callback? | Eng | Figma models it as a BOOLEAN. A boolean alone cannot clear anything, so the proposal is `onClear`, with presence gating the button — the same "presence of a value rather than its own boolean" pattern `list-item.figma.ts` already uses. |
| Does `unit` belong to `NumberInput` as a string prop? | Design | Figma models it as TEXT. A string prop matches, but a `ReactNode` would allow a currency glyph or a small select. |
