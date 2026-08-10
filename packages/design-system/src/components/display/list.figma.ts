// url=https://www.figma.com/design/jlrBVwtKcun1NnJgohmFcn/Sean-x-Constance?node-id=2176-4224
// source=packages/design-system/src/components/display/list.tsx
// component=List
import figma from "figma";

const instance = figma.selectedInstance;

// No VARIANT properties — the List is a bare slot in Figma.
const items = instance.getSlot("Items#2176:187");

export default {
  example: figma.code`<List>${items}</List>`,
  imports: ['import { List } from "@grade10/design-system"'],
  id: "list",
  metadata: { nestable: true },
};
