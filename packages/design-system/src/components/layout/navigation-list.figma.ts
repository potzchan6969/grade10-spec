// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4343-16418
// source=packages/design-system/src/components/layout/navigation-list.tsx
// component=NavigationList
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties — the list is a bare slot in Figma.
const items = instance.getSlot("Slot");

export default {
  example: figma.code`<NavigationList>${items}</NavigationList>`,
  imports: ['import { NavigationList } from "@grade10/design-system"'],
  id: "navigation-list",
  metadata: { nestable: true },
};
