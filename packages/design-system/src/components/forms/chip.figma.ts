// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4396-5319
// source=packages/design-system/src/components/forms/chip.tsx
// component=Chip
import figma from "figma";

const instance = figma.selectedInstance;

// Hover is a CSS pseudo-state with no prop behind it. The map exists so the
// axis is accounted for rather than reported unmapped.
instance.getEnum("state", {
  default: false,
  hover: false,
});

const label = instance.getString("label");

export default {
  example: figma.code`<Chip>${label}</Chip>`,
  imports: ['import { Chip } from "@grade10/design-system"'],
  id: "chip",
  metadata: { nestable: true },
};
