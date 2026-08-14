// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2132-1693
// source=packages/design-system/src/components/overlays/dropdown-menu.tsx
// component=DropdownMenuContent
import figma from "figma";

const instance = figma.selectedInstance;

const items = instance.getSlot("Items");

export default {
  example: figma.code`<DropdownMenuContent>${items}</DropdownMenuContent>`,
  imports: ['import { DropdownMenuContent } from "@grade10/design-system"'],
  id: "dropdown-menu",
  metadata: { nestable: true },
};
