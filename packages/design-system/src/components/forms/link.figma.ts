// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=96-341
// source=packages/design-system/src/components/forms/link.tsx
// component=Link
import figma from "figma";

const instance = figma.selectedInstance;

// Figma and the cva agree on every option name on this axis.
const variant = instance.getEnum("variant", {
  default: "default",
  secondary: "secondary",
  error: "error",
});

// `state` is interaction only. Hover is a CSS pseudo-state with no prop behind
// it — and on this set it binds the same variables as `default` anyway, so
// emitting anything for it would be doubly wrong.
instance.getEnum("state", {
  default: false,
  hover: false,
});

// Disabled is its own axis, as on Button and Icon Button.
const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

// Rung names match the modes of Figma's Sizing collection, so `default` is the
// 16/24 link rather than a middle rung.
const size = instance.getEnum("size", {
  default: "default",
  sm: "sm",
  xs: "xs",
});

const label = instance.getString("label#96:2");

// The icon is an INSTANCE_SWAP gated by its own BOOLEAN. Resolve the swapped
// instance rather than the placeholder layer, so the mapping survives the icon
// being swapped for a different one. Note the layer is named `leading` in the
// file while the property is `trailing` and renders after the label — the
// property is what this reads.
const trailingIcon = instance.getBoolean("trailing#96:3")
  ? instance.getInstanceSwap("trailingContent#96:4")
  : null;
const trailingCode =
  trailingIcon && trailingIcon.type === "INSTANCE"
    ? trailingIcon.executeTemplate().example
    : null;

export default {
  // `default` is the cva defaultVariant for both axes, so omit each prop in
  // that case and emit what someone would actually write.
  example: figma.code`<Link href={href}${variant === "default" ? "" : figma.code` variant="${variant}"`}${size === "default" ? "" : figma.code` size="${size}"`}${disabled ? figma.code` disabled` : ""}${trailingCode ? figma.code` trailing={${trailingCode}}` : ""}>${label}</Link>`,
  imports: ['import { Link } from "@grade10/design-system"'],
  id: "link",
  metadata: { nestable: true },
};
