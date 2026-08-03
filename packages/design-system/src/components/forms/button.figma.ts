// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=86-3459
// source=packages/design-system/src/components/forms/button.tsx
// component=Button
//
// The `waGnoyIaXEId620TLen42o` restructure has landed in the file named above:
// the set now carries `variant`, `state`, and `size` as VARIANT properties over
// a complete 5x4x3 cross-product, with `loading` a `state` rather than a
// `variant`. It landed with lowercase property and option names, so every key
// below is lowercase — Figma's names, not the capitalised ones the pre-merge
// shape used.
import figma from "figma";

const instance = figma.selectedInstance;

// Figma and the cva agree on the axis name (`variant`) and on four of the five
// options. They differ on the base one: Figma draws it as `primary`, the cva
// calls it `default` because it is the cva's defaultVariant. Every option must
// be listed — an unmapped one resolves to undefined and emits broken code.
const variant = instance.getEnum("variant", {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  destructive: "destructive",
  ghost: "ghost",
});

// `state` carries both non-interactive states. Hover is a CSS pseudo-state with
// no prop behind it, so emitting anything for it would be wrong.
//
// `disabled` is deliberately not OR-ed with `loading`: the component derives
// that itself, so emitting both would print a redundant prop.
const disabled = instance.getEnum("state", {
  default: false,
  hover: false,
  disabled: true,
  loading: false,
});
const loading = instance.getEnum("state", {
  default: false,
  hover: false,
  disabled: false,
  loading: true,
});

// Rung names match the modes of Figma's Sizing collection, so `default` is the
// 48px button rather than a middle rung. It is also the cva default, so the
// prop is omitted for it and emitted for the other two.
const size = instance.getEnum("size", {
  default: "default",
  sm: "sm",
  xs: "xs",
});

// The label is a TEXT component property, not a bare text layer. Its key keeps
// the `#id` suffix Figma generates and must be used verbatim — VARIANT keys
// (`variant`, `state`, `size`) are the exception and carry no suffix.
const label = instance.getString("label#318:0");

// Each icon is an INSTANCE_SWAP gated by its own BOOLEAN. Resolve the swapped
// instance rather than the placeholder layer name, so the mapping survives the
// icon being swapped for a different one.
//
// button.tsx exposes `leading` and `trailing` props mirroring these two
// properties, so each resolved snippet is emitted into its own slot rather than
// as a bare child. That makes the emitted order unrepresentable-if-wrong, which
// children could not guarantee.
//
// Neither is emitted while loading. The component gives the leading slot to the
// spinner and drops `trailing`, matching the Figma loading variants, which carry
// a spinner and a label and no trailing icon — so emitting either would print a
// prop the component ignores.
const leadingIcon =
  !loading && instance.getBoolean("leading#175:0")
    ? instance.getInstanceSwap("leadingContent#175:20")
    : null;
const leadingCode =
  leadingIcon && leadingIcon.type === "INSTANCE"
    ? leadingIcon.executeTemplate().example
    : null;

const trailingIcon =
  !loading && instance.getBoolean("trailing#1171:0")
    ? instance.getInstanceSwap("trailingContent#1171:43")
    : null;
const trailingCode =
  trailingIcon && trailingIcon.type === "INSTANCE"
    ? trailingIcon.executeTemplate().example
    : null;

export default {
  // `default` is the cva defaultVariant for both axes, so omit each prop in that
  // case and emit what someone would actually write.
  example: figma.code`<Button${variant === "default" ? "" : figma.code` variant="${variant}"`}${size === "default" ? "" : figma.code` size="${size}"`}${loading ? figma.code` loading` : ""}${disabled ? figma.code` disabled` : ""}${leadingCode ? figma.code` leading={${leadingCode}}` : ""}${trailingCode ? figma.code` trailing={${trailingCode}}` : ""}>${label}</Button>`,
  imports: ['import { Button } from "@acetrader/design-system"'],
  id: "button",
  metadata: { nestable: true },
};
