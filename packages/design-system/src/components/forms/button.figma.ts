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
// `Loading` has no code counterpart: button.tsx has no loading prop and the
// package ships no Spinner, though the Figma variant swaps in a SpinnerGap
// icon and a "Loading" label. It maps to the default variant plus `disabled`,
// the closest honest representation of a non-interactive button. Revisit if a
// loading affordance lands in code.
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
const stateDisabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Disabled: true,
});
const disabled = stateDisabled || loading;

// The label is a TEXT component property, not a bare text layer. Its key keeps
// the `#id` suffix Figma generates and must be used verbatim — VARIANT keys
// (`Type`, `State`) are the exception and carry no suffix.
const label = instance.getString("Label#318:0");

// Each icon is an INSTANCE_SWAP gated by its own BOOLEAN. Resolve the swapped
// instance rather than the placeholder layer name, so the mapping survives the
// icon being swapped for a different one.
//
// Caveat: button.tsx keys its icon padding off `data-icon="inline-start"` /
// `"inline-end"` on the child. A resolved icon snippet arrives without that
// attribute, so if the icon library gains Code Connect the emitted child will
// need it for those cva selectors to fire. Today no icon is connected, so
// nothing is emitted and the question is moot.
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
  // what someone would actually write. Figma has no size axis, so `size` is
  // never emitted and falls back to the cva default (md) — the cva's xs, lg,
  // and icon-* sizes have no Figma counterpart to map from.
  example: figma.code`<Button${variant === "default" ? "" : figma.code` variant="${variant}"`}${disabled ? figma.code` disabled` : ""}>${leadingCode ? figma.code`${leadingCode}` : ""}${label}${trailingCode ? figma.code`${trailingCode}` : ""}</Button>`,
  imports: ['import { Button } from "@acetrader/design-system"'],
  id: "button",
  metadata: { nestable: true },
};
