// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6554-5962
// source=packages/design-system/src/components/overlays/dropdown-menu.tsx
// component=DropdownMenuLabel
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("label");

export default {
  example: figma.code`<DropdownMenuLabel>${label}</DropdownMenuLabel>`,
  imports: ['import { DropdownMenuLabel } from "@grade10/design-system"'],
  id: "dropdown-menu-group-label",
  metadata: { nestable: true },
};
