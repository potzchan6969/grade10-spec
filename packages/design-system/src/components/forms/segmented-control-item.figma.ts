// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2121-898
// source=packages/design-system/src/components/forms/segmented-control-item.tsx
// component=SegmentedControlItem
import figma from "figma";

const instance = figma.selectedInstance;

// `state` is interaction / selection: `hover` is CSS-only, `active` is the
// pressed toggle, `default` is resting. The map accounts for every option so
// the checker does not report an unmapped axis; only `active` emits a prop.
const pressed = instance.getEnum("state", {
  active: true,
  default: false,
  hover: false,
});

const size = instance.getEnum("size", {
  default: "default",
  sm: "sm",
});

const disabled = instance.getEnum("isDisabled", {
  false: false,
  true: true,
});

const label = instance.getString("label");

const leadingIcon = instance.getBoolean("leading")
  ? instance.getInstanceSwap("leadingIcon")
  : null;
const leadingCode =
  leadingIcon?.type === "INSTANCE" && leadingIcon.hasCodeConnect()
    ? leadingIcon.executeTemplate().example
    : null;

export default {
  example: figma.code`<SegmentedControlItem value={value}${pressed ? figma.code` pressed` : ""}${size === "default" ? "" : figma.code` size="${size}"`}${disabled ? figma.code` disabled` : ""}${leadingCode ? figma.code` leading={${leadingCode}}` : ""}>${label}</SegmentedControlItem>`,
  imports: ['import { SegmentedControlItem } from "@grade10/design-system"'],
  id: "segmented-control-item",
  metadata: { nestable: true },
};
