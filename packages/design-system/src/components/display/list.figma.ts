// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=2176-4224
// source=packages/design-system/src/components/display/list.tsx
// component=List
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties — the List is a bare slot in Figma.
const items = instance.getSlot("Items");

export default {
  example: figma.code`<List>${items}</List>`,
  imports: ['import { List } from "@grade10/design-system"'],
  id: "list",
  metadata: { nestable: true },
};
