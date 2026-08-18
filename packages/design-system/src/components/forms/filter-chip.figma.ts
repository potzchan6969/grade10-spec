// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4313-28
// source=packages/design-system/src/components/forms/filter-chip.tsx
// component=FilterChip
import figma from "figma";

const instance = figma.selectedInstance;

const size = instance.getEnum("size", {
  md: "md",
  sm: "sm",
});

const selected = instance.getEnum("isSelected", {
  false: false,
  true: true,
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

// Hover and focus are CSS pseudo-states with no prop behind them. The map
// exists so the axis is accounted for rather than reported unmapped.
instance.getEnum("state", {
  default: false,
  hover: false,
  focus: false,
});

const label = instance.getString("label");

// `trailing` is an INSTANCE_SWAP gated by its own BOOLEAN. Resolve the swapped
// instance rather than the placeholder layer name, so the mapping survives the
// icon being swapped for a different one. filter-chip.tsx exposes a `trailing`
// prop mirroring that pair, so the snippet is emitted into its own slot rather
// than as a bare child.
const trailingIcon = instance.getBoolean("trailing")
  ? instance.getInstanceSwap("trailingContent")
  : null;
const trailingCode =
  trailingIcon?.type === "INSTANCE"
    ? trailingIcon.executeTemplate().example
    : null;

export default {
  example: figma.code`<FilterChip${size === "md" ? "" : figma.code` size="${size}"`}${selected ? figma.code` selected` : ""}${disabled ? figma.code` disabled` : ""}${trailingCode ? figma.code` trailing={${trailingCode}}` : ""}>${label}</FilterChip>`,
  imports: ['import { FilterChip } from "@grade10/design-system"'],
  id: "filter-chip",
  metadata: { nestable: true },
};
