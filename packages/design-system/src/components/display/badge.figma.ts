// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2132-2294
// source=packages/design-system/src/components/display/badge.tsx
// component=Badge
import figma from "figma";

const instance = figma.selectedInstance;

// Figma and the cva agree on every option name. `default` is the cva
// defaultVariant on both axes, so the prop is omitted for it below.
//
// Every property is addressed by its bare name. Figma suffixes non-VARIANT
// keys with `#id`, but the template runtime resolves the unsuffixed name —
// passing the suffixed key leaves the value unresolved and Dev Mode renders a
// red `Error` chip where it should have been.
const variant = instance.getEnum("variant", {
  default: "default",
  success: "success",
  error: "error",
  warning: "warning",
  brand: "brand",
  outline: "outline",
});

const size = instance.getEnum("size", {
  default: "default",
  sm: "sm",
});

const label = instance.getString("label");

// The icon is an INSTANCE_SWAP gated by its own BOOLEAN. Resolve the swapped
// instance rather than the placeholder layer, so the mapping survives the icon
// being swapped for a different one. Badge takes it as a child — there is no
// dedicated slot prop — so it is emitted before the label.
//
// `hasCodeConnect()` gates the call: the Phosphor icon sets are not connected,
// and executing an unconnected instance's template emits an error section.
const leadingIcon = instance.getBoolean("leading")
  ? instance.getInstanceSwap("leadingIcon")
  : null;
const leadingCode =
  leadingIcon?.type === "INSTANCE" && leadingIcon.hasCodeConnect()
    ? leadingIcon.executeTemplate().example
    : null;

export default {
  example: figma.code`<Badge${variant === "default" ? "" : figma.code` variant="${variant}"`}${size === "default" ? "" : figma.code` size="${size}"`}>${leadingCode ? figma.code`${leadingCode}` : ""}${label}</Badge>`,
  imports: ['import { Badge } from "@grade10/design-system"'],
  id: "badge",
  metadata: { nestable: true },
};
