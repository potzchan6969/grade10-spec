// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2121-1039
// source=packages/design-system/src/components/forms/segmented-control.tsx
// component=SegmentedControl
import figma from "figma";

const instance = figma.selectedInstance;

const size = instance.getEnum("size", {
  default: "default",
  sm: "sm",
});

const items = instance.getSlot("controlItems");

export default {
  example: figma.code`<SegmentedControl${size === "default" ? "" : figma.code` size="${size}"`}>${items}</SegmentedControl>`,
  imports: ['import { SegmentedControl } from "@grade10/design-system"'],
  id: "segmented-control",
  metadata: { nestable: true },
};
