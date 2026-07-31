// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=86-3459
// source=packages/design-system/src/components/forms/button.tsx
// component=Button
import figma from "figma";

const instance = figma.selectedInstance;

// Figma names the variant axis `Type` and capitalises its options; the cva in
// button.tsx names it `variant` with lowercase keys, and calls the destructive
// one `destructive` rather than `Danger`. Every option must be listed — an
// unmapped one resolves to undefined and emits broken code.
//
// `Loading` is not a colour of its own: it binds the same `Custom/disabled`
// fill and `Custom/disabled-foreground` text as every `State=Disabled` variant.
// It therefore maps to the default variant plus the `loading` prop, which is
// what button.tsx implements — the prop sets `disabled` internally, so the
// disabled treatment is what paints it, and the spinner is what distinguishes
// it. Emitting `loading` rather than `disabled` keeps that distinction in the
// generated snippet.
const variant = instance.getEnum("Type", {
  Default: "default",
  Secondary: "secondary",
  Outline: "outline",
  Danger: "destructive",
  Ghost: "ghost",
  Loading: "default",
});
const loading = instance.getEnum("Type", {
  Default: false,
  Secondary: false,
  Outline: false,
  Danger: false,
  Ghost: false,
  Loading: true,
});

// `State` is presentational in Figma. Hover is a CSS pseudo-state with no prop
// behind it, so emitting anything for it would be wrong; only Disabled maps.
//
// `disabled` is deliberately not OR-ed with `loading`: the component derives
// that itself, so emitting both would print a redundant prop. Figma only draws
// Loading at `State=Default`, so the two cannot collide in practice anyway.
const disabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Disabled: true,
});

// The label is a TEXT component property, not a bare text layer. Its key keeps
// the `#id` suffix Figma generates and must be used verbatim — VARIANT keys
// (`Type`, `State`) are the exception and carry no suffix.
//
// `Type=Loading` is the one variant that does not honour that property: it
// hides the bound layer and shows a static "Loading" text layer instead. Read
// that layer so the snippet prints what the design prints, rather than the
// stale `Label` value the property still holds underneath.
const loadingText = instance.findText("Loading");
const label =
  loading && loadingText && loadingText.type === "TEXT"
    ? loadingText.textContent
    : instance.getString("Label#318:0");

// Each icon is an INSTANCE_SWAP gated by its own BOOLEAN. Resolve the swapped
// instance rather than the placeholder layer name, so the mapping survives the
// icon being swapped for a different one.
//
// Figma models these as two component properties; button.tsx models them as
// children carrying `data-icon="inline-start"` / `"inline-end"`, which is the
// convention badge.tsx and tabs.tsx follow too. The two models meet here: the
// resolved snippet is emitted as a child, in order, around the label.
//
// A resolved snippet cannot carry `data-icon` — `executeTemplate()` returns an
// opaque section list, not markup this template can annotate. That no longer
// costs anything: the attribute only drives padding compensation, and md and lg
// have none, because Figma binds a uniform padding-x 16 while showing an icon.
// It would matter again only if Code Connect started emitting the xs or sm
// rungs, which it cannot — Figma has no size axis to select them with.
const leadingIcon = instance.getBoolean("Show Leading Icon#175:0")
  ? instance.getInstanceSwap("Leading Icon#175:20")
  : null;
const leadingCode =
  leadingIcon && leadingIcon.type === "INSTANCE"
    ? leadingIcon.executeTemplate().example
    : null;

const trailingIcon = instance.getBoolean("Show Trailing Icon#1171:0")
  ? instance.getInstanceSwap("Trailing Icon#1171:43")
  : null;
const trailingCode =
  trailingIcon && trailingIcon.type === "INSTANCE"
    ? trailingIcon.executeTemplate().example
    : null;

export default {
  // `default` is the cva defaultVariant, so omit the prop in that case and emit
  // what someone would actually write.
  //
  // `size` is hardcoded to `lg` rather than read, and that is a workaround for
  // a gap in the Figma file rather than a modelling choice. The design does
  // define three sizes — see "Buttons Size Reference" (96:546) — but it varies
  // them by switching the Sizing collection's mode on each instance instead of
  // exposing a Size VARIANT on the component set. Instance modes are not
  // component properties, so no getEnum can reach them. Every variant of the
  // published set is drawn at 48px, which is `lg`, so `lg` is what an instance
  // of it actually is; the cva default is `md`, so the prop cannot be omitted.
  //
  // When a Size axis is added to the set, replace this with a getEnum over it
  // and drop the prop again whenever the selected rung is `md`.
  example: figma.code`<Button${variant === "default" ? "" : figma.code` variant="${variant}"`} size="lg"${loading ? figma.code` loading` : ""}${disabled ? figma.code` disabled` : ""}>${leadingCode ? figma.code`${leadingCode}` : ""}${label}${trailingCode ? figma.code`${trailingCode}` : ""}</Button>`,
  imports: ['import { Button } from "@acetrader/design-system"'],
  id: "button",
  metadata: { nestable: true },
};
