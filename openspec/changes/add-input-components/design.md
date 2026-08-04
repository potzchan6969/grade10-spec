# Design

## Values, read from Figma

Resolved from the default variant of each set rather than from variable names, so these are what a viewer sees.

| Part | Value | Token | Utility |
| --- | --- | --- | --- |
| Root stack | vertical, gap 8 | `Gap/gap-2` | `flex flex-col gap-2` |
| Field box height | 32 | `Size/size-8` | `h-8` |
| Field box padding-x | 12 | `Gap/gap-3` | `px-3` |
| Field box gap | 8 | `Gap/gap-2` | `gap-2` |
| Field box radius | 4 | `Radius/radius-sm` | `rounded-(--radius-sm)` |
| Field box border | 1px | `Base/border` | `border border-border` |
| Field box fill | `#f9f9f91a` | `Base/input` | `bg-input` |
| Label | 14/20 regular | `Base/secondary-foreground` | `text-sm text-secondary-foreground` |
| Value | 14/20 regular | `Base/foreground` | `text-sm text-foreground` |
| Unit (Number only) | 14/20 regular | `Base/secondary-foreground` | `text-sm text-secondary-foreground` |
| Message | 12/16 regular | tone follows status | `text-xs` |
| Icons | 16 | — | `size-4` |

`rounded-(--radius-sm)` binds the Foundation primitive directly rather than using `rounded-sm`, for the reason already recorded in `button.tsx`, `badge.tsx` and `icon-button.tsx`: `theme.preamble.css` derives the radius scale proportionally from `--radius`, so `rounded-sm` compiles to `calc(--radius * 0.6)` = 4.8px against Figma's 4px.

## Status, the one axis

| `status` | Field border | Message tone | Trailing icon |
| --- | --- | --- | --- |
| `default` | `Base/border` → `border-border` | `Base/secondary-foreground` | none |
| `error` | `Custom/destructive-ring` → `border-destructive-ring` | `Status/destructive-foreground` | `WarningCircle` |
| `success` | `Custom/success-ring` → `border-success-ring` | `Status/success-foreground` | `CheckCircle` |

Focus is `focus-within:border-ring`, and it wins over the status border on every status — the rule agreed with design when the Figma grid was filled, recorded in [`sync-components-with-figma-library`](../sync-components-with-figma-library/tasks.md).

Disabled overrides all of it: label, value, unit, message and the status icon take `Custom/disabled-foreground` (`text-disabled-foreground`) and the border returns to `border-border`. `loading` puts the spinner in the trailing slot, replacing the status icon or the clear button, and keeps the message tone.

Icons come from `lucide-react` — already a dependency, and the precedent `adopt-figma-button-styling` set when it used `LoaderCircleIcon` rather than adding Phosphor for one glyph. `CircleAlertIcon`, `CircleCheckIcon`, `LoaderCircleIcon`, `SearchIcon`, `XIcon`.

## `InputShell`

The shell owns everything the three sets share. It is exported so the three components in this package compose it, and because a consumer building a field type the design has not drawn yet is better served composing the shell than reimplementing the box.

```tsx
type InputShellProps = {
  /** Rendered above the field. Its presence is Figma's `showLabel`. */
  label?: ReactNode;
  /** Rendered below the field, toned by `status`. Figma's `message`. */
  message?: ReactNode;
  status?: "default" | "error" | "success";
  disabled?: boolean;
  /** Content before the control — the search magnifier. */
  leading?: ReactNode;
  /** Content after the control — status icon, clear button, or spinner. */
  trailing?: ReactNode;
  /** The control itself. */
  children: ReactNode;
  /** Ties the label and message to the control. */
  htmlFor?: string;
  describedBy?: string;
};
```

`status` is the cva axis; `disabled` and `loading` are gates, per the proposal's axis table.

### Accessibility

The shell generates an id with `useId` when the consumer supplies none, and wires `htmlFor` on the label and `aria-describedby` on the control to the message. `status="error"` sets `aria-invalid`. This is internal presentation state — the shell holds no product state, acquires nothing, and subscribes to nothing, which keeps it inside the contract in [`ui-component-contracts.md`](../../specs/ui-component-contracts.md).

## The three components

```tsx
type TextInputProps = Omit<ComponentProps<"input">, "size"> & {
  label?: ReactNode;
  message?: ReactNode;
  status?: "default" | "error" | "success";
  loading?: boolean;
};

type NumberInputProps = TextInputProps & {
  /** Trailing unit — Figma's `unit` TEXT property. */
  unit?: string;
  /** Presence renders the clear button; Figma's `clear` BOOLEAN. */
  onClear?: () => void;
};

type TextInputSearchProps = Omit<ComponentProps<"input">, "size"> & {
  label?: ReactNode;
  onClear?: () => void;
};
```

`TextInputSearch` takes no `status`, `message` or `loading` because its Figma set has none. That is the open question in the proposal, not an omission here: a component may not offer what the design does not define.

`disabled` is the native attribute in all three, so Figma's `isDisabled` needs no prop of its own.

## Code Connect templates

One per set, each with a `getEnum` covering every option of every VARIANT property — an unmapped option resolves to `undefined` and emits broken code.

| Figma property | Template |
| --- | --- |
| `status` | `getEnum("status", { default: "default", placeholder: "default", error: "error", success: "success" })` — `placeholder` collapses onto `default`, since it is an empty value rather than a prop |
| `state` | `getEnum("state", { default: false, focus: false })` — produces no strings, so the checker reads it as a non-variant prop rather than a broken axis |
| `isDisabled` | `getEnum("isDisabled", { false: false, true: true })` → `disabled` |
| `isLoading` | `getEnum("isLoading", { false: false, true: true })` → `loading` |
| `label` / `value` / `message` / `unit` | `getString` with the `#id`-suffixed keys, verbatim |
| `showLabel` | gates whether `label=` is emitted at all |
| `clear` | gates whether `onClear=` is emitted |

`status=placeholder → "default"` is the one mapping worth arguing about: it makes the template emit `<TextInput />` for both `default` and `placeholder`, which is correct — the two differ only by whether `value` is set, and Dev Mode should not print a `status="placeholder"` prop the component does not have.

## Stories

The `contracts` vitest project reads the option list out of the cva itself, so `status` needs one story per option: `Default`, `Error`, `Success`. Plus `Disabled`, `Loading`, `WithoutLabel`, `WithoutMessage`, and per component `WithUnit` / `WithClear` / `Search`. A story exported as `Error` shadows the global — `badge.stories.tsx` hit this and renamed to `ErrorStatus`; do the same.

Stories render the `default` theme, so they exercise the baseline values backfilled below, not the acetrader ones. Review the real thing with the Storybook theme switched over.

## Validation

- `pnpm run tokens:build` after the preamble gains the two `--color-*` slots; commit the regenerated `theme.css`.
- `pnpm run check:design-system` with a `FIGMA_TOKEN`. All three sets should resolve to a code component and every axis should map. The value check compares the field box only at the base of each axis, so the 32px height, 12px padding and 4px radius are covered and the message tone is not.
- `pnpm --filter @acetrader/design-system exec vitest run --project contracts` for story coverage of the `status` options.
- `pnpm run typecheck` and `pnpm run lint`.
