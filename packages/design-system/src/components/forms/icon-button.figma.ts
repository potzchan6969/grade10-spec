// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2159-3195
// source=packages/design-system/src/components/forms/icon-button.tsx
// component=IconButton
import figma from "figma";

const instance = figma.selectedInstance;

// Only two tones exist on this set; there is no `primary` or `destructive`
// icon button in the design.
const variant = instance.getEnum("variant", {
  outline: "outline",
  ghost: "ghost",
});

// Only the two smaller rungs exist — Figma draws no 48px icon button.
const size = instance.getEnum("size", {
  sm: "sm",
  xs: "xs",
});

// Hover is a CSS pseudo-state with no prop behind it, so `state` emits nothing
// and is mapped only so the axis is accounted for.
instance.getEnum("state", {
  default: false,
  hover: false,
});

// Disabled is its own axis here, as on Button. This set has no loading state.
const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

// The icon is a bare INSTANCE_SWAP with no BOOLEAN gate — an icon button
// without its icon is not a state the design allows.
const icon = instance.getInstanceSwap("icon");
const iconCode =
  icon?.type === "INSTANCE" && icon.hasCodeConnect()
    ? icon.executeTemplate().example
    : null;

export default {
  // `outline` and `sm` are the cva defaults, so both props are omitted there.
  // The component has no visible label, so the snippet carries an aria-label
  // placeholder rather than emitting an unnamed control.
  example: figma.code`<IconButton aria-label={label}${variant === "outline" ? "" : figma.code` variant="${variant}"`}${size === "sm" ? "" : figma.code` size="${size}"`}${disabled ? figma.code` disabled` : ""}>${iconCode}</IconButton>`,
  imports: ['import { IconButton } from "@grade10/design-system"'],
  id: "icon-button",
  metadata: { nestable: true },
};
