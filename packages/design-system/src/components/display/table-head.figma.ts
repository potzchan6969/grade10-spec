// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4969-4912
// source=packages/design-system/src/components/display/table-head.tsx
// component=TableHead
import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.getString("label");
const slot = instance.getSlot("Slot");

export default {
  example: slot
    ? figma.code`<TableHead>${slot}</TableHead>`
    : figma.code`<TableHead>${label}</TableHead>`,
  imports: ['import { TableHead } from "@grade10/design-system"'],
  id: "table-head",
  metadata: { nestable: true },
};
