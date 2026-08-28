// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4969-4888
// source=packages/design-system/src/components/display/table-cell.tsx
// component=TableCell
import figma from "figma";

const instance = figma.selectedInstance;
const slot = instance.getSlot("Slot");

export default {
  example: figma.code`<TableCell>${slot}</TableCell>`,
  imports: ['import { TableCell } from "@grade10/design-system"'],
  id: "table-cell",
  metadata: { nestable: true },
};
