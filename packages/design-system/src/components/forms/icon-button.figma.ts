// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2159-3195
// source=packages/design-system/src/components/forms/icon-button.tsx
// component=IconButton
import figma from "figma";

const instance = figma.selectedInstance;

const variant = instance.getEnum("variant", {
  primary: "primary",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
});

// Figma draws `md` (40) and `sm` (32). `xs` is code-only and is not mapped.
const size = instance.getEnum("size", {
  md: "md",
  sm: "sm",
});

// Hover is a CSS pseudo-state with no prop behind it, so `state` emits nothing
// and is mapped only so the axis is accounted for.
instance.getEnum("state", {
  default: false,
  hover: false,
});

// The set names this axis `disabled`, not Button's `isDisabled`. An unmapped
// name is an empty attribute in Dev Mode. This set has no loading state.
const disabled = instance.getEnum("disabled", {
  false: false,
  true: true,
});

// The icon is a bare INSTANCE_SWAP with no BOOLEAN gate — an icon button
// without its icon is not a state the design allows. Do not gate on
// hasCodeConnect(): that dropped the child whenever the swapped icon had no
// published mapping, which is how Dev Mode emitted an empty IconButton.
const icon = instance.getInstanceSwap("icon");
const iconCode =
  icon?.type === "INSTANCE" ? icon.executeTemplate().example : null;

export default {
  // `outline` and `sm` are the cva defaults, so both props are omitted there.
  // The component has no visible label, so the snippet carries an aria-label
  // placeholder rather than emitting an unnamed control.
  example: figma.code`<IconButton aria-label={label}${variant === "outline" ? "" : figma.code` variant="${variant}"`}${size === "sm" ? "" : figma.code` size="${size}"`}${disabled ? figma.code` disabled` : ""}>${iconCode}</IconButton>`,
  imports: ['import { IconButton } from "@grade10/design-system"'],
  id: "icon-button",
  metadata: { nestable: true },
};
