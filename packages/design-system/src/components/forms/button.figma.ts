// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=86-3459
// source=packages/design-system/src/components/forms/button.tsx
// component=Button
//
// DO NOT PUBLISH until the `waGnoyIaXEId620TLen42o` branch merges into the file
// named above. This template is written against the restructured set that lives
// on that branch — `Size` as a VARIANT, and `Loading` as a `State` rather than a
// `Type`. The parent file still has the old shape, where `getEnum("Size", …)`
// names a property that does not exist and `getEnum("State", …)` names a
// `Loading` option that does not exist. The url is deliberately left pointing at
// the parent rather than the branch, because a branch key is transient.
import figma from "figma";

const instance = figma.selectedInstance;

// Figma names the variant axis `Type` and capitalises its options; the cva in
// button.tsx names it `variant` with lowercase keys, and calls the destructive
// one `destructive` rather than `Danger`. Every option must be listed — an
// unmapped one resolves to undefined and emits broken code.
const variant = instance.getEnum("Type", {
  Default: "default",
  Secondary: "secondary",
  Outline: "outline",
  Danger: "destructive",
  Ghost: "ghost",
});

// `State` carries both non-interactive states. Hover is a CSS pseudo-state with
// no prop behind it, so emitting anything for it would be wrong.
//
// `disabled` is deliberately not OR-ed with `loading`: the component derives
// that itself, so emitting both would print a redundant prop.
const disabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Disabled: true,
  Loading: false,
});
const loading = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Disabled: false,
  Loading: true,
});

// Rung names match the modes of Figma's Sizing collection, so `default` is the
// 48px button rather than a middle rung. It is also the cva default, so the
// prop is omitted for it and emitted for the other two.
const size = instance.getEnum("Size", {
  default: "default",
  sm: "sm",
  xs: "xs",
});

// The label is a TEXT component property, not a bare text layer. Its key keeps
// the `#id` suffix Figma generates and must be used verbatim — VARIANT keys
// (`Type`, `State`, `Size`) are the exception and carry no suffix.
const label = instance.getString("Label#318:0");

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
  !loading && instance.getBoolean("Show Leading Icon#175:0")
    ? instance.getInstanceSwap("Leading Icon#175:20")
    : null;
const leadingCode =
  leadingIcon && leadingIcon.type === "INSTANCE"
    ? leadingIcon.executeTemplate().example
    : null;

const trailingIcon =
  !loading && instance.getBoolean("Show Trailing Icon#1171:0")
    ? instance.getInstanceSwap("Trailing Icon#1171:43")
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
